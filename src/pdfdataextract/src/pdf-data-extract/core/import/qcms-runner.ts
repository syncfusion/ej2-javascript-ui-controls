declare let importScripts: (...scripts: string[]) => void;
/**
 *@returns {void}
 */
export function _PdfQcmsRunner(): void {
    let baseUrl: string = '';
    let moduleLoaded: boolean = false;
    let _memoryArray: Uint8Array;
    let _mustAddAlpha: boolean = false;
    let _destBuffer: any = null; // eslint-disable-line
    let _destOffset: number = 0;
    const ctx: Worker = self as any; // eslint-disable-line
    const qcmsModule: any = {}; // eslint-disable-line
    let lastResult: Uint8Array | null = null;
    let nextTransformerId: number = 1;
    const transformerMap: Map<number, number> = new Map<number, number>();
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
    /**
     * Attaches helper functions to the given module.
     *
     * @param {any} mod - The module object to which helpers will be attached.
     * @returns {void}
     */
    function attachHelpersToModule(mod: any): void { // eslint-disable-line
        mod.copy_result = (ptr: number, len: number) => { // eslint-disable-line
            _memoryArray = new Uint8Array(qcmsModule.memory.buffer);
            if (_mustAddAlpha) {
                for (let i: number = ptr, ii: number = ptr + len, j: number = _destOffset; i < ii; i += 3, j += 4) {
                    _destBuffer[<number>j] = _memoryArray[<number>i];
                    _destBuffer[j + 1] = _memoryArray[i + 1];
                    _destBuffer[j + 2] = _memoryArray[i + 2];
                    _destBuffer[j + 3] = 255;
                }
            } else {
                for (let i: number = ptr, ii: number = ptr + len, j: number = _destOffset; i < ii; i += 3, j += 4) {
                    _destBuffer[<number>j] = _memoryArray[<number>i];
                    _destBuffer[j + 1] = _memoryArray[i + 1];
                    _destBuffer[j + 2] = _memoryArray[i + 2];
                }
            }
        };
        mod.copy_rgb = (ptr: number) => { // eslint-disable-line
            _memoryArray = new Uint8Array(qcmsModule.memory.buffer);
            _destBuffer[<number>_destOffset] = _memoryArray[<number>ptr];
            _destBuffer[_destOffset + 1] = _memoryArray[ptr + 1];
            _destBuffer[_destOffset + 2] = _memoryArray[ptr + 2];
        };
        mod.make_cssRGB = (_r: number, _g: number, _b: number) => { // eslint-disable-line
            _memoryArray = new Uint8Array(qcmsModule.memory.buffer);
        };
    }
    /**
     *@returns {void}
     */
    function ensureLoaded(): void {
        if (!moduleLoaded) {
            throw new Error('Module not loaded yet.');
        }
    }
    ctx.onmessage = function (event: MessageEvent): void {
        const data: any = event.data; // eslint-disable-line
        if (!data || !data.message) {
            return;
        }
        switch (data.message) {
        case 'initialLoading': {
            baseUrl = (data.url || '').replace(/\/+$/, '');
            try {
                importScripts(`${baseUrl}/qcms.js`);
            } catch (e) {
                ctx.postMessage({ message: 'initError', error: `Failed to import qcms.js: ${e.message || e}`, reqId: data.reqId });
                return;
            }
            try {
                attachHelpersToModule(qcmsModule);
                qcmsModule.url = baseUrl;
                qcmsModule.onRuntimeInitialized = function (): void {
                    moduleLoaded = true;
                    checkIfEverythingWasLoaded();
                };
                const factory = (self as any)['qcmsModule']; // eslint-disable-line
                if (typeof factory !== 'function') {
                    ctx.postMessage({ message: 'initError', error: 'qcmsModule factory not found after loading qcms.js', reqId: data.reqId });
                    return;
                }
                factory(qcmsModule);
            } catch (e) {
                ctx.postMessage({ message: 'initError', error: e.message || String(e), reqId: data.reqId });
            }
            break;
        }
        case 'getModule': {
            ctx.postMessage({ message: 'moduleInfo', id: data.id, loaded: moduleLoaded, reqId: data.reqId });
            break;
        }
        case 'convertQcms': {
            try {
                ensureLoaded();
                const { src, profileBytes, inType, intent } = data.payload as {
                    src: Uint8Array;
                    profileBytes: Uint8Array;
                    inType: number;
                    intent: number;
                };
                lastResult = null;
                const u8Src: Uint8Array = src instanceof Uint8Array ? src : new Uint8Array(src);
                const u8Profile: Uint8Array = profileBytes instanceof Uint8Array ? profileBytes : new Uint8Array(profileBytes);
                const mod: any = qcmsModule; // eslint-disable-line
                const transformer: number = mod.qcms_transformer_from_memory(u8Profile, inType >>> 0, intent >>> 0) >>> 0;
                mod.qcms_convert_array(transformer, u8Src);
                mod.qcms_drop_transformer(transformer);
                if (!lastResult) {
                    ctx.postMessage({
                        message: 'convertError',
                        error: 'QCMS conversion finished but no result was captured. Ensure qcms.js calls Module.copy_result(ptr, len) and exposes Module.HEAPU8.',
                        reqId: data.reqId
                    });
                    return;
                }
                ctx.postMessage({ message: 'convertResult', data: lastResult, reqId: data.reqId }, [lastResult.buffer]);
            } catch (ex) {
                ctx.postMessage({ message: 'convertError', error: ex.message || String(ex), reqId: data.reqId });
            }
            break;
        }
        case 'createTransformer': {
            try {
                ensureLoaded();
                const { profileBytes, inType, intent } = data.payload as {
                    profileBytes: Uint8Array;
                    inType: number;
                    intent: number;
                };
                const u8Profile: Uint8Array = profileBytes instanceof Uint8Array ? profileBytes : new Uint8Array(profileBytes);
                const mod: any = qcmsModule; // eslint-disable-line
                const handle: number = mod.qcms_transformer_from_memory(u8Profile, inType >>> 0, intent >>> 0) >>> 0;
                if (!handle) {
                    ctx.postMessage({ message: 'createTransformerError', error: 'Failed to create transformer', reqId: data.reqId });
                    return;
                }
                const id: number = nextTransformerId++;
                transformerMap.set(id, handle);
                ctx.postMessage({ message: 'transformerCreated', id, handle, reqId: data.reqId });
            } catch (ex) {
                ctx.postMessage({ message: 'createTransformerError', error: ex.message || String(ex), reqId: data.reqId });
            }
            break;
        }
        case 'convertWith': {
            try {
                const { id, src, dest, destOffset, alpha } = data.payload as {
                    id: number;
                    src: Uint8Array;
                    dest: any; // eslint-disable-line
                    destOffset: number;
                    alpha: any; // eslint-disable-line
                };
                _mustAddAlpha = alpha && dest.buffer === src.buffer;
                _destBuffer = dest;
                _destOffset = destOffset;
                lastResult = null;
                const u8Src: Uint8Array = src instanceof Uint8Array ? src : new Uint8Array(src);
                const mod: any = qcmsModule; // eslint-disable-line
                mod.qcms_convert_array(id, u8Src);
                _mustAddAlpha = false;
                _destBuffer = null;
                ctx.postMessage({ message: 'convertWithResult', id, data: dest, reqId: data.reqId });
            } catch (ex) {
                ctx.postMessage({ message: 'convertWithError', error: ex.message || String(ex), reqId: data.reqId });
            }
            break;
        }
        case 'convertOne': {
            try {
                ensureLoaded();
                const { id, dest, destOffset, value,  css } = data.payload as { id: number; dest: any, // eslint-disable-line
                    destOffset: number, value: number; css: boolean};
                lastResult = null;
                const mod: any = qcmsModule; // eslint-disable-line
                _destBuffer = dest;
                _destOffset = destOffset;
                mod.qcms_convert_one(id, value, !!css);
                _destBuffer = new Uint8Array([]);
                ctx.postMessage({ message: 'convertOneResult', id, data: lastResult, reqId: data.reqId });
            } catch (ex) {
                ctx.postMessage({ message: 'convertOneError', error: ex.message || String(ex), reqId: data.reqId });
            }
            break;
        }
        case 'convertThree': {
            try {
                ensureLoaded();
                const { id, dest, destOffset, r, g, b, css } = data.payload as { id: number; dest: any, // eslint-disable-line
                    destOffset: number, r: number; g: number; b: number; css: boolean };
                lastResult = null;
                const mod: any = qcmsModule; // eslint-disable-line
                _destBuffer = dest;
                _destOffset = destOffset;
                mod.qcms_convert_three(id, r, g, b, !!css);
                _destBuffer = new Uint8Array([]);
                ctx.postMessage({ message: 'convertThreeResult', id, data: lastResult, reqId: data.reqId });
            } catch (ex) {
                ctx.postMessage({ message: 'convertThreeError', error: ex.message || String(ex), reqId: data.reqId });
            }
            break;
        }
        case 'convertFour': {
            try {
                ensureLoaded();
                const { id, dest, destOffset, c, m, y, k, css } = data.payload as { id: number; dest: any, // eslint-disable-line
                    destOffset: number, c: number; m: number; y: number; k: number; css: boolean };
                lastResult = null;
                const mod: any = qcmsModule; // eslint-disable-line
                _destBuffer = dest;
                _destOffset = destOffset;
                mod.qcms_convert_four(id, c, m, y, k, false);
                _destBuffer = new Uint8Array([]);
                ctx.postMessage({ message: 'convertFourResult', id, data: lastResult, reqId: data.reqId });
            } catch (ex) {
                ctx.postMessage({ message: 'convertFourError', error: ex.message || String(ex), reqId: data.reqId });
            }
            break;
        }
        case 'dropTransformer': {
            try {
                ensureLoaded();
                const { id } = data.payload as { id: number };
                const handle: number = transformerMap.get(id);
                if (handle) {
                    transformerMap.delete(id);
                    const mod: any = qcmsModule; // eslint-disable-line
                    try {
                        mod.qcms_drop_transformer(handle);
                    } catch {
                        ctx.postMessage({ message: 'transformerDroppedError', id, reqId: data.reqId });
                    }
                }
                ctx.postMessage({ message: 'transformerDropped', id, reqId: data.reqId });
            } catch (ex) {
                ctx.postMessage({ message: 'dropTransformerError', error: ex.message || String(ex), reqId: data.reqId });
            }
            break;
        }
        case 'unloadQcms': {
            try {
                const mod: any = qcmsModule; // eslint-disable-line
                transformerMap.forEach((handle: number) => {
                    try {
                        mod.qcms_drop_transformer(handle);
                    } catch {
                        ctx.postMessage({ message: 'unloadedQcmsError', reqId: data.reqId });
                    }
                });
            } catch {
                ctx.postMessage({ message: 'unloadedError', reqId: data.reqId });
            }
            transformerMap.clear();
            ctx.postMessage({ message: 'unloaded', reqId: data.reqId });
            break;
        }
        }
    };
}
