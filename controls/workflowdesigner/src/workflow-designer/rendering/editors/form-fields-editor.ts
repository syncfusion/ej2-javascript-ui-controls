import { L10n } from '@syncfusion/ej2-base';
import { TextBox } from '@syncfusion/ej2-inputs';
import { DropDownList, ChangeEventArgs as DropDownChangeEventArgs } from '@syncfusion/ej2-dropdowns';
import { Button, CheckBox, ChangeEventArgs as CheckBoxChangeEventArgs } from '@syncfusion/ej2-buttons';
import { EditorComponents } from './editor-components';
import { ServiceLocator } from '../service';
import { resolveEditorL10n } from './editor-l10n';
/**
 * Structured FormInputTrigger fields editor.
 * Name is the field label; type + default value + required are authored in the UI.
 */

import { WorkflowChoiceOption, WorkflowInputFieldModel } from '../../models/workflow-shared-types';
import { WorkflowInputFieldType } from '../../models/workflow-enums';
import { INPUT_FIELD_TYPES, needsFieldOptions } from './editor-constants';
import { localeDefaults } from '../../localization/locale-defaults';


/**
 * Format a `key` carrying `{0}` / `{1}` placeholders.
 *
 * @param {string} value The value.
 * @param {string[]} args The args.
 * @returns {string} The formatted value.
 * @private
 */
function formatTemplate(value: string, args: string[]): string {
    return args.reduce<string>((acc: string, arg: string, index: number) => {
        return acc.replace('{' + index + '}', arg);
    }, value);
}

/**
 * Form Fields Change Handler.
 *
 * @private
 */
export type FormFieldsChangeHandler = (fields: WorkflowInputFieldModel[]) => void;
/**
 * Form Fields Commit Handler.
 *
 * @private
 */
export type FormFieldsCommitHandler = () => void;

/**
 * Renders add/remove form-field rows with name, type, default value, and required.
 *
 * @private
 */
export class FormFieldsEditor {
    private static l10n: L10n | undefined;
    private static locator: ServiceLocator | undefined;

    /**
     * Mirror the host's L10n instance (and the shared service locator) into
     * this static editor. The locator is preferred on every `t()` lookup so
     * runtime `setLocale()` changes take effect on the next render without
     * requiring a per-editor re-wire; the static `l10n` is the defensive
     * fallback for callers that do not pass a locator.
     *
     * @param {L10n} [l10n] The optional L10n instance to use.
     * @param {ServiceLocator} [locator] The optional shared service locator.
     * @returns {void} Nothing.
     * @private
     */
    public static setLocale(l10n?: L10n, locator?: ServiceLocator): void {
        FormFieldsEditor.l10n = l10n;
        FormFieldsEditor.locator = locator;
    }

    /**
     * Resolve a localised string from the active L10n bundle, with a fallback
     * to the bundled English string. Mirrors `StepEditorRegistry.resolveCaption`.
     *
     * @param {string} key The key.
     * @param {string[]} [args] The args.
     * @param {L10n} [overrideL10n] Optional per-render L10n override.
     * @returns {string} The resolved string.
     * @private
     */
    private static t(key: string, args?: string[], overrideL10n?: L10n): string {
        const l10n: L10n | undefined = resolveEditorL10n(
            FormFieldsEditor.locator,
            FormFieldsEditor.l10n,
            overrideL10n
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
            return formatTemplate(value, args);
        }
        return value;
    }

