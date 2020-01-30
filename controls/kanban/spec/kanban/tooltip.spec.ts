/**
 * Tooltip spec 
 */
import { isVisible } from '@syncfusion/ej2-base';
import { Kanban, KanbanModel } from '../../src/kanban/index';
import { kanbanData } from './common/kanban-data.spec';
import { profile, inMB, getMemoryProfile } from './common/common.spec';
import * as util from './common/util.spec';

describe('Kanban tooltip module', () => {
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

    describe('Check tooltip on default content', () => {
        let kanbanObj: Kanban;
        beforeAll((done: DoneFn) => {
            let model: KanbanModel = { enableTooltip: true };
            kanbanObj = util.createKanban(model, kanbanData, done);
            util.disableTooltipAnimation((kanbanObj.tooltipModule as any).tooltipObj);
        });

        afterAll(() => {
            util.destroy(kanbanObj);
        });
        it('mouse hover open tooltip', () => {
            let target: HTMLElement = kanbanObj.element.querySelector('.e-card .e-card-header .e-card-header-caption') as HTMLElement;
            expect(document.querySelector('.e-kanban-tooltip')).toBeNull();
            util.triggerMouseEvent(target, 'mouseover');
            let tooltipEle: HTMLElement = document.querySelector('.e-kanban-tooltip') as HTMLElement;
            expect(isVisible(tooltipEle)).toBe(true);
            expect(tooltipEle.innerText).toEqual('1');
            util.triggerMouseEvent(target, 'mouseleave');
            expect(document.querySelector('.e-kanban-tooltip')).toBeNull();
            let content: HTMLElement = kanbanObj.element.querySelector('.e-card .e-card-content .e-card-content-caption') as HTMLElement;
            expect(document.querySelector('.e-kanban-tooltip')).toBeNull();
            util.triggerMouseEvent(content, 'mouseover');
            let tooltipElement: HTMLElement = document.querySelector('.e-kanban-tooltip') as HTMLElement;
            expect(isVisible(tooltipElement)).toBe(true);
            expect(tooltipElement.innerText).toEqual('Analyze the new requirements gathered from the customer.');
            util.triggerMouseEvent(content, 'mouseleave');
            expect(document.querySelector('.e-kanban-tooltip')).toBeNull();
        });
    });

    describe('Check tooltip template', () => {
        let kanbanObj: Kanban;
        beforeAll((done: DoneFn) => {
            let model: KanbanModel = {
                enableTooltip: true,
                tooltipTemplate: '<div class="template" style="padding:5px;"><div>Assignee : ${Assignee}</div></div>'
            };
            kanbanObj = util.createKanban(model, kanbanData, done);
            util.disableTooltipAnimation((kanbanObj.tooltipModule as any).tooltipObj);
        });

        afterAll(() => {
            util.destroy(kanbanObj);
        });
        it('mouse hover open tooltip', () => {
            let target: HTMLElement = kanbanObj.element.querySelector('.e-card .e-card-header .e-card-header-caption') as HTMLElement;
            expect(document.querySelector('.e-kanban-tooltip')).toBeNull();
            util.triggerMouseEvent(target, 'mouseover');
            let tooltipEle: HTMLElement = document.querySelector('.e-kanban-tooltip') as HTMLElement;
            expect(isVisible(tooltipEle)).toBe(true);
            expect([].slice.call(tooltipEle.querySelectorAll('.template')).length).toEqual(1);
            util.triggerMouseEvent(target, 'mouseleave');
            expect(document.querySelector('.e-kanban-tooltip')).toBeNull();
        });
        it('change tooltip template through set model', () => {
            kanbanObj.tooltipTemplate = '<div class="template1" style="padding:5px;"><div>Assignee : ${Assignee}</div></div>';
            kanbanObj.dataBind();
            let target: HTMLElement = kanbanObj.element.querySelector('.e-card .e-card-header .e-card-header-caption') as HTMLElement;
            expect(document.querySelector('.e-kanban-tooltip')).toBeNull();
            util.triggerMouseEvent(target, 'mouseover');
            let tooltipEle: HTMLElement = document.querySelector('.e-kanban-tooltip') as HTMLElement;
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
            let model: KanbanModel = { enableTooltip: false };
            kanbanObj = util.createKanban(model, kanbanData, done);
        });

        afterAll(() => {
            util.destroy(kanbanObj);
        });
        it('hide tooltip on mouse hover', () => {
            let target: HTMLElement = kanbanObj.element.querySelector('.e-card .e-card-header .e-card-header-caption') as HTMLElement;
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
            let target: HTMLElement = kanbanObj.element.querySelector('.e-card .e-card-header .e-card-header-caption') as HTMLElement;
            expect(document.querySelector('.e-kanban-tooltip')).toBeNull();
            util.triggerMouseEvent(target, 'mouseover');
            let tooltipEle: HTMLElement = document.querySelector('.e-kanban-tooltip') as HTMLElement;
            expect(isVisible(tooltipEle)).toBe(true);
            util.triggerMouseEvent(target, 'mouseleave');
            expect(document.querySelector('.e-kanban-tooltip')).toBeNull();
        });
        it('hide tooltip through set model on mouse hover and checking e-control class on kanban element', () => {
            kanbanObj.enableTooltip = false;
            kanbanObj.dataBind();
            expect(kanbanObj.element.classList.contains('e-control')).toEqual(true);
            let target: HTMLElement = kanbanObj.element.querySelector('.e-card .e-card-header .e-card-header-caption');
            expect(document.querySelector('.e-kanban-tooltip')).toBeNull();
            util.triggerMouseEvent(target, 'mouseover');
            expect(document.querySelector('.e-kanban-tooltip')).toBeNull();
            util.triggerMouseEvent(target, 'mouseleave');
            expect(document.querySelector('.e-kanban-tooltip')).toBeNull();
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
