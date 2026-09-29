import { Component, Collection, Property, Event, EmitType, NotifyPropertyChanges, enableRipple, createElement, ChildProperty, isNullOrUndefined, L10n, getComponent, addClass, compile, SanitizeHtmlHelper } from '@syncfusion/ej2-base';
import { Tab, Toolbar } from '@syncfusion/ej2-navigations';
import { Tooltip } from '@syncfusion/ej2-popups';
import { FormValidator, Signature } from '@syncfusion/ej2-inputs';
import { FormLayout, FormNode, Schema } from './types/form-schema';
import { renderFormField } from './render-form-field';
import { resolveCustomWidget, ResolvedCustomWidget } from './custom-widget-resolver';
import { mergeSchema, UnifiedSchema } from '../common/json-converter';
import { UniversalJsonParser } from '../common/parser';
import { VALIDATION_REGEX, formatDateValues, splitWidths } from '../common/utils';
import StaticHtmlRenderer from '../common/static-html-renderer';
import { ConditionalRuleEngine, FormValueType } from '../common/index';
import { ExpressionEngine, DependencyGraph } from '../common/expressions/expression-engine';
import { MinMaxRuleEngine } from '../common/minmax-rule-engine';
import { CustomValidationEngine } from '../common/custom-validation-engine';
import { FormRendererModel, CustomWidgetSettingModel } from './form-renderer-model';
import { RichTextEditor } from '@syncfusion/ej2-richtexteditor';
import { ImageEditor } from '@syncfusion/ej2-image-editor';

/**
 * Specifies the types for the form field data values.
 */
export type FieldDataType =
    | string
    | number
    | boolean
    | string[]
    | number[]
    | Date
    | Record<string, unknown>
    | object
    | unknown[]
    | null;

/**
 * This event argument provides details for field value changes during form interaction.
 */
export interface ChangeEventArgs {
    /** Provides the unique name/identifier of the changed field */
    fieldName: string;
    /** Specifies the display text/label of the form field. */
    label: string;
    /** Specifies the new value of the field */
    value: FieldDataType;
}

/**
 * This event argument provides details for form submission.
 */
export interface SubmitEventArgs {
    /** Provides the complete form data object keyed by field names */
    data: Record<string, FieldDataType>;
    /** Specifies whether the form passed all validation rules */
    isValid: boolean;
}

/**
 * This event argument provides details for custom button clicks within the rendered form.
 */
export interface ButtonClickEventArgs {
    /** Specifies the unique identifier of the clicked button */
    fieldName: string;
    /** Specifies the display text/label of the clicked button */
    label: string;
    /** Provides the original button click event. */
    event: any;
}

/**
 * Event arguments describing a failure/warning that occurred in the form renderer.
 */
export interface FailureEventArgs {
    /** The underlying error error/warning or exception. */
    error: any;
}

/**
 * @private
 */
interface MinMaxConstraints {
    minValue?: number | string;
    maxValue?: number | string;
    minDate?: string;
    maxDate?: string;
    minTime?: string;
    maxTime?: string;
}

/**
 * @private
 */
const inputTargetTypes: string[] = [
    'textbox',
    'number',
    'checkbox',
    'dropdown',
    'multiselect',
    'date',
    'dateTime',
    'time',
    'dateRange',
    'switch',
    'rating',
    'colorPicker',
    'inputMask',
    'fileUpload'
];

/**
 * @private
 */
export const defaultLocale = {
    "unsupportedComponent": "Unsupported Component type"
}

/**
 * Specifies the custom widget settings for rendering custom templates for existing FormComponentTypes.
 */
export class CustomWidgetSetting extends ChildProperty<CustomWidgetSetting> {
    /**
     * Specifies the template content to be used.
     *
     * @default null
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     */
    @Property(null)
    public template: string | HTMLElement | Function;
    /**
     * Specifies the type of the widget to which the template must be bound. The values will be FormComponentType.
     *
     * @default ''
     */
    @Property('')
    public type: string;
    /**
     * Specifies an optional template identifier. When set, the template is rendered to the JSON object whose templateId matches this value, irrespective of the type.
     *
     * @default ''
     */
    @Property('')
    public templateId: string;
    /**
     * Specifies the name of the field to which the template must be bound. When set, the template is rendered to the control with the matching name, irrespective of the type property value.
     *
     * @default ''
     */
    @Property('')
    public fieldName: string;
}

/**
 * The FormRenderer component consumes a JSON form schema and renders a fully functional, Syncfusion-based form. It handles field mapping, conditional visibility/disabling, expression evaluation, custom validation, and data submission. 
 *
 * ```typescript
 * let form: FormRenderer = new FormRenderer({
 *   schema: formSchema,
 *   submit: (args: SubmitEventArgs) => console.log(args)
 * });
 * form.appendTo('#container');
 * ```
 */
@NotifyPropertyChanges
export class FormRenderer extends Component<HTMLElement> {
    /**
     * Specifies the data schema of the form that needs to be rendered in the Form Renderer.
     */
    @Property(null)
    public schema: Schema | string | Record<string, unknown> | null;

    /**
     * Specifies initial values for form fields by field name.
     *
     * @default null
     */
    @Property(null)
    public dataModel: Record<string, FieldDataType> | null;

    /**
     * Specifies the form layout configuration (only applies when layout details are NOT available in the schema). Determines how form fields are arranged in columns.
     * 
     * @default 'SingleColumn'
     */
    @Property('SingleColumn')
    public layout: FormLayout | string;

    /**
     * Specifies the CSS class name to apply to the root form container element. This property supports space-separated multiple classes.
     * 
     * @default "" 
     */
    @Property('')
    public className: string;

    /**
     * Specifies the custom widget settings to bind and render custom templates for form fields.
     *
     * @default null
     */
    @Collection<CustomWidgetSettingModel>([], CustomWidgetSetting)
    public customWidgetSettings: CustomWidgetSettingModel[];

    /**
     * Specifies whether to enable the sanitization of untrusted HTML in custom widget string/script templates (`customWidgetSettings[].template`).
     *
     * @default false
     */
    @Property(false)
    public enableHtmlSanitizer: boolean;

    /**
     * Event triggered when the form is submitted.
     * This event provides form data and validation status in the event argument.
     *
     * @event
     */
    @Event()
    public submit: EmitType<SubmitEventArgs>;

    /**
     * Event triggered when any form field value changes. Fired on user input for tracked fields.
     *
     * @event
     */
    @Event()
    public change: EmitType<ChangeEventArgs>;

    /**
     * Event triggered when a button in the form is clicked. Applies to all button types (button, submit, splitButton).
     *
     * @event
     */
    @Event()
    public buttonClick: EmitType<ButtonClickEventArgs>;

    /**
     * Event triggered when an error is thrown in the form rendering or schema parsing.
     *
     * @event
     */
    @Event()
    public failure: EmitType<FailureEventArgs>;

    /**
     * Event triggered when all form elements are rendered and ready for interaction. Useful for performing post-render initialization or setup.
     *
     * @event
     */
    @Event()
    public created: EmitType<Object>;


    /**
     * @private
     */
    constructor(options?: FormRendererModel, element?: string | HTMLDivElement) {
        super(options, <string | HTMLDivElement>element);
    }

    private processedSchemaCache: { version: string; components: FormNode[]; settings?: any } =
        { version: '1.0.0', components: [] };

    private l10n = new L10n('form-renderer', defaultLocale, this.locale);

    /**
     * @private
     */
    private formState: { values: Record<string, any>; errors: Record<string, string> } =
    { values: Object.create(null) as Record<string, any>, errors: Object.create(null) as Record<string, string> };

    private validator: FormValidator | null = null;

    private inputRefs: Record<string, any> = {};

    private conditionalValueApplied: Record<string, boolean> = {};

    private expressionEngine: ExpressionEngine | null = null;
    private expressionDependencyGraph: DependencyGraph = {};
    private expressionEvaluationInProgress: boolean = false;
    private previousFormValues: { [x: string]: FormValueType } = {};
    private computedFieldNames: Set<string> = new Set<string>();

    private customValidationEngine: CustomValidationEngine | null = new CustomValidationEngine();

    private currentFormValues: Record<string, any> = {};

    private isInitialized: boolean = false;

    private hasLayoutComponentsCache: boolean = false;

    private idToLabelCache: Record<string, string> = {};

    private initialValuesCache: Record<string, any> = {};

    private renderedInstances: any[] = [];

    private tooltipRefs: Record<string, Tooltip | null> = {};

    private createdFired: boolean = false;

    private rerenderScheduled: boolean = false;

    private conditionalTriggerFieldIds: Set<string> = new Set<string>();

    private preservedFields: Map<string, HTMLElement> = new Map<string, HTMLElement>();

    private static readonly PRESERVABLE_TYPES: Set<string> = new Set<string>([
        'textbox', 'textarea', 'number', 'checkbox', 'checkboxGroup', 'radio', 'dropdown', 'multiselect', 'button', 'date', 'dateTime', 'time', 'dateRange', 'switch', 'signature', 'rating', 'imageEditor', 'fileUpload', 'rangeSlider', 'colorPicker', 'inputMask', 'message', 'panel', 'table', 'tabs', 'dataGrid', 'staticHtml', 'card', 'splitButton', 'richTextEditor' 
    ]);

    private consumerDependencyMap: Map<string, Set<string>> = new Map<string, Set<string>>();

    /**
     * @private
     */
    public getModuleName(): string {
        return 'form-renderer';
    }

    /**
     * @private
     */
    public getPersistData(): string {
        return this.addOnPersist(['formState', JSON.stringify(this.formState)]);
    }

    /**
     * @private
     */
    protected preRender(): void {
        enableRipple(true);
        this.createdFired = false;
        this.expressionEngine = new ExpressionEngine();
    }

