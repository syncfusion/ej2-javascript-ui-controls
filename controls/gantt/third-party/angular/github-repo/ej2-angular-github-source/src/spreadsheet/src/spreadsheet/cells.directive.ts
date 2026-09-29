import { Directive, ViewContainerRef, ContentChildren, ContentChild } from '@angular/core';
import { ComplexBase, ArrayBase, setValue } from '@syncfusion/ej2-angular-base';

import { ImagesDirective } from './image.directive';
import { ChartsDirective } from './chart.directive';
import { RichTextsDirective } from './richtext.directive';

let input: string[] = ['chart', 'colSpan', 'comment', 'format', 'formula', 'hyperlink', 'image', 'index', 'isLocked', 'isReadOnly', 'notes', 'richText', 'rowSpan', 'style', 'validation', 'value', 'wrap'];
let outputs: string[] = [];
/**
 * `e-cell` directive represent a cell of the Angular Spreadsheet.
 * It must be contained in a `e-row` directive.
 * ```html
 * <ejs-spreadsheet>
 *   <e-sheets>
 *    <e-sheet>
 *    <e-rows>
 *    <e-row>
 *    <e-cells>
 *    <e-cell value='A1'></e-cell>
 *    </e-cells>
 *    </e-row>
 *    </e-rows>
 *    </e-sheet>
 *   </e-sheets>
 * </ejs-spreadsheet>
 * ```
 */
@Directive({
    selector: 'e-cells>e-cell',
    inputs: input,
    outputs: outputs,
    standalone: true,
    queries: {
        childImage: new ContentChild(ImagesDirective),
        childChart: new ContentChild(ChartsDirective),
        childRichText: new ContentChild(RichTextsDirective)
    }
})
export class CellDirective extends ComplexBase<CellDirective> {
    public directivePropList: any;
	
    public declare childImage: any;
    public declare childChart: any;
    public declare childRichText: any;
    public tags: string[] = ['image', 'chart', 'richText'];
    /** 
     * Represents the threaded comment associated with the cell. 
     * A threaded comment allows users to add a main comment and maintain a discussion through replies. 
     * Each cell supports a single comment thread, which includes: 
     * - **author**: The name of the person who created the comment. 
     * - **text**: The main content of the comment. 
     * - **createdTime**: The time-stamp indicating when the comment was added. 
     * - **isResolved**: Indicates whether the thread is marked as resolved. 
     * - **replies**: A collection of reply comments, each with its own `author`, `text`, and `createdTime`.
     * @default null
     */
    public declare comment: any;
    /** 
     * Specifies the chart of the cell.
     * @default []
     */
    public declare chart: any;
    /** 
     * Specifies the column-wise cell merge count.
     * @default 1
     * @asptype int
     */
    public declare colSpan: any;
    /** 
     * Specifies the number format code to display value in specified number format.
     * @default 'General'
     */
    public declare format: any;
    /** 
     * Defines the formula or expression of the cell.
     * @default ''
     */
    public declare formula: any;
    /** 
     * Specifies the hyperlink of the cell.
     * @default ''
     */
    public declare hyperlink: any;
    /** 
     * Specifies the image of the cell.
     * @default []
     */
    public declare image: any;
    /** 
     * Specifies the index of the cell.
     * @default 0
     * @asptype int
     */
    public declare index: any;
    /** 
     * Specifies the cell is locked or not, for allow edit range in spreadsheet protect option.
     * @default true
     */
    public declare isLocked: any;
    /** 
     * Represents whether a cell in the sheet is read-only or not. If set to true, it prevents editing the specified cell in the sheet.
     * @default false
     */
    public declare isReadOnly: any;
    /** 
     * Specifies the note of the cell.
     * @default ''
     */
    public declare notes: any;
    /** 
     * Specifies the rich text segments for the cell text, allowing superscript and subscript formatting within the content. 
     * Uses the RichText model to apply formatting to specific text segments. The options are: 
     * - **text**: Specifies the text content for each segment. 
     * - **style**: Specifies the style for each segment; it supports superscript and subscript formatting. 
     * Set `verticalAlign` as `super` for superscript formatting and `sub` for subscript formatting.
     * @default []
     */
    public declare richText: any;
    /** 
     * Specifies the row-wise cell merge count.
     * @default 1
     * @asptype int
     */
    public declare rowSpan: any;
    /** 
     * Specifies the cell style options. 
     *  
     * @default {}
     */
    public declare style: any;
    /** 
     * Specifies the validation of the cell.
     * @default ''
     */
    public declare validation: any;
    /** 
     * Defines the value of the cell which can be text or number.
     * @default ''
     */
    public declare value: any;
    /** 
     * Wraps the cell text to the next line, if the text width exceeds the column width.
     * @default false
     */
    public declare wrap: any;

    constructor(private viewContainerRef:ViewContainerRef) {
        super();
        setValue('currentInstance', this, this.viewContainerRef);
        this.registerEvents(outputs);
        this.directivePropList = input;
    }
}

/**
 * Cell Array Directive
 * @private
 */
@Directive({
    selector: 'e-row>e-cells',
    standalone: true,
    queries: {
        children: new ContentChildren(CellDirective)
    },
})
export class CellsDirective extends ArrayBase<CellsDirective> {
    constructor() {
        super('cells');
    }
}