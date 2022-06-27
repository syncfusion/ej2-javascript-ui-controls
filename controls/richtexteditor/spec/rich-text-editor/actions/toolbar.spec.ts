/**
 * Toolbar spec
 */
import { selectAll, select, Browser, L10n, createElement, getUniqueID, detach, isNullOrUndefined, closest } from "@syncfusion/ej2-base";
import { RichTextEditor, ToolbarType } from "../../../src/rich-text-editor/index";
import { IToolbarStatus } from '../../../src/common/interface';
import { renderRTE, destroy, dispatchEvent } from "./../render.spec";
import { NodeSelection } from "../../../src/selection/index";

 describe('Checking the customized NumberFormatListand BulletFormatList dropdownItems', () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        let controlId: string;
        beforeAll((done: Function) => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['NumberFormatList', 'BulletFormatList']
                },
                numberFormatList: {
                    types: [
                        { text: 'None', value:'none' },
                        { text: 'Number', value: 'decimal' },
                        { text: 'UpperAlpha', value: 'upperAlpha' },
                        { text: 'LowerGreek', value: 'lowerGreek' },
                        { text: 'Hebrew', value: 'hebrew' },
                        { text: 'Katakana', value: 'katakana'}
            
                    ]
                },
                bulletFormatList: {
                    types: [
                        { text: 'None', value: 'none' },
                        { text: 'Square', value: 'square' },
                    ]
                },
                value: `<p id="rte">RichTextEditor</p>`
            });
            rteEle = rteObj.element;
            controlId = rteEle.id;
            done();
        });
        it(' Checking the sampleLevel numberFormatList items ', (done) => {
            let format: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_NumberFormatList');
            dispatchEvent(format, 'mousedown');
            dispatchEvent(format, 'mouseup');
            format.click();
            setTimeout(() => {
            let items: any = document.querySelectorAll('#' + controlId + '_toolbar_NumberFormatList-popup .e-item');
            expect(items[0].textContent === 'None').toBe(true);
            expect(items[1].textContent === 'Number').toBe(true);
            expect(items[2].textContent === 'UpperAlpha').toBe(true);
            expect(items[3].textContent === 'LowerGreek').toBe(true);
            expect(items[4].textContent === 'Hebrew').toBe(true);
            expect(items[5].textContent === 'Katakana').toBe(true);
            done();
        }, 200)
        });
        it(' Checking the sampleLevel bulletFormatList items ', (done) => {
            let format: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_BulletFormatList');
            dispatchEvent(format, 'mousedown');
            dispatchEvent(format, 'mouseup');
            format.click();
            setTimeout(() => {
            let items: any = document.querySelectorAll('#' + controlId + '_toolbar_BulletFormatList-popup .e-item');
            expect(items[0].textContent === 'None').toBe(true);
            expect(items[1].textContent === 'Square').toBe(true);
            done();
        }, 200)
        });
        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('EJ2-59865 - css class dependency component', () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        let controlId: string;
        beforeAll((done: Function) => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['NumberFormatList', 'BulletFormatList', 'Align', 'Display']
                },
                cssClass: 'customClass',
                numberFormatList: {
                    types: [
                        { text: 'None', value:'none' },
                        { text: 'Number', value: 'decimal' },
                        { text: 'UpperAlpha', value: 'upperAlpha' },
                        { text: 'LowerGreek', value: 'lowerGreek' },
                        { text: 'Hebrew', value: 'hebrew' },
                        { text: 'Katakana', value: 'katakana'}
            
                    ]
                },
                bulletFormatList: {
                    types: [
                        { text: 'None', value: 'none' },
                        { text: 'Square', value: 'square' },
                    ]
                },
                value: `<p id="rte">RichTextEditor</p>`
            });
            rteEle = rteObj.element;
            controlId = rteEle.id;
            done();
        });
        it(' css class dependency initial load and dynamic change ', (done) => {
            let format: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_NumberFormatList');
            dispatchEvent(format, 'mousedown');
            dispatchEvent(format, 'mouseup');
            format.click();
            setTimeout(() => {
                expect(document.querySelectorAll('.e-dropdown-popup')[0].classList.contains('customClass')).toBe(true);
                expect(document.querySelectorAll('.e-dropdown-popup')[1].classList.contains('customClass')).toBe(true);
                expect(document.querySelector('.e-rte-numberformatlist-dropdown').classList.contains('customClass')).toBe(true);
                expect(document.querySelector('.e-rte-bulletformatlist-dropdown').classList.contains('customClass')).toBe(true);
                rteObj.cssClass = 'changedClass';
                rteObj.dataBind();
                expect(document.querySelectorAll('.e-dropdown-popup')[0].classList.contains('changedClass')).toBe(true);
                expect(document.querySelectorAll('.e-dropdown-popup')[1].classList.contains('changedClass')).toBe(true);
                expect(document.querySelector('.e-rte-numberformatlist-dropdown').classList.contains('changedClass')).toBe(true);
                expect(document.querySelector('.e-rte-bulletformatlist-dropdown').classList.contains('changedClass')).toBe(true);
                done();
            }, 200)
        });
        afterAll(() => {
            destroy(rteObj);
        });
    });
    describe('Checking the NumberFormatList dropdownItems', () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        let controlId: string;
        beforeEach((done: Function) => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['NumberFormatList', 'BulletFormatList']
                },
                value: `<p id="rte">RichTextEditor</p>`
            });
            rteEle = rteObj.element;
            controlId = rteEle.id;
            done();
        });
    it(' Check the numberFormatList items 1', (done) => {
        let pEle: HTMLElement = rteObj.element.querySelector('#rte');
        rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.element.querySelector('#rte').childNodes[0], rteObj.element.querySelector('#rte').childNodes[0], 0, 14);
        let numberFormatList: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_NumberFormatList');
        dispatchEvent(numberFormatList, 'mousedown');
        dispatchEvent(numberFormatList, 'mouseup');
        numberFormatList.click();
        let items: any = document.querySelectorAll('#' + controlId + '_toolbar_NumberFormatList-popup .e-item');
        items[1].click();
        expect(pEle.style.listStyleType === 'decimal').toBe(true);
        expect(rteObj.element.querySelector('#rte').tagName === 'OL').toBe(true);
        done();
    });
    it(' Check the numberFormatList items 2', (done) => {
        let pEle: HTMLElement = rteObj.element.querySelector('#rte');
        rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.element.querySelector('#rte').childNodes[0], rteObj.element.querySelector('#rte').childNodes[0], 0, 14);
        let numberFormatList: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_NumberFormatList');
        dispatchEvent(numberFormatList, 'mousedown');
        dispatchEvent(numberFormatList, 'mouseup');
        numberFormatList.click();
        let items: any = document.querySelectorAll('#' + controlId + '_toolbar_NumberFormatList-popup .e-item');
        items[2].click();
        expect(pEle.style.listStyleType === 'lower-greek').toBe(true);
        expect(rteObj.element.querySelector('#rte').tagName === 'OL').toBe(true);
        done();
    });
    it(' Check the numberFormatList items 3', (done) => {
        let pEle: HTMLElement = rteObj.element.querySelector('#rte');
        rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.element.querySelector('#rte').childNodes[0], rteObj.element.querySelector('#rte').childNodes[0], 0, 14);
        let numberFormatList: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_NumberFormatList');
        dispatchEvent(numberFormatList, 'mousedown');
        dispatchEvent(numberFormatList, 'mouseup');
        numberFormatList.click();
        let items: any = document.querySelectorAll('#' + controlId + '_toolbar_NumberFormatList-popup .e-item');
        items[3].click();
        expect(pEle.style.listStyleType === 'lower-roman').toBe(true);
        expect(rteObj.element.querySelector('#rte').tagName === 'OL').toBe(true);
        done();
    });
    it(' Check the numberFormatList items 4', (done) => {
        let pEle: HTMLElement = rteObj.element.querySelector('#rte');
        rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.element.querySelector('#rte').childNodes[0], rteObj.element.querySelector('#rte').childNodes[0], 0, 14);
        let numberFormatList: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_NumberFormatList');
        dispatchEvent(numberFormatList, 'mousedown');
        dispatchEvent(numberFormatList, 'mouseup');
        numberFormatList.click();
        let items: any = document.querySelectorAll('#' + controlId + '_toolbar_NumberFormatList-popup .e-item');
        items[4].click();
        expect(pEle.style.listStyleType === 'upper-alpha').toBe(true);
        expect(rteObj.element.querySelector('#rte').tagName === 'OL').toBe(true);
        done();
    });
    it(' Check the numberFormatList items 5', (done) => {
        let pEle: HTMLElement = rteObj.element.querySelector('#rte');
        rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.element.querySelector('#rte').childNodes[0], rteObj.element.querySelector('#rte').childNodes[0], 0, 14);
        let numberFormatList: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_NumberFormatList');
        dispatchEvent(numberFormatList, 'mousedown');
        dispatchEvent(numberFormatList, 'mouseup');
        numberFormatList.click();
        let items: any = document.querySelectorAll('#' + controlId + '_toolbar_NumberFormatList-popup .e-item');
        items[5].click();
        expect(pEle.style.listStyleType === 'lower-alpha').toBe(true);
        expect(rteObj.element.querySelector('#rte').tagName === 'OL').toBe(true);
        done();
    });
    it(' Check the numberFormatList items 6', (done) => {
        let pEle: HTMLElement = rteObj.element.querySelector('#rte');
        rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.element.querySelector('#rte').childNodes[0], rteObj.element.querySelector('#rte').childNodes[0], 0, 14);
        let numberFormatList: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_NumberFormatList');
        dispatchEvent(numberFormatList, 'mousedown');
        dispatchEvent(numberFormatList, 'mouseup');
        numberFormatList.click();
        let items: any = document.querySelectorAll('#' + controlId + '_toolbar_NumberFormatList-popup .e-item');
        items[0].click();
        expect(pEle.style.listStyleType === 'none').toBe(true);
        expect(rteObj.element.querySelector('#rte').tagName === 'OL').toBe(true);
        done();
    });
    it(' Check the numberFormatList items 7', (done) => {
        let pEle: HTMLElement = rteObj.element.querySelector('#rte');
        rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.element.querySelector('#rte').childNodes[0], rteObj.element.querySelector('#rte').childNodes[0], 0, 14);
        let numberFormatList: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_NumberFormatList');
        dispatchEvent(numberFormatList, 'mousedown');
        dispatchEvent(numberFormatList, 'mouseup');
        numberFormatList.click();
        let items: any = document.querySelectorAll('#' + controlId + '_toolbar_NumberFormatList-popup .e-item');
        items[1].click();
        expect(pEle.style.listStyleType === 'decimal').toBe(true);
        expect(rteObj.element.querySelector('#rte').tagName === 'OL').toBe(true);
        done();
    });
    afterEach(() => {
        destroy(rteObj);
    });
    });

    describe('Checking the BulletFormatList  dropdownItems', () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        let controlId: string;
        beforeEach((done: Function) => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['NumberFormatList', 'BulletFormatList']
                },
                value: `<p id="rte">RichTextEditor</p>`
            });
            rteEle = rteObj.element;
            controlId = rteEle.id;
            done();
        });
    it(' Check the bulletFormatList items 1', (done) => {
        let pEle: HTMLElement = rteObj.element.querySelector('#rte');
        rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.element.querySelector('#rte').childNodes[0], rteObj.element.querySelector('#rte').childNodes[0], 0, 14);
        let bulletFormatList: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_BulletFormatList');
        dispatchEvent(bulletFormatList, 'mousedown');
        dispatchEvent(bulletFormatList, 'mouseup');
        bulletFormatList.click();
        let items: any = document.querySelectorAll('#' + controlId + '_toolbar_BulletFormatList-popup .e-item');
        items[1].click();
        expect(pEle.style.listStyleType === 'disc').toBe(true);
        expect(rteObj.element.querySelector('#rte').tagName === 'UL').toBe(true);
        done();
    });
    it(' Check the bulletFormatList items 2', (done) => {
        let pEle: HTMLElement = rteObj.element.querySelector('#rte');
        rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.element.querySelector('#rte').childNodes[0], rteObj.element.querySelector('#rte').childNodes[0], 0, 14);
        let bulletFormatList: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_BulletFormatList');
        dispatchEvent(bulletFormatList, 'mousedown');
        dispatchEvent(bulletFormatList, 'mouseup');
        bulletFormatList.click();
        let items: any = document.querySelectorAll('#' + controlId + '_toolbar_BulletFormatList-popup .e-item');
        items[2].click();
        expect(pEle.style.listStyleType === 'circle').toBe(true);
        expect(rteObj.element.querySelector('#rte').tagName === 'UL').toBe(true);
        done();
    });
    it(' Check the bulletFormatList items 3', (done) => {
        let pEle: HTMLElement = rteObj.element.querySelector('#rte');
        rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.element.querySelector('#rte').childNodes[0], rteObj.element.querySelector('#rte').childNodes[0], 0, 14);
        let bulletFormatList: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_BulletFormatList');
        dispatchEvent(bulletFormatList, 'mousedown');
        dispatchEvent(bulletFormatList, 'mouseup');
        bulletFormatList.click();
        let items: any = document.querySelectorAll('#' + controlId + '_toolbar_BulletFormatList-popup .e-item');
        items[3].click();
        expect(pEle.style.listStyleType === 'square').toBe(true);
        expect(rteObj.element.querySelector('#rte').tagName === 'UL').toBe(true);
        done();
    });
    it(' Check the bulletFormatList items 4', (done) => {
        let pEle: HTMLElement = rteObj.element.querySelector('#rte');
        rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.element.querySelector('#rte').childNodes[0], rteObj.element.querySelector('#rte').childNodes[0], 0, 14);
        let bulletFormatList: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_BulletFormatList');
        dispatchEvent(bulletFormatList, 'mousedown');
        dispatchEvent(bulletFormatList, 'mouseup');
        bulletFormatList.click();
        let items: any = document.querySelectorAll('#' + controlId + '_toolbar_BulletFormatList-popup .e-item');
        items[0].click();
        expect(pEle.style.listStyleType === 'none').toBe(true);
        expect(rteObj.element.querySelector('#rte').tagName === 'UL').toBe(true);
        done();
    });
    afterEach(() => {
        destroy(rteObj);
    });
    });
    describe('Applying ordered and unordered list then, advanced ol,ul to p tag', () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        let controlId: string;
        beforeEach((done: Function) => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['NumberFormatList', 'BulletFormatList', 'OrderedList', 'UnorderedList']
                },
                value: `<p id="rte">RichTextEditor</p>`
            });
            rteEle = rteObj.element;
            controlId = rteEle.id;
            done();
        });
        it('Applying Ordered list then, NumberFormatList to p tag ', (done) => {
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.element.querySelector('#rte').childNodes[0], rteObj.element.querySelector('#rte').childNodes[0], 0, 14);
            let OL: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_OrderedList');
            dispatchEvent(OL, 'mousedown');
            dispatchEvent(OL, 'mouseup');
            OL.click();
            let pEle: HTMLElement = rteObj.element.querySelector('#rte');
            expect(pEle.tagName === 'LI').toBe(true);
            expect(pEle.parentElement.tagName === 'OL').toBe(true);
            let numberFormatList: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_NumberFormatList');
            dispatchEvent(numberFormatList, 'mousedown');
            dispatchEvent(numberFormatList, 'mouseup');
            numberFormatList.click();
            let items: any = document.querySelectorAll('#' + controlId + '_toolbar_NumberFormatList-popup .e-item');
            items[3].click();
            let Elem: HTMLElement = rteObj.element.querySelector('#rte');
            expect(Elem.tagName === 'LI').toBe(true);
            expect(Elem.parentElement.tagName === 'OL').toBe(true);
            expect(Elem.parentElement.style.listStyleType === 'lower-roman').toBe(true);
            done();
            });
        it('Applying UnOrdered list then, BulletFormatList to p tag ', (done) => {
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.element.querySelector('#rte').childNodes[0], rteObj.element.querySelector('#rte').childNodes[0], 0, 14);
            let UL: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_UnorderedList');
            dispatchEvent(UL, 'mousedown');
            dispatchEvent(UL, 'mouseup');
            UL.click();
            let pEle: HTMLElement = rteObj.element.querySelector('#rte');
            expect(pEle.tagName === 'LI').toBe(true);
            expect(pEle.parentElement.tagName === 'UL').toBe(true);
            let bulletFormatList: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_BulletFormatList');
            dispatchEvent(bulletFormatList, 'mousedown');
            dispatchEvent(bulletFormatList, 'mouseup');
            bulletFormatList.click();
            let items: any = document.querySelectorAll('#' + controlId + '_toolbar_BulletFormatList-popup .e-item');
            items[3].click();
            let Elem: HTMLElement = rteObj.element.querySelector('#rte');
            expect(Elem.tagName === 'LI').toBe(true);
            expect(Elem.parentElement.tagName === 'UL').toBe(true);
            expect(Elem.parentElement.style.listStyleType === 'square').toBe(true);
            done();
            });
        afterEach(() => {
            destroy(rteObj);
        });
    });

    describe('Checking the NumberFormatListand BulletFormatList style type and style image', () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        let controlId: string;
        beforeEach((done: Function) => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['NumberFormatList', 'BulletFormatList']
                },
                numberFormatList: {
                    types: [
                        { text: 'None', value:'none' },
                        { text: 'Number', value: 'decimal' },
                        { text: 'UpperAlpha', value: 'upperAlpha' },
                        { text: 'LowerGreek', value: 'lowerGreek' },
                        { text: 'Hebrew', value: 'hebrew' },
                        { text: 'Katakana', value: 'katakana'},
                        { text: 'Star', value: 'listImage', listImage: 'url("https://mdn.mozillademos.org/files/11981/starsolid.gif")'},
                    ]
                },
                bulletFormatList: {
                    types: [
                        { text: 'None', value: 'none' },
                        { text: 'Square', value: 'square' },
                        { text: 'Circle', value: 'listImage', listImage: 'linear-gradient(to left bottom, red, blue)'}
                    ]
                },
                value: `<p id="rte">RichTextEditor</p>`
            });
            rteEle = rteObj.element;
            controlId = rteEle.id;
            done();
        });
        it(' Checking the NumberFormatListlist style image to style type', (done) => {
            let pEle: HTMLElement = rteObj.element.querySelector('#rte');
            expect(pEle.tagName !== 'LI').toBe(true);
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.element.querySelector('#rte').childNodes[0], rteObj.element.querySelector('#rte').childNodes[0], 0, 14);
            let numberFormatList: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_NumberFormatList');
            dispatchEvent(numberFormatList, 'mousedown');
            dispatchEvent(numberFormatList, 'mouseup');
            numberFormatList.click();
            let items: any = document.querySelectorAll('#' + controlId + '_toolbar_NumberFormatList-popup .e-item');
            items[6].click();
            expect(pEle.style.listStyleImage === 'url("https://mdn.mozillademos.org/files/11981/starsolid.gif")').toBe(true);
            expect(rteObj.element.querySelector('#rte').tagName === 'OL').toBe(true);
            let numberFormatList1: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_NumberFormatList');
            dispatchEvent(numberFormatList1, 'mousedown');
            dispatchEvent(numberFormatList1, 'mouseup');
            numberFormatList1.click();
            let item: any = document.querySelectorAll('#' + controlId + '_toolbar_NumberFormatList-popup .e-item');
            item[3].click();
            let Elem: HTMLElement = rteObj.element.querySelector('#rte');
            expect((Elem.childNodes[0] as HTMLElement).tagName === 'LI').toBe(true);
            expect(Elem.tagName === 'OL').toBe(true);
            expect(Elem.style.listStyleType === 'lower-greek').toBe(true);
            expect(Elem.style.listStyleImage === 'none').toBe(true);
            done();
            });
        it(' Checking the BulletFormatList list style image to style type', (done) => {
            let pEle: HTMLElement = rteObj.element.querySelector('#rte');
            expect(pEle.tagName !== 'LI').toBe(true);
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.element.querySelector('#rte').childNodes[0], rteObj.element.querySelector('#rte').childNodes[0], 0, 14);
            let bulletFormatList: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_BulletFormatList');
            dispatchEvent(bulletFormatList, 'mousedown');
            dispatchEvent(bulletFormatList, 'mouseup');
            bulletFormatList.click();
            let items: any = document.querySelectorAll('#' + controlId + '_toolbar_BulletFormatList-popup .e-item');
            items[2].click();
            expect(pEle.style.listStyleImage === 'linear-gradient(to left bottom, red, blue)').toBe(true);
            expect(rteObj.element.querySelector('#rte').tagName === 'UL').toBe(true);
            let bulletFormatList1: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_BulletFormatList');
            dispatchEvent(bulletFormatList1, 'mousedown');
            dispatchEvent(bulletFormatList1, 'mouseup');
            bulletFormatList1.click();
            let item: any = document.querySelectorAll('#' + controlId + '_toolbar_BulletFormatList-popup .e-item');
            item[1].click();
            let Elem: HTMLElement = rteObj.element.querySelector('#rte');
            expect((Elem.childNodes[0] as HTMLElement).tagName === 'LI').toBe(true);
            expect(Elem.tagName === 'UL').toBe(true);
            expect(Elem.style.listStyleType === 'square').toBe(true);
            expect(Elem.style.listStyleImage === 'none').toBe(true);
            done();
            });
            afterEach(() => {
                destroy(rteObj);
            });
        });

    describe('Checking the LI tag', () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        let controlId: string;
        beforeEach((done: Function) => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['NumberFormatList', 'BulletFormatList']
                },
                value: `<p id="rte">RichTextEditor</p>`
            });
            rteEle = rteObj.element;
            controlId = rteEle.id;
            done();
        });
        it(' Check the numberFormatList with LI tag', (done) => {
            let pEle: HTMLElement = rteObj.element.querySelector('#rte');
            let node = pEle.parentElement as HTMLElement;
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.element.querySelector('#rte').childNodes[0], rteObj.element.querySelector('#rte').childNodes[0], 0, 14);
            let numberFormatList: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_NumberFormatList');
            dispatchEvent(numberFormatList, 'mousedown');
            dispatchEvent(numberFormatList, 'mouseup');
            numberFormatList.click();
            let items: any = document.querySelectorAll('#' + controlId + '_toolbar_NumberFormatList-popup .e-item');
            items[3].click();
            expect((rteObj.element.querySelector('#rte').childNodes[0] as HTMLElement).tagName === 'LI').toBe(true);
            expect(rteObj.element.querySelector('#rte').tagName === 'OL').toBe(true);
            expect(pEle.style.listStyleType === 'lower-roman').toBe(true);
            done();
            });
        it(' Check the bulletFormatList with LI tag', (done) => {
            let pEle: HTMLElement = rteObj.element.querySelector('#rte');
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.element.querySelector('#rte').childNodes[0], rteObj.element.querySelector('#rte').childNodes[0], 0, 14);
            let bulletFormatList: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_BulletFormatList');
            dispatchEvent(bulletFormatList, 'mousedown');
            dispatchEvent(bulletFormatList, 'mouseup');
            bulletFormatList.click();
            let items: any = document.querySelectorAll('#' + controlId + '_toolbar_BulletFormatList-popup .e-item');
            items[2].click();
            expect((rteObj.element.querySelector('#rte').childNodes[0] as HTMLElement).tagName === 'LI').toBe(true);
            expect(rteObj.element.querySelector('#rte').tagName === 'UL').toBe(true);
            expect(pEle.style.listStyleType === 'circle').toBe(true);
            done();
            });
            afterEach(() => {
                destroy(rteObj);
            });
        });

    describe('Checking the OL tag to UL', () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        let controlId: string;
        beforeEach((done: Function) => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['NumberFormatList', 'BulletFormatList']
                },
                numberFormatList: {
                    types: [
                        { text: 'None', value:'none' },
                        { text: 'Number', value: 'decimal' },
                        { text: 'UpperAlpha', value: 'upperAlpha' },
                        { text: 'LowerGreek', value: 'lowerGreek' },
                        { text: 'Hebrew', value: 'hebrew' },
                        { text: 'Katakana', value: 'katakana'},
                        { text: 'Star', value: 'listImage', listImage: 'url("https://mdn.mozillademos.org/files/11981/starsolid.gif")'},
                    ]
                },
                bulletFormatList: {
                    types: [
                        { text: 'None', value: 'none' },
                        { text: 'Square', value: 'square' },
                        { text: 'Circle', value: 'listImage', listImage: 'linear-gradient(to left bottom, red, blue)'}
                    ]
                },
                value: `<p id="rte">RichTextEditor</p>`
            });
            rteEle = rteObj.element;
            controlId = rteEle.id;
            done();
        });
        it(' Check the numberFormatList list style image', (done) => {
            let pEle: HTMLElement = rteObj.element.querySelector('#rte');
            let node = pEle.parentElement as HTMLElement;
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.element.querySelector('#rte').childNodes[0], rteObj.element.querySelector('#rte').childNodes[0], 0, 14);
            let numberFormatList: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_NumberFormatList');
            dispatchEvent(numberFormatList, 'mousedown');
            dispatchEvent(numberFormatList, 'mouseup');
            numberFormatList.click();
            let items: any = document.querySelectorAll('#' + controlId + '_toolbar_NumberFormatList-popup .e-item');
            items[6].click();
            expect(pEle.style.listStyleImage === 'url("https://mdn.mozillademos.org/files/11981/starsolid.gif")').toBe(true);
            expect(rteObj.element.querySelector('#rte').tagName === 'OL').toBe(true);
            done();
            });
        it('  Check the bulletFormatList list style image', (done) => {
            let pEle: HTMLElement = rteObj.element.querySelector('#rte');
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.element.querySelector('#rte').childNodes[0], rteObj.element.querySelector('#rte').childNodes[0], 0, 14);
            let bulletFormatList: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_BulletFormatList');
            dispatchEvent(bulletFormatList, 'mousedown');
            dispatchEvent(bulletFormatList, 'mouseup');
            bulletFormatList.click();
            let items: any = document.querySelectorAll('#' + controlId + '_toolbar_BulletFormatList-popup .e-item');
            items[2].click();
            expect(pEle.style.listStyleImage === 'linear-gradient(to left bottom, red, blue)').toBe(true);
            expect(rteObj.element.querySelector('#rte').tagName === 'UL').toBe(true);
            done();
            });
        it(' Checking the numberFormatList tag to BulletFormatList', (done) => {
            let pEle: HTMLElement = rteObj.element.querySelector('#rte');
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.element.querySelector('#rte').childNodes[0], rteObj.element.querySelector('#rte').childNodes[0], 0, 14);
            let numberFormatList: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_NumberFormatList');
            dispatchEvent(numberFormatList, 'mousedown');
            dispatchEvent(numberFormatList, 'mouseup');
            numberFormatList.click();
            let items: any = document.querySelectorAll('#' + controlId + '_toolbar_NumberFormatList-popup .e-item');
            items[6].click();
            expect(pEle.style.listStyleImage === 'url("https://mdn.mozillademos.org/files/11981/starsolid.gif")').toBe(true);
            expect(rteObj.element.querySelector('#rte').tagName === 'OL').toBe(true);
            done();
            let bulletFormatList: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_BulletFormatList');
            dispatchEvent(bulletFormatList, 'mousedown');
            dispatchEvent(bulletFormatList, 'mouseup');
            bulletFormatList.click();
            let item: any = document.querySelectorAll('#' + controlId + '_toolbar_BulletFormatList-popup .e-item');
            item[2].click();
            pEle = rteObj.element.querySelector('#rte');
            expect(pEle.style.listStyleImage === 'linear-gradient(to left bottom, red, blue)').toBe(true);
            expect(rteObj.element.querySelector('#rte').tagName === 'UL').toBe(true);
            done();
            });
        it(' Checking the bulletFormatList tag to NumberFormatList', (done) => {
            let pEle: HTMLElement = rteObj.element.querySelector('#rte');
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.element.querySelector('#rte').childNodes[0], rteObj.element.querySelector('#rte').childNodes[0], 0, 14);
            let bulletFormatList: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_BulletFormatList');
            dispatchEvent(bulletFormatList, 'mousedown');
            dispatchEvent(bulletFormatList, 'mouseup');
            bulletFormatList.click();
            let items: any = document.querySelectorAll('#' + controlId + '_toolbar_BulletFormatList-popup .e-item');
            items[2].click();
            expect(pEle.style.listStyleImage === 'linear-gradient(to left bottom, red, blue)').toBe(true);
            expect(rteObj.element.querySelector('#rte').tagName === 'UL').toBe(true);
            done();
            let numberFormatList: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_NumberFormatList');
            dispatchEvent(numberFormatList, 'mousedown');
            dispatchEvent(numberFormatList, 'mouseup');
            numberFormatList.click();
            let item: any = document.querySelectorAll('#' + controlId + '_toolbar_NumberFormatList-popup .e-item');
            item[6].click();
            pEle = rteObj.element.querySelector('#rte');
            expect(pEle.style.listStyleImage === 'url("https://mdn.mozillademos.org/files/11981/starsolid.gif")').toBe(true);
            expect(rteObj.element.querySelector('#rte').tagName === 'OL').toBe(true);
            done();
            });
        afterEach(() => {
            destroy(rteObj);
        });
    });

   