    /**
     * Render.
     *
     * @param {HTMLElement} host The host.
     * @param {WorkflowInputFieldModel} fields The fields.
     * @param {FormFieldsChangeHandler} onChange The on change.
     * @param {FormFieldsCommitHandler} onCommit The on change.
     * @param {L10n} [l10n] Optional L10n override for this render.
     * @returns {void} Nothing.
     * @private
     */
    public static render(
        host: HTMLElement,
        fields: WorkflowInputFieldModel[],
        onChange: FormFieldsChangeHandler,
        onCommit?: FormFieldsCommitHandler
    ): void {
        const root: HTMLDivElement = document.createElement('div');
        root.className = 'e-wf-list-editor e-wf-form-fields-editor';

        const list: HTMLDivElement = document.createElement('div');
        list.className = 'e-wf-list-editor-items';

        const clone: (source: WorkflowInputFieldModel[]) => WorkflowInputFieldModel[] =
            (source: WorkflowInputFieldModel[]): WorkflowInputFieldModel[] => {
                return source.map((field: WorkflowInputFieldModel) => FormFieldsEditor.cloneField(field));
            };
        // Local working copy — append-only on Add so multiple fields are retained.
        const current: WorkflowInputFieldModel[] = clone(Array.isArray(fields) ? fields : []);

        const emit: () => void = (): void => {
            // Emit a fresh clone so parent stores immutable snapshots without living DOM state.
            onChange(clone(current));
        };

        const rebuild: (focusKey?: string) => void = (focusKey?: string): void => {
            // Components must be disposed before the rows are discarded;
            // clearing `innerHTML` alone would orphan every instance.
            EditorComponents.clear(list);
            if (!current.length) {
                const empty: HTMLDivElement = document.createElement('div');
                empty.className = 'e-wf-list-editor-empty';
                empty.textContent = FormFieldsEditor.t('formFieldsEmpty');
                list.appendChild(empty);
            }
            current.forEach((field: WorkflowInputFieldModel, index: number) => {
                FormFieldsEditor.renderRow(list, field, index, current, emit, rebuild, onCommit);
            });
            // Component-aware restore: a DropDownList hides its original
            // element, so `focus()` on it is a no-op and `focusIn()` is used
            // instead. Text inputs keep the caret-to-end behaviour.
            EditorComponents.focusTarget(list, focusKey || '');
        };

        const toolbar: HTMLDivElement = document.createElement('div');
        toolbar.className = 'e-wf-list-editor-toolbar';
        const add: HTMLButtonElement = document.createElement('button');
        add.className = 'e-wf-list-editor-add';
        add.addEventListener('click', (event: MouseEvent) => {
            // Keep click from activating an outer property-field label (if any).
            event.preventDefault();
            event.stopPropagation();
            current.push({
                name: FormFieldsEditor.nextName(current),
                type: 'TextBox',
                defaultValue: '',
                required: false
            });
            rebuild('field-name-' + (current.length - 1));
            emit();
            if (onCommit) {
                onCommit();
            }
        });
        toolbar.appendChild(add);

        root.appendChild(list);
        root.appendChild(toolbar);
        host.appendChild(root);
        // Mounted after the host is attached: an EJ2 component initialised
        // while detached measures zero.
        new Button({ cssClass: 'e-wf-list-editor-add', isPrimary: true, content: FormFieldsEditor.t('formFieldsAdd') }).appendTo(add);
        rebuild();
    }

