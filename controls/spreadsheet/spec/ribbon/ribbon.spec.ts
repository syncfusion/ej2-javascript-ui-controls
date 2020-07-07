import { Ribbon, RibbonItemModel } from '../../src/ribbon/index';
import { profile , inMB, getMemoryProfile } from './../common/common.spec';
import { createElement, selectAll } from '@syncfusion/ej2-base';
import { MenuItemModel } from '@syncfusion/ej2-navigations';

/**
 *  Ribbon test case
 */
describe('Ribbon ->', () => {
    beforeAll(() => {
        // tslint:disable-next-line:no-any
        const isDef: any = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            // tslint:disable-next-line:no-console
            console.log('Unsupported environment, window.performance.memory is unavailable');
            this.skip(); // skips test (in Chai)
            return;
        }
    });

    let ribbon: Ribbon;
    let items: RibbonItemModel[] = [
        {
            header: { text: 'Home' },
            content:  [
                { prefixIcon: 'e-cut-icon e-icons', tooltipText: 'Cut' },
                { prefixIcon: 'e-copy-icon e-icons', tooltipText: 'Copy' },
                { prefixIcon: 'e-paste-icon e-icons', tooltipText: 'Paste' },
                { type: 'Separator' },
                { prefixIcon: 'e-bold-icon e-icons', tooltipText: 'Bold' },
                { prefixIcon: 'e-italic-icon e-icons', tooltipText: 'Italic' },
                { prefixIcon: 'e-underline-icon e-icons', tooltipText: 'Underline' },
                { prefixIcon: 'e-color-icon e-icons', tooltipText: 'Color-Picker' },
                { type: 'Separator' },
                { prefixIcon: 'e-alignleft-icon e-icons', tooltipText: 'Align-Left' },
                { prefixIcon: 'e-alignright-icon e-icons', tooltipText: 'Align-Right' },
                { prefixIcon: 'e-aligncenter-icon e-icons', tooltipText: 'Align-Center' },
                { type: 'Separator' },
                { prefixIcon: 'e-ascending-icon e-icons', tooltipText: 'Sort A - Z' },
                { prefixIcon: 'e-descending-icon e-icons', tooltipText: 'Sort Z - A' }]
        },
        {
            header: { text: 'Insert' },
            content: [{ text: 'Link', tooltipText: 'Hyperlink' }, { type: 'Separator' }, { text: 'Picture', tooltipText: 'Picture' }]
        },
        {
            header: { text: 'View' },
            content: [{ text: 'Hide Headers', tooltipText: 'Hide Headers' }, { type: 'Separator' },
                { text: 'Hide Gridlines', tooltipText: 'Hide Gridlines' }]
        }];
    let menuItems: MenuItemModel[] = [{ text: 'File', items: [{ text: 'New' }, { text: 'Open' }, { text: 'Save' }] }];
    let element: HTMLElement = createElement('div');
    document.body.appendChild(element);

    describe('DOM checking ->', () => {

        afterEach(() => {
            ribbon.destroy();
        });

        it('Initial load with out menu items', () => {
            ribbon = new Ribbon({ items: items });
            ribbon.appendTo(element);
            expect(element.className).toEqual('e-control e-ribbon e-lib');
            expect(element.firstElementChild.classList.contains('e-tab')).toBeTruthy();
            let header: Element = element.firstElementChild.firstElementChild;
            expect(header.classList.contains('e-tab-header')).toBeTruthy();
            expect(ribbon.element.lastElementChild.className).toEqual('e-drop-icon e-icons');
            let tabItems: HTMLElement[] = selectAll('.e-toolbar-item', header);
            expect(tabItems.length).toBe(3);
            expect(tabItems[0].classList.contains('e-active')).toBeTruthy();
            let content: Element = element.firstElementChild.lastElementChild;
            expect(content.classList.contains('e-content')).toBeTruthy();
            expect(selectAll('.e-toolbar-item', content).length).toBe(15);
        });

        it('Initial load with menu items', () => {
            ribbon = new Ribbon({ items: items, menuItems: menuItems, menuType: true });
            ribbon.appendTo(element);
            let tbarItems: HTMLElement[] = selectAll('.e-toolbar-item', element.firstElementChild.firstElementChild);
            expect(tbarItems.length).toBe(4);
            expect(tbarItems[0].classList.contains('e-menu-tab')).toBeTruthy();
            expect(tbarItems[1].classList.contains('e-active')).toBeTruthy();
        });

    });

    it('memory leak', () => {
        profile.sample();
        // tslint:disable-next-line:no-any
        let average: any = inMB(profile.averageChange);
        // check average change in memory samples to not be over 10MB
        expect(average).toBeLessThan(10);
        // tslint:disable-next-line:no-any
        let memory: any = inMB(getMemoryProfile());
        // check the final memory usage against the first usage, there should be little change if everything was properly deallocated
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
    });
});