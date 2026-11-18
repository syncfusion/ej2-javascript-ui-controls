import { _PdfQcmsRunner } from '../import/qcms-runner';
import { _PdfColorPalette } from './colorspace';
/**
 * Internal pixel data format identifiers used for color-conversion pipelines.
 *
 * @private
 */
enum _PdfDataType {
    rgb8 = 0,
    rgba8 = 1,
    bgra8 = 2,
    gray8 = 3,
    graya8 = 4,
    cmyk = 5
}
/**
 * Internal rendering intents used for color management conversions.
 *
 * @private
 */
enum _PdfIntent {
    perceptual = 0,
    relativeColorimetric = 1,
    saturation = 2,
    absoluteColorimetric = 3
}
/**
 * Base class for PDF color spaces carrying common name and component count.
 *
 * @private
 */
export class _PdfBaseColorSpace {
    name: string;
    numComps: number;
    /**
     * Initializes a new instance of the `_PdfBaseColorSpace` class.
     *
     * @private
     * @param {string} name Color space name.
     * @param {number} numComps Number of components.
     * @returns {void} nothing.
     */
    constructor(name: string, numComps: number) {
        this.name = name;
        this.numComps = numComps;
    }
}
let nextReqId: number = 1;
function onceMessage<T = any>(worker: Worker, predicate: (d: any) => boolean): Promise<T> { // eslint-disable-line
    return new Promise((resolve) => { // eslint-disable-line
        const handler: any = (e: MessageEvent) => { // eslint-disable-line
            const d: any = e.data; // eslint-disable-line
            if (predicate(d)) {
                worker.removeEventListener('message', handler);
                resolve(d as T);
            }
        };
        worker.addEventListener('message', handler);
    });
}
/**
 * ICC-based color space implementation using a web worker powered transformer.
 *
 * @private
 */
