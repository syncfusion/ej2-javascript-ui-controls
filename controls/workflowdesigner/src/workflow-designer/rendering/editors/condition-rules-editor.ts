/**
 * Structured ConditionRule list editor for Condition and Filter steps.
 * Field and value accept both {{$.path}} expressions and direct literals.
 */

import { L10n } from '@syncfusion/ej2-base';
import { TextBox } from '@syncfusion/ej2-inputs';
import { DropDownList, ChangeEventArgs as DropDownChangeEventArgs } from '@syncfusion/ej2-dropdowns';
import { Button } from '@syncfusion/ej2-buttons';
import { ConditionRule } from '../../models/workflow-shared-types';
import {
    WorkflowConditionOperator,
    WorkflowConditionValueType
} from '../../models/workflow-enums';
import {
    CONDITION_VALUE_TYPES,
    coerceOperatorForValueType,
    editorDropdownItems,
    operatorNeedsValue,
    operatorsForValueType
} from './editor-constants';
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
function conditionFormatTemplate(value: string, args: string[]): string {
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
function conditionResolveCaption(l10n: L10n | undefined, key: string, args?: string[]): string {
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
        return conditionFormatTemplate(value, args);
    }
    return value;
}

/**
 * Condition Rules Change Handler.
 *
 * @private
 */
export type ConditionRulesChangeHandler = (rules: ConditionRule[]) => void;
/**
 * Condition Rules Commit Handler.
 *
 * @private
 */
export type ConditionRulesCommitHandler = () => void;

/**
 * Condition Rule Expression Hooks.
 *
 * @private
 */
export interface ConditionRuleExpressionHooks {
    /** Attach runtime-context picker to an expression-capable input. */
    attachExpression?: (input: EditorExpressionTarget) => void;
    /** Attach the item-field picker used by Filter rules. */
    attachFieldExpression?: (input: EditorExpressionTarget) => void;
}

/**
 * Renders add/remove condition rows: field, valueType, operator, value.
 *
 * @private
 */
