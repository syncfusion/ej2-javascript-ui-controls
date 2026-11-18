import { L10n, createElement } from '@syncfusion/ej2-base';
import { Button, CheckBox } from '@syncfusion/ej2-buttons';
import { AutoComplete, DropDownList } from '@syncfusion/ej2-dropdowns';
import { NumericTextBox, TextBox } from '@syncfusion/ej2-inputs';
import { DatePicker } from '@syncfusion/ej2-calendars';
import { AccordionWrapper } from './custom-accordion';
import { CustomValidationEditor } from './custom-validation-editor';
import { ColumnExpressionEditor } from './expression-editor';
import { OptionFetcher, resolveOptions } from '@syncfusion/ej2-form-renderer';

/** @private */
export interface ColumnValidation {
    required?: boolean;
    min?: number;
    max?: number;
    pattern?: string;
    customMsg?: string;
}

/** @private */
export interface ColumnDefinition {
    field?: string;
    headerText?: string;
    type?: 'string' | 'number' | 'date' | 'boolean';
    width?: string;
    format?: string;
    validation?: ColumnValidation;
    validationRules?: { [key: string]: any };
    isPrimaryKey?: boolean;
    allowEditing?: boolean;
    expression?: string;
    customValidation?: any[];
    editType?: string;
    [key: string]: any;
}

/** @private */
export interface ColumnBuilderOptions {
    host: HTMLElement;
    columns?: ColumnDefinition[];
    l10n: L10n;
    locale?: string;
    onChange: (value: ColumnDefinition[]) => void;
    label?: string;
    isConditionData?: boolean;
    name?: string;
    fieldSuggestions?: string[];
    formSchema?: any;
    enableRtl?: boolean;
}

/** @private */
interface ColumnRow extends ColumnDefinition {
    id: number;
    index: number;
}

/** @private */
const COLUMN_TYPES: Array<{ text: string; value: string }> = [
    { text: 'string', value: 'string' },
    { text: 'number', value: 'number' },
    { text: 'date', value: 'date' },
    { text: 'boolean', value: 'boolean' }
];

/** @private */
export class ColumnBuilder {

    private host: HTMLElement;
    private columns: ColumnDefinition[];
    private l10n: L10n;
    private locale: string;
    private onChange: (value: ColumnDefinition[]) => void;
    private rows: ColumnRow[];
    private nextId: number;
    private expandedId: number | null;
    private label: string;
    private isConditionData: boolean;
    private accordion: AccordionWrapper | null;
    private accordionOpen: boolean;
    private controls: any[];
    private destroyed: boolean;
    private fieldSuggestions: string[];
    private formSchema: any;
    private name: string;
    private dataSourceKeys: string[];
    private props: ColumnBuilderOptions;

    constructor(opts: ColumnBuilderOptions) {
        this.props = opts;
        this.host = opts.host;
        this.columns = opts.columns ? opts.columns.slice() : [];
        this.l10n = opts.l10n;
        this.locale = opts.locale || 'en-US';
        this.onChange = opts.onChange;
        this.label = (opts.label && this.l10n && this.l10n.getConstant) ? (this.l10n.getConstant(opts.label as any) || opts.label) : (opts.label || 'Column');
        this.isConditionData = !!opts.isConditionData;
        this.rows = this.normalizeRows(this.columns);
        this.nextId = this.rows.reduce((max: number, row: ColumnRow) => Math.max(max, row.id + 1), 0);
        this.expandedId = null;
        this.accordion = null;
        this.accordionOpen = false;
        this.controls = [];
        this.destroyed = false;
        this.formSchema = opts.formSchema;
        this.name = opts.name;
        this.fieldSuggestions = (opts.fieldSuggestions || []).filter((value: string | undefined) => !!value);
    }

