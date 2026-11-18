import { BaseEventArgs, Collection, Component, createElement, EmitType, Event, INotifyPropertyChanged, L10n, NotifyPropertyChanges, Property } from '@syncfusion/ej2-base';
import { Button } from '@syncfusion/ej2-buttons';
import { DropDownButton, ItemModel } from '@syncfusion/ej2-splitbuttons';
import { InPlaceEditor } from '@syncfusion/ej2-inplace-editor';
import { LeftPane } from './components/layout/left-pane';
import { MainSection } from './components/layout/main-section';
import { RightPane } from './components/layout/right-pane';
import { defaultPalette } from './default-palette';
import { LocalNavigator } from './types/form-schema';
import { WidgetConfig } from './types/component-properties';
import { CustomFormTemplate, PropertyDefinition, ToolboxCategory } from './model/base';
import { defaultLocale } from './config/locale';
import defaultTemplates from './default-template';
import { FormNode, FormSchema, Schema } from '@syncfusion/ej2-form-renderer';
import { FormWidgetType } from './model/base';
import { defaultFormSchema, isDefaultFormSchema } from './context/default-form-schema';
import { insertAtRoot, insertAtNested, insertAfterById, removeById, reorderRoot, reorderNested, moveById, moveNestedById, switchWidgetType } from './utils/schema-mutations';
import { mapPropertiesToWidget, filterWidgetProperties, updateWidgetById, PendingDropContext, PendingWidgetSwitch } from './utils/property-mapping';
import { setActiveFieldWrapper } from './utils/property-mapping';
import { ClipboardHelper } from './utils/clipboard-helper';
import { generateId, generateName, splitSchema, UnifiedSchema } from '@syncfusion/ej2-form-renderer';
import componentProperties from './config/component-properties';
import formSetting from './config/form-setting';
import { importSplitSchemas } from './import/schema-import-utils';
import { FormBuilderModel } from './form-builder-model';
import { ToolboxItemSetting } from './model/base';
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
@NotifyPropertyChanges
export class FormBuilder extends Component<HTMLElement> implements INotifyPropertyChanged {
    /**
     * Specifies the locale for the Form Builder.
     * Supports culture-specific localization for different languages and regions.
     *
     * @default 'en-US'
     */
    @Property('en-US')
    public locale: string;

    /**
     * Enables or disables the export functionality of the Form Builder.
     * When enabled, users can export the form schema as JSON.
     *
     * @default true
     */
    @Property(true)
    public allowExport: boolean;

    /**
     * Enables or disables the preview mode of the Form Builder.
     * When enabled, users can preview how the form will appear to end users.
     *
     * @default true
     */
    @Property(true)
    public enablePreview: boolean;

    /**
     * Enables or disables persistence of the Form Builder state.
     * When enabled, the builder state and form schema are persisted across sessions.
     *
     * @default false
     */
    @Property(false)
    public enablePersistence: boolean;

    /**
     * Enables or disables right-to-left (RTL) text direction rendering.
     * Use this for languages and locales that require RTL text direction.
     *
     * @default false
     */
    @Property(false)
    public enableRtl: boolean;

    /**
     * Specifies the current builder mode, which determines the interface complexity and available features.
     * 'Simple' mode provides a simplified interface for basic form creation.
     * 'Developer' mode provides advanced features and full control over the form schema.
     *
     * @default 'Developer'
     */
    @Property('Developer')
    public mode: 'Simple' | 'Developer';

    /**
     * Specifies custom form templates for rendering components in the builder.
     * Allows default templates to be overridden with custom HTML and styling.
     *
     * @default null
     */
    @Property(null)
    public formTemplates: CustomFormTemplate[] | null;

    /**
     * Specifies custom toolbox configuration for the Form Builder component palette.
     * Allows customizing which components are available and how they are organized.
     *
     * @default null
     */
    @Property(null)
    public toolboxCategories: ToolboxCategory[] | null;

    /**
     * Specifies the collection of toolbox items shown in the Form Builder component toolbox.
     * Each item defines a component that can be dragged onto the form canvas.
     * Use this property to customize the toolbox items and render custom components using templates.
     *
     * @default []
     */
    @Collection<ToolboxItemSettingModel>([], ToolboxItemSetting)
    public toolboxItems: ToolboxItemSettingModel[];

    /**
     * Specifies the form schema to be loaded and edited in the Form Builder.
     * It can be provided as a JSON string, an object, or a Schema interface instance.
     *
     * @default null
     */
    @Property(null)
    public schema: Schema | string | Record<string, unknown> | null;

    /**
     * Event triggered when a drag operation starts on a form field in the Form Builder.
     * Provides information about the field being dragged and its drag context.
     *
     * @event onFieldDragStarted
     */
    @Event()
    public onFieldDragStarted: EmitType<FieldDragStartEventArgs>;

    /**
     * Event triggered while a drag operation is in progress over a valid drop target in the Form Builder.
     * Useful for providing visual feedback during drag operations.
     *
     * @event onFieldDragOver
     */
    @Event()
    public onFieldDragOver: EmitType<FieldDragOverEventArgs>;

    /**
     * Event triggered when a form field is successfully dropped onto a target in the Form Builder.
     * Provides information about the dropped field and its new position.
     *
     * @event onFieldDropped
     */
    @Event()
    public onFieldDropped: EmitType<FieldDroppedEventArgs>;

    /**
     * Specifies whether to enable the sanitization of untrusted HTML in custom widget string/script templates.
     *
     * @default false
     */
    @Property(false)
    public enableHtmlSanitizer: boolean;

    /**
     * Event triggered when a property of a form field is successfully changed in the Form Builder.
     * Provides information about the changed property and the affected field.
     *
     * @event onFieldPropertyChanged
     */
    @Event()
    public onFieldPropertyChanged: EmitType<PropertyChangedEventArgs>;

    private leftPane: LeftPane | null;
    private mainSection: MainSection | null;
    private rightPane: RightPane | null;
    private currentSchema: FormSchema;
    private activeFieldId: string | null;

    private activeFieldWrapper: HTMLElement | null;

    private pendingComponent: FormNode | null;

    private pendingDropContext: PendingDropContext | null;

    private pendingWidgetSwitch: PendingWidgetSwitch | null;

    private editingField: FormNode | null;

    private modeDropDownButton: DropDownButton | null;

    private modeDropDownHost: HTMLElement | null;

    private titleInPlaceEditor: InPlaceEditor | null;

    private titleInPlaceEditorHost: HTMLElement | null;

    private exportSeparator: HTMLElement | null;

    private l10n: L10n;

    private copiedFieldRef: FormNode | null;

    private hasClipboardData: boolean;

    private isLeftPaneCollapsed: boolean;

    private isRightPaneCollapsed: boolean;

    private isMobile: boolean;

    private isLeftPaneHovered: boolean;

    private isRightPaneHovered: boolean;

    private containerWidth: number;

    private windowResizeHandler: (() => void) | null;

    private resizeDebounceTimer: number | null;

    private leftPaneHoverTimeout: number | null;
    private rightPaneHoverTimeout: number | null;

    private leftPaneToggleHost: HTMLElement | null;
    private rightPaneToggleHost: HTMLElement | null;

    private mobileLeftPaneToggleHost: HTMLElement | null;
    private mobileRightPaneToggleHost: HTMLElement | null;

    private sidebarOverlay: HTMLElement | null;

    private contentTouchGuard: {
        el: HTMLElement;
        handler: (e: TouchEvent) => void;
        opts: AddEventListenerOptions;
        detach: () => void;
    } | null = null;
    private isDropBatching: boolean;

    private hasPendingDropBatchRender: boolean;

    private dirtyKeys: { fieldId: string; propertyKey: string }[];

    private hasExplicitFormTemplates: boolean;

    /** @private */
    constructor(options?: FormBuilderModel, element?: string | HTMLDivElement) {
        super(options, <string | HTMLDivElement>element);
        this.hasExplicitFormTemplates = !!options && options.formTemplates !== undefined && options.formTemplates !== null;
        this.allowExport = this.allowExport = options && options.allowExport !== undefined ? options.allowExport : true;
        this.enablePreview = options && options.enablePreview !== undefined ? options.enablePreview : true;
        this.activeFieldId = null;
        this.activeFieldWrapper = null;
        this.pendingComponent = null;
        this.copiedFieldRef = null;
        this.hasClipboardData = false;
        this.modeDropDownButton = null;
        this.modeDropDownHost = null;
        this.titleInPlaceEditor = null;
        this.titleInPlaceEditorHost = null;
        this.exportSeparator = null;
        this.pendingComponent = null;
        this.pendingDropContext = null;
        this.pendingWidgetSwitch = null;
        this.editingField = null;
        this.isLeftPaneCollapsed = false;
        this.isRightPaneCollapsed = false;
        this.isMobile = false;
        this.isLeftPaneHovered = false;
        this.isRightPaneHovered = false;
        this.containerWidth = 0;
        this.windowResizeHandler = null;
        this.resizeDebounceTimer = null;
        this.leftPaneHoverTimeout = null;
        this.rightPaneHoverTimeout = null;
        this.leftPaneToggleHost = null;
        this.rightPaneToggleHost = null;
        this.mobileLeftPaneToggleHost = null;
        this.mobileRightPaneToggleHost = null;
        this.sidebarOverlay = null;
        this.contentTouchGuard = null;
        this.isDropBatching = false;
        this.hasPendingDropBatchRender = false;
        this.dirtyKeys = [];
    }

