import { TextStyleModel } from '../appearance-model';
import { Size } from '../../primitives/size';
import { DiagramElement } from './diagram-element';
import { measureText } from './../../utility/dom-util';
import { HyperlinkModel } from './../../objects/annotation-model';
import { AnnotationConstraints } from '../../enum/enum';
import { SubTextElement, TextBounds } from '../../rendering/canvas-interface';

/**
 * TextElement is used to display text/annotations
 */
export class TextElement extends DiagramElement {
    /**
     * set the id for each element
     */
    public constructor() {
        super();
        this.style.fill = 'transparent';
        this.style.strokeColor = 'transparent';
    }
    /**
     * sets or gets the image source
     */
    private textContent: string = '';

    /** @private */
    public canMeasure: boolean = true;

    /** @private */
    public isLaneOrientation: boolean = false;

    /** @private */
    public canConsiderBounds: boolean = true;
    /**
     * sets the constraints for the text element
     */
    public constraints: AnnotationConstraints;

    /**
     * sets the hyperlink color to blue
     */
    public hyperlink: HyperlinkModel = {
        color: 'blue'
    };

    /** @private */
    public doWrap: boolean = true;


    /**
     *   gets the content for the text element \
     *
     * @returns { string | SVGElement }  gets the content for the text element.\
     *
     * @private
     */
    public get content(): string {
        return this.textContent;
    }


    /**
     *   sets the content for the text element \
     *
     * @returns { void }  sets the content for the text element.\
     * @param {string} value - provide the id value.
     *
     * @private
     */
    public set content(value: string) {
        if (this.textContent !== value) {
            this.textContent = value;
            this.isDirt = true;
            this.doWrap = true;
        }
    }

    private textNodes: SubTextElement[] = [];


    /**
     *   gets the content for the text element \
     *
     * @returns { string | SVGElement }  gets the content for the text element.\
     *
     * @private
     */
    public get childNodes(): SubTextElement[] {
        return this.textNodes;
    }


    /**
     *   sets the content for the text element \
     *
     * @returns { void }  sets the content for the text element.\
     * @param {SubTextElement[]} value - provide the id value.
     *
     * @private
     */
    public set childNodes(value: SubTextElement[]) {
        this.textNodes = value;
    }

    private textWrapBounds: TextBounds;

    /**
     *   gets the wrapBounds for the text \
     *
     * @returns { string | SVGElement }  gets the wrapBounds for the text.\
     *
     * @private
     */
    public get wrapBounds(): TextBounds {
        return this.textWrapBounds;
    }

    /**
     *    sets the wrapBounds for the text \
     *
     * @returns { void }   sets the wrapBounds for the text.\
     * @param {TextBounds} value - provide the id value.
     *
     * @private
     */
    public set wrapBounds(value: TextBounds) {
        this.textWrapBounds = value;
    }

    /**
     *    sets the wrapBounds for the text \
     *
     * @returns { void }   sets the wrapBounds for the text.\
     *
     * @private
     */
    public refreshTextElement(): void {
        this.isDirt = true;
    }

    /**
     * Defines the appearance of the text element
     */
    public style: TextStyleModel = {
        color: 'black', fill: 'transparent', strokeColor: 'black',
        strokeWidth: 1, fontFamily: 'Arial', fontSize: 12, whiteSpace: 'CollapseSpace',
        textWrapping: 'WrapWithOverflow', textAlign: 'Center', italic: false, bold: false,
        textDecoration: 'None', strokeDashArray: '', opacity: 5, gradient: null,
        textOverflow: 'Wrap'
    };


    /**
     *Measures the minimum size that is required for the text element\
     *
     * @returns { Size }  Measures the minimum size that is required for the text element.\
     * @param {Size} availableSize - provide the id value.
     *
     * @private
     */
    public measure(availableSize: Size): Size {
        let size: Size;
        if (this.isDirt && this.canMeasure) {
            size = measureText(this, this.style, this.content, this.isLaneOrientation ?
                availableSize.height : (this.width || availableSize.width));
        } else {
            size = this.desiredSize;
        }
        if (this.width === undefined || this.height === undefined) {
            this.desiredSize = new Size(size.width, size.height);
        } else {
            this.desiredSize = new Size(this.width, this.height);
        }
        this.desiredSize = this.validateDesiredSize(this.desiredSize, availableSize);
        return this.desiredSize;
    }


    /**
     * Arranges the text element\
     *
     * @returns { Size }   Arranges the text element.\
     * @param {Size} desiredSize - provide the id value.
     *
     * @private
     */
    public arrange(desiredSize: Size): Size {
        if (desiredSize.width !== this.actualSize.width || desiredSize.height !== this.actualSize.height || this.isDirt) {
            this.doWrap = true;
        }
        this.actualSize = desiredSize;
        this.updateBounds();
        this.isDirt = false;
        return this.actualSize;
    }
}

