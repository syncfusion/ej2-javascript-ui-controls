/**
 * Schema-driven FormInputTrigger simulation dialog.
 * Renders configured fields (including a themed date picker) in a Syncfusion
 * Dialog. Field name is the label. Submit returns an object keyed by field name.
 */

import { L10n } from '@syncfusion/ej2-base';
import { Dialog } from '@syncfusion/ej2-popups';
import { TextBox, NumericTextBox } from '@syncfusion/ej2-inputs';
import { DatePicker } from '@syncfusion/ej2-calendars';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import { CheckBox, RadioButton } from '@syncfusion/ej2-buttons';
import { WorkflowChoiceOption, WorkflowInputFieldModel } from '../../models/workflow-shared-types';
import { WorkflowStep } from '../../models/workflow-step';
import { needsFieldOptions } from './editor-constants';
import { ServiceLocator } from '../service';
import { resolveEditorL10n } from './editor-l10n';
import { localeDefaults } from '../../localization/locale-defaults';


/**
 * Format a `key` carrying `{0}` / `{1}` placeholders.
 *
 * @param {string} value The value.
 * @param {string[]} args The args.
 * @returns {string} The formatted value.
 * @private
 */
function formDialogFormatTemplate(value: string, args: string[]): string {
    return args.reduce<string>((acc: string, arg: string, index: number) => {
        return acc.replace('{' + index + '}', arg);
    }, value);
}

/**
 * One rendered form control.
 *
 * Controls are built as bare host elements first and their EJ2 components
 * mounted afterwards, because the dialog only attaches its content to the
 * document when `appendTo` runs — a component initialised before that point
 * measures zero and renders without layout-dependent chrome.
 */
interface FormControl {
    /** Host element inserted into the field block. */
    element: HTMLElement;
    /** Instantiates the EJ2 component(s). Called once, after the dialog attaches. */
    mount(): void;
    /** Reads the current value in the same shape the native control returned. */
    read(): unknown;
    /** Disposes any EJ2 component(s) this control owns. */
    dispose(): void;
}

/**
 * One option of a CheckBoxes / RadioButton field.
 *
 * Each option carries its own host element and component so the group can be
 * mounted, read and disposed by iteration, without indexing parallel arrays.
 */
interface ChoiceEntry {
    label: string;
    value: string;
    host: HTMLInputElement;
    component: CheckBox | RadioButton | null;
}

/** A validated field block: the control plus its inline error row. */
interface FormEntry {
    field: WorkflowInputFieldModel;
    control: FormControl;
    validate: () => string | null;
}

/**
 * Opens a centered form dialog driven by step.props.fields.
 * Empty configuration shows a structured empty state (not a raw JSON textarea).
 *
 * @private
 */
export class FormInputDialog {
    private static l10n: L10n | undefined;
    private static locator: ServiceLocator | undefined;

    /**
     * Mirror the host's L10n instance (and the shared service locator) into
     * this static dialog. The locator is preferred on every `resolveCaption()`
     * lookup so runtime `setLocale()` changes take effect on the next render
     * without requiring a per-editor re-wire; the static `l10n` is the
     * defensive fallback for callers that do not pass a locator.
     *
     * @param {L10n} [l10n] The optional L10n instance to use.
     * @param {ServiceLocator} [locator] The optional shared service locator.
     * @returns {void} Nothing.
     * @private
     */
    public static setLocale(l10n?: L10n, locator?: ServiceLocator): void {
        FormInputDialog.l10n = l10n;
        FormInputDialog.locator = locator;
    }

    /**
     * Resolve a localised string from the active L10n bundle, with a
     * fallback to the bundled English string.
     *
     * @param {string} key The key.
     * @param {string[]} [args] The args.
     * @returns {string} The resolved string.
     * @private
     */
    private static resolveCaption(key: string, args?: string[]): string {
        const l10n: L10n | undefined = resolveEditorL10n(
            FormInputDialog.locator,
            FormInputDialog.l10n
        );
        let value: string = key;
        if (l10n) {
            const localised: string = l10n.getConstant(key);
            if (localised) {
                value = localised;
            }
        }
        if (value === key && localeDefaults[`${key}`]) {
            value = localeDefaults[`${key}`];
        }
        if (args && args.length) {
            return formDialogFormatTemplate(value, args);
        }
        return value;
    }