    /** @private */
    protected preRender(): void {
        this.element.setAttribute('aria-label', 'Form Builder');

        if (this.enableRtl) {
            this.element.classList.add('e-rtl');
        } else {
            this.element.classList.remove('e-rtl');
        }

        // Seed the schema from the input if provided.
        if (this.schema) {
            if (typeof this.schema === 'string') {
                try {
                    const merged: FormSchema = importSplitSchemas(this.schema, defaultFormSchema());
                    this.currentSchema = merged;
                } catch (e) {
                    this.currentSchema = defaultFormSchema();
                }
            } else {
                const merged: FormSchema = importSplitSchemas(JSON.stringify(this.schema), defaultFormSchema());
                this.currentSchema = merged;
            }
        } else {
            if (this.enablePersistence && this.currentSchema !== null && !isDefaultFormSchema(this.currentSchema)) {
                this.currentSchema = this.currentSchema;
            } else {
                this.currentSchema = defaultFormSchema();
            }
        }
    }

    /** @private */
    protected render(): void {
        this.l10n = new L10n('formbuilder', defaultLocale, this.locale)
        this.element.innerHTML = '';

        const wrapper: HTMLElement = createElement('div', {
            className: 'builder-container'
        });
        wrapper.classList.add('e-component');
        wrapper.style.minWidth = '350px';
        const height: string = this.element.style.height;
        wrapper.style.height = height.endsWith('%')
            ? (parseFloat(height) * 7) + 'px'
            : height || '700px';

        if (this.enableRtl) {
            wrapper.classList.add('e-rtl');
        } else {
            wrapper.classList.remove('e-rtl');
        }
        
        const header: HTMLElement = createElement('div', {
            className: 'main-header'
        });
        const leftSection: HTMLElement = createElement('div', {
            className: 'left-section'
        });
        const rightSection: HTMLElement = createElement('div', {
            className: 'right-section'
        });
        const contentSection: HTMLElement = createElement('div', {
            className: 'contentSection'
        });
        const leftPaneHost: HTMLElement = createElement('aside', {
            className: 'e-form-builder-left-pane-host'
        });
        const mainSectionHost: HTMLElement = createElement('main', {
            className: 'main-section'
        });
        const rightPaneHost: HTMLElement = createElement('aside', {
            className: 'e-form-builder-right-pane-host right-sidebar'
        });

        const formSettings: { name?: string } = (this.currentSchema && this.currentSchema.settings) || {};
        const initialTitle: string = formSettings.name || 'Untitled Form';
        const titleHost: HTMLElement = createElement('div', {
            className: 'e-form-builder-title'
        });
        leftSection.appendChild(titleHost);
        this.titleInPlaceEditorHost = titleHost;
        this.disposeHeaderControls();
        this.titleInPlaceEditorHost = titleHost;
        const hostWidth: number = this.element
            ? this.element.getBoundingClientRect().width
            : 0;
        if (!(hostWidth > 0 && hostWidth <= 1024)) {
            let titleBeforeEdit: string = initialTitle;
            const titleInPlace: InPlaceEditor = new InPlaceEditor({
                type: 'Text',
                mode: 'Inline',
                enableRtl: this.enableRtl,
                value: initialTitle,
                beginEdit: () => {
                    titleBeforeEdit = ((this.currentSchema.settings as any).name || 'Untitled Form').toString();
                },
                change: (e: any) => {
                    const nextValue: string = (e && e.value !== undefined && e.value !== null)
                        ? String(e.value)
                        : initialTitle;
                    if (!this.currentSchema.settings) {
                        (this.currentSchema as any).settings = {};
                    }
                    (this.currentSchema.settings as any).name = nextValue;
                    if (this.pendingComponent === null && this.editingField === null && this.pendingWidgetSwitch === null) {
                        this.rightPane.openFormSettings(this.currentSchema.settings);
                    }
                },
                cancelClick: () => {
                    if (!this.currentSchema.settings) {
                        (this.currentSchema as any).settings = {};
                    }
                    (this.currentSchema.settings as any).name = titleBeforeEdit;
                    if (this.pendingComponent === null && this.editingField === null && this.pendingWidgetSwitch === null) {
                        this.rightPane.openFormSettings(this.currentSchema.settings);
                    }
                }
            });
            titleInPlace.appendTo(titleHost);
            this.titleInPlaceEditor = titleInPlace;
        }
        const modeItems: ItemModel[] = [
            { text: this.l10n.getConstant('simple') || 'Simple', id: 'simple' },
            { text: this.l10n.getConstant('developer') || 'Developer', id: 'developer' }
        ];
        const modeKey: string = (this.mode || 'Developer').toLowerCase();
        const modeLabel: string = this.l10n.getConstant(modeKey) || this.mode;
        const modeAria: string = this.l10n.getConstant(modeKey + 'Mode') || modeLabel;
        const modeHost: HTMLElement = createElement('button', {
            attrs: {
                'type': 'button',
                'aria-label': modeAria
            }
        });
        rightSection.appendChild(modeHost);
        this.modeDropDownHost = modeHost;

        const modeDropDown: DropDownButton = new DropDownButton({
            items: modeItems,
            cssClass: 'e-outline mode-button',
            content: modeLabel,
            enableRtl: this.enableRtl,
            popupWidth: '120px',
            select: this.handleModeSelect.bind(this)
        });
        modeDropDown.appendTo(modeHost);
        this.modeDropDownButton = modeDropDown;
        if (this.allowExport) {
            const separator: HTMLElement = createElement('div', {
                className: 'separator'
            });
            rightSection.appendChild(separator);
            this.exportSeparator = separator;

            const exportHost: HTMLElement = createElement('button', {
                attrs: {
                    'type': 'button',
                    'aria-label': 'Export json schema'
                }
            });
            rightSection.appendChild(exportHost);
            const exportLabel: string = this.l10n.getConstant('export') || 'Export';
            const exportButton: Button = new Button({
                cssClass: 'action-btn e-flat e-primary',
                content: exportLabel,
                disabled: isDefaultFormSchema(this.currentSchema),
                enableRtl: this.enableRtl
            });
            exportButton.appendTo(exportHost);
            exportButton.element.onclick = this.downloadCombinedSchema.bind(this);
        }
        rightPaneHost.setAttribute('role', 'complementary');
        rightPaneHost.setAttribute('aria-label', 'Form Settings');

        header.appendChild(leftSection);
        header.appendChild(rightSection);

        contentSection.appendChild(leftPaneHost);
        contentSection.appendChild(mainSectionHost);
        contentSection.appendChild(rightPaneHost);

        wrapper.appendChild(header);
        wrapper.appendChild(contentSection);
        this.element.appendChild(wrapper);
        const liveHostWidth: number = this.element
            ? this.element.getBoundingClientRect().width
            : 0;
        const mobileNow: boolean = liveHostWidth > 0 && liveHostWidth <= 1024;
        if (mobileNow) {
            this.isMobile = true;
            this.isLeftPaneCollapsed = true;
            this.isRightPaneCollapsed = true;
            this.containerWidth = liveHostWidth;
        }
        this.ensurePaneToggles(leftPaneHost, mainSectionHost, rightPaneHost, contentSection, leftSection);

        if (this.leftPane) {
            this.leftPane.destroy();
        }
        if (this.mainSection) {
            this.mainSection.destroy();
        }
        if (this.rightPane) {
            this.rightPane.destroy();
        }

        this.leftPane = new LeftPane(leftPaneHost, {
            className: 'left-pane',
            paletteConfig: (this.toolboxCategories || defaultPalette) as ToolboxCategory[],
            mode: this.mode,
            locale: this.locale,
            enableRtl: this.enableRtl,
            templates: this.hasExplicitFormTemplates ? (this.formTemplates || []) : defaultTemplates,
            onFieldDragStarted: this.onFieldDragStartedCall.bind(this),
            onDrop: this.handleDrop.bind(this),
            containerWidth: this.element.getBoundingClientRect().width
        }, this.l10n);
        this.mainSection = new MainSection(mainSectionHost, {
            formSchema: this.currentSchema,
            paletteConfig: (this.toolboxCategories || defaultPalette) as ToolboxCategory[],
            parent: this.element,
            activeFieldId: this.activeFieldId || undefined,
            mode: this.mode,
            enableRtl: this.enableRtl,
            enablePreview: this.enablePreview,
            locale: this.locale,
            hasClipboardData: this.hasClipboardData,
            onDrop: this.handleDrop.bind(this),
            onNestedDrop: this.handleNestedDrop.bind(this),
            onReorder: this.handleReorder.bind(this),
            onNestedReorder: this.handleNestedReorder.bind(this),
            onDelete: this.handleDelete.bind(this),
            onEdit: this.handleEdit.bind(this),
            onReset: this.handleResetSchema.bind(this),
            onCopySchema: this.handleCopySchema.bind(this),
            onCopy: this.handleCopy.bind(this),
            onPaste: this.handlePaste.bind(this),
            onSwitchWidget: this.handleSwitchWidget.bind(this),
            onMoveUp: this.handleMoveUp.bind(this),
            onMoveDown: this.handleMoveDown.bind(this),
            onNestedMoveUp: this.handleNestedMoveUp.bind(this),
            onNestedMoveDown: this.handleNestedMoveDown.bind(this),
            onFieldDropped: this.onFieldDroppedCall.bind(this),
            onFieldDraggingOver: this.onFieldDragOverCall.bind(this),
            onDropBatchStart: this.beginDropBatch.bind(this),
            onDropBatchEnd: this.endDropBatch.bind(this),
            formBuilder: this
        }, this.l10n);
        this.mainSection.render(this.currentSchema);

        this.rightPane = new RightPane({
            host: rightPaneHost,
            parent: this.element,
            l10n: this.l10n,
            mode: this.mode,
            formSchema: this.currentSchema,
            configData: componentProperties as WidgetConfig,
            locale: this.locale,
            enableRtl: this.enableRtl,
            formSettingsConfig: formSetting as any,
            onSave: (values: Record<string, any>, key?: string) => this.handlePropertyDialogSave(values, key),
            onPropertyChanged: this.handleRightPanePropertyChanged.bind(this),
            onClose: () => this.handleRightPaneClose()
        });
        this.rightPane.render();
        const editorHandle: HTMLElement | null = this.element
            ? this.element.querySelector('.builder-container > .contentSection > .main-section > .editor-handle')
            : null;
        this.applyResponsiveState(leftPaneHost, mainSectionHost, rightPaneHost, editorHandle);
    }
    
