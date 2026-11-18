import { L10n, createElement } from '@syncfusion/ej2-base';
import { TextBox } from '@syncfusion/ej2-inputs';
import { RadioButton } from '@syncfusion/ej2-buttons';
import { CustomValidationEngine } from '@syncfusion/ej2-form-renderer';

/** @private */
export interface CustomValidationRule {
    condition?: any;
    expression?: string;
}

/** @private */
export interface CustomValidationEditorProps {
    componentFields: any[];
    excludeFieldId?: string;
    existingRules?: CustomValidationRule[];
    values?: any;
    l10n: L10n;
    enableRtl?: boolean;
    onChange: (rules: CustomValidationRule[]) => void;
}

/** @private */
interface ConditionRule {
    id: string;
    condition: string;
    errors: string[];
}

/** @private */
export class CustomValidationEditor {
    public element: HTMLElement;
    public props: CustomValidationEditorProps;

    private l10nProvider: L10n;
    private validationEngine: CustomValidationEngine;
    private errorMessage: string;
    private errorMessageError: string;
    private logicalOp: 'and' | 'or';
    private rules: ConditionRule[];
    private availableFields: string[];
    private rootElement: HTMLElement | null;

    constructor(element: HTMLElement, props: CustomValidationEditorProps) {
        this.element = element;
        this.props = props;
        this.l10nProvider = props.l10n;
        this.validationEngine = new CustomValidationEngine();
        this.errorMessage = 'Please enter a valid value.';
        this.errorMessageError = '';
        this.logicalOp = 'and';
        this.rules = [];
        this.availableFields = (props.componentFields || [])
            .filter(function (component: any) {
                return component && component.name !== props.excludeFieldId;
            })
            .map(function (component: any) {
                return component.name;
            });
        this.rootElement = null;
        this.initializeExistingRules();
        this.render();
    }

    private initializeExistingRules(): void {
        const existingRules: CustomValidationRule[] = this.props.existingRules || [];
        if (existingRules.length > 0 && existingRules[0].expression) {
            const parsed = this.validationEngine.parseExpression(existingRules[0].expression);
            if (parsed) {
                this.errorMessage = parsed.errorMessage;
                const condition: string = parsed.condition;
                let detectedOp: 'and' | 'or' = 'and';
                let splitConditions: string[] = [];

                if (condition.indexOf(' || ') !== -1) {
                    detectedOp = 'or';
                    splitConditions = this.splitConditionsByOperator(condition, '||');
                } else if (condition.indexOf(' && ') !== -1) {
                    detectedOp = 'and';
                    splitConditions = this.splitConditionsByOperator(condition, '&&');
                } else {
                    splitConditions = [condition];
                }

                this.logicalOp = detectedOp;
                const newRules: ConditionRule[] = splitConditions.map(function (ruleCondition: string, idx: number) {
                    return {
                        id: (idx + 1).toString(),
                        condition: ruleCondition.trim(),
                        errors: [] as any
                    };
                });

                this.rules = newRules;
            }
        }
    }

    private splitConditionsByOperator(expression: string, operator: string): string[] {
        const conditions: string[] = [];
        let current: string = '';
        let depth: number = 0;

        for (let i: number = 0; i < expression.length; i++) {
            const char: string = expression.charAt(i);

            if (char === '(') {
                depth++;
            } else if (char === ')') {
                depth--;
            }

            if (depth === 0 && expression.substr(i, operator.length) === operator) {
                conditions.push(current.trim());
                current = '';
                i += operator.length - 1;
            } else {
                current += char;
            }
        }

        if (current.trim()) {
            conditions.push(current.trim());
        }

        return conditions.map(function (condition: string) {
            let normalized: string = condition.trim();
            if (normalized.charAt(0) === '(' && normalized.charAt(normalized.length - 1) === ')') {
                normalized = normalized.substring(1, normalized.length - 1).trim();
            }
            return normalized;
        });
    }

