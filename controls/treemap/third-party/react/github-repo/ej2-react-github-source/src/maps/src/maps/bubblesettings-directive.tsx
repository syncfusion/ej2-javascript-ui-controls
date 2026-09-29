import { ComplexBase } from '@syncfusion/ej2-react-base';
import { BubbleSettingsModel } from '@syncfusion/ej2-maps';

export interface BubbleSettingsDirTypecast {
    tooltipSettings?: any;
}
/**
 * Represents the directive to define the bubbles in the maps.
 * ```
 * <MapsComponent>
 * <LayersDirective>
 * <LayerDirective>
 * <BubblesDirective>
 * <BubbleDirective></BubbleDirective>
 * </BubblesDirective>
 * </LayerDirective>
 * </LayersDirective>
 * </MapsComponent>
 * ```
 */
export class BubbleDirective extends ComplexBase<BubbleSettingsModel| BubbleSettingsDirTypecast & { children?: React.ReactNode }, BubbleSettingsModel| BubbleSettingsDirTypecast> {
    public static moduleName: string = 'bubble';
    public static complexTemplate: Object = {'tooltipSettings.template': 'tooltipSettings.template'};
}

export class BubblesDirective extends ComplexBase<{}, {}> {
    public static propertyName: string = 'bubbleSettings';
    public static moduleName: string = 'bubbles';
}