    private handleRightPanePropertyChanged(args: { field: string; property: string; value: any; name: string }): void {
        if (this.onFieldPropertyChanged) {
            this.trigger('onFieldPropertyChanged', {
                propertyName: args.property,
                propertyValue: args.value,
                fieldName: args.name
            });
        }
    }

    private onFieldDragStartedCall(args: FieldDragStartEventArgs) {
      if (this.onFieldDragStarted) {
            this.trigger('onFieldDragStarted', args as FieldDragStartEventArgs);
        }
    }

    private onFieldDragOverCall(args: FieldDragOverEventArgs) {
      if (this.onFieldDragOver) {
            this.trigger('onFieldDragOver', args as FieldDragOverEventArgs);
        }
    }

    private onFieldDroppedCall(args: FieldDroppedEventArgs) {
      if (this.onFieldDropped) {
            this.trigger('onFieldDropped', args as FieldDroppedEventArgs);
        }
    }

    private ensurePaneToggles(
        leftPaneHost: HTMLElement,
        mainSectionHost: HTMLElement,
        rightPaneHost: HTMLElement,
        contentSection: HTMLElement,
        leftSection: HTMLElement
    ): void {
        const leftToggle: HTMLElement = createElement('button', {
            className: 'left-pane-toggle e-btn ' +
                (this.isLeftPaneCollapsed ? 'collapsed' : 'expanded'),
            attrs: {
                'type': 'button',
                'aria-label': this.isLeftPaneCollapsed
                    ? 'Expand component palette'
                    : 'Collapse component palette',
                'aria-expanded': this.isLeftPaneCollapsed ? 'false' : 'true'
            }
        });
        const leftChevron: HTMLElement = createElement('span', {
            className: 'e-btn-icon e-icons ' + this.getLeftChevronClass(),
            attrs: { 'aria-hidden': 'true' }
        });
        leftToggle.appendChild(leftChevron);
        if (this.isLeftPaneCollapsed && this.isLeftPaneHovered) {
            const leftExpandLabel: HTMLElement = createElement('span', {
                styles: 'margin-left: 8px;'
            });
            leftExpandLabel.textContent = 'Expand';
            leftToggle.appendChild(leftExpandLabel);
        }
        leftToggle.onclick = (e: MouseEvent) => {
            e.stopPropagation();
            this.handleLeftPaneToggle();
        };
        contentSection.insertBefore(leftToggle, mainSectionHost);
        this.leftPaneToggleHost = leftToggle;

        const rightToggle: HTMLElement = createElement('button', {
            className: 'right-pane-toggle e-btn ' +
                (this.isRightPaneCollapsed ? 'collapsed' : 'expanded'),
            attrs: {
                'type': 'button',
                'aria-label': this.isRightPaneCollapsed
                    ? 'Expand properties panel'
                    : 'Collapse properties panel',
                'aria-expanded': this.isRightPaneCollapsed ? 'false' : 'true'
            }
        });
        const rightChevron: HTMLElement = createElement('span', {
            className: 'e-btn-icon e-icons ' + this.getRightChevronClass(),
            attrs: { 'aria-hidden': 'true' }
        });
        rightToggle.appendChild(rightChevron);
        if (this.isRightPaneCollapsed && this.isRightPaneHovered) {
            const rightExpandLabel: HTMLElement = createElement('span', {
                styles: 'margin-left: 8px;'
            });
            rightExpandLabel.textContent = 'Expand';
            rightToggle.appendChild(rightExpandLabel);
        }
        rightToggle.onclick = (e: MouseEvent) => {
            e.stopPropagation();
            this.handleRightPaneToggle();
        };
        contentSection.insertBefore(rightToggle, rightPaneHost);
        this.rightPaneToggleHost = rightToggle;

        const isMobileNow: boolean = this.element
            ? this.element.getBoundingClientRect().width <= 1024
                && this.element.getBoundingClientRect().width > 0
            : false;
        if (isMobileNow) {
            const mobileLeftToggle: HTMLElement = createElement('button', {
                className: 'e-btn e-flat mobile-toggle',
                attrs: {
                    'type': 'button',
                    'aria-label': 'Open component palette'
                }
            });
            const mobileLeftChevron: HTMLElement = createElement('span', {
                className: 'e-btn-icon e-icons e-show-hide-panel'
            });
            mobileLeftToggle.appendChild(mobileLeftChevron);
            mobileLeftToggle.onclick = (e: MouseEvent) => {
                e.stopPropagation();
                this.handleLeftPaneToggle();
            };
            if (leftSection.firstChild) {
                leftSection.insertBefore(mobileLeftToggle, leftSection.firstChild);
            } else {
                leftSection.appendChild(mobileLeftToggle);
            }
            this.mobileLeftPaneToggleHost = mobileLeftToggle;

            const mobileRightToggle: HTMLElement = createElement('button', {
                className: 'e-btn  e-flat mobile-toggle',
                attrs: {
                    'type': 'button',
                    'aria-label': 'Open properties panel'
                }
            });
            const mobileRightChevron: HTMLElement = createElement('span', {
                className: 'e-btn-icon e-icons e-adjustment'
            });
            mobileRightToggle.appendChild(mobileRightChevron);
            mobileRightToggle.onclick = (e: MouseEvent) => {
                e.stopPropagation();
                this.handleRightPaneToggle();
            };
            const rightHeader: HTMLElement | null = this.modeDropDownHost && this.modeDropDownHost.parentNode
                ? (this.modeDropDownHost.parentNode as HTMLElement)
                : (contentSection.parentNode
                    ? (contentSection.parentNode as HTMLElement).querySelector('.right-section')
                    : null);
            if (rightHeader) {
                rightHeader.appendChild(mobileRightToggle);
            }
            this.mobileRightPaneToggleHost = mobileRightToggle;
        }

        const wrapper: HTMLElement = this.element.querySelector(
            '.builder-container'
        ) as HTMLElement;
        if (wrapper) {
            if (this.windowResizeHandler) {
                window.removeEventListener('resize', this.windowResizeHandler);
                this.windowResizeHandler = null;
            }
            if (this.resizeDebounceTimer !== null) {
                clearTimeout(this.resizeDebounceTimer);
                this.resizeDebounceTimer = null;
            }
            let resizeHandler: () => void = (): void => {
                if (this.resizeDebounceTimer !== null) {
                    clearTimeout(this.resizeDebounceTimer);
                }
                this.resizeDebounceTimer = window.setTimeout((): void => {
                    this.resizeDebounceTimer = null;
                    const liveWrapper: HTMLElement = this.element
                        ? this.element.querySelector('.builder-container') as HTMLElement
                        : null;
                    if (liveWrapper) {
                        this.handleContainerResize(liveWrapper.getBoundingClientRect().width);
                    }
                }, 100);
            };
            this.windowResizeHandler = resizeHandler;
            window.addEventListener('resize', resizeHandler);
            this.containerWidth = wrapper.getBoundingClientRect().width;
        }
    }

    private applyResponsiveState(
        leftPaneHost: HTMLElement,
        mainSectionHost: HTMLElement,
        rightPaneHost: HTMLElement,
        contentSection: HTMLElement,
        leftPaneToggleHost?: HTMLElement,
        rightPaneToggleHost?: HTMLElement
    ): void {
        const width: number = this.containerWidth || 0;
        this.isMobile = width > 0 && width <= 1024;
        this.isLeftPaneCollapsed = width > 0 && width <= 820;
        this.isRightPaneCollapsed = width > 0 && width <= 1024;

        const wrapper: HTMLElement | null = this.element.querySelector(
            '.builder-container'
        );
        if (wrapper) {
            if (width > 0 && width <= 820) {
                wrapper.classList.add('small-screen');
            } else {
                wrapper.classList.remove('small-screen');
            }
        }

        this.applyPaneClasses(
            leftPaneHost,
            mainSectionHost,
            rightPaneHost,
            contentSection,
            leftPaneToggleHost || this.leftPaneToggleHost,
            rightPaneToggleHost || this.rightPaneToggleHost
        );
    }

    private applyMobileOnlyResponsiveState(
        leftPaneHost: HTMLElement,
        mainSectionHost: HTMLElement,
        rightPaneHost: HTMLElement,
        contentSection: HTMLElement
    ): void {
        const width: number = this.containerWidth || 0;
        this.isMobile = width > 0 && width <= 1024;

        this.applyPaneClasses(
            leftPaneHost,
            mainSectionHost,
            rightPaneHost,
            contentSection,
            this.leftPaneToggleHost,
            this.rightPaneToggleHost
        );
    }

