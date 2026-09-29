import { Directive, ViewContainerRef, ContentChildren, ContentChild } from '@angular/core';
import { ComplexBase, ArrayBase, setValue } from '@syncfusion/ej2-angular-base';
import { Template } from '@syncfusion/ej2-angular-base';


let input: string[] = ['col', 'content', 'cssClass', 'enabled', 'header', 'id', 'maxSizeX', 'maxSizeY', 'minSizeX', 'minSizeY', 'mobilePanelHeight', 'row', 'sizeX', 'sizeY', 'zIndex'];
let outputs: string[] = [];
/**
 * 'e-panels' directive represent a panels of angular dashboardlayout 
 * It must be contained in a dashboardlayout component(`ej-dashboardlayout`). 
 * ```html
 * <ejs-dashboardlayout> 
 *   <e-panels>
 *    <e-panel></e-panel>
 *    <e-panel></e-panel>
 *   </e-panels>
 * </ejs-dashboardlayout>
 * ```
 */
@Directive({
    selector: 'e-panels>e-panel',
    inputs: input,
    outputs: outputs,
    standalone: true,
    queries: {
        header: new ContentChild('header'),
        content: new ContentChild('content')
    }
})
export class PanelDirective extends ComplexBase<PanelDirective> {
    public directivePropList: any;
	


    /** 
     * Defines the column value where the panel to be placed.
     * @default 0
     * @asptype int
     */
    public declare col: any;
    /** 
     * Defines the CSS class name that can be appended with each panel element.
     * @default ''
     */
    public declare cssClass: any;
    /** 
     * Defines whether to the panel should be enabled or not.
     * @default true
     */
    public declare enabled: any;
    /** 
     * Defines the id of the panel.
     * @default ''
     */
    public declare id: any;
    /** 
     * Specifies the maximum width of the panel in cells count.
     * @default null
     * @asptype int
     */
    public declare maxSizeX: any;
    /** 
     * Specifies the maximum height of the panel in cells count.
     * @default null
     * @asptype int

     */
    public declare maxSizeY: any;
    /** 
     * Specifies the minimum width of the panel in cells count.
     * @default 1
     */
    public declare minSizeX: any;
    /** 
     * Specifies the minimum height of the panel in cells count.
     * @default 1
     */
    public declare minSizeY: any;
    /** 
     * Specifies the height of the panel in the layout in cells count for mobile view only. 
     * When set, this height overrides the default sizeY value. 
     * If null or undefined, falls back to sizeY.
     * @default null
     * @asptype double
     */
    public declare mobilePanelHeight: any;
    /** 
     * Defines a row value where the panel should be placed.
     * @default 0
     * @asptype int
     */
    public declare row: any;
    /** 
     * Specifies the width of the panel in the layout in cells count.
     * @default 1
     */
    public declare sizeX: any;
    /** 
     * Specifies the height of the panel in the layout in cells count.
     * @default 1
     */
    public declare sizeY: any;
    /** 
     * Specifies the z-index of the panel
     * @default 1000
     * @asptype double
     */
    public declare zIndex: any;

    constructor(private viewContainerRef:ViewContainerRef) {
        super();
        setValue('currentInstance', this, this.viewContainerRef);
        this.registerEvents(outputs);
        this.directivePropList = input;
    }
}
Template()(PanelDirective.prototype, 'header');
Template()(PanelDirective.prototype, 'content');

/**
 * Panel Array Directive
 * @private
 */
@Directive({
    selector: 'ejs-dashboardlayout>e-panels',
    standalone: true,
    queries: {
        children: new ContentChildren(PanelDirective)
    },
})
export class PanelsDirective extends ArrayBase<PanelsDirective> {
    constructor() {
        super('panels');
    }
}