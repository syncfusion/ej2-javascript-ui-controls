/**
 * Structured AI responseFields editor.
 * Each row authors one desired JSON key: name, type, optional description.
 * Persists as AiResponseFieldSpec[] on AI step props.
 *
 * The long-form help text (what each row means + how to bind the
 * response downstream) is intentionally **not** rendered here as a
 * standalone block. The property panel surfaces it as a hover `?` icon
 * next to the "Desired response fields" label via `field.helpText` /
 * `field.helpIcon`, mirroring the Cron expression help popup. Keeping
 * the editor focused on row authoring makes the panel denser and the
 * affordance consistent across every AI editor that has a long
 * explanation.
 */

import { TextBox } from '@syncfusion/ej2-inputs';
import { DropDownList, ChangeEventArgs as DropDownChangeEventArgs } from '@syncfusion/ej2-dropdowns';
import { Button } from '@syncfusion/ej2-buttons';
import { AI_RESPONSE_FIELD_TYPES } from './editor-constants';
import { EditorComponents } from './editor-components';
import { LocaleContext } from '../../localization/locale-context';

/**
 * Field shape aligned with AiResponseFieldSpec / AIStepProps.responseFields.
 *
 * @private
 */
export interface AiResponseFieldModel {
    name: string;
    type?: string;
    description?: string;
}

/**
 * Response Fields Change Handler.
 *
 * @private
 */
export type ResponseFieldsChangeHandler = (fields: AiResponseFieldModel[]) => void;
/**
 * Response Fields Commit Handler.
 *
 * @private
 */
export type ResponseFieldsCommitHandler = () => void;

/**
 * Renders add/remove response-field rows (name, type, description).
 *
 * @private
 */
