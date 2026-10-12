import { L10n, createElement } from '@syncfusion/ej2-base';
import { Tab, TabItem } from '@syncfusion/ej2-navigations';
import {
    ComponentDefinition,
    PropertyGroup,
    PropertyValues
} from '../../types/component-properties';
import { FormNode, FormSchema } from '@syncfusion/ej2-form-renderer';
import {
    PropertyGroupRenderer,
    PropertyGroupRendererOptions
} from '../../utils/property-group-renderer';
import { ConditionsEditor } from '../../utils/conditions-editor';
import { MobileConditionsEditor } from '../../utils/mobile-conditions-editor';
import { FormSettingsPanel, FormSettingsModel, FormSettingsPanelOptions } from '../../utils/form-settings-panel';
import { extractAllDescendantIds } from '@syncfusion/ej2-form-renderer';

/** @private */
export type RightPaneMode = 'component' | 'formSettings';

/** @private */
interface VisibilityState {
    allowMultiple: boolean;
    savedButtonsGroups: any[] | null;
    columnsValue: number | null;
    displayFormat: string;
}

/** @private */
interface TabEntry {
    groupName: string;
    properties: PropertyDefinition[]; // not used at runtime, kept for clarity
    instances: Map<string, any>;
    tabItem: TabItem | null;
    contentHost: HTMLElement;
    isConditions: boolean;
}

/** @private */
export interface RightPaneOptions {
    l10n: L10n;
    mode?: 'Simple' | 'Developer';
    formSchema: FormSchema;
    configData: Record<string, ComponentDefinition>;
    formSettingsConfig: { groups: PropertyGroup[] };
    onSave: (values: PropertyValues | FormSettingsModel, key?: string) => void;
    onPropertyChanged?: (args: { field: string; property: string; value: any; name: string }) => void;
    onClose: () => void;
    host?: HTMLElement;
    parent?: HTMLElement;
    enableRtl?: boolean;
    locale?: string;
}

/** @private */
type PropertyDefinition = ComponentDefinition['groups'][number]['properties'][number];

/** @private */
export class RightPane {

    private host: HTMLElement;
    private props: RightPaneOptions;
    private l10n: L10n;
    private mode: 'Simple' | 'Developer' | undefined;
    private formSchema: FormSchema;
    private configData: Record<string, ComponentDefinition>;
    private formSettingsConfig: { groups: PropertyGroup[] };

    private currentField: FormNode | null;
    private currentFieldId: string | null;
    private paneMode: RightPaneMode;
    private propertyValues: PropertyValues;
    private visibility: VisibilityState;
    private ej2Instances: Map<string, any>;
    private docListeners: { target: EventTarget; event: string; handler: EventListener; opts?: any }[];
    private pendingTimers: number[];
    
    private headerEl: HTMLElement | null;
    private bodyEl: HTMLElement | null;
    private closeClickHandler: ((e: Event) => void) | null;

    private tab: Tab | null;
    private tabEntries: TabEntry[];
    private parentNode: HTMLElement;

    private conditionsEditor: ConditionsEditor | null;
    private formSettingsPanel: FormSettingsPanel | null;

    private destroyed: boolean;

    constructor(opts: RightPaneOptions) {
        this.props = opts;
        this.l10n = opts.l10n;
        this.mode = opts.mode;
        this.formSchema = opts.formSchema;
        this.configData = opts.configData;
        this.formSettingsConfig = opts.formSettingsConfig;

        this.host = opts.host || createElement('aside', { className: 'right-pane' });
        this.paneMode = 'component';
        this.parentNode = opts.parent;
        this.currentField = null;
        this.currentFieldId = null;
        this.propertyValues = {};
        this.visibility = {
            allowMultiple: false,
            savedButtonsGroups: null,
            columnsValue: null,
            displayFormat: 'Dropdown'
        };
        this.ej2Instances = new Map<string, any>();
        this.docListeners = [];
        this.pendingTimers = [];
        this.headerEl = null;
        this.bodyEl = null;
        this.closeClickHandler = null;
        this.tab = null;
        this.tabEntries = [];
        this.conditionsEditor = null;
        this.formSettingsPanel = null;
        this.destroyed = false;
    }

    /** @private */
    public get element(): HTMLElement {
        return this.host;
    }