    private static renderRow(
        container: HTMLElement,
        field: WorkflowInputFieldModel,
        index: number,
        all: WorkflowInputFieldModel[],
        emit: () => void,
        rebuild: (focusKey?: string) => void,
        onCommit?: FormFieldsCommitHandler
    ): void {
        const row: HTMLDivElement = document.createElement('div');
        row.className = 'e-wf-list-editor-row e-wf-form-field-row';
        // Attached up front so every component below is instantiated on a
        // laid-out element rather than a detached one.
        container.appendChild(row);

        const header: HTMLDivElement = document.createElement('div');
        header.className = 'e-wf-list-editor-row-header';
        const title: HTMLSpanElement = document.createElement('span');
        title.className = 'e-wf-list-editor-row-title';
        title.textContent = FormFieldsEditor.t('formFieldRow', [String(index + 1)]);
        const remove: HTMLButtonElement = document.createElement('button');
        remove.className = 'e-wf-list-editor-remove';
        remove.setAttribute('aria-label', FormFieldsEditor.t('formFieldRemove'));
        remove.setAttribute('title', FormFieldsEditor.t('formFieldRemove'));
        remove.addEventListener('click', (event: MouseEvent) => {
            event.preventDefault();
            event.stopPropagation();
            all.splice(index, 1);
            rebuild();
            emit();
            if (onCommit) {
                onCommit();
            }
        });
        header.appendChild(title);
        header.appendChild(remove);
        row.appendChild(header);
        new Button({
            cssClass: 'e-wf-list-editor-remove e-flat',
            iconCss: 'e-icons e-close'
        }).appendTo(remove);

        const body: HTMLDivElement = document.createElement('div');
        body.className = 'e-wf-list-editor-row-body e-wf-form-field-row-body';
        row.appendChild(body);

        // Name: update living model + emit only; never rebuild on each keystroke.
        FormFieldsEditor.labeledInput(
            body,
            FormFieldsEditor.t('formFieldName'),
            'text',
            String(field.name || ''),
            'field-name-' + index,
            (value: string) => {
                field.name = value;
                if (value) {
                    field.label = value;
                }
                emit();
            },
            FormFieldsEditor.t('formFieldNameHelp')
        );

        // Type dropdown — changing type may need default-value control rebuild.
        const typeWrap: HTMLDivElement = document.createElement('div');
        typeWrap.className = 'e-wf-list-editor-subfield';
        const typeCaption: HTMLSpanElement = document.createElement('span');
        typeCaption.className = 'e-wf-list-editor-sublabel';
        typeCaption.textContent = FormFieldsEditor.t('formFieldType');
        const typeElement: HTMLInputElement = document.createElement('input');
        typeElement.type = 'text';
        typeElement.setAttribute('data-wf-focus', 'field-type-' + index);
        typeWrap.appendChild(typeCaption);
        typeWrap.appendChild(typeElement);
        body.appendChild(typeWrap);
        const typeSelect: DropDownList = new DropDownList({
            cssClass: 'e-wf-property-input',
            dataSource: INPUT_FIELD_TYPES.slice() as string[],
            value: String(field.type || 'TextBox'),
            change: (args: DropDownChangeEventArgs) => {
                const next: unknown = args && args.value !== undefined && args.value !== null ? args.value : '';
                field.type = String(next) as WorkflowInputFieldType;
                if (!needsFieldOptions(field.type)) {
                    delete field.options;
                    delete field.choices;
                } else if (!Array.isArray(field.options) && !Array.isArray(field.choices)) {
                    field.options = [];
                }
                // Choice-style fields don't author a free-text default or placeholder;
                // strip any stale values so they don't leak into the persisted JSON.
                if (needsFieldOptions(String(field.type || ''))) {
                    delete field.defaultValue;
                    delete field.value;
                    delete field.placeholder;
                    delete field.placeHolder;
                }
                // Rebuild this list so Default value input type matches the field
                // type. Deferred by one task: `rebuild` clears this subtree and
                // would otherwise destroy this DropDownList while its own change
                // handler is still on the stack.
                window.setTimeout(() => {
                    rebuild('field-type-' + index);
                    emit();
                }, 0);
            }
        });
        typeSelect.appendTo(typeElement);
        typeSelect.element.setAttribute(
            'aria-label',
            FormFieldsEditor.t('formFieldTypeAria', [String(index + 1)])
        );

        // Choice-style fields use Options, not a free-text Default value or Placeholder.
        if (!needsFieldOptions(String(field.type || ''))) {
            const defaultType: string = FormFieldsEditor.defaultInputType(field);
            const defaultStr: string = field.defaultValue === undefined || field.defaultValue === null
                ? ''
                : String(field.defaultValue);
            FormFieldsEditor.labeledInput(
                body,
                FormFieldsEditor.t('formFieldDefault'),
                defaultType,
                defaultStr,
                'field-default-' + index,
                (value: string) => {
                    if (String(field.type || '') === 'Number') {
                        field.defaultValue = value === '' ? undefined : Number(value);
                    } else {
                        field.defaultValue = value;
                    }
                    emit();
                }
            );

            // Placeholder — drives runtime FormInputDialog input placeholders
            // (text/textarea/email/password/number/date) when authored.
            FormFieldsEditor.labeledInput(
                body,
                FormFieldsEditor.t('formFieldPlaceholder'),
                'text',
                String(field.placeholder || field.placeHolder || ''),
                'field-placeholder-' + index,
                (value: string) => {
                    const trimmed: string = value || '';
                    if (trimmed) {
                        field.placeholder = trimmed;
                    } else {
                        // Clear both legacy + current spellings so the field truly
                        // disappears from the persisted JSON and the runtime dialog
                        // does not fall back to a stale value.
                        delete field.placeholder;
                        delete field.placeHolder;
                    }
                    emit();
                },
                FormFieldsEditor.t('formFieldPlaceholderHelp')
            );
        }

        // Options (comma-separated) — only for choice-style field types.
        // Persisted as WorkflowChoiceOption[] on field.options; the runtime
        // FormInputDialog reads options first then falls back to choices.
        if (needsFieldOptions(String(field.type || ''))) {
            const optionsWrap: HTMLDivElement = document.createElement('div');
            optionsWrap.className = 'e-wf-list-editor-subfield e-wf-form-field-options';
            const optionsCaption: HTMLSpanElement = document.createElement('span');
            optionsCaption.className = 'e-wf-list-editor-sublabel';
            optionsCaption.textContent = FormFieldsEditor.t('formFieldOptions');
            const optionsElement: HTMLInputElement = document.createElement('input');
            optionsElement.type = 'text';
            optionsElement.setAttribute('data-wf-focus', 'field-options-' + index);
            optionsWrap.appendChild(optionsCaption);
            optionsWrap.appendChild(optionsElement);
            body.appendChild(optionsWrap);
            const optionsInput: TextBox = new TextBox({
                cssClass: 'e-wf-property-input',
                placeholder: FormFieldsEditor.t('formFieldOptionsPlaceholder'),
                value: FormFieldsEditor.optionsToCsv(field)
            });
            optionsInput.appendTo(optionsElement);
            optionsInput.element.setAttribute(
                'aria-label',
                FormFieldsEditor.t('formFieldOptionsAria', [String(index + 1)])
            );
            // DOM `change` fires on blur/Enter so per-keystroke input does
            // not queue rapid-fire property events from the host binding.
            optionsInput.element.addEventListener('change', () => {
                const parsed: WorkflowChoiceOption[] =
                    FormFieldsEditor.parseOptionsCsv(optionsInput.element.value);
                if (parsed.length) {
                    field.options = parsed;
                } else {
                    delete field.options;
                    delete field.choices;
                }
                emit();
            });
        }

        // Required — drives runtime FormInputDialog validation (* and empty block).
        const requiredWrap: HTMLLabelElement = document.createElement('label');
        requiredWrap.className = 'e-wf-list-editor-subfield e-wf-list-editor-checkbox';
        const requiredElement: HTMLInputElement = document.createElement('input');
        requiredElement.type = 'checkbox';
        requiredElement.setAttribute('data-wf-focus', 'field-required-' + index);
        const requiredCaption: HTMLSpanElement = document.createElement('span');
        requiredCaption.className = 'e-wf-list-editor-sublabel';
        requiredCaption.textContent = FormFieldsEditor.t('formFieldRequired');
        requiredWrap.appendChild(requiredElement);
        requiredWrap.appendChild(requiredCaption);
        body.appendChild(requiredWrap);
        const requiredInput: CheckBox = new CheckBox({
            cssClass: 'e-wf-property-input',
            checked: !!field.required,
            change: (args: CheckBoxChangeEventArgs) => {
                field.required = Boolean(args.checked);
                emit();
            }
        });
        requiredInput.appendTo(requiredElement);
        requiredInput.element.setAttribute('aria-label', FormFieldsEditor.t('formFieldRequired'));
    }

