import { Size } from '../../primitives/size';
import { DiagramElement } from './diagram-element';
import { measureNativeContent, getContent, measureNativeSvg } from './../../utility/dom-util';
import { Stretch } from '../../enum/enum';
import { PointModel } from '../../primitives/point-model';
import { Rect } from '../../primitives/rect';

/**
 * NativeElement defines the basic native elements
 */
export class DiagramNativeElement extends DiagramElement {
    /**
     * set the id for each element
     */
    public constructor(nodeId: string, diagramId: string) {
        super();
        this.diagramId = diagramId;
        this.nodeId = nodeId;
    }
     private data: string | SVGElement = '';

    /**
     * set the node id
     */
    public nodeId: string = '';
    /**
     * set the diagram id
     */
    public diagramId: string = '';

    /**   @private  */
    public get content(): string | SVGElement {
        return this.data;
    }
    /**
     * sets the geometry of the native element
     */
    public set content(value: string | SVGElement) {
        this.data = value;
        this.template = getContent(this, false) as SVGElement;
        this.isDirt = true;
    }

    /**
     * defines geometry of the native element
     * @private
     */
    public template: SVGElement;

    /**
     * sets scaling factor of the Native Element
     */
    public scale: Stretch = 'Stretch';

    /**
     * Saves the actual size of the Native Element
     * @private
     */
    public contentSize: Size;

    /**
     * Saves the top left point of the Native Element
     * @private
     */
    public templatePosition: PointModel;

    /**
     * Measures minimum space that is required to render the Native Element
     * @param availableSize
     */
    public measure(availableSize: Size): Size {
        if (this.isDirt) {
            let rect: Rect = measureNativeContent(this.template);
            this.contentSize = new Size();
            this.contentSize.width = rect.width;
            this.contentSize.height = rect.height;
            let x: number = rect.x;
            let y: number = rect.y;
            this.templatePosition = {x, y};
            this.isDirt = false;
        }
        if (this.width === undefined || this.height === undefined) {
            let getAvailableSize: Rect = measureNativeSvg(this.template);
            this.desiredSize = new Size(getAvailableSize.width, getAvailableSize.height);
        } else {
            this.desiredSize = new Size(this.width, this.height);
        }
        this.desiredSize = this.validateDesiredSize(this.desiredSize, availableSize);
        return this.desiredSize;
    }

    /**
     * Arranges the Native Element
     * @param desiredSize 
     */
    public arrange(desiredSize: Size): Size {
        this.actualSize = new Size(this.desiredSize.width, this.desiredSize.height);
        this.updateBounds();
        return this.actualSize;
    }
}