/**
 * Toolbar spec
 */
import { selectAll, select, Browser, L10n, createElement, getUniqueID, detach, isNullOrUndefined, closest } from "@syncfusion/ej2-base";
import { RichTextEditor } from "../../../src/rich-text-editor/index";
import { ToolbarType } from "../../../src/common/enum";
import { IToolbarStatus } from '../../../src/common/interface';
import { renderRTE, destroy, dispatchEvent } from "./../render.spec";
import { NodeSelection } from "../../../src/selection/index";
import { ARROWRIGHT_EVENT_INIT, TOOLBAR_FOCUS_SHORTCUT_EVENT_INIT } from "../../constant.spec";


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
            //Modified rendering from dropdown to split button
            let format: HTMLElement = (rteObj.element.querySelector('#' + controlId + '_toolbar_NumberFormatList').nextElementSibling) as HTMLElement;
            dispatchEvent(format, 'mousedown');
            dispatchEvent(format, 'mouseup');
            format.click();
            setTimeout(() => {
            let items: any = document.querySelectorAll('#' + controlId + '_toolbar_NumberFormatList_dropdownbtn-popup .e-item');
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
            //Modified rendering from dropdown to split button
            let format: HTMLElement = (rteObj.element.querySelector('#' + controlId + '_toolbar_BulletFormatList').nextElementSibling) as HTMLElement;
            dispatchEvent(format, 'mousedown');
            dispatchEvent(format, 'mouseup');
            format.click();
            setTimeout(() => {
            let items: any = document.querySelectorAll('#' + controlId + '_toolbar_BulletFormatList_dropdownbtn-popup .e-item');
            expect(items[0].textContent === 'None').toBe(true);
            expect(items[1].textContent === 'Square').toBe(true);
            done();
        }, 200)
        });
        afterAll((done: DoneFn) => {
            destroy(rteObj);
            done();
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
            //Modified rendering from dropdown to split button
            let format: HTMLElement = (rteObj.element.querySelector('#' + controlId + '_toolbar_NumberFormatList').nextElementSibling) as HTMLElement;
            dispatchEvent(format, 'mousedown');
            dispatchEvent(format, 'mouseup');
            format.click();
            setTimeout(() => {
                expect(document.querySelectorAll('.e-dropdown-popup')[2].classList.contains('customClass')).toBe(true);
                expect(document.querySelectorAll('.e-dropdown-popup')[3].classList.contains('customClass')).toBe(true);
                expect(document.querySelector('.e-rte-numberformatlist-dropdown.e-popup-open').classList.contains('customClass')).toBe(true);
                rteObj.cssClass = 'changedClass';
                rteObj.dataBind();
                expect(document.querySelectorAll('.e-dropdown-popup')[2].classList.contains('changedClass')).toBe(true);
                expect(document.querySelectorAll('.e-dropdown-popup')[3].classList.contains('changedClass')).toBe(true);
                expect(document.querySelector('.e-rte-numberformatlist-dropdown.e-popup-open').classList.contains('changedClass')).toBe(true);
                done();
            }, 200)
        });
        afterAll((done: DoneFn) => {
            destroy(rteObj);
            done();
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
        //Modified rendering from dropdown to split button
        let numberFormatList: HTMLElement = (rteObj.element.querySelector('#' + controlId + '_toolbar_NumberFormatList').nextElementSibling) as HTMLElement;
        dispatchEvent(numberFormatList, 'mousedown');
        dispatchEvent(numberFormatList, 'mouseup');
        numberFormatList.click();
        let items: any = document.querySelectorAll('#' + controlId + '_toolbar_NumberFormatList_dropdownbtn-popup .e-item');
        items[1].click();
        expect((rteObj.inputElement.querySelector('#rte') as HTMLElement).parentElement.style.listStyleType === 'decimal').toBe(true);
        expect(rteObj.element.querySelector('#rte').parentElement.tagName === 'OL').toBe(true);
        done();
    });
    it(' Check the numberFormatList items 2', (done) => {
        let pEle: HTMLElement = rteObj.element.querySelector('#rte');
        rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.element.querySelector('#rte').childNodes[0], rteObj.element.querySelector('#rte').childNodes[0], 0, 14);
        //Modified rendering from dropdown to split button
        let numberFormatList: HTMLElement = (rteObj.element.querySelector('#' + controlId + '_toolbar_NumberFormatList').nextElementSibling) as HTMLElement;
        dispatchEvent(numberFormatList, 'mousedown');
        dispatchEvent(numberFormatList, 'mouseup');
        numberFormatList.click();
        let items: any = document.querySelectorAll('#' + controlId + '_toolbar_NumberFormatList_dropdownbtn-popup .e-item');
        items[2].click();
        expect((rteObj.inputElement.querySelector('#rte') as HTMLElement).parentElement.style.listStyleType === 'lower-greek').toBe(true);
        expect(rteObj.element.querySelector('#rte').parentElement.tagName === 'OL').toBe(true);
        done();
    });
    it(' Check the numberFormatList items 3', (done) => {
        let pEle: HTMLElement = rteObj.element.querySelector('#rte');
        rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.element.querySelector('#rte').childNodes[0], rteObj.element.querySelector('#rte').childNodes[0], 0, 14);
        //Modified rendering from dropdown to split button
        let numberFormatList: HTMLElement = (rteObj.element.querySelector('#' + controlId + '_toolbar_NumberFormatList').nextElementSibling) as HTMLElement;
        dispatchEvent(numberFormatList, 'mousedown');
        dispatchEvent(numberFormatList, 'mouseup');
        numberFormatList.click();
        let items: any = document.querySelectorAll('#' + controlId + '_toolbar_NumberFormatList_dropdownbtn-popup .e-item');
        items[3].click();
        expect((rteObj.inputElement.querySelector('#rte') as HTMLElement).parentElement.style.listStyleType === 'lower-roman').toBe(true);
        expect(rteObj.element.querySelector('#rte').parentElement.tagName === 'OL').toBe(true);
        done();
    });
    it(' Check the numberFormatList items 4', (done) => {
        let pEle: HTMLElement = rteObj.element.querySelector('#rte');
        rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.element.querySelector('#rte').childNodes[0], rteObj.element.querySelector('#rte').childNodes[0], 0, 14);
        //Modified rendering from dropdown to split button
        let numberFormatList: HTMLElement = (rteObj.element.querySelector('#' + controlId + '_toolbar_NumberFormatList').nextElementSibling) as HTMLElement;
        dispatchEvent(numberFormatList, 'mousedown');
        dispatchEvent(numberFormatList, 'mouseup');
        numberFormatList.click();
        let items: any = document.querySelectorAll('#' + controlId + '_toolbar_NumberFormatList_dropdownbtn-popup .e-item');
        items[4].click();
        expect((rteObj.inputElement.querySelector('#rte') as HTMLElement).parentElement.style.listStyleType === 'upper-alpha').toBe(true);
        expect(rteObj.element.querySelector('#rte').parentElement.tagName === 'OL').toBe(true);
        done();
    });
    it(' Check the numberFormatList items 5', (done) => {
        let pEle: HTMLElement = rteObj.element.querySelector('#rte');
        rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.element.querySelector('#rte').childNodes[0], rteObj.element.querySelector('#rte').childNodes[0], 0, 14);
        //Modified rendering from dropdown to split button
        let numberFormatList: HTMLElement = (rteObj.element.querySelector('#' + controlId + '_toolbar_NumberFormatList').nextElementSibling) as HTMLElement;
        dispatchEvent(numberFormatList, 'mousedown');
        dispatchEvent(numberFormatList, 'mouseup');
        numberFormatList.click();
        let items: any = document.querySelectorAll('#' + controlId + '_toolbar_NumberFormatList_dropdownbtn-popup .e-item');
        items[5].click();
        expect((rteObj.inputElement.querySelector('#rte') as HTMLElement).parentElement.style.listStyleType === 'lower-alpha').toBe(true);
        expect(rteObj.element.querySelector('#rte').parentElement.tagName === 'OL').toBe(true);
        done();
    });
    it(' Check the numberFormatList items 6', (done) => {
        let pEle: HTMLElement = rteObj.element.querySelector('#rte');
        rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.element.querySelector('#rte').childNodes[0], rteObj.element.querySelector('#rte').childNodes[0], 0, 14);
        //Modified rendering from dropdown to split button
        let numberFormatList: HTMLElement = (rteObj.element.querySelector('#' + controlId + '_toolbar_NumberFormatList').nextElementSibling) as HTMLElement;
        dispatchEvent(numberFormatList, 'mousedown');
        dispatchEvent(numberFormatList, 'mouseup');
        numberFormatList.click();
        let items: any = document.querySelectorAll('#' + controlId + '_toolbar_NumberFormatList_dropdownbtn-popup .e-item');
        items[0].click();
        expect((rteObj.inputElement.querySelector('#rte') as HTMLElement).parentElement.style.listStyleType === 'none').toBe(true);
        expect(rteObj.element.querySelector('#rte').parentElement.tagName === 'OL').toBe(true);
        done();
    });
    it(' Check the numberFormatList items 7', (done) => {
        let pEle: HTMLElement = rteObj.element.querySelector('#rte');
        rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.element.querySelector('#rte').childNodes[0], rteObj.element.querySelector('#rte').childNodes[0], 0, 14);
        //Modified rendering from dropdown to split button
        let numberFormatList: HTMLElement = (rteObj.element.querySelector('#' + controlId + '_toolbar_NumberFormatList').nextElementSibling) as HTMLElement;
        dispatchEvent(numberFormatList, 'mousedown');
        dispatchEvent(numberFormatList, 'mouseup');
        numberFormatList.click();
        let items: any = document.querySelectorAll('#' + controlId + '_toolbar_NumberFormatList_dropdownbtn-popup .e-item');
        items[1].click();
        expect((rteObj.inputElement.querySelector('#rte') as HTMLElement).parentElement.style.listStyleType === 'decimal').toBe(true);
        expect(rteObj.element.querySelector('#rte').parentElement.tagName === 'OL').toBe(true);
        done();
    });
    afterEach((done: DoneFn) => {
        destroy(rteObj);
        done();
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
        //Modified rendering from dropdown to split button
        let bulletFormatList: HTMLElement = (rteObj.element.querySelector('#' + controlId + '_toolbar_BulletFormatList').nextElementSibling) as HTMLElement;
        dispatchEvent(bulletFormatList, 'mousedown');
        dispatchEvent(bulletFormatList, 'mouseup');
        bulletFormatList.click();
        let items: any = document.querySelectorAll('#' + controlId + '_toolbar_BulletFormatList_dropdownbtn-popup .e-item');
        items[1].click();
        expect(rteObj.inputElement.querySelector('#rte').parentElement.style.listStyleType === 'disc').toBe(true);
        expect(rteObj.element.querySelector('#rte').parentElement.tagName === 'UL').toBe(true);
        done();
    });
    it(' Check the bulletFormatList items 2', (done) => {
        let pEle: HTMLElement = rteObj.element.querySelector('#rte');
        rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.element.querySelector('#rte').childNodes[0], rteObj.element.querySelector('#rte').childNodes[0], 0, 14);
        //Modified rendering from dropdown to split button
        let bulletFormatList: HTMLElement = (rteObj.element.querySelector('#' + controlId + '_toolbar_BulletFormatList').nextElementSibling) as HTMLElement;
        dispatchEvent(bulletFormatList, 'mousedown');
        dispatchEvent(bulletFormatList, 'mouseup');
        bulletFormatList.click();
        let items: any = document.querySelectorAll('#' + controlId + '_toolbar_BulletFormatList_dropdownbtn-popup .e-item');
        items[2].click();
        expect(rteObj.inputElement.querySelector('#rte').parentElement.style.listStyleType === 'circle').toBe(true);
        expect(rteObj.element.querySelector('#rte').parentElement.tagName === 'UL').toBe(true)
        done();
    });
    it(' Check the bulletFormatList items 3', (done) => {
        let pEle: HTMLElement = rteObj.element.querySelector('#rte');
        rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.element.querySelector('#rte').childNodes[0], rteObj.element.querySelector('#rte').childNodes[0], 0, 14);
        //Modified rendering from dropdown to split button
        let bulletFormatList: HTMLElement = (rteObj.element.querySelector('#' + controlId + '_toolbar_BulletFormatList').nextElementSibling) as HTMLElement;
        dispatchEvent(bulletFormatList, 'mousedown');
        dispatchEvent(bulletFormatList, 'mouseup');
        bulletFormatList.click();
        let items: any = document.querySelectorAll('#' + controlId + '_toolbar_BulletFormatList_dropdownbtn-popup .e-item');
        items[3].click();
        expect(rteObj.inputElement.querySelector('#rte').parentElement.style.listStyleType === 'square').toBe(true);
        expect(rteObj.element.querySelector('#rte').parentElement.tagName === 'UL').toBe(true);
        done();
    });
    it(' Check the bulletFormatList items 4', (done) => {
        let pEle: HTMLElement = rteObj.element.querySelector('#rte');
        rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.element.querySelector('#rte').childNodes[0], rteObj.element.querySelector('#rte').childNodes[0], 0, 14);
        //Modified rendering from dropdown to split button
        let bulletFormatList: HTMLElement = (rteObj.element.querySelector('#' + controlId + '_toolbar_BulletFormatList').nextElementSibling) as HTMLElement;
        dispatchEvent(bulletFormatList, 'mousedown');
        dispatchEvent(bulletFormatList, 'mouseup');
        bulletFormatList.click();
        let items: any = document.querySelectorAll('#' + controlId + '_toolbar_BulletFormatList_dropdownbtn-popup .e-item');
        items[0].click();
        expect(rteObj.inputElement.querySelector('#rte').parentElement.style.listStyleType === 'none').toBe(true);
        expect(rteObj.element.querySelector('#rte').parentElement.tagName === 'UL').toBe(true);
        done();
    });
    afterEach((done: DoneFn) => {
        destroy(rteObj);
        done();
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
            //Modified rendering from dropdown to split button
            let numberFormatList: HTMLElement = (rteObj.element.querySelector('#' + controlId + '_toolbar_NumberFormatList').nextElementSibling) as HTMLElement;
            dispatchEvent(numberFormatList, 'mousedown');
            dispatchEvent(numberFormatList, 'mouseup');
            numberFormatList.click();
            let items: any = document.querySelectorAll('#' + controlId + '_toolbar_NumberFormatList_dropdownbtn-popup .e-item');
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
            //Modified rendering from dropdown to split button
            let bulletFormatList: HTMLElement = (rteObj.element.querySelector('#' + controlId + '_toolbar_BulletFormatList').nextElementSibling) as HTMLElement;
            dispatchEvent(bulletFormatList, 'mousedown');
            dispatchEvent(bulletFormatList, 'mouseup');
            bulletFormatList.click();
            let items: any = document.querySelectorAll('#' + controlId + '_toolbar_BulletFormatList_dropdownbtn-popup .e-item');
            items[3].click();
            let Elem: HTMLElement = rteObj.element.querySelector('#rte');
            expect(Elem.tagName === 'LI').toBe(true);
            expect(Elem.parentElement.tagName === 'UL').toBe(true);
            expect(Elem.parentElement.style.listStyleType === 'square').toBe(true);
            done();
            });
        afterEach((done: DoneFn) => {
            destroy(rteObj);
            done();
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
            //Modified rendering from dropdown to split button
            let numberFormatList: HTMLElement = (rteObj.element.querySelector('#' + controlId + '_toolbar_NumberFormatList').nextElementSibling) as HTMLElement;
            dispatchEvent(numberFormatList, 'mousedown');
            dispatchEvent(numberFormatList, 'mouseup');
            numberFormatList.click();
            let items: any = document.querySelectorAll('#' + controlId + '_toolbar_NumberFormatList_dropdownbtn-popup .e-item');
            items[6].click();
            expect(rteObj.inputElement.querySelector('#rte').parentElement.style.listStyleImage === 'url("https://mdn.mozillademos.org/files/11981/starsolid.gif")').toBe(true);
            expect(rteObj.element.querySelector('#rte').parentElement.tagName === 'OL').toBe(true);
            let numberFormatList1: HTMLElement = (rteObj.element.querySelector('#' + controlId + '_toolbar_NumberFormatList').nextElementSibling) as HTMLElement;
            dispatchEvent(numberFormatList1, 'mousedown');
            dispatchEvent(numberFormatList1, 'mouseup');
            numberFormatList1.click();
            let item: any = document.querySelectorAll('#' + controlId + '_toolbar_NumberFormatList_dropdownbtn-popup .e-item');
            item[3].click();
            let Elem: HTMLElement = rteObj.element.querySelector('#rte');
            expect((Elem).tagName === 'LI').toBe(true);
            expect(Elem.parentElement.tagName === 'OL').toBe(true);
            expect(rteObj.inputElement.querySelector('#rte').parentElement.style.listStyleType === 'lower-greek').toBe(true);
            expect(rteObj.inputElement.querySelector('#rte').parentElement.style.listStyleImage === 'none').toBe(true);
            done();
            });
        it(' Checking the BulletFormatList list style image to style type', (done) => {
            let pEle: HTMLElement = rteObj.element.querySelector('#rte');
            expect(pEle.tagName !== 'LI').toBe(true);
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.element.querySelector('#rte').childNodes[0], rteObj.element.querySelector('#rte').childNodes[0], 0, 14);
            //Modified rendering from dropdown to split button
            let bulletFormatList: HTMLElement = (rteObj.element.querySelector('#' + controlId + '_toolbar_BulletFormatList').nextElementSibling) as HTMLElement;
            dispatchEvent(bulletFormatList, 'mousedown');
            dispatchEvent(bulletFormatList, 'mouseup');
            bulletFormatList.click();
            let items: any = document.querySelectorAll('#' + controlId + '_toolbar_BulletFormatList_dropdownbtn-popup .e-item');
            items[2].click();
            expect(rteObj.inputElement.querySelector('#rte').parentElement.style.listStyleImage === 'linear-gradient(to left bottom, red, blue)').toBe(true);
            expect(rteObj.element.querySelector('#rte').parentElement.tagName === 'UL').toBe(true);
            let bulletFormatList1: HTMLElement = (rteObj.element.querySelector('#' + controlId + '_toolbar_BulletFormatList').nextElementSibling) as HTMLElement;
            dispatchEvent(bulletFormatList1, 'mousedown');
            dispatchEvent(bulletFormatList1, 'mouseup');
            bulletFormatList1.click();
            let item: any = document.querySelectorAll('#' + controlId + '_toolbar_BulletFormatList_dropdownbtn-popup .e-item');
            item[1].click();
            let Elem: HTMLElement = rteObj.element.querySelector('#rte');
            expect(Elem.tagName === 'LI').toBe(true);
            expect(Elem.parentElement.tagName === 'UL').toBe(true);
            expect(Elem.parentElement.style.listStyleType === 'square').toBe(true);
            expect(Elem.parentElement.style.listStyleImage === 'none').toBe(true);
            done();
        });
        afterEach((done: DoneFn) => {
            destroy(rteObj);
            done();
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
            //Modified rendering from dropdown to split button
            let numberFormatList: HTMLElement = (rteObj.element.querySelector('#' + controlId + '_toolbar_NumberFormatList').nextElementSibling) as HTMLElement;
            dispatchEvent(numberFormatList, 'mousedown');
            dispatchEvent(numberFormatList, 'mouseup');
            numberFormatList.click();
            let items: any = document.querySelectorAll('#' + controlId + '_toolbar_NumberFormatList_dropdownbtn-popup .e-item');
            items[3].click();
            expect((rteObj.element.querySelector('#rte') as HTMLElement).tagName === 'LI').toBe(true);
            expect(rteObj.element.querySelector('#rte').parentElement.tagName === 'OL').toBe(true);
            expect(rteObj.inputElement.querySelector('#rte').parentElement.style.listStyleType === 'lower-roman').toBe(true);
            done();
            });
        it(' Check the bulletFormatList with LI tag', (done) => {
            let pEle: HTMLElement = rteObj.element.querySelector('#rte');
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.element.querySelector('#rte').childNodes[0], rteObj.element.querySelector('#rte').childNodes[0], 0, 14);
            //Modified rendering from dropdown to split button
            let bulletFormatList: HTMLElement = (rteObj.element.querySelector('#' + controlId + '_toolbar_BulletFormatList').nextElementSibling) as HTMLElement;
            dispatchEvent(bulletFormatList, 'mousedown');
            dispatchEvent(bulletFormatList, 'mouseup');
            bulletFormatList.click();
            let items: any = document.querySelectorAll('#' + controlId + '_toolbar_BulletFormatList_dropdownbtn-popup .e-item');
            items[2].click();
            expect((rteObj.element.querySelector('#rte') as HTMLElement).tagName === 'LI').toBe(true);
            expect(rteObj.element.querySelector('#rte').parentElement.tagName === 'UL').toBe(true);
            expect(rteObj.inputElement.querySelector('#rte').parentElement.style.listStyleType === 'circle').toBe(true);
            done();
        });
        afterEach((done: DoneFn) => {
            destroy(rteObj);
            done();
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
            //Modified rendering from dropdown to split button
            let numberFormatList: HTMLElement = (rteObj.element.querySelector('#' + controlId + '_toolbar_NumberFormatList').nextElementSibling) as HTMLElement;
            dispatchEvent(numberFormatList, 'mousedown');
            dispatchEvent(numberFormatList, 'mouseup');
            numberFormatList.click();
            let items: any = document.querySelectorAll('#' + controlId + '_toolbar_NumberFormatList_dropdownbtn-popup .e-item');
            items[6].click();
            expect(rteObj.inputElement.querySelector('#rte').parentElement.style.listStyleImage === 'url("https://mdn.mozillademos.org/files/11981/starsolid.gif")').toBe(true);
            expect(rteObj.element.querySelector('#rte').parentElement.tagName === 'OL').toBe(true);
            done();
            });
        it('  Check the bulletFormatList list style image', (done) => {
            let pEle: HTMLElement = rteObj.element.querySelector('#rte');
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.element.querySelector('#rte').childNodes[0], rteObj.element.querySelector('#rte').childNodes[0], 0, 14);
            //Modified rendering from dropdown to split button
            let bulletFormatList: HTMLElement = (rteObj.element.querySelector('#' + controlId + '_toolbar_BulletFormatList').nextElementSibling) as HTMLElement;
            dispatchEvent(bulletFormatList, 'mousedown');
            dispatchEvent(bulletFormatList, 'mouseup');
            bulletFormatList.click();
            let items: any = document.querySelectorAll('#' + controlId + '_toolbar_BulletFormatList_dropdownbtn-popup .e-item');
            items[2].click();
            expect(rteObj.inputElement.querySelector('#rte').parentElement.style.listStyleImage === 'linear-gradient(to left bottom, red, blue)').toBe(true);
            expect(rteObj.element.querySelector('#rte').parentElement.tagName === 'UL').toBe(true);
            done();
            });
        it(' Checking the numberFormatList tag to BulletFormatList', (done) => {
            let pEle: HTMLElement = rteObj.element.querySelector('#rte');
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.element.querySelector('#rte').childNodes[0], rteObj.element.querySelector('#rte').childNodes[0], 0, 14);
            //Modified rendering from dropdown to split button
            let numberFormatList: HTMLElement = (rteObj.element.querySelector('#' + controlId + '_toolbar_NumberFormatList').nextElementSibling) as HTMLElement;
            dispatchEvent(numberFormatList, 'mousedown');
            dispatchEvent(numberFormatList, 'mouseup');
            numberFormatList.click();
            let items: any = document.querySelectorAll('#' + controlId + '_toolbar_NumberFormatList_dropdownbtn-popup .e-item');
            items[6].click();
            expect(rteObj.inputElement.querySelector('#rte').parentElement.style.listStyleImage === 'url("https://mdn.mozillademos.org/files/11981/starsolid.gif")').toBe(true);
            expect(rteObj.element.querySelector('#rte').parentElement.tagName === 'OL').toBe(true);
            done();
            let bulletFormatList: HTMLElement = (rteObj.element.querySelector('#' + controlId + '_toolbar_BulletFormatList').nextElementSibling) as HTMLElement;
            dispatchEvent(bulletFormatList, 'mousedown');
            dispatchEvent(bulletFormatList, 'mouseup');
            bulletFormatList.click();
            let item: any = document.querySelectorAll('#' + controlId + '_toolbar_BulletFormatList_dropdownbtn-popup .e-item');
            item[2].click();
            pEle = rteObj.element.querySelector('UL');
            expect(rteObj.inputElement.querySelector('#rte').parentElement.style.listStyleImage === 'linear-gradient(to left bottom, red, blue)').toBe(true);
            expect(rteObj.element.querySelector('#rte').parentElement.tagName === 'UL').toBe(true);
            done();
            });
        it(' Checking the bulletFormatList tag to NumberFormatList', (done) => {
            let pEle: HTMLElement = rteObj.element.querySelector('#rte');
            rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.element.querySelector('#rte').childNodes[0], rteObj.element.querySelector('#rte').childNodes[0], 0, 14);
            //Modified rendering from dropdown to split button
            let bulletFormatList: HTMLElement = (rteObj.element.querySelector('#' + controlId + '_toolbar_BulletFormatList').nextElementSibling) as HTMLElement;
            dispatchEvent(bulletFormatList, 'mousedown');
            dispatchEvent(bulletFormatList, 'mouseup');
            bulletFormatList.click();
            let items: any = document.querySelectorAll('#' + controlId + '_toolbar_BulletFormatList_dropdownbtn-popup .e-item');
            items[2].click();
            expect(rteObj.inputElement.querySelector('#rte').parentElement.style.listStyleImage === 'linear-gradient(to left bottom, red, blue)').toBe(true);
            expect(rteObj.element.querySelector('#rte').parentElement.tagName === 'UL').toBe(true);
            done();
            let numberFormatList: HTMLElement = (rteObj.element.querySelector('#' + controlId + '_toolbar_NumberFormatList').nextElementSibling) as HTMLElement;
            dispatchEvent(numberFormatList, 'mousedown');
            dispatchEvent(numberFormatList, 'mouseup');
            numberFormatList.click();
            let item: any = document.querySelectorAll('#' + controlId + '_toolbar_NumberFormatList_dropdownbtn-popup .e-item');
            item[6].click();
            pEle = rteObj.element.querySelector('OL');
            expect(rteObj.inputElement.querySelector('#rte').parentElement.style.listStyleImage === 'url("https://mdn.mozillademos.org/files/11981/starsolid.gif")').toBe(true);
            expect(rteObj.element.querySelector('#rte').parentElement.tagName === 'OL').toBe(true);
            done();
            });
        afterEach((done: DoneFn) => {
            destroy(rteObj);
            done();
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
            expect(rteObj.toolbarSettings.items.length).toBe(16);
            expect(rteObj.toolbarSettings.type).toBe(ToolbarType.Expand);
        });

        it("toolbarSettings - 'items' property default value testing", () => {
            expect(rteObj.toolbarSettings.items[0]).toBe("Bold");
            expect(rteObj.toolbarSettings.items[1]).toBe("Italic");
            expect(rteObj.toolbarSettings.items[2]).toBe("Underline");
            expect(rteObj.toolbarSettings.items[3]).toBe("|");
            expect(rteObj.toolbarSettings.items[4]).toBe("Formats");
            expect(rteObj.toolbarSettings.items[5]).toBe("Alignments");
            expect(rteObj.toolbarSettings.items[6]).toBe("Blockquote");
            expect(rteObj.toolbarSettings.items[7]).toBe("OrderedList");
            expect(rteObj.toolbarSettings.items[8]).toBe("UnorderedList");
            expect(rteObj.toolbarSettings.items[9]).toBe("|");
            expect(rteObj.toolbarSettings.items[10]).toBe("CreateLink");
            expect(rteObj.toolbarSettings.items[11]).toBe("Image");
            expect(rteObj.toolbarSettings.items[12]).toBe("|");
            expect(rteObj.toolbarSettings.items[13]).toBe("SourceCode");
            expect(rteObj.toolbarSettings.items[14]).toBe("Undo");
            expect(rteObj.toolbarSettings.items[15]).toBe("Redo");
        });

        it("toolbarSettings - 'items' property default value element testing", () => {
            let tbItems: NodeList = rteEle.querySelectorAll(".e-toolbar-item");
            expect((<HTMLElement>tbItems.item(0)).firstElementChild.id.indexOf("Bold") > 0).toBe(true);
            expect((<HTMLElement>tbItems.item(1)).firstElementChild.id.indexOf("Italic") > 0).toBe(true);
            expect((<HTMLElement>tbItems.item(2)).firstElementChild.id.indexOf("Underline") > 0).toBe(true);
            expect((<HTMLElement>tbItems.item(3)).classList.contains("e-separator")).toBe(true);
            expect((<HTMLElement>tbItems.item(4)).firstElementChild.id.indexOf("Formats") > 0).toBe(true);
            expect((<HTMLElement>tbItems.item(5)).firstElementChild.id.indexOf("Alignments") > 0).toBe(true);
            expect((<HTMLElement>tbItems.item(6)).firstElementChild.id.indexOf("Blockquote") > 0).toBe(true);
            expect((<HTMLElement>tbItems.item(7)).firstElementChild.id.indexOf("OrderedList") > 0).toBe(true);
            expect((<HTMLElement>tbItems.item(8)).firstElementChild.id.indexOf("UnorderedList") > 0).toBe(true);
            expect((<HTMLElement>tbItems.item(9)).classList.contains("e-separator")).toBe(true);
            expect((<HTMLElement>tbItems.item(10)).firstElementChild.id.indexOf("CreateLink") > 0).toBe(true);
            expect((<HTMLElement>tbItems.item(11)).firstElementChild.id.indexOf("Image") > 0).toBe(true);
            expect((<HTMLElement>tbItems.item(12)).classList.contains("e-separator")).toBe(true);
            expect((<HTMLElement>tbItems.item(13)).firstElementChild.id.indexOf("SourceCode") > 0).toBe(true);
            expect((<HTMLElement>tbItems.item(14)).firstElementChild.id.indexOf("Undo") > 0).toBe(true);
            expect((<HTMLElement>tbItems.item(15 )).firstElementChild.id.indexOf("Redo") > 0).toBe(true);
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
            expect(rteObj.rootContainer.children.length).toBe(2);
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
            expect(rteEle.querySelectorAll(".e-toolbar-item")[0].getAttribute("title")).toBe("Bold (Ctrl+B)");
            expect(rteEle.querySelectorAll(".e-toolbar-item")[1].getAttribute("title")).toBe("Maximize (Ctrl+Shift+F)");
            trgEle.click();
            expect(rteEle.querySelectorAll(".e-toolbar-item").length).toBe(2);
            expect(rteEle.querySelectorAll(".e-toolbar-item")[0].getAttribute("title")).toBe("Bold (Ctrl+B)");
            expect(rteEle.querySelectorAll(".e-toolbar-item")[1].getAttribute("title")).toBe("Minimize");
            trgEle = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[1];
            trgEle.click();
            expect(rteEle.querySelectorAll(".e-toolbar-item").length).toBe(2);
            expect(rteEle.querySelectorAll(".e-toolbar-item")[0].getAttribute("title")).toBe("Bold (Ctrl+B)");
            expect(rteEle.querySelectorAll(".e-toolbar-item")[1].getAttribute("title")).toBe("Maximize");
            rteObj.fullScreenModule.hideFullScreen();
            expect(rteEle.querySelectorAll(".e-toolbar-item").length).toBe(2);
            expect(rteEle.querySelectorAll(".e-toolbar-item")[0].getAttribute("title")).toBe("Bold (Ctrl+B)");
            expect(rteEle.querySelectorAll(".e-toolbar-item")[1].getAttribute("title")).toBe("Maximize");
            trgEle = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[1];
            trgEle.click();
            expect(rteEle.querySelectorAll(".e-toolbar-item").length).toBe(2);
            expect(rteEle.querySelectorAll(".e-toolbar-item")[0].getAttribute("title")).toBe("Bold (Ctrl+B)");
            expect(rteEle.querySelectorAll(".e-toolbar-item")[1].getAttribute("title")).toBe("Minimize");
            trgEle = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[1];
            trgEle.click();
            expect(rteEle.querySelectorAll(".e-toolbar-item").length).toBe(2);
            expect(rteEle.querySelectorAll(".e-toolbar-item")[0].getAttribute("title")).toBe("Bold (Ctrl+B)");
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
            expect(rteEle.querySelectorAll(".e-toolbar-item")[0].getAttribute("title")).toBe("Bold (Ctrl+B)");
            expect(rteEle.querySelectorAll(".e-toolbar-item")[1].getAttribute("title")).toBe("Maximize (Ctrl+Shift+F)");
            trgEle.click();
            expect(rteEle.querySelectorAll(".e-toolbar-item").length).toBe(2);
            expect(rteEle.querySelectorAll(".e-toolbar-item")[0].getAttribute("title")).toBe("Bold (Ctrl+B)");
            expect(rteEle.querySelectorAll(".e-toolbar-item")[1].getAttribute("title")).toBe("Minimize");
            sample.destroy();
            detach(rteElement);
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
            expect(rteEle.querySelectorAll(".e-toolbar-item")[0].getAttribute("title")).toBe("Bold (Ctrl+B)");
            expect(rteEle.querySelectorAll(".e-toolbar-item")[1].getAttribute("title")).toBe("Maximize (Ctrl+Shift+F)");
            trgEle.click();
            expect(rteEle.querySelectorAll(".e-toolbar-item").length).toBe(2);
            expect(rteEle.querySelectorAll(".e-toolbar-item")[0].getAttribute("title")).toBe("Bold (Ctrl+B)");
            expect(rteEle.querySelectorAll(".e-toolbar-item")[1].getAttribute("title")).toBe("Minimize");
            trgEle = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[1];
            trgEle.click();
            expect(rteEle.querySelectorAll(".e-toolbar-item").length).toBe(2);
            expect(rteEle.querySelectorAll(".e-toolbar-item")[0].getAttribute("title")).toBe("Bold (Ctrl+B)");
            expect(rteEle.querySelectorAll(".e-toolbar-item")[1].getAttribute("title")).toBe("Maximize");
            rteObj.fullScreenModule.hideFullScreen();
            expect(rteEle.querySelectorAll(".e-toolbar-item").length).toBe(2);
            expect(rteEle.querySelectorAll(".e-toolbar-item")[0].getAttribute("title")).toBe("Bold (Ctrl+B)");
            expect(rteEle.querySelectorAll(".e-toolbar-item")[1].getAttribute("title")).toBe("Maximize");
            trgEle = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[1];
            trgEle.click();
            expect(rteEle.querySelectorAll(".e-toolbar-item").length).toBe(2);
            expect(rteEle.querySelectorAll(".e-toolbar-item")[0].getAttribute("title")).toBe("Bold (Ctrl+B)");
            expect(rteEle.querySelectorAll(".e-toolbar-item")[1].getAttribute("title")).toBe("Minimize");
            trgEle = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[1];
            trgEle.click();
            expect(rteEle.querySelectorAll(".e-toolbar-item").length).toBe(2);
            expect(rteEle.querySelectorAll(".e-toolbar-item")[0].getAttribute("title")).toBe("Bold (Ctrl+B)");
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

        beforeEach((done: DoneFn) => {
            document.body.appendChild(inputEle);
            done();
        });

        afterEach((done: DoneFn) => {
            Browser.userAgent = defaultUA;
            detach(inputEle);
            destroy(rteObj);
            done();
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
            expect(rteEle.querySelectorAll(".e-toolbar-item")[0].getAttribute("title")).toBe("Bold (Ctrl+B)");
            expect(rteEle.querySelectorAll(".e-toolbar-item")[1].getAttribute("title")).toBe("Maximize (Ctrl+Shift+F)");
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
            expect(rteEle.querySelectorAll(".e-toolbar-item")[0].getAttribute("title")).toBe("Bold (Ctrl+B)");
            expect(rteEle.querySelectorAll(".e-toolbar-item")[1].getAttribute("title")).toBe("Maximize (Ctrl+Shift+F)");
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

        afterEach((done: DoneFn) => {
            document.body.style.height = '';
            destroy(rteObj);
            detach(ele1);
            done();
        });

        it("Class testing", () => {
            expect(document.querySelector(".e-richtexteditor .e-toolbar").parentElement.classList.contains("e-rte-tb-float")).toBe(true);
        });
        it("dyanamic disable the enable floating", () => {
            rteObj.toolbarSettings.enableFloating = false;
            rteObj.dataBind();
            expect(document.querySelector(".e-richtexteditor .e-toolbar").parentElement.classList.contains("e-rte-tb-float")).toBe(false);
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

        afterAll((done: DoneFn) => {
            destroy(rteObj);
            detach(ele1);
            done();
        });

        it("Preventing the SourceCode view while updating the enableFloating dynamically", () => {
            expect(document.querySelector(".e-bold").parentElement.attributes[6].value).toBe("false");
            expect(document.querySelector(".e-italic").parentElement.attributes[6].value).toBe("false");
            expect(document.querySelector(".e-source-code").parentElement.attributes[6].value).toBe("false");
            let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_SourceCode');
            item.click();
            expect(rteObj.rootContainer.classList.contains('e-source-code-enabled')).toBe(true)
            rteObj.toolbarSettings.enableFloating = true;
            rteObj.dataBind();
            expect(document.querySelector(".e-bold").parentElement.attributes[6].value).toBe("true");
            expect(document.querySelector(".e-italic").parentElement.attributes[6].value).toBe("true");
            expect(document.querySelector(".e-preview").parentElement.attributes[6].value).toBe("false");
            expect(rteObj.rootContainer.classList.contains('e-source-code-enabled')).toBe(true)
        });
    });

    describe("OnPropertyChange testing", () => {
        let rteEle: HTMLElement;
        let rteObj: any;

        afterEach((done: DoneFn) => {
            destroy(rteObj);
            done();
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
            expect(rteEle.querySelectorAll(".e-toolbar-item").length).toBe(16);
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

        afterEach((done: DoneFn) => {
            destroy(rteObj);
            done();
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

        beforeAll((done: DoneFn) => {
            rteObj = renderRTE({
                width: '200px',
                toolbarSettings: {
                    type: ToolbarType.Expand
                }
            });
            rteEle = rteObj.element;
            rteEle.style.height = 300 + 'px';
            done();
        });

        afterAll((done: DoneFn) => {
            destroy(rteObj);
            done();
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
            expect((<HTMLElement>tbItemsEle[10].firstElementChild).innerText.trim()).toBe('Font Name');
            expect((<HTMLElement>tbItemsEle[11].firstElementChild).innerText.trim()).toBe('Font Size');
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
            expect((<HTMLElement>tbItemsEle[9].firstElementChild).innerText.trim()).toBe('Preformatted');
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
            rteObj.focusIn();
            rteObj.contentModule.getEditPanel().dispatchEvent(TOOLBAR_FOCUS_SHORTCUT_EVENT_INIT);
            const enterKeyDownEvent = new KeyboardEvent('keydown', {
                ctrlKey: false,
                shiftKey: false,
                keyCode: 13,
                which: 13,
                key: 'Enter',
                code: 'Enter',
                bubbles: true,
                cancelable: true
            } as EventInit);
            document.activeElement.dispatchEvent(enterKeyDownEvent);
            expect(document.activeElement.getAttribute('tabindex') === '0').toBe(true);
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
            expect(!isNullOrUndefined(rteEle.querySelector("#"+controlId+"_toolbar_Italic").querySelector(".e-bold"))).toBe(true);
            expect(!isNullOrUndefined(rteEle.querySelector("#"+controlId+"_toolbar_Bold").querySelector(".e-italic"))).toBe(true);
        });
    });

    describe("EJ2-31670 - Need to provide callback (event action) support for RTE custom toolbar", () => {
        let rteObj: any;
        let clickEventSpy: jasmine.Spy = jasmine.createSpy('customclick');
        let container: HTMLElement = createElement('div', { id: getUniqueID('container'), styles: 'height:800px;' });
        let element1: HTMLElement = createElement('div', { id: getUniqueID('rte-test'),  });

        beforeEach((done: DoneFn) => {
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
            done();
        });

        afterEach((done: DoneFn) => {
            destroy(rteObj);
            detach(container);
            done();
        });

        it("Testing custom toolbar event", (done) => {
            document.getElementById('custom_tbar').click();
            setTimeout(() => {
                expect(clickEventSpy).toHaveBeenCalled();
                expect(rteObj.element.querySelector('[title="Undo (Ctrl+Z)"]').classList.contains('e-overlay')).toBe(true);
                done();
            }, 500);
        });
    });

    describe("MD - Table creation using toolbar item", () => {
        let rteObj: any;
        beforeEach((done: DoneFn) => {
            rteObj = renderRTE({
                editorMode: 'Markdown',
                toolbarSettings: {
                    items: ['CreateTable']
                }
            })
            done();
        });

        afterEach((done: DoneFn) => {
            destroy(rteObj);
            done();
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

        beforeEach((done: DoneFn) => {
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
            done();
        });

        afterEach((done: DoneFn) => {
            destroy(rteObj);
            detach(container);
            done();
        });

        it("Testing custom toolbar event", (done) => {
            document.getElementById('custom_tbar').click();
            setTimeout(() => {
                expect(rteObj.element.querySelector('[title="Undo (Ctrl+Z)"]').classList.contains('e-overlay')).toBe(false);
                done();
            }, 500);
        });
    });

    describe("Check toolbar click event in readyOnly", () => {
        let rteObj: any;
        let clickEventSpy: jasmine.Spy = jasmine.createSpy('toolbarClick');
        beforeEach((done: DoneFn) => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ["Print"]
                },
                toolbarClick : clickEventSpy
            });
            done();
        });

        afterEach((done: DoneFn) => {
            destroy(rteObj);
            done();
        });

        it("Check style", (done) => {
            expect((rteObj.element.querySelector('[title="Print (Ctrl+P)"]') as HTMLElement).style.pointerEvents).toBe('');
            rteObj.element.querySelector('[title="Print (Ctrl+P)"]').click();
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
                expect(items[1].textContent === 'Überschrift 1').toBe(true);
                expect(items[2].textContent === 'Überschrift 2').toBe(true);
                expect(items[3].textContent === 'Überschrift 3').toBe(true);
                expect(items[4].textContent === 'Überschrift 4').toBe(true);
                expect(items[5].textContent === 'Kodex').toBe(true);
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
                expect(items[0].textContent === 'Default').toBe(true);
                expect(items[1].textContent === 'Segoe UI').toBe(true);
                expect(items[2].textContent === 'Arial').toBe(true);
                expect(items[3].textContent === 'Georgia').toBe(true);
                expect(items[4].textContent === 'Einschlag').toBe(true);
                expect(items[5].textContent === 'Tahoma').toBe(true);
                expect(items[6].textContent === 'Mal neu römisch').toBe(true);
                expect(items[7].textContent === 'Verdana').toBe(true);
                done();
            }, 200)
        });
        afterEach((done: DoneFn) => {
            destroy(rteObj);
            done();
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
            items[2].click();
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
            items[1].click();
            expect(rteObj.element.querySelector('#rte').tagName === 'H1').toBe(true);
            done();
        });
        afterEach((done: DoneFn) => {
            destroy(rteObj);
            done();
        });
    });
});
describe('EJ2-58542: Memory leak issue with Rich Text Editor component ', () => {
    let rteObj: RichTextEditor;
    beforeAll(() => {
        rteObj = renderRTE({
            value: '<p>Memory leak testing</p>'
        });
    });
    it('When OffsetParent is null in toolbar', (done: Function) => {
        ((rteObj as any).toolbarModule as any).destroy();
        expect(((rteObj as any).toolbarModule as any).isDestroyed).toBe(true);
        detach(rteObj.element);
        const allDropDownPopups: NodeListOf<Element> = document.querySelectorAll('.e-dropdown-popup');
        expect(allDropDownPopups.length).toBe(0);
        done();
    });
});

describe('849075 - The screen reader does not read the toolbar items in the Rich Text Editor', () => {
    // Checking the tab index value on focus blur and toolbar navigation states.
    const toolbarFocusShortCutEvent = new KeyboardEvent('keydown', {
        key: "F10",
        keyCode: 121,
        which: 121,
        code: "F10",
        location: 0,
        altKey: true,
        ctrlKey: false,
        metaKey: false,
        shiftKey: false,
        repeat: false
    } as EventInit);
    let editorObj: RichTextEditor;
    let toolbarElement: HTMLElement;
    beforeEach(() => {
        editorObj = renderRTE( {
            toolbarSettings: {
                items: [ 'Undo', 'Redo', 'Bold', 'Italic', 'FontName', 'FontColor',
                    'NumberFormatList', 'BulletFormatList', 'CreateLink', 'Image', 'CreateTable', 'SourceCode' ]
            }
        });
    });
    afterEach((done: DoneFn) => {
        destroy(editorObj);
        done();
    });
    it('Case 1: Checking the tab index on the focus action of the editor', () => {
        editorObj.focusIn();
        const toolbarItems: NodeListOf<Element> = document.querySelectorAll('.e-toolbar-item');
        for (let i: number = 0; i < toolbarItems.length; i++) {
            expect(toolbarItems[i].firstElementChild.getAttribute('tabindex') === '-1').toBe(true);
        }
    });
    it('Case 2: Checking the tab index on the blur action of the editor', () => {
        editorObj.focusIn();
        editorObj.focusOut();
        const toolbarItems: NodeListOf<Element> = document.querySelectorAll('.e-toolbar-item');
        for (let i: number = 0; i < toolbarItems.length; i++) {
            expect(toolbarItems[i].firstElementChild.getAttribute('tabindex') === '-1').toBe(true);
        }
    });
    it('Case 3: Checking the tab index on the blur action of the editor - on document click', () => {
        editorObj.focusIn();
        document.body.click();
        const toolbarItems: NodeListOf<Element> = document.querySelectorAll('.e-toolbar-item');
        for (let i: number = 0; i < toolbarItems.length; i++) {
            expect(toolbarItems[i].firstElementChild.getAttribute('tabindex') === '-1').toBe(true);
        }
    });
    it('Case 4: Checking the tab index after the toolbar focus using shortcut keys', () => {
        editorObj.focusIn();
        editorObj.contentModule.getEditPanel().dispatchEvent(toolbarFocusShortCutEvent);
        const toolbarItems: NodeListOf<Element> = document.querySelectorAll('.e-toolbar-item');
        for (let i: number = 0; i < toolbarItems.length; i++) {
            if (i == 2){
                // Focus should be on Bold button instead the Undo and Redo button.
                // Undo and Redo button are not focusable.
                expect(toolbarItems[i].firstElementChild.getAttribute('tabindex') === null).toBe(true);
            } else {
                expect(toolbarItems[i].firstElementChild.getAttribute('tabindex') === '-1').toBe(true);
            }
        }
    });
    it ('Case 5: Checking the tab index on Source Code view', () => {
        editorObj.focusIn();
        const sourceCodeButton: HTMLElement = editorObj.element.querySelector('#' + editorObj.getID() + '_toolbar_SourceCode');
        sourceCodeButton.click();
        const sourceCodeTextArea: HTMLElement = editorObj.element.querySelector('.e-rte-srctextarea');
        sourceCodeTextArea.focus();
        sourceCodeTextArea.dispatchEvent(toolbarFocusShortCutEvent);
        const toolbarItems: NodeListOf<Element> = document.querySelectorAll('.e-toolbar-item');
        for (let i: number = 0; i < toolbarItems.length; i++) {
            // Source code view toolbar items are focusable.
            // Other toolbar items are not focusable.
            if (toolbarItems[i].getAttribute('title') === 'Preview (Ctrl+Shift+H)' || toolbarItems[i].getAttribute('title') === 'Minimize(Esc)'){
                expect(toolbarItems[i].firstElementChild.getAttribute('tabindex') === null).toBe(true);
            } else {
                expect(toolbarItems[i].firstElementChild.getAttribute('tabindex') === '-1').toBe(true);
            }
        }
    });
});

describe('849075 - Checking the tab index on navigating the toolbar items using arrow keys', () => {
    // Checking the tab index value on focus blur and toolbar navigation states.
    const rightArrowKeyUpEvent = new KeyboardEvent('keyup', ARROWRIGHT_EVENT_INIT);
    const rightArrowKeyDownEvent = new KeyboardEvent('keydown', ARROWRIGHT_EVENT_INIT);
    let editorObj: RichTextEditor;
    let toolbarElement: HTMLElement;
    let toolbarItems: NodeListOf<Element>;
    beforeAll(() => {
        editorObj = renderRTE( {
            toolbarSettings: {
                items: [ 'Undo', 'Redo', 'Bold', 'Italic', 'FontName', 'FontColor',
                    'NumberFormatList', 'BulletFormatList', 'CreateLink', 'Image', 'CreateTable', 'SourceCode' ]
            }
        });
    });
    afterAll((done: DoneFn) => {
        destroy(editorObj);
        done();
    });
    it('Case 1:', (done: DoneFn) => {
        editorObj.focusIn();
        editorObj.contentModule.getEditPanel().dispatchEvent(TOOLBAR_FOCUS_SHORTCUT_EVENT_INIT);
        toolbarElement = document.querySelector('.e-rte-toolbar');
        toolbarItems = document.querySelectorAll('.e-toolbar-item');
        expect(toolbarItems[0].firstElementChild.getAttribute('tabindex') === '-1').toBe(true);
        expect(toolbarItems[1].firstElementChild.getAttribute('tabindex') === '-1').toBe(true);
        expect(toolbarItems[2].firstElementChild.getAttribute('tabindex') === null).toBe(true); // Normal item
        toolbarItems[2].dispatchEvent(rightArrowKeyDownEvent);
        toolbarItems[2].dispatchEvent(rightArrowKeyUpEvent);
        setTimeout(() => {
            expect(toolbarItems[2].firstElementChild.getAttribute('tabindex') === '-1').toBe(true);
            expect(toolbarItems[3].firstElementChild.getAttribute('tabindex') === null).toBe(true); // Normal item
            done();
        }, 800);
    });
    it('Case 2:', (done: DoneFn) => {
        toolbarItems[3].dispatchEvent(rightArrowKeyDownEvent);
        toolbarItems[3].dispatchEvent(rightArrowKeyUpEvent);
        setTimeout(() => {
            expect(toolbarItems[3].firstElementChild.getAttribute('tabindex') === '-1').toBe(true);
            expect(toolbarItems[4].firstElementChild.getAttribute('tabindex') === '0').toBe(true); // Template item
            done();
        }, 800);
    });
});
describe('863039-Top sentence is not showing when Maximize/Minimize toolbar', () => {
    let rteObj: any;
    let rteEle: HTMLElement;
    beforeAll(() => {
        rteObj = renderRTE({
            toolbarSettings: {
                items: ['FullScreen', 'Italic', 'Underline', 'StrikeThrough', 'SuperScript', 'SubScript', '|',
                'FontName', 'FontSize', 'FontColor', 'BackgroundColor', '|',
                'LowerCase', 'UpperCase', '|',
                'Formats', 'Alignments', '|', 'NumberFormatList', 'BulletFormatList', '|',
                'Outdent', 'Indent', '|', 'CreateLink', 'Image', 'FileManager', 'Video', 'Audio', 'CreateTable', '|', 'FormatPainter', 'ClearFormat',
                '|', 'EmojiPicker', 'Print', '|',
                'SourceCode', 'Bold', '|', 'Undo', 'Redo']
            },
        });
        rteEle = rteObj.element;
    });

    it('Test - Toolbar height testing when height after maximize/minimize', () => {
        const toolbarElement = rteEle.querySelector('.e-toolbar-wrapper') as HTMLElement | null;
        const toolbarHeight: string | null = toolbarElement.style.height;
        const trgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0];
        trgEle.click();
        trgEle.click();
        const newElement = rteEle.querySelector('.e-toolbar-wrapper') as HTMLElement | null;
        const newHeight: string | null = newElement.style.height;      
        expect(newHeight).toBe(toolbarHeight);
    });
    afterAll(() => {
        destroy(rteObj);
    });
});
describe('864182-Texts got hidden under the toolbar, when we maximize the RichTextEditor when enableFloating is false.', () => {
    let rteObj: RichTextEditor;
    let rteEle: HTMLElement;
    beforeAll(() => {
        rteObj = renderRTE({
            toolbarSettings: {
                enableFloating: false,
                items: ['fullscreen','Bold','SourceCode']
            },
        });
        rteEle = rteObj.element;
    });

    it('Test - toolbar height testing when maximize/minimize and check toolbar wrapper is not null.', () => {
        const toolbarElement = rteEle.querySelector('.e-toolbar-wrapper') as HTMLElement | null;
        expect(toolbarElement != null).toBe(true);
        const toolbarHeight: string | null = toolbarElement.style.height;
        const trgEle: HTMLElement = <HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0];
        trgEle.click();
        trgEle.click();
        const newElement = rteEle.querySelector('.e-toolbar-wrapper') as HTMLElement | null;
        const newHeight: string | null = newElement.style.height;      
        expect(newHeight).toBe(toolbarHeight);
        
    });
    afterAll(() => {
        destroy(rteObj);
    });
});
describe("863056-Code view shortcut key tooltip is not displaying properly", () => {
    let rteObj : RichTextEditor;
    beforeAll( () =>{
        rteObj = renderRTE({
            toolbarSettings: {
                items: ['SourceCode']
            },
        });
    });
    it('check tooltip name of code view and preview', (done) => {
        rteObj.focusIn();
        let codeView: HTMLElement = <HTMLElement>document.body.querySelectorAll(".e-toolbar-items")[0].childNodes[0];
        expect(codeView.title === 'Code View (Ctrl+Shift+H)').toBe(true);
        codeView.click();
            setTimeout(() => {
              const previewButton: HTMLElement = <HTMLElement>document.body.querySelectorAll(".e-toolbar-item")[0];
              expect(previewButton.title === 'Preview (Ctrl+Shift+H)').toBe(true);
              previewButton.click();
              setTimeout(() => {
                codeView = <HTMLElement>document.body.querySelectorAll(".e-toolbar-item")[0];
                expect(codeView.title === 'Code View (Ctrl+Shift+H)').toBe(true);
                done();
              }, 1000);
            }, 1000);
    });
    afterAll( (done: DoneFn) => {
        destroy(rteObj);
        done();
    });
});

