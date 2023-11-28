/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Dialog actions spec
 */
import { Kanban, KanbanModel, EJ2Instance, ActionEventArgs } from '../../src/kanban/index';
import { kanbanData } from './common/kanban-data.spec';
import { profile, inMB, getMemoryProfile } from './common/common.spec';
import * as util from './common/util.spec';

Kanban.Inject();

describe('Dialog actions module', () => {
    beforeAll(() => {
        const isDef: (o: any) => boolean = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            // eslint-disable-next-line no-console
            console.log('Unsupported environment, window.performance.memory is unavailable');
            (this as any).skip(); //Skips test (in Chai)
            return;
        }
    });

    describe('Editor Rendering', () => {
        let kanbanObj: Kanban;
        let element1: HTMLElement;
        let element2: HTMLElement;
        const isDoubleClick: boolean = true;
        let data: Record<string, any>;
        const e: any = { preventDefault: () => { /** */ } };
        let columnKey: string;
        beforeAll((done: DoneFn) => {
            const model: KanbanModel = {
                dialogSettings: {
                    fields: [
                        { text: 'ID', key: 'Id', type: 'Numeric' },
                        { key: 'Status', type: 'DropDown' },
                        { key: 'Assignee', type: 'DropDown' },
                        { key: 'Estimate', type: 'Numeric' },
                        { key: 'Summary', type: 'TextArea' }
                    ]
                }
            };
            kanbanObj = util.createKanban(model, kanbanData, done);
        });

        afterAll(() => {
            util.destroy(kanbanObj);
        });

        it('openEditor method testing', () => {
            kanbanObj.dialogModule.openDialog('Add');
            expect(document.querySelectorAll('.e-kanban-dialog.e-dialog').length).toEqual(1);
            (document.querySelector('.e-kanban-dialog.e-dialog .e-dlg-closeicon-btn') as HTMLElement).click();
            expect(document.querySelectorAll('.e-kanban-dialog.e-dialog').length).toEqual(0);
        });

        it('Card double click event testing', () => {
            element1 = kanbanObj.element.querySelector('.e-card[data-id="5"]') as HTMLElement;
            util.triggerMouseEvent(element1, 'dblclick');
            data = kanbanObj.getCardDetails(element1);
            expect(kanbanObj.activeCardData.data).toBe(data);
            expect(kanbanObj.activeCardData.element).toBe(element1);
        });
        it('Basic layout dialog testing - dialog container testing', () => {
            const ele: HTMLElement = document.querySelector('.e-dlg-container') as HTMLElement;
            expect(ele.classList.contains('e-dlg-center-center')).toBeTruthy();
        });
        it('Basic layout dialog testing - dialog container child elements testing', () => {
            const ele: HTMLElement = document.querySelector('.e-dlg-container') as HTMLElement;
            expect(ele.childElementCount).toBe(2);
            expect(ele.firstElementChild.classList.contains('e-kanban-dialog')).toBe(true);
            expect(ele.lastElementChild.classList.contains('e-dlg-overlay')).toBe(true);
        });
        it('Basic layout dialog testing - dialog wrapper testing', () => {
            const ele: HTMLElement = document.querySelector('#Kanban_dialog_wrapper') as HTMLElement;
            expect(ele.childElementCount).toBe(3);
            expect(ele.firstElementChild.classList.contains('e-dlg-header-content')).toBe(true);
            expect(ele.children[1].classList.contains('e-dlg-content')).toBe(true);
            expect(ele.children[1].getAttribute('id')).toBe('Kanban_dialog_wrapper_dialog-content');
            expect(ele.lastElementChild.classList.contains('e-footer-content')).toBe(true);
        });
        it('Basic layout dialog testing - dialog header testing', () => {
            const ele: HTMLElement = document.querySelector('.e-dlg-header-content') as HTMLElement;
            expect(ele.childElementCount).toBe(2);
            expect(ele.firstElementChild.classList.contains('e-dlg-closeicon-btn')).toBe(true);
            expect(ele.firstElementChild.getAttribute('title')).toBe('Close');
            expect(ele.firstElementChild.firstElementChild.classList.contains('e-icon-dlg-close')).toBe(true);
            expect(ele.lastElementChild.classList.contains('e-dlg-header')).toBe(true);
            expect(ele.lastElementChild.getAttribute('id')).toBe('Kanban_dialog_wrapper_title');
            expect(ele.lastElementChild.innerHTML).toBe('Edit Card Details');
        });
        it('Basic layout dialog testing - dialog outer content testing', () => {
            const ele: HTMLElement = document.querySelector('#Kanban_dialog_wrapper_dialog-content') as HTMLElement;
            expect(ele.firstElementChild.classList.contains('e-kanban-form-wrapper')).toBe(true);
            expect(ele.firstElementChild.firstElementChild.classList.contains('e-kanban-form')).toBe(true);
            expect(ele.firstElementChild.firstElementChild.tagName).toBe('FORM');
            expect(ele.firstElementChild.firstElementChild.getAttribute('id')).toBe('KanbanEditForm');
            expect(ele.firstElementChild.firstElementChild.firstElementChild.classList.contains('e-kanban-dialog-content')).toBe(true);
        });
        it('Basic layout dialog testing - dialog inner td and tr content testing', () => {
            const ele: HTMLElement = document.querySelector('#KanbanEditForm table') as HTMLElement;
            expect(ele.childElementCount).toBe(5);
            for (let i: number = 0; i < ele.childElementCount; i++) {
                expect(ele.children[i].tagName).toBe('TR');
                expect(ele.children[i].childElementCount).toBe(2);
                expect(ele.children[i].children[0].tagName).toBe('TD');
                expect(ele.children[i].children[0].classList.contains('e-label')).toBe(true);
                expect(ele.children[i].children[1].tagName).toBe('TD');
            }
        });
        it('Basic layout dialog testing - dialog inner first tr content testing', () => {
            const ele: HTMLElement = document.querySelector('#KanbanEditForm table tr') as HTMLElement;
            expect(ele.children[1].firstElementChild.classList.contains('Id_wrapper')).toBe(true);
        });
        it('Basic layout dialog testing - dialog footer content testing', () => {
            const ele: HTMLElement = document.querySelector('#Kanban_dialog_wrapper .e-footer-content') as HTMLElement;
            expect(ele.childElementCount).toBe(3);
            expect(ele.firstElementChild.classList.contains('e-dialog-delete')).toBe(true);
            expect(ele.lastElementChild.classList.contains('e-dialog-cancel')).toBe(true);
            expect(ele.children[1].classList.contains('e-dialog-edit')).toBe(true);
            expect(ele.children[1].classList.contains('e-primary')).toBe(true);
            (document.querySelector('.e-kanban-dialog.e-dialog .e-dlg-closeicon-btn') as HTMLElement).click();
        });
        it('Update card testing - before editing', () => {
            element1 = kanbanObj.element.querySelector('.e-card[data-id="2"]') as HTMLElement;
            data = kanbanObj.getCardDetails(element1);
            columnKey = data[kanbanObj.keyField] as string;
            expect(columnKey).toEqual('InProgress');
            if (!isDoubleClick) {
                kanbanObj.cardDoubleClick = () => { /** */ };
            }
            util.triggerMouseEvent(element1, 'dblclick');
        });
        it('Update card testing - after editing', (done: Function) => {
            const dropDownEle: HTMLElement = document.querySelector('.Status_wrapper .e-dropdownlist') as HTMLElement;
            const dropDownObj: any = (dropDownEle as EJ2Instance).ej2_instances[0];
            dropDownObj.showPopup();
            setTimeout(() => {
                expect(dropDownObj.inputWrapper.container.getAttribute('aria-activedescendant')).not.toBeNull();
                const items: Element[] = dropDownObj.popupObj.element.querySelectorAll('li');
                dropDownObj.setSelection(items[0], e);
                dropDownObj.hidePopup();
                done();
            }, 1000);
        });
        it('Update card testing - after editing', (done: DoneFn) => {
            kanbanObj.dataBound = () => {
                data = kanbanObj.getCardDetails(element1);
                columnKey = data[kanbanObj.keyField] as string;
                expect(columnKey).toEqual('Open');
                done();
            };
            const ele: HTMLElement = document.querySelector('.e-dialog-edit') as HTMLElement;
            ele.click();
        });
        it('Delete the card testing - before open dialog', () => {
            element2 = kanbanObj.element.querySelector('.e-card[data-id="6"]') as HTMLElement;
            data = kanbanObj.getCardDetails(element2);
            columnKey = data[kanbanObj.keyField] as string;
            expect(columnKey).toEqual('Close');
            expect(data).not.toBeNull();
            util.triggerMouseEvent(element2, 'dblclick');
        });
        it('Delete the card testing - press the delete button', () => {
            const ele: HTMLElement = document.querySelector('.e-dialog-delete') as HTMLElement;
            ele.click();
        });

        it('Delete the card testing - press the delete button', (done: DoneFn) => {
            kanbanObj.dataBound = () => {
                data = kanbanObj.getCardDetails(element2);
                expect(data).toBeUndefined();
                done();
            };
            const ele: HTMLElement = document.querySelector('.e-dialog-yes') as HTMLElement;
            ele.click();
        });

        it('Cancel the editing', () => {
            const element3: HTMLElement = kanbanObj.element.querySelector('.e-card[data-id="14"]') as HTMLElement;
            util.triggerMouseEvent(element3, 'dblclick');
            const ele: HTMLElement = document.querySelector('.e-dialog-cancel') as HTMLElement;
            ele.click();
        });
    });

    describe('EJ2-49463- Kanban edit dialog element not removed when "args.cancel" is set to true', () => {
        let kanbanObj: Kanban;
        let element1: HTMLElement;
        beforeAll((done: DoneFn) => {
            const model: KanbanModel = {
                dialogSettings: {
                    fields: [
                        { text: 'ID', key: 'Id', type: 'Numeric' },
                        { key: 'Status', type: 'DropDown' },
                        { key: 'Assignee', type: 'DropDown' },
                        { key: 'Estimate', type: 'Numeric' },
                        { key: 'Summary', type: 'TextArea' }
                    ]
                },
                dialogOpen: function (args : any) {
                    args.cancel = true;
                }
            };
            kanbanObj = util.createKanban(model, kanbanData, done);
        });

        afterAll(() => {
            util.destroy(kanbanObj);
        });
        it('Checking the dialog element removed, when double clicked on cards to open', () => {
            element1 = kanbanObj.element.querySelector('.e-card[data-id="5"]') as HTMLElement;
            util.triggerMouseEvent(element1, 'dblclick');
            expect((kanbanObj.dialogModule as any).element).toBe(null);
            util.triggerMouseEvent(element1, 'dblclick');
            expect((kanbanObj.dialogModule as any).element).toBe(null);
        });
    });

    describe('EJ2CORE-561- Card data changed even when the editing is canceled in the dialog(card editing)', () => {
        let kanbanObj: Kanban;
        let element1: HTMLElement;
        beforeAll((done: DoneFn) => {
            const model: KanbanModel = {
                dialogSettings: {
                    fields: [
                        { text: 'ID', key: 'Id', type: 'Numeric' },
                        { key: 'Status', type: 'DropDown' },
                        { key: 'Assignee', type: 'DropDown' },
                        { key: 'Estimate', type: 'Numeric' },
                        { key: 'Summary', type: 'TextArea' }
                    ]
                }
            };
            kanbanObj = util.createKanban(model, kanbanData, done);
        });

        afterAll(() => {
            util.destroy(kanbanObj);
            (document.querySelector('.e-dialog.e-kanban-dialog') as HTMLElement).parentElement.remove();
        });
        it('Checking the value prevented on cancel button click', (done: Function) => {
            element1 = kanbanObj.element.querySelector('.e-card[data-id="5"]') as HTMLElement;
            util.triggerMouseEvent(element1, 'dblclick');
            (kanbanObj.dialogModule as any).element.querySelector('textarea').value = "Changed";
            (kanbanObj.dialogModule as any).element.querySelector('.e-dialog-cancel').click();
            util.triggerMouseEvent(element1, 'dblclick');
            expect((kanbanObj.dialogModule as any).element.querySelector('textarea').value !== "Changed").toBe(true);
            done();
        });
    });

    describe('EJ2CORE-561- Card data changed even when the editing is canceled in the dialog(card editing)', () => {
        let kanbanObj: Kanban;
        let element1: HTMLElement;
        beforeAll((done: DoneFn) => {
            const model: KanbanModel = {
                dialogSettings: {
                    fields: [
                        { text: 'ID', key: 'Id', type: 'Numeric' },
                        { key: 'Status', type: 'DropDown' },
                        { key: 'Assignee', type: 'DropDown' },
                        { key: 'Estimate', type: 'Numeric' },
                        { key: 'Summary', type: 'TextArea' }
                    ]
                }
            };
            kanbanObj = util.createKanban(model, kanbanData, done);
        });

        afterAll(() => {
            util.destroy(kanbanObj);
        });
        it('Checking the value saved on save button click', (done: Function) => {
            element1 = kanbanObj.element.querySelector('.e-card[data-id="5"]') as HTMLElement;
            util.triggerMouseEvent(element1, 'dblclick');
            (kanbanObj.dialogModule as any).element.querySelector('textarea').value = "Changed";
            (kanbanObj.dialogModule as any).element.querySelector('.e-dialog-edit').click();            
            expect((kanbanObj as any).element.querySelector('.e-card[data-id="5"]').querySelector('.e-card-content').innerText === "Changed").toBe(true);
            done();
        });
    });

    describe('EJ2CORE-561- Card data changed even when the editing is canceled in the dialog(card editing)', () => {
        let kanbanObj: Kanban;
        let element1: HTMLElement;
        beforeAll((done: DoneFn) => {
            const model: KanbanModel = {
                dialogSettings: {
                    fields: [
                        { text: 'ID', key: 'Id', type: 'Numeric' },
                        { key: 'Status', type: 'DropDown' },
                        { key: 'Assignee', type: 'DropDown' },
                        { key: 'Estimate', type: 'Numeric' },
                        { key: 'Summary', type: 'TextArea' }
                    ]
                }
            };
            kanbanObj = util.createKanban(model, kanbanData, done);
        });

        afterAll(() => {
            util.destroy(kanbanObj);
        });
        it('Checking the value not saved on esc icon click', (done: Function) => {
            element1 = kanbanObj.element.querySelector('.e-card[data-id="5"]') as HTMLElement;
            util.triggerMouseEvent(element1, 'dblclick');
            (kanbanObj.dialogModule as any).element.querySelector('textarea').value = "Changed";
            (kanbanObj.dialogModule as any).element.querySelector('.e-dlg-closeicon-btn').click();            
            expect((kanbanObj as any).element.querySelector('.e-card[data-id="5"]').querySelector('.e-card-content').innerText !== "Changed").toBe(true);
            done();
        });
    });

    // describe('Public method Editor', () => {
    //     let kanbanObj: Kanban;
    //     beforeAll((done: DoneFn) => {
    //         let model: KanbanModel = {
    //             dialogSettings: {
    //                 fields: [
    //                     { text: 'ID', key: 'Id', type: 'TextBox' },
    //                     { key: 'Status', type: 'DropDown' },
    //                     { key: 'Assignee', type: 'TextBox', validationRules: { required: true } },
    //                     { key: 'Estimate', type: 'Numeric', validationRules: { range: [0, 1000] } },
    //                     { key: 'Summary', type: 'TextBox', validationRules: { required: true } }
    //                 ]
    //             },
    //         };
    //         kanbanObj = util.createKanban(model, kanbanData, done);
    //     });

    //     afterAll(() => {
    //         util.destroy(kanbanObj);
    //     });

    //     it('openEditor add method testing', (done: DoneFn) => {
    //         expect(kanbanObj.kanbanData.length).toBe(75);
    //         kanbanObj.dataBound = () => {
    //             expect(kanbanObj.kanbanData.length).toBe(76);
    //             done();
    //         };
    //         kanbanObj.crudModule.addCard({ 'Id': 333, 'Status': 'Close', 'Summary': 'Check the cards', 'Assignee': 'Andrew Fuller' });
    //     });
    //     it('openEditor update method testing', (done: DoneFn) => {
    //         expect(kanbanObj.kanbanData.length).toBe(76);
    //         kanbanObj.dataBound = () => {
    //             let element: HTMLElement = kanbanObj.element.querySelector('.e-card[data-id="2"]') as HTMLElement;
    //             let data: { [key: string]: Object } = kanbanObj.getCardDetails(element) as { [key: string]: Object };
    //             let status: Object = data[kanbanObj.keyField];
    //             expect(status).toBe('Close');
    //             done();
    //         };
    //         kanbanObj.crudModule.updateCard({ 'Id': 2, 'Status': 'Close', 'Summary': 'Check the cards', 'Assignee': 'Andrew Fuller' });
    //     });
    //     it('openEditor delete method testing', (done: DoneFn) => {
    //         kanbanObj.dataBound = () => {
    //             expect(kanbanObj.kanbanData.length).toBe(75);
    //             done();
    //         };
    //         kanbanObj.crudModule.deleteCard(8);
    //     });
    // });

    // describe('Public method Editor using array value', () => {
    //     let kanbanObj: Kanban;
    //     beforeAll((done: DoneFn) => {
    //         let model: KanbanModel = {
    //             dialogSettings: {
    //                 fields: [
    //                     { text: 'ID', key: 'Id', type: 'TextBox' },
    //                     { key: 'Status', type: 'DropDown' },
    //                     { key: 'Assignee', type: 'TextBox', validationRules: { required: true } },
    //                     { key: 'Estimate', type: 'Numeric', validationRules: { range: [0, 1000] } },
    //                     { key: 'Summary', type: 'TextBox', validationRules: { required: true } }
    //                 ]
    //             },
    //         };
    //         kanbanObj = util.createKanban(model, kanbanData, done);
    //     });

    //     afterAll(() => {
    //         util.destroy(kanbanObj);
    //     });

    //     it('openEditor add method testing', (done: DoneFn) => {
    //         expect(kanbanObj.kanbanData.length).toBe(75);
    //         kanbanObj.dataBound = () => {
    //             expect(kanbanObj.kanbanData.length).toBe(76);
    //             done();
    //         };
    //         kanbanObj.crudModule.addCard([{ 'Id': 334, 'Status': 'Close', 'Summary': 'Check the cards', 'Assignee': 'Andrew Fuller' }]);
    //     });
    //     it('openEditor update method testing', (done: DoneFn) => {
    //         kanbanObj.dataBound = () => {
    //             let element: HTMLElement = kanbanObj.element.querySelector('.e-card[data-id="6"]') as HTMLElement;
    //             let data: { [key: string]: Object } = kanbanObj.getCardDetails(element) as { [key: string]: Object };
    //             let status: Object = data[kanbanObj.keyField];
    //             expect(status).toBe('Open');
    //             done();
    //         };
    //         kanbanObj.crudModule.updateCard([{ 'Id': 6, 'Status': 'Open', 'Summary': 'Check the cards', 'Assignee': 'Andrew Fuller' }]);
    //     });
    //     it('openEditor delete method testing', (done: DoneFn) => {
    //         kanbanObj.dataBound = () => {
    //             expect(kanbanObj.kanbanData.length).toBe(74);
    //             done();
    //         };
    //         kanbanObj.crudModule.deleteCard([{ 'Id': 5 }, { 'Id': 13 }]);
    //     });
    // });

    describe('Public method Editor with cancel events', () => {
        let kanbanObj: Kanban;
        beforeAll((done: DoneFn) => {
            const model: KanbanModel = {
                dialogSettings: {
                    fields: [
                        { text: 'ID', key: 'Id', type: 'TextBox' },
                        { key: 'Status', type: 'DropDown' },
                        { key: 'Assignee', type: 'TextBox', validationRules: { required: true } },
                        { key: 'Estimate', type: 'Numeric', validationRules: { range: [0, 1000] } },
                        { key: 'Summary', type: 'TextBox', validationRules: { required: true } }
                    ]
                }
            };
            kanbanObj = util.createKanban(model, kanbanData, done);
        });

        afterAll(() => {
            util.destroy(kanbanObj);
        });

        it('openEditor add method testing', () => {
            expect(kanbanObj.kanbanData.length).toBe(75);
            kanbanObj.actionBegin = (args: ActionEventArgs) => {
                if (args.requestType === 'cardCreate') {
                    args.cancel = true;
                }
            };
            kanbanObj.crudModule.addCard([{ 'Id': 334, 'Status': 'Close', 'Summary': 'Check the cards', 'Assignee': 'Andrew Fuller' }]);
        });
        it('openEditor update method testing', () => {
            expect(kanbanObj.kanbanData.length).toBe(75);
            kanbanObj.actionBegin = (args: ActionEventArgs) => {
                if (args.requestType === 'cardChange') {
                    args.cancel = true;
                }
            };
            kanbanObj.crudModule.updateCard([{ 'Id': 2, 'Status': 'Open', 'Summary': 'Check the cards', 'Assignee': 'Andrew Fuller' }]);
        });
        it('openEditor delete method testing', () => {
            expect(kanbanObj.kanbanData.length).toBe(75);
            kanbanObj.actionBegin = (args: ActionEventArgs) => {
                if (args.requestType === 'cardRemove') {
                    args.cancel = true;
                }
            };
            kanbanObj.crudModule.deleteCard(2);
        });
        it('card double click', () => {
            const element: HTMLElement = kanbanObj.element.querySelector('.e-card[data-id="5"]') as HTMLElement;
            util.triggerMouseEvent(element, 'dblclick');
        });
        it('Click delete button', () => {
            const ele: HTMLElement = document.querySelector('.e-dialog-delete') as HTMLElement;
            ele.click();
        });
        it('Click dialog no button', () => {
            const ele: HTMLElement = document.querySelector('.e-dialog-no') as HTMLElement;
            ele.click();
        });
        it('Dialog close button clicked', () => {
            (document.querySelector('.e-kanban-dialog.e-dialog .e-dlg-closeicon-btn') as HTMLElement).click();
            expect(document.querySelectorAll('.e-kanban-dialog.e-dialog').length).toEqual(0);
        });
    });

    describe('Dialog form validation', () => {
        let kanbanObj: Kanban;
        beforeAll((done: DoneFn) => {
            const model: KanbanModel = {
                dialogSettings: {
                    fields: [
                        { text: 'ID', key: 'Id', type: 'TextBox' },
                        { key: 'Status', type: 'DropDown' },
                        { key: 'Assignee', type: 'TextBox', },
                        { key: 'Estimate', type: 'Numeric', validationRules: { range: [0, 100] } },
                        { key: 'Summary', type: 'TextBox', validationRules: { required: true } }
                    ]
                }
            };
            kanbanObj = util.createKanban(model, kanbanData, done);
        });

        afterAll(() => {
            util.destroy(kanbanObj);
        });

        it('clicking the Card to open popup', () => {
            let ele: HTMLElement = kanbanObj.element.querySelector('.e-card[data-id="4"]') as HTMLElement;
            util.triggerMouseEvent(ele, 'dblclick');
        });

        it('updating the value in dialog popup', () => {
            expect(document.querySelector('.e-dialog.e-kanban-dialog.e-popup-open')).not.toBeNull;
            expect((document.querySelector('.e-numerictextbox.e-input') as any).value).not.toBeNull;
            let element = (document.getElementsByClassName('e-numerictextbox')[0] as EJ2Instance);
            expect(document.querySelector('.e-error')).toBeNull;
            (element.ej2_instances[0] as any).value = 111;
            kanbanObj.dataBound();
        });

        it('Check tooltip is created or not', () => {
            expect((document.querySelector('.e-numerictextbox.e-input') as any).value).toEqual('111.00');
            let saveButton: HTMLElement = document.querySelector('.e-control.e-btn.e-lib.e-flat.e-dialog-edit.e-primary');
            util.triggerMouseEvent(saveButton, 'click');
        });

        it('Updating new value', () => {
            expect(document.getElementById("Estimate-info")).not.toBeNull;
            let element = (document.getElementsByClassName('e-numerictextbox')[0] as EJ2Instance);
            (element.ej2_instances[0] as any).value = 99;
            kanbanObj.dataBound();
        });

        it('clicking the save button to save data', (done: Function) => {
            let saveButton: HTMLElement = document.querySelector('.e-control.e-btn.e-lib.e-flat.e-dialog-edit.e-primary');
            util.triggerMouseEvent(saveButton, 'click');
            setTimeout(() => {
                expect(document.querySelector('.e-dialog.e-kanban-dialog')).toBeNull;
                done();
            }, 500);
        });
    });

    describe('EJ2-50533 - Card is not in selected state after the edit card dialog is closed on save button', () => {
        let kanbanObj: Kanban;
        beforeAll((done: DoneFn) => {
            const model: KanbanModel = {
                dialogSettings: {
                    fields: [
                        { text: 'ID', key: 'Id', type: 'TextBox' },
                        { key: 'Status', type: 'DropDown' },
                        { key: 'Assignee', type: 'TextBox', },
                        { key: 'Estimate', type: 'Numeric', validationRules: { range: [0, 100] } },
                        { key: 'Summary', type: 'TextBox', validationRules: { required: true } }
                    ]
                },
                cardSettings: {
                    headerField: 'Id',
                    selectionType: 'Single'
                }
            };
            kanbanObj = util.createKanban(model, kanbanData, done);
        });

        afterAll(() => {
            util.destroy(kanbanObj);
        });

        it('Card click action event args as false', () => {
            let ele: HTMLElement = kanbanObj.element.querySelector('.e-card[data-id="4"]') as HTMLElement;
            expect(ele.classList.contains('e-selection')).toEqual(false);
            util.triggerMouseEvent(ele, 'click');
            expect(ele.classList.contains('e-selection')).toEqual(true);
        });

        it('Click Card to open', () => {
            let ele: HTMLElement = kanbanObj.element.querySelector('.e-card[data-id="4"]') as HTMLElement;
            util.triggerMouseEvent(ele, 'dblclick');
        });

        it('Updating new value', () => {
            expect(document.getElementById("Estimate-info")).not.toBeNull;
            let element = (document.getElementsByClassName('e-numerictextbox')[0] as EJ2Instance);
            (element.ej2_instances[0] as any).value = 99;
            kanbanObj.dataBound();
        });

        it('clicking the save button to save data', () => {
            let saveButton: HTMLElement = document.querySelector('.e-control.e-btn.e-lib.e-flat.e-dialog-edit.e-primary');
            util.triggerMouseEvent(saveButton, 'click');
            let ele: HTMLElement = kanbanObj.element.querySelector('.e-card[data-id="4"]') as HTMLElement;
            expect(ele.classList.contains('e-selection')).toEqual(true);
        });
    });

    describe('EJ2-50533 - Card is not in selected state after the edit card dialog is closed on cancel button', () => {
        let kanbanObj: Kanban;
        beforeAll((done: DoneFn) => {
            const model: KanbanModel = {
                dialogSettings: {
                    fields: [
                        { text: 'ID', key: 'Id', type: 'TextBox' },
                        { key: 'Status', type: 'DropDown' },
                        { key: 'Assignee', type: 'TextBox', },
                        { key: 'Estimate', type: 'Numeric', validationRules: { range: [0, 100] } },
                        { key: 'Summary', type: 'TextBox', validationRules: { required: true } }
                    ]
                },
                cardSettings: {
                    headerField: 'Id',
                    selectionType: 'Single'
                }
            };
            kanbanObj = util.createKanban(model, kanbanData, done);
        });

        afterAll(() => {
            util.destroy(kanbanObj);
        });

        it('Card click action event args as false', () => {
            let ele: HTMLElement = kanbanObj.element.querySelector('.e-card[data-id="4"]') as HTMLElement;
            expect(ele.classList.contains('e-selection')).toEqual(false);
            util.triggerMouseEvent(ele, 'click');
            expect(ele.classList.contains('e-selection')).toEqual(true);
        });

        it('Click Card to open', () => {
            let ele: HTMLElement = kanbanObj.element.querySelector('.e-card[data-id="4"]') as HTMLElement;
            util.triggerMouseEvent(ele, 'dblclick');
        });

        it('clicking the cancel button', () => {
            (kanbanObj.dialogModule as any).element.querySelector('.e-dialog-cancel').click();
            let ele: HTMLElement = kanbanObj.element.querySelector('.e-card[data-id="4"]') as HTMLElement;
            expect(ele.classList.contains('e-selection')).toEqual(true);
        });
    });

    describe('855102- Script error throws when we set true to the cancel argument of dialogClose event in Kanban', () => {
        let kanbanObj: Kanban;
        let element1: HTMLElement;
        beforeAll((done: DoneFn) => {
            const model: KanbanModel = {
                dialogSettings: {
                    fields: [
                        { text: 'ID', key: 'Id', type: 'Numeric' },
                        { key: 'Status', type: 'DropDown' },
                        { key: 'Assignee', type: 'DropDown' },
                        { key: 'Estimate', type: 'Numeric' },
                        { key: 'Summary', type: 'TextArea' }
                    ]
                },
                dialogClose: function (args : any) {
                    args.cancel = true;
                }
            };
            kanbanObj = util.createKanban(model, kanbanData, done);
        });

        afterAll(() => {
            util.destroy(kanbanObj);
        });
        it('Checking the Script error throws, when we set true to the cancel argument of dialogClose event in Kanban', () => {
            element1 = kanbanObj.element.querySelector('.e-card[data-id="5"]') as HTMLElement;
            util.triggerMouseEvent(element1, 'dblclick');
            let saveButton: HTMLElement = document.querySelector('.e-control.e-btn.e-lib.e-flat.e-dialog-edit.e-primary');
            util.triggerMouseEvent(saveButton, 'click');
            expect((kanbanObj.dialogModule as any).element).not.toBeNull;
            let dialogWrapper: Element = document.getElementById("Kanban_dialog_wrapper"); 
            let dialog: any = (dialogWrapper as EJ2Instance).ej2_instances[0];
            dialog.destroy();
        });
    });

    it('memory leak', () => {
        profile.sample();
        const average: number = inMB(profile.averageChange);
        expect(average).toBeLessThan(10); //Check average change in memory samples to not be over 10MB
        const memory: number = inMB(getMemoryProfile());
        //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
    });

});
