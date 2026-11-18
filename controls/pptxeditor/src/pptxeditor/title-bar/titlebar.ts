/**
 * Title bar module for the EJ2 PowerPoint Editor.
 *
 * @module @syncfusion/ej2-pptxeditor/title-bar
 *
 * The editor no longer renders a title bar; this module only resolves the
 * presentation name used for download file names.
 */

/**
 * Default presentation title when no file name or path is available.
 * @private
 */
export const DEFAULT_PRESENTATION_TITLE: string = 'Untitled Presentation';

/**
 * Resolves the display title of the presentation.
 *
 * Preference order: explicit `fileName` (basename when it is a path),
 * basename of `documentPath`, then {@link DEFAULT_PRESENTATION_TITLE}.
 *
 * Full filesystem paths are reduced to the leaf name so the chrome stays
 * readable and CSS ellipsis can apply to long leaf names.
 *
 * @param {string|undefined} fileName - Explicit file name property
 * @param {string|undefined} documentPath - Document path or URL
 * @returns {string} Display title string
 * @private
 */
export function resolvePresentationTitle(
    fileName: string | undefined,
    documentPath: string | undefined
): string {
    if (typeof fileName === 'string') {
        const trimmed: string = fileName.trim();
        if (trimmed.length > 0) {
            // Treat path-like values as paths so the bar shows "Deck.pptx", not
            // "C:\\Users\\...\\Deck.pptx".
            if (trimmed.includes('/') || trimmed.includes('\\')) {
                const fromPath: string = extractFileNameFromPath(trimmed);
                if (fromPath.length > 0) {
                    return fromPath;
                }
            }
            return trimmed;
        }
    }

    if (typeof documentPath === 'string') {
        const base: string = extractFileNameFromPath(documentPath);
        if (base.length > 0) {
            return base;
        }
    }

    return DEFAULT_PRESENTATION_TITLE;
}

/**
 * Extracts a file name from a path or URL.
 *
 * @param {string} path - File path or URL
 * @returns {string} Basename without query/hash, or empty string
 * @private
 */
export function extractFileNameFromPath(path: string): string {
    const withoutHash: string = path.split('#')[0] || '';
    const withoutQuery: string = withoutHash.split('?')[0] || '';
    const normalized: string = withoutQuery.replace(/\\/g, '/');
    const segments: string[] = normalized.split('/');
    const last: string = segments[segments.length - 1] || '';
    if (last.length === 0) {
        return '';
    }
    try {
        return decodeURIComponent(last);
    } catch {
        return last;
    }
}
