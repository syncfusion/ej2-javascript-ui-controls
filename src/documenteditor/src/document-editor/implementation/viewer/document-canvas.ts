
const GLOBAL_ALPHA: string = 'GA';
const GLOBAL_COMPOSITE_OPERATION: string = 'GCP';
const FILL_STYLE: string = 'FS';
const STROKE_STYLE: string = 'SS';
const DIRECTION: string = 'Dir';
const FONT: string = 'Fn';
const TEXT_ALIGN: string = 'TA';
const TEXT_BASE_LINE: string = 'TBL';
const LINE_WIDTH: string = 'LW';
const LINE_CAP: string = 'LC';
const MAX_WIDTH: string = 'MW';
const BEGIN_PATH: string = 'BP';
const CLOSE_PATH: string = 'CP';
const CLIP: string = 'Cl';
const FILL: string = 'Fl';
const STROKE: string = 'Stk';
const LINE_TO: string = 'LT';
const MOVE_TO: string = 'MT';
const SEGMENTS: string = 'Sgm';
const RECT: string = 'Rt';
const CLEAR_RECT: string = 'CR';
const FILL_RECT: string = 'FR';
const STROKE_RECT: string = 'SR';
const RESTORE: string = 'RES';
const SAVE: string = 'S';
const FILL_TEXT: string = 'FT';
const STROKE_TEXT: string = 'ST';
const SCALE: string = 'SC';

/**
 * @private
 */
export class DocumentCanvasElement {

    /** Gets or sets the height of a canvas element on a document. */
    public height: number;

    /** Gets or sets the width of a canvas element on a document. */
    public width: number;

    public style: CSSStyleDeclaration = {} as any;

    private context: DocumentCanvasRenderingContext2D;

    constructor() {
        this.context = new DocumentCanvasRenderingContext2D();
    }

    /**
     * @param {string} contextId - Specifies the type of context to create, 2d or webgl.
     * @param {CanvasRenderingContext2DSettings} options - Specifies the type of context to create, 2d or webgl.
     * @private
     * @returns {CanvasRenderingContext2D} - Returns the canvas rendering context 2D.
     */
    public getContext(contextId: '2d', options?: CanvasRenderingContext2DSettings): DocumentCanvasRenderingContext2D {
        return this.context;
    }
    /**
     * @param {string} type - Specifies the type of image to return.
     * @param {any} quality - A Number between 0 and 1 indicating the image quality to use for image formats that use lossy compression.
     * @private
     * @returns {string} - Returns the data URL containing a representation of the image in the format specified by the type parameter.
     */
    public toDataURL(type?: string, quality?: any): string {
        return this.context.renderedPath;
    }
}

/**
 * @private
 */
export class DocumentCanvasRenderingContext2D {

    public renderedPath: string = '';

    set globalAlpha(value: number) {
        this.renderedPath += (GLOBAL_ALPHA + ':' + value + ';');
    }
    set globalCompositeOperation(value: any) {
        this.renderedPath += (GLOBAL_COMPOSITE_OPERATION + ':' + value + ';');
    }
    set fillStyle(value: string) {
        this.renderedPath += (FILL_STYLE + ':' + value + ';');
    }
    set strokeStyle(value: string) {
        this.renderedPath += (STROKE_STYLE + ':' + value + ';');
    }
    set direction(value: CanvasDirection) {
        this.renderedPath += (DIRECTION + ':' + value + ';');
    }
    set font(value: string) {
        this.renderedPath += (FONT + ':' + value + ';');
    }
    set textAlign(value: CanvasTextAlign) {
        this.renderedPath += (TEXT_ALIGN + ':' + value + ';');
    }
    set textBaseline(value: CanvasTextBaseline) {
        this.renderedPath += (TEXT_BASE_LINE + ':' + value + ';');
    }