    /**
     * Joins a list of WorkflowChoiceOption into a comma-separated string for
     * the options input. Falls back to legacy `choices` array when present.
     *
     * @param {WorkflowInputFieldModel} field The field to serialize.
     * @returns {string} The comma-separated options.
     */
    private static optionsToCsv(field: WorkflowInputFieldModel): string {
        if (Array.isArray(field.options) && field.options.length) {
            return field.options
                .map((opt: WorkflowChoiceOption): string =>
                    String(opt.label !== undefined ? opt.label : opt.value))
                .join(', ');
        }
        if (Array.isArray(field.choices) && field.choices.length) {
            return field.choices
                .map((item: unknown) => {
                    if (item && typeof item === 'object') {
                        const record: Record<string, unknown> = item as Record<string, unknown>;
                        return String(record.label !== undefined ? record.label : record.value || '');
                    }
                    return String(item);
                })
                .join(', ');
        }
        return '';
    }

    /**
     * Parses a comma-separated string into WorkflowChoiceOption entries.
     * Trims whitespace, drops empty fragments, and uses the trimmed label
     * as both label and value (stable round-trip through the UI).
     *
     * @param {string} raw The comma-separated option text.
     * @returns {WorkflowChoiceOption[]} The parsed options.
     */
    private static parseOptionsCsv(raw: string): WorkflowChoiceOption[] {
        if (!raw) {
            return [];
        }
        return raw.split(',')
            .map((part: string) => part.trim())
            .filter((part: string) => part.length > 0)
            .map((label: string) => ({ label: label, value: label }));
    }

