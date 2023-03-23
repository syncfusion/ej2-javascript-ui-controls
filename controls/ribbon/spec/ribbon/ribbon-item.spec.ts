import { createElement, getComponent, remove } from "@syncfusion/ej2-base";
import { DisplayMode, FileMenuSettingsModel, ItemOrientation, LauncherClickEventArgs, Ribbon, RibbonItemSize, RibbonItemType, RibbonLayout, RibbonTabModel } from "../../src/index";
import { RibbonColorPicker,RibbonFileMenu } from "../../src/index";
import { MenuItemModel } from "@syncfusion/ej2-navigations";
import { ClickEventArgs, DropDownButton, MenuEventArgs } from "@syncfusion/ej2-splitbuttons";
import { SelectEventArgs } from "@syncfusion/ej2-dropdowns";
import { ChangeEventArgs as CheckChange } from "@syncfusion/ej2-buttons";
import { ChangeEventArgs } from "@syncfusion/ej2-inputs";

Ribbon.Inject(RibbonColorPicker,RibbonFileMenu);

let fontStyle: string[] = ['Algerian', 'Arial', 'Calibri', 'Cambria', 'Cambria Math', 'Candara', 'Courier New', 'Georgia', 'Impact', 'Segoe Print', 'Segoe Script', 'Segoe UI', 'Symbol', 'Times New Roman', 'Verdana', 'Windings'
];
describe('Ribbon Items', () => {
    beforeAll(() => {
        const isDef: any = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log('Unsupported environment, window.performance.memory is unavailable');
            this.skip(); // skips test (in Chai)
            return;
        }
    });
    describe('All Items', () => {
        let ribbon: Ribbon;
        let ribbonEle: HTMLElement;
        let containerEle: HTMLElement;
        let outputEle: HTMLElement;
        let isCloseCalled: boolean;
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
                        displayOptions: DisplayMode.Simplified,
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
                            close: ()=>{ isCloseCalled = true; }
                        }
                    },{
                        type: RibbonItemType.DropDown,
                        allowedSizes: RibbonItemSize.Large ,
                        displayOptions: DisplayMode.Simplified,
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
                            close: ()=>{ isCloseCalled = true; }
                        }
                    },{
                        type: RibbonItemType.Button,
                        id: 'largecut',
                        allowedSizes: RibbonItemSize.Large ,
                        displayOptions: DisplayMode.Simplified,
                        cssClass: 'test-css',
                        buttonSettings: {
                            clicked: ()=>{
                                outputEle.innerText = ("Large " + "Cut Clicked");
                            },
                            content: 'cut',
                            iconCss: 'e-icons e-cut'
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
                        displayOptions: DisplayMode.Simplified,
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
                        displayOptions: DisplayMode.Simplified,
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
                        displayOptions: DisplayMode.Simplified,
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
                        displayOptions: DisplayMode.Simplified,
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
                        displayOptions: DisplayMode.Simplified,
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
                        displayOptions: DisplayMode.Simplified,
                        id: 'smallcut',
                        allowedSizes: RibbonItemSize.Small ,
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
                        displayOptions: DisplayMode.Simplified,
                        comboBoxSettings: {
                            select: (args: SelectEventArgs)=>{
                                outputEle.innerText = ("Font " + args.itemData.text);
                            },
                            dataSource: fontStyle,
                            cssClass: 'test-css',
                            index: 2,
                            allowFiltering: true,
                            close: ()=>{ isCloseCalled = true; }
                        }
                    }]
                }, {
                    items: [{
                        type: RibbonItemType.CheckBox,
                        id: 'fontbold',
                        displayOptions: DisplayMode.Simplified,
                        checkBoxSettings: {
                            cssClass: 'test-css',
                            change: (args: CheckChange)=>{
                                outputEle.innerText = ("Font " + args.checked);
                            },
                            label: 'Ruler',
                            checked: false
                        }
                    }, {
                        type: RibbonItemType.ColorPicker,
                        displayOptions: DisplayMode.Simplified,
                        id: 'fontcolor',
                        colorPickerSettings: {
                            cssClass: 'test-css',
                            change: (args: ChangeEventArgs)=>{
                                outputEle.innerText = ("Font " + args.value);
                            },
                            value: '#123456',
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
                        displayOptions: DisplayMode.Overflow,
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
                        displayOptions: DisplayMode.Overflow,
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
                        displayOptions: DisplayMode.Overflow,
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
                        displayOptions: DisplayMode.Overflow,
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
                        displayOptions: DisplayMode.Overflow,
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
                        displayOptions: DisplayMode.Overflow,
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
                        displayOptions: DisplayMode.Overflow,
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
                tabs: tabs,
                activeLayout: RibbonLayout.Simplified
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
                tabs: tabs,
                activeLayout: RibbonLayout.Simplified
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
            let hexinput: HTMLInputElement = popup.querySelector('.e-hex');
            hexinput.value = '#12911291';
            hexinput.dispatchEvent(new Event('input'));
            (popup.querySelector('.e-apply') as HTMLElement).click();
            expect(outputEle.innerText.toLowerCase()).toBe('font #12911291');
            containerEle.style.width = '600px';
            ribbon.refreshLayout();
            outputEle.innerText = '';
            document.getElementById('font_overflow_dropdown').click();
            splitBtn = document.getElementById('fontcolor').parentElement.querySelector('.e-split-colorpicker');
            (splitBtn.parentElement.querySelector('.e-dropdown-btn') as HTMLElement).click();
            popup = document.getElementById(splitBtn.id+'_dropdownbtn-popup');
            hexinput = popup.querySelector('.e-hex');
            hexinput.value = '#33333391';
            hexinput.dispatchEvent(new Event('input'));
            (popup.querySelector('.e-apply') as HTMLElement).click();
            expect(outputEle.innerText.toLowerCase()).toBe('font #33333391');
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
            let hexinput: HTMLInputElement = popup.querySelector('.e-hex');
            hexinput.value = '#12911291';
            hexinput.dispatchEvent(new Event('input'));
            (popup.querySelector('.e-apply') as HTMLElement).click();
            expect(outputEle.innerText.toLowerCase()).toBe('font #12911291');
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
            let hexinput: HTMLInputElement = popup.querySelector('.e-hex');
            hexinput.value = '#12911291';
            hexinput.dispatchEvent(new Event('input'));
            (popup.querySelector('.e-apply') as HTMLElement).click();
            expect(outputEle.innerText.toLowerCase()).toBe('groupoverflow #12911291');
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
            let hexinput: HTMLInputElement = popup.querySelector('.e-hex');
            hexinput.value = '#12911291';
            hexinput.dispatchEvent(new Event('input'));
            (popup.querySelector('.e-apply') as HTMLElement).click();
            expect(outputEle.innerText.toLowerCase()).toBe('commonoverflow #12911291');
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
    });
});

