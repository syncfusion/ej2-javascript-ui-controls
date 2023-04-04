/* eslint-disable @typescript-eslint/no-explicit-any */

import { createElement, getComponent, isNullOrUndefined, remove } from "@syncfusion/ej2-base";
import { Button, CheckBox } from "@syncfusion/ej2-buttons";
import { ComboBox, FilteringEventArgs } from "@syncfusion/ej2-dropdowns";
import { ColorPicker } from "@syncfusion/ej2-inputs";
import { Query } from "@syncfusion/ej2-data";
import { DropDownButton, ItemModel, SplitButton, OpenCloseMenuEventArgs } from "@syncfusion/ej2-splitbuttons";
import { ExpandCollapseEventArgs, ItemOrientation, LauncherClickEventArgs, Ribbon, RibbonItemSize, RibbonItemType, DisplayMode, TabSelectedEventArgs, TabSelectingEventArgs } from "../../src/ribbon/base/index";
import { getMemoryProfile, inMB, profile } from "./common.spec";
import { RibbonTabModel } from "../../src/ribbon/models/ribbon-tab-model";
import { FileMenuSettingsModel, RibbonCollectionModel, RibbonGroupModel, RibbonItemModel, RibbonTooltipModel } from "../../src/ribbon/models/index";
import { RibbonColorPicker, RibbonFileMenu } from "../../src/index";

Ribbon.Inject(RibbonColorPicker, RibbonFileMenu);
function triggerMouseEvent(node: HTMLElement, eventType: string, x?: number, y?: number, relatedTarget?: any) {
    let mouseEve: MouseEvent = document.createEvent("MouseEvents");
    const relatedTargetElement = relatedTarget ? relatedTarget : null;
    if (x && y) {
        mouseEve.initMouseEvent(eventType, true, true, window, 0, 0, 0, x, y, false, false, false, false, 0, relatedTargetElement);
    } else {
        mouseEve.initEvent(eventType, true, true);
    }
    node.dispatchEvent(mouseEve);
}
let dropDownButtonItems: ItemModel[] = [
    { text: 'New tab' },
    { text: 'New window' },
    { text: 'New incognito window' },
    { separator: true },
    { text: 'Print' },
    { text: 'Cast' },
    { text: 'Find' }];
let sportsData: string[] = ['Badminton', 'Cricket', 'Football', 'Golf', 'Tennis'];