    private static defaultInputType(field: WorkflowInputFieldModel): string {
        const type: string = String(field.type || 'TextBox');
        if (type === 'Date') {
            return 'date';
        }
        if (type === 'Number') {
            return 'number';
        }
        if (type === 'Password') {
            return 'password';
        }
        if (type === 'Email') {
            return 'email';
        }
        return 'text';
    }

    private static labeledInput(
        container: HTMLElement,
        label: string,
        inputType: string,
        value: string,
        focusKey: string,
        onChange: (value: string) => void,
        placeholder?: string
    ): void {
        // Use div (not label) so nested interactive controls do not fight label activation.
        const wrap: HTMLDivElement = document.createElement('div');
        wrap.className = 'e-wf-list-editor-subfield';
        const caption: HTMLSpanElement = document.createElement('span');
        caption.className = 'e-wf-list-editor-sublabel';
        caption.textContent = label;
        const element: HTMLInputElement = document.createElement('input');
        // `number` / `date` / `password` / `email` keep their native input
        // behaviour inside the themed TextBox wrapper; the type is set before
        // mounting so the component wraps the element as-is.
        element.type = inputType;
        element.setAttribute('data-wf-focus', focusKey);
        wrap.appendChild(caption);
        wrap.appendChild(element);
        container.appendChild(wrap);

        const input: TextBox = new TextBox({
            cssClass: 'e-wf-property-input',
            value: value,
            placeholder: placeholder || ''
        });
        input.appendTo(element);
        input.element.setAttribute('aria-label', label);
        // Prefer commit-on-blur (DOM `change`) so the panel only fires one
        // sync property event per field instead of one per keystroke.
        input.element.addEventListener('change', () => onChange(input.element.value));
    }

    private static nextName(fields: WorkflowInputFieldModel[]): string {
        let n: number = fields.length + 1;
        const used: { [name: string]: boolean } = Object.create(null);
        fields.forEach((f: WorkflowInputFieldModel) => {
            if (f.name) {
                used[f.name] = true;
            }
        });
        while (used['Field' + n] || used['field' + n]) {
            n++;
        }
        return 'Field' + n;
    }

    private static cloneField(field: WorkflowInputFieldModel): WorkflowInputFieldModel {
        const next: WorkflowInputFieldModel = {
            name: field.name || '',
            type: field.type || 'TextBox',
            // Always persist required so runtime dialog validation stays in sync.
            required: !!field.required
        };
        // Name is the display label; keep label in sync for consumers that still read it.
        if (field.name) {
            next.label = field.name;
        } else if (field.label !== undefined) {
            next.label = field.label;
        }
        if (field.placeholder !== undefined) {
            next.placeholder = field.placeholder;
        }
        if (field.placeHolder !== undefined) {
            next.placeHolder = field.placeHolder;
        }
        if (field.defaultValue !== undefined) {
            next.defaultValue = field.defaultValue;
        }
        if (field.value !== undefined) {
            next.value = field.value;
        }
        if (Array.isArray(field.options)) {
            next.options = field.options.map((opt: WorkflowChoiceOption) => ({
                label: opt.label,
                value: opt.value
            }));
        } else if (Array.isArray(field.choices)) {
            next.choices = field.choices.slice();
        }
        return next;
    }
}
