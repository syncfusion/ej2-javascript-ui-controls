import { createElement, isNullOrUndefined, remove } from "@syncfusion/ej2-base";
import { ItemModel } from "@syncfusion/ej2-splitbuttons";
import { ItemOrientation, Ribbon, RibbonItemSize, RibbonItemType } from "../../src/ribbon/base/index";
import { getMemoryProfile, inMB, profile } from "./common.spec";
import { RibbonTabModel } from "../../src/ribbon/models/ribbon-tab-model";
import { RibbonCollectionModel, RibbonGroupModel, RibbonItemModel } from "../../src/ribbon/models/index";
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
            this.skip(); // skips test (in Chai)
            return;
        }
    });
    describe('Overflow', () => {
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
        it('Overflow dropdown and Horizontal Scroll', () => {
            ribbon = new Ribbon({
                tabs: [{
                    id: "tab1",
                    header: "tab1",
                    groups: [{
                        id: "group1",
                        header: "group1HeaderVal",
                        orientation: 'Row',
                        collections: [{
                            id: "collection1",
                            items: [{
                                id: "item1",
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Medium,
                                buttonSettings: {
                                    cssClass: 'extended-btn',
                                    content: '<div style="width:100px;">button1</div>'
                                }
                            }, {
                                id: "item2",
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Medium,
                                buttonSettings: {
                                    cssClass: 'extended-btn',
                                    content: '<div style="width:100px;">button2</div>'
                                }
                            }]
                        }]
                    }, {
                        id: "group2",
                        header: "group2HeaderVal",
                        orientation: 'Row',
                        collections: [{
                            id: "collection2",
                            items: [{
                                id: "item3",
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Medium,
                                buttonSettings: {
                                    cssClass: 'extended-btn',
                                    content: '<div style="width:100px;">button3</div>'
                                }
                            }, {
                                id: "item4",
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Medium,
                                buttonSettings: {
                                    cssClass: 'extended-btn',
                                    content: '<div style="width:100px;">button4</div>'
                                }
                            }]
                        }]
                    }]
                }]
            }, ribbonEle);
            expect(document.querySelectorAll('.e-ribbon-group-overflow').length).toBe(0);
            expect(document.querySelectorAll('.e-hscroll-bar').length).toBe(0);
            containerEle.style.width = '450px';
            ribbon.refreshLayout();
            expect(document.querySelectorAll('.e-ribbon-group-overflow').length).toBe(1);
            expect(document.querySelectorAll('.e-hscroll-bar').length).toBe(0);
            containerEle.style.width = '300px';
            ribbon.refreshLayout();
            expect(document.querySelectorAll('.e-ribbon-group-overflow').length).toBe(2);
            expect(document.querySelectorAll('.e-hscroll-bar').length).toBe(0);
            containerEle.style.width = '200px';
            ribbon.refreshLayout();
            expect(document.querySelectorAll('.e-ribbon-group-overflow').length).toBe(2);
            expect(document.querySelectorAll('.e-hscroll-bar').length).toBe(1);
            containerEle.style.width = '300px';
            ribbon.refreshLayout();
            expect(document.querySelectorAll('.e-ribbon-group-overflow').length).toBe(2);
            expect(document.querySelectorAll('.e-hscroll-bar').length).toBe(0);
            containerEle.style.width = '450px';
            ribbon.refreshLayout();
            expect(document.querySelectorAll('.e-ribbon-group-overflow').length).toBe(1);
            expect(document.querySelectorAll('.e-hscroll-bar').length).toBe(0);
            containerEle.style.width = '700px';
            ribbon.refreshLayout();
            expect(document.querySelectorAll('.e-ribbon-group-overflow').length).toBe(0);
            expect(document.querySelectorAll('.e-hscroll-bar').length).toBe(0);
        });
        it('dropdown add/remove methods on overflow dropdown', () => {
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
                                allowedSizes: RibbonItemSize.Medium,
                                buttonSettings: {
                                    cssClass: 'extended-btn',
                                    content: '<div style="width:100px;">button1</div>'
                                }
                            }, {
                                id: "item2",
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Medium,
                                buttonSettings: {
                                    cssClass: 'extended-btn',
                                    content: '<div style="width:100px;">button2</div>'
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
                                id: "item3",
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Medium,
                                buttonSettings: {
                                    cssClass: 'extended-btn',
                                    content: '<div style="width:100px;">button3</div>'
                                }
                            }, {
                                id: "item4",
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Medium,
                                buttonSettings: {
                                    cssClass: 'extended-btn',
                                    content: '<div style="width:100px;">button4</div>'
                                }
                            }]
                        }]
                    }]
                }]
            }, ribbonEle);
            expect(document.querySelectorAll('.e-ribbon-group-overflow').length).toBe(0);
            expect(document.querySelectorAll('.e-hscroll-bar').length).toBe(0);
            expect(ribbon.element.querySelectorAll('.e-ribbon-group').length).toBe(2);
            expect(ribbon.element.querySelectorAll('.e-ribbon-collection').length).toBe(2);
            expect(ribbon.element.querySelectorAll('.e-ribbon-item').length).toBe(4);
            expect(document.querySelectorAll('.e-ribbon-collection').length).toBe(2);
            expect(document.querySelectorAll('.e-ribbon-item').length).toBe(4);
            let tab: RibbonTabModel = {
                id: "tab21",
                header: "tab21",
                groups: [{
                    id: "group21",
                    header: "group21Header",
                    orientation: 'Row',
                    collections: [{
                        id: "collection21",
                        items: [{
                            id: "item21",
                            type: RibbonItemType.Button,
                            allowedSizes: RibbonItemSize.Medium,
                            buttonSettings: {
                                cssClass: 'extended-btn',
                                content: '<div style="width:100px;">button21</div>'
                            }
                        }, {
                            id: "item22",
                            type: RibbonItemType.Button,
                            allowedSizes: RibbonItemSize.Medium,
                            buttonSettings: {
                                cssClass: 'extended-btn',
                                content: '<div style="width:100px;">button22</div>'
                            }
                        }]
                    }]
                }, {
                    id: "group22",
                    header: "group22Header",
                    orientation: 'Row',
                    collections: [{
                        id: "collection22",
                        items: [{
                            id: "item23",
                            type: RibbonItemType.Button,
                            allowedSizes: RibbonItemSize.Medium,
                            buttonSettings: {
                                cssClass: 'extended-btn',
                                content: '<div style="width:100px;">button23</div>'
                            }
                        }, {
                            id: "item4",
                            type: RibbonItemType.Button,
                            allowedSizes: RibbonItemSize.Medium,
                            buttonSettings: {
                                cssClass: 'extended-btn',
                                content: '<div style="width:100px;">button24</div>'
                            }
                        }]
                    }]
                }]
            }
            let group: RibbonGroupModel = {
                id: "group212",
                header: "group212Header",
                orientation: 'Row',
                collections: [{
                    id: "collection212",
                    items: [{
                        id: "item212",
                        type: RibbonItemType.Button,
                        allowedSizes: RibbonItemSize.Medium,
                        buttonSettings: {
                            cssClass: 'extended-btn',
                            content: '<div style="width:100px;">button212</div>'
                        }
                    }, {
                        id: "item222",
                        type: RibbonItemType.Button,
                        allowedSizes: RibbonItemSize.Medium,
                        buttonSettings: {
                            cssClass: 'extended-btn',
                            content: '<div style="width:100px;">button222</div>'
                        }
                    }]
                }]
            }
            let collection: RibbonCollectionModel = {
                id: "collection2122",
                items: [{
                    id: "item2122",
                    type: RibbonItemType.Button,
                    allowedSizes: RibbonItemSize.Medium,
                    buttonSettings: {
                        cssClass: 'extended-btn',
                        content: '<div style="width:100px;">button2122</div>'
                    }
                }, {
                    id: "item2222",
                    type: RibbonItemType.Button,
                    allowedSizes: RibbonItemSize.Medium,
                    buttonSettings: {
                        cssClass: 'extended-btn',
                        content: '<div style="width:100px;">button222</div>'
                    }
                }]
            }
            let item: RibbonItemModel = {
                id: "item2222",
                type: RibbonItemType.Button,
                allowedSizes: RibbonItemSize.Medium,
                buttonSettings: {
                    cssClass: 'extended-btn',
                    content: '<div style="width:100px;">button2222</div>'
                }
            }
            containerEle.style.width = '150px';
            ribbon.refreshLayout();
            expect(document.querySelectorAll('.e-ribbon-group-overflow').length).toBe(2);
            expect(document.querySelectorAll('.e-hscroll-bar').length).toBe(1);
            expect(ribbon.element.querySelectorAll('.e-ribbon-group').length).toBe(2);
            expect(ribbon.element.querySelectorAll('.e-ribbon-collection').length).toBe(0);
            expect(ribbon.element.querySelectorAll('.e-ribbon-item').length).toBe(0);
            expect(document.querySelectorAll('.e-ribbon-collection').length).toBe(2);
            expect(document.querySelectorAll('.e-ribbon-item').length).toBe(4);
            ribbon.addTab(tab);
            ribbon.setProperties({tabAnimation:{previous:{effect:"None"},next:{effect:"None"}}});
            ribbon.selectTab('tab21');
            expect(ribbon.tabObj.items.length).toBe(2);
            expect((ribbon.tabObj.items[0].header.text as HTMLElement).outerHTML).toBe('<span id="tab1_header">tab1</span>');
            expect((ribbon.tabObj.items[1].header.text as HTMLElement).outerHTML).toBe('<span id="tab21_header">tab21</span>');
            expect(ribbon.element.querySelectorAll('.e-ribbon-group').length).toBe(4);
            expect(ribbon.element.querySelectorAll('.e-ribbon-collection').length).toBe(2);
            expect(ribbon.element.querySelectorAll('.e-ribbon-item').length).toBe(4);
            expect(document.querySelectorAll('.e-ribbon-collection').length).toBe(4);
            expect(document.querySelectorAll('.e-ribbon-item').length).toBe(8);
            ribbon.addGroup('tab21',group);
            expect(ribbon.element.querySelectorAll('.e-ribbon-group').length).toBe(5);
            expect(ribbon.element.querySelectorAll('.e-ribbon-collection').length).toBe(2);
            expect(ribbon.element.querySelectorAll('.e-ribbon-item').length).toBe(4);
            expect(document.querySelectorAll('.e-ribbon-collection').length).toBe(5);
            expect(document.querySelectorAll('.e-ribbon-item').length).toBe(10);
            ribbon.addCollection("group212",collection);
            expect(ribbon.element.querySelectorAll('.e-ribbon-group').length).toBe(5);
            expect(ribbon.element.querySelectorAll('.e-ribbon-collection').length).toBe(2);
            expect(ribbon.element.querySelectorAll('.e-ribbon-item').length).toBe(4);
            expect(document.querySelectorAll('.e-ribbon-collection').length).toBe(6);
            expect(document.querySelectorAll('.e-ribbon-item').length).toBe(12);
            ribbon.addItem("collection2122",item);
            expect(ribbon.element.querySelectorAll('.e-ribbon-group').length).toBe(5);
            expect(ribbon.element.querySelectorAll('.e-ribbon-collection').length).toBe(2);
            expect(ribbon.element.querySelectorAll('.e-ribbon-item').length).toBe(4);
            expect(document.querySelectorAll('.e-ribbon-collection').length).toBe(6);
            expect(document.querySelectorAll('.e-ribbon-item').length).toBe(13);
            ribbon.removeItem("item2222");
            expect(ribbon.element.querySelectorAll('.e-ribbon-group').length).toBe(5);
            expect(ribbon.element.querySelectorAll('.e-ribbon-collection').length).toBe(2);
            expect(ribbon.element.querySelectorAll('.e-ribbon-item').length).toBe(4);
            expect(document.querySelectorAll('.e-ribbon-collection').length).toBe(6);
            expect(document.querySelectorAll('.e-ribbon-item').length).toBe(12);
            ribbon.removeCollection("collection2122");
            expect(ribbon.element.querySelectorAll('.e-ribbon-group').length).toBe(5);
            expect(ribbon.element.querySelectorAll('.e-ribbon-collection').length).toBe(2);
            expect(ribbon.element.querySelectorAll('.e-ribbon-item').length).toBe(4);
            expect(document.querySelectorAll('.e-ribbon-collection').length).toBe(5);
            expect(document.querySelectorAll('.e-ribbon-item').length).toBe(10);
            ribbon.removeGroup("group212");
            expect(ribbon.element.querySelectorAll('.e-ribbon-group').length).toBe(4);
            expect(ribbon.element.querySelectorAll('.e-ribbon-collection').length).toBe(2);
            expect(ribbon.element.querySelectorAll('.e-ribbon-item').length).toBe(4);
            expect(document.querySelectorAll('.e-ribbon-collection').length).toBe(4);
            expect(document.querySelectorAll('.e-ribbon-item').length).toBe(8);
            ribbon.removeTab("tab21");
            expect(ribbon.element.querySelectorAll('.e-ribbon-group').length).toBe(2);
            expect(ribbon.element.querySelectorAll('.e-ribbon-collection').length).toBe(0);
            expect(ribbon.element.querySelectorAll('.e-ribbon-item').length).toBe(0);
            expect(document.querySelectorAll('.e-ribbon-collection').length).toBe(2);
            expect(document.querySelectorAll('.e-ribbon-item').length).toBe(4);
        });
        
        it('enable/disable method', () => {
            let template1 = '<button id="btn1" class="tempContent">Button1</button>';
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
                                buttonSettings: {
                                    content: 'button1',
                                    iconCss: 'e-icons e-cut',
                                }
                            }, {
                                type: RibbonItemType.DropDown,
                                id: "item2",
                                dropDownSettings: {
                                    content: 'Edit',
                                    iconCss: 'e-icons e-edit',
                                    items: dropDownButtonItems
                                }
                            }, {
                                id: "item3",
                                type: RibbonItemType.SplitButton,
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
                                allowedSizes: (RibbonItemSize.Large | RibbonItemSize.Small),
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
                }]
            }, ribbonEle);
            containerEle.style.width = '200px';
            ribbon.refreshLayout();
            expect(document.querySelector('#item1').hasAttribute('disabled')).toBe(false);
            expect(document.querySelector('#item2').hasAttribute('disabled')).toBe(false);
            expect(document.querySelector('#item3').hasAttribute('disabled')).toBe(false);
            expect(document.querySelector('#item4').hasAttribute('disabled')).toBe(false);
            expect(document.querySelector('#item5').parentElement.querySelector('.e-dropdown-btn').hasAttribute('disabled')).toBe(false);
            expect(document.querySelector('#item6').hasAttribute('disabled')).toBe(false);
            expect(document.querySelector('#item7').hasAttribute('disabled')).toBe(false);
            expect(document.querySelector('#item7').classList.contains('e-disabled')).toBe(false);
            ribbon.disableItem('item1');
            ribbon.disableItem('item2');
            ribbon.disableItem('item3');
            ribbon.disableItem('item4');
            ribbon.disableItem('item5');
            ribbon.disableItem('item6');
            ribbon.disableItem('item7');
            expect(document.querySelector('#item1').hasAttribute('disabled')).toBe(true);
            expect(document.querySelector('#item2').hasAttribute('disabled')).toBe(true);
            expect(document.querySelector('#item3').hasAttribute('disabled')).toBe(true);
            expect(document.querySelector('#item4').hasAttribute('disabled')).toBe(true);
            expect(document.querySelector('#item5').parentElement.querySelector('.e-dropdown-btn').hasAttribute('disabled')).toBe(true);
            expect(document.querySelector('#item6').hasAttribute('disabled')).toBe(true);
            expect(document.querySelector('#item7').hasAttribute('disabled')).toBe(true);
            expect(document.querySelector('#item7').classList.contains('e-disabled')).toBe(true);
            ribbon.enableItem('item1');
            ribbon.enableItem('item2');
            ribbon.enableItem('item3');
            ribbon.enableItem('item4');
            ribbon.enableItem('item5');
            ribbon.enableItem('item6');
            ribbon.enableItem('item7');
            expect(document.querySelector('#item1').hasAttribute('disabled')).toBe(false);
            expect(document.querySelector('#item2').hasAttribute('disabled')).toBe(false);
            expect(document.querySelector('#item3').hasAttribute('disabled')).toBe(false);
            expect(document.querySelector('#item4').hasAttribute('disabled')).toBe(false);
            expect(document.querySelector('#item5').parentElement.querySelector('.e-dropdown-btn').hasAttribute('disabled')).toBe(false);
            expect(document.querySelector('#item6').hasAttribute('disabled')).toBe(false);
            expect(document.querySelector('#item7').hasAttribute('disabled')).toBe(false);
            expect(document.querySelector('#item7').classList.contains('e-disabled')).toBe(false);
            //For Coverage
            containerEle.style.width = '1600px';
            ribbon.refreshLayout();
        });
    });


    describe('Ribbon Resize', () => {
        let ribbon: Ribbon;
        let ribbonEle: HTMLElement;
        let containerEle: HTMLElement;
        let tabs: RibbonTabModel[] =  [{
            id: "tab1",
            header: "tab1",
            groups: [{
                header: "group1Header",
                orientation: 'Column',
                collections: [{
                    cssClass: "red",
                    items: [
                        { type: RibbonItemType.Button, allowedSizes: (RibbonItemSize.Small | RibbonItemSize. Medium | RibbonItemSize.Large), buttonSettings: { content: 'cut', iconCss: 'e-icons e-cut', } },
                        { type: RibbonItemType.Button, allowedSizes: (RibbonItemSize.Small | RibbonItemSize. Medium | RibbonItemSize.Large), buttonSettings: { content: 'copy', iconCss: 'e-icons e-copy', } },
                        { type: RibbonItemType.Button, allowedSizes: (RibbonItemSize.Small | RibbonItemSize. Medium | RibbonItemSize.Large), buttonSettings: { content: 'Paste options', iconCss: 'e-icons e-paste', } }
                    ]
                }, {
                    cssClass: "greenyellow",
                    items: [
                        { type: RibbonItemType.Button, allowedSizes: (RibbonItemSize.Small | RibbonItemSize. Medium), buttonSettings: { content: 'cut', iconCss: 'e-icons e-cut', } },
                        { type: RibbonItemType.Button, allowedSizes: (RibbonItemSize.Small | RibbonItemSize. Medium), buttonSettings: { content: 'copy', iconCss: 'e-icons e-copy', } },
                        { type: RibbonItemType.Button, allowedSizes: (RibbonItemSize.Small | RibbonItemSize. Medium), buttonSettings: { content: 'Paste options', iconCss: 'e-icons e-paste', } }
                    ]
                }, {
                    cssClass: "orange",
                    items: [
                        { type: RibbonItemType.Button, allowedSizes: (RibbonItemSize.Large | RibbonItemSize. Medium), buttonSettings: { content: 'cut', iconCss: 'e-icons e-cut', } },
                        // { type: RibbonItemType.Button, allowedSizes: (RibbonItemSize.Large | RibbonItemSize. Medium), buttonSettings: { content: 'copy', iconCss: 'e-icons e-copy', } },
                        { type: RibbonItemType.Button, allowedSizes: (RibbonItemSize.Large | RibbonItemSize. Medium), buttonSettings: { content: 'Paste options', iconCss: 'e-icons e-paste', } }
                    ]
                }, {
                    cssClass: "aqua",
                    items: [
                        { type: RibbonItemType.Button, allowedSizes: RibbonItemSize. Medium, buttonSettings: { content: 'cut', iconCss: 'e-icons e-cut', } },
                        { type: RibbonItemType.Button, allowedSizes: RibbonItemSize. Medium, buttonSettings: { content: 'copy', iconCss: 'e-icons e-copy', } },
                        { type: RibbonItemType.Button, allowedSizes: RibbonItemSize. Medium, buttonSettings: { content: 'Paste options', iconCss: 'e-icons e-paste', } }
                    ]
                }, {
                    items: [
                        { type: RibbonItemType.Button, allowedSizes: (RibbonItemSize.Small | RibbonItemSize. Medium | RibbonItemSize.Large), buttonSettings: { content: 'cut', iconCss: 'e-icons e-cut', } },
                    ]
                }, {
                    items: [
                        { type: RibbonItemType.Button, allowedSizes: (RibbonItemSize.Small | RibbonItemSize. Medium | RibbonItemSize.Large), buttonSettings: { content: 'copy', iconCss: 'e-icons e-copy', } },
                    ]
                }, {
                    items: [
                        { type: RibbonItemType.Button, allowedSizes: (RibbonItemSize.Small | RibbonItemSize. Medium | RibbonItemSize.Large), buttonSettings: { content: 'Paste options', iconCss: 'e-icons e-paste', } }
                    ]
                }]
            }, {
                header: "group2Header",
                orientation: 'Column',
                collections: [{
                    items: [{
                        type: RibbonItemType.ComboBox,
                        comboBoxSettings: { dataSource: sportsData, width: '150px', index: 1 }
                    }, {
                        type: RibbonItemType.ComboBox,
                        comboBoxSettings: { dataSource: sportsData, width: '150px', index: 2 }
                    }, {
                        type: RibbonItemType.ComboBox,
                        comboBoxSettings: { dataSource: sportsData, width: '150px', index: 3 }
                    }]
                }]
            }, {
                header: "group3Header",
                orientation: 'Row',
                collections: [{
                    items: [{
                        type: RibbonItemType.Button,
                        allowedSizes: (RibbonItemSize.Small | RibbonItemSize. Medium | RibbonItemSize.Large),
                        buttonSettings: { content: 'cut', iconCss: 'e-icons e-cut', clicked: (e) => { console.log(e); alert("Cut clicked"); } }
                    }, {
                        type: RibbonItemType.Button,
                        allowedSizes: (RibbonItemSize.Small | RibbonItemSize. Medium | RibbonItemSize.Large),
                        buttonSettings: { content: 'copy', iconCss: 'e-icons e-copy', clicked: (e) => { console.log(e); alert("Copy clicked"); } }
                    }, {
                        type: RibbonItemType.Button,
                        allowedSizes: (RibbonItemSize.Small | RibbonItemSize. Medium | RibbonItemSize.Large),
                        buttonSettings: { content: 'Paste', iconCss: 'e-icons e-paste', clicked: (e) => { console.log(e); alert("Paste clicked"); } }
                    }]
                }]
            }, {
                header: "group13Header",
                orientation: 'Row',
                collections: [{
                    cssClass: "red",
                    items: [{
                        type: RibbonItemType.Button,
                        allowedSizes: (RibbonItemSize.Small | RibbonItemSize. Medium | RibbonItemSize.Large),
                        buttonSettings: { content: 'cut1', iconCss: 'e-icons e-cut', clicked: (e) => { console.log(e); alert("Cut clicked"); } }
                    }, {
                        type: RibbonItemType.Button,
                        allowedSizes: (RibbonItemSize.Small | RibbonItemSize. Medium | RibbonItemSize.Large),
                        buttonSettings: { content: 'copy1', iconCss: 'e-icons e-copy', clicked: (e) => { console.log(e); alert("Copy clicked"); } }
                    }, {
                        type: RibbonItemType.Button,
                        allowedSizes: (RibbonItemSize.Small | RibbonItemSize. Medium | RibbonItemSize.Large),
                        buttonSettings: { content: 'Paste Options1', iconCss: 'e-icons e-paste', clicked: (e) => { console.log(e); alert("Paste clicked"); } }
                    }]
                }, {
                    cssClass: "greenyellow",
                    items: [{
                        type: RibbonItemType.Button,
                        allowedSizes: (RibbonItemSize.Small | RibbonItemSize. Medium | RibbonItemSize.Large),
                        buttonSettings: { content: 'cut2', iconCss: 'e-icons e-cut', clicked: (e) => { console.log(e); alert("Cut clicked"); } }
                    }, {
                        type: RibbonItemType.Button,
                        allowedSizes: (RibbonItemSize.Small | RibbonItemSize. Medium | RibbonItemSize.Large),
                        buttonSettings: { content: 'copy2', iconCss: 'e-icons e-copy', clicked: (e) => { console.log(e); alert("Copy clicked"); } }
                    }, {
                        type: RibbonItemType.Button,
                        allowedSizes: (RibbonItemSize.Small | RibbonItemSize. Medium | RibbonItemSize.Large),
                        buttonSettings: { content: 'Paste Options2', iconCss: 'e-icons e-paste', clicked: (e) => { console.log(e); alert("Paste clicked"); } }
                    }]
                }, {
                    cssClass: "orange",
                    items: [{
                        type: RibbonItemType.ComboBox,
                        allowedSizes: (RibbonItemSize.Small | RibbonItemSize. Medium | RibbonItemSize.Large),
                        comboBoxSettings: { dataSource: sportsData, width: '150px', index: 1 }
                    }]
                }]
            }]
        }, {
            cssClass: "tab3CSS",
            header: "tab3",
            id:"secondtab",
            groups: [{
                header: "group7Header",
                orientation: 'Row',
                collections: [{
                    items: [{
                        type: RibbonItemType.DropDown,
                        allowedSizes: (RibbonItemSize.Small | RibbonItemSize. Medium | RibbonItemSize.Large),
                        dropDownSettings: { content: 'Edit', iconCss: 'e-icons e-edit', items: dropDownButtonItems }
                    }, {
                        type: RibbonItemType.DropDown,
                        allowedSizes: (RibbonItemSize.Small | RibbonItemSize. Medium | RibbonItemSize.Large),
                        dropDownSettings: { content: 'Edit1', iconCss: 'e-icons e-edit', items: dropDownButtonItems }
                    }, {
                        type: RibbonItemType.SplitButton,
                        allowedSizes: (RibbonItemSize.Small | RibbonItemSize. Medium | RibbonItemSize.Large),
                        splitButtonSettings: { content: 'Edit2 option', iconCss: 'e-icons e-edit', items: dropDownButtonItems }
                    }]
                }]
            }, {
                header: "group8Header",
                orientation: 'Column',
                collections: [{
                    items: [{
                        type: RibbonItemType.DropDown,
                        allowedSizes: RibbonItemSize.Medium,
                        dropDownSettings: { content: 'Edit', iconCss: 'e-icons e-edit', items: dropDownButtonItems }
                    }, {
                        type: RibbonItemType.DropDown,
                        allowedSizes: RibbonItemSize.Medium,
                        dropDownSettings: { content: 'Edit1', iconCss: 'e-icons e-edit', items: dropDownButtonItems }
                    }, {
                        type: RibbonItemType.DropDown,
                        allowedSizes: RibbonItemSize.Medium,
                        dropDownSettings: { content: 'Edit2 Option', iconCss: 'e-icons e-edit', items: dropDownButtonItems }
                    }]
                }, {
                    items: [{
                        type: RibbonItemType.DropDown,
                        allowedSizes: RibbonItemSize.Small,
                        dropDownSettings: { content: 'Edit', iconCss: 'e-icons e-edit', items: dropDownButtonItems }
                    }, {
                        type: RibbonItemType.DropDown,
                        allowedSizes: RibbonItemSize.Small,
                        dropDownSettings: { content: 'Edit1', iconCss: 'e-icons e-edit', items: dropDownButtonItems }
                    }, {
                        type: RibbonItemType.DropDown,
                        allowedSizes: RibbonItemSize.Small,
                        dropDownSettings: { content: 'Edit2', iconCss: 'e-icons e-edit', items: dropDownButtonItems }
                    }]
                }]
            }, {
                header: "group9Header",
                orientation: 'Column',
                collections: [{
                    items: [{
                        type: RibbonItemType.DropDown,
                        allowedSizes: RibbonItemSize.Medium,
                        dropDownSettings: { content: 'Edit', iconCss: 'e-icons e-edit', items: dropDownButtonItems }
                    }, {
                        type: RibbonItemType.DropDown,
                        allowedSizes: RibbonItemSize.Medium,
                        dropDownSettings: { content: 'Edit1', iconCss: 'e-icons e-edit', items: dropDownButtonItems }
                    }, {
                        type: RibbonItemType.DropDown,
                        allowedSizes: RibbonItemSize.Medium,
                        dropDownSettings: { content: 'Edit2 Option', iconCss: 'e-icons e-edit', items: dropDownButtonItems }
                    }]
                }, {
                    items: [{
                        type: RibbonItemType.DropDown,
                        allowedSizes: RibbonItemSize.Small,
                        dropDownSettings: { content: 'Edit', iconCss: 'e-icons e-edit', items: dropDownButtonItems }
                    }, {
                        type: RibbonItemType.DropDown,
                        allowedSizes: RibbonItemSize.Small,
                        dropDownSettings: { content: 'Edit1', iconCss: 'e-icons e-edit', items: dropDownButtonItems }
                    }, {
                        type: RibbonItemType.DropDown,
                        allowedSizes: RibbonItemSize.Small,
                        dropDownSettings: { content: 'Edit2', iconCss: 'e-icons e-edit', items: dropDownButtonItems }
                    }]
                }]
            }]
        }];
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
        it('resize 1100px', () => {
            containerEle.style.width = '1600px';
            ribbon = new Ribbon({
                tabs:tabs
            }, ribbonEle);
            //maximum size, no resizing happened
            containerEle.style.width = '1600px';
            ribbon.refreshLayout();  
            expect(document.querySelectorAll('.e-ribbon-shrink').length).toBe(0);
            expect(document.querySelectorAll('.e-ribbon-group')[2].querySelectorAll('.e-icon-top').length).toBe(3);
            expect(document.querySelectorAll('.e-ribbon-group')[2].querySelectorAll('.e-icon-left').length).toBe(0);
            containerEle.style.width = '1100px';
            ribbon.refreshLayout();
            expect(document.querySelectorAll('.e-ribbon-shrink').length).toBe(2);
            expect(document.querySelectorAll('.e-ribbon-group')[2].querySelector('.e-ribbon-shrink')!==null).toBe(true)
            expect(document.querySelectorAll('.e-ribbon-group')[2].querySelectorAll('.e-icon-top').length).toBe(0);
            expect(document.querySelectorAll('.e-ribbon-group')[2].querySelectorAll('.e-icon-left').length).toBe(3);
            containerEle.style.width = '1600px';
            ribbon.refreshLayout();
            expect(document.querySelectorAll('.e-ribbon-shrink').length).toBe(0);
            expect(document.querySelectorAll('.e-ribbon-group')[2].querySelectorAll('.e-icon-top').length).toBe(3);
            expect(document.querySelectorAll('.e-ribbon-group')[2].querySelectorAll('.e-icon-left').length).toBe(0);           
        });
        it('resize 1350px', () => {
            containerEle.style.width = '1600px';
            ribbon = new Ribbon({
                tabs:tabs
            }, ribbonEle);
            //maximum size, no resizing happened
            expect(document.querySelectorAll('.e-ribbon-shrink').length).toBe(0);
            containerEle.style.width = '1250px';
            ribbon.refreshLayout();
            expect(document.querySelectorAll('.e-ribbon-shrink').length).toBe(1);
            expect(document.querySelectorAll('.e-ribbon-group')[3].querySelector('.e-ribbon-collection').querySelectorAll('button')[2].textContent.toLowerCase()).toBe('paste options1');
            containerEle.style.width = '1000px';
            ribbon.refreshLayout();
            expect(document.querySelectorAll('.e-ribbon-shrink').length).toBe(2);
            expect(document.querySelectorAll('.e-ribbon-group')[3].querySelector('.e-ribbon-collection').querySelectorAll('button')[2].textContent.toLowerCase()).toBe('');
            containerEle.style.width = '1250px';
            ribbon.refreshLayout();
            expect(document.querySelectorAll('.e-ribbon-shrink').length).toBe(1);
            expect(document.querySelectorAll('.e-ribbon-group')[3].querySelector('.e-ribbon-collection').querySelectorAll('button')[2].textContent.toLowerCase()).toBe('paste options1');
            containerEle.style.width = '1600px';
            ribbon.refreshLayout();
            expect(document.querySelectorAll('.e-ribbon-shrink').length).toBe(0);
        });
        it('resize 1150px', () => {
            containerEle.style.width = '1600px';
            ribbon = new Ribbon({
                tabs:tabs
            }, ribbonEle);
            //maximum size, no resizing happened
            expect(document.querySelectorAll('.e-ribbon-shrink').length).toBe(0);
            containerEle.style.width = '1150px';
            ribbon.refreshLayout();
            expect(document.querySelectorAll('.e-ribbon-shrink').length).toBe(2);
            containerEle.style.width = '1000px';
            ribbon.refreshLayout();
            expect(document.querySelectorAll('.e-ribbon-shrink').length).toBe(2);
            expect(isNullOrUndefined(document.querySelectorAll('.e-ribbon-shrink')[0].getAttribute('data-large-width'))).toBe(false);
            expect(isNullOrUndefined(document.querySelectorAll('.e-ribbon-shrink')[0].getAttribute('data-medium-width'))).toBe(false);
            expect(document.querySelectorAll('.e-ribbon-shrink')[0].querySelectorAll('button')[0].textContent.toLowerCase()).toBe('');
            expect(isNullOrUndefined(document.querySelectorAll('.e-ribbon-shrink')[1].getAttribute('data-large-width'))).toBe(false);
            expect(isNullOrUndefined(document.querySelectorAll('.e-ribbon-shrink')[1].getAttribute('data-medium-width'))).toBe(false);
            expect(document.querySelectorAll('.e-ribbon-shrink')[1].querySelectorAll('button')[0].textContent.toLowerCase()).toBe('');
            containerEle.style.width = '1150px';
            ribbon.refreshLayout();
            expect(document.querySelectorAll('.e-ribbon-shrink').length).toBe(2);
            containerEle.style.width = '1600px';
            ribbon.refreshLayout();
            expect(document.querySelectorAll('.e-ribbon-shrink').length).toBe(0);
        });
        it('resize 950px', () => {
            containerEle.style.width = '1600px';
            ribbon = new Ribbon({
                tabs:tabs
            }, ribbonEle);
            expect(document.querySelectorAll('.e-ribbon-shrink').length).toBe(0);
            //maximum size, no resizing happened
            containerEle.style.width = '1150px';
            ribbon.refreshLayout();
            expect(document.querySelectorAll('.e-ribbon-shrink').length).toBe(2);
            expect(document.querySelectorAll('.e-ribbon-group')[0].querySelectorAll('.e-ribbon-collection')[0].querySelectorAll('.e-icon-btn').length).toBe(0);
            expect(document.querySelectorAll('.e-ribbon-group')[0].querySelectorAll('.e-ribbon-collection')[2].querySelectorAll('.e-icon-btn').length).toBe(0);
            expect(document.querySelectorAll('.e-ribbon-group')[0].querySelectorAll('.e-ribbon-collection')[0].querySelectorAll('button')[0].textContent.toLowerCase()).toBe('cut');
            expect(document.querySelectorAll('.e-ribbon-group')[0].querySelectorAll('.e-ribbon-collection')[1].querySelectorAll('button')[0].textContent.toLowerCase()).toBe('cut');
            expect(document.querySelectorAll('.e-ribbon-group')[0].querySelectorAll('.e-ribbon-collection')[2].querySelectorAll('button')[0].textContent.toLowerCase()).toBe('cut');
            expect(document.querySelectorAll('.e-ribbon-group')[0].querySelectorAll('.e-ribbon-collection')[3].querySelectorAll('button')[0].textContent.toLowerCase()).toBe('cut');
            containerEle.style.width = '850px';
            ribbon.refreshLayout();
            expect(document.querySelectorAll('.e-ribbon-shrink').length).toBe(2);
            expect(document.querySelectorAll('.e-ribbon-group')[0].querySelectorAll('.e-ribbon-collection')[0].querySelectorAll('.e-icon-btn').length).toBe(3);
            expect(document.querySelectorAll('.e-ribbon-group')[0].querySelectorAll('.e-ribbon-collection')[2].querySelectorAll('.e-icon-btn').length).toBe(0);
            expect(document.querySelectorAll('.e-ribbon-group')[0].querySelectorAll('.e-ribbon-collection')[0].querySelectorAll('button')[0].textContent.toLowerCase()).toBe('');
            expect(document.querySelectorAll('.e-ribbon-group')[0].querySelectorAll('.e-ribbon-collection')[1].querySelectorAll('button')[0].textContent.toLowerCase()).toBe('');
            expect(document.querySelectorAll('.e-ribbon-group')[0].querySelectorAll('.e-ribbon-collection')[2].querySelectorAll('button')[0].textContent.toLowerCase()).toBe('cut');
            expect(document.querySelectorAll('.e-ribbon-group')[0].querySelectorAll('.e-ribbon-collection')[3].querySelectorAll('button')[0].textContent.toLowerCase()).toBe('cut');
            containerEle.style.width = '1150px';
            ribbon.refreshLayout();
            expect(document.querySelectorAll('.e-ribbon-shrink').length).toBe(2);
            expect(document.querySelectorAll('.e-ribbon-group')[0].querySelectorAll('.e-ribbon-collection')[0].querySelectorAll('.e-icon-btn').length).toBe(0);
            expect(document.querySelectorAll('.e-ribbon-group')[0].querySelectorAll('.e-ribbon-collection')[2].querySelectorAll('.e-icon-btn').length).toBe(0);
            expect(document.querySelectorAll('.e-ribbon-group')[0].querySelectorAll('.e-ribbon-collection')[0].querySelectorAll('button')[0].textContent.toLowerCase()).toBe('cut');
            expect(document.querySelectorAll('.e-ribbon-group')[0].querySelectorAll('.e-ribbon-collection')[1].querySelectorAll('button')[0].textContent.toLowerCase()).toBe('cut');
            expect(document.querySelectorAll('.e-ribbon-group')[0].querySelectorAll('.e-ribbon-collection')[2].querySelectorAll('button')[0].textContent.toLowerCase()).toBe('cut');
            expect(document.querySelectorAll('.e-ribbon-group')[0].querySelectorAll('.e-ribbon-collection')[3].querySelectorAll('button')[0].textContent.toLowerCase()).toBe('cut');
        });
        it('resize 830px', () => {
            containerEle.style.width = '1600px';
            ribbon = new Ribbon({
                tabs:tabs
            }, ribbonEle);
            //maximum size, no resizing happened
            containerEle.style.width = '1600px';
            ribbon.refreshLayout();
            expect(document.querySelectorAll('.e-ribbon-group-overflow-ddb').length).toBe(0);
            let groupcontainerid:string = '#'+document.querySelectorAll('.e-ribbon-group-container')[3].id;
            expect(document.querySelector(groupcontainerid).querySelectorAll('.e-icon-btn').length).toBe(0);
            containerEle.style.width = '950px';
            ribbon.refreshLayout();
            expect(document.querySelectorAll('.e-ribbon-group-overflow-ddb').length).toBe(0);
            expect(document.querySelector(groupcontainerid).querySelectorAll('.e-icon-btn').length).toBe(6);
            containerEle.style.width = '700px';
            ribbon.refreshLayout();
            expect(document.querySelectorAll('button.e-ribbon-group-overflow-ddb').length).toBe(3); 
            expect(document.querySelectorAll('.e-ribbon-group')[3].querySelectorAll('.e-ribbon-group-overflow-ddb').length).toBe(1);
            expect(document.querySelector(groupcontainerid).querySelectorAll('.e-icon-btn').length).toBe(0);
            expect(document.querySelectorAll('.e-ribbon-group-overflow-ddb').length).toBe(6);
            containerEle.style.width = '950px';
            ribbon.refreshLayout();
            expect(document.querySelectorAll('.e-ribbon-group-overflow-ddb').length).toBe(0);
            expect(document.querySelector(groupcontainerid).querySelectorAll('.e-icon-btn').length).toBe(6);
            containerEle.style.width = '1600px';
            ribbon.refreshLayout();
            expect(document.querySelectorAll('.e-ribbon-shrink').length).toBe(0);
        });
        it('resize 600px + 400px', () => {
            containerEle.style.width = '1600px';
            ribbon = new Ribbon({
                tabs:tabs
            }, ribbonEle);
            expect(document.querySelectorAll('button.e-ribbon-group-overflow-ddb').length).toBe(0);
            //maximum size, no resizing happened
            containerEle.style.width = '800px';
            ribbon.refreshLayout();
            expect(document.querySelectorAll('button.e-ribbon-group-overflow-ddb').length).toBe(1);
            containerEle.style.width = '600px';
            ribbon.refreshLayout();
            expect(document.querySelectorAll('button.e-ribbon-group-overflow-ddb').length).toBe(4);
            expect(document.querySelectorAll('.e-content .e-hscroll-bar').length).toBe(0);
            containerEle.style.width = '300px';
            ribbon.refreshLayout();
            expect(document.querySelectorAll('.e-content .e-hscroll-bar').length).toBe(1);
            expect(document.querySelectorAll('button.e-ribbon-group-overflow-ddb').length).toBe(4);
            containerEle.style.width = '600px';
            ribbon.refreshLayout();
            expect(document.querySelectorAll('.e-content .e-hscroll-bar').length).toBe(0);
            expect(document.querySelectorAll('button.e-ribbon-group-overflow-ddb').length).toBe(4);
            containerEle.style.width = '800px';
            ribbon.refreshLayout();
            expect(document.querySelectorAll('button.e-ribbon-group-overflow-ddb').length).toBe(1);
            containerEle.style.width = '1600px';
            ribbon.refreshLayout();
            expect(document.querySelectorAll('button.e-ribbon-group-overflow-ddb').length).toBe(0);
        });

        let tabs1: RibbonTabModel[] =  [{
            id: "tab1",
            header: "tab1",
            groups: [{
                header: "group1Header",
                orientation: 'Column',
                collections: [{
                    cssClass: "red",
                    items: [
                        { type: RibbonItemType.Button, allowedSizes: (RibbonItemSize.Small | RibbonItemSize. Medium | RibbonItemSize.Large), buttonSettings: { content: 'cut', iconCss: 'e-icons e-cut', } },
                        { type: RibbonItemType.Button, allowedSizes: (RibbonItemSize.Small | RibbonItemSize. Medium | RibbonItemSize.Large), buttonSettings: { content: 'copy', iconCss: 'e-icons e-copy', } },
                        { type: RibbonItemType.Button, allowedSizes: (RibbonItemSize.Small | RibbonItemSize. Medium | RibbonItemSize.Large), buttonSettings: { content: 'Paste options', iconCss: 'e-icons e-paste', } }
                    ]
                }, {
                    cssClass: "greenyellow",
                    items: [
                        { type: RibbonItemType.Button, allowedSizes: (RibbonItemSize.Small | RibbonItemSize. Medium), buttonSettings: { content: 'cut', iconCss: 'e-icons e-cut', } },
                        // { type: RibbonItemType.Button, allowedSizes: (RibbonItemSize.Small | RibbonItemSize. Medium), buttonSettings: { content: 'copy', iconCss: 'e-icons e-copy', } },
                        { type: RibbonItemType.Button, allowedSizes: (RibbonItemSize.Small | RibbonItemSize. Medium), buttonSettings: { content: 'Paste options', iconCss: 'e-icons e-paste', } }
                    ]
                }, {
                    cssClass: "orange",
                    items: [
                        { type: RibbonItemType.Button, allowedSizes: (RibbonItemSize.Large | RibbonItemSize. Medium), buttonSettings: { content: 'cut', iconCss: 'e-icons e-cut', } },
                        // { type: RibbonItemType.Button, allowedSizes: (RibbonItemSize.Large | RibbonItemSize. Medium), buttonSettings: { content: 'copy', iconCss: 'e-icons e-copy', } },
                        { type: RibbonItemType.Button, allowedSizes: (RibbonItemSize.Large | RibbonItemSize. Medium), buttonSettings: { content: 'Paste options', iconCss: 'e-icons e-paste', } }
                    ]
                }, {
                    cssClass: "aqua",
                    items: [
                        { type: RibbonItemType.Button, allowedSizes: RibbonItemSize. Medium, buttonSettings: { content: 'cut', iconCss: 'e-icons e-cut', } },
                        { type: RibbonItemType.Button, allowedSizes: RibbonItemSize. Medium, buttonSettings: { content: 'copy', iconCss: 'e-icons e-copy', } },
                        { type: RibbonItemType.Button, allowedSizes: RibbonItemSize. Medium, buttonSettings: { content: 'Paste options', iconCss: 'e-icons e-paste', } }
                    ]
                }, {
                    items: [
                        { type: RibbonItemType.Button, allowedSizes: (RibbonItemSize.Small | RibbonItemSize. Medium | RibbonItemSize.Large), buttonSettings: { content: 'cut', iconCss: 'e-icons e-cut', } },
                    ]
                }, {
                    items: [
                        { type: RibbonItemType.Button, allowedSizes: (RibbonItemSize.Small | RibbonItemSize. Medium | RibbonItemSize.Large), buttonSettings: { content: 'copy', iconCss: 'e-icons e-copy', } },
                    ]
                }]
            }, {
                header: "group2Header",
                orientation: 'Column',
                collections: [{
                    items: [{
                        type: RibbonItemType.ComboBox,
                        comboBoxSettings: { dataSource: sportsData, width: '150px', index: 1 }
                    }, {
                        type: RibbonItemType.ComboBox,
                        comboBoxSettings: { dataSource: sportsData, width: '150px', index: 2 }
                    }, {
                        type: RibbonItemType.ComboBox,
                        comboBoxSettings: { dataSource: sportsData, width: '150px', index: 3 }
                    }]
                }]
            }, {
                header: "group3Header",
                orientation: 'Row',
                collections: [{
                    items: [{
                        type: RibbonItemType.Button,
                        allowedSizes: (RibbonItemSize.Small | RibbonItemSize. Medium | RibbonItemSize.Large),
                        buttonSettings: { content: 'cut', iconCss: 'e-icons e-cut', clicked: (e) => { console.log(e); alert("Cut clicked"); } }
                    }, {
                        type: RibbonItemType.Button,
                        allowedSizes: (RibbonItemSize.Small | RibbonItemSize. Medium | RibbonItemSize.Large),
                        buttonSettings: { content: 'copy', iconCss: 'e-icons e-copy', clicked: (e) => { console.log(e); alert("Copy clicked"); } }
                    }, {
                        type: RibbonItemType.Button,
                        allowedSizes: (RibbonItemSize.Small | RibbonItemSize. Medium | RibbonItemSize.Large),
                        buttonSettings: { content: 'Paste', iconCss: 'e-icons e-paste', clicked: (e) => { console.log(e); alert("Paste clicked"); } }
                    }]
                }]
            }, {
                header: "group4Header",
                orientation: 'Row',
                collections: [{
                    items: [{
                        type: RibbonItemType.Button,
                        allowedSizes: (RibbonItemSize.Small | RibbonItemSize. Medium | RibbonItemSize.Large),
                        buttonSettings: { content: 'cut', iconCss: 'e-icons e-cut', clicked: (e) => { console.log(e); alert("Cut clicked"); } }
                    }, {
                        type: RibbonItemType.Button,
                        allowedSizes: (RibbonItemSize.Small | RibbonItemSize. Medium | RibbonItemSize.Large),
                        buttonSettings: { content: 'copy', iconCss: 'e-icons e-copy', clicked: (e) => { console.log(e); alert("Copy clicked"); } }
                    }, {
                        type: RibbonItemType.Button,
                        allowedSizes: (RibbonItemSize.Small | RibbonItemSize. Medium | RibbonItemSize.Large),
                        buttonSettings: { content: 'Paste', iconCss: 'e-icons e-paste', clicked: (e) => { console.log(e); alert("Paste clicked"); } }
                    }]
                }]
            }, {
                header: "group13Header",
                orientation: 'Row',
                collections: [{
                    cssClass: "red",
                    items: [{
                        type: RibbonItemType.Button,
                        allowedSizes: (RibbonItemSize.Small | RibbonItemSize. Medium | RibbonItemSize.Large),
                        buttonSettings: { content: 'cut1', iconCss: 'e-icons e-cut', clicked: (e) => { console.log(e); alert("Cut clicked"); } }                   
                    }, {
                        type: RibbonItemType.Button,
                        allowedSizes: (RibbonItemSize.Small | RibbonItemSize. Medium | RibbonItemSize.Large),
                        buttonSettings: { content: 'Paste Options1', iconCss: 'e-icons e-paste', clicked: (e) => { console.log(e); alert("Paste clicked"); } }
                    }]
                }]
            }]
        }];

        it('resize 2 items in the shrink column', () => {
            containerEle.style.width = '1600px';
            ribbon = new Ribbon({
                tabs:tabs1
            }, ribbonEle);
            //maximum size, no resizing happened
            expect(document.querySelectorAll('button.e-ribbon-group-overflow-ddb').length).toBe(0);
            containerEle.style.width = '650px';
            ribbon.refreshLayout();
            expect(document.querySelectorAll('button.e-ribbon-group-overflow-ddb').length).toBe(5);
            containerEle.style.width = '1600px';
            ribbon.refreshLayout();
            expect(document.querySelectorAll('button.e-ribbon-group-overflow-ddb').length).toBe(0);
        });
        
        let tabs2: RibbonTabModel[] =  [{
            id: "tab1",
            header: "tab1",
            groups: [{
                header: "group1Header",
                orientation: 'Column',
                collections: [{
                    cssClass: "red",
                    items: [
                        { type: RibbonItemType.Button, allowedSizes: (RibbonItemSize.Small | RibbonItemSize. Medium | RibbonItemSize.Large), buttonSettings: { content: 'cut', iconCss: 'e-icons e-cut', } },
                        { type: RibbonItemType.Button, allowedSizes: (RibbonItemSize.Small | RibbonItemSize. Medium | RibbonItemSize.Large), buttonSettings: { content: 'copy', iconCss: 'e-icons e-copy', } },
                        { type: RibbonItemType.Button, allowedSizes: (RibbonItemSize.Small | RibbonItemSize. Medium | RibbonItemSize.Large), buttonSettings: { content: 'Paste options', iconCss: 'e-icons e-paste', } }
                    ]
                }, {
                    cssClass: "greenyellow",
                    items: [
                        { type: RibbonItemType.Button, allowedSizes: (RibbonItemSize.Small | RibbonItemSize. Medium), buttonSettings: { content: 'cut', iconCss: 'e-icons e-cut', } },
                        // { type: RibbonItemType.Button, allowedSizes: (RibbonItemSize.Small | RibbonItemSize. Medium), buttonSettings: { content: 'copy', iconCss: 'e-icons e-copy', } },
                        { type: RibbonItemType.Button, allowedSizes: (RibbonItemSize.Small | RibbonItemSize. Medium), buttonSettings: { content: 'Paste options', iconCss: 'e-icons e-paste', } }
                    ]
                }, {
                    cssClass: "orange",
                    items: [
                        { type: RibbonItemType.Button, allowedSizes: (RibbonItemSize.Large | RibbonItemSize. Medium), buttonSettings: { content: 'cut', iconCss: 'e-icons e-cut', } },
                        // { type: RibbonItemType.Button, allowedSizes: (RibbonItemSize.Large | RibbonItemSize. Medium), buttonSettings: { content: 'copy', iconCss: 'e-icons e-copy', } },
                        { type: RibbonItemType.Button, allowedSizes: (RibbonItemSize.Large | RibbonItemSize. Medium), buttonSettings: { content: 'Paste options', iconCss: 'e-icons e-paste', } }
                    ]
                }, {
                    cssClass: "aqua",
                    items: [
                        { type: RibbonItemType.Button, allowedSizes: RibbonItemSize. Medium, buttonSettings: { content: 'cut', iconCss: 'e-icons e-cut', } },
                        { type: RibbonItemType.Button, allowedSizes: RibbonItemSize. Medium, buttonSettings: { content: 'copy', iconCss: 'e-icons e-copy', } },
                        { type: RibbonItemType.Button, allowedSizes: RibbonItemSize. Medium, buttonSettings: { content: 'Paste options', iconCss: 'e-icons e-paste', } }
                    ]
                }, {
                    items: [
                        { type: RibbonItemType.Button, allowedSizes: RibbonItemSize.Large, buttonSettings: { content: 'cut', iconCss: 'e-icons e-cut', } },
                    ]
                }, {
                    items: [
                        { type: RibbonItemType.Button, allowedSizes: (RibbonItemSize.Small | RibbonItemSize. Medium | RibbonItemSize.Large), buttonSettings: { content: 'copy', iconCss: 'e-icons e-copy', } },
                    ]
                }]
            }, {
                header: "group2Header",
                orientation: 'Column',
                collections: [{
                    items: [{
                        type: RibbonItemType.ComboBox,
                        comboBoxSettings: { dataSource: sportsData, width: '150px', index: 1 }
                    }, {
                        type: RibbonItemType.ComboBox,
                        comboBoxSettings: { dataSource: sportsData, width: '150px', index: 2 }
                    }, {
                        type: RibbonItemType.ComboBox,
                        comboBoxSettings: { dataSource: sportsData, width: '150px', index: 3 }
                    }]
                }]
            }, {
                header: "group3Header",
                orientation: 'Row',
                collections: [{
                    items: [{
                        type: RibbonItemType.Button,
                        allowedSizes: (RibbonItemSize.Small | RibbonItemSize. Medium | RibbonItemSize.Large),
                        buttonSettings: { content: 'cut', iconCss: 'e-icons e-cut', clicked: (e) => { console.log(e); alert("Cut clicked"); } }
                    }, {
                        type: RibbonItemType.Button,
                        allowedSizes: (RibbonItemSize.Small | RibbonItemSize. Medium | RibbonItemSize.Large),
                        buttonSettings: { content: 'copy', iconCss: 'e-icons e-copy', clicked: (e) => { console.log(e); alert("Copy clicked"); } }
                    }, {
                        type: RibbonItemType.Button,
                        allowedSizes: (RibbonItemSize.Small | RibbonItemSize. Medium | RibbonItemSize.Large),
                        buttonSettings: { content: 'Paste', iconCss: 'e-icons e-paste', clicked: (e) => { console.log(e); alert("Paste clicked"); } }
                    }]
                }]
            }, {
                header: "group4Header",
                orientation: 'Row',
                collections: [{
                    items: [{
                        type: RibbonItemType.Button,
                        allowedSizes: (RibbonItemSize.Small | RibbonItemSize. Medium | RibbonItemSize.Large),
                        buttonSettings: { content: 'cut', iconCss: 'e-icons e-cut', clicked: (e) => { console.log(e); alert("Cut clicked"); } }
                    }, {
                        type: RibbonItemType.Button,
                        allowedSizes: (RibbonItemSize.Small | RibbonItemSize. Medium | RibbonItemSize.Large),
                        buttonSettings: { content: 'copy', iconCss: 'e-icons e-copy', clicked: (e) => { console.log(e); alert("Copy clicked"); } }
                    }, {
                        type: RibbonItemType.Button,
                        allowedSizes: (RibbonItemSize.Small | RibbonItemSize. Medium | RibbonItemSize.Large),
                        buttonSettings: { content: 'Paste', iconCss: 'e-icons e-paste', clicked: (e) => { console.log(e); alert("Paste clicked"); } }
                    }]
                }]
            }, {
                header: "group13Header",
                orientation: 'Row',
                collections: [{
                    cssClass: "red",
                    items: [{
                        type: RibbonItemType.Button,
                        allowedSizes: RibbonItemSize.Large,
                        buttonSettings: { content: 'cut1', iconCss: 'e-icons e-cut', clicked: (e) => { console.log(e); alert("Cut clicked"); } }                   
                    }, {
                        type: RibbonItemType.Button,
                        allowedSizes: (RibbonItemSize.Small | RibbonItemSize. Medium | RibbonItemSize.Large),
                        buttonSettings: { content: 'Paste Options1', iconCss: 'e-icons e-paste', clicked: (e) => { console.log(e); alert("Paste clicked"); } }
                    }]
                }]
            }]
        }];

        it('resize 2 items in collection and large size only allowed for 2nd item', () => {
            containerEle.style.width = '1600px';
            ribbon = new Ribbon({
                tabs:tabs2
            }, ribbonEle);
            //maximum size, no resizing happened
            expect(document.querySelectorAll('button.e-ribbon-group-overflow-ddb').length).toBe(0);
            containerEle.style.width = '650px';
            ribbon.refreshLayout();
            expect(document.querySelectorAll('button.e-ribbon-group-overflow-ddb').length).toBe(5);
            containerEle.style.width = '1600px';
            ribbon.refreshLayout();
            expect(document.querySelectorAll('button.e-ribbon-group-overflow-ddb').length).toBe(0);
        });

        let tabs3: RibbonTabModel[] = [{
            id: "tab1",
            header: "tab1",
            groups: [{
                header: "group1Header",
                collections: [{
                    items: [
                        { id: "cutItem", type: RibbonItemType.Button, allowedSizes: (RibbonItemSize.Small | RibbonItemSize.Medium | RibbonItemSize.Large), buttonSettings: { content: 'cut', iconCss: 'e-icons e-cut', } },
                    ]
                }, {
                    items: [
                        { id: "copyItem", type: RibbonItemType.Button, allowedSizes: (RibbonItemSize.Large | RibbonItemSize.Medium), buttonSettings: { content: 'copy', iconCss: 'e-icons e-copy', } },
                    ]
                }, {
                    items: [
                        { id: "pasteItem", type: RibbonItemType.Button, allowedSizes: (RibbonItemSize.Large | RibbonItemSize.Medium), buttonSettings: { content: 'Paste options', iconCss: 'e-icons e-paste', } }
                    ]
                }]
            }]
        }]

        it('check the order of items', () => {
            containerEle.style.width = '500px';
            ribbon = new Ribbon({
                tabs: tabs3
            }, ribbonEle);
            containerEle.style.width = '100px';
            ribbon.refreshLayout();
            expect(document.querySelectorAll('.e-ribbon-item')[0].id).toBe('cutItem_container');
            expect(document.querySelectorAll('.e-ribbon-item')[1].id).toBe('copyItem_container');
            expect(document.querySelectorAll('.e-ribbon-item')[2].id).toBe('pasteItem_container');
            containerEle.style.width = '500px';
            ribbon.refreshLayout();
            expect(document.querySelectorAll('.e-ribbon-item')[0].id).toBe('cutItem_container');
            expect(document.querySelectorAll('.e-ribbon-item')[1].id).toBe('copyItem_container');
            expect(document.querySelectorAll('.e-ribbon-item')[2].id).toBe('pasteItem_container');
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
