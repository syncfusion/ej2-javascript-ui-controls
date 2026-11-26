/**
 * Structured Set Variable assignments editor.
 * Each row: variableName, isMathOperation toggle, value OR first/operator/second.
 * Values are stored under $.variables only at runtime.
 */

import { L10n } from '@syncfusion/ej2-base';
import { TextBox } from '@syncfusion/ej2-inputs';
import { DropDownList, ChangeEventArgs as DropDownChangeEventArgs } from '@syncfusion/ej2-dropdowns';
import { Button, CheckBox, ChangeEventArgs as CheckBoxChangeEventArgs } from '@syncfusion/ej2-buttons';
import { WorkflowVariableAssignment } from '../../models/workflow-step-props';
import { WorkflowVariableOperator, WorkflowVariableValueType } from '../../models/workflow-enums';
import { VARIABLE_OPERATORS } from './editor-constants';
import { HelpPopup, buildHelpTitle } from '../property-panel';
import { EditorComponents, EditorExpressionTarget } from './editor-components';
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
function variableFormatTemplate(value: string, args: string[]): string {
    return args.reduce<string>((acc: string, arg: string, index: number) => {
        return acc.replace('{' + index + '}', arg);
    }, value);
}

/**
 * Resolve a localised string from the active L10n bundle, with a fallback
 * to the bundled English string.
 *
 * @param {L10n | undefined} l10n The l10n.
 * @param {string} key The key.
 * @param {string[]} [args] The args.
 * @returns {string} The resolved string.
 * @private
 */
function variableResolveCaption(l10n: L10n | undefined, key: string, args?: string[]): string {
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
        return variableFormatTemplate(value, args);
    }
    return value;
}

/**
 * Variables Change Handler.
 *
 * @private
 */
export type VariablesChangeHandler = (variables: WorkflowVariableAssignment[]) => void;
/**
 * Variables Commit Handler.
 *
 * @private
 */
export type VariablesCommitHandler = () => void;

/**
 * Optional expression-picker hook for value / firstValue / secondValue inputs.
 *
 * @private
 */
export interface VariableExpressionHooks {
    attachExpression?: (input: EditorExpressionTarget) => void;
}

/**
 * Renders add/remove variable assignment cards.
 *
 * @private
 */
export class VariablesEditor {
    private static l10n: L10n | undefined;
    private static locator: ServiceLocator | undefined;

    /**
     * Mirror the host's L10n instance (and the shared service locator) into
     * this static editor. See `FormFieldsEditor.setLocale` for the resolver
     * contract.
     *
     * @param {L10n} [l10n] The optional L10n instance to use.
     * @param {ServiceLocator} [locator] The optional shared service locator.
     * @returns {void} Nothing.
     * @private
     */
    public static setLocale(l10n?: L10n, locator?: ServiceLocator): void {
        VariablesEditor.l10n = l10n;
        VariablesEditor.locator = locator;
    }

    /**
     * Resolve a localised string for a key. Mirrors `FormFieldsEditor.t`.
     *
     * @param {string} key The key.
     * @param {string[]} [args] The args.
     * @returns {string} The resolved string.
     * @private
     */
    private static t(key: string, args?: string[]): string {
        return variableResolveCaption(
            resolveEditorL10n(VariablesEditor.locator, VariablesEditor.l10n),
            key,
            args
        );
    }

