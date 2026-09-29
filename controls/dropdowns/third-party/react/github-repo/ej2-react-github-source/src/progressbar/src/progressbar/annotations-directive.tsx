import { ComplexBase } from '@syncfusion/ej2-react-base';
import { ProgressAnnotationSettingsModel } from '@syncfusion/ej2-progressbar';

export interface ProgressAnnotationSettingsDirTypecast {
    content?: string | Function | any;
}
/**
 * `ProgressBarAnnotationsDirective` directive represent a annotation of the react progressbar.
 * ```
 * <progressbarComponent>
 * <ProgressBarAnnotationsDirective>
 * <ProgressBarAnnotationDirective></ProgressBarAnnotationDirective>
 * </ProgressBarAnnotationsDirective>
 * </progressbarComponent>
 * ```
 */
export class ProgressBarAnnotationDirective extends ComplexBase<ProgressAnnotationSettingsModel| ProgressAnnotationSettingsDirTypecast & { children?: React.ReactNode }, ProgressAnnotationSettingsModel| ProgressAnnotationSettingsDirTypecast> {
    public static moduleName: string = 'progressBarAnnotation';
}

export class ProgressBarAnnotationsDirective extends ComplexBase<{}, {}> {
    public static propertyName: string = 'annotations';
    public static moduleName: string = 'progressBarAnnotations';
}
