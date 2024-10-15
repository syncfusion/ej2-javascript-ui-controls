import { DrawingElement } from '../core/elements/drawing-element';
import { PathElement } from '../core/elements/path-element';
import { TextElement } from '../core/elements/text-element';
import { Container } from '../core/containers/container';
import { wordBreakToString, whiteSpaceToString, textAlignToString } from '../utility/base-util';
import { getDiagramElement } from '../utility/dom-util';

import { PathAttributes, TextAttributes, ImageAttributes } from './canvas-interface';
import { RectAttributes, BaseAttributes } from './canvas-interface';
import { WhiteSpace, TextAlign, TextWrap } from '../enum/enum';
import { CanvasRenderer } from './canvas-renderer';
import { ImageElement } from '../core/elements/image-element';

/**
 * Renderer module is used to render basic diagram elements
 */
/** @private */
export class DrawingRenderer {
    /**   @private  */
    public renderer: CanvasRenderer = null;
    private diagramId: string;
    /** @private */
    public adornerSvgLayer: SVGSVGElement;
    // private svgRenderer: SvgRenderer;
    /** @private */
    public isSvgMode: Boolean = true;
    /** @private */
    private element: HTMLElement;
    constructor(name: string, isSvgMode: Boolean) {
        this.diagramId = name;
        this.element = getDiagramElement(this.diagramId);
        this.isSvgMode = isSvgMode;
        this.renderer = new CanvasRenderer();
        //  this.svgRenderer = new SvgRenderer();
    }

    // /** @private */
    // public setLayers(): void {
    //     this.adornerSvgLayer = this.element.getElementsByClassName('e-adorner-layer')[0] as SVGSVGElement;
    // }

    /**   @private  */
    public renderElement(
        element: DrawingElement, canvas: HTMLCanvasElement | SVGElement, htmlLayer: HTMLElement, transform?: Transforms,
        parentSvg?: SVGSVGElement, createParent?: boolean, fromPalette?: boolean, indexValue?: number):
        void {
        let isElement: boolean = true;
        if (element instanceof Container) {
            isElement = false;
            this.renderContainer(element, canvas, htmlLayer, transform, parentSvg, createParent, fromPalette, indexValue);
        } else if (element instanceof ImageElement) {
            this.renderImageElement(element, canvas, transform, parentSvg, fromPalette);
        } else if (element instanceof PathElement) {
            this.renderPathElement(element, canvas, transform, parentSvg, fromPalette);
        } else if (element instanceof TextElement) {
            this.renderTextElement(element, canvas, transform, parentSvg, fromPalette);
        } else {
            this.renderRect(element, canvas, transform, parentSvg);
        }
    }
    /**   @private  */
    public renderImageElement(
        element: ImageElement, canvas: HTMLCanvasElement | SVGElement,
        transform?: Transforms, parentSvg?: SVGSVGElement, fromPalette?: boolean):
        void {
        let options: BaseAttributes = this.getBaseAttributes(element, transform);
        (options as RectAttributes).cornerRadius = 0;
        this.renderer.drawRectangle(canvas as HTMLCanvasElement, options as RectAttributes);
        // let sx: number; let sy: number;
        let imageWidth: number; let imageHeight: number;
        let sourceWidth: number; let sourceHeight: number;

        if (element.stretch === 'Stretch') {
            imageWidth = element.actualSize.width;
            imageHeight = element.actualSize.height;
        } else {
            let contentWidth: number = element.contentSize.width;
            let contentHeight: number = element.contentSize.height;

            let widthRatio: number = options.width / contentWidth;
            let heightRatio: number = options.height / contentHeight;

            let ratio: number;
            switch (element.stretch) {
                case 'Meet':
                    ratio = Math.min(widthRatio, heightRatio);
                    imageWidth = contentWidth * ratio;
                    imageHeight = contentHeight * ratio;
                    options.x += Math.abs(options.width - imageWidth) / 2;
                    options.y += Math.abs(options.height - imageHeight) / 2;
                    break;
                case 'Slice':
                    widthRatio = options.width / contentWidth;
                    heightRatio = options.height / contentHeight;
                    ratio = Math.max(widthRatio, heightRatio);
                    imageWidth = contentWidth * ratio;
                    imageHeight = contentHeight * ratio;
                    sourceWidth = options.width / imageWidth * contentWidth;
                    sourceHeight = options.height / imageHeight * contentHeight;
                    break;
                case 'None':
                    imageWidth = contentWidth;
                    imageHeight = contentHeight;
                    break;
            }
        }
        options.width = imageWidth;
        options.height = imageHeight;

        //Commented for code coverage
        //(options as ImageAttributes).sourceX = sx;
        //(options as ImageAttrib                                                                           utes).sourceY = sy;
        (options as ImageAttributes).sourceWidth = sourceWidth;
        (options as ImageAttributes).sourceHeight = sourceHeight;
        (options as ImageAttributes).source = element.source;
        (options as ImageAttributes).alignment = element.imageAlign;
        (options as ImageAttributes).scale = element.imageScale;
        (options as ImageAttributes).printID = element.printID;
        this.renderer.drawImage(canvas as HTMLCanvasElement, options as ImageAttributes, parentSvg, fromPalette);
    }

