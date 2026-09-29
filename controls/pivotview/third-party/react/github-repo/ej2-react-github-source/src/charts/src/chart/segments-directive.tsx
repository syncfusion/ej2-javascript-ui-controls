import { ComplexBase } from '@syncfusion/ej2-react-base';
import { ChartSegmentModel } from '@syncfusion/ej2-charts';


/**
 * `SegmentDirective` directive represent a segment of the react chart. 
 * It must be contained in a Chart component(`ChartComponent`). 
 * ```
 * <ChartComponent>
 * <SeriesCollectionDirective>
 * <SeriesDirective>
 * <SegmentsDirective>
 * <SegmentDirective></SegmentDirective>
 * </SegmentsDirective>
 * </SeriesDirective>
 * </SeriesCollectionDirective>
 * </ChartComponent>
 * ```
 */
export class SegmentDirective extends ComplexBase<ChartSegmentModel & { children?: React.ReactNode }, ChartSegmentModel> {
    public static moduleName: string = 'segment';
}

export class SegmentsDirective extends ComplexBase<{}, {}> {
    public static propertyName: string = 'segments';
    public static moduleName: string = 'segments';
}