describe('865043 - In toolbar settings, enable floating set to false the tooltip does not render', () => {
    let rteObj: RichTextEditor;
    beforeAll((done) => {
        rteObj = renderRTE({
            toolbarSettings: {
                items: ['FontName', 'FontSize', 'Formats', 'OrderedList', 'UnorderedList'],
                enableFloating: false
            },
            value: "Rich Text Editor"
        });
        done();
    });
    it('Checking the tooltip is rendered when enabling floating is set to false.', (done: Function) => {
        const toolbarItems: NodeListOf<Element> = document.querySelectorAll('.e-toolbar-item');
        event = new MouseEvent('mouseover', { bubbles: true, cancelable: true });
        toolbarItems[0].dispatchEvent(event);
        expect((toolbarItems[0] as HTMLElement).getAttribute('data-content')).not.toBe(null);
        done();
    });
    afterAll((done: DoneFn) => {
        destroy(rteObj);
        done();
    });
});

describe('982113 - Dynamic Property changes for tooltip and Enable Floating Toolbar Offset', () => {
    let rteObj: RichTextEditor;
    beforeAll(() => {
        rteObj = renderRTE({
            toolbarSettings: {
                items: ['NumberFormatList', 'BulletFormatList'
                ]
            },
        });
    });
    afterAll(() => {
        destroy(rteObj);
    });
    it('check the tooltip', () => {
        expect(document.querySelectorAll('.e-toolbar-item.e-template').length).toEqual(2);
        expect(document.querySelectorAll('.e-toolbar-item.e-template')[0].getAttribute('title')).toEqual('Number Format List (Ctrl+Shift+O)');
        expect(document.querySelectorAll('.e-toolbar-item.e-template')[1].getAttribute('title')).toEqual('Bullet Format List (Ctrl+Alt+O)');
        expect(document.querySelector(".e-richtexteditor .e-toolbar").parentElement.style.top).toBe('0px');
        rteObj.showTooltip = false;
        rteObj.floatingToolbarOffset = 200;
        rteObj.dataBind();
        expect(document.querySelectorAll('.e-toolbar-item.e-template')[0].getAttribute('title')).toEqual('Number Format List');
        expect(document.querySelectorAll('.e-toolbar-item.e-template')[1].getAttribute('title')).toEqual('Bullet Format List');
        expect(document.querySelector(".e-richtexteditor .e-toolbar").parentElement.style.top).toBe('200px');
    });
});