describe('Ribbon', () => {
    beforeAll(() => {
        const isDef: any = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log('Unsupported environment, window.performance.memory is unavailable');
            this.skip(); // skips test (in Chai)
            return;
        }
    });
    describe('Ribbon DOM', () => {
        let ribbon: Ribbon;
        let ribbonEle: HTMLElement;
        let containerEle: HTMLElement;
        beforeEach(() => {
            ribbonEle = createElement('div', { id: 'ribbon' });
            containerEle = createElement('div', { id: 'container', styles: 'width:600px' });
            containerEle.appendChild(ribbonEle);
            document.body.appendChild(containerEle);
        })
        afterEach(() => {
            if (ribbon) {
                ribbon.destroy();
                ribbon = undefined;
            }
            remove(ribbonEle);
            remove(containerEle);
        });
        it('Initial Rendering', () => {
            let ribbonEle1 = createElement('div', {});
            document.body.appendChild(ribbonEle1);
            ribbon = new Ribbon({
                enablePersistence: true,
                cssClass: 'customCss',
                tabs: [{
                    id: "tab1",
                    header: "tab1",
                    groups: [{
                        id: "group1",
                        header: "group1Header",
                        orientation: 'Column',
                        collections: [{
                            id: "collection1",
                            items: [{
                                id: "item1",
                                type: RibbonItemType.Button,
                                buttonSettings: {
                                    content: 'button1',
                                    iconCss: 'e-icons e-cut',
                                }
                            },]
                        }]
                    }]
                }, {
                    header: "tab2",
                    groups: [{
                        header: "group1Header",
                        orientation: ItemOrientation.Row,
                        collections: [{
                            items: [{
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Large,
                                buttonSettings: {
                                    content: 'button2',
                                    iconCss: 'e-icons e-cut',
                                }
                            }]
                        }, {
                            cssClass: 'noitem'
                        }]
                    }, {
                        cssClass: 'nocollection'
                    }]
                }, {
                    cssClass: 'group'
                }]
            }, ribbonEle1);
            expect(ribbon.tabObj).toBeDefined;
            expect(ribbon.tabObj.items.length).toBe(3);
            expect((ribbon.tabObj.items[0].header.text as HTMLElement).outerHTML).toBe('<span id="tab1_header">tab1</span>');
            expect(ribbon.element.querySelector('#tab1_content').innerHTML !== '').toBe(true);
            expect(isNullOrUndefined(ribbon.element.querySelector('#tab1_content').querySelector('#group1'))).toBe(false);
            expect(isNullOrUndefined(ribbon.element.querySelector('#group1').querySelector('#collection1'))).toBe(false);
            expect(isNullOrUndefined(ribbon.element.querySelector('#collection1').querySelector('#item1_container'))).toBe(false);
            expect(isNullOrUndefined(ribbon.element.querySelector('#item1_container').querySelector('#item1'))).toBe(false);
            expect(ribbon.element.querySelector('#item1').tagName.toLowerCase()).toBe('button');
            ribbon.setProperties({ selectedTab: 1 })
            expect(ribbon.element.querySelectorAll('.e-ribbon-group').length).toBe(3);
            expect(ribbon.element.querySelectorAll('.e-ribbon-tab-item').length).toBe(2);
            ribbon.setProperties({ selectedTab: 2 })
            expect(ribbon.element.querySelectorAll('.e-ribbon-tab-item').length).toBe(3);
            ribbon.destroy();
            ribbon = undefined;
            remove(ribbonEle1);
        });
        it('overflow mode', () => {
            ribbon = new Ribbon({
                enablePersistence: true,
                cssClass: 'customCss',
                tabs: [{
                    id: "tab1",
                    header: "tab1",
                    groups: [{
                        id: "group1",
                        header: "group1Header",
                        orientation: 'Row',
                        collections: [{
                            id: "collection1",
                            items: [{
                                id: "item1",
                                type: RibbonItemType.Button,
                                buttonSettings: {
                                    content: 'button1',
                                    iconCss: 'e-icons e-cut',
                                }
                            }]
                        }, {
                            id: "collection2",
                            items: [{
                                type: RibbonItemType.DropDown,
                                allowedSizes: RibbonItemSize.Medium,
                                dropDownSettings: {
                                    content: 'Edit',
                                    iconCss: 'e-icons e-edit',
                                    items: dropDownButtonItems
                                }
                            }]
                        }, {
                            id: "collection3",
                            items: [{
                                type: RibbonItemType.DropDown,
                                allowedSizes: RibbonItemSize.Medium,
                                dropDownSettings: {
                                    content: 'Edit1',
                                    iconCss: 'e-icons e-edit',
                                    items: dropDownButtonItems
                                }
                            }]
                        }, {
                            id: "collection4",
                            items: [{
                                type: RibbonItemType.DropDown,
                                allowedSizes: RibbonItemSize.Medium,
                                dropDownSettings: {
                                    content: 'Edit2 option',
                                    iconCss: 'e-icons e-edit',
                                    items: dropDownButtonItems
                                }
                            }]
                        }]
                    }]
                }]
            }, ribbonEle);
            expect(ribbon.tabObj.overflowMode).toBe('Popup');
        });  
        it('column orientation with 4 items', () => {
            ribbon = new Ribbon({
                enablePersistence: true,
                cssClass: 'customCss',
                tabs: [{
                    id: "tab1",
                    header: "tab1",
                    groups: [{
                        id: "group1",
                        header: "group1Header",
                        orientation: 'Column',
                        collections: [{
                            id: "collection1",
                            items: [{
                                id: "item1",
                                type: RibbonItemType.Button,
                                buttonSettings: {
                                    content: 'button1',
                                    iconCss: 'e-icons e-cut',
                                }
                            }, {
                                type: RibbonItemType.DropDown,
                                allowedSizes: RibbonItemSize.Medium,
                                dropDownSettings: {
                                    content: 'Edit',
                                    iconCss: 'e-icons e-edit',
                                    items: dropDownButtonItems
                                }
                            }, {
                                type: RibbonItemType.DropDown,
                                allowedSizes: RibbonItemSize.Medium,
                                dropDownSettings: {
                                    content: 'Edit1',
                                    iconCss: 'e-icons e-edit',
                                    items: dropDownButtonItems
                                }
                            }, {
                                type: RibbonItemType.DropDown,
                                allowedSizes: RibbonItemSize.Medium,
                                dropDownSettings: {
                                    content: 'Edit2 option',
                                    iconCss: 'e-icons e-edit',
                                    items: dropDownButtonItems
                                }
                            }]
                        }]
                    }]
                }]
            }, ribbonEle);
            expect(ribbon.element.querySelectorAll('.e-ribbon-item').length).toBe(3);
        });
        it('row orientation with 4 collection', () => {
            ribbon = new Ribbon({
                enablePersistence: true,
                cssClass: 'customCss',
                tabs: [{
                    id: "tab1",
                    header: "tab1",
                    groups: [{
                        id: "group1",
                        header: "group1Header",
                        orientation: 'Row',
                        collections: [{
                            id: "collection1",
                            items: [{
                                id: "item1",
                                type: RibbonItemType.Button,
                                buttonSettings: {
                                    content: 'button1',
                                    iconCss: 'e-icons e-cut',
                                }
                            }]
                        }, {
                            id: "collection2",
                            items: [{
                                type: RibbonItemType.DropDown,
                                allowedSizes: RibbonItemSize.Medium,
                                dropDownSettings: {
                                    content: 'Edit',
                                    iconCss: 'e-icons e-edit',
                                    items: dropDownButtonItems
                                }
                            }]
                        }, {
                            id: "collection3",
                            items: [{
                                type: RibbonItemType.DropDown,
                                allowedSizes: RibbonItemSize.Medium,
                                dropDownSettings: {
                                    content: 'Edit1',
                                    iconCss: 'e-icons e-edit',
                                    items: dropDownButtonItems
                                }
                            }]
                        }, {
                            id: "collection4",
                            items: [{
                                type: RibbonItemType.DropDown,
                                allowedSizes: RibbonItemSize.Medium,
                                dropDownSettings: {
                                    content: 'Edit2 option',
                                    iconCss: 'e-icons e-edit',
                                    items: dropDownButtonItems
                                }
                            }]
                        }]
                    }]
                }]
            }, ribbonEle);
            expect(ribbon.element.querySelectorAll('.e-ribbon-item').length).toBe(3);
            expect(ribbon.element.querySelectorAll('.e-ribbon-collection').length).toBe(3);

        });
        it('minimized mode- Classic layout', () => {
            ribbon = new Ribbon({
                enablePersistence: true,
                cssClass: 'customCss',
                tabs: [{
                    id: "tab1",
                    header: "tab1",
                    groups: [{
                        id: "group1",
                        header: "group1Header",
                        isCollapsible: false,
                        orientation: 'Column',
                        collections: [{
                            id: "collection1",
                            items: [{
                                id: "item1",
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Medium,
                                buttonSettings: {
                                    content: 'button1',
                                    iconCss: 'e-icons e-cut',
                                }
                            }]
                        }, {
                            id: "collection4",
                            items: [{
                                id: "item4",
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Medium,
                                buttonSettings: {
                                    content: 'button1',
                                    iconCss: 'e-icons e-cut',
                                }
                            }]
                        }]
                    }, {
                        id: "group2",
                        header: "group2Header",
                        isCollapsible: false,
                        orientation: 'Column',
                        collections: [{
                            id: "collection2",
                            items: [{
                                id: "item2",
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Medium,
                                buttonSettings: {
                                    content: 'button1',
                                    iconCss: 'e-icons e-cut',
                                }
                            }]
                        }, {
                            id: "collection5",
                            items: [{
                                id: "item5",
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Medium,
                                buttonSettings: {
                                    content: 'button1',
                                    iconCss: 'e-icons e-cut',
                                }
                            }]
                        }]
                    }, {
                        id: "group3",
                        header: "group3Header",
                        isCollapsible: false,
                        orientation: 'Column',
                        collections: [{
                            id: "collection3",
                            items: [{
                                id: "item3",
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Medium,
                                buttonSettings: {
                                    content: 'button1',
                                    iconCss: 'e-icons e-cut',
                                }
                            },]
                        }]
                    }]
                }, {
                    header: "tab2",
                    groups: [{
                        header: "group1Header",
                        orientation: ItemOrientation.Row,
                        collections: [{
                            items: [{
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Medium,
                                buttonSettings: {
                                    content: 'button2',
                                    iconCss: 'e-icons e-cut',
                                }
                            }]
                        }, {
                            cssClass: 'noitem'
                        }]
                    }, {
                        cssClass: 'nocollection'
                    }]
                }, {
                    cssClass: 'group'
                }]
            }, ribbonEle);
            containerEle.style.width = '400px';
            ribbon.refreshLayout();
            expect(document.querySelectorAll('.e-hscroll-bar').length).toBe(1);
            expect(ribbon.element.querySelector('.e-ribbon-collapse-btn') !== null).toBe(true);
            expect(ribbon.element.classList.contains('e-ribbon-minimize')).toBe(false);
            expect(ribbon.isMinimized).toBe(false);
            let li: HTMLElement = ribbon.element.querySelector('#tab1_header') as HTMLElement;
            triggerMouseEvent(li, 'dblclick');
            expect(ribbon.element.classList.contains('e-ribbon-minimize')).toBe(true);
            expect(document.querySelectorAll('.e-hscroll-bar').length).toBe(1);
            expect(ribbon.isMinimized).toBe(true);
            ribbon.setProperties({ isMinimized: false });
            expect(ribbon.element.classList.contains('e-ribbon-minimize')).toBe(false);
            expect(ribbon.isMinimized).toBe(false);
            ribbon.setProperties({ isMinimized: true });
            expect(ribbon.element.classList.contains('e-ribbon-minimize')).toBe(true);
            expect(ribbon.isMinimized).toBe(true);
            (ribbon.element.querySelector('.e-ribbon .e-tab-header .e-active .e-tab-text').firstElementChild as HTMLElement).click();
            expect(ribbon.element.classList.contains('e-ribbon-minimize')).toBe(false);
            expect(document.querySelectorAll('.e-hscroll-bar').length).toBe(1);
            expect(ribbon.isMinimized).toBe(false);
        });
        it('minimized mode- Simplified Mode', () => {
            ribbon = new Ribbon({
                enablePersistence: true,
                activeLayout: 'Simplified',
                cssClass: 'customCss',
                tabs: [{
                    id: "tab1",
                    header: "tab1",
                    groups: [{
                        id: "group1",
                        header: "group1Header",
                        orientation: 'Column',
                        collections: [{
                            id: "collection1",
                            items: [{
                                id: "item1",
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Medium,
                                buttonSettings: {
                                    content: 'button1',
                                    iconCss: 'e-icons e-cut',
                                }
                            },]
                        }]
                    }]
                }, {
                    header: "tab2",
                    groups: [{
                        header: "group1Header",
                        orientation: ItemOrientation.Row,
                        collections: [{
                            items: [{
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Medium,
                                buttonSettings: {
                                    content: 'button2',
                                    iconCss: 'e-icons e-cut',
                                }
                            }]
                        }, {
                            cssClass: 'noitem'
                        }]
                    }, {
                        cssClass: 'nocollection'
                    }]
                }, {
                    cssClass: 'group'
                }]
            }, ribbonEle);
            expect(ribbon.element.querySelector('.e-ribbon-collapse-btn') !== null).toBe(true);
            expect(ribbon.element.classList.contains('e-ribbon-minimize')).toBe(false);
            expect(ribbon.isMinimized).toBe(false);
            let li: HTMLElement = ribbon.element.querySelector('#tab1_header') as HTMLElement;
            triggerMouseEvent(li, 'dblclick');
            expect(ribbon.element.classList.contains('e-ribbon-minimize')).toBe(true);
            expect(ribbon.isMinimized).toBe(true);
            ribbon.setProperties({ isMinimized: false });
            expect(ribbon.element.classList.contains('e-ribbon-minimize')).toBe(false);
            expect(ribbon.isMinimized).toBe(false);
            ribbon.setProperties({ isMinimized: true });
            expect(ribbon.element.classList.contains('e-ribbon-minimize')).toBe(true);
            expect(ribbon.isMinimized).toBe(true);
            (ribbon.element.querySelector('.e-ribbon .e-tab-header .e-active .e-tab-text').firstElementChild as HTMLElement).click();
            expect(ribbon.element.classList.contains('e-ribbon-minimize')).toBe(false);
            expect(ribbon.isMinimized).toBe(false);
        });
    });
    describe('Ribbon Props', () => {
        let ribbon: Ribbon;
        let ribbonEle: HTMLElement;
        beforeEach(() => {
            ribbonEle = createElement('div', { id: 'ribbon' });
            document.body.appendChild(ribbonEle);
        })
        afterEach(() => {
            if (ribbon) {
                ribbon.destroy();
                ribbon = undefined;
            }
            remove(ribbonEle);
        });
        it('width', () => {
            ribbon = new Ribbon({
                cssClass: 'oldCss',
                width: '300px',
                locale: 'en-us',
                tabs: [{
                    id: "tab1",
                    header: "tab1",
                    groups: [{
                        id: "group1",
                        header: "group1Header",
                        orientation: ItemOrientation.Row,
                        collections: [{
                            id: "collection1",
                            items: [{
                                id: "item1",
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Large,
                                buttonSettings: {
                                    content: 'button1',
                                    iconCss: 'e-icons e-cut',
                                }
                            }]
                        }]
                    }]
                }]
            }, ribbonEle);
            expect(ribbon.element.style.width).toBe('300px');
            ribbon.setProperties({ width: '400px' });
            expect(ribbon.element.style.width).toBe('400px');
        });
        it('cssClass', () => {
            ribbon = new Ribbon({
                cssClass: 'oldCss',
                locale: 'en-us',
                tabs: [{
                    id: "tab1",
                    header: "tab1",
                    groups: [{
                        id: "group1",
                        header: "group1Header",
                        orientation: ItemOrientation.Row,
                        collections: [{
                            id: "collection1",
                            items: [{
                                id: "item1",
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Large,
                                buttonSettings: {
                                    content: 'button1',
                                    iconCss: 'e-icons e-cut',
                                }
                            }]
                        }]
                    }]
                }]
            }, ribbonEle);
            expect(ribbon.element.classList.contains('oldCss')).toBe(true);
            expect(ribbon.element.classList.contains('newClass')).toBe(false);
            ribbon.setProperties({ cssClass: 'newClass' });
            expect(ribbon.element.classList.contains('newClass')).toBe(true);
            expect(ribbon.element.classList.contains('oldCss')).toBe(false);
        });
        it('tabs', () => {
            let tabs: RibbonTabModel[] = [{
                header: "tab1",
                groups: [{
                    header: "group1Header",
                    orientation: ItemOrientation.Row,
                    collections: [{
                        items: [{
                            type: RibbonItemType.Button,
                            allowedSizes: RibbonItemSize.Large,
                            buttonSettings: {
                                content: 'button1',
                                iconCss: 'e-icons e-cut',
                            }
                        }]
                    }]
                }]
            }];
            ribbon = new Ribbon({
                tabs: tabs
            }, ribbonEle);
            expect(ribbon.tabObj.items.length).toBe(1);
            expect(ribbon.element.querySelectorAll('.e-tab-header .e-toolbar-item').length).toBe(1);
            expect(ribbon.element.querySelector('.e-ribbon-collapse-btn') !== null).toBe(true);
            tabs.push({
                header: "tab2",
                groups: [{
                    header: "group2Header",
                    orientation: ItemOrientation.Row,
                    collections: [{
                        items: [{
                            type: RibbonItemType.Button,
                            allowedSizes: RibbonItemSize.Large,
                            buttonSettings: {
                                content: 'button2',
                                iconCss: 'e-icons e-copy',
                            }
                        }]
                    }]
                }]
            });
            ribbon.setProperties({ tabs: tabs });
            expect(ribbon.tabObj.items.length).toBe(2);
            expect(ribbon.element.querySelectorAll('.e-tab-header .e-toolbar-item').length).toBe(2);
            expect(ribbon.element.querySelector('.e-ribbon-collapse-btn') !== null).toBe(true);
            ribbon.setProperties({ selectedTab: 1 });
            tabs.splice(1, 1);
            ribbon.setProperties({ tabs: tabs });
            expect(ribbon.tabObj.items.length).toBe(1);
            expect(ribbon.element.querySelectorAll('.e-tab-header .e-toolbar-item').length).toBe(1);
        });
        it('enablePersistence', () => {
            ribbon = new Ribbon({
                cssClass: 'oldCss',
                locale: 'en-us',
                tabs: [{
                    id: "tab1",
                    header: "tab1",
                    groups: [{
                        id: "group1",
                        header: "group1Header",
                        orientation: ItemOrientation.Row,
                        collections: [{
                            id: "collection1",
                            items: [{
                                id: "item1",
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Large,
                                buttonSettings: {
                                    content: 'button1',
                                    iconCss: 'e-icons e-cut',
                                }
                            }, {
                                type: RibbonItemType.DropDown,
                                allowedSizes: RibbonItemSize.Large,
                                id: "item2",
                                dropDownSettings: {
                                    content: 'Edit',
                                    iconCss: 'e-icons e-edit',
                                    items: dropDownButtonItems
                                }
                            }, {
                                id: "item3",
                                type: RibbonItemType.SplitButton,
                                allowedSizes: RibbonItemSize.Large,
                                splitButtonSettings: {
                                    content: 'Edit',
                                    iconCss: 'e-icons e-edit',
                                    items: dropDownButtonItems
                                }
                            }, {
                                id: "item4",
                                type: RibbonItemType.CheckBox,
                                checkBoxSettings: {
                                    label: 'Check1',
                                    checked: true,
                                }
                            }, {
                                id: "item5",
                                type: RibbonItemType.ColorPicker,
                                colorPickerSettings: {
                                    value: '#123456'
                                }
                            }, {
                                id: "item6",
                                type: RibbonItemType.ComboBox,
                                comboBoxSettings: {
                                    dataSource: sportsData,
                                    index: 1
                                }
                            }]
                        }]
                    }]
                }]
            }, ribbonEle);
            expect((ribbon.element.querySelector('#item1') as any).ej2_instances[0].enablePersistence).toBe(false);
            expect((ribbon.element.querySelector('#item2') as any).ej2_instances[0].enablePersistence).toBe(false);
            expect((ribbon.element.querySelector('#item3') as any).ej2_instances[0].enablePersistence).toBe(false);
            expect((ribbon.element.querySelector('#item4') as any).ej2_instances[0].enablePersistence).toBe(false);
            expect((ribbon.element.querySelector('#item5') as any).ej2_instances[0].enablePersistence).toBe(false);
            expect((ribbon.element.querySelector('#item6') as any).ej2_instances[0].enablePersistence).toBe(false);
            ribbon.setProperties({ enablePersistence: true });
            expect((ribbon.element.querySelector('#item1') as any).ej2_instances[0].enablePersistence).toBe(true);
            expect((ribbon.element.querySelector('#item2') as any).ej2_instances[0].enablePersistence).toBe(true);
            expect((ribbon.element.querySelector('#item3') as any).ej2_instances[0].enablePersistence).toBe(true);
            expect((ribbon.element.querySelector('#item4') as any).ej2_instances[0].enablePersistence).toBe(true);
            expect((ribbon.element.querySelector('#item5') as any).ej2_instances[0].enablePersistence).toBe(true);
            expect((ribbon.element.querySelector('#item6') as any).ej2_instances[0].enablePersistence).toBe(true);
        });
        it('activeLayout property with enablePersistence', () => {
            ribbon = new Ribbon({
                cssClass: 'oldCss',
                locale: 'en-us',
                enablePersistence: true,
                tabs: [{
                    id: "tab1",
                    header: "tab1",
                    groups: [{
                        id: "group1",
                        header: "group1Header",
                        orientation: ItemOrientation.Row,
                        collections: [{
                            id: "collection1",
                            items: [{
                                id: "item1",
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Large,
                                buttonSettings: {
                                    content: 'button1',
                                    iconCss: 'e-icons e-cut',
                                }
                            }, {
                                type: RibbonItemType.SplitButton,
                                allowedSizes: RibbonItemSize.Large,
                                id: "item2",
                                splitButtonSettings: {
                                    content: 'Edit',
                                    iconCss: 'e-icons e-edit',
                                    items: dropDownButtonItems
                                }
                            }, {
                                id: "item3",
                                type: RibbonItemType.SplitButton,
                                allowedSizes: RibbonItemSize.Large,
                                splitButtonSettings: {
                                    content: 'Edit',
                                    iconCss: 'e-icons e-edit',
                                    items: dropDownButtonItems
                                }
                            }, {
                                id: "item4",
                                type: RibbonItemType.CheckBox,
                                checkBoxSettings: {
                                    label: 'Check1',
                                    checked: true,
                                }
                            }, {
                                id: "item5",
                                type: RibbonItemType.ColorPicker,
                                colorPickerSettings: {
                                    value: '#123456'
                                }
                            }, {
                                id: "item6",
                                type: RibbonItemType.ComboBox,
                                comboBoxSettings: {
                                    dataSource: sportsData,
                                    index: 1
                                }
                            }]
                        }]
                    }]
                }]
            }, ribbonEle);
            expect(ribbon.activeLayout).toBe('Classic');
            ribbon.refreshLayout();
            expect(ribbon.activeLayout).toBe('Classic');
            ribbon.setProperties({ activeLayout: 'Simplified' });
            expect(ribbon.activeLayout).toBe('Simplified');
            ribbon.refreshLayout();
            expect(ribbon.activeLayout).toBe('Simplified');
            ribbon.setProperties({ enablePersistence: false });
            expect((ribbon.activeLayout) === 'Simplified').toBe(true);
            ribbon.refreshLayout();
            expect((ribbon.activeLayout) === 'Classic').toBe(false);
        });
        it('enableRtl', () => {
            let template1 = '<button id="btn1" class="tempContent">Button1</button>';
            ribbon = new Ribbon({
                cssClass: 'oldCss',
                locale: 'en-us',
                tabs: [{
                    id: "tab1",
                    header: "tab1",
                    groups: [{
                        id: "group1",
                        header: "group1Header",
                        orientation: ItemOrientation.Row,
                        collections: [{
                            id: "collection1",
                            items: [{
                                id: "item1",
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Large,
                                buttonSettings: {
                                    content: 'button1',
                                    iconCss: 'e-icons e-cut',
                                }
                            }, {
                                type: RibbonItemType.DropDown,
                                allowedSizes: RibbonItemSize.Large,
                                id: "item2",
                                dropDownSettings: {
                                    content: 'Edit',
                                    iconCss: 'e-icons e-edit',
                                    items: dropDownButtonItems
                                }
                            }, {
                                id: "item3",
                                type: RibbonItemType.SplitButton,
                                allowedSizes: RibbonItemSize.Large,
                                splitButtonSettings: {
                                    content: 'Edit',
                                    iconCss: 'e-icons e-edit',
                                    items: dropDownButtonItems
                                }
                            }, {
                                id: "item4",
                                type: RibbonItemType.CheckBox,
                                checkBoxSettings: {
                                    label: 'Check1',
                                    checked: true,
                                }
                            }, {
                                id: "item5",
                                type: RibbonItemType.ColorPicker,
                                colorPickerSettings: {
                                    value: '#123456'
                                }
                            }, {
                                id: "item6",
                                type: RibbonItemType.ComboBox,
                                comboBoxSettings: {
                                    dataSource: sportsData,
                                    index: 1
                                }
                            }, {
                                id: "item7",
                                type: RibbonItemType.Template,
                                itemTemplate: template1
                            }]
                        }]
                    }]
                }, {
                    header: "tab2",
                    groups: [{
                        header: "group1Header",
                        orientation: ItemOrientation.Row,
                        collections: [{
                            items: [{
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Large,
                                buttonSettings: {
                                    content: 'button2',
                                    iconCss: 'e-icons e-cut',
                                }
                            }]
                        }]
                    }]
                }]
            }, ribbonEle);
            expect(ribbon.element.classList.contains('e-rtl')).toBe(false);
            expect(ribbon.element.querySelector('.e-ribbon-tab').classList.contains('e-rtl')).toBe(false);
            expect(ribbon.element.querySelector('#item1').classList.contains('e-rtl')).toBe(false);
            expect(ribbon.element.querySelector('#item2').classList.contains('e-rtl')).toBe(false);
            expect(ribbon.element.querySelector('#item3').closest('.e-split-btn-wrapper').classList.contains('e-rtl')).toBe(false);
            expect(ribbon.element.querySelector('#item4').closest('.e-checkbox-wrapper').classList.contains('e-rtl')).toBe(false);
            expect(ribbon.element.querySelector('#item5').closest('.e-colorpicker-wrapper').classList.contains('e-rtl')).toBe(false);
            expect(ribbon.element.querySelector('#item6').closest('.e-ddl').classList.contains('e-rtl')).toBe(false);
            expect(ribbon.element.querySelector('#item7').classList.contains('e-rtl')).toBe(false);
            ribbon.enableRtl = true;
            ribbon.dataBind();
            expect(ribbon.element.classList.contains('e-rtl')).toBe(true);
            expect(ribbon.element.querySelector('.e-ribbon-tab').classList.contains('e-rtl')).toBe(true);
            expect(ribbon.element.querySelector('#item1').classList.contains('e-rtl')).toBe(true);
            expect(ribbon.element.querySelector('#item2').classList.contains('e-rtl')).toBe(true);
            expect(ribbon.element.querySelector('#item3').closest('.e-split-btn-wrapper').classList.contains('e-rtl')).toBe(true);
            expect(ribbon.element.querySelector('#item4').closest('.e-checkbox-wrapper').classList.contains('e-rtl')).toBe(true);
            expect(ribbon.element.querySelector('#item5').closest('.e-colorpicker-wrapper').classList.contains('e-rtl')).toBe(true);
            expect(ribbon.element.querySelector('#item6').closest('.e-ddl').classList.contains('e-rtl')).toBe(true);
            expect(ribbon.element.querySelector('#item7').classList.contains('e-rtl')).toBe(true);
            ribbon.setProperties({ enableRtl: false });
            expect(ribbon.element.classList.contains('e-rtl')).toBe(false);
            expect(ribbon.element.querySelector('.e-ribbon-tab').classList.contains('e-rtl')).toBe(false);
            expect(ribbon.element.querySelector('#item1').classList.contains('e-rtl')).toBe(false);
            expect(ribbon.element.querySelector('#item2').classList.contains('e-rtl')).toBe(false);
            expect(ribbon.element.querySelector('#item3').closest('.e-split-btn-wrapper').classList.contains('e-rtl')).toBe(false);
            expect(ribbon.element.querySelector('#item4').closest('.e-checkbox-wrapper').classList.contains('e-rtl')).toBe(false);
            expect(ribbon.element.querySelector('#item5').closest('.e-colorpicker-wrapper').classList.contains('e-rtl')).toBe(false);
            expect(ribbon.element.querySelector('#item6').closest('.e-ddl').classList.contains('e-rtl')).toBe(false);
            expect(ribbon.element.querySelector('#item7').classList.contains('e-rtl')).toBe(false);
        });
        it('locale', () => {
            ribbon = new Ribbon({
                cssClass: 'oldCss',
                locale: 'en-us',
                tabs: [{
                    id: "tab1",
                    header: "tab1",
                    groups: [{
                        id: "group1",
                        header: "group1Header",
                        orientation: ItemOrientation.Row,
                        collections: [{
                            id: "collection1",
                            items: [{
                                id: "item1",
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Large,
                                buttonSettings: {
                                    content: 'button1',
                                    iconCss: 'e-icons e-cut',
                                }
                            }, {
                                type: RibbonItemType.DropDown,
                                allowedSizes: RibbonItemSize.Large,
                                id: "item2",
                                dropDownSettings: {
                                    content: 'Edit',
                                    iconCss: 'e-icons e-edit',
                                    items: dropDownButtonItems
                                }
                            }, {
                                id: "item3",
                                type: RibbonItemType.SplitButton,
                                allowedSizes: RibbonItemSize.Large,
                                splitButtonSettings: {
                                    content: 'Edit',
                                    iconCss: 'e-icons e-edit',
                                    items: dropDownButtonItems
                                }
                            }, {
                                id: "item4",
                                type: RibbonItemType.CheckBox,
                                checkBoxSettings: {
                                    label: 'Check1',
                                    checked: true,
                                }
                            }, {
                                id: "item5",
                                type: RibbonItemType.ColorPicker,
                                colorPickerSettings: {
                                    value: '#123456'
                                }
                            }, {
                                id: "item6",
                                type: RibbonItemType.ComboBox,
                                comboBoxSettings: {
                                    dataSource: sportsData,
                                    index: 1
                                }
                            }]
                        }]
                    }]
                }]
            }, ribbonEle);
            expect((ribbon.element.querySelector('#item1') as any).ej2_instances[0].locale).toBe('en-us');
            expect((ribbon.element.querySelector('#item2') as any).ej2_instances[0].locale).toBe('en-us');
            expect((ribbon.element.querySelector('#item3') as any).ej2_instances[0].locale).toBe('en-us');
            expect((ribbon.element.querySelector('#item4') as any).ej2_instances[0].locale).toBe('en-us');
            expect((ribbon.element.querySelector('#item5') as any).ej2_instances[0].locale).toBe('en-us');
            expect((ribbon.element.querySelector('#item6') as any).ej2_instances[0].locale).toBe('en-us');
            ribbon.setProperties({ locale: 'de' });
            expect((ribbon.element.querySelector('#item1') as any).ej2_instances[0].locale).toBe('de');
            expect((ribbon.element.querySelector('#item2') as any).ej2_instances[0].locale).toBe('de');
            expect((ribbon.element.querySelector('#item3') as any).ej2_instances[0].locale).toBe('de');
            expect((ribbon.element.querySelector('#item4') as any).ej2_instances[0].locale).toBe('de');
            expect((ribbon.element.querySelector('#item5') as any).ej2_instances[0].locale).toBe('de');
            expect((ribbon.element.querySelector('#item6') as any).ej2_instances[0].locale).toBe('de');
        });
        it('selectedTab', () => {
            ribbon = new Ribbon({
                cssClass: 'oldCss',
                tabAnimation: { previous: { effect: 'None' }, next: { effect: 'None' } },
                locale: 'en-us',
                tabs: [{
                    id: "tab1",
                    header: "tab1",
                    groups: [{
                        id: "group1",
                        header: "group1Header",
                        orientation: ItemOrientation.Row,
                        collections: [{
                            id: "collection1",
                            items: [{
                                id: "item1",
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Large,
                                buttonSettings: {
                                    content: 'button1',
                                    iconCss: 'e-icons e-cut',
                                }
                            }]
                        }]
                    }]
                }, {
                    id: "tab2",
                    header: "tab2",
                    groups: [{
                        id: "group2",
                        header: "group1Header",
                        orientation: ItemOrientation.Row,
                        collections: [{
                            id: "collection2",
                            items: [{
                                id: "item2",
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Large,
                                buttonSettings: {
                                    content: 'button2',
                                    iconCss: 'e-icons e-cut',
                                }
                            }]
                        }]
                    }]
                }]
            }, ribbonEle);
            expect(ribbon.tabObj.items.length).toBe(2);
            expect((ribbon.tabObj.items[0].header.text as HTMLElement).outerHTML).toBe('<span id="tab1_header">tab1</span>');
            expect((ribbon.tabObj.items[1].header.text as HTMLElement).outerHTML).toBe('<span id="tab2_header">tab2</span>');
            expect((ribbon.element.querySelector('.e-tab-header .e-active') as HTMLElement).innerText.toLowerCase()).toBe('tab1');
            expect(ribbon.element.querySelectorAll('.e-ribbon-tab-item').length).toBe(1);
            expect(ribbon.element.querySelectorAll('.e-ribbon-group').length).toBe(1);
            expect(ribbon.element.querySelectorAll('.e-ribbon-collection').length).toBe(1);
            expect(ribbon.element.querySelectorAll('.e-ribbon-item').length).toBe(1);
            ribbon.setProperties({ tabAnimation: { previous: { effect: 'None' }, next: { effect: 'None' } } });
            ribbon.dataBind();
            ribbon.setProperties({ selectedTab: 1 });
            expect((ribbon.element.querySelector('.e-tab-header .e-active') as HTMLElement).innerText.toLowerCase()).toBe('tab2');
            expect(ribbon.element.querySelectorAll('.e-ribbon-tab-item').length).toBe(2);
            expect(ribbon.element.querySelectorAll('.e-ribbon-group').length).toBe(2);
            expect(ribbon.element.querySelectorAll('.e-ribbon-collection').length).toBe(2);
            expect(ribbon.element.querySelectorAll('.e-ribbon-item').length).toBe(2);
        });
        it('activeLayout', () => {
            let isfiltered: boolean = false;
            let template1 = '<button id="btn1" class="tempContent">Button1</button>';
            ribbon = new Ribbon({
                activeLayout: "Simplified",
                tabs: [{
                    id: "tab1",
                    header: "tab1",
                    groups: [{
                        id: "group1",
                        header: "group1Header",
                        orientation: ItemOrientation.Row,
                        collections: [{
                            id: "collection1",
                            items: [{
                                id: "item1",
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Medium,
                                buttonSettings: {
                                    content: 'button1',
                                    iconCss: 'e-icons e-cut',
                                }
                            }]
                        }, {
                            id: "collection2",
                            items: [{
                                id: "item2",
                                type: RibbonItemType.DropDown,
                                allowedSizes: RibbonItemSize.Medium,
                                dropDownSettings: {
                                    content: 'Edit',
                                    iconCss: 'e-icons e-edit',
                                    items: dropDownButtonItems
                                }
                            },
                            {
                                id: "item3",
                                type: RibbonItemType.ComboBox,
                                allowedSizes: RibbonItemSize.Small,
                                comboBoxSettings: {
                                    dataSource: sportsData,
                                    index: 1,
                                    allowFiltering: true,
                                    filtering: function (e: FilteringEventArgs) {
                                        isfiltered = true;
                                        let combobox_query = new Query();
                                        combobox_query = (e.text !== '') ? combobox_query.where('', 'contains', e.text, true) : combobox_query;
                                        e.updateData(sportsData, combobox_query);
                                    }
                                }
                            },
                            {
                                id: "item4",
                                type: RibbonItemType.ColorPicker,
                                allowedSizes: RibbonItemSize.Medium,
                                colorPickerSettings: {
                                    value: '#123456'
                                }
                            }]
                        }]
                    }]
                }, {
                    id: "tab2",
                    header: "tab2",
                    groups: [{
                        id: "group2",
                        header: "group1Header",
                        collections: [{
                            id: "collection2",
                            items: [{
                                id: "item5",
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Medium,
                                buttonSettings: {
                                    content: 'button2',
                                    iconCss: 'e-icons e-cut',
                                }
                            },
                            {
                                id: "item6",
                                type: RibbonItemType.CheckBox,
                                allowedSizes: RibbonItemSize.Medium,
                                checkBoxSettings: {
                                    label: 'Check1',
                                    checked: true,
                                }
                            },
                            {
                                id: "item7",
                                type: RibbonItemType.Template,
                                allowedSizes: RibbonItemSize.Small,
                                itemTemplate: template1
                            }]
                        }]
                    }]
                }]
            }, ribbonEle);
            expect(ribbon.activeLayout).toBe('Simplified');
            expect(ribbon.element.querySelector('.e-ribbon-collapse-btn') !== null).toBe(true);
            expect(ribbon.element.querySelectorAll('.e-ribbon-row').length).toBe(0);
            expect(ribbon.element.querySelectorAll('.e-ribbon-group-header').length).toBe(0);
            expect(ribbon.element.querySelectorAll('.e-ribbon-content-height').length).toBe(0);
            ribbon.setProperties({ activeLayout: 'Classic' });
            expect(ribbon.element.classList.contains('e-ribbon-minimize')).toBe(false);
            expect(ribbon.activeLayout).toBe('Classic');
            expect(ribbon.element.querySelector('.e-ribbon-collapse-btn') !== null).toBe(true);
            expect(ribbon.element.querySelectorAll('.e-ribbon-row').length).toBe(1);
            expect(ribbon.element.querySelectorAll('.e-ribbon-group-header').length).toBe(1);
            expect(ribbon.element.querySelectorAll('.e-ribbon-content-height').length).toBe(1);
            expect(ribbon.element.classList.contains('e-ribbon-minimize')).toBe(false);
        });
    });
    describe('Ribbon Methods', () => {
        let ribbon: Ribbon;
        let ribbonEle: HTMLElement;
        beforeEach(() => {
            ribbonEle = createElement('div', { id: 'ribbon' });
            document.body.appendChild(ribbonEle);
        })
        afterEach(() => {
            if (ribbon) {
                ribbon.destroy();
                ribbon = undefined;
            }
            remove(ribbonEle);
        });
        it('add/remove tab', () => {
            ribbon = new Ribbon({
                tabs: [{
                    id: "tab1",
                    header: "tab1",
                    groups: [{
                        id: "group1",
                        header: "group1Header",
                        collections: [{
                            id: "collection1",
                            items: [{
                                id: "item1",
                                type: RibbonItemType.Button,
                                buttonSettings: {
                                    content: 'button1',
                                    iconCss: 'e-icons e-cut',
                                }
                            },]
                        }]
                    }]
                }]
            }, ribbonEle);
            expect(ribbon.tabObj.items.length).toBe(1);
            expect((ribbon.tabObj.items[0].header.text as HTMLElement).outerHTML).toBe('<span id="tab1_header">tab1</span>');
            expect(ribbon.element.querySelectorAll('.e-ribbon-tab-item').length).toBe(1);
            expect(ribbon.element.querySelectorAll('.e-ribbon-group').length).toBe(1);
            expect(ribbon.element.querySelectorAll('.e-ribbon-collection').length).toBe(1);
            expect(ribbon.element.querySelectorAll('.e-ribbon-item').length).toBe(1);

            let tab: RibbonTabModel = {
                cssClass: "tab3CSS",
                id: 'newTab',
                header: "tab2",
                groups: [{
                    header: "group2Header",
                    orientation: 'Row',
                    collections: [{
                        items: [{
                            type: RibbonItemType.DropDown,
                            allowedSizes: RibbonItemSize.Large,
                            dropDownSettings: {
                                content: 'Edit',
                                iconCss: 'e-icons e-edit',
                                items: dropDownButtonItems
                            }
                        }, {
                            type: RibbonItemType.DropDown,
                            allowedSizes: RibbonItemSize.Large,
                            dropDownSettings: {
                                content: 'Edit1',
                                iconCss: 'e-icons e-edit',
                                items: dropDownButtonItems
                            }
                        }, {
                            type: RibbonItemType.DropDown,
                            allowedSizes: RibbonItemSize.Large,
                            dropDownSettings: {
                                content: 'Edit2 option',
                                iconCss: 'e-icons e-edit',
                                items: dropDownButtonItems
                            }
                        }]
                    }]
                }]
            }
            ribbon.addTab(tab);
            expect(ribbon.tabObj.items.length).toBe(2);
            ribbon.setProperties({ tabAnimation: { previous: { effect: "None" }, next: { effect: "None" } } });
            ribbon.selectTab('newTab');
            expect((ribbon.tabObj.items[1].header.text as HTMLElement).outerHTML).toBe('<span id="newTab_header">tab2</span>');
            expect(ribbon.element.querySelectorAll('.e-ribbon-tab-item').length).toBe(2);
            expect(ribbon.element.querySelectorAll('.e-ribbon-group').length).toBe(2);
            expect(ribbon.element.querySelectorAll('.e-ribbon-collection').length).toBe(2);
            expect(ribbon.element.querySelectorAll('.e-ribbon-item').length).toBe(4);
            ribbon.removeTab('sometab');//wrong ID
            expect(ribbon.element.querySelectorAll('.e-ribbon-tab-item').length).toBe(2);
            ribbon.removeTab('newTab');
            expect(ribbon.tabObj.items.length).toBe(1);
            expect(ribbon.element.querySelectorAll('.e-ribbon-tab-item').length).toBe(1);
            expect(ribbon.element.querySelectorAll('.e-ribbon-group').length).toBe(1);
            expect(ribbon.element.querySelectorAll('.e-ribbon-collection').length).toBe(1);
            expect(ribbon.element.querySelectorAll('.e-ribbon-item').length).toBe(1);
            ribbon.addTab(tab, 'tab1', false);// new tab before the current tab
            expect(ribbon.tabObj.items.length).toBe(2);
            expect((ribbon.tabObj.items[0].header.text as HTMLElement).outerHTML).toBe('<span id="newTab_header">tab2</span>');
            expect((ribbon.tabObj.items[1].header.text as HTMLElement).outerHTML).toBe('<span id="tab1_header">tab1</span>');
            ribbon.removeTab('newTab');
            expect(ribbon.tabObj.items.length).toBe(1);
            ribbon.addTab(tab, 'tab1', true); // new tab after the current tab
            expect(ribbon.tabObj.items.length).toBe(2);
            expect((ribbon.tabObj.items[0].header.text as HTMLElement).outerHTML).toBe('<span id="tab1_header">tab1</span>');
            expect((ribbon.tabObj.items[1].header.text as HTMLElement).outerHTML).toBe('<span id="newTab_header">tab2</span>');

            //To cover the wrong ID scenario, remove before render
            let tab1: RibbonTabModel = {
                header: "tab3",
                id: 'tab33',
                groups: [{
                    header: "group1Header",
                    orientation: ItemOrientation.Column,
                    collections: [{
                        items: [{
                            type: RibbonItemType.Button,
                            buttonSettings: {
                                content: 'button23',
                                iconCss: 'e-icons e-copy',
                            }
                        }, {
                            type: RibbonItemType.Button,
                            buttonSettings: {
                                content: 'button33',
                                iconCss: 'e-icons e-copy',
                            }
                        }, {
                            type: RibbonItemType.Button,
                            buttonSettings: {
                                content: 'button43',
                                iconCss: 'e-icons e-copy',
                            }
                        }, {
                            type: RibbonItemType.Button,
                            buttonSettings: {
                                content: 'button53',
                                iconCss: 'e-icons e-copy',
                            }
                        }]
                    }]
                }]
            };
            ribbon.addTab(tab1, 'tab5', true); //wrong ID
            expect(ribbon.tabObj.items.length).toBe(3);
            expect((ribbon.tabObj.items[2].header.text as HTMLElement).outerHTML).toBe('<span id="tab33_header">tab3</span>');
            ribbon.removeTab('tab33'); //Remove before tab content render
            ribbon.addTab(tab1);
            ribbon.setProperties({ selectedTab: 2 });
            ribbon.removeTab('tab33'); //Remove a not rendered item
        });
        it('add/remove group', () => {
            ribbon = new Ribbon({
                tabs: [{
                    id: "tab1",
                    header: "tab1",
                    groups: [{
                        id: "group1",
                        header: "group1Header",
                        collections: [{
                            id: "collection1",
                            items: [{
                                id: "item1",
                                type: RibbonItemType.Button,
                                buttonSettings: {
                                    content: 'button1',
                                    iconCss: 'e-icons e-cut',
                                }
                            },]
                        }]
                    }]
                }]
            }, ribbonEle);
            expect(ribbon.tabs[0].groups.length).toBe(1);
            expect((ribbon.element.querySelectorAll('.e-ribbon-group-header')[0] as HTMLElement).innerText).toBe('group1Header');
            expect(ribbon.element.querySelectorAll('.e-ribbon-group').length).toBe(1);
            expect(ribbon.element.querySelectorAll('.e-ribbon-collection').length).toBe(1);
            expect(ribbon.element.querySelectorAll('.e-ribbon-item').length).toBe(1);

            let group: RibbonGroupModel = {
                header: "group2Header",
                id: 'newGroup',
                orientation: 'Row',
                collections: [{
                    items: [{
                        type: RibbonItemType.DropDown,
                        allowedSizes: RibbonItemSize.Large,
                        dropDownSettings: {
                            content: 'Edit',
                            iconCss: 'e-icons e-edit',
                            items: dropDownButtonItems
                        }
                    }, {
                        type: RibbonItemType.DropDown,
                        allowedSizes: RibbonItemSize.Large,
                        dropDownSettings: {
                            content: 'Edit1',
                            iconCss: 'e-icons e-edit',
                            items: dropDownButtonItems
                        }
                    }, {
                        type: RibbonItemType.DropDown,
                        allowedSizes: RibbonItemSize.Large,
                        displayOptions: DisplayMode.Overflow,
                        dropDownSettings: {
                            content: 'Edit2 option',
                            iconCss: 'e-icons e-edit',
                            items: dropDownButtonItems
                        }
                    }]
                }]
            }
            ribbon.addGroup('tab1', group);
            expect(ribbon.tabs[0].groups.length).toBe(2);
            expect((ribbon.element.querySelectorAll('.e-ribbon-group-header')[0] as HTMLElement).innerText).toBe('group1Header');
            expect((ribbon.element.querySelectorAll('.e-ribbon-group-header')[1] as HTMLElement).innerText).toBe('group2Header');
            expect(ribbon.element.querySelectorAll('.e-ribbon-group').length).toBe(2);
            expect(ribbon.element.querySelectorAll('.e-ribbon-collection').length).toBe(2);
            expect(ribbon.element.querySelectorAll('.e-ribbon-item').length).toBe(4);
            ribbon.removeGroup('someGroup');
            expect(ribbon.tabs[0].groups.length).toBe(2);
            ribbon.removeGroup('newGroup');
            expect(ribbon.tabs[0].groups.length).toBe(1);
            expect((ribbon.element.querySelectorAll('.e-ribbon-group-header')[0] as HTMLElement).innerText).toBe('group1Header');
            expect(ribbon.element.querySelectorAll('.e-ribbon-group').length).toBe(1);
            expect(ribbon.element.querySelectorAll('.e-ribbon-collection').length).toBe(1);
            expect(ribbon.element.querySelectorAll('.e-ribbon-item').length).toBe(1);
            ribbon.addGroup('tab1', group, 'group1', false);
            expect(ribbon.tabs[0].groups.length).toBe(2);
            expect((ribbon.element.querySelectorAll('.e-ribbon-group-header')[0] as HTMLElement).innerText).toBe('group2Header');
            expect((ribbon.element.querySelectorAll('.e-ribbon-group-header')[1] as HTMLElement).innerText).toBe('group1Header');
            ribbon.removeGroup('newGroup');
            expect(ribbon.tabs[0].groups.length).toBe(1);
            ribbon.addGroup('tab1', group, 'group1', false);
            (ribbon.element.querySelector('.e-ribbon-collapse-btn') as HTMLElement).click();
            expect(ribbon.element.classList.contains('e-ribbon-minimize')).toBe(false);
            expect(ribbon.activeLayout).toBe('Simplified');
            expect(ribbon.tabs[0].groups.length).toBe(2);
            ribbon.removeGroup('newGroup');
            expect(ribbon.tabs[0].groups.length).toBe(1);
            (ribbon.element.querySelector('.e-ribbon-collapse-btn') as HTMLElement).click();
            ribbon.addGroup('tab1', group, 'group1', true);
            expect(ribbon.tabs[0].groups.length).toBe(2);
            expect((ribbon.element.querySelectorAll('.e-ribbon-group-header')[0] as HTMLElement).innerText).toBe('group1Header');
            expect((ribbon.element.querySelectorAll('.e-ribbon-group-header')[1] as HTMLElement).innerText).toBe('group2Header');

        });
        it('add/remove collection', () => {
            ribbon = new Ribbon({
                tabs: [{
                    id: "tab1",
                    header: "tab1",
                    groups: [{
                        id: "group1",
                        header: "group1Header",
                        orientation: 'Row',
                        collections: [{
                            id: "collection1",
                            cssClass: 'oldcss',
                            items: [{
                                id: "item1",
                                type: RibbonItemType.Button,
                                buttonSettings: {
                                    content: 'button1',
                                    iconCss: 'e-icons e-cut',
                                }
                            },]
                        }]
                    }]
                }, {
                    header: "tab2",
                    id: 'tab2',
                    groups: [{
                        header: "group1Header",
                        id: 'group2',
                        orientation: ItemOrientation.Row,
                        collections: [{
                            id: "collection2",
                            items: [{
                                id: "item2",
                                type: RibbonItemType.Button,
                                buttonSettings: {
                                    content: 'button2',
                                    iconCss: 'e-icons e-copy',
                                }
                            }]
                        }, {
                            id: "collection3",
                            items: [{
                                id: "item3",
                                type: RibbonItemType.Button,
                                buttonSettings: {
                                    content: 'button3',
                                    iconCss: 'e-icons e-copy',
                                }
                            }]
                        }, {
                            id: "collection4",
                            items: [{
                                id: "item4",
                                type: RibbonItemType.Button,
                                buttonSettings: {
                                    content: 'button4',
                                    iconCss: 'e-icons e-copy',
                                }
                            }]
                        }, {
                            id: "collection5",
                            items: [{
                                id: "item5",
                                type: RibbonItemType.Button,
                                buttonSettings: {
                                    content: 'button5',
                                    iconCss: 'e-icons e-copy',
                                }
                            }]
                        }]
                    }]
                }]
            }, ribbonEle);
            expect(ribbon.tabs[0].groups[0].collections.length).toBe(1);
            expect(ribbon.element.querySelectorAll('.e-ribbon-collection').length).toBe(1);
            expect(ribbon.element.querySelectorAll('.e-ribbon-item').length).toBe(1);

            let collection: RibbonCollectionModel = {
                id: 'newCollection',
                cssClass: 'newcss',
                items: [{
                    type: RibbonItemType.DropDown,
                    allowedSizes: RibbonItemSize.Small,
                    dropDownSettings: {
                        content: 'Edit',
                        iconCss: 'e-icons e-edit',
                        items: dropDownButtonItems
                    }
                }, {
                    type: RibbonItemType.DropDown,
                    allowedSizes: RibbonItemSize.Small,
                    dropDownSettings: {
                        content: 'Edit1',
                        iconCss: 'e-icons e-edit',
                        items: dropDownButtonItems
                    }
                }, {
                    type: RibbonItemType.DropDown,
                    allowedSizes: RibbonItemSize.Small,
                    displayOptions: DisplayMode.Overflow,
                    dropDownSettings: {
                        content: 'Edit2 option',
                        iconCss: 'e-icons e-edit',
                        items: dropDownButtonItems
                    }
                }]
            }
            ribbon.addCollection('group1', collection);
            expect(ribbon.tabs[0].groups[0].collections.length).toBe(2);
            expect((ribbon.element.querySelectorAll('.e-ribbon-collection')[0] as HTMLElement).classList.contains('oldcss')).toBe(true);
            expect((ribbon.element.querySelectorAll('.e-ribbon-collection')[1] as HTMLElement).classList.contains('newcss')).toBe(true);
            expect(ribbon.element.querySelectorAll('.e-ribbon-collection').length).toBe(2);
            expect(ribbon.element.querySelectorAll('.e-ribbon-item').length).toBe(4);
            ribbon.removeCollection('someCollection');
            expect(ribbon.tabs[0].groups[0].collections.length).toBe(2);
            ribbon.removeCollection('newCollection');
            expect(ribbon.tabs[0].groups[0].collections.length).toBe(1);
            expect((ribbon.element.querySelectorAll('.e-ribbon-collection')[0] as HTMLElement).classList.contains('oldcss')).toBe(true);
            expect(ribbon.element.querySelectorAll('.e-ribbon-collection').length).toBe(1);
            expect(ribbon.element.querySelectorAll('.e-ribbon-item').length).toBe(1);
            ribbon.addCollection('group1', collection, 'collection1', false);
            expect(ribbon.tabs[0].groups[0].collections.length).toBe(2);
            expect((ribbon.element.querySelectorAll('.e-ribbon-collection')[0] as HTMLElement).classList.contains('newcss')).toBe(true);
            expect((ribbon.element.querySelectorAll('.e-ribbon-collection')[1] as HTMLElement).classList.contains('oldcss')).toBe(true);
            ribbon.removeCollection('newCollection');
            expect(ribbon.tabs[0].groups[0].collections.length).toBe(1);
            ribbon.addCollection('group1', collection, 'collection1', false);
            (ribbon.element.querySelector('.e-ribbon-collapse-btn') as HTMLElement).click();
            expect(ribbon.element.classList.contains('e-ribbon-minimize')).toBe(false);
            expect(ribbon.activeLayout).toBe('Simplified');
            expect(ribbon.tabs[0].groups[0].collections.length).toBe(2);
            expect((ribbon.element.querySelectorAll('.e-ribbon-collection')[0] as HTMLElement).classList.contains('newcss')).toBe(true);
            expect((ribbon.element.querySelectorAll('.e-ribbon-collection')[1] as HTMLElement).classList.contains('oldcss')).toBe(true);
            ribbon.removeCollection('newCollection');
            expect(ribbon.tabs[0].groups[0].collections.length).toBe(1);
            (ribbon.element.querySelector('.e-ribbon-collapse-btn') as HTMLElement).click();
            ribbon.addCollection('group1', collection, 'collection1', true);
            expect(ribbon.tabs[0].groups[0].collections.length).toBe(2);
            expect((ribbon.element.querySelectorAll('.e-ribbon-collection')[0] as HTMLElement).classList.contains('oldcss')).toBe(true);
            expect((ribbon.element.querySelectorAll('.e-ribbon-collection')[1] as HTMLElement).classList.contains('newcss')).toBe(true);

            //to cover not rendered scenario ;
            let collection1: RibbonCollectionModel = {
                cssClass: 'newcss',
                id: 'customCol',
                items: [{
                    type: RibbonItemType.DropDown,
                    allowedSizes: RibbonItemSize.Small,
                    dropDownSettings: {
                        content: 'Edit',
                        iconCss: 'e-icons e-edit',
                        items: dropDownButtonItems
                    }
                }]
            }
            ribbon.addCollection('group20', [collection1].slice()[0])//wrong group
            ribbon.addCollection('group2', [collection1].slice()[0], 'someCollection', true);//add a collection for tab which is not rendered + wrong target
            ribbon.removeCollection('customCol');//remove a collection from tab which is not rendered
            ribbon.setProperties({ tabAnimation: { previous: { effect: "None" }, next: { effect: "None" } } });
            ribbon.selectTab('tab2');
            ribbon.removeCollection('collection5');//remove a collection  not rendered but tab rendered
        });
        it('add/remove item', () => {
            ribbon = new Ribbon({
                tabs: [{
                    id: "tab1",
                    header: "tab1",
                    groups: [{
                        id: "group1",
                        header: "group1Header",
                        enableGroupOverflow: true,
                        collections: [{
                            id: "collection1",
                            items: [{
                                id: "item1",
                                type: RibbonItemType.Button,
                                buttonSettings: {
                                    content: 'button1',
                                    iconCss: 'e-icons e-cut',
                                }
                            },]
                        },
                        ]
                    },
                    {
                        id: "group2",
                        header: "group2Header",
                        collections: [{
                            id: "collection2",
                            items: [{
                                id: "item2",
                                type: RibbonItemType.Button,
                                buttonSettings: {
                                    content: 'button1',
                                    iconCss: 'e-icons e-cut',
                                }
                            },]
                        },
                        ]
                    }]
                }, {
                    header: "tab2",
                    id: "tab2",
                    groups: [{
                        header: "group1Header",
                        collections: [{
                            id: "collection2",
                            items: [{
                                id: "item2",
                                type: RibbonItemType.Button,
                                buttonSettings: {
                                    content: 'button2',
                                    iconCss: 'e-icons e-copy',
                                }
                            }, {
                                id: "item3",
                                type: RibbonItemType.Button,
                                buttonSettings: {
                                    content: 'button3',
                                    iconCss: 'e-icons e-copy',
                                }
                            }, {
                                id: "item4",
                                type: RibbonItemType.Button,
                                buttonSettings: {
                                    content: 'button4',
                                    iconCss: 'e-icons e-copy',
                                }
                            }, {
                                id: "item5",
                                type: RibbonItemType.Button,
                                buttonSettings: {
                                    content: 'button5',
                                    iconCss: 'e-icons e-copy',
                                }
                            }]
                        }]
                    }]
                }]
            }, ribbonEle);
            expect(ribbon.tabs[0].groups[0].collections[0].items.length).toBe(1);
            expect(ribbon.element.querySelectorAll('.e-ribbon-item').length).toBe(2);

            let item: RibbonItemModel = {
                type: RibbonItemType.DropDown,
                allowedSizes: RibbonItemSize.Small,
                displayOptions: DisplayMode.Overflow,
                id: 'newItem',
                dropDownSettings: {
                    content: 'Edit',
                    iconCss: 'e-icons e-edit',
                    items: dropDownButtonItems
                }
            }
            ribbon.addItem('collection1', item);
            expect(ribbon.tabs[0].groups[0].collections[0].items.length).toBe(2);
            expect((ribbon.element.querySelectorAll('.e-ribbon-item')[0].firstElementChild).classList.contains('e-dropdown-btn')).toBe(false);
            expect((ribbon.element.querySelectorAll('.e-ribbon-item')[1].firstElementChild).classList.contains('e-dropdown-btn')).toBe(true);
            expect(ribbon.element.querySelectorAll('.e-ribbon-item').length).toBe(3);
            ribbon.removeItem('someItem');
            expect(ribbon.tabs[0].groups[0].collections[0].items.length).toBe(2);
            ribbon.removeItem('newItem');
            expect(ribbon.tabs[0].groups[0].collections[0].items.length).toBe(1);
            expect(ribbon.element.querySelectorAll('.e-ribbon-item').length).toBe(2);
            (ribbon.element.querySelector('.e-ribbon-collapse-btn') as HTMLElement).click();
            expect(ribbon.element.classList.contains('e-ribbon-minimize')).toBe(false);
            expect(ribbon.activeLayout).toBe('Simplified');
            ribbon.addItem('collection1', item);
            expect(ribbon.tabs[0].groups[0].collections[0].items.length).toBe(2);
            expect((ribbon.element.querySelectorAll('.e-ribbon-item')[0].firstElementChild).classList.contains('e-dropdown-btn')).toBe(false);
            expect((ribbon.element.querySelectorAll('.e-ribbon-item')[1].firstElementChild).classList.contains('e-dropdown-btn')).toBe(false);
            expect(ribbon.element.querySelectorAll('.e-ribbon-item').length).toBe(2);
            expect(ribbon.element.querySelectorAll('.e-ribbon-group-of-btn').length).toBe(1);
            ribbon.removeItem('newItem');
            expect(ribbon.element.querySelectorAll('.e-ribbon-group-of-btn').length).toBe(0);
            ribbon.addItem('collection2', item);
            expect(ribbon.tabs[0].groups[0].collections[0].items.length).toBe(1);
            expect((ribbon.element.querySelectorAll('.e-ribbon-item')[0].firstElementChild).classList.contains('e-dropdown-btn')).toBe(false);
            expect((ribbon.element.querySelectorAll('.e-ribbon-item')[1].firstElementChild).classList.contains('e-dropdown-btn')).toBe(false);
            expect(ribbon.element.querySelectorAll('.e-ribbon-item').length).toBe(2);
            expect(ribbon.element.querySelectorAll('.e-ribbon-overall-of-btn').length).toBe(1);
            ribbon.removeItem('newItem');
            expect(ribbon.element.querySelectorAll('.e-ribbon-overall-of-btn').length).toBe(0);
            (ribbon.element.querySelector('.e-ribbon-collapse-btn') as HTMLElement).click();
            expect(ribbon.element.classList.contains('e-ribbon-minimize')).toBe(false);
            expect(ribbon.activeLayout).toBe('Classic');
            ribbon.addItem('collection1', item, 'item1', false);
            expect(ribbon.tabs[0].groups[0].collections[0].items.length).toBe(2);
            expect((ribbon.element.querySelectorAll('.e-ribbon-item')[0].firstElementChild).classList.contains('e-dropdown-btn')).toBe(true);
            expect((ribbon.element.querySelectorAll('.e-ribbon-item')[1].firstElementChild).classList.contains('e-dropdown-btn')).toBe(false);
            ribbon.removeItem('newItem');
            expect(ribbon.tabs[0].groups[0].collections[0].items.length).toBe(1);
            ribbon.addItem('collection1', item, 'item1', true);
            expect(ribbon.tabs[0].groups[0].collections[0].items.length).toBe(2);
            expect((ribbon.element.querySelectorAll('.e-ribbon-item')[0].firstElementChild).classList.contains('e-dropdown-btn')).toBe(false);
            expect((ribbon.element.querySelectorAll('.e-ribbon-item')[1].firstElementChild).classList.contains('e-dropdown-btn')).toBe(true);
            //to cover not rendered scenario ;
            let item1: RibbonItemModel = {
                type: RibbonItemType.DropDown,
                allowedSizes: RibbonItemSize.Small,
                dropDownSettings: {
                    content: 'Edit',
                    iconCss: 'e-icons e-edit',
                    items: dropDownButtonItems
                }
            }
            ribbon.addItem('collection1', [item1].slice()[0], 'item15', true); //wrong target
            ribbon.addItem('collection10', [item1].slice()[0]);//wrong collection
            ribbon.removeItem('item5');//remove an item from tab which is not rendered
            ribbon.addItem('collection2', [item1].slice()[0], 'item2', false);//add an item from tab which is not rendered
            ribbon.setProperties({ tabAnimation: { previous: { effect: "None" }, next: { effect: "None" } } });
            ribbon.selectTab('tab2');
            ribbon.removeItem('item4');//remove an item  not rendered but tab rendered
        });
        it('enable/disable item', () => {
            let template1 = '<button id="btn1" class="tempContent">Button1</button>';
            let template2 = '<button id="btn2" class="tempContent">Button2</button>';
            ribbon = new Ribbon({
                tabs: [{
                    id: "tab1",
                    header: "tab1",
                    groups: [{
                        id: "group1",
                        header: "group1Header",
                        orientation: ItemOrientation.Row,
                        collections: [{
                            id: "collection1",
                            items: [{
                                id: "item1",
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Large,
                                buttonSettings: {
                                    content: 'button1',
                                    iconCss: 'e-icons e-cut',
                                }
                            }, {
                                type: RibbonItemType.DropDown,
                                allowedSizes: RibbonItemSize.Large,
                                id: "item2",
                                dropDownSettings: {
                                    content: 'Edit',
                                    iconCss: 'e-icons e-edit',
                                    items: dropDownButtonItems
                                }
                            }, {
                                id: "item3",
                                type: RibbonItemType.SplitButton,
                                allowedSizes: RibbonItemSize.Large,
                                splitButtonSettings: {
                                    content: 'Edit',
                                    iconCss: 'e-icons e-edit',
                                    items: dropDownButtonItems
                                }
                            }, {
                                id: "item4",
                                type: RibbonItemType.CheckBox,
                                checkBoxSettings: {
                                    label: 'Check1',
                                    checked: true,
                                }
                            }, {
                                id: "item5",
                                type: RibbonItemType.ColorPicker,
                                colorPickerSettings: {
                                    value: '#123456'
                                }
                            }, {
                                id: "item6",
                                type: RibbonItemType.ComboBox,
                                comboBoxSettings: {
                                    dataSource: sportsData,
                                    index: 1
                                }
                            }, {
                                id: "item7",
                                type: RibbonItemType.Template,
                                itemTemplate: template1
                            }, {
                                id: "item8",
                                type: RibbonItemType.Template,
                                itemTemplate: template2,
                                disabled: true
                            }]
                        }]
                    }]
                }]
            }, ribbonEle);
            expect(ribbon.element.querySelector('#item1').hasAttribute('disabled')).toBe(false);
            expect(ribbon.element.querySelector('#item2').hasAttribute('disabled')).toBe(false);
            expect(ribbon.element.querySelector('#item3').hasAttribute('disabled')).toBe(false);
            expect(ribbon.element.querySelector('#item4').hasAttribute('disabled')).toBe(false);
            expect(ribbon.element.querySelector('#item5').parentElement.querySelector('.e-dropdown-btn').hasAttribute('disabled')).toBe(false);
            expect(ribbon.element.querySelector('#item6').hasAttribute('disabled')).toBe(false);
            expect(ribbon.element.querySelector('#item7').hasAttribute('disabled')).toBe(false);
            expect(ribbon.element.querySelector('#item7').classList.contains('e-disabled')).toBe(false);
            expect(ribbon.element.querySelector('#item8').hasAttribute('disabled')).toBe(true);
            expect(ribbon.element.querySelector('#item8').classList.contains('e-disabled')).toBe(true);
            ribbon.disableItem('item1');
            ribbon.disableItem('item2');
            ribbon.disableItem('item3');
            ribbon.disableItem('item4');
            ribbon.disableItem('item5');
            ribbon.disableItem('item6');
            ribbon.disableItem('item7');
            expect(ribbon.element.querySelector('#item1').hasAttribute('disabled')).toBe(true);
            expect(ribbon.element.querySelector('#item2').hasAttribute('disabled')).toBe(true);
            expect(ribbon.element.querySelector('#item3').hasAttribute('disabled')).toBe(true);
            expect(ribbon.element.querySelector('#item4').hasAttribute('disabled')).toBe(true);
            expect(ribbon.element.querySelector('#item5').parentElement.querySelector('.e-dropdown-btn').hasAttribute('disabled')).toBe(true);
            expect(ribbon.element.querySelector('#item6').hasAttribute('disabled')).toBe(true);
            expect(ribbon.element.querySelector('#item7').hasAttribute('disabled')).toBe(true);
            expect(ribbon.element.querySelector('#item7').classList.contains('e-disabled')).toBe(true);
            ribbon.enableItem('item1');
            ribbon.enableItem('item2');
            ribbon.enableItem('item3');
            ribbon.enableItem('item4');
            ribbon.enableItem('item5');
            ribbon.enableItem('item6');
            ribbon.enableItem('item7');
            expect(ribbon.element.querySelector('#item1').hasAttribute('disabled')).toBe(false);
            expect(ribbon.element.querySelector('#item2').hasAttribute('disabled')).toBe(false);
            expect(ribbon.element.querySelector('#item3').hasAttribute('disabled')).toBe(false);
            expect(ribbon.element.querySelector('#item4').hasAttribute('disabled')).toBe(false);
            expect(ribbon.element.querySelector('#item5').parentElement.querySelector('.e-dropdown-btn').hasAttribute('disabled')).toBe(false);
            expect(ribbon.element.querySelector('#item6').hasAttribute('disabled')).toBe(false);
            expect(ribbon.element.querySelector('#item7').hasAttribute('disabled')).toBe(false);
            expect(ribbon.element.querySelector('#item7').classList.contains('e-disabled')).toBe(false);
            //To cover wrong ID
            ribbon.enableItem('item16');
        });
    });

    describe('Ribbon items DOM', () => {
        let ribbon: Ribbon;
        let ribbonEle: HTMLElement;
        beforeEach(() => {
            ribbonEle = createElement('div', { id: 'ribbon' });
            document.body.appendChild(ribbonEle);
        })
        afterEach(() => {
            if (ribbon) {
                ribbon.destroy();
                ribbon = undefined;
            }
            remove(ribbonEle);
        });
        it('Initial Rendering with button', () => {
            ribbon = new Ribbon({
                tabs: [{
                    id: "tab1",
                    header: "tab1",
                    groups: [{
                        id: "group1",
                        header: "group1Header",
                        orientation: 'Column',
                        collections: [{
                            id: "collection1",
                            items: [{
                                id: "item1",
                                type: RibbonItemType.Button,
                                buttonSettings: {
                                    content: 'button1',
                                    iconCss: 'e-icons e-cut'
                                }
                            },]
                        }]
                    }]
                }]
            }, ribbonEle);
            expect(ribbon.element.querySelector('#item1').tagName.toLowerCase()).toBe('button');
            expect((getComponent('item1', Button) as Button).getModuleName()).toBe('btn');
            expect((ribbon.element.querySelector('#item1') as HTMLElement).innerText.toLowerCase()).toBe('button1');
            expect(isNullOrUndefined((ribbon.element.querySelector('#item1') as HTMLElement).querySelector('.e-cut'))).toBe(false);
        });
        it('Initial Rendering with dropdownbutton', () => {
            ribbon = new Ribbon({
                tabs: [{
                    id: "tab1",
                    header: "tab1",
                    groups: [{
                        id: "group1",
                        header: "group1Header",
                        orientation: 'Column',
                        collections: [{
                            id: "collection1",
                            items: [{
                                id: "item1",
                                type: RibbonItemType.DropDown,
                                allowedSizes: RibbonItemSize.Large,
                                dropDownSettings: {
                                    content: 'Edit',
                                    iconCss: 'e-icons e-edit',
                                    items: dropDownButtonItems
                                }
                            }]
                        }]
                    }]
                }]
            }, ribbonEle);
            expect(ribbon.element.querySelector('#item1').tagName.toLowerCase()).toBe('button');
            expect((getComponent('item1', DropDownButton) as DropDownButton).getModuleName()).toBe('dropdown-btn');
            expect((ribbon.element.querySelector('#item1') as HTMLElement).innerText.toLowerCase()).toBe('edit');
            expect(isNullOrUndefined((ribbon.element.querySelector('#item1') as HTMLElement).querySelector('.e-edit'))).toBe(false);
            expect(isNullOrUndefined(document.querySelector('#item1-popup'))).toBe(false);
            (ribbon.element.querySelector('#item1') as HTMLElement).click();
            expect((document.querySelector('#item1-popup') as HTMLElement).querySelectorAll('li').length).toBe(7);
        });
        it('Initial Rendering with splitbutton', () => {
            ribbon = new Ribbon({
                tabs: [{
                    id: "tab1",
                    header: "tab1",
                    groups: [{
                        id: "group1",
                        header: "group1Header",
                        orientation: 'Column',
                        collections: [{
                            id: "collection1",
                            items: [{
                                id: "item1",
                                type: RibbonItemType.SplitButton,
                                allowedSizes: RibbonItemSize.Large,
                                splitButtonSettings: {
                                    content: 'Edit',
                                    iconCss: 'e-icons e-edit',
                                    items: dropDownButtonItems
                                }
                            }]
                        }]
                    }]
                }]
            }, ribbonEle);
            expect(ribbon.element.querySelector('#item1').tagName.toLowerCase()).toBe('button');
            expect((getComponent('item1', SplitButton) as SplitButton).getModuleName()).toBe('split-btn');
            expect((ribbon.element.querySelector('#item1') as HTMLElement).innerText.toLowerCase()).toBe('');
            expect((ribbon.element.querySelector('#item1_dropdownbtn') as HTMLElement).innerText.toLowerCase()).toBe('edit');
            expect(isNullOrUndefined((ribbon.element.querySelector('#item1') as HTMLElement).querySelector('.e-edit'))).toBe(false);
            expect(ribbon.element.querySelector('#item1').parentElement.querySelectorAll('button').length).toBe(2);
            expect(isNullOrUndefined(document.querySelector('#item1_dropdownbtn-popup'))).toBe(false);
            (ribbon.element.querySelector('#item1_dropdownbtn') as HTMLElement).click();
            expect((document.querySelector('#item1_dropdownbtn-popup') as HTMLElement).querySelectorAll('li').length).toBe(7);
        });
        it('Initial Rendering with checkbox', () => {
            ribbon = new Ribbon({
                tabs: [{
                    id: "tab1",
                    header: "tab1",
                    groups: [{
                        id: "group1",
                        header: "group1Header",
                        orientation: 'Column',
                        collections: [{
                            id: "collection1",
                            items: [{
                                id: "item1",
                                type: RibbonItemType.CheckBox,
                                checkBoxSettings: {
                                    label: 'Check1',
                                    checked: true,
                                }
                            }]
                        }]
                    }]
                }]
            }, ribbonEle);
            expect(ribbon.element.querySelector('#item1').tagName.toLowerCase()).toBe('input');
            expect((getComponent('item1', CheckBox) as any).getModuleName()).toBe('checkbox');
            expect((ribbon.element.querySelector('#item1').parentElement.querySelector('.e-label') as HTMLElement).innerText.toLowerCase()).toBe('check1');
            expect((ribbon.element.querySelector('#item1').parentElement.querySelector('.e-frame') as HTMLElement).classList.contains('e-check')).toBe(true);
        });
        it('Initial Rendering with ColorPicker', () => {
            ribbon = new Ribbon({
                tabs: [{
                    id: "tab1",
                    header: "tab1",
                    groups: [{
                        id: "group1",
                        header: "group1Header",
                        orientation: 'Column',
                        collections: [{
                            id: "collection1",
                            items: [{
                                id: "item1",
                                type: RibbonItemType.ColorPicker,
                                colorPickerSettings: {
                                    value: '#fff'
                                }
                            }]
                        }]
                    }]
                }]
            }, ribbonEle);
            expect(ribbon.element.querySelector('#item1').tagName.toLowerCase()).toBe('input');
            expect((getComponent('item1', ColorPicker) as ColorPicker).getModuleName()).toBe('colorpicker');
            expect((ribbon.element.querySelector('#item1').parentElement.querySelector('.e-split-preview') as HTMLElement).style.backgroundColor).toBe('rgb(255, 255, 255)');
        });
        it('Initial Rendering with combobox', () => {
            ribbon = new Ribbon({
                tabs: [{
                    id: "tab1",
                    header: "tab1",
                    groups: [{
                        id: "group1",
                        header: "group1Header",
                        orientation: 'Column',
                        collections: [{
                            id: "collection1",
                            items: [{
                                id: "item1",
                                type: RibbonItemType.ComboBox,
                                comboBoxSettings: {
                                    dataSource: sportsData,
                                    index: 1
                                }
                            }]
                        }]
                    }]
                }]
            }, ribbonEle);
            expect(ribbon.element.querySelector('#item1').tagName.toLowerCase()).toBe('input');
            expect((getComponent('item1', ComboBox) as ComboBox).getModuleName()).toBe('combobox');
            expect((ribbon.element.querySelector('#item1') as HTMLInputElement).value).toBe('Cricket');
        });
        it('Initial Rendering with Template', () => {
            let template1 = '<button id="btn1" class="tempContent">Button1</button>';
            let template2 = createElement('button', { id: 'btn2', className: 'tempContent2', innerHTML: 'Button2' });
            let element1 = createElement('button', { id: 'btn3', className: 'tempContent3', innerHTML: 'Button3' });
            document.body.appendChild(element1);
            let template = '<button id="btn4" class="tempContent4">Button4</button>';;
            let renderer = createElement("script", { id: "ribbonTemp", innerHTML: template });
            renderer.setAttribute("type", "text/x-jsrender");
            document.body.appendChild(renderer);
            ribbon = new Ribbon({
                tabs: [{
                    id: "tab1",
                    header: "tab1",
                    groups: [{
                        id: "group1",
                        header: "group1Header",
                        orientation: 'row',
                        collections: [{
                            id: "collection1",
                            items: [{
                                id: "item1",
                                type: RibbonItemType.Template,
                                itemTemplate: template1
                            }, {
                                id: "item2",
                                type: RibbonItemType.Template,
                                itemTemplate: template2.outerHTML
                            }, {
                                id: "item3",
                                type: RibbonItemType.Template,
                                itemTemplate: '#btn3',

                            }, {
                                id: "item4",
                                type: RibbonItemType.Template,
                                itemTemplate: '#ribbonTemp',

                            }, {
                                id: "item5",
                                type: RibbonItemType.Template,
                                itemTemplate: 'ribbonTemp23',

                            }, {
                                id: "item6",
                                type: RibbonItemType.Template,
                                itemTemplate: '#ribbonTemp24',

                            }]
                        }]
                    }]
                }]
            }, ribbonEle);
            expect(ribbon.element.querySelector('.e-ribbon-template') !==null).toBe(true);
            expect(ribbon.element.querySelector('#item1').innerHTML).toBe(template1);
            expect(ribbon.element.querySelector('#item2').innerHTML).toBe(template2.outerHTML);
            expect(ribbon.element.querySelector('#item3').innerHTML).toBe(element1.outerHTML);
            expect(ribbon.element.querySelector('#item4').innerHTML).toBe(template);
            expect(ribbon.element.querySelector('#item5').innerHTML).toBe('ribbonTemp23');
            expect(ribbon.element.querySelector('#item6').innerHTML).toBe('#ribbonTemp24');
            remove(element1);
            remove(renderer);
        });
    });
    describe('Ribbon items Methods and Events', () => {
        let ribbon: Ribbon;
        let ribbonEle: HTMLElement;
        beforeEach(() => {
            ribbonEle = createElement('div', { id: 'ribbon' });
            document.body.appendChild(ribbonEle);
        })
        afterEach(() => {
            if (ribbon) {
                ribbon.destroy();
                ribbon = undefined;
            }
            remove(ribbonEle);
        });
        it('button methods', () => {
            let isClicked: boolean = false;
            ribbon = new Ribbon({
                tabs: [{
                    id: "tab1",
                    header: "tab1",
                    groups: [{
                        id: "group1",
                        header: "group1Header",
                        orientation: 'Row',
                        collections: [{
                            id: "collection1",
                            items: [{
                                id: "item1",
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Large,
                                buttonSettings: {
                                    content: 'button1',
                                    iconCss: 'e-icons e-cut',
                                    clicked: () => {
                                        isClicked = true;
                                    }
                                }
                            }, {
                                id: "item2",
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Medium,
                                buttonSettings: {
                                    content: 'button2',
                                    cssClass: 'copy Css',
                                    iconCss: 'e-icons e-copy'
                                }
                            }, {
                                id: "item3",
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Small,
                                buttonSettings: {
                                    content: 'button3',
                                    iconCss: 'e-icons e-paste'
                                }
                            },]
                        }]
                    }]
                }, {
                    id: "tab2",
                    header: "tab2",
                    groups: [{
                        id: "group2",
                        header: "group2Header",
                        orientation: 'Column',
                        collections: [{
                            id: "collection2",
                            items: [{
                                id: "item4",
                                type: RibbonItemType.Button,
                                buttonSettings: {
                                    content: 'button4',
                                    iconCss: 'e-icons e-paste',
                                    clicked: () => {
                                        isClicked = true;
                                    }
                                }
                            }]
                        }]
                    }]
                }]
            }, ribbonEle);
            (ribbon.element.querySelector('#item1') as HTMLElement).click();
            expect(isClicked).toBe(true);
            isClicked = false;
            ribbon.ribbonButtonModule.click('item1');
            expect(isClicked).toBe(true);
            isClicked = false;
            ribbon.ribbonButtonModule.click('item4');
            expect(isClicked).toBe(false);
            ribbon.ribbonButtonModule.updateButton({ content: 'new button' }, 'item1');
            expect((ribbon.element.querySelector('#item1') as HTMLElement).innerText.toLowerCase()).toBe('new button');
            expect((ribbon.element.querySelector('#item1') as HTMLElement).classList.contains('newClass')).toBe(false);
            ribbon.ribbonButtonModule.updateButton({ cssClass: 'newClass' }, 'item1');
            expect((ribbon.element.querySelector('#item1') as HTMLElement).classList.contains('newClass')).toBe(true);
            expect((ribbon.element.querySelector('#item3') as HTMLElement).innerText.toLowerCase()).toBe('');
            ribbon.ribbonButtonModule.updateButton({ content: 'new button' }, 'item3');
            expect((ribbon.element.querySelector('#item3') as HTMLElement).innerText.toLowerCase()).toBe('');
            //Handle else case for clicked event, wrong id, element not rendered .
            ribbon.ribbonButtonModule.updateButton({ clicked: null }, 'item1');
            ribbon.ribbonButtonModule.click('item1');
            ribbon.ribbonButtonModule.updateButton({ content: 'new button1' }, 'item6');
            ribbon.ribbonButtonModule.updateButton({ content: 'new button1' }, 'item4');
        });
        it('Dropdownbutton methods', () => {
            ribbon = new Ribbon({
                tabs: [{
                    id: "tab1",
                    header: "tab1",
                    groups: [{
                        id: "group1",
                        header: "group1Header",
                        orientation: 'Row',
                        collections: [{
                            id: "collection1",
                            items: [{
                                id: "item1",
                                type: RibbonItemType.DropDown,
                                allowedSizes: RibbonItemSize.Large,
                                cssClass: 'newClass',
                                dropDownSettings: {
                                    cssClass: 'customClass',
                                    content: 'Edit',
                                    iconCss: 'e-icons e-edit',
                                    items: dropDownButtonItems
                                }
                            }, {
                                id: "item2",
                                type: RibbonItemType.DropDown,
                                allowedSizes: RibbonItemSize.Medium,
                                dropDownSettings: {
                                    content: 'Edit',
                                    iconCss: 'e-icons e-edit',
                                    items: dropDownButtonItems
                                }
                            }, {
                                id: "item3",
                                type: RibbonItemType.DropDown,
                                allowedSizes: RibbonItemSize.Small,
                                dropDownSettings: {
                                    content: 'Edit',
                                    iconCss: 'e-icons e-edit',
                                    items: dropDownButtonItems
                                }
                            }]
                        }]
                    }]
                }, {
                    id: "tab2",
                    header: "tab2",
                    groups: [{
                        id: "group2",
                        header: "group2Header",
                        orientation: 'Column',
                        collections: [{
                            id: "collection2",
                            items: [{
                                id: "item4",
                                type: RibbonItemType.DropDown,
                                allowedSizes: RibbonItemSize.Large,
                                dropDownSettings: {
                                    content: 'Edit',
                                    iconCss: 'e-icons e-edit',
                                    items: dropDownButtonItems
                                }
                            }]
                        }]
                    }]
                }]
            }, ribbonEle);
            (ribbon.element.querySelector('#item1') as HTMLElement).click();
            expect((document.querySelector('#item1-popup') as HTMLElement).querySelectorAll('li').length).toBe(7);
            (ribbon.element.querySelector('#item1') as HTMLElement).click();
            ribbon.ribbonDropDownModule.addItems('item1', [{ text: 'new Item' }]);
            (ribbon.element.querySelector('#item1') as HTMLElement).click();
            expect((document.querySelector('#item1-popup') as HTMLElement).querySelectorAll('li').length).toBe(8);
            expect((document.querySelector('#item1-popup') as HTMLElement).querySelectorAll('li')[7].innerText.toLowerCase()).toBe('new item');
            (ribbon.element.querySelector('#item1') as HTMLElement).click();
            ribbon.ribbonDropDownModule.removeItems('item1', ['new Item']);
            (ribbon.element.querySelector('#item1') as HTMLElement).click();
            expect((document.querySelector('#item1-popup') as HTMLElement).querySelectorAll('li').length).toBe(7);
            (ribbon.element.querySelector('#item1') as HTMLElement).click();
            ribbon.ribbonDropDownModule.updateDropDown({ content: 'New Edit' }, 'item1');
            expect((document.querySelector('#item1') as HTMLElement).innerText.toLowerCase()).toBe('new edit');
            expect((document.querySelector('#item1') as HTMLElement).classList.contains('e-active')).toBe(false);
            expect((document.querySelector('#item1') as HTMLElement).getAttribute('aria-expanded')).toBe('false');
            ribbon.ribbonDropDownModule.toggle('item1');
            expect((document.querySelector('#item1') as HTMLElement).classList.contains('e-active')).toBe(true);
            expect((document.querySelector('#item1') as HTMLElement).getAttribute('aria-expanded')).toBe('true');
            ribbon.ribbonDropDownModule.toggle('item1');
            expect((document.querySelector('#item1') as HTMLElement).classList.contains('e-active')).toBe(false);
            expect((document.querySelector('#item1') as HTMLElement).getAttribute('aria-expanded')).toBe('false');
            expect((document.querySelector('#item1') as HTMLElement).classList.contains('newClass')).toBe(false);
            expect((document.querySelector('#item3') as HTMLElement).classList.contains('newClass')).toBe(false);
            ribbon.ribbonDropDownModule.updateDropDown({ cssClass: 'newClass' }, 'item1');
            ribbon.ribbonDropDownModule.updateDropDown({ cssClass: 'newClass' }, 'item3');
            expect((document.querySelector('#item1') as HTMLElement).classList.contains('newClass')).toBe(true);
            expect((document.querySelector('#item3') as HTMLElement).classList.contains('newClass')).toBe(true);
            expect((document.querySelector('#item3') as HTMLElement).innerText.toLowerCase()).toBe('');
            ribbon.ribbonDropDownModule.updateDropDown({ content: 'New Edit1' }, 'item3');
            expect((document.querySelector('#item3') as HTMLElement).innerText.toLowerCase()).toBe('');
            //To cover wrong id, not rendered case
            ribbon.ribbonDropDownModule.updateDropDown({ content: 'New Edit1' }, 'item5');
            ribbon.ribbonDropDownModule.updateDropDown({ content: 'New Edit2' }, 'item4');
        });
        it('SplitButton methods', () => {
            ribbon = new Ribbon({
                tabs: [{
                    id: "tab1",
                    header: "tab1",
                    groups: [{
                        id: "group1",
                        header: "group1Header",
                        orientation: 'Row',
                        collections: [{
                            id: "collection1",
                            items: [{
                                id: "item1",
                                type: RibbonItemType.SplitButton,
                                allowedSizes: RibbonItemSize.Large,
                                splitButtonSettings: {
                                    cssClass:'testClass',
                                    content: 'Edit',
                                    iconCss: 'e-icons e-edit',
                                    items: dropDownButtonItems
                                }
                            }, {
                                id: "item3",
                                type: RibbonItemType.SplitButton,
                                allowedSizes: RibbonItemSize.Small,
                                splitButtonSettings: {
                                    content: 'Edit',
                                    iconCss: 'e-icons e-edit',
                                    items: dropDownButtonItems
                                }
                            }]
                        }]
                    }]
                }, {
                    id: "tab2",
                    header: "tab2",
                    groups: [{
                        id: "group2",
                        header: "group2Header",
                        orientation: 'Column',
                        collections: [{
                            id: "collection2",
                            items: [{
                                id: "item4",
                                type: RibbonItemType.SplitButton,
                                allowedSizes: RibbonItemSize.Small,
                                splitButtonSettings: {
                                    content: 'Edit',
                                    iconCss: 'e-icons e-edit',
                                    items: dropDownButtonItems
                                }
                            }]
                        }]
                    }]
                }]
            }, ribbonEle);
            (ribbon.element.querySelector('#item1_dropdownbtn') as HTMLElement).click();
            expect((document.querySelector('#item1') as HTMLElement).classList).toContain('testClass');
            expect((document.querySelector('#item1_dropdownbtn-popup') as HTMLElement).querySelectorAll('li').length).toBe(7);
            (ribbon.element.querySelector('#item1_dropdownbtn') as HTMLElement).click();
            ribbon.ribbonSplitButtonModule.addItems('item1', [{ text: 'new Item' }]);
            ribbon.ribbonSplitButtonModule.toggle('item1');
            expect((document.querySelector('#item1_dropdownbtn-popup') as HTMLElement).querySelectorAll('li').length).toBe(8);
            expect((document.querySelector('#item1_dropdownbtn-popup') as HTMLElement).querySelectorAll('li')[7].innerText.toLowerCase()).toBe('new item');
            (ribbon.element.querySelector('#item1_dropdownbtn') as HTMLElement).click();
            ribbon.ribbonSplitButtonModule.removeItems('item1', ['new Item']);
            (ribbon.element.querySelector('#item1_dropdownbtn') as HTMLElement).click();
            expect((document.querySelector('#item1_dropdownbtn-popup') as HTMLElement).querySelectorAll('li').length).toBe(7);
            (ribbon.element.querySelector('#item1_dropdownbtn') as HTMLElement).click();
            ribbon.ribbonSplitButtonModule.updateSplitButton({ content: 'New Edit' }, 'item1');
            ribbon.ribbonSplitButtonModule.updateSplitButton({ cssClass:'newClass' }, 'item1');
            expect((document.querySelector('#item1_dropdownbtn') as HTMLElement).innerText.toLowerCase()).toBe('new edit');
            expect((document.querySelector('#item1') as HTMLElement).classList).toContain('newClass');
            expect((document.querySelector('#item1') as HTMLElement).classList.contains('testClass')).toBe(false);
            expect((document.querySelector('#item3') as HTMLElement).innerText.toLowerCase()).toBe('');
            ribbon.ribbonSplitButtonModule.updateSplitButton({ content: 'New Edit1' }, 'item3');
            expect((document.querySelector('#item3') as HTMLElement).innerText.toLowerCase()).toBe('');
            //for Coverage            
            ribbon.ribbonSplitButtonModule.updateSplitButton({ content: 'New Edit', cssClass:'newClass' }, 'item4');
            ribbon.ribbonSplitButtonModule.updateSplitButton({ content: 'New Edit', cssClass:'newClass' }, 'item5');
        });
        it('checkbox methods', () => {
            let isChanged: boolean = false;
            ribbon = new Ribbon({
                tabs: [{
                    id: "tab1",
                    header: "tab1",
                    groups: [{
                        id: "group1",
                        header: "group1Header",
                        orientation: 'Column',
                        collections: [{
                            id: "collection1",
                            items: [{
                                id: "item1",
                                type: RibbonItemType.CheckBox,
                                checkBoxSettings: {
                                    label: 'Check1',
                                    checked: true,
                                    change: () => {
                                        isChanged = true;
                                    }
                                }
                            }]
                        }]
                    }]
                }, {
                    id: "tab2",
                    header: "tab2",
                    groups: [{
                        id: "group2",
                        header: "group2Header",
                        orientation: 'Column',
                        collections: [{
                            id: "collection2",
                            items: [{
                                id: "item2",
                                type: RibbonItemType.CheckBox,
                                checkBoxSettings: {
                                    label: 'Check2',
                                    checked: true,
                                    change: () => {
                                        isChanged = true;
                                    }
                                }
                            }]
                        }]
                    }]
                }]
            }, ribbonEle);
            ribbon.ribbonCheckBoxModule.click('item1');
            expect(isChanged).toBe(true);
            ribbon.ribbonCheckBoxModule.updateCheckBox({ label: 'new label' }, 'item1');
            expect((ribbon.element.querySelector('#item1').parentElement.querySelector('.e-label') as HTMLElement).innerText.toLowerCase()).toBe('new label');
            //to cover wrong ID and not rendered case
            ribbon.ribbonCheckBoxModule.click('item5');
            ribbon.ribbonCheckBoxModule.updateCheckBox({ label: 'new label1' }, 'item5');
            ribbon.ribbonCheckBoxModule.updateCheckBox({ label: 'new label1' }, 'item2');
        });
        it('ColorPicker Methods', () => {
            ribbon = new Ribbon({
                tabs: [{
                    id: "tab1",
                    header: "tab1",
                    groups: [{
                        id: "group1",
                        header: "group1Header",
                        orientation: 'Column',
                        collections: [{
                            id: "collection1",
                            items: [{
                                id: "item1",
                                type: RibbonItemType.ColorPicker,
                                colorPickerSettings: {
                                    value: '#fff'
                                }
                            }]
                        }]
                    }]
                }, {
                    id: "tab2",
                    header: "tab2",
                    groups: [{
                        id: "group2",
                        header: "group3Header",
                        orientation: 'Column',
                        collections: [{
                            id: "collection3",
                            items: [{
                                id: "item3",
                                type: RibbonItemType.ColorPicker,
                                colorPickerSettings: {
                                    value: '#000'
                                }
                            }]
                        }]
                    }]
                }]
            }, ribbonEle);
            expect(ribbon.element.querySelector('#item1').parentElement.querySelectorAll('button').length).toBe(2);
            let splitId: string = (ribbon.element.querySelector('#item1').parentElement.querySelector('.e-split-colorpicker')).id;
            expect(document.querySelector('#' + splitId + '_dropdownbtn-popup') !== null).toBe(true);
            expect(document.querySelector('#' + splitId + '_dropdownbtn-popup').querySelector('.e-color-picker') !== null).toBe(false);
            expect((ribbon.element.querySelector('#' + splitId + '_dropdownbtn') as HTMLElement).classList.contains('e-active')).toBe(false);
            ribbon.ribbonColorPickerModule.toggle('item1');//open
            expect((ribbon.element.querySelector('#' + splitId + '_dropdownbtn') as HTMLElement).classList.contains('e-active')).toBe(true);
            expect(document.querySelector('#' + splitId + '_dropdownbtn-popup').querySelector('.e-color-picker') !== null).toBe(true);
            ribbon.ribbonColorPickerModule.toggle('item1');//close
            expect((ribbon.element.querySelector('#' + splitId + '_dropdownbtn') as HTMLElement).classList.contains('e-active')).toBe(false);
            expect(document.querySelector('#' + splitId + '_dropdownbtn-popup') === null).toBe(false);
            expect(ribbon.ribbonColorPickerModule.getValue('item1', '#000', 'rgb')).toBe('rgb(0,0,0)');
            ribbon.ribbonColorPickerModule.toggle('item1');//open
            expect(document.querySelector('#' + splitId + '_dropdownbtn-popup').querySelector('.e-mode-switch-btn') !== null).toBe(true);
            ribbon.ribbonColorPickerModule.toggle('item1');//close
            ribbon.ribbonColorPickerModule.updateColorPicker({ modeSwitcher: false }, 'item1');
            ribbon.ribbonColorPickerModule.toggle('item1');//open
            expect(document.querySelector('#' + splitId + '_dropdownbtn-popup').querySelector('.e-mode-switch-btn') !== null).toBe(false);
            ribbon.ribbonColorPickerModule.toggle('item1');//close
            ribbon.ribbonColorPickerModule.updateColorPicker({ modeSwitcher: true }, 'item1');
            ribbon.ribbonColorPickerModule.toggle('item1');//open
            expect(document.querySelector('#' + splitId + '_dropdownbtn-popup').querySelector('.e-mode-switch-btn') !== null).toBe(true);
            //To cover not rendered
            ribbon.ribbonColorPickerModule.toggle('item5');
            ribbon.ribbonColorPickerModule.updateColorPicker({ modeSwitcher: false }, 'item3');
            expect(ribbon.ribbonColorPickerModule.getValue('item5')).toBe('');
            ribbon.ribbonColorPickerModule.updateColorPicker({ modeSwitcher: false }, 'item5');
        });
        it('Combobox update method', () => {
            ribbon = new Ribbon({
                tabs: [{
                    id: "tab1",
                    header: "tab1",
                    groups: [{
                        id: "group1",
                        header: "group1Header",
                        orientation: 'Column',
                        collections: [{
                            id: "collection1",
                            items: [{
                                id: "item1",
                                type: RibbonItemType.ComboBox,
                                comboBoxSettings: {
                                    dataSource: sportsData,
                                    placeholder: 'placeholder1',
                                    width: '100px'
                                }
                            }]
                        }]
                    }]
                }, {
                    id: "tab2",
                    header: "tab2",
                    groups: [{
                        id: "group2",
                        header: "group2Header",
                        orientation: 'Column',
                        collections: [{
                            id: "collection2",
                            items: [{
                                id: "item2",
                                type: RibbonItemType.ComboBox,
                                comboBoxSettings: {
                                    dataSource: sportsData,
                                    placeholder: 'placeholder2',
                                    width: '100px'
                                }
                            }]
                        }]
                    }]
                }]
            }, ribbonEle);
            expect((document.querySelector('#item1').closest('.e-control-wrapper') as HTMLElement).style.width).toBe('100px');
            expect((document.querySelector('#item1') as HTMLInputElement).placeholder).toBe('placeholder1');
            ribbon.ribbonComboBoxModule.updateComboBox({ placeholder: 'placeholder2', width: '200px' }, 'item1');
            expect((document.querySelector('#item1') as HTMLInputElement).placeholder).toBe('placeholder2');
            expect((document.querySelector('#item1').closest('.e-control-wrapper') as HTMLElement).style.width).toBe('200px');
            //to cover wrong ID and not rendered case
            ribbon.ribbonComboBoxModule.updateComboBox({ placeholder: 'placeholder2' }, 'item5');
            ribbon.ribbonComboBoxModule.updateComboBox({ placeholder: 'placeholder3' }, 'item2');
            ribbon.ribbonComboBoxModule.hidePopup('item5');
            ribbon.ribbonComboBoxModule.showPopup('item5');
        });
    });
    describe('combobox timeout Methods', () => {
        let ribbon: Ribbon;
        let ribbonEle: HTMLElement;
        let originalTimeout: number;
        beforeAll(() => {
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 3000;
        });
        afterAll(() => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
        });
        beforeEach(() => {
            ribbonEle = createElement('div', { id: 'ribbon' });
            document.body.appendChild(ribbonEle);
        })
        afterEach(() => {
            if (ribbon) {
                ribbon.destroy();
                ribbon = undefined;
            }
            remove(ribbonEle);
        });
        it('Combobox showhide methods', (done) => {
            ribbon = new Ribbon({
                tabs: [{
                    id: "tab1",
                    header: "tab1",
                    groups: [{
                        id: "group1",
                        header: "group1Header",
                        orientation: 'Column',
                        collections: [{
                            id: "collection1",
                            items: [{
                                id: "item1",
                                type: RibbonItemType.ComboBox,
                                comboBoxSettings: {
                                    dataSource: sportsData,
                                    index: 1
                                }
                            }]
                        }]
                    }]
                }]
            }, ribbonEle);
            expect(document.querySelector('#item1_popup') === null).toBe(true);
            ribbon.ribbonComboBoxModule.showPopup('item1');
            setTimeout(() => {
                expect(document.querySelector('#item1_popup') !== null).toBe(true);
                ribbon.ribbonComboBoxModule.hidePopup('item1');
                setTimeout(() => {
                    expect(document.querySelector('#item1_popup') === null).toBe(true);
                    done();
                }, 450);
            }, 450);
        });
        it('Combobox filter method', (done) => {
            let isfiltered: boolean = false;
            let keyEventArgs: any = { preventDefault: (): void => { /** NO Code */ }, keyCode: 65, metaKey: false };
            let keyEvent: any = { preventDefault: (): void => { /** NO Code */ }, action: 'down' };
            ribbon = new Ribbon({
                tabs: [{
                    id: "tab1",
                    header: "tab1",
                    groups: [{
                        id: "group1",
                        header: "group1Header",
                        orientation: 'Column',
                        collections: [{
                            id: "collection1",
                            items: [{
                                id: "item1",
                                type: RibbonItemType.ComboBox,
                                comboBoxSettings: {
                                    dataSource: sportsData,
                                    index: 1,
                                    allowFiltering: true,
                                    filtering: function (e: FilteringEventArgs) {
                                        isfiltered = true;
                                        let combobox_query = new Query();
                                        combobox_query = (e.text !== '') ? combobox_query.where('', 'contains', e.text, true) : combobox_query;
                                        ribbon.ribbonComboBoxModule.filter('item1', sportsData, combobox_query);
                                    }
                                }
                            }]
                        }]
                    }]
                }]
            }, ribbonEle);
            ribbon.ribbonComboBoxModule.showPopup('item1');
            setTimeout(() => {
                let comboxObj = (ribbon.element.querySelector('#item1') as any).ej2_instances[0];
                comboxObj.filterInput.value = "a";
                comboxObj.onInput()
                comboxObj.onFilterUp(keyEventArgs);
                expect(document.querySelector('#item1_popup').querySelectorAll('li').length).toBe(2);
                comboxObj.keyActionHandler(keyEvent);
                expect((document.querySelector('#item1_popup').querySelector('.e-list-item.e-active') as HTMLElement).innerText).toBe('Badminton');
                comboxObj.keyActionHandler(keyEvent);
                expect((document.querySelector('#item1_popup').querySelector('.e-list-item.e-active') as HTMLElement).innerText).toBe('Football');
                expect(isfiltered).toBe(true);
                expect((ribbon.element.querySelector('#item1') as HTMLInputElement).value === 'Football').toBe(true);
                comboxObj.hidePopup();
                setTimeout(() => {
                    done();
                }, 450);
            }, 450);
        });
        it('Combobox filter with updateData method of filtereventargs', (done) => {
            let isfiltered: boolean = false;
            let keyEventArgs: any = { preventDefault: (): void => { /** NO Code */ }, keyCode: 65, metaKey: false };
            let keyEvent: any = { preventDefault: (): void => { /** NO Code */ }, action: 'down' };
            ribbon = new Ribbon({
                tabs: [{
                    id: "tab1",
                    header: "tab1",
                    groups: [{
                        id: "group1",
                        header: "group1Header",
                        orientation: 'Column',
                        collections: [{
                            id: "collection1",
                            items: [{
                                id: "item1",
                                type: RibbonItemType.ComboBox,
                                comboBoxSettings: {
                                    dataSource: sportsData,
                                    index: 1,
                                    allowFiltering: true,
                                    filtering: function (e: FilteringEventArgs) {
                                        isfiltered = true;
                                        let combobox_query = new Query();
                                        combobox_query = (e.text !== '') ? combobox_query.where('', 'contains', e.text, true) : combobox_query;
                                        e.updateData(sportsData, combobox_query);
                                    }
                                }
                            }]
                        }]
                    }]
                }]
            }, ribbonEle);
            ribbon.ribbonComboBoxModule.showPopup('item1');
            setTimeout(() => {
                let comboxObj = (ribbon.element.querySelector('#item1') as any).ej2_instances[0];
                comboxObj.filterInput.value = "a";
                comboxObj.onInput()
                comboxObj.onFilterUp(keyEventArgs);
                expect(document.querySelector('#item1_popup').querySelectorAll('li').length).toBe(2);
                comboxObj.keyActionHandler(keyEvent);
                expect((document.querySelector('#item1_popup').querySelector('.e-list-item.e-active') as HTMLElement).innerText).toBe('Badminton');
                comboxObj.keyActionHandler(keyEvent);
                expect((document.querySelector('#item1_popup').querySelector('.e-list-item.e-active') as HTMLElement).innerText).toBe('Football');
                expect(isfiltered).toBe(true);
                expect((ribbon.element.querySelector('#item1') as HTMLInputElement).value === 'Football').toBe(true);
                comboxObj.hidePopup();
                setTimeout(() => {
                    done();
                }, 450);
            }, 450);
        });
    });
    describe('Ribbon layout', () => {
        let ribbon: Ribbon;
        let ribbonEle: HTMLElement;
        beforeEach(() => {
            ribbonEle = createElement('div', { id: 'ribbon' });
            document.body.appendChild(ribbonEle);
        })
        afterEach(() => {
            if (ribbon) {
                ribbon.destroy();
                ribbon = undefined;
            }
            remove(ribbonEle);
        });
        it('simplified mode', () => {
            let isfiltered: boolean = false;
            let template1 = '<button id="btn1" class="tempContent">Button1</button>';
            ribbon = new Ribbon({
                activeLayout: "Simplified",
                tabs: [{
                    id: "tab1",
                    header: "tab1",
                    groups: [{
                        id: "group1",
                        header: "group1Header",
                        orientation: ItemOrientation.Row,
                        collections: [{
                            id: "collection1",
                            items: [{
                                id: "item1",
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Medium,
                                buttonSettings: {
                                    content: 'button1',
                                    iconCss: 'e-icons e-cut',
                                }
                            }]
                        }, {
                            id: "collection2",
                            items: [{
                                id: "item2",
                                type: RibbonItemType.DropDown,
                                allowedSizes: RibbonItemSize.Medium,
                                dropDownSettings: {
                                    content: 'Edit',
                                    iconCss: 'e-icons e-edit',
                                    items: dropDownButtonItems
                                }
                            },
                            {
                                id: "item3",
                                type: RibbonItemType.ComboBox,
                                comboBoxSettings: {
                                    dataSource: sportsData,
                                    index: 1,
                                    allowFiltering: true,
                                    filtering: function (e: FilteringEventArgs) {
                                        isfiltered = true;
                                        let combobox_query = new Query();
                                        combobox_query = (e.text !== '') ? combobox_query.where('', 'contains', e.text, true) : combobox_query;
                                        e.updateData(sportsData, combobox_query);
                                    }
                                }
                            },
                            {
                                id: "item4",
                                type: RibbonItemType.ColorPicker,
                                colorPickerSettings: {
                                    value: '#123456'
                                }
                            }]
                        }]
                    }]
                }, {
                    id: "tab2",
                    header: "tab2",
                    groups: [{
                        id: "group2",
                        header: "group1Header",
                        collections: [{
                            id: "collection2",
                            items: [{
                                id: "item5",
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Medium,
                                buttonSettings: {
                                    content: 'button2',
                                    iconCss: 'e-icons e-cut',
                                }
                            },
                            {
                                id: "item6",
                                type: RibbonItemType.CheckBox,
                                checkBoxSettings: {
                                    label: 'Check1',
                                    checked: true,
                                }
                            },
                            {
                                id: "item7",
                                type: RibbonItemType.Template,
                                itemTemplate: template1
                            }]
                        }]
                    }]
                }]
            }, ribbonEle);
            expect(ribbon.element.querySelectorAll('.e-ribbon-row').length).toBe(0);
            expect(ribbon.element.querySelectorAll('.e-ribbon-group-header').length).toBe(0);
            expect(ribbon.element.querySelectorAll('.e-ribbon-content-height').length).toBe(0);
            //button
            expect(ribbon.element.querySelector('#item1').tagName.toLowerCase()).toBe('button');
            expect((getComponent('item1', Button) as Button).getModuleName()).toBe('btn');
            expect((ribbon.element.querySelector('#item1') as HTMLElement).innerText.toLowerCase()).toBe('button1');
            //dropdown
            expect(ribbon.element.querySelector('#item2').tagName.toLowerCase()).toBe('button');
            expect((getComponent('item2', DropDownButton) as DropDownButton).getModuleName()).toBe('dropdown-btn');
            expect((ribbon.element.querySelector('#item2') as HTMLElement).innerText.toLowerCase()).toBe('edit');
            expect(isNullOrUndefined((ribbon.element.querySelector('#item2') as HTMLElement).querySelector('.e-edit'))).toBe(false);
            //combobox
            expect(ribbon.element.querySelector('#item3').tagName.toLowerCase()).toBe('input');
            expect((getComponent('item3', ComboBox) as ComboBox).getModuleName()).toBe('combobox');
            expect((ribbon.element.querySelector('#item3') as HTMLInputElement).value).toBe('Cricket');
            //colorpicker
            expect(ribbon.element.querySelector('#item4').tagName.toLowerCase()).toBe('input');
            expect((getComponent('item4', ColorPicker) as ColorPicker).getModuleName()).toBe('colorpicker');
            expect((ribbon.element.querySelector('#item4').parentElement.querySelector('.e-split-preview') as HTMLElement).style.backgroundColor).toBe('rgb(18, 52, 86)');
            (ribbon.element.getElementsByClassName('e-tab-text')[1] as HTMLElement).click();
            //checkbox
            expect(ribbon.element.querySelector('#item6').tagName.toLowerCase()).toBe('input');
            expect((getComponent('item6', CheckBox) as any).getModuleName()).toBe('checkbox');
            expect((ribbon.element.querySelector('#item6').parentElement.querySelector('.e-label') as HTMLElement).innerText.toLowerCase()).toBe('check1');
            expect((ribbon.element.querySelector('#item6').parentElement.querySelector('.e-frame') as HTMLElement).classList.contains('e-check')).toBe(true);
            //template
            expect(ribbon.element.querySelector('#item7').innerHTML).toBe(template1);
            expect((ribbon.element.querySelector('#item7') as HTMLElement).innerText.toLowerCase()).toBe('button1');
        });

        it('switching modes', () => {
            let isfiltered: boolean = false;
            let template1 = '<button id="btn1" class="tempContent">Button1</button>';
            ribbon = new Ribbon({
                activeLayout: "Simplified",
                tabs: [{
                    id: "tab1",
                    header: "tab1",
                    groups: [{
                        id: "group1",
                        header: "group1Header",
                        orientation: ItemOrientation.Row,
                        collections: [{
                            id: "collection1",
                            items: [{
                                id: "item1",
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Medium,
                                buttonSettings: {
                                    content: 'button1',
                                    iconCss: 'e-icons e-cut',
                                }
                            }]
                        }, {
                            id: "collection2",
                            items: [{
                                id: "item2",
                                type: RibbonItemType.DropDown,
                                allowedSizes: RibbonItemSize.Medium,
                                displayOptions: DisplayMode.None,
                                dropDownSettings: {
                                    content: 'Edit',
                                    iconCss: 'e-icons e-edit',
                                    items: dropDownButtonItems
                                }
                            },
                            {
                                id: "item3",
                                type: RibbonItemType.ComboBox,
                                allowedSizes: RibbonItemSize.Small,
                                comboBoxSettings: {
                                    dataSource: sportsData,
                                    index: 1,
                                    allowFiltering: true,
                                    filtering: function (e: FilteringEventArgs) {
                                        isfiltered = true;
                                        let combobox_query = new Query();
                                        combobox_query = (e.text !== '') ? combobox_query.where('', 'contains', e.text, true) : combobox_query;
                                        e.updateData(sportsData, combobox_query);
                                    }
                                }
                            },
                            {
                                id: "item4",
                                type: RibbonItemType.ColorPicker,
                                allowedSizes: RibbonItemSize.Medium,
                                colorPickerSettings: {
                                    value: '#123456'
                                }
                            }]
                        }]
                    }]
                }, {
                    id: "tab2",
                    header: "tab2",
                    groups: [{
                        id: "group2",
                        header: "group1Header",
                        collections: [{
                            id: "collection2",
                            items: [{
                                id: "item5",
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Medium,
                                buttonSettings: {
                                    content: 'button2',
                                    iconCss: 'e-icons e-cut',
                                }
                            },
                            {
                                id: "item6",
                                type: RibbonItemType.CheckBox,
                                allowedSizes: RibbonItemSize.Medium,
                                checkBoxSettings: {
                                    label: 'Check1',
                                    checked: true,
                                }
                            },
                            {
                                id: "item7",
                                type: RibbonItemType.Template,
                                allowedSizes: RibbonItemSize.Small,
                                itemTemplate: template1
                            }]
                        }]
                    }]
                }]
            }, ribbonEle);
            expect(ribbon.activeLayout).toBe('Simplified');
            expect(ribbon.element.querySelector('.e-ribbon-collapse-btn') !== null).toBe(true);
            expect(ribbon.element.querySelectorAll('.e-ribbon-row').length).toBe(0);
            expect(ribbon.element.querySelectorAll('.e-ribbon-group-header').length).toBe(0);
            expect(ribbon.element.querySelectorAll('.e-ribbon-content-height').length).toBe(0);
            (ribbon.element.querySelector('.e-ribbon-collapse-btn') as HTMLElement).click();
            expect(ribbon.element.classList.contains('e-ribbon-minimize')).toBe(false);
            expect(ribbon.activeLayout).toBe('Classic');
            expect(ribbon.element.querySelector('.e-ribbon-collapse-btn') !== null).toBe(true);
            expect(ribbon.element.querySelectorAll('.e-ribbon-row').length).toBe(1);
            expect(ribbon.element.querySelectorAll('.e-ribbon-group-header').length).toBe(1);
            expect(ribbon.element.querySelectorAll('.e-ribbon-content-height').length).toBe(1);
            expect(ribbon.element.classList.contains('e-ribbon-minimize')).toBe(false);         
        });
    });

    describe('Simplified mode', () => {
        let ribbon: Ribbon;
        let ribbonEle: HTMLElement;
        let containerEle: HTMLElement;
        beforeEach(() => {
            ribbonEle = createElement('div', { id: 'ribbon' });
            containerEle = createElement('div', { id: 'container', styles: 'width:600px' });
            containerEle.appendChild(ribbonEle);
            document.body.appendChild(containerEle);
        })
        afterEach(() => {
            if (ribbon) {
                ribbon.destroy();
                ribbon = undefined;
            }
            remove(ribbonEle);
            remove(containerEle);
        });
        it('With initial overflow', () => {
            let isfiltered: boolean = false;
            let template1 = '<button id="btn1" class="tempContent">Button1</button>';
            ribbon = new Ribbon({
                activeLayout: "Simplified",
                tabs: [{
                    id: "tab1",
                    header: "tab1",
                    groups: [{
                        id: "group1",
                        header: "group1Header",
                        priority: 1,
                        orientation: ItemOrientation.Row,
                        collections: [{
                            id: "collection1",
                            items: [{
                                id: "item1",
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Medium,
                                displayOptions: DisplayMode.Overflow,
                                buttonSettings: {
                                    content: 'button1',
                                    iconCss: 'e-icons e-cut',
                                }
                            },
                            {
                                id: "item2",
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Medium,
                                displayOptions: DisplayMode.Overflow,
                                buttonSettings: {
                                    content: 'button2',
                                    iconCss: 'e-icons e-cut',
                                }
                            }]
                        }, {
                            id: "collection2",
                            items: [{
                                id: "item3",
                                type: RibbonItemType.DropDown,
                                allowedSizes: RibbonItemSize.Medium,
                                displayOptions: DisplayMode.Simplified,
                                dropDownSettings: {
                                    content: 'Edit',
                                    iconCss: 'e-icons e-edit',
                                    items: dropDownButtonItems
                                }
                            },
                            {
                                id: "item4",
                                type: RibbonItemType.ComboBox,
                                displayOptions: DisplayMode.Auto,
                                comboBoxSettings: {
                                    dataSource: sportsData,
                                    index: 1,
                                    allowFiltering: true,
                                    width: '200px',
                                    filtering: function (e: FilteringEventArgs) {
                                        isfiltered = true;
                                        let combobox_query = new Query();
                                        combobox_query = (e.text !== '') ? combobox_query.where('', 'contains', e.text, true) : combobox_query;
                                        e.updateData(sportsData, combobox_query);
                                    }
                                }
                            },
                            {
                                id: "item5",
                                type: RibbonItemType.ColorPicker,
                                displayOptions: DisplayMode.Auto,
                                colorPickerSettings: {
                                    value: '#123456'
                                }
                            }]
                        }]
                    },
                    {
                        id: "group2",
                        header: "group2Header",
                        priority: 2,
                        enableGroupOverflow: true,
                        orientation: ItemOrientation.Row,
                        collections: [{
                            id: "collection3",
                            items: [{
                                id: "item6",
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Large,
                                displayOptions: DisplayMode.Simplified,
                                buttonSettings: {
                                    content: 'button2',
                                    iconCss: 'e-icons e-cut',
                                }
                            },
                            {
                                id: 'item7',
                                type: RibbonItemType.CheckBox,
                                displayOptions: DisplayMode.Auto,
                                checkBoxSettings: {
                                    label: 'Check1',
                                    checked: true,
                                }
                            }, {
                                id: 'item8',
                                type: RibbonItemType.CheckBox,
                                displayOptions: DisplayMode.Overflow,
                                checkBoxSettings: {
                                    label: 'Check2',
                                    checked: true,
                                }
                            }, {
                                id: 'item9',
                                type: RibbonItemType.ColorPicker,
                                displayOptions: DisplayMode.Overflow,
                                colorPickerSettings: {
                                    value: '#123456'
                                }
                            }]
                        }]
                    },
                    {
                        id: "group3",
                        header: "group3Header",
                        priority: 3,
                        collections: [{
                            id: "collection4",
                            items: [{
                                id: "item10",
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Medium,
                                displayOptions: DisplayMode.Simplified,
                                buttonSettings: {
                                    content: 'button2',
                                    iconCss: 'e-icons e-cut',
                                }
                            },
                            {
                                id: "item11",
                                type: RibbonItemType.CheckBox,
                                displayOptions: DisplayMode.Auto,
                                checkBoxSettings: {
                                    label: 'Check1',
                                    checked: true,
                                }
                            }]
                        },
                        {
                            id: "collection5",
                            items: [{
                                id: "item12",
                                type: RibbonItemType.CheckBox,
                                displayOptions: DisplayMode.Overflow,
                                checkBoxSettings: {
                                    label: 'Check2',
                                    checked: true,
                                }
                            },
                            {
                                id: "item13",
                                type: RibbonItemType.CheckBox,
                                displayOptions: DisplayMode.Overflow,
                                checkBoxSettings: {
                                    label: 'Check3',
                                    checked: true,
                                }
                            }]
                        }]
                    }]
                },
                {
                    id: "tab2",
                    header: "tab2",
                    groups: [{
                        id: "group21",
                        header: "group1Header",
                        priority: 1,
                        orientation: ItemOrientation.Row,
                        collections: [{
                            id: "collection21",
                            items: [{
                                id: "item21",
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Medium,
                                displayOptions: DisplayMode.Overflow,
                                buttonSettings: {
                                    content: 'button21',
                                    iconCss: 'e-icons e-cut',
                                }
                            },
                            {
                                id: "item22",
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Medium,
                                displayOptions: DisplayMode.Overflow,
                                buttonSettings: {
                                    content: 'button22',
                                    iconCss: 'e-icons e-cut',
                                }
                            }]
                        }, {
                            id: "collection22",
                            items: [{
                                id: "item23",
                                type: RibbonItemType.DropDown,
                                allowedSizes: RibbonItemSize.Medium,
                                displayOptions: DisplayMode.Simplified,
                                dropDownSettings: {
                                    content: 'Edit',
                                    iconCss: 'e-icons e-edit',
                                    items: dropDownButtonItems
                                }
                            },
                            {
                                id: "item24",
                                type: RibbonItemType.ComboBox,
                                displayOptions: DisplayMode.Auto,
                                comboBoxSettings: {
                                    dataSource: sportsData,
                                    index: 1,
                                    allowFiltering: true,
                                    filtering: function (e: FilteringEventArgs) {
                                        isfiltered = true;
                                        let combobox_query = new Query();
                                        combobox_query = (e.text !== '') ? combobox_query.where('', 'contains', e.text, true) : combobox_query;
                                        e.updateData(sportsData, combobox_query);
                                    }
                                }
                            },
                            {
                                id: "item25",
                                type: RibbonItemType.ColorPicker,
                                displayOptions: DisplayMode.Auto,
                                allowedSizes: (RibbonItemSize.Large | RibbonItemSize.Medium | RibbonItemSize.Small),
                                colorPickerSettings: {
                                    value: '#123456'
                                }
                            }]
                        }]
                    },
                    {
                        id: "group22",
                        header: "group2Header",
                        priority: 2,
                        enableGroupOverflow: true,
                        orientation: ItemOrientation.Row,
                        collections: [{
                            id: "collection23",
                            items: [{
                                id: "item26",
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Medium,
                                displayOptions: DisplayMode.Simplified,
                                buttonSettings: {
                                    content: 'button2',
                                    iconCss: 'e-icons e-cut',
                                }
                            },
                            {
                                id: 'item27',
                                type: RibbonItemType.CheckBox,
                                displayOptions: DisplayMode.Auto,
                                checkBoxSettings: {
                                    label: 'Check1',
                                    checked: true,
                                }
                            }, {
                                id: 'item28',
                                type: RibbonItemType.CheckBox,
                                displayOptions: DisplayMode.Overflow,
                                checkBoxSettings: {
                                    label: 'Check2',
                                    checked: true,
                                }
                            }, {
                                id: 'item29',
                                type: RibbonItemType.ColorPicker,
                                displayOptions: DisplayMode.Overflow,
                                colorPickerSettings: {
                                    value: '#123456'
                                }
                            }]
                        }]
                    },
                    {
                        id: "group23",
                        header: "group3Header",
                        priority: 3,
                        collections: [{
                            id: "collection24",
                            items: [{
                                id: "item210",
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Medium,
                                displayOptions: DisplayMode.Simplified,
                                buttonSettings: {
                                    content: 'button2',
                                    iconCss: 'e-icons e-cut',
                                }
                            },
                            {
                                id: "item211",
                                type: RibbonItemType.CheckBox,
                                displayOptions: DisplayMode.Auto,
                                checkBoxSettings: {
                                    label: 'Check1',
                                    checked: true,
                                }
                            }]
                        },
                        {
                            id: "collection25",
                            items: [{
                                id: "item212",
                                type: RibbonItemType.CheckBox,
                                displayOptions: DisplayMode.Overflow,
                                checkBoxSettings: {
                                    label: 'Check2',
                                    checked: true,
                                }
                            },
                            {
                                id: "item213",
                                type: RibbonItemType.CheckBox,
                                displayOptions: DisplayMode.Overflow,
                                checkBoxSettings: {
                                    label: 'Check3',
                                    checked: true,
                                }
                            }]
                        }]
                    }]
                }]
            }, ribbonEle);
            expect(ribbon.element.querySelectorAll('.e-ribbon-row').length).toBe(0);
            expect(ribbon.element.querySelectorAll('.e-ribbon-group-header').length).toBe(0);
            expect(ribbon.element.querySelectorAll('.e-ribbon-group').length).toBe(3);
            expect(ribbon.element.querySelectorAll('.e-ribbon-content-height').length).toBe(0);
            expect(ribbon.element.querySelectorAll('.e-ribbon-group-of-btn').length).toBe(1);
            expect(ribbon.element.querySelectorAll('.e-ribbon-overall-of-btn').length).toBe(1);
            expect(ribbon.element.querySelectorAll('.e-ribbon-item').length).toBe(4);
            containerEle.style.width = '500px';
            ribbon.refreshLayout();
            expect(ribbon.element.querySelectorAll('.e-ribbon-group-of-btn').length).toBe(1);
            expect(ribbon.element.querySelectorAll('.e-ribbon-overall-of-btn').length).toBe(1);
            expect(ribbon.element.querySelectorAll('.e-ribbon-item').length).toBe(3);
            expect(ribbon.element.querySelectorAll('.e-ribbon-group').length).toBe(3);
            expect(document.querySelectorAll('.e-hscroll-bar').length).toBe(0);
            containerEle.style.width = '300px';
            ribbon.refreshLayout();
            expect(ribbon.element.querySelectorAll('.e-ribbon-group-of-btn').length).toBe(1);
            expect(ribbon.element.querySelectorAll('.e-ribbon-overall-of-btn').length).toBe(1);
            expect(ribbon.element.querySelectorAll('.e-ribbon-item').length).toBe(3);
            expect(ribbon.element.querySelectorAll('.e-ribbon-group').length).toBe(3);
            expect(document.querySelectorAll('.e-hscroll-bar').length).toBe(1);
            containerEle.style.width = '700px';
            ribbon.refreshLayout();
            expect(ribbon.element.querySelectorAll('.e-ribbon-group-of-btn').length).toBe(1);
            expect(ribbon.element.querySelectorAll('.e-ribbon-overall-of-btn').length).toBe(1);
            expect(ribbon.element.querySelectorAll('.e-ribbon-item').length).toBe(5);
            expect(ribbon.element.querySelectorAll('.e-ribbon-group').length).toBe(3);
            expect(document.querySelectorAll('.e-hscroll-bar').length).toBe(0);
            (ribbon.element.querySelector('.e-ribbon-collapse-btn') as HTMLElement).click();
            expect(ribbon.element.classList.contains('e-ribbon-minimize')).toBe(false);
            expect(ribbon.activeLayout).toBe('Classic');
            expect(ribbon.element.querySelectorAll('.e-ribbon-row').length).toBe(1);
            expect(ribbon.element.querySelectorAll('.e-ribbon-content-height').length).toBe(1);
            expect(ribbon.element.querySelectorAll('.e-ribbon-group-overflow').length).toBe(2);
            expect(ribbon.element.querySelectorAll('.e-ribbon-group-of-btn').length).toBe(0);
            expect(ribbon.element.querySelectorAll('.e-ribbon-overall-of-btn').length).toBe(0);
            expect(ribbon.element.querySelectorAll('.e-ribbon-item').length).toBe(5);
            containerEle.style.width = '400px';
            ribbon.refreshLayout();
            (ribbon.element.querySelector('.e-ribbon-collapse-btn') as HTMLElement).click();
            expect(ribbon.element.classList.contains('e-ribbon-minimize')).toBe(false);
            expect(ribbon.activeLayout).toBe('Simplified');
            expect((ribbon.element.querySelector('.e-tab-header .e-active') as HTMLElement).innerText.toLowerCase()).toBe('tab1');
            ribbon.setProperties({ tabAnimation: { previous: { effect: "None" }, next: { effect: "None" } } });
            ribbon.selectTab('tab2');
            expect((ribbon.element.querySelector('.e-tab-header .e-active') as HTMLElement).innerText.toLowerCase()).toBe('tab2');
            expect(ribbon.element.querySelectorAll('.e-ribbon-item').length).toBe(6);
        });

        it('Without initial overflow', () => {
            let isfiltered: boolean = false;
            let template1 = '<button id="btn1" class="tempContent">Button1</button>';
            ribbon = new Ribbon({
                activeLayout: "Simplified",
                tabs: [{
                    id: "tab1",
                    header: "tab1",
                    groups: [{
                        id: "group1",
                        header: "group1Header",
                        orientation: ItemOrientation.Row,
                        enableGroupOverflow: true,
                        collections: [{
                            id: "collection1",
                            items: [{
                                id: "item1",
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Large,
                                displayOptions: DisplayMode.Simplified,
                                buttonSettings: {
                                    content: 'button1',
                                    iconCss: 'e-icons e-cut',
                                }
                            }]
                        }, {
                            id: "collection2",
                            items: [{
                                id: "item2",
                                type: RibbonItemType.DropDown,
                                allowedSizes: RibbonItemSize.Medium,
                                dropDownSettings: {
                                    content: 'Edit',
                                    iconCss: 'e-icons e-edit',
                                    items: dropDownButtonItems
                                }
                            },
                            {
                                id: "item3",
                                type: RibbonItemType.ComboBox,
                                comboBoxSettings: {
                                    dataSource: sportsData,
                                    index: 1,
                                    allowFiltering: true,
                                    width: '200px',
                                    filtering: function (e: FilteringEventArgs) {
                                        isfiltered = true;
                                        let combobox_query = new Query();
                                        combobox_query = (e.text !== '') ? combobox_query.where('', 'contains', e.text, true) : combobox_query;
                                        e.updateData(sportsData, combobox_query);
                                    }
                                }
                            },
                            {
                                id: "item4",
                                type: RibbonItemType.ColorPicker,
                                colorPickerSettings: {
                                    value: '#123456'
                                }
                            }]
                        }]
                    },
                    {
                        id: "group2",
                        header: "group2Header",
                        collections: [{
                            id: "collection3",
                            items: [{
                                id: "item5",
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Medium,
                                displayOptions: DisplayMode.Simplified,
                                buttonSettings: {
                                    content: 'button2',
                                    iconCss: 'e-icons e-cut',
                                }
                            },
                            {
                                id: "item6",
                                type: RibbonItemType.CheckBox,
                                checkBoxSettings: {
                                    label: 'Check1',
                                    checked: true,
                                }
                            },
                            {
                                id: "item7",
                                type: RibbonItemType.Template,
                                itemTemplate: template1
                            }]
                        }]
                    },
                    {
                        id: "group3",
                        header: "group3Header",
                        collections: [{
                            id: "collection4",
                            items: [{
                                id: "item8",
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Medium,
                                displayOptions: DisplayMode.Simplified,
                                buttonSettings: {
                                    content: 'button2',
                                    iconCss: 'e-icons e-cut',
                                }
                            },
                            {
                                id: "item9",
                                type: RibbonItemType.CheckBox,
                                checkBoxSettings: {
                                    label: 'Check1',
                                    checked: true,
                                }
                            },
                            {
                                id: "item10",
                                type: RibbonItemType.Template,
                                itemTemplate: template1
                            }]
                        }]
                    }]
                }]
            }, ribbonEle);
            expect(ribbon.element.querySelectorAll('.e-ribbon-row').length).toBe(0);
            expect(ribbon.element.querySelectorAll('.e-ribbon-group-header').length).toBe(0);
            expect(ribbon.element.querySelectorAll('.e-ribbon-group').length).toBe(3);
            expect(ribbon.element.querySelectorAll('.e-ribbon-content-height').length).toBe(0);
            expect(ribbon.element.querySelectorAll('.e-ribbon-group-of-btn').length).toBe(1);
            expect(ribbon.element.querySelectorAll('.e-ribbon-overall-of-btn').length).toBe(1);
            expect(ribbon.element.querySelectorAll('.e-ribbon-item').length).toBe(4);
            expect(document.querySelectorAll('.e-hscroll-bar').length).toBe(0);
            containerEle.style.width = '300px';
            ribbon.refreshLayout();
            expect(ribbon.element.querySelectorAll('.e-ribbon-group').length).toBe(3);
            expect(ribbon.element.querySelectorAll('.e-ribbon-content-height').length).toBe(0);
            expect(ribbon.element.querySelectorAll('.e-ribbon-group-of-btn').length).toBe(1);
            expect(ribbon.element.querySelectorAll('.e-ribbon-overall-of-btn').length).toBe(1);
            expect(ribbon.element.querySelectorAll('.e-ribbon-item').length).toBe(3);
            expect(document.querySelectorAll('.e-hscroll-bar').length).toBe(1);
            containerEle.style.width = '1200px';
            ribbon.refreshLayout();
            expect(ribbon.element.querySelectorAll('.e-ribbon-group').length).toBe(3);
            expect(ribbon.element.querySelectorAll('.e-ribbon-group-of-btn').length).toBe(0);
            expect(ribbon.element.querySelectorAll('.e-ribbon-overall-of-btn').length).toBe(0);
            expect(ribbon.element.querySelectorAll('.e-ribbon-item').length).toBe(10);
            expect(document.querySelectorAll('.e-hscroll-bar').length).toBe(0);
        });
        it('None item', () => {
            ribbon = new Ribbon({
                activeLayout: "Classic",
                tabs: [{
                    id: "tab1",
                    header: "tab1",
                    groups: [{
                        id: "group1",
                        header: "group1Header",
                        orientation: ItemOrientation.Row,
                        enableGroupOverflow: true,
                        collections: [{
                            id: "collection1",
                            items: [{
                                id: "item1",
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Medium,
                                displayOptions: DisplayMode.Simplified,
                                buttonSettings: {
                                    content: 'button1',
                                    iconCss: 'e-icons e-cut',
                                }
                            },
                            {
                                id: "item2",
                                type: RibbonItemType.DropDown,
                                allowedSizes: RibbonItemSize.Medium,
                                displayOptions: DisplayMode.None,
                                dropDownSettings: {
                                    content: 'Edit',
                                    iconCss: 'e-icons e-edit',
                                    items: dropDownButtonItems
                                }
                            },
                            {
                                id: "item3",
                                type: RibbonItemType.ColorPicker,
                                displayOptions: DisplayMode.Simplified,
                                colorPickerSettings: {
                                    value: '#123456'
                                }
                            }]
                        }]
                    }]
                }]
            }, ribbonEle);
            expect(ribbon.element.querySelectorAll('.e-ribbon-row').length).toBe(1);
            expect(ribbon.element.querySelectorAll('.e-ribbon-group-header').length).toBe(1);
            expect(ribbon.element.querySelectorAll('.e-ribbon-group').length).toBe(1);
            expect(ribbon.element.querySelectorAll('.e-ribbon-content-height').length).toBe(1);
            expect(ribbon.element.querySelectorAll('.e-ribbon-item').length).toBe(3);
            expect((ribbon.element.querySelector('#item2') as HTMLElement).innerText.toLowerCase()).toBe('edit');
            expect(isNullOrUndefined((ribbon.element.querySelector('#item2') as HTMLElement).querySelector('.e-edit'))).toBe(false);
            (ribbon.element.querySelector('.e-ribbon-collapse-btn') as HTMLElement).click();
            expect(ribbon.element.classList.contains('e-ribbon-minimize')).toBe(false);
            expect(ribbon.activeLayout).toBe('Simplified');
            expect(ribbon.element.querySelectorAll('.e-edit').length).toBe(0);
            (ribbon.element.querySelector('.e-ribbon-collapse-btn') as HTMLElement).click();
            expect(ribbon.element.classList.contains('e-ribbon-minimize')).toBe(false);
            expect(ribbon.activeLayout).toBe('Classic');
            expect((ribbon.element.querySelector('#item2') as HTMLElement).innerText.toLowerCase()).toBe('edit');
            expect(isNullOrUndefined((ribbon.element.querySelector('#item2') as HTMLElement).querySelector('.e-edit'))).toBe(false);
        });

        it('With initial overflow with enableRtl', () => {
            let isfiltered: boolean = false;
            ribbon = new Ribbon({
                activeLayout: "Simplified",
                enableRtl: true,
                tabs: [{
                    id: "tab1",
                    header: "tab1",
                    groups: [{
                        id: "group1",
                        header: "group1Header",
                        priority: 1,
                        orientation: ItemOrientation.Row,
                        collections: [{
                            id: "collection1",
                            items: [{
                                id: "item1",
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Medium,
                                displayOptions: DisplayMode.Overflow,
                                buttonSettings: {
                                    content: 'button1',
                                    iconCss: 'e-icons e-cut',
                                }
                            },
                            {
                                id: "item2",
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Medium,
                                displayOptions: DisplayMode.Overflow,
                                buttonSettings: {
                                    content: 'button2',
                                    iconCss: 'e-icons e-cut',
                                }
                            }]
                        }, {
                            id: "collection2",
                            items: [{
                                id: "item3",
                                type: RibbonItemType.SplitButton,
                                allowedSizes: RibbonItemSize.Medium,
                                displayOptions: DisplayMode.Overflow,
                                splitButtonSettings: {
                                    content: 'Edit',
                                    iconCss: 'e-icons e-edit',
                                    items: dropDownButtonItems
                                }
                            },
                            {
                                id: "item4",
                                type: RibbonItemType.ComboBox,
                                displayOptions: DisplayMode.Auto,
                                comboBoxSettings: {
                                    dataSource: sportsData,
                                    index: 1,
                                    allowFiltering: true,
                                    filtering: function (e: FilteringEventArgs) {
                                        isfiltered = true;
                                        let combobox_query = new Query();
                                        combobox_query = (e.text !== '') ? combobox_query.where('', 'contains', e.text, true) : combobox_query;
                                        e.updateData(sportsData, combobox_query);
                                    }
                                }
                            },
                            {
                                id: "item5",
                                type: RibbonItemType.ColorPicker,
                                displayOptions: DisplayMode.Auto,
                                colorPickerSettings: {
                                    value: '#123456'
                                }
                            }]
                        }]
                    },
                    {
                        id: "group2",
                        header: "group2Header",
                        priority: 2,
                        enableGroupOverflow: true,
                        orientation: ItemOrientation.Row,
                        collections: [{
                            id: "collection3",
                            items: [{
                                id: "item6",
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Large,
                                displayOptions: DisplayMode.Simplified,
                                buttonSettings: {
                                    content: 'button2',
                                    iconCss: 'e-icons e-cut',
                                }
                            },
                            {
                                id: 'item7',
                                type: RibbonItemType.CheckBox,
                                displayOptions: DisplayMode.Auto,
                                checkBoxSettings: {
                                    label: 'Check1',
                                    checked: true,
                                }
                            }, {
                                id: 'item8',
                                type: RibbonItemType.CheckBox,
                                displayOptions: DisplayMode.Overflow,
                                checkBoxSettings: {
                                    label: 'Check2',
                                    checked: true,
                                }
                            }, {
                                id: 'item9',
                                type: RibbonItemType.ColorPicker,
                                displayOptions: DisplayMode.Overflow,
                                colorPickerSettings: {
                                    value: '#123456'
                                }
                            }]
                        }]
                    },
                    {
                        id: "group3",
                        header: "group3Header",
                        priority: 3,
                        collections: [{
                            id: "collection4",
                            items: [{
                                id: "item10",
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Medium,
                                displayOptions: DisplayMode.Simplified,
                                buttonSettings: {
                                    content: 'button2',
                                    iconCss: 'e-icons e-cut',
                                }
                            },
                            {
                                id: "item11",
                                type: RibbonItemType.CheckBox,
                                displayOptions: DisplayMode.Auto,
                                checkBoxSettings: {
                                    label: 'Check1',
                                    checked: true,
                                }
                            }]
                        },
                        {
                            id: "collection5",
                            items: [{
                                id: "item12",
                                type: RibbonItemType.CheckBox,
                                displayOptions: DisplayMode.Overflow,
                                checkBoxSettings: {
                                    label: 'Check2',
                                    checked: true,
                                }
                            },
                            {
                                id: "item13",
                                type: RibbonItemType.CheckBox,
                                displayOptions: DisplayMode.Overflow,
                                checkBoxSettings: {
                                    label: 'Check3',
                                    checked: true,
                                }
                            }]
                        }]
                    }]
                }]
            }, ribbonEle);
            (ribbon.element.querySelector('#ribbon_tab_sim_ovrl_overflow') as any).ej2_instances[0].openPopUp();
            expect(ribbon.element.querySelector('.e-ribbon-tab').classList.contains('e-rtl')).toBe(true);
            expect(document.body.querySelector('#item1').classList.contains('e-rtl')).toBe(true);
            expect(document.body.querySelector('#item2').classList.contains('e-rtl')).toBe(true);
            expect(document.body.querySelector('#item3').classList.contains('e-rtl')).toBe(true);
            expect(document.body.querySelector('#item4').closest('.e-input-group').classList.contains('e-rtl')).toBe(true);
            expect(document.body.querySelector('#item5').closest('.e-colorpicker-wrapper').classList.contains('e-rtl')).toBe(true);
            expect(document.body.querySelector('#item6').classList.contains('e-rtl')).toBe(true);
            expect(document.body.querySelector('#item7').closest('.e-checkbox-wrapper').classList.contains('e-rtl')).toBe(true);
            // for item 8 and item 9
            expect(ribbon.element.querySelector('#group2_sim_grp_overflow').classList.contains('e-rtl')).toBe(true);
            expect(document.body.querySelector('#item10').classList.contains('e-rtl')).toBe(true);
            expect(document.body.querySelector('#item11').closest('.e-checkbox-wrapper').classList.contains('e-rtl')).toBe(true);
            expect(document.body.querySelector('#item12').closest('.e-checkbox-wrapper').classList.contains('e-rtl')).toBe(true);
            expect(document.body.querySelector('#item13').closest('.e-checkbox-wrapper').classList.contains('e-rtl')).toBe(true);
            // overall overflow
            expect(ribbon.element.querySelector('#ribbon_tab_sim_ovrl_overflow').classList.contains('e-rtl')).toBe(true);
            (ribbon.element.querySelector('#ribbon_tab_sim_ovrl_overflow') as any).ej2_instances[0].closePopup();
            ribbon.enableRtl = false;
            ribbon.dataBind();
            (ribbon.element.querySelector('#ribbon_tab_sim_ovrl_overflow') as any).ej2_instances[0].openPopUp();
            expect(ribbon.element.querySelector('#ribbon_tab').classList.contains('e-rtl')).toBe(false);
            expect(document.body.querySelector('#item1').classList.contains('e-rtl')).toBe(false);
            expect(document.body.querySelector('#item2').classList.contains('e-rtl')).toBe(false);
            expect(document.body.querySelector('#item3').classList.contains('e-rtl')).toBe(false);
            expect(document.body.querySelector('#item4').closest('.e-input-group').classList.contains('e-rtl')).toBe(false);
            expect(document.body.querySelector('#item5').closest('.e-colorpicker-wrapper').classList.contains('e-rtl')).toBe(false);
            expect(document.body.querySelector('#item6').classList.contains('e-rtl')).toBe(false);
            expect(document.body.querySelector('#item7').closest('.e-checkbox-wrapper').classList.contains('e-rtl')).toBe(false);
            // for item 8 and item 9
            expect(ribbon.element.querySelector('#group2_sim_grp_overflow').classList.contains('e-rtl')).toBe(false);
            expect(document.body.querySelector('#item10').classList.contains('e-rtl')).toBe(false);
            expect(document.body.querySelector('#item11').closest('.e-checkbox-wrapper').classList.contains('e-rtl')).toBe(false);
            expect(document.body.querySelector('#item12').closest('.e-checkbox-wrapper').classList.contains('e-rtl')).toBe(false);
            expect(document.body.querySelector('#item13').closest('.e-checkbox-wrapper').classList.contains('e-rtl')).toBe(false);
            // overall overflow
            expect(ribbon.element.querySelector('#ribbon_tab_sim_ovrl_overflow').classList.contains('e-rtl')).toBe(false);
            (ribbon.element.querySelector('#ribbon_tab_sim_ovrl_overflow') as any).ej2_instances[0].closePopup();
        });

        it('Overflow popup items', () => {
            let isfiltered: boolean = false;
            let template1 = '<button id="btn1" class="tempContent">Button1</button>';
            ribbon = new Ribbon({
                activeLayout: "Simplified",
                tabs: [{
                    id: "tab1",
                    header: "tab1",
                    groups: [{
                        id: "group1",
                        header: "group1Header",
                        priority: 1,
                        orientation: ItemOrientation.Row,
                        collections: [{
                            id: "collection1",
                            items: [{
                                id: "item1",
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Medium,
                                displayOptions: DisplayMode.Overflow,
                                buttonSettings: {
                                    content: 'button1',
                                    iconCss: 'e-icons e-cut',
                                }
                            },
                            {
                                id: "item2",
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Medium,
                                displayOptions: DisplayMode.Overflow,
                                buttonSettings: {
                                    content: 'button2',
                                    iconCss: 'e-icons e-cut',
                                }
                            }]
                        }, {
                            id: "collection2",
                            items: [{
                                id: "item3",
                                type: RibbonItemType.DropDown,
                                allowedSizes: RibbonItemSize.Medium,
                                displayOptions: DisplayMode.Overflow,
                                dropDownSettings: {
                                    content: 'Edit',
                                    iconCss: 'e-icons e-edit',
                                    items: dropDownButtonItems
                                }
                            },
                            {
                                id: "item4",
                                type: RibbonItemType.ComboBox,
                                displayOptions: DisplayMode.Auto,
                                comboBoxSettings: {
                                    dataSource: sportsData,
                                    index: 1,
                                    allowFiltering: true,
                                    filtering: function (e: FilteringEventArgs) {
                                        isfiltered = true;
                                        let combobox_query = new Query();
                                        combobox_query = (e.text !== '') ? combobox_query.where('', 'contains', e.text, true) : combobox_query;
                                        e.updateData(sportsData, combobox_query);
                                    }
                                }
                            },
                            {
                                id: "item5",
                                type: RibbonItemType.ColorPicker,
                                displayOptions: DisplayMode.Auto,
                                colorPickerSettings: {
                                    value: '#123456'
                                }
                            }]
                        }]
                    },
                    {
                        id: "group2",
                        header: "group2Header",
                        priority: 2,
                        enableGroupOverflow: true,
                        orientation: ItemOrientation.Row,
                        collections: [{
                            id: "collection3",
                            items: [{
                                id: "item6",
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Large,
                                displayOptions: DisplayMode.Simplified,
                                buttonSettings: {
                                    content: 'button2',
                                    iconCss: 'e-icons e-cut',
                                }
                            },
                            {
                                id: 'item7',
                                type: RibbonItemType.CheckBox,
                                displayOptions: DisplayMode.Auto,
                                checkBoxSettings: {
                                    label: 'Check1',
                                    checked: true,
                                }
                            }, {
                                id: 'item8',
                                type: RibbonItemType.CheckBox,
                                displayOptions: DisplayMode.Overflow,
                                checkBoxSettings: {
                                    label: 'Check2',
                                    checked: true,
                                }
                            }, {
                                id: 'item9',
                                type: RibbonItemType.ColorPicker,
                                displayOptions: DisplayMode.Overflow,
                                colorPickerSettings: {
                                    value: '#123456'
                                }
                            }]
                        }]
                    },
                    {
                        id: "group3",
                        header: "group3Header",
                        priority: 3,
                        collections: [{
                            id: "collection4",
                            items: [{
                                id: "item10",
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Medium,
                                displayOptions: DisplayMode.Simplified,
                                buttonSettings: {
                                    content: 'button2',
                                    iconCss: 'e-icons e-cut',
                                }
                            },
                            {
                                id: "item11",
                                type: RibbonItemType.CheckBox,
                                displayOptions: DisplayMode.Auto,
                                checkBoxSettings: {
                                    label: 'Check1',
                                    checked: true,
                                }
                            }]
                        },
                        {
                            id: "collection5",
                            items: [{
                                id: "item12",
                                type: RibbonItemType.CheckBox,
                                displayOptions: DisplayMode.Overflow,
                                checkBoxSettings: {
                                    label: 'Check2',
                                    checked: true,
                                }
                            },
                            {
                                id: "item13",
                                type: RibbonItemType.CheckBox,
                                displayOptions: DisplayMode.Overflow,
                                checkBoxSettings: {
                                    label: 'Check3',
                                    checked: true,
                                }
                            },
                            {
                                id: "item43",
                                type: RibbonItemType.SplitButton,
                                allowedSizes: RibbonItemSize.Medium,
                                displayOptions: DisplayMode.Overflow,
                                splitButtonSettings: {
                                    content: 'Edit',
                                    iconCss: 'e-icons e-edit',
                                    items: dropDownButtonItems
                                }
                            }]
                        }]
                    }]
                }]
            }, ribbonEle);
            expect(ribbon.element.querySelectorAll('.e-ribbon-row').length).toBe(0);
            expect(ribbon.element.querySelectorAll('.e-ribbon-group-header').length).toBe(0);
            expect(ribbon.element.querySelectorAll('.e-ribbon-group').length).toBe(3);
            expect(ribbon.element.querySelectorAll('.e-ribbon-content-height').length).toBe(0);
            expect(ribbon.element.querySelectorAll('.e-ribbon-group-of-btn').length).toBe(1);
            expect(ribbon.element.querySelectorAll('.e-ribbon-overall-of-btn').length).toBe(1);
            expect(ribbon.element.querySelectorAll('.e-ribbon-item').length).toBe(4);
            (ribbon.element.querySelector('#ribbon_tab_sim_ovrl_overflow') as any).ej2_instances[0].openPopUp();
            (document.body.querySelector('#item3') as any).ej2_instances[0].openPopUp();
            (document.body.querySelector('#item3') as any).ej2_instances[0].closePopup();
            (ribbon.element.querySelector('#ribbon_tab_sim_ovrl_overflow') as any).ej2_instances[0].closePopup();
        });
    });

    describe('Items allowedSizes and actualSize', () => {
        let ribbon: Ribbon;
        let ribbonEle: HTMLElement;
        let containerEle: HTMLElement;
        beforeEach(() => {
            ribbonEle = createElement('div', { id: 'ribbon' });
            containerEle = createElement('div', { id: 'container', styles: 'width:600px' });
            containerEle.appendChild(ribbonEle);
            document.body.appendChild(containerEle);
        })
        afterEach(() => {
            if (ribbon) {
                ribbon.destroy();
                ribbon = undefined;
            }
            remove(ribbonEle);
            remove(containerEle);
        });

        it('Normal to Simplified mode without oveflow ', () => {
            let isfiltered: boolean = false;
            let template1 = '<button id="btn1" class="tempContent">Button1</button>';
            ribbon = new Ribbon({
                tabs: [{
                    id: "tab1",
                    header: "tab1",
                    groups: [{
                        id: "group1",
                        header: "group1Header",
                        priority: 1,
                        collections: [{
                            id: "collection1",
                            items: [{
                                id: "item1",
                                type: RibbonItemType.SplitButton,
                                allowedSizes: RibbonItemSize.Large,
                                splitButtonSettings: {
                                    content: 'Paste',
                                    iconCss: 'e-icons e-paste',
                                    items: [{ text: 'Keep Source Format' }, { text: 'Merge format' }, { text: 'Keep text only' }]
                                }
                            }]
                        }, 
                        {
                            id: "collection2",
                            items: [{
                                id: "item2",
                                type: RibbonItemType.DropDown,
                                allowedSizes: RibbonItemSize.Medium,
                                dropDownSettings: {
                                    content: 'Edit',
                                    iconCss: 'e-icons e-edit',
                                    items: dropDownButtonItems
                                }
                            },
                            {
                                id: "item3",
                                type: RibbonItemType.ComboBox,
                                allowedSizes: RibbonItemSize.Medium,
                                comboBoxSettings: {
                                    dataSource: sportsData,
                                    index: 1,
                                    allowFiltering: true,
                                    filtering: function (e: FilteringEventArgs) {
                                        isfiltered = true;
                                        let combobox_query = new Query();
                                        combobox_query = (e.text !== '') ? combobox_query.where('', 'contains', e.text, true) : combobox_query;
                                        e.updateData(sportsData, combobox_query);
                                    }
                                }
                            },
                            {
                                id: "item4",
                                type: RibbonItemType.ColorPicker,
                                colorPickerSettings: {
                                    value: '#123456'
                                }
                            }]
                        }]
                    }, 
                    {
                        id: "group2",
                        header: "group2Header",
                        priority: 1,
                        collections: [{
                            id: "collection3",
                            items: [{
                                id: "item5",
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Small,
                                buttonSettings: {
                                    content: 'Bold',
                                    iconCss: 'e-icons e-bold'
                                }
                            },
                            {
                                id: "item6",
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Small,
                                buttonSettings: {
                                    content: 'Italic',
                                    iconCss: 'e-icons e-italic'
                                }
                            },
                            {
                                id: "item7",
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Small,
                                buttonSettings: {
                                    content: 'UnderLine',
                                    iconCss: 'e-icons e-underline'
                                }
                            }]
                        }]
                    }]
                }]
                }, ribbonEle);
            expect(ribbon.element.querySelectorAll('.e-ribbon-row').length).toBe(3);
            expect(ribbon.element.querySelectorAll('.e-ribbon-group-header').length).toBe(2);
            expect((ribbon.element.querySelector('#item1').closest('.e-ribbon-large-item')) != null).toBe(true);
            expect((ribbon.element.querySelector('#item2').closest('.e-ribbon-medium-item')) != null).toBe(true);
            expect((ribbon.element.querySelector('#item5').closest('.e-ribbon-small-item')) != null).toBe(true);
            ribbon.setProperties({ activeLayout: 'Simplified' });
            expect(ribbon.element.querySelectorAll('.e-ribbon-row').length).toBe(0);
            expect(ribbon.element.querySelectorAll('.e-ribbon-group-header').length).toBe(0);
            expect((ribbon.element.querySelector('#item1').closest('.e-ribbon-medium-item')) != null).toBe(true);
            expect((ribbon.element.querySelector('#item2').closest('.e-ribbon-medium-item')) != null).toBe(true);
            expect((ribbon.element.querySelector('#item5').closest('.e-ribbon-small-item')) != null).toBe(true);
        });
        it('Normal to Simplified mode with oveflow ', () => {
            let isfiltered: boolean = false;
            let template1 = '<button id="btn1" class="tempContent">Button1</button>';
            ribbon = new Ribbon({
                tabs: [{
                    id: "tab1",
                    header: "tab1",
                    groups: [{
                        id: "group1",
                        header: "group1Header",
                        priority: 1,
                        enableGroupOverflow: true,
                        collections: [{
                            id: "collection1",
                            items: [{
                                id: "item1",
                                type: RibbonItemType.SplitButton,
                                allowedSizes: RibbonItemSize.Large,
                                displayOptions: DisplayMode.Overflow,
                                splitButtonSettings: {
                                    content: 'Paste',
                                    iconCss: 'e-icons e-paste',
                                    items: [{ text: 'Keep Source Format' }, { text: 'Merge format' }, { text: 'Keep text only' }]
                                }
                            }]
                        }, 
                        {
                            id: "collection2",
                            items: [{
                                id: "item2",
                                type: RibbonItemType.DropDown,
                                allowedSizes: RibbonItemSize.Medium,
                                displayOptions: DisplayMode.Overflow,
                                dropDownSettings: {
                                    content: 'Edit',
                                    iconCss: 'e-icons e-edit',
                                    items: dropDownButtonItems
                                }
                            },
                            {
                                id: "item3",
                                type: RibbonItemType.ComboBox,
                                allowedSizes: RibbonItemSize.Medium,
                                comboBoxSettings: {
                                    dataSource: sportsData,
                                    index: 1,
                                    allowFiltering: true,
                                    filtering: function (e: FilteringEventArgs) {
                                        isfiltered = true;
                                        let combobox_query = new Query();
                                        combobox_query = (e.text !== '') ? combobox_query.where('', 'contains', e.text, true) : combobox_query;
                                        e.updateData(sportsData, combobox_query);
                                    }
                                }
                            },
                            {
                                id: "item4",
                                type: RibbonItemType.ColorPicker,
                                colorPickerSettings: {
                                    value: '#123456'
                                }
                            }]
                        }]
                    }, 
                    {
                        id: "group2",
                        header: "group2Header",
                        priority: 1,
                        collections: [{
                            id: "collection3",
                            items: [{
                                id: "item5",
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Small,
                                displayOptions: DisplayMode.Overflow,
                                buttonSettings: {
                                    content: 'Bold',
                                    iconCss: 'e-icons e-bold'
                                }
                            },
                            {
                                id: "item6",
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Small,
                                buttonSettings: {
                                    content: 'Italic',
                                    iconCss: 'e-icons e-italic'
                                }
                            },
                            {
                                id: "item7",
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Small,
                                buttonSettings: {
                                    content: 'UnderLine',
                                    iconCss: 'e-icons e-underline'
                                }
                            }]
                        }]
                    }]
                }]
                }, ribbonEle);
            expect(ribbon.element.querySelectorAll('.e-ribbon-row').length).toBe(3);
            expect(ribbon.element.querySelectorAll('.e-ribbon-group-header').length).toBe(2);
            expect((ribbon.element.querySelector('#item1').closest('.e-ribbon-large-item')) != null).toBe(true);
            expect((ribbon.element.querySelector('#item2').closest('.e-ribbon-medium-item')) != null).toBe(true);
            expect((ribbon.element.querySelector('#item5').closest('.e-ribbon-small-item')) != null).toBe(true);
            ribbon.setProperties({ activeLayout: 'Simplified' });
            expect(ribbon.element.querySelectorAll('.e-ribbon-row').length).toBe(0);
            expect(ribbon.element.querySelectorAll('.e-ribbon-group-header').length).toBe(0);
            expect((document.body.querySelector('#item1').closest('.e-ribbon-medium-item')) != null).toBe(true);
            expect((document.body.querySelector('#item2').closest('.e-ribbon-medium-item')) != null).toBe(true);
            expect((document.body.querySelector('#item5').closest('.e-ribbon-medium-item')) != null).toBe(true);
        });
        it('Simplified to Normal mode with oveflow ', () => {
            let isfiltered: boolean = false;
            let template1 = '<button id="btn1" class="tempContent">Button1</button>';
            ribbon = new Ribbon({
                activeLayout: 'Simplified',
                tabs: [{
                    id: "tab1",
                    header: "tab1",
                    groups: [{
                        id: "group1",
                        header: "group1Header",
                        priority: 1,
                        enableGroupOverflow: true,
                        collections: [{
                            id: "collection1",
                            items: [{
                                id: "items1",
                                type: RibbonItemType.SplitButton,
                                allowedSizes: RibbonItemSize.Large,
                                displayOptions: DisplayMode.Overflow,
                                splitButtonSettings: {
                                    content: 'Paste',
                                    iconCss: 'e-icons e-paste',
                                    items: [{ text: 'Keep Source Format' }, { text: 'Merge format' }, { text: 'Keep text only' }]
                                }
                            }]
                        }, 
                        {
                            id: "collection2",
                            items: [{
                                id: "items2",
                                type: RibbonItemType.DropDown,
                                allowedSizes: RibbonItemSize.Medium,
                                displayOptions: DisplayMode.Overflow,
                                dropDownSettings: {
                                    content: 'Edit',
                                    iconCss: 'e-icons e-edit',
                                    items: dropDownButtonItems
                                }
                            },
                            {
                                id: "items3",
                                type: RibbonItemType.ComboBox,
                                allowedSizes: RibbonItemSize.Medium,
                                comboBoxSettings: {
                                    dataSource: sportsData,
                                    index: 1,
                                    allowFiltering: true,
                                    filtering: function (e: FilteringEventArgs) {
                                        isfiltered = true;
                                        let combobox_query = new Query();
                                        combobox_query = (e.text !== '') ? combobox_query.where('', 'contains', e.text, true) : combobox_query;
                                        e.updateData(sportsData, combobox_query);
                                    }
                                }
                            },
                            {
                                id: "items4",
                                type: RibbonItemType.ColorPicker,
                                colorPickerSettings: {
                                    value: '#123456'
                                }
                            }]
                        }]
                    }, 
                    {
                        id: "group2",
                        header: "group2Header",
                        priority: 1,
                        collections: [{
                            id: "collection3",
                            items: [{
                                id: "items5",
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Small,
                                displayOptions: DisplayMode.Overflow,
                                buttonSettings: {
                                    content: 'Bold',
                                    iconCss: 'e-icons e-bold'
                                }
                            },
                            {
                                id: "items6",
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Small,
                                buttonSettings: {
                                    content: 'Italic',
                                    iconCss: 'e-icons e-italic'
                                }
                            },
                            {
                                id: "items7",
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Small,
                                buttonSettings: {
                                    content: 'UnderLine',
                                    iconCss: 'e-icons e-underline'
                                }
                            }]
                        }]
                    }]
                }]
                }, ribbonEle);
            
            expect(ribbon.element.querySelectorAll('.e-ribbon-row').length).toBe(0);
            expect(ribbon.element.querySelectorAll('.e-ribbon-group-header').length).toBe(0);
            expect((document.body.querySelector('#items1').closest('.e-ribbon-medium-item')) != null).toBe(true);
            expect((document.body.querySelector('#items2').closest('.e-ribbon-medium-item')) != null).toBe(true);
            expect((document.body.querySelector('#items5').closest('.e-ribbon-medium-item')) != null).toBe(true);
            expect(document.body.querySelector('#items2.e-btn').textContent).toBe('Edit');
            ribbon.ribbonButtonModule.updateButton({ content: 'Edit Button'}, 'items2');
            expect(document.body.querySelector('#items2.e-btn').textContent).toBe('Edit Button');
            ribbon.ribbonButtonModule.updateButton({ content: 'Edit'}, 'items2');
            expect(document.body.querySelector('#items2.e-btn').textContent).toBe('Edit');
            expect(document.body.querySelector('#items5.e-btn').textContent).toBe('Bold');
            ribbon.ribbonButtonModule.updateButton({ content: 'Bold Button'}, 'items5');
            expect(document.body.querySelector('#items5.e-btn').textContent).toBe('Bold Button');
            ribbon.ribbonButtonModule.updateButton({ content: 'Bold'}, 'items5');
            expect(document.body.querySelector('#items5.e-btn').textContent).toBe('Bold');
            expect(document.body.querySelector('#items6.e-btn .e-btn-icon').classList.contains('e-cut')).toBe(false);
            expect(document.body.querySelector('#items6.e-btn .e-btn-icon').classList.contains('e-italic')).toBe(true);
            ribbon.ribbonButtonModule.updateButton({ iconCss: 'e-icons e-cut'}, 'items6');
            expect(document.body.querySelector('#items6.e-btn .e-btn-icon').classList.contains('e-cut')).toBe(true);
            expect(document.body.querySelector('#items6.e-btn .e-btn-icon').classList.contains('e-italic')).toBe(false);
            ribbon.ribbonButtonModule.updateButton({ iconCss: 'e-icons e-italic'}, 'items6');
            expect(document.body.querySelector('#items6.e-btn .e-btn-icon').classList.contains('e-cut')).toBe(false);
            expect(document.body.querySelector('#items6.e-btn .e-btn-icon').classList.contains('e-italic')).toBe(true);
            ribbon.setProperties({ activeLayout: 'Classic' });
            expect(ribbon.element.querySelectorAll('.e-ribbon-row').length).toBe(3);
            expect(ribbon.element.querySelectorAll('.e-ribbon-group-header').length).toBe(2);
            expect((ribbon.element.querySelector('#items1').closest('.e-ribbon-large-item')) != null).toBe(true);
            expect((ribbon.element.querySelector('#items2').closest('.e-ribbon-medium-item')) != null).toBe(true);
            expect((ribbon.element.querySelector('#items5').closest('.e-ribbon-small-item')) != null).toBe(true);
        });
        it('Simplified to Normal mode without oveflow ', () => {
            let isfiltered: boolean = false;
            let template1 = '<button id="btn1" class="tempContent">Button1</button>';
            ribbon = new Ribbon({
                activeLayout: 'Simplified',
                tabs: [{
                    id: "tab1",
                    header: "tab1",
                    groups: [{
                        id: "group1",
                        header: "group1Header",
                        priority: 1,
                        collections: [{
                            id: "collection1",
                            items: [{
                                id: "item1",
                                type: RibbonItemType.SplitButton,
                                allowedSizes: RibbonItemSize.Large,
                                splitButtonSettings: {
                                    content: 'Paste',
                                    iconCss: 'e-icons e-paste',
                                    items: [{ text: 'Keep Source Format' }, { text: 'Merge format' }, { text: 'Keep text only' }]
                                }
                            }]
                        }, 
                        {
                            id: "collection2",
                            items: [{
                                id: "item2",
                                type: RibbonItemType.DropDown,
                                allowedSizes: RibbonItemSize.Medium,
                                dropDownSettings: {
                                    content: 'Edit',
                                    iconCss: 'e-icons e-edit',
                                    items: dropDownButtonItems
                                }
                            },
                            {
                                id: "item3",
                                type: RibbonItemType.ComboBox,
                                allowedSizes: RibbonItemSize.Medium,
                                comboBoxSettings: {
                                    dataSource: sportsData,
                                    index: 1,
                                    allowFiltering: true,
                                    filtering: function (e: FilteringEventArgs) {
                                        isfiltered = true;
                                        let combobox_query = new Query();
                                        combobox_query = (e.text !== '') ? combobox_query.where('', 'contains', e.text, true) : combobox_query;
                                        e.updateData(sportsData, combobox_query);
                                    }
                                }
                            },
                            {
                                id: "item4",
                                type: RibbonItemType.ColorPicker,
                                colorPickerSettings: {
                                    value: '#123456'
                                }
                            }]
                        }]
                    }, 
                    {
                        id: "group2",
                        header: "group2Header",
                        priority: 1,
                        collections: [{
                            id: "collection3",
                            items: [{
                                id: "item5",
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Small,
                                buttonSettings: {
                                    content: 'Bold',
                                    iconCss: 'e-icons e-bold'
                                }
                            },
                            {
                                id: "item6",
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Small,
                                buttonSettings: {
                                    content: 'Italic',
                                    iconCss: 'e-icons e-italic'
                                }
                            },
                            {
                                id: "item7",
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Small,
                                buttonSettings: {
                                    content: 'UnderLine',
                                    iconCss: 'e-icons e-underline'
                                }
                            }]
                        }]
                    }]
                }]
                }, ribbonEle);
            expect(ribbon.element.querySelectorAll('.e-ribbon-row').length).toBe(0);
            expect(ribbon.element.querySelectorAll('.e-ribbon-group-header').length).toBe(0);
            expect((ribbon.element.querySelector('#item1').closest('.e-ribbon-medium-item')) != null).toBe(true);
            expect((ribbon.element.querySelector('#item2').closest('.e-ribbon-medium-item')) != null).toBe(true);
            expect((ribbon.element.querySelector('#item5').closest('.e-ribbon-small-item')) != null).toBe(true);
            ribbon.setProperties({ activeLayout: 'Classic' });
            expect(ribbon.element.querySelectorAll('.e-ribbon-row').length).toBe(3);
            expect(ribbon.element.querySelectorAll('.e-ribbon-group-header').length).toBe(2);
            expect((ribbon.element.querySelector('#item1').closest('.e-ribbon-large-item')) != null).toBe(true);
            expect((ribbon.element.querySelector('#item2').closest('.e-ribbon-medium-item')) != null).toBe(true);
            expect((ribbon.element.querySelector('#item5').closest('.e-ribbon-small-item')) != null).toBe(true);
        });
    });

    describe('Help pane Template', () => {
        let ribbon: Ribbon;
        let ribbonEle: HTMLElement;
        let targetEle: HTMLElement;
        beforeEach(() => {
            ribbonEle = createElement('div', { id: 'ribbon' });
            document.body.appendChild(ribbonEle);
            targetEle = createElement('div', { id: 'ribbonTarget', innerHTML: 'Ribbon' });
        })
        afterEach(() => {
            if (ribbon) {
                ribbon.destroy();
                ribbon = undefined;
            }
            remove(ribbonEle);
        });
        it('With Default values', () => {
            ribbon = new Ribbon({
                tabs: [{
                    id: "tab1",
                    header: "tab1",
                    groups: [{
                        id: "group1",
                        header: "group1Header",
                        orientation: ItemOrientation.Row,
                        collections: [{
                            id: "collection1",
                            items: [{
                                id: "item1",
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Large,
                                buttonSettings: {
                                    content: 'button1',
                                    iconCss: 'e-icons e-cut',
                                }
                            }]
                        }]
                    }]
                },],
                helpPaneTemplate: targetEle.outerHTML
            }, ribbonEle);
            expect(ribbon.element.querySelector('.e-ribbon-help-template') !== null).toBe(true);
            expect(ribbon.element.querySelector('#ribbon_helppanetemplate') !== null).toBe(true);
            expect(ribbon.element.querySelector('#ribbon_helppanetemplate').textContent).toBe('Ribbon');
        });
        it('dynamic property change', () => {
            ribbon = new Ribbon({
                tabs: [{
                    id: "tab1",
                    header: "tab1",
                    groups: [{
                        id: "group1",
                        header: "group1Header",
                        orientation: ItemOrientation.Row,
                        collections: [{
                            id: "collection1",
                            items: [{
                                id: "item1",
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Large,
                                buttonSettings: {
                                    content: 'button1',
                                    iconCss: 'e-icons e-cut',
                                }
                            }]
                        }]
                    }]
                },],
                helpPaneTemplate: targetEle.outerHTML
            }, ribbonEle);
            expect(ribbon.element.querySelector('.e-ribbon-help-template') !== null).toBe(true);
            expect(ribbon.element.querySelector('#ribbon_helppanetemplate') !== null).toBe(true);
            expect(ribbon.element.querySelector('#ribbon_helppanetemplate').textContent).toBe('Ribbon');
            ribbon.helpPaneTemplate = 'HelpPaneTemplate';
            ribbon.dataBind();
            expect(ribbon.element.querySelector('#ribbon_helppanetemplate').textContent).toBe('HelpPaneTemplate');
        });
        it('events - mode switching', () => {
            let isRibbonExpanding: boolean = false;
            let isRibbonCollapsing: boolean = false;
            ribbon = new Ribbon({
                tabs: [{
                    id: "tab1",
                    header: "tab1",
                    groups: [{
                        id: "group1",
                        header: "group1Header",
                        orientation: ItemOrientation.Row,
                        collections: [{
                            id: "collection1",
                            items: [{
                                id: "item1",
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Large,
                                buttonSettings: {
                                    content: 'button1',
                                    iconCss: 'e-icons e-cut',
                                }
                            }]
                        }]
                    }]
                },],
                ribbonExpanding: (args: ExpandCollapseEventArgs) => {
                    isRibbonExpanding = true;
                },
                ribbonCollapsing: (args: ExpandCollapseEventArgs) => {
                    isRibbonCollapsing = true;
                },
            }, ribbonEle);
            expect(isRibbonCollapsing).toBe(false);
            (ribbon.element.querySelector('.e-ribbon-collapse-btn') as HTMLElement).click();
            expect(isRibbonCollapsing).toBe(false);
            (ribbon.element.querySelector('.e-ribbon-collapse-btn') as HTMLElement).click();
            expect(isRibbonExpanding).toBe(false);
        });
        it('events - tabs switching', () => {
            let isTabSelecting: boolean = false;
            let isTabSelected: boolean = false;
            let isRibbonExpanding: boolean = false;
            let isRibbonCollapsing: boolean = false;
            ribbon = new Ribbon({
                tabs: [{
                    id: "tab1",
                    header: "tab1",
                    groups: [{
                        id: "group1",
                        header: "group1Header",
                        orientation: ItemOrientation.Row,
                        collections: [{
                            id: "collection1",
                            items: [{
                                id: "item1",
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Large,
                                buttonSettings: {
                                    content: 'button1',
                                    iconCss: 'e-icons e-cut',
                                }
                            }]
                        }]
                    }]
                },{
                    id: "tab2",
                    header: "tab2",
                    groups: [{
                        id: "group2",
                        header: "group2Header",
                        orientation: ItemOrientation.Row,
                        collections: [{
                            id: "collection2",
                            items: [{
                                id: "item2",
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Large,
                                buttonSettings: {
                                    content: 'button2',
                                    iconCss: 'e-icons e-cut',
                                }
                            }]
                        }]
                    }]
                }],
                tabSelecting: (args: TabSelectingEventArgs) => {
                    isTabSelecting = true;
                },
                tabSelected: (args: TabSelectedEventArgs) => {
                    isTabSelected = true;
                },
                ribbonExpanding: (args: ExpandCollapseEventArgs) => {
                    isRibbonExpanding = true;
                },
                ribbonCollapsing: (args: ExpandCollapseEventArgs) => {
                    isRibbonCollapsing = true;
                }
            }, ribbonEle);
            expect(isRibbonCollapsing).toBe(false);
            expect(isTabSelecting).toBe(false);
            expect(isTabSelected).toBe(false);
            let li: HTMLElement = ribbon.element.querySelector('#tab1_header') as HTMLElement;
            triggerMouseEvent(li, 'dblclick');
            expect(isRibbonCollapsing).toBe(true);
            (ribbon.element.querySelector('#tab2_header') as HTMLElement).click();
            expect(isRibbonExpanding).toBe(true);
            ribbon.setProperties({ selectedTab: 1 });
            expect(isTabSelecting).toBe(true);
            expect(isTabSelected).toBe(true);
        });
    });
    describe('Tooltip', () => {
        let ribbon: Ribbon;
        let ribbonEle: HTMLElement;
        let targetEle: HTMLElement;
        let mouseEventArs: any;

        beforeEach(() => {
            ribbonEle = createElement('div', { id: 'ribbon' });
            document.body.appendChild(ribbonEle);
            targetEle = createElement('div', { id: 'ribbonTarget', innerHTML: 'Ribbon' });
            mouseEventArs = {
                preventDefault: (): void => { },
                stopImmediatePropagation: (): void => { },
                target: null,
                relatedTarget: null,
                type: null,
                shiftKey: false,
                ctrlKey: false,
                offset: Number
            };
        });
        afterEach(() => {
            if (ribbon) {
                ribbon.destroy();
                ribbon = undefined;
            }
            remove(ribbonEle);
        });
        it('with Items', () => {
            ribbon = new Ribbon({
                tabs: [{
                    id: "tab1",
                    header: "tab1",
                    groups: [{
                        id: "group1",
                        header: "group1Header",
                        orientation: ItemOrientation.Row,
                        collections: [{
                            id: "collection1",
                            items: [{
                                id: "item1",
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Large,
                                ribbonTooltipSettings: {
                                    title: 'Buttons',
                                    iconCss: 'e-icons e-cut',
                                    content: 'Large size button'
                                },
                                buttonSettings: {
                                    content: 'button1',
                                    iconCss: 'e-icons e-cut',
                                }
                            }]
                        }]
                    }]
                }]
            }, ribbonEle);
            expect(ribbon.element.querySelectorAll('.e-ribbon-item')[0].classList.contains('e-ribbon-tooltip-target')).toBe(true);
            let tooltipElement: any = ribbon.element.querySelector('.e-ribbon-item');
            triggerMouseEvent(tooltipElement, 'mouseover');
            expect(document.querySelector('.e-ribbon-tooltip-title').innerHTML === 'Buttons').toBe(true);
            expect(document.querySelector('.e-ribbon-tooltip-icon').classList.contains('e-cut')).toBe(true);
            expect(document.querySelector('.e-ribbon-tooltip-content').innerHTML === 'Large size button').toBe(true);
            expect(document.querySelectorAll('#e-ribbon-tooltip-container') !== null).toBe(true);
            triggerMouseEvent(tooltipElement, 'mouseleave');
        });
        it('with FileMenu', () => {
            let ribbonTooltip: RibbonTooltipModel = ({
                id: 'files',
                content: 'Explore files',
                title: 'Files',
                iconCss: 'e-icons e-copy',
                cssClass: 'custom-ribbon'
            });
            let files: FileMenuSettingsModel = ({
                text: 'File Menu',
                visible: true,
                popupTemplate: '#ribbonTarget',
                ribbonTooltipSettings: ribbonTooltip
            });
            ribbon = new Ribbon({
                fileMenu: files,
                tabs: [{
                    id: "tab1",
                    header: "tab1",
                    groups: [{
                        id: "group1",
                        header: "group1Header",
                        orientation: ItemOrientation.Row,
                        collections: [{
                            id: "collection1",
                            items: [{
                                id: "item1",
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Large,
                                ribbonTooltipSettings: {
                                    title: 'Buttons',
                                    iconCss: 'e-icons e-cut',
                                    content: 'Large size button'
                                },
                                buttonSettings: {
                                    content: 'button1',
                                    iconCss: 'e-icons e-cut',
                                }
                            }]
                        }]
                    }]
                }]
            }, ribbonEle);
            expect(ribbon.element.querySelectorAll('.e-ribbon-file-menu')[0].classList.contains('e-ribbon-tooltip-target')).toBe(true);
            let tooltipElement: any = ribbon.element.querySelector('.e-ribbon-file-menu');
            triggerMouseEvent(tooltipElement, 'mouseover');
            expect(document.querySelector('.e-ribbon-tooltip-title').innerHTML === 'Files').toBe(true);
            expect(document.querySelector('.e-ribbon-tooltip-icon').classList.contains('e-copy')).toBe(true);
            expect(document.querySelector('.e-ribbon-tooltip-icon').classList.contains('custom-ribbon')).toBe(true);
            expect(document.querySelector('.e-ribbon-tooltip-content').innerHTML === 'Explore files').toBe(true);
            expect(document.querySelector('#e-ribbon-tooltip-container_files') !== null).toBe(true);
            triggerMouseEvent(tooltipElement, 'mouseleave');
        });
        it('with dynamic property change', () => {
            let ribbonTooltip: RibbonTooltipModel = ({
                content: 'Explore files',
                title: 'Files'
            })
            let files: FileMenuSettingsModel = ({
                text: 'File Menu',
                visible: true,
                ribbonTooltipSettings: ribbonTooltip
            });
            ribbon = new Ribbon({
                fileMenu: files,
                tabs: [{
                    id: "tab1",
                    header: "tab1",
                    groups: [{
                        id: "group1",
                        header: "group1Header",
                        orientation: ItemOrientation.Row,
                        collections: [{
                            id: "collection1",
                            items: [{
                                id: "item1",
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Large,
                                ribbonTooltipSettings: {
                                    title: 'Buttons',
                                    content: 'Large size button'
                                },
                                buttonSettings: {
                                    content: 'button1',
                                    iconCss: 'e-icons e-cut',
                                }
                            }]
                        }]
                    }]
                }]
            }, ribbonEle);
            expect(ribbon.element.querySelectorAll('.e-ribbon-file-menu')[0].classList.contains('e-ribbon-tooltip-target')).toBe(true);
            let tooltipElement: any = ribbon.element.querySelector('.e-ribbon-file-menu');
            triggerMouseEvent(tooltipElement, 'mouseover');
            expect(document.querySelector('.e-ribbon-tooltip-title').innerHTML === 'Files').toBe(true);
            expect(document.querySelector('.e-ribbon-tooltip-content').innerHTML === 'Explore files').toBe(true);
            triggerMouseEvent(tooltipElement, 'mouseleave');
            ribbon.fileMenu.ribbonTooltipSettings.title = 'File Menu';
            ribbon.fileMenu.ribbonTooltipSettings.content = 'Explore files here';
            ribbon.dataBind();
            triggerMouseEvent(tooltipElement, 'mouseover');
            expect(document.querySelector('.e-ribbon-tooltip-title').innerHTML === 'File Menu').toBe(true);
            expect(document.querySelector('.e-ribbon-tooltip-content').innerHTML === 'Explore files here').toBe(true);
            triggerMouseEvent(tooltipElement, 'mouseleave');
            tooltipElement = ribbon.element.querySelector('.e-ribbon-item');
            triggerMouseEvent(tooltipElement, 'mouseover');
            expect(document.querySelector('.e-ribbon-tooltip-title').innerHTML === 'Buttons').toBe(true);
            expect(document.querySelector('.e-ribbon-tooltip-content').innerHTML === 'Large size button').toBe(true);
            triggerMouseEvent(tooltipElement, 'mouseleave');
            let item: RibbonItemModel = {
                type: RibbonItemType.DropDown,
                allowedSizes: RibbonItemSize.Small,
                id: 'newItem',
                ribbonTooltipSettings: {
                    title: 'dropdown button',
                    content: 'Large size button'
                },
                dropDownSettings: {
                    content: 'Edit',
                    iconCss: 'e-icons e-edit',
                    items: dropDownButtonItems
                }
            }
            ribbon.addItem('collection1', item);
            expect(ribbon.element.querySelectorAll('.e-ribbon-item')[1].classList.contains('e-ribbon-tooltip-target')).toBe(true);
            tooltipElement = ribbon.element.querySelectorAll('.e-ribbon-item')[1];
            triggerMouseEvent(tooltipElement, 'mouseover');
            expect(document.querySelector('.e-ribbon-tooltip-title').innerHTML === 'dropdown button').toBe(true);
            expect(document.querySelector('.e-ribbon-tooltip-content').innerHTML === 'Large size button').toBe(true);
            triggerMouseEvent(tooltipElement, 'mouseleave');
            ribbon.fileMenu.visible = false;
            ribbon.dataBind();
            expect(ribbon.element.querySelector('.e-ribbon-file-menu') === null).toBe(true);

        });

    });
    describe('Tooltip', () => {
        let ribbon: Ribbon;
        let ribbonEle: HTMLElement;
        let containerEle: HTMLElement;
        let template1 = '<button id="btn1" class="tempContent">Button1</button>';
        let template2 = createElement('button', { id: 'btn2', className: 'tempContent2', innerHTML: 'Button2' });
        beforeEach(() => {
            ribbonEle = createElement('div', { id: 'ribbon' });
            containerEle = createElement('div', { id: 'container', styles: 'width:200px' });
            containerEle.appendChild(ribbonEle);
            document.body.appendChild(containerEle);
        })
        afterEach(() => {
            if (ribbon) {
                ribbon.destroy();
                ribbon = undefined;
            }
            remove(ribbonEle);
            remove(containerEle);
        });
        it('with Overflow dropdown', () => {
            ribbon = new Ribbon({
                tabs: [{
                    header: "Home",
                    groups: [ {
                        header: "Font",
                        orientation: 'Row',
                        groupIconCss: 'e-icons e-bold',
                        cssClass: 'font-group',
                        collections: [{
                            items: [{
                                type: RibbonItemType.ComboBox,
                                comboBoxSettings: {
                                    index: 2,
                                    allowFiltering: true,
                                    width: '150px',
                                    filtering: function (e: FilteringEventArgs) {
                                        let combobox_query = new Query();
                                        combobox_query = (e.text !== '') ? combobox_query.where('', 'contains', e.text, true) : combobox_query;
                                    }
                                }
                            }, {
                                type: RibbonItemType.ComboBox,
                                comboBoxSettings: {
                                    index: 4,
                                    width: '65px'
                                }
                            }]
                        }, {
                            items: [{
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Small,
                                buttonSettings: {
                                    content: 'Bold',
                                    iconCss: 'e-icons e-bold'
                                }
                            }, {
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Small,
                                buttonSettings: {
                                    content: 'Italic',
                                    iconCss: 'e-icons e-italic'
                                }
                            }, {
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Small,
                                buttonSettings: {
                                    content: 'UnderLine',
                                    iconCss: 'e-icons e-underline'
                                }
                            }, {
                                type: RibbonItemType.ColorPicker,
                                colorPickerSettings: {
                                    value: '#123456'
                                }
                            }

                            ]
                        }]
                    }, {
                        header: "Templates",
                        orientation: ItemOrientation.Column,
                        groupIconCss: 'e-icons e-paste',
                        collections: [{
                            items: [{
                                type: RibbonItemType.Template,
                                itemTemplate: template1
                            }, {
                                type: RibbonItemType.Template,
                                itemTemplate: template2.outerHTML
                            }]
                        }]
                    },{
                        header: "Clipboard",
                        id:"group3",
                        groupIconCss: 'e-icons e-paste',
                        collections: [{
                            items: [{
                                id:"ddbitem",
                                type: RibbonItemType.SplitButton,
                                allowedSizes: RibbonItemSize.Large,
                                ribbonTooltipSettings: {
                                    title: 'paste here',
                                    iconCss: 'e-icons e-paste',
                                    content: 'Copy and Paste the documents'
                                },
                                splitButtonSettings: {
                                    content: 'Paste',
                                    iconCss: 'e-icons e-paste',
                                    items: [{ text: 'Keep Source Format' }, { text: 'Merge format' }, { text: 'Keep text only' }]
                                }
                            }]
                        },]
                    }]
                }]
            }, ribbonEle);
            (ribbon.element.querySelector('#group3_overflow_dropdown') as HTMLElement).click();
            expect(document.querySelectorAll('e-ribbon-tooltip-target') !== null).toBe(true);
            let tooltipElement: any = document.querySelector('#ddbitem_container');
            triggerMouseEvent(tooltipElement, 'mouseover');
            expect(document.querySelector('.e-ribbon-tooltip-title').innerHTML === 'paste here').toBe(true);
            expect(document.querySelector('.e-ribbon-tooltip-icon').classList.contains('e-paste')).toBe(true);
            expect(document.querySelector('.e-ribbon-tooltip-content').innerHTML === 'Copy and Paste the documents').toBe(true);
            triggerMouseEvent(tooltipElement, 'mouseleave');
        });
    });
    describe('Launcher Icon', () => {
        let ribbon: Ribbon;
        let ribbonEle: HTMLElement;
        beforeEach(() => {
            ribbonEle = createElement('div', { id: 'ribbon' });
            document.body.appendChild(ribbonEle);
        })
        afterEach(() => {
            if (ribbon) {
                ribbon.destroy();
                ribbon = undefined;
            }
            remove(ribbonEle);
        });
        it('With ShowLauncherIcon is true', () => {
            ribbon = new Ribbon({
                tabs: [{
                    id: "tab1",
                    header: "tab1",
                    groups: [{
                        id: "group1",
                        header: "group1Header",
                        orientation: ItemOrientation.Row,
                        showLauncherIcon:true,
                        collections: [{
                            id: "collection1",
                            items: [{
                                id: "item1",
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Large,
                                buttonSettings: {
                                    content: 'button1',
                                    iconCss: 'e-icons e-cut',
                                }
                            }]
                        }]
                    }]
                },]
            }, ribbonEle);
            expect(ribbon.element.querySelector('.e-ribbon-launcher-icon') !== null).toBe(true);
            expect(ribbon.element.querySelector('.e-launcher') !== null).toBe(true);
            expect(ribbon.element.querySelector('#group1_launcher')!== null).toBe(true);
        });
        it('dynamic property change', () => {
            ribbon = new Ribbon({
                launcherIconCss: 'e-icons e-copy',
                tabs: [{
                    id: "tab1",
                    header: "tab1",
                    groups: [{
                        id: "group1",
                        header: "group1Header",
                        orientation: ItemOrientation.Row,
                        showLauncherIcon:true,
                        collections: [{
                            id: "collection1",
                            items: [{
                                id: "item1",
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Large,
                                buttonSettings: {
                                    content: 'button1',
                                    iconCss: 'e-icons e-cut',
                                }
                            }]
                        }]
                    }]
                },]
            }, ribbonEle);
            expect(ribbon.element.querySelector('.e-launcher') !== null).toBe(false);
            expect(ribbon.element.querySelector('.e-copy') !== null).toBe(true);
            ribbon.launcherIconCss='e-icons e-cut';
            ribbon.dataBind();
            expect(ribbon.element.querySelector('.e-cut') !== null).toBe(true);
            ribbon.removeGroup('group1');
            expect(ribbon.element.querySelector('.e-ribbon-launcher-icon') === null).toBe(true);
        });
        it('events', () => {
            let isLauncherIconClicked: boolean = false;
            ribbon = new Ribbon({
                tabs: [{
                    id: "tab1",
                    header: "tab1",
                    groups: [{
                        id: "group1",
                        header: "group1Header",
                        orientation: ItemOrientation.Row,
                        showLauncherIcon:true,
                        collections: [{
                            id: "collection1",
                            items: [{
                                id: "item1",
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Large,
                                buttonSettings: {
                                    content: 'button1',
                                    iconCss: 'e-icons e-cut',
                                }
                            }]
                        }]
                    }]
                },],
                launcherIconClick: (args: LauncherClickEventArgs) => {
                    isLauncherIconClicked = true;
                },
            }, ribbonEle);
            expect(isLauncherIconClicked).toBe(false);
            (ribbon.element.querySelector('.e-ribbon-launcher-icon') as HTMLElement).click();
            expect(isLauncherIconClicked).toBe(true);
        });
        it('and collapse button keyboard navigation', () => {
            let isLauncherIconClicked: boolean = false;
            ribbon = new Ribbon({
                tabs: [{
                    id: "tab1",
                    header: "tab1",
                    groups: [{
                        id: "group1",
                        header: "group1Header",
                        orientation: ItemOrientation.Row,
                        showLauncherIcon:true,
                        collections: [{
                            id: "collection1",
                            items: [{
                                id: "item1",
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Large,
                                buttonSettings: {
                                    content: 'button1',
                                    iconCss: 'e-icons e-cut',
                                }
                            }]
                        }]
                    }]
                },],
                launcherIconClick: (args: LauncherClickEventArgs) => {
                    isLauncherIconClicked = true;
                },
            }, ribbonEle);
            expect(isLauncherIconClicked).toBe(false);
            document.querySelector('.e-ribbon-launcher-icon').dispatchEvent((new KeyboardEvent('keydown',{'key':'Enter'})));
            expect(isLauncherIconClicked).toBe(true);
            expect(document.querySelector('.e-ribbon-collapse-btn').dispatchEvent(new KeyboardEvent('keydown',{'key':'Enter'})));
            expect(ribbon.element.querySelector('.e-ribbon-expand-btn') !== null).toBe(true);
            expect(document.querySelector('.e-ribbon-collapse-btn').dispatchEvent(new KeyboardEvent('keydown',{'key':'Enter'})));
            expect(ribbon.element.querySelector('.e-ribbon-expand-btn') === null).toBe(true);
        });
    });
    describe('Launcher Icon in Overflow', () => {
        let ribbon: Ribbon;
        let ribbonEle: HTMLElement;
        let containerEle: HTMLElement;
        let template1 = '<button id="btn1" class="tempContent">Button1</button>';
        let template2 = createElement('button', { id: 'btn2', className: 'tempContent2', innerHTML: 'Button2' });
        beforeEach(() => {
            ribbonEle = createElement('div', { id: 'ribbon' });
            containerEle = createElement('div', { id: 'container', styles: 'width:200px' });
            containerEle.appendChild(ribbonEle);
            document.body.appendChild(containerEle);
        })
        afterEach(() => {
            if (ribbon) {
                ribbon.destroy();
                ribbon = undefined;
            }
            remove(ribbonEle);
        });
        it('with dynamic property change', () => {
            ribbon = new Ribbon({
                tabs: [{
                    header: "Home",
                    groups: [{
                        header: "Clipboard",
                        groupIconCss: 'e-icons e-paste',
                        showLauncherIcon:true,
                        collections: [{
                            items: [{
                                type: RibbonItemType.SplitButton,
                                allowedSizes: RibbonItemSize.Large,
                                ribbonTooltipSettings: {
                                    title: 'paste here',
                                    iconCss: 'e-icons e-paste',
                                    content: 'Copy and Paste the documents'
                                },
                                splitButtonSettings: {
                                    content: 'Paste',
                                    iconCss: 'e-icons e-paste',
                                    items: [{ text: 'Keep Source Format' }, { text: 'Merge format' }, { text: 'Keep text only' }]
                                }
                            }]
                        },]
                    }, {
                        header: "Font",
                        orientation: 'Row',
                        groupIconCss: 'e-icons e-bold',
                        cssClass: 'font-group',
                        collections: [{
                            items: [{
                                type: RibbonItemType.ComboBox,
                                comboBoxSettings: {
                                    index: 2,
                                    allowFiltering: true,
                                    width: '150px',
                                    filtering: function (e: FilteringEventArgs) {
                                        let combobox_query = new Query();
                                        combobox_query = (e.text !== '') ? combobox_query.where('', 'contains', e.text, true) : combobox_query;
                                    }
                                }
                            }, {
                                type: RibbonItemType.ComboBox,
                                comboBoxSettings: {
                                    index: 4,
                                    width: '65px'
                                }
                            }]
                        }, {
                            items: [{
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Small,
                                buttonSettings: {
                                    content: 'Bold',
                                    iconCss: 'e-icons e-bold'
                                }
                            }, {
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Small,
                                buttonSettings: {
                                    content: 'Italic',
                                    iconCss: 'e-icons e-italic'
                                }
                            }, {
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Small,
                                buttonSettings: {
                                    content: 'UnderLine',
                                    iconCss: 'e-icons e-underline'
                                }
                            }, {
                                type: RibbonItemType.ColorPicker,
                                colorPickerSettings: {
                                    value: '#123456'
                                }
                            }

                            ]
                        }]
                    }, {
                        header: "Templates",
                        orientation: ItemOrientation.Column,
                        groupIconCss: 'e-icons e-paste',
                        collections: [{
                            items: [{
                                type: RibbonItemType.Template,
                                itemTemplate: template1
                            }, {
                                type: RibbonItemType.Template,
                                itemTemplate: template2.outerHTML
                            }]
                        }]
                    }]
                }]
            }, ribbonEle);
            (ribbon.element.querySelector('.e-ribbon-group-overflow-ddb') as HTMLElement).click();
            expect(document.querySelector('.e-ribbon-launcher-icon') !== null).toBe(true);
            expect(document.querySelector('.e-launcher') !== null).toBe(true);
            ribbon.launcherIconCss='e-icons e-cut';
            ribbon.dataBind();
            expect(document.querySelector('.e-cut') !== null).toBe(true);
        });
    });
    describe('Ribbon layout modes', () => {
        let ribbon: Ribbon;
        let ribbonEle: HTMLElement;
        beforeEach(() => {
            ribbonEle = createElement('div', { id: 'ribbon' });
            document.body.appendChild(ribbonEle);
        })
        afterEach(() => {
            if (ribbon) {
                ribbon.destroy();
                ribbon = undefined;
            }
            remove(ribbonEle);
        });
        it('simplified mode', () => {
            ribbon = new Ribbon({
                activeLayout: "Simplified",
                tabs: [{
                    id: "tab1",
                    header: "tab1",
                    groups: [{
                        id: "group1",
                        header: "group1Header",
                        orientation: ItemOrientation.Row,
                        collections: [{
                            id: "collection1",
                            items: [{
                                id: "item1",
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Large,
                                buttonSettings: {
                                    content: 'button1',
                                    iconCss: 'e-icons e-cut',
                                }
                            }]
                        }, {
                            items: [{
                                type: RibbonItemType.DropDown,
                                allowedSizes: RibbonItemSize.Medium,
                                displayOptions: DisplayMode.None,
                                dropDownSettings: {
                                    content: 'Edit',
                                    iconCss: 'e-icons e-edit',
                                    items: dropDownButtonItems
                                }
                            }]
                        }]
                    }]
                }, {
                    id: "tab2",
                    header: "tab2",
                    groups: [{
                        id: "group2",
                        header: "group1Header",
                        collections: [{
                            id: "collection2",
                            items: [{
                                id: "item2",
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Large,
                                buttonSettings: {
                                    content: 'button2',
                                    iconCss: 'e-icons e-cut',
                                }
                            }]
                        }]
                    }]
                }]
            }, ribbonEle);
            expect(ribbon.element.querySelectorAll('.e-ribbon-row').length).toBe(0);
            expect(ribbon.element.querySelectorAll('.e-ribbon-group-header').length).toBe(0);
        });

        it('split button active state', () => {
            let isSplitButtonOpen: boolean = false;
            let isSplitButtonClose: boolean = false;
            let isColorPickerOpen: boolean = false;
            let isColorPickerBeforeClose: boolean = false;
            ribbon = new Ribbon({
                tabs: [{
                    id: "tab1",
                    header: "tab1",
                    groups: [{
                        id: "group1",
                        header: "group1Header",
                        orientation: ItemOrientation.Row,
                        collections: [{
                            id: "collection1",
                            items: [{
                                id: "item1",
                                type: RibbonItemType.SplitButton,
                                splitButtonSettings: {
                                    iconCss: 'e-icons e-search',
                                    content: 'Find',
                                    items: [
                                        { text: 'Find', iconCss: 'e-icons e-search' },
                                        { text: 'Advanced find', iconCss: 'e-icons e-search' },
                                        { text: 'Go to', iconCss: 'e-icons e-arrow-right' }
                                    ],
                                    open: (args: OpenCloseMenuEventArgs) => {
                                        isSplitButtonOpen = true;
                                    },
                                    close: (args: OpenCloseMenuEventArgs) => {
                                        isSplitButtonClose = true;
                                    }
                                }
                            }]
                        }, {
                            id: "collection2",
                            items: [{
                                id: "item2",
                                type: RibbonItemType.ColorPicker,
                                colorPickerSettings: {
                                    value: '#123456',
                                    open: (args: OpenCloseMenuEventArgs) => {
                                        isColorPickerOpen = true;
                                    },
                                    beforeClose: (args: OpenCloseMenuEventArgs) => {
                                        isColorPickerBeforeClose = true;
                                    }
                                }
                            }]
                        }]
                    }]
                }]
            }, ribbonEle);
            expect(ribbon.element.querySelector('.e-split-btn-wrapper').classList.contains('e-ribbon-hover')).toBe(false);
            expect(ribbon.element.querySelector('.e-split-btn-wrapper').classList.contains('e-ribbon-open')).toBe(false);
            let splitButton: HTMLElement = ribbon.element.querySelector('.e-split-btn-wrapper') as HTMLElement;
            triggerMouseEvent(splitButton, 'mouseenter');
            expect(ribbon.element.querySelector('.e-split-btn-wrapper').classList).toContain('e-ribbon-hover');
            triggerMouseEvent(splitButton, 'mouseleave');
            expect(ribbon.element.querySelector('.e-split-btn-wrapper').classList.contains('e-ribbon-hover')).toBe(false);
            expect(isSplitButtonOpen).toBe(false);
            expect(isSplitButtonClose).toBe(false);
            (ribbon.element.querySelector('#item1') as any).ej2_instances[0].openPopUp();
            expect(ribbon.element.querySelector('.e-split-btn-wrapper').classList).toContain('e-ribbon-open');
            expect(isSplitButtonOpen).toBe(true);
            (ribbon.element.querySelector('#item1') as any).ej2_instances[0].closePopup();
            expect(ribbon.element.querySelector('.e-split-btn-wrapper').classList.contains('e-ribbon-open')).toBe(false);
            expect(isSplitButtonClose).toBe(true);
            //colorpicker
            expect(ribbon.element.querySelector('.e-colorpicker-wrapper').classList.contains('e-ribbon-hover')).toBe(false);
            expect(ribbon.element.querySelector('.e-colorpicker-wrapper').classList.contains('e-ribbon-open')).toBe(false);
            let colorPicker: HTMLElement = ribbon.element.querySelector('.e-colorpicker-wrapper') as HTMLElement;
            triggerMouseEvent(colorPicker, 'mouseenter');
            expect(ribbon.element.querySelector('.e-colorpicker-wrapper').classList).toContain('e-ribbon-hover');
            triggerMouseEvent(colorPicker, 'mouseleave');
            expect(ribbon.element.querySelector('.e-colorpicker-wrapper').classList.contains('e-ribbon-hover')).toBe(false);
            expect(isColorPickerOpen).toBe(false);
            expect(isColorPickerBeforeClose).toBe(false);
            // (ribbon.element.querySelector('.e-split-colorpicker') as any).ej2_instances[0].openPopUp();
            ribbon.ribbonColorPickerModule.toggle('item2');
            expect(ribbon.element.querySelector('.e-colorpicker-wrapper').classList).toContain('e-ribbon-open');
            expect(isColorPickerOpen).toBe(true);
            // (ribbon.element.querySelector('.e-split-colorpicker') as any).ej2_instances[0].closePopup();
            ribbon.ribbonColorPickerModule.toggle('item2');
            expect(ribbon.element.querySelector('.e-colorpicker-wrapper').classList.contains('e-ribbon-open')).toBe(false);
            expect(isColorPickerBeforeClose).toBe(true);
        });
    });
    
    it('memory leak', () => {
        profile.sample();
        const average: any = inMB(profile.averageChange);
        // check average change in memory samples to not be over 10MB
        expect(average).toBeLessThan(10);
        const memory: any = inMB(getMemoryProfile());
        // check the final memory usage against the first usage, there should be little change if everything was properly deallocated
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
    });
});
