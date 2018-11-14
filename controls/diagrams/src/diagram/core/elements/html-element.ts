import { DiagramElement } from './diagram-element';
import { getContent } from '../../utility/dom-util';

/**
 * HTMLElement defines the basic html elements
 */
export class DiagramHtmlElement extends DiagramElement {
    /**
     * set the id for each element
     */
    public constructor(nodeId: string, diagramId: string) {
        super();
        this.diagramId = diagramId;
        this.nodeId = nodeId;
    }
    private data: string | HTMLElement = '';

    /**
     * Gets the node id for the element
     */
    public nodeId: string = '';

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