    /**
     * @private
     */
    protected render(): void {
        this.clearEngineCaches();
        this.removePreviousRoot();
        this.normalizeSchema();
        this.element.classList.add('form-renderer-container');
        if (this.className) {
            addClass([this.element], this.className.replace(/\s+/g, ' ').trim().split(' '));
        }
        if(this.enableRtl) {
          this.element.classList.add('e-rtl');
        }
        else {
            this.element.classList.remove('e-rtl');
        }
        this.hasLayoutComponentsCache = this.computeHasLayoutComponents();
        this.idToLabelCache = this.computeIdToLabel();
        this.initialValuesCache = this.buildInitialValues();
        this.buildValidationRulesAndBridge();

        if (!this.isInitialized) {
            this.isInitialized = true;
        }
        if (this.isReact && (this as any).portals) {
            (this as any).renderReactTemplates();
        }
        if (this.formState && this.initialValuesCache) {
            const initKeys: string[] = Object.keys(this.initialValuesCache);
            for (const id of initKeys) {
                const value: any = (this.initialValuesCache as Record<string, any>)[id as string];
                if (!(this.formState).values[id as string]) {
                    (this.formState).values[id as string] = value;
                }
            }
        }
        this.currentFormValues = { ...(this.formState ? this.formState.values : {}) };

        this.initExpressionEngine();
        this.buildConditionalDependencyMap();

        const root: HTMLDivElement = createElement('form', {
            className: `form-renderer ${this.layoutClass}`,
            attrs: { role: 'region', 'aria-label': this.processedSchemaCache.settings ? (this.processedSchemaCache.settings.name || 'Form') : 'Form' }
        }) as HTMLDivElement;

        this.element.appendChild(root);

        this.inputRefs = {};

        (this.processedSchemaCache.components || []).forEach((component: FormNode) => {
            const rendered: HTMLElement | null = this.renderComponent(component);
            if (rendered) {
                root.appendChild(rendered);
            }
            if (component.type === 'richTextEditor') {
                const rteElement: any = rendered.querySelector('.e-richtexteditor') as HTMLElement;
                const rteInstance = getComponent(rteElement, 'richtexteditor');
                if (rteInstance) {
                   (rteInstance as RichTextEditor).refreshUI();
                }
            }
            if (component.type === 'dataGrid') {
                const toolbarElement: any = rendered.querySelector('.e-control.e-toolbar') as HTMLElement;
                const rteInstance = getComponent(toolbarElement, 'toolbar');
                if (rteInstance) {
                    (rteInstance as Toolbar).refresh();
                }
            }
            if (component.type === 'tabs') {
                const tabElement: any = rendered.querySelector('.e-control.e-tab') as HTMLElement;
                const tabInstance = getComponent(tabElement, 'tab');
                if (tabInstance) {
                    (tabInstance as Tab).refreshOverflow();
                }
            }
        });
        if (this.created && !this.createdFired) {
            setTimeout(() => {
                if (Object.keys(this.inputRefs).length > 0) {
                    this.createdFired = true;
                    this.trigger('created', {});
                }
            }, 0);
        }
    }

    /**
     * @private
     */
    private normalizeSchema(): void {
        const schema: any = this.schema;
        try {
            if (!schema) {
                this.processedSchemaCache = { version: '1.0.0', components: [] };
                return;
            }
            let parsedInput: any = schema;
            if (typeof schema === 'string') {
                try {
                    parsedInput = JSON.parse(schema as string);
                } catch (err) {
                    if (this.failure) {
                        this.trigger('failure', {
                            error: err
                        } as FailureEventArgs);
                    }
                    this.processedSchemaCache = { version: '1.0.0', components: [] };
                    return;
                }
            }
            const isUnifiedSchema: boolean = parsedInput && typeof parsedInput === 'object' &&
                parsedInput.properties && Array.isArray(parsedInput.layout);
            if (isUnifiedSchema) {
                this.processedSchemaCache = mergeSchema(
                    parsedInput as UnifiedSchema,
                    this.dataModel || undefined
                );
            } else {
                const parser: UniversalJsonParser = new UniversalJsonParser();
                const parseResult: any = parser.parse(
                    typeof schema === 'string' ? schema as string : JSON.stringify(schema)
                );
                if (parseResult.success && parseResult.schema) {
                    this.processedSchemaCache = parseResult.schema;
                } else {
                    if (this.failure) {
                        this.trigger('failure', {
                            error: parseResult.errors
                        } as FailureEventArgs);
                    }
                    this.processedSchemaCache = { version: '1.0.0', components: [] };
                }
            }
        } catch (error) {
            if (this.failure) {
                this.trigger('failure', {
                    error: error
                } as FailureEventArgs);
            }
            this.processedSchemaCache = { version: '1.0.0', components: [] };
        }
    }

    /**
     * @private
     */
    private computeHasLayoutComponents(): boolean {
        if (!this.processedSchemaCache.components) { return false; }
        const checkForLayoutTypes = (components: FormNode[]): boolean => {
            for (const comp of components) {
                if (['table', 'tabs', 'panel', 'card'].indexOf(comp.type) !== -1) {
                    return true;
                }
                if (comp.children && checkForLayoutTypes(comp.children)) { return true; }
                if (comp.tableCells) {
                    for (const row of comp.tableCells) {
                        for (const cell of row) {
                            if (checkForLayoutTypes(cell)) { return true; }
                        }
                    }
                }
                if (comp.tabItems) {
                    for (const tab of comp.tabItems) {
                        if (tab.content && checkForLayoutTypes(tab.content)) { return true; }
                    }
                }
            }
            return false;
        };
        return checkForLayoutTypes(this.processedSchemaCache.components as FormNode[]);
    }

    /**
     * @private
     */
    private get layoutClass(): string {
        if (this.hasLayoutComponentsCache) { return ''; }
        switch (this.layout) {
            case 'TwoColumn':
                return 'twolayout';
            case 'ThreeColumn':
                return 'threelayout';
            case 'FourColumn':
                return 'fourlayout';
            case 'SingleColumn':
            default:
                return '';
        }
    }

    /**
     * @private
     */
    private collectAllComponents(components: FormNode[]): FormNode[] {
        const all: FormNode[] = [];
        const traverse = (comps: FormNode[]): void => {
            comps.forEach((comp: FormNode) => {
                all.push(comp);
                if (comp.children && comp.children.length > 0) { traverse(comp.children); }
                if (comp.tableCells) {
                    comp.tableCells.forEach((row: FormNode[][]) => {
                        row.forEach((cell: FormNode[]) => traverse(cell));
                    });
                }
                if (comp.tabItems) {
                    comp.tabItems.forEach((tab) => {
                        if (tab.content) { traverse(tab.content as FormNode[]); }
                    });
                }
            });
        };
        traverse(components);
        return all;
    }

    /**
     * @private
     */
    private computeIdToLabel(): Record<string, string> {
        const map: Record<string, string> = {};
        const traverse = (comps: FormNode[]): void => {
            comps.forEach((comp: FormNode) => {
                if (comp.label && ['panel', 'table', 'tabs', 'card', 'button', 'message', 'splitButton'].indexOf(comp.type) === -1) {
                    if (comp.name) {
                        map[comp.id] = comp.name;
                    } else if (comp.label) {
                        map[comp.id] = comp.label;
                    }
                }
                if (comp.children) { traverse(comp.children); }
                if (comp.tableCells) {
                    comp.tableCells.forEach((row) => row.forEach((cell) => traverse(cell)));
                }
                if (comp.tabItems) {
                    comp.tabItems.forEach((tab) => { if (tab.content) { traverse(tab.content as FormNode[]); } });
                }
            });
        };
        traverse(this.processedSchemaCache.components as FormNode[]);
        return map;
    }

