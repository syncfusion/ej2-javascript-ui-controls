import { Size } from '../../primitives/size';
import { DrawingElement } from './drawing-element';
import { Stretch, Scale, ImageAlignment } from '../../enum/enum';
import { measureImage } from './../../utility/dom-util';
/**
 * ImageElement defines a basic image elements
 */
export class ImageElement extends DrawingElement {
    /**
     * set the id for each element
     */
    public constructor() {
        super();
    }
    /**
     * sets or gets the image source
     */
    private imageSource: string = '';

    /**
     * sets or gets the print id
     * @private
     */
    public printID: string = '';

    /**
     * Gets the source for the image element
     */
    public get source(): string {
        return this.imageSource;
    }

    /**
     * Sets the source for the image element
     */
    public set source(value: string) {
        this.imageSource = value;
        this.isDirt = true;
    }
    /**
     * sets scaling factor of the image
     */
    public imageScale: Scale = 'None';
    /**
     * sets the alignment of the image
     */
    public imageAlign: ImageAlignment = 'None';
    /**
     * Sets how to stretch the image
     */
    public stretch: Stretch = 'Stretch';
    /**
     * Saves the actual size of the image
     */
    public contentSize: Size;

    /**
     * Measures minimum space that is required to render the image
     * @param availableSize 
     */
    public measure(availableSize: Size): Size {
        if (this.isDirt && (this.stretch !== 'Stretch' || this.width === undefined && this.height === undefined)) {
            this.contentSize = measureImage(this.source, this.contentSize);
            this.isDirt = false;
        }
        if (this.width !== undefined && this.height !== undefined) {
            this.desiredSize = new Size(this.width, this.height);
            this.contentSize = this.desiredSize;
        } else {
            this.desiredSize = this.contentSize;
        }
        this.desiredSize = this.validateDesiredSize(this.desiredSize, availableSize);
        return this.desiredSize;
    }

    /**
     * Arranges the image
     * @param desiredSize 
     */
    public arrange(desiredSize: Size): Size {
        this.actualSize = new Size(this.desiredSize.width, this.desiredSize.height);
        this.updateBounds();
        return this.actualSize;
    }
}