import { L10n } from '@syncfusion/ej2-base';
import { TextBox } from '@syncfusion/ej2-inputs';
import { Button } from '@syncfusion/ej2-buttons';
import { KeyValue } from '../../models/workflow-shared-types';
import { EditorComponents, EditorExpressionTarget } from './editor-components';

/**
 * Query Parameters Commit Handler.
 *
 * @private
 */
export type QueryParametersCommitHandler = () => void;

/**
 * Renders editable key/value query parameters for API Request steps.
 *
 * @private
 */
export class QueryParametersEditor {
    /**
     * Render.
     *
     * @param {HTMLElement} host The host.
     * @param {KeyValue} parameters The parameters.
     * @param {Function} onChange The on change.
     * @param {Function} attachExpression The attach expression.
     * @param {QueryParametersCommitHandler} onCommit The on commit.
     * @param {L10n} [l10n] The localization instance.
     * @returns {void} Nothing.
     * @private
     */
    public static render(
        host: HTMLElement,
        parameters: KeyValue[],
        onChange: (parameters: KeyValue[]) => void,
        attachExpression?: (input: EditorExpressionTarget) => void,
        onCommit?: QueryParametersCommitHandler,
        l10n?: L10n
    ): void {
        const localize: (key: string, fallback: string) => string = (key: string, fallback: string): string =>
            l10n ? (l10n.getConstant(key) || fallback) : fallback;
        EditorComponents.clear(host);
        const list: KeyValue[] = (Array.isArray(parameters) ? parameters : []).map(
            (parameter: KeyValue): KeyValue => ({ key: String(parameter.key || ''), value: parameter.value })
        );
        const rows: HTMLDivElement = document.createElement('div');
        rows.className = 'e-wf-query-parameters-list';

        const rebuild: () => void = (): void => {
            // Components must be disposed before the rows are discarded;
            // clearing `innerHTML` alone would orphan every instance.
            EditorComponents.clear(rows);
            list.forEach((parameter: KeyValue, index: number) => {
                const row: HTMLDivElement = document.createElement('div');
                row.className = 'e-wf-query-parameter-row';

                const keyElement: HTMLInputElement = QueryParametersEditor.inputElement();
                const valueElement: HTMLInputElement = QueryParametersEditor.inputElement();
                const valueRow: HTMLDivElement = document.createElement('div');
                valueRow.className = 'e-wf-property-input-row e-wf-property-input-row-expression';
                valueRow.appendChild(valueElement);

                const remove: HTMLButtonElement = document.createElement('button');
                remove.className = 'e-wf-property-list-remove';
                remove.setAttribute('aria-label', localize('removeQueryParameter', 'Remove query parameter'));
                remove.setAttribute('title', localize('removeQueryParameter', 'Remove query parameter'));

                row.appendChild(keyElement);
                row.appendChild(valueRow);
                row.appendChild(remove);
                rows.appendChild(row);

                // Instantiated after the row is attached: an EJ2 component
                // initialised while detached measures zero.
                const key: TextBox = QueryParametersEditor.textBox(
                    keyElement,
                    localize('queryParameterKey', 'Key'),
                    String(parameter.key || '')
                );
                const value: TextBox = QueryParametersEditor.textBox(
                    valueElement,
                    localize('queryParameterValue', 'Value'),
                    parameter.value === undefined || parameter.value === null ? '' : String(parameter.value)
                );

                // DOM `change` fires once on blur/Enter so per-keystroke input
                // does not queue rapid-fire property events from the host.
                key.element.addEventListener('change', () => {
                    parameter.key = key.element.value;
                    onChange(QueryParametersEditor.clone(list));
                });
                value.element.addEventListener('change', () => {
                    parameter.value = value.element.value;
                    onChange(QueryParametersEditor.clone(list));
                });
                if (attachExpression) {
                    // The component is passed rather than the raw element so
                    // the picker writes through the instance and it cannot go
                    // stale behind its own input.
                    attachExpression(value);
                }

                new Button({
                    cssClass: 'e-wf-property-list-remove e-flat',
                    iconCss: 'e-icons e-close'
                }).appendTo(remove);
                remove.addEventListener('click', () => {
                    list.splice(index, 1);
                    onChange(QueryParametersEditor.clone(list));
                    rebuild();
                    if (onCommit) {
                        onCommit();
                    }
                });
            });
        };

        const add: HTMLButtonElement = document.createElement('button');
        add.className = 'e-wf-property-list-add';
        host.appendChild(rows);
        host.appendChild(add);
        new Button({
            cssClass: 'e-wf-property-list-add',
            isPrimary: true,
            content: localize('queryParametersAdd', 'Add query parameter')
        }).appendTo(add);
        add.addEventListener('click', () => {
            list.push({ key: '', value: '' });
            onChange(QueryParametersEditor.clone(list));
            rebuild();
            if (onCommit) {
                onCommit();
            }
        });
        rebuild();
    }

    /**
     * Creates the bare element an EJ2 TextBox is mounted onto.
     *
     * @returns {HTMLInputElement} The host element.
     */
    private static inputElement(): HTMLInputElement {
        const input: HTMLInputElement = document.createElement('input');
        input.type = 'text';
        return input;
    }

    /**
     * Mounts a TextBox onto an attached host element.
     *
     * @param {HTMLInputElement} element The attached host element.
     * @param {string} label The accessible name and placeholder.
     * @param {string} value The initial value.
     * @returns {TextBox} The mounted component.
     */
    private static textBox(element: HTMLInputElement, label: string, value: string): TextBox {
        const textBox: TextBox = new TextBox({
            cssClass: 'e-wf-property-input e-wf-query-parameter-input',
            placeholder: label,
            value: value
        });
        textBox.appendTo(element);
        textBox.element.setAttribute('aria-label', label);
        return textBox;
    }

    private static clone(parameters: KeyValue[]): KeyValue[] {
        return parameters.map((parameter: KeyValue): KeyValue => ({
            key: parameter.key,
            value: parameter.value
        }));
    }
}
