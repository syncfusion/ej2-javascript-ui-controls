/* eslint-disable @typescript-eslint/no-explicit-any */

import { createElement, remove } from "@syncfusion/ej2-base";
import { ItemModel } from "@syncfusion/ej2-splitbuttons";
import { Ribbon, RibbonItemSize, RibbonItemType, RibbonGroupButtonSelection, ClickGroupButtonEventArgs, BeforeClickGroupButtonEventArgs } from "../../src/ribbon/base/index";
import { RibbonItemModel } from "../../src/ribbon/models/index";
import { RibbonColorPicker, RibbonFileMenu } from "../../src/index";
import { RibbonGroupButton } from "../../src/index";

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
    describe('Ribbon Group button', () => {
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
        it('in classic mode with default selection', () => {
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
                                        selected: true,
                                        htmlAttributes: { 'data-id': 'group_copy', 'class': 'copy_class', 'style': 'color: red' }
                                    },
                                    {
                                        iconCss: 'e-icons e-paste',
                                        content: 'paste',
                                        selected: true,
                                        htmlAttributes: { 'data-id': 'group_paste' }
                                    },
                                    {
                                        iconCss: 'e-icons e-cut',
                                        content: 'cut',
                                        htmlAttributes: { 'data-id': 'group_cut' }
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
                }]
            }, ribbonEle);
            expect(ribbon.element.querySelector('#item1_grpbtn').classList.contains('e-btn-group')).toBe(true);
            expect((ribbon.element.querySelector('#item1_grpbtn').querySelector('.e-ribbon-group-button')) != null).toBe(true);
            expect((ribbon.element.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')).length).toBe(3);
            expect(ribbon.element.querySelector('#item1_grpbtn').classList.contains('e-ribbon-single-selection')).toBe(true);
            expect((ribbon.element.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[0]).classList.contains('e-active')).toBe(true);
            expect((ribbon.element.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[1]).classList.contains('e-active')).toBe(false);
            expect((ribbon.element.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[2]).classList.contains('e-active')).toBe(false);

            const grpBtns: NodeListOf<Element> = ribbon.element.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button');
            expect(grpBtns[0].getAttribute('data-id')).toBe('group_copy');
            expect(grpBtns[0].classList.contains('copy_class')).toBe(true);
            expect((grpBtns[0] as HTMLElement).style.color).toBe('red');
            expect(grpBtns[1].getAttribute('data-id')).toBe('group_paste');
            expect(grpBtns[2].getAttribute('data-id')).toBe('group_cut');
        });
        it('in classic mode with multiple selection', () => {
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
                                    selection: RibbonGroupButtonSelection.Multiple,
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
                }]
            }, ribbonEle);
            expect(ribbon.element.querySelector('#item1_grpbtn').classList.contains('e-btn-group')).toBe(true);
            expect((ribbon.element.querySelector('#item1_grpbtn').querySelector('.e-ribbon-group-button')) != null).toBe(true);
            expect((ribbon.element.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')).length).toBe(3);
            expect(ribbon.element.querySelector('#item1_grpbtn').classList.contains('e-ribbon-multiple-selection')).toBe(true);
            expect((ribbon.element.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[0]).classList.contains('e-active')).toBe(true);
            expect((ribbon.element.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[1]).classList.contains('e-active')).toBe(true);
            expect((ribbon.element.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[2]).classList.contains('e-active')).toBe(false);
        });
        it('items selection in classic mode single selection', () => {
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
                }]
            }, ribbonEle);
            expect(ribbon.element.querySelector('#item1_grpbtn').classList.contains('e-ribbon-single-selection')).toBe(true);
            expect((ribbon.element.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[0]).classList.contains('e-active')).toBe(true);
            expect((ribbon.element.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[1]).classList.contains('e-active')).toBe(false);
            expect((ribbon.element.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[2]).classList.contains('e-active')).toBe(false);
            (ribbon.element.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[1] as HTMLElement).click();
            expect((ribbon.element.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[0]).classList.contains('e-active')).toBe(false);
            expect((ribbon.element.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[1]).classList.contains('e-active')).toBe(true);
            expect((ribbon.element.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[2]).classList.contains('e-active')).toBe(false);
            (ribbon.element.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[2] as HTMLElement).click();
            expect((ribbon.element.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[0]).classList.contains('e-active')).toBe(false);
            expect((ribbon.element.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[1]).classList.contains('e-active')).toBe(false);
            expect((ribbon.element.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[2]).classList.contains('e-active')).toBe(true);
        });
        it('items selection in classic mode multiple selection', () => {
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
                                    selection: RibbonGroupButtonSelection.Multiple,
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
                }]
            }, ribbonEle);
            expect(ribbon.element.querySelector('#item1_grpbtn').classList.contains('e-ribbon-multiple-selection')).toBe(true);
            expect((ribbon.element.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[0]).classList.contains('e-active')).toBe(true);
            expect((ribbon.element.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[1]).classList.contains('e-active')).toBe(true);
            expect((ribbon.element.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[2]).classList.contains('e-active')).toBe(false);
            (ribbon.element.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[1] as HTMLElement).click();
            (ribbon.element.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[2] as HTMLElement).click();
            expect((ribbon.element.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[0]).classList.contains('e-active')).toBe(true);
            expect((ribbon.element.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[1]).classList.contains('e-active')).toBe(false);
            expect((ribbon.element.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[2]).classList.contains('e-active')).toBe(true);
            (ribbon.element.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[2] as HTMLElement).click();
            (ribbon.element.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[0] as HTMLElement).click();
            expect((ribbon.element.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[0]).classList.contains('e-active')).toBe(false);
            expect((ribbon.element.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[1]).classList.contains('e-active')).toBe(false);
            expect((ribbon.element.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[2]).classList.contains('e-active')).toBe(false);
        });
        it('in simplified mode with default selection', () => {
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
                        }]
                    }]
                }]
            }, ribbonEle);
            (ribbon.element.querySelector('.e-ribbon-collapse-btn') as HTMLElement).click();
            expect(document.querySelector('#item1_grpbtn').classList.contains('e-btn-group')).toBe(true);
            expect((document.querySelector('#item1_grpbtn').querySelector('.e-ribbon-group-button')) != null).toBe(true);
            expect((document.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')).length).toBe(3);
            expect(document.querySelector('#item1_grpbtn').classList.contains('e-ribbon-single-selection')).toBe(true);
            expect((document.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[0]).classList.contains('e-active')).toBe(true);
            expect((document.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[1]).classList.contains('e-active')).toBe(false);
            expect((document.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[2]).classList.contains('e-active')).toBe(false);
            expect(ribbon.element.querySelector('#item1').classList.contains('e-dropdown-btn')).toBe(true);
            expect((ribbon.element.querySelector('#item1')as any).ej2_instances[0].iconCss).toBe('e-icons e-copy');
        });
        it('items not selected in simplified mode single selection', () => {
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
                                        content: 'copy'
                                    },
                                    {
                                        iconCss: 'e-icons e-paste',
                                        content: 'paste'
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
                        }]
                    }]
                }]
            }, ribbonEle);
            (ribbon.element.querySelector('.e-ribbon-collapse-btn') as HTMLElement).click();
            (ribbon.element.querySelector('#item1') as HTMLElement).click();
            expect(document.querySelector('#item1_grpbtn').classList.contains('e-ribbon-single-selection')).toBe(true);
            expect((document.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[0]).classList.contains('e-active')).toBe(false);
            expect((document.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[1]).classList.contains('e-active')).toBe(false);
            expect((document.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[2]).classList.contains('e-active')).toBe(false);
            expect(ribbon.element.querySelector('#item1').classList.contains('e-dropdown-btn')).toBe(true);
            expect((ribbon.element.querySelector('#item1')as any).ej2_instances[0].iconCss).toBe('e-icons e-copy');
            (ribbon.element.querySelector('#item1') as HTMLElement).click();
        });
        it('in simplified mode with multiple selection', () => {
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
                                    selection: RibbonGroupButtonSelection.Multiple,
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
                        }]
                    }]
                }]
            }, ribbonEle);
            (ribbon.element.querySelector('.e-ribbon-collapse-btn') as HTMLElement).click();
            expect(ribbon.element.querySelector('#item1').classList.contains('e-dropdown-btn')).toBe(true);
            (ribbon.element.querySelector('#item1') as HTMLElement).click();
            expect(document.querySelector('#item1_grpbtn').classList.contains('e-btn-group')).toBe(true);
            expect((document.querySelector('#item1_grpbtn').querySelector('.e-ribbon-group-button')) != null).toBe(true);
            expect((document.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')).length).toBe(3);
            expect(document.querySelector('#item1_grpbtn').classList.contains('e-ribbon-multiple-selection')).toBe(true);
            expect((document.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[0]).classList.contains('e-active')).toBe(true);
            expect((document.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[1]).classList.contains('e-active')).toBe(true);
            expect((document.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[2]).classList.contains('e-active')).toBe(false);            
            expect((ribbon.element.querySelector('#item1')as any).ej2_instances[0].iconCss).toBe('e-icons e-copy');
            (ribbon.element.querySelector('#item1') as HTMLElement).click();
        });
        it('items selection in simplified mode single selection', () => {
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
                        }]
                    }]
                }]
            }, ribbonEle);
            (ribbon.element.querySelector('.e-ribbon-collapse-btn') as HTMLElement).click();
            (ribbon.element.querySelector('#item1') as HTMLElement).click();
            expect(document.querySelector('#item1_grpbtn').classList.contains('e-ribbon-single-selection')).toBe(true);
            expect((document.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[0]).classList.contains('e-active')).toBe(true);
            expect((document.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[1]).classList.contains('e-active')).toBe(false);
            expect((document.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[2]).classList.contains('e-active')).toBe(false);
            expect(ribbon.element.querySelector('#item1').classList.contains('e-dropdown-btn')).toBe(true);
            expect((ribbon.element.querySelector('#item1')as any).ej2_instances[0].iconCss).toBe('e-icons e-copy');
            (document.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[1] as HTMLElement).click();
            expect((document.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[0]).classList.contains('e-active')).toBe(false);
            expect((document.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[1]).classList.contains('e-active')).toBe(true);
            expect((document.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[2]).classList.contains('e-active')).toBe(false);
            expect((ribbon.element.querySelector('#item1')as any).ej2_instances[0].iconCss).toBe('e-icons e-paste');
            (document.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[2] as HTMLElement).click();
            expect((document.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[0]).classList.contains('e-active')).toBe(false);
            expect((document.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[1]).classList.contains('e-active')).toBe(false);
            expect((document.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[2]).classList.contains('e-active')).toBe(true);
            expect((ribbon.element.querySelector('#item1')as any).ej2_instances[0].iconCss).toBe('e-icons e-cut');
            (ribbon.element.querySelector('#item1') as HTMLElement).click();
        });
        it('items selection in simplified mode multiple selection', () => {
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
                                    selection: RibbonGroupButtonSelection.Multiple,
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
                        }]
                    }]
                }]
            }, ribbonEle);
            (ribbon.element.querySelector('.e-ribbon-collapse-btn') as HTMLElement).click();
            (ribbon.element.querySelector('#item1') as HTMLElement).click();
            expect(document.querySelector('#item1_grpbtn').classList.contains('e-ribbon-multiple-selection')).toBe(true);
            expect((document.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[0]).classList.contains('e-active')).toBe(true);
            expect((document.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[1]).classList.contains('e-active')).toBe(true);
            expect((document.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[2]).classList.contains('e-active')).toBe(false);
            expect(ribbon.element.querySelector('#item1').classList.contains('e-dropdown-btn')).toBe(true);
            expect((ribbon.element.querySelector('#item1')as any).ej2_instances[0].iconCss).toBe('e-icons e-copy');
            (document.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[1] as HTMLElement).click();
            expect((document.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[0]).classList.contains('e-active')).toBe(true);
            expect((document.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[1]).classList.contains('e-active')).toBe(false);
            expect((document.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[2]).classList.contains('e-active')).toBe(false);
            expect((ribbon.element.querySelector('#item1')as any).ej2_instances[0].iconCss).toBe('e-icons e-copy');
            (document.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[2] as HTMLElement).click();
            expect((document.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[0]).classList.contains('e-active')).toBe(true);
            expect((document.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[1]).classList.contains('e-active')).toBe(false);
            expect((document.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[2]).classList.contains('e-active')).toBe(true);
            expect((ribbon.element.querySelector('#item1')as any).ej2_instances[0].iconCss).toBe('e-icons e-copy');
            (document.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[0] as HTMLElement).click();
            expect((document.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[0]).classList.contains('e-active')).toBe(false);
            expect((document.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[1]).classList.contains('e-active')).toBe(false);
            expect((document.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[2]).classList.contains('e-active')).toBe(true);
            expect((ribbon.element.querySelector('#item1')as any).ej2_instances[0].iconCss).toBe('e-icons e-cut');
            (document.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[2] as HTMLElement).click();
            (document.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[1] as HTMLElement).click();
            expect((document.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[0]).classList.contains('e-active')).toBe(false);
            expect((document.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[1]).classList.contains('e-active')).toBe(true);
            expect((document.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[2]).classList.contains('e-active')).toBe(false);
            expect((ribbon.element.querySelector('#item1')as any).ej2_instances[0].iconCss).toBe('e-icons e-paste');
            (ribbon.element.querySelector('#item1') as HTMLElement).click();
        });
        it('when active layout is simplified mode', () => {
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
                                type: RibbonItemType.GroupButton,
                                groupButtonSettings: {
                                    selection: RibbonGroupButtonSelection.Multiple,
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
                                id: "item2",
                                type: RibbonItemType.GroupButton,
                                groupButtonSettings: {
                                    selection: RibbonGroupButtonSelection.Single,
                                    items: [{
                                        iconCss: 'e-icons e-copy',
                                        content: 'copy'
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
                        }]
                    }]
                }]
            }, ribbonEle);
            expect(ribbon.element.querySelector('#item1').classList.contains('e-dropdown-btn')).toBe(true);
            (ribbon.element.querySelector('#item1') as HTMLElement).click();
            expect(document.querySelector('#item1_grpbtn').classList.contains('e-ribbon-multiple-selection')).toBe(true);
            expect((document.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[0]).classList.contains('e-active')).toBe(true);
            expect((document.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[1]).classList.contains('e-active')).toBe(true);
            expect((document.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[2]).classList.contains('e-active')).toBe(false);
            expect(ribbon.element.querySelector('#item1').classList.contains('e-dropdown-btn')).toBe(true);
            expect((ribbon.element.querySelector('#item1')as any).ej2_instances[0].iconCss).toBe('e-icons e-copy');
            (document.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[1] as HTMLElement).click();
            expect((document.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[0]).classList.contains('e-active')).toBe(true);
            expect((document.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[1]).classList.contains('e-active')).toBe(false);
            expect((document.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[2]).classList.contains('e-active')).toBe(false);
            expect((ribbon.element.querySelector('#item1')as any).ej2_instances[0].iconCss).toBe('e-icons e-copy');
            (document.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[2] as HTMLElement).click();
            expect((document.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[0]).classList.contains('e-active')).toBe(true);
            expect((document.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[1]).classList.contains('e-active')).toBe(false);
            expect((document.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[2]).classList.contains('e-active')).toBe(true);
            expect((ribbon.element.querySelector('#item1')as any).ej2_instances[0].iconCss).toBe('e-icons e-copy');
            (ribbon.element.querySelector('#item1') as HTMLElement).click();
            expect(document.querySelector('#item1-popup') !== null).toBe(true);
            expect(ribbon.element.querySelector('#item2').classList.contains('e-dropdown-btn')).toBe(true);
            expect((ribbon.element.querySelector('#item2')as any).ej2_instances[0].iconCss).toBe('e-icons e-paste');
            (ribbon.element.querySelector('.e-ribbon-collapse-btn') as HTMLElement).click();
            expect(document.querySelector('#item1-popup') === null).toBe(true);
            expect((ribbon.element.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[0]).classList.contains('e-active')).toBe(true);
            expect((ribbon.element.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[1]).classList.contains('e-active')).toBe(false);
            expect((ribbon.element.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[2]).classList.contains('e-active')).toBe(true);
        });
        it('when resize the window', () => {
            let collectionItems: RibbonItemModel = ({
                id: "item3",
                type: RibbonItemType.GroupButton,
                allowedSizes: RibbonItemSize.Large,
                groupButtonSettings: {
                    selection: RibbonGroupButtonSelection.Single,
                    items: [{
                        iconCss: 'e-icons e-copy',
                        content: 'copy',
                        selected: true
                    },
                    {
                        iconCss: 'e-icons e-paste',
                        content: 'paste'
                    },
                    {
                        iconCss: 'e-icons e-cut',
                        content: 'cut'
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
                        collections: [{
                            id: "collection1",
                            items: [{
                                id: "item1",
                                type: RibbonItemType.GroupButton,
                                allowedSizes: RibbonItemSize.Large | RibbonItemSize.Medium | RibbonItemSize.Small,
                                groupButtonSettings: {
                                    selection: RibbonGroupButtonSelection.Multiple,
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
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Large | RibbonItemSize.Medium | RibbonItemSize.Small,
                                buttonSettings: {
                                    iconCss: 'e-print e-icons',
                                    content: 'Web Layout'
                                }
                            }]
                        }, {
                            id: "collection3",
                            items: [{
                                type: RibbonItemType.Button,
                                allowedSizes: RibbonItemSize.Large | RibbonItemSize.Medium | RibbonItemSize.Small,
                                buttonSettings: {
                                    iconCss: 'e-print e-icons',
                                    content: 'Web'
                                }
                            }]
                        }]
                    },
                    {
                        id: "group2",
                        header: "group1Header",
                        orientation: 'Row',
                        collections: [{
                            id: "collection4",
                            items: [{
                                id: "item2",
                                type: RibbonItemType.GroupButton,
                                allowedSizes: RibbonItemSize.Small,
                                groupButtonSettings: {
                                    selection: RibbonGroupButtonSelection.Multiple,
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
                            id: "collection5",
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
                            id: "collection6",
                            items: [{
                                type: RibbonItemType.DropDown,
                                allowedSizes: RibbonItemSize.Medium,
                                dropDownSettings: {
                                    content: 'Edit1',
                                    iconCss: 'e-icons e-edit',
                                    items: dropDownButtonItems
                                }
                            }]
                        }]
                    },
                    {
                        id: "group3",
                        header: "group3Header",
                        orientation: 'Row',
                        collections: [{
                            id: "collection7",
                            items: [collectionItems]
                        }]
                    }]
                }]
            }, ribbonEle);                        
            expect(ribbon.element.querySelector('#item1_grpbtn').classList.contains('e-ribbon-multiple-selection')).toBe(true);
            expect(ribbon.element.querySelector('#item2_grpbtn').classList.contains('e-ribbon-multiple-selection')).toBe(true);
            expect(ribbon.element.querySelector('#item3_grpbtn').classList.contains('e-ribbon-single-selection')).toBe(true);            
            expect((ribbon.element.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[0] as HTMLElement).innerText).toBe('copy');
            expect((ribbon.element.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[1] as HTMLElement).innerText).toBe('paste');
            expect((ribbon.element.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[2] as HTMLElement).innerText).toBe('cut');
            expect((ribbon.element.querySelector('#item2_grpbtn').querySelectorAll('.e-ribbon-group-button')[0] as HTMLElement).innerText).toBe('');
            expect((ribbon.element.querySelector('#item2_grpbtn').querySelectorAll('.e-ribbon-group-button')[1] as HTMLElement).innerText).toBe('');
            expect((ribbon.element.querySelector('#item2_grpbtn').querySelectorAll('.e-ribbon-group-button')[2] as HTMLElement).innerText).toBe('');
            expect((ribbon.element.querySelector('#item3_grpbtn').querySelectorAll('.e-ribbon-group-button')[0] as HTMLElement).innerText).toBe('copy');
            expect((ribbon.element.querySelector('#item3_grpbtn').querySelectorAll('.e-ribbon-group-button')[1] as HTMLElement).innerText).toBe('paste');
            expect((ribbon.element.querySelector('#item3_grpbtn').querySelectorAll('.e-ribbon-group-button')[2] as HTMLElement).innerText).toBe('cut');
            expect((ribbon.element.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[0] as any).ej2_instances[0].iconCss).toBe('e-icons e-copy');
            expect((ribbon.element.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[1] as any).ej2_instances[0].iconCss).toBe('e-icons e-paste');
            expect((ribbon.element.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[2] as any).ej2_instances[0].iconCss).toBe('e-icons e-cut');
            containerEle.style.width = '550px';
            ribbon.refreshLayout();
            containerEle.style.width = '400px';
            ribbon.refreshLayout();
            expect((ribbon.element.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[0] as HTMLElement).innerText).toBe('');
            expect((ribbon.element.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[1] as HTMLElement).innerText).toBe('');
            expect((ribbon.element.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[2] as HTMLElement).innerText).toBe('');
            (ribbon.element.querySelector('.e-ribbon-collapse-btn') as HTMLElement).click();
            (ribbon.element.querySelector('#ribbon_tab_sim_ovrl_overflow') as HTMLElement).click();
            expect(document.querySelector('#item3').classList.contains('e-ribbon-group-button-overflow-popup')).toBe(true);
            (document.querySelector('#item3') as HTMLElement).click();
            expect(document.querySelector('#item3').classList.contains('e-ribbon-dropdown-group-button')).toBe(true);
            expect(document.querySelector('#item3-popup').classList.contains('e-ribbon-group-button-overflow-popup')).toBe(true);
            expect(document.querySelector('#item3').classList.contains('e-active')).toBe(true);
            (document.querySelector('#item3_grpbtn1') as HTMLElement).click();
            expect(document.querySelector('#item3').classList.contains('e-active')).toBe(false);
            containerEle.style.width = '800px';
            ribbon.refreshLayout();
            expect(ribbon.element.querySelector('#item3').classList.contains('e-ribbon-group-button-overflow-popup')).toBe(false);
            expect(ribbon.element.querySelector('#item3').classList.contains('e-ribbon-dropdown-group-button')).toBe(true);
            containerEle.style.width = '400px';
            ribbon.refreshLayout();
            (ribbon.element.querySelector('#ribbon_tab_sim_ovrl_overflow') as HTMLElement).click();
            (document.querySelector('#item3') as HTMLElement).click();
            keyboardEventArgs.target = document.activeElement;
            keyboardEventArgs.key = 'ArrowDown';
            (ribbon.ribbonGroupButtonModule as any).handleGroupButtonNavigation(keyboardEventArgs, collectionItems);
            (document.activeElement as HTMLElement).click();
            expect(document.querySelector('#item3-popup').querySelectorAll('.e-ribbon-group-button')[0].classList.contains('e-active')).toBe(false);
            expect(document.querySelector('#item3-popup').querySelectorAll('.e-ribbon-group-button')[1].classList.contains('e-active')).toBe(true);
            expect(document.querySelector('#item3-popup').querySelectorAll('.e-ribbon-group-button')[2].classList.contains('e-active')).toBe(false);
            (document.querySelector('#item3') as HTMLElement).click();
            (document.activeElement as HTMLElement).click();
            keyboardEventArgs.target = document.activeElement;
            keyboardEventArgs.key = 'ArrowUp';
            (ribbon.ribbonGroupButtonModule as any).handleGroupButtonNavigation(keyboardEventArgs, collectionItems);
            expect(document.querySelector('#item3-popup').querySelectorAll('.e-ribbon-group-button')[0].classList.contains('e-active')).toBe(true);
            expect(document.querySelector('#item3-popup').querySelectorAll('.e-ribbon-group-button')[1].classList.contains('e-active')).toBe(false);
            expect(document.querySelector('#item3-popup').querySelectorAll('.e-ribbon-group-button')[2].classList.contains('e-active')).toBe(false);
        });
        it('tooltip', (done) => {
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
                                    selection: RibbonGroupButtonSelection.Multiple,
                                    items: [{
                                        iconCss: 'e-icons e-copy',
                                        content: 'copy',
                                        ribbonTooltipSettings: {
                                            title: 'Copy',
                                            iconCss: 'e-icons e-copy',
                                            content: 'Copy of items'
                                        }
                                    },
                                    {
                                        iconCss: 'e-icons e-paste',
                                        content: 'paste',
                                        selected: true,
                                        ribbonTooltipSettings: {
                                            title: 'Paste',
                                            iconCss: 'e-icons e-paste',
                                            content: 'Paste the items here'
                                        }
                                    },
                                    {
                                        iconCss: 'e-icons e-cut',
                                        content: 'cut',
                                        ribbonTooltipSettings: {
                                            title: 'Cut',
                                            iconCss: 'e-icons e-cut',
                                            content: 'Cut the items'
                                        }
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
                        }]
                    }]
                }]
            }, ribbonEle);
            expect((ribbon.element.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[0]).classList.contains('e-ribbon-tooltip-target')).toBe(true);
            expect((ribbon.element.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[1]).classList.contains('e-ribbon-tooltip-target')).toBe(true);
            expect((ribbon.element.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[2]).classList.contains('e-ribbon-tooltip-target')).toBe(true);
            let tooltipElement: HTMLElement = ribbon.element.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[1] as HTMLElement;
            setTimeout(() => {
                triggerMouseEvent(tooltipElement, 'mouseover');
                setTimeout(() => {
                    expect(document.querySelector('.e-ribbon-tooltip-title').innerHTML === 'Paste').toBe(true);
                    expect(document.querySelector('.e-ribbon-tooltip-icon').classList.contains('e-paste')).toBe(true);
                    expect(document.querySelector('.e-ribbon-tooltip-content').innerHTML === 'Paste the items here').toBe(true);
                    done();
                }, 450);
            }, 450);
            triggerMouseEvent(tooltipElement, 'mouseleave');
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
                                        content: 'paste'
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
                        }]
                    }]
                }]
            }, ribbonEle);
            expect(document.querySelector('#item1_grpbtn').classList.contains('e-ribbon-single-selection')).toBe(true);
            expect((document.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[0]).classList.contains('e-active')).toBe(true);
            expect((document.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[1]).classList.contains('e-active')).toBe(false);
            expect((document.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[2]).classList.contains('e-active')).toBe(false);            
            ribbon.tabs[0].groups[0].collections[0].items[0].groupButtonSettings.selection = RibbonGroupButtonSelection.Multiple;            
            (document.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[1] as HTMLElement).click();
            expect(document.querySelector('#item1_grpbtn').classList.contains('e-ribbon-multiple-selection')).toBe(true);
            expect((document.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[0]).classList.contains('e-active')).toBe(true);
            expect((document.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[1]).classList.contains('e-active')).toBe(true);
            expect((document.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[2]).classList.contains('e-active')).toBe(false);
            ribbon.tabs[0].groups[0].collections[0].items[0].groupButtonSettings.selection = RibbonGroupButtonSelection.Single;
            (document.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[2] as HTMLElement).click();
            expect(document.querySelector('#item1_grpbtn').classList.contains('e-ribbon-single-selection')).toBe(true);
            expect((document.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[0]).classList.contains('e-active')).toBe(false);
            expect((document.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[1]).classList.contains('e-active')).toBe(false);
            expect((document.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[2]).classList.contains('e-active')).toBe(true);
            let item: RibbonItemModel = {
                type: RibbonItemType.GroupButton,
                allowedSizes: RibbonItemSize.Small,
                id: 'newItem',
                groupButtonSettings: {
                    selection: RibbonGroupButtonSelection.Multiple,
                    items: [{
                        iconCss: 'e-icons e-copy',
                        content: 'copy',
                        ribbonTooltipSettings: {
                            title: 'Copy',
                            iconCss: 'e-icons e-copy',
                            content: 'Copy of items'
                        }
                    },
                    {
                        iconCss: 'e-icons e-paste',
                        content: 'paste',
                        selected: true,
                        ribbonTooltipSettings: {
                            title: 'Paste',
                            iconCss: 'e-icons e-paste',
                            content: 'Paste of items'
                        }
                    },
                    {
                        iconCss: 'e-icons e-cut',
                        content: 'cut',
                        ribbonTooltipSettings: {
                            title: 'Cut',
                            iconCss: 'e-icons e-cut',
                            content: 'Cut of items'
                        }
                    }]
                }
            }
            expect(ribbon.tabs[0].groups[0].collections[0].items.length).toBe(1);
            ribbon.addItem('collection1', item);
            expect(ribbon.tabs[0].groups[0].collections[0].items.length).toBe(2);
            expect((document.querySelector('#newItem_grpbtn').querySelectorAll('.e-ribbon-group-button')[0]).classList.contains('e-active')).toBe(false);
            expect((document.querySelector('#newItem_grpbtn').querySelectorAll('.e-ribbon-group-button')[1]).classList.contains('e-active')).toBe(true);
            expect((document.querySelector('#newItem_grpbtn').querySelectorAll('.e-ribbon-group-button')[2]).classList.contains('e-active')).toBe(false);
            ribbon.removeItem('newItem');
            expect(ribbon.tabs[0].groups[0].collections[0].items.length).toBe(1);
        });
        it('events', () => {
            let beforeClick: boolean = false;
            let click: boolean = false;
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
                                        selected: true,
                                        beforeClick: (args: BeforeClickGroupButtonEventArgs) => {
                                            beforeClick = true;
                                        }
                                    },
                                    {
                                        iconCss: 'e-icons e-paste',
                                        content: 'paste',
                                        selected: true,
                                        click: (args: ClickGroupButtonEventArgs) => {
                                            click = true;
                                        }
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
                        }]
                    }]
                }]
            }, ribbonEle);
            expect(beforeClick).toBe(false);
            expect(click).toBe(false);
            (ribbon.element.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[0] as HTMLElement).click();
            expect(beforeClick).toBe(true);
            expect(click).toBe(false);
            (ribbon.element.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[1] as HTMLElement).click();
            expect(beforeClick).toBe(true);
            expect(click).toBe(true);
        });
        it('cancel the event', () => {
            let beforeClick: boolean = false;
            let click: boolean = false;
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
                                        beforeClick: (args: BeforeClickGroupButtonEventArgs) => {
                                            args.cancel = true;
                                        }
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
                        }]
                    }]
                }]
            }, ribbonEle);
            expect((document.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[0]).classList.contains('e-active')).toBe(false);
            expect((document.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[1]).classList.contains('e-active')).toBe(true);
            expect((document.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[2]).classList.contains('e-active')).toBe(false);
            (ribbon.element.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[0] as HTMLElement).click();
            expect((document.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[0]).classList.contains('e-active')).toBe(false);
            expect((document.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[1]).classList.contains('e-active')).toBe(true);
            expect((document.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[2]).classList.contains('e-active')).toBe(false);
        });
        it('enable and disable', () => {
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
                        }]
                    }]
                }]
            }, ribbonEle);
            expect(ribbon.element.querySelector('#item1_container').classList.contains('e-disabled')).toBe(false);
            expect(ribbon.element.querySelector('#item1_grpbtn0').hasAttribute('disabled')).toBe(false);
            expect(ribbon.element.querySelector('#item1_grpbtn1').hasAttribute('disabled')).toBe(false);
            expect(ribbon.element.querySelector('#item1_grpbtn2').hasAttribute('disabled')).toBe(false);
            ribbon.disableItem('item1');
            expect(ribbon.element.querySelector('#item1_container').classList.contains('e-disabled')).toBe(true);
            expect(ribbon.element.querySelector('#item1_grpbtn0').hasAttribute('disabled')).toBe(true);
            expect(ribbon.element.querySelector('#item1_grpbtn1').hasAttribute('disabled')).toBe(true);
            expect(ribbon.element.querySelector('#item1_grpbtn2').hasAttribute('disabled')).toBe(true);
            ribbon.enableItem('item1');
            expect(ribbon.element.querySelector('#item1_container').classList.contains('e-disabled')).toBe(false);            
            expect(ribbon.element.querySelector('#item1_grpbtn0').hasAttribute('disabled')).toBe(false);
            expect(ribbon.element.querySelector('#item1_grpbtn1').hasAttribute('disabled')).toBe(false);
            expect(ribbon.element.querySelector('#item1_grpbtn2').hasAttribute('disabled')).toBe(false);
            (ribbon.element.querySelector('.e-ribbon-collapse-btn') as HTMLElement).click();
            ribbon.disableItem('item1');
            expect(ribbon.element.querySelector('#item1_container').classList.contains('e-disabled')).toBe(true);
            expect(document.querySelector('#item1_grpbtn0').hasAttribute('disabled')).toBe(true);
            expect(document.querySelector('#item1_grpbtn1').hasAttribute('disabled')).toBe(true);
            expect(document.querySelector('#item1_grpbtn2').hasAttribute('disabled')).toBe(true);
            ribbon.enableItem('item1');
            expect(ribbon.element.querySelector('#item1_container').classList.contains('e-disabled')).toBe(false);
            expect(document.querySelector('#item1_grpbtn0').hasAttribute('disabled')).toBe(false);
            expect(document.querySelector('#item1_grpbtn1').hasAttribute('disabled')).toBe(false);
            expect(document.querySelector('#item1_grpbtn2').hasAttribute('disabled')).toBe(false);
        });
        it('enable rtl dynamically', () => {
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
                        }]
                    }]
                }]
            }, ribbonEle);
            expect(ribbon.element.querySelector('#item1_grpbtn0').classList.contains('e-rtl')).toBe(false);
            expect(ribbon.element.querySelector('#item1_grpbtn1').classList.contains('e-rtl')).toBe(false);
            expect(ribbon.element.querySelector('#item1_grpbtn2').classList.contains('e-rtl')).toBe(false);
            ribbon.enableRtl = true;
            ribbon.dataBind();
            expect(ribbon.element.querySelector('#item1_grpbtn0').classList.contains('e-rtl')).toBe(true);
            expect(ribbon.element.querySelector('#item1_grpbtn1').classList.contains('e-rtl')).toBe(true);
            expect(ribbon.element.querySelector('#item1_grpbtn2').classList.contains('e-rtl')).toBe(true);
            ribbon.enableRtl = false;
            ribbon.dataBind();
            expect(ribbon.element.querySelector('#item1_grpbtn0').classList.contains('e-rtl')).toBe(false);
            expect(ribbon.element.querySelector('#item1_grpbtn1').classList.contains('e-rtl')).toBe(false);
            expect(ribbon.element.querySelector('#item1_grpbtn2').classList.contains('e-rtl')).toBe(false);
            (ribbon.element.querySelector('.e-ribbon-collapse-btn') as HTMLElement).click();
            ribbon.enableRtl = true;
            ribbon.dataBind();
            expect(ribbon.element.querySelector('#item1').classList.contains('e-rtl')).toBe(true);
            expect(document.querySelector('#item1_grpbtn0').classList.contains('e-rtl')).toBe(true);
            expect(document.querySelector('#item1_grpbtn1').classList.contains('e-rtl')).toBe(true);
            expect(document.querySelector('#item1_grpbtn2').classList.contains('e-rtl')).toBe(true);
            ribbon.enableRtl = false;
            ribbon.dataBind();
            expect(ribbon.element.querySelector('#item1').classList.contains('e-rtl')).toBe(false);
            expect(document.querySelector('#item1_grpbtn0').classList.contains('e-rtl')).toBe(false);
            expect(document.querySelector('#item1_grpbtn1').classList.contains('e-rtl')).toBe(false);
            expect(document.querySelector('#item1_grpbtn2').classList.contains('e-rtl')).toBe(false);
        });
        it('keyboard navigation when switch layout from classic to simplified', () => {
            let collectionItems: RibbonItemModel = ({
                id: "item1",
                type: RibbonItemType.GroupButton,
                groupButtonSettings: {
                    selection: RibbonGroupButtonSelection.Single,
                    items: [{
                        iconCss: 'e-icons e-copy',
                        content: 'copy'
                    },
                    {
                        iconCss: 'e-icons e-paste',
                        content: 'paste'
                    },
                    {
                        iconCss: 'e-icons e-cut',
                        content: 'cut',
                        selected: true
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
                        }]
                    }]
                }]
            }, ribbonEle);
            (ribbon.element.querySelector('.e-ribbon-collapse-btn') as HTMLElement).click();
            expect((document.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[0]).classList.contains('e-active')).toBe(false);
            expect((document.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[1]).classList.contains('e-active')).toBe(false);
            expect((document.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[2]).classList.contains('e-active')).toBe(true);
            (ribbon.element.querySelector('#item1') as HTMLElement).click();
            keyboardEventArgs.target = document.activeElement;
            keyboardEventArgs.key = 'ArrowRight';
            (ribbon.ribbonGroupButtonModule as any).handleGroupButtonNavigation(keyboardEventArgs, collectionItems);
            (document.activeElement as HTMLElement).click();
            keyboardEventArgs.key = 'Tab';
            (ribbon.ribbonGroupButtonModule as any).handleGroupButtonNavigation(keyboardEventArgs, collectionItems);
            expect((document.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[0]).classList.contains('e-active')).toBe(false);
            expect((document.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[1]).classList.contains('e-active')).toBe(true);
            expect((document.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[2]).classList.contains('e-active')).toBe(false);
            keyboardEventArgs.target = document.activeElement;
            keyboardEventArgs.key = 'ArrowLeft';            
            (ribbon.ribbonGroupButtonModule as any).handleGroupButtonNavigation(keyboardEventArgs, collectionItems);            
            (document.querySelector('#item1_grpbtn') as HTMLElement).dispatchEvent((new KeyboardEvent('keydown',{'key':'Enter'})));
            (document.activeElement as HTMLElement).click();
            expect((document.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[0]).classList.contains('e-active')).toBe(true);
            expect((document.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[1]).classList.contains('e-active')).toBe(false);
            expect((document.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[2]).classList.contains('e-active')).toBe(false);
            keyboardEventArgs.key = 'ArrowLeft';
            (ribbon.ribbonGroupButtonModule as any).handleGroupButtonNavigation(keyboardEventArgs, collectionItems);
            (document.activeElement as HTMLElement).click();
            expect((document.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[0]).classList.contains('e-active')).toBe(false);
            expect((document.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[1]).classList.contains('e-active')).toBe(false);
            expect((document.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[2]).classList.contains('e-active')).toBe(true);
            keyboardEventArgs.key = 'ArrowRight';
            (ribbon.ribbonGroupButtonModule as any).handleGroupButtonNavigation(keyboardEventArgs, collectionItems);
            (document.activeElement as HTMLElement).click();
            expect((document.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[0]).classList.contains('e-active')).toBe(true);
            expect((document.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[1]).classList.contains('e-active')).toBe(false);
            expect((document.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[2]).classList.contains('e-active')).toBe(false);
            (ribbon.element.querySelector('#item1') as HTMLElement).click();            
        });
        it('keyboard navigation when active layout is simplified', () => {
            let collectionItems: RibbonItemModel = ({
                id: "item1",
                type: RibbonItemType.GroupButton,
                groupButtonSettings: {
                    selection: RibbonGroupButtonSelection.Single,
                    items: [{
                        iconCss: 'e-icons e-copy',
                        content: 'copy'
                    },
                    {
                        iconCss: 'e-icons e-paste',
                        content: 'paste'
                    },
                    {
                        iconCss: 'e-icons e-cut',
                        content: 'cut',
                        selected: true
                    }]
                }
            });
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
                            items: [collectionItems]
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
                        }]
                    }]
                }]
            }, ribbonEle);
            expect((document.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[0]).classList.contains('e-active')).toBe(false);
            expect((document.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[1]).classList.contains('e-active')).toBe(false);
            expect((document.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[2]).classList.contains('e-active')).toBe(true);
            (ribbon.element.querySelector('#item1') as HTMLElement).click();
            keyboardEventArgs.target = document.activeElement;
            keyboardEventArgs.key = 'ArrowRight';            
            (ribbon.ribbonGroupButtonModule as any).handleGroupButtonNavigation(keyboardEventArgs, collectionItems);
            (document.querySelector('#item1_grpbtn') as HTMLElement).dispatchEvent((new KeyboardEvent('keydown',{'key':'Enter'})));
            (document.activeElement as HTMLElement).click();            
            expect((document.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[0]).classList.contains('e-active')).toBe(false);
            expect((document.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[1]).classList.contains('e-active')).toBe(true);
            expect((document.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[2]).classList.contains('e-active')).toBe(false);
            keyboardEventArgs.target = document.activeElement;
            keyboardEventArgs.key = 'ArrowLeft';
            (ribbon.ribbonGroupButtonModule as any).handleGroupButtonNavigation(keyboardEventArgs, collectionItems);
            (document.activeElement as HTMLElement).click();
            expect((document.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[0]).classList.contains('e-active')).toBe(true);
            expect((document.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[1]).classList.contains('e-active')).toBe(false);
            expect((document.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[2]).classList.contains('e-active')).toBe(false);
            (ribbon.element.querySelector('#item1') as HTMLElement).click();
        });
        it('Rtl keyboard navigation when switch layout from classic to simplified', () => {
            let collectionItems: RibbonItemModel = ({
                id: "item1",
                type: RibbonItemType.GroupButton,
                groupButtonSettings: {
                    selection: RibbonGroupButtonSelection.Single,
                    items: [{
                        iconCss: 'e-icons e-copy',
                        content: 'copy'
                    },
                    {
                        iconCss: 'e-icons e-paste',
                        content: 'paste'
                    },
                    {
                        iconCss: 'e-icons e-cut',
                        content: 'cut',
                        selected: true
                    }]
                }
            });
            ribbon = new Ribbon({
                enableRtl: true,
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
                        }]
                    }]
                }]
            }, ribbonEle);
            (ribbon.element.querySelector('.e-ribbon-collapse-btn') as HTMLElement).click();
            expect((document.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[0]).classList.contains('e-active')).toBe(false);
            expect((document.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[1]).classList.contains('e-active')).toBe(false);
            expect((document.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[2]).classList.contains('e-active')).toBe(true);
            (ribbon.element.querySelector('#item1') as HTMLElement).click();
            keyboardEventArgs.target = document.activeElement;
            keyboardEventArgs.key = 'ArrowLeft';
            (ribbon.ribbonGroupButtonModule as any).handleGroupButtonNavigation(keyboardEventArgs, collectionItems);
            (document.activeElement as HTMLElement).click();            
            expect((document.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[0]).classList.contains('e-active')).toBe(false);
            expect((document.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[1]).classList.contains('e-active')).toBe(true);
            expect((document.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[2]).classList.contains('e-active')).toBe(false);
            keyboardEventArgs.target = document.activeElement;
            keyboardEventArgs.key = 'ArrowRight';
            (ribbon.ribbonGroupButtonModule as any).handleGroupButtonNavigation(keyboardEventArgs, collectionItems);
            (document.activeElement as HTMLElement).click();
            expect((document.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[0]).classList.contains('e-active')).toBe(true);
            expect((document.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[1]).classList.contains('e-active')).toBe(false);
            expect((document.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[2]).classList.contains('e-active')).toBe(false);
            keyboardEventArgs.key = 'ArrowRight';
            (ribbon.ribbonGroupButtonModule as any).handleGroupButtonNavigation(keyboardEventArgs, collectionItems);
            (document.activeElement as HTMLElement).click();
            expect((document.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[0]).classList.contains('e-active')).toBe(false);
            expect((document.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[1]).classList.contains('e-active')).toBe(false);
            expect((document.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[2]).classList.contains('e-active')).toBe(true);
            keyboardEventArgs.key = 'ArrowLeft';
            (ribbon.ribbonGroupButtonModule as any).handleGroupButtonNavigation(keyboardEventArgs, collectionItems);
            (document.activeElement as HTMLElement).click();
            expect((document.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[0]).classList.contains('e-active')).toBe(true);
            expect((document.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[1]).classList.contains('e-active')).toBe(false);
            expect((document.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[2]).classList.contains('e-active')).toBe(false);
            (ribbon.element.querySelector('#item1') as HTMLElement).click();
        });
        it('Rtl keyboard navigation when active layout is simplified', () => {
            let collectionItems: RibbonItemModel = ({
                id: "item1",
                type: RibbonItemType.GroupButton,
                groupButtonSettings: {
                    selection: RibbonGroupButtonSelection.Single,
                    items: [{
                        iconCss: 'e-icons e-copy',
                        content: 'copy'
                    },
                    {
                        iconCss: 'e-icons e-paste',
                        content: 'paste'
                    },
                    {
                        iconCss: 'e-icons e-cut',
                        content: 'cut',
                        selected: true
                    }]
                }
            });
            ribbon = new Ribbon({
                enableRtl: true,
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
                            items: [collectionItems]
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
                        }]
                    }]
                }]
            }, ribbonEle);
            expect((document.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[0]).classList.contains('e-active')).toBe(false);
            expect((document.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[1]).classList.contains('e-active')).toBe(false);
            expect((document.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[2]).classList.contains('e-active')).toBe(true);
            (ribbon.element.querySelector('#item1') as HTMLElement).click();
            keyboardEventArgs.target = document.activeElement;
            keyboardEventArgs.key = 'ArrowLeft';
            (ribbon.ribbonGroupButtonModule as any).handleGroupButtonNavigation(keyboardEventArgs, collectionItems);
            (document.activeElement as HTMLElement).click();            
            expect((document.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[0]).classList.contains('e-active')).toBe(false);
            expect((document.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[1]).classList.contains('e-active')).toBe(true);
            expect((document.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[2]).classList.contains('e-active')).toBe(false);
            keyboardEventArgs.target = document.activeElement;
            keyboardEventArgs.key = 'ArrowRight';
            (ribbon.ribbonGroupButtonModule as any).handleGroupButtonNavigation(keyboardEventArgs, collectionItems);
            (document.activeElement as HTMLElement).click();
            expect((document.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[0]).classList.contains('e-active')).toBe(true);
            expect((document.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[1]).classList.contains('e-active')).toBe(false);
            expect((document.querySelector('#item1_grpbtn').querySelectorAll('.e-ribbon-group-button')[2]).classList.contains('e-active')).toBe(false);
            (ribbon.element.querySelector('#item1') as HTMLElement).click();
        });
    });
});
