import { createElement, getComponent, remove } from "@syncfusion/ej2-base";
import { DisplayMode, FileMenuSettingsModel, ItemOrientation, LauncherClickEventArgs, Ribbon, RibbonItemSize, RibbonItemType, RibbonLayout, RibbonTabModel } from "../../src/index";
import { RibbonColorPicker,RibbonFileMenu } from "../../src/index";
import { MenuItemModel } from "@syncfusion/ej2-navigations";
import { BeforeOpenCloseMenuEventArgs, ClickEventArgs, DropDownButton, ItemModel, MenuEventArgs } from "@syncfusion/ej2-splitbuttons";
import { SelectEventArgs } from "@syncfusion/ej2-dropdowns";
import { ChangeEventArgs as CheckChange } from "@syncfusion/ej2-buttons";
import { ChangeEventArgs } from "@syncfusion/ej2-inputs";
import { BeforeCloseEventArgs } from "@syncfusion/ej2-popups";

Ribbon.Inject(RibbonColorPicker,RibbonFileMenu);

let dropDownButtonItems: ItemModel[] = [
    { text: 'New tab' },
    { text: 'New window' },
    { text: 'New incognito window' },
    { separator: true },
    { text: 'Print' },
    { text: 'Cast' },
    { text: 'Find' }];
