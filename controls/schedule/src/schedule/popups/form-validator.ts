import { createElement, remove } from '@syncfusion/ej2-base';
import { FormValidator } from '@syncfusion/ej2-inputs';
import * as cls from '../base/css-constant';

/**
 * Appointment window field validation
 */
export class FieldValidator {
    private formObj: FormValidator;
    private element: HTMLElement;

    public renderFormValidator(form: HTMLFormElement, rules: { [key: string]: Object }, element: HTMLElement): void {
        this.element = element;
        this.formObj = new FormValidator(form, {
            customPlacement: (inputElement: HTMLElement, error: HTMLElement) => {
                this.errorPlacement(inputElement, error);
            },
            rules: rules as { [name: string]: { [rule: string]: Object } },
            validationComplete: (args: { status: string, inputName: string, element: HTMLElement, message: string }) => {
                this.validationComplete(args);
            }
        });
    }

    private validationComplete(args: { status: string, inputName: string, element: HTMLElement, message: string }): void {
        let elem: HTMLElement = this.element.querySelector('#' + args.inputName + '_Error') as HTMLElement;
        if (elem) {
            elem.style.display = (args.status === 'failure') ? '' : 'none';
        }
    }

    private errorPlacement(inputElement: HTMLElement, error: HTMLElement): void {
        let id: string = error.getAttribute('for');
        let elem: Element = this.element.querySelector('#' + id + '_Error');
        if (!elem) {
            this.createTooltip(inputElement, error, id, '');
        }
    }

    private createTooltip(element: Element, error: HTMLElement, name: string, display: string): void {
        let dlgContent: Element;
        let client: ClientRect;
        let inputClient: ClientRect = element.getBoundingClientRect();
        if (this.element.classList.contains(cls.POPUP_WRAPPER_CLASS)) {
            dlgContent = this.element;
            client = this.element.getBoundingClientRect();
        } else {
            dlgContent = this.element.querySelector('.e-schedule-dialog .e-dlg-content');
            client = dlgContent.getBoundingClientRect();
        }
        let div: HTMLElement = createElement('div', {
            className: 'e-tooltip-wrap e-popup ' + cls.ERROR_VALIDATION_CLASS,
            id: name + '_Error',
            styles: 'display:' + display + ';top:' +
                (inputClient.bottom - client.top + dlgContent.scrollTop + 9) + 'px;left:' +
                (inputClient.left - client.left + dlgContent.scrollLeft + inputClient.width / 2) + 'px;'
        });
        let content: Element = createElement('div', { className: 'e-tip-content' });
        content.appendChild(error);
        let arrow: Element = createElement('div', { className: 'e-arrow-tip e-tip-top' });
        arrow.appendChild(createElement('div', { className: 'e-arrow-tip-outer e-tip-top' }));
        arrow.appendChild(createElement('div', { className: 'e-arrow-tip-inner e-tip-top' }));
        div.appendChild(content);
        div.appendChild(arrow);
        dlgContent.appendChild(div);
        div.style.left = (parseInt(div.style.left, 10) - div.offsetWidth / 2) + 'px';
    }

    public destroyToolTip(): void {
        if (this.element) {
            let elements: Element[] = [].slice.call(this.element.querySelectorAll('.' + cls.ERROR_VALIDATION_CLASS));
            for (let elem of elements) {
                remove(elem);
            }
        }
        if (this.formObj) {
            this.formObj.reset();
        }
    }

    /**
     * @hidden
     */
    public destroy(): void {
        if (this.formObj && !this.formObj.isDestroyed) {
            this.formObj.destroy();
        }
    }
}
