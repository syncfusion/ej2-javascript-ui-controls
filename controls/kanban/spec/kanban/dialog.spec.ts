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
        // tslint:disable:no-any
        const isDef: (o: any) => boolean = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            // tslint:disable-next-line:no-console
            console.log('Unsupported environment, window.performance.memory is unavailable');
            (this as any).skip(); //Skips test (in Chai)
            return;
        }
    });

    describe('Editor Rendering', () => {
        let kanbanObj: Kanban;
        let element1: HTMLElement;
        let element2: HTMLElement;
        let isDoubleClick: boolean = true;
        let data: { [key: string]: Object };
        let e: any = { preventDefault: () => { /** */ } };
        let columnKey: Object;
        beforeAll((done: DoneFn) => {
            let model: KanbanModel = {
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
            let ele: HTMLElement = document.querySelector('.e-dlg-container') as HTMLElement;
            expect(ele.classList.contains('e-dlg-center-center')).toBeTruthy();
        });
        it('Basic layout dialog testing - dialog container child elements testing', () => {
            let ele: HTMLElement = document.querySelector('.e-dlg-container') as HTMLElement;
            expect(ele.childElementCount).toBe(2);
            expect(ele.firstElementChild.classList.contains('e-kanban-dialog')).toBe(true);
            expect(ele.lastElementChild.classList.contains('e-dlg-overlay')).toBe(true);
        });
        it('Basic layout dialog testing - dialog wrapper testing', () => {
            let ele: HTMLElement = document.querySelector('#Kanban_dialog_wrapper') as HTMLElement;
            expect(ele.childElementCount).toBe(3);
            expect(ele.firstElementChild.classList.contains('e-dlg-header-content')).toBe(true);
            expect(ele.children[1].classList.contains('e-dlg-content')).toBe(true);
            expect(ele.children[1].getAttribute('id')).toBe('Kanban_dialog_wrapper_dialog-content');
            expect(ele.lastElementChild.classList.contains('e-footer-content')).toBe(true);
        });
        it('Basic layout dialog testing - dialog header testing', () => {
            let ele: HTMLElement = document.querySelector('.e-dlg-header-content') as HTMLElement;
            expect(ele.childElementCount).toBe(2);
            expect(ele.firstElementChild.classList.contains('e-dlg-closeicon-btn')).toBe(true);
            expect(ele.firstElementChild.getAttribute('title')).toBe('Close');
            expect(ele.firstElementChild.firstElementChild.classList.contains('e-icon-dlg-close')).toBe(true);
            expect(ele.lastElementChild.classList.contains('e-dlg-header')).toBe(true);
            expect(ele.lastElementChild.getAttribute('id')).toBe('Kanban_dialog_wrapper_title');
            expect(ele.lastElementChild.innerHTML).toBe('Edit Card Details');
        });
        it('Basic layout dialog testing - dialog outer content testing', () => {
            let ele: HTMLElement = document.querySelector('#Kanban_dialog_wrapper_dialog-content') as HTMLElement;
            expect(ele.firstElementChild.classList.contains('e-kanban-form-wrapper')).toBe(true);
            expect(ele.firstElementChild.firstElementChild.classList.contains('e-kanban-form')).toBe(true);
            expect(ele.firstElementChild.firstElementChild.tagName).toBe('FORM');
            expect(ele.firstElementChild.firstElementChild.getAttribute('id')).toBe('KanbanEditForm');
            expect(ele.firstElementChild.firstElementChild.firstElementChild.classList.contains('e-kanban-dialog-content')).toBe(true);
        });
        it('Basic layout dialog testing - dialog inner td and tr content testing', () => {
            let ele: HTMLElement = document.querySelector('#KanbanEditForm table') as HTMLElement;
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
            let ele: HTMLElement = document.querySelector('#KanbanEditForm table tr') as HTMLElement;
            expect(ele.children[1].firstElementChild.classList.contains('Id_wrapper')).toBe(true);
        });
        it('Basic layout dialog testing - dialog footer content testing', () => {
            let ele: HTMLElement = document.querySelector('#Kanban_dialog_wrapper .e-footer-content') as HTMLElement;
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
            columnKey = data[kanbanObj.keyField];
            expect(columnKey).toEqual('InProgress');
            if (!isDoubleClick) {
                kanbanObj.cardDoubleClick = () => { /** */ };
            }
            util.triggerMouseEvent(element1, 'dblclick');
        });
        it('Update card testing - after editing', () => {
            let dropDownEle: HTMLElement = document.querySelector('.Status_wrapper .e-dropdownlist') as HTMLElement;
            let dropDownObj: any = (dropDownEle as EJ2Instance).ej2_instances[0];
            dropDownObj.showPopup();
            expect(dropDownObj.inputWrapper.container.getAttribute('aria-activedescendant')).not.toBeNull();
            let items: Element[] = dropDownObj.popupObj.element.querySelectorAll('li');
            dropDownObj.setSelection(items[0], e);
            dropDownObj.hidePopup();
        });
        it('Update card testing - after editing', (done: DoneFn) => {
            kanbanObj.dataBound = () => {
                data = kanbanObj.getCardDetails(element1);
                columnKey = data[kanbanObj.keyField];
                expect(columnKey).toEqual('Open');
                done();
            };
            let ele: HTMLElement = document.querySelector('.e-dialog-edit') as HTMLElement;
            ele.click();
        });
        it('Delete the card testing - before open dialog', () => {
            element2 = kanbanObj.element.querySelector('.e-card[data-id="6"]') as HTMLElement;
            data = kanbanObj.getCardDetails(element2);
            columnKey = data[kanbanObj.keyField];
            expect(columnKey).toEqual('Close');
            expect(data).not.toBeNull();
            util.triggerMouseEvent(element2, 'dblclick');
        });
        it('Delete the card testing - press the delete button', () => {
            let ele: HTMLElement = document.querySelector('.e-dialog-delete') as HTMLElement;
            ele.click();
        });

        it('Delete the card testing - press the delete button', (done: DoneFn) => {
            kanbanObj.dataBound = () => {
                data = kanbanObj.getCardDetails(element2);
                expect(data).toBeUndefined();
                done();
            };
            let ele: HTMLElement = document.querySelector('.e-dialog-yes') as HTMLElement;
            ele.click();
        });

        it('Cancel the editing', () => {
            let element3: HTMLElement = kanbanObj.element.querySelector('.e-card[data-id="14"]') as HTMLElement;
            util.triggerMouseEvent(element3, 'dblclick');
            let ele: HTMLElement = document.querySelector('.e-dialog-cancel') as HTMLElement;
            ele.click();
        });
    });

    describe('Public method Editor', () => {
        let kanbanObj: Kanban;
        beforeAll((done: DoneFn) => {
            let model: KanbanModel = {
                dialogSettings: {
                    fields: [
                        { text: 'ID', key: 'Id', type: 'Input', validationRules: { required: true, number: true } },
                        { key: 'Status', type: 'DropDown' },
                        { key: 'Assignee', type: 'Input', validationRules: { required: true } },
                        { key: 'Estimate', type: 'Numeric', validationRules: { range: [0, 1000] } },
                        { key: 'Summary', type: 'TextBox', validationRules: { required: true } }
                    ]
                },
            };
            kanbanObj = util.createKanban(model, kanbanData, done);
        });

        afterAll(() => {
            util.destroy(kanbanObj);
        });

        it('openEditor add method testing', (done: DoneFn) => {
            expect(kanbanObj.kanbanData.length).toBe(75);
            kanbanObj.dataBound = () => {
                expect(kanbanObj.kanbanData.length).toBe(76);
                done();
            };
            kanbanObj.crudModule.addCard({ 'Id': 333, 'Status': 'Close', 'Summary': 'Check the cards', 'Assignee': 'Andrew Fuller' });
        });
        it('openEditor update method testing', (done: DoneFn) => {
            expect(kanbanObj.kanbanData.length).toBe(76);
            kanbanObj.dataBound = () => {
                let element: HTMLElement = kanbanObj.element.querySelector('.e-card[data-id="2"]') as HTMLElement;
                let data: { [key: string]: Object } = kanbanObj.getCardDetails(element);
                let status: Object = data[kanbanObj.keyField];
                expect(status).toBe('Close');
                done();
            };
            kanbanObj.crudModule.updateCard({ 'Id': 2, 'Status': 'Close', 'Summary': 'Check the cards', 'Assignee': 'Andrew Fuller' });
        });
        it('openEditor delete method testing', (done: DoneFn) => {
            kanbanObj.dataBound = () => {
                expect(kanbanObj.kanbanData.length).toBe(75);
                done();
            };
            kanbanObj.crudModule.deleteCard(8);
        });
    });

    describe('Public method Editor using array value', () => {
        let kanbanObj: Kanban;
        beforeAll((done: DoneFn) => {
            let model: KanbanModel = {
                dialogSettings: {
                    fields: [
                        { text: 'ID', key: 'Id', type: 'Input', validationRules: { required: true, number: true } },
                        { key: 'Status', type: 'DropDown' },
                        { key: 'Assignee', type: 'Input', validationRules: { required: true } },
                        { key: 'Estimate', type: 'Numeric', validationRules: { range: [0, 1000] } },
                        { key: 'Summary', type: 'TextBox', validationRules: { required: true } }
                    ]
                },
            };
            kanbanObj = util.createKanban(model, kanbanData, done);
        });

        afterAll(() => {
            util.destroy(kanbanObj);
        });

        it('openEditor add method testing', (done: DoneFn) => {
            expect(kanbanObj.kanbanData.length).toBe(75);
            kanbanObj.dataBound = () => {
                expect(kanbanObj.kanbanData.length).toBe(76);
                done();
            };
            kanbanObj.crudModule.addCard([{ 'Id': 334, 'Status': 'Close', 'Summary': 'Check the cards', 'Assignee': 'Andrew Fuller' }]);
        });
        it('openEditor update method testing', (done: DoneFn) => {
            kanbanObj.dataBound = () => {
                let element: HTMLElement = kanbanObj.element.querySelector('.e-card[data-id="6"]') as HTMLElement;
                let data: { [key: string]: Object } = kanbanObj.getCardDetails(element);
                let status: Object = data[kanbanObj.keyField];
                expect(status).toBe('Open');
                done();
            };
            kanbanObj.crudModule.updateCard([{ 'Id': 6, 'Status': 'Open', 'Summary': 'Check the cards', 'Assignee': 'Andrew Fuller' }]);
        });
        it('openEditor delete method testing', (done: DoneFn) => {
            kanbanObj.dataBound = () => {
                expect(kanbanObj.kanbanData.length).toBe(74);
                done();
            };
            kanbanObj.crudModule.deleteCard([{ 'Id': 5 }, { 'Id': 13 }]);
        });
    });

    describe('Public method Editor with cancel events', () => {
        let kanbanObj: Kanban;
        beforeAll((done: DoneFn) => {
            let model: KanbanModel = {
                dialogSettings: {
                    fields: [
                        { text: 'ID', key: 'Id', type: 'Input', validationRules: { required: true, number: true } },
                        { key: 'Status', type: 'DropDown' },
                        { key: 'Assignee', type: 'Input', validationRules: { required: true } },
                        { key: 'Estimate', type: 'Numeric', validationRules: { range: [0, 1000] } },
                        { key: 'Summary', type: 'TextBox', validationRules: { required: true } }
                    ]
                },
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
            let element: HTMLElement = kanbanObj.element.querySelector('.e-card[data-id="5"]') as HTMLElement;
            util.triggerMouseEvent(element, 'dblclick');
        });
        it('Click delete button', () => {
            let ele: HTMLElement = document.querySelector('.e-dialog-delete') as HTMLElement;
            ele.click();
        });
        it('Click dialog no button', () => {
            let ele: HTMLElement = document.querySelector('.e-dialog-no') as HTMLElement;
            ele.click();
        });
        it('Dialog close button clicked', () => {
            (document.querySelector('.e-kanban-dialog.e-dialog .e-dlg-closeicon-btn') as HTMLElement).click();
            expect(document.querySelectorAll('.e-kanban-dialog.e-dialog').length).toEqual(0);
        });
    });

    it('memory leak', () => {
        profile.sample();
        let average: any = inMB(profile.averageChange);
        expect(average).toBeLessThan(10); //Check average change in memory samples to not be over 10MB
        let memory: any = inMB(getMemoryProfile());
        //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
    });

});
