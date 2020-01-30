/**
 * CRUD actions spec
 */
import { DataManager, UrlAdaptor, Query } from '@syncfusion/ej2-data';
import { Kanban, KanbanModel, ActionEventArgs } from '../../src/kanban/index';
import { kanbanData } from './common/kanban-data.spec';
import { profile, inMB, getMemoryProfile } from './common/common.spec';
import * as util from './common/util.spec';

Kanban.Inject();

describe('CRUD actions module', () => {
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

    describe('Add action testing', () => {
        let kanbanObj: Kanban;
        let dataSource: Object[] = kanbanData.slice(0, 10);
        beforeAll((done: DoneFn) => {
            kanbanObj = util.createKanban({}, dataSource, done);
        });

        afterAll(() => {
            util.destroy(kanbanObj);
        });

        it('action begin event testing in add card public method', () => {
            kanbanObj.actionBegin = (args: ActionEventArgs) => args.cancel = true;
            expect(kanbanObj.kanbanData.length).toEqual(10);
            expect(kanbanObj.element.querySelectorAll('.e-card').length).toEqual(9);
            let cardData: { [key: string]: Object } = {
                Id: 76,
                Status: 'Close',
                Summary: 'Check test cases.',
                Type: 'Story',
                Priority: 'Release Breaker',
                Tags: 'Testing',
                Estimate: 0.5,
                Assignee: 'Nancy Davloio',
                RankId: 22
            };
            kanbanObj.addCard(cardData);
            expect(kanbanObj.kanbanData.length).toEqual(10);
        });

        it('action complete event testing in add card public method', () => {
            kanbanObj.actionBegin = (args: ActionEventArgs) => args.cancel = false;
            kanbanObj.actionComplete = (args: ActionEventArgs) => args.cancel = true;
            expect(kanbanObj.kanbanData.length).toEqual(10);
            expect(kanbanObj.element.querySelectorAll('.e-card').length).toEqual(9);
            let cardData: { [key: string]: Object } = {
                Id: 76,
                Status: 'Close',
                Summary: 'Check test cases.',
                Type: 'Story',
                Priority: 'Release Breaker',
                Tags: 'Testing',
                Estimate: 0.5,
                Assignee: 'Nancy Davloio',
                RankId: 22
            };
            kanbanObj.addCard(cardData);
            expect(kanbanObj.kanbanData.length).toEqual(10);
        });

        it('add card public method testing', (done: DoneFn) => {
            kanbanObj.actionComplete = (args: ActionEventArgs) => args.cancel = false;
            kanbanObj.dataBound = () => {
                expect(kanbanObj.kanbanData.length).toEqual(12);
                expect(kanbanObj.element.querySelectorAll('.e-card').length).toEqual(11);
                done();
            };
            expect(kanbanObj.kanbanData.length).toEqual(10);
            expect(kanbanObj.element.querySelectorAll('.e-card').length).toEqual(9);
            let cardData: { [key: string]: Object } = {
                Id: 77,
                Status: 'Close',
                Summary: 'Check test cases.',
                Type: 'Story',
                Priority: 'Release Breaker',
                Tags: 'Testing',
                Estimate: 0.5,
                Assignee: 'Nancy Davloio',
                RankId: 22
            };
            kanbanObj.addCard(cardData);
        });
    });

    describe('Update action testing', () => {
        let kanbanObj: Kanban;
        let dataSource: Object[] = kanbanData.slice(0, 10);
        beforeAll((done: DoneFn) => {
            kanbanObj = util.createKanban({}, dataSource, done);
        });

        afterAll(() => {
            util.destroy(kanbanObj);
        });

        it('action begin event testing in update card public method', () => {
            kanbanObj.actionBegin = (args: ActionEventArgs) => args.cancel = true;
            expect(kanbanObj.kanbanData.length).toEqual(10);
            expect(kanbanObj.element.querySelectorAll('.e-card').length).toEqual(9);
            let cardData: { [key: string]: Object }[] = util.cloneDataSource(kanbanData.slice(1, 3)) as { [key: string]: Object }[];
            cardData[0].Status = 'Testing';
            cardData[1].Status = 'Close';
            kanbanObj.updateCard(cardData);
            expect(kanbanObj.kanbanData.length).toEqual(10);
        });

        it('action complete event testing in update card public method', () => {
            kanbanObj.actionBegin = (args: ActionEventArgs) => args.cancel = false;
            kanbanObj.actionComplete = (args: ActionEventArgs) => args.cancel = true;
            expect(kanbanObj.kanbanData.length).toEqual(10);
            expect(kanbanObj.element.querySelectorAll('.e-card').length).toEqual(9);
            let cardData: { [key: string]: Object }[] = util.cloneDataSource(kanbanData.slice(1, 3)) as { [key: string]: Object }[];
            cardData[0].Status = 'Testing';
            cardData[1].Status = 'Close';
            kanbanObj.updateCard(cardData);
            expect(kanbanObj.kanbanData.length).toEqual(10);
        });

        it('update card public method testing', (done: DoneFn) => {
            kanbanObj.actionComplete = (args: ActionEventArgs) => args.cancel = false;
            kanbanObj.dataBound = () => {
                expect(kanbanObj.kanbanData.length).toEqual(10);
                expect(kanbanObj.element.querySelectorAll('.e-card').length).toEqual(9);
                expect(cardData.Id).toEqual(1);
                expect(cardData.Status).toEqual('InProgress');
                done();
            };
            expect(kanbanObj.kanbanData.length).toEqual(10);
            expect(kanbanObj.element.querySelectorAll('.e-card').length).toEqual(9);
            let cardData: { [key: string]: Object } = util.cloneDataSource(kanbanData.slice(0, 1))[0] as { [key: string]: Object };
            expect(cardData.Id).toEqual(1);
            expect(cardData.Status).toEqual('Open');
            cardData.Status = 'InProgress';
            kanbanObj.updateCard(cardData);
        });
    });

    describe('Delete action testing', () => {
        let kanbanObj: Kanban;
        let dataSource: Object[] = kanbanData.slice(0, 10);
        beforeAll((done: DoneFn) => {
            kanbanObj = util.createKanban({}, dataSource, done);
        });

        afterAll(() => {
            util.destroy(kanbanObj);
        });

        it('action begin event testing in delete card public method', () => {
            kanbanObj.actionBegin = (args: ActionEventArgs) => args.cancel = true;
            expect(kanbanObj.kanbanData.length).toEqual(10);
            expect(kanbanObj.element.querySelectorAll('.e-card').length).toEqual(9);
            let cardData: { [key: string]: Object }[] = util.cloneDataSource(kanbanData.slice(1, 2)) as { [key: string]: Object }[];
            kanbanObj.deleteCard(cardData[0]);
            expect(kanbanObj.kanbanData.length).toEqual(10);
        });

        it('action complete event testing in delete card public method', () => {
            kanbanObj.actionBegin = (args: ActionEventArgs) => args.cancel = false;
            kanbanObj.actionComplete = (args: ActionEventArgs) => args.cancel = true;
            expect(kanbanObj.kanbanData.length).toEqual(10);
            expect(kanbanObj.element.querySelectorAll('.e-card').length).toEqual(9);
            let cardData: { [key: string]: Object }[] = util.cloneDataSource(kanbanData.slice(1, 3)) as { [key: string]: Object }[];
            kanbanObj.deleteCard(cardData);
            expect(kanbanObj.kanbanData.length).toEqual(10);
        });

        it('delete card public method testing', (done: DoneFn) => {
            kanbanObj.actionComplete = (args: ActionEventArgs) => args.cancel = false;
            kanbanObj.dataBound = () => {
                expect(kanbanObj.kanbanData.length).toEqual(7);
                expect(kanbanObj.element.querySelectorAll('.e-card').length).toEqual(6);
                done();
            };
            expect(kanbanObj.kanbanData.length).toEqual(10);
            expect(kanbanObj.element.querySelectorAll('.e-card').length).toEqual(9);
            kanbanObj.deleteCard(1);
        });
    });

    describe('Remote data success testing', () => {
        let kanbanObj: Kanban;
        let dataSource: Object[] = kanbanData.slice(0, 10);
        let cardData: { [key: string]: Object }[] = [{
            Id: 1,
            Subject: 'Remote Data Testing',
            StartTime: new Date(2019, 11, 2, 10),
            EndTime: new Date(2019, 11, 2, 11, 30),
            IsAllDay: false
        }];
        beforeAll(() => {
            jasmine.Ajax.install();
            let dataManager: DataManager = new DataManager({
                url: 'api/Kanban/GetData/',
                crudUrl: 'api/Kanban/UpdateData/',
                adaptor: new UrlAdaptor()
            });
            let model: KanbanModel = {
                query: new Query(),
                actionComplete: (args: ActionEventArgs) => {
                    if (args.requestType === 'cardCreated') {
                        jasmine.Ajax.requests.reset();
                    }
                }
            };
            kanbanObj = util.createKanban(model, dataManager);
        });
        beforeEach((done: Function) => {
            let request: JasmineAjaxRequest = jasmine.Ajax.requests.at(1) || jasmine.Ajax.requests.mostRecent();
            request.respondWith({ 'status': 200, 'responseText': JSON.stringify({ d: dataSource, __count: dataSource.length }) });
            done();
        });
        it('add card using remote data', () => {
            jasmine.Ajax.requests.reset();
            expect(kanbanObj.kanbanData.length).toEqual(10);
            dataSource = dataSource.concat(cardData);
            kanbanObj.addCard(cardData);
        });
        it('action complete checking for add action result', () => {
            expect(kanbanObj.kanbanData.length).toEqual(10);
        });
        it('event get action after adding new card', () => {
            expect(kanbanObj.kanbanData.length).toEqual(11);
        });
        afterAll(() => {
            util.destroy(kanbanObj);
            jasmine.Ajax.uninstall();
        });
    });

    describe('Remote data success with kanban destroy testing', () => {
        let kanbanObj: Kanban;
        let dataSource: Object[] = kanbanData.slice(0, 10);
        let cardData: { [key: string]: Object }[] = [{
            Id: 1,
            Subject: 'Remote Data Testing',
            StartTime: new Date(2019, 11, 2, 10),
            EndTime: new Date(2019, 11, 2, 11, 30),
            IsAllDay: false
        }];
        beforeAll(() => {
            jasmine.Ajax.install();
            let dataManager: DataManager = new DataManager({
                url: 'api/Kanban/GetData/',
                crudUrl: 'api/Kanban/UpdateData/',
                adaptor: new UrlAdaptor()
            });
            let model: KanbanModel = { query: new Query() };
            kanbanObj = util.createKanban(model, dataManager);
        });
        beforeEach((done: Function) => {
            let request: JasmineAjaxRequest = jasmine.Ajax.requests.at(1) || jasmine.Ajax.requests.mostRecent();
            request.respondWith({ 'status': 200, 'responseText': JSON.stringify({ d: dataSource, __count: dataSource.length }) });
            done();
        });
        it('delete card using remote data', () => {
            jasmine.Ajax.requests.reset();
            expect(kanbanObj.kanbanData.length).toEqual(10);
            kanbanObj.deleteCard(cardData);
            util.destroy(kanbanObj);
        });
        it('action complete checking for delete action result', () => {
            expect(kanbanObj.isDestroyed).toEqual(true);
        });
        afterAll(() => {
            jasmine.Ajax.uninstall();
        });
    });

    describe('Remote data failure testing', () => {
        let kanbanObj: Kanban;
        let dataSource: Object[] = kanbanData.slice(0, 10);
        let cardData: { [key: string]: Object }[] = [{
            Id: 1,
            Subject: 'Remote Data Testing',
            StartTime: new Date(2019, 11, 2, 10),
            EndTime: new Date(2019, 11, 2, 11, 30),
            IsAllDay: false
        }];
        let isDataLoad: boolean = true;
        let isChecking: boolean = false;
        let actionFailedFunction: () => void = jasmine.createSpy('actionFailure');
        beforeAll(() => {
            jasmine.Ajax.install();
            let dataManager: DataManager = new DataManager({
                url: 'api/Kanban/GetData/',
                crudUrl: 'api/Kanban/UpdateData/',
                adaptor: new UrlAdaptor()
            });
            let model: KanbanModel = {
                query: new Query(),
                actionComplete: (args: ActionEventArgs) => {
                    if (args.requestType === 'cardCreated') {
                        args.cancel = isChecking;
                        jasmine.Ajax.requests.reset();
                    }
                },
                actionFailure: actionFailedFunction
            };
            kanbanObj = util.createKanban(model, dataManager);
        });
        beforeEach((done: Function) => {
            let request: JasmineAjaxRequest = jasmine.Ajax.requests.at(1) || jasmine.Ajax.requests.mostRecent();
            if (isDataLoad) {
                request.respondWith({ 'status': 200, 'responseText': JSON.stringify({ d: dataSource, __count: dataSource.length }) });
            } else {
                request.respondWith({ 'status': 404, 'contentType': 'application/json', 'responseText': 'Page not found' });
            }
            done();
        });
        it('action complete testing in add card using remote data', () => {
            isChecking = true;
            jasmine.Ajax.requests.reset();
            expect(kanbanObj.kanbanData.length).toEqual(10);
            dataSource = dataSource.concat(cardData);
            kanbanObj.addCard(cardData);
            expect(kanbanObj.kanbanData.length).toEqual(10);
        });
        it('add card actiusing remote data', () => {
            isDataLoad = false;
            isChecking = false;
            expect(kanbanObj.kanbanData.length).toEqual(10);
            kanbanObj.addCard(cardData);
        });
        it('action complete checking for add action result', () => {
            expect(actionFailedFunction).toHaveBeenCalled();
        });
        afterAll(() => {
            util.destroy(kanbanObj);
            jasmine.Ajax.uninstall();
        });
    });

    describe('Remote data failure with kanban destroy testing', () => {
        let kanbanObj: Kanban;
        let dataSource: Object[] = kanbanData.slice(0, 10);
        let cardData: { [key: string]: Object }[] = [{
            Id: 1,
            Subject: 'Remote Data Testing',
            StartTime: new Date(2019, 11, 2, 10),
            EndTime: new Date(2019, 11, 2, 11, 30),
            IsAllDay: false
        }];
        let isDataLoad: boolean = true;
        let actionFailedFunction: () => void = jasmine.createSpy('actionFailure');
        beforeAll(() => {
            jasmine.Ajax.install();
            let dataManager: DataManager = new DataManager({
                url: 'api/Kanban/GetData/',
                crudUrl: 'api/Kanban/UpdateData/',
                adaptor: new UrlAdaptor()
            });
            let model: KanbanModel = {
                query: new Query(),
                actionFailure: actionFailedFunction
            };
            kanbanObj = util.createKanban(model, dataManager);
        });
        beforeEach((done: Function) => {
            let request: JasmineAjaxRequest = jasmine.Ajax.requests.at(1) || jasmine.Ajax.requests.mostRecent();
            if (isDataLoad) {
                request.respondWith({ 'status': 200, 'responseText': JSON.stringify({ d: dataSource, __count: dataSource.length }) });
            } else {
                request.respondWith({ 'status': 404, 'contentType': 'application/json', 'responseText': 'Page not found' });
            }
            done();
        });
        it('action complete testing in update card using remote data', () => {
            isDataLoad = false;
            jasmine.Ajax.requests.reset();
            expect(kanbanObj.kanbanData.length).toEqual(10);
            kanbanObj.updateCard(cardData);
            util.destroy(kanbanObj);
        });
        it('destroy checking for update card action result', () => {
            expect(kanbanObj.isDestroyed).toEqual(true);
        });
        afterAll(() => {
            jasmine.Ajax.uninstall();
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
