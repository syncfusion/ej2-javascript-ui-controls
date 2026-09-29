import { Directive, ViewContainerRef, ContentChildren, ContentChild } from '@angular/core';
import { ComplexBase, ArrayBase, setValue } from '@syncfusion/ej2-angular-base';

import { CellsDirective } from './cells.directive';

let input: string[] = ['cells', 'customHeight', 'format', 'height', 'hidden', 'index', 'isReadOnly'];
let outputs: string[] = [];
/**
 * `e-row` directive represent a row of the Angular Spreadsheet.
 * It must be contained in a `e-sheet` directive.
 * ```html
 * <ejs-spreadsheet>
 *   <e-sheets>
 *    <e-sheet>
 *    <e-rows>
 *    <e-row></e-row>
 *    </e-rows>
 *    </e-sheet>
 *   </e-sheets>
 * </ejs-spreadsheet>
 * ```
 */
@Directive({
    selector: 'e-rows>e-row',
    inputs: input,
    outputs: outputs,
    standalone: true,
    queries: {
        childCells: new ContentChild(CellsDirective)
    }
})
export class RowDirective extends ComplexBase<RowDirective> {
    public directivePropList: any;
	
    public declare childCells: any;
    public tags: string[] = ['cells'];
    /** 
     * Specifies cell and its properties for the row.
     * @default []
     */
    public declare cells: any;
    /** 
     * specifies custom height of the row.
     * @default false
     */
    public declare customHeight: any;
    /** 
     * Specifies format of the row.
     * @default {}
     */
    public declare format: any;
    /** 
     * Specifies height of the row.
     * @default 20
     * @asptype double
     * @aspdefaultvalue 20.0
     */
    public declare height: any;
    /** 
     * To hide/show the row in spreadsheet.
     * @default false
     */
    public declare hidden: any;
    /** 
     * Specifies the index to the row. Based on the index, row properties are applied.
     * @default 0
     * @asptype int
     */
    public declare index: any;
    /** 
     * Represents whether a row in the sheet is read-only or not. If set to true, it prevents editing the specified cell in the sheet.
     * @default false
     */
    public declare isReadOnly: any;

    constructor(private viewContainerRef:ViewContainerRef) {
        super();
        setValue('currentInstance', this, this.viewContainerRef);
        this.registerEvents(outputs);
        this.directivePropList = input;
    }
}

/**
 * Row Array Directive
 * @private
 */
@Directive({
    selector: 'e-sheet>e-rows',
    standalone: true,
    queries: {
        children: new ContentChildren(RowDirective)
    },
})
export class RowsDirective extends ArrayBase<RowsDirective> {
    constructor() {
        super('rows');
    }
}