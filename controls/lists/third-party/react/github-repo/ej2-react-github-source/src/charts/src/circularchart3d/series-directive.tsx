import { ComplexBase } from '@syncfusion/ej2-react-base';
import { CircularChart3DSeriesModel } from '@syncfusion/ej2-charts';

export interface CircularChart3DSeriesDirTypecast {
    dataLabel?: any;
}
/**
 * `CircularChart3DSeriesDirective` directive represent a series of the react Circular3D Chart. 
 * It must be contained in a Pie component(`CircularChart3D`). 
 * ```
 * <CircularChart3DComponent>
 * <CircularChart3DSeriesCollectionDirective>
 * <CircularChart3DSeriesDirective></CircularChart3DSeriesDirective>
 * </CircularChart3DSeriesCollectionDirective>
 * </CircularChart3DComponent>
 * ```
 */
export class CircularChart3DSeriesDirective extends ComplexBase<CircularChart3DSeriesModel| CircularChart3DSeriesDirTypecast & { children?: React.ReactNode }, CircularChart3DSeriesModel| CircularChart3DSeriesDirTypecast> {
    public static moduleName: string = 'circularChart3DSeries';
    public static complexTemplate: Object = {'dataLabel.template': 'dataLabel.template'};
}

export class CircularChart3DSeriesCollectionDirective extends ComplexBase<{}, {}> {
    public static propertyName: string = 'series';
    public static moduleName: string = 'circularChart3DSeriesCollection';
}