    set lineWidth(value: number) {
        this.renderedPath += (LINE_WIDTH + ':' + value + ';');
    }
    set lineCap(value: number) {
        this.renderedPath += (LINE_CAP + ':' + value + ';');
    }
    public drawImage(image: CanvasImageSource, sx: number, sy: number, sw: number, sh: number,
                     dx?: number, dy?: number, dw?: number, dh?: number): void {
        this.renderedPath += (LINE_CAP + ':' + (image as HTMLImageElement).src + ';');
        this.renderedPath += ('sx:' + sx + ';');
        this.renderedPath += ('sy:' + sy + ';');
        this.renderedPath += ('sw:' + sw + ';');
        this.renderedPath += ('sh:' + sh + ';');
        if (dx) {
            this.renderedPath += ('dx:' + dx + ';');
        }
        if (dy) {
            this.renderedPath += ('dy:' + dy + ';');
        }
        if (dw) {
            this.renderedPath += ('dw:' + dw + ';');
        }
        if (dh) {
            this.renderedPath += ('dh:' + dh + ';');
        }
    }
    public beginPath(): void {
        this.renderedPath += (BEGIN_PATH + ';');
    }
    public clip(fillRule?: CanvasFillRule): void {
        this.renderedPath += (CLIP + ';');
    }
    public fill(fillRule?: CanvasFillRule): void {
        this.renderedPath += (FILL + ';');
    }
    public stroke(): void {
        this.renderedPath += (STROKE + ';');
    }
    public closePath(): void {
        this.renderedPath += (CLOSE_PATH + ';');
    }
    public lineTo(x: number, y: number): void {
        this.renderedPath += (LINE_TO + ':' + 'x:' + x + ';' + 'y:' + y + ';');
    }
    public moveTo(x: number, y: number): void {
        this.renderedPath += (MOVE_TO + ':' + 'x:' + x + ';' + 'y:' + y + ';');
    }
    public rect(x: number, y: number, w: number, h: number): void {
        this.renderedPath += (RECT + ':' + 'x:' + x + ';' + 'y:' + y + ';' + 'w:' + w + ';' + 'h:' + h + ';');
    }
    public setLineDash(segments: number[]): void {
        this.renderedPath += (SEGMENTS + ':' + segments.toString() + ';');
    }
    public clearRect(x: number, y: number, w: number, h: number): void {
        this.renderedPath += (CLEAR_RECT + ':' + 'x:' + x + ';' + 'y:' + y + ';' + 'w:' + w + ';' + 'h:' + h + ';');
    }
    public fillRect(x: number, y: number, w: number, h: number): void {
        this.renderedPath += (FILL_RECT + ':' + 'x:' + x + ';' + 'y:' + y + ';' + 'w:' + w + ';' + 'h:' + h + ';');
    }
    public strokeRect(x: number, y: number, w: number, h: number): void {
        this.renderedPath += (STROKE_RECT + ':' + 'x:' + x + ';' + 'y:' + y + ';' + 'w:' + w + ';' + 'h:' + h + ';');
    }
    public restore(): void {
        this.renderedPath += (RESTORE + ';');
    }
    public save(): void {
        this.renderedPath += (SAVE + ';');
    }

    public fillText(text: string, x: number, y: number, maxWidth?: number): void {
        this.renderedPath += (FILL_TEXT + ':' + text + ';' + 'x:' + x + ';' + 'y:' + y + ';');
        if (maxWidth) {
            this.renderedPath += (MAX_WIDTH + ':' + maxWidth + ';');
        }
    }
    public measureText(text: string): any {
        return { width: 30 };
    }

    public strokeText(text: string, x: number, y: number, maxWidth?: number): void {
        this.renderedPath += (STROKE_TEXT + ':' + text + ';' + 'x:' + x + ';' + 'y:' + y + ';');
        if (maxWidth) {
            this.renderedPath += (MAX_WIDTH + ':' + maxWidth + ';');
        }
    }

    public scale(x: number, y: number): void {
        this.renderedPath += (SCALE + ':' + 'x:' + x + ';' + 'y:' + y + ';');
    }
}
