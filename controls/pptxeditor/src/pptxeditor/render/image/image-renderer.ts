import { PictureMediaResponse, PictureRenderSnapshot } from '@syncfusion/ej2-pptx';
import { resolveRenderColor, RenderColor } from '../background/color';
import { emuToPoint } from '../units';
import { SlideShapeSnapshot } from '../shape-render-model';

const SVG_NS: string = 'http://www.w3.org/2000/svg';

/** CSS presentation derived from the picture effect list.  @internal */
/**
 * @internal
 */
export interface PictureEffectStyle {
    /** CSS `filter` expression, or an empty string when no filter applies. */
    readonly filter: string;
    /** Resolved opacity in the 0..1 range. */
    readonly opacity: number;
}

/** Inputs required to build the HTML for one `p:pic` element.  @internal */
/**
 * @internal
 */
export interface ImageRenderInput {
    /** Picture-bearing slide element; supplies id, name, transform and line. */
    readonly shape: SlideShapeSnapshot;
    /** Picture binding (crop, tile, effects, alt text). */
    readonly picture: PictureRenderSnapshot;
    /** Loaded picture bytes metadata, used for tile sizing. */
    readonly media: PictureMediaResponse;
    /** Browser-loadable source URL for the image bytes. */
    readonly url: string;
    /** Authored geometry clip as a CSS `path()` in CSS pixels; omitted for rectangles. */
    readonly clipPathPx?: string;
}

/** Elements produced for one picture.  @internal */
/**
 * @internal
 */
export interface ImageRenderResult {
    /** The `<div>` that wraps the `<img>`. */
    readonly element: HTMLDivElement;
    /** Optional outline element for non-rectangular pictures. */
    readonly border?: HTMLDivElement;
}

/**
 * Ports the subset of `RendererBase.ApplyImageEffect` expressible as browser image styles.
 *
 * @param {PictureRenderSnapshot} picture - Picture binding.
 * @returns {PictureEffectStyle} CSS filter and opacity.
 * @internal
 */
export function resolvePictureEffects(picture: PictureRenderSnapshot): PictureEffectStyle {
    const filters: string[] = [];
    let opacity: number = 1;
    for (const effect of picture.direct.effects) {
        if (effect.kind === 'grayscale') {
            filters.push('grayscale(1)');
        }
        if (effect.kind === 'luminance') {
            if (effect.brightness !== undefined) {
                filters.push(`brightness(${formatNumber(1 + effect.brightness)})`);
            }
            if (effect.contrast !== undefined) {
                filters.push(`contrast(${formatNumber(1 + effect.contrast)})`);
            }
        }
        if (effect.kind === 'alphaModFix' && effect.amount !== undefined) {
            opacity *= effect.amount;
        }
        if (effect.kind === 'alphaOffset' && effect.amount !== undefined) {
            opacity += effect.amount;
        }
    }
    return { filter: filters.join(' '), opacity: Math.max(0, Math.min(1, opacity)) };
}

/**
 * Renders `p:pic` elements as `<div><img></div>` HTML (never as SVG `<image>`),
 * following the Image / Picture row of the Element-to-HTML mapping.
 * @internal
 */
export class ImageRenderer {
    /**
     * Builds the HTML for one picture.
     *
     * @param {ImageRenderInput} input - Picture, geometry and source URL.
     * @returns {ImageRenderResult | undefined} Elements, or undefined for empty bounds.
     */
    public render(input: ImageRenderInput): ImageRenderResult | undefined {
        const transform: SlideShapeSnapshot['transform'] = input.shape.transform;
        if (!transform || transform.cx === undefined || transform.cy === undefined) {
            return undefined;
        }
        const width: number = emuToPoint(transform.cx);
        const height: number = emuToPoint(transform.cy);
        if (width <= 0 || height <= 0) {
            return undefined;
        }
        const box: HTMLDivElement = document.createElement('div');
        box.className = 'ej2-pptx-picture-box';
        box.dataset.pictureShapeId = input.shape.id;
        box.dataset.shapeId = input.shape.id;
        this.applyBoxStyle(box, input.shape, width, height);
        this.applyAccessibility(box, input);
        const effects: PictureEffectStyle = resolvePictureEffects(input.picture);
        if (input.picture.direct.tile) {
            this.applyTile(box, input, effects);
        } else {
            box.appendChild(this.createImage(input, width, height, effects));
        }
        if (input.clipPathPx) {
            box.style.clipPath = `path("${input.clipPathPx}")`;
        }
        const border: HTMLDivElement | undefined = this.applyBorder(box, input, width, height);
        return { element: box, border };
    }