    /**
     * Render.
     *
     * @param {HTMLElement} host The host.
     * @param {WorkflowVariableAssignment} variables The variables.
     * @param {VariablesChangeHandler} onChange The on change.
     * @param {VariableExpressionHooks} hooks The hooks.
     * @param {VariablesCommitHandler} onCommit The on commit.
     * @returns {void} Nothing.
     * @private
     */
    public static render(
        host: HTMLElement,
        variables: WorkflowVariableAssignment[],
        onChange: VariablesChangeHandler,
        hooks?: VariableExpressionHooks,
        onCommit?: VariablesCommitHandler
    ): void {
        const root: HTMLDivElement = document.createElement('div');
        root.className = 'e-wf-list-editor e-wf-variables-editor';

        const headingText: string = VariablesEditor.t('Variables');
        const helpDescription: string = 'Store reusable values that later steps can access. <br><br>'
                + 'Use <strong>simple mode</strong> to store a single value, or enable <strong>math mode</strong> to evaluate an expression with two values and an operator.';
        const helpPopup: HelpPopup = new HelpPopup();
        const titleRow: HTMLDivElement = buildHelpTitle(
            headingText,
            headingText,
            helpDescription,
            helpPopup
        );

        const list: HTMLDivElement = document.createElement('div');
        list.className = 'e-wf-list-editor-items';

        const clone: (source: WorkflowVariableAssignment[]) => WorkflowVariableAssignment[] =
            (source: WorkflowVariableAssignment[]): WorkflowVariableAssignment[] => {
                return source.map((item: WorkflowVariableAssignment) => VariablesEditor.cloneAssignment(item));
            };
        const current: WorkflowVariableAssignment[] = clone(Array.isArray(variables) ? variables : []);

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
                empty.textContent = VariablesEditor.t('variableEmpty');
                list.appendChild(empty);
            }
            current.forEach((item: WorkflowVariableAssignment, index: number) => {
                VariablesEditor.renderRow(list, item, index, current, emit, rebuild, hooks, onCommit);
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
            current.push(VariablesEditor.defaultAssignment(current));
            rebuild('var-name-' + (current.length - 1));
            emit();
            if (onCommit) {
                onCommit();
            }
        });
        toolbar.appendChild(add);

