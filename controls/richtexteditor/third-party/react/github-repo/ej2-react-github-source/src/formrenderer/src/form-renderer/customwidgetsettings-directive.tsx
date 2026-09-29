import { ComplexBase } from '@syncfusion/ej2-react-base';
import { CustomWidgetSettingModel } from '@syncfusion/ej2-form-renderer';

export interface CustomWidgetSettingDirTypecast {
    template?: string | Function | any;
}
/**
 * `CustomWidgetSettingDirective` represents a custom widget
 * configuration item of the React FormRenderer component.
 * It must be contained within a
 * `CustomWidgetSettingsDirective` collection of a
 * `FormRendererComponent`.
 * ```tsx
 * <FormRendererComponent>
 * <CustomWidgetSettingsDirective>
 * <CustomWidgetSettingDirective />
 * </CustomWidgetSettingsDirective>
 * </FormRendererComponent>
 * ```
 */
export class CustomWidgetSettingDirective extends ComplexBase<CustomWidgetSettingModel| CustomWidgetSettingDirTypecast & { children?: React.ReactNode }, CustomWidgetSettingModel| CustomWidgetSettingDirTypecast> {
    public static moduleName: string = 'customWidgetSetting';
}

export class CustomWidgetSettingsDirective extends ComplexBase<{}, {}> {
    public static propertyName: string = 'customWidgetSettings';
    public static moduleName: string = 'customWidgetSettings';
}
