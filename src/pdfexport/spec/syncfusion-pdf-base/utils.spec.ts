/**
 * BlobHelper class
 */
export class Utils {
    public static isDownloadEnabled: boolean = false;
    public static download(blob: Blob, fileName: string): void{
        if (!(!navigator.msSaveBlob)) {
            navigator.msSaveBlob(blob, fileName);
        } else {
            let dataUrl: string = window.URL.createObjectURL(blob);
            let dwlLink: HTMLAnchorElement = document.createElementNS('http://www.w3.org/1999/xhtml', 'a') as HTMLAnchorElement;
            dwlLink.download = fileName;
            dwlLink.href = dataUrl;
            let event: MouseEvent = document.createEvent('MouseEvent');
            event.initEvent('click', true, true);
            dwlLink.dispatchEvent(event);
            // setTimeout((): void => {
            //     window.URL.revokeObjectURL(dataUrl);
            //     dataUrl = undefined;
            // });
        }
    }
}
describe('Dummy', () => {
    it('Test', () => {
    });
});