    /** @private */
    public render(): void {
        if (this.destroyed) {
            return;
        }

        const previousAccordionOpen: boolean = this.accordion ? this.accordion.getIsOpen() : this.accordionOpen;
        this.destroyControls();
        this.host.innerHTML = '';
        const componentForEdit = this.formSchema.components.find((comp: any) => comp.name === this.name);
        if (componentForEdit && componentForEdit.dataSource) {
            OptionFetcher.fetch(
                componentForEdit.dataSource,
                componentForEdit.id,
                {},
                this.formSchema.components
            ).then((res) => {
                if (res.id === componentForEdit.id && res.options.length > 0) {
                    const newDataSource = resolveOptions(
                        componentForEdit.dataSource,
                        res.options
                    );
                    this.dataSourceKeys = this.extractDataSourceKeys(
                        Array.isArray(newDataSource) ? newDataSource : []
                    );
                }
            });
        }

        const root: HTMLElement = createElement('div', {
            className: 'column-builder'
        });

        const list: HTMLElement = createElement('div', {
            className: 'column-list'
        });
        if (this.rows.length === 0) {
            list.style.display = 'none';
        }

        for (let i: number = 0; i < this.rows.length; i++) {
            const row: ColumnRow = this.rows[i as number];
            const item: HTMLElement = createElement('div', {
                className: 'column-item'
            });

            const header: HTMLElement = createElement('div', {
                className: 'column-header' + (this.isConditionData ? ' no-border-radius' : '')
            });

            const fieldLabel: HTMLElement = createElement('span', {
                className: 'column-field'
            });
            fieldLabel.textContent = row.headerText || row.field || ('Column ' + (row.index || i + 1));
            header.appendChild(fieldLabel);

            const actions: HTMLElement = createElement('div', {
                styles: 'display: flex; gap: 8px;'
            });

            const editButtonHost: HTMLElement = createElement('button', {
                className: 'e-btn e-flat',
                attrs: {
                    type: 'button',
                    title: this.getConstant('edit'),
                    'aria-label': this.getConstant('edit')
                }
            });
            const editButton: Button = new Button({
                enableRtl: this.props.enableRtl,
                iconCss: 'e-icons e-edit',
                cssClass: 'e-flat'
            });
            editButton.appendTo(editButtonHost);
            editButtonHost.onclick = () => {
                this.expandedId = this.expandedId === row.id ? null : row.id;
                this.render();
            };
            actions.appendChild(editButtonHost);
            this.controls.push(editButton);

            const deleteButtonHost: HTMLElement = createElement('button', {
                className: 'e-btn e-flat',
                attrs: {
                    type: 'button',
                    title: this.getConstant('delete'),
                    'aria-label': this.getConstant('delete')
                }
            });
            const deleteButton: Button = new Button({
                enableRtl: this.props.enableRtl,
                iconCss: 'e-icons e-trash',
                cssClass: 'e-flat'
            });
            deleteButton.appendTo(deleteButtonHost);
            deleteButtonHost.onclick = () => {
                this.handleDeleteRow(row.id);
            };
            actions.appendChild(deleteButtonHost);
            this.controls.push(deleteButton);

            header.appendChild(actions);
            item.appendChild(header);

            if (this.expandedId === row.id) {
                const panel: HTMLElement = createElement('div', {
                    className: this.isConditionData ? 'conditional-column' : 'right-sidebar-column'
                });

                if (!this.isConditionData) {
                    const panelHeader: HTMLElement = createElement('div', {
                        className: 'column-sidebar-header'
                    });
                    const heading: HTMLElement = createElement('h3');
                    heading.textContent = this.getConstant('columnSettings');
                    panelHeader.appendChild(heading);

                    const closeButton: HTMLButtonElement = createElement('button', {
                        className: 'close-btn',
                        attrs: {
                            type: 'button',
                            title: 'Close (Esc)',
                            'aria-label': this.getConstant('close')
                        }
                    }) as HTMLButtonElement;
                    closeButton.textContent = '✕';
                    closeButton.onclick = () => {
                        this.expandedId = null;
                        this.render();
                    };
                    panelHeader.appendChild(closeButton);
                    panel.appendChild(panelHeader);
                }

                const panelBody: HTMLElement = createElement('div', {
                    className: 'column-details'
                });
                panelBody.appendChild(this.createColumnEditor(row));
                panel.appendChild(panelBody);
                item.appendChild(panel);
            }

            list.appendChild(item);
        }

        root.appendChild(list);

        const addHost: HTMLElement = createElement('div', {
            styles: 'width: 100%;'
        });
        const addButtonHost: HTMLElement = createElement('button', {
            className: 'e-btn e-outline',
            attrs: {
                type: 'button',
                'aria-label': this.getConstant('addColumn')
            },
            styles: 'width: 100%;'
        });
        const addButton: Button = new Button({
            enableRtl: this.props.enableRtl,
            content: this.getConstant('addColumn'),
            cssClass: 'e-outline'
        });
        addButton.appendTo(addButtonHost);
        addButtonHost.onclick = () => this.handleAddRow();
        addHost.appendChild(addButtonHost);
        this.controls.push(addButton);
        root.appendChild(addHost);

        this.accordion = new AccordionWrapper({
            host: this.host,
            title: this.l10n.getConstant('columns') || this.label,
            content: root
        });
        this.accordion.render();
        this.accordionOpen = previousAccordionOpen;
        if (previousAccordionOpen) {
            this.accordion.setOpen(true);
        }
    }

