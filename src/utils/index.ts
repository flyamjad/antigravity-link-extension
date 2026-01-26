import { existsSync, readFileSync } from 'fs';

// Simple hash function
export function hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash.toString(36);
}

// Convert vscode-file:// URLs to base64 data URIs
export function convertVsCodeIcons(html: string): string {
    // Match vscode-file URLs like: vscode-file://vscode-app/Applications/Antigravity.app/.../file.svg
    const vsCodeUrlRegex = /vscode-file:\/\/vscode-app(\/[^"'\s]+\.(?:svg|png|jpg|gif))/gi;

    return html.replace(vsCodeUrlRegex, (match, filePath) => {
        try {
            // Convert URL path to local filesystem path
            const localPath = decodeURIComponent(filePath);

            if (!existsSync(localPath)) {
                return match;
            }

            const content = readFileSync(localPath);
            const extension = localPath.split('.').pop()?.toLowerCase() || 'svg';
            const mimeType = extension === 'svg' ? 'image/svg+xml' : `image/${extension}`;
            const base64 = content.toString('base64');

            return `data:${mimeType};base64,${base64}`;
        } catch {
            return match;
        }
    });
}
