import { Directive, ViewContainerRef, ContentChildren } from '@angular/core';
import { ComplexBase, ArrayBase, setValue } from '@syncfusion/ej2-angular-base';



let input: string[] = ['alignment', 'cornerRadius', 'displacement', 'fill', 'handleStrokeColor', 'handleStrokeWidth', 'height', 'iconStrokeColor', 'iconStrokeWidth', 'id', 'offset', 'padding', 'pathData', 'tooltip', 'visibility', 'width'];
let outputs: string[] = [];
/**
 * Connectors Directive
 * ```html
 * <e-connectors>
 * <e-connector>
 * <e-connector-fixeduserhandles>
 * <e-connector-fixeduserhandle>
 * </e-connector-fixeduserhandle>
 * </e-connector-fixeduserhandles>
 * </e-connector>
 * </e-connectors>
 * ```
 */
@Directive({
    selector: 'e-connector>e-connector-fixeduserhandles>e-connector-fixeduserhandle',
    inputs: input,
    outputs: outputs,
    standalone: true,
    queries: {
    }
})
export class ConnectorFixedUserHandleDirective extends ComplexBase<ConnectorFixedUserHandleDirective> {
    public directivePropList: any;
	


    /** 
     * Specifies the segment alignment of the fixed user handle 
     *  * Center - Aligns the annotation at the center of a connector segment 
     *  * Before - Aligns the annotation before a connector segment 
     *  * After - Aligns the annotation after a connector segment
     * @default Center
     */
    public declare alignment: any;
    /** 
     * Specifies the cornerRadius for fixed user handle container
     * @default 0
     */
    public declare cornerRadius: any;
    /** 
     * Specifies the displacement of an fixed user handle from its actual position
     * @aspdefaultvalueignore 
     * @default undefined
     */
    public declare displacement: any;
    /** 
     * Specifies the fill color of the fixed user handle
     * @default 'transparent'
     */
    public declare fill: any;
    /** 
     * Specifies the stroke color of the fixed user handle container
     * @default ''
     */
    public declare handleStrokeColor: any;
    /** 
     * Specifies the stroke width of the fixed user handle container
     * @default 1
     */
    public declare handleStrokeWidth: any;
    /** 
     * Specifies the height of the fixed user handle
     * @default 10
     */
    public declare height: any;
    /** 
     * Specifies the stroke color of the fixed user handle
     * @default 'transparent'
     */
    public declare iconStrokeColor: any;
    /** 
     * Specifies the stroke width of the fixed user handle
     * @default 0
     */
    public declare iconStrokeWidth: any;
    /** 
     * Specifies the unique id of the fixed user handle
     * @default ''
     */
    public declare id: any;
    /** 
     * Specifies the position of the connector fixed user handle
     * @default 0.5
     */
    public declare offset: any;
    /** 
     * Specifies the space between the fixed user handle and container
     * @default new Margin(0,0,0,0)
     */
    public declare padding: any;
    /** 
     * Specifies the shape information for fixed user handle
     * @default ''
     */
    public declare pathData: any;
    /** 
     * Used to show tooltip for fixed user handle on mouse over.
     * @default {}
     */
    public declare tooltip: any;
    /** 
     * Specifies the visibility of the fixed user handle
     * @default true
     */
    public declare visibility: any;
    /** 
     * Specifies the width of the fixed user handle
     * @default 10
     */
    public declare width: any;

    constructor(private viewContainerRef:ViewContainerRef) {
        super();
        setValue('currentInstance', this, this.viewContainerRef);
        this.registerEvents(outputs);
        this.directivePropList = input;
    }
}

/**
 * ConnectorFixedUserHandle Array Directive
 * @private
 */
@Directive({
    selector: 'e-connector>e-connector-fixeduserhandles',
    standalone: true,
    queries: {
        children: new ContentChildren(ConnectorFixedUserHandleDirective)
    },
})
export class ConnectorFixedUserHandlesDirective extends ArrayBase<ConnectorFixedUserHandlesDirective> {
    constructor() {
        super('fixeduserhandles');
    }
}