    private applyPaneClasses(
        leftPaneHost: HTMLElement,
        mainSectionHost: HTMLElement,
        rightPaneHost: HTMLElement,
        contentSection: HTMLElement,
        leftPaneToggleHost: HTMLElement | null,
        rightPaneToggleHost: HTMLElement | null
    ): void {
        const setCollapsedExpanded = (el: HTMLElement, collapsed: boolean): void => {
            el.classList.remove('collapsed', 'expanded');
            el.classList.add(collapsed ? 'collapsed' : 'expanded');
        };
        setCollapsedExpanded(leftPaneHost, this.isLeftPaneCollapsed);
        rightPaneHost.classList.toggle('sidebar-closed', this.isRightPaneCollapsed);

        mainSectionHost.classList.toggle('left-collapsed', this.isLeftPaneCollapsed);
        mainSectionHost.classList.toggle('right-collapsed', this.isRightPaneCollapsed);

        contentSection.classList.toggle('left-collapsed', this.isLeftPaneCollapsed);
        contentSection.classList.toggle('right-collapsed', this.isRightPaneCollapsed);

        if (leftPaneToggleHost) {
            leftPaneToggleHost.classList.remove('collapsed', 'expanded');
            leftPaneToggleHost.classList.add(
                this.isLeftPaneCollapsed ? 'collapsed' : 'expanded'
            );
            leftPaneToggleHost.setAttribute(
                'aria-expanded',
                this.isLeftPaneCollapsed ? 'false' : 'true'
            );
            const leftChevron: ChildNode | undefined =
                Array.from(leftPaneToggleHost.childNodes).find(
                    (n) => (n as HTMLElement).classList
                        && ((n as HTMLElement).classList.contains('e-chevron-left')
                            || (n as HTMLElement).classList.contains('e-chevron-right'))
                );
            if (leftChevron) {
                leftChevron.parentNode.removeChild(leftChevron);
            }
            const newLeftChevron: HTMLElement = createElement('span', {
                className: 'e-btn-icon e-icons ' + this.getLeftChevronClass(),
                attrs: { 'aria-hidden': 'true' }
            });
            leftPaneToggleHost.insertBefore(
                newLeftChevron,
                leftPaneToggleHost.firstChild
            );
        }
        if (rightPaneToggleHost) {
            rightPaneToggleHost.classList.remove('collapsed', 'expanded');
            rightPaneToggleHost.classList.add(
                this.isRightPaneCollapsed ? 'collapsed' : 'expanded'
            );
            rightPaneToggleHost.setAttribute(
                'aria-expanded',
                this.isRightPaneCollapsed ? 'false' : 'true'
            );
            const rightChevron: ChildNode | undefined =
                Array.from(rightPaneToggleHost.childNodes).find(
                    (n) => (n as HTMLElement).classList
                        && ((n as HTMLElement).classList.contains('e-chevron-left')
                            || (n as HTMLElement).classList.contains('e-chevron-right'))
                );
            if (rightChevron) {
                rightChevron.parentNode.removeChild(rightChevron);
            }
            const newRightChevron: HTMLElement = createElement('span', {
                className: 'e-btn-icon e-icons ' + this.getRightChevronClass(),
                attrs: { 'aria-hidden': 'true' }
            });
            rightPaneToggleHost.insertBefore(
                newRightChevron,
                rightPaneToggleHost.firstChild
            );
        }

        if (this.leftPaneToggleHost) {
            this.leftPaneToggleHost.classList.remove('collapsed', 'expanded');
            this.leftPaneToggleHost.classList.add(
                this.isLeftPaneCollapsed ? 'collapsed' : 'expanded'
            );
            this.leftPaneToggleHost.setAttribute(
                'aria-expanded',
                this.isLeftPaneCollapsed ? 'false' : 'true'
            );
            this.leftPaneToggleHost.setAttribute(
                'aria-label',
                this.isLeftPaneCollapsed
                    ? 'Expand component palette'
                    : 'Collapse component palette'
            );
            this.leftPaneToggleHost.style.display = this.isMobile ? 'none' : '';
            while (this.leftPaneToggleHost.firstChild) {
                this.leftPaneToggleHost.removeChild(this.leftPaneToggleHost.firstChild);
            }
            const leftChev: HTMLElement = createElement('span', {
                className: 'e-btn-icon e-icons ' + this.getLeftChevronClass(),
                attrs: { 'aria-hidden': 'true' }
            });
            this.leftPaneToggleHost.appendChild(leftChev);
            if (this.isLeftPaneCollapsed && this.isLeftPaneHovered) {
                const leftExpandLabel: HTMLElement = createElement('span', {
                    className: 'expand-label',
                    styles: 'margin-left: 8px;'
                });
                leftExpandLabel.textContent = 'Expand';
                this.leftPaneToggleHost.appendChild(leftExpandLabel);
            }
        }
        if (this.rightPaneToggleHost) {
            this.rightPaneToggleHost.classList.remove('collapsed', 'expanded');
            this.rightPaneToggleHost.classList.add(
                this.isRightPaneCollapsed ? 'collapsed' : 'expanded'
            );
            this.rightPaneToggleHost.setAttribute(
                'aria-expanded',
                this.isRightPaneCollapsed ? 'false' : 'true'
            );
            this.rightPaneToggleHost.setAttribute(
                'aria-label',
                this.isRightPaneCollapsed
                    ? 'Expand properties panel'
                    : 'Collapse properties panel'
            );
            this.rightPaneToggleHost.style.display = this.isMobile ? 'none' : '';
            while (this.rightPaneToggleHost.firstChild) {
                this.rightPaneToggleHost.removeChild(this.rightPaneToggleHost.firstChild);
            }
            const rightChev: HTMLElement = createElement('span', {
                className: 'e-btn-icon e-icons ' + this.getRightChevronClass(),
                attrs: { 'aria-hidden': 'true' }
            });
            this.rightPaneToggleHost.appendChild(rightChev);
            if (this.isRightPaneCollapsed && this.isRightPaneHovered) {
                const rightExpandLabel: HTMLElement = createElement('span', {
                    className: 'expand-label',
                    styles: 'margin-left: 8px;'
                });
                rightExpandLabel.textContent = 'Expand';
                this.rightPaneToggleHost.appendChild(rightExpandLabel);
            }
        }

        if (this.sidebarOverlay) {
            const overlayVisible: boolean = (this.containerWidth > 0 && this.containerWidth <= 820) &&
                (!this.isLeftPaneCollapsed || !this.isRightPaneCollapsed);
            if (overlayVisible) {
                this.sidebarOverlay.classList.add('visible');
            } else {
                this.sidebarOverlay.classList.remove('visible');
            }
        }

        if (this.mobileLeftPaneToggleHost) {
            this.mobileLeftPaneToggleHost.style.display = this.isMobile ? '' : 'none';
        }
        if (this.mobileRightPaneToggleHost) {
            this.mobileRightPaneToggleHost.style.display = this.isMobile ? '' : 'none';
        }
    }

    private getLeftChevronClass(): string {
        if (this.enableRtl) {
            return this.isLeftPaneCollapsed ? 'e-chevron-left' : 'e-chevron-right';
        }
        return this.isLeftPaneCollapsed ? 'e-chevron-right' : 'e-chevron-left';
    }

    private getRightChevronClass(): string {
        if (this.enableRtl) {
            return this.isRightPaneCollapsed ? 'e-chevron-right' : 'e-chevron-left';
        }
        return this.isRightPaneCollapsed ? 'e-chevron-left' : 'e-chevron-right';
    }

    private isMobileNow(): boolean {
        if (!this.element) {
            return this.isMobile;
        }
        const width: number = this.element.getBoundingClientRect().width;
        return width > 0 && width <= 1024;
    }

    private handleLeftPaneToggle(): void {
        const leftPaneHost: HTMLElement | null = this.element.querySelector(
            '.builder-container > .contentSection > .left-pane'
        );
        if (leftPaneHost && leftPaneHost.classList.contains('collapsed')) {
            this.isLeftPaneCollapsed = true;
        } else {
            this.isLeftPaneCollapsed = false;
        }
        this.applyResponsiveStateFirstThen(() => {
            if (this.isMobileNow() && !this.isRightPaneCollapsed) {
                this.isRightPaneCollapsed = true;
            }
            this.isLeftPaneCollapsed = !this.isLeftPaneCollapsed;
        });
    }

    private handleRightPaneToggle(): void {
        const rightPaneHost: HTMLElement | null = this.element.querySelector(
            '.builder-container > .contentSection > .right-sidebar'
        );
        if (rightPaneHost && rightPaneHost.classList.contains('sidebar-closed')) {
            this.isRightPaneCollapsed = true;
        } else {
            this.isRightPaneCollapsed = false;
        }
        this.applyResponsiveStateFirstThen(() => {
            if (this.isMobileNow() && !this.isLeftPaneCollapsed) {
                this.isLeftPaneCollapsed = true;
            }
            this.isRightPaneCollapsed = !this.isRightPaneCollapsed;
        });
    }

    private applyResponsiveStateFirstThen(mutate: () => void): void {
        const leftPaneHost: HTMLElement | null = this.element
            ? this.element.querySelector('.builder-container > .contentSection > .left-pane')
            : null;
        const mainSectionHost: HTMLElement | null = this.element
            ? this.element.querySelector('.builder-container > .contentSection > .main-section')
            : null;
        const rightPaneHost: HTMLElement | null = this.element
            ? this.element.querySelector('.builder-container > .contentSection > .right-sidebar')
            : null;
        const contentSection: HTMLElement | null = this.element
            ? this.element.querySelector('.builder-container > .contentSection > .main-section > .editor-handle')
            : null;
        const leftPaneToggleHost: HTMLElement | null = this.element
            ? this.element.querySelector('.builder-container > .contentSection > .left-pane-toggle')
            : null;
        const rightPaneToggleHost: HTMLElement | null = this.element
            ? this.element.querySelector('.builder-container > .contentSection > .right-pane-toggle')
            : null;
        if (!leftPaneHost || !mainSectionHost || !rightPaneHost || !contentSection ||
            !leftPaneToggleHost || !rightPaneToggleHost) {
            mutate();
            return;
        }
        mutate();
        this.applyPaneClasses(
            leftPaneHost,
            mainSectionHost,
            rightPaneHost,
            contentSection,
            leftPaneToggleHost,
            rightPaneToggleHost
        );
    }

