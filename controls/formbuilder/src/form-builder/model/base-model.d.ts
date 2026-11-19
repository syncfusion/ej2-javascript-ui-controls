import { Property, ChildProperty } from '@syncfusion/ej2-base';import { PaletteItem } from '../types/form-schema';import { FieldProperties, FormSettings, LayoutNode } from '@syncfusion/ej2-form-renderer';
import {FormWidgetType} from "./base";

/**
 * Interface for a class ToolboxItemSetting
 */
export interface ToolboxItemSettingModel {

    /**
     * Specifies the template content to be used.
     *
     * @default null
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     */
    template?: string | HTMLElement | Function;

    /**
     * Specifies the Form Builder component type that this toolbox entry customizes.
     *
     * @default ''
     */
    type?: FormWidgetType;

    /**
     * Specifies a stable identifier that is persisted in the field schema,
     * allowing a downstream Form Renderer to resolve the matching custom-template
     * implementation when the schema is re-imported.
     *
     * @default ''
     */
    templateId?: string;

}