describe('821312: Bullet list does not reverted after click on the bullet list icon', () => {
    let rteObj: RichTextEditor;
    beforeAll((done) => {
        rteObj = renderRTE({
            toolbarSettings: {
                items: ['NumberFormatList', 'BulletFormatList'],
            },
            value: `<p class="pEle">Description</p>`
        });
        done();
    });
    it('Checking the bullet list revert after list type changed', (done: Function) => {
        let toolbarItem = document.querySelectorAll('.e-rte-toolbar .e-toolbar-item')[1];
        let dropdownBtn = toolbarItem.firstChild.childNodes[1];
        //Modified rendering from dropdown to split button
        let bulletListFristChild = toolbarItem.firstChild.firstChild;
        var mouseDownEvent = new MouseEvent('mousedown', {
            bubbles: true,
            cancelable: true,
            view: window,
        });
        let pEle = document.querySelector('.pEle');
        rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, pEle.firstChild, pEle.firstChild, 1, 3);
        bulletListFristChild.dispatchEvent(mouseDownEvent);
        (bulletListFristChild as HTMLElement).click();
        dropdownBtn.dispatchEvent(mouseDownEvent);
        (document.querySelector('.e-dropdown-popup') as HTMLElement).click();
        bulletListFristChild.dispatchEvent(mouseDownEvent);
        (bulletListFristChild as HTMLElement).click();
        expect(rteObj.inputElement.innerHTML === `<p class="pEle">Description</p>`).toBe(true);
        done();
    });
    afterAll((done: DoneFn) => {
        destroy(rteObj);
        done();
    });
});
describe("Bold and Italic actions for Nested List types", () => {
    let rteObj: RichTextEditor;
    beforeAll(() => {
        rteObj = renderRTE({
            toolbarSettings: {
                items: ["Bold", "Italic"]
            },
            value: "<ol><li id=\"list1\">Syncfusion<ol><li>RTE<ol><li id=\"list2\">Bold Action</li></ol></li></ol></li></ol>"
        });
    });
    afterAll(() => {
        destroy(rteObj);
    });
    it("Bold and Italic", () => {
        let range = new Range();
        let start = rteObj.inputElement.querySelector('li');
        const selection = window.getSelection();  
        selection.removeAllRanges();
        // Select paragraphconst 
        range = document.createRange();
        range.selectNodeContents(start);  
        selection.addRange(range);
        let bold = document.getElementById(rteObj.getID() + '_toolbar_Bold');
        bold.click();
        expect(rteObj.inputElement.innerHTML).toBe('<ol><li id="list1" style="font-weight: bold;"><strong>Syncfusion</strong><ol><li style="font-weight: bold;"><strong>RTE</strong><ol><li id="list2" style="font-weight: bold;"><strong>Bold Action</strong></li></ol></li></ol></li></ol>');        let italic = document.getElementById(rteObj.getID() + '_toolbar_Italic');
        italic.click();
        expect(rteObj.inputElement.innerHTML).toBe('<ol><li id="list1" style="font-weight: bold; font-style: italic;"><strong><em>Syncfusion</em></strong><ol><li style="font-weight: bold; font-style: italic;"><strong><em>RTE</em></strong><ol><li id="list2" style="font-weight: bold; font-style: italic;"><strong><em>Bold Action</em></strong></li></ol></li></ol></li></ol>');    });
});

