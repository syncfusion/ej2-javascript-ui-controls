/**
 * Kanban mobile spec 
 */
import { Browser } from '@syncfusion/ej2-base';
import { Popup } from '@syncfusion/ej2-popups';
import { Kanban, KanbanModel, EJ2Instance } from '../../src/kanban/index';
import { kanbanData } from './common/kanban-data.spec';
import { profile, inMB, getMemoryProfile } from './common/common.spec';
import * as util from './common/util.spec';

Kanban.Inject();

describe('Kanban mobile testing', () => {
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

    describe('Basic kanban in mobile device', () => {
        let kanbanObj: Kanban;
        let uA: string = Browser.userAgent;
        let androidUserAgent: string = 'Mozilla/5.0 (Linux; Android 9; Pixel XL Build/PPP3.180510.008) ' +
            'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.81 Mobile Safari/537.36';
        beforeAll((done: DoneFn) => {
            Browser.userAgent = androidUserAgent;
            let model: KanbanModel = { width: 300, height: 500 };
            kanbanObj = util.createKanban(model, kanbanData, done);
        });
        afterAll(() => {
            util.destroy(kanbanObj);
            Browser.userAgent = uA;
        });

        it('checking adaptive rendering or not', () => {
            expect(kanbanObj.isAdaptive).toEqual(true);
        });
    });

    describe('Swimlane kanban in mobile device', () => {
        let kanbanObj: Kanban;
        let uA: string = Browser.userAgent;
        let androidUserAgent: string = 'Mozilla/5.0 (Linux; Android 9; Pixel XL Build/PPP3.180510.008) ' +
            'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.81 Mobile Safari/537.36';
        beforeAll((done: DoneFn) => {
            Browser.userAgent = androidUserAgent;
            let model: KanbanModel = {
                width: 300, height: 500,
                swimlaneSettings: {
                    keyField: 'Assignee'
                }
            };
            kanbanObj = util.createKanban(model, kanbanData, done);
        });
        afterAll(() => {
            util.destroy(kanbanObj);
            Browser.userAgent = uA;
        });
        it('swimlane toolbar testing', () => {
            expect(kanbanObj.element.querySelectorAll('.e-swimlane-header')).toBeTruthy();
            expect(kanbanObj.element.querySelectorAll('.e-swimlane-header-toolbar').length).toEqual(1);
            expect(kanbanObj.element.querySelectorAll('.e-swimlane-header-toolbar .e-toolbar-menu').length).toEqual(1);
            expect(kanbanObj.element.querySelectorAll('.e-swimlane-header-toolbar .e-toolbar-level-title').length).toEqual(1);
            expect(kanbanObj.element.querySelectorAll('.e-toolbar-level-title .e-toolbar-swimlane-name').length).toEqual(1);
            expect(kanbanObj.element.querySelectorAll('.e-toolbar-menu .e-icon-menu').length).toEqual(1);
        });

        it('swimlane treeview testing', () => {
            expect(kanbanObj.element.querySelectorAll('.e-swimlane-content').length).toEqual(1);
            expect(kanbanObj.element.querySelectorAll('.e-swimlane-resource').length).toEqual(1);
            expect(kanbanObj.element.querySelectorAll('.e-swimlane-tree').length).toEqual(1);
            expect(kanbanObj.element.querySelectorAll('.e-swimlane-tree .e-list-item').length).toEqual(8);
        });

        it('swimlane menu click testing', () => {
            let treePopup: Popup = (kanbanObj.element.querySelector('.e-swimlane-resource') as EJ2Instance).ej2_instances[0] as Popup;
            treePopup.showAnimation = null;
            treePopup.hideAnimation = null;
            treePopup.dataBind();
            let menuElement: HTMLElement = kanbanObj.element.querySelector('.e-swimlane-header-toolbar .e-icon-menu');
            util.triggerMouseEvent(menuElement, 'click');
            expect(kanbanObj.element.querySelector('.e-swimlane-resource').classList.contains('e-popup-close')).toEqual(false);
            expect(kanbanObj.element.querySelector('.e-swimlane-resource').classList.contains('e-popup-open')).toEqual(true);
            expect(kanbanObj.element.querySelector('.e-swimlane-overlay').classList.contains('e-enable')).toEqual(true);
            expect(kanbanObj.element.querySelectorAll('.e-swimlane-tree .e-list-item').length).toEqual(8);
            expect(kanbanObj.element.querySelectorAll('.e-swimlane-tree .e-list-item.e-active').length).toEqual(1);
            util.triggerMouseEvent(menuElement, 'click');
            expect(kanbanObj.element.querySelector('.e-swimlane-resource').classList.contains('e-popup-open')).toEqual(false);
            expect(kanbanObj.element.querySelector('.e-swimlane-resource').classList.contains('e-popup-close')).toEqual(true);
            expect(kanbanObj.element.querySelector('.e-swimlane-overlay').classList.contains('e-enable')).toEqual(false);
        });

        it('resource node click testing', () => {
            let menuElement: HTMLElement = kanbanObj.element.querySelector('.e-swimlane-header-toolbar .e-icon-menu');
            util.triggerMouseEvent(menuElement, 'click');
            expect(kanbanObj.element.querySelectorAll('.e-card').length).toEqual(10);
            expect(kanbanObj.element.querySelector('.e-toolbar-level-title .e-toolbar-swimlane-name').innerHTML).toEqual('Andrew Fuller');
            let nodeElement: Element = kanbanObj.element.querySelector('.e-swimlane-tree .e-list-item:not(.e-has-child):not(.e-active)');
            (kanbanObj.layoutModule as any).treeSwimlaneClick({ event: new MouseEvent('mouseup'), name: 'nodeClicked', node: nodeElement });
            expect(kanbanObj.element.querySelectorAll('.e-card').length).toEqual(12);
            expect(kanbanObj.element.querySelector('.e-toolbar-level-title .e-toolbar-swimlane-name').innerHTML).toEqual('Janet Leverling');
        });
    });
    describe('Multi selection using mobile', () => {
        let kanbanObj: Kanban;
        let uA: string = Browser.userAgent;
        let androidUserAgent: string = 'Mozilla/5.0 (Linux; Android 9; Pixel XL Build/PPP3.180510.008) ' +
            'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.81 Mobile Safari/537.36';
        beforeAll((done: DoneFn) => {
            Browser.userAgent = androidUserAgent;
            let model: KanbanModel = {
                cardSettings: {
                    selectionType: 'Multiple'
                }
            };
            kanbanObj = util.createKanban(model, kanbanData, done);
        });
        afterAll(() => {
            util.destroy(kanbanObj);
            Browser.userAgent = uA;
        });

        it('checking adaptive rendering or not', () => {
            expect(kanbanObj.isAdaptive).toEqual(true);
            expect(kanbanObj.cardSettings.selectionType).toEqual('Multiple');
            let appElements: HTMLElement = kanbanObj.element.querySelector('.e-card');
            (kanbanObj.touchModule as any).tapHoldHandler({ originalEvent: { target: appElements, type: 'touchstart' } });
        });

        it('rendering the quick popup wrapper content', () => {
            let appElements: HTMLElement = kanbanObj.element.querySelector('.e-card');
            expect(kanbanObj.cardSettings.selectionType).toEqual('Multiple');
            expect(appElements.classList.contains('e-selection')).toBe(true);
            let eventPopup: HTMLElement = document.body.querySelector('.e-mobile-popup-wrapper') as HTMLElement;
            expect(eventPopup).not.toBeNull();
            expect(document.body.querySelector('.e-mobile-popup-wrapper').childElementCount).toEqual(2);
            expect(kanbanObj.element.querySelector('.e-card').getAttribute('data-id')).toEqual(eventPopup.innerText);
        });
        it('checking after close click', () => {
            let eventPopup: HTMLElement = document.body.querySelector('.e-mobile-popup-wrapper') as HTMLElement;
            let closeElement: HTMLElement = eventPopup.querySelector('.e-close');
            util.triggerMouseEvent(closeElement, 'click');
        });
        it('checking more than one card clicking', () => {
            let element: HTMLElement = kanbanObj.element.querySelector('.e-card[data-id="25"]') as HTMLElement;
            util.triggerMouseEvent(element, 'click');
        });
        it('checking after close click', () => {
            let element: HTMLElement = kanbanObj.element.querySelector('.e-card[data-id="25"]') as HTMLElement;
            expect(element.classList.contains('e-selection')).toBe(true);
            let appElements: HTMLElement = kanbanObj.element.querySelector('.e-card[data-id="2"]') as HTMLElement;
            (kanbanObj.touchModule as any).tapHoldHandler({ originalEvent: { target: appElements, type: 'touchstart' } });
        });
        it('checking the code content', () => {
            let eventPopup: HTMLElement = document.body.querySelector('.e-mobile-popup-wrapper') as HTMLElement;
            let closeElement: HTMLElement = eventPopup.querySelector('.e-close');
            util.triggerMouseEvent(closeElement, 'click');
        });
        it('checking selected card == one', () => {
            let element: HTMLElement = kanbanObj.element.querySelector('.e-card[data-id="25"]') as HTMLElement;
            util.triggerMouseEvent(element, 'click');
        });
        it('checking after close click', () => {
            let appElements: HTMLElement = kanbanObj.element.querySelector('.e-card[data-id="25"]') as HTMLElement;
            (kanbanObj.touchModule as any).tapHoldHandler({ originalEvent: { target: appElements, type: 'touchstart' } });
        });
        it('checking selected card == one', () => {
            let eventPopup: HTMLElement = document.body.querySelector('.e-mobile-popup-wrapper') as HTMLElement;
            let closeElement: HTMLElement = eventPopup.querySelector('.e-close');
            util.triggerMouseEvent(closeElement, 'click');
        });
        it('checking after close click', () => {
            let element: HTMLElement = kanbanObj.element.querySelector('.e-card[data-id="3"]') as HTMLElement;
            util.triggerMouseEvent(element, 'click');
        });
        it('checking after close click', () => {
            expect(kanbanObj.isAdaptive).toEqual(true);
            expect(kanbanObj.cardSettings.selectionType).toEqual('Multiple');
            let element: HTMLElement = kanbanObj.element.querySelector('.e-card[data-id="3"]') as HTMLElement;
            expect(element.classList.contains('e-selection')).toBe(true);
        });
    });

    describe('Multi selection using mobile', () => {
        let kanbanObj: Kanban;
        let uA: string = Browser.userAgent;
        let androidUserAgent: string = 'Mozilla/5.0 (Linux; Android 9; Pixel XL Build/PPP3.180510.008) ' +
            'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.81 Mobile Safari/537.36';
        beforeAll((done: DoneFn) => {
            Browser.userAgent = androidUserAgent;
            let model: KanbanModel = {
                cardSettings: {
                    selectionType: 'Multiple'
                }
            };
            kanbanObj = util.createKanban(model, kanbanData, done);
        });
        afterAll(() => {
            util.destroy(kanbanObj);
            Browser.userAgent = uA;
        });
        it('checking after close click', () => {
            expect(kanbanObj.isAdaptive).toEqual(true);
            expect(kanbanObj.cardSettings.selectionType).toEqual('Multiple');
            let element: HTMLElement = kanbanObj.element.querySelector('.e-card[data-id="3"]') as HTMLElement;
            util.triggerMouseEvent(element, 'click');
        });
        it('checking after close click', () => {
            let appElement: HTMLElement = kanbanObj.element.querySelector('.e-card[data-id="1"]') as HTMLElement;
            (kanbanObj.touchModule as any).tapHoldHandler({ originalEvent: { target: appElement, type: 'touchstart' } });

        });
        it('checking after close click', () => {
            let appElement: HTMLElement = kanbanObj.element.querySelector('.e-card[data-id="1"]') as HTMLElement;
            expect(appElement.classList.contains('e-selection')).toBe(true);
        });
        it('checking after close click', () => {
            let appElements: HTMLElement = kanbanObj.element.querySelector('.e-card[data-id="3"]') as HTMLElement;
            util.triggerMouseEvent(appElements, 'click');
        });
        it('checking after close click', () => {
            let appElements: HTMLElement = kanbanObj.element.querySelector('.e-card[data-id="1"]') as HTMLElement;
            util.triggerMouseEvent(appElements, 'click');
        });
        it('checking adaptive rendering or not', () => {
            expect(kanbanObj.isAdaptive).toEqual(true);
            expect(kanbanObj.cardSettings.selectionType).toEqual('Multiple');
            let appElements: HTMLElement = kanbanObj.element.querySelector('.e-card[data-id="1"]');
            (kanbanObj.touchModule as any).tapHoldHandler({ originalEvent: { target: appElements, type: 'touchstart' } });
        });
        it('checking adaptive rendering or not', () => {
            let appElements: HTMLElement = kanbanObj.element.querySelector('.e-card[data-id="1"]');
            expect(appElements.classList.contains('e-selection')).toBe(true);
            let appElement: HTMLElement = kanbanObj.element.querySelector('.e-card[data-id="2"]') as HTMLElement;
            util.triggerMouseEvent(appElement, 'click');
        });
        it('checking adaptive rendering or not', () => {
            let appElements: HTMLElement = kanbanObj.element.querySelector('.e-card[data-id="2"]');
            expect(appElements.classList.contains('e-selection')).toBe(true);
            let appElement: HTMLElement = kanbanObj.element.querySelector('.e-card[data-id="3"]') as HTMLElement;
            util.triggerMouseEvent(appElement, 'click');
        });
        it('checking adaptive rendering or not', () => {
            let appElements: HTMLElement = kanbanObj.element.querySelector('.e-card[data-id="3"]');
            expect(appElements.classList.contains('e-selection')).toBe(true);
            let appElement: HTMLElement = kanbanObj.element.querySelector('.e-card[data-id="2"]') as HTMLElement;
            util.triggerMouseEvent(appElement, 'click');
        });
    });
    describe('Multi selection using mobile', () => {
        let kanbanObj: Kanban;
        let uA: string = Browser.userAgent;
        let androidUserAgent: string = 'Mozilla/5.0 (Linux; Android 9; Pixel XL Build/PPP3.180510.008) ' +
            'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.81 Mobile Safari/537.36';
        beforeAll((done: DoneFn) => {
            Browser.userAgent = androidUserAgent;
            let model: KanbanModel = {
                cardSettings: {
                    selectionType: 'Multiple'
                }
            };
            kanbanObj = util.createKanban(model, kanbanData, done);
        });
        afterAll(() => {
            util.destroy(kanbanObj);
            Browser.userAgent = uA;
        });
        it('checking adaptive rendering or not', () => {
            expect(kanbanObj.isAdaptive).toEqual(true);
            expect(kanbanObj.cardSettings.selectionType).toEqual('Multiple');
            let element: HTMLElement = kanbanObj.element.querySelector('.e-card[data-id="3"]') as HTMLElement;
            util.triggerMouseEvent(element, 'click');
        });
        it('checking adaptive rendering or not', () => {
            let element: HTMLElement = kanbanObj.element.querySelector('.e-card[data-id="3"]') as HTMLElement;
            expect(element.classList.contains('e-selection')).toBe(true);
        });
        it('checking adaptive rendering or not', () => {
            let appElements: HTMLElement = kanbanObj.element.querySelector('.e-card[data-id="3"]');
            (kanbanObj.touchModule as any).tapHoldHandler({ originalEvent: { target: appElements, type: 'touchstart' } });
        });
        it('checking adaptive rendering or not', () => {
            let element: HTMLElement = kanbanObj.element.querySelector('.e-card[data-id="3"]') as HTMLElement;
            expect(element.classList.contains('e-selection')).toBe(true);
        });
    });

    it('memory leak', () => {
        profile.sample();
        // tslint:disable:no-any
        let average: any = inMB(profile.averageChange);
        //Check average change in memory samples to not be over 10MB
        expect(average).toBeLessThan(10);
        let memory: any = inMB(getMemoryProfile());
        //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
        // tslint:enable:no-any
    });
});
