import { L10n, createElement, Internationalization } from '@syncfusion/ej2-base';
import { NumericTextBox } from '@syncfusion/ej2-inputs';
import { DatePicker, TimePicker } from '@syncfusion/ej2-calendars';
import { CheckBox, Button } from '@syncfusion/ej2-buttons';
import { DropDownList } from '@syncfusion/ej2-dropdowns';

/** @private */
export interface MinMaxRangeData {
    enabled: boolean;
    minMode?: 'value' | 'field';
    minValue?: number | string | { field: string };
    maxMode?: 'value' | 'field';
    maxValue?: number | string | { field: string };
}

/** @private */
export interface MinMaxValueEditorOptions {
    host: HTMLElement;
    label: string;
    initialValue?: MinMaxRangeData[] | any[];
    editorMode?: 'date' | 'number' | 'time';
    l10n?: L10n;
    locale?: string;
    onChange: (value: MinMaxRangeData[]) => void;
    disabled?: boolean;
    currentFieldId?: string;
    enableRtl?: boolean;
    builderMode?: 'Simple' | 'Developer';
    availableFields?: Array<{ id: string; name: string; type: 'number' | 'date' | 'time' }>;
}

/** @private */
export class MinMaxValueEditor {
    private host: HTMLElement;
    private label: string;
    private initialValue: MinMaxRangeData[];
    private editorMode: 'date' | 'number' | 'time';
    private l10n: L10n | undefined;
    private locale: string;
    private onChange: (value: MinMaxRangeData[]) => void;
    private disabled: boolean;
    private currentFieldId: string | undefined;
    private builderMode: 'Simple' | 'Developer' | undefined;
    private availableFields: Array<{ id: string; name: string; type: 'number' | 'date' | 'time' }>;
    private state: { useFieldMode: boolean; ranges: MinMaxRangeData[] };
    private controls: any[];
    private intl: Internationalization;
    private props: MinMaxValueEditorOptions;
    constructor(opts: MinMaxValueEditorOptions) {
        this.host = opts.host;
        this.props = opts;
        this.label = opts.label || 'Range';
        this.initialValue = this.normalizeRanges(opts.initialValue || []);
        this.editorMode = opts.editorMode || 'number';
        this.l10n = opts.l10n;
        this.locale = opts.locale || 'en-US';
        this.onChange = opts.onChange;
        this.disabled = !!opts.disabled;
        this.currentFieldId = opts.currentFieldId;
        this.builderMode = opts.builderMode;
        this.availableFields = this.filterAvailableFields(opts.availableFields || []);
        this.state = this.getInitialState(this.initialValue);
        this.controls = [];
        this.intl = new Internationalization();
    }