    private handleContainerResize(width: number): void {
        if (Math.abs(width - this.containerWidth) < 1) { return; }
        this.containerWidth = width;
        this.adjustElementVisibility();
        const leftPaneHost: HTMLElement | null = this.element.querySelector(
            '.builder-container > .contentSection > .left-pane'
        );
        const mainSectionHost: HTMLElement | null = this.element.querySelector(
            '.builder-container > .contentSection > .main-section'
        );
        const rightPaneHost: HTMLElement | null = this.element.querySelector(
            '.builder-container > .contentSection > .right-sidebar'
        );
        const contentSection: HTMLElement | null = this.element.querySelector(
            '.builder-container > .contentSection> .main-section > .editor-handle'
        );
        const leftPaneToggleHost: HTMLElement | null = this.element
            ? this.element.querySelector('.builder-container > .contentSection > .left-pane-toggle')
            : null;
        const rightPaneToggleHost: HTMLElement | null = this.element
            ? this.element.querySelector('.builder-container > .contentSection > .right-pane-toggle')
            : null;
        if (!leftPaneHost || !mainSectionHost || !rightPaneHost || !contentSection || !leftPaneToggleHost || !rightPaneToggleHost) {
            return;
        }
        if(this.element.getBoundingClientRect().width <= 820) {
            leftPaneHost.classList.add('mobile-screen');
        }
        else {
            leftPaneHost.classList.remove('mobile-screen');
        }
        this.applyResponsiveState(
            leftPaneHost as HTMLElement,
            mainSectionHost as HTMLElement,
            rightPaneHost as HTMLElement,
            contentSection as HTMLElement,
            leftPaneToggleHost as HTMLElement,
            rightPaneToggleHost as HTMLElement
        );
    }

    private adjustElementVisibility(): void {
        if (!this.element) { return; }
        const hostWidth: number = this.element.getBoundingClientRect().width;
        const isMobileViewport: boolean = hostWidth > 0 && hostWidth <= 1024;
        const isDesktopViewport: boolean = !isMobileViewport;

        const leftPaneToggle: HTMLElement | null = this.element.querySelector(
            '.builder-container > .contentSection > .left-pane-toggle'
        );
        if (leftPaneToggle) {
            leftPaneToggle.style.display = isMobileViewport ? 'none' : '';
        }
        const rightPaneToggle: HTMLElement | null = this.element.querySelector(
            '.builder-container > .contentSection > .right-pane-toggle'
        );
        if (rightPaneToggle) {
            rightPaneToggle.style.display = isMobileViewport ? 'none' : '';
        }

        if (isMobileViewport) {
            this.ensureMobileToggles();
        }
        const mobileToggles: NodeListOf<HTMLElement> = this.element.querySelectorAll('.mobile-toggle');
        for (let i: number = 0; i < mobileToggles.length; i++) {
            mobileToggles[i as number].style.display = isMobileViewport ? '' : 'none';
        }

        if (isDesktopViewport) {
            this.ensureTitleInPlaceEditor();
        }
        const titleHost: HTMLElement | null = this.element.querySelector('.main-header .e-form-builder-title');
        if (titleHost) {
            titleHost.style.display = isDesktopViewport ? '' : 'none';
        }
    }

    private ensureMobileToggles(): void {
        if (!this.element) { return; }
        const leftSection: HTMLElement | null = this.element.querySelector('.main-header .left-section');
        if (leftSection) {
            const existingLeft: HTMLElement | null = leftSection.querySelector(
                '.mobile-toggle[aria-label="Open component palette"]'
            );
            if (!existingLeft) {
                const mobileLeftToggle: HTMLElement = createElement('button', {
                    className: 'e-btn e-flat mobile-toggle',
                    attrs: {
                        'type': 'button',
                        'aria-label': 'Open component palette'
                    }
                });
                const mobileLeftChevron: HTMLElement = createElement('span', {
                    className: 'e-btn-icon e-icons e-show-hide-panel'
                });
                mobileLeftToggle.appendChild(mobileLeftChevron);
                mobileLeftToggle.onclick = (e: MouseEvent) => {
                    e.stopPropagation();
                    this.handleLeftPaneToggle();
                };
                if (leftSection.firstChild) {
                    leftSection.insertBefore(mobileLeftToggle, leftSection.firstChild);
                } else {
                    leftSection.appendChild(mobileLeftToggle);
                }
                this.mobileLeftPaneToggleHost = mobileLeftToggle;
            }
        }
        const rightSection: HTMLElement | null = this.element.querySelector('.main-header .right-section');
        if (rightSection) {
            const existingRight: HTMLElement | null = rightSection.querySelector(
                '.mobile-toggle[aria-label="Open properties panel"]'
            );
            if (!existingRight) {
                const mobileRightToggle: HTMLElement = createElement('button', {
                    className: 'e-flat e-btn mobile-toggle',
                    attrs: {
                        'type': 'button',
                        'aria-label': 'Open properties panel'
                    }
                });
                const mobileRightChevron: HTMLElement = createElement('span', {
                    className: 'e-btn-icon e-icons e-adjustment'
                });
                mobileRightToggle.appendChild(mobileRightChevron);
                mobileRightToggle.onclick = (e: MouseEvent) => {
                    e.stopPropagation();
                    this.handleRightPaneToggle();
                };
                rightSection.appendChild(mobileRightToggle);
                this.mobileRightPaneToggleHost = mobileRightToggle;
            }
        }
    }

    private ensureTitleInPlaceEditor(): void {
        if (!this.element) { return; }
        if (this.titleInPlaceEditor) { return; }
        const titleHost: HTMLElement | null = this.element.querySelector('.main-header .e-form-builder-title');
        if (!titleHost) { return; }
        const formSettings: { name?: string } =
            (this.currentSchema && (this.currentSchema as any).settings) || {};
        const initialTitle: string = formSettings.name || 'Untitled Form';
        let titleBeforeEdit: string = initialTitle;
        const titleInPlace: InPlaceEditor = new InPlaceEditor({
            type: 'Text',
            mode: 'Inline',
            enableRtl: this.enableRtl,
            value: initialTitle,
            beginEdit: () => {
                titleBeforeEdit = ((this.currentSchema.settings as any).name || 'Untitled Form').toString();
            },
            change: (e: any) => {
                const nextValue: string = (e && e.value !== undefined && e.value !== null)
                    ? String(e.value)
                    : initialTitle;
                if (!(this.currentSchema as any).settings) {
                    (this.currentSchema as any).settings = {};
                }
                (this.currentSchema.settings as any).name = nextValue;
                if (this.pendingComponent === null && this.editingField === null && this.pendingWidgetSwitch === null) {
                    if (this.rightPane) {
                        this.rightPane.openFormSettings(this.currentSchema.settings);
                    }
                }
            },
            cancelClick: () => {
                if (!this.currentSchema.settings) {
                    (this.currentSchema as any).settings = {};
                }
                (this.currentSchema.settings as any).name = titleBeforeEdit;
                if (this.pendingComponent === null && this.editingField === null && this.pendingWidgetSwitch === null) {
                    this.rightPane.openFormSettings(this.currentSchema.settings);
                }
            }
        });
        titleInPlace.appendTo(titleHost);
        this.titleInPlaceEditor = titleInPlace;
        this.titleInPlaceEditorHost = titleHost;
    }

    private syncTitleInPlaceEditorFromSchema(): void {
        if (!this.titleInPlaceEditor) {
            return;
        }
        const nextTitle: string = ((this.currentSchema &&
            (this.currentSchema.settings as any) &&
            (this.currentSchema.settings as any).name) || 'Untitled Form').toString();
        try {
            if ((this.titleInPlaceEditor as any).value !== nextTitle) {
                this.titleInPlaceEditor.value = nextTitle;
            }
        } catch (e) {
            /* ignore */
        }
    }

    private applyPaneClassesForCurrent(): void {
        const leftPaneHost: HTMLElement | null = this.element.querySelector(
            '.builder-container > .contentSection > .left-pane'
        );
        const leftPaneToggleHost: HTMLElement | null = this.element.querySelector(
            '.builder-container > .contentSection > .left-pane-toggle'
        );
        const mainSectionHost: HTMLElement | null = this.element.querySelector(
            '.builder-container > .contentSection > .main-section'
        );
        const rightPaneHost: HTMLElement | null = this.element.querySelector(
            '.builder-container > .contentSection > .right-sidebar'
        );
        const rightPaneToggleHost: HTMLElement | null = this.element.querySelector(
            '.builder-container > .contentSection > .right-pane-toggle'
        );
        const contentSection: HTMLElement | null = this.element.querySelector(
            '.builder-container > .contentSection > .main-section > .editor-handle'
        );
        if (!leftPaneHost || !mainSectionHost || !rightPaneHost || !contentSection || !leftPaneToggleHost || !rightPaneToggleHost) {
            return;
        }
        if (this.isMobileNow()) {
            this.applyMobileOnlyResponsiveState(
                leftPaneHost as HTMLElement,
                mainSectionHost as HTMLElement,
                rightPaneHost as HTMLElement,
                contentSection as HTMLElement
            );
        }
        this.applyPaneClasses(
            leftPaneHost as HTMLElement,
            mainSectionHost as HTMLElement,
            rightPaneHost as HTMLElement,
            contentSection as HTMLElement,
            leftPaneToggleHost as HTMLElement,
            rightPaneToggleHost as HTMLElement
        );
    }