    /** @private */
    public destroy(): void {
        if (this.destroyed) {
            return;
        }
        this.destroyed = true;
        this.destroyControls();
        if (this.accordion) {
            this.accordion.destroy();
            this.accordion = null;
        }
        this.accordionOpen = false;
        this.host.innerHTML = '';
    }

    private normalizeRows(columns: ColumnDefinition[]): ColumnRow[] {
        const normalized: ColumnRow[] = [];
        for (let i: number = 0; i < (columns || []).length; i++) {
            const column: ColumnDefinition = columns[i as number];
            normalized.push({
                id: i,
                index: i + 1,
                field: column.field || 'column_' + (i + 1),
                headerText: column.headerText || (column.field || 'Column ' + (i + 1)),
                type: column.type || 'string',
                width: column.width || '120',
                format: column.format || '',
                validation: column.validation,
                validationRules: column.validationRules || {},
                isPrimaryKey: !!column.isPrimaryKey,
                allowEditing: column.allowEditing !== undefined ? column.allowEditing : true,
                expression: column.expression || '',
                customValidation: column.customValidation || [],
                editType: column.editType || this.mapTypeToEditType(column.type || 'string'),
                ...column
            });
        }
        return normalized;
    }

    private mapTypeToEditType(type: string): string {
        switch (type) {
            case 'number':
                return 'numericedit';
            case 'date':
                return 'datepickeredit';
            case 'boolean':
                return 'booleanedit';
            default:
                return 'textbox';
        }
    }

    private getConstant(key: string): string {
        if (this.l10n && this.l10n.getConstant) {
            return this.l10n.getConstant(key as any) || key;
        }
        return key;
    }

    private extractDataSourceKeys(dataSource: any): string[] {
        if (Array.isArray(dataSource) && dataSource.length > 0) {
            return Object.keys(dataSource[0]);
        }
        return [];
    }

