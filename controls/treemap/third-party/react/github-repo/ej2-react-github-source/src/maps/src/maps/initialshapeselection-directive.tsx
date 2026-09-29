import { ComplexBase } from '@syncfusion/ej2-react-base';
import { InitialShapeSelectionSettingsModel } from '@syncfusion/ej2-maps';


/**
 * Represents the directive to configure the selection of the shapes when the maps is initially rendered.
 * ```
 * <MapsComponent>
 * <LayersDirective>
 * <LayerDirective>
 * <initialShapeSelectionsDirective>
 * <initialShapeSelectionDirective></initialShapeSelectionDirective>
 * </initialShapeSelectionsDirective>
 * </LayerDirective>
 * </LayersDirective>
 * </MapsComponent>
 * ```
 */
export class InitialShapeSelectionDirective extends ComplexBase<InitialShapeSelectionSettingsModel & { children?: React.ReactNode }, InitialShapeSelectionSettingsModel> {
    public static moduleName: string = 'initialShapeSelection';
}

export class InitialShapeSelectionsDirective extends ComplexBase<{}, {}> {
    public static propertyName: string = 'initialShapeSelection';
    public static moduleName: string = 'initialShapeSelections';
}