export class ResponseFieldsEditor {
    /**
     * Render.
     *
     * @param {HTMLElement} host The host.
     * @param {AiResponseFieldModel} fields The fields.
     * @param {ResponseFieldsChangeHandler} onChange The on change.
     * @param {ResponseFieldsCommitHandler} onCommit The on commit.
     * @returns {void} Nothing.
     * @private
     */
    public static render(
        host: HTMLElement,
        fields: AiResponseFieldModel[],
        onChange: ResponseFieldsChangeHandler,
        onCommit?: ResponseFieldsCommitHandler
    ): void {
        const root: HTMLDivElement = document.createElement('div');
        root.className = 'e-wf-list-editor e-wf-response-fields-editor';

        const list: HTMLDivElement = document.createElement('div');
        list.className = 'e-wf-list-editor-items';

        const clone: (source: AiResponseFieldModel[]) => AiResponseFieldModel[] =
            (source: AiResponseFieldModel[]): AiResponseFieldModel[] => {
                return source.map((field: AiResponseFieldModel) => ResponseFieldsEditor.cloneField(field));
            };
        const current: AiResponseFieldModel[] = clone(Array.isArray(fields) ? fields : []);

        const emit: () => void = (): void => {
            onChange(clone(current));
        };

        const rebuild: (focusKey?: string) => void = (focusKey?: string): void => {
            // Components must be disposed before the rows are discarded;
            // clearing `innerHTML` alone would orphan every instance.
            EditorComponents.clear(list);
            if (!current.length) {
                const empty: HTMLDivElement = document.createElement('div');
                empty.className = 'e-wf-list-editor-empty';
                empty.textContent = LocaleContext.text('responseFieldsEmpty');
                list.appendChild(empty);
            }
            current.forEach((field: AiResponseFieldModel, index: number) => {
                ResponseFieldsEditor.renderRow(list, field, index, current, emit, rebuild, onCommit);
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
            event.preventDefault();
            event.stopPropagation();
            current.push({
                name: ResponseFieldsEditor.nextName(current),
                type: 'String',
                description: ''
            });
            rebuild('rf-name-' + (current.length - 1));
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
        new Button({ cssClass: 'e-wf-list-editor-add', isPrimary: true, content: LocaleContext.text('formFieldsAdd') }).appendTo(add);
        rebuild();
    }

    private static renderRow(
        container: HTMLElement,
        field: AiResponseFieldModel,
        index: number,
        all: AiResponseFieldModel[],
        emit: () => void,
        rebuild: (focusKey?: string) => void,
        onCommit?: ResponseFieldsCommitHandler
    ): void {
        const row: HTMLDivElement = document.createElement('div');
        row.className = 'e-wf-list-editor-row e-wf-response-field-row';
        // Attached up front so every component below is instantiated on a
        // laid-out element rather than a detached one.
        container.appendChild(row);

        const header: HTMLDivElement = document.createElement('div');
        header.className = 'e-wf-list-editor-row-header';
        const title: HTMLSpanElement = document.createElement('span');
        title.className = 'e-wf-list-editor-row-title';
        title.textContent = LocaleContext.text('formFieldRow').replace('{0}', String(index + 1));
        const remove: HTMLButtonElement = document.createElement('button');
        remove.className = 'e-wf-list-editor-remove';
        const removeLabel: string = LocaleContext.text('formFieldRemove');
        remove.setAttribute('title', removeLabel);
        remove.setAttribute('aria-label', removeLabel);
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
        body.className = 'e-wf-list-editor-row-body e-wf-response-field-row-body';
        row.appendChild(body);

        ResponseFieldsEditor.labeledInput(
            body,
            'Name',
            'text',
            String(field.name || ''),
            'rf-name-' + index,
            (value: string) => {
                field.name = value;
                emit();
            },
            'JSON key, e.g. priority'
        );

        const typeWrap: HTMLDivElement = document.createElement('div');
        typeWrap.className = 'e-wf-list-editor-subfield';
        const typeCaption: HTMLSpanElement = document.createElement('span');
        typeCaption.className = 'e-wf-list-editor-sublabel';
        typeCaption.textContent = LocaleContext.text('formFieldType');
        const typeElement: HTMLInputElement = document.createElement('input');
        typeElement.type = 'text';
        typeElement.setAttribute('data-wf-focus', 'rf-type-' + index);
        typeWrap.appendChild(typeCaption);
        typeWrap.appendChild(typeElement);
        body.appendChild(typeWrap);
        const typeSelect: DropDownList = new DropDownList({
            cssClass: 'e-wf-property-input',
            dataSource: AI_RESPONSE_FIELD_TYPES.slice() as string[],
            value: ResponseFieldsEditor.normalizeType(field.type),
            change: (args: DropDownChangeEventArgs) => {
                const next: unknown = args && args.value !== undefined && args.value !== null ? args.value : '';
                field.type = String(next);
                emit();
            }
        });
        typeSelect.appendTo(typeElement);
        typeSelect.element.setAttribute('aria-label', LocaleContext.text('formFieldTypeAria').replace('{0}', String(index + 1)));

        ResponseFieldsEditor.labeledInput(
            body,
            'Description',
            'text',
            String(field.description || ''),
            'rf-desc-' + index,
            (value: string) => {
                field.description = value;
                emit();
            },
            'Optional hint for the model'
        );

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
        const wrap: HTMLDivElement = document.createElement('div');
        wrap.className = 'e-wf-list-editor-subfield';
        const caption: HTMLSpanElement = document.createElement('span');
        caption.className = 'e-wf-list-editor-sublabel';
        caption.textContent = label;
        const element: HTMLInputElement = document.createElement('input');
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
        // DOM `change` fires once on blur/Enter so per-keystroke input does
        // not queue rapid-fire property events from the host binding.
        input.element.addEventListener('change', () => onChange(input.element.value));
    }

    private static nextName(fields: AiResponseFieldModel[]): string {
        let n: number = fields.length + 1;
        const used: { [name: string]: boolean } = Object.create(null);
        fields.forEach((f: AiResponseFieldModel) => {
            if (f.name) {
                used[f.name] = true;
            }
        });
        while (used['field' + n]) {
            n++;
        }
        return 'field' + n;
    }

    private static normalizeType(type?: string): string {
        const raw: string = String(type || 'String').trim();
        if (!raw) {
            return 'String';
        }
        const match: string | undefined = AI_RESPONSE_FIELD_TYPES.find(
            (t: string) => t.toLowerCase() === raw.toLowerCase()
        );
        return match || 'String';
    }

    private static cloneField(field: AiResponseFieldModel): AiResponseFieldModel {
        const next: AiResponseFieldModel = {
            name: field.name || '',
            type: ResponseFieldsEditor.normalizeType(field.type)
        };
        const description: string = field.description === undefined || field.description === null
            ? ''
            : String(field.description);
        if (description) {
            next.description = description;
        }
        return next;
    }
}
