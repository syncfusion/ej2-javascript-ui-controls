import { Directive, ViewContainerRef, ContentChildren, ContentChild } from '@angular/core';
import { ComplexBase, ArrayBase, setValue } from '@syncfusion/ej2-angular-base';

import { RibbonTabsDirective } from './tabs.directive';

let input: string[] = ['isSelected', 'tabs', 'visible'];
let outputs: string[] = [];
/**
 * `e-ribbon-contextual-tab` directive represent a contextual tab of the Angular Ribbon. 
 * It must be contained in a Ribbon component(`ejs-ribbon`). 
 * ```html
 * <ejs-ribbon>
 *   <e-ribbon-contextual-tabs>
 *    <e-ribbon-contextual-tab>
 *    </e-ribbon-contextual-tab>
 *   </e-ribbon-contextual-tabs>
 * </ejs-ribbon>
 * ```
 */
@Directive({
    selector: 'e-ribbon-contextual-tab',
    inputs: input,
    outputs: outputs,
    standalone: true,
    queries: {
        childTabs: new ContentChild(RibbonTabsDirective)
    }
})
export class RibbonContextualTabDirective extends ComplexBase<RibbonContextualTabDirective> {
    public directivePropList: any;
	
    public declare childTabs: any;
    public tags: string[] = ['tabs'];
    /** 
     * Specifies whether the contextual tab is selected.
     * @default false
     */
    public declare isSelected: any;
    /** 
     * Defines the tab groups to be rendered in ribbon.
     * @default []
     * @asptype List<RibbonTab>
     */
    public declare tabs: any;
    /** 
     * Specifies whether the contextual tab is visible.
     * @default false
     */
    public declare visible: any;

    constructor(private viewContainerRef:ViewContainerRef) {
        super();
        setValue('currentInstance', this, this.viewContainerRef);
        this.registerEvents(outputs);
        this.directivePropList = input;
    }
}

/**
 * RibbonContextualTab Array Directive
 * @private
 */
@Directive({
    selector: 'e-ribbon-contextual-tabs',
    standalone: true,
    queries: {
        children: new ContentChildren(RibbonContextualTabDirective)
    },
})
export class RibbonContextualTabsDirective extends ArrayBase<RibbonContextualTabsDirective> {
    constructor() {
        super('contextualtabs');
    }
}