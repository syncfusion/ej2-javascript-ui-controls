import { Directive, ViewContainerRef, ContentChildren, ContentChild } from '@angular/core';
import { ComplexBase, ArrayBase, setValue } from '@syncfusion/ej2-angular-base';

import { RibbonGroupsDirective } from './groups.directive';

let input: string[] = ['cssClass', 'groups', 'header', 'id', 'keyTip'];
let outputs: string[] = [];

@Directive({
    selector: 'e-ribbon-tab',
    inputs: input,
    outputs: outputs,
    standalone: true,
    queries: {
        childGroups: new ContentChild(RibbonGroupsDirective)
    }
})
export class RibbonTabDirective extends ComplexBase<RibbonTabDirective> {
    public directivePropList: any;
	
    public declare childGroups: any;
    public tags: string[] = ['groups'];
    /** 
     * Defines one or more CSS classes to customize the appearance of tab.
     * @default ''
     */
    public declare cssClass: any;
    /** 
     * Defines the list of ribbon groups.
     * @default []
     * @asptype List<RibbonGroup>
     */
    public declare groups: any;
    /** 
     * Defines the content of tab header.
     * @default ''
     */
    public declare header: any;
    /** 
     * Defines a unique identifier for the tab.
     * @default ''
     */
    public declare id: any;
    /** 
     * Specifies the keytip content.
     * @default ''
     */
    public declare keyTip: any;

    constructor(private viewContainerRef:ViewContainerRef) {
        super();
        setValue('currentInstance', this, this.viewContainerRef);
        this.registerEvents(outputs);
        this.directivePropList = input;
    }
}

/**
 * RibbonTab Array Directive
 * @private
 */
@Directive({
    selector: 'e-ribbon-tabs',
    standalone: true,
    queries: {
        children: new ContentChildren(RibbonTabDirective)
    },
})
export class RibbonTabsDirective extends ArrayBase<RibbonTabsDirective> {
    constructor() {
        super('tabs');
    }
}