    private createColumnEditor(row: ColumnRow): HTMLElement {
        const content: HTMLElement = createElement('div', {
            styles: 'padding: 1rem !important; display: flex; flex-direction: column; gap: 16px;'
        });

        const basicLabel: HTMLElement = createElement('label', {
            className: 'property-label',
            styles: 'font-weight: 600; margin-bottom: 0.5rem; font-size: 14px;'
        });
        basicLabel.textContent = this.getConstant('basic');
        content.appendChild(basicLabel);

        const fieldWrap: HTMLElement = createElement('div', { className: 'e-fb-form-group' });
        const fieldLabel: HTMLElement = createElement('label');
        fieldLabel.textContent = this.getConstant('fieldName');
        fieldWrap.appendChild(fieldLabel);
        const fieldHost: HTMLElement = createElement('input', { attrs: { type: 'text' } });
        fieldWrap.appendChild(fieldHost);

        let fieldInput: TextBox | AutoComplete;
        const fieldSuggestions: any = this.dataSourceKeys && this.dataSourceKeys.length > 0 ? this.dataSourceKeys.map(key => ({ text: key, value: key })) : undefined;
        if (fieldSuggestions && fieldSuggestions.length > 0) {
            fieldInput = new AutoComplete({
                enableRtl: this.props.enableRtl,
                dataSource: fieldSuggestions,
                value: row.field || '',
                placeholder: this.getConstant('fieldName'),
                allowCustom: true,
                change: (args: any) => this.updateRow(row.id, { field: args.value || '' })
            });
        } else {
            fieldInput = new TextBox({
                enableRtl: this.props.enableRtl,
                value: row.field || '',
                cssClass: 'e-textbox',
                placeholder: this.getConstant('fieldName'),
                change: (args: any) => this.updateRow(row.id, { field: args.value || '' })
            });
        }

        fieldInput.appendTo(fieldHost);
        this.controls.push(fieldInput);
        content.appendChild(fieldWrap);

        const headerWrap: HTMLElement = createElement('div', { className: 'e-fb-form-group' });
        const headerLabel: HTMLElement = createElement('label');
        headerLabel.textContent = this.getConstant('headerText');
        headerLabel.style.marginTop = '0.5rem';
        headerWrap.appendChild(headerLabel);
        const headerHost: HTMLElement = createElement('input', { attrs: { type: 'text' } });
        headerWrap.appendChild(headerHost);
        const headerInput: TextBox = new TextBox({
            enableRtl: this.props.enableRtl,
            value: row.headerText || '',
            cssClass: 'e-textbox',
            placeholder: this.getConstant('columnHeaderDisplay'),
            change: (args: any) => this.updateRow(row.id, { headerText: args.value || '' })
        });
        headerInput.appendTo(headerHost);
        this.controls.push(headerInput);
        content.appendChild(headerWrap);

        const typeWrap: HTMLElement = createElement('div', { className: 'e-fb-form-group' });
        const typeLabel: HTMLElement = createElement('label');
        typeLabel.textContent = this.getConstant('type');
        typeWrap.appendChild(typeLabel);
        const typeHost: HTMLElement = createElement('input', { attrs: { type: 'text' } });
        typeWrap.appendChild(typeHost);
        const typeDropDown: DropDownList = new DropDownList({
            enableRtl: this.props.enableRtl,
            dataSource: COLUMN_TYPES,
            fields: { text: 'text', value: 'value' },
            value: row.type || 'string',
            cssClass: 'e-textbox',
            change: (args: any) => {
                const nextType: string = args.value || 'string';
                this.updateRow(row.id, {
                    type: nextType,
                    editType: this.mapTypeToEditType(nextType),
                    validationRules: {}
                });
                this.render();
            }
        });
        typeDropDown.appendTo(typeHost);
        this.controls.push(typeDropDown);
        content.appendChild(typeWrap);

        const widthWrap: HTMLElement = createElement('div', { className: 'e-fb-form-group' });
        const widthLabel: HTMLElement = createElement('label');
        widthLabel.textContent = this.getConstant('width');
        widthWrap.appendChild(widthLabel);
        const widthHost: HTMLElement = createElement('input', { attrs: { type: 'text' } });
        widthWrap.appendChild(widthHost);
        const widthInput: TextBox = new TextBox({
            enableRtl: this.props.enableRtl,
            value: row.width || '120',
            cssClass: 'e-textbox',
            placeholder: this.getConstant('columnWidthPlaceholder'),
            change: (args: any) => this.updateRow(row.id, { width: args.value || '120' })
        });
        widthInput.appendTo(widthHost);
        this.controls.push(widthInput);
        content.appendChild(widthWrap);

        const formatWrap: HTMLElement = createElement('div', { className: 'e-fb-form-group' });
        const formatLabel: HTMLElement = createElement('label');
        formatLabel.textContent = this.getConstant('format');
        formatWrap.appendChild(formatLabel);
        const formatHost: HTMLElement = createElement('input', { attrs: { type: 'text' } });
        formatWrap.appendChild(formatHost);
        const formatInput: TextBox = new TextBox({
            enableRtl: this.props.enableRtl,
            value: row.format || '',
            cssClass: 'e-textbox',
            change: (args: any) => this.updateRow(row.id, { format: args.value || '' })
        });
        formatInput.appendTo(formatHost);
        this.controls.push(formatInput);
        content.appendChild(formatWrap);

        const divider1: HTMLElement = createElement('div', {
            styles: 'height: 0.5px; border-bottom: 0.5px solid rgb(var(--sf-color-line-color));'
        });
        content.appendChild(divider1);

        const behaviorLabel: HTMLElement = createElement('label', {
            className: 'property-label',
            styles: 'font-weight: 600; margin-bottom: 0.5rem; font-size: 14px; display: block;'
        });
        behaviorLabel.textContent = this.getConstant('behaviour');
        content.appendChild(behaviorLabel);

        const primaryWrap: HTMLElement = createElement('div', { className: 'e-fb-form-group checkbox-group' });
        const primaryLabel: HTMLElement = createElement('label');
        const primaryHost: HTMLElement = createElement('div');
        primaryLabel.appendChild(primaryHost);
        const hasOtherPrimaryKey: boolean = this.hasOtherPrimaryKey(row.id);
        const primaryCheckbox: CheckBox = new CheckBox({
            enableRtl: this.props.enableRtl,
            label: this.getConstant('primaryKey') + (!row.isPrimaryKey && hasOtherPrimaryKey ? ' (' + this.getConstant('anotherPrimaryKeySet') + ')' : ''),
            checked: !!row.isPrimaryKey,
            disabled: !row.isPrimaryKey && hasOtherPrimaryKey,
            change: (args: any) => this.handlePrimaryKey(row.id, !!args.checked)
        });
        primaryCheckbox.appendTo(primaryHost);
        this.controls.push(primaryCheckbox);
        primaryWrap.appendChild(primaryLabel);
        content.appendChild(primaryWrap);

        const allowWrap: HTMLElement = createElement('div', { className: 'e-fb-form-group checkbox-group' });
        const allowLabel: HTMLElement = createElement('label');
        const allowHost: HTMLElement = createElement('div');
        allowLabel.appendChild(allowHost);
        const allowCheckbox: CheckBox = new CheckBox({
            enableRtl: this.props.enableRtl,
            label: this.getConstant('allowEditing') || 'Allow Editing',
            checked: row.allowEditing !== false,
            change: (args: any) => this.updateRow(row.id, { allowEditing: !!args.checked })
        });
        allowCheckbox.appendTo(allowHost);
        this.controls.push(allowCheckbox);
        allowWrap.appendChild(allowLabel);
        content.appendChild(allowWrap);

        const divider2: HTMLElement = createElement('div', {
            styles: 'height: 0.5px; border-bottom: 0.5px solid rgb(var(--sf-color-line-color));'
        });
        content.appendChild(divider2);

        const validationTitle: HTMLElement = createElement('label', {
            className: 'property-label',
            styles: 'font-weight: 600; margin-bottom: 0.5rem; font-size: 14px; display: block;'
        });
        validationTitle.textContent = this.getConstant('validationRulesFor');
        content.appendChild(validationTitle);

        const requiredWrap: HTMLElement = createElement('div', { className: 'e-fb-form-group checkbox-group' });
        const requiredLabel: HTMLElement = createElement('label');
        const requiredHost: HTMLElement = createElement('div');
        requiredLabel.appendChild(requiredHost);
        const requiredCheckbox: CheckBox = new CheckBox({
            enableRtl: this.props.enableRtl,
            label: this.getConstant('required'),
            checked: !!(row.validationRules && row.validationRules.required),
            change: (args: any) => {
                const value: any = row.validationRules || {};
                value.required = args.checked ? true : undefined;
                this.updateRow(row.id, { validationRules: value });
            }
        });
        requiredCheckbox.appendTo(requiredHost);
        this.controls.push(requiredCheckbox);
        requiredWrap.appendChild(requiredLabel);
        content.appendChild(requiredWrap);

        if (row.type === 'string') {
            content.appendChild(this.renderNumericRule(row, 'minLength', this.getConstant('minLength'), 'minimumCharacters'));
            content.appendChild(this.renderNumericRule(row, 'maxLength', this.getConstant('maxLength'), 'maximumCharacters'));
        }

        if (row.type === 'number') {
            content.appendChild(this.renderNumericRule(row, 'min', this.getConstant('minValue'), 'minimumValue'));
            content.appendChild(this.renderNumericRule(row, 'max', this.getConstant('maxValue'), 'maximumValue'));
        }

        if (row.type === 'date') {
            content.appendChild(this.renderDateRule(row, 'min', this.getConstant('minDate')));
            content.appendChild(this.renderDateRule(row, 'max', this.getConstant('maxDate')));
        }

        const validationDivider: HTMLElement = createElement('div', {
            styles: 'height: 0.5px; border-bottom: 0.5px solid rgb(var(--sf-color-line-color));'
        });
        content.appendChild(validationDivider);

        const expressionWrap: HTMLElement = createElement('div', {
            className: 'e-fb-form-group'
        });
        const expressionHost: HTMLElement = createElement('div');
        expressionWrap.appendChild(expressionHost);
        const availableFields: string[] = this.fieldSuggestions.concat(
            this.rows.map((column: ColumnRow) => column.field || '')
        ).filter((field: string, index: number, fields: string[]) => field && fields.indexOf(field) === index);
        const expressionEditor: ColumnExpressionEditor = new ColumnExpressionEditor({
            host: expressionHost,
            expression: row.expression || '',
            availableFields: availableFields,
            label: this.getConstant('expression'),
            description: this.getConstant('expressionDesc'),
            l10n: this.l10n,
            onExpressionChange: (expression: string) => this.updateRow(row.id, { expression: expression })
        });
        expressionEditor.render();
        this.controls.push(expressionEditor);
        content.appendChild(expressionWrap);

        const customValidationWrap: HTMLElement = createElement('div', {
            className: 'e-fb-form-group'
        });
        const customValidationHost: HTMLElement = createElement('div', {
            className: 'custom-validation-section'
        });
        const customValidationEditor: CustomValidationEditor = new CustomValidationEditor(customValidationHost, {
            componentFields: this.rows.map((r: ColumnRow) => ({
                id: '' + r.id,
                name: r.field,
                type: r.type || 'string',
                label: r.headerText
            })),
            enableRtl: this.props.enableRtl,
            excludeFieldId: row.field,
            existingRules: row.customValidation || [],
            values: { label: 'customValidation' },
            l10n: this.l10n,
            onChange: (rules: any[]) => this.updateRow(row.id, { customValidation: rules })
        });
        customValidationEditor.render();
        customValidationWrap.appendChild(customValidationHost);
        content.appendChild(customValidationWrap);

        return content;
    }

