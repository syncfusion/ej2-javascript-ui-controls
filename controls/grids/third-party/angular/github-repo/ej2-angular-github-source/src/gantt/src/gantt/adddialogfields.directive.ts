import { Directive, ViewContainerRef, ContentChildren } from '@angular/core';
import { ComplexBase, ArrayBase, setValue } from '@syncfusion/ej2-angular-base';



let input: string[] = ['additionalParams', 'fields', 'headerText', 'type'];
let outputs: string[] = [];
/**
 * `e-add-dialog-field` directive represent a add dialog fields collection in Gantt task add dialog. 
 * It must be contained in a Gantt component(`ejs-gantt`). 
 * ```html
 * <ejs-gantt [dataSource]='data' allowSelection='true' allowSorting='true'> 
 *   <e-add-dialog-fields>
 *     <e-add-dialog-field type='General' headerText='General'></e-add-dialog-field>
 *     <e-add-dialog-field type='Dependency' headerText='Dependency'></e-add-dialog-field>
 *   </e-add-dialog-fields>
 * </ejs-gantt>
 * ```
 */
@Directive({
    selector: 'ejs-gantt>e-add-dialog-fields>e-add-dialog-field',
    inputs: input,
    outputs: outputs,
    standalone: true,
    queries: {
    }
})
export class AddDialogFieldDirective extends ComplexBase<AddDialogFieldDirective> {
    public directivePropList: any;
	


    /** 
     * Specifies the types of tabs that contain editors for columns. 
     * Available tab types: 
     * * `General` - Represents the general information editor tab. 
     * * `Dependency` - Represents the dependency editor tab. 
     * * `Resources` - Represents the resource editor tab. 
     * * `Notes` - Represents the notes editor tab. 
     * * `Segments` - Represents the segments editor tab. 
     * * `Custom` - Represents the custom column editor tab.
     * @default null
     */
    public declare type: any;
    /** 
     * Specifies the configuration properties for Grid, Rich Text Editor (RTE), or TreeGrid controls within the Gantt edit dialog.
     * @default null
     */
    public declare additionalParams: any;
    /** 
     * Specifies the edited column fields to be placed inside the tab.
     * @default null
     */
    public declare fields: any;
    /** 
     * Defines header text of tab item.
     * @default null
     */
    public declare headerText: any;

    constructor(private viewContainerRef:ViewContainerRef) {
        super();
        setValue('currentInstance', this, this.viewContainerRef);
        this.registerEvents(outputs);
        this.directivePropList = input;
    }
}

/**
 * AddDialogField Array Directive
 * @private
 */
@Directive({
    selector: 'ejs-gantt>e-add-dialog-fields',
    standalone: true,
    queries: {
        children: new ContentChildren(AddDialogFieldDirective)
    },
})
export class AddDialogFieldsDirective extends ArrayBase<AddDialogFieldsDirective> {
    constructor() {
        super('adddialogfields');
    }
}