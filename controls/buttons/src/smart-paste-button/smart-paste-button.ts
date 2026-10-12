// eslint-disable-next-line @typescript-eslint/triple-slash-reference
///<reference path='../button/button-model.d.ts'/>
import { Button } from '../button/button';
import { EventHandler, Property } from '@syncfusion/ej2-base';
import { SmartPasteButtonModel } from './smart-paste-button-model';

/*
* Smart Paste Button
*/

interface FieldInfo {
    fieldName?: string
    description?: string
    element?: HTMLElement
    allowedValues?: string[]
    type?: string
}

interface NavigatorClipboard {
    clipboard: {
        readText(): Promise<string>;
    };
}

export interface ChatOptions {
    messages: {
        role: string;
        content: string;
    }[];
    temperature?: number;
    topP?: number;
    maxTokens?: number;
    frequencyPenalty?: number;
    presencePenalty?: number;
    stop?: string[];
}

export class SmartPasteButton extends Button {

    /**
     * Callback function to get the form response data from the server to process the smart paste.
     *
     * @param {ChatOptions} settings - Specifies the chat options
     * @returns {string} - Returns the string
     */
    @Property()
    public aiAssistHandler: Function;

    /**
     * Constructor for creating the widget
     *
     * @private
     * @param {SmartPasteButtonModel} options - Specifies Smart paste button model
     * @param {string | HTMLButtonElement} element - Specifies target element
     */
    constructor(options?: SmartPasteButtonModel, element?: string | HTMLButtonElement) {
        super(options, <string | HTMLButtonElement>element);
    }

    protected wireEvents(): void {
        EventHandler.add(this.element, 'click', this.smartPasteBtnClickHandler, this);
    }

    protected unWireEvents(): void {
        EventHandler.remove(this.element, 'click', this.smartPasteBtnClickHandler);
    }

    private async smartPasteBtnClickHandler(args: MouseEvent): Promise<void> {
        const target: HTMLButtonElement = args.target as HTMLButtonElement;
        const formElement: HTMLFormElement = target.closest('form') as HTMLFormElement;
        if (!formElement) {
            return;
        }
        const formFields: FieldInfo[] = this.getFormFields(formElement);
        if (formFields.length === 0) {
            return;
        }
        const clipboardContent: string = await this.getClipboardContent().then((text: string) => {
            return text;
        });
        if (clipboardContent !== 'Clipboard API not supported' && clipboardContent !== 'Clipboard access failed') {
            try {
                this.disabled = true;
                const fieldsData: FieldInfo[] = formFields.map((field: FieldInfo) => {
                    return {
                        fieldName: field.fieldName,
                        description: field.description,
                        allowedValues: field.allowedValues,
                        type: field.type
                    };
                });
                const systemRole: string = `
Current date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}

Each response line matches the following format:
FIELD identifier^^^value

Give a response with the following lines only, with values inferred from USER_DATA:
${this.formatFields(fieldsData)}
END_RESPONSE

Do not explain how the values were determined.
For fields without any corresponding information in USER_DATA, use value NO_DATA.`;
                const userRole: string = `
USER_DATA: ${clipboardContent}
                    `;
                const settings: ChatOptions = {
                    messages: [
                        { role: 'system', content: systemRole },
                        { role: 'user', content: userRole }
                    ],
                    temperature: 0.0,
                    topP: 1.0,
                    maxTokens: 2000,
                    frequencyPenalty: 0.1,
                    presencePenalty: 0.0,
                    stop: ['END_RESPONSE']
                };
                if (typeof this.aiAssistHandler === 'function') {
                    const response: string = await this.aiAssistHandler(settings);
                    if (typeof response === 'string' && response !== '') {
                        this.setFormFields(formElement, formFields, response);
                    }
                }
            } finally {
                this.disabled = false;
            }
        }
    }

    private formatFields(fields: FieldInfo[]): string {
        const result: string[] = [];
        fields.forEach((field: FieldInfo) => {
            const fieldOutput: string[] = [];
            fieldOutput.push(`\nFIELD ${field.fieldName}^^^`);
            if (field.description) {
                fieldOutput.push(`The ${field.description}`);
            }
            if (field.allowedValues && field.allowedValues.length > 0) {
                fieldOutput.push(' (multiple choice, with allowed values: ');
                fieldOutput.push(field.allowedValues.map((val: string) => `${val}`).join(','));
                fieldOutput.push(')');
            } else {
                fieldOutput.push(` of type ${field.type}`);
            }
            result.push(fieldOutput.join(''));
        });
        return result.join('');
    }