describe("962380 - Applying Bold to Main Bullet Also Affects Sub-Bullets in Rich Text Editor", () => {
    let rteObj: RichTextEditor;
    beforeAll(() => {
        rteObj = renderRTE({
            toolbarSettings: {
                items: ["Bold", "Italic"]
            },
            value: "<ol><li id=\"list1\">Syncfusion<ol><li>RTE<ol><li id=\"list2\">Bold Action</li></ol></li></ol></li></ol>"
        });
    });
    afterAll(() => {
        destroy(rteObj);
    });
    it("Bold and Italic", () => {
        let range = new Range();
        let start = rteObj.inputElement.querySelector('li');
        const selection = window.getSelection();  
        selection.removeAllRanges();
        // Select paragraphconst 
        range = document.createRange();
        range.selectNodeContents(start.firstChild);  
        selection.addRange(range);
        let bold = document.getElementById(rteObj.getID() + '_toolbar_Bold');
        bold.click();
        expect(rteObj.inputElement.innerHTML).toBe('<ol><li id="list1"><strong>Syncfusion</strong><ol><li>RTE<ol><li id="list2">Bold Action</li></ol></li></ol></li></ol>');
        let italic = document.getElementById(rteObj.getID() + '_toolbar_Italic');
        italic.click();
        expect(rteObj.inputElement.innerHTML).toBe('<ol><li id="list1"><strong><em>Syncfusion</em></strong><ol><li>RTE<ol><li id="list2">Bold Action</li></ol></li></ol></li></ol>');
    });
});

