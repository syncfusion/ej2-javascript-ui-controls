import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { PdfTrueTypeFont } from '@syncfusion/ej2-pdf';

/**
 *
 * @hidden
 */
export class PdfViewerUtils {
    /**
     * It returns a boolean value.
     *
     * @param {string} text - It get the fontcollection.
     * @param {PdfTrueTypeFont} font - Get the font.
     * @private
     * @returns {boolean} - Return the boolean.
     */
    public static isSupportedFont(text: string, font: PdfTrueTypeFont): boolean {
        try {
            if (!isNullOrUndefined(text) && !isNullOrUndefined(font)) {
                for (let i: number = 0; i < text.length; i++) {
                    const ch: string = text[parseInt(i.toString(), 10)];
                    font._fontInternal._ttfReader._getGlyph(ch);
                    if (!font._fontInternal._ttfReader._isFontPresent) {
                        return font._fontInternal._ttfReader._isFontPresent;
                    }
                }
                return true;
            }
        }
        catch (e) {
            return false;
        }
        return false;
    }

    /**
     * It convert byte array to base64 string.
     *
     * @param {any} fontStream - It get the byte array.
     * @private
     * @returns {any} - Return the base64 string.
     */
    public static processFontStream(fontStream: any): any {
        return fontStream instanceof Uint8Array ? this.convertByteArrayToBase64(fontStream) : fontStream;
    }

    /**
     * @param {string} customFonts - Get the custom fonts.
     * @param {string} url - Get the url.
     * @returns {any} - It's return fontCollection
     * @private
     */
    public static fetchCustomFonts(customFonts: string[], url: string): Promise<{ [key: string]: Uint8Array }> {
        const fontCollection: { [key: string]: Uint8Array } = {};
        const fontPromises: any = customFonts.map((font: string) => {
            let fontPath: string;
            if (font.startsWith('http://') || font.startsWith('https://')) {
                fontPath = font;
            } else {
                fontPath = `${url}/${font}`;
            }
            const parts: string[] = fontPath.split('/');
            const fileName: string = parts.pop() || '';
            if (Object.keys(fontCollection).indexOf(fileName) === -1) {
                return this.fetchData(fontPath).then(async (fontData: Uint8Array | null) => {
                    if (fontData) {
                        fontCollection[parts.indexOf('fallbackfonts') !== -1 ?
                            'fallbackfonts_' + fileName.toLowerCase() : fileName.toLowerCase()] = fontData;
                    } else {
                        const fallbackFontPath: string = `${url}/fallbackfonts/${font}`;
                        return this.fetchData(fallbackFontPath).then((fallbackData: Uint8Array | null) => {
                            if (fallbackData) {
                                fontCollection['fallbackfonts_' + fileName.toLowerCase()] = fallbackData;
                            }
                        });
                    }
                });
            }
            return null;
        });
        return Promise.all(fontPromises).then(() => fontCollection);
    }

    /**
     * @param {any} fontCollection - Get the custom fonts collection.
     * @param {string} text - Get the font family.
     * @param {number} fontSize - Get the font size.
     * @returns {any} - It's return fontCollection
     * @private
     */
    public static tryGetFontFromKeys(fontCollection: { [key: string]: any; }, text: string,
                                     fontSize: number): (PdfTrueTypeFont | null) {
        const keys: any = Object.keys(fontCollection);
        for (const key of keys) {
            let fontStream: any = this.processFontStream(fontCollection[`${key}`]);
            let font: PdfTrueTypeFont = new PdfTrueTypeFont(fontStream, this.convertPixelToPoint(fontSize));
            const glyphPresent: boolean = this.isSupportedFont(text, font);
            if (glyphPresent) {
                return font;
            }
            font = null;
            fontStream = null;
        }
        return null;
    }

    /**
     * @param {any} fallbackFontCollection - Get the custom fonts collection.
     * @param {string} fontFamily - Get the font family.
     * @returns {any} - It's return fontCollection
     * @private
     */
    public static getFontKey(fallbackFontCollection: { [key: string]: any; }, fontFamily: string): string | undefined {
        if (fallbackFontCollection[`${fontFamily}`] || fallbackFontCollection[fontFamily + '.ttf']) {
            return fallbackFontCollection[`${fontFamily}`] ? fontFamily : fontFamily + '.ttf';
        }
        const font: string = fontFamily.endsWith('.ttf') ? fontFamily : fontFamily + '.ttf';
        for (const key in fallbackFontCollection) {
            if (key.toLowerCase().endsWith(font.toLowerCase())) {
                return key;
            }
        }
        return undefined;
    }

    private static fetchData(filePath: string): Promise<Uint8Array | null> {
        return fetch(filePath)
            .then((response: Response) => {
                if (!response.ok) {
                    return null;
                }
                return response.arrayBuffer().then((buffer: ArrayBuffer) => new Uint8Array(buffer));
            })
            .catch(() => null);
    }

    private static convertByteArrayToBase64(byteArray: Uint8Array): string {
        let binaryString: string = '';
        const byteArrayLength: number = byteArray.byteLength;
        for (let i: number = 0; i < byteArrayLength; i++) {
            binaryString += String.fromCharCode(byteArray[parseInt(i.toString(), 10)]);
        }
        return btoa(binaryString);
    }

    private static convertPixelToPoint(value: number): number {
        return (value * 72 / 96);
    }
}
