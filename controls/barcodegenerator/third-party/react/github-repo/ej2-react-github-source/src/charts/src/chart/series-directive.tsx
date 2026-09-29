import { ComplexBase } from '@syncfusion/ej2-react-base';
import { SeriesModel } from '@syncfusion/ej2-charts';

export interface SeriesDirTypecast {
    dataLabel?: any;
}
/**
 * `SeriesDirective` directive represent a series of the react chart. 
 * It must be contained in a Chart component(`ChartComponent`). 
 * ```
 * <ChartComponent>
 * <SeriesCollectionDirective>
 * <SeriesDirective></SeriesDirective>
 * </SeriesCollectionDirective>
 * </ChartComponent>
 * ```
 */
export class SeriesDirective extends ComplexBase<SeriesModel| SeriesDirTypecast & { children?: React.ReactNode }, SeriesModel| SeriesDirTypecast> {
    public static moduleName: string = 'series';
    public static complexTemplate: Object = {'dataLabel.template': 'dataLabel.template'};
}

export class SeriesCollectionDirective extends ComplexBase<{}, {}> {
    public static propertyName: string = 'series';
    public static moduleName: string = 'seriesCollection';
}
