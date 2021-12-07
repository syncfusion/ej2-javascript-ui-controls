import { DiagramElement } from './diagram-element';
import { getContent } from '../../utility/dom-util';
import { AnnotationConstraints } from '../../enum/enum';
import { templateCompiler } from '../../utility/base-util';

/**
 * HTMLElement defines the basic html elements
 */
export class DiagramHtmlElement extends DiagramElement {

    /**
     * set the id for each element \
     *
     * @returns { void }set the id for each element\
     * @param {string} nodeId - provide the x value.
     * @param {string} diagramId - provide the y value.
     * @param {string} annotationId - provide the id value.
     * @param {string} nodeTemplate - provide the id value.
     *
     * @private
     */
    public constructor(nodeId: string, diagramId: string, annotationId?: string, nodeTemplate?: string) {
        super();
        this.diagramId = diagramId;
        this.nodeId = nodeId;
        this.annotationId = annotationId;
        this.templateFn = templateCompiler(nodeTemplate);
    }

    /**
     * getNodeTemplate method \
     *
     * @returns { Function } getNodeTemplate method .\
     *
     * @private
     */
    public getNodeTemplate(): Function {
        return this.templateFn;
    }

    // eslint-disable-next-line @typescript-eslint/ban-types
    private templateFn: Function;

    private data: string | HTMLElement = '';
    /**
     * Gets the node id for the element
     */
    public nodeId: string = '';

    /**
     * check whether it is html element or not
     *
     * @private
     */
    public isTemplate: boolean;

    /**
     * defines the id of the annotation on rendering template on label.
     * @private
     */
    public annotationId: string = '';
    /**
     * defines the constraints of the annotation on rendering template on label.
     *
     * @private
     */
    public constraints: AnnotationConstraints;
    /**
     * Gets the diagram id for the html element
     */
    public diagramId: string = '';
    /**
     * Specifies whether the getcontent has to be executed or not.
     */
    private canReset: boolean;

    /**
     * Gets or sets the geometry of the html element \
     *
     * @returns { string | HTMLElement } Gets or sets the geometry of the html element \
     *
     * @private
     */
    public get content(): string | HTMLElement {
        return this.data;
    }

    /**
     * Gets or sets the value of the html element \
     *
     * @returns { void }Gets or sets the value of the html element\
     * @param {string | HTMLElement} value - provide the value value.
     *
     * @private
     */
    public set content(value: string | HTMLElement) {
        this.data = value;
        if (!this.canReset) {
            this.canReset = true;
            if (!this.isTemplate) {
                this.template = getContent(this, true) as HTMLElement;
            }
            this.canReset = false;
            this.isDirt = true;
        }
    }

    /**
     * defines geometry of the html element
     *
     * @private
     */
    public template: HTMLElement;
}
