import { ComplexBase } from '@syncfusion/ej2-react-base';
import { ChartAnnotationSettingsModel } from '@syncfusion/ej2-charts';

export interface ChartAnnotationSettingsDirTypecast {
    content?: string | Function | any;
}
/**
 * `Annotation` directive represent a annotation of the react Chart. 
 * It must be contained in a Chart component(`ChartComponent`). 
 * ```
 * <ChartComponent> 
 * <AnnotationsDirective>
 * <AnnotationDirective></AnnotationDirective>
 * </AnnotationsDirective>
 * </ChartComponent>
 * ```
 */
export class AnnotationDirective extends ComplexBase<ChartAnnotationSettingsModel| ChartAnnotationSettingsDirTypecast & { children?: React.ReactNode }, ChartAnnotationSettingsModel| ChartAnnotationSettingsDirTypecast> {
    public static moduleName: string = 'annotation';
}

export class AnnotationsDirective extends ComplexBase<{}, {}> {
    public static propertyName: string = 'annotations';
    public static moduleName: string = 'annotations';
}