    private renderNumericRule(row: ColumnRow, key: string, labelText: string, placeholderKey: string): HTMLElement {
        const group: HTMLElement = createElement('div', { className: 'e-fb-form-group' });
        const label: HTMLElement = createElement('label');
        label.textContent = labelText;
        group.appendChild(label);
        const host: HTMLElement = createElement('input', { attrs: { type: 'text' } });
        group.appendChild(host);
        const numeric: NumericTextBox = new NumericTextBox({
            enableRtl: this.props.enableRtl,
            value: this.resolveNumericValue(row, key),
            locale: this.locale,
            placeholder: this.getConstant(placeholderKey),
            cssClass: 'e-textbox',
            change: (args: any) => this.updateValidationRule(row.id, key, args.value)
        });
        numeric.appendTo(host);
        this.controls.push(numeric);
        return group;
    }

    private renderDateRule(row: ColumnRow, key: string, labelText: string): HTMLElement {
        const group: HTMLElement = createElement('div', { className: 'e-fb-form-group' });
        const label: HTMLElement = createElement('label');
        label.textContent = labelText;
        group.appendChild(label);
        const host: HTMLElement = createElement('input', { attrs: { type: 'text' } });
        group.appendChild(host);
        const picker: DatePicker = new DatePicker({
            enableRtl: this.props.enableRtl,
            locale: this.locale,
            value: this.resolveDateValue(row, key),
            cssClass: 'e-textbox',
            change: (args: any) => {
                const value: any = args.value;
                this.updateValidationRule(row.id, key, value ? value.toISOString().slice(0, 10) : undefined);
            }
        });
        picker.appendTo(host);
        this.controls.push(picker);
        return group;
    }

