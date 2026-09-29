import { Directive, ViewContainerRef, ContentChildren } from '@angular/core';
import { ComplexBase, ArrayBase, setValue } from '@syncfusion/ej2-angular-base';



let input: string[] = ['height', 'id', 'left', 'src', 'top', 'width'];
let outputs: string[] = [];

@Directive({
    selector: 'e-images>e-image',
    inputs: input,
    outputs: outputs,
    standalone: true,
    queries: {
    }
})
export class ImageDirective extends ComplexBase<ImageDirective> {
    public directivePropList: any;
	


    /** 
     * Specifies the height of the image.
     * @default 300
     * @asptype double
     */
    public declare height: any;
    /** 
     * Specifies image element id.
     * @default ''
     */
    public declare id: any;
    /** 
     * Specifies the width of the image.
     * @default 0
     * @asptype double
     */
    public declare left: any;
    /** 
     * Specifies the image source.
     * @default ''
     */
    public declare src: any;
    /** 
     * Specifies the height of the image.
     * @default 0
     * @asptype double
     */
    public declare top: any;
    /** 
     * Specifies the width of the image.
     * @default 400
     * @asptype double
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
 * Image Array Directive
 * @private
 */
@Directive({
    selector: 'e-cell>e-images',
    standalone: true,
    queries: {
        children: new ContentChildren(ImageDirective)
    },
})
export class ImagesDirective extends ArrayBase<ImagesDirective> {
    constructor() {
        super('image');
    }
}