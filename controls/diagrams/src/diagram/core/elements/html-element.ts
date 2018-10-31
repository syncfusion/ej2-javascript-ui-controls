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
    public nodeId: string = '';
    public diagramId: string = '';
    /**
     * Gets or sets the geometry of the html element
     */
    public get content(): string | HTMLElement {
        return this.data;
    }
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