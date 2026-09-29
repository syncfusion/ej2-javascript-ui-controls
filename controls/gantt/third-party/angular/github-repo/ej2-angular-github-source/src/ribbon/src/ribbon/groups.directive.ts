import { Directive, ViewContainerRef, ContentChildren, ContentChild } from '@angular/core';
import { ComplexBase, ArrayBase, setValue } from '@syncfusion/ej2-angular-base';

import { RibbonCollectionsDirective } from './collections.directive';

let input: string[] = ['collections', 'cssClass', 'enableGroupOverflow', 'groupIconCss', 'header', 'id', 'isCollapsed', 'isCollapsible', 'keyTip', 'launcherIconKeyTip', 'orientation', 'overflowHeader', 'priority', 'showLauncherIcon'];
let outputs: string[] = [];

@Directive({
    selector: 'e-ribbon-group',
    inputs: input,
    outputs: outputs,
    standalone: true,
    queries: {
        childCollections: new ContentChild(RibbonCollectionsDirective)
    }
})
export class RibbonGroupDirective extends ComplexBase<RibbonGroupDirective> {
    public directivePropList: any;
	
    public declare childCollections: any;
    public tags: string[] = ['collections'];
    /** 
     * Defines the list of ribbon collections.
     * @default []
     * @asptype List<RibbonCollection>
     */
    public declare collections: any;
    /** 
     * Defines one or more CSS classes to customize the appearance of group.
     * @default ''
     */
    public declare cssClass: any;
    /** 
     * Defines whether to add a separate popup for the overflow items in the group. 
     * If it is set to false, the overflow items will be shown in the common overflow popup present at the right end of the tab content.
     * @default false
     */
    public declare enableGroupOverflow: any;
    /** 
     * Defines the CSS class for the icons to be shown in the group overflow dropdown button in classic mode. 
     * During overflow, the entire group will be shown in a popup of a dropdown button which appears in the place of the group in ribbon tab.
     * @default ''
     */
    public declare groupIconCss: any;
    /** 
     * Defines the content of group header.
     * @default ''
     */
    public declare header: any;
    /** 
     * Defines a unique identifier for the group.
     * @default ''
     */
    public declare id: any;
    /** 
     * Defines whether the group is in collapsed state or not during classic mode.
     * @default false
     */
    public declare isCollapsed: any;
    /** 
     * Defines whether the group can be collapsed on resize during classic mode.
     * @default true
     */
    public declare isCollapsible: any;
    /** 
     * Specifies the keytip content.
     * @default ''
     */
    public declare keyTip: any;
    /** 
     * Specifies the keytip content for launcher icon.
     * @default ''
     */
    public declare launcherIconKeyTip: any;
    /** 
     * Defines whether to orientation in which the items of the group should be arranged.
     * @isenumeration true
     * @default ItemOrientation.Column
     * @asptype ItemOrientation
     */
    public declare orientation: any;
    /** 
     * Defines the header shown in overflow popup of Ribbon group.
     * @default ''
     */
    public declare overflowHeader: any;
    /** 
     * Defines the priority order at which the group should be collapsed or expanded. 
     * For collapsing value is fetched in ascending order and for expanding value is fetched in descending order.
     * @default 0
     */
    public declare priority: any;
    /** 
     * Defines whether to show or hide the launcher icon for the group.
     * @default false
     */
    public declare showLauncherIcon: any;

    constructor(private viewContainerRef:ViewContainerRef) {
        super();
        setValue('currentInstance', this, this.viewContainerRef);
        this.registerEvents(outputs);
        this.directivePropList = input;
    }
}

/**
 * RibbonGroup Array Directive
 * @private
 */
@Directive({
    selector: 'e-ribbon-groups',
    standalone: true,
    queries: {
        children: new ContentChildren(RibbonGroupDirective)
    },
})
export class RibbonGroupsDirective extends ArrayBase<RibbonGroupsDirective> {
    constructor() {
        super('groups');
    }
}