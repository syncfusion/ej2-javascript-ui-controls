import { Directive, ViewContainerRef, ContentChildren } from '@angular/core';
import { ComplexBase, ArrayBase, setValue } from '@syncfusion/ej2-angular-base';



let input: string[] = ['cFColor', 'format', 'range', 'type', 'value'];
let outputs: string[] = [];
/**
 * `e-conditionalformat` directive represent a conditionalformat of the Angular Spreadsheet.
 * It must be contained in a `e-sheet` directive.
 * ```html
 * <ejs-spreadsheet>
 *   <e-sheets>
 *    <e-sheet>
 *    <e-conditionalformats>
 *    <e-conditionalformat></e-conditionalformat>
 *    </e-conditionalformats>
 *    </e-sheet>
 *   </e-sheets>
 * </ejs-spreadsheet>
 * ```
 */
@Directive({
    selector: 'e-conditionalformats>e-conditionalformat',
    inputs: input,
    outputs: outputs,
    standalone: true,
    queries: {
    }
})
export class ConditionalFormatDirective extends ComplexBase<ConditionalFormatDirective> {
    public directivePropList: any;
	


    /** 
     * Specifies Conditional formatting Type.
     * @default 'GreaterThan'
     * @aspignore 
     */
    public declare type: any;
    /** 
     * Specifies Conditional formatting Highlight Color.
     * @default 'RedFT'
     */
    public declare cFColor: any;
    /** 
     * Specifies format.
     * @default {}
     */
    public declare format: any;
    /** 
     * Specifies Conditional formatting range.
     * @default ''
     */
    public declare range: any;
    /** 
     * Specifies Conditional formatting Value.
     * @default ''
     */
    public declare value: any;

    constructor(private viewContainerRef:ViewContainerRef) {
        super();
        setValue('currentInstance', this, this.viewContainerRef);
        this.registerEvents(outputs);
        this.directivePropList = input;
    }
}

/**
 * ConditionalFormat Array Directive
 * @private
 */
@Directive({
    selector: 'e-sheet>e-conditionalformats',
    standalone: true,
    queries: {
        children: new ContentChildren(ConditionalFormatDirective)
    },
})
export class ConditionalFormatsDirective extends ArrayBase<ConditionalFormatsDirective> {
    constructor() {
        super('conditionalformats');
    }
}