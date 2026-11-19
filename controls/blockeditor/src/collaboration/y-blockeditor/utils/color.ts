function parseColorToRGB(color: string): { r: number; g: number; b: number } {
    if (color.startsWith('#')) {
        let hex: string = color.replace('#', '');
        if (hex.length === 3) {
            hex = hex.split('').map((c: string) => c + c).join('');
        }
        if (hex.length !== 6) { return null; }
        const bigint: number = parseInt(hex, 16);
        return {
            r: (bigint >> 16) & 255,
            g: (bigint >> 8) & 255,
            b: bigint & 255
        };
    }

    const rgbMatch: RegExpMatchArray = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (rgbMatch) {
        return {
            r: parseInt(rgbMatch[1], 10),
            g: parseInt(rgbMatch[2], 10),
            b: parseInt(rgbMatch[3], 10)
        };
    }

    return null;
}

/**
 * Calculates relative luminance of an RGB color for contrast analysis
 *
 * @param {Object} param - Object with r, g, b properties (0-255)
 * @returns {number} Relative luminance value (0-1)
 * @hidden
 */
export function getRelativeLuminance({ r, g, b }: any): number {
    const [R, G, B]: number[] = [r, g, b].map((channel: number) => {
        const c: number = channel / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

/**
 * Derives caret and selection colors for contrast visibility from base color
 *
 * @param {string} baseColor - Base color in hex or rgb format
 * @returns {Object} Object with caret and selection color strings
 * @hidden
 */
export function deriveCursorColors(baseColor: string): { caret: string; selection: string } {
    const rgb: { r: number; g: number; b: number } | null = parseColorToRGB(baseColor);
    if (!rgb) {
        return { caret: baseColor, selection: baseColor };
    }

    const luminance: number = getRelativeLuminance(rgb);
    const visibilityThreshold: number = 0.15; //0.15–0.25 is sweet spot
    const caret: string = luminance > 0.9
        ? `rgb(${rgb.r * 0.6}, ${rgb.g * 0.6}, ${rgb.b * 0.6})`
        : `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    const selection: string = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${visibilityThreshold})`;

    return { caret, selection };
}
