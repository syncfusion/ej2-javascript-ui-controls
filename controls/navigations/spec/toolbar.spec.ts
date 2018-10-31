/**
 * toolbar spec document
 */
import { ScrollEventArgs, TouchEventArgs, Browser } from '@syncfusion/ej2-base';
import { createElement, isVisible, setStyleAttribute } from '@syncfusion/ej2-base';
import { Toolbar, ClickEventArgs, BeforeCreateArgs } from '../src/toolbar/toolbar';
import {  ItemModel } from '../src/toolbar/toolbar-model';
import { HScroll } from '../src/common/h-scroll';
import { Button } from '@syncfusion/ej2-buttons';
import '../node_modules/es6-promise/dist/es6-promise';

const CLS_DISABLE: string = 'e-overlay';
const CLS_POPUPNAV: string = 'e-hor-nav';

let ieUa: string = 'Mozilla/5.0 (Windows NT 6.3; WOW64; Trident/7.0; Touch; .NET4.0E; .NET4.0C; ' +
    'Tablet PC 2.0; .NET CLR 3.5.30729; .NET CLR 2.0.50727; .NET CLR 3.0.30729; InfoPath.3; rv:11.0) like Gecko';

describe('Toolbar Control', () => {
    let css: string = ".e-toolbar { height: auto;white-space: nowrap; display:block;position:relative } .e-separator { border-right:1px solid; height: 15px; margin: 7.5px 3px} .e-toolbar .e-toolbar-items .e-toolbar-item.e-separator + .e-separator { display:none } .e-toolbar-items { display: inline-block; } .e-toolbar-items.e-hscroll { width:inherit; }  .e-toolbar .e-fix-width {width : 0px !important; } .e-toolbar .e-tbarpop  { position: fixed; } .e-toolbar-items .e-toolbar-item, .e-toolbar-left, .e-toolbar-center, .e-toolbar-right { display: inline-block; } .e-toolbar .e-hor-nav { float:right; width:30px; }  .e-toolbar .e-toolbar-pop { position: fixed;} .e-popup-open { display:block } .e-popup-close { display: none } button {font-family:Arial; font-size: 14px; padding: 1px 6px} ";
    let style: HTMLStyleElement = document.createElement('style'); style.type = 'text/css';
    let styleNode: Node = style.appendChild(document.createTextNode(css));
    document.getElementsByTagName('head')[0].appendChild(style);


    // DOM Element with Control Class testing
    describe('Dom toolbar element', () => {
        let toolbar: any;
        beforeEach((): void => {
            toolbar = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Toolbar' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (toolbar) {
                toolbar.destroy();
            }
            document.body.innerHTML = '';
        });

        it('Control class testing', () => {
            toolbar = new Toolbar();
            toolbar.appendTo('#ej2Toolbar');
            toolbar.checkOverflow();
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            expect(element.classList.contains('e-toolbar')).toEqual(true);
            expect(element.style.width).toEqual('auto');
        });
    });

    // Main Property  with items Default value testing.
    describe('Main Property with default value', () => {
        let toolbar: Toolbar;
        beforeEach((): void => {
            toolbar = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Toolbar' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (toolbar) {
                toolbar.destroy();
            }
            document.body.innerHTML = '';
        });

        it('default Value testing', () => {
            toolbar = new Toolbar({
                items: [
                    {
                        type: 'Button',
                        text: 'Bold',
                    }]
            });
            toolbar.appendTo('#ej2Toolbar');
            expect(toolbar.items[0].id).toEqual('');
            expect(toolbar.items[0].cssClass).toEqual('');
            expect(toolbar.items[0].prefixIcon).toEqual('');
            expect(toolbar.items[0].suffixIcon).toEqual('');
            expect(toolbar.items[0].template).toEqual('');
            expect(toolbar.items[0].tooltipText).toEqual('');
            expect(toolbar.items[0].align).toEqual('Left');
            expect(toolbar.items[0].showAlwaysInPopup).toBe(false);
        });
    });

    describe('Main Property with Items Button value', () => {
        let toolbar: Toolbar;
        beforeEach((): void => {
            toolbar = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Toolbar' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (toolbar) {
                toolbar.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Item button property testing', () => {
            toolbar = new Toolbar({
                items: [
                    {
                        type: 'Button',
                        text: 'Bold',
                    }]
            });
            toolbar.appendTo('#ej2Toolbar');
            let element: Element = document.getElementsByClassName('e-toolbar')[0];
            expect(element.children.length).toEqual(1);
            expect(element.getElementsByClassName('e-toolbar-items').length).toEqual(1);
            expect(element.getElementsByClassName('e-toolbar-item').length).toEqual(1);
            if (toolbar.items[0].type.toString() === 'Button') {
                expect(element.getElementsByClassName('e-toolbar-item')[0].getElementsByTagName('button').length).toEqual(1);
                expect(element.querySelector('.e-toolbar-item').firstElementChild.getAttribute('type')).toBe('button');
            }
        });
    });

    //Items Width property testing
    describe('Main Property Width Property testing', () => {
        let toolbar: Toolbar;
        beforeEach((): void => {
            toolbar = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Toolbar' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (toolbar) {
                toolbar.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Width property as number testing', () => {
            toolbar = new Toolbar({
                width: 500
            });
            toolbar.appendTo('#ej2Toolbar');
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            expect(element.style.width).toEqual('500px');
        });

        it('Width property as string testing', () => {
            toolbar = new Toolbar({
                width: '500px', items: [{ type: 'Separator', cssClass: 'e-contentItem e-css-class' }]
            });
            toolbar.appendTo('#ej2Toolbar');
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            expect(element.querySelector('.e-toolbar-items .e-toolbar-item').classList.contains('e-contentItem')).toEqual(true);
            expect(element.querySelector('.e-toolbar-items .e-toolbar-item').classList.contains('e-css-class')).toEqual(true);
            expect(element.style.width).toEqual('500px');
        });
    });

    //Items Height property testing
    describe('Main Property Height Property testing', () => {
        let toolbar: Toolbar;
        beforeEach((): void => {
            toolbar = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Toolbar' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (toolbar) {
                toolbar.destroy();
            }
            document.body.innerHTML = '';
        });

        it('Height property as number testing', () => {
            toolbar = new Toolbar({
                height: 500
            });
            toolbar.appendTo('#ej2Toolbar');
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            expect(element.style.height).toEqual('500px')
        });

        it('Height property as string testing', () => {
            toolbar = new Toolbar({
                height: '500px', items: [{ type: 'Separator', cssClass: 'e-contentItem' }]
            });
            toolbar.appendTo('#ej2Toolbar');
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            expect(element.querySelector('.e-toolbar-items .e-toolbar-item').classList.contains('e-contentItem')).toEqual(true);
            expect(element.style.height).toEqual('500px')
        });

        it('Height property sets throught onPropertyChange', () => {
            toolbar = new Toolbar({
                items: [{ type: 'Separator' }]
            });
            toolbar.appendTo('#ej2Toolbar');
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            expect(element.style.height).toEqual('auto');
            toolbar.height = '300px';
            toolbar.dataBind();
            expect(element.style.height).toEqual('300px');
            toolbar.height = 'auto';
            toolbar.dataBind();
            expect(element.style.height).toEqual('auto');
        });

    });


    //Item separator testing
    describe('Main Property Item separator', () => {
        let toolbar: Toolbar;
        beforeEach((): void => {
            toolbar = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Toolbar' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (toolbar) {
                toolbar.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Item separator property testing', () => {
            toolbar = new Toolbar({
                items: [
                    {
                        type: 'Separator',
                    }]
            });
            toolbar.appendTo('#ej2Toolbar');
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            if (toolbar.items[0].type.toString() === 'Separator') {
                expect(element.getElementsByClassName('e-separator').length).toEqual(1);
            }
        });
    });

    //Persistance testing with OverflowMode property
    describe('Persistance testing', () => {
        let toolbar: Toolbar;
        beforeEach((): void => {
            toolbar = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Toolbar' });
            setStyleAttribute(ele, { 'display': 'block', 'white-space': 'nowrap', 'position': 'relative' });
            ele.style.display = 'block';
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (toolbar) {
                toolbar.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Overflow style as scroll testing', () => {
            window.localStorage.setItem('toolbarej2Toolbar', JSON.stringify({ overflowMode: 'Popup' }));
            toolbar = new Toolbar({
                width: 20,
                enablePersistence: true,
                items: [{
                    type: 'Button', text: 'Bold',
                }],
            });
            toolbar.appendTo('#ej2Toolbar');
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            expect(JSON.parse(window.localStorage.toolbarej2Toolbar).hasOwnProperty()).toEqual(false);
        });
    });

    //Toolbar Event Testing
    describe('Event and destroy function testing', () => {
        let toolbar: Toolbar;
        let i: number = 0;
        function clickFn(): void {
            i++;
        }
        beforeEach((): void => {
            toolbar = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Toolbar' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (toolbar) {
                toolbar.destroy();
            }
        });

        it('BeforeCreate,create and click event testing', () => {
            toolbar = new Toolbar({
                width: '500px',
                created: clickFn,
                destroyed: clickFn,
                clicked: clickFn,
                beforeCreate: clickFn,
                items: [{ type: 'Separator' }]
            });
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar.appendTo('#ej2Toolbar');
            expect(i).toEqual(2);
            element.click();
            expect(i).toEqual(2);
        });

        it('Destroy event and function testing', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            expect(i).toEqual(3);
            expect(element.classList.contains('e-cornor')).toEqual(false);
            expect(element.classList.contains('e-toolbar')).toEqual(false);
            expect(element.children.length).toEqual(0);
            element.click();
            expect(i).toEqual(3);
        });
    });

    //OnProperty Change Width property testing
    describe('onPropertyChanged function testing', () => {
        let toolbar: Toolbar;
        beforeEach((): void => {
            toolbar = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Toolbar' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (toolbar) {
                toolbar.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Width property as number testing', () => {
            toolbar = new Toolbar({ items: [{ type: 'Separator' }] });
            toolbar.appendTo('#ej2Toolbar');
            toolbar.width = 500;
            toolbar.dataBind();
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            expect(element.style.width).toEqual('500px')
        });

        it('Width property as string testing', () => {
            toolbar = new Toolbar({ items: [{ type: 'Separator' }] });
            toolbar.appendTo('#ej2Toolbar');
            toolbar.width = '500px';
            toolbar.dataBind();
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            expect(element.style.width).toEqual('500px')
        });

        it('Width property as empty string testing', () => {
            toolbar = new Toolbar({ items: [{ type: 'Separator' }] });
            toolbar.appendTo('#ej2Toolbar');
            toolbar.width = '';
            toolbar.dataBind();
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            expect(element.style.width).toEqual('auto')
        });
    });

    //OnProperty Change Item testing both separator and button.
    describe('onPropertyChanged function testing', () => {
        let toolbar: Toolbar;
        beforeEach((): void => {
            toolbar = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Toolbar' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (toolbar) {
                toolbar.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Item separator property testing', () => {
            toolbar = new Toolbar();
            toolbar.appendTo('#ej2Toolbar');
            toolbar.items = [{ type: 'Separator', }]
            toolbar.dataBind();
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            if (toolbar.items[0].type.toString() === 'Separator') {
                expect(element.getElementsByClassName('e-separator').length).toEqual(1);
            }
        });

        it('Item button property testing', () => {
            toolbar = new Toolbar({});
            toolbar.appendTo('#ej2Toolbar');
            toolbar.items = [{ type: 'Button', text: 'Bold' }];
            toolbar.dataBind();
            let element: Element = document.getElementsByClassName('e-toolbar')[0];
            expect(element.children.length).toEqual(1);
            expect(element.getElementsByClassName('e-toolbar-items').length).toEqual(1);
            expect(element.getElementsByClassName('e-toolbar-item').length).toEqual(1);
            if (toolbar.items[0].type.toString() === 'Button') {
                expect(element.getElementsByClassName('e-toolbar-item')[0].getElementsByTagName('button').length).toEqual(1);
            }
        });
    });

    //Overflow with Hscroll Module.
    describe('Overflow content Testing', () => {
        let toolbar: Toolbar;
        beforeEach((): void => {
            toolbar = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Toolbar' });
            setStyleAttribute(ele, { 'display': 'block', 'white-space': 'nowrap', 'position': 'relative' });
            ele.style.display = 'block';
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (toolbar) {
                toolbar.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Overflow style as hidden testing', () => {
            toolbar = new Toolbar({
                items: [{
                    type: 'Button', text: 'Bold',
                }],
            });
            toolbar.appendTo('#ej2Toolbar');
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            expect(element.classList.contains('e-hscroll')).toEqual(false);
            let scrollEvent = document.createEvent('MouseEvents');
            scrollEvent.initEvent('scroll', false, false);
            element.dispatchEvent(scrollEvent);
        });
        it('Overflow style as scroll testing', () => {
            toolbar = new Toolbar({
                width: 30,
                items: [{
                    type: 'Button', text: 'Bold',
                }],
            });
            toolbar.appendTo('#ej2Toolbar');
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            let innerelement: NodeList = element.getElementsByClassName('e-toolbar-items');
            setStyleAttribute(<HTMLElement>innerelement[0], { display: 'inline-block' });
            setStyleAttribute(<HTMLElement>element.getElementsByClassName('e-toolbar-item')[0], { display: 'inline-block' });
            toolbar.items = [{
                type: 'Button', text: 'Bold',
            }];
            toolbar.dataBind();
            expect(element.children.length).toEqual(1);
            expect(toolbar.items.length).toEqual(1);
            let scrollELe: HTMLElement = <HTMLElement>element.children[0];
            expect(scrollELe.classList.contains('e-hscroll')).toEqual(true);
        });

        it('Overflow navigation testing', () => {
            toolbar = new Toolbar({
                width: 30,
                items: [{
                    type: 'Button', text: 'Bold',
                }],
            });
            toolbar.appendTo('#ej2Toolbar');
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            let scrollELe: HTMLElement = <HTMLElement>element.children[0];
            expect(scrollELe.classList.contains('e-hscroll')).toEqual(true);
            let innerNavEle: HTMLElement = <HTMLElement>scrollELe.querySelector('.e-scroll-right-nav');
            expect(innerNavEle.classList.contains('e-scroll-nav')).toEqual(true);
            let innerNavElement: HTMLElement = <HTMLElement>innerNavEle.querySelector('.e-icons');
            expect(innerNavElement.classList.contains('e-nav-arrow')).toEqual(true);
            expect(innerNavElement.classList.contains('e-nav-right-arrow')).toEqual(true);
            let scrollEvent = document.createEvent('MouseEvents');
            scrollEvent.initEvent('scroll', false, false);
            innerNavElement.remove();
            element.dispatchEvent(scrollEvent);
        });
    });

    //Overflow with Horizontal scrolling testing.
    describe('Overflow content horizontal scrolling  Testing', () => {
        let toolbar: Toolbar;
        it('Overflow navigation horizontal scrolling event handler testing', () => {
            toolbar = undefined;
            let ele: HTMLElement = createElement("div", { id: 'ej2Toolbar' });
            setStyleAttribute(ele, { 'display': 'block', 'white-space': 'nowrap', 'position': 'relative' });
            ele.style.display = 'block';
            document.body.appendChild(ele);
            toolbar = new Toolbar({
                width: 100,
                items: [{
                    type: 'Button', text: 'Bold'
                }, {
                    type: 'Button', text: 'Underline'
                }],
            });
            toolbar.appendTo('#ej2Toolbar');
            expect(toolbar.element.querySelectorAll('.e-toolbar-item')[0].getAttribute('aria-disabled')).toBe('false');
            expect(toolbar.element.querySelectorAll('.e-toolbar-item')[1].getAttribute('aria-disabled')).toBe('false');
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            let scrollELe: HTMLElement = <HTMLElement>element.children[0];
            expect(scrollELe.classList.contains('e-hscroll')).toEqual(true);
            scrollELe.style.display = 'inline-block';
            toolbar.items = [{
                type: 'Button', text: 'Underline',
            },{
                type: 'Button', text: 'bold',
            }]
            toolbar.dataBind();
            expect(scrollELe.classList.contains('e-hscroll')).toEqual(true);
            let innerNavElement: HTMLElement = <HTMLElement>scrollELe.children[2];
            let innerArrowEle: HTMLElement = <HTMLElement>innerNavElement.querySelector('.e-icons');
            expect(innerArrowEle.classList.contains('e-nav-right-arrow')).toEqual(true);
            let scrollEvent = document.createEvent('MouseEvents');
            let scrollCon: HTMLElement = <HTMLElement>element.querySelector('.e-hscroll-bar');
            innerNavElement.click();
            innerArrowEle.click();
        });

        it('Overflow navigation event handler testing', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                width: 20,
            });
            toolbar.appendTo('#ej2Toolbar');
            let scrollELe: HTMLElement = <HTMLElement>element.children[0];
            expect(scrollELe.classList.contains('e-hscroll')).toEqual(true);
        });
    });

    //OverflowMode main Property testing
    describe('Main property OverflowMode testing', () => {
        let toolbar: Toolbar;
        document.body.innerHTML = '';
        beforeEach((): void => {
            toolbar = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Toolbar' });
            setStyleAttribute(ele, { 'display': 'block', 'white-space': 'nowrap', 'position': 'relative' });
            ele.style.display = 'block';
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (toolbar) {
                toolbar.destroy();
            }
            document.body.innerHTML = '';
        });
        it(' Main property OverflowMode given as string testing', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                width: 30,
                overflowMode: "Scrollable",
                items: [{
                    type: 'Button', text: 'Underline',
                }],
            });
            toolbar.appendTo('#ej2Toolbar');
            let scrollELe: HTMLElement = <HTMLElement>element.children[0];
            expect(scrollELe.classList.contains('e-hscroll')).toEqual(true);
        });
        it(' Main property OverflowMode given as string testing', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                width: 30,
                overflowMode: "Popup",
                items: [{
                    type: 'Button', text: 'Underline',
                }],
            });
            toolbar.appendTo('#ej2Toolbar');
            let scrollELe: HTMLElement = <HTMLElement>element.children[0];
            expect(scrollELe.classList.contains('e-hscroll')).toEqual(false);
        });
        it(' Main property OverflowMode given as string testing', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                width: 30,
                overflowMode: "MultiRow",
                items: [{
                    type: 'Button', text: 'Underline',
                }],
            });
            toolbar.appendTo('#ej2Toolbar');
            let inlineELe: HTMLElement = <HTMLElement>element.children[0];
            expect(inlineELe.classList.contains('e-toolbar-multirow')).toEqual(true);
        });
        it(' Main property OverflowMode given as string testing', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                width: '200px',
                overflowMode: "Extended",
                items: [
                {
                    type: 'Button', text: 'Underline'
                },
                {
                    type: 'Button', text: 'Bold'
                }
            ],
            });
            toolbar.appendTo('#ej2Toolbar');
            let ExtendELe: HTMLElement = <HTMLElement>element;
            expect(ExtendELe.classList.contains('e-extended-toolbar')).toEqual(true);
        });
    });


    // HtmlAttributes property testing
    describe(' Html attributes property testing in items main property', () => {
        let toolbar: Toolbar;
        document.body.innerHTML = '';
        beforeEach((): void => {
            toolbar = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Toolbar' });
            setStyleAttribute(ele, { 'display': 'block', 'white-space': 'nowrap', 'position': 'relative' });
            ele.style.display = 'block';
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (toolbar) {
                toolbar.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Html attributes property giving as role', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                width: 30,
                overflowMode: "Popup",
                items: [{
                    type: 'Button', text: 'Underline', htmlAttributes: { 'role': 'Toolbar', 'aria-role': 'Toolbar', 'disabled': 'disable' },
                }],
            }); toolbar.appendTo('#ej2Toolbar');
            let ele: HTMLElement = <HTMLElement>element.getElementsByClassName('e-toolbar-item')[0];
            expect(ele.getAttribute('role')).toEqual('Toolbar');
            expect(ele.getAttribute('aria-role')).toEqual('Toolbar');
            expect(ele.getAttribute('disabled')).toEqual('disable');
        });
        it('Html attributes property giving as role', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                width: 30,
                overflowMode: "Popup",
                items: [{
                    type: 'Button', text: 'Underline', htmlAttributes: { 'role': 'Toolbar' },
                }],
            }); toolbar.appendTo('#ej2Toolbar');
            let ele: HTMLElement = <HTMLElement>element.getElementsByClassName('e-toolbar-item')[0];
            expect(ele.getAttribute('role')).toEqual('Toolbar');
        });
        it('Html attributes property giving as class', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                width: 30,
                overflowMode: "Popup",
                items: [{
                    type: 'Button', text: 'Underline', htmlAttributes: { 'class': "e-tool" },
                }],
            }); toolbar.appendTo('#ej2Toolbar');
            let ele: HTMLElement = <HTMLElement>element.getElementsByClassName('e-toolbar-item')[0];
            expect(ele.classList.contains('e-tool')).toEqual(true);
        });
        it('Html attributes property giving as style', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                width: 30,
                overflowMode: "Popup",
                items: [{
                    type: 'Button', text: 'Underline', htmlAttributes: { 'style': "color:red" },
                }],
            }); toolbar.appendTo('#ej2Toolbar');
            let ele: HTMLElement = <HTMLElement>element.getElementsByClassName('e-toolbar-item')[0];
            expect(ele.style.color).toEqual('red');
        });
    });


    // ToolTip Text property testing
    describe('Tooltip text property testing in items main property', () => {
        let toolbar: Toolbar;
        document.body.innerHTML = '';
        beforeEach((): void => {
            toolbar = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Toolbar' });
            setStyleAttribute(ele, { 'display': 'block', 'white-space': 'nowrap', 'position': 'relative' });
            ele.style.display = 'block';
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (toolbar) {
                toolbar.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Tooltip text given as string', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                width: 30,
                overflowMode: "Popup",
                items: [{
                    type: 'Button', text: 'Underline', tooltipText: 'Bold',
                }],
            }); toolbar.appendTo('#ej2Toolbar');
            let ele: HTMLElement = <HTMLElement>element.getElementsByClassName('e-toolbar-item')[0];
            expect(ele.getAttribute('title')).toEqual('Bold');
        });
        it('Tooltip text given as with special characters ', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                width: 30,
                overflowMode: "Popup",
                items: [{
                    type: 'Button', text: 'Underline', tooltipText: 'R&#233;f&eacute;rence fournisseur',
                }],
            }); toolbar.appendTo('#ej2Toolbar');
            let ele: HTMLElement = <HTMLElement>element.getElementsByClassName('e-toolbar-item')[0];
            expect(ele.getAttribute('title')).toEqual('Référence fournisseur');
        });
    });

    // Toolbar items width property testing
    describe('Width property testing in items main property', () => {
        let toolbar: Toolbar;
        document.body.innerHTML = '';
        beforeEach((): void => {
            toolbar = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Toolbar' });
            setStyleAttribute(ele, { 'display': 'block', 'white-space': 'nowrap', 'position': 'relative' });
            ele.style.display = 'block';
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (toolbar) {
                toolbar.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Width property testing', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                items: [{
                    type: 'Button', text: 'Underline', width: 50
                }],
            }); toolbar.appendTo('#ej2Toolbar');
            let ele: HTMLElement = <HTMLElement>element.querySelector('.e-toolbar-item');
            let innerEle: HTMLElement = <HTMLElement>ele.querySelector('button');
            expect(innerEle.style.width).toEqual('50px');
        });
    });

    //Toolbar items prefix property testing
    describe('Prefix Icon property testing in items main property', () => {
        let toolbar: Toolbar;
        document.body.innerHTML = '';
        beforeEach((): void => {
            toolbar = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Toolbar' });
            setStyleAttribute(ele, { 'display': 'block', 'white-space': 'nowrap', 'position': 'relative' });
            ele.style.display = 'block';
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (toolbar) {
                toolbar.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Prefix Icon property testing', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                items: [{
                    type: 'Button', text: 'Underline', prefixIcon: 'e-prefix-icon'
                }],
            }); toolbar.appendTo('#ej2Toolbar');
            let ele: HTMLElement = <HTMLElement>element.querySelector('.e-toolbar-item');
            let innerEle: HTMLElement = <HTMLElement>ele.querySelector('button');
            expect(innerEle.children.length).toEqual(2);
            expect((<HTMLElement>innerEle.children[0]).classList.contains('e-prefix-icon')).toEqual(true);
            expect((<HTMLElement>innerEle.children[1]).classList.contains('e-tbar-btn-text')).toEqual(true);
        });
    });

    //Id property testing in toolbar item
    describe('Id  property testing in items main property', () => {
        let toolbar: Toolbar;
        document.body.innerHTML = '';
        beforeEach((): void => {
            toolbar = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Toolbar' });
            setStyleAttribute(ele, { 'display': 'block', 'white-space': 'nowrap', 'position': 'relative' });
            ele.style.display = 'block';
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (toolbar) {
                toolbar.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Suffix Icon property testing', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                items: [{
                    type: 'Button', text: 'Underline', id: 'btnId', suffixIcon: 'e-suffix-icon'
                }],
            }); toolbar.appendTo('#ej2Toolbar');
            let ele: HTMLElement = <HTMLElement>element.querySelector('.e-toolbar-item');
            let innerEle: HTMLElement = <HTMLElement>ele.querySelector('button');
            expect(innerEle.id).toEqual('btnId');
        });
    });

    // Toolbar item Suffix icon testing
    describe('Suffix Icon property testing in items main property', () => {
        let toolbar: Toolbar;
        document.body.innerHTML = '';
        beforeEach((): void => {
            toolbar = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Toolbar' });
            setStyleAttribute(ele, { 'display': 'block', 'white-space': 'nowrap', 'position': 'relative' });
            ele.style.display = 'block';
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (toolbar) {
                toolbar.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Suffix Icon property testing', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                items: [{
                    type: 'Button', text: 'Underline', suffixIcon: 'e-suffix-icon'
                }],
            }); toolbar.appendTo('#ej2Toolbar');
            let ele: HTMLElement = <HTMLElement>element.querySelector('.e-toolbar-item');
            let innerEle: HTMLElement = <HTMLElement>ele.querySelector('button');
            expect(innerEle.children.length).toEqual(2);
            expect((<HTMLElement>innerEle.children[1]).classList.contains('e-suffix-icon')).toEqual(true);
            expect((<HTMLElement>innerEle.children[0]).classList.contains('e-tbar-btn-text')).toEqual(true);
        });
    });

    // Toolbar item Suffix icon and Prefix testing in both are gave
    describe('Prefix Icon and Suffix icon property testing in items main property', () => {
        let toolbar: Toolbar;
        document.body.innerHTML = '';
        beforeEach((): void => {
            toolbar = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Toolbar' });
            setStyleAttribute(ele, { 'display': 'block', 'white-space': 'nowrap', 'position': 'relative' });
            ele.style.display = 'block';
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (toolbar) {
                toolbar.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Prefix Icon property testing', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                items: [{
                    type: 'Button', text: 'Underline', prefixIcon: 'e-prefix-icon', suffixIcon: 'e-suffix-icon'
                }],
            }); toolbar.appendTo('#ej2Toolbar');
            let ele: HTMLElement = <HTMLElement>element.querySelector('.e-toolbar-item');
            let innerEle: HTMLElement = <HTMLElement>ele.querySelector('button');
            expect(innerEle.children.length).toEqual(2);
            expect((<HTMLElement>innerEle.children[0]).classList.contains('e-prefix-icon')).toEqual(true);
            expect((<HTMLElement>innerEle.children[1]).classList.contains('e-tbar-btn-text')).toEqual(true);
        });
        it('Prefix Icon property testing', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                items: [{
                    type: 'Button', prefixIcon: 'e-prefix-icon', suffixIcon: 'e-suffix-icon'
                }],
            }); toolbar.appendTo('#ej2Toolbar');
            let ele: HTMLElement = <HTMLElement>element.querySelector('.e-toolbar-item');
            let innerEle: HTMLElement = <HTMLElement>ele.querySelector('button');
            expect(innerEle.children.length).toEqual(1);
            expect((<HTMLElement>innerEle.children[0]).classList.contains('e-prefix-icon')).toEqual(true);
        });
    });
    describe('ShowtexOn property testing in items main property', () => {
        let toolbar: any;
        document.body.innerHTML = '';
        beforeEach((): void => {
            toolbar = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Toolbar' });
            setStyleAttribute(ele, { 'display': 'block', 'white-space': 'nowrap', 'position': 'relative' });
            ele.style.display = 'block';
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (toolbar) {
                toolbar.destroy();
            }
            document.body.innerHTML = '';
        });
        it('showtextOn given as string with Popup', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                width: 30,
                overflowMode: "Popup",
                items: [
                    { type: 'Button', text: 'Underline', showTextOn: 'Toolbar' },
                    { type: 'Button', text: 'Bold' },
                    { type: 'Button', text: 'Italic' }
                ],
            }); toolbar.appendTo('#ej2Toolbar');
            let ele: HTMLElement = <HTMLElement>element.getElementsByClassName('e-toolbar-item')[0];
            expect(toolbar.popObj.element.querySelectorAll('.e-toolbar-text').length > 0).toEqual(true);
        });
        it('showtextOn given as string', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                width: 170,
                overflowMode: "Popup",
                items: [
                    { type: 'Button', text: 'Underline', showTextOn: 'Toolbar' },
                    { type: 'Button', text: 'Bold' },
                    { type: 'Button', text: 'Italic' }
                ],
            }); toolbar.appendTo('#ej2Toolbar');
            let ele: HTMLElement = <HTMLElement>element.getElementsByClassName('e-toolbar-item')[0];
            expect(element.querySelectorAll('.e-toolbar-text').length > 0).toEqual(true);
        });
        it('showtextOn given as string with Popup', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                width: 30,
                overflowMode: "Popup",
                items: [
                    { type: 'Button', text: 'Underline', showTextOn: 'Overflow' },
                    { type: 'Button', text: 'Bold' },
                    { type: 'Button', text: 'Italic' }
                ],
            }); toolbar.appendTo('#ej2Toolbar');
            let ele: HTMLElement = <HTMLElement>element.getElementsByClassName('e-toolbar-item')[0];
            expect(toolbar.popObj.element.querySelectorAll('.e-popup-text').length > 0).toEqual(true);
        });
        it('showtextOn given as string', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                width: 170,
                overflowMode: "Popup",
                items: [
                    { type: 'Button', text: 'Underline', showTextOn: 'Overflow' },
                    { type: 'Button', text: 'Bold' },
                    { type: 'Button', text: 'Italic' }
                ],
            }); toolbar.appendTo('#ej2Toolbar');
            let ele: HTMLElement = <HTMLElement>element.getElementsByClassName('e-toolbar-item')[0];
            expect(element.querySelectorAll('.e-popup-text').length > 0).toEqual(true);
        });
        it('showtextOn given as string', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                width: 170,
                overflowMode: "Popup",
                items: [
                    { type: 'Button', text: 'Underline', showTextOn: 'Both' },
                    { type: 'Button', text: 'Bold' },
                    { type: 'Button', text: 'Italic' }
                ],
            }); toolbar.appendTo('#ej2Toolbar');
            let ele: HTMLElement = <HTMLElement>element.getElementsByClassName('e-toolbar-item')[0];
            expect(element.querySelectorAll('.e-toolbar-text').length > 0).toEqual(false);
            expect((<HTMLElement>element.querySelectorAll('.e-toolbar-item')[0]).classList.contains('e-toolbar-text')).toEqual(false);
        });
    });

    describe('Popuped element height testing based on toolbar height', () => {
        let toolbar: any;
        document.body.innerHTML = '';
        beforeEach((): void => {
            toolbar = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Toolbar' });
            setStyleAttribute(ele, { 'display': 'block', 'white-space': 'nowrap', 'position': 'relative' });
            ele.style.display = 'block';
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (toolbar) {
                toolbar.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Popuped element height testing', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                height: 40,
                width: 100,
                overflowMode: "Popup",
                items: [{
                    type: 'Button', text: 'New', id: 'btnId'
                }, {
                    type: 'Button', text: 'Underline'
                }],
            }); toolbar.appendTo('#ej2Toolbar');
            let popupEle: HTMLElement = toolbar.popObj.element.querySelector('.e-toolbar-item') as HTMLElement;
            expect(popupEle.style.height === '').toEqual(false);
        });
    });

    describe('Template property testing in items main property', () => {
        let toolbar: Toolbar;
        beforeEach((): void => {
            toolbar = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Toolbar' });
            setStyleAttribute(ele, { 'display': 'block', 'white-space': 'nowrap', 'position': 'relative' });
            ele.style.display = 'block';
            document.body.appendChild(ele);
            let button: HTMLElement = createElement('Button', { id: 'Template' });
            button.innerHTML = 'Template1'
            document.body.appendChild(button);
            new Button({}, '#Template');
        })
        afterEach((): void => {
            if (toolbar) {
                toolbar.destroy();
            }
            document.body.innerHTML = '';
        });
        function creatfunction(e: Event) {
            new Button({}, '#Template1');
        }
        it('Template text given as string', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                width: 30,
                overflowMode: "Popup",
                items: [{ template: '#Template', type: 'Button', text: 'Underline', tooltipText: 'Bold', }],
            }); toolbar.appendTo('#ej2Toolbar');
            expect(document.querySelectorAll('#Template').length).toBe(1);
            expect(element.querySelector('#Template').parentElement.classList.contains('e-toolbar-item')).toEqual(true);
            expect(toolbar.items[0].template === '#Template').toBe(true);
            toolbar.refresh();
            expect(element.querySelector('#Template').parentElement.classList.contains('e-toolbar-item')).toEqual(true);
            expect(element.querySelector('#Template').parentElement.classList.contains('e-template')).toEqual(true);
        });
        it('Template text given as string', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                width: 30,
                overflowMode: "Popup",
                items: [{ template: '#Template3', type: 'Button', text: 'Underline', tooltipText: 'Bold', }],
            }); toolbar.appendTo('#ej2Toolbar');
            expect(element.querySelectorAll('#Template3').length).toBe(0);
            expect(element.querySelector('.e-template').childElementCount).toBe(0);
        });
        it('Template text given as string as Element', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                width: 30,
                created: creatfunction,
                overflowMode: 'Popup',
                items: [{ template: "<button id='Template1'>", type: 'Button', text: 'Underline', tooltipText: 'Bold', }],
            }); toolbar.appendTo('#ej2Toolbar');
            expect(element.querySelector('#Template1').parentElement.classList.contains('e-toolbar-item')).toEqual(true);
        });
        it('Template given as Interface', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                created: creatfunction,
                overflowMode: "Popup",
                items: [{ template: new Button({}), type: 'Input', text: 'Underline', tooltipText: 'Bold', }],
            }); toolbar.appendTo('#ej2Toolbar');
            let template: HTMLElement = <HTMLElement>element.querySelector('.e-template input');
            expect(element.querySelector('.e-template').classList.contains('e-toolbar-item')).toEqual(true);
            expect(template.classList.contains('e-btn')).toEqual(true);
            expect(template.classList.contains('e-control')).toEqual(true);
            expect(template.id === 'input_ID').toEqual(false);
        });
        it('Template given as Interface with Type others', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                created: creatfunction,
                overflowMode: "Popup",
                items: [{ template: new Button({}), id: 'input_ID', type: 'Button', text: 'Underline', tooltipText: 'Bold', }],
            }); toolbar.appendTo('#ej2Toolbar');
            let template: NodeList = element.querySelectorAll('#input_ID')
            expect(template.length === 0).toEqual(true);
        });
        it('Template given as Interface with Id', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                created: creatfunction,
                overflowMode: "Popup",
                items: [{ template: new Button({}), id: 'input_ID', type: 'Input', text: 'Underline', tooltipText: 'Bold', }],
            }); toolbar.appendTo('#ej2Toolbar');
            let template: HTMLElement = <HTMLElement>element.querySelector('.e-template input');
            expect(element.querySelector('.e-template').classList.contains('e-toolbar-item')).toEqual(true);
            expect(template.classList.contains('e-btn')).toEqual(true);
            expect(template.classList.contains('e-control')).toEqual(true);
            expect(template.id === 'input_ID').toEqual(true);
        });
        it('Template given as Interface with EnumType', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                created: creatfunction,
                overflowMode: "Popup",
                items: [{ template: new Button({}), id: 'input_ID', type: 'Input', text: 'Underline', tooltipText: 'Bold', }],
            }); toolbar.appendTo('#ej2Toolbar');
            let template: HTMLElement = <HTMLElement>element.querySelector('.e-template input');
            expect(element.querySelector('.e-template').classList.contains('e-toolbar-item')).toEqual(true);
            expect(template.classList.contains('e-btn')).toEqual(true);
            expect(template.classList.contains('e-control')).toEqual(true);
            expect(template.id === 'input_ID').toEqual(true);
        });
    });

    describe('Overflow property testing in items Prob', () => {
        let toolbar: Toolbar;
        document.body.innerHTML = '';
        beforeEach((): void => {
            toolbar = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Toolbar' });
            setStyleAttribute(ele, { 'display`': 'block', 'white-space': 'nowrap', 'position': 'relative' });
            ele.style.display = 'block';
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (toolbar) {
                toolbar.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Overflow priority sets "Show" as string', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                width: 30,
                items: [{ type: 'Button', text: 'Underline', overflow: "Show", tooltipText: 'Bold' }],
            }); toolbar.appendTo('#ej2Toolbar');
            expect(element.querySelector('.e-toolbar-item').classList.contains('e-overflow-show')).toEqual(true);
        });
        it('Overflow priority sets "Show" as enum', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                width: 30,
                items: [{ type: 'Button', text: 'Underline', overflow: 'Show', tooltipText: 'Bold', }],
            }); toolbar.appendTo('#ej2Toolbar');
            expect(element.querySelector('.e-toolbar-item').classList.contains('e-overflow-show')).toEqual(true);
        });
        it('Overflow property popup control testing div element testing', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                width: 30,
                overflowMode: 'Popup',
                items: [{ type: 'Button', text: 'Underline', overflow: 'Show', tooltipText: 'Bold', }],
            }); toolbar.appendTo('#ej2Toolbar');
            expect(element.children.length == 3).toEqual(true);
            expect(element.querySelector('.e-popup').classList.contains('e-toolbar-pop')).toEqual(true);
            expect(isVisible(element.querySelector('.e-popup'))).toEqual(false);
        });
        it('Overflow property popup control testing div element testing', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                width: 30,
                overflowMode: 'Popup',
                items: [{
                    type: 'Button', text: 'Underline', overflow: 'Show', tooltipText: 'Bold'
                }],
            }); toolbar.appendTo('#ej2Toolbar');
            expect(element.children.length == 3).toEqual(true);
        });
        it('Overflow property popup control testing navigation icon testing', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                width: 30,
                overflowMode: 'Popup',
                items: [{
                    type: 'Button', text: 'Bold', overflow: 'Show', tooltipText: 'Bold',
                }],
            }); toolbar.appendTo('#ej2Toolbar');
            expect(element.children[1].childElementCount == 1).toEqual(true);
            expect(element.querySelector('#' + element.id + '_nav').classList.contains('e-' + element.id + '_nav')).toEqual(true);
            expect(element.querySelector('#' + element.id + '_nav').classList.contains('e-hor-nav')).toEqual(true);
            expect(element.querySelector('.e-hor-nav').querySelector('.e-icons').classList.contains('e-popup-down-icon')).toEqual(true);
        });

        it('Overflow property popup control testing popup opening and closing Testing', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                width: 30,
                overflowMode: 'Popup',
                items: [
                    { type: 'Button', text: 'Underline', overflow: 'Hide', tooltipText: 'Bold' },
                    { type: 'Button', text: 'Bold', overflow: 'Show', tooltipText: 'Bold' },
                    { type: 'Button', text: 'Italic', overflow: 'Show', tooltipText: 'Bold' }
                ],
            }); toolbar.appendTo('#ej2Toolbar');
            let pop_Nav: HTMLElement = document.getElementById(element.id + '_nav');
            let nav_icon: HTMLElement = pop_Nav.firstChild as HTMLElement;
            pop_Nav.click();
            let tool: any = toolbar;
            tool.popObj.show();
            expect(isVisible(element.querySelector('.e-popup'))).toEqual(true);
            expect(nav_icon.classList.contains('e-popup-up-icon')).toEqual(true);
            expect(isVisible(element.querySelector('.e-popup .e-toolbar-item'))).toEqual(true);
            expect(element.querySelectorAll('.e-popup .e-toolbar-item').length == 3).toEqual(true);
            expect(element.querySelectorAll('.e-popup .e-toolbar-item.e-toolbar-popup').length == 3).toEqual(true);
            document.getElementById(element.id + '_nav').click();
            tool.popObj.hide();
            expect(nav_icon.classList.contains('e-popup-down-icon')).toEqual(true);
            expect(isVisible(element.querySelector('.e-popup'))).toEqual(false);
        });
        it('Overflow property popup control testing popup position testing in dynamic open', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                width: 30,
                overflowMode: 'Popup',
                items: [
                    { type: 'Button', text: 'Underline', overflow: 'Hide', tooltipText: 'Bold' },
                    { type: 'Button', text: 'Bold', overflow: 'Show', tooltipText: 'Bold' },
                    { type: 'Button', text: 'Italic', overflow: 'Show', tooltipText: 'Bold' }
                ],
            }); toolbar.appendTo('#ej2Toolbar');
            let pop_Nav: HTMLElement = document.getElementById(element.id + '_nav');
            let nav_icon: HTMLElement = pop_Nav.firstChild as HTMLElement;
            let tool: any = toolbar;
            let popEle: HTMLElement =  <HTMLElement>element.querySelector('.e-popup');
            pop_Nav.click();
            tool.popObj.show();
            expect(isVisible(popEle)).toEqual(true);
            let initialPos: string = popEle.style.left;
            document.getElementById(element.id + '_nav').click();
            tool.popObj.hide();
            expect(isVisible(popEle)).toEqual(false);
            element.style.width = '60px';
            toolbar.refreshOverflow();
            pop_Nav.click();
            tool.popObj.show();
            expect(isVisible(popEle)).toEqual(true);
            expect(initialPos !==  popEle.style.left).toEqual(true);
            document.getElementById(element.id + '_nav').click();
            tool.popObj.hide();
            expect(isVisible(popEle)).toEqual(false);
            element.style.width = '30px';
            toolbar.refreshOverflow();
            pop_Nav.click();
            tool.popObj.show();
            expect(isVisible(popEle)).toEqual(true);
            expect(Math.floor(parseFloat(popEle.style.left)) + 'px' === initialPos).toEqual(true);
        });
        it('Overflow property popup control testing popup priority wise alignment testing', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                width: 30,
                overflowMode: 'Popup',
                items: [
                    { type: 'Button', text: 'Underline', overflow: 'Hide', tooltipText: 'Bold' },
                    { type: 'Button', text: 'Bold', overflow: 'Show', tooltipText: 'Bold' },
                    { type: 'Button', text: 'Italic', overflow: 'Show', tooltipText: 'Bold' }
                ],
            }); toolbar.appendTo('#ej2Toolbar');
            expect(element.querySelector('.e-popup .e-toolbar-item').classList.contains('e-overflow-show')).toEqual(true);
            expect((<Element>element.querySelectorAll('.e-popup .e-toolbar-item')[1]).classList.contains('e-overflow-show')).toEqual(true);
            expect((<Element>element.querySelectorAll('.e-popup .e-toolbar-item')[2]).classList.contains('e-overflow-show')).toEqual(false);
            expect(element.querySelectorAll('.e-popup .e-toolbar-item.e-overflow-show').length == 2).toEqual(true);
        });
        it('Overflow property popup control OverflowOption testing', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                width: 100,
                overflowMode: 'Popup',
                items: [
                    { type: 'Button', text: 'Underline', overflow: 'Hide', tooltipText: 'Bold' },
                    { type: 'Button', text: 'Bold', overflow: 'None', tooltipText: 'Bold' },
                    { type: 'Button', text: 'Italic', overflow: 'Show', tooltipText: 'Bold' }
                ],
            }); toolbar.appendTo('#ej2Toolbar');
            expect(element.querySelector('.e-popup').classList.contains('e-toolbar-pop')).toEqual(true);
            expect(element.querySelectorAll('.e-toolbar-items .e-toolbar-item').length == 1).toEqual(true);
            expect((<Element>element.querySelectorAll('.e-toolbar-items .e-toolbar-item')[0]).classList.contains('e-overflow-show')).toEqual(true);
            expect(element.querySelectorAll('.e-popup .e-toolbar-item').length == 2).toEqual(true);
            expect(element.querySelectorAll('.e-popup .e-toolbar-item button')[0].children[0].innerHTML).toEqual('Bold');
        });
        it('Overflow property popup control OverflowOption give Hide as string', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                width: 200,
                overflowMode: 'Popup',
                items: [
                    { type: 'Button', text: 'Underline', overflow: 'None', tooltipText: 'Bold' },
                    { type: 'Button', text: 'Bold', overflow: 'None', tooltipText: 'Bold' },
                    { type: 'Button', text: 'Italic', overflow: 'Show', tooltipText: 'Bold' }
                ],
            }); toolbar.appendTo('#ej2Toolbar');
            expect(element.querySelectorAll('.e-popup').length == 0).toEqual(true);
            expect(element.querySelectorAll('.e-toolbar-items .e-toolbar-item').length == 3).toEqual(true);
            expect((<Element>element.querySelectorAll('.e-toolbar-items .e-toolbar-item')[0]).classList.contains('e-overflow-show')).toEqual(false);
            expect((<Element>element.querySelectorAll('.e-toolbar-items .e-toolbar-item')[1]).classList.contains('e-overflow-show')).toEqual(false);
            expect((<Element>element.querySelectorAll('.e-toolbar-items .e-toolbar-item')[2]).classList.contains('e-overflow-show')).toEqual(true);
            expect(element.querySelectorAll('.e-popup .e-toolbar-item').length == 0).toEqual(true);
        });
        it('Overflow property popup control OverflowOption give Hide as string', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                width: 30,
                overflowMode: 'Popup',
                items: [
                    { type: 'Button', text: 'Underline', overflow: 'Hide', tooltipText: 'Bold' },
                    { type: 'Button', text: 'Bold', overflow: 'Hide', tooltipText: 'Bold' },
                    { type: 'Button', text: 'Italic', overflow: 'Show', tooltipText: 'Bold' }
                ],
            }); toolbar.appendTo('#ej2Toolbar');
        });
        it('Overflow property popup control OverflowOption With separator', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                width: 70,
                overflowMode: 'Popup',
                items: [
                    { type: 'Separator', text: 'Underline', overflow: 'Hide', tooltipText: 'Bold' },
                    { type: 'Button', text: 'Bold', overflow: 'Hide', tooltipText: 'Bold' },
                    { type: 'Button', text: 'Italic', overflow: 'Show', tooltipText: 'Bold' }
                ],
            }); toolbar.appendTo('#ej2Toolbar');
            expect(element.querySelectorAll('.e-popup .e-toolbar-item').length == 2).toEqual(true);
        });
        it('Overflow property popup control testing popup element refresh with increasing width', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                width: 30,
                overflowMode: 'Popup',
                items: [
                    { type: 'Separator', text: 'Underline', overflow: 'Hide', tooltipText: 'Bold' },
                    { type: 'Button', text: 'Bold', overflow: 'Hide', tooltipText: 'Bold' },
                    { type: 'Button', text: 'Italic', overflow: 'Show', tooltipText: 'Bold' }
                ],
            }); toolbar.appendTo('#ej2Toolbar');
            expect(element.querySelectorAll('.e-popup .e-toolbar-item').length == 2).toEqual(true);
            (<HTMLElement>element.querySelector('.e-toolbar-items')).classList.add('e-fix-width');
            toolbar.width = 80;
            toolbar.dataBind();
            expect(element.querySelectorAll('.e-popup .e-toolbar-item').length == 1).toEqual(true);
            expect(element.querySelector('.e-popup .e-toolbar-popup button').children[0].innerHTML).toEqual('Bold');
            toolbar.width = 500;
            toolbar.dataBind();
            expect(element.querySelectorAll('.e-popup .e-toolbar-item').length == 0).toEqual(true);
        });
        it('Overflow property popup control testing popup element refresh with decreasing width', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                width: 140,
                overflowMode: 'Popup',
                items: [
                    { type: 'Button', text: 'Underline', overflow: 'None', tooltipText: 'Bold' },
                    { type: 'Button', text: 'Bold', overflow: 'Show', tooltipText: 'Bold' },
                    { type: 'Button', text: 'Italic', overflow: 'None', tooltipText: 'Bold' }
                ],
            }); toolbar.appendTo('#ej2Toolbar');
            toolbar.width = 30;
            toolbar.dataBind();
            expect(element.querySelectorAll('.e-popup .e-toolbar-item').length == 3).toEqual(true);
            expect(element.querySelector('.e-popup .e-toolbar-popup button').children[0].innerHTML).toEqual('Bold');
            expect(element.querySelectorAll('.e-popup .e-toolbar-popup button')[1].children[0].innerHTML).toEqual('Underline');
            expect(element.querySelectorAll('.e-popup .e-toolbar-popup button')[2].children[0].innerHTML).toEqual('Italic');
            toolbar.width = 250;
            toolbar.dataBind();
        });
    });

    describe(' Text property in items toolbar testing', () => {
        let toolbar: Toolbar;
        document.body.innerHTML = '';
        beforeEach((): void => {
            toolbar = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Toolbar' });
            setStyleAttribute(ele, { 'display': 'block', 'white-space': 'nowrap', 'position': 'relative' });
            ele.style.display = 'block';
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (toolbar) {
                toolbar.destroy();
            }
            document.body.innerHTML = '';
        });
        it(' Text property testing', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                width: 30,
                items: [{ type: 'Button', text: 'Bold', htmlAttributes: { 'role': 'Toolbar' } }],
            }); toolbar.appendTo('#ej2Toolbar');
            let ele: HTMLElement = <HTMLElement>element.getElementsByClassName('e-toolbar-item')[0];
            expect(element.querySelector('.e-toolbar-item button').children[0].innerHTML).toEqual('Bold');
        });
    });

    describe(' Touch event (scroll and swipe) handler testing', () => {
        let toolbar: Toolbar;
        document.body.innerHTML = '';
        beforeEach((): void => {
            toolbar = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Toolbar' });
            setStyleAttribute(ele, { 'display': 'block', 'white-space': 'nowrap', 'position': 'relative' });
            ele.style.display = 'block';
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (toolbar) {
                toolbar.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Touch event scroll testing', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            let scroll: any;
            toolbar = new Toolbar({
                width: 50,
                overflowMode: 'Scrollable',
                items: [{
                    type: 'Button', text: 'Hii', htmlAttributes: { 'role': 'Toolbar' },
                }, {
                    type: 'Button', text: 'Unterline button',
                }],
            }); toolbar.appendTo('#ej2Toolbar');
            let scrollELe: HTMLElement = <HTMLElement>element.children[0];
            expect(scrollELe.classList.contains('e-hscroll')).toEqual(true);
            let TchEvent: TouchEventArgs;
            let event: ScrollEventArgs = { scrollDirection: 'Right', name: 'scroll', distanceX: 30, distanceY: 0, originalEvent: TchEvent, startEvents: TchEvent, startX: 30, startY: 0, velocity: 4 };
            scroll = new HScroll({}, element);
            scroll.touchHandler(event);
            event.scrollDirection = 'Left'; event.name = 'scroll'; event.distanceX = 30;
            scroll.touchHandler(event);
            event.name = 'swipe';
            scroll.touchHandler(event);
        });
    });

    describe('Resize testing', () => {
        let toolbar: Toolbar;
        document.body.innerHTML = '';
        beforeEach((): void => {
            toolbar = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Toolbar' });
            setStyleAttribute(ele, { 'display': 'block', 'white-space': 'nowrap', 'position': 'relative' });
            ele.style.display = 'block';
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (toolbar) {
                toolbar.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Resize testing', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                width: 170,
                overflowMode: 'Popup',
                items: [{
                    type: 'Button', text: 'New', htmlAttributes: { 'role': 'Toolbar' },
                },
                {
                    type: 'Button', text: 'Underline Button',
                }],
            }); toolbar.appendTo('#ej2Toolbar');
            element.style.width = '50px';
            toolbar.refreshOverflow();
            expect(element.classList.contains('e-toolpop')).toEqual(true);
            expect(element.querySelector('.e-toolbar-pop').childNodes.length).toEqual(2);
            expect(element.querySelectorAll('.e-toolbar-items .-toolbar-item').length == 0).toEqual(true);
        });
    });

    describe('Resize testing', () => {
        let toolbar: Toolbar;
        document.body.innerHTML = '';
        beforeEach((): void => {
            toolbar = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Toolbar' });
            setStyleAttribute(ele, { 'display': 'block', 'white-space': 'nowrap', 'position': 'relative' });
            ele.style.display = 'block';
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (toolbar) {
                toolbar.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Resize testing', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                width: 170,
                overflowMode: 'Popup',
                items: [{
                    type: 'Button', text: 'New', htmlAttributes: { 'role': 'Toolbar' }
                }, { type: 'Button', text: 'Underline button' }],
            });
            toolbar.appendTo('#ej2Toolbar');
        });
    });

    describe('Resize testing with Scrolling and Popup Mode', () => {
        let toolbar: any;
        document.body.innerHTML = '';
        beforeEach((): void => {
            toolbar = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Toolbar' });
            setStyleAttribute(ele, { 'display': 'block', 'white-space': 'nowrap', 'position': 'relative' });
            ele.style.display = 'block';
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (toolbar) {
                toolbar.destroy();
                toolbar.resize();
            }
            document.body.innerHTML = '';
        });
        it('Resize testing', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                width: 170,
                overflowMode: 'Scrollable',
                items: [
                    {
                        type: 'Button', text: 'Hii',
                    },
                    {
                        type: 'Button', text: 'New Chart Button',
                    },
                    {
                        type: 'Button', text: 'UnderlineBtn',
                    },
                    {
                        type: 'Button', text: 'ChartButton',
                    },
                    {
                        type: 'Button', text: 'Next_Prev_Btn',
                    }
                ],
            }); toolbar.appendTo('#ej2Toolbar');
            let popNav: NodeList = element.querySelectorAll('.e-scroll-nav');
            expect(popNav.length > 0).toEqual(true);
            element.style.width = '50px';
            toolbar.resize();
            expect(popNav.length > 0).toEqual(true);
        });
        it('Resize testing', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                width: 170,
                overflowMode: 'Popup',
                items: [
                    {
                        type: 'Button', text: 'Hii',
                    },
                    {
                        type: 'Button', text: 'New Chart Button',
                    },
                    { type: 'Separator' },
                    {
                        type: 'Button', text: 'UnderlineBtn',
                    },
                    {
                        type: 'Button', text: 'ChartButton',
                    },
                    { type: 'Separator' },
                    {
                        type: 'Button', text: 'Next_Prev_Btn',
                    }
                ],
            }); toolbar.appendTo('#ej2Toolbar');
            let popNav: NodeList = element.querySelectorAll('.e-hor-nav');
            expect(element.querySelectorAll('.e-toolbar-items .e-toolbar-item').length).toEqual(3);
            (<HTMLElement>element.querySelector('.e-toolbar-items')).classList.add('e-fix-width');
            element.style.width = '200px';
            toolbar.resize();
            expect(element.querySelectorAll('.e-toolbar-items .e-toolbar-item').length).toEqual(4);
            element.style.width = '250px';
            toolbar.resize();
            expect(element.querySelectorAll('.e-toolbar-items .e-toolbar-item').length).toEqual(6);
            expect((<HTMLElement>element.querySelectorAll('.e-toolbar-items .e-toolbar-item button')[1]).children[0].innerHTML).toEqual('New Chart Button');
            expect((<HTMLElement>element.querySelectorAll('.e-toolbar-items .e-toolbar-item')[2]).classList.contains('e-separator')).toEqual(true);
            expect((<HTMLElement>element.querySelectorAll('.e-toolbar-items .e-toolbar-item')[3]).querySelector('button').children[0].innerHTML).toEqual('UnderlineBtn');
        });

        it('Resize testing', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                width: 170,
                overflowMode: 'Popup',
                items: [
                    {
                        type: 'Button', text: 'Hii',
                    },
                    {
                        type: 'Button', text: 'New Chart Button',
                    },
                    { type: 'Separator' },
                    {
                        type: 'Button', text: 'UnderlineBtn',
                    },
                    {
                        type: 'Button', text: 'ChartButton',
                    },
                    { type: 'Separator' },
                    {
                        type: 'Button', text: 'Next_Prev_Btn',
                    }
                ],
            }); toolbar.appendTo('#ej2Toolbar');
            let popNav: NodeList = element.querySelectorAll('.e-hor-nav');
            expect(element.querySelectorAll('.e-toolbar-items .e-toolbar-item').length).toEqual(3);
            (<HTMLElement>element.querySelector('.e-toolbar-items')).classList.add('e-fix-width');
            expect(element.classList.contains('e-toolpop')).toEqual(true);
            element.style.width = '200px';
            toolbar.resize();
            expect(element.querySelectorAll('.e-toolbar-items .e-toolbar-item').length).toEqual(4);
            element.style.width = '250px';
            toolbar.resize();
            expect(element.querySelectorAll('.e-toolbar-items .e-toolbar-item').length).toEqual(6);
            element.style.width = 'auto';
            toolbar.resize();
            expect(element.querySelectorAll('.e-toolbar-items .e-toolbar-item').length).toEqual(7);
        });
        it('Resize testing', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                width: 170,
                overflowMode: 'Scrollable',
                items: [
                    {
                        type: 'Button', text: 'Hii',
                    },
                    {
                        type: 'Button', text: 'New Chart Button',
                    },
                    { type: 'Separator' },
                    {
                        type: 'Button', text: 'UnderlineBtn',
                    },
                    {
                        type: 'Button', text: 'ChartButton',
                    },
                    { type: 'Separator' },
                    {
                        type: 'Button', text: 'Next_Prev_Btn',
                    }
                ],
            }); toolbar.appendTo('#ej2Toolbar');
            let popNav: NodeList = element.querySelectorAll('.e-hor-nav');
            element.style.width = 'auto';
            toolbar.resize();
            expect(element.querySelectorAll('.e-toolbar-items .e-toolbar-item').length).toEqual(7);
        });

        it('Resize testing', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                width: 190,
                overflowMode: 'Popup',
                items: [
                    {
                        type: 'Button', text: 'Hii',
                    },
                    {
                        type: 'Button', text: 'New Chart Button',
                    }
                ],
            }); toolbar.appendTo('#ej2Toolbar');
            let popNav: NodeList = element.querySelectorAll('.e-hor-nav');
            expect(element.querySelectorAll('.e-toolbar-items .e-toolbar-item').length).toEqual(2);
            (<HTMLElement>element.querySelector('.e-toolbar-items')).classList.add('e-fix-width');
            element.style.width = '150px';
            toolbar.resize();
            expect(element.querySelectorAll('.e-toolbar-items .e-toolbar-item').length).toEqual(2);
        });
    });

    describe('Resize testing with Popup priority', () => {
        let toolbar: any;
        document.body.innerHTML = '';
        beforeEach((): void => {
            toolbar = undefined;
            document.body.innerHTML = '';
            let ele: HTMLElement = createElement('div', { id: 'ej2Toolbar' });
            setStyleAttribute(ele, { 'display': 'block', 'white-space': 'nowrap', 'position': 'relative' });
            ele.style.display = 'block';
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (toolbar) {
                toolbar.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Resize with Priority', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                width: 180,
                overflowMode: 'Popup',
                items: [
                    {
                        type: 'Button', text: 'Hii', overflow: 'Show',
                    },
                    {
                        type: 'Button', text: 'New Chart Button', overflow: 'Hide',
                    },
                    {
                        type: 'Button', text: 'UnderlineBtn', overflow: 'Show',
                    },
                    {
                        type: 'Button', text: 'ChartButton', overflow: 'Hide',
                    },
                    {
                        type: 'Button', text: 'Next_Prev_Btn', overflow: 'Show',
                    }
                ],
            }, '#ej2Toolbar');
            expect(element.querySelectorAll('.e-toolbar-items .e-toolbar-item').length).toEqual(2);
            element.style.width = '200px';
            toolbar.resize();
            expect(element.querySelectorAll('.e-toolbar-items .e-toolbar-item').length).toEqual(2);
            expect(element.querySelectorAll('.e-toolbar-items .e-toolbar-item .e-tbar-btn-text')[1].innerHTML).toEqual('UnderlineBtn');
            expect(element.querySelectorAll('.e-toolbar-pop .e-toolbar-item .e-tbar-btn-text')[0].innerHTML).toEqual('Next_Prev_Btn');
            expect(element.querySelectorAll('.e-toolbar-pop .e-toolbar-item .e-tbar-btn-text')[1].innerHTML).toEqual('New Chart Button');
            expect(element.querySelectorAll('.e-toolbar-pop .e-toolbar-item .e-tbar-btn-text')[2].innerHTML).toEqual('ChartButton');
            element.style.width = '330px';
            toolbar.resize();
            expect(element.querySelectorAll('.e-toolbar-items .e-toolbar-item .e-tbar-btn-text')[2].innerHTML).toEqual('Next_Prev_Btn');
            element.style.width = '440px';
            toolbar.resize();
            expect(element.querySelectorAll('.e-toolbar-items .e-toolbar-item .e-tbar-btn-text')[1].innerHTML).toEqual('New Chart Button');
            element.style.width = '550px';
            toolbar.resize();
            expect(element.querySelectorAll('.e-toolbar-items .e-toolbar-item .e-tbar-btn-text')[3].innerHTML).toEqual('ChartButton');
        });
        it('Resize with Priority Separator', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            let separator: HTMLElement;
            toolbar = new Toolbar({
                width: 200,
                overflowMode: 'Popup',
                items: [
                    {
                        type: 'Button', text: 'Hii', overflow: 'Show',
                    },
                    {
                        type: 'Separator'
                    },
                    {
                        type: 'Button', text: 'New Chart Button', overflow: 'Hide',
                    },
                    {
                        type: 'Button', text: 'UnderlineBtn', overflow: 'Show',
                    },
                    {
                        type: 'Separator'
                    },
                    {
                        type: 'Button', text: 'ChartButton', overflow: 'Hide',
                    },
                    {
                        type: 'Button', text: 'Next_Prev_Btn', overflow: 'Show',
                    }
                ],
            }, '#ej2Toolbar');
            let itemCollection: NodeList = element.querySelectorAll('.e-toolbar-items .e-toolbar-item');
            expect(itemCollection.length).toEqual(4);
            separator = itemCollection[3] as HTMLElement;
            expect(separator.classList.contains('e-separator')).toEqual(true);
            expect(separator.style.display).toEqual('none');
            element.style.width = '150px';
            toolbar.resize();
            itemCollection = element.querySelectorAll('.e-toolbar-items .e-toolbar-item');
            expect(itemCollection.length).toEqual(3);
            separator = itemCollection[1] as HTMLElement;
            expect(separator.classList.contains('e-separator')).toEqual(true);
            expect(separator.style.display).toEqual('none');
            element.style.width = '180px';
            toolbar.resize();
            itemCollection = element.querySelectorAll('.e-toolbar-items .e-toolbar-item');
            separator = itemCollection[1] as HTMLElement;
            separator = itemCollection[3] as HTMLElement;
        });
        it('Resize with Priority Separator with ignore Element', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            let separator: HTMLElement;
            toolbar = new Toolbar({
                width: 200,
                overflowMode: 'Popup',
                items: [
                    {
                        type: 'Button', text: 'Hii', overflow: 'Show',
                    },
                    {
                        type: 'Separator'
                    },
                    {
                        type: 'Button', text: 'New Chart Button', overflow: 'Hide',
                    },
                    {
                        type: 'Button', text: 'UnderlineBtn', overflow: 'Show',
                    },
                    {
                        type: 'Separator'
                    },
                    {
                        type: 'Button', text: 'ChartButton', overflow: 'Hide',
                    },
                    {
                        type: 'Button', text: 'Next_Prev_Btn', overflow: 'Show',
                    }
                ],
            }, '#ej2Toolbar');
            let ele: HTMLElement = createElement('div', { className: 'e-ignore' });
            let ele1: HTMLElement = createElement('div', { className: 'e-ignore' });
            let ele2: HTMLElement = createElement('div', { className: 'e-ignore' });
            element.children[0].appendChild(ele);
            element.children[0].insertBefore(ele1 , element.children[0].firstChild);
            element.children[0].insertBefore(ele2 , element.children[0].children[1]);
            let itemCollection: NodeList = element.querySelectorAll('.e-toolbar-items .e-toolbar-item');
            expect(itemCollection.length).toEqual(4);
            separator = itemCollection[3] as HTMLElement;
            expect(separator.classList.contains('e-separator')).toEqual(true);
            expect(separator.style.display).toEqual('none');
            element.style.width = '150px';
            toolbar.resize();
            expect(element.children[2].querySelectorAll('.e-ignore').length).toBe(0);
            itemCollection = element.querySelectorAll('.e-toolbar-items .e-toolbar-item');
            expect(itemCollection.length).toEqual(3);
            separator = itemCollection[1] as HTMLElement;
            expect(separator.classList.contains('e-separator')).toEqual(true);
            expect(separator.style.display).toEqual('none');
            element.style.width = '180px';
            toolbar.resize();
            expect(element.children[2].querySelectorAll('.e-ignore').length).toBe(0);
            itemCollection = element.querySelectorAll('.e-toolbar-items .e-toolbar-item');
            separator = itemCollection[1] as HTMLElement;
            separator = itemCollection[3] as HTMLElement;
        });
        it('Resize with popup without text item case', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            let separator: HTMLElement;
            toolbar = new Toolbar({
                width: 210,
                overflowMode: 'Popup',
                items: [
                    {
                        type: 'Button', text: 'Hii', overflow: 'Show',
                    },
                    {
                        type: 'Separator'
                    },
                    {
                        type: 'Button', text: 'New Chart Button', overflow: 'Hide',
                    },
                    {
                        type: 'Button', text: 'UnderlineBtn', overflow: 'Show',
                    },
                    {
                        type: 'Separator'
                    },
                    {
                        type: 'Button', text: 'ChartButton', overflow: 'Hide',
                    },
                    {
                        type: 'Button', prefixIcon: 'e-btn-icon', overflow: 'Show',
                    }
                ],
            }, '#ej2Toolbar');
            let itemCollection: NodeList = element.querySelectorAll('.e-toolbar-items .e-toolbar-item');
            expect(itemCollection.length).toEqual(5);
            element.style.width = '100px';
            toolbar.resize();
            itemCollection = element.querySelectorAll('.e-toolbar-items .e-toolbar-item');
            expect(toolbar.popObj.element.querySelectorAll('.e-tbtn-align').length > 0).toEqual(true);
            expect(itemCollection.length).toEqual(3);
            element.style.width = '250px';
            toolbar.resize();
            expect(toolbar.popObj.element.querySelectorAll('.e-tbtn-align').length > 0).toEqual(false);
        });


        it('Resize with Priority with ignore Element Testing', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                width: 180,
                overflowMode: 'Popup',
                items: [
                    {
                        type: 'Button', text: 'Hii', overflow: 'Show',
                    },
                    {
                        type: 'Button', text: 'New Chart Button', overflow: 'Hide',
                    },
                    {
                        type: 'Button', text: 'UnderlineBtn', overflow: 'Show',
                    },
                    {
                        type: 'Button', text: 'ChartButton', overflow: 'Hide',
                    },
                    {
                        type: 'Button', text: 'Next_Prev_Btn', overflow: 'Show',
                    }
                ],
            }, '#ej2Toolbar');
            let ele: HTMLElement = createElement('div', { className: 'e-ignore' });
            let ele1: HTMLElement = createElement('div', { className: 'e-ignore' });
            let ele2: HTMLElement = createElement('div', { className: 'e-ignore' });
            element.children[0].appendChild(ele);
            element.children[0].insertBefore(ele1 , element.children[0].firstChild);
            element.children[0].insertBefore(ele2 , element.children[0].children[1]);
            expect(element.querySelectorAll('.e-toolbar-items .e-toolbar-item').length).toEqual(2);
            element.style.width = '200px';
            toolbar.resize();
            expect(element.querySelectorAll('.e-toolbar-items .e-toolbar-item').length).toEqual(2);
            expect(element.querySelectorAll('.e-toolbar-items .e-toolbar-item .e-tbar-btn-text')[1].innerHTML).toEqual('UnderlineBtn');
            expect(element.querySelectorAll('.e-toolbar-pop .e-toolbar-item .e-tbar-btn-text')[0].innerHTML).toEqual('Next_Prev_Btn');
            expect(element.querySelectorAll('.e-toolbar-pop .e-toolbar-item .e-tbar-btn-text')[1].innerHTML).toEqual('New Chart Button');
            expect(element.querySelectorAll('.e-toolbar-pop .e-toolbar-item .e-tbar-btn-text')[2].innerHTML).toEqual('ChartButton');
            element.style.width = '330px';
            toolbar.resize();
            expect(element.querySelectorAll('.e-toolbar-items .e-toolbar-item .e-tbar-btn-text')[2].innerHTML).toEqual('Next_Prev_Btn');
            element.style.width = '440px';
            toolbar.resize();
            expect(element.querySelectorAll('.e-toolbar-items .e-toolbar-item .e-tbar-btn-text')[1].innerHTML).toEqual('New Chart Button');
            element.style.width = '550px';
            toolbar.resize();
            expect(element.querySelectorAll('.e-toolbar-items .e-toolbar-item .e-tbar-btn-text')[3].innerHTML).toEqual('ChartButton');
        });
        it('Resize with Priority with ignore Element Testing', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                width: 180,
                overflowMode: 'Popup',
                items: [
                    {
                        type: 'Button', text: 'Hii'
                    },
                    {
                        type: 'Button', text: 'New Chart Button'
                    },
                    {
                        type: 'Button', text: 'UnderlineBtn'
                    },
                    {
                        type: 'Button', text: 'ChartButton'
                    },
                    {
                        type: 'Button', text: 'Next_Prev_Btn'
                    }
                ],
            }, '#ej2Toolbar');
            let ele: HTMLElement = createElement('div', { className: 'e-ignore' });
            let ele1: HTMLElement = createElement('div', { className: 'e-ignore' });
            let ele2: HTMLElement = createElement('div', { className: 'e-ignore' });
            element.children[0].appendChild(ele);
            element.children[0].insertBefore(ele1 , element.children[0].firstChild);
            element.children[0].insertBefore(ele1 , element.children[0].children[1]);
            expect(element.querySelectorAll('.e-toolbar-items .e-toolbar-item').length).toEqual(1);
            element.style.width = '200px';
            toolbar.resize();
            expect(element.querySelectorAll('.e-toolbar-items .e-toolbar-item').length).toEqual(2);
            expect(element.querySelectorAll('.e-toolbar-items .e-toolbar-item .e-tbar-btn-text')[0].innerHTML).toEqual('Hii');
            expect(element.querySelectorAll('.e-toolbar-items .e-toolbar-item .e-tbar-btn-text')[1].innerHTML).toEqual('New Chart Button');
            expect(element.querySelectorAll('.e-toolbar-pop .e-toolbar-item .e-tbar-btn-text')[0].innerHTML).toEqual('UnderlineBtn');
            expect(element.querySelectorAll('.e-toolbar-pop .e-toolbar-item .e-tbar-btn-text')[1].innerHTML).toEqual('ChartButton');
            expect(element.querySelectorAll('.e-toolbar-pop .e-toolbar-item .e-tbar-btn-text')[2].innerHTML).toEqual('Next_Prev_Btn');
            element.style.width = '330px';
            toolbar.resize();
            expect(element.querySelectorAll('.e-toolbar-items .e-toolbar-item .e-tbar-btn-text')[2].innerHTML).toEqual('UnderlineBtn');
            element.style.width = '440px';
            toolbar.resize();
            expect(element.querySelectorAll('.e-toolbar-items .e-toolbar-item .e-tbar-btn-text')[1].innerHTML).toEqual('New Chart Button');
            element.style.width = '550px';
            toolbar.resize();
            expect(element.querySelectorAll('.e-toolbar-items .e-toolbar-item .e-tbar-btn-text')[3].innerHTML).toEqual('ChartButton');
        });
        it('Resize with Priority Separator ignore Element Testing', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            let separator: HTMLElement;
            toolbar = new Toolbar({
                width: 200,
                overflowMode: 'Popup',
                items: [
                    {
                        type: 'Button', text: 'Hii', overflow: 'Show',
                    },
                    {
                        type: 'Separator'
                    },
                    {
                        type: 'Button', text: 'New Chart Button', overflow: 'Hide',
                    },
                    {
                        type: 'Button', text: 'UnderlineBtn', overflow: 'Show',
                    },
                    {
                        type: 'Separator'
                    },
                    {
                        type: 'Button', text: 'ChartButton', overflow: 'Hide',
                    },
                    {
                        type: 'Button', text: 'Next_Prev_Btn', overflow: 'Show',
                    }
                ],
            }, '#ej2Toolbar');
            let ele: HTMLElement = createElement('div', { className: 'e-ignore' });
            let ele1: HTMLElement = createElement('div', { className: 'e-ignore' });
            let ele2: HTMLElement = createElement('div', { className: 'e-ignore' });
            element.children[0].appendChild(ele);
            element.children[0].insertBefore(ele1 , element.children[0].firstChild);
            let itemCollection: NodeList = element.querySelectorAll('.e-toolbar-items .e-toolbar-item');
            expect(itemCollection.length).toEqual(4);
            separator = itemCollection[3] as HTMLElement;
            expect(separator.classList.contains('e-separator')).toEqual(true);
            expect(separator.style.display).toEqual('none');
            element.style.width = '150px';
            toolbar.resize();
            itemCollection = element.querySelectorAll('.e-toolbar-items .e-toolbar-item');
            expect(itemCollection.length).toEqual(3);
            separator = itemCollection[1] as HTMLElement;
            expect(separator.classList.contains('e-separator')).toEqual(true);
            expect(separator.style.display).toEqual('none');
            element.style.width = '180px';
            toolbar.resize();
            itemCollection = element.querySelectorAll('.e-toolbar-items .e-toolbar-item');
            separator = itemCollection[1] as HTMLElement;
            separator = itemCollection[3] as HTMLElement;
        });
        it('Resize with popup without text item case ignore Element Testing', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            let separator: HTMLElement;
            toolbar = new Toolbar({
                width: 210,
                overflowMode: 'Popup',
                items: [
                    {
                        type: 'Button', text: 'Hii', overflow: 'Show',
                    },
                    {
                        type: 'Separator'
                    },
                    {
                        type: 'Button', text: 'New Chart Button', overflow: 'Hide',
                    },
                    {
                        type: 'Button', text: 'UnderlineBtn', overflow: 'Show',
                    },
                    {
                        type: 'Separator'
                    },
                    {
                        type: 'Button', text: 'ChartButton', overflow: 'Hide',
                    },
                    {
                        type: 'Button', prefixIcon: 'e-btn-icon', overflow: 'Show',
                    }
                ],
            }, '#ej2Toolbar');
            let ele: HTMLElement = createElement('div', { className: 'e-ignore' });
            let ele1: HTMLElement = createElement('div', { className: 'e-ignore' });
            let ele2: HTMLElement = createElement('div', { className: 'e-ignore' });
            element.children[0].appendChild(ele);
            element.children[0].insertBefore(ele1 , element.children[0].firstChild);
            let itemCollection: NodeList = element.querySelectorAll('.e-toolbar-items .e-toolbar-item');
            expect(itemCollection.length).toEqual(5);
            element.style.width = '100px';
            toolbar.resize();
            itemCollection = element.querySelectorAll('.e-toolbar-items .e-toolbar-item');
            expect(toolbar.popObj.element.querySelectorAll('.e-tbtn-align').length > 0).toEqual(true);
            expect(itemCollection.length).toEqual(3);
            element.style.width = '250px';
            toolbar.resize();
            expect(toolbar.popObj.element.querySelectorAll('.e-tbtn-align').length > 0).toEqual(false);
        });



        it('Resize with popup without text item with showtexton toolbar mode', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            let separator: HTMLElement;
            toolbar = new Toolbar({
                width: 210,
                overflowMode: 'Popup',
                items: [
                    {
                        type: 'Button', text: 'Hii', overflow: 'Show',
                    },
                    {
                        type: 'Separator'
                    },
                    {
                        type: 'Button', text: 'New Chart Button', showTextOn: 'Toolbar', overflow: 'Hide',
                    },
                    {
                        type: 'Button', text: 'Chart', showTextOn: 'Toolbar', overflow: 'Show',
                    },
                    {
                        type: 'Separator'
                    },
                    {
                        type: 'Button', text: 'ChartButton', overflow: 'Hide',
                    },
                    {
                        type: 'Button', prefixIcon: 'e-btn-icon', overflow: 'Show',
                    }
                ],
            }, '#ej2Toolbar');
            element.style.width = '70px';
            toolbar.resize();
            element.style.width = '170px';
            toolbar.resize();
        });
        it('Resize with popup without text and showtexton case', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            let separator: HTMLElement;
            toolbar = new Toolbar({
                overflowMode: 'Popup',
                items: [
                    {
                        type: 'Button', text: 'Hii', overflow: 'Show',
                    },
                    {
                        type: 'Separator'
                    },
                    {
                        type: 'Button', text: 'New Chart Button', showTextOn: 'Overflow', overflow: 'Hide',
                    }
                ],
            }, '#ej2Toolbar');
            toolbar.popupRefresh(); //for popup refresh check without popup navigation.
        });
        it('Resize with popup without text and showtexton case', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            let separator: HTMLElement;
            toolbar = new Toolbar({
                width: 220,
                overflowMode: 'Popup',
                items: [
                    {
                        type: 'Button', text: 'Hii', overflow: 'Show',
                    },
                    {
                        type: 'Separator'
                    },
                    {
                        type: 'Button', text: 'New Chart Button', showTextOn: 'Overflow', overflow: 'Hide',
                    },
                    {
                        type: 'Separator'
                    },
                    {
                        type: 'Button', text: 'UnderlineBtn', overflow: 'Show',
                    },
                    {
                        type: 'Separator'
                    },
                    {
                        type: 'Button', prefixIcon: 'e-btn-icon', text: 'ChartButton', overflow: 'Hide',
                    },
                    {
                        type: 'Separator'
                    },
                    {
                        type: 'Button', prefixIcon: 'e-btn-icon', overflow: 'Show',
                    }
                ],
            }, '#ej2Toolbar');
            let itemCollection: NodeList = element.querySelectorAll('.e-toolbar-items .e-toolbar-item');
            expect(itemCollection.length).toEqual(7);
            element.style.width = '200px';
            toolbar.resize();
            element.style.width = '180px';
            toolbar.resize();
            element.style.width = '80px';
            toolbar.resize();
            itemCollection = element.querySelectorAll('.e-toolbar-items .e-toolbar-item');
            expect(itemCollection.length).toEqual(5);
            element.style.width = '250px';
            toolbar.resize();
            element.style.width = '80px';
            toolbar.resize();
            toolbar.overflowMode = 'Scrollable';
            toolbar.dataBind();
            expect(element.querySelectorAll('.e-hscroll').length).toEqual(1);
            expect(element.querySelectorAll('.e-popup').length).toEqual(0);
            element.style.width = '250px';
            toolbar.enableRtl = true;
            toolbar.dataBind();
            toolbar.resize();
            expect(element.querySelectorAll('.e-toolbar-items .e-toolbar-item button')[0].children[0].innerHTML).toEqual('Hii');
            expect(element.querySelectorAll('.e-toolbar-items .e-toolbar-item button')[1].children[0].innerHTML).toEqual('New Chart Button');
            toolbar.overflowMode = 'Popup';
            toolbar.dataBind();
            expect(element.querySelectorAll('.e-toolbar-items .e-toolbar-item button')[0].children[0].innerHTML).toEqual('Hii');
            expect(element.querySelectorAll('.e-toolbar-items .e-toolbar-item button')[1].children[0].innerHTML).toEqual('UnderlineBtn');
            expect(element.querySelectorAll('.e-hscroll').length).toEqual(0);
            expect(element.querySelectorAll('.e-popup').length).toEqual(1);
            toolbar.popObj.show();
            element.style.width = '80px';
            toolbar.resize();
        });
        it('Resize with combined priority with multiple separator', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            let separator: HTMLElement;
            toolbar = new Toolbar({
                width: 200,
                overflowMode: 'Popup',
                items: [
                    {
                        type: 'Button', text: 'Hii',
                    },
                    {
                        type: 'Separator'
                    },
                    {
                        type: 'Button', text: 'New Chart Button',
                    },
                    {
                        type: 'Separator'
                    },
                    {
                        type: 'Button', text: 'UnderlineBtn', overflow: 'Show',
                    },
                    {
                        type: 'Separator'
                    },
                    {
                        type: 'Button', prefixIcon: 'e-btn-icon', text: 'ChartButton', overflow: 'Show',
                    },
                    {
                        type: 'Button', text: 'PictureButton', overflow: 'Show',
                    }
                ],
            }, '#ej2Toolbar');
            let itemCollection: NodeList = element.querySelectorAll('.e-toolbar-items .e-toolbar-item');
            element.style.width = '100px';
            toolbar.resize();
            itemCollection = element.querySelectorAll('.e-toolbar-items .e-toolbar-item');
            element.style.width = '250px';
            toolbar.resize();
        });
        it('Resize with combined priority with multiple separator', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            let separator: HTMLElement;
            toolbar = new Toolbar({
                width: 200,
                overflowMode: 'Popup',
                items: [
                    {
                        type: 'Button', text: 'Hii',
                    },
                    {
                        type: 'Separator'
                    },
                    {
                        type: 'Button', text: 'New Chart Button', overflow: 'Show',
                    },
                    {
                        type: 'Separator'
                    },
                    {
                        type: 'Button', text: 'UnderlineBtn', overflow: 'Show',
                    }
                ],
            }, '#ej2Toolbar');
            let itemCollection: NodeList = element.querySelectorAll('.e-toolbar-items .e-toolbar-item');
            element.style.width = '100px';
            toolbar.resize();
            itemCollection = element.querySelectorAll('.e-toolbar-items .e-toolbar-item');
            element.style.width = '250px';
            toolbar.resize();
        });
    });
    describe('Resize testing with Scrolling and Popup Mode', () => {
        let toolbar: any;
        document.body.innerHTML = '';
        beforeEach((): void => {
            toolbar = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Toolbar' });
            setStyleAttribute(ele, { 'display': 'block', 'white-space': 'nowrap', 'position': 'relative' });
            ele.style.display = 'block';
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (toolbar) {
                toolbar.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Resize testing', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                width: 170,
                overflowMode: 'Scrollable',
                items: [
                    {
                        type: 'Button', text: 'Hii',
                    },
                    {
                        type: 'Button', text: 'New Chart Button',
                    },
                    {
                        type: 'Button', text: 'UnderlineBtn',
                    },
                    {
                        type: 'Button', text: 'ChartButton',
                    },
                    {
                        type: 'Button', text: 'Next_Prev_Btn',
                    }
                ],
            }); toolbar.appendTo('#ej2Toolbar');
            let popNav: NodeList = element.querySelectorAll('.e-scroll-nav');
            expect(popNav.length > 0).toEqual(true);
            element.style.width = '50px';
            toolbar.resize();
            expect(popNav.length > 0).toEqual(true);
        });
        it('Resize testing', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                width: 170,
                overflowMode: 'Popup',
                items: [
                    {
                        type: 'Button', text: 'Hii',
                    },
                    {
                        type: 'Button', text: 'New Chart Button',
                    },
                    { type: 'Separator' },
                    {
                        type: 'Button', text: 'UnderlineBtn',
                    },
                    {
                        type: 'Button', text: 'ChartButton',
                    },
                    { type: 'Separator' },
                    {
                        type: 'Button', text: 'Next_Prev_Btn',
                    }
                ],
            }); toolbar.appendTo('#ej2Toolbar');
            let popNav: NodeList = element.querySelectorAll('.e-hor-nav');
            expect(element.querySelectorAll('.e-toolbar-items .e-toolbar-item').length).toEqual(3);
            (<HTMLElement>element.querySelector('.e-toolbar-items')).classList.add('e-fix-width');
            element.style.width = '200px';
            toolbar.resize();
            expect(element.querySelectorAll('.e-toolbar-items .e-toolbar-item').length).toEqual(4);
            element.style.width = '250px';
            toolbar.resize();
            expect(element.querySelectorAll('.e-toolbar-items .e-toolbar-item').length).toEqual(6);
            expect((<HTMLElement>element.querySelectorAll('.e-toolbar-items .e-toolbar-item button')[1]).children[0].innerHTML).toEqual('New Chart Button');
            expect((<HTMLElement>element.querySelectorAll('.e-toolbar-items .e-toolbar-item')[2]).classList.contains('e-separator')).toEqual(true);
            expect((<HTMLElement>element.querySelectorAll('.e-toolbar-items .e-toolbar-item')[3]).querySelector('button').children[0].innerHTML).toEqual('UnderlineBtn');
        });

        it('Resize testing', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                width: 170,
                overflowMode: 'Popup',
                items: [
                    {
                        type: 'Button', text: 'Hii',
                    },
                    {
                        type: 'Button', text: 'New Chart Button',
                    },
                    { type: 'Separator' },
                    {
                        type: 'Button', text: 'UnderlineBtn',
                    },
                    {
                        type: 'Button', text: 'ChartButton',
                    },
                    { type: 'Separator' },
                    {
                        type: 'Button', text: 'Next_Prev_Btn',
                    }
                ],
            }); toolbar.appendTo('#ej2Toolbar');
            let popNav: NodeList = element.querySelectorAll('.e-hor-nav');
            expect(element.querySelectorAll('.e-toolbar-items .e-toolbar-item').length).toEqual(3);
            (<HTMLElement>element.querySelector('.e-toolbar-items')).classList.add('e-fix-width');
            expect(element.classList.contains('e-toolpop')).toEqual(true);
            element.style.width = '200px';
            toolbar.resize();
            expect(element.querySelectorAll('.e-toolbar-items .e-toolbar-item').length).toEqual(4);
            element.style.width = '250px';
            toolbar.resize();
            expect(element.querySelectorAll('.e-toolbar-items .e-toolbar-item').length).toEqual(6);
            element.style.width = 'auto';
            toolbar.resize();
            expect(element.querySelectorAll('.e-toolbar-items .e-toolbar-item').length).toEqual(7);
        });
        it('Resize testing', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                width: 170,
                overflowMode: 'Scrollable',
                items: [
                    {
                        type: 'Button', text: 'Hii',
                    },
                    {
                        type: 'Button', text: 'New Chart Button',
                    },
                    { type: 'Separator' },
                    {
                        type: 'Button', text: 'UnderlineBtn',
                    },
                    {
                        type: 'Button', text: 'ChartButton',
                    },
                    { type: 'Separator' },
                    {
                        type: 'Button', text: 'Next_Prev_Btn',
                    }
                ],
            }); toolbar.appendTo('#ej2Toolbar');
            let popNav: NodeList = element.querySelectorAll('.e-hor-nav');
            element.style.width = 'auto';
            toolbar.resize();
            expect(element.querySelectorAll('.e-toolbar-items .e-toolbar-item').length).toEqual(7);
        });

        it('Resize testing', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                width: 190,
                overflowMode: 'Popup',
                items: [
                    {
                        type: 'Button', text: 'Hii',
                    },
                    {
                        type: 'Button', text: 'New Chart Button',
                    }
                ],
            }); toolbar.appendTo('#ej2Toolbar');
            let popNav: NodeList = element.querySelectorAll('.e-hor-nav');
            expect(element.querySelectorAll('.e-toolbar-items .e-toolbar-item').length).toEqual(2);
            (<HTMLElement>element.querySelector('.e-toolbar-items')).classList.add('e-fix-width');
            element.style.width = '150px';
            toolbar.resize();
            expect(element.querySelectorAll('.e-toolbar-items .e-toolbar-item').length).toEqual(2);
        });
    });

    describe('Resize testing with Popup priority', () => {
        let toolbar: any;
        document.body.innerHTML = '';
        beforeEach((): void => {
            toolbar = undefined;
            document.body.innerHTML = '';
            let ele: HTMLElement = createElement('div', { id: 'ej2Toolbar' });
            setStyleAttribute(ele, { 'display': 'block', 'white-space': 'nowrap', 'position': 'relative' });
            ele.style.display = 'block';
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (toolbar) {
                toolbar.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Resize with Priority', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                width: 180,
                overflowMode: 'Popup',
                items: [
                    {
                        type: 'Button', text: 'Hii', overflow: 'Show',
                    },
                    {
                        type: 'Button', text: 'New Chart Button', overflow: 'Hide',
                    },
                    {
                        type: 'Button', text: 'UnderlineBtn', overflow: 'Show',
                    },
                    {
                        type: 'Button', text: 'ChartButton', overflow: 'Hide',
                    },
                    {
                        type: 'Button', text: 'Next_Prev_Btn', overflow: 'Show',
                    }
                ],
            }, '#ej2Toolbar');
            expect(element.querySelectorAll('.e-toolbar-items .e-toolbar-item').length).toEqual(2);
            element.style.width = '200px';
            toolbar.resize();
            expect(element.querySelectorAll('.e-toolbar-items .e-toolbar-item').length).toEqual(2);
            expect(element.querySelectorAll('.e-toolbar-items .e-toolbar-item .e-tbar-btn-text')[1].innerHTML).toEqual('UnderlineBtn');
            expect(element.querySelectorAll('.e-toolbar-pop .e-toolbar-item .e-tbar-btn-text')[0].innerHTML).toEqual('Next_Prev_Btn');
            expect(element.querySelectorAll('.e-toolbar-pop .e-toolbar-item .e-tbar-btn-text')[1].innerHTML).toEqual('New Chart Button');
            expect(element.querySelectorAll('.e-toolbar-pop .e-toolbar-item .e-tbar-btn-text')[2].innerHTML).toEqual('ChartButton');
            element.style.width = '330px';
            toolbar.resize();
            expect(element.querySelectorAll('.e-toolbar-items .e-toolbar-item .e-tbar-btn-text')[2].innerHTML).toEqual('Next_Prev_Btn');
            element.style.width = '440px';
            toolbar.resize();
            expect(element.querySelectorAll('.e-toolbar-items .e-toolbar-item .e-tbar-btn-text')[1].innerHTML).toEqual('New Chart Button');
            element.style.width = '550px';
            toolbar.resize();
            expect(element.querySelectorAll('.e-toolbar-items .e-toolbar-item .e-tbar-btn-text')[3].innerHTML).toEqual('ChartButton');
        });
        it('Resize with Priority Separator', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            let separator: HTMLElement;
            toolbar = new Toolbar({
                width: 200,
                overflowMode: 'Popup',
                items: [
                    {
                        type: 'Button', text: 'Hii', overflow: 'Show',
                    },
                    {
                        type: 'Separator'
                    },
                    {
                        type: 'Button', text: 'New Chart Button', overflow: 'Hide',
                    },
                    {
                        type: 'Button', text: 'UnderlineBtn', overflow: 'Show',
                    },
                    {
                        type: 'Separator'
                    },
                    {
                        type: 'Button', text: 'ChartButton', overflow: 'Hide',
                    },
                    {
                        type: 'Button', text: 'Next_Prev_Btn', overflow: 'Show',
                    }
                ],
            }, '#ej2Toolbar');
            let itemCollection: NodeList = element.querySelectorAll('.e-toolbar-items .e-toolbar-item');
            expect(itemCollection.length).toEqual(4);
            separator = itemCollection[3] as HTMLElement;
            expect(separator.classList.contains('e-separator')).toEqual(true);
            expect(separator.style.display).toEqual('none');
            element.style.width = '150px';
            toolbar.resize();
            itemCollection = element.querySelectorAll('.e-toolbar-items .e-toolbar-item');
            expect(itemCollection.length).toEqual(3);
            separator = itemCollection[1] as HTMLElement;
            expect(separator.classList.contains('e-separator')).toEqual(true);
            expect(separator.style.display).toEqual('none');
            element.style.width = '180px';
            toolbar.resize();
            itemCollection = element.querySelectorAll('.e-toolbar-items .e-toolbar-item');
            separator = itemCollection[1] as HTMLElement;
            separator = itemCollection[3] as HTMLElement;
        });
        it('Resize with popup without text item case', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            let separator: HTMLElement;
            toolbar = new Toolbar({
                width: 210,
                overflowMode: 'Popup',
                items: [
                    {
                        type: 'Button', text: 'Hii', overflow: 'Show',
                    },
                    {
                        type: 'Separator'
                    },
                    {
                        type: 'Button', text: 'New Chart Button', overflow: 'Hide',
                    },
                    {
                        type: 'Button', text: 'UnderlineBtn', overflow: 'Show',
                    },
                    {
                        type: 'Separator'
                    },
                    {
                        type: 'Button', text: 'ChartButton', overflow: 'Hide',
                    },
                    {
                        type: 'Button', prefixIcon: 'e-btn-icon', overflow: 'Show',
                    }
                ],
            }, '#ej2Toolbar');
            let itemCollection: NodeList = element.querySelectorAll('.e-toolbar-items .e-toolbar-item');
            expect(itemCollection.length).toEqual(5);
            element.style.width = '100px';
            toolbar.resize();
            itemCollection = element.querySelectorAll('.e-toolbar-items .e-toolbar-item');
            expect(toolbar.popObj.element.querySelectorAll('.e-tbtn-align').length > 0).toEqual(true);
            expect(itemCollection.length).toEqual(3);
            element.style.width = '250px';
            toolbar.resize();
            expect(toolbar.popObj.element.querySelectorAll('.e-tbtn-align').length > 0).toEqual(false);
        });
        it('Resize with popup without text item with showtexton toolbar mode', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            let separator: HTMLElement;
            toolbar = new Toolbar({
                width: 210,
                overflowMode: 'Popup',
                items: [
                    {
                        type: 'Button', text: 'Hii', overflow: 'Show',
                    },
                    {
                        type: 'Separator'
                    },
                    {
                        type: 'Button', text: 'New Chart Button', showTextOn: 'Toolbar', overflow: 'Hide',
                    },
                    {
                        type: 'Button', text: 'Chart', showTextOn: 'Toolbar', overflow: 'Show',
                    },
                    {
                        type: 'Separator'
                    },
                    {
                        type: 'Button', text: 'ChartButton', overflow: 'Hide',
                    },
                    {
                        type: 'Button', prefixIcon: 'e-btn-icon', overflow: 'Show',
                    }
                ],
            }, '#ej2Toolbar');
            element.style.width = '70px';
            toolbar.resize();
            element.style.width = '170px';
            toolbar.resize();
        });
        it('Resize with popup without text and showtexton case', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            let separator: HTMLElement;
            toolbar = new Toolbar({
                overflowMode: 'Popup',
                items: [
                    {
                        type: 'Button', text: 'Hii', overflow: 'Show',
                    },
                    {
                        type: 'Separator'
                    },
                    {
                        type: 'Button', text: 'New Chart Button', showTextOn: 'Overflow', overflow: 'Hide',
                    }
                ],
            }, '#ej2Toolbar');
            toolbar.popupRefresh(); //for popup refresh check without popup navigation.
        });
        it('Resize with popup without text and showtexton case', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            let separator: HTMLElement;
            toolbar = new Toolbar({
                width: 220,
                overflowMode: 'Popup',
                items: [
                    {
                        type: 'Button', text: 'Hii', overflow: 'Show',
                    },
                    {
                        type: 'Separator'
                    },
                    {
                        type: 'Button', text: 'New Chart Button', showTextOn: 'Overflow', overflow: 'Hide',
                    },
                    {
                        type: 'Separator'
                    },
                    {
                        type: 'Button', text: 'UnderlineBtn', overflow: 'Show',
                    },
                    {
                        type: 'Separator'
                    },
                    {
                        type: 'Button', prefixIcon: 'e-btn-icon', text: 'ChartButton', overflow: 'Hide',
                    },
                    {
                        type: 'Separator'
                    },
                    {
                        type: 'Button', prefixIcon: 'e-btn-icon', overflow: 'Show',
                    }
                ],
            }, '#ej2Toolbar');
            let itemCollection: NodeList = element.querySelectorAll('.e-toolbar-items .e-toolbar-item');
            expect(itemCollection.length).toEqual(7);
            element.style.width = '200px';
            toolbar.resize();
            element.style.width = '180px';
            toolbar.resize();
            element.style.width = '80px';
            toolbar.resize();
            itemCollection = element.querySelectorAll('.e-toolbar-items .e-toolbar-item');
            expect(itemCollection.length).toEqual(5);
            element.style.width = '250px';
            toolbar.resize();
            element.style.width = '80px';
            toolbar.resize();
            toolbar.overflowMode = 'Scrollable';
            toolbar.dataBind();
            expect(element.querySelectorAll('.e-hscroll').length).toEqual(1);
            expect(element.querySelectorAll('.e-popup').length).toEqual(0);
            element.style.width = '250px';
            toolbar.enableRtl = true;
            toolbar.dataBind();
            toolbar.resize();
            expect(element.querySelectorAll('.e-toolbar-items .e-toolbar-item button')[0].children[0].innerHTML).toEqual('Hii');
            expect(element.querySelectorAll('.e-toolbar-items .e-toolbar-item button')[1].children[0].innerHTML).toEqual('New Chart Button');
            toolbar.overflowMode = 'Popup';
            toolbar.dataBind();
            expect(element.querySelectorAll('.e-toolbar-items .e-toolbar-item button')[0].children[0].innerHTML).toEqual('Hii');
            expect(element.querySelectorAll('.e-toolbar-items .e-toolbar-item button')[1].children[0].innerHTML).toEqual('UnderlineBtn');
            expect(element.querySelectorAll('.e-hscroll').length).toEqual(0);
            expect(element.querySelectorAll('.e-popup').length).toEqual(1);
            toolbar.popObj.show();
            element.style.width = '80px';
            toolbar.resize();
        });
        it('Resize with combined priority with multiple separator', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            let separator: HTMLElement;
            toolbar = new Toolbar({
                width: 200,
                overflowMode: 'Popup',
                items: [
                    {
                        type: 'Button', text: 'Hii',
                    },
                    {
                        type: 'Separator'
                    },
                    {
                        type: 'Button', text: 'New Chart Button',
                    },
                    {
                        type: 'Separator'
                    },
                    {
                        type: 'Button', text: 'UnderlineBtn', overflow: 'Show',
                    },
                    {
                        type: 'Separator'
                    },
                    {
                        type: 'Button', prefixIcon: 'e-btn-icon', text: 'ChartButton', overflow: 'Show',
                    },
                    {
                        type: 'Button', text: 'PictureButton', overflow: 'Show',
                    }
                ],
            }, '#ej2Toolbar');
            let itemCollection: NodeList = element.querySelectorAll('.e-toolbar-items .e-toolbar-item');
            element.style.width = '100px';
            toolbar.resize();
            itemCollection = element.querySelectorAll('.e-toolbar-items .e-toolbar-item');
            element.style.width = '250px';
            toolbar.resize();
        });
        it('Resize with combined priority with multiple separator', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            let separator: HTMLElement;
            toolbar = new Toolbar({
                width: 200,
                overflowMode: 'Popup',
                items: [
                    {
                        type: 'Button', text: 'Hii',
                    },
                    {
                        type: 'Separator'
                    },
                    {
                        type: 'Button', text: 'New Chart Button', overflow: 'Show',
                    },
                    {
                        type: 'Separator'
                    },
                    {
                        type: 'Button', text: 'UnderlineBtn', overflow: 'Show',
                    }
                ],
            }, '#ej2Toolbar');
            let itemCollection: NodeList = element.querySelectorAll('.e-toolbar-items .e-toolbar-item');
            element.style.width = '100px';
            toolbar.resize();
            itemCollection = element.querySelectorAll('.e-toolbar-items .e-toolbar-item');
            element.style.width = '250px';
            toolbar.resize();
        });
    });
    describe('Toolbar item alignment with RTL mode', () => {
        let toolbar: any;
        document.body.innerHTML = '';
        beforeEach((): void => {
            toolbar = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Toolbar' });
            setStyleAttribute(ele, { 'display': 'block', 'white-space': 'nowrap', 'position': 'relative' });
            ele.style.display = 'block';
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (toolbar) {
                toolbar.destroy();
            }
            document.body.removeAttribute('style');
            document.body.innerHTML = '';
        });
        it('Positioning with toolbar alignment item ', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                overflowMode: 'Popup',
                enableRtl: true,
                items: [
                    { type: 'Button', text: 'new', align: 'Left' },
                    { type: 'Button', text: 'Underline Button', align: 'Right' },
                    { type: 'Button', text: 'Underline Right', align: 'Right' }]
            });
            toolbar.appendTo('#ej2Toolbar');
            element.style.width = '250px';
            toolbar.resize();
            expect(toolbar.element.querySelector('.e-toolbar-right').style.left === "").toBe(false);
            expect(toolbar.element.querySelector('.e-toolbar-right').style.right === "").toBe(true);
            toolbar.enableRtl = false;
            toolbar.dataBind();
            expect(toolbar.element.querySelector('.e-toolbar-right').style.left === "").toBe(true);
            expect(toolbar.element.querySelector('.e-toolbar-right').style.right === "").toBe(false);
        });
    });
    describe(' Keyboard Interaction testing with alignment', () => {
        let toolbar: any;
        let keyEventArgs: any;
        document.body.innerHTML = '';
        beforeEach((): void => {
            toolbar = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Toolbar' });
            setStyleAttribute(ele, { 'display': 'block', 'white-space': 'nowrap', 'position': 'relative' });
            ele.style.display = 'block';
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (toolbar) {
                toolbar.destroy();
            }
            document.body.removeAttribute('style');
            document.body.innerHTML = '';
        });
        it('allowKeyboardInteraction Property testing ', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                items: [
                    { type: 'Button', text: 'new', align: 'Left' },
                    { type: 'Button', text: 'Underline Button', align: 'Right' },
                    { type: 'Button', text: 'Underline Right', align: 'Right' }]
            });
            toolbar.appendTo('#ej2Toolbar');
            toolbar.element.querySelector('.e-toolbar-item').children[0].focus();
            keyEventArgs = {
                preventDefault: function () { },
                action: 'moveRight',
                target: toolbar.element.querySelector('.e-toolbar-item').children[0],
            };
            expect(element.classList.contains('e-keyboard')).toEqual(true);
            toolbar.keyActionHandler(keyEventArgs);
            expect(document.activeElement.children[0].innerHTML).toEqual('Underline Button');
        });
    });


    describe(' Keyboard Interaction testing', () => {
        let toolbar: any;
        let keyEventArgs: any;
        document.body.innerHTML = '';
        beforeEach((): void => {
            toolbar = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Toolbar' });
            setStyleAttribute(ele, { 'display': 'block', 'white-space': 'nowrap', 'position': 'relative' });
            ele.style.display = 'block';
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (toolbar) {
                toolbar.destroy();
            }
            document.body.removeAttribute('style');
            document.body.innerHTML = '';
        });
        it('allowKeyboardInteraction Property testing ', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                width: 170,
                overflowMode: 'Popup',
                items: [
                    { type: 'Button', text: 'new', },
                    { type: 'Button', text: 'Underline Button', }]
            });
            toolbar.appendTo('#ej2Toolbar');
            keyEventArgs = {
                preventDefault: function () { },
                action: 'moveRight',
                target: toolbar.element.querySelector('.e-toolbar-item'),
            };
            expect(element.classList.contains('e-keyboard')).toEqual(true);
            toolbar.keyActionHandler(keyEventArgs);
        });
        it('Right arrow Key Testing select option', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                width: 170,
                overflowMode: 'Scrollable',
                items: [
                    { type: 'Button', text: 'new', htmlAttributes: { 'role': 'Toolbar' } },
                    { type: 'Button', text: 'Underline', htmlAttributes: { 'role': 'Toolbar' } },
                    { type: 'Button', text: 'Bold', htmlAttributes: { 'role': 'Toolbar' } },
                ]
            });
            toolbar.appendTo('#ej2Toolbar');
            keyEventArgs = {
                preventDefault: function () { },
                action: 'moveRight',
                target: toolbar.element.querySelectorAll('.e-toolbar-item')[0],
            };
            element.focus();
            toolbar.keyActionHandler(keyEventArgs);
            expect(document.activeElement.children[0].innerHTML).toEqual('Underline');
        });

        it('Right arrow Key  without Element testing', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                width: 170,
                overflowMode: 'Scrollable',
                items: [
                    { type: 'Button', text: 'New', htmlAttributes: { 'role': 'Toolbar' }, },
                    { type: 'Button', text: 'Underline', htmlAttributes: { 'role': 'Toolbar' }, },
                    { type: 'Button', text: 'Bold', htmlAttributes: { 'role': 'Toolbar' }, }
                ]
            });
            toolbar.appendTo('#ej2Toolbar');
            keyEventArgs = {
                preventDefault: function () { },
                action: 'moveRight',
                target: toolbar.element.querySelectorAll('.e-toolbar-item')[2],
            };
            element.focus();
            toolbar.keyActionHandler(keyEventArgs);
            expect(document.activeElement.children[0].innerHTML === 'Underline').toEqual(false);
            keyEventArgs = {
                preventDefault: function () { },
                action: 'moveRight',
                target: toolbar.element.querySelectorAll('.e-toolbar-item')[2],
            };
            element.focus();
            toolbar.keyActionHandler(keyEventArgs);
            expect(document.activeElement.children[0].innerHTML === 'Underline').toEqual(false);
        });
        it('Right arrow Key with toolbar element Focusing', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                width: 50,
                overflowMode: 'Scrollable',
                items: [
                    { type: 'Button', text: 'New', htmlAttributes: { 'role': 'Toolbar' }, },
                    { type: 'Button', text: 'Underline', htmlAttributes: { 'role': 'Toolbar' }, },
                    { type: 'Button', text: 'Bold', htmlAttributes: { 'role': 'Toolbar' }, }
                ]
            });
            toolbar.appendTo('#ej2Toolbar');
            keyEventArgs = {
                preventDefault: function () { },
                action: 'moveRight',
                target: toolbar.element,
            };
            toolbar.keyActionHandler(keyEventArgs);
            expect(document.activeElement.children[0].innerHTML === 'New').toEqual(true);
            keyEventArgs = {
                preventDefault: function () { },
                action: 'moveRight',
                target: toolbar.element.querySelectorAll('.e-scroll-nav')[0],
            };
            element.focus();
            toolbar.keyActionHandler(keyEventArgs);
            expect(document.activeElement.children[0].innerHTML === 'Bold').toEqual(false);
        });

        it('Right arrow Key  with inbetween Separator testing', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                width: 170,
                overflowMode: 'Scrollable',
                items: [
                    { type: 'Button', text: 'New', htmlAttributes: { 'role': 'Toolbar' }, },
                    { type: 'Separator' },
                    { type: 'Button', text: 'Underline', htmlAttributes: { 'role': 'Toolbar' }, },
                    { type: 'Button', text: 'Bold', htmlAttributes: { 'role': 'Toolbar' }, }]
            });
            toolbar.appendTo('#ej2Toolbar');
            keyEventArgs = {
                preventDefault: function () { },
                action: 'moveRight',
                target: toolbar.element.querySelectorAll('.e-toolbar-item')[0],
            };
            expect(element.classList.contains('e-keyboard')).toEqual(true);
            element.focus();
            toolbar.keyActionHandler(keyEventArgs);
            expect(document.activeElement.children[0].innerHTML).toEqual('Underline');
        });
        it('Right arrow Key  with multiple Separator testing', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                width: 170,
                overflowMode: 'Scrollable',
                items: [
                    { type: 'Button', text: 'New', htmlAttributes: { 'role': 'Toolbar' }, },
                    { type: 'Button', text: 'Underline', htmlAttributes: { 'role': 'Toolbar' }, },
                    { type: 'Separator' },
                    { type: 'Separator' },]
            });
            toolbar.appendTo('#ej2Toolbar');
            keyEventArgs = {
                preventDefault: function () { },
                action: 'moveRight',
                target: toolbar.element.querySelectorAll('.e-toolbar-item')[2],
            };
            element.focus();
            toolbar.keyActionHandler(keyEventArgs);
            expect(document.activeElement.classList.contains('e-toolbar')).toEqual(true);
        });
        it('Right arrow Key  with multiple Separator testing', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                width: 170,
                overflowMode: 'Scrollable',
                items: [
                    { type: 'Button', text: 'New', htmlAttributes: { 'role': 'Toolbar' }, },
                    { type: 'Button', text: 'Underline', htmlAttributes: { 'role': 'Toolbar' }, },
                    { type: 'Separator' },
                    { type: 'Separator' },
                    { type: 'Separator' },
                    { type: 'Button', text: 'Bold', htmlAttributes: { 'role': 'Toolbar' }, },]
            });
            toolbar.appendTo('#ej2Toolbar');
            keyEventArgs = {
                preventDefault: function () { },
                action: 'moveRight',
                target: toolbar.element.querySelectorAll('.e-toolbar-item')[2],
            };
            element.focus();
            toolbar.keyActionHandler(keyEventArgs);
            expect(document.activeElement.children[0].innerHTML).toEqual('Bold');
        });
        it('Left arrow Key  with multiple Separator testing', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                width: 170,
                overflowMode: 'Scrollable',
                items: [
                    { type: 'Button', text: 'New', htmlAttributes: { 'role': 'Toolbar' }, },
                    { type: 'Button', text: 'Underline', htmlAttributes: { 'role': 'Toolbar' }, },
                    { type: 'Separator' },
                    { type: 'Separator' },
                    { type: 'Separator' },
                    { type: 'Button', text: 'Bold', htmlAttributes: { 'role': 'Toolbar' }, },]
            });
            toolbar.appendTo('#ej2Toolbar');
            keyEventArgs = {
                preventDefault: function () { },
                action: 'moveLeft',
                target: toolbar.element.querySelectorAll('.e-toolbar-item')[5],
            };
            element.focus();
            toolbar.keyActionHandler(keyEventArgs);
            expect(document.activeElement.children[0].innerHTML).toEqual('Underline');
        });
        it('Left arrow Key  with multiple Separator testing', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                width: 170,
                overflowMode: 'Scrollable',
                items: [
                    { type: 'Separator' },
                    { type: 'Separator' },
                    { type: 'Separator' },
                    { type: 'Button', text: 'Bold', htmlAttributes: { 'role': 'Toolbar' }, },]
            });
            toolbar.appendTo('#ej2Toolbar');
            keyEventArgs = {
                preventDefault: function () { },
                action: 'moveLeft',
                target: toolbar.element.querySelectorAll('.e-toolbar-item')[3],
            };
            element.focus();
            toolbar.keyActionHandler(keyEventArgs);
            expect(document.activeElement.classList.contains('e-toolbar')).toEqual(true);
        });
        it('Tab Key testing', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                width: 170,
                overflowMode: 'Scrollable',
                items: [
                    { type: 'Button', text: 'New', htmlAttributes: { 'role': 'Toolbar' }, },
                    { type: 'Separator' },
                    { type: 'Button', text: 'Underline', htmlAttributes: { 'role': 'Toolbar' }, },
                    { type: 'Button', text: 'Bold', htmlAttributes: { 'role': 'Toolbar' }, }]
            });
            toolbar.appendTo('#ej2Toolbar');
            keyEventArgs = {
                preventDefault: function () { },
                action: 'tab',
                target: toolbar.element,
            };
            toolbar.keyActionHandler(keyEventArgs);
            expect(document.activeElement.children[0].innerHTML).toEqual('New');
        });
        it('Tab Key testing without scroll Navigations', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                width: 170,
                overflowMode: 'Scrollable',
                items: [
                    { type: 'Button', text: 'New', htmlAttributes: { 'role': 'Toolbar' }, },
                    { type: 'Separator' },
                    { type: 'Button', text: 'Underline', htmlAttributes: { 'role': 'Toolbar' }, },
                    { type: 'Button', text: 'Bold', htmlAttributes: { 'role': 'Toolbar' }, }]
            });
            toolbar.appendTo('#ej2Toolbar');
            keyEventArgs = {
                preventDefault: function () { },
                action: 'tab',
                target: toolbar.element.querySelector('.e-scroll-nav'),
            };
            element.focus();
            toolbar.keyActionHandler(keyEventArgs);
            expect(document.activeElement.children[0].innerHTML == 'New').toEqual(false);
        });
        it('Tab Key testing with disable item', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                width: 170,
                overflowMode: 'Scrollable',
                items: [
                    { type: 'Button', text: 'New', htmlAttributes: { 'role': 'Toolbar' }, },
                    { type: 'Separator' },
                    { type: 'Button', text: 'Underline', htmlAttributes: { 'role': 'Toolbar' }, },
                    { type: 'Button', text: 'Bold', htmlAttributes: { 'role': 'Toolbar' }, }]
            });
            toolbar.appendTo('#ej2Toolbar');
            toolbar.enableItems( toolbar.element.querySelector('.e-toolbar-item'), false);
            keyEventArgs = {
                preventDefault: function () { },
                action: 'tab',
                target: toolbar.element,
            };
            element.focus();
            toolbar.keyActionHandler(keyEventArgs);
            expect(document.activeElement.children[0].innerHTML == 'Underline').toEqual(true);
        });
        it('Tab Key testing with item Click', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            let ele: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'input1' });
            let ele1: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'input2' });
            ele.type = 'text'; ele1.type = 'text';
            element.parentElement.insertBefore(ele, element);
            element.parentElement.appendChild(ele1);
            toolbar = new Toolbar({
                width: 170,
                overflowMode: 'Scrollable',
                items: [
                    { type: 'Button', text: 'New', htmlAttributes: { 'role': 'Toolbar' }, },
                    { type: 'Separator' },
                    { type: 'Button', text: 'Underline', htmlAttributes: { 'role': 'Toolbar' }, },
                    { type: 'Button', text: 'Bold', htmlAttributes: { 'role': 'Toolbar' }, }]
            });
            toolbar.appendTo('#ej2Toolbar');
            keyEventArgs = {
                preventDefault: function () { },
                action: 'tab',
                target: toolbar.element,
            };
            toolbar.keyActionHandler(keyEventArgs);
            let el: HTMLElement = toolbar.element.querySelectorAll('.e-toolbar-item')[0].firstChild;
            expect(document.activeElement.children[0].innerHTML).toEqual('New');
            expect(el.getAttribute('tabindex') === null).toEqual(true);
            toolbar.element.querySelectorAll('.e-toolbar-item')[2].click();
            expect(el.getAttribute('tabindex')).toEqual('-1');
            expect(document.activeElement.children[0].innerHTML).toEqual('Underline');
            toolbar.element.querySelectorAll('.e-toolbar-item')[1].click();
            expect(el.getAttribute('tabindex')).toEqual('-1');
            expect(document.activeElement.children[0].innerHTML).toEqual('Underline');
            keyEventArgs = {
                preventDefault: function () { },
                action: 'tab',
                target: toolbar.element,
            };
            toolbar.keyActionHandler(keyEventArgs);
            expect(el.getAttribute('tabindex')).toEqual('-1');
            expect(document.activeElement.children[0].innerHTML).toEqual('Underline');
        });
        it('Tab key with Document testing', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            let btn: HTMLElement = createElement('button', { id: 'focusButton' });
            let btn1: HTMLElement = createElement('button', { id: 'focusButton1' });
            element.parentElement.insertBefore(btn, element)
            element.parentElement.insertBefore(btn1, element)
            toolbar = new Toolbar({
                width: 100,
                overflowMode: 'Popup',
                items: [
                    { type: 'Button', text: 'New', htmlAttributes: { 'role': 'Toolbar' }, },
                    { type: 'Separator' },
                    { type: 'Button', text: 'Underline', htmlAttributes: { 'role': 'Toolbar' }, },
                    { type: 'Button', text: 'Bold', htmlAttributes: { 'role': 'Toolbar' }, }]
            });
            toolbar.appendTo('#ej2Toolbar');
            keyEventArgs = {
                preventDefault: function () { },
                action: 'tab',
                target: toolbar.element.querySelector('.e-hor-nav'),
            };
            toolbar.keyActionHandler(keyEventArgs);
            expect(document.activeElement.tagName === 'BODY').toEqual(true);
        });
        it('Tab key with Document testing', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            let btn: HTMLElement = createElement('button', { id: 'focusButton' });
            let btn1: HTMLElement = createElement('button', { id: 'focusButton1' });
            element.parentElement.insertBefore(btn, element)
            element.parentElement.insertBefore(btn1, element)
            toolbar = new Toolbar({
                width: 100,
                overflowMode: 'Popup',
                items: [
                    { type: 'Button', text: 'New', htmlAttributes: { 'role': 'Toolbar' }, },
                    { type: 'Separator' },
                    { type: 'Button', text: 'Underline', htmlAttributes: { 'role': 'Toolbar' }, },
                    { type: 'Button', text: 'Bold', htmlAttributes: { 'role': 'Toolbar' }, }]
            });
            toolbar.appendTo('#ej2Toolbar');
            keyEventArgs = {
                preventDefault: function () { },
                action: 'tab',
                target: toolbar.element.querySelector('.e-toolbar-item'),
            };
            toolbar.keyActionHandler(keyEventArgs);
            toolbar.element.focus();
            expect(document.activeElement.classList.contains('e-toolbar')).toEqual(true);
        });
        it('Tab key without items testing', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            let btn: HTMLElement = createElement('button', { id: 'focusButton' });
            let btn1: HTMLElement = createElement('button', { id: 'focusButton1' });
            element.parentElement.insertBefore(btn, element);
            element.parentElement.insertBefore(btn1, element);

            toolbar = new Toolbar({
                width: 100,
                overflowMode: 'Popup',
            });
            toolbar.appendTo('#ej2Toolbar');
            keyEventArgs = {
                preventDefault: function () { },
                action: 'tab',
                target: toolbar.element,
            };
            toolbar.keyActionHandler(keyEventArgs);
            toolbar.element.focus();
            expect(document.activeElement.classList.contains('e-toolbar')).toEqual(true);
        });
        it('Move Left with Focusing Navigation testing without Separator', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            let btn: HTMLElement = createElement('button', { id: 'focusButton' });
            let btn1: HTMLElement = createElement('button', { id: 'focusButton1' });
            element.parentElement.insertBefore(btn, element)
            element.parentElement.insertBefore(btn1, element)
            toolbar = new Toolbar({
                width: 100,
                overflowMode: 'Popup',
                items: [
                    { type: 'Button', text: 'New', htmlAttributes: { 'role': 'Toolbar' }, },
                    { type: 'Button', text: 'Underline', htmlAttributes: { 'role': 'Toolbar' }, },
                    { type: 'Button', text: 'Bold', htmlAttributes: { 'role': 'Toolbar' }, }]
            });
            toolbar.appendTo('#ej2Toolbar');
            toolbar.element.querySelector('.e-hor-nav').focus();
            keyEventArgs = {
                preventDefault: function () { },
                action: 'moveLeft',
                target: toolbar.element.querySelector('.e-hor-nav'),
            };
            toolbar.keyActionHandler(keyEventArgs);
            expect(document.activeElement === toolbar.element.querySelector('.e-hor-nav')).toEqual(true);
        });
        it('Move Left with Focusing Navigation testing', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            let btn: HTMLElement = createElement('button', { id: 'focusButton' });
            let btn1: HTMLElement = createElement('button', { id: 'focusButton1' });
            element.parentElement.insertBefore(btn, element)
            element.parentElement.insertBefore(btn1, element)
            toolbar = new Toolbar({
                width: 100,
                overflowMode: 'Popup',
                items: [
                    { type: 'Separator' },
                    { type: 'Button', text: 'New', htmlAttributes: { 'role': 'Toolbar' }, },
                    { type: 'Separator' },
                    { type: 'Button', text: 'Underline', htmlAttributes: { 'role': 'Toolbar' }, },
                    { type: 'Button', text: 'Bold', htmlAttributes: { 'role': 'Toolbar' }, }]
            });
            toolbar.appendTo('#ej2Toolbar');
            toolbar.element.querySelector('.e-hor-nav').focus();
            keyEventArgs = {
                preventDefault: function () { },
                action: 'moveLeft',
                target: toolbar.element.querySelector('.e-hor-nav'),
            };
            toolbar.keyActionHandler(keyEventArgs);
            expect(document.activeElement === toolbar.element.querySelector('.e-hor-nav')).toEqual(true);
            toolbar.element.querySelectorAll('.e-toolbar-item')[1].firstChild.click()
            keyEventArgs = {
                preventDefault: function () { },
                action: 'moveRight',
                target: toolbar.element.querySelectorAll('.e-toolbar-item')[1],
            };
            toolbar.keyActionHandler(keyEventArgs);
            expect(document.activeElement === toolbar.element.querySelectorAll('.e-toolbar-item')[1].children[0]).toEqual(true);
        });
        it('Right arrow Key  with last element as Separator testing', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                width: 170,
                overflowMode: 'Scrollable',
                items: [
                    { type: 'Button', text: 'New', htmlAttributes: { 'role': 'Toolbar' }, },
                    { type: 'Button', text: 'Underline', htmlAttributes: { 'role': 'Toolbar' }, },
                    { type: 'Button', text: 'Bold', htmlAttributes: { 'role': 'Toolbar' }, },
                    { type: 'Separator' },
                ]
            });
            toolbar.appendTo('#ej2Toolbar');
            keyEventArgs = {
                preventDefault: function () { },
                action: 'moveRight',
                target: toolbar.element.querySelectorAll('.e-toolbar-item')[2],
            };
            element.focus();
            toolbar.keyActionHandler(keyEventArgs);
            expect(document.activeElement.children[0].innerHTML == 'Underline').toEqual(false);
        });

        it('Left arrow Key   testing', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                width: 170,
                overflowMode: 'Scrollable',
                items: [
                    {
                        type: 'Button', text: 'New', htmlAttributes: { 'role': 'Toolbar' },
                    },
                    {
                        type: 'Button', text: 'Underline', htmlAttributes: { 'role': 'Toolbar' },
                    },
                    {
                        type: 'Button', text: 'Bold', htmlAttributes: { 'role': 'Toolbar' },
                    }
                ]
            });
            toolbar.appendTo('#ej2Toolbar');
            keyEventArgs = {
                preventDefault: function () { },
                action: 'moveLeft',
                target: toolbar.element.querySelectorAll('.e-toolbar-item')[1],
            };
            element.focus();
            toolbar.keyActionHandler(keyEventArgs);
            expect(document.activeElement.children[0].innerHTML).toEqual('New');
        });

        it('Left arrow Key  without Element in left side testing', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({

                overflowMode: 'Popup',
                width: 100,
                items: [
                    {
                        type: 'Button', text: 'New', htmlAttributes: { 'role': 'Toolbar' },
                    },
                    {
                        type: 'Button', text: 'Underline', htmlAttributes: { 'role': 'Toolbar' },
                    },
                    {
                        type: 'Button', text: 'Bold', htmlAttributes: { 'role': 'Toolbar' },
                    }
                ]
            });
            toolbar.appendTo('#ej2Toolbar');
            keyEventArgs = {
                preventDefault: function () { },
                action: 'moveLeft',
                target: toolbar.element.querySelectorAll('.e-toolbar-item')[0],
            };
            element.focus();
            toolbar.keyActionHandler(keyEventArgs);
            expect(document.activeElement.children[0].innerHTML === 'New').toEqual(false);
            element.focus();
            toolbar.enableItems( toolbar.element.querySelector('.e-toolbar-item'), false);
            toolbar.enableItems( toolbar.element.querySelectorAll('.e-toolbar-item')[1], false);
            toolbar.element.querySelectorAll('.e-toolbar-item button')[2].focus();
            keyEventArgs = {
                preventDefault: function () { },
                action: 'moveLeft',
                target: document.activeElement,
            };
            expect(document.activeElement.children[0].innerHTML == 'Bold').toEqual(false);
        });

        it('Left arrow Key  with in between Separator  testing', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                overflowMode: 'Popup',
                items: [
                    {
                        type: 'Button', text: 'New', htmlAttributes: { 'role': 'Toolbar' },
                    },
                    { type: 'Separator' },
                    {
                        type: 'Button', text: 'Underline', htmlAttributes: { 'role': 'Toolbar' },
                    },
                    {
                        type: 'Button', text: 'Bold', htmlAttributes: { 'role': 'Toolbar' },
                    }
                ]
            });
            toolbar.appendTo('#ej2Toolbar');
            keyEventArgs = {
                preventDefault: function () { },
                action: 'moveLeft',
                target: toolbar.element.querySelectorAll('.e-toolbar-item')[2],
            };
            element.focus();
            toolbar.keyActionHandler(keyEventArgs);
            expect(document.activeElement.children[0].innerHTML).toEqual('New');
        });
        it('Left arrow Key  with Separator as first element  testing', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                overflowMode: 'Popup',
                items: [{ type: 'Separator' },
                {
                    type: 'Button', text: 'New', htmlAttributes: { 'role': 'Toolbar' },
                },
                {
                    type: 'Button', text: 'Underline', htmlAttributes: { 'role': 'Toolbar' },
                },
                {
                    type: 'Button', text: 'Bold', htmlAttributes: { 'role': 'Toolbar' },
                }
                ]
            });
            toolbar.appendTo('#ej2Toolbar');
            keyEventArgs = {
                preventDefault: function () { },
                action: 'moveLeft',
                target: toolbar.element.querySelectorAll('.e-toolbar-item')[1],
            };
            element.focus();
            toolbar.keyActionHandler(keyEventArgs);
            expect(document.activeElement.children[0].innerHTML === 'New').toEqual(false);
        });
        it('Up arrow Key   testing', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                width: 30,
                overflowMode: 'Popup',
                items: [
                    { type: 'Button', text: 'New', htmlAttributes: { 'role': 'Toolbar' } },
                    { type: 'Button', text: 'Underline', htmlAttributes: { 'role': 'Toolbar' } },
                    {
                        type: 'Button', text: 'Bold', htmlAttributes: { 'role': 'Toolbar' }
                    }
                ]
            });
            toolbar.appendTo('#ej2Toolbar');
            keyEventArgs = {
                preventDefault: function () { },
                action: 'moveUp',
                target: toolbar.element.querySelectorAll('.e-toolbar-item')[1],
            };
            toolbar.popObj.show();
            toolbar.keyActionHandler(keyEventArgs);
            expect(document.activeElement.children[0].innerHTML).toEqual('New');
            keyEventArgs = {
                preventDefault: function () { },
                action: 'moveUp',
                target: toolbar.element.querySelectorAll('.e-toolbar-item')[0],
            };
            toolbar.popObj.show();
            toolbar.keyActionHandler(keyEventArgs);
            expect(document.activeElement === toolbar.element.querySelectorAll('.e-toolbar-item')[0].firstChild ).toEqual(true);
        });
        it('Home and End arrow Key testing in Scrollable', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                items: [
                    { type: 'Button', text: 'New', htmlAttributes: { 'role': 'Toolbar' } },
                    { type: 'Button', text: 'Underline', htmlAttributes: { 'role': 'Toolbar' } },
                    {
                        type: 'Button', text: 'Bold', htmlAttributes: { 'role': 'Toolbar' }
                    }
                ]
            });
            toolbar.appendTo('#ej2Toolbar');
            keyEventArgs = {
                preventDefault: function () { },
                action: 'home',
                target: toolbar.element.querySelectorAll('.e-toolbar-item')[1],
            };
            toolbar.keyActionHandler(keyEventArgs);
            expect(document.activeElement.children[0].innerHTML).toEqual('New');
            keyEventArgs = {
                preventDefault: function () { },
                action: 'end',
                target: toolbar.element,
            };
            toolbar.keyActionHandler(keyEventArgs);
            expect(document.activeElement.children[0].innerHTML).toEqual('Bold');
            keyEventArgs = {
                preventDefault: function () { },
                action: 'home',
                target: toolbar.element.querySelectorAll('.e-toolbar-item')[1],
            };
            toolbar.keyActionHandler(keyEventArgs);
            expect(document.activeElement.children[0].innerHTML).toEqual('New');
            keyEventArgs = {
                preventDefault: function () { },
                action: 'end',
                target: toolbar.element,
            };
            toolbar.keyActionHandler(keyEventArgs);
            expect(document.activeElement.children[0].innerHTML).toEqual('Bold');
        });
        it('Home and End Key testig in Popup Mode', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                width: 30,
                overflowMode: 'Popup',
                items: [
                    {
                        type: 'Button', text: 'New', htmlAttributes: { 'role': 'Toolbar' },
                    },
                    {
                        type: 'Button', text: 'Underline', htmlAttributes: { 'role': 'Toolbar' },
                    },
                    {
                        type: 'Button', text: 'Bold', htmlAttributes: { 'role': 'Toolbar' },
                    }
                ]
            });
            toolbar.appendTo('#ej2Toolbar');
            keyEventArgs = {
                preventDefault: function () { },
                action: 'home',
                target: toolbar.popObj.element.querySelectorAll('.e-toolbar-item')[1],
            };
            toolbar.keyActionHandler(keyEventArgs);
            expect(document.activeElement.children[0].innerHTML == 'New').toEqual(false);
            toolbar.popObj.show();
            toolbar.keyActionHandler(keyEventArgs);
            expect(document.activeElement.children[0].innerHTML == 'New').toEqual(true);
            toolbar.popObj.hide();
            keyEventArgs = {
                preventDefault: function () { },
                action: 'end',
                target: toolbar.popObj.element.querySelectorAll('.e-toolbar-item')[1],
            };
            toolbar.keyActionHandler(keyEventArgs);
            expect(document.activeElement.children[0].innerHTML == 'Bold').toEqual(false);
            toolbar.popObj.show();
            toolbar.keyActionHandler(keyEventArgs);
            expect(document.activeElement.children[0].innerHTML == 'Bold').toEqual(true);
        });
        it('Home and End key testing', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                width: 30,
                overflowMode: 'Scrollable',
                items: [
                    {
                        type: 'Button', text: 'New', htmlAttributes: { 'role': 'Toolbar' },
                    },
                    {
                        type: 'Button', text: 'Underline', htmlAttributes: { 'role': 'Toolbar' },
                    },
                    {
                        type: 'Button', text: 'Bold', htmlAttributes: { 'role': 'Toolbar' },
                    }
                ]
            });
            toolbar.appendTo('#ej2Toolbar');
            keyEventArgs = {
                preventDefault: function () { },
                action: 'home',
                target: toolbar.element.querySelector('.e-scroll-nav'),
            };
            toolbar.keyActionHandler(keyEventArgs);
            expect(document.activeElement.children[0].innerHTML == 'New').toEqual(false);
        });
        it('Up arrow Key  without Popup  testing', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                width: 170,
                overflowMode: 'Scrollable',
                items: [
                    {
                        type: 'Button', text: 'New', htmlAttributes: { 'role': 'Toolbar' },
                    },
                    {
                        type: 'Button', text: 'Underline', htmlAttributes: { 'role': 'Toolbar' },
                    },
                    {
                        type: 'Button', text: 'Bold', htmlAttributes: { 'role': 'Toolbar' },
                    }
                ]
            });
            toolbar.appendTo('#ej2Toolbar');
            keyEventArgs = {
                preventDefault: function () { },
                action: 'moveUp',
                target: toolbar.element.querySelectorAll('.e-toolbar-item')[1],
            };
            toolbar.keyActionHandler(keyEventArgs);
            expect(document.activeElement.children[0].innerHTML == 'New').toEqual(false);
        });
        it('Down arrow Key    testing', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                width: 30,
                overflowMode: 'Popup',
                items: [
                    {
                        type: 'Button', text: 'New', htmlAttributes: { 'role': 'Toolbar' },
                    },
                    {
                        type: 'Button', text: 'Underline', htmlAttributes: { 'role': 'Toolbar' },
                    },
                    {
                        type: 'Button', text: 'Bold', htmlAttributes: { 'role': 'Toolbar' },
                    }
                ]
            });
            toolbar.appendTo('#ej2Toolbar');
            keyEventArgs = {
                preventDefault: function () { },
                action: 'moveDown',
                target: toolbar.element.querySelectorAll('.e-toolbar-item')[1],
            };
            toolbar.popObj.show();
            toolbar.keyActionHandler(keyEventArgs);
            expect(document.activeElement.children[0].innerHTML).toEqual('Bold');
            keyEventArgs = {
                preventDefault: function () { },
                action: 'moveDown',
                target: toolbar.element.querySelector('.e-hor-nav'),
            };
            toolbar.popObj.show();
            toolbar.keyActionHandler(keyEventArgs);
            expect(document.activeElement.children[0].innerHTML).toEqual('New');
            keyEventArgs = {
                preventDefault: function () { },
                action: 'popupOpen',
                target: toolbar.element.querySelectorAll('.e-toolbar-item')[1],
            };
            document.body.style.height = '1500px';
            let scrollVal: Number = window.scrollY;
            let e: any = new KeyboardEvent("keydown", {bubbles : true, cancelable : true, key : '40', shiftKey : true});
            Object.defineProperty(e, "keyCode", {"value" : 40});
            element.dispatchEvent(e);
            expect(scrollVal === window.scrollY).toBe(true);
            toolbar.popObj.show();
            expect(isVisible(toolbar.popObj.element)).toBe(true);
            element.dispatchEvent(e);
            expect(scrollVal === window.scrollY).toBe(true);
            e = new KeyboardEvent("keydown", {bubbles : true, cancelable : true, key : '40', shiftKey : true});
            Object.defineProperty(e, "keyCode", {"value" : 38});
            element.dispatchEvent(e);
            e = new KeyboardEvent("keydown", {bubbles : true, cancelable : true, key : '40', shiftKey : true});
            Object.defineProperty(e, "keyCode", {"value" : 37});
            element.dispatchEvent(e);
            expect(scrollVal === window.scrollY).toBe(true);
            toolbar.keyActionHandler(keyEventArgs);
        });

        it('Down arrow Key  without Popup  testing', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                width: 170,
                overflowMode: 'Scrollable',
                items: [
                    {
                        type: 'Button', text: 'New', htmlAttributes: { 'role': 'Toolbar' },
                    },
                    {
                        type: 'Button', text: 'Underline', htmlAttributes: { 'role': 'Toolbar' },
                    },
                    {
                        type: 'Button', text: 'Bold', htmlAttributes: { 'role': 'Toolbar' },
                    }
                ]
            });
            toolbar.appendTo('#ej2Toolbar');
            keyEventArgs = {
                preventDefault: function () { },
                action: 'moveDown',
                target: toolbar.element.querySelectorAll('.e-toolbar-item')[1],
            };
            toolbar.element.focus();
            toolbar.keyActionHandler(keyEventArgs);
            expect(document.activeElement.children[0].innerHTML === 'Bold').toEqual(false);
        });
    });

    describe(' Public methods add items Testing', () => {
        let toolbar: Toolbar;
        document.body.innerHTML = '';
        beforeEach((): void => {
            toolbar = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Toolbar' });
            setStyleAttribute(ele, { 'display': 'block', 'white-space': 'nowrap', 'position': 'relative' });
            ele.style.display = 'block';
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (toolbar) {
                toolbar.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Empty items with addItems method testing', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                width: 250,
                items: [],
            }); toolbar.appendTo('#ej2Toolbar');
            expect(toolbar.items.length).toEqual(0);
            expect(toolbar.element.querySelectorAll('.e-toolbar-items').length).toEqual(0);
            expect(toolbar.element.querySelectorAll('.e-toolbar-item').length).toEqual(0);
            toolbar.addItems([
                { type: 'Button', text: 'Underline1' },
                { type: 'Button', text: 'Bold1' }
            ], 2);
            expect(toolbar.items.length).toEqual(2);
            expect(toolbar.element.querySelectorAll('.e-toolbar-items').length).toEqual(1);
            expect(toolbar.element.querySelectorAll('.e-toolbar-item').length).toEqual(2);
            expect(toolbar.element.querySelectorAll('.e-toolbar-item button').length).toEqual(2);
            expect(toolbar.element.querySelectorAll('.e-toolbar-item button')[0].children[0].innerHTML).toEqual('Underline1');
            expect(toolbar.element.querySelectorAll('.e-toolbar-item button')[1].children[0].innerHTML).toEqual('Bold1');
        });
        it('addItem method Testing', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                width: 250,
                overflowMode: 'Popup',
                items: [
                    {
                        type: 'Button', text: 'Hii',
                    },
                    {
                        type: 'Button', text: 'Unterline',
                    },
                    {
                        type: 'Button', text: 'Bold',
                    }
                ],
            }); toolbar.appendTo('#ej2Toolbar');
            expect(toolbar.items.length).toEqual(3);
            expect(toolbar.element.querySelectorAll('.e-toolbar-item button')[2].children[0].innerHTML).toEqual('Bold');
            toolbar.addItems([
                { type: 'Button', text: 'Underline1' }, { type: 'Button', text: 'Bold1' }
            ], 2);
            expect(toolbar.items.length).toEqual(5);
            expect(toolbar.element.querySelectorAll('.e-toolbar-item button')[2].children[0].innerHTML).toEqual('Underline1');
            expect(toolbar.element.querySelectorAll('.e-toolbar-item button')[3].children[0].innerHTML).toEqual('Bold1');
            toolbar.addItems([
                { type: 'Button', text: 'Underline1' }, { type: 'Button', text: 'Bold1' }
            ], 7);
            expect(toolbar.items.length === 7).toEqual(false);
            toolbar.width = 'auto';
            toolbar.dataBind();
            expect(toolbar.element.querySelector('.e-toolbar-items').childElementCount).toBe(5);
            toolbar.addItems([
                { type: 'Button', text: 'Underline6', align: 'Center' }
            ], 1);
            expect(toolbar.items.length).toBe(6);
            expect(toolbar.element.querySelector('.e-toolbar-items').childElementCount).toBe(3);
            let leftItem: any = element.querySelector('.e-toolbar-items .e-toolbar-left');
            let centerItem: any = element.querySelector('.e-toolbar-items .e-toolbar-center');
            let rightItem: any = element.querySelector('.e-toolbar-items .e-toolbar-right');
            expect(centerItem.childElementCount).toBe(1);
            expect(leftItem.childElementCount).toBe(5);
        });
        it('addItem method without passing index', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                width: 250,
                overflowMode: 'Popup',
                items: [
                    {
                        type: 'Button', text: 'Hii',
                    },
                    {
                        type: 'Button', text: 'Unterline',
                    },
                    {
                        type: 'Button', text: 'Bold',
                    }
                ],
            }); toolbar.appendTo('#ej2Toolbar');
            expect(toolbar.items.length).toEqual(3);
            expect(toolbar.element.querySelectorAll('.e-toolbar-item button')[2].children[0].innerHTML).toEqual('Bold');
            toolbar.addItems([
                { type: 'Button', text: 'Underline1' }, { type: 'Button', text: 'Bold1' }
            ]);
            expect(toolbar.items.length).toEqual(5);
            expect(toolbar.element.querySelectorAll('.e-toolbar-item button')[0].children[0].innerHTML).toEqual('Underline1');
            expect(toolbar.element.querySelectorAll('.e-toolbar-item button')[1].children[0].innerHTML).toEqual('Bold1');
        });
        it('addItem method - adding item to popup element index', () => {
            toolbar = new Toolbar({
                width: 100,
                overflowMode: 'Popup',
                items: [
                    {
                        type: 'Button', text: 'Hii',
                    },
                    {
                        type: 'Button', text: 'Cut',
                    },
                    {
                        type: 'Button', text: 'Bold',
                    },
                    {
                        type: 'Button', text: 'UnderLine',
                    }
                ],
            }); toolbar.appendTo('#ej2Toolbar');
            expect(toolbar.items.length).toEqual(4);
            expect(toolbar.element.querySelectorAll('.e-toolbar-item button')[2].children[0].innerHTML).toEqual('Bold');
            toolbar.addItems([{ type: 'Button', text: 'Underline1' }], 2);
            expect(toolbar.items.length).toEqual(5);
            expect(toolbar.element.querySelectorAll('.e-toolbar-item button')[2].children[0].innerHTML).toEqual('Underline1');
            toolbar.addItems([{ type: 'Button', text: 'Hi' }], 1);
            expect(toolbar.items.length).toEqual(6);
            expect(toolbar.element.querySelectorAll('.e-toolbar-item button')[1].children[0].innerHTML).toEqual('Hi');
            toolbar.addItems([{ type: 'Button', text: 'Center' }], 6);
            expect(toolbar.items.length).toEqual(7);
            expect(toolbar.element.querySelectorAll('.e-toolbar-item button')[6].children[0].innerHTML).toEqual('Center');
            toolbar.addItems([{ template: ' <div>Copy</div>' }], 2);
            expect(toolbar.items.length).toEqual(8);
            expect(toolbar.element.querySelectorAll('.e-toolbar-item')[2].children[0].innerHTML).toEqual('Copy');
            toolbar.addItems([{ template: '<div>Paste</div>' }], 1);
            expect(toolbar.items.length).toEqual(9);
            expect(toolbar.element.querySelectorAll('.e-toolbar-item')[1].children[0].innerHTML).toEqual('Paste');
            toolbar.addItems([{ template: '<div>Left</div>' }], 8);
            expect(toolbar.items.length).toEqual(10);
            expect(toolbar.element.querySelectorAll('.e-toolbar-item')[8].children[0].innerHTML).toEqual('Left');
        });
    });

    describe(' Public methods remove items Testing', () => {
        let toolbar: any;
        document.body.innerHTML = '';
        beforeEach((): void => {
            toolbar = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Toolbar' });
            setStyleAttribute(ele, { 'display': 'block', 'white-space': 'nowrap', 'position': 'relative' });
            ele.style.display = 'block';
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (toolbar) {
                toolbar.destroy();
            }
            document.body.innerHTML = '';
        });
        it(' removeItems method Testing using index', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                width: 250,
                overflowMode: 'Popup',
                items: [
                    {
                        type: 'Button', text: 'Hii',
                    },
                    {
                        type: 'Button', text: 'Unterline',
                    },
                    {
                        type: 'Button', text: 'Bold',
                    }
                ],
            }); toolbar.appendTo('#ej2Toolbar');
            expect(toolbar.items.length).toEqual(3);
            expect(toolbar.element.querySelectorAll('.e-toolbar-item button')[2].children[0].innerHTML).toEqual('Bold');
            toolbar.removeItems(1);
            expect(toolbar.items.length).toEqual(2);
            expect(toolbar.element.querySelectorAll('.e-toolbar-item button')[1].children[0].innerHTML).toEqual('Bold');
            toolbar.removeItems(5);
            expect(toolbar.items.length).toEqual(2);
        });
        it(' removeItems method Testing using index', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                width: 120,
                overflowMode: 'Popup',
                items: [
                    {
                        type: 'Button', text: 'Hii',
                    },
                    {
                        type: 'Button', text: 'Unterline',
                    },
                    {
                        type: 'Button', text: 'Bold',
                    }
                ],
            }); toolbar.appendTo('#ej2Toolbar');
            expect(toolbar.items.length).toEqual(3);
            expect(toolbar.element.querySelectorAll('.e-toolbar-item button')[2].children[0].innerHTML).toEqual('Bold');
            toolbar.removeItems(toolbar.popObj.element.querySelectorAll('.e-toolbar-item'));
            expect(toolbar.items.length).toEqual(1);
            expect(toolbar.element.querySelectorAll('.e-toolbar-item button')[0].children[0].innerHTML).toEqual('Hii');
        });
        it(' removeItems method Testing using index', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                width: 100,
                overflowMode: 'Popup',
                items: [
                    {
                        type: 'Button', text: 'Hii',
                    },
                    {
                        type: 'Button', text: 'Underline',
                    },
                    {
                        type: 'Button', text: 'Bold',
                    }
                ],
            }); toolbar.appendTo('#ej2Toolbar');
            expect(toolbar.items.length).toEqual(3);
            expect(toolbar.element.querySelectorAll('.e-toolbar-item button')[2].children[0].innerHTML).toEqual('Bold');
            toolbar.removeItems([toolbar.popObj.element.querySelectorAll('.e-toolbar-item')[0]]);
            expect(toolbar.items.length).toEqual(2);
            expect(toolbar.element.querySelectorAll('.e-toolbar-item button')[0].children[0].innerHTML).toEqual('Hii');
            expect(toolbar.element.querySelectorAll('.e-toolbar-item button')[1].children[0].innerHTML).toEqual('Bold');
            expect(toolbar.popObj).toEqual(null);
        });
        it('Remove all items after addItems method testing', () => {
            toolbar = new Toolbar({
                width: 250,
                items: [
                    { type: 'Button', text: 'test' }
                ],
            }); toolbar.appendTo('#ej2Toolbar');
            expect(toolbar.items.length).toEqual(1);
            expect(toolbar.element.querySelectorAll('.e-toolbar-items').length).toEqual(1);
            expect(toolbar.element.querySelectorAll('.e-toolbar-item').length).toEqual(1);
            toolbar.removeItems([toolbar.element.querySelectorAll('.e-toolbar-item')[0]]);
            expect(toolbar.items.length).toEqual(0);
            expect(toolbar.element.querySelectorAll('.e-toolbar-items').length).toEqual(1);
            expect(toolbar.element.querySelectorAll('.e-toolbar-item').length).toEqual(0);
            toolbar.addItems([
                { type: 'Button', text: 'Underline1' },
                { type: 'Button', text: 'Bold1' }
            ], 0);
            expect(toolbar.items.length).toEqual(2);
            expect(toolbar.items[0].text).toEqual('Underline1');
            expect(toolbar.items[1].text).toEqual('Bold1');
            expect(toolbar.element.querySelectorAll('.e-toolbar-items').length).toEqual(1);
            expect(toolbar.element.querySelectorAll('.e-toolbar-item').length).toEqual(2);
            expect(toolbar.element.querySelectorAll('.e-toolbar-item button').length).toEqual(2);
            expect(toolbar.element.querySelectorAll('.e-toolbar-item button')[0].children[0].innerHTML).toEqual('Underline1');
            expect(toolbar.element.querySelectorAll('.e-toolbar-item button')[1].children[0].innerHTML).toEqual('Bold1');
        });
    });

    describe(' Public methods disable Testing', () => {
        let toolbar: any;
        document.body.innerHTML = '';
        beforeEach((): void => {
            toolbar = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Toolbar' });
            setStyleAttribute(ele, { 'display': 'block', 'white-space': 'nowrap', 'position': 'relative' });
            ele.style.display = 'block';
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (toolbar) {
                toolbar.destroy();
            }
            document.body.innerHTML = '';
        });
        it(' Disable public method Testing with scrollable mode', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                width: 100,
                overflowMode: 'Popup',
                items: [
                    {
                        type: 'Button', text: 'Hii',
                    },
                    {
                        type: 'Button', text: 'Unterline',
                    },
                    {
                        type: 'Button', text: 'Bold',
                    }
                ],
            }); toolbar.appendTo('#ej2Toolbar');
            toolbar.popObj.show();
            toolbar.disable(true);
            expect(toolbar.element.classList.contains(CLS_DISABLE)).toBe(true);
            expect(isVisible(toolbar.popObj.element)).toBe(false);
            expect(toolbar.element.querySelector('.' + CLS_POPUPNAV).getAttribute('tabindex')).toBe('-1');
            toolbar.disable(false);
            expect(toolbar.element.classList.contains(CLS_DISABLE)).toBe(false);
            expect(isVisible(toolbar.popObj.element)).toBe(false);
            expect(toolbar.element.querySelector('.' + CLS_POPUPNAV).getAttribute('tabindex')).toBe('0');
        });
        it(' Disable public method Testing with scrollable mode', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                width: 100,
                items: [
                    {
                        type: 'Button', text: 'Hii',
                    },
                    {
                        type: 'Button', text: 'Unterline',
                    },
                    {
                        type: 'Button', text: 'Bold',
                    }
                ],
            }); toolbar.appendTo('#ej2Toolbar');
            toolbar.disable(true);
            expect(toolbar.element.classList.contains(CLS_DISABLE)).toBe(true);
        });
    });



    describe(' Public methods enableItems Testing', () => {
        let toolbar: any;
        document.body.innerHTML = '';
        beforeEach((): void => {
            toolbar = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Toolbar' });
            setStyleAttribute(ele, { 'display': 'block', 'white-space': 'nowrap', 'position': 'relative' });
            ele.style.display = 'block';
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (toolbar) {
                toolbar.destroy();
            }
            document.body.innerHTML = '';
        });
        it(' enableItems method Testing ', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                width: 250,
                overflowMode: 'Popup',
                items: [
                    {
                        type: 'Button', text: 'Hii',
                    },
                    {
                        type: 'Button', text: 'Unterline',
                    },
                    {
                        type: 'Button', text: 'Bold',
                    }
                ],
            }); toolbar.appendTo('#ej2Toolbar');
            toolbar.enableItems(toolbar.element.querySelectorAll('.e-toolbar-item'), false);
            expect(toolbar.element.querySelectorAll('.e-toolbar-item')[0].classList.contains('e-overlay')).toEqual(true);
            expect(toolbar.element.querySelectorAll('.e-toolbar-item')[1].classList.contains('e-overlay')).toEqual(true);
            expect(toolbar.element.querySelectorAll('.e-toolbar-item')[2].classList.contains('e-overlay')).toEqual(true);
        });

        it(' enableItems method Testing ', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                width: 250,
                overflowMode: 'Popup',
                items: [
                    {
                        type: 'Button', text: 'Hii',
                    },
                    {
                        type: 'Button', text: 'Unterline',
                    },
                    {
                        type: 'Button', text: 'Bold',
                    }
                ],
            }); toolbar.appendTo('#ej2Toolbar');
            toolbar.enableItems(toolbar.element.querySelectorAll('.e-toolbar-item'), false);
            toolbar.enableItems(toolbar.element.querySelectorAll('.e-toolbar-item'), true);
            expect(toolbar.element.querySelectorAll('.e-toolbar-item')[0].classList.contains('e-overlay')).toEqual(false);
            expect(toolbar.element.querySelectorAll('.e-toolbar-item')[1].classList.contains('e-overlay')).toEqual(false);
            expect(toolbar.element.querySelectorAll('.e-toolbar-item')[2].classList.contains('e-overlay')).toEqual(false);
            toolbar.enableItems(toolbar.element.querySelector('.e-toolbar-item'), false);
            expect(toolbar.element.querySelector('.e-toolbar-item').classList.contains('e-overlay')).toEqual(true);
        });

        it(' enableItems method Testing without passing 2nd args ', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                width: 250,
                overflowMode: 'Popup',
                items: [
                    {
                        type: 'Button', text: 'Hii',
                    },
                    {
                        type: 'Button', text: 'Unterline',
                    },
                    {
                        type: 'Button', text: 'Bold',
                    }
                ],
            }); toolbar.appendTo('#ej2Toolbar');
            toolbar.enableItems([toolbar.element.querySelectorAll('.e-toolbar-item')[0]], false);
            expect(toolbar.element.querySelectorAll('.e-toolbar-item')[0].classList.contains('e-overlay')).toEqual(true);
            toolbar.enableItems([toolbar.element.querySelectorAll('.e-toolbar-item')[0]]);
            expect(toolbar.element.querySelectorAll('.e-toolbar-item')[0].classList.contains('e-overlay')).toEqual(false);

        });
        it(' enableItems method Testing ', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                width: 250,
                overflowMode: 'Popup',
                items: [
                    {
                        type: 'Button', text: 'Hii',
                    },
                    {
                        type: 'Button', text: 'Unterline',
                    },
                    {
                        type: 'Button', text: 'Bold',
                    }
                ],
            }); toolbar.appendTo('#ej2Toolbar');
            toolbar.enableItems([toolbar.element.querySelectorAll('.e-toolbar-item')[0]], false);
            toolbar.enableItems([toolbar.element.querySelectorAll('.e-toolbar-item')[0]], true);
            expect(toolbar.element.querySelectorAll('.e-toolbar-item')[0].classList.contains('e-overlay')).toEqual(false);
        });

    });



    describe('onproperty change popup', () => {
        let toolbar: Toolbar;
        document.body.innerHTML = '';
        beforeEach((): void => {
            toolbar = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Toolbar' });
            setStyleAttribute(ele, { 'display': 'block', 'white-space': 'nowrap', 'position': 'relative' });
            ele.style.display = 'block';
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (toolbar) {
                toolbar.destroy();
            }
            document.body.innerHTML = '';
        });
        it('onproperty change popup', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                width: 50,
                items: [
                    {
                        type: 'Button', text: 'Hii', overflow: 'Show',
                    },
                    {
                        type: 'Button', text: 'New Chart Button', overflow: 'Show',
                    },
                    {
                        type: 'Button', text: 'UnderlineBtn', overflow: 'Show',
                    },
                    {
                        type: 'Button', text: 'ChartButton', overflow: 'Show',
                    },
                    {
                        type: 'Button', text: 'Next_Prev_Btn', overflow: 'Hide',
                    }
                ],
            }, '#ej2Toolbar');
            expect(element.querySelectorAll('.e-toolbar-items .e-toolbar-item').length).toEqual(5);
            toolbar.overflowMode = 'Popup';
            toolbar.dataBind();
            expect(element.querySelectorAll('.e-hscroll').length).toEqual(0);
            expect(element.querySelectorAll('.e-popup').length).toEqual(1);
            toolbar.overflowMode = 'Scrollable';
            toolbar.dataBind();
            expect(element.querySelectorAll('.e-hscroll').length).toEqual(1);
            expect(element.querySelectorAll('.e-popup').length).toEqual(0);
        });
        it('onproperty change popup without hscroll Module', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                items: [
                    {
                        type: 'Button', text: 'Hii', overflow: 'Show',
                    },
                    {
                        type: 'Button', text: 'New Chart Button', overflow: 'Show',
                    },
                    {
                        type: 'Button', text: 'UnderlineBtn', overflow: 'Show',
                    },
                    {
                        type: 'Button', text: 'ChartButton', overflow: 'Show',
                    },
                    {
                        type: 'Button', text: 'Next_Prev_Btn', overflow: 'Hide',
                    }
                ],
            }, '#ej2Toolbar');
            expect(element.querySelectorAll('.e-toolbar-items .e-toolbar-item').length).toEqual(5);
            toolbar.overflowMode = 'Popup';
            toolbar.dataBind();
            expect(element.querySelectorAll('.e-hscroll').length).toEqual(0);
        });
        it('onproperty change popup with RTL', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                width: 50,
                enableRtl: true,
                items: [
                    {
                        type: 'Button', text: 'Hii', overflow: 'Show',
                    },
                    {
                        type: 'Button', text: 'New Chart Button', overflow: 'Show',
                    },
                    {
                        type: 'Button', text: 'UnderlineBtn', overflow: 'Show',
                    },
                    {
                        type: 'Button', text: 'ChartButton', overflow: 'Show',
                    },
                    {
                        type: 'Button', text: 'Next_Prev_Btn', overflow: 'Hide',
                    }
                ],
            }, '#ej2Toolbar');
            expect(element.querySelectorAll('.e-toolbar-items .e-toolbar-item').length).toEqual(5);
            toolbar.overflowMode = 'Popup';
            toolbar.dataBind();
            expect(element.querySelectorAll('.e-hscroll').length).toEqual(0);
            expect(element.querySelectorAll('.e-popup').length).toEqual(1);
            expect(element.classList.contains('e-rtl')).toEqual(true);
        });
        it('onproperty change Scrollable', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                width: 100,
                overflowMode: 'Popup',
                items: [
                    {
                        type: 'Button', text: 'Hii', overflow: 'Show',
                    },
                    {
                        type: 'Button', text: 'New Chart Button', overflow: 'Show',
                    },
                    {
                        type: 'Button', text: 'UnderlineBtn', overflow: 'Show',
                    },
                    {
                        type: 'Button', text: 'ChartButton', overflow: 'Show',
                    },
                    {
                        type: 'Button', text: 'Next_Prev_Btn', overflow: 'Hide',
                    }
                ],
            }, '#ej2Toolbar');
            expect(element.querySelectorAll('.e-toolbar-items .e-toolbar-item').length).toEqual(1);
            toolbar.overflowMode = 'Scrollable';
            toolbar.dataBind();
            expect(element.querySelectorAll('.e-hscroll').length).toEqual(1);
            expect(element.querySelectorAll('.e-popup').length).toEqual(0);
        });
        it('onproperty change Scrollable with RTL', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                width: 250,
                enableRtl: true,
                overflowMode: 'Popup',
                items: [
                    {
                        type: 'Button', text: 'Hii', overflow: 'Show',
                    },
                    {
                        type: 'Button', text: 'New Chart Button', overflow: 'Show',
                    },
                    {
                        type: 'Button', text: 'UnderlineBtn', overflow: 'Show',
                    },
                    {
                        type: 'Button', text: 'ChartButton', overflow: 'Show',
                    },
                    {
                        type: 'Button', text: 'Next_Prev_Btn', overflow: 'Hide',
                    }
                ],
            }, '#ej2Toolbar');
            expect(element.querySelectorAll('.e-toolbar-items .e-toolbar-item button')[0].children[0].innerHTML).toEqual('Hii');
            expect(element.querySelectorAll('.e-toolbar-items .e-toolbar-item button')[1].children[0].innerHTML).toEqual('New Chart Button');
            toolbar.overflowMode = 'Scrollable';
            toolbar.dataBind();
            expect(element.querySelectorAll('.e-hscroll').length).toEqual(1);
            expect(element.querySelectorAll('.e-popup').length).toEqual(0);
        });
    });


    describe('Popup Priority Testing', () => {
        let toolbar: Toolbar;
        document.body.innerHTML = '';
        beforeEach((): void => {
            toolbar = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Toolbar' });
            setStyleAttribute(ele, { 'display': 'block', 'white-space': 'nowrap', 'position': 'relative' });
            ele.style.display = 'block';
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (toolbar) {
                toolbar.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Popup Priority Testing check', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                overflowMode: 'Popup',
                width: 170,
                items: [
                    {
                        type: 'Button', text: 'Hii', overflow: 'Show',
                    },
                    {
                        type: 'Button', text: 'New Chart Button', overflow: 'Show',
                    },
                    {
                        type: 'Button', text: 'UnderlineBtn', overflow: 'Show',
                    },
                    {
                        type: 'Button', text: 'ChartButton', overflow: 'Show',
                    },
                    {
                        type: 'Button', text: 'Next_Prev_Btn', overflow: 'Hide',
                    }
                ],
            }, '#ej2Toolbar');
            expect(element.querySelectorAll('.e-popup .e-toolbar-item').length).toEqual(4);
            expect(element.querySelectorAll('.e-popup .e-toolbar-item button')[3].children[0].innerHTML).toEqual('Next_Prev_Btn');
        });
    });


    describe('RTL testing', () => {
        let toolbar: Toolbar;
        document.body.innerHTML = '';
        beforeEach((): void => {
            toolbar = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Toolbar' });
            setStyleAttribute(ele, { 'display': 'block', 'white-space': 'nowrap', 'position': 'relative' });
            ele.style.display = 'block';
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (toolbar) {
                toolbar.destroy();
            }
            document.body.innerHTML = '';
        });
        it('rtl class adding check', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                width: 170,
                enableRtl: true,
                items: [
                    {
                        type: 'Button', text: 'Hii', overflow: 'Show',
                    },
                    {
                        type: 'Button', text: 'New Chart Button', overflow: 'Show',
                    },
                    {
                        type: 'Button', text: 'UnderlineBtn', overflow: 'Show',
                    },
                    {
                        type: 'Button', text: 'ChartButton', overflow: 'Show',
                    },
                    {
                        type: 'Button', text: 'Next_Prev_Btn', overflow: 'Hide',
                    }
                ],
            }, '#ej2Toolbar');
            toolbar.dataBind();
            expect(element.classList.contains('e-rtl')).toEqual(true);
        });
        it('rtl class adding check with popup', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            let innerNavElement: HTMLElement = <HTMLElement>element.querySelector('.e-hor-nav');
            toolbar = new Toolbar({
                overflowMode: 'Popup',
                width: 170,
                items: [
                    {
                        type: 'Button', text: 'Hii', overflow: 'Show',
                    },
                    {
                        type: 'Button', text: 'New Chart Button', overflow: 'Show',
                    },
                    {
                        type: 'Button', text: 'UnderlineBtn', overflow: 'Show',
                    },
                    {
                        type: 'Button', text: 'ChartButton', overflow: 'Show',
                    },
                    {
                        type: 'Button', text: 'Next_Prev_Btn', overflow: 'Hide',
                    }
                ],
            }, '#ej2Toolbar');
            toolbar.enableRtl = true;
            toolbar.dataBind();
            expect(element.classList.contains('e-rtl')).toEqual(true);
        });
        it('rtl class adding check  with on property change ', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                overflowMode: 'Popup',
                width: 170,
                items: [
                    {
                        type: 'Button', text: 'Hii', overflow: 'Show',
                    },
                    {
                        type: 'Button', text: 'New Chart Button', overflow: 'Show',
                    },
                    {
                        type: 'Button', text: 'UnderlineBtn', overflow: 'Show',
                    },
                    {
                        type: 'Button', text: 'ChartButton', overflow: 'Show',
                    },
                    {
                        type: 'Button', text: 'Next_Prev_Btn', overflow: 'Hide',
                    }
                ],
            }, '#ej2Toolbar');
            toolbar.enableRtl = true;
            toolbar.dataBind();
            expect(element.classList.contains('e-rtl')).toEqual(true);
        });
        it('rtl class adding check  with on proerty change ', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                overflowMode: 'Popup',
                width: 170,
                items: [
                    {
                        type: 'Button', text: 'Hii', overflow: 'Show',
                    },
                    {
                        type: 'Button', text: 'New Chart Button', overflow: 'Show',
                    },
                    {
                        type: 'Button', text: 'UnderlineBtn', overflow: 'Show',
                    },
                    {
                        type: 'Button', text: 'ChartButton', overflow: 'Show',
                    },
                    {
                        type: 'Button', text: 'Next_Prev_Btn', overflow: 'Hide',
                    }
                ],
            }, '#ej2Toolbar');
            toolbar.enableRtl = true;
            toolbar.dataBind();
            expect(element.classList.contains('e-rtl')).toEqual(true);
            let innerNavElement: HTMLElement = <HTMLElement>element.querySelector('.e-hor-nav');
            innerNavElement.click();
            innerNavElement.click();
        });
        it('rtl class adding check  with on proerty change ', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');

            toolbar = new Toolbar({
                overflowMode: 'Scrollable',
                width: 170,
                items: [
                    {
                        type: 'Button', text: 'Hii', overflow: 'Show',
                    },
                    {
                        type: 'Button', text: 'New Chart Button', overflow: 'Show',
                    },
                    {
                        type: 'Button', text: 'UnderlineBtn', overflow: 'Show',
                    },
                    {
                        type: 'Button', text: 'ChartButton', overflow: 'Show',
                    },
                    {
                        type: 'Button', text: 'Next_Prev_Btn', overflow: 'Hide',
                    }
                ],
            }, '#ej2Toolbar');
            toolbar.enableRtl = true;
            toolbar.dataBind();
            expect(element.classList.contains('e-rtl')).toEqual(true);
            let innerNavElement: HTMLElement = <HTMLElement>element.querySelector('.e-scroll-nav');
            innerNavElement.click();
            toolbar.enableRtl = false;
            toolbar.dataBind();
            expect(element.classList.contains('e-rtl')).toEqual(false);
        });
        it('rtl class adding check  with on proerty change ', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                overflowMode: 'Popup',
                width: 170,
                items: [
                    {
                        type: 'Button', text: 'Hii', overflow: 'Show',
                    },
                    {
                        type: 'Button', text: 'New Chart Button', overflow: 'Show',
                    },
                    {
                        type: 'Button', text: 'UnderlineBtn', overflow: 'Show',
                    },
                    {
                        type: 'Button', text: 'ChartButton', overflow: 'Show',
                    },
                    {
                        type: 'Button', text: 'Next_Prev_Btn', overflow: 'Hide',
                    }
                ],
            }, '#ej2Toolbar');
            toolbar.enableRtl = true;
            toolbar.dataBind();
            expect(element.classList.contains('e-rtl')).toEqual(true);
            let innerNavElement: HTMLElement = <HTMLElement>element.querySelector('.e-hor-nav');
            innerNavElement.click();
            toolbar.enableRtl = false;
            toolbar.dataBind();
            expect(element.classList.contains('e-rtl')).toEqual(false);
            innerNavElement.click();
        });
    });

    describe('Aria attributes Testing', () => {
        let toolbar: Toolbar;
        document.body.innerHTML = '';
        beforeEach((): void => {
            toolbar = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Toolbar' });
            setStyleAttribute(ele, { 'display': 'block', 'white-space': 'nowrap', 'position': 'relative' });
            ele.style.display = 'block';
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (toolbar) {
                toolbar.destroy();
                expect(toolbar.element.getAttribute('aria-disabled')).toEqual(null);
                expect(toolbar.element.getAttribute('aria-haspopup')).toEqual(null);
                expect(toolbar.element.getAttribute('aria-orientation')).toEqual(null);
                expect(toolbar.element.getAttribute('role')).toEqual(null);
            }
            document.body.innerHTML = '';
        });
        it('Toolbar root element aria testing', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                overflowMode: 'Popup',
                items: [
                    {
                        type: 'Button', text: 'Hii', overflow: 'Show',
                    },
                    {
                        type: 'Button', text: 'New Chart Button', overflow: 'Show',
                    },
                    {
                        type: 'Button', text: 'UnderlineBtn', overflow: 'Show',
                    },
                    {
                        type: 'Button', text: 'ChartButton', overflow: 'Show',
                    },
                    {
                        type: 'Button', text: 'Next_Prev_Btn', overflow: 'Hide',
                    }
                ],
            }, '#ej2Toolbar');
            expect(element.getAttribute('aria-disabled')).toEqual('false');
            expect(element.getAttribute('aria-haspopup')).toEqual('false');
            expect(element.classList.contains('e-toolpop')).toEqual(true);
            expect(element.getAttribute('role')).toEqual('toolbar');
            expect(element.getAttribute('aria-orientation')).toEqual('horizontal');
            toolbar.width = 200;
            toolbar.dataBind();
            expect(element.getAttribute('aria-haspopup')).toEqual('true');
            expect(element.classList.contains('e-toolpop')).toEqual(true);
            toolbar.width = '1000px';
            toolbar.dataBind();
            expect(element.getAttribute('aria-haspopup')).toEqual('false');
            expect(element.classList.contains('e-toolpop')).toEqual(false);
        });
    });

    describe('Template Toolbar Testing with div', () => {
        let toolbar: Toolbar;
        document.body.innerHTML = '';
        beforeEach((): void => {
            toolbar = undefined;
            document.body.innerHTML = '';
            let ele: HTMLElement = createElement('div', { id: 'ej2Toolbar' });
            let innerEle: HTMLElement = createElement('div');
            let innerEle1: HTMLElement = createElement('div');
            let innerEle_1: HTMLElement = createElement('div', { className: 'e-toolbar-item' });
            let innerEle_: HTMLElement = createElement('div');
            innerEle.appendChild(innerEle_);
            innerEle.appendChild(innerEle_1);
            ele.appendChild(innerEle);
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (toolbar) {
                toolbar.destroy();
                expect(toolbar.element.getAttribute('aria-disabled')).toEqual(null);
                expect(toolbar.element.getAttribute('aria-haspopup')).toEqual(null);
                expect(toolbar.element.getAttribute('aria-orientation')).toEqual(null);
                expect(toolbar.element.getAttribute('role')).toEqual(null);
                let fstChild: HTMLElement = <HTMLElement>toolbar.element.children[0];
                expect(fstChild.classList.contains('e-toolbar-items')).toBe(false);
                let fstItem: HTMLElement = <HTMLElement>toolbar.element.children[0].children[0];
                expect(fstItem.classList.contains('e-toolbar-item')).toBe(false);
                let sndItem: HTMLElement = <HTMLElement>toolbar.element.children[0].children[1];
                expect(sndItem.classList.contains('e-toolbar-item')).toBe(true);
            }
            document.body.innerHTML = '';
        });
        it('Template Toolbar Testing', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({}, '#ej2Toolbar');
            expect(element.querySelectorAll('.e-toolbar-items').length === 1).toEqual(true);
            let innerEle = <HTMLElement>element.querySelector('.e-toolbar-items');
            expect((<HTMLElement>innerEle.children[0]).classList.contains('e-toolbar-item')).toEqual(true);
            expect((<HTMLElement>innerEle.children[1]).classList.contains('e-toolbar-item')).toEqual(true);
        });
    });


    describe('Template Toolbar Testing with span', () => {
        let toolbar: Toolbar;
        document.body.innerHTML = '';
        beforeEach((): void => {
            toolbar = undefined;
            document.body.innerHTML = '';
            let ele: HTMLElement = createElement('div', { id: 'ej2Toolbar' });
            let innerEle: HTMLElement = createElement('div');
            let innerEle1: HTMLElement = createElement('div');
            let innerEle_1: HTMLElement = createElement('div', { className: 'e-toolbar-item' });
            let innerEle_: HTMLElement = createElement('span');
            innerEle.appendChild(innerEle_);
            innerEle.appendChild(innerEle_1);
            ele.appendChild(innerEle);
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (toolbar) {
                toolbar.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Template Toolbar Testing', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({}, '#ej2Toolbar');
            expect(element.querySelectorAll('.e-toolbar-items').length === 1).toEqual(true);
            let innerEle = <HTMLElement>element.querySelector('.e-toolbar-items');
            expect((<HTMLElement>innerEle.children[0]).classList.contains('e-toolbar-item')).toEqual(false);
            expect((<HTMLElement>innerEle.children[1]).classList.contains('e-toolbar-item')).toEqual(true);
        });
    });

    describe('Cross Browser Testing with IE popup icon alignment', () => {
        let toolbar: any;
        let keyEventArgs: any;
        document.body.innerHTML = '';
        beforeEach((): void => {
            toolbar = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Toolbar' });
            setStyleAttribute(ele, { 'display': 'block', 'white-space': 'nowrap', 'position': 'relative' });
            ele.style.display = 'block';
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (toolbar) {
                toolbar.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Cross browser Testing with IE', () => {
            Browser.userAgent = ieUa;
            toolbar = new Toolbar({
                width: 70,
                overflowMode: "Popup",
                items: [
                    { type: 'Button', text: 'Underline', showTextOn: 'Toolbar' },
                    { type: 'Button', text: 'Bold' },
                    { type: 'Button', text: 'Italic' }
                ],
            }); toolbar.appendTo('#ej2Toolbar');
            let popupNav: HTMLElement = toolbar.element.querySelector('.e-hor-nav') as HTMLElement;
            expect(popupNav.classList.contains('e-ie-align')).toEqual(true);
        });
    });
    describe('Popup Close Click event testing', () => {
        let toolbar: any;
        let keyEventArgs: any;
        document.body.innerHTML = '';
        beforeEach((done: Function) => {
            toolbar = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Toolbar' });
            setStyleAttribute(ele, { 'display': 'block', 'white-space': 'nowrap', 'position': 'relative' });
            ele.style.display = 'block';
            document.body.appendChild(ele);
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                width: 50,
                overflowMode: 'Popup',
                items: [
                    { type: 'Button', text: 'new', },
                    { type: 'Button', text: 'Underline Button', }]
            });
            toolbar.appendTo('#ej2Toolbar');
            keyEventArgs = {
                preventDefault: function () { },
                action: 'popupOpen',
                target: toolbar.element.querySelector('.e-hor-nav'),
            };
            toolbar.keyActionHandler(keyEventArgs);
            setTimeout(() => { done(); }, 450);
        });
        afterEach((): void => {
            expect(isVisible(toolbar.popObj.element)).toEqual(false);
            if (toolbar) {
                toolbar.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Popup  Close throught Click event  testing ',(done: Function) => {
            expect(isVisible(toolbar.popObj.element)).toEqual(true);
            toolbar.popObj.element.children[0].click();
            setTimeout(() => { done(); }, 450);
        });
    });
    describe('Popup not Close Click event args testing', () => {
        let toolbar: any;
        let keyEventArgs: any;
        document.body.innerHTML = '';
        function clicked (e: ClickEventArgs) {
          e.cancel = true; }
        beforeEach((done: Function) => {
            toolbar = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Toolbar' });
            setStyleAttribute(ele, { 'display': 'block', 'white-space': 'nowrap', 'position': 'relative' });
            ele.style.display = 'block';
            document.body.appendChild(ele);
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                clicked: clicked,
                width: 50,
                overflowMode: 'Popup',
                items: [
                    { type: 'Button', text: 'new', },
                    { type: 'Button', text: 'Underline Button', }]
            });
            toolbar.appendTo('#ej2Toolbar');
            keyEventArgs = {
                preventDefault: function () { },
                action: 'popupOpen',
                target: toolbar.element.querySelector('.e-hor-nav'),
            };
            toolbar.keyActionHandler(keyEventArgs);
            setTimeout(() => { done(); }, 450);
        });
        afterEach((): void => {
            expect(isVisible(toolbar.popObj.element)).toEqual(true);
            if (toolbar) {
                toolbar.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Popup not close throught Click event  testing ',(done: Function) => {
            expect(isVisible(toolbar.popObj.element)).toEqual(true);
            toolbar.popObj.element.children[0].click();
            setTimeout(() => { done(); }, 450);
        });
    });
    describe('Popup Open animation testing with animation', () => {
        let toolbar: any;
        let keyEventArgs: any;
        document.body.innerHTML = '';
        beforeEach((done: Function) => {
            toolbar = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Toolbar' });
            setStyleAttribute(ele, { 'display': 'block', 'white-space': 'nowrap', 'position': 'relative' });
            ele.style.display = 'block';
            document.body.appendChild(ele);
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                width: 50,
                overflowMode: 'Popup',
                items: [
                    { type: 'Button', text: 'new', },
                    { type: 'Button', text: 'Underline Button', }]
            });
            toolbar.appendTo('#ej2Toolbar');
            keyEventArgs = {
                preventDefault: function () { },
                action: 'popupOpen',
                target: toolbar.element.querySelector('.e-hor-nav'),
            };
            toolbar.keyActionHandler(keyEventArgs);
            setTimeout(() => { done(); }, 450);
        });
        afterEach((): void => {
            if (toolbar) {
                toolbar.destroy();
            }
            document.body.innerHTML = '';
        });
        it('popup Open througth keyboard testing ', () => {
            expect(isVisible(toolbar.popObj.element)).toEqual(true);
            toolbar.popObj.hide();
        });
    });
    describe('Popup Open animation  testing in keyboard in opened state with animation', () => {
        let toolbar: any;
        let keyEventArgs: any;
        document.body.innerHTML = '';
        beforeEach((done: Function) => {
            toolbar = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Toolbar' });
            setStyleAttribute(ele, { 'display': 'block', 'white-space': 'nowrap', 'position': 'relative' });
            ele.style.display = 'block';
            document.body.appendChild(ele);
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                width: 50,
                overflowMode: 'Popup',
                items: [
                    { type: 'Button', text: 'new', },
                    { type: 'Button', text: 'Underline Button', }]
            });
            toolbar.appendTo('#ej2Toolbar');
            keyEventArgs = {
                preventDefault: function () { },
                action: 'popupOpen',
                target: toolbar.element.querySelector('.e-hor-nav'),
            };
            toolbar.popObj.element.classList.add('e-popup-close')
            toolbar.keyActionHandler(keyEventArgs);
            setTimeout(() => { done(); }, 450);
        });
        afterEach((): void => {
            if (toolbar) {
                toolbar.destroy();
            }
            document.body.innerHTML = '';
        });
        it('popup Open througth keyboard testing ', () => {
            expect(isVisible(toolbar.popObj.element)).toEqual(true);
            keyEventArgs = {
                preventDefault: function () { },
                action: 'popupOpen',
                target: toolbar.element.querySelector('.e-hor-nav'),
            };
            toolbar.popObj.element.classList.add('e-popup-open');
            toolbar.keyActionHandler(keyEventArgs);
        });
    });
    describe('Popup Close animation testing with animation', () => {
        let toolbar: any;
        let keyEventArgs: any;
        document.body.innerHTML = '';
        beforeEach((done: Function) => {
            toolbar = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Toolbar' });
            setStyleAttribute(ele, { 'display': 'block', 'white-space': 'nowrap', 'position': 'relative' });
            ele.style.display = 'block';
            document.body.appendChild(ele);
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                width: 50,
                overflowMode: 'Popup',
                items: [
                    { type: 'Button', text: 'new', },
                    { type: 'Button', text: 'Underline Button', }]
            });
            toolbar.appendTo('#ej2Toolbar');
            keyEventArgs = {
                preventDefault: function () { },
                action: 'popupClose',
                target: toolbar.element,
            };
            toolbar.popObj.element.classList.add('e-popup-open');
            toolbar.keyActionHandler(keyEventArgs);
            setTimeout(() => { done(); }, 450);
        });
        afterEach((): void => {
            if (toolbar) {
                toolbar.destroy();
            }
            document.body.innerHTML = '';
        });
        it('popup close with througth keyboard testing with animation', () => {
            expect(isVisible(toolbar.popObj.element)).toEqual(false);
        });
    });
    describe('Popup Close check with Extended toolbar', () => {
        let toolbar: any;
        let keyEventArgs: any;
        document.body.innerHTML = '';
        beforeEach((done: Function) => {
            toolbar = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Toolbar' });
            setStyleAttribute(ele, { 'display': 'block', 'white-space': 'nowrap', 'position': 'relative' });
            ele.style.display = 'block';
            document.body.appendChild(ele);
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                width: 50,
                overflowMode: 'Extended',
                items: [
                    { type: 'Button', text: 'new', },
                    { type: 'Button', text: 'Underline Button', }]
            });
            toolbar.appendTo('#ej2Toolbar');
            keyEventArgs = {
                preventDefault: function () { },
                action: 'popupClose',
                target: toolbar.element,
            };
            toolbar.popObj.show();
            toolbar.keyActionHandler(keyEventArgs);
            setTimeout(() => { done(); }, 450);
        });
        afterEach((): void => {
            if (toolbar) {
                toolbar.destroy();
            }
            document.body.innerHTML = '';
        });
        it('popup close with througth keyboard testing with animation', () => {
            expect(isVisible(toolbar.popObj.element)).toEqual(true);
        });
    });
    describe('Popup close testing with element focus state swithching', () => {
        let toolbar: any;
        let keyEventArgs: any;
        document.body.innerHTML = '';
        beforeEach((done: Function) => {
            toolbar = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Toolbar' });
            setStyleAttribute(ele, { 'display': 'block', 'white-space': 'nowrap', 'position': 'relative' });
            ele.style.display = 'block';
            document.body.appendChild(ele);
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                width: 50,
                overflowMode: 'Popup',
                items: [
                    { type: 'Button', text: 'new', },
                    { type: 'Button', text: 'Underline Button', }]
            });
            toolbar.appendTo('#ej2Toolbar');
            setTimeout(() => { done(); }, 450);
        });
        afterEach((): void => {
            if (toolbar) {
                toolbar.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Focus moved from popup icon, popup close testing ', (done: Function) => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            let trgEle: HTMLElement = <HTMLElement> element.querySelector('.e-hor-nav');
            keyEventArgs = {
                preventDefault: function () { },
                action: 'popupOpen',
                target: trgEle,
            };
            toolbar.keyActionHandler(keyEventArgs);
            setTimeout(function() {
                let element: HTMLElement = <HTMLElement> document.getElementById('ej2Toolbar');
                let trg: HTMLElement = <HTMLElement> document.querySelector('.e-hor-nav');
                expect(element.querySelector('.e-toolbar-pop').classList.contains('e-popup-open')).toEqual(true);
                trg.focus();
                let actEle: HTMLElement = <HTMLElement> document.activeElement;
                let e: any = new KeyboardEvent("keydown", {bubbles : true, cancelable : true, key : '9', shiftKey : true});
                Object.defineProperty(e, "keyCode", {"value" : 9 });
                Object.defineProperty(e, "which", {"value" : 9 });
                actEle.dispatchEvent(e);
                setTimeout(function() {
                    expect(element.querySelector('.e-toolbar-pop').classList.contains('e-popup-open')).toEqual(false);
                    done();
                }, 500);
            }, 1000);
        });
    });
    describe('Popup Close animation testing with animation', () => {
        let toolbar: any;
        let keyEventArgs: any;
        document.body.innerHTML = '';
        beforeEach((done: Function) => {
            toolbar = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Toolbar' });
            setStyleAttribute(ele, { 'display': 'block', 'white-space': 'nowrap', 'position': 'relative' });
            ele.style.display = 'block';
            document.body.appendChild(ele);
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                width: 50,
                overflowMode: 'Popup',
                items: [
                    { type: 'Button', text: 'new', },
                    { type: 'Button', text: 'Underline Button', }]
            });
            toolbar.appendTo('#ej2Toolbar');
            keyEventArgs = {
                preventDefault: function () { },
                action: 'popupClose',
                target: toolbar.element,
            };
            toolbar.keyActionHandler(keyEventArgs);
            setTimeout(() => { done(); }, 450);
        });
        afterEach((): void => {
            if (toolbar) {
                toolbar.destroy();
            }
            document.body.innerHTML = '';
        });
        it('popup close with througth keyboard testing without popup opened ', () => {
            expect(isVisible(toolbar.popObj.element)).toEqual(false);
        });
    });
    describe('Popup with more content overflow testing', () => {
        let toolbar: any;
        let keyEventArgs: any;
        document.body.innerHTML = '';
        beforeEach((done: Function) => {
            toolbar = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Toolbar' });
            setStyleAttribute(ele, { 'display': 'block', 'white-space': 'nowrap', 'position': 'relative' });
            ele.style.display = 'block';
            document.body.appendChild(ele);
            toolbar = new Toolbar({
                width: 20,
                overflowMode: 'Popup',
                items: [
                    { type: 'Button', text: 'Hii2', }, { type: 'Button', text: 'Unterline22', }, { type: 'Button', text: 'Hii', }, { type: 'Button', text: 'Unterline', }, { type: 'Button', text: 'Hii', }, { type: 'Button', text: 'Hii', }, { type: 'Button', text: 'Unterline', }, { type: 'Button', text: 'Hii', }, { type: 'Button', text: 'Unterline', }, { type: 'Button', text: 'Hii', }, { type: 'Button', text: 'Unterline', }, { type: 'Button', text: 'Hii', }, { type: 'Button', text: 'Unterline', }, { type: 'Button', text: 'Bold', }, { type: 'Button', text: 'Hii', }, { type: 'Button', text: 'Unterline', }, { type: 'Button', text: 'Bold', }, { type: 'Button', text: 'Hii', }, { type: 'Button', text: 'Unterline', }, { type: 'Button', text: 'Bold', }, { type: 'Button', text: 'Hii', }, { type: 'Button', text: 'Unterline', }, { type: 'Button', text: 'Bold', }, { type: 'Button', text: 'Hii', }, { type: 'Button', text: 'Unterline', }, { type: 'Button', text: 'Bold', }, { type: 'Button', text: 'Hii', }, { type: 'Button', text: 'Unterline', }, { type: 'Button', text: 'Bold', }, { type: 'Button', text: 'Hii', }, { type: 'Button', text: 'Unterline', }, { type: 'Button', text: 'Bold', }, { type: 'Button', text: 'Hii', }, { type: 'Button', text: 'Unterline', }, { type: 'Button', text: 'Bold', }, { type: 'Button', text: 'Hii', }, { type: 'Button', text: 'Unterline', }, { type: 'Button', text: 'Bold', }, { type: 'Button', text: 'Hii', }, { type: 'Button', text: 'Unterline', }, { type: 'Button', text: 'Bold', }, { type: 'Button', text: 'Hii', }, { type: 'Button', text: 'Unterline', }, { type: 'Button', text: 'Bold', },
                ],
            }); toolbar.appendTo('#ej2Toolbar');
            let popupNav: HTMLElement = toolbar.element.querySelector('.e-hor-nav') as HTMLElement;
            let win: any = window;
            win.innerHeight = 40;
            popupNav.click();
            setTimeout(() => { done(); }, 450);
        });
        afterEach((): void => {
            if (toolbar) {
                toolbar.destroy();
            }
            document.body.innerHTML = '';
        });
        it('popup opened with content overflow testing', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            expect(toolbar.popObj.element.style.height === 'auto').toEqual(false);
            expect(toolbar.popObj.element.style.maxHeight === '').toEqual(false);
        });
    });
    describe('input element focusing with window resizing', () => {
        let toolbar: any;
        beforeEach((): void => {
            toolbar = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Toolbar' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (toolbar) {
                toolbar.destroy();
            }
            document.body.innerHTML = '';
        });

        it('Input element focusing issue in Mobile', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                width: 30,
                items: [{ template: '<input placeholder="Search" style="height:34px;"/>', type: 'Button', text: 'Underline', tooltipText: 'Bold', }],
            }); toolbar.appendTo('#ej2Toolbar');
            (element.querySelector('.e-template').firstChild as HTMLElement).focus();
            toolbar.resize();
            expect(document.activeElement.tagName).toEqual('INPUT');
        });
    });
    describe("Alignment Based toolbar item Rendering", () => {
        let toolbar: Toolbar;
        document.body.innerHTML = "";
        beforeEach((): void => {
            toolbar = undefined;
            let ele: HTMLElement = createElement("div", { id: "ej2Toolbar" });
            setStyleAttribute(ele, { "display": "block", "white-space": "nowrap", "position": "relative" });
            ele.style.display = "block";
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (toolbar) {
                toolbar.destroy();
            }
            document.body.innerHTML = "";
        });
        it("Without align type toolbar testing", () => {
            toolbar = new Toolbar({
                items: [
                    {
                        type: "Button", text: "Hii", overflow: "Show",
                    },
                    {
                        type: "Button", text: "New Chart Button", overflow: "Show",
                    },
                    {
                        type: "Button", text: "UnderlineBtn", overflow: "Show",
                    },
                    {
                        type: "Button", text: "ChartButton", overflow: "Show",
                    },
                    {
                        type: "Button", text: "Next_Prev_Btn", overflow: "Hide",
                    }
                ],
            }, "#ej2Toolbar");
            expect(toolbar.element.querySelector(".e-toolbar-items").children.length > 3).toEqual(true);
        });
    });
    describe("Alignment Based toolbar item Rendering", () => {
        let toolbar: Toolbar;
        document.body.innerHTML = "";
        beforeEach((): void => {
            toolbar = undefined;
            let ele: HTMLElement = createElement("div", { id: "ej2Toolbar" });
            setStyleAttribute(ele, { "display": "block", "white-space": "nowrap", "position": "relative" });
            ele.style.display = "block";
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (toolbar) {
                toolbar.destroy();
            }
            document.body.innerHTML = "";
        });
        it("Without align type toolbar testing", () => {
            toolbar = new Toolbar({
                width: 250,
                items: [
                    {
                        type: "Button", text: "Hii", overflow: "Show",
                    },
                    {
                        type: "Button", text: "New Chart Button", overflow: "Show",
                    },
                    {
                        type: "Button", text: "UnderlineBtn", overflow: "Show", align: "Center"
                    },
                    {
                        type: "Button", text: "ChartButton", overflow: "Show", align: "Center"
                    },
                    {
                        type: "Button", text: "Next_Prev_Btn", overflow: "Hide", align: "Right"
                    }
                ],
            }, "#ej2Toolbar");
            let tbarAlignEle: HTMLElement = toolbar.element.querySelector(".e-toolbar-items") as HTMLElement;
            let scrollAlignEle: HTMLCollection = tbarAlignEle.querySelector(".e-hscroll-content").children;
            expect(scrollAlignEle[0].querySelectorAll(".e-tbar-btn-text")[0].textContent).toEqual("Hii");
            expect(scrollAlignEle[0].querySelectorAll(".e-tbar-btn-text")[1].textContent).toEqual("New Chart Button");
            expect(scrollAlignEle[1].querySelectorAll(".e-tbar-btn-text")[1].textContent).toEqual("ChartButton");
            expect(scrollAlignEle[1].querySelectorAll(".e-tbar-btn-text")[0].textContent).toEqual("UnderlineBtn");
            expect(scrollAlignEle[2].querySelectorAll(".e-tbar-btn-text")[0].textContent).toEqual("Next_Prev_Btn");
        });
        it("Without align type with dynamic items updating in toolbar testing", () => {
            toolbar = new Toolbar({
                width: 250,
                overflowMode: "Popup",
                items: [
                    {
                        type: "Button", text: "Hii", overflow: "Show",
                    },
                    {
                        type: "Button", text: "New Chart Button", overflow: "Show",
                    },
                    {
                        type: "Button", text: "UnderlineBtn", overflow: "Show", align: "Center"
                    },
                    {
                        type: "Button", text: "ChartButton", overflow: "Show", align: "Center"
                    },
                    {
                        type: "Button", text: "Next_Prev_Btn", overflow: "Hide", align: "Right"
                    }
                ],
            }, "#ej2Toolbar");
            expect(toolbar.element.children[2].childElementCount).toBe(3);
            let items: ItemModel[] = [
                {
                    type: "Button", text: "HHii", overflow: "Show",
                },
                {
                    type: "Button", text: "New CChart Button", overflow: "Show",
                },
                {
                    type: "Button", text: "UUnderlineBtn", overflow: "Show"
                }]
            toolbar.items = items;
            toolbar.dataBind();
            expect(toolbar.element.children[0].childElementCount).toBe(2);
            expect(toolbar.element.children[0].classList.contains('e-tbar-pos')).toBe(false);
            expect(toolbar.element.children[2].childElementCount).toBe(1);
        });
        it("Without align type toolbar testing", () => {
            toolbar = new Toolbar({
                width: 250,
                items: [
                    {
                        type: "Button", text: "Hii", overflow: "Show",
                    },
                    {
                        type: "Button", text: "New Chart Button", overflow: "Show",
                    },
                    {
                        type: "Button", text: "UnderlineBtn", overflow: "Show", align: "Center"
                    },
                    {
                        type: "Button", text: "ChartButton", overflow: "Show", align: "Center"
                    },
                    {
                        type: "Button", text: "Next_Prev_Btn", overflow: "Hide"
                    }
                ],
            }, "#ej2Toolbar");
            let tbarAlignEle: HTMLElement = toolbar.element.querySelector(".e-toolbar-items") as HTMLElement;
            let scrollAlignEle: HTMLCollection = tbarAlignEle.querySelector(".e-hscroll-content").children;
            expect(scrollAlignEle[0].querySelectorAll(".e-tbar-btn-text")[0].textContent).toEqual("Hii");
            expect(scrollAlignEle[0].querySelectorAll(".e-tbar-btn-text")[1].textContent).toEqual("New Chart Button");
            expect(scrollAlignEle[1].querySelectorAll(".e-tbar-btn-text")[1].textContent).toEqual("ChartButton");
            expect(scrollAlignEle[1].querySelectorAll(".e-tbar-btn-text")[0].textContent).toEqual("UnderlineBtn");
            expect(scrollAlignEle[0].querySelectorAll(".e-tbar-btn-text")[2].textContent).toEqual("Next_Prev_Btn");
        });
    });

    describe("Alignment Based toolbar item Rendering", () => {
        let toolbar: Toolbar;
        document.body.innerHTML = "";
        beforeEach((): void => {
            toolbar = undefined;
            let ele: HTMLElement = createElement("div", { id: "ej2Toolbar" });
            setStyleAttribute(ele, { "display": "block", "white-space": "nowrap", "position": "relative" });
            ele.style.display = "block";
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (toolbar) {
                toolbar.destroy();
            }
            document.body.innerHTML = "";
        });
        it("Without align type toolbar testing", () => {
            toolbar = new Toolbar({
                overflowMode: "Popup",
                items: [
                    {
                        type: "Button", text: "Hii", overflow: "Show",
                    },
                    {
                        type: "Button", text: "New Chart Button", overflow: "Show",
                    },
                    {
                        type: "Button", text: "UnderlineBtn", overflow: "Show", align: "Center"
                    },
                    {
                        type: "Button", text: "ChartButton", overflow: "Show", align: "Center"
                    },
                    {
                        type: "Button", text: "Next_Prev_Btn", overflow: "Hide", align: "Right"
                    }
                ],
            }, "#ej2Toolbar");
            let tbarAlignEle: any = toolbar.element.querySelector(".e-toolbar-items").children;
            expect(tbarAlignEle.length === 3).toEqual(true);
            expect((<HTMLElement>tbarAlignEle[0]).classList.contains("e-toolbar-left")).toEqual(true);
            expect((<HTMLElement>tbarAlignEle[1]).classList.contains("e-toolbar-center")).toEqual(true);
            expect((<HTMLElement>tbarAlignEle[2]).classList.contains("e-toolbar-right")).toEqual(true);
            expect((<HTMLElement>tbarAlignEle[0]).children.length === 2).toEqual(true);
            expect((<HTMLElement>tbarAlignEle[1]).children.length === 2).toEqual(true);
            expect((<HTMLElement>tbarAlignEle[2]).children.length === 1).toEqual(true);
            toolbar.refresh();
            tbarAlignEle= toolbar.element.querySelector(".e-toolbar-items").children;
            expect(tbarAlignEle.length === 3).toEqual(true);
            expect((<HTMLElement>tbarAlignEle[0]).classList.contains("e-toolbar-left")).toEqual(true);
            expect((<HTMLElement>tbarAlignEle[1]).classList.contains("e-toolbar-center")).toEqual(true);
            expect((<HTMLElement>tbarAlignEle[2]).classList.contains("e-toolbar-right")).toEqual(true);
            expect((<HTMLElement>tbarAlignEle[0]).children.length === 2).toEqual(true);
            expect((<HTMLElement>tbarAlignEle[1]).children.length === 2).toEqual(true);
            expect((<HTMLElement>tbarAlignEle[2]).children.length === 1).toEqual(true);
        });
    });
    describe("Alignment Based toolbar item Rendering eith RTL", () => {
        let toolbar: Toolbar;
        document.body.innerHTML = "";
        beforeEach((): void => {
            toolbar = undefined;
            let ele: HTMLElement = createElement("div", { id: "ej2Toolbar" });
            setStyleAttribute(ele, { "display": "block", "white-space": "nowrap", "position": "relative" });
            ele.style.display = "block";
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (toolbar) {
                toolbar.destroy();
            }
            document.body.innerHTML = "";
        });
        it("Without align type toolbar testing", () => {
            toolbar = new Toolbar({
                overflowMode: "Popup",
                enableRtl: true,
                items: [
                    {
                        type: "Button", text: "Hii", overflow: "Show",
                    },
                    {
                        type: "Button", text: "New Chart Button", overflow: "Show",
                    },
                    {
                        type: "Button", text: "UnderlineBtn", overflow: "Show", align: "Center"
                    },
                    {
                        type: "Button", text: "ChartButton", overflow: "Show", align: "Center"
                    },
                    {
                        type: "Button", text: "Next_Prev_Btn", overflow: "Hide", align: "Right"
                    }
                ],
            }, "#ej2Toolbar");
            let tbarAlignEle: any = toolbar.element.querySelector(".e-toolbar-items").children;
            expect(tbarAlignEle.length === 3).toEqual(true);
            expect((<HTMLElement>tbarAlignEle[1]).style.marginLeft.length === 0).toEqual(true);
            expect((<HTMLElement>tbarAlignEle[1]).style.marginRight.length > 0).toEqual(true);
        });
    });
    describe("Alignment Based toolbar item Rendering", () => {
        let toolbar: any;
        document.body.innerHTML = "";
        beforeEach((): void => {
            toolbar = undefined;
            let ele: HTMLElement = createElement("div", { id: "ej2Toolbar" });
            setStyleAttribute(ele, { "display": "block", "white-space": "nowrap", "position": "relative" });
            ele.style.display = "block";
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (toolbar) {
                toolbar.destroy();
            }
            document.body.innerHTML = "";
        });
        it("Without align type toolbar testing", () => {
            toolbar = new Toolbar({
                overflowMode: "Popup",
                items: [
                    {
                        type: "Button", text: "Hii", overflow: "Show",
                    },
                    {
                        type: "Button", text: "New Chart Button", overflow: "Show",
                    },
                    {
                        type: "Button", text: "UnderlineBtn", overflow: "Show", align: "Center"
                    },
                    {
                        type: "Button", text: "ChartButton", overflow: "Show", align: "Center"
                    },
                    {
                        type: "Button", text: "Next_Prev_Btn", overflow: "Hide"
                    }
                ],
            }, "#ej2Toolbar");
            let tbarAlignEle: NodeList = toolbar.element.querySelector(".e-toolbar-items").children;
            expect(tbarAlignEle.length === 3).toEqual(true);
            expect((<HTMLElement>tbarAlignEle[0]).classList.contains("e-toolbar-left")).toEqual(true);
            expect((<HTMLElement>tbarAlignEle[1]).classList.contains("e-toolbar-center")).toEqual(true);
            expect((<HTMLElement>tbarAlignEle[2]).classList.contains("e-toolbar-right")).toEqual(true);
            expect((<HTMLElement>tbarAlignEle[0]).children.length === 3).toEqual(true);
            expect((<HTMLElement>tbarAlignEle[1]).children.length === 2).toEqual(true);
            expect((<HTMLElement>tbarAlignEle[2]).children.length === 0).toEqual(true);
        });
    });

    describe("Alignment Based toolbar item Rendering with Separator", () => {
        let toolbar: any;
        document.body.innerHTML = "";
        beforeEach((): void => {
            toolbar = undefined;
            let ele: HTMLElement = createElement("div", { id: "ej2Toolbar" });
            setStyleAttribute(ele, { "display": "block", "white-space": "nowrap", "position": "relative" });
            ele.style.display = "block";
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (toolbar) {
                toolbar.destroy();
            }
            document.body.innerHTML = "";
        });
        it("Toolbar items with separator with resizing", () => {
            let element: HTMLElement = document.getElementById("ej2Toolbar");
            toolbar = new Toolbar({
                width: 200,
                items: [
                    {
                        type: "Button", text: "Hii", overflow: "Show",
                    },
                    {
                        type: "Button", text: "New Chart Button", overflow: "Show",
                    },
                    {
                        type: "Button", text: "UnderlineBtn", overflow: "Show", align: "Center"
                    }, { type: "Separator", align: "Center" },
                    {
                        type: "Button", text: "ChartButton", overflow: "Show", align: "Center"
                    },
                    {
                        type: "Button", text: "Next_Prev_Btn", overflow: "Hide", align: "Right"
                    }, { type: "Separator" },
                ],
            }, "#ej2Toolbar");
            let tbarAlignEle: NodeList = toolbar.element.querySelector(".e-toolbar-items").children;
            let scrollAlignEle: HTMLCollection = toolbar.element.querySelector(".e-toolbar-items").querySelector(".e-hscroll-content").children;
            expect(scrollAlignEle[1].children[1].classList.contains("e-separator")).toEqual(true);
            expect(scrollAlignEle[0].children[2].classList.contains("e-separator")).toEqual(true);
            expect(toolbar.element.querySelector(".e-toolbar-items").classList.contains("e-tbar-pos")).toEqual(false);
            element.style.width = "auto";
            toolbar.refreshPositioning();
            toolbar.resize();
            expect(toolbar.element.querySelector(".e-toolbar-items").classList.contains("e-tbar-pos")).toEqual(true);
        });
    });
    describe("Alignment Based toolbar item Rendering", () => {
        let toolbar: any;
        document.body.innerHTML = "";
        beforeEach((): void => {
            toolbar = undefined;
            let ele: HTMLElement = createElement("div", { id: "ej2Toolbar" });
            setStyleAttribute(ele, { "display": "block", "white-space": "nowrap", "position": "relative" });
            ele.style.display = "block";
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (toolbar) {
                toolbar.destroy();
            }
            document.body.innerHTML = "";
        });
        it("Without align type toolbar testing", () => {
            let element: HTMLElement = document.getElementById("ej2Toolbar");
            toolbar = new Toolbar({
                overflowMode: "Popup",
                items: [
                    {
                        type: "Button", text: "New Chart Button", overflow: "Show", align: "Center"
                    },
                    {
                        type: "Button", text: "Hii", overflow: "Show",
                    },
                    {
                        type: "Button", text: "UnderlineBtn", overflow: "Show"
                    },
                    {
                        type: "Button", text: "ChartButton", overflow: "Show", align: "Center"
                    },
                    {
                        type: "Button", text: "Next_Prev_Btn", overflow: "Hide"
                    }
                ],
            }, "#ej2Toolbar");
            let tbarAlignEle: NodeList = toolbar.element.querySelector(".e-toolbar-items").children;
            expect(tbarAlignEle.length === 3).toEqual(true);
            expect((<HTMLElement>tbarAlignEle[0]).classList.contains("e-toolbar-left")).toEqual(true);
            expect((<HTMLElement>tbarAlignEle[1]).classList.contains("e-toolbar-center")).toEqual(true);
            expect((<HTMLElement>tbarAlignEle[2]).classList.contains("e-toolbar-right")).toEqual(true);
            expect((<HTMLElement>tbarAlignEle[0]).children.length === 3).toEqual(true);
            expect((<HTMLElement>tbarAlignEle[1]).children.length === 2).toEqual(true);
            expect((<HTMLElement>tbarAlignEle[2]).children.length === 0).toEqual(true);
            element.style.width = "200px";
            toolbar.resize();
            let popupEle: HTMLCollection = toolbar.popObj.element.children;
            expect(popupEle[2].querySelector(".e-tbar-btn-text").textContent).toEqual("Next_Prev_Btn");
            expect(popupEle[1].querySelector(".e-tbar-btn-text").textContent).toEqual("ChartButton");
            expect(popupEle[0].querySelector(".e-tbar-btn-text").textContent).toEqual("New Chart Button");
            expect(toolbar.element.classList.contains("e-toolpop")).toEqual(true);
            expect((<HTMLElement>tbarAlignEle[1]).children.length === 0).toEqual(true);
            expect((<HTMLElement>tbarAlignEle[2]).children.length === 0).toEqual(true);
            expect(toolbar.element.querySelector(".e-toolbar-items").classList.contains("e-tbar-pos")).toEqual(true);
            element.style.width = "330px";
            toolbar.resize();
            expect(popupEle[0].querySelector(".e-tbar-btn-text").textContent === "New Chart Button").toEqual(false);
            expect((<HTMLElement>tbarAlignEle[1]).children.length === 1).toEqual(true);
            expect((<HTMLElement>tbarAlignEle[1]).querySelector(".e-tbar-btn-text").textContent).toEqual("New Chart Button");
        });
    });

    describe("Alignment Based toolbar item Rendering", () => {
        let toolbar: any;
        document.body.innerHTML = "";
        beforeEach((): void => {
            toolbar = undefined;
            let ele: HTMLElement = createElement("div", { id: "ej2Toolbar" });
            setStyleAttribute(ele, { "display": "block", "white-space": "nowrap", "position": "relative" });
            ele.style.display = "block";
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (toolbar) {
                toolbar.destroy();
            }
            document.body.innerHTML = "";
        });
        it("1st item coming with margin in popup mode", () => {
            let element: HTMLElement = document.getElementById("ej2Toolbar");
            toolbar = new Toolbar({
                width: 285,
                overflowMode: "Popup",
                items: [
                    {
                        type: "Button", text: "GridBtn"
                    },
                    {
                        type: "Button", text: "New Chart Button", overflow: 'Show'
                    },
                    {
                        type: "Button", text: "Next_Prev_Btn", overflow: 'Show'
                    }
                ],
            }, "#ej2Toolbar");
            let popupEle: HTMLCollection = toolbar.popObj.element.children;
            expect(popupEle[0].querySelector(".e-tbar-btn-text").textContent).toEqual("GridBtn");
            element.style.width = "380px";
            toolbar.resize();
            expect(toolbar.element.querySelector('.e-toolbar-item .e-tbar-btn-text').textContent).toEqual("GridBtn");

        });
        it("Without align type toolbar testing", () => {
            let element: HTMLElement = document.getElementById("ej2Toolbar");
            toolbar = new Toolbar({
                width: 350,
                overflowMode: "Popup",
                items: [
                    {
                        type: "Button", text: "Hii"
                    },
                    {
                        type: "Button", text: "New Chart Button", overflow: 'Hide'
                    },
                    {
                        type: "Button", text: "UnderlineBtn", align: "Center"
                    },
                    {
                        type: "Button", text: "ChartButton", align: "Center"
                    },
                    {
                        type: "Button", text: "Next_Prev_Btn", overflow: 'Hide'
                    }
                ],
            }, "#ej2Toolbar");
            element.style.width = "250px";
            toolbar.resize();
            let popupEle: HTMLCollection = toolbar.popObj.element.children;
            expect(popupEle[0].querySelector(".e-tbar-btn-text").textContent).toEqual("Next_Prev_Btn");
        });
    });


    describe("On property overflowmode change in alignment based rendering", () => {
        let toolbar: any;
        document.body.innerHTML = "";
        beforeEach((): void => {
            toolbar = undefined;
            let ele: HTMLElement = createElement("div", { id: "ej2Toolbar" });
            setStyleAttribute(ele, { "display": "block", "white-space": "nowrap", "position": "relative" });
            ele.style.display = "block";
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (toolbar) {
                toolbar.destroy();
            }
            document.body.innerHTML = "";
        });
        it("On property  overflowmode change", () => {
            let element: HTMLElement = document.getElementById("ej2Toolbar");
            toolbar = new Toolbar({
                width: 350,
                items: [
                    {
                        type: "Button", text: "GridBtn", overflow: 'Show'
                    },
                    {
                        type: "Button", text: "New Chart Button", overflow: 'Hide', align: 'Right'
                    },
                    {
                        type: "Button", text: "Next_Prev_Btn", overflow: 'Hide', align: 'Right'
                    },
                    {
                        type: "Button", text: "New RibbonBtn", overflow: 'Show'
                    },
                    {
                        type: "Button", text: "UnderlineBtn", overflow: 'Show'
                    },
                ],
            }, "#ej2Toolbar");
            toolbar.overflowMode = 'Scrollable';
            toolbar.dataBind();
            expect(toolbar.element.querySelector('.e-toolbar-items').classList.contains('e-tbar-pos')).toEqual(false);
            toolbar.overflowMode = 'Popup';
            toolbar.dataBind();
            expect(toolbar.element.querySelector('.e-toolbar-items').classList.contains('e-tbar-pos')).toEqual(true);
        });
        it("On property overflowmode change", () => {
            let element: HTMLElement = document.getElementById("ej2Toolbar");
            toolbar = new Toolbar({
                width: 70,
                items: [
                    {
                        type: "Button", text: "GridBtn", overflow: 'Show'
                    },
                    {
                        type: "Button", text: "New Chart Button", overflow: 'Hide', align: 'Right'
                    }
                ],
            }, "#ej2Toolbar");
            toolbar.items = [{
                type: "Button", text: "Next_Prev_Btn", overflow: 'Hide', align: 'Right'
            },
            {
                type: "Button", text: "New RibbonBtn", overflow: 'Show'
            }];
            toolbar.dataBind();
            expect(toolbar.element.querySelector('.e-toolbar-items').classList.contains('e-tbar-pos')).toEqual(false);
        });
    });

    describe("Alignment Based toolbar item Rendering with public method", () => {
        let toolbar: any;
        document.body.innerHTML = "";
        beforeEach((): void => {
            toolbar = undefined;
            let ele: HTMLElement = createElement("div", { id: "ej2Toolbar" });
            setStyleAttribute(ele, { "display": "block", "white-space": "nowrap", "position": "relative" });
            ele.style.display = "block";
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (toolbar) {
                toolbar.destroy();
            }
            document.body.innerHTML = "";
        });
        it("Add Item Public method testing", () => {
            let element: HTMLElement = document.getElementById("ej2Toolbar");
            toolbar = new Toolbar({
                overflowMode: "Popup",
                items: [
                    {
                        type: "Button", text: "GridBtn", overflow: 'Show'
                    },
                    {
                        type: "Button", text: "New Chart Button", overflow: 'Hide', align: 'Center'
                    },
                    {
                        type: "Button", text: "Next_Prev_Btn", overflow: 'Hide', align: 'Center'
                    },
                    {
                        type: "Button", text: "New RibbonBtn", overflow: 'Show', align: 'Center'
                    },
                    {
                        type: "Button", text: "UnderlineBtn", overflow: 'Show', align: 'Right'
                    },
                ],
            }, "#ej2Toolbar");
            toolbar.addItems([{text: 'NewBtn' }], 1);
            expect(toolbar.element.querySelectorAll('.e-tbar-pos .e-toolbar-left .e-tbar-btn-text')[1].textContent).toEqual('NewBtn');
            toolbar.element.style.width = '350px';
            toolbar.resize();
            expect(toolbar.element.querySelector('.e-toolbar-pop').lastElementChild.querySelector('.e-tbar-btn-text').textContent).toEqual('NewBtn');
        });

        it("Add Item Public method testing with multiple Items", () => {
            let element: HTMLElement = document.getElementById("ej2Toolbar");
            toolbar = new Toolbar({
                overflowMode: "Popup",
                items: [
                    {
                        type: "Button", text: "GridBtn", overflow: 'Show'
                    },
                    {
                        type: "Button", text: "New Chart Button", overflow: 'Hide', align: 'Center'
                    },
                    {
                        type: "Button", text: "Next_Prev_Btn", overflow: 'Hide', align: 'Center'
                    },
                    {
                        type: "Button", text: "New RibbonBtn", overflow: 'Show', align: 'Center'
                    },
                    {
                        type: "Button", text: "UnderlineBtn", overflow: 'Show', align: 'Right'
                    },
                ],
            }, "#ej2Toolbar");
            expect(toolbar.tbarAlgEle.lefts.length).toEqual(1);
            expect(toolbar.tbarAlgEle.centers.length).toEqual(3);
            expect(toolbar.tbarAlgEle.rights.length).toEqual(1);
            toolbar.addItems([{ type: 'Button', text: 'NewBtn' }, { type: 'Button', text: 'SecondBtn', align: 'Right' }], 1);
            expect(toolbar.element.querySelectorAll('.e-tbar-pos .e-toolbar-right .e-tbar-btn-text')[1].textContent).toEqual('NewBtn');
            expect(toolbar.element.querySelectorAll('.e-tbar-pos .e-toolbar-right .e-tbar-btn-text')[2].textContent).toEqual('SecondBtn');
            expect(toolbar.tbarAlgEle.lefts.length).toEqual(1);
            expect(toolbar.tbarAlgEle.centers.length).toEqual(3);
            expect(toolbar.tbarAlgEle.rights.length).toEqual(3);
            expect(toolbar.tbarAlgEle.rights[1].querySelector('.e-tbar-btn-text').textContent).toEqual('NewBtn');
            expect(toolbar.tbarAlgEle.rights[2].querySelector('.e-tbar-btn-text').textContent).toEqual('SecondBtn');
            expect(toolbar.element.querySelectorAll('.e-tbar-pos .e-toolbar-center .e-tbar-btn-text')[1].textContent).toEqual('Next_Prev_Btn');
            expect(toolbar.element.querySelectorAll('.e-tbar-pos .e-toolbar-center .e-tbar-btn-text')[2].textContent).toEqual('New RibbonBtn');
            expect(toolbar.element.querySelectorAll('.e-tbar-pos .e-toolbar-center .e-tbar-btn-text')[0].textContent).toEqual('New Chart Button');
            toolbar.addItems([{ type: 'Button', text: 'NewBtnCenter' }, { type: 'Button', text: 'SecondBtnCenter', align: 'Center' }], 1);
            expect(toolbar.tbarAlgEle.lefts.length).toEqual(1);
            expect(toolbar.tbarAlgEle.centers.length).toEqual(5);
            expect(toolbar.tbarAlgEle.rights.length).toEqual(3);
            expect(toolbar.tbarAlgEle.centers[1].querySelector('.e-tbar-btn-text').textContent).toEqual('NewBtnCenter');
            expect(toolbar.tbarAlgEle.centers[2].querySelector('.e-tbar-btn-text').textContent).toEqual('SecondBtnCenter');
            expect(toolbar.element.querySelectorAll('.e-tbar-pos .e-toolbar-center .e-tbar-btn-text')[2].textContent).toEqual('SecondBtnCenter');
            expect(toolbar.element.querySelectorAll('.e-tbar-pos .e-toolbar-center .e-tbar-btn-text')[1].textContent).toEqual('NewBtnCenter');
        });
        it('add items and remove items methode combined', () => {
            let element: HTMLElement = document.getElementById("ej2Toolbar");
            toolbar = new Toolbar({
                overflowMode: "Popup",
                items: [
                    {
                        type: "Button", text: "GridBtn", overflow: 'Show'
                    },
                    {
                        type: "Button", text: "New Chart Button", overflow: 'Hide', align: 'Center'
                    },
                    {
                        type: "Button", text: "Next_Prev_Btn", overflow: 'Hide', align: 'Center'
                    },
                    {
                        type: "Button", text: "New RibbonBtn", overflow: 'Show', align: 'Center'
                    },
                    {
                        type: "Button", text: "UnderlineBtn", overflow: 'Show', align: 'Right'
                    },
                ],
            }, "#ej2Toolbar");
            let ele: Element;
            expect(toolbar.tbarAlgEle.lefts.length).toEqual(1);
            expect(toolbar.tbarAlgEle.centers.length).toEqual(3);
            expect(toolbar.tbarAlgEle.rights.length).toEqual(1);
            toolbar.addItems([{ type: 'Button', text: 'NewBtn' }, { type: 'Button', text: 'SecondBtn', align: 'Right' }], 1);
            expect(toolbar.element.querySelectorAll('.e-tbar-pos .e-toolbar-right .e-tbar-btn-text')[1].textContent).toEqual('NewBtn');
            expect(toolbar.element.querySelectorAll('.e-tbar-pos .e-toolbar-right .e-tbar-btn-text')[2].textContent).toEqual('SecondBtn');
            expect(toolbar.tbarAlgEle.lefts.length).toEqual(1);
            expect(toolbar.tbarAlgEle.centers.length).toEqual(3);
            expect(toolbar.tbarAlgEle.rights.length).toEqual(3);
            expect(toolbar.tbarAlgEle.rights[1].querySelector('.e-tbar-btn-text').textContent).toEqual('NewBtn');
            expect(toolbar.tbarAlgEle.rights[2].querySelector('.e-tbar-btn-text').textContent).toEqual('SecondBtn');
            expect(toolbar.element.querySelectorAll('.e-tbar-pos .e-toolbar-center .e-tbar-btn-text')[1].textContent).toEqual('Next_Prev_Btn');
            expect(toolbar.element.querySelectorAll('.e-tbar-pos .e-toolbar-center .e-tbar-btn-text')[2].textContent).toEqual('New RibbonBtn');
            expect(toolbar.element.querySelectorAll('.e-tbar-pos .e-toolbar-center .e-tbar-btn-text')[0].textContent).toEqual('New Chart Button');
            toolbar.addItems([{ type: 'Button', text: 'NewBtnCenter' }, { type: 'Button', text: 'SecondBtnCenter', align: 'Center' }], 1);
            expect(toolbar.tbarAlgEle.lefts.length).toEqual(1);
            expect(toolbar.tbarAlgEle.centers.length).toEqual(5);
            expect(toolbar.tbarAlgEle.rights.length).toEqual(3);
            expect(toolbar.tbarAlgEle.centers[1].querySelector('.e-tbar-btn-text').textContent).toEqual('NewBtnCenter');
            expect(toolbar.tbarAlgEle.centers[2].querySelector('.e-tbar-btn-text').textContent).toEqual('SecondBtnCenter');
            expect(toolbar.element.querySelectorAll('.e-tbar-pos .e-toolbar-center .e-tbar-btn-text')[2].textContent).toEqual('SecondBtnCenter');
            expect(toolbar.element.querySelectorAll('.e-tbar-pos .e-toolbar-center .e-tbar-btn-text')[1].textContent).toEqual('NewBtnCenter');
            toolbar.removeItems(toolbar.element.querySelector('.e-toolbar-item'));
            expect(toolbar.tbarAlgEle.lefts.length).toEqual(0);
            expect(toolbar.tbarEle[0].querySelector('button .e-tbar-btn-text').textContent === 'GridBtn').toEqual(false);
            expect(toolbar.element.querySelector('.e-toolbar-item button .e-tbar-btn-text').textContent).toEqual('New Chart Button');
            expect(toolbar.tbarEle[0].querySelector('button .e-tbar-btn-text').textContent === 'NewBtnCenter').toEqual(true);
            toolbar.removeItems(toolbar.element.querySelector('.e-toolbar-item'));
            expect(toolbar.tbarAlgEle.lefts.length).toEqual(0);
            expect(toolbar.tbarEle[0].querySelector('button .e-tbar-btn-text').textContent === 'GridBtn').toEqual(false);
            expect(toolbar.tbarEle[0].querySelector('button .e-tbar-btn-text').textContent === 'NewBtnCenter').toEqual(true);
            ele = toolbar.element.querySelector('.e-toolbar-item');
            expect(ele.querySelector('button .e-tbar-btn-text').textContent).toEqual('NewBtnCenter');
            expect(toolbar.tbarEle[0].querySelector('button .e-tbar-btn-text').textContent).toEqual('NewBtnCenter');
            toolbar.removeItems(ele);
            expect(toolbar.tbarEle[0].querySelector('button .e-tbar-btn-text').textContent === 'NewBtnCenter').toEqual(false);
            expect(toolbar.tbarEle[0].querySelector('button .e-tbar-btn-text').textContent === 'SecondBtnCenter').toEqual(true);
            ele = toolbar.element.querySelector('.e-toolbar-item');
            expect(ele.querySelector('button .e-tbar-btn-text').textContent).toEqual('SecondBtnCenter');
            expect(toolbar.tbarAlgEle.centers.length).toEqual(3);
        });
        it("Add Item Public method testing with remove Items", () => {
            let element: HTMLElement = document.getElementById("ej2Toolbar");
            toolbar = new Toolbar({
                overflowMode: "Popup",
                items: [
                    {
                        type: "Button", text: "GridBtn", overflow: 'Show'
                    },
                    {
                        type: "Button", text: "New Chart Button", overflow: 'Hide', align: 'Center'
                    },
                    {
                        type: "Button", text: "Next_Prev_Btn", overflow: 'Hide', align: 'Center'
                    },
                    {
                        type: "Button", text: "New RibbonBtn", overflow: 'Show', align: 'Center'
                    },
                    {
                        type: "Button", text: "UnderlineBtn", overflow: 'Show', align: 'Right'
                    },
                ],
            }, "#ej2Toolbar");
            expect(toolbar.tbarAlgEle.lefts.length).toEqual(1);
            expect(toolbar.tbarAlgEle.centers.length).toEqual(3);
            expect(toolbar.tbarAlgEle.rights.length).toEqual(1);
            toolbar.removeItems(1);
            expect(toolbar.tbarAlgEle.centers.length).toEqual(2);
            toolbar.removeItems(toolbar.element.querySelector('.e-toolbar-item') as HTMLElement);
            expect(toolbar.tbarAlgEle.lefts.length).toEqual(0);
            expect(toolbar.element.querySelector('.e-tbar-pos .e-toolbar-left').children.length).toEqual(0);
            expect(toolbar.tbarAlgEle.centers[1].querySelector('.e-tbar-btn-text').textContent === 'NewBtnCenter').toEqual(false);
            toolbar.addItems([{ type: 'Button', text: 'NewBtn' }, { type: 'Button', text: 'SecondBtn', align: 'Right' }], 7);
            toolbar.addItems([{ type: 'Button', text: 'NewBtnCenter' }, { type: 'Button', text: 'SecondBtnCenter', align: 'Center' }], 6);
            expect(toolbar.tbarAlgEle.lefts.length).toEqual(0)
            expect(toolbar.tbarAlgEle.centers.length).toEqual(2);
            expect(toolbar.tbarAlgEle.rights.length).toEqual(1);
        });

        it("Add Item Public method testing with add Items with scrollable", () => {
            let element: HTMLElement = document.getElementById("ej2Toolbar");
            toolbar = new Toolbar({
                width: 300,
                items: [
                    {
                        type: "Button", text: "GridBtn", overflow: 'Show'
                    },
                    {
                        type: "Button", text: "New Chart Button", overflow: 'Hide', align: 'Center'
                    },
                    {
                        type: "Button", text: "Next_Prev_Btn", overflow: 'Hide', align: 'Center'
                    },
                    {
                        type: "Button", text: "New RibbonBtn", overflow: 'Show', align: 'Center'
                    },
                    {
                        type: "Button", text: "UnderlineBtn", overflow: 'Show', align: 'Right'
                    },
                ],
            }, "#ej2Toolbar");
            toolbar.addItems([{ type: 'Button', text: 'NewBtn' }, { type: 'Button', text: 'SecondBtn', align: 'Right' }], 1);
            expect(toolbar.tbarAlgEle.lefts.length).toEqual(1);
            expect(toolbar.tbarAlgEle.centers.length).toEqual(3);
            expect(toolbar.tbarAlgEle.rights.length).toEqual(3);
        });
    });

    describe("Keyboard Interaction testing with alignment based rendering", () => {
        let toolbar: any;
        let keyEventArgs: any;
        document.body.innerHTML = "";
        beforeEach((): void => {
            toolbar = undefined;
            let ele: HTMLElement = createElement("div", { id: "ej2Toolbar" });
            setStyleAttribute(ele, { "display": "block", "white-space": "nowrap", "position": "relative" });
            ele.style.display = "block";
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (toolbar) {
                toolbar.destroy();
            }
            document.body.innerHTML = "";
        });
        it("Keyboard Interaction left key testing", () => {
            let element: HTMLElement = document.getElementById("ej2Toolbar");
            toolbar = new Toolbar({
                overflowMode: "Popup",
                items: [
                    {
                        type: "Button", text: "GridBtn", overflow: 'Show'
                    },
                    {
                        type: "Button", text: "New Chart Button", overflow: 'Hide', align: 'Center'
                    },
                    {
                        type: "Button", text: "Next_Prev_Btn", overflow: 'Hide', align: 'Center'
                    },
                    {
                        type: "Button", text: "New RibbonBtn", overflow: 'Show', align: 'Right'
                    },
                    {
                        type: "Button", text: "UnderlineBtn", overflow: 'Show', align: 'Right'
                    },
                ],
            }, "#ej2Toolbar");
            keyEventArgs = {
                preventDefault: function () { },
                action: 'moveLeft',
                target: toolbar.element.querySelectorAll('.e-toolbar-item')[3],
            };
            element.focus();
            toolbar.keyActionHandler(keyEventArgs);
            expect(document.activeElement.children[0].innerHTML).toEqual('Next_Prev_Btn');
            keyEventArgs = {
                preventDefault: function () { },
                action: 'moveRight',
                target: toolbar.element.querySelectorAll('.e-toolbar-item')[2],
            };
            element.focus();
            toolbar.keyActionHandler(keyEventArgs);
            expect(document.activeElement.children[0].innerHTML).toEqual('New RibbonBtn');
        });
        it("Keyboard Interaction left key testing", () => {
            let element: HTMLElement = document.getElementById("ej2Toolbar");
            toolbar = new Toolbar({
                items: [
                    {
                        type: "Button", text: "GridBtn", overflow: 'Show'
                    },
                    {
                        type: "Button", text: "New Chart Button", overflow: 'Hide', align: 'Center'
                    },
                    {
                        type: "Button", text: "Next_Prev_Btn", overflow: 'Hide', align: 'Center'
                    },
                    {
                        type: "Button", text: "New RibbonBtn", overflow: 'Show', align: 'Right'
                    },
                    {
                        type: "Button", text: "UnderlineBtn", overflow: 'Show', align: 'Right'
                    },
                ],
            }, "#ej2Toolbar");
            (<HTMLElement>toolbar.element.querySelectorAll('.e-toolbar-item')[0].children[0]).click();
            keyEventArgs = {
                preventDefault: function () { },
                action: 'moveLeft',
                target: toolbar.element.querySelectorAll('.e-toolbar-item')[0],
            };
            toolbar.keyActionHandler(keyEventArgs);
            expect(document.activeElement ===  toolbar.element.querySelectorAll('.e-toolbar-item')[0].children[0]).toEqual(true);
            keyEventArgs = {
                preventDefault: function () { },
                action: 'moveRight',
                target: toolbar.element.querySelectorAll('.e-toolbar-item')[4],
            };
            toolbar.keyActionHandler(keyEventArgs);
            expect(document.activeElement === toolbar.element.querySelectorAll('.e-toolbar-item')[4].children[0] ).toEqual(false);

        });
        it("Keyboard Interaction left key and right testing", () => {
            let element: HTMLElement = document.getElementById("ej2Toolbar");
            toolbar = new Toolbar({
                width: 350,
                overflowMode: "Popup",
                items: [
                    {
                        type: "Button", text: "GridBtn", overflow: 'Show'
                    },
                    {
                        type: "Button", text: "New Chart Button", overflow: 'Hide', align: 'Center'
                    },
                    {
                        type: "Button", text: "Next_Prev_Btn", overflow: 'Hide', align: 'Center'
                    },
                    {
                        type: "Button", text: "New RibbonBtn", overflow: 'Show', align: 'Right'
                    },
                    {
                        type: "Button", text: "UnderlineBtn", overflow: 'Show', align: 'Right'
                    },
                ],
            }, "#ej2Toolbar");
            (<HTMLElement>toolbar.element.querySelectorAll('.e-toolbar-item')[0].firstChild).click();
            keyEventArgs = {
                preventDefault: function () { },
                action: 'moveLeft',
                target: document.activeElement
            };
            toolbar.keyActionHandler(keyEventArgs);
            expect(document.activeElement === toolbar.element.querySelectorAll('.e-toolbar-item')[0].children[0]).toEqual(true);
            (<HTMLElement>toolbar.element.querySelectorAll('.e-toolbar-item')[2].firstChild).click();
            keyEventArgs = {
                preventDefault: function () { },
                action: 'moveRight',
                target: toolbar.element.querySelectorAll('.e-toolbar-item')[2],
            };
            toolbar.keyActionHandler(keyEventArgs);
            expect(document.activeElement === toolbar.element.querySelectorAll('.e-toolbar-item')[2].children[0]).toEqual(true);
            (<HTMLElement>toolbar.element.querySelectorAll('.e-hor-nav')[0]).focus();
            keyEventArgs = {
                preventDefault: function () { },
                action: 'moveRight',
                target: toolbar.element.querySelectorAll('.e-hor-nav')[0],
            };
            toolbar.keyActionHandler(keyEventArgs);
            expect(document.activeElement === toolbar.element.querySelectorAll('.e-hor-nav')[0]).toEqual(true);
            keyEventArgs = {
                preventDefault: function () { },
                action: 'moveLeft',
                target: document.activeElement,
            };
            toolbar.keyActionHandler(keyEventArgs);
            expect(document.activeElement === toolbar.element.querySelectorAll('.e-hor-nav')[0]).toEqual(true);
        });
    });

    describe("Alignment Based toolbar item Rendering with 1st item margin", () => {
        let toolbar: any;
        document.body.innerHTML = "";
        beforeEach((): void => {
            toolbar = undefined;
            let ele: HTMLElement = createElement("div", { id: "ej2Toolbar" });
            setStyleAttribute(ele, { "display": "block", "white-space": "nowrap", "position": "relative" });
            ele.style.display = "block";
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (toolbar) {
                toolbar.destroy();
            }
            document.body.innerHTML = "";
        });
        it("1st item coming with margin in popup mode", () => {
            let element: HTMLElement = document.getElementById("ej2Toolbar");
            toolbar = new Toolbar({
                width: 350,
                overflowMode: "Popup",
                items: [
                    {
                        type: "Button", text: "GridBtn", overflow: 'Show'
                    },
                    {
                        type: "Button", text: "New Chart Button", overflow: 'Hide', align: 'Right'
                    },
                    {
                        type: "Button", text: "Next_Prev_Btn", overflow: 'Hide', align: 'Right'
                    },
                    {
                        type: "Button", text: "New RibbonBtn", overflow: 'Show'
                    },
                    {
                        type: "Button", text: "UnderlineBtn", overflow: 'Show'
                    },
                ],
            }, "#ej2Toolbar");
            let popupEle: HTMLCollection = toolbar.popObj.element.children;
            element.style.width = "auto";
            toolbar.resize();
        });
        it("1st item coming with margin in popup mode", () => {
            let element: HTMLElement = document.getElementById("ej2Toolbar");
            toolbar = new Toolbar({
                width: 200,
                overflowMode: "Popup",
                items: [
                    {
                        type: "Button", text: "GridBtn", overflow: 'Hide'
                    },
                    {
                        type: "Button", text: "New Chart Button", overflow: 'Show', align: 'Right'
                    },
                    {
                        type: "Button", text: "Next_Prev_Btn", overflow: 'Hide', align: 'Right'
                    }
                ],
            }, "#ej2Toolbar");
            let popupEle: HTMLCollection = toolbar.popObj.element.children;
            element.style.width = "400px";
            toolbar.resize();
            element.style.width = "700px";
            toolbar.resize();
        });
    });


    describe('Left and Right key navigaton testcases', () => {
        let toolbar: any;
        let keyEventArgs: any;
        beforeEach((): void => {
            toolbar = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Toolbar' });
            setStyleAttribute(ele, { 'display': 'block', 'white-space': 'nowrap', 'position': 'relative' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (toolbar) {
                toolbar.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Right key testing with popup arrow selection and popup opening', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                width: 100,
                overflowMode: 'Popup',
                items: [
                    { type: 'Button', text: 'New', htmlAttributes: { 'role': 'Toolbar' } },
                    { type: 'Button', text: 'Underline', htmlAttributes: { 'role': 'Toolbar' } },
                    {
                        type: 'Button', text: 'Bold', htmlAttributes: { 'role': 'Toolbar' }
                    }
                ]
            });
            toolbar.appendTo('#ej2Toolbar');
            (<HTMLElement>toolbar.element.querySelector('.e-toolbar-items').lastElementChild.children[0]).click();
            keyEventArgs = {
                preventDefault: function () { },
                action: 'moveRight',
                target: toolbar.element.querySelector('.e-toolbar-items').lastElementChild
            };
            toolbar.keyActionHandler(keyEventArgs);
            expect(document.activeElement === toolbar.element.querySelector('.e-toolbar-items').lastElementChild.children[0]).toBe(true);
            keyEventArgs = {
                preventDefault: function () { },
                action: 'moveLeft',
                target: document.activeElement
            };
            toolbar.keyActionHandler(keyEventArgs);
            expect(document.activeElement.parentElement === toolbar.element.querySelector('.e-toolbar-items').lastElementChild).toBe(true);
            toolbar.width = 'auto'; toolbar.dataBind();
            keyEventArgs = {
                preventDefault: function () { },
                action: 'popupClose',
                target: toolbar.element.querySelector('.e-toolbar-items').lastElementChild
            };
            toolbar.keyActionHandler(keyEventArgs);
        });
        it('Right key testing with popup arrow selection', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                overflowMode: 'Popup',
                items: [
                    { type: 'Button', text: 'New', htmlAttributes: { 'role': 'Toolbar' } },
                    { type: 'Button', text: 'Underline', htmlAttributes: { 'role': 'Toolbar' } },
                    {
                        type: 'Button', text: 'Bold', htmlAttributes: { 'role': 'Toolbar' }
                    }
                ]
            });
            toolbar.appendTo('#ej2Toolbar');
            keyEventArgs = {
                preventDefault: function () { },
                action: 'popupClose',
                target: toolbar.element.querySelector('.e-toolbar-items').lastElementChild
            };
            toolbar.keyActionHandler(keyEventArgs);
        });

    });

    describe('Alignment positioning testing', () => {
        let toolbar: any;
        let keyEventArgs: any;
        beforeEach((): void => {
            toolbar = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Toolbar' });
            setStyleAttribute(ele, { 'display': 'block', 'white-space': 'nowrap', 'position': 'relative' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (toolbar) {
                toolbar.destroy();
            }
            document.body.innerHTML = '';
        });

        it('alaingment positioning remove and adding testing', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                items: [
                    { type: 'Button', text: 'New', htmlAttributes: { 'role': 'Toolbar' } },
                    { type: 'Button', text: 'Underline', htmlAttributes: { 'role': 'Toolbar' }, align: 'Center' },
                    {
                        type: 'Button', text: 'Bold', htmlAttributes: { 'role': 'Toolbar', align: 'Right' }
                    }
                ]
            });
            toolbar.appendTo('#ej2Toolbar');
            let items: HTMLElement = element.querySelector('.e-toolbar-items') as HTMLElement;
            expect(items.classList.contains('e-tbar-pos')).toBe(true);
            toolbar.removePositioning();
            expect(items.classList.contains('e-tbar-pos')).toBe(false);
            toolbar.removePositioning();
            toolbar.refreshPositioning();
            expect(items.classList.contains('e-tbar-pos')).toBe(true);
        });
    });


    describe('Toolbar resizing with alignment Positioning.', () => {
        let toolbar: any;
        beforeEach((): void => {
            toolbar = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Toolbar' });
            setStyleAttribute(ele, { 'display': 'block', 'white-space': 'nowrap', 'position': 'relative' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (toolbar) {
                toolbar.destroy();
            }
            document.body.innerHTML = '';
        });

        it('alignment positioning remove and adding testing', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                overflowMode: 'Popup',
                width: 200,
                items: [
                    {
                        type: 'Button', text: 'btn0', overflow: 'Show'
                    },
                    {
                        type: 'Separator'
                    },
                    {
                        type: 'Button', text: 'btn1', overflow: 'Show'
                    },
                    {
                        type: 'Separator'
                    },
                    {
                        type: 'Separator'
                    },
                    {
                        type: 'Button', text: 'btn2', overflow: 'Show',
                    },
                    {
                        type: 'Separator'
                    },
                    {
                        type: 'Separator'
                    },
                    {
                        type: 'Button', prefixIcon: 'e-btn-icon', text: 'btn3', overflow: 'Show',
                    },
                    {
                        type: 'Separator'
                    },
                    {
                        type: 'Separator'
                    },
                    {
                        type: 'Separator'
                    },
                    {
                        type: 'Button', text: 'btn4', overflow: 'Show',
                    }, {
                        type: 'Button', text: 'btn5', overflow: 'Hide'
                    }, {
                        type: 'Separator'
                    },
                    {
                        type: 'Separator'
                    }, {
                        type: 'Button', text: 'btn6', overflow: 'Show'
                    }
                ]
            });
            toolbar.appendTo('#ej2Toolbar');
            let items: HTMLElement = element.querySelector('.e-toolbar-items') as HTMLElement;
            element.style.width = '310px';
            toolbar.resize();
            expect(items.children[0].classList.contains('e-toolbar-item')).toBe(true);
            expect((items.children[0].querySelector('button .e-tbar-btn-text') as HTMLElement).textContent).toBe('btn0')
            expect(items.children[1].classList.contains('e-separator')).toBe(true);
            expect(items.children[2].classList.contains('e-toolbar-item')).toBe(true);
            expect((items.children[2].querySelector('button .e-tbar-btn-text') as HTMLElement).textContent).toBe('btn1')
            expect(items.children[3].classList.contains('e-separator')).toBe(true);
            expect(items.children[4].classList.contains('e-separator')).toBe(true);
            expect(items.children[5].classList.contains('e-toolbar-item')).toBe(true);
            expect((items.children[5].querySelector('button .e-tbar-btn-text') as HTMLElement).textContent).toBe('btn2');
            expect(items.children[6].classList.contains('e-separator')).toBe(true);
            expect(items.children[7].classList.contains('e-separator')).toBe(true);
            expect(items.children[8].classList.contains('e-toolbar-item')).toBe(true);
            expect((items.children[8].querySelector('button .e-tbar-btn-text') as HTMLElement).textContent).toBe('btn3');
            expect(items.children[9].classList.contains('e-separator')).toBe(true);
            expect(items.children[10].classList.contains('e-separator')).toBe(true);
            expect(items.children[11].classList.contains('e-separator')).toBe(true);
            expect(items.children[12].classList.contains('e-toolbar-item')).toBe(true);
            expect((items.children[12].querySelector('button .e-tbar-btn-text') as HTMLElement).textContent).toBe('btn4')
            expect(items.children[13].classList.contains('e-separator')).toBe(true);
            expect(items.children[14].classList.contains('e-separator')).toBe(true);
        });
    });

    describe('Click Event Args Testing', () => {
        let toolbar: any;
        beforeEach((): void => {
            toolbar = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Toolbar' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (toolbar) {
                toolbar.destroy();
            }
            document.body.innerHTML = '';
        });
        function clickfn(e: ClickEventArgs): void {
            toolbar.clickArgs = e;
            if (!toolbar.clickCount) {
                toolbar.clickCount = 1;
            } else {
                toolbar.clickCount++;
            }
        }
        it('Click Event function argument after Refresh testing', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                clicked: clickfn,
                items: [
                    {
                        type: 'Button', text: 'Hii', overflow: 'Show',
                    },
                    {
                        type: 'Separator'
                    },
                    {
                        type: 'Button', text: 'New Chart Button', overflow: 'Hide'
                    },
                    {
                        type: 'Button', text: 'UnderlineBtn', overflow: 'Show'
                    },
                    {
                        type: 'Separator'
                    },
                    {
                        type: 'Button', text: 'ChartButton', overflow: 'Hide'
                    },
                    {
                        type: 'Button', prefixIcon: 'e-btn-icon', overflow: 'Show',
                    }
                ],
            }, '#ej2Toolbar');
            let ele: HTMLElement = <HTMLElement>element.querySelectorAll('.e-toolbar-items .e-toolbar-item')[0]
            ele.click();
            expect(toolbar.clickArgs.name).toBe('clicked');
            expect(toolbar.clickArgs.originalEvent.target.classList.contains('e-toolbar-item')).toBe(true);
            expect(toolbar.clickArgs.originalEvent.target.querySelector('.e-tbar-btn-text').textContent).toBe('Hii');
            expect(toolbar.clickArgs.item.text).toBe('Hii');
            expect(toolbar.clickArgs.item.align).toBe('Left');
            toolbar.items[3].align = 'Right';
            toolbar.refresh();
            ele = <HTMLElement>element.querySelectorAll('.e-toolbar-items .e-toolbar-item')[5];
            ele.click();
            expect(toolbar.clickArgs.item.text).toBe('');
            expect(toolbar.clickArgs.item.prefixIcon).toBe('e-btn-icon');
            expect(toolbar.clickArgs.item.align).toBe('Left');
            ele = <HTMLElement>element.querySelectorAll('.e-toolbar-items .e-toolbar-item')[6];
            ele.click();
            expect(toolbar.clickArgs.item.text).toBe('UnderlineBtn');
            expect(toolbar.clickArgs.item.align).toBe('Right');
        });
        it('Click Event function argument testing', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                clicked: clickfn,
                items: [
                    {
                        type: 'Button', text: 'Hii', overflow: 'Show',
                    },
                    {
                        type: 'Separator'
                    },
                    {
                        type: 'Button', text: 'New Chart Button', overflow: 'Hide', align: 'Right'
                    },
                    {
                        type: 'Button', text: 'UnderlineBtn', overflow: 'Show', align: 'Center'
                    },
                    {
                        type: 'Separator'
                    },
                    {
                        type: 'Button', text: 'ChartButton', overflow: 'Hide', align: 'Left'
                    },
                    {
                        type: 'Button', prefixIcon: 'e-btn-icon', overflow: 'Show',
                    }
                ],
            }, '#ej2Toolbar');
            let ele: HTMLElement = <HTMLElement>element.querySelectorAll('.e-toolbar-items .e-toolbar-item')[0]
            ele.click();
            expect(toolbar.clickArgs.name).toBe('clicked');
            expect(toolbar.clickArgs.originalEvent.target.classList.contains('e-toolbar-item')).toBe(true);
            expect(toolbar.clickArgs.originalEvent.target.querySelector('.e-tbar-btn-text').textContent).toBe('Hii');
            expect(toolbar.clickArgs.item.text).toBe('Hii');
            expect(toolbar.clickArgs.item.align).toBe('Left');
            ele = <HTMLElement>element.querySelectorAll('.e-toolbar-items .e-toolbar-item')[6];
            ele.click();
            expect(toolbar.clickArgs.originalEvent.target.classList.contains('e-toolbar-item')).toBe(true);
            expect(toolbar.clickArgs.originalEvent.target.querySelector('.e-tbar-btn-text').textContent).toBe('New Chart Button');
            expect(toolbar.clickArgs.item.text).toBe('New Chart Button');
            expect(toolbar.clickArgs.item.align).toBe('Right');
            toolbar.addItems([{ type: 'Button', text: 'ChartButton2', overflow: 'Hide', align: 'Center' }], 1);
            expect(toolbar.items.length).toBe(8);
            expect(element.querySelectorAll('.e-toolbar-item').length).toBe(8);
            ele = <HTMLElement>element.querySelectorAll('.e-toolbar-center .e-toolbar-item')[1];
            ele.click();
            expect(toolbar.clickArgs.originalEvent.target.querySelector('.e-tbar-btn-text').textContent).toBe('ChartButton2');
            expect(toolbar.clickArgs.item.text).toBe('ChartButton2');
            expect(toolbar.clickArgs.item.align).toBe('Center');
            toolbar.addItems([{ type: 'Button', text: 'RightButton', overflow: 'Hide', align: 'Right' }], 1);
            expect(toolbar.items.length).toBe(9);
            expect(element.querySelectorAll('.e-toolbar-item').length).toBe(9);
            ele = <HTMLElement>element.querySelectorAll('.e-toolbar-right .e-toolbar-item')[1];
            ele.click();
            expect(toolbar.clickArgs.originalEvent.target.querySelector('.e-tbar-btn-text').textContent).toBe('RightButton');
            expect(toolbar.clickArgs.item.text).toBe('RightButton');
            expect(toolbar.clickArgs.item.align).toBe('Right');
            toolbar.addItems([{ type: 'Button', text: 'CenterButton', overflow: 'Hide', align: 'Center' }], 0);
            expect(toolbar.items.length).toBe(10);
            expect(element.querySelectorAll('.e-toolbar-item').length).toBe(10);
            ele = <HTMLElement>element.querySelectorAll('.e-toolbar-center .e-toolbar-item')[0];
            ele.click();
            expect(toolbar.clickArgs.originalEvent.target.querySelector('.e-tbar-btn-text').textContent).toBe('CenterButton');
            expect(toolbar.clickArgs.item.text).toBe('CenterButton');
            expect(toolbar.clickArgs.item.align).toBe('Center');
            ele = <HTMLElement>element.querySelectorAll('.e-toolbar-center .e-toolbar-item')[1];
            ele.click();
            expect(toolbar.clickArgs.originalEvent.target.querySelector('.e-tbar-btn-text').textContent).toBe('UnderlineBtn');
            expect(toolbar.clickArgs.item.text).toBe('UnderlineBtn');
            expect(toolbar.clickArgs.item.align).toBe('Center');
            ele = <HTMLElement>element.querySelectorAll('.e-toolbar-center .e-toolbar-item')[0];
            toolbar.enableItems(ele, false);
        });

        it('Prevent focusing in Disabled items in key board', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            let keyEventArgs: any;
            toolbar = new Toolbar({
                clicked: clickfn,
                items: [
                    {
                        type: 'Button', text: 'Hii', overflow: 'Show',
                    },
                    {
                        type: 'Separator'
                    },
                    {
                        type: 'Button', text: 'New Chart Button', overflow: 'Hide', align: 'Right'
                    },
                    {
                        type: 'Button', text: 'UnderlineBtn', overflow: 'Show', align: 'Center'
                    },
                    {
                        type: 'Separator'
                    },
                    {
                        type: 'Button', text: 'ChartButton', overflow: 'Hide', align: 'Left'
                    },
                    {
                        type: 'Button', prefixIcon: 'e-btn-icon', overflow: 'Show', text: 'LeftButton'
                    }
                ],
            }, '#ej2Toolbar');
            toolbar.enableItems(element.querySelectorAll('.e-toolbar-item')[2], false);
            expect(element.querySelectorAll('.e-toolbar-item')[2].getAttribute("aria-disabled")).toBe('true');
            keyEventArgs = {
                preventDefault: function () { },
                action: 'moveRight',
                target: toolbar.element.querySelector('.e-toolbar-item'),
            };
            toolbar.keyActionHandler(keyEventArgs);
            expect(document.activeElement.children[0].innerHTML).toEqual('ChartButton');
            toolbar.enableItems(element.querySelectorAll('.e-toolbar-item')[3], false);
            expect(element.querySelectorAll('.e-toolbar-item')[3].getAttribute("aria-disabled")).toBe('true');
            toolbar.keyActionHandler(keyEventArgs);
            expect(document.activeElement.children[1].innerHTML).toEqual('LeftButton');
            toolbar.enableItems(element.querySelectorAll('.e-toolbar-item')[3], true);
            expect(element.querySelectorAll('.e-toolbar-item')[3].getAttribute("aria-disabled")).toBe('false');
            toolbar.enableItems(element.querySelectorAll('.e-toolbar-item')[2], true);
            expect(element.querySelectorAll('.e-toolbar-item')[2].getAttribute("aria-disabled")).toBe('false');
            toolbar.enableItems(element.querySelectorAll('.e-toolbar-item')[5], false);
            expect(element.querySelectorAll('.e-toolbar-item')[5].getAttribute("aria-disabled")).toBe('true');
            keyEventArgs = {
                preventDefault: function () { },
                action: 'moveRight',
                target: toolbar.element.querySelectorAll('.e-toolbar-left .e-toolbar-item')[4],
            };
            toolbar.keyActionHandler(keyEventArgs);
            expect(document.activeElement.children[0].innerHTML).toEqual('New Chart Button');
            keyEventArgs = {
                preventDefault: function () { },
                action: 'moveLeft',
                target: toolbar.element.querySelectorAll('.e-toolbar-item')[6],
            };
            toolbar.keyActionHandler(keyEventArgs);
            expect(document.activeElement.children[1].innerHTML).toEqual('LeftButton');
            toolbar.enableItems(element.querySelectorAll('.e-toolbar-item')[4], false);
            keyEventArgs = {
                preventDefault: function () { },
                action: 'moveLeft',
                target: toolbar.element.querySelectorAll('.e-toolbar-item')[6],
            };
            toolbar.keyActionHandler(keyEventArgs);
            expect(document.activeElement.children[0].innerHTML).toEqual('ChartButton');
        });
    });
    //Toolbar Duplication item testing for private variables.
    describe('Duplication issue fix testing', () => {
        let toolbar: any;
        beforeEach((): void => {
            toolbar = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Toolbar' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (toolbar) {
                toolbar.destroy();
            }
            document.body.innerHTML = '';
        });
        it('private variable Testing in Onproperty chage', () => {
            let element: HTMLElement = document.getElementById("ej2Toolbar");
            toolbar = new Toolbar({
                width: 350,
                overflowMode: "Popup",
                items: [
                    {
                        type: "Button", text: "GridBtn", overflow: 'Show'
                    },
                    {
                        type: "Button", text: "New Chart Button", overflow: 'Hide', align: 'Right'
                    }
                ],
            }, "#ej2Toolbar");
            expect(toolbar.items.length).toBe(2);
            expect(toolbar.tbarEle.length).toBe(2);
            toolbar.items = [{
                        type: "Button", text: "New RibbonBtn", overflow: 'Show'
                    },
                    {
                        type: "Button", text: "UnderlineBtn", overflow: 'Show', align: 'Right'
                    },
                    {
                       text: "New Chart Button", overflow: 'Hide'
                    }];
            toolbar.dataBind();
            expect(toolbar.items.length).toBe(3);
            expect(toolbar.tbarEle.length).toBe(3);
        });
        it('Duplication issue in private variable', () => {
            let element: HTMLElement = document.getElementById("ej2Toolbar");
            toolbar = new Toolbar({
                width: 350,
                overflowMode: "Popup",
                items: [
                    {
                        type: "Button", text: "GridBtn", overflow: 'Show'
                    },
                    {
                        type: "Button", text: "New Chart Button", overflow: 'Hide', align: 'Right'
                    },
                    {
                        type: "Button", text: "Next_Prev_Btn", overflow: 'Hide', align: 'Right'
                    },
                    {
                        type: "Button", text: "New RibbonBtn", overflow: 'Show'
                    },
                    {
                        type: "Button", text: "UnderlineBtn", overflow: 'Show'
                    },
                ],
            }, "#ej2Toolbar");
            expect(toolbar.items.length).toBe(5);
            expect(toolbar.tbarEle.length).toBe(5);
        });
        it('Duplication issue in private variable', () => {
            let element: HTMLElement = document.getElementById("ej2Toolbar");
            toolbar = new Toolbar({
                width: 350,
                overflowMode: "Popup",
                items: [
                    {
                        type: "Button", text: "GridBtn", overflow: 'Show'
                    },
                    {
                        type: "Button", text: "New Chart Button", overflow: 'Hide', align: 'Right'
                    },
                    {
                        template: '<div class="e-input-group"><input placeholder="Search"></input></div>'
                    },
                    {
                        type: "Button", text: "New RibbonBtn", overflow: 'Show'
                    },
                    {
                        type: "Button", text: "UnderlineBtn", overflow: 'Show'
                    },
                ],
            }, "#ej2Toolbar");
            expect(toolbar.items.length).toBe(5);
            expect(toolbar.tbarEle.length).toBe(5);
        });
    });
    describe('Template Toolbar Testing with div keyboard interaction', () => {
        let toolbar: any;
        let keyEventArgs: any;
        document.body.innerHTML = '';
        beforeEach((): void => {
            toolbar = undefined;
            document.body.innerHTML = '';
            let ele: HTMLElement = createElement('div', { id: 'ej2Toolbar' });
            let innerEle: HTMLElement = createElement('div');
            let innerOfEle: HTMLElement = createElement('div', {id: 'InnerOfEle'});
            innerOfEle.setAttribute('tabindex', '0' );
            innerOfEle.innerHTML = 'ChildElement'
            let innerEle1: HTMLElement = createElement('div');
            let innerEle_1: HTMLElement = createElement('div', { className: 'e-toolbar-item', id: 'e-itemID' });
            innerEle_1.setAttribute('tabindex', '0' );
            let innerEle_: HTMLElement = createElement('div');
            innerEle_.appendChild(innerOfEle);
            innerEle.appendChild(innerEle_);
            innerEle.appendChild(innerEle_1);
            ele.appendChild(innerEle);
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (toolbar) {
                toolbar.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Template Toolbar Testing keyboard interaction', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({}, '#ej2Toolbar');
            keyEventArgs = {
                preventDefault: function () { },
                action: 'moveRight',
                target: toolbar.element.querySelector('.e-toolbar-item'),
            };
            expect(element.classList.contains('e-keyboard')).toEqual(true);
            toolbar.keyActionHandler(keyEventArgs);
            expect(document.activeElement.id === 'e-itemID').toBe(true);
            keyEventArgs = {
                preventDefault: function () { },
                action: 'moveLeft',
                target: document.activeElement,
            };
            toolbar.keyActionHandler(keyEventArgs);
            expect(document.activeElement.id === 'InnerOfEle').toBe(true);
        });
    });

    describe('Item Template Toolbar Testing keyboard interaction', () => {
        let toolbar: any;
        let keyEventArgs: any;
        beforeEach((): void => {
            toolbar = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Toolbar' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (toolbar) {
                toolbar.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Duplication issue in private variable', () => {
            let element: HTMLElement = document.getElementById("ej2Toolbar");
            toolbar = new Toolbar({
                items: [
                    {
                        type: "Button", text: "GridBtn", overflow: 'Show'
                    },
                    {
                        type: "Button", text: "New Chart Button", overflow: 'Hide', template: ' <div id ="e-itemTemplate" tabindex="0" >Hii</div>'
                    },
                    {
                        type: "Button", text: "Next_Prev_Btn", overflow: 'Hide'
                    },
                    {
                        type: "Button", text: "New RibbonBtn", overflow: 'Show'
                    },
                    {
                        type: "Button", text: "UnderlineBtn", overflow: 'Show'
                    },
                ],
            }, "#ej2Toolbar");

            keyEventArgs = {
                preventDefault: function () { },
                action: 'moveRight',
                target: element.children[0].children[0],
            };
            toolbar.keyActionHandler(keyEventArgs);
            expect(document.activeElement.id === 'e-itemTemplate').toBe(true);
        });
        it('Duplication issue in private variable', () => {
            let element: HTMLElement = document.getElementById("ej2Toolbar");
            toolbar = new Toolbar({
                items: [
                    {
                        type: "Button", text: "GridBtn", overflow: 'Show'
                    },
                    {
                        type: "Button", text: "New Chart Button", overflow: 'Hide', template: ' <div id ="e-itemTemplate" tabindex="0" >Hii</div>'
                    },
                    {
                        type: "Button", text: "Next_Prev_Btn", overflow: 'Hide', align: 'Center'
                    },
                    {
                        type: "Button", text: "New RibbonBtn", overflow: 'Show'
                    },
                    {
                        type: "Button", text: "UnderlineBtn", overflow: 'Show'
                    },
                ],
            }, "#ej2Toolbar");

            keyEventArgs = {
                preventDefault: function () { },
                action: 'moveRight',
                target: element.children[0].children[0].children[0],
            };
            toolbar.keyActionHandler(keyEventArgs);
            expect(document.activeElement.id === 'e-itemTemplate').toBe(true);
        });
    });

    describe('margin calculation without element visible case in both popup and scrollable', () => {
        let toolbar: any;
        let keyEventArgs: any;
        beforeEach((): void => {
            toolbar = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Toolbar' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (toolbar) {
                toolbar.destroy();
            }
            document.body.innerHTML = '';
        });
        it('margin calculation without element visible case in  scrollable mode', () => {
            let element: HTMLElement = document.getElementById("ej2Toolbar");
            element.style.display = 'none';
            toolbar = new Toolbar({
                items: [
                    {
                        type: "Button", text: "GridBtn", overflow: 'Show'
                    },
                    {
                        type: "Button", text: "New Chart Button", overflow: 'Hide', template: ' <div id ="e-itemTemplate" tabindex="0" >Hii</div>'
                    },
                    {
                        type: "Button", text: "Next_Prev_Btn", overflow: 'Hide', align: 'Center'
                    },
                    {
                        type: "Button", text: "New RibbonBtn", overflow: 'Show'
                    },
                    {
                        type: "Button", text: "UnderlineBtn", overflow: 'Show', htmlAttributes: {'style': 'margin-right:15px ' }
                    },
                ],
            }, "#ej2Toolbar");
            expect(element.querySelectorAll('.e-hscroll').length).toBe(0);
            expect(element.querySelectorAll('.e-scroll-nav').length).toBe(0);
        });
        it('margin calculation without element visible case in  Popup mode', () => {
            let element: HTMLElement = document.getElementById("ej2Toolbar");
            element.style.display = 'none';
            toolbar = new Toolbar({
                overflowMode: 'Popup',
                items: [
                    {
                        type: "Button", text: "GridBtn", overflow: 'Show'
                    },
                    {
                        type: "Button", text: "New Chart Button", overflow: 'Hide', template: ' <div id ="e-itemTemplate" tabindex="0" >Hii</div>'
                    },
                    {
                        type: "Button", text: "Next_Prev_Btn", overflow: 'Hide', align: 'Center'
                    },
                    {
                        type: "Button", text: "New RibbonBtn", overflow: 'Show'
                    },
                    {
                        type: "Button", text: "UnderlineBtn", overflow: 'Show', htmlAttributes: {'style': 'margin-right:15px ' }
                    },
                ],
            }, "#ej2Toolbar");
            expect(element.querySelectorAll('.e-popup').length).toBe(0);
            expect(element.querySelectorAll('.e-hor-nav').length).toBe(0);
        });
    });
    describe('Popup Priority preference feature testing', () => {
        let toolbar: Toolbar;
        let keyEventArgs: any;
        beforeEach((): void => {
            toolbar = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Toolbar' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (toolbar) {
                toolbar.destroy();
            }
            document.body.innerHTML = '';
        });
        it('showAlwaysInPopup property testing', () => {
            let element: HTMLElement = document.getElementById("ej2Toolbar");
            toolbar = new Toolbar({
                items: [
                    {
                        type: "Button", text: "GridBtn", overflow: 'Show'
                    }
                ],
            }, "#ej2Toolbar");
            expect(toolbar.items[0].showAlwaysInPopup).toBe(false);
        });
        it('showAlwaysInPopup property testing with Popup mode', () => {
            let element: HTMLElement = document.getElementById("ej2Toolbar");
            toolbar = new Toolbar({
                overflowMode: 'Popup',
                items: [
                    {
                        type: "Button", text: "GridBtn", showAlwaysInPopup: true
                    }
                ],
            }, "#ej2Toolbar");
            expect(toolbar.items[0].showAlwaysInPopup).toBe(true);
            expect(element.querySelectorAll('.e-popup').length).toBe(1);
            expect(element.querySelector('.e-popup').childElementCount).toBe(1);
        });
        it('showAlwaysInPopup property testing with Popup mode with Toolbar priority', () => {
            let element: HTMLElement = document.getElementById("ej2Toolbar");
            toolbar = new Toolbar({
                overflowMode: 'Popup',
                items: [
                    {
                        type: "Button", text: "GridBtn", overflow: 'Show', showAlwaysInPopup: true
                    },
                    {
                        type: "Button", text: "New Chart Button", overflow: 'Hide',
                    },
                ],
            }, "#ej2Toolbar");
            expect(toolbar.items[0].showAlwaysInPopup).toBe(true);
            expect(element.querySelectorAll('.e-popup').length).toBe(0);
        });
        it('showAlwaysInPopup property testing with Popup mode with Popup priority', () => {
            let element: HTMLElement = document.getElementById("ej2Toolbar");
            toolbar = new Toolbar({
                overflowMode: 'Popup',
                items: [
                    {
                        type: "Button", text: "GridBtn", overflow: 'Show', showAlwaysInPopup: true
                    },
                    {
                        type: "Button", text: "New Chart Button", overflow: 'Hide', showAlwaysInPopup: true
                    },
                    {
                        type: "Button", text: "Next_Prev_Btn", overflow: 'Hide', showAlwaysInPopup: true
                    },
                    {
                        type: "Button", text: "New RibbonBtn", overflow: 'Show', showAlwaysInPopup: true
                    },
                    {
                        type: "Button", text: "UnderlineBtn", overflow: 'Show', showAlwaysInPopup: true
                    },
                ],
            }, "#ej2Toolbar");
            expect(toolbar.items[0].showAlwaysInPopup).toBe(true);
            expect(element.querySelectorAll('.e-popup').length).toBe(1);
            expect(element.querySelector('.e-popup').childElementCount).toBe(2);
        });
        it('showAlwaysInPopup property testing with Popup mode with Popup priority', () => {
            let element: HTMLElement = document.getElementById("ej2Toolbar");
            toolbar = new Toolbar({
                overflowMode: 'Popup',
                items: [
                    {
                        type: "Button", text: "GridBtn", overflow: 'Show', showAlwaysInPopup: true
                    },
                    {
                        type: "Button", text: "New Chart Button", overflow: 'Hide', showAlwaysInPopup: true
                    },
                    {
                        type: "Button", text: "Next_Prev_Btn", overflow: 'Hide', showAlwaysInPopup: true
                    },
                    {
                        type: "Button", text: "New RibbonBtn", overflow: 'Show', showAlwaysInPopup: true
                    },
                    {
                        type: "Button", text: "UnderlineBtn", overflow: 'Show', showAlwaysInPopup: true
                    },
                ],
            }, "#ej2Toolbar");
            expect(toolbar.items[0].showAlwaysInPopup).toBe(true);
            expect(element.querySelectorAll('.e-popup').length).toBe(1);
            expect(element.querySelector('.e-popup').childElementCount).toBe(2);
        });
        it('showAlwaysInPopup property testing with Popup mode with Popup priority', () => {
            let element: HTMLElement = document.getElementById("ej2Toolbar");
            let toolbarObj: any = new Toolbar({
                overflowMode: 'Popup',
                width: 150 ,
                items: [
                    {
                        type: "Button", text: "GridBtn", overflow: 'Show', showAlwaysInPopup: true
                    },
                    {
                        type: "Button", text: "New Chart Button", overflow: 'Hide', showAlwaysInPopup: true
                    },
                    {
                        type: "Button", text: "Next_Prev_Btn", overflow: 'Hide', showAlwaysInPopup: true
                    },
                    {
                        type: "Button", text: "New RibbonBtn", overflow: 'Show', showAlwaysInPopup: true
                    },
                    {
                        type: "Button", text: "UnderlineBtn", overflow: 'Show', showAlwaysInPopup: true
                    },
                ],
            }, "#ej2Toolbar");
            expect(element.querySelectorAll('.e-popup').length).toBe(1);
            expect(element.querySelector('.e-popup').childElementCount).toBe(4);
            toolbarObj.width = 400;
            toolbarObj.dataBind();
            toolbarObj.refreshOverflow();
            expect(element.querySelectorAll('.e-popup').length).toBe(1);
            expect(element.querySelector('.e-popup').childElementCount).toBe(2);
            toolbarObj.width = 'auto';
            toolbarObj.dataBind();
            toolbarObj.refreshOverflow();
            expect(element.querySelectorAll('.e-popup').length).toBe(1);
            expect(element.querySelector('.e-popup').childElementCount).toBe(2);
        });
        it('showAlwaysInPopup property testing with Popup mode with Popup priority', () => {
            let element: HTMLElement = document.getElementById("ej2Toolbar");
            let toolbarObj: any = new Toolbar({
                overflowMode: 'Popup',
                width: 150 ,
                items: [
                    {
                        type: "Button", text: "GridBtn"
                    },
                    {
                        type: "Button", text: "New Chart Button", showAlwaysInPopup: true
                    },
                    {
                        type: "Button", text: "Next_Prev_Btn", overflow: 'Hide', align: 'Right', showAlwaysInPopup: true
                    },
                    {
                        type: "Button", text: "New RibbonBtn", overflow: 'Show'
                    },
                    {
                        type: "Button", text: "UnderlineBtn", overflow: 'Show'
                    },
                ],
            }, "#ej2Toolbar");

        });
        it('showAlwaysInPopup property testing with Popup mode with align items', () => {
            let element: HTMLElement = document.getElementById("ej2Toolbar");
            let toolbarObj: any = new Toolbar({
                overflowMode: 'Popup',
                items: [
                    {
                        type: "Button", text: "GridBtn"
                    },
                    {
                        type: "Button", text: "New Chart Button", showAlwaysInPopup: true
                    },
                    {
                        type: "Button", text: "Next_Prev_Btn", overflow: 'Hide', align: 'Right', showAlwaysInPopup: true
                    },
                    {
                        type: "Button", text: "New RibbonBtn", overflow: 'Show'
                    },
                    {
                        type: "Button", text: "UnderlineBtn", overflow: 'Show'
                    },
                ],
            }, "#ej2Toolbar");
            expect(element.querySelectorAll('.e-popup').length).toBe(1);
            expect(element.querySelector('.e-popup').childElementCount).toBe(2);
            expect((<HTMLElement>element.querySelectorAll('.e-popup .e-tbar-btn')[1].firstElementChild).innerText).toBe('Next_Prev_Btn');
            expect((<HTMLElement>element.querySelectorAll('.e-popup .e-tbar-btn')[0].firstElementChild).innerText).toBe('New Chart Button');
            expect(element.querySelectorAll('.e-toolbar-left').length).toBe(0);
            expect(element.querySelectorAll('.e-toolbar-center').length).toBe(0);
            expect(element.querySelectorAll('.e-toolbar-right').length).toBe(0);
            toolbarObj.items[1].showAlwaysInPopup = false;
            toolbarObj.dataBind();
            expect(element.querySelectorAll('.e-popup').length).toBe(1);
            expect(element.querySelector('.e-popup').childElementCount).toBe(1);
            expect((<HTMLElement>element.querySelectorAll('.e-popup .e-tbar-btn')[0].firstElementChild).innerText).toBe('Next_Prev_Btn');
            expect(element.querySelectorAll('.e-toolbar-left').length).toBe(0);
            expect(element.querySelectorAll('.e-toolbar-center').length).toBe(0);
            expect(element.querySelectorAll('.e-toolbar-right').length).toBe(0);
            expect(toolbarObj.tbarAlgEle.lefts.length).toBe(0);
            expect(toolbarObj.tbarAlgEle.centers.length).toBe(0);
            expect(toolbarObj.tbarAlgEle.rights.length).toBe(0);
            toolbarObj.items[2].showAlwaysInPopup = false;
            toolbarObj.dataBind();
            expect(element.querySelectorAll('.e-popup').length).toBe(0);
            expect(element.querySelectorAll('.e-toolbar-left').length).toBe(1);
            expect(element.querySelectorAll('.e-toolbar-center').length).toBe(1);
            expect(element.querySelectorAll('.e-toolbar-right').length).toBe(1);
            expect((<HTMLElement>element.querySelectorAll('.e-toolbar-right .e-tbar-btn')[0].firstElementChild).innerText).toBe('Next_Prev_Btn');
            expect(toolbarObj.tbarAlgEle.lefts.length).toBe(4);
            expect(toolbarObj.tbarAlgEle.centers.length).toBe(0);
            expect(toolbarObj.tbarAlgEle.rights.length).toBe(1);
            toolbarObj.items[2].showAlwaysInPopup = true;
            toolbarObj.dataBind();
            expect(element.querySelectorAll('.e-popup').length).toBe(1);
            expect(element.querySelector('.e-popup').childElementCount).toBe(1);
            expect((<HTMLElement>element.querySelectorAll('.e-popup .e-tbar-btn')[0].firstElementChild).innerText).toBe('Next_Prev_Btn');
            expect(element.querySelectorAll('.e-toolbar-left').length).toBe(0);
            expect(element.querySelectorAll('.e-toolbar-center').length).toBe(0);
            expect(element.querySelectorAll('.e-toolbar-right').length).toBe(0);
            expect(toolbarObj.tbarAlgEle.lefts.length).toBe(0);
            expect(toolbarObj.tbarAlgEle.centers.length).toBe(0);
            expect(toolbarObj.tbarAlgEle.rights.length).toBe(0);
            toolbarObj.items[2].overflow = 'Show';
            toolbarObj.dataBind();
            expect(element.querySelectorAll('.e-popup').length).toBe(0);
            expect(element.querySelectorAll('.e-toolbar-left').length).toBe(1);
            expect(element.querySelectorAll('.e-toolbar-center').length).toBe(1);
            expect(element.querySelectorAll('.e-toolbar-right').length).toBe(1);
            expect((<HTMLElement>element.querySelectorAll('.e-toolbar-right .e-tbar-btn')[0].firstElementChild).innerText).toBe('Next_Prev_Btn');
            expect(toolbarObj.tbarAlgEle.lefts.length).toBe(4);
            expect(toolbarObj.tbarAlgEle.centers.length).toBe(0);
            expect(toolbarObj.tbarAlgEle.rights.length).toBe(1);
        });
        it('showAlwaysInPopup property testing with Popup mode, align items and private properties testing', () => {
            let element: HTMLElement = document.getElementById("ej2Toolbar");
            let toolbarObj: any = new Toolbar({
                overflowMode: 'Popup',
                items: [
                    {
                        type: "Button", text: "GridBtn"
                    },
                    {
                        type: "Button", text: "New Chart Button",align: 'Center',
                    },
                    {
                        type: "Button", text: "Next_Prev_Btn", overflow: 'Hide', align: 'Right', showAlwaysInPopup: true
                    },
                    {
                        type: "Button", text: "New RibbonBtn", overflow: 'Show', align: 'Right',
                    },
                    {
                        type: "Button", text: "UnderlineBtn", overflow: 'Show'
                    },
                ],
            }, "#ej2Toolbar");
            expect(element.querySelectorAll('.e-popup').length).toBe(1);
            expect(element.querySelectorAll('.e-toolbar-left').length).toBe(1);
            expect(element.querySelectorAll('.e-toolbar-center').length).toBe(1);
            expect(element.querySelectorAll('.e-toolbar-right').length).toBe(1);
            expect((<HTMLElement>element.querySelectorAll('.e-toolbar-right .e-tbar-btn')[0].firstElementChild).innerText).toBe('New RibbonBtn');
            expect(toolbarObj.tbarAlgEle.lefts.length).toBe(2);
            expect(toolbarObj.tbarAlgEle.centers.length).toBe(1);
            expect(toolbarObj.tbarAlgEle.rights.length).toBe(1);
            expect((<HTMLElement>element.querySelectorAll('.e-popup .e-tbar-btn')[0].firstElementChild).innerText).toBe('Next_Prev_Btn');
        });
        it('showAlwaysInPopup property testing with Popup mode with separator check', () => {
            let element: HTMLElement = document.getElementById("ej2Toolbar");
            let toolbarObj: any = new Toolbar({
                overflowMode: 'Popup',
                items: [
                    {
                        type: "Button", text: "GridBtn", overflow: 'Show'
                    },
                    {
                        type: "Button", text: "New Chart Button", overflow: 'Hide'
                    },
                    {
                        type: "Separator", showAlwaysInPopup: true
                    },
                    {
                        type: "Button", text: "New RibbonBtn", overflow: 'Show'
                    },
                    {
                        type: "Button", text: "UnderlineBtn", overflow: 'Show'
                    },
                ],
            }, "#ej2Toolbar");
            expect(element.querySelectorAll('.e-popup').length).toBe(0);
        });
    });
    describe('Separate items property chaning with onPropertyChange.', () => {
        let toolbar: any;
        let keyEventArgs: any;
        beforeEach((): void => {
            toolbar = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Toolbar' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (toolbar) {
                toolbar.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Items "Text, prefixIcon and suffixIcon property changing in onPropertyChange Testing  ', () => {
            let element: HTMLElement = document.getElementById("ej2Toolbar");
            toolbar = new Toolbar({
                width: '100px',
                items: [
                    {
                        type: "Button", text: "GridBtn"
                    },
                    {
                        type: "Button", text: "New Chart Button"
                    },
                    {
                        type: "Button", text: "Next_Prev_Btn"
                    },
                    {
                        type: "Button", text: "New RibbonBtn"
                    },
                    {
                        type: "Button", text: "UnderlineBtn"
                    },
                ],
            }, "#ej2Toolbar");
            let scrollBar: any = element.querySelector('.e-hscroll-bar');
            scrollBar.scrollLeft = 100;
            let scrollLeft = scrollBar.scrollLeft;
            let tbarBtns: any = element.querySelectorAll('.e-toolbar-items .e-tbar-btn');
            expect(tbarBtns[1].firstElementChild.innerText).toBe('New Chart Button');
            toolbar.items[1].text = '2ndButton';
            toolbar.dataBind();
            tbarBtns = element.querySelectorAll('.e-toolbar-items .e-tbar-btn');
            expect(tbarBtns[1].firstElementChild.innerText).toBe('2ndButton');
            expect(toolbar.tbarEle[1].firstElementChild.firstElementChild.innerText).toBe('2ndButton');
            expect(tbarBtns[2].firstElementChild.innerText).toBe('Next_Prev_Btn');
            expect(toolbar.tbarEle[1] === tbarBtns[1].parentElement).toBe(true);
            toolbar.items[2].text = '3rdButton';
            toolbar.dataBind();
            tbarBtns = element.querySelectorAll('.e-toolbar-items .e-tbar-btn');
            expect(tbarBtns[2].firstElementChild.innerText).toBe('3rdButton');
            expect(toolbar.tbarEle[2].firstElementChild.firstElementChild.innerText).toBe('3rdButton');
            expect(toolbar.tbarEle[2] === tbarBtns[2].parentElement).toBe(true);
            toolbar.items[2].prefixIcon = 'e-prefix';
            toolbar.dataBind();
            tbarBtns = element.querySelectorAll('.e-toolbar-items .e-tbar-btn');
            expect(tbarBtns[2].childElementCount).toBe(2);
            expect(tbarBtns[2].firstElementChild.classList.contains('e-prefix')).toBe(true);
            expect(toolbar.tbarEle[2].firstElementChild.childElementCount).toBe(2);
            expect(toolbar.tbarEle[2].firstElementChild.firstElementChild.classList.contains('e-prefix')).toBe(true);
            expect(toolbar.tbarEle[2] === tbarBtns[2].parentElement).toBe(true);
            toolbar.items[3].suffixIcon = 'e-suffix';
            toolbar.dataBind();
            tbarBtns = element.querySelectorAll('.e-toolbar-items .e-tbar-btn');
            expect(tbarBtns[3].childElementCount).toBe(2);
            expect(tbarBtns[3].children[1].classList.contains('e-suffix')).toBe(true);
            expect(toolbar.tbarEle[3].firstElementChild.childElementCount).toBe(2);
            expect(toolbar.tbarEle[3].firstElementChild.children[1].classList.contains('e-suffix')).toBe(true);
            expect(toolbar.tbarEle[3] === tbarBtns[3].parentElement).toBe(true);
            toolbar.items[4].prefixIcon = 'e-prefix';
            toolbar.items[4].suffixIcon = 'e-suffix';
            toolbar.dataBind();
            tbarBtns = element.querySelectorAll('.e-toolbar-items .e-tbar-btn');
            expect(tbarBtns[4].childElementCount).toBe(2);
            expect(tbarBtns[4].firstElementChild.classList.contains('e-prefix')).toBe(true);
            expect(toolbar.tbarEle[4].firstElementChild.childElementCount).toBe(2);
            expect(toolbar.tbarEle[4].firstElementChild.firstElementChild.classList.contains('e-prefix')).toBe(true);
            expect(toolbar.tbarEle[4] === tbarBtns[4].parentElement).toBe(true);
            toolbar.items[0].tooltipText = '1st_toolbarItem';
            toolbar.dataBind();
            tbarBtns = element.querySelectorAll('.e-toolbar-items .e-tbar-btn');
            expect(tbarBtns[0].parentElement.getAttribute('title')).toBe('1st_toolbarItem');
            expect(toolbar.tbarEle[0].getAttribute('title')).toBe('1st_toolbarItem');
            expect(toolbar.tbarEle[0] === tbarBtns[0].parentElement).toBe(true);
            toolbar.items[1].type = 'Separator';
            toolbar.items[2].id = 'tbarItem'
            toolbar.items[1].htmlAttributes =  { 'style': "color:red" };
            toolbar.dataBind();
            let separator:any = element.querySelectorAll('.e-toolbar-items .e-separator');
            tbarBtns = element.querySelectorAll('.e-toolbar-items .e-toolbar-item');
            expect(separator.length).toBe(1);
            expect(separator[0].style.color).toBe('red');
            expect(tbarBtns[1].classList.contains('e-separator')).toBe(true);
            expect(toolbar.tbarEle[1].classList.contains('e-separator')).toBe(true);
            tbarBtns = element.querySelectorAll('.e-toolbar-items .e-tbar-btn');
            expect(toolbar.tbarEle[2].firstElementChild.getAttribute('id')).toBe('tbarItem');
            expect(toolbar.tbarEle[2] === tbarBtns[1].parentElement).toBe(true);
            toolbar.items[2].template = '<div>hi</div>';
            toolbar.dataBind();
            tbarBtns = element.querySelectorAll('.e-toolbar-items .e-toolbar-item');
            expect(tbarBtns[2].firstElementChild.innerText).toBe('hi');
            expect(tbarBtns[2].classList.contains('e-template')).toBe(true);
            expect(toolbar.tbarEle[2] === tbarBtns[2]).toBe(true);
            toolbar.items[0].id = 'newBtnId';
            toolbar.dataBind();
            tbarBtns = element.querySelectorAll('.e-toolbar-items .e-tbar-btn');
            expect(tbarBtns[0].id).toBe('newBtnId');
            toolbar.items[0].width = 50;
            toolbar.dataBind();
            tbarBtns = element.querySelectorAll('.e-toolbar-items .e-tbar-btn');
            expect(tbarBtns[0].style.width).toBe('50px');
            expect(scrollBar.scrollLeft).toBe(100);
        });
        it('Items "Text, prefixIcon and suffixIcon property changing in onPropertyChange Testing  ', () => {
            let element: HTMLElement = document.getElementById("ej2Toolbar");
            toolbar = new Toolbar({
                items: [
                    {
                        type: "Button", text: "GridBtn"
                    },
                    {
                        type: "Button", text: "New Chart Button"
                    },
                    {
                        type: "Button", text: "Next_Prev_Btn"
                    },
                    {
                        type: "Button", text: "New RibbonBtn"
                    },
                    {
                        type: "Button", text: "UnderlineBtn"
                    },
                ],
            }, "#ej2Toolbar");
            expect(element.querySelector('.e-toolbar-items').childElementCount).toBe(5);
            toolbar.items[2].align = 'Center';
            toolbar.dataBind();
            expect(element.querySelector('.e-toolbar-items').childElementCount).toBe(3);
            let tbarItem: any = element.querySelectorAll('.e-toolbar-items .e-toolbar-item');
            let leftItem: any = element.querySelector('.e-toolbar-items .e-toolbar-left');
            let centerItem: any = element.querySelector('.e-toolbar-items .e-toolbar-center');
            let rightItem: any = element.querySelector('.e-toolbar-items .e-toolbar-right');
            expect(centerItem.childElementCount).toBe(1);
            expect(leftItem.childElementCount).toBe(4);
            expect(toolbar.tbarAlgEle.lefts.length).toBe(4)
            expect(toolbar.tbarAlgEle.centers.length).toBe(1)
            expect(centerItem.querySelectorAll('.e-tbar-btn')[0].firstElementChild.innerText).toBe('Next_Prev_Btn');
            toolbar.items[2].align = 'Right';
            toolbar.dataBind();
            leftItem = element.querySelector('.e-toolbar-items .e-toolbar-left');
            centerItem = element.querySelector('.e-toolbar-items .e-toolbar-center');
            rightItem = element.querySelector('.e-toolbar-items .e-toolbar-right');
            expect(toolbar.tbarAlgEle.lefts.length).toBe(4);
            expect(toolbar.tbarAlgEle.centers.length).toBe(0);
            expect(toolbar.tbarAlgEle.rights.length).toBe(1);
            expect(centerItem.querySelectorAll('.e-tbar-btn').length).toBe(0);
            expect(rightItem.querySelectorAll('.e-tbar-btn')[0].firstElementChild.innerText).toBe('Next_Prev_Btn');
            toolbar.items[2].align = 'Left';
            toolbar.dataBind();
            expect(element.querySelector('.e-toolbar-items').childElementCount).toBe(5);
        });
        it('Items "Text, prefixIcon and suffixIcon property changing in onPropertyChange Testing  ', () => {
            let element: HTMLElement = document.getElementById("ej2Toolbar");
            toolbar = new Toolbar({
                overflowMode: 'Popup',
                items: [
                    {
                        type: "Button", text: "GridBtn"
                    },
                    {
                        type: "Button", text: "New Chart Button"
                    },
                    {
                        type: "Button", text: "Next_Prev_Btn"
                    },
                    {
                        type: "Button", text: "New RibbonBtn"
                    },
                    {
                        type: "Button", text: "UnderlineBtn"
                    },
                ],
            }, "#ej2Toolbar");
            let popupCheck: any = element.querySelectorAll('.e-popup');
            expect(popupCheck.length).toBe(0);
            toolbar.items[2].showAlwaysInPopup = true;
            toolbar.dataBind();
            popupCheck = element.querySelectorAll('.e-popup');
            expect(popupCheck.length).toBe(1);
            expect(toolbar.tbarEle[2] === popupCheck[0].children[0]).toBe(true);
            let popupChildCount: any = element.querySelector('.e-popup').childElementCount;
            expect(popupChildCount).toBe(1);
            toolbar.items[2].overflow = 'Hide';
            toolbar.dataBind();
            popupCheck = element.querySelectorAll('.e-popup');
            expect(popupCheck.length).toBe(1);
            popupChildCount = element.querySelector('.e-popup').childElementCount;
            expect(popupChildCount).toBe(1);
            expect(toolbar.tbarEle[2] === popupCheck[0].children[0]).toBe(true);
            toolbar.items[2].overflow = 'Show';
            toolbar.dataBind();
            popupCheck = element.querySelectorAll('.e-popup');
            expect(popupCheck.length).toBe(0);
            let tbarBtns: any = element.querySelectorAll('.e-toolbar-items .e-tbar-btn');
            expect(toolbar.tbarEle[2] === tbarBtns[2].parentElement).toBe(true);
            toolbar.items[2].overflow = 'Hide';
            toolbar.dataBind();
            popupCheck = element.querySelectorAll('.e-popup');
            expect(popupCheck.length).toBe(1);
            popupChildCount = element.querySelector('.e-popup').childElementCount;
            expect(popupChildCount).toBe(1);
            expect(toolbar.tbarEle[2] === popupCheck[0].children[0]).toBe(true);
            toolbar.items[2].showAlwaysInPopup = false;
            toolbar.dataBind();
            popupCheck = element.querySelectorAll('.e-popup');
            expect(popupCheck.length).toBe(0);
            tbarBtns= element.querySelectorAll('.e-toolbar-items .e-tbar-btn');
            expect(toolbar.tbarEle[2] === tbarBtns[2].parentElement).toBe(true);
        });
    });
    describe("Toolbar keyboard testing when input component render inside the toolbar", () => {
        let toolbar: any;
        let keyEventArgs: any;
        document.body.innerHTML = '';
        beforeEach((): void => {
            toolbar = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Toolbar' });
            setStyleAttribute(ele, { 'display': 'block', 'white-space': 'nowrap', 'position': 'relative' });
            ele.style.display = 'block';
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (toolbar) {
                toolbar.destroy();
            }
            document.body.removeAttribute('style');
            document.body.innerHTML = '';
        });
        it("Accordion content with input element, 'moveRight' keyboard navigation and focus testing", (done: Function) => {
            let ele: HTMLElement = document.getElementById("ej2Toolbar");
            toolbar = new Toolbar(
                {
                    items: [
                        { type: 'Button', text: 'New' },
                        { type: 'Button', text: '<input type="text" value="syncfusion" />' },
                        { type: 'Button', text: 'Bold' }
                    ]
                }, ele);
            let elefirst: HTMLInputElement = ele.querySelector('.e-toolbar-item input');
            elefirst.focus();
            let actEle1: HTMLElement = <HTMLElement> document.activeElement;
            keyEventArgs = {
                preventDefault: function () { },
                action: 'moveRight',
                target: actEle1,
            };
            toolbar.keyActionHandler(keyEventArgs);
            let actEle2: HTMLElement = <HTMLElement> document.activeElement;
            expect(document.activeElement === elefirst).toBe(true);
            done();
        });
        it("Accordion content with input element, 'moveLeft' keyboard navigation and focus testing", (done: Function) => {
            let ele: HTMLElement = document.getElementById("ej2Toolbar");
            toolbar = new Toolbar(
                {
                    items: [
                        { type: 'Button', text: 'New' },
                        { type: 'Button', text: '<input type="text" value="syncfusion" />' },
                        { type: 'Button', text: 'Bold' }
                    ]
                }, ele);
            let elefirst: HTMLInputElement = ele.querySelector('.e-toolbar-item input');
            elefirst.focus();
            let actEle1: HTMLElement = <HTMLElement> document.activeElement;
            keyEventArgs = {
                preventDefault: function () { },
                action: 'moveLeft',
                target: actEle1,
            };
            toolbar.keyActionHandler(keyEventArgs);
            let actEle2: HTMLElement = <HTMLElement> document.activeElement;
            expect(document.activeElement === elefirst).toBe(true);
            done();
        });
        it("Accordion content with input element, 'home' keyboard navigation and focus testing", (done: Function) => {
            let ele: HTMLElement = document.getElementById("ej2Toolbar");
            toolbar = new Toolbar(
                {
                    items: [
                        { type: 'Button', text: 'New' },
                        { type: 'Button', text: '<input type="text" value="syncfusion" />' },
                        { type: 'Button', text: 'Bold' }
                    ]
                }, ele);
            let elefirst: HTMLInputElement = ele.querySelector('.e-toolbar-item input');
            elefirst.focus();
            let actEle1: HTMLElement = <HTMLElement> document.activeElement;
            keyEventArgs = {
                preventDefault: function () { },
                action: 'home',
                target: actEle1,
            };
            toolbar.keyActionHandler(keyEventArgs);
            let actEle2: HTMLElement = <HTMLElement> document.activeElement;
            expect(document.activeElement === elefirst).toBe(true);
            done();
        });
        it("Accordion content with input element, 'home' document keyboard navigation and focus testing", (done: Function) => {
            let ele: HTMLElement = document.getElementById("ej2Toolbar");
            toolbar = new Toolbar(
                {
                    items: [
                        { type: 'Button', text: 'New' },
                        { type: 'Button', text: '<input type="text" value="syncfusion" />' },
                        { type: 'Button', text: 'Bold' }
                    ]
                }, ele);
            let elefirst: HTMLInputElement = ele.querySelector('.e-toolbar-item input');
            elefirst.focus();
            let actEle1: HTMLElement = <HTMLElement> document.activeElement;
            keyEventArgs = {
                preventDefault: function () { },
                action: 'home',
                target: actEle1,
            };
            toolbar.docKeyDown(keyEventArgs);
            let actEle2: HTMLElement = <HTMLElement> document.activeElement;
            expect(document.activeElement === elefirst).toBe(true);
            done();
        });
        it("Accordion content with input element, 'end' keyboard navigation and focus testing", (done: Function) => {
            let ele: HTMLElement = document.getElementById("ej2Toolbar");
            toolbar = new Toolbar(
                {
                    items: [
                        { type: 'Button', text: 'New' },
                        { type: 'Button', text: '<input type="text" value="syncfusion" />' },
                        { type: 'Button', text: 'Bold' }
                    ]
                }, ele);
            let elefirst: HTMLInputElement = ele.querySelector('.e-toolbar-item input');
            elefirst.focus();
            let actEle1: HTMLElement = <HTMLElement> document.activeElement;
            keyEventArgs = {
                preventDefault: function () { },
                action: 'end',
                target: actEle1,
            };
            toolbar.keyActionHandler(keyEventArgs);
            let actEle2: HTMLElement = <HTMLElement> document.activeElement;
            expect(document.activeElement === elefirst).toBe(true);
            done();
        });
        it("Accordion content with input element, 'end' document keyboard navigation and focus testing", (done: Function) => {
            let ele: HTMLElement = document.getElementById("ej2Toolbar");
            toolbar = new Toolbar(
                {
                    items: [
                        { type: 'Button', text: 'New' },
                        { type: 'Button', text: '<input type="text" value="syncfusion" />' },
                        { type: 'Button', text: 'Bold' }
                    ]
                }, ele);
            let elefirst: HTMLInputElement = ele.querySelector('.e-toolbar-item input');
            elefirst.focus();
            let actEle1: HTMLElement = <HTMLElement> document.activeElement;
            keyEventArgs = {
                preventDefault: function () { },
                action: 'end',
                target: actEle1,
            };
            toolbar.docKeyDown(keyEventArgs);
            let actEle2: HTMLElement = <HTMLElement> document.activeElement;
            expect(document.activeElement === elefirst).toBe(true);
            done();
        });
    });
    describe('hideItem method testing', () => {
        let toolbar: Toolbar;
        beforeEach((): void => {
            toolbar = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Toolbar' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (toolbar) {
                toolbar.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Items - hideItem as true', () => {
            toolbar = new Toolbar({
               items: [
                    {
                        type: "Button", text: "GridBtn"
                    },
                    {
                        type: "Button", text: "New Chart Button"
                    },
                ],
            }, "#ej2Toolbar");
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-hidden')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-hidden')).toEqual(false);
            toolbar.hideItem(1, true);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-hidden')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-hidden')).toEqual(true);
        });
        it('Items - hideItem as false', () => {
            toolbar = new Toolbar({
               items: [
                    {
                        type: "Button", text: "GridBtn"
                    },
                    {
                        type: "Button", text: "New Chart Button"
                    },
                ],
            }, "#ej2Toolbar");
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-hidden')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-hidden')).toEqual(false);
            toolbar.hideItem(1, true);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-hidden')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-hidden')).toEqual(true);
            toolbar.hideItem(1, false);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-hidden')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-hidden')).toEqual(false);
        });
        it('Items - hideItem as true with unknown index', () => {
            toolbar = new Toolbar({
               items: [
                    {
                        type: "Button", text: "GridBtn"
                    },
                    {
                        type: "Button", text: "New Chart Button"
                    },
                ],
            }, "#ej2Toolbar");
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-hidden')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-hidden')).toEqual(false);
            toolbar.hideItem(2, true);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-hidden')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-hidden')).toEqual(false);
        });
        it('Items - hideItem as false with unknown index', () => {
            toolbar = new Toolbar({
               items: [
                    {
                        type: "Button", text: "GridBtn"
                    },
                    {
                        type: "Button", text: "New Chart Button"
                    },
                ],
            }, "#ej2Toolbar");
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-hidden')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-hidden')).toEqual(false);
            toolbar.hideItem(2, true);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-hidden')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-hidden')).toEqual(false);
            toolbar.hideItem(2, false);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-hidden')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-hidden')).toEqual(false);
        });
        it('Items - hideItem as true with negative index', () => {
            toolbar = new Toolbar({
               items: [
                    {
                        type: "Button", text: "GridBtn"
                    },
                    {
                        type: "Button", text: "New Chart Button"
                    },
                ],
            }, "#ej2Toolbar");
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-hidden')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-hidden')).toEqual(false);
            toolbar.hideItem(-1, true);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-hidden')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-hidden')).toEqual(false);
        });
        it('Items - hideItem as false with negative index', () => {
            toolbar = new Toolbar({
               items: [
                    {
                        type: "Button", text: "GridBtn"
                    },
                    {
                        type: "Button", text: "New Chart Button"
                    },
                ],
            }, "#ej2Toolbar");
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-hidden')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-hidden')).toEqual(false);
            toolbar.hideItem(-1, true);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-hidden')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-hidden')).toEqual(false);
            toolbar.hideItem(-1, false);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-hidden')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-hidden')).toEqual(false);
        });
        it('Items - Missing boolean value for hideItem', () => {
            toolbar = new Toolbar({
               items: [
                    {
                        type: "Button", text: "GridBtn"
                    },
                    {
                        type: "Button", text: "New Chart Button"
                    },
                ],
            }, "#ej2Toolbar");
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-hidden')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-hidden')).toEqual(false);
            toolbar.hideItem(0);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-hidden')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-hidden')).toEqual(false);
        });
        it('Items - hideItem as true with NaN index', () => {
            toolbar = new Toolbar({
               items: [
                    {
                        type: "Button", text: "GridBtn"
                    },
                    {
                        type: "Button", text: "New Chart Button"
                    },
                ],
            }, "#ej2Toolbar");
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-hidden')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-hidden')).toEqual(false);
            toolbar.hideItem(NaN, true);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-hidden')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-hidden')).toEqual(false);
        });
        it('Items - hideItem as false with NaN index', () => {
            toolbar = new Toolbar({
               items: [
                    {
                        type: "Button", text: "GridBtn"
                    },
                    {
                        type: "Button", text: "New Chart Button"
                    },
                ],
            }, "#ej2Toolbar");
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-hidden')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-hidden')).toEqual(false);
            toolbar.hideItem(NaN, true);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-hidden')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-hidden')).toEqual(false);
            toolbar.hideItem(NaN, false);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-hidden')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-hidden')).toEqual(false);
        });
        it('Template - hideItem as true', () => {
            let ele: HTMLElement = document.getElementById('ej2Toolbar');
            ele.innerHTML = '<div class="e-toolbar-items"><div><button class="e-btn" >File </button></div>'
            + '<div><button class="e-btn" >Layout </button></div>'
            + '<div><button class="e-btn" >Design </button></div>'
            + '<div><button class="e-btn" >Review </button></div>'
            + '<div><button class="e-btn" >Reference </button></div></div>';
            toolbar = new Toolbar();
            toolbar.appendTo('#ej2Toolbar');
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-hidden')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-hidden')).toEqual(false);
            toolbar.hideItem(1, true);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-hidden')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-hidden')).toEqual(true);
        });
        it('Template - hideItem as false', () => {
            let ele: HTMLElement = document.getElementById('ej2Toolbar');
            ele.innerHTML = '<div class="e-toolbar-items"><div><button class="e-btn" >File </button></div>'
            + '<div><button class="e-btn" >Layout </button></div>'
            + '<div><button class="e-btn" >Design </button></div>'
            + '<div><button class="e-btn" >Review </button></div>'
            + '<div><button class="e-btn" >Reference </button></div></div>';
            toolbar = new Toolbar();
            toolbar.appendTo('#ej2Toolbar');
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-hidden')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-hidden')).toEqual(false);
            toolbar.hideItem(1, true);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-hidden')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-hidden')).toEqual(true);
            toolbar.hideItem(1, false);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-hidden')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-hidden')).toEqual(false);
        });
        it('Template - hideItem as true with unknown index', () => {
            let ele: HTMLElement = document.getElementById('ej2Toolbar');
            ele.innerHTML = '<div class="e-toolbar-items"><div><button class="e-btn" >File </button></div>'
            + '<div><button class="e-btn" >Layout </button></div>'
            + '<div><button class="e-btn" >Design </button></div>'
            + '<div><button class="e-btn" >Review </button></div>'
            + '<div><button class="e-btn" >Reference </button></div></div>';
            toolbar = new Toolbar();
            toolbar.appendTo('#ej2Toolbar');
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-hidden')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-hidden')).toEqual(false);
            toolbar.hideItem(8, true);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-hidden')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-hidden')).toEqual(false);
        });
        it('Template - hideItem as false with unknown index', () => {
            let ele: HTMLElement = document.getElementById('ej2Toolbar');
            ele.innerHTML = '<div class="e-toolbar-items"><div><button class="e-btn" >File </button></div>'
            + '<div><button class="e-btn" >Layout </button></div>'
            + '<div><button class="e-btn" >Design </button></div>'
            + '<div><button class="e-btn" >Review </button></div>'
            + '<div><button class="e-btn" >Reference </button></div></div>';
            toolbar = new Toolbar();
            toolbar.appendTo('#ej2Toolbar');
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-hidden')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-hidden')).toEqual(false);
            toolbar.hideItem(8, false);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-hidden')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-hidden')).toEqual(false);
        });
        it('Template - hideItem as true with negative index', () => {
            let ele: HTMLElement = document.getElementById('ej2Toolbar');
            ele.innerHTML = '<div class="e-toolbar-items"><div><button class="e-btn" >File </button></div>'
            + '<div><button class="e-btn" >Layout </button></div>'
            + '<div><button class="e-btn" >Design </button></div>'
            + '<div><button class="e-btn" >Review </button></div>'
            + '<div><button class="e-btn" >Reference </button></div></div>';
            toolbar = new Toolbar();
            toolbar.appendTo('#ej2Toolbar');
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-hidden')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-hidden')).toEqual(false);
            toolbar.hideItem(-1, true);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-hidden')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-hidden')).toEqual(false);
        });
        it('Template - hideItem as false with NaN index', () => {
            let ele: HTMLElement = document.getElementById('ej2Toolbar');
            ele.innerHTML = '<div class="e-toolbar-items"><div><button class="e-btn" >File </button></div>'
            + '<div><button class="e-btn" >Layout </button></div>'
            + '<div><button class="e-btn" >Design </button></div>'
            + '<div><button class="e-btn" >Review </button></div>'
            + '<div><button class="e-btn" >Reference </button></div></div>';
            toolbar = new Toolbar();
            toolbar.appendTo('#ej2Toolbar');
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-hidden')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-hidden')).toEqual(false);
            toolbar.hideItem(NaN, false);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-hidden')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-hidden')).toEqual(false);
        });
        it('Template - hideItem as true with NaN index', () => {
            let ele: HTMLElement = document.getElementById('ej2Toolbar');
            ele.innerHTML = '<div class="e-toolbar-items"><div><button class="e-btn" >File </button></div>'
            + '<div><button class="e-btn" >Layout </button></div>'
            + '<div><button class="e-btn" >Design </button></div>'
            + '<div><button class="e-btn" >Review </button></div>'
            + '<div><button class="e-btn" >Reference </button></div></div>';
            toolbar = new Toolbar();
            toolbar.appendTo('#ej2Toolbar');
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-hidden')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-hidden')).toEqual(false);
            toolbar.hideItem(NaN, true);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-hidden')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-hidden')).toEqual(false);
        });
        it('OverflowItems - hideItem as true', () => {
            toolbar = new Toolbar({
               height: 50,
               overflowMode: 'Popup',
               width: 900, 
               items: [
                    {
                        type: "Button", text: 'Cut'
                    },
                    {
                        type: "Button", text: 'Copy'
                    },
                    {
                        type: "Button", text: 'Paste'
                    },
                    {
                        type: "Button", text: 'Bold'
                    },
                    {
                        type: "Button", text: 'Underline'
                    },
                    {
                        type: "Button", text: 'Italic'
                    },
                    {
                        type: "Button", text: 'Bullets'
                    },
                    {
                        type: "Button", text: 'Bullets'
                    },
                    {
                        type: "Button", text: 'Undo'
                    },
                    {
                        type: "Button", text: 'Redo'
                    },
                    {
                        type: "Button", text: 'Align-Left'
                    },
                    {
                        type: "Button", text: 'Align-Justify'
                    },
                    {
                        type: "Button", text: 'Align-Right'
                    },
                    {
                        type: "Button", text: 'Align-Center'
                    },
                    {
                        type: "Button", text: 'Radar'
                    },
                    {
                        type: "Button", text: 'Line'
                    },
                    {
                        type: "Button", text: 'Doughnut'
                    },
                    {
                        type: "Button", text: 'Bubble'
                    },
                    {
                        type: "Button", text: 'Table'
                    },
                    {
                        type: "Button", text: 'Picture'
                    },
                    {
                        type: "Button", text: 'Design'
                    }],
            }, "#ej2Toolbar");
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            expect(element.querySelectorAll('.e-toolbar-item.e-toolbar-popup').item(0).classList.contains('e-hidden')).toEqual(false);
            toolbar.hideItem(14, true);
            expect(element.querySelectorAll('.e-toolbar-item.e-toolbar-popup').item(0).classList.contains('e-hidden')).toEqual(true);
        });
        it('OverflowItems - hideItem as false', () => {
            toolbar = new Toolbar({
               height: 50,
               overflowMode: 'Popup',
               width: 900, 
               items: [
                    {
                        type: "Button", text: 'Cut'
                    },
                    {
                        type: "Button", text: 'Copy'
                    },
                    {
                        type: "Button", text: 'Paste'
                    },
                    {
                        type: "Button", text: 'Bold'
                    },
                    {
                        type: "Button", text: 'Underline'
                    },
                    {
                        type: "Button", text: 'Italic'
                    },
                    {
                        type: "Button", text: 'Bullets'
                    },
                    {
                        type: "Button", text: 'Bullets'
                    },
                    {
                        type: "Button", text: 'Undo'
                    },
                    {
                        type: "Button", text: 'Redo'
                    },
                    {
                        type: "Button", text: 'Align-Left'
                    },
                    {
                        type: "Button", text: 'Align-Justify'
                    },
                    {
                        type: "Button", text: 'Align-Right'
                    },
                    {
                        type: "Button", text: 'Align-Center'
                    },
                    {
                        type: "Button", text: 'Radar'
                    },
                    {
                        type: "Button", text: 'Line'
                    },
                    {
                        type: "Button", text: 'Doughnut'
                    },
                    {
                        type: "Button", text: 'Bubble'
                    },
                    {
                        type: "Button", text: 'Table'
                    },
                    {
                        type: "Button", text: 'Picture'
                    },
                    {
                        type: "Button", text: 'Design'
                    }],
            }, "#ej2Toolbar");
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            expect(element.querySelectorAll('.e-toolbar-item.e-toolbar-popup').item(0).classList.contains('e-hidden')).toEqual(false);
            toolbar.hideItem(14, false);
            expect(element.querySelectorAll('.e-toolbar-item.e-toolbar-popup').item(0).classList.contains('e-hidden')).toEqual(false);
        });
        it('OverflowItems - hideItem as true with unknown index', () => {
            toolbar = new Toolbar({
               height: 50,
               overflowMode: 'Popup',
               width: 900, 
               items: [
                    {
                        type: "Button", text: 'Cut'
                    },
                    {
                        type: "Button", text: 'Copy'
                    },
                    {
                        type: "Button", text: 'Paste'
                    },
                    {
                        type: "Button", text: 'Bold'
                    },
                    {
                        type: "Button", text: 'Underline'
                    },
                    {
                        type: "Button", text: 'Italic'
                    },
                    {
                        type: "Button", text: 'Bullets'
                    },
                    {
                        type: "Button", text: 'Bullets'
                    },
                    {
                        type: "Button", text: 'Undo'
                    },
                    {
                        type: "Button", text: 'Redo'
                    },
                    {
                        type: "Button", text: 'Align-Left'
                    },
                    {
                        type: "Button", text: 'Align-Justify'
                    },
                    {
                        type: "Button", text: 'Align-Right'
                    },
                    {
                        type: "Button", text: 'Align-Center'
                    },
                    {
                        type: "Button", text: 'Radar'
                    },
                    {
                        type: "Button", text: 'Line'
                    },
                    {
                        type: "Button", text: 'Doughnut'
                    },
                    {
                        type: "Button", text: 'Bubble'
                    },
                    {
                        type: "Button", text: 'Table'
                    },
                    {
                        type: "Button", text: 'Picture'
                    },
                    {
                        type: "Button", text: 'Design'
                    }],
            }, "#ej2Toolbar");
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            expect(element.querySelectorAll('.e-toolbar-item.e-toolbar-popup').item(0).classList.contains('e-hidden')).toEqual(false);
            toolbar.hideItem(25, true);
            expect(element.querySelectorAll('.e-toolbar-item.e-toolbar-popup').item(0).classList.contains('e-hidden')).toEqual(false);
        });
        it('OverflowItems - hideItem as false with unknown index', () => {
            toolbar = new Toolbar({
               height: 50,
               overflowMode: 'Popup',
               width: 900, 
               items: [
                    {
                        type: "Button", text: 'Cut'
                    },
                    {
                        type: "Button", text: 'Copy'
                    },
                    {
                        type: "Button", text: 'Paste'
                    },
                    {
                        type: "Button", text: 'Bold'
                    },
                    {
                        type: "Button", text: 'Underline'
                    },
                    {
                        type: "Button", text: 'Italic'
                    },
                    {
                        type: "Button", text: 'Bullets'
                    },
                    {
                        type: "Button", text: 'Bullets'
                    },
                    {
                        type: "Button", text: 'Undo'
                    },
                    {
                        type: "Button", text: 'Redo'
                    },
                    {
                        type: "Button", text: 'Align-Left'
                    },
                    {
                        type: "Button", text: 'Align-Justify'
                    },
                    {
                        type: "Button", text: 'Align-Right'
                    },
                    {
                        type: "Button", text: 'Align-Center'
                    },
                    {
                        type: "Button", text: 'Radar'
                    },
                    {
                        type: "Button", text: 'Line'
                    },
                    {
                        type: "Button", text: 'Doughnut'
                    },
                    {
                        type: "Button", text: 'Bubble'
                    },
                    {
                        type: "Button", text: 'Table'
                    },
                    {
                        type: "Button", text: 'Picture'
                    },
                    {
                        type: "Button", text: 'Design'
                    }],
            }, "#ej2Toolbar");
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            expect(element.querySelectorAll('.e-toolbar-item.e-toolbar-popup').item(0).classList.contains('e-hidden')).toEqual(false);
            toolbar.hideItem(25, false);
            expect(element.querySelectorAll('.e-toolbar-item.e-toolbar-popup').item(0).classList.contains('e-hidden')).toEqual(false);
        });
        it('OverflowItems - hideItem as true with negative index', () => {
            toolbar = new Toolbar({
               height: 50,
               overflowMode: 'Popup',
               width: 900, 
               items: [
                    {
                        type: "Button", text: 'Cut'
                    },
                    {
                        type: "Button", text: 'Copy'
                    },
                    {
                        type: "Button", text: 'Paste'
                    },
                    {
                        type: "Button", text: 'Bold'
                    },
                    {
                        type: "Button", text: 'Underline'
                    },
                    {
                        type: "Button", text: 'Italic'
                    },
                    {
                        type: "Button", text: 'Bullets'
                    },
                    {
                        type: "Button", text: 'Bullets'
                    },
                    {
                        type: "Button", text: 'Undo'
                    },
                    {
                        type: "Button", text: 'Redo'
                    },
                    {
                        type: "Button", text: 'Align-Left'
                    },
                    {
                        type: "Button", text: 'Align-Justify'
                    },
                    {
                        type: "Button", text: 'Align-Right'
                    },
                    {
                        type: "Button", text: 'Align-Center'
                    },
                    {
                        type: "Button", text: 'Radar'
                    },
                    {
                        type: "Button", text: 'Line'
                    },
                    {
                        type: "Button", text: 'Doughnut'
                    },
                    {
                        type: "Button", text: 'Bubble'
                    },
                    {
                        type: "Button", text: 'Table'
                    },
                    {
                        type: "Button", text: 'Picture'
                    },
                    {
                        type: "Button", text: 'Design'
                    }],
            }, "#ej2Toolbar");
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            expect(element.querySelectorAll('.e-toolbar-item.e-toolbar-popup').item(0).classList.contains('e-hidden')).toEqual(false);
            toolbar.hideItem(-1, true);
            expect(element.querySelectorAll('.e-toolbar-item.e-toolbar-popup').item(0).classList.contains('e-hidden')).toEqual(false);
        });
        it('OverflowItems - hideItem as false with negative index', () => {
            toolbar = new Toolbar({
               height: 50,
               overflowMode: 'Popup',
               width: 900, 
               items: [
                    {
                        type: "Button", text: 'Cut'
                    },
                    {
                        type: "Button", text: 'Copy'
                    },
                    {
                        type: "Button", text: 'Paste'
                    },
                    {
                        type: "Button", text: 'Bold'
                    },
                    {
                        type: "Button", text: 'Underline'
                    },
                    {
                        type: "Button", text: 'Italic'
                    },
                    {
                        type: "Button", text: 'Bullets'
                    },
                    {
                        type: "Button", text: 'Bullets'
                    },
                    {
                        type: "Button", text: 'Undo'
                    },
                    {
                        type: "Button", text: 'Redo'
                    },
                    {
                        type: "Button", text: 'Align-Left'
                    },
                    {
                        type: "Button", text: 'Align-Justify'
                    },
                    {
                        type: "Button", text: 'Align-Right'
                    },
                    {
                        type: "Button", text: 'Align-Center'
                    },
                    {
                        type: "Button", text: 'Radar'
                    },
                    {
                        type: "Button", text: 'Line'
                    },
                    {
                        type: "Button", text: 'Doughnut'
                    },
                    {
                        type: "Button", text: 'Bubble'
                    },
                    {
                        type: "Button", text: 'Table'
                    },
                    {
                        type: "Button", text: 'Picture'
                    },
                    {
                        type: "Button", text: 'Design'
                    }],
            }, "#ej2Toolbar");
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            expect(element.querySelectorAll('.e-toolbar-item.e-toolbar-popup').item(0).classList.contains('e-hidden')).toEqual(false);
            toolbar.hideItem(-1, false);
            expect(element.querySelectorAll('.e-toolbar-item.e-toolbar-popup').item(0).classList.contains('e-hidden')).toEqual(false);
        });
        it('OverflowItems - Missing boolean value for hideItem', () => {
            toolbar = new Toolbar({
               height: 50,
               overflowMode: 'Popup',
               width: 900, 
               items: [
                    {
                        type: "Button", text: 'Cut'
                    },
                    {
                        type: "Button", text: 'Copy'
                    },
                    {
                        type: "Button", text: 'Paste'
                    },
                    {
                        type: "Button", text: 'Bold'
                    },
                    {
                        type: "Button", text: 'Underline'
                    },
                    {
                        type: "Button", text: 'Italic'
                    },
                    {
                        type: "Button", text: 'Bullets'
                    },
                    {
                        type: "Button", text: 'Bullets'
                    },
                    {
                        type: "Button", text: 'Undo'
                    },
                    {
                        type: "Button", text: 'Redo'
                    },
                    {
                        type: "Button", text: 'Align-Left'
                    },
                    {
                        type: "Button", text: 'Align-Justify'
                    },
                    {
                        type: "Button", text: 'Align-Right'
                    },
                    {
                        type: "Button", text: 'Align-Center'
                    },
                    {
                        type: "Button", text: 'Radar'
                    },
                    {
                        type: "Button", text: 'Line'
                    },
                    {
                        type: "Button", text: 'Doughnut'
                    },
                    {
                        type: "Button", text: 'Bubble'
                    },
                    {
                        type: "Button", text: 'Table'
                    },
                    {
                        type: "Button", text: 'Picture'
                    },
                    {
                        type: "Button", text: 'Design'
                    }],
            }, "#ej2Toolbar");
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            expect(element.querySelectorAll('.e-toolbar-item.e-toolbar-popup').item(0).classList.contains('e-hidden')).toEqual(false);
            toolbar.hideItem(14);
            expect(element.querySelectorAll('.e-toolbar-item.e-toolbar-popup').item(0).classList.contains('e-hidden')).toEqual(false);
        });
        it('OverflowItems - hideItem as true with NaN index', () => {
            toolbar = new Toolbar({
               height: 50,
               overflowMode: 'Popup',
               width: 900, 
               items: [
                    {
                        type: "Button", text: 'Cut'
                    },
                    {
                        type: "Button", text: 'Copy'
                    },
                    {
                        type: "Button", text: 'Paste'
                    },
                    {
                        type: "Button", text: 'Bold'
                    },
                    {
                        type: "Button", text: 'Underline'
                    },
                    {
                        type: "Button", text: 'Italic'
                    },
                    {
                        type: "Button", text: 'Bullets'
                    },
                    {
                        type: "Button", text: 'Bullets'
                    },
                    {
                        type: "Button", text: 'Undo'
                    },
                    {
                        type: "Button", text: 'Redo'
                    },
                    {
                        type: "Button", text: 'Align-Left'
                    },
                    {
                        type: "Button", text: 'Align-Justify'
                    },
                    {
                        type: "Button", text: 'Align-Right'
                    },
                    {
                        type: "Button", text: 'Align-Center'
                    },
                    {
                        type: "Button", text: 'Radar'
                    },
                    {
                        type: "Button", text: 'Line'
                    },
                    {
                        type: "Button", text: 'Doughnut'
                    },
                    {
                        type: "Button", text: 'Bubble'
                    },
                    {
                        type: "Button", text: 'Table'
                    },
                    {
                        type: "Button", text: 'Picture'
                    },
                    {
                        type: "Button", text: 'Design'
                    }],
            }, "#ej2Toolbar");
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            expect(element.querySelectorAll('.e-toolbar-item.e-toolbar-popup').item(0).classList.contains('e-hidden')).toEqual(false);
            toolbar.hideItem(NaN, true);
            expect(element.querySelectorAll('.e-toolbar-item.e-toolbar-popup').item(0).classList.contains('e-hidden')).toEqual(false);
        });
        it('OverflowItems - hideItem as false with NaN index', () => {
            toolbar = new Toolbar({
               height: 50,
               overflowMode: 'Popup',
               width: 900, 
               items: [
                    {
                        type: "Button", text: 'Cut'
                    },
                    {
                        type: "Button", text: 'Copy'
                    },
                    {
                        type: "Button", text: 'Paste'
                    },
                    {
                        type: "Button", text: 'Bold'
                    },
                    {
                        type: "Button", text: 'Underline'
                    },
                    {
                        type: "Button", text: 'Italic'
                    },
                    {
                        type: "Button", text: 'Bullets'
                    },
                    {
                        type: "Button", text: 'Bullets'
                    },
                    {
                        type: "Button", text: 'Undo'
                    },
                    {
                        type: "Button", text: 'Redo'
                    },
                    {
                        type: "Button", text: 'Align-Left'
                    },
                    {
                        type: "Button", text: 'Align-Justify'
                    },
                    {
                        type: "Button", text: 'Align-Right'
                    },
                    {
                        type: "Button", text: 'Align-Center'
                    },
                    {
                        type: "Button", text: 'Radar'
                    },
                    {
                        type: "Button", text: 'Line'
                    },
                    {
                        type: "Button", text: 'Doughnut'
                    },
                    {
                        type: "Button", text: 'Bubble'
                    },
                    {
                        type: "Button", text: 'Table'
                    },
                    {
                        type: "Button", text: 'Picture'
                    },
                    {
                        type: "Button", text: 'Design'
                    }],
            }, "#ej2Toolbar");
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            expect(element.querySelectorAll('.e-toolbar-item.e-toolbar-popup').item(0).classList.contains('e-hidden')).toEqual(false);
            toolbar.hideItem(NaN, false);
            expect(element.querySelectorAll('.e-toolbar-item.e-toolbar-popup').item(0).classList.contains('e-hidden')).toEqual(false);
        });
    });
    // MultiRow Toolbar width property testing
    describe('Width property testing for multirow toolbar', () => {
            let toolbar: Toolbar;
            document.body.innerHTML = '';
            beforeEach((): void => {
                toolbar = undefined;
                let ele: HTMLElement = createElement('div', { id: 'ej2Toolbar' });
                setStyleAttribute(ele, { 'display': 'block', 'white-space': 'nowrap', 'position': 'relative' });
                ele.style.display = 'block';
                document.body.appendChild(ele);
            });
            afterEach((): void => {
                if (toolbar) {
                    toolbar.destroy();
                }
                document.body.innerHTML = '';
            });
        it('Toolbar width property testing with pixel value', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                    overflowMode: 'MultiRow',
                    width: 600, 
                    items: [
                    {
                        type: "Button", text: 'Cut'
                    },
                    {
                        type: "Button", text: 'Copy'
                    },
                    {
                        type: "Button", text: 'Paste'
                    },
                    {
                        type: "Button", text: 'Bold'
                    },
                    {
                        type: "Button", text: 'Underline'
                    },
                    {
                        type: "Button", text: 'Italic'
                    },
                    {
                        type: "Button", text: 'Bullets'
                    },
                    {
                        type: "Button", text: 'Bullets'
                    },
                    {
                        type: "Button", text: 'Undo'
                    },
                    {
                        type: "Button", text: 'Redo'
                    },
                    {
                        type: "Button", text: 'Align-Left'
                    },
                    {
                        type: "Button", text: 'Align-Justify'
                    },
                    {
                        type: "Button", text: 'Align-Right'
                    },
                    {
                        type: "Button", text: 'Align-Center'
                    },
                    {
                        type: "Button", text: 'Radar'
                    },
                    {
                        type: "Button", text: 'Line'
                    },
                    {
                        type: "Button", text: 'Doughnut'
                    },
                    {
                        type: "Button", text: 'Bubble'
                    },
                    {
                        type: "Button", text: 'Table'
                    },
                    {
                        type: "Button", text: 'Picture'
                    },
                    {
                        type: "Button", text: 'Design'
                    },
                    {
                        type: "Button", text: 'Sort A - Z'
                    },
                    {
                        type: "Button", text: 'Sort Z - A'
                    },
                    {
                        type: "Button", text: 'Upload'
                    },
                    {
                        type: "Button", text: 'Download'
                    },
                    {
                        type: "Button", text: 'Text Indent'
                    },
                    {
                        type: "Button", text: 'Text Outdent'
                    },
                    {
                        type: "Button", text: 'Clear'
                    },
                    {
                        type: "Button", text: 'Reload'
                    },
                    {
                        type: "Button", text: 'Export'
                    }],
                }); 
                toolbar.appendTo('#ej2Toolbar');
                expect(element.style.width).toEqual('600px');
            });
            it('Toolbar width property testing with percentage value', () => {
                let element: HTMLElement = document.getElementById('ej2Toolbar');
                toolbar = new Toolbar({
                    overflowMode: 'MultiRow',
                    width: '100%', 
                    items: [
                    {
                        type: "Button", text: 'Cut'
                    },
                    {
                        type: "Button", text: 'Copy'
                    },
                    {
                        type: "Button", text: 'Paste'
                    },
                    {
                        type: "Button", text: 'Bold'
                    },
                    {
                        type: "Button", text: 'Underline'
                    },
                    {
                        type: "Button", text: 'Italic'
                    },
                    {
                        type: "Button", text: 'Bullets'
                    },
                    {
                        type: "Button", text: 'Bullets'
                    },
                    {
                        type: "Button", text: 'Undo'
                    },
                    {
                        type: "Button", text: 'Redo'
                    },
                    {
                        type: "Button", text: 'Align-Left'
                    },
                    {
                        type: "Button", text: 'Align-Justify'
                    },
                    {
                        type: "Button", text: 'Align-Right'
                    },
                    {
                        type: "Button", text: 'Align-Center'
                    },
                    {
                        type: "Button", text: 'Radar'
                    },
                    {
                        type: "Button", text: 'Line'
                    },
                    {
                        type: "Button", text: 'Doughnut'
                    },
                    {
                        type: "Button", text: 'Bubble'
                    },
                    {
                        type: "Button", text: 'Table'
                    },
                    {
                        type: "Button", text: 'Picture'
                    },
                    {
                        type: "Button", text: 'Design'
                    },
                    {
                        type: "Button", text: 'Sort A - Z'
                    },
                    {
                        type: "Button", text: 'Sort Z - A'
                    },
                    {
                        type: "Button", text: 'Upload'
                    },
                    {
                        type: "Button", text: 'Download'
                    },
                    {
                        type: "Button", text: 'Text Indent'
                    },
                    {
                        type: "Button", text: 'Text Outdent'
                    },
                    {
                        type: "Button", text: 'Clear'
                    },
                    {
                        type: "Button", text: 'Reload'
                    },
                    {
                        type: "Button", text: 'Export'
                    }],
                }); 
                toolbar.appendTo('#ej2Toolbar');
                expect(element.style.width).toEqual('100%');
            });
            it('Toolbar dynamic width property testing', () => {
                let element: HTMLElement = document.getElementById('ej2Toolbar');
                let ele2: HTMLElement = createElement('div');
                setStyleAttribute(ele2, { 'margin-top': '50px', 'width': '900px' });
                toolbar = new Toolbar({
                    overflowMode: 'MultiRow',
                    width: '100%', 
                    items: [
                    {
                        type: "Button", text: 'Cut'
                    },
                    {
                        type: "Button", text: 'Copy'
                    },
                    {
                        type: "Button", text: 'Paste'
                    },
                    {
                        type: "Button", text: 'Bold'
                    },
                    {
                        type: "Button", text: 'Underline'
                    },
                    {
                        type: "Button", text: 'Italic'
                    },
                    {
                        type: "Button", text: 'Bullets'
                    },
                    {
                        type: "Button", text: 'Bullets'
                    },
                    {
                        type: "Button", text: 'Undo'
                    },
                    {
                        type: "Button", text: 'Redo'
                    },
                    {
                        type: "Button", text: 'Align-Left'
                    },
                    {
                        type: "Button", text: 'Align-Justify'
                    },
                    {
                        type: "Button", text: 'Align-Right'
                    },
                    {
                        type: "Button", text: 'Align-Center'
                    },
                    {
                        type: "Button", text: 'Radar'
                    },
                    {
                        type: "Button", text: 'Line'
                    },
                    {
                        type: "Button", text: 'Doughnut'
                    },
                    {
                        type: "Button", text: 'Bubble'
                    },
                    {
                        type: "Button", text: 'Table'
                    },
                    {
                        type: "Button", text: 'Picture'
                    },
                    {
                        type: "Button", text: 'Design'
                    },
                    {
                        type: "Button", text: 'Sort A - Z'
                    },
                    {
                        type: "Button", text: 'Sort Z - A'
                    },
                    {
                        type: "Button", text: 'Upload'
                    },
                    {
                        type: "Button", text: 'Download'
                    },
                    {
                        type: "Button", text: 'Text Indent'
                    },
                    {
                        type: "Button", text: 'Text Outdent'
                    },
                    {
                        type: "Button", text: 'Clear'
                    },
                    {
                        type: "Button", text: 'Reload'
                    },
                    {
                        type: "Button", text: 'Export'
                    }],
                }); 
                element.parentNode.appendChild(ele2);
                toolbar.appendTo('#ej2Toolbar');
                ele2.appendChild(element);
                expect(element.style.width).toEqual('100%');
                expect(ele2.style.width).toEqual('900px');
            });
    });
    // MultiRow Toolbar height property testing
    describe('Height property testing for multirow toolbar', () => {
        let toolbar: Toolbar;
        document.body.innerHTML = '';
        beforeEach((): void => {
            toolbar = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Toolbar' });
            setStyleAttribute(ele, { 'display': 'block', 'white-space': 'nowrap', 'position': 'relative' });
            ele.style.display = 'block';
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (toolbar) {
                toolbar.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Toolbar default height property testing', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                overflowMode: 'MultiRow',
                width: 600, 
                items: [
                {
                    type: "Button", text: 'Cut'
                },
                {
                    type: "Button", text: 'Copy'
                },
                {
                    type: "Button", text: 'Paste'
                },
                {
                    type: "Button", text: 'Bold'
                },
                {
                    type: "Button", text: 'Underline'
                },
                {
                    type: "Button", text: 'Italic'
                },
                {
                    type: "Button", text: 'Bullets'
                },
                {
                    type: "Button", text: 'Bullets'
                },
                {
                    type: "Button", text: 'Undo'
                },
                {
                    type: "Button", text: 'Redo'
                },
                {
                    type: "Button", text: 'Align-Left'
                },
                {
                    type: "Button", text: 'Align-Justify'
                },
                {
                    type: "Button", text: 'Align-Right'
                },
                {
                    type: "Button", text: 'Align-Center'
                },
                {
                    type: "Button", text: 'Radar'
                },
                {
                    type: "Button", text: 'Line'
                },
                {
                    type: "Button", text: 'Doughnut'
                },
                {
                    type: "Button", text: 'Bubble'
                },
                {
                    type: "Button", text: 'Table'
                },
                {
                    type: "Button", text: 'Picture'
                },
                {
                    type: "Button", text: 'Design'
                },
                {
                    type: "Button", text: 'Sort A - Z'
                },
                {
                    type: "Button", text: 'Sort Z - A'
                },
                {
                    type: "Button", text: 'Upload'
                },
                {
                    type: "Button", text: 'Download'
                },
                {
                    type: "Button", text: 'Text Indent'
                },
                {
                    type: "Button", text: 'Text Outdent'
                },
                {
                    type: "Button", text: 'Clear'
                },
                {
                    type: "Button", text: 'Reload'
                },
                {
                    type: "Button", text: 'Export'
                }],
            }); 
            toolbar.appendTo('#ej2Toolbar');
            expect(element.style.height).toEqual('auto');
        });
    });
    describe('Onproperty change testing with multirow', () => {
        let toolbar: Toolbar;
        document.body.innerHTML = '';
        beforeEach((): void => {
            toolbar = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Toolbar' });
            setStyleAttribute(ele, { 'display': 'block', 'white-space': 'nowrap', 'position': 'relative' });
            ele.style.display = 'block';
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (toolbar) {
                toolbar.destroy();
            }
            document.body.innerHTML = '';
        });
        it('onproperty change form Scrollable to MultiRow', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                overflowMode: 'Scrollable',
                width: 600, 
                items: [
                {
                    type: "Button", text: 'Cut'
                },
                {
                    type: "Button", text: 'Copy'
                },
                {
                    type: "Button", text: 'Paste'
                },
                {
                    type: "Button", text: 'Bold'
                },
                {
                    type: "Button", text: 'Underline'
                },
                {
                    type: "Button", text: 'Italic'
                },
                {
                    type: "Button", text: 'Bullets'
                },
                {
                    type: "Button", text: 'Bullets'
                },
                {
                    type: "Button", text: 'Undo'
                },
                {
                    type: "Button", text: 'Redo'
                },
                {
                    type: "Button", text: 'Align-Left'
                },
                {
                    type: "Button", text: 'Align-Justify'
                },
                {
                    type: "Button", text: 'Align-Right'
                },
                {
                    type: "Button", text: 'Align-Center'
                },
                {
                    type: "Button", text: 'Radar'
                },
                {
                    type: "Button", text: 'Line'
                },
                {
                    type: "Button", text: 'Doughnut'
                },
                {
                    type: "Button", text: 'Bubble'
                },
                {
                    type: "Button", text: 'Table'
                },
                {
                    type: "Button", text: 'Picture'
                },
                {
                    type: "Button", text: 'Design'
                },
                {
                    type: "Button", text: 'Sort A - Z'
                }],
            }); 
            toolbar.appendTo('#ej2Toolbar');
            expect(toolbar.overflowMode).toEqual('Scrollable');
            toolbar.overflowMode = 'MultiRow';
            expect(toolbar.overflowMode).toEqual('MultiRow');
        });
        it('onproperty change form Popup to MultiRow', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                overflowMode: 'Popup',
                width: 600, 
                items: [
                {
                    type: "Button", text: 'Cut'
                },
                {
                    type: "Button", text: 'Copy'
                },
                {
                    type: "Button", text: 'Paste'
                },
                {
                    type: "Button", text: 'Bold'
                },
                {
                    type: "Button", text: 'Underline'
                },
                {
                    type: "Button", text: 'Italic'
                },
                {
                    type: "Button", text: 'Bullets'
                },
                {
                    type: "Button", text: 'Bullets'
                },
                {
                    type: "Button", text: 'Undo'
                },
                {
                    type: "Button", text: 'Redo'
                },
                {
                    type: "Button", text: 'Align-Left'
                },
                {
                    type: "Button", text: 'Align-Justify'
                },
                {
                    type: "Button", text: 'Align-Right'
                },
                {
                    type: "Button", text: 'Align-Center'
                },
                {
                    type: "Button", text: 'Radar'
                },
                {
                    type: "Button", text: 'Line'
                },
                {
                    type: "Button", text: 'Doughnut'
                },
                {
                    type: "Button", text: 'Bubble'
                },
                {
                    type: "Button", text: 'Table'
                },
                {
                    type: "Button", text: 'Picture'
                },
                {
                    type: "Button", text: 'Design'
                },
                {
                    type: "Button", text: 'Sort A - Z'
                }],
            }); 
            toolbar.appendTo('#ej2Toolbar');
            expect(toolbar.overflowMode).toEqual('Popup');
            toolbar.overflowMode = 'MultiRow';
            expect(toolbar.overflowMode).toEqual('MultiRow');
        });
        it('onproperty change form MultiRow to Popup', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                overflowMode: 'MultiRow',
                width: 600, 
                items: [
                {
                    type: "Button", text: 'Cut'
                },
                {
                    type: "Button", text: 'Copy'
                },
                {
                    type: "Button", text: 'Paste'
                },
                {
                    type: "Button", text: 'Bold'
                },
                {
                    type: "Button", text: 'Underline'
                },
                {
                    type: "Button", text: 'Italic'
                },
                {
                    type: "Button", text: 'Bullets'
                },
                {
                    type: "Button", text: 'Bullets'
                },
                {
                    type: "Button", text: 'Undo'
                },
                {
                    type: "Button", text: 'Redo'
                },
                {
                    type: "Button", text: 'Align-Left'
                },
                {
                    type: "Button", text: 'Align-Justify'
                },
                {
                    type: "Button", text: 'Align-Right'
                },
                {
                    type: "Button", text: 'Align-Center'
                },
                {
                    type: "Button", text: 'Radar'
                },
                {
                    type: "Button", text: 'Line'
                },
                {
                    type: "Button", text: 'Doughnut'
                },
                {
                    type: "Button", text: 'Bubble'
                },
                {
                    type: "Button", text: 'Table'
                },
                {
                    type: "Button", text: 'Picture'
                },
                {
                    type: "Button", text: 'Design'
                },
                {
                    type: "Button", text: 'Sort A - Z'
                }],
            }); 
            toolbar.appendTo('#ej2Toolbar');
            expect(toolbar.overflowMode).toEqual('MultiRow');
            toolbar.overflowMode = 'Popup';
            expect(toolbar.overflowMode).toEqual('Popup');
        });
        it('onproperty change form MultiRow to Scrollable', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                overflowMode: 'MultiRow',
                width: 600, 
                items: [
                {
                    type: "Button", text: 'Cut'
                },
                {
                    type: "Button", text: 'Copy'
                },
                {
                    type: "Button", text: 'Paste'
                },
                {
                    type: "Button", text: 'Bold'
                },
                {
                    type: "Button", text: 'Underline'
                },
                {
                    type: "Button", text: 'Italic'
                },
                {
                    type: "Button", text: 'Bullets'
                },
                {
                    type: "Button", text: 'Bullets'
                },
                {
                    type: "Button", text: 'Undo'
                },
                {
                    type: "Button", text: 'Redo'
                },
                {
                    type: "Button", text: 'Align-Left'
                },
                {
                    type: "Button", text: 'Align-Justify'
                },
                {
                    type: "Button", text: 'Align-Right'
                },
                {
                    type: "Button", text: 'Align-Center'
                },
                {
                    type: "Button", text: 'Radar'
                },
                {
                    type: "Button", text: 'Line'
                },
                {
                    type: "Button", text: 'Doughnut'
                },
                {
                    type: "Button", text: 'Bubble'
                },
                {
                    type: "Button", text: 'Table'
                },
                {
                    type: "Button", text: 'Picture'
                },
                {
                    type: "Button", text: 'Design'
                },
                {
                    type: "Button", text: 'Sort A - Z'
                }],
            }); 
            toolbar.appendTo('#ej2Toolbar');
            expect(toolbar.overflowMode).toEqual('MultiRow');
            toolbar.overflowMode = 'Scrollable';
            expect(toolbar.overflowMode).toEqual('Scrollable');
        });
    });
    // Extended Toolbar width property testing
    describe('Width property testing for extended toolbar', () => {
        let toolbar: Toolbar;
        document.body.innerHTML = '';
        beforeEach((): void => {
            toolbar = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Toolbar' });
            setStyleAttribute(ele, { 'display': 'block', 'white-space': 'nowrap', 'position': 'relative' });
            ele.style.display = 'block';
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (toolbar) {
                toolbar.destroy();
            }
            document.body.innerHTML = '';
        });
    it('Toolbar width property testing with pixel value', () => {
        let element: HTMLElement = document.getElementById('ej2Toolbar');
        toolbar = new Toolbar({
                overflowMode: 'Extended',
                width: 600, 
                items: [
                {
                    type: "Button", text: 'Cut'
                },
                {
                    type: "Button", text: 'Copy'
                },
                {
                    type: "Button", text: 'Paste'
                },
                {
                    type: "Button", text: 'Bold'
                },
                {
                    type: "Button", text: 'Underline'
                },
                {
                    type: "Button", text: 'Italic'
                },
                {
                    type: "Button", text: 'Bullets'
                },
                {
                    type: "Button", text: 'Bullets'
                },
                {
                    type: "Button", text: 'Undo'
                },
                {
                    type: "Button", text: 'Redo'
                },
                {
                    type: "Button", text: 'Align-Left'
                },
                {
                    type: "Button", text: 'Align-Justify'
                },
                {
                    type: "Button", text: 'Align-Right'
                },
                {
                    type: "Button", text: 'Align-Center'
                },
                {
                    type: "Button", text: 'Radar'
                },
                {
                    type: "Button", text: 'Line'
                },
                {
                    type: "Button", text: 'Doughnut'
                },
                {
                    type: "Button", text: 'Bubble'
                },
                {
                    type: "Button", text: 'Table'
                },
                {
                    type: "Button", text: 'Picture'
                },
                {
                    type: "Button", text: 'Design'
                },
                {
                    type: "Button", text: 'Sort A - Z'
                },
                {
                    type: "Button", text: 'Sort Z - A'
                },
                {
                    type: "Button", text: 'Upload'
                },
                {
                    type: "Button", text: 'Download'
                },
                {
                    type: "Button", text: 'Text Indent'
                },
                {
                    type: "Button", text: 'Text Outdent'
                },
                {
                    type: "Button", text: 'Clear'
                },
                {
                    type: "Button", text: 'Reload'
                },
                {
                    type: "Button", text: 'Export'
                }],
            }); 
            toolbar.appendTo('#ej2Toolbar');
            expect(element.style.width).toEqual('600px');
        });
        it('Toolbar width property testing with percentage value', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar = new Toolbar({
                overflowMode: 'Extended',
                width: '100%', 
                items: [
                {
                    type: "Button", text: 'Cut'
                },
                {
                    type: "Button", text: 'Copy'
                },
                {
                    type: "Button", text: 'Paste'
                },
                {
                    type: "Button", text: 'Bold'
                },
                {
                    type: "Button", text: 'Underline'
                },
                {
                    type: "Button", text: 'Italic'
                },
                {
                    type: "Button", text: 'Bullets'
                },
                {
                    type: "Button", text: 'Bullets'
                },
                {
                    type: "Button", text: 'Undo'
                },
                {
                    type: "Button", text: 'Redo'
                },
                {
                    type: "Button", text: 'Align-Left'
                },
                {
                    type: "Button", text: 'Align-Justify'
                },
                {
                    type: "Button", text: 'Align-Right'
                },
                {
                    type: "Button", text: 'Align-Center'
                },
                {
                    type: "Button", text: 'Radar'
                },
                {
                    type: "Button", text: 'Line'
                },
                {
                    type: "Button", text: 'Doughnut'
                },
                {
                    type: "Button", text: 'Bubble'
                },
                {
                    type: "Button", text: 'Table'
                },
                {
                    type: "Button", text: 'Picture'
                },
                {
                    type: "Button", text: 'Design'
                },
                {
                    type: "Button", text: 'Sort A - Z'
                },
                {
                    type: "Button", text: 'Sort Z - A'
                },
                {
                    type: "Button", text: 'Upload'
                },
                {
                    type: "Button", text: 'Download'
                },
                {
                    type: "Button", text: 'Text Indent'
                },
                {
                    type: "Button", text: 'Text Outdent'
                },
                {
                    type: "Button", text: 'Clear'
                },
                {
                    type: "Button", text: 'Reload'
                },
                {
                    type: "Button", text: 'Export'
                }],
            }); 
            toolbar.appendTo('#ej2Toolbar');
            expect(element.style.width).toEqual('100%');
        });
        it('Toolbar dynamic width property testing', () => {
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            let ele2: HTMLElement = createElement('div');
            setStyleAttribute(ele2, { 'margin-top': '50px', 'width': '900px' });
            toolbar = new Toolbar({
                overflowMode: 'Extended',
                width: '100%', 
                items: [
                {
                    type: "Button", text: 'Cut'
                },
                {
                    type: "Button", text: 'Copy'
                },
                {
                    type: "Button", text: 'Paste'
                },
                {
                    type: "Button", text: 'Bold'
                },
                {
                    type: "Button", text: 'Underline'
                },
                {
                    type: "Button", text: 'Italic'
                },
                {
                    type: "Button", text: 'Bullets'
                },
                {
                    type: "Button", text: 'Bullets'
                },
                {
                    type: "Button", text: 'Undo'
                },
                {
                    type: "Button", text: 'Redo'
                },
                {
                    type: "Button", text: 'Align-Left'
                },
                {
                    type: "Button", text: 'Align-Justify'
                },
                {
                    type: "Button", text: 'Align-Right'
                },
                {
                    type: "Button", text: 'Align-Center'
                },
                {
                    type: "Button", text: 'Radar'
                },
                {
                    type: "Button", text: 'Line'
                },
                {
                    type: "Button", text: 'Doughnut'
                },
                {
                    type: "Button", text: 'Bubble'
                },
                {
                    type: "Button", text: 'Table'
                },
                {
                    type: "Button", text: 'Picture'
                },
                {
                    type: "Button", text: 'Design'
                },
                {
                    type: "Button", text: 'Sort A - Z'
                },
                {
                    type: "Button", text: 'Sort Z - A'
                },
                {
                    type: "Button", text: 'Upload'
                },
                {
                    type: "Button", text: 'Download'
                },
                {
                    type: "Button", text: 'Text Indent'
                },
                {
                    type: "Button", text: 'Text Outdent'
                },
                {
                    type: "Button", text: 'Clear'
                },
                {
                    type: "Button", text: 'Reload'
                },
                {
                    type: "Button", text: 'Export'
                }],
            }); 
            element.parentNode.appendChild(ele2);
            toolbar.appendTo('#ej2Toolbar');
            ele2.appendChild(element);
            expect(element.style.width).toEqual('100%');
            expect(ele2.style.width).toEqual('900px');
        });
    });
describe('Onproperty change testing with extended', () => {
    let toolbar: Toolbar;
    document.body.innerHTML = '';
    beforeEach((): void => {
        toolbar = undefined;
        let ele: HTMLElement = createElement('div', { id: 'ej2Toolbar' });
        setStyleAttribute(ele, { 'display': 'block', 'white-space': 'nowrap', 'position': 'relative' });
        ele.style.display = 'block';
        document.body.appendChild(ele);
    });
    afterEach((): void => {
        if (toolbar) {
            toolbar.destroy();
        }
        document.body.innerHTML = '';
    });
    it('onproperty change form Scrollable to Extended', () => {
        let element: HTMLElement = document.getElementById('ej2Toolbar');
        toolbar = new Toolbar({
            overflowMode: 'Scrollable',
            width: 600, 
            items: [
            {
                type: "Button", text: 'Cut'
            },
            {
                type: "Button", text: 'Copy'
            },
            {
                type: "Button", text: 'Paste'
            },
            {
                type: "Button", text: 'Bold'
            },
            {
                type: "Button", text: 'Underline'
            },
            {
                type: "Button", text: 'Italic'
            },
            {
                type: "Button", text: 'Bullets'
            },
            {
                type: "Button", text: 'Bullets'
            },
            {
                type: "Button", text: 'Undo'
            },
            {
                type: "Button", text: 'Redo'
            },
            {
                type: "Button", text: 'Align-Left'
            },
            {
                type: "Button", text: 'Align-Justify'
            },
            {
                type: "Button", text: 'Align-Right'
            },
            {
                type: "Button", text: 'Align-Center'
            },
            {
                type: "Button", text: 'Radar'
            },
            {
                type: "Button", text: 'Line'
            },
            {
                type: "Button", text: 'Doughnut'
            },
            {
                type: "Button", text: 'Bubble'
            },
            {
                type: "Button", text: 'Table'
            },
            {
                type: "Button", text: 'Picture'
            },
            {
                type: "Button", text: 'Design'
            },
            {
                type: "Button", text: 'Sort A - Z'
            }],
        }); 
        toolbar.appendTo('#ej2Toolbar');
        expect(toolbar.overflowMode).toEqual('Scrollable');
        toolbar.overflowMode = 'Extended';
        expect(toolbar.overflowMode).toEqual('Extended');
    });
    it('onproperty change form Popup to Extended', () => {
        let element: HTMLElement = document.getElementById('ej2Toolbar');
        toolbar = new Toolbar({
            overflowMode: 'Popup',
            width: 600, 
            items: [
            {
                type: "Button", text: 'Cut'
            },
            {
                type: "Button", text: 'Copy'
            },
            {
                type: "Button", text: 'Paste'
            },
            {
                type: "Button", text: 'Bold'
            },
            {
                type: "Button", text: 'Underline'
            },
            {
                type: "Button", text: 'Italic'
            },
            {
                type: "Button", text: 'Bullets'
            },
            {
                type: "Button", text: 'Bullets'
            },
            {
                type: "Button", text: 'Undo'
            },
            {
                type: "Button", text: 'Redo'
            },
            {
                type: "Button", text: 'Align-Left'
            },
            {
                type: "Button", text: 'Align-Justify'
            },
            {
                type: "Button", text: 'Align-Right'
            },
            {
                type: "Button", text: 'Align-Center'
            },
            {
                type: "Button", text: 'Radar'
            },
            {
                type: "Button", text: 'Line'
            },
            {
                type: "Button", text: 'Doughnut'
            },
            {
                type: "Button", text: 'Bubble'
            },
            {
                type: "Button", text: 'Table'
            },
            {
                type: "Button", text: 'Picture'
            },
            {
                type: "Button", text: 'Design'
            },
            {
                type: "Button", text: 'Sort A - Z'
            }],
        }); 
        toolbar.appendTo('#ej2Toolbar');
        expect(toolbar.overflowMode).toEqual('Popup');
        toolbar.overflowMode = 'Extended';
        expect(toolbar.overflowMode).toEqual('Extended');
    });
    it('onproperty change form MultiRow to Extended', () => {
        let element: HTMLElement = document.getElementById('ej2Toolbar');
        toolbar = new Toolbar({
            overflowMode: 'MultiRow',
            width: 600, 
            items: [
            {
                type: "Button", text: 'Cut'
            },
            {
                type: "Button", text: 'Copy'
            },
            {
                type: "Button", text: 'Paste'
            },
            {
                type: "Button", text: 'Bold'
            },
            {
                type: "Button", text: 'Underline'
            },
            {
                type: "Button", text: 'Italic'
            },
            {
                type: "Button", text: 'Bullets'
            },
            {
                type: "Button", text: 'Bullets'
            },
            {
                type: "Button", text: 'Undo'
            },
            {
                type: "Button", text: 'Redo'
            },
            {
                type: "Button", text: 'Align-Left'
            },
            {
                type: "Button", text: 'Align-Justify'
            },
            {
                type: "Button", text: 'Align-Right'
            },
            {
                type: "Button", text: 'Align-Center'
            },
            {
                type: "Button", text: 'Radar'
            },
            {
                type: "Button", text: 'Line'
            },
            {
                type: "Button", text: 'Doughnut'
            },
            {
                type: "Button", text: 'Bubble'
            },
            {
                type: "Button", text: 'Table'
            },
            {
                type: "Button", text: 'Picture'
            },
            {
                type: "Button", text: 'Design'
            },
            {
                type: "Button", text: 'Sort A - Z'
            }],
        }); 
        toolbar.appendTo('#ej2Toolbar');
        expect(toolbar.overflowMode).toEqual('MultiRow');
        toolbar.overflowMode = 'Extended';
        expect(toolbar.overflowMode).toEqual('Extended');
    });
    it('onproperty change form Extended to Popup', () => {
        let element: HTMLElement = document.getElementById('ej2Toolbar');
        toolbar = new Toolbar({
            overflowMode: 'Extended',
            width: 600, 
            items: [
            {
                type: "Button", text: 'Cut'
            },
            {
                type: "Button", text: 'Copy'
            },
            {
                type: "Button", text: 'Paste'
            },
            {
                type: "Button", text: 'Bold'
            },
            {
                type: "Button", text: 'Underline'
            },
            {
                type: "Button", text: 'Italic'
            },
            {
                type: "Button", text: 'Bullets'
            },
            {
                type: "Button", text: 'Bullets'
            },
            {
                type: "Button", text: 'Undo'
            },
            {
                type: "Button", text: 'Redo'
            },
            {
                type: "Button", text: 'Align-Left'
            },
            {
                type: "Button", text: 'Align-Justify'
            },
            {
                type: "Button", text: 'Align-Right'
            },
            {
                type: "Button", text: 'Align-Center'
            },
            {
                type: "Button", text: 'Radar'
            },
            {
                type: "Button", text: 'Line'
            },
            {
                type: "Button", text: 'Doughnut'
            },
            {
                type: "Button", text: 'Bubble'
            },
            {
                type: "Button", text: 'Table'
            },
            {
                type: "Button", text: 'Picture'
            },
            {
                type: "Button", text: 'Design'
            },
            {
                type: "Button", text: 'Sort A - Z'
            }],
        }); 
        toolbar.appendTo('#ej2Toolbar');
        expect(toolbar.overflowMode).toEqual('Extended');
        toolbar.overflowMode = 'Popup';
        expect(toolbar.overflowMode).toEqual('Popup');
    });
    it('onproperty change form Extended to Scrollable', () => {
        let element: HTMLElement = document.getElementById('ej2Toolbar');
        toolbar = new Toolbar({
            overflowMode: 'Extended',
            width: 600, 
            items: [
            {
                type: "Button", text: 'Cut'
            },
            {
                type: "Button", text: 'Copy'
            },
            {
                type: "Button", text: 'Paste'
            },
            {
                type: "Button", text: 'Bold'
            },
            {
                type: "Button", text: 'Underline'
            },
            {
                type: "Button", text: 'Italic'
            },
            {
                type: "Button", text: 'Bullets'
            },
            {
                type: "Button", text: 'Bullets'
            },
            {
                type: "Button", text: 'Undo'
            },
            {
                type: "Button", text: 'Redo'
            },
            {
                type: "Button", text: 'Align-Left'
            },
            {
                type: "Button", text: 'Align-Justify'
            },
            {
                type: "Button", text: 'Align-Right'
            },
            {
                type: "Button", text: 'Align-Center'
            },
            {
                type: "Button", text: 'Radar'
            },
            {
                type: "Button", text: 'Line'
            },
            {
                type: "Button", text: 'Doughnut'
            },
            {
                type: "Button", text: 'Bubble'
            },
            {
                type: "Button", text: 'Table'
            },
            {
                type: "Button", text: 'Picture'
            },
            {
                type: "Button", text: 'Design'
            },
            {
                type: "Button", text: 'Sort A - Z'
            }],
        }); 
        toolbar.appendTo('#ej2Toolbar');
        expect(toolbar.overflowMode).toEqual('Extended');
        toolbar.overflowMode = 'Scrollable';
        expect(toolbar.overflowMode).toEqual('Scrollable');
    });
    it('onproperty change form Extended to MultiRow', () => {
        let element: HTMLElement = document.getElementById('ej2Toolbar');
        toolbar = new Toolbar({
            overflowMode: 'Extended',
            width: 600, 
            items: [
            {
                type: "Button", text: 'Cut'
            },
            {
                type: "Button", text: 'Copy'
            },
            {
                type: "Button", text: 'Paste'
            },
            {
                type: "Button", text: 'Bold'
            },
            {
                type: "Button", text: 'Underline'
            },
            {
                type: "Button", text: 'Italic'
            },
            {
                type: "Button", text: 'Bullets'
            },
            {
                type: "Button", text: 'Bullets'
            },
            {
                type: "Button", text: 'Undo'
            },
            {
                type: "Button", text: 'Redo'
            },
            {
                type: "Button", text: 'Align-Left'
            },
            {
                type: "Button", text: 'Align-Justify'
            },
            {
                type: "Button", text: 'Align-Right'
            },
            {
                type: "Button", text: 'Align-Center'
            },
            {
                type: "Button", text: 'Radar'
            },
            {
                type: "Button", text: 'Line'
            },
            {
                type: "Button", text: 'Doughnut'
            },
            {
                type: "Button", text: 'Bubble'
            },
            {
                type: "Button", text: 'Table'
            },
            {
                type: "Button", text: 'Picture'
            },
            {
                type: "Button", text: 'Design'
            },
            {
                type: "Button", text: 'Sort A - Z'
            }],
        }); 
        toolbar.appendTo('#ej2Toolbar');
        expect(toolbar.overflowMode).toEqual('Extended');
        toolbar.overflowMode = 'MultiRow';
        expect(toolbar.overflowMode).toEqual('MultiRow');
    });
    it('Overflow property Extended toolbar popup opening and closing Testing', () => {
        let element: HTMLElement = document.getElementById('ej2Toolbar');
        toolbar = new Toolbar({
            width: 600,
            overflowMode: 'Extended',
            items: [
            {
                type: "Button", text: 'Cut'
            },
            {
                type: "Button", text: 'Copy'
            },
            {
                type: "Button", text: 'Paste'
            },
            {
                type: "Button", text: 'Bold'
            },
            {
                type: "Button", text: 'Underline'
            },
            {
                type: "Button", text: 'Italic'
            },
            {
                type: "Button", text: 'Bullets'
            },
            {
                type: "Button", text: 'Bullets'
            },
            {
                type: "Button", text: 'Undo'
            },
            {
                type: "Button", text: 'Redo'
            },
            {
                type: "Button", text: 'Align-Left'
            },
            {
                type: "Button", text: 'Align-Justify'
            },
            {
                type: "Button", text: 'Align-Right'
            },
            {
                type: "Button", text: 'Align-Center'
            },
            {
                type: "Button", text: 'Radar'
            },
            {
                type: "Button", text: 'Line'
            },
            {
                type: "Button", text: 'Doughnut'
            },
            {
                type: "Button", text: 'Bubble'
            },
            {
                type: "Button", text: 'Table'
            },
            {
                type: "Button", text: 'Picture'
            },
            {
                type: "Button", text: 'Design'
            },
            {
                type: "Button", text: 'Sort A - Z'
            }],
        }); toolbar.appendTo('#ej2Toolbar');
        let pop_Nav: HTMLElement = document.getElementById(element.id + '_nav');
        let nav_icon: HTMLElement = pop_Nav.firstChild as HTMLElement;
        pop_Nav.click();
        let tool: any = toolbar;
        tool.popObj.show();
        expect(element.children[2].classList.contains('e-popup-open')).toEqual(true);
        expect(nav_icon.classList.contains('e-popup-up-icon')).toEqual(true);
        document.getElementById(element.id + '_nav').click();
        tool.popObj.hide();
        expect(nav_icon.classList.contains('e-popup-down-icon')).toEqual(true);
        expect(element.children[2].classList.contains('e-popup-close')).toEqual(true);
    });
});

describe('Popuped element Collition testing', () => {
    let toolbar: any;
    document.body.innerHTML = '';
    function onBefore(e: BeforeCreateArgs): void {
      e.enableCollision = false;
    }
    beforeEach((): void => {
        toolbar = undefined;
        let ele: HTMLElement = createElement('div', { id: 'ej2Toolbar' });
        setStyleAttribute(ele, { 'display': 'block', 'white-space': 'nowrap', 'position': 'relative' });
        ele.style.display = 'block';
        document.body.appendChild(ele);
    });
    afterEach((): void => {
        if (toolbar) {
            toolbar.destroy();
        }
        document.body.innerHTML = '';
    });
    it('Popuped collition Enabling', () => {
        let element: HTMLElement = document.getElementById('ej2Toolbar');
        toolbar = new Toolbar({
            height: 40,
            width: 100,
            overflowMode: "Popup",
            items: [{
                type: 'Button', text: 'New', id: 'btnId'
            }, {
                type: 'Button', text: 'Underline'
            }],
        }); toolbar.appendTo('#ej2Toolbar');
        expect(toolbar.popObj.collision.Y).toBe('flip');
    });
    it('Popuped collision Disabling', () => {
        let element: HTMLElement = document.getElementById('ej2Toolbar');
        toolbar = new Toolbar({
            beforeCreate: onBefore,
            height: 40,
            width: 100,
            overflowMode: "Popup",
            items: [{
                type: 'Button', text: 'New', id: 'btnId'
            }, {
                type: 'Button', text: 'Underline'
            }],
        }); toolbar.appendTo('#ej2Toolbar');
        expect(toolbar.popObj.collision.Y).toBe('none');
    });
});

describe('Hscroll module scrollStep change in beforeCreate', () => {
    let toolbar: any;
    document.body.innerHTML = '';
    function onBefore(e: BeforeCreateArgs): void {
      e.scrollStep = 70;
    }
    beforeEach((): void => {
        toolbar = undefined;
        let ele: HTMLElement = createElement('div', { id: 'ej2Toolbar' });
        setStyleAttribute(ele, { 'display': 'block', 'white-space': 'nowrap', 'position': 'relative' });
        ele.style.display = 'block';
        document.body.appendChild(ele);
    });
    afterEach((): void => {
        if (toolbar) {
            toolbar.destroy();
        }
        document.body.innerHTML = '';
    });
    it('ScrollStep changing support', () => {
        let element: HTMLElement = document.getElementById('ej2Toolbar');
        toolbar = new Toolbar({
            beforeCreate: onBefore,
            height: 40,
            width: 100,
            items: [{
                type: 'Button', text: 'New', id: 'btnId'
            }, {
                type: 'Button', text: 'Underline'
            }],
        }); toolbar.appendTo('#ej2Toolbar');
        expect(toolbar.scrollModule.scrollStep).toBe(70);
        expect(toolbar.element.firstElementChild.ej2_instances[0].scrollStep).toBe(70);
    });
});

    describe('Item public click event testing', () => {
        let toolbar: Toolbar;
        let i: number = 0;
        let args: ClickEventArgs;
        function clickFn(): void {
            i++;
        }
        function clickFn2(e: ClickEventArgs): void {
            e.cancel = true;
            i++;
        }
        function clickArgs(e: ClickEventArgs): void {
            args = e;
        }
        beforeEach((): void => {
            toolbar = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Toolbar' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            i = 0;
            if (toolbar) {
                toolbar.destroy();
            }
        });
        it('Item click event argument testing', () => {
            toolbar = new Toolbar({
                width: '500px',
                items: [
                    { text: 'Cut', click: clickArgs }
                ]
            });
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar.appendTo('#ej2Toolbar');
            (<HTMLElement>document.querySelectorAll('.e-toolbar .e-toolbar-item')[0].firstChild).click();
            expect(args).not.toEqual(undefined);
            expect(args.originalEvent).not.toEqual(undefined);
            expect(args.item).not.toEqual(undefined);
            expect(args.item.text).toEqual('Cut');
            expect(args.item.click).not.toEqual(undefined);
            expect(args.cancel).toEqual(undefined);
        });
        it('Clicked event testing', () => {
            toolbar = new Toolbar({
                width: '500px',
                clicked: clickFn,
                items: [
                    { text: 'Cut' },
                    { text: 'Copy' },
                    { text: 'Paste' },
                ]
            });
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar.appendTo('#ej2Toolbar');
            expect(i).toEqual(0);
            element.click();
            expect(i).toEqual(0);
            (<HTMLElement>document.querySelectorAll('.e-toolbar .e-toolbar-item')[0].firstChild).click();
            expect(i).toEqual(1);
            (<HTMLElement>document.querySelectorAll('.e-toolbar .e-toolbar-item')[1].firstChild).click();
            expect(i).toEqual(2);
            (<HTMLElement>document.querySelectorAll('.e-toolbar .e-toolbar-item')[2].firstChild).click();
            expect(i).toEqual(3);
        });
        it('Clicked and item click event testing', () => {
            toolbar = new Toolbar({
                width: '500px',
                clicked: clickFn,
                items: [
                    { text: 'Cut', click: clickFn },
                    { text: 'Copy', click: clickFn },
                    { text: 'Paste', click: clickFn },
                ]
            });
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar.appendTo('#ej2Toolbar');
            expect(i).toEqual(0);
            element.click();
            expect(i).toEqual(0);
            (<HTMLElement>document.querySelectorAll('.e-toolbar .e-toolbar-item')[0].firstChild).click();
            expect(i).toEqual(2);
            (<HTMLElement>document.querySelectorAll('.e-toolbar .e-toolbar-item')[1].firstChild).click();
            expect(i).toEqual(4);
            (<HTMLElement>document.querySelectorAll('.e-toolbar .e-toolbar-item')[2].firstChild).click();
            expect(i).toEqual(6);
        });
        it('Clicked and random item click event testing', () => {
            toolbar = new Toolbar({
                width: '500px',
                clicked: clickFn,
                items: [
                    { text: 'Cut', click: clickFn },
                    { text: 'Copy' },
                    { text: 'Paste', click: clickFn },
                    { text: 'Undo' },
                ]
            });
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar.appendTo('#ej2Toolbar');
            expect(i).toEqual(0);
            element.click();
            expect(i).toEqual(0);
            (<HTMLElement>document.querySelectorAll('.e-toolbar .e-toolbar-item')[0].firstChild).click();
            expect(i).toEqual(2);
            (<HTMLElement>document.querySelectorAll('.e-toolbar .e-toolbar-item')[1].firstChild).click();
            expect(i).toEqual(3);
            (<HTMLElement>document.querySelectorAll('.e-toolbar .e-toolbar-item')[2].firstChild).click();
            expect(i).toEqual(5);
            (<HTMLElement>document.querySelectorAll('.e-toolbar .e-toolbar-item')[3].firstChild).click();
            expect(i).toEqual(6);
        });
        it('Clicked "argument cancel" with item click event testing', () => {
            toolbar = new Toolbar({
                width: '500px',
                clicked: clickFn2,
                items: [
                    { text: 'Cut', click: clickFn2 },
                    { text: 'Copy', click: clickFn2 },
                    { text: 'Paste', click: clickFn2 },
                    { text: 'Undo', click: clickFn2 },
                ]
            });
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar.appendTo('#ej2Toolbar');
            expect(i).toEqual(0);
            element.click();
            expect(i).toEqual(0);
            (<HTMLElement>document.querySelectorAll('.e-toolbar .e-toolbar-item')[0].firstChild).click();
            expect(i).toEqual(1);
            (<HTMLElement>document.querySelectorAll('.e-toolbar .e-toolbar-item')[1].firstChild).click();
            expect(i).toEqual(2);
            (<HTMLElement>document.querySelectorAll('.e-toolbar .e-toolbar-item')[2].firstChild).click();
            expect(i).toEqual(3);
            (<HTMLElement>document.querySelectorAll('.e-toolbar .e-toolbar-item')[3].firstChild).click();
            expect(i).toEqual(4);
        });
        it('Clicked "argument cancel" with random item click event testing', () => {
            toolbar = new Toolbar({
                width: '500px',
                clicked: clickFn2,
                items: [
                    { text: 'Cut', click: clickFn2 },
                    { text: 'Copy' },
                    { text: 'Paste', click: clickFn2 },
                    { text: 'Undo' },
                ]
            });
            let element: HTMLElement = document.getElementById('ej2Toolbar');
            toolbar.appendTo('#ej2Toolbar');
            expect(i).toEqual(0);
            element.click();
            expect(i).toEqual(0);
            (<HTMLElement>document.querySelectorAll('.e-toolbar .e-toolbar-item')[0].firstChild).click();
            expect(i).toEqual(1);
            (<HTMLElement>document.querySelectorAll('.e-toolbar .e-toolbar-item')[1].firstChild).click();
            expect(i).toEqual(2);
            (<HTMLElement>document.querySelectorAll('.e-toolbar .e-toolbar-item')[2].firstChild).click();
            expect(i).toEqual(3);
            (<HTMLElement>document.querySelectorAll('.e-toolbar .e-toolbar-item')[3].firstChild).click();
            expect(i).toEqual(4);
        });
    });
});