import { BaseEventArgs, Component, EmitType, INotifyPropertyChanged } from '@syncfusion/ej2-base';
import { CustomFormTemplate, PropertyDefinition, ToolboxCategory } from './model/base';
import { Schema } from '@syncfusion/ej2-form-renderer';
import { FormWidgetType } from './model/base';
import { FormBuilderModel } from './form-builder-model';
import { ToolboxItemSettingModel } from './model/base-model';
/**
 * Event arguments for the field drag-start event.
 */
export interface FieldDragStartEventArgs extends BaseEventArgs {
    /**
     * Provides the name assigned to the form field.
     */
    componentName: string | null;
    /**
     * Provides the component type of the form field.
     */
    componentType: string;
    /**
     * Provides the id of the source container from which the form field is dragged.
     */
    sourceContainerId: string;
    /**
     * Indicates whether the form field is nested within a layout container.
     */
    isNested: boolean;
}
/**
 * Event arguments for the field drag-over event.
 */
export interface FieldDragOverEventArgs extends BaseEventArgs {
    /**
     * Indicates whether the form field is nested within a layout container.
     */
    isNested: boolean;
}
/**
 * Event arguments for the field drop event.
 */
export interface FieldDroppedEventArgs extends BaseEventArgs {
    /**
     * Provides the name assigned to the form field.
     */
    componentName: string;
    /**
     * Indicates whether the form field was reordered.
     */
    isReordered: boolean;
    /**
     * Provides the component type of the form field.
     */
    componentType: string;
    /**
     * Provides the id of the source container from which the form field is dragged.
     */
    sourceContainerId: string;
    /**
     * Provides the id of the target container into which the form field is dropped.
     */
    targetContainerId: string;
}
/**
 * Event arguments for the field property-changed event.
 */
export interface PropertyChangedEventArgs extends BaseEventArgs {
    /**
     * Provides the name of the property that was changed.
     */
    propertyName: string;
    /**
     * Provides the new value of the changed property.
     */
    propertyValue: any;
    /**
     * Provides the name of the field to which the property belongs.
     */
    fieldName: string;
}
/**
 * The Form Builder component provides an interface for creating a form structure and
 * rendering a fully functional, Syncfusion-based form in your application from the
 * exported form schema. It handles field mapping, conditional visibility/disabling,
 * expression evaluation, custom validation, and data submission.
 *
 * ```typescript
 * let builder: FormBuilder = new FormBuilder({ });
 * builder.appendTo('#container');
 * ```
 */