    private applyBoxStyle(box: HTMLDivElement, shape: SlideShapeSnapshot, width: number, height: number): void {
        const transform: SlideShapeSnapshot['transform'] = shape.transform;
        box.style.position = 'absolute';
        box.style.left = `${formatNumber(emuToPoint(transform.x || 0))}pt`;
        box.style.top = `${formatNumber(emuToPoint(transform.y || 0))}pt`;
        box.style.width = `${formatNumber(width)}pt`;
        box.style.height = `${formatNumber(height)}pt`;
        box.style.overflow = 'hidden';
        box.style.pointerEvents = 'auto';
        box.style.transformOrigin = 'center center';
        const operations: string[] = [];
        if (transform.rotationDegrees) {
            operations.push(`rotate(${formatNumber(transform.rotationDegrees)}deg)`);
        }
        if (transform.flipHorizontal || transform.flipVertical) {
            operations.push(`scale(${transform.flipHorizontal ? -1 : 1}, ${transform.flipVertical ? -1 : 1})`);
        }
        if (operations.length > 0) {
            box.style.transform = operations.join(' ');
        }
    }

    private applyAccessibility(box: HTMLDivElement, input: ImageRenderInput): void {
        if (input.picture.description === '') {
            box.setAttribute('aria-hidden', 'true');
            return;
        }
        box.setAttribute('role', 'img');
        box.setAttribute('aria-label',
                         input.picture.description || input.picture.title || input.shape.name || `Picture ${input.shape.id}`);
    }

    private createImage(
        input: ImageRenderInput,
        width: number,
        height: number,
        effects: PictureEffectStyle
    ): HTMLImageElement {
        const crop: import('@syncfusion/ej2-pptx').PictureRelativeRectangleSnapshot = input.picture.direct.sourceRectangle;
        const left: number = crop && crop.left || 0;
        const top: number = crop && crop.top || 0;
        const visibleWidth: number = Math.max(0.000001, 1 - left - (crop && crop.right || 0));
        const visibleHeight: number = Math.max(0.000001, 1 - top - (crop && crop.bottom || 0));
        const image: HTMLImageElement = document.createElement('img');
        image.className = 'ej2-pptx-picture';
        image.src = input.url;
        image.alt = '';
        image.draggable = false;
        image.style.position = 'absolute';
        image.style.maxWidth = 'none';
        image.style.left = `${formatNumber(-(left / visibleWidth) * width)}pt`;
        image.style.top = `${formatNumber(-(top / visibleHeight) * height)}pt`;
        image.style.width = `${formatNumber(width / visibleWidth)}pt`;
        image.style.height = `${formatNumber(height / visibleHeight)}pt`;
        image.style.objectFit = 'fill';
        this.applyEffects(image, effects);
        return image;
    }

