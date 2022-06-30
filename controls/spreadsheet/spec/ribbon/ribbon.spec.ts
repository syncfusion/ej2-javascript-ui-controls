import { Ribbon, RibbonItemModel } from '../../src/ribbon/index';
import { profile , inMB, getMemoryProfile } from './../common/common.spec';
import { createElement, selectAll } from '@syncfusion/ej2-base';
import { MenuItemModel } from '@syncfusion/ej2-navigations';
import { SpreadsheetModel, Spreadsheet } from '../../src/spreadsheet/index';
import { SpreadsheetHelper } from '../spreadsheet/util/spreadsheethelper.spec';
import { defaultData } from '../spreadsheet/util/datasource.spec';

/**
 *  Ribbon test case
 */
describe('Ribbon ->', () => {
    let helper: SpreadsheetHelper;
    let model: SpreadsheetModel;
    beforeAll(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        helper = new SpreadsheetHelper('spreadsheet');
        const isDef: any = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            // eslint-disable-next-line no-console
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let average: any = inMB(profile.averageChange);
        // check average change in memory samples to not be over 10MB
        expect(average).toBeLessThan(10);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let memory: any = inMB(getMemoryProfile());
        // check the final memory usage against the first usage, there should be little change if everything was properly deallocated
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
    });
    describe('Menu collapsed state->', () => {
        beforeEach((done: Function) => {
            model = {
             sheets: [{ ranges: [{ dataSource: defaultData }] }],
            }
            helper.initializeSpreadsheet(model, done);
         });
        afterEach(() => {
            helper.invoke('destroy');
        });
    it('Initial load with collapsed state', () => {
        //document.getElementsByTagName("span")[0].click();
        (document.getElementsByClassName("e-ribbon")[0].children[1] as HTMLElement).click();
        let spredElem: HTMLElement = document.getElementsByClassName("e-ribbon")[0] as HTMLElement;
        expect(spredElem.classList.contains('e-collapsed')).toBeTruthy();
    });
})

    describe('Menu Item Disable->', () => {
        beforeEach((done: Function) => {
            model = {
             sheets: [{ ranges: [{ dataSource: defaultData }] }],
             fileMenuBeforeOpen: (): void => {
                 const spreadsheet: Spreadsheet = helper.getInstance();
                 spreadsheet.enableFileMenuItems(['New'], true, false);
             }  
            }
            helper.initializeSpreadsheet(model, done);
         });
        afterEach(() => {
            helper.invoke('destroy');
        });
        it('enableMenuItems->', (done: Function) => {
            document.getElementsByTagName("span")[0].click();
                (document.getElementsByClassName("e-menu")[0].firstElementChild as HTMLElement).click();
                setTimeout(function () {
                    var menuElem = document.getElementsByClassName("e-menu-item")[1];
                    expect(menuElem.classList.contains('e-disabled')).toBeFalsy();
                    var spreadsheet = helper.getInstance();
                    spreadsheet.enableFileMenuItems(['New'], false, false);
                    expect(menuElem.classList.contains('e-disabled')).toBeTruthy();
                    (document.getElementsByClassName("e-cell")[0] as HTMLElement).click();
                    done();
            },0);    
        });
    })
    describe('Hide Menu Item ->', () => {
        beforeEach((done: Function) => {
            model = {
             sheets: [{ ranges: [{ dataSource: defaultData }] }],
             created: (): void => {
                 const spreadsheet: Spreadsheet = helper.getInstance();
                 spreadsheet.hideFileMenuItems(['New'], false, false)
             }  
            }
            helper.initializeSpreadsheet(model, done);
         });
        afterEach(() => {
            helper.invoke('destroy');
        });
        it('hideMenuItems->', (done: Function) => {
            document.getElementsByTagName("span")[0].click();
               (document.getElementsByClassName("e-menu")[0].firstElementChild as HTMLElement).click();
                setTimeout(function () {
                    var menuElem = document.getElementsByClassName("e-menu-item")[1];
                    expect(menuElem.classList.contains('e-menu-hide')).toBeFalsy();
                    var spreadsheet = helper.getInstance();
                    spreadsheet.hideFileMenuItems(['New'], true, false);
                    expect(menuElem.classList.contains('e-menu-hide')).toBeTruthy();
                    (document.getElementsByClassName("e-cell")[0] as HTMLElement).click();
                    done();
            },0);    
        });
    })
    describe('Add Menu Item ->', () => {
        beforeEach((done: Function) => {
            model = {
             sheets: [{ ranges: [{ dataSource: defaultData }] }],
             created: (): void => {
                 const spreadsheet: Spreadsheet = helper.getInstance();
                 spreadsheet.hideFileMenuItems(['New'], false, false)
             }  
            }
            helper.initializeSpreadsheet(model, done);
         });
        afterEach(() => {
            helper.invoke('destroy');
        });
        it('addMenuItems->', (done: Function) => {
            document.getElementsByTagName("span")[0].click();
               (document.getElementsByClassName("e-menu")[0].firstElementChild as HTMLElement).click();
                setTimeout(function () {
                    let menuElemCount:number = document.getElementsByClassName('e-menu-parent e-ul')[0].querySelectorAll('.e-menu-item').length;
                    expect(menuElemCount).toBe(3);
                    let spreadsheet:Spreadsheet = helper.getInstance();
                    spreadsheet.addFileMenuItems([{text: 'Print'}], 'Save As', false, false);
                    menuElemCount = document.getElementsByClassName('e-menu-parent e-ul')[0].querySelectorAll('.e-menu-item').length;
                    expect(menuElemCount).toBe(4);
                    (document.getElementsByClassName("e-cell")[0] as HTMLElement).click();
                    done();
            },0);    
        });
    })
    describe('Hide Tab Item ->', () => {
        beforeEach((done: Function) => {
            model = {
             sheets: [{ ranges: [{ dataSource: defaultData }] }],
             created: (): void => {
                 const spreadsheet: Spreadsheet = helper.getInstance();
             }  
            }
            helper.initializeSpreadsheet(model, done);
         });
        afterEach(() => {
            helper.invoke('destroy');
        });
        it('hideRibbonTab->', (done: Function) => {
            document.getElementsByTagName("span")[0].click();
                setTimeout(function () {
                    let menuElemCount:number = document.getElementsByClassName('e-toolbar-items')[0].querySelectorAll('.e-hide').length;
                    expect(menuElemCount).toBe(0);
                    let spreadsheet:Spreadsheet = helper.getInstance();
                    spreadsheet.hideRibbonTabs(['Formulas', 'Insert'], true);
                    menuElemCount = document.getElementsByClassName('e-toolbar-items')[0].querySelectorAll('.e-hide').length;
                    expect(menuElemCount).toBe(2);
                    done();
            });    
        });
    })
    describe('Add Tab Item ->', () => {
        beforeEach((done: Function) => {
            model = {
             sheets: [{ ranges: [{ dataSource: defaultData }] }],
             created: (): void => {
                 const spreadsheet: Spreadsheet = helper.getInstance();
             }  
            }
            helper.initializeSpreadsheet(model, done);
         });
        afterEach(() => {
            helper.invoke('destroy');
        });
        it('addRibbonTab->', (done: Function) => {
            document.getElementsByTagName("span")[0].click();
                setTimeout(function () {
                    let toolbarElemCount:number = document.getElementsByClassName("e-toolbar-items")[0].querySelectorAll(".e-template").length;
                    expect(toolbarElemCount).toBe(6);
                    let spreadsheet:Spreadsheet = helper.getInstance();
                    spreadsheet.addRibbonTabs([{ header: { text: 'Custom' }, content: [{ text: 'Custom', tooltipText: 'Custom Btn' }] }], 'Data');
                    toolbarElemCount = document.getElementsByClassName('e-toolbar-items')[0].querySelectorAll('.e-template').length;
                    expect(toolbarElemCount).toBe(7);
                    done();
            },0);    
        });
    })
    describe('On Property Changed ->', () => {
        beforeEach((done: Function) => {
            model = {
             sheets: [{ ranges: [{ dataSource: defaultData }] }],
             created: (): void => {
                 const spreadsheet: Spreadsheet = helper.getInstance();
             }  
            }
            helper.initializeSpreadsheet(model, done);
         });
        afterEach(() => {
            helper.invoke('destroy');
        });
        it('onPropertyChanged->', (done: Function) => {
            document.getElementsByTagName("span")[0].click();
                    let spreadsheet:Spreadsheet = helper.getInstance();
                    expect(spreadsheet.showRibbon).toBeTruthy();
                    spreadsheet.showRibbon=false;
                    setTimeout(function () {
                    expect(spreadsheet.showRibbon).toBeFalsy();  
                    done();
                },0);
        });
    })
    describe('Add Toolbar Items ->', () => {
        beforeEach((done: Function) => {
            model = {
             sheets: [{ ranges: [{ dataSource: defaultData }] }],
             created: (): void => {
                 const spreadsheet: Spreadsheet = helper.getInstance();
             }  
            }
            helper.initializeSpreadsheet(model, done);
         });
        afterEach(() => {
            helper.invoke('destroy');
        });
        it('addtoolbaritems->', (done: Function) => {
            document.getElementsByTagName("span")[0].click();
                setTimeout(function () {
                    let toolbarElemCount:number = document.getElementsByClassName('e-toolbar-items')[1].querySelectorAll('.e-toolbar-item').length;
                    expect(toolbarElemCount).toBe(32);
                    let spreadsheet:Spreadsheet = helper.getInstance();
                    spreadsheet.addToolbarItems('Home', [{ type: 'Separator' }, { text: 'Custom', tooltipText: 'Custom Btn' }], 15);
                    toolbarElemCount = document.getElementsByClassName('e-toolbar-items')[1].querySelectorAll('.e-toolbar-item').length;
                    expect(toolbarElemCount).toBe(34);
                    done();
                },0);
        });
    })
    describe('Ribbon Item Selection ->', () => {
        beforeEach((done: Function) => {
            model = {
             sheets: [{ ranges: [{ dataSource: defaultData }] }],
             created: (): void => {
                 const spreadsheet: Spreadsheet = helper.getInstance();
             }  
            }
            helper.initializeSpreadsheet(model, done);
         });
        afterEach(() => {
            helper.invoke('destroy');
        });
        it('ribbonItemSelection->', (done: Function) => {
            document.getElementsByTagName("span")[0].click();
                setTimeout(function () {
                    var toolbarElem = document.getElementsByClassName('e-toolbar-items')[0].querySelectorAll('.e-toolbar-item')[2];
                    expect(toolbarElem.classList.contains('e-active')).toBeFalsy();
                    (document.getElementsByClassName('e-toolbar-items')[0].querySelectorAll('.e-toolbar-item')[2] as HTMLElement).click();
                    toolbarElem = document.getElementsByClassName('e-toolbar-items')[0].querySelectorAll('.e-toolbar-item')[2];
                    expect(toolbarElem.classList.contains('e-active')).toBeTruthy();
                    done();
                },0);
        });
    })
});