    private handleConditionChange(id: string, condition: string): void {
        const errors: string[] = this.validationEngine.validateConditionSyntax(condition, this.availableFields);
        const updatedRules: ConditionRule[] = this.rules.map(function (rule: ConditionRule) {
            if (rule.id === id) {
                return {
                    id: rule.id,
                    condition: condition,
                    errors: errors
                };
            }
            return rule;
        });

        this.rules = updatedRules;
        this.notifyParent();
        this.render();
    }

    private handleErrorMessageChange(value: string): void {
        this.errorMessage = value || '';
        this.notifyParent();
    }

    private handleLogicalOpChange(op: 'and' | 'or'): void {
        this.logicalOp = op;
        this.notifyParent();
        this.render();
    }

    private addRule(): void {
        this.rules.push({
            id: new Date().getTime().toString(),
            condition: '',
            errors: []
        });
        this.render();
    }

    private removeRule(id: string): void {
        if (this.rules.length > 1) {
            this.rules = this.rules.filter(function (rule: ConditionRule) {
                return rule.id !== id;
            });
            this.notifyParent();
            this.render();
        } else {
            this.clearAll();
        }
    }

    private clearAll(): void {
        this.errorMessage = '';
        this.errorMessageError = '';
        this.logicalOp = 'and';
        this.rules = [];
        this.props.onChange([]);
        this.render();
    }

    private notifyParent(): void {
        const validConditions: string[] = this.rules
            .filter(function (rule: ConditionRule) {
                return rule.condition.trim() !== '' && rule.errors.length === 0;
            })
            .map(function (rule: ConditionRule) {
                let condition: string = rule.condition.trim();
                while (condition.length > 2 && condition.charAt(0) === '(' && condition.charAt(condition.length - 1) === ')') {
                    const inner: string = condition.substring(1, condition.length - 1).trim();
                    let depth: number = 0;
                    let valid: boolean = true;

                    for (let i: number = 0; i < inner.length; i++) {
                        const current: string = inner.charAt(i);
                        if (current === '(') {
                            depth++;
                        } else if (current === ')') {
                            depth--;
                        }
                        if (depth < 0) {
                            valid = false;
                            break;
                        }
                    }

                    if (valid && depth === 0) {
                        condition = inner;
                    } else {
                        break;
                    }
                }
                return condition;
            });

        if (validConditions.length > 0 && this.errorMessage) {
            const operator: string = this.logicalOp === 'and' ? ' && ' : ' || ';
            const wrappedConditions: string[] = validConditions.map(function (condition: string) {
                return '(' + condition + ')';
            });
            const combinedCondition: string = wrappedConditions.join(operator);
            const fullExpression: string = this.validationEngine.buildExpression(combinedCondition, this.errorMessage);

            this.props.onChange([{ condition: undefined, expression: fullExpression }]);
        }
    }

