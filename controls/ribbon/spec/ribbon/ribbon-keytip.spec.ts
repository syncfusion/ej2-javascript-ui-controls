/* eslint-disable @typescript-eslint/no-explicit-any */

import { createElement, getComponent, isNullOrUndefined, remove } from "@syncfusion/ej2-base";
import { ExpandCollapseEventArgs, ItemOrientation, LauncherClickEventArgs, Ribbon, RibbonItemSize, RibbonItemType, DisplayMode, TabSelectedEventArgs, TabSelectingEventArgs } from "../../src/ribbon/base/index";
import { BackstageItemModel, FileMenuSettingsModel, RibbonCollectionModel, RibbonGroupModel, RibbonItemModel, RibbonTooltipModel } from "../../src/ribbon/models/index";
import { RibbonColorPicker, RibbonFileMenu, RibbonKeyTip } from "../../src/index";
import { MenuItemModel, Toolbar } from "@syncfusion/ej2-navigations";
Ribbon.Inject(RibbonColorPicker, RibbonFileMenu, RibbonKeyTip);

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
    describe('Keytip', () => {
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
        });
        it('for tabs', () => {
            ribbon = new Ribbon({
                enableKeyTips: true,
                layoutSwitcherKeyTip: 'L',
                cssClass: 'oldCss',
                tabs: [{
                    id: "tab1",
                    header: "tab1",
                    keyTip: "T",
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
            document.body.dispatchEvent((new KeyboardEvent('keydown',{altKey:true, key: 'Meta'})));
            expect(document.querySelector('.e-ribbon-keytip') !== null).toBe(true);
            expect(document.querySelector('#tab1_keytip') !== null).toBe(true);
            expect(document.querySelector('#ribbon_tab_collapsebutton_keytip') !== null).toBe(true);
            expect((document.querySelector('#ribbon_tab_collapsebutton_keytip')as HTMLElement).innerText).toBe('L');
            expect((document.querySelector('#tab1_keytip')as HTMLElement).innerText).toBe('T');
            document.body.dispatchEvent((new KeyboardEvent('keydown',{altKey:true, key: 'Meta'})));
            expect(document.querySelector('.e-ribbon-keytip') === null).toBe(true);
            expect(document.querySelector('#tab1_keytip') === null).toBe(true);
            expect(document.querySelector('#ribbon_tab_collapsebutton_keytip') === null).toBe(true);
        });
        it('for tabs overflow', (done) => {
            ribbon = new Ribbon({
                enableKeyTips: true,
                layoutSwitcherKeyTip: 'L',
                cssClass: 'oldCss',
                tabs: [{
                    id: "tab1",
                    header: "tab1",
                    keyTip: "T1",
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
                    keyTip: "T2",
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
                },{
                    id: "tab3",
                    header: "tab3",
                    keyTip: "T3",
                    groups: [{
                        id: "group3",
                        header: "group3Header",
                        orientation: ItemOrientation.Row,
                        collections: [{
                            id: "collection3",
                            items: [{
                                id: "item3",
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Large,
                                buttonSettings: {
                                    content: 'button3',
                                    iconCss: 'e-icons e-cut',
                                }
                            }]
                        }]
                    }]
                },{
                    id: "tab4",
                    header: "tab4",
                    keyTip: "T4",
                    groups: [{
                        id: "group4",
                        header: "group4Header",
                        orientation: ItemOrientation.Row,
                        collections: [{
                            id: "collection4",
                            items: [{
                                id: "item4",
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
            containerEle.style.width = '200px';
            const toolbar: Toolbar = ribbon.tabObj['tbObj'] as Toolbar;
            toolbar.refreshOverflow();
            ribbon.refreshLayout();
            document.body.dispatchEvent((new KeyboardEvent('keydown',{altKey:true, key: 'Meta'})));
            expect(document.querySelector('#tab1_keytip') !== null).toBe(true);
            expect(document.querySelector('#tab2_keytip') !== null).toBe(true);
            expect(document.querySelector('#tab3_keytip') === null).toBe(true);
            expect(document.querySelector('#tab4_keytip') === null).toBe(true);
            expect(document.querySelector('#_nav_keytip') !== null).toBe(true);
            document.body.dispatchEvent((new KeyboardEvent('keydown',{'key':'00'})));
            setTimeout(() => {
                expect(document.querySelector('#tab1_keytip') === null).toBe(true);
                expect(document.querySelector('#tab2_keytip') === null).toBe(true);
                expect(document.querySelector('#tab3_keytip') !== null).toBe(true);
                expect(document.querySelector('#tab4_keytip') !== null).toBe(true);
                document.body.dispatchEvent((new KeyboardEvent('keydown',{'key':'Escape'})));
                setTimeout(() => {
                    expect(document.querySelector('#tab1_keytip') !== null).toBe(true);
                    expect(document.querySelector('#tab2_keytip') !== null).toBe(true);
                    expect(document.querySelector('#tab3_keytip') === null).toBe(true);
                    expect(document.querySelector('#tab4_keytip') === null).toBe(true);
                    expect(document.querySelector('#_nav_keytip') !== null).toBe(true);
                    done();
                }, 600);
            }, 1000);
        });
        it('for filemenu', () => {
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
                visible: true,
                keyTip: 'F',
                menuItems:menuItems2
            });
            ribbon = new Ribbon({
                enableKeyTips: true,
                fileMenu: files,
                tabs: [{
                    id: "tab01",
                    header: "tab01",
                    keyTip: "A",
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
                    id: "tab02",
                    header: "tab02",
                    keyTip: "B",
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
                },{
                    id: "tab03",
                    header: "tab03",
                    keyTip: "C",
                    groups: [{
                        id: "group3",
                        header: "group1Header",
                        orientation: ItemOrientation.Row,
                        collections: [{
                            id: "collection3",
                            items: [{
                                id: "item3",
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
            document.body.dispatchEvent((new KeyboardEvent('keydown',{altKey:true, key: 'Meta'})));
            expect(document.querySelector('.e-ribbon-keytip') !== null).toBe(true);
            expect(document.querySelector('#ribbon_filemenu_keytip') !== null).toBe(true);
            expect((document.querySelector('#ribbon_filemenu_keytip')as HTMLElement).innerText ).toBe('F');
            document.body.dispatchEvent((new KeyboardEvent('keydown',{altKey:true, key: 'Meta'})));
            expect(document.querySelector('.e-ribbon-keytip') === null).toBe(true);
            expect(document.querySelector('#ribbon_filemenu_keytip') === null).toBe(true);
            document.body.dispatchEvent((new KeyboardEvent('keydown',{altKey:true, key: 'Meta'})));
            document.body.dispatchEvent((new KeyboardEvent('keydown',{'key':'f'})));
            expect(document.getElementById('ribbon_filemenu-popup').classList.contains('e-popup-open')).toBe(true);
            expect(document.querySelector('.e-ribbon-keytip') === null).toBe(true);
            expect(document.querySelector('#ribbon_filemenu_keytip') === null).toBe(true);
        });
        it('for backstage', () => {
            let menuItems: BackstageItemModel[] = [
                {
                    id: 'item1',
                    text: 'Home',
                    iconCss: 'e-icons e-home',
                    content: '#homeCont',
                    keyTip: 'H'
                },
                {
                    id: 'item2',
                    text: 'New',
                    iconCss: 'e-icons e-file-new',
                    content: '#newCont',
                    keyTip: 'N'
                },
                {
                    id:'item3',
                    text: 'Open',
                    iconCss:'e-icons e-file',
                    content: '#openCont',
                    keyTip: 'O' 
                }
            ];
            ribbon = new Ribbon({
                enableKeyTips: true,
                backStageMenu: {
                    text: 'File',
                    keyTip: 'F',
                    visible: true,
                    items: menuItems,
                    backButton: {
                        text: 'Close',
                    }
                },
                tabs: [{
                    id: "tab01",
                    header: "tab01",
                    keyTip: "A",
                    groups: [{
                        id: "group1",
                        header: "group1Header",
                        orientation: ItemOrientation.Row,
                        collections: [{
                            id: "collection1",
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
                }, {
                    id: "tab02",
                    header: "tab02",
                    keyTip: "B",
                    groups: [{
                        id: "group2",
                        header: "group1Header",
                        orientation: ItemOrientation.Row,
                        collections: [{
                            id: "collection2",
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
                },{
                    id: "tab03",
                    header: "tab03",
                    keyTip: "C",
                    groups: [{
                        id: "group3",
                        header: "group1Header",
                        orientation: ItemOrientation.Row,
                        collections: [{
                            id: "collection3",
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
                }]
            }, ribbonEle);
            document.body.dispatchEvent((new KeyboardEvent('keydown',{altKey:true, key: 'Meta'})));
            expect(document.querySelector('.e-ribbon-keytip') !== null).toBe(true);
            expect(document.querySelector('#ribbon_backstage_keytip') !== null).toBe(true);
            expect((document.querySelector('#ribbon_backstage_keytip')as HTMLElement).innerText ).toBe('F');
            document.body.dispatchEvent((new KeyboardEvent('keydown',{altKey:true, key: 'Meta'})));
            expect(document.querySelector('.e-ribbon-keytip') === null).toBe(true);
            expect(document.querySelector('#ribbon_backstage_keytip') === null).toBe(true);
            document.body.dispatchEvent((new KeyboardEvent('keydown',{altKey:true, key: 'Meta'})));
            document.body.dispatchEvent((new KeyboardEvent('keydown',{'key':'f'})));
            expect(document.getElementById('ribbon_backstagepopup').classList.contains('e-ribbon-backstage-open')).toBe(true);
            expect(document.querySelector('#ribbon_backstage_keytip') === null).toBe(true);
            expect(document.querySelector('#item1_keytip') !== null).toBe(true);
            expect((document.querySelector('#item1_keytip')as HTMLElement).innerText ).toBe('H');
            expect(document.querySelector('#item2_keytip') !== null).toBe(true);
            expect((document.querySelector('#item2_keytip')as HTMLElement).innerText ).toBe('N');
            expect(document.querySelector('#item3_keytip') !== null).toBe(true);
            expect((document.querySelector('#item3_keytip')as HTMLElement).innerText ).toBe('O');
            document.body.dispatchEvent((new KeyboardEvent('keydown',{'key':'Escape'})));
            expect(document.querySelector('#item1_keytip') === null).toBe(true);
            expect(document.querySelector('#item2_keytip') === null).toBe(true);
            expect(document.querySelector('#item3_keytip') === null).toBe(true);
            expect(document.querySelector('#ribbon_backstage_keytip') !== null).toBe(true);
            document.body.dispatchEvent((new KeyboardEvent('keydown',{'key':'f'})));
            expect(document.querySelector('#item1_keytip') !== null).toBe(true);
            expect(document.querySelector('#item2_keytip') !== null).toBe(true);
            expect(document.querySelector('#item3_keytip') !== null).toBe(true);
            document.body.dispatchEvent((new KeyboardEvent('keydown',{'key':'n'})));
            expect(document.querySelector('#item2').classList.contains('e-selected')).toBe(true);
            expect(document.querySelector('#item1_keytip') === null).toBe(true);
            expect(document.querySelector('#item2_keytip') === null).toBe(true);
            expect(document.querySelector('#item3_keytip') === null).toBe(true);
        });
        it('if when backstage menu open', () => {
            let menuItems: BackstageItemModel[] = [
                {
                    id: 'item1',
                    text: 'Home',
                    iconCss: 'e-icons e-home',
                    content: '#homeCont',
                    keyTip: 'H'
                },
                {
                    id: 'item2',
                    text: 'New',
                    iconCss: 'e-icons e-file-new',
                    content: '#newCont',
                    keyTip: 'N'
                },
                {
                    id:'item3',
                    text: 'Open',
                    iconCss:'e-icons e-file',
                    content: '#openCont',
                    keyTip: 'O' 
                }
            ];
            ribbon = new Ribbon({
                enableKeyTips: true,
                backStageMenu: {
                    text: 'File',
                    keyTip: 'F',
                    visible: true,
                    items: menuItems,
                    backButton: {
                        text: 'Close',
                    }
                },
                tabs: [{
                    id: "tab01",
                    header: "tab01",
                    keyTip: "A",
                    groups: [{
                        id: "group1",
                        header: "group1Header",
                        orientation: ItemOrientation.Row,
                        collections: [{
                            id: "collection1",
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
                }, {
                    id: "tab02",
                    header: "tab02",
                    keyTip: "B",
                    groups: [{
                        id: "group2",
                        header: "group1Header",
                        orientation: ItemOrientation.Row,
                        collections: [{
                            id: "collection2",
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
                },{
                    id: "tab03",
                    header: "tab03",
                    keyTip: "C",
                    groups: [{
                        id: "group3",
                        header: "group1Header",
                        orientation: ItemOrientation.Row,
                        collections: [{
                            id: "collection3",
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
                }]
            }, ribbonEle);
            (document.querySelector('#ribbon_backstage')as HTMLElement).click();
            expect(document.getElementById('ribbon_backstagepopup').classList.contains('e-ribbon-backstage-open')).toBe(true);
            document.body.dispatchEvent((new KeyboardEvent('keydown',{altKey:true, key: 'Meta'})));
            expect(document.getElementById('ribbon_backstagepopup').classList.contains('e-ribbon-backstage-open')).toBe(false);
            expect(document.querySelector('.e-ribbon-keytip') !== null).toBe(true);
            expect(document.querySelector('#ribbon_backstage_keytip') !== null).toBe(true);
            expect(document.querySelector('#tab01_keytip') !== null).toBe(true);
            expect(document.querySelector('#tab02_keytip') !== null).toBe(true);
            expect(document.querySelector('#tab03_keytip') !== null).toBe(true);
        });
        it('for items', () => {
            ribbon = new Ribbon({
                enableKeyTips: true,
                cssClass: 'customCss',
                tabs: [{
                    id: "tab1",
                    header: "tab1",
                    keyTip: "T",
                    groups: [{
                        id: "group1",
                        header: "group1Header",
                        orientation: 'Column',
                        collections: [{
                            id: "collection1",
                            items: [{
                                id: "item1",
                                type: RibbonItemType.Button,
                                keyTip: 'I',
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
            }, ribbonEle);
            document.body.dispatchEvent((new KeyboardEvent('keydown',{altKey:true, key: 'Meta'})));
            expect(document.querySelector('.e-ribbon-keytip') !== null).toBe(true);
            document.body.dispatchEvent((new KeyboardEvent('keydown',{'key':'t'})));
            expect(document.querySelector('#item1_keytip') !== null).toBe(true); 
            expect((document.querySelector('#item1_keytip')as HTMLElement).innerText ).toBe('I');  
            document.body.dispatchEvent((new KeyboardEvent('keydown',{altKey:true, key: 'Meta'}))); 
            expect(document.querySelector('#item1_keytip') === null).toBe(true);
        });
        it('for switching tabs', (done) => {
            ribbon = new Ribbon({
                enableKeyTips: true,
                cssClass: 'oldCss',
                tabs: [{
                    id: "tab1",
                    header: "tab1",
                    keyTip: "T",
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
                    keyTip: "M",
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
                                keyTip: "C",
                                buttonSettings: {
                                    content: 'button2',
                                    iconCss: 'e-icons e-cut',
                                }
                            }]
                        }]
                    }]
                }]
            }, ribbonEle);
            setTimeout(() => {
                document.body.dispatchEvent((new KeyboardEvent('keydown',{altKey:true, key: 'Meta'})));
                document.body.dispatchEvent((new KeyboardEvent('keydown',{'key':'m'})));
                setTimeout(() => {
                    expect(document.querySelector('.e-ribbon-keytip') !== null).toBe(true);
                    expect(document.querySelector('#item2_keytip') !== null).toBe(true);   
                    expect((document.querySelector('#item2_keytip') as HTMLElement).innerText).toBe('C');
                    document.body.dispatchEvent((new KeyboardEvent('keydown',{altKey:true, key: 'Meta'})));  
                    expect(document.querySelector('#item2_keytip') === null).toBe(true);          
                    done();
                }, 1000);
            }, 1000);
        });
        it('for button items', (done) => {
            ribbon = new Ribbon({
                enableKeyTips: true,
                cssClass: 'oldCss',
                tabs: [{
                    id: "tab1",
                    header: "tab1",
                    keyTip: "T",
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
                                keyTip: "C",
                                buttonSettings: {
                                    content: 'button1',
                                    isToggle: true,
                                    iconCss: 'e-icons e-cut',
                                }
                            }]
                        }]
                    }]
                }, {
                    id: "tab2",
                    header: "tab2",
                    keyTip: "M",
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
                                keyTip: "E",
                                buttonSettings: {
                                    content: 'button2',
                                    iconCss: 'e-icons e-cut',
                                }
                            }]
                        }]
                    }]
                }]
            }, ribbonEle);
            setTimeout(() => {
                document.body.dispatchEvent((new KeyboardEvent('keydown',{altKey:true, key: 'Meta'})));
                document.body.dispatchEvent((new KeyboardEvent('keydown',{'key':'t'})));
                setTimeout(() => {
                    expect(document.querySelector('.e-ribbon-keytip') !== null).toBe(true);   
                    document.body.dispatchEvent((new KeyboardEvent('keydown',{'key':'c'})));
                    expect(ribbon.element.querySelector('#item1').classList.contains('e-active')).toBe(true);
                    expect(document.querySelector('.e-ribbon-keytip') === null).toBe(true);
                    done();
                }, 1000);                
            }, 1000);                                     
        });
        it('for dropdown button', () => {
            ribbon = new Ribbon({
                enableKeyTips: true,
                cssClass: 'oldCss',
                tabs: [{
                    id: "tab1",
                    header: "tab1",
                    keyTip: "T",
                    groups: [{
                        id: "group1",
                        header: "group1Header",
                        orientation: ItemOrientation.Row,
                        collections: [{
                            id: "collection1",
                            items: [{
                                id: "item1",
                                keyTip: "C",
                                type: RibbonItemType.DropDown,
                                allowedSizes: RibbonItemSize.Medium,
                                dropDownSettings: {
                                    content: 'Header',
                                    items: [{ text: 'Insert Header' }, { text: 'Edit Header' }, { text: 'Remove Header' }]
                                }
                            }]
                        }]
                    }]
                }, {
                    id: "tab2",
                    header: "tab2",
                    keyTip: "M",
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
                                keyTip: "E",
                                buttonSettings: {
                                    content: 'button2',
                                    iconCss: 'e-icons e-cut',
                                }
                            }]
                        }]
                    }]
                }]
            }, ribbonEle);
            document.body.dispatchEvent((new KeyboardEvent('keydown',{altKey:true, key: 'Meta'})));
            document.body.dispatchEvent((new KeyboardEvent('keydown',{'key':'t'})));
            expect(document.querySelector('.e-ribbon-keytip') !== null).toBe(true);  
            document.body.dispatchEvent((new KeyboardEvent('keydown',{'key':'c'})));
            expect(document.querySelector('#item1-popup').classList.contains('e-popup-open')).toBe(true); 
            expect(document.querySelector('.e-ribbon-keytip') === null).toBe(true); 
        });
        it('for split button', () => {
            ribbon = new Ribbon({
                enableKeyTips: true,
                cssClass: 'oldCss',
                tabs: [{
                    id: "tab1",
                    header: "tab1",
                    keyTip: "T",
                    groups: [{
                        id: "group1",
                        header: "group1Header",
                        orientation: ItemOrientation.Row,
                        collections: [{
                            id: "collection1",
                            items: [{
                                id: "item1",
                                keyTip: "C",
                                type: RibbonItemType.SplitButton,
                                allowedSizes: RibbonItemSize.Large,
                                splitButtonSettings: {
                                    content: 'Header',
                                    items: [{ text: 'Insert Header', id:  'insert'}, { text: 'Edit Header' }, { text: 'Remove Header' }]
                                }
                            }]
                        }]
                    }]
                }, {
                    id: "tab2",
                    header: "tab2",
                    keyTip: "M",
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
                                keyTip: "E",
                                buttonSettings: {
                                    content: 'button2',
                                    iconCss: 'e-icons e-cut',
                                }
                            }]
                        }]
                    }]
                }]
            }, ribbonEle);
            document.body.dispatchEvent((new KeyboardEvent('keydown',{altKey:true, key: 'Meta'})));
            document.body.dispatchEvent((new KeyboardEvent('keydown',{'key':'t'})));
            expect(document.querySelector('.e-ribbon-keytip') !== null).toBe(true); 
            expect(document.querySelector('#item1_keytip') !== null).toBe(true); 
            document.body.dispatchEvent((new KeyboardEvent('keydown',{'key':'c'})));
            expect(document.querySelector('#item1_keytip') === null).toBe(true);
            expect(document.querySelector('#item1_dropdownbtn-popup').classList.contains('e-popup-open')).toBe(true);
        });
        it('for combobox', (done) => {
            ribbon = new Ribbon({
                enableKeyTips: true,
                cssClass: 'oldCss',
                tabs: [{
                    id: "tab1",
                    header: "tab1",
                    keyTip: "T",
                    groups: [{
                        id: "group1",
                        header: "group1Header",
                        orientation: ItemOrientation.Row,
                        collections: [{
                            id: "collection1",
                            items: [{
                                id: "item1",
                                keyTip: "C",
                                type: RibbonItemType.ComboBox,
                                comboBoxSettings: {
                                    dataSource: sportsData,
                                    index: 1
                                }
                            }]
                        }]
                    }]
                }, {
                    id: "tab2",
                    header: "tab2",
                    keyTip: "M",
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
                                keyTip: "E",
                                buttonSettings: {
                                    content: 'button2',
                                    iconCss: 'e-icons e-cut',
                                }
                            }]
                        }]
                    }]
                }]
            }, ribbonEle);
            document.body.dispatchEvent((new KeyboardEvent('keydown',{altKey:true, key: 'Meta'})));
            document.body.dispatchEvent((new KeyboardEvent('keydown',{'key':'t'})));
            expect(document.querySelector('#item1_keytip') !== null).toBe(true);  
            expect(ribbon.element.querySelector('#item1').closest('.e-ddl').classList.contains('e-input-focus')).toBe(false);
            setTimeout(() => {
                document.body.dispatchEvent((new KeyboardEvent('keydown',{'key':'c'})));
                setTimeout(() => {
                    expect(ribbon.element.querySelector('#item1').closest('.e-ddl').classList.contains('e-input-focus')).toBe(true);
                    expect(document.querySelector('#item1_keytip') === null).toBe(true); 
                    done();
                }, 1000);
            }, 1000);
        });
        it('for checkbox', () => {
            ribbon = new Ribbon({
                enableKeyTips: true,
                cssClass: 'oldCss',
                tabs: [{
                    id: "tab1",
                    header: "tab1",
                    keyTip: "T",
                    groups: [{
                        id: "group1",
                        header: "group1Header",
                        orientation: ItemOrientation.Row,
                        collections: [{
                            id: "collection1",
                            items: [{
                                id: "item1",
                                keyTip: "C",
                                type: RibbonItemType.CheckBox,
                                checkBoxSettings: {
                                    label: 'Check1',
                                    checked: false,
                                }
                            }]
                        }]
                    }]
                }, {
                    id: "tab2",
                    header: "tab2",
                    keyTip: "M",
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
                                keyTip: "E",
                                buttonSettings: {
                                    content: 'button2',
                                    iconCss: 'e-icons e-cut',
                                }
                            }]
                        }]
                    }]
                }]
            }, ribbonEle);
            document.body.dispatchEvent((new KeyboardEvent('keydown',{altKey:true, key: 'Meta'})));
            document.body.dispatchEvent((new KeyboardEvent('keydown',{'key':'t'})));
            expect(document.querySelector('#item1_keytip') !== null).toBe(true);
            document.body.dispatchEvent((new KeyboardEvent('keydown',{'key':'c'})));
            expect((ribbon.element.querySelector('#item1').parentElement.querySelector('.e-frame') as HTMLElement).classList.contains('e-check')).toBe(true);
            expect(document.querySelector('#item1_keytip') === null).toBe(true); 
        });
        it('for gallery', () => {
            ribbon = new Ribbon({
                enableKeyTips: true,
                cssClass: 'oldCss',
                tabs: [{
                    id: "tab1",
                    header: "tab1",
                    keyTip: "T",
                    groups: [{
                        id: "group1",
                        header: "group1Header",
                        orientation: ItemOrientation.Row,
                        collections: [{
                            id: "collection1",
                            items: [{
                                type: RibbonItemType.Gallery,
                                keyTip: 'GY',
                                gallerySettings: {
                                    itemCount: 3,
                                    groups: [{
                                        itemWidth: '100',
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
                                        itemWidth: '100',
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
                }, {
                    id: "tab2",
                    header: "tab2",
                    keyTip: "M",
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
                                keyTip: "E",
                                buttonSettings: {
                                    content: 'button2',
                                    iconCss: 'e-icons e-cut',
                                }
                            }]
                        }]
                    }]
                }]
            }, ribbonEle);
            document.body.dispatchEvent((new KeyboardEvent('keydown',{altKey:true, key: 'Meta'})));
            document.body.dispatchEvent((new KeyboardEvent('keydown',{'key':'t'})));
            expect(document.querySelector('#collection1_item0_popupButton_keytip') !== null).toBe(true);
            document.body.dispatchEvent((new KeyboardEvent('keydown',{'key':'gy'})));
            expect(ribbon.element.querySelector('#collection1_item0_popupButton').classList.contains('e-gallery-button-active')).toBe(true);
            expect(document.querySelector('#collection1_item0_popupButton_keytip') === null).toBe(true);
            triggerMouseEvent(document.body, 'mousedown');
        });
        it('for template', () => {
            let template1 = '<button id="btn1" class="tempContent">Button1</button>';
            ribbon = new Ribbon({
                enableKeyTips: true,
                cssClass: 'oldCss',
                tabs: [{
                    id: "tab1",
                    header: "tab1",
                    keyTip: "T",
                    groups: [{
                        id: "group1",
                        header: "group1Header",
                        orientation: ItemOrientation.Row,
                        collections: [{
                            id: "collection1",
                            items: [{
                                id: "item1",
                                type: RibbonItemType.Template,
                                keyTip: "C",
                                itemTemplate: template1
                            }]
                        }]
                    }]
                }, {
                    id: "tab2",
                    header: "tab2",
                    keyTip: "M",
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
                                keyTip: "E",
                                buttonSettings: {
                                    content: 'button2',
                                    iconCss: 'e-icons e-cut',
                                }
                            }]
                        }]
                    }]
                }]
            }, ribbonEle);
            document.body.dispatchEvent((new KeyboardEvent('keydown',{altKey:true, key: 'Meta'})));
            document.body.dispatchEvent((new KeyboardEvent('keydown',{'key':'t'})));
            expect(document.querySelector('.e-ribbon-keytip') !== null).toBe(true);
            document.body.dispatchEvent((new KeyboardEvent('keydown',{'key':'c'})));
            expect(document.querySelector('.e-ribbon-keytip') === null).toBe(true);
        });
        it('for launcher icon', () => {
            let isLauncherIconClicked: boolean = false;
            ribbon = new Ribbon({
                enableKeyTips: true,
                cssClass: 'oldCss',
                tabs: [{
                    id: "tab1",
                    header: "tab1",
                    keyTip: "T",
                    groups: [{
                        id: "group1",
                        showLauncherIcon: true,
                        header: "group1Header",
                        launcherIconKeyTip: "L0",
                        orientation: ItemOrientation.Row,
                        collections: [{
                            id: "collection1",
                            items: [{
                                id: "item1",
                                keyTip: "C",
                                type: RibbonItemType.CheckBox,
                                checkBoxSettings: {
                                    label: 'Check1',
                                    checked: false,
                                }
                            }]
                        }]
                    }]
                }, {
                    id: "tab2",
                    header: "tab2",
                    keyTip: "M",
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
                                keyTip: "E",
                                buttonSettings: {
                                    content: 'button2',
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
            document.body.dispatchEvent((new KeyboardEvent('keydown',{altKey:true, key: 'Meta'})));
            document.body.dispatchEvent((new KeyboardEvent('keydown',{'key':'t'})));
            expect(document.querySelector('#item1_keytip') !== null).toBe(true);
            expect(document.querySelector('#group1_launcher_keytip') !== null).toBe(true);
            document.body.dispatchEvent((new KeyboardEvent('keydown',{'key':'l0'})));
            expect(isLauncherIconClicked).toBe(true);
            expect(document.querySelector('#item1_keytip') === null).toBe(true); 
            expect(document.querySelector('#group1_launcher_keytip') === null).toBe(true);
        });
        it('for color picker', () => {
            ribbon = new Ribbon({
                enableKeyTips: true,
                cssClass: 'oldCss',
                tabs: [{
                    id: "tab1",
                    header: "tab1",
                    keyTip: "T",
                    groups: [{
                        id: "group1",
                        header: "group1Header",
                        orientation: ItemOrientation.Row,
                        collections: [{
                            id: "collection1",
                            items: [{
                                id: "item1",
                                keyTip: "C",
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
                    keyTip: "M",
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
                                keyTip: "E",
                                buttonSettings: {
                                    content: 'button2',
                                    iconCss: 'e-icons e-cut',
                                }
                            }]
                        }]
                    }]
                }]
            }, ribbonEle);
            document.body.dispatchEvent((new KeyboardEvent('keydown',{altKey:true, key: 'Meta'})));
            document.body.dispatchEvent((new KeyboardEvent('keydown',{'key':'t'})));
            expect(document.querySelector('#item1_keytip') !== null).toBe(true);   
            document.body.dispatchEvent((new KeyboardEvent('keydown',{'key':'c'})));
            let splitBtn: HTMLElement = document.getElementById('item1').parentElement.querySelector('.e-split-colorpicker');
            let popup: HTMLElement = document.getElementById(splitBtn.id+'_dropdownbtn-popup');
            expect(popup.classList.contains('e-popup-open')).toBe(true);
            expect(document.querySelector('.e-ribbon-keytip') === null).toBe(true);
            (popup.querySelector('.e-apply') as HTMLElement).click();
        });
        it('for group button', () => {
            ribbon = new Ribbon({
                enableKeyTips: true,
                cssClass: 'oldCss',
                tabs: [{
                    id: "tab1",
                    header: "tab1",
                    keyTip: "T",
                    groups: [{
                        id: "group1",
                        header: "group1Header",
                        orientation: ItemOrientation.Row,
                        collections: [{
                            id: "collection1",
                            items: [{
                                id: "item1",
                                keyTip: "C",
                                type: RibbonItemType.GroupButton,
                                groupButtonSettings: {
                                    items: [{
                                        iconCss: 'e-icons e-table',
                                        content: 'table',
                                        keyTip: 'T1',
                                        selected: true
                                    },
                                    {
                                        iconCss: 'e-icons e-image',
                                        content: 'picture',
                                        keyTip: 'P1'
                                    },
                                    {
                                        iconCss: 'e-icons e-menu',
                                        content: 'menu',
                                        keyTip: 'M1'
                                    }]
                                }
                            }]
                        }]
                    }]
                }, {
                    id: "tab2",
                    header: "tab2",
                    keyTip: "M",
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
                                keyTip: "E",
                                buttonSettings: {
                                    content: 'button2',
                                    iconCss: 'e-icons e-cut',
                                }
                            }]
                        }]
                    }]
                }]
            }, ribbonEle);
            document.body.dispatchEvent((new KeyboardEvent('keydown',{altKey:true, key: 'Meta'})));
            document.body.dispatchEvent((new KeyboardEvent('keydown',{'key':'t'})));
            expect(document.querySelector('#item1_grpbtn0').classList.contains('e-active')).toBe(true);
            expect(document.querySelector('#item1_grpbtn1').classList.contains('e-active')).toBe(false);
            expect(document.querySelector('#item1_grpbtn2').classList.contains('e-active')).toBe(false);
            expect(document.querySelector('#item1_grpbtn0_keytip') !== null).toBe(true);
            expect(document.querySelector('#item1_grpbtn1_keytip') !== null).toBe(true);
            expect(document.querySelector('#item1_grpbtn2_keytip') !== null).toBe(true);
            document.body.dispatchEvent((new KeyboardEvent('keydown',{'key':'m1'})));
            expect(document.querySelector('#item1_grpbtn0_keytip') === null).toBe(true);
            expect(document.querySelector('#item1_grpbtn1_keytip') === null).toBe(true);
            expect(document.querySelector('#item1_grpbtn2_keytip') === null).toBe(true);
            expect(document.querySelector('#item1_grpbtn0').classList.contains('e-active')).toBe(false);
            expect(document.querySelector('#item1_grpbtn1').classList.contains('e-active')).toBe(false);
            expect(document.querySelector('#item1_grpbtn2').classList.contains('e-active')).toBe(true);
            ribbon.activeLayout = 'Simplified';
            ribbon.dataBind();
            document.body.dispatchEvent((new KeyboardEvent('keydown',{altKey:true, key: 'Meta'})));
            document.body.dispatchEvent((new KeyboardEvent('keydown',{'key':'t'})));
            expect(document.querySelector('#item1_keytip') !== null).toBe(true);
            expect((document.querySelector('#item1_keytip') as HTMLElement).innerText).toBe('C');
            document.body.dispatchEvent((new KeyboardEvent('keydown',{'key':'c'})));
            expect(document.querySelector('#item1_keytip') === null).toBe(true);
            expect(document.querySelector('#item1_grpbtn0_keytip') !== null).toBe(true);
            expect(document.querySelector('#item1_grpbtn1_keytip') !== null).toBe(true);
            expect(document.querySelector('#item1_grpbtn2_keytip') !== null).toBe(true);
        });
        it('for collapse button', () => {
            ribbon = new Ribbon({
                enableKeyTips: true,
                layoutSwitcherKeyTip: 'ZR',
                cssClass: 'oldCss',
                tabs: [{
                    id: "tab1",
                    header: "tab1",
                    keyTip: "T",
                    groups: [{
                        id: "group1",
                        header: "group1Header",
                        showLauncherIcon: true,
                        orientation: ItemOrientation.Row,
                        collections: [{
                            id: "collection1",
                            items: [{
                                id: "item1",
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Large,
                                keyTip: "C",
                                buttonSettings: {
                                    content: 'button1',
                                    isToggle: true,
                                    iconCss: 'e-icons e-cut',
                                }
                            }]
                        }]
                    }]
                }, {
                    id: "tab2",
                    header: "tab2",
                    keyTip: "M",
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
                                keyTip: "E",
                                buttonSettings: {
                                    content: 'button2',
                                    iconCss: 'e-icons e-cut',
                                }
                            }]
                        }]
                    }]
                }]
            }, ribbonEle);
            document.body.dispatchEvent((new KeyboardEvent('keydown',{altKey:true, key: 'Meta'})));
            expect(document.querySelector('#ribbon_tab_collapsebutton_keytip') !== null).toBe(true);
            document.body.dispatchEvent((new KeyboardEvent('keydown',{'key':'z'})));
            document.body.dispatchEvent((new KeyboardEvent('keydown',{'key':'r'})));
            expect(document.querySelector('#ribbon_tab_collapsebutton').classList.contains('e-ribbon-expand-btn')).toBe(true);                           
        });    
        it('removes for tab when Esc key pressed', () => {
            ribbon = new Ribbon({
                enableKeyTips: true,
                cssClass: 'oldCss',
                tabs: [{
                    id: "tab1",
                    header: "tab1",
                    keyTip: "T",
                    groups: [{
                        id: "group1",
                        header: "group1Header",
                        showLauncherIcon: true,
                        orientation: ItemOrientation.Row,
                        collections: [{
                            id: "collection1",
                            items: [{
                                id: "item1",
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Large,
                                keyTip: "C",
                                buttonSettings: {
                                    content: 'button1',
                                    isToggle: true,
                                    iconCss: 'e-icons e-cut',
                                }
                            }]
                        }]
                    }]
                }, {
                    id: "tab2",
                    header: "tab2",
                    keyTip: "M",
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
                                keyTip: "E",
                                buttonSettings: {
                                    content: 'button2',
                                    iconCss: 'e-icons e-cut',
                                }
                            }]
                        }]
                    }]
                }]
            }, ribbonEle);
            document.body.dispatchEvent((new KeyboardEvent('keydown',{altKey:true, key: 'Meta'})));
            expect(document.querySelector('.e-ribbon-keytip') !== null).toBe(true);
            document.body.dispatchEvent((new KeyboardEvent('keydown',{'key':'Escape'})));
            expect(document.querySelector('.e-ribbon-keytip') === null).toBe(true);                           
        });
        it('removes in mouse click', () => {
            ribbon = new Ribbon({
                enableKeyTips: true,
                cssClass: 'oldCss',
                tabs: [{
                    id: "tab1",
                    header: "tab1",
                    keyTip: "T",
                    groups: [{
                        id: "group1",
                        header: "group1Header",
                        showLauncherIcon: true,
                        orientation: ItemOrientation.Row,
                        collections: [{
                            id: "collection1",
                            items: [{
                                id: "item1",
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Large,
                                keyTip: "C",
                                buttonSettings: {
                                    content: 'button1',
                                    isToggle: true,
                                    iconCss: 'e-icons e-cut',
                                }
                            }]
                        }]
                    }]
                }, {
                    id: "tab2",
                    header: "tab2",
                    keyTip: "M",
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
                                keyTip: "E",
                                buttonSettings: {
                                    content: 'button2',
                                    iconCss: 'e-icons e-cut',
                                }
                            }]
                        }]
                    }]
                }]
            }, ribbonEle);
            document.body.dispatchEvent((new KeyboardEvent('keydown',{altKey:true, key: 'Meta'})));
            expect(document.querySelector('.e-ribbon-keytip') !== null).toBe(true);
            triggerMouseEvent(document.body, 'mousedown');
            expect(document.querySelector('.e-ribbon-keytip') === null).toBe(true);                           
        });
        it('removes in mouse scroll', () => {
            ribbon = new Ribbon({
                enableKeyTips: true,
                cssClass: 'oldCss',
                tabs: [{
                    id: "tab1",
                    header: "tab1",
                    keyTip: "T",
                    groups: [{
                        id: "group1",
                        header: "group1Header",
                        showLauncherIcon: true,
                        orientation: ItemOrientation.Row,
                        collections: [{
                            id: "collection1",
                            items: [{
                                id: "item1",
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Large,
                                keyTip: "C",
                                buttonSettings: {
                                    content: 'button1',
                                    isToggle: true,
                                    iconCss: 'e-icons e-cut',
                                }
                            }]
                        }]
                    }]
                }, {
                    id: "tab2",
                    header: "tab2",
                    keyTip: "M",
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
                                keyTip: "E",
                                buttonSettings: {
                                    content: 'button2',
                                    iconCss: 'e-icons e-cut',
                                }
                            }]
                        }]
                    }]
                }]
            }, ribbonEle);
            document.body.dispatchEvent((new KeyboardEvent('keydown',{altKey:true, key: 'Meta'})));
            expect(document.querySelector('.e-ribbon-keytip') !== null).toBe(true);
            triggerMouseEvent(document.body, 'scroll');
            expect(document.querySelector('.e-ribbon-keytip') === null).toBe(true);                           
        });
        it('removes for items and keytip created for tabs when Esc key pressed', () => {
            ribbon = new Ribbon({
                enableKeyTips: true,
                layoutSwitcherKeyTip: 'ZR',
                cssClass: 'oldCss',
                tabs: [{
                    id: "tab1",
                    header: "tab1",
                    keyTip: "T",
                    groups: [{
                        id: "group1",
                        header: "group1Header",
                        showLauncherIcon: true,
                        orientation: ItemOrientation.Row,
                        collections: [{
                            id: "collection1",
                            items: [{
                                id: "item1",
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Large,
                                keyTip: "C",
                                buttonSettings: {
                                    content: 'button1',
                                    isToggle: true,
                                    iconCss: 'e-icons e-cut',
                                }
                            }]
                        }]
                    }]
                }, {
                    id: "tab2",
                    header: "tab2",
                    keyTip: "M",
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
                                keyTip: "E",
                                buttonSettings: {
                                    content: 'button2',
                                    iconCss: 'e-icons e-cut',
                                }
                            }]
                        }]
                    }]
                }]
            }, ribbonEle);
            document.body.dispatchEvent((new KeyboardEvent('keydown',{altKey:true, key: 'Meta'})));                
            expect(document.querySelector('#tab1_keytip') !== null).toBe(true);
            expect(document.querySelector('#tab2_keytip') !== null).toBe(true);
            expect(document.querySelector('#ribbon_tab_collapsebutton_keytip') !== null).toBe(true);
            document.body.dispatchEvent((new KeyboardEvent('keydown',{'key':'t'})));
            expect(document.querySelector('#tab1_keytip') === null).toBe(true);
            expect(document.querySelector('#tab2_keytip') === null).toBe(true);
            expect(document.querySelector('#ribbon_tab_collapsebutton_keytip') === null).toBe(true);
            expect(document.querySelector('#item1_keytip') !== null).toBe(true);   
            document.body.dispatchEvent((new KeyboardEvent('keydown',{'key':'Escape'})));
            expect(document.querySelector('#item1_keytip') === null).toBe(true);
            expect(document.querySelector('#tab1_keytip') !== null).toBe(true);
            expect(document.querySelector('#tab2_keytip') !== null).toBe(true);
            expect(document.querySelector('#ribbon_tab_collapsebutton_keytip') !== null).toBe(true);
            document.body.dispatchEvent((new KeyboardEvent('keydown',{'key':'Escape'})));
            expect(document.querySelector('#tab1_keytip') === null).toBe(true);
            expect(document.querySelector('#tab2_keytip') === null).toBe(true);
            expect(document.querySelector('#ribbon_tab_collapsebutton_keytip') === null).toBe(true);
        });
        it('removes for popup items and keytip created for items when Esc key pressed', () => {
            ribbon = new Ribbon({
                enableKeyTips: true,
                cssClass: 'oldCss',
                tabs: [{
                    id: "tab1",
                    header: "tab1",
                    keyTip: "T",
                    groups: [{
                        id: "group1",
                        header: "group1Header",
                        keyTip: "G1",
                        showLauncherIcon: true,
                        orientation: ItemOrientation.Row,
                        collections: [{
                            id: "collection1",
                            items: [{
                                id: "item1",
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Large,
                                keyTip: "C",
                                buttonSettings: {
                                    content: 'button1',
                                    isToggle: true,
                                    iconCss: 'e-icons e-cut',
                                }
                            }]
                        }]
                    },{
                        id: "group2",
                        header: "group2Header",
                        keyTip: "G2",
                        orientation: ItemOrientation.Row,
                        collections: [{
                            id: "collection2",
                            items: [{
                                id: "item2",
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Large,
                                keyTip: "D",
                                buttonSettings: {
                                    content: 'button2',
                                    isToggle: true,
                                    iconCss: 'e-icons e-copy',
                                }
                            }]
                        }]
                    },{
                        id: "group3",
                        header: "group3Header",
                        keyTip: "G3",
                        orientation: ItemOrientation.Row,
                        collections: [{
                            id: "collection3",
                            items: [{
                                id: "item3",
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Large,
                                keyTip: "E",
                                buttonSettings: {
                                    content: 'button3',
                                    isToggle: true,
                                    iconCss: 'e-icons e-paste',
                                }
                            }]
                        }]
                    }]
                }, {
                    id: "tab2",
                    header: "tab2",
                    keyTip: "M",
                    groups: [{
                        header: "group1Header",
                        orientation: ItemOrientation.Row,
                        collections: [{
                            items: [{
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Large,
                                keyTip: "E",
                                buttonSettings: {
                                    content: 'button2',
                                    iconCss: 'e-icons e-cut',
                                }
                            }]
                        }]
                    }]
                }]
            }, ribbonEle);
            containerEle.style.width = '200px';
            ribbon.refreshLayout();
            document.body.dispatchEvent((new KeyboardEvent('keydown',{altKey:true, key: 'Meta'})));
            expect(document.querySelector('#tab1_keytip') !== null).toBe(true);
            expect(document.querySelector('#tab2_keytip') !== null).toBe(true);
            document.body.dispatchEvent((new KeyboardEvent('keydown',{'key':'t'})));
            expect(document.querySelector('#tab1_keytip') === null).toBe(true);
            expect(document.querySelector('#tab2_keytip') === null).toBe(true);
            expect(document.querySelector('#group1_overflow_dropdown_keytip') !== null).toBe(true);
            document.body.dispatchEvent((new KeyboardEvent('keydown',{'key':'Escape'})));
            expect(document.querySelector('#tab1_keytip') !== null).toBe(true);
            expect(document.querySelector('#tab2_keytip') !== null).toBe(true);
            expect(document.querySelector('#group1_overflow_dropdown_keytip') === null).toBe(true);
            document.body.dispatchEvent((new KeyboardEvent('keydown',{'key':'t'})));
            expect(document.querySelector('#group1_overflow_dropdown_keytip') !== null).toBe(true);
            document.body.dispatchEvent((new KeyboardEvent('keydown',{'key':'g1'})));
            expect(document.querySelector('#group1_overflow_dropdown_keytip') === null).toBe(true);
            expect(document.querySelector('#item1_keytip') !== null).toBe(true);
            document.body.dispatchEvent((new KeyboardEvent('keydown', { 'key': 'Escape' })));
            expect(document.querySelector('#group1_overflow_dropdown_keytip') !== null).toBe(true);
            document.body.dispatchEvent((new KeyboardEvent('keydown',{altKey:true, key: 'Meta'})));
            expect(document.querySelector('#group1_overflow_dropdown_keytip') === null).toBe(true);
            ribbon.activeLayout = 'Simplified';
            ribbon.dataBind();
            document.body.dispatchEvent((new KeyboardEvent('keydown',{altKey:true, key: 'Meta'})));
            expect(document.querySelector('#tab1_keytip') !== null).toBe(true);
            expect(document.querySelector('#tab2_keytip') !== null).toBe(true);
            document.body.dispatchEvent((new KeyboardEvent('keydown',{'key':'t'})));
            expect(document.querySelector('#tab1_keytip') === null).toBe(true);
            expect(document.querySelector('#tab2_keytip') === null).toBe(true);
            expect(document.querySelector('#ribbon_tab_sim_ovrl_overflow_keytip') !== null).toBe(true);
            document.body.dispatchEvent((new KeyboardEvent('keydown',{ 'key': '00'})));
            expect(document.querySelector('#ribbon_tab_sim_ovrl_overflow_keytip') === null).toBe(true);
            expect(document.querySelector('#item3_keytip') !== null).toBe(true);
            expect(document.querySelector('#item2_keytip') !== null).toBe(true);
            document.body.dispatchEvent((new KeyboardEvent('keydown', { 'key': 'Escape' })));
            expect(document.querySelector('#ribbon_tab_sim_ovrl_overflow_keytip') !== null).toBe(true);
            triggerMouseEvent(document.body, 'mousedown');
        });
        it('for group orientation', () => {
            ribbon = new Ribbon({
                enableKeyTips: true,
                cssClass: 'oldCss',
                tabs: [{
                    id: "tab1",
                    header: "tab1",
                    keyTip: "T",
                    groups: [{
                        id: "group1",
                        header: "group1",
                        keyTip: "G1",
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
                    },
                    {
                        id: "group2",
                        header: "group2",
                        keyTip: "G2",
                        collections: [{
                            id: "collection2",
                            items: [{
                                id: "item2",
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Large,
                                buttonSettings: {
                                    content: 'button2',
                                    iconCss: 'e-icons e-copy',
                                }
                            }]
                        }]
                    },
                    {
                        id: "group3",
                        header: "group3",
                        keyTip: "G3",
                        groupIconCss: "e-icons e-paste",
                        orientation: ItemOrientation.Column,
                        priority: 1,
                        collections: [{
                            id: "collection3",
                            items: [{
                                id: "item3",
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Medium,
                                keyTip: "B",
                                buttonSettings: {
                                    content: 'button1',
                                    iconCss: 'e-icons e-cut',
                                }
                            },
                            {
                                id: "item4",
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Medium,
                                keyTip: "CT",
                                buttonSettings: {
                                    content: 'button2',
                                    iconCss: 'e-icons e-cut',
                                }
                            },
                            {
                                id: "item5",
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Medium,
                                keyTip: "CP",
                                buttonSettings: {
                                    content: 'button3',
                                    isToggle: true,
                                    iconCss: 'e-icons e-copy',
                                }
                            }]
                        }, {
                            id: "collection4",
                            items: [{
                                id: "item6",
                                type: RibbonItemType.DropDown,
                                allowedSizes: RibbonItemSize.Medium,
                                keyTip: "E",
                                dropDownSettings: {
                                    content: 'Edit',
                                    iconCss: 'e-icons e-edit',
                                    items: [{ text: 'Insert Header', id: 'popup1'}, { text: 'Edit Header' , id: 'popup2' }, { text: 'Remove Header', id: 'popup3' }]
                                }
                            },
                            {
                                id: "item7",
                                type: RibbonItemType.ColorPicker,
                                keyTip: "CO",
                                colorPickerSettings: {
                                    value: '#123456'
                                }
                            }]
                        }]
                    }]
                }, 
                {
                    id: "tab2",
                    header: "tab2",
                    keyTip: "A",
                    groups: [{
                        id: "group2",
                        header: "group1Header",
                        orientation: ItemOrientation.Row,
                        collections: [{
                            id: "collection2",
                            items: [{
                                id: "item8",
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Large,
                                buttonSettings: {
                                    content: 'button2',
                                    iconCss: 'e-icons e-cut',
                                }
                            }]
                        }]
                    }]
                }                
            ]
            }, ribbonEle);
            document.body.dispatchEvent((new KeyboardEvent('keydown',{altKey:true, key: 'Meta'})));
            document.body.dispatchEvent((new KeyboardEvent('keydown',{'key':'t'})));
            expect(document.querySelector('.e-ribbon-keytip') !== null).toBe(true);
            expect(document.querySelector('#item3_keytip') !== null).toBe(true);
            expect(document.querySelector('#item4_keytip') !== null).toBe(true);
            expect(document.querySelector('#item5_keytip') !== null).toBe(true);
            expect(document.querySelector('#item6_keytip') !== null).toBe(true);
            document.body.dispatchEvent((new KeyboardEvent('keydown',{'key':'c'})));
            document.body.dispatchEvent((new KeyboardEvent('keydown',{'key':'p'})));
            expect(ribbon.element.querySelector('#item5').classList.contains('e-active')).toBe(true);
            expect(document.querySelector('.e-ribbon-keytip') === null).toBe(true);
        });
        it('classic mode group overflow', () => {
            ribbon = new Ribbon({
                enableKeyTips: true,
                cssClass: 'oldCss',
                tabs: [{
                    id: "tab1",
                    header: "tab1",
                    keyTip: "T",
                    groups: [
                        {
                        id: "group1",
                        header: "group1",
                        launcherIconKeyTip: "L1",
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
                    },
                    {
                        id: "group2",
                        header: "group2",
                        launcherIconKeyTip: "L2",
                        collections: [{
                            id: "collection2",
                            items: [{
                                id: "item2",
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Large,
                                buttonSettings: {
                                    content: 'button2',
                                    iconCss: 'e-icons e-copy',
                                }
                            }]
                        }]
                    },
                    {
                        id: "group3",
                        header: "group3",
                        launcherIconKeyTip: "L3",
                        showLauncherIcon: true,
                        keyTip: "G",
                        groupIconCss: "e-icons e-paste",
                        orientation: ItemOrientation.Row,
                        priority: 1,
                        collections: [{
                            id: "collection3",
                            items: [{
                                id: "item3",
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Medium,
                                keyTip: "B",
                                buttonSettings: {
                                    content: 'button1',
                                    iconCss: 'e-icons e-cut',
                                }
                            },
                            {
                                id: "item4",
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Medium,
                                keyTip: "C",
                                buttonSettings: {
                                    content: 'button2',
                                    iconCss: 'e-icons e-cut',
                                }
                            }]
                        }, {
                            id: "collection4",
                            items: [{
                                id: "item5",
                                type: RibbonItemType.DropDown,
                                allowedSizes: RibbonItemSize.Medium,
                                keyTip: "E",
                                dropDownSettings: {
                                    content: 'Edit',
                                    iconCss: 'e-icons e-edit',
                                    items: [{ text: 'Insert Header', id: 'popup1' }, { text: 'Edit Header' , id: 'popup2' }, { text: 'Remove Header', id: 'popup3' }]
                                }
                            },
                            {
                                id: "item6",
                                type: RibbonItemType.ColorPicker,
                                keyTip: "CP",
                                colorPickerSettings: {
                                    value: '#123456'
                                }
                            }]
                        }]
                    },{
                        id: "group4",
                        header: "group4",
                        launcherIconKeyTip: "L4",
                        keyTip: 'O',
                        groupIconCss: 'e-icons e-cut',
                        priority: 1,
                        collections: [{
                            id: "collection5",
                            items: [{
                                id: "item7",
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Medium,
                                buttonSettings: {
                                    content: 'button1',
                                    iconCss: 'e-icons e-cut',
                                }
                            },
                            {
                                id: "item8",
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Medium,
                                buttonSettings: {
                                    content: 'button2',
                                    iconCss: 'e-icons e-cut',
                                }
                            }]
                        }, {
                            id: "collection6",
                            items: [{
                                id: "item9",
                                type: RibbonItemType.DropDown,
                                allowedSizes: RibbonItemSize.Medium,
                                dropDownSettings: {
                                    content: 'Edit',
                                    iconCss: 'e-icons e-edit',
                                    items: [{ text: 'Insert Header', id: 'popup1'}, { text: 'Edit Header' , id: 'popup2' }, { text: 'Remove Header', id: 'popup3' }]
                                }
                            },
                            {
                                id: "item10",
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
            containerEle.style.width = '300px';
            ribbon.refreshLayout();
            document.body.dispatchEvent((new KeyboardEvent('keydown',{altKey:true, key: 'Meta'})));
            expect(document.querySelector('.e-ribbon-keytip') !== null).toBe(true);
            document.body.dispatchEvent((new KeyboardEvent('keydown',{'key':'t'})));
            expect(document.querySelector('.e-ribbon-keytip') !== null).toBe(true);
            expect(document.querySelector('#group3_overflow_dropdown_keytip') !== null).toBe(true);
            expect(document.querySelector('#group4_overflow_dropdown_keytip') !== null).toBe(true);
            document.body.dispatchEvent((new KeyboardEvent('keydown',{'key':'g'})));
            expect(document.querySelector('#group3_overflow_dropdown-popup').classList.contains('e-popup-open')).toBe(true);
            expect(document.querySelector('#group3_overflow_dropdown_keytip') === null).toBe(true);
            expect(document.querySelector('#group4_overflow_dropdown_keytip') === null).toBe(true);
            expect(document.querySelector('#item3_keytip') !== null).toBe(true);
            expect(document.querySelector('#item4_keytip') !== null).toBe(true);
            expect(document.querySelector('#item5_keytip') !== null).toBe(true);
            expect(document.querySelector('#item6_keytip') !== null).toBe(true);
            document.body.dispatchEvent((new KeyboardEvent('keydown',{'key':'e'})));
            expect(document.querySelector('#item5-popup').classList.contains('e-popup-open')).toBe(true);
            document.body.dispatchEvent((new KeyboardEvent('keydown',{altKey:true, key: 'Meta'})));
            expect(document.querySelector('.e-ribbon-keytip') === null).toBe(true);
        });
        it('simplified mode group overflow button', () => {
            ribbon = new Ribbon({
                enableKeyTips: true,
                activeLayout: 'Simplified',
                cssClass: 'oldCss',
                tabs: [{
                    id: "tab1",
                    header: "tab1",
                    keyTip: "T",
                    groups: [{
                        id: "group1",
                        header: "group1",
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
                    },
                    {
                        id: "group2",
                        header: "group2",
                        collections: [{
                            id: "collection2",
                            items: [{
                                id: "item2",
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Large,
                                buttonSettings: {
                                    content: 'button2',
                                    iconCss: 'e-icons e-copy',
                                }
                            }]
                        }]
                    },
                    {
                        id: "group3",
                        header: "group3",
                        keyTip: "G",
                        enableGroupOverflow: true,
                        groupIconCss: "e-icons e-paste",
                        collections: [{
                            id: "collection3",
                            items: [{
                                id: "item3",
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Medium,
                                keyTip: "B",
                                buttonSettings: {
                                    content: 'button1',
                                    iconCss: 'e-icons e-cut',
                                }
                            },
                            {
                                id: "item4",
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Medium,
                                keyTip: "C",
                                buttonSettings: {
                                    content: 'button2',
                                    iconCss: 'e-icons e-cut',
                                }
                            }]
                        }, {
                            id: "collection4",
                            items: [{
                                id: "item5",
                                type: RibbonItemType.DropDown,
                                allowedSizes: RibbonItemSize.Medium,
                                keyTip: "E",
                                dropDownSettings: {
                                    content: 'Edit',
                                    iconCss: 'e-icons e-edit',
                                    items: [{ text: 'Insert Header', id: 'popup1' }, { text: 'Edit Header' , id: 'popup2' }, { text: 'Remove Header', id: 'popup3' }]
                                }
                            },
                            {
                                id: "item6",
                                type: RibbonItemType.ColorPicker,
                                keyTip: "CP",
                                colorPickerSettings: {
                                    value: '#123456'
                                }
                            }]
                        }]
                    },{
                        id: "group4",
                        header: "group4",
                        keyTip: 'O',
                        groupIconCss: 'e-icons e-cut',
                        priority: 1,
                        collections: [{
                            id: "collection5",
                            items: [{
                                id: "item7",
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Medium,
                                buttonSettings: {
                                    content: 'button1',
                                    iconCss: 'e-icons e-cut',
                                }
                            },
                            {
                                id: "item8",
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Medium,
                                buttonSettings: {
                                    content: 'button2',
                                    iconCss: 'e-icons e-cut',
                                }
                            }]
                        }, {
                            id: "collection6",
                            items: [{
                                id: "item9",
                                type: RibbonItemType.DropDown,
                                allowedSizes: RibbonItemSize.Medium,
                                dropDownSettings: {
                                    content: 'Edit',
                                    iconCss: 'e-icons e-edit',
                                    items: [{ text: 'Insert Header', id: 'popup1' }, { text: 'Edit Header' , id: 'popup2' }, { text: 'Remove Header', id: 'popup3' }]
                                }
                            },
                            {
                                id: "item10",
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
            containerEle.style.width = '300px';
            ribbon.refreshLayout();
            document.body.dispatchEvent((new KeyboardEvent('keydown',{altKey:true, key: 'Meta'})));
            document.body.dispatchEvent((new KeyboardEvent('keydown',{'key':'t'})));
            expect(document.querySelector('.e-ribbon-keytip') !== null).toBe(true);
            document.body.dispatchEvent((new KeyboardEvent('keydown',{'key':'03'})));              
            expect(document.querySelector('#item3_keytip') !== null).toBe(true);
            expect(document.querySelector('#item4_keytip') !== null).toBe(true);
            expect(document.querySelector('#item5_keytip') !== null).toBe(true);
            expect(document.querySelector('#item6_keytip') !== null).toBe(true);
            document.body.dispatchEvent((new KeyboardEvent('keydown',{'key':'b'})));
            expect(document.querySelector('#item3_keytip') === null).toBe(true);
            expect(document.querySelector('#item4_keytip') === null).toBe(true);
            expect(document.querySelector('#item5_keytip') === null).toBe(true);
            expect(document.querySelector('#item6_keytip') === null).toBe(true);
        });
        it('simplified mode overall overflow button', () => {
            ribbon = new Ribbon({
                enableKeyTips: true,
                activeLayout: 'Simplified',
                cssClass: 'oldCss',
                tabs: [{
                    id: "tab1",
                    header: "tab1",
                    keyTip: "T",
                    groups: [{
                        id: "group1",
                        header: "group1",
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
                    },
                    {
                        id: "group2",
                        header: "group2",
                        collections: [{
                            id: "collection2",
                            items: [{
                                id: "item2",
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Large,
                                buttonSettings: {
                                    content: 'button2',
                                    iconCss: 'e-icons e-copy',
                                }
                            }]
                        }]
                    },
                    {
                        id: "group3",
                        header: "group3",
                        keyTip: "G",
                        groupIconCss: "e-icons e-paste",
                        priority: 1,
                        collections: [{
                            id: "collection3",
                            items: [{
                                id: "item3",
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Medium,
                                keyTip: "B",
                                buttonSettings: {
                                    content: 'button1',
                                    iconCss: 'e-icons e-cut',
                                }
                            },
                            {
                                id: "item4",
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Medium,
                                keyTip: "C",
                                buttonSettings: {
                                    content: 'button2',
                                    iconCss: 'e-icons e-cut',
                                }
                            }]
                        }, {
                            id: "collection4",
                            items: [{
                                id: "item5",
                                type: RibbonItemType.DropDown,
                                allowedSizes: RibbonItemSize.Medium,
                                keyTip: "E",
                                dropDownSettings: {
                                    content: 'Edit',
                                    iconCss: 'e-icons e-edit',
                                    items: [{ text: 'Insert Header', id: 'popup1' }, { text: 'Edit Header' , id: 'popup2' }, { text: 'Remove Header', id: 'popup3' }]
                                }
                            },
                            {
                                id: "item6",
                                type: RibbonItemType.ColorPicker,
                                keyTip: "CP",
                                colorPickerSettings: {
                                    value: '#123456'
                                }
                            }]
                        }]
                    },{
                        id: "group4",
                        header: "group4",
                        keyTip: 'O',
                        groupIconCss: 'e-icons e-cut',
                        priority: 1,
                        collections: [{
                            id: "collection5",
                            items: [{
                                id: "item7",
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Medium,
                                buttonSettings: {
                                    content: 'button1',
                                    iconCss: 'e-icons e-cut',
                                }
                            },
                            {
                                id: "item8",
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Medium,
                                buttonSettings: {
                                    content: 'button2',
                                    iconCss: 'e-icons e-cut',
                                }
                            }]
                        }, {
                            id: "collection6",
                            items: [{
                                id: "item9",
                                type: RibbonItemType.DropDown,
                                allowedSizes: RibbonItemSize.Medium,
                                dropDownSettings: {
                                    content: 'Edit',
                                    iconCss: 'e-icons e-edit',
                                    items: [{ text: 'Insert Header', id: 'popup1' }, { text: 'Edit Header' , id: 'popup2' }, { text: 'Remove Header', id: 'popup3' }]
                                }
                            },
                            {
                                id: "item10",
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
            containerEle.style.width = '300px';
            ribbon.refreshLayout();
            document.body.dispatchEvent((new KeyboardEvent('keydown',{altKey:true, key: 'Meta'})));
            document.body.dispatchEvent((new KeyboardEvent('keydown',{'key':'t'})));
            expect(document.querySelector('.e-ribbon-keytip') !== null).toBe(true);
            document.body.dispatchEvent((new KeyboardEvent('keydown',{'key':'00'})));
            expect(document.querySelector('#item3_keytip') !== null).toBe(true);
            expect(document.querySelector('#item4_keytip') !== null).toBe(true);
            expect(document.querySelector('#item5_keytip') !== null).toBe(true);
            expect(document.querySelector('#item6_keytip') !== null).toBe(true);
            document.body.dispatchEvent((new KeyboardEvent('keydown',{'key':'b'})));
            expect(document.querySelector('#item3_keytip') === null).toBe(true);
            expect(document.querySelector('#item4_keytip') === null).toBe(true);
            expect(document.querySelector('#item5_keytip') === null).toBe(true);
            expect(document.querySelector('#item6_keytip') === null).toBe(true);
        });
        it('hide method', () => {
            ribbon = new Ribbon({
                enableKeyTips: true,
                layoutSwitcherKeyTip: 'L',
                cssClass: 'oldCss',
                tabs: [{
                    id: "tab1",
                    header: "tab1",
                    keyTip: "T",
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
            document.body.dispatchEvent((new KeyboardEvent('keydown',{altKey:true, key: 'Meta'})));
            expect(document.querySelector('.e-ribbon-keytip') !== null).toBe(true);
            expect(document.querySelector('#tab1_keytip') !== null).toBe(true);
            ribbon.ribbonKeyTipModule.hideKeyTips();
            expect(document.querySelector('.e-ribbon-keytip') === null).toBe(true);
            expect(document.querySelector('#tab1_keytip') === null).toBe(true);
        });
        it('show method', () => {
            let menuItems: BackstageItemModel[] = [
                {
                    id: 'item1',
                    text: 'Home',
                    iconCss: 'e-icons e-home',
                    content: '#homeCont',
                    keyTip: 'R'
                },
                {
                    id: 'item2',
                    text: 'New',
                    iconCss: 'e-icons e-file-new',
                    content: '#newCont',
                    keyTip: 'K'
                },
                {
                    id:'item3',
                    text: 'Open',
                    iconCss:'e-icons e-file',
                    content: '#openCont',
                    keyTip: 'O' 
                }
            ];
            ribbon = new Ribbon({
                enableKeyTips: true,
                backStageMenu: {
                    text: 'File',
                    keyTip: 'F',
                    visible: true,
                    items: menuItems,
                    backButton: {
                        text: 'Close',
                    }
                },
                layoutSwitcherKeyTip: 'L',
                cssClass: 'oldCss',
                tabs: [{
                    id: "tab1",
                    header: "tab1",
                    keyTip: "T",
                    groups: [{
                        id: "group1",
                        header: "group1Header",
                        orientation: ItemOrientation.Row,
                        collections: [{
                            id: "collection1",
                            items: [{
                                id: "item1",
                                type: RibbonItemType.Button,
                                keyTip: "B",
                                allowedSizes: RibbonItemSize.Large,
                                buttonSettings: {
                                    content: 'button1',
                                    iconCss: 'e-icons e-cut',
                                }
                            }]
                        },{
                            id: "collection2",
                            items: [{
                                id: "collection2item1",
                                type: RibbonItemType.Button,
                                keyTip: "D",
                                allowedSizes: RibbonItemSize.Large,
                                buttonSettings: {
                                    content: 'button1',
                                    iconCss: 'e-icons e-cut',
                                }
                            }]
                        }]
                    },
                    {
                        id: "group2",
                        header: "group2Header",
                        orientation: ItemOrientation.Row,
                        collections: [{
                            id: "group2collection1",
                            items: [{
                                id: "item2",
                                type: RibbonItemType.Button,
                                keyTip: "C",
                                allowedSizes: RibbonItemSize.Large,
                                buttonSettings: {
                                    content: 'button1',
                                    iconCss: 'e-icons e-cut',
                                }
                            }]
                        }]
                    },{
                        id: "group3",
                        header: "group3Header",
                        orientation: ItemOrientation.Row,
                        collections: [{
                            id: "group3collection1",
                            items: [{
                                id: "item3",
                                type: RibbonItemType.Button,
                                keyTip: "V",
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
                        id: "group11",
                        header: "group11Header",
                        orientation: ItemOrientation.Row,
                        collections: [{
                            id: "collection12",
                            items: [{
                                id: "item12",
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
            ribbon.ribbonKeyTipModule.showKeyTips();
            expect(document.querySelector('.e-ribbon-keytip') !== null).toBe(true);
            expect(document.querySelector('#tab1_keytip') !== null).toBe(true);
            expect(document.querySelector('#ribbon_backstage_keytip') !== null).toBe(true);
            expect(document.querySelector('#ribbon_tab_collapsebutton_keytip') !== null).toBe(true);
            triggerMouseEvent(document.body, 'mousedown');
            ribbon.ribbonKeyTipModule.showKeyTips('T');
            expect(document.querySelector('#item1_keytip') !== null).toBe(true);
            expect(document.querySelector('#collection2item1_keytip') !== null).toBe(true);
            expect(document.querySelector('#item2_keytip') !== null).toBe(true);
            expect(document.querySelector('#item3_keytip') !== null).toBe(true);
            triggerMouseEvent(document.body, 'mousedown');
            ribbon.ribbonKeyTipModule.showKeyTips('F');
            expect(document.querySelector('#item1_keytip') !== null).toBe(true);
            expect(document.querySelector('#item2_keytip') !== null).toBe(true);
            triggerMouseEvent(document.body, 'mousedown');
        });
        it('show method when items in different tabs', () => {
            let menuItems: BackstageItemModel[] = [
                {
                    id: 'item1Menu',
                    text: 'Home',
                    iconCss: 'e-icons e-home',
                    content: '#homeCont',
                    keyTip: 'R'
                },
                {
                    id: 'item2Menu',
                    text: 'New',
                    iconCss: 'e-icons e-file-new',
                    content: '#newCont',
                    keyTip: 'K'
                },
                {
                    id:'item3Menu',
                    text: 'Open',
                    iconCss:'e-icons e-file',
                    content: '#openCont',
                    keyTip: 'O' 
                }
            ];
            ribbon = new Ribbon({
                enableKeyTips: true,
                backStageMenu: {
                    text: 'File',
                    keyTip: 'F',
                    visible: true,
                    items: menuItems,
                    backButton: {
                        text: 'Close',
                    }
                },
                layoutSwitcherKeyTip: 'L',
                cssClass: 'oldCss',
                tabs: [{
                    id: "tab1",
                    header: "tab1",
                    keyTip: "T",
                    groups: [{
                        id: "group1",
                        header: "group1Header",
                        orientation: ItemOrientation.Row,
                        collections: [{
                            id: "collection1",
                            items: [{
                                id: "item1",
                                type: RibbonItemType.Button,
                                keyTip: "B",
                                allowedSizes: RibbonItemSize.Large,
                                buttonSettings: {
                                    content: 'button1',
                                    isToggle: true,
                                    iconCss: 'e-icons e-cut',
                                }
                            }]
                        },{
                            id: "collection2",
                            items: [{
                                id: "collection2item1",
                                type: RibbonItemType.Button,
                                keyTip: "D",
                                allowedSizes: RibbonItemSize.Large,
                                buttonSettings: {
                                    content: 'button1',
                                    iconCss: 'e-icons e-cut',
                                }
                            }]
                        }]
                    },
                    {
                        id: "group2",
                        header: "group2Header",
                        orientation: ItemOrientation.Row,
                        collections: [{
                            id: "group2collection1",
                            items: [{
                                id: "item2",
                                type: RibbonItemType.Button,
                                keyTip: "C",
                                allowedSizes: RibbonItemSize.Large,
                                buttonSettings: {
                                    content: 'button1',
                                    iconCss: 'e-icons e-cut',
                                }
                            }]
                        }]
                    },{
                        id: "group3",
                        header: "group3Header",
                        orientation: ItemOrientation.Row,
                        collections: [{
                            id: "group3collection1",
                            items: [{
                                id: "item3",
                                type: RibbonItemType.Button,
                                keyTip: "V",
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
                        id: "group11",
                        header: "group11Header",
                        orientation: ItemOrientation.Row,
                        collections: [{
                            id: "collection12",
                            items: [{
                                id: "item12",
                                keyTip: "E",
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
            ribbon.ribbonKeyTipModule.showKeyTips('B');
            expect(document.querySelector('#item1').classList.contains('e-active')).toBe(true);
            ribbon.ribbonKeyTipModule.showKeyTips('R');
            document.querySelector('.e-ribbon-backstage-popup').classList.contains('e-popup-open');
        });
        it('show method when overflow items and launcher icon in different tabs', () => {
            let isLauncherIconClicked: boolean = false;
            let menuItems: BackstageItemModel[] = [
                {
                    id: 'item1Menu',
                    text: 'Home',
                    iconCss: 'e-icons e-home',
                    content: '#homeCont',
                    keyTip: 'R'
                },
                {
                    id: 'item2Menu',
                    text: 'New',
                    iconCss: 'e-icons e-file-new',
                    content: '#newCont',
                    keyTip: 'K'
                },
                {
                    id:'item3Menu',
                    text: 'Open',
                    iconCss:'e-icons e-file',
                    content: '#openCont',
                    keyTip: 'O' 
                }
            ];
            ribbon = new Ribbon({
                enableKeyTips: true,
                backStageMenu: {
                    text: 'File',
                    keyTip: 'F',
                    visible: true,
                    items: menuItems,
                    backButton: {
                        text: 'Close',
                    }
                },
                layoutSwitcherKeyTip: 'L',
                cssClass: 'oldCss',
                tabs: [{
                    id: "tab1",
                    header: "tab1",
                    keyTip: "T",
                    groups: [{
                        id: "group1",
                        header: "group1Header",
                        orientation: ItemOrientation.Row,
                        launcherIconKeyTip: 'L1',
                        showLauncherIcon: true,
                        keyTip: 'OV',
                        collections: [{
                            id: "collection1",
                            items: [{
                                id: "item1",
                                type: RibbonItemType.Button,
                                keyTip: "B",
                                allowedSizes: RibbonItemSize.Large,
                                buttonSettings: {
                                    content: 'button1',
                                    isToggle: true,
                                    iconCss: 'e-icons e-cut',
                                }
                            }]
                        },{
                            id: "collection2",
                            items: [{
                                id: "collection2item1",
                                type: RibbonItemType.Button,
                                keyTip: "D",
                                allowedSizes: RibbonItemSize.Large,
                                buttonSettings: {
                                    content: 'button1',
                                    iconCss: 'e-icons e-cut',
                                }
                            }]
                        }]
                    },
                    {
                        id: "group2",
                        header: "group2Header",
                        orientation: ItemOrientation.Row,
                        collections: [{
                            id: "group2collection1",
                            items: [{
                                id: "item2",
                                type: RibbonItemType.Button,
                                keyTip: "C",
                                allowedSizes: RibbonItemSize.Large,
                                buttonSettings: {
                                    content: 'button1',
                                    isToggle: true,
                                    iconCss: 'e-icons e-cut',
                                }
                            }]
                        }]
                    },{
                        id: "group3",
                        header: "group3Header",
                        orientation: ItemOrientation.Row,
                        enableGroupOverflow: true,
                        collections: [{
                            id: "group3collection1",
                            items: [{
                                id: "item3",
                                type: RibbonItemType.Button,
                                keyTip: "V",
                                allowedSizes: RibbonItemSize.Large,
                                buttonSettings: {
                                    content: 'button1',
                                    isToggle: true,
                                    iconCss: 'e-icons e-cut',
                                }
                            }]
                        }]
                    }]
                }, {
                    id: "tab2",
                    header: "tab2",
                    groups: [{
                        id: "group11",
                        header: "group11Header",
                        orientation: ItemOrientation.Row,
                        collections: [{
                            id: "collection12",
                            items: [{
                                id: "item12",
                                keyTip: "E",
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
                launcherIconClick: (args: LauncherClickEventArgs) => {
                    isLauncherIconClicked = true;
                },
            }, ribbonEle);
            ribbon.ribbonKeyTipModule.showKeyTips('L1');
            expect(isLauncherIconClicked).toBe(true);
            ribbon.activeLayout = 'Simplified';
            ribbon.dataBind();
            containerEle.style.width = '300px';
            ribbon.refreshLayout();
            ribbon.ribbonKeyTipModule.showKeyTips('03');
            expect(document.querySelector('#group3_sim_grp_overflow-popup').classList.contains('e-popup-open')).toBe(true);
            triggerMouseEvent(document.body, 'mousedown');
            expect(document.querySelector('#group3_sim_grp_overflow-popup').classList.contains('e-popup-open')).toBe(false);
            ribbon.ribbonKeyTipModule.showKeyTips('00');
            expect(document.querySelector('#ribbon_tab_sim_ovrl_overflow-popup').classList.contains('e-popup-open')).toBe(true);
            triggerMouseEvent(document.body, 'mousedown');
            expect(document.querySelector('#ribbon_tab_sim_ovrl_overflow-popup').classList.contains('e-popup-open')).toBe(false);
            expect(document.querySelector('#item3').classList.contains('e-active')).toBe(false);
            ribbon.ribbonKeyTipModule.showKeyTips('V');
            expect(document.querySelector('#item3').classList.contains('e-active')).toBe(true);
            expect(document.querySelector('#item2').classList.contains('e-active')).toBe(false);
            ribbon.ribbonKeyTipModule.showKeyTips('C');
            expect(document.querySelector('#item2').classList.contains('e-active')).toBe(true);
            isLauncherIconClicked = false;
            ribbon.activeLayout = 'Classic';
            ribbon.dataBind();
            containerEle.style.width = '200px';
            ribbon.refreshLayout();
            ribbon.ribbonKeyTipModule.showKeyTips('V');
            expect(document.querySelector('#item3').classList.contains('e-active')).toBe(false);
            expect(document.querySelector('#group1_overflow_dropdown-popup').classList.contains('e-popup-open')).toBe(false);
            ribbon.ribbonKeyTipModule.showKeyTips('OV');
            expect(document.querySelector('#group1_overflow_dropdown-popup').classList.contains('e-popup-open')).toBe(true);
            triggerMouseEvent(document.body, 'mousedown');
            expect(document.querySelector('#group1_overflow_dropdown-popup').classList.contains('e-popup-open')).toBe(false);
        });
    });
});