describe("963397 - Applying Format to Main Bullet Also Affects Sub-Bullets in Rich Text Editor", () => {
    let rteObj: RichTextEditor;
    beforeAll(() => {
        rteObj = renderRTE({
            toolbarSettings: {
                items: ["Formats"]
            },
            value: "<ol><li id=\"list1\">Syncfusion<ol><li>RTE<ol><li id=\"list2\">Bold Action</li></ol></li></ol></li></ol>"
        });
    });
    afterAll(() => {
        destroy(rteObj);
    });
    it("Check whether the selected text changed to the selected format", () => {
        let range = new Range();
        let start = rteObj.inputElement.querySelector('li');
        let selection = window.getSelection();  
        selection.removeAllRanges();
        // Select paragraphconst 
        range = document.createRange();
        range.selectNodeContents(start.firstChild);  
        selection.addRange(range);
        let format: HTMLElement = rteObj.element.querySelector('#' + rteObj.getID() + '_toolbar_Formats');
        dispatchEvent(format, 'mousedown');
        dispatchEvent(format, 'mouseup');
        format.click();
        let items: any = document.querySelectorAll('#' + rteObj.getID() + '_toolbar_Formats-popup .e-item');
        items[1].click();
        expect(rteObj.inputElement.innerHTML === '<ol><li id="list1"><h1>Syncfusion</h1><ol><li>RTE<ol><li id="list2">Bold Action</li></ol></li></ol></li></ol>').toBe(true);
        selection = window.getSelection();  
        selection.removeAllRanges();
        // Select paragraphconst 
        range = document.createRange();
        range.selectNodeContents(start.lastChild);  
        selection.addRange(range);
        format.click();
        items = document.querySelectorAll('#' + rteObj.getID() + '_toolbar_Formats-popup .e-item');
        items[2].click();
        expect(rteObj.inputElement.innerHTML === '<ol><li id="list1"><h1>Syncfusion</h1><ol><li><h2>RTE</h2><ol><li id="list2"><h2 id="list2">Bold Action</h2></li></ol></li></ol></li></ol>').toBe(true);
    });
});

