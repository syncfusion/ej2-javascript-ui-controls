declare let importScripts: (...scripts: string[]) => void;
/**
 *@returns {void}
 */
export function _PdfOpenJpegRunner(): void {
    let baseUrl: string = '';
    let moduleLoaded: boolean = false;
    const moduleString: string = 'Module';
    const pdfiumWindow: any = {}; //eslint-disable-line
    const OpenJpegModule: any = pdfiumWindow[moduleString] || {}; //eslint-disable-line
    const ctx: Worker = self as any; //eslint-disable-line
    /**
     *@returns {void}
     */
    function postLoaded(): void {
        ctx.postMessage({ message: 'loaded' });
    }
    /**
     *@returns {void}
     */
    function checkIfEverythingWasLoaded(): void {
        if (moduleLoaded) {
            postLoaded();
        }
    }
    ctx.onmessage = function (event: MessageEvent): void {
        const data: any = event.data; //eslint-disable-line
        if (!data || !data.message) {
            return;
        }
        switch (data.message) {
        case 'initialLoading':
            baseUrl = (data.url || '').replace(/\/+$/, '');
            importScripts(`${baseUrl}/openjpeg.js`);
            OpenJpegModule.url = baseUrl;
            OpenJpegModule.onRuntimeInitialized = function (): void {
                moduleLoaded = true;
                checkIfEverythingWasLoaded();
            };
            (self as any)['OpenJpegModule'](OpenJpegModule); //eslint-disable-line
            break;
        case 'decodeJPX':
            {
                if (!moduleLoaded) {
                    ctx.postMessage({ message: 'decodeError', error: 'Module not loaded yet.' });
                    return;
                }
                const bytes: any = data.url; //eslint-disable-line
                const mod: any = OpenJpegModule; //eslint-disable-line
                const u8: Uint8Array = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
                let ptr: number = 0;
                try {
                    ptr = mod._malloc(u8.length);
                    if (mod.writeArrayToMemory) {
                        mod.writeArrayToMemory(u8, ptr);
                    } else {
                        mod.HEAPU8.set(u8, ptr);
                    }
                    const ok: number = mod._jp2_decode(ptr, u8.length) | 0;
                    ctx.postMessage({ message: mod.imageData, success: ok === 1 });
                } catch (ex) {
                    ctx.postMessage({ message: 'decodeError', error: ex.message });
                }
            }
            break;
        case 'getModule':
            ctx.postMessage({ message: 'moduleInfo', id: data.id, loaded: moduleLoaded });
            break;
        case 'unloadOpenJpeg':
            ctx.postMessage({ message: 'unloaded' });
            break;
        }
    };
}
