/* eslint-disable @typescript-eslint/no-explicit-any */

import { createElement, remove } from "@syncfusion/ej2-base";
import { ItemModel } from "@syncfusion/ej2-splitbuttons";
import { Ribbon, RibbonItemSize, RibbonItemType, ItemOrientation } from "../../src/ribbon/base/index";
import { RibbonContextualTabSettingsModel } from "../../src/ribbon/models/index";
import { RibbonColorPicker, RibbonFileMenu, RibbonContextualTab } from "../../src/index";

Ribbon.Inject(RibbonColorPicker, RibbonFileMenu, RibbonContextualTab);
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
    describe('Ribbon Contextual tab', () => {
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
        let contextTab: RibbonContextualTabSettingsModel = ({
            tabs: [{
                id: 'Text',
                header: 'Text',
                groups: [{
                    header: 'views',
                    groupIconCss: 'e-icons e-print',
                    collections: [{
                        items: [{
                            type: RibbonItemType.Button,
                            allowedSizes: RibbonItemSize.Large,
                            ribbonTooltipSettings: {
                                title: 'Printers',
                                iconCss: 'e-print e-icons',
                                content: 'Read Mode'
                            },
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
                    groupIconCss: 'e-icons e-paste',
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
                    groupIconCss: 'e-icons e-copy',
                    collections: [{
                        items: [{
                            type: RibbonItemType.CheckBox,
                            checkBoxSettings: {
                                label: 'Ruler',
                                checked: false
                            }
                        }, {
                            type: RibbonItemType.CheckBox,
                            checkBoxSettings: {
                                label: 'Gridlines',
                                checked: false
                            }
                        }, {
                            type: RibbonItemType.CheckBox,
                            checkBoxSettings: {
                                label: 'Navigation Pane',
                                checked: true
                            }
                        }]
                    }]
                }]
            },
            {
                header: 'Table Design',
                id: 'Table Design',
                groups: [{
                    header: 'views',
                    groupIconCss: 'e-icons e-print',
                    collections: [{
                        items: [{
                            type: RibbonItemType.Button,
                            allowedSizes: RibbonItemSize.Large,
                            ribbonTooltipSettings: {
                                title: 'Printers',
                                iconCss: 'e-print e-icons',
                                content: 'Read Mode'
                            },
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
                    groupIconCss: 'e-icons e-paste',
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
                    groupIconCss: 'e-icons e-copy',
                    collections: [{
                        items: [{
                            type: RibbonItemType.CheckBox,
                            checkBoxSettings: {
                                label: 'Ruler',
                                checked: false
                            }
                        }, {
                            type: RibbonItemType.CheckBox,
                            checkBoxSettings: {
                                label: 'Gridlines',
                                checked: false
                            }
                        }, {
                            type: RibbonItemType.CheckBox,
                            checkBoxSettings: {
                                label: 'Navigation Pane',
                                checked: true
                            }
                        }]
                    }]
                }]
            }]
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
                                type: RibbonItemType.GroupButton,
                                groupButtonSettings: {
                                    items: [{
                                        iconCss: 'e-icons e-copy',
                                        content: 'copy',
                                        selected: true
                                    },
                                    {
                                        iconCss: 'e-icons e-paste',
                                        content: 'paste',
                                        selected: true
                                    },
                                    {
                                        iconCss: 'e-icons e-cut',
                                        content: 'cut'
                                    }]
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
                }],
                contextualTabs: [contextTab]
            }, ribbonEle);
            expect(ribbon.tabObj.items.length).toBe(3);
            expect(ribbon.tabObj.element.querySelectorAll('.e-toolbar-item')[1].classList.contains('e-ribbon-contextual-tab')).toBe(true);
            expect(ribbon.tabObj.element.querySelectorAll('.e-toolbar-item')[2].classList.contains('e-ribbon-contextual-tab')).toBe(true);
            expect(ribbon.tabObj.element.querySelectorAll('.e-toolbar-item')[1].classList.contains('e-hidden')).toBe(true);
            expect(ribbon.tabObj.element.querySelectorAll('.e-toolbar-item')[2].classList.contains('e-hidden')).toBe(true);
            ribbon.showTab('Text');
            ribbon.showTab('Table Design');
            expect(ribbon.tabObj.element.querySelectorAll('.e-toolbar-item')[1].classList.contains('e-hidden')).toBe(false);
            expect(ribbon.tabObj.element.querySelectorAll('.e-toolbar-item')[2].classList.contains('e-hidden')).toBe(false);
            expect(ribbon.selectedTab).toBe(0);
            ribbon.hideTab('Text');
            ribbon.hideTab('Table Design');
            expect(ribbon.selectedTab).toBe(0);
            ribbon.showTab('Text');
            ribbon.showTab('Table Design');
            (ribbon.tabObj.element.querySelectorAll('.e-toolbar-item')[1] as HTMLElement).click();
            expect(ribbon.selectedTab).toBe(1);
            ribbon.hideTab('Text');
            expect(ribbon.selectedTab).toBe(0);
        });
        let contextTab1: RibbonContextualTabSettingsModel = ({
            visible: true,
            tabs: [{
                id: 'Text',
                header: 'Text',
                groups: [{
                    header: 'views',
                    groupIconCss: 'e-icons e-print',
                    collections: [{
                        items: [{
                            type: RibbonItemType.Button,
                            allowedSizes: RibbonItemSize.Large,
                            ribbonTooltipSettings: {
                                title: 'Printers',
                                iconCss: 'e-print e-icons',
                                content: 'Read Mode'
                            },
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
                    groupIconCss: 'e-icons e-paste',
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
                    groupIconCss: 'e-icons e-copy',
                    collections: [{
                        items: [{
                            type: RibbonItemType.CheckBox,
                            checkBoxSettings: {
                                label: 'Ruler',
                                checked: false
                            }
                        }, {
                            type: RibbonItemType.CheckBox,
                            checkBoxSettings: {
                                label: 'Gridlines',
                                checked: false
                            }
                        }, {
                            type: RibbonItemType.CheckBox,
                            checkBoxSettings: {
                                label: 'Navigation Pane',
                                checked: true
                            }
                        }]
                    }]
                }]
            },
            {
                header: 'Table Design',
                id: 'Table Design',
                groups: [{
                    header: 'views',
                    groupIconCss: 'e-icons e-print',
                    collections: [{
                        items: [{
                            type: RibbonItemType.Button,
                            allowedSizes: RibbonItemSize.Large,
                            ribbonTooltipSettings: {
                                title: 'Printers',
                                iconCss: 'e-print e-icons',
                                content: 'Read Mode'
                            },
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
                    groupIconCss: 'e-icons e-paste',
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
                    groupIconCss: 'e-icons e-copy',
                    collections: [{
                        items: [{
                            type: RibbonItemType.CheckBox,
                            checkBoxSettings: {
                                label: 'Ruler',
                                checked: false
                            }
                        }, {
                            type: RibbonItemType.CheckBox,
                            checkBoxSettings: {
                                label: 'Gridlines',
                                checked: false
                            }
                        }, {
                            type: RibbonItemType.CheckBox,
                            checkBoxSettings: {
                                label: 'Navigation Pane',
                                checked: true
                            }
                        }]
                    }]
                }]
            }]
        });
        it('with visible property true', () => {
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
                                type: RibbonItemType.GroupButton,
                                groupButtonSettings: {
                                    items: [{
                                        iconCss: 'e-icons e-copy',
                                        content: 'copy',
                                        selected: true
                                    },
                                    {
                                        iconCss: 'e-icons e-paste',
                                        content: 'paste',
                                        selected: true
                                    },
                                    {
                                        iconCss: 'e-icons e-cut',
                                        content: 'cut'
                                    }]
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
                }],
                contextualTabs: [contextTab1]
            }, ribbonEle);
            expect(ribbon.tabObj.items.length).toBe(3);
            expect(ribbon.tabObj.element.querySelectorAll('.e-toolbar-item')[1].classList.contains('e-ribbon-contextual-tab')).toBe(true);
            expect(ribbon.tabObj.element.querySelectorAll('.e-toolbar-item')[2].classList.contains('e-ribbon-contextual-tab')).toBe(true);
            expect(ribbon.tabObj.element.querySelectorAll('.e-toolbar-item')[1].classList.contains('e-hidden')).toBe(false);
            expect(ribbon.tabObj.element.querySelectorAll('.e-toolbar-item')[2].classList.contains('e-hidden')).toBe(false);           
            ribbon.hideTab('Text');
            ribbon.hideTab('Table Design');
            expect(ribbon.tabObj.element.querySelectorAll('.e-toolbar-item')[1].classList.contains('e-hidden')).toBe(true);
            expect(ribbon.tabObj.element.querySelectorAll('.e-toolbar-item')[2].classList.contains('e-hidden')).toBe(true);
        });
        let contextTab2: RibbonContextualTabSettingsModel = ({
            visible: true,
            isSelected: true,
            tabs: [{
                id: 'Text',
                header: 'Text',
                groups: [{
                    header: 'views',
                    groupIconCss: 'e-icons e-print',
                    collections: [{
                        items: [{
                            type: RibbonItemType.Button,
                            allowedSizes: RibbonItemSize.Large,
                            ribbonTooltipSettings: {
                                title: 'Printers',
                                iconCss: 'e-print e-icons',
                                content: 'Read Mode'
                            },
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
                    groupIconCss: 'e-icons e-paste',
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
                    groupIconCss: 'e-icons e-copy',
                    collections: [{
                        items: [{
                            type: RibbonItemType.CheckBox,
                            checkBoxSettings: {
                                label: 'Ruler',
                                checked: false
                            }
                        }, {
                            type: RibbonItemType.CheckBox,
                            checkBoxSettings: {
                                label: 'Gridlines',
                                checked: false
                            }
                        }, {
                            type: RibbonItemType.CheckBox,
                            checkBoxSettings: {
                                label: 'Navigation Pane',
                                checked: true
                            }
                        }]
                    }]
                }]
            },
            {
                header: 'Table Design',
                id: 'Table Design',
                groups: [{
                    header: 'views',
                    groupIconCss: 'e-icons e-print',
                    collections: [{
                        items: [{
                            type: RibbonItemType.Button,
                            allowedSizes: RibbonItemSize.Large,
                            ribbonTooltipSettings: {
                                title: 'Printers',
                                iconCss: 'e-print e-icons',
                                content: 'Read Mode'
                            },
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
                    groupIconCss: 'e-icons e-paste',
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
                    groupIconCss: 'e-icons e-copy',
                    collections: [{
                        items: [{
                            type: RibbonItemType.CheckBox,
                            checkBoxSettings: {
                                label: 'Ruler',
                                checked: false
                            }
                        }, {
                            type: RibbonItemType.CheckBox,
                            checkBoxSettings: {
                                label: 'Gridlines',
                                checked: false
                            }
                        }, {
                            type: RibbonItemType.CheckBox,
                            checkBoxSettings: {
                                label: 'Navigation Pane',
                                checked: true
                            }
                        }]
                    }]
                }]
            }]
        });
        it('with isSelected property true', () => {
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
                                type: RibbonItemType.GroupButton,
                                groupButtonSettings: {
                                    items: [{
                                        iconCss: 'e-icons e-copy',
                                        content: 'copy',
                                        selected: true
                                    },
                                    {
                                        iconCss: 'e-icons e-paste',
                                        content: 'paste',
                                        selected: true
                                    },
                                    {
                                        iconCss: 'e-icons e-cut',
                                        content: 'cut'
                                    }]
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
                }],
                contextualTabs: [contextTab2]
            }, ribbonEle);
            expect(ribbon.tabObj.items.length).toBe(3);
            expect(ribbon.tabObj.element.querySelectorAll('.e-toolbar-item')[1].classList.contains('e-active')).toBe(true);
            expect(ribbon.tabObj.element.querySelectorAll('.e-toolbar-item')[0].classList.contains('e-active')).toBe(false);
            (ribbon.tabObj.element.querySelectorAll('.e-toolbar-item')[0] as HTMLElement).click();
            expect(ribbon.tabObj.element.querySelectorAll('.e-toolbar-item')[1].classList.contains('e-active')).toBe(false);
            expect(ribbon.tabObj.element.querySelectorAll('.e-toolbar-item')[0].classList.contains('e-active')).toBe(true);
        });
        it('dynamic property change', () => {
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
                                type: RibbonItemType.GroupButton,
                                groupButtonSettings: {
                                    items: [{
                                        iconCss: 'e-icons e-copy',
                                        content: 'copy',
                                        selected: true
                                    },
                                    {
                                        iconCss: 'e-icons e-paste',
                                        content: 'paste',
                                        selected: true
                                    },
                                    {
                                        iconCss: 'e-icons e-cut',
                                        content: 'cut'
                                    }]
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
                }],
                contextualTabs: [contextTab1]
            }, ribbonEle);
            expect(ribbon.contextualTabs[0].tabs[0].header).toBe('Text');
            ribbon.contextualTabs[0].tabs[0].header = 'Layout';
            ribbon.dataBind();
            expect(ribbon.contextualTabs[0].tabs[0].header).toBe('Layout');
            ribbon.contextualTabs[0].visible = false;
            ribbon.dataBind();
            expect(ribbon.tabObj.element.querySelectorAll('.e-toolbar-item')[1].classList.contains('e-hidden')).toBe(true);
            expect(ribbon.tabObj.element.querySelectorAll('.e-toolbar-item')[2].classList.contains('e-hidden')).toBe(true);
            ribbon.contextualTabs[0].visible = true;
            ribbon.dataBind();
            expect(ribbon.tabObj.element.querySelectorAll('.e-toolbar-item')[1].classList.contains('e-hidden')).toBe(false);
            expect(ribbon.tabObj.element.querySelectorAll('.e-toolbar-item')[2].classList.contains('e-hidden')).toBe(false);
            ribbon.contextualTabs[0].isSelected = true;
            ribbon.dataBind();
            expect(ribbon.tabObj.element.querySelectorAll('.e-toolbar-item')[1].classList.contains('e-active')).toBe(true);
            ribbon.contextualTabs[0].isSelected = false;
            ribbon.dataBind();
            expect(ribbon.tabObj.element.querySelectorAll('.e-toolbar-item')[1].classList.contains('e-active')).toBe(false);
            expect(ribbon.tabObj.element.querySelectorAll('.e-toolbar-item')[0].classList.contains('e-active')).toBe(true);
        });
    });
});