    /**
     * Show.
     *
     * @param {HTMLElement} host The host.
     * @param {WorkflowStep} step The step.
     * @param {AbortSignal} signal Optional cancellation signal.
     * @returns {Promise} The result.
     * @private
     */
    public static show(host: HTMLElement, step: WorkflowStep, signal?: AbortSignal): Promise<unknown> {
        const props: Record<string, unknown> = FormInputDialog.readProps(step);
        const fields: WorkflowInputFieldModel[] = FormInputDialog.readFields(props);
        const formTitle: string = typeof props.formTitle === 'string' && props.formTitle
            ? props.formTitle
            : FormInputDialog.resolveCaption('formDialogDefaultTitle', [step.name || step.id || '']);

        return new Promise<unknown>((resolve: (value: unknown) => void) => {
            const target: HTMLDivElement = document.createElement('div');
            host.appendChild(target);

            const body: HTMLDivElement = document.createElement('div');
            body.className = 'e-wf-form-input-dialog-body';

            const entries: FormEntry[] = [];

            if (!fields.length) {
                const empty: HTMLDivElement = document.createElement('div');
                empty.className = 'e-wf-form-input-empty';
                empty.textContent = FormInputDialog.resolveCaption('formDialogEmpty');
                body.appendChild(empty);
            } else {
                fields.forEach((field: WorkflowInputFieldModel) => {
                    const block: HTMLDivElement = document.createElement('div');
                    block.className = 'e-wf-form-input-field';
                    const label: HTMLLabelElement = document.createElement('label');
                    label.className = 'e-wf-form-input-field-label';
                    const caption: HTMLSpanElement = document.createElement('span');
                    const displayName: string = String(
                        (typeof field.label === 'string' && field.label.trim())
                            ? field.label
                            : (field.name || 'Field')
                    ).trim() || 'Field';
                    caption.textContent = displayName + (field.required ? ' *' : '');
                    label.appendChild(caption);

                    const control: FormControl = FormInputDialog.createControl(field);
                    label.appendChild(control.element);
                    block.appendChild(label);
                    const error: HTMLDivElement = document.createElement('div');
                    error.className = 'e-wf-form-input-field-error';
                    error.hidden = true;
                    block.appendChild(error);
                    body.appendChild(block);

                    entries.push({
                        field: field,
                        control: control,
                        validate: (): string | null => {
                            const value: unknown = control.read();
                            let message: string | null = null;
                            if (field.required) {
                                if (value === undefined || value === null || value === ''
                                    || (Array.isArray(value) && value.length === 0)) {
                                    message = FormInputDialog.resolveCaption('formDialogRequired');
                                }
                            }
                            error.textContent = message || '';
                            error.hidden = !message;
                            if (message) {
                                control.element.classList.add('e-wf-form-input-invalid');
                            } else {
                                control.element.classList.remove('e-wf-form-input-invalid');
                            }
                            return message;
                        }
                    });
                });
            }

            let dialog: Dialog | null = null;
            let resolved: boolean = false;

            /**
             * Returns a rendered footer button by its authored cssClass.
             *
             * EJ2 owns the footer markup, so the actions are addressed by
             * the classes declared on their `buttonModel`.
             *
             * @param {string} cssClass The authored button class.
             * @returns {HTMLButtonElement | null} The rendered button.
             */
            const footerButton: (cssClass: string) => HTMLButtonElement | null =
                (cssClass: string): HTMLButtonElement | null => {
                    if (!dialog || !dialog.element) {
                        return null;
                    }
                    return dialog.element.querySelector('.e-footer-content .' + cssClass);
                };

            /**
             * Resolves the dialog exactly once.
             *
             * Escape, the overlay, Submit and Cancel all reach this
             * function. Disposal is deferred by one task because `hide()`
             * is reached from inside Dialog's own handlers, which are still
             * using the element.
             *
             * @param {Object} result The submitted values, or undefined.
             * @returns {void}
             */
            const finish: (result: unknown) => void = (result: unknown): void => {
                if (resolved) {
                    return;
                }
                resolved = true;
                window.setTimeout(() => {
                    entries.forEach((entry: FormEntry) => entry.control.dispose());
                    if (dialog) {
                        dialog.destroy();
                        dialog = null;
                    }
                    if (target.parentNode) {
                        target.parentNode.removeChild(target);
                    }
                }, 0);
                if (dialog) {
                    dialog.hide();
                }
                resolve(result);
            };

            const submit: () => void = (): void => {
                if (!fields.length) {
                    return;
                }
                let valid: boolean = true;
                entries.forEach((entry: FormEntry): void => {
                    if (entry.validate()) {
                        valid = false;
                    }
                });
                if (!valid) {
                    return;
                }
                const result: Record<string, unknown> = {};
                entries.forEach((entry: FormEntry): void => {
                    const name: string = String(entry.field.name || entry.field.label || '').trim();
                    if (name) {
                        result[`${name}`] = entry.control.read();
                    }
                });
                finish(result);
            };

            dialog = new Dialog({
                header: FormInputDialog.buildHeader(formTitle),
                content: body,
                isModal: true,
                // The original dialog offered no close affordance other than
                // Escape and Cancel; keeping `showCloseIcon` off preserves that.
                showCloseIcon: false,
                closeOnEscape: true,
                // Single-column field stack; narrower than the approval
                // dialog, which renders a two-column details grid.
                width: '480px',
                cssClass: 'e-wf-dialog e-wf-form-input-dialog',
                buttons: [
                    {
                        buttonModel: { content: FormInputDialog.resolveCaption('formDialogCancel'), cssClass: 'e-wf-form-input-cancel' },
                        click: (): void => finish(undefined)
                    },
                    {
                        buttonModel: {
                            content: FormInputDialog.resolveCaption('formDialogSubmit'),
                            isPrimary: true,
                            cssClass: 'e-wf-dialog-primary e-wf-form-input-submit',
                            disabled: !fields.length
                        },
                        click: (): void => submit()
                    }
                ],
                // Escape and the overlay both land here; `finish` is
                // idempotent so a button-driven close is a no-op.
                close: (): void => finish(undefined),
                open: (): void => {
                    if (dialog && dialog.element) {
                        dialog.element.setAttribute('aria-label', formTitle);
                    }
                    const focusTarget: HTMLButtonElement | null = fields.length
                        ? footerButton('e-wf-form-input-submit')
                        : footerButton('e-wf-form-input-cancel');
                    if (focusTarget) {
                        focusTarget.focus();
                    }
                }
            });
            dialog.appendTo(target);

            // Close without a value when the run stops while the dialog is open.
            if (signal) {
                if (signal.aborted) {
                    finish(undefined);
                } else {
                    signal.addEventListener('abort', () => finish(undefined), { once: true });
                }
            }

            // Content is in the document only after `appendTo`, so the
            // per-field components are mounted here rather than at build time.
            entries.forEach((entry: FormEntry) => entry.control.mount());
        });
    }