    private setFormFields(form: HTMLFormElement, formFields: FieldInfo[], response: string): void {
        const responseData: { [key: string]: string } = {};
        const fieldPrefix: string = 'FIELD ';
        let currentField: string | null = null;
        response.split('\n').forEach((line: string) => {
            if (line.startsWith(fieldPrefix)) {
                const parts: string[] = line.substring(fieldPrefix.length).split('^^^');
                if (parts.length === 2) {
                    responseData[`${parts[0]}`] = parts[1];
                    currentField = parts[0];
                }
            } else if (currentField) {
                responseData[`${currentField}`] += '\n' + line;
            }
        });
        formFields.forEach((field: FieldInfo) => {
            let value: string = responseData[field.fieldName];
            if (value !== undefined) {
                value = value.trim();
                if (value === 'NO_DATA') {
                    return;
                }
                if (field.element instanceof HTMLInputElement && field.element.type === 'radio') {
                    const radioButton: HTMLInputElement = this.findRadioButton(form, field.element.name, value);
                    if (radioButton) {
                        this.updateElementValue(radioButton, 'true');
                    }
                } else {
                    this.updateElementValue(field.element, value);
                }
            }
        });
    }

    private findRadioButton(form: HTMLFormElement, name: string, value: string): HTMLInputElement | null {
        const radioButtons: { elem: HTMLInputElement; text: string }[] = Array.from(form.querySelectorAll('input[type=radio]'))
            .filter((radio: HTMLElement) => radio instanceof HTMLInputElement && radio.name === name)
            .map((radio: HTMLInputElement) => ({ elem: radio, text: this.getElementDescription(form, radio) }));
        const exactMatch: { elem: HTMLInputElement } = radioButtons.find((radio: { text: string }) => radio.text === value);
        if (exactMatch) {
            return exactMatch.elem;
        }
        const partialMatch: { elem: HTMLInputElement }[] = radioButtons.filter((radio: { text: string }) => radio.text &&
            radio.text.includes(value));
        if (partialMatch.length === 1) {
            return partialMatch[0].elem;
        }
        return null;
    }

    private triggerBeforeChange(element: Element): void {
        element.dispatchEvent(new CustomEvent('beforeinput', {
            bubbles: true,
            detail: {
                fromSmartComponents: true
            }
        }));
    }

    private triggerAfterChange(element: Element): void {
        element.dispatchEvent(new CustomEvent('input', {
            bubbles: true,
            detail: {
                fromSmartComponents: true
            }
        }));
        element.dispatchEvent(new CustomEvent('change', {
            bubbles: true,
            detail: {
                fromSmartComponents: true
            }
        }));
    }

    private updateElementValue(element: HTMLElement, value: string): void {
        const isEjsControl: boolean = element.classList.contains('e-control');
        if (element instanceof HTMLInputElement && (element.type === 'radio' || element.type === 'checkbox')) {
            const responseValue: string | undefined = value == null ? undefined : value.toString().toLowerCase();
            const isResponseValue: boolean = responseValue === 'true' || responseValue === 'yes' || responseValue === 'on';
            if (element.checked !== isResponseValue) {
                this.triggerBeforeChange(element);
                if (isEjsControl) {
                    (((element as unknown) as { [key: string]: object[] })['ej2_instances'] as HTMLInputElement[])[0].checked = isResponseValue;
                } else {
                    element.checked = isResponseValue;
                }
                this.triggerAfterChange(element);
            }
        } else if (element instanceof HTMLSelectElement) {
            const optionText: string = value.toString();
            let index: number | null = null;
            const options: HTMLOptionElement[] = Array.from(element.querySelectorAll('option'));
            const exactMatch: HTMLOptionElement[] = options.filter((option: HTMLOptionElement) => option.textContent === optionText);
            if (exactMatch.length > 0) {
                index = options.indexOf(exactMatch[0]);
            } else {
                const partialMatch: HTMLOptionElement[] = options.filter((option: HTMLOptionElement) => option.textContent &&
                    option.textContent.indexOf(optionText) >= 0);
                if (partialMatch.length === 1) {
                    index = options.indexOf(partialMatch[0]);
                }
            }
            if (index !== null && element.selectedIndex !== index) {
                this.triggerBeforeChange(element);
                if (isEjsControl) {
                    (((element as unknown) as { [key: string]: object[] })['ej2_instances'] as any[])[0].index = index;
                }
                else {
                    element.selectedIndex = index;
                }
                this.triggerAfterChange(element);
            }
        } else {
            this.triggerBeforeChange(element);
            if (element.classList.contains('e-rating') || element.classList.contains('e-colorpicker')) {
                (((element as unknown) as { [key: string]: object[] })['ej2_instances'] as HTMLInputElement[])[0].value = value;
            } else {
                (element as HTMLInputElement).value = value;
            }
            this.triggerAfterChange(element);
        }
        element.focus();
    }

