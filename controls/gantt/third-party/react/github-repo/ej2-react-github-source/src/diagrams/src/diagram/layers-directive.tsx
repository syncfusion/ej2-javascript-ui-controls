import { ComplexBase } from '@syncfusion/ej2-react-base';
import { LayerModel } from '@syncfusion/ej2-diagrams';


/**
 * `Layers Directive` directive represent a connectors of the react diagram. 
 * It must be contained in a Diagram component(`DiagramComponent`). 
 * ```ts
 * <DiagramComponent>
 * <LayersDirective>
 * <LayerDirective></LayerDirective>
 * </LayersDirective>
 * </DiagramComponent>
 * ```
 */
export class LayerDirective extends ComplexBase<LayerModel & { children?: React.ReactNode }, LayerModel> {
    public static moduleName: string = 'layer';
}

export class LayersDirective extends ComplexBase<{}, {}> {
    public static propertyName: string = 'layers';
    public static moduleName: string = 'layers';
}
