import { Directive, ViewContainerRef, ContentChildren } from '@angular/core';
import { ComplexBase, ArrayBase, setValue } from '@syncfusion/ej2-angular-base';



let input: string[] = ['style', 'text'];
let outputs: string[] = [];

@Directive({
    selector: 'e-richtexts>e-richtext',
    inputs: input,
    outputs: outputs,
    standalone: true,
    queries: {
    }
})
export class RichTextDirective extends ComplexBase<RichTextDirective> {
    public directivePropList: any;
	


    /** 
     * Specifies the style of the segment using CellStyleModel, which represents the general cell styling configuration. 
     * However, in a rich text segment, only the superscript or subscript options are supported.
     * @default {}
     */
    public declare style: any;
    /** 
     * Specifies the text content of the segment.
     * @default ''
     */
    public declare text: any;

    constructor(private viewContainerRef:ViewContainerRef) {
        super();
        setValue('currentInstance', this, this.viewContainerRef);
        this.registerEvents(outputs);
        this.directivePropList = input;
    }
}

/**
 * RichText Array Directive
 * @private
 */
@Directive({
    selector: 'e-cell>e-richtexts',
    standalone: true,
    queries: {
        children: new ContentChildren(RichTextDirective)
    },
})
export class RichTextsDirective extends ArrayBase<RichTextsDirective> {
    constructor() {
        super('richtext');
    }
}