    /** @private */
    public onPropertyChanged(newProps: FormBuilderModel, oldProps: FormBuilderModel): void {
        let reRender: boolean = false;
        if (newProps.schema !== oldProps.schema) { reRender = true; }
        if (newProps.locale !== oldProps.locale) { reRender = true; }
        if (newProps.enableRtl !== oldProps.enableRtl) { reRender = true; }
        if (newProps.enablePreview !== oldProps.enablePreview) { reRender = true; }
        if (newProps.mode !== oldProps.mode) { reRender = true; }
        if (newProps.allowExport !== oldProps.allowExport) { reRender = true; }
        if (newProps.enablePersistence !== oldProps.enablePersistence) { reRender = true; }
        if (newProps.toolboxCategories !== oldProps.toolboxCategories) { reRender = true; }
        if (newProps.formTemplates !== oldProps.formTemplates) {
            this.hasExplicitFormTemplates = newProps.formTemplates !== undefined && newProps.formTemplates !== null;
            reRender = true;
        }
        if (!reRender) { return; }
        this.refreshing = true;
        this.destroy();
        this.render();
        this.refreshing = false;
    }

    /**
     * Retrieves the definition of a property for the specified component type.
     *
     * @param {FormWidgetType} componentType - The component type whose property definition is retrieved.
     * @param {string} propertyName - The key of the property to retrieve.
     * @returns {PropertyDefinition | undefined} The property definition if found; otherwise, undefined.
     */
    public getProperty(componentType: FormWidgetType, propertyName: string): PropertyDefinition | undefined {
        const componentConfig: any = (componentProperties as any)[componentType];
        if (!componentConfig || !Array.isArray(componentConfig.groups)) {
            return undefined;
        }
        for (const group of componentConfig.groups) {
            if (!group || !Array.isArray(group.properties)) { continue; }
            for (const property of group.properties) {
                if (property && property.key === propertyName) {
                    this.dirtyKeys.push({ fieldId: componentType, propertyKey: propertyName });
                    return property as PropertyDefinition;
                }
            }
        }
        return undefined;
    }

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
    public setProperty(componentType: FormWidgetType, property: PropertyDefinition): void {
        if (!property || !property.key) { return; }
        const componentConfig: any = (componentProperties as any)[componentType];
        if (!componentConfig || !Array.isArray(componentConfig.groups)) {
            return;
        }
        const clonedProperty: PropertyDefinition = JSON.parse(JSON.stringify(property));
        let updated: boolean = false;
        for (const group of componentConfig.groups) {
            if (!group || !Array.isArray(group.properties)) { continue; }
            for (let i: number = 0; i < group.properties.length; i++) {
                if (group.properties[i] && group.properties[i].key === property.key) {
                    group.properties[i] = clonedProperty;
                    updated = true;
                    break;
                }
            }
            if (updated) { break; }
        }
        if (!updated) {
            let displayGroup: any = componentConfig.groups.find((g: any) => g && g.name === 'Display');
            if (!displayGroup) {
                displayGroup = componentConfig.groups[0];
            }
            if (displayGroup) {
                if (!Array.isArray(displayGroup.properties)) {
                    displayGroup.properties = [];
                }
                displayGroup.properties.push(clonedProperty);
            }
        }
        const currentField: FormNode | null = this.getCurrentEditedField();
        if (this.rightPane && currentField && currentField.id &&
            currentField.type === componentType) {
            this.rightPane.openComponentEditor(currentField, currentField.id, true);
        }
    }

    private getCurrentEditedField(): FormNode | null {
        return this.pendingComponent || this.editingField || null;
    }

    /** @private */
    public destroy(): void {
        this.disposeHeaderControls();
        if (this.windowResizeHandler) {
            window.removeEventListener('resize', this.windowResizeHandler);
            this.windowResizeHandler = null;
        }
        if (this.resizeDebounceTimer !== null) {
            clearTimeout(this.resizeDebounceTimer);
            this.resizeDebounceTimer = null;
        }
        if (this.leftPaneHoverTimeout !== null) {
            clearTimeout(this.leftPaneHoverTimeout);
            this.leftPaneHoverTimeout = null;
        }
        if (this.rightPaneHoverTimeout !== null) {
            clearTimeout(this.rightPaneHoverTimeout);
            this.rightPaneHoverTimeout = null;
        }
        if (this.leftPaneToggleHost && this.leftPaneToggleHost.parentNode) {
            this.leftPaneToggleHost.parentNode.removeChild(this.leftPaneToggleHost);
        }
        this.leftPaneToggleHost = null;
        if (this.rightPaneToggleHost && this.rightPaneToggleHost.parentNode) {
            this.rightPaneToggleHost.parentNode.removeChild(this.rightPaneToggleHost);
        }
        this.rightPaneToggleHost = null;
        if (this.mobileLeftPaneToggleHost && this.mobileLeftPaneToggleHost.parentNode) {
            this.mobileLeftPaneToggleHost.parentNode.removeChild(this.mobileLeftPaneToggleHost);
        }
        this.mobileLeftPaneToggleHost = null;
        if (this.mobileRightPaneToggleHost && this.mobileRightPaneToggleHost.parentNode) {
            this.mobileRightPaneToggleHost.parentNode.removeChild(this.mobileRightPaneToggleHost);
        }
        this.mobileRightPaneToggleHost = null;
        if (this.sidebarOverlay && this.sidebarOverlay.parentNode) {
            this.sidebarOverlay.parentNode.removeChild(this.sidebarOverlay);
        }
        this.sidebarOverlay = null;
        if (this.leftPane) {
            this.leftPane.destroy();
            this.leftPane = null;
        }
        if (this.mainSection) {
            this.mainSection.destroy();
            this.mainSection = null;
        }
        if (this.rightPane) {
            this.rightPane.destroy();
            this.rightPane = null;
        }
        super.destroy();
    }

    /** @private */
    public getPersistData(): string {
        return this.addOnPersist(['currentSchema', JSON.stringify(this.currentSchema)]);
    }

    /** @private */
    public getModuleName(): string {
        return 'form-builder';
    }

    /**
     * Programmatically sets a form field's value for user edits.
     *
     * @param  {string} fieldName - The field's `name` (the schema property's `name`).
     * @param  {any} value - The new value to set.
     * @returns void
     */
    public setFieldValue(fieldName: string, value: any): void {
        this.mainSection.setFieldValue(fieldName, value);
    }

    private handleCopySchema(): void {
        const splitData = splitSchema(this.currentSchema as any);
        const payload = JSON.stringify(splitData, null, 2);
        if ((navigator as LocalNavigator).clipboard && (navigator as LocalNavigator).clipboard.writeText) {
            (navigator as LocalNavigator).clipboard.writeText(payload).catch(() => {
                // Ignore clipboard failures for now.
            });
        } 
    }

    private handleResetSchema(): void {
        this.currentSchema = defaultFormSchema();
        if (this.mainSection) {
            this.mainSection.render(this.currentSchema);
            this.mainSection.refreshJsonViewer(this.currentSchema);
        }
        if (this.rightPane) {
            this.rightPane.updateFormSchema(this.currentSchema);
        }
        this.updateExportButtonState();
        this.rightPane.openFormSettings(this.currentSchema.settings);
    }

    private handleModeSelect(args: { item: ItemModel }): void {
        if (!args || !args.item || !args.item.id) {
            return;
        }
        const selectedMode: 'Simple' | 'Developer' = args.item.id === 'simple' ? 'Simple' : 'Developer';
        (this as any).mode = selectedMode;
    }

    private downloadCombinedSchema(): void {
        try {
            if (isDefaultFormSchema(this.currentSchema)) {
                return;
            }
            const splitData: UnifiedSchema = splitSchema(this.currentSchema as any);
            const timestamp: string = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
            const blob: Blob = new Blob(
                [JSON.stringify(splitData, null, 2)],
                { type: 'application/json' }
            );
            const url: string = URL.createObjectURL(blob);
            const link: HTMLAnchorElement = document.createElement('a');
            link.href = url;
            link.download = 'form-schema-' + timestamp + '.json';
            document.body.appendChild(link);
            link.click();
            link.remove();
            URL.revokeObjectURL(url);
        } catch (err) {
            // ignore
        }
    }

    private disposeHeaderControls(): void {
        if (this.modeDropDownButton) {
            try {
                this.modeDropDownButton.destroy();
            } catch (e) {
            }
            this.modeDropDownButton = null;
        }
        this.modeDropDownHost = null;
        if (this.titleInPlaceEditor) {
            try {
                this.titleInPlaceEditor.destroy();
            } catch (e) {
            }
            this.titleInPlaceEditor = null;
        }
        this.titleInPlaceEditorHost = null;
        this.exportSeparator = null;
    }

