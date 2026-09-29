import { ComplexBase } from '@syncfusion/ej2-react-base';
import { LayerSettingsModel } from '@syncfusion/ej2-maps';


/**
 * Represents the directive to define the layer of the maps.
 * ```
 * <MapsComponent>
 * <LayersDirective>
 * <LayerDirective></LayerDirective>
 * </LayersDirective>
 * </MapsComponent>
 * ```
 */
export class LayerDirective extends ComplexBase<LayerSettingsModel & { children?: React.ReactNode }, LayerSettingsModel> {
    public static moduleName: string = 'layer';
}

export class LayersDirective extends ComplexBase<{}, {}> {
    public static propertyName: string = 'layers';
    public static moduleName: string = 'layers';
}