    /** @private */
    public render(options?: { empty?: boolean }): void {
        if (this.destroyed) { return; }
        this.host.classList.add('right-pane');
        if (options && options.empty) {
            this.renderEmptyState();
            return;
        }
        const settings: FormSettingsModel = ((this.formSchema && (this.formSchema as any).settings) || {}) as FormSettingsModel;
        this.openFormSettings(settings);
    }

    /** @private */
    public showEmptyState(): void {
        if (this.destroyed) { return; }
        this.disposeAll();
        this.paneMode = 'component';
        this.currentField = null;
        this.currentFieldId = null;
        this.propertyValues = {};
        this.renderEmptyState();
    }

    /** @private */
    public openComponentEditor(component: FormNode, fieldId: string, forceRefresh: boolean = false): void {
        if (this.destroyed) { return; }
        if (!forceRefresh && this.paneMode === 'component' && this.currentFieldId === fieldId) { return; }
        this.disposeAll();
        this.paneMode = 'component';
        this.currentField = component;
        this.currentFieldId = fieldId;
        this.propertyValues = this.buildPropertyValues(component);
        if(component.type === 'button') {
            component.allowMultiple = this.visibility.allowMultiple;
            this.propertyValues.allowMultiple = this.visibility.allowMultiple;
        }
        if(component.type === 'table') {
            this.currentField.columns = this.visibility.columnsValue || 2;
            this.propertyValues.columns = this.visibility.columnsValue || 2;
        }
        this.renderComponentEditor();
    }

    /** @private */
    public openFormSettings(settings: FormSettingsModel): void {
        if (this.destroyed) { return; }
        this.disposeAll();
        this.paneMode = 'formSettings';
        this.currentField = null;
        this.currentFieldId = null;
        this.propertyValues = {};
        this.renderFormSettings(settings);
    }

    /** @private */
    public updateFormSchema(schema: FormSchema): void {
        if (this.destroyed || !schema) { return; }
        this.formSchema = schema;
    }

    /** @private */
    public close(): void {
        if (this.destroyed) { return; }
        this.disposeAll();
        this.host.innerHTML = '';
        this.paneMode = 'component';
        this.currentField = null;
        this.currentFieldId = null;
        this.propertyValues = {};
        this.headerEl = null;
        this.bodyEl = null;
        this.tab = null;
        this.tabEntries = [];
        if (this.props.onClose) {
            this.props.onClose();
        }
    }

    /** @private */
    public destroy(): void {
        if (this.destroyed) { return; }
        this.destroyed = true;
        this.close();
        this.host.innerHTML = '';
        this.host.className = 'right-pane right-pane-destroyed';
    }

    private renderEmptyState(): void {
        this.host.innerHTML = '';
        const empty: HTMLElement = createElement('div', {
            className: 'right-pane-empty',
            attrs: { 'role': 'region', 'aria-label': 'Field settings' }
        });
        const heading: HTMLElement = createElement('h3', {
            attrs: { 'id': 'field-settings-heading' }
        });
        heading.textContent = this.l10n.getConstant('fieldSettings') || 'Field settings';
        empty.appendChild(heading);
        const hint: HTMLElement = createElement('p', { className: 'right-pane-hint' });
        hint.textContent = this.l10n.getConstant('selectAField') || 'Select a field to edit its properties.';
        empty.appendChild(hint);
        this.host.appendChild(empty);
    }

    private renderHeader(headingKey: string, ariaLabel: string): void {
        this.host.innerHTML = '';
        this.headerEl = createElement('div', { className: 'sidebar-header' });
        const heading: HTMLElement = createElement('h3', {
            attrs: { 'id': `${ariaLabel}-heading` }
        });
        heading.textContent = this.l10n.getConstant(headingKey) || headingKey;
        this.headerEl.appendChild(heading);
        const closeBtn: HTMLElement = createElement('button', {
            attrs: { 'type': 'button', 'aria-label': 'Close panel', 'title': 'Close (Esc)' },
            className: 'close-btn'
        });
        closeBtn.textContent = '✕';
        this.closeClickHandler = () => this.close();
        closeBtn.addEventListener('click', this.closeClickHandler);
        this.headerEl.appendChild(closeBtn);
        this.host.appendChild(this.headerEl);

        this.bodyEl = createElement('div', {
            className: 'rightpane-property-content single-view',
            attrs: { 'role': 'region', 'aria-labelledby': `${ariaLabel}-heading` }
        });
        this.host.appendChild(this.bodyEl);
    }

