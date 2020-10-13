/**
 * keyboard spec
 */
import { Kanban, KanbanModel } from '../../src/kanban/index';
import { kanbanData } from './common/kanban-data.spec';
import { profile, inMB, getMemoryProfile } from './common/common.spec';
import * as util from './common/util.spec';

Kanban.Inject();

describe('Keyboard module', () => {
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

    describe('Keyboard Interactions for single card selection type', () => {
        let kanbanObj: Kanban;
        let keyModule: any;
        beforeAll((done: DoneFn) => {
            let model: KanbanModel = {
                columns: [
                    { headerText: 'Backlog', keyField: 'Open', allowToggle: true },
                    { headerText: 'In Progress', keyField: 'InProgress', allowToggle: true },
                    { headerText: 'Testing', keyField: 'Testing', allowToggle: true },
                    { headerText: 'Done', keyField: 'Close', allowToggle: true }
                ],
                allowKeyboard: true,
                swimlaneSettings: {
                    keyField: 'Assignee',
                },
                cardSettings: {
                    selectionType: 'Single'
                }
            };
            kanbanObj = util.createKanban(model, kanbanData, done);
        });

        afterAll(() => {
            util.destroy(kanbanObj);
        });

        it('ensure module name', () => {
            keyModule = kanbanObj.keyboardModule;
            kanbanObj.element.focus();
        });

        it('first card selection testing', () => {
            let card: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="25"]').item(0) as HTMLElement;
            expect(card.classList.contains('e-selection')).not.toBe(true);
            keyModule.keyActionHandler({ action: 'firstCardSelection' });
            expect(card.classList.contains('e-selection')).toBe(true);
        });

        it('last card selection testing', () => {
            let card: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="54"]').item(0) as HTMLElement;
            expect(card.classList.contains('e-selection')).toEqual(false);
            keyModule.keyActionHandler({ action: 'lastCardSelection' });
            expect(card.classList.contains('e-selection')).toEqual(true);
            let card1: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="25"]').item(0) as HTMLElement;
            expect(card1.classList.contains('e-selection')).toEqual(false);
        });
    });

    describe('Keyboard Interactions', () => {
        let kanbanObj: Kanban;
        let keyModule: any;
        beforeAll((done: DoneFn) => {
            let model: KanbanModel = {
                columns: [
                    { headerText: 'Backlog', keyField: 'Open', allowToggle: true },
                    { headerText: 'In Progress', keyField: 'InProgress', allowToggle: true },
                    { headerText: 'Testing', keyField: 'Testing', allowToggle: true },
                    { headerText: 'Done', keyField: 'Close', allowToggle: true }
                ],
                allowKeyboard: true,
                swimlaneSettings: {
                    keyField: 'Assignee',
                },
                cardSettings: {
                    selectionType: 'Multiple'
                }
            };
            kanbanObj = util.createKanban(model, kanbanData, done);
        });

        afterAll(() => {
            util.destroy(kanbanObj);
        });

        it('last card selection testing', () => {
            keyModule = kanbanObj.keyboardModule;
            kanbanObj.element.focus();
            let card: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="54"]').item(0) as HTMLElement;
            expect(card.classList.contains('e-selection')).toEqual(false);
            keyModule.keyActionHandler({ action: 'lastCardSelection' });
            expect(card.classList.contains('e-selection')).toEqual(true);
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