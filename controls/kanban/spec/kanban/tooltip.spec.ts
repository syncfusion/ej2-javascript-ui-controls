/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Tooltip spec
 */
import { isVisible } from '@syncfusion/ej2-base';
import { Kanban, KanbanModel } from '../../src/kanban/index';
import { kanbanData } from './common/kanban-data.spec';
import { profile, inMB, getMemoryProfile } from './common/common.spec';
import * as util from './common/util.spec';
import { Query } from '@syncfusion/ej2-data';

describe('Kanban tooltip module', () => {
    beforeAll(() => {
        const isDef: (o: any) => boolean = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            // eslint-disable-next-line no-console
            console.log('Unsupported environment, window.performance.memory is unavailable');
            (this as any).skip(); //Skips test (in Chai)
            return;
        }
    });

    describe('Check tooltip on default content', () => {
        let kanbanObj: Kanban;
        beforeAll((done: DoneFn) => {
            const model: KanbanModel = { enableTooltip: true };
            kanbanObj = util.createKanban(model, kanbanData, done);
            util.disableTooltipAnimation((kanbanObj.tooltipModule as any).tooltipObj);
        });

        afterAll(() => {
            util.destroy(kanbanObj);
        });
        it('mouse hover open tooltip', () => {
            const target: HTMLElement = kanbanObj.element.querySelector('.e-card .e-card-header-title.e-tooltip-text') as HTMLElement;
            expect(document.querySelector('.e-kanban-tooltip')).toBeNull();
            util.triggerMouseEvent(target, 'mouseover');
            const tooltipEle: HTMLElement = document.querySelector('.e-kanban-tooltip') as HTMLElement;
            expect(isVisible(tooltipEle)).toBe(true);
            expect(tooltipEle.innerText).toEqual('1');
            util.triggerMouseEvent(target, 'mouseleave');
            expect(document.querySelector('.e-kanban-tooltip')).toBeNull();
            const content: HTMLElement = kanbanObj.element.querySelector('.e-card .e-card-content') as HTMLElement;
            expect(document.querySelector('.e-kanban-tooltip')).toBeNull();
            util.triggerMouseEvent(content, 'mouseover');
            const tooltipElement: HTMLElement = document.querySelector('.e-kanban-tooltip') as HTMLElement;
            expect(isVisible(tooltipElement)).toBe(true);
            expect(tooltipElement.innerText).toEqual('Analyze the new requirements gathered from the customer.');
            util.triggerMouseEvent(content, 'mouseleave');
            expect(document.querySelector('.e-kanban-tooltip')).toBeNull();
        });
    });

    describe('Check tooltip template', () => {
        let kanbanObj: Kanban;
        beforeAll((done: DoneFn) => {
            const model: KanbanModel = {
                enableTooltip: true,
                tooltipTemplate: '<div class="template" style="padding:5px;"><div>Assignee: ${Assignee}</div></div>'
            };
            kanbanObj = util.createKanban(model, kanbanData, done);
            util.disableTooltipAnimation((kanbanObj.tooltipModule as any).tooltipObj);
        });

        afterAll(() => {
            util.destroy(kanbanObj);
        });
        it('mouse hover open tooltip', () => {
            const target: HTMLElement = kanbanObj.element.querySelector('.e-card .e-card-header-title.e-tooltip-text') as HTMLElement;
            expect(document.querySelector('.e-kanban-tooltip')).toBeNull();
            util.triggerMouseEvent(target, 'mouseover');
            const tooltipEle: HTMLElement = document.querySelector('.e-kanban-tooltip') as HTMLElement;
            expect(isVisible(tooltipEle)).toBe(true);
            expect([].slice.call(tooltipEle.querySelectorAll('.template')).length).toEqual(1);
            util.triggerMouseEvent(target, 'mouseleave');
            expect(document.querySelector('.e-kanban-tooltip')).toBeNull();
        });
        it('change tooltip template through set model', () => {
            kanbanObj.tooltipTemplate = '<div class="template1" style="padding:5px;"><div>Assignee: ${Assignee}</div></div>';
            kanbanObj.dataBind();
            const target: HTMLElement = kanbanObj.element.querySelector('.e-card .e-card-header-title.e-tooltip-text') as HTMLElement;
            expect(document.querySelector('.e-kanban-tooltip')).toBeNull();
            util.triggerMouseEvent(target, 'mouseover');
            const tooltipEle: HTMLElement = document.querySelector('.e-kanban-tooltip') as HTMLElement;
            expect(isVisible(tooltipEle)).toBe(true);
            expect([].slice.call(tooltipEle.querySelectorAll('.template')).length).toEqual(0);
            expect([].slice.call(tooltipEle.querySelectorAll('.template1')).length).toEqual(1);
            util.triggerMouseEvent(target, 'mouseleave');
            expect(document.querySelector('.e-kanban-tooltip')).toBeNull();
        });
    });

    describe('Check tooltip and checking e-control class on kanban element', () => {
        let kanbanObj: Kanban;
        beforeAll((done: DoneFn) => {
            const model: KanbanModel = { enableTooltip: false };
            kanbanObj = util.createKanban(model, kanbanData, done);
        });

        afterAll(() => {
            util.destroy(kanbanObj);
        });
        it('hide tooltip on mouse hover', () => {
            const target: HTMLElement = kanbanObj.element.querySelector('.e-card .e-card-header-title') as HTMLElement;
            expect(document.querySelector('.e-kanban-tooltip')).toBeNull();
            util.triggerMouseEvent(target, 'mouseover');
            expect(document.querySelector('.e-kanban-tooltip')).toBeNull();
            util.triggerMouseEvent(target, 'mouseleave');
            expect(document.querySelector('.e-kanban-tooltip')).toBeNull();
        });
        it('show tooltip through set model on mouse hover', () => {
            kanbanObj.enableTooltip = true;
            kanbanObj.dataBind();
            util.disableTooltipAnimation((kanbanObj.tooltipModule as any).tooltipObj);
            const target: HTMLElement = kanbanObj.element.querySelector('.e-card .e-card-header-title.e-tooltip-text') as HTMLElement;
            expect(document.querySelector('.e-kanban-tooltip')).toBeNull();
            util.triggerMouseEvent(target, 'mouseover');
            const tooltipEle: HTMLElement = document.querySelector('.e-kanban-tooltip') as HTMLElement;
            expect(isVisible(tooltipEle)).toBe(true);
            util.triggerMouseEvent(target, 'mouseleave');
            expect(document.querySelector('.e-kanban-tooltip')).toBeNull();
        });
        it('hide tooltip through set model on mouse hover and checking e-control class on kanban element', () => {
            kanbanObj.enableTooltip = false;
            kanbanObj.dataBind();
            expect(kanbanObj.element.classList.contains('e-control')).toEqual(true);
            const target: HTMLElement = kanbanObj.element.querySelector('.e-card .e-card-header-title.e-tooltip-text') as HTMLElement;
            expect(document.querySelector('.e-kanban-tooltip')).toBeNull();
            util.triggerMouseEvent(target, 'mouseover');
            expect(document.querySelector('.e-kanban-tooltip')).toBeNull();
            util.triggerMouseEvent(target, 'mouseleave');
            expect(document.querySelector('.e-kanban-tooltip')).toBeNull();
        });
    });

    describe('covering sortBy without keyField', () => {
        let kanbanObj: Kanban;
        beforeAll((done: DoneFn) => {
            let model: KanbanModel = {
                columns: [
                    { headerText: 'Backlog', keyField: 'Open', allowToggle: true, showAddButton: true },
                    { headerText: 'In Progress', keyField: 'InProgress', allowToggle: true, showAddButton: true },
                    { headerText: 'Testing', keyField: 'Testing', allowToggle: true, showAddButton: true },
                    { headerText: 'Done', keyField: 'Close', allowToggle: true, showAddButton: true }
                ],
                allowKeyboard: true,
                query: new Query().take(10),
                sortSettings: {
                    sortBy: 'Custom',
                    field: 'Summary',
                    direction: 'Descending'
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

        it('Add new card', () => {
            expect(kanbanObj.kanbanData.length).toBe(10);
            let addButton: HTMLElement = kanbanObj.element.querySelector('.e-show-add-button');
            expect(addButton.classList.contains('e-show-add-focus')).toBe(false);
            util.triggerMouseEvent(addButton, 'click');
        });

        it('Save new card', () => {
            let saveEle: HTMLElement = document.querySelector('.e-dialog-add');
            let popupEle: HTMLElement = document.querySelector('.e-dialog.e-kanban-dialog.e-popup');
            expect(popupEle.classList.contains('e-popup-close')).toBe(false);
            expect(popupEle.classList.contains('e-popup-open')).toBe(true);
            util.triggerMouseEvent(saveEle, 'click');
            expect(popupEle.classList.contains('e-popup-open')).toBe(false);
        });
    });

    describe('Enable tooltip drag the card', () => {
        let kanbanObj: Kanban;
        let dragElement: HTMLElement;
        beforeAll((done: DoneFn) => {
            kanbanObj = util.createKanban({ enableTooltip: true }, kanbanData, done);
        });

        afterAll(() => {
            util.destroy(kanbanObj);
        });

        it('Card Dragging to particular area', () => {
            dragElement = (kanbanObj.element.querySelectorAll('.e-card[data-id="2"]') as NodeListOf<Element>).item(0) as HTMLElement;
            util.triggerMouseEvent(dragElement, 'mousedown');
            util.triggerMouseEvent(dragElement, 'mousemove', 100, 100);
            expect(dragElement.classList.contains('e-kanban-dragged-card')).toBeTruthy();
            expect(dragElement.nextElementSibling.classList.contains('e-target-dragged-clone')).toBeTruthy();
            expect(kanbanObj.element.querySelectorAll('.e-target-dragged-clone').length).toBe(1);
        });

        it('Dragging card and mouseOvering to another card', () => {
            const element: Element = (kanbanObj.element.querySelectorAll('.e-card[data-id="5"]').item(0)).querySelector('.e-card-content');
            util.triggerMouseEvent(element, 'mousemove', 200, 140);
            util.triggerMouseEvent(element, 'mouseover');
        });

        it('check the tooltip not showing', () => {
            let ele: HTMLElement = kanbanObj.element.querySelector('.e-tooltip-wrap.e-popup.e-kanban-tooltip.e-popup-open');
            expect(ele).toBe(null);
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