describe('941202 - None Option Incorrectly Selected in List Dropdown for Normal Paragraph Content', () => {
    let editor: RichTextEditor;
    beforeEach((done: DoneFn)=> {
        editor = renderRTE({
            toolbarSettings: {
                items: ['NumberFormatList']
            }
        })
        done();
    });
    afterEach((done: DoneFn)=> {
        destroy(editor);
        done();
    });
    it ('Should not update the dropdown status for the paragraph.', (done: DoneFn)=> {
        editor.value = '<p>Test</p>';
        editor.dataBind();
        editor.focusIn();
        const range: Range = new Range();
        range.setStart(editor.inputElement.querySelector('p').firstChild, 2);
        editor.selectRange(range);
        const splitButtonArrow: HTMLElement = editor.element.querySelector('.e-caret');
        splitButtonArrow.click();
        setTimeout(() => {
            const popup: HTMLElement = document.querySelector('.e-popup-open');
            const activeElem: HTMLElement = popup.querySelector('.e-item.e-active');
            expect(activeElem).toBe(null);
            done();
        }, 100);
    });
    it ('Should not update the dropdown status for the Unordered List.', (done: DoneFn)=> {
        editor.value = '<ul><li>Test</li></ul>';
        editor.dataBind();
        editor.focusIn();
        const range: Range = new Range();
        range.setStart(editor.inputElement.querySelector('li').firstChild, 2);
        editor.selectRange(range);
        const splitButtonArrow: HTMLElement = editor.element.querySelector('.e-caret');
        splitButtonArrow.click();
        setTimeout(() => {
            const popup: HTMLElement = document.querySelector('.e-popup-open');
            const activeElem: HTMLElement = popup.querySelector('.e-item.e-active');
            expect(activeElem).toBe(null);
            done();
        }, 100);
    });
    it ('Should update the dropdown status for the Ordered List.', (done: DoneFn)=> {
        editor.value = '<ol><li>Test</li></ol>';
        editor.dataBind();
        editor.focusIn();
        const range: Range = new Range();
        range.setStart(editor.inputElement.querySelector('li').firstChild, 2);
        editor.selectRange(range);
        const splitButtonArrow: HTMLElement = editor.element.querySelector('.e-caret');
        splitButtonArrow.click();
        setTimeout(() => {
            const popup: HTMLElement = document.querySelector('.e-popup-open');
            const activeElem: HTMLElement = popup.querySelector('.e-item.e-active');
            expect(activeElem).not.toBe(null);
            done();
        }, 100);
    });
});

