/**
 * Diagram component
 */
import { TestHelper } from '@syncfusion/ej2-base/helpers/e2e';
// tslint:disable

declare let cy: any;

/**
 * Represents the Diagram helpers.
 */
export class DiagramHelper extends TestHelper {
    /**
     * Specifies the ID of the diagram.
     */
    public id: string;

    /**
     * Specifies the current helper function of the diagram.
     */
    public wrapperFn: Function;

    /**
     * Constructor for creating the helper object for diagram component.
     */
    constructor(id: string, wrapperFn: Function) {
        super();
        this.id = id;
        if (wrapperFn !== undefined) {
            this.wrapperFn = wrapperFn;
        }
        return this;
    }

    /**
     * Gets the root element of the diagram component.
     */
    public getElement() {
        return this.selector('#' + this.id);
    }

    /**
     * Gets the background layer element of the diagram component.
     */
    public getBackgroundLayerElement() {
        return this.selector('#' + this.id + '_backgroundLayer_svg');
    }

    /**
     * Gets the grid layer element of the diagram component.
     */
    public getGridLineLayerElement() {
        return this.selector('#' + this.id + '_gridline_svg');
    }

    /**
     * Gets the diagram element, which will have the diagram objects like nodes, connectors, and more.
     */
    public getDiagramLayerElement() {
        return this.selector('#' + this.id + '_diagramLayer_div');
    }

    /**
     * Gets the native layer element of the diagram component, which will have the native node content.
     */
    public getNativeLayerElement() {
        return this.selector('#' + this.id + '_nativeLayer_svg');
    }

    /**
     * Gets the HTML layer element of the diagram component, which will have the HTML node content.
     */
    public getHTMLLayerElement(): HTMLElement {
        return this.selector('#' + this.id + '_htmlLayer');
    }

    /**
     * Gets the adorner layer element of the diagram component, which will have the selector elements and user handle elements.
     */
    public getAdornerLayerElement() {
        return this.selector('#' + this.id + '_diagramAdornerLayer');
    }

    /**
     * Gets the adorner layer element of the diagram component, which will have the selector elements.
     */
    public getSelectorElment() {
        return this.selector('#' + this.id + '_SelectorElement');
    }

    /**
     * Returns specific node element. 
     * @param ID Defines the ID of the node object. 
     */
    public getNodeElement(id: string) {
        return this.selector('#' + id + '_groupElement');
    }

    /**
     * Returns specific port element. 
     * @param parentId Defines node ID, which will have the multiple ports. 
     * @param portId Defines port ID.
     */
    public getPortElement(parentId: string, portId: string) {
        return this.selector('#' + parentId + '_' + portId);
    }

    /**
     * Returns specific icons element. 
     * @param parentId Defines node ID, which will have the multiple icons 
     */
    public getIconElement(parentId: string) {
        return this.selector('#' + parentId + '_icon_content_groupElement');
    }

    /**
     * Returns specific connector element. 
     * @param ID Defines the ID of the connector object. 
     */
    public getConnecorElement(id: string) {
        return this.selector('#' + id + '_groupElement');
    }

    /**
     * Returns specific decorator element. 
     * @param connectorId Defines the ID of the connector object. 
     * @param isTargetDecorator Defines whether the decorator is source or target. 
     */
    public getDecoratorElement(connectorId: string, isTargetDecorator: boolean) {
        return isTargetDecorator ?
            this.selector('#' + connectorId + '_tarDec_groupElement') : this.selector('#' + connectorId + '_srcDec_groupElement');
    }

    /**
     * Returns specific node element. 
     * @param parentId Defines node ID, which will have the multiple labels. 
     * @param portId Defines label ID.
     */
    public getAnnotationElement(parentId: string, annotationId: string) {
        return this.selector('#' + parentId + annotationId + '_groupElement');
    }
    // tslint:enable
}