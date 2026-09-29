import { ComplexBase } from '@syncfusion/ej2-react-base';
import { MarkerSettingsModel } from '@syncfusion/ej2-maps';

export interface MarkerSettingsDirTypecast {
    template?: string | Function | any;
    tooltipSettings?: any;
}
/**
 * Represents the directive to define the markers in the maps.
 * ```
 * <MapsComponent>
 * <LayersDirective>
 * <LayerDirective>
 * <MarkersDirective>
 * <MarkerDirective></MarkerDirective>
 * </MarkersDirective>
 * </LayerDirective>
 * </LayersDirective>
 * </MapsComponent>
 * ```
 */
export class MarkerDirective extends ComplexBase<MarkerSettingsModel| MarkerSettingsDirTypecast & { children?: React.ReactNode }, MarkerSettingsModel| MarkerSettingsDirTypecast> {
    public static moduleName: string = 'marker';
    public static complexTemplate: Object = {'tooltipSettings.template': 'tooltipSettings.template'};
}

export class MarkersDirective extends ComplexBase<{}, {}> {
    public static propertyName: string = 'markerSettings';
    public static moduleName: string = 'markers';
}
