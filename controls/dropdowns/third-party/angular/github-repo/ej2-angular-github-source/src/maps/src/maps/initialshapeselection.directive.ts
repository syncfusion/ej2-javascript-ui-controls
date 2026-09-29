import { Directive, ViewContainerRef, ContentChildren } from '@angular/core';
import { ComplexBase, ArrayBase, setValue } from '@syncfusion/ej2-angular-base';



let input: string[] = ['shapePath', 'shapeValue'];
let outputs: string[] = [];
/**
 * Represents the directive to configure the selection of the shapes when the maps is initially rendered.
 * ```html
 * <e-layers>
 * <e-layer>
 * <e-initialShapeSelections>
 * <e-initialShapeSelection>
 * </e-initialShapeSelection>
 * </e-initialShapeSelections>
 * </e-layer>
 * </e-layers>
 * ```
 */
@Directive({
    selector: 'e-layer>e-initialShapeSelections>e-initialShapeSelection',
    inputs: input,
    outputs: outputs,
    standalone: true,
    queries: {
    }
})
export class InitialShapeSelectionDirective extends ComplexBase<InitialShapeSelectionDirective> {
    public directivePropList: any;
	


    /** 
     * Gets or sets the property name from the data source in maps.
     * @default null
     */
    public declare shapePath: any;
    /** 
     * Gets or sets the value from the data source which is bound to the shape in maps.
     * @default null
     */
    public declare shapeValue: any;

    constructor(private viewContainerRef:ViewContainerRef) {
        super();
        setValue('currentInstance', this, this.viewContainerRef);
        this.registerEvents(outputs);
        this.directivePropList = input;
    }
}

/**
 * InitialShapeSelection Array Directive
 * @private
 */
@Directive({
    selector: 'e-layer>e-initialShapeSelections',
    standalone: true,
    queries: {
        children: new ContentChildren(InitialShapeSelectionDirective)
    },
})
export class InitialShapeSelectionsDirective extends ArrayBase<InitialShapeSelectionsDirective> {
    constructor() {
        super('initialshapeselection');
    }
}