import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import JSZip from 'jszip';

export async function POST(req: NextRequest) {
    try {
        const { markdown, title, format } = await req.json();

        if (!markdown) {
            return NextResponse.json({ error: 'Markdown 内容不能为空' }, { status: 400 });
        }

        const safeTitle = (title || '文章').replace(/[\\/:*?"<>|]/g, '_');
        const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
        const imageMap = new Map<string, string>();
        const imageUrls: string[] = [];
        let match;

        while ((match = imageRegex.exec(markdown)) !== null) {
            const url = match[2].trim();
            if (!url.startsWith('http://') && !url.startsWith('https://')) continue;
            if (!imageMap.has(url)) {
                const urlObj = new URL(url);
                let filename = urlObj.pathname.split('/').pop() || 'image';
                // Ensure filename has extension
                if (!filename.includes('.')) filename += '.png';
                // Handle duplicate filenames
                let uniqueFilename = filename;
                let counter = 1;
                while (imageMap.get(url) === undefined && [...imageMap.values()].includes(uniqueFilename)) {
                    const dotIdx = filename.lastIndexOf('.');
                    uniqueFilename = dotIdx > 0
                        ? `${filename.slice(0, dotIdx)}_${counter}${filename.slice(dotIdx)}`
                        : `${filename}_${counter}`;
                    counter++;
                }
                imageMap.set(url, uniqueFilename);
                imageUrls.push(url);
            }
        }

        const zip = new JSZip();
        const imageFolder = zip.folder(`图片/${safeTitle}`);

        // Download all images in parallel
        const downloadTasks = imageUrls.map(async (url) => {
            try {
                const response = await axios.get(url, {
                    responseType: 'arraybuffer',
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                        'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
                        'Referer': new URL(url).origin,
                    },
                    timeout: 15000,
                });
                const filename = imageMap.get(url) || 'image.png';
                imageFolder?.file(filename, Buffer.from(response.data));
            } catch (err) {
                console.warn(`Failed to download image: ${url}`, err);
            }
        });

        await Promise.all(downloadTasks);

        // Replace image references in markdown
        let updatedMarkdown = markdown;
        if (format === 'obsidian') {
            updatedMarkdown = updatedMarkdown.replace(imageRegex, (match: string, alt: string, url: string) => {
                const filename = imageMap.get(url.trim());
                if (!filename) return match;
                return `![[${filename}]]`;
            });
        } else {
            updatedMarkdown = updatedMarkdown.replace(imageRegex, (match: string, alt: string, url: string) => {
                const filename = imageMap.get(url.trim());
                if (!filename) return match;
                return `![${alt}](图片/${safeTitle}/${filename})`;
            });
        }

        zip.file(`${safeTitle}.md`, updatedMarkdown);

        const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });

        return new NextResponse(new Uint8Array(zipBuffer), {
            headers: {
                'Content-Type': 'application/zip',
                'Content-Disposition': `attachment; filename="${encodeURIComponent(safeTitle)}.zip"; filename*=UTF-8''${encodeURIComponent(safeTitle)}.zip`,
            },
        });

    } catch (error: any) {
        console.error('Download error:', error);
        return NextResponse.json(
            { error: error.message || '打包下载失败' },
            { status: 500 }
        );
    }
}