    private resolveNumericValue(row: ColumnRow, key: string): number | undefined {
        const rules: any = row.validationRules || {};
        const value: any = rules[key as string];
        return value !== undefined && value !== null ? value : undefined;
    }

    private resolveDateValue(row: ColumnRow, key: string): Date | undefined {
        const rules: any = row.validationRules || {};
        const value: any = rules[key as string];
        if (value) {
            return new Date(value);
        }
        return undefined;
    }

    private handleAddRow(): void {
        const newRow: ColumnRow = {
            id: this.nextId++,
            index: this.rows.length + 1,
            field: 'column_' + Date.now(),
            headerText: this.getConstant('column') + ' ' + (this.rows.length + 1),
            type: 'string',
            width: '120',
            format: '',
            validation: undefined,
            validationRules: {},
            isPrimaryKey: false,
            allowEditing: true,
            expression: '',
            customValidation: [],
            editType: 'textbox'
        };
        this.rows.push(newRow);
        this.emitRows();
        this.render();
    }

    private handleDeleteRow(id: number): void {
        this.rows = this.rows.filter((row: ColumnRow) => row.id !== id).map((row: ColumnRow, index: number) => {
            row.index = index + 1;
            return row;
        });
        this.emitRows();
        this.render();
    }

    private updateRow(id: number, patch: any): void {
        this.rows = this.rows.map((row: ColumnRow) => {
            if (row.id === id) {
                return { ...row, ...patch };
            }
            return row;
        });
        this.emitRows();
    }