describe('941202 - None Option Incorrectly Selected in List Dropdown for Normal Paragraph Content', () => {
    let editor: RichTextEditor;
    beforeEach((done: DoneFn)=> {
        editor = renderRTE({
            toolbarSettings: {
                items: ['BulletFormatList']
            }
        })
        done();
    });
    afterEach((done: DoneFn)=> {
        destroy(editor);
        done();
    });
    it ('Should not update the dropdown status for the paragraph.', (done: DoneFn)=> {
        editor.value = '<p>Test</p>';
        editor.dataBind();
        editor.focusIn();
        const range: Range = new Range();
        range.setStart(editor.inputElement.querySelector('p').firstChild, 2);
        editor.selectRange(range);
        const splitButtonArrow: HTMLElement = editor.element.querySelector('.e-caret');
        splitButtonArrow.click();
        setTimeout(() => {
            const popup: HTMLElement = document.querySelector('.e-popup-open');
            const activeElem: HTMLElement = popup.querySelector('.e-item.e-active');
            expect(activeElem).toBe(null);
            done();
        }, 100);
    });
    it ('Should update the dropdown status for the Unordered List.', (done: DoneFn)=> {
        editor.value = '<ul><li>Test</li></ul>';
        editor.dataBind();
        editor.focusIn();
        const range: Range = new Range();
        range.setStart(editor.inputElement.querySelector('li').firstChild, 2);
        editor.selectRange(range);
        const splitButtonArrow: HTMLElement = editor.element.querySelector('.e-caret');
        splitButtonArrow.click();
        setTimeout(() => {
            const popup: HTMLElement = document.querySelector('.e-popup-open');
            const activeElem: HTMLElement = popup.querySelector('.e-item.e-active');
            expect(activeElem).not.toBe(null);
            done();
        }, 100);
    });
    it ('Should not update the dropdown status for the Ordered List.', (done: DoneFn)=> {
        editor.value = '<ol><li>Test</li></ol>';
        editor.dataBind();
        editor.focusIn();
        const range: Range = new Range();
        range.setStart(editor.inputElement.querySelector('li').firstChild, 2);
        editor.selectRange(range);
        const splitButtonArrow: HTMLElement = editor.element.querySelector('.e-caret');
        splitButtonArrow.click();
        setTimeout(() => {
            const popup: HTMLElement = document.querySelector('.e-popup-open');
            const activeElem: HTMLElement = popup.querySelector('.e-item.e-active');
            expect(activeElem).toBe(null);
            done();
        }, 100);
    });
});

