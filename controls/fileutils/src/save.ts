/**
 * Save class provide method to save file
 * ```typescript
 * let blob : Blob = new Blob([''], { type: 'text/plain' });
 * Save.save('fileName.txt',blob);
 */
export class Save {
    public static isMicrosoftBrowser: boolean;

    /**
     * Initialize new instance of {save}
     */
    constructor() {
        // tslint:disable
    }
    /**
     * Saves the file with the specified name and sends it to the client browser.
     * @param {string} fileName - The file name to save.
     * @param {Blob} buffer - The content to write in the file.
     * @param {boolean} isMicrosoftBrowser - Specifies whether the browser is Microsoft.
     * @returns {void} Nothing is returned.
     */
    public static save(fileName: string, buffer: Blob): void {
        if (fileName === null || fileName === undefined || fileName === '') {
            throw new Error('ArgumentException: fileName cannot be undefined, null or empty');
        }
        const extension: string = fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length);
        const mimeType: string = this.getMimeType(extension);
        if (mimeType !== '') {
            buffer = new Blob([buffer], { type: mimeType });
        }
        if (this.isMicrosoftBrowser) {
            navigator.msSaveBlob(buffer, fileName);
        } else {
            const downloadLink: HTMLAnchorElement = document.createElementNS('http://www.w3.org/1999/xhtml', 'a') as HTMLAnchorElement;
            this.saveInternal(fileName, extension, buffer, downloadLink, 'download' in downloadLink);
        }
    }
    private static saveInternal(fileName: string, extension: string, buffer: Blob, downloadLink: HTMLAnchorElement,
                                hasDownloadAttribute: Boolean): void {
        if (hasDownloadAttribute) {
            downloadLink.download = fileName;
            let dataUrl: string = window.URL.createObjectURL(buffer);
            downloadLink.href = dataUrl;
            const event: MouseEvent = document.createEvent('MouseEvent');
            event.initEvent('click', true, true);
            downloadLink.dispatchEvent(event);
            setTimeout((): void => {
                window.URL.revokeObjectURL(dataUrl);
                dataUrl = undefined;
            });
        } else {
            if (extension !== 'docx' && extension !== 'xlsx') {
                const url: string = window.URL.createObjectURL(buffer);
                const isPopupBlocked: Window = window.open(url, '_blank');
                if (!isPopupBlocked) {
                    window.location.href = url;
                }
            } else {
                const reader: FileReader = new FileReader();
                reader.onloadend = () => {
                    const isPopupBlocked: Window = window.open(reader.result as string, '_blank');
                    if (!isPopupBlocked) {
                        window.location.href = reader.result as string;
                    }
                };
                reader.readAsDataURL(buffer);
            }
        }

    }
    /**
     * Gets the MIME type for the specified file extension.
     * @param {string} extension - The file extension to check.
     * @returns {string} The MIME type corresponding to the given extension.
     * @private
     */
    public static getMimeType(extension: string): string {
        let mimeType: string = '';
        switch (extension) {
        case 'html':
            mimeType = 'text/html';
            break;
        case 'pdf':
            mimeType = 'application/pdf';
            break;
        case 'docx':
            mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
            break;
        case 'xlsx':
            mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
            break;
        case 'txt':
            mimeType = 'text/plain';
            break;
        }
        return mimeType;
    }
}
