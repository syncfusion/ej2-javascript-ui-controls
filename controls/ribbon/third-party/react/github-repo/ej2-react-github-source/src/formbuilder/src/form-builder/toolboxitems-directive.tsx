import { ComplexBase } from '@syncfusion/ej2-react-base';
import { ToolboxItemSettingModel } from '@syncfusion/ej2-form-builder';

export interface ToolboxItemSettingDirTypecast {
    template?: string | Function | any;
}
/**
 * `ToolboxItemSettingDirective` represents a custom widget
 * configuration item of the React FormBuilder component.
 * It must be contained within a
 * `ToolboxItemSettingsDirective` collection of a
 * `FormBuilderComponent`.
 * ```tsx
 * <FormBuilderComponent>
 * <ToolboxItemSettingsDirective>
 * <ToolboxItemSettingDirective />
 * </ToolboxItemSettingsDirective>
 * </FormBuilderComponent>
 * ```
 */
export class ToolboxItemSettingDirective extends ComplexBase<ToolboxItemSettingModel| ToolboxItemSettingDirTypecast & { children?: React.ReactNode }, ToolboxItemSettingModel| ToolboxItemSettingDirTypecast> {
    public static moduleName: string = 'toolboxItemSetting';
}

export class ToolboxItemSettingsDirective extends ComplexBase<{}, {}> {
    public static propertyName: string = 'toolboxItems';
    public static moduleName: string = 'toolboxItemSettings';
}
