import { TextBox, NumericTextBox } from '@syncfusion/ej2-inputs';
import { DropDownList, MultiSelect } from '@syncfusion/ej2-dropdowns';
import { CheckBox, RadioButton } from '@syncfusion/ej2-buttons';
import { DatePicker, DateTimePicker } from '@syncfusion/ej2-calendars';
import { WorkflowCustomFieldDefinitionModel, WorkflowCustomFieldOptionModel } from '../../models/workflow-custom-step-model';
import { EditorField } from './step-editor-registry';

/** The part of a registry `EditorField` that identifies a rendered custom field. */
type CustomEditorField = Pick<EditorField, 'key' | 'label'>;

interface Disposable {
    destroy(): void;
}

/**
 * Renders the value editors of a custom step from its field definitions. It edits values only; the
 * field schema cannot be changed from here.
 *
 * @private
 */
export class CustomStepEditor {
    /**
     * Renders every field into the container.
     *
     * @param {HTMLElement} container The panel body.
     * @param {WorkflowCustomFieldDefinitionModel[]} fields The fields to render.
     * @param {Record<string, unknown>} values The current step values.
     * @param {Function} track Registers a component for disposal.
     * @param {Function} onChange Receives the key and new value of an edit.
     * @returns {void}
     */
    public static render(
        container: HTMLElement,
        fields: WorkflowCustomFieldDefinitionModel[],
        values: Record<string, unknown>,
        track: <T extends Disposable>(instance: T) => T,
        onChange: (key: string, value: unknown) => void
    ): void {
        fields.forEach((field: WorkflowCustomFieldDefinitionModel): void => {
            CustomStepEditor.renderField(container, field, values[field.key], track, onChange);
        });
    }

    /**
     * Renders the values of a step whose definition is unavailable as read-only text.
     *
     * @param {HTMLElement} container The panel body.
     * @param {string} message The notice shown above the values.
     * @param {Record<string, unknown>} values The step values.
     * @returns {void}
     */
    public static renderUnavailable(container: HTMLElement, message: string, values: Record<string, unknown>): void {
        const notice: HTMLDivElement = document.createElement('div');
        notice.className = 'e-wf-property-field e-wf-custom-step-unavailable';
        notice.setAttribute('role', 'note');
        notice.textContent = message;
        container.appendChild(notice);
        Object.keys(values).forEach((key: string): void => {
            const row: HTMLDivElement = document.createElement('div');
            row.className = 'e-wf-property-field';
            const caption: HTMLSpanElement = document.createElement('span');
            caption.className = 'e-wf-property-label';
            caption.textContent = key;
            const value: HTMLDivElement = document.createElement('div');
            const raw: unknown = values[`${key}`];
            value.textContent = typeof raw === 'string' ? raw : JSON.stringify(raw);
            row.appendChild(caption);
            row.appendChild(value);
            container.appendChild(row);
        });
    }

