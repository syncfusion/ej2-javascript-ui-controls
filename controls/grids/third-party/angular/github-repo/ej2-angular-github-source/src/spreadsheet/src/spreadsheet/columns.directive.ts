import { Directive, ViewContainerRef, ContentChildren } from '@angular/core';
import { ComplexBase, ArrayBase, setValue } from '@syncfusion/ej2-angular-base';



let input: string[] = ['customWidth', 'format', 'hidden', 'index', 'isLocked', 'isReadOnly', 'validation', 'width'];
let outputs: string[] = [];
/**
 * `e-column` directive represent a column of the Angular Spreadsheet.
 * It must be contained in a `e-sheet` directive.
 * ```html
 * <ejs-spreadsheet>
 *   <e-sheets>
 *    <e-sheet>
 *    <e-columns>
 *    <e-column width='100'></e-column>
 *    </e-columns>
 *    </e-sheet>
 *   </e-sheets>
 * </ejs-spreadsheet>
 * ```
 */
@Directive({
    selector: 'e-columns>e-column',
    inputs: input,
    outputs: outputs,
    standalone: true,
    queries: {
    }
})
export class ColumnDirective extends ComplexBase<ColumnDirective> {
    public directivePropList: any;
	


    /** 
     * specifies custom width of the column.
     * @default false
     */
    public declare customWidth: any;
    /** 
     * Specifies format of the column.
     * @default {}
     */
    public declare format: any;
    /** 
     * To hide/show the column in spreadsheet.
     * @default false
     */
    public declare hidden: any;
    /** 
     * Specifies index of the column. Based on the index, column properties are applied.
     * @default 0
     * @asptype int
     */
    public declare index: any;
    /** 
     * To lock/unlock the column in the protected sheet.
     * @default true
     */
    public declare isLocked: any;
    /** 
     * Represents whether a column in the sheet is read-only or not. If set to true, it prevents editing the specified cell in the sheet.
     * @default false
     */
    public declare isReadOnly: any;
    /** 
     * Specifies the validation of the column.
     * @default ''
     */
    public declare validation: any;
    /** 
     * Specifies width of the column.
     * @default 64
     * @asptype int
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
 * Column Array Directive
 * @private
 */
@Directive({
    selector: 'e-sheet>e-columns',
    standalone: true,
    queries: {
        children: new ContentChildren(ColumnDirective)
    },
})
export class ColumnsDirective extends ArrayBase<ColumnsDirective> {
    constructor() {
        super('columns');
    }
}