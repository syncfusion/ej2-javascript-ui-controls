/**
 * Table module spec
 */
import { addClass, Browser, closest, isNullOrUndefined } from "@syncfusion/ej2-base";
import { RichTextEditor, dispatchEvent } from "../../../src/rich-text-editor/index";
import { InsertHtml } from '../../../src/editor-manager/plugin/inserthtml';
import { NodeSelection } from '../../../src/selection/index';
import { renderRTE, destroy, setCursorPoint, androidUA, iPhoneUA, currentBrowserUA, ieUA } from './../render.spec';
import { getLastTextNode } from "../../../src/common/util";

describe('Table creation', () => {

    describe('div content ', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Bold', 'CreateTable']
                },
                quickToolbarSettings: {
                    table: ['TableHeader', 'TableRows', 'TableColumns', 'BackgroundColor', '-', 'TableRemove', 'Alignments', 'TableCellVerticalAlign', 'Styles', 'TableEditProperties']
                }
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('table creation', (done: Function) => {
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            expect(rteObj.element.querySelectorAll('.e-rte-content').length).toBe(1);
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[1] as HTMLElement).click();
            expect(rteObj.tableModule.popupObj.element.querySelectorAll('.e-rte-table-row').length === 3).toBe(true);
            expect(rteObj.tableModule.popupObj.element.querySelectorAll('.e-rte-tablecell').length === 30).toBe(true);
            let event: any = {
                target: (rteObj as any).tableModule.popupObj.element.querySelectorAll('.e-rte-table-row')[1].querySelectorAll('.e-rte-tablecell')[3],
                preventDefault: function () { }
            };
            (rteObj as any).tableModule.tableCellSelect(event);
            (rteObj as any).tableModule.tableCellLeave(event);
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("mouseup", false, true);
            event.target.dispatchEvent(clickEvent);
            let tar: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('table') as HTMLElement;
            addClass([tar.querySelector('td')], "e-cell-select");
            expect(tar).not.toBe(null);
            expect(tar.querySelectorAll('tr').length === 2).toBe(true);
            expect(tar.querySelectorAll('td').length === 8).toBe(true);
            clickEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent('mousedown', false, true);
            (rteObj as any).inputElement.dispatchEvent(clickEvent);
            let eventsArg: any = { pageX: 50, pageY: 300, target: tar };
            (<any>rteObj).tableModule.editAreaClickHandler({ args: eventsArg });
            setTimeout(() => {
                var tablePop = document.querySelectorAll('.e-rte-quick-popup')[0];
                expect(tablePop.classList.contains('e-rte-quick-popup')).toBe(true);
                var tableTBItems = tablePop.querySelectorAll('.e-toolbar-item');
                expect(tableTBItems.length === 10).toBe(true);
                expect(tablePop.querySelectorAll('.e-rte-toolbar').length).toBe(1);
                (tableTBItems.item(0) as HTMLElement).click();
                var table = rteObj.contentModule.getEditPanel().querySelector('table');
                expect(table.querySelectorAll('thead').length > 0).toBe(true);
                expect(table.querySelectorAll('thead tr').length === 1).toBe(true);
                expect(table.querySelectorAll('tr').length === 3).toBe(true);
                expect(table.querySelectorAll('th').length === 4).toBe(true);
                (tableTBItems.item(0) as HTMLElement).click();
                expect(table.querySelectorAll('thead').length === 0).toBe(true);
                expect(table.querySelectorAll('tr').length === 2).toBe(true);
                var tar = rteObj.contentModule.getEditPanel().querySelector('table');
                rteObj.inputElement.dispatchEvent(clickEvent);
                var eventsArg = { pageX: 50, pageY: 300, target: tar };
                (rteObj.tableModule as any).editAreaClickHandler({ args: eventsArg });
                (tableTBItems as any).item(1).childNodes[0].click();
                var popupElement = document.querySelectorAll(".e-rte-dropdown-popup.e-popup-open")[0];
                var mouseEventArgs = {
                    target: popupElement.childNodes[0].childNodes[0]
                };
                expect(popupElement.children[0].children.length === 3).toBe(true);
                expect(popupElement.children[0].children[0].children[0].classList.contains('e-insert-row-before')).toBe(true);
                document.querySelectorAll('td')[0].classList.add("e-cell-select");
                (mouseEventArgs.target as HTMLElement).click();
                expect(table.querySelectorAll('tr').length === 3).toBe(true)
                tar = rteObj.contentModule.getEditPanel().querySelector('table');
                rteObj.inputElement.dispatchEvent(clickEvent);
                eventsArg = { pageX: 50, pageY: 300, target: tar };
                (rteObj.tableModule as any).editAreaClickHandler({ args: eventsArg });
                (tableTBItems.item(1).childNodes[0] as HTMLElement).click();
                popupElement = document.querySelectorAll(".e-rte-dropdown-popup.e-popup-open")[0];
                mouseEventArgs = {
                    target: popupElement.childNodes[0].childNodes[1]
                };
                expect(popupElement.children[0].children[1].children[0].classList.contains('e-insert-row-after')).toBe(true);
                (mouseEventArgs.target as HTMLElement).click();
                expect(table.querySelectorAll('tr').length === 4).toBe(true);
                (rteObj.tableModule as any).editAreaClickHandler({ args: eventsArg });
                (tableTBItems.item(1).childNodes[0] as HTMLElement).click();
                popupElement = document.querySelectorAll(".e-rte-dropdown-popup.e-popup-open")[0];
                mouseEventArgs = {
                    target: popupElement.childNodes[0].childNodes[2]
                };
                expect(popupElement.children[0].children[2].children[0].classList.contains('e-delete-row')).toBe(true);
                document.querySelectorAll('td')[8].classList.add("e-cell-select");
                (mouseEventArgs.target as HTMLElement).click();
                expect(table.querySelectorAll('tr').length === 3).toBe(true);
                tar = rteObj.contentModule.getEditPanel().querySelector('table');
                clickEvent = document.createEvent("MouseEvents");
                clickEvent.initEvent('mousedown', false, true);
                rteObj.inputElement.dispatchEvent(clickEvent);
                eventsArg = { pageX: 50, pageY: 300, target: tar };
                (rteObj.tableModule as any).editAreaClickHandler({ args: eventsArg });
                (tableTBItems.item(2).childNodes[0] as HTMLElement).click();
                popupElement = document.querySelectorAll(".e-rte-dropdown-popup.e-popup-open")[0];
                mouseEventArgs = {
                    target: popupElement.childNodes[0].childNodes[0]
                };
                expect(popupElement.children[0].children.length === 3).toBe(true);
                expect(popupElement.children[0].children[0].children[0].classList.contains('e-insert-column-left')).toBe(true);
                expect(table.querySelector('tr').querySelectorAll('td').length === 4).toBe(true);
                (mouseEventArgs.target as HTMLElement).click();
                expect(table.querySelector('tr').querySelectorAll('td').length === 5).toBe(true);
                (rteObj.tableModule as any).editAreaClickHandler({ args: eventsArg });
                (tableTBItems.item(2).childNodes[0] as HTMLElement).click();
                popupElement = document.querySelectorAll(".e-rte-dropdown-popup.e-popup-open")[0];
                mouseEventArgs = {
                    target: popupElement.childNodes[0].childNodes[1]
                };
                expect(popupElement.children[0].children[1].children[0].classList.contains('e-insert-column-right')).toBe(true);
                (mouseEventArgs.target as HTMLElement).click();
                expect(table.querySelector('tr').querySelectorAll('td').length === 6).toBe(true);
                (rteObj.tableModule as any).editAreaClickHandler({ args: eventsArg });
                (tableTBItems.item(2).childNodes[0] as HTMLElement).click();
                popupElement = document.querySelectorAll(".e-rte-dropdown-popup.e-popup-open")[0];
                mouseEventArgs = {
                    target: popupElement.childNodes[0].childNodes[2]
                };
                expect(popupElement.children[0].children[2].children[0].classList.contains('e-delete-column')).toBe(true);
                document.querySelectorAll('td')[1].classList.add("e-cell-select");
                (mouseEventArgs.target as HTMLElement).click();
                expect(table.querySelector('tr').querySelectorAll('td').length === 5).toBe(true);
                tar = rteObj.contentModule.getEditPanel().querySelector('table tr td');
                var selObj = new NodeSelection();
                (rteObj.tableModule as any).cellSelect({ args: { target: tar, preventDefault: function () { } } });
                selObj.setSelectionText(rteObj.contentModule.getDocument(), tar, tar, 0, 0);
                (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
                rteObj.inputElement.dispatchEvent(clickEvent);
                eventsArg = { pageX: 50, pageY: 300, target: tar };
                (rteObj.tableModule as any).editAreaClickHandler({ args: eventsArg });
                (tableTBItems.item(3).childNodes[0] as HTMLElement).click();
                expect(document.querySelectorAll('.e-rte-backgroundcolor-dropdown.e-popup-open').length > 0).toBe(true);
                (document.querySelectorAll('.e-rte-backgroundcolor-dropdown.e-popup-open .e-custom-palette .e-palette .e-row')[1].children[4] as HTMLElement).click();
                (tableTBItems.item(6).childNodes[0] as HTMLElement).click();
                popupElement = document.querySelectorAll(".e-rte-dropdown-popup.e-popup-open")[0];
                mouseEventArgs = {
                    target: popupElement.childNodes[0].childNodes[0]
                };
                expect(popupElement.children[0].children[0].children[0].classList.contains('e-justify-left')).toBe(true);
                (mouseEventArgs.target as HTMLElement).click();
                selObj.setSelectionText(rteObj.contentModule.getDocument(), tar, tar, 0, 0);
                (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
                rteObj.inputElement.dispatchEvent(clickEvent);
                eventsArg = { pageX: 50, pageY: 300, target: tar };
                (rteObj.tableModule as any).editAreaClickHandler({ args: eventsArg });
                (tableTBItems.item(6).childNodes[0] as HTMLElement).click();
                popupElement = document.querySelectorAll(".e-rte-dropdown-popup.e-popup-open")[0];
                mouseEventArgs = {
                    target: popupElement.childNodes[0].childNodes[1]
                };
                expect(popupElement.children[0].children[1].children[0].classList.contains('e-justify-center')).toBe(true);
                (mouseEventArgs.target as HTMLElement).click();
                selObj.setSelectionText(rteObj.contentModule.getDocument(), tar, tar, 0, 0);
                (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
                rteObj.inputElement.dispatchEvent(clickEvent);
                eventsArg = { pageX: 50, pageY: 300, target: tar };
                (rteObj.tableModule as any).editAreaClickHandler({ args: eventsArg });
                (tableTBItems.item(6).childNodes[0] as HTMLElement).click();
                popupElement = document.querySelectorAll(".e-rte-dropdown-popup.e-popup-open")[0];
                mouseEventArgs = {
                    target: popupElement.childNodes[0].childNodes[2]
                };
                expect(popupElement.children[0].children[2].children[0].classList.contains('e-justify-right')).toBe(true);
                (mouseEventArgs.target as HTMLElement).click();
                selObj.setSelectionText(rteObj.contentModule.getDocument(), tar, tar, 0, 0);
                (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
                rteObj.inputElement.dispatchEvent(clickEvent);
                eventsArg = { pageX: 50, pageY: 300, target: tar };
                (rteObj.tableModule as any).editAreaClickHandler({ args: eventsArg });
                (tableTBItems.item(6).childNodes[0] as HTMLElement).click();
                popupElement = document.querySelectorAll(".e-rte-dropdown-popup.e-popup-open")[0];
                mouseEventArgs = {
                    target: popupElement.childNodes[0].childNodes[3]
                };
                expect(popupElement.children[0].children[3].children[0].classList.contains('e-justify-full')).toBe(true);
                (mouseEventArgs.target as HTMLElement).click();
                selObj.setSelectionText(rteObj.contentModule.getDocument(), tar, tar, 0, 0);
                (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
                rteObj.inputElement.dispatchEvent(clickEvent);
                eventsArg = { pageX: 50, pageY: 300, target: tar };
                (rteObj.tableModule as any).editAreaClickHandler({ args: eventsArg });
                (tableTBItems.item(7).childNodes[0] as HTMLElement).click();
                popupElement = document.querySelectorAll(".e-rte-dropdown-popup.e-popup-open")[0];
                mouseEventArgs = {
                    target: popupElement.childNodes[0].childNodes[0]
                };
                expect(popupElement.children[0].children[0].children[0].classList.contains('e-align-top')).toBe(true);
                (mouseEventArgs.target as HTMLElement).click();
                expect(tar.style.verticalAlign === 'top').toBe(true);
                (rteObj.tableModule as any).editAreaClickHandler({ args: eventsArg });
                (tableTBItems.item(7).childNodes[0] as HTMLElement).click();
                popupElement = document.querySelectorAll(".e-rte-dropdown-popup.e-popup-open")[0];
                mouseEventArgs = {
                    target: popupElement.childNodes[0].childNodes[1]
                };
                expect(popupElement.children[0].children[1].children[0].classList.contains('e-align-middle')).toBe(true);
                (mouseEventArgs.target as HTMLElement).click();
                expect(tar.style.verticalAlign === 'middle').toBe(true);
                (rteObj.tableModule as any).editAreaClickHandler({ args: eventsArg });
                (tableTBItems.item(7).childNodes[0] as HTMLElement).click();
                popupElement = document.querySelectorAll(".e-rte-dropdown-popup.e-popup-open")[0];
                mouseEventArgs = {
                    target: popupElement.childNodes[0].childNodes[2]
                };
                expect(popupElement.children[0].children[2].children[0].classList.contains('e-align-bottom')).toBe(true);
                (mouseEventArgs.target as HTMLElement).click();
                expect(tar.style.verticalAlign === 'bottom').toBe(true);
                (rteObj.tableModule as any).editAreaClickHandler({ args: eventsArg });
                (tableTBItems.item(8).childNodes[0] as HTMLElement).click();
                popupElement = document.querySelectorAll(".e-rte-dropdown-popup.e-popup-open")[0];
                mouseEventArgs = {
                    target: popupElement.childNodes[0].childNodes[0]
                };
                (mouseEventArgs.target as HTMLElement).click();
                expect(closest(tar, 'table').classList.contains('e-dashed-border')).toBe(true);
                (tableTBItems.item(8).childNodes[0] as HTMLElement).click();
                popupElement = document.querySelectorAll(".e-rte-dropdown-popup.e-popup-open")[0];
                mouseEventArgs = {
                    target: popupElement.childNodes[0].childNodes[1]
                };
                (mouseEventArgs.target as HTMLElement).click();
                expect(closest(tar, 'table').classList.contains('e-alternate-border')).toBe(true);
                tar = rteObj.contentModule.getEditPanel().querySelector('table');
                rteObj.inputElement.dispatchEvent(clickEvent);
                eventsArg = { pageX: 50, pageY: 300, target: tar };
                (rteObj.tableModule as any).editAreaClickHandler({ args: eventsArg });
                (tableTBItems.item(9).childNodes[0] as HTMLElement).click();
                expect(document.body.querySelector('.e-rte-edit-table.e-dialog')).not.toBe(null);
                expect(document.body.querySelector('.e-cell-padding')).not.toBe(null);
                expect(document.body.querySelector('.e-cell-spacing')).not.toBe(null);
                expect(document.body.querySelector('.e-size-update')).not.toBe(null);
                clickEvent.initEvent('click', false, true);
                document.body.querySelector('.e-size-update').dispatchEvent(clickEvent);
                tar = rteObj.contentModule.getEditPanel().querySelector('table');
                rteObj.inputElement.dispatchEvent(clickEvent);
                eventsArg = { pageX: 50, pageY: 300, target: tar };
                (rteObj.tableModule as any).editAreaClickHandler({ args: eventsArg });
                selObj.setSelectionText(rteObj.contentModule.getDocument(), tar, tar, 0, 0);
                var backgroundColorPickerItem = document.querySelectorAll(".e-primary.e-apply")[0];
                var msEventArgs = {
                    target: backgroundColorPickerItem
                };
                clickEvent.initEvent('click', false, true);
                ((tableTBItems.item(3).childNodes[0] as HTMLElement).querySelector('.e-background-color') as HTMLElement).click();
                tar = rteObj.contentModule.getEditPanel().querySelector('td') as any;
                rteObj.inputElement.dispatchEvent(clickEvent);
                eventsArg = { pageX: 50, pageY: 300, target: tar };
                (rteObj.tableModule as any).editAreaClickHandler({ args: eventsArg });
                selObj.setSelectionText(rteObj.contentModule.getDocument(), tar, tar, 0, 0);
                (tableTBItems.item(5).childNodes[0] as HTMLElement).click();
                expect(rteObj.contentModule.getEditPanel().querySelector('table')).toBe(null);
                var eventArgs = { args: { target: document, preventDefault: function () { } } };
                (rteObj.tableModule as any).docClick(eventArgs);
                done();
            }, 500);
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
        });
    });

    describe('Checking the width for the table elements added', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['CreateTable']
                },
                tableSettings: { width: "500px" }
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('2*2 table creation with width configured', (done: Function) => {
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            expect(rteObj.element.querySelectorAll('.e-rte-content').length).toBe(1);
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            expect(rteObj.tableModule.popupObj.element.querySelectorAll('.e-rte-table-row').length === 3).toBe(true);
            expect(rteObj.tableModule.popupObj.element.querySelectorAll('.e-rte-tablecell').length === 30).toBe(true);
            let event: any = {
                target: (rteObj as any).tableModule.popupObj.element.querySelectorAll('.e-rte-table-row')[1].querySelectorAll('.e-rte-tablecell')[1],
                preventDefault: function () { }
            };
            (rteObj as any).tableModule.tableCellSelect(event);
            (rteObj as any).tableModule.tableCellLeave(event);
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("mouseup", false, true);
            event.target.dispatchEvent(clickEvent);
            let tar: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('table') as HTMLElement;
            expect(tar).not.toBe(null);
            expect(tar.querySelectorAll('tr').length === 2).toBe(true);
            expect(tar.querySelectorAll('td').length === 4).toBe(true);
            expect(tar.querySelectorAll('td')[0].style.width).toBe("50%");
            expect(tar.querySelectorAll('td')[1].style.width).toBe("50%");
            done();
        });
        it('4*2 table creation with width configured', (done: Function) => {
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            expect(rteObj.element.querySelectorAll('.e-rte-content').length).toBe(1);
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            expect(rteObj.tableModule.popupObj.element.querySelectorAll('.e-rte-table-row').length === 3).toBe(true);
            expect(rteObj.tableModule.popupObj.element.querySelectorAll('.e-rte-tablecell').length === 30).toBe(true);
            let event: any = {
                target: (rteObj as any).tableModule.popupObj.element.querySelectorAll('.e-rte-table-row')[1].querySelectorAll('.e-rte-tablecell')[3],
                preventDefault: function () { }
            };
            (rteObj as any).tableModule.tableCellSelect(event);
            (rteObj as any).tableModule.tableCellLeave(event);
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("mouseup", false, true);
            event.target.dispatchEvent(clickEvent);
            let tar: HTMLElement = rteObj.contentModule.getEditPanel().querySelectorAll('table')[1] as HTMLElement;
            expect(tar).not.toBe(null);
            expect(tar.querySelectorAll('tr').length === 2).toBe(true);
            expect(tar.querySelectorAll('td').length === 8).toBe(true);
            expect(tar.querySelectorAll('td')[0].style.width).toBe("25%");
            expect(tar.querySelectorAll('td')[1].style.width).toBe("25%");
            expect(tar.querySelectorAll('td')[2].style.width).toBe("25%");
            expect(tar.querySelectorAll('td')[3].style.width).toBe("25%");
            done();
        });
    });

    describe('Table properties quicktoolbar ', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Bold', 'CreateTable']
                },
                quickToolbarSettings: {
                    table: ['TableEditProperties']
                }
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('Cellpadding and cellSpacing style in table', (done: Function) => {
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            expect(rteObj.element.querySelectorAll('.e-rte-content').length).toBe(1);
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[1] as HTMLElement).click();
            expect(rteObj.tableModule.popupObj.element.querySelectorAll('.e-rte-table-row').length === 3).toBe(true);
            expect(rteObj.tableModule.popupObj.element.querySelectorAll('.e-rte-tablecell').length === 30).toBe(true);
            let event: any = {
                target: (rteObj as any).tableModule.popupObj.element.querySelectorAll('.e-rte-table-row')[1].querySelectorAll('.e-rte-tablecell')[3],
                preventDefault: function () { }
            };
            (rteObj as any).tableModule.tableCellSelect(event);
            (rteObj as any).tableModule.tableCellLeave(event);
            let clickEvent: any = document.createEvent("MouseEvents");

            clickEvent.initEvent("mouseup", false, true);
            event.target.dispatchEvent(clickEvent);
            let tar: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('table') as HTMLElement;
            expect(tar).not.toBe(null);
            expect(tar.querySelectorAll('tr').length === 2).toBe(true);
            expect(tar.querySelectorAll('td').length === 8).toBe(true);
            clickEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent('mousedown', false, true);
            (rteObj as any).inputElement.dispatchEvent(clickEvent);
            let eventsArg: any = { pageX: 50, pageY: 300, target: tar };
            (<any>rteObj).tableModule.editAreaClickHandler({ args: eventsArg });
            setTimeout(() => {
                let tablePop: any = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                expect(tablePop.classList.contains('e-rte-quick-popup')).toBe(true);
                let tableTBItems: any = tablePop.querySelectorAll('.e-toolbar-item');
                let tar: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('td') as HTMLElement;
                (rteObj as any).inputElement.dispatchEvent(clickEvent);
                let eventsArg: any = { pageX: 50, pageY: 300, target: tar };
                (<any>rteObj).tableModule.editAreaClickHandler({ args: eventsArg });
                ((<HTMLElement>tableTBItems.item(0)).childNodes[0] as HTMLElement).click();
                let cellPadElem = document.getElementById('cellPadding');
                let cellSpcElem = document.getElementById('cellSpacing');
                (cellPadElem as any).value = 20;
                (cellSpcElem as any).value = 25;
                clickEvent.initEvent('click', false, true);
                document.body.querySelector('.e-size-update').dispatchEvent(clickEvent);
                let tableElm = document.querySelector('table');
                expect(tableElm.getAttribute('cellspacing') === '25').toBe(true);
                expect(tableElm.classList.contains('e-rte-table-border')).toBe(true);
                let tdElem = tableElm.querySelectorAll('td');
                for (let i: number = 0; i < tdElem.length; i++) {
                    expect(tdElem[i].style.padding === '20px').toBe(true);
                }
                done();
            }, 500);
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
        });
    });

    describe('table dialog  ', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                placeholder: 'Insert table here',
                toolbarSettings: {
                    items: ['Bold', 'CreateTable']
                },
                resizeStart: (args) => {
                    expect(args.requestType.toLocaleLowerCase() === 'table');
                },
                resizeStop: (args) => {
                    expect(args.requestType.toLocaleLowerCase() === 'table');
                },
                resizing: (args) => {
                    expect(args.requestType.toLocaleLowerCase() === 'table');
                }
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('table creation - dialog', () => {
            expect(rteObj.element.querySelectorAll('.e-rte-content').length).toBe(1);
            expect((rteObj.element.querySelectorAll('.rte-placeholder')[0] as HTMLElement).style.display).toBe('block');
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[1] as HTMLElement).click();
            let target: HTMLElement = (rteObj as any).tableModule.popupObj.element.querySelector('.e-insert-table-btn');
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("click", false, true);
            target.dispatchEvent(clickEvent);
            expect(document.body.querySelector('.e-rte-edit-table.e-dialog')).not.toBe(null);
            expect(rteObj.tableModule.editdlgObj.element.querySelector('#tableColumn')).not.toBe(null);
            expect(rteObj.tableModule.editdlgObj.element.querySelector('#tableRow')).not.toBe(null);
            expect((rteObj.tableModule.editdlgObj.element.querySelector('#tableRow') as any).value === '3').toBe(true);
            expect((rteObj.tableModule.editdlgObj.element.querySelector('#tableColumn') as any).value === '3').toBe(true);
            target = rteObj.tableModule.editdlgObj.element.querySelector('.e-insert-table') as HTMLElement;
            target.dispatchEvent(clickEvent);
            let table: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('table') as HTMLElement;
            expect(table.querySelectorAll('tr').length === 3).toBe(true);
            expect(table.querySelectorAll('td').length === 9).toBe(true);
            (rteObj.tableModule as any).resizeHelper({ target: table, preventDefault: function () { } });
            expect(rteObj.contentModule.getEditPanel().querySelectorAll('.e-column-resize').length === 2).toBe(true);
            expect(rteObj.contentModule.getEditPanel().querySelectorAll('.e-row-resize').length === 3).toBe(true);
            expect(rteObj.contentModule.getEditPanel().querySelectorAll('.e-table-box').length === 1).toBe(true);
            let reCol1: any = rteObj.contentModule.getEditPanel().querySelectorAll('.e-column-resize')[0];
            clickEvent.initEvent("mousedown", false, true);
            reCol1.dispatchEvent(clickEvent);
            (rteObj.tableModule as any).resizeStart(clickEvent);
            expect((rteObj.element.querySelectorAll('.rte-placeholder')[0] as HTMLElement).style.display).toBe('none');
        });
        it('Percentage Check-While resizing', () => {
            let table: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('table') as HTMLElement;
            let mouseEvent = document.createEvent('MouseEvents');
            mouseEvent.initEvent('mousedown', true, true);
            (document.getElementsByClassName('e-column-resize')[0] as HTMLElement).dispatchEvent(mouseEvent);
            mouseEvent.initEvent('mousemove', true, true);
            document.dispatchEvent(mouseEvent);
            mouseEvent.initEvent('mouseup', true, true);
            document.dispatchEvent(mouseEvent);
            let colWidth: string = (table as HTMLTableElement).rows[0].cells[0].style.width
            expect(colWidth.indexOf('%') !== -1).toBe(true);
        });
        it('resize end', () => {
            let resizeBot: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('.e-column-resize') as HTMLElement;
            let table: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('table') as HTMLElement;
            (rteObj.tableModule as any).resizeEnd({ target: resizeBot });
            expect(rteObj.contentModule.getEditPanel().querySelector('.e-column-resize')).toBe(null);
            expect((rteObj.tableModule as any).pageX).toBe(null);
        });
        it('resizing', () => {
            let table: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('table') as HTMLElement;
            expect(table.querySelectorAll('tr').length === 3).toBe(true);
            expect(table.querySelectorAll('td').length === 9).toBe(true);
            let clickEvent: any = document.createEvent("MouseEvents");
            (rteObj.tableModule as any).resizeHelper({ target: table, preventDefault: function () { } });
            let reCol1: any = rteObj.contentModule.getEditPanel().querySelectorAll('.e-column-resize')[0];
            (<any>rteObj.tableModule).resizeBtnStat.column = true;
            (rteObj.tableModule as any).resizeStart({ target: reCol1, pageX: 100, pageY: 0, preventDefault: function () { } });
            clickEvent.initEvent("mousedown", false, true);
            reCol1.dispatchEvent(clickEvent);
            (rteObj.tableModule as any).resizeStart(clickEvent);
            (<any>rteObj.tableModule).resizeBtnStat.column = true;
            let width: any = (table as HTMLTableElement).rows[0].cells[0].offsetWidth;
            (rteObj.tableModule as any).resizing({ target: reCol1, pageX: 200, pageY: 200, preventDefault: function () { } });
            width += 200;
            //expect(width).toEqual((table as HTMLTableElement).rows[0].cells[0].offsetWidth);
            let resRow1: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('.e-row-resize') as HTMLElement;
            clickEvent.initEvent("mousedown", false, true);
            resRow1.dispatchEvent(clickEvent);
            (rteObj.tableModule as any).resizeStart(clickEvent);
            (<any>rteObj.tableModule).resizeBtnStat.row = true;
            (rteObj.tableModule as any).resizing({ target: resRow1, pageX: 100, pageY: 100, preventDefault: function () { } });
            let height: any = (table as HTMLTableElement).rows[0].offsetHeight;
            (<any>rteObj.tableModule).resizeBtnStat.row = true;
            (rteObj.tableModule as any).resizing({ target: resRow1, pageX: 100, pageY: 200, preventDefault: function () { } });
            height += 100;
            expect(height).toEqual((table as HTMLTableElement).rows[0].offsetHeight);

            let tableBox: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('.e-table-box') as HTMLElement;
            clickEvent.initEvent("mousedown", false, true);
            tableBox.dispatchEvent(clickEvent);
            (rteObj.tableModule as any).resizeStart(clickEvent);
            (<any>rteObj.tableModule).resizeBtnStat.tableBox = true;
            (rteObj.tableModule as any).resizing({ target: tableBox, pageX: 100, pageY: 100, preventDefault: function () { } });
            height = (table as HTMLTableElement).offsetHeight;
            width = (table as HTMLTableElement).offsetWidth;
            (<any>rteObj.tableModule).resizeBtnStat.tableBox = true;
            (rteObj.tableModule as any).resizing({ target: tableBox, pageX: 100, pageY: 200, preventDefault: function () { } });
            height += 100;
            width += 201;
            expect(height).toEqual((table as HTMLTableElement).offsetHeight);
            let eventArgs: any = { args: { target: document, preventDefault: function () { } } };
            (<any>rteObj).tableModule.docClick(eventArgs);
        });
    });

    describe('table keyboard support ', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let keyboardEventArgs = {
            preventDefault: function () { },
            keyCode: 9,
            shiftKey: false
        };
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Bold', 'CreateTable']
                }
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('key navigation', () => {
            expect(rteObj.element.querySelectorAll('.e-rte-content').length).toBe(1);
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[1] as HTMLElement).click();
            let target: HTMLElement = (rteObj as any).tableModule.popupObj.element.querySelector('.e-insert-table-btn');
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("click", false, true);
            target.dispatchEvent(clickEvent);
            expect(document.body.querySelector('.e-rte-edit-table.e-dialog')).not.toBe(null);
            expect(rteObj.tableModule.editdlgObj.element.querySelector('#tableColumn')).not.toBe(null);
            expect(rteObj.tableModule.editdlgObj.element.querySelector('#tableRow')).not.toBe(null);
            expect((rteObj.tableModule.editdlgObj.element.querySelector('#tableRow') as any).value === '3').toBe(true);
            expect((rteObj.tableModule.editdlgObj.element.querySelector('#tableColumn') as any).value === '3').toBe(true);
            target = rteObj.tableModule.editdlgObj.element.querySelector('.e-insert-table') as HTMLElement;
          
            target.dispatchEvent(clickEvent);
            let table: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('table') as HTMLElement;
            expect(table.querySelectorAll('tr').length === 3).toBe(true);
            expect(table.querySelectorAll('td').length === 9).toBe(true);
            let selObj: NodeSelection = new NodeSelection();
            (table as HTMLElement).querySelectorAll('td')[8].classList.add("e-cell-select");
            selObj.setSelectionText(rteObj.contentModule.getDocument(), table.querySelectorAll('td')[8], table.querySelectorAll('td')[8], 0, 0);
            table.querySelectorAll('td')[0].classList.remove("e-cell-select");
            (<any>rteObj).tableModule.keyDown({ args: keyboardEventArgs });
            (<any>rteObj).tableModule.keyDown({ args: keyboardEventArgs });
            expect(table.querySelectorAll('td')[10] === selObj.getRange(rteObj.contentModule.getDocument()).startContainer).toBe(true);
            keyboardEventArgs.keyCode = 37;
            (<any>rteObj).tableModule.keyDown({ args: keyboardEventArgs });
            expect(table.querySelectorAll('td')[9] === selObj.getRange(rteObj.contentModule.getDocument()).startContainer).toBe(true);
            keyboardEventArgs.keyCode = 39;
            (<any>rteObj).tableModule.keyDown({ args: keyboardEventArgs });
            expect(table.querySelectorAll('td')[10] === selObj.getRange(rteObj.contentModule.getDocument()).startContainer).toBe(true);
            keyboardEventArgs.keyCode = 38;
            (<any>rteObj).tableModule.keyDown({ args: keyboardEventArgs });
            expect(table.querySelectorAll('td')[7] === selObj.getRange(rteObj.contentModule.getDocument()).startContainer).toBe(true);
            keyboardEventArgs.keyCode = 40;
            (<any>rteObj).tableModule.keyDown({ args: keyboardEventArgs });
            expect(table.querySelectorAll('td')[10] === selObj.getRange(rteObj.contentModule.getDocument()).startContainer).toBe(true);
            keyboardEventArgs.keyCode = 9;
            keyboardEventArgs.shiftKey = true;
            (<any>rteObj).tableModule.keyDown({ args: keyboardEventArgs });
            expect(table.querySelectorAll('td')[9] === selObj.getRange(rteObj.contentModule.getDocument()).startContainer).toBe(true);
            selObj.setSelectionText(rteObj.contentModule.getDocument(), table.querySelectorAll('td')[11], table.querySelectorAll('td')[11], 0, 0);
            keyboardEventArgs.keyCode = 39;
            keyboardEventArgs.shiftKey = false;
            (<any>rteObj).tableModule.keyDown({ args: keyboardEventArgs });
            selObj.setSelectionText(rteObj.contentModule.getDocument(), table.querySelectorAll('td')[0], table.querySelectorAll('td')[0], 0, 0);
            keyboardEventArgs.keyCode = 39;
            (<any>rteObj).tableModule.keyDown({ args: keyboardEventArgs });
        });
    });

    describe('table dialog open close ', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Bold', 'CreateTable']
                }
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('popup open and dialog open', () => {
            expect(rteObj.element.querySelectorAll('.e-rte-content').length).toBe(1);
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[1] as HTMLElement).click();
            let target: HTMLElement = (rteObj as any).tableModule.popupObj.element.querySelector('.e-insert-table-btn');
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("click", false, true);
            target.dispatchEvent(clickEvent);
            expect(document.body.querySelector('.e-rte-edit-table.e-dialog')).not.toBe(null);
            expect(rteObj.tableModule.editdlgObj.element.querySelector('#tableColumn')).not.toBe(null);
            expect(rteObj.tableModule.editdlgObj.element.querySelector('#tableRow')).not.toBe(null);
            expect((rteObj.tableModule.editdlgObj.element.querySelector('#tableRow') as any).value === '3').toBe(true);
            expect((rteObj.tableModule.editdlgObj.element.querySelector('#tableColumn') as any).value === '3').toBe(true);
            target = rteObj.tableModule.editdlgObj.element.querySelector('.e-cancel') as HTMLElement;
            target.dispatchEvent(clickEvent);
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[1] as HTMLElement).click();
            let eventArgs: any = { args: { target: rteObj.contentModule.getEditPanel(), preventDefault: function () { } } };
            (rteObj as any).tableModule.docClick(eventArgs);
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[1] as HTMLElement).click();
            expect((rteObj as any).tableModule.popupObj).not.toBe(null);
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[1] as HTMLElement).click();
            expect((rteObj as any).tableModule.popupObj).toBe(null);
        });
    });
    describe('table resize start args ', () => {
        let rteObj: RichTextEditor;
        let value: any = `<p><b>Description:</b></p><p>The Rich Text Editor (RTE) control is an easy to render in
client side. Customer easy to edit the contents and get the HTML content for
the displayed content. A rich text editor control provides users with a toolbar
that helps them to apply rich text formats to the text entered in the text
area. </p><p><b>Functional
Specifications/Requirements:</b></p><ol><li><p>Provide
the tool bar support, it�s also customiza</p><table class="e-rte-table" style="width: 1065px; height: 50px;"><tbody><tr><td class="" style="width: 25%;"><br></td><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td></tr><tr><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td></tr></tbody></table><p>ble</p></li></ol>
`
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Bold', 'CreateTable']
                },
                value: value,
                resizeStart: (args) => {
                    expect(args.requestType.toLocaleLowerCase() === 'table');
                    args.cancel = true;
                }
            });
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('args cancel event', () => {
            let clickEvent: any = document.createEvent("MouseEvents");
            let table: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('table') as HTMLElement;
            (rteObj.tableModule as any).resizeHelper({ target: table, preventDefault: function () { } });
            let reCol1: any = rteObj.contentModule.getEditPanel().querySelectorAll('.e-column-resize')[0];
            clickEvent.initEvent("mousedown", false, true);
            reCol1.dispatchEvent(clickEvent);
            (rteObj.tableModule as any).resizeStart(clickEvent);
            expect(rteObj.contentModule.getEditPanel().querySelector('.e-column-resize')).toBe(null);
        });
    });
    describe('table resizing args ', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Bold', 'CreateTable', 'FontColor', 'BackgroundColor']
                },
                quickToolbarSettings: { enable: false },
                resizing: (args) => {
                    expect(args.requestType.toLocaleLowerCase() === 'table');
                    args.cancel = true;
                }
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('args cancel event', () => {
            expect(rteObj.element.querySelectorAll('.e-rte-content').length).toBe(1);
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[1] as HTMLElement).click();
            let target: HTMLElement = (rteObj as any).tableModule.popupObj.element.querySelector('.e-insert-table-btn');
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("click", false, true);
            target.dispatchEvent(clickEvent);
            target = rteObj.tableModule.editdlgObj.element.querySelector('.e-insert-table') as HTMLElement;
            target.dispatchEvent(clickEvent);
            let table: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('table') as HTMLElement;
            (rteObj.tableModule as any).resizeHelper({ target: table, preventDefault: function () { } });
            let reCol1: any = rteObj.contentModule.getEditPanel().querySelectorAll('.e-column-resize')[0];
            (rteObj.tableModule as any).resizeStart({ target: reCol1, pageX: 100, pageY: 0, preventDefault: function () { } });
            (rteObj.tableModule as any).resizing({ target: reCol1, pageX: 200, pageY: 200, preventDefault: function () { } });
            expect(rteObj.contentModule.getEditPanel().querySelector('.e-column-resize')).toBe(null);
            (rteObj.tableModule as any).destroy();
        });
    });
    describe('mobile resize', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let mobileUA: string = "Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) " +
            "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36";
        let defaultUA: string = navigator.userAgent;
        beforeAll(() => {
            Browser.userAgent = mobileUA;
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Bold', 'CreateTable']
                }
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            Browser.userAgent = defaultUA;
            destroy(rteObj);
        });
        it('mobile UI', () => {
            expect(rteObj.element.querySelectorAll('.e-rte-content').length).toBe(1);
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[1] as HTMLElement).click();
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("click", false, true);
            let target: HTMLElement;
            expect(document.body.querySelector('.e-rte-edit-table.e-dialog')).not.toBe(null);
            expect(rteObj.tableModule.editdlgObj.element.querySelector('#tableColumn')).not.toBe(null);
            expect(rteObj.tableModule.editdlgObj.element.querySelector('#tableRow')).not.toBe(null);
            expect((rteObj.tableModule.editdlgObj.element.querySelector('#tableRow') as any).value === '3').toBe(true);
            expect((rteObj.tableModule.editdlgObj.element.querySelector('#tableColumn') as any).value === '3').toBe(true);
            target = rteObj.tableModule.editdlgObj.element.querySelector('.e-insert-table') as HTMLElement;
            target.dispatchEvent(clickEvent);
            let tar: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('table') as HTMLElement;
            expect(tar.querySelectorAll('tr').length === 3).toBe(true);
            expect(tar.querySelectorAll('td').length === 9).toBe(true);
            clickEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            tar.dispatchEvent(clickEvent);
            (rteObj.tableModule as any).resizeStart(clickEvent);
            let reCol1: any = rteObj.contentModule.getEditPanel().querySelectorAll('.e-column-resize')[0];
            (rteObj.tableModule as any).resizeStart({ target: reCol1, preventDefault: function () { }, stopImmediatePropagation: function () { } });
            (rteObj.tableModule as any).resizing({ target: reCol1, touches: [{ pageX: 300 }] });
            expect((rteObj.tableModule as any).pageX).toBe(300);
            (rteObj.tableModule as any).docClick({ args: { target: rteObj.contentModule.getEditPanel() } });
            expect(rteObj.contentModule.getEditPanel().querySelector('.e-column-resize')).toBe(null);
        });
        describe('IE browser table ', () => {
            let rteEle: HTMLElement;
            let rteObj: RichTextEditor;
            let defaultUA: string = navigator.userAgent;
            beforeAll(() => {
                Browser.userAgent = 'Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; Touch; .NET4.0C; .NET4.0E; .NET CLR 2.0.50727; .NET CLR 3.0.30729; .NET CLR 3.5.30729; Tablet PC 2.0; rv:11.0) like Gecko';
                rteObj = renderRTE({
                    height: 400,
                    toolbarSettings: {
                        items: ['Bold', 'CreateTable']
                    }
                });
                rteEle = rteObj.element;
            });
            afterAll(() => {
                Browser.userAgent = defaultUA;
                destroy(rteObj);
            });
            it('table insert', () => {
                expect(rteObj.element.querySelectorAll('.e-rte-content').length).toBe(1);
                (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[1] as HTMLElement).click();
                let target: HTMLElement = (rteObj as any).tableModule.popupObj.element.querySelector('.e-insert-table-btn');
                let clickEvent: any = document.createEvent("MouseEvents");
                clickEvent.initEvent("click", false, true);
                target.dispatchEvent(clickEvent);
                expect(document.body.querySelector('.e-rte-edit-table.e-dialog')).not.toBe(null);
                expect(rteObj.tableModule.editdlgObj.element.querySelector('#tableColumn')).not.toBe(null);
                expect(rteObj.tableModule.editdlgObj.element.querySelector('#tableRow')).not.toBe(null);
                expect((rteObj.tableModule.editdlgObj.element.querySelector('#tableRow') as any).value === '3').toBe(true);
                expect((rteObj.tableModule.editdlgObj.element.querySelector('#tableColumn') as any).value === '3').toBe(true);
                target = rteObj.tableModule.editdlgObj.element.querySelector('.e-insert-table') as HTMLElement;
                target.dispatchEvent(clickEvent);
                let table: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('table') as HTMLElement;
                expect(table.querySelectorAll('tr').length === 3).toBe(true);
                expect(table.querySelectorAll('td').length === 9).toBe(true);
                (InsertHtml as any).closestEle(table.querySelectorAll('td')[0], rteObj.contentModule.getEditPanel() as HTMLElement);
            });
        });
    });

    describe("table Inline Quick toolbar - showPopup method with popup open testing", () => {
        let rteEle: HTMLElement;
        let rteObj: any;
        let trg: HTMLElement;
        let args: any;
        let originalTimeout: number;

        beforeEach((done: Function) => {
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 7600;
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Bold', 'CreateTable']
                },
                inlineMode: {
                    enable: true,
                    onSelection: false
                },
                value: "<div>Syncfusion</div>"
            });
            rteEle = rteObj.element;
            trg = <HTMLElement>rteEle.querySelectorAll(".e-content")[0];
            let clickEvent: MouseEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", true, true);
            trg.dispatchEvent(clickEvent);
            done();
        });

        afterEach(() => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            destroy(rteObj);
        });

        it('show inline toolbar', (done: Function) => {
            args = {
                preventDefault: function () { },
                action: 'moveRight',
                target: trg,
                x: 10, y: 200
            };
            rteObj.quickToolbarModule.keyUpHandler({ args: args });
            setTimeout(() => {
                let pop: HTMLElement = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                expect(pop).not.toBe(undefined);
                (<HTMLElement>pop.querySelectorAll('.e-toolbar-item button')[1]).click();
                let events: any = document.createEvent("MouseEvents");
                events.initEvent("click", false, true);
                let target: HTMLElement;
                expect(document.body.querySelector('.e-rte-edit-table.e-dialog')).not.toBe(null);
                expect(rteObj.tableModule.editdlgObj.element.querySelector('#tableColumn')).not.toBe(null);
                expect(rteObj.tableModule.editdlgObj.element.querySelector('#tableRow')).not.toBe(null);
                expect((rteObj.tableModule.editdlgObj.element.querySelector('#tableRow') as any).value === '3').toBe(true);
                expect((rteObj.tableModule.editdlgObj.element.querySelector('#tableColumn') as any).value === '3').toBe(true);
                target = rteObj.tableModule.editdlgObj.element.querySelector('.e-insert-table') as HTMLElement;
                target.dispatchEvent(events);
                let tar: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('table') as HTMLElement;
                expect(tar.querySelectorAll('tr').length === 3).toBe(true);
                expect(tar.querySelectorAll('td').length === 9).toBe(true);
                let clickEvent = document.createEvent("MouseEvents");
                clickEvent.initEvent('mousedown', false, true);
                (rteObj as any).inputElement.dispatchEvent(clickEvent);
                let eventsArg: any = { pageX: 50, pageY: 300, target: tar };
                (<any>rteObj).tableModule.editAreaClickHandler({ args: eventsArg });
                done();
            }, 2000);
        });
    });

    describe('table header', () => {
        let rteEle: HTMLElement;
        let rteObj: RichTextEditor;
        let keyboardEventArgs = {
            preventDefault: function () { },
            keyCode: 9,
            shiftKey: false
        };
        beforeAll(() => {
            rteObj = renderRTE({
                height: 400,
                toolbarSettings: {
                    items: ['Bold', 'CreateTable']
                },
                quickToolbarSettings: {
                    table: ['TableHeader', 'TableRows', 'TableColumns', 'BackgroundColor', '-', 'TableRemove', 'Alignments', 'TableCellVerticalAlign', 'Styles', 'TableEditProperties']
                }
            });
            rteEle = rteObj.element;
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it('check table heeader', (done: Function) => {
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            expect(rteObj.element.querySelectorAll('.e-rte-content').length).toBe(1);
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[1] as HTMLElement).click();
            let event: any = {
                target: (rteObj as any).tableModule.popupObj.element.querySelectorAll('.e-rte-table-row')[1].querySelectorAll('.e-rte-tablecell')[3],
                preventDefault: function () { }
            };
            (rteObj as any).tableModule.tableCellSelect(event);
            (rteObj as any).tableModule.tableCellLeave(event);
            let clickEvent: any = document.createEvent("MouseEvents");

            clickEvent.initEvent("mouseup", false, true);
            event.target.dispatchEvent(clickEvent);
            let tar: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('table') as HTMLElement;
            expect(tar).not.toBe(null);
            expect(tar.querySelectorAll('tr').length === 2).toBe(true);
            expect(tar.querySelectorAll('td').length === 8).toBe(true);
            clickEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent('mousedown', false, true);
            (rteObj as any).inputElement.dispatchEvent(clickEvent);
            let eventsArg: any = { pageX: 50, pageY: 300, target: tar };
            (<any>rteObj).tableModule.editAreaClickHandler({ args: eventsArg });
            setTimeout(() => {
                let tablePop: any = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                expect(tablePop.classList.contains('e-rte-quick-popup')).toBe(true);
                let tableTBItems: any = tablePop.querySelectorAll('.e-toolbar-item');
                expect(tableTBItems.length === 10).toBe(true);
                expect(tablePop.querySelectorAll('.e-rte-toolbar').length).toBe(1);
                (<HTMLElement>tableTBItems.item(0)).click();
                let table: any = rteObj.contentModule.getEditPanel().querySelector('table');
                expect(table.querySelectorAll('thead').length > 0).toBe(true);
                expect(table.querySelectorAll('thead tr').length === 1).toBe(true);
                expect(table.querySelectorAll('tr').length === 3).toBe(true);
                expect(table.querySelectorAll('th').length === 4).toBe(true);
                let selObj: NodeSelection = new NodeSelection();
                selObj.setSelectionText(rteObj.contentModule.getDocument(), table.querySelectorAll('th')[3], table.querySelectorAll('th')[3], 0, 0);
                keyboardEventArgs.keyCode = 40;
                (<any>rteObj).tableModule.keyDown({ args: keyboardEventArgs });
                expect(table.querySelectorAll('td')[3] === selObj.getRange(rteObj.contentModule.getDocument()).startContainer).toBe(true);
                keyboardEventArgs.keyCode = 38;
                (<any>rteObj).tableModule.keyDown({ args: keyboardEventArgs });
                expect(table.querySelectorAll('th')[3] === selObj.getRange(rteObj.contentModule.getDocument()).startContainer).toBe(true);
                keyboardEventArgs.keyCode = 9;
                (<any>rteObj).tableModule.keyDown({ args: keyboardEventArgs });
                expect(table.querySelectorAll('td')[0] === selObj.getRange(rteObj.contentModule.getDocument()).startContainer).toBe(true);
                keyboardEventArgs.keyCode = 9;
                keyboardEventArgs.shiftKey = true;
                (<any>rteObj).tableModule.keyDown({ args: keyboardEventArgs });
                expect(table.querySelectorAll('th')[3] === selObj.getRange(rteObj.contentModule.getDocument()).startContainer).toBe(true);
                done();
            }, 500);
        });
    });

    describe("TABLE with parent based selection", () => {

        describe("Apply to empty table td", () => {
            let rteObj: RichTextEditor;
            let rteEle: HTMLElement;
            let controlId: string;
            beforeEach(() => {
                rteObj = renderRTE({
                    toolbarSettings: {
                        items: ['Bold', 'CreateTable', '|', 'Formats', 'Alignments', 'OrderedList',
                            'UnorderedList', 'Outdent', 'Indent']
                    },
                    value: `<ol><li><p>Support
                to insert image from a defined path.</p></li></ol><div>
                <table class="e-rte-table" style="width: 100%;"><tbody><tr>
                <td class="" style="width: 50%;"><br></td><td style="width: 50%;"><br>
                </td></tr><tr><td style="width: 50%;"><br></td><td style="width: 50%;"><br>
                </td></tr></tbody></table><br></div><ol><li><p>Footer
                elements and styles(tag / Element information , Action button (Upload, Cancel))</p></li></ol>`
                });
                rteEle = rteObj.element;
                controlId = rteEle.id;
            });

            afterEach(() => {
                destroy(rteObj);
            });
            it(' header format', (done) => {
                let nodeSelection: NodeSelection = new NodeSelection();
                let node: HTMLElement = rteObj.element.querySelector("td");
                nodeSelection.setSelectionText(document, node.childNodes[0], node.childNodes[0], 0, 0);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Formats') as HTMLElement;
                item.click();
                let popup: HTMLElement = document.getElementById(controlId + '_toolbar_Formats-popup');
                item = popup.querySelector('.e-h1') as HTMLElement;
                item.click();
                expect(node.firstChild.nodeName === 'H1').toBe(true);
                done();
            });

            it(' OrderedList format', (done) => {
                let nodeSelection: NodeSelection = new NodeSelection();
                let node: HTMLElement = rteObj.element.querySelector("td");
                nodeSelection.setSelectionText(document, node.childNodes[0], node.childNodes[0], 0, 0);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_OrderedList') as HTMLElement;
                item.click();
                expect(node.firstChild.nodeName === 'OL').toBe(true);
                done();
            });

            it(' UnorderedList format', (done) => {
                let nodeSelection: NodeSelection = new NodeSelection();
                let node: HTMLElement = rteObj.element.querySelector("td");
                nodeSelection.setSelectionText(document, node.childNodes[0], node.childNodes[0], 0, 0);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_UnorderedList') as HTMLElement;
                item.click();
                expect(node.firstChild.nodeName === 'UL').toBe(true);
                done();
            });

            it('  Alignments format ', (done) => {
                let nodeSelection: NodeSelection = new NodeSelection();
                let node: HTMLElement = rteObj.element.querySelector("td");
                nodeSelection.setSelectionText(document, node.childNodes[0], node.childNodes[0], 0, 0);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Alignments') as HTMLElement;
                item.click();
                let popup: HTMLElement = document.getElementById(controlId + '_toolbar_Alignments-popup');
                item = popup.querySelectorAll('.e-item')[1] as HTMLElement;
                item.click();
                expect(node.firstChild.nodeName === 'P').toBe(true);
                expect((node.firstChild as HTMLElement).style.textAlign === 'center').toBe(true);
                done();
            });

            it('  Indent format', (done) => {
                let nodeSelection: NodeSelection = new NodeSelection();
                let node: HTMLElement = rteObj.element.querySelector("td");
                nodeSelection.setSelectionText(document, node.childNodes[0], node.childNodes[0], 0, 0);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Indent') as HTMLElement;
                item.click();
                expect(node.firstChild.nodeName === 'P').toBe(true);
                expect((node.firstChild as HTMLElement).style.marginLeft === '20px').toBe(true);
                done();
            });
        });

        describe(" Apply to single line within a TD", () => {
            let rteObj: RichTextEditor;
            let rteEle: HTMLElement;
            let controlId: string;
            beforeEach(() => {
                rteObj = renderRTE({
                    toolbarSettings: {
                        items: ['Bold', 'CreateTable', '|', 'Formats', 'Alignments', 'OrderedList',
                            'UnorderedList', 'Outdent', 'Indent']
                    },
                    value: `<ol><li><p>Support
                    to insert image from a defined path.</p></li></ol><div><table class="e-rte-table" style="width: 100%;"><tbody><tr><td class="" style="width: 50%;">RichTextEditor</td>
                    <td style="width: 50%;"><br></td></tr><tr><td style="width: 50%;"><br></td>
                    <td style="width: 50%;"><br></td></tr></tbody></table><br></div><ol><li><p>Footer
                    elements and styles(tag / Element information , Action button (Upload, Cancel))</p></li></ol>`
                });
                rteEle = rteObj.element;
                controlId = rteEle.id;
            });

            afterEach(() => {
                destroy(rteObj);
            });
            it(' header format', (done) => {
                let nodeSelection: NodeSelection = new NodeSelection();
                let node: HTMLElement = rteObj.element.querySelector("td");
                nodeSelection.setSelectionText(document, node.childNodes[0], node.childNodes[0], 0, 3);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Formats') as HTMLElement;
                item.click();
                let popup: HTMLElement = document.getElementById(controlId + '_toolbar_Formats-popup');
                item = popup.querySelector('.e-h1') as HTMLElement;
                item.click();
                expect(node.firstChild.nodeName === 'H1').toBe(true);
                done();
            });

            it(' OrderedList format', (done) => {
                let nodeSelection: NodeSelection = new NodeSelection();
                let node: HTMLElement = rteObj.element.querySelector("td");
                nodeSelection.setSelectionText(document, node.childNodes[0], node.childNodes[0], 0, 3);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_OrderedList') as HTMLElement;
                item.click();
                expect(node.firstChild.nodeName === 'OL').toBe(true);
                done();
            });

            it(' UnorderedList format', (done) => {
                let nodeSelection: NodeSelection = new NodeSelection();
                let node: HTMLElement = rteObj.element.querySelector("td");
                nodeSelection.setSelectionText(document, node.childNodes[0], node.childNodes[0], 0, 3);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_UnorderedList') as HTMLElement;
                item.click();
                expect(node.firstChild.nodeName === 'UL').toBe(true);
                done();
            });

            it('  Alignments format ', (done) => {
                let nodeSelection: NodeSelection = new NodeSelection();
                let node: HTMLElement = rteObj.element.querySelector("td");
                nodeSelection.setSelectionText(document, node.childNodes[0], node.childNodes[0], 0, 3);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Alignments') as HTMLElement;
                item.click();
                let popup: HTMLElement = document.getElementById(controlId + '_toolbar_Alignments-popup');
                item = popup.querySelectorAll('.e-item')[1] as HTMLElement;
                item.click();
                expect(node.firstChild.nodeName === 'P').toBe(true);
                expect((node.firstChild as HTMLElement).style.textAlign === 'center').toBe(true);
                done();
            });

            it('  Indent format', (done) => {
                let nodeSelection: NodeSelection = new NodeSelection();
                let node: HTMLElement = rteObj.element.querySelector("td");
                nodeSelection.setSelectionText(document, node.childNodes[0], node.childNodes[0], 0, 3);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Indent') as HTMLElement;
                item.click();
                expect(node.firstChild.nodeName === 'P').toBe(true);
                expect((node.firstChild as HTMLElement).style.marginLeft === '20px').toBe(true);
                done();
            });
        });

        describe(" Apply to selected two lines within a TD", () => {
            let rteObj: RichTextEditor;
            let rteEle: HTMLElement;
            let controlId: string;
            beforeEach(() => {
                rteObj = renderRTE({
                    toolbarSettings: {
                        items: ['Bold', 'CreateTable', '|', 'Formats', 'Alignments', 'OrderedList',
                            'UnorderedList', 'Outdent', 'Indent']
                    },
                    value: `<ol><li><p>Support
                    to insert image from a defined path.</p></li></ol><div><table class="e-rte-table" style="width: 100%;"><tbody><tr>
                    <td class="" style="width: 50%;">RichTextEditor<br>Syncfusion</td><td style="width: 50%;"><br></td></tr><tr><td style="width: 50%;"><br>
                    </td><td style="width: 50%;"><br></td></tr></tbody></table><br></div><ol><li><p>Footer
                    elements and styles(tag / Element information , Action button (Upload, Cancel))</p></li></ol>`
                });
                rteEle = rteObj.element;
                controlId = rteEle.id;
            });

            afterEach(() => {
                destroy(rteObj);
            });
            it(' header format', (done) => {
                let nodeSelection: NodeSelection = new NodeSelection();
                let node: HTMLElement = rteObj.element.querySelector("td");
                nodeSelection.setSelectionText(document, node.childNodes[0], node.childNodes[2], 0, 3);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Formats') as HTMLElement;
                item.click();
                let popup: HTMLElement = document.getElementById(controlId + '_toolbar_Formats-popup');
                item = popup.querySelector('.e-h1') as HTMLElement;
                item.click();
                let applied: any = node.querySelectorAll('h1');
                expect(applied.length === 2).toBe(true);
                done();
            });

            it(' OrderedList format', (done) => {
                let nodeSelection: NodeSelection = new NodeSelection();
                let node: HTMLElement = rteObj.element.querySelector("td");
                nodeSelection.setSelectionText(document, node.childNodes[0], node.childNodes[2], 0, 3);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_OrderedList') as HTMLElement;
                item.click();
                let applied: any = node.querySelectorAll('li');
                expect(applied.length === 2).toBe(true);
                done();
            });

            it(' UnorderedList format', (done) => {
                let nodeSelection: NodeSelection = new NodeSelection();
                let node: HTMLElement = rteObj.element.querySelector("td");
                nodeSelection.setSelectionText(document, node.childNodes[0], node.childNodes[2], 0, 3);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_UnorderedList') as HTMLElement;
                item.click();
                let applied: any = node.querySelectorAll('li');
                expect(applied.length === 2).toBe(true);
                done();
            });

            it('  Alignments format ', (done) => {
                let nodeSelection: NodeSelection = new NodeSelection();
                let node: HTMLElement = rteObj.element.querySelector("td");
                nodeSelection.setSelectionText(document, node.childNodes[0], node.childNodes[2], 0, 3);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Alignments') as HTMLElement;
                item.click();
                let popup: HTMLElement = document.getElementById(controlId + '_toolbar_Alignments-popup');
                item = popup.querySelectorAll('.e-item')[1] as HTMLElement;
                item.click();
                let applied: any = node.querySelectorAll('p');
                expect(applied.length === 2).toBe(true);
                expect((applied[0] as HTMLElement).style.textAlign === 'center').toBe(true);
                expect((applied[1] as HTMLElement).style.textAlign === 'center').toBe(true);
                done();
            });

            it('  Indent format', (done) => {
                let nodeSelection: NodeSelection = new NodeSelection();
                let node: HTMLElement = rteObj.element.querySelector("td");
                nodeSelection.setSelectionText(document, node.childNodes[0], node.childNodes[2], 0, 3);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Indent') as HTMLElement;
                item.click();
                let applied: any = node.querySelectorAll('p');
                expect(applied.length === 2).toBe(true);
                expect((applied[0] as HTMLElement).style.marginLeft === '20px').toBe(true);
                expect((applied[1] as HTMLElement).style.marginLeft === '20px').toBe(true);
                done();
            });
        });

        describe(" Apply to selected three lines within a TD", () => {
            let rteObj: RichTextEditor;
            let rteEle: HTMLElement;
            let controlId: string;
            beforeEach(() => {
                rteObj = renderRTE({
                    toolbarSettings: {
                        items: ['Bold', 'CreateTable', '|', 'Formats', 'Alignments', 'OrderedList',
                            'UnorderedList', 'Outdent', 'Indent']
                    },
                    value: `<ol><li><p>Support
                    to insert image from a defined path.</p></li></ol><div><table class="e-rte-table" style="width: 100%;"><tbody><tr>
                    <td class="" style="width: 50%;">RichTextEditor<br>Syncfusion<br>ej2-richtexteditor</td>
                    <td style="width: 50%;"><br></td></tr><tr><td style="width: 50%;"><br></td>
                    <td style="width: 50%;"><br></td></tr></tbody></table><br></div><ol><li><p>Footer
                    elements and styles(tag / Element information , Action button (Upload, Cancel))</p></li></ol>`
                });
                rteEle = rteObj.element;
                controlId = rteEle.id;
            });

            afterEach(() => {
                destroy(rteObj);
            });
            it(' header format', (done) => {
                let nodeSelection: NodeSelection = new NodeSelection();
                let node: HTMLElement = rteObj.element.querySelector("td");
                nodeSelection.setSelectionText(document, node.childNodes[0], node.childNodes[4], 0, 3);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Formats') as HTMLElement;
                item.click();
                let popup: HTMLElement = document.getElementById(controlId + '_toolbar_Formats-popup');
                item = popup.querySelector('.e-h1') as HTMLElement;
                item.click();
                let applied: any = node.querySelectorAll('h1');
                expect(applied.length === 3).toBe(true);
                done();
            });

            it(' OrderedList format', (done) => {
                let nodeSelection: NodeSelection = new NodeSelection();
                let node: HTMLElement = rteObj.element.querySelector("td");
                nodeSelection.setSelectionText(document, node.childNodes[0], node.childNodes[4], 0, 3);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_OrderedList') as HTMLElement;
                item.click();
                let applied: any = node.querySelectorAll('li');
                expect(applied.length === 3).toBe(true);
                done();
            });

            it(' UnorderedList format', (done) => {
                let nodeSelection: NodeSelection = new NodeSelection();
                let node: HTMLElement = rteObj.element.querySelector("td");
                nodeSelection.setSelectionText(document, node.childNodes[0], node.childNodes[4], 0, 3);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_UnorderedList') as HTMLElement;
                item.click();
                let applied: any = node.querySelectorAll('li');
                expect(applied.length === 3).toBe(true);
                done();
            });

            it('  Alignments format ', (done) => {
                let nodeSelection: NodeSelection = new NodeSelection();
                let node: HTMLElement = rteObj.element.querySelector("td");
                nodeSelection.setSelectionText(document, node.childNodes[0], node.childNodes[4], 0, 3);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Alignments') as HTMLElement;
                item.click();
                let popup: HTMLElement = document.getElementById(controlId + '_toolbar_Alignments-popup');
                item = popup.querySelectorAll('.e-item')[1] as HTMLElement;
                item.click();
                let applied: any = node.querySelectorAll('p');
                expect(applied.length === 3).toBe(true);
                expect((applied[0] as HTMLElement).style.textAlign === 'center').toBe(true);
                expect((applied[1] as HTMLElement).style.textAlign === 'center').toBe(true);
                expect((applied[2] as HTMLElement).style.textAlign === 'center').toBe(true);
                done();
            });

            it('  Indent format', (done) => {
                let nodeSelection: NodeSelection = new NodeSelection();
                let node: HTMLElement = rteObj.element.querySelector("td");
                nodeSelection.setSelectionText(document, node.childNodes[0], node.childNodes[4], 0, 3);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Indent') as HTMLElement;
                item.click();
                let applied: any = node.querySelectorAll('p');
                expect(applied.length === 3).toBe(true);
                expect((applied[0] as HTMLElement).style.marginLeft === '20px').toBe(true);
                expect((applied[1] as HTMLElement).style.marginLeft === '20px').toBe(true);
                expect((applied[2] as HTMLElement).style.marginLeft === '20px').toBe(true);
                done();
            });
        });

        describe(" Apply to all table cells", () => {
            let rteObj: RichTextEditor;
            let rteEle: HTMLElement;
            let controlId: string;
            beforeEach(() => {
                rteObj = renderRTE({
                    toolbarSettings: {
                        items: ['Bold', 'CreateTable', '|', 'Formats', 'Alignments', 'OrderedList',
                            'UnorderedList', 'Outdent', 'Indent']
                    },
                    value: `<ol><li><p>Support
                    to insert image from a defined path.</p></li></ol><div><table class="e-rte-table" style="width: 100%;">
                    <tbody><tr><td style="width: 50%;"><br></td>
                    <td style="width: 50%;"><br></td></tr></tbody></table><br></div><ol><li><p>Footer
                    elements and styles(tag / Element information , Action button (Upload, Cancel))</p></li></ol>`
                });
                rteEle = rteObj.element;
                controlId = rteEle.id;
            });

            afterEach(() => {
                destroy(rteObj);
            });
            it(' header format', (done) => {
                let nodeSelection: NodeSelection = new NodeSelection();
                let node: Element = rteObj.element.querySelector("table");
                let tdElements: any = rteObj.element.querySelectorAll("table td");
                let startNode: HTMLElement = tdElements[0];
                let endNode: HTMLElement = tdElements[tdElements.length - 1];
                nodeSelection.setSelectionText(document, startNode.childNodes[0], endNode.childNodes[0], 0, 0);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Formats') as HTMLElement;
                item.click();
                let popup: HTMLElement = document.getElementById(controlId + '_toolbar_Formats-popup');
                item = popup.querySelector('.e-h1') as HTMLElement;
                item.click();
                let applied: any = node.querySelectorAll('h1');
                expect(applied.length === 2).toBe(true);
                done();
            });

            it(' OrderedList format', (done) => {
                let nodeSelection: NodeSelection = new NodeSelection();
                let node: Element = rteObj.element.querySelector("table");
                let tdElements: any = rteObj.element.querySelectorAll("table td");
                let startNode: HTMLElement = tdElements[0];
                let endNode: HTMLElement = tdElements[tdElements.length - 1];
                nodeSelection.setSelectionText(document, startNode.childNodes[0], endNode.childNodes[0], 0, 0);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_OrderedList') as HTMLElement;
                item.click();
                let applied: any = node.querySelectorAll('li');
                expect(applied.length === 2).toBe(true);
                done();
            });

            it(' UnorderedList format', (done) => {
                let nodeSelection: NodeSelection = new NodeSelection();
                let node: Element = rteObj.element.querySelector("table");
                let tdElements: any = rteObj.element.querySelectorAll("table td");
                let startNode: HTMLElement = tdElements[0];
                let endNode: HTMLElement = tdElements[tdElements.length - 1];
                nodeSelection.setSelectionText(document, startNode.childNodes[0], endNode.childNodes[0], 0, 0);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_UnorderedList') as HTMLElement;
                item.click();
                let applied: any = node.querySelectorAll('li');
                expect(applied.length === 2).toBe(true);
                done();
            });

            it('  Alignments format ', (done) => {
                let nodeSelection: NodeSelection = new NodeSelection();
                let node: Element = rteObj.element.querySelector("table");
                let tdElements: any = rteObj.element.querySelectorAll("table td");
                let startNode: HTMLElement = tdElements[0];
                let endNode: HTMLElement = tdElements[tdElements.length - 1];
                nodeSelection.setSelectionText(document, startNode.childNodes[0], endNode.childNodes[0], 0, 0);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Alignments') as HTMLElement;
                item.click();
                let popup: HTMLElement = document.getElementById(controlId + '_toolbar_Alignments-popup');
                item = popup.querySelectorAll('.e-item')[1] as HTMLElement;
                item.click();
                let applied: any = node.querySelectorAll('p');
                expect(applied.length === 2).toBe(true);
                expect((applied[0] as HTMLElement).style.textAlign === 'center').toBe(true);
                expect((applied[1] as HTMLElement).style.textAlign === 'center').toBe(true);
                done();
            });

            it('  Indent format', (done) => {
                let nodeSelection: NodeSelection = new NodeSelection();
                let node: Element = rteObj.element.querySelector("table");
                let tdElements: any = rteObj.element.querySelectorAll("table td");
                let startNode: HTMLElement = tdElements[0];
                let endNode: HTMLElement = tdElements[tdElements.length - 1];
                nodeSelection.setSelectionText(document, startNode.childNodes[0], endNode.childNodes[0], 0, 0);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Indent') as HTMLElement;
                item.click();
                let applied: any = node.querySelectorAll('p');
                expect(applied.length === 2).toBe(true);
                expect((applied[0] as HTMLElement).style.marginLeft === '20px').toBe(true);
                expect((applied[1] as HTMLElement).style.marginLeft === '20px').toBe(true);
                done();
            });
        });

        describe(" Apply to selection of table  in between of paragraph", () => {
            let rteObj: RichTextEditor;
            let rteEle: HTMLElement;
            let controlId: string;
            let editNode: HTMLElement;
            beforeEach(() => {
                rteObj = renderRTE({
                    toolbarSettings: {
                        items: ['Bold', 'CreateTable', '|', 'Formats', 'Alignments', 'OrderedList',
                            'UnorderedList', 'Outdent', 'Indent']
                    },
                    value: `<p>Support to insert image from a defined path.</p><div>
                    <table class="e-rte-table" style="width: 100%;"><tbody><tr><td style="width: 50%;"><br>
                    </td><td style="width: 50%;"><br></td></tr></tbody></table><br></div><p>Footer elements and styles(tag / Element information , Action button (Upload, Cancel))</p>`
                });
                rteEle = rteObj.element;
                controlId = rteEle.id;
                editNode = (rteObj as any).inputElement;
            });

            afterEach(() => {
                destroy(rteObj);
            });
            it(' header format', (done) => {
                let nodeSelection: NodeSelection = new NodeSelection();
                let firstNode: HTMLElement = rteObj.element.querySelectorAll("p")[0];
                let endNode: HTMLElement = rteObj.element.querySelectorAll("p")[1];
                nodeSelection.setSelectionText(document, firstNode.childNodes[0], endNode.childNodes[0], 3, 4);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Formats') as HTMLElement;
                item.click();
                let popup: HTMLElement = document.getElementById(controlId + '_toolbar_Formats-popup');
                item = popup.querySelector('.e-h1') as HTMLElement;
                item.click();
                let applied: any = editNode.querySelectorAll('h1');
                expect(applied.length === 4).toBe(true);
                done();
            });

            it(' OrderedList format', (done) => {
                let nodeSelection: NodeSelection = new NodeSelection();
                let firstNode: HTMLElement = rteObj.element.querySelectorAll("p")[0];
                let endNode: HTMLElement = rteObj.element.querySelectorAll("p")[1];
                nodeSelection.setSelectionText(document, firstNode.childNodes[0], endNode.childNodes[0], 3, 4);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_OrderedList') as HTMLElement;
                item.click();
                let applied: any = editNode.querySelectorAll('li');
                expect(applied.length === 4).toBe(true);
                done();
            });

            it(' UnorderedList format', (done) => {
                let nodeSelection: NodeSelection = new NodeSelection();
                let firstNode: HTMLElement = rteObj.element.querySelectorAll("p")[0];
                let endNode: HTMLElement = rteObj.element.querySelectorAll("p")[1];
                nodeSelection.setSelectionText(document, firstNode.childNodes[0], endNode.childNodes[0], 3, 4);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_UnorderedList') as HTMLElement;
                item.click();
                let applied: any = editNode.querySelectorAll('li');
                expect(applied.length === 4).toBe(true);
                done();
            });

            it('  Alignments format ', (done) => {
                let nodeSelection: NodeSelection = new NodeSelection();
                let firstNode: HTMLElement = rteObj.element.querySelectorAll("p")[0];
                let endNode: HTMLElement = rteObj.element.querySelectorAll("p")[1];
                nodeSelection.setSelectionText(document, firstNode.childNodes[0], endNode.childNodes[0], 3, 4);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Alignments') as HTMLElement;
                item.click();
                let popup: HTMLElement = document.getElementById(controlId + '_toolbar_Alignments-popup');
                item = popup.querySelectorAll('.e-item')[1] as HTMLElement;
                item.click();
                let applied: any = editNode.querySelectorAll('p');
                expect(applied.length === 4).toBe(true);
                expect((applied[0] as HTMLElement).style.textAlign === 'center').toBe(true);
                expect((applied[1] as HTMLElement).style.textAlign === 'center').toBe(true);
                expect((applied[2] as HTMLElement).style.textAlign === 'center').toBe(true);
                expect((applied[3] as HTMLElement).style.textAlign === 'center').toBe(true);
                done();
            });

            it('  Indent format', (done) => {
                let nodeSelection: NodeSelection = new NodeSelection();
                let firstNode: HTMLElement = rteObj.element.querySelectorAll("p")[0];
                let endNode: HTMLElement = rteObj.element.querySelectorAll("p")[1];
                nodeSelection.setSelectionText(document, firstNode.childNodes[0], endNode.childNodes[0], 3, 4);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Indent') as HTMLElement;
                item.click();
                let applied: any = editNode.querySelectorAll('p');
                expect(applied.length === 4).toBe(true);
                expect((applied[0] as HTMLElement).style.marginLeft === '20px').toBe(true);
                expect((applied[1] as HTMLElement).style.marginLeft === '20px').toBe(true);
                expect((applied[2] as HTMLElement).style.marginLeft === '20px').toBe(true);
                expect((applied[3] as HTMLElement).style.marginLeft === '20px').toBe(true);
                done();
            });
            it('Bold the text and applying table to it', (done) => {
                rteObj.value = '<p>Bold the richtexteditor text and applying table to it testing</p>'
                rteObj.dataBind();
                let nodeSelection: NodeSelection = new NodeSelection();
                let firstNode: HTMLElement = rteObj.element.querySelectorAll("p")[0];
                nodeSelection.setSelectionText(document, firstNode.childNodes[0], firstNode.childNodes[0], 13, 17);
                (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
                expect(firstNode.firstElementChild.tagName.toLowerCase() === 'strong');
                expect(firstNode.firstElementChild.textContent === 'text');
                (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[1] as HTMLElement).click();
                (<HTMLElement>rteEle.querySelector(".e-insert-table-btn") as HTMLElement).click();
                (<HTMLElement>rteEle.querySelectorAll(".e-insert-table")[0] as HTMLElement).click();
                let firstSplittedNode: HTMLElement = rteObj.element.querySelectorAll("p")[0];
                let tableNode: HTMLElement = rteObj.element.querySelectorAll("table")[0];
                let lastSplittedNode: HTMLElement = rteObj.element.querySelectorAll("p")[1]
                expect(firstSplittedNode.querySelectorAll('strong').length === 0).toBe(true);
                expect(lastSplittedNode.querySelectorAll('strong').length === 0).toBe(true);
                expect(tableNode).not.toBe(null);
                done();
            });
        });

        describe(" Apply to text line with empty line", () => {
            let rteObj: RichTextEditor;
            let rteEle: HTMLElement;
            let controlId: string;
            beforeEach(() => {
                rteObj = renderRTE({
                    toolbarSettings: {
                        items: ['Bold', 'CreateTable', '|', 'Formats', 'Alignments', 'OrderedList',
                            'UnorderedList', 'Outdent', 'Indent']
                    },
                    value: `<p>Support to insert image from a defined path.</p><div>
                    <table class="e-rte-table" style="width: 100%;">
                    <tbody><tr><td style="width: 50%;">Syncfusion<br><br><br></td><td style="width: 50%;"><br></td>
                    </tr></tbody></table><br></div>
                    <p>Footer elements and styles(tag / Element information , Action button (Upload, Cancel))</p>`
                });
                rteEle = rteObj.element;
                controlId = rteEle.id;
            });

            afterEach(() => {
                destroy(rteObj);
            });
            it(' header format', (done) => {
                let nodeSelection: NodeSelection = new NodeSelection();
                let node: HTMLElement = rteObj.element.querySelector("td");
                nodeSelection.setSelectionText(document, node.childNodes[0], node.childNodes[3], 0, 0);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Formats') as HTMLElement;
                item.click();
                let popup: HTMLElement = document.getElementById(controlId + '_toolbar_Formats-popup');
                item = popup.querySelector('.e-h1') as HTMLElement;
                item.click();
                let applied: any = node.querySelectorAll('h1');
                expect(applied.length === 3).toBe(true);
                done();
            });

            it(' OrderedList format', (done) => {
                let nodeSelection: NodeSelection = new NodeSelection();
                let node: HTMLElement = rteObj.element.querySelector("td");
                nodeSelection.setSelectionText(document, node.childNodes[0], node.childNodes[3], 0, 0);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_OrderedList') as HTMLElement;
                item.click();
                let applied: any = node.querySelectorAll('li');
                expect(applied.length === 3).toBe(true);
                done();
            });

            it(' UnorderedList format', (done) => {
                let nodeSelection: NodeSelection = new NodeSelection();
                let node: HTMLElement = rteObj.element.querySelector("td");
                nodeSelection.setSelectionText(document, node.childNodes[0], node.childNodes[3], 0, 0);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_UnorderedList') as HTMLElement;
                item.click();
                let applied: any = node.querySelectorAll('li');
                expect(applied.length === 3).toBe(true);
                done();
            });

            it('  Alignments format ', (done) => {
                let nodeSelection: NodeSelection = new NodeSelection();
                let node: HTMLElement = rteObj.element.querySelector("td");
                nodeSelection.setSelectionText(document, node.childNodes[0], node.childNodes[3], 0, 0);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Alignments') as HTMLElement;
                item.click();
                let popup: HTMLElement = document.getElementById(controlId + '_toolbar_Alignments-popup');
                item = popup.querySelectorAll('.e-item')[1] as HTMLElement;
                item.click();
                let applied: any = node.querySelectorAll('p');
                expect(applied.length === 3).toBe(true);
                expect((applied[0] as HTMLElement).style.textAlign === 'center').toBe(true);
                expect((applied[1] as HTMLElement).style.textAlign === 'center').toBe(true);
                expect((applied[2] as HTMLElement).style.textAlign === 'center').toBe(true);
                done();
            });

            it('  Indent format', (done) => {
                let nodeSelection: NodeSelection = new NodeSelection();
                let node: HTMLElement = rteObj.element.querySelector("td");
                nodeSelection.setSelectionText(document, node.childNodes[0], node.childNodes[3], 0, 0);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Indent') as HTMLElement;
                item.click();
                let applied: any = node.querySelectorAll('p');
                expect(applied.length === 3).toBe(true);
                expect((applied[0] as HTMLElement).style.marginLeft === '20px').toBe(true);
                expect((applied[1] as HTMLElement).style.marginLeft === '20px').toBe(true);
                expect((applied[2] as HTMLElement).style.marginLeft === '20px').toBe(true);
                done();
            });
        });

        describe(" Apply to in between text line in TD", () => {
            let rteObj: RichTextEditor;
            let rteEle: HTMLElement;
            let controlId: string;
            beforeEach(() => {
                rteObj = renderRTE({
                    toolbarSettings: {
                        items: ['Bold', 'CreateTable', '|', 'Formats', 'Alignments', 'OrderedList',
                            'UnorderedList', 'Outdent', 'Indent']
                    },
                    value: `<p><b>Description:</b></p><ol><li><p>Support
                    to insert image from a defined path.</p><table class="e-rte-table" style="width: 100%;"><tbody><tr><td class="" style="width: 25%;">Syncfusion<br>RichTextEditor<br>DropDowns</td><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td></tr><tr><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td></tr><tr><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td></tr></tbody></table></li><li><p>Footer
                    elements and styles(tag / Element information , Action button (Upload, Cancel))</p></li></ol>`
                });
                rteEle = rteObj.element;
                controlId = rteEle.id;
            });

            afterEach(() => {
                destroy(rteObj);
            });
            it(' header format', (done) => {
                let nodeSelection: NodeSelection = new NodeSelection();
                let node: HTMLElement = rteObj.element.querySelector("td");
                nodeSelection.setSelectionText(document, node.childNodes[2], node.childNodes[4], 3, 4);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Formats') as HTMLElement;
                item.click();
                let popup: HTMLElement = document.getElementById(controlId + '_toolbar_Formats-popup');
                item = popup.querySelector('.e-h1') as HTMLElement;
                item.click();
                let applied: any = node.querySelectorAll('h1');
                expect(applied.length === 2).toBe(true);
                done();
            });

            it(' OrderedList format', (done) => {
                let nodeSelection: NodeSelection = new NodeSelection();
                let node: HTMLElement = rteObj.element.querySelector("td");
                nodeSelection.setSelectionText(document, node.childNodes[2], node.childNodes[4], 3, 4);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_OrderedList') as HTMLElement;
                item.click();
                let applied: any = node.querySelectorAll('li');
                expect(applied.length === 2).toBe(true);
                done();
            });

            it(' UnorderedList format', (done) => {
                let nodeSelection: NodeSelection = new NodeSelection();
                let node: HTMLElement = rteObj.element.querySelector("td");
                nodeSelection.setSelectionText(document, node.childNodes[2], node.childNodes[4], 3, 4);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_UnorderedList') as HTMLElement;
                item.click();
                let applied: any = node.querySelectorAll('li');
                expect(applied.length === 2).toBe(true);
                done();
            });

            it('  Alignments format ', (done) => {
                let nodeSelection: NodeSelection = new NodeSelection();
                let node: HTMLElement = rteObj.element.querySelector("td");
                nodeSelection.setSelectionText(document, node.childNodes[2], node.childNodes[4], 3, 4);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Alignments') as HTMLElement;
                item.click();
                let popup: HTMLElement = document.getElementById(controlId + '_toolbar_Alignments-popup');
                item = popup.querySelectorAll('.e-item')[1] as HTMLElement;
                item.click();
                let applied: any = node.querySelectorAll('p');
                expect(applied.length === 2).toBe(true);
                expect((applied[0] as HTMLElement).style.textAlign === 'center').toBe(true);
                expect((applied[1] as HTMLElement).style.textAlign === 'center').toBe(true);
                done();
            });

            it('  Indent format', (done) => {
                let nodeSelection: NodeSelection = new NodeSelection();
                let node: HTMLElement = rteObj.element.querySelector("td");
                nodeSelection.setSelectionText(document, node.childNodes[2], node.childNodes[4], 3, 4);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Indent') as HTMLElement;
                item.click();
                let applied: any = node.querySelectorAll('p');
                expect(applied.length === 2).toBe(true);
                expect((applied[0] as HTMLElement).style.marginLeft === '20px').toBe(true);
                expect((applied[1] as HTMLElement).style.marginLeft === '20px').toBe(true);
                done();
            });
        });

        describe(" Apply the blockquotes to table parent node.", () => {
            let rteObj: RichTextEditor;
            let rteEle: HTMLElement;
            let controlId: string;
            let editNode: HTMLElement;
            beforeEach(() => {
                rteObj = renderRTE({
                    toolbarSettings: {
                        items: ['Bold', 'CreateTable', '|', 'Formats', 'Alignments', 'OrderedList',
                            'UnorderedList', 'Outdent', 'Indent']
                    },
                    value: `<p>Support to insert image from a defined path.</p><div>
                    <table class="e-rte-table" style="width: 100%;">
                    <tbody><tr><td style="width: 50%;">Syncfusion<br><br><br></td><td style="width: 50%;"><br></td>
                    </tr></tbody></table><br></div>
                    <p>Footer elements and styles(tag / Element information , Action button (Upload, Cancel))</p>`
                });
                rteEle = rteObj.element;
                controlId = rteEle.id;
                editNode = (rteObj as any).inputElement;
            });

            afterEach(() => {
                destroy(rteObj);
            });
            it(' header format', (done) => {
                let nodeSelection: NodeSelection = new NodeSelection();
                let node: HTMLElement = rteObj.element.querySelector("td");
                nodeSelection.setSelectionText(document, node.childNodes[0], node.childNodes[3], 0, 0);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_Formats') as HTMLElement;
                item.click();
                let popup: HTMLElement = document.getElementById(controlId + '_toolbar_Formats-popup');
                item = popup.querySelector('.e-quote') as HTMLElement;
                item.click();
                let applied: any = editNode.querySelector('blockquote');
                // The childnodes was changed because the value now have the space and enter which won't be removed. So the table element was a second childNode
                expect((applied.childNodes[1] as Element).tagName === 'TABLE').toBe(true);
                done();
            });
        });

        describe(" Insert row from table header.", () => {
            let rteObj: RichTextEditor;
            let rteEle: HTMLElement;
            let controlId: string;
            beforeEach(() => {
                rteObj = renderRTE({
                    toolbarSettings: {
                        items: ['Bold', 'CreateTable', '|', 'Formats', 'Alignments', 'OrderedList',
                            'UnorderedList', 'Outdent', 'Indent']
                    },
                    value: `<p><b>Description:</b></p><p>The Rich Text Editor (RTE) control is an easy to render in
                    client side.</p><table class="e-rte-table" style="width: 100%;"><thead><tr><th class="e-cell-select"><br></th><th><br></th></tr></thead><tbody><tr><td style="width: 50%;" class=""><br></td><td style="width: 50%;"><br></td></tr><tr><td style="width: 50%;"><br></td><td style="width: 50%;"><br></td></tr></tbody></table>
                    `
                });
                rteEle = rteObj.element;
                controlId = rteEle.id;
            });

            afterEach(() => {
                destroy(rteObj);
            });
            it(' test the insert row from table header', (done) => {
                let node: HTMLElement = (rteObj as any).inputElement.querySelector("th");
                setCursorPoint(node, 0);
                node.focus();
                let clickEvent: MouseEvent = document.createEvent("MouseEvents");
                clickEvent.initEvent('mousedown', false, true);
                (rteObj as any).inputElement.dispatchEvent(clickEvent);
                let eventsArg: any = { pageX: 50, pageY: 300, target: node };
                (<any>rteObj).tableModule.editAreaClickHandler({ args: eventsArg });
                setTimeout(() => {
                    let tablePop: any = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                    let insertBtn: HTMLElement = tablePop.querySelector("#" + controlId + "_quick_TableRows");
                    insertBtn.click();
                    let dropdown: HTMLElement = document.querySelector('#' + controlId + "_quick_TableRows-popup");
                    (dropdown.querySelectorAll(".e-item")[1] as HTMLElement).click();
                    expect((rteObj as any).inputElement.querySelectorAll("td").length === 6).toBe(true);
                    expect((node.parentNode.parentNode.nextSibling.childNodes[0].childNodes[0] as HTMLElement).tagName === 'TD').toBe(true);
                    done();
                }, 600);
            });
        });

        describe(" Insert row to select the header element.", () => {
            let rteObj: RichTextEditor;
            let rteEle: HTMLElement;
            beforeEach(() => {
                rteObj = renderRTE({
                    toolbarSettings: {
                        items: ['Bold', 'CreateTable', '|', 'Formats', 'Alignments', 'OrderedList',
                            'UnorderedList', 'Outdent', 'Indent']
                    },
                    value: `<h1>The Rich Text Editor (RTE) control is an easy to render in
                    client side.</h1>
                    `
                });
                rteEle = rteObj.element;
            });

            afterEach(() => {
                destroy(rteObj);
            });
            it(' test the insert row after select the h1 element', (done) => {
                let node: HTMLElement = (rteObj as any).inputElement.querySelector("h1");
                expect((rteObj as any).inputElement.querySelectorAll("h1").length === 1).toBe(true);
                let nodeSelection: NodeSelection = new NodeSelection();
                nodeSelection.setSelectionText(document, node.childNodes[0], node.childNodes[0], 3, 8);
                node.focus();
                (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[1] as HTMLElement).click();
                let target: HTMLElement = (rteObj as any).tableModule.popupObj.element.querySelector('.e-insert-table-btn');
                let clickEvent: any = document.createEvent("MouseEvents");
                clickEvent.initEvent("click", false, true);
                target.dispatchEvent(clickEvent);
                target = rteObj.tableModule.editdlgObj.element.querySelector('.e-insert-table') as HTMLElement;
                target.dispatchEvent(clickEvent);
                expect((rteObj as any).inputElement.querySelectorAll("h1").length === 2).toBe(true);
                done();
            });
        });

        describe(" List tab key action inside table.", () => {
            let rteObj: RichTextEditor;
            let rteEle: HTMLElement;
            let keyBoardEvent: any = { type: 'keydown', preventDefault: () => { }, stopPropagation: () => { }, shiftKey: false, which: 9, key: '' };
            let editNode: HTMLElement;
            beforeEach(() => {
                rteObj = renderRTE({
                    toolbarSettings: {
                        items: ['Bold', 'CreateTable', '|', 'Formats', 'Alignments', 'OrderedList',
                            'UnorderedList', 'Outdent', 'Indent']
                    },
                    value: `<table class="e-rte-table" style="width: 100%;"><tbody><tr><td class="" style="width: 50%;"><ol><li>item 1<br></li><li>item 2<br></li><li>item3</li></ol></td><td style="width: 50%;"><br></td></tr></tbody></table>
                    `
                });
                rteEle = rteObj.element;
                editNode = (rteObj as any).inputElement;
            });

            afterEach(() => {
                destroy(rteObj);
            });

            it(' tab key navigation from second li start point', () => {
                let selectNode: Element = editNode.querySelector('ol');
                expect(selectNode.querySelector('ol')).toBeNull();
                setCursorPoint(selectNode.childNodes[2] as Element, 0);
                (rteObj as any).keyDown(keyBoardEvent);
                expect(selectNode.querySelector('ol')).not.toBeNull();
            });
        });

        describe("tab and shift+tab", () => {
            let rteObj: RichTextEditor;
            let keyboardEventArgs = {
                preventDefault: function () { },
                keyCode: 9,
                shiftKey: false
            };
            let keyboardEventArgs1 = {
                preventDefault: function () { },
                keyCode: 9,
                shiftKey: true
            };
            beforeEach(() => {
                rteObj = renderRTE({
                    toolbarSettings: {
                        items: ['Bold', 'CreateTable', '|', 'Formats', 'Alignments', 'OrderedList',
                            'UnorderedList', 'Outdent', 'Indent']
                    },
                    value: `<ol><li><p>Support
                    to insert image from a defined path.</p></li></ol><div><table class="e-rte-table" style="width: 100%;">
                    <tbody><tr><td style="width: 50%;"><br></td>
                    <td style="width: 50%;"><br></td></tr></tbody></table><br></div><ol><li><p>Footer
                    elements and styles(tag / Element information , Action button (Upload, Cancel))</p></li></ol>`
                });
            });

            afterEach(() => {
                destroy(rteObj);
            });
            it(' empty cell', (done) => {
                setTimeout(() => {
                    let tdNode: Element = rteObj.element.querySelector("td");
                    setCursorPoint(tdNode, 0);
                    keyboardEventArgs.keyCode = 9;
                    (<any>rteObj).tableModule.keyDown({ args: keyboardEventArgs });
                    keyboardEventArgs1.keyCode = 9;
                    (<any>rteObj).tableModule.keyDown({ args: keyboardEventArgs1 });
                    expect(tdNode.querySelector('p')).toBeNull();
                    done();
                }, 500);
            });
            it('Multiline text cell', (done) => {
                setTimeout(() => {
                    let tdNode: Element = rteObj.element.querySelector("td");
                    (tdNode as HTMLElement).innerText = "'first line'<br>'second line'<br>'third line'<br>'fourth line' <br>";
                    (tdNode as HTMLElement).innerText = "'first line'<br>'second line'<br>'third line'<br>'fourth line' <br>";
                    setCursorPoint(tdNode, 0);
                    keyboardEventArgs.keyCode = 9;
                    (<any>rteObj).tableModule.keyDown({ args: keyboardEventArgs });
                    keyboardEventArgs1.keyCode = 9;
                    (<any>rteObj).tableModule.keyDown({ args: keyboardEventArgs1 });
                    expect(tdNode.querySelector('p')).toBeNull();
                    done();
                }, 500);
            });

        });
        describe(" EJ2-19873:  Inserting table in the list produces one extra empty list", () => {
            let rteObj: RichTextEditor;
            let rteEle: HTMLElement;
            let controlId: string;
            let editNode: HTMLElement;
            beforeEach(() => {
                rteObj = renderRTE({
                    toolbarSettings: {
                        items: ['Bold', 'CreateTable', '|', 'Formats', 'Alignments', 'OrderedList',
                            'UnorderedList', 'Outdent', 'Indent']
                    },
                    value: `<ol><li>one</li><li>two</li><li>three</li></ol><p><br></p>`
                });
                rteEle = rteObj.element;
                controlId = rteEle.id;
                editNode = (rteObj as any).inputElement;
            });

            afterEach(() => {
                destroy(rteObj);
            });
            it(' insert the table at selection of end of li', (done) => {
                let firstNode: HTMLElement = rteObj.element.querySelectorAll("li")[1];
                setCursorPoint(firstNode.childNodes[0] as Element, firstNode.textContent.length - 1);
                let item: HTMLElement = rteObj.element.querySelector('#' + controlId + '_toolbar_CreateTable') as HTMLElement;
                item.click();
                let cell: Element = document.getElementById(controlId + "_table").querySelectorAll(".e-rte-tablecell")[0];
                dispatchEvent(cell, "mousedown");
                dispatchEvent(cell, "mouseup");
                (cell as HTMLElement).click();
                let applied: any = editNode.querySelectorAll('li:empty');
                expect(applied.length === 0).toBe(true);
                done();
            });
        });
    });
    describe(' Quick Toolbar showOnRightClick property testing', () => {
        let rteObj: any;
        let ele: HTMLElement;
        it(" leftClick with `which` as '2' with quickpopup availability testing ", (done: Function) => {
            rteObj = renderRTE({
                quickToolbarSettings: {
                    showOnRightClick: false
                },
                value: `<table class="e-rte-table" style="width: 100%;"><tbody><tr><td class="" style="width: 50%;"><ol><li>item 1<br></li><li>item 2<br></li><li>item3</li></ol></td><td style="width: 50%;"><br></td></tr></tbody></table>`
            });
            ele = rteObj.element;
            expect(rteObj.quickToolbarSettings.showOnRightClick).toEqual(false);
            let cntTarget = <HTMLElement>ele.querySelectorAll(".e-content")[0]
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            cntTarget.dispatchEvent(clickEvent);
            let target: HTMLElement = ele.querySelector('.e-rte-table td');
            let eventsArg: any = { pageX: 50, pageY: 300, target: target, which: 2 };
            rteObj.mouseUp(eventsArg);
            setTimeout(() => {
                let quickPop: any = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                expect(isNullOrUndefined(quickPop)).toBe(true);
                done();
            }, 200);
        });
        it(" leftClick with `which` as '3' with quickpopup availability testing ", (done: Function) => {
            rteObj = renderRTE({
                quickToolbarSettings: {
                    showOnRightClick: false
                },
                value: `<table class="e-rte-table" style="width: 100%;"><tbody><tr><td class="" style="width: 50%;"><ol><li>item 1<br></li><li>item 2<br></li><li>item3</li></ol></td><td style="width: 50%;"><br></td></tr></tbody></table>`
            });
            ele = rteObj.element;
            expect(rteObj.quickToolbarSettings.showOnRightClick).toEqual(false);
            let cntTarget = <HTMLElement>ele.querySelectorAll(".e-content")[0]
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            cntTarget.dispatchEvent(clickEvent);
            let target: HTMLElement = ele.querySelector('.e-rte-table td');
            let eventsArg: any = { pageX: 50, pageY: 300, target: target, which: 3 };
            rteObj.mouseUp(eventsArg);
            setTimeout(() => {
                let quickPop: any = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                expect(isNullOrUndefined(quickPop)).toBe(true);
                done();
            }, 200);
        });
        it(" leftClick with `which` as '1' with quickpopup availability testing ", (done: Function) => {
            rteObj = renderRTE({
                quickToolbarSettings: {
                    showOnRightClick: false
                },
                value: `<table class="e-rte-table" style="width: 100%;"><tbody><tr><td class="" style="width: 50%;"><ol><li>item 1<br></li><li>item 2<br></li><li>item3</li></ol></td><td style="width: 50%;"><br></td></tr></tbody></table>`
            });
            ele = rteObj.element;
            expect(rteObj.quickToolbarSettings.showOnRightClick).toEqual(false);
            let cntTarget = <HTMLElement>ele.querySelectorAll(".e-content")[0]
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            cntTarget.dispatchEvent(clickEvent);
            let target: HTMLElement = ele.querySelector('.e-rte-table td');
            let eventsArg: any = { pageX: 50, pageY: 300, target: target, which: 1 };
            rteObj.mouseUp(eventsArg);
            setTimeout(() => {
                let quickPop: any = document.querySelectorAll('.e-rte-quick-popup') as NodeList;
                expect(quickPop.length > 0).toBe(true);
                expect(isNullOrUndefined(quickPop[0])).toBe(false);
                done();
            }, 200);
        });
        it(" rightClick with `which` as '2' with quickpopup availability testing ", (done: Function) => {
            rteObj = renderRTE({
                quickToolbarSettings: {
                    showOnRightClick: true
                },
                value: `<table class="e-rte-table" style="width: 100%;"><tbody><tr><td class="" style="width: 50%;"><ol><li>item 1<br></li><li>item 2<br></li><li>item3</li></ol></td><td style="width: 50%;"><br></td></tr></tbody></table>`
            });
            ele = rteObj.element;
            expect(rteObj.quickToolbarSettings.showOnRightClick).toEqual(true);
            let cntTarget = <HTMLElement>ele.querySelectorAll(".e-content")[0]
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            cntTarget.dispatchEvent(clickEvent);
            let target: HTMLElement = ele.querySelector('.e-rte-table td');
            let eventsArg: any = { pageX: 50, pageY: 300, target: target, which: 2 };
            rteObj.mouseUp(eventsArg);
            setTimeout(() => {
                let quickPop: any = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                expect(isNullOrUndefined(quickPop)).toBe(true);
                done();
            }, 200);
        });
        it(" rightClick with `which` as '1' with quickpopup availability testing ", (done: Function) => {
            rteObj = renderRTE({
                quickToolbarSettings: {
                    showOnRightClick: true
                },
                value: `<table class="e-rte-table" style="width: 100%;"><tbody><tr><td class="" style="width: 50%;"><ol><li>item 1<br></li><li>item 2<br></li><li>item3</li></ol></td><td style="width: 50%;"><br></td></tr></tbody></table>`
            });
            ele = rteObj.element;
            expect(rteObj.quickToolbarSettings.showOnRightClick).toEqual(true);
            let cntTarget = <HTMLElement>ele.querySelectorAll(".e-content")[0]
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            cntTarget.dispatchEvent(clickEvent);
            let target: HTMLElement = ele.querySelector('.e-rte-table td');
            let eventsArg: any = { pageX: 50, pageY: 300, target: target, which: 1 };
            rteObj.mouseUp(eventsArg);
            setTimeout(() => {
                let quickPop: any = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                expect(isNullOrUndefined(quickPop)).toBe(true);
                done();
            }, 200);
        });
        it(" rightClick with `which` as '3' with quickpopup availability testing ", (done: Function) => {
            rteObj = renderRTE({
                quickToolbarSettings: {
                    showOnRightClick: true
                },
                value: `<table class="e-rte-table" style="width: 100%;"><tbody><tr><td class="" style="width: 50%;"><ol><li>item 1<br></li><li>item 2<br></li><li>item3</li></ol></td><td style="width: 50%;"><br></td></tr></tbody></table>`
            });
            ele = rteObj.element;
            expect(rteObj.quickToolbarSettings.showOnRightClick).toEqual(true);
            let cntTarget = <HTMLElement>ele.querySelectorAll(".e-content")[0]
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            cntTarget.dispatchEvent(clickEvent);
            let target: HTMLElement = ele.querySelector('.e-rte-table td');
            let eventsArg: any = { pageX: 50, pageY: 300, target: target, which: 3 };
            rteObj.mouseUp(eventsArg);
            setTimeout(() => {
                let quickPop: any = document.querySelectorAll('.e-rte-quick-popup') as NodeList;
                expect(quickPop.length > 0).toBe(true);
                expect(isNullOrUndefined(quickPop[0])).toBe(false);
                done();
            }, 200);
        });
        it(" rightClick with `which` as '3' with quickpopup availability testing context Menu", (done: Function) => {
            rteObj = renderRTE({
                quickToolbarSettings: {
                    showOnRightClick: true
                },
                value: `<table class="e-rte-table" style="width: 100%;"><tbody><tr><td class="" style="width: 50%;"><ol><li>item 1<br></li><li>item 2<br></li><li>item3</li></ol></td><td style="width: 50%;"><br></td></tr></tbody></table>`
            });
            ele = rteObj.element;
            expect(rteObj.quickToolbarSettings.showOnRightClick).toEqual(true);
            let cntTarget = <HTMLElement>ele.querySelectorAll(".e-content")[0]
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            cntTarget.dispatchEvent(clickEvent);
            let target: HTMLElement = ele.querySelector('.e-rte-table td');
            let eventsArg: any = {target: target, which: 3, preventDefault: () => { return true; } };
            rteObj.contextHandler(eventsArg);
            rteObj.mouseUp(eventsArg);
            setTimeout(() => {
                let quickPop: any = document.querySelectorAll('.e-rte-quick-popup') as NodeList;
                expect(quickPop.length > 0).toBe(true);
                expect(isNullOrUndefined(quickPop[0])).toBe(false);
                done();
            }, 200);
        });
        it(" Android - false with quickpopup availability testing", (done: Function) => {
            Browser.userAgent = androidUA;
            rteObj = renderRTE({
                quickToolbarSettings: {
                    showOnRightClick: false
                },
                value: `<table class="e-rte-table" style="width: 100%;"><tbody><tr><td class="" style="width: 50%;"><ol><li>item 1<br></li><li>item 2<br></li><li>item3</li></ol></td><td style="width: 50%;"><br></td></tr></tbody></table>`
            });
            ele = rteObj.element;
            expect(rteObj.quickToolbarSettings.showOnRightClick).toEqual(false);
            let cntTarget = <HTMLElement>ele.querySelectorAll(".e-content")[0]
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            cntTarget.dispatchEvent(clickEvent);
            let target: HTMLElement = ele.querySelector('.e-rte-table td');
            let eventsArg: any = { pageX: 50, pageY: 300, target: target, which: 1 };
            rteObj.mouseUp(eventsArg);
            setTimeout(() => {
                let quickPop: any = document.querySelectorAll('.e-rte-quick-popup') as NodeList;
                expect(quickPop.length > 0).toBe(true);
                expect(isNullOrUndefined(quickPop[0])).toBe(false);
                Browser.userAgent = currentBrowserUA;
                done();
            }, 400);
        });
        it(" Android - true with quickpopup availability testing", (done: Function) => {
            Browser.userAgent = androidUA;
            rteObj = renderRTE({
                quickToolbarSettings: {
                    showOnRightClick: true
                },
                value: `<table class="e-rte-table" style="width: 100%;"><tbody><tr><td class="" style="width: 50%;"><ol><li>item 1<br></li><li>item 2<br></li><li>item3</li></ol></td><td style="width: 50%;"><br></td></tr></tbody></table>`
            });
            ele = rteObj.element;
            expect(rteObj.quickToolbarSettings.showOnRightClick).toEqual(true);
            let cntTarget = <HTMLElement>ele.querySelectorAll(".e-content")[0]
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            cntTarget.dispatchEvent(clickEvent);
            let target: HTMLElement = ele.querySelector('.e-rte-table td');
            let eventsArg: any = { pageX: 50, pageY: 300, target: target, which: 3 };
            rteObj.touchHandler({ originalEvent: eventsArg });
            rteObj.mouseUp(eventsArg);
            setTimeout(() => {
                let quickPop: any = document.querySelectorAll('.e-rte-quick-popup') as NodeList;
                expect(quickPop.length > 0).toBe(true);
                expect(isNullOrUndefined(quickPop[0])).toBe(false);
                Browser.userAgent = currentBrowserUA;
                done();
            }, 400);
        });
        it(" Android - true with onproperty change and quickpopup availability testing", (done: Function) => {
            Browser.userAgent = androidUA;
            rteObj = renderRTE({
                quickToolbarSettings: {
                    showOnRightClick: true
                },
                value: `<table class="e-rte-table" style="width: 100%;"><tbody><tr><td class="" style="width: 50%;"><ol><li>item 1<br></li><li>item 2<br></li><li>item3</li></ol></td><td style="width: 50%;"><br></td></tr></tbody></table>`
            });
            ele = rteObj.element;
            expect(rteObj.quickToolbarSettings.showOnRightClick).toEqual(true);
            let cntTarget = <HTMLElement>ele.querySelectorAll(".e-content")[0]
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            cntTarget.dispatchEvent(clickEvent);
            let quickPop: any = document.querySelectorAll('.e-rte-quick-popup') as NodeList;
            expect(quickPop.length > 0).toBe(false);
            rteObj.quickToolbarSettings.showOnRightClick = false;
            rteObj.dataBind();
            let target: HTMLElement = ele.querySelector('.e-rte-table td');
            let eventsArg: any = { pageX: 50, pageY: 300, target: target, which: 1 };
            expect(rteObj.quickToolbarSettings.showOnRightClick).toEqual(false);
            rteObj.mouseUp(eventsArg);
            setTimeout(() => {
                let quickPop: any = document.querySelectorAll('.e-rte-quick-popup') as NodeList;
                expect(quickPop.length > 0).toBe(true);
                expect(isNullOrUndefined(quickPop[0])).toBe(false);
                Browser.userAgent = currentBrowserUA;
                done();
            }, 400);
        });
        it(" Android - false with onproperty change and quickpopup availability testing", (done: Function) => {
            Browser.userAgent = androidUA;
            rteObj = renderRTE({
                quickToolbarSettings: {
                    showOnRightClick: false
                },
                value: `<table class="e-rte-table" style="width: 100%;"><tbody><tr><td class="" style="width: 50%;"><ol><li>item 1<br></li><li>item 2<br></li><li>item3</li></ol></td><td style="width: 50%;"><br></td></tr></tbody></table>`
            });
            ele = rteObj.element;
            expect(rteObj.quickToolbarSettings.showOnRightClick).toEqual(false);
            let cntTarget = <HTMLElement>ele.querySelectorAll(".e-content")[0]
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            cntTarget.dispatchEvent(clickEvent);
            let quickPop: any = document.querySelectorAll('.e-rte-quick-popup') as NodeList;
            expect(quickPop.length > 0).toBe(false);
            rteObj.quickToolbarSettings.showOnRightClick = true;
            rteObj.dataBind();
            let target: HTMLElement = ele.querySelector('.e-rte-table td');
            let eventsArg: any = { pageX: 50, pageY: 300, target: target, which: 3 };
            expect(rteObj.quickToolbarSettings.showOnRightClick).toEqual(true);
            rteObj.touchHandler({ originalEvent: eventsArg });
            rteObj.mouseUp(eventsArg);
            setTimeout(() => {
                let quickPop: any = document.querySelectorAll('.e-rte-quick-popup') as NodeList;
                expect(quickPop.length > 0).toBe(true);
                expect(isNullOrUndefined(quickPop[0])).toBe(false);
                Browser.userAgent = currentBrowserUA;
                done();
            }, 400);
        });
        it(" iPhone - false with quickpopup availability testing", (done: Function) => {
            Browser.userAgent = iPhoneUA;
            rteObj = renderRTE({
                quickToolbarSettings: {
                    showOnRightClick: false
                },
                value: `<table class="e-rte-table" style="width: 100%;"><tbody><tr><td class="" style="width: 50%;"><ol><li>item 1<br></li><li>item 2<br></li><li>item3</li></ol></td><td style="width: 50%;"><br></td></tr></tbody></table>`
            });
            ele = rteObj.element;
            expect(rteObj.quickToolbarSettings.showOnRightClick).toEqual(false);
            let cntTarget = <HTMLElement>ele.querySelectorAll(".e-content")[0]
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            cntTarget.dispatchEvent(clickEvent);
            let target: HTMLElement = ele.querySelector('.e-rte-table td');
            let eventsArg: any = { pageX: 50, pageY: 300, target: target, which: 1, clientX: rteObj.clickPoints.clientX, clientY: rteObj.clickPoints.clientY };
            rteObj.mouseUp(eventsArg);
            setTimeout(() => {
                let quickPop: any = document.querySelectorAll('.e-rte-quick-popup') as NodeList;
                expect(quickPop.length > 0).toBe(true);
                expect(isNullOrUndefined(quickPop[0])).toBe(false);
                Browser.userAgent = currentBrowserUA;
                done();
            }, 400);
        });
        it(" iPhone - true with quickpopup availability testing", (done: Function) => {
            Browser.userAgent = iPhoneUA;
            rteObj = renderRTE({
                quickToolbarSettings: {
                    showOnRightClick: true
                },
                value: `<table class="e-rte-table" style="width: 100%;"><tbody><tr><td class="" style="width: 50%;"><ol><li>item 1<br></li><li>item 2<br></li><li>item3</li></ol></td><td style="width: 50%;"><br></td></tr></tbody></table>`
            });
            ele = rteObj.element;
            expect(rteObj.quickToolbarSettings.showOnRightClick).toEqual(true);
            let cntTarget = <HTMLElement>ele.querySelectorAll(".e-content")[0]
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            cntTarget.dispatchEvent(clickEvent);
            let target: HTMLElement = ele.querySelector('.e-rte-table td');
            let eventsArg: any = { pageX: 50, pageY: 300, target: target, which: 3, clientX: rteObj.clickPoints.clientX, clientY: rteObj.clickPoints.clientY };
            rteObj.touchHandler({ originalEvent: eventsArg });
            rteObj.mouseUp(eventsArg);
            setTimeout(() => {
                let quickPop: any = document.querySelectorAll('.e-rte-quick-popup') as NodeList;
                expect(quickPop.length > 0).toBe(true);
                expect(isNullOrUndefined(quickPop[0])).toBe(false);
                Browser.userAgent = currentBrowserUA;
                done();
            }, 400);
        });
        it(" iPhone - true with onproperty change and quickpopup availability testing", (done: Function) => {
            Browser.userAgent = iPhoneUA;
            rteObj = renderRTE({
                quickToolbarSettings: {
                    showOnRightClick: true
                },
                value: `<table class="e-rte-table" style="width: 100%;"><tbody><tr><td class="" style="width: 50%;"><ol><li>item 1<br></li><li>item 2<br></li><li>item3</li></ol></td><td style="width: 50%;"><br></td></tr></tbody></table>`
            });
            ele = rteObj.element;
            expect(rteObj.quickToolbarSettings.showOnRightClick).toEqual(true);
            let cntTarget = <HTMLElement>ele.querySelectorAll(".e-content")[0]
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            cntTarget.dispatchEvent(clickEvent);
            let quickPop: any = document.querySelectorAll('.e-rte-quick-popup') as NodeList;
            expect(quickPop.length > 0).toBe(false);
            rteObj.quickToolbarSettings.showOnRightClick = false;
            rteObj.dataBind();
            let target: HTMLElement = ele.querySelector('.e-rte-table td');
            let eventsArg: any = { pageX: 50, pageY: 300, target: target, which: 1, clientX: rteObj.clickPoints.clientX, clientY: rteObj.clickPoints.clientY };
            expect(rteObj.quickToolbarSettings.showOnRightClick).toEqual(false);
            rteObj.mouseUp(eventsArg);
            setTimeout(() => {
                let quickPop: any = document.querySelectorAll('.e-rte-quick-popup') as NodeList;
                expect(quickPop.length > 0).toBe(true);
                expect(isNullOrUndefined(quickPop[0])).toBe(false);
                Browser.userAgent = currentBrowserUA;
                done();
            }, 400);
        });
        it(" iPhone - false with onproperty change and quickpopup availability testing", (done: Function) => {
            Browser.userAgent = iPhoneUA;
            rteObj = renderRTE({
                quickToolbarSettings: {
                    showOnRightClick: false
                },
                value: `<table class="e-rte-table" style="width: 100%;"><tbody><tr><td class="" style="width: 50%;"><ol><li>item 1<br></li><li>item 2<br></li><li>item3</li></ol></td><td style="width: 50%;"><br></td></tr></tbody></table>`
            });
            ele = rteObj.element;
            expect(rteObj.quickToolbarSettings.showOnRightClick).toEqual(false);
            let cntTarget = <HTMLElement>ele.querySelectorAll(".e-content")[0]
            let clickEvent: any = document.createEvent("MouseEvents");
            clickEvent.initEvent("mousedown", false, true);
            cntTarget.dispatchEvent(clickEvent);
            let quickPop: any = document.querySelectorAll('.e-rte-quick-popup') as NodeList;
            expect(quickPop.length > 0).toBe(false);
            rteObj.quickToolbarSettings.showOnRightClick = true;
            rteObj.dataBind();
            let target: HTMLElement = ele.querySelector('.e-rte-table td');
            let eventsArg: any = { pageX: 50, pageY: 300, target: target, which: 3, clientX: rteObj.clickPoints.clientX, clientY: rteObj.clickPoints.clientY };
            expect(rteObj.quickToolbarSettings.showOnRightClick).toEqual(true);
            rteObj.touchHandler({ originalEvent: eventsArg });
            rteObj.mouseUp(eventsArg);
            setTimeout(() => {
                let quickPop: any = document.querySelectorAll('.e-rte-quick-popup') as NodeList;
                expect(quickPop.length > 0).toBe(true);
                expect(isNullOrUndefined(quickPop[0])).toBe(false);
                Browser.userAgent = currentBrowserUA;
                done();
            }, 400);
        });
        afterEach((done: Function) => {
            destroy(rteObj);
            done();
        });
    });

    describe(" EJ2-19935: RTE text align property is not working properly in table cell", () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        let controlId: string;
        beforeEach(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Bold', 'CreateTable', '|', 'Formats', 'Alignments', 'OrderedList',
                        'UnorderedList', 'Outdent', 'Indent']
                },
                value: `<p><b>Description:</b></p><p>The Rich Text Editor (RTE) control is an easy to render in
                client side.</p><table class="e-rte-table" style="width: 100%;"><thead><tr><th class="e-cell-select"><br></th><th><br></th></tr></thead><tbody><tr><td style="width: 50%;" class=""><br></td><td style="width: 50%;"><br></td></tr><tr><td style="width: 50%;"><br></td><td style="width: 50%;"><br></td></tr></tbody></table>
                `
            });
            rteEle = rteObj.element;
            controlId = rteEle.id;
        });

        afterEach(() => {
            destroy(rteObj);
        });
        it(' apply the right alignment to table td', (done) => {
            let node: HTMLElement = (rteObj as any).inputElement.querySelector("td");
            setCursorPoint(node, 0);
            node.focus();
            let clickEvent: MouseEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent('mousedown', false, true);
            (rteObj as any).inputElement.dispatchEvent(clickEvent);
            let eventsArg: any = { pageX: 50, pageY: 300, target: node };
            (<any>rteObj).tableModule.editAreaClickHandler({ args: eventsArg });
            setTimeout(() => {
                let tablePop: any = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                let insertBtn: HTMLElement = tablePop.querySelector("#" + controlId + "_quick_Alignments");
                insertBtn.click();
                let dropdown: HTMLElement = document.querySelector('#' + controlId + "_quick_Alignments-popup");
                (dropdown.querySelectorAll(".e-item")[2] as HTMLElement).click();
                expect(((rteObj as any).inputElement.querySelectorAll("td")[0] as HTMLElement).style.textAlign === 'right').toBe(true);
                done();
            }, 600);
        });
    });

    describe(" IE - table delete testing", () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        beforeEach(() => {
            Browser.userAgent = ieUA;
        });

        afterEach(() => {
            Browser.userAgent = currentBrowserUA;
            destroy(rteObj);
        });
        it(' delete column', (done) => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Bold']
                },
                value: `<table class="e-rte-table" style="width: 100%;"><tbody><tr><td style="width: 33.3333%;" class="">1</td><td style="width: 33.3333%;">4</td><td style="width: 33.3333%;">7</td></tr><tr><td style="width: 33.3333%;">2</td><td style="width: 33.3333%;" class="e-cell-select">5</td><td style="width: 33.3333%;">8</td></tr><tr><td style="width: 33.3333%;">3</td><td style="width: 33.3333%;">6</td><td style="width: 33.3333%;">9</td></tr></tbody></table>`
            });
            rteEle = rteObj.element;
            let domSelection: NodeSelection = new NodeSelection();
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            dispatchEvent((rteObj.contentModule.getEditPanel() as HTMLElement), 'mousedown');
            let tableCell: Element = document.querySelectorAll('tr')[1].querySelectorAll('td')[1];
            let eventsArg: any = { pageX: 50, pageY: 300, target: tableCell };
            (<any>rteObj).tableModule.editAreaClickHandler({ args: eventsArg });
            setTimeout(() => {
                let rows: any = rteObj.element.querySelectorAll('tr');
                expect(rows[0].querySelectorAll('td').length).toBe(3);
                expect(rows[1].querySelectorAll('td').length).toBe(3);
                expect(rows[2].querySelectorAll('td').length).toBe(3);
                domSelection.setSelectionText(rteObj.contentModule.getDocument(), tableCell, tableCell, 0, 0);
                (document.querySelectorAll('.e-rte-quick-popup .e-toolbar-item button')[2] as HTMLElement).click();
                (rows[1].querySelectorAll('td')[1] as HTMLElement).classList.add("e-cell-select");
                (document.querySelectorAll('.e-rte-dropdown-items.e-dropdown-popup ul .e-item')[2] as HTMLElement).click();
                expect(rows[0].querySelectorAll('td').length).toBe(2);
                expect(rows[1].querySelectorAll('td').length).toBe(2);
                expect(rows[2].querySelectorAll('td').length).toBe(2);
                done();
            }, 400);
        });
        it(' delete row', (done) => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Bold']
                },
                value: `<table class="e-rte-table" style="width: 100%;"><tbody><tr><td style="width: 33.3333%;" class="">1</td><td style="width: 33.3333%;">4</td><td style="width: 33.3333%;">7</td></tr><tr><td style="width: 33.3333%;">2</td><td style="width: 33.3333%;" class="e-cell-select">5</td><td style="width: 33.3333%;">8</td></tr><tr><td style="width: 33.3333%;">3</td><td style="width: 33.3333%;">6</td><td style="width: 33.3333%;">9</td></tr></tbody></table>`
            });
            rteEle = rteObj.element;
            let domSelection: NodeSelection = new NodeSelection();
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            dispatchEvent((rteObj.contentModule.getEditPanel() as HTMLElement), 'mousedown');
            let tableCell: Element = document.querySelectorAll('tr')[1].querySelectorAll('td')[1];
            let eventsArg: any = { pageX: 50, pageY: 300, target: tableCell };
            (<any>rteObj).tableModule.editAreaClickHandler({ args: eventsArg });
            setTimeout(() => {
                let rows: any = rteObj.element.querySelectorAll('tr');
                expect(rows.length).toBe(3);
                domSelection.setSelectionText(rteObj.contentModule.getDocument(), tableCell, tableCell, 0, 0);
                (document.querySelectorAll('.e-rte-quick-popup .e-toolbar-item button')[1] as HTMLElement).click();
                (rows[1].querySelectorAll('td')[1] as HTMLElement).classList.add("e-cell-select");
                (document.querySelectorAll('.e-rte-dropdown-items.e-dropdown-popup ul .e-item')[2] as HTMLElement).click();
                rows = rteObj.element.querySelectorAll('tr');
                expect(rows.length).toBe(2);
                done();
            }, 400);
        });
    });

    describe("EJ2-44726 - Delete row issue ", () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        afterEach(() => {
            destroy(rteObj);
        });
        it(' - delete row deletes the previous row issue ', (done) => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Bold']
                },
                value: `<table class="table table-bordered" style="width:1977.33px"><tbody><tr><td style="line-height:1.42857"><span style="font-weight:700"><span style="font-size:11px">Proceseigenaar</span></span></td><td style="line-height:1.42857">Directie<br></td></tr><tr><td style="line-height:1.42857" class=""><span style="font-weight:700"><span style="font-size:11px">Doel</span></span></td><td style="line-height:1.42857"><span style="font-size:11px">Zorgen dat wijzigingen in de organisatie op een juiste manier beoordeeld, uitgevoerd en geborgd worden incl. de risico's</span></td></tr><tr><td style="line-height:1.42857"><span style="font-weight:700"><span style="font-size:11px">Verwijzing</span></span></td><td style="line-height:1.42857"><span style="font-size:11px">ISO 9001</span></td></tr></tbody></table>`
            });
            rteEle = rteObj.element;
            let domSelection: NodeSelection = new NodeSelection();
            (rteObj.contentModule.getEditPanel() as HTMLElement).focus();
            dispatchEvent((rteObj.contentModule.getEditPanel() as HTMLElement), 'mousedown');
            let tableCell: Element = document.querySelectorAll('tr')[1].querySelectorAll('td')[0];
            let eventsArg: any = { pageX: 50, pageY: 300, target: tableCell };
            (<any>rteObj).tableModule.editAreaClickHandler({ args: eventsArg });
            setTimeout(() => {
                let rows: any = rteObj.element.querySelectorAll('tr');
                expect(rows.length).toBe(3);
                domSelection.setSelectionText(rteObj.contentModule.getDocument(), tableCell, tableCell, 0, 0);
                (document.querySelectorAll('.e-rte-quick-popup .e-toolbar-item button')[1] as HTMLElement).click();
                document.querySelectorAll("td")[2].classList.add("e-cell-select");
                (document.querySelectorAll('.e-rte-dropdown-items.e-dropdown-popup ul .e-item')[2] as HTMLElement).click();
                rows = rteObj.element.querySelectorAll('tr');
                expect(rows.length).toBe(2);
                expect(rows[0].textContent === "ProceseigenaarDirectie").toBe(true);
                done();
            }, 400);
        });
    });
    describe(" EJ2-28899: RTE text align property is not working properly in table header cell", () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        let controlId: string;
        beforeEach(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Bold', 'CreateTable', '|', 'Formats', 'Alignments', 'OrderedList',
                        'UnorderedList', 'Outdent', 'Indent']
                },
                value: `<p><b>Description:</b></p><p>The Rich Text Editor (RTE) control is an easy to render in
                client side.</p><table class="e-rte-table" style="width: 100%;"><thead><tr><th class="e-cell-select"><br></th><th><br></th></tr></thead><tbody><tr><td style="width: 50%;" class="">test</td><td style="width: 50%;"><br></td></tr><tr><td style="width: 50%;"><br></td><td style="width: 50%;"><br></td></tr></tbody></table>
                `
            });
            rteEle = rteObj.element;
            controlId = rteEle.id;
        });

        afterEach(() => {
            destroy(rteObj);
        });
        it(' apply the right alignment to table th', (done) => {
            let node: HTMLElement = (rteObj as any).inputElement.querySelector("th");
            setCursorPoint(node, 0);
            node.focus();
            let clickEvent: MouseEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent('mousedown', false, true);
            (rteObj as any).inputElement.dispatchEvent(clickEvent);
            let eventsArg: any = { pageX: 50, pageY: 300, target: node };
            (<any>rteObj).tableModule.editAreaClickHandler({ args: eventsArg });
            setTimeout(() => {
                let tablePop: any = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                let insertBtn: HTMLElement = tablePop.querySelector("#" + controlId + "_quick_Alignments");
                insertBtn.click();
                let dropdown: HTMLElement = document.querySelector('#' + controlId + "_quick_Alignments-popup");
                (dropdown.querySelectorAll(".e-item")[2] as HTMLElement).click();
                expect(((rteObj as any).inputElement.querySelectorAll("th")[0] as HTMLElement).style.textAlign === 'right').toBe(true);
                done();
            }, 600);
        });
    });
    describe(" IPhone - iFrame alignments testing", () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        let controlId: string;
        beforeEach(() => {
            Browser.userAgent = iPhoneUA;
            rteObj = renderRTE({
                iframeSettings: {
                    enable: true
                },
                toolbarSettings: {
                    items: ['Bold', 'CreateTable', '|', 'Formats', 'Alignments', 'OrderedList',
                        'UnorderedList', 'Outdent', 'Indent']
                },
                value: `<p>The Rich Text Editor (RTE) control is an easy to render in client side</p>`
            });
            rteEle = rteObj.element;
            controlId = rteEle.id;
        });

        afterEach(() => {
            destroy(rteObj);
            Browser.userAgent = currentBrowserUA;
        });
        it(' apply the right alignment to table th', () => {
            let clickEvent: MouseEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent('mousedown', false, true);
            (rteObj as any).inputElement.dispatchEvent(clickEvent);
            let node: HTMLElement = (rteObj as any).inputElement.querySelector("p");
            setCursorPoint(node, 0);
            node.focus();
            let toolbar: any = <HTMLElement>document.querySelector('.e-rte-toolbar');
            let insertBtn: HTMLElement = toolbar.querySelector("#" + controlId + "_toolbar_Alignments");
            insertBtn.click();
            let dropdown: HTMLElement = document.querySelector('#' + controlId + "_toolbar_Alignments-popup");
            (dropdown.querySelectorAll(".e-item")[2] as HTMLElement).click();
            expect(((rteObj as any).inputElement.querySelector("p") as HTMLElement).style.textAlign === 'right').toBe(true);
        });
    });
    describe(" EJ2-28564:  Applying heading to table after inserting table inside another table not works properly", () => {
        let rteObj: RichTextEditor;
        beforeAll(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['Bold', 'CreateTable', '|', 'Formats', 'Alignments', 'OrderedList',
                        'UnorderedList', 'Outdent', 'Indent']
                },
                value: `<table class="e-rte-table" style="width: 95%;"><tbody><tr><td style="width: 33.3333%;" class=""><table class="e-rte-table" style="width: 100%;"><tbody><tr><td class="" style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;" class=""><br></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;" class=""><br></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr></tbody></table><br></td><td style="width: 33.3333%;" class=""><br></td><td style="width: 33.3333%;" class=""><br></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr></tbody></table>
                `
            });
        });
        afterAll(() => {
            destroy(rteObj);
        });
        it(' Insert header to child table', (done) => {
            expect((rteObj as any).inputElement.querySelectorAll("thead").length).toBe(0);
            let node: HTMLElement = (rteObj as any).inputElement.querySelectorAll("td")[1];
            setCursorPoint(node, 0);
            node.focus();
            let clickEvent: MouseEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent('mousedown', false, true);
            (rteObj as any).inputElement.dispatchEvent(clickEvent);
            let eventsArg: any = { pageX: 50, pageY: 300, target: node };
            (<any>rteObj).tableModule.editAreaClickHandler({ args: eventsArg });
            setTimeout(() => {
                let tablePop: any = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                let insertBtn: HTMLElement = tablePop.querySelector(".e-toolbar-item button");
                insertBtn.click();
                expect((rteObj as any).inputElement.querySelectorAll("thead").length).toBe(1);
                expect((rteObj as any).inputElement.querySelectorAll("thead")[0].querySelectorAll('th').length).toBe(3);
                done();
            }, 600);
        });
        it(' Insert header to root table', (done: Function) => {
            expect((rteObj as any).inputElement.querySelectorAll("thead").length).toBe(1);
            let node: HTMLElement = (rteObj as any).inputElement.querySelectorAll("td")[11];
            setCursorPoint(node, 0);
            node.focus();
            let clickEvent: MouseEvent = document.createEvent("MouseEvents");
            clickEvent.initEvent('mousedown', false, true);
            (rteObj as any).inputElement.dispatchEvent(clickEvent);
            let eventsArg: any = { pageX: 50, pageY: 300, target: node };
            (<any>rteObj).tableModule.editAreaClickHandler({ args: eventsArg });
            setTimeout(() => {
                let tablePop: any = <HTMLElement>document.querySelectorAll('.e-rte-quick-popup')[0];
                let insertBtn: HTMLElement = tablePop.querySelector(".e-toolbar-item button");
                insertBtn.click();
                expect((rteObj as any).inputElement.querySelectorAll("thead").length).toBe(2);
                expect((rteObj as any).inputElement.querySelectorAll("thead")[1].querySelectorAll('th').length).toBe(3);
                expect((rteObj as any).inputElement.querySelectorAll("thead th").length).toBe(6);
                done();
            }, 600);
        });
    });
    describe(" EJ2-28994 - IE table insert on new line testing", () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        beforeEach(() => {
            Browser.userAgent = ieUA;
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['CreateTable']
                },
                value: `<p></p>`
            });
            rteEle = rteObj.element;
        });

        afterEach(() => {
            destroy(rteObj);
            Browser.userAgent = currentBrowserUA;
        });
        it(' insert table ', (done) => {
            rteObj.focusIn();
            let clickEvent: MouseEvent = document.createEvent("MouseEvents");
            let node: HTMLElement = (rteObj as any).inputElement.querySelector("p");
            setCursorPoint(node, 0);
            node.focus();
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            setTimeout(function () {
                let target: HTMLElement = (rteObj as any).tableModule.popupObj.element.querySelector('.e-insert-table-btn');
                clickEvent = document.createEvent("MouseEvents");
                clickEvent.initEvent("click", false, true);
                target.dispatchEvent(clickEvent);
                setTimeout(() => {
                    expect(document.body.querySelector('.e-rte-edit-table.e-dialog')).not.toBe(null);
                    expect(rteObj.tableModule.editdlgObj.element.querySelector('#tableColumn')).not.toBe(null);
                    expect(rteObj.tableModule.editdlgObj.element.querySelector('#tableRow')).not.toBe(null);
                    expect((rteObj.tableModule.editdlgObj.element.querySelector('#tableRow') as any).value === '3').toBe(true);
                    expect((rteObj.tableModule.editdlgObj.element.querySelector('#tableColumn') as any).value === '3').toBe(true);
                    target = rteObj.tableModule.editdlgObj.element.querySelector('.e-insert-table') as HTMLElement;
                    target.dispatchEvent(clickEvent);
                    setTimeout(() => {
                        expect(rteEle.querySelectorAll('p').length).toBe(1);
                        expect(rteEle.querySelectorAll('.e-content > p').length).toBe(1);
                        expect(rteEle.querySelectorAll('.e-content > table').length).toBe(1);
                        expect(rteEle.querySelector('.e-content').childNodes.length).toBe(2);
                        let table: HTMLElement = rteObj.contentModule.getEditPanel().querySelector('table') as HTMLElement;
                        expect(table.querySelectorAll('tr').length === 3).toBe(true);
                        expect(table.querySelectorAll('td').length === 9).toBe(true);
                        done();
                    }, 500);
                }, 500);
            }, 500);
        });
    });
    describe(" EJ2-43332 - Table getting removed while using bulleting/numbering", () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        beforeEach(() => {
            rteObj = renderRTE({
                toolbarSettings: {
                    items: ['OrderedList', 'UnorderedList']
                },
                value: `<table class="e-rte-table" style="width: 100%; min-width: 0px;">
                <tbody>
                    <tr>
                        <td class="" style="width: 20%;"><br></td>
                        <td style="width: 20%;"><br></td>
                        <td style="width: 20%;"><br></td>
                        <td style="width: 20%;"><br></td>
                        <td style="width: 20%;"><br></td>
                    </tr>
                </tbody>
            </table><p><b>Test1</b></p><p><b>Test2</b></p>`
            });
            rteEle = rteObj.element;
        });

        afterEach(() => {
            destroy(rteObj);
        });
        it(' Apply OrderedList and check table availability ', (done: Function) => {
            rteObj.focusIn();
            rteObj.selectAll();
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[0] as HTMLElement).click();
            getLastTextNode(rteEle);
            setTimeout(function () {
                expect(rteEle.querySelector('.e-content').innerHTML).toBe(`<table class="e-rte-table" style="width: 100%; min-width: 0px;">
                <tbody>
                    <tr>
                        <td class="" style="width: 20%;"><ol><li><br></li></ol></td>
                        <td style="width: 20%;"><ol><li><br></li></ol></td>
                        <td style="width: 20%;"><ol><li><br></li></ol></td>
                        <td style="width: 20%;"><ol><li><br></li></ol></td>
                        <td style="width: 20%;"><ol><li><br></li></ol></td>
                    </tr>
                </tbody>
            </table><ol><li><b>Test1</b></li><li><b>Test2</b></li></ol>`);
                done();
            }, 500);
        });
        it(' Apply UnOrderedList and check table availability ', (done: Function) => {
            rteObj.selectAll();
            (<HTMLElement>rteEle.querySelectorAll(".e-toolbar-item")[1] as HTMLElement).click();
            setTimeout(function () {
                expect(rteEle.querySelector('.e-content').innerHTML).toBe(`<table class="e-rte-table" style="width: 100%; min-width: 0px;">
                <tbody>
                    <tr>
                        <td class="" style="width: 20%;"><ul><li><br></li></ul></td>
                        <td style="width: 20%;"><ul><li><br></li></ul></td>
                        <td style="width: 20%;"><ul><li><br></li></ul></td>
                        <td style="width: 20%;"><ul><li><br></li></ul></td>
                        <td style="width: 20%;"><ul><li><br></li></ul></td>
                    </tr>
                </tbody>
            </table><ul><li><b>Test1</b></li><li><b>Test2</b></li></ul>`);
                done();
            }, 500);
        });
    });
    describe("Table cell merge - Header", () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        beforeEach(() => {
            rteObj = renderRTE({
                quickToolbarSettings: {
                    table: ['TableCell']
                },
                value: `<p>Text</p><table class="e-rte-table" style="width: 100%; min-width: 0px;"><thead><tr><th><br></th><th><br></th></tr></thead><tbody><tr><td style="width: 50%;" class="e-cell-select"><br></td><td style="width: 50%;"><br></td></tr><tr><td style="width: 50%;"><br></td><td style="width: 50%;"><br></td></tr></tbody></table><p>Editor</p>`
            });
            rteEle = rteObj.element;
        });
        afterEach(() => {
            destroy(rteObj);
        });
        it('Header merge', (done: Function) => {
            let target = rteEle.querySelector('.e-rte-table th');
            let eventsArg = { pageX: 50, pageY: 300, target: target, which: 1 };
            (rteObj as any).mouseDownHandler(eventsArg);
            let ev = new MouseEvent("mousemove", {
                view: window,
                bubbles: true,
                cancelable: true
            });
            rteEle.querySelectorAll("th")[1].dispatchEvent(ev);
            (rteObj as any).mouseUp(eventsArg);
            setTimeout(function () {
                (document.querySelectorAll('.e-rte-quick-popup .e-toolbar-item button')[0] as HTMLElement).click();
                (document.querySelectorAll('.e-rte-dropdown-items.e-dropdown-popup ul .e-item')[0] as HTMLElement).click();
                let table : HTMLTableElement = rteEle.querySelector("table");
                let header : HTMLElement = table.querySelector("thead");
                expect(header.children.length).toBe(1);
                //expect(header.children[0].getAttribute("colspan")).toBe("2");
                expect(header.children[0].getAttribute("rowspan")).toBe(null);
                done();
            }, 400);
        });
    });

    describe("Table cell merge", () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        beforeEach(() => {
            rteObj = renderRTE({
                quickToolbarSettings: {
                    table: ['TableCell']
                },
                value: `"<p>Text</p><table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="e-cell-select" style="width: 33.3333%;"><p>1</p></td><td style="width: 33.3333%;"><p>2</p></td><td style="width: 33.3333%;"><br></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr></tbody></table><p>Editor</p>`
            });
            rteEle = rteObj.element;
        });
        afterEach(() => {
            destroy(rteObj);
        });
        it('Merge first two cell', (done: Function) => {
            let target = rteEle.querySelector('.e-rte-table td');
            let eventsArg = { pageX: 50, pageY: 300, target: target, which: 1 };
            (rteObj as any).mouseDownHandler(eventsArg);
            let ev = new MouseEvent("mousemove", {
                view: window,
                bubbles: true,
                cancelable: true
            });
            rteEle.querySelectorAll("td")[1].dispatchEvent(ev);
            (rteObj as any).mouseUp(eventsArg);
            setTimeout(function () {
                (document.querySelectorAll('.e-rte-quick-popup .e-toolbar-item button')[0] as HTMLElement).click();
                (document.querySelectorAll('.e-rte-dropdown-items.e-dropdown-popup ul .e-item')[0] as HTMLElement).click();
                var table = rteEle.querySelector("table");
                var rows = table.rows;
                expect(table.rows.length).toBe(2);
                expect(table.rows[0].children.length).toBe(2);
                expect((rows[0].children[0] as HTMLElement).style.width).toEqual("66.6666%");
                expect((rows[0].children[1] as HTMLElement).style.width).toEqual("33.3333%");
                //expect(rows[0].children[0].getAttribute("colspan")).toBe("2");
                expect(rows[0].children[0].getAttribute("rowspan")).toBe(null);
                expect(rows[0].children[1].getAttribute("colspan")).toBe(null);
                expect(rows[0].children[1].getAttribute("rowspan")).toBe(null);
                expect(table.rows[1].children.length).toBe(3);
                expect((rows[1].children[0] as HTMLElement).style.width).toEqual("33.3333%");
                expect((rows[1].children[0] as HTMLElement).style.width).toEqual("33.3333%");
                expect((rows[1].children[0] as HTMLElement).style.width).toEqual("33.3333%");
                expect(rows[1].children[0].getAttribute("colspan")).toBe(null);
                expect(rows[1].children[0].getAttribute("rowspan")).toBe(null);
                expect(rows[1].children[1].getAttribute("colspan")).toBe(null);
                expect(rows[1].children[1].getAttribute("rowspan")).toBe(null);
                expect(rows[1].children[2].getAttribute("colspan")).toBe(null);
                expect(rows[1].children[2].getAttribute("rowspan")).toBe(null);
                done();
            }, 400);
        });
    });

    describe("Table cell merge -single row -all columns", () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        beforeEach(() => {
            rteObj = renderRTE({
                quickToolbarSettings: {
                    table: ['TableCell']
                },
                value: `"<p>Text</p><table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="e-cell-select" style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr></tbody></table><p>Editor</p>`
            });
            rteEle = rteObj.element;
        });
        afterEach(() => {
            destroy(rteObj);
        });
        it('Merge first two cell', (done: Function) => {
            let target = rteEle.querySelector('.e-rte-table td');
            let eventsArg = { pageX: 50, pageY: 300, target: target, which: 1 };
            (rteObj as any).mouseDownHandler(eventsArg);
            let ev = new MouseEvent("mousemove", {
                view: window,
                bubbles: true,
                cancelable: true
            });
            rteEle.querySelectorAll("td")[2].dispatchEvent(ev);
            (rteObj as any).mouseUp(eventsArg);
            setTimeout(function () {
                (document.querySelectorAll('.e-rte-quick-popup .e-toolbar-item button')[0] as HTMLElement).click();
                (document.querySelectorAll('.e-rte-dropdown-items.e-dropdown-popup ul .e-item')[0] as HTMLElement).click();
                done();
            }, 400);
        });
    });

    describe("MouseMove on same cell", () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        beforeEach(() => {
            rteObj = renderRTE({
                quickToolbarSettings: {
                    table: ['TableCell']
                },
                value: `"<p>Text</p><table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="e-cell-select" style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr></tbody></table><p>Editor</p>`
            });
            rteEle = rteObj.element;
        });
        afterEach(() => {
            destroy(rteObj);
        });
        it('Merge first two cell', () => {
            let target = rteEle.querySelector('.e-rte-table td');
            let eventsArg = { pageX: 50, pageY: 300, target: target, which: 1 };
            (rteObj as any).mouseDownHandler(eventsArg);
            let ev = new MouseEvent("mousemove", {
                view: window,
                bubbles: true,
                cancelable: true
            });
            rteEle.querySelectorAll("td")[0].dispatchEvent(ev);
        });
    });


    describe("Table cell merge -multiple row -single columns", () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        beforeEach(() => {
            rteObj = renderRTE({
                quickToolbarSettings: {
                    table: ['TableCell']
                },
                value: `"<p>Text</p><table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="e-cell-select" style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr></tbody></table><p>Editor</p>`
            });
            rteEle = rteObj.element;
        });
        afterEach(() => {
            destroy(rteObj);
        });
        it('Merge first two cell', (done: Function) => {
            let target = rteEle.querySelector('.e-rte-table td');
            let eventsArg = { pageX: 50, pageY: 300, target: target, which: 1 };
            (rteObj as any).mouseDownHandler(eventsArg);
            let ev = new MouseEvent("mousemove", {
                view: window,
                bubbles: true,
                cancelable: true
            });
            rteEle.querySelectorAll("td")[3].dispatchEvent(ev);
            (rteObj as any).mouseUp(eventsArg);
            setTimeout(function () {
                (document.querySelectorAll('.e-rte-quick-popup .e-toolbar-item button')[0] as HTMLElement).click();
                (document.querySelectorAll('.e-rte-dropdown-items.e-dropdown-popup ul .e-item')[0] as HTMLElement).click();
                done();
            }, 400);
        });
    });

    describe("Table cell merge -multiple row -multiple columns", () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        beforeEach(() => {
            rteObj = renderRTE({
                quickToolbarSettings: {
                    table: ['TableCell']
                },
                value: `"<p>Text</p><table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="e-cell-select" style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr></tbody></table><p>Editor</p>`
            });
            rteEle = rteObj.element;
        });
        afterEach(() => {
            destroy(rteObj);
        });
        it('Merge first two cell', (done: Function) => {
            let target = rteEle.querySelector('.e-rte-table td');
            let eventsArg = { pageX: 50, pageY: 300, target: target, which: 1 };
            (rteObj as any).mouseDownHandler(eventsArg);
            let ev = new MouseEvent("mousemove", {
                view: window,
                bubbles: true,
                cancelable: true
            });
            rteEle.querySelectorAll("td")[4].dispatchEvent(ev);
            (rteObj as any).mouseUp(eventsArg);
            setTimeout(function () {
                (document.querySelectorAll('.e-rte-quick-popup .e-toolbar-item button')[0] as HTMLElement).click();
                (document.querySelectorAll('.e-rte-dropdown-items.e-dropdown-popup ul .e-item')[0] as HTMLElement).click();
                done();
            }, 400);
        });
    });

    describe("Double time mousemove", () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        beforeEach(() => {
            rteObj = renderRTE({
                quickToolbarSettings: {
                    table: ['TableCell']
                },
                value: `"<p>Text</p><table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="e-cell-select" style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr></tbody></table><p>Editor</p>`
            });
            rteEle = rteObj.element;
        });
        afterEach(() => {
            destroy(rteObj);
        });
        it('Merge first two cell', (done: Function) => {
            let target = rteEle.querySelector('.e-rte-table td');
            let eventsArg = { pageX: 50, pageY: 300, target: target, which: 1 };
            (rteObj as any).mouseDownHandler(eventsArg);
            let ev = new MouseEvent("mousemove", {
                view: window,
                bubbles: true,
                cancelable: true
            });
            rteEle.querySelectorAll("td")[4].dispatchEvent(ev);
            (rteObj as any).mouseUp(eventsArg);
            (rteObj as any).mouseDownHandler(eventsArg);
            rteEle.querySelectorAll("td")[4].dispatchEvent(ev);
            (rteObj as any).mouseUp(eventsArg);
            setTimeout(function () {
                (document.querySelectorAll('.e-rte-quick-popup .e-toolbar-item button')[0] as HTMLElement).click();
                (document.querySelectorAll('.e-rte-dropdown-items.e-dropdown-popup ul .e-item')[0] as HTMLElement).click();
                done();
            }, 400);
        });
    });

    describe("Table cell horizontal spit -multiple row - multiple columns merged", () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        beforeEach(() => {
            rteObj = renderRTE({
                quickToolbarSettings: {
                    table: ['TableCell']
                },
                value: `"<p>Text</p><table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="e-cell-select" style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr></tbody></table><p>Editor</p>`
            });
            rteEle = rteObj.element;
        });
        afterEach(() => {
            destroy(rteObj);
        });
        it('Merge first two cell', (done: Function) => {
            var domSelection = new NodeSelection();
            let target = rteEle.querySelector('.e-rte-table td');
            let eventsArg = { pageX: 50, pageY: 300, target: target, which: 1 };
            (rteObj as any).mouseDownHandler(eventsArg);
            
            (rteObj as any).mouseUp(eventsArg);
            setTimeout(function () {
                let tableCell = document.querySelectorAll('tr')[1].querySelectorAll('td')[1];
                domSelection.setSelectionText(rteObj.contentModule.getDocument(), tableCell, tableCell, 0, 0);
                (document.querySelectorAll('.e-rte-quick-popup .e-toolbar-item button')[0] as HTMLElement).click();
                (document.querySelectorAll('.e-rte-dropdown-items.e-dropdown-popup ul .e-item')[1] as HTMLElement).click();
                done();
            }, 400);
        });
    });

    describe("Table cell horizontal spit -multiple row - multiple columns merged", () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        beforeEach(() => {
            rteObj = renderRTE({
                quickToolbarSettings: {
                    table: ['TableCell']
                },
                value: `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td style="width: 50%;" class="e-cell-select" colspan="2" rowspan="2"><br></td><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td></tr><tr><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td></tr><tr><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td></tr></tbody></table>`
            });
            rteEle = rteObj.element;
        });
        afterEach(() => {
            destroy(rteObj);
        });
        it('Merge first two cell', (done: Function) => {
            let domSelection = new NodeSelection();
            let target = rteEle.querySelector('.e-rte-table td');
            let eventsArg = { pageX: 50, pageY: 300, target: target, which: 1 };
            (rteObj as any).mouseDownHandler(eventsArg);
            
            (rteObj as any).mouseUp(eventsArg);
            setTimeout(function () {
                let tableCell = document.querySelectorAll('tr')[0].querySelectorAll('td')[0];
                domSelection.setSelectionText(rteObj.contentModule.getDocument(), tableCell, tableCell, 0, 0);
                (document.querySelectorAll('.e-rte-quick-popup .e-toolbar-item button')[0] as HTMLElement).click();
                (document.querySelectorAll('.e-rte-dropdown-items.e-dropdown-popup ul .e-item')[1] as HTMLElement).click();
                done();
            }, 400);
        });
    });

    describe("Table cell horizontal spit -multiple row - multiple columns merged", () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        beforeEach(() => {
            rteObj = renderRTE({
                quickToolbarSettings: {
                    table: ['TableCell']
                },
                value: `"<p>Text</p><table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="e-cell-select" style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr></tbody></table><p>Editor</p>`
            });
            rteEle = rteObj.element;
        });
        afterEach(() => {
            destroy(rteObj);
        });
        it('Merge first two cell', (done: Function) => {
            var domSelection = new NodeSelection();
            let target = rteEle.querySelector('.e-rte-table td');
            let eventsArg = { pageX: 50, pageY: 300, target: target, which: 1 };
            (rteObj as any).mouseDownHandler(eventsArg);
            
            (rteObj as any).mouseUp(eventsArg);
            setTimeout(function () {
                let tableCell = document.querySelectorAll('tr')[1].querySelectorAll('td')[1];
                domSelection.setSelectionText(rteObj.contentModule.getDocument(), tableCell, tableCell, 0, 0);
                (document.querySelectorAll('.e-rte-quick-popup .e-toolbar-item button')[0] as HTMLElement).click();
                (document.querySelectorAll('.e-rte-dropdown-items.e-dropdown-popup ul .e-item')[2] as HTMLElement).click();
                done();
            }, 400);
        });
    });

    describe("Table cell horizontal split", () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        beforeEach(() => {
            rteObj = renderRTE({
                quickToolbarSettings: {
                    table: ['TableCell']
                },
                value: `"<p>Text</p><table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="e-cell-select" style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr></tbody></table><p>Editor</p>`
            });
            rteEle = rteObj.element;
        });
        afterEach(() => {
            destroy(rteObj);
        });
        it('Split first cell', (done: Function) => {
            let target = rteEle.querySelector('.e-rte-table td');
            let eventsArg = { pageX: 50, pageY: 300, target: target, which: 1 };
            var domSelection = new NodeSelection();
            (rteObj as any).mouseDownHandler(eventsArg);
            (rteObj as any).mouseUp(eventsArg);
            setTimeout(function () {
                let tableCell = document.querySelectorAll('tr')[1].querySelectorAll('td')[1];
                domSelection.setSelectionText(rteObj.contentModule.getDocument(), tableCell, tableCell, 0, 0);
                (document.querySelectorAll('.e-rte-quick-popup .e-toolbar-item button')[0] as HTMLElement).click();
                (document.querySelectorAll('.e-rte-dropdown-items.e-dropdown-popup ul .e-item')[1] as HTMLElement).click();
                var table = rteEle.querySelector("table");
                var rows = table.rows;
                expect(table.rows.length).toBe(3);
                expect(table.rows[0].children.length).toBe(3);
                expect(table.rows[1].children.length).toBe(1);
                expect(table.rows[2].children.length).toBe(3);
                expect(rows[0].children[0].classList.contains("e-cell-select")).toEqual(true);
                expect((rows[0].children[0] as HTMLElement).style.width).toEqual("33.3333%");
                expect((rows[0].children[0] as HTMLElement).style.width).toEqual("33.3333%");
                expect((rows[0].children[1] as HTMLElement).style.width).toEqual("33.3333%");
                expect(rows[0].children[0].getAttribute("colspan")).toBe(null);
                expect(rows[0].children[0].getAttribute("rowspan")).toBe(null);
                expect(rows[0].children[1].getAttribute("colspan")).toBe(null);
                expect(rows[0].children[1].getAttribute("rowspan")).toBe("2");
                expect(rows[0].children[2].getAttribute("colspan")).toBe(null);
                expect(rows[0].children[2].getAttribute("rowspan")).toBe("2");
                done();
            }, 400);
        });
    });

    describe("Table cell vertical split", () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        beforeEach(() => {
            rteObj = renderRTE({
                quickToolbarSettings: {
                    table: ['TableCell']
                },
                value: `"<p>Text</p><table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="e-cell-select" style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr><tr><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td><td style="width: 33.3333%;"><br></td></tr></tbody></table><p>Editor</p>`
            });
            rteEle = rteObj.element;
        });
        afterEach(() => {
            destroy(rteObj);
        });
        it('Split first cell', (done: Function) => {
            let target = rteEle.querySelector('.e-rte-table td');
            let eventsArg = { pageX: 50, pageY: 300, target: target, which: 1 };
            var domSelection = new NodeSelection();
            (rteObj as any).mouseDownHandler(eventsArg);
            (rteObj as any).mouseUp(eventsArg);
            setTimeout(function () {
                var tableCell = document.querySelectorAll('tr')[1].querySelectorAll('td')[1];
                domSelection.setSelectionText(rteObj.contentModule.getDocument(), tableCell, tableCell, 0, 0);
                (document.querySelectorAll('.e-rte-quick-popup .e-toolbar-item button')[0] as HTMLElement).click();
                (document.querySelectorAll('.e-rte-dropdown-items.e-dropdown-popup ul .e-item')[2] as HTMLElement).click();
                var table = rteEle.querySelector("table");
                var rows = table.rows;
                expect(table.rows.length).toBe(2);
                expect(table.rows[0].children.length).toBe(4);
                expect(table.rows[1].children.length).toBe(3);
                expect((rows[0].children[0] as HTMLElement).style.width).toEqual("16.6667%");
                expect((rows[0].children[1] as HTMLElement).style.width).toEqual("16.6667%");
                expect((rows[0].children[2] as HTMLElement).style.width).toEqual("33.3333%");
                expect((rows[0].children[3] as HTMLElement).style.width).toEqual("33.3333%");
                expect(rows[0].children[0].classList.contains("e-cell-select")).toEqual(true);
                expect(rows[0].children[0].getAttribute("colspan")).toBe(null);
                expect(rows[0].children[0].getAttribute("rowspan")).toBe(null);
                expect(rows[0].children[1].getAttribute("colspan")).toBe(null);
                expect(rows[0].children[1].getAttribute("rowspan")).toBe(null);
                expect(rows[0].children[2].getAttribute("colspan")).toBe(null);
                expect(rows[0].children[2].getAttribute("rowspan")).toBe(null);
                expect(rows[0].children[3].getAttribute("colspan")).toBe(null);
                expect(rows[0].children[3].getAttribute("rowspan")).toBe(null);
                //expect(rows[1].children[0].getAttribute("colspan")).toBe("2");
                expect(rows[1].children[0].getAttribute("rowspan")).toBe(null);
                expect(rows[1].children[1].getAttribute("colspan")).toBe(null);
                expect(rows[1].children[1].getAttribute("rowspan")).toBe(null);
                expect(rows[1].children[2].getAttribute("colspan")).toBe(null);
                expect(rows[1].children[2].getAttribute("rowspan")).toBe(null);
                done();
            }, 400);
        });
    });

    describe("Delete Row with single row", () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        beforeEach(() => {
            rteObj = renderRTE({
                value: `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="e-cell-select" style="width: 25%;"><br></td><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td></tr></tbody></table><p><br></p>`
            });
            rteEle = rteObj.element;
        });
        afterEach(() => {
            destroy(rteObj);
        });
        it('Delete First Row', (done: Function) => {
            let target = rteEle.querySelector('.e-rte-table td');
            let eventsArg = { pageX: 50, pageY: 300, target: target, which: 1 };
            var domSelection = new NodeSelection();
            (rteObj as any).mouseDownHandler(eventsArg);
            (rteObj as any).mouseUp(eventsArg);
            setTimeout(function () {
                let tableCell = document.querySelectorAll('tr')[0].querySelectorAll('td')[0];
                domSelection.setSelectionText(rteObj.contentModule.getDocument(), tableCell, tableCell, 0, 0);
                (document.querySelectorAll('.e-rte-quick-popup .e-toolbar-item button')[1] as HTMLElement).click();
                (document.querySelectorAll('.e-rte-dropdown-items.e-dropdown-popup ul .e-item')[2] as HTMLElement).click();
                var table = rteEle.querySelector("table");
                expect(table).toBe(null);
                done();
            }, 400);
        });
    });

    describe("Delete Column with single Column", () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        beforeEach(() => {
            rteObj = renderRTE({
                value: `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td style="width: 100%;" class="e-cell-select"><br></td></tr><tr><td style="width: 100%;"><br></td></tr></tbody></table><p><br></p>`
            });
            rteEle = rteObj.element;
        });
        afterEach(() => {
            destroy(rteObj);
        });
        it('Delete First Column', (done: Function) => {
            let target = rteEle.querySelector('.e-rte-table td');
            let eventsArg = { pageX: 50, pageY: 300, target: target, which: 1 };
            var domSelection = new NodeSelection();
            (rteObj as any).mouseDownHandler(eventsArg);
            (rteObj as any).mouseUp(eventsArg);
            setTimeout(function () {
                let tableCell = document.querySelectorAll('tr')[0].querySelectorAll('td')[0];
                domSelection.setSelectionText(rteObj.contentModule.getDocument(), tableCell, tableCell, 0, 0);
                (document.querySelectorAll('.e-rte-quick-popup .e-toolbar-item button')[2] as HTMLElement).click();
                (document.querySelectorAll('.e-rte-dropdown-items.e-dropdown-popup ul .e-item')[2] as HTMLElement).click();
                var table = rteEle.querySelector("table");
                expect(table).toBe(null);
                done();
            }, 400);
        });
    });


    describe("Delete row", () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        beforeEach(() => {
            rteObj = renderRTE({
                value: `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="" style="width: 25%;"><br></td><td style="width: 50%;" class="" colspan="2" rowspan="2"><br></td><td style="width: 25%;" class="e-cell-select"><br></td></tr><tr><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td></tr><tr><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td></tr></tbody></table><p><br></p>`
            });
            rteEle = rteObj.element;
        });
        afterEach(() => {
            destroy(rteObj);
        });
        it('Delete First row with rowspan', (done: Function) => {
            let target = rteEle.querySelector('.e-rte-table td');
            let eventsArg = { pageX: 50, pageY: 300, target: target, which: 1 };
            var domSelection = new NodeSelection();
            (rteObj as any).mouseDownHandler(eventsArg);
            (rteObj as any).mouseUp(eventsArg);
            setTimeout(function () {
                let tableCell = document.querySelectorAll('tr')[0].querySelectorAll('td')[2];
                domSelection.setSelectionText(rteObj.contentModule.getDocument(), tableCell, tableCell, 0, 0);
                (document.querySelectorAll('.e-rte-quick-popup .e-toolbar-item button')[1] as HTMLElement).click();
                (document.querySelectorAll('.e-rte-dropdown-items.e-dropdown-popup ul .e-item')[2] as HTMLElement).click();
                var table = rteEle.querySelector("table");
                done();
            }, 400);
        });
    });

    describe("Insert row", () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        beforeEach(() => {
            rteObj = renderRTE({
                value: `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="" style="width: 25%;"><br></td><td style="width: 50%;" class="" colspan="2" rowspan="2"><br></td><td style="width: 25%;" class="e-cell-select"><br></td></tr><tr><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td></tr><tr><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td><td style="width: 25%;"><br></td></tr></tbody></table><p><br></p>`
            });
            rteEle = rteObj.element;
        });
        afterEach(() => {
            destroy(rteObj);
        });
        it('Delete First row with rowspan', (done: Function) => {
            let target = rteEle.querySelector('.e-rte-table td');
            let eventsArg = { pageX: 50, pageY: 300, target: target, which: 1 };
            var domSelection = new NodeSelection();
            (rteObj as any).mouseDownHandler(eventsArg);
            (rteObj as any).mouseUp(eventsArg);
            setTimeout(function () {
                let tableCell = document.querySelectorAll('tr')[0].querySelectorAll('td')[2];
                domSelection.setSelectionText(rteObj.contentModule.getDocument(), tableCell, tableCell, 0, 0);
                (document.querySelectorAll('.e-rte-quick-popup .e-toolbar-item button')[1] as HTMLElement).click();
                (document.querySelectorAll('.e-rte-dropdown-items.e-dropdown-popup ul .e-item')[1] as HTMLElement).click();
                var table = rteEle.querySelector("table");
                done();
            }, 400);
        });
    });
    describe("EJ2-46995 - Resizing a table column and dragging over another table will resize the another table column", () => {
        let rteObj: RichTextEditor;
        let rteEle: HTMLElement;
        beforeEach(() => {
            rteObj = renderRTE({
                value: `<table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="" style="width: 20%;"><br></td><td style="width: 20%;"><br></td><td style="width: 20%;"><br></td><td style="width: 20%;"><br></td><td style="width: 20%;"><br></td></tr><tr><td style="width: 20%;"><br></td><td style="width: 20%;"><br></td><td style="width: 20%;"><br></td><td style="width: 20%;"><br></td><td style="width: 20%;"><br></td></tr></tbody></table><p>Sample</p><p>Text</p><table class="e-rte-table" style="width: 100%; min-width: 0px;"><tbody><tr><td class="" style="width: 20%;"><br></td><td style="width: 20%;"><br></td><td style="width: 20%;"><br></td><td style="width: 20%;"><br></td><td style="width: 20%;"><br></td></tr><tr><td style="width: 20%;"><br></td><td style="width: 20%;"><br></td><td style="width: 20%;"><br></td><td style="width: 20%;"><br></td><td style="width: 20%;"><br></td></tr><tr><td style="width: 20%;"><br></td><td style="width: 20%;"><br></td><td style="width: 20%;"><br></td><td style="width: 20%;"><br></td><td style="width: 20%;"><br></td></tr></tbody></table><p><br></p>`
            });
            rteEle = rteObj.element;
        });
        afterEach(() => {
            destroy(rteObj);
        });
        it('While hover another table resize helper element availability testing ', () => {
            let table: Element = rteObj.contentModule.getEditPanel().querySelectorAll('table')[0];
            expect(table.querySelectorAll('tr').length === 2).toBe(true);
            expect(table.querySelectorAll('td').length === 10).toBe(true);
            (rteObj.tableModule as any).resizeHelper({ target: table, preventDefault: function () { } });
            expect(rteObj.contentModule.getEditPanel().querySelectorAll('.e-column-resize').length === 4).toBe(true);
            expect(rteObj.contentModule.getEditPanel().querySelectorAll('.e-row-resize').length === 2).toBe(true);
            expect(rteObj.contentModule.getEditPanel().querySelectorAll('.e-table-box').length === 1).toBe(true);
            table = rteObj.contentModule.getEditPanel().querySelectorAll('table')[1];
            expect(table.querySelectorAll('tr').length === 3).toBe(true);
            expect(table.querySelectorAll('td').length === 15).toBe(true);
            (rteObj.tableModule as any).resizeHelper({ target: table, preventDefault: function () { } });
            expect(rteObj.contentModule.getEditPanel().querySelectorAll('.e-column-resize').length === 4).toBe(true);
            expect(rteObj.contentModule.getEditPanel().querySelectorAll('.e-row-resize').length === 3).toBe(true);
            expect(rteObj.contentModule.getEditPanel().querySelectorAll('.e-table-box').length === 1).toBe(true);
        });
    });
});