    private renderComponentEditor(): void {
        if (!this.currentField) { return; }
        const componentType: string = this.currentField.type || '';
        const componentDefinition: ComponentDefinition | undefined = this.configData[componentType as string];
        if (!componentDefinition) {
            this.renderHeader('error', 'error');
            const error: HTMLElement = createElement('p', {
                attrs: { 'role': 'alert' },
                styles: 'color: var(--sf-error-color, red); padding: 1rem;'
            });
            error.textContent = `Component definition not found for: ${componentType}`;
            this.bodyEl.appendChild(error);
            return;
        }

        this.renderHeader('fieldSettings', 'field-settings');

        let groupsToRender: PropertyGroup[] = componentDefinition.groups.slice();
        if (componentType === 'button') {
            groupsToRender = this.getFilteredGroups(groupsToRender, this.visibility.allowMultiple);
        } else if (componentType === 'lookup') {
            groupsToRender = this.getFilteredLookupGroups(groupsToRender, this.visibility.displayFormat);
        }
        groupsToRender = this.applyModeFiltering(groupsToRender);
        groupsToRender = this.applyVisibilityFiltering(groupsToRender);

        const propertiesSection: HTMLElement = createElement('div', {
            className: 'properties-section',
            attrs: { 'aria-label': this.l10n.getConstant('fieldSettings') || 'Field Settings' }
        });
        this.bodyEl.appendChild(propertiesSection);
        const tabsWrapper: HTMLElement = createElement('div', { className: 'property-tabs-wrapper' });
        propertiesSection.appendChild(tabsWrapper);
        const tabsHost: HTMLElement = createElement('div', { className: 'property-tabs' });
        tabsWrapper.appendChild(tabsHost);

        const tabItems: any[] = groupsToRender.map((group: PropertyGroup) => {
            return {
                header: { text: this.l10n.getConstant(group.name.toLowerCase()) || group.name },
                content: ''
            };
        });

        this.tab = new Tab({
            items: tabItems,
            enableRtl: this.props.enableRtl,
            loadOn: 'Init',
            animation: { previous: { effect: 'None' as any }, next: { effect: 'None' as any } },
            created: () => this.populateTabContents(groupsToRender)
        });
        this.tab.appendTo(tabsHost);
    }

    private populateTabContents(groups: PropertyGroup[]): void {
        if (!this.tab || !this.bodyEl) { return; }
        groups.forEach((group: PropertyGroup, index: number) => {
            const contentHost: HTMLElement = createElement('div');
            const contentWrapper: HTMLElement | null =
                this.bodyEl.querySelector('.e-content');
            const pane: HTMLElement | null = contentWrapper
                ? (contentWrapper.children[index as number] as HTMLElement)
                : null;
            if (pane) {
                pane.appendChild(contentHost);
            } else {
                this.bodyEl.appendChild(contentHost);
            }

            const isConditions: boolean = group.name === 'Conditions';

            if (isConditions) {
                const conditionsProp: PropertyDefinition | undefined = group.properties.find((p: PropertyDefinition) => p.key === 'conditions');
                const supportedConditions: string[] = conditionsProp && (conditionsProp as any).supportedConditions ||
                    ['visibleWhen', 'hideWhen', 'readOnlyWhen', 'disabledWhen', 'requiredWhen', 'setValueWhen'];
                const conditionsEditorOptions = {
                    host: contentHost,
                    enableRtl: this.props.enableRtl,
                    parentHost: this.parentNode,
                    getComponentFields: () => this.extractAllFormFieldNames(this.formSchema.components),
                    componentForEdit: this.currentField || undefined,
                    excludeFieldId: this.currentFieldId || undefined,
                    excludeChildIds: extractAllDescendantIds(this.currentField as any),
                    existingConditions: this.currentField ? (this.currentField as any).conditions : undefined,
                    onChange: (conditions: any) => this.handleConditionsChange(conditions),
                    supportedConditions: supportedConditions as any,
                    builderMode: this.mode,
                    l10n: this.l10n,
                    formSchema: this.formSchema
                };
                const isMobileOrTablet: boolean = this.parentNode.getBoundingClientRect().width > 0
                    && this.parentNode.getBoundingClientRect().width <= 1024;
                this.conditionsEditor = isMobileOrTablet
                    ? new MobileConditionsEditor(conditionsEditorOptions)
                    : new ConditionsEditor(conditionsEditorOptions);
                this.conditionsEditor.render();
                this.tabEntries.push({
                    groupName: group.name,
                    properties: group.properties,
                    instances: new Map<string, any>(),
                    tabItem: null,
                    contentHost: contentHost,
                    isConditions: true
                });
            } else {
                const allFields: FormNode[] = this.extractAllFormFieldNames(this.formSchema.components);
                const initialValues: PropertyValues = { ...this.propertyValues, availableFields: allFields };
                const rendererOpts: PropertyGroupRendererOptions = {
                    groupName: group.name,
                    properties: group.properties,
                    enableRtl: this.props.enableRtl,
                    host: contentHost,
                    existingValues: this.currentField as any,
                    initialValues: initialValues,
                    onChange: (key: string, value: any) => this.handlePropertyChange(key, value),
                    l10n: this.l10n,
                    locale: this.props.locale,
                    mode: this.mode,
                    formSchema: this.formSchema,
                    availableFields: allFields
                };
                const instances: Map<string, any> = PropertyGroupRenderer.render(rendererOpts);
                this.tabEntries.push({
                    groupName: group.name,
                    properties: group.properties,
                    instances: instances,
                    tabItem: null,
                    contentHost: contentHost,
                    isConditions: false
                });
            }
        });
        this.applyPendingDefaultsFromConfig();
    }