    private handleDrop(
        component: FormNode,
        dropTargetIndex?: number | null,
        dropPosition?: 'before' | 'after' | null
    ): void {
        const hasConfig: boolean = !!(componentProperties as any)[component.type];
        const notConfigured: boolean = !(component as any)._configured;

        if (hasConfig && notConfigured) {
            this.setPendingComponent(component);
            this.editingField = component;
            this.pendingDropContext = {
                isNested: false,
                targetIndex: dropTargetIndex !== undefined ? dropTargetIndex : null,
                targetPosition: dropPosition !== undefined ? dropPosition : null
            };
        }

        this.setPendingComponent(component);
        this.editingField = component;

        this.currentSchema = insertAtRoot(
            this.currentSchema,
            component,
            dropTargetIndex,
            dropPosition
        );
        this.handlePropertyDialogSave(component);
        this.activeFieldId = component.id;
        MainSection.activeFieldId = component.id;
        this.reRenderCanvas(component.id);
        this.rightPane.openComponentEditor(component, component.id);
    }

    private handleNestedDrop(
        parentId: string,
        component: FormNode,
        cellInfo?: { row: number; col: number; tabIndex?: number },
        parentPath?: string,
        dropTargetIndex?: number | null,
        dropPosition?: 'before' | 'after' | null
    ): void {
        const hasConfig: boolean = !!(componentProperties as any)[component.type];
        const notConfigured: boolean = !(component as any)._configured;

        if (hasConfig && notConfigured) {
            this.setPendingComponent(component);
            this.editingField = component;
            this.pendingDropContext = {
                isNested: true,
                parentId: parentId,
                cellInfo: cellInfo,
                parentPath: parentPath,
                targetIndex: dropTargetIndex !== undefined ? dropTargetIndex : null,
                targetPosition: dropPosition !== undefined ? dropPosition : null
            };
        }

        this.setPendingComponent(component);
        this.editingField = component;

        this.currentSchema = insertAtNested(
            this.currentSchema,
            parentId,
            parentPath,
            cellInfo,
            component,
            dropTargetIndex,
            dropPosition
        );
        this.handlePropertyDialogSave(component);
        MainSection.activeFieldId = component.id;
        this.reRenderCanvas();
        this.activeFieldId = component.id;
        this.rightPane.openComponentEditor(component, component.id);
    }

    private handleReorder(newComponents: FormNode[]): void {
        this.currentSchema = reorderRoot(this.currentSchema, newComponents);
        this.reRenderCanvas();
    }

    private handleNestedReorder(
        parentId: string,
        parentPath: string,
        newChildren: FormNode[],
        cellInfo?: { row?: number; col?: number; tabIndex?: number }
    ): void {
        this.currentSchema = reorderNested(this.currentSchema, parentId, newChildren, cellInfo);
        this.reRenderCanvas();
    }

    private handleDelete(fieldId: string, isReordering?: boolean): void {
        const compsBefore: FormNode[] = (this.currentSchema.components || []).slice();

        if (
            this.pendingComponent &&
            (this.pendingComponent.id === fieldId ||
                this.isDescendantOf(fieldId, this.pendingComponent.id, compsBefore)) &&
                !isReordering
        ) {
            this.setPendingComponent(null);
        }
        if (
            this.editingField &&
            (this.editingField.id === fieldId ||
                this.isDescendantOf(fieldId, this.editingField.id, compsBefore)) &&
                !isReordering
        ) {
            this.editingField = null;        }
        if (
            this.pendingWidgetSwitch &&
            (this.pendingWidgetSwitch.fieldId === fieldId ||
                this.isDescendantOf(fieldId, this.pendingWidgetSwitch.fieldId, compsBefore))
        ) {
            this.pendingWidgetSwitch = null;
        }
        if (this.activeFieldId === fieldId) {
            this.activeFieldId = null;
            MainSection.activeFieldId = null;
        }

        this.currentSchema = removeById(this.currentSchema, fieldId);
        this.reRenderCanvas();

        if (!isReordering) {
            this.rightPane.openFormSettings(this.currentSchema.settings);
            setTimeout(() => {
                const canvas: HTMLElement | null = this.element.querySelector(
                    '.form-preview-area'
                ) as HTMLElement;
                if (canvas) {
                    canvas.focus();
                }
            }, 0);
        }
    }

    private isDescendantOf(parentId: string, childId: string, components: FormNode[]): boolean {
        const stack: FormNode[] = components.slice();
        while (stack.length) {
            const comp: FormNode = stack.pop() as FormNode;
            if (!comp) { continue; }
            if (comp.id === parentId) {
                const searchInChildren = (items: FormNode[]): boolean => {
                    for (const item of items) {
                        if (item.id === childId) { return true; }
                        if (item.children && searchInChildren(item.children)) { return true; }
                        if (item.tabItems) {
                            for (const tab of item.tabItems) {
                                if (tab.content && searchInChildren(tab.content)) { return true; }
                            }
                        }
                        if (item.tableCells) {
                            for (const row of item.tableCells) {
                                for (const cell of row) {
                                    if (searchInChildren(cell)) { return true; }
                                }
                            }
                        }
                    }
                    return false;
                };
                const children: FormNode[] = (comp.children || []) as FormNode[];
                if (searchInChildren(children)) { return true; }
                if (comp.tabItems && comp.tabItems.some((t: any) => searchInChildren((t && t.content) || []))) { return true; }
                if (comp.tableCells && comp.tableCells.some((row: any) => row.some((cell: any) => searchInChildren(cell)))) { return true; }
                return false;
            }
            if (comp.children && comp.children.length) { stack.push(...comp.children); }
            if (comp.tabItems && comp.tabItems.length) {
                for (const tab of comp.tabItems) {
                    if (tab.content && tab.content.length) { stack.push(...tab.content); }
                }
            }
            if (comp.tableCells && comp.tableCells.length) {
                for (const row of comp.tableCells) {
                    for (const cell of row) {
                        if (cell && cell.length) { stack.push(...cell); }
                    }
                }
            }
        }
        return false;
    }

    private getOrCreateRightPane(): RightPane | null {
        return this.rightPane;
    }

    private setPendingComponent(next: FormNode | null): void {
        this.pendingComponent = next;
        if (!next || !next.id) {
            this.activeFieldWrapper = null;
            return;
        }
        this.activeFieldWrapper = null;
    }

    private handleEdit(fieldId: string): void {
        if(fieldId === this.activeFieldId) {
            return;
        }
        this.activeFieldId = fieldId;
        MainSection.activeFieldId = fieldId;
        const field: FormNode | null = this.findComponentById(this.currentSchema.components, fieldId);
        const rightPane: RightPane | null = this.getOrCreateRightPane();
        if (field && rightPane) {
            this.setPendingComponent(field);
            this.editingField = field;
            rightPane.openComponentEditor(field, fieldId);
        }
    }

    private handleCopy(field: FormNode): void {
        if (!field) {
            return;
        }
        this.copiedFieldRef = field;
        this.hasClipboardData = true;
        this.showPasteButtons();
        ClipboardHelper.copyToClipboard(field).then(function () {
            // already updated
        }).catch(function (error: any) {
            // ignore
        });
    }

    private handlePaste(targetFieldId: string): void {
        const copiedField: FormNode | null = this.copiedFieldRef;
        if (!copiedField) {
            this.hasClipboardData = false;
            this.hidePasteButtons();
            return;
        }

        const remapIds = function (comp: FormNode): FormNode {
            const newId: string = generateId(comp.type);
            const newName: string = generateName(comp.type);
            const remapped: FormNode = Object.assign({}, comp, {
                id: newId,
                name: newName
            });
            if (comp.children) {
                remapped.children = comp.children.map(function (child) {
                    return remapIds(child);
                });
            }
            if (comp.tabItems) {
                remapped.tabItems = comp.tabItems.map(function (tab) {
                    const newContent: FormNode[] = tab.content
                        ? tab.content.map(function (child) {
                            return remapIds(child);
                        })
                        : [];
                    return Object.assign({}, tab, { content: newContent });
                });
            }
            if (comp.tableCells) {
                remapped.tableCells = comp.tableCells.map(function (row) {
                    return row.map(function (cell) {
                        return cell.map(function (child) {
                            return remapIds(child);
                        });
                    });
                });
            }
            return remapped;
        };

        let newField: FormNode = ClipboardHelper.createUniqueField(copiedField);
        newField = Object.assign({}, newField, {
            id: generateId(newField.type),
            name: generateName(newField.type)
        });
        if (newField.type === 'panel' || newField.type === 'tabs' ||
                newField.type === 'table' || newField.type === 'card') {
            newField = remapIds(newField);
        }

        const next: FormSchema = {
            ...this.currentSchema,
            components: (() => {
                const out = insertAfterById(
                    this.currentSchema.components || [],
                    targetFieldId,
                    newField
                );
                if (out.inserted) {
                    return out.components;
                }
                const rootIndex: number = (this.currentSchema.components || [])
                    .findIndex(function (c: FormNode) {
                        return c.id === targetFieldId;
                    });
                if (rootIndex !== -1) {
                    const fallback: FormNode[] = this.currentSchema.components.slice();
                    fallback.splice(rootIndex + 1, 0, newField);
                    return fallback;
                }
                return this.currentSchema.components;
            })()
        };
        this.currentSchema = next;

        const insertedId: string = newField.id;
        setTimeout(function () {
            const wrapper: HTMLElement | null = this.element.querySelector(
                '[data-field-id="' + insertedId + '"]'
            ) as HTMLElement;
            if (wrapper) {
                wrapper.classList.add('field-inserted');
                setTimeout(function () {
                    if (wrapper && wrapper.parentNode) {
                        wrapper.classList.remove('field-inserted');
                    }
                }, 2000);
            }
        }, 50);

        this.copiedFieldRef = null;
        this.hasClipboardData = false;
        ClipboardHelper.clearData().catch(function () { /* ignore */ });
        this.reRenderCanvas();
    }