describe('955929 - Opening the Number and Bullet Format List Button popup while pressing enter key ', () => {
    let rteObj: RichTextEditor;
    let keyBoardEvent: any = { preventDefault: () => { }, type: 'keydown', stopPropagation: () => { }, ctrlKey: false, shiftKey: false, action: '', which: 8 };
    beforeAll(() => {
        rteObj = renderRTE({
            toolbarSettings: {
                items: ["NumberFormatList", "BulletFormatList"]
            },
        });
    });
    it('The Number Format List dropdown is open when you click the enter key.', () => {
        rteObj.focusIn();
        (rteObj.element.querySelectorAll(".e-toolbar-item")[0] as any).focus();
        keyBoardEvent.ctrlKey = false;
        keyBoardEvent.shiftKey = false;
        keyBoardEvent.action = 'enter';
        keyBoardEvent.target = rteObj.element.querySelector(".e-toolbar-item .e-rte-numberformatlist-dropdown");
        (rteObj.toolbarModule as any).toolBarKeyDown(keyBoardEvent);
        rteObj.dataBind();
        expect(document.querySelector(".e-popup-open") != null).toBe(true);
    });
    it('The Bullet Format List dropdown is open when you click the enter key.', () => {
        rteObj.focusIn();
        (rteObj.element.querySelectorAll(".e-toolbar-item")[1] as any).focus();
        keyBoardEvent.ctrlKey = false;
        keyBoardEvent.shiftKey = false;
        keyBoardEvent.action = 'enter';
        keyBoardEvent.target = rteObj.element.querySelector(".e-toolbar-item .e-rte-bulletformatlist-dropdown");
        (rteObj.toolbarModule as any).toolBarKeyDown(keyBoardEvent);
        rteObj.dataBind();
        expect(document.querySelector(".e-popup-open") != null).toBe(true);
    });
    afterAll(() => {
        destroy(rteObj);
    });
});

describe('962827: Fails to change bullet list to numbered list in Rich Text Editor', () => {
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
    it(' Check the NumberFormatList icon button clicking', (done) => {
        rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.element.querySelector('#rte').childNodes[0], rteObj.element.querySelector('#rte').childNodes[0], 0, 14);
        let bulletFormatList: HTMLElement = (rteObj.element.querySelector('#' + controlId + '_toolbar_NumberFormatList').childNodes[0]) as HTMLElement;
        dispatchEvent(bulletFormatList, 'mousedown');
        dispatchEvent(bulletFormatList, 'mouseup');
        bulletFormatList.click();
        expect(rteObj.element.querySelector('#rte').parentElement.tagName === 'OL').toBe(true);
        done();
    });
    it(' Check the bulletFormatList icon button clicking', (done) => {
        rteObj.formatter.editorManager.nodeSelection.setSelectionText(document, rteObj.element.querySelector('#rte').childNodes[0], rteObj.element.querySelector('#rte').childNodes[0], 0, 14);
        let bulletFormatList: HTMLElement = (rteObj.element.querySelector('#' + controlId + '_toolbar_BulletFormatList').childNodes[0]) as HTMLElement;
        dispatchEvent(bulletFormatList, 'mousedown');
        dispatchEvent(bulletFormatList, 'mouseup');
        bulletFormatList.click();
        expect(rteObj.element.querySelector('#rte').parentElement.tagName === 'UL').toBe(true);
        done();
    });
    afterEach((done: DoneFn) => {
        destroy(rteObj);
        done();
    });
});