    /**
     * After the component editor renders, if the field's `defaultValue` is
     * empty/undefined and the config's `default` for it is set, fire a single
     * onChange so the main section reflects runtime updates made through
     * `getProperty(type, key).default = ...`. Only the `defaultValue` key is
     * synced — other properties keep their original (un-dirty) state so the
     * filter in property-mapping continues to drop them when they equal the
     * config default.
     * @private
     */
    private applyPendingDefaultsFromConfig(): void {
        if (!this.currentField || !this.configData) { return; }
        const componentDefinition: ComponentDefinition | undefined = this.configData[this.currentField.type];
        if (!componentDefinition || !Array.isArray(componentDefinition.groups)) { return; }
        for (const group of componentDefinition.groups) {
            if (!group || !Array.isArray(group.properties)) { continue; }
            for (const property of group.properties) {
                if (!property || property.key == 'defaultValue') { continue; }
                const currentVal: any = (this.currentField as any)[property.key];
                const isEmpty: boolean = (currentVal === undefined || currentVal === null || currentVal === '');
                const hasDefault: boolean = (property.default !== undefined && property.default !== null && property.default !== '');
                if (isEmpty && hasDefault) {
                    this.handlePropertyChange(property.key, property.default);
                }
            }
        }
    }

    private renderFormSettings(settings: FormSettingsModel): void {
        this.host.innerHTML = '';
        this.formSettingsPanel = new FormSettingsPanel({
            host: this.host,
            settings: settings,
            formSettingsConfig: this.formSettingsConfig,
            l10n: this.l10n,
            locale: this.props.l10n && (this.l10n as any).locale ? (this.l10n as any).locale : 'en-US',
            mode: this.mode,
            formSchema: this.formSchema,
            onSave: (values: FormSettingsModel, key?: string) => {
                if (this.props.onSave) {
                    this.props.onSave(values as any, key);
                }
            }
        });
        this.formSettingsPanel.render();
    }