    private handleSwitchWidget(fieldId: string, newWidgetType: string): void {
        if (!fieldId || !newWidgetType) {
            return;
        }
        const field: FormNode | null = this.findComponentById(
            this.currentSchema.components,
            fieldId
        );
        if (!field) {
            return;
        }
        if (!(componentProperties as any)[newWidgetType as string]) {
            return;
        }
        const componentWithNewType: FormNode = Object.assign({}, field, {
            type: newWidgetType
        });
        this.pendingWidgetSwitch = {
            fieldId: fieldId,
            originalComponent: {...field, type: newWidgetType as any},
            newWidgetType: newWidgetType
        };
        this.currentSchema = switchWidgetType(
            this.currentSchema,
            fieldId,
            newWidgetType
        );
        this.setPendingComponent(componentWithNewType);
        this.editingField = null;
        this.reRenderCanvas();
        this.rightPane.openComponentEditor(this.pendingWidgetSwitch.originalComponent,this.pendingWidgetSwitch.fieldId);
    }

    private handleMoveUp(fieldId: string): void {
        this.currentSchema = moveById(this.currentSchema, fieldId, -1);
        this.reRenderCanvas();
    }

    private handleMoveDown(fieldId: string): void {
        this.currentSchema = moveById(this.currentSchema, fieldId, 1);
        this.reRenderCanvas();
    }

    private handleNestedMoveUp(
        fieldId: string,
        parentId: string,
        _parentPath: string,
        cellInfo?: { row?: number; col?: number; tabIndex?: number }
    ): void {
        this.currentSchema = moveNestedById(
            this.currentSchema,
            fieldId,
            -1,
            parentId,
            cellInfo
        );
        this.reRenderCanvas();
    }

    private handleNestedMoveDown(
        fieldId: string,
        parentId: string,
        _parentPath: string,
        cellInfo?: { row?: number; col?: number; tabIndex?: number }
    ): void {
        this.currentSchema = moveNestedById(
            this.currentSchema,
            fieldId,
            1,
            parentId,
            cellInfo
        );
        this.reRenderCanvas();
    }

    private reRenderCanvas(changedFieldId?: string, refreshCachedFields: boolean = false): void {
        if (this.isDropBatching) {
            this.hasPendingDropBatchRender = true;
            return;
        }
        if (this.mainSection) {
            this.mainSection.render(this.currentSchema, changedFieldId, refreshCachedFields);
            this.mainSection.refreshJsonViewer(this.currentSchema);
        }
        if (this.rightPane) {
            this.rightPane.updateFormSchema(this.currentSchema);
        }
        this.updateExportButtonState();
    }

    private beginDropBatch(): void {
        this.isDropBatching = true;
        this.hasPendingDropBatchRender = false;
    }

    private endDropBatch(): void {
        this.isDropBatching = false;
        if (this.hasPendingDropBatchRender) {
            this.hasPendingDropBatchRender = false;
            this.reRenderCanvas();
        }
    }

    private updateExportButtonState(): void {
        const disabled: boolean = isDefaultFormSchema(this.currentSchema);
        const host = this.element.querySelector('button[aria-label="Export json schema"]') as HTMLElement;
        if (host) {
            if (disabled) {
                host.setAttribute('disabled', 'disabled');
            } else {
                host.removeAttribute('disabled');
            }
        }
    }

    private showPasteButtons(): void {
        const root: HTMLElement | null = this.element;
        if (!root) {
            return;
        }
        const buttons: NodeListOf<Element> = root.querySelectorAll(
            'button[data-action="paste"]'
        );
        for (let i: number = 0; i < buttons.length; i++) {
            (buttons[i as number] as HTMLElement).style.display = 'block';
        }
    }

    private hidePasteButtons(): void {
        const root: HTMLElement | null = this.element;
        if (!root) {
            return;
        }
        const buttons: NodeListOf<Element> = root.querySelectorAll(
            'button[data-action="paste"]'
        );
        for (let i: number = 0; i < buttons.length; i++) {
            (buttons[i as number] as HTMLElement).style.display = 'none';
        }
    }

    private handlePropertyDialogSave(
        values: Record<string, any>,
        _key?: string
    ): void {
        if (!values || typeof values !== 'object') {
            return;
        }

        const isFormSettings: boolean = this.isFormSettingsPayload(values);
        if (isFormSettings && this.pendingComponent === null && this.editingField === null && this.pendingWidgetSwitch === null) {
            const globalSettingsToApply: Record<string, any> = {};
            const settingsKeys: string[] = ['hideLabel', 'size', 'floatLabelType'];

            settingsKeys.forEach((key: string) => {
                if (key in values) {
                    globalSettingsToApply[key as string] = values[key as string];
                }
            });

            let updatedComponents: FormNode[] = (this.currentSchema.components || []) as FormNode[];
            if (Object.keys(globalSettingsToApply).length > 0) {
                updatedComponents = this.mapComponents(updatedComponents, (c: FormNode) => ({
                    ...c,
                    ...globalSettingsToApply
                }));
            }
            
            this.currentSchema = {
                ...this.currentSchema,
                components: updatedComponents,
                settings: { ...(this.currentSchema.settings || {}), ...values }
            };
            this.syncTitleInPlaceEditorFromSchema();
            const refreshCachedFields: boolean = 'hideLabel' in values || 'size' in values;
            this.reRenderCanvas(undefined, refreshCachedFields);
            return;
        }

        if (!this.pendingComponent) {
            return;
        }

        const mapped: FormNode = mapPropertiesToWidget(
            this.pendingComponent,
            values,
            this.currentSchema,
            componentProperties as WidgetConfig
        );

        if (this.editingField) {
            const updatedField: FormNode = filterWidgetProperties(
                mapped,
                componentProperties as WidgetConfig,
                this.dirtyKeys
            );
            this.currentSchema = {
                ...this.currentSchema,
                components: updateWidgetById(
                    this.currentSchema.components as FormNode[],
                    this.editingField.id,
                    updatedField
                )
            };
            this.reRenderCanvas(this.editingField.id);
            return;
        }

        if (this.pendingWidgetSwitch) {
            const widgetSwitch: PendingWidgetSwitch = this.pendingWidgetSwitch;
            const updatedField: FormNode = filterWidgetProperties(
                mapped,
                componentProperties as WidgetConfig,
                this.dirtyKeys
            );
            setTimeout(() => {
                this.currentSchema = {
                    ...this.currentSchema,
                    components: updateWidgetById(
                        this.currentSchema.components as FormNode[],
                        widgetSwitch.fieldId,
                        updatedField
                    )
                };
                this.reRenderCanvas(widgetSwitch.fieldId);
            }, 100);
            return;
        }

        const componentWithProperties: FormNode = filterWidgetProperties(
            mapped,
            componentProperties as WidgetConfig,
            this.dirtyKeys
        );
        const dropContext: PendingDropContext | null = this.pendingDropContext;
        if (dropContext && dropContext.isNested && dropContext.parentId) {
            this.handleNestedDrop(
                dropContext.parentId,
                componentWithProperties,
                dropContext.cellInfo,
                dropContext.parentPath,
                dropContext.targetIndex !== undefined ? dropContext.targetIndex : null,
                dropContext.targetPosition !== undefined ? dropContext.targetPosition : null
            );
        } else {
            this.handleDrop(
                componentWithProperties,
                dropContext ? dropContext.targetIndex : undefined,
                dropContext ? dropContext.targetPosition : undefined
            );
        }
    }

    private isFormSettingsPayload(values: any): boolean {
        const formKeys: string[] = ['name', 'width', 'hideLabel', 'size', 'floatLabelType'];
        return formKeys.some((k: string) => k in values);
    }

    private mapComponents(
        components: FormNode[],
        mapper: (c: FormNode) => FormNode
    ): FormNode[] {
        return components.map((c: FormNode) => {
            const mapped: FormNode = mapper(c);
            if (mapped.children) {
                mapped.children = this.mapComponents(mapped.children, mapper);
            }
            if (mapped.tableCells) {
                mapped.tableCells = mapped.tableCells.map((row: FormNode[][]) =>
                    row.map((cell: FormNode[]) => this.mapComponents(cell, mapper))
                );
            }
            if (mapped.tabItems) {
                mapped.tabItems = mapped.tabItems.map((tab: any) => ({
                    ...tab,
                    content: tab.content ? this.mapComponents(tab.content, mapper) : tab.content
                }));
            }
            return mapped;
        });
    }

    private findComponentById(components: FormNode[], id: string): FormNode | null {
        for (const c of components) {
            if (c.id === id) { return c; }
            if (c.children) {
                const found: FormNode | null = this.findComponentById(c.children, id);
                if (found) { return found; }
            }
            if (c.tableCells) {
                for (const row of c.tableCells) {
                    for (const cell of row) {
                        const found: FormNode | null = this.findComponentById(cell, id);
                        if (found) { return found; }
                    }
                }
            }
            if (c.tabItems) {
                for (const tab of c.tabItems) {
                    if (tab.content) {
                        const found: FormNode | null = this.findComponentById(tab.content, id);
                        if (found) { return found; }
                    }
                }
            }
        }
        return null;
    }

    private handleRightPaneClose(): void {
        this.activeFieldId = null;
        MainSection.activeFieldId = null;
        this.setPendingComponent(null);
        this.editingField = null;
        this.pendingWidgetSwitch = null;
        this.pendingDropContext = null;
        this.reRenderCanvas();
        this.rightPane.openFormSettings(this.currentSchema.settings);
    }
}

export default FormBuilder;