    /** @private */
    public render(): void {
        if (!this.element) {
            return;
        }

        this.element.innerHTML = '';
        this.rootElement = document.createElement('div');
        this.rootElement.className = 'custom-validation-editor';
        this.rootElement.setAttribute('role', 'group');

        const labelKey: string = this.props.values && this.props.values.label ? this.props.values.label : '';
        const labelText: string = labelKey ? this.l10nProvider.getConstant(labelKey as any) || labelKey : '';
        this.rootElement.setAttribute('aria-label', labelText);

        const header: HTMLElement = document.createElement('div');
        header.style.display = 'flex';
        header.style.justifyContent = 'space-between';

        const label: HTMLLabelElement = document.createElement('label');
        label.className = 'property-label';
        label.style.fontWeight = '600';
        label.style.marginBottom = '0.5rem';
        label.style.fontSize = '0.875rem';
        label.textContent = labelText;
        header.appendChild(label);

        const actionContainer: HTMLDivElement = document.createElement('div');
        actionContainer.style.marginBottom = '0.5rem';
        const addButton: HTMLButtonElement = document.createElement('button');
        addButton.type = 'button';
        addButton.className = 'e-control e-btn e-lib e-flat';
        addButton.className += this.props.enableRtl ? ' e-rtl' : '';
        addButton.title = 'Add Condition';
        addButton.setAttribute('aria-label', this.l10nProvider.getConstant('addHeader') || 'Add Condition');
        addButton.addEventListener('click', this.addRule.bind(this));

        const icon: HTMLSpanElement = document.createElement('span');
        icon.className = 'e-btn-icon e-icons e-plus';
        addButton.appendChild(icon);

        const text: HTMLSpanElement = document.createElement('span');
        text.className = 'e-btn-text';
        text.textContent = this.l10nProvider.getConstant('addHeader') || 'Add Condition';
        addButton.appendChild(text);
        actionContainer.appendChild(addButton);
        header.appendChild(actionContainer);
        this.rootElement.appendChild(header);

        const description: HTMLDivElement = document.createElement('div');
        description.className = 'custom-validation-description';
        description.style.marginBottom = '0.75rem';

        const descriptionText: HTMLParagraphElement = document.createElement('p');
        descriptionText.className = 'property-description';
        descriptionText.textContent = this.l10nProvider.getConstant('customValidationDescription') || 'Define a custom validation condition.';
        description.appendChild(descriptionText);
        this.rootElement.appendChild(description);

        const groupContainer: HTMLDivElement = document.createElement('div');
        groupContainer.className = 'e-group-container';
        groupContainer.setAttribute('aria-describedby', 'custom-validation-description');

        if (this.rules.length > 1) {
            const groupHeader: HTMLDivElement = document.createElement('div');
            groupHeader.className = 'e-group-header';

            const logicalGroup: HTMLDivElement = document.createElement('div');
            logicalGroup.className = 'e-logical-op-radio-group';
            logicalGroup.setAttribute('role', 'radiogroup');
            logicalGroup.setAttribute('aria-label', 'Logical Operator');
            logicalGroup.style.display = 'flex';
            logicalGroup.style.flexDirection = 'column';
            logicalGroup.style.gap = '1.5rem';

            this.renderLogicalOption(logicalGroup, 'and', 'AND');
            this.renderLogicalOption(logicalGroup, 'or', 'OR');
            groupHeader.appendChild(logicalGroup);
            groupContainer.appendChild(groupHeader);
        }

        const groupBody: HTMLDivElement = document.createElement('div');
        groupBody.className = 'e-group-body';
        const ruleList: HTMLDivElement = document.createElement('div');
        ruleList.className = 'e-rule-list';

        for (let idx: number = 0; idx < this.rules.length; idx++) {
            const rule: ConditionRule = this.rules[idx as number];
            if (idx > 0) {
                const divider: HTMLDivElement = document.createElement('div');
                divider.setAttribute('aria-hidden', 'true');
                divider.style.display = 'flex';
                divider.style.alignItems = 'center';
                divider.style.gap = '8px';
                divider.style.margin = '8px 0';

                const lineLeft: HTMLDivElement = document.createElement('div');
                lineLeft.style.flex = '1';
                lineLeft.style.height = '1px';
                lineLeft.style.background = 'rgb(var(--sf-color-line-color))';

                const operatorBadge: HTMLSpanElement = document.createElement('span');
                operatorBadge.style.border = '1px solid rgb(var(--sf-color-line-color))';
                operatorBadge.style.borderRadius = '9999px';
                operatorBadge.style.padding = '2px 5px';
                operatorBadge.style.fontSize = '10px';
                operatorBadge.style.lineHeight = '1.5';
                operatorBadge.textContent = this.logicalOp === 'and' ? 'AND' : 'OR';

                const lineRight: HTMLDivElement = document.createElement('div');
                lineRight.style.flex = '1';
                lineRight.style.height = '1px';
                lineRight.style.background = 'rgb(var(--sf-color-line-color))';

                divider.appendChild(lineLeft);
                divider.appendChild(operatorBadge);
                divider.appendChild(lineRight);
                ruleList.appendChild(divider);
            }

            const ruleContainer: HTMLDivElement = document.createElement('div');
            ruleContainer.className = 'e-rule-container e-horizontal-mode';
            ruleContainer.setAttribute('role', 'group');
            ruleContainer.setAttribute('aria-label', 'Condition ' + (idx + 1));

            const ruleField: HTMLDivElement = document.createElement('div');
            ruleField.className = 'e-rule-field';

            const ruleValue: HTMLDivElement = document.createElement('div');
            ruleValue.className = 'e-rule-value';

            const valueHost: HTMLElement = createElement('input', { attrs: {
                'type': 'text',
                'aria-label': 'Condition ' + (idx + 1),
                'aria-invalid': rule.errors.length > 0 ? 'true' : 'false'
            } });
            if (rule.errors.length > 0) {
                valueHost.setAttribute('aria-describedby', 'condition-errors-' + rule.id);
            }
            const valueTextBox: TextBox = new TextBox({
                enableRtl: this.props.enableRtl,
                value: rule.condition,
                placeholder: '(input === {fieldName})',
                floatLabelType: 'Never',
                cssClass: 'custom-validation-textarea',
                change: (e: any) => {
                    this.handleConditionChange(rule.id, e.value || '');
                }
            });
            valueHost.className = 'e-input custom-validation-textarea';
            ruleValue.appendChild(valueHost);
            valueTextBox.appendTo(valueHost);
            ruleField.appendChild(ruleValue);

            const removeWrap: HTMLDivElement = document.createElement('div');
            const removeButton: HTMLButtonElement = document.createElement('button');
            removeButton.type = 'button';
            removeButton.className = 'e-btn e-small e-flat';
            removeButton.title = 'Remove this condition';
            removeButton.setAttribute('aria-label', 'Remove condition ' + (idx + 1));
            removeButton.addEventListener('click', this.createRemoveHandler(rule.id));

            const removeIcon: HTMLSpanElement = document.createElement('span');
            removeIcon.className = 'e-btn-icon e-icons e-trash';
            removeButton.appendChild(removeIcon);
            removeWrap.appendChild(removeButton);
            ruleField.appendChild(removeWrap);
            ruleContainer.appendChild(ruleField);

            if (rule.errors.length > 0) {
                const errorContainer: HTMLDivElement = document.createElement('div');
                errorContainer.className = 'custom-validation-field-errors';
                errorContainer.setAttribute('role', 'alert');
                errorContainer.setAttribute('aria-live', 'polite');

                for (let errIdx: number = 0; errIdx < rule.errors.length; errIdx++) {
                    const errorItem: HTMLDivElement = document.createElement('div');
                    errorItem.className = 'e-error';
                    errorItem.textContent = rule.errors[errIdx as number];
                    errorContainer.appendChild(errorItem);
                }
                ruleContainer.appendChild(errorContainer);
            }

            ruleList.appendChild(ruleContainer);
        }

        groupBody.appendChild(ruleList);
        groupContainer.appendChild(groupBody);
        this.rootElement.appendChild(groupContainer);

        const validationMessageRoot: HTMLDivElement = document.createElement('div');
        validationMessageRoot.className = 'custom-validation-error-message e-fb-form-group';
        validationMessageRoot.style.marginTop = '0.75rem';

        const validationLabel: HTMLLabelElement = document.createElement('label');
        validationLabel.style.fontWeight = '400';
        validationLabel.style.fontSize = '14px';
        validationLabel.textContent = (this.l10nProvider.getConstant('validationMessage') || 'Validation Message') + ' ';

        const requiredMark: HTMLSpanElement = document.createElement('span');
        requiredMark.style.color = '#e74c3c';
        requiredMark.textContent = '*';
        validationLabel.appendChild(requiredMark);
        validationMessageRoot.appendChild(validationLabel);

        const errorInputHost: HTMLElement = createElement('input', {
            attrs: {
                'type': 'text',
                'aria-labelledby': 'validation-message-label',
                'aria-required': 'true',
                'aria-invalid': this.errorMessageError ? 'true' : 'false'
            }
        });
        if (this.errorMessageError) {
            errorInputHost.setAttribute('aria-describedby', 'validation-message-error');
        }

        const errorInput: TextBox = new TextBox({
            enableRtl: this.props.enableRtl,
            value: this.errorMessage,
            placeholder: this.l10nProvider.getConstant('provideCustomValidationMessage') || 'Provide custom validation message',
            floatLabelType: 'Never',
            cssClass: 'custom-validation-error-input' + (this.errorMessageError ? ' e-error' : ''),
            change: (e: any) => {
                this.handleErrorMessageChange(e.value || '');
                if (e.value === '') {
                    this.errorMessageError = this.l10nProvider.getConstant('customValidationErrorMessage') || 'Please enter a valid value.';
                } else {
                    this.errorMessageError = '';
                }
                this.render();
            }
        });
        errorInputHost.className = 'e-input custom-validation-error-input' + (this.errorMessageError ? ' e-error' : '');
        validationMessageRoot.appendChild(errorInputHost);
        errorInput.appendTo(errorInputHost);

        if (this.errorMessageError) {
            const errorBox: HTMLDivElement = document.createElement('div');
            errorBox.className = 'e-error';
            errorBox.style.marginTop = '6px';
            errorBox.setAttribute('role', 'alert');
            errorBox.setAttribute('aria-live', 'polite');
            errorBox.textContent = this.errorMessageError;
            validationMessageRoot.appendChild(errorBox);
        }

        this.rootElement.appendChild(validationMessageRoot);
        this.element.appendChild(this.rootElement);
    }

