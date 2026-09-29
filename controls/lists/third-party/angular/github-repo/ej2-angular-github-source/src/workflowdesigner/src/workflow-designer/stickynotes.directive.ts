import { Directive, ViewContainerRef, ContentChildren } from '@angular/core';
import { ComplexBase, ArrayBase, setValue } from '@syncfusion/ej2-angular-base';



let input: string[] = ['id', 'position', 'size', 'style', 'text'];
let outputs: string[] = [];
/**
 * Sticky Notes Directive
 * ```html
 * <e-sticky-notes>
 * <e-sticky-note></e-sticky-note>
 * </e-sticky-notes>
 * ```
 */
@Directive({
    selector: 'e-sticky-notes>e-sticky-note',
    inputs: input,
    outputs: outputs,
    standalone: true,
    queries: {
    }
})
export class StickyNoteDirective extends ComplexBase<StickyNoteDirective> {
    public directivePropList: any;
	


    /** 
     * Defines the unique identifier of the sticky note.
     * @default ''
     */
    public declare id: any;
    /** 
     * Defines the exact canvas position of the sticky note.
     * @default { x: 0, y: 0 }
     */
    public declare position: any;
    /** 
     * Defines the size of the sticky note.
     * @default {}
     */
    public declare size: any;
    /** 
     * Defines the visual style of the sticky note.
     * @default {}
     */
    public declare style: any;
    /** 
     * Defines the plain-text content of the sticky note. The renderer inserts 
     * this value through `textContent`, never as HTML.
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
 * StickyNote Array Directive
 * @private
 */
@Directive({
    selector: 'ej-workflow-designer>e-sticky-notes',
    standalone: true,
    queries: {
        children: new ContentChildren(StickyNoteDirective)
    },
})
export class StickyNotesDirective extends ArrayBase<StickyNotesDirective> {
    constructor() {
        super('stickynotes');
    }
}