export declare class FormBuilder extends Component<HTMLElement> implements INotifyPropertyChanged {
    /**
     * Specifies the locale for the Form Builder.
     * Supports culture-specific localization for different languages and regions.
     *
     * @default 'en-US'
     */
    locale: string;
    /**
     * Enables or disables the export functionality of the Form Builder.
     * When enabled, users can export the form schema as JSON.
     *
     * @default true
     */
    allowExport: boolean;
    /**
     * Enables or disables the preview mode of the Form Builder.
     * When enabled, users can preview how the form will appear to end users.
     *
     * @default true
     */
    enablePreview: boolean;
    /**
     * Enables or disables persistence of the Form Builder state.
     * When enabled, the builder state and form schema are persisted across sessions.
     *
     * @default false
     */
    enablePersistence: boolean;
    /**
     * Enables or disables right-to-left (RTL) text direction rendering.
     * Use this for languages and locales that require RTL text direction.
     *
     * @default false
     */
    enableRtl: boolean;
    /**
     * Specifies the current builder mode, which determines the interface complexity and available features.
     * 'Simple' mode provides a simplified interface for basic form creation.
     * 'Developer' mode provides advanced features and full control over the form schema.
     *
     * @default 'Developer'
     */
    mode: 'Simple' | 'Developer';
    /**
     * Specifies custom form templates for rendering components in the builder.
     * Allows default templates to be overridden with custom HTML and styling.
     *
     * @default null
     */
    formTemplates: CustomFormTemplate[] | null;
    /**
     * Specifies custom toolbox configuration for the Form Builder component palette.
     * Allows customizing which components are available and how they are organized.
     *
     * @default null
     */
    toolboxCategories: ToolboxCategory[] | null;
    /**
     * Specifies the collection of toolbox items shown in the Form Builder component toolbox.
     * Each item defines a component that can be dragged onto the form canvas.
     * Use this property to customize the toolbox items and render custom components using templates.
     *
     * @default []
     */
    toolboxItems: ToolboxItemSettingModel[];
    /**
     * Specifies the form schema to be loaded and edited in the Form Builder.
     * It can be provided as a JSON string, an object, or a Schema interface instance.
     *
     * @default null
     */
    schema: Schema | string | Record<string, unknown> | null;
    /**
     * Event triggered when a drag operation starts on a form field in the Form Builder.
     * Provides information about the field being dragged and its drag context.
     *
     * @event onFieldDragStarted
     */
    onFieldDragStarted: EmitType<FieldDragStartEventArgs>;
    /**
     * Event triggered while a drag operation is in progress over a valid drop target in the Form Builder.
     * Useful for providing visual feedback during drag operations.
     *
     * @event onFieldDragOver
     */
    onFieldDragOver: EmitType<FieldDragOverEventArgs>;
    /**
     * Event triggered when a form field is successfully dropped onto a target in the Form Builder.
     * Provides information about the dropped field and its new position.
     *
     * @event onFieldDropped
     */
    onFieldDropped: EmitType<FieldDroppedEventArgs>;
    /**
     * Specifies whether to enable the sanitization of untrusted HTML in custom widget string/script templates.
     *
     * @default false
     */
    enableHtmlSanitizer: boolean;
    /**
     * Event triggered when a property of a form field is successfully changed in the Form Builder.
     * Provides information about the changed property and the affected field.
     *
     * @event onFieldPropertyChanged
     */
    onFieldPropertyChanged: EmitType<PropertyChangedEventArgs>;
    private leftPane;
    private mainSection;
    private rightPane;
    private currentSchema;
    private activeFieldId;
    private activeFieldWrapper;
    private pendingComponent;
    private pendingDropContext;
    private pendingWidgetSwitch;
    private editingField;
    private modeDropDownButton;
    private modeDropDownHost;
    private titleInPlaceEditor;
    private titleInPlaceEditorHost;
    private exportSeparator;
    private l10n;
    private copiedFieldRef;
    private hasClipboardData;
    private isLeftPaneCollapsed;
    private isRightPaneCollapsed;
    private isMobile;
    private isLeftPaneHovered;
    private isRightPaneHovered;
    private containerWidth;
    private windowResizeHandler;
    private resizeDebounceTimer;
    private leftPaneHoverTimeout;
    private rightPaneHoverTimeout;
    private leftPaneToggleHost;
    private rightPaneToggleHost;
    private mobileLeftPaneToggleHost;
    private mobileRightPaneToggleHost;
    private sidebarOverlay;
    private contentTouchGuard;
    private isDropBatching;
    private hasPendingDropBatchRender;
    private dirtyKeys;
    private hasExplicitFormTemplates;
    /** @private */
    constructor(options?: FormBuilderModel, element?: string | HTMLDivElement);
    /** @private */
    protected preRender(): void;
    /** @private */
    protected render(): void;
    private handleRightPanePropertyChanged;
    private onFieldDragStartedCall;
    private onFieldDragOverCall;
    private onFieldDroppedCall;
    private ensurePaneToggles;
    private applyResponsiveState;
    private applyMobileOnlyResponsiveState;
    private applyPaneClasses;
    private getLeftChevronClass;
    private getRightChevronClass;
    private isMobileNow;
    private handleLeftPaneToggle;
    private handleRightPaneToggle;
    private applyResponsiveStateFirstThen;
    private handleContainerResize;
    private adjustElementVisibility;
    private ensureMobileToggles;
    private ensureTitleInPlaceEditor;
    private syncTitleInPlaceEditorFromSchema;
    private applyPaneClassesForCurrent;
    /** @private */
    onPropertyChanged(newProps: FormBuilderModel, oldProps: FormBuilderModel): void;
    /**
     * Retrieves the definition of a property for the specified component type.
     *
     * @param {FormWidgetType} componentType - The component type whose property definition is retrieved.
     * @param {string} propertyName - The key of the property to retrieve.
     * @returns {PropertyDefinition | undefined} The property definition if found; otherwise, undefined.
     */
    getProperty(componentType: FormWidgetType, propertyName: string): PropertyDefinition | undefined;
    /**
     * Updates or adds a property definition for the specified component type.
     * If a property with the same key already exists in the component's configured
     * groups, it is replaced; otherwise, the property is added to the Display group.
     * When the currently edited field matches the
     * component type, the property editor is reopened to reflect the change.
     *
     * @param {FormWidgetType} componentType - The component type whose property definition is updated.
     * @param {PropertyDefinition} property - The property definition to set.
     * @returns {void}
     */
    setProperty(componentType: FormWidgetType, property: PropertyDefinition): void;
    private getCurrentEditedField;
    /** @private */
    destroy(): void;
    /** @private */
    getPersistData(): string;
    /** @private */
    getModuleName(): string;
    /**
     * Programmatically sets a form field's value for user edits.
     *
     * @param  {string} fieldName - The field's `name` (the schema property's `name`).
     * @param  {any} value - The new value to set.
     * @returns void
     */
    setFieldValue(fieldName: string, value: any): void;
    private handleCopySchema;
    private handleResetSchema;
    private handleModeSelect;
    private downloadCombinedSchema;
    private disposeHeaderControls;
    private handleDrop;
    private handleNestedDrop;
    private handleReorder;
    private handleNestedReorder;
    private handleDelete;
    private isDescendantOf;
    private getOrCreateRightPane;
    private setPendingComponent;
    private handleEdit;
    private handleCopy;
    private handlePaste;
    private handleSwitchWidget;
    private handleMoveUp;
    private handleMoveDown;
    private handleNestedMoveUp;
    private handleNestedMoveDown;
    private reRenderCanvas;
    private beginDropBatch;
    private endDropBatch;
    private updateExportButtonState;
    private showPasteButtons;
    private hidePasteButtons;
    private handlePropertyDialogSave;
    private isFormSettingsPayload;
    private mapComponents;
    private findComponentById;
    private handleRightPaneClose;
}
export default FormBuilder;