    /** @private */
    public render(): void {
        this.destroyControls();
        this.host.innerHTML = '';

        const root: HTMLElement = createElement('div', {
            className: 'minmax-editor',
            attrs: { role: 'group', 'aria-label': this.label }
        });
        const noAvailableFields: boolean = !this.availableFields || this.availableFields.length === 0;

        if (this.builderMode === 'Developer') {
            const toggleSection: HTMLElement = createElement('div', { className: 'minmax-toggle-section' });
            const toggleHost: HTMLElement = createElement('div');
            toggleSection.appendChild(toggleHost);
            const checkboxInput: HTMLElement = createElement('input', {
                attrs: { type: 'checkbox', 'aria-label': this.getConstant('useFieldValue') }
            });
            if (this.disabled || noAvailableFields) {
                checkboxInput.setAttribute('disabled', 'disabled');
                checkboxInput.setAttribute('aria-disabled', 'true');
            }
            toggleHost.appendChild(checkboxInput);
            const checkbox: CheckBox = new CheckBox({
                enableRtl: this.props.enableRtl,
                label: this.getConstant('useFieldValue'),
                checked: this.state.useFieldMode,
                cssClass: 'e-small',
                locale: this.locale,
                disabled: noAvailableFields,
                change: (e: any) => this.handleToggle(e.checked)
            });
            checkbox.appendTo(checkboxInput);
            this.controls.push(checkbox);
            root.appendChild(toggleSection);
        }

        if (!this.state.useFieldMode) {
            const row: HTMLElement = createElement('div', { className: 'minmax-inputs-row' });
            row.appendChild(this.buildMinMaxValueGroup('min'));
            row.appendChild(this.buildMinMaxValueGroup('max'));
            root.appendChild(row);
        } else {
            for (let index = 0; index < this.state.ranges.length; index++) {
                const rangeRow: HTMLElement = createElement('div', {
                    className: 'minmax-inputs-row',
                    attrs: { style: 'margin-bottom: 0.75rem;' }
                });

                const minGroup: HTMLElement = createElement('div', { className: 'minmax-input-group' });
                const minLabel: HTMLElement = createElement('label', { className: 'minmax-input-label' });
                minLabel.textContent = this.getConstant('minValue');
                const minHost: HTMLElement = createElement('div');
                const minInput: HTMLElement = createElement('input', { id: 'min-field-' + index });
                minHost.appendChild(minInput);
                const minDd: DropDownList = new DropDownList({
                    enableRtl: this.props.enableRtl,
                    dataSource: this.dropdownDataSource(),
                    fields: { text: 'text', value: 'value' },
                    value: this.getMinFieldId(index),
                    width: '100px',
                    popupWidth: '200px',
                    locale: this.locale,
                    cssClass: 'minmax-dropdown',
                    change: (e: any) => this.handleMinFieldChange(index, e.value),
                    htmlAttributes: {
                        'aria-label': 'min-field-label-' + index,
                        disabled: this.disabled ? 'true' : 'false'
                    }
                });
                minDd.appendTo(minInput);
                this.controls.push(minDd);
                minGroup.appendChild(minLabel);
                minGroup.appendChild(minHost);

                const maxGroup: HTMLElement = createElement('div', { className: 'minmax-input-group' });
                const maxLabel: HTMLElement = createElement('label', { className: 'minmax-input-label' });
                maxLabel.textContent = this.getConstant('maxValue');
                const maxHost: HTMLElement = createElement('div');
                const maxInput: HTMLElement = createElement('input', { id: 'max-field-' + index });
                maxHost.appendChild(maxInput);
                const maxDd: DropDownList = new DropDownList({
                    enableRtl: this.props.enableRtl,
                    dataSource: this.dropdownDataSource(),
                    fields: { text: 'text', value: 'value' },
                    value: this.getMaxFieldId(index),
                    width: '100px',
                    locale: this.locale,
                    popupWidth: '200px',
                    cssClass: 'minmax-dropdown',
                    change: (e: any) => this.handleMaxFieldChange(index, e.value),
                    htmlAttributes: {
                        'aria-label': 'max-field-label-' + index,
                        disabled: this.disabled ? 'true' : 'false'
                    }
                });
                maxDd.appendTo(maxInput);
                this.controls.push(maxDd);
                maxGroup.appendChild(maxLabel);
                maxGroup.appendChild(maxHost);

                const deleteGroup: HTMLElement = createElement('div', { className: 'minmax-delete-group' });
                const deleteHost: HTMLElement = createElement('button', {
                    className: 'e-btn e-outlined',
                    attrs: { type: 'button', 'aria-label': this.getConstant('delete') + ' ' + this.getConstant('addRange') + ' ' + (index + 1), title: 'Delete range' }
                });
                deleteHost.className = 'e-btn e-outlined';
                deleteHost.setAttribute('type', 'button');
                deleteHost.setAttribute('aria-label', this.getConstant('delete') + ' ' + this.getConstant('addRange') + ' ' + (index + 1));
                deleteHost.setAttribute('title', 'Delete range');
                deleteHost.innerHTML = '<span class="e-icons e-trash"></span>';
                deleteHost.onclick = () => this.handleDelete(index);
                deleteGroup.appendChild(deleteHost);

                rangeRow.appendChild(minGroup);
                rangeRow.appendChild(maxGroup);
                rangeRow.appendChild(deleteGroup);
                root.appendChild(rangeRow);
            }

            const addSection: HTMLElement = createElement('div', { className: 'minmax-add-range-section' });
            const addHost: HTMLElement = createElement('button', {
                className: 'minmax-add-range-btn',
                attrs: { type: 'button', 'aria-label': this.getConstant('addRange') }
            });
            const addButton: Button = new Button({
                enableRtl: this.props.enableRtl,
                content: this.getConstant('addRange'),
                cssClass: 'e-btn minmax-add-range-btn',
                disabled: this.disabled
            });
            addButton.appendTo(addHost);
            addHost.setAttribute('aria-label', this.getConstant('addRange'));
            addSection.appendChild(addHost);
            addButton.element.onclick = this.handleAddRange.bind(this);
            root.appendChild(addSection);
        }

        this.host.appendChild(root);
    }

    /** @private */
    public destroy(): void {
        this.destroyControls();
        this.host.innerHTML = '';
    }