    private static renderField(
        container: HTMLElement,
        field: WorkflowCustomFieldDefinitionModel,
        value: unknown,
        track: <T extends Disposable>(instance: T) => T,
        onChange: (key: string, value: unknown) => void
    ): void {
        const descriptor: CustomEditorField = { key: field.key, label: field.label || field.key };
        const wrap: HTMLDivElement = document.createElement('div');
        wrap.className = 'e-wf-property-field';
        const caption: HTMLSpanElement = document.createElement('span');
        caption.className = 'e-wf-property-label';
        caption.textContent = descriptor.label + (field.required ? ' *' : '');
        wrap.appendChild(caption);
        const error: HTMLDivElement = document.createElement('div');
        error.className = 'e-wf-property-error';
        error.setAttribute('role', 'alert');
        error.hidden = true;
        const commit: (next: unknown) => void = (next: unknown): void => {
            const message: string = CustomStepEditor.validate(field, next);
            error.textContent = message;
            error.hidden = !message;
            onChange(descriptor.key, next);
        };
        const input: HTMLInputElement = document.createElement('input');
        const disabled: boolean = !!field.disabled;
        const readOnly: boolean = !!field.readOnly;
        const placeholder: string = field.placeholder || '';
        const options: WorkflowCustomFieldOptionModel[] = (Array.isArray(field.options) ? field.options : [])
            .map((o: WorkflowCustomFieldOptionModel) => ({ text: String(o.text), value: o.value }));
        const label: string = descriptor.label;

        switch (field.type) {
        case 'CheckBox': {
            wrap.appendChild(input);
            container.appendChild(wrap);
            const box: CheckBox = track(new CheckBox({
                checked: value === true,
                disabled: disabled || readOnly,
                change: () => commit(box.checked)
            }));
            box.appendTo(input);
            break;
        }
        case 'RadioButton': {
            wrap.setAttribute('role', 'radiogroup');
            wrap.setAttribute('aria-label', label);
            container.appendChild(wrap);
            const name: string = 'e-wf-custom-' + field.key + '-' + Math.random().toString(36).slice(2);
            options.forEach((option: WorkflowCustomFieldOptionModel): void => {
                const radio: HTMLInputElement = document.createElement('input');
                radio.type = 'radio';
                const row: HTMLDivElement = document.createElement('div');
                row.appendChild(radio);
                wrap.appendChild(row);
                const button: RadioButton = track(new RadioButton({
                    label: option.text,
                    name: name,
                    value: String(option.value),
                    checked: value === option.value,
                    disabled: disabled || readOnly,
                    change: () => commit(option.value)
                }));
                button.appendTo(radio);
            });
            break;
        }
        default:
            wrap.appendChild(input);
            container.appendChild(wrap);
            CustomStepEditor.renderInput(field, input, value, track, commit, options, placeholder, disabled, readOnly, label);
        }
        if (field.description) {
            const help: HTMLDivElement = document.createElement('div');
            help.className = 'e-wf-property-help';
            help.textContent = field.description;
            wrap.appendChild(help);
        }
        wrap.appendChild(error);
        const initial: string = CustomStepEditor.validate(field, value);
        if (initial && value !== undefined && value !== '' && value !== null) {
            error.textContent = initial;
            error.hidden = false;
        }
    }

    private static renderInput(
        field: WorkflowCustomFieldDefinitionModel,
        input: HTMLInputElement,
        value: unknown,
        track: <T extends Disposable>(instance: T) => T,
        commit: (next: unknown) => void,
        options: WorkflowCustomFieldOptionModel[],
        placeholder: string,
        disabled: boolean,
        readOnly: boolean,
        label: string
    ): void {
        const enabled: boolean = !disabled;
        let element: HTMLElement = input;
        switch (field.type) {
        case 'TextArea': {
            // A multiline TextBox needs a real <textarea> host; on an <input> it edits a detached element.
            const area: HTMLTextAreaElement = document.createElement('textarea');
            (input.parentElement as HTMLElement).replaceChild(area, input);
            const box: TextBox = track(new TextBox({
                multiline: true, value: value === undefined || value === null ? '' : String(value),
                placeholder: placeholder, enabled: enabled, readonly: readOnly, cssClass: 'e-wf-property-input'
            }));
            box.appendTo(area);
            element = box.element;
            box.element.addEventListener('change', () => commit(box.element.value));
            break;
        }
        case 'DropDownList': {
            const list: DropDownList = track(new DropDownList({
                dataSource: options as unknown as { [key: string]: Object }[], fields: { text: 'text', value: 'value' },
                value: value as string | number | boolean | null | undefined, placeholder: placeholder,
                enabled: enabled && !readOnly, cssClass: 'e-wf-property-input',
                change: () => commit(list.value === null ? undefined : list.value)
            }));
            list.appendTo(input);
            element = list.element;
            break;
        }
        case 'MultiSelect': {
            const multi: MultiSelect = track(new MultiSelect({
                dataSource: options as unknown as { [key: string]: Object }[], fields: { text: 'text', value: 'value' },
                value: Array.isArray(value) ? value.slice() as string[] : [], placeholder: placeholder,
                enabled: enabled && !readOnly, cssClass: 'e-wf-property-input',
                change: () => commit(Array.isArray(multi.value) ? multi.value.slice() : [])
            }));
            multi.appendTo(input);
            element = multi.element;
            break;
        }
        case 'NumericTextBox': {
            const validation: { min?: number; max?: number } = field.validation || {};
            const numeric: NumericTextBox = track(new NumericTextBox({
                value: typeof value === 'number' ? value : null, placeholder: placeholder, enabled: enabled,
                readonly: readOnly, cssClass: 'e-wf-property-input',
                min: typeof validation.min === 'number' ? validation.min : undefined,
                max: typeof validation.max === 'number' ? validation.max : undefined,
                change: () => commit(numeric.value === null ? undefined : numeric.value)
            }));
            numeric.appendTo(input);
            element = numeric.element;
            break;
        }
        case 'DatePicker': {
            const picker: DatePicker = track(new DatePicker({
                value: CustomStepEditor.toDate(value), placeholder: placeholder, enabled: enabled,
                readonly: readOnly, cssClass: 'e-wf-property-input',
                change: () => commit(picker.value ? CustomStepEditor.formatDate(picker.value, false) : undefined)
            }));
            picker.appendTo(input);
            element = picker.element;
            break;
        }
        case 'DateTimePicker': {
            const picker: DateTimePicker = track(new DateTimePicker({
                value: CustomStepEditor.toDate(value), placeholder: placeholder, enabled: enabled,
                readonly: readOnly, cssClass: 'e-wf-property-input',
                change: () => commit(picker.value ? CustomStepEditor.formatDate(picker.value, true) : undefined)
            }));
            picker.appendTo(input);
            element = picker.element;
            break;
        }
        default: {
            const box: TextBox = track(new TextBox({
                value: value === undefined || value === null ? '' : String(value),
                placeholder: placeholder, enabled: enabled, readonly: readOnly, cssClass: 'e-wf-property-input'
            }));
            box.appendTo(input);
            element = box.element;
            box.element.addEventListener('change', () => commit(box.element.value));
        }
        }
        element.setAttribute('aria-label', label);
        if (field.required) {
            element.setAttribute('aria-required', 'true');
        }
    }

