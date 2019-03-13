/**
 * Diagram component
 */
import { TestHelper } from '@syncfusion/ej2-base/helpers/e2e';
// tslint:disable

declare let cy: any;
export class DiagramHelper extends TestHelper {
    public id: string;
    public wrapperFn: Function;
    constructor(id: string, wrapperFn: Function) {
        super();
        this.id = id;
        if (wrapperFn !== undefined) {
            this.wrapperFn = wrapperFn;
        }
        return this;
    }
    public getElement() {
        return this.selector('#' + this.id);
    }
    public getBackgroundLayerElement() {
        return this.selector('#' + this.id + '_backgroundLayer_svg');
    }
    public getGridLineLayerElement() {
        return this.selector('#' + this.id + '_gridline_svg');
    }
    public getDiagramLayerElement() {
        return this.selector('#' + this.id + '_diagramLayer_div');
    }
    public getNativeLayerElement() {
        return this.selector('#' + this.id + '_nativeLayer_svg');
    }
    public getHTMLLayerElement(): HTMLElement {
        return this.selector('#' + this.id + '_htmlLayer');
    }
    public getAdornerLayerElement() {
        return this.selector('#' + this.id + '_diagramAdornerLayer');
    }
    public getSelectorElment() {
        return this.selector('#' + this.id + '_SelectorElement');
    }
    public getNodeElement(id: string) {
        return this.selector('#' + id + '_groupElement');
    }
    public getPortElement(parentId: string, portId: string) {
        return this.selector('#' + parentId + '_' + portId);
    }
    public getIconElement(parentId: string) {
        return this.selector('#' + parentId + '_icon_content_groupElement');
    }
    public getConnecorElement(id: string) {
        return this.selector('#' + id + '_groupElement');
    }
    public getDecoratorElement(connectorId: string, isTargetDecorator: boolean) {
        return isTargetDecorator ?
            this.selector('#' + connectorId + '_tarDec_groupElement') : this.selector('#' + connectorId + '_srcDec_groupElement');
    }
    public getAnnotationElement(parentId: string, annotationId: string) {
        return this.selector('#' + parentId + annotationId + '_groupElement');
    }
    // tslint:enable
}