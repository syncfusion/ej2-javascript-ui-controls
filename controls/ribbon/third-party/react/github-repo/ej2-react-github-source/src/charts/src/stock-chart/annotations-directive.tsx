import { ComplexBase } from '@syncfusion/ej2-react-base';
import { StockChartAnnotationSettingsModel } from '@syncfusion/ej2-charts';

export interface StockChartAnnotationSettingsDirTypecast {
    content?: string | Function | any;
}
/**
 * `Annotation` directive represent a annotation of the react Chart. 
 * It must be contained in a Chart component(`ChartComponent`). 
 * ```
 * <StockChartComponent> 
 * <StockChartAnnotationsDirective>
 * <StockChartAnnotationDirective></StockChartAnnotationDirective>
 * </StockChartAnnotationsDirective>
 * </StockChartComponent>
 * ```
 */
export class StockChartAnnotationDirective extends ComplexBase<StockChartAnnotationSettingsModel| StockChartAnnotationSettingsDirTypecast & { children?: React.ReactNode }, StockChartAnnotationSettingsModel| StockChartAnnotationSettingsDirTypecast> {
    public static moduleName: string = 'stockChartAnnotation';
}

export class StockChartAnnotationsDirective extends ComplexBase<{}, {}> {
    public static propertyName: string = 'annotations';
    public static moduleName: string = 'stockChartAnnotations';
}