    /**
     * @private
     */
    private buildValidationRulesAndBridge(): void {
        const rules: { [name: string]: { [rule: string]: any } } = {};
        const formValues: Record<string, any> = (this.formState && this.formState.values) || {};

        const collectRules = (components: FormNode[], parentVisible: boolean = true): void => {
            components.forEach((component: FormNode) => {
                if (!component) {
                    return;
                }

                const componentRules: any = {};
                const isVisible: boolean = parentVisible && (component.visible === false
                    ? false
                    : ConditionalRuleEngine.isFieldVisible(component.conditions, formValues));
                const isHidden: boolean = parentVisible && ConditionalRuleEngine.isFieldHidden(component.conditions, formValues);
                if (!isVisible || isHidden) {
                    return;
                }

                const conditionalRequired: boolean = ConditionalRuleEngine.isFieldRequired(component.conditions, formValues);
                const conditionalDisabled: boolean = ConditionalRuleEngine.isFieldDisabled(component.conditions, formValues);
                const conditionalReadOnly: boolean = ConditionalRuleEngine.isFieldReadOnly(component.conditions, formValues);
                const finalRequired: boolean = !!component.required || conditionalRequired;
                const finalDisabled: boolean = !!component.disabled || conditionalDisabled;
                const finalReadOnly: boolean = !!component.readOnly || conditionalReadOnly;

                if (component.customValidation &&
                    Array.isArray(component.customValidation) &&
                    component.customValidation.length > 0 &&
                    !finalDisabled && !finalReadOnly) {
                    const customValidationExpression: string | undefined = component.customValidation && component.customValidation[0] && component.customValidation[0].expression;
                    const validationMessage: string | undefined =
                        customValidationExpression && customValidationExpression.match(/\?\s*true\s*:\s*['"](.+?)['"]/) ? customValidationExpression.match(/\?\s*true\s*:\s*['"](.+?)['"]/)[1] : undefined;
                    const customMessage: string =
                        validationMessage ||
                        component.validationMessage ||
                        `${component.label || component.id} is invalid`;

                    const self: FormRenderer = this;
                    componentRules.customValidation = [
                        (args: { element: HTMLElement; value: any }): boolean => {
                            const fieldValue: any = args.value;
                            if (finalRequired && (fieldValue === '' || fieldValue === null || fieldValue === undefined)) {
                                return true;
                            }
                            const idToNameMap: Record<string, string> = {};
                            const allComponents: FormNode[] = self.collectAllComponents(self.processedSchemaCache.components as FormNode[]);
                            allComponents.forEach((comp: FormNode) => {
                                if (comp.name) { idToNameMap[comp.id] = comp.name; }
                            });
                            const currentFormValues: Record<string, any> = { ...(self.currentFormValues || {}) };
                            const cfvKeys: string[] = Object.keys({ ...currentFormValues });
                            for (const componentId of cfvKeys) {
                                const value: any = (currentFormValues as Record<string, any>)[componentId as string];
                                const fieldName: string = idToNameMap[componentId as string];

                                if (fieldName) {
                                    currentFormValues[fieldName as string] = value;
                                    delete currentFormValues[componentId as string];
                                }
                            }
                            for (const rule of component.customValidation!) {
                                if (!self.customValidationEngine) { return true; }
                                const result: any = self.customValidationEngine.validate(
                                    rule.expression,
                                    fieldValue,
                                    currentFormValues as any
                                );
                                if (result !== true) { return false; }
                            }
                            return true;
                        },
                        customMessage
                    ];
                }

                if (finalRequired && !finalDisabled && !finalReadOnly) {
                    componentRules.required = [true, component.validationMessage || `${component.label} is required`];
                }
                if (component.minLength && !finalDisabled && !finalReadOnly) {
                    componentRules.minLength = [component.minLength, `Minimum ${component.minLength} characters allowed`];
                }
                if (component.maxLength && !finalDisabled && !finalReadOnly) {
                    componentRules.maxLength = [component.maxLength, `Maximum ${component.maxLength} characters allowed`];
                }
                if (component.type === 'textbox' && component.textboxType && !component.regex &&
                    !componentRules.regex && !finalDisabled && !finalReadOnly) {
                    if (component.textboxType === 'email') {
                        componentRules.regex = [VALIDATION_REGEX['EMAIL'], component.validationMessage || 'Invalid format'];
                    } else if (component.textboxType === 'url') {
                        componentRules.regex = [VALIDATION_REGEX['URL'], component.validationMessage || 'Invalid format'];
                    }
                }
                if (component.regex && !finalDisabled && !finalReadOnly) {
                    componentRules.regex = [component.regex, component.validationMessage || 'Invalid format'];
                }
                if (Object.keys(componentRules).length > 0) {
                    rules[component.id] = componentRules;
                }

                if (component.children) {
                    collectRules(component.children, isVisible && !isHidden);
                }
                if (component.tableCells) {
                    component.tableCells.forEach((row) => row.forEach((cell) => collectRules(cell, isVisible && !isHidden)));
                }
                if (component.tabItems) {
                    component.tabItems.forEach((tab) => {
                        if (tab.content) {
                            collectRules(tab.content as FormNode[], isVisible && !isHidden);
                        }
                    });
                }
            });
        };
        collectRules(this.processedSchemaCache.components as FormNode[]);

        const previousValues: Record<string, any> = this.formState ? { ...this.formState.values } : { ...this.initialValuesCache };
        this.formState = {
            values: Object.assign(Object.create(null), this.initialValuesCache, previousValues),
            errors: this.enablePersistence ? this.formState.errors : Object.create(null) as Record<string, string>
        };
        if (previousValues) {
            Object.keys(previousValues).forEach((id: string) => {
                if (!(id in this.formState.values)) {
                    this.formState.values[id as string] = previousValues[id as string];
                }
            });
        }

        if (this.validator) {
            try {
                this.validator.refresh();
                this.validator.destroy();
             } catch (e) { /* swallow */ }
            this.validator = null;
        }
        const self: FormRenderer = this;
        this.validator = new FormValidator(this.element as any, {
            rules: rules as any,
            locale: this.locale,
            ignore: 'e-hidden',
            errorClass: 'e-error',
            validClass: 'e-valid',
            errorElement: 'div',
            errorContainer: 'div',
            customPlacement: (inputElement: HTMLElement, errorElement: HTMLElement): void => {
                const name: string | null = (inputElement as HTMLInputElement).getAttribute('name');
                if (!name) {
                    if (inputElement.parentElement) {
                        inputElement.parentElement.appendChild(errorElement);
                    }
                    return;
                }
                const slot: HTMLElement | null = document.getElementById(`error-${name}`);
                if (slot) {
                    while (slot.firstChild) {
                        slot.removeChild(slot.firstChild);
                    }
                    slot.appendChild(errorElement);
                    slot.style.display = 'block';
                } else if (inputElement.parentElement) {
                    inputElement.parentElement.appendChild(errorElement);
                }
            },
            validationComplete: (args: any): void => {
                self.syncFormStateErrors();
                if (args && args.inputName) {
                    const slot: HTMLElement | null = document.getElementById(`error-${args.inputName}`);
                    if (slot) {
                        if (args.status === 'success') {
                            while (slot.firstChild) {
                                slot.removeChild(slot.firstChild);
                            }
                            slot.style.display = 'none';
                        } else if (args.status === 'failure') {
                            slot.style.display = 'block';
                        }
                    }
                }
            },
            submit: (event: Event) => {
                if (!self.validator) { return; }
                const isValid: boolean = self.validator.validate();
                if (!isValid) {
                    if (event && typeof event.preventDefault === 'function') {
                        event.preventDefault();
                    }
                    return;
                }
                self.handleSubmitData({ ...self.formState.values });
                if (event && typeof event.preventDefault === 'function') {
                    event.preventDefault();
                }
            },
            reset: () => {
            }
        } as any);

        if (previousValues) {
            Object.keys(previousValues).forEach((id: string) => {
                const inputEl: HTMLInputElement | null = (this.validator as FormValidator).getInputElement(id) as HTMLInputElement;
                if (inputEl && previousValues[id as string] !== undefined && previousValues[id as string] !== null) {
                    try { inputEl.value = String(previousValues[id as string]); } catch (e) { /* swallow */ }
                }
            });
        }
    }

    /**
     * @private
     */
    private syncFormStateErrors(): void {
        const errors: Record<string, string> = {};
        if (this.validator) {
            const errorRules: any[] = (this.validator as any).errorRules || [];
            for (const rule of errorRules) {
                if (rule && rule.name) {
                    errors[rule.name] = rule.message;
                }
            }
        }
        this.formState.errors = errors;
    }

    /**
     * @private
     */
    private buildInitialValues(): Record<string, any> {
        const values: Record<string, any> = {};
        const allComponents: FormNode[] = this.collectAllComponents(this.processedSchemaCache.components as FormNode[]);
        const componentIds: Set<string> = new Set<string>();
        allComponents.forEach((comp: FormNode) => {
            if (comp.type === 'staticHtml') {
                componentIds.add(comp.id);
                return;
            }
            if (comp.type === 'dataGrid') {
                values[comp.id] = Array.isArray((comp as FormNode).dataSource)
                    ? (comp as FormNode).dataSource
                    : [];
            }
            if (comp.defaultValue !== undefined) {
                values[comp.id] = comp.defaultValue;
            } else {
                switch (comp.type) {
                    case 'checkbox':
                    case 'switch':
                        values[comp.id] = false;
                        break;
                    default:
                        break;
                }
            }
            componentIds.add(comp.id);
        });
        if (this.formState) {
            Object.keys(this.formState.values)
                .filter((key: string) => !componentIds.has(key))
                .forEach((key: string) => {
                    delete (this.formState).values[key as string];
                });
        }
        return values;
    }

    /**
     * @private
     */
    private initExpressionEngine(): void {
        if (!this.processedSchemaCache.components || this.processedSchemaCache.components.length === 0) {
            return;
        }
        try {
            const engine: ExpressionEngine = this.expressionEngine as ExpressionEngine;
            const allComponents: FormNode[] = this.collectAllComponents(this.processedSchemaCache.components as FormNode[]);
            const graph: DependencyGraph = engine.buildDependencyGraph(allComponents as any);
            const cycles: string[][] = engine.detectCircularDependencies(graph);
            if (cycles.length > 0) {
            }
            this.expressionDependencyGraph = graph;
            const computedFields: Set<string> = new Set<string>();
            allComponents.forEach((comp: FormNode) => {
                if (comp.expressionValue) { computedFields.add(comp.id); }
            });
            this.computedFieldNames = computedFields;
        } catch (error) {
            if (this.failure) {
                this.trigger('failure', {
                    error: error
                } as FailureEventArgs);
            }
        }
    }

    /**
     * @private
     */
    private disposeTooltipInstance(fieldId: string): void {
        const existingTooltip: Tooltip | null = this.tooltipRefs[fieldId as string] || null;
        if (existingTooltip) {
            try {
                existingTooltip.destroy();
            } catch (e) {
                this.trigger('failure', {
                    error: e
                } as FailureEventArgs);
            }
            this.renderedInstances = this.renderedInstances.filter((inst: any) => inst !== existingTooltip);
            this.tooltipRefs[fieldId as string] = null;
        }
    }

    private renderField(component: FormNode): HTMLElement | null {
        const formState = this.formState;
        const formValues: Record<string, any> = formState ? formState.values : {};

        if (['panel', 'table', 'tabs', 'card', 'message', 'button', 'splitButton', 'staticHtml'].indexOf(component.type) !== -1) {
            return null;
        }

        const conditionalReadOnly: boolean = ConditionalRuleEngine.isFieldReadOnly(component.conditions, formValues);
        const conditionalDisabled: boolean = ConditionalRuleEngine.isFieldDisabled(component.conditions, formValues);
        const conditionalRequired: boolean = ConditionalRuleEngine.isFieldRequired(component.conditions, formValues);
        const conditionalValue: any = ConditionalRuleEngine.getConditionalValue(component.conditions, formValues);

        const computedReadOnly: boolean = !!component.readOnly || conditionalReadOnly;
        const computedDisabled: boolean = !!component.disabled || conditionalDisabled;
        const computedRequired: boolean = !!component.required || conditionalRequired;

        let minMaxConstraints: MinMaxConstraints = MinMaxRuleEngine.getConstraints(
            (component as FormNode).minMaxRange as any,
            formValues as any,
            component.type as any
        ) as MinMaxConstraints;
        if (component.type === 'dateTime') {
            const dateConstraints: MinMaxConstraints = MinMaxRuleEngine.getConstraints(
                (component as FormNode).minMaxRange as any,
                formValues as any,
                'date'
            ) as MinMaxConstraints;
            const timeConstraints: MinMaxConstraints = MinMaxRuleEngine.getConstraints(
                (component as FormNode).minMaxTimeRange as any,
                formValues as any,
                'time'
            ) as MinMaxConstraints;
            minMaxConstraints = {
                minValue: undefined,
                maxValue: undefined,
                minDate: dateConstraints.minDate,
                maxDate: dateConstraints.maxDate,
                minTime: timeConstraints.minTime,
                maxTime: timeConstraints.maxTime
            };
        }

        const labelPos: string = component.labelPosition || 'top';
        const labelWidth: string = component.labelWidth || 'auto';
        const showLabel: boolean = !component.hideLabel && !!component.label &&
            ['checkbox', 'button', 'staticHtml'].indexOf(component.type) === -1;

        const shouldShowError: boolean = !!(formState && formState.errors[component.id]);
        const isRequiredError: boolean = shouldShowError && !!(formState && formState.errors[component.id].indexOf('required') !== -1);
        const hasError: boolean = shouldShowError && !(isRequiredError && !computedRequired);

        const conditionIsActive: boolean = conditionalValue !== undefined;
        const wasConditionActive: boolean = this.conditionalValueApplied[component.id] || false;
        if (formState) {
            if (conditionIsActive && !wasConditionActive) {
                formState.values[component.id] = conditionalValue;
                this.conditionalValueApplied[component.id] = true;
            } else if (!conditionIsActive && wasConditionActive) {
                this.conditionalValueApplied[component.id] = false;
            }
        }

        const formGroup: HTMLDivElement = createElement('div', {
            className: 'form-group',
            attrs: { 'data-field-id': component.id, 'data-fr-field': component.id }
        }) as HTMLDivElement;
        const fieldWrapper: HTMLDivElement = createElement('div', {
            className: `field-wrapper label-${labelPos.toLowerCase()}`
        }) as HTMLDivElement;

        if (showLabel) {
            const labelEl: HTMLLabelElement = createElement('label', {
                className: 'field-label'
            }) as HTMLLabelElement;
            if(inputTargetTypes.indexOf(component.type) !== -1 || component.type === 'textarea') {
                labelEl.setAttribute('for', !isNullOrUndefined(this.element.id) ? this.element.id + '-' + component.name : component.name);
            }
            (labelEl as HTMLElement).style.width = labelPos.toLowerCase() === 'left' ? `${labelWidth}%` : 'auto';
            const span: HTMLSpanElement = createElement('span') as HTMLSpanElement;
            span.textContent = component.label;
            labelEl.appendChild(span);
            if (computedRequired) {
                const asterisk: HTMLSpanElement = createElement('span', { className: 'required-asterisk' }) as HTMLSpanElement;
                asterisk.textContent = '*';
                labelEl.appendChild(asterisk);
            }
            this.disposeTooltipInstance(component.id);
            if (component.tooltip) {
                const tooltipHost: HTMLSpanElement = createElement('span', {
                    className: 'e-msg-icon e-icons e-circle-info tooltip-icon',
                    attrs: {
                        'aria-label': component.tooltip,
                        title: component.tooltip,
                        tabindex: '0',
                        role: 'button',
                        'aria-haspopup': 'true'
                    }
                }) as HTMLSpanElement;
                (tooltipHost as HTMLElement).style.cursor = 'pointer';
                (tooltipHost as HTMLElement).style.display = 'flex';
                (tooltipHost as HTMLElement).style.alignItems = 'center';
                (tooltipHost as HTMLElement).style.justifyContent = 'center';
                (tooltipHost as HTMLElement).style.flexShrink = '0';
                labelEl.appendChild(tooltipHost);
                const tooltip: Tooltip = new Tooltip({ content: component.tooltip, enableRtl: this.enableRtl });
                tooltip.appendTo(tooltipHost);
                this.tooltipRefs[component.id] = tooltip;
                this.renderedInstances.push(tooltip);
            }
            fieldWrapper.appendChild(labelEl);
        }

        const fieldInput: HTMLDivElement = createElement('div', {
            className: 'field-input',
        }) as HTMLDivElement;

        const isIndexedRef: boolean = (component.type === 'radio' || component.type === 'checkboxGroup') && Array.isArray(component.options);
        const setInputRef: any = isIndexedRef
            ? (el: any, idx?: number) => {
                if (el && typeof idx === 'number') { this.inputRefs[`${component.name}_${idx}`] = el; }
            }
            : (el: any) => {
                if (el) { this.inputRefs[component.name] = el; }
            };

        const mergedComponent: FormNode = {
            ...component,
            readOnly: computedReadOnly,
            disabled: computedDisabled,
            required: computedRequired,
            ...(minMaxConstraints.minValue !== undefined && { minValue: minMaxConstraints.minValue as number }),
            ...(minMaxConstraints.maxValue !== undefined && { maxValue: minMaxConstraints.maxValue as number }),
            ...(minMaxConstraints.minDate !== undefined && { minDate: minMaxConstraints.minDate }),
            ...(minMaxConstraints.maxDate !== undefined && { maxDate: minMaxConstraints.maxDate }),
            ...(minMaxConstraints.minTime !== undefined && { minTime: minMaxConstraints.minTime }),
            ...(minMaxConstraints.maxTime !== undefined && { maxTime: minMaxConstraints.maxTime })
        } as FormNode;

        const onChangeHandler = (value: any): void => {
            if (component.type !== 'staticHtml') {
                if (component.type === 'signature') {
                    const ref: Signature = this.inputRefs[value as string];
                    value = ref.getSignature();
                }
                if (component.type === 'imageEditor') {
                    const ref: ImageEditor = this.inputRefs[value as string];
                    const imageData: any = ref.getImageData();
                    const canvas: HTMLCanvasElement = document.createElement('canvas');
                    canvas.width = imageData.width;
                    canvas.height = imageData.height;
                    const context: CanvasRenderingContext2D | null = canvas.getContext('2d');
                    if (context) { context.putImageData(imageData, 0, 0); }
                    value = canvas.toDataURL();
                }
                if(component.type === 'radio' || component.type === 'checkboxGroup') {
                    const inputElement = this.validator.getInputElement(component.id) as HTMLInputElement;
                    inputElement.value = value;
                }
                value = formatDateValues(component as any, value);
                if (this.formState && formState) { 
                    this.formState.values[component.id] = value;
                    formState.values[component.id] = value;
                 }
                this.trigger('change', { fieldName: component.name, label: component.label || component.id, value } as ChangeEventArgs);
                this.afterValueChange(component.id);
            }
        };

        const targetTag: string = inputTargetTypes.indexOf(component.type) !== -1
            ? 'input' : component.type === 'textarea' ? 'textarea' : 'div';
        const target: HTMLElement = createElement(targetTag, {
            attrs: { 'aria-label': `${component.label} ${component.type}` }
        }) as HTMLElement;
        if (component.type === 'radio' || component.type === 'checkboxGroup') {
            const inputEl: HTMLInputElement = createElement('input') as HTMLInputElement;
            inputEl.id = !isNullOrUndefined(this.element.id) ? this.element.id + '-' + component.name : component.name;
            inputEl.setAttribute('name', component.id);
            inputEl.style.display = 'none';
            inputEl.setAttribute('aria-hidden', 'true');
            target.appendChild(inputEl);
        }
        else {
            target.id = !isNullOrUndefined(this.element.id) ? this.element.id + '-' + component.name : component.name;
            target.setAttribute('name', component.id)
        }
        
        fieldInput.appendChild(target);

        let skipDefault: boolean = false;
        const resolvedWidget: ResolvedCustomWidget | null = resolveCustomWidget(
            component,
            this.customWidgetSettings
        );
        if (resolvedWidget) {
            let compiled: any = null;
            try {
                compiled = this.getTemplateFunction(resolvedWidget.entry.template as any);
            } catch (e) {
                if (this.failure) {
                    this.trigger('failure', { error: e } as FailureEventArgs);
                }
                compiled = null;
            }
            if (compiled) {
                try {
                    if (target.parentNode) {
                        target.parentNode.removeChild(target);
                    }
                    const swappedComponent = Object.assign({}, component, {
                        id: component.name,
                        name: component.id
                    });
                    const renderedOut: any = compiled({
                        component: swappedComponent,
                        value: formState ? formState.values[component.id] : undefined,
                        formState: formState
                    },
                    this
                );
                    let outList: any[];
                    if (renderedOut == null) {
                        outList = [];
                    } else if (Array.isArray(renderedOut)) {
                        outList = renderedOut;
                    } else if (typeof renderedOut === 'string') {
                        outList = [renderedOut];
                    } else if (typeof renderedOut === 'object'
                        && !(renderedOut as any).nodeType
                        && typeof (renderedOut as any).length === 'number'
                        && typeof (renderedOut as any).item === 'function') {
                        const snapshot: any[] = [];
                        const list: any = renderedOut;
                        for (let i: number = 0; i < list.length; i++) {
                            snapshot.push(list[i]);
                        }
                        outList = snapshot;
                    } else {
                        outList = [renderedOut];
                    }
                    for (const node of outList) {
                        if (node && typeof node === 'object' && (node as any).nodeType) {
                            fieldInput.appendChild(node as Node);
                        } else if (typeof node === 'string') {
                            const markup: string = this.sanitizeTemplateValue(node);
                            const span: HTMLElement = createElement('span');
                            span.innerHTML = markup;
                            while (span.firstChild) {
                                fieldInput.appendChild(span.firstChild);
                            }
                        } else if (node && typeof node === 'object') {
                            throw new Error(
                                'Custom widget template for "' + component.name + '" returned a ' +
                                'framework object that the vanilla renderer cannot insert. Use the ' +
                                'React/Angular/Vue wrapper (registered templates / portals) for ' +
                                'JSX or platform templates.'
                            );
                        }
                    }
                    setInputRef(fieldInput);
                    skipDefault = true;
                } catch (renderErr) {
                    if (this.failure) {
                        this.trigger('failure', { error: renderErr } as FailureEventArgs);
                    }
                    skipDefault = false;
                }
            }
        }

        if (!skipDefault) {
            const instance: any = renderFormField({
                component: mergedComponent,
                value: formState ? formState.values[component.id] : undefined,
                onChange: onChangeHandler,
                formState: formState,
                settings: this.processedSchemaCache.settings,
                onBlur: () => {
                    if (formState && component.type !== 'staticHtml') {
                        if (this.validator) {
                            try { 
                                this.beforeValidate(component.id); 
                                (this.validator as any).validate(component.id); 
                            } catch (e) { /* swallow */ }
                            this.syncFormStateErrors();
                        }
                    }
                },
                ref: setInputRef,
                hasError: hasError,
                locale: this.locale,
                components: this.collectAllComponents(this.processedSchemaCache.components as FormNode[]),
                enableRtl: this.enableRtl,
                target: target,
                l10n: this.l10n
            });
            if (Array.isArray(instance)) {
                instance.forEach((entry: any) => {
                    if (entry && typeof entry.destroy === 'function') {
                        this.renderedInstances.push(entry);
                    } else if (entry instanceof HTMLElement) {
                        for (const key of Object.keys(this.inputRefs)) {
                            const inst: any = this.inputRefs[key as string];
                            const hostEl: HTMLElement | undefined =
                                inst && (inst.element || inst.target || (inst.hostElement && inst.hostElement()));
                            if (hostEl && (hostEl === entry || entry.contains(hostEl))) {
                                this.renderedInstances.push(inst);
                            }
                        }
                    }
                });
            } else if (instance) {
                if (typeof instance.destroy === 'function') {
                    this.renderedInstances.push(instance);
                } else if (instance instanceof HTMLElement) {
                    for (const key of Object.keys(this.inputRefs)) {
                        const inst: any = this.inputRefs[key as string];
                        const hostEl: HTMLElement | undefined =
                            inst && (inst.element || inst.target || (inst.hostElement && inst.hostElement()));
                        if (hostEl && (hostEl === instance || instance.contains(hostEl))) {
                            this.renderedInstances.push(inst);
                        }
                    }
                }
            }
        }

        const errorSlot: HTMLDivElement = createElement('div', {
            id: 'error-' + (component.id || component.name || component.label),
            className: 'e-error-message',
            attrs: { role: 'alert', 'aria-live': 'assertive' }
        }) as HTMLDivElement;
        errorSlot.style.display = 'none';
        if (hasError && formState && formState.errors[component.id]) {
            errorSlot.textContent = formState.errors[component.id];
            errorSlot.classList.add('e-error');
            errorSlot.style.display = 'block';
        }
        fieldInput.appendChild(errorSlot);
        fieldWrapper.appendChild(fieldInput);
        formGroup.appendChild(fieldWrapper);

        if (component.description) {
            const desc: HTMLDivElement = createElement('div', {
                className: 'field-description',
                attrs: { 'aria-describedby': `description-${component.label}` }
            }) as HTMLDivElement;
            desc.textContent = component.description;
            formGroup.appendChild(desc);
        }
        return formGroup;
    }

    /**
     * @private
     */
    private renderComponent(component: FormNode): HTMLElement | null {
        const formState = this.formState;
        const formValues: Record<string, any> = formState ? formState.values : {};
        const isVisible: boolean = component.visible === false
            ? false
            : ConditionalRuleEngine.isFieldVisible(component.conditions, formValues);
        const isHidden: boolean = ConditionalRuleEngine.isFieldHidden(component.conditions, formValues);
        if (!isVisible || isHidden) {
            if (formState && formState.values[component.id] !== undefined && formState.values[component.id] !== null) {
                formState.values[component.id] = null;
            }
            return null;
        }

        if (FormRenderer.PRESERVABLE_TYPES.has(component.type) && this.preservedFields.has(component.id)) {
            const preservedNode: HTMLElement | undefined = this.preservedFields.get(component.id);
            if (preservedNode) {
                this.preservedFields.delete(component.id);
                return preservedNode;
            }
        }

        switch (component.type) {
            case 'panel': {
                const fieldset: HTMLFieldSetElement = createElement('fieldset', {
                    className: `form-panel-renderer ${component.cssClass || ''}`
                }) as HTMLFieldSetElement;
                ((fieldset as HTMLElement).style as any).minInlineSize = 'unset';
                if (component.label && !component.hideLabel) {
                    const legend: HTMLLegendElement = createElement('legend', {
                        className: !component.hideBorders ? 'panel-legend' : ''
                    }) as HTMLLegendElement;
                    legend.textContent = component.label;
                    fieldset.appendChild(legend);
                }
                const content: HTMLDivElement = createElement('div', { className: 'panel-content' }) as HTMLDivElement;
                (component.children || []).forEach((child: FormNode) => {
                    const rendered: HTMLElement | null = this.renderComponent(child);
                    if (rendered) { content.appendChild(rendered); }
                });
                fieldset.appendChild(content);
                return fieldset;
            }

            case 'table': {
                const tableRows: number = component.rows || (component.tableCells ? component.tableCells.length : 2);
                const tableCols: number = component.columns || (component.tableCells && component.tableCells[0] ? component.tableCells[0].length : 2);
                const defaultColSpan: number = Math.floor(12 / tableCols);
                const columnWidthsProp: any = (component as any).columnWidths;
                const splittedWidths: number[] = columnWidthsProp ? splitWidths(columnWidthsProp.widths) : [];

                const tableDiv: HTMLDivElement = createElement('div', {
                    className: `form-table-renderer ${component.hideBorders ? '' : 'table-border'} ${component.cssClass || ''}`,
                    attrs: { role: 'group', 'aria-label': component.label || 'Table Layout' }
                }) as HTMLDivElement;

                for (let rowIndex: number = 0; rowIndex < tableRows; rowIndex++) {
                    const rowDiv: HTMLDivElement = createElement('div', { className: 'e-form-table-row' }) as HTMLDivElement;
                    if (component.hideBorders) {
                        (rowDiv as HTMLElement).style.display = 'flex';
                        (rowDiv as HTMLElement).style.gap = '1.5rem';
                    }
                    for (let colIndex: number = 0; colIndex < tableCols; colIndex++) {
                        const cellComponents: FormNode[] = (component.tableCells && component.tableCells[rowIndex as number] &&
                            component.tableCells[rowIndex as number][colIndex as number]) || [];
                        const cellSpan: number = defaultColSpan;
                        const colWidthValue: number = splittedWidths[colIndex as number];
                        const isSingleColumn: boolean = tableCols === 1;
                        const cellStyle: any = isSingleColumn ? { width: '100%' } : (colWidthValue ? { width: `${colWidthValue}%` } : {});
                        const allNullWidths: boolean = !columnWidthsProp || (Array.isArray(columnWidthsProp.widths) && columnWidthsProp.widths.every((w: any) => w === null));
                        const isFirstRow: boolean = rowIndex === 0;
                        const cellDiv: HTMLDivElement = createElement('div', {
                            className: `e-form-table-cell ${colWidthValue ? '' : allNullWidths ? `col-${cellSpan}` : ''}`
                        }) as HTMLDivElement;
                        if (component.hideBorders) {
                            Object.assign((cellDiv as HTMLElement).style, cellStyle, { padding: isFirstRow ? '0' : '12px 0 0 0' });
                        } else {
                            Object.assign((cellDiv as HTMLElement).style, cellStyle);
                        }
                        cellComponents.forEach((comp: FormNode) => {
                            const rendered: HTMLElement | null = this.renderComponent(comp);
                            if (rendered) { cellDiv.appendChild(rendered); }
                        });
                        rowDiv.appendChild(cellDiv);
                    }
                    tableDiv.appendChild(rowDiv);
                }
                return tableDiv;
            }

            case 'tabs': {
                const tabsDiv: HTMLDivElement = createElement('div', {
                    className: `form-tabs-renderer ${component.cssClass || ''}`
                }) as HTMLDivElement;
                const tabHost: HTMLDivElement = createElement('div', {
                    className: 'e-tab'
                }) as HTMLDivElement;
                tabHost.id = component.id;
                const tabHeader: HTMLDivElement = createElement('div', {
                    className: 'e-tab-header'
                }) as HTMLDivElement;
                const tabContent: HTMLDivElement = createElement('div', {
                    className: 'e-content'
                }) as HTMLDivElement;
                tabHost.appendChild(tabHeader);
                tabHost.appendChild(tabContent);
                tabsDiv.appendChild(tabHost);

                (component.tabItems || []).forEach((tab) => {
                    const headerItem: HTMLDivElement = createElement('div') as HTMLDivElement;
                    headerItem.textContent = tab.header;
                    tabHeader.appendChild(headerItem);

                    const contentItem: HTMLDivElement = createElement('div') as HTMLDivElement;
                    const contentDiv: HTMLDivElement = createElement('div', { className: 'tab-content-renderer' }) as HTMLDivElement;
                    (tab.content || []).forEach((comp: FormNode) => {
                        const rendered: HTMLElement | null = this.renderComponent(comp);
                        if (rendered) { contentDiv.appendChild(rendered); }
                    });
                    contentItem.appendChild(contentDiv);
                    tabContent.appendChild(contentItem);
                });

                const tab: Tab = new Tab({
                    enableRtl: this.enableRtl,
                    cssClass: component.cssClass,
                    enablePersistence: true,
                    animation: { previous: { effect: 'None' }, next: { effect: 'None' } },
                    selected: (args) => {
                        if (typeof window === 'undefined') return null;
                        try {
                            window.localStorage.setItem(
                                'tab' + component.id,
                                JSON.stringify({
                                    selectedItem: args.selectedIndex
                                })
                            )
                        } catch {
                        }
                    }
                });
                tab.appendTo(tabHost);
                this.renderedInstances.push(tab);
                return tabsDiv;
            }

            case 'card': {
                const fieldset: HTMLFieldSetElement = createElement('fieldset', {
                    className: `e-card form-card-renderer ${component.cssClass || ''}`
                }) as HTMLFieldSetElement;
                ((fieldset as HTMLElement).style as any).minInlineSize = 'unset';
                (fieldset as HTMLElement).style.padding = '0';
                const header: HTMLDivElement = createElement('div', { className: 'e-card-header' }) as HTMLDivElement;
                const caption: HTMLDivElement = createElement('div', { className: 'e-card-header-caption' }) as HTMLDivElement;
                const title: HTMLDivElement = createElement('div', { className: 'e-card-title' }) as HTMLDivElement;
                title.textContent = (component as FormNode).cardTitle || component.label || 'Card Title';
                caption.appendChild(title);
                if ((component as FormNode).cardSubtitle) {
                    const sub: HTMLDivElement = createElement('div', { className: 'e-card-sub-title' }) as HTMLDivElement;
                    sub.textContent = (component as FormNode).cardSubtitle as string;
                    caption.appendChild(sub);
                }
                header.appendChild(caption);
                fieldset.appendChild(header);
                const content: HTMLDivElement = createElement('div', { className: 'e-card-content card-content' }) as HTMLDivElement;
                (component.children || []).forEach((child: FormNode) => {
                    const rendered: HTMLElement | null = this.renderComponent(child);
                    if (rendered) { content.appendChild(rendered); }
                });
                fieldset.appendChild(content);
                return fieldset;
            }

            case 'staticHtml': {
                const renderer: StaticHtmlRenderer = new StaticHtmlRenderer({
                    content: component.defaultValue as string || '<p>HTML content</p>',
                    id: component.id,
                    enableHtmlSanitizer: component.enableHtmlSanitizer
                });
                const el: HTMLElement = renderer.render();
                this.renderedInstances.push(renderer);
                return el;
            }

            case 'message': {
                const wrapper: HTMLDivElement = createElement('div', { className: 'form-group' }) as HTMLDivElement;
                const target: HTMLElement = createElement('div') as HTMLDivElement;
                target.id = component.name;
                target.setAttribute('name', component.id)
                wrapper.appendChild(target);
                const instance: any = renderFormField({
                    component: component,
                    locale: this.locale,
                    value: undefined,
                    onChange: () => { },
                    enableRtl: this.enableRtl,
                    target: target,
                    ref: (el: any, idx?: number) => {
                        if (idx !== undefined) { this.inputRefs[`${component.name}_${idx}`] = el; }
                        else { this.inputRefs[component.name] = el; }
                    },
                });
                if (Array.isArray(instance)) {
                    instance.forEach((entry: any) => {
                        if (entry) { this.renderedInstances.push(entry); }
                    });
                } else if (instance) {
                    this.renderedInstances.push(instance);
                }
                return wrapper;
            }

            case 'button': {
                const buttonlDisabled: boolean = ConditionalRuleEngine.isFieldDisabled(component.conditions, formValues);
                const buttonComputed: boolean = !!component.disabled || buttonlDisabled;
                const wrapper: HTMLDivElement = createElement('div', { className: 'form-group' }) as HTMLDivElement;
                const target: HTMLElement = createElement('div') as HTMLDivElement;
                target.id = component.name;
                target.setAttribute('name', component.id)
                wrapper.appendChild(target);
                const handleButtonClick = (event: any): void => {
                    if (this.buttonClick) {
                        const label: string = component.buttonsGroups
                            ? (event.target && event.target.ej2_instances ? event.target.ej2_instances[0].content : '')
                            : component.label || '';
                        this.trigger('buttonClick', { fieldName: component.name, label: label, event: event } as ButtonClickEventArgs);
                    }
                    const button = event.target as HTMLButtonElement;
                    if (button.type && button.type === 'reset') {
                        const form = button.closest('form');
                        if(form) {
                            form.querySelectorAll('input[type="checkbox"]').forEach((cb: any) => {
                                (cb.ej2_instances[0]).checked = false;
                                
                            });
                             form.querySelectorAll('.e-control.e-multiselect.e-lib').forEach((cb: any) => {
                                (cb.ej2_instances[0]).value = [];
                            });
                        }
                        this.formState.values = {};
                        form.reset();
                        this.rerenderForm();
                        this.validator.destroy();
                    }
                };
                const instance: any = renderFormField({
                    component: { ...component, disabled: buttonComputed } as FormNode,
                    value: undefined,
                    onChange: () => { },
                    locale: this.locale,
                    onClick: handleButtonClick,
                    ref: (el: any, idx?: number) => {
                        if (idx !== undefined) { this.inputRefs[`${component.name}_${idx}`] = el; }
                        else { this.inputRefs[component.name] = el; }
                    },
                    enableRtl: this.enableRtl,
                    target: target
                });
                if (Array.isArray(instance)) {
                    instance.forEach((entry: any) => {
                        if (entry) { this.renderedInstances.push(entry); }
                    });
                } else if (instance) {
                    this.renderedInstances.push(instance);
                }
                return wrapper;
            }

            case 'splitButton': {
                const splitButtonDisabled: boolean = ConditionalRuleEngine.isFieldDisabled(component.conditions, formValues);
                const computedDisabled: boolean = !!component.disabled || splitButtonDisabled;
                const wrapper: HTMLDivElement = createElement('div', { className: 'form-group' }) as HTMLDivElement;
                const target: HTMLElement = createElement('div') as HTMLDivElement;
                target.id = component.name;
                target.setAttribute('name', component.id)
                wrapper.appendChild(target);
                const handleSplitButtonEvent = (event: any): void => {
                    if (this.buttonClick) {
                        this.trigger('buttonClick', { fieldName: component.name, label: component.label || '', event: event } as ButtonClickEventArgs);
                    }
                };
                const instance: any = renderFormField({
                    component: { ...component, disabled: computedDisabled } as FormNode,
                    value: undefined,
                    locale: this.locale,
                    onChange: () => { },
                    onClick: handleSplitButtonEvent,
                    ref: (el: any) => { if (el) { this.inputRefs[component.name] = el; } },
                    enableRtl: this.enableRtl,
                    target: target
                });
                if (Array.isArray(instance)) {
                    instance.forEach((entry: any) => {
                        if (entry) { this.renderedInstances.push(entry); }
                    });
                } else if (instance) {
                    this.renderedInstances.push(instance);
                }
                return wrapper;
            }

            default:
                return this.renderField(component);
        }
    }

    /**
     * @private
     */
    private afterValueChange(changedFieldId?: string): void {
        if (!this.formState) { return; }
        this.currentFormValues = { ...this.formState.values };
        this.evaluateExpressions();
        this.retriggerCustomValidation();
        this.beforeValidate(changedFieldId);
        this.validator.validate(changedFieldId);
        this.syncFormStateErrors();
        if (changedFieldId && this.isConditionalTrigger(changedFieldId)) {
            this.scheduleRerender(changedFieldId);
        }
    }

    /**
     * @private
     */
    private beforeValidate(fieldId?: string): void {
        const infoElement = this.element.querySelector(`#${fieldId}-info`) as HTMLElement;
        if (infoElement && infoElement.classList.contains('e-error')) {
            infoElement.classList.remove('e-error');
        }
        const inputElement: HTMLInputElement = this.getInputElementByName(fieldId);
        if (!inputElement) { return; }
        const inputParent = inputElement.parentElement;
        const grandParent = inputParent.parentElement;
        if (inputParent.classList.contains('e-control-wrapper') || inputParent.classList.contains('e-wrapper') ||
            (inputElement.classList.contains('e-input') && inputParent.classList.contains('e-input-group'))) {
            inputParent.classList.remove('e-error');
        }
        else if ((grandParent != null) && (grandParent.classList.contains('e-control-wrapper') || grandParent.classList.contains('e-wrapper'))) {
            grandParent.classList.remove('e-error');
        }
        else {
            inputElement.classList.remove('e-error');
        }
        if (this.validator) {
            (this.validator as any).errorRules = [];
        }
    }

    /**
     * @private
     */
    private pendingChangedFieldIds: Set<string> = new Set<string>();
    private scheduleRerender(changedFieldId?: string): void {
        if (changedFieldId) { this.pendingChangedFieldIds.add(changedFieldId); }
        if (this.rerenderScheduled) { return; }
        this.rerenderScheduled = true;
        Promise.resolve().then(() => {
            this.rerenderScheduled = false;
            const changedIds: Set<string> = new Set<string>(this.pendingChangedFieldIds);
            this.pendingChangedFieldIds.clear();
            this.rerenderForm(changedIds);
        });
    }

    /**
     * @private
     */
    private collectConditionFieldIds(condition: any, acc: Set<string>): void {
        if (!condition) { return; }
        if (typeof condition.field === 'string') {
            acc.add(condition.field);
        } else if (Array.isArray(condition.rules)) {
            for (const sub of condition.rules) {
                this.collectConditionFieldIds(sub, acc);
            }
        }
    }
    
    private collectDataSourceReferenceIds(
        value: string,
        allComps: FormNode[],
        target: Set<string>
    ): void {
        if (typeof value !== 'string') {
            return;
        }

        const matches: RegExpMatchArray | null = value.match(/\{([^}]+)\}/g);

        if (!matches) {
            return;
        }

        for (const match of matches) {
            const componentName: string = match.slice(1, -1);

            const referencedComp: FormNode | undefined =
                allComps.find((c: FormNode) => c.name === componentName);

            if (referencedComp && referencedComp.id) {
                target.add(referencedComp.id);
            }
        }
    }

    /**
     * @private
     */
    private buildConditionalDependencyMap(): void {
        const triggers: Set<string> = new Set<string>();
        const consumerDeps: Map<string, Set<string>> = new Map<string, Set<string>>();
        const allComps: FormNode[] = this.collectAllComponents(
            this.processedSchemaCache.components as FormNode[]
        );
        for (const comp of allComps) {
            const myDeps: Set<string> = new Set<string>();
            consumerDeps.set(comp.id, myDeps);
            const conditions: any = (comp as any).conditions;
            if (conditions) {
                const conditionKeys: string[] = [
                    'visibleWhen',
                    'hideWhen',
                    'disabledWhen',
                    'requiredWhen',
                    'readOnlyWhen',
                    'choiceBasedField',
                    'conditionalData'
                ];
                for (const key of conditionKeys) {
                    if (conditions[key as string]) {
                        this.collectConditionFieldIds(
                            conditions[key as string],
                            triggers
                        );

                        this.collectConditionFieldIds(
                            conditions[key as string],
                            myDeps
                        );
                    }
                }
                if (Array.isArray(conditions.conditionalData)) {
                    for (const item of conditions.conditionalData) {
                        if (item && item.condition) {
                            this.collectConditionFieldIds(
                                item.condition,
                                triggers
                            );
                            this.collectConditionFieldIds(
                                item.condition,
                                myDeps
                            );
                        }
                        if (item && Array.isArray(item.conditions)) {
                            for (const subCond of item.conditions) {
                                this.collectConditionFieldIds(
                                    subCond,
                                    triggers
                                );
                                this.collectConditionFieldIds(
                                    subCond,
                                    myDeps
                                );
                            }
                        }
                    }
                }
                if (
                    conditions.setValueWhen &&
                    conditions.setValueWhen.condition
                ) {
                    this.collectConditionFieldIds(
                        conditions.setValueWhen.condition,
                        triggers
                    );

                    this.collectConditionFieldIds(
                        conditions.setValueWhen.condition,
                        myDeps
                    );
                }
                if (
                    conditions.choiceBasedField &&
                    typeof conditions.choiceBasedField.primaryFieldId === 'string'
                ) {
                    triggers.add(
                        conditions.choiceBasedField.primaryFieldId
                    );

                    myDeps.add(
                        conditions.choiceBasedField.primaryFieldId
                    );
                }
            }
            const collectMinMaxReferenceIds = (range: any): void => {
                if (!range || range.enabled !== true) { return; }
                const collectFromBound = (bound: any): void => {
                    if (bound && typeof bound === 'object' && typeof bound.field === 'string') {
                        triggers.add(bound.field);
                        myDeps.add(bound.field);
                    }
                };
                collectFromBound(range.minValue);
                collectFromBound(range.maxValue);
            };
            const minMaxRule: any = (comp as any).minMaxRange;
            if (Array.isArray(minMaxRule)) {
                for (const range of minMaxRule) {
                    collectMinMaxReferenceIds(range);
                }
            }
            const minMaxTimeRule: any = (comp as any).minMaxTimeRange;
            if (Array.isArray(minMaxTimeRule)) {
                for (const range of minMaxTimeRule) {
                    collectMinMaxReferenceIds(range);
                }
            }
            const ds: any = (comp as any).dataSource;
            if (
                ((comp as any).type === 'dataGrid') &&
                ds &&
                ds.type === 'url'
            ) {
                if (ds.search && typeof ds.search.key === 'string') {
                    this.collectDataSourceReferenceIds(
                        ds.search.key,
                        allComps,
                        triggers
                    );
                    this.collectDataSourceReferenceIds(
                        ds.search.key,
                        allComps,
                        myDeps
                    );
                }
                if (Array.isArray(ds.filters)) {
                    for (const filter of ds.filters) {
                        if (typeof filter.value === 'string') {
                            this.collectDataSourceReferenceIds(
                                filter.value,
                                allComps,
                                triggers
                            );
                            this.collectDataSourceReferenceIds(
                                filter.value,
                                allComps,
                                myDeps
                            );
                        }
                    }
                }
            }
        }
        this.conditionalTriggerFieldIds = triggers;
        this.consumerDependencyMap = consumerDeps;
    }


    /**
     * @private
     */
    private isConditionalTrigger(fieldId: string): boolean {
        return this.conditionalTriggerFieldIds.has(fieldId);
    }

    /**
     * @private
     */
    private rerenderForm(changedFieldIds?: Set<string>): void {
        const changedIds: Set<string> = changedFieldIds || new Set<string>();
        const activeEl: Element | null = document.activeElement;
        const focusedName: string | null =
            activeEl && (activeEl as HTMLElement).getAttribute
                ? (activeEl as HTMLElement).getAttribute('name')
                : null;

        let selectionStart: number | null = null;
        let selectionEnd: number | null = null;
        if (focusedName && activeEl && (activeEl as HTMLInputElement).selectionStart !== undefined) {
            try {
                selectionStart = (activeEl as HTMLInputElement).selectionStart;
                selectionEnd = (activeEl as HTMLInputElement).selectionEnd;
            } catch (e) { /* ignore */ }
        }

        const savedElementScrollTop: number = this.element.scrollTop;
        const savedElementScrollLeft: number = this.element.scrollLeft;
        const savedWindowScrollX: number = window.scrollX;
        const savedWindowScrollY: number = window.scrollY;

        this.preservedFields.clear();
        const allComps: FormNode[] = this.collectAllComponents(this.processedSchemaCache.components as FormNode[]);
        for (const comp of allComps) {
            if (!FormRenderer.PRESERVABLE_TYPES.has(comp.type)) { continue; }
            const myDeps: Set<string> | undefined = this.consumerDependencyMap.get(comp.id);
            let dependsOnChanged: boolean = false;
            if (myDeps) {
                changedIds.forEach((changedId: string) => {
                    if (myDeps.has(changedId)) { dependsOnChanged = true; }
                });
            }
            if (dependsOnChanged) { continue; }
            const liveNode: HTMLElement | null = this.element.querySelector(`[data-field-id="${comp.id}"]`) as HTMLElement | null;
            if (liveNode && liveNode.parentElement) {
                liveNode.parentElement.removeChild(liveNode);
                this.preservedFields.set(comp.id, liveNode);
            }
        }
        this.refreshing = true;
        if (this.isReact || this.isAngular) {
            (this as any).clearTemplate();
        }
        this.destroyRenderedExcludingPreserved();
        this.removePreviousRoot();
        if(this.validator) {
          this.validator.destroy();
        }
        this.render();
        this.refreshing = false;

        try {
            this.element.scrollTop = savedElementScrollTop;
            this.element.scrollLeft = savedElementScrollLeft;
            window.scrollTo(savedWindowScrollX, savedWindowScrollY);
        } catch (e) { /* swallow */ }

        if (focusedName) {
            const elToFocus: HTMLInputElement | null = this.getInputElementByName(focusedName) as HTMLInputElement | null;
            if (elToFocus && typeof elToFocus.focus === 'function') {
                try {
                    elToFocus.focus();
                    if (selectionStart !== null && selectionEnd !== null &&
                        typeof (elToFocus as HTMLInputElement).setSelectionRange === 'function') {
                        try {
                            (elToFocus as HTMLInputElement).setSelectionRange(selectionStart, selectionEnd);
                        } catch (e) { /* swallow — non-text input */ }
                    }
                } catch (e) { /* swallow */ }
            }
        }

        if (this.preservedFields.size > 0) {
            const stillKept: string[] = [];
            this.preservedFields.forEach((node: HTMLElement, id: string) => {
                if (!this.element.contains(node) && !document.body.contains(node)) {
                    this.destroyPreservedSubtree(node);
                    try {
                        if (node.parentNode) { node.parentNode.removeChild(node); }
                    } catch (e) {
                        // ignore
                    }
                    this.preservedFields.delete(id);
                } else {
                    stillKept.push(id);
                }
            });
            stillKept.forEach((id: string) => this.preservedFields.delete(id));
        }
    }

    /**
     * @private
     */
    private removePreviousRoot(): void {
        if (this.element) {
            while (this.element.childNodes.length > 0) {
                this.element.removeChild(this.element.firstChild as Element);
            }
        }
    }

    /**
     * @private
     */
    private destroyRenderedInstance(inst: any): void {
        if (!inst || typeof inst.destroy !== 'function') {
            return;
        }
        const state: any = inst;
        if (state.isDestroyed || state.destroyed || state.disposed) {
            return;
        }
        const hostElement: HTMLElement | undefined = inst.element || inst.target || (inst.hostElement && typeof inst.hostElement === 'function' ? inst.hostElement() : undefined);
        try {
            state.isDestroyed = true;
            state.destroyed = true;
            state.disposed = true;
            inst.destroy();
        } catch (e) {
            console.warn('FormRenderer: failed to destroy child instance.', e);
        } finally {
            if (hostElement && hostElement.parentNode) {
                try {
                    hostElement.parentNode.removeChild(hostElement);
                } catch (e) {
                }
            }
        }
    }

    /**
     * @private
     */
    private destroyRenderedExcludingPreserved(): void {
        const survived: any[] = [];
        const preservedNodes: HTMLElement[] = Array.from(this.preservedFields.values());
        for (const inst of this.renderedInstances) {
            const hostEl: HTMLElement | undefined =
                inst && (inst.element || inst.target || (inst.hostElement && inst.hostElement()));
            const isPreserved: boolean = !!hostEl && preservedNodes.some((n: HTMLElement) => n === hostEl || n.contains(hostEl));
            if (isPreserved) {
                survived.push(inst);
            } else {
                this.destroyRenderedInstance(inst);
            }
        }
        this.renderedInstances = survived;
        const inputRefKeys: string[] = Object.keys(this.inputRefs);
        for (const key of inputRefKeys) {
            const inst: any = this.inputRefs[key as string];
            const hostEl: HTMLElement | undefined =
                inst && (inst.element || inst.target || (inst.hostElement && inst.hostElement()));
            const isPreserved: boolean = !!hostEl && preservedNodes.some((n: HTMLElement) => n === hostEl || n.contains(hostEl));
            if (!isPreserved) {
                delete this.inputRefs[key as string];
            }
        }
        this.conditionalValueApplied = {};
        this.expressionDependencyGraph = {};
        this.computedFieldNames = new Set<string>();
        this.previousFormValues = {};
        this.conditionalTriggerFieldIds = new Set<string>();
    }

    /**
     * @private
     */
    private destroyPreservedSubtree(rootNode: HTMLElement): void {
        const survived: any[] = [];
        for (const inst of this.renderedInstances) {
            const hostEl: HTMLElement | undefined =
                inst && (inst.element || inst.target || (inst.hostElement && inst.hostElement()));
            if (hostEl && (hostEl === rootNode || rootNode.contains(hostEl))) {
                this.destroyRenderedInstance(inst);
            } else {
                survived.push(inst);
            }
        }
        this.renderedInstances = survived;
    }


    private getInputElementByName(name: string): HTMLInputElement | null {
        let inputEl = this.element.querySelector(
            `[name="${name}"]`
        ) as HTMLInputElement | null;
        if (!inputEl) {
            return null;
        }
        if (!inputEl.classList.contains('e-control')) {
            const eControl = inputEl.parentElement ? inputEl.parentElement.querySelector(
                '.e-control'
            ) as HTMLInputElement | null : null;

            if (eControl) {
                return eControl;
            }
        }
        return inputEl;
    }


    /**
     * @private
     */
    private evaluateExpressions(): void {
        if (!this.formState || !this.expressionEngine) { return; }
        if (this.expressionEvaluationInProgress) { return; }
        try {
            this.expressionEvaluationInProgress = true;
            const engine: ExpressionEngine = this.expressionEngine;
            const dependencyGraph: DependencyGraph = this.expressionDependencyGraph;
            const formValues: Record<string, any> = this.formState.values || {};
            const allComponents: FormNode[] = this.collectAllComponents(this.processedSchemaCache.components as FormNode[]);
            const previousValues: { [x: string]: FormValueType } = this.previousFormValues;
            const computedFieldNames: Set<string> = this.computedFieldNames;

            const idToNameMap: Record<string, string> = {};
            allComponents.forEach((comp: FormNode) => {
                if (comp.name) { idToNameMap[comp.id as string] = comp.name; }
            });
            const contextValues: Record<string, unknown> = {};
            const fvKeys: string[] = Object.keys(formValues);
            for (const componentId of fvKeys) {
                const value: any = (formValues as Record<string, any>)[componentId as string];
                const fieldName: string = idToNameMap[componentId as string];
                if (fieldName) { contextValues[fieldName as string] = value; }
            }
            const previousContextValues: Record<string, unknown> = { ...previousValues };
            Object.assign(previousValues, contextValues);
            const changedFields: Set<string> = new Set<string>();
            const ctxKeys: string[] = Object.keys(contextValues);
            for (const fieldName of ctxKeys) {
                const fieldId: string | undefined = Object.keys(idToNameMap).find((id: string) => idToNameMap[id as string] === fieldName);
                if (fieldId && contextValues[fieldName as string] !== previousContextValues[fieldName as string] && !computedFieldNames.has(fieldId)) {
                    changedFields.add(fieldName);
                }
            }
            if (changedFields.size === 0) { return; }
            const evaluationOrder: string[] = engine.getTopologicalOrder(dependencyGraph);
            for (const fieldName of evaluationOrder) {
                const component: FormNode | undefined = allComponents.find((c: FormNode) => c.name === fieldName);
                if (component && component.expressionValue) {
                    computedFieldNames.add(component.id);
                    try {
                        const isVisible: boolean = component.visible !== false
                            ? ConditionalRuleEngine.isFieldVisible(component.conditions, formValues)
                            : false;
                        if (isVisible) {
                            const currentValues: Record<string, FormValueType> = {};
                            const fvKeys2: string[] = Object.keys(formValues);
                            for (const componentId of fvKeys2) {
                                const value: any = (formValues as Record<string, any>)[componentId as string];
                                const fn: string = idToNameMap[componentId as string];
                                if (fn) { currentValues[fn as string] = value; }
                            }
                            let result: any = engine.evaluate(component.expressionValue, currentValues);
                            result = (typeof result === 'string' && result.indexOf('undefined') !== -1)
                                ? result.replace(/undefined/g, '')
                                : result;
                            if (result !== null && result !== undefined && result !== '') {
                                switch (component.type) {
                                    case 'number': {
                                        const numResult: number = Number(result);
                                        result = isNaN(numResult) ? 0 : numResult;
                                        break;
                                    }
                                    case 'checkbox':
                                    case 'switch':
                                        result = Boolean(result);
                                        break;
                                    case 'textbox':
                                    case 'textarea':
                                        result = String(result);
                                        break;
                                    case 'dateRange':
                                    case 'checkboxGroup':
                                    case 'multiselect':
                                        break;
                                    default:
                                        result = String(result);
                                        break;
                                }
                            }
                            if (result !== null && result !== undefined && result !== formValues[component.id] && this.formState) {
                                this.formState.values[component.id] = result;
                                if (this.validator) {
                                    const inputEl: HTMLInputElement | null = this.getInputElementByName(component.id) as HTMLInputElement;
                                    if (inputEl) {
                                        this.syncValueToInput(inputEl, component.id, result);
                                    }
                                }
                            }
                        }
                    } catch (error) {
                        if (this.failure) {
                            this.trigger('failure', {
                                error: error
                            } as FailureEventArgs);
                        }
                    }
                }
            }
            Object.assign(previousValues, contextValues);
        } finally {
            this.expressionEvaluationInProgress = false;
        }
    }

    /**
     * @private
     */
    private retriggerCustomValidation(): void {
        if (!this.formState) { return; }
        if (!this.customValidationEngine) { return; }
        try {
            const allComponents: FormNode[] = this.collectAllComponents(this.processedSchemaCache.components as FormNode[]);
            const formValues: Record<string, any> = this.formState.values || {};
            const previousValues: { [x: string]: FormValueType } = this.previousFormValues;
            const changedFields: Set<string> = new Set<string>();
            Object.keys(formValues).forEach((fieldId: string) => {
                if (formValues[fieldId as string] !== previousValues[fieldId as string]) { changedFields.add(fieldId); }
            });
            if (changedFields.size === 0) { return; }
            const fieldsToValidate: Set<string> = new Set<string>();
            changedFields.forEach((fieldId: string) => {
                const component: FormNode | undefined = allComponents.find((c: FormNode) => c.id === fieldId);
                if (component && component.customValidation && Array.isArray(component.customValidation)) {
                    fieldsToValidate.add(fieldId);
                }
            });
            allComponents.forEach((component: FormNode) => {
                if (component.customValidation && Array.isArray(component.customValidation)) {
                    component.customValidation.forEach((rule: any) => {
                        const deps: string[] = this.customValidationEngine.extractDependencies(rule.expression);
                        deps.forEach((dep: string) => {
                            const depComponent: FormNode | undefined = allComponents.find((c: FormNode) => c.id === dep || c.name === dep);
                            if (depComponent && changedFields.has(depComponent.id)) {
                                fieldsToValidate.add(component.id);
                            }
                        });
                    });
                }
            });
            this.previousFormValues = { ...formValues };
        } catch (error) {
            if (this.failure) {
                this.trigger('failure', {
                    error: error
                } as FailureEventArgs);
            }
        }
    }

    /**
     * @private
     */
    private handleSubmitData(data: Record<string, any>): void {
        const formState = this.formState;
        const isValid: boolean = formState && formState.errors ? Object.keys(formState.errors).length === 0 : false;
        const transformedData: Record<string, any> = {};
        const formValues: Record<string, any> = formState ? formState.values : {};
        const excludedTypes: Set<string> = new Set<string>(['button', 'message', 'panel', 'table', 'tabs']);
        const allComps: FormNode[] = this.collectAllComponents(this.processedSchemaCache.components as FormNode[] || []);
        const excludedIds: Set<string> = new Set<string>(allComps.filter((c: FormNode) => excludedTypes.has(c.type)).map((c: FormNode) => c.id));
        const hiddenFieldIds: Set<string> = new Set<string>(allComps.filter((c: FormNode) => {
            if (c.visible === false) { return true; }
            if (c.conditions && c.conditions.visibleWhen) {
                if (!ConditionalRuleEngine.isFieldVisible(c.conditions, formValues)) { return true; }
            }
            if (c.conditions && c.conditions.hideWhen) {
                if (ConditionalRuleEngine.isFieldHidden(c.conditions, formValues)) { return true; }
            }
            return false;
        }).map((c: FormNode) => c.id));
        const disabledFieldIds: Set<string> = new Set<string>(allComps.filter((c: FormNode) => {
            if (c.disabled) { return true; }
            if (c.conditions && c.conditions.disabledWhen) {
                return ConditionalRuleEngine.isFieldDisabled(c.conditions, formValues);
            }
            return false;
        }).map((c: FormNode) => c.id));

        const dataKeys: string[] = Object.keys(data);
        for (const id of dataKeys) {
            const val: any = (data as Record<string, any>)[id as string];
            if (excludedIds.has(id) || hiddenFieldIds.has(id) || disabledFieldIds.has(id)) { return; }
            const label: string = this.idToLabelCache[id as string] || id;
            transformedData[label as string] = val;
        }

        if (this.submit) {
            this.trigger('submit', { data: transformedData, isValid: isValid } as SubmitEventArgs);
        }
    }

    /**
     * Retrieves the underlying Syncfusion form-input component instance by its field name.
     * Use this to call Syncfusion component methods and properties.
     *
     * @param {string} name - Specifies the name for the built-in Syncfusion component.
     * @returns {object | null} - Specifies the instance of the Syncfusion component in the form.
     */
    public getComponent(name: string): object | null {
        return (this.inputRefs[name as string] as object | null) || null;
    }

    /**
     * Programmatically sets a form field's value for user edits.
     *
     * @param  {string} fieldName - The field's `name` (the schema property's `name`).
     * @param  {any} value - The new value to set.
     * @returns void
     */
    public setFieldValue(fieldName: string, value: any): void {
        const allComponents: FormNode[] = this.collectAllComponents(
            this.processedSchemaCache.components as FormNode[] || []
        );
        const component: FormNode | undefined = allComponents.find(
            (c: FormNode) => c.name === fieldName
        );
        if (!component) { return; }
        if (this.formState) {
            this.formState.values[component.id] = value;
        }
        const inputEl: HTMLInputElement | null = this.getInputElementByName(component.id) as HTMLInputElement | null;
        if (inputEl) {
            this.syncValueToInput(inputEl, component.id, value);
        }
        this.trigger('change', {
            fieldName: component.name,
            label: component.label || component.id,
            value: value
        } as ChangeEventArgs);
        this.afterValueChange(component.id);
    }

    /**
     * @private
     */
    private syncValueToInput(inputEl: HTMLInputElement | null, fieldId: string, value: any): void {
        if (!inputEl) { return; }
        try {
            const nativeInput: HTMLInputElement | null = (inputEl instanceof HTMLInputElement) ? inputEl : null;
            const isCheckable: boolean = !!nativeInput &&
                (nativeInput.type === 'checkbox' || nativeInput.type === 'radio');
            const ej2Inst: any = (inputEl as any).ej2_instances && (inputEl as any).ej2_instances[0];
            if (ej2Inst) {
                if (isCheckable && typeof ej2Inst.checked !== 'undefined') {
                    if (nativeInput.type === 'radio' && typeof ej2Inst.value !== 'undefined') {
                        ej2Inst.checked = String(value) === String(ej2Inst.value);
                    } else {
                        ej2Inst.checked = FormRenderer.coerceChecked(value);
                    }
                } else if (typeof ej2Inst.value !== 'undefined') {
                    ej2Inst.value = value;
                }
                return;
            }
            if (inputEl instanceof HTMLSelectElement) {
                const strValue: string = (value === null || value === undefined) ? '' : String(value);
                inputEl.value = strValue;
                if (inputEl.value !== strValue && inputEl.options.length > 0) {
                    for (let i: number = 0; i < inputEl.options.length; i++) {
                        if (inputEl.options[i as number].text === strValue) {
                            inputEl.value = inputEl.options[i as number].value;
                            break;
                        }
                    }
                }
            } else if (nativeInput && nativeInput.type === 'radio') {
                const radios: NodeListOf<HTMLInputElement> = this.element.querySelectorAll(
                    `input[type="radio"][name="${fieldId}"]`
                ) as NodeListOf<HTMLInputElement>;
                for (let i: number = 0; i < radios.length; i++) {
                    radios[i as number].checked = String(value) === radios[i as number].value;
                }
            } else if (isCheckable) {
                nativeInput.checked = FormRenderer.coerceChecked(value);
            } else if (typeof (inputEl as any).value !== 'undefined') {
                (inputEl as any).value = (value === null || value === undefined) ? '' : String(value);
            }
        } catch (e) { /* ignore */ }
    }

    /**
     * @private
     */
    private static coerceChecked(value: any): boolean {
        if (typeof value === 'boolean') { return value; }
        if (typeof value === 'number') { return value !== 0; }
        if (typeof value === 'string') { return value !== '' && value !== 'false' && value !== '0'; }
        return !!value;
    }

    /**
     * @private
     */
    protected onPropertyChanged(newProps: { [key: string]: any }, oldProps: { [key: string]: any }): void {
        let reRender: boolean = false;
        if (newProps.schema !== oldProps.schema) { reRender = true; }
        if (newProps.dataModel !== oldProps.dataModel) { reRender = true; }
        if (newProps.locale !== oldProps.locale) { reRender = true; }
        if (newProps.enableRtl !== oldProps.enableRtl) { reRender = true; }
        if (newProps.layout !== oldProps.layout) { reRender = true; }
        if (newProps.customWidgetSettings !== oldProps.customWidgetSettings) { reRender = true; }
        if (!reRender) { return; }
        if (this.isReact || this.isAngular) {
            (this as any).clearTemplate();
        }
        this.refreshing = true;
        this.destroyRendered();
        this.removePreviousRoot();
        this.isInitialized = false;
        this.render();
        this.refreshing = false;
    }

    /**
     * @private
     */
    private destroyRendered(): void {
        if (this.validator) {
            try { this.validator.destroy(); }
            catch (e) {
                this.trigger('failure', {
                    error: e
                } as FailureEventArgs);
            }
            this.validator = null;
        }
        this.renderedInstances.forEach((inst: any) => {
            this.destroyRenderedInstance(inst);
        });
        this.renderedInstances = [];
        this.removePreviousRoot();
        this.inputRefs = {};
        this.tooltipRefs = {};
        this.conditionalValueApplied = {};
        this.expressionDependencyGraph = {};
        this.computedFieldNames = new Set<string>();
        this.previousFormValues = {};
        this.conditionalTriggerFieldIds = new Set<string>();
        this.consumerDependencyMap = new Map<string, Set<string>>();
        this.preservedFields = new Map<string, HTMLElement>();
        this.pendingChangedFieldIds = new Set<string>();
    }

    /**
     * @private
     */
    private clearPersistedTabSelections(): void {
        if (typeof window === 'undefined') return null;
        try {
            const components: FormNode[] = (this.processedSchemaCache && this.processedSchemaCache.components)
                ? (this.processedSchemaCache.components as FormNode[])
                : [];
            const allComps: FormNode[] = this.collectAllComponents(components);
            allComps.forEach((component: FormNode) => {
                if (component.type === 'tabs' && component.id) {
                    window.localStorage.removeItem('tab' + component.id);
                }
            });
        } catch {
        }
    }

    private getTemplateFunction(template: string | HTMLElement | Function): any {
        let templateFn: any = null;
        try {
            if (typeof template === 'string' && (template as string).indexOf('#') !== -1 && document.querySelectorAll(template).length) {
                templateFn = compile(this.sanitizeTemplateValue(
                    (document.querySelector(template) as HTMLElement).innerHTML.trim()
                ));
            } else if (typeof template === 'string') {
                templateFn = compile(this.sanitizeTemplateValue(template));
            } else {
                templateFn = compile(template as any);
            }
        } catch (e) {
            templateFn = compile(template as any);
        }
        return templateFn;
    }

    /**
     * @private
     */
    private sanitizeTemplateValue(value: string): string {
        if (this.enableHtmlSanitizer && typeof value === 'string') {
            try { return SanitizeHtmlHelper.sanitize(value); } catch (e) { /* swallow */ }
        }
        return value;
    }

    /**
     * @private
     */
    public destroy(): void {
        if (this.isReact || this.isAngular) {
            (this as any).clearTemplate();
        }
        this.destroyRendered();
        this.formState = { values: {}, errors: {} };
        this.expressionEngine = null;
        this.customValidationEngine = null;
        this.clearEngineCaches();
        this.clearPersistedTabSelections();
        this.consumerDependencyMap = new Map<string, Set<string>>();
        this.preservedFields = new Map<string, HTMLElement>();
        this.conditionalTriggerFieldIds = new Set<string>();
        super.destroy();
    }

    /**
     * @private
     */
    private clearEngineCaches(): void {
        if (this.expressionEngine) {
            try { this.expressionEngine.clearCache(); } catch (e) { /* swallow */ }
        }
        if (this.customValidationEngine) {
            const inner: any = (this.customValidationEngine as any).expressionEngine;
            if (inner && typeof inner.clearCache === 'function') {
                try { inner.clearCache(); } catch (e) { /* swallow */ }
            }
        }
    }
}

export default FormRenderer;