export class ConditionRulesEditor {
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
        ConditionRulesEditor.l10n = l10n;
        ConditionRulesEditor.locator = locator;
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
        return conditionResolveCaption(
            resolveEditorL10n(ConditionRulesEditor.locator, ConditionRulesEditor.l10n),
            key,
            args
        );
    }

    /**
     * Render.
     *
     * @param {HTMLElement} host The host.
     * @param {ConditionRule} rules The rules.
     * @param {ConditionRulesChangeHandler} onChange The on change.
     * @param {ConditionRuleExpressionHooks} hooks The hooks.
     * @param {ConditionRulesCommitHandler} onCommit The on commit.
     * @param {L10n} [l10n] Optional L10n override for this render.
     * @returns {void} Nothing.
     * @private
     */
    public static render(
        host: HTMLElement,
        rules: ConditionRule[],
        onChange: ConditionRulesChangeHandler,
        hooks?: ConditionRuleExpressionHooks,
        onCommit?: ConditionRulesCommitHandler
    ): void {
        const root: HTMLDivElement = document.createElement('div');
        root.className = 'e-wf-list-editor e-wf-condition-rules-editor';

        const list: HTMLDivElement = document.createElement('div');
        list.className = 'e-wf-list-editor-items';

        const current: ConditionRule[] = ConditionRulesEditor.cloneRules(Array.isArray(rules) ? rules : []);

        const emit: () => void = (): void => {
            onChange(ConditionRulesEditor.cloneRules(current));
        };

        const rebuild: () => void = (): void => {
            // Components must be disposed before the rows are discarded;
            // clearing `innerHTML` alone would orphan every instance.
            EditorComponents.clear(list);
            if (!current.length) {
                const empty: HTMLDivElement = document.createElement('div');
                empty.className = 'e-wf-list-editor-empty';
                empty.textContent = ConditionRulesEditor.t('conditionEmpty');
                list.appendChild(empty);
            }
            current.forEach((rule: ConditionRule, index: number) => {
                ConditionRulesEditor.renderRow(list, rule, index, current, emit, rebuild, hooks, onCommit);
            });
        };

        const toolbar: HTMLDivElement = document.createElement('div');
        toolbar.className = 'e-wf-list-editor-toolbar';
        const add: HTMLButtonElement = document.createElement('button');
        add.className = 'e-wf-list-editor-add';
        add.addEventListener('click', () => {
            current.push(ConditionRulesEditor.defaultRule());
            rebuild();
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
        new Button({ cssClass: 'e-wf-list-editor-add', isPrimary: true, content: ConditionRulesEditor.t('conditionAdd') }).appendTo(add);
        rebuild();
    }

    /**
     * Single condition rule block (reused by Switch branch editor).
     *
     * @param {HTMLElement} host The editor host.
     * @param {ConditionRule} rule The condition rule.
     * @param {Function} onChange The rule change callback.
     * @param {ConditionRuleExpressionHooks} hooks Optional expression hooks.
     * @returns {void}
     * @private
     */
    public static renderSingleRule(
        host: HTMLElement,
        rule: ConditionRule,
        onChange: (rule: ConditionRule) => void,
        hooks?: ConditionRuleExpressionHooks
    ): void {
        const working: ConditionRule = ConditionRulesEditor.cloneRule(rule);
        const wrap: HTMLDivElement = document.createElement('div');
        wrap.className = 'e-wf-condition-rule-block';
        // Attached before the first paint so every component below mounts on
        // an element that is already in the document.
        host.appendChild(wrap);
        const paint: () => void = (): void => {
            EditorComponents.clear(wrap);
            ConditionRulesEditor.fillRuleFields(wrap, working, () => {
                onChange(ConditionRulesEditor.cloneRule(working));
            }, paint, hooks);
        };
        paint();
    }

    /**
     * Default Rule.
     *
     * @returns {ConditionRule} The result.
     * @private
     */
    public static defaultRule(): ConditionRule {
        return {
            field: '',
            valueType: 'String',
            operator: 'Equal',
            value: ''
        };
    }

    /**
     * Clone Rules.
     *
     * @param {ConditionRule} rules The rules.
     * @returns {ConditionRule} The result.
     * @private
     */
    public static cloneRules(rules: ConditionRule[]): ConditionRule[] {
        return rules.map((rule: ConditionRule) => ConditionRulesEditor.cloneRule(rule));
    }

    /**
     * Clone Rule.
     *
     * @param {ConditionRule} rule The rule.
     * @returns {ConditionRule} The result.
     * @private
     */
    public static cloneRule(rule: ConditionRule): ConditionRule {
        const next: ConditionRule = {
            field: rule && rule.field ? String(rule.field) : '',
            valueType: (rule && rule.valueType) || 'String',
            operator: (rule && rule.operator) || 'Equal'
        };
        if (rule && rule.value !== undefined) {
            next.value = rule.value;
        }
        return next;
    }

    private static renderRow(
        container: HTMLElement,
        rule: ConditionRule,
        index: number,
        all: ConditionRule[],
        emit: () => void,
        rebuild: () => void,
        hooks?: ConditionRuleExpressionHooks,
        onCommit?: ConditionRulesCommitHandler
    ): void {
        const row: HTMLDivElement = document.createElement('div');
        row.className = 'e-wf-list-editor-row e-wf-condition-rule-row';
        // Attached up front so every component below is instantiated on a
        // laid-out element rather than a detached one.
        container.appendChild(row);

        const header: HTMLDivElement = document.createElement('div');
        header.className = 'e-wf-list-editor-row-header';
        const title: HTMLSpanElement = document.createElement('span');
        title.className = 'e-wf-list-editor-row-title';
        title.textContent = ConditionRulesEditor.t('conditionRow', [String(index + 1)]);
        const remove: HTMLButtonElement = document.createElement('button');
        remove.className = 'e-wf-list-editor-remove';
        remove.setAttribute('title', ConditionRulesEditor.t('conditionRemove'));
        remove.setAttribute('aria-label', ConditionRulesEditor.t('conditionRemove'));
        remove.addEventListener('click', () => {
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
        body.className = 'e-wf-condition-rule-body';
        row.appendChild(body);
        const paint: () => void = (): void => {
            EditorComponents.clear(body);
            ConditionRulesEditor.fillRuleFields(body, rule, emit, paint, hooks);
        };
        paint();
    }

    private static fillRuleFields(
        host: HTMLElement,
        rule: ConditionRule,
        emit: () => void,
        rebuild: () => void,
        hooks?: ConditionRuleExpressionHooks
    ): void {
        ConditionRulesEditor.expressionField(
            host,
            ConditionRulesEditor.t('conditionField'),
            String(rule.field || ''),
            (value: string) => {
                // Parse JSON literals in field (e.g., [1,2,3], {"key":"value"}) so they're properly resolved
                const isExpression: boolean = value.indexOf('{{') !== -1 || value.indexOf('$.') === 0;
                if (!isExpression) {
                    const trimmedValue: string = value.trim();
                    if ((trimmedValue.startsWith('[') && trimmedValue.endsWith(']')) ||
                        (trimmedValue.startsWith('{') && trimmedValue.endsWith('}'))) {
                        try {
                            // Store as JSON string, but mark it for later parsing
                            // The ExpressionEvaluator will parse it during resolution
                            rule.field = trimmedValue;
                        } catch (e) {
                            rule.field = value;
                        }
                    } else {
                        rule.field = value;
                    }
                } else {
                    rule.field = value;
                }
                emit();
            },
            hooks,
            'text',
            true
        );

        const typeWrap: HTMLLabelElement = document.createElement('label');
        typeWrap.className = 'e-wf-list-editor-subfield';
        const typeCaption: HTMLSpanElement = document.createElement('span');
        typeCaption.className = 'e-wf-list-editor-sublabel';
        typeCaption.textContent = ConditionRulesEditor.t('conditionValueType');
        const typeElement: HTMLInputElement = document.createElement('input');
        typeElement.type = 'text';
        typeWrap.appendChild(typeCaption);
        typeWrap.appendChild(typeElement);

        const opWrap: HTMLLabelElement = document.createElement('label');
        opWrap.className = 'e-wf-list-editor-subfield';
        const opCaption: HTMLSpanElement = document.createElement('span');
        opCaption.className = 'e-wf-list-editor-sublabel';
        opCaption.textContent = ConditionRulesEditor.t('conditionOperator');
        const opElement: HTMLInputElement = document.createElement('input');
        opElement.type = 'text';
        opWrap.appendChild(opCaption);
        opWrap.appendChild(opElement);

        const typeOpRow: HTMLDivElement = document.createElement('div');
        typeOpRow.className = 'e-wf-list-editor-subfield-row';
        typeOpRow.appendChild(typeWrap);
        typeOpRow.appendChild(opWrap);
        host.appendChild(typeOpRow);

        // Coerce stale operators left from a previous value type. Kept ahead
        // of the operator list build, exactly as in the native version.
        const allowedOperators: WorkflowConditionOperator[] =
            operatorsForValueType(String(rule.valueType || 'String'));
        rule.operator = coerceOperatorForValueType(
            String(rule.operator || ''),
            String(rule.valueType || 'String')
        );

        const typeSelect: DropDownList = new DropDownList({
            cssClass: 'e-wf-property-input',
            dataSource: editorDropdownItems(CONDITION_VALUE_TYPES.slice()),
            fields: { text: 'text', value: 'value', htmlAttributes: 'htmlAttributes' },
            value: rule.valueType,
            change: (args: DropDownChangeEventArgs) => {
                const next: unknown = args && args.value !== undefined && args.value !== null ? args.value : '';
                rule.valueType = String(next) as WorkflowConditionValueType;
                rule.operator = coerceOperatorForValueType(String(rule.operator || ''), rule.valueType);
                if (!operatorNeedsValue(rule.operator)) {
                    delete rule.value;
                } else if (rule.value === undefined) {
                    rule.value = '';
                }
                // Rebuild so operator list and value control match the new
                // type. Deferred by one task: `rebuild` clears this subtree
                // and would otherwise destroy this DropDownList while its own
                // change handler is still on the stack.
                window.setTimeout(() => {
                    rebuild();
                    emit();
                }, 0);
            }
        });
        typeSelect.appendTo(typeElement);
        typeSelect.element.setAttribute('aria-label', ConditionRulesEditor.t('conditionValueType'));

        const opSelect: DropDownList = new DropDownList({
            cssClass: 'e-wf-property-input',
            dataSource: editorDropdownItems(allowedOperators.slice()),
            fields: { text: 'text', value: 'value', htmlAttributes: 'htmlAttributes' },
            value: rule.operator,
            change: (args: DropDownChangeEventArgs) => {
                const next: unknown = args && args.value !== undefined && args.value !== null ? args.value : '';
                rule.operator = String(next) as WorkflowConditionOperator;
                if (!operatorNeedsValue(rule.operator)) {
                    delete rule.value;
                } else if (rule.value === undefined) {
                    rule.value = '';
                }
                window.setTimeout(() => {
                    rebuild();
                    emit();
                }, 0);
            }
        });
        opSelect.appendTo(opElement);
        opSelect.element.setAttribute('aria-label', ConditionRulesEditor.t('conditionOperator'));

        if (operatorNeedsValue(String(rule.operator || ''))) {
            // Convert value to display string, handling arrays specially
            let valueStr: string;
            if (rule.value === undefined || rule.value === null) {
                valueStr = '';
            } else if (Array.isArray(rule.value)) {
                // Serialize arrays as JSON for proper display
                valueStr = JSON.stringify(rule.value);
            } else {
                valueStr = String(rule.value);
            }
            ConditionRulesEditor.expressionField(
                host,
                ConditionRulesEditor.t('conditionValue'),
                valueStr,
                (value: string) => {
                    // Only apply type conversion for direct values, not expressions
                    const isExpression: boolean = value.indexOf('{{') !== -1 || value.indexOf('$.') === 0;

                    if (!isExpression) {
                        if (rule.valueType === 'Number' && value !== '') {
                            // Parse number more robustly
                            const num: number = Number(value);
                            rule.value = isNaN(num) ? value : num;
                        } else if (rule.valueType === 'Boolean') {
                            // Handle boolean string values
                            if (value === 'true') {
                                rule.value = true;
                            } else if (value === 'false') {
                                rule.value = false;
                            } else {
                                rule.value = value;
                            }
                        } else if (rule.valueType === 'Array' && value !== '') {
                            // Try to parse array literals like [1,2,3] or ["a","b","c"]
                            const trimmedValue: string = value.trim();
                            if (trimmedValue.startsWith('[') && trimmedValue.endsWith(']')) {
                                try {
                                    const parsed: unknown = JSON.parse(trimmedValue);
                                    if (Array.isArray(parsed)) {
                                        rule.value = parsed;
                                    } else {
                                        rule.value = value;
                                    }
                                } catch (e) {
                                    // If JSON parsing fails, keep the original string
                                    rule.value = value;
                                }
                            } else {
                                rule.value = value;
                            }
                        } else {
                            rule.value = value;
                        }
                    } else {
                        // For expressions, keep them as-is for resolution by ExpressionEvaluator
                        rule.value = value;
                    }
                    emit();
                },
                hooks,
                'text'
            );
        }
    }

    /**
     * Appends one labelled, expression-capable field to `host`.
     *
     * The field is attached before its TextBox is mounted so the component
     * never initialises on a detached element.
     *
     * @param {HTMLElement} host The container to append to.
     * @param {string} label The field label and accessible name.
     * @param {string} value The initial value.
     * @param {Function} onChange Invoked on commit (blur / Enter).
     * @param {ConditionRuleExpressionHooks} hooks Optional expression hooks.
     * @param {string} inputType The underlying input type.
     * @param {boolean} itemField Whether this is a Filter item field.
     * @returns {void}
     */
    private static expressionField(
        host: HTMLElement,
        label: string,
        value: string,
        onChange: (value: string) => void,
        hooks?: ConditionRuleExpressionHooks,
        inputType: string = 'text',
        itemField: boolean = false
    ): void {
        const wrap: HTMLLabelElement = document.createElement('label');
        wrap.className = 'e-wf-list-editor-subfield';
        const caption: HTMLSpanElement = document.createElement('span');
        caption.className = 'e-wf-list-editor-sublabel';
        caption.textContent = label;
        const row: HTMLDivElement = document.createElement('div');
        row.className = hooks && (itemField ? hooks.attachFieldExpression : hooks.attachExpression)
            ? 'e-wf-property-input-row e-wf-property-input-row-expression'
            : 'e-wf-property-input-row';
        const element: HTMLInputElement = document.createElement('input');
        // `number` / `date` literals keep their native input behaviour inside
        // the themed TextBox wrapper; the type is set before mounting so the
        // component wraps the element as-is.
        element.type = inputType;
        row.appendChild(element);
        wrap.appendChild(caption);
        wrap.appendChild(row);
        host.appendChild(wrap);

        const input: TextBox = new TextBox({
            cssClass: 'e-wf-property-input',
            value: value
        });
        input.appendTo(element);
        input.element.setAttribute('aria-label', label);
        input.element.addEventListener('change', () => onChange(input.element.value));

        // The component is handed to the picker rather than the raw element
        // so writes go through the instance and it cannot go stale.
        if (hooks && itemField && hooks.attachFieldExpression) {
            hooks.attachFieldExpression(input);
        } else if (hooks && hooks.attachExpression) {
            hooks.attachExpression(input);
        }
    }
}
