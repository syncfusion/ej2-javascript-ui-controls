import { ComplexBase } from '@syncfusion/ej2-react-base';
import { Chart3DSeriesModel } from '@syncfusion/ej2-charts';

export interface Chart3DSeriesDirTypecast {
    dataLabel?: any;
}
/**
 * `SeriesDirective` directive represent a series of the react chart. 
 * It must be contained in a Chart component(`Chart3DComponent`). 
 * ```
 * <Chart3DComponent>
 * <Chart3DSeriesCollectionDirective>
 * <Chart3DSeriesDirective></Chart3DSeriesDirective>
 * </Chart3DSeriesCollectionDirective>
 * </Chart3DComponent>
 * ```
 */
export class Chart3DSeriesDirective extends ComplexBase<Chart3DSeriesModel| Chart3DSeriesDirTypecast & { children?: React.ReactNode }, Chart3DSeriesModel| Chart3DSeriesDirTypecast> {
    public static moduleName: string = 'chart3DSeries';
    public static complexTemplate: Object = {'dataLabel.template': 'dataLabel.template'};
}

export class Chart3DSeriesCollectionDirective extends ComplexBase<{}, {}> {
    public static propertyName: string = 'series';
    public static moduleName: string = 'chart3DSeriesCollection';
}
