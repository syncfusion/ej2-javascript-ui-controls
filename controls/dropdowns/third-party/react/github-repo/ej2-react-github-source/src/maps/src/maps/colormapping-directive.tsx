import { ComplexBase } from '@syncfusion/ej2-react-base';
import { ColorMappingSettingsModel } from '@syncfusion/ej2-maps';


/**
 * Represents the directive to define the bubble color mapping in the maps.
 * ```
 * <MapsComponent>
 * <LayersDirective>
 * <LayerDirective>
 * <BubblesDirective>
 * <ColorMappingsDirective>
 * <ColorMappingDirective></ColorMappingDirective>
 * </ColorMappingsDirective>
 * </BubblesDirective>
 * </LayerDirective>
 * </LayersDirective>
 * </MapsComponent>
 * ```
 */
export class ColorMappingDirective extends ComplexBase<ColorMappingSettingsModel & { children?: React.ReactNode }, ColorMappingSettingsModel> {
    public static moduleName: string = 'colorMapping';
}

export class ColorMappingsDirective extends ComplexBase<{}, {}> {
    public static propertyName: string = 'colorMapping';
    public static moduleName: string = 'colorMappings';
}
