import { DiagramElement } from './diagram-element';
import { getContent } from '../../utility/dom-util';
import { AnnotationConstraints } from '../../enum/enum';

/**
 * HTMLElement defines the basic html elements
 */
export class DiagramHtmlElement extends DiagramElement {
    /**
     * set the id for each element
     */
    public constructor(nodeId: string, diagramId: string, annotationId?: string) {
        super();
        this.diagramId = diagramId;
        this.nodeId = nodeId;
        this.annotationId = annotationId;
    }
    private data: string | HTMLElement = '';
    /**
     * Gets the node id for the element
     */
    public nodeId: string = '';
    /**
     * defines the id of the annotation on rendering template on label.
     * @private
     */
    public annotationId: string = '';
    /**
     * defines the constraints of the annotation on rendering template on label.
     * @private
     */
    public constraints: AnnotationConstraints;
    /**
     * Gets the diagram id for the html element
     */
    public diagramId: string = '';
    /**
     * Gets or sets the geometry of the html element
     */
    public get content(): string | HTMLElement {
        return this.data;
    }
    /**
     * Gets or sets the value of the html element
     */
    public set content(value: string | HTMLElement) {
        this.data = value;
        this.template = getContent(this, true) as HTMLElement;
        this.isDirt = true;
    }

    /**
     * defines geometry of the html element
     * @private
     */
    public template: HTMLElement;
}