    /**
     * Builds the dialog header markup.
     *
     * @param {string} title The form title.
     * @returns {string} The header markup.
     */
    private static buildHeader(title: string): string {
        const safe: string = String(title)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
        return '<div class="e-wf-dialog-title">' + safe + '</div>';
    }

    private static readProps(step: WorkflowStep): Record<string, unknown> {
        if (step.props && typeof step.props === 'object') {
            return step.props as Record<string, unknown>;
        }
        return {};
    }

    private static readFields(props: Record<string, unknown>): WorkflowInputFieldModel[] {
        const sources: unknown[] = [];
        if (Array.isArray(props.fields)) {
            sources.push(...(props.fields as unknown[]));
        } else if (Array.isArray(props.payloadSchema)) {
            sources.push(...(props.payloadSchema as unknown[]));
        }
        const result: WorkflowInputFieldModel[] = [];
        sources.forEach((item: unknown, index: number) => {
            if (!item || typeof item !== 'object') {
                return;
            }
            const record: Record<string, unknown> = item as Record<string, unknown>;
            const name: string = String(record.name || record.label || ('field' + (index + 1))).trim();
            const field: WorkflowInputFieldModel = {
                name: name,
                type: (record.type as WorkflowInputFieldModel['type']) || 'TextBox'
            };
            if (record.label !== undefined) {
                field.label = String(record.label);
            } else {
                field.label = name;
            }
            if (record.placeholder !== undefined) {
                field.placeholder = String(record.placeholder);
            }
            if (record.placeHolder !== undefined) {
                field.placeHolder = String(record.placeHolder);
            }
            if (record.required !== undefined) {
                field.required = !!record.required;
            }
            if (record.defaultValue !== undefined) {
                field.defaultValue = record.defaultValue;
            } else if (record.value !== undefined) {
                field.defaultValue = record.value;
            }
            if (Array.isArray(record.options)) {
                field.options = record.options as WorkflowChoiceOption[];
            }
            if (Array.isArray(record.choices)) {
                field.choices = record.choices as unknown[];
            }
            result.push(field);
        });
        return result;
    }