    private handlePropertyChange(key: string, value: any): void {
        if(key === 'expressionValue' && value === '') {
            return;
        }
        if(this.propertyValues[key] === value) {
            return;
        }
        this.propertyValues = { ...this.propertyValues, [key]: value };

        if (key === 'allowMultiple' && this.currentField && this.currentField.type === 'button') {
            const prev: boolean = this.visibility.allowMultiple;
            this.visibility.allowMultiple = !!value;
            if (!value) {
                this.visibility.savedButtonsGroups = this.propertyValues.buttonsGroups;
                this.propertyValues = { ...this.propertyValues, buttonsGroups: [] };
            } else {
                this.propertyValues = { ...this.propertyValues, buttonsGroups: this.visibility.savedButtonsGroups || [] };
            }
            if (prev !== !!value) {
                this.refreshTabs();
            }
        }

        if (key === 'buttonsGroups' && this.currentField && this.currentField.type === 'button' && this.visibility.allowMultiple) {
            this.visibility.savedButtonsGroups = value;
        }

        if (key === 'columns' && this.currentField && this.currentField.type === 'table') {
            const prev: number | null = this.visibility.columnsValue;
            this.visibility.columnsValue = value;
            if (prev !== value) {
                this.refreshTabs();
            }
        }
        const componentDefinition = this.configData[this.currentField.type];

        let propertyDef: any = null;

        if (componentDefinition && componentDefinition.groups) {
            for (let i = 0; i < componentDefinition.groups.length; i++) {
                const properties = componentDefinition.groups[i as number].properties || [];

                propertyDef = properties.find(function (p: any) {
                    return p.key === key;
                });

                if (propertyDef) {
                    break;
                }
            }
        }

        const fieldLabel = propertyDef ? propertyDef.label : key;
        const label = this.propertyValues && this.propertyValues.label
            ? this.propertyValues.label
            : '';

        if (this.props.onPropertyChanged) {
            this.props.onPropertyChanged({
                field: label,
                property: fieldLabel,
                value,
                name: this.currentField.name
            });
        }

        if (this.props.onSave) {
            this.props.onSave(this.clonePropertyValues(), key);
        }
    }

    private handleConditionsChange(conditions: any): void {
        const normalized: any = (conditions && typeof conditions === 'object' && Object.keys(conditions).length > 0)
            ? conditions
            : undefined;
        this.propertyValues = { ...this.propertyValues, conditions: normalized };
        if (this.props.onSave) {
            this.props.onSave(this.clonePropertyValues(), 'conditions');
        }
    }

    private getFilteredGroups(groups: PropertyGroup[], allowMultiple: boolean): PropertyGroup[] {
        const visibleKeys: string[] = allowMultiple
            ? ['allowMultiple', 'name', 'buttonsGroups', 'gap', 'cssClass', 'width', 'position', 'size', 'conditions']
            : ['allowMultiple', 'name', 'buttonType', 'cssClass', 'disabled', 'iconCss', 'iconPosition', 'label', 'position', 'style', 'size', 'conditions'];
        return groups
            .map((g: PropertyGroup) => ({
                ...g,
                properties: g.properties.filter((p: PropertyDefinition) => visibleKeys.indexOf(p.key) >= 0)
            }))
            .filter((g: PropertyGroup) => g.properties.length > 0);
    }

    private getFilteredLookupGroups(groups: PropertyGroup[], displayFormat: string): PropertyGroup[] {
        const isRadioOrCheckbox: boolean = ['Radio', 'Checkbox', 'CheckboxGroup'].indexOf(displayFormat) >= 0;
        if (!isRadioOrCheckbox) {
            return groups;
        }
        const removeFromDisplay: string[] = ['placeholder', 'showClearButton', 'readOnly', 'enableVirtualization', 'floatLabelType', 'popupHeight', 'popupWidth'];
        const removeFromValidation: string[] = ['validateOn'];
        return groups
            .map((group: PropertyGroup) => {
                let filteredProps: PropertyDefinition[] = group.properties;
                if (group.name === 'Display') {
                    filteredProps = filteredProps.filter((p: PropertyDefinition) => removeFromDisplay.indexOf(p.key) < 0);
                } else if (group.name === 'Validation') {
                    filteredProps = filteredProps.filter((p: PropertyDefinition) => removeFromValidation.indexOf(p.key) < 0);
                } else if (group.name === 'Conditions') {
                    filteredProps = filteredProps.map((p: PropertyDefinition) => {
                        if (p.key === 'conditions') {
                            return { ...p, supportedConditions: ['visibleWhen', 'hideWhen', 'requiredWhen', 'setValueWhen', 'disabledWhen'] };
                        }
                        return p;
                    }) as PropertyDefinition[];
                }
                return { ...group, properties: filteredProps };
            })
            .filter((g: PropertyGroup) => g.properties.length > 0);
    }

    private applyModeFiltering(groups: PropertyGroup[]): PropertyGroup[] {
        if (this.mode !== 'Simple') { return groups; }
        return groups
            .map((g: PropertyGroup) => ({
                ...g,
                properties: g.properties.filter((p: PropertyDefinition) => {
                    return (p as any).mode !== 'developer' && (p as any).componentType !== 'developer';
                })
            }))
            .filter((g: PropertyGroup) => g.properties.length > 0);
    }

