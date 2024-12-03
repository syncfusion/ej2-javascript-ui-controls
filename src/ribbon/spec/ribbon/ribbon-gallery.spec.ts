/* eslint-disable @typescript-eslint/no-explicit-any */

import { createElement, getComponent, remove } from "@syncfusion/ej2-base";
import { ItemModel } from "@syncfusion/ej2-splitbuttons";
import { Ribbon, RibbonItemSize, RibbonItemType, ItemOrientation, GalleryBeforeSelectEventArgs, GalleryPopupEventArgs, GallerySelectEventArgs } from "../../src/ribbon/base/index";
import { RibbonContextualTabSettingsModel, RibbonItemModel } from "../../src/ribbon/models/index";
import { RibbonColorPicker, RibbonFileMenu, RibbonContextualTab, DisplayMode } from "../../src/index";
import { RibbonGallery } from "../../src/ribbon/items/ribbon-gallery";
import { Popup } from "@syncfusion/ej2-popups";

Ribbon.Inject(RibbonColorPicker, RibbonFileMenu, RibbonContextualTab, RibbonGallery);
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
    describe('Ribbon gallery', () => {
        let ribbon: Ribbon;
        let ribbonEle: HTMLElement;
        let containerEle: HTMLElement;
        let keyboardEventArgs: any;
        beforeEach(() => {
            ribbonEle = createElement('div', { id: 'ribbon' });
            containerEle = createElement('div', { id: 'container', styles: 'width:600px' });
            containerEle.appendChild(ribbonEle);
            document.body.appendChild(containerEle);
            keyboardEventArgs = {
                preventDefault: (): void => { },
                action: null,
                target: null,
                stopImmediatePropagation: (): void => { },
            };
        })
        afterEach(() => {
            if (ribbon) {
                ribbon.destroy();
                ribbon = undefined;
            }
            remove(ribbonEle);
            remove(containerEle);
        });
        it('initial rendering', () => {
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
                                type: RibbonItemType.Gallery,
                                gallerySettings: {
                                    groups: [{
                                        header: 'Group 1',
                                        items: [{
                                            content: 'Cut',
                                            iconCss: 'e-icons e-cut'
                                        },{
                                            content: 'Copy',
                                            iconCss: 'e-icons e-copy'
                                        },{
                                            content: 'Paste',
                                            iconCss: 'e-icons e-paste'
                                        },{
                                            content: 'Format Painter',
                                            iconCss: 'e-icons e-format-painter'
                                        }]
                                    },{
                                        header: 'Group 2',
                                        items: [{
                                            content: 'Cut',
                                            iconCss: 'e-icons e-cut'
                                        },{
                                            content: 'Copy',
                                            iconCss: 'e-icons e-copy'
                                        },{
                                            content: 'Paste',
                                            iconCss: 'e-icons e-paste'
                                        },{
                                            content: 'Format Painter',
                                            iconCss: 'e-icons e-format-painter'
                                        }]
                                    }]
                                }
                            }]
                        }]
                    }, {
                        id: "group2",
                        header: "group2Header",
                        collections: [{
                            id: "collection2",
                            items: [{
                                id: "item2",
                                type: RibbonItemType.Button,
                                buttonSettings: {
                                    iconCss: 'e-print e-icons',
                                    content: 'Read Mode'
                                }
                            }]
                        }]
                    }]
                }]
            }, ribbonEle);
            expect(ribbon.element.querySelector('#item1_container').querySelectorAll('.e-ribbon-gallery-item').length).toBe(3);
            expect(ribbon.element.querySelector('#item1_container').querySelectorAll('.e-ribbon-gallery-item')[0].classList.contains('e-ribbon-gallery-selected')).toBe(true);
            (ribbon.element.querySelector('#item1_container').querySelector('#item1_popupButton') as HTMLElement).click();
            expect(document.querySelector('#item1_galleryPopup').classList.contains('e-popup-open')).toBe(true);
            expect(document.querySelector('#item1_popupContainer').querySelectorAll('.e-ribbon-gallery-item').length).toBe(8);
            expect(document.querySelector('#item1_popupContainer').querySelectorAll('.e-ribbon-gallery-header').length).toBe(2);
            (document.querySelector('#item2') as HTMLElement).click();
            expect(document.querySelector('#item1_galleryPopup').classList.contains('e-popup-open')).toBe(false);
            (ribbon.element.querySelector('#item1_container').querySelectorAll('.e-ribbon-gallery-item')[1] as HTMLElement).click();
            expect(ribbon.element.querySelector('#item1_container').querySelectorAll('.e-ribbon-gallery-item')[0].classList.contains('e-ribbon-gallery-selected')).toBe(false);
            expect(ribbon.element.querySelector('#item1_container').querySelectorAll('.e-ribbon-gallery-item')[1].classList.contains('e-ribbon-gallery-selected')).toBe(true);
            expect(document.querySelector('#item1_popupContainer').querySelectorAll('.e-ribbon-gallery-item')[1].classList.contains('e-ribbon-gallery-selected')).toBe(true);
            (ribbon.element.querySelector('#item1_container').querySelector('#item1_popupButton') as HTMLElement).click();
            expect(document.querySelector('#item1_popupContainer').querySelectorAll('.e-ribbon-gallery-item')[1].classList.contains('e-ribbon-gallery-selected')).toBe(true);
            (ribbon.element.querySelector('#item1_container').querySelector('#item1_popupButton') as HTMLElement).click();
        });
        it('cssClass, disabled, selectedItemIndex properties', () => {
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
                                type: RibbonItemType.Gallery,
                                gallerySettings: {
                                    itemCount: 4,
                                    selectedItemIndex: 3,
                                    groups: [{
                                        header: 'Group 1',
                                        cssClass: 'e-custom-gallery-group',
                                        itemWidth: '80',
                                        itemHeight: '40',
                                        items: [{
                                            content: 'Cut',
                                            cssClass: 'e-custom-gallery-item',
                                            iconCss: 'e-icons e-cut'
                                        },{
                                            content: 'Copy',
                                            iconCss: 'e-icons e-copy',
                                            disabled: true
                                        },{
                                            content: 'Paste',
                                            iconCss: 'e-icons e-paste'
                                        },{
                                            content: 'Format Painter',
                                            iconCss: 'e-icons e-format-painter'
                                        }]
                                    },{
                                        header: 'Group 2',
                                        itemWidth: '80',
                                        itemHeight: '40',
                                        items: [{
                                            content: 'Cut',
                                            iconCss: 'e-icons e-cut'
                                        },{
                                            content: 'Copy',
                                            iconCss: 'e-icons e-copy'
                                        },{
                                            content: 'Paste',
                                            iconCss: 'e-icons e-paste'
                                        },{
                                            content: 'Format Painter',
                                            iconCss: 'e-icons e-format-painter'
                                        }]
                                    }]
                                }
                            }]
                        }]
                    }, {
                        id: "group2",
                        header: "group2Header",
                        collections: [{
                            id: "collection2",
                            items: [{
                                id: "item2",
                                type: RibbonItemType.Button,
                                buttonSettings: {
                                    iconCss: 'e-print e-icons',
                                    content: 'Read Mode'
                                }
                            }]
                        }]
                    }]
                }]
            }, ribbonEle);
            expect(ribbon.element.querySelector('#item1_container').querySelectorAll('.e-ribbon-gallery-item').length).toBe(8);
            expect(ribbon.element.querySelector('#item1_container').querySelectorAll('.e-ribbon-gallery-item')[3].classList.contains('e-ribbon-gallery-selected')).toBe(true);
            expect(ribbon.element.querySelector('#item1_container').querySelectorAll('.e-ribbon-gallery-item')[1].classList.contains('e-disabled')).toBe(true);
            expect(ribbon.element.querySelector('#item1_container').querySelector('#item1_galleryContainer0').classList.contains('e-custom-gallery-group')).toBe(true);
            expect(ribbon.element.querySelector('#item1_container').querySelectorAll('.e-ribbon-gallery-item')[0].classList.contains('e-custom-gallery-item')).toBe(true);
        });
        it('switch modes', () => {
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
                                type: RibbonItemType.Gallery,
                                gallerySettings: {
                                    groups: [{
                                        header: 'Group 1',
                                        items: [{
                                            content: 'Cut',
                                            iconCss: 'e-icons e-cut'
                                        },{
                                            content: 'Copy',
                                            iconCss: 'e-icons e-copy'
                                        },{
                                            content: 'Paste',
                                            iconCss: 'e-icons e-paste'
                                        },{
                                            content: 'Format Painter',
                                            iconCss: 'e-icons e-format-painter'
                                        }]
                                    },{
                                        header: 'Group 2',
                                        items: [{
                                            content: 'Cut',
                                            iconCss: 'e-icons e-cut'
                                        },{
                                            content: 'Copy',
                                            iconCss: 'e-icons e-copy'
                                        },{
                                            content: 'Paste',
                                            iconCss: 'e-icons e-paste'
                                        },{
                                            content: 'Format Painter',
                                            iconCss: 'e-icons e-format-painter'
                                        }]
                                    }]
                                }
                            }]
                        }]
                    }, {
                        id: "group2",
                        header: "group2Header",
                        collections: [{
                            id: "collection2",
                            items: [{
                                id: "item2",
                                type: RibbonItemType.Button,
                                buttonSettings: {
                                    iconCss: 'e-print e-icons',
                                    content: 'Read Mode'
                                }
                            }]
                        }]
                    }]
                }]
            }, ribbonEle);
            expect(ribbon.element.querySelector('#item1_container').querySelector('.e-ribbon-gallery-icons').classList.contains('e-hidden')).toBe(false);
            ribbon.activeLayout = 'Simplified';
            ribbon.dataBind();
            expect(ribbon.element.querySelector('#item1_container').querySelector('.e-ribbon-gallery-icons').classList.contains('e-hidden')).toBe(true);
            ribbon.activeLayout = 'Classic';
            ribbon.dataBind();
            expect(ribbon.element.querySelector('#item1_container').querySelector('.e-ribbon-gallery-icons').classList.contains('e-hidden')).toBe(false);
        });
        it('aria-label attribute', () => {
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
                                type: RibbonItemType.Gallery,
                                gallerySettings: {
                                    groups: [{
                                        header: 'Group 1',
                                        items: [{
                                            content: 'Cut',
                                            iconCss: 'e-icons e-cut'
                                        },{
                                            content: 'Copy',
                                            iconCss: 'e-icons e-copy'
                                        },{
                                            content: 'Paste',
                                            iconCss: 'e-icons e-paste'
                                        },{
                                            content: 'Format Painter',
                                            iconCss: 'e-icons e-format-painter'
                                        }]
                                    },{
                                        header: 'Group 2',
                                        items: [{
                                            content: 'Cut',
                                            iconCss: 'e-icons e-cut'
                                        },{
                                            content: 'Copy',
                                            iconCss: 'e-icons e-copy'
                                        },{
                                            content: 'Paste',
                                            iconCss: 'e-icons e-paste'
                                        },{
                                            content: 'Format Painter',
                                            iconCss: 'e-icons e-format-painter'
                                        }]
                                    }]
                                }
                            }]
                        }]
                    }, {
                        id: "group2",
                        header: "group2Header",
                        collections: [{
                            id: "collection2",
                            items: [{
                                id: "item2",
                                type: RibbonItemType.Button,
                                buttonSettings: {
                                    iconCss: 'e-print e-icons',
                                    content: 'Read Mode'
                                }
                            }]
                        }]
                    }]
                }]
            }, ribbonEle);
            expect(ribbon.element.querySelector('.e-ribbon-gallery-button').hasAttribute('aria-label')).toBe(true);
            expect(ribbon.element.querySelector('.e-ribbon-gallery-button').getAttribute('aria-label')).toBe('gallerydropdownbutton');
        });
        it('in simplified mode', () => {
            ribbon = new Ribbon({
                activeLayout: 'Simplified',
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
                                type: RibbonItemType.Gallery,
                                gallerySettings: {
                                    groups: [{
                                        header: 'Group 1',
                                        items: [{
                                            content: 'Cut',
                                            iconCss: 'e-icons e-cut'
                                        },{
                                            content: 'Copy',
                                            iconCss: 'e-icons e-copy'
                                        },{
                                            content: 'Paste',
                                            iconCss: 'e-icons e-paste'
                                        },{
                                            content: 'Format Painter',
                                            iconCss: 'e-icons e-format-painter'
                                        }]
                                    },{
                                        header: 'Group 2',
                                        items: [{
                                            content: 'Cut',
                                            iconCss: 'e-icons e-cut'
                                        },{
                                            content: 'Copy',
                                            iconCss: 'e-icons e-copy'
                                        },{
                                            content: 'Paste',
                                            iconCss: 'e-icons e-paste'
                                        },{
                                            content: 'Format Painter',
                                            iconCss: 'e-icons e-format-painter'
                                        }]
                                    }]
                                }
                            }]
                        }]
                    }, {
                        id: "group2",
                        header: "group2Header",
                        collections: [{
                            id: "collection2",
                            items: [{
                                id: "item2",
                                type: RibbonItemType.Button,
                                buttonSettings: {
                                    iconCss: 'e-print e-icons',
                                    content: 'Read Mode'
                                }
                            }]
                        }]
                    }]
                }]
            }, ribbonEle);
            expect(ribbon.element.querySelector('#item1_container').querySelectorAll('.e-ribbon-gallery-item').length).toBe(3);
            expect(ribbon.element.querySelector('#item1_container').querySelector('.e-ribbon-gallery-icons').classList.contains('e-hidden')).toBe(true);
            expect(ribbon.element.querySelector('#item1_container').querySelectorAll('.e-ribbon-gallery-item')[0].classList.contains('e-ribbon-gallery-selected')).toBe(true);
            (ribbon.element.querySelector('#item1_container').querySelector('#item1_popupButton') as HTMLElement).click();
            expect(document.querySelector('#item1_galleryPopup').classList.contains('e-popup-open')).toBe(true);
            expect(document.querySelector('#item1_popupContainer').querySelector('.e-ribbon-gallery-item').classList.contains('e-hidden')).toBe(false);
            expect(document.querySelector('#item1_popupContainer').querySelectorAll('.e-ribbon-gallery-header').length).toBe(2);
            (document.querySelector('#item2') as HTMLElement).click();
            expect(document.querySelector('#item1_galleryPopup').classList.contains('e-popup-open')).toBe(false);
            (ribbon.element.querySelector('#item1_container').querySelectorAll('.e-ribbon-gallery-item')[1] as HTMLElement).click();
            expect(ribbon.element.querySelector('#item1_container').querySelectorAll('.e-ribbon-gallery-item')[0].classList.contains('e-ribbon-gallery-selected')).toBe(false);
            expect(ribbon.element.querySelector('#item1_container').querySelectorAll('.e-ribbon-gallery-item')[1].classList.contains('e-ribbon-gallery-selected')).toBe(true);
            expect(document.querySelector('#item1_popupContainer').querySelectorAll('.e-ribbon-gallery-item')[1].classList.contains('e-ribbon-gallery-selected')).toBe(true);
        });
        it('in overflow popup', () => {
            ribbon = new Ribbon({
                activeLayout: 'Simplified',
                tabs: [{
                    id: "tabGallery",
                    header: "tabGallery",
                    groups: [{
                        id: "group2Button",
                        header: "group2ButtonHeader",
                        collections: [{
                            id: "collection2Button",
                            items: [{
                                id: "item2Button",
                                type: RibbonItemType.Button,
                                buttonSettings: {
                                    iconCss: 'e-print e-icons',
                                    content: 'Read Mode'
                                }
                            }]
                        }]
                    },{
                        id: "group3",
                        header: "group3",
                        collections: [{
                            id: "collection3",
                            items: [{
                                id: "item3",
                                type: RibbonItemType.Button,
                                buttonSettings: {
                                    iconCss: 'e-print e-icons',
                                    content: 'Read Mode'
                                }
                            }]
                        }]
                    },{
                        id: "group4",
                        header: "group4",
                        collections: [{
                            id: "collection4",
                            items: [{
                                id: "item4",
                                type: RibbonItemType.Button,
                                buttonSettings: {
                                    iconCss: 'e-print e-icons',
                                    content: 'Read Mode'
                                }
                            }]
                        }]
                    }, {
                        header: 'Large items',
                        groupIconCss: 'e-icons e-paste',
                        showLauncherIcon: true,
                        orientation: ItemOrientation.Row,
                        id: 'large',
                        collections: [{
                            items: [{
                                type: RibbonItemType.SplitButton,
                                allowedSizes: RibbonItemSize.Large ,
                                splitButtonSettings: {
                                    content: 'Paste',
                                    cssClass: 'test-css',
                                    iconCss: 'e-icons e-paste',
                                    items: [{ text: 'Keep Source Format' }, { text: 'Merge format' }, { text: 'Keep text only' }]
                                }
                            }, {
                                type: RibbonItemType.DropDown,
                                allowedSizes: RibbonItemSize.Large ,
                                id: 'largetable',
                                dropDownSettings: {
                                    content: 'Table',
                                    iconCss: 'e-icons e-table',
                                    cssClass: 'test-css',
                                    items: [
                                        { text: 'Insert Table' }, { text: 'Draw Table' },
                                        { text: 'Convert Table' }, { text: 'Excel SpreadSheet' }
                                    ]
                                }
                            }, {
                                type: RibbonItemType.Button,
                                id: 'largecut',
                                allowedSizes: RibbonItemSize.Large ,
                                cssClass: 'test-css',
                                buttonSettings: {
                                    content: 'cut',
                                    iconCss: 'e-icons e-cut',
                                }
                            }]
                        }]
                    }, {
                        header: 'Font',
                        orientation: 'Row',
                        groupIconCss: 'e-icons e-bold',
                        cssClass: 'font-group',
                        id: 'font',
                        collections: [{
                            items: [{
                                type: RibbonItemType.CheckBox,
                                id: 'fontbold',
                                checkBoxSettings: {
                                    cssClass: 'test-css',
                                    label: 'Ruler',
                                    checked: false
                                }
                            }, {
                                type: RibbonItemType.ColorPicker,
                                id: 'fontcolor',
                                colorPickerSettings: {
                                    cssClass: 'test-css',
                                    value: '#123456'
                                }
                            } ]
                        }]
                    }, {
                        header: 'GroupOverflow btn',
                        groupIconCss: 'e-icons e-paste',
                        showLauncherIcon: true,
                        orientation: ItemOrientation.Row,
                        enableGroupOverflow: true,
                        id: 'groupoverflow1',
                        collections: [{
                            items: [{
                                type: RibbonItemType.SplitButton,
                                id: 'groupoverflowpaste',
                                allowedSizes: RibbonItemSize.Large ,
                                splitButtonSettings: {
                                    content: 'Paste',
                                    iconCss: 'e-icons e-paste',
                                    items: [{ text: 'Keep Source Format' }, { text: 'Merge format' }, { text: 'Keep text only' }],
                                }
                            }, {
                                type: RibbonItemType.DropDown,
                                displayOptions: DisplayMode.Overflow,
                                id: 'groupoverflowtable',
                                allowedSizes: RibbonItemSize.Large ,
                                dropDownSettings: {
                                    content: 'Table',
                                    iconCss: 'e-icons e-table',
                                    items: [
                                        { text: 'Insert Table' }, { text: 'Draw Table' },
                                        { text: 'Convert Table' }, { text: 'Excel SpreadSheet' }
                                    ]
                                }
                            }, {
                                type: RibbonItemType.Button,
                                id: 'groupoverflowcut',
                                allowedSizes: RibbonItemSize.Large ,
                                buttonSettings: {
                                    content: 'cut',
                                    iconCss: 'e-icons e-cut'
                                }
                            }]
                        }]
                    }, {
                        header: 'CmnOverflow btn',
                        groupIconCss: 'e-icons e-paste',
                        id: 'CmnOverflow1',
                        showLauncherIcon: true,
                        orientation: ItemOrientation.Row,
                        collections: [{
                            items: [{
                                type: RibbonItemType.SplitButton,
                                id: 'commonoverflowpaste',
                                allowedSizes: RibbonItemSize.Large ,
                                splitButtonSettings: {
                                    content: 'Paste',
                                    iconCss: 'e-icons e-paste',
                                    items: [{ text: 'Keep Source Format' }, { text: 'Merge format' }, { text: 'Keep text only' }],
                                }
                            }, {
                                type: RibbonItemType.DropDown,
                                displayOptions: DisplayMode.Overflow,
                                id: 'commonoverflowtable',
                                allowedSizes: RibbonItemSize.Large ,
                                dropDownSettings: {
                                    content: 'Table',
                                    iconCss: 'e-icons e-table',
                                    items: [
                                        { text: 'Insert Table' }, { text: 'Draw Table' },
                                        { text: 'Convert Table' }, { text: 'Excel SpreadSheet' }
                                    ]
                                }
                            }, {
                                type: RibbonItemType.Button,
                                id: 'commonoverflowcut',
                                allowedSizes: RibbonItemSize.Large ,
                                buttonSettings: {
                                    content: 'cut',
                                    iconCss: 'e-icons e-cut'
                                }
                            }]
                        }]
                    }, {
                        id: "groupGallery",
                        header: "Gallery",
                        orientation: 'Row',
                        collections: [{
                            id: "collectionGallery",
                            items: [{
                                id: "itemGallery",
                                type: RibbonItemType.Gallery,
                                gallerySettings: {
                                    groups: [{
                                        header: 'Group 1',
                                        items: [{
                                            content: 'Cut',
                                            iconCss: 'e-icons e-cut'
                                        },{
                                            content: 'Copy',
                                            iconCss: 'e-icons e-copy'
                                        },{
                                            content: 'Paste',
                                            iconCss: 'e-icons e-paste'
                                        },{
                                            content: 'Format Painter',
                                            iconCss: 'e-icons e-format-painter'
                                        }]
                                    },{
                                        header: 'Group 2',
                                        items: [{
                                            content: 'Cut',
                                            iconCss: 'e-icons e-cut'
                                        },{
                                            content: 'Copy',
                                            iconCss: 'e-icons e-copy'
                                        },{
                                            content: 'Paste',
                                            iconCss: 'e-icons e-paste'
                                        },{
                                            content: 'Format Painter',
                                            iconCss: 'e-icons e-format-painter'
                                        }]
                                    }]
                                }
                            }]
                        }]
                    }]
                }]
            }, ribbonEle);
            containerEle.style.width = '300px';
            ribbon.refreshLayout();
            (ribbon.element.querySelector('#ribbon_tab_sim_ovrl_overflow') as HTMLElement).click();
            expect(document.querySelector('.e-ribbon-gallery-dropdown') !== null).toBe(true);
            (document.querySelector('.e-ribbon-gallery-dropdown') as HTMLElement).click();
            expect(document.querySelector('#itemGallery_popupContainer').querySelectorAll('.e-ribbon-gallery-item').length).toBe(8);
            expect(document.querySelector('#itemGallery_popupContainer').querySelectorAll('.e-ribbon-gallery-item')[0].classList.contains('e-ribbon-gallery-selected')).toBe(true);
            containerEle.style.width = '1400px';
            ribbon.refreshLayout();
            expect(document.querySelector('#itemGallery_container').querySelectorAll('.e-ribbon-gallery-item').length).toBe(3);
        });
        it('events', () => {
            let popupOpen: boolean = false;
            let popupClose: boolean = false;
            let onSelected: boolean = false;
            let onSelecting: boolean = false;
            let itemHover: boolean = false;
            let beforeRender: boolean = false;
            ribbon = new Ribbon({
                tabs: [{
                    id: "tabGallery",
                    header: "tabGallery",
                    groups: [{
                        id: "groupGallery",
                        header: "Gallery",
                        orientation: 'Row',
                        collections: [{
                            id: "collectionGallery",
                            items: [{
                                id: "itemGallery",
                                type: RibbonItemType.Gallery,
                                gallerySettings: {
                                    beforeItemRender: () => {
                                        beforeRender = true;
                                    },
                                    popupOpen: () => {
                                        popupOpen = true;
                                    },
                                    popupClose: () => {
                                        popupClose = true;
                                    },
                                    itemHover: () => {
                                        itemHover = true;
                                    },
                                    select: () => {
                                        onSelected = true;
                                    },
                                    beforeSelect: () => {
                                        onSelecting = true;
                                    },
                                    groups: [{
                                        header: 'Group 1',
                                        items: [{
                                            content: 'Cut',
                                            iconCss: 'e-icons e-cut'
                                        },{
                                            content: 'Copy',
                                            iconCss: 'e-icons e-copy'
                                        },{
                                            content: 'Paste',
                                            iconCss: 'e-icons e-paste'
                                        },{
                                            content: 'Format Painter',
                                            iconCss: 'e-icons e-format-painter'
                                        }]
                                    },{
                                        header: 'Group 2',
                                        items: [{
                                            content: 'Cut',
                                            iconCss: 'e-icons e-cut'
                                        },{
                                            content: 'Copy',
                                            iconCss: 'e-icons e-copy'
                                        },{
                                            content: 'Paste',
                                            iconCss: 'e-icons e-paste'
                                        },{
                                            content: 'Format Painter',
                                            iconCss: 'e-icons e-format-painter'
                                        }]
                                    }]
                                }
                            }]
                        }]
                    }]
                }]
            }, ribbonEle);
            expect(beforeRender).toBe(true);
            expect(popupOpen).toBe(false);
            expect(popupClose).toBe(false);
            expect(onSelected).toBe(false);
            expect(onSelecting).toBe(false);
            expect(itemHover).toBe(false);
            (ribbon.element.querySelector('#itemGallery_container').querySelector('#itemGallery_popupButton') as HTMLElement).click();
            expect(popupOpen).toBe(true);
            (ribbon.element.querySelector('#itemGallery_container').querySelectorAll('.e-ribbon-gallery-item')[1] as HTMLElement).click();
            expect(onSelected).toBe(true);
            expect(onSelecting).toBe(true);
            expect(itemHover).toBe(false);
            expect(popupClose).toBe(true);
            let hoverElement: HTMLElement = ribbon.element.querySelector('#itemGallery_container').querySelectorAll('.e-ribbon-gallery-item')[1] as HTMLElement;
            triggerMouseEvent(hoverElement, 'mouseover');
            expect(itemHover).toBe(true);
        });
        it('events when cancelled', () => {
            ribbon = new Ribbon({
                tabs: [{
                    id: "tabGallery",
                    header: "tabGallery",
                    groups: [{
                        id: "groupGallery",
                        header: "Gallery",
                        orientation: 'Row',
                        collections: [{
                            id: "collectionGallery",
                            items: [{
                                id: "itemGallery",
                                type: RibbonItemType.Gallery,
                                gallerySettings: {
                                    popupOpen: (args: GalleryPopupEventArgs) => {
                                        args.cancel = true;
                                    },
                                    popupClose: (args: GalleryPopupEventArgs) => {
                                        args.cancel = true;
                                    },
                                    beforeSelect: (args: GalleryBeforeSelectEventArgs) => {
                                        args.cancel = true;
                                    },
                                    groups: [{
                                        header: 'Group 1',
                                        items: [{
                                            content: 'Cut',
                                            iconCss: 'e-icons e-cut'
                                        },{
                                            content: 'Copy',
                                            iconCss: 'e-icons e-copy'
                                        },{
                                            content: 'Paste',
                                            iconCss: 'e-icons e-paste'
                                        },{
                                            content: 'Format Painter',
                                            iconCss: 'e-icons e-format-painter'
                                        }]
                                    },{
                                        header: 'Group 2',
                                        items: [{
                                            content: 'Cut',
                                            iconCss: 'e-icons e-cut'
                                        },{
                                            content: 'Copy',
                                            iconCss: 'e-icons e-copy'
                                        },{
                                            content: 'Paste',
                                            iconCss: 'e-icons e-paste'
                                        },{
                                            content: 'Format Painter',
                                            iconCss: 'e-icons e-format-painter'
                                        }]
                                    }]
                                }
                            }]
                        }]
                    }]
                }]
            }, ribbonEle);
            (ribbon.element.querySelector('#itemGallery_container').querySelector('#itemGallery_popupButton') as HTMLElement).click();
            expect(document.querySelector('#itemGallery_galleryPopup').classList.contains('e-popup-open')).toBe(false);
            (ribbon.element.querySelector('#itemGallery_container').querySelectorAll('.e-ribbon-gallery-item')[1] as HTMLElement).click();
            expect(ribbon.element.querySelector('#itemGallery_container').querySelectorAll('.e-ribbon-gallery-item')[0].classList.contains('e-ribbon-gallery-selected')).toBe(true);
            expect(ribbon.element.querySelector('#itemGallery_container').querySelectorAll('.e-ribbon-gallery-item')[1].classList.contains('e-ribbon-gallery-selected')).toBe(false);
            ribbon.tabs[0].groups[0].collections[0].items[0].gallerySettings.popupOpen = (args: GalleryPopupEventArgs) => {
                args.cancel = false;
            };
            ribbon.dataBind();
            (ribbon.element.querySelector('#itemGallery_container').querySelector('#itemGallery_popupButton') as HTMLElement).click();
            expect(document.querySelector('#itemGallery_galleryPopup').classList.contains('e-popup-open')).toBe(true);
            (ribbon.element.querySelector('#itemGallery_container').querySelector('#itemGallery_popupButton') as HTMLElement).click();
            expect(document.querySelector('#itemGallery_galleryPopup').classList.contains('e-popup-open')).toBe(true);
            ribbon.tabs[0].groups[0].collections[0].items[0].gallerySettings.popupClose = (args: GalleryPopupEventArgs) => {
                args.cancel = false;
            };
            ribbon.dataBind();
            (ribbon.element.querySelector('#itemGallery_container').querySelector('#itemGallery_popupButton') as HTMLElement).click();
            expect(document.querySelector('#itemGallery_galleryPopup').classList.contains('e-popup-open')).toBe(false);
        });
        it('events when cancelled in overflow popup', () => {
            ribbon = new Ribbon({
                activeLayout: 'Simplified',
                tabs: [{
                    id: "tabGallery",
                    header: "tabGallery",
                    groups: [{
                        id: "group2Button",
                        header: "group2ButtonHeader",
                        collections: [{
                            id: "collection2Button",
                            items: [{
                                id: "item2Button",
                                type: RibbonItemType.Button,
                                buttonSettings: {
                                    iconCss: 'e-print e-icons',
                                    content: 'Read Mode'
                                }
                            }]
                        }]
                    },{
                        id: "group3",
                        header: "group3",
                        collections: [{
                            id: "collection3",
                            items: [{
                                id: "item3",
                                type: RibbonItemType.Button,
                                buttonSettings: {
                                    iconCss: 'e-print e-icons',
                                    content: 'Read Mode'
                                }
                            }]
                        }]
                    },{
                        id: "group4",
                        header: "group4",
                        collections: [{
                            id: "collection4",
                            items: [{
                                id: "item4",
                                type: RibbonItemType.Button,
                                buttonSettings: {
                                    iconCss: 'e-print e-icons',
                                    content: 'Read Mode'
                                }
                            }]
                        }]
                    },{
                        header: 'Large items',
                        groupIconCss: 'e-icons e-paste',
                        showLauncherIcon: true,
                        orientation: ItemOrientation.Row,
                        id: 'large',
                        collections: [{
                            items: [{
                                type: RibbonItemType.SplitButton,
                                allowedSizes: RibbonItemSize.Large ,
                                splitButtonSettings: {
                                    content: 'Paste',
                                    cssClass: 'test-css',
                                    iconCss: 'e-icons e-paste',
                                    items: [{ text: 'Keep Source Format' }, { text: 'Merge format' }, { text: 'Keep text only' }]
                                }
                            }, {
                                type: RibbonItemType.DropDown,
                                allowedSizes: RibbonItemSize.Large ,
                                id: 'largetable',
                                dropDownSettings: {
                                    content: 'Table',
                                    iconCss: 'e-icons e-table',
                                    cssClass: 'test-css',
                                    items: [
                                        { text: 'Insert Table' }, { text: 'Draw Table' },
                                        { text: 'Convert Table' }, { text: 'Excel SpreadSheet' }
                                    ]
                                }
                            }, {
                                type: RibbonItemType.Button,
                                id: 'largecut',
                                allowedSizes: RibbonItemSize.Large ,
                                cssClass: 'test-css',
                                buttonSettings: {
                                    content: 'cut',
                                    iconCss: 'e-icons e-cut',
                                }
                            }]
                        }]
                    }, {
                        header: 'Font',
                        orientation: 'Row',
                        groupIconCss: 'e-icons e-bold',
                        cssClass: 'font-group',
                        id: 'font',
                        collections: [{
                            items: [{
                                type: RibbonItemType.CheckBox,
                                id: 'fontbold',
                                checkBoxSettings: {
                                    cssClass: 'test-css',
                                    label: 'Ruler',
                                    checked: false
                                }
                            }, {
                                type: RibbonItemType.ColorPicker,
                                id: 'fontcolor',
                                colorPickerSettings: {
                                    cssClass: 'test-css',
                                    value: '#123456'
                                }
                            } ]
                        }]
                    }, {
                        header: 'GroupOverflow btn',
                        groupIconCss: 'e-icons e-paste',
                        showLauncherIcon: true,
                        orientation: ItemOrientation.Row,
                        enableGroupOverflow: true,
                        id: 'groupoverflow1',
                        collections: [{
                            items: [{
                                type: RibbonItemType.SplitButton,
                                id: 'groupoverflowpaste',
                                allowedSizes: RibbonItemSize.Large ,
                                splitButtonSettings: {
                                    content: 'Paste',
                                    iconCss: 'e-icons e-paste',
                                    items: [{ text: 'Keep Source Format' }, { text: 'Merge format' }, { text: 'Keep text only' }],
                                }
                            }, {
                                type: RibbonItemType.DropDown,
                                displayOptions: DisplayMode.Overflow,
                                id: 'groupoverflowtable',
                                allowedSizes: RibbonItemSize.Large ,
                                dropDownSettings: {
                                    content: 'Table',
                                    iconCss: 'e-icons e-table',
                                    items: [
                                        { text: 'Insert Table' }, { text: 'Draw Table' },
                                        { text: 'Convert Table' }, { text: 'Excel SpreadSheet' }
                                    ]
                                }
                            }, {
                                type: RibbonItemType.Button,
                                id: 'groupoverflowcut',
                                allowedSizes: RibbonItemSize.Large ,
                                buttonSettings: {
                                    content: 'cut',
                                    iconCss: 'e-icons e-cut'
                                }
                            }]
                        }]
                    }, {
                        header: 'CmnOverflow btn',
                        groupIconCss: 'e-icons e-paste',
                        id: 'CmnOverflow1',
                        showLauncherIcon: true,
                        orientation: ItemOrientation.Row,
                        collections: [{
                            items: [{
                                type: RibbonItemType.SplitButton,
                                id: 'commonoverflowpaste',
                                allowedSizes: RibbonItemSize.Large ,
                                splitButtonSettings: {
                                    content: 'Paste',
                                    iconCss: 'e-icons e-paste',
                                    items: [{ text: 'Keep Source Format' }, { text: 'Merge format' }, { text: 'Keep text only' }],
                                }
                            }, {
                                type: RibbonItemType.DropDown,
                                displayOptions: DisplayMode.Overflow,
                                id: 'commonoverflowtable',
                                allowedSizes: RibbonItemSize.Large ,
                                dropDownSettings: {
                                    content: 'Table',
                                    iconCss: 'e-icons e-table',
                                    items: [
                                        { text: 'Insert Table' }, { text: 'Draw Table' },
                                        { text: 'Convert Table' }, { text: 'Excel SpreadSheet' }
                                    ]
                                }
                            }, {
                                type: RibbonItemType.Button,
                                id: 'commonoverflowcut',
                                allowedSizes: RibbonItemSize.Large ,
                                buttonSettings: {
                                    content: 'cut',
                                    iconCss: 'e-icons e-cut'
                                }
                            }]
                        }]
                    }, {
                        id: "groupGallery",
                        orientation: 'Row',
                        groupIconCss: 'e-icons e-paste',
                        collections: [{
                            id: "collectionGallery",
                            items: [{
                                id: "itemGallery",
                                type: RibbonItemType.Gallery,
                                gallerySettings: {
                                    popupClose: (args: GalleryPopupEventArgs) => {
                                        args.cancel = true;
                                    },
                                    groups: [{
                                        header: 'Group 1',
                                        items: [{
                                            content: 'Cut',
                                            iconCss: 'e-icons e-cut'
                                        },{
                                            content: 'Copy',
                                            iconCss: 'e-icons e-copy'
                                        },{
                                            content: 'Paste',
                                            iconCss: 'e-icons e-paste'
                                        },{
                                            content: 'Format Painter',
                                            iconCss: 'e-icons e-format-painter'
                                        }]
                                    },{
                                        header: 'Group 2',
                                        items: [{
                                            content: 'Cut',
                                            iconCss: 'e-icons e-cut'
                                        },{
                                            content: 'Copy',
                                            iconCss: 'e-icons e-copy'
                                        },{
                                            content: 'Paste',
                                            iconCss: 'e-icons e-paste'
                                        },{
                                            content: 'Format Painter',
                                            iconCss: 'e-icons e-format-painter'
                                        }]
                                    }]
                                }
                            }]
                        }]
                    }]
                }]
            }, ribbonEle);
            containerEle.style.width = '300px';
            ribbon.refreshLayout();
            (ribbon.element.querySelector('#ribbon_tab_sim_ovrl_overflow') as HTMLElement).click();
            expect(document.querySelector('.e-ribbon-gallery-dropdown') !== null).toBe(true);
            (document.querySelector('.e-ribbon-gallery-dropdown') as HTMLElement).click();
            expect(document.querySelector('#itemGallery-popup').classList.contains('e-popup-open')).toBe(true);
            (document.querySelector('.e-ribbon-gallery-dropdown') as HTMLElement).click();
            ribbon.tabs[0].groups[3].collections[0].items[0].gallerySettings.popupClose = (args: GalleryPopupEventArgs) => {
                args.cancel = false;
            };
            ribbon.dataBind();
            (document.querySelector('.e-ribbon-gallery-dropdown') as HTMLElement).click();
            expect(document.querySelector('.e-ribbon-gallery-dropdown').classList.contains('e-popup-open')).toBe(false);
        });
        it('both templates are present', () => {
            let template1 = '<div class="gallery-template"><span id="menu" class="${items.iconCss}"></span></div>';
            let template2 = '<div class="gallery-popup-template"><span id="menuitem" class="e-gallery-temp-popup">${items.content}</span></div>';
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
                                id: "templateitem1",
                                type: RibbonItemType.Gallery,
                                gallerySettings: {
                                    template: template1,
                                    popupTemplate: template2,
                                    groups: [{
                                        header: 'Group 1',
                                        items: [{
                                            content: 'Cut',
                                            iconCss: 'e-icons e-cut'
                                        },{
                                            content: 'Copy',
                                            iconCss: 'e-icons e-copy'
                                        },{
                                            content: 'Paste',
                                            iconCss: 'e-icons e-paste',
                                            cssClass: 'e-template-gallery',
                                            disabled: true
                                        },{
                                            content: 'Format Painter',
                                            iconCss: 'e-icons e-format-painter'
                                        }]
                                    },{
                                        header: 'Group 2',
                                        items: [{
                                            content: 'Cut',
                                            iconCss: 'e-icons e-cut'
                                        },{
                                            content: 'Copy',
                                            iconCss: 'e-icons e-copy'
                                        },{
                                            content: 'Paste',
                                            iconCss: 'e-icons e-paste'
                                        },{
                                            content: 'Format Painter',
                                            iconCss: 'e-icons e-format-painter'
                                        }]
                                    }]
                                }
                            }]
                        }]
                    }, {
                        id: "group2",
                        header: "group2Header",
                        collections: [{
                            id: "collection2",
                            items: [{
                                id: "item2",
                                type: RibbonItemType.Button,
                                buttonSettings: {
                                    iconCss: 'e-print e-icons',
                                    content: 'Read Mode'
                                }
                            }]
                        }]
                    }]
                }]
            }, ribbonEle);
            expect(ribbon.element.querySelector('#templateitem1_container').querySelectorAll('.e-ribbon-gallery-item').length).toBe(3);
            expect(ribbon.element.querySelector('#templateitem1_container').querySelectorAll('.e-ribbon-gallery-item')[0].classList.contains('e-ribbon-gallery-selected')).toBe(true);
            expect(ribbon.element.querySelector('#templateitem1_container').querySelectorAll('.gallery-template').length).toBe(3);
            (ribbon.element.querySelector('#templateitem1_container').querySelector('#templateitem1_popupButton') as HTMLElement).click();
            expect(document.querySelector('#templateitem1_galleryPopup').classList.contains('e-popup-open')).toBe(true);
            expect(document.querySelector('#templateitem1_popupContainer').querySelectorAll('.gallery-popup-template').length).toBe(8);
            (ribbon.element.querySelector('#templateitem1_container').querySelector('#templateitem1_popupButton') as HTMLElement).click();
        });
        it('template only present', () => {
            let template1 = '<div class="gallery-template"><span id="menu" class="${items.iconCss}"></span></div>';
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
                                id: "templateitem1",
                                type: RibbonItemType.Gallery,
                                gallerySettings: {
                                    template: template1,
                                    groups: [{
                                        header: 'Group 1',
                                        items: [{
                                            content: 'Cut',
                                            iconCss: 'e-icons e-cut'
                                        },{
                                            content: 'Copy',
                                            iconCss: 'e-icons e-copy'
                                        },{
                                            content: 'Paste',
                                            iconCss: 'e-icons e-paste',
                                            cssClass: 'e-template-gallery',
                                            disabled: true
                                        },{
                                            content: 'Format Painter',
                                            iconCss: 'e-icons e-format-painter'
                                        }]
                                    },{
                                        header: 'Group 2',
                                        items: [{
                                            content: 'Cut',
                                            iconCss: 'e-icons e-cut'
                                        },{
                                            content: 'Copy',
                                            iconCss: 'e-icons e-copy'
                                        },{
                                            content: 'Paste',
                                            iconCss: 'e-icons e-paste'
                                        },{
                                            content: 'Format Painter',
                                            iconCss: 'e-icons e-format-painter'
                                        }]
                                    }]
                                }
                            }]
                        }]
                    }, {
                        id: "group2",
                        header: "group2Header",
                        collections: [{
                            id: "collection2",
                            items: [{
                                id: "item2",
                                type: RibbonItemType.Button,
                                buttonSettings: {
                                    iconCss: 'e-print e-icons',
                                    content: 'Read Mode'
                                }
                            }]
                        }]
                    }]
                }]
            }, ribbonEle);
            expect(ribbon.element.querySelector('#templateitem1_container').querySelectorAll('.e-ribbon-gallery-item').length).toBe(3);
            expect(ribbon.element.querySelector('#templateitem1_container').querySelectorAll('.e-ribbon-gallery-item')[0].classList.contains('e-ribbon-gallery-selected')).toBe(true);
            expect(ribbon.element.querySelector('#templateitem1_container').querySelectorAll('.gallery-template').length).toBe(3);
        });
        it('popup template only present', () => {
            let template2 = '<div class="gallery-popup-template"><span id="menuitem" class="e-gallery-temp-popup">${items.content}</span></div>';
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
                                id: "templateitem1",
                                type: RibbonItemType.Gallery,
                                gallerySettings: {
                                    popupTemplate: template2,
                                    groups: [{
                                        header: 'Group 1',
                                        items: [{
                                            content: 'Cut',
                                            iconCss: 'e-icons e-cut'
                                        },{
                                            content: 'Copy',
                                            iconCss: 'e-icons e-copy'
                                        },{
                                            content: 'Paste',
                                            iconCss: 'e-icons e-paste',
                                            cssClass: 'e-template-gallery',
                                            disabled: true
                                        },{
                                            content: 'Format Painter',
                                            iconCss: 'e-icons e-format-painter'
                                        }]
                                    },{
                                        header: 'Group 2',
                                        items: [{
                                            content: 'Cut',
                                            iconCss: 'e-icons e-cut'
                                        },{
                                            content: 'Copy',
                                            iconCss: 'e-icons e-copy'
                                        },{
                                            content: 'Paste',
                                            iconCss: 'e-icons e-paste'
                                        },{
                                            content: 'Format Painter',
                                            iconCss: 'e-icons e-format-painter'
                                        }]
                                    }]
                                }
                            }]
                        }]
                    }, {
                        id: "group2",
                        header: "group2Header",
                        collections: [{
                            id: "collection2",
                            items: [{
                                id: "item2",
                                type: RibbonItemType.Button,
                                buttonSettings: {
                                    iconCss: 'e-print e-icons',
                                    content: 'Read Mode'
                                }
                            }]
                        }]
                    }]
                }]
            }, ribbonEle);
            expect(ribbon.element.querySelector('#templateitem1_container').querySelectorAll('.e-ribbon-gallery-item').length).toBe(3);
            expect(ribbon.element.querySelector('#templateitem1_container').querySelectorAll('.e-ribbon-gallery-item')[0].classList.contains('e-ribbon-gallery-selected')).toBe(true);
            (ribbon.element.querySelector('#templateitem1_container').querySelector('#templateitem1_popupButton') as HTMLElement).click();
            expect(document.querySelector('#templateitem1_galleryPopup').classList.contains('e-popup-open')).toBe(true);
            expect(document.querySelector('#templateitem1_popupContainer').querySelectorAll('.gallery-popup-template').length).toBe(8);
            (ribbon.element.querySelector('#templateitem1_container').querySelector('#templateitem1_popupButton') as HTMLElement).click();
        });
        it('keyboard navigation', () => {
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
                                type: RibbonItemType.Gallery,
                                gallerySettings: {
                                    groups: [{
                                        header: 'Group 1',
                                        items: [{
                                            content: 'Cut',
                                            iconCss: 'e-icons e-cut'
                                        },{
                                            content: 'Copy',
                                            iconCss: 'e-icons e-copy'
                                        },{
                                            content: 'Paste',
                                            iconCss: 'e-icons e-paste'
                                        },{
                                            content: 'Format Painter',
                                            iconCss: 'e-icons e-format-painter'
                                        }]
                                    },{
                                        header: 'Group 2',
                                        items: [{
                                            content: 'Cut',
                                            iconCss: 'e-icons e-cut'
                                        },{
                                            content: 'Copy',
                                            iconCss: 'e-icons e-copy'
                                        },{
                                            content: 'Paste',
                                            iconCss: 'e-icons e-paste'
                                        },{
                                            content: 'Format Painter',
                                            iconCss: 'e-icons e-format-painter'
                                        }]
                                    }]
                                }
                            }]
                        }]
                    }, {
                        id: "group2",
                        header: "group2Header",
                        collections: [{
                            id: "collection2",
                            items: [{
                                id: "item2",
                                type: RibbonItemType.Button,
                                buttonSettings: {
                                    iconCss: 'e-print e-icons',
                                    content: 'Read Mode'
                                }
                            }]
                        }]
                    }]
                }]
            }, ribbonEle);
            expect(ribbonEle.querySelector('#item1_galleryContainer0_gallery0').classList.contains('e-ribbon-gallery-selected')).toBe(true);
            expect(ribbonEle.querySelector('#item1_galleryContainer0_gallery1').classList.contains('e-ribbon-gallery-selected')).toBe(false);
            let tabEle: HTMLElement = document.querySelector('.e-tab-wrap');
            tabEle.dispatchEvent(new KeyboardEvent('keydown',{'key':'Enter'}));
            tabEle.dispatchEvent(new KeyboardEvent('keydown',{'key':'Tab'}));
            (ribbonEle.querySelector('#item1_galleryContainer0_gallery1')as HTMLElement).focus();
            (ribbonEle.querySelector('#item1_galleryContainer0_gallery1')as HTMLElement).dispatchEvent((new KeyboardEvent('keydown',{'key':'Enter'})));
            expect(ribbonEle.querySelector('#item1_galleryContainer0_gallery0').classList.contains('e-ribbon-gallery-selected')).toBe(false);
            expect(ribbonEle.querySelector('#item1_galleryContainer0_gallery1').classList.contains('e-ribbon-gallery-selected')).toBe(true);
            (ribbonEle.querySelector('#item1_galleryContainer0_gallery2')as HTMLElement).focus();
            (ribbonEle.querySelector('#item1_galleryContainer0_gallery2')as HTMLElement).dispatchEvent((new KeyboardEvent('keydown',{'key':' '})));
            expect(ribbonEle.querySelector('#item1_galleryContainer0_gallery1').classList.contains('e-ribbon-gallery-selected')).toBe(false);
            expect(ribbonEle.querySelector('#item1_galleryContainer0_gallery2').classList.contains('e-ribbon-gallery-selected')).toBe(true);
        });
        it('popup keyboard navigation', () => {
            let collectionItems: RibbonItemModel = ({
                id: "itemKeyboard",
                type: RibbonItemType.Gallery,
                gallerySettings: {
                    groups: [{
                        header: 'Group 1',
                        items: [{
                            content: 'Cut',
                            iconCss: 'e-icons e-cut'
                        },{
                            content: 'Copy',
                            iconCss: 'e-icons e-copy'
                        },{
                            content: 'Paste',
                            iconCss: 'e-icons e-paste'
                        },{
                            content: 'Format Painter',
                            iconCss: 'e-icons e-format-painter'
                        }]
                    },{
                        header: 'Group 2',
                        items: [{
                            content: 'Cut',
                            iconCss: 'e-icons e-cut'
                        },{
                            content: 'Copy',
                            iconCss: 'e-icons e-copy'
                        },{
                            content: 'Paste',
                            iconCss: 'e-icons e-paste'
                        },{
                            content: 'Format Painter',
                            iconCss: 'e-icons e-format-painter'
                        }]
                    }]
                }
            });
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
                            items: [collectionItems]
                        }]
                    }, {
                        id: "group2",
                        header: "group2Header",
                        collections: [{
                            id: "collection2",
                            items: [{
                                id: "item2",
                                type: RibbonItemType.Button,
                                buttonSettings: {
                                    iconCss: 'e-print e-icons',
                                    content: 'Read Mode'
                                }
                            }]
                        }]
                    }]
                }]
            }, ribbonEle);
            (ribbon.element.querySelector('#itemKeyboard_container').querySelector('#itemKeyboard_popupButton') as HTMLElement).click();
            (document.querySelector('#itemKeyboard_galleryPopup') as HTMLElement).dispatchEvent((new KeyboardEvent('keydown',{'key':'Enter'})));
            (ribbon.element.querySelector('#itemKeyboard_container').querySelector('#itemKeyboard_popupButton') as HTMLElement).click();
            expect(document.querySelector('#itemKeyboard_galleryPopup').classList.contains('e-popup-open')).toBe(true);
            keyboardEventArgs.target = document.activeElement;
            keyboardEventArgs.key = 'ArrowDown';
            (ribbon.ribbonGalleryModule as any).handleGalleryPopupNavigation(keyboardEventArgs, (document.querySelector('#itemKeyboard_galleryPopup') as HTMLElement), false);
            (document.querySelector('#popup_itemKeyboard_galleryContainer0_gallery1') as HTMLElement).dispatchEvent((new KeyboardEvent('keydown', { 'key': 'Enter' })));
            keyboardEventArgs.key = 'Enter';
            let popup: Popup = getComponent((document.querySelector('#itemKeyboard_galleryPopup') as HTMLElement), Popup);
            (ribbon.ribbonGalleryModule as any).handleGalleryPopupNavigation(keyboardEventArgs, (document.querySelector('#itemKeyboard_galleryPopup') as HTMLElement), false, 'itemKeyboard', popup, ribbon.tabs[0].groups[0].collections[0].items[0].gallerySettings);
            expect(document.querySelector('#itemKeyboard_galleryPopup').querySelectorAll('.e-ribbon-gallery-item')[1].classList.contains('e-ribbon-gallery-selected')).toBe(true);
            expect(document.querySelector('#itemKeyboard_galleryPopup').classList.contains('e-popup-open')).toBe(false);
            (ribbon.element.querySelector('#itemKeyboard_container').querySelector('#itemKeyboard_popupButton') as HTMLElement).click();
            keyboardEventArgs.target = document.activeElement;
            keyboardEventArgs.key = 'ArrowRight';
            (ribbon.ribbonGalleryModule as any).handleGalleryPopupNavigation(keyboardEventArgs, (document.querySelector('#itemKeyboard_galleryPopup') as HTMLElement), false);
            (document.querySelector('#popup_itemKeyboard_galleryContainer0_gallery1') as HTMLElement).dispatchEvent((new KeyboardEvent('keydown', { 'key': 'Enter' })));
            keyboardEventArgs.key = 'Enter';
            (ribbon.ribbonGalleryModule as any).handleGalleryPopupNavigation(keyboardEventArgs, (document.querySelector('#itemKeyboard_galleryPopup') as HTMLElement), false, 'itemKeyboard', popup, ribbon.tabs[0].groups[0].collections[0].items[0].gallerySettings);
            (ribbon.element.querySelector('#itemKeyboard_container').querySelector('#itemKeyboard_popupButton') as HTMLElement).click();
            keyboardEventArgs.target = document.activeElement;
            keyboardEventArgs.key = 'ArrowLeft';
            (ribbon.ribbonGalleryModule as any).handleGalleryPopupNavigation(keyboardEventArgs, (document.querySelector('#itemKeyboard_galleryPopup') as HTMLElement), false);
            (document.querySelector('#popup_itemKeyboard_galleryContainer1_gallery3') as HTMLElement).dispatchEvent((new KeyboardEvent('keydown', { 'key': 'Enter' })));
            keyboardEventArgs.key = 'Enter';
            (ribbon.ribbonGalleryModule as any).handleGalleryPopupNavigation(keyboardEventArgs, (document.querySelector('#itemKeyboard_galleryPopup') as HTMLElement), false, 'itemKeyboard', popup, ribbon.tabs[0].groups[0].collections[0].items[0].gallerySettings);
            expect(document.querySelector('#itemKeyboard_galleryPopup').querySelectorAll('.e-ribbon-gallery-item')[7].classList.contains('e-ribbon-gallery-selected')).toBe(true);
            (ribbon.element.querySelector('#itemKeyboard_container').querySelector('#itemKeyboard_popupButton') as HTMLElement).click();
            keyboardEventArgs.target = document.activeElement;
            keyboardEventArgs.key = 'ArrowUp';
            (ribbon.ribbonGalleryModule as any).handleGalleryPopupNavigation(keyboardEventArgs, (document.querySelector('#itemKeyboard_galleryPopup') as HTMLElement), false);
            (document.querySelector('#popup_itemKeyboard_galleryContainer1_gallery3') as HTMLElement).dispatchEvent((new KeyboardEvent('keydown', { 'key': 'Enter' })));
            keyboardEventArgs.key = 'Enter';
            (ribbon.ribbonGalleryModule as any).handleGalleryPopupNavigation(keyboardEventArgs, (document.querySelector('#itemKeyboard_galleryPopup') as HTMLElement), false, 'itemKeyboard', popup, ribbon.tabs[0].groups[0].collections[0].items[0].gallerySettings);
            (ribbon.element.querySelector('#itemKeyboard_container').querySelector('#itemKeyboard_popupButton') as HTMLElement).click();
            keyboardEventArgs.target = document.activeElement;
            keyboardEventArgs.key = 'End';
            (ribbon.ribbonGalleryModule as any).handleGalleryPopupNavigation(keyboardEventArgs, (document.querySelector('#itemKeyboard_galleryPopup') as HTMLElement), false);
            (document.querySelector('#popup_itemKeyboard_galleryContainer1_gallery3') as HTMLElement).dispatchEvent((new KeyboardEvent('keydown', { 'key': 'Enter' })));
            keyboardEventArgs.key = 'Enter';
            (ribbon.ribbonGalleryModule as any).handleGalleryPopupNavigation(keyboardEventArgs, (document.querySelector('#itemKeyboard_galleryPopup') as HTMLElement), false, 'itemKeyboard', popup, ribbon.tabs[0].groups[0].collections[0].items[0].gallerySettings);
            expect(document.querySelector('#itemKeyboard_galleryPopup').querySelectorAll('.e-ribbon-gallery-item')[7].classList.contains('e-ribbon-gallery-selected')).toBe(true);
            (ribbon.element.querySelector('#itemKeyboard_container').querySelector('#itemKeyboard_popupButton') as HTMLElement).click();
            keyboardEventArgs.target = document.activeElement;
            keyboardEventArgs.key = 'Home';
            (ribbon.ribbonGalleryModule as any).handleGalleryPopupNavigation(keyboardEventArgs, (document.querySelector('#itemKeyboard_galleryPopup') as HTMLElement), false);
            (document.querySelector('#popup_itemKeyboard_galleryContainer0_gallery0') as HTMLElement).dispatchEvent((new KeyboardEvent('keydown', { 'key': 'Enter' })));
            keyboardEventArgs.key = 'Enter';
            (ribbon.ribbonGalleryModule as any).handleGalleryPopupNavigation(keyboardEventArgs, (document.querySelector('#itemKeyboard_galleryPopup') as HTMLElement), false, 'itemKeyboard', popup, ribbon.tabs[0].groups[0].collections[0].items[0].gallerySettings);
            expect(document.querySelector('#itemKeyboard_galleryPopup').querySelectorAll('.e-ribbon-gallery-item')[0].classList.contains('e-ribbon-gallery-selected')).toBe(true);
            (ribbon.element.querySelector('#itemKeyboard_container').querySelector('#itemKeyboard_popupButton') as HTMLElement).click();
            keyboardEventArgs.key = 'ArrowRight';
            (ribbon.ribbonGalleryModule as any).handleGalleryPopupNavigation(keyboardEventArgs, (document.querySelector('#itemKeyboard_galleryPopup') as HTMLElement), false);
            keyboardEventArgs.key = 'ArrowLeft';
            (ribbon.ribbonGalleryModule as any).handleGalleryPopupNavigation(keyboardEventArgs, (document.querySelector('#itemKeyboard_galleryPopup') as HTMLElement), false);
            keyboardEventArgs.key = 'End';
            (ribbon.ribbonGalleryModule as any).handleGalleryPopupNavigation(keyboardEventArgs, (document.querySelector('#itemKeyboard_galleryPopup') as HTMLElement), false);
            keyboardEventArgs.key = 'ArrowRight';
            (ribbon.ribbonGalleryModule as any).handleGalleryPopupNavigation(keyboardEventArgs, (document.querySelector('#itemKeyboard_galleryPopup') as HTMLElement), false);
            keyboardEventArgs.key = 'Escape';
            (ribbon.ribbonGalleryModule as any).handleGalleryPopupNavigation(keyboardEventArgs, (document.querySelector('#itemKeyboard_galleryPopup') as HTMLElement), false, 'itemKeyboard', popup, ribbon.tabs[0].groups[0].collections[0].items[0].gallerySettings);
            expect(document.querySelector('#itemKeyboard_galleryPopup').classList.contains('e-popup-open')).toBe(false);
        });
        it('should prevent twice select event triggers', () => {
            let selectCount = 0;
            let collectionItems: RibbonItemModel = ({
                id: "itemKeyboard",
                type: RibbonItemType.Gallery,
                gallerySettings: {
                    select: function (args: GallerySelectEventArgs) { selectCount++; },
                    groups: [{
                        header: 'Group 1',
                        items: [{
                            content: 'Cut',
                            iconCss: 'e-icons e-cut'
                        },{
                            content: 'Copy',
                            iconCss: 'e-icons e-copy'
                        },{
                            content: 'Paste',
                            iconCss: 'e-icons e-paste'
                        },{
                            content: 'Format Painter',
                            iconCss: 'e-icons e-format-painter'
                        }]
                    },{
                        header: 'Group 2',
                        items: [{
                            content: 'Cut',
                            iconCss: 'e-icons e-cut'
                        },{
                            content: 'Copy',
                            iconCss: 'e-icons e-copy'
                        },{
                            content: 'Paste',
                            iconCss: 'e-icons e-paste'
                        },{
                            content: 'Format Painter',
                            iconCss: 'e-icons e-format-painter'
                        }]
                    }]
                }
            });
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
                            items: [collectionItems]
                        }]
                    }, {
                        id: "group2",
                        header: "group2Header",
                        collections: [{
                            id: "collection2",
                            items: [{
                                id: "item2",
                                type: RibbonItemType.Button,
                                buttonSettings: {
                                    iconCss: 'e-print e-icons',
                                    content: 'Read Mode'
                                }
                            }]
                        }]
                    }]
                }]
            }, ribbonEle);
            (ribbon.element.querySelector('#itemKeyboard_container').querySelector('#itemKeyboard_popupButton') as HTMLElement).click();
            expect(document.querySelector('#itemKeyboard_galleryPopup').classList.contains('e-popup-open')).toBe(true);
            document.querySelector('#itemKeyboard_galleryContainer0_gallery0').dispatchEvent((new KeyboardEvent('keydown', { 'key': 'Enter' })));
            expect(document.querySelector('#itemKeyboard_galleryPopup').querySelectorAll('.e-ribbon-gallery-item')[0].classList.contains('e-ribbon-gallery-selected')).toBe(true);
            expect(selectCount).toEqual(1);
        });
        it('show/hide popup method', () => {
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
                                type: RibbonItemType.Gallery,
                                gallerySettings: {
                                    groups: [{
                                        header: 'Group 1',
                                        items: [{
                                            content: 'Cut',
                                            iconCss: 'e-icons e-cut'
                                        },{
                                            content: 'Copy',
                                            iconCss: 'e-icons e-copy'
                                        },{
                                            content: 'Paste',
                                            iconCss: 'e-icons e-paste'
                                        },{
                                            content: 'Format Painter',
                                            iconCss: 'e-icons e-format-painter'
                                        }]
                                    },{
                                        header: 'Group 2',
                                        items: [{
                                            content: 'Cut',
                                            iconCss: 'e-icons e-cut'
                                        },{
                                            content: 'Copy',
                                            iconCss: 'e-icons e-copy'
                                        },{
                                            content: 'Paste',
                                            iconCss: 'e-icons e-paste'
                                        },{
                                            content: 'Format Painter',
                                            iconCss: 'e-icons e-format-painter'
                                        }]
                                    }]
                                }
                            }]
                        }]
                    }, {
                        id: "group2",
                        header: "group2Header",
                        collections: [{
                            id: "collection2",
                            items: [{
                                id: "item2",
                                type: RibbonItemType.Button,
                                buttonSettings: {
                                    iconCss: 'e-print e-icons',
                                    content: 'Read Mode'
                                }
                            }]
                        }]
                    }]
                }]
            }, ribbonEle);
            ribbon.ribbonGalleryModule.showGalleryPopup('item1');
            expect(document.querySelector('#item1_galleryPopup').classList.contains('e-popup-open')).toBe(true);
            expect(document.querySelector('#item1_popupButton').classList.contains('e-gallery-button-active')).toBe(true);
            ribbon.ribbonGalleryModule.hideGalleryPopup('item1');
            expect(document.querySelector('#item1_galleryPopup').classList.contains('e-popup-open')).toBe(false);
            expect(document.querySelector('#item1_popupButton').classList.contains('e-gallery-button-active')).toBe(false);
        });
        it('when two galleries are present', () => {
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
                                type: RibbonItemType.Gallery,
                                gallerySettings: {
                                    groups: [{
                                        header: 'Group 1',
                                        items: [{
                                            content: 'Cut',
                                            iconCss: 'e-icons e-cut'
                                        },{
                                            content: 'Copy',
                                            iconCss: 'e-icons e-copy'
                                        },{
                                            content: 'Paste',
                                            iconCss: 'e-icons e-paste'
                                        },{
                                            content: 'Format Painter',
                                            iconCss: 'e-icons e-format-painter'
                                        }]
                                    },{
                                        header: 'Group 2',
                                        items: [{
                                            content: 'Cut',
                                            iconCss: 'e-icons e-cut'
                                        },{
                                            content: 'Copy',
                                            iconCss: 'e-icons e-copy'
                                        },{
                                            content: 'Paste',
                                            iconCss: 'e-icons e-paste'
                                        },{
                                            content: 'Format Painter',
                                            iconCss: 'e-icons e-format-painter'
                                        }]
                                    }]
                                }
                            }]
                        }]
                    }, {
                        id: "group2",
                        header: "group2Header",
                        orientation: 'Row',
                        collections: [{
                            id: "collection2",
                            items: [{
                                id: "item2",
                                type: RibbonItemType.Gallery,
                                gallerySettings: {
                                    groups: [{
                                        header: 'Group 3',
                                        items: [{
                                            content: 'Cut',
                                            iconCss: 'e-icons e-cut'
                                        },{
                                            content: 'Copy',
                                            iconCss: 'e-icons e-copy'
                                        },{
                                            content: 'Paste',
                                            iconCss: 'e-icons e-paste'
                                        },{
                                            content: 'Format Painter',
                                            iconCss: 'e-icons e-format-painter'
                                        }]
                                    },{
                                        header: 'Group 4',
                                        items: [{
                                            content: 'Cut',
                                            iconCss: 'e-icons e-cut'
                                        },{
                                            content: 'Copy',
                                            iconCss: 'e-icons e-copy'
                                        },{
                                            content: 'Paste',
                                            iconCss: 'e-icons e-paste'
                                        },{
                                            content: 'Format Painter',
                                            iconCss: 'e-icons e-format-painter'
                                        }]
                                    }]
                                }
                            }]
                        }]
                    }]
                }]
            }, ribbonEle);
            (ribbon.element.querySelector('#item1_container').querySelector('#item1_popupButton') as HTMLElement).click();
            expect(document.querySelector('#item1_galleryPopup').classList.contains('e-popup-open')).toBe(true);
            (ribbon.element.querySelector('#item2_container').querySelector('#item2_popupButton') as HTMLElement).click();
            expect(document.querySelector('#item1_galleryPopup').classList.contains('e-popup-open')).toBe(false);
            expect(document.querySelector('#item2_galleryPopup').classList.contains('e-popup-open')).toBe(true);
            (ribbon.element.querySelector('#item2_container').querySelector('#item2_popupButton') as HTMLElement).click();
            expect(document.querySelector('#item2_galleryPopup').classList.contains('e-popup-open')).toBe(false);
        });
        it('itemHeight, itemWidth, PopupWidth, PopupHeight', () => {
            ribbon = new Ribbon({
                tabs: [{
                    id: "tab1",
                    header: "tab1",
                    groups: [{
                        id: "group2",
                        header: "group2Header",
                        collections: [{
                            id: "collection2",
                            items: [{
                                id: "item2",
                                type: RibbonItemType.Button,
                                buttonSettings: {
                                    iconCss: 'e-print e-icons',
                                    content: 'Read Mode'
                                }
                            }]
                        }]
                    },{
                        id: "group1",
                        header: "group1Header",
                        orientation: 'Row',
                        collections: [{
                            id: "collection1",
                            items: [{
                                id: "item1",
                                type: RibbonItemType.Gallery,
                                gallerySettings: {
                                    popupHeight: '200',
                                    popupWidth: '400',
                                    groups: [{
                                        header: 'Group 1',
                                        itemHeight: '40',
                                        itemWidth: '100',
                                        items: [{
                                            content: 'Cut',
                                            iconCss: 'e-icons e-cut'
                                        },{
                                            content: 'Copy',
                                            iconCss: 'e-icons e-copy'
                                        },{
                                            content: 'Paste',
                                            iconCss: 'e-icons e-paste'
                                        },{
                                            content: 'Format Painter',
                                            iconCss: 'e-icons e-format-painter'
                                        }]
                                    },{
                                        header: 'Group 2',
                                        itemHeight: '40',
                                        itemWidth: '100',
                                        items: [{
                                            content: 'Cut',
                                            iconCss: 'e-icons e-cut'
                                        },{
                                            content: 'Copy',
                                            iconCss: 'e-icons e-copy'
                                        },{
                                            content: 'Paste',
                                            iconCss: 'e-icons e-paste'
                                        },{
                                            content: 'Format Painter',
                                            iconCss: 'e-icons e-format-painter'
                                        }]
                                    }]
                                }
                            }]
                        }]
                    }]
                }]
            }, ribbonEle);
            (ribbon.element.querySelector('#item1_container').querySelector('#item1_popupButton') as HTMLElement).click();
            expect((ribbon.element.querySelector('#item1_galleryContainer0_gallery0') as HTMLElement).style.width).toBe('100px');
            expect((ribbon.element.querySelector('#item1_galleryContainer0_gallery1') as HTMLElement).style.width).toBe('100px');
            expect((ribbon.element.querySelector('#item1_galleryContainer0_gallery2') as HTMLElement).style.width).toBe('100px');
            expect((ribbon.element.querySelector('#item1_galleryContainer0_gallery0') as HTMLElement).style.height).toBe('40px');
            expect((ribbon.element.querySelector('#item1_galleryContainer0_gallery1') as HTMLElement).style.height).toBe('40px');
            expect((ribbon.element.querySelector('#item1_galleryContainer0_gallery2') as HTMLElement).style.height).toBe('40px');
            expect((document.querySelector('#item1_galleryPopup') as HTMLElement).style.width).toBe('400px');
            expect((document.querySelector('#item1_galleryPopup') as HTMLElement).style.height).toBe('200px');
            (ribbon.element.querySelector('#item1_container').querySelector('#item1_popupButton') as HTMLElement).click();
            ribbon.activeLayout = 'Simplified';
            ribbon.dataBind();
            containerEle.style.width = '100px';
            ribbon.refreshLayout();
            (ribbon.element.querySelector('#ribbon_tab_sim_ovrl_overflow') as HTMLElement).click();
            (document.querySelector('.e-ribbon-gallery-dropdown') as HTMLElement).click();
            expect(document.querySelector('#item1-popup').classList.contains('e-popup-open')).toBe(true);
            (document.querySelector('.e-ribbon-gallery-dropdown') as HTMLElement).click();
            expect(document.querySelector('#item1-popup').classList.contains('e-popup-open')).toBe(false);
            (ribbon.element.querySelector('#ribbon_tab_sim_ovrl_overflow') as HTMLElement).click();
            ribbon.activeLayout = 'Classic';
            ribbon.dataBind();
        });
        it('popup responsive', () => {
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
                                type: RibbonItemType.Gallery,
                                gallerySettings: {
                                    groups: [{
                                        header: 'Group 1',
                                        itemHeight: '40',
                                        itemWidth: '100',
                                        items: [{
                                            content: 'Cut',
                                            iconCss: 'e-icons e-cut'
                                        },{
                                            content: 'Copy',
                                            iconCss: 'e-icons e-copy'
                                        },{
                                            content: 'Paste',
                                            iconCss: 'e-icons e-paste'
                                        },{
                                            content: 'Format Painter',
                                            iconCss: 'e-icons e-format-painter'
                                        }]
                                    },{
                                        header: 'Group 2',
                                        itemHeight: '40',
                                        itemWidth: '100',
                                        items: [{
                                            content: 'Cut',
                                            iconCss: 'e-icons e-cut'
                                        },{
                                            content: 'Copy',
                                            iconCss: 'e-icons e-copy'
                                        },{
                                            content: 'Paste',
                                            iconCss: 'e-icons e-paste'
                                        },{
                                            content: 'Format Painter',
                                            iconCss: 'e-icons e-format-painter'
                                        }]
                                    }]
                                }
                            }]
                        }]
                    },{
                        id: "group2",
                        header: "group2Header",
                        collections: [{
                            id: "collection2",
                            items: [{
                                id: "item2",
                                type: RibbonItemType.Button,
                                buttonSettings: {
                                    iconCss: 'e-print e-icons',
                                    content: 'Read Mode'
                                }
                            }]
                        }]
                    }]
                }]
            }, ribbonEle);
            (ribbon.element.querySelector('#item1_container').querySelector('#item1_popupButton') as HTMLElement).click();
            expect((document.querySelector('#item1_galleryPopup') as HTMLElement).style.width).toBe('232px');
            (ribbon.element.querySelector('#item1_container').querySelector('#item1_popupButton') as HTMLElement).click();
        });
        it('in second tab', (done) => {
            ribbon = new Ribbon({
                tabs: [{
                    id: "tab1",
                    header: "tab1",
                    groups: [{
                        id: "group2",
                        header: "group2Header",
                        collections: [{
                            id: "collection2",
                            items: [{
                                id: "item2",
                                type: RibbonItemType.Button,
                                buttonSettings: {
                                    iconCss: 'e-print e-icons',
                                    content: 'Read Mode'
                                }
                            }]
                        }]
                    }]
                }, {
                    id: "tab2",
                    header: "tab2",
                    groups: [{
                        id: "group1",
                        header: "group1Header",
                        orientation: 'Row',
                        collections: [{
                            id: "collection1",
                            items: [{
                                id: "item1",
                                type: RibbonItemType.Gallery,
                                gallerySettings: {
                                    popupHeight: '200',
                                    popupWidth: '400',
                                    groups: [{
                                        header: 'Group 1',
                                        itemHeight: '40',
                                        itemWidth: '100',
                                        items: [{
                                            content: 'Cut',
                                            iconCss: 'e-icons e-cut'
                                        },{
                                            content: 'Copy',
                                            iconCss: 'e-icons e-copy'
                                        },{
                                            content: 'Paste',
                                            iconCss: 'e-icons e-paste'
                                        },{
                                            content: 'Format Painter',
                                            iconCss: 'e-icons e-format-painter'
                                        }]
                                    },{
                                        header: 'Group 2',
                                        itemHeight: '40',
                                        itemWidth: '100',
                                        items: [{
                                            content: 'Cut',
                                            iconCss: 'e-icons e-cut'
                                        },{
                                            content: 'Copy',
                                            iconCss: 'e-icons e-copy'
                                        },{
                                            content: 'Paste',
                                            iconCss: 'e-icons e-paste'
                                        },{
                                            content: 'Format Painter',
                                            iconCss: 'e-icons e-format-painter'
                                        }]
                                    }]
                                }
                            }]
                        }]
                    }]
                }],
                activeLayout: 'Simplified'
            }, ribbonEle);
            ribbon.setProperties({ selectedTab: 1 });
            setTimeout(() => {
                setTimeout(() => {
                    expect((document.querySelector('#item1_galleryWrapper') as HTMLElement).style.width).toBe('300px');
                    // For coverage 
                    ribbon.activeLayout = 'Classic';
                    ribbon.dataBind();
                    done();
                }, 450);
            }, 450);
        });
        it('update item method', () => {
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
                                type: RibbonItemType.Gallery,
                                gallerySettings: {
                                    selectedItemIndex: 2,
                                    groups: [{
                                        header: 'Group 1',
                                        items: [{
                                            content: 'Cut',
                                            iconCss: 'e-icons e-cut'
                                        },{
                                            content: 'Copy',
                                            iconCss: 'e-icons e-copy'
                                        },{
                                            content: 'Paste',
                                            iconCss: 'e-icons e-paste'
                                        },{
                                            content: 'Format Painter',
                                            iconCss: 'e-icons e-format-painter'
                                        }]
                                    },{
                                        header: 'Group 2',
                                        items: [{
                                            content: 'Cut',
                                            iconCss: 'e-icons e-cut'
                                        },{
                                            content: 'Copy',
                                            iconCss: 'e-icons e-copy'
                                        },{
                                            content: 'Paste',
                                            iconCss: 'e-icons e-paste'
                                        },{
                                            content: 'Format Painter',
                                            iconCss: 'e-icons e-format-painter'
                                        }]
                                    }]
                                }
                            }]
                        }]
                    }, {
                        id: "group2",
                        header: "group2Header",
                        collections: [{
                            id: "collection2",
                            items: [{
                                id: "item2",
                                type: RibbonItemType.Button,
                                buttonSettings: {
                                    iconCss: 'e-print e-icons',
                                    content: 'Read Mode'
                                }
                            }]
                        }]
                    }]
                }]
            }, ribbonEle);
            let item: RibbonItemModel = {
                id: 'item1',
                type: RibbonItemType.Gallery,
                gallerySettings: {
                    selectedItemIndex: 1,
                    groups: [{
                        header: 'Gallery header ',
                        items: [{
                            content: 'Cut',
                            iconCss: 'e-icons e-cut'
                        },{
                            content: 'Copy',
                            iconCss: 'e-icons e-copy',
                            disabled: true
                        },{
                            content: 'Paste',
                            iconCss: 'e-icons e-paste'
                        },{
                            content: 'Format Painter',
                            iconCss: 'e-icons e-format-painter'
                        }]
                    }]
                }
            }
            expect(ribbon.tabs[0].groups[0].collections[0].items[0].gallerySettings.groups.length).toBe(2);
            expect(document.querySelector('#item1_galleryContainer0_gallery1').classList.contains('e-disabled')).toBe(false);
            expect(document.querySelector('#item1_galleryContainer0_gallery2').classList.contains('e-ribbon-gallery-selected')).toBe(true);
            ribbon.updateItem(item);
            expect(ribbon.tabs[0].groups[0].collections[0].items[0].gallerySettings.groups.length).toBe(1);
            expect(document.querySelector('#item1_galleryContainer0_gallery1').classList.contains('e-disabled')).toBe(true);
            expect(document.querySelector('#item1_galleryContainer0_gallery2').classList.contains('e-ribbon-gallery-selected')).toBe(false);
            expect(document.querySelector('#item1_galleryContainer0_gallery1').classList.contains('e-ribbon-gallery-selected')).toBe(true);
            ribbon.ribbonGalleryModule.showGalleryPopup('item1');
            expect(document.querySelector('#item1_galleryPopup').classList.contains('e-popup-open')).toBe(true);
            expect(document.querySelector('#item1_popupButton').classList.contains('e-gallery-button-active')).toBe(true);
            ribbon.ribbonGalleryModule.hideGalleryPopup('item1');
            expect(document.querySelector('#item1_galleryPopup').classList.contains('e-popup-open')).toBe(false);
            expect(document.querySelector('#item1_popupButton').classList.contains('e-gallery-button-active')).toBe(false);
        });
        it('update item method in overflow popup', () => {
            ribbon = new Ribbon({
                activeLayout: 'Simplified',
                tabs: [{
                    id: "tabGallery",
                    header: "tabGallery",
                    groups: [{
                        id: "group2Button",
                        header: "group2ButtonHeader",
                        collections: [{
                            id: "collection2Button",
                            items: [{
                                id: "item2Button",
                                type: RibbonItemType.Button,
                                buttonSettings: {
                                    iconCss: 'e-print e-icons',
                                    content: 'Read Mode'
                                }
                            }]
                        }]
                    },{
                        id: "group3",
                        header: "group3",
                        collections: [{
                            id: "collection3",
                            items: [{
                                id: "item3",
                                type: RibbonItemType.Button,
                                buttonSettings: {
                                    iconCss: 'e-print e-icons',
                                    content: 'Read Mode'
                                }
                            }]
                        }]
                    },{
                        id: "group4",
                        header: "group4",
                        collections: [{
                            id: "collection4",
                            items: [{
                                id: "item4",
                                type: RibbonItemType.Button,
                                buttonSettings: {
                                    iconCss: 'e-print e-icons',
                                    content: 'Read Mode'
                                }
                            }]
                        }]
                    },{
                        header: 'Large items',
                        groupIconCss: 'e-icons e-paste',
                        showLauncherIcon: true,
                        orientation: ItemOrientation.Row,
                        id: 'large',
                        collections: [{
                            items: [{
                                type: RibbonItemType.SplitButton,
                                allowedSizes: RibbonItemSize.Large ,
                                splitButtonSettings: {
                                    content: 'Paste',
                                    cssClass: 'test-css',
                                    iconCss: 'e-icons e-paste',
                                    items: [{ text: 'Keep Source Format' }, { text: 'Merge format' }, { text: 'Keep text only' }]
                                }
                            }, {
                                type: RibbonItemType.DropDown,
                                allowedSizes: RibbonItemSize.Large ,
                                id: 'largetable',
                                dropDownSettings: {
                                    content: 'Table',
                                    iconCss: 'e-icons e-table',
                                    cssClass: 'test-css',
                                    items: [
                                        { text: 'Insert Table' }, { text: 'Draw Table' },
                                        { text: 'Convert Table' }, { text: 'Excel SpreadSheet' }
                                    ]
                                }
                            }, {
                                type: RibbonItemType.Button,
                                id: 'largecut',
                                allowedSizes: RibbonItemSize.Large ,
                                cssClass: 'test-css',
                                buttonSettings: {
                                    content: 'cut',
                                    iconCss: 'e-icons e-cut',
                                }
                            }]
                        }]
                    }, {
                        header: 'Font',
                        orientation: 'Row',
                        groupIconCss: 'e-icons e-bold',
                        cssClass: 'font-group',
                        id: 'font',
                        collections: [{
                            items: [{
                                type: RibbonItemType.CheckBox,
                                id: 'fontbold',
                                checkBoxSettings: {
                                    cssClass: 'test-css',
                                    label: 'Ruler',
                                    checked: false
                                }
                            }, {
                                type: RibbonItemType.ColorPicker,
                                id: 'fontcolor',
                                colorPickerSettings: {
                                    cssClass: 'test-css',
                                    value: '#123456'
                                }
                            } ]
                        }]
                    }, {
                        header: 'GroupOverflow btn',
                        groupIconCss: 'e-icons e-paste',
                        showLauncherIcon: true,
                        orientation: ItemOrientation.Row,
                        enableGroupOverflow: true,
                        id: 'groupoverflow1',
                        collections: [{
                            items: [{
                                type: RibbonItemType.SplitButton,
                                id: 'groupoverflowpaste',
                                allowedSizes: RibbonItemSize.Large ,
                                splitButtonSettings: {
                                    content: 'Paste',
                                    iconCss: 'e-icons e-paste',
                                    items: [{ text: 'Keep Source Format' }, { text: 'Merge format' }, { text: 'Keep text only' }],
                                }
                            }, {
                                type: RibbonItemType.DropDown,
                                displayOptions: DisplayMode.Overflow,
                                id: 'groupoverflowtable',
                                allowedSizes: RibbonItemSize.Large ,
                                dropDownSettings: {
                                    content: 'Table',
                                    iconCss: 'e-icons e-table',
                                    items: [
                                        { text: 'Insert Table' }, { text: 'Draw Table' },
                                        { text: 'Convert Table' }, { text: 'Excel SpreadSheet' }
                                    ]
                                }
                            }, {
                                type: RibbonItemType.Button,
                                id: 'groupoverflowcut',
                                allowedSizes: RibbonItemSize.Large ,
                                buttonSettings: {
                                    content: 'cut',
                                    iconCss: 'e-icons e-cut'
                                }
                            }]
                        }]
                    }, {
                        header: 'CmnOverflow btn',
                        groupIconCss: 'e-icons e-paste',
                        id: 'CmnOverflow1',
                        showLauncherIcon: true,
                        orientation: ItemOrientation.Row,
                        collections: [{
                            items: [{
                                type: RibbonItemType.SplitButton,
                                id: 'commonoverflowpaste',
                                allowedSizes: RibbonItemSize.Large ,
                                splitButtonSettings: {
                                    content: 'Paste',
                                    iconCss: 'e-icons e-paste',
                                    items: [{ text: 'Keep Source Format' }, { text: 'Merge format' }, { text: 'Keep text only' }],
                                }
                            }, {
                                type: RibbonItemType.DropDown,
                                displayOptions: DisplayMode.Overflow,
                                id: 'commonoverflowtable',
                                allowedSizes: RibbonItemSize.Large ,
                                dropDownSettings: {
                                    content: 'Table',
                                    iconCss: 'e-icons e-table',
                                    items: [
                                        { text: 'Insert Table' }, { text: 'Draw Table' },
                                        { text: 'Convert Table' }, { text: 'Excel SpreadSheet' }
                                    ]
                                }
                            }, {
                                type: RibbonItemType.Button,
                                id: 'commonoverflowcut',
                                allowedSizes: RibbonItemSize.Large ,
                                buttonSettings: {
                                    content: 'cut',
                                    iconCss: 'e-icons e-cut'
                                }
                            }]
                        }]
                    }, {
                        id: "groupGallery",
                        orientation: 'Row',
                        groupIconCss: 'e-icons e-paste',
                        collections: [{
                            id: "collectionGallery",
                            items: [{
                                id: "itemGallery",
                                type: RibbonItemType.Gallery,
                                gallerySettings: {
                                    selectedItemIndex: 2,
                                    groups: [{
                                        header: 'Group 1',
                                        items: [{
                                            content: 'Cut',
                                            iconCss: 'e-icons e-cut'
                                        },{
                                            content: 'Copy',
                                            iconCss: 'e-icons e-copy'
                                        },{
                                            content: 'Paste',
                                            iconCss: 'e-icons e-paste'
                                        },{
                                            content: 'Format Painter',
                                            iconCss: 'e-icons e-format-painter'
                                        }]
                                    },{
                                        header: 'Group 2',
                                        items: [{
                                            content: 'Cut',
                                            iconCss: 'e-icons e-cut'
                                        },{
                                            content: 'Copy',
                                            iconCss: 'e-icons e-copy'
                                        },{
                                            content: 'Paste',
                                            iconCss: 'e-icons e-paste'
                                        },{
                                            content: 'Format Painter',
                                            iconCss: 'e-icons e-format-painter'
                                        }]
                                    }]
                                }
                            }]
                        }]
                    }]
                }]
            }, ribbonEle);
            let item: RibbonItemModel = {
                id: 'itemGallery',
                type: RibbonItemType.Gallery,
                disabled: true,
                gallerySettings: {
                    selectedItemIndex: 1,
                    groups: [{
                        header: 'Gallery header ',
                        items: [{
                            content: 'Cut',
                            iconCss: 'e-icons e-cut'
                        },{
                            content: 'Copy',
                            iconCss: 'e-icons e-copy',
                            disabled: true
                        },{
                            content: 'Paste',
                            iconCss: 'e-icons e-paste'
                        },{
                            content: 'Format Painter',
                            iconCss: 'e-icons e-format-painter'
                        }]
                    }]
                }
            }
            containerEle.style.width = '300px';
            ribbon.refreshLayout();
            expect(document.querySelector('#itemGallery_galleryWrapper').classList.contains('e-disabled')).toBe(false);
            expect(document.querySelector('#itemGallery_popupButton').classList.contains('e-disabled')).toBe(false);
            ribbon.updateItem(item);
            expect(document.querySelector('#itemGallery_popupButton').classList.contains('e-disabled')).toBe(true);
            expect(document.querySelector('#itemGallery_galleryWrapper').classList.contains('e-disabled')).toBe(true);
            expect(document.querySelector('#itemGallery').classList.contains('e-disabled')).toBe(true);
        });
    });
});