    private static createControl(field: WorkflowInputFieldModel): FormControl {
        const type: string = String(field.type || 'TextBox');
        const defaultValue: unknown = field.defaultValue !== undefined ? field.defaultValue : field.value;
        const placeholder: string = String(field.placeholder || field.placeHolder || '');

        if (type === 'TextArea') {
            const element: HTMLTextAreaElement = document.createElement('textarea');
            let box: TextBox | null = null;
            return {
                element: element,
                mount: (): void => {
                    box = new TextBox({
                        multiline: true,
                        cssClass: 'e-wf-dialog-input e-wf-form-input-control',
                        placeholder: placeholder,
                        value: defaultValue === undefined || defaultValue === null ? '' : String(defaultValue)
                    });
                    box.appendTo(element);
                    box.element.setAttribute('rows', '3');
                },
                read: (): unknown => (box ? box.element.value : element.value),
                dispose: (): void => {
                    if (box) {
                        box.destroy();
                        box = null;
                    }
                }
            };
        }

        if (type === 'DropDown') {
            const element: HTMLInputElement = document.createElement('input');
            element.type = 'text';
            let list: DropDownList | null = null;
            const options: WorkflowChoiceOption[] = FormInputDialog.optionsOf(field);
            const initial: string | undefined = defaultValue === undefined || defaultValue === null
                ? undefined
                : String(defaultValue);
            return {
                element: element,
                mount: (): void => {
                    list = new DropDownList({
                        cssClass: 'e-wf-dialog-input e-wf-form-input-control',
                        // The placeholder replaces the blank first option the
                        // native <select> carried, so "nothing chosen" still
                        // reads as undefined rather than an empty string.
                        placeholder: placeholder || FormInputDialog.resolveCaption('formDialogSelectPlaceholder'),
                        dataSource: options.map((opt: WorkflowChoiceOption) => ({
                            text: String(opt.label),
                            value: String(opt.value)
                        })),
                        fields: { text: 'text', value: 'value' },
                        value: initial
                    });
                    list.appendTo(element);
                },
                read: (): unknown => {
                    if (!list) {
                        return undefined;
                    }
                    const value: string | number | boolean | null = list.value as string | number | boolean | null;
                    return value === null || value === undefined || value === '' ? undefined : String(value);
                },
                dispose: (): void => {
                    if (list) {
                        list.destroy();
                        list = null;
                    }
                }
            };
        }

        if (type === 'CheckBoxes') {
            const group: HTMLDivElement = document.createElement('div');
            group.className = 'e-wf-form-input-choice-group';
            const options: WorkflowChoiceOption[] = FormInputDialog.optionsOf(field);
            const selectedDefaults: string[] = Array.isArray(defaultValue)
                ? (defaultValue as unknown[]).map((v: unknown) => String(v))
                : (defaultValue !== undefined && defaultValue !== null ? [String(defaultValue)] : []);
            // One record per option rather than parallel arrays: the record
            // carries its own host and component, so nothing is looked up by
            // index and no computed member access is needed.
            const entries: ChoiceEntry[] = options.map((opt: WorkflowChoiceOption): ChoiceEntry => {
                const item: HTMLLabelElement = document.createElement('label');
                item.className = 'e-wf-form-input-choice-checkbox-item';
                const input: HTMLInputElement = document.createElement('input');
                input.type = 'checkbox';
                item.appendChild(input);
                group.appendChild(item);
                return {
                    label: String(opt.label),
                    value: String(opt.value),
                    host: input,
                    component: null
                };
            });
            return {
                element: group,
                mount: (): void => {
                    entries.forEach((entry: ChoiceEntry) => {
                        const box: CheckBox = new CheckBox({
                            label: entry.label,
                            checked: selectedDefaults.indexOf(entry.value) !== -1
                        });
                        box.appendTo(entry.host);
                        entry.component = box;
                    });
                },
                read: (): unknown => entries
                    .filter((entry: ChoiceEntry) => Boolean(entry.component && (entry.component as CheckBox).checked))
                    .map((entry: ChoiceEntry) => entry.value),
                dispose: (): void => {
                    entries.forEach((entry: ChoiceEntry) => {
                        if (entry.component) {
                            entry.component.destroy();
                            entry.component = null;
                        }
                    });
                }
            };
        }

        if (type === 'RadioButton') {
            const group: HTMLDivElement = document.createElement('div');
            group.className = 'e-wf-form-input-choice-group';
            const name: string = 'e-wf-form-radio-' + String(field.name || Math.random()).replace(/\W/g, '_');
            const options: WorkflowChoiceOption[] = FormInputDialog.optionsOf(field);
            const entries: ChoiceEntry[] = options.map((opt: WorkflowChoiceOption): ChoiceEntry => {
                const item: HTMLLabelElement = document.createElement('label');
                item.className = 'e-wf-form-input-choice-item';
                const input: HTMLInputElement = document.createElement('input');
                input.type = 'radio';
                item.appendChild(input);
                group.appendChild(item);
                return {
                    label: String(opt.label),
                    value: String(opt.value),
                    host: input,
                    component: null
                };
            });
            return {
                element: group,
                mount: (): void => {
                    entries.forEach((entry: ChoiceEntry) => {
                        const radio: RadioButton = new RadioButton({
                            label: entry.label,
                            name: name,
                            value: entry.value,
                            checked: defaultValue !== undefined && String(defaultValue) === entry.value
                        });
                        radio.appendTo(entry.host);
                        entry.component = radio;
                    });
                },
                read: (): unknown => {
                    const selected: ChoiceEntry | undefined = entries.find(
                        (entry: ChoiceEntry) => Boolean(entry.component && (entry.component as RadioButton).checked)
                    );
                    return selected ? selected.value : undefined;
                },
                dispose: (): void => {
                    entries.forEach((entry: ChoiceEntry) => {
                        if (entry.component) {
                            entry.component.destroy();
                            entry.component = null;
                        }
                    });
                }
            };
        }

        if (type === 'Date') {
            const element: HTMLInputElement = document.createElement('input');
            let picker: DatePicker | null = null;
            const initial: string = defaultValue === undefined || defaultValue === null || defaultValue === ''
                ? ''
                : FormInputDialog.toDateInputValue(defaultValue);
            return {
                element: element,
                mount: (): void => {
                    picker = new DatePicker({
                        cssClass: 'e-wf-dialog-input e-wf-form-input-control',
                        placeholder: placeholder,
                        value: initial ? new Date(initial) : null
                    });
                    picker.appendTo(element);
                },
                // The native control submitted a `yyyy-MM-dd` string; the
                // same string shape is produced here so downstream consumers
                // and the serialized payload are unchanged.
                read: (): unknown => {
                    if (!picker || !picker.value) {
                        return '';
                    }
                    return FormInputDialog.toDateInputValue(picker.value);
                },
                dispose: (): void => {
                    if (picker) {
                        picker.destroy();
                        picker = null;
                    }
                }
            };
        }

        if (type === 'Number') {
            const element: HTMLInputElement = document.createElement('input');
            let numeric: NumericTextBox | null = null;
            return {
                element: element,
                mount: (): void => {
                    numeric = new NumericTextBox({
                        cssClass: 'e-wf-dialog-input e-wf-form-input-control',
                        format: 'n',
                        placeholder: placeholder,
                        showSpinButton: false,
                        value: defaultValue === undefined || defaultValue === null || defaultValue === ''
                            ? null
                            : Number(defaultValue)
                    });
                    numeric.appendTo(element);
                },
                // NumericTextBox reports an empty field as `null`; the native
                // input returned `undefined`, and the submitted payload shape
                // must not change.
                read: (): unknown => {
                    if (!numeric || numeric.value === null || numeric.value === undefined) {
                        return undefined;
                    }
                    return numeric.value;
                },
                dispose: (): void => {
                    if (numeric) {
                        numeric.destroy();
                        numeric = null;
                    }
                }
            };
        }

        const element: HTMLInputElement = document.createElement('input');
        // `password` / `email` keep their native input behaviour inside the
        // themed TextBox wrapper; the type is set before mounting so the
        // component wraps the element as-is.
        if (type === 'Password') {
            element.type = 'password';
        } else if (type === 'Email') {
            element.type = 'email';
        } else {
            element.type = 'text';
        }
        let box: TextBox | null = null;
        return {
            element: element,
            mount: (): void => {
                box = new TextBox({
                    cssClass: 'e-wf-dialog-input e-wf-form-input-control',
                    placeholder: placeholder,
                    value: defaultValue === undefined || defaultValue === null ? '' : String(defaultValue)
                });
                box.appendTo(element);
            },
            read: (): unknown => (box ? box.element.value : element.value),
            dispose: (): void => {
                if (box) {
                    box.destroy();
                    box = null;
                }
            }
        };
    }

