/* eslint-disable @typescript-eslint/no-explicit-any */
import { SplitButton } from '../src/split-button/split-button';
import { ItemModel } from '../src/common/common-model';
import { createElement } from '@syncfusion/ej2-base';
import { profile , inMB, getMemoryProfile } from './common.spec';
import { BeforeOpenCloseMenuEventArgs, OpenCloseMenuEventArgs } from '../src';
/**
 * Split Button spec
 */
describe('Split Button', () => {
    beforeAll(() => {
        const isDef: any = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log('Unsupported environment, window.performance.memory is unavailable');
            pending(); // skips test (in Chai)
            return;
        }
    });

    let button: any;
    const items: ItemModel[] = [
        {
            text: 'Cut',
        },
        {
            text: 'Copy',
        },
        {
            text: 'Paste',
        }];
    const element: any = createElement('button', { id: 'splitbtn' });
    document.body.appendChild(element);

    afterEach(() => {
        button.destroy();
    });

    it('Architecture', () => {
        button = new SplitButton({}, '#splitbtn');
        expect(element.parentElement.classList).toContain('e-split-btn-wrapper');
        expect(element.nextElementSibling.classList).toContain('e-dropdown-btn');
    });

    it('aria-haspopup attribute should not be present', () => {
        button = new SplitButton({ items: items }, '#splitbtn');
        expect(element.hasAttribute('aria-haspopup')).toBeFalsy();
    });

    it('click event args', () => {
        const click: any = (args: any) => {
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

    it('Create popup on open', () => {
        button = new SplitButton({ items: items, createPopupOnClick: true }, '#splitbtn');
        expect(button.secondaryBtnObj.dropDown).toEqual(undefined);
        button.secondaryBtnObj.element.click();
        expect(button.secondaryBtnObj.dropDown.element.classList.contains('e-popup-open')).toEqual(true);
    });

    it('Create popup on open', () => {
        button = new SplitButton({ items: items, createPopupOnClick: true }, '#splitbtn');
        button.element.click();
        expect(button.secondaryBtnObj.dropDown).toEqual(undefined);
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
        const altDownEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            action: 'altdownarrow',
            type: 'keyup',
            target: null
        };
        button = new SplitButton({ items: items });
        button.appendTo('#splitbtn');
        altDownEventArgs.target = button.element;
        button.btnKeyBoardHandler(altDownEventArgs);
        expect(button.dropDown.element.classList.contains('e-popup-open')).toBeFalsy();
    });

    it('Alt + down key on dropdown button opens popup', () => {
        const altDownEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            action: 'altdownarrow',
            type: 'keyup',
            target: null
        };
        button = new SplitButton({ items: items });
        button.appendTo('#splitbtn');
        button.issecondaryBtnClick = true;
        altDownEventArgs.target = button.element;
        button.btnKeyBoardHandler(altDownEventArgs);
        expect(button.dropDown.element.classList.contains('e-popup-open')).toBeTruthy();
    });

    it('Alt + up key checking', () => {
        const altUpEventArgs: any = {
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

    it('Enter key on primary button does not open popup', () => {
        const enterEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            keyCode: 13,
            action: 'enter',
            target: null
        };
        button = new SplitButton({ items: items });
        button.appendTo('#splitbtn');
        enterEventArgs.target = button.element;
        button.btnKeyBoardHandler(enterEventArgs);
        expect(button.dropDown.element.classList.contains('e-popup-close')).toBeTruthy();
    });

    it('Enter key on dropdown button does open popup', () => {
        const enterEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            keyCode: 13,
            action: 'enter',
            target: null
        };
        button = new SplitButton({ items: items });
        button.appendTo('#splitbtn');
        button.issecondaryBtnClick = true;
        enterEventArgs.target = button.element;
        button.btnKeyBoardHandler(enterEventArgs);
        expect(button.dropDown.element.classList.contains('e-popup-open')).toBeTruthy();
    });

    it('Enter key checking', () => {
        const enterEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            keyCode: 13,
            action: 'enter',
            target: null
        };
        const downEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            key: 'altdownarrow',
            type: 'keyup',
            target: null
        };
        const onSelect: any = (args: any) => {
            expect(args.item.text).toEqual('Copy');
        };
        button = new SplitButton({ items: items, select: onSelect });
        button.appendTo('#splitbtn');
        button.secondaryBtnObj.element.click();
        const li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>button.dropDown.element.querySelectorAll('li');
        li[0].classList.add('e-focused');
        button.keyBoardHandler(downEventArgs);
        enterEventArgs.target = li[1];
        button.issecondaryBtnClick = true;
        button.btnKeyBoardHandler(enterEventArgs);
        expect(button.dropDown.element.classList.contains('e-popup-open')).toBeFalsy();
        button.secondaryBtnObj.element.click();
        enterEventArgs.target = button.dropDown.element.children[0];
        button.keyBoardHandler(enterEventArgs);
    });

    it('Space key on dropdown button opens popup', () => {
        const spaceEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            keyCode: 32,
            action: 'space',
            target: null
        };
        button = new SplitButton({ items: items });
        button.appendTo('#splitbtn');
        spaceEventArgs.target = button.secondaryBtnObj.element;
        button.secondaryBtnObj.keyBoardHandler(spaceEventArgs);
        expect(button.dropDown.element.classList.contains('e-popup-open')).toBeTruthy();
        const li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>button.dropDown.element.querySelectorAll('li');
        li[0].classList.add('e-focused');
        spaceEventArgs.target = li[1];
        button.secondaryBtnObj.keyBoardHandler(spaceEventArgs);
        expect(button.dropDown.element.classList.contains('e-popup-open')).toBeFalsy();
    });

    it('Home key focuses first item in popup', () => {
        const homeEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            keyCode: 36,
            target: null
        };
        button = new SplitButton({ items: items });
        button.appendTo('#splitbtn');
        button.secondaryBtnObj.element.click();
        const li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>button.dropDown.element.querySelectorAll('li');
        li[2].classList.add('e-focused');
        homeEventArgs.target = li[2];
        button.secondaryBtnObj.keyBoardHandler(homeEventArgs);
        expect((li[0] as Element).classList.contains('e-focused')).toBe(true);
        expect((li[2] as Element).classList.contains('e-focused')).toBe(false);
    });

    it('End key focuses last item in popup', () => {
        const endEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            keyCode: 35,
            target: null
        };
        button = new SplitButton({ items: items });
        button.appendTo('#splitbtn');
        button.secondaryBtnObj.element.click();
        const li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>button.dropDown.element.querySelectorAll('li');
        li[0].classList.add('e-focused');
        endEventArgs.target = li[0];
        button.secondaryBtnObj.keyBoardHandler(endEventArgs);
        expect((li[2] as Element).classList.contains('e-focused')).toBe(true);
        expect((li[0] as Element).classList.contains('e-focused')).toBe(false);
    });

    it('Home key skips separator and disabled items in popup', () => {
        const homeEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            keyCode: 36,
            target: null
        };
        const homeItems: ItemModel[] = [
            { separator: true },
            { text: 'Cut', disabled: true },
            { text: 'Copy' },
            { text: 'Paste' }
        ];
        button = new SplitButton({ items: homeItems });
        button.appendTo('#splitbtn');
        button.secondaryBtnObj.element.click();
        const li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>button.dropDown.element.querySelectorAll('li');
        homeEventArgs.target = li[3];
        button.secondaryBtnObj.keyBoardHandler(homeEventArgs);
        expect((li[2] as Element).classList.contains('e-focused')).toBe(true);
        expect((li[0] as Element).classList.contains('e-focused')).toBe(false);
        expect((li[1] as Element).classList.contains('e-focused')).toBe(false);
    });

    it('End key skips separator and disabled items in popup', () => {
        const endEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            keyCode: 35,
            target: null
        };
        const endItems: ItemModel[] = [
            { text: 'Cut' },
            { text: 'Copy' },
            { text: 'Paste', disabled: true },
            { separator: true }
        ];
        button = new SplitButton({ items: endItems });
        button.appendTo('#splitbtn');
        button.secondaryBtnObj.element.click();
        const li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>button.dropDown.element.querySelectorAll('li');
        endEventArgs.target = li[0];
        button.secondaryBtnObj.keyBoardHandler(endEventArgs);
        expect((li[1] as Element).classList.contains('e-focused')).toBe(true);
        expect((li[2] as Element).classList.contains('e-focused')).toBe(false);
        expect((li[3] as Element).classList.contains('e-focused')).toBe(false);
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
        const ele: HTMLElement = button.dropDown.element.querySelector('.e-item');
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

    it('Native methods Focus', () => {
        document.body.appendChild(createElement('EJS-SPLITBUTTON', { id: 'angsplitbtn' }));
        button = new SplitButton({}, '#angsplitbtn');
        button.focusIn();
        
    });

    it('Refresh methods', () => {
        document.body.appendChild(createElement('EJS-SPLITBUTTON', { id: 'angsplitbtn' }));
        button = new SplitButton({}, '#angsplitbtn');
        button.isAngular = true;
        button.refresh();
    });

    describe('CR issues', () => {
        afterEach(() => {
            button.destroy();
        });
        it('EJ2-68928 - Script error thrown when we add items in before open event with enable createPopupOnClick property', () => {
            button = new SplitButton({ createPopupOnClick: true,
            beforeOpen: (args: BeforeOpenCloseMenuEventArgs) => {
                button.addItems(items);
            }, open:  (args: OpenCloseMenuEventArgs) => {
                expect(args.items.length).toEqual(3);
            }});
            button.appendTo('#splitbtn');
            button.secondaryBtnObj.element.click();
        });
        it('EJ2-914299 - Split buttons popup not closed when we open with mouse click and select with key down action.', () => {
            const enterEventArgs: any = {
                preventDefault: (): void => { /** NO Code */ },
                keyCode: 13, // Enter key
                action: 'enter',
                target: null
            };
            const downEventArgs: any = {
                preventDefault: (): void => { /** NO Code */ },
                keyCode: 40, // ArrowDown key
                action: 'down',
                target: null
            };
            button = new SplitButton({ items: items, createPopupOnClick: true }, '#splitbtn');
            expect(button.secondaryBtnObj.dropDown).toEqual(undefined);
            button.secondaryBtnObj.element.click();
            expect(button.secondaryBtnObj.dropDown.element.classList.contains('e-popup-open')).toEqual(true);
            const li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>button.dropDown.element.querySelectorAll('li');
            li[0].classList.add('e-focused');
            downEventArgs.target = li[0];
            button.keyBoardHandler(downEventArgs);
            expect(li[0].classList.contains('e-focused')).toBe(false);
            expect(li[1].classList.contains('e-focused')).toBe(true);
            enterEventArgs.target = li[1];
            button.btnKeyBoardHandler(enterEventArgs);
            expect(button.dropDown.element).toBe(null);
            button = new SplitButton({ items: items, createPopupOnClick: true }, '#splitbtn');
            expect(button.secondaryBtnObj.dropDown).toEqual(undefined);
        });

        it('Bug(852075): Inconsistent behavior between mouse clicks and keyboard (Enter) when opening the popup - 1', () => {
            const enterEventArgs: any = {
                preventDefault: (): void => { /** NO Code */ },
                keyCode: 13,
                action: 'enter',
                target: null
            };
            const outerContainer: HTMLElement = createElement('div', {
                className: 'e-pv-annotation-eraser-popup-container',
            });
            document.body.appendChild(outerContainer);
            outerContainer.innerHTML = `
                <ul role="menu" tabindex="0" style="list-style:none; margin:0; padding:0;">
                    <li>Item 1</li>
                    <li>Item 2</li>
                    <li>Item 3</li>
                </ul>
                `;
            button = new SplitButton({
                target: outerContainer,
                iconCss: 'e-pv-ink-eraser-icon e-pv-icon',
            });
            button.appendTo('#splitbtn');
            button.secondaryBtnObj.element.click();
            enterEventArgs.target = button.dropDown.element.children[0];
            button.keyBoardHandler(enterEventArgs);
        });

        it('Bug(852075): Inconsistent behavior between mouse clicks and keyboard (Enter) when opening the popup - 2', () => {
            const enterEventArgs: any = {
                preventDefault: (): void => { /** NO Code */ },
                keyCode: 13,
                action: 'enter',
                target: null
            };
            const outerContainer: HTMLElement = createElement('ul');
            document.body.appendChild(outerContainer);
            outerContainer.innerHTML = `  
                <li>Item 1</li>
                <li>Item 2</li>
                <li>Item 3</li>
                `;
            button = new SplitButton({
                target: outerContainer,
                iconCss: 'e-pv-ink-eraser-icon e-pv-icon',
            });
            button.appendTo('#splitbtn');
            button.secondaryBtnObj.element.click();
            enterEventArgs.target = button.dropDown.element.children[0];
            button.keyBoardHandler(enterEventArgs);
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

    describe('Null or undefined Property testing', () => {

        afterEach(() => {
            button.destroy();
        });    

        it('SplitButton with content', () => {
            button = new SplitButton({ content: null }, '#splitbtn');
            expect(button.content).toEqual(null);
            button.destroy();
            button = new SplitButton({ content: undefined }, '#splitbtn');
            expect(button.content).toEqual("");
        });

        it('SplitButton with cssClass', () => {
            button = new SplitButton({ cssClass: null }, '#splitbtn');
            expect(button.cssClass).toEqual(null);
            button.destroy();
            button = new SplitButton({ cssClass: undefined }, '#splitbtn');
            expect(button.cssClass).toEqual("");
        });

        it('SplitButton with iconCss', () => {
            button = new SplitButton({ iconCss: null }, '#splitbtn');
            expect(button.iconCss).toEqual(null);
            button.destroy();
            button = new SplitButton({ iconCss: undefined }, '#splitbtn');
            expect(button.iconCss).toEqual("");
        });

        it('SplitButton with iconPosition', () => {
            button = new SplitButton({ iconPosition: null }, '#splitbtn');
            expect(button.iconPosition).toEqual(null);
            button.destroy();
            button = new SplitButton({ iconPosition: undefined }, '#splitbtn');
            expect(button.iconPosition).toEqual("Left");
        });

        it('SplitButton with target', () => {
            button = new SplitButton({ target: null }, '#splitbtn');
            expect(button.target).toEqual(null);
            button.destroy();
            button = new SplitButton({ target: undefined }, '#splitbtn');
            expect(button.target).toEqual("");
        });

        it('SplitButton with enableRtl', () => {
            button = new SplitButton({ enableRtl: null }, '#splitbtn');
            expect(button.enableRtl).toEqual(false);
            button.destroy();
            button = new SplitButton({ enableRtl: undefined }, '#splitbtn');
            expect(button.enableRtl).toEqual(false);
        });

        it('SplitButton with createPopupOnClick', () => {
            button = new SplitButton({ createPopupOnClick: null }, '#splitbtn');
            expect(button.createPopupOnClick).toEqual(null);
            button.destroy();
            button = new SplitButton({ createPopupOnClick: undefined }, '#splitbtn');
            expect(button.createPopupOnClick).toEqual(false);
        });

        it('SplitButton with enableHtmlSanitizer', () => {
            button = new SplitButton({ enableHtmlSanitizer: null }, '#splitbtn');
            expect(button.enableHtmlSanitizer).toEqual(null);
            button.destroy();
            button = new SplitButton({ enableHtmlSanitizer: undefined }, '#splitbtn');
            expect(button.enableHtmlSanitizer).toEqual(true);
        });

        it('SplitButton with createPopupOnClick', () => {
            button = new SplitButton({ createPopupOnClick: null }, '#splitbtn');
            expect(button.createPopupOnClick).toEqual(null);
            button.destroy();
            button = new SplitButton({ createPopupOnClick: undefined }, '#splitbtn');
            expect(button.createPopupOnClick).toEqual(false);
        });

        it('SplitButton with enablePersistence', () => {
            button = new SplitButton({ enablePersistence: null }, '#splitbtn');
            expect(button.enablePersistence).toEqual(null);
            button.destroy();
            button = new SplitButton({ enablePersistence: undefined }, '#splitbtn');
            expect(button.enablePersistence).toEqual(false);
        });

        it('SplitButton with items', () => {
            button = new SplitButton({ items: null }, '#splitbtn');
            expect(button.items).toEqual([]);
            button.destroy();
            button = new SplitButton({ items: undefined }, '#splitbtn');
            expect(button.items).toEqual([]);
        });

        it('SplitButton with locale', () => {
            button = new SplitButton({ locale: null }, '#splitbtn');
            expect(button.locale).toEqual('en-US');
            button.destroy();
            button = new SplitButton({ locale: undefined }, '#splitbtn');
            expect(button.locale).toEqual('en-US');
        });

    });



});