let fontStyle: string[] = ['Algerian', 'Arial', 'Calibri', 'Cambria', 'Cambria Math', 'Candara', 'Courier New', 'Georgia', 'Impact', 'Segoe Print', 'Segoe Script', 'Segoe UI', 'Symbol', 'Times New Roman', 'Verdana', 'Windings'
];
describe('Ribbon Items', () => {
    beforeAll(() => {
        const isDef: any = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log('Unsupported environment, window.performance.memory is unavailable');
            pending(); // skips test (in Chai)
            return;
        }
    });
    describe('All Items', () => {
        let ribbon: Ribbon;
        let ribbonEle: HTMLElement;
        let containerEle: HTMLElement;
        let outputEle: HTMLElement;
        let isCloseCalled: boolean;
        let isColorPickerBeforeClose: boolean;
        let tabs: RibbonTabModel[] = [{
            header: "Home",
            groups: [{
                header: "Large items",
                groupIconCss:'e-icons e-paste',
                showLauncherIcon: true,
                orientation: ItemOrientation.Row,
                id:'large',
                collections: [{
                    items: [{
                        id: 'largepaste',
                        type: RibbonItemType.SplitButton,
                        allowedSizes: RibbonItemSize.Large ,
                        splitButtonSettings: {
                            select: (args: MenuEventArgs)=>{
                                outputEle.innerText = ("Large " + args.item.text);
                            },
                            click: (args: ClickEventArgs)=>{
                                outputEle.innerText = ("Large " + "Paste Clicked");
                            },
                            content: 'Paste',
                            cssClass: 'test-css',
                            iconCss: 'e-icons e-paste',
                            items: [{ text: 'Keep Source Format' }, { text: 'Merge format' }, { text: 'Keep text only' }],
                            close: ()=>{ isCloseCalled = true; },
                            htmlAttributes: { 'data-id': 'largepaste' }
                        }
                    },{
                        type: RibbonItemType.DropDown,
                        allowedSizes: RibbonItemSize.Large ,
                        id: 'largetable',
                        dropDownSettings: {
                            select: (args: MenuEventArgs)=>{
                                outputEle.innerText = ("Large " + args.item.text);
                            },
                            content: 'Table',
                            iconCss: 'e-icons e-table',
                            cssClass: 'test-css',
                            items: [
                                { text: 'Insert Table' }, { text: 'Draw Table' },
                                { text: 'Convert Table' }, { text: 'Excel SpreadSheet' }
                            ],
                            close: ()=>{ isCloseCalled = true; },
                            htmlAttributes: { 'data-id': 'largetable' }
                        }
                    },{
                        type: RibbonItemType.Button,
                        id: 'largecut',
                        allowedSizes: RibbonItemSize.Large ,
                        cssClass: 'test-css',
                        buttonSettings: {
                            clicked: ()=>{
                                outputEle.innerText = ("Large " + "Cut Clicked");
                            },
                            content: 'cut',
                            iconCss: 'e-icons e-cut',
                            htmlAttributes: { 'data-id': 'largecut' }
                        }
                    }]
                },]
            },{
                header: "Medium items",
                groupIconCss:'e-icons e-paste',
                showLauncherIcon: true,
                orientation: ItemOrientation.Column,
                id:'medium',
                collections: [{
                    items: [{
                        type: RibbonItemType.SplitButton,
                        id: 'mediumpaste',
                        allowedSizes: RibbonItemSize.Medium ,
                        splitButtonSettings: {
                            select: (args: MenuEventArgs)=>{
                                outputEle.innerText = ("Medium " + args.item.text);
                            },
                            content: 'Paste',
                            iconCss: 'e-icons e-paste',
                            items: [{ text: 'Keep Source Format' }, { text: 'Merge format' }, { text: 'Keep text only' }],
                            close: ()=>{ isCloseCalled = true; }
                        }
                    },{
                        type: RibbonItemType.DropDown,
                        allowedSizes: RibbonItemSize.Medium ,
                        id: 'mediumtable',
                        dropDownSettings: {
                            select: (args: MenuEventArgs)=>{
                                outputEle.innerText = ("Medium " + args.item.text);
                            },
                            content: 'Table',
                            iconCss: 'e-icons e-table',
                            items: [
                                { text: 'Insert Table' }, { text: 'Draw Table' },
                                { text: 'Convert Table' }, { text: 'Excel SpreadSheet' }
                            ],
                            close: ()=>{ isCloseCalled = true; }
                        }
                    },{
                        type: RibbonItemType.Button,
                        id: 'mediumcut',
                        allowedSizes: RibbonItemSize.Medium ,
                        buttonSettings: {
                            clicked: ()=>{
                                outputEle.innerText = ("Medium " + "Cut Clicked");
                            },
                            content: 'cut',
                            iconCss: 'e-icons e-cut'
                        }
                    }]
                },]
            },{
                header: "Small items",
                groupIconCss:'e-icons e-paste',
                showLauncherIcon: true,
                orientation: ItemOrientation.Column,
                id: 'small',
                collections: [{
                    items: [{
                        type: RibbonItemType.SplitButton,
                        id: 'smallpaste',
                        allowedSizes: RibbonItemSize.Small ,
                        splitButtonSettings: {
                            select: (args: MenuEventArgs)=>{
                                outputEle.innerText = ("Small " + args.item.text);
                            },
                            content: 'Paste',
                            iconCss: 'e-icons e-paste',
                            items: [{ text: 'Keep Source Format' }, { text: 'Merge format' }, { text: 'Keep text only' }],
                            close: ()=>{ isCloseCalled = true; }
                        }
                    },{
                        type: RibbonItemType.DropDown,
                        id: 'smalltable',
                        allowedSizes: RibbonItemSize.Small ,
                        dropDownSettings: {
                            select: (args: MenuEventArgs)=>{
                                outputEle.innerText = ("Small " + args.item.text);
                            },
                            content: 'Table',
                            iconCss: 'e-icons e-table',
                            items: [
                                { text: 'Insert Table' }, { text: 'Draw Table' },
                                { text: 'Convert Table' }, { text: 'Excel SpreadSheet' }
                            ],
                            close: ()=>{ isCloseCalled = true; }
                        }
                    },{
                        type: RibbonItemType.Button,
                        id: 'smallcut',
                        allowedSizes: RibbonItemSize.Small,
                        buttonSettings: {
                            clicked: ()=>{
                                outputEle.innerText = ("Small " + "Cut Clicked");
                            },
                            content: 'cut',
                            iconCss: 'e-icons e-cut'
                        }
                    }]
                },]
            }, {
                header: "Font",
                orientation: 'Row',
                groupIconCss:'e-icons e-bold',
                cssClass: 'font-group',
                id: 'font',
                collections: [{
                    items: [{
                        type: RibbonItemType.ComboBox,
                        id: 'fontfamily',
                        comboBoxSettings: {
                            select: (args: SelectEventArgs)=>{
                                outputEle.innerText = ("Font " + args.itemData.text);
                            },
                            dataSource: fontStyle,
                            cssClass: 'test-css',
                            index: 2,
                            allowFiltering: true,
                            close: ()=>{ isCloseCalled = true; },
                            htmlAttributes: { 'data-id': 'fontfamily' }
                        }
                    }]
                }, {
                    items: [{
                        type: RibbonItemType.CheckBox,
                        id: 'fontbold',
                        checkBoxSettings: {
                            cssClass: 'test-css',
                            change: (args: CheckChange)=>{
                                outputEle.innerText = ("Font " + args.checked);
                            },
                            label: 'Ruler',
                            checked: false,
                            htmlAttributes: { 'data-id': 'fontbold' }
                        }
                    }, {
                        type: RibbonItemType.ColorPicker,
                        id: 'fontcolor',
                        colorPickerSettings: {
                            cssClass: 'test-css',
                            change: (args: ChangeEventArgs)=>{
                                outputEle.innerText = ("Font " + args.value);
                            },
                            beforeClose: (args: BeforeCloseEventArgs) => {
                                isColorPickerBeforeClose = true;
                            },
                            value: '#123456',
                            htmlAttributes: { 'data-id': 'fontcolor' }
                        }
                    } ]
                }]
            },{
                header: "GroupOverflow btn",
                groupIconCss:'e-icons e-paste',
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
                            select: (args: MenuEventArgs)=>{
                                outputEle.innerText = ("GroupOverflow " + args.item.text);
                            },
                            content: 'Paste',
                            iconCss: 'e-icons e-paste',
                            items: [{ text: 'Keep Source Format' }, { text: 'Merge format' }, { text: 'Keep text only' }],
                            close: ()=>{ isCloseCalled = true; }
                        }
                    },{
                        type: RibbonItemType.DropDown,
                        displayOptions: DisplayMode.Overflow,
                        id: 'groupoverflowtable',
                        allowedSizes: RibbonItemSize.Large ,
                        dropDownSettings: {
                            select: (args: MenuEventArgs)=>{
                                outputEle.innerText = ("GroupOverflow " + args.item.text);
                            },
                            content: 'Table',
                            iconCss: 'e-icons e-table',
                            items: [
                                { text: 'Insert Table' }, { text: 'Draw Table' },
                                { text: 'Convert Table' }, { text: 'Excel SpreadSheet' }
                            ],
                            close: ()=>{ isCloseCalled = true; }
                        }
                    },{
                        type: RibbonItemType.Button,
                        id: 'groupoverflowcut',
                        allowedSizes: RibbonItemSize.Large ,
                        buttonSettings: {
                            clicked: ()=>{
                                outputEle.innerText = ("GroupOverflow " + "Cut Clicked");
                            },
                            content: 'cut',
                            iconCss: 'e-icons e-cut'
                        }
                    }]
                },]
            }, {
                header: "GroupOverflow",
                orientation: 'Row',
                groupIconCss:'e-icons e-bold',
                enableGroupOverflow: true,
                cssClass: 'font-group',
                id: 'groupoverflow2',
                collections: [{
                    items: [{
                        type: RibbonItemType.ComboBox,
                        id: 'groupoverflowfontfamily',
                        displayOptions: DisplayMode.Overflow,
                        comboBoxSettings: {
                            select: (args: SelectEventArgs)=>{
                                outputEle.innerText = ("GroupOverflow " + args.itemData.text);
                            },
                            dataSource: fontStyle,
                            index: 2,
                            allowFiltering: true,
                            width: '150px',
                            close: ()=>{ isCloseCalled = true; }
                        }
                    }]
                }, {
                    items: [{
                        type: RibbonItemType.CheckBox,
                        id: 'groupoverflowfontbold',
                        checkBoxSettings: {
                            change: (args: CheckChange)=>{
                                outputEle.innerText = ("GroupOverflow " + args.checked);
                            },
                            label: 'Ruler',
                            checked: false
                        }
                    }, {
                        type: RibbonItemType.ColorPicker,
                        id: 'groupoverflowfontcolor',
                        colorPickerSettings: {
                            change: (args: ChangeEventArgs)=>{
                                outputEle.innerText = ("GroupOverflow " + args.value);
                            },
                            value: '#123456',
                        }
                    } ]
                }]
            },{
                header: "CmnOverflow btn",
                groupIconCss:'e-icons e-paste',
                id: 'CmnOverflow1',
                showLauncherIcon: true,
                orientation: ItemOrientation.Row,
                collections: [{
                    items: [{
                        type: RibbonItemType.SplitButton,
                        id: 'commonoverflowpaste',
                        allowedSizes: RibbonItemSize.Large ,
                        splitButtonSettings: {
                            select: (args: MenuEventArgs)=>{
                                outputEle.innerText = ("commonOverflow " + args.item.text);
                            },
                            click: (args: ClickEventArgs)=>{
                                outputEle.innerText = ("commonOverflow " + "Paste Clicked");
                            },
                            content: 'Paste',
                            iconCss: 'e-icons e-paste',
                            items: [{ text: 'Keep Source Format' }, { text: 'Merge format' }, { text: 'Keep text only' }],
                            close: ()=>{ isCloseCalled = true; }
                        }
                    },{
                        type: RibbonItemType.DropDown,
                        displayOptions: DisplayMode.Overflow,
                        id: 'commonoverflowtable',
                        allowedSizes: RibbonItemSize.Large ,
                        dropDownSettings: {
                            select: (args: MenuEventArgs)=>{
                                outputEle.innerText = ("commonOverflow " + args.item.text);
                            },
                            content: 'Table',
                            iconCss: 'e-icons e-table',
                            items: [
                                { text: 'Insert Table' }, { text: 'Draw Table' },
                                { text: 'Convert Table' }, { text: 'Excel SpreadSheet' }
                            ],
                            close: ()=>{ isCloseCalled = true; }
                        }
                    },{
                        type: RibbonItemType.Button,
                        id: 'commonoverflowcut',
                        allowedSizes: RibbonItemSize.Large ,
                        buttonSettings: {
                            clicked: ()=>{
                                outputEle.innerText = ("commonOverflow " + "Cut Clicked");
                            },
                            content: 'cut',
                            iconCss: 'e-icons e-cut'
                        }
                    }]
                },]
            }, {
                header: "CmnOverflow",
                id: 'CmnOverflow2',
                orientation: 'Row',
                groupIconCss:'e-icons e-bold',
                cssClass: 'font-group',
                collections: [{
                    items: [{
                        type: RibbonItemType.ComboBox,
                        id: 'commonoverflowfontfamily',
                        comboBoxSettings: {
                            select: (args: SelectEventArgs)=>{
                                outputEle.innerText = ("commonOverflow " + args.itemData.text);
                            },
                            dataSource: fontStyle,
                            index: 2,
                            allowFiltering: true,
                            width: '150px',
                            close: ()=>{ isCloseCalled = true; }
                        }
                    }]
                }, {
                    items: [{
                        type: RibbonItemType.CheckBox,
                        displayOptions: DisplayMode.Overflow,
                        id: 'commonoverflowfontbold',
                        checkBoxSettings: {
                            change: (args: CheckChange)=>{
                                outputEle.innerText = ("commonOverflow " + args.checked);
                            },
                            label: 'Ruler',
                            checked: false
                        }
                    }, {
                        type: RibbonItemType.ColorPicker,
                        displayOptions: DisplayMode.Overflow,
                        id: 'commonoverflowfontcolor',
                        colorPickerSettings: {
                            change: (args: ChangeEventArgs)=>{
                                outputEle.innerText = ("commonOverflow " + args.value);
                            },
                            value: '#123456',
                        }
                    } ]
                }]
            }]
        }];
        beforeEach(() => {
            ribbonEle = createElement('div', { id: 'ribbon' });
            containerEle = createElement('div', { id: 'container', styles: 'width:1600px' });
            containerEle.appendChild(ribbonEle);
            document.body.appendChild(containerEle);
            outputEle = createElement('div', { id: 'output' });
            document.body.appendChild(outputEle);
            isCloseCalled = false;
            isColorPickerBeforeClose = false;
        })
        afterEach(() => {
            if (ribbon) {
                ribbon.destroy();
                ribbon = undefined;
            }
            remove(ribbonEle);
            remove(containerEle);
            remove(outputEle);
        });
        it('Classic Splitbutton', () => {
                ribbon = new Ribbon({
                tabs: tabs
            });
            ribbon.appendTo("#ribbon");
            expect(document.getElementById('largepaste_dropdownbtn-popup').classList.contains('e-popup-open')).toBe(false);
            document.getElementById('largepaste_dropdownbtn').click();
            ribbon.ribbonSplitButtonModule.updateSplitButton({cssClass : 'coveragecss'}, 'largepaste');
            expect(document.getElementById('largepaste_dropdownbtn-popup').classList.contains('e-popup-open')).toBe(true);
            document.getElementById('largepaste_dropdownbtn-popup').querySelector('li').click();
            expect(outputEle.innerText.toLowerCase()).toBe('large keep source format');
            document.getElementById('largepaste').click();
            expect(outputEle.innerText.toLowerCase()).toBe('large paste clicked');
            expect(document.getElementById('mediumpaste_dropdownbtn-popup').classList.contains('e-popup-open')).toBe(false);
            document.getElementById('mediumpaste_dropdownbtn').click();
            expect(document.getElementById('mediumpaste_dropdownbtn-popup').classList.contains('e-popup-open')).toBe(true);
            document.getElementById('mediumpaste_dropdownbtn-popup').querySelector('li').click();
            expect(outputEle.innerText.toLowerCase()).toBe('medium keep source format');
            expect(document.getElementById('smallpaste_dropdownbtn-popup').classList.contains('e-popup-open')).toBe(false);
            ribbon.ribbonSplitButtonModule.updateSplitButton({cssClass : 'coveragecss'}, 'smallpaste');
            document.getElementById('smallpaste_dropdownbtn').click();
            expect(document.getElementById('smallpaste_dropdownbtn-popup').classList.contains('e-popup-open')).toBe(true);
            document.getElementById('smallpaste_dropdownbtn-popup').querySelector('li').click();
            expect(outputEle.innerText.toLowerCase()).toBe('small keep source format');
            expect(isCloseCalled).toBe(true);
            containerEle.style.width = '600px';
            ribbon.refreshLayout();
            isCloseCalled = false;
            document.getElementById('large_overflow_dropdown').click();
            expect(document.getElementById('largepaste_dropdownbtn-popup').classList.contains('e-popup-open')).toBe(false);
            document.getElementById('largepaste_dropdownbtn').click();
            expect(document.getElementById('largepaste_dropdownbtn-popup').classList.contains('e-popup-open')).toBe(true);
            document.getElementById('largepaste_dropdownbtn-popup').querySelector('li').click();
            expect(outputEle.innerText.toLowerCase()).toBe('large keep source format');
            document.getElementById('medium_overflow_dropdown').click();
            expect(document.getElementById('mediumpaste_dropdownbtn-popup').classList.contains('e-popup-open')).toBe(false);
            document.getElementById('mediumpaste_dropdownbtn').click();
            expect(document.getElementById('mediumpaste_dropdownbtn-popup').classList.contains('e-popup-open')).toBe(true);
            document.getElementById('mediumpaste_dropdownbtn-popup').querySelector('li').click();
            expect(outputEle.innerText.toLowerCase()).toBe('medium keep source format');
            document.getElementById('small_overflow_dropdown').click();
            expect(document.getElementById('smallpaste_dropdownbtn-popup').classList.contains('e-popup-open')).toBe(false);
            document.getElementById('smallpaste_dropdownbtn').click();
            expect(document.getElementById('smallpaste_dropdownbtn-popup').classList.contains('e-popup-open')).toBe(true);
            document.getElementById('smallpaste_dropdownbtn-popup').querySelector('li').click();
            expect(outputEle.innerText.toLowerCase()).toBe('small keep source format');
            expect(isCloseCalled).toBe(true);
        });
        it('Simplfied Splitbutton', () => { 
                ribbon =  new Ribbon({
                tabs: tabs,
                activeLayout: RibbonLayout.Simplified
            });
            ribbon.appendTo("#ribbon");
            expect(document.getElementById('largepaste_dropdownbtn-popup').classList.contains('e-popup-open')).toBe(false);
            document.getElementById('largepaste_dropdownbtn').click();
            expect(document.getElementById('largepaste_dropdownbtn-popup').classList.contains('e-popup-open')).toBe(true);
            document.getElementById('largepaste_dropdownbtn-popup').querySelector('li').click();
            expect(outputEle.innerText.toLowerCase()).toBe('large keep source format');
            expect(isCloseCalled).toBe(true);
            ribbon.ribbonSplitButtonModule.updateSplitButton({click : null}, 'largepaste');
            document.getElementById('largepaste').click();
        });
        it('Group Overflow Splitbutton', () => { 
                ribbon = new Ribbon({
                tabs: tabs,
                activeLayout: RibbonLayout.Simplified
            });
            ribbon.appendTo("#ribbon");
            getComponent<DropDownButton>( 'groupoverflow1_sim_grp_overflow', DropDownButton).toggle();
            expect(document.getElementById('groupoverflowpaste_dropdownbtn-popup').classList.contains('e-popup-open')).toBe(false);
            document.getElementById('groupoverflowpaste_dropdownbtn').click();
            expect(document.getElementById('groupoverflowpaste_dropdownbtn-popup').classList.contains('e-popup-open')).toBe(true);
            document.getElementById('groupoverflowpaste_dropdownbtn-popup').querySelector('li').click();
            expect(outputEle.innerText.toLowerCase()).toBe('groupoverflow keep source format');
            expect(isCloseCalled).toBe(true);
            ribbon.setProperties({activeLayout: RibbonLayout.Classic});
            isCloseCalled = false;
            expect(document.getElementById('groupoverflowpaste_dropdownbtn-popup').classList.contains('e-popup-open')).toBe(false);
            document.getElementById('groupoverflowpaste_dropdownbtn').click();
            expect(document.getElementById('groupoverflowpaste_dropdownbtn-popup').classList.contains('e-popup-open')).toBe(true);
            document.getElementById('groupoverflowpaste_dropdownbtn-popup').querySelector('li').click();
            expect(outputEle.innerText.toLowerCase()).toBe('groupoverflow keep source format');
            expect(isCloseCalled).toBe(true);
            //for coverage.
            ribbon.ribbonSplitButtonModule.updateSplitButton({close : null}, 'groupoverflowpaste');
            isCloseCalled = false;
            expect(document.getElementById('groupoverflowpaste_dropdownbtn-popup').classList.contains('e-popup-open')).toBe(false);
            document.getElementById('groupoverflowpaste_dropdownbtn').click();
            expect(document.getElementById('groupoverflowpaste_dropdownbtn-popup').classList.contains('e-popup-open')).toBe(true);
            document.getElementById('groupoverflowpaste_dropdownbtn-popup').querySelector('li').click();
            expect(outputEle.innerText.toLowerCase()).toBe('groupoverflow keep source format');
            expect(isCloseCalled).toBe(false);
            ribbon.setProperties({activeLayout: RibbonLayout.Simplified});
            getComponent<DropDownButton>( 'groupoverflow1_sim_grp_overflow', DropDownButton).toggle();
            expect(document.getElementById('groupoverflowpaste_dropdownbtn-popup').classList.contains('e-popup-open')).toBe(false);
            document.getElementById('groupoverflowpaste_dropdownbtn').click();
            expect(document.getElementById('groupoverflowpaste_dropdownbtn-popup').classList.contains('e-popup-open')).toBe(true);
            document.getElementById('groupoverflowpaste_dropdownbtn-popup').querySelector('li').click();
            expect(outputEle.innerText.toLowerCase()).toBe('groupoverflow keep source format');
            expect(isCloseCalled).toBe(false);
        });
        it('OverAll Overflow Splitbutton', () => {
                ribbon = new Ribbon({
                    activeLayout: RibbonLayout.Simplified,
                    tabs: [{
                        groups: [{                            
                        header: "CmnOverflow btn",
                        groupIconCss:'e-icons e-paste',
                        id: 'CmnOverflow1',
                        showLauncherIcon: true,
                        orientation: ItemOrientation.Row,
                        collections: [{
                            items: [{
                                type: RibbonItemType.SplitButton,
                                displayOptions: DisplayMode.Overflow | DisplayMode.Classic,
                                id: 'commonoverflowpaste',
                                allowedSizes: RibbonItemSize.Large ,
                                splitButtonSettings: {
                                    select: (args: MenuEventArgs)=>{
                                        outputEle.innerText = ("commonOverflow " + args.item.text);
                                    },
                                    click: (args: ClickEventArgs)=>{
                                        outputEle.innerText = ("commonOverflow " + "Paste Clicked");
                                    },
                                    content: 'Paste',
                                    iconCss: 'e-icons e-paste',
                                    items: [{ text: 'Keep Source Format' }, { text: 'Merge format' }, { text: 'Keep text only' }],
                                    close: ()=>{ isCloseCalled = true; }
                                }
                            },{
                                type: RibbonItemType.DropDown,
                                displayOptions: DisplayMode.Overflow,
                                id: 'commonoverflowtable',
                                allowedSizes: RibbonItemSize.Large ,
                                dropDownSettings: {
                                    select: (args: MenuEventArgs)=>{
                                        outputEle.innerText = ("commonOverflow " + args.item.text);
                                    },
                                    content: 'Table',
                                    iconCss: 'e-icons e-table',
                                    items: [
                                        { text: 'Insert Table' }, { text: 'Draw Table' },
                                        { text: 'Convert Table' }, { text: 'Excel SpreadSheet' }
                                    ],
                                    close: ()=>{ isCloseCalled = true; }
                                }
                            },{
                                type: RibbonItemType.Button,
                                // displayOptions: DisplayMode.Overflow,
                                id: 'commonoverflowcut',
                                allowedSizes: RibbonItemSize.Large ,
                                buttonSettings: {
                                    clicked: ()=>{
                                        outputEle.innerText = ("commonOverflow " + "Cut Clicked");
                                    },
                                    content: 'cut',
                                    iconCss: 'e-icons e-cut'
                                }
                            }]
                        },]
                    }, {
                        header: "CmnOverflow",
                        id: 'CmnOverflow2',
                        orientation: 'Row',
                        groupIconCss:'e-icons e-bold',
                        cssClass: 'font-group',
                        collections: [{
                            items: [{
                                type: RibbonItemType.ComboBox,
                                id: 'commonoverflowfontfamily',
                                comboBoxSettings: {
                                    select: (args: SelectEventArgs)=>{
                                        outputEle.innerText = ("commonOverflow " + args.itemData.text);
                                    },
                                    dataSource: fontStyle,
                                    index: 2,
                                    allowFiltering: true,
                                    width: '150px',
                                    close: ()=>{ isCloseCalled = true; }
                                }
                            }]
                        }, {
                            items: [{
                                type: RibbonItemType.CheckBox,
                                displayOptions: DisplayMode.Overflow,
                                id: 'commonoverflowfontbold',
                                checkBoxSettings: {
                                    change: (args: CheckChange)=>{
                                        outputEle.innerText = ("commonOverflow " + args.checked);
                                    },
                                    label: 'Ruler',
                                    checked: false
                                }
                            }, {
                                type: RibbonItemType.ColorPicker,
                                displayOptions: DisplayMode.Overflow,
                                id: 'commonoverflowfontcolor',
                                colorPickerSettings: {
                                    change: (args: ChangeEventArgs)=>{
                                        outputEle.innerText = ("commonOverflow " + args.value);
                                    },
                                    value: '#123456',
                                }
                            }]
                        }]
                    }]
                }]                
            });
            ribbon.appendTo("#ribbon");
            ribbon.overflowDDB.toggle();
            expect(document.getElementById('commonoverflowpaste_dropdownbtn-popup').classList.contains('e-popup-open')).toBe(false);
            document.getElementById('commonoverflowpaste_dropdownbtn').click();
            expect(ribbon.overflowDDB.dropDown.element.classList.contains('e-popup-open')).toBe(true);
            expect(document.getElementById('commonoverflowpaste_dropdownbtn-popup').classList.contains('e-popup-open')).toBe(true);
            document.getElementById('commonoverflowpaste_dropdownbtn-popup').querySelector('li').click();
            expect(outputEle.innerText.toLowerCase()).toBe('commonoverflow keep source format');
            expect(isCloseCalled).toBe(true);
            expect(ribbon.overflowDDB.dropDown.element.classList.contains('e-popup-close')).toBe(true);
            ribbon.overflowDDB.toggle();
            expect(ribbon.overflowDDB.dropDown.element.classList.contains('e-popup-open')).toBe(true);
            document.getElementById('commonoverflowpaste').click();
            expect(ribbon.overflowDDB.dropDown.element.classList.contains('e-popup-close')).toBe(true);
            expect(outputEle.innerText.toLowerCase()).toBe('commonoverflow paste clicked');
            //for coverage.
            ribbon.ribbonSplitButtonModule.updateSplitButton({close : null}, 'commonoverflowpaste');
            isCloseCalled = false;
            ribbon.setProperties({activeLayout: RibbonLayout.Classic});
            expect(document.getElementById('commonoverflowpaste_dropdownbtn-popup').classList.contains('e-popup-open')).toBe(false);
            document.getElementById('commonoverflowpaste_dropdownbtn').click();
            expect(document.getElementById('commonoverflowpaste_dropdownbtn-popup').classList.contains('e-popup-open')).toBe(true);
            document.getElementById('commonoverflowpaste_dropdownbtn-popup').querySelector('li').click();
            expect(outputEle.innerText.toLowerCase()).toBe('commonoverflow keep source format');
            document.getElementById('commonoverflowpaste').click();
            expect(outputEle.innerText.toLowerCase()).toBe('commonoverflow paste clicked');
            expect(isCloseCalled).toBe(false);
            ribbon.setProperties({activeLayout: RibbonLayout.Simplified});
            ribbon.overflowDDB.toggle();
            expect(document.getElementById('commonoverflowpaste_dropdownbtn-popup').classList.contains('e-popup-open')).toBe(false);
            document.getElementById('commonoverflowpaste_dropdownbtn').click();
            expect(document.getElementById('commonoverflowpaste_dropdownbtn-popup').classList.contains('e-popup-open')).toBe(true);
            document.getElementById('commonoverflowpaste_dropdownbtn-popup').querySelector('li').click();
            expect(outputEle.innerText.toLowerCase()).toBe('commonoverflow keep source format');
            ribbon.overflowDDB.toggle();
            document.getElementById('commonoverflowpaste').click();
            expect(outputEle.innerText.toLowerCase()).toBe('commonoverflow paste clicked');
            expect(isCloseCalled).toBe(false);
            ribbon.ribbonSplitButtonModule.updateSplitButton({click : null}, 'commonoverflowpaste');
            outputEle.innerText = '';
            ribbon.overflowDDB.toggle();
            document.getElementById('commonoverflowpaste').click();
            expect(outputEle.innerText.toLowerCase()).toBe('');
            expect(document.getElementById('commonoverflowpaste_dropdownbtn-popup').classList.contains('e-popup-close')).toBe(true);
            ribbon.setProperties({activeLayout: RibbonLayout.Classic});
            document.getElementById('commonoverflowpaste').click();
            expect(outputEle.innerText.toLowerCase()).toBe('');
        });
        it('Classic DropdownButton', () => {
                ribbon = new Ribbon({
                tabs: tabs
            });
            ribbon.appendTo("#ribbon");
            expect(document.getElementById('largetable-popup') !== null).toBe(true);
            ribbon.ribbonDropDownModule.updateDropDown({ createPopupOnClick: true }, 'largetable');
            expect(document.getElementById('largetable-popup') !== null).toBe(false);
            ribbon.ribbonDropDownModule.updateDropDown({ createPopupOnClick: false }, 'largetable');
            expect(document.getElementById('largetable-popup') !== null).toBe(true);
            expect(document.getElementById('largetable-popup').classList.contains('e-popup-open')).toBe(false);
            document.getElementById('largetable').click();
            expect(document.getElementById('largetable-popup').classList.contains('e-popup-open')).toBe(true);
            document.getElementById('largetable-popup').querySelector('li').click();
            expect(outputEle.innerText.toLowerCase()).toBe('large insert table');
            expect(document.getElementById('mediumtable-popup').classList.contains('e-popup-open')).toBe(false);
            document.getElementById('mediumtable').click();
            expect(document.getElementById('mediumtable-popup').classList.contains('e-popup-open')).toBe(true);
            document.getElementById('mediumtable-popup').querySelector('li').click();
            expect(outputEle.innerText.toLowerCase()).toBe('medium insert table');
            ribbon.ribbonDropDownModule.updateDropDown({close : null}, 'smalltable');
            expect(document.getElementById('smalltable-popup').classList.contains('e-popup-open')).toBe(false);
            document.getElementById('smalltable').click();
            expect(document.getElementById('smalltable-popup').classList.contains('e-popup-open')).toBe(true);
            document.getElementById('smalltable-popup').querySelector('li').click();
            expect(outputEle.innerText.toLowerCase()).toBe('small insert table');
            containerEle.style.width = '600px';
            ribbon.refreshLayout();
            document.getElementById('large_overflow_dropdown').click();
            expect(document.getElementById('largetable-popup').classList.contains('e-popup-open')).toBe(false);
            document.getElementById('largetable').click();
            expect(document.getElementById('largetable-popup').classList.contains('e-popup-open')).toBe(true);
            document.getElementById('largetable-popup').querySelector('li').click();
            expect(outputEle.innerText.toLowerCase()).toBe('large insert table');
            document.getElementById('medium_overflow_dropdown').click();
            expect(document.getElementById('mediumtable-popup').classList.contains('e-popup-open')).toBe(false);
            document.getElementById('mediumtable').click();
            expect(document.getElementById('mediumtable-popup').classList.contains('e-popup-open')).toBe(true);
            document.getElementById('mediumtable-popup').querySelector('li').click();
            expect(outputEle.innerText.toLowerCase()).toBe('medium insert table');
            document.getElementById('small_overflow_dropdown').click();
            expect(document.getElementById('smalltable-popup').classList.contains('e-popup-open')).toBe(false);
            document.getElementById('smalltable').click();
            expect(document.getElementById('smalltable-popup').classList.contains('e-popup-open')).toBe(true);
            document.getElementById('smalltable-popup').querySelector('li').click();
            expect(outputEle.innerText.toLowerCase()).toBe('small insert table');
            containerEle.style.width = '1600px';
            ribbon.refreshLayout();
            expect(document.getElementById('smalltable-popup').classList.contains('e-popup-open')).toBe(false);
            document.getElementById('smalltable').click();
            expect(document.getElementById('smalltable-popup').classList.contains('e-popup-open')).toBe(true);
            document.getElementById('smalltable-popup').querySelector('li').click();
            expect(outputEle.innerText.toLowerCase()).toBe('small insert table');
            expect(document.getElementById('mediumtable-popup').classList.contains('e-popup-open')).toBe(false);
            document.getElementById('mediumtable').click();
            expect(document.getElementById('mediumtable-popup').classList.contains('e-popup-open')).toBe(true);
            document.getElementById('mediumtable-popup').querySelector('li').click();
            expect(outputEle.innerText.toLowerCase()).toBe('medium insert table');
            containerEle.style.width = '600px';
            ribbon.refreshLayout();
            document.getElementById('small_overflow_dropdown').click();
            expect(document.getElementById('smalltable-popup').classList.contains('e-popup-open')).toBe(false);
            document.getElementById('smalltable').click();
            expect(document.getElementById('smalltable-popup').classList.contains('e-popup-open')).toBe(true);
            document.getElementById('smalltable-popup').querySelector('li').dispatchEvent(new Event('mousedown'));
            document.getElementById('smalltable-popup').querySelector('li').click();
            expect(document.getElementById('smalltable-popup').classList.contains('e-popup-open')).toBe(false);
        });
        it('Simplfied DropdownButton', () => { 
                ribbon =  new Ribbon({
                tabs: tabs,
                activeLayout: RibbonLayout.Simplified
            });
            ribbon.appendTo("#ribbon");
            expect(document.getElementById('largetable-popup').classList.contains('e-popup-open')).toBe(false);
            document.getElementById('largetable').click();
            expect(document.getElementById('largetable-popup').classList.contains('e-popup-open')).toBe(true);
            document.getElementById('largetable-popup').querySelector('li').click();
            expect(outputEle.innerText.toLowerCase()).toBe('large insert table');
        });
        it('Group Overflow DropdownButton', () => { 
                ribbon = new Ribbon({
                tabs: tabs,
                activeLayout: RibbonLayout.Simplified
            });
            ribbon.appendTo("#ribbon");
            getComponent<DropDownButton>( 'groupoverflow1_sim_grp_overflow', DropDownButton).toggle();
            expect(document.getElementById('groupoverflowtable-popup').classList.contains('e-popup-open')).toBe(false);
            document.getElementById('groupoverflowtable').click();
            expect(document.getElementById('groupoverflowtable-popup').classList.contains('e-popup-open')).toBe(true);
            document.getElementById('groupoverflowtable-popup').querySelector('li').click();
            expect(outputEle.innerText.toLowerCase()).toBe('groupoverflow insert table');
        });
        it('OverAll Overflow DropdownButton', () => { 
                ribbon = new Ribbon({
                tabs: tabs,
                activeLayout: RibbonLayout.Simplified
            });
            ribbon.appendTo("#ribbon");
            ribbon.overflowDDB.toggle();
            expect(document.getElementById('commonoverflowtable-popup').classList.contains('e-popup-open')).toBe(false);
            document.getElementById('commonoverflowtable').click();
            expect(document.getElementById('commonoverflowtable-popup').classList.contains('e-popup-open')).toBe(true);
            document.getElementById('commonoverflowtable-popup').querySelector('li').click();
            expect(outputEle.innerText.toLowerCase()).toBe('commonoverflow insert table');
        });
        it('Classic Button', () => {
                ribbon = new Ribbon({
                tabs: tabs
            });
            ribbon.appendTo("#ribbon");
            document.getElementById('largecut').click();
            expect(outputEle.innerText.toLowerCase()).toBe('large cut clicked');
            document.getElementById('mediumcut').click();
            expect(outputEle.innerText.toLowerCase()).toBe('medium cut clicked');
            document.getElementById('smallcut').click();
            expect(outputEle.innerText.toLowerCase()).toBe('small cut clicked');
            containerEle.style.width = '600px';
            ribbon.refreshLayout();
            document.getElementById('large_overflow_dropdown').click();
            document.getElementById('largecut').click();
            expect(outputEle.innerText.toLowerCase()).toBe('large cut clicked');
            document.getElementById('medium_overflow_dropdown').click();
            document.getElementById('mediumcut').click();
            expect(outputEle.innerText.toLowerCase()).toBe('medium cut clicked');
            document.getElementById('small_overflow_dropdown').click();
            document.getElementById('smallcut').click();
            expect(outputEle.innerText.toLowerCase()).toBe('small cut clicked');
            document.getElementById('small_overflow_dropdown').click();
            outputEle.click();
        });
        it('Ribbon Button active state', () => {
            ribbon = new Ribbon({
                tabs: tabs
            });
            ribbon.appendTo("#ribbon");
            expect(document.getElementById('largecut').classList.contains('e-active')).toBe(false);
            ribbon.ribbonButtonModule.updateButton({ isToggle: true }, 'largecut');
            expect(document.getElementById('largecut').classList.contains('e-active')).toBe(true);
            ribbon.ribbonButtonModule.updateButton({ isToggle: false }, 'largecut');
            expect(document.getElementById('largecut').classList.contains('e-active')).toBe(false);
        });
        it('Simplfied Button', () => { 
                ribbon =  new Ribbon({
                tabs: tabs,
                activeLayout: RibbonLayout.Simplified
            });
            ribbon.appendTo("#ribbon");
            document.getElementById('largecut').click();
            expect(outputEle.innerText.toLowerCase()).toBe('large cut clicked');
        });
        it('Group Overflow Button', () => { 
                ribbon = new Ribbon({
                tabs: tabs,
                activeLayout: RibbonLayout.Simplified
            });
            ribbon.appendTo("#ribbon");
            getComponent<DropDownButton>( 'groupoverflow1_sim_grp_overflow', DropDownButton).toggle();
            document.getElementById('groupoverflowcut').click();
            expect(outputEle.innerText.toLowerCase()).toBe('groupoverflow cut clicked');
            ribbon.setProperties({activeLayout: RibbonLayout.Classic});
            document.getElementById('groupoverflowcut').click();
            expect(outputEle.innerText.toLowerCase()).toBe('groupoverflow cut clicked');
        });
        it('OverAll Overflow Button', () => { 
                ribbon = new Ribbon({
                tabs: tabs,
                activeLayout: RibbonLayout.Simplified
            });
            ribbon.appendTo("#ribbon");
            ribbon.overflowDDB.toggle();
            document.getElementById('commonoverflowcut').click();
            expect(outputEle.innerText.toLowerCase()).toBe('commonoverflow cut clicked');
            outputEle.innerText='';
            ribbon.ribbonButtonModule.updateButton( {clicked: null}, 'commonoverflowcut');
            document.getElementById('commonoverflowcut').click();
            expect(outputEle.innerText.toLowerCase()).toBe('');
            ribbon.setProperties({activeLayout: RibbonLayout.Classic});
            document.getElementById('commonoverflowcut').click();
            expect(outputEle.innerText.toLowerCase()).toBe('');
        });
        it('Classic ComboBox', () => {
            ribbon = new Ribbon({
                tabs: tabs
            });
            ribbon.appendTo("#ribbon");
            let arrow: HTMLElement = document.getElementById('fontfamily').closest('.e-control-wrapper').querySelector('.e-input-group-icon');
            arrow.dispatchEvent(new Event('mousedown'));
            document.getElementById('fontfamily_popup').querySelector('li').click();
            expect(outputEle.innerText.toLowerCase()).toBe('font algerian');
            expect(isCloseCalled).toBe(true);
            containerEle.style.width = '600px';
            ribbon.refreshLayout();
            outputEle.innerText = '';
            isCloseCalled = false;
            document.getElementById('font_overflow_dropdown').click();
            arrow = document.getElementById('fontfamily').closest('.e-control-wrapper').querySelector('.e-input-group-icon');
            arrow.dispatchEvent(new Event('mousedown'));
            document.getElementById('fontfamily_popup').querySelectorAll('li')[1].click();
            expect(outputEle.innerText.toLowerCase()).toBe('font arial');
            expect(isCloseCalled).toBe(true);
            containerEle.style.width = '1600px';
            ribbon.refreshLayout();
            outputEle.innerText = '';
            isCloseCalled = false;
            arrow = document.getElementById('fontfamily').closest('.e-control-wrapper').querySelector('.e-input-group-icon');
            arrow.dispatchEvent(new Event('mousedown'));
            document.getElementById('fontfamily_popup').querySelector('li').click();
            expect(outputEle.innerText.toLowerCase()).toBe('font algerian');
            expect(isCloseCalled).toBe(true);

        });
        it('Simplfied ComboBox', () => { 
            ribbon =  new Ribbon({
                tabs: tabs,
                activeLayout: RibbonLayout.Simplified
            });
            ribbon.appendTo("#ribbon");
            let arrow: HTMLElement = document.getElementById('fontfamily').closest('.e-control-wrapper').querySelector('.e-input-group-icon');
            arrow.dispatchEvent(new Event('mousedown'));
            document.getElementById('fontfamily_popup').querySelector('li').click();
            expect(outputEle.innerText.toLowerCase()).toBe('font algerian');
            expect(isCloseCalled).toBe(true);
        });
        it('Group Overflow ComboBox', () => { 
                ribbon = new Ribbon({
                activeLayout: RibbonLayout.Simplified,
                tabs: [{
                    groups: [{
                        header: "GroupOverflow",
                        orientation: 'Row',
                        groupIconCss:'e-icons e-bold',
                        enableGroupOverflow: true,
                        cssClass: 'font-group',
                        id: 'groupoverflow2',
                        collections: [{
                            items: [{
                                type: RibbonItemType.ComboBox,
                                id: 'groupoverflowfontfamily',
                                displayOptions: DisplayMode.Overflow,
                                comboBoxSettings: {
                                    select: (args: SelectEventArgs)=>{
                                        outputEle.innerText = ("GroupOverflow " + args.itemData.text);
                                    },
                                    dataSource: fontStyle,
                                    index: 2,
                                    allowFiltering: true,
                                    width: '150px',
                                    close: ()=>{ isCloseCalled = true; }
                                }
                            }]
                        }, {
                            items: [{
                                type: RibbonItemType.CheckBox,
                                id: 'groupoverflowfontbold',
                                checkBoxSettings: {
                                    change: (args: CheckChange)=>{
                                        outputEle.innerText = ("GroupOverflow " + args.checked);
                                    },
                                    label: 'Ruler',
                                    checked: false
                                }
                            }, {
                                type: RibbonItemType.ColorPicker,
                                id: 'groupoverflowfontcolor',
                                colorPickerSettings: {
                                    change: (args: ChangeEventArgs)=>{
                                        outputEle.innerText = ("GroupOverflow " + args.value);
                                    },
                                    value: '#123456',
                                }
                            }]
                        }]
                    }]
                }]
            });
            ribbon.appendTo("#ribbon");
            getComponent<DropDownButton>( 'groupoverflow2_sim_grp_overflow', DropDownButton).toggle();
            let arrow: HTMLElement = document.getElementById('groupoverflowfontfamily').closest('.e-control-wrapper').querySelector('.e-input-group-icon');
            arrow.dispatchEvent(new Event('mousedown'));
            document.getElementById('groupoverflowfontfamily_popup').querySelector('li').click();
            expect(outputEle.innerText.toLowerCase()).toBe('groupoverflow algerian');
            expect(isCloseCalled).toBe(true);
        });
        it('OverAll Overflow ComboBox', () => { 
                ribbon = new Ribbon({
                tabs: tabs,
                activeLayout: RibbonLayout.Simplified
            });
            ribbon.appendTo("#ribbon");
            ribbon.overflowDDB.toggle();
            let arrow: HTMLElement = document.getElementById('commonoverflowfontfamily').closest('.e-control-wrapper').querySelector('.e-input-group-icon');
            arrow.dispatchEvent(new Event('mousedown'));
            document.getElementById('commonoverflowfontfamily_popup').querySelector('li').click();
            expect(outputEle.innerText.toLowerCase()).toBe('commonoverflow algerian');
            expect(isCloseCalled).toBe(true);
            ribbon.ribbonComboBoxModule.updateComboBox( {close: null}, 'commonoverflowfontfamily');
            isCloseCalled = false;
            arrow = document.getElementById('commonoverflowfontfamily').closest('.e-control-wrapper').querySelector('.e-input-group-icon');
            arrow.dispatchEvent(new Event('mousedown'));
            document.getElementById('commonoverflowfontfamily_popup').querySelectorAll('li')[1].click();
            expect(outputEle.innerText.toLowerCase()).toBe('commonoverflow arial');
            expect(isCloseCalled).toBe(false);
            ribbon.setProperties({activeLayout: RibbonLayout.Classic});
            arrow = document.getElementById('commonoverflowfontfamily').closest('.e-control-wrapper').querySelector('.e-input-group-icon');
            arrow.dispatchEvent(new Event('mousedown'));
            document.getElementById('commonoverflowfontfamily_popup').querySelector('li').click();
            expect(outputEle.innerText.toLowerCase()).toBe('commonoverflow algerian');
            expect(isCloseCalled).toBe(false);
        });
        it('Combobox label', () => {
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
                                    cssClass:'testClass',
                                    content: 'Edit',
                                    iconCss: 'e-icons e-edit',
                                    items: dropDownButtonItems
                                }
                            }, {
                                id: "item2",
                                type: RibbonItemType.SplitButton,
                                allowedSizes: RibbonItemSize.Small,
                                splitButtonSettings: {
                                    content: 'Edit',
                                    iconCss: 'e-icons e-edit',
                                    items: dropDownButtonItems
                                }
                            },{
                                id: "item3",
                                type: RibbonItemType.ComboBox,
                                comboBoxSettings: {
                                    label: 'Font Style',
                                    dataSource: fontStyle,
                                    index: 1
                                }
                            }]
                        }]
                    }]
                }]
            }, ribbonEle);
            expect(document.querySelector('#item3').classList.contains('e-ribbon-combobox-label')).toBe(false);
            (ribbon.element.querySelector('.e-ribbon-collapse-btn')as HTMLElement).click();
            containerEle.style.width = '300px';
            ribbon.refreshLayout();
            (ribbon.element.querySelector('#ribbon_tab_sim_ovrl_overflow') as HTMLElement).click();
            expect(document.querySelector('#item3_container').querySelector('.e-ribbon-combobox-label') !== null).toBe(true);
            expect(document.querySelector('#item3_container').querySelector('.e-ribbon-combobox-label').innerHTML).toBe('Font Style');
            (ribbon.element.querySelector('#ribbon_tab_sim_ovrl_overflow') as HTMLElement).click();
            containerEle.style.width = '600px';
            ribbon.refreshLayout();
            (ribbon.element.querySelector('.e-ribbon-collapse-btn')as HTMLElement).click();
            expect(document.querySelector('#item3_container').querySelector('.e-ribbon-combobox-label') === null).toBe(true);
        });
        it('Coverage- ComboBox Css Class', () => {
                ribbon = new Ribbon({
                tabs: tabs,
                activeLayout: RibbonLayout.Simplified
            });
            ribbon.appendTo("#ribbon");
            expect(document.getElementById('fontfamily').closest('.e-control-wrapper').classList.contains('test-css')).toBe(true);
            ribbon.ribbonComboBoxModule.updateComboBox( {cssClass:'newClass'}, 'fontfamily');
            expect(document.getElementById('fontfamily').closest('.e-control-wrapper').classList.contains('test-css')).toBe(false);
            expect(document.getElementById('fontfamily').closest('.e-control-wrapper').classList.contains('newClass')).toBe(true);
            expect(document.getElementById('commonoverflowfontfamily').closest('.e-control-wrapper').classList.contains('test-css')).toBe(false);
            ribbon.ribbonComboBoxModule.updateComboBox( {cssClass:'newClass'}, 'commonoverflowfontfamily');
            expect(document.getElementById('commonoverflowfontfamily').closest('.e-control-wrapper').classList.contains('newClass')).toBe(true);
        });
        it('Classic CheckBox', () => {
            ribbon = new Ribbon({
                tabs: tabs
            });
            ribbon.appendTo("#ribbon");
            let frame: HTMLElement = document.getElementById('fontbold').parentElement.querySelector('.e-frame');
            frame.click();
            expect(outputEle.innerText.toLowerCase()).toBe('font true');
            containerEle.style.width = '600px';
            ribbon.refreshLayout();
            outputEle.innerText = '';
            document.getElementById('font_overflow_dropdown').click();
            frame = document.getElementById('fontbold').parentElement.querySelector('.e-frame');
            frame.click();
            expect(outputEle.innerText.toLowerCase()).toBe('font false');
            outputEle.innerText = '';
            ribbon.ribbonCheckBoxModule.updateCheckBox( {change: null}, 'fontbold');
            document.getElementById('font_overflow_dropdown').click();
            frame.click();
            expect(outputEle.innerText.toLowerCase()).toBe('');
            containerEle.style.width = '1600px';
            ribbon.refreshLayout();
            frame = document.getElementById('fontbold').parentElement.querySelector('.e-frame');
            frame.click();
            expect(outputEle.innerText.toLowerCase()).toBe('');
        });
        it('Simplfied CheckBox', () => { 
            ribbon =  new Ribbon({
                tabs: tabs,
                activeLayout: RibbonLayout.Simplified
            });
            ribbon.appendTo("#ribbon");
            let frame: HTMLElement = document.getElementById('fontbold').parentElement.querySelector('.e-frame');
            frame.click();
            expect(outputEle.innerText.toLowerCase()).toBe('font true');
            outputEle.innerText = '';
            ribbon.ribbonCheckBoxModule.updateCheckBox( {change: null}, 'fontbold');
            frame.click();
            expect(outputEle.innerText.toLowerCase()).toBe('');
        });
        it('Group Overflow CheckBox', () => { 
                ribbon = new Ribbon({
                tabs: tabs,
                activeLayout: RibbonLayout.Simplified
            });
            ribbon.appendTo("#ribbon");
            getComponent<DropDownButton>( 'groupoverflow2_sim_grp_overflow', DropDownButton).toggle();
            let frame: HTMLElement = document.getElementById('groupoverflowfontbold').parentElement.querySelector('.e-frame');
            frame.click();
            expect(outputEle.innerText.toLowerCase()).toBe('groupoverflow true');
            ribbon.setProperties({activeLayout: RibbonLayout.Classic});
            frame = document.getElementById('groupoverflowfontbold').parentElement.querySelector('.e-frame');
            frame.click();
            expect(outputEle.innerText.toLowerCase()).toBe('groupoverflow false');
        });
        it('OverAll Overflow CheckBox', () => { 
                ribbon = new Ribbon({
                tabs: tabs,
                activeLayout: RibbonLayout.Simplified
            });
            ribbon.appendTo("#ribbon");
            ribbon.overflowDDB.toggle();
            let frame: HTMLElement = document.getElementById('commonoverflowfontbold').parentElement.querySelector('.e-frame');
            frame.click();
            expect(outputEle.innerText.toLowerCase()).toBe('commonoverflow true');
        });
        it('Coverage- Checkbox Css Class', () => {
                ribbon = new Ribbon({
                tabs: tabs,
                activeLayout: RibbonLayout.Simplified
            });
            ribbon.appendTo("#ribbon");
            expect(document.getElementById('fontbold').closest('.e-checkbox-wrapper').classList.contains('test-css')).toBe(true);
            ribbon.ribbonCheckBoxModule.updateCheckBox( {cssClass:'newClass'}, 'fontbold');
            expect(document.getElementById('fontbold').closest('.e-checkbox-wrapper').classList.contains('test-css')).toBe(false);
            expect(document.getElementById('fontbold').closest('.e-checkbox-wrapper').classList.contains('newClass')).toBe(true);
            expect(document.getElementById('commonoverflowfontbold').closest('.e-checkbox-wrapper').classList.contains('test-css')).toBe(false);
            ribbon.ribbonCheckBoxModule.updateCheckBox( {cssClass:'newClass'}, 'commonoverflowfontbold');
            expect(document.getElementById('commonoverflowfontbold').closest('.e-checkbox-wrapper').classList.contains('newClass')).toBe(true);
        });
        it('Classic ColorPicker', () => {
            ribbon = new Ribbon({
                tabs: tabs
            });
            ribbon.appendTo("#ribbon");
            let splitBtn: HTMLElement = document.getElementById('fontcolor').parentElement.querySelector('.e-split-colorpicker');
            (splitBtn.parentElement.querySelector('.e-dropdown-btn') as HTMLElement).click();
            let popup: HTMLElement = document.getElementById(splitBtn.id+'_dropdownbtn-popup');
            (document.querySelectorAll('.e-row')[9].children[9] as HTMLElement).click();
            (popup.querySelector('.e-apply') as HTMLElement).click();
            expect(outputEle.innerText.toLowerCase()).toBe('font #f57f17ff');
            containerEle.style.width = '600px';
            ribbon.refreshLayout();
            outputEle.innerText = '';
            document.getElementById('font_overflow_dropdown').click();
            splitBtn = document.getElementById('fontcolor').parentElement.querySelector('.e-split-colorpicker');
            (splitBtn.parentElement.querySelector('.e-dropdown-btn') as HTMLElement).click();
            popup = document.getElementById(splitBtn.id+'_dropdownbtn-popup');
            (document.querySelectorAll('.e-row')[9].children[8] as HTMLElement).click();
            (popup.querySelector('.e-apply') as HTMLElement).click();
            expect(outputEle.innerText.toLowerCase()).toBe('font #004d40ff');
        });
        it('Simplfied ColorPicker', () => { 
            ribbon =  new Ribbon({
                tabs: tabs,
                activeLayout: RibbonLayout.Simplified
            });
            ribbon.appendTo("#ribbon");
            let splitBtn: HTMLElement = document.getElementById('fontcolor').parentElement.querySelector('.e-split-colorpicker');
            (splitBtn.parentElement.querySelector('.e-dropdown-btn') as HTMLElement).click();
            let popup: HTMLElement = document.getElementById(splitBtn.id+'_dropdownbtn-popup');
            (document.querySelectorAll('.e-row')[9].children[9] as HTMLElement).click();            
            (popup.querySelector('.e-apply') as HTMLElement).click();
            expect(outputEle.innerText.toLowerCase()).toBe('font #f57f17ff');
        });
        it('Group Overflow ColorPicker', () => { 
                ribbon = new Ribbon({
                tabs: tabs,
                activeLayout: RibbonLayout.Simplified
            });
            ribbon.appendTo("#ribbon");
            getComponent<DropDownButton>( 'groupoverflow2_sim_grp_overflow', DropDownButton).toggle();
            let splitBtn: HTMLElement = document.getElementById('groupoverflowfontcolor').parentElement.querySelector('.e-split-colorpicker');
            (splitBtn.parentElement.querySelector('.e-dropdown-btn') as HTMLElement).click();
            let popup: HTMLElement = document.getElementById(splitBtn.id+'_dropdownbtn-popup');
            (document.querySelectorAll('.e-row')[9].children[9] as HTMLElement).click();
            (popup.querySelector('.e-apply') as HTMLElement).click();
            expect(outputEle.innerText.toLowerCase()).toBe('groupoverflow #f57f17ff');
        });
        it('OverAll Overflow ColorPicker', () => { 
                ribbon = new Ribbon({
                tabs: tabs,
                activeLayout: RibbonLayout.Simplified
            });
            ribbon.appendTo("#ribbon");
            ribbon.overflowDDB.toggle();
            let splitBtn: HTMLElement = document.getElementById('commonoverflowfontcolor').parentElement.querySelector('.e-split-colorpicker');
            (splitBtn.parentElement.querySelector('.e-dropdown-btn') as HTMLElement).click();
            let popup: HTMLElement = document.getElementById(splitBtn.id+'_dropdownbtn-popup');
            (document.querySelectorAll('.e-row')[9].children[9] as HTMLElement).click();
            (popup.querySelector('.e-apply') as HTMLElement).click();
            expect(outputEle.innerText.toLowerCase()).toBe('commonoverflow #f57f17ff');
        });
        it('Colorpicker label', () => {
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
                                    cssClass:'testClass',
                                    content: 'Edit',
                                    iconCss: 'e-icons e-edit',
                                    items: dropDownButtonItems
                                }
                            }, {
                                id: "item2",
                                type: RibbonItemType.SplitButton,
                                allowedSizes: RibbonItemSize.Small,
                                splitButtonSettings: {
                                    content: 'Edit',
                                    iconCss: 'e-icons e-edit',
                                    items: dropDownButtonItems
                                }
                            },{
                                id: "item3",
                                type: RibbonItemType.ColorPicker,
                                colorPickerSettings: {
                                    label: 'Colors',
                                    value: '#123456'
                                }
                            }]
                        }]
                    }]
                }]
            }, ribbonEle);
            expect(document.querySelector('#item3').classList.contains('e-ribbon-colorpicker-label')).toBe(false);
            (ribbon.element.querySelector('.e-ribbon-collapse-btn')as HTMLElement).click();
            containerEle.style.width = '200px';
            ribbon.refreshLayout();
            (ribbon.element.querySelector('#ribbon_tab_sim_ovrl_overflow') as HTMLElement).click();
            expect(document.querySelector('#item3_container').querySelector('.e-ribbon-colorpicker-label') !== null).toBe(true);
            expect(document.querySelector('#item3_container').querySelector('.e-ribbon-colorpicker-label').innerHTML).toBe('Colors');
            (ribbon.element.querySelector('#ribbon_tab_sim_ovrl_overflow') as HTMLElement).click();
            containerEle.style.width = '600px';
            ribbon.refreshLayout();
            (ribbon.element.querySelector('.e-ribbon-collapse-btn')as HTMLElement).click();
            expect(document.querySelector('#item3_container').querySelector('.e-ribbon-colorpicker-label') === null).toBe(true);
        });
        it('Coverage- ColorPicker Css Class', () => {
                ribbon = new Ribbon({
                tabs: tabs,
                activeLayout: RibbonLayout.Simplified
            });
            ribbon.appendTo("#ribbon");
            expect(document.getElementById('fontcolor').parentElement.classList.contains('test-css')).toBe(true);
            ribbon.ribbonColorPickerModule.updateColorPicker( {cssClass:'newClass'}, 'fontcolor');
            expect(document.getElementById('fontcolor').parentElement.classList.contains('test-css')).toBe(false);
            expect(document.getElementById('fontcolor').parentElement.classList.contains('newClass')).toBe(true);
            expect(document.getElementById('commonoverflowfontcolor').parentElement.classList.contains('test-css')).toBe(false);
            ribbon.ribbonColorPickerModule.updateColorPicker( {cssClass:'newClass'}, 'commonoverflowfontcolor');
            expect(document.getElementById('commonoverflowfontcolor').parentElement.classList.contains('newClass')).toBe(true);
        });
        it('ColorPicker BeforeCloseEvent For Coverage', () => {
            ribbon = new Ribbon({
                tabs: tabs
            });
            ribbon.appendTo("#ribbon");
            expect(isColorPickerBeforeClose).toBe(false);
            let splitBtn: HTMLElement = document.getElementById('fontcolor').parentElement.querySelector('.e-split-colorpicker');
            expect(document.body.querySelector('#'+splitBtn.id+'_dropdownbtn-popup').classList.contains('e-popup-close')).toBe(true);
            (splitBtn.parentElement.querySelector('.e-dropdown-btn') as HTMLElement).click();
            expect(document.body.querySelector('#'+splitBtn.id+'_dropdownbtn-popup').classList.contains('e-popup-open')).toBe(true);
            (splitBtn.parentElement.querySelector('.e-dropdown-btn') as HTMLElement).click();
            expect(document.body.querySelector('#'+splitBtn.id+'_dropdownbtn-popup').classList.contains('e-popup-close')).toBe(true);
            expect(isColorPickerBeforeClose).toBe(true);
            containerEle.style.width = '600px';
            ribbon.refreshLayout();
            isColorPickerBeforeClose = false;
            expect(isColorPickerBeforeClose).toBe(false);
            expect(document.body.querySelector('#'+splitBtn.id+'_dropdownbtn-popup').classList.contains('e-popup-close')).toBe(true);
            (splitBtn.parentElement.querySelector('.e-dropdown-btn') as HTMLElement).click();
            expect(document.body.querySelector('#'+splitBtn.id+'_dropdownbtn-popup').classList.contains('e-popup-open')).toBe(true);
            (splitBtn.parentElement.querySelector('.e-dropdown-btn') as HTMLElement).click();
            expect(document.body.querySelector('#'+splitBtn.id+'_dropdownbtn-popup').classList.contains('e-popup-close')).toBe(true);
            expect(isColorPickerBeforeClose).toBe(true);
            containerEle.style.width = '1600px';
            ribbon.refreshLayout();
            isColorPickerBeforeClose = false;
            expect(isColorPickerBeforeClose).toBe(false);
            expect(document.body.querySelector('#'+splitBtn.id+'_dropdownbtn-popup').classList.contains('e-popup-close')).toBe(true);
            (splitBtn.parentElement.querySelector('.e-dropdown-btn') as HTMLElement).click();
            expect(document.body.querySelector('#'+splitBtn.id+'_dropdownbtn-popup').classList.contains('e-popup-open')).toBe(true);
            (splitBtn.parentElement.querySelector('.e-dropdown-btn') as HTMLElement).click();
            expect(document.body.querySelector('#'+splitBtn.id+'_dropdownbtn-popup').classList.contains('e-popup-close')).toBe(true);
            expect(isColorPickerBeforeClose).toBe(true);
        });
        it('Custom attributes for items', () => {
            ribbon = new Ribbon({
                tabs: tabs
            });
            ribbon.appendTo("#ribbon");
            //Check button
            expect(document.querySelector('#largecut').getAttribute('data-id')).toBe('largecut');
            //Check checkbox
            expect(document.querySelector('#fontbold').closest('.e-checkbox-wrapper').getAttribute('data-id')).toBe('fontbold');
            //Check combobox
            expect(document.querySelector('#fontfamily_hidden').getAttribute('data-id')).toBe('fontfamily');
            //Check color picker
            expect(document.querySelector('#fontcolor').getAttribute('data-id')).toBe('fontcolor');
            //Check dropdown button
            expect(document.querySelector('#largetable').getAttribute('data-id')).toBe('largetable');
            //Check split button
            expect(document.querySelector('#largepaste').getAttribute('data-id')).toBe('largepaste');
        });
        it('Using htmlAttributes id Large item break in simplified mode', () => {
            ribbon = new Ribbon({
                tabs: [{
                    id: "tab1",
                    header: "tab1",
                    groups: [{
                        header: "Large items",
                        groupIconCss: 'e-icons e-paste',
                        showLauncherIcon: true,
                        orientation: ItemOrientation.Row,
                        collections: [{
                            items: [{
                                type: RibbonItemType.SplitButton,
                                allowedSizes: RibbonItemSize.Large,
                                splitButtonSettings: {
                                    content: 'Paste',
                                    cssClass: 'test-css',
                                    iconCss: 'e-icons e-paste',
                                    items: [{ text: 'Keep Source Format' }, { text: 'Merge format' }, { text: 'Keep text only' }],
                                    close: () => { isCloseCalled = true; },
                                    htmlAttributes: { id: 'item1' }
                                }
                            }, {
                                type: RibbonItemType.DropDown,
                                allowedSizes: RibbonItemSize.Large,
                                dropDownSettings: {
                                    content: 'Table',
                                    iconCss: 'e-icons e-table',
                                    cssClass: 'test-css',
                                    items: [
                                        { text: 'Insert Table' }, { text: 'Draw Table' },
                                        { text: 'Convert Table' }, { text: 'Excel SpreadSheet' }
                                    ],
                                    close: () => { isCloseCalled = true; },
                                    htmlAttributes: { id: 'item2' }
                                }
                            }, {
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Large,
                                cssClass: 'test-css',
                                buttonSettings: {
                                    clicked: () => {
                                        outputEle.innerText = ("Large " + "Cut Clicked");
                                    },
                                    content: 'cut',
                                    iconCss: 'e-icons e-cut',
                                    htmlAttributes: { id: 'item3' }
                                }
                            }]
                        },]
                    }]
                }]
            }, ribbonEle);
            //splitbutton
            expect(document.querySelector('#item1_container').classList.contains('e-ribbon-large-item')).toBe(true);
            //dropdown
            expect(document.querySelector('#item2_container').classList.contains('e-ribbon-large-item')).toBe(true);
            //button
            expect(document.querySelector('#item3_container').classList.contains('e-ribbon-large-item')).toBe(true);
            //check large item change to medium item in simplified mode
            ribbon.setProperties({ activeLayout: RibbonLayout.Simplified });
            expect(document.querySelector('#item1_container').classList.contains('e-ribbon-medium-item')).toBe(true); 
            expect(document.querySelector('#item2_container').classList.contains('e-ribbon-medium-item')).toBe(true);
            expect(document.querySelector('#item3_container').classList.contains('e-ribbon-medium-item')).toBe(true);
        });
        it('Colorpicker resize in simplified', () => {
             let isColorPickerOpen: boolean = false;
            ribbon = new Ribbon({
                activeLayout: RibbonLayout.Simplified,
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
                                allowedSizes: RibbonItemSize.Small,
                                splitButtonSettings: {
                                    content: 'Edit',
                                    iconCss: 'e-icons e-edit',
                                    items: dropDownButtonItems
                                }
                            },{
                                type: RibbonItemType.ColorPicker,
                                id: 'fontcolors',
                                colorPickerSettings: {
                                    cssClass: 'test-css',
                                    change: (args: ChangeEventArgs)=>{
                                        outputEle.innerText = ("Font " + args.value);
                                    },
                                    beforeOpen: (args: BeforeCloseEventArgs) => {
                                        isColorPickerOpen = true;
                                    },
                                    value: '#123456',
                                    htmlAttributes: { 'data-id': 'fontcolor' }
                                }
                            }]
                        }]
                    }]
                }]
            }, ribbonEle);
            containerEle.style.width = '200px';
            ribbon.refreshLayout();
            expect(isColorPickerOpen).toBe(false);
            let splitBtn: HTMLElement = document.getElementById('fontcolors').parentElement.querySelector('.e-split-colorpicker');
            expect(document.body.querySelector('#'+splitBtn.id+'_dropdownbtn-popup').classList.contains('e-popup-close')).toBe(true);
            (splitBtn.parentElement.querySelector('.e-dropdown-btn') as HTMLElement).click();
            expect(document.body.querySelector('#'+splitBtn.id+'_dropdownbtn-popup').classList.contains('e-popup-open')).toBe(true);
            expect(isColorPickerOpen).toBe(true);
            expect(document.querySelectorAll('.e-colorpicker-popup.e-ribbon-control.e-popup-open').length).toBe(1);
            containerEle.style.width = '250px';
            ribbon.refreshLayout();            
            expect(document.querySelectorAll('.e-colorpicker-popup.e-ribbon-control.e-popup-open').length).toBe(0);
            splitBtn = document.getElementById('fontcolors').parentElement.querySelector('.e-split-colorpicker');
            (splitBtn.parentElement.querySelector('.e-dropdown-btn') as HTMLElement).click();            
            expect(document.querySelectorAll('.e-colorpicker-popup.e-ribbon-control.e-popup-open').length).toBe(1);
            containerEle.style.width = '200px';
            ribbon.refreshLayout();
            expect(document.querySelectorAll('.e-colorpicker-popup.e-ribbon-control.e-popup-open').length).toBe(0);
        });
    });
    describe('Overflow items interaction', () => {   

        let dropDownButtonItems: ItemModel[] = [
            { text: 'New tab' },
            { text: 'New window' },
            { text: 'New incognito window' },
            { separator: true },
            { text: 'Print' },
            { text: 'Cast' },
            { text: 'Find' }];
        let sportsData: string[] = ['Badminton', 'Cricket', 'Football', 'Golf', 'Tennis'];     
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

        it('dropdown and splitbutton in overflow mode', () => {
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
                                displayOptions: DisplayMode.Overflow,
                                dropDownSettings: {
                                    content: 'Edit',
                                    iconCss: 'e-icons e-edit',
                                    items: dropDownButtonItems
                                }
                            },                           
                            {                               
                                id: "item3",
                                type: RibbonItemType.SplitButton,
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
            expect(document.body.querySelector('#ribbon_tab_sim_ovrl_overflow-popup').classList.contains('e-popup-close')).toBe(true);
            (ribbon.element.querySelector('.e-ribbon-group-overflow-ddb') as HTMLElement).click();
            expect(document.body.querySelector('#ribbon_tab_sim_ovrl_overflow-popup').classList.contains('e-popup-open')).toBe(true);
            //Opening a dropdown
            expect(document.body.querySelector('#item2-popup').classList.contains('e-popup-close')).toBe(true);
            (document.body.querySelector('#item2') as HTMLElement).click();
            expect(document.body.querySelector('#item2-popup').classList.contains('e-popup-open')).toBe(true);
            //Clicking on splitbutton
            let splitbuttonArrow: HTMLElement = document.querySelector('#item3');
            (splitbuttonArrow.parentElement.querySelector('.e-dropdown-btn') as HTMLElement).dispatchEvent(new Event('mousedown', { bubbles: true }));
            (splitbuttonArrow.parentElement.querySelector('.e-dropdown-btn') as HTMLElement).click();
            expect(document.body.querySelector('#item2-popup').classList.contains('e-popup-close')).toBe(true);
            expect(document.body.querySelector('#ribbon_tab_sim_ovrl_overflow-popup').classList.contains('e-popup-open')).toBe(true);
            expect(document.body.querySelector('#item3_dropdownbtn-popup').classList.contains('e-popup-open')).toBe(true);
            //Clicking on Dropdownbutton
            (document.body.querySelector('#item2') as HTMLElement).dispatchEvent(new Event('mousedown', { bubbles: true }));
            (document.body.querySelector('#item2') as HTMLElement).click();
            expect(document.body.querySelector('#item2-popup').classList.contains('e-popup-open')).toBe(true);
            expect(document.body.querySelector('#ribbon_tab_sim_ovrl_overflow-popup').classList.contains('e-popup-open')).toBe(true);
            expect(document.body.querySelector('#item3_dropdownbtn-popup').classList.contains('e-popup-close')).toBe(true);
            //Clicking on Dropdownbutton item
            (document.body.querySelector('#item2-popup').querySelector('li') as HTMLElement).click();
            expect(document.body.querySelector('#item2-popup').classList.contains('e-popup-close')).toBe(true);
            expect(document.body.querySelector('#ribbon_tab_sim_ovrl_overflow-popup').classList.contains('e-popup-close')).toBe(true);
            expect(document.body.querySelector('#item3_dropdownbtn-popup').classList.contains('e-popup-close')).toBe(true);
        });

        it('splitbutton and dropdown in overflow mode', () => {
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
                                type: RibbonItemType.SplitButton,
                                displayOptions: DisplayMode.Overflow,                               
                                splitButtonSettings: {
                                    content: 'Edit',
                                    iconCss: 'e-icons e-edit',
                                    items: dropDownButtonItems
                                }                                
                            },                           
                            {                               
                                id: "item3",
                                type: RibbonItemType.DropDown,
                                allowedSizes: RibbonItemSize.Medium,
                                displayOptions: DisplayMode.Overflow,
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
            expect(document.body.querySelector('#ribbon_tab_sim_ovrl_overflow-popup').classList.contains('e-popup-close')).toBe(true);
            (ribbon.element.querySelector('.e-ribbon-group-overflow-ddb') as HTMLElement).click();
            expect(document.body.querySelector('#ribbon_tab_sim_ovrl_overflow-popup').classList.contains('e-popup-open')).toBe(true);
            ///Opening a Splitbutton
            expect(document.body.querySelector('#item2_dropdownbtn-popup').classList.contains('e-popup-close')).toBe(true);
            let splitbuttonArrow: HTMLElement = document.querySelector('#item2');
            (splitbuttonArrow.parentElement.querySelector('.e-dropdown-btn') as HTMLElement).click();
            expect(document.body.querySelector('#item2_dropdownbtn-popup').classList.contains('e-popup-open')).toBe(true);
            //Clicking on Dropdownbutton
            (document.body.querySelector('#item3') as HTMLElement).dispatchEvent(new Event('mousedown', { bubbles: true }));
            expect(document.body.querySelector('.e-popup-open') !== null).toBe(true);
            (document.body.querySelector('#item3') as HTMLElement).click();
            expect(document.body.querySelector('#item2_dropdownbtn-popup').classList.contains('e-popup-close')).toBe(true);
            expect(document.body.querySelector('#ribbon_tab_sim_ovrl_overflow-popup').classList.contains('e-popup-open')).toBe(true);
            expect(document.body.querySelector('#item3-popup').classList.contains('e-popup-open')).toBe(true);
            //Clicking on Splitbutton
            (splitbuttonArrow.parentElement.querySelector('.e-dropdown-btn') as HTMLElement).dispatchEvent(new Event('mousedown', { bubbles: true }));
            (splitbuttonArrow.parentElement.querySelector('.e-dropdown-btn') as HTMLElement).click();
            expect(document.body.querySelector('#item2_dropdownbtn-popup').classList.contains('e-popup-open')).toBe(true);
            expect(document.body.querySelector('#ribbon_tab_sim_ovrl_overflow-popup').classList.contains('e-popup-open')).toBe(true);
            expect(document.body.querySelector('#item3-popup').classList.contains('e-popup-close')).toBe(true);
            //Clicking on Splitbutton item
            (document.body.querySelector('#item2_dropdownbtn-popup').querySelector('li') as HTMLElement).click();
            expect(document.body.querySelector('#item2_dropdownbtn-popup').classList.contains('e-popup-close')).toBe(true);
            expect(document.body.querySelector('#ribbon_tab_sim_ovrl_overflow-popup').classList.contains('e-popup-close')).toBe(true);
            expect(document.body.querySelector('#item3-popup').classList.contains('e-popup-close')).toBe(true);
        });

        it('dropdown and combobox in overflow mode - selecting ddb', (done) => {
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
                                type: RibbonItemType.ComboBox,
                                displayOptions: DisplayMode.Overflow,
                                comboBoxSettings: {
                                    dataSource: sportsData,
                                    index: 1,
                                    allowFiltering: true
                                }                                
                            },                           
                            {
                                id: "item3",
                                type: RibbonItemType.DropDown,
                                allowedSizes: RibbonItemSize.Medium,
                                displayOptions: DisplayMode.Overflow,
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
            expect(document.body.querySelector('#ribbon_tab_sim_ovrl_overflow-popup').classList.contains('e-popup-close')).toBe(true);
            (ribbon.element.querySelector('.e-ribbon-group-overflow-ddb') as HTMLElement).click();
            expect(document.body.querySelector('#ribbon_tab_sim_ovrl_overflow-popup').classList.contains('e-popup-open')).toBe(true);
            //Clicking on Combobox
            let arrow: HTMLElement = document.querySelector('#item2').closest('.e-control-wrapper').querySelector('.e-input-group-icon');
            arrow.dispatchEvent(new Event('mousedown', { bubbles: true }));            
            setTimeout(() => {                
                expect(document.body.querySelector('#item3-popup').classList.contains('e-popup-close')).toBe(true);
                expect(document.body.querySelector('#ribbon_tab_sim_ovrl_overflow-popup').classList.contains('e-popup-open')).toBe(true);
                expect(document.body.querySelector('#item2_popup').classList.contains('e-popup-open')).toBe(true);
                //Clicking on Dropdownbutton
                (document.body.querySelector('#item3') as HTMLElement).dispatchEvent(new Event('mousedown', { bubbles: true }));
                (document.body.querySelector('#item3') as HTMLElement).click();                
                setTimeout(() => {   
                    expect(document.body.querySelector('#item2_popup')).toBe(null);
                    expect(document.body.querySelector('#item3-popup').classList.contains('e-popup-open')).toBe(true);
                    expect(document.body.querySelector('#ribbon_tab_sim_ovrl_overflow-popup').classList.contains('e-popup-open')).toBe(true);
                    done();
                }, 450);
            }, 450);
        });

        it('dropdown and combobox in overflow mode - selecting combobox item', (done) => {
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
                                type: RibbonItemType.ComboBox,
                                displayOptions: DisplayMode.Overflow,
                                comboBoxSettings: {
                                    dataSource: sportsData,
                                    index: 3,
                                    allowFiltering: true
                                }                                
                            },                           
                            {
                                id: "item3",
                                type: RibbonItemType.DropDown,
                                allowedSizes: RibbonItemSize.Medium,
                                displayOptions: DisplayMode.Overflow,
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
            expect(document.body.querySelector('#ribbon_tab_sim_ovrl_overflow-popup').classList.contains('e-popup-close')).toBe(true);
            (ribbon.element.querySelector('.e-ribbon-group-overflow-ddb') as HTMLElement).click();
            expect(document.body.querySelector('#ribbon_tab_sim_ovrl_overflow-popup').classList.contains('e-popup-open')).toBe(true);
            //Clicking on Combobox
            let arrow: HTMLElement = document.querySelector('#item2').closest('.e-control-wrapper').querySelector('.e-input-group-icon');
            arrow.dispatchEvent(new Event('mousedown', { bubbles: true }));            
            setTimeout(() => {            
                // let comboxObj = (document.body.querySelector('#item2') as any).ej2_instances[0];
                expect(document.querySelector('#item2_popup').querySelectorAll('li').length).toBe(5);
                expect((document.body.querySelector('#item2') as HTMLInputElement).value === 'Golf').toBe(true);
                expect(document.body.querySelector('#item3-popup').classList.contains('e-popup-close')).toBe(true);
                expect(document.body.querySelector('#ribbon_tab_sim_ovrl_overflow-popup').classList.contains('e-popup-open')).toBe(true);
                expect(document.body.querySelector('#item2_popup').classList.contains('e-popup-open')).toBe(true);
                //Clicking on combobox item
                (document.body.querySelector('#item2_popup').querySelector('li') as HTMLElement).click();                
                setTimeout(() => {
                    expect((document.body.querySelector('#item2') as HTMLInputElement).value === 'Badminton').toBe(true);
                    expect(document.body.querySelector('#item2_popup')).toBe(null);
                    expect(document.body.querySelector('#ribbon_tab_sim_ovrl_overflow-popup').classList.contains('e-popup-close')).toBe(true);
                    expect(document.body.querySelector('#item3-popup').classList.contains('e-popup-close')).toBe(true);
                    done();
                }, 450);
            }, 450);
        });

        it('dropdown and colorpicker in overflow mode', () => {
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
                                type: RibbonItemType.ColorPicker,
                                displayOptions: DisplayMode.Overflow,
                                colorPickerSettings: {
                                    value: '#123456'
                                }
                            },                           
                            {
                                id: "item3",
                                type: RibbonItemType.DropDown,
                                allowedSizes: RibbonItemSize.Medium,
                                displayOptions: DisplayMode.Overflow,
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
            expect(document.body.querySelector('#ribbon_tab_sim_ovrl_overflow-popup').classList.contains('e-popup-close')).toBe(true);
            (ribbon.element.querySelector('.e-ribbon-group-overflow-ddb') as HTMLElement).click();
            expect(document.body.querySelector('#ribbon_tab_sim_ovrl_overflow-popup').classList.contains('e-popup-open')).toBe(true);
            //Opening colorpicker            
            let splitBtn: HTMLElement = document.querySelector('#item2').parentElement.querySelector('.e-split-colorpicker');
            expect(document.body.querySelector('#'+splitBtn.id+'_dropdownbtn-popup').classList.contains('e-popup-close')).toBe(true);
            (splitBtn.parentElement.querySelector('.e-dropdown-btn') as HTMLElement).click();
            expect(document.body.querySelector('#'+splitBtn.id+'_dropdownbtn-popup').classList.contains('e-popup-open')).toBe(true);

            //Clicking on Dropdownbutton
            (document.body.querySelector('#item3') as HTMLElement).dispatchEvent(new Event('mousedown', { bubbles: true }));
            expect(document.body.querySelector('.e-popup-open') !== null).toBe(true);
            (document.body.querySelector('#item3') as HTMLElement).click();
            expect(document.body.querySelector('#'+splitBtn.id+'_dropdownbtn-popup').classList.contains('e-popup-close')).toBe(true);
            expect(document.body.querySelector('#ribbon_tab_sim_ovrl_overflow-popup').classList.contains('e-popup-open')).toBe(true);
            expect(document.body.querySelector('#item3-popup').classList.contains('e-popup-open')).toBe(true);

            //Clicking on colorpicker
            (splitBtn.parentElement.querySelector('.e-dropdown-btn') as HTMLElement).dispatchEvent(new Event('mousedown', { bubbles: true }));
            (splitBtn.parentElement.querySelector('.e-dropdown-btn') as HTMLElement).click();
            expect(document.body.querySelector('#'+splitBtn.id+'_dropdownbtn-popup').classList.contains('e-popup-open')).toBe(true);
            expect(document.body.querySelector('#ribbon_tab_sim_ovrl_overflow-popup').classList.contains('e-popup-open')).toBe(true);
            expect(document.body.querySelector('#item3-popup').classList.contains('e-popup-close')).toBe(true);

            //Clicking on button
            (ribbon.element.querySelector('#item1') as HTMLElement).dispatchEvent(new Event('mousedown', { bubbles: true }));
            expect(document.body.querySelector('#'+splitBtn.id+'_dropdownbtn-popup').classList.contains('e-popup-close')).toBe(true);
            expect(document.body.querySelector('#ribbon_tab_sim_ovrl_overflow-popup').classList.contains('e-popup-close')).toBe(true);
            expect(document.body.querySelector('#item3-popup').classList.contains('e-popup-close')).toBe(true);
        });

        it('dropdown with before close event', () => {
            let isDropdownBeforeClose: boolean = false;
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
                                type: RibbonItemType.DropDown,
                                allowedSizes: RibbonItemSize.Medium,
                                displayOptions: DisplayMode.Overflow,
                                dropDownSettings: {
                                    content: 'Edit',
                                    iconCss: 'e-icons e-edit',
                                    items: dropDownButtonItems,
                                    beforeClose: (args: BeforeOpenCloseMenuEventArgs) => {
                                        isDropdownBeforeClose = true;
                                    }
                                }
                            }]
                        }]
                    }]
                }]
            }, ribbonEle);
            expect(isDropdownBeforeClose).toBe(false);
            expect(document.body.querySelector('#item1-popup').classList.contains('e-popup-close')).toBe(true);
            (document.body.querySelector('#item1') as any).ej2_instances[0].openPopUp();
            expect(document.body.querySelector('#item1-popup').classList.contains('e-popup-open')).toBe(true);
            (document.body.querySelector('#item1') as any).ej2_instances[0].closePopup();
            expect(document.body.querySelector('#item1-popup').classList.contains('e-popup-close')).toBe(true);
            expect(isDropdownBeforeClose).toBe(true);
        });

        it('colorpicker with before close event', () => {
            let isColorPickerBeforeClose: boolean = false;
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
                                type: RibbonItemType.ColorPicker,
                                displayOptions: DisplayMode.Overflow,
                                colorPickerSettings: {
                                    value: '#123456',
                                    beforeClose: (args: BeforeCloseEventArgs) => {
                                        isColorPickerBeforeClose = true;
                                    }
                                }
                            }]
                        }]
                    }]
                }]
            }, ribbonEle);
            (ribbon.element.querySelector('.e-ribbon-group-overflow-ddb') as HTMLElement).click();
            expect(isColorPickerBeforeClose).toBe(false);
            let splitBtn: HTMLElement = document.querySelector('#item1').parentElement.querySelector('.e-split-colorpicker');
            expect(document.body.querySelector('#'+splitBtn.id+'_dropdownbtn-popup').classList.contains('e-popup-close')).toBe(true);
            (splitBtn.parentElement.querySelector('.e-dropdown-btn') as HTMLElement).click();
            expect(document.body.querySelector('#'+splitBtn.id+'_dropdownbtn-popup').classList.contains('e-popup-open')).toBe(true);
            (splitBtn.parentElement.querySelector('.e-dropdown-btn') as HTMLElement).click();
            expect(isColorPickerBeforeClose).toBe(true);
            expect(document.body.querySelector('#'+splitBtn.id+'_dropdownbtn-popup').classList.contains('e-popup-close')).toBe(true);
        });

        it('splitbutton with before close event', () => {
            let isSplitbuttonBeforeClose: boolean = false;
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
                                type: RibbonItemType.SplitButton,
                                displayOptions: DisplayMode.Overflow,                               
                                splitButtonSettings: {
                                    content: 'Edit',
                                    iconCss: 'e-icons e-edit',
                                    items: dropDownButtonItems,
                                    beforeClose: (args: BeforeOpenCloseMenuEventArgs) => {
                                        isSplitbuttonBeforeClose = true;
                                    }
                                }
                            }]
                        }]
                    }]
                }]
            }, ribbonEle);
            expect(isSplitbuttonBeforeClose).toBe(false);
            expect(document.body.querySelector('#item1_dropdownbtn-popup').classList.contains('e-popup-close')).toBe(true);
            (document.body.querySelector('#item1') as any).ej2_instances[0].openPopUp();
            expect(document.body.querySelector('#item1_dropdownbtn-popup').classList.contains('e-popup-open')).toBe(true);
            (document.body.querySelector('#item1') as any).ej2_instances[0].closePopup();
            expect(document.body.querySelector('#item1_dropdownbtn-popup').classList.contains('e-popup-close')).toBe(true);
            expect(isSplitbuttonBeforeClose).toBe(true);
        });
    });
});