L10n.load({
    'de-DE': {
        'richtexteditor': {
            formatsDropDownParagraph: 'Absatz',
            formatsDropDownCode: 'Kodex',
            formatsDropDownQuotation: 'Zitat',
            formatsDropDownHeading1: 'Überschrift 1',
            formatsDropDownHeading2: 'Überschrift 2',
            formatsDropDownHeading3: 'Überschrift 3',
            formatsDropDownHeading4: 'Überschrift 4',
            fontNameSegoeUI: 'Segoe UI',
            fontNameArial: 'Arial',
            fontNameGeorgia: 'Georgia',
            fontNameImpact: 'Einschlag',
            fontNameTahoma: 'Tahoma',
            fontNameTimesNewRoman: 'Mal neu römisch',
            fontNameVerdana: 'Verdana'
        }
    }
});

describe("Toolbar - Actions Module", () => {
    beforeAll(() => {
        let css: string = ".e-richtexteditor { margin-top: 100px; height: 200px }" +
            ".e-toolbar { display: block; white-space: nowrap; position: relative; }" +
            ".e-toolbar-items { display: inline-block; }" +
            ".e-popup-open { display:block } .e-popup-close { display: none }" +
            ".e-toolbar-item { display: inline-block; }";
        let style: HTMLStyleElement = document.createElement('style');
        style.type = "text/css";
        style.id = "toolbar-style";
        style.appendChild(document.createTextNode(css));
        document.head.appendChild(style);
    });

    afterAll(() => {
        document.head.getElementsByClassName('toolbar-style')[0].remove();
    });

    describe("ToolbarSettings property testing", () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;

        beforeEach(() => {
            rteObj = renderRTE({});
            rteEle = rteObj.element;
        });

        afterEach(() => {
            destroy(rteObj);
        });

        it("toolbarSettings property default value testing", () => {
            expect(rteObj.toolbarSettings.enable).toBe(true);
            expect(rteObj.toolbarSettings.items.length).toBe(15);
            expect(rteObj.toolbarSettings.type).toBe(ToolbarType.Expand);
        });

        it("toolbarSettings - 'items' property default value testing", () => {
            expect(rteObj.toolbarSettings.items[0]).toBe("Bold");
            expect(rteObj.toolbarSettings.items[1]).toBe("Italic");
            expect(rteObj.toolbarSettings.items[2]).toBe("Underline");
            expect(rteObj.toolbarSettings.items[3]).toBe("|");
            expect(rteObj.toolbarSettings.items[4]).toBe("Formats");
            expect(rteObj.toolbarSettings.items[5]).toBe("Alignments");
            expect(rteObj.toolbarSettings.items[6]).toBe("OrderedList");
            expect(rteObj.toolbarSettings.items[7]).toBe("UnorderedList");
            expect(rteObj.toolbarSettings.items[8]).toBe("|");
            expect(rteObj.toolbarSettings.items[9]).toBe("CreateLink");
            expect(rteObj.toolbarSettings.items[10]).toBe("Image");
            expect(rteObj.toolbarSettings.items[11]).toBe("|");
            expect(rteObj.toolbarSettings.items[12]).toBe("SourceCode");
            expect(rteObj.toolbarSettings.items[13]).toBe("Undo");
            expect(rteObj.toolbarSettings.items[14]).toBe("Redo");
        });

        it("toolbarSettings - 'items' property default value element testing", () => {
            let tbItems: NodeList = rteEle.querySelectorAll(".e-toolbar-item");
            expect((<HTMLElement>tbItems.item(0)).firstElementChild.id.indexOf("Bold") > 0).toBe(true);
            expect((<HTMLElement>tbItems.item(1)).firstElementChild.id.indexOf("Italic") > 0).toBe(true);
            expect((<HTMLElement>tbItems.item(2)).firstElementChild.id.indexOf("Underline") > 0).toBe(true);
            expect((<HTMLElement>tbItems.item(3)).classList.contains("e-separator")).toBe(true);
            expect((<HTMLElement>tbItems.item(4)).firstElementChild.id.indexOf("Formats") > 0).toBe(true);
            expect((<HTMLElement>tbItems.item(5)).firstElementChild.id.indexOf("Alignments") > 0).toBe(true);
            expect((<HTMLElement>tbItems.item(6)).firstElementChild.id.indexOf("OrderedList") > 0).toBe(true);
            expect((<HTMLElement>tbItems.item(7)).firstElementChild.id.indexOf("UnorderedList") > 0).toBe(true);
            expect((<HTMLElement>tbItems.item(8)).classList.contains("e-separator")).toBe(true);
            expect((<HTMLElement>tbItems.item(9)).firstElementChild.id.indexOf("CreateLink") > 0).toBe(true);
            expect((<HTMLElement>tbItems.item(10)).firstElementChild.id.indexOf("Image") > 0).toBe(true);
            expect((<HTMLElement>tbItems.item(11)).classList.contains("e-separator")).toBe(true);
            expect((<HTMLElement>tbItems.item(12)).firstElementChild.id.indexOf("SourceCode") > 0).toBe(true);
            expect((<HTMLElement>tbItems.item(13)).firstElementChild.id.indexOf("Undo") > 0).toBe(true);
            expect((<HTMLElement>tbItems.item(14)).firstElementChild.id.indexOf("Redo") > 0).toBe(true);
        });
    });

    describe("Toolbar availability testing", () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;

        afterEach(() => {
            destroy(rteObj);
        });

        it("Default toolbarType with testing", () => {
            rteObj = renderRTE({});
            rteEle = rteObj.element;
            expect(rteEle.querySelectorAll(".e-toolbar").length).toBe(1);
        });

        it("ToolbarType as 'Standard' with testing", () => {
            rteObj = renderRTE({
                toolbarSettings: {
                    type: ToolbarType.Expand
                }
            });
            rteEle = rteObj.element;
            expect(rteEle.querySelectorAll(".e-toolbar").length).toBe(1);
        });

        it("ToolbarType as 'Floating' with testing", () => {
            rteObj = renderRTE({
                toolbarSettings: {
                    enableFloating: true,
                    type: ToolbarType.Expand
                }
            });
            rteEle = rteObj.element;
            expect(rteEle.querySelectorAll(".e-toolbar").length).toBe(1);
        });

        it("ToolbarType as 'Expand' with testing", () => {
            rteObj = renderRTE({
                toolbarSettings: {
                    type: ToolbarType.Expand
                }
            });
            rteEle = rteObj.element;
            expect(rteEle.querySelectorAll(".e-toolbar").length).toBe(1);
        });

        it("ToolbarType as 'InLine' with testing", () => {
            rteObj = renderRTE({
                inlineMode: {
                    enable: true
                }
            });
            rteEle = rteObj.element;
            expect(rteEle.querySelectorAll(".e-rte-inline-popup").length).toBe(0);
        });

        it("ToolbarSettings - 'enable' property as 'false' with testing", () => {
            rteObj = renderRTE({
                toolbarSettings: {
                    enable: false
                }
            });
            rteEle = rteObj.element;
            expect(rteEle.querySelectorAll(".e-toolbar").length).toBe(0);
            //hidden textarea, so count will be 2
            expect(rteEle.children.length).toBe(2);
        });
    });

    describe("getToolbar public method testing", () => {
        let rteObj: RichTextEditor;

        afterEach(() => {
            destroy(rteObj);
        });

        it("DIV - toolbar element testing", () => {
            rteObj = renderRTE({});
            expect(rteObj.getToolbar()).not.toBe(null);
            expect(rteObj.getToolbar().classList.contains("e-toolbar")).toBe(true);
            expect(rteObj.getToolbar().classList.contains("e-control")).toBe(true);
        });

        it("IFrame - toolbar element testing", () => {
            rteObj = renderRTE({
                iframeSettings: {
                    enable: true
                }
            });
            expect(rteObj.getToolbar()).not.toBe(null);
            expect(rteObj.getToolbar().classList.contains("e-toolbar")).toBe(true);
            expect(rteObj.getToolbar().classList.contains("e-control")).toBe(true);
        });

        it("DIV - toolbarSettings - 'enable' property disable with toolbar element testing", () => {
            rteObj = renderRTE({
                toolbarSettings: {
                    enable: false
                }
            });
            expect(rteObj.getToolbar()).toBe(null);
        });

        it("IFrame - toolbarSettings - 'enable' property disable with toolbar element testing", () => {
            rteObj = renderRTE({
                iframeSettings: {
                    enable: true
                },
                toolbarSettings: {
                    enable: false
                }
            });
            expect(rteObj.getToolbar()).toBe(null);
        });
    });

    describe("toolbarSettings - 'items' property customize value testing", () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;

        afterEach(() => {
            destroy(rteObj);
        });

        it("Customize value as string", () => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ["Bold", "Italic", "|", "FullScreen"]
                }
            });
            rteEle = rteObj.element;
            expect(rteObj.toolbarSettings.items.length).toBe(4);
            expect(rteObj.toolbarSettings.items[0]).toBe("Bold");
            expect(rteObj.toolbarSettings.items[1]).toBe("Italic");
            expect(rteObj.toolbarSettings.items[2]).toBe("|");
            expect(rteObj.toolbarSettings.items[3]).toBe("FullScreen");
        });

        it("Customize value as string with element testing", () => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ["Bold", "Italic", "|", "FullScreen"]
                }
            });
            rteEle = rteObj.element;
            let tbItems: NodeList = rteEle.querySelectorAll(".e-toolbar-item");
            expect((<HTMLElement>tbItems.item(0)).firstElementChild.id.indexOf("Bold") > 0).toBe(true);
            expect((<HTMLElement>tbItems.item(1)).firstElementChild.id.indexOf("Italic") > 0).toBe(true);
            expect((<HTMLElement>tbItems.item(2)).classList.contains("e-separator")).toBe(true);
            expect((<HTMLElement>tbItems.item(3)).firstElementChild.id.indexOf("Maximize") > 0).toBe(true);
        });

        it("Object collection with items list testing", () => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: [
                        { tooltipText: "CustomButton", template: "<button>Button</button>" },
                        { tooltipText: "CustomText", template: "<p></p>" }
                    ]
                }
            });
            let tbItemsEle: HTMLElement[] = selectAll(".e-toolbar-item", rteObj.element);
            expect(tbItemsEle.length).toBe(2);
            expect(tbItemsEle[0].title).toBe("CustomButton");
            expect(tbItemsEle[1].title).toBe("CustomText");
        });

        it("Using both string and Object collection with items list testing", () => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: [
                        "Bold", "Italic", "|", "FullScreen",
                        { tooltipText: "CustomButton", template: "<button>Button</button>" },
                        { tooltipText: "CustomText", template: "<p></p>" }
                    ]
                }
            });
            let tbItemsEle: HTMLElement[] = selectAll(".e-toolbar-item", rteObj.element);
            expect(tbItemsEle.length).toBe(6);
            expect(tbItemsEle[0].firstElementChild.id.indexOf("Bold") > 0).toBe(true);
            expect(tbItemsEle[1].firstElementChild.id.indexOf("Italic") > 0).toBe(true);
            expect(tbItemsEle[2].classList.contains("e-separator")).toBe(true);
            expect(tbItemsEle[3].firstElementChild.id.indexOf("Maximize") > 0).toBe(true);
            expect(tbItemsEle[4].title).toBe("CustomButton");
            expect(tbItemsEle[5].title).toBe("CustomText");
        });

        it("ToolbarSettings as empty object testing", () => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: []
                }
            });
            let tbItemsEle: HTMLElement[] = selectAll(".e-toolbar-item", rteObj.element);
            expect(tbItemsEle.length).toBe(0);
        });
    });

    describe("showFullScreen public method testing", () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;

        beforeEach(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ["Bold"]
                }
            });
            rteEle = rteObj.element;
        });

        afterEach(() => {
            destroy(rteObj);
        });

        it("Class testing", () => {
            expect(rteEle.classList.contains("e-rte-full-screen")).toBe(false);
            rteObj.showFullScreen();
            expect(rteEle.classList.contains("e-rte-full-screen")).toBe(true);
            rteObj.showFullScreen();
            expect(rteEle.classList.contains("e-rte-full-screen")).toBe(true);
        });

        it("Minimize button availability testing", () => {
            expect(rteEle.querySelectorAll(".e-toolbar-item")[1]).toBe(undefined);
            rteObj.showFullScreen();
            expect(rteEle.querySelectorAll(".e-toolbar-item")[0].getAttribute("title")).toBe("Minimize");
            expect(rteEle.querySelectorAll(".e-toolbar-item")[0].querySelector("span").classList.contains("e-minimize")).toBe(true);
            expect(rteEle.querySelectorAll(".e-toolbar-item")[0].firstElementChild.id.indexOf("Minimize") > 0).toBe(true);
        });
    });

    describe(" Without toolbar - showFullScreen public method testing", () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;

        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    enable: false
                }
            });
            rteEle = rteObj.element;
        });

        afterAll(() => {
            destroy(rteObj);
        });

        it("showFullScreen", () => {
            rteObj.fullScreenModule.showFullScreen();
            expect(rteEle.classList.contains("e-rte-full-screen")).toBe(true);
        });

        it("hideFullScreen", () => {
            rteObj.fullScreenModule.hideFullScreen();
            expect(rteEle.classList.contains("e-rte-full-screen")).toBe(false);
        });
    });

    describe("Toolbar module addTBarItem private method testing", () => {
        let rteEle: HTMLElement;
        let rteObj: any;

        beforeEach(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ["Bold"]
                }
            });
            rteEle = rteObj.element;
        });

        afterEach(() => {
            destroy(rteObj);
        });

        it("addTBarItem method testing with text as empty string", () => {
            expect(rteEle.querySelectorAll(".e-toolbar-item").length).toBe(1);
            expect(rteEle.querySelectorAll(".e-toolbar-item")[0].firstElementChild.id.indexOf("Bold") > 0).toBe(true);
            rteObj.toolbarModule.addTBarItem({ updateItem: 'Undo', targetItem: 'Undo', baseToolbar: rteObj.getBaseToolbarObject() }, 0);
            expect(rteEle.querySelectorAll(".e-toolbar-item").length).toBe(2);
            expect(rteEle.querySelectorAll(".e-tbar-btn-text").length).toBe(0);
            expect(rteEle.querySelectorAll(".e-toolbar-item")[0].firstElementChild.id.indexOf("Undo") > 0).toBe(true);
            expect(rteEle.querySelectorAll(".e-toolbar-item")[1].firstElementChild.id.indexOf("Bold") > 0).toBe(true);
        });
    });

    describe("Toolbar fullscreen item with maximize/minimize testing", () => {
        let rteEle: HTMLElement;
        let rteObj: any;
        let rteWrapper: HTMLElement;

        beforeEach(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ["Bold", "FullScreen"]
                }
            });
            rteEle = rteObj.element;
        });

        afterEach(() => {
            destroy(rteObj);
        });

        afterAll(() => {
            detach(rteWrapper);
        });

        it("Maximize, minimize button click testing", () => {
            let trgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item button")[1];
            expect(rteEle.querySelectorAll(".e-toolbar-item").length).toBe(2);
            expect(rteEle.querySelectorAll(".e-toolbar-item")[0].getAttribute("title")).toBe("Bold");
            expect(rteEle.querySelectorAll(".e-toolbar-item")[1].getAttribute("title")).toBe("Maximize");
            trgEle.click();
            expect(rteEle.querySelectorAll(".e-toolbar-item").length).toBe(2);
            expect(rteEle.querySelectorAll(".e-toolbar-item")[0].getAttribute("title")).toBe("Bold");
            expect(rteEle.querySelectorAll(".e-toolbar-item")[1].getAttribute("title")).toBe("Minimize");
            trgEle = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[1];
            trgEle.click();
            expect(rteEle.querySelectorAll(".e-toolbar-item").length).toBe(2);
            expect(rteEle.querySelectorAll(".e-toolbar-item")[0].getAttribute("title")).toBe("Bold");
            expect(rteEle.querySelectorAll(".e-toolbar-item")[1].getAttribute("title")).toBe("Maximize");
            rteObj.fullScreenModule.hideFullScreen();
            expect(rteEle.querySelectorAll(".e-toolbar-item").length).toBe(2);
            expect(rteEle.querySelectorAll(".e-toolbar-item")[0].getAttribute("title")).toBe("Bold");
            expect(rteEle.querySelectorAll(".e-toolbar-item")[1].getAttribute("title")).toBe("Maximize");
            trgEle = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[1];
            trgEle.click();
            expect(rteEle.querySelectorAll(".e-toolbar-item").length).toBe(2);
            expect(rteEle.querySelectorAll(".e-toolbar-item")[0].getAttribute("title")).toBe("Bold");
            expect(rteEle.querySelectorAll(".e-toolbar-item")[1].getAttribute("title")).toBe("Minimize");
            trgEle = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[1];
            trgEle.click();
            expect(rteEle.querySelectorAll(".e-toolbar-item").length).toBe(2);
            expect(rteEle.querySelectorAll(".e-toolbar-item")[0].getAttribute("title")).toBe("Bold");
            expect(rteEle.querySelectorAll(".e-toolbar-item")[1].getAttribute("title")).toBe("Maximize");
        });

        it("Scrollable div parent element with maximize testing", () => {
            let rteElement: HTMLElement = createElement('div', { id: 'rteSample' });
            rteWrapper = createElement('div', { id: 'rteWrapper', innerHTML: rteElement.outerHTML });
            document.body.appendChild(rteWrapper);
            let sample: RichTextEditor = new RichTextEditor({
                height: 1000,
                toolbarSettings: {
                    items: ["Bold", "FullScreen"]
                }
            });
            sample.appendTo('#rteSample');
            rteEle = sample.element;
            (<HTMLElement>select('#rteWrapper', document.body)).style.height = '300px';
            (<HTMLElement>select('#rteWrapper', document.body)).style.overflow = 'auto';
            let trgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item button")[1];
            expect(rteEle.querySelectorAll(".e-toolbar-item").length).toBe(2);
            expect(rteEle.querySelectorAll(".e-toolbar-item")[0].getAttribute("title")).toBe("Bold");
            expect(rteEle.querySelectorAll(".e-toolbar-item")[1].getAttribute("title")).toBe("Maximize");
            trgEle.click();
            expect(rteEle.querySelectorAll(".e-toolbar-item").length).toBe(2);
            expect(rteEle.querySelectorAll(".e-toolbar-item")[0].getAttribute("title")).toBe("Bold");
            expect(rteEle.querySelectorAll(".e-toolbar-item")[1].getAttribute("title")).toBe("Minimize");
        });
    });

    describe("Markdown-Toolbar fullscreen item with maximize/minimize testing", () => {
        let rteEle: HTMLElement;
        let rteObj: any;

        beforeEach(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ["Bold", "FullScreen"]
                },
                editorMode: 'Markdown'
            });
            rteEle = rteObj.element;
        });

        afterEach(() => {
            destroy(rteObj);
        });

        it("Maximize, minimize button click testing", () => {
            let trgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item button")[1];
            expect(rteEle.querySelectorAll(".e-toolbar-item").length).toBe(2);
            expect(rteEle.querySelectorAll(".e-toolbar-item")[0].getAttribute("title")).toBe("Bold");
            expect(rteEle.querySelectorAll(".e-toolbar-item")[1].getAttribute("title")).toBe("Maximize");
            trgEle.click();
            expect(rteEle.querySelectorAll(".e-toolbar-item").length).toBe(2);
            expect(rteEle.querySelectorAll(".e-toolbar-item")[0].getAttribute("title")).toBe("Bold");
            expect(rteEle.querySelectorAll(".e-toolbar-item")[1].getAttribute("title")).toBe("Minimize");
            trgEle = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[1];
            trgEle.click();
            expect(rteEle.querySelectorAll(".e-toolbar-item").length).toBe(2);
            expect(rteEle.querySelectorAll(".e-toolbar-item")[0].getAttribute("title")).toBe("Bold");
            expect(rteEle.querySelectorAll(".e-toolbar-item")[1].getAttribute("title")).toBe("Maximize");
            rteObj.fullScreenModule.hideFullScreen();
            expect(rteEle.querySelectorAll(".e-toolbar-item").length).toBe(2);
            expect(rteEle.querySelectorAll(".e-toolbar-item")[0].getAttribute("title")).toBe("Bold");
            expect(rteEle.querySelectorAll(".e-toolbar-item")[1].getAttribute("title")).toBe("Maximize");
            trgEle = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[1];
            trgEle.click();
            expect(rteEle.querySelectorAll(".e-toolbar-item").length).toBe(2);
            expect(rteEle.querySelectorAll(".e-toolbar-item")[0].getAttribute("title")).toBe("Bold");
            expect(rteEle.querySelectorAll(".e-toolbar-item")[1].getAttribute("title")).toBe("Minimize");
            trgEle = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[1];
            trgEle.click();
            expect(rteEle.querySelectorAll(".e-toolbar-item").length).toBe(2);
            expect(rteEle.querySelectorAll(".e-toolbar-item")[0].getAttribute("title")).toBe("Bold");
            expect(rteEle.querySelectorAll(".e-toolbar-item")[1].getAttribute("title")).toBe("Maximize");
        });
    });

    describe("Fixed toolbar testing", () => {
        let rteEle: HTMLElement;
        let rteObj: any;
        let inputEle: HTMLInputElement;

        let mobileUA: string = "Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) " +
            "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36";
        let defaultUA: string = navigator.userAgent;
        inputEle = createElement('input', { id: 'trgBtn', attrs: { type: 'text' } }) as HTMLInputElement;

        beforeEach(() => {
            document.body.appendChild(inputEle);
        });

        afterEach(() => {
            Browser.userAgent = defaultUA;
            detach(inputEle);
            destroy(rteObj);
        });

        it("DIV - Class testing", () => {
            rteObj = renderRTE({
                inlineMode: {
                    enable: true
                }
            });
            rteEle = rteObj.element;
            expect(rteEle.querySelectorAll(".e-toolbar").length).toBe(0);
            expect(rteEle.querySelector(".e-toolbar")).toBe(null);
            destroy(rteObj);
            Browser.userAgent = mobileUA;
            rteObj = renderRTE({
                inlineMode: {
                    enable: true
                }
            });
            rteEle = rteObj.element;
            expect(rteEle.querySelectorAll(".e-toolbar").length).toBe(1);
            expect(rteEle.querySelector(".e-toolbar").classList.contains("e-show")).toBe(false);
            destroy(rteObj);
            Browser.userAgent = defaultUA;
            rteObj = renderRTE({
                inlineMode: {
                    enable: true
                }
            });
            rteEle = rteObj.element;
            expect(rteEle.querySelectorAll(".e-toolbar").length).toBe(0);
            expect(rteEle.querySelector(".e-toolbar")).toBe(null);
        });

        it("DIV - Focus and blur based fixed toolbar visibility testing", () => {
            Browser.userAgent = mobileUA;
            rteObj = renderRTE({
                inlineMode: {
                    enable: true
                }
            });
            rteEle = rteObj.element;
            expect(rteEle.querySelectorAll(".e-toolbar").length).toBe(1);
            let cntEle: HTMLElement = rteEle.querySelector(".e-rte-content > .e-content");
            let mouseDownEvent: MouseEvent = document.createEvent("MouseEvents");
            mouseDownEvent.initEvent("mousedown", true, true);
            cntEle.dispatchEvent(mouseDownEvent);
            expect(rteEle.querySelector(".e-toolbar").classList.contains("e-show")).toBe(true);
            rteObj.toolbarModule.hideFixedTBar();
            expect(rteEle.querySelector(".e-toolbar").classList.contains("e-show")).toBe(false);
        });

        it("DIV - Content focus after toolbar interaction with focus state testing", () => {
            Browser.userAgent = mobileUA;
            rteObj = renderRTE({
                inlineMode: {
                    enable: true
                }
            });
            rteEle = rteObj.element;
            expect(rteEle.querySelectorAll(".e-toolbar").length).toBe(1);
            let cntEle: HTMLElement = rteEle.querySelector(".e-rte-content > .e-content");
            let mouseDownEvent: MouseEvent = document.createEvent("MouseEvents");
            mouseDownEvent.initEvent("mousedown", true, true);
            cntEle.dispatchEvent(mouseDownEvent);
            expect(rteEle.querySelector(".e-toolbar").classList.contains("e-show")).toBe(true);
            let trg: HTMLElement = <HTMLElement>document.querySelectorAll(".e-toolbar-item > button")[3];
            let clickEvent: MouseEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", true, true);
            trg.dispatchEvent(clickEvent);
            expect(rteEle.querySelector(".e-toolbar").classList.contains("e-show")).toBe(true);
            Browser.userAgent = defaultUA;
        });

        it("Page scroll with toolbar availability testing", (done: Function) => {
            Browser.userAgent = mobileUA;
            rteObj = renderRTE({
                height: 700,
                inlineMode: {
                    enable: true
                }
            });
            rteEle = rteObj.element;
            expect(rteEle.querySelector(".e-toolbar").classList.contains("e-show")).toBe(false);
            let cntEle: HTMLElement = rteEle.querySelector(".e-rte-content > .e-content");
            let mouseDownEvent: MouseEvent = document.createEvent("MouseEvents");
            mouseDownEvent.initEvent("mousedown", true, true);
            cntEle.dispatchEvent(mouseDownEvent);
            expect(rteEle.querySelector(".e-toolbar").classList.contains("e-show")).toBe(true);
            window.scrollTo(0, 100);
            setTimeout(() => {
                Browser.userAgent = defaultUA;
                expect(rteEle.querySelector(".e-toolbar").classList.contains("e-show")).toBe(true);
                done();
            }, 400);
        });

        it("DIV - Maximize/Minimize testing", (done: Function) => {
            let trg: HTMLElement;
            Browser.userAgent = mobileUA;
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ["Bold", "FullScreen"]
                }
            });
            rteEle = rteObj.element;
            expect(rteEle.querySelectorAll(".e-toolbar-item").length).toBe(2);
            expect(rteEle.querySelectorAll(".e-toolbar-item")[0].getAttribute("title")).toBe("Bold");
            expect(rteEle.querySelectorAll(".e-toolbar-item")[1].getAttribute("title")).toBe("Maximize");
            trg = <HTMLElement>document.querySelectorAll(".e-toolbar-item > button")[1];
            trg.click();
            setTimeout(() => {
                expect(rteEle.querySelectorAll(".e-toolbar-item")[1].getAttribute("title")).toBe("Minimize");
                trg = <HTMLElement>document.querySelectorAll(".e-toolbar-item > button")[1];
                trg.click();
                setTimeout(() => {
                    expect(rteEle.querySelectorAll(".e-toolbar-item")[1].getAttribute("title")).toBe("Maximize");
                    done();
                }, 200);
            }, 200);
        });

        it("Mobile - inlineMode with Maximize/Minimize testing", () => {
            let trg: HTMLElement;
            Browser.userAgent = mobileUA;
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ["Bold", "FullScreen"]
                },
                inlineMode: {
                    enable: true
                }
            });
            rteEle = rteObj.element;
            expect(rteEle.querySelectorAll(".e-toolbar-item").length).toBe(2);
            expect(rteEle.querySelectorAll(".e-toolbar-item")[0].getAttribute("title")).toBe("Bold");
            expect(rteEle.querySelectorAll(".e-toolbar-item")[1].getAttribute("title")).toBe("Maximize");
            trg = <HTMLElement>document.querySelectorAll(".e-toolbar-item > button")[1];
            let clickEvent: MouseEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", true, true);
            trg.dispatchEvent(clickEvent);
            trg.click();
            expect(rteEle.querySelectorAll(".e-toolbar-item")[1].getAttribute("title")).toBe("Minimize");
            trg = <HTMLElement>document.querySelectorAll(".e-toolbar-item > button")[1];
            trg.dispatchEvent(clickEvent);
            trg.click();
            expect(rteEle.querySelectorAll(".e-toolbar-item")[1].getAttribute("title")).toBe("Maximize");
        });

        it("IFrame - Class testing", () => {
            rteObj = renderRTE({
                inlineMode: {
                    enable: true
                },
                iframeSettings: {
                    enable: true
                }
            });
            rteEle = rteObj.element;
            expect(rteEle.querySelectorAll(".e-toolbar").length).toBe(0);
            destroy(rteObj);
            Browser.userAgent = mobileUA;
            rteObj = renderRTE({
                inlineMode: {
                    enable: true
                },
                iframeSettings: {
                    enable: true
                }
            });
            rteEle = rteObj.element;
            expect(rteEle.querySelectorAll(".e-toolbar").length).toBe(1);
            expect(rteEle.querySelector(".e-toolbar").classList.contains("e-show")).toBe(false);
            destroy(rteObj);
            Browser.userAgent = defaultUA;
            rteObj = renderRTE({
                inlineMode: {
                    enable: true
                },
                iframeSettings: {
                    enable: true
                }
            });
            rteEle = rteObj.element;
            expect(rteEle.querySelectorAll(".e-toolbar").length).toBe(0);
        });

        it("IFrame - Focus and blur based fixed toolbar visibility testing", () => {
            Browser.userAgent = mobileUA;
            rteObj = renderRTE({
                inlineMode: {
                    enable: true
                },
                iframeSettings: {
                    enable: true
                }
            });
            rteEle = rteObj.element;
            expect(rteEle.querySelector(".e-toolbar").classList.contains("e-show")).toBe(false);
            let cntEle: HTMLElement = (rteObj.contentModule.getPanel() as HTMLIFrameElement).contentDocument.querySelector("body");
            let mouseDownEvent: MouseEvent = document.createEvent("MouseEvents");
            mouseDownEvent.initEvent("mousedown", true, true);
            cntEle.dispatchEvent(mouseDownEvent);
            expect(rteEle.querySelector(".e-toolbar").classList.contains("e-show")).toBe(true);
        });

        it("IFrame - Content focus after toolbar interaction with focus state testing", () => {
            Browser.userAgent = mobileUA;
            rteObj = renderRTE({
                inlineMode: {
                    enable: true
                },
                iframeSettings: {
                    enable: true
                }
            });
            rteEle = rteObj.element;
            expect(rteEle.querySelector(".e-toolbar").classList.contains("e-show")).toBe(false);
            let cntEle: HTMLElement = (rteObj.contentModule.getPanel() as HTMLIFrameElement).contentDocument.querySelector("body");
            let mouseDownEvent: MouseEvent = document.createEvent("MouseEvents");
            mouseDownEvent.initEvent("mousedown", true, true);
            cntEle.dispatchEvent(mouseDownEvent);
            expect(rteEle.querySelector(".e-toolbar").classList.contains("e-show")).toBe(true);
            let trg: HTMLElement = <HTMLElement>document.querySelectorAll(".e-toolbar-item > button")[3];
            let clickEvent: MouseEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", true, true);
            trg.dispatchEvent(clickEvent);
            Browser.userAgent = defaultUA;
        });
    });

    describe("Floating toolbar testing", () => {
        let rteObj: RichTextEditor;
        let ele1: HTMLElement = createElement("div", { id: "div1", styles: "height: 900px" });
        let ele2: HTMLElement = createElement("div", { id: "div2", styles: "height: 400px" });

        beforeEach((done: Function) => {
            document.body.style.height = '2000px';
            rteObj = renderRTE({
                toolbarSettings: {
                    enableFloating: true,
                    type: ToolbarType.Expand
                },
                height: '800px',
                value: '<br /> <br /> <br /> <br /> <p id="trg"></p>',
            });
            document.body.appendChild(ele1);
            done();
        });

        afterEach(() => {
            document.body.style.height = '';
            destroy(rteObj);
            detach(ele1);
        });

        it("Class testing", (done: Function) => {
            expect(document.querySelector(".e-richtexteditor .e-toolbar").classList.contains("e-rte-tb-float")).toBe(false);
            window.scrollTo(0, 200);
            rteObj.fullScreenModule.showFullScreen();
            expect((rteObj.getToolbarElement() as HTMLElement).style.top === '0px').toBe(true);
            setTimeout(() => {
                expect(document.querySelector(".e-richtexteditor .e-toolbar").classList.contains("e-rte-tb-float")).toBe(true);
                window.scrollTo(0, 0);
                done();
            }, 500);
        });

        it("Out of viewable area with class testing", (done: Function) => {
            expect(document.querySelector(".e-richtexteditor .e-toolbar").classList.contains("e-rte-tb-float")).toBe(false);
            window.scrollTo(0, 1000);
            setTimeout(() => {
                expect(document.querySelector(".e-richtexteditor .e-toolbar").classList.contains("e-rte-tb-float")).toBe(false);
                done();
            }, 400);
        });

        it("Element as target testing", (done: Function) => {
            document.body.style.height = '';
            destroy(rteObj);
            document.body.appendChild(ele1);
            ele1.appendChild(ele2);
            ele1.style.height = '300px';
            ele1.style.overflow = 'auto';
            rteObj = new RichTextEditor({
                toolbarSettings: {
                    enableFloating: true,
                    type: ToolbarType.Expand
                },
                height: '800px',
                value: '<br /> <br /> <br /> <br /> <p id="trg"></p>',
            }, '#div2');
            expect(document.querySelector(".e-richtexteditor .e-toolbar").classList.contains("e-rte-tb-float")).toBe(false);
            ele1.scrollTo(0, 200);
            rteObj.fullScreenModule.showFullScreen();
            expect((rteObj.getToolbarElement() as HTMLElement).style.top === '0px').toBe(true);
            setTimeout(() => {
                expect(document.querySelector(".e-richtexteditor .e-toolbar").classList.contains("e-rte-tb-float")).toBe(true);
                window.scrollTo(0, 0);
                done();
            }, 500);
        });

        it("Floating with disabled - class testing", (done: Function) => {
            document.body.style.height = '';
            destroy(rteObj);
            document.body.appendChild(ele1);
            ele1.appendChild(ele2);
            ele1.style.height = '300px';
            ele1.style.overflow = 'auto';
            rteObj = new RichTextEditor({
                toolbarSettings: {
                    enableFloating: true,
                    type: ToolbarType.Expand
                },
                height: '800px',
                value: '<br /> <br /> <br /> <br /> <p id="trg"></p>',
            }, '#div2');
            expect(document.querySelector(".e-richtexteditor .e-toolbar").classList.contains("e-rte-tb-float")).toBe(false);
            ele1.scrollTo(0, 200);
            rteObj.fullScreenModule.showFullScreen();
            expect((rteObj.getToolbarElement() as HTMLElement).style.top === '0px').toBe(true);
            setTimeout(() => {
                expect(document.querySelector(".e-richtexteditor .e-toolbar").classList.contains("e-rte-tb-float")).toBe(true);
                rteObj.enabled = false;
                rteObj.dataBind();
                expect(document.querySelector(".e-richtexteditor .e-toolbar").classList.contains("e-rte-tb-float")).toBe(false);
                (rteObj.element.querySelector('.e-toolbar-item') as HTMLElement).click();
                window.scrollTo(0, 0);
                done();
            }, 500);
        });
    });

    describe("SourceCode view checking if dyncamically property is updated in DIV mode", () => {
        let rteObj: RichTextEditor;
        let ele1: HTMLElement = createElement("div", { id: "div1", styles: "height: 400px" });
        let controlId: string;
        let elem: HTMLElement;
        beforeEach((done: Function) => {
            rteObj = renderRTE({
                toolbarSettings: {
                    enableFloating: false,
                    items: ["Bold", "Italic", "SourceCode"]
                },
                value: 'The Rich Text Editor (RTE) control is an easy to render in\nclient side.',
            });
            document.body.appendChild(ele1);
            elem = rteObj.element;
            controlId = elem.id;
            done();
        });

        afterAll(() => {
            destroy(rteObj);
            detach(ele1);
        });

        it("Preventing the SourceCode view while updating the enableFloating dynamically", () => {
            expect(document.querySelector(".e-bold").parentElement.parentElement.attributes[1].value).toBe("false");
            expect(document.querySelector(".e-italic").parentElement.parentElement.attributes[1].value).toBe("false");
            expect(document.querySelector(".e-source-code").parentElement.parentElement.attributes[1].value).toBe("false");
            let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_SourceCode');
            item.click();
            expect((document.querySelector(".e-rte-srctextarea")as HTMLElement).style.display).toBe("block");            
            rteObj.toolbarSettings.enableFloating = true;
            rteObj.dataBind();
            expect(document.querySelector(".e-bold").parentElement.parentElement.attributes[1].value).toBe("true");
            expect(document.querySelector(".e-italic").parentElement.parentElement.attributes[1].value).toBe("true");
            expect(document.querySelector(".e-preview").parentElement.parentElement.attributes[1].value).toBe("false");
            expect((document.querySelector(".e-rte-srctextarea")as HTMLElement).style.display).toBe("block");            
        });
    });

    describe("Floating toolbar with transform element testing", () => {
        let rteObj: RichTextEditor;
        let ele1: HTMLElement = createElement("div", { id: "div1", styles: "height: 900px" });
        let ele2: HTMLElement = createElement("div", { id: "div2", styles: "height: 400px" });

        beforeEach((done: Function) => {
            document.body.style.height = '2000px';
            document.body.style.transform = 'translateX(0)';
            ele1.style.transform = 'translateX(0)';
            rteObj = renderRTE({
                toolbarSettings: {
                    enableFloating: true,
                    type: ToolbarType.Expand
                },
                height: '800px',
                value: '<br /> <br /> <br /> <br /> <p id="trg"></p>',
            });
            document.body.appendChild(ele1);
            done();
        });

        afterEach(() => {
            document.body.style.height = '';
            destroy(rteObj);
            detach(ele1);
            document.body.style.transform = '';
        });

        it("Class testing", (done: Function) => {
            expect(document.querySelector(".e-richtexteditor .e-toolbar").classList.contains("e-rte-tb-float")).toBe(false);
            window.scrollTo(0, 200);
            rteObj.fullScreenModule.showFullScreen();
            expect((rteObj.getToolbarElement() as HTMLElement).style.top === '0px').toBe(true);
            setTimeout(() => {
                expect(document.querySelector(".e-richtexteditor .e-toolbar").classList.contains("e-rte-tb-float")).toBe(true);
                window.scrollTo(0, 0);
                done();
            }, 500);
        });

        it("Out of viewable area with class testing", (done: Function) => {
            expect(document.querySelector(".e-richtexteditor .e-toolbar").classList.contains("e-rte-tb-float")).toBe(false);
            window.scrollTo(0, 1000);
            setTimeout(() => {
                expect(document.querySelector(".e-richtexteditor .e-toolbar").classList.contains("e-rte-tb-float")).toBe(false);
                done();
            }, 400);
        });

        it("Element as target testing", (done: Function) => {
            document.body.style.height = '';
            destroy(rteObj);
            document.body.appendChild(ele1);
            ele1.appendChild(ele2);
            ele1.style.height = '300px';
            ele1.style.overflow = 'auto';
            rteObj = new RichTextEditor({
                toolbarSettings: {
                    enableFloating: true,
                    type: ToolbarType.Expand
                },
                height: '800px',
                value: '<br /> <br /> <br /> <br /> <p id="trg"></p>',
            }, '#div2');
            expect(document.querySelector(".e-richtexteditor .e-toolbar").classList.contains("e-rte-tb-float")).toBe(false);
            ele1.scrollTo(0, 200);
            rteObj.fullScreenModule.showFullScreen();
            expect((rteObj.getToolbarElement() as HTMLElement).style.top === '0px').toBe(true);
            setTimeout(() => {
                expect(document.querySelector(".e-richtexteditor .e-toolbar").classList.contains("e-rte-tb-float")).toBe(true);
                window.scrollTo(0, 0);
                done();
            }, 500);
        });
    });

    describe("OnPropertyChange testing", () => {
        let rteEle: HTMLElement;
        let rteObj: any;

        afterEach(() => {
            destroy(rteObj);
        });

        it("toolbar element availability with OnPropertyChange testing", () => {
            rteObj = renderRTE({});
            rteEle = rteObj.element;
            expect(rteEle.querySelectorAll(".e-toolbar").length).toBe(1);
            rteObj.toolbarSettings.type = ToolbarType.MultiRow;
            rteObj.dataBind();
            expect(rteEle.querySelectorAll(".e-toolbar").length).toBe(1);
        });

        it("Toolbar element inavailability with onPropertyChange testing", () => {
            rteObj = renderRTE({});
            rteEle = rteObj.element;
            expect(rteEle.querySelectorAll(".e-toolbar").length).toBe(1);
            detach(rteEle.querySelector(".e-toolbar"));
            rteObj.toolbarSettings.type = ToolbarType.MultiRow;
            rteObj.dataBind();
            expect(rteEle.querySelectorAll(".e-toolbar").length).toBe(1);
        });

        it("enable/disable toolbar property testing", (done: Function) => {
            rteObj = renderRTE({
                toolbarSettings: {
                    enable: true
                }
            });
            rteEle = rteObj.element;
            expect(rteEle.querySelectorAll(".e-toolbar").length).toBe(1);
            expect(rteEle.querySelectorAll(".e-toolbar-item").length).toBe(15);
            rteObj.toolbarSettings.enable = false;
            rteObj.dataBind();
            setTimeout(() => {
                expect(rteEle.querySelectorAll(".e-toolbar").length).not.toBe(1);
                expect(rteEle.querySelectorAll(".e-toolbar").length).toBe(0);
                done();
            }, 400);
        });
    });

    describe("Custom button with click event bind testing", () => {
        let rteEle: HTMLElement;
        let rteObj: any;

        afterEach(() => {
            destroy(rteObj);
        });

        it("Click event testing", () => {
            let count: number = 0;
            rteObj = renderRTE({
                toolbarSettings: {
                    items: [
                        { tooltipText: "CustomButton", template: "<button id='customBtn'>Button</button>" },
                        { tooltipText: "CustomText", template: "<p></p>" }
                    ]
                }
            });
            rteEle = rteObj.element;
            expect(count).toBe(0);
            document.getElementById("customBtn").addEventListener("click", function (): void {
                count++;
            });
            (<HTMLElement>select(".e-toolbar-item button", rteEle)).click();
            expect(count).toBe(1);
        });
    });

    describe("'Formats' - Dropdown button item click testing", () => {
        let rteEle: HTMLElement;
        let rteObj: any;
        let mouseEventArgs: any;

        let mobileUA: string = "Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) " +
            "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36";
        let defaultUA: string = navigator.userAgent;

        beforeEach(() => {
            Browser.userAgent = mobileUA;
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ["Formats"]
                }
            });
            rteEle = rteObj.element;
        });

        afterEach(() => {
            Browser.userAgent = defaultUA;
            destroy(rteObj);
        });

        it("DropDownButton popup open and item click testing", () => {
            let formatDropDown: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item .e-dropdown-btn")[0];
            formatDropDown.click();
            expect(document.querySelector(".e-dropdown-popup").classList.contains("e-popup-close")).toBe(false);
            expect(document.querySelector(".e-dropdown-popup").classList.contains("e-popup-open")).toBe(true);
            expect(document.querySelector(".e-dropdown-popup .e-item").classList.contains('e-paragraph')).toBe(true);
            let formatDropDownItem: HTMLElement = <HTMLElement>document.querySelectorAll(".e-dropdown-popup .e-item")[0];
            mouseEventArgs = {
                target: formatDropDownItem
            };
            rteObj.toolbarModule.dropDownModule.formatDropDown.clickHandler(mouseEventArgs);
            expect(document.querySelector(".e-dropdown-popup")).not.toBe(null);
        });
    });

    describe("Dropdown button render testing", () => {
        let rteEle: HTMLElement;
        let rteObj: any;

        beforeEach(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ["Formats", "Alignments", "FontName", "FontSize"]
                }
            });
            rteEle = rteObj.element;
        });

        afterEach(() => {
            destroy(rteObj);
        });

        it("Check id of formats toolbar", () => {
            expect(rteEle.querySelectorAll(".e-toolbar-item")[0].firstElementChild.id.indexOf("Formats") > 0).toBe(true);
            expect(rteEle.querySelectorAll(".e-toolbar-item")[1].firstElementChild.id.indexOf("Alignments") > 0).toBe(true);
            expect(rteEle.querySelectorAll(".e-toolbar-item")[2].firstElementChild.id.indexOf("FontName") > 0).toBe(true);
            expect(rteEle.querySelectorAll(".e-toolbar-item")[3].firstElementChild.id.indexOf("FontSize") > 0).toBe(true);
        });

        it("DropDown button class testing", () => {
            expect(rteEle.querySelectorAll(".e-toolbar-item .e-dropdown-btn").length).toBe(4);
            expect(rteEle.querySelectorAll(".e-toolbar-item .e-dropdown-btn.e-control").length).toBe(4);
        });

        it("DropDownButton popup availability testing", () => {
            expect(document.querySelectorAll(".e-rte-dropdown-popup.e-popup")[0].id.indexOf("Alignments") > 0).toBe(true);
            expect(document.querySelectorAll(".e-rte-dropdown-popup.e-popup")[1].id.indexOf("Formats") > 0).toBe(true);
        });

        it("DropDownButton rerender testing", () => {
            rteObj.toolbarModule.dropDownModule.renderDropDowns({
                container: select('.e-toolbar', rteEle),
                containerType: 'toolbar',
                items: ["Formats", "Alignments", "FontName", "FontSize"]
            });
            expect(rteEle.querySelectorAll(".e-toolbar-item .e-dropdown-btn").length).toBe(4);
        });
    });

    describe("Expand toolbar testing", () => {
        let rteObj: any;
        let rteEle: HTMLElement;

        beforeAll(() => {
            rteObj = renderRTE({
                width: '200px',
                toolbarSettings: {
                    type: ToolbarType.Expand
                }
            });
            rteEle = rteObj.element;
            rteEle.style.height = 300 + 'px';
        });

        afterAll(() => {
            destroy(rteObj);
        });

        it("Class testing", () => {
            expect(document.querySelector(".e-richtexteditor").classList.contains("e-rte-tb-expand")).toBe(true);
            expect(document.querySelectorAll(".e-rte-toolbar").length).toBe(1);
        });

        it("Extend popup availability testing", () => {
            expect(document.querySelectorAll(".e-toolbar-extended").length).toBe(1);
            expect(document.querySelectorAll(".e-toolbar-extended")[0].classList.contains('e-popup-close')).toBe(true);
        });

        it("Expand popup open testing", (done: Function) => {
            let trg: HTMLElement = document.querySelector('.e-hor-nav');
            trg.click();
            setTimeout(() => {
                expect(document.querySelectorAll(".e-toolbar-extended")[0].classList.contains('e-popup-close')).toBe(false);
                expect(document.querySelectorAll(".e-toolbar-extended")[0].classList.contains('e-popup-open')).toBe(true);
                done();
            }, 400);
        });

        it("Expand popup close testing", (done: Function) => {
            let trg: HTMLElement = document.querySelector('.e-hor-nav');
            trg.click();
            setTimeout(() => {
                expect(document.querySelectorAll(".e-toolbar-extended")[0].classList.contains('e-popup-close')).toBe(true);
                expect(document.querySelectorAll(".e-toolbar-extended")[0].classList.contains('e-popup-open')).toBe(false);
                done();
            }, 400);
        });

        it("resize event trigger testing", () => {
            rteObj.resizeHandler();
            expect(document.querySelector(".e-richtexteditor").classList.contains("e-rte-tb-expand")).toBe(true);
        });
    });

    describe("Toolbar status update method testing", () => {
        let rteObj: any;

        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Bold', '|', 'Italic', 'SubScript', 'SuperScript', 'StrikeThrough', 'OrderedList',
                        'UnorderedList', 'UnderLine', 'Formats', 'FontName', 'FontSize', 'Alignments', 'InsertCode']
                }
            });
        });

        afterAll(() => {
            destroy(rteObj);
        });

        it("Class testing", () => {
            let tbItemsEle: HTMLElement[] = selectAll(".e-toolbar-item", rteObj.element);
            expect(tbItemsEle[0].classList.contains('e-active')).not.toBe(true);
            expect(tbItemsEle[1].classList.contains('e-active')).not.toBe(true);
            expect(tbItemsEle[2].classList.contains('e-active')).not.toBe(true);
            expect(tbItemsEle[3].classList.contains('e-active')).not.toBe(true);
            expect(tbItemsEle[4].classList.contains('e-active')).not.toBe(true);
            expect(tbItemsEle[5].classList.contains('e-active')).not.toBe(true);
            expect(tbItemsEle[6].classList.contains('e-active')).not.toBe(true);
            expect(tbItemsEle[7].classList.contains('e-active')).not.toBe(true);
            expect(tbItemsEle[8].classList.contains('e-active')).not.toBe(true);
            expect((<HTMLElement>tbItemsEle[9].firstElementChild).innerText.trim()).toBe('Paragraph');
            expect((<HTMLElement>tbItemsEle[10].firstElementChild).innerText.trim()).toBe('Segoe UI');
            expect((<HTMLElement>tbItemsEle[11].firstElementChild).innerText.trim()).toBe('10 pt');
            expect((<HTMLElement>tbItemsEle[12].firstElementChild).firstElementChild.classList.contains('e-justify-left')).toBe(true);
            expect((<HTMLElement>tbItemsEle[12].firstElementChild).firstElementChild.classList.contains('e-icons')).toBe(true);
            expect(tbItemsEle[13].classList.contains('e-active')).not.toBe(true);
        });

        it("Add toolbar status testing", () => {
            rteObj.toolbarModule.updateToolbarStatus({
                bold: true,
                italic: true,
                subscript: true,
                superscript: true,
                strikethrough: true,
                orderedlist: true,
                unorderedlist: true,
                underline: true,
                formats: 'Pre',
                fontname: 'Segoe UI',
                fontsize: '12pt',
                alignments: 'JustifyRight',
                insertcode: true
            } as IToolbarStatus);
            let tbItemsEle: HTMLElement[] = selectAll(".e-toolbar-item", rteObj.element);
            expect(tbItemsEle[0].classList.contains('e-active')).toBe(true);
            expect(tbItemsEle[1].classList.contains('e-active')).not.toBe(true);
            expect(tbItemsEle[2].classList.contains('e-active')).toBe(true);
            expect(tbItemsEle[3].classList.contains('e-active')).toBe(true);
            expect(tbItemsEle[4].classList.contains('e-active')).toBe(true);
            expect(tbItemsEle[5].classList.contains('e-active')).toBe(true);
            expect(tbItemsEle[6].classList.contains('e-active')).toBe(true);
            expect(tbItemsEle[7].classList.contains('e-active')).toBe(true);
            expect(tbItemsEle[8].classList.contains('e-active')).toBe(true);
            expect((<HTMLElement>tbItemsEle[9].firstElementChild).innerText.trim()).toBe('Code');
            expect((<HTMLElement>tbItemsEle[10].firstElementChild).innerText.trim()).toBe('Segoe UI');
            expect((<HTMLElement>tbItemsEle[11].firstElementChild).innerText.trim()).toBe('12 pt');
            expect((<HTMLElement>tbItemsEle[12].firstElementChild).firstElementChild.classList.contains('e-justify-right')).toBe(true);
            expect((<HTMLElement>tbItemsEle[12].firstElementChild).firstElementChild.classList.contains('e-icons')).toBe(true);
            expect(tbItemsEle[13].classList.contains('e-active')).toBe(true);
        });

        it("Remove toolbar status testing", () => {
            rteObj.toolbarModule.updateToolbarStatus({
                bold: false,
                italic: false,
                subscript: false,
                superscript: false,
                strikethrough: false,
                orderedlist: false,
                unorderedlist: false,
                underline: false,
                formats: 'P',
                fontname: 'Georgia,serif',
                fontsize: '14pt',
                alignments: 'JustifyLeft',
                insertcode: false
            } as IToolbarStatus);
            let tbItemsEle: HTMLElement[] = selectAll(".e-toolbar-item", rteObj.element);
            expect(tbItemsEle[0].classList.contains('e-active')).not.toBe(true);
            expect(tbItemsEle[1].classList.contains('e-active')).not.toBe(true);
            expect(tbItemsEle[2].classList.contains('e-active')).not.toBe(true);
            expect(tbItemsEle[3].classList.contains('e-active')).not.toBe(true);
            expect(tbItemsEle[4].classList.contains('e-active')).not.toBe(true);
            expect(tbItemsEle[5].classList.contains('e-active')).not.toBe(true);
            expect(tbItemsEle[6].classList.contains('e-active')).not.toBe(true);
            expect(tbItemsEle[7].classList.contains('e-active')).not.toBe(true);
            expect(tbItemsEle[8].classList.contains('e-active')).not.toBe(true);
            expect((<HTMLElement>tbItemsEle[9].firstElementChild).innerText.trim()).toBe('Paragraph');
            expect((<HTMLElement>tbItemsEle[10].firstElementChild).innerText.trim()).toBe('Georgia');
            expect((<HTMLElement>tbItemsEle[11].firstElementChild).innerText.trim()).toBe('14 pt');
            expect((<HTMLElement>tbItemsEle[12].firstElementChild).firstElementChild.classList.contains('e-justify-left')).toBe(true);
            expect((<HTMLElement>tbItemsEle[12].firstElementChild).firstElementChild.classList.contains('e-icons')).toBe(true);
            expect(tbItemsEle[13].classList.contains('e-active')).not.toBe(true);
        });
    });

    describe("Toolbar status update method testing", () => {
        let rteObj: any;

        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['InsertCode', 'SourceCode']
                }
            });
        });

        afterAll(() => {
            destroy(rteObj);
        });

        it("Status update after source code view", () => {
            rteObj.toolbarModule.updateToolbarStatus({
                insertcode: true
            } as IToolbarStatus);
            let tbItemsEle: HTMLElement[] = selectAll(".e-toolbar-item", rteObj.element);
            expect(tbItemsEle[0].classList.contains('e-active')).toBe(true);
            tbItemsEle[1].click();
            expect(tbItemsEle[0].classList.contains('e-active')).toBe(false);
        });
    });

    describe('Escape key from toolbar active item', () => {
        let rteObj: RichTextEditor;
        let elem: HTMLElement;
        let editNode: HTMLElement;
        let keyBoardEvent: any = { preventDefault: () => { }, type: 'keydown', stopPropagation: () => { }, ctrlKey: false, shiftKey: false, action: '', which: 8 };
        let innerHTML: string = `<div><p class='first-p'>First p node-0</p><p class='second-p'>First p node-1</p></div>`;
        beforeAll(() => {
            rteObj = renderRTE({});
            elem = rteObj.element;
            editNode = rteObj.contentModule.getEditPanel() as HTMLElement;
            editNode.innerHTML = innerHTML;
        });

        it('focus the edit area', () => {
            (elem.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).focus();
            keyBoardEvent.ctrlKey = false;
            keyBoardEvent.shiftKey = false;
            keyBoardEvent.action = 'escape';
            (rteObj as any).toolbarModule.toolBarKeyDown(keyBoardEvent);
            expect(document.activeElement === editNode).toBe(true);
        });

        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe('To open the dropdown button in the toolbar', () => {
        let rteObj: RichTextEditor;
        let elem: HTMLElement;
        let editNode: HTMLElement;
        let keyBoardEvent: any = { preventDefault: () => { }, type: 'keydown', stopPropagation: () => { }, ctrlKey: false, shiftKey: false, action: '', which: 8 };
        let innerHTML: string = `<div><p class='first-p'>First p node-0</p><p class='second-p'>First p node-1</p></div>`;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['FontName']
                }
            });
            elem = rteObj.element;
            editNode = rteObj.contentModule.getEditPanel() as HTMLElement;
            editNode.innerHTML = innerHTML;
        });

        it('open drop down button using keyboard', () => {
            let targetElm: HTMLElement = elem.querySelectorAll(".e-toolbar-item")[0].querySelector('button');
            keyBoardEvent.ctrlKey = false;
            keyBoardEvent.shiftKey = false;
            keyBoardEvent.key = 'Enter';
            keyBoardEvent.code = 'Enter';
            keyBoardEvent.keyCode = 13;
            keyBoardEvent.target = targetElm;
            (rteObj as any).toolbarModule.tbKeydownHandler(keyBoardEvent);
            expect(targetElm.getAttribute('tabindex') === '0').toBe(true);
        });

        afterAll(() => {
            destroy(rteObj);
        });
    });

    describe("EJ2-14546- toolbarSettings - 'itemConfigs' property ", () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let controlId:string;
        beforeEach(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ["Bold", "Italic", "|", "FontColor"],
                    itemConfigs: {
                        bold: {
                            icon: 'e-italic'
                        },
                        italic: {
                            icon: 'e-bold'
                        },
                        fontColor: {
                            icon: 'e-underline'
                        }
                    }
                }
            });
            rteEle = rteObj.element;
            controlId = rteEle.id;
        });
        afterEach(() => {
            destroy(rteObj);
        });

        it(" Change the default icons of toolbar items", () => {
            expect(!isNullOrUndefined(rteEle.querySelector("#"+controlId+"_toolbar_FontColor").querySelector(".e-underline"))).toBe(true);
            expect(!isNullOrUndefined(rteEle.querySelector("#"+controlId+"_toolbar_Italic").querySelector(".e-bold"))).toBe(true);
            expect(!isNullOrUndefined(rteEle.querySelector("#"+controlId+"_toolbar_Bold").querySelector(".e-italic"))).toBe(true);
        });
    });

    describe("EJ2-30374 - Issue with toolbar alignment when render Rich Text Editor within Tab", () => {
        let rteObj: any;
        let container: HTMLElement = createElement('div', { id: getUniqueID('container'), styles: 'height:800px;' });
        let element1: HTMLElement = createElement('div', { id: getUniqueID('rte-wrapper') });
        let element2: HTMLElement = createElement('div', { id: getUniqueID('rte-test'),  });

        beforeEach(() => {
            document.body.appendChild(container);
            container.appendChild(element1);
            element1.appendChild(element2);
            rteObj = new RichTextEditor({
                toolbarSettings: { enableFloating: true }
            });
            rteObj.appendTo(element2);
        });

        afterEach(() => {
            destroy(rteObj);
            detach(container);
        });

        it("Testing scroll with parent element in hidden mode", (done: Function) => {
            element1.style.display = "none";
            expect(document.querySelector(".e-richtexteditor .e-toolbar").classList.contains("e-rte-tb-float")).toBe(false);
            window.scrollTo(0, 100);
            setTimeout(() => {
                element1.style.display = "";
                expect(document.querySelector(".e-richtexteditor .e-toolbar").classList.contains("e-rte-tb-float")).toBe(false);
                window.scrollTo(0, 0);
                done();
            }, 500);
        });
    });

    describe("EJ2-31670 - Need to provide callback (event action) support for RTE custom toolbar", () => {
        let rteObj: any;
        let clickEventSpy: jasmine.Spy = jasmine.createSpy('customclick');
        let container: HTMLElement = createElement('div', { id: getUniqueID('container'), styles: 'height:800px;' });
        let element1: HTMLElement = createElement('div', { id: getUniqueID('rte-test'),  });

        beforeEach(() => {
            document.body.appendChild(container);
            container.appendChild(element1);
            rteObj = new RichTextEditor({
                toolbarSettings: { 
                    enableFloating: true,
                    items: ['Bold', 'Italic', 'Underline', '|', 'Undo','Redo',
                        {
                            tooltipText: 'Insert Symbol',
                            template: '<button class="e-tbar-btn e-btn" tabindex="-1" id="custom_tbar"  style="width:100%"><div class="e-tbar-btn-text" style="font-weight: 500;"> &#937;</div></button>',
                            click: clickEventSpy,
                            undo: true
                        }, '|', 'FullScreen']
                }
            });
            rteObj.appendTo(element1);
        });

        afterEach(() => {
            destroy(rteObj);
            detach(container);
        });

        it("Testing custom toolbar event", (done) => {
            document.getElementById('custom_tbar').click();
            setTimeout(() => {
                expect(clickEventSpy).toHaveBeenCalled();
                expect(rteObj.element.querySelector('[title="Undo"]').classList.contains('e-overlay')).toBe(true);
                done();
            }, 500);
        });
    });

    describe("MD - Table creation using toolbar item", () => {
        let rteObj: any;
        beforeEach(() => {
            rteObj = renderRTE({
                editorMode: 'Markdown',
                toolbarSettings: {
                    items: ['CreateTable']
                }
            })
        });

        afterEach(() => {
            destroy(rteObj);
        });

        it("Testing custom toolbar event", (done) => {
            (document.querySelector('.e-toolbar-item button') as HTMLElement).click();
            expect((document.querySelector('.e-rte-content textarea') as HTMLTextAreaElement).value.indexOf('Heading 1') > 0).toEqual(true);
            done();
        });
    });

    describe("Check undo in custom toolbar callback function", () => {
        let rteObj: any;
        let container: HTMLElement = createElement('div', { id: getUniqueID('container'), styles: 'height:800px;' });
        let element1: HTMLElement = createElement('div', { id: getUniqueID('rte-test'),  });

        beforeEach(() => {
            document.body.appendChild(container);
            container.appendChild(element1);
            rteObj = new RichTextEditor({
                toolbarSettings: { 
                    enableFloating: true,
                    items: ['Bold', 'Italic', 'Underline', '|', 'Undo','Redo',
                        {
                            tooltipText: 'Insert Symbol',
                            template: '<button class="e-tbar-btn e-btn" tabindex="-1" id="custom_tbar"  style="width:100%"><div class="e-tbar-btn-text" style="font-weight: 500;"> &#937;</div></button>',
                            click: function() {
                                let imgElement = document.createElement("img"); 
                                imgElement.src = "https://ej2.syncfusion.com/demos/src/rich-text-editor/images/RTEImage-Feather.png"; 
                                rteObj.executeCommand("insertImage", imgElement);
                            },
                            undo: true
                        }, '|', 'FullScreen']
                }
            });
            rteObj.appendTo(element1);
        });

        afterEach(() => {
            destroy(rteObj);
            detach(container);
        });

        it("Testing custom toolbar event", (done) => {
            document.getElementById('custom_tbar').click();
            setTimeout(() => {
                expect(rteObj.element.querySelector('[title="Undo"]').classList.contains('e-overlay')).toBe(false);
                done();
            }, 500);
        });
    });

    describe("Check toolbar click event in readyOnly", () => {
        let rteObj: any;
        let clickEventSpy: jasmine.Spy = jasmine.createSpy('toolbarClick');
        beforeEach(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ["Print"]
                },
                toolbarClick : clickEventSpy
            });
        });

        afterEach(() => {
            destroy(rteObj);
        });

        it("Check style", (done) => {
            expect((rteObj.element.querySelector('[title="Print"]') as HTMLElement).style.pointerEvents).toBe('');
            rteObj.element.querySelector('[title="Print"]').click();
            setTimeout(() => {
                expect(clickEventSpy).toHaveBeenCalled();
                done();
            }, 500);
        });
    });

    describe("Scrollable toolbar", () => {
        let rteObj: any;
        beforeEach(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                type: ToolbarType.Scrollable,
                items: ['Undo', 'Redo', '|',
                    'Bold', 'Italic', 'Underline', 'StrikeThrough', '|',
                    'FontName', 'FontSize', 'FontColor', 'BackgroundColor', '|',
                    'SubScript', 'SuperScript', '|',
                    'Bold', 'Italic', 'Underline', 'StrikeThrough', '|',
                    'FontName', 'FontSize', 'FontColor', 'BackgroundColor', '|',
                    'SubScript', 'SuperScript', '|',
                    'LowerCase', 'UpperCase', '|', 
                    'Formats', 'Alignments', '|', 'OrderedList', 'UnorderedList', '|',
                    'Indent', 'Outdent', '|', 'CreateTable', '|', 'CreateLink', '|', 'Image', '|', 'SourceCode',
                    '|', 'ClearFormat', 'Print', 'InsertCode']
            }
            })
        });
        afterEach(() => {
            destroy(rteObj);
        });
        it("Check class", () => {
           expect(rteObj.element.querySelector('.e-scroll-right-nav')).not.toBe('null');
           expect(rteObj.element.querySelector('.e-scroll-left-nav')).not.toBe('null');
        });
    });

    describe("EJ2-46687 - Warning occurs when using the ‘executeCommand’ public method with ‘insertHorizontalRule’", () => {
        let rteObj: any;
        let range: Range;
        let selection: NodeSelection = new NodeSelection();

        beforeEach(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: [
                        {
                            tooltipText: 'Insert HR',
                            template: '<button class="e-tbar-btn e-btn" tabindex="-1" id="custom_tbar"  style="width:100%"><div class="e-tbar-btn-text" style="font-weight: 500;">_</div></button>',
                            click: function() {
                                range = selection.getRange(document);
                                var currentEle =
                                  range.startContainer.nodeName === "#text"
                                    ? range.startContainer.parentElement
                                    : range.startContainer;
                                if (currentEle === rteObj.inputElement || closest(currentEle, '.e-content') === null) {
                                  var allElements = rteObj.inputElement.childNodes;
                                  for (var i = 0; allElements.length; i++) {
                                    if (allElements[i].nodeName != "HR") {
                                      selection.setCursorPoint(document, allElements[i] as Element, 0);
                                      break;
                                    }
                                  }
                                }
                                rteObj.executeCommand("insertHorizontalRule");
                                rteObj.formatter.saveData();
                            },
                            undo: true
                        }, '|', 'FullScreen']
                }
            });
        });

        afterEach(() => {
            destroy(rteObj);
        });

        it("Warning availability testing", () => {
            console.warn = jasmine.createSpy("warn");
            document.getElementById('custom_tbar').click();
            expect(rteObj.element.querySelectorAll('.e-content hr').length).toBe(1);
            expect(console.warn).not.toHaveBeenCalled();
        });
    });
    describe('Localization text for Formats and Font family', () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        let controlId: string;
        beforeEach((done: Function) => {
            rteObj = renderRTE({
                locale: 'de-DE',
                toolbarSettings: {
                    items: ['FontName', 'Formats']
                },
            });
            rteEle = rteObj.element;
            controlId = rteEle.id;
            done();
        });
        it(' Check the formats dropdown items ', (done) => {
            let format: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Formats');
            dispatchEvent(format, 'mousedown');
            dispatchEvent(format, 'mouseup');
            format.click();
            setTimeout(() => {
                let items: any = document.querySelectorAll('#' + controlId + '_toolbar_Formats-popup .e-item');
                expect(items[0].textContent === 'Absatz').toBe(true);
                expect(items[1].textContent === 'Kodex').toBe(true);
                expect(items[2].textContent === 'Zitat').toBe(true);
                expect(items[3].textContent === 'Überschrift 1').toBe(true);
                expect(items[4].textContent === 'Überschrift 2').toBe(true);
                expect(items[5].textContent === 'Überschrift 3').toBe(true);
                expect(items[6].textContent === 'Überschrift 4').toBe(true);
                done();
            }, 200)
        });
        it(' Check the fontFamily dropdown items ', (done) => {
            let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_FontName');
            dispatchEvent(item, 'mousedown');
            dispatchEvent(item, 'mouseup');
            item.click();
            setTimeout(() => {
                let items: any = document.querySelectorAll('#' + controlId + '_toolbar_FontName-popup .e-item');
                expect(items[0].textContent === 'Segoe UI').toBe(true);
                expect(items[1].textContent === 'Arial').toBe(true);
                expect(items[2].textContent === 'Georgia').toBe(true);
                expect(items[3].textContent === 'Einschlag').toBe(true);
                expect(items[4].textContent === 'Tahoma').toBe(true);
                expect(items[5].textContent === 'Mal neu römisch').toBe(true);
                expect(items[6].textContent === 'Verdana').toBe(true);
                done();
            }, 200)
        });
        afterEach(() => {
            destroy(rteObj);
        });
    });
    describe('Check whether the selected text changed to the selected format and font name', () => {
            let rteObj: RichTextEditor;
            let rteEle: HTMLElement;
            let controlId: string;
            beforeEach((done: Function) => {
                rteObj = renderRTE({
                    locale: 'de-DE',
                    toolbarSettings: {
                        items: ['FontName', 'Formats']
                    },
                    value: `<p id="rte">RichTextEditor</p>`
                });
                rteEle = rteObj.element;
                controlId = rteEle.id;
                done();
            });
        it(' Check whether the selected text changed to the selected font name ', (done) => {
            let pEle: HTMLElement = rteObj.element.querySelector('#rte');
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.element.querySelector('#rte').childNodes[0], rteObj.element.querySelector('#rte').childNodes[0], 0, 14);
            let fontname: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_FontName');
            dispatchEvent(fontname, 'mousedown');
            dispatchEvent(fontname, 'mouseup');
            fontname.click();
            let items: any = document.querySelectorAll('#' + controlId + '_toolbar_FontName-popup .e-item');
            items[1].click();
            let span: HTMLSpanElement = pEle.querySelector('span');
            expect(span.style.fontFamily === 'Arial, Helvetica, sans-serif').toBe(true);
            done();
        });
        it(' Check whether the selected text changed to the selected format ', (done) => {
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.element.querySelector('#rte').childNodes[0], rteObj.element.querySelector('#rte').childNodes[0], 0, 14);
            let format: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Formats');
            dispatchEvent(format, 'mousedown');
            dispatchEvent(format, 'mouseup');
            format.click();
            let items: any = document.querySelectorAll('#' + controlId + '_toolbar_Formats-popup .e-item');
            items[3].click();
            expect(rteObj.element.querySelector('#rte').tagName === 'H1').toBe(true);
            done();
        });
        afterEach(() => {
            destroy(rteObj);
        });
    });
});