    // Ports `GDIRenderer.GetTextureBrush`: tiles use CSS background repetition on the
    // wrapper, so no `<img>` or SVG pattern is needed. Mirror tile flips are not reproduced.
    private applyTile(box: HTMLDivElement, input: ImageRenderInput, effects: PictureEffectStyle): void {
        const tile: import('@syncfusion/ej2-pptx').PictureTileSnapshot = input.picture.direct.tile;
        const intrinsic: import('@syncfusion/ej2-pptx').PictureIntrinsicSizeSnapshot = input.media.intrinsicSize;
        const width: number = emuToPoint(input.shape.transform.cx || 0);
        const height: number = emuToPoint(input.shape.transform.cy || 0);
        const tileWidth: number = Math.max(1, (intrinsic && intrinsic.widthPx || width) * (tile.scaleX || 1));
        const tileHeight: number = Math.max(1, (intrinsic && intrinsic.heightPx || height) * (tile.scaleY || 1));
        box.classList.add('ej2-pptx-picture-tiled');
        box.dataset.tileFlip = tile.flip || 'none';
        box.style.backgroundImage = `url("${input.url}")`;
        box.style.backgroundRepeat = 'repeat';
        box.style.backgroundSize = `${formatNumber(tileWidth)}pt ${formatNumber(tileHeight)}pt`;
        box.style.backgroundPosition =
            `${formatNumber(emuToPoint(tile.offsetXEmu || 0))}pt ${formatNumber(emuToPoint(tile.offsetYEmu || 0))}pt`;
        this.applyEffects(box, effects);
    }

    private applyEffects(element: HTMLElement, effects: PictureEffectStyle): void {
        if (effects.filter) {
            element.style.filter = effects.filter;
        }
        if (effects.opacity !== 1) {
            element.style.opacity = formatNumber(effects.opacity);
        }
    }

    private applyBorder(
        box: HTMLDivElement,
        input: ImageRenderInput,
        width: number,
        height: number
    ): HTMLDivElement | undefined {
        const line: SlideShapeSnapshot['line'] = input.shape.line;
        if (!line.present || line.fill.kind !== 'solid') {
            return undefined;
        }
        const color: RenderColor = resolveRenderColor(line.fill.color, line.fill.colorTransforms);
        const strokePt: number = emuToPoint(line.widthEmu || 12700);
        if (!input.clipPathPx) {
            // A centred stroke straddles the edge: the outline starts half a stroke inside it.
            box.style.outline = `${formatNumber(strokePt)}pt solid ${toCssColor(color)}`;
            box.style.outlineOffset = `${formatNumber(-strokePt / 2)}pt`;
            return undefined;
        }
        return this.createGeometryBorder(box, input.clipPathPx, color, strokePt, width, height);
    }

    // Non-rectangular outlines cannot be a CSS outline; a sibling overlay strokes the geometry path.
    private createGeometryBorder(
        box: HTMLDivElement,
        clipPathPx: string,
        color: RenderColor,
        strokePt: number,
        width: number,
        height: number
    ): HTMLDivElement {
        const border: HTMLDivElement = document.createElement('div');
        border.className = 'ej2-pptx-picture-border';
        border.dataset.pictureBorderFor = box.dataset.pictureShapeId || '';
        border.setAttribute('aria-hidden', 'true');
        border.style.cssText = box.style.cssText;
        border.style.overflow = 'visible';
        border.style.clipPath = '';
        border.style.filter = '';
        border.style.opacity = '';
        border.style.pointerEvents = 'none';
        const svg: SVGSVGElement = document.createElementNS(SVG_NS, 'svg') as SVGSVGElement;
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
        svg.setAttribute('viewBox', `0 0 ${formatNumber(width * 96 / 72)} ${formatNumber(height * 96 / 72)}`);
        svg.style.overflow = 'visible';
        const path: SVGPathElement = document.createElementNS(SVG_NS, 'path') as SVGPathElement;
        path.setAttribute('d', clipPathPx);
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', color.color);
        path.setAttribute('stroke-opacity', formatNumber(color.opacity));
        path.setAttribute('stroke-width', formatNumber(strokePt * 96 / 72));
        svg.appendChild(path);
        border.appendChild(svg);
        return border;
    }
}

function toCssColor(color: RenderColor): string {
    const hex: string = color.color.replace('#', '');
    const red: number = parseInt(hex.substr(0, 2), 16);
    const green: number = parseInt(hex.substr(2, 2), 16);
    const blue: number = parseInt(hex.substr(4, 2), 16);
    return `rgba(${red}, ${green}, ${blue}, ${formatNumber(color.opacity)})`;
}

function formatNumber(value: number): string {
    return Number.isInteger(value) ? String(value) : String(Number(value.toFixed(6)));
}
