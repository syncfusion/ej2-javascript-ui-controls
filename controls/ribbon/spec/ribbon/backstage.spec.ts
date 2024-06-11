/* eslint-disable @typescript-eslint/no-explicit-any */

import { createElement, remove } from "@syncfusion/ej2-base";
import { ItemModel } from "@syncfusion/ej2-splitbuttons";
import { ItemOrientation, Ribbon, RibbonItemSize, RibbonItemType } from "../../src/ribbon/base/index";
import { BackStageMenuModel, BackstageItemClickArgs, BackstageItemModel, RibbonTooltipModel } from "../../src/ribbon/models/index";
import { RibbonColorPicker, RibbonBackstage } from "../../src/index";

Ribbon.Inject(RibbonColorPicker, RibbonBackstage);
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
            pending(); // skips test (in Chai)
            return;
        }
    });
    describe('Backstage menu', () => {
        let ribbon: Ribbon;
        let ribbonEle: HTMLElement;
        let contentEle: HTMLElement;
        let targetEle: HTMLElement;
        beforeEach(() => {
            ribbonEle = createElement('div', { id: 'ribbon' });
            document.body.appendChild(ribbonEle);
            contentEle = createElement('div', { id: 'ribbonTarget', innerHTML: 'Ribbon' });
            targetEle = createElement('div', { id: 'backstage_target' });
            document.body.appendChild(targetEle);
        })
        afterEach(() => {
            if (ribbon) {
                ribbon.destroy();
                ribbon = undefined;
            }
            remove(ribbonEle);
            remove(targetEle);
        });
        it('With Default values', () => {
            let menuItems: BackstageItemModel[] = [
                { text: 'Go', isFooter: true },
                {
                    text: 'File',
                    iconCss: 'e-icons e-file-new'
                },
                {
                    text: 'Edit',
                    iconCss: 'e-icons e-edit',
                },
                {
                    text: 'Home',
                    iconCss: 'e-icons e-home'
                },
                {
                    text: 'Settings',
                    iconCss: 'e-icons e-settings'
                },
                { separator: true },
                { text: 'Help', isFooter: true }
            ];
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
                }],
                backStageMenu: {
                    text: 'File',
                    visible: true,
                    items: menuItems,
                    backButton: {
                        text: 'Close',
                        iconCss: 'e-icons e-arrow-left-2'
                    }
                }
            }, ribbonEle);
            let files: BackStageMenuModel = ({
                visible: false
            });
            ribbon.dataBind();
            expect(ribbon.element.querySelector('.e-ribbon-backstage') !== null).toBe(true);
            expect(ribbon.element.querySelector('#ribbon_backstage') !== null).toBe(true);
            (ribbon.element.querySelector('#ribbon_backstage') as HTMLElement).click();
            expect(ribbon.element.querySelector('#ribbon_backstage') !== null).toBe(true);
            expect(ribbon.element.querySelector('.e-ribbon-close-btn .e-btn-icon').classList.contains('e-arrow-left-2')).toBe(true);
            (ribbon.element.querySelector('#ribbon_close') as HTMLElement).click();
            ribbon.backStageMenu = files;
            ribbon.dataBind();
            expect(ribbon.element.querySelector('.e-ribbon-backstage') !== null).toBe(false);
        });
        it('With backstage event', () => {
            let itemClick: boolean = false;
            let menuItems: BackstageItemModel[] = [
                {
                    id: 'fileItem',
                    text: 'File',
                    iconCss: 'e-icons e-file',
                    content: '#ribbonTarget',
                    backStageItemClick: () => {
                        itemClick = true;
                    }
                }
            ];
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
                }],
                backStageMenu: {
                    text: 'File',
                    visible: true,
                    items: menuItems
                }
            }, ribbonEle);
            ribbon.dataBind();
            expect(ribbon.element.querySelector('.e-ribbon-backstage') !== null).toBe(true);
            expect(ribbon.element.querySelector('#ribbon_backstage') !== null).toBe(true);
            expect(itemClick).toBe(false);
            (ribbon.element.querySelector('#fileItem') as HTMLElement).click();
            expect(ribbon.element.querySelector('#fileItem_content') !== null).toBe(true);
            expect(itemClick).toBe(true);
        });
        it('cancel event', () => {
            let menuItems: BackstageItemModel[] = [
                {
                    id: 'fileItem',
                    text: 'File',
                    iconCss: 'e-icons e-file',
                    content: '#ribbonTarget',
                    backStageItemClick: (args: BackstageItemClickArgs) => {
                        args.cancel = true;
                    }
                }
            ];
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
                }],
                backStageMenu: {
                    text: 'File',
                    visible: true,
                    items: menuItems
                }
            }, ribbonEle);
            ribbon.dataBind();
            expect(ribbon.element.querySelector('.e-ribbon-backstage') !== null).toBe(true);
            expect(ribbon.element.querySelector('#ribbon_backstage') !== null).toBe(true);
            (ribbon.element.querySelector('#ribbon_backstage') as HTMLElement).click();
            (ribbon.element.querySelector('#fileItem') as HTMLElement).click();
        });
        it('With backstage content', () => {
            let menuItems: BackstageItemModel[] = [
                {
                    id: 'fileItem',
                    text: 'File',
                    iconCss: 'e-icons e-file',
                    content: '#ribbonTarget'
                },
                {
                    id: 'editItem',
                    text: 'Edit',
                    iconCss: 'e-icons e-edit',
                    content: '#ribbonTarget'
                }
            ];
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
                }],
                backStageMenu: {
                    text: 'File',
                    visible: true,
                    items: menuItems
                }
            }, ribbonEle);
            ribbon.dataBind();
            expect(ribbon.element.querySelector('.e-ribbon-backstage') !== null).toBe(true);
            expect(ribbon.element.querySelector('#ribbon_backstage') !== null).toBe(true);
            (ribbon.element.querySelector('#ribbon_backstage') as HTMLElement).click();
            (ribbon.element.querySelector('#fileItem') as HTMLElement).click();
            expect(ribbon.element.querySelector('#fileItem_content') !== null).toBe(true);
            (ribbon.element.querySelector('#editItem') as HTMLElement).click();
            expect(ribbon.element.querySelector('#editItem_content') !== null).toBe(true);
            (ribbon.element.querySelector('.e-ribbon-collapse-btn') as HTMLElement).click();
            expect(ribbon.element.querySelector('.e-ribbon-backstage') !== null).toBe(true);
            (ribbon.element.querySelector('#ribbon_backstage') as HTMLElement).click();
            expect(document.querySelector('#ediItem.e-menu-item.e-selected') !== null).toBe(false);
        });
        it('With backstage template', () => {
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
                }],
                backStageMenu: {
                    text: 'File Menu',
                    visible: true,
                    template: '#ribbonTarget'
                }
            }, ribbonEle);
            ribbon.dataBind();
            expect(ribbon.element.querySelector('.e-ribbon-backstage') !== null).toBe(true);
            expect(ribbon.backStageMenu.template).toBe('#ribbonTarget');
        });
        it('With backstage tooltip', () => {
            let ribbonTooltip: RibbonTooltipModel = ({
                id: 'files',
                content: 'Explore files',
                title: 'Files',
                iconCss: 'e-icons e-copy',
                cssClass: 'custom-ribbon'
            });
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
                }],
                backStageMenu: {
                    text: 'File',
                    visible: true,
                    template: '#ribbonTarget',
                    ribbonTooltipSettings: ribbonTooltip
                }
            }, ribbonEle);
            ribbon.dataBind();
            expect(ribbon.element.querySelectorAll('.e-ribbon-backstage')[0].classList.contains('e-ribbon-tooltip-target')).toBe(true);
            let tooltipElement: any = ribbon.element.querySelector('.e-ribbon-backstage');
            triggerMouseEvent(tooltipElement, 'mouseover');
            expect(document.querySelector('.e-ribbon-tooltip-title').innerHTML === 'Files').toBe(true);
            expect(document.querySelector('.e-ribbon-tooltip-icon').classList.contains('e-copy')).toBe(true);
            expect(document.querySelector('.e-ribbon-tooltip').classList.contains('custom-ribbon')).toBe(true);
            expect(document.querySelector('.e-ribbon-tooltip-content').innerHTML === 'Explore files').toBe(true);
            expect(document.querySelector('#e-ribbon-tooltip-container_files') !== null).toBe(true);
            triggerMouseEvent(tooltipElement, 'mouseleave');
        });
        it('With backstage target', () => {
            const menuItems: BackstageItemModel[] = [
                {
                    id: 'fileItem',
                    text: 'File',
                    iconCss: 'e-icons e-file'
                },
                {
                    id: 'editItem',
                    text: 'Edit',
                    iconCss: 'e-icons e-edit'
                }
            ];
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
                }],
                backStageMenu: {
                    text: 'File',
                    target: targetEle,
                    visible: true,
                    items: menuItems
                }
            }, ribbonEle);
            ribbon.dataBind();
            expect(ribbon.element.querySelector('.e-ribbon-backstage') !== null).toBe(true);
            expect(ribbon.element.querySelector('#ribbon_backstage') !== null).toBe(true);
            (ribbon.element.querySelector('#ribbon_backstage') as HTMLElement).click();
            expect(targetEle.querySelector('.e-ribbon-backstage-popup') !== null).toBe(true);
            (targetEle.querySelector('#ribbon_close')as HTMLElement).click();
            ribbon.backStageMenu.target = '#backstage_target';
            ribbon.dataBind();
            (ribbon.element.querySelector('#ribbon_backstage') as HTMLElement).click();
            expect(document.querySelector('#backstage_target .e-ribbon-backstage-popup') !== null).toBe(true);
        });
        it('enableRtl', () => {
            let menuItems: BackstageItemModel[] = [
                {
                    text: 'File',
                    iconCss: 'e-icons e-file-new'
                },
                {
                    text: 'Edit',
                    iconCss: 'e-icons e-edit',
                },
                {
                    text: 'Home',
                    iconCss: 'e-icons e-home'
                },
                {
                    text: 'Settings',
                    iconCss: 'e-icons e-settings'
                },
                { separator: true },
                { text: 'Go', isFooter: true },
                { text: 'Help', isFooter: true }
            ];
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
                }],
                backStageMenu: {
                    text: 'File',
                    visible: true,
                    items: menuItems
                },
                enableRtl: true
            }, ribbonEle);
            ribbon.dataBind();
            expect(ribbon.element.querySelector('.e-ribbon-tab').classList.contains('e-rtl')).toBe(true);
            expect(ribbon.element.querySelector('.e-ribbon-backstage').classList.contains('e-rtl')).toBe(true);
            ribbon.enableRtl = false;
            ribbon.dataBind();
            expect(ribbon.element.querySelector('.e-ribbon-tab').classList.contains('e-rtl')).toBe(false);
            expect(ribbon.element.querySelector('.e-ribbon-backstage').classList.contains('e-rtl')).toBe(false);
        });
        it('With backstage methods', () => {
            let menuItems: BackstageItemModel[] = [
                {
                    text: 'File',
                    iconCss: 'e-icons e-file-new'
                },
                {
                    text: 'Edit',
                    iconCss: 'e-icons e-edit',
                },
                {
                    text: 'Home',
                    iconCss: 'e-icons e-home'
                },
                {
                    text: 'Settings',
                    iconCss: 'e-icons e-settings'
                },
                { separator: true },
                { text: 'Go', isFooter: true },
                { text: 'Help', isFooter: true }
            ];
            let menuItems1: BackstageItemModel[] = [
                {
                    id: 'menuItem1',
                    text: 'MenuBar',
                    iconCss: 'e-icons e-menu'
                }];
            let menuItems2: BackstageItemModel[] = [
                {
                    id: 'menuItem2',
                    text: 'MenuBar',
                    iconCss: 'e-icons e-menu',
                    isFooter: true
                }];
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
                }],
                backStageMenu: {
                    text: 'File',
                    visible: true,
                    items: menuItems
                }
            }, ribbonEle);
            ribbon.dataBind();
            expect(ribbon.element.querySelector('.e-ribbon-backstage') !== null).toBe(true);
            expect(ribbon.element.querySelector('#ribbon_backstage') !== null).toBe(true);
            (ribbon.element.querySelector('#ribbon_backstage') as HTMLElement).click();
            ribbon.ribbonBackstageModule.addBackstageItems(menuItems1, 'Edit', true);
            expect(ribbon.element.querySelector('#menuItem1') !== null).toBe(true);
            ribbon.ribbonBackstageModule.removeBackstageItems(['MenuBar']);
            expect(ribbon.element.querySelector('#menuItem1') !== null).toBe(false);
            ribbon.ribbonBackstageModule.addBackstageItems(menuItems2, 'Go', true);
            expect(ribbon.element.querySelector('#menuItem2') !== null).toBe(true);
            ribbon.ribbonBackstageModule.removeBackstageItems(['MenuBar']);
            expect(ribbon.element.querySelector('#menuItem2') !== null).toBe(false);
            ribbon.ribbonBackstageModule.addBackstageItems(menuItems1, 'Edit', false);
            expect(ribbon.element.querySelector('#menuItem1') !== null).toBe(true);
            ribbon.ribbonBackstageModule.removeBackstageItems(['MenuBar']);
            expect(ribbon.element.querySelector('#menuItem1') !== null).toBe(false);
            ribbon.ribbonBackstageModule.addBackstageItems(menuItems2, 'Go', false);
            expect(ribbon.element.querySelector('#menuItem2') !== null).toBe(true);
            ribbon.ribbonBackstageModule.removeBackstageItems(['MenuBar']);
            expect(ribbon.element.querySelector('#menuItem2') !== null).toBe(false);
            expect(ribbon.element.querySelector('#ribbon_backstage') !== null).toBe(true);
        });
        it(' dynamic property change', () => {
            let files: BackStageMenuModel = ({
                text: 'File Menu',
                visible: true,
                template: '#ribbonTarget'
            });
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
            expect(ribbon.element.querySelector('.e-ribbon-backstage') !== null).toBe(false);
            ribbon.backStageMenu = files;
            ribbon.dataBind();
            expect(ribbon.element.querySelector('.e-ribbon-backstage') !== null).toBe(true);
            expect((ribbon.element.querySelector('.e-ribbon-backstage') as HTMLButtonElement).innerText).toBe('File Menu');
            expect(ribbon.backStageMenu.template).toBe('#ribbonTarget');
            ribbon.backStageMenu.text = 'Files';
            ribbon.dataBind();
            expect((ribbon.element.querySelector('.e-ribbon-backstage') as HTMLButtonElement).innerText).toBe('Files');
            ribbon.backStageMenu.template = '#ribbonContent';
            ribbon.dataBind();
            expect(ribbon.backStageMenu.template).toBe('#ribbonContent');
            ribbon.backStageMenu.template = '';
            ribbon.dataBind();
            let menuItems2: BackstageItemModel[] = [
                {
                    id: 'menuItem5',
                    text: 'MenuBar'
                },
                {
                    id: 'menuItem6',
                    text: 'MenuBar',
                    isFooter: true
                }];
            ribbon.backStageMenu.items = menuItems2;
            ribbon.dataBind();
            expect(document.querySelectorAll('.e-menu-item').length).toBe(2);
            let menuItems1: BackstageItemModel[] = [
                {
                    id: 'menuItem7',
                    text: 'MenuBar'
                },
                {
                    id: 'menuItem8',
                    text: 'MenuBar',
                    isFooter: true
                }];
            ribbon.backStageMenu.items = menuItems1;
            ribbon.dataBind();
            expect(document.querySelectorAll('.e-menu-item').length).toBe(2);
            let backstage: BackStageMenuModel = ({
                height: '50%',
                width: '50%',
                target: '#ribbon'
            });
            ribbon.backStageMenu = backstage;
            ribbon.dataBind();
        });
        it('backstage keyboard actions', () => {
            const menuItems: BackstageItemModel[] = [
                {
                    id: 'fileItem',
                    text: 'File',
                    iconCss: 'e-icons e-file',
                    content: '#ribbonTarget'
                },
                {
                    id: 'editItem',
                    text: 'Edit',
                    iconCss: 'e-icons e-edit',
                    content: '#ribbonTarget'
                }
            ];
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
                }],
                backStageMenu: {
                    text: 'File',
                    visible: true,
                    items: menuItems
                }
            }, ribbonEle);
            ribbon.dataBind();
            (ribbon.element.querySelector('#ribbon_backstage') as HTMLElement).click();
            document.querySelector('.e-ribbon-backstage-popup').dispatchEvent((new KeyboardEvent('keyup', { 'code' : 'Escape' })));
            expect(document.querySelector('.e-ribbon-backstage-popup').classList.contains('e-popup-close')).toBe(true);
            (ribbon.element.querySelector('#ribbon_backstage') as HTMLElement).click();
            expect(document.querySelector('.e-ribbon-backstage-popup').classList.contains('e-popup-open')).toBe(true);
            document.querySelector('.e-ribbon-backstage-popup').dispatchEvent((new KeyboardEvent('keyup', { 'key' : 'ArrowDown' })));
            document.querySelector('#editItem').classList.contains('e-focused');
            document.querySelector('.e-ribbon-backstage-popup').dispatchEvent((new KeyboardEvent('keyup', { 'key' : 'ArrowUp' })));
            document.querySelector('#fileItem').classList.contains('e-focused');
            document.querySelector('.e-ribbon-backstage-popup').dispatchEvent((new KeyboardEvent('keyup', { 'key' : 'ArrowUp' })));
            document.querySelector('.e-ribbon-backstage-popup').dispatchEvent((new KeyboardEvent('keyup', { 'key' : 'ArrowUp' })));
            document.querySelector('#editItem').classList.contains('e-focused');
            document.querySelector('.e-ribbon-backstage-popup').dispatchEvent((new KeyboardEvent('keyup', { 'key' : 'ArrowDown' })));
            document.querySelector('.e-ribbon-backstage-popup').dispatchEvent((new KeyboardEvent('keyup', { 'key' : 'ArrowDown' })));
            document.querySelector('#fileItem').classList.contains('e-focused');
        });
    });
});
