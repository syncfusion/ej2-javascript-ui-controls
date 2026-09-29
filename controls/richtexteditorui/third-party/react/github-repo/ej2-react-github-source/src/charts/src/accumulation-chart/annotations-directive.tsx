import { ComplexBase } from '@syncfusion/ej2-react-base';
import { AccumulationAnnotationSettingsModel } from '@syncfusion/ej2-charts';

export interface AccumulationAnnotationSettingsDirTypecast {
    content?: string | Function | any;
}
/**
 * `AccumulationAnnotationsDirective` directive represent a annotation of the react AccumulationChart.
 * It must be contained in a Pie component(`AccumulationChart`). 
 * ```
 * <AccumulationChartComponent>
 * <AccumulationAnnotationsDirective>
 * <AccumulationAnnotationDirective></AccumulationAnnotationDirective>
 * </AccumulationAnnotationsDirective>
 * </AccumulationChartComponent>
 * ```
 */
export class AccumulationAnnotationDirective extends ComplexBase<AccumulationAnnotationSettingsModel| AccumulationAnnotationSettingsDirTypecast & { children?: React.ReactNode }, AccumulationAnnotationSettingsModel| AccumulationAnnotationSettingsDirTypecast> {
    public static moduleName: string = 'accumulationAnnotation';
}

export class AccumulationAnnotationsDirective extends ComplexBase<{}, {}> {
    public static propertyName: string = 'annotations';
    public static moduleName: string = 'accumulationAnnotations';
}
