import { ComplexBase } from '@syncfusion/ej2-react-base';
import { AccumulationSeriesModel } from '@syncfusion/ej2-charts';

export interface AccumulationSeriesDirTypecast {
    dataLabel?: any;
}
/**
 * `AccumulationSeriesDirective` directive represent a series of the react AccumulationChart. 
 * It must be contained in a Pie component(`AccumulationChart`). 
 * ```
 * <AccumulationChartComponent>
 * <AccumulationSeriesCollectionDirective>
 * <AccumulationSeriesDirective></AccumulationSeriesDirective>
 * </AccumulationSeriesCollectionDirective>
 * </AccumulationChartComponent>
 * ```
 */
export class AccumulationSeriesDirective extends ComplexBase<AccumulationSeriesModel| AccumulationSeriesDirTypecast & { children?: React.ReactNode }, AccumulationSeriesModel| AccumulationSeriesDirTypecast> {
    public static moduleName: string = 'accumulationSeries';
    public static complexTemplate: Object = {'dataLabel.template': 'dataLabel.template'};
}

export class AccumulationSeriesCollectionDirective extends ComplexBase<{}, {}> {
    public static propertyName: string = 'series';
    public static moduleName: string = 'accumulationSeriesCollection';
}