    private getFormFields(form: HTMLFormElement): FieldInfo[] {
        const fields: FieldInfo[] = [];
        let uniqueCount: number = 0;
        form.querySelectorAll('input, select, textarea').forEach((element: Element) => {
            if (!(element instanceof HTMLInputElement || element instanceof HTMLSelectElement || element instanceof HTMLTextAreaElement)) {
                return;
            }
            if (element.type === 'hidden' || this.isFieldIgnore(element)) {
                return;
            }
            const isRadioButton: boolean = element.type === 'radio';
            const identifier: string = isRadioButton ? element.name : element.id || element.name || `unidentified_${++uniqueCount}`;
            if (isRadioButton && fields.find((field: FieldInfo) => field.fieldName === identifier)) {
                return;
            }
            let FieldDescription: string = null;
            if (!isRadioButton) {
                FieldDescription = this.getElementDescription(form, element);
                if (!FieldDescription) {
                    return;
                }
            }
            const fieldInfo: FieldInfo = {
                fieldName: element.name,
                description: FieldDescription,
                element: element,
                type: element.type === 'checkbox' ? 'boolean' : element.type === 'number' ? 'number' : 'string'
            };
            if (element instanceof HTMLSelectElement) {
                const options: HTMLOptionElement[] = Array.from(element.querySelectorAll('option')).filter((option: HTMLOptionElement) => option.value);
                fieldInfo.allowedValues = options.map((option: HTMLOptionElement) => option.textContent);
                fieldInfo.type = 'fixed-choices';
            } else if (isRadioButton) {
                fieldInfo.allowedValues = [];
                fieldInfo.type = 'fixed-choices';
                Array.from(form.querySelectorAll('input[type=radio]')).forEach((radio: HTMLInputElement) => {
                    if (radio.name === identifier) {
                        const radioDescription: string = this.getElementDescription(form, radio);
                        if (radioDescription) {
                            fieldInfo.allowedValues.push(radioDescription);
                        }
                    }
                });
            }
            fields.push(fieldInfo);
        });
        return fields;
    }

    private isFieldIgnore(element: Element): boolean {
        return element.hasAttribute('data-smartpaste-ignore') ||
            (element.hasAttribute('aria-disabled') && element.getAttribute('aria-disabled') === 'true') ||
            (element.hasAttribute('disabled')) || (element.hasAttribute('readonly')) ||
            (element.hasAttribute('aria-readonly') && element.getAttribute('aria-readonly') === 'true') ||
            (element.hasAttribute('aria-hidden') && element.getAttribute('aria-hidden') === 'true');
    }

    private getElementDescription(form: HTMLFormElement, element: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement): string {
        if (element.hasAttribute('data-smartpaste-description')) {
            return element.getAttribute('data-smartpaste-description') as string;
        }
        if ((element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) && element.placeholder) {
            return element.placeholder;
        }
        const label: Element = form.querySelector(`label[for="${element.id}"]`);
        if (label) {
            return (label.textContent as string).trim();
        }
        return element.name || element.id;
    }

    private async getClipboardContent(): Promise<string> {
        const navigatorObj: NavigatorClipboard = navigator as Navigator & NavigatorClipboard;
        const customClipboard: HTMLInputElement | HTMLTextAreaElement = document.getElementById('custom-clipboard') as HTMLInputElement | HTMLTextAreaElement;
        if (customClipboard && customClipboard.value) {
            return customClipboard.value;
        } else if (typeof window !== 'undefined' && navigatorObj.clipboard && navigatorObj.clipboard.readText) {
            try {
                return await navigatorObj.clipboard.readText();
            } catch (error) {
                return 'Clipboard access failed';
            }
        } else {
            return 'Clipboard API not supported';
        }
    }
}
