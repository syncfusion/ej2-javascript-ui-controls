import { createButtonGroup } from '../src/button-group/button-group';
import { createElement, enableRipple } from '@syncfusion/ej2-base';

/**
 * ButtonGroup Spec document
 */
describe('ButtonGroup', () => {
    let checkbox: any;
    let element: HTMLElement = createElement('div', { id: 'buttongroup' }) as HTMLElement;
    let buttonElement1: HTMLButtonElement;
    let buttonElement2: HTMLButtonElement;
    let buttonElement3: HTMLButtonElement;
    let inputElement1: HTMLInputElement;
    let inputElement2: HTMLInputElement;
    let inputElement3: HTMLInputElement;

    describe('Util function', () => {
        afterEach(() => {
            document.getElementById('buttongroup').innerHTML = '';
            document.getElementById('buttongroup').removeAttribute('class');
        });

        it('for NormalButtonGroup', () => {
            buttonElement1 = createElement('button') as HTMLButtonElement;
            buttonElement2 = createElement('button') as HTMLButtonElement;
            buttonElement3 = createElement('button') as HTMLButtonElement;
            element.appendChild(buttonElement1);
            element.appendChild(buttonElement2);
            element.appendChild(buttonElement3);
            document.body.appendChild(element);
            createButtonGroup( '#buttongroup', {
                buttons: [{ content: 'HTML' }, { content: 'CSS' }, { content: 'Javascript' }]
            });
            expect(element.classList.contains('e-btn-group')).toBeTruthy();
            expect(element.children[0].classList.contains('e-btn')).toBeTruthy();
            expect(element.children[1].classList.contains('e-btn')).toBeTruthy();
            expect(element.children[2].classList.contains('e-btn')).toBeTruthy();
            expect(element.children[0].textContent).toBe('HTML');
            expect(element.children[1].textContent).toBe('CSS');
            expect(element.children[2].textContent).toBe('Javascript');
        });
        it('for Checkbox type ButtonGroup ', () => {
            inputElement1 = createElement('input') as HTMLInputElement;
            inputElement2 = createElement('input') as HTMLInputElement;
            inputElement3 = createElement('input') as HTMLInputElement;
            element.appendChild(inputElement1);
            element.appendChild(inputElement2);
            element.appendChild(inputElement3);
            createButtonGroup( '#buttongroup', {
                buttons: [{ content: 'HTML' }, { content: 'CSS' }, { content: 'Javascript' }]
            });
            expect(element.classList.contains('e-btn-group')).toBeTruthy();
            expect(element.children[1].tagName).toBe('LABEL');
            expect(element.children[3].tagName).toBe('LABEL');
            expect(element.children[5].tagName).toBe('LABEL');
            expect(element.children[1].classList.contains('e-btn')).toBeTruthy();
            expect(element.children[3].classList.contains('e-btn')).toBeTruthy();
            expect(element.children[5].classList.contains('e-btn')).toBeTruthy();
            expect(element.children[1].textContent).toBe('HTML');
            expect(element.children[3].textContent).toBe('CSS');
            expect(element.children[5].textContent).toBe('Javascript');
        });
        it('for Nesting', () => {
            buttonElement1 = createElement('button') as HTMLButtonElement;
            buttonElement2 = createElement('button') as HTMLButtonElement;
            buttonElement3 = createElement('button') as HTMLButtonElement;
            element.appendChild(buttonElement1);
            element.appendChild(buttonElement2);
            element.appendChild(buttonElement3);
            createButtonGroup( '#buttongroup', {
                buttons: [{ content: 'HTML' }, null, { content: 'Javascript' }]
            });
            expect(element.classList.contains('e-btn-group')).toBeTruthy();
            expect(element.children[0].classList.contains('e-btn')).toBeTruthy();
            expect(element.children[1].classList.contains('e-btn')).toBeFalsy();
            expect(element.children[2].classList.contains('e-btn')).toBeTruthy();
            expect(element.children[0].textContent).toBe('HTML');
            expect(element.children[1].textContent).toBe('');
            expect(element.children[2].textContent).toBe('Javascript');
        });
        it('for cssClass with NormalButtonGroup', () => {
            buttonElement1 = createElement('button') as HTMLButtonElement;
            buttonElement2 = createElement('button') as HTMLButtonElement;
            buttonElement3 = createElement('button') as HTMLButtonElement;
            element.appendChild(buttonElement1);
            element.appendChild(buttonElement2);
            element.appendChild(buttonElement3);
            createButtonGroup( '#buttongroup', {
                cssClass: 'e-primary',
                buttons: [{ content: 'HTML' }, { content: 'CSS', cssClass: 'e-success' }, { content: 'Javascript' }]
            });
            expect(element.classList.contains('e-btn-group')).toBeTruthy();
            expect(element.children[0].classList.contains('e-primary')).toBeTruthy();
            expect(element.children[1].classList.contains('e-success')).toBeTruthy();
            expect(element.children[2].classList.contains('e-primary')).toBeTruthy();
        });
        it('for cssClass with Checkbox type ButtonGroup ', () => {
            inputElement1 = createElement('input') as HTMLInputElement;
            inputElement2 = createElement('input') as HTMLInputElement;
            inputElement3 = createElement('input') as HTMLInputElement;
            element.appendChild(inputElement1);
            element.appendChild(inputElement2);
            element.appendChild(inputElement3);
            createButtonGroup( '#buttongroup', {
                cssClass: 'e-primary',
                buttons: [{ content: 'HTML' }, { content: 'CSS', cssClass: 'e-success' }, { content: 'Javascript' }]
            });
            expect(element.children[1].classList.contains('e-primary')).toBeTruthy();
            expect(element.children[3].classList.contains('e-success')).toBeTruthy();
            expect(element.children[5].classList.contains('e-primary')).toBeTruthy();
        });
        it('for NormalButtonGroup with Ripple effect', () => {
            enableRipple(true);
            buttonElement1 = createElement('button') as HTMLButtonElement;
            buttonElement2 = createElement('button') as HTMLButtonElement;
            buttonElement3 = createElement('button') as HTMLButtonElement;
            element.appendChild(buttonElement1);
            element.appendChild(buttonElement2);
            element.appendChild(buttonElement3);
            document.body.appendChild(element);
            createButtonGroup( '#buttongroup', {
                buttons: [{ content: 'HTML' }, { content: 'CSS' }, { content: 'Javascript' }]
            });
            expect(element.children[0].getAttribute('data-ripple')).toBe('true');
            expect(element.children[1].getAttribute('data-ripple')).toBe('true');
            expect(element.children[2].getAttribute('data-ripple')).toBe('true');
            enableRipple(false);
        });
        it('Input type ID checking', () => {
            inputElement1 = createElement('input', { id: 'checkbox1' }) as HTMLInputElement;
            inputElement2 = createElement('input', { id: 'checkbox2' }) as HTMLInputElement;
            inputElement3 = createElement('input', { id: 'checkbox3' }) as HTMLInputElement;
            element.appendChild(inputElement1);
            element.appendChild(inputElement2);
            element.appendChild(inputElement3);
            createButtonGroup( '#buttongroup', {
                buttons: [{ content: 'HTML' }, { content: 'CSS' }, { content: 'Javascript' }]
            });
            expect(element.children[1].getAttribute('for')).toBe('checkbox1');
            expect(element.children[3].getAttribute('for')).toBe('checkbox2');
            expect(element.children[5].getAttribute('for')).toBe('checkbox3');
        });
        it('ARIA Checking', () => {
            buttonElement1 = createElement('button') as HTMLButtonElement;
            buttonElement2 = createElement('button') as HTMLButtonElement;
            buttonElement3 = createElement('button') as HTMLButtonElement;
            element.appendChild(buttonElement1);
            element.appendChild(buttonElement2);
            element.appendChild(buttonElement3);
            document.body.appendChild(element);
            createButtonGroup('#buttongroup', {
                buttons: [{ content: 'HTML' }, { content: 'CSS' }, { content: 'Javascript' }]
            });
            expect(element.getAttribute('role')).toBe('group');
        });
        // For else part coverage
        it('Without button options', () => {
            buttonElement1 = createElement('button') as HTMLButtonElement;
            buttonElement2 = createElement('button') as HTMLButtonElement;
            buttonElement3 = createElement('button') as HTMLButtonElement;
            element.appendChild(buttonElement1);
            element.appendChild(buttonElement2);
            element.appendChild(buttonElement3);
            document.body.appendChild(element);
            createButtonGroup('#buttongroup', {
                cssClass: 'e-primary'
            });
        });
        it('Options as null', () => {
            buttonElement1 = createElement('button') as HTMLButtonElement;
            buttonElement2 = createElement('button') as HTMLButtonElement;
            buttonElement3 = createElement('button') as HTMLButtonElement;
            element.appendChild(buttonElement1);
            element.appendChild(buttonElement2);
            element.appendChild(buttonElement3);
            document.body.appendChild(element);
            createButtonGroup('#buttongroup');
        });
        it('Without Button and Input element', () => {
            let divElement1: HTMLElement = createElement('div') as HTMLElement;
            let divElement2: HTMLElement = createElement('div') as HTMLElement;
            element.appendChild(divElement1);
            element.appendChild(divElement2);
            document.body.appendChild(element);
            createButtonGroup('#buttongroup', {
                cssClass: 'e-primary'
            });
        });
    });
});