export class _PdfIccColorSpace extends _PdfColorPalette {
    private transformerId: number = 0;
    private inType: _PdfDataType;
    /**
     * Dedicated Web Worker instance used for ICC conversions.
     *
     * @private
     */
    _worker!: Worker;
    numComps: number;
    bytes: any; // eslint-disable-line
    /**
     * Indicates whether the ICC worker and transformer are ready to be used.
     *
     * @private
     */
    _isUsable: boolean = false;
    /**
     * Initializes a new instance of the `_PdfIccColorSpace` class.
     *
     * @private
     * @param {string} name The color space name.
     * @param {number} numComps Number of components in the ICC space.
     * @param {any} bytes ICC profile data bytes.
     * @returns {void} nothing.
     * @throws {Error} When `numComps` is not supported.
     */
    constructor(name: string, numComps: number, bytes: any) { // eslint-disable-line
        super(name, numComps);
        this.numComps = numComps;
        this.bytes = bytes;
        switch (numComps) {
        case 1: this.inType = _PdfDataType.gray8; break;
        case 3: this.inType = _PdfDataType.rgb8; break;
        case 4: this.inType = _PdfDataType.cmyk; break;
        default: throw new Error('Unsupported number of components for ICCBased: ' + numComps);
        }
    }
    private _resolveBaseUrl(platform: string): string {
        const { protocol, host, pathname } = document.location;
        const trimmedPathname: string = pathname.replace(/\/+$/, '');
        let baseUrl: string = `${protocol}//${host}${trimmedPathname}`;
        if (platform === 'angular') {
            baseUrl = baseUrl + '/assets/ej2-pdf-lib';
        } else if (platform === 'vue') {
            baseUrl = baseUrl + '/public/js/ej2-pdf-lib';
        } else {
            (window as any).getRunningScript = (): (() => string) => { // eslint-disable-line
                return (): string => {
                    const stackTrace: string = (new Error().stack as any); // eslint-disable-line
                    const match: any = stackTrace && stackTrace.match(/(?:http[s]?:\/\/(?:[^\/\s]+\/))(.*\.js)/); // eslint-disable-line
                    return match ? match[0] : location.href;
                };
            };
            const scriptLinkURL: string = (window as any).getRunningScript()(); // eslint-disable-line
            const splitURL: any = scriptLinkURL.split('/'); // eslint-disable-line
            const path: string = scriptLinkURL.replace('/' + splitURL[splitURL.length - 1], '');

            if (
                platform === 'javascript' ||
                platform === 'typescript' ||
                platform === 'react' ||
                platform === 'aspnetcore' ||
                platform === 'aspnetmvc'
            ) {
                baseUrl = path + '/ej2-pdf-lib';
            } else {
                baseUrl = path.replace('image-extraction', 'ej2-pdf-lib');
            }
        }
        return baseUrl;
    }
    /**
     * Initializes the ICC worker and loads the qcms runtime scripts.
     *
     * @private
     * @param {string} platform Platform identifier used for asset resolution.
     * @returns {Promise<any>} Resolves when the worker reports loaded (sets `_isUsable` to `true`).
     */
    async _initialize(platform: string): Promise<any> { // eslint-disable-line
        if (this._worker) {
            return;
        }
        const workerBob: Blob = new Blob(
            [_PdfQcmsRunner.toString().replace(/^[^{]*{([\s\S]*)}$/m, '$1')],
            { type: 'text/javascript' }
        );
        const workerBlobUrl: string = URL.createObjectURL(workerBob);
        const worker: Worker = new Worker(workerBlobUrl);
        this._worker = worker;
        const baseUrl: string = this._resolveBaseUrl(platform);
        await new Promise<void>((resolve: any, reject: any) => { // eslint-disable-line
            const onMsg = (event: any) => { // eslint-disable-line
                const msg: any = event.data; // eslint-disable-line
                if (msg.message === 'loaded') {
                    this._isUsable = true;
                    worker.removeEventListener('message', onMsg);
                    resolve();
                } else if (msg.message === 'initError') {
                    worker.removeEventListener('message', onMsg);
                    reject(new Error(msg.error));
                }
            };
            worker.addEventListener('message', onMsg);
            worker.postMessage({ message: 'initialLoading', url: baseUrl });
        });
    }
    /**
     * Creates a transformer handle inside the worker bound to this ICC profile and returns a bound instance.
     *
     * @private
     * @returns {Promise<_PdfIccColorSpace>} A new ICC color space instance bound to the created transformer.
     * @throws {Error} If the worker failed to create the transformer.
     */
    async _create(): Promise<_PdfIccColorSpace> {
        const obj: _PdfIccColorSpace = Object.create(_PdfIccColorSpace.prototype) as _PdfIccColorSpace;
        _PdfBaseColorSpace.call(obj, this.name, this.numComps);
        (obj as any).numComps = this.numComps; // eslint-disable-line
        (obj as any)._worker = this._worker; // eslint-disable-line
        switch (this.numComps) {
        case 1: (obj as any).inType = _PdfDataType.gray8; break; // eslint-disable-line
        case 3: (obj as any).inType = _PdfDataType.rgb8; break; // eslint-disable-line
        case 4: (obj as any).inType = _PdfDataType.cmyk; break; // eslint-disable-line
        default: throw new Error('Unsupported number of components for ICCBased: ' + this.numComps);
        }
        const reqId: number = nextReqId++;
        this._worker.postMessage({
            message: 'createTransformer',
            payload: { profileBytes: this.bytes, inType: (obj as any).inType, intent: _PdfIntent.perceptual }, // eslint-disable-line
            reqId
        });
        const resp: any = await onceMessage<{ message: string; id: number; handle: number; reqId: number }>( // eslint-disable-line
            this._worker,
            (d: any) => d && (d.message === 'transformerCreated' || d.message === 'createTransformerError') && // eslint-disable-line
                        d.reqId === reqId);
        if (resp.message === 'createTransformerError') {
            throw new Error((resp as any).error || 'Failed to create ICC transformer'); // eslint-disable-line
        }
        this.transformerId = resp.handle;
        (obj as any).transformerId = resp.handle; // eslint-disable-line
        return obj;
    }
    dispose(): void {
        if (this.transformerId) {
            try {
                this._worker.postMessage({ message: 'dropTransformer', payload: { id: this.transformerId } });
            } catch { /* ignore */ }
            this.transformerId = 0;
        }
    }
    /**
     * Converts a single pixel at `srcOffset` to RGB and writes it to `dest` at `destOffset`.
     *
     * @private
     * @param {any} src Source components buffer.
     * @param {number} srcOffset Source offset.
     * @param {Uint8Array | Uint8ClampedArray} dest Destination RGB buffer.
     * @param {number} destOffset Destination offset.
     * @param {boolean} [css=false] If `true`, returns values suitable for CSS color.
     * @returns {Promise<void>} Resolves when conversion completes.
     * @throws {Error} If transformer is not initialized or worker reports an error.
     */
    async _getRgbItem(src: any, srcOffset: number, dest: Uint8Array | Uint8ClampedArray, // eslint-disable-line        
                      destOffset: number, css: boolean = false): Promise<void> {
        if (!this.transformerId) {
            throw new Error('ICCBased transformer is not initialized');
        }
        if (this.inType === _PdfDataType.gray8) {
            const value: number = src[<number>srcOffset] * 255;
            this._worker.postMessage({
                message: 'convertOne',
                payload: { id: this.transformerId, dest: dest , destOffset: destOffset, value, css }
            });
            const resp = await onceMessage<any>( // eslint-disable-line 
                this._worker,
                (d: any) => d && (d.message === 'convertOneResult' || d.message === 'convertOneError') // eslint-disable-line 
            );
            if (resp.message === 'convertOneError') {
                throw new Error(resp.error || 'convertOne failed');
            }
            const out: Uint8Array = resp.data;
            dest[<number>destOffset] = out[0];
            dest[destOffset + 1] = out[1];
            dest[destOffset + 2] = out[2];
            return;
        }
        if (this.inType === _PdfDataType.rgb8) {
            const r: number = src[<number>srcOffset] * 255;
            const g: number = src[srcOffset + 1] * 255;
            const b: number = src[srcOffset + 2] * 255;
            this._worker.postMessage({
                message: 'convertThree',
                payload: { id: this.transformerId, dest: dest, destOffset: destOffset, r, g, b, css }
            });
            const resp = await onceMessage<any>( // eslint-disable-line 
                this._worker,
                (d: any) => d && (d.message === 'convertThreeResult' || d.message === 'convertThreeError')); // eslint-disable-line
            if (resp.message === 'convertThreeError') {
                throw new Error(resp.error || 'convertThree failed');
            }
            const out: Uint8Array = resp.data;
            dest[<number>destOffset] = out[0];
            dest[destOffset + 1] = out[1];
            dest[destOffset + 2] = out[2];
            return;
        }
        const c: number = src[<number>srcOffset] * 255;
        const m: number = src[srcOffset + 1] * 255;
        const y: number = src[srcOffset + 2] * 255;
        const k: number = src[srcOffset + 3] * 255;
        this._worker.postMessage({
            message: 'convertFour',
            payload: { id: this.transformerId, dest: dest, destOffset: destOffset, c, m, y, k, css }
        });
        const resp = await onceMessage<any>( // eslint-disable-line 
            this._worker,
            (d: any) => d && (d.message === 'convertFourResult' || d.message === 'convertFourError') // eslint-disable-line 
        );
        if (resp.message === 'convertFourError') {
            throw new Error(resp.error || 'convertFour failed');
        }
        const out: Uint8Array = resp.data;
        dest[<number>destOffset] = out[0];
        dest[destOffset + 1] = out[1];
        dest[destOffset + 2] = out[2];
    }
    /**
     * Converts a sequence of pixels to RGB using the worker transformer.
     *
     * @private
     * @param {any} src Source buffer containing consecutive component values.
     * @param {number} srcOffset Source offset.
     * @param {number} count Number of pixels to convert.
     * @param {any} dest Destination buffer for RGB output.
     * @param {number} destOffset Destination offset.
     * @param {number} bits Bits per component for the source.
     * @param {number} alpha01 Alpha slot flag .
     * @returns {Promise<void>} Resolves when conversion is completed.
     * @throws {Error} If transformer is not initialized or worker reports an error.
     */
    async _getRgbBuffer(src: any, srcOffset: number, count: number, dest: any, // eslint-disable-line 
                        destOffset: number, bits: number, alpha01: number): Promise<void> {
        if (!this.transformerId) {
            throw new Error('ICCBased transformer is not initialized');
        }
        src = src.subarray(srcOffset, srcOffset + count * this.numComps);
        if (bits !== 8) {
            const scale: number = 255 / ((1 << bits) - 1);
            for (let i: number = 0, ii: number = src.length; i < ii; i++) {
                src[<number>i] *= scale;
            }
        }
        this._worker.postMessage(
            {
                message: 'convertWith',
                payload: {
                    id: this.transformerId,
                    src: src,
                    dest: dest,
                    destOffset: destOffset,
                    alpha: !!alpha01
                }
            }
        );
        const resp = await onceMessage<any>( // eslint-disable-line
            this._worker,
            (d: any) => d && (d.message === 'convertWithResult' || d.message === 'convertWithError') // eslint-disable-line
        );
        if (resp.message === 'convertWithError') {
            throw new Error(resp.error || 'convertWith failed');
        }
        const result: Uint8Array = resp.data;
        (dest as Uint8ClampedArray).set(result);
    }
    /**
     * Converts a single pixel to a 24-bit RGB hex value.
     *
     * @private
     * @param {any} src Source buffer.
     * @param {number} srcOffset Source offset.
     * @param {boolean} [css=false] If `true`, returns values suitable for CSS color.
     * @returns {Promise<number>} Resolves to the packed hex value `0xRRGGBB`.
     */
    async _getRgbHex(src: any, srcOffset: number, css: boolean = false): Promise<number> { // eslint-disable-line
        const tmp: Uint8Array = new Uint8Array(3);
        await this._getRgbItem(src, srcOffset, tmp, 0, css);
        return ((tmp[0] << 16) | (tmp[1] << 8) | tmp[2]) >>> 0;
    }
    /**
     * Computes output length  for given input length considering alpha layout.
     *
     * @private
     * @param {number} inputLength Number of input scalars.
     * @param {number} alpha01 Alpha slot flag (0 or 1).
     * @returns {number} Output byte length for RGB(A) layout.
     */
    _getOutputLength(inputLength: number, alpha01: number): number {
        return ((inputLength / this.numComps) * (3 + alpha01)) | 0;
    }
}