    /**
     * Checks a value against the field's rules.
     *
     * @param {WorkflowCustomFieldDefinitionModel} field The field.
     * @param {unknown} value The value.
     * @returns {string} An error message, or an empty string when the value is valid.
     */
    public static validate(field: WorkflowCustomFieldDefinitionModel, value: unknown): string {
        const empty: boolean = value === undefined || value === null || value === ''
            || (Array.isArray(value) && value.length === 0);
        if (empty) {
            return field.required ? (field.label || field.key) + ' is required.' : '';
        }
        const rules: { minLength?: number; maxLength?: number; min?: number; max?: number; pattern?: string } = field.validation || {};
        if (typeof value === 'string') {
            if (typeof rules.minLength === 'number' && value.length < rules.minLength) {
                return 'Enter at least ' + rules.minLength + ' characters.';
            }
            if (typeof rules.maxLength === 'number' && value.length > rules.maxLength) {
                return 'Enter at most ' + rules.maxLength + ' characters.';
            }
            if (rules.pattern && rules.pattern.length <= 200) {
                try {
                    // The pattern comes from the application's own field definition and is length-limited.
                    // eslint-disable-next-line security/detect-non-literal-regexp
                    if (!new RegExp(rules.pattern).test(value)) {
                        return 'The value does not match the required format.';
                    }
                } catch (e) {
                    return '';
                }
            }
        }
        if (typeof value === 'number') {
            if (typeof rules.min === 'number' && value < rules.min) {
                return 'Enter a value of at least ' + rules.min + '.';
            }
            if (typeof rules.max === 'number' && value > rules.max) {
                return 'Enter a value of at most ' + rules.max + '.';
            }
        }
        return '';
    }

    private static toDate(value: unknown): Date | null {
        if (typeof value !== 'string' || !value) {
            return null;
        }
        const date: Date = new Date(value.length === 10 ? value + 'T00:00:00' : value);
        return isNaN(date.getTime()) ? null : date;
    }

    private static formatDate(date: Date, withTime: boolean): string {
        const pad: (n: number) => string = (n: number): string => (n < 10 ? '0' : '') + String(n);
        const day: string = date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate());
        return withTime ? day + 'T' + pad(date.getHours()) + ':' + pad(date.getMinutes()) : day;
    }
}
