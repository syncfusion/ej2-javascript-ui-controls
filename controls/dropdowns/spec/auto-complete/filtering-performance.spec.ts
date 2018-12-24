/**
 * ComboBox spec document
 */
import { createElement, isNullOrUndefined, Browser, EmitType } from '@syncfusion/ej2-base';
import { AutoComplete } from '../../src/auto-complete/index';
import { FilteringEventArgs } from '../../src/drop-down-base';
import { DataManager, Query, ODataV4Adaptor, Predicate } from '@syncfusion/ej2-data';

describe('Filtering performance', () => {
    let autoEle: HTMLInputElement = <HTMLInputElement>createElement('input', { id: 'auto' });
    let autoObj: AutoComplete;
    let originalTimeout: number;
    describe('JSON performance 1', () => {
        let list: { [key: string]: string }[] = [];
        let isOpen: boolean = false;
        let isBind: boolean = false;
        for (var i = 20000; i > 0; i--) {
            list.push({ Code: "Test1" + i, Description: "TestDescription" + i });
        }
        beforeAll(() => {
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
            document.body.appendChild(autoEle);
            autoObj = new AutoComplete({
                dataSource: list,
                fields: { value: "Code", text: "Description" },
                placeholder: 'e.g. Basketball',
                allowFiltering: true,
                sortOrder: 'Ascending',
                width: '250px',
                suggestionCount: 20000,
                filtering: (e: FilteringEventArgs) => {
                    let predicate = new Predicate('Description', 'contains', e.text, true);
                    predicate = predicate.or('Code', 'contains', e.text, true);
                    let query = new Query();
                    query = (e.text !== '') ? query.where(predicate) : query;
                    e.updateData(list, query);
                }
            });
            autoObj.appendTo(autoEle);
        });
        afterAll(() => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            autoObj.destroy();
            autoEle.remove();
        });

        it('check value selection', (done) => {
            autoObj.open = () => {
                isOpen = true;
                expect(isBind).toBeFalsy();
            }
            autoObj.dataBound = () => {
                isBind = true;
                expect(autoObj.text).toBe('TestDescription987');
                expect(isOpen).toBeTruthy();
                done();
            }
            autoObj.actionComplete = () => {
                autoObj.value = 'Test1987';
            }
            autoObj.focusIn();
            (<any>autoObj).inputElement.value = "t";
            let event: any = new Event('keyup');
            event.keyCode = 65;
            event.key = "a";
            (<any>autoObj).onInput();
            (<any>autoObj).isValidKey = true;
            (<any>autoObj).onFilterUp(event);
        });
    });
    describe('JSON performance 2', () => {
        let list: { [key: string]: string }[] = [];
        let isOpen: boolean = false;
        let isBind: boolean = false;
        for (var i = 20000; i > 0; i--) {
            list.push({ Code: "Test1" + i, Description: "TestDescription" + i });
        }
        beforeAll(() => {
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
            document.body.appendChild(autoEle);
            autoObj = new AutoComplete({
                dataSource: list,
                fields: { value: "Code", text: "Description" },
                placeholder: 'e.g. Basketball',
                allowFiltering: true,
                sortOrder: 'Ascending',
                width: '250px',
                suggestionCount: 20000,
                filtering: (e: FilteringEventArgs) => {
                    let predicate = new Predicate('Description', 'contains', e.text, true);
                    predicate = predicate.or('Code', 'contains', e.text, true);
                    let query = new Query();
                    query = (e.text !== '') ? query.where(predicate) : query;
                    e.updateData(list, query);
                }
            });
            autoObj.appendTo(autoEle);
        });
        afterAll(() => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            autoObj.destroy();
            autoEle.remove();
        });

        it('check Text selection', (done) => {
            autoObj.open = () => {
                isOpen = true;
                expect(isBind).toBeFalsy();
            }
            autoObj.dataBound = () => {
                isBind = true;
                expect(autoObj.value).toBe('Test1987');
                expect(isOpen).toBeTruthy();
                done();
            }
            autoObj.actionComplete = () => {
                autoObj.text = 'TestDescription987';
            }
            autoObj.focusIn();
            (<any>autoObj).inputElement.value = "t";
            let event: any = new Event('keyup');
            event.keyCode = 65;
            event.key = "a";
            (<any>autoObj).onInput();
            (<any>autoObj).isValidKey = true;
            (<any>autoObj).onFilterUp(event);
        });
    });
    describe('Number performance', () => {
        let list: number[] = [];
        let isOpen: boolean = false;
        let isBind: boolean = false;
        for (var i = 20000; i > 0; i--) {
            list.push(i);
        }
        beforeAll(() => {
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
            document.body.appendChild(autoEle);
            autoObj = new AutoComplete({
                dataSource: list,
                allowFiltering: true,
                sortOrder: 'Ascending',
                width: '250px',
                suggestionCount: 20000
            });
            autoObj.appendTo(autoEle);
        });
        afterAll(() => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            autoObj.destroy();
            autoEle.remove();
        });

        it('check the performance', (done) => {
            autoObj.open = () => {
                isOpen = true;
                expect(isBind).toBeFalsy();
            }
            autoObj.dataBound = () => {
                isBind = true;
                expect(isOpen).toBeTruthy();
                done();
            }
            autoObj.actionComplete = () => {
                autoObj.index = 289;
            }
            autoObj.focusIn();
            (<any>autoObj).inputElement.value = "0";
            let event: any = new Event('keyup');
            event.keyCode = 65;
            event.key = 48;
            (<any>autoObj).onInput();
            (<any>autoObj).isValidKey = true;
            (<any>autoObj).onFilterUp(event);
        });
    });
    describe('String performance', () => {
        let list: string[] = [];
        let isOpen: boolean = false;
        let isBind: boolean = false;
        for (var i = 20000; i > 0; i--) {
            list.push('Text' + i);
        }
        beforeAll(() => {
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
            document.body.appendChild(autoEle);
            autoObj = new AutoComplete({
                dataSource: list,
                allowFiltering: true,
                sortOrder: 'Ascending',
                width: '250px',
                suggestionCount: 20000
            });
            autoObj.appendTo(autoEle);
        });
        afterAll(() => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            autoObj.destroy();
            autoEle.remove();
        });

        it('check the performance', (done) => {
            autoObj.open = () => {
                isOpen = true;
                expect(isBind).toBeFalsy();
            }
            autoObj.dataBound = () => {
                isBind = true;
                expect(isOpen).toBeTruthy();
                done();
            }
            autoObj.focusIn();
            (<any>autoObj).inputElement.value = "t";
            let event: any = new Event('keyup');
            event.keyCode = 84;
            event.key = 't';
            (<any>autoObj).onInput();
            (<any>autoObj).isValidKey = true;
            (<any>autoObj).onFilterUp(event);
        });
    });
    describe('Item Template performance', () => {
        let list: { [key: string]: string }[] = [];
        let isOpen: boolean = false;
        let isBind: boolean = false;
        for (var i = 20000; i > 0; i--) {
            list.push({ Code: "Test1" + i, Description: "TestDescription" + i });
        }
        beforeAll(() => {
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
            document.body.appendChild(autoEle);
            autoObj = new AutoComplete({
                dataSource: list,
                fields: { value: "Code", text: "Description" },
                placeholder: 'e.g. Basketball',
                allowFiltering: true,
                sortOrder: 'Ascending',
                width: '250px',
                suggestionCount: 20000,
                itemTemplate: '<div class="demo"> ${Code} </div><div class="id"> ${Description} </div>',
                filtering: (e: FilteringEventArgs) => {
                    let predicate = new Predicate('Description', 'contains', e.text, true);
                    predicate = predicate.or('Code', 'contains', e.text, true);
                    let query = new Query();
                    query = (e.text !== '') ? query.where(predicate) : query;
                    e.updateData(list, query);
                }
            });
            autoObj.appendTo(autoEle);
        });
        afterAll(() => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            autoObj.destroy();
            autoEle.remove();
        });

        it('check the performance', (done) => {
            autoObj.open = () => {
                isOpen = true;
                expect(isBind).toBeFalsy();
            }
            autoObj.dataBound = () => {
                isBind = true;
                expect(isOpen).toBeTruthy();
                done();
            }
            autoObj.focusIn();
            (<any>autoObj).inputElement.value = "t";
            let event: any = new Event('keyup');
            event.keyCode = 65;
            event.key = "a";
            (<any>autoObj).onInput();
            (<any>autoObj).isValidKey = true;
            (<any>autoObj).onFilterUp(event);
        });
    });
});