describe(" EJ2-59527 - Floating toolbar testing", () => {
    it("EJ2-59527 - with target and with extra element as top", (done: Function) => {
        let rteObj: RichTextEditor;
        let ele1: HTMLElement = createElement("div", { id: "div1", className: "default-section", styles: "height: 400px;" });
        document.body.appendChild(ele1);
        let ele2: HTMLElement = createElement("div", { id: "div2", styles: "height: 100px; background-color: red;" });
        ele1.appendChild(ele2);
        let ele3: HTMLElement = createElement("div", { id: "div3", styles: "height: 300px; overflow: scroll" });
        ele1.appendChild(ele3);
        let ele4: HTMLElement = createElement("div", { id: "defaultFloatRTE"});
        ele3.appendChild(ele4);
        rteObj = new RichTextEditor({
            toolbarSettings: {
                enableFloating: true,
                type: ToolbarType.Expand
            },
            height: '600px',
            value: '<br /> <br /> <br /> <br /> <p id="trg"></p>',
        });
        rteObj.appendTo(ele4);
        expect(document.querySelector(".e-richtexteditor .e-toolbar").classList.contains("e-rte-tb-float")).toBe(false);
        ele3.scrollTo(0, 200);
        setTimeout(() => {
            expect(document.querySelector(".e-richtexteditor .e-toolbar").classList.contains("e-rte-tb-float")).toBe(true);
            window.scrollTo(0, 0);
            detach(ele1);
            destroy(rteObj);
            done();
        }, 500);
    });
});