    private normalizeRanges(value: any): MinMaxRangeData[] {
        if (!Array.isArray(value) || value.length === 0) {
            return [{ enabled: false }];
        }

        if (typeof value[0] === 'object' && value[0] !== null && 'enabled' in value[0]) {
            return value as MinMaxRangeData[];
        }

        if (value.length === 2) {
            return [{ enabled: true, minValue: value[0], maxValue: value[1] }];
        }

        return value as MinMaxRangeData[];
    }

    private getInitialState(value: MinMaxRangeData[]): { useFieldMode: boolean; ranges: MinMaxRangeData[] } {
        const hasFieldData: boolean = Array.isArray(value) && value.some((range: MinMaxRangeData) => {
            return !!((range && typeof range.minValue === 'object' && range.minValue && (range.minValue as any).field) ||
                (range && typeof range.maxValue === 'object' && range.maxValue && (range.maxValue as any).field));
        });

        return {
            useFieldMode: hasFieldData,
            ranges: Array.isArray(value) && value.length > 0 ? value : [{ enabled: false }]
        };
    }

    private buildMinMaxValueGroup(kind: 'min' | 'max'): HTMLElement {
        const group: HTMLElement = createElement('div', { className: 'minmax-input-group' });
        const label: HTMLElement = createElement('label', { className: 'minmax-input-label' });
        label.textContent = this.getConstant(kind === 'min' ? 'minValue' : 'maxValue');
        const host: HTMLElement = createElement('div');
        const inputEl: HTMLElement = createElement('input', {
            id: (kind === 'min' ? 'min-' : 'max-') + (this.label || 'range').replace(/\s+/g, '-')
        });
        host.appendChild(inputEl);
        const value: any = this.getValue(kind);
        let control: any;

        if (this.editorMode === 'number') {
            control = new NumericTextBox({
                enableRtl: this.props.enableRtl,
                value: value !== undefined && value !== null && !(typeof value === 'object' && value && value.field) ? value : null,
                width: '118px',
                format: 'n',
                locale: this.locale,
                cssClass: 'minmax-numeric',
                change: (e: any) => this.handleMinMaxValueChange(kind, e.value),
                htmlAttributes: {
                    'aria-label': (kind === 'min' ? 'min-value-label-' : 'max-value-label-') + (this.label || 'range').replace(/\s+/g, '_'),
                    disabled: this.disabled ? 'true' : 'false'
                }
            });
        } else if (this.editorMode === 'date') {
            control = new DatePicker({
                enableRtl: this.props.enableRtl,
                value: this.toDateValue(value),
                width: '118px',
                format: 'MM/dd/yyyy',
                locale: this.locale,
                cssClass: 'minmax-date',
                change: (e: any) => {
                    if (e.value) {
                        const formatted = this.intl.getDateFormat({ format: 'MM/dd/yyyy', type: 'date' })(e.value);
                        this.handleMinMaxValueChange(kind, formatted);
                    }
                },
                htmlAttributes: {
                    'aria-label': (kind === 'min' ? 'min-value-label-' : 'max-value-label-') + (this.label || 'range').replace(/\s+/g, '_'),
                    disabled: this.disabled ? 'true' : 'false'
                }
            });
        } else {
            control = new TimePicker({
                enableRtl: this.props.enableRtl,
                value: this.toDateValue(value),
                width: '118px',
                format: 'hh:mm a',
                locale: this.locale,
                cssClass: 'minmax-date',
                change: (e: any) => {
                    if (e.value) {
                        const formatted = this.intl.getDateFormat({ format: 'hh:mm a', type: 'time' })(e.value);
                        this.handleMinMaxValueChange(kind, formatted);
                    }
                },
                htmlAttributes: {
                    'aria-label': (kind === 'min' ? 'min-value-label-' : 'max-value-label-') + (this.label || 'range').replace(/\s+/g, '_'),
                    disabled: this.disabled ? 'true' : 'false'
                }
            });
        }

        control.appendTo(inputEl);
        this.controls.push(control);
        group.appendChild(label);
        group.appendChild(host);
        return group;
    }

    private handleToggle(checked: boolean): void {
        const nextState = {
            useFieldMode: checked,
            ranges: checked ? [{ enabled: true }] : [{ enabled: false }]
        };
        this.state = nextState;
        this.notifyChange();
        this.render();
    }