    private renderLogicalOption(container: HTMLElement, value: 'and' | 'or', labelText: string): void {
        const wrapper: HTMLDivElement = document.createElement('div');
        wrapper.className = 'e-radio-wrapper';

        const radioHost: HTMLElement = createElement('input', {
            attrs: {
                'type': 'radio',
                'name': 'qb-logical-op',
                'aria-label': labelText
            }
        });

        const radioButton: RadioButton = new RadioButton({
            enableRtl: this.props.enableRtl,
            name: 'qb-logical-op',
            value: value,
            label: labelText,
            checked: this.logicalOp === value,
            labelPosition: 'After',
            change: (e: any) => {
                if (e && e.value !== undefined) {
                    this.handleLogicalOpChange(e.value);
                }
            }
        });

        wrapper.appendChild(radioHost);
        radioButton.appendTo(radioHost);
        container.appendChild(wrapper);
    }

    private createConditionHandler(id: string, input: HTMLInputElement): EventListener {
        return (event: Event) => {
            const target: HTMLInputElement = event.target as HTMLInputElement;
            this.handleConditionChange(id, target.value);
            input.value = target.value;
        };
    }

    private createRemoveHandler(id: string): EventListener {
        return (event: Event) => {
            event.preventDefault();
            this.removeRule(id);
        };
    }

    private createLogicalOpHandler(op: 'and' | 'or'): EventListener {
        return (event: Event) => {
            event.preventDefault();
            this.handleLogicalOpChange(op);
        };
    }

    private createValidationMessageHandler(input: HTMLInputElement): EventListener {
        return (event: Event) => {
            const target: HTMLInputElement = event.target as HTMLInputElement;
            this.handleErrorMessageChange(target.value);
            input.value = target.value;
        };
    }

    private createValidationBlurHandler(input: HTMLInputElement): EventListener {
        return (event: Event) => {
            const target: HTMLInputElement = event.target as HTMLInputElement;
            if (target.value === '') {
                this.errorMessageError = this.l10nProvider.getConstant('customValidationErrorMessage') || 'Please enter a valid value.';
            } else {
                this.errorMessageError = '';
            }
            this.render();
        };
    }

    /** @private */
    public destroy(): void {
        if (this.element) {
            this.element.innerHTML = '';
        }
        this.rootElement = null;
    }
}
