import { createElement, remove } from "@syncfusion/ej2-base";
import { DisplayMode, ItemOrientation, Ribbon, RibbonItemSize, RibbonItemType } from "../../src/index";
import { ItemModel } from "@syncfusion/ej2-splitbuttons";

describe('Combinations Of Display Options', () => {
    let dropDownButtonItems: ItemModel[] = [
        { text: 'New tab' },
        { text: 'New window' },
        { text: 'New incognito window' },
        { separator: true },
        { text: 'Print' },
        { text: 'Cast' },
        { text: 'Find' }];
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

    it('Classic Display Option In Various Index', () => {
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
                            displayOptions: DisplayMode.Classic,
                            type: RibbonItemType.Button,
                            allowedSizes: RibbonItemSize.Medium,
                            buttonSettings: {
                                content: 'button1',
                                iconCss: 'e-icons e-cut',
                            }
                        }, {
                            id: "item2",
                            displayOptions: DisplayMode.Simplified,
                            type: RibbonItemType.Button,
                            buttonSettings: {
                                content: 'copy',
                                iconCss: 'e-icons e-copy'
                            }
                        }, {
                            id: "item3",
                            displayOptions: DisplayMode.Simplified,
                            type: RibbonItemType.Button,
                            buttonSettings: {
                                content: 'Format Painter',
                                iconCss: 'e-icons e-paste'
                            }
                        }]
                    }, {
                        id: "collection2",
                        items: [{
                            id: "item4",
                            displayOptions: DisplayMode.Simplified,
                            type: RibbonItemType.DropDown,
                            allowedSizes: RibbonItemSize.Medium,
                            dropDownSettings: {
                                content: 'Edit',
                                iconCss: 'e-icons e-edit',
                                items: dropDownButtonItems
                            }
                        }, {
                            id: "item5",
                            type: RibbonItemType.SplitButton,
                            displayOptions: DisplayMode.Classic,
                            splitButtonSettings: {
                                content: 'Options',
                                iconCss: 'e-icons e-edit',
                                items: dropDownButtonItems
                            }
                        }, {
                            id: "item6",
                            displayOptions: DisplayMode.Simplified,
                            type: RibbonItemType.Button,
                            splitButtonSettings: {
                                content: 'Copy',
                                iconCss: 'e-icons e-copy'
                            }
                        }]
                    }, {
                        id: "collection3",
                        items: [{
                            id: "item7",
                            type: RibbonItemType.DropDown,
                            displayOptions: DisplayMode.Simplified,
                            allowedSizes: RibbonItemSize.Medium,
                            dropDownSettings: {
                                content: 'Edit',
                                iconCss: 'e-icons e-edit',
                                items: dropDownButtonItems
                            }
                        }, {
                            id: "item8",
                            displayOptions: DisplayMode.Simplified,
                            type: RibbonItemType.SplitButton,
                            splitButtonSettings: {
                                content: 'Options',
                                iconCss: 'e-icons e-edit',
                                items: dropDownButtonItems
                            }
                        }, {
                            id: "item9",
                            type: RibbonItemType.Button,
                            displayOptions: DisplayMode.Classic,
                            splitButtonSettings: {
                                content: 'Copy',
                                iconCss: 'e-icons e-copy'
                            }
                        }]
                    }]
                }]
            }]
        }, ribbonEle);
        expect(ribbon.activeLayout).toBe('Classic');
        expect(ribbon.element.querySelectorAll('.e-ribbon-item').length).toBe(3);
        let collection1: HTMLElement = document.querySelector('#collection1');
        expect(collection1.querySelectorAll('.e-ribbon-item').length).toBe(1);
        let collection2: HTMLElement = document.querySelector('#collection2');
        expect(collection2.querySelectorAll('.e-ribbon-item').length).toBe(1);
        let collection3: HTMLElement = document.querySelector('#collection3');
        expect(collection3.querySelectorAll('.e-ribbon-item').length).toBe(1);
        (ribbon.element.querySelector('.e-ribbon-collapse-btn') as HTMLElement).click();
        expect(ribbon.element.classList.contains('e-ribbon-minimize')).toBe(false);
        expect(ribbon.activeLayout).toBe('Simplified');
        expect(ribbon.element.querySelectorAll('.e-ribbon-item').length).toBe(6);
        expect(collection1.querySelectorAll('.e-ribbon-item').length).toBe(2);
        expect(collection2.querySelectorAll('.e-ribbon-item').length).toBe(2);
        expect(collection3.querySelectorAll('.e-ribbon-item').length).toBe(2);
    });

    it('Classic Display Option In Shrinking', () => {
        let fontStyle: string[] = ['Algerian', 'Arial', 'Calibri', 'Cambria', 'Cambria Math', 'Candara', 'Courier New', 'Georgia', 'Impact', 'Segoe Print', 'Segoe Script', 'Segoe UI', 'Symbol', 'Times New Roman', 'Verdana', 'Windings'
        ];
        let fontSize: string[] = ['8', '9', '10', '11', '12', '14', '16', '18', '20', '22', '24', '26', '28', '36', '48', '72', '96'];

        let template1 = '<button id="btn1" class="tempContent">Button1</button>';
        let template2 = createElement('button', { id: 'btn2', className: 'tempContent2', innerHTML: 'Button2' });
        ribbon = new Ribbon({
            tabs: [{
                header: "Home",
                groups: [{
                    header: "Clipboard",
                    groupIconCss:'e-icons e-paste',
                    showLauncherIcon: true,
                    enableGroupOverflow: true,
                    collections: [{
                        items: [{
                            type: RibbonItemType.SplitButton,
                            displayOptions: DisplayMode.Overflow,
                            allowedSizes: RibbonItemSize.Large,
                            splitButtonSettings: {
                                content: 'Paste',
                                iconCss: 'e-icons e-paste',
                                items: [{ text: 'Keep Source Format' }, { text: 'Merge format' }, { text: 'Keep text only' }]
                            }
                        }]
                    }, {
                        items: [{
                            type: RibbonItemType.Button,
                            buttonSettings: {
                                content: 'cut',
                                iconCss: 'e-icons e-cut'
                            }
                        }, {
                            type: RibbonItemType.Button,
                            buttonSettings: {
                                content: 'copy',
                                iconCss: 'e-icons e-copy'
                            }
                        }, {
                            type: RibbonItemType.Button,
                            buttonSettings: {
                                content: 'Format Painter',
                                iconCss: 'e-icons e-paste'
                            }
                        }]
                    },]
                }, {
                    header: "Font",
                    orientation: 'Row',
                    groupIconCss:'e-icons e-bold',
                    cssClass: 'font-group',
                    id: 'font-group',
                    collections: [{
                        id: 'font-fam',
                        items: [{
                            type: RibbonItemType.ComboBox,
                            comboBoxSettings: {
                                dataSource: fontStyle,
                                index: 2,
                                allowFiltering: true,
                                width: '150px'
                            }
                        }, {
                            type: RibbonItemType.ComboBox,
                            displayOptions: DisplayMode.Simplified,
                            comboBoxSettings: {
                                dataSource: fontSize,
                                index: 4,
                                width: '65px'
                            }
                        }]
                    }, {
                        items: [{
                            type: RibbonItemType.Button,
                            displayOptions: DisplayMode.Simplified,
                            allowedSizes: RibbonItemSize.Small,
                            buttonSettings: {
                                content: 'Bold',
                                iconCss: 'e-icons e-bold'
                            }
                        }, {
                            type: RibbonItemType.Button,
                            displayOptions: DisplayMode.Overflow,
                            allowedSizes: RibbonItemSize.Small,
                            buttonSettings: {
                                content: 'Italic',
                                iconCss: 'e-icons e-italic'
                            }
                        }, {
                            type: RibbonItemType.Button,
                            displayOptions: DisplayMode.Classic | DisplayMode.Overflow,
                            allowedSizes: RibbonItemSize.Small,
                            buttonSettings: {
                                content: 'UnderLine',
                                iconCss: 'e-icons e-underline'
                            }
                        }, {
                            type: RibbonItemType.ColorPicker,
                            displayOptions: DisplayMode.Classic,
                            colorPickerSettings: {
                                value: '#123456'
                            }
                        }
            
                        ]
                    }]
                }, {
                    header: "Editing",
                    groupIconCss: 'e-icons e-edit',
                    orientation: ItemOrientation.Row,
                    collections: [{
                        items: [{
                            type: RibbonItemType.SplitButton,
                            displayOptions: DisplayMode.Classic | DisplayMode.Overflow,
                            splitButtonSettings: {
                                content: 'Find',
                                iconCss: 'e-icons e-search',
                                items: [{ text: 'Find', iconCss: 'e-icons e-search' },
                                { text: 'Advanced find', iconCss: 'e-icons e-search' },
                                { text: 'Go to', iconCss: 'e-icons e-arrow-right' }]
                            }
                        }, {
                            type: RibbonItemType.Button,
                            displayOptions: DisplayMode.Simplified,
                            buttonSettings: {
                                content: 'Replace',
                                iconCss: 'e-icons e-replace'
                            }
                        }, {
                            type: RibbonItemType.SplitButton,
                            displayOptions: DisplayMode.Simplified | DisplayMode.Classic,
                            splitButtonSettings: {
                                content: 'Select',
                                iconCss: 'e-icons e-mouse-pointer',
                                items: [{ text: 'Select All' },
                                { text: 'Select Objects' }]
                            }
                        }]
                    }]
                },{
                    header: "Templates",
                    orientation: ItemOrientation.Column,
                    groupIconCss:'e-icons e-paste',
                    showLauncherIcon: true,
                    collections: [{
                        items: [{
                            type: RibbonItemType.Template,
                            displayOptions: DisplayMode.Simplified | DisplayMode.Overflow,
                            cssClass: 'template-item',
                            itemTemplate: template1
                        }, {
                            type: RibbonItemType.Template,
                            displayOptions: DisplayMode.Simplified | DisplayMode.Classic,
                            cssClass: 'template-item',
                            itemTemplate: template2.outerHTML
                        }, {
                            type: RibbonItemType.Template,
                            displayOptions: DisplayMode.Auto,
                            cssClass: 'template-item',
                            itemTemplate: "#btn3"
                        }]
                    }, {
                        items: [{
                            cssClass: 'template-item',
                            type: RibbonItemType.Template,
                            itemTemplate: "#ribbonTemplate"
                        }]
                    }]
                }]
            }, {
                header: 'Insert',
                groups: [{
                    header: 'Tables',
                    groupIconCss:'e-icons e-table',
                    showLauncherIcon: true,
                    collections: [{
                        items: [{
                            type: RibbonItemType.DropDown,
                            allowedSizes: RibbonItemSize.Large,
                            dropDownSettings: {
                                content: 'Table',
                                iconCss: 'e-icons e-table',
                                items: [
                                    { text: 'Insert Table' }, { text: 'Draw Table' },
                                    { text: 'Convert Table' }, { text: 'Excel SpreadSheet' }
                                ]
                            }
                        }]
                    }]
                }, {
                    header: 'Illustrations',
                    groupIconCss:'e-icons e-iamge',
                    collections: [{
                        items: [{
                            type: RibbonItemType.DropDown,
                            allowedSizes: RibbonItemSize.Large,
                            id: 'pictureddl',
                            dropDownSettings: {
                                content: 'Pictures',
                                iconCss: 'e-icons e-image',
                                target: '#pictureList'
                            }
                        }]
                    }, {
                        items: [{
                            type: RibbonItemType.SplitButton,
                            splitButtonSettings: {
                                content: 'Shapes',
                                items: [{ text: 'Lines' }, { text: 'Rectangles' }, { text: 'Basic Arrows' }, { text: 'Basic Shapes' }, { text: 'FlowChart' }]
                            }
                        }, {
                            type: RibbonItemType.Button,
                            buttonSettings: {
                                content: 'Icons'
                            }
                        }, {
                            type: RibbonItemType.Button,
                            buttonSettings: {
                                content: '3D Models'
                            }
                        }]
                    }, {
                        items: [{
                            type: RibbonItemType.Button,
                            buttonSettings: {
                                content: 'SmartArt'
                            }
                        }, {
                            type: RibbonItemType.Button,
                            buttonSettings: {
                                content: 'Chart'
                            }
                        }, {
                            type: RibbonItemType.Button,
                            buttonSettings: {
                                content: 'Screenshot'
                            }
                        }]
                    }]
                }, {
                    header: 'Header & Footer',
                    groupIconCss:'e-icons e-table',
                    collections: [{
                        items: [{
                            type: RibbonItemType.DropDown,
                            dropDownSettings: {
                                content: 'Header',
                                items: [{ text: 'Insert Header' }, { text: 'Edit Header' }, { text: 'Remove Header' }]
                            }
                        }, {
                            type: RibbonItemType.DropDown,
                            dropDownSettings: {
                                content: 'Footer',
                                items: [{ text: 'Insert Footer' }, { text: 'Edit Footer' }, { text: 'Remove Footer' }]
                            }
                        }, {
                            type: RibbonItemType.DropDown,
                            dropDownSettings: {
                                content: 'Page Number',
                                items: [{ text: 'Insert Top of page' }, { text: 'Insert Bottom of page' }, { text: 'Format Page Number' }, { text: 'Remove Page Number' }]
                            }
                        }]
                    }]
                }]
            }, {
                header: 'View',
                groups: [{
                    header: 'views',
                    groupIconCss:'e-icons e-print',
                    collections: [{
                        items: [{
                            type: RibbonItemType.Button,
                            allowedSizes: RibbonItemSize.Large,
                            buttonSettings: {
                                iconCss: 'e-print e-icons',
                                content: 'Read Mode'
                            }
                        }]
                    }, {
                        items: [{
                            type: RibbonItemType.Button,
                            allowedSizes: RibbonItemSize.Large,
                            buttonSettings: {
                                iconCss: 'e-print e-icons',
                                content: 'Print Layout'
                            }
                        }]
                    }, {
                        items: [{
                            type: RibbonItemType.Button,
                            allowedSizes: RibbonItemSize.Large,
                            buttonSettings: {
                                iconCss: 'e-print e-icons',
                                content: 'Web Layout'
                            }
                        }]
                    }, {
                        items: [{
                            type: RibbonItemType.Button,
                            buttonSettings: {
                                iconCss: 'e-print e-icons',
                                content: 'Outline'
                            }
                        }, {
                            type: RibbonItemType.Button,
                            buttonSettings: {
                                iconCss: 'e-print e-icons',
                                content: 'Draft'
                            }
                        }]
                    }]
                }, {
                    header: 'Page Movement',
                    orientation: ItemOrientation.Row,
                    groupIconCss:'e-icons e-paste',
                    collections: [{
                        items: [{
                            type: RibbonItemType.Button,
                            allowedSizes: RibbonItemSize.Large,
                            buttonSettings: {
                                iconCss: 'e-paste e-icons',
                                content: 'Vertical'
                            }
                        }, {
                            type: RibbonItemType.Button,
                            allowedSizes: RibbonItemSize.Large,
                            buttonSettings: {
                                iconCss: 'e-paste e-icons',
                                content: 'Side to Side'
                            }
                        }]
                    }]
                }, {
                    header: 'Show',
                    groupIconCss:'e-icons e-copy',
                    collections: [{
                        items: [{
                            type: RibbonItemType.CheckBox,
                            displayOptions: DisplayMode.Simplified | DisplayMode.Classic,
                            checkBoxSettings: {
                                label: 'Ruler',
                                checked: false
                            }
                        }, {
                            type: RibbonItemType.CheckBox,
                            displayOptions: DisplayMode.Simplified,
                            checkBoxSettings: {
                                label: 'Gridlines',
                                checked: false
                            }
                        }, {
                            type: RibbonItemType.CheckBox,
                            displayOptions: DisplayMode.Classic,
                            checkBoxSettings: {
                                label: 'Navigation Pane',
                                checked: true
                            }
                        }]
                    }]
                }]
            }]
        }, ribbonEle);
        expect(ribbon.activeLayout).toBe('Classic');
        expect(ribbon.element.querySelectorAll('.e-ribbon-item').length).toBe(11);
        containerEle.style.width = '500px';
        ribbon.refreshLayout();
    });

    it('Simplified Display Option In Various Index', () => {
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
                            displayOptions: DisplayMode.Simplified,
                            type: RibbonItemType.Button,
                            allowedSizes: RibbonItemSize.Medium,
                            buttonSettings: {
                                content: 'button1',
                                iconCss: 'e-icons e-cut',
                            }
                        }, {
                            id: "item2",
                            displayOptions: DisplayMode.Classic,
                            type: RibbonItemType.Button,
                            buttonSettings: {
                                content: 'copy',
                                iconCss: 'e-icons e-copy'
                            }
                        }, {
                            id: "item3",
                            displayOptions: DisplayMode.Classic,
                            type: RibbonItemType.Button,
                            buttonSettings: {
                                content: 'Format Painter',
                                iconCss: 'e-icons e-paste'
                            }
                        }]
                    }, {
                        id: "collection2",
                        items: [{
                            id: "item4",
                            displayOptions: DisplayMode.Classic,
                            type: RibbonItemType.DropDown,
                            allowedSizes: RibbonItemSize.Medium,
                            dropDownSettings: {
                                content: 'Edit',
                                iconCss: 'e-icons e-edit',
                                items: dropDownButtonItems
                            }
                        }, {
                            id: "item5",
                            type: RibbonItemType.SplitButton,
                            displayOptions: DisplayMode.Simplified,
                            splitButtonSettings: {
                                content: 'Options',
                                iconCss: 'e-icons e-edit',
                                items: dropDownButtonItems
                            }
                        }, {
                            id: "item6",
                            displayOptions: DisplayMode.Classic,
                            type: RibbonItemType.Button,
                            splitButtonSettings: {
                                content: 'Copy',
                                iconCss: 'e-icons e-copy'
                            }
                        }]
                    }, {
                        id: "collection3",
                        items: [{
                            id: "item7",
                            type: RibbonItemType.DropDown,
                            displayOptions: DisplayMode.Classic,
                            allowedSizes: RibbonItemSize.Medium,
                            dropDownSettings: {
                                content: 'Edit',
                                iconCss: 'e-icons e-edit',
                                items: dropDownButtonItems
                            }
                        }, {
                            id: "item8",
                            displayOptions: DisplayMode.Classic,
                            type: RibbonItemType.SplitButton,
                            splitButtonSettings: {
                                content: 'Options',
                                iconCss: 'e-icons e-edit',
                                items: dropDownButtonItems
                            }
                        }, {
                            id: "item9",
                            type: RibbonItemType.Button,
                            displayOptions: DisplayMode.Simplified,
                            splitButtonSettings: {
                                content: 'Copy',
                                iconCss: 'e-icons e-copy'
                            }
                        }]
                    }]
                }]
            }]
        }, ribbonEle);
        expect(ribbon.activeLayout).toBe('Classic');
        expect(ribbon.element.querySelectorAll('.e-ribbon-item').length).toBe(6);
        let collection1: HTMLElement = document.querySelector('#collection1');
        expect(collection1.querySelectorAll('.e-ribbon-item').length).toBe(2);
        let collection2: HTMLElement = document.querySelector('#collection2');
        expect(collection2.querySelectorAll('.e-ribbon-item').length).toBe(2);
        let collection3: HTMLElement = document.querySelector('#collection3');
        expect(collection3.querySelectorAll('.e-ribbon-item').length).toBe(2);
        (ribbon.element.querySelector('.e-ribbon-collapse-btn') as HTMLElement).click();
        expect(ribbon.element.classList.contains('e-ribbon-minimize')).toBe(false);
        expect(ribbon.activeLayout).toBe('Simplified');
        expect(ribbon.element.querySelectorAll('.e-ribbon-item').length).toBe(3);
        expect(collection1.querySelectorAll('.e-ribbon-item').length).toBe(1);
        expect(collection2.querySelectorAll('.e-ribbon-item').length).toBe(1);
        expect(collection3.querySelectorAll('.e-ribbon-item').length).toBe(1);
    });

    it('Overflow Display Option In Various Index', () => {
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
                            displayOptions: DisplayMode.Overflow,
                            type: RibbonItemType.Button,
                            allowedSizes: RibbonItemSize.Medium,
                            buttonSettings: {
                                content: 'button1',
                                iconCss: 'e-icons e-cut',
                            }
                        }, {
                            id: "item2",
                            displayOptions: DisplayMode.Simplified,
                            type: RibbonItemType.Button,
                            buttonSettings: {
                                content: 'copy',
                                iconCss: 'e-icons e-copy'
                            }
                        }, {
                            id: "item3",
                            displayOptions: DisplayMode.Classic,
                            type: RibbonItemType.Button,
                            buttonSettings: {
                                content: 'Format Painter',
                                iconCss: 'e-icons e-paste'
                            }
                        }]
                    }, {
                        id: "collection2",
                        items: [{
                            id: "item4",
                            displayOptions: DisplayMode.Simplified,
                            type: RibbonItemType.DropDown,
                            allowedSizes: RibbonItemSize.Medium,
                            dropDownSettings: {
                                content: 'Edit',
                                iconCss: 'e-icons e-edit',
                                items: dropDownButtonItems
                            }
                        }, {
                            id: "item5",
                            type: RibbonItemType.SplitButton,
                            displayOptions: DisplayMode.Overflow,
                            splitButtonSettings: {
                                content: 'Options',
                                iconCss: 'e-icons e-edit',
                                items: dropDownButtonItems
                            }
                        }, {
                            id: "item6",
                            displayOptions: DisplayMode.Classic,
                            type: RibbonItemType.Button,
                            splitButtonSettings: {
                                content: 'Copy',
                                iconCss: 'e-icons e-copy'
                            }
                        }]
                    }, {
                        id: "collection3",
                        items: [{
                            id: "item7",
                            type: RibbonItemType.DropDown,
                            displayOptions: DisplayMode.Simplified,
                            allowedSizes: RibbonItemSize.Medium,
                            dropDownSettings: {
                                content: 'Edit',
                                iconCss: 'e-icons e-edit',
                                items: dropDownButtonItems
                            }
                        }, {
                            id: "item8",
                            displayOptions: DisplayMode.Classic,
                            type: RibbonItemType.SplitButton,
                            splitButtonSettings: {
                                content: 'Options',
                                iconCss: 'e-icons e-edit',
                                items: dropDownButtonItems
                            }
                        }, {
                            id: "item9",
                            type: RibbonItemType.Button,
                            displayOptions: DisplayMode.Overflow,
                            splitButtonSettings: {
                                content: 'Copy',
                                iconCss: 'e-icons e-copy'
                            }
                        }]
                    }]
                }]
            }]
        }, ribbonEle);
        expect(ribbon.activeLayout).toBe('Classic');
        expect(ribbon.element.querySelectorAll('.e-ribbon-item').length).toBe(3);
        let collection1: HTMLElement = document.querySelector('#collection1');
        expect(collection1.querySelectorAll('.e-ribbon-item').length).toBe(1);
        let collection2: HTMLElement = document.querySelector('#collection2');
        expect(collection2.querySelectorAll('.e-ribbon-item').length).toBe(1);
        let collection3: HTMLElement = document.querySelector('#collection3');
        expect(collection3.querySelectorAll('.e-ribbon-item').length).toBe(1);
        (ribbon.element.querySelector('.e-ribbon-collapse-btn') as HTMLElement).click();
        expect(ribbon.element.classList.contains('e-ribbon-minimize')).toBe(false);
        expect(ribbon.activeLayout).toBe('Simplified');
        expect(ribbon.element.querySelectorAll('.e-ribbon-item').length).toBe(3);
        expect(collection1.querySelectorAll('.e-ribbon-item').length).toBe(1);
        expect(collection2.querySelectorAll('.e-ribbon-item').length).toBe(1);
        expect(collection3.querySelectorAll('.e-ribbon-item').length).toBe(1);
        expect(document.body.querySelector('#ribbon_tab_sim_ovrl_overflow-popup').classList.contains('e-popup-close')).toBe(true);
        (ribbon.element.querySelector('.e-ribbon-group-overflow-ddb') as HTMLElement).click();
        expect(document.body.querySelector('#ribbon_tab_sim_ovrl_overflow-popup').classList.contains('e-popup-open')).toBe(true);
        let overflowEle: HTMLElement = document.body.querySelector('.e-ribbon-overflow-target');
        expect(overflowEle.querySelectorAll('.e-ribbon-item').length).toBe(3);
        expect(collection1.querySelectorAll('.e-ribbon-item').length).toBe(1);
        expect(collection2.querySelectorAll('.e-ribbon-item').length).toBe(1);
        expect(collection3.querySelectorAll('.e-ribbon-item').length).toBe(1);
    });
    
    it('Combinations of Classic and Simplified Display Options', () => {
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
                            displayOptions: DisplayMode.Classic | DisplayMode.Simplified,
                            type: RibbonItemType.Button,
                            allowedSizes: RibbonItemSize.Medium,
                            buttonSettings: {
                                content: 'button1',
                                iconCss: 'e-icons e-cut',
                            }
                        }, {
                            id: "item2",
                            displayOptions: DisplayMode.Auto,
                            type: RibbonItemType.Button,
                            buttonSettings: {
                                content: 'copy',
                                iconCss: 'e-icons e-copy'
                            }
                        }, {
                            id: "item3",
                            displayOptions: DisplayMode.Simplified,
                            type: RibbonItemType.Button,
                            buttonSettings: {
                                content: 'Format Painter',
                                iconCss: 'e-icons e-paste'
                            }
                        }]
                    }, {
                        id: "collection2",
                        items: [{
                            id: "item4",
                            displayOptions: DisplayMode.Simplified | DisplayMode.Classic,
                            type: RibbonItemType.DropDown,
                            allowedSizes: RibbonItemSize.Medium,
                            dropDownSettings: {
                                content: 'Edit',
                                iconCss: 'e-icons e-edit',
                                items: dropDownButtonItems
                            }
                        },                           
                        {                               
                            id: "item5",
                            type: RibbonItemType.SplitButton,
                            displayOptions: DisplayMode.Classic,
                            splitButtonSettings: {
                                content: 'Options',
                                iconCss: 'e-icons e-edit',
                                items: dropDownButtonItems
                            }
                        }]
                    }]
                }]
            }]
        }, ribbonEle);
        expect(ribbon.activeLayout).toBe('Classic');
        expect(ribbon.element.querySelectorAll('.e-ribbon-item').length).toBe(4);
        let collection1: HTMLElement = document.querySelector('#collection1');
        expect(collection1.querySelectorAll('.e-ribbon-item').length).toBe(2);
        let collection2: HTMLElement = document.querySelector('#collection2');
        expect(collection2.querySelectorAll('.e-ribbon-item').length).toBe(2);
        (ribbon.element.querySelector('.e-ribbon-collapse-btn') as HTMLElement).click();
        expect(ribbon.element.classList.contains('e-ribbon-minimize')).toBe(false);
        expect(ribbon.activeLayout).toBe('Simplified');
        expect(ribbon.element.querySelectorAll('.e-ribbon-item').length).toBe(4);
        expect(collection1.querySelectorAll('.e-ribbon-item').length).toBe(3);
        expect(collection2.querySelectorAll('.e-ribbon-item').length).toBe(1);
    });

    it('Combinations of Classic and Overflow Display Options', () => {
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
                            displayOptions: DisplayMode.Classic | DisplayMode.Overflow,
                            type: RibbonItemType.Button,
                            allowedSizes: RibbonItemSize.Medium,
                            buttonSettings: {
                                content: 'button1',
                                iconCss: 'e-icons e-cut',
                            }
                        }, {
                            id: "item2",
                            displayOptions: DisplayMode.Auto,
                            type: RibbonItemType.Button,
                            buttonSettings: {
                                content: 'copy',
                                iconCss: 'e-icons e-copy'
                            }
                        }, {
                            id: "item3",
                            displayOptions: DisplayMode.Overflow,
                            type: RibbonItemType.Button,
                            buttonSettings: {
                                content: 'Format Painter',
                                iconCss: 'e-icons e-paste'
                            }
                        }]
                    }, {
                        id: "collection2",
                        items: [{
                            id: "item4",
                            displayOptions: DisplayMode.Overflow | DisplayMode.Classic,
                            type: RibbonItemType.DropDown,
                            allowedSizes: RibbonItemSize.Medium,
                            dropDownSettings: {
                                content: 'Edit',
                                iconCss: 'e-icons e-edit',
                                items: dropDownButtonItems
                            }
                        },                           
                        {                               
                            id: "item5",
                            type: RibbonItemType.SplitButton,
                            displayOptions: DisplayMode.Classic,
                            splitButtonSettings: {
                                content: 'Options',
                                iconCss: 'e-icons e-edit',
                                items: dropDownButtonItems
                            }
                        }]
                    }]
                }]
            }]
        }, ribbonEle);
        expect(ribbon.activeLayout).toBe('Classic');
        expect(ribbon.element.querySelectorAll('.e-ribbon-item').length).toBe(4);
        let collection1: HTMLElement = document.querySelector('#collection1');
        expect(collection1.querySelectorAll('.e-ribbon-item').length).toBe(2);
        let collection2: HTMLElement = document.querySelector('#collection2');
        expect(collection2.querySelectorAll('.e-ribbon-item').length).toBe(2);
        (ribbon.element.querySelector('.e-ribbon-collapse-btn') as HTMLElement).click();
        expect(ribbon.element.classList.contains('e-ribbon-minimize')).toBe(false);
        expect(ribbon.activeLayout).toBe('Simplified');
        expect(ribbon.element.querySelectorAll('.e-ribbon-item').length).toBe(1);
        expect(collection1.querySelectorAll('.e-ribbon-item').length).toBe(1);
        expect(document.body.querySelector('#ribbon_tab_sim_ovrl_overflow-popup').classList.contains('e-popup-close')).toBe(true);
        (ribbon.element.querySelector('.e-ribbon-group-overflow-ddb') as HTMLElement).click();
        expect(document.body.querySelector('#ribbon_tab_sim_ovrl_overflow-popup').classList.contains('e-popup-open')).toBe(true);
        let overflowEle: HTMLElement = document.body.querySelector('.e-ribbon-overflow-target');
        expect(overflowEle.querySelectorAll('.e-ribbon-item').length).toBe(3);
    });

    it('Combinations of Simplified and Overflow Display Options', () => {
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
                            displayOptions: DisplayMode.Simplified,
                            type: RibbonItemType.Button,
                            allowedSizes: RibbonItemSize.Medium,
                            buttonSettings: {
                                content: 'button1',
                                iconCss: 'e-icons e-cut',
                            }
                        }, {
                            id: "item2",
                            displayOptions: DisplayMode.Auto,
                            type: RibbonItemType.Button,
                            buttonSettings: {
                                content: 'copy',
                                iconCss: 'e-icons e-copy'
                            }
                        }, {
                            id: "item3",
                            displayOptions: DisplayMode.Simplified | DisplayMode.Overflow,
                            type: RibbonItemType.Button,
                            buttonSettings: {
                                content: 'Format Painter',
                                iconCss: 'e-icons e-paste'
                            }
                        }]
                    }, {
                        id: "collection2",
                        items: [{
                            id: "item4",
                            displayOptions: DisplayMode.Overflow,
                            type: RibbonItemType.DropDown,
                            allowedSizes: RibbonItemSize.Medium,
                            dropDownSettings: {
                                content: 'Edit',
                                iconCss: 'e-icons e-edit',
                                items: dropDownButtonItems
                            }
                        },                           
                        {                               
                            id: "item5",
                            displayOptions: DisplayMode.Overflow | DisplayMode.Simplified,
                            type: RibbonItemType.SplitButton,
                            splitButtonSettings: {
                                content: 'Options',
                                iconCss: 'e-icons e-edit',
                                items: dropDownButtonItems
                            }
                        }]
                    }]
                }]
            }]
        }, ribbonEle);
        expect(ribbon.activeLayout).toBe('Classic');
        expect(ribbon.element.querySelectorAll('.e-ribbon-item').length).toBe(1);
        let collection1: HTMLElement = document.querySelector('#collection1');
        expect(collection1.querySelectorAll('.e-ribbon-item').length).toBe(1);
        let collection2: HTMLElement = document.querySelector('#collection2');
        expect(collection2.querySelectorAll('.e-ribbon-item').length).toBe(0);
        (ribbon.element.querySelector('.e-ribbon-collapse-btn') as HTMLElement).click();
        expect(ribbon.element.classList.contains('e-ribbon-minimize')).toBe(false);
        expect(ribbon.activeLayout).toBe('Simplified');
        containerEle.style.width = '450px';
        ribbon.refreshLayout();
        expect(ribbon.element.querySelectorAll('.e-ribbon-item').length).toBe(4);
        expect(collection1.querySelectorAll('.e-ribbon-item').length).toBe(3);
        expect(collection2.querySelectorAll('.e-ribbon-item').length).toBe(1);
        expect(document.body.querySelector('#ribbon_tab_sim_ovrl_overflow-popup').classList.contains('e-popup-close')).toBe(true);
        (ribbon.element.querySelector('.e-ribbon-group-overflow-ddb') as HTMLElement).click();
        expect(document.body.querySelector('#ribbon_tab_sim_ovrl_overflow-popup').classList.contains('e-popup-open')).toBe(true);
        let overflowEle: HTMLElement = document.body.querySelector('.e-ribbon-overflow-target');
        expect(overflowEle.querySelectorAll('.e-ribbon-item').length).toBe(1);
        (ribbon.element.querySelector('.e-ribbon-group-overflow-ddb') as HTMLElement).click();
        containerEle.style.width = '230px';
        ribbon.refreshLayout();
        expect(ribbon.element.querySelectorAll('.e-ribbon-item').length).toBe(2);
        expect(collection1.querySelectorAll('.e-ribbon-item').length).toBe(2);
        expect(collection2.querySelectorAll('.e-ribbon-item').length).toBe(0);
        expect(document.body.querySelector('#ribbon_tab_sim_ovrl_overflow-popup').classList.contains('e-popup-close')).toBe(true);
        (ribbon.element.querySelector('.e-ribbon-group-overflow-ddb') as HTMLElement).click();
        expect(document.body.querySelector('#ribbon_tab_sim_ovrl_overflow-popup').classList.contains('e-popup-open')).toBe(true);
        expect(overflowEle.querySelectorAll('.e-ribbon-item').length).toBe(3);
    });

    it('Classic, Simplified and Overflow Display Options', () => {
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
                            displayOptions: DisplayMode.Classic | DisplayMode.Simplified,
                            type: RibbonItemType.Button,
                            allowedSizes: RibbonItemSize.Medium,
                            buttonSettings: {
                                content: 'button1',
                                iconCss: 'e-icons e-cut',
                            }
                        }, {
                            id: "item2",
                            displayOptions: DisplayMode.Auto,
                            type: RibbonItemType.Button,
                            buttonSettings: {
                                content: 'paste',
                                iconCss: 'e-icons e-paste'
                            }
                        }, {
                            id: "item3",
                            displayOptions: DisplayMode.Overflow,
                            type: RibbonItemType.Button,
                            buttonSettings: {
                                content: 'cut',
                                iconCss: 'e-icons e-cut'
                            }
                        }, {
                            id: "item4",
                            displayOptions: DisplayMode.Simplified,
                            type: RibbonItemType.Button,
                            buttonSettings: {
                                content: 'copy',
                                iconCss: 'e-icons e-copy'
                            }
                        }, {
                            id: "item5",
                            displayOptions: DisplayMode.Simplified | DisplayMode.Overflow,
                            type: RibbonItemType.Button,
                            buttonSettings: {
                                content: 'Format Painter',
                                iconCss: 'e-icons e-paste'
                            }
                        }]
                    }, {
                        id: "collection2",
                        items: [{
                            id: "item6",
                            displayOptions: DisplayMode.Simplified | DisplayMode.Classic,
                            type: RibbonItemType.DropDown,
                            allowedSizes: RibbonItemSize.Medium,
                            dropDownSettings: {
                                content: 'Edit',
                                iconCss: 'e-icons e-edit',
                                items: dropDownButtonItems
                            }
                        },                           
                        {
                            id: "item7",
                            type: RibbonItemType.SplitButton,
                            displayOptions: DisplayMode.Classic,
                            splitButtonSettings: {
                                content: 'Options',
                                iconCss: 'e-icons e-edit',
                                items: dropDownButtonItems
                            }
                        }, {                               
                            id: "item8",
                            type: RibbonItemType.Button,
                            displayOptions: DisplayMode.Classic | DisplayMode.Overflow,
                            buttonSettings: {
                                content: 'copy',
                                iconCss: 'e-icons e-copy'
                            }
                        }]
                    }]
                }]
            }]
        }, ribbonEle);
        expect(ribbon.activeLayout).toBe('Classic');
        expect(ribbon.element.querySelectorAll('.e-ribbon-item').length).toBe(5);
        let collection1: HTMLElement = document.querySelector('#collection1');
        expect(collection1.querySelectorAll('.e-ribbon-item').length).toBe(2);
        let collection2: HTMLElement = document.querySelector('#collection2');
        expect(collection2.querySelectorAll('.e-ribbon-item').length).toBe(3);
        (ribbon.element.querySelector('.e-ribbon-collapse-btn') as HTMLElement).click();
        expect(ribbon.element.classList.contains('e-ribbon-minimize')).toBe(false);
        expect(ribbon.activeLayout).toBe('Simplified');
        expect(ribbon.element.querySelectorAll('.e-ribbon-item').length).toBe(5);
        expect(collection1.querySelectorAll('.e-ribbon-item').length).toBe(4);
        expect(collection2.querySelectorAll('.e-ribbon-item').length).toBe(1);
        expect(document.body.querySelector('#ribbon_tab_sim_ovrl_overflow-popup').classList.contains('e-popup-close')).toBe(true);
        (ribbon.element.querySelector('.e-ribbon-group-overflow-ddb') as HTMLElement).click();
        expect(document.body.querySelector('#ribbon_tab_sim_ovrl_overflow-popup').classList.contains('e-popup-open')).toBe(true);
        let overflowEle: HTMLElement = document.body.querySelector('.e-ribbon-overflow-target');
        expect(overflowEle.querySelectorAll('.e-ribbon-item').length).toBe(2);
        (ribbon.element.querySelector('.e-ribbon-group-overflow-ddb') as HTMLElement).click();
        containerEle.style.width = '300px';
        ribbon.refreshLayout();
        expect(ribbon.element.querySelectorAll('.e-ribbon-item').length).toBe(3);
        expect(collection1.querySelectorAll('.e-ribbon-item').length).toBe(2);
        expect(collection2.querySelectorAll('.e-ribbon-item').length).toBe(1);
        expect(document.body.querySelector('#ribbon_tab_sim_ovrl_overflow-popup').classList.contains('e-popup-close')).toBe(true);
        (ribbon.element.querySelector('.e-ribbon-group-overflow-ddb') as HTMLElement).click();
        expect(document.body.querySelector('#ribbon_tab_sim_ovrl_overflow-popup').classList.contains('e-popup-open')).toBe(true);
        expect(overflowEle.querySelectorAll('.e-ribbon-item').length).toBe(4);
        (ribbon.element.querySelector('.e-ribbon-group-overflow-ddb') as HTMLElement).click();
    });

    it('Classic, Simplified and Overflow Display Options In Simplified Layout', () => {
        ribbon = new Ribbon({
            activeLayout: 'Simplified',
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
                            displayOptions: DisplayMode.Classic | DisplayMode.Simplified,
                            type: RibbonItemType.Button,
                            allowedSizes: RibbonItemSize.Medium,
                            buttonSettings: {
                                content: 'button1',
                                iconCss: 'e-icons e-cut',
                            }
                        }, {
                            id: "item2",
                            displayOptions: DisplayMode.Auto,
                            type: RibbonItemType.Button,
                            buttonSettings: {
                                content: 'paste',
                                iconCss: 'e-icons e-paste'
                            }
                        }, {
                            id: "item3",
                            displayOptions: DisplayMode.Overflow,
                            type: RibbonItemType.Button,
                            buttonSettings: {
                                content: 'cut',
                                iconCss: 'e-icons e-cut'
                            }
                        }, {
                            id: "item4",
                            displayOptions: DisplayMode.Simplified,
                            type: RibbonItemType.Button,
                            buttonSettings: {
                                content: 'copy',
                                iconCss: 'e-icons e-copy'
                            }
                        }, {
                            id: "item5",
                            displayOptions: DisplayMode.Simplified | DisplayMode.Overflow,
                            type: RibbonItemType.Button,
                            buttonSettings: {
                                content: 'Format Painter',
                                iconCss: 'e-icons e-paste'
                            }
                        }]
                    }, {
                        id: "collection2",
                        items: [{
                            id: "item6",
                            displayOptions: DisplayMode.Simplified | DisplayMode.Classic,
                            type: RibbonItemType.DropDown,
                            allowedSizes: RibbonItemSize.Medium,
                            dropDownSettings: {
                                content: 'Edit',
                                iconCss: 'e-icons e-edit',
                                items: dropDownButtonItems
                            }
                        },                           
                        {
                            id: "item7",
                            type: RibbonItemType.SplitButton,
                            displayOptions: DisplayMode.Classic,
                            splitButtonSettings: {
                                content: 'Options',
                                iconCss: 'e-icons e-edit',
                                items: dropDownButtonItems
                            }
                        }, {                               
                            id: "item8",
                            type: RibbonItemType.Button,
                            displayOptions: DisplayMode.Classic | DisplayMode.Overflow,
                            buttonSettings: {
                                content: 'copy',
                                iconCss: 'e-icons e-copy'
                            }
                        }]
                    }]
                }]
            }]
        }, ribbonEle);
        expect(ribbon.activeLayout).toBe('Simplified');
        expect(ribbon.element.querySelectorAll('.e-ribbon-item').length).toBe(5);
        let collection1: HTMLElement = document.querySelector('#collection1');
        expect(collection1.querySelectorAll('.e-ribbon-item').length).toBe(4);
        let collection2: HTMLElement = document.querySelector('#collection2');
        expect(collection2.querySelectorAll('.e-ribbon-item').length).toBe(1);
        expect(document.body.querySelector('#ribbon_tab_sim_ovrl_overflow-popup').classList.contains('e-popup-close')).toBe(true);
        (ribbon.element.querySelector('.e-ribbon-group-overflow-ddb') as HTMLElement).click();
        expect(document.body.querySelector('#ribbon_tab_sim_ovrl_overflow-popup').classList.contains('e-popup-open')).toBe(true);
        let overflowEle: HTMLElement = document.body.querySelector('.e-ribbon-overflow-target');
        expect(overflowEle.querySelectorAll('.e-ribbon-item').length).toBe(2);
        (ribbon.element.querySelector('.e-ribbon-group-overflow-ddb') as HTMLElement).click();
        containerEle.style.width = '250px';
        ribbon.refreshLayout();
        expect(ribbon.element.querySelectorAll('.e-ribbon-item').length).toBe(3);
        expect(collection1.querySelectorAll('.e-ribbon-item').length).toBe(2);
        expect(collection2.querySelectorAll('.e-ribbon-item').length).toBe(1);
        expect(document.body.querySelector('#ribbon_tab_sim_ovrl_overflow-popup').classList.contains('e-popup-close')).toBe(true);
        (ribbon.element.querySelector('.e-ribbon-group-overflow-ddb') as HTMLElement).click();
        expect(document.body.querySelector('#ribbon_tab_sim_ovrl_overflow-popup').classList.contains('e-popup-open')).toBe(true);
        expect(overflowEle.querySelectorAll('.e-ribbon-item').length).toBe(4);
        (ribbon.element.querySelector('.e-ribbon-group-overflow-ddb') as HTMLElement).click();
        (ribbon.element.querySelector('.e-ribbon-collapse-btn') as HTMLElement).click();
        expect(ribbon.activeLayout).toBe('Classic');
        expect(ribbon.element.querySelectorAll('.e-ribbon-item').length).toBe(5);
        containerEle.style.width = '500px';
        ribbon.refreshLayout();
    });
});