    private static toDateInputValue(value: unknown): string {
        const pad2: (n: number) => string = (n: number): string => (n < 10 ? '0' : '') + String(n);
        if (value instanceof Date && !isNaN(value.getTime())) {
            return value.getFullYear() + '-' + pad2(value.getMonth() + 1) + '-' + pad2(value.getDate());
        }
        const raw: string = String(value).trim();
        if (/^\d{4}-\d{2}-\d{2}/.test(raw)) {
            return raw.substring(0, 10);
        }
        const parsed: Date = new Date(raw);
        if (!isNaN(parsed.getTime())) {
            return parsed.getFullYear() + '-' + pad2(parsed.getMonth() + 1) + '-' + pad2(parsed.getDate());
        }
        return raw;
    }

    private static optionsOf(field: WorkflowInputFieldModel): WorkflowChoiceOption[] {
        if (Array.isArray(field.options) && field.options.length) {
            return field.options;
        }
        if (Array.isArray(field.choices) && field.choices.length) {
            return field.choices.map((item: unknown, index: number) => {
                if (item && typeof item === 'object') {
                    const record: Record<string, unknown> = item as Record<string, unknown>;
                    return {
                        label: String(record.label !== undefined ? record.label : record.value || index),
                        value: (record.value !== undefined ? record.value : record.label || index) as string | number | boolean
                    };
                }
                return { label: String(item), value: item as string | number | boolean };
            });
        }
        if (needsFieldOptions(String(field.type || ''))) {
            return [{ label: 'Option 1', value: 'option1' }];
        }
        return [];
    }
}
