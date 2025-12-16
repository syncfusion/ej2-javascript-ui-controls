import { _PdfOpenJpegRunner } from './openjpeg-runner';
export class _PdfImageProcessor {
    async _decodeImage(bytes: Uint8Array, jpxStream: any): Promise<Uint8Array> { //eslint-disable-line
        const workerBob: Blob = new Blob([_PdfOpenJpegRunner.toString().replace(/^[^{]*{([\s\S]*)}$/m, '$1')], { type: 'text/javascript' });
        const workerBlobUrl: string = URL.createObjectURL(workerBob);
        const worker: Worker = new Worker(workerBlobUrl);
        (window as any).getRunningScript = (): (() => string) => { //eslint-disable-line
            return (): string => {
                const stackTrace: string = new Error().stack;
                // eslint-disable-next-line
                const match: any = stackTrace && stackTrace.match(/(?:http[s]?:\/\/(?:[^\/\s]+\/))(.*\.js)/);
                return match ? match[0] : 'src/pdf-data-extract/core/openjpeg/openjpeg.js';
            };
        };
        const scriptLinkURL: string = (window as any).getRunningScript()(); //eslint-disable-line
        const splitURL: any = scriptLinkURL.split('/'); // eslint-disable-line
        const path: string = scriptLinkURL.replace('/' + splitURL[splitURL.length - 1], '');
        const baseUrl: string = path.replace('import', 'openjpeg');
        await new Promise<void>((resolve: any, reject: any) => { //eslint-disable-line
            worker.onmessage = (event: any) => { //eslint-disable-line
            const msg: any = event.data; //eslint-disable-line
                if (msg.message === 'loaded') {
                    resolve();
                } else if (msg.message === 'decodeError') {
                    reject(new Error(msg.error));
                }
            };
            worker.postMessage({ message: 'initialLoading', url: baseUrl });
        });
        const data: any = bytes || jpxStream.bytes; // eslint-disable-line
        let imagedata: any; // eslint-disable-line
        await new Promise<void>((resolve: any, reject: any) => { // eslint-disable-line
            worker.onmessage = (event: any) => { //eslint-disable-line
                const msg: any = event.data; //eslint-disable-line
                imagedata = msg.message;
                resolve();
            };
            worker.postMessage({ message: 'decodeJPX', url: data });
        });
        return imagedata;
    }
}
