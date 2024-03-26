/* eslint-disable @typescript-eslint/no-explicit-any */
import { DropDownButton } from '../src/drop-down-button/drop-down-button';
import { MenuEventArgs, OpenCloseMenuEventArgs, BeforeOpenCloseMenuEventArgs } from '../src/common/common';
import { ItemModel } from '../src/common/common-model';
import { createElement, Browser } from '@syncfusion/ej2-base';
import { profile , inMB, getMemoryProfile } from './common.spec';

/**
 * @param  {} 'DropDownButton'
 * @param  {} function(
 */
describe('DropDownButton', () => {
    beforeAll(() => {
        const isDef: any = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log('Unsupported environment, window.performance.memory is unavailable');
            this.skip(); // skips test (in Chai)
            return;
        }
    });

    let drpButton: any;
    const element: HTMLElement = createElement('button', { id: 'drp-button' });
    document.body.appendChild(element);
    const ul: Element = createElement('ul', { className: 'targetElement' });
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

    describe('DOM', () => {
        afterEach(() => {
            drpButton.destroy();
        });

        it('Normal DropDownButton testing', () => {
            drpButton = new DropDownButton();
            drpButton.appendTo('#drp-button');
            expect(element.classList.contains('e-dropdown-btn')).toEqual(true);
        });

        it('DropDown Popup Testing', () => {
            drpButton = new DropDownButton({ items: items });
            drpButton.appendTo('#drp-button');
            expect(drpButton.dropDown.element.classList.contains('e-dropdown-popup')).toEqual(true);
        });

        it('Disable state testing', () => {
            drpButton = new DropDownButton({ disabled: true });
            drpButton.appendTo('#drp-button');
            expect(element.getAttribute('disabled')).toEqual('');
        });

        it('Text with Icon position top testing', () => {
            element.textContent = 'DropDownButton';
            drpButton = new DropDownButton({ iconCss: 'iconcss', iconPosition: 'Top' });
            drpButton.appendTo('#drp-button');
            expect(element.textContent).toEqual('DropDownButton');
            expect(element.children[0].classList.contains('iconcss')).toEqual(true);
            expect(element.children[0].classList.contains('e-icon-top')).toBeTruthy();
        });

        it('RTL testing', () => {
            drpButton = new DropDownButton({ enableRtl: true });
            drpButton.appendTo('#drp-button');
            expect(element.classList.contains('e-rtl')).toEqual(true);
            expect(drpButton.dropDown.element.classList.contains('e-rtl')).toEqual(true);
        });

        it('Add items & Remove items testing', () => {
            drpButton = new DropDownButton({ items: items });
            drpButton.appendTo('#drp-button');
            drpButton.addItems([{text: 'Insert'}, {text: 'Attach'}], 'Copy');
            element.click();
            expect(drpButton.dropDown.element.querySelectorAll('.e-item')[0].textContent).toEqual('Cut');
            expect(drpButton.dropDown.element.querySelectorAll('.e-item')[1].textContent).toEqual('Insert');
            drpButton.removeItems(['Cut']);
            expect(drpButton.dropDown.element.querySelectorAll('.e-item')[2].textContent).toEqual('Copy');
        });

        it('Dropdown Button without id', () => {
            const btn: HTMLElement = createElement('button');
            document.body.appendChild(btn);
            drpButton = new DropDownButton();
            drpButton.appendTo(btn);
            expect(drpButton.element.getAttribute('id')).toBeTruthy();
        });

        it('DropdownButton popup without icon', () => {
            drpButton = new DropDownButton({ items: [{ text: 'cut' }, { text: 'copy' }, { text: 'paste' }] });
            drpButton.appendTo('#drp-button');
            element.click();
            expect(drpButton.dropDown.element.querySelectorAll('li')[0].classList.contains('e-blank-icon')).toBeFalsy();
        });

        it('Dropdown close on mousedown', () => {
            drpButton = new DropDownButton({}, '#drp-button');
            drpButton.toggle();
            drpButton.mousedownHandler({ target: document.body });
            expect(drpButton.dropDown.element.classList.contains('e-popup-close')).toBe(true);
            // mousedown on popup
            drpButton.toggle();
            drpButton.mousedownHandler({ target: drpButton.getPopUpElement() });
            expect(drpButton.dropDown.element.classList.contains('e-popup-open')).toBe(true);
            drpButton.destroy();
        });

        it('Enable Html Sanitizer', () => {
            drpButton = new DropDownButton({ items: [{ text: 'cut<style>body{background:rgb(0, 0, 255)}</style>' }, { text: 'copy' }, { text: 'paste' }] });
            drpButton.appendTo('#drp-button');
            drpButton.toggle();
            const htmlele: Element = document.body;
            expect(window.getComputedStyle(htmlele).backgroundColor).not.toBe('rgb(0, 0, 255)');
            drpButton.destroy();
        });

        it('Enable Html Sanitizer disabled', () => {
            drpButton = new DropDownButton({ items: [{ text: 'cut<style>body{background:rgb(0, 0, 255)}</style>' }, { text: 'copy' }, { text: 'paste' }], enableHtmlSanitizer: false });
            drpButton.appendTo('#drp-button');
            drpButton.toggle();
            const htmlele: Element = document.body;
            expect(window.getComputedStyle(htmlele).backgroundColor).toBe('rgb(0, 0, 255)');
        });
    });

    describe('Property', () => {
        afterEach(() => {
            drpButton.destroy();
        });

        it('Text and Icon dropdown button testing', () => {
            element.textContent = 'DropDownButton';
            drpButton = new DropDownButton({ iconCss: 'iconcss', iconPosition: 'Top' });
            drpButton.appendTo('#drp-button');
            expect(drpButton.iconCss).toEqual('iconcss');
            expect(drpButton.iconPosition).toEqual('Top');
            expect(element.classList.contains('e-top-icon-btn')).toEqual(true);
        });

        items = [{ text: 'Cut', iconCss: 'cut', id: 'cut' }, { text: 'Copy', iconCss: 'copy', id: 'copy' },
        { text: 'Paste', iconCss: 'paste', url: 'http://www.google.com' }, { separator: true },
        { text: 'Paste Text' }, { text: 'Paste Special' }];

        it('Items with icons testing and separator', () => {
            drpButton = new DropDownButton({ items: items });
            drpButton.appendTo('#drp-button');
            element.click();
            expect(drpButton.items[0].iconCss).toEqual('cut');
            expect(drpButton.dropDown.element.querySelector('.cut')).toBeTruthy();
            expect(drpButton.dropDown.element.querySelectorAll('li')[0].children[0].tagName).toEqual('SPAN');
            expect(drpButton.dropDown.element.querySelector('.e-separator')).toBeTruthy();
        });

        it('Blank icon testing', () => {
            drpButton = new DropDownButton({ items: items });
            drpButton.appendTo('#drp-button');
            element.click();
            expect(drpButton.dropDown.element.querySelector('.e-blank-icon')).toBeTruthy();
        });

        it('Vertical Bottom cssClass testing', () => {
            drpButton = new DropDownButton({ iconCss: 'icon', content: 'vertical', cssClass: 'e-vertical' });
            drpButton.appendTo('#drp-button');
            expect(element.classList.contains('e-vertical')).toEqual(true);
            expect(element.querySelector('.e-caret').classList.contains('e-icon-bottom')).toEqual(true);
        });

        it('target', () => {
            document.body.appendChild(ul);
            ul.appendChild(createElement('li'));
            drpButton = new DropDownButton({ target: '.targetElement' });
            drpButton.appendTo('#drp-button');
            expect(drpButton.getULElement().classList.contains('targetElement')).toBeTruthy();
            element.click();
            expect(drpButton.dropDown.element.classList.contains('e-popup-open')).toBeTruthy();
            element.click();
            expect(drpButton.dropDown.element.classList.contains('e-popup-close')).toBeTruthy();
            element.click();
            drpButton.getULElement().querySelector('LI').click();
            expect(drpButton.dropDown.element.classList.contains('e-popup-close')).toBeTruthy();
        });

        it('create popup on open testing', () => {
            drpButton = new DropDownButton({ content: 'default', createPopupOnClick: true });
            drpButton.appendTo('#drp-button');
            expect(drpButton.dropDown).toEqual(undefined);
            element.click();
            expect(drpButton.dropDown.element.classList.contains('e-popup-open')).toEqual(true);
            element.click();
            expect(drpButton.dropDown).toEqual(undefined);
        });

        it('Destroy popup after destroy method', () => {
            drpButton = new DropDownButton({ content: 'destroy' });
            drpButton.appendTo('#drp-button');
            element.click();
            drpButton.destroy();
            expect(drpButton.dropDown).toEqual(undefined);
        });
    });

    describe('notify property changes of', () => {
        afterEach(() => {
            drpButton.destroy();
        });

        it('IconCss in onPropertyChanged', () => {
            drpButton = new DropDownButton({ iconCss: 'icon', content: 'icontest' });
            drpButton.appendTo('#drp-button');
            drpButton.iconCss = 'iconcss';
            drpButton.dataBind();
            expect(element.children[0].classList.contains('iconcss')).toEqual(true);
            drpButton.content = 'icontop';
            drpButton.iconPosition = 'Top';
            drpButton.iconCss = 'iconcss-top';
            drpButton.dataBind();
            expect(element.children[0].classList.contains('iconcss-top')).toEqual(true);
        });

        it('IconPosition in onPropertyChanged', () => {
            drpButton = new DropDownButton({ iconCss: 'icon', content: 'icontest' });
            drpButton.appendTo('#drp-button');
            drpButton.iconPosition = 'Top';
            drpButton.dataBind();
            expect(element.children[0].classList.contains('e-icon-top')).toEqual(true);
            drpButton.content = 'icontop';
            drpButton.iconPosition = 'Left';
            drpButton.dataBind();
            expect(element.children[0].classList.contains('e-icon-left')).toEqual(true);
        });

        it('CssClass in onPropertyChanged', () => {
            drpButton = new DropDownButton();
            drpButton.appendTo('#drp-button');
            drpButton.cssClass = 'class';
            drpButton.dataBind();
            expect(element.classList.contains('class')).toEqual(true);
            expect(drpButton.dropDown.element.classList.contains('class')).toEqual(true);
            drpButton.cssClass = 'styleclass';
            drpButton.dataBind();
            expect(element.classList.contains('styleclass')).toEqual(true);
            expect(drpButton.dropDown.element.classList.contains('styleclass')).toEqual(true);
            drpButton.cssClass = 'e-vertical';
            drpButton.dataBind();
            expect(element.classList.contains('e-vertical')).toEqual(true);
            expect(element.querySelector('.e-caret').classList.contains('e-icon-bottom')).toEqual(true);
        });

        it('EnableRtl in onPropertyChanged', () => {
            drpButton = new DropDownButton();
            drpButton.appendTo('#drp-button');
            drpButton.enableRtl = true;
            drpButton.dataBind();
            expect(element.classList.contains('e-rtl')).toEqual(true);
            drpButton.enableRtl = false;
            drpButton.dataBind();
            expect(element.classList.contains('e-rtl')).toEqual(false);
        });

        it('Disabled in onPropertyChanged', () => {
            drpButton = new DropDownButton({ items: items });
            drpButton.appendTo('#drp-button');
            drpButton.element.click();
            expect(drpButton.dropDown.element.classList.contains('e-popup-open')).toEqual(true);
            drpButton.disabled = true;
            drpButton.dataBind();
            expect(drpButton.dropDown.element.classList.contains('e-popup-close')).toEqual(true);
            drpButton.disabled = false;
            drpButton.dataBind();
            expect(element.getAttribute('disabled')).toBeNull();
        });

        it('Content in onPropertyChanged', () => {
            drpButton = new DropDownButton({ content: 'Test' });
            drpButton.appendTo('#drp-button');
            drpButton.content = 'play';
            drpButton.dataBind();
            expect(element.textContent).toEqual('play');
            element.innerHTML = '';
            drpButton.content = 'Test';
            drpButton.dataBind();
            expect(element.textContent).toEqual('Test');
        });

        it('target', () => {
            document.body.appendChild(ul);
            const testUL: Element = createElement('ul');
            document.body.appendChild(testUL);
            drpButton = new DropDownButton({ target: testUL as HTMLElement });
            drpButton.appendTo('#drp-button');
            drpButton.target = '.targetElement';
            drpButton.dataBind();
            expect(drpButton.dropDown.element.children[0].classList.contains('targetElement')).toBeTruthy();
        });

        it('popup destroy after destroy method with target', () => {
            const testUL: Element = createElement('ul');
            document.body.appendChild(testUL);
            drpButton = new DropDownButton({ target: testUL as HTMLElement });
            drpButton.appendTo('#drp-button');
            element.click();
            drpButton.destroy();
            expect(drpButton.dropDown).toEqual(undefined);
        });

        it('Item text changes', () => {
            drpButton = new DropDownButton({ items: items });
            drpButton.appendTo('#drp-button');
            element.click();
            drpButton.items[0].text = 'Cut & Copy';
            drpButton.items[1].text = 'Paste Text';
            drpButton.dataBind();
            expect(drpButton.dropDown.element.querySelectorAll('.e-item')[0].textContent).toEqual('Cut & Copy');
            expect(drpButton.dropDown.element.querySelectorAll('.e-item')[1].textContent).toEqual('Paste Text');
        });

        it('Create popup on open changes', () => {
            drpButton = new DropDownButton({ content: 'default', createPopupOnClick: true });
            drpButton.appendTo('#drp-button');
            expect(drpButton.dropDown).toEqual(undefined);
            drpButton.createPopupOnClick = false;
            drpButton.dataBind();
            expect(drpButton.dropDown.element.classList.contains('e-popup-open')).toEqual(false);                     
        });
    });

    describe('methods', () => {
        afterEach(() => {
            drpButton.destroy();
            expect(element.classList.contains('e-dropdown-btn')).toEqual(false);
        });

        it('getModuleName method', () => {
            drpButton = new DropDownButton();
            drpButton.appendTo('#drp-button');
            expect(drpButton.getModuleName()).toEqual('dropdown-btn');
        });

        it('getPersistData method', () => {
            drpButton = new DropDownButton({ enablePersistence: true });
            drpButton.appendTo('#drp-button');
            expect(drpButton.getPersistData()).toEqual('{}');
        });

        it(('Toggle method'), () => {
            drpButton = new DropDownButton({ items: items });
            drpButton.appendTo('#drp-button');
            expect(element.classList.contains('e-active')).toBeFalsy();
            expect(drpButton.dropDown.element.classList.contains('e-popup-open')).toBeFalsy();
            drpButton.toggle();
            expect(element.classList.contains('e-active')).toBeTruthy();
            expect(drpButton.dropDown.element.classList.contains('e-popup-open')).toBeTruthy();
            expect(drpButton.getULElement().getAttribute('role')).toEqual('menu');
            drpButton.toggle();
            expect(element.classList.contains('e-active')).toBeFalsy();
            expect(drpButton.dropDown.element.classList.contains('e-popup-close')).toBeTruthy();
        });

        it(('Custom selection method testing'), () => {
            drpButton = new DropDownButton({
                items: items,
                beforeItemRender: (args: MenuEventArgs) => {
                    if (args.item.text) {
                        args.element.classList.add('e-selected');
                    }
                }
            });
            drpButton.appendTo('#drp-button');
            drpButton.element.click();
            expect(drpButton.getULElement().children[1].classList.contains('e-selected')).toBeTruthy();
            drpButton.element.click();
        });
        it('Native methods click,Focus', () => {
            drpButton = new DropDownButton();
            drpButton.appendTo('#drp-button');
            drpButton.focusIn();
        });
    });

    describe('Events', () => {
        afterEach(() => {
            drpButton.destroy();
        });

        it('Popup open/close testing by click', () => {
            drpButton = new DropDownButton({ items: items });
            drpButton.appendTo('#drp-button');
            expect(drpButton.dropDown.element.classList.contains('e-popup-open')).toBeFalsy();
            expect(element.classList.contains('e-active')).toBeFalsy();
            drpButton.element.click();
            expect(element.classList.contains('e-active')).toBeTruthy();
            expect(drpButton.dropDown.element.classList.contains('e-popup-open')).toBeTruthy();
            drpButton.element.click();
            expect(drpButton.dropDown.element.classList.contains('e-popup-open')).toBeFalsy();
            drpButton.element.click();
            drpButton.mousedownHandler({ target: document.body });
            expect(drpButton.dropDown.element.classList.contains('e-popup-open')).toBeFalsy();
            drpButton.element.click();
            const ele: HTMLElement = drpButton.dropDown.element.querySelector('.e-item');
            ele.classList.add('e-focused');
            ele.click();
            expect(drpButton.dropDown.element.classList.contains('e-popup-open')).toBeFalsy();
            drpButton.mousedownHandler({ target: document.body });
        });
    });

    describe('Keyboard action', () => {
        afterEach(() => {
            drpButton.destroy();
        });

        const downEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            keyCode: 40,
            target: null
        };

        it('down arrow action', () => {
            drpButton = new DropDownButton({ items: items });
            drpButton.appendTo('#drp-button');
            drpButton.element.click();
            const li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>drpButton.dropDown.element.querySelectorAll('li');
            downEventArgs.target = drpButton.dropDown.element;
            drpButton.keyBoardHandler(downEventArgs);
            expect((li[0] as Element).classList.contains('e-focused')).toBe(true);
        });

        const upEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            keyCode: 38,
            target: null
        };

        it('up arrow action', () => {
            drpButton = new DropDownButton({ items: items });
            drpButton.appendTo('#drp-button');
            drpButton.element.click();
            const li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>drpButton.dropDown.element.querySelectorAll('li');
            li[0].classList.add('e-focused');
            upEventArgs.target = li[1];
            drpButton.keyBoardHandler(upEventArgs);
            expect((li[5] as Element).classList.contains('e-focused')).toBe(true);
        });

        it('Down arrow with separator checking', () => {
            items.push({ separator: true });
            items.push({ separator: true });
            items.push({ text: 'test' });
            drpButton = new DropDownButton({ items: items });
            drpButton.appendTo('#drp-button');
            drpButton.element.click();
            const li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>drpButton.dropDown.element.querySelectorAll('li');
            li[2].classList.add('e-focused');
            drpButton.keyBoardHandler(downEventArgs);
            expect((li[4] as Element).classList.contains('e-focused')).toBe(true);
            drpButton.keyBoardHandler(downEventArgs);
            drpButton.keyBoardHandler(downEventArgs);
            expect((li[8] as Element).classList.contains('e-focused')).toBe(true);
            items.pop(); items.pop(); items.pop();
        });

        it('Up arrow with separator checking', () => {
            drpButton = new DropDownButton({ items: items });
            drpButton.appendTo('#drp-button');
            drpButton.element.click();
            const li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>drpButton.dropDown.element.querySelectorAll('li');
            li[4].classList.add('e-focused');
            drpButton.keyBoardHandler(upEventArgs);
            expect((li[2] as Element).classList.contains('e-focused')).toBe(true);
        });

        it('Up arrow with disabled item checking', () => {
            drpButton = new DropDownButton({
                items: items,
                beforeItemRender: (args: MenuEventArgs) => {
                    if (args.item.text === 'Paste Text' || args.item.text === 'Paste' || args.item.text === 'Cut') {
                        args.element.classList.add('e-disabled');
                    }
                }
            });
            drpButton.appendTo('#drp-button');
            drpButton.element.click();
            const li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>drpButton.dropDown.element.querySelectorAll('li');
            li[5].classList.add('e-focused');
            drpButton.keyBoardHandler(upEventArgs);
            expect((li[1] as Element).classList.contains('e-focused')).toBe(true);
            drpButton.keyBoardHandler(upEventArgs);
            expect((li[5] as Element).classList.contains('e-focused')).toBe(true);
        });

        it('Popup with all item disabled downarrow testing', () => {
            drpButton = new DropDownButton({
                items: items,
                beforeItemRender: (args: MenuEventArgs) => {
                    args.element.classList.add('e-disabled');
                }
            });
            drpButton.appendTo('#drp-button');
            drpButton.element.click();
            const li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>drpButton.dropDown.element.querySelectorAll('li');
            drpButton.keyBoardHandler(downEventArgs);
            expect((li[0] as Element).classList.contains('e-focused')).toBe(false);
        });

        const escEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            keyCode: 27,
            target: null
        };

        it('Escape key checking', () => {
            drpButton = new DropDownButton({ items: items });
            drpButton.appendTo('#drp-button');
            drpButton.element.click();
            drpButton.keyBoardHandler(escEventArgs);
            expect(drpButton.dropDown.element.classList.contains('e-popup-open')).toBeFalsy();
            drpButton.keyBoardHandler(escEventArgs);
        });

        const tabEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            keyCode: 9,
            target: null
        };

        it('Tab key checking', () => {
            drpButton = new DropDownButton({ items: items });
            drpButton.appendTo('#drp-button');
            tabEventArgs.target = element;
            element.focus();
            drpButton.keyBoardHandler(tabEventArgs);
            drpButton.element.click();
            expect(drpButton.dropDown.element.classList.contains('e-popup-open')).toBeTruthy();
            tabEventArgs.target = drpButton.getULElement().children[1];
            drpButton.keyBoardHandler(tabEventArgs);
            expect(drpButton.dropDown.element.classList.contains('e-popup-open')).toBeFalsy();
        });

        const enterEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            keyCode: 13,
            target: null
        };

        it('Enter key checking', () => {
            drpButton = new DropDownButton({ items: items });
            drpButton.appendTo('#drp-button');
            drpButton.element.click();
            const li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>drpButton.dropDown.element.querySelectorAll('li');
            li[0].classList.add('e-focused');
            drpButton.keyBoardHandler(downEventArgs);
            enterEventArgs.target = li[1];
            drpButton.keyBoardHandler(enterEventArgs);
            expect(drpButton.dropDown.element.classList.contains('e-popup-open')).toBeFalsy();
            drpButton.element.click();
            enterEventArgs.target = drpButton.dropDown.element.children[0];
            drpButton.keyBoardHandler(enterEventArgs);
            drpButton.element.click();
            enterEventArgs.target = drpButton.dropDown.element;
            drpButton.keyBoardHandler(enterEventArgs);
        });

        const spaceEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            keyCode: 32,
            target: null
        };

        it('Space key checking', () => {
            drpButton = new DropDownButton({ items: items });
            drpButton.appendTo('#drp-button');
            spaceEventArgs.target = element;
            drpButton.keyBoardHandler(spaceEventArgs);
            expect(drpButton.dropDown.element.classList.contains('e-popup-open')).toBeTruthy();
            const li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>drpButton.dropDown.element.querySelectorAll('li');
            li[0].classList.add('e-focused');
            drpButton.keyBoardHandler(downEventArgs);
            spaceEventArgs.target = li[1];
            drpButton.keyBoardHandler(spaceEventArgs);
            expect(drpButton.dropDown.element.classList.contains('e-popup-open')).toBeFalsy();
        });

        const altDownEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            altKey: true,
            keyCode: 40,
            target: null
        };

        it('Alt + down key checking', () => {
            drpButton = new DropDownButton({ items: items });
            drpButton.appendTo('#drp-button');
            altDownEventArgs.target = drpButton.element;
            drpButton.keyBoardHandler(altDownEventArgs);
            expect(drpButton.dropDown.element.classList.contains('e-popup-open')).toBeTruthy();
        });

        const altUpEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            altKey: true,
            keyCode: 38,
            target: null
        };

        it('Alt + up key checking', () => {
            drpButton = new DropDownButton({ items: items });
            drpButton.appendTo('#drp-button');
            drpButton.keyBoardHandler(altUpEventArgs);
            expect(drpButton.dropDown.element.classList.contains('e-popup-open')).toBeFalsy();
        });
    });

    describe('EventArgs Checking', () => {
        afterEach(() => {
            drpButton.destroy();
        });

        const enterEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            keyCode: 13,
            target: null
        };

        it('Select Event Args Testing', () => {
            drpButton = new DropDownButton({
                items: items,
                select: (args: MenuEventArgs) => {
                    expect(args.name).toBe('select');
                    expect(args.element).toBe(li[2] as HTMLElement);
                    expect(args.item.text).toBe('Paste');
                    expect(args.event).not.toBeNull();
                }
            });
            drpButton.appendTo('#drp-button');
            enterEventArgs.target = element;
            drpButton.keyBoardHandler(enterEventArgs);
            const li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>drpButton.dropDown.element.querySelectorAll('li');
            enterEventArgs.target = li[2];
            drpButton.keyBoardHandler(enterEventArgs);
        });

        it('beforeOpen Event Args Testing', () => {
            drpButton = new DropDownButton({
                items: items,
                beforeOpen: (args: BeforeOpenCloseMenuEventArgs) => {
                    expect(args.name).toBe('beforeOpen');
                    expect(args.element).toBe(drpButton.dropDown.element.children[0] as HTMLElement);
                    expect(args.items).toBe(drpButton.items);
                    expect(args.event.type).toBe('click');
                    expect(args.cancel).toBeFalsy();
                    args.cancel = true;
                }
            });
            drpButton.appendTo('#drp-button');
            expect(element.classList.contains('e-active')).toBeFalsy();
            element.click();
            expect(element.classList.contains('e-active')).toBeFalsy();
            expect(drpButton.dropDown.element.classList.contains('e-popup-open')).toBeFalsy();
        });

        it('beforeClose Event Args Testing', () => {
            drpButton = new DropDownButton({
                items: items,
                beforeClose: (args: BeforeOpenCloseMenuEventArgs) => {
                    expect(args.name).toBe('beforeClose');
                    expect(args.element).toBe(drpButton.getULElement());
                    expect(args.items).toBe(drpButton.items);
                    expect(args.event.type).toBe('click');
                    expect(args.cancel).toBeFalsy();
                    args.cancel = true;
                }
            });
            drpButton.appendTo('#drp-button');
            element.click();
            expect(element.classList.contains('e-active')).toBeTruthy();
            expect(drpButton.dropDown.element.classList.contains('e-popup-open')).toBeTruthy();
            (drpButton.dropDown.element.querySelectorAll('li')[0] as HTMLElement).click();
            expect(element.classList.contains('e-active')).toBeTruthy();
            expect(drpButton.dropDown.element.classList.contains('e-popup-open')).toBeTruthy();
        });

        it('open and close Event Args Testing', () => {
            drpButton = new DropDownButton({
                items: items,
                open: (args: OpenCloseMenuEventArgs) => {
                    expect(args.name).toBe('open');
                    expect(args.element).toBe(drpButton.getULElement());
                    expect(args.items).toBe(drpButton.items);
                    expect(element.classList.contains('e-active')).toBeTruthy();
                    expect(drpButton.dropDown.element.classList.contains('e-popup-open')).toBeTruthy();
                },
                close: (args: OpenCloseMenuEventArgs) => {
                    expect(args.name).toBe('close');
                    expect(args.element).toBe(drpButton.getULElement());
                    expect(args.items).toBe(drpButton.items);
                    expect(element.classList.contains('e-active')).toBeFalsy();
                    expect(drpButton.dropDown.element.classList.contains('e-popup-close')).toBeTruthy();
                }
            });
            drpButton.appendTo('#drp-button');
            // opening the popup
            element.click();
            // closing the popup
            element.click();
        });
    });

    describe('Device Mode Checking', () => {
        afterEach(() => {
            drpButton.destroy();
        });
        const mouseEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            target: null,
            type: 'click'
        };
        it('Click event Checking', () => {
            const androidUserAgent: string = 'Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) ' +
                'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36';
            Browser.userAgent = androidUserAgent;
            drpButton = new DropDownButton({ items: items });
            drpButton.appendTo('#drp-button');
            element.click();
            expect(drpButton.dropDown.element.classList.contains('e-popup-open')).toBeTruthy();
            const li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>drpButton.dropDown.element.querySelectorAll('li');
            mouseEventArgs.target = li[1].firstChild;
            drpButton.clickHandler(mouseEventArgs);
            expect(drpButton.dropDown.element.classList.contains('e-popup-close')).toBeTruthy();
        });
        it('Click event Checking for ios', () => {
            const iosUserAgent: string = 'Mozilla/5.0 (iPhone; CPU iPhone OS 5_0 like Mac OS X) ' +
                'AppleWebKit/534.46 (KHTML, like Gecko) Version/5.1 Mobile/9A334 Safari/7534.48.3';
            Browser.userAgent = iosUserAgent;
            drpButton = new DropDownButton({ items: items });
            drpButton.appendTo('#drp-button');
            element.click();
            expect(drpButton.dropDown.element.classList.contains('e-popup-open')).toBeTruthy();
            const li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>drpButton.dropDown.element.querySelectorAll('li');
            mouseEventArgs.target = li[1].firstChild;
            drpButton.clickHandler(mouseEventArgs);
            expect(drpButton.dropDown.element.classList.contains('e-popup-close')).toBeTruthy();
        });
    });

    describe('CR issues', () => {
        afterEach(() => {
            drpButton.destroy();
        });
        it('EJ2-48782 - Dropdown issue on dynamic update of Disabled property', () => {
            drpButton = new DropDownButton({ items: items });
            drpButton.appendTo('#drp-button');
            drpButton.disabled = true;
            drpButton.dataBind();
            drpButton.disabled = false;
            drpButton.dataBind();
            expect(element.getAttribute('disabled')).toBeNull();
        });
        it('EJ2-69116 - Dynamically changeing the dropdown button property using the setProperties', () => {
            drpButton = new DropDownButton({ items: items });
            drpButton.appendTo('#drp-button');
            drpButton.setProperties({cssClass:'e-vertical'});
            expect(drpButton.dropDown.element.classList.contains('e-vertical')).toBeTruthy();
        });
    });

    it('memory leak', () => {
        profile.sample();
        const average: any = inMB(profile.averageChange);
        // check average change in memory samples to not be over 10MB
        expect(average).toBeLessThan(10);
        const memory: any = inMB(getMemoryProfile());
        // check the final memory usage against the first usage, there should be little change if everything was properly deallocated
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
    });
});