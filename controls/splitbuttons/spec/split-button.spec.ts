import { SplitButton } from '../src/split-button/split-button';
import { ItemModel } from '../src/common/common-model';
import { createElement } from '@syncfusion/ej2-base';
/**
 * Split Button spec
 */
describe('Split Button', () => {
    let button: any;
    let items: ItemModel[] = [
        {
            text: 'Cut',
        },
        {
            text: 'Copy',
        },
        {
            text: 'Paste',
        }];
    let element: any = createElement('button', { id: 'splitbtn' });
    document.body.appendChild(element);

    afterEach(() => {
        button.destroy();
    });

    it('Architecture', () => {
        button = new SplitButton({}, '#splitbtn');
        expect(element.parentElement.classList).toContain('e-split-btn-wrapper');
        expect(element.nextElementSibling.classList).toContain('e-dropdown-btn');
    });

    it('click event args', () => {
        let click: any = (args: any) => {
            expect(args.element).toEqual(button.element);
        };
        button = new SplitButton({ click: click }, '#splitbtn');
        button.element.click();
    });

    it('rtl support', () => {
        button = new SplitButton({ enableRtl: true }, '#splitbtn');
        expect(element.parentElement.classList).toContain('e-rtl');
        button.enableRtl = false;
        button.dataBind();
        expect(element.parentElement.classList).not.toContain('e-rtl');
        button.enableRtl = true;
        button.dataBind();
        expect(element.parentElement.classList).toContain('e-rtl');
    });

    it('cssClass support', () => {
        button = new SplitButton({ cssClass: 'class1' }, '#splitbtn');
        expect(element.parentElement.classList).toContain('class1');
        button.cssClass = 'class2';
        button.dataBind();
        expect(element.parentElement.classList).toContain('class2');
    });

    it('Disabled support', () => {
        button = new SplitButton({ disabled: true }, '#splitbtn');
        expect(element.disabled).toBeTruthy();
        expect(element.nextElementSibling.disabled).toBeTruthy();
    });

    it('Text with Icon position top & left testing', () => {
        button = new SplitButton({ content: 'SplitButton', iconCss: 'iconcss'});
        button.appendTo('#splitbtn');
        expect(element.textContent).toEqual('SplitButton');
        expect(element.children[0].classList.contains('iconcss')).toEqual(true);
        expect(element.children[0].classList.contains('e-icon-left')).toBeTruthy();
        button.iconPosition = 'Top';
        button.dataBind();
        expect(element.children[0].classList.contains('e-icon-top')).toBeTruthy();
        button.iconPosition = 'Left';
        button.dataBind();
        expect(element.children[0].classList.contains('e-icon-top')).toBeFalsy();
        expect(element.children[0].classList.contains('e-icon-left')).toBeTruthy();
        button.destroy();
    });

    it('Alt + down key checking', () => {
        let altDownEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            action: 'altdownarrow',
            type: 'keyup',
            target: null
        };
        button = new SplitButton({ items: items });
        button.appendTo('#splitbtn');
        altDownEventArgs.target = button.element;
        button.btnKeyBoardHandler(altDownEventArgs);
        expect(button.dropDown.element.classList.contains('e-popup-open')).toBeTruthy();
    });

    it('Alt + up key checking', () => {
        let altUpEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            altKey: true,
            keyCode: 38,
            target: null
        };
        button = new SplitButton({ items: items });
        button.appendTo('#splitbtn');
        button.keyBoardHandler(altUpEventArgs);
        expect(button.dropDown.element.classList.contains('e-popup-open')).toBeFalsy();
    });

    it('Enter key checking', () => {
        let enterEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            keyCode: 13,
            target: null
        };
        let downEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            key: 'altdownarrow',
            type: 'keyup',
            target: null
        };
        button = new SplitButton({ items: items });
        button.appendTo('#splitbtn');
        button.secondaryBtnObj.element.click();
        let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>button.dropDown.element.querySelectorAll('li');
        li[0].classList.add('e-focused');
        button.keyBoardHandler(downEventArgs);
        enterEventArgs.target = li[1];
        button.keyBoardHandler(enterEventArgs);
        expect(button.dropDown.element.classList.contains('e-popup-open')).toBeFalsy();
        button.secondaryBtnObj.element.click();
        enterEventArgs.target = button.dropDown.element.children[0];
        button.keyBoardHandler(enterEventArgs);
    });

    it('Popup open/close testing by click', () => {
        button = new SplitButton({ items: items });
        button.appendTo('#splitbtn');
        expect(button.dropDown.element.classList.contains('e-popup-open')).toBeFalsy();
        button.secondaryBtnObj.element.click();
        expect(button.dropDown.element.classList.contains('e-popup-open')).toBeTruthy();
        button.secondaryBtnObj.element.click();
        expect(button.dropDown.element.classList.contains('e-popup-open')).toBeFalsy();
        button.secondaryBtnObj.element.click();
        button.mousedownHandler({ target: document.body });
        expect(button.dropDown.element.classList.contains('e-popup-open')).toBeFalsy();
        button.secondaryBtnObj.element.click();
        let ele: HTMLElement = button.dropDown.element.querySelector('.e-item');
        ele.classList.add('e-focused');
        ele.click();
        expect(button.dropDown.element.classList.contains('e-popup-open')).toBeFalsy();
        button.mousedownHandler({ target: document.body });
    });

    it('Toggle method', () => {
        button = new SplitButton({ items: items }, '#splitbtn');
        expect(button.secondaryBtnObj.dropDown.element.classList.contains('e-popup-open')).toBeFalsy();
        button.toggle();
        expect(button.secondaryBtnObj.dropDown.element.classList.contains('e-popup-open')).toBeTruthy();
        button.toggle();
        expect(button.secondaryBtnObj.dropDown.element.classList.contains('e-popup-close')).toBeTruthy();
    });

    it('Angular support', () => {
        document.body.appendChild(createElement('EJS-SPLITBUTTON', { id: 'angsplitbtn' }));
        button = new SplitButton({}, '#angsplitbtn');
        expect(button.element.parentElement.tagName).toEqual('EJS-SPLITBUTTON');
        expect(button.element.parentElement.classList).toContain('e-split-btn-wrapper');
        expect(button.element.nextElementSibling.classList).toContain('e-dropdown-btn');
    });
});