    private applyVisibilityFiltering(groups: PropertyGroup[]): PropertyGroup[] {
        return groups
            .map((g: PropertyGroup) => ({
                ...g,
                properties: g.properties.filter((p: PropertyDefinition) => p.visible !== false)
            }))
            .filter((g: PropertyGroup) => g.properties.length > 0);
    }

    private buildPropertyValues(component: FormNode): PropertyValues {
        const values: PropertyValues = {};
        const componentDefinition: ComponentDefinition | undefined = this.configData[component.type];
        if (!componentDefinition) { return values; }
        componentDefinition.groups.forEach((group: PropertyGroup) => {
            group.properties.forEach((property: PropertyDefinition) => {
                let value: any = property.default;
                if (group.name === 'Validation') {
                    value = (component as any)[property.key] !== undefined ? (component as any)[property.key] : property.default;
                } else if (group.name === 'Layout') {
                    const layoutVal: any = (component as any).layout ? ((component as any).layout)[property.key] : undefined;
                    value = layoutVal !== undefined ? layoutVal : ((component as any)[property.key] !== undefined ? (component as any)[property.key] : property.default);
                } else {
                    if ((component as any)[property.key] !== undefined) {
                        value = (component as any)[property.key];
                    } else if (property.key === 'value' && (component as any).defaultValue !== undefined) {
                        value = (component as any).defaultValue;
                    } else if (property.key === 'rows' && (component as any).textareaRows !== undefined) {
                        value = (component as any).textareaRows;
                    } else {
                        value = property.default;
                    }
                }
                values[property.key] = value;
            });
        });
        Object.keys(component).forEach((key: string) => {
            if (!(key in values)) {
                values[key as string] = (component as any)[key as string];
            }
        });
        return values;
    }

    private extractAllFormFieldNames(components: FormNode[]): FormNode[] {
        const fields: FormNode[] = [];
        const layoutTypes: string[] = ['panel', 'table', 'tabs', 'button', 'message'];
        const traverse: (comps: FormNode[]) => void = (comps: FormNode[]) => {
            for (const comp of comps) {
                if (layoutTypes.indexOf(comp.type) < 0) {
                    fields.push(comp);
                }
                if (comp.children && Array.isArray(comp.children)) {
                    traverse(comp.children);
                }
                if (comp.tableCells && Array.isArray(comp.tableCells)) {
                    comp.tableCells.forEach((row: FormNode[][]) => {
                        if (Array.isArray(row)) {
                            row.forEach((cell: FormNode[]) => {
                                if (Array.isArray(cell)) { traverse(cell); }
                            });
                        }
                    });
                }
                if (comp.tabItems && Array.isArray(comp.tabItems)) {
                    comp.tabItems.forEach((tabItem: any) => {
                        if (tabItem.content && Array.isArray(tabItem.content)) {
                            traverse(tabItem.content);
                        }
                    });
                }
            }
        };
        traverse(components);
        return fields;
    }

    private refreshTabs(): void {
        // Re-render the component editor with the new visibility state.
        if (this.currentField && this.currentFieldId) {
            const field: FormNode = this.currentField;
            const fieldId: string = this.currentFieldId;
            this.openComponentEditor(field, fieldId);
        }
    }

    private clonePropertyValues(): PropertyValues {
        return { ...this.propertyValues };
    }

    private disposeAll(): void {
        this.tabEntries.forEach((entry: TabEntry) => {
            PropertyGroupRenderer.destroy(entry.instances);
            if (entry.isConditions && this.conditionsEditor) {
                try { this.conditionsEditor.destroy(); } catch { /* ignore */ }
            }
        });
        this.tabEntries = [];
        this.conditionsEditor = null;

        if (this.tab) {
            try { this.tab.destroy(); } catch { /* ignore */ }
            this.tab = null;
        }

        if (this.formSettingsPanel) {
            try { this.formSettingsPanel.destroy(); } catch { /* ignore */ }
            this.formSettingsPanel = null;
        }

        this.docListeners.forEach(({ target, event, handler, opts }) => {
            target.removeEventListener(event, handler, opts);
        });
        this.docListeners = [];

        this.pendingTimers.forEach((id: number) => clearTimeout(id));
        this.pendingTimers = [];
    }
}
