
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';
import TurndownService from 'turndown';
// @ts-ignore
import { gfm } from 'turndown-plugin-gfm';

export async function POST(req: NextRequest) {
    try {
        const { url } = await req.json();

        if (!url) {
            return NextResponse.json({ error: 'URL is required' }, { status: 400 });
        }

        // 1. Fetch HTML
        // Simulate a real browser to avoid 403 Forbidden
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
                'Cache-Control': 'no-cache',
                'Upgrade-Insecure-Requests': '1',
            },
            timeout: 15000 // 15s timeout
        });

        const html = response.data;
        const $ = cheerio.load(html);
        const domain = new URL(url).hostname;

        let title = $('title').text().trim();
        let contentHtml = '';

        console.log(`Processing URL: ${url}, Domain: ${domain}`);

        // 2. Platform Specific Extraction
        if (domain.includes('mp.weixin.qq.com')) {
            const content = $('#js_content').length ? $('#js_content') : $('#img-content');
            title = $('#activity-name').text().trim() || title;

            if (content.length === 0) {
                console.warn('WeChat content not found with selectors');
            }

            // Fix lazy loaded images
            content.find('img').each((_, el) => {
                const $el = $(el);
                const dataSrc = $el.attr('data-src');
                if (dataSrc) {
                    $el.attr('src', dataSrc);
                    $el.removeAttr('data-src');
                }
                $el.css('visibility', 'visible');
                $el.css('opacity', '1');
            });
            contentHtml = content.html() || '';

        } else if (domain.includes('blog.csdn.net')) {
            const content = $('#content_views');
            title = $('#articleContentId').text().trim() || title;

            // Remove specific CSDN noise
            content.find('.toblog-vip-column-message').remove();
            content.find('.recommend-box').remove();

            // Clean code blocks (remove line numbers and copy buttons)
            content.find('pre').each((_, el) => {
                const $pre = $(el);
                $pre.find('.pre-numbering').remove();
                $pre.find('.hljs-button').remove();
                $pre.find('.idx-num').remove();
            });

            contentHtml = content.html() || '';

        } else if (domain.includes('juejin.cn')) {
            // Juejin often renders content dynamically, but for SEO it usually has static HTML in .markdown-body or article
            const content = $('.markdown-body').length ? $('.markdown-body') : $('article');
            title = $('.article-title').text().trim() || title;

            // Juejin specific cleaning
            content.find('style').remove();
            content.find('.copy-code-btn').remove();

            contentHtml = content.html() || '';

        } else if (domain.includes('nowcoder.com')) {
            const content = $('.nc-post-content');
            title = $('.post-title').text().trim() || title;

            // Remove specific Nowcoder noise
            content.find('.company-banner').remove();
            content.find('.post-topic-des').remove();

            contentHtml = content.html() || '';

        } else if (domain.includes('pubmed.ncbi.nlm.nih.gov')) {
            // PubMed article page
            title = $('h1.heading-title').text().trim() || title;

            // Build article metadata block
            const authorList = $('.authors-list').text().trim();
            const journalInfo = $('.article-source').text().trim();
            const pmid = $('.current-id').text().trim() || url.match(/\/([0-9]+)\/?$/)?.[1] || '';

            // Abstract
            const abstractDiv = $('#abstract');
            abstractDiv.find('.abstract-label').each((_: number, el: any) => {
                $(el).before('\n\n#### ');
            });

            // Conflict/Copyright
            const conflictDiv = $('#conflict-of-interest');
            const copyrightDiv = $('.copyright');

            // Compose a structured HTML for conversion
            let composed = `<h2>${title}</h2>`;
            if (authorList) composed += `<p><strong>Authors:</strong> ${authorList}</p>`;
            if (journalInfo) composed += `<p><strong>Source:</strong> ${journalInfo}</p>`;
            if (pmid) composed += `<p><strong>PMID:</strong> ${pmid}</p>`;
            if (abstractDiv.length) composed += `<h3>Abstract</h3>` + (abstractDiv.html() || '');
            if (conflictDiv.length) composed += `<h3>Conflict of Interest</h3>` + (conflictDiv.html() || '');
            if (copyrightDiv.length) composed += (copyrightDiv.html() || '');

            contentHtml = composed;

        } else if (domain.includes('ncbi.nlm.nih.gov')) {
            // NCBI GEO and other NCBI pages
            const isGeo = url.includes('/geo/');

            if (isGeo) {
                // GEO DataSet / Series page
                title = $('h2').first().text().trim() || $('#rptt').text().trim() || title;

                const mainContent = $('#maincontent').length ? $('#maincontent') : $('.rprt');

                // Remove navigation and sidebars
                mainContent.find('.breadcrumb').remove();
                mainContent.find('#sidebar').remove();
                mainContent.find('.portlet_content .portlet_actions').remove();
                mainContent.find('.search_results_footer').remove();
                mainContent.find('#nc_breadcrumb').remove();

                contentHtml = mainContent.html() || $('body').html() || '';
            } else {
                // Generic NCBI page (PubMed search, etc.)
                const mainContent = $('#maincontent').length ? $('#maincontent') : $('main');
                title = $('h1').first().text().trim() || title;
                mainContent.find('nav, .breadcrumb, #sidebar, footer').remove();
                contentHtml = mainContent.html() || '';
            }

        } else {
            // Fallback for unknown domains
            contentHtml = $('article').html() || $('main').html() || ''; // Try common article/main tags first
        }

        // 2.5 Fallback Strategy
        // If specific selectors failed or returned very little, try to get the whole body
        if (!contentHtml || contentHtml.trim().length < 100) {
            console.warn(`Specific selector failed for ${domain}, using body fallback.`);
            const $body = $('body');
            // Remove common non-content elements from the body
            $body.find('script, style, noscript, iframe, svg, header, footer, nav, form, aside, .sidebar, .ad, .ads, #header, #footer, #nav, #sidebar').remove();
            contentHtml = $body.html() || '';
        }

        // 3. General Cleanup
        if (!contentHtml) {
            // Extremely unlikely to happen now, but good for safety
            return NextResponse.json({ error: 'Could not extract content from this URL' }, { status: 422 });
        }

        // Load the selected content into a new Cheerio instance for final cleaning
        const $clean = cheerio.load(contentHtml);
        $clean('script').remove();
        $clean('style').remove();
        $clean('iframe').remove();
        $clean('noscript').remove();
        $clean('svg').remove(); // Often used for icons, not needed in MD

        // Convert back to string
        const finalHtml = $clean.html();

        // 4. Convert to Markdown
        const turndownService = new TurndownService({
            headingStyle: 'atx',
            codeBlockStyle: 'fenced',
            hr: '---',
            bulletListMarker: '-',
            emDelimiter: '*'
        });

        // Use GFM plugin for tables and task lists
        if (gfm) turndownService.use(gfm);

        // Add rule to better handle images (ensure they are on their own line)
        turndownService.addRule('images', {
            filter: 'img',
            replacement: function (content, node) {
                const alt = (node as any).alt || '';
                const src = (node as any).getAttribute('src') || '';
                const title = (node as any).title || '';

                // Strict Image Validation
                // 1. Must exist
                // 2. Must start with http:// or https:// (ignore data:image, blob:, file:, relative paths)
                if (!src || !/^https?:\/\//i.test(src)) {
                    return ''; // Ignore this image completely
                }

                return `\n![${alt}](${src}${title ? ` "${title}"` : ''})\n`;
            }
        });

        const markdown = turndownService.turndown(finalHtml || '');

        return NextResponse.json({
            title,
            content: markdown
        });

    } catch (error: any) {
        console.error('Parse error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to parse URL' },
            { status: 500 }
        );
    }
}