        root.appendChild(titleRow);
        root.appendChild(list);
        root.appendChild(toolbar);
        host.appendChild(root);
        // Mounted after the host is attached: an EJ2 component initialised
        // while detached measures zero.
        new Button({ cssClass: 'e-wf-list-editor-add', isPrimary: true, content: VariablesEditor.t('variableAdd') }).appendTo(add);
        rebuild();
    }

    private static renderRow(
        container: HTMLElement,
        item: WorkflowVariableAssignment,
        index: number,
        all: WorkflowVariableAssignment[],
        emit: () => void,
        rebuild: (focusKey?: string) => void,
        hooks?: VariableExpressionHooks,
        onCommit?: VariablesCommitHandler
    ): void {
        const row: HTMLDivElement = document.createElement('div');
        row.className = 'e-wf-list-editor-row e-wf-variable-row';
        // Attached up front so every component below is instantiated on a
        // laid-out element rather than a detached one.
        container.appendChild(row);

        const header: HTMLDivElement = document.createElement('div');
        header.className = 'e-wf-list-editor-row-header';
        const title: HTMLSpanElement = document.createElement('span');
        title.className = 'e-wf-list-editor-row-title';
        title.textContent = VariablesEditor.t('variableRow', [String(index + 1)]);
        const remove: HTMLButtonElement = document.createElement('button');
        remove.className = 'e-wf-list-editor-remove';
        remove.setAttribute('aria-label', VariablesEditor.t('variableRemove'));
        remove.setAttribute('title', VariablesEditor.t('variableRemove'));
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
        body.className = 'e-wf-list-editor-row-body e-wf-variable-row-body';
        row.appendChild(body);

        VariablesEditor.labeledInput(
            body,
            VariablesEditor.t('variableName'),
            'text',
            String(item.variableName || ''),
            'var-name-' + index,
            (value: string) => {
                item.variableName = value;
                emit();
            },
            VariablesEditor.t('variableNameHelp'),
            undefined
        );

        const mathWrap: HTMLLabelElement = document.createElement('label');
        mathWrap.className = 'e-wf-list-editor-subfield e-wf-list-editor-checkbox';
        const mathElement: HTMLInputElement = document.createElement('input');
        mathElement.type = 'checkbox';
        mathElement.setAttribute('data-wf-focus', 'var-math-' + index);
        const mathCaption: HTMLSpanElement = document.createElement('span');
        mathCaption.className = 'e-wf-list-editor-sublabel';
        mathCaption.textContent = VariablesEditor.t('variableMathToggle');
        mathWrap.appendChild(mathElement);
        mathWrap.appendChild(mathCaption);
        body.appendChild(mathWrap);
        const mathInput: CheckBox = new CheckBox({
            cssClass: 'e-wf-property-input',
            checked: !!item.isMathOperation,
            change: (args: CheckBoxChangeEventArgs) => {
                item.isMathOperation = Boolean(args.checked);
                if (item.isMathOperation) {
                    if (item.operator === undefined || item.operator === null || item.operator === ('' as WorkflowVariableOperator)) {
                        item.operator = 'Add';
                    }
                    if (item.firstValue === undefined) {
                        item.firstValue = '';
                    }
                    if (item.secondValue === undefined) {
                        item.secondValue = '';
                    }
                } else if (item.value === undefined) {
                    item.value = '';
                }
                // Deferred by one task: `rebuild` clears this subtree and would
                // otherwise destroy this CheckBox while its own change handler is
                // still on the stack.
                window.setTimeout(() => {
                    rebuild('var-math-' + index);
                    emit();
                }, 0);
            }
        });
        mathInput.appendTo(mathElement);
        mathInput.element.setAttribute('aria-label', VariablesEditor.t('variableMathToggle'));

        if (item.isMathOperation) {
            VariablesEditor.labeledInput(
                body,
                VariablesEditor.t('variableFirstValue'),
                'text',
                item.firstValue === undefined || item.firstValue === null ? '' : String(item.firstValue),
                'var-first-' + index,
                (value: string) => {
                    item.firstValue = value;
                    emit();
                },
                VariablesEditor.t('variableValueHelp'),
                hooks
            );

            const opWrap: HTMLDivElement = document.createElement('div');
            opWrap.className = 'e-wf-list-editor-subfield';
            const opCaption: HTMLSpanElement = document.createElement('span');
            opCaption.className = 'e-wf-list-editor-sublabel';
            opCaption.textContent = VariablesEditor.t('variableOperator');
            const opElement: HTMLInputElement = document.createElement('input');
            opElement.type = 'text';
            opElement.setAttribute('data-wf-focus', 'var-op-' + index);
            opWrap.appendChild(opCaption);
            opWrap.appendChild(opElement);
            body.appendChild(opWrap);
            const opSelect: DropDownList = new DropDownList({
                cssClass: 'e-wf-property-input',
                dataSource: VARIABLE_OPERATORS.slice() as string[],
                value: String(item.operator || 'Add'),
                change: (args: DropDownChangeEventArgs) => {
                    const next: unknown = args && args.value !== undefined && args.value !== null ? args.value : '';
                    item.operator = String(next) as WorkflowVariableOperator;
                    emit();
                }
            });
            opSelect.appendTo(opElement);
            opSelect.element.setAttribute(
                'aria-label',
                VariablesEditor.t('variableOperatorAria', [String(index + 1)])
            );

            VariablesEditor.labeledInput(
                body,
                VariablesEditor.t('variableSecondValue'),
                'text',
                item.secondValue === undefined || item.secondValue === null ? '' : String(item.secondValue),
                'var-second-' + index,
                (value: string) => {
                    item.secondValue = value;
                    emit();
                },
                VariablesEditor.t('variableValueHelp'),
                hooks
            );
        } else {
            VariablesEditor.labeledInput(
                body,
                VariablesEditor.t('variableValue'),
                'text',
                item.value === undefined || item.value === null ? '' : String(item.value),
                'var-value-' + index,
                (value: string) => {
                    item.value = value;
                    emit();
                },
                VariablesEditor.t('variableValueHelp'),
                hooks
            );

            const typeWrap: HTMLDivElement = document.createElement('div');
            typeWrap.className = 'e-wf-list-editor-subfield';
            const typeCaption: HTMLSpanElement = document.createElement('span');
            typeCaption.className = 'e-wf-list-editor-sublabel';
            typeCaption.textContent = VariablesEditor.t('variableValueType');
            const typeElement: HTMLInputElement = document.createElement('input');
            typeElement.type = 'text';
            typeElement.setAttribute('data-wf-focus', 'var-type-' + index);
            typeWrap.appendChild(typeCaption);
            typeWrap.appendChild(typeElement);
            body.appendChild(typeWrap);
            const typeSelect: DropDownList = new DropDownList({
                cssClass: 'e-wf-property-input',
                dataSource: ['Auto', 'String', 'Number', 'Boolean', 'Json'],
                value: String(item.valueType || 'Auto'),
                change: (args: DropDownChangeEventArgs) => {
                    const next: string = args && args.value ? String(args.value) : 'Auto';
                    if (next === 'Auto') {
                        delete item.valueType;
                    } else {
                        item.valueType = next as WorkflowVariableValueType;
                    }
                    emit();
                }
            });
            typeSelect.appendTo(typeElement);
            typeSelect.element.setAttribute('aria-label', VariablesEditor.t('variableValueType') + ' ' + String(index + 1));
        }

    }

    private static labeledInput(
        container: HTMLElement,
        label: string,
        inputType: string,
        value: string,
        focusKey: string,
        onChange: (value: string) => void,
        placeholder?: string,
        hooks?: VariableExpressionHooks
    ): void {
        const wrap: HTMLDivElement = document.createElement('div');
        wrap.className = 'e-wf-list-editor-subfield';
        const caption: HTMLSpanElement = document.createElement('span');
        caption.className = 'e-wf-list-editor-sublabel';
        caption.textContent = label;

        const row: HTMLDivElement = document.createElement('div');
        row.className = hooks && hooks.attachExpression
            ? 'e-wf-property-input-row e-wf-property-input-row-expression'
            : 'e-wf-property-input-row';

        const element: HTMLInputElement = document.createElement('input');
        element.type = inputType;
        element.setAttribute('data-wf-focus', focusKey);
        row.appendChild(element);
        wrap.appendChild(caption);
        wrap.appendChild(row);
        container.appendChild(wrap);

        const input: TextBox = new TextBox({
            cssClass: 'e-wf-property-input',
            value: value,
            placeholder: placeholder || ''
        });
        input.appendTo(element);
        input.element.setAttribute('aria-label', label);
        // Use the DOM `change` event so per-keystroke input does not
        // queue rapid-fire property events. The model is still reactive
        // via other refresh paths (label sync runs on blur in the panel).
        input.element.addEventListener('change', () => onChange(input.element.value));
        if (hooks && hooks.attachExpression) {
            // The component is handed to the picker rather than the raw
            // element so writes go through the instance.
            hooks.attachExpression(input);
        }
    }

    private static defaultAssignment(existing: WorkflowVariableAssignment[]): WorkflowVariableAssignment {
        return {
            variableName: VariablesEditor.nextName(existing),
            value: '',
            isMathOperation: false
        };
    }

    private static nextName(items: WorkflowVariableAssignment[]): string {
        // New rows are named "variable"; suffix when that name is taken.
        const used: { [name: string]: boolean } = Object.create(null);
        items.forEach((item: WorkflowVariableAssignment) => {
            if (item.variableName) {
                used[item.variableName] = true;
            }
        });
        if (!used.variable) {
            return 'variable';
        }
        let n: number = 2;
        while (used['variable' + n]) {
            n++;
        }
        return 'variable' + n;
    }

    private static cloneAssignment(item: WorkflowVariableAssignment): WorkflowVariableAssignment {
        const next: WorkflowVariableAssignment = {
            variableName: item.variableName || '',
            isMathOperation: !!item.isMathOperation
        };
        // Prefer legacy `name` if variableName was empty.
        if (!next.variableName && (item as { name?: string }).name) {
            next.variableName = String((item as { name?: string }).name);
        }
        if (item.value !== undefined) {
            next.value = item.value;
        }
        if (item.valueType !== undefined) {
            next.valueType = item.valueType;
        }
        if (item.firstValue !== undefined) {
            next.firstValue = item.firstValue;
        }
        if (item.secondValue !== undefined) {
            next.secondValue = item.secondValue;
        }
        if (item.operator !== undefined) {
            next.operator = item.operator;
        }
        return next;
    }
}
