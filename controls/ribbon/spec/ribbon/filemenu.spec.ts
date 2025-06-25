/* eslint-disable @typescript-eslint/no-explicit-any */

import { createElement, remove } from "@syncfusion/ej2-base";
import { ItemModel } from "@syncfusion/ej2-splitbuttons";
import * as DropDownEventArgs from "@syncfusion/ej2-splitbuttons"
import { MenuEventArgs, MenuItemModel, BeforeOpenCloseMenuEventArgs, OpenCloseMenuEventArgs } from "@syncfusion/ej2-navigations";
import { ItemOrientation, Ribbon, RibbonItemSize, RibbonItemType } from "../../src/ribbon/base/index";
import { FileMenuSettingsModel } from "../../src/ribbon/models/index";
import { RibbonColorPicker, RibbonFileMenu } from "../../src/index";

Ribbon.Inject(RibbonColorPicker, RibbonFileMenu);

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
            pending(); // skips test (in Chai)
            return;
        }
    });
    describe('File menu', () => {
        let ribbon: Ribbon;
        let ribbonEle: HTMLElement;
        let targetEle: HTMLElement;
        let mouseEventArs: any;
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
                },]
            }, ribbonEle);
            expect(ribbon.element.querySelector('.e-ribbon-file-menu') === null).toBe(true);
            let files: FileMenuSettingsModel = ({
                visible: true
            });
            ribbon.fileMenu = files;
            ribbon.dataBind();
            expect(ribbon.element.querySelector('.e-ribbon-file-menu') !== null).toBe(true);
            expect(ribbon.element.querySelector('#ribbon_filemenu') !== null).toBe(true);
        });
        it(' visible as true', () => {
            let files: FileMenuSettingsModel = ({
                visible: true,
                showItemOnClick: true,
                animationSettings: { effect: 'None' },
                menuItems:[
                    {
                        text: 'Files',
                        id: 'fileMenu',
                        items: [
                            { text: 'Open' },
                            { text: 'Save' },
                            { text: 'Exit' }
                        ]
                    }
                ]
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
                                buttonSettings: {
                                    content: 'button1',
                                    iconCss: 'e-icons e-cut',
                                }
                            }]
                        }]
                    }]
                },]
            }, ribbonEle);
            expect((ribbon.element.querySelector('.e-ribbon-file-menu') as HTMLButtonElement).innerText).toBe('File');
            //For branch coverage
            (ribbon.element.querySelector('.e-ribbon-file-menu') as HTMLButtonElement).click();//open
            (ribbon.element.querySelector('.e-ribbon-file-menu') as HTMLButtonElement).click();//close
            (ribbon.element.querySelector('.e-ribbon-file-menu') as HTMLButtonElement).click();//open
            (document.querySelector('#fileMenu') as HTMLElement).click();//click to show submenu item
        });
        it(' visible as false', () => {
            let files: FileMenuSettingsModel = ({
                visible: false,
                text: 'Files',
                menuItems:[
                    {
                        text: 'Files',
                        id: 'fileMenu',
                        items: [
                            { text: 'Open' },
                            { text: 'Save' },
                            { text: 'Exit' }
                        ]
                    }
                ]
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
                                buttonSettings: {
                                    content: 'button1',
                                    iconCss: 'e-icons e-cut',
                                }
                            }]
                        }]
                    }]
                },]
            }, ribbonEle);
            expect(ribbon.element.querySelector('.e-ribbon-file-menu')).toBe(null);
        });
        it(' fileMenuTarget property and custom header', () => {
            let files: FileMenuSettingsModel = ({
                text: 'File Menu',
                visible: true,
                popupTemplate: '#ribbonTarget'
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
                                buttonSettings: {
                                    content: 'button1',
                                    iconCss: 'e-icons e-cut',
                                }
                            }]
                        }]
                    }]
                },]
            }, ribbonEle);
            expect((ribbon.element.querySelector('.e-ribbon-file-menu') as HTMLButtonElement).innerText).toBe('File Menu');
            expect(ribbon.fileMenu.popupTemplate).toBe('#ribbonTarget');
        });
        it('Methods', () => {
            let menuItems1: MenuItemModel[] = [
                {
                    text: 'File',
                    items: [
                        { text: 'Open' },
                        { text: 'Save' },
                        { text: 'Exit' }
                    ]
                },
                {
                    text: 'Edit',
                    items: [
                        { text: 'Cut' },
                        { text: 'Copy' },
                        { text: 'Paste' }
                    ]
                },
                {
                    text: 'View',
                    items: [
                        { text: 'Toolbar' },
                        { text: 'Sidebar' }
                    ]
                },
                {
                    text: 'Tools',
                    id: 'menuItem4',
                    items: [
                        { text: 'Spelling & Grammar' },
                        { text: 'Customize' },
                        { text: 'Options' }
                    ]
                }
            ];
            let menuItems2: MenuItemModel[] = [
                {
                    id: 'menuItem5',
                    text: 'MenuBar',
                    items: [
                        { text: 'Menu' },
                        { text: 'items' },
                        { text: 'file' }
                    ]
                }];
            let customitem: any = { text: 'Menu' };
            let files: FileMenuSettingsModel = ({
                text: 'Files',
                visible: true,
                menuItems: menuItems1
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
                        }]
                    }]
                },]
            }, ribbonEle);
            expect((ribbon.element.querySelector('.e-ribbon-file-menu') as HTMLButtonElement).innerText).toBe('Files');
            expect(ribbon.element.querySelector('.e-ribbon-file-menu-hidden') === null).toBe(true);
            expect(document.querySelectorAll('.e-menu-item').length).toBe(4);
            ribbon.ribbonFileMenuModule.removeItems(['File']);
            expect(document.querySelectorAll('.e-menu-item').length).toBe(3);
            ribbon.ribbonFileMenuModule.removeItems(['Edit']);
            expect(document.querySelectorAll('.e-menu-item').length).toBe(2);
            ribbon.ribbonFileMenuModule.disableItems(['Tools']);
            expect(document.querySelector('#menuItem4').classList.contains('e-disabled')).toBe(true);
            ribbon.ribbonFileMenuModule.enableItems(['Tools']);
            expect(document.querySelector('#menuItem4').classList.contains('e-disabled')).toBe(false);
            ribbon.ribbonFileMenuModule.addItems(menuItems2, 'View', true);
            expect(document.querySelectorAll('.e-menu-item').length).toBe(3);
            expect(document.querySelector('#menuItem5').textContent).toBe('MenuBar');
            ribbon.ribbonFileMenuModule.addItems(menuItems2, 'View', false);
            expect(document.querySelectorAll('.e-menu-item').length).toBe(4);
            expect(document.querySelector('#menuItem5').textContent).toBe('MenuBar');
            ribbon.ribbonFileMenuModule.setItem(customitem, 'MenuBar', false);
            expect(document.querySelector('#menuItem5').textContent).toBe('Menu');
        });
        it('events for file menu', () => {
            let commonfileMenuItems: MenuItemModel[] = [
                {
                    text: 'Files',
                    id: 'fileMenu',
                    items: [
                        { text: 'Open' },
                        { text: 'Save' },
                        { text: 'Exit' }
                    ]
                }
            ];
            let isFileBeforeOpen: boolean = false;
            let isFileBeforeClose: boolean = false;
            let isFileOpen: boolean = false;
            let isFileClose: boolean = false;
            let file: FileMenuSettingsModel = ({
                text: 'Files',
                visible: true,
                menuItems: commonfileMenuItems,
                beforeOpen: (args: DropDownEventArgs.BeforeOpenCloseMenuEventArgs) => {
                    isFileBeforeOpen = true;
                },
                beforeClose: (args: DropDownEventArgs.BeforeOpenCloseMenuEventArgs) => {
                    isFileBeforeClose = true;
                },
                open: (args: DropDownEventArgs.OpenCloseMenuEventArgs) => {
                    isFileOpen = true;
                },
                close: (args: DropDownEventArgs.OpenCloseMenuEventArgs) => {
                    isFileClose = true;
                }
            });
            ribbon = new Ribbon({
                fileMenu: file,
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
                        }]
                    }]
                },],

            }, ribbonEle);
            expect(isFileBeforeOpen).toBe(false);
            expect(isFileOpen).toBe(false);
            (ribbon.element.querySelector('.e-ribbon-file-menu') as HTMLButtonElement).click();
            expect(isFileBeforeOpen).toBe(true);
            expect(isFileOpen).toBe(true);
            expect(isFileBeforeClose).toBe(false);
            expect(isFileClose).toBe(false);
            (ribbon.element.querySelector('.e-ribbon-file-menu') as HTMLButtonElement).click();
            expect(isFileBeforeClose).toBe(true);
            expect(isFileClose).toBe(true);
        });
        it('events for ribbon menu', () => {
            let commonMenuItems: MenuItemModel[] = [
                {
                    text: 'File',
                    id: 'itemMenu',
                    items: [
                        { text: 'Open' },
                        { text: 'Save' },
                        { text: 'Exit' }
                    ]
                },
                {
                    text: 'Edit',
                    id: 'itemMenu2',
                }
            ];
            let count: number = 0;
            let isBeforeOpen: boolean = false;
            let isBeforeClose: boolean = false;
            let isOpen: boolean = false;
            let isClose: boolean = false;
            let isSelect: boolean = false;
            let files: FileMenuSettingsModel = ({
                text: 'Files',
                visible: true,
                menuItems: commonMenuItems,
                showItemOnClick: true,
                beforeItemRender: (args: MenuEventArgs) => {
                    count++;
                },
                beforeOpen: (args: BeforeOpenCloseMenuEventArgs) => {
                    isBeforeOpen = true;
                },
                beforeClose: (args: BeforeOpenCloseMenuEventArgs) => {
                    isBeforeClose = true;
                },
                open: (args: OpenCloseMenuEventArgs) => {
                    isOpen = true;
                },
                close: (args: OpenCloseMenuEventArgs) => {
                    isClose = true;
                },
                select: (args: MenuEventArgs) => {
                    isSelect = true;
                }
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
                        }]
                    }]
                },],

            }, ribbonEle);
            expect(count).toBe(2);
            expect(isBeforeOpen).toBe(false);
            expect(isSelect).toBe(false);
            (ribbon.element.querySelector('.e-ribbon-file-menu') as HTMLButtonElement).click();
            expect(isBeforeOpen).toBe(true);
            expect(isOpen).toBe(true);
            expect(isBeforeClose).toBe(false);
            (ribbon.element.querySelector('.e-ribbon-file-menu') as HTMLButtonElement).click();
            expect(isBeforeClose).toBe(true);
            expect(isClose).toBe(true);
            (ribbon.element.querySelector('.e-ribbon-file-menu') as HTMLButtonElement).click();
            (document.querySelector('#itemMenu2') as HTMLElement).click();
            expect(isSelect).toBe(true);
            files = ({
                text: 'Files',
                visible: true,
                showItemOnClick: true,
                menuItems: commonMenuItems
            });
            (ribbon.element.querySelector('.e-ribbon-file-menu') as HTMLButtonElement).click();
            (document.querySelector('#itemMenu') as HTMLElement).click();
        });
        it(' dynamic property change', () => {
            let files: FileMenuSettingsModel = ({
                text: 'File Menu',
                visible: true,
                popupTemplate: '#ribbonTarget'
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
                                buttonSettings: {
                                    content: 'button1',
                                    iconCss: 'e-icons e-cut',
                                }
                            }]
                        }]
                    }]
                },]
            }, ribbonEle);
            expect((ribbon.element.querySelector('.e-ribbon-file-menu') as HTMLButtonElement).innerText).toBe('File Menu');
            expect(ribbon.fileMenu.popupTemplate).toBe('#ribbonTarget');
            ribbon.fileMenu.text = 'Files';
            ribbon.dataBind();
            expect((ribbon.element.querySelector('.e-ribbon-file-menu') as HTMLButtonElement).innerText).toBe('Files');
            ribbon.fileMenu.popupTemplate = '#ribbonContent';
            ribbon.dataBind();
            expect(ribbon.fileMenu.popupTemplate).toBe('#ribbonContent');
            ribbon.fileMenu.visible = false;
            ribbon.dataBind();
            expect(ribbon.element.querySelector('.e-ribbon-file-menu') === null).toBe(true);
            let menuItems2: MenuItemModel[] = [
                {
                    id: 'menuItem5',
                    text: 'MenuBar',
                    items: [
                        { text: 'Menu' },
                        { text: 'items' },
                        { text: 'file' }
                    ]
                }];
            ribbon.fileMenu.menuItems = menuItems2;
            ribbon.dataBind();
            expect(document.querySelectorAll('.e-menu-item').length).toBe(0);
        });
        it('menuItems dynamic property change', () => {
            let menuItems1: MenuItemModel[] = [
                {
                    text: 'File',
                    items: [
                        { text: 'Open' },
                        { text: 'Save' },
                        { text: 'Exit' }
                    ]
                },
                {
                    text: 'Edit',
                    items: [
                        { text: 'Cut' },
                        { text: 'Copy' },
                        { text: 'Paste' }
                    ]
                },
                {
                    text: 'View',
                    items: [
                        { text: 'Toolbar' },
                        { text: 'Sidebar' }
                    ]
                },
                {
                    text: 'Tools',
                    id: 'menuItem4',
                    items: [
                        { text: 'Spelling & Grammar' },
                        { text: 'Customize' },
                        { text: 'Options' }
                    ]
                }
            ];
            let menuItems2: MenuItemModel[] = [
                {
                    id: 'menuItem5',
                    text: 'MenuBar',
                    items: [
                        { text: 'Menu' },
                        { text: 'items' },
                        { text: 'file' }
                    ]
                }];
            let files: FileMenuSettingsModel = ({
                text: 'Files',
                visible: true,
                menuItems: menuItems1
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
                        }]
                    }]
                },]
            }, ribbonEle);
            expect(document.querySelectorAll('.e-menu-item').length).toBe(4);
            ribbon.fileMenu.menuItems = menuItems2;
            ribbon.dataBind();
            expect(document.querySelectorAll('.e-menu-item').length).toBe(1);
            ribbon.fileMenu.popupTemplate = "#ribbonTarget";
            ribbon.dataBind();
            expect(document.querySelectorAll('.e-menu-item').length).toBe(0);
            expect(ribbon.fileMenu.popupTemplate).toBe('#ribbonTarget');
            ribbon.fileMenu.popupTemplate = "";
            ribbon.dataBind();
            expect(document.querySelectorAll('.e-menu-item').length).toBe(1);
            //for coverage
            ribbon.fileMenu.showItemOnClick = true;
            ribbon.dataBind();
            ribbon.fileMenu.itemTemplate = "<span>${text}</span>";
            ribbon.dataBind();
        });
        it(' keyboard navigation', () => {
            let menuItems2: MenuItemModel[] = [
                {
                    id: 'menuItem5',
                    text: 'MenuBar',
                    items: [
                        { text: 'Menu' },
                        { text: 'items' },
                        { text: 'file' }
                    ]
                }];
            let files: FileMenuSettingsModel = ({
                text: 'File Menu',
                visible: true,
                menuItems:menuItems2
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
                                buttonSettings: {
                                    content: 'button1',
                                    iconCss: 'e-icons e-cut',
                                }
                            }]
                        }]
                    }]
                },]
            }, ribbonEle);
            (document.querySelector('.e-ribbon-file-menu') as HTMLElement).click();
            expect(document.getElementById('ribbon_filemenu-popup').classList.contains('e-popup-open')).toBe(true);
            expect(document.activeElement.id).toBe('ribbon_filemenulist');
            document.querySelector('#ribbon_filemenulist').dispatchEvent((new KeyboardEvent('keydown',{'key':'Tab'})));
            expect(document.getElementById('ribbon_filemenu-popup').classList.contains('e-popup-open')).toBe(false);
            expect(document.activeElement.id).toBe('ribbon_filemenu');
        });
        it('enableRtl', () => {
            let files: FileMenuSettingsModel = ({
                visible: true,
                showItemOnClick: true,
                animationSettings: { effect: 'None' },
                menuItems:[
                    {
                        text: 'Files',
                        id: 'fileMenu',
                        items: [
                            { text: 'Open' },
                            { text: 'Save' },
                            { text: 'Exit' }
                        ]
                    }
                ]
            });
            ribbon = new Ribbon({
                fileMenu: files,
                enableRtl: true,
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
                },]
            }, ribbonEle);
            expect(ribbon.element.querySelector('.e-ribbon-tab').classList.contains('e-rtl')).toBe(true);
            expect(ribbon.element.querySelector('.e-ribbon-file-menu').classList.contains('e-rtl')).toBe(true);
            ribbon.enableRtl = false;
            ribbon.dataBind();
            expect(ribbon.element.querySelector('.e-ribbon-tab').classList.contains('e-rtl')).toBe(false);
            expect(ribbon.element.querySelector('.e-ribbon-file-menu').classList.contains('e-rtl')).toBe(false);
        });
        it('file menu popup close on item click', () => {
            let commonMenuItems: MenuItemModel[] = [
                {
                    text: 'File',
                    id: 'itemMenu',
                    items: [
                        { text: 'Open' },
                        { text: 'Save' },
                        { text: 'Exit' }
                    ]
                },
                {
                    text: 'Edit',
                    id: 'itemMenu2',
                }
            ];
            let isClose: boolean = false;
            let files: FileMenuSettingsModel = ({
                text: 'Files',
                visible: true,
                menuItems: commonMenuItems,
                showItemOnClick: true,
                close: () => {
                    isClose = true;
                }
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
                        }]
                    }]
                },],

            }, ribbonEle);
            (ribbon.element.querySelector('.e-ribbon-file-menu') as HTMLButtonElement).click();
            expect(isClose).toBe(false);
            (document.querySelector('#itemMenu') as HTMLElement).click(); //click to show submenu item, the popup should not be closed.
            expect(isClose).toBe(false);
            (document.querySelector('#itemMenu2') as HTMLElement).click(); //The popup should be closed
            expect(isClose).toBe(true);            
        });
    });
});
