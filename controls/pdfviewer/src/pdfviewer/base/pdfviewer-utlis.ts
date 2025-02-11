import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { PdfFontStyle, PdfTrueTypeFont } from '@syncfusion/ej2-pdf';
import { PdfViewer } from '../index';

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
                    if (!font._fontInternal._ttfReader._isFontPresent && (ch !== ' ') && !this.hasEscapeSequences(ch)) {
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
     * Checks if the given character is an escape sequence.
     *
     * @param {string} char - The character to be checked.
     * @private
     * @returns {boolean} - Returns true if the character is an escape sequence, otherwise false.
     */
    private static hasEscapeSequences(char: string): boolean {
        const escapeRegex: RegExp = /[\0\b\t\n\v\f\r'"\\]/;
        return escapeRegex.test(char);
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
     * @param {PdfFontStyle} fontStyle - Get the font style.
     * @returns {any} - It's return fontCollection
     * @private
     */
    public static tryGetFontFromKeys(fontCollection: { [key: string]: any; }, text: string,
                                     fontSize: number, fontStyle?: PdfFontStyle): (PdfTrueTypeFont | null) {
        const keys: any = Object.keys(fontCollection);
        for (const key of keys) {
            let fontStream: any = this.processFontStream(fontCollection[`${key}`]);
            let font: PdfTrueTypeFont = new PdfTrueTypeFont(fontStream, this.convertPixelToPoint(fontSize),
                                                            fontStyle ? fontStyle : PdfFontStyle.regular);
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

    /**
     * @param {string} color - Gets the color in hex RGBA pattern.
     * @returns {boolean} - It's return boolean
     * @private
     */
    public static isHexRGBAAndTransparent(color: string): boolean {
        // Check if the string matches the #RRGGBBAA pattern
        const hexRGBARegex: RegExp = /^#([A-Fa-f0-9]{8})$/;
        if (!hexRGBARegex.test(color)) {
            return false; // Not a valid hex RGBA
        }
        // Extract the alpha value (last two characters)
        const alphaHex: string = color.slice(-2); // Last two characters
        const alphaDecimal: number = parseInt(alphaHex, 16); // Convert to decimal
        // Check if alpha is zero (transparent)
        return alphaDecimal === 0;
    }

    /**
     * @param {string} color - Gets the background color with transparency.
     * @returns {string} - It's return background color with transparency.
     * @private
     */
    public static setTransparencyToHex(color: string): string {
        if (color.includes('#')) {
            if (color.length > 8 && color !== '#00000000') {
                color = color.slice(0, -2) + '60';
            }
            else {
                color += '60';
            }
        }
        return color;
    }

    /**
     * @param {string} color - Gets the background color without transparency.
     * @returns {string} - It's return background color without transparency.
     * @private
     */
    public static removeAlphaValueFromHex(color: string): string {
        if (color.includes('#')) {
            if (color.length > 8) {
                color = color.slice(0, -2);
            }
        }
        return color;
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

    /**
     * @private
     * @param {number} value - It describes about the value
     * @returns {number} - number
     */
    public static convertPixelToPoint(value: number): number {
        return (value * 72 / 96);
    }

    /**
     * Method to deep-shallow copy an object, only if it is a Proxy
     *
     * @private
     * @param {any} obj - Get the data of the next queued task.
     * @returns {any} - The copied object if it was a Proxy; otherwise, returns the original object.
     */
    public static cloneProxy(obj: any): any {
        if (this.isProxy(obj)) {
            const copy: any = Object.assign({}, obj);
            for (const key in copy) {
                // eslint-disable-next-line security/detect-object-injection
                if (this.isProxy(copy[key])) {
                    // eslint-disable-next-line security/detect-object-injection
                    copy[key] = this.cloneProxy(copy[key]); // Recursively process each property
                }
            }
            return copy;
        }
        return obj;
    }

    /**
     * Method to check if a value is a plain object (Proxy detection)
     *
     * @private
     * @param {any} value - Get the data of the next queued task.
     * @returns {boolean} - Returns true if the value is a Proxy; otherwise, false.
     */
    public static isProxy(value: any): boolean {
        return Object.prototype.toString.call(value) === '[object Object]';
    }
}

/**
 *
 * @hidden
 */
export class PdfViewerSessionStorage {
    // Fields
    private localStorage: { [key: string]: string } = {};
    /**
     * @private
     */
    public enableLocalStorage: boolean = true;
    /**
     * @private
     */
    public documentId: string = '';

    // Constructor
    constructor(enableLocalStorage: boolean) {
        // eslint-disable-next-line camelcase
        this.enableLocalStorage = enableLocalStorage;
    }

    /**
     * Method to set an item in either session or local storage
     *
     * @param {string} key - Get the key.
     * @param {string} value - Get the value.
     * @private
     * @returns {void}
     */
    public setItem(key: string, value: string): void {
        if (this.enableLocalStorage) {
            this.localStorage[`${key}`] = value;
        } else {
            window.sessionStorage.setItem(key, value);
        }
    }

    /**
     * Method to get an item from either session or local storage
     *
     * @param {string} key - Get the key.
     * @private
     * @returns {any} - It's return the value.
     */
    public  getItem(key: string): string | null {
        if (this.enableLocalStorage) {
            return (key in this.localStorage) ? this.localStorage[`${key}`] :  null;
        } else {
            return window.sessionStorage.getItem(key);
        }
    }

    /**
     * Method to remove an item from either session or local storage
     *
     * @param {string} key - Get the key.
     * @private
     * @returns {void}
     */
    public removeItem(key: string): void {
        if (this.enableLocalStorage) {
            delete this.localStorage[`${key}`];
        } else {
            window.sessionStorage.removeItem(key);
        }
    }

    /**
     * Method to return the length of the storage
     *
     * @private
     * @returns {number} - return the length of the session.
     */
    public getSessionLength(): number {
        if (this.enableLocalStorage) {
            return Object.keys(this.localStorage).length;
        } else {
            return window.sessionStorage.length;
        }
    }

    /**
     * Method to return the key at the specified index
     *
     * @param {number} index - Get the index.
     * @private
     * @returns {any} - It's return the key value.
     */
    public getKey(index: number): string | null {
        if (this.enableLocalStorage) {
            const keys: string[] = Object.keys(this.localStorage);
            return keys[parseInt(index.toString(), 10)] || null;
        } else {
            return window.sessionStorage.key(index);
        }
    }

    /**
     * Method to return the window session storage size.
     *
     * @private
     * @returns {any} - It's return the key value.
     */
    public getWindowSessionStorageSize(): any {
        return Math.round(JSON.stringify(window.sessionStorage).length / 1024);
    }

    /**
     * Method to move all items from sessionStorage to localStorage
     *
     * @param {boolean} enableLocalStorage - Get the enableLocalStorage value.
     * @private
     * @returns {void}
     */
    public migrateToLocalStorage(enableLocalStorage: boolean): void {
        // eslint-disable-next-line camelcase
        this.enableLocalStorage = enableLocalStorage;

        if (this.enableLocalStorage) {
            // Move all session storage items to local storage
            let removingItems: string[] = this.getRemovingItems();
            for (let i: number = 0; i < removingItems.length; i++) {
                const key: string = removingItems[parseInt(i.toString(), 10)];
                if (key) {
                    const value: string = window.sessionStorage.getItem(key);
                    if (!isNullOrUndefined(value) && this.documentId !== '' && key.indexOf(this.documentId) !== -1) {
                        this.localStorage[`${key}`] = value;
                        window.sessionStorage.removeItem(key);
                    }
                }
            }
            removingItems = null;
        }
    }

    /**
     * Method to clear all viewer items from sessionStorage and localStorage.
     *
     * @private
     * @returns {void}
     */
    public clear(): void {
        if (this.enableLocalStorage) {
            this.localStorage = {};
        }
        else {
            let removingItems: string[] = this.getRemovingItems();
            for (let i: number = 0; i < removingItems.length; i++) {
                const key: string = removingItems[parseInt(i.toString(), 10)];
                if (key.indexOf('Sync_PdfViewer_') !== -1) {
                    window.sessionStorage.removeItem(key);
                }
            }
            removingItems = null;
        }
    }

    private getRemovingItems(): any {
        const keysToProcess: string[] = [];
        for (let i: number = 0; i < window.sessionStorage.length; i++) {
            const key: string = window.sessionStorage.key(i);
            if (key) {
                keysToProcess.push(key);
            }
        }
        return keysToProcess;
    }
}

/**
 *
 * @hidden
 */
export enum TaskPriorityLevel {
    High = 1,
    Medium = 2,
    Low = 3
}

/**
 *
 * @hidden
 */
export class PdfiumTaskScheduler {
    //Fields
    private worker: any;
    private taskQueue: any[] = [];
    private isProcessing: boolean = false;
    private pdfViewer: PdfViewer;

    // Constructor
    constructor(workerScript: any, pdfViewer: PdfViewer) {
        this.worker = new Worker(workerScript);
        this.taskQueue = [];
        this.isProcessing = false;
        this.pdfViewer = pdfViewer;
    }

    /**
     * Method to add the given task into request for the worker
     *
     * @param {any} taskData - Get the task data.
     * @param {TaskPriorityLevel} priority - Get the priority level for the task.
     * @private
     * @returns {void}
     */
    public addTask(taskData: any, priority: TaskPriorityLevel): void {
        this.taskQueue.push({ taskData, priority });
        this.taskQueue.sort((a: any, b: any) => a.priority - b.priority); // Sort by priority
        this.processQueue(); // Start processing if idle
    }

    /**
     * Method to request posted for the queue task
     *
     * @returns {void}
     */
    private processQueue(): void {
        if (this.isProcessing || this.taskQueue.length === 0) { return; }
        const nextTask: any = this.taskQueue.shift();
        this.isProcessing = true;
        const isVue3: any = (this as any).pdfViewer.isVue3 || ((this as any).pdfViewer.parent && (this as any).pdfViewer.parent.isVue3);
        const taskData: any = isVue3 ? PdfViewerUtils.cloneProxy(nextTask.taskData) : nextTask.taskData;
        this.worker.postMessage(taskData);
    }

    /**
     * Method to call on message for the worker
     *
     * @param {any} method - Get the method for the onmessage.
     * @private
     * @returns {void}
     */
    public onMessage(method: (event: any) => void): void {
        this.worker.onmessage = (event: MessageEvent) => {
            if (event.data.message !== '') {
                method(event); // Call the provided method with the event
            }
            this.isProcessing = false;
            this.processQueue();
        };
    }

    /**
     * Method to terminate the worker
     *
     * @private
     * @returns {void}
     */
    public terminate(): void {
        this.worker.terminate();
    }
}
