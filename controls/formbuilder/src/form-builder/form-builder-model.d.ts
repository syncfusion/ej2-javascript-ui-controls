import { BaseEventArgs, Collection, Component, createElement, EmitType, Event, INotifyPropertyChanged, L10n, NotifyPropertyChanges, Property } from '@syncfusion/ej2-base';import { Button } from '@syncfusion/ej2-buttons';import { DropDownButton, ItemModel } from '@syncfusion/ej2-splitbuttons';import { InPlaceEditor } from '@syncfusion/ej2-inplace-editor';import { LeftPane } from './components/layout/left-pane';import { MainSection } from './components/layout/main-section';import { RightPane } from './components/layout/right-pane';import { defaultPalette } from './default-palette';import { LocalNavigator } from './types/form-schema';import { WidgetConfig } from './types/component-properties';import { CustomFormTemplate, PropertyDefinition, ToolboxCategory } from './model/base';import { defaultLocale } from './config/locale';import defaultTemplates from './default-template';import { FormNode, FormSchema, Schema } from '@syncfusion/ej2-form-renderer';import { FormWidgetType } from './model/base';import { defaultFormSchema, isDefaultFormSchema } from './context/default-form-schema';import { insertAtRoot, insertAtNested, insertAfterById, removeById, reorderRoot, reorderNested, moveById, moveNestedById, switchWidgetType } from './utils/schema-mutations';import { mapPropertiesToWidget, filterWidgetProperties, updateWidgetById, PendingDropContext, PendingWidgetSwitch } from './utils/property-mapping';import { setActiveFieldWrapper } from './utils/property-mapping';import { ClipboardHelper } from './utils/clipboard-helper';import { generateId, generateName, splitSchema, UnifiedSchema } from '@syncfusion/ej2-form-renderer';import componentProperties from './config/component-properties';import formSetting from './config/form-setting';import { importSplitSchemas } from './import/schema-import-utils';import { ToolboxItemSetting } from './model/base';import { ToolboxItemSettingModel } from './model/base-model';
import {FieldDragStartEventArgs,FieldDragOverEventArgs,FieldDroppedEventArgs,PropertyChangedEventArgs} from "./form-builder";
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class FormBuilder
 */
export interface FormBuilderModel extends ComponentModel{

    /**
     * Specifies the locale for the Form Builder.
     * Supports culture-specific localization for different languages and regions.
     *
     * @default 'en-US'
     */
    locale?: string;

    /**
     * Enables or disables the export functionality of the Form Builder.
     * When enabled, users can export the form schema as JSON.
     *
     * @default true
     */
    allowExport?: boolean;

    /**
     * Enables or disables the preview mode of the Form Builder.
     * When enabled, users can preview how the form will appear to end users.
     *
     * @default true
     */
    enablePreview?: boolean;

    /**
     * Enables or disables persistence of the Form Builder state.
     * When enabled, the builder state and form schema are persisted across sessions.
     *
     * @default false
     */
    enablePersistence?: boolean;

    /**
     * Enables or disables right-to-left (RTL) text direction rendering.
     * Use this for languages and locales that require RTL text direction.
     *
     * @default false
     */
    enableRtl?: boolean;

    /**
     * Specifies the current builder mode, which determines the interface complexity and available features.
     * 'Simple' mode provides a simplified interface for basic form creation.
     * 'Developer' mode provides advanced features and full control over the form schema.
     *
     * @default 'Developer'
     */
    mode?: 'Simple' | 'Developer';

    /**
     * Specifies custom form templates for rendering components in the builder.
     * Allows default templates to be overridden with custom HTML and styling.
     *
     * @default null
     */
    formTemplates?: CustomFormTemplate[] | null;

    /**
     * Specifies custom toolbox configuration for the Form Builder component palette.
     * Allows customizing which components are available and how they are organized.
     *
     * @default null
     */
    toolboxCategories?: ToolboxCategory[] | null;

    /**
     * Specifies the collection of toolbox items shown in the Form Builder component toolbox.
     * Each item defines a component that can be dragged onto the form canvas.
     * Use this property to customize the toolbox items and render custom components using templates.
     *
     * @default []
     */
    toolboxItems?: ToolboxItemSettingModel[];

    /**
     * Specifies the form schema to be loaded and edited in the Form Builder.
     * It can be provided as a JSON string, an object, or a Schema interface instance.
     *
     * @default null
     */
    schema?: Schema | string | Record<string, unknown> | null;

    /**
     * Event triggered when a drag operation starts on a form field in the Form Builder.
     * Provides information about the field being dragged and its drag context.
     *
     * @event onFieldDragStarted
     */
    onFieldDragStarted?: EmitType<FieldDragStartEventArgs>;

    /**
     * Event triggered while a drag operation is in progress over a valid drop target in the Form Builder.
     * Useful for providing visual feedback during drag operations.
     *
     * @event onFieldDragOver
     */
    onFieldDragOver?: EmitType<FieldDragOverEventArgs>;

    /**
     * Event triggered when a form field is successfully dropped onto a target in the Form Builder.
     * Provides information about the dropped field and its new position.
     *
     * @event onFieldDropped
     */
    onFieldDropped?: EmitType<FieldDroppedEventArgs>;

    /**
     * Specifies whether to enable the sanitization of untrusted HTML in custom widget string/script templates.
     *
     * @default false
     */
    enableHtmlSanitizer?: boolean;

    /**
     * Event triggered when a property of a form field is successfully changed in the Form Builder.
     * Provides information about the changed property and the affected field.
     *
     * @event onFieldPropertyChanged
     */
    onFieldPropertyChanged?: EmitType<PropertyChangedEventArgs>;

}