    /**   @private  */
    public renderPathElement(
        element: PathElement, canvas: HTMLCanvasElement | SVGElement,
        transform?: Transforms, parentSvg?: SVGSVGElement, fromPalette?: boolean):
        void {
        let options: BaseAttributes = this.getBaseAttributes(element, transform);
        (options as PathAttributes).data = element.absolutePath;
        (options as PathAttributes).data = element.absolutePath;
        let ariaLabel: Object = element.id;
        if (!this.isSvgMode) {
            options.x = options.x;
            options.y = options.y;
        }
        this.renderer.drawPath(canvas as HTMLCanvasElement, options as PathAttributes);
    }

    /**   @private  */
    public renderTextElement(
        element: TextElement, canvas: HTMLCanvasElement | SVGElement,
        transform?: Transforms, parentSvg?: SVGSVGElement, fromPalette?: boolean):
        void {

        let options: BaseAttributes = this.getBaseAttributes(element, transform);
        (options as RectAttributes).cornerRadius = 0;
        (options as TextAttributes).whiteSpace = whiteSpaceToString(element.style.whiteSpace, element.style.textWrapping);
        (options as TextAttributes).content = element.content;
        (options as TextAttributes).breakWord = wordBreakToString(element.style.textWrapping);
        (options as TextAttributes).textAlign = textAlignToString(element.style.textAlign);
        (options as TextAttributes).color = element.style.color;
        (options as TextAttributes).italic = element.style.italic;
        (options as TextAttributes).bold = element.style.bold;
        (options as TextAttributes).fontSize = element.style.fontSize;
        (options as TextAttributes).fontFamily = element.style.fontFamily;
        (options as TextAttributes).textOverflow = element.style.textOverflow;
        (options as TextAttributes).textDecoration = element.style.textDecoration;
        (options as TextAttributes).doWrap = element.doWrap;
        (options as TextAttributes).wrapBounds = element.wrapBounds;
        (options as TextAttributes).childNodes = element.childNodes;
        options.dashArray = ''; options.strokeWidth = 0; options.fill = element.style.fill;
        let ariaLabel: Object = element.content ? element.content : element.id;
        this.renderer.drawRectangle(canvas as HTMLCanvasElement, options as RectAttributes);
        this.renderer.drawText(canvas as HTMLCanvasElement, options as TextAttributes);
    }


    /**   @private  */
    public renderContainer(
        group: Container, canvas: HTMLCanvasElement | SVGElement, htmlLayer: HTMLElement,
        transform?: Transforms, parentSvg?: SVGSVGElement, createParent?: boolean, fromPalette?: boolean, indexValue?: number):
        void {
        transform = { tx: 0, ty: 0, scale: 1 };
        let svgParent: SvgParent = { svg: parentSvg, g: canvas };
        if (this.diagramId) {
            parentSvg = parentSvg;
        }
        this.renderRect(group, canvas, transform, parentSvg);
        if (group.hasChildren()) {
            let parentG: HTMLCanvasElement | SVGElement;
            let svgParent: SvgParent;
            for (let child of group.children) {
                this.renderElement(child, parentG || canvas, htmlLayer, transform, parentSvg, true, fromPalette, indexValue);

            }

        }
    }
    /**   @private  */
    public renderRect(element: DrawingElement, canvas: HTMLCanvasElement | SVGElement, transform?: Transforms, parentSvg?: SVGSVGElement):
        void {
        let options: RectAttributes = this.getBaseAttributes(element, transform);
        options.cornerRadius = element.cornerRadius || 0;
        let ariaLabel: Object = element.id;
        this.renderer.drawRectangle(canvas as HTMLCanvasElement, options);
    }

    /**   @private  */
    public getBaseAttributes(element: DrawingElement, transform?: Transforms): BaseAttributes {
        let options: BaseAttributes = {
            width: element.actualSize.width, height: element.actualSize.height,
            x: element.offsetX - element.actualSize.width * element.pivot.x + 0.5,
            y: element.offsetY - element.actualSize.height * element.pivot.y + 0.5,
            fill: element.style.fill, stroke: element.style.strokeColor, angle: element.rotateAngle + element.parentTransform,
            pivotX: element.pivot.x, pivotY: element.pivot.y, strokeWidth: element.style.strokeWidth,
            dashArray: element.style.strokeDashArray || '', opacity: element.style.opacity,
            visible: element.visible, id: element.id, gradient: element.style.gradient,
        };

        if (transform) {
            options.x += transform.tx;
            options.y += transform.ty;
        }
        return options;
    }
}

interface SvgParent {
    g: HTMLCanvasElement | SVGElement;
    svg: SVGSVGElement;
}

interface TextStyle {
    width: number;
    height: number;
    whiteSpace: WhiteSpace;
    content: string;
    breakWord: TextWrap;
    fontSize: number;
    fontFamily: string;
    offsetX: number;
    offsetY: number;
    bold: boolean;
    italic: boolean;
    textAlign: TextAlign;
    color: string;
    pivotX: number;
    pivotY: number;
    fill: string;
}

interface Transforms {
    tx: number;
    ty: number;
    scale: number;
}