    private updateValidationRule(id: number, key: string, value: any): void {
        this.rows = this.rows.map((row: ColumnRow) => {
            if (row.id === id) {
                const nextRules: any = { ...(row.validationRules || {}) };
                if (value === undefined || value === '' || value === null) {
                    delete nextRules[key as string];
                } else {
                    nextRules[key as string] = value;
                }
                return { ...row, validationRules: nextRules };
            }
            return row;
        });
        this.emitRows();
    }

    private handlePrimaryKey(id: number, checked: boolean): void {
        this.rows = this.rows.map((row: ColumnRow) => {
            if (row.id === id) {
                return { ...row, isPrimaryKey: checked };
            }
            if (checked) {
                return { ...row, isPrimaryKey: false };
            }
            return row;
        });
        this.emitRows();
    }

    private hasOtherPrimaryKey(currentId: number): boolean {
        return this.rows.some((row: ColumnRow) => row.id !== currentId && row.isPrimaryKey === true);
    }

    private emitRows(): void {
        const list: ColumnDefinition[] = this.rows.map((row: ColumnRow) => {
            const output: any = { ...row };
            delete output.id;
            delete output.index;
            return output;
        });
        this.columns = list.slice();
        this.onChange(list.slice());
    }

    private destroyControls(): void {
        if (this.controls && this.controls.length) {
            for (let i: number = 0; i < this.controls.length; i++) {
                const control: any = this.controls[i as number];
                if (control && typeof control.destroy === 'function') {
                    try {
                        control.destroy();
                    } catch (e) {
                        // best-effort cleanup
                    }
                }
            }
        }
        this.controls = [];
    }
}