    private handleMinMaxValueChange(kind: 'min' | 'max', value: any): void {
        const updated = this.state.ranges.slice(0);
        const firstRange: MinMaxRangeData = updated[0] || { enabled: true };
        const normalized: MinMaxRangeData = { ...firstRange };
        if (kind === 'min') {
            normalized.minValue = value;
        } else {
            normalized.maxValue = value;
        }
        updated[0] = normalized;
        this.state = { ...this.state, ranges: updated };
        this.notifyChange();
    }

    private handleMinFieldChange(index: number, fieldId: string): void {
        const updated = this.state.ranges.slice(0);
        updated[index as number] = { ...updated[index as number], minValue: { field: fieldId } };
        this.state = { ...this.state, ranges: updated };
        this.notifyChange();
        this.render();
    }

    private handleMaxFieldChange(index: number, fieldId: string): void {
        const updated = this.state.ranges.slice(0);
        updated[index as number] = { ...updated[index as number], maxValue: { field: fieldId } };
        this.state = { ...this.state, ranges: updated };
        this.notifyChange();
        this.render();
    }

    private handleDelete(index: number): void {
        const updated = this.state.ranges.filter((value: MinMaxRangeData, idx: number) => idx !== index);
        this.state = { ...this.state, ranges: updated.length > 0 ? updated : [{ enabled: false }] };
        this.notifyChange();
        this.render();
    }

    private handleAddRange(): void {
        const updated = this.state.ranges.concat([{ enabled: true }]);
        this.state = { ...this.state, ranges: updated };
        this.notifyChange();
        this.render();
    }

    private getMinFieldId(index: number): string {
        const range: MinMaxRangeData = this.state.ranges[index as number] || { enabled: false };
        if (range && range.minValue && typeof range.minValue === 'object' && (range.minValue as any).field) {
            return (range.minValue as any).field;
        }
        return '';
    }

    private getMaxFieldId(index: number): string {
        const range: MinMaxRangeData = this.state.ranges[index as number] || { enabled: false };
        if (range && range.maxValue && typeof range.maxValue === 'object' && (range.maxValue as any).field) {
            return (range.maxValue as any).field;
        }
        return '';
    }

    private getValue(kind: 'min' | 'max'): any {
        const range: MinMaxRangeData = this.state.ranges[0] || { enabled: false };
        const value = kind === 'min' ? range.minValue : range.maxValue;
        if (value && typeof value === 'object' && (value as any).field) {
            return '';
        }
        return value !== undefined ? value : '';
    }

    private filterAvailableFields(fields: Array<{ id: string; name: string; type: 'number' | 'date' | 'time' }>): Array<{ id: string; name: string; type: 'number' | 'date' | 'time' }> {
        if (!fields || !fields.length) {
            return [];
        }

        return fields.filter((field: { id: string; name: string; type: 'number' | 'date' | 'time' }) => {
            if (field && this.currentFieldId && (field.id === this.currentFieldId || field.name === this.currentFieldId)) {
                return false;
            }

            if (this.editorMode === 'number') {
                return field.type === 'number';
            }
            if (this.editorMode === 'date') {
                return field.type === 'date';
            }
            if (this.editorMode === 'time') {
                return field.type === 'time';
            }
            return true;
        });
    }

    private dropdownDataSource(): Array<{ text: string; value: string }> {
        return this.availableFields.map((field: any) => ({
            text: field.label || field.name,
            value: field.id
        }));
    }

    private toDateValue(value: any): Date | null {
        if (value === undefined || value === null || value === '') {
            return null;
        }
        if (value instanceof Date) {
            return value;
        }
        const dateValue: Date = new Date(value);
        return isNaN(dateValue.getTime()) ? null : dateValue;
    }

    private notifyChange(): void {
        this.onChange(this.state.ranges);
    }

    private getConstant(key: string): string {
        if (this.l10n && this.l10n.getConstant) {
            const value: string = this.l10n.getConstant(key as any);
            if (value) {
                return value;
            }
        }
        const fallbackMap: { [key: string]: string } = {
            useFieldValue: 'Use field value',
            addRange: 'Add Range',
            minValue: 'Min',
            maxValue: 'Max',
            delete: 'Delete'
        };
        return fallbackMap[key as string] || key;
    }

    private destroyControls(): void {
        if (this.controls && this.controls.length) {
            for (let i = 0; i < this.controls.length; i++) {
                const instance: any = this.controls[i as number];
                if (instance && typeof instance.destroy === 'function') {
                    try {
                        instance.destroy();
                    } catch (e) {
                        // Best effort cleanup.
                    }
                }
            }
        }
        this.controls = [];
    }
}
