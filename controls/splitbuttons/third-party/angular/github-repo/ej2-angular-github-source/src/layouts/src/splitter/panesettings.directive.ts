import { Directive, ViewContainerRef, ContentChildren, ContentChild } from '@angular/core';
import { ComplexBase, ArrayBase, setValue } from '@syncfusion/ej2-angular-base';
import { Template } from '@syncfusion/ej2-angular-base';


let input: string[] = ['collapsed', 'collapsible', 'content', 'cssClass', 'max', 'min', 'resizable', 'size'];
let outputs: string[] = [];
/**
 * 'e-panesettings' directive represent a panes of angular splitter 
 * It must be contained in a Splitter component(`ejs-splitter`). 
 * ```html
 * <ejs-splitter id='splitter' > 
 *   <e-panes>
 *    <e-pane size ='150px'></e-pane>
 *    <e-pane size = '20%'></e-pane>
 *   </e-panes>
 * </ejs-splitter>
 * ```
 */
@Directive({
    selector: 'e-panes>e-pane',
    inputs: input,
    outputs: outputs,
    standalone: true,
    queries: {
        content: new ContentChild('content')
    }
})
export class PaneDirective extends ComplexBase<PaneDirective> {
    public directivePropList: any;
	


    /** 
     * Specifies whether a pane is collapsed or not collapsed at the initial rendering of splitter.
     * 
     * {% codeBlock src='splitter/collapsed/index.md' %}{% endcodeBlock %}
     *     
     * @default false
     */
    public declare collapsed: any;
    /** 
     * Specifies whether a pane is collapsible or not collapsible.
     * 
     * {% codeBlock src='splitter/collapsible/index.md' %}{% endcodeBlock %}
     *     
     * @default false
     */
    public declare collapsible: any;
    /** 
     * Specifies the CSS class names that defines specific user-defined 
     * styles and themes to be appended on corresponding pane of the Splitter. 
     * It is used to customize the Splitter control panes. 
     * One or more custom CSS classes can be specified to the Splitter panes.
     * @default ''
     */
    public declare cssClass: any;
    /** 
     * Specifies the maximum size of a pane. The pane cannot be resized if it is more than the specified maximum limit.
     * @default null
     */
    public declare max: any;
    /** 
     * Specifies the minimum size of a pane. The pane cannot be resized if it is less than the specified minimum size.
     * @default null
     */
    public declare min: any;
    /** 
     * Specifies the value whether a pane is resizable. By default, the Splitter is resizable in all panes. 
     * You can disable this for any specific panes using this property.
     * @default true
     */
    public declare resizable: any;
    /** 
     * Configures the properties for each pane.
     * @default ''
     */
    public declare size: any;

    constructor(private viewContainerRef:ViewContainerRef) {
        super();
        setValue('currentInstance', this, this.viewContainerRef);
        this.registerEvents(outputs);
        this.directivePropList = input;
    }
}
Template()(PaneDirective.prototype, 'content');

/**
 * Pane Array Directive
 * @private
 */
@Directive({
    selector: 'ejs-splitter>e-panes',
    standalone: true,
    queries: {
        children: new ContentChildren(PaneDirective)
    },
})
export class PanesDirective extends ArrayBase<PanesDirective> {
    constructor() {
        super('panesettings');
    }
}