import { TextStyleModel } from '../appearance-model';
import { Size } from '../../primitives/size';
import { DiagramElement } from './diagram-element';
import { measureText } from './../../utility/dom-util';
import { HyperlinkModel } from './../../objects/annotation-model';
import { AnnotationConstraints } from '../../enum/enum';
import { SubTextElement, TextBounds } from '../..';

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

    public constraints: AnnotationConstraints;

    public hyperlink: HyperlinkModel = {
        color: 'blue'
    };

    /** @private */
    public doWrap: boolean = true;

    public get content(): string {
        return this.textContent;
    }
    public set content(value: string) {
        if (this.textContent !== value) {
            this.textContent = value;
            this.isDirt = true;
            this.doWrap = true;
        }
    }

    private textNodes: SubTextElement[] = [];
    public get childNodes(): SubTextElement[] {
        return this.textNodes;
    }
    public set childNodes(value: SubTextElement[]) {
        this.textNodes = value;
    }

    private textWrapBounds: TextBounds;
    public get wrapBounds(): TextBounds {
        return this.textWrapBounds;
    }
    public set wrapBounds(value: TextBounds) {
        this.textWrapBounds = value;
    }

    /** @private */
    public refreshTextElement(): void {
        this.isDirt = true;
    }

    /**
     * Defines the appearance of the text element 
     */
    public style: TextStyleModel = {
        color: 'black', fill: 'white', strokeColor: 'black',
        strokeWidth: 1, fontFamily: 'Arial', fontSize: 12, whiteSpace: 'CollapseSpace',
        textWrapping: 'WrapWithOverflow', textAlign: 'Center', italic: false, bold: false,
        textDecoration: 'None', strokeDashArray: '', opacity: 5, gradient: null,
        textOverflow: 'Wrap'
    };

    /**
     * Measures the minimum size that is required for the text element
     * @param availableSize
     */
    public measure(availableSize: Size): Size {
        let size: Size;
        if (this.isDirt) {
            size = measureText(this, this.style, this.content, this.width);
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
     * Arranges the text element
     * @param desiredSize 
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

