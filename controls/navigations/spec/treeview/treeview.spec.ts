/**
 * TreeView spec document
 */

import { createElement, Browser } from '@syncfusion/ej2-base';
import { EventHandler, EmitType } from '@syncfusion/ej2-base';
import { isNullOrUndefined, enableRipple  } from '@syncfusion/ej2-base';
import { TreeView, DragAndDropEventArgs, NodeEditEventArgs, NodeCheckEventArgs, NodeExpandEventArgs,  NodeSelectEventArgs } from "../../src/treeview/treeview";
import { DataManager, Query,ODataV4Adaptor } from '@syncfusion/ej2-data';
import { hierarchicalData, hierarchicalData1, hierarchicalData2, hierarchicalData3, localData, localData1, localData2, localData3, remoteData, remoteData1, remoteData2, remoteData2_1, remoteData1_1, hierarchicalData4, localData4, localData5, localData6, hierarchicalData5, expandIconParentData, expandIconChildData, remoteData2_2, remoteData2_3 , remoteData3_1, hierarchicalData6, localData7, localData8, localData9, checkData, XSSData, XSSnestedData, checkboxData, updatedremoteNode_1, updatedremoteNode_2, updatedremoteNode_3, updatedremoteNode_4, updatedremoteNode_5, updatedAddNodes, updatedremoteNode_6, updatedremoteNode_7, deletedRemoteData, updatedAddNodes1} from '../../spec/treeview/datasource.spec';
import '../../node_modules/es6-promise/dist/es6-promise';
import  {profile , inMB, getMemoryProfile} from '../common.spec';
import { enableBlazorMode, disableBlazorMode } from '@syncfusion/ej2-base';


function copyObject(source: any, destiation: any): Object {
    for (let prop in source) {
        destiation[prop] = source[prop];
    }
    return destiation;
}

function getEventObject(eventType: string, eventName: string, currentTarget?: Element, target?: Element, x?: number, y?: number, offsetY?: number,offsetX?: number): Object {
    let tempEvent: any = document.createEvent(eventType);
    tempEvent.initEvent(eventName, true, true);
    let returnObject: any = copyObject(tempEvent, {});
    returnObject.preventDefault = () => { return true; };

    if (!isNullOrUndefined(x)) {
        returnObject.pageX = x;
        returnObject.clientX = x;
    }
    if (!isNullOrUndefined(y)) {
        returnObject.pageY = y;
        returnObject.clientY = y;
    }
    if (!isNullOrUndefined(currentTarget)) {
        returnObject.currentTarget = currentTarget;
    }
    if (!isNullOrUndefined(target)) {
        returnObject.target = returnObject.srcElement = returnObject.toElement = target;
        if (!isNullOrUndefined(offsetY)) {
            returnObject.offsetY = offsetY;
        } else {
            returnObject.offsetY = 7;
        }
        if (!isNullOrUndefined(offsetX)) {
            returnObject.offsetX = offsetX;
        }
    }

    return returnObject;
}

function setMouseCordinates(eventarg: any, x: number, y: number): Object {
    eventarg.pageX = x;
    eventarg.pageY = y;
    eventarg.clientX = x;
    eventarg.clientY = y;
    eventarg.offsetY = 7;
    return eventarg;
}

describe('TreeView control', () => {
    describe('DOM element testing', () => {
        beforeAll(() => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
        });
        let treeObj: TreeView;
        beforeEach((): void => {
            let Chromebrowser: string = "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36";
            Browser.userAgent = Chromebrowser;
            treeObj = undefined;
            let ele: HTMLElement = createElement('div', { id: 'tree1' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (treeObj)
                treeObj.destroy();
            document.body.innerHTML = '';
        });
        it('with base class', () => {
            treeObj = new TreeView({},'#tree1');
            expect(document.getElementById('tree1').classList.contains('e-control')).toEqual(true);
            expect(document.getElementById('tree1').classList.contains('e-treeview')).toEqual(true);
        });
    });
    describe('Hierarchical data binding testing', () => {
        describe('Default functionality testing', () => {
            let treeObj: any;
            let mouseEventArgs: any;
            let tapEvent: any;
            beforeEach((): void => {
                mouseEventArgs = {
                    preventDefault: (): void => {},
                    stopImmediatePropagation: (): void => {},
                    target: null,
                    type: null,
                    shiftKey: false,
                    ctrlKey: false,
                    originalEvent:{ target: null}
                };
                tapEvent = {
                    originalEvent: mouseEventArgs,
                    tapCount: 1
                };
                treeObj = undefined;
                let ele: HTMLElement = createElement('div', { id: 'tree1' });
                document.body.appendChild(ele);
            });
            afterEach((): void => {
                if (treeObj)
                    treeObj.destroy();
                document.body.innerHTML = '';
            });
            it('with null fields', () => {
                treeObj = new TreeView({ fields: null },'#tree1');
                expect(treeObj.element.querySelectorAll('li').length).toBe(0);
            });
            it('with empty fields', () => {
                treeObj = new TreeView({ fields: {} },'#tree1');
                expect(treeObj.element.querySelectorAll('li').length).toBe(0);
            });
            it('with null datasource', () => {
                treeObj = new TreeView({ fields: { dataSource: null } },'#tree1');
                expect(treeObj.element.querySelectorAll('li').length).toBe(0);
            });
            it('with empty datasource', () => {
                treeObj = new TreeView({ fields: { dataSource: [] } },'#tree1');
                expect(treeObj.element.querySelectorAll('li').length).toBe(0);
            });
            it('selectedNodes property testing', (done: Function) => {
                treeObj = new TreeView({ 
                    fields: { dataSource: hierarchicalData },
                    selectedNodes: ['30']
                },'#tree1');
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                    expect(li.length).toBe(10);
                    expect(li[0].classList.contains('e-active')).toBe(false);
                    expect(li[9].classList.contains('e-active')).toBe(true);
                    done();
                }, 450);
            });
            it('Disabled property testing', (done: Function) => {
                treeObj = new TreeView({ 
                    fields: { dataSource: hierarchicalData },
                    selectedNodes: ['30'],
                    disabled: true
                },'#tree1');
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    expect(treeObj.element.classList.contains('e-disabled')).toBe(true);
                    done();
                }, 450);
            });

            it('Disabled property with allowEditing and beginEdit', (done: Function) => {
                treeObj = new TreeView({ 
                    fields: { dataSource: hierarchicalData },
                    selectedNodes: ['30'],
                    disabled: true, allowDragAndDrop: true, allowEditing: true
                },'#tree1');
                treeObj.beginEdit('30');
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    expect(li[1].classList.contains('e-editing')).toBe(false);
                    done();
                }, 450);
            });

            it('Disabled property with drag and drop', (done: Function) => {
                treeObj = new TreeView({ 
                    fields: { dataSource: hierarchicalData },
                    selectedNodes: ['30'],
                    disabled: true, allowDragAndDrop: true
                },'#tree1');
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                   expect(treeObj.element.classList.contains('e-draggable')).toBe(false);
                   expect(treeObj.element.classList.contains('e-droppable')).toBe(false);
                    done();
                }, 450);
            });

            it('Disabled property when applied dynamically', (done: Function) => {
                treeObj = new TreeView({ 
                    fields: { dataSource: hierarchicalData },
                    selectedNodes: ['30'],
                    allowDragAndDrop: true, allowEditing: true
                },'#tree1');
                treeObj.disabled = true;
                treeObj.expandedNodes = ['23', '24', '30', '31'];
                treeObj.dataBind();
               jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                   expect(treeObj.element.classList.contains('e-draggable')).toBe(false);
                   expect(treeObj.expandedNodes).toContain('23');
                   expect(treeObj.expandedNodes).toContain('24');
                   done();
                }, 450);
            });

            it('without mapping fields', (done: Function) => {
                treeObj = new TreeView({ 
                    fields: { dataSource: hierarchicalData },
                    fullRowSelect: false,
                },'#tree1');
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    expect(treeObj.element.querySelectorAll('li').length).toBe(10);
                    expect(treeObj.element.querySelector('.e-list-text').innerHTML).toBe('Artwork');
                    expect(treeObj.element.querySelector('.e-list-item').getAttribute('data-uid')).toBe("1");
                    expect(treeObj.element.querySelector('.e-list-icon').classList.contains('folder')).toBe(true);
                    expect(treeObj.element.querySelector('.e-list-img').src.indexOf('images/Shooting.png')).not.toBe(-1);
                    expect(treeObj.element.querySelector('.e-list-item').title).toBe('This is Artwork node');
                    expect(treeObj.element.querySelector('.e-list-item').classList.contains('e-active')).toBe(true);
                    expect(treeObj.element.querySelectorAll('li')[1].classList.contains('firstnode')).toBe(true);
                    expect(treeObj.element.querySelectorAll('li')[1].style.backgroundColor).toBe('red');
                    expect(treeObj.element.querySelector('.e-list-url').href.indexOf('http://npmci.syncfusion.com/')).not.toBe(-1);
                    let newli: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                    expect(newli[2].childElementCount).toBe(2);
                    expect((newli[2].querySelector('.e-icons') as Element).classList.contains('e-icon-expandable')).toBe(false);
                    expect((newli[2].querySelector('.e-icons') as Element).classList.contains('e-icon-collapsible')).toBe(true);
                    expect(newli[2].getAttribute('aria-expanded')).toBe('true');
                    expect(newli[3].childElementCount).toBe(2);
                    expect((newli[3].querySelector('.e-icons') as Element).classList.contains('e-icon-expandable')).toBe(false);
                    expect((newli[3].querySelector('.e-icons') as Element).classList.contains('e-icon-collapsible')).toBe(true);
                    expect(newli[3].getAttribute('aria-expanded')).toBe('true');
                    mouseEventArgs.target = newli[0].querySelector('.e-icons');
                    expect(newli[0].childElementCount).toBe(1);
                    treeObj.touchClickObj.tap(tapEvent);
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function() {
                        expect(newli[0].childElementCount).toBe(2);
                        expect((newli[0] as Element).querySelector('.e-list-item').getAttribute('data-uid')).toBe('2');
                        expect(newli[0].querySelector('.e-list-parent').querySelector('.e-list-text').innerHTML).toBe('Abstract');
                        expect(document.getElementById('tree1').classList.contains('customTree')).toEqual(false);
                        expect(document.getElementById('tree1').classList.contains('productTree')).toEqual(false);
                        done();
                    }, 450);
                }, 500);
            });
            it('with mapping fields', (done: Function) => {
                treeObj = new TreeView({ 
                    fields: { dataSource: hierarchicalData1, id: "nodeId", text: "nodeText", child: "nodeChild", expanded: 'nodeExpanded', navigateUrl: 'nodeUrl',
                        iconCss: 'nodeIcon', imageUrl: 'nodeImage', tooltip: 'nodeTooltip', htmlAttributes: 'nodeHtmlAttr', selected: 'nodeSelected' },
                    cssClass: 'customTree productTree',
                    fullRowSelect: false,
                },'#tree1');
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    expect(treeObj.element.querySelectorAll('li').length).toBe(13);
                    expect(treeObj.element.querySelector('.e-list-text').innerHTML).toBe('Music');
                    expect(treeObj.element.querySelector('.e-list-item').getAttribute('data-uid')).toBe('01');
                    expect(treeObj.element.querySelector('.e-list-icon').classList.contains('folder')).toBe(true);
                    expect(treeObj.element.querySelector('.e-list-img').src.indexOf('images/Shooting.png')).not.toBe(-1);
                    expect(treeObj.element.querySelector('.e-list-item').title).toBe('This is Music node');
                    expect(treeObj.element.querySelector('.e-list-item').classList.contains('e-active')).toBe(true);
                    expect(treeObj.element.querySelectorAll('li')[1].classList.contains('firstnode')).toBe(true);
                    expect(treeObj.element.querySelectorAll('li')[1].style.backgroundColor).toBe('red');
                    expect(treeObj.element.querySelector('.e-list-url').href.indexOf('http://npmci.syncfusion.com/')).not.toBe(-1);
                    let newli: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                    expect(newli[3].childElementCount).toBe(2);
                    expect((newli[3].querySelector('.e-icons') as Element).classList.contains('e-icon-expandable')).toBe(false);
                    expect((newli[3].querySelector('.e-icons') as Element).classList.contains('e-icon-collapsible')).toBe(true);
                    expect(newli[3].getAttribute('aria-expanded')).toBe('true');
                    expect(newli[4].childElementCount).toBe(2);
                    expect((newli[4].querySelector('.e-icons') as Element).classList.contains('e-icon-expandable')).toBe(false);
                    expect((newli[4].querySelector('.e-icons') as Element).classList.contains('e-icon-collapsible')).toBe(true);
                    expect(newli[4].getAttribute('aria-expanded')).toBe('true');
                    mouseEventArgs.target = newli[0].querySelector('.e-icons');
                    expect(newli[0].childElementCount).toBe(1);
                    treeObj.touchClickObj.tap(tapEvent);
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function() {
                        expect(newli[0].childElementCount).toBe(2);
                        expect((newli[0] as Element).querySelector('.e-list-item').getAttribute('data-uid')).toBe('01-01');
                        expect(newli[0].querySelector('.e-list-parent').querySelector('.e-list-text').innerHTML).toBe('Gouttes.mp3');
                        expect(document.getElementById('tree1').classList.contains('customTree')).toEqual(true);
                        expect(document.getElementById('tree1').classList.contains('productTree')).toEqual(true);
                        done();
                    }, 450);
                }, 500);
            });
            it('sortOrder property testing', (done: Function) => {
                treeObj = new TreeView({ 
                    fields: { dataSource: hierarchicalData1, id: "nodeId", text: "nodeText", child: "nodeChild",
                        iconCss: 'nodeIcon', imageUrl: 'nodeImage', tooltip: 'nodeTooltip', htmlAttributes: 'nodeHtmlAttr', selected: 'nodeSelected' },
                    sortOrder: 'Ascending'
                },'#tree1');
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    expect(treeObj.element.querySelectorAll('li').length).toBe(5);
                    expect(treeObj.element.querySelector('.e-list-text').innerHTML).toBe('Documents');
                    expect(treeObj.element.querySelector('.e-list-item').getAttribute('data-uid')).toBe('03');
                    done();
                }, 100);
            });
             it('Element structure', (done: Function) => {
                treeObj = new TreeView({ 
                    fields: { dataSource: hierarchicalData1, id: "nodeId", text: "nodeText", child: "nodeChild",
                        iconCss: 'nodeIcon', imageUrl: 'nodeImage', tooltip: 'nodeTooltip', },
                    fullRowSelect: false,
                },'#tree1');
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    expect(treeObj.element.classList.contains('e-treeview')).toBe(true);
                    expect(treeObj.element.children[0].classList.contains('e-list-parent')).toBe(true);
                    expect(treeObj.element.childNodes[0].nodeName).toEqual("UL");
                    let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                    expect(treeObj.element.childNodes[0].firstElementChild).toEqual(li[0]);
                    expect(treeObj.element.querySelector('li').classList.contains('e-list-item')).toBe(true);
                    expect(li[0].querySelector('.e-icons').classList.contains('e-icon-expandable')).toBe(true);
                    done();
                }, 100);
            });
             it('expandOn property testing with None', (done: Function) => {
                treeObj = new TreeView({ 
                    fields: { dataSource: hierarchicalData1, id: "nodeId", text: "nodeText", child: "nodeChild",
                        iconCss: 'nodeIcon', imageUrl: 'nodeImage', tooltip: 'nodeTooltip', },
                    fullRowSelect: false,
                    expandOn: "None"
                },'#tree1');
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                    tapEvent.tapCount = 2;
                    mouseEventArgs.target = li[0].querySelector('.e-list-text');
                    expect(li[0].querySelector('.e-icons').classList.contains('e-icon-expandable')).toBe(true);
                    expect(li[0].querySelector('.e-icons').classList.contains('e-icon-collapsible')).toBe(false);
                    expect(li[0].childElementCount).toBe(1);
                    expect(li[0].querySelector('.e-list-text').childElementCount).toBe(0);
                    treeObj.touchClickObj.tap(tapEvent);
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function() {
                        expect(li[0].querySelector('.e-icons').classList.contains('e-icon-expandable')).toBe(true);
                        expect(li[0].querySelector('.e-icons').classList.contains('e-icon-collapsible')).toBe(false);
                        done();
                    }, 450);
                }, 100);
            });
            it('expandOn property testing with Click', (done: Function) => {
                treeObj = new TreeView({ 
                    fields: { dataSource: hierarchicalData1, id: "nodeId", text: "nodeText", child: "nodeChild",
                        iconCss: 'nodeIcon', imageUrl: 'nodeImage', tooltip: 'nodeTooltip', },
                    fullRowSelect: false,
                    expandOn: "Click"
                },'#tree1');
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                    mouseEventArgs.target = li[0].querySelector('.e-list-text');
                    expect(li[0].querySelector('.e-icons').classList.contains('e-icon-expandable')).toBe(true);
                    expect(li[0].querySelector('.e-icons').classList.contains('e-icon-collapsible')).toBe(false);
                    expect(li[0].childElementCount).toBe(1);
                    expect(li[0].querySelector('.e-list-text').childElementCount).toBe(0);
                    treeObj.touchExpandObj.tap(tapEvent);
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function() {
                        expect(li[0].querySelector('.e-icons').classList.contains('e-icon-expandable')).toBe(false);
                        expect(li[0].querySelector('.e-icons').classList.contains('e-icon-collapsible')).toBe(true);
                        done();
                    }, 450);
                }, 100);
            });
            it('expandOn property testing with Click in disabled mode', () => {
                enableRipple(true);
                treeObj = new TreeView({ 
                    fields: { dataSource: hierarchicalData1, id: "nodeId", text: "nodeText", child: "nodeChild",
                        iconCss: 'nodeIcon', imageUrl: 'nodeImage', tooltip: 'nodeTooltip', },
                    fullRowSelect: false,
                },'#tree1');
                treeObj.disabled = true;
                treeObj.expandOn = 'Click';
                treeObj.dataBind();
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                li[0].querySelector('.e-icons').dispatchEvent(e);
                var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                li[0].querySelector('.e-icons').dispatchEvent(e);
                var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
                li[0].querySelector('.e-icons').dispatchEvent(e);
                expect(li[0].querySelector('.e-icons').classList.contains('e-ripple')).toBe(false);
            });

            it('expandOn property testing with Click (right Click)', (done: Function) => {
                treeObj = new TreeView({ 
                    fields: { dataSource: hierarchicalData1, id: "nodeId", text: "nodeText", child: "nodeChild",
                        iconCss: 'nodeIcon', imageUrl: 'nodeImage', tooltip: 'nodeTooltip', },
                    fullRowSelect: false,
                    expandOn: "Click"
                },'#tree1');
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                    mouseEventArgs.target = li[0].querySelector('.e-list-text');
                    expect(li[0].querySelector('.e-icons').classList.contains('e-icon-expandable')).toBe(true);
                    expect(li[0].querySelector('.e-icons').classList.contains('e-icon-collapsible')).toBe(false);
                    expect(li[0].childElementCount).toBe(1);
                    expect(li[0].querySelector('.e-list-text').childElementCount).toBe(0);
                    tapEvent.originalEvent.which = 3;
                    treeObj.touchExpandObj.tap(tapEvent);
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function() {
                        expect(li[0].querySelector('.e-icons').classList.contains('e-icon-expandable')).toBe(true);
                        expect(li[0].querySelector('.e-icons').classList.contains('e-icon-collapsible')).toBe(false);
                        done();
                    }, 450);
                }, 100);
            });
            it('expandOn property testing with DblClick', (done: Function) => {
                treeObj = new TreeView({ 
                    fields: { dataSource: hierarchicalData1, id: "nodeId", text: "nodeText", child: "nodeChild",
                        iconCss: 'nodeIcon', imageUrl: 'nodeImage', tooltip: 'nodeTooltip', },
                    fullRowSelect: false,
                    expandOn: "DblClick"
                },'#tree1');
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                    mouseEventArgs.target = li[0].querySelector('.e-list-text');
                    expect(li[0].querySelector('.e-icons').classList.contains('e-icon-expandable')).toBe(true);
                    expect(li[0].querySelector('.e-icons').classList.contains('e-icon-collapsible')).toBe(false);
                    expect(li[0].childElementCount).toBe(1);
                    expect(li[0].querySelector('.e-list-text').childElementCount).toBe(0);
                    tapEvent.tapCount = 2;
                    treeObj.touchExpandObj.tap(tapEvent);
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function() {
                        expect(li[0].querySelector('.e-icons').classList.contains('e-icon-expandable')).toBe(false);
                        expect(li[0].querySelector('.e-icons').classList.contains('e-icon-collapsible')).toBe(true);
                        done();
                    }, 450);
                }, 100);
            });
            it('expandOn property testing with DblClick (right Click)', (done: Function) => {
                treeObj = new TreeView({ 
                    fields: { dataSource: hierarchicalData1, id: "nodeId", text: "nodeText", child: "nodeChild",
                        iconCss: 'nodeIcon', imageUrl: 'nodeImage', tooltip: 'nodeTooltip', },
                    fullRowSelect: false,
                    expandOn: "DblClick"
                },'#tree1');
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                    mouseEventArgs.target = li[0].querySelector('.e-list-text');
                    expect(li[0].querySelector('.e-icons').classList.contains('e-icon-expandable')).toBe(true);
                    expect(li[0].querySelector('.e-icons').classList.contains('e-icon-collapsible')).toBe(false);
                    expect(li[0].childElementCount).toBe(1);
                    expect(li[0].querySelector('.e-list-text').childElementCount).toBe(0);
                    tapEvent.tapCount = 2;
                    tapEvent.originalEvent.which = 3;
                    treeObj.touchExpandObj.tap(tapEvent);
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function() {
                        expect(li[0].querySelector('.e-icons').classList.contains('e-icon-expandable')).toBe(true);
                        expect(li[0].querySelector('.e-icons').classList.contains('e-icon-collapsible')).toBe(false);
                        done();
                    }, 450);
                }, 100);
            });
            it('allowEditing property with default value testing', (done: Function) => {
                treeObj = new TreeView({ 
                    fields: { dataSource: hierarchicalData1, id: "nodeId", text: "nodeText", child: "nodeChild",
                        iconCss: 'nodeIcon', imageUrl: 'nodeImage', tooltip: 'nodeTooltip', },
                    fullRowSelect: false,
                },'#tree1');
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                    tapEvent.tapCount = 2;
                    mouseEventArgs.target = li[0].querySelector('.e-list-text');
                    expect(li[0].querySelector('.e-icons').classList.contains('e-icon-expandable')).toBe(true);
                    expect(li[0].querySelector('.e-icons').classList.contains('e-icon-collapsible')).toBe(false);
                    expect(li[0].childElementCount).toBe(1);
                    expect(li[0].querySelector('.e-list-text').childElementCount).toBe(0);
                    treeObj.touchExpandObj.tap(tapEvent);
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function() {
                        expect(li[0].querySelector('.e-icons').classList.contains('e-icon-expandable')).toBe(false);
                        expect(li[0].querySelector('.e-icons').classList.contains('e-icon-collapsible')).toBe(true);
                        expect(li[0].childElementCount).toBe(2);
                        expect(li[0].getAttribute('aria-expanded')).toBe('true');
                        expect(li[0].querySelector('.e-list-text').childElementCount).toBe(0);
                        done();
                    }, 450);
                }, 100);
            });
            it('allowEditing property testing', (done: Function) => {
                treeObj = new TreeView({ 
                    fields: { dataSource: hierarchicalData1, id: "nodeId", text: "nodeText", child: "nodeChild",
                        iconCss: 'nodeIcon', imageUrl: 'nodeImage', tooltip: 'nodeTooltip', },
                    allowEditing: true,
                    fullRowSelect: false,
                },'#tree1');
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                    expect(li[0].querySelector('.e-icons').classList.contains('e-icon-expandable')).toBe(true);
                    expect(li[0].querySelector('.e-icons').classList.contains('e-icon-collapsible')).toBe(false);
                    expect(li[0].childElementCount).toBe(1);
                    expect(li[0].querySelector('.e-list-text').childElementCount).toBe(0);
                    tapEvent.tapCount = 2;
                    mouseEventArgs.target = li[0].querySelector('.e-list-text');
                    treeObj.touchExpandObj.tap(tapEvent);
                    treeObj.touchEditObj.tap(tapEvent);
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function() {
                        expect(li[0].querySelector('.e-icons').classList.contains('e-icon-expandable')).toBe(false);
                        expect(li[0].querySelector('.e-icons').classList.contains('e-icon-collapsible')).toBe(true);
                        expect(li[0].childElementCount).toBe(2);
                        expect(li[0].querySelector('.e-list-text').childElementCount).toBe(1);
                        expect(li[0].querySelector('.e-input').nodeName).toBe('INPUT');
                        expect((li[0].querySelector('.e-input') as HTMLInputElement).value).toBe('Music');
                        (li[0].querySelector('.e-input') as HTMLInputElement).value = 'Music node';
                        (li[0].querySelector('.e-input') as HTMLInputElement).blur();
                        expect(li[0].querySelector('.e-list-text').childElementCount).toBe(0);
                        expect((li[0].querySelector('.e-list-text') as HTMLElement).childNodes[0].nodeValue).toBe('Music node');
                        mouseEventArgs.target = li[0].querySelector('.e-list-item');
                        treeObj.touchExpandObj.tap(tapEvent);
                        treeObj.touchEditObj.tap(tapEvent);
                        expect(li[0].querySelector('.e-list-text').childElementCount).toBe(0);
                        mouseEventArgs.target = li[0].querySelector('.e-list-text');
                        treeObj.touchExpandObj.tap(tapEvent);
                        treeObj.touchEditObj.tap(tapEvent);
                        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                        setTimeout(function() {
                            expect((li[0].querySelector('.e-input') as HTMLInputElement).value).toBe('Music node');
                            (li[0].querySelector('.e-input') as HTMLInputElement).value = 'Music';
                            (li[0].querySelector('.e-input') as HTMLInputElement).blur();
                            expect(li[0].querySelector('.e-list-text').childElementCount).toBe(0);
                            expect((li[0].querySelector('.e-list-text') as HTMLElement).childNodes[0].nodeValue).toBe('Music');
                            let nli: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                            mouseEventArgs.target = nli[1].querySelector('.e-list-text');
                            treeObj.touchExpandObj.tap(tapEvent);
                            treeObj.touchEditObj.tap(tapEvent);
                            expect((nli[1].querySelector('.e-input') as HTMLInputElement).value).toBe('Gouttes.mp3');
                            (nli[1].querySelector('.e-input') as HTMLInputElement).value = 'Gouttes.mp31';
                            (nli[1].querySelector('.e-input') as HTMLInputElement).blur();
                            expect(nli[1].querySelector('.e-list-text').childElementCount).toBe(0);
                            expect((nli[1].querySelector('.e-list-text') as HTMLElement).childNodes[0].nodeValue).toBe('Gouttes.mp31');
                            mouseEventArgs.target = nli[1].querySelector('.e-list-text');
                            treeObj.touchExpandObj.tap(tapEvent);
                            treeObj.touchEditObj.tap(tapEvent);
                            expect((nli[1].querySelector('.e-input') as HTMLInputElement).value).toBe('Gouttes.mp31');
                            (nli[1].querySelector('.e-input') as HTMLInputElement).value = 'Gouttes.mp3';
                            (nli[1].querySelector('.e-input') as HTMLInputElement).blur();
                            expect(nli[1].querySelector('.e-list-text').childElementCount).toBe(0);
                            expect((nli[1].querySelector('.e-list-text') as HTMLElement).childNodes[0].nodeValue).toBe('Gouttes.mp3');
                            done();
                        }, 450);
                    }, 100);
                }, 100);
            });
            it('enableRtl property testing', (done: Function) => {
                treeObj = new TreeView({ 
                    fields: { dataSource: hierarchicalData1, id: "nodeId", text: "nodeText", child: "nodeChild",
                        iconCss: 'nodeIcon', imageUrl: 'nodeImage', tooltip: 'nodeTooltip', htmlAttributes: 'nodeHtmlAttr', selected: 'nodeSelected' },
                    enableRtl: true,
                },'#tree1');
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    expect(treeObj.element.classList.contains('e-rtl')).toBe(true);
                    done();
                }, 100);
            });
            
			it('enableRtl with customcss class testing', (done: Function) => {
                treeObj = new TreeView({ 
                    fields: { dataSource: hierarchicalData1, id: "nodeId", text: "nodeText", child: "nodeChild",
                        iconCss: 'nodeIcon', imageUrl: 'nodeImage', tooltip: 'nodeTooltip', htmlAttributes: 'nodeHtmlAttr', selected: 'nodeSelected' },
                    enableRtl: true,
					cssClass: "e-style"
                },'#tree1');
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    expect(treeObj.element.classList.contains('e-rtl')).toBe(true);
					expect(treeObj.element.classList.contains('e-style')).toBe(true);
                    done();
                }, 100);
            });
            it('enableHtmlSanitizer property testing', (done: Function) => {
                treeObj = new TreeView({ 
                    fields: { dataSource: XSSnestedData, id: "id", text: "text", child: "child"},
                  enableHtmlSanitizer: false
                },'#tree1');
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    var htmlEle = document.body;
                    expect(window.getComputedStyle(htmlEle).backgroundColor).toBe("rgb(0, 0, 255)");
                    done();
                }, 100);
            });
            it('enableHtmlSanitizer property testing', (done: Function) => {
                treeObj = new TreeView({ 
                    fields: { dataSource: XSSData, id: "id", text: "text",},
                  enableHtmlSanitizer: true
                },'#tree1');
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    var htmlEle = document.body;
                    expect(window.getComputedStyle(htmlEle).backgroundColor).not.toBe("rgb(0, 0, 255)");
                    done();
                }, 100);
            });
            it('showCheckBox property testing', (done: Function) => {
                treeObj = new TreeView({ 
                    fields: { dataSource: hierarchicalData1, id: "nodeId", text: "nodeText", child: "nodeChild",
                        iconCss: 'nodeIcon', imageUrl: 'nodeImage', tooltip: 'nodeTooltip', htmlAttributes: 'nodeHtmlAttr', selected: 'nodeSelected' },
                        showCheckBox: true,
                },'#tree1');
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    let checkEle: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-checkbox-wrapper');
                    expect(checkEle.length).toBeGreaterThan(0);
                    expect(treeObj.element.querySelector('.e-checkbox-wrapper').classList.contains('e-small')).toBe(false);
                    var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                    checkEle[0].querySelector('.e-frame').dispatchEvent(e);
                    var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                    checkEle[0].querySelector('.e-frame').dispatchEvent(e);
                    var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
                    checkEle[0].querySelector('.e-frame').dispatchEvent(e);
                    expect(checkEle[0].getAttribute('aria-checked')).toBe('true');
                    done();
                }, 100);
            });
            it('showCheckBox property right click testing', (done: Function) => {
                let mouseEventArgs: any = {
                    preventDefault: (): void => {},
                    stopImmediatePropagation: (): void => {},
                    target: null,
                    type: null,
                    shiftKey: false,
                    ctrlKey: false,
                    originalEvent: { target: null }
                };
                let tapEvent: any = {
                    originalEvent: mouseEventArgs,
                    tapCount: 1
                };
                treeObj = new TreeView({ 
                    fields: { dataSource: hierarchicalData1, id: "nodeId", text: "nodeText", child: "nodeChild",
                        iconCss: 'nodeIcon', imageUrl: 'nodeImage', tooltip: 'nodeTooltip', htmlAttributes: 'nodeHtmlAttr', selected: 'nodeSelected' },
                        showCheckBox: true,
                },'#tree1');
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    let checkEle: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-checkbox-wrapper');
                    expect(checkEle.length).toBeGreaterThan(0);
                    mouseEventArgs.target = checkEle[0].querySelector('.e-frame.e-icons');
                    tapEvent.originalEvent.which = 1;
                    treeObj.touchClickObj.tap(tapEvent);
                    expect(checkEle[0].getAttribute('aria-checked')).toBe('true');
                    expect(treeObj.element.querySelectorAll('.e-check').length).toBeGreaterThan(0);    
                    tapEvent.originalEvent.which = 3;
                    treeObj.touchClickObj.tap(tapEvent);
                    expect(checkEle[0].getAttribute('aria-checked')).toBe('true');
                    expect(treeObj.element.querySelectorAll('.e-check').length).toBeGreaterThan(0);
                    tapEvent.originalEvent.which = 1;
                    treeObj.touchClickObj.tap(tapEvent);
                    expect(checkEle[0].getAttribute('aria-checked')).toBe('false');
                    expect(treeObj.element.querySelectorAll('.e-check').length).toBe(0);
                    tapEvent.originalEvent.which = 3;
                    treeObj.touchClickObj.tap(tapEvent);
                    expect(checkEle[0].getAttribute('aria-checked')).toBe('false');
                    expect(treeObj.element.querySelectorAll('.e-check').length).toBe(0);
                    done();
                }, 100);
            });
            it('showCheckBox property testing and checkedNodes property testing', (done: Function) => {
                treeObj = new TreeView({ 
                   fields: { dataSource: checkboxData, id: 'id', text: 'name', child: 'subChild' },
                   showCheckBox: true,
                },'#tree1');
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    let checkEle: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-checkbox-wrapper');
                    expect(checkEle.length).toBeGreaterThan(0);
                    expect(treeObj.element.querySelector('.e-checkbox-wrapper').classList.contains('e-small')).toBe(false);
                    var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                    checkEle[0].querySelector('.e-frame').dispatchEvent(e);
                    var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                    checkEle[0].querySelector('.e-frame').dispatchEvent(e);
                    var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
                    checkEle[0].querySelector('.e-frame').dispatchEvent(e);
                    expect(checkEle[0].getAttribute('aria-checked')).toBe('true');
                    expect(treeObj.checkedNodes.length).toBe(13);
                    var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                    checkEle[0].querySelector('.e-frame').dispatchEvent(e);
                    var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                    checkEle[0].querySelector('.e-frame').dispatchEvent(e);
                    var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
                    checkEle[0].querySelector('.e-frame').dispatchEvent(e);
                    expect(treeObj.checkedNodes.length).toBe(0);
                    done();
                }, 100);
            });
            it('showCheckBox property testing with autoCheck true', function (done) { 
                    treeObj = new TreeView({
                        fields: { dataSource: hierarchicalData1, id: "nodeId", text: "nodeText", child: "nodeChild",
                            iconCss: 'nodeIcon', imageUrl: 'nodeImage', tooltip: 'nodeTooltip', htmlAttributes: 'nodeHtmlAttr', selected: 'nodeSelected', isChecked: 'nodeChecked' },
                        showCheckBox: true,
                        autoCheck: true
                    }, '#tree1');
                    setTimeout(function () {
                        let checkEle: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-checkbox-wrapper');
                        expect(checkEle.length).toBeGreaterThan(0);
                        expect(treeObj.element.querySelector('.e-checkbox-wrapper').classList.contains('e-small')).toBe(false);
                        var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                        checkEle[0].querySelector('.e-frame').dispatchEvent(e);
                        var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                        checkEle[0].querySelector('.e-frame').dispatchEvent(e);
                        var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
                        checkEle[0].querySelector('.e-frame').dispatchEvent(e);
                        expect(checkEle[0].getAttribute('aria-checked')).toBe('true');
                        var checknodes = treeObj.getAllCheckedNodes();
                        expect(checknodes.length).toBe(5);
                        treeObj.checkAll(['03']);
                        treeObj.dataBind();
                        expect(treeObj.getAllCheckedNodes().length).toBe(11);
                        treeObj.uncheckAll(['03']);
                        treeObj.dataBind();
                        expect(treeObj.getAllCheckedNodes().length).toBe(5);
                        done();
                    }, 100);
                });
                 it('autoCheck property testing with value as false', function (done) {
                    treeObj = new TreeView({
                        fields: { dataSource: hierarchicalData1, id: "nodeId", text: "nodeText", child: "nodeChild",
                            iconCss: 'nodeIcon', imageUrl: 'nodeImage', tooltip: 'nodeTooltip', htmlAttributes: 'nodeHtmlAttr', selected: 'nodeSelected', isChecked: 'nodeChecked' },
                        showCheckBox: true,
                        autoCheck: false
                    }, '#tree1');
                    setTimeout(function () {
                        let checkEle: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-checkbox-wrapper');
                        expect(checkEle.length).toBeGreaterThan(0);
                        expect(treeObj.element.querySelector('.e-checkbox-wrapper').classList.contains('e-small')).toBe(false);
                        var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                        checkEle[0].querySelector('.e-frame').dispatchEvent(e);
                        var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                        checkEle[0].querySelector('.e-frame').dispatchEvent(e);
                        var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
                        checkEle[0].querySelector('.e-frame').dispatchEvent(e);
                        expect(checkEle[0].getAttribute('aria-checked')).toBe('true');
                        treeObj.expandAll(['01']);
                        var childCheck= treeObj.element.querySelectorAll('.e-checkbox-wrapper');
                        expect(childCheck[1].getAttribute('aria-checked')).toBe('false');
                        expect(childCheck[1].firstElementChild.nextElementSibling.classList.contains('.e-check')).toBe(false);
                        done();
                    }, 100);
                });
                  it('autoCheck property testing with value as false via set model', function (done) {
                    treeObj = new TreeView({
                        fields: { dataSource: hierarchicalData1, id: "nodeId", text: "nodeText", child: "nodeChild",
                            iconCss: 'nodeIcon', imageUrl: 'nodeImage', tooltip: 'nodeTooltip', htmlAttributes: 'nodeHtmlAttr', selected: 'nodeSelected', isChecked: 'nodeChecked' },
                        showCheckBox: true,
                    }, '#tree1');
                    setTimeout(function () {
                        let checkEle: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-checkbox-wrapper');
                        expect(checkEle.length).toBeGreaterThan(0);
                        expect(treeObj.element.querySelector('.e-checkbox-wrapper').classList.contains('e-small')).toBe(false);
                        var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                        checkEle[0].querySelector('.e-frame').dispatchEvent(e);
                        var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                        checkEle[0].querySelector('.e-frame').dispatchEvent(e);
                        var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
                        checkEle[0].querySelector('.e-frame').dispatchEvent(e);
                        expect(checkEle[0].getAttribute('aria-checked')).toBe('true');
                        treeObj.expandAll(['01']);
                        var childCheck= treeObj.element.querySelectorAll('.e-checkbox-wrapper');
                        expect(childCheck[1].getAttribute('aria-checked')).toBe('true');
                        treeObj.expandAll(['03']);
                        treeObj.checkAll(['03-03']);
                        treeObj.dataBind();
                        expect(checkEle[2].firstElementChild.nextElementSibling.classList.contains('e-stop')).toBe(true);
                        expect(treeObj.getAllCheckedNodes().length).toBe(6);
                        treeObj.autoCheck = false;
                        treeObj.dataBind();
                        expect(checkEle[2].firstElementChild.nextElementSibling.classList.contains('e-stop')).toBe(false);
                        treeObj.uncheckAll(['01-01', '03-03'])
                        treeObj.dataBind();
                        expect(treeObj.getAllCheckedNodes().length).toBe(4);
                        done();
                    }, 100);
                });
                it('CheckedNodes property testing with loadOnDemand enabled by UI', (done: Function) => {
                    treeObj = new TreeView({
                        fields: { dataSource: checkData, id: 'id', parentID: 'pid', text: 'name', hasChildren: 'hasChild', },
                        showCheckBox: true,
                        autoCheck: true
                    }, '#tree1');
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function () {
                        let checkEle: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-checkbox-wrapper');
                        expect(checkEle.length).toBeGreaterThan(0);
                        expect(treeObj.element.querySelector('.e-checkbox-wrapper').classList.contains('e-small')).toBe(false);
                        var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                        checkEle[0].querySelector('.e-frame').dispatchEvent(e);
                        var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                        checkEle[0].querySelector('.e-frame').dispatchEvent(e);
                        var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
                        checkEle[0].querySelector('.e-frame').dispatchEvent(e);
                        expect(checkEle[0].getAttribute('aria-checked')).toBe('true');
                        var checknodes = treeObj.getAllCheckedNodes();
                        expect(checknodes.length).toBe(9);
                        expect(treeObj.checkedNodes.length).toBe(9);
                        done();
                    }, 100);
                });
                it('CheckedNodes property testing with loadOnDemand disabled by UI', (done: Function) => {
                    treeObj = new TreeView({
                        fields: { dataSource: checkData, id: 'id', parentID: 'pid', text: 'name', hasChildren: 'hasChild', },
                        showCheckBox: true,
                        autoCheck: true,
                        loadOnDemand: false
                    }, '#tree1');
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function () {
                        let checkEle: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-checkbox-wrapper');
                        expect(checkEle.length).toBeGreaterThan(0);
                        expect(treeObj.element.querySelector('.e-checkbox-wrapper').classList.contains('e-small')).toBe(false);
                        var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                        checkEle[0].querySelector('.e-frame').dispatchEvent(e);
                        var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                        checkEle[0].querySelector('.e-frame').dispatchEvent(e);
                        var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
                        checkEle[0].querySelector('.e-frame').dispatchEvent(e);
                        expect(checkEle[0].getAttribute('aria-checked')).toBe('true');
                        var checknodes = treeObj.getAllCheckedNodes();
                        expect(checknodes.length).toBe(9);
                        expect(treeObj.checkedNodes.length).toBe(9);
                        done();
                    }, 100);
                });
            it('allowDragAndDrop property with default value testing', (done: Function) => {
                treeObj = new TreeView({ 
                    fields: { dataSource: hierarchicalData1, id: "nodeId", text: "nodeText", child: "nodeChild" },
                },'#tree1');
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    expect(treeObj.dragObj).toBe(undefined);
                    expect(treeObj.dropObj).toBe(undefined);
                    done();
                }, 100);
            });
            it('allowDragAndDrop property testing', (done: Function) => {
                treeObj = new TreeView({ 
                    fields: { dataSource: hierarchicalData1, id: "nodeId", text: "nodeText", child: "nodeChild" },
                    allowDragAndDrop: true,
                },'#tree1');
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    expect(treeObj.dragObj).not.toBe(undefined);
                    expect(treeObj.dropObj).not.toBe(undefined);
                    let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                    let mousedown: any = getEventObject('MouseEvents', 'mousedown', treeObj.element, li[0].querySelector('.e-list-text'), 15, 10);
                    EventHandler.trigger(treeObj.element, 'mousedown', mousedown);
                    let mousemove: any = getEventObject('MouseEvents', 'mousemove', treeObj.element, li[0].querySelector('.e-list-text'), 15, 70);
                    EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                    mousemove.srcElement = mousemove.target = mousemove.toElement = li[0].querySelector('.e-list-text');
                    mousemove = setMouseCordinates(mousemove, 15, 75);
                    EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                    let mouseup: any = getEventObject('MouseEvents', 'mouseup', treeObj.element, li[0].querySelector('.e-list-text'));
                    mouseup.type = 'mouseup';
                    EventHandler.trigger(<any>(document), 'mouseup', mouseup);
                    done();
                }, 100);
            });
			it('allowDragAndDrop with multiselection property testing', (done: Function) => {
                treeObj = new TreeView({ 
                    fields: { dataSource: hierarchicalData1, id: "nodeId", text: "nodeText", child: "nodeChild" },
                    allowDragAndDrop: true,
					allowMultiSelection: true
                },'#tree1');
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                    let mousedown: any = getEventObject('MouseEvents', 'mousedown', treeObj.element, li[2].querySelector('.e-list-text'), 15, 10);
                    EventHandler.trigger(treeObj.element, 'mousedown', mousedown);
                    let mousemove: any = getEventObject('MouseEvents', 'mousemove', treeObj.element, li[2].querySelector('.e-list-text'), 15, 70);
                    EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                    mousemove.srcElement = mousemove.target = mousemove.toElement = li[1].querySelector('.e-list-text');
                    mousemove = setMouseCordinates(mousemove, 15, 75);
                    EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                    let mouseup: any = getEventObject('MouseEvents', 'mouseup', treeObj.element, li[0].querySelector('.e-list-text'));
                    mouseup.type = 'mouseup';
					li[2].classList.add("e-active");
                    EventHandler.trigger(<any>(document), 'mouseup', mouseup);
					expect(li[0].classList.contains('e-node-focus')).toBe(true);
                    done();
                }, 100);
            });it('DragAndDrop unselected node testing', (done: Function) => {
                treeObj = new TreeView({ 
                    fields: { dataSource: hierarchicalData1, id: "nodeId", text: "nodeText", child: "nodeChild" },
                    allowDragAndDrop: true,
                    allowMultiSelection: true,
                    selectedNodes: ["01"]
                },'#tree1');
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                    let mousedown: any = getEventObject('MouseEvents', 'mousedown', treeObj.element, li[2].querySelector('.e-list-text'), 15, 10);
                    EventHandler.trigger(treeObj.element, 'mousedown', mousedown);
                    let mousemove: any = getEventObject('MouseEvents', 'mousemove', treeObj.element, li[2].querySelector('.e-list-text'), 15, 70);
                    EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                    mousemove.srcElement = mousemove.target = mousemove.toElement = li[3].querySelector('.e-list-text');
                    mousemove = setMouseCordinates(mousemove, 15, 75);
                    EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                    let mouseup: any = getEventObject('MouseEvents', 'mouseup', treeObj.element, li[3].querySelector('.e-list-text'));
                    mouseup.type = 'mouseup';
                    mouseup.offsetY = 6;
                    EventHandler.trigger(<any>(document), 'mouseup', mouseup);
					expect(li[2].parentElement.closest('.e-list-item') === null).toBe(true);
                    done();
                }, 100);
            });
            it('DragAndDrop drop element active testing', (done: Function) => {
                treeObj = new TreeView({ 
                    fields: { dataSource: hierarchicalData1, id: "nodeId", text: "nodeText", child: "nodeChild" },
                    allowDragAndDrop: true,
                    allowMultiSelection: true,
                    selectedNodes: ["01"]
                },'#tree1');
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                    let mousedown: any = getEventObject('MouseEvents', 'mousedown', treeObj.element, li[2].querySelector('.e-list-text'), 15, 10);
                    EventHandler.trigger(treeObj.element, 'mousedown', mousedown);
                    let mousemove: any = getEventObject('MouseEvents', 'mousemove', treeObj.element, li[2].querySelector('.e-list-text'), 15, 70);
                    EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                    mousemove.srcElement = mousemove.target = mousemove.toElement = li[1].querySelector('.e-list-text');
                    mousemove = setMouseCordinates(mousemove, 15, 75);
                    EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                    let mouseup: any = getEventObject('MouseEvents', 'mouseup', treeObj.element, li[0].querySelector('.e-list-text'));
                    mouseup.type = 'mouseup';
                    li[2].classList.add("e-active");
                    EventHandler.trigger(<any>(document), 'mouseup', mouseup);
                    expect(li[2].parentElement.closest('.e-list-item') === li[0]).toBe(true);
                    done();
                }, 100);
            });
			it('allowDragAndDrop with rtl property testing', (done: Function) => {
                treeObj = new TreeView({ 
                    fields: { dataSource: hierarchicalData1, id: "nodeId", text: "nodeText", child: "nodeChild" },
                    allowDragAndDrop: true,
					enableRtl: true
                },'#tree1');
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                    let mousedown: any = getEventObject('MouseEvents', 'mousedown', treeObj.element, li[2].querySelector('.e-list-text'), 15, 10);
                    EventHandler.trigger(treeObj.element, 'mousedown', mousedown);
                    let mousemove: any = getEventObject('MouseEvents', 'mousemove', treeObj.element, li[2].querySelector('.e-list-text'), 15, 70);
                    EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                    mousemove.srcElement = mousemove.target = mousemove.toElement = li[1].querySelector('.e-list-text');
                    mousemove = setMouseCordinates(mousemove, 15, 75);
                    EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                    let mouseup: any = getEventObject('MouseEvents', 'mouseup', treeObj.element, li[0].querySelector('.e-list-text'));
                    mouseup.type = 'mouseup';
					li[2].classList.add("e-active");
                    EventHandler.trigger(<any>(document), 'mouseup', mouseup);
					expect(li[0].classList.contains('e-node-focus')).toBe(true);
                    done();
                }, 100);
            });
			it('Mouse offset height change testing', (done: Function) => {
                treeObj = new TreeView({ 
                    fields: { dataSource: hierarchicalData1, id: "nodeId", text: "nodeText", child: "nodeChild" },
                    allowDragAndDrop: true,
					allowMultiSelection: true
                },'#tree1');
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                    let mousedown: any = getEventObject('MouseEvents', 'mousedown', treeObj.element, li[2].querySelector('.e-list-text'), 15, 10);
                    EventHandler.trigger(treeObj.element, 'mousedown', mousedown);
                    let mousemove: any = getEventObject('MouseEvents', 'mousemove', treeObj.element, li[2].querySelector('.e-list-text'), 15, 70);
                    EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                    mousemove.srcElement = mousemove.target = mousemove.toElement = li[1].querySelector('.e-list-text');
                    mousemove = setMouseCordinates(mousemove, 15, 75);
                    EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                    let mouseup: any = getEventObject('MouseEvents', 'mouseup', treeObj.element, li[0].querySelector('.e-list-text'));
                    mouseup.type = 'mouseup';
					mouseup.offsetY = 8;
                    EventHandler.trigger(<any>(document), 'mouseup', mouseup);
					expect(li[0].classList.contains('e-node-focus')).toBe(true);
                    done();
                }, 100);
            });
            it('fullRowSelect property testing', (done: Function) => {
                treeObj = new TreeView({ 
                    fields: { dataSource: hierarchicalData1, id: "nodeId", text: "nodeText", child: "nodeChild", iconCss: 'nodeIcon', imageUrl: 'nodeImage', },
                },'#tree1');
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    expect(treeObj.element.classList.contains('e-fullrow-wrap')).toBe(true);
                    let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                    expect(li[0].childElementCount).toBe(2);
                    done();
                }, 100);
            });
            it('allowMultiSelection property testing with default value', (done: Function) => {
                treeObj = new TreeView({ 
                    fields: { dataSource: hierarchicalData3, id: "nodeId", text: "nodeText", child: "nodeChild", selected: 'nodeSelected1', },
                },'#tree1');
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                    // check selected attribute
                    expect(li[0].classList.contains('e-active')).toBe(true);
                    expect(treeObj.selectedNodes.length).toBe(1);
                    expect(treeObj.selectedNodes).toContain('01');
                    mouseEventArgs.ctrlKey = true;
                    mouseEventArgs.target = li[1].querySelector('.e-list-text');
                    treeObj.touchClickObj.tap(tapEvent);
                    // select node with id
                    expect(li[0].classList.contains('e-active')).toBe(false);
                    expect(li[1].classList.contains('e-active')).toBe(true);
                    expect(treeObj.selectedNodes.length).toBe(1);
                    expect(treeObj.selectedNodes).not.toContain('01');
                    expect(treeObj.selectedNodes).toContain('02');
                    // checking ctrl key
                    mouseEventArgs.target = li[1].querySelector('.e-list-text');
                    treeObj.touchClickObj.tap(tapEvent);
                    expect(li[0].classList.contains('e-active')).toBe(false);
                    expect(li[1].classList.contains('e-active')).toBe(true);
                    expect(treeObj.selectedNodes.length).toBe(1);
                    expect(treeObj.selectedNodes).not.toContain('01');
                    expect(treeObj.selectedNodes).toContain('02');
                    // checking shift key
                    mouseEventArgs.ctrlKey = false;
                    mouseEventArgs.shiftKey = true;
                    mouseEventArgs.target = li[3].querySelector('.e-list-text');
                    treeObj.touchClickObj.tap(tapEvent);
                    expect(li[0].classList.contains('e-active')).toBe(false);
                    expect(li[1].classList.contains('e-active')).toBe(false);
                    expect(li[2].classList.contains('e-active')).toBe(false);
                    expect(li[3].classList.contains('e-active')).toBe(true);
                    expect(treeObj.selectedNodes.length).toBe(1);
                    expect(treeObj.selectedNodes).not.toContain('01');
                    expect(treeObj.selectedNodes).not.toContain('02');
                    expect(treeObj.selectedNodes).not.toContain('03');
                    expect(treeObj.selectedNodes).toContain('04');
                    done();
                }, 100);
            });
            it('allowMultiSelection property testing', (done: Function) => {
                treeObj = new TreeView({ 
                    fields: { dataSource: hierarchicalData3, id: "nodeId", text: "nodeText", child: "nodeChild", selected: 'nodeSelected1', },
                    allowMultiSelection: true,
                },'#tree1');
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                    expect(li[0].classList.contains('e-active')).toBe(true);
                    expect(li[3].classList.contains('e-active')).toBe(true);
                    expect(treeObj.selectedNodes.length).toBe(2);
                    expect(treeObj.selectedNodes).toContain('01');
                    expect(treeObj.selectedNodes).toContain('04');
                    // select node with id
                    mouseEventArgs.ctrlKey = true;
                    mouseEventArgs.target = li[1].querySelector('.e-list-text');
                    treeObj.touchClickObj.tap(tapEvent);
                    expect(li[0].classList.contains('e-active')).toBe(true);
                    expect(li[1].classList.contains('e-active')).toBe(true);
                    expect(li[3].classList.contains('e-active')).toBe(true);
                    expect(treeObj.selectedNodes.length).toBe(3);
                    expect(treeObj.selectedNodes).toContain('01');
                    expect(treeObj.selectedNodes).toContain('02');
                    expect(treeObj.selectedNodes).toContain('04');
                    // unselect node with id
                    mouseEventArgs.target = li[1].querySelector('.e-list-text');
                    treeObj.touchClickObj.tap(tapEvent);
                    expect(li[1].classList.contains('e-active')).toBe(false);
                    expect(li[0].classList.contains('e-active')).toBe(true);
                    expect(li[3].classList.contains('e-active')).toBe(true);
                    expect(treeObj.selectedNodes.length).toBe(2);
                    expect(treeObj.selectedNodes).not.toContain('02');
                    expect(treeObj.selectedNodes).toContain('01');
                    expect(treeObj.selectedNodes).toContain('04');
                    // select node without id
                    mouseEventArgs.target = li[7].querySelector('.e-list-text');
                    treeObj.touchClickObj.tap(tapEvent);
                    expect(li[1].classList.contains('e-active')).toBe(false);
                    expect(li[0].classList.contains('e-active')).toBe(true);
                    expect(li[3].classList.contains('e-active')).toBe(true);
                    expect(li[7].classList.contains('e-active')).toBe(true);
                    expect(treeObj.selectedNodes.length).toBe(3);
                    expect(treeObj.selectedNodes).not.toContain('02');
                    expect(treeObj.selectedNodes).toContain('01');
                    expect(treeObj.selectedNodes).toContain('04');
                    expect(treeObj.selectedNodes).not.toContain(null);
                    // unselect node without id
                    mouseEventArgs.target = li[7].querySelector('.e-list-text');
                    treeObj.touchClickObj.tap(tapEvent);
                    expect(li[1].classList.contains('e-active')).toBe(false);
                    expect(li[0].classList.contains('e-active')).toBe(true);
                    expect(li[3].classList.contains('e-active')).toBe(true);
                    expect(li[7].classList.contains('e-active')).toBe(false);
                    expect(treeObj.selectedNodes.length).toBe(2);
                    expect(treeObj.selectedNodes).not.toContain('02');
                    expect(treeObj.selectedNodes).toContain('01');
                    expect(treeObj.selectedNodes).toContain('04');
                    expect(treeObj.selectedNodes).not.toContain(null);
                    done();
                }, 100);
            });
            it('allowMultiSelection property testing with shift key', (done: Function) => {
                treeObj = new TreeView({ 
                    fields: { dataSource: hierarchicalData3, id: "nodeId", text: "nodeText", child: "nodeChild", },
                    allowMultiSelection: true,
                },'#tree1');
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                    // select middle node
                    mouseEventArgs.shiftKey = true;
                    mouseEventArgs.target = li[1].querySelector('.e-list-text');
                    treeObj.touchClickObj.tap(tapEvent);
                    expect(li[1].classList.contains('e-active')).toBe(true);
                    expect(treeObj.selectedNodes.length).toBe(1);
                    expect(treeObj.selectedNodes).toContain('02');
                    // select first node
                    mouseEventArgs.target = li[0].querySelector('.e-list-text');
                    treeObj.touchClickObj.tap(tapEvent);
                    expect(li[0].classList.contains('e-active')).toBe(true);
                    expect(li[1].classList.contains('e-active')).toBe(true);
                    expect(treeObj.selectedNodes.length).toBe(2);
                    expect(treeObj.selectedNodes).toContain('01');
                    expect(treeObj.selectedNodes).toContain('02');
                    // select next node
                    mouseEventArgs.target = li[3].querySelector('.e-list-text');
                    treeObj.touchClickObj.tap(tapEvent);
                    expect(li[0].classList.contains('e-active')).toBe(false);
                    expect(li[1].classList.contains('e-active')).toBe(true);
                    expect(li[2].classList.contains('e-active')).toBe(true);
                    expect(li[3].classList.contains('e-active')).toBe(true);
                    expect(treeObj.selectedNodes.length).toBe(3);
                    expect(treeObj.selectedNodes).not.toContain('01');
                    expect(treeObj.selectedNodes).toContain('02');
                    expect(treeObj.selectedNodes).toContain('03');
                    expect(treeObj.selectedNodes).toContain('04');
                    // expand first node
                    mouseEventArgs.shiftKey = false;
                    mouseEventArgs.target = li[0].querySelector('.e-icons');
                    treeObj.touchClickObj.tap(tapEvent);
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function() {
                        // collpase first node
                        mouseEventArgs.target = li[0].querySelector('.e-icons');
                        treeObj.touchClickObj.tap(tapEvent);
                        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                        setTimeout(function() {
                            let newli: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                            // check invisible node
                            mouseEventArgs.shiftKey = true;
                            mouseEventArgs.target = newli[0].querySelector('.e-list-text');
                            treeObj.touchClickObj.tap(tapEvent);
                            expect(newli[0].classList.contains('e-active')).toBe(true);
                            expect(newli[1].classList.contains('e-active')).toBe(false);
                            expect(newli[2].classList.contains('e-active')).toBe(true);
                            expect(newli[3].classList.contains('e-active')).toBe(false);
                            expect(newli[4].classList.contains('e-active')).toBe(false);
                            expect(treeObj.selectedNodes.length).toBe(2);
                            expect(treeObj.selectedNodes).toContain('01');
                            expect(treeObj.selectedNodes).not.toContain('01-01');
                            expect(treeObj.selectedNodes).toContain('02');
                            expect(treeObj.selectedNodes).not.toContain('03');
                            expect(treeObj.selectedNodes).not.toContain('04');
                            done();
                        }, 450);
                    }, 450);
                }, 100);
            });
            it('allowMultiSelection property testing with selected attribute', (done: Function) => {
                treeObj = new TreeView({ 
                    fields: { dataSource: hierarchicalData3, id: "nodeId", text: "nodeText", child: "nodeChild", selected: 'nodeSelected1', expanded: 'nodeExpanded1' },
                    allowMultiSelection: true,
                },'#tree1');
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                    expect(li[0].classList.contains('e-active')).toBe(true);
                    expect(li[3].classList.contains('e-active')).toBe(true);
                    expect(li[4].classList.contains('e-active')).toBe(true);
                    expect(treeObj.selectedNodes.length).toBe(3);
                    expect(treeObj.selectedNodes).toContain('01');
                    expect(treeObj.selectedNodes).toContain('04');
                    expect(treeObj.selectedNodes).toContain('04-01');
                    done();
                }, 100);
            });
            it('allowMultiSelection property testing with selectedNodes', (done: Function) => {
                treeObj = new TreeView({ 
                    fields: { dataSource: hierarchicalData3, id: "nodeId", text: "nodeText", child: "nodeChild", selected: 'nodeSelected1', expanded: 'nodeExpanded1' },
                    allowMultiSelection: true,
                    selectedNodes: ['02', '03', '04-02']
                },'#tree1');
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                    expect(li[0].classList.contains('e-active')).toBe(false);
                    expect(li[3].classList.contains('e-active')).toBe(false);
                    expect(li[4].classList.contains('e-active')).toBe(false);
                    expect(li[1].classList.contains('e-active')).toBe(true);
                    expect(li[2].classList.contains('e-active')).toBe(true);
                    expect(li[8].classList.contains('e-active')).toBe(true);
                    expect(treeObj.selectedNodes.length).toBe(3);
                    expect(treeObj.selectedNodes).not.toContain('01');
                    expect(treeObj.selectedNodes).not.toContain('04');
                    expect(treeObj.selectedNodes).not.toContain('04-01');
                    expect(treeObj.selectedNodes).toContain('02');
                    expect(treeObj.selectedNodes).toContain('03');
                    expect(treeObj.selectedNodes).toContain('04-02');
                    done();
                }, 100);
            });
            it('template support testing with draw event', (done: Function) => {
                treeObj = new TreeView({ 
                    fields: { dataSource: hierarchicalData1, id: "nodeId", text: "nodeText", child: "nodeChild", expanded: 'nodeExpanded1' },
                    drawNode: (args) => {
                        var rowDiv = document.createElement('span');
                        if (!args.node.querySelector('.e-icons')) {
                            rowDiv.className += 'child';
                        } else {
                            rowDiv.className += 'parent';
                        }
                        args.node.children[1].appendChild(rowDiv);
                    },
                },'#tree1');
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-text-content');
                    expect(li[0].querySelector('.parent')).not.toBe(null);
                    expect(li[0].querySelector('.child')).toBe(null);
                    expect(li[1].querySelector('.child')).not.toBe(null);
                    expect(li[1].querySelector('.parent')).toBe(null);
                    done();
                }, 450);
            });
            it('template support testing with string', (done: Function) => {
                treeObj = new TreeView({ 
                    fields: { dataSource: hierarchicalData1, id: "nodeId", text: "nodeText", child: "nodeChild", expanded: 'nodeExpanded1' },
                    nodeTemplate: '${if(nodeChild == undefined)}<b>${nodeText}</b>${else}<i>${nodeText}</i>${/if}',
                },'#tree1');
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-text-content');
                    expect(li[0].querySelector('i')).not.toBe(null);
                    expect(li[0].querySelector('b')).toBe(null);
                    expect(li[1].querySelector('b')).not.toBe(null);
                    expect(li[1].querySelector('i')).toBe(null);
                    done();
                }, 450);
            });
            it('template support testing with script', (done: Function) => {
                let template: Element = createElement('div', { id: 'template' });
                template.innerHTML = '${if(nodeChild == undefined)}<b>${nodeText}</b>${else}<i>${nodeText}</i>${/if}';
                document.body.appendChild(template);    
                treeObj = new TreeView({ 
                    fields: { dataSource: hierarchicalData1, id: "nodeId", text: "nodeText", child: "nodeChild", expanded: 'nodeExpanded1' },
                    nodeTemplate: '#template',
                    allowEditing: true,
                },'#tree1');
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    let txt: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-text-content');
                    expect(txt[0].querySelector('i')).not.toBe(null);
                    expect(txt[0].querySelector('b')).toBe(null);
                    expect(txt[1].querySelector('b')).not.toBe(null);
                    expect(txt[1].querySelector('i')).toBe(null);
                    let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                    tapEvent.tapCount = 2;
                    mouseEventArgs.target = li[0].querySelector('.e-list-text');
                    treeObj.touchExpandObj.tap(tapEvent);
                    treeObj.touchEditObj.tap(tapEvent);
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function() {
                        expect(li[0].querySelector('.e-list-text').childElementCount).toBe(1);
                        expect(li[0].querySelector('.e-input').nodeName).toBe('INPUT');
                        expect((li[0].querySelector('.e-input') as HTMLInputElement).value).toBe('Music');
                        (li[0].querySelector('.e-input') as HTMLInputElement).value = 'Music node';
                        (li[0].querySelector('.e-input') as HTMLInputElement).blur();
                        expect(li[0].querySelector('.e-list-text').childElementCount).toBe(1);
                        expect((li[0].querySelector('.e-list-text') as HTMLElement).textContent).toBe('Music node');
                        mouseEventArgs.target = li[0].querySelector('.e-list-text');
                        treeObj.touchExpandObj.tap(tapEvent);
                        treeObj.touchEditObj.tap(tapEvent);
                        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                        setTimeout(function() {
                            expect((li[0].querySelector('.e-input') as HTMLInputElement).value).toBe('Music node');
                            (li[0].querySelector('.e-input') as HTMLInputElement).value = 'Music';
                            (li[0].querySelector('.e-input') as HTMLInputElement).blur();
                            expect(li[0].querySelector('.e-list-text').childElementCount).toBe(1);
                            expect((li[0].querySelector('.e-list-text') as HTMLElement).textContent).toBe('Music');
                            done();
                        }, 450);
                    }, 450);
                }, 450);
            });
            it('expandedNodes property testing with null value', (done: Function) => {
                treeObj = new TreeView({ 
                    fields: { dataSource: hierarchicalData },
                    expandedNodes: null
                },'#tree1');
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                    expect(li.length).toBe(10);
                    expect(treeObj.expandedNodes.length).toBe(2);
                    expect(treeObj.expandedNodes).not.toContain(null);
                    expect(treeObj.expandedNodes).toContain('23');
                    expect(treeObj.expandedNodes).toContain('24');
                    done();
                }, 450);
            });
            it('expandedNodes property testing', (done: Function) => {
                treeObj = new TreeView({ 
                    fields: { dataSource: hierarchicalData },
                    expandedNodes: ['16', '30', '31']
                },'#tree1');
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                    expect(li.length).toBe(7);
                    expect(treeObj.expandedNodes.length).toBe(1);
                    expect(treeObj.expandedNodes).not.toContain('30');
                    expect(treeObj.expandedNodes).not.toContain('31');
                    expect(treeObj.expandedNodes).not.toContain('23');
                    expect(treeObj.expandedNodes).not.toContain('24');
                    expect(treeObj.expandedNodes).toContain('16');
                    done();
                }, 450);
            });
            it('expandedNodes property testing with nested level', (done: Function) => {
                treeObj = new TreeView({ 
                    fields: { dataSource: hierarchicalData },
                    expandedNodes: ['16', '17']
                },'#tree1');
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                    expect(li.length).toBe(10);
                    expect(treeObj.expandedNodes.length).toBe(2);
                    expect(treeObj.expandedNodes).not.toContain('23');
                    expect(treeObj.expandedNodes).not.toContain('24');
                    expect(treeObj.expandedNodes).toContain('16');
                    expect(treeObj.expandedNodes).toContain('17');
                    done();
                }, 450);
            });
            it('expandedNodes property testing with set model', (done: Function) => {
                treeObj = new TreeView({ 
                    fields: { dataSource: hierarchicalData },
                    expandedNodes: ['16', '17']
                },'#tree1');
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                    expect(li.length).toBe(10);
                    expect(treeObj.expandedNodes.length).toBe(2);
                    expect(treeObj.expandedNodes).not.toContain('23');
                    expect(treeObj.expandedNodes).not.toContain('24');
                    expect(treeObj.expandedNodes).toContain('16');
                    expect(treeObj.expandedNodes).toContain('17');
                    treeObj.expandedNodes = null;
                    treeObj.dataBind();
                    expect(treeObj.expandedNodes.length).toBe(0);
                    expect(treeObj.expandedNodes).not.toContain(null);
                    expect(treeObj.expandedNodes).not.toContain('16');
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function() {
                        treeObj.expandedNodes = ['23', '24', '30', '31'];
                        treeObj.dataBind();
                        expect(treeObj.expandedNodes.length).toBe(2);
                        expect(treeObj.expandedNodes).toContain('23');
                        expect(treeObj.expandedNodes).toContain('24');
                        expect(treeObj.expandedNodes).not.toContain('16');
                        expect(treeObj.expandedNodes).not.toContain('17');
                        expect(treeObj.expandedNodes).not.toContain('30');
                        expect(treeObj.expandedNodes).not.toContain('31');
                        done();
                    }, 450);
                }, 450);
            });
            it('showCheckBox property testing full row navigation', (done: Function) => {
                treeObj = new TreeView({ 
                    fields: { dataSource: hierarchicalData2, id: 'id', text: 'name', child: 'subChild', iconCss: 'nodeIcon', imageUrl: 'nodeImage', navigateUrl: 'nodeUrl' },
                    showCheckBox: true,
                    fullRowNavigable: true
                },'#tree1');
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    let checkEle: Element = treeObj.element.querySelector("li");
                    expect(checkEle.children[1].children[0].classList.contains("e-icon-expandable")).toBe(true);
                    expect(checkEle.children[1].children[1].classList.contains("e-checkbox-wrapper") === true).toBe(true);
                    expect(checkEle.children[1].children[2].classList.contains("e-list-text") === true).toBe(true);
                    expect(checkEle.children[1].children[2].tagName === "A").toBe(true);
                    expect(checkEle.children[1].children[2].children[0].classList.contains("e-anchor-wrap")).toBe(true);
                    expect(checkEle.children[1].children[2].children[0].children[0].classList.contains("folder")).toBe(true);
                    expect(checkEle.children[1].children[2].children[0].children[1].tagName === "IMG").toBe(true);
                    treeObj.fullRowNavigable = false;
                    treeObj.dataBind();
                    setTimeout(function() {
                        let checkEle: Element = treeObj.element.querySelector("li");
                        expect(checkEle.children[1].children[0].classList.contains("e-icon-expandable")).toBe(true);
                        expect(checkEle.children[1].children[1].classList.contains("e-checkbox-wrapper") === true).toBe(true);
                        expect(checkEle.children[1].children[2].classList.contains("e-list-text") === true).toBe(false);
                        expect(checkEle.children[1].children[2].tagName === "A").toBe(false);                    
                        done();
                    }, 100);
                }, 100);
            });
        });
        describe('property change testing', () => {
            let treeObj: any;
            let mouseEventArgs: any;
            let tapEvent: any;
            beforeEach((): void => {
                mouseEventArgs = {
                    preventDefault: (): void => {},
                    stopImmediatePropagation: (): void => {},
                    target: null,
                    type: null,
                    shiftKey: false,
                    ctrlKey: false
                };
                tapEvent = {
                    originalEvent: mouseEventArgs,
                    tapCount: 1
                };
                let ele: HTMLElement = createElement('div', { id: 'tree1' });
                document.body.appendChild(ele);
                treeObj = new TreeView({ 
                    fields: { dataSource: hierarchicalData2, id: "nodeId", text: "nodeText", child: "nodeChild", selected: 'nodeSelected', navigateUrl: 'nodeUrl',
                        iconCss: 'nodeIcon', imageUrl: 'nodeImage', tooltip: 'nodeTooltip', htmlAttributes: 'nodeHtmlAttr' },
                    fullRowSelect: false,
                });
                treeObj.appendTo(ele);
            });
            afterEach(() => {
                if (treeObj)
                    treeObj.destroy();
                document.body.innerHTML = '';
            });
            it('dataSource property', () => {
                expect(treeObj.element.querySelectorAll('li').length).toBe(2);
                expect(treeObj.element.querySelector('.e-list-text').innerHTML).toBe('Music');
                expect(treeObj.element.querySelector('.e-list-item').getAttribute('data-uid')).toBe('01');
                expect(treeObj.element.querySelector('.e-list-icon').classList.contains('folder')).toBe(true);
                expect(treeObj.element.querySelector('.e-list-img').src.indexOf('images/Shooting.png')).not.toBe(-1);
                expect(treeObj.element.querySelector('.e-list-item').title).toBe('This is Music node');
                expect(treeObj.element.querySelectorAll('li')[1].classList.contains('firstnode')).toBe(true);
                expect(treeObj.element.querySelectorAll('li')[1].style.backgroundColor).toBe('red');
                treeObj.fields.dataSource = hierarchicalData1;
                treeObj.dataBind();
                expect(treeObj.element.querySelectorAll('li').length).toBe(5);
                expect(treeObj.element.querySelector('.e-list-text').innerHTML).toBe('Music');
                expect(treeObj.element.querySelector('.e-list-item').getAttribute('data-uid')).toBe('01');
                expect(treeObj.element.querySelector('.e-list-icon').classList.contains('folder')).toBe(true);
                expect(treeObj.element.querySelector('.e-list-img').src.indexOf('images/Shooting.png')).not.toBe(-1);
                expect(treeObj.element.querySelector('.e-list-item').title).toBe('This is Music node');
                expect(treeObj.element.querySelectorAll('li')[1].classList.contains('firstnode')).toBe(true);
                expect(treeObj.element.querySelectorAll('li')[1].style.backgroundColor).toBe('red');
            });
            it('fields text property', () => {
                expect(treeObj.element.querySelector('.e-list-text').innerHTML).toBe('Music');
                expect(treeObj.element.querySelector('.e-list-item').getAttribute('data-uid')).toBe('01');
                expect(treeObj.element.querySelector('.e-list-icon').classList.contains('folder')).toBe(true);
                expect(treeObj.element.querySelector('.e-list-img').src.indexOf('images/Shooting.png')).not.toBe(-1);
                expect(treeObj.element.querySelector('.e-list-item').title).toBe('This is Music node');
                expect(treeObj.element.querySelectorAll('li')[1].classList.contains('firstnode')).toBe(true);
                expect(treeObj.element.querySelectorAll('li')[1].style.backgroundColor).toBe('red');
                treeObj.fields = { text: 'subText' };
                treeObj.dataBind();
                expect(treeObj.element.querySelector('.e-list-text').innerHTML).toBe('Pictures');
                expect(treeObj.element.querySelector('.e-list-item').getAttribute('data-uid')).toBe('01');
                expect(treeObj.element.querySelector('.e-list-icon').classList.contains('folder')).toBe(true);
                expect(treeObj.element.querySelector('.e-list-img').src.indexOf('images/Shooting.png')).not.toBe(-1);
                expect(treeObj.element.querySelector('.e-list-item').title).toBe('This is Music node');
                expect(treeObj.element.querySelectorAll('li')[1].classList.contains('firstnode')).toBe(true);
                expect(treeObj.element.querySelectorAll('li')[1].style.backgroundColor).toBe('red');
            });
            it('fields id property', () => {
                expect(treeObj.element.querySelector('.e-list-text').innerHTML).toBe('Music');
                expect(treeObj.element.querySelector('.e-list-item').getAttribute('data-uid')).toBe('01');
                expect(treeObj.element.querySelector('.e-list-icon').classList.contains('folder')).toBe(true);
                expect(treeObj.element.querySelector('.e-list-img').src.indexOf('images/Shooting.png')).not.toBe(-1);
                expect(treeObj.element.querySelector('.e-list-item').title).toBe('This is Music node');
                expect(treeObj.element.querySelectorAll('li')[1].classList.contains('firstnode')).toBe(true);
                expect(treeObj.element.querySelectorAll('li')[1].style.backgroundColor).toBe('red');
                treeObj.fields = { id: 'subId' };
                treeObj.dataBind();
                expect(treeObj.element.querySelector('.e-list-text').innerHTML).toBe('Music');
                expect(treeObj.element.querySelector('.e-list-item').getAttribute('data-uid')).toBe('21');
                expect(treeObj.element.querySelector('.e-list-icon').classList.contains('folder')).toBe(true);
                expect(treeObj.element.querySelector('.e-list-img').src.indexOf('images/Shooting.png')).not.toBe(-1);
                expect(treeObj.element.querySelector('.e-list-item').title).toBe('This is Music node');
                expect(treeObj.element.querySelectorAll('li')[1].classList.contains('firstnode')).toBe(true);
                expect(treeObj.element.querySelectorAll('li')[1].style.backgroundColor).toBe('red');
            });
            it('fields child property', () => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                mouseEventArgs.target = li[0].querySelector('.e-icons');
                expect(li[0].childElementCount).toBe(1);
                treeObj.touchClickObj.tap(tapEvent);
                expect(li[0].childElementCount).toBe(2);
                expect(treeObj.element.querySelector('.e-list-text').innerHTML).toBe('Music');
                expect(treeObj.element.querySelector('.e-list-item').getAttribute('data-uid')).toBe('01');
                expect(li[0].querySelector('.e-list-parent').querySelector('.e-list-text').innerHTML).toBe('Wind.jpg');
                expect(li[0].querySelector('.e-list-parent').querySelector('.e-list-item').getAttribute('data-uid')).toBe('01-01');
                let cli: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                expect(cli[1].childElementCount).toBe(1);
                mouseEventArgs.target = cli[1].querySelector('.e-icons');
                treeObj.touchClickObj.tap(tapEvent);
                expect(cli[1].childElementCount).toBe(1);
                expect(cli[1].querySelector('.e-icons')).toBe(null);
                treeObj.fields = { child: "subChild" };
                treeObj.dataBind();
                let newli: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                mouseEventArgs.target = newli[0].querySelector('.e-icons');
                expect(newli[0].childElementCount).toBe(1);
                treeObj.touchClickObj.tap(tapEvent);
                expect(newli[0].childElementCount).toBe(2);
                expect(treeObj.element.querySelector('.e-list-text').innerHTML).toBe('Music');
                expect(treeObj.element.querySelector('.e-list-item').getAttribute('data-uid')).toBe('01');
                expect(newli[0].querySelector('.e-list-parent').querySelector('.e-list-text').innerHTML).toBe('Gouttes.jpg');
                expect(newli[0].querySelector('.e-list-parent').querySelector('.e-list-item').getAttribute('data-uid')).toBe('21-01');
                let dli: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                expect(dli[1].childElementCount).toBe(1);
                mouseEventArgs.target = dli[1].querySelector('.e-icons');
                treeObj.touchClickObj.tap(tapEvent);
                expect(dli[1].childElementCount).toBe(1);
                expect(cli[1].querySelector('.e-icons')).toBe(null);
            });
            it('fields iconCss property', () => {
                expect(treeObj.element.querySelector('.e-list-text').innerHTML).toBe('Music');
                expect(treeObj.element.querySelector('.e-list-item').getAttribute('data-uid')).toBe('01');
                expect(treeObj.element.querySelector('.e-list-icon').classList.contains('folder')).toBe(true);
                expect(treeObj.element.querySelector('.e-list-img').src.indexOf('images/Shooting.png')).not.toBe(-1);
                expect(treeObj.element.querySelector('.e-list-item').title).toBe('This is Music node');
                expect(treeObj.element.querySelectorAll('li')[1].classList.contains('firstnode')).toBe(true);
                expect(treeObj.element.querySelectorAll('li')[1].style.backgroundColor).toBe('red');
                treeObj.fields = { iconCss: 'subIcon' };
                treeObj.dataBind();
                expect(treeObj.element.querySelector('.e-list-text').innerHTML).toBe('Music');
                expect(treeObj.element.querySelector('.e-list-item').getAttribute('data-uid')).toBe('01');
                expect(treeObj.element.querySelector('.e-list-icon').classList.contains('file')).toBe(true);
                expect(treeObj.element.querySelector('.e-list-img').src.indexOf('images/Shooting.png')).not.toBe(-1);
                expect(treeObj.element.querySelector('.e-list-item').title).toBe('This is Music node');
                expect(treeObj.element.querySelectorAll('li')[1].classList.contains('firstnode')).toBe(true);
                expect(treeObj.element.querySelectorAll('li')[1].style.backgroundColor).toBe('red');
            });
            it('fields imageUrl property', () => {
                expect(treeObj.element.querySelector('.e-list-text').innerHTML).toBe('Music');
                expect(treeObj.element.querySelector('.e-list-item').getAttribute('data-uid')).toBe('01');
                expect(treeObj.element.querySelector('.e-list-icon').classList.contains('folder')).toBe(true);
                expect(treeObj.element.querySelector('.e-list-img').src.indexOf('images/Shooting.png')).not.toBe(-1);
                expect(treeObj.element.querySelector('.e-list-item').title).toBe('This is Music node');
                expect(treeObj.element.querySelectorAll('li')[1].classList.contains('firstnode')).toBe(true);
                expect(treeObj.element.querySelectorAll('li')[1].style.backgroundColor).toBe('red');
                treeObj.fields = { imageUrl: 'subImage' };
                treeObj.dataBind();
                expect(treeObj.element.querySelector('.e-list-text').innerHTML).toBe('Music');
                expect(treeObj.element.querySelector('.e-list-item').getAttribute('data-uid')).toBe('01');
                expect(treeObj.element.querySelector('.e-list-icon').classList.contains('folder')).toBe(true);
                expect(treeObj.element.querySelector('.e-list-img').src.indexOf('images/Cricket.png')).not.toBe(-1);
                expect(treeObj.element.querySelector('.e-list-item').title).toBe('This is Music node');
                expect(treeObj.element.querySelectorAll('li')[1].classList.contains('firstnode')).toBe(true);
                expect(treeObj.element.querySelectorAll('li')[1].style.backgroundColor).toBe('red');
            });
            it('fields tooltip property', () => {
                expect(treeObj.element.querySelector('.e-list-text').innerHTML).toBe('Music');
                expect(treeObj.element.querySelector('.e-list-item').getAttribute('data-uid')).toBe('01');
                expect(treeObj.element.querySelector('.e-list-icon').classList.contains('folder')).toBe(true);
                expect(treeObj.element.querySelector('.e-list-img').src.indexOf('images/Shooting.png')).not.toBe(-1);
                expect(treeObj.element.querySelector('.e-list-item').title).toBe('This is Music node');
                expect(treeObj.element.querySelectorAll('li')[1].classList.contains('firstnode')).toBe(true);
                expect(treeObj.element.querySelectorAll('li')[1].style.backgroundColor).toBe('red');
                treeObj.fields = { tooltip: 'subTooltip' };
                treeObj.dataBind();
                expect(treeObj.element.querySelector('.e-list-text').innerHTML).toBe('Music');
                expect(treeObj.element.querySelector('.e-list-item').getAttribute('data-uid')).toBe('01');
                expect(treeObj.element.querySelector('.e-list-icon').classList.contains('folder')).toBe(true);
                expect(treeObj.element.querySelector('.e-list-img').src.indexOf('images/Shooting.png')).not.toBe(-1);
                expect(treeObj.element.querySelector('.e-list-item').title).toBe('This is Pictures node');
                expect(treeObj.element.querySelectorAll('li')[1].classList.contains('firstnode')).toBe(true);
                expect(treeObj.element.querySelectorAll('li')[1].style.backgroundColor).toBe('red');
            });
            it('fields htmlAttributes property', () => {
                expect(treeObj.element.querySelector('.e-list-text').innerHTML).toBe('Music');
                expect(treeObj.element.querySelector('.e-list-item').getAttribute('data-uid')).toBe('01');
                expect(treeObj.element.querySelector('.e-list-icon').classList.contains('folder')).toBe(true);
                expect(treeObj.element.querySelector('.e-list-img').src.indexOf('images/Shooting.png')).not.toBe(-1);
                expect(treeObj.element.querySelector('.e-list-item').title).toBe('This is Music node');
                expect(treeObj.element.querySelectorAll('li')[1].classList.contains('firstnode')).toBe(true);
                expect(treeObj.element.querySelectorAll('li')[1].style.backgroundColor).toBe('red');
                treeObj.fields = { htmlAttributes: 'subHtmlAttr' };
                treeObj.dataBind();
                expect(treeObj.element.querySelector('.e-list-text').innerHTML).toBe('Music');
                expect(treeObj.element.querySelector('.e-list-item').getAttribute('data-uid')).toBe('01');
                expect(treeObj.element.querySelector('.e-list-icon').classList.contains('folder')).toBe(true);
                expect(treeObj.element.querySelector('.e-list-img').src.indexOf('images/Shooting.png')).not.toBe(-1);
                expect(treeObj.element.querySelector('.e-list-item').title).toBe('This is Music node');
                expect(treeObj.element.querySelectorAll('li')[1].classList.contains('customnode')).toBe(true);
                expect(treeObj.element.querySelectorAll('li')[1].style.backgroundColor).toBe('blue');
            });
            it('fields expanded property', () => {
                expect(treeObj.element.querySelectorAll('li').length).toBe(2);
                expect(treeObj.element.querySelector('.e-list-text').innerHTML).toBe('Music');
                expect(treeObj.element.querySelector('.e-list-item').getAttribute('data-uid')).toBe('01');
                expect(treeObj.element.querySelector('.e-list-icon').classList.contains('folder')).toBe(true);
                expect(treeObj.element.querySelector('.e-list-img').src.indexOf('images/Shooting.png')).not.toBe(-1);
                expect(treeObj.element.querySelector('.e-list-item').title).toBe('This is Music node');
                expect(treeObj.element.querySelectorAll('li')[1].classList.contains('firstnode')).toBe(true);
                expect(treeObj.element.querySelectorAll('li')[1].style.backgroundColor).toBe('red');
                treeObj.fields = { expanded: 'subExpanded' };
                treeObj.dataBind();
                expect(treeObj.element.querySelectorAll('li').length).toBe(3);
                expect(treeObj.element.querySelectorAll('li')[0].childElementCount).toBe(2);
                expect(treeObj.element.querySelector('.e-list-text').innerHTML).toBe('Music');
                expect(treeObj.element.querySelector('.e-list-item').getAttribute('data-uid')).toBe('01');
                expect(treeObj.element.querySelector('.e-list-icon').classList.contains('folder')).toBe(true);
                expect(treeObj.element.querySelector('.e-list-img').src.indexOf('images/Shooting.png')).not.toBe(-1);
                expect(treeObj.element.querySelector('.e-list-item').title).toBe('This is Music node');
                expect(treeObj.element.querySelectorAll('li')[2].classList.contains('firstnode')).toBe(true);
                expect(treeObj.element.querySelectorAll('li')[2].style.backgroundColor).toBe('red');
            });
            it('fields selected property', () => {
                expect(treeObj.element.querySelectorAll('li').length).toBe(2);
                expect(treeObj.element.querySelector('.e-list-text').innerHTML).toBe('Music');
                expect(treeObj.element.querySelector('.e-list-item').getAttribute('data-uid')).toBe('01');
                expect(treeObj.element.querySelector('.e-list-icon').classList.contains('folder')).toBe(true);
                expect(treeObj.element.querySelector('.e-list-img').src.indexOf('images/Shooting.png')).not.toBe(-1);
                expect(treeObj.element.querySelector('.e-list-item').title).toBe('This is Music node');
                expect(treeObj.element.querySelector('.e-list-item').classList.contains('e-active')).toBe(true);
                expect(treeObj.element.querySelectorAll('li')[1].classList.contains('e-active')).toBe(false);
                expect(treeObj.element.querySelectorAll('li')[1].classList.contains('firstnode')).toBe(true);
                expect(treeObj.element.querySelectorAll('li')[1].style.backgroundColor).toBe('red');
                treeObj.fields = { selected: 'subSelected' };
                treeObj.dataBind();
                expect(treeObj.element.querySelectorAll('li').length).toBe(2);
                expect(treeObj.element.querySelector('.e-list-text').innerHTML).toBe('Music');
                expect(treeObj.element.querySelector('.e-list-item').getAttribute('data-uid')).toBe('01');
                expect(treeObj.element.querySelector('.e-list-icon').classList.contains('folder')).toBe(true);
                expect(treeObj.element.querySelector('.e-list-img').src.indexOf('images/Shooting.png')).not.toBe(-1);
                expect(treeObj.element.querySelector('.e-list-item').title).toBe('This is Music node');
                expect(treeObj.element.querySelector('.e-list-item').classList.contains('e-active')).toBe(false);
                expect(treeObj.element.querySelectorAll('li')[1].classList.contains('e-active')).toBe(true);
                expect(treeObj.element.querySelectorAll('li')[1].classList.contains('firstnode')).toBe(true);
                expect(treeObj.element.querySelectorAll('li')[1].style.backgroundColor).toBe('red');
            });
            it('fields url property', () => {
                expect(treeObj.element.querySelector('.e-list-text').innerHTML).toBe('Music');
                expect(treeObj.element.querySelector('.e-list-item').getAttribute('data-uid')).toBe('01');
                expect(treeObj.element.querySelector('.e-list-icon').classList.contains('folder')).toBe(true);
                expect(treeObj.element.querySelector('.e-list-img').src.indexOf('images/Shooting.png')).not.toBe(-1);
                expect(treeObj.element.querySelector('.e-list-item').title).toBe('This is Music node');
                expect(treeObj.element.querySelectorAll('li')[1].classList.contains('firstnode')).toBe(true);
                expect(treeObj.element.querySelectorAll('li')[1].style.backgroundColor).toBe('red');
                expect(treeObj.element.querySelector('.e-list-url').href.indexOf('http://npmci.syncfusion.com/')).not.toBe(-1);
                treeObj.fields = { navigateUrl: 'subUrl' };
                treeObj.dataBind();
                expect(treeObj.element.querySelector('.e-list-text').innerHTML).toBe('Music');
                expect(treeObj.element.querySelector('.e-list-item').getAttribute('data-uid')).toBe('01');
                expect(treeObj.element.querySelector('.e-list-icon').classList.contains('folder')).toBe(true);
                expect(treeObj.element.querySelector('.e-list-img').src.indexOf('images/Shooting.png')).not.toBe(-1);
                expect(treeObj.element.querySelector('.e-list-item').title).toBe('This is Music node');
                expect(treeObj.element.querySelectorAll('li')[1].classList.contains('firstnode')).toBe(true);
                expect(treeObj.element.querySelectorAll('li')[1].style.backgroundColor).toBe('red');
                expect(treeObj.element.querySelector('.e-list-url').href.indexOf('http://npmci.syncfusion.com/')).toBe(-1);
                expect(treeObj.element.querySelector('.e-list-url').href.indexOf('http://ej2.syncfusion.com/demos/')).not.toBe(-1);
            });
            it('expandOn property testing', (done: Function) => {
                treeObj.expandOn = 'Click';
                treeObj.dataBind();
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                mouseEventArgs.target = li[0].querySelector('.e-list-text');
                expect((li[0].querySelector('.e-icons') as Element).classList.contains('e-icon-expandable')).toBe(true);
                expect((li[0].querySelector('.e-icons') as Element).classList.contains('e-icon-collapsible')).toBe(false);
                expect(li[0].childElementCount).toBe(1);
                treeObj.touchExpandObj.tap(tapEvent);
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    expect((li[0].querySelector('.e-icons') as Element).classList.contains('e-icon-expandable')).toBe(false);
                    expect((li[0].querySelector('.e-icons') as Element).classList.contains('e-icon-collapsible')).toBe(true);
                    expect(li[0].childElementCount).toBe(2);
                    expect(li[0].getAttribute('aria-expanded')).toBe('true');
                    treeObj.touchExpandObj.tap(tapEvent);
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function() {
                        expect((li[0].querySelector('.e-icons') as Element).classList.contains('e-icon-expandable')).toBe(true);
                        expect((li[0].querySelector('.e-icons') as Element).classList.contains('e-icon-collapsible')).toBe(false);
                        expect(li[0].getAttribute('aria-expanded')).toBe('false');
                        expect((li[0]).classList.contains('e-node-collapsed')).toBe(true);
                        treeObj.touchExpandObj.tap(tapEvent);
                        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                        setTimeout(function() {
                            expect((li[0].querySelector('.e-icons') as Element).classList.contains('e-icon-expandable')).toBe(false);
                            expect((li[0].querySelector('.e-icons') as Element).classList.contains('e-icon-collapsible')).toBe(true);
                            expect(li[0].getAttribute('aria-expanded')).toBe('true');                    
                            expect((li[0]).classList.contains('e-node-collapsed')).toBe(false);                  
                            let newli: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                            expect(newli[1].querySelector('.e-icons')).toBe(null);
                            expect(newli[1].childElementCount).toBe(1);
                            expect(newli[1].getAttribute('aria-expanded')).toBe(null);
                            done();
                        }, 450);
                    }, 450);
                }, 450);
            });
            it('expandOn property testing', (done: Function) => {
                treeObj.expandOn = 'None';
                treeObj.dataBind();
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                mouseEventArgs.target = li[0].querySelector('.e-list-text');
                expect((li[0].querySelector('.e-icons') as Element).classList.contains('e-icon-expandable')).toBe(true);
                expect((li[0].querySelector('.e-icons') as Element).classList.contains('e-icon-collapsible')).toBe(false);
                treeObj.touchExpandObj.tap(tapEvent);
                setTimeout(function() {
                    expect((li[0].querySelector('.e-icons') as Element).classList.contains('e-icon-expandable')).toBe(true);
                    expect((li[0].querySelector('.e-icons') as Element).classList.contains('e-icon-collapsible')).toBe(false);
                    done();
                 }, 100);
            });
            it('cssClass property testing', () => {
                treeObj.cssClass = 'customTree productTree';
                treeObj.dataBind();
                expect(document.getElementById('tree1').classList.contains('customTree')).toEqual(true);
                expect(document.getElementById('tree1').classList.contains('productTree')).toEqual(true);
                expect(document.getElementById('tree1').classList.contains('dynamicTree')).toEqual(false);
                expect(document.getElementById('tree1').classList.contains('demoTree')).toEqual(false);
                treeObj.cssClass = 'dynamicTree demoTree';
                treeObj.dataBind();
                expect(document.getElementById('tree1').classList.contains('customTree')).toEqual(false);
                expect(document.getElementById('tree1').classList.contains('productTree')).toEqual(false);
                expect(document.getElementById('tree1').classList.contains('dynamicTree')).toEqual(true);
                expect(document.getElementById('tree1').classList.contains('demoTree')).toEqual(true);
                treeObj.cssClass = '';
                treeObj.dataBind();
                expect(document.getElementById('tree1').classList.contains('dynamicTree')).toEqual(false);
                expect(document.getElementById('tree1').classList.contains('demoTree')).toEqual(false);
            });
            it('selectedNodes property testing', () => {
                expect(treeObj.element.querySelector('.e-list-item').classList.contains('e-active')).toBe(true);
                expect(treeObj.element.querySelectorAll('li')[1].classList.contains('e-active')).toBe(false);
                treeObj.selectedNodes = ['02'];
                treeObj.dataBind();
                expect(treeObj.element.querySelector('.e-list-item').classList.contains('e-active')).toBe(false);
                expect(treeObj.element.querySelectorAll('li')[1].classList.contains('e-active')).toBe(true);
            });
            it('sortOrder property testing', (done: Function) => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                expect(li.length).toBe(2);
                expect(li[0].querySelector('.e-list-text').innerHTML).toBe('Music');
                expect(li[0].getAttribute('data-uid')).toBe('01');
                treeObj.sortOrder = 'Ascending';
                treeObj.dataBind();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    let li1: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                    expect(li1.length).toBe(2);
                    expect(li1[0].querySelector('.e-list-text').innerHTML).toBe('Downloads');
                    expect(li1[0].getAttribute('data-uid')).toBe('02');
                    treeObj.sortOrder = 'Descending';
                    treeObj.dataBind();
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function() {
                        let li2: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                        expect(li2.length).toBe(2);
                        expect(li2[0].querySelector('.e-list-text').innerHTML).toBe('Music');
                        expect(li2[0].getAttribute('data-uid')).toBe('01');
                        treeObj.sortOrder = 'Ascending';
                        treeObj.dataBind();
                        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                        setTimeout(function() {
                            let li3: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                            expect(li3.length).toBe(2);
                            expect(li3[0].querySelector('.e-list-text').innerHTML).toBe('Downloads');
                            expect(li3[0].getAttribute('data-uid')).toBe('02');
                            treeObj.sortOrder = 'None';
                            treeObj.dataBind();
                            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                            setTimeout(function() {
                                let li4: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                                expect(li4.length).toBe(2);
                                expect(li4[0].querySelector('.e-list-text').innerHTML).toBe('Music');
                                expect(li4[0].getAttribute('data-uid')).toBe('01');
                                done();
                            }, 100);
                        }, 100);
                    }, 100);
                }, 100);
            });
            it('allowEditing property testing', (done: Function) => {
                treeObj.allowEditing = true;
                treeObj.dataBind();
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                expect(li[0].querySelector('.e-icons').classList.contains('e-icon-expandable')).toBe(true);
                expect(li[0].querySelector('.e-icons').classList.contains('e-icon-collapsible')).toBe(false);
                expect(li[0].childElementCount).toBe(1);
                expect(li[0].querySelector('.e-list-text').childElementCount).toBe(0);
                tapEvent.tapCount = 2;
                mouseEventArgs.target = li[0].querySelector('.e-list-text');
                treeObj.touchExpandObj.tap(tapEvent);
                treeObj.touchEditObj.tap(tapEvent);
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    expect(li[0].querySelector('.e-icons').classList.contains('e-icon-expandable')).toBe(false);
                    expect(li[0].querySelector('.e-icons').classList.contains('e-icon-collapsible')).toBe(true);
                    expect(li[0].childElementCount).toBe(2);
                    expect(li[0].querySelector('.e-list-text').childElementCount).toBe(1);
                    expect(li[0].querySelector('.e-input').nodeName).toBe('INPUT');
                    expect((li[0].querySelector('.e-input') as HTMLInputElement).value).toBe('Music');
                    (li[0].querySelector('.e-input') as HTMLInputElement).value = 'Music node';
                    (li[0].querySelector('.e-input') as HTMLInputElement).blur();
                    expect(li[0].querySelector('.e-list-text').childElementCount).toBe(0);
                    expect((li[0].querySelector('.e-list-text') as HTMLElement).childNodes[0].nodeValue).toBe('Music node');
                    mouseEventArgs.target = li[0].querySelector('.e-list-text');
                    treeObj.touchExpandObj.tap(tapEvent);
                    treeObj.touchEditObj.tap(tapEvent);
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function() {
                        expect((li[0].querySelector('.e-input') as HTMLInputElement).value).toBe('Music node');
                        (li[0].querySelector('.e-input') as HTMLInputElement).value = 'Music';
                        (li[0].querySelector('.e-input') as HTMLInputElement).blur();
                        expect(li[0].querySelector('.e-list-text').childElementCount).toBe(0);
                        expect((li[0].querySelector('.e-list-text') as HTMLElement).childNodes[0].nodeValue).toBe('Music');
                        treeObj.allowEditing = false;
                        treeObj.dataBind();
                        mouseEventArgs.target = li[0].querySelector('.e-list-text');
                        treeObj.touchExpandObj.tap(tapEvent);
                        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                        setTimeout(function() {
                            expect(li[0].querySelector('.e-icons').classList.contains('e-icon-expandable')).toBe(false);
                            expect(li[0].querySelector('.e-icons').classList.contains('e-icon-collapsible')).toBe(true);
                            expect(li[0].childElementCount).toBe(2);
                            expect(li[0].querySelector('.e-list-text').childElementCount).toBe(0);
                            done();
                        }, 450);
                    }, 450);
                }, 450);
            });
            it('enableRtl property testing', () => {
                expect(document.getElementById('tree1').classList.contains('e-rtl')).toEqual(false);
                treeObj.enableRtl = true;
                treeObj.dataBind();
                expect(document.getElementById('tree1').classList.contains('e-rtl')).toEqual(true);
                treeObj.enableRtl = false;
                treeObj.dataBind();
                expect(document.getElementById('tree1').classList.contains('e-rtl')).toEqual(false);
            });
            it('allowDragAndDrop property testing', () => {
                expect(treeObj.dragObj).toBe(undefined);
                expect(treeObj.dropObj).toBe(undefined);
                treeObj.allowDragAndDrop = true;
                treeObj.dataBind();
                expect(treeObj.dragObj.isDestroyed).toBe(false);
                expect(treeObj.dropObj.isDestroyed).toBe(false);
                treeObj.allowDragAndDrop = false;
                treeObj.dataBind();
                expect(treeObj.dragObj.isDestroyed).toBe(true);
                expect(treeObj.dropObj.isDestroyed).toBe(true);
            });
            it('fullRowSelect property testing', () => {
                expect(document.getElementById('tree1').classList.contains('e-fullrow-wrap')).toEqual(false);
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                expect(li[0].childElementCount).toBe(1);
                treeObj.fullRowSelect = true;
                treeObj.dataBind();
                expect(document.getElementById('tree1').classList.contains('e-fullrow-wrap')).toEqual(true);
                let newli: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                expect(newli[0].childElementCount).toBe(2);
                treeObj.fullRowSelect = false;
                treeObj.dataBind();
                expect(document.getElementById('tree1').classList.contains('e-fullrow-wrap')).toEqual(false);
                let cusli: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                expect(cusli[0].childElementCount).toBe(1);
                treeObj.fullRowSelect = true;
                treeObj.dataBind();
                expect(document.getElementById('tree1').classList.contains('e-fullrow-wrap')).toEqual(true);
            });
            it('allowMultiSelection property testing', () => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                expect(li[0].classList.contains('e-active')).toBe(true);
                expect(li[1].classList.contains('e-active')).toBe(false);
                expect(treeObj.selectedNodes.length).toBe(1);
                expect(treeObj.selectedNodes).toContain('01');
                treeObj.allowMultiSelection = true;
                treeObj.dataBind();
                mouseEventArgs.ctrlKey = true;
                mouseEventArgs.target = li[1].querySelector('.e-list-text');
                treeObj.touchClickObj.tap(tapEvent);
                expect(li[0].classList.contains('e-active')).toBe(true);
                expect(li[1].classList.contains('e-active')).toBe(true);
                expect(treeObj.selectedNodes.length).toBe(2);
                expect(treeObj.selectedNodes).toContain('01');
                expect(treeObj.selectedNodes).toContain('02');
                treeObj.allowMultiSelection = false;
                treeObj.dataBind();
                expect(li[0].classList.contains('e-active')).toBe(true);
                expect(li[1].classList.contains('e-active')).toBe(false);
                expect(treeObj.selectedNodes.length).toBe(1);
                expect(treeObj.selectedNodes).toContain('01');
                expect(treeObj.selectedNodes).not.toContain('02');
            });
            it('nodeTemplate property testing', () => {
                let template: Element = createElement('div', { id: 'template' });
                template.innerHTML = '${if(nodeChild == undefined)}<b>${nodeText}</b>${else}<i>${nodeText}</i>${/if}';
                document.body.appendChild(template);
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-text-content');
                expect(li[0].querySelector('i')).toBe(null);
                expect(li[0].querySelector('b')).toBe(null);
                treeObj.nodeTemplate = 'template';
                treeObj.dataBind();
                let nli: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-text-content');
                expect(nli[0].querySelector('i')).toBe(null);
                expect(nli[0].querySelector('b')).toBe(null);
                treeObj.nodeTemplate = null;
                treeObj.dataBind();
                let mli: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-text-content');
                expect(mli[0].querySelector('i')).toBe(null);
                expect(mli[0].querySelector('b')).toBe(null);
                treeObj.nodeTemplate = '#template';
                treeObj.dataBind();
                let ali: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-text-content');
                expect(ali[0].querySelector('i')).not.toBe(null);
                expect(ali[0].querySelector('b')).toBe(null);
                treeObj.nodeTemplate = '${if(nodeChild == undefined)}<b>${nodeText}</b>${else}<i>${nodeText}</i>${/if}';
                treeObj.dataBind();
                let bli: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-text-content');
                expect(bli[0].querySelector('i')).not.toBe(null);
                expect(bli[0].querySelector('b')).toBe(null);
            });
            it('dataSource with null and empty', () => {
                expect(treeObj.element.querySelectorAll('li').length).toBe(2);
                treeObj.fields.dataSource = null;
                treeObj.dataBind();
                expect(treeObj.element.querySelectorAll('li').length).toBe(0);
                treeObj.fields.dataSource = [];
                treeObj.dataBind();
                expect(treeObj.element.querySelectorAll('li').length).toBe(0);
            });
        });
        describe('mouse events testing', () => {
            let mouseEventArgs: any;
            let tapEvent: any;
            let treeObj: any;
            let ele: HTMLElement = createElement('div', { id: 'tree1' });
            beforeEach((): void => {
                mouseEventArgs = {
                    preventDefault: (): void => {},
                    stopImmediatePropagation: (): void => {},
                    target: null,
                    type: null,
                    shiftKey: false,
                    ctrlKey: false,
                    originalEvent: { target: null }
                };
                tapEvent = {
                    originalEvent: mouseEventArgs,
                    tapCount: 1
                };
            });
            beforeAll(() => {
                document.body.appendChild(ele);
                treeObj = new TreeView({ 
                    fields: { dataSource: hierarchicalData1, id: "nodeId", text: "nodeText", child:"nodeChild" },
                    fullRowSelect: false,
                });
                treeObj.appendTo(ele);
            });
            afterAll(() => {
                if (treeObj)
                    treeObj.destroy();
                document.body.innerHTML = '';
            });
            it('mouse click on expand/collapse icon', (done: Function) => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                mouseEventArgs.target = li[3].querySelector('.e-icons');
                expect((li[3].querySelector('.e-icons') as Element).classList.contains('e-icon-expandable')).toBe(true);
                expect((li[3].querySelector('.e-icons') as Element).classList.contains('e-icon-collapsible')).toBe(false);
                expect(li[3].childElementCount).toBe(1);
                expect(treeObj.element.querySelectorAll('[aria-expanded="true"]').length).toBe(0);
                expect(treeObj.expandedNodes.length).toBe(0);
                treeObj.touchClickObj.tap(tapEvent);
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    expect((li[3].querySelector('.e-icons') as Element).classList.contains('e-icon-expandable')).toBe(false);
                    expect((li[3].querySelector('.e-icons') as Element).classList.contains('e-icon-collapsible')).toBe(true);
                    expect(li[3].childElementCount).toBe(2);
                    expect(li[3].getAttribute('aria-expanded')).toBe('true');
                    expect(treeObj.expandedNodes.length).toBe(1);
                    treeObj.touchClickObj.tap(tapEvent);
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function() {
                        expect((li[3].querySelector('.e-icons') as Element).classList.contains('e-icon-expandable')).toBe(true);
                        expect((li[3].querySelector('.e-icons') as Element).classList.contains('e-icon-collapsible')).toBe(false);
                        expect(li[3].getAttribute('aria-expanded')).toBe('false');
                        expect(treeObj.expandedNodes.length).toBe(0);
                        treeObj.touchClickObj.tap(tapEvent);
                        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                        setTimeout(function() {
                            expect((li[3].querySelector('.e-icons') as Element).classList.contains('e-icon-expandable')).toBe(false);
                            expect((li[3].querySelector('.e-icons') as Element).classList.contains('e-icon-collapsible')).toBe(true);
                            expect(li[3].getAttribute('aria-expanded')).toBe('true');
                            expect(treeObj.expandedNodes.length).toBe(1);
                            let newli: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                            mouseEventArgs.target = newli[4].querySelector('.e-icons');
                            expect((newli[4].querySelector('.e-icons') as Element).classList.contains('e-icon-expandable')).toBe(true);
                            expect((newli[4].querySelector('.e-icons') as Element).classList.contains('e-icon-collapsible')).toBe(false);
                            expect(newli[4].childElementCount).toBe(1);
                            treeObj.touchClickObj.tap(tapEvent);
                            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                            setTimeout(function() {
                                expect((newli[4].querySelector('.e-icons') as Element).classList.contains('e-icon-expandable')).toBe(false);
                                expect((newli[4].querySelector('.e-icons') as Element).classList.contains('e-icon-collapsible')).toBe(true);
                                expect(newli[4].childElementCount).toBe(2);
                                expect(li[3].getAttribute('aria-expanded')).toBe('true');
                                expect(newli[4].getAttribute('aria-expanded')).toBe('true');
                                expect(treeObj.expandedNodes.length).toBe(2);
                                treeObj.touchClickObj.tap(tapEvent);
                                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                                setTimeout(function() {
                                    expect((newli[4].querySelector('.e-icons') as Element).classList.contains('e-icon-expandable')).toBe(true);
                                    expect((newli[4].querySelector('.e-icons') as Element).classList.contains('e-icon-collapsible')).toBe(false);
                                    expect(newli[4].getAttribute('aria-expanded')).toBe('false');
                                    expect(treeObj.expandedNodes.length).toBe(1);
                                    done();
                                }, 450);
                            }, 450);
                        }, 450);
                    }, 450);
                }, 450);
            });
            it('mouse click on text', () => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                mouseEventArgs.target = li[1].querySelector('.e-text-content');
                expect((li[1] as Element).classList.contains('e-active')).toBe(false);
                expect(treeObj.element.querySelectorAll('[aria-selected]').length).toBe(0);
                treeObj.touchClickObj.tap(tapEvent);
                expect((li[1] as Element).classList.contains('e-active')).toBe(true);
                expect(treeObj.element.querySelectorAll('[aria-selected]').length).toBe(1);
                expect(li[1].getAttribute('aria-selected')).toBe('true');
                mouseEventArgs.target = li[0].querySelector('.e-text-content');
                expect((li[0] as Element).classList.contains('e-active')).toBe(false);            
                treeObj.touchClickObj.tap(tapEvent);
                expect((li[1] as Element).classList.contains('e-active')).toBe(false);
                expect((li[0] as Element).classList.contains('e-active')).toBe(true);
                expect(treeObj.element.querySelectorAll('[aria-selected]').length).toBe(1);
                expect(li[0].getAttribute('aria-selected')).toBe('true');
            });
            it('mouse click on ul', () => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                let ul: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('ul');
                mouseEventArgs.target = ul[0];
                expect((li[0] as Element).classList.contains('e-active')).toBe(true);
                treeObj.touchClickObj.tap(tapEvent);
                expect((li[0] as Element).classList.contains('e-active')).toBe(true);
                expect(treeObj.element.querySelectorAll('[aria-selected]').length).toBe(1);
                expect(li[0].getAttribute('aria-selected')).toBe('true');
                mouseEventArgs.target = ul[1];
                treeObj.touchClickObj.tap(tapEvent);
                expect((li[0] as Element).classList.contains('e-active')).toBe(true);
                expect((li[3] as Element).classList.contains('e-active')).toBe(false);
                expect(treeObj.element.querySelectorAll('[aria-selected]').length).toBe(1);
                expect(li[0].getAttribute('aria-selected')).toBe('true');
            });
            it('mouse double click on text', (done: Function) => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                mouseEventArgs.target = li[12].querySelector('.e-list-text');
                expect((li[12].querySelector('.e-icons') as Element).classList.contains('e-icon-expandable')).toBe(true);
                expect((li[12].querySelector('.e-icons') as Element).classList.contains('e-icon-collapsible')).toBe(false);
                expect(li[12].childElementCount).toBe(1);
                expect(treeObj.expandedNodes.length).toBe(1);
                tapEvent.tapCount = 2;
                treeObj.touchExpandObj.tap(tapEvent);
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    expect((li[12].querySelector('.e-icons') as Element).classList.contains('e-icon-expandable')).toBe(false);
                    expect((li[12].querySelector('.e-icons') as Element).classList.contains('e-icon-collapsible')).toBe(true);
                    expect(li[12].childElementCount).toBe(2);
                    expect(li[12].getAttribute('aria-expanded')).toBe('true');
                    expect(treeObj.expandedNodes.length).toBe(2);
                    treeObj.touchExpandObj.tap(tapEvent);
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function() {
                        expect((li[12].querySelector('.e-icons') as Element).classList.contains('e-icon-expandable')).toBe(true);
                        expect((li[12].querySelector('.e-icons') as Element).classList.contains('e-icon-collapsible')).toBe(false);
                        expect(li[12].getAttribute('aria-expanded')).toBe('false');
                        expect(treeObj.expandedNodes.length).toBe(1);
                        treeObj.touchExpandObj.tap(tapEvent);
                        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                        setTimeout(function() {
                            expect((li[12].querySelector('.e-icons') as Element).classList.contains('e-icon-expandable')).toBe(false);
                            expect((li[12].querySelector('.e-icons') as Element).classList.contains('e-icon-collapsible')).toBe(true);
                            expect(li[12].getAttribute('aria-expanded')).toBe('true');
                            expect(treeObj.expandedNodes.length).toBe(2);
                            let newli: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                            mouseEventArgs.target = newli[13].querySelector('.e-list-text');
                            expect(newli[13].querySelector('.e-icons')).toBe(null);
                            expect(newli[13].childElementCount).toBe(1);
                            treeObj.touchExpandObj.tap(tapEvent);
                            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                            setTimeout(function() {
                                expect(newli[13].querySelector('.e-icons')).toBe(null);
                                expect(newli[13].childElementCount).toBe(1);
                                expect(newli[13].getAttribute('aria-expanded')).toBe(null);
                                expect(treeObj.expandedNodes.length).toBe(2);
                                mouseEventArgs.target = newli[12].querySelector('.e-icons');
                                treeObj.touchExpandObj.tap(tapEvent);
                                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                                setTimeout(function() {
                                    expect((newli[12].querySelector('.e-icons') as Element).classList.contains('e-icon-expandable')).toBe(false);
                                    expect((newli[12].querySelector('.e-icons') as Element).classList.contains('e-icon-collapsible')).toBe(true);
                                    expect(newli[12].getAttribute('aria-expanded')).toBe('true');
                                    expect(treeObj.expandedNodes.length).toBe(2);
                                    done();
                                }, 450);
                            }, 450);
                        }, 450);
                    }, 450);
                }, 450);
            });
            it('mouse hover and mouse leave testing', () => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                mouseEventArgs.target = li[1].querySelector('.e-text-content');
                expect(li[0].classList.contains('e-hover')).toBe(false);
                expect(li[1].classList.contains('e-hover')).toBe(false);
                treeObj.onMouseOver(mouseEventArgs);
                expect(li[0].classList.contains('e-hover')).toBe(false);
                expect(li[1].classList.contains('e-hover')).toBe(true);
                let ul: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('ul');
                mouseEventArgs.target = ul[0];
                treeObj.onMouseOver(mouseEventArgs);
                expect(li[0].classList.contains('e-hover')).toBe(false);
                expect(li[1].classList.contains('e-hover')).toBe(false);
                mouseEventArgs.target = li[3].querySelector('.e-icons');
                expect(li[3].classList.contains('e-hover')).toBe(false);
                treeObj.onMouseOver(mouseEventArgs);
                expect(li[3].classList.contains('e-hover')).toBe(true);
                mouseEventArgs.target = treeObj.element;
                treeObj.onMouseOver(mouseEventArgs);
                expect(li[3].classList.contains('e-hover')).toBe(false);
                mouseEventArgs.target = li[1].querySelector('.e-text-content');
                treeObj.onMouseOver(mouseEventArgs);
                expect(li[1].classList.contains('e-hover')).toBe(true);
                treeObj.onMouseOver(mouseEventArgs);
                expect(li[1].classList.contains('e-hover')).toBe(true);
                treeObj.onMouseLeave(mouseEventArgs);
                expect(li[1].classList.contains('e-hover')).toBe(false);
            });
            it('mouse click on full row', () => {
                treeObj.fullRowSelect = true;
                treeObj.dataBind();
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                mouseEventArgs.originalEvent.target = li[1].querySelector('.e-fullrow');
                expect((li[1] as Element).classList.contains('e-active')).toBe(false);
                expect(treeObj.element.querySelectorAll('[aria-selected]').length).toBe(1);
                treeObj.clickHandler(mouseEventArgs);
                expect((li[1] as Element).classList.contains('e-active')).toBe(true);
                expect(treeObj.element.querySelectorAll('[aria-selected]').length).toBe(1);
                expect(li[1].getAttribute('aria-selected')).toBe('true');
                mouseEventArgs.originalEvent.target = li[0].querySelector('.e-fullrow');
                expect((li[0] as Element).classList.contains('e-active')).toBe(false);            
                treeObj.clickHandler(mouseEventArgs);
                expect((li[1] as Element).classList.contains('e-active')).toBe(false);
                expect((li[0] as Element).classList.contains('e-active')).toBe(true);
                expect(treeObj.element.querySelectorAll('[aria-selected]').length).toBe(1);
                expect(li[0].getAttribute('aria-selected')).toBe('true');
                treeObj.fullRowSelect = false;
                treeObj.dataBind();
            });
            it('mouse right click on full row', () => {
                treeObj.fullRowSelect = true;
                treeObj.dataBind();
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                mouseEventArgs.originalEvent.target = li[1].querySelector('.e-fullrow');
                expect((li[1] as Element).classList.contains('e-active')).toBe(false);
                expect((li[0] as Element).classList.contains('e-active')).toBe(true);
                expect(treeObj.element.querySelectorAll('[aria-selected]').length).toBe(1);
                mouseEventArgs.originalEvent.which = 3;
                treeObj.clickHandler(mouseEventArgs);
                expect((li[1] as Element).classList.contains('e-active')).toBe(false);
                expect((li[0] as Element).classList.contains('e-active')).toBe(true);
                expect(treeObj.element.querySelectorAll('[aria-selected]').length).toBe(1);
                expect(li[0].getAttribute('aria-selected')).toBe('true');
                expect(li[1].getAttribute('aria-selected')).toBe(null);
                mouseEventArgs.originalEvent.target = li[0].querySelector('.e-fullrow');       
                treeObj.clickHandler(mouseEventArgs);
                expect((li[1] as Element).classList.contains('e-active')).toBe(false);
                expect((li[0] as Element).classList.contains('e-active')).toBe(true);
                expect(treeObj.element.querySelectorAll('[aria-selected]').length).toBe(1);
                expect(li[0].getAttribute('aria-selected')).toBe('true');
                treeObj.fullRowSelect = false;
                treeObj.dataBind();
            });
        });
        describe('keyboard navigation testing', () => {
            let keyboardEventArgs: any = {
                preventDefault: (): void => {},
                action: null,
                target: null,
                stopImmediatePropagation: (): void => {},
            };
            let treeObj: any;
            let eleParent: HTMLElement = createElement('div', { id: 'treeParent', styles: 'height:150px;overflow:auto;' });
            let ele: HTMLElement = createElement('div', { id: 'tree1' });
            beforeAll(() => {
                document.body.appendChild(eleParent);
                eleParent.appendChild(ele);
                treeObj = new TreeView({ 
                    fields: { dataSource: hierarchicalData1, id: "nodeId", text: "nodeText", child:"nodeChild" },
                    fullRowSelect: false,
                });
                treeObj.appendTo(ele);
            });
            afterAll(() => {
                if (treeObj)
                    treeObj.destroy();
                document.body.innerHTML = '';
            });
            it('tab key pressed', () => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                expect(li[0].classList.contains('e-hover')).toBe(false);
                expect(li[0].classList.contains('e-node-focus')).toBe(true);
                expect(li[1].classList.contains('e-node-focus')).toBe(false);
                keyboardEventArgs.action = 'tab';
                treeObj.focusIn();
                expect(li[0].classList.contains('e-hover')).toBe(true);
                expect(li[0].classList.contains('e-node-focus')).toBe(true);
                expect(li[1].classList.contains('e-node-focus')).toBe(false);
            });
            it('down arrow key pressed', () => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                expect(li[0].classList.contains('e-hover')).toBe(true);
                expect(li[1].classList.contains('e-hover')).toBe(false);
                expect(li[0].classList.contains('e-node-focus')).toBe(true);
                expect(li[1].classList.contains('e-node-focus')).toBe(false);
                keyboardEventArgs.action = 'moveDown';
                treeObj.keyActionHandler(keyboardEventArgs);
                expect(li[0].classList.contains('e-hover')).toBe(false);
                expect(li[1].classList.contains('e-hover')).toBe(true);
                expect(li[0].classList.contains('e-node-focus')).toBe(false);
                expect(li[1].classList.contains('e-node-focus')).toBe(true);
                treeObj.keyActionHandler(keyboardEventArgs);
                treeObj.keyActionHandler(keyboardEventArgs);
                treeObj.keyActionHandler(keyboardEventArgs);
                treeObj.keyActionHandler(keyboardEventArgs);
                expect(li[1].classList.contains('e-hover')).toBe(false);
                expect(li[4].classList.contains('e-hover')).toBe(true);
                expect(li[1].classList.contains('e-node-focus')).toBe(false);
                expect(li[4].classList.contains('e-node-focus')).toBe(true);
            });
            it('up arrow key pressed', () => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                expect(li[0].classList.contains('e-hover')).toBe(false);
                expect(li[4].classList.contains('e-hover')).toBe(true);
                expect(li[0].classList.contains('e-node-focus')).toBe(false);
                expect(li[4].classList.contains('e-node-focus')).toBe(true);
                keyboardEventArgs.action = 'moveUp';
                treeObj.keyActionHandler(keyboardEventArgs);
                expect(li[3].classList.contains('e-hover')).toBe(true);
                expect(li[4].classList.contains('e-hover')).toBe(false);
                expect(li[3].classList.contains('e-node-focus')).toBe(true);
                expect(li[4].classList.contains('e-node-focus')).toBe(false);
                treeObj.keyActionHandler(keyboardEventArgs);
                treeObj.keyActionHandler(keyboardEventArgs);
                treeObj.keyActionHandler(keyboardEventArgs);
                treeObj.keyActionHandler(keyboardEventArgs);
                expect(li[0].classList.contains('e-hover')).toBe(true);
                expect(li[1].classList.contains('e-hover')).toBe(false);
                expect(li[0].classList.contains('e-node-focus')).toBe(true);
                expect(li[1].classList.contains('e-node-focus')).toBe(false);
            });
            it('end key pressed', () => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                expect(li[0].classList.contains('e-hover')).toBe(true);
                expect(li[li.length-1].classList.contains('e-hover')).toBe(false);
                expect(li[0].classList.contains('e-node-focus')).toBe(true);
                expect(li[li.length-1].classList.contains('e-node-focus')).toBe(false);
                keyboardEventArgs.action = 'end';
                treeObj.keyActionHandler(keyboardEventArgs);
                expect(li[0].classList.contains('e-hover')).toBe(false);
                expect(li[li.length-1].classList.contains('e-hover')).toBe(true);
                expect(li[0].classList.contains('e-node-focus')).toBe(false);
                expect(li[li.length-1].classList.contains('e-node-focus')).toBe(true);
            });
            it('home key pressed', () => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                expect(li[0].classList.contains('e-hover')).toBe(false);
                expect(li[li.length-1].classList.contains('e-hover')).toBe(true);
                expect(li[0].classList.contains('e-node-focus')).toBe(false);
                expect(li[li.length-1].classList.contains('e-node-focus')).toBe(true);
                keyboardEventArgs.action = 'home';
                treeObj.keyActionHandler(keyboardEventArgs);
                expect(li[0].classList.contains('e-hover')).toBe(true);
                expect(li[li.length-1].classList.contains('e-hover')).toBe(false);
                expect(li[0].classList.contains('e-node-focus')).toBe(true);
                expect(li[li.length-1].classList.contains('e-node-focus')).toBe(false);
            });
            it('enter key pressed', () => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                expect(li[0].classList.contains('e-hover')).toBe(true);
                expect(li[0].classList.contains('e-node-focus')).toBe(true);
                expect(li[0].classList.contains('e-active')).toBe(false);
                keyboardEventArgs.action = 'enter';
                treeObj.keyActionHandler(keyboardEventArgs);
                expect(li[0].classList.contains('e-hover')).toBe(true);
                expect(li[0].classList.contains('e-node-focus')).toBe(true);
                expect(li[0].classList.contains('e-active')).toBe(true);
            });
            it('right arrow key pressed', (done: Function) => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                expect(li[0].classList.contains('e-hover')).toBe(true);
                expect(li[0].classList.contains('e-node-focus')).toBe(true);
                expect(li[1].classList.contains('e-node-focus')).toBe(false);
                expect((li[0].querySelector('.e-icons') as Element).classList.contains('e-icon-expandable')).toBe(true);
                expect(li[0].childElementCount).toBe(1);
                expect(treeObj.expandedNodes.length).toBe(0);
                keyboardEventArgs.action = 'moveRight';
                treeObj.keyActionHandler(keyboardEventArgs);
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    expect(li[0].classList.contains('e-hover')).toBe(true);
                    expect(li[0].classList.contains('e-node-focus')).toBe(true);
                    expect(li[1].classList.contains('e-node-focus')).toBe(false);
                    expect((li[0].querySelector('.e-icons') as Element).classList.contains('e-icon-expandable')).toBe(false);
                    expect((li[0].querySelector('.e-icons') as Element).classList.contains('e-icon-collapsible')).toBe(true);
                    expect(li[0].childElementCount).toBe(2);
                    expect(treeObj.expandedNodes.length).toBe(1);
                    let newli: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                    keyboardEventArgs.action = 'moveRight';
                    treeObj.keyActionHandler(keyboardEventArgs);
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function() {
                        expect(newli[0].classList.contains('e-hover')).toBe(false);
                        expect(newli[1].classList.contains('e-hover')).toBe(true);
                        expect(newli[0].classList.contains('e-node-focus')).toBe(false);
                        expect(newli[1].classList.contains('e-node-focus')).toBe(true);
                        expect(newli[1].childElementCount).toBe(1);
                        keyboardEventArgs.action = 'moveRight';
                        treeObj.keyActionHandler(keyboardEventArgs);
                        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                        setTimeout(function() {
                            expect(newli[0].classList.contains('e-hover')).toBe(false);
                            expect(newli[1].classList.contains('e-hover')).toBe(true);
                            expect(newli[2].classList.contains('e-hover')).toBe(false);
                            expect(newli[0].classList.contains('e-node-focus')).toBe(false);
                            expect(newli[1].classList.contains('e-node-focus')).toBe(true);
                            expect(newli[2].classList.contains('e-node-focus')).toBe(false);
                            expect(newli[1].childElementCount).toBe(1);
                            done();
                        }, 450);
                    }, 450);
                }, 450);
            });
            it('left arrow key pressed', (done: Function) => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                keyboardEventArgs.action = 'moveLeft';
                treeObj.keyActionHandler(keyboardEventArgs);
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    expect(li[0].classList.contains('e-hover')).toBe(true);
                    expect(li[1].classList.contains('e-hover')).toBe(false);
                    expect(li[0].classList.contains('e-node-focus')).toBe(true);
                    expect(li[1].classList.contains('e-node-focus')).toBe(false);
                    expect((li[0].querySelector('.e-icons') as Element).classList.contains('e-icon-expandable')).toBe(false);
                    expect((li[0].querySelector('.e-icons') as Element).classList.contains('e-icon-collapsible')).toBe(true);
                    expect(li[0].childElementCount).toBe(2);
                    expect(treeObj.expandedNodes.length).toBe(1);
                    keyboardEventArgs.action = 'moveLeft';
                    treeObj.keyActionHandler(keyboardEventArgs);
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function() {
                        expect(li[0].classList.contains('e-hover')).toBe(true);
                        expect(li[1].classList.contains('e-hover')).toBe(false);
                        expect(li[0].classList.contains('e-node-focus')).toBe(true);
                        expect(li[1].classList.contains('e-node-focus')).toBe(false);
                        expect((li[0].querySelector('.e-icons') as Element).classList.contains('e-icon-expandable')).toBe(true);
                        expect((li[0].querySelector('.e-icons') as Element).classList.contains('e-icon-collapsible')).toBe(false);
                        expect(li[0].childElementCount).toBe(2);
                        expect(treeObj.expandedNodes.length).toBe(0);
                        keyboardEventArgs.action = 'moveLeft';
                        treeObj.keyActionHandler(keyboardEventArgs);
                        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                        setTimeout(function() {
                            expect(li[0].classList.contains('e-hover')).toBe(true);
                            expect(li[1].classList.contains('e-hover')).toBe(false);
                            expect(li[0].classList.contains('e-node-focus')).toBe(true);
                            expect(li[1].classList.contains('e-node-focus')).toBe(false);
                            expect(li[0].childElementCount).toBe(2);
                            expect(treeObj.expandedNodes.length).toBe(0);
                            done();
                        }, 450);
                    }, 450);
                }, 450);
            });
            it('key action performed when scrollbar enabled', (done: Function) => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                (li[0].parentElement as HTMLElement).style.margin = '0';
                keyboardEventArgs.action = 'end';
                treeObj.keyActionHandler(keyboardEventArgs);
                expect(li[5].classList.contains('e-hover')).toBe(true);
                expect(li[0].classList.contains('e-hover')).toBe(false);
                expect(li[5].classList.contains('e-node-focus')).toBe(true);
                expect(li[0].classList.contains('e-node-focus')).toBe(false);
                keyboardEventArgs.action = 'moveRight';
                treeObj.keyActionHandler(keyboardEventArgs);
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    keyboardEventArgs.action = 'moveDown';
                    treeObj.keyActionHandler(keyboardEventArgs);
                    let nli: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                    expect(nli[5].classList.contains('e-node-focus')).toBe(false);
                    expect(nli[6].classList.contains('e-node-focus')).toBe(true);
                    keyboardEventArgs.action = 'end';
                    treeObj.keyActionHandler(keyboardEventArgs);
                    expect(nli[6].classList.contains('e-node-focus')).toBe(false);
                    expect(nli[9].classList.contains('e-node-focus')).toBe(true);
                    keyboardEventArgs.action = 'home';
                    treeObj.keyActionHandler(keyboardEventArgs);
                    expect(nli[9].classList.contains('e-node-focus')).toBe(false);
                    expect(nli[0].classList.contains('e-node-focus')).toBe(true);
                    done();
                }, 450);
            });
            it('f2 key pressed', () => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                expect(li[0].querySelector('.e-list-text').childElementCount).toBe(0);
                expect(li[0].querySelector('.e-input')).toBe(null);
                keyboardEventArgs.action = 'f2';
                treeObj.keyActionHandler(keyboardEventArgs);
                expect(li[0].querySelector('.e-list-text').childElementCount).toBe(0);
                expect(li[0].querySelector('.e-input')).toBe(null);
                treeObj.allowEditing = true;
                treeObj.dataBind();
                treeObj.keyActionHandler(keyboardEventArgs);
                expect(li[0].querySelector('.e-list-text').childElementCount).toBe(1);
                expect(li[0].querySelector('.e-input')).not.toBe(null);
                expect(li[0].querySelector('.e-input').nodeName).toBe('INPUT');
                expect((li[0].querySelector('.e-input') as HTMLInputElement).value).toBe('Music');
                (li[0].querySelector('.e-input') as HTMLInputElement).value = 'Music node';
                keyboardEventArgs.action = 'enter';
                keyboardEventArgs.target = li[0].querySelector('.e-input');
                treeObj.keyActionHandler(keyboardEventArgs);
                expect(li[0].querySelector('.e-list-text').childElementCount).toBe(0);
                expect(li[0].querySelector('.e-input')).toBe(null);
                expect((li[0].querySelector('.e-list-text') as HTMLElement).childNodes[0].nodeValue).toBe('Music node');
                keyboardEventArgs.action = 'f2';
                keyboardEventArgs.target = null;
                treeObj.keyActionHandler(keyboardEventArgs);
                expect(li[0].querySelector('.e-list-text').childElementCount).toBe(1);
                expect(li[0].querySelector('.e-input')).not.toBe(null);
                expect(li[0].querySelector('.e-input').nodeName).toBe('INPUT');
                expect((li[0].querySelector('.e-input') as HTMLInputElement).value).toBe('Music node');
                (li[0].querySelector('.e-input') as HTMLInputElement).value = 'Music value';
                keyboardEventArgs.action = 'escape';
                keyboardEventArgs.target = li[0].querySelector('.e-input');
                treeObj.keyActionHandler(keyboardEventArgs);
                expect(li[0].querySelector('.e-list-text').childElementCount).toBe(0);
                expect(li[0].querySelector('.e-input')).toBe(null);
                expect((li[0].querySelector('.e-list-text') as HTMLElement).childNodes[0].nodeValue).toBe('Music node');
                keyboardEventArgs.action = 'f2';
                keyboardEventArgs.target = null;
                treeObj.keyActionHandler(keyboardEventArgs);
                expect(li[0].querySelector('.e-list-text').childElementCount).toBe(1);
                expect(li[0].querySelector('.e-input')).not.toBe(null);
                expect(li[0].querySelector('.e-input').nodeName).toBe('INPUT');
                expect((li[0].querySelector('.e-input') as HTMLInputElement).value).toBe('Music node');
                (li[0].querySelector('.e-input') as HTMLInputElement).value = 'Music';
                keyboardEventArgs.action = 'tab';
                keyboardEventArgs.target = li[0].querySelector('.e-input');
                treeObj.keyActionHandler(keyboardEventArgs);
                (li[0].querySelector('.e-input') as HTMLInputElement).blur();
                expect(li[0].querySelector('.e-list-text').childElementCount).toBe(0);
                expect(li[0].querySelector('.e-input')).toBe(null);
                expect((li[0].querySelector('.e-list-text') as HTMLElement).childNodes[0].nodeValue).toBe('Music');
                treeObj.allowEditing = false;
                treeObj.dataBind();
            });
            it('focus out testing', () => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                treeObj.focusOut();
                expect(li[0].classList.contains('e-hover')).toBe(false);
                expect(li[0].classList.contains('e-node-focus')).toBe(true);
            });
            it('CtrlA testing', () => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                keyboardEventArgs.action = 'ctrlA';
                keyboardEventArgs.target = li[1].querySelector('.e-list-text');
                treeObj.keyActionHandler(keyboardEventArgs);
                expect(li[1].classList.contains('e-active')).toBe(false);
                treeObj.allowMultiSelection = true;
                treeObj.dataBind();
                keyboardEventArgs.action = 'ctrlA';
                keyboardEventArgs.target = li[1].querySelector('.e-list-text');
                treeObj.keyActionHandler(keyboardEventArgs);
                expect(li[1].classList.contains('e-active')).toBe(true);
            });
        });
        describe('events testing', () => {
            let mouseEventArgs: any;
            let tapEvent: any;
            let keyboardEventArgs: any = {
                preventDefault: (): void => {},
                action: null
            };
            let treeObj: any;
            let i: number = 0, j: number = 0;
            let originalTimeout: any;
            function clickFn(): void {
                i++;
            }
            function dsChangeFn(): void {
                j++;
            }
            beforeEach((): void => {
                mouseEventArgs = {
                    preventDefault: (): void => {},
                    stopImmediatePropagation: (): void => {},
                    target: null,
                    type: null,
                    shiftKey: false,
                    ctrlKey: false
                };
                tapEvent = {
                    originalEvent: mouseEventArgs,
                    tapCount: 1
                };
                treeObj = undefined;
                i = 0, j = 0;
                let ele: HTMLElement = createElement('div', { id: 'tree1' });
                document.body.appendChild(ele);
                originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            });
            afterEach((): void => {
                if (treeObj)
                    treeObj.destroy();
                document.body.innerHTML = '';
                jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            });
            it('created event is triggered', () => {
                treeObj = new TreeView({
                    fields: { dataSource: hierarchicalData1, id: "nodeId", text: "nodeText", child:"nodeChild" },
                    created: clickFn
                },'#tree1');
                expect(i).toEqual(1);
            });
            it('drawNode event is triggered', () => {
                treeObj = new TreeView({
                    fields: { dataSource: hierarchicalData1, id: "nodeId", text: "nodeText", child:"nodeChild" },
                    drawNode: clickFn
                },'#tree1');
                expect(i).toEqual(5);
            });
            it('dataBound event is triggered', () => {
                treeObj = new TreeView({
                    fields: { dataSource: hierarchicalData1, id: "nodeId", text: "nodeText", child:"nodeChild" },
                    dataBound: clickFn
                },'#tree1');
                expect(i).toEqual(1);
            });
            it('dataBound event should not triggered while setting expanded nodes dynamically', () => {
                treeObj = new TreeView({
                    fields: { dataSource: localData1, id: 'nodeId', text: 'nodeText', parentID: 'nodePid', hasChildren: 'hasChild' },
                    dataBound: clickFn
                },'#tree1');
                expect(i).toEqual(1);
                treeObj.expandedNodes = ['02'];
                treeObj.dataBind();
                expect(i).toEqual(1);
            });
            it('nodeExpanding event is triggered', () => {
                treeObj = new TreeView({
                    fields: { dataSource: hierarchicalData1, id: "nodeId", text: "nodeText", child:"nodeChild" },
                    nodeExpanding: clickFn
                },'#tree1');
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                mouseEventArgs.target = li[0].querySelector('.e-icons');
                treeObj.touchClickObj.tap(tapEvent);
                expect(i).toEqual(1);
            });

            it('Ripple Effect testing', () => {
                enableRipple(true);
                treeObj = new TreeView({
                    fields: { dataSource: hierarchicalData1, id: "nodeId", text: "nodeText", child:"nodeChild" },
                },'#tree1');
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                expect(li[0].querySelector('.e-icons').classList.contains('e-icon-expandable')).toBe(true);
                var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                li[0].querySelector('.e-icons').dispatchEvent(e);
                var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                li[0].querySelector('.e-icons').dispatchEvent(e);
                var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
                li[0].querySelector('.e-icons').dispatchEvent(e);
                expect(li[0].querySelector('.e-icons').classList.contains('e-ripple')).toBe(true);
                expect(li[0].querySelector('.e-icons').classList.contains('e-icon-expandable')).toBe(false);
                expect(li[0].querySelector('.e-icons').classList.contains('e-icon-collapsible')).toBe(true);
                enableRipple(false);
            });

            it('Ripple Effect testing on full row', () => {
                enableRipple(true);
                treeObj = new TreeView({
                    fields: { dataSource: hierarchicalData1, id: "nodeId", text: "nodeText", child:"nodeChild" },
                },'#tree1');
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                expect(li[0].querySelector('.e-icons').classList.contains('e-icon-expandable')).toBe(true);
                var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                li[0].querySelector('.e-fullrow').dispatchEvent(e);
                var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                li[0].querySelector('.e-fullrow').dispatchEvent(e);
                var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
                li[0].querySelector('.e-fullrow').dispatchEvent(e);
                expect(li[0].querySelector('.e-fullrow').classList.contains('e-ripple')).toBe(true);
                expect(li[0].classList.contains('e-active')).toBe(true);
                expect(treeObj.selectedNodes).toContain('01');
                var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                li[0].querySelector('.e-icons').dispatchEvent(e);
                var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                li[0].querySelector('.e-icons').dispatchEvent(e);
                var e = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
                expect(li[0].querySelector('.e-icons').classList.contains('e-ripple')).toBe(true);
                expect(li[0].querySelector('.e-icons').classList.contains('e-icon-expandable')).toBe(false);
                expect(li[0].querySelector('.e-icons').classList.contains('e-icon-collapsible')).toBe(true);
                var nli : Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                nli[1].querySelector('.e-fullrow').dispatchEvent(e);
                var e = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                nli[1].querySelector('.e-fullrow').dispatchEvent(e);
                expect(nli[1].querySelector('.e-fullrow').classList.contains('e-ripple')).toBe(true);
                enableRipple(false);
            });

            it('nodeExpanded event is triggered', (done: Function) => {
                let i:number=0, nodeData:any;
                treeObj = new TreeView({
                    fields: { dataSource: hierarchicalData1, id: "nodeId", text: "nodeText", child:"nodeChild" },
                    nodeExpanded: (args: NodeExpandEventArgs) =>{
                      i++;
                      nodeData = args.nodeData;
                    },
                    animation: { expand: { duration: 0 }, collapse: { duration: 0 } },
                },'#tree1');
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                mouseEventArgs.target = li[0].querySelector('.e-icons');
                treeObj.touchClickObj.tap(tapEvent);
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    expect(treeObj.expandedNodes.length).toBe(1);
                    expect(i).toEqual(1);
                    expect(nodeData.id).toBe("01");
                    done();
                }, 100);
            });
            it('nodeCollapsing event is triggered', (done: Function) => {
                let i:number=0, nodeData:any;
                treeObj = new TreeView({
                    fields: { dataSource: hierarchicalData1, id: "nodeId", text: "nodeText", child:"nodeChild" },
                    nodeCollapsing: (args: NodeExpandEventArgs) =>{
                      i++;
                      nodeData = args.nodeData;
                    }
                },'#tree1');
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                mouseEventArgs.target = li[0].querySelector('.e-icons');
                treeObj.touchClickObj.tap(tapEvent);
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    treeObj.touchClickObj.tap(tapEvent);
                    expect(i).toEqual(1);
                    expect(nodeData.id).toBe("01");
                    done();
                }, 450);                
            });
            it('nodeCollapsed event is triggered', (done: Function) => {
                treeObj = new TreeView({
                    fields: { dataSource: hierarchicalData1, id: "nodeId", text: "nodeText", child:"nodeChild" },
                    nodeCollapsed: clickFn,
                    animation: { expand: { duration: 0 }, collapse: { duration: 0 } },
                },'#tree1');
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                mouseEventArgs.target = li[0].querySelector('.e-icons');
                treeObj.touchClickObj.tap(tapEvent);
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    expect(treeObj.expandedNodes.length).toBe(1);
                    treeObj.touchClickObj.tap(tapEvent);
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function() {
                        expect(treeObj.expandedNodes.length).toBe(0);
                        expect(i).toEqual(1);
                        done();
                    }, 100);
                }, 100);
            });
            it('nodeSelecting event is triggered', () => {
                let i:number=0, nodeData:any;
                treeObj = new TreeView({
                    fields: { dataSource: hierarchicalData3, id: "nodeId", text: "nodeText", child:"nodeChild" },
                    nodeSelecting: (args:NodeSelectEventArgs) => {
                      i++;
                      nodeData = args.nodeData;
                    }
                },'#tree1');
                expect(i).toEqual(0);
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                mouseEventArgs.target = li[0].querySelector('.e-list-text');
                treeObj.touchClickObj.tap(tapEvent);
                expect(i).toEqual(1);
                expect(nodeData.id).toBe("01");
                i = 0;
                expect(li[0].classList.contains('e-active')).toBe(true);
                mouseEventArgs.target = li[7].querySelector('.e-list-text');
                treeObj.touchClickObj.tap(tapEvent);
                expect(i).toEqual(1);
                expect(li[7].classList.contains('e-active')).toBe(true);
                treeObj.allowMultiSelection = true;
                treeObj.dataBind();
                mouseEventArgs.ctrlKey = true;
                mouseEventArgs.target = li[7].querySelector('.e-list-text');
                treeObj.touchClickObj.tap(tapEvent);
                expect(i).toEqual(2);
                expect(li[7].classList.contains('e-active')).toBe(false);
            });
            it('nodeSelecting event is cancelled', () => {
                let i:number=0, nodeData:any;
                treeObj = new TreeView({
                    fields: { dataSource: hierarchicalData3, id: "nodeId", text: "nodeText", child:"nodeChild" },
                    nodeSelecting: (args:NodeSelectEventArgs) => {
                      i++;
                     args.cancel = true;
                    }
                },'#tree1');
                expect(i).toEqual(0);
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                mouseEventArgs.target = li[0].querySelector('.e-list-text');
                treeObj.touchClickObj.tap(tapEvent);
                expect(i).toEqual(1);
                expect(li[0].classList.contains('e-active')).toBe(false);
            });
            it('nodeSelected event is triggered', () => {
                 let i:number=0, nodeData:any;
                treeObj = new TreeView({
                    fields: { dataSource: hierarchicalData1, id: "nodeId", text: "nodeText", child:"nodeChild" },
                    nodeSelected: (args: NodeSelectEventArgs) =>{
                      i++;
                      nodeData = args.nodeData;
                    }
                },'#tree1');
                expect(i).toEqual(0);
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                mouseEventArgs.target = li[0].querySelector('.e-list-text');
                treeObj.touchClickObj.tap(tapEvent);
                expect(i).toEqual(1);
                expect(nodeData.id).toBe("01");
                expect(li[0].classList.contains('e-active')).toBe(true);
                i = 0;
                mouseEventArgs.target = li[4].querySelector('.e-list-text');
                treeObj.touchClickObj.tap(tapEvent);
                expect(i).toEqual(1);
                expect(li[4].classList.contains('e-active')).toBe(true);
                treeObj.allowMultiSelection = true;
                treeObj.dataBind();
                mouseEventArgs.ctrlKey = true;
                mouseEventArgs.target = li[4].querySelector('.e-list-text');
                treeObj.touchClickObj.tap(tapEvent);
                expect(i).toEqual(2);
                expect(li[4].classList.contains('e-active')).toBe(false);
            });
            it('nodeEditing event is triggered', () => {
                treeObj = new TreeView({
                    fields: { dataSource: hierarchicalData1, id: "nodeId", text: "nodeText", child:"nodeChild" },
                    nodeEditing: clickFn,
                    allowEditing: true,
                    fullRowSelect: false,
                },'#tree1');
                expect(i).toEqual(0);
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                mouseEventArgs.target = li[0].querySelector('.e-list-text');
                tapEvent.tapCount = 2;
                expect(li[0].querySelector('.e-icons').classList.contains('e-icon-expandable')).toBe(true);
                expect(li[0].querySelector('.e-icons').classList.contains('e-icon-collapsible')).toBe(false);
                expect(li[0].childElementCount).toBe(1);
                expect(li[0].querySelector('.e-list-text').childElementCount).toBe(0);
                treeObj.touchEditObj.tap(tapEvent);
                expect(li[0].querySelector('.e-icons').classList.contains('e-icon-expandable')).toBe(true);
                expect(li[0].querySelector('.e-icons').classList.contains('e-icon-collapsible')).toBe(false);
                expect(li[0].childElementCount).toBe(1);
                expect(li[0].querySelector('.e-list-text').childElementCount).toBe(1);
                expect(li[0].querySelector('.e-input').nodeName).toBe('INPUT');
                expect((li[0].querySelector('.e-input') as HTMLInputElement).value).toBe('Music');
                (li[0].querySelector('.e-input') as HTMLInputElement).value = 'Music node';
                (li[0].querySelector('.e-input') as HTMLInputElement).blur();
                expect(li[0].querySelector('.e-list-text').childElementCount).toBe(0);
                expect((li[0].querySelector('.e-list-text') as HTMLElement).childNodes[0].nodeValue).toBe('Music node');
                expect(i).toEqual(1);
                treeObj.touchEditObj.tap(tapEvent);
                expect((li[0].querySelector('.e-input') as HTMLInputElement).value).toBe('Music node');
                (li[0].querySelector('.e-input') as HTMLInputElement).value = 'Music';
                (li[0].querySelector('.e-input') as HTMLInputElement).blur();
                expect(li[0].querySelector('.e-list-text').childElementCount).toBe(0);
                expect((li[0].querySelector('.e-list-text') as HTMLElement).childNodes[0].nodeValue).toBe('Music');
            });
            it('nodeEdited event is triggered', () => {
                treeObj = new TreeView({
                    fields: { dataSource: hierarchicalData1, id: "nodeId", text: "nodeText", child:"nodeChild" },
                    nodeEdited: clickFn,
                    dataSourceChanged: dsChangeFn,
                    allowEditing: true,
                    fullRowSelect: false,
                },'#tree1');
                expect(i).toEqual(0);
                expect(j).toEqual(0);
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                mouseEventArgs.target = li[0].querySelector('.e-list-text');
                tapEvent.tapCount = 2;
                expect(li[0].querySelector('.e-icons').classList.contains('e-icon-expandable')).toBe(true);
                expect(li[0].querySelector('.e-icons').classList.contains('e-icon-collapsible')).toBe(false);
                expect(li[0].childElementCount).toBe(1);
                expect(li[0].querySelector('.e-list-text').childElementCount).toBe(0);
                treeObj.touchEditObj.tap(tapEvent);
                expect(li[0].querySelector('.e-icons').classList.contains('e-icon-expandable')).toBe(true);
                expect(li[0].querySelector('.e-icons').classList.contains('e-icon-collapsible')).toBe(false);
                expect(li[0].childElementCount).toBe(1);
                expect(li[0].querySelector('.e-list-text').childElementCount).toBe(1);
                expect(li[0].querySelector('.e-input').nodeName).toBe('INPUT');
                expect((li[0].querySelector('.e-input') as HTMLInputElement).value).toBe('Music');
                (li[0].querySelector('.e-input') as HTMLInputElement).value = 'Music node';
                (li[0].querySelector('.e-input') as HTMLInputElement).blur();
                expect(li[0].querySelector('.e-list-text').childElementCount).toBe(0);
                expect((li[0].querySelector('.e-list-text') as HTMLElement).childNodes[0].nodeValue).toBe('Music node');
                expect(i).toEqual(1);
                expect(j).toEqual(1);
                treeObj.touchEditObj.tap(tapEvent);
                expect((li[0].querySelector('.e-input') as HTMLInputElement).value).toBe('Music node');
                (li[0].querySelector('.e-input') as HTMLInputElement).value = 'Music';
                (li[0].querySelector('.e-input') as HTMLInputElement).blur();
                expect(li[0].querySelector('.e-list-text').childElementCount).toBe(0);
                expect((li[0].querySelector('.e-list-text') as HTMLElement).childNodes[0].nodeValue).toBe('Music');
            });            
            it('nodeEdited event is canceled', () => {
                treeObj = new TreeView({
                    fields: { dataSource: hierarchicalData1, id: "nodeId", text: "nodeText", child:"nodeChild" },
                    nodeEdited: (args: NodeEditEventArgs) => {
                        if (args.oldText == "Music") {
                            args.cancel = true;
                        } else if (args.oldText == "Videos") {
                            args.newText = "New Videos";
                        }
                    },
                    dataSourceChanged: dsChangeFn,
                    allowEditing: true,
                    fullRowSelect: false,
                },'#tree1');
                expect(j).toEqual(0);
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                mouseEventArgs.target = li[0].querySelector('.e-list-text');
                tapEvent.tapCount = 2;
                treeObj.touchEditObj.tap(tapEvent);
                expect(li[0].querySelector('.e-list-text').childElementCount).toBe(1);
                expect((li[0].querySelector('.e-input') as HTMLInputElement).value).toBe('Music');
                (li[0].querySelector('.e-input') as HTMLInputElement).value = 'Music node';
                (li[0].querySelector('.e-input') as HTMLInputElement).blur();
                expect(li[0].querySelector('.e-list-text').childElementCount).toBe(0);
                expect((li[0].querySelector('.e-list-text') as HTMLElement).childNodes[0].nodeValue).toBe('Music');
                expect(j).toEqual(0);
                mouseEventArgs.target = li[1].querySelector('.e-list-text');
                tapEvent.tapCount = 2;
                treeObj.touchEditObj.tap(tapEvent);
                expect(li[1].querySelector('.e-list-text').childElementCount).toBe(1);
                expect((li[1].querySelector('.e-input') as HTMLInputElement).value).toBe('Videos');
                (li[1].querySelector('.e-input') as HTMLInputElement).value = 'Videos node';
                (li[1].querySelector('.e-input') as HTMLInputElement).blur();
                expect(li[1].querySelector('.e-list-text').childElementCount).toBe(0);
                expect((li[1].querySelector('.e-list-text') as HTMLElement).childNodes[0].nodeValue).toBe('New Videos');
                expect(j).toEqual(1);
            });
            it('nodeClicked event is triggered', () => {
                treeObj = new TreeView({
                    fields: { dataSource: hierarchicalData1, id: "nodeId", text: "nodeText", child:"nodeChild" },
                    nodeClicked: clickFn,
                },'#tree1');
                expect(i).toEqual(0);
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                mouseEventArgs.target = li[0].querySelector('.e-list-text');
                treeObj.touchClickObj.tap(tapEvent);
                expect(i).toEqual(1);
                expect(li[0].classList.contains('e-active')).toBe(true);
            });
            it('keyPress event is triggered', () => {
                treeObj = new TreeView({
                    fields: { dataSource: hierarchicalData1, id: "nodeId", text: "nodeText", child:"nodeChild" },
                    keyPress: clickFn,
                },'#tree1');
                expect(i).toEqual(0);
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                keyboardEventArgs.action = 'tab';
                treeObj.focusIn();
                expect(li[0].classList.contains('e-hover')).toBe(true);
                keyboardEventArgs.action = 'moveDown';
                treeObj.keyActionHandler(keyboardEventArgs);
                expect(i).toEqual(1);
                expect(li[0].classList.contains('e-hover')).toBe(false);
                expect(li[1].classList.contains('e-hover')).toBe(true);
            });
            it('darg and drop events are triggered', () => {
                treeObj = new TreeView({
                    fields: { dataSource: hierarchicalData1, id: "nodeId", text: "nodeText", child:"nodeChild" },
                    nodeDragStart: clickFn,
                    nodeDragging: clickFn,
                    nodeDragStop: clickFn,
                    nodeDropped: clickFn,
                    dataSourceChanged: dsChangeFn,
                    allowDragAndDrop: true,
                },'#tree1');
                expect(i).toEqual(0);
                expect(j).toEqual(0);
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                let mousedown: any = getEventObject('MouseEvents', 'mousedown', treeObj.element, li[2].querySelector('.e-list-text'), 15, 10);
                EventHandler.trigger(treeObj.element, 'mousedown', mousedown);                
                let mousemove: any = getEventObject('MouseEvents', 'mousemove', treeObj.element, li[2].querySelector('.e-list-text'), 15, 70);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                expect(i).toEqual(1);
                mousemove.srcElement = mousemove.target = mousemove.toElement = li[1].querySelector('.e-list-text');
                mousemove = setMouseCordinates(mousemove, 15, 75);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                expect(i).toEqual(2);
                i = 0;
                let mouseup: any = getEventObject('MouseEvents', 'mouseup', treeObj.element, li[1].querySelector('.e-list-text'));
                mouseup.type = 'mouseup';
                EventHandler.trigger(<any>(document), 'mouseup', mouseup);
                expect(i).toEqual(2);
                expect(j).toEqual(1);
                expect(li[1].childElementCount).toBe(3);
                expect(li[1].children[2].childElementCount).toBe(3);
            });
			it('drag and drop with offset value change are triggered', () => {
                treeObj = new TreeView({
                    fields: { dataSource: hierarchicalData1, id: "nodeId", text: "nodeText", child:"nodeChild" },
                    nodeDragStart: clickFn,
                    nodeDragging: clickFn,
                    nodeDragStop: clickFn,
                    nodeDropped: clickFn,
                    allowDragAndDrop: true,
                },'#tree1');
                expect(i).toEqual(0);
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                let mousedown: any = getEventObject('MouseEvents', 'mousedown', treeObj.element, li[2].querySelector('.e-list-text'), 15, 10);
                EventHandler.trigger(treeObj.element, 'mousedown', mousedown);                
                let mousemove: any = getEventObject('MouseEvents', 'mousemove', treeObj.element, li[2].querySelector('.e-list-text'), 15, 70);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                expect(i).toEqual(1);
                mousemove.srcElement = mousemove.target = mousemove.toElement = li[1].querySelector('.e-list-text');
                mousemove = setMouseCordinates(mousemove, 15, 75);
				mousemove.offsetY = 6;
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                expect(i).toEqual(2);
                let mouseup: any = getEventObject('MouseEvents', 'mouseup', treeObj.element, li[2].querySelector('.e-list-text'));
                EventHandler.trigger(<any>(document), 'mouseup', mouseup);          
            });
			it('drag and drop with increased offset value are triggered', () => {
                treeObj = new TreeView({
                    fields: { dataSource: hierarchicalData1, id: "nodeId", text: "nodeText", child:"nodeChild" },
                    nodeDragStart: clickFn,
                    nodeDragging: clickFn,
                    nodeDragStop: clickFn,
                    nodeDropped: clickFn,
                    allowDragAndDrop: true,
                },'#tree1');
                expect(i).toEqual(0);
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                let mousedown: any = getEventObject('MouseEvents', 'mousedown', treeObj.element, li[2].querySelector('.e-list-text'), 15, 10);
                EventHandler.trigger(treeObj.element, 'mousedown', mousedown);                
                let mousemove: any = getEventObject('MouseEvents', 'mousemove', treeObj.element, li[2].querySelector('.e-list-text'), 15, 70);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                expect(i).toEqual(1);
                mousemove.srcElement = mousemove.target = mousemove.toElement = li[1].querySelector('.e-list-text');
                mousemove = setMouseCordinates(mousemove, 15, 75);
				mousemove.offsetY = 8;
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                expect(i).toEqual(2);
                let mouseup: any = getEventObject('MouseEvents', 'mouseup', treeObj.element, li[1].querySelector('.e-list-text'));
                EventHandler.trigger(<any>(document), 'mouseup', mouseup);
            });
            it('darg start event is canceled', () => {
                var j = 0;
                treeObj = new TreeView({
                    fields: { dataSource: hierarchicalData1, id: "nodeId", text: "nodeText", child:"nodeChild" },
                    nodeDragStart: (args: DragAndDropEventArgs) => {
                        j++;
                        if (args.draggedNodeData['text'] == "Music") {
                            args.cancel = true;
                        }
                    },
                    nodeDragging: clickFn,
                    allowDragAndDrop: true,
                },'#tree1');
                expect(j).toEqual(0);
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                let mousedown: any = getEventObject('MouseEvents', 'mousedown', treeObj.element, li[0].querySelector('.e-list-text'), 15, 10);
                EventHandler.trigger(treeObj.element, 'mousedown', mousedown);
                let mousemove: any = getEventObject('MouseEvents', 'mousemove', treeObj.element, li[0].querySelector('.e-list-text'), 15, 70);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                expect(j).toEqual(1);
                mousemove.srcElement = mousemove.target = mousemove.toElement = li[1].querySelector('.e-list-text');
                mousemove = setMouseCordinates(mousemove, 15, 75);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                let mouseup: any = getEventObject('MouseEvents', 'mouseup', treeObj.element, li[1].querySelector('.e-list-text'));
                mouseup.type = 'mouseup';
                EventHandler.trigger(<any>(document), 'mouseup', mouseup);
                expect(i).toEqual(0);
                EventHandler.trigger(treeObj.element, 'mousedown', mousedown);
                mousemove.srcElement = mousemove.target = mousemove.toElement = li[0].querySelector('.e-list-text');
                mousemove = setMouseCordinates(mousemove, 15, 70);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                expect(j).toEqual(2);
                mousemove.srcElement = mousemove.target = mousemove.toElement = li[1].querySelector('.e-list-text');
                mousemove = setMouseCordinates(mousemove, 15, 75);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                EventHandler.trigger(<any>(document), 'mouseup', mouseup);
                expect(i).toEqual(0);
            });
              it('drag start event is canceled while node editing', () => {
                var j = 0;
                treeObj = new TreeView({
                    fields: { dataSource: hierarchicalData2, id: "nodeId", text: "nodeText", child:"nodeChild" },
                    allowEditing:true,
                    allowDragAndDrop: true,
                    nodeDragStart: (args: DragAndDropEventArgs) => {
                        j++;
                    }
                },'#tree1');
                expect(j).toEqual(0);
                treeObj.beginEdit('02');
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                mouseEventArgs.target = li[0].querySelector('.e-list-text');
                expect(li[1].classList.contains('e-editing')).toBe(true);
                let mousedown: any = getEventObject('MouseEvents', 'mousedown', treeObj.element, li[1].querySelector('.e-list-text'), 15, 10);
                EventHandler.trigger(treeObj.element, 'mousedown', mousedown);
                let mousemove: any = getEventObject('MouseEvents', 'mousemove', treeObj.element, li[1].querySelector('.e-list-text'), 15, 70);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                mousemove.srcElement = mousemove.target = mousemove.toElement = li[1].querySelector('.e-list-text');
                mousemove = setMouseCordinates(mousemove, 15, 75);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                let mouseup: any = getEventObject('MouseEvents', 'mouseup', treeObj.element, li[0].querySelector('.e-list-text'));
                mouseup.type = 'mouseup';
                EventHandler.trigger(<any>(document), 'mouseup', mouseup);
                expect(j).toEqual(0);
                EventHandler.trigger(treeObj.element, 'mousedown', mousedown);
                mousemove.srcElement = mousemove.target = mousemove.toElement = li[0].querySelector('.e-list-text');
                mousemove = setMouseCordinates(mousemove, 15, 70);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                expect(j).toEqual(1);
                mousemove.srcElement = mousemove.target = mousemove.toElement = li[0].querySelector('.e-list-text');
                mousemove = setMouseCordinates(mousemove, 15, 75);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                EventHandler.trigger(<any>(document), 'mouseup', mouseup);
            });
            
            it('nodeChecking event is triggered', () => {
                var j = true;
                treeObj = new TreeView({
                    fields: { dataSource: hierarchicalData1, id: "nodeId", text: "nodeText", child:"nodeChild" },
                    showCheckBox: true,
                    nodeChecking: (args: NodeCheckEventArgs) => {
                        j = (args.action == 'check') ? true : false;
                    },
                },'#tree1');
                expect(j).toBe(true);
                let checkEle: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-checkbox-wrapper');
                var mousedown = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                checkEle[0].querySelector('.e-frame').dispatchEvent(mousedown);
                var mouseup = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                checkEle[0].querySelector('.e-frame').dispatchEvent(mouseup);
                expect(j).toBe(true);
                checkEle[0].querySelector('.e-frame').dispatchEvent(mousedown);
                checkEle[0].querySelector('.e-frame').dispatchEvent(mouseup);
                expect(j).toBe(false);
            });
            it('nodeChecked event is triggered', () => {
                var j = true;
                treeObj = new TreeView({
                    fields: { dataSource: hierarchicalData1, id: "nodeId", text: "nodeText", child:"nodeChild" },
                    showCheckBox: true,
                    nodeChecked: (args: NodeCheckEventArgs) => {
                        j = (args.action == 'check') ? true : false;
                    },
                },'#tree1');
                expect(j).toBe(true);
                let checkEle: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-checkbox-wrapper');
                var mousedown = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                checkEle[0].querySelector('.e-frame').dispatchEvent(mousedown);
                var mouseup = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                checkEle[0].querySelector('.e-frame').dispatchEvent(mouseup);
                expect(j).toBe(true);
                checkEle[0].querySelector('.e-frame').dispatchEvent(mousedown);
                checkEle[0].querySelector('.e-frame').dispatchEvent(mouseup);
                expect(j).toBe(false);
            });
            it('nodeExpanding event is triggered while drag and drop', (done: Function) => {
                treeObj = new TreeView({ 
                    fields: { dataSource: hierarchicalData2, id: "nodeId", text: "nodeText", child: "nodeChild" },
                    allowDragAndDrop: true,
                    nodeExpanding: clickFn,
                    nodeExpanded: clickFn
                },'#tree1');
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    expect(i).toEqual(0);
                    expect(treeObj.expandedNodes.length).toEqual(0);
                    let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                    let mousedown: any = getEventObject('MouseEvents', 'mousedown', treeObj.element, li[0].querySelector('.e-list-text'), 15, 10);
                    EventHandler.trigger(treeObj.element, 'mousedown', mousedown);
                    let mousemove: any = getEventObject('MouseEvents', 'mousemove', treeObj.element, li[0].querySelector('.e-list-text'), 15, 70);
                    EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                    mousemove.srcElement = mousemove.target = mousemove.toElement = li[1].querySelector('.e-list-text');
                    mousemove = setMouseCordinates(mousemove, 15, 75);
                    EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                    let mouseup: any = getEventObject('MouseEvents', 'mouseup', treeObj.element, li[1].querySelector('.e-list-text'));
                    mouseup.type = 'mouseup';
                    EventHandler.trigger(<any>(document), 'mouseup', mouseup);
                    expect(i).toEqual(2);
                    expect(treeObj.expandedNodes.length).toEqual(1);
                    done();
                }, 100);
            });
            it('destroyed event is triggered', () => {
                treeObj = new TreeView({
                    fields: { dataSource: hierarchicalData1, id: "nodeId", text: "nodeText", child:"nodeChild" },
                    destroyed: clickFn
                },'#tree1');
                treeObj.destroy();
                expect(i).toEqual(1);
            });
        });
        describe('methods testing', () => {
            let mouseEventArgs: any;
            let tapEvent: any;
            let treeObj: any;
            let j: number = 0;
            function dsChangeFn(): void {
                j++;
            }
            beforeEach(() => {
                mouseEventArgs = {
                    preventDefault: (): void => {},
                    stopImmediatePropagation: (): void => {},
                    target: null,
                    type: null,
                    shiftKey: false,
                    ctrlKey: false
                };
                tapEvent = {
                    originalEvent: mouseEventArgs,
                    tapCount: 1
                };
                j = 0;
                let ele: HTMLElement = createElement('div', { id: 'tree1' });
                document.body.appendChild(ele);
                treeObj = new TreeView({ fields: { dataSource: hierarchicalData3, id: "nodeId", text: "nodeText", child:"nodeChild" }, dataSourceChanged: dsChangeFn });
                treeObj.appendTo(ele);
            });
            afterEach(() => {
                if (treeObj)
                    treeObj.destroy();
                document.body.innerHTML = '';
            });
            it('get module name', () => {
                expect(treeObj.getModuleName()).toBe('treeview');
            });
            it('checkAll', (done: Function) => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                treeObj.showCheckBox = true;
                treeObj.checkAll();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    let checkEle: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-check');
                    expect(checkEle.length).toBe(0);
                    done();
                }, 450);
            });
             it('checkAll with empty parameter', (done: Function) => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                treeObj.showCheckBox = true;
                treeObj.dataBind();
                treeObj.checkAll([]);
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                     expect(treeObj.checkedNodes.length === 0 ).toBe(true);
                    done();
                }, 450);
            });
             it('checkAll with parameters', (done: Function) => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                treeObj.showCheckBox = true;
                treeObj.dataBind();
               treeObj.checkAll(['01']);
                setTimeout(function() {
                     expect(treeObj.checkedNodes.length === 2 ).toBe(true);
                    done();
                }, 450);
            });
             it('checkAll with invalidID', (done: Function) => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                treeObj.showCheckBox = true;
                treeObj.dataBind();
                treeObj.checkAll(['10']);
                setTimeout(function() {
                     expect(treeObj.checkedNodes.length === 0 ).toBe(true);
                    done();
                }, 450);
            });
            it('uncheckAll', (done: Function) => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                treeObj.showCheckBox = true;
                treeObj.uncheckAll();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    let checkEle: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-check');
                    expect(checkEle.length).toBe(0);
                    done();
                }, 450);
            });
            it('uncheckAll with empty parameter ', (done: Function) => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                treeObj.showCheckBox = true;
                treeObj.dataBind();
                treeObj.checkAll(['01']);
                setTimeout(function() {
                     expect(treeObj.checkedNodes.length === 2 ).toBe(true);
                     treeObj.uncheckAll([]);
                     expect(treeObj.checkedNodes.length === 2 ).toBe(true);
                    done();
                }, 100);
            });
            it('uncheckAll with parameter ', (done: Function) => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                treeObj.showCheckBox = true;
                treeObj.dataBind();
                treeObj.checkAll(['01']);
                setTimeout(function() {
                    expect(treeObj.checkedNodes.length === 2 ).toBe(true);
                    treeObj.uncheckAll(['01']);
                    expect(treeObj.checkedNodes.length === 0 ).toBe(true);
                    done();
                }, 100);
            });
            it('uncheckAll with invalidId ', (done: Function) => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                treeObj.showCheckBox = true;
                treeObj.dataBind();
                treeObj.checkAll(['01']);
                setTimeout(function() {
                     expect(treeObj.checkedNodes.length === 2 ).toBe(true);
                      treeObj.uncheckAll(['25']);
                      expect(treeObj.checkedNodes.length === 2 ).toBe(true);
                    done();
                }, 450);
            });
            it('persistence testing', (done: Function) => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                let sItems: any = JSON.parse(treeObj.getPersistData());
                expect(sItems.selectedNodes.length).toBe(0);
                expect(sItems.expandedNodes.length).toBe(0);
                mouseEventArgs.target = li[0].querySelector('.e-list-text');
                treeObj.touchClickObj.tap(tapEvent);
                mouseEventArgs.target = li[0].querySelector('.e-icons');
                treeObj.touchClickObj.tap(tapEvent);
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    let seItems: any = JSON.parse(treeObj.getPersistData());
                    expect(seItems.selectedNodes.length).toBe(1);
                    expect(seItems.selectedNodes).toContain('01');
                    expect(seItems.expandedNodes.length).toBe(1);
                    expect(seItems.expandedNodes).toContain('01');
                    done();
                }, 450);
            });
            it('updateNode', () => {
                expect(j).toEqual(0);
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                expect((li[0].querySelector('.e-list-text') as HTMLElement).childNodes[0].nodeValue).toBe('Music');
                treeObj.updateNode(li[0], 'Rain');
                expect((li[0].querySelector('.e-list-text') as HTMLElement).childNodes[0].nodeValue).toBe('Music');
                expect(j).toEqual(0);
                treeObj.allowEditing = true;
                treeObj.dataBind();
                treeObj.updateNode(li[0], 'Rain');
                expect((li[0].querySelector('.e-list-text') as HTMLElement).childNodes[0].nodeValue).toBe('Rain');
                expect(j).toEqual(1);
                treeObj.updateNode('01', 'Music');
                expect((li[0].querySelector('.e-list-text') as HTMLElement).childNodes[0].nodeValue).toBe('Music');
                expect(j).toEqual(2);
                treeObj.updateNode('011', 'Music');
                expect((li[0].querySelector('.e-list-text') as HTMLElement).childNodes[0].nodeValue).toBe('Music');
                expect(j).toEqual(2);
                treeObj.updateNode('01', null);
                expect((li[0].querySelector('.e-list-text') as HTMLElement).childNodes[0].nodeValue).toBe('Music');
                expect(j).toEqual(2);
                treeObj.updateNode(null, null);
                expect((li[0].querySelector('.e-list-text') as HTMLElement).childNodes[0].nodeValue).toBe('Music');
                expect(j).toEqual(2);
                treeObj.allowEditing = false;
                treeObj.dataBind();
            });            
            it('beginEdit', () => {
                expect(j).toEqual(0);
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                expect((li[0].querySelector('.e-list-text') as HTMLElement).childNodes[0].nodeValue).toBe('Music');
                treeObj.beginEdit(li[0]);
                expect(li[0].querySelector('.e-list-text').childElementCount).toBe(1);
                expect((li[0].querySelector('.e-list-text') as HTMLElement).childNodes[0].nodeValue).toBe(null);
                treeObj.allowEditing = true;
                treeObj.dataBind();
                treeObj.beginEdit(li[0]);
                expect(li[0].querySelector('.e-list-text').childElementCount).toBe(1);
                expect(li[0].querySelector('.e-input').nodeName).toBe('INPUT');
                expect((li[0].querySelector('.e-input') as HTMLInputElement).value).toBe('Music');
                (li[0].querySelector('.e-input') as HTMLInputElement).value = 'Rain';
                (li[0].querySelector('.e-input') as HTMLInputElement).blur();
                expect(li[0].querySelector('.e-list-text').childElementCount).toBe(0);
                expect((li[0].querySelector('.e-list-text') as HTMLElement).childNodes[0].nodeValue).toBe('Rain');
                expect(j).toEqual(1);
                treeObj.beginEdit('01');
                expect(li[0].querySelector('.e-list-text').childElementCount).toBe(1);
                expect(li[0].querySelector('.e-input').nodeName).toBe('INPUT');
                expect((li[0].querySelector('.e-input') as HTMLInputElement).value).toBe('Rain');
                (li[0].querySelector('.e-input') as HTMLInputElement).value = 'Music';
                (li[0].querySelector('.e-input') as HTMLInputElement).blur();
                expect(li[0].querySelector('.e-list-text').childElementCount).toBe(0);
                expect((li[0].querySelector('.e-list-text') as HTMLElement).childNodes[0].nodeValue).toBe('Music');
                expect(j).toEqual(2);
                treeObj.beginEdit(null);
                expect(li[0].querySelector('.e-list-text').childElementCount).toBe(0);
                expect((li[0].querySelector('.e-list-text') as HTMLElement).childNodes[0].nodeValue).toBe('Music');
                expect(j).toEqual(2);
                treeObj.allowEditing = false;
                treeObj.dataBind();                
            });
            it('expandAll', (done: Function) => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                expect(li[0].childElementCount).toBe(2);
                treeObj.expandAll();
                let newli: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                expect(newli[0].childElementCount).toBe(3);
                expect(newli[0].children[2].childElementCount).toBe(1);
                expect(newli[11].childElementCount).toBe(3);
                expect(newli[11].children[2].childElementCount).toBe(5);
                expect(newli[12].childElementCount).toBe(3);
                expect(newli[12].children[2].childElementCount).toBe(2);
                expect(newli[14].childElementCount).toBe(3);
                expect(newli[14].children[2].childElementCount).toBe(1);
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    expect(li[0].getAttribute('aria-expanded')).toBe('true');
                    expect(treeObj.expandedNodes.length).toBe(7);
                    done();
                }, 450);
            });
            it('expandAll with specific nodes', () => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                expect(li[0].childElementCount).toBe(2);
                treeObj.expandAll(['01', li[1], '03', '099', '07']);
                expect(li[0].childElementCount).toBe(3);
                expect(li[0].children[2].childElementCount).toBe(1);
                expect(li[1].childElementCount).toBe(3);
                expect(li[1].children[2].childElementCount).toBe(2);
                expect(li[2].childElementCount).toBe(3);
                expect(li[2].children[2].childElementCount).toBe(5);
                treeObj.expandAll('04');
                expect(li[4].childElementCount).toBe(2);
                treeObj.expandAll(null);
                expect(li[4].childElementCount).toBe(3);
            });
            it('expandAll with level', () => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                expect(li[0].childElementCount).toBe(2);
                treeObj.expandAll(null, 1);
                let newli: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                expect(newli[0].childElementCount).toBe(3);
                expect(newli[0].children[2].childElementCount).toBe(1);
                expect(newli[11].childElementCount).toBe(3);
                expect(newli[11].children[2].childElementCount).toBe(5);
                expect(newli[12].childElementCount).toBe(2);
                treeObj.expandAll(null, 3);
                let nli: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                expect(nli[0].childElementCount).toBe(3);
                expect(nli[0].children[2].childElementCount).toBe(1);
                expect(nli[11].childElementCount).toBe(3);
                expect(nli[11].children[2].childElementCount).toBe(5);
                expect(nli[12].childElementCount).toBe(3);
                expect(nli[12].children[2].childElementCount).toBe(2);
                expect(nli[14].childElementCount).toBe(3);
                expect(nli[14].children[2].childElementCount).toBe(1);
            });
            it('checkAll with disabled property', (done: Function) => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                treeObj.disabled = true;
                treeObj.showCheckBox = true;
                treeObj.dataBind();
                treeObj.checkAll(['01']);
                setTimeout(function() {
                     expect(treeObj.checkedNodes.length === 2 ).toBe(true);
                    done();
                }, 450);
            });

            it('expandAll with excludeHiddenNodes', (done: Function) => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                expect(li[0].childElementCount).toBe(2);                
                treeObj.expandAll(null, 1, true);
                let newli: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                expect(newli[0].childElementCount).toBe(3);
                expect(newli[0].children[2].childElementCount).toBe(1);
                expect(newli[11].childElementCount).toBe(3);
                expect(newli[11].children[2].childElementCount).toBe(5);
                expect(newli[12].childElementCount).toBe(2);
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    mouseEventArgs.target = newli[11].querySelector('.e-icons');
                    treeObj.touchClickObj.tap(tapEvent);
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function() {
                        treeObj.expandAll(null, 2, true);
                        expect(newli[12].childElementCount).toBe(2);
                        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                        setTimeout(function() {
                            mouseEventArgs.target = newli[11].querySelector('.e-icons');
                            treeObj.touchClickObj.tap(tapEvent);
                            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                            setTimeout(function() {
                                treeObj.expandAll(null, 0, true);
                                expect(newli[12].childElementCount).toBe(2);
                                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                                setTimeout(function() {
                                    treeObj.expandAll(null, null, true);
                                    let nli: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                                    expect(nli[0].childElementCount).toBe(3);
                                    expect(nli[0].children[2].childElementCount).toBe(1);
                                    expect(nli[11].childElementCount).toBe(3);
                                    expect(nli[11].children[2].childElementCount).toBe(5);
                                    expect(nli[12].childElementCount).toBe(3);
                                    expect(nli[12].children[2].childElementCount).toBe(2);
                                    expect(nli[14].childElementCount).toBe(3);
                                    expect(nli[14].children[2].childElementCount).toBe(1);
                                    done();
                                }, 450);
                            }, 450);
                        }, 450);
                    }, 450);
                }, 450);
            });
            it('collapseAll', (done: Function) => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                expect(li[0].childElementCount).toBe(2);
                treeObj.expandAll();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    let newli: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                    expect(newli[0].childElementCount).toBe(3);
                    expect(newli[0].children[2].childElementCount).toBe(1);
                    expect(li[0].getAttribute('aria-expanded')).toBe('true');
                    expect(treeObj.expandedNodes.length).toBe(7);
                    treeObj.collapseAll();
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function() {
                        expect(li[0].getAttribute('aria-expanded')).toBe('false');
                        expect(treeObj.expandedNodes.length).toBe(0);
                        done();
                    }, 450);
                }, 450);
            });
            it('collapseAll with specific nodes', (done: Function) => {
                treeObj.expandAll();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                    expect(li[0].querySelector('.e-icons').classList.contains('e-icon-collapsible')).toBe(true);
                    treeObj.collapseAll(['01', li[2], '03', '099', '07']);
                    expect(li[0].querySelector('.e-icons').classList.contains('e-icon-collapsible')).toBe(false);
                    expect(li[2].querySelector('.e-icons').classList.contains('e-icon-collapsible')).toBe(false);
                    expect(li[5].querySelector('.e-icons').classList.contains('e-icon-collapsible')).toBe(false);
                    treeObj.collapseAll('04');
                    expect(li[11].querySelector('.e-icons').classList.contains('e-icon-collapsible')).toBe(true);
                    treeObj.collapseAll(null);
                    expect(li[12].querySelector('.e-icons').classList.contains('e-icon-collapsible')).toBe(false);
                    done();
                }, 450);
            });
            it('collapseAll with level', (done: Function) => {
                treeObj.expandAll();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                    expect(li[0].querySelector('.e-icons').classList.contains('e-icon-collapsible')).toBe(true);
                    treeObj.collapseAll(null, 1);
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function() {
                        expect(li[0].querySelector('.e-icons').classList.contains('e-icon-collapsible')).toBe(false);
                        expect(li[11].querySelector('.e-icons').classList.contains('e-icon-collapsible')).toBe(false);
                        expect(li[12].querySelector('.e-icons').classList.contains('e-icon-collapsible')).toBe(true);
                        treeObj.collapseAll(null, 3);
                        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                        setTimeout(function() {
                            let nli: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                            expect(li[12].querySelector('.e-icons').classList.contains('e-icon-collapsible')).toBe(false);
                            expect(li[14].querySelector('.e-icons').classList.contains('e-icon-collapsible')).toBe(false);                            
                            done();
                        }, 450);
                    }, 450);
                }, 450);
            });
            it('collapseAll with excludeHiddenNodes', (done: Function) => {
                treeObj.expandAll();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    treeObj.collapseAll(null, 1, true);
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function() {
                        let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                        expect(li[0].querySelector('.e-icons').classList.contains('e-icon-collapsible')).toBe(false);
                        expect(li[11].querySelector('.e-icons').classList.contains('e-icon-collapsible')).toBe(false);
                        expect(li[12].querySelector('.e-icons').classList.contains('e-icon-collapsible')).toBe(true);
                        treeObj.collapseAll(null, 2, true);
                        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                        setTimeout(function() {
                            expect(li[12].querySelector('.e-icons').classList.contains('e-icon-collapsible')).toBe(true);
                            treeObj.collapseAll(null, 0, true);
                            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                            setTimeout(function() {
                                mouseEventArgs.target = li[11].querySelector('.e-icons');
                                treeObj.touchClickObj.tap(tapEvent);
                                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                                setTimeout(function() {
                                    expect(li[12].querySelector('.e-icons').classList.contains('e-icon-collapsible')).toBe(true);
                                    treeObj.collapseAll(null, null, true);
                                    let nli: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                                    expect(nli[12].querySelector('.e-icons').classList.contains('e-icon-collapsible')).toBe(false);
                                    expect(nli[14].querySelector('.e-icons').classList.contains('e-icon-collapsible')).toBe(false);
                                    done();
                                }, 450);
                            }, 450);
                        }, 450);
                    }, 450);
                }, 450);
            });
            it('ensureVisible', (done: Function) => {
                treeObj.expandAll();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    treeObj.collapseAll(null, 1, true);
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function() {
                        let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                        treeObj.ensureVisible('0');
                        treeObj.ensureVisible('04-01-01');
                        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                        setTimeout(function() {
                            expect(li[11].querySelector('.e-icons').classList.contains('e-icon-collapsible')).toBe(true);
                            expect(li[12].querySelector('.e-icons').classList.contains('e-icon-collapsible')).toBe(true);
                            treeObj.ensureVisible(li[15]);
                            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                            setTimeout(function() {
                                expect(li[14].querySelector('.e-icons').classList.contains('e-icon-collapsible')).toBe(true);
                                done();
                            }, 450);
                        }, 450);
                    }, 450);
                }, 450);
            });
            it('disableNodes', () => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                expect(li[0].classList.contains('e-disable')).toBe(false);
                expect(li[0].getAttribute('aria-disabled')).toBe(null);
                treeObj.disableNodes(['01', li[2], '03', '099', '07']);
                expect(treeObj.getDisabledNodes().length).toEqual(3);
                expect(li[0].classList.contains('e-disable')).toBe(true);
                expect(li[0].getAttribute('aria-disabled')).toBe('true');
                expect(li[2].classList.contains('e-disable')).toBe(true);
                expect(li[2].getAttribute('aria-disabled')).toBe('true');
                expect(li[8].classList.contains('e-disable')).toBe(true);
                expect(li[8].getAttribute('aria-disabled')).toBe('true');
                treeObj.disableNodes(null);
                expect(treeObj.getDisabledNodes().length).toEqual(3);
                expect(li[3].classList.contains('e-disable')).toBe(false);
                expect(li[3].getAttribute('aria-disabled')).toBe(null);
            });
            it('disableNodes with invalidId', () => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                expect(li[0].classList.contains('e-disable')).toBe(false);
                expect(li[0].getAttribute('aria-disabled')).toBe(null);
                treeObj.disableNodes([]);
                treeObj.disableNodes([li[9]]);
                 treeObj.disableNodes(['100']);
                for(let i:number=0;i< li.length; i++) {
                expect(li[i].classList.contains('e-disable')).toBe(false);
                expect(li[i].getAttribute('aria-disabled')).toBe(null);
                }
                expect(treeObj.getDisabledNodes().length).toEqual(0);
            });
            it('enableNodes', () => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                treeObj.disableNodes(['01', li[2], '03', '099', '07']);
                expect(li[0].classList.contains('e-disable')).toBe(true);
                expect(li[2].classList.contains('e-disable')).toBe(true);
                expect(li[8].classList.contains('e-disable')).toBe(true);
                expect(treeObj.getDisabledNodes().length).toEqual(3);
                treeObj.enableNodes(['01', li[2], '099']);
                expect(li[0].classList.contains('e-disable')).toBe(false);
                expect(li[0].getAttribute('aria-disabled')).toBe(null);
                expect(li[2].classList.contains('e-disable')).toBe(false);
                expect(li[2].getAttribute('aria-disabled')).toBe(null);
                expect(li[8].classList.contains('e-disable')).toBe(true);
                expect(li[8].getAttribute('aria-disabled')).toBe('true');
                expect(treeObj.getDisabledNodes().length).toEqual(1);
            });
            it('enableNodes', () => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                treeObj.disableNodes(['01', li[2]]);
                expect(treeObj.getDisabledNodes().length).toEqual(2);
                expect(li[0].classList.contains('e-disable')).toBe(true);
                expect(li[2].classList.contains('e-disable')).toBe(true);
                treeObj.enableNodes([]);
                expect(li[0].classList.contains('e-disable')).toBe(true);
                expect(li[2].classList.contains('e-disable')).toBe(true);
                expect(treeObj.getDisabledNodes().length).toEqual(2);
                treeObj.enableNodes(['001'])
                expect(li[0].classList.contains('e-disable')).toBe(true);
                expect(li[2].classList.contains('e-disable')).toBe(true);
                expect(li[0].getAttribute('aria-disabled')).toBe('true');
                expect(treeObj.getDisabledNodes().length).toEqual(2);
            });
            it('getNode', () => {
                expect(treeObj.getNode(null).text).toBe('');
                expect(treeObj.getNode(1).text).toBe('');
                expect(treeObj.getNode('0').text).toBe('');
                expect(treeObj.getNode('01').text).toBe('Music');
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                expect(treeObj.getNode(li[1]).text).toBe('Videos');
            });
            it('getTreeData', (done: Function) => {
                expect(treeObj.getTreeData(null).length).toBe(9);
                expect(treeObj.getTreeData('0').length).toBe(0);
                expect(treeObj.getTreeData('01')[0].nodeText).toBe('Music');
                expect(treeObj.getTreeData('02-01')[0].nodeText).toBe('Naturals.mp4');
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                expect(treeObj.getTreeData(li[1])[0].nodeText).toBe('Videos');
                treeObj.allowEditing = true;
                treeObj.dataBind();
                treeObj.updateNode(li[0], 'Rain');
                expect(treeObj.getTreeData('01')[0].nodeText).toBe('Rain');
                mouseEventArgs.target = li[1].querySelector('.e-list-text');
                treeObj.touchClickObj.tap(tapEvent);
                expect(treeObj.getTreeData(li[1])[0].selected).toBe(true);
                treeObj.showCheckBox = true;
                treeObj.dataBind();
                let li1: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                mouseEventArgs.target = li1[0].querySelector('.e-icons');
                treeObj.touchClickObj.tap(tapEvent);
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    expect(treeObj.getTreeData('01')[0].expanded).toBe(true);
                    let newli: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                    mouseEventArgs.target = newli[1].querySelector('.e-icons');
                    treeObj.touchClickObj.tap(tapEvent);
                    expect(treeObj.getTreeData('01-01')[0].isChecked).toBe(true);
                    done();
                }, 450)
            });
            it('moveNodes', (done: Function) => {
                expect(j).toEqual(0);
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                treeObj.moveNodes(null, '0');
                treeObj.moveNodes(['01','02'], '03');
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    expect(li[2].childElementCount).toBe(3);
                    expect(li[2].children[2].childElementCount).toBe(7);
                    expect(li[1].parentNode.parentNode).toBe(li[2]);
                    expect(li[0].parentNode.parentNode).toBe(li[2]);
                    expect(treeObj.expandedNodes.length).toBe(1);
                    expect(treeObj.getTreeData('03')[0]['nodeChild'][5]['nodeText']).toBe('Music');
                    expect(treeObj.getTreeData('03')[0]['nodeChild'][6]['nodeText']).toBe('Videos');
                    expect(j).toEqual(1);
                    treeObj.moveNodes(['03', li[0]], '02', 0);
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function() {
                        expect(li[1].childElementCount).toBe(3);
                        expect(li[1].children[2].childElementCount).toBe(3);
                        expect(li[0].parentNode.parentNode).toBe(li[1]);
                        expect(li[2].parentNode.parentNode).not.toBe(li[1]);
                        expect(treeObj.expandedNodes.length).toBe(2);
                        expect(treeObj.getTreeData('02')[0]['nodeChild'][0]['nodeText']).toBe('Music');
                        expect(j).toEqual(2);
                        done();
                    }, 500);
                }, 500);
            });
            it('removeNodes', () => {
                expect(j).toEqual(0);
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                treeObj.selectedNodes = ['02'];
                treeObj.dataBind();
                expect(treeObj.liList.length).toBe(9);
                expect(treeObj.getTreeData().length).toBe(9);
                treeObj.removeNodes();
                expect(treeObj.liList.length).toBe(9);
                expect(treeObj.getTreeData().length).toBe(9);
                expect(j).toEqual(0);
                treeObj.removeNodes(null);
                expect(treeObj.liList.length).toBe(9);
                expect(treeObj.getTreeData().length).toBe(9);
                expect(j).toEqual(0);
                treeObj.removeNodes('0');
                expect(treeObj.liList.length).toBe(9);
                expect(treeObj.getTreeData().length).toBe(9);
                expect(j).toEqual(1);
                treeObj.removeNodes(['01','02']);
                expect(treeObj.liList.length).toBe(7);
                expect(treeObj.getTreeData().length).toBe(7);
                expect(j).toEqual(2);
                treeObj.removeNodes([li[2]]);
                expect(treeObj.liList.length).toBe(6);
                expect(treeObj.getTreeData().length).toBe(6);
                expect(j).toEqual(3);
                expect(treeObj.liList.length).toBe(treeObj.element.querySelectorAll('li').length);
                expect(treeObj.selectedNodes.length).toBe(0);
            });
            it('refreshNode with target as li with collapsed state', () => {
                expect(j).toEqual(0);
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                var data = [{nodeText: 'RefreshedNode', iconCss: 'file', navigateUrl: 'https://ej2.syncfusion.com/home/', tooltip: 'This is refreshed node'}]
                treeObj.refreshNode(li[0], data);
                treeObj.dataBind();
                var refreshedLi = treeObj.element.querySelectorAll('li')[0];
                expect(j).toEqual(1);
                expect(refreshedLi.querySelector('.e-list-icon').classList.contains('file')).toBe(true);
                expect(refreshedLi.getAttribute('title')).toBe("This is refreshed node");
                expect((refreshedLi.querySelector('.e-list-url') as any).href.indexOf('https://ej2.syncfusion.com/home/')).not.toBe(-1);
                treeObj.expandedNodes = ['01'];
                treeObj.dataBind();
                expect(refreshedLi.querySelector('ul li').querySelector('.e-list-text').textContent).toBe("Gouttes.mp3");
                expect(treeObj.getTreeData('01')[0].nodeText).toBe("RefreshedNode");
                expect(treeObj.getTreeData('01')[0].nodeChild[0].nodeId).toBe("01-01");
            });
            it('refreshNode with target as id with expanded state', () => {
                expect(j).toEqual(0);
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                treeObj.expandedNodes = ['01'];
                treeObj.dataBind();
                var data = [{nodeText: 'RefreshedNode', iconCss: 'file', navigateUrl: 'https://ej2.syncfusion.com/home/', tooltip: 'This is refreshed node'}]
                treeObj.refreshNode('01', data);
                treeObj.dataBind();
                var refreshedLi = treeObj.element.querySelectorAll('li')[0];
                expect(j).toEqual(1);
                expect(refreshedLi.querySelector('.e-list-icon').classList.contains('file')).toBe(true);
                expect(refreshedLi.getAttribute('title')).toBe("This is refreshed node");
                expect((refreshedLi.querySelector('.e-list-url') as any).href.indexOf('https://ej2.syncfusion.com/home/')).not.toBe(-1);
                expect(refreshedLi.querySelector('ul li').querySelector('.e-list-text').textContent).toBe("Gouttes.mp3");
                expect(treeObj.getTreeData('01')[0].nodeText).toBe("RefreshedNode");
                expect(treeObj.getTreeData('01')[0].nodeChild[0].nodeId).toBe("01-01");
                expect(refreshedLi.querySelector('.e-icons').classList.contains('e-icon-collapsible'));
            });
            it('refreshNode with target as id without child', () => {
                expect(j).toEqual(0);
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                treeObj.expandedNodes = ['01'];
                treeObj.dataBind();
                var data = [{nodeText: 'RefreshedNode', iconCss: 'file', navigateUrl: 'https://ej2.syncfusion.com/home/', tooltip: 'This is refreshed node'}]
                treeObj.refreshNode('01-01', data);
                treeObj.dataBind();
                var refreshedLi = treeObj.element.querySelectorAll('li')[1];
                expect(j).toEqual(1);
                expect(refreshedLi.querySelector('.e-list-icon').classList.contains('file')).toBe(true);
                expect(refreshedLi.getAttribute('title')).toBe("This is refreshed node");
                expect((refreshedLi.querySelector('.e-list-url') as any).href.indexOf('https://ej2.syncfusion.com/home/')).not.toBe(-1);
                expect(treeObj.getTreeData('01-01')[0].nodeText).toBe("RefreshedNode");
            });
            it('refreshNode with target as id without child and is not rendered in DOM', () => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                var data = [{nodeText: 'RefreshedNode', iconCss: 'file', navigateUrl: 'https://ej2.syncfusion.com/home/', tooltip: 'This is refreshed node'}]
                treeObj.refreshNode('01-01', data);
                treeObj.expandedNodes = ['01'];
                treeObj.dataBind();
                var refreshedLi = treeObj.element.querySelectorAll('li')[1];
                expect(refreshedLi.querySelector('.e-list-icon').classList.contains('file')).toBe(true);
                expect(refreshedLi.getAttribute('title')).toBe("This is refreshed node");
                expect((refreshedLi.querySelector('.e-list-url') as any).href.indexOf('https://ej2.syncfusion.com/home/')).not.toBe(-1);
                expect(treeObj.getTreeData('01-01')[0].nodeText).toBe("RefreshedNode");
            });
            it('refreshNode with target as id and is not rendered in DOM', () => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                var data = [{nodeText: 'RefreshedNode', iconCss: 'file', navigateUrl: 'https://ej2.syncfusion.com/home/', tooltip: 'This is refreshed node'}]
                treeObj.refreshNode('04-01', data);
                treeObj.expandedNodes = ['04'];
                treeObj.dataBind();
                var refreshedLi = li[3].querySelector('ul li');
                expect(refreshedLi.querySelector('.e-list-icon').classList.contains('file')).toBe(true);
                expect(refreshedLi.getAttribute('title')).toBe("This is refreshed node");
                expect((refreshedLi.querySelector('.e-list-url') as any).href.indexOf('https://ej2.syncfusion.com/home/')).not.toBe(-1);
                expect(treeObj.getTreeData('04-01')[0].nodeText).toBe("RefreshedNode");
                expect(treeObj.getTreeData('04-01')[0].nodeChild[0].nodeId).toBe("04-01-01");
                treeObj.expandedNodes = ['04','04-01'];
                expect(refreshedLi.querySelector('.e-icons').classList.contains('e-icon-expandable'));
                expect(treeObj.getTreeData('04-01')[0].nodeChild[0].nodeText).toBe("WIN_20160726_094117.JPG");
            });
            it('refreshNode parent and child nodes together rendered in DOM with parent in expanded state', () => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                var data = [{nodeText: 'RefreshedNode', iconCss: 'folder', navigateUrl: 'https://ej2.syncfusion.com/home/', tooltip: 'This is refreshed node',  nodeChild: [
                    { nodeId: '10-10', nodeText: 'Refreshed child Node', icons: 'file' }] }]
                treeObj.expandedNodes = ['01'];
                treeObj.dataBind();
                treeObj.refreshNode('01', data);
               
                var refreshedLi = treeObj.element.querySelectorAll('li')[0];
                expect(refreshedLi.querySelector('.e-list-icon').classList.contains('folder')).toBe(true);
                expect(refreshedLi.getAttribute('title')).toBe("This is refreshed node");
                expect((refreshedLi.querySelector('.e-list-url') as any).href.indexOf('https://ej2.syncfusion.com/home/')).not.toBe(-1);
                expect(treeObj.getTreeData('01')[0].nodeText).toBe("RefreshedNode");
                expect(treeObj.getTreeData('01')[0].nodeChild.length).toBe(1);
                expect(treeObj.getTreeData('01')[0].nodeChild[0].nodeId).toBe("10-10");
                expect(refreshedLi.querySelector('.e-icons').classList.contains('e-icon-collapsible'));
                expect(treeObj.getTreeData('01')[0].nodeChild[0].nodeText).toBe("Refreshed child Node");
            });
            it('refreshNode parent and child nodes together rendered in DOM with parent in collapsed state', function () {
                var li = treeObj.element.querySelectorAll('li');
                var data = [{ nodeText: 'RefreshedNode', iconCss: 'folder', navigateUrl: 'https://ej2.syncfusion.com/home/', tooltip: 'This is refreshed node', nodeChild: [
                            { nodeId: '10-10', nodeText: 'Refreshed child Node', icons: 'file', nodeChild: [
                                    { nodeId: '10-11', nodeText: 'Refreshed  nested child Node', }
                                ] }
                        ] }];
                treeObj.refreshNode('04', data);
                treeObj.expandedNodes = ['04'];
                treeObj.dataBind();
                expect(li[3].querySelector('.e-list-icon').classList.contains('folder')).toBe(true);
                expect(li[3].getAttribute('title')).toBe("This is refreshed node");
                expect(li[3].querySelector('.e-list-url').href.indexOf('https://ej2.syncfusion.com/home/')).not.toBe(-1);
                expect(treeObj.getTreeData('04')[0].nodeText).toBe("RefreshedNode");
                expect(treeObj.getTreeData('04')[0].nodeChild.length).toBe(1);
                expect(treeObj.getTreeData('04')[0].nodeChild[0].nodeId).toBe("10-10");
                expect(treeObj.getTreeData('04')[0].nodeChild[0].nodeText).toBe("Refreshed child Node");
                treeObj.expandedNodes = ['04','10-10'];
                treeObj.dataBind();
                var refreshedChild = li[3].querySelector('ul li');
                expect(refreshedChild.querySelector('ul li').getAttribute("data-uid")).toBe("10-11");
                expect(refreshedChild.querySelector(".e-list-text").textContent).toBe("Refreshed child Node");
            });
            it('refreshNode parent and child nodes together which is not rendered in DOM', function () {
                var li = treeObj.element.querySelectorAll('li');
                var data = [{ nodeText: 'RefreshedNode', iconCss: 'folder', navigateUrl: 'https://ej2.syncfusion.com/home/', tooltip: 'This is refreshed node', nodeChild: [
                            { nodeId: '10-10', nodeText: 'Refreshed child Node', icons: 'file', nodeChild: [
                                    { nodeId: '10-11', nodeText: 'Refreshed  nested child Node', }
                                ] }
                        ] }];
                treeObj.refreshNode('04-01', data);
                treeObj.expandedNodes = ['04'];
                treeObj.dataBind();
                var refreshedLi = li[3].querySelector('ul li');
                expect(refreshedLi.querySelector('.e-list-icon').classList.contains('folder')).toBe(true);
                expect(refreshedLi.getAttribute('title')).toBe("This is refreshed node");
                expect(refreshedLi.querySelector('.e-list-url').href.indexOf('https://ej2.syncfusion.com/home/')).not.toBe(-1);
                expect(treeObj.getTreeData('04-01')[0].nodeText).toBe("RefreshedNode");
                expect(treeObj.getTreeData('04-01')[0].nodeChild.length).toBe(1);
                expect(treeObj.getTreeData('04-01')[0].nodeChild[0].nodeId).toBe("10-10");
                expect(refreshedLi.querySelector('.e-icons').classList.contains('e-icon-expandable'));
                expect(treeObj.getTreeData('04-01')[0].nodeChild[0].nodeText).toBe("Refreshed child Node");
                treeObj.expandedNodes = ['04', '04-01'];
                treeObj.dataBind();
                var refreshedChild = refreshedLi.querySelector('ul li');
                expect(refreshedChild.getAttribute("data-uid")).toBe("10-10");
                expect(refreshedChild.querySelector(".e-list-text").textContent).toBe("Refreshed child Node");
                expect(treeObj.getTreeData("10-10")[0].nodeChild.length).toBe(1);
                expect(refreshedChild.querySelector(".e-icons").classList.contains('e-icon-expandable')).toBe(true);
                treeObj.expandedNodes = ['04', '04-01', '10-10'];
                treeObj.dataBind();
                var refreshNestedChild = refreshedChild.querySelector('ul li');
                expect(refreshNestedChild.getAttribute("data-uid")).toBe("10-11");
                expect(refreshNestedChild.querySelector(".e-list-text").textContent).toBe("Refreshed  nested child Node");
            });
            it('addNodes', (done: Function) => {
                expect(j).toEqual(0);
                expect(treeObj.expandedNodes.length).toBe(0);
                expect(treeObj.getTreeData().length).toBe(9);
                treeObj.addNodes(null);
                treeObj.addNodes(hierarchicalData4);
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                    expect(treeObj.liList.length).toBe(12);
                    expect(treeObj.liList.length).toBe(li.length);
                    expect(treeObj.expandedNodes.length).toBe(1);
                    expect(treeObj.getTreeData().length).toBe(11);
                    expect(j).toEqual(1);
                    expect(treeObj.element.querySelectorAll('.e-list-text')[9].innerHTML).toBe('Music');
                    expect(treeObj.element.querySelectorAll('.e-list-item')[9].getAttribute('data-uid')).toBe('11');
                    expect(treeObj.element.querySelector('.e-list-icon').classList.contains('folder')).toBe(true);
                    expect(treeObj.element.querySelector('.e-list-img').src.indexOf('images/Shooting.png')).not.toBe(-1);
                    expect(treeObj.element.querySelectorAll('.e-list-item')[9].title).toBe('This is Music node');
                    expect(treeObj.element.querySelectorAll('.e-list-item')[9].classList.contains('e-active')).toBe(true);
                    expect(treeObj.element.querySelectorAll('li')[11].classList.contains('firstnode')).toBe(true);
                    expect(treeObj.element.querySelectorAll('li')[11].style.backgroundColor).toBe('red');
                    treeObj.removeNodes(['11', '12']);
                    expect(treeObj.expandedNodes.length).toBe(0);
                    expect(treeObj.getTreeData().length).toBe(9);
                    expect(j).toEqual(2);
                    treeObj.addNodes(hierarchicalData4, '01');
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function() {
                        let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                        expect(treeObj.liList.length).toBe(13);
                        expect(treeObj.liList.length).toBe(li.length);
                        expect(treeObj.expandedNodes.length).toBe(2);
                        expect(treeObj.getTreeData().length).toBe(9);
                        expect(j).toEqual(3);
                        expect(treeObj.element.querySelectorAll('.e-list-text')[2].innerHTML).toBe('Music');
                        expect(treeObj.element.querySelectorAll('.e-list-item')[2].getAttribute('data-uid')).toBe('11');
                        expect(treeObj.element.querySelector('.e-list-icon').classList.contains('folder')).toBe(true);
                        expect(treeObj.element.querySelector('.e-list-img').src.indexOf('images/Shooting.png')).not.toBe(-1);
                        expect(treeObj.element.querySelectorAll('.e-list-item')[2].title).toBe('This is Music node');
                        expect(treeObj.element.querySelectorAll('.e-list-item')[2].classList.contains('e-active')).toBe(true);
                        expect(treeObj.element.querySelectorAll('li')[4].classList.contains('firstnode')).toBe(true);
                        expect(treeObj.element.querySelectorAll('li')[4].style.backgroundColor).toBe('red');
                        treeObj.removeNodes(['11', '12']);
                        expect(treeObj.expandedNodes.length).toBe(1);
                        expect(treeObj.getTreeData().length).toBe(9);
                        expect(j).toEqual(4);
                        treeObj.addNodes(hierarchicalData4, null, 1);
                        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                        setTimeout(function() {
                            let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                            expect(treeObj.liList.length).toBe(13);
                            expect(treeObj.liList.length).toBe(li.length);
                            expect(treeObj.expandedNodes.length).toBe(2);
                            expect(treeObj.getTreeData().length).toBe(11);
                            expect(j).toEqual(5);
                            expect(treeObj.element.querySelectorAll('.e-list-text')[2].innerHTML).toBe('Music');
                            expect(treeObj.element.querySelectorAll('.e-list-item')[2].getAttribute('data-uid')).toBe('11');
                            expect(treeObj.element.querySelector('.e-list-icon').classList.contains('folder')).toBe(true);
                            expect(treeObj.element.querySelector('.e-list-img').src.indexOf('images/Shooting.png')).not.toBe(-1);
                            expect(treeObj.element.querySelectorAll('.e-list-item')[2].title).toBe('This is Music node');
                            expect(treeObj.element.querySelectorAll('.e-list-item')[2].classList.contains('e-active')).toBe(true);
                            expect(treeObj.element.querySelectorAll('li')[4].classList.contains('firstnode')).toBe(true);
                            expect(treeObj.element.querySelectorAll('li')[4].style.backgroundColor).toBe('red');
                            treeObj.removeNodes(['11', '12']);
                            expect(treeObj.expandedNodes.length).toBe(1);
                            expect(treeObj.getTreeData().length).toBe(9);
                            expect(j).toEqual(6);
                            treeObj.addNodes(hierarchicalData4, '01', 0);
                            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                            setTimeout(function() {
                                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                                expect(treeObj.liList.length).toBe(13);
                                expect(treeObj.liList.length).toBe(li.length);
                                expect(treeObj.expandedNodes.length).toBe(2);
                                expect(treeObj.getTreeData().length).toBe(9);
                                expect(j).toEqual(7);
                                expect(treeObj.element.querySelectorAll('.e-list-text')[1].innerHTML).toBe('Music');
                                expect(treeObj.element.querySelectorAll('.e-list-item')[1].getAttribute('data-uid')).toBe('11');
                                expect(treeObj.element.querySelector('.e-list-icon').classList.contains('folder')).toBe(true);
                                expect(treeObj.element.querySelector('.e-list-img').src.indexOf('images/Shooting.png')).not.toBe(-1);
                                expect(treeObj.element.querySelectorAll('.e-list-item')[1].title).toBe('This is Music node');
                                expect(treeObj.element.querySelectorAll('.e-list-item')[1].classList.contains('e-active')).toBe(true);
                                expect(treeObj.element.querySelectorAll('li')[3].classList.contains('firstnode')).toBe(true);
                                expect(treeObj.element.querySelectorAll('li')[3].style.backgroundColor).toBe('red');
                                treeObj.removeNodes(['11', '12']);
                                expect(treeObj.expandedNodes.length).toBe(1);
                                expect(treeObj.getTreeData().length).toBe(9);
                                expect(j).toEqual(8);
                                treeObj.addNodes(hierarchicalData4, '01-01');
                                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                                setTimeout(function() {
                                    let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                                    expect(treeObj.liList.length).toBe(13);
                                    expect(treeObj.liList.length).toBe(li.length);
                                    expect(treeObj.expandedNodes.length).toBe(3);
                                    expect(treeObj.getTreeData().length).toBe(9);
                                    expect(j).toEqual(9);
                                    expect(treeObj.element.querySelectorAll('.e-list-text')[2].innerHTML).toBe('Music');
                                    treeObj.addNodes([], '01-01');
                                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 500;
                                    setTimeout(function() {
                                        let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                                        expect(treeObj.liList.length).toBe(13);
                                        done();
                                    }, 500);
                                }, 500);
                            }, 500);
                        }, 500);
                    }, 500);
                }, 500);
            });
            it('destroy', () => {
                treeObj.destroy();
                expect(treeObj.element.className).toBe('');
                expect(treeObj.element.childElementCount).toBe(0);
            });
        });
        describe('animation testing', () => {
            let mouseEventArgs: any;
            let tapEvent: any;
            let treeObj: any;
            let i: number = 0;
            let originalTimeout: any;
            let nodeData: any;
            function clickFn(args:NodeExpandEventArgs): void {
                i++;
                nodeData= args.nodeData;
            }
            beforeEach((): void => {
                mouseEventArgs = {
                    preventDefault: (): void => {},
                    stopImmediatePropagation: (): void => {},
                    target: null,
                    type: null,
                    shiftKey: false,
                    ctrlKey: false
                };
                tapEvent = {
                    originalEvent: mouseEventArgs,
                    tapCount: 1
                };
                treeObj = undefined;
                i = 0;
                let ele: HTMLElement = createElement('div', { id: 'tree1' });
                document.body.appendChild(ele);
                originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            });
            afterEach((): void => {
                if (treeObj)
                    treeObj.destroy();
                document.body.innerHTML = '';
                jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            });
            it('default value with nodeExpanded event', (done: Function) => {
                treeObj = new TreeView({
                    fields: { dataSource: hierarchicalData1, id: "nodeId", text: "nodeText", child:"nodeChild" },
                    nodeExpanded: clickFn,
                },'#tree1');
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                mouseEventArgs.target = li[0].querySelector('.e-icons');
                treeObj.touchClickObj.tap(tapEvent);
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    expect(i).toEqual(1);
                    expect(nodeData.id).toBe("01");
                    done();
                }, 450);
            });
            it('default value with nodeCollapsed event', (done: Function) => {
                treeObj = new TreeView({
                    fields: { dataSource: hierarchicalData1, id: "nodeId", text: "nodeText", child:"nodeChild" },
                    nodeCollapsed: clickFn,
                },'#tree1');
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                mouseEventArgs.target = li[0].querySelector('.e-icons');
                treeObj.touchClickObj.tap(tapEvent);
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    treeObj.touchClickObj.tap(tapEvent);
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function() {
                        expect(i).toEqual(1);
                        expect(nodeData.id).toBe("01");
                        done();
                    }, 450);
                }, 450);
            });
            it('disable expand animation', (done: Function) => {
                treeObj = new TreeView({
                    fields: { dataSource: hierarchicalData1, id: "nodeId", text: "nodeText", child:"nodeChild" },
                    nodeExpanded: clickFn,
                    animation: { expand: { duration: 0 } }
                },'#tree1');
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                mouseEventArgs.target = li[0].querySelector('.e-icons');
                treeObj.touchClickObj.tap(tapEvent);
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    expect(i).toEqual(1);
                    done();
                }, 100);
            });
            it('disable collpase animation', (done: Function) => {
                treeObj = new TreeView({
                    fields: { dataSource: hierarchicalData1, id: "nodeId", text: "nodeText", child:"nodeChild" },
                    nodeCollapsed: clickFn,
                    animation: { collapse: { duration: 0 } }
                },'#tree1');
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                mouseEventArgs.target = li[0].querySelector('.e-icons');
                treeObj.touchClickObj.tap(tapEvent);
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    treeObj.touchClickObj.tap(tapEvent);
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function() {
                        expect(i).toEqual(1);
                        done();
                    }, 100);
                }, 450);
            });
            it('property change expand animation', (done: Function) => {
                treeObj = new TreeView({
                    fields: { dataSource: hierarchicalData1, id: "nodeId", text: "nodeText", child:"nodeChild" },
                    nodeExpanded: clickFn,                    
                },'#tree1');
                treeObj.animation = { expand: { duration: 100 } };
                treeObj.dataBind();
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                mouseEventArgs.target = li[0].querySelector('.e-icons');
                treeObj.touchClickObj.tap(tapEvent);
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    expect(i).toEqual(1);
                    done();
                }, 150);
            });
            it('property change collpase animation', (done: Function) => {
                treeObj = new TreeView({
                    fields: { dataSource: hierarchicalData1, id: "nodeId", text: "nodeText", child:"nodeChild" },
                    nodeCollapsed: clickFn,
                },'#tree1');
                treeObj.animation = { collapse: { duration: 100 } };
                treeObj.dataBind();
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                mouseEventArgs.target = li[0].querySelector('.e-icons');
                treeObj.touchClickObj.tap(tapEvent);
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    treeObj.touchClickObj.tap(tapEvent);
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function() {
                        expect(i).toEqual(1);
                        done();
                    }, 150);
                }, 450);
            });
        });
        describe('Drag and drop functionality testing', () => {
            let treeObj: any;
            let mouseEventArgs: any;
            let tapEvent: any;
            beforeEach((done: Function): void => {
                mouseEventArgs = {
                    preventDefault: (): void => {},
                    stopImmediatePropagation: (): void => {},
                    target: null,
                    type: null,
                    shiftKey: false,
                    ctrlKey: false
                };
                tapEvent = {
                    originalEvent: mouseEventArgs,
                    tapCount: 1
                };
                treeObj = undefined;
                let ele: HTMLElement = createElement('div', { id: 'tree1' });
                document.body.appendChild(ele);
                treeObj = new TreeView({ 
                    fields: { dataSource: hierarchicalData1, id: "nodeId", text: "nodeText", child: "nodeChild", navigateUrl: 'nodeUrl', iconCss: 'nodeIcon', imageUrl: 'nodeImage1', expanded: 'nodeExpanded1' },
                    allowDragAndDrop: true,
                    fullRowSelect: false,
                    dataBound: ()=> {
                        done();
                    }
                },'#tree1');
            });
            afterEach((): void => {
                if (treeObj)
                    treeObj.destroy();
                document.body.innerHTML = '';
            });
            it('testing with target as text', () => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                let mousedown: any = getEventObject('MouseEvents', 'mousedown', treeObj.element, li[2].querySelector('.e-list-text'), 15, 10);
                EventHandler.trigger(treeObj.element, 'mousedown', mousedown);
                let mousemove: any = getEventObject('MouseEvents', 'mousemove', treeObj.element, li[2].querySelector('.e-list-text'), 15, 70);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                mousemove.srcElement = mousemove.target = mousemove.toElement = li[1].querySelector('.e-list-text');
                mousemove = setMouseCordinates(mousemove, 15, 75);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                let mouseup: any = getEventObject('MouseEvents', 'mouseup', treeObj.element, li[1].querySelector('.e-list-text'));
                mouseup.type = 'mouseup';
                EventHandler.trigger(<any>(document), 'mouseup', mouseup);
                expect(li[1].childElementCount).toBe(2);
                expect(li[1].children[1].childElementCount).toBe(1);
                expect(li[1].getAttribute('aria-expanded')).toBe('true');
                expect(li[2].getAttribute('aria-level')).toBe('3');
                expect(treeObj.getTreeData('01-01')[0]['nodeChild'][0]['nodeText']).toBe('Videos');
            });
            it('testing with drag element as parent', () => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                expect(li[0].getAttribute('aria-level')).toBe('1');
                expect(li[1].getAttribute('aria-level')).toBe('2');
                let mousedown: any = getEventObject('MouseEvents', 'mousedown', treeObj.element, li[0].querySelector('.e-list-text'), 15, 10);
                EventHandler.trigger(treeObj.element, 'mousedown', mousedown);
                let mousemove: any = getEventObject('MouseEvents', 'mousemove', treeObj.element, li[0].querySelector('.e-list-text'), 15, 70);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                mousemove.srcElement = mousemove.target = mousemove.toElement = li[9].querySelector('.e-list-text');
                mousemove = setMouseCordinates(mousemove, 15, 75);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                let mouseup: any = getEventObject('MouseEvents', 'mouseup', treeObj.element, li[9].querySelector('.e-list-text'));
                mouseup.type = 'mouseup';
                EventHandler.trigger(<any>(document), 'mouseup', mouseup);
                expect(li[9].childElementCount).toBe(2);
                expect(li[9].children[1].childElementCount).toBe(1);
                expect(li[9].getAttribute('aria-expanded')).toBe('true');
                expect(li[0].getAttribute('aria-level')).toBe('3');
                expect(li[1].getAttribute('aria-level')).toBe('4');
                expect(treeObj.getTreeData('05-04')[0]['nodeChild'][0]['nodeText']).toBe('Music');
            });
            it('testing with target as expand icon', () => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                let mousedown: any = getEventObject('MouseEvents', 'mousedown', treeObj.element, li[3].querySelector('.e-icons'),15, 10, 19, 9);
                EventHandler.trigger(treeObj.element, 'mousedown', mousedown);
                let mousemove: any = getEventObject('MouseEvents', 'mousemove', treeObj.element, li[3].querySelector('.e-icons'), 15, 70, 19, 9);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                mousemove.srcElement = mousemove.target = mousemove.toElement = li[0].querySelector('.e-icons');
                mousemove = setMouseCordinates(mousemove, 15, 75);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                let mouseup: any = getEventObject('MouseEvents', 'mouseup', treeObj.element, li[0].querySelector('.e-icons'), undefined, undefined, 19, 9);
                mouseup.type = 'mouseup';
                EventHandler.trigger(<any>(document), 'mouseup', mouseup);
                expect(li[0].childElementCount).toBe(2);
                expect(li[0].children[1].childElementCount).toBe(2);
                expect(treeObj.getTreeData('01')[0]['nodeChild'][1]['nodeText']).toBe('Documents');
            });
            it('testing with target as collapse icon', () => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                let mousedown: any = getEventObject('MouseEvents', 'mousedown', treeObj.element, li[3].querySelector('.e-icons'),15, 10, 4, 9);
                EventHandler.trigger(treeObj.element, 'mousedown', mousedown);
                let mousemove: any = getEventObject('MouseEvents', 'mousemove', treeObj.element, li[3].querySelector('.e-icons'), 15, 70, 4, 9);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                mousemove.srcElement = mousemove.target = mousemove.toElement = li[5].querySelector('.e-icons');
                mousemove = setMouseCordinates(mousemove, 15, 75);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                let mouseup: any = getEventObject('MouseEvents', 'mouseup', treeObj.element, li[5].querySelector('.e-icons'), undefined, undefined, 4, 9);
                mouseup.type = 'mouseup';
                EventHandler.trigger(<any>(document), 'mouseup', mouseup);
                expect(li[5].childElementCount).toBe(2);
                expect(li[5].children[1].childElementCount).toBe(5);
                expect(treeObj.getTreeData('05')[0]['nodeChild'][4]['nodeText']).toBe('Documents');
            });
            it('testing with target as expand icon and dropping as previous sibling', () => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                let mousedown: any = getEventObject('MouseEvents', 'mousedown', treeObj.element, li[2].querySelector('.e-icons'),15, 10, 4);
                EventHandler.trigger(treeObj.element, 'mousedown', mousedown);
                let mousemove: any = getEventObject('MouseEvents', 'mousemove', treeObj.element, li[2].querySelector('.e-icons'), 15, 70, 4);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                mousemove.srcElement = mousemove.target = mousemove.toElement = li[4].querySelector('.e-icons');
                mousemove = setMouseCordinates(mousemove, 15, 75);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                let mouseup: any = getEventObject('MouseEvents', 'mouseup', treeObj.element, li[4].querySelector('.e-icons'), undefined, undefined, 2);
                mouseup.type = 'mouseup';
                EventHandler.trigger(<any>(document), 'mouseup', mouseup);
                expect(li[4].getAttribute("data-uid")).toBe("04");
            });
            it('testing with target as custom icon', () => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                let mousedown: any = getEventObject('MouseEvents', 'mousedown', treeObj.element, li[1].querySelector('.e-list-icon'), 15, 10);
                EventHandler.trigger(treeObj.element, 'mousedown', mousedown);
                let mousemove: any = getEventObject('MouseEvents', 'mousemove', treeObj.element, li[1].querySelector('.e-list-icon'), 15, 70);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                mousemove.srcElement = mousemove.target = mousemove.toElement = li[5].querySelector('.e-list-icon');
                mousemove = setMouseCordinates(mousemove, 15, 75);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                let mouseup: any = getEventObject('MouseEvents', 'mouseup', treeObj.element, li[5].querySelector('.e-list-icon'));
                mouseup.type = 'mouseup';
                EventHandler.trigger(<any>(document), 'mouseup', mouseup);
                expect(li[0].childElementCount).toBe(1);
                expect(li[0].getAttribute('aria-expanded')).toBe(null);
                expect(li[5].childElementCount).toBe(2);
                expect(li[5].children[1].childElementCount).toBe(5);
                expect(treeObj.getTreeData('05')[0]['nodeChild'][4]['nodeText']).toBe('Gouttes.mp3');
            });
            it('testing with target as custom image', () => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                let mousedown: any = getEventObject('MouseEvents', 'mousedown', treeObj.element, li[2].querySelector('.e-list-img'), 15, 10);
                EventHandler.trigger(treeObj.element, 'mousedown', mousedown);
                let mousemove: any = getEventObject('MouseEvents', 'mousemove', treeObj.element, li[2].querySelector('.e-list-img'), 15, 70);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                mousemove.srcElement = mousemove.target = mousemove.toElement = li[0].querySelector('.e-list-img');
                mousemove = setMouseCordinates(mousemove, 15, 75);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                let mouseup: any = getEventObject('MouseEvents', 'mouseup', treeObj.element, li[0].querySelector('.e-list-img'));
                mouseup.type = 'mouseup';
                EventHandler.trigger(<any>(document), 'mouseup', mouseup);
                expect(li[0].childElementCount).toBe(2);
                expect(li[0].children[1].childElementCount).toBe(2);
                expect(li[2].childElementCount).toBe(1);
                expect(treeObj.getTreeData('01')[0]['nodeChild'][1]['nodeText']).toBe('Videos');
            });
            it('testing with target as text wrapper with child', () => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                let mousedown: any = getEventObject('MouseEvents', 'mousedown', treeObj.element, li[2].querySelector('.e-text-content'), 15, 10);
                EventHandler.trigger(treeObj.element, 'mousedown', mousedown);
                let mousemove: any = getEventObject('MouseEvents', 'mousemove', treeObj.element, li[2].querySelector('.e-text-content'), 15, 70);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                mousemove.srcElement = mousemove.target = mousemove.toElement = li[1].querySelector('.e-text-content');
                mousemove = setMouseCordinates(mousemove, 15, 75);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                expect(document.querySelector('.e-drop-in')).not.toBe(null);
                let mouseup: any = getEventObject('MouseEvents', 'mouseup', treeObj.element, li[1].querySelector('.e-text-content'));
                mouseup.type = 'mouseup';
                EventHandler.trigger(<any>(document), 'mouseup', mouseup);
                expect(li[1].childElementCount).toBe(2);
                expect(li[1].children[1].childElementCount).toBe(1);
                expect(li[1].getAttribute('aria-expanded')).toBe('true');
                expect(treeObj.getTreeData('01-01')[0]['nodeChild'][0]['nodeText']).toBe('Videos');
            });
            it('testing with target as text wrapper with out child', (done: Function) => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                let mousedown: any = getEventObject('MouseEvents', 'mousedown', treeObj.element, li[2].querySelector('.e-text-content'), 15, 10);
                EventHandler.trigger(treeObj.element, 'mousedown', mousedown);
                let mousemove: any = getEventObject('MouseEvents', 'mousemove', treeObj.element, li[2].querySelector('.e-text-content'), 15, 70);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                mousemove.srcElement = mousemove.target = mousemove.toElement = li[3].querySelector('.e-text-content');
                mousemove = setMouseCordinates(mousemove, 15, 75);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                expect(document.querySelector('.e-drop-in')).not.toBe(null);
                let mouseup: any = getEventObject('MouseEvents', 'mouseup', treeObj.element, li[3].querySelector('.e-text-content'));
                mouseup.type = 'mouseup';
                EventHandler.trigger(<any>(document), 'mouseup', mouseup);
                expect(li[3].childElementCount).toBe(2);
                expect(li[3].children[1].childElementCount).toBe(6);
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    expect(li[3].getAttribute('aria-expanded')).toBe('true');
                    expect(treeObj.getTreeData('03')[0]['nodeChild'][5]['nodeText']).toBe('Videos');
                    done();
                }, 450);
            });
            it('testing with target as before li element', () => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                let mousedown: any = getEventObject('MouseEvents', 'mousedown', treeObj.element, li[2], 15, 10);
                EventHandler.trigger(treeObj.element, 'mousedown', mousedown);
                let mousemove: any = getEventObject('MouseEvents', 'mousemove', treeObj.element, li[2], 15, 70);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                mousemove.srcElement = mousemove.target = mousemove.toElement = li[2].querySelector('.e-text-content');
                mousemove = setMouseCordinates(mousemove, 15, 45);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                mousemove.srcElement = mousemove.target = mousemove.toElement = li[1];
                mousemove = setMouseCordinates(mousemove, 15, 50);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                expect(li[1].childElementCount).toBe(2);
                expect(li[1].querySelector('.e-sibling')).not.toBe(null);
                expect(document.querySelector('.e-drop-next')).not.toBe(null);
                let mouseup: any = getEventObject('MouseEvents', 'mouseup', treeObj.element, li[1], 15, 50, 1);
                mouseup.type = 'mouseup';
                EventHandler.trigger(<any>(document), 'mouseup', mouseup);
                expect(li[0].childElementCount).toBe(2);
                expect(li[0].children[1].childElementCount).toBe(2);
                expect(li[0].children[1].querySelector('.e-list-text').innerHTML).toBe('Videos');
                expect(li[1].childElementCount).toBe(1);
                expect(li[1].querySelector('.e-sibling')).toBe(null);
                expect(li[1].getAttribute('aria-expanded')).toBe(null);
                expect(treeObj.getTreeData('01')[0]['nodeChild'][0]['nodeText']).toBe('Videos');
            });
            it('testing with target as after li element', () => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                let mousedown: any = getEventObject('MouseEvents', 'mousedown', treeObj.element, li[2], 15, 10);
                EventHandler.trigger(treeObj.element, 'mousedown', mousedown);
                let mousemove: any = getEventObject('MouseEvents', 'mousemove', treeObj.element, li[2], 15, 70);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                mousemove.srcElement = mousemove.target = mousemove.toElement = li[2].querySelector('.e-text-content');
                mousemove = setMouseCordinates(mousemove, 15, 45);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                mousemove.srcElement = mousemove.target = mousemove.toElement = li[1];
                mousemove = setMouseCordinates(mousemove, 15, 80);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                expect(li[1].childElementCount).toBe(2);
                expect(li[1].querySelector('.e-sibling')).not.toBe(null);
                expect(document.querySelector('.e-drop-next')).not.toBe(null);
                let mouseup: any = getEventObject('MouseEvents', 'mouseup', treeObj.element, li[1], 15, 80);
                mouseup.type = 'mouseup';
                EventHandler.trigger(<any>(document), 'mouseup', mouseup);
                expect(li[0].childElementCount).toBe(2);
                expect(li[0].children[1].childElementCount).toBe(2);
                expect(li[0].children[1].querySelector('.e-list-text').innerHTML).toBe('Gouttes.mp3');
                expect(li[1].childElementCount).toBe(1);
                expect(li[1].querySelector('.e-sibling')).toBe(null);
                expect(li[1].getAttribute('aria-expanded')).toBe(null);
                expect(treeObj.getTreeData('01')[0]['nodeChild'][1]['nodeText']).toBe('Videos');
            });
            it('testing with target as treeview element', () => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                let mousedown: any = getEventObject('MouseEvents', 'mousedown', treeObj.element, li[2].querySelector('.e-text-content'), 15, 10);
                EventHandler.trigger(treeObj.element, 'mousedown', mousedown);
                let mousemove: any = getEventObject('MouseEvents', 'mousemove', treeObj.element, li[2].querySelector('.e-text-content'), 15, 70);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                mousemove.srcElement = mousemove.target = mousemove.toElement = treeObj.element;
                mousemove = setMouseCordinates(mousemove, 15, 75);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                expect(document.querySelector('.e-drop-out')).not.toBe(null);
                let mouseup: any = getEventObject('MouseEvents', 'mouseup', treeObj.element, treeObj.element);
                mouseup.type = 'mouseup';
                EventHandler.trigger(<any>(document), 'mouseup', mouseup);
                expect(li[0].childElementCount).toBe(2);
                expect(li[0].children[1].childElementCount).toBe(1);
                expect(document.querySelector('.e-drop-out')).toBe(null);
                expect(treeObj.getTreeData()[1]['nodeText']).toBe('Videos');
            });
            it('testing with target as document', () => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                let mousedown: any = getEventObject('MouseEvents', 'mousedown', treeObj.element, li[2].querySelector('.e-text-content'), 15, 10);
                EventHandler.trigger(treeObj.element, 'mousedown', mousedown);
                let mousemove: any = getEventObject('MouseEvents', 'mousemove', treeObj.element, li[2].querySelector('.e-text-content'), 15, 70);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                mousemove.srcElement = mousemove.target = mousemove.toElement = document.getElementsByTagName('body')[0];
                mousemove = setMouseCordinates(mousemove, 15, 75);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                expect(document.querySelector('.e-no-drop')).not.toBe(null);
                let mouseup: any = getEventObject('MouseEvents', 'mouseup', treeObj.element, document.getElementsByTagName('body')[0]);
                mouseup.type = 'mouseup';
                EventHandler.trigger(<any>(document), 'mouseup', mouseup);
                expect(li[0].childElementCount).toBe(2);
                expect(li[0].children[1].childElementCount).toBe(1);
                expect(document.querySelector('.e-no-drop')).toBe(null);
                expect(treeObj.getTreeData()[1]['nodeText']).toBe('Videos');
            });
            it('testing with target as non droppable element', () => {
                let ele: HTMLElement = createElement('div', { id: 'nontree' });
                document.body.appendChild(ele);
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                let mousedown: any = getEventObject('MouseEvents', 'mousedown', treeObj.element, li[2].querySelector('.e-text-content'), 15, 10);
                EventHandler.trigger(treeObj.element, 'mousedown', mousedown);
                let mousemove: any = getEventObject('MouseEvents', 'mousemove', treeObj.element, li[2].querySelector('.e-text-content'), 15, 70);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                mousemove.srcElement = mousemove.target = mousemove.toElement = document.getElementById('nontree');
                mousemove = setMouseCordinates(mousemove, 15, 75);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                expect(document.querySelector('.e-no-drop')).not.toBe(null);
                let mouseup: any = getEventObject('MouseEvents', 'mouseup', treeObj.element, document.getElementById('nontree'));
                mouseup.type = 'mouseup';
                EventHandler.trigger(<any>(document), 'mouseup', mouseup);
                expect(li[0].childElementCount).toBe(2);
                expect(li[0].children[1].childElementCount).toBe(1);
                expect(document.querySelector('.e-drop-out')).toBe(null);
                expect(treeObj.getTreeData()[1]['nodeText']).toBe('Videos');
            });
            it('testing with target as non droppable element with offset value 32px', () => {
                let ele: HTMLElement = createElement('div', { id: 'nontree', styles: 'height: 32px; background: red' });
                document.body.appendChild(ele);
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                let mousedown: any = getEventObject('MouseEvents', 'mousedown', treeObj.element, li[2].querySelector('.e-text-content'), 15, 10);
                EventHandler.trigger(treeObj.element, 'mousedown', mousedown);
                let mousemove: any = getEventObject('MouseEvents', 'mousemove', treeObj.element, li[2].querySelector('.e-text-content'), 15, 70);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                mousemove.srcElement = mousemove.target = mousemove.toElement = document.getElementById('nontree');
                mousemove = setMouseCordinates(mousemove, 15, 75);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                expect(document.querySelector('.e-no-drop')).not.toBe(null);
                let mouseup: any = getEventObject('MouseEvents', 'mouseup', treeObj.element, document.getElementById('nontree'));
                mouseup.type = 'mouseup';
                EventHandler.trigger(<any>(document), 'mouseup', mouseup);
                expect(li[0].childElementCount).toBe(2);
                expect(li[0].children[1].childElementCount).toBe(1);
                expect(document.querySelector('.e-drop-out')).toBe(null);
                expect(treeObj.getTreeData()[1]['nodeText']).toBe('Videos');
            });
            it('testing with target as non droppable li element', () => {
                let ele: HTMLElement = createElement('li', { id: 'nonliele', className: 'e-list-item' });
                document.body.appendChild(ele);
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                let mousedown: any = getEventObject('MouseEvents', 'mousedown', treeObj.element, li[2].querySelector('.e-text-content'), 15, 10);
                EventHandler.trigger(treeObj.element, 'mousedown', mousedown);
                let mousemove: any = getEventObject('MouseEvents', 'mousemove', treeObj.element, li[2].querySelector('.e-text-content'), 15, 70);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                mousemove.srcElement = mousemove.target = mousemove.toElement = document.getElementById('nonliele');
                mousemove = setMouseCordinates(mousemove, 15, 75);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                expect(document.querySelector('.e-no-drop')).not.toBe(null);
                let mouseup: any = getEventObject('MouseEvents', 'mouseup', treeObj.element, document.getElementById('nonliele'));
                mouseup.type = 'mouseup';
                EventHandler.trigger(<any>(document), 'mouseup', mouseup);
                expect(li[0].childElementCount).toBe(2);
                expect(li[0].children[1].childElementCount).toBe(1);
                expect(document.querySelector('.e-drop-out')).toBe(null);
                expect(treeObj.getTreeData()[1]['nodeText']).toBe('Videos');
            });
            it('testing with target as full row with child', () => {
                treeObj.fullRowSelect = true;
                treeObj.dataBind();
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                let mousedown: any = getEventObject('MouseEvents', 'mousedown', treeObj.element, li[2].querySelector('.e-fullrow'), 15, 10);
                EventHandler.trigger(treeObj.element, 'mousedown', mousedown);
                let mousemove: any = getEventObject('MouseEvents', 'mousemove', treeObj.element, li[2].querySelector('.e-fullrow'), 15, 70);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                mousemove.srcElement = mousemove.target = mousemove.toElement = li[1].querySelector('.e-fullrow');
                mousemove = setMouseCordinates(mousemove, 15, 75);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                expect(document.querySelector('.e-drop-in')).not.toBe(null);
                let mouseup: any = getEventObject('MouseEvents', 'mouseup', treeObj.element, li[1].querySelector('.e-fullrow'));
                mouseup.type = 'mouseup';
                EventHandler.trigger(<any>(document), 'mouseup', mouseup);
                expect(li[1].childElementCount).toBe(3);
                expect(li[1].children[2].childElementCount).toBe(1);
                expect(li[1].getAttribute('aria-expanded')).toBe('true');
                expect(treeObj.getTreeData('01-01')[0]['nodeChild'][0]['nodeText']).toBe('Videos');
            });
            it('testing with target as full row with out child', (done: Function) => {
                treeObj.fullRowSelect = true;
                treeObj.dataBind();
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                let mousedown: any = getEventObject('MouseEvents', 'mousedown', treeObj.element, li[2].querySelector('.e-fullrow'), 15, 10);
                EventHandler.trigger(treeObj.element, 'mousedown', mousedown);
                let mousemove: any = getEventObject('MouseEvents', 'mousemove', treeObj.element, li[2].querySelector('.e-fullrow'), 15, 70);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                mousemove.srcElement = mousemove.target = mousemove.toElement = li[3].querySelector('.e-fullrow');
                mousemove = setMouseCordinates(mousemove, 15, 75);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                expect(document.querySelector('.e-drop-in')).not.toBe(null);
                let mouseup: any = getEventObject('MouseEvents', 'mouseup', treeObj.element, li[3].querySelector('.e-fullrow'));
                mouseup.type = 'mouseup';
                EventHandler.trigger(<any>(document), 'mouseup', mouseup);
                expect(li[3].childElementCount).toBe(3);
                expect(li[3].children[2].childElementCount).toBe(6);
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    expect(li[3].getAttribute('aria-expanded')).toBe('true');
                    expect(treeObj.getTreeData('03')[0]['nodeChild'][5]['nodeText']).toBe('Videos');
                    done();
                }, 450);
            });
            it('with multi selection', (done: Function) => {
                treeObj.allowMultiSelection = true;
                treeObj.dataBind();
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                mouseEventArgs.ctrlKey = true;
                mouseEventArgs.target = li[0].querySelector('.e-list-text');
                treeObj.touchClickObj.tap(tapEvent);
                mouseEventArgs.target = li[1].querySelector('.e-list-text');
                treeObj.touchClickObj.tap(tapEvent);
                // dragging non active element
                let mousedown: any = getEventObject('MouseEvents', 'mousedown', treeObj.element, li[2].querySelector('.e-list-text'), 15, 10);
                EventHandler.trigger(treeObj.element, 'mousedown', mousedown);
                let mousemove: any = getEventObject('MouseEvents', 'mousemove', treeObj.element, li[2].querySelector('.e-list-text'), 15, 70);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                mousemove.srcElement = mousemove.target = mousemove.toElement = li[1].querySelector('.e-list-text');
                mousemove = setMouseCordinates(mousemove, 15, 75);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                let mouseup: any = getEventObject('MouseEvents', 'mouseup', treeObj.element, li[1].querySelector('.e-list-text'));
                mouseup.type = 'mouseup';
                EventHandler.trigger(<any>(document), 'mouseup', mouseup);
                expect(li[1].childElementCount).toBe(2);
                expect(li[1].children[1].childElementCount).toBe(1);
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    expect(li[1].getAttribute('aria-expanded')).toBe('true');
                    expect(treeObj.getTreeData('01-01')[0]['nodeChild'][0]['nodeText']).toBe('Videos');
                    mouseEventArgs.target = li[2].querySelector('.e-list-text');
                    treeObj.touchClickObj.tap(tapEvent);
                    treeObj.enableRtl = true;
                    treeObj.dataBind();
                    // dragging active element
                    let mousedown1: any = getEventObject('MouseEvents', 'mousedown', treeObj.element, li[0].querySelector('.e-list-text'), 15, 10);
                    EventHandler.trigger(treeObj.element, 'mousedown', mousedown1);
                    let mousemove1: any = getEventObject('MouseEvents', 'mousemove', treeObj.element, li[0].querySelector('.e-list-text'), 15, 70);
                    EventHandler.trigger(<any>(document), 'mousemove', mousemove1);
                    mousemove.srcElement = mousemove.target = mousemove.toElement = li[3].querySelector('.e-list-text');
                    mousemove = setMouseCordinates(mousemove, 15, 75);
                    EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                    let mouseup1: any = getEventObject('MouseEvents', 'mouseup', treeObj.element, li[3].querySelector('.e-list-text'));
                    mouseup.type = 'mouseup';
                    EventHandler.trigger(<any>(document), 'mouseup', mouseup1);
                    expect(li[3].childElementCount).toBe(2);
                    expect(li[3].children[1].childElementCount).toBe(8);
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function() {
                        expect(li[3].getAttribute('aria-expanded')).toBe('true');
                        expect(treeObj.getTreeData('03')[0]['nodeChild'][5]['nodeText']).toBe('Music');
                        done();
                    }, 450);
                }, 450);
            });
            it('code coverage', () => {
                expect(document.body.style.cursor).toBe('');
                treeObj.dropObj.out({target:document.body});
                expect(document.body.style.cursor).toBe('not-allowed');
            });
        });
        describe('Drag and drop with different TreeView functionality testing', () => {
            let treeObj: any;
            let treeObj1: any;
            let mouseEventArgs: any;
            let tapEvent: any;
            beforeEach((done: Function): void => {
                mouseEventArgs = {
                    preventDefault: (): void => {},
                    stopImmediatePropagation: (): void => {},
                    target: null,
                    type: null,
                    shiftKey: false,
                    ctrlKey: false
                };
                tapEvent = {
                    originalEvent: mouseEventArgs,
                    tapCount: 1
                };
                treeObj = undefined;
                let ele: HTMLElement = createElement('div', { id: 'tree1' });
                document.body.appendChild(ele);
                treeObj = new TreeView({ 
                    fields: { dataSource: hierarchicalData1, id: "nodeId", text: "nodeText", child: "nodeChild", navigateUrl: 'nodeUrl', iconCss: 'nodeIcon', imageUrl: 'nodeImage1', expanded: 'nodeExpanded1' },
                    allowDragAndDrop: true,
                    fullRowSelect: false,
                    dataBound: ()=> {
                        done();
                    }
                },'#tree1');
                let ele1: HTMLElement = createElement('div', { id: 'tree2' });
                document.body.appendChild(ele1);
                treeObj1 = undefined;
                treeObj1 = new TreeView({ 
                    fields: { dataSource: hierarchicalData4, id: "nodeId", text: "nodeText", child: "nodeChild", },
                    allowDragAndDrop: true,
                    fullRowSelect: false,
                    dataBound: ()=> {
                        done();
                    }
                },'#tree2');
            });
            afterEach((): void => {
                if (treeObj)
                    treeObj.destroy();
                if (treeObj1)
                    treeObj1.destroy();
                document.body.innerHTML = '';
            });
            it('testing with target as text', () => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                let newli: Element[] = <Element[] & NodeListOf<Element>>treeObj1.element.querySelectorAll('li');
                let mousedown: any = getEventObject('MouseEvents', 'mousedown', treeObj.element, li[2].querySelector('.e-list-text'), 15, 10);
                EventHandler.trigger(treeObj.element, 'mousedown', mousedown);
                let mousemove: any = getEventObject('MouseEvents', 'mousemove', treeObj.element, li[2].querySelector('.e-list-text'), 15, 70);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                mousemove.srcElement = mousemove.target = mousemove.toElement = newli[1].querySelector('.e-list-text');
                mousemove = setMouseCordinates(mousemove, 15, 75);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                let mouseup: any = getEventObject('MouseEvents', 'mouseup', treeObj1.element, newli[1].querySelector('.e-list-text'));
                mouseup.type = 'mouseup';
                EventHandler.trigger(<any>(document), 'mouseup', mouseup);
                expect(newli[1].childElementCount).toBe(2);
                expect(newli[1].children[1].childElementCount).toBe(1);
                expect(newli[1].getAttribute('aria-expanded')).toBe('true');
                expect(li[2].getAttribute('aria-level')).toBe('3');
                expect(treeObj.getTreeData('02').length).toBe(0);
                expect(treeObj1.getTreeData('11-01')[0]['nodeChild'][0]['nodeText']).toBe('Videos');
            });
        });
        describe('Performance testing', () => {
            let treeObj: TreeView;
            let mouseEventArgs: any;
            let originalTimeout: any;
            let tapEvent: any;
            beforeEach((): void => {
                mouseEventArgs = {
                    preventDefault: (): void => {},
                    stopImmediatePropagation: (): void => {},
                    target: null,
                    type: null,
                    shiftKey: false,
                    ctrlKey: false,
                    originalEvent:{ target: null}
                };
                tapEvent = {
                    originalEvent: mouseEventArgs,
                    tapCount: 1
                };
                let ele: HTMLElement = createElement('div', { id: 'tree' });
                document.body.appendChild(ele);
                originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;
            });
            afterEach((): void => {
                if (treeObj)
                    treeObj.destroy();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
                document.body.innerHTML = '';
            });
            it('with 1000 nodes', (done) => {
                let hierarchicalData: { [key: string]: Object }[] = [];
                let parent:number = 1;let child:number = 2;let child1:number = 4;let child2:number = 1000;
                for (let m:number = 1; m <= parent; m++) {
                    let childArray1:{ [key: string]: Object }[] = [];
                    for (let n:number = 1; n <= child; n++) {
                        let childArray2:{ [key: string]: Object }[] = [];
                        for (let o:number = 1; o <= child1; o++) {
                            let childArray3:{ [key: string]: Object }[] = [];
                            for (let p:number = 1; p <= child2; p++) {
                                childArray3.push({ id: "d" + m + n + o + p, name: "Node" + m + n + o + p });
                            }
                            childArray2.push({ id: "c" + m + n + o, name: "Node" + m + n + o, child: childArray3, expanded: true });
                        }
                        childArray1.push({ id: "b" + m + n, name: "Node" + m + n, child: childArray2, expanded: true });
                    }
                    hierarchicalData.push({ id: "a" + m, name: "Node" + m, child: childArray1, expanded: true });
                }
                let startDate:number;
                let timeTaken:number;
                // Render the TreeView by mapping its fields property with data source properties
                treeObj = new TreeView({
                    fields: { dataSource: hierarchicalData, id: "id", text: "name", child: "child", },
                    showCheckBox: true,
                    nodeChecked: function (args) {
                        timeTaken = new Date().getTime() - startDate;
                    },
                    nodeChecking: function (args) {   
                        startDate = new Date().getTime();
                    }
                });
                treeObj.appendTo('#tree');    
                setTimeout(() => {
                    mouseEventArgs.target = (treeObj.element as any).querySelector("[data-uid='c111'] .e-ripple-container");
                    (<any>treeObj).touchClickObj.tap(tapEvent);
                    setTimeout(() => {
                        expect(timeTaken).toBeLessThan(1000);
                        done();
                    },2000 );  
                },10000 );            
            });
        });
    });
    describe('Local data binding testing', () => {
        describe('Default functionality testing', () => {
            let treeObj: any;
            let mouseEventArgs: any;
            let tapEvent: any;
            beforeEach((): void => {
                mouseEventArgs = {
                    preventDefault: (): void => {},
                    stopImmediatePropagation: (): void => {},
                    target: null,
                    type: null,
                    shiftKey: false,
                    ctrlKey: false,
                    originalEvent:{target:null}
                };
                tapEvent = {
                    originalEvent: mouseEventArgs,
                    tapCount: 1
                };
                treeObj = undefined;
                let ele: HTMLElement = createElement('div', { id: 'tree1' });
                document.body.appendChild(ele);
            });
            afterEach((): void => {
                if (treeObj)
                    treeObj.destroy();
                document.body.innerHTML = '';
            });
            it('with null fields', () => {
                treeObj = new TreeView({ fields: null },'#tree1');
                expect(treeObj.element.querySelectorAll('li').length).toBe(0);
            });
            it('with empty fields', () => {
                treeObj = new TreeView({ fields: {} },'#tree1');
                expect(treeObj.element.querySelectorAll('li').length).toBe(0);
            });
            it('with null datasource', () => {
                treeObj = new TreeView({ fields: { dataSource: null } },'#tree1');
                expect(treeObj.element.querySelectorAll('li').length).toBe(0);
            });
            it('with empty datasource', () => {
                treeObj = new TreeView({ fields: { dataSource: [] } },'#tree1');
                expect(treeObj.element.querySelectorAll('li').length).toBe(0);
            });
            it('selectedNodes property testing', (done: Function) => {
                treeObj = new TreeView({ 
                    fields: { dataSource: localData },
                    selectedNodes: ['30']
                },'#tree1');
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                    expect(li.length).toBe(10);
                    expect(li[0].classList.contains('e-active')).toBe(false);
                    expect(li[9].classList.contains('e-active')).toBe(true);
                    done();
                }, 450);
            });
            it('without mapping fields', (done: Function) => {
                treeObj = new TreeView({ 
                    fields: { dataSource: localData },
                    fullRowSelect: false,
                },'#tree1');
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    expect(treeObj.element.querySelectorAll('li').length).toBe(10);
                    expect(treeObj.element.querySelector('.e-list-text').innerHTML).toBe('Artwork');
                    expect(treeObj.element.querySelector('.e-list-item').getAttribute('data-uid')).toBe("1");
                    expect(treeObj.element.querySelector('.e-list-icon').classList.contains('folder')).toBe(true);
                    expect(treeObj.element.querySelector('.e-list-img').src.indexOf('images/Shooting.png')).not.toBe(-1);
                    expect(treeObj.element.querySelector('.e-list-item').title).toBe('This is Artwork node');
                    expect(treeObj.element.querySelector('.e-list-item').classList.contains('e-active')).toBe(true);
                    expect(treeObj.element.querySelectorAll('li')[1].classList.contains('firstnode')).toBe(true);
                    expect(treeObj.element.querySelectorAll('li')[1].style.backgroundColor).toBe('red');
                    expect(treeObj.element.querySelector('.e-list-url').href.indexOf('http://npmci.syncfusion.com/')).not.toBe(-1);
                    let newli: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                    expect(newli[2].childElementCount).toBe(2);
                    expect((newli[2].querySelector('.e-icons') as Element).classList.contains('e-icon-expandable')).toBe(false);
                    expect((newli[2].querySelector('.e-icons') as Element).classList.contains('e-icon-collapsible')).toBe(true);
                    expect(newli[2].getAttribute('aria-expanded')).toBe('true');
                    expect(newli[3].childElementCount).toBe(2);
                    expect((newli[3].querySelector('.e-icons') as Element).classList.contains('e-icon-expandable')).toBe(false);
                    expect((newli[3].querySelector('.e-icons') as Element).classList.contains('e-icon-collapsible')).toBe(true);
                    expect(newli[3].getAttribute('aria-expanded')).toBe('true');
                    mouseEventArgs.target = newli[0].querySelector('.e-icons');
                    expect(newli[0].childElementCount).toBe(1);
                    treeObj.touchClickObj.tap(tapEvent);
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function() {
                        expect(newli[0].childElementCount).toBe(2);
                        expect((newli[0] as Element).querySelector('.e-list-item').getAttribute('data-uid')).toBe('2');
                        expect(newli[0].querySelector('.e-list-parent').querySelector('.e-list-text').innerHTML).toBe('Abstract');
                        expect(document.getElementById('tree1').classList.contains('customTree')).toEqual(false);
                        expect(document.getElementById('tree1').classList.contains('productTree')).toEqual(false);
                        done();
                    }, 450);
                }, 450);
            });
            it('with mapping fields', (done: Function) => {
                treeObj = new TreeView({ 
                    fields: { dataSource: localData1, id: "nodeId", parentID: 'nodePid', text: "nodeText", hasChildren: "hasChild", expanded: 'nodeExpanded', navigateUrl: 'nodeUrl',
                        iconCss: 'nodeIcon', imageUrl: 'nodeImage', tooltip: 'nodeTooltip', htmlAttributes: 'nodeHtmlAttr', selected: 'nodeSelected' },
                    cssClass: 'customTree productTree',
                    fullRowSelect: false,
                },'#tree1');
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    expect(treeObj.element.querySelectorAll('li').length).toBe(13);
                    expect(treeObj.element.querySelector('.e-list-text').innerHTML).toBe('Music');
                    expect(treeObj.element.querySelector('.e-list-item').getAttribute('data-uid')).toBe('01');
                    expect(treeObj.element.querySelector('.e-list-icon').classList.contains('folder')).toBe(true);
                    expect(treeObj.element.querySelector('.e-list-img').src.indexOf('images/Shooting.png')).not.toBe(-1);
                    expect(treeObj.element.querySelector('.e-list-item').title).toBe('This is Music node');
                    expect(treeObj.element.querySelector('.e-list-item').classList.contains('e-active')).toBe(true);
                    expect(treeObj.element.querySelectorAll('li')[1].classList.contains('firstnode')).toBe(true);
                    expect(treeObj.element.querySelectorAll('li')[1].style.backgroundColor).toBe('red');
                    expect(treeObj.element.querySelector('.e-list-url').href.indexOf('http://npmci.syncfusion.com/')).not.toBe(-1);
                    let newli: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                    expect(newli[3].childElementCount).toBe(2);
                    expect((newli[3].querySelector('.e-icons') as Element).classList.contains('e-icon-expandable')).toBe(false);
                    expect((newli[3].querySelector('.e-icons') as Element).classList.contains('e-icon-collapsible')).toBe(true);
                    expect(newli[3].getAttribute('aria-expanded')).toBe('true');
                    expect(newli[4].childElementCount).toBe(2);
                    expect((newli[4].querySelector('.e-icons') as Element).classList.contains('e-icon-expandable')).toBe(false);
                    expect((newli[4].querySelector('.e-icons') as Element).classList.contains('e-icon-collapsible')).toBe(true);
                    expect(newli[4].getAttribute('aria-expanded')).toBe('true');
                    mouseEventArgs.target = newli[0].querySelector('.e-icons');
                    expect(newli[0].childElementCount).toBe(1);
                    treeObj.touchClickObj.tap(tapEvent);
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function() {
                        expect(newli[0].childElementCount).toBe(2);
                        expect((newli[0] as Element).querySelector('.e-list-item').getAttribute('data-uid')).toBe('01-01');
                        expect(newli[0].querySelector('.e-list-parent').querySelector('.e-list-text').innerHTML).toBe('Gouttes.mp3');
                        expect(document.getElementById('tree1').classList.contains('customTree')).toEqual(true);
                        expect(document.getElementById('tree1').classList.contains('productTree')).toEqual(true);
                        done();
                    }, 450);
                }, 500);
            });
            it('sortOrder property testing', (done: Function) => {
                treeObj = new TreeView({ 
                    fields: { dataSource: localData1, id: "nodeId", parentID: 'nodePid', text: "nodeText", hasChildren: "hasChild",
                        iconCss: 'nodeIcon', imageUrl: 'nodeImage', tooltip: 'nodeTooltip', htmlAttributes: 'nodeHtmlAttr', selected: 'nodeSelected' },
                    sortOrder: 'Ascending'
                },'#tree1');
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    expect(treeObj.element.querySelectorAll('li').length).toBe(5);
                    expect(treeObj.element.querySelector('.e-list-text').innerHTML).toBe('Documents');
                    expect(treeObj.element.querySelector('.e-list-item').getAttribute('data-uid')).toBe('03');
                    done();
                }, 100);
            });
            it('allowEditing property with default value testing', (done: Function) => {
                treeObj = new TreeView({ 
                    fields: { dataSource: localData1, id: "nodeId", parentID: 'nodePid', text: "nodeText", hasChildren: "hasChild",
                        iconCss: 'nodeIcon', imageUrl: 'nodeImage', tooltip: 'nodeTooltip', htmlAttributes: 'nodeHtmlAttr', selected: 'nodeSelected' },
                    fullRowSelect: false,
                },'#tree1');
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                    tapEvent.tapCount = 2;
                    mouseEventArgs.target = li[0].querySelector('.e-list-text');
                    expect(li[0].querySelector('.e-icons').classList.contains('e-icon-expandable')).toBe(true);
                    expect(li[0].querySelector('.e-icons').classList.contains('e-icon-collapsible')).toBe(false);
                    expect(li[0].childElementCount).toBe(1);
                    expect(li[0].querySelector('.e-list-text').childElementCount).toBe(0);
                    treeObj.touchExpandObj.tap(tapEvent);
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function() {
                        expect(li[0].querySelector('.e-icons').classList.contains('e-icon-expandable')).toBe(false);
                        expect(li[0].querySelector('.e-icons').classList.contains('e-icon-collapsible')).toBe(true);
                        expect(li[0].childElementCount).toBe(2);
                        expect(li[0].getAttribute('aria-expanded')).toBe('true');
                        expect(li[0].querySelector('.e-list-text').childElementCount).toBe(0);
                        done();
                    }, 450);
                }, 100);
            });
            it('allowEditing property testing', (done: Function) => {
                treeObj = new TreeView({ 
                    fields: { dataSource: localData1, id: "nodeId", parentID: 'nodePid', text: "nodeText", hasChildren: "hasChild",
                        iconCss: 'nodeIcon', imageUrl: 'nodeImage', tooltip: 'nodeTooltip', htmlAttributes: 'nodeHtmlAttr', selected: 'nodeSelected' },
                    allowEditing: true,
                    fullRowSelect: false,
                },'#tree1');
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                    expect(li[0].querySelector('.e-icons').classList.contains('e-icon-expandable')).toBe(true);
                    expect(li[0].querySelector('.e-icons').classList.contains('e-icon-collapsible')).toBe(false);
                    expect(li[0].childElementCount).toBe(1);
                    expect(li[0].querySelector('.e-list-text').childElementCount).toBe(0);
                    tapEvent.tapCount = 2;
                    mouseEventArgs.target = li[0].querySelector('.e-list-text');
                    treeObj.touchExpandObj.tap(tapEvent);
                    treeObj.touchEditObj.tap(tapEvent);
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function() {
                        expect(li[0].querySelector('.e-icons').classList.contains('e-icon-expandable')).toBe(false);
                        expect(li[0].querySelector('.e-icons').classList.contains('e-icon-collapsible')).toBe(true);
                        expect(li[0].childElementCount).toBe(2);
                        expect(li[0].querySelector('.e-list-text').childElementCount).toBe(1);
                        expect(li[0].querySelector('.e-input').nodeName).toBe('INPUT');
                        expect((li[0].querySelector('.e-input') as HTMLInputElement).value).toBe('Music');
                        (li[0].querySelector('.e-input') as HTMLInputElement).value = 'Music node';
                        (li[0].querySelector('.e-input') as HTMLInputElement).blur();
                        expect(li[0].querySelector('.e-list-text').childElementCount).toBe(0);
                        expect((li[0].querySelector('.e-list-text') as HTMLElement).childNodes[0].nodeValue).toBe('Music node');
                        mouseEventArgs.target = li[0].querySelector('.e-list-item');
                        treeObj.touchExpandObj.tap(tapEvent);
                        treeObj.touchEditObj.tap(tapEvent);
                        expect(li[0].querySelector('.e-list-text').childElementCount).toBe(0);
                        mouseEventArgs.target = li[0].querySelector('.e-list-text');
                        treeObj.touchExpandObj.tap(tapEvent);
                        treeObj.touchEditObj.tap(tapEvent);
                        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                        setTimeout(function() {
                            expect((li[0].querySelector('.e-input') as HTMLInputElement).value).toBe('Music node');
                            (li[0].querySelector('.e-input') as HTMLInputElement).value = 'Music';
                            (li[0].querySelector('.e-input') as HTMLInputElement).blur();
                            expect(li[0].querySelector('.e-list-text').childElementCount).toBe(0);
                            expect((li[0].querySelector('.e-list-text') as HTMLElement).childNodes[0].nodeValue).toBe('Music');
                            let nli: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                            mouseEventArgs.target = nli[1].querySelector('.e-list-text');
                            treeObj.touchExpandObj.tap(tapEvent);
                            treeObj.touchEditObj.tap(tapEvent);
                            expect((nli[1].querySelector('.e-input') as HTMLInputElement).value).toBe('Gouttes.mp3');
                            (nli[1].querySelector('.e-input') as HTMLInputElement).value = 'Gouttes.mp31';
                            (nli[1].querySelector('.e-input') as HTMLInputElement).blur();
                            expect(nli[1].querySelector('.e-list-text').childElementCount).toBe(0);
                            expect((nli[1].querySelector('.e-list-text') as HTMLElement).childNodes[0].nodeValue).toBe('Gouttes.mp31');
                            mouseEventArgs.target = nli[1].querySelector('.e-list-text');
                            treeObj.touchExpandObj.tap(tapEvent);
                            treeObj.touchEditObj.tap(tapEvent);
                            expect((nli[1].querySelector('.e-input') as HTMLInputElement).value).toBe('Gouttes.mp31');
                            (nli[1].querySelector('.e-input') as HTMLInputElement).value = 'Gouttes.mp3';
                            (nli[1].querySelector('.e-input') as HTMLInputElement).blur();
                            expect(nli[1].querySelector('.e-list-text').childElementCount).toBe(0);
                            expect((nli[1].querySelector('.e-list-text') as HTMLElement).childNodes[0].nodeValue).toBe('Gouttes.mp3');
                            done();
                        }, 450);
                    }, 100);
                }, 100);
            });
            it('enableRtl property testing', (done: Function) => {
                treeObj = new TreeView({ 
                    fields: { dataSource: localData1, id: "nodeId", text: "nodeText", child: "nodeChild",
                        iconCss: 'nodeIcon', imageUrl: 'nodeImage', tooltip: 'nodeTooltip', htmlAttributes: 'nodeHtmlAttr', selected: 'nodeSelected' },
                    enableRtl: true,
                },'#tree1');
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    expect(treeObj.element.classList.contains('e-rtl')).toBe(true);
                    done();
                }, 100);
            });
            it('enableHtmlSanitizer property testing', (done: Function) => {
                treeObj = new TreeView({ 
                    fields: { dataSource: XSSData, id: "id", text: "text",},
                  enableHtmlSanitizer: false
                },'#tree1');
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    var htmlEle = document.body;
                    expect(window.getComputedStyle(htmlEle).backgroundColor).toBe("rgb(0, 0, 255)");
                    done();
                }, 100);
            });
            it('enableHtmlSanitizer property testing', (done: Function) => {
                treeObj = new TreeView({ 
                    fields: { dataSource: XSSData, id: "id", text: "text",},
                  enableHtmlSanitizer: true
                },'#tree1');
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    var htmlEle = document.body;
                    expect(window.getComputedStyle(htmlEle).backgroundColor).not.toBe("rgb(0, 0, 255)");
                    done();
                }, 100);
            });
            it(' checkedNodes with events ', (done: Function) => {
                treeObj = new TreeView({ 
                    fields: { dataSource: hierarchicalData1 , id: "nodeId", text: "nodeText", child: "nodeChild", isChecked:"nodeChecked" },
                    showCheckBox: true
                },'#tree1');
                treeObj.checkedNodes= ['01', '03-03'];
                treeObj.dataBind();     
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                mouseEventArgs.target = li[2].querySelector('.e-icons');
                treeObj.touchClickObj.tap(tapEvent);
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    mouseEventArgs.target = li[2].querySelector('.e-ripple-container');
                    treeObj.touchClickObj.tap(tapEvent);
                    setTimeout(function() {
                        expect(treeObj.checkedNodes.length === 8 ).toBe(true);
                        done();
                    },100);
                }, 100);
            });
            it(' checkedNodes property testing ', (done) => {
                treeObj = new TreeView({ 
                    fields: { dataSource: hierarchicalData1 , id: "nodeId", text: "nodeText", child: "nodeChild", isChecked:"nodeChecked" },
                    showCheckBox: true,
                    checkedNodes: ['01', '03', '03-03']                    
                },'#tree1');
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                mouseEventArgs.target = li[0].querySelector('.e-checkbox-wrapper');
                treeObj.touchClickObj.tap(tapEvent);
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    let checkEle: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-check');
                    expect(checkEle.length).toBeGreaterThan(1);
                    done();
                }, 100);
            });
			it(' checkedNodes setModel property testing ', (done) => {
                 var j = 0;
                treeObj = new TreeView({ 
                    fields: { dataSource: hierarchicalData1 , id: "nodeId", text: "nodeText", child: "nodeChild", isChecked:"nodeChecked" },
                    showCheckBox: true,
                    nodeChecking: (args: NodeCheckEventArgs) => {
                        if (args.action == 'uncheck') {
                            j++;
                        }
                    },
                },'#tree1');
                expect(j).toEqual(0);
                treeObj.checkedNodes= ['01', '03'];
				jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
				setTimeout(function() {
                    expect(j).toEqual(1);
                    expect(treeObj.checkedNodes.length).toBe(8);
                    done();
                }, 100);
            });
            it(' checkedNodes setModel property testing with showCheckbox false options ', (done) => {
                var j = 0;
               treeObj = new TreeView({ 
                   fields: { dataSource: hierarchicalData1 , id: "nodeId", text: "nodeText", child: "nodeChild", isChecked:"nodeChecked" },
                   showCheckBox: true,
                   autoCheck: true
               },'#tree1');               
               jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
               setTimeout(function() {
                    let checkEle: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-check');
                    expect(checkEle.length).toEqual(1);
                    treeObj.showCheckBox = false;
                    treeObj.autoCheck = false;
                    treeObj.checkedNodes= ['01', '03'];
                    treeObj.dataBind();
                    let checkEles: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-check');
                    expect(checkEles.length).toEqual(0);
                    done();
               }, 100);
           });
            it('checkedNodes property with value ', (done: Function) => {
                treeObj = new TreeView({ 
                    fields: { dataSource: hierarchicalData1 , id: "nodeId", text: "nodeText", child: "nodeChild", expanded:"nodeExpanded" },
                    showCheckBox: true,
                    checkedNodes: ['04-02', '04-04']
                });
                treeObj.appendTo('#tree1');
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    expect(treeObj.checkedNodes.length).toBe(2);
                    done();
                }, 100);
            });
            it('isChecked property set in the root node with loadOnDemand true ', (done: Function) => {
                treeObj = new TreeView({ 
                    fields: { dataSource: hierarchicalData1 , id: "nodeId", text: "nodeText", child: "nodeChild", expanded:"nodeExpanded",isChecked:"nodeChecked" },
                    showCheckBox: true,
                    loadOnDemand: true
                });
                treeObj.appendTo('#tree1');
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    expect(treeObj.checkedNodes.length).toBe(3);
                    expect(treeObj.getAllCheckedNodes().length).toBe(3);
                    treeObj.uncheckAll()
                    treeObj.dataBind();
                    expect(treeObj.checkedNodes.length).toBe(0);
                    expect(treeObj.getAllCheckedNodes().length).toBe(0)
                    done();
                }, 100);
            });
            it('isChecked property set in the root node with loadOnDemand false ', (done: Function) => {
                treeObj = new TreeView({ 
                    fields: { dataSource: hierarchicalData1 , id: "nodeId", text: "nodeText", child: "nodeChild", expanded:"nodeExpanded",isChecked:"nodeChecked" },
                    showCheckBox: true,
                    loadOnDemand: false
                });
                treeObj.appendTo('#tree1');
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    expect(treeObj.checkedNodes.length).toBe(3);
                    expect(treeObj.getAllCheckedNodes().length).toBe(3);
                    treeObj.uncheckAll()
                    treeObj.dataBind();
                    expect(treeObj.checkedNodes.length).toBe(0);
                    expect(treeObj.getAllCheckedNodes().length).toBe(0)
                    done();
                }, 100);
            });
            it('isChecked property set in the child node  with loadOnDemand false ', (done: Function) => {
                treeObj = new TreeView({ 
                    fields: { dataSource: hierarchicalData6 , id: "nodeId", text: "nodeText", child: "nodeChild", expanded:"nodeExpanded",isChecked:"nodeChecked" },
                    showCheckBox: true,
                    loadOnDemand: false
                });
                treeObj.appendTo('#tree1');
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    expect(treeObj.checkedNodes.length).toBe(1);
                    expect(treeObj.getAllCheckedNodes().length).toBe(1);
                    treeObj.uncheckAll()
                    treeObj.dataBind();
                    expect(treeObj.checkedNodes.length).toBe(0);
                    expect(treeObj.getAllCheckedNodes().length).toBe(0)
                    done();
                }, 100);
            });
            it('isChecked property is set inside the child with loadOnDemand true ', (done: Function) => {
                treeObj = new TreeView({ 
                    fields: { dataSource: hierarchicalData6 , id: "nodeId", text: "nodeText", child: "nodeChild", expanded:"nodeExpanded",isChecked:"nodeChecked" },
                    showCheckBox: true,
                    loadOnDemand: true
                });
                treeObj.appendTo('#tree1');
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    expect(treeObj.checkedNodes.length).toBe(1);
                    expect(treeObj.getAllCheckedNodes().length).toBe(1);
                    treeObj.uncheckAll()
                    treeObj.dataBind();
                    expect(treeObj.checkedNodes.length).toBe(0);
                    expect(treeObj.getAllCheckedNodes().length).toBe(0)
                    done();
                }, 100);
            });

            it('isChecked property is set inside the child with loadOnDemand true ', (done: Function) => {
                treeObj = new TreeView({ 
                    fields: { dataSource: hierarchicalData6 , id: "nodeId", text: "nodeText", child: "nodeChild", expanded:"nodeExpanded",isChecked:"nodeChecked" },
                    showCheckBox: true,
                    autoCheck: false
                });
                treeObj.appendTo('#tree1');
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    expect(treeObj.checkedNodes.length).toBe(1);
                    expect(treeObj.getAllCheckedNodes().length).toBe(1);
                    treeObj.uncheckAll()
                    treeObj.dataBind();
                    expect(treeObj.checkedNodes.length).toBe(0);
                    expect(treeObj.getAllCheckedNodes().length).toBe(0)
                    done();
                }, 100);
            });
            
            it('isChecked property is set inside the root node with loadOnDemand true and local data', (done: Function) => {
                treeObj = new TreeView({ 
                    fields: { dataSource: localData6 , id: "nodeId", text: "nodeText", parentID: "nodePid", hasChildren:"hasChild",isChecked:"isChecked" },
                    showCheckBox: true,
                    loadOnDemand: true
                });
                treeObj.appendTo('#tree1');
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    expect(treeObj.checkedNodes.length).toBe(2);
                    expect(treeObj.getAllCheckedNodes().length).toBe(2);
                    treeObj.uncheckAll()
                    treeObj.dataBind();
                    expect(treeObj.checkedNodes.length).toBe(0);
                    expect(treeObj.getAllCheckedNodes().length).toBe(0)
                    done();
                }, 100);
            });
            it('isChecked property is set inside the root node with loadOnDemand false and local data', (done: Function) => {
                treeObj = new TreeView({ 
                    fields: { dataSource: localData6 , id: "nodeId", text: "nodeText", parentID: "nodePid", hasChildren:"hasChild",isChecked:"isChecked" },
                    showCheckBox: true,
                    loadOnDemand: false
                });
                treeObj.appendTo('#tree1');
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    expect(treeObj.checkedNodes.length).toBe(2);
                    expect(treeObj.getAllCheckedNodes().length).toBe(2);
                    treeObj.uncheckAll()
                    treeObj.dataBind();
                    expect(treeObj.checkedNodes.length).toBe(0);
                    expect(treeObj.getAllCheckedNodes().length).toBe(0)
                    done();
                }, 100);
            });
            it('isChecked property is set inside the child node with loadOnDemand false and local data', (done: Function) => {
                treeObj = new TreeView({ 
                    fields: { dataSource: localData7 , id: "id", text: "name", parentID: "pid", hasChildren:"hasChild",isChecked:"isChecked" },
                    showCheckBox: true,
                    loadOnDemand: false
                });
                treeObj.appendTo('#tree1');
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    expect(treeObj.checkedNodes.length).toBe(8);
                    expect(treeObj.getAllCheckedNodes().length).toBe(8);
                    treeObj.uncheckAll()
                    treeObj.dataBind();
                    expect(treeObj.checkedNodes.length).toBe(0);
                    expect(treeObj.getAllCheckedNodes().length).toBe(0)
                    done();
                }, 100);
            });
            it('isChecked property is set inside the child node with autocheck false and local data', (done: Function) => {
                treeObj = new TreeView({ 
                    fields: { dataSource: localData7 , id: "id", text: "name", parentID: "pid", hasChildren:"hasChild",isChecked:"isChecked" },
                    showCheckBox: true,
                    autoCheck: false
                });
                treeObj.appendTo('#tree1');
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    expect(treeObj.checkedNodes.length).toBe(6);
                    expect(treeObj.getAllCheckedNodes().length).toBe(6);
                    treeObj.uncheckAll()
                    treeObj.dataBind();
                    expect(treeObj.checkedNodes.length).toBe(0);
                    expect(treeObj.getAllCheckedNodes().length).toBe(0)
                    done();
                }, 100);
            });
            it('isChecked property is set inside the child node with loadOnDemand true and local data', (done: Function) => {
                treeObj = new TreeView({ 
                    fields: { dataSource: localData7 , id: "id", text: "name", parentID: "pid", hasChildren:"hasChild",isChecked:"isChecked" },
                    showCheckBox: true,
                    loadOnDemand: true
                });
                treeObj.appendTo('#tree1');
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    expect(treeObj.checkedNodes.length).toBe(8);
                    expect(treeObj.getAllCheckedNodes().length).toBe(8);
                    treeObj.uncheckAll()
                    treeObj.dataBind();
                    expect(treeObj.checkedNodes.length).toBe(0);
                    expect(treeObj.getAllCheckedNodes().length).toBe(0)
                    done();
                }, 100);
            });
            it('GetAllCheckedNodes value testing with nested data', (done: Function) => {
                treeObj = new TreeView({ 
                    fields: { dataSource: localData9 ,  id: 'id', parentID: 'pid', text: 'name', hasChildren: 'hasChildren', isChecked: 'isSelected'},
                    showCheckBox: true,
                });
                treeObj.appendTo('#tree1');
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    expect(treeObj.getTreeData().length).toBe(32);
                    expect(treeObj.getAllCheckedNodes().length).toBe(30);
                    treeObj.checkAll(['1'])
                    treeObj.dataBind();
                    expect(treeObj.checkedNodes.length).toBe(32);
                    expect(treeObj.getAllCheckedNodes().length).toBe(32)
                    done();
                }, 100);
            });
             it('GetAllCheckedNodes value testing with nested data', (done: Function) => {
                treeObj = new TreeView({ 
                    fields: { dataSource: localData9 ,  id: 'id', parentID: 'pid', text: 'name', hasChildren: 'hasChildren', isChecked: 'isSelected'},
                    showCheckBox: true,
                });
                treeObj.appendTo('#tree1');
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    expect(treeObj.getTreeData().length).toBe(32);
                    expect(treeObj.getAllCheckedNodes().length).toBe(30);
                    treeObj.checkAll(['1'])
                    treeObj.dataBind();
                    expect(treeObj.checkedNodes.length).toBe(32);
                    expect(treeObj.getAllCheckedNodes().length).toBe(32);
                    treeObj.checkedNodes = ['21'];
                    treeObj.dataBind();
                    expect(treeObj.getAllCheckedNodes().length).toBe(5);
                    done();
                }, 100);
            });
            it('checkedNodes testing with single Node', (done: Function) => {
                treeObj = new TreeView({ 
                    fields: { dataSource: hierarchicalData1 , id: "nodeId", text: "nodeText", child: "nodeChild", expanded:"nodeExpanded" },
                    showCheckBox: true,
                    checkedNodes: ['04-04']
                });
                treeObj.appendTo('#tree1');
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    expect(treeObj.checkedNodes.length).toBe(1);
                    let checkEle: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-check');
                    expect(checkEle.length).toBe(1);
                    done();
                }, 100);
            });
             it('checkedNodes testing with empty array', (done: Function) => {
                treeObj = new TreeView({ 
                    fields: { dataSource: hierarchicalData1 , id: "nodeId", text: "nodeText", child: "nodeChild", expanded:"nodeExpanded" },
                    showCheckBox: true,
                    checkedNodes: []
                });
                treeObj.appendTo('#tree1');
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    expect(treeObj.checkedNodes.length).toBe(0);
                    let checkEle: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-check');
                    expect(checkEle.length).toBe(0);
                    done();
                }, 100);
            });
            it('getDisabledNodes method testing with hierarachical datasource with id as string type', (done: Function) => {
                treeObj = new TreeView({ 
                    fields: { dataSource: hierarchicalData1 , id: "nodeId", text: "nodeText", child: "nodeChild", expanded:"nodeExpanded" },
                });
                treeObj.appendTo('#tree1');
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    treeObj.disableNodes(['02-01', '04-04']);
                    treeObj.dataBind();
                    expect(treeObj.getDisabledNodes().length).toBe(2);
                    done();
                }, 100);
            });
            
                it('getDisabledNodes method testing with hierarchical datasource with id as number type', (done: Function) => {
                    treeObj = new TreeView({ 
                        fields: { dataSource: hierarchicalData , id: "id", text: "text", child: "child" },
                    });
                    treeObj.appendTo('#tree1');
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function() {
                        treeObj.disableNodes(['2', '22', '29', '2222', '02-02'])
                        expect(treeObj.getDisabledNodes().length).toBe(3);
                        treeObj.disableNodes([null]);
                        expect(treeObj.getDisabledNodes().length).toBe(3);
                        treeObj.enableNodes(['2222', '02-02', '22', '29']);
                        treeObj.dataBind();
                        expect(treeObj.getDisabledNodes().length).toBe(1);
                        done();
                    }, 100);
            });
            it('getDisabledNodes method testing with local datasource with id as number type', (done: Function) => {
                treeObj = new TreeView({ 
                    fields: { dataSource: localData , id: "id", text: "text",parentID: "parentID", hasChildren: "hasChildren" },
                });
                treeObj.appendTo('#tree1');
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    treeObj.disableNodes(['2', '22', '29', '2222', '02-02'])
                    expect(treeObj.getDisabledNodes().length).toBe(3);
                    treeObj.disableNodes([null]);
                    expect(treeObj.getDisabledNodes().length).toBe(3);
                    treeObj.enableNodes(['2222', '02-02', '22', '29']);
                    treeObj.dataBind();
                    expect(treeObj.getDisabledNodes().length).toBe(1);
                    done();
                }, 100);
            });
            it('getDisabledNodes method testing with local datasource with id as string type', (done: Function) => {
                treeObj = new TreeView({ 
                    fields: { dataSource: localData9 , id: "id", text: "name",parentID: "pid", hasChildren: "hasChildren" },
                });
                treeObj.appendTo('#tree1');
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    treeObj.disableNodes(['2', '22', '29', '2222', '02-02'])
                    expect(treeObj.getDisabledNodes().length).toBe(2);
                    treeObj.disableNodes([null]);
                    expect(treeObj.getDisabledNodes().length).toBe(2);
                    treeObj.enableNodes(['2222', '02-02', '22', '29']);
                    treeObj.dataBind();
                    expect(treeObj.getDisabledNodes().length).toBe(0);
                    done();
                }, 100);
            });
            describe('space key testing', () => {
                let keyboardEventArgs: any = {
                    preventDefault: (): void => {},
                    action: null
                };
                let treeObj: any;
                let ele: HTMLElement = createElement('div', { id: 'tree1' });
                beforeAll(() => {
                    document.body.appendChild(ele);
                    treeObj = new TreeView({ 
                        fields: { dataSource: hierarchicalData1 , id: "nodeId", text: "nodeText", child: "nodeChild", isChecked:"nodeChecked" },
                        showCheckBox: true                    
                    });
                    treeObj.appendTo(ele);
                });
                afterAll(() => {
                    if (treeObj)
                        treeObj.destroy();
                    document.body.innerHTML = '';
                });
                it('space key pressed', () => {
                    let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                    treeObj.focusIn();
                    keyboardEventArgs.action = 'space';
                    treeObj.keyActionHandler(keyboardEventArgs);
                    expect(li[0].querySelectorAll('.e-check').length).toBeGreaterThan(0);
                });
            });
            it('allowDragAndDrop property testing', (done: Function) => {
                treeObj = new TreeView({ 
                    fields: { dataSource: localData1, id: "nodeId", parentID: 'nodePid', text: "nodeText", hasChildren: "hasChild" },
                    allowDragAndDrop: true,
                },'#tree1');
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    expect(treeObj.dragObj).not.toBe(undefined);
                    expect(treeObj.dropObj).not.toBe(undefined);
                    let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                    let mousedown: any = getEventObject('MouseEvents', 'mousedown', treeObj.element, li[0].querySelector('.e-list-text'), 15, 10);
                    EventHandler.trigger(treeObj.element, 'mousedown', mousedown);        
                    let mousemove: any = getEventObject('MouseEvents', 'mousemove', treeObj.element, li[0].querySelector('.e-list-text'), 15, 70);
                    EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                    mousemove.srcElement = mousemove.target = mousemove.toElement = li[0].querySelector('.e-list-text');
                    mousemove = setMouseCordinates(mousemove, 15, 75);
                    EventHandler.trigger(<any>(document), 'mousemove', mousemove);        
                    let mouseup: any = getEventObject('MouseEvents', 'mouseup', treeObj.element, li[0].querySelector('.e-list-text'));
                    mouseup.type = 'mouseup';
                    EventHandler.trigger(<any>(document), 'mouseup', mouseup);            
                    done();
                }, 100);
            });
            it('fullRowSelect property testing', (done: Function) => {
                treeObj = new TreeView({ 
                    fields: { dataSource: localData1, id: "nodeId", parentID: 'nodePid', text: "nodeText", hasChildren: "hasChild" },
                },'#tree1');
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    expect(treeObj.element.classList.contains('e-fullrow-wrap')).toBe(true);
                    let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                    expect(li[0].childElementCount).toBe(2);
                    done();
                }, 100);
            });
            it('allowMultiSelection property testing with default value', (done: Function) => {
                treeObj = new TreeView({ 
                    fields: { dataSource: localData3, id: "nodeId", parentID: 'nodePid', text: "nodeText", hasChildren: "hasChild", selected: 'nodeSelected1', },
                },'#tree1');
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                    // check selected attribute
                    expect(li[0].classList.contains('e-active')).toBe(true);
                    expect(treeObj.selectedNodes.length).toBe(1);
                    expect(treeObj.selectedNodes).toContain('01');
                    mouseEventArgs.ctrlKey = true;
                    mouseEventArgs.target = li[1].querySelector('.e-list-text');
                    treeObj.touchClickObj.tap(tapEvent);
                    // select node with id
                    expect(li[0].classList.contains('e-active')).toBe(false);
                    expect(li[1].classList.contains('e-active')).toBe(true);
                    expect(treeObj.selectedNodes.length).toBe(1);
                    expect(treeObj.selectedNodes).not.toContain('01');
                    expect(treeObj.selectedNodes).toContain('02');
                    // checking ctrl key
                    mouseEventArgs.target = li[1].querySelector('.e-list-text');
                    treeObj.touchClickObj.tap(tapEvent);
                    expect(li[0].classList.contains('e-active')).toBe(false);
                    expect(li[1].classList.contains('e-active')).toBe(true);
                    expect(treeObj.selectedNodes.length).toBe(1);
                    expect(treeObj.selectedNodes).not.toContain('01');
                    expect(treeObj.selectedNodes).toContain('02');
                    // checking shift key
                    mouseEventArgs.ctrlKey = false;
                    mouseEventArgs.shiftKey = true;
                    mouseEventArgs.target = li[3].querySelector('.e-list-text');
                    treeObj.touchClickObj.tap(tapEvent);
                    expect(li[0].classList.contains('e-active')).toBe(false);
                    expect(li[1].classList.contains('e-active')).toBe(false);
                    expect(li[2].classList.contains('e-active')).toBe(false);
                    expect(li[3].classList.contains('e-active')).toBe(true);
                    expect(treeObj.selectedNodes.length).toBe(1);
                    expect(treeObj.selectedNodes).not.toContain('01');
                    expect(treeObj.selectedNodes).not.toContain('02');
                    expect(treeObj.selectedNodes).not.toContain('03');
                    expect(treeObj.selectedNodes).toContain('04');
                    done();
                }, 100);
            });
            it('allowMultiSelection property testing', (done: Function) => {
                treeObj = new TreeView({ 
                    fields: { dataSource: localData3, id: "nodeId", parentID: 'nodePid', text: "nodeText", hasChildren: "hasChild", selected: 'nodeSelected1', },
                    allowMultiSelection: true,
                },'#tree1');
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                    expect(li[0].classList.contains('e-active')).toBe(true);
                    expect(li[3].classList.contains('e-active')).toBe(true);
                    expect(treeObj.selectedNodes.length).toBe(2);
                    expect(treeObj.selectedNodes).toContain('01');
                    expect(treeObj.selectedNodes).toContain('04');
                    // select node with id
                    mouseEventArgs.ctrlKey = true;
                    mouseEventArgs.target = li[1].querySelector('.e-list-text');
                    treeObj.touchClickObj.tap(tapEvent);
                    expect(li[0].classList.contains('e-active')).toBe(true);
                    expect(li[1].classList.contains('e-active')).toBe(true);
                    expect(li[3].classList.contains('e-active')).toBe(true);
                    expect(treeObj.selectedNodes.length).toBe(3);
                    expect(treeObj.selectedNodes).toContain('01');
                    expect(treeObj.selectedNodes).toContain('02');
                    expect(treeObj.selectedNodes).toContain('04');
                    // unselect node with id
                    mouseEventArgs.target = li[1].querySelector('.e-list-text');
                    treeObj.touchClickObj.tap(tapEvent);
                    expect(li[1].classList.contains('e-active')).toBe(false);
                    expect(li[0].classList.contains('e-active')).toBe(true);
                    expect(li[3].classList.contains('e-active')).toBe(true);
                    expect(treeObj.selectedNodes.length).toBe(2);
                    expect(treeObj.selectedNodes).not.toContain('02');
                    expect(treeObj.selectedNodes).toContain('01');
                    expect(treeObj.selectedNodes).toContain('04');
                    // select node without id
                    mouseEventArgs.target = li[7].querySelector('.e-list-text');
                    treeObj.touchClickObj.tap(tapEvent);
                    expect(li[1].classList.contains('e-active')).toBe(false);
                    expect(li[0].classList.contains('e-active')).toBe(true);
                    expect(li[3].classList.contains('e-active')).toBe(true);
                    expect(li[7].classList.contains('e-active')).toBe(true);
                    expect(treeObj.selectedNodes.length).toBe(3);
                    expect(treeObj.selectedNodes).not.toContain('02');
                    expect(treeObj.selectedNodes).toContain('01');
                    expect(treeObj.selectedNodes).toContain('04');
                    expect(treeObj.selectedNodes).not.toContain(null);
                    // unselect node without id
                    mouseEventArgs.target = li[7].querySelector('.e-list-text');
                    treeObj.touchClickObj.tap(tapEvent);
                    expect(li[1].classList.contains('e-active')).toBe(false);
                    expect(li[0].classList.contains('e-active')).toBe(true);
                    expect(li[3].classList.contains('e-active')).toBe(true);
                    expect(li[7].classList.contains('e-active')).toBe(false);
                    expect(treeObj.selectedNodes.length).toBe(2);
                    expect(treeObj.selectedNodes).not.toContain('02');
                    expect(treeObj.selectedNodes).toContain('01');
                    expect(treeObj.selectedNodes).toContain('04');
                    expect(treeObj.selectedNodes).not.toContain(null);
                    done();
                }, 100);
            });
            it('allowMultiSelection property testing with shift key', (done: Function) => {
                treeObj = new TreeView({ 
                    fields: { dataSource: localData3, id: "nodeId", parentID: 'nodePid', text: "nodeText", hasChildren: "hasChild", },
                    allowMultiSelection: true,
                },'#tree1');
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                    // select middle node
                    mouseEventArgs.shiftKey = true;
                    mouseEventArgs.target = li[1].querySelector('.e-list-text');
                    treeObj.touchClickObj.tap(tapEvent);
                    expect(li[1].classList.contains('e-active')).toBe(true);
                    expect(treeObj.selectedNodes.length).toBe(1);
                    expect(treeObj.selectedNodes).toContain('02');
                    // select first node
                    mouseEventArgs.target = li[0].querySelector('.e-list-text');
                    treeObj.touchClickObj.tap(tapEvent);
                    expect(li[0].classList.contains('e-active')).toBe(true);
                    expect(li[1].classList.contains('e-active')).toBe(true);
                    expect(treeObj.selectedNodes.length).toBe(2);
                    expect(treeObj.selectedNodes).toContain('01');
                    expect(treeObj.selectedNodes).toContain('02');
                    // select next node
                    mouseEventArgs.target = li[3].querySelector('.e-list-text');
                    treeObj.touchClickObj.tap(tapEvent);
                    expect(li[0].classList.contains('e-active')).toBe(false);
                    expect(li[1].classList.contains('e-active')).toBe(true);
                    expect(li[2].classList.contains('e-active')).toBe(true);
                    expect(li[3].classList.contains('e-active')).toBe(true);
                    expect(treeObj.selectedNodes.length).toBe(3);
                    expect(treeObj.selectedNodes).not.toContain('01');
                    expect(treeObj.selectedNodes).toContain('02');
                    expect(treeObj.selectedNodes).toContain('03');
                    expect(treeObj.selectedNodes).toContain('04');
                    // expand first node
                    mouseEventArgs.shiftKey = false;
                    mouseEventArgs.target = li[0].querySelector('.e-icons');
                    treeObj.touchClickObj.tap(tapEvent);
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function() {
                        // collpase first node
                        mouseEventArgs.target = li[0].querySelector('.e-icons');
                        treeObj.touchClickObj.tap(tapEvent);
                        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                        setTimeout(function() {
                            let newli: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                            // check invisible node
                            mouseEventArgs.shiftKey = true;
                            mouseEventArgs.target = newli[0].querySelector('.e-list-text');
                            treeObj.touchClickObj.tap(tapEvent);
                            expect(newli[0].classList.contains('e-active')).toBe(true);
                            expect(newli[1].classList.contains('e-active')).toBe(false);
                            expect(newli[2].classList.contains('e-active')).toBe(true);
                            expect(newli[3].classList.contains('e-active')).toBe(false);
                            expect(newli[4].classList.contains('e-active')).toBe(false);
                            expect(treeObj.selectedNodes.length).toBe(2);
                            expect(treeObj.selectedNodes).toContain('01');
                            expect(treeObj.selectedNodes).not.toContain('01-01');
                            expect(treeObj.selectedNodes).toContain('02');
                            expect(treeObj.selectedNodes).not.toContain('03');
                            expect(treeObj.selectedNodes).not.toContain('04');
                            done();
                        }, 450);
                    }, 450);
                }, 100);
            });
            it('allowMultiSelection property testing with selected attribute', (done: Function) => {
                treeObj = new TreeView({ 
                    fields: { dataSource: localData3, id: "nodeId", parentID: 'nodePid', text: "nodeText", hasChildren: "hasChild", selected: 'nodeSelected1', expanded: 'nodeExpanded1' },
                    allowMultiSelection: true,
                },'#tree1');
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                    expect(li[0].classList.contains('e-active')).toBe(true);
                    expect(li[3].classList.contains('e-active')).toBe(true);
                    expect(li[4].classList.contains('e-active')).toBe(true);
                    expect(treeObj.selectedNodes.length).toBe(3);
                    expect(treeObj.selectedNodes).toContain('01');
                    expect(treeObj.selectedNodes).toContain('04');
                    expect(treeObj.selectedNodes).toContain('04-01');
                    done();
                }, 100);
            });
            it('allowMultiSelection property testing with selectedNodes', (done: Function) => {
                treeObj = new TreeView({ 
                    fields: { dataSource: localData3, id: "nodeId", parentID: 'nodePid', text: "nodeText", hasChildren: "hasChild", selected: 'nodeSelected1', expanded: 'nodeExpanded1' },
                    allowMultiSelection: true,
                    selectedNodes: ['02', '03', '04-02']
                },'#tree1');
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                    expect(li[0].classList.contains('e-active')).toBe(false);
                    expect(li[3].classList.contains('e-active')).toBe(false);
                    expect(li[4].classList.contains('e-active')).toBe(false);
                    expect(li[1].classList.contains('e-active')).toBe(true);
                    expect(li[2].classList.contains('e-active')).toBe(true);
                    expect(li[8].classList.contains('e-active')).toBe(true);
                    expect(treeObj.selectedNodes.length).toBe(3);
                    expect(treeObj.selectedNodes).not.toContain('01');
                    expect(treeObj.selectedNodes).not.toContain('04');
                    expect(treeObj.selectedNodes).not.toContain('04-01');
                    expect(treeObj.selectedNodes).toContain('02');
                    expect(treeObj.selectedNodes).toContain('03');
                    expect(treeObj.selectedNodes).toContain('04-02');
                    done();
                }, 100);
            });
            it('template support testing with draw event', (done: Function) => {
                treeObj = new TreeView({ 
                    fields: { dataSource: localData1, id: "nodeId", parentID: 'nodePid', text: "nodeText", hasChildren: "hasChild", expanded: 'nodeExpanded1' },
                    drawNode: (args) => {
                        var rowDiv = document.createElement('span');
                        if (!args.node.querySelector('.e-icons')) {
                            rowDiv.className += 'child';
                        } else {
                            rowDiv.className += 'parent';
                        }
                        args.node.children[1].appendChild(rowDiv);
                    },
                },'#tree1');
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-text-content');
                    expect(li[0].querySelector('.parent')).not.toBe(null);
                    expect(li[0].querySelector('.child')).toBe(null);
                    expect(li[1].querySelector('.child')).not.toBe(null);
                    expect(li[1].querySelector('.parent')).toBe(null);
                    done();
                }, 450);
            });
            it('template support testing with string', (done: Function) => {
                treeObj = new TreeView({ 
                    fields: { dataSource: localData1, id: "nodeId", parentID: 'nodePid', text: "nodeText", hasChildren: "hasChild", expanded: 'nodeExpanded1' },
                    nodeTemplate: '${if(hasChild == undefined)}<b>${nodeText}</b>${else}<i>${nodeText}</i>${/if}',
                },'#tree1');
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-text-content');
                    expect(li[0].querySelector('i')).not.toBe(null);
                    expect(li[0].querySelector('b')).toBe(null);
                    expect(li[1].querySelector('b')).not.toBe(null);
                    expect(li[1].querySelector('i')).toBe(null);
                    done();
                }, 450);
            });
            it('template support testing with script', (done: Function) => {
                let template: Element = createElement('div', { id: 'template' });
                template.innerHTML = '${if(hasChild == undefined)}<b>${nodeText}</b>${else}<i>${nodeText}</i>${/if}';
                document.body.appendChild(template);    
                treeObj = new TreeView({ 
                    fields: { dataSource: localData1, id: "nodeId", parentID: 'nodePid', text: "nodeText", hasChildren: "hasChild", expanded: 'nodeExpanded1' },
                    nodeTemplate: '#template',
                    allowEditing: true,
                },'#tree1');
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    let txt: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-text-content');
                    expect(txt[0].querySelector('i')).not.toBe(null);
                    expect(txt[0].querySelector('b')).toBe(null);
                    expect(txt[1].querySelector('b')).not.toBe(null);
                    expect(txt[1].querySelector('i')).toBe(null);
                    let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                    tapEvent.tapCount = 2;
                    mouseEventArgs.target = li[0].querySelector('.e-list-text');
                    treeObj.touchExpandObj.tap(tapEvent);
                    treeObj.touchEditObj.tap(tapEvent);
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function() {
                        expect(li[0].querySelector('.e-list-text').childElementCount).toBe(1);
                        expect(li[0].querySelector('.e-input').nodeName).toBe('INPUT');
                        expect((li[0].querySelector('.e-input') as HTMLInputElement).value).toBe('Music');
                        (li[0].querySelector('.e-input') as HTMLInputElement).value = 'Music node';
                        (li[0].querySelector('.e-input') as HTMLInputElement).blur();
                        expect(li[0].querySelector('.e-list-text').childElementCount).toBe(1);
                        expect((li[0].querySelector('.e-list-text') as HTMLElement).textContent).toBe('Music node');
                        mouseEventArgs.target = li[0].querySelector('.e-list-text');
                        treeObj.touchExpandObj.tap(tapEvent);
                        treeObj.touchEditObj.tap(tapEvent);
                        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                        setTimeout(function() {
                            expect((li[0].querySelector('.e-input') as HTMLInputElement).value).toBe('Music node');
                            (li[0].querySelector('.e-input') as HTMLInputElement).value = 'Music';
                            (li[0].querySelector('.e-input') as HTMLInputElement).blur();
                            expect(li[0].querySelector('.e-list-text').childElementCount).toBe(1);
                            expect((li[0].querySelector('.e-list-text') as HTMLElement).textContent).toBe('Music');
                            done();
                        }, 450);
                    }, 450);
                }, 450);
            });
            it('expandedNodes property testing with null value', (done: Function) => {
                treeObj = new TreeView({ 
                    fields: { dataSource: localData },
                    expandedNodes: null
                },'#tree1');
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                    expect(li.length).toBe(10);
                    expect(treeObj.expandedNodes.length).toBe(2);
                    expect(treeObj.expandedNodes).not.toContain(null);
                    expect(treeObj.expandedNodes).toContain('23');
                    expect(treeObj.expandedNodes).toContain('24');
                    done();
                }, 450);
            });
            it('expandedNodes property testing', (done: Function) => {
                treeObj = new TreeView({ 
                    fields: { dataSource: localData },
                    expandedNodes: ['16', '30', '31']
                },'#tree1');
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                    expect(li.length).toBe(7);
                    expect(treeObj.expandedNodes.length).toBe(1);
                    expect(treeObj.expandedNodes).not.toContain('30');
                    expect(treeObj.expandedNodes).not.toContain('31');
                    expect(treeObj.expandedNodes).not.toContain('23');
                    expect(treeObj.expandedNodes).not.toContain('24');
                    expect(treeObj.expandedNodes).toContain('16');
                    done();
                }, 450);
            });
            it('expandedNodes property testing with nested level', (done: Function) => {
                treeObj = new TreeView({ 
                    fields: { dataSource: localData },
                    expandedNodes: ['16', '17']
                },'#tree1');
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                    expect(li.length).toBe(10);
                    expect(treeObj.expandedNodes.length).toBe(2);
                    expect(treeObj.expandedNodes).not.toContain('23');
                    expect(treeObj.expandedNodes).not.toContain('24');
                    expect(treeObj.expandedNodes).toContain('16');
                    expect(treeObj.expandedNodes).toContain('17');
                    done();
                }, 450);
            });
            it('expandedNodes property testing with set model', (done: Function) => {
                treeObj = new TreeView({ 
                    fields: { dataSource: localData },
                    expandedNodes: ['16', '17']
                },'#tree1');
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                    expect(li.length).toBe(10);
                    expect(treeObj.expandedNodes.length).toBe(2);
                    expect(treeObj.expandedNodes).not.toContain('23');
                    expect(treeObj.expandedNodes).not.toContain('24');
                    expect(treeObj.expandedNodes).toContain('16');
                    expect(treeObj.expandedNodes).toContain('17');
                    treeObj.expandedNodes = null;
                    treeObj.dataBind();
                    expect(treeObj.expandedNodes.length).toBe(0);
                    expect(treeObj.expandedNodes).not.toContain(null);
                    expect(treeObj.expandedNodes).not.toContain('16');
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function() {
                        treeObj.expandedNodes = ['23', '24', '30', '31'];
                        treeObj.dataBind();
                        expect(treeObj.expandedNodes.length).toBe(2);
                        expect(treeObj.expandedNodes).toContain('23');
                        expect(treeObj.expandedNodes).toContain('24');
                        expect(treeObj.expandedNodes).not.toContain('16');
                        expect(treeObj.expandedNodes).not.toContain('17');
                        expect(treeObj.expandedNodes).not.toContain('30');
                        expect(treeObj.expandedNodes).not.toContain('31');
                        done();
                    }, 450);
                }, 450);
            });
            it('removeNodes method testing with expandedNodes property', (done: Function) => {
                treeObj = new TreeView({ 
                    fields: { dataSource: localData3, id: "nodeId", parentID: 'nodePid', text: "nodeText", hasChildren: "hasChild", selected: 'nodeSelected1', expanded: 'nodeExpanded1' },
                },'#tree1');
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                    expect(li.length).toBe(17);
                    expect(treeObj.getTreeData().length).toBe(29);
                    treeObj.removeNodes(['04-01-03']);
                    let nli: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                    expect(nli.length).toBe(16);
                    expect(treeObj.getTreeData().length).toBe(28);
                    treeObj.removeNodes(['04-01-02']);
                    let neli: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                    expect(neli.length).toBe(15);
                    expect(treeObj.getTreeData().length).toBe(27);
                    done();
                }, 100);
            });
            it('hasChildren property value updated after removeNodes with loadOnDemand disabled', (done: Function) => {
                treeObj = new TreeView({ 
                    fields: { dataSource: localData3, id: "nodeId", parentID: 'nodePid', text: "nodeText", hasChildren: "hasChild", selected: 'nodeSelected1', expanded: 'nodeExpanded1' },
                    loadOnDemand: false
                },'#tree1');
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    expect(treeObj.getTreeData().length).toBe(29);
                    expect(treeObj.getTreeData("01")[0]["hasChild"]).toBe(true);
                    treeObj.removeNodes(['01-01']);
                    expect(treeObj.getTreeData().length).toBe(28);
                    expect(treeObj.getTreeData("01")[0]["hasChild"]).toBe(false);
                    expect(treeObj.getTreeData("01")[0]["hasChild"]).not.toBe(null);
                    done();
                }, 100);
            });
            it('hasChildren property value updated after removeNodes with loadOnDemand enabled', (done: Function) => {
                treeObj = new TreeView({ 
                    fields: { dataSource: localData3, id: "nodeId", parentID: 'nodePid', text: "nodeText", hasChildren: "hasChild", selected: 'nodeSelected1', expanded: 'nodeExpanded1' },
                    loadOnDemand: false
                },'#tree1');
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    expect(treeObj.getTreeData().length).toBe(29);
                    treeObj.removeNodes(['04-01-01', '04-01-02', '04-01-03']);
                    expect(treeObj.getTreeData().length).toBe(26);
                    expect(treeObj.getTreeData("04-01")[0]["hasChild"]).toBe(false);
                    expect(treeObj.getTreeData("01")[0]["hasChild"]).not.toBe(null);
                    done();
                }, 100);
            });

        });
        describe('property change testing', () => {
            let treeObj: any;
            let mouseEventArgs: any;
            let tapEvent: any;
            let keyboardEventArgs: any = {
                preventDefault: (): void => {},
                action: null,
                target: null,
                stopImmediatePropagation: (): void => {},
            };
            beforeEach((): void => {
                mouseEventArgs = {
                    preventDefault: (): void => {},
                    stopImmediatePropagation: (): void => {},
                    target: null,
                    type: null,
                    shiftKey: false,
                    ctrlKey: false
                };
                tapEvent = {
                    originalEvent: mouseEventArgs,
                    tapCount: 1
                };
                let ele: HTMLElement = createElement('div', { id: 'tree1' });
                document.body.appendChild(ele);
                treeObj = new TreeView({ 
                    fields: { dataSource: localData2, id: "nodeId", parentID: 'nodePid', text: "nodeText", hasChildren: "hasChild", navigateUrl: 'nodeUrl',
                        iconCss: 'nodeIcon', imageUrl: 'nodeImage', tooltip: 'nodeTooltip', htmlAttributes: 'nodeHtmlAttr', selected: 'nodeSelected' },
                    fullRowSelect: false,
                });
                treeObj.appendTo(ele);
            });
            afterEach(() => {
                if (treeObj)
                    treeObj.destroy();
                document.body.innerHTML = '';
            });
            it('dataSource property', () => {
                expect(treeObj.element.querySelectorAll('li').length).toBe(2);
                expect(treeObj.element.querySelector('.e-list-text').innerHTML).toBe('Music');
                expect(treeObj.element.querySelector('.e-list-item').getAttribute('data-uid')).toBe('01');
                expect(treeObj.element.querySelector('.e-list-icon').classList.contains('folder')).toBe(true);
                expect(treeObj.element.querySelector('.e-list-img').src.indexOf('images/Shooting.png')).not.toBe(-1);
                expect(treeObj.element.querySelector('.e-list-item').title).toBe('This is Music node');
                expect(treeObj.element.querySelectorAll('li')[1].classList.contains('firstnode')).toBe(true);
                expect(treeObj.element.querySelectorAll('li')[1].style.backgroundColor).toBe('red');
                treeObj.fields.dataSource = localData1;
                treeObj.dataBind();
                expect(treeObj.element.querySelectorAll('li').length).toBe(5);
                expect(treeObj.element.querySelector('.e-list-text').innerHTML).toBe('Music');
                expect(treeObj.element.querySelector('.e-list-item').getAttribute('data-uid')).toBe('01');
                expect(treeObj.element.querySelector('.e-list-icon').classList.contains('folder')).toBe(true);
                expect(treeObj.element.querySelector('.e-list-img').src.indexOf('images/Shooting.png')).not.toBe(-1);
                expect(treeObj.element.querySelector('.e-list-item').title).toBe('This is Music node');
                expect(treeObj.element.querySelectorAll('li')[1].classList.contains('firstnode')).toBe(true);
                expect(treeObj.element.querySelectorAll('li')[1].style.backgroundColor).toBe('red');
            });
            it('fields text property', () => {
                expect(treeObj.element.querySelector('.e-list-text').innerHTML).toBe('Music');
                expect(treeObj.element.querySelector('.e-list-item').getAttribute('data-uid')).toBe('01');
                expect(treeObj.element.querySelector('.e-list-icon').classList.contains('folder')).toBe(true);
                expect(treeObj.element.querySelector('.e-list-img').src.indexOf('images/Shooting.png')).not.toBe(-1);
                expect(treeObj.element.querySelector('.e-list-item').title).toBe('This is Music node');
                expect(treeObj.element.querySelectorAll('li')[1].classList.contains('firstnode')).toBe(true);
                expect(treeObj.element.querySelectorAll('li')[1].style.backgroundColor).toBe('red');
                treeObj.fields = { text: 'subText' };
                treeObj.dataBind();
                expect(treeObj.element.querySelector('.e-list-text').innerHTML).toBe('Pictures');
                expect(treeObj.element.querySelector('.e-list-item').getAttribute('data-uid')).toBe('01');
                expect(treeObj.element.querySelector('.e-list-icon').classList.contains('folder')).toBe(true);
                expect(treeObj.element.querySelector('.e-list-img').src.indexOf('images/Shooting.png')).not.toBe(-1);
                expect(treeObj.element.querySelector('.e-list-item').title).toBe('This is Music node');
                expect(treeObj.element.querySelectorAll('li')[1].classList.contains('firstnode')).toBe(true);
                expect(treeObj.element.querySelectorAll('li')[1].style.backgroundColor).toBe('red');
            });
            it('fields id property', () => {
                expect(treeObj.element.querySelector('.e-list-text').innerHTML).toBe('Music');
                expect(treeObj.element.querySelector('.e-list-item').getAttribute('data-uid')).toBe('01');
                expect(treeObj.element.querySelector('.e-list-icon').classList.contains('folder')).toBe(true);
                expect(treeObj.element.querySelector('.e-list-img').src.indexOf('images/Shooting.png')).not.toBe(-1);
                expect(treeObj.element.querySelector('.e-list-item').title).toBe('This is Music node');
                expect(treeObj.element.querySelectorAll('li')[1].classList.contains('firstnode')).toBe(true);
                expect(treeObj.element.querySelectorAll('li')[1].style.backgroundColor).toBe('red');
                treeObj.fields = { id: 'subId' };
                treeObj.dataBind();
                expect(treeObj.element.querySelector('.e-list-text').innerHTML).toBe('Music');
                expect(treeObj.element.querySelector('.e-list-item').getAttribute('data-uid')).toBe('21');
                expect(treeObj.element.querySelector('.e-list-icon').classList.contains('folder')).toBe(true);
                expect(treeObj.element.querySelector('.e-list-img').src.indexOf('images/Shooting.png')).not.toBe(-1);
                expect(treeObj.element.querySelector('.e-list-item').title).toBe('This is Music node');
                expect(treeObj.element.querySelectorAll('li')[1].classList.contains('firstnode')).toBe(true);
                expect(treeObj.element.querySelectorAll('li')[1].style.backgroundColor).toBe('red');
            });
            it('fields parentID property', () => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                mouseEventArgs.target = li[0].querySelector('.e-icons');
                expect(li[0].childElementCount).toBe(1);
                treeObj.touchClickObj.tap(tapEvent);
                expect(li[0].childElementCount).toBe(2);
                expect(treeObj.element.querySelector('.e-list-text').innerHTML).toBe('Music');
                expect(treeObj.element.querySelector('.e-list-item').getAttribute('data-uid')).toBe('01');
                expect(li[0].querySelector('.e-list-parent').querySelector('.e-list-text').innerHTML).toBe('Wind.jpg');
                expect(li[0].querySelector('.e-list-parent').querySelector('.e-list-item').getAttribute('data-uid')).toBe('01-01');
                let cli: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                expect(cli[1].childElementCount).toBe(1);
                mouseEventArgs.target = cli[1].querySelector('.e-icons');
                treeObj.touchClickObj.tap(tapEvent);
                expect(cli[1].childElementCount).toBe(1);
                expect(cli[1].querySelector('.e-icons')).toBe(null);
                treeObj.fields = { id: 'subId', parentID: "subPid" };
                treeObj.dataBind();
                let newli: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                mouseEventArgs.target = newli[0].querySelector('.e-icons');
                expect(newli[0].childElementCount).toBe(1);
                treeObj.touchClickObj.tap(tapEvent);
                expect(newli[0].childElementCount).toBe(2);
                expect(treeObj.element.querySelector('.e-list-text').innerHTML).toBe('Music');
                expect(treeObj.element.querySelector('.e-list-item').getAttribute('data-uid')).toBe('21');
                expect(newli[0].querySelector('.e-list-parent').querySelector('.e-list-text').innerHTML).toBe('Wind.jpg');
                expect(newli[0].querySelector('.e-list-parent').querySelector('.e-list-item').getAttribute('data-uid')).toBe('21-01');
                let dli: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                expect(dli[1].childElementCount).toBe(1);
                mouseEventArgs.target = dli[1].querySelector('.e-icons');
                treeObj.touchClickObj.tap(tapEvent);
                expect(dli[1].childElementCount).toBe(1);
                expect(cli[1].querySelector('.e-icons')).toBe(null);
            });
            it('fields hasChildren property', () => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                mouseEventArgs.target = li[0].querySelector('.e-icons');
                expect(li[0].childElementCount).toBe(1);
                treeObj.touchClickObj.tap(tapEvent);
                expect(li[0].childElementCount).toBe(2);
                expect(treeObj.element.querySelector('.e-list-text').innerHTML).toBe('Music');
                expect(treeObj.element.querySelector('.e-list-item').getAttribute('data-uid')).toBe('01');
                expect(li[0].querySelector('.e-list-parent').querySelector('.e-list-text').innerHTML).toBe('Wind.jpg');
                expect(li[0].querySelector('.e-list-parent').querySelector('.e-list-item').getAttribute('data-uid')).toBe('01-01');
                let cli: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                expect(cli[1].childElementCount).toBe(1);
                mouseEventArgs.target = cli[1].querySelector('.e-icons');
                treeObj.touchClickObj.tap(tapEvent);
                expect(cli[1].childElementCount).toBe(1);
                expect(cli[1].querySelector('.e-icons')).toBe(null);
                treeObj.fields = { hasChildren: 'subHasChild' };
                treeObj.dataBind();
                let newli: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                mouseEventArgs.target = newli[0].querySelector('.e-icons');
                expect(newli[0].childElementCount).toBe(1);
                treeObj.touchClickObj.tap(tapEvent);
                expect(newli[0].childElementCount).toBe(1);
                expect(newli[0].querySelector('.e-icons')).toBe(null);
                expect(treeObj.element.querySelector('.e-list-text').innerHTML).toBe('Music');
                expect(treeObj.element.querySelector('.e-list-item').getAttribute('data-uid')).toBe('01');
            });
            it('fields iconCss property', () => {
                expect(treeObj.element.querySelector('.e-list-text').innerHTML).toBe('Music');
                expect(treeObj.element.querySelector('.e-list-item').getAttribute('data-uid')).toBe('01');
                expect(treeObj.element.querySelector('.e-list-icon').classList.contains('folder')).toBe(true);
                expect(treeObj.element.querySelector('.e-list-img').src.indexOf('images/Shooting.png')).not.toBe(-1);
                expect(treeObj.element.querySelector('.e-list-item').title).toBe('This is Music node');
                expect(treeObj.element.querySelectorAll('li')[1].classList.contains('firstnode')).toBe(true);
                expect(treeObj.element.querySelectorAll('li')[1].style.backgroundColor).toBe('red');
                treeObj.fields = { iconCss: 'subIcon' };
                treeObj.dataBind();
                expect(treeObj.element.querySelector('.e-list-text').innerHTML).toBe('Music');
                expect(treeObj.element.querySelector('.e-list-item').getAttribute('data-uid')).toBe('01');
                expect(treeObj.element.querySelector('.e-list-icon').classList.contains('file')).toBe(true);
                expect(treeObj.element.querySelector('.e-list-img').src.indexOf('images/Shooting.png')).not.toBe(-1);
                expect(treeObj.element.querySelector('.e-list-item').title).toBe('This is Music node');
                expect(treeObj.element.querySelectorAll('li')[1].classList.contains('firstnode')).toBe(true);
                expect(treeObj.element.querySelectorAll('li')[1].style.backgroundColor).toBe('red');
            });
            it('fields imageUrl property', () => {
                expect(treeObj.element.querySelector('.e-list-text').innerHTML).toBe('Music');
                expect(treeObj.element.querySelector('.e-list-item').getAttribute('data-uid')).toBe('01');
                expect(treeObj.element.querySelector('.e-list-icon').classList.contains('folder')).toBe(true);
                expect(treeObj.element.querySelector('.e-list-img').src.indexOf('images/Shooting.png')).not.toBe(-1);
                expect(treeObj.element.querySelector('.e-list-item').title).toBe('This is Music node');
                expect(treeObj.element.querySelectorAll('li')[1].classList.contains('firstnode')).toBe(true);
                expect(treeObj.element.querySelectorAll('li')[1].style.backgroundColor).toBe('red');
                treeObj.fields = { imageUrl: 'subImage' };
                treeObj.dataBind();
                expect(treeObj.element.querySelector('.e-list-text').innerHTML).toBe('Music');
                expect(treeObj.element.querySelector('.e-list-item').getAttribute('data-uid')).toBe('01');
                expect(treeObj.element.querySelector('.e-list-icon').classList.contains('folder')).toBe(true);
                expect(treeObj.element.querySelector('.e-list-img').src.indexOf('images/Cricket.png')).not.toBe(-1);
                expect(treeObj.element.querySelector('.e-list-item').title).toBe('This is Music node');
                expect(treeObj.element.querySelectorAll('li')[1].classList.contains('firstnode')).toBe(true);
                expect(treeObj.element.querySelectorAll('li')[1].style.backgroundColor).toBe('red');
            });
            it('fields tooltip property', () => {
                expect(treeObj.element.querySelector('.e-list-text').innerHTML).toBe('Music');
                expect(treeObj.element.querySelector('.e-list-item').getAttribute('data-uid')).toBe('01');
                expect(treeObj.element.querySelector('.e-list-icon').classList.contains('folder')).toBe(true);
                expect(treeObj.element.querySelector('.e-list-img').src.indexOf('images/Shooting.png')).not.toBe(-1);
                expect(treeObj.element.querySelector('.e-list-item').title).toBe('This is Music node');
                expect(treeObj.element.querySelectorAll('li')[1].classList.contains('firstnode')).toBe(true);
                expect(treeObj.element.querySelectorAll('li')[1].style.backgroundColor).toBe('red');
                treeObj.fields = { tooltip: 'subTooltip' };
                treeObj.dataBind();
                expect(treeObj.element.querySelector('.e-list-text').innerHTML).toBe('Music');
                expect(treeObj.element.querySelector('.e-list-item').getAttribute('data-uid')).toBe('01');
                expect(treeObj.element.querySelector('.e-list-icon').classList.contains('folder')).toBe(true);
                expect(treeObj.element.querySelector('.e-list-img').src.indexOf('images/Shooting.png')).not.toBe(-1);
                expect(treeObj.element.querySelector('.e-list-item').title).toBe('This is Pictures node');
                expect(treeObj.element.querySelectorAll('li')[1].classList.contains('firstnode')).toBe(true);
                expect(treeObj.element.querySelectorAll('li')[1].style.backgroundColor).toBe('red');
            });
            it('fields htmlAttributes property', () => {
                expect(treeObj.element.querySelector('.e-list-text').innerHTML).toBe('Music');
                expect(treeObj.element.querySelector('.e-list-item').getAttribute('data-uid')).toBe('01');
                expect(treeObj.element.querySelector('.e-list-icon').classList.contains('folder')).toBe(true);
                expect(treeObj.element.querySelector('.e-list-img').src.indexOf('images/Shooting.png')).not.toBe(-1);
                expect(treeObj.element.querySelector('.e-list-item').title).toBe('This is Music node');
                expect(treeObj.element.querySelectorAll('li')[1].classList.contains('firstnode')).toBe(true);
                expect(treeObj.element.querySelectorAll('li')[1].style.backgroundColor).toBe('red');
                treeObj.fields = { htmlAttributes: 'subHtmlAttr' };
                treeObj.dataBind();
                expect(treeObj.element.querySelector('.e-list-text').innerHTML).toBe('Music');
                expect(treeObj.element.querySelector('.e-list-item').getAttribute('data-uid')).toBe('01');
                expect(treeObj.element.querySelector('.e-list-icon').classList.contains('folder')).toBe(true);
                expect(treeObj.element.querySelector('.e-list-img').src.indexOf('images/Shooting.png')).not.toBe(-1);
                expect(treeObj.element.querySelector('.e-list-item').title).toBe('This is Music node');
                expect(treeObj.element.querySelectorAll('li')[1].classList.contains('customnode')).toBe(true);
                expect(treeObj.element.querySelectorAll('li')[1].style.backgroundColor).toBe('blue');
            });
            it('fields expanded property', () => {
                expect(treeObj.element.querySelectorAll('li').length).toBe(2);
                expect(treeObj.element.querySelector('.e-list-text').innerHTML).toBe('Music');
                expect(treeObj.element.querySelector('.e-list-item').getAttribute('data-uid')).toBe('01');
                expect(treeObj.element.querySelector('.e-list-icon').classList.contains('folder')).toBe(true);
                expect(treeObj.element.querySelector('.e-list-img').src.indexOf('images/Shooting.png')).not.toBe(-1);
                expect(treeObj.element.querySelector('.e-list-item').title).toBe('This is Music node');
                expect(treeObj.element.querySelectorAll('li')[1].classList.contains('firstnode')).toBe(true);
                expect(treeObj.element.querySelectorAll('li')[1].style.backgroundColor).toBe('red');
                treeObj.fields = { expanded: 'subExpanded' };
                treeObj.dataBind();
                expect(treeObj.element.querySelectorAll('li').length).toBe(3);
                expect(treeObj.element.querySelectorAll('li')[0].childElementCount).toBe(2);
                expect(treeObj.element.querySelector('.e-list-text').innerHTML).toBe('Music');
                expect(treeObj.element.querySelector('.e-list-item').getAttribute('data-uid')).toBe('01');
                expect(treeObj.element.querySelector('.e-list-icon').classList.contains('folder')).toBe(true);
                expect(treeObj.element.querySelector('.e-list-img').src.indexOf('images/Shooting.png')).not.toBe(-1);
                expect(treeObj.element.querySelector('.e-list-item').title).toBe('This is Music node');
                expect(treeObj.element.querySelectorAll('li')[2].classList.contains('firstnode')).toBe(true);
                expect(treeObj.element.querySelectorAll('li')[2].style.backgroundColor).toBe('red');
            });
            it('fields selected property', () => {
                expect(treeObj.element.querySelectorAll('li').length).toBe(2);
                expect(treeObj.element.querySelector('.e-list-text').innerHTML).toBe('Music');
                expect(treeObj.element.querySelector('.e-list-item').getAttribute('data-uid')).toBe('01');
                expect(treeObj.element.querySelector('.e-list-icon').classList.contains('folder')).toBe(true);
                expect(treeObj.element.querySelector('.e-list-img').src.indexOf('images/Shooting.png')).not.toBe(-1);
                expect(treeObj.element.querySelector('.e-list-item').title).toBe('This is Music node');
                expect(treeObj.element.querySelector('.e-list-item').classList.contains('e-active')).toBe(true);
                expect(treeObj.element.querySelectorAll('li')[1].classList.contains('e-active')).toBe(false);
                expect(treeObj.element.querySelectorAll('li')[1].classList.contains('firstnode')).toBe(true);
                expect(treeObj.element.querySelectorAll('li')[1].style.backgroundColor).toBe('red');
                treeObj.fields = { selected: 'subSelected' };
                treeObj.dataBind();
                expect(treeObj.element.querySelectorAll('li').length).toBe(2);
                expect(treeObj.element.querySelector('.e-list-text').innerHTML).toBe('Music');
                expect(treeObj.element.querySelector('.e-list-item').getAttribute('data-uid')).toBe('01');
                expect(treeObj.element.querySelector('.e-list-icon').classList.contains('folder')).toBe(true);
                expect(treeObj.element.querySelector('.e-list-img').src.indexOf('images/Shooting.png')).not.toBe(-1);
                expect(treeObj.element.querySelector('.e-list-item').title).toBe('This is Music node');
                expect(treeObj.element.querySelector('.e-list-item').classList.contains('e-active')).toBe(false);
                expect(treeObj.element.querySelectorAll('li')[1].classList.contains('e-active')).toBe(true);
                expect(treeObj.element.querySelectorAll('li')[1].classList.contains('firstnode')).toBe(true);
                expect(treeObj.element.querySelectorAll('li')[1].style.backgroundColor).toBe('red');
            });
            it('fields url property', () => {
                expect(treeObj.element.querySelector('.e-list-text').innerHTML).toBe('Music');
                expect(treeObj.element.querySelector('.e-list-item').getAttribute('data-uid')).toBe('01');
                expect(treeObj.element.querySelector('.e-list-icon').classList.contains('folder')).toBe(true);
                expect(treeObj.element.querySelector('.e-list-img').src.indexOf('images/Shooting.png')).not.toBe(-1);
                expect(treeObj.element.querySelector('.e-list-item').title).toBe('This is Music node');
                expect(treeObj.element.querySelectorAll('li')[1].classList.contains('firstnode')).toBe(true);
                expect(treeObj.element.querySelectorAll('li')[1].style.backgroundColor).toBe('red');
                expect(treeObj.element.querySelector('.e-list-url').href.indexOf('http://npmci.syncfusion.com/')).not.toBe(-1);
                treeObj.fields = { navigateUrl: 'subUrl' };
                treeObj.dataBind();
                expect(treeObj.element.querySelector('.e-list-text').innerHTML).toBe('Music');
                expect(treeObj.element.querySelector('.e-list-item').getAttribute('data-uid')).toBe('01');
                expect(treeObj.element.querySelector('.e-list-icon').classList.contains('folder')).toBe(true);
                expect(treeObj.element.querySelector('.e-list-img').src.indexOf('images/Shooting.png')).not.toBe(-1);
                expect(treeObj.element.querySelector('.e-list-item').title).toBe('This is Music node');
                expect(treeObj.element.querySelectorAll('li')[1].classList.contains('firstnode')).toBe(true);
                expect(treeObj.element.querySelectorAll('li')[1].style.backgroundColor).toBe('red');
                expect(treeObj.element.querySelector('.e-list-url').href.indexOf('http://npmci.syncfusion.com/')).toBe(-1);
                expect(treeObj.element.querySelector('.e-list-url').href.indexOf('http://ej2.syncfusion.com/demos/')).not.toBe(-1);
            });
            it('expandOn property testing', (done: Function) => {
                treeObj.expandOn = 'None';
                treeObj.dataBind();
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                mouseEventArgs.target = li[0].querySelector('.e-list-text');
                expect((li[0].querySelector('.e-icons') as Element).classList.contains('e-icon-expandable')).toBe(true);
                expect((li[0].querySelector('.e-icons') as Element).classList.contains('e-icon-collapsible')).toBe(false);
                expect(li[0].childElementCount).toBe(1);
                treeObj.touchExpandObj.tap(tapEvent);
                setTimeout(function() {
                    expect((li[0].querySelector('.e-icons') as Element).classList.contains('e-icon-expandable')).toBe(true);
                    expect((li[0].querySelector('.e-icons') as Element).classList.contains('e-icon-collapsible')).toBe(false);
                    expect(li[0].getAttribute('aria-expanded')).toBe('false');
                    done();
                }, 100);
            });
            it('expandOn property testing', (done: Function) => {
                treeObj.expandOn = 'Click';
                treeObj.dataBind();
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                mouseEventArgs.target = li[0].querySelector('.e-list-text');
                expect((li[0].querySelector('.e-icons') as Element).classList.contains('e-icon-expandable')).toBe(true);
                expect((li[0].querySelector('.e-icons') as Element).classList.contains('e-icon-collapsible')).toBe(false);
                expect(li[0].childElementCount).toBe(1);
                treeObj.touchExpandObj.tap(tapEvent);
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    expect((li[0].querySelector('.e-icons') as Element).classList.contains('e-icon-expandable')).toBe(false);
                    expect((li[0].querySelector('.e-icons') as Element).classList.contains('e-icon-collapsible')).toBe(true);
                    expect(li[0].childElementCount).toBe(2);
                    expect(li[0].getAttribute('aria-expanded')).toBe('true');
                    treeObj.touchExpandObj.tap(tapEvent);
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function() {
                        expect((li[0].querySelector('.e-icons') as Element).classList.contains('e-icon-expandable')).toBe(true);
                        expect((li[0].querySelector('.e-icons') as Element).classList.contains('e-icon-collapsible')).toBe(false);
                        expect(li[0].getAttribute('aria-expanded')).toBe('false');
                        treeObj.touchExpandObj.tap(tapEvent);
                        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                        setTimeout(function() {
                            expect((li[0].querySelector('.e-icons') as Element).classList.contains('e-icon-expandable')).toBe(false);
                            expect((li[0].querySelector('.e-icons') as Element).classList.contains('e-icon-collapsible')).toBe(true);
                            expect(li[0].getAttribute('aria-expanded')).toBe('true');                    
                            let newli: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                            mouseEventArgs.target = newli[1].querySelector('.e-list-text');
                            expect(newli[1].querySelector('.e-icons')).not.toBe(null);
                            expect(newli[1].childElementCount).toBe(1);
                            treeObj.touchExpandObj.tap(tapEvent);
                            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                            setTimeout(function() {
                                expect(newli[1].querySelector('.e-icons')).toBe(null);
                                expect(newli[1].childElementCount).toBe(1);
                                expect(newli[1].getAttribute('aria-expanded')).toBe(null);
                                done();
                            }, 450);
                        }, 450);
                    }, 450);
                }, 450);
            });
            it('cssClass property testing', () => {
                treeObj.cssClass = 'customTree productTree';
                treeObj.dataBind();
                expect(document.getElementById('tree1').classList.contains('customTree')).toEqual(true);
                expect(document.getElementById('tree1').classList.contains('productTree')).toEqual(true);
                expect(document.getElementById('tree1').classList.contains('dynamicTree')).toEqual(false);
                expect(document.getElementById('tree1').classList.contains('demoTree')).toEqual(false);
                treeObj.cssClass = 'dynamicTree demoTree';
                treeObj.dataBind();
                expect(document.getElementById('tree1').classList.contains('customTree')).toEqual(false);
                expect(document.getElementById('tree1').classList.contains('productTree')).toEqual(false);
                expect(document.getElementById('tree1').classList.contains('dynamicTree')).toEqual(true);
                expect(document.getElementById('tree1').classList.contains('demoTree')).toEqual(true);
                treeObj.cssClass = '';
                treeObj.dataBind();
                expect(document.getElementById('tree1').classList.contains('dynamicTree')).toEqual(false);
                expect(document.getElementById('tree1').classList.contains('demoTree')).toEqual(false);
            });
            it('selectedNodes property testing', () => {
                expect(treeObj.element.querySelector('.e-list-item').classList.contains('e-active')).toBe(true);
                expect(treeObj.element.querySelectorAll('li')[1].classList.contains('e-active')).toBe(false);
                treeObj.selectedNodes = ['02'];
                treeObj.dataBind();
                expect(treeObj.element.querySelector('.e-list-item').classList.contains('e-active')).toBe(false);
                expect(treeObj.element.querySelectorAll('li')[1].classList.contains('e-active')).toBe(true);
            });
            it('sortOrder property testing', (done: Function) => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                expect(li.length).toBe(2);
                expect(li[0].querySelector('.e-list-text').innerHTML).toBe('Music');
                expect(li[0].getAttribute('data-uid')).toBe('01');
                treeObj.sortOrder = 'Ascending';
                treeObj.dataBind();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    let li1: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                    expect(li1.length).toBe(2);
                    expect(li1[0].querySelector('.e-list-text').innerHTML).toBe('Downloads');
                    expect(li1[0].getAttribute('data-uid')).toBe('02');
                    treeObj.sortOrder = 'Descending';
                    treeObj.dataBind();
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function() {
                        let li2: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                        expect(li2.length).toBe(2);
                        expect(li2[0].querySelector('.e-list-text').innerHTML).toBe('Music');
                        expect(li2[0].getAttribute('data-uid')).toBe('01');
                        treeObj.sortOrder = 'Ascending';
                        treeObj.dataBind();
                        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                        setTimeout(function() {
                            let li3: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                            expect(li3.length).toBe(2);
                            expect(li3[0].querySelector('.e-list-text').innerHTML).toBe('Downloads');
                            expect(li3[0].getAttribute('data-uid')).toBe('02');
                            treeObj.sortOrder = 'None';
                            treeObj.dataBind();
                            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                            setTimeout(function() {
                                let li4: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                                expect(li4.length).toBe(2);
                                expect(li4[0].querySelector('.e-list-text').innerHTML).toBe('Music');
                                expect(li4[0].getAttribute('data-uid')).toBe('01');
                                done();
                            }, 100);
                        }, 100);
                    }, 100);
                }, 100);
            });
            it('allowEditing property testing', (done: Function) => {
                treeObj.allowEditing = true;
                treeObj.dataBind();
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                expect(li[0].querySelector('.e-icons').classList.contains('e-icon-expandable')).toBe(true);
                expect(li[0].querySelector('.e-icons').classList.contains('e-icon-collapsible')).toBe(false);
                expect(li[0].childElementCount).toBe(1);
                expect(li[0].querySelector('.e-list-text').childElementCount).toBe(0);
                tapEvent.tapCount = 2;
                mouseEventArgs.target = li[0].querySelector('.e-list-text');
                treeObj.touchExpandObj.tap(tapEvent);
                treeObj.touchEditObj.tap(tapEvent);
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    expect(li[0].querySelector('.e-icons').classList.contains('e-icon-expandable')).toBe(false);
                    expect(li[0].querySelector('.e-icons').classList.contains('e-icon-collapsible')).toBe(true);
                    expect(li[0].childElementCount).toBe(2);
                    expect(li[0].querySelector('.e-list-text').childElementCount).toBe(1);
                    expect(li[0].querySelector('.e-input').nodeName).toBe('INPUT');
                    expect((li[0].querySelector('.e-input') as HTMLInputElement).value).toBe('Music');
                    (li[0].querySelector('.e-input') as HTMLInputElement).value = 'Music node';
                    (li[0].querySelector('.e-input') as HTMLInputElement).blur();
                    expect(li[0].querySelector('.e-list-text').childElementCount).toBe(0);
                    expect((li[0].querySelector('.e-list-text') as HTMLElement).childNodes[0].nodeValue).toBe('Music node');
                    mouseEventArgs.target = li[0].querySelector('.e-list-text');
                    treeObj.touchExpandObj.tap(tapEvent);
                    treeObj.touchEditObj.tap(tapEvent);
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function() {
                        expect((li[0].querySelector('.e-input') as HTMLInputElement).value).toBe('Music node');
                        (li[0].querySelector('.e-input') as HTMLInputElement).value = 'Music';
                        (li[0].querySelector('.e-input') as HTMLInputElement).blur();
                        expect(li[0].querySelector('.e-list-text').childElementCount).toBe(0);
                        expect((li[0].querySelector('.e-list-text') as HTMLElement).childNodes[0].nodeValue).toBe('Music');
                        treeObj.allowEditing = false;
                        treeObj.dataBind();
                        mouseEventArgs.target = li[0].querySelector('.e-list-text');
                        treeObj.touchExpandObj.tap(tapEvent);
                        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                        setTimeout(function() {
                            expect(li[0].querySelector('.e-icons').classList.contains('e-icon-expandable')).toBe(false);
                            expect(li[0].querySelector('.e-icons').classList.contains('e-icon-collapsible')).toBe(true);
                            expect(li[0].childElementCount).toBe(2);
                            expect(li[0].querySelector('.e-list-text').childElementCount).toBe(0);
                            done();
                        }, 450);
                    }, 450);
                }, 450);
            });
            it('enableRtl property testing', () => {
                expect(document.getElementById('tree1').classList.contains('e-rtl')).toEqual(false);
                treeObj.enableRtl = true;
                treeObj.dataBind();
                expect(document.getElementById('tree1').classList.contains('e-rtl')).toEqual(true);
                treeObj.enableRtl = false;
                treeObj.dataBind();
                expect(document.getElementById('tree1').classList.contains('e-rtl')).toEqual(false);
            });
            it('allowDragAndDrop property testing', () => {
                expect(treeObj.dragObj).toBe(undefined);
                expect(treeObj.dropObj).toBe(undefined);
                treeObj.allowDragAndDrop = true;
                treeObj.dataBind();
                expect(treeObj.dragObj.isDestroyed).toBe(false);
                expect(treeObj.dropObj.isDestroyed).toBe(false);
                treeObj.allowDragAndDrop = false;
                treeObj.dataBind();
                expect(treeObj.dragObj.isDestroyed).toBe(true);
                expect(treeObj.dropObj.isDestroyed).toBe(true);
            });
            it('fullRowSelect property testing', () => {
                expect(document.getElementById('tree1').classList.contains('e-fullrow-wrap')).toEqual(false);
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                expect(li[0].childElementCount).toBe(1);
                treeObj.fullRowSelect = true;
                treeObj.dataBind();
                expect(document.getElementById('tree1').classList.contains('e-fullrow-wrap')).toEqual(true);
                let newli: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                expect(newli[0].childElementCount).toBe(2);
                treeObj.fullRowSelect = false;
                treeObj.dataBind();
                expect(document.getElementById('tree1').classList.contains('e-fullrow-wrap')).toEqual(false);
                let cusli: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                expect(cusli[0].childElementCount).toBe(1);
                treeObj.fullRowSelect = true;
                treeObj.dataBind();
                expect(document.getElementById('tree1').classList.contains('e-fullrow-wrap')).toEqual(true);
            });
            it('allowMultiSelection property testing', () => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                expect(li[0].classList.contains('e-active')).toBe(true);
                expect(li[1].classList.contains('e-active')).toBe(false);
                expect(treeObj.selectedNodes.length).toBe(1);
                expect(treeObj.selectedNodes).toContain('01');
                treeObj.allowMultiSelection = true;
                treeObj.dataBind();
                mouseEventArgs.ctrlKey = true;
                mouseEventArgs.target = li[1].querySelector('.e-list-text');
                treeObj.touchClickObj.tap(tapEvent);
                expect(li[0].classList.contains('e-active')).toBe(true);
                expect(li[1].classList.contains('e-active')).toBe(true);
                expect(treeObj.selectedNodes.length).toBe(2);
                expect(treeObj.selectedNodes).toContain('01');
                expect(treeObj.selectedNodes).toContain('02');
                treeObj.allowMultiSelection = false;
                treeObj.dataBind();
                expect(li[0].classList.contains('e-active')).toBe(true);
                expect(li[1].classList.contains('e-active')).toBe(false);
                expect(treeObj.selectedNodes.length).toBe(1);
                expect(treeObj.selectedNodes).toContain('01');
                expect(treeObj.selectedNodes).not.toContain('02');
            });
            it('nodeTemplate property testing', (done: Function) => {
                let template: Element = createElement('div', { id: 'template' });
                template.innerHTML = '${if(hasChild == undefined)}<b>${nodeText}</b>${else}<i>${nodeText}</i>${/if}';
                document.body.appendChild(template);
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-text-content');
                expect(li[0].querySelector('i')).toBe(null);
                expect(li[0].querySelector('b')).toBe(null);
                treeObj.nodeTemplate = 'template';
                treeObj.dataBind();
                let nli: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-text-content');
                expect(nli[0].querySelector('i')).toBe(null);
                expect(nli[0].querySelector('b')).toBe(null);
                treeObj.nodeTemplate = null;
                treeObj.dataBind();
                let mli: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-text-content');
                expect(mli[0].querySelector('i')).toBe(null);
                expect(mli[0].querySelector('b')).toBe(null);
                treeObj.nodeTemplate = '#template';
                treeObj.dataBind();
                let ali: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-text-content');
                expect(ali[0].querySelector('i')).not.toBe(null);
                expect(ali[0].querySelector('b')).toBe(null);
                treeObj.nodeTemplate = '${if(hasChild == undefined)}<b>${nodeText}</b>${else}<i>${nodeText}</i>${/if}';
                treeObj.dataBind();
                let bli: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-text-content');
                expect(bli[0].querySelector('i')).not.toBe(null);
                expect(bli[0].querySelector('b')).toBe(null);
                treeObj.cssClass = "mytree";
                treeObj.dataBind();
                expect(document.getElementById('tree1').classList.contains('mytree')).toEqual(true);
                treeObj.showCheckBox = true;
                treeObj.dataBind();
                expect(treeObj.element.querySelector('.e-checkbox-wrapper').classList.contains('e-css')).toBe(true);
                expect(document.getElementById('tree1').classList.contains('e-rtl')).toEqual(false);
                treeObj.enableRtl = true;
                treeObj.dataBind();
                expect(document.getElementById('tree1').classList.contains('e-rtl')).toEqual(true);
                treeObj.enableRtl = false;
                treeObj.dataBind();
                expect(document.getElementById('tree1').classList.contains('e-rtl')).toEqual(false);
                treeObj.selectedNodes= ['01'];
                let liElement: Element[] = treeObj.element.querySelectorAll('li');
                expect(liElement.length).toBe(2);
                expect(liElement[0].classList.contains('e-active')).toBe(true);
                expect(liElement[1].classList.contains('e-active')).toBe(false);
                done();
                treeObj.allowMultiSelection = true;
                treeObj.dataBind();
                treeObj.selectedNodes = ['01','02'];
                treeObj.dataBind();
                expect(liElement[0].classList.contains('e-active')).toBe(true);
                expect(liElement[1].classList.contains('e-active')).toBe(true);
                expect(treeObj.selectedNodes.length).toBe(2);
                treeObj.showCheckBox = true;
                treeObj.checkedNodes= ['01', '02'];
                treeObj.dataBind();
                expect(treeObj.checkedNodes.length).toBe(3);
                let sortList: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                treeObj.sortOrder = 'Ascending';
                treeObj.dataBind();
                expect(sortList[0].querySelector('.e-list-text').innerHTML).toBe('<i>Music</i>');
                treeObj.sortOrder = 'Descending';
                treeObj.dataBind();
                expect(sortList[0].querySelector('.e-list-text').innerHTML).toBe('<i>Music</i>');
                treeObj.selectedNodes = [];
                treeObj.dataBind();
                let sItems: any = JSON.parse(treeObj.getPersistData());
                expect(sItems.selectedNodes.length).toBe(0);
                treeObj.selectedNodes = ['01'];
                treeObj.dataBind();
                let seItems: any = JSON.parse(treeObj.getPersistData());
                expect(seItems.selectedNodes.length).toBe(1);
                expect(seItems.selectedNodes).toContain('01');
            });
            it('dataSource with null and empty', () => {
                expect(treeObj.element.querySelectorAll('li').length).toBe(2);
                treeObj.fields.dataSource = null;
                treeObj.dataBind();
                expect(treeObj.element.querySelectorAll('li').length).toBe(0);
                treeObj.fields.dataSource = [];
                treeObj.dataBind();
                expect(treeObj.element.querySelectorAll('li').length).toBe(0);
            });
        });
        describe('mouse events testing', () => {
            let mouseEventArgs: any;
            let tapEvent: any;
            let treeObj: any;
            let ele: HTMLElement = createElement('div', { id: 'tree1' });
            beforeEach((): void => {
                mouseEventArgs = {
                    preventDefault: (): void => {},
                    stopImmediatePropagation: (): void => {},
                    target: null,
                    type: null,
                    shiftKey: false,
                    ctrlKey: false,
                    originalEvent: { target: null }
                };
                tapEvent = {
                    originalEvent: mouseEventArgs,
                    tapCount: 1
                };
            });
            beforeAll(() => {
                document.body.appendChild(ele);
                treeObj = new TreeView({
                    fields: { dataSource: localData1, id: 'nodeId', text: 'nodeText', parentID: 'nodePid', hasChildren: 'hasChild' },
                    fullRowSelect: false,
                });
                treeObj.appendTo(ele);
            });
            afterAll(() => {
                if (treeObj)
                    treeObj.destroy();
                document.body.innerHTML = '';
            });
            it('mouse click on expand/collapse icon', (done: Function) => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                mouseEventArgs.target = li[3].querySelector('.e-icons');
                expect((li[3].querySelector('.e-icons') as Element).classList.contains('e-icon-expandable')).toBe(true);
                expect((li[3].querySelector('.e-icons') as Element).classList.contains('e-icon-collapsible')).toBe(false);
                expect(li[3].childElementCount).toBe(1);
                expect(treeObj.element.querySelectorAll('[aria-expanded="true"]').length).toBe(0);
                expect(treeObj.expandedNodes.length).toBe(0);
                treeObj.touchClickObj.tap(tapEvent);
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    expect((li[3].querySelector('.e-icons') as Element).classList.contains('e-icon-expandable')).toBe(false);
                    expect((li[3].querySelector('.e-icons') as Element).classList.contains('e-icon-collapsible')).toBe(true);
                    expect(li[3].childElementCount).toBe(2);
                    expect(li[3].getAttribute('aria-expanded')).toBe('true');
                    expect(treeObj.expandedNodes.length).toBe(1);
                    treeObj.touchClickObj.tap(tapEvent);
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function() {
                        expect((li[3].querySelector('.e-icons') as Element).classList.contains('e-icon-expandable')).toBe(true);
                        expect((li[3].querySelector('.e-icons') as Element).classList.contains('e-icon-collapsible')).toBe(false);
                        expect(li[3].getAttribute('aria-expanded')).toBe('false');
                        expect(treeObj.expandedNodes.length).toBe(0);
                        treeObj.touchClickObj.tap(tapEvent);
                        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                        setTimeout(function() {
                            expect((li[3].querySelector('.e-icons') as Element).classList.contains('e-icon-expandable')).toBe(false);
                            expect((li[3].querySelector('.e-icons') as Element).classList.contains('e-icon-collapsible')).toBe(true);
                            expect(li[3].getAttribute('aria-expanded')).toBe('true');
                            expect(treeObj.expandedNodes.length).toBe(1);
                            let newli: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                            mouseEventArgs.target = newli[4].querySelector('.e-icons');
                            expect((newli[4].querySelector('.e-icons') as Element).classList.contains('e-icon-expandable')).toBe(true);
                            expect((newli[4].querySelector('.e-icons') as Element).classList.contains('e-icon-collapsible')).toBe(false);
                            expect(newli[4].childElementCount).toBe(1);
                            treeObj.touchClickObj.tap(tapEvent);
                            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                            setTimeout(function() {
                                expect((newli[4].querySelector('.e-icons') as Element).classList.contains('e-icon-expandable')).toBe(false);
                                expect((newli[4].querySelector('.e-icons') as Element).classList.contains('e-icon-collapsible')).toBe(true);
                                expect(newli[4].childElementCount).toBe(2);
                                expect(li[3].getAttribute('aria-expanded')).toBe('true');
                                expect(newli[4].getAttribute('aria-expanded')).toBe('true');
                                expect(treeObj.expandedNodes.length).toBe(2);
                                treeObj.touchClickObj.tap(tapEvent);
                                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                                setTimeout(function() {
                                    expect((newli[4].querySelector('.e-icons') as Element).classList.contains('e-icon-expandable')).toBe(true);
                                    expect((newli[4].querySelector('.e-icons') as Element).classList.contains('e-icon-collapsible')).toBe(false);
                                    expect(newli[4].getAttribute('aria-expanded')).toBe('false');
                                    expect(treeObj.expandedNodes.length).toBe(1);
                                    done();
                                }, 450);
                            }, 450);
                        }, 450);
                    }, 450);
                }, 450);
            });
            it('mouse click on text', () => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                mouseEventArgs.target = li[1].querySelector('.e-text-content');
                expect((li[1] as Element).classList.contains('e-active')).toBe(false);
                expect(treeObj.element.querySelectorAll('[aria-selected]').length).toBe(0);
                treeObj.touchClickObj.tap(tapEvent);
                expect((li[1] as Element).classList.contains('e-active')).toBe(true);
                expect(treeObj.element.querySelectorAll('[aria-selected]').length).toBe(1);
                expect(li[1].getAttribute('aria-selected')).toBe('true');
                mouseEventArgs.target = li[0].querySelector('.e-text-content');
                expect((li[0] as Element).classList.contains('e-active')).toBe(false);            
                treeObj.touchClickObj.tap(tapEvent);
                expect((li[1] as Element).classList.contains('e-active')).toBe(false);
                expect((li[0] as Element).classList.contains('e-active')).toBe(true);
                expect(treeObj.element.querySelectorAll('[aria-selected]').length).toBe(1);
                expect(li[0].getAttribute('aria-selected')).toBe('true');
            });
            it('mouse click on ul', () => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                let ul: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('ul');
                mouseEventArgs.target = ul[0];
                expect((li[0] as Element).classList.contains('e-active')).toBe(true);
                treeObj.touchClickObj.tap(tapEvent);
                expect((li[0] as Element).classList.contains('e-active')).toBe(true);
                expect(treeObj.element.querySelectorAll('[aria-selected]').length).toBe(1);
                expect(li[0].getAttribute('aria-selected')).toBe('true');
                mouseEventArgs.target = ul[1];
                treeObj.touchClickObj.tap(tapEvent);
                expect((li[0] as Element).classList.contains('e-active')).toBe(true);
                expect((li[3] as Element).classList.contains('e-active')).toBe(false);
                expect(treeObj.element.querySelectorAll('[aria-selected]').length).toBe(1);
                expect(li[0].getAttribute('aria-selected')).toBe('true');
            });
            it('mouse double click on text', (done: Function) => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                mouseEventArgs.target = li[12].querySelector('.e-list-text');
                expect((li[12].querySelector('.e-icons') as Element).classList.contains('e-icon-expandable')).toBe(true);
                expect((li[12].querySelector('.e-icons') as Element).classList.contains('e-icon-collapsible')).toBe(false);
                expect(li[12].childElementCount).toBe(1);
                expect(treeObj.expandedNodes.length).toBe(1);
                tapEvent.tapCount = 2;
                treeObj.touchExpandObj.tap(tapEvent);
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    expect((li[12].querySelector('.e-icons') as Element).classList.contains('e-icon-expandable')).toBe(false);
                    expect((li[12].querySelector('.e-icons') as Element).classList.contains('e-icon-collapsible')).toBe(true);
                    expect(li[12].childElementCount).toBe(2);
                    expect(li[12].getAttribute('aria-expanded')).toBe('true');
                    expect(treeObj.expandedNodes.length).toBe(2);
                    treeObj.touchExpandObj.tap(tapEvent);
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function() {
                        expect((li[12].querySelector('.e-icons') as Element).classList.contains('e-icon-expandable')).toBe(true);
                        expect((li[12].querySelector('.e-icons') as Element).classList.contains('e-icon-collapsible')).toBe(false);
                        expect(li[12].getAttribute('aria-expanded')).toBe('false');
                        expect(treeObj.expandedNodes.length).toBe(1);
                        treeObj.touchExpandObj.tap(tapEvent);
                        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                        setTimeout(function() {
                            expect((li[12].querySelector('.e-icons') as Element).classList.contains('e-icon-expandable')).toBe(false);
                            expect((li[12].querySelector('.e-icons') as Element).classList.contains('e-icon-collapsible')).toBe(true);
                            expect(li[12].getAttribute('aria-expanded')).toBe('true');
                            expect(treeObj.expandedNodes.length).toBe(2);
                            let newli: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                            mouseEventArgs.target = newli[13].querySelector('.e-list-text');
                            expect(newli[13].querySelector('.e-icons')).toBe(null);
                            expect(newli[13].childElementCount).toBe(1);
                            treeObj.touchExpandObj.tap(tapEvent);
                            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                            setTimeout(function() {
                                expect(newli[13].querySelector('.e-icons')).toBe(null);
                                expect(newli[13].childElementCount).toBe(1);
                                expect(newli[13].getAttribute('aria-expanded')).toBe(null);
                                expect(treeObj.expandedNodes.length).toBe(2);
                                mouseEventArgs.target = newli[12].querySelector('.e-icons');
                                treeObj.touchExpandObj.tap(tapEvent);
                                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                                setTimeout(function() {
                                    expect((newli[12].querySelector('.e-icons') as Element).classList.contains('e-icon-expandable')).toBe(false);
                                    expect((newli[12].querySelector('.e-icons') as Element).classList.contains('e-icon-collapsible')).toBe(true);
                                    expect(newli[12].getAttribute('aria-expanded')).toBe('true');
                                    expect(treeObj.expandedNodes.length).toBe(2);
                                    done();
                                }, 450);
                            }, 450);
                        }, 450);
                    }, 450);
                }, 450);
            });
            it('mouse hover and mouse leave testing', () => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                mouseEventArgs.target = li[1].querySelector('.e-text-content');
                expect(li[0].classList.contains('e-hover')).toBe(false);
                expect(li[1].classList.contains('e-hover')).toBe(false);
                treeObj.onMouseOver(mouseEventArgs);
                expect(li[0].classList.contains('e-hover')).toBe(false);
                expect(li[1].classList.contains('e-hover')).toBe(true);
                let ul: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('ul');
                mouseEventArgs.target = ul[0];
                treeObj.onMouseOver(mouseEventArgs);
                expect(li[0].classList.contains('e-hover')).toBe(false);
                expect(li[1].classList.contains('e-hover')).toBe(false);
                mouseEventArgs.target = li[3].querySelector('.e-icons');
                expect(li[3].classList.contains('e-hover')).toBe(false);
                treeObj.onMouseOver(mouseEventArgs);
                expect(li[3].classList.contains('e-hover')).toBe(true);
                mouseEventArgs.target = treeObj.element;
                treeObj.onMouseOver(mouseEventArgs);
                expect(li[3].classList.contains('e-hover')).toBe(false);
                mouseEventArgs.target = li[1].querySelector('.e-text-content');
                treeObj.onMouseOver(mouseEventArgs);
                expect(li[1].classList.contains('e-hover')).toBe(true);
                treeObj.onMouseOver(mouseEventArgs);
                expect(li[1].classList.contains('e-hover')).toBe(true);
                treeObj.onMouseLeave(mouseEventArgs);
                expect(li[1].classList.contains('e-hover')).toBe(false);
            });
            it('mouse click on full row', () => {
                treeObj.fullRowSelect = true;
                treeObj.dataBind();
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                mouseEventArgs.originalEvent.target = li[1].querySelector('.e-fullrow');
                expect((li[1] as Element).classList.contains('e-active')).toBe(false);
                expect(treeObj.element.querySelectorAll('[aria-selected]').length).toBe(1);
                treeObj.clickHandler(mouseEventArgs);
                expect((li[1] as Element).classList.contains('e-active')).toBe(true);
                expect(treeObj.element.querySelectorAll('[aria-selected]').length).toBe(1);
                expect(li[1].getAttribute('aria-selected')).toBe('true');
                mouseEventArgs.originalEvent.target = li[0].querySelector('.e-fullrow');
                expect((li[0] as Element).classList.contains('e-active')).toBe(false);            
                treeObj.clickHandler(mouseEventArgs);
                expect((li[1] as Element).classList.contains('e-active')).toBe(false);
                expect((li[0] as Element).classList.contains('e-active')).toBe(true);
                expect(treeObj.element.querySelectorAll('[aria-selected]').length).toBe(1);
                expect(li[0].getAttribute('aria-selected')).toBe('true');
                treeObj.fullRowSelect = true;
                treeObj.dataBind();
            });
            it('mouse right click on full row', () => {
                treeObj.fullRowSelect = true;
                treeObj.dataBind();
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                mouseEventArgs.originalEvent.target = li[1].querySelector('.e-fullrow');
                expect((li[1] as Element).classList.contains('e-active')).toBe(false);
                expect((li[0] as Element).classList.contains('e-active')).toBe(true);
                expect(treeObj.element.querySelectorAll('[aria-selected]').length).toBe(1);
                mouseEventArgs.originalEvent.which = 3;
                treeObj.clickHandler(mouseEventArgs);
                expect((li[1] as Element).classList.contains('e-active')).toBe(false);
                expect((li[0] as Element).classList.contains('e-active')).toBe(true);
                expect(treeObj.element.querySelectorAll('[aria-selected]').length).toBe(1);
                expect(li[0].getAttribute('aria-selected')).toBe('true');
                expect(li[1].getAttribute('aria-selected')).toBe(null);
                mouseEventArgs.originalEvent.target = li[0].querySelector('.e-fullrow');       
                treeObj.clickHandler(mouseEventArgs);
                expect((li[1] as Element).classList.contains('e-active')).toBe(false);
                expect((li[0] as Element).classList.contains('e-active')).toBe(true);
                expect(treeObj.element.querySelectorAll('[aria-selected]').length).toBe(1);
                expect(li[0].getAttribute('aria-selected')).toBe('true');
                treeObj.fullRowSelect = false;
                treeObj.dataBind();
            });
        });
        describe('keyboard navigation testing', () => {
            let keyboardEventArgs: any = {
                preventDefault: (): void => {},
                action: null
            };
            let treeObj: any;
            let ele: HTMLElement = createElement('div', { id: 'tree1' });
            beforeAll(() => {
                document.body.appendChild(ele);
                treeObj = new TreeView({
                    fields: { dataSource: localData1, id: 'nodeId', text: 'nodeText', parentID: 'nodePid', hasChildren: 'hasChild' },
                    fullRowSelect: false,
                });
                treeObj.appendTo(ele);
            });
            afterAll(() => {
                if (treeObj)
                    treeObj.destroy();
                document.body.innerHTML = '';
            });
            it('tab key pressed', () => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                expect(li[0].classList.contains('e-hover')).toBe(false);
                expect(li[0].classList.contains('e-node-focus')).toBe(true);
                expect(li[1].classList.contains('e-node-focus')).toBe(false);
                keyboardEventArgs.action = 'tab';
                treeObj.focusIn();
                expect(li[0].classList.contains('e-hover')).toBe(true);
                expect(li[0].classList.contains('e-node-focus')).toBe(true);
                expect(li[1].classList.contains('e-node-focus')).toBe(false);
            });
            it('down arrow key pressed', () => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                expect(li[0].classList.contains('e-hover')).toBe(true);
                expect(li[1].classList.contains('e-hover')).toBe(false);
                expect(li[0].classList.contains('e-node-focus')).toBe(true);
                expect(li[1].classList.contains('e-node-focus')).toBe(false);
                keyboardEventArgs.action = 'moveDown';
                treeObj.keyActionHandler(keyboardEventArgs);
                expect(li[0].classList.contains('e-hover')).toBe(false);
                expect(li[1].classList.contains('e-hover')).toBe(true);
                expect(li[0].classList.contains('e-node-focus')).toBe(false);
                expect(li[1].classList.contains('e-node-focus')).toBe(true);
                treeObj.keyActionHandler(keyboardEventArgs);
                treeObj.keyActionHandler(keyboardEventArgs);
                treeObj.keyActionHandler(keyboardEventArgs);
                treeObj.keyActionHandler(keyboardEventArgs);
                expect(li[1].classList.contains('e-hover')).toBe(false);
                expect(li[4].classList.contains('e-hover')).toBe(true);
                expect(li[1].classList.contains('e-node-focus')).toBe(false);
                expect(li[4].classList.contains('e-node-focus')).toBe(true);
            });
            it('up arrow key pressed', () => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                expect(li[0].classList.contains('e-hover')).toBe(false);
                expect(li[4].classList.contains('e-hover')).toBe(true);
                expect(li[0].classList.contains('e-node-focus')).toBe(false);
                expect(li[4].classList.contains('e-node-focus')).toBe(true);
                keyboardEventArgs.action = 'moveUp';
                treeObj.keyActionHandler(keyboardEventArgs);
                expect(li[3].classList.contains('e-hover')).toBe(true);
                expect(li[4].classList.contains('e-hover')).toBe(false);
                expect(li[3].classList.contains('e-node-focus')).toBe(true);
                expect(li[4].classList.contains('e-node-focus')).toBe(false);
                treeObj.keyActionHandler(keyboardEventArgs);
                treeObj.keyActionHandler(keyboardEventArgs);
                treeObj.keyActionHandler(keyboardEventArgs);
                treeObj.keyActionHandler(keyboardEventArgs);
                expect(li[0].classList.contains('e-hover')).toBe(true);
                expect(li[1].classList.contains('e-hover')).toBe(false);
                expect(li[0].classList.contains('e-node-focus')).toBe(true);
                expect(li[1].classList.contains('e-node-focus')).toBe(false);
            });
            it('end key pressed', () => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                expect(li[0].classList.contains('e-hover')).toBe(true);
                expect(li[li.length-1].classList.contains('e-hover')).toBe(false);
                expect(li[0].classList.contains('e-node-focus')).toBe(true);
                expect(li[li.length-1].classList.contains('e-node-focus')).toBe(false);
                keyboardEventArgs.action = 'end';
                treeObj.keyActionHandler(keyboardEventArgs);
                expect(li[0].classList.contains('e-hover')).toBe(false);
                expect(li[li.length-1].classList.contains('e-hover')).toBe(true);
                expect(li[0].classList.contains('e-node-focus')).toBe(false);
                expect(li[li.length-1].classList.contains('e-node-focus')).toBe(true);
            });
            it('home key pressed', () => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                expect(li[0].classList.contains('e-hover')).toBe(false);
                expect(li[li.length-1].classList.contains('e-hover')).toBe(true);
                expect(li[0].classList.contains('e-node-focus')).toBe(false);
                expect(li[li.length-1].classList.contains('e-node-focus')).toBe(true);
                keyboardEventArgs.action = 'home';
                treeObj.keyActionHandler(keyboardEventArgs);
                expect(li[0].classList.contains('e-hover')).toBe(true);
                expect(li[li.length-1].classList.contains('e-hover')).toBe(false);
                expect(li[0].classList.contains('e-node-focus')).toBe(true);
                expect(li[li.length-1].classList.contains('e-node-focus')).toBe(false);
            });
            it('enter key pressed', () => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                expect(li[0].classList.contains('e-hover')).toBe(true);
                expect(li[0].classList.contains('e-node-focus')).toBe(true);
                expect(li[0].classList.contains('e-active')).toBe(false);
                keyboardEventArgs.action = 'enter';
                treeObj.keyActionHandler(keyboardEventArgs);
                expect(li[0].classList.contains('e-hover')).toBe(true);
                expect(li[0].classList.contains('e-node-focus')).toBe(true);
                expect(li[0].classList.contains('e-active')).toBe(true);
            });
            it('right arrow key pressed', (done: Function) => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                expect(li[0].classList.contains('e-hover')).toBe(true);
                expect(li[0].classList.contains('e-node-focus')).toBe(true);
                expect(li[1].classList.contains('e-node-focus')).toBe(false);
                expect((li[0].querySelector('.e-icons') as Element).classList.contains('e-icon-expandable')).toBe(true);
                expect(li[0].childElementCount).toBe(1);
                expect(treeObj.expandedNodes.length).toBe(0);
                keyboardEventArgs.action = 'moveRight';
                treeObj.keyActionHandler(keyboardEventArgs);
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    expect(li[0].classList.contains('e-hover')).toBe(true);
                    expect(li[0].classList.contains('e-node-focus')).toBe(true);
                    expect(li[1].classList.contains('e-node-focus')).toBe(false);
                    expect((li[0].querySelector('.e-icons') as Element).classList.contains('e-icon-expandable')).toBe(false);
                    expect((li[0].querySelector('.e-icons') as Element).classList.contains('e-icon-collapsible')).toBe(true);
                    expect(li[0].childElementCount).toBe(2);
                    expect(treeObj.expandedNodes.length).toBe(1);
                    let newli: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                    keyboardEventArgs.action = 'moveRight';
                    treeObj.keyActionHandler(keyboardEventArgs);
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function() {
                        expect(newli[0].classList.contains('e-hover')).toBe(false);
                        expect(newli[1].classList.contains('e-hover')).toBe(true);
                        expect(newli[0].classList.contains('e-node-focus')).toBe(false);
                        expect(newli[1].classList.contains('e-node-focus')).toBe(true);
                        expect(newli[1].childElementCount).toBe(1);
                        keyboardEventArgs.action = 'moveRight';
                        treeObj.keyActionHandler(keyboardEventArgs);
                        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                        setTimeout(function() {
                            expect(newli[0].classList.contains('e-hover')).toBe(false);
                            expect(newli[1].classList.contains('e-hover')).toBe(true);
                            expect(newli[2].classList.contains('e-hover')).toBe(false);
                            expect(newli[0].classList.contains('e-node-focus')).toBe(false);
                            expect(newli[1].classList.contains('e-node-focus')).toBe(true);
                            expect(newli[2].classList.contains('e-node-focus')).toBe(false);
                            expect(newli[1].childElementCount).toBe(1);
                            done();
                        }, 450);
                    }, 450);
                }, 450);
            });
            it('left arrow key pressed', (done: Function) => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                keyboardEventArgs.action = 'moveLeft';
                treeObj.keyActionHandler(keyboardEventArgs);
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    expect(li[0].classList.contains('e-hover')).toBe(true);
                    expect(li[1].classList.contains('e-hover')).toBe(false);
                    expect(li[0].classList.contains('e-node-focus')).toBe(true);
                    expect(li[1].classList.contains('e-node-focus')).toBe(false);
                    expect((li[0].querySelector('.e-icons') as Element).classList.contains('e-icon-expandable')).toBe(false);
                    expect((li[0].querySelector('.e-icons') as Element).classList.contains('e-icon-collapsible')).toBe(true);
                    expect(li[0].childElementCount).toBe(2);
                    expect(treeObj.expandedNodes.length).toBe(1);
                    keyboardEventArgs.action = 'moveLeft';
                    treeObj.keyActionHandler(keyboardEventArgs);
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function() {
                        expect(li[0].classList.contains('e-hover')).toBe(true);
                        expect(li[1].classList.contains('e-hover')).toBe(false);
                        expect(li[0].classList.contains('e-node-focus')).toBe(true);
                        expect(li[1].classList.contains('e-node-focus')).toBe(false);
                        expect((li[0].querySelector('.e-icons') as Element).classList.contains('e-icon-expandable')).toBe(true);
                        expect((li[0].querySelector('.e-icons') as Element).classList.contains('e-icon-collapsible')).toBe(false);
                        expect(li[0].childElementCount).toBe(2);
                        expect(treeObj.expandedNodes.length).toBe(0);
                        keyboardEventArgs.action = 'moveLeft';
                        treeObj.keyActionHandler(keyboardEventArgs);
                        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                        setTimeout(function() {
                            expect(li[0].classList.contains('e-hover')).toBe(true);
                            expect(li[1].classList.contains('e-hover')).toBe(false);
                            expect(li[0].classList.contains('e-node-focus')).toBe(true);
                            expect(li[1].classList.contains('e-node-focus')).toBe(false);
                            expect(li[0].childElementCount).toBe(2);
                            expect(treeObj.expandedNodes.length).toBe(0);
                            done();
                        }, 450);
                    }, 450);
                }, 450);
            });
            it('f2 key pressed', () => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                expect(li[0].querySelector('.e-list-text').childElementCount).toBe(0);
                expect(li[0].querySelector('.e-input')).toBe(null);
                keyboardEventArgs.action = 'f2';
                treeObj.keyActionHandler(keyboardEventArgs);
                expect(li[0].querySelector('.e-list-text').childElementCount).toBe(0);
                expect(li[0].querySelector('.e-input')).toBe(null);
                treeObj.allowEditing = true;
                treeObj.dataBind();
                treeObj.keyActionHandler(keyboardEventArgs);
                expect(li[0].querySelector('.e-list-text').childElementCount).toBe(1);
                expect(li[0].querySelector('.e-input')).not.toBe(null);
                expect(li[0].querySelector('.e-input').nodeName).toBe('INPUT');
                expect((li[0].querySelector('.e-input') as HTMLInputElement).value).toBe('Music');
                (li[0].querySelector('.e-input') as HTMLInputElement).value = 'Music node';
                keyboardEventArgs.action = 'enter';
                keyboardEventArgs.target = li[0].querySelector('.e-input');
                treeObj.keyActionHandler(keyboardEventArgs);
                expect(li[0].querySelector('.e-list-text').childElementCount).toBe(0);
                expect(li[0].querySelector('.e-input')).toBe(null);
                expect((li[0].querySelector('.e-list-text') as HTMLElement).childNodes[0].nodeValue).toBe('Music node');
                keyboardEventArgs.action = 'f2';
                keyboardEventArgs.target = null;
                treeObj.keyActionHandler(keyboardEventArgs);
                expect(li[0].querySelector('.e-list-text').childElementCount).toBe(1);
                expect(li[0].querySelector('.e-input')).not.toBe(null);
                expect(li[0].querySelector('.e-input').nodeName).toBe('INPUT');
                expect((li[0].querySelector('.e-input') as HTMLInputElement).value).toBe('Music node');
                (li[0].querySelector('.e-input') as HTMLInputElement).value = 'Music value';
                keyboardEventArgs.action = 'escape';
                keyboardEventArgs.target = li[0].querySelector('.e-input');
                treeObj.keyActionHandler(keyboardEventArgs);
                expect(li[0].querySelector('.e-list-text').childElementCount).toBe(0);
                expect(li[0].querySelector('.e-input')).toBe(null);
                expect((li[0].querySelector('.e-list-text') as HTMLElement).childNodes[0].nodeValue).toBe('Music node');
                keyboardEventArgs.action = 'f2';
                keyboardEventArgs.target = null;
                treeObj.keyActionHandler(keyboardEventArgs);
                expect(li[0].querySelector('.e-list-text').childElementCount).toBe(1);
                expect(li[0].querySelector('.e-input')).not.toBe(null);
                expect(li[0].querySelector('.e-input').nodeName).toBe('INPUT');
                expect((li[0].querySelector('.e-input') as HTMLInputElement).value).toBe('Music node');
                (li[0].querySelector('.e-input') as HTMLInputElement).value = 'Music';
                keyboardEventArgs.action = 'tab';
                keyboardEventArgs.target = li[0].querySelector('.e-input');
                treeObj.keyActionHandler(keyboardEventArgs);
                (li[0].querySelector('.e-input') as HTMLInputElement).blur();
                expect(li[0].querySelector('.e-list-text').childElementCount).toBe(0);
                expect(li[0].querySelector('.e-input')).toBe(null);
                expect((li[0].querySelector('.e-list-text') as HTMLElement).childNodes[0].nodeValue).toBe('Music');
                treeObj.allowEditing = false;
                treeObj.dataBind();
            });
            it('focus out testing', () => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                treeObj.focusOut();
                expect(li[0].classList.contains('e-hover')).toBe(false);
                expect(li[0].classList.contains('e-node-focus')).toBe(true);
            });
            it('CtrlA testing', () => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                keyboardEventArgs.action = 'ctrlA';
                keyboardEventArgs.target = li[1].querySelector('.e-list-text');
                treeObj.keyActionHandler(keyboardEventArgs);
                expect(li[1].classList.contains('e-active')).toBe(false);
                treeObj.allowMultiSelection = true;
                treeObj.dataBind();
                keyboardEventArgs.action = 'ctrlA';
                keyboardEventArgs.target = li[1].querySelector('.e-list-text');
                treeObj.keyActionHandler(keyboardEventArgs);
                expect(li[1].classList.contains('e-active')).toBe(true);
            });
        });
        describe('events testing', () => {
            let mouseEventArgs: any;
            let tapEvent: any;
            let keyboardEventArgs: any = {
                preventDefault: (): void => {},
                action: null
            };
            let treeObj: any;
            let i: number = 0, j: number = 0;
            let originalTimeout: any;
            function clickFn(): void {
                i++;
            }
            function dsChangeFn(): void {
                j++;
            }
            function expandIconFn(args: NodeExpandEventArgs): void{
                if (!args.node.querySelector('ul') && args.isInteracted) {
                    if (args.nodeData['id'] == '01') {
                        treeObj.addNodes(expandIconChildData, args.nodeData['id'], null);
                    }
                }              
            }
            beforeEach((): void => {
                mouseEventArgs = {
                    preventDefault: (): void => {},
                    stopImmediatePropagation: (): void => {},
                    target: null,
                    type: null,
                    shiftKey: false,
                    ctrlKey: false
                };
                tapEvent = {
                    originalEvent: mouseEventArgs,
                    tapCount: 1
                };
                treeObj = undefined;
                i = 0, j = 0;
                let ele: HTMLElement = createElement('div', { id: 'tree1' });
                document.body.appendChild(ele);
                originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            });
            afterEach((): void => {
                if (treeObj)
                    treeObj.destroy();
                document.body.innerHTML = '';
                jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            });
            it('created event is triggered', () => {
                treeObj = new TreeView({
                    fields: { dataSource: localData1, id: 'nodeId', text: 'nodeText', parentID: 'nodePid', hasChildren: 'hasChild' },
                    created: clickFn
                },'#tree1');
                expect(i).toEqual(1);
            });
            it('drawNode event is triggered', () => {
                treeObj = new TreeView({
                    fields: { dataSource: localData1, id: 'nodeId', text: 'nodeText', parentID: 'nodePid', hasChildren: 'hasChild' },
                    drawNode: clickFn
                },'#tree1');
                expect(i).toEqual(5);
            });
            it('dataBound event is triggered', () => {
                treeObj = new TreeView({
                    fields: { dataSource: localData1, id: 'nodeId', text: 'nodeText', parentID: 'nodePid', hasChildren: 'hasChild' },
                    dataBound: clickFn
                },'#tree1');
                expect(i).toEqual(1);
            });
            it('nodeExpanding event is triggered', () => {
                treeObj = new TreeView({
                    fields: { dataSource: localData1, id: 'nodeId', text: 'nodeText', parentID: 'nodePid', hasChildren: 'hasChild' },
                    nodeExpanding: clickFn
                },'#tree1');
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                mouseEventArgs.target = li[0].querySelector('.e-icons');
                treeObj.touchClickObj.tap(tapEvent);
                expect(i).toEqual(1);
            });
            it('nodeExpanded event is triggered', (done: Function) => {
                treeObj = new TreeView({
                    fields: { dataSource: localData1, id: 'nodeId', text: 'nodeText', parentID: 'nodePid', hasChildren: 'hasChild' },
                    nodeExpanded: clickFn,
                    animation: { expand: { duration: 0 }, collapse: { duration: 0 } },
                },'#tree1');
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                mouseEventArgs.target = li[0].querySelector('.e-icons');
                treeObj.touchClickObj.tap(tapEvent);
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    expect(treeObj.expandedNodes.length).toBe(1);
                    expect(i).toEqual(1);
                    done();
                }, 100);
            });
            it('nodeCollapsing event is triggered', (done: Function) => {
                treeObj = new TreeView({
                    fields: { dataSource: localData1, id: 'nodeId', text: 'nodeText', parentID: 'nodePid', hasChildren: 'hasChild' },
                    nodeCollapsing: clickFn
                },'#tree1');
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                mouseEventArgs.target = li[0].querySelector('.e-icons');
                treeObj.touchClickObj.tap(tapEvent);
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    treeObj.touchClickObj.tap(tapEvent);
                    expect(i).toEqual(1);
                    done();
                }, 450);                
            });
            it('nodeCollapsed event is triggered', (done: Function) => {
                treeObj = new TreeView({
                    fields: { dataSource: localData1, id: 'nodeId', text: 'nodeText', parentID: 'nodePid', hasChildren: 'hasChild' },
                    nodeCollapsed: clickFn,
                    animation: { expand: { duration: 0 }, collapse: { duration: 0 } },
                },'#tree1');
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                mouseEventArgs.target = li[0].querySelector('.e-icons');
                treeObj.touchClickObj.tap(tapEvent);
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    expect(treeObj.expandedNodes.length).toBe(1);
                    treeObj.touchClickObj.tap(tapEvent);
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function() {
                        expect(treeObj.expandedNodes.length).toBe(0);
                        expect(i).toEqual(1);
                        done();
                    }, 100);
                }, 100);
            });
            it('nodeSelecting event is triggered', () => {
                treeObj = new TreeView({
                    fields: { dataSource: localData3, id: 'nodeId', text: 'nodeText', parentID: 'nodePid', hasChildren: 'hasChild' },
                    nodeSelecting: clickFn,
                },'#tree1');
                expect(i).toEqual(0);
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                mouseEventArgs.target = li[0].querySelector('.e-list-text');
                treeObj.touchClickObj.tap(tapEvent);
                expect(i).toEqual(1);
                i = 0;
                expect(li[0].classList.contains('e-active')).toBe(true);
                mouseEventArgs.target = li[7].querySelector('.e-list-text');
                treeObj.touchClickObj.tap(tapEvent);
                expect(i).toEqual(1);
                expect(li[7].classList.contains('e-active')).toBe(true);
                treeObj.allowMultiSelection = true;
                treeObj.dataBind();
                mouseEventArgs.ctrlKey = true;
                mouseEventArgs.target = li[7].querySelector('.e-list-text');
                treeObj.touchClickObj.tap(tapEvent);
                expect(i).toEqual(2);
                expect(li[7].classList.contains('e-active')).toBe(false);
            });
            it('nodeSelected event is triggered', () => {
                treeObj = new TreeView({
                    fields: { dataSource: localData1, id: 'nodeId', text: 'nodeText', parentID: 'nodePid', hasChildren: 'hasChild' },
                    nodeSelected: clickFn,
                },'#tree1');
                expect(i).toEqual(0);
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                mouseEventArgs.target = li[0].querySelector('.e-list-text');
                treeObj.touchClickObj.tap(tapEvent);
                expect(i).toEqual(1);
                expect(li[0].classList.contains('e-active')).toBe(true);
                i = 0;
                mouseEventArgs.target = li[4].querySelector('.e-list-text');
                treeObj.touchClickObj.tap(tapEvent);
                expect(i).toEqual(1);
                expect(li[4].classList.contains('e-active')).toBe(true);
                treeObj.allowMultiSelection = true;
                treeObj.dataBind();
                mouseEventArgs.ctrlKey = true;
                mouseEventArgs.target = li[4].querySelector('.e-list-text');
                treeObj.touchClickObj.tap(tapEvent);
                expect(i).toEqual(2);
                expect(li[4].classList.contains('e-active')).toBe(false);
            });
            it('nodeEditing event is triggered', () => {
                treeObj = new TreeView({
                    fields: { dataSource: localData1, id: 'nodeId', text: 'nodeText', parentID: 'nodePid', hasChildren: 'hasChild' },
                    nodeEditing: clickFn,
                    allowEditing: true,
                    fullRowSelect: false,
                },'#tree1');
                expect(i).toEqual(0);
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                mouseEventArgs.target = li[0].querySelector('.e-list-text');
                tapEvent.tapCount = 2;
                expect(li[0].querySelector('.e-icons').classList.contains('e-icon-expandable')).toBe(true);
                expect(li[0].querySelector('.e-icons').classList.contains('e-icon-collapsible')).toBe(false);
                expect(li[0].childElementCount).toBe(1);
                expect(li[0].querySelector('.e-list-text').childElementCount).toBe(0);
                treeObj.touchEditObj.tap(tapEvent);
                expect(li[0].querySelector('.e-icons').classList.contains('e-icon-expandable')).toBe(true);
                expect(li[0].querySelector('.e-icons').classList.contains('e-icon-collapsible')).toBe(false);
                expect(li[0].childElementCount).toBe(1);
                expect(li[0].querySelector('.e-list-text').childElementCount).toBe(1);
                expect(li[0].querySelector('.e-input').nodeName).toBe('INPUT');
                expect((li[0].querySelector('.e-input') as HTMLInputElement).value).toBe('Music');
                (li[0].querySelector('.e-input') as HTMLInputElement).value = 'Music node';
                (li[0].querySelector('.e-input') as HTMLInputElement).blur();
                expect(li[0].querySelector('.e-list-text').childElementCount).toBe(0);
                expect((li[0].querySelector('.e-list-text') as HTMLElement).childNodes[0].nodeValue).toBe('Music node');
                expect(i).toEqual(1);
                treeObj.touchEditObj.tap(tapEvent);
                expect((li[0].querySelector('.e-input') as HTMLInputElement).value).toBe('Music node');
                (li[0].querySelector('.e-input') as HTMLInputElement).value = 'Music';
                (li[0].querySelector('.e-input') as HTMLInputElement).blur();
                expect(li[0].querySelector('.e-list-text').childElementCount).toBe(0);
                expect((li[0].querySelector('.e-list-text') as HTMLElement).childNodes[0].nodeValue).toBe('Music');
            });
            it('nodeEdited event is triggered', () => {
                treeObj = new TreeView({
                    fields: { dataSource: localData1, id: 'nodeId', text: 'nodeText', parentID: 'nodePid', hasChildren: 'hasChild' },
                    nodeEdited: clickFn,
                    dataSourceChanged: dsChangeFn,
                    allowEditing: true,
                    fullRowSelect: false,
                },'#tree1');
                expect(i).toEqual(0);
                expect(j).toEqual(0);
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                mouseEventArgs.target = li[0].querySelector('.e-list-text');
                tapEvent.tapCount = 2;
                expect(li[0].querySelector('.e-icons').classList.contains('e-icon-expandable')).toBe(true);
                expect(li[0].querySelector('.e-icons').classList.contains('e-icon-collapsible')).toBe(false);
                expect(li[0].childElementCount).toBe(1);
                expect(li[0].querySelector('.e-list-text').childElementCount).toBe(0);
                treeObj.touchEditObj.tap(tapEvent);
                expect(li[0].querySelector('.e-icons').classList.contains('e-icon-expandable')).toBe(true);
                expect(li[0].querySelector('.e-icons').classList.contains('e-icon-collapsible')).toBe(false);
                expect(li[0].childElementCount).toBe(1);
                expect(li[0].querySelector('.e-list-text').childElementCount).toBe(1);
                expect(li[0].querySelector('.e-input').nodeName).toBe('INPUT');
                expect((li[0].querySelector('.e-input') as HTMLInputElement).value).toBe('Music');
                (li[0].querySelector('.e-input') as HTMLInputElement).value = 'Music node';
                (li[0].querySelector('.e-input') as HTMLInputElement).blur();
                expect(li[0].querySelector('.e-list-text').childElementCount).toBe(0);
                expect((li[0].querySelector('.e-list-text') as HTMLElement).childNodes[0].nodeValue).toBe('Music node');
                expect(i).toEqual(1);
                expect(j).toEqual(1);
                treeObj.touchEditObj.tap(tapEvent);
                expect((li[0].querySelector('.e-input') as HTMLInputElement).value).toBe('Music node');
                (li[0].querySelector('.e-input') as HTMLInputElement).value = 'Music';
                (li[0].querySelector('.e-input') as HTMLInputElement).blur();
                expect(li[0].querySelector('.e-list-text').childElementCount).toBe(0);
                expect((li[0].querySelector('.e-list-text') as HTMLElement).childNodes[0].nodeValue).toBe('Music');
            });
            it('nodeClicked event is triggered', () => {
                treeObj = new TreeView({
                    fields: { dataSource: localData1, id: 'nodeId', text: 'nodeText', parentID: 'nodePid', hasChildren: 'hasChild' },
                    nodeClicked: clickFn,
                },'#tree1');
                expect(i).toEqual(0);
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                mouseEventArgs.target = li[0].querySelector('.e-list-text');
                treeObj.touchClickObj.tap(tapEvent);
                expect(i).toEqual(1);
                expect(li[0].classList.contains('e-active')).toBe(true);
            });
            it('keyPress event is triggered', () => {
                treeObj = new TreeView({
                    fields: { dataSource: localData1, id: 'nodeId', text: 'nodeText', parentID: 'nodePid', hasChildren: 'hasChild' },
                    keyPress: clickFn,
                },'#tree1');
                expect(i).toEqual(0);
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                keyboardEventArgs.action = 'tab';
                treeObj.focusIn();
                expect(li[0].classList.contains('e-hover')).toBe(true);
                keyboardEventArgs.action = 'moveDown';
                treeObj.keyActionHandler(keyboardEventArgs);
                expect(i).toEqual(1);
                expect(li[0].classList.contains('e-hover')).toBe(false);
                expect(li[1].classList.contains('e-hover')).toBe(true);
            });
            it('darg and drop events are triggered', () => {
                treeObj = new TreeView({
                    fields: { dataSource: localData1, id: 'nodeId', text: 'nodeText', parentID: 'nodePid', hasChildren: 'hasChild' },
                    nodeDragStart: clickFn,
                    nodeDragging: clickFn,
                    nodeDragStop: clickFn,
                    nodeDropped: clickFn,
                    dataSourceChanged: dsChangeFn,
                    allowDragAndDrop: true,
                },'#tree1');
                expect(i).toEqual(0);
                expect(j).toEqual(0);
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                let mousedown: any = getEventObject('MouseEvents', 'mousedown', treeObj.element, li[2].querySelector('.e-list-text'), 15, 10);
                EventHandler.trigger(treeObj.element, 'mousedown', mousedown);                
                let mousemove: any = getEventObject('MouseEvents', 'mousemove', treeObj.element, li[2].querySelector('.e-list-text'), 15, 70);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                expect(i).toEqual(1);
                mousemove.srcElement = mousemove.target = mousemove.toElement = li[1].querySelector('.e-list-text');
                mousemove = setMouseCordinates(mousemove, 15, 75);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                expect(i).toEqual(2);
                i = 0;
                let mouseup: any = getEventObject('MouseEvents', 'mouseup', treeObj.element, li[1].querySelector('.e-list-text'));
                mouseup.type = 'mouseup';
                EventHandler.trigger(<any>(document), 'mouseup', mouseup);
                expect(i).toEqual(2);
                expect(j).toEqual(1);
                expect(li[1].childElementCount).toBe(3);
                expect(li[1].children[2].childElementCount).toBe(3);
            });
            it('nodeDragStop event is cancelled', () => {
                treeObj = new TreeView({
                    fields: { dataSource: localData1, id: 'nodeId', text: 'nodeText', parentID: 'nodePid', hasChildren: 'hasChild' },
                    nodeDragStop: (args: DragAndDropEventArgs) => {
                        j++;
                        if (args.droppedNodeData['text'] == "Videos") {
                            args.cancel = true;
                        }
                    },
                    allowDragAndDrop: true,
                },'#tree1');
               
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                let mousedown: any = getEventObject('MouseEvents', 'mousedown', treeObj.element, li[2].querySelector('.e-list-text'), 15, 10);
                EventHandler.trigger(treeObj.element, 'mousedown', mousedown);                
                let mousemove: any = getEventObject('MouseEvents', 'mousemove', treeObj.element, li[2].querySelector('.e-list-text'), 15, 70);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                mousemove.srcElement = mousemove.target = mousemove.toElement = li[1].querySelector('.e-list-text');
                mousemove = setMouseCordinates(mousemove, 15, 75);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                let mouseup: any = getEventObject('MouseEvents', 'mouseup', treeObj.element, li[1].querySelector('.e-list-text'));
                mouseup.type = 'mouseup';
                EventHandler.trigger(<any>(document), 'mouseup', mouseup);
            });
            it('drag and drop with multiple nodes', () => {
                treeObj = new TreeView({
                    fields: { dataSource: localData1, id: 'nodeId', text: 'nodeText', parentID: 'nodePid', hasChildren: 'hasChild' },
                    allowDragAndDrop: true,
                    allowMultiSelection: true,
                },'#tree1');
               
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                treeObj.selectedNodes = ['02', '03'];
                treeObj.dataBind();
                let mousedown: any = getEventObject('MouseEvents', 'mousedown', treeObj.element, li[2].querySelector('.e-list-text'), 15, 10);
                EventHandler.trigger(treeObj.element, 'mousedown', mousedown);                
                let mousemove: any = getEventObject('MouseEvents', 'mousemove', treeObj.element, li[2].querySelector('.e-list-text'), 15, 70);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                mousemove.srcElement = mousemove.target = mousemove.toElement = li[1].querySelector('.e-list-text');
                mousemove = setMouseCordinates(mousemove, 15, 75);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                let mouseup: any = getEventObject('MouseEvents', 'mouseup', treeObj.element, li[1].querySelector('.e-list-text'));
                mouseup.type = 'mouseup';
                EventHandler.trigger(<any>(document), 'mouseup', mouseup);
            });
            it('destroyed event is triggered', () => {
                treeObj = new TreeView({
                    fields: { dataSource: localData1, id: 'nodeId', text: 'nodeText', parentID: 'nodePid', hasChildren: 'hasChild' },
                    destroyed: clickFn
                },'#tree1');
                treeObj.destroy();
                expect(i).toEqual(1);
            });
        });
        describe('methods testing', () => {
            let mouseEventArgs: any;
            let tapEvent: any;
            let treeObj: any;
            let j: number = 0;
            function dsChangeFn(): void {
                j++;
            }
            beforeEach(() => {
                mouseEventArgs = {
                    preventDefault: (): void => {},
                    stopImmediatePropagation: (): void => {},
                    target: null,
                    type: null,
                    shiftKey: false,
                    ctrlKey: false
                };
                tapEvent = {
                    originalEvent: mouseEventArgs,
                    tapCount: 1
                };
                j = 0;
                let ele: HTMLElement = createElement('div', { id: 'tree1' });
                document.body.appendChild(ele);
                treeObj = new TreeView({ fields: { dataSource: localData3, id: 'nodeId', text: 'nodeText', parentID: 'nodePid', hasChildren: 'hasChild' }, dataSourceChanged: dsChangeFn });
                treeObj.appendTo(ele);
            });
            afterEach(() => {
                if (treeObj)
                    treeObj.destroy();
                document.body.innerHTML = '';
            });
            it('get module name', () => {
                expect(treeObj.getModuleName()).toBe('treeview');
            });
            it('persistence testing', (done: Function) => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                let sItems: any = JSON.parse(treeObj.getPersistData());
                expect(sItems.selectedNodes.length).toBe(0);
                expect(sItems.expandedNodes.length).toBe(0);
                mouseEventArgs.target = li[0].querySelector('.e-list-text');
                treeObj.touchClickObj.tap(tapEvent);
                mouseEventArgs.target = li[0].querySelector('.e-icons');
                treeObj.touchClickObj.tap(tapEvent);
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    let seItems: any = JSON.parse(treeObj.getPersistData());
                    expect(seItems.selectedNodes.length).toBe(1);
                    expect(seItems.selectedNodes).toContain('01');
                    expect(seItems.expandedNodes.length).toBe(1);
                    expect(seItems.expandedNodes).toContain('01');
                    done();
                }, 450);
            });
            it('updateNode', () => {
                expect(j).toEqual(0);
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                expect((li[0].querySelector('.e-list-text') as HTMLElement).childNodes[0].nodeValue).toBe('Music');
                treeObj.updateNode(li[0], 'Rain');
                expect((li[0].querySelector('.e-list-text') as HTMLElement).childNodes[0].nodeValue).toBe('Music');
                expect(j).toEqual(0);
                treeObj.allowEditing = true;
                treeObj.dataBind();
                treeObj.updateNode(li[0], 'Rain');
                expect((li[0].querySelector('.e-list-text') as HTMLElement).childNodes[0].nodeValue).toBe('Rain');
                expect(j).toEqual(1);
                treeObj.updateNode('01', 'Music');
                expect((li[0].querySelector('.e-list-text') as HTMLElement).childNodes[0].nodeValue).toBe('Music');
                expect(j).toEqual(2);
                treeObj.updateNode('011', 'Music');
                expect((li[0].querySelector('.e-list-text') as HTMLElement).childNodes[0].nodeValue).toBe('Music');
                expect(j).toEqual(2);
                treeObj.updateNode('01', null);
                expect((li[0].querySelector('.e-list-text') as HTMLElement).childNodes[0].nodeValue).toBe('Music');
                expect(j).toEqual(2);
                treeObj.updateNode(null, null);
                expect((li[0].querySelector('.e-list-text') as HTMLElement).childNodes[0].nodeValue).toBe('Music');
                expect(j).toEqual(2);
                treeObj.allowEditing = false;
                treeObj.dataBind();
            });
            it('expandAll', (done: Function) => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                expect(li[0].childElementCount).toBe(2);
                treeObj.expandAll();
                let newli: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                expect(newli[0].childElementCount).toBe(3);
                expect(newli[0].children[2].childElementCount).toBe(1);
                expect(newli[11].childElementCount).toBe(3);
                expect(newli[11].children[2].childElementCount).toBe(5);
                expect(newli[12].childElementCount).toBe(3);
                expect(newli[12].children[2].childElementCount).toBe(2);
                expect(newli[14].childElementCount).toBe(3);
                expect(newli[14].children[2].childElementCount).toBe(1);
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    expect(li[0].getAttribute('aria-expanded')).toBe('true');
                    expect(treeObj.expandedNodes.length).toBe(7);
                    done();
                }, 450);
            });
            it('expandAll with specific nodes', () => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                expect(li[0].childElementCount).toBe(2);
                treeObj.expandAll(['01', li[1], '03', '099', '07']);
                expect(li[0].childElementCount).toBe(3);
                expect(li[0].children[2].childElementCount).toBe(1);
                expect(li[1].childElementCount).toBe(3);
                expect(li[1].children[2].childElementCount).toBe(2);
                expect(li[2].childElementCount).toBe(3);
                expect(li[2].children[2].childElementCount).toBe(5);
                treeObj.expandAll('04');
                expect(li[4].childElementCount).toBe(2);
                treeObj.expandAll(null);
                expect(li[4].childElementCount).toBe(3);
            });
            it('expandAll with level', () => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                expect(li[0].childElementCount).toBe(2);
                treeObj.expandAll(null, 1);
                let newli: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                expect(newli[0].childElementCount).toBe(3);
                expect(newli[0].children[2].childElementCount).toBe(1);
                expect(newli[11].childElementCount).toBe(3);
                expect(newli[11].children[2].childElementCount).toBe(5);
                expect(newli[12].childElementCount).toBe(2);
                treeObj.expandAll(null, 3);
                let nli: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                expect(nli[0].childElementCount).toBe(3);
                expect(nli[0].children[2].childElementCount).toBe(1);
                expect(nli[11].childElementCount).toBe(3);
                expect(nli[11].children[2].childElementCount).toBe(5);
                expect(nli[12].childElementCount).toBe(3);
                expect(nli[12].children[2].childElementCount).toBe(2);
                expect(nli[14].childElementCount).toBe(3);
                expect(nli[14].children[2].childElementCount).toBe(1);
            });
            it('expandAll with excludeHiddenNodes', (done: Function) => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                expect(li[0].childElementCount).toBe(2);                
                treeObj.expandAll(null, 1, true);
                let newli: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                expect(newli[0].childElementCount).toBe(3);
                expect(newli[0].children[2].childElementCount).toBe(1);
                expect(newli[11].childElementCount).toBe(3);
                expect(newli[11].children[2].childElementCount).toBe(5);
                expect(newli[12].childElementCount).toBe(2);
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    mouseEventArgs.target = newli[11].querySelector('.e-icons');
                    treeObj.touchClickObj.tap(tapEvent);
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function() {
                        treeObj.expandAll(null, 2, true);
                        expect(newli[12].childElementCount).toBe(2);
                        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                        setTimeout(function() {
                            mouseEventArgs.target = newli[11].querySelector('.e-icons');
                            treeObj.touchClickObj.tap(tapEvent);
                            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                            setTimeout(function() {
                                treeObj.expandAll(null, 0, true);
                                expect(newli[12].childElementCount).toBe(2);
                                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                                setTimeout(function() {
                                    treeObj.expandAll(null, null, true);
                                    let nli: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                                    expect(nli[0].childElementCount).toBe(3);
                                    expect(nli[0].children[2].childElementCount).toBe(1);
                                    expect(nli[11].childElementCount).toBe(3);
                                    expect(nli[11].children[2].childElementCount).toBe(5);
                                    expect(nli[12].childElementCount).toBe(3);
                                    expect(nli[12].children[2].childElementCount).toBe(2);
                                    expect(nli[14].childElementCount).toBe(3);
                                    expect(nli[14].children[2].childElementCount).toBe(1);
                                    done();
                                }, 450);
                            }, 450);
                        }, 450);
                    }, 450);
                }, 450);
            });
            it('collapseAll', (done: Function) => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                expect(li[0].childElementCount).toBe(2);
                treeObj.expandAll();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    let newli: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                    expect(newli[0].childElementCount).toBe(3);
                    expect(newli[0].children[2].childElementCount).toBe(1);
                    expect(li[0].getAttribute('aria-expanded')).toBe('true');
                    expect(treeObj.expandedNodes.length).toBe(7);
                    treeObj.collapseAll();
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function() {
                        expect(li[0].getAttribute('aria-expanded')).toBe('false');
                        expect(treeObj.expandedNodes.length).toBe(0);
                        done();
                    }, 450);
                }, 450);
            });
            it('collapseAll with specific nodes', (done: Function) => {
                treeObj.expandAll();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                    expect(li[0].querySelector('.e-icons').classList.contains('e-icon-collapsible')).toBe(true);
                    treeObj.collapseAll(['01', li[2], '03', '099', '07']);
                    expect(li[0].querySelector('.e-icons').classList.contains('e-icon-collapsible')).toBe(false);
                    expect(li[2].querySelector('.e-icons').classList.contains('e-icon-collapsible')).toBe(false);
                    expect(li[5].querySelector('.e-icons').classList.contains('e-icon-collapsible')).toBe(false);
                    treeObj.collapseAll('04');
                    expect(li[11].querySelector('.e-icons').classList.contains('e-icon-collapsible')).toBe(true);
                    treeObj.collapseAll(null);
                    expect(li[12].querySelector('.e-icons').classList.contains('e-icon-collapsible')).toBe(false);
                    done();
                }, 450);
            });
            it('collapseAll with level', (done: Function) => {
                treeObj.expandAll();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                    expect(li[0].querySelector('.e-icons').classList.contains('e-icon-collapsible')).toBe(true);
                    treeObj.collapseAll(null, 1);
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function() {
                        expect(li[0].querySelector('.e-icons').classList.contains('e-icon-collapsible')).toBe(false);
                        expect(li[11].querySelector('.e-icons').classList.contains('e-icon-collapsible')).toBe(false);
                        expect(li[12].querySelector('.e-icons').classList.contains('e-icon-collapsible')).toBe(true);
                        treeObj.collapseAll(null, 3);
                        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                        setTimeout(function() {
                            let nli: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                            expect(li[12].querySelector('.e-icons').classList.contains('e-icon-collapsible')).toBe(false);
                            expect(li[14].querySelector('.e-icons').classList.contains('e-icon-collapsible')).toBe(false);                            
                            done();
                        }, 450);
                    }, 450);
                }, 450);
            });
            it('collapseAll with excludeHiddenNodes', (done: Function) => {
                treeObj.expandAll();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    treeObj.collapseAll(null, 1, true);
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function() {
                        let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                        expect(li[0].querySelector('.e-icons').classList.contains('e-icon-collapsible')).toBe(false);
                        expect(li[11].querySelector('.e-icons').classList.contains('e-icon-collapsible')).toBe(false);
                        expect(li[12].querySelector('.e-icons').classList.contains('e-icon-collapsible')).toBe(true);
                        treeObj.collapseAll(null, 2, true);
                        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                        setTimeout(function() {
                            expect(li[12].querySelector('.e-icons').classList.contains('e-icon-collapsible')).toBe(true);
                            treeObj.collapseAll(null, 0, true);
                            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                            setTimeout(function() {
                                mouseEventArgs.target = li[11].querySelector('.e-icons');
                                treeObj.touchClickObj.tap(tapEvent);
                                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                                setTimeout(function() {
                                    expect(li[12].querySelector('.e-icons').classList.contains('e-icon-collapsible')).toBe(true);
                                    treeObj.collapseAll(null, null, true);
                                    let nli: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                                    expect(nli[12].querySelector('.e-icons').classList.contains('e-icon-collapsible')).toBe(false);
                                    expect(nli[14].querySelector('.e-icons').classList.contains('e-icon-collapsible')).toBe(false);
                                    done();
                                }, 450);
                            }, 450);
                        }, 450);
                    }, 450);
                }, 450);
            });
            it('ensureVisible', (done: Function) => {
                treeObj.expandAll();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    treeObj.collapseAll(null, 1, true);
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function() {
                        let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                        treeObj.ensureVisible('0');
                        treeObj.ensureVisible('04-01-01');
                        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                        setTimeout(function() {
                            expect(li[11].querySelector('.e-icons').classList.contains('e-icon-collapsible')).toBe(true);
                            expect(li[12].querySelector('.e-icons').classList.contains('e-icon-collapsible')).toBe(true);
                            treeObj.ensureVisible(li[15]);
                            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                            setTimeout(function() {
                                expect(li[14].querySelector('.e-icons').classList.contains('e-icon-collapsible')).toBe(true);
                                done();
                            }, 450);
                        }, 450);
                    }, 450);
                }, 450);
            });
            it('disableNodes', () => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                expect(li[0].classList.contains('e-disable')).toBe(false);
                expect(li[0].getAttribute('aria-disabled')).toBe(null);
                treeObj.disableNodes(['01', li[2], '03', '099', '07']);
                expect(li[0].classList.contains('e-disable')).toBe(true);
                expect(li[0].getAttribute('aria-disabled')).toBe('true');
                expect(li[2].classList.contains('e-disable')).toBe(true);
                expect(li[2].getAttribute('aria-disabled')).toBe('true');
                expect(li[8].classList.contains('e-disable')).toBe(true);
                expect(li[8].getAttribute('aria-disabled')).toBe('true');
                treeObj.disableNodes(null);
                expect(li[3].classList.contains('e-disable')).toBe(false);
                expect(li[3].getAttribute('aria-disabled')).toBe(null);
            });
            it('enableNodes', () => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                treeObj.disableNodes(['01', li[2], '03', '099', '07']);
                expect(li[0].classList.contains('e-disable')).toBe(true);
                expect(li[2].classList.contains('e-disable')).toBe(true);
                expect(li[8].classList.contains('e-disable')).toBe(true);
                treeObj.enableNodes(['01', li[2], '099']);
                expect(li[0].classList.contains('e-disable')).toBe(false);
                expect(li[0].getAttribute('aria-disabled')).toBe(null);
                expect(li[2].classList.contains('e-disable')).toBe(false);
                expect(li[2].getAttribute('aria-disabled')).toBe(null);
                expect(li[8].classList.contains('e-disable')).toBe(true);
                expect(li[8].getAttribute('aria-disabled')).toBe('true');
            });
            it('getNode', () => {
                expect(treeObj.getNode(null).text).toBe('');
                expect(treeObj.getNode(1).text).toBe('');
                expect(treeObj.getNode('0').text).toBe('');
                expect(treeObj.getNode('01').text).toBe('Music');
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                expect(treeObj.getNode(li[1]).text).toBe('Videos');
            });
            it('getTreeData', (done: Function) => {
                expect(treeObj.getTreeData(null).length).toBe(29);
                expect(treeObj.getTreeData('0').length).toBe(0);
                expect(treeObj.getTreeData('01')[0].nodeText).toBe('Music');
                expect(treeObj.getTreeData('02-01')[0].nodeText).toBe('Naturals.mp4');
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                expect(treeObj.getTreeData(li[1])[0].nodeText).toBe('Videos');
                treeObj.allowEditing = true;
                treeObj.dataBind();
                treeObj.updateNode(li[0], 'Rain');
                expect(treeObj.getTreeData('01')[0].nodeText).toBe('Rain');
                mouseEventArgs.target = li[1].querySelector('.e-list-text');
                treeObj.touchClickObj.tap(tapEvent);
                expect(treeObj.getTreeData(li[1])[0].selected).toBe(true);
                treeObj.showCheckBox = true;
                treeObj.dataBind();
                let li1: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                mouseEventArgs.target = li1[0].querySelector('.e-icons');
                treeObj.touchClickObj.tap(tapEvent);
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    expect(treeObj.getTreeData('01')[0].expanded).toBe(true);
                    let newli: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                    mouseEventArgs.target = newli[1].querySelector('.e-icons');
                    treeObj.touchClickObj.tap(tapEvent);
                    expect(treeObj.getTreeData('01-01')[0].isChecked).toBe(true);
                    done();
                }, 450)
            });
            it('moveNodes', (done: Function) => {
                expect(j).toEqual(0);
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                treeObj.moveNodes(null, '0');
                expect(j).toEqual(0);
                treeObj.moveNodes(['01','02'], '03');
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    expect(li[2].childElementCount).toBe(3);
                    expect(li[2].children[2].childElementCount).toBe(7);
                    expect(li[1].parentNode.parentNode).toBe(li[2]);
                    expect(li[0].parentNode.parentNode).toBe(li[2]);
                    expect(treeObj.expandedNodes.length).toBe(1);
                    expect(treeObj.getTreeData('01')[0]['nodePid']).toBe('03');
                    expect(treeObj.getTreeData('02')[0]['nodePid']).toBe('03');
                    expect(j).toEqual(1);
                    treeObj.moveNodes(['03', li[0]], '02', 0);
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function() {
                        expect(li[1].childElementCount).toBe(3);
                        expect(li[1].children[2].childElementCount).toBe(3);
                        expect(li[0].parentNode.parentNode).toBe(li[1]);
                        expect(li[2].parentNode.parentNode).not.toBe(li[1]);
                        expect(treeObj.expandedNodes.length).toBe(2);
                        expect(treeObj.getTreeData('01')[0]['nodePid']).toBe('02');
                        expect(j).toEqual(2);
                        done();
                    }, 500);
                }, 500);
            });
            it('removeNodes', () => {
                expect(j).toEqual(0);
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                treeObj.selectedNodes = ['02'];
                treeObj.dataBind();
                expect(treeObj.liList.length).toBe(9);
                expect(treeObj.getTreeData().length).toBe(29);
                treeObj.removeNodes();
                expect(treeObj.liList.length).toBe(9);
                expect(treeObj.getTreeData().length).toBe(29);
                expect(j).toEqual(0);
                treeObj.removeNodes(null);
                expect(treeObj.liList.length).toBe(9);
                expect(treeObj.getTreeData().length).toBe(29);
                expect(j).toEqual(0);
                treeObj.removeNodes('0');
                expect(treeObj.liList.length).toBe(9);
                expect(treeObj.getTreeData().length).toBe(29);
                expect(j).toEqual(1);
                treeObj.removeNodes(['01','02']);
                expect(treeObj.liList.length).toBe(7);
                expect(treeObj.getTreeData().length).toBe(24);
                expect(j).toEqual(2);
                treeObj.removeNodes([li[2]]);
                expect(treeObj.liList.length).toBe(6);
                expect(treeObj.getTreeData().length).toBe(18);
                expect(j).toEqual(3);
                expect(treeObj.liList.length).toBe(treeObj.element.querySelectorAll('li').length);
                expect(treeObj.selectedNodes.length).toBe(0);
            });
            it('refreshNode with target as li with collapsed state', () => {
                expect(j).toEqual(0);
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                var data = [{nodeText: 'RefreshedNode', iconCss: 'file', navigateUrl: 'https://ej2.syncfusion.com/home/', tooltip: 'This is refreshed node'}]
                treeObj.refreshNode(li[0], data);
                treeObj.dataBind();
                var refreshedLi = treeObj.element.querySelectorAll('li')[0];
                expect(j).toEqual(1);
                expect(refreshedLi.querySelector('.e-list-icon').classList.contains('file')).toBe(true);
                expect(refreshedLi.getAttribute('title')).toBe("This is refreshed node");
                expect((refreshedLi.querySelector('.e-list-url') as any).href.indexOf('https://ej2.syncfusion.com/home/')).not.toBe(-1);
                treeObj.expandedNodes = ['01'];
                treeObj.dataBind();
                expect(refreshedLi.querySelector('ul li').querySelector('.e-list-text').textContent).toBe("Gouttes.mp3");
                expect(treeObj.getTreeData('01')[0].nodeText).toBe("RefreshedNode");
                expect(treeObj.getTreeData('01-01')[0]['nodePid']).toBe("01");
            });
            it('refreshNode with target as id with expanded state', () => {
                expect(j).toEqual(0);
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                treeObj.expandedNodes = ['01'];
                treeObj.dataBind();
                var data = [{nodeText: 'RefreshedNode', iconCss: 'file', navigateUrl: 'https://ej2.syncfusion.com/home/', tooltip: 'This is refreshed node'}]
                treeObj.refreshNode('01', data);
                treeObj.dataBind();
                var refreshedLi = treeObj.element.querySelectorAll('li')[0];
                expect(j).toEqual(1);
                expect(refreshedLi.querySelector('.e-list-icon').classList.contains('file')).toBe(true);
                expect(refreshedLi.getAttribute('title')).toBe("This is refreshed node");
                expect((refreshedLi.querySelector('.e-list-url') as any).href.indexOf('https://ej2.syncfusion.com/home/')).not.toBe(-1);
                expect(refreshedLi.querySelector('ul li').querySelector('.e-list-text').textContent).toBe("Gouttes.mp3");
                expect(treeObj.getTreeData('01')[0].nodeText).toBe("RefreshedNode");
                expect(treeObj.getTreeData('01-01')[0].nodePid).toBe("01");
                expect(refreshedLi.querySelector('.e-icons').classList.contains('e-icon-collapsible'));
            });
            it('refreshNode with target as id without child', () => {
                expect(j).toEqual(0);
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                treeObj.expandedNodes = ['01'];
                treeObj.dataBind();
                var data = [{nodeText: 'RefreshedNode', iconCss: 'file', htmlAttributes:{"data-type": "refreshedData"}, navigateUrl: 'https://ej2.syncfusion.com/home/', tooltip: 'This is refreshed node'}]
                treeObj.refreshNode('01-01', data);
                treeObj.dataBind();
                var refreshedLi = treeObj.element.querySelectorAll('li')[1];
                expect(j).toEqual(1);
                expect(refreshedLi.querySelector('.e-list-icon').classList.contains('file')).toBe(true);
                expect(refreshedLi.getAttribute('title')).toBe("This is refreshed node");
                expect((refreshedLi.querySelector('.e-list-url') as any).href.indexOf('https://ej2.syncfusion.com/home/')).not.toBe(-1);
                expect(treeObj.getTreeData('01-01')[0].nodeText).toBe("RefreshedNode");
            });
            it('refreshNode with target as id without child and is not rendered in DOM', () => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                var data = [{nodeText: 'RefreshedNode', iconCss: 'file', navigateUrl: 'https://ej2.syncfusion.com/home/', tooltip: 'This is refreshed node'}]
                treeObj.refreshNode('01-01', data);
                treeObj.expandedNodes = ['01'];
                treeObj.dataBind();
                var refreshedLi = treeObj.element.querySelectorAll('li')[1];
                expect(refreshedLi.querySelector('.e-list-icon').classList.contains('file')).toBe(true);
                expect(refreshedLi.getAttribute('title')).toBe("This is refreshed node");
                expect((refreshedLi.querySelector('.e-list-url') as any).href.indexOf('https://ej2.syncfusion.com/home/')).not.toBe(-1);
                expect(treeObj.getTreeData('01-01')[0].nodeText).toBe("RefreshedNode");
            });
            it('refreshNode with target as id and is not rendered in DOM', () => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                var data = [{nodeText: 'RefreshedNode', iconCss: 'file', navigateUrl: 'https://ej2.syncfusion.com/home/', tooltip: 'This is refreshed node'}]
                treeObj.refreshNode('04-01', data);
                treeObj.expandedNodes = ['04'];
                treeObj.dataBind();
                var refreshedLi = li[3].querySelector('ul li');
                expect(refreshedLi.querySelector('.e-list-icon').classList.contains('file')).toBe(true);
                expect(refreshedLi.getAttribute('title')).toBe("This is refreshed node");
                expect((refreshedLi.querySelector('.e-list-url') as any).href.indexOf('https://ej2.syncfusion.com/home/')).not.toBe(-1);
                expect(treeObj.getTreeData('04-01')[0].nodeText).toBe("RefreshedNode");
                expect(treeObj.getTreeData('04-01-01')[0].nodePid).toBe("04-01");
                treeObj.expandedNodes = ['04','04-01'];
                treeObj.dataBind();
                expect(refreshedLi.querySelector('.e-icons').classList.contains('e-icon-expandable'));
                expect(refreshedLi.querySelector('ul li').querySelector('.e-list-text').textContent).toBe("WIN_20160726_094117.JPG");
            });
            it('refreshNode parent and child nodes together rendered in DOM with parent in expanded state', () => { 
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                var data = [{ nodeText: 'RefreshedNode', iconCss: 'folder', navigateUrl: 'https://ej2.syncfusion.com/home/', tooltip: 'This is refreshed node',hasChild: true },
                { nodeId: '10-10', nodePid: '01', nodeText: 'Refreshed child Node', icons: 'file' }]
                treeObj.expandedNodes = ['01'];
                treeObj.dataBind();
                treeObj.refreshNode('01', data);
                var refreshedLi = treeObj.element.querySelectorAll('li')[0];
                expect(refreshedLi.querySelector('.e-list-icon').classList.contains('folder')).toBe(true);
                expect(refreshedLi.getAttribute('title')).toBe("This is refreshed node");
                expect((refreshedLi.querySelector('.e-list-url') as any).href.indexOf('https://ej2.syncfusion.com/home/')).not.toBe(-1);
                expect(treeObj.getTreeData('01')[0].nodeText).toBe("RefreshedNode");
                expect(refreshedLi.querySelectorAll('ul li').length).toBe(1);
                expect(refreshedLi.querySelector('ul li').querySelector('.e-list-text').textContent).toBe('Refreshed child Node');
                expect(refreshedLi.querySelector('.e-icons').classList.contains('e-icon-collapsible'));
            });
            it('refreshNode parent and child nodes together rendered in DOM with parent in collapsed state', function () {
                var li = treeObj.element.querySelectorAll('li');
                var data = [{ nodeText: 'RefreshedNode', iconCss: 'folder', navigateUrl: 'https://ej2.syncfusion.com/home/', tooltip: 'This is refreshed node', hasChild: true },
                { nodeId: '10-10', nodePid: '04', nodeText: 'Refreshed child Node', icons: 'file', hasChild: true, },
                { nodeId: '10-11', nodePid: '10-10', nodeText: 'Refreshed  nested child Node', }
                ];
                treeObj.refreshNode('04', data);
                treeObj.expandedNodes = ['04'];
                treeObj.dataBind();
                expect(li[3].querySelector('.e-list-icon').classList.contains('folder')).toBe(true);
                expect(li[3].getAttribute('title')).toBe("This is refreshed node");
                expect(li[3].querySelector('.e-list-url').href.indexOf('https://ej2.syncfusion.com/home/')).not.toBe(-1);
                expect(treeObj.getTreeData('04')[0].nodeText).toBe("RefreshedNode");
                treeObj.expandedNodes = ['04','10-10'];
                treeObj.dataBind();
                var refreshedChild = li[3].querySelector('ul li');
                expect(refreshedChild.querySelector('ul li').getAttribute("data-uid")).toBe("10-11");
                expect(refreshedChild.querySelector(".e-list-text").textContent).toBe("Refreshed child Node");
            });
            it('refreshNode parent and child nodes together rendered in DOM with parent in collapsed state', function () {
                var li = treeObj.element.querySelectorAll('li');
                var data = [{ nodeText: 'RefreshedNode', iconCss: 'folder', navigateUrl: 'https://ej2.syncfusion.com/home/', tooltip: 'This is refreshed node', hasChild: true },
                { nodeId: '10-10', nodePid: '04', nodeText: 'Refreshed child Node', icons: 'file', hasChild: true, },
                { nodeId: '10-11', nodePid: '10-10', nodeText: 'Refreshed  nested child Node', }
                ];
                treeObj.expandedNodes = ['04'];
                treeObj.dataBind();
                treeObj.refreshNode('04', data);
                treeObj.dataBind();
                expect(li[3].querySelector('.e-list-icon').classList.contains('folder')).toBe(true);
                expect(li[3].getAttribute('title')).toBe("This is refreshed node");
                expect(li[3].querySelector('.e-list-url').href.indexOf('https://ej2.syncfusion.com/home/')).not.toBe(-1);
                expect(treeObj.getTreeData('04')[0].nodeText).toBe("RefreshedNode");
                treeObj.expandedNodes = ['04','10-10'];
                treeObj.dataBind();
                var refreshedChild = li[3].querySelector('ul li');
                expect(refreshedChild.querySelector('ul li').getAttribute("data-uid")).toBe("10-11");
                expect(refreshedChild.querySelector(".e-list-text").textContent).toBe("Refreshed child Node");
            });
            it('refreshNode parent and child nodes together which is not rendered in DOM', function () {
                var li = treeObj.element.querySelectorAll('li');
                var data = [{ nodeText: 'RefreshedNode', iconCss: 'folder', navigateUrl: 'https://ej2.syncfusion.com/home/', tooltip: 'This is refreshed node', hasChild: true},
                            { nodeId: '10-10', nodePid: '04-01', nodeText: 'Refreshed child Node', icons: 'file', hasChild:true} ,
                                    { nodeId: '10-11', nodePid: '10-10', nodeText: 'Refreshed  nested child Node', }
                            
                       ];
                treeObj.expandedNodes = ['04'];
                treeObj.dataBind();
                treeObj.refreshNode('04-01', data);
                var refreshedLi = li[3].querySelector('ul li');
                expect(refreshedLi.querySelector('.e-list-icon').classList.contains('folder')).toBe(true);
                expect(refreshedLi.getAttribute('title')).toBe("This is refreshed node");
                expect(refreshedLi.querySelector('.e-list-url').href.indexOf('https://ej2.syncfusion.com/home/')).not.toBe(-1);
                expect(treeObj.getTreeData('04-01')[0].nodeText).toBe("RefreshedNode");
                expect(refreshedLi.querySelector('.e-icons').classList.contains('e-icon-expandable'));
                treeObj.expandedNodes = ['04', '04-01'];
                treeObj.dataBind();
                var refreshedChild = refreshedLi.querySelector('ul li');
                expect(refreshedChild.getAttribute("data-uid")).toBe("10-10");
                expect(refreshedChild.querySelector(".e-list-text").textContent).toBe("Refreshed child Node");
                expect(refreshedChild.querySelector(".e-icons").classList.contains('e-icon-expandable')).toBe(true);
                treeObj.expandedNodes = ['04', '04-01', '10-10'];
                treeObj.dataBind();
                var refreshNestedChild = refreshedChild.querySelector('ul li');
                expect(refreshNestedChild.getAttribute("data-uid")).toBe("10-11");
                expect(refreshNestedChild.querySelector(".e-list-text").textContent).toBe("Refreshed  nested child Node");
            });
            it('addNodes', (done: Function) => {
                expect(j).toEqual(0);
                expect(treeObj.expandedNodes.length).toBe(0);
                expect(treeObj.getTreeData().length).toBe(29);
                treeObj.addNodes(null);
                expect(j).toEqual(0);
                treeObj.addNodes(localData4);
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                    expect(treeObj.liList.length).toBe(13);
                    expect(treeObj.liList.length).toBe(li.length);
                    expect(treeObj.expandedNodes.length).toBe(2);
                    expect(treeObj.getTreeData().length).toBe(33);
                    expect(j).toEqual(1);
                    expect(treeObj.element.querySelectorAll('.e-list-text')[9].innerHTML).toBe('Music');
                    expect(treeObj.element.querySelectorAll('.e-list-item')[9].getAttribute('data-uid')).toBe('11');
                    expect(treeObj.element.querySelector('.e-list-icon').classList.contains('folder')).toBe(true);
                    expect(treeObj.element.querySelector('.e-list-img').src.indexOf('images/Shooting.png')).not.toBe(-1);
                    expect(treeObj.element.querySelectorAll('.e-list-item')[9].title).toBe('This is Music node');
                    expect(treeObj.element.querySelectorAll('.e-list-item')[9].classList.contains('e-active')).toBe(true);
                    expect(treeObj.element.querySelectorAll('li')[11].classList.contains('firstnode')).toBe(true);
                    expect(treeObj.element.querySelectorAll('li')[11].style.backgroundColor).toBe('red');
                    treeObj.removeNodes(['11', '11-01', '12', '12-01']);
                    expect(treeObj.expandedNodes.length).toBe(0);
                    expect(treeObj.getTreeData().length).toBe(29);
                    expect(j).toEqual(2);
                    treeObj.addNodes(localData4, '01');
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function() {
                        let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                        expect(treeObj.liList.length).toBe(14);
                        expect(treeObj.liList.length).toBe(li.length);
                        expect(treeObj.expandedNodes.length).toBe(1);
                        expect(treeObj.getTreeData().length).toBe(33);
                        expect(j).toEqual(3);
                        expect(treeObj.element.querySelectorAll('.e-list-text')[2].innerHTML).toBe('Music');
                        expect(treeObj.element.querySelectorAll('.e-list-item')[2].getAttribute('data-uid')).toBe('11');
                        expect(treeObj.element.querySelector('.e-list-icon').classList.contains('folder')).toBe(true);
                        expect(treeObj.element.querySelector('.e-list-img').src.indexOf('images/Shooting.png')).not.toBe(-1);
                        expect(treeObj.element.querySelectorAll('.e-list-item')[2].title).toBe('This is Music node');
                        expect(treeObj.element.querySelectorAll('.e-list-item')[2].classList.contains('e-active')).toBe(true);
                        expect(treeObj.element.querySelectorAll('li')[4].classList.contains('firstnode')).toBe(true);
                        expect(treeObj.element.querySelectorAll('li')[4].style.backgroundColor).toBe('red');
                        treeObj.removeNodes(['11', '11-01', '12', '12-01']);
                        expect(treeObj.expandedNodes.length).toBe(1);
                        expect(treeObj.getTreeData().length).toBe(29);
                        expect(j).toEqual(4);
                        treeObj.addNodes(localData4, null, 1);
                        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                        setTimeout(function() {
                            let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                            expect(treeObj.liList.length).toBe(14);
                            expect(treeObj.liList.length).toBe(li.length);
                            expect(treeObj.expandedNodes.length).toBe(3);
                            expect(treeObj.getTreeData().length).toBe(33);
                            expect(j).toEqual(5);
                            expect(treeObj.element.querySelectorAll('.e-list-text')[4].innerHTML).toBe('Music');
                            expect(treeObj.element.querySelectorAll('.e-list-item')[4].getAttribute('data-uid')).toBe('11');
                            expect(treeObj.element.querySelector('.e-list-icon').classList.contains('folder')).toBe(true);
                            expect(treeObj.element.querySelector('.e-list-img').src.indexOf('images/Shooting.png')).not.toBe(-1);
                            expect(treeObj.element.querySelectorAll('.e-list-item')[4].title).toBe('This is Music node');
                            expect(treeObj.element.querySelectorAll('.e-list-item')[4].classList.contains('e-active')).toBe(true);
                            expect(treeObj.element.querySelectorAll('li')[2].classList.contains('firstnode')).toBe(true);
                            expect(treeObj.element.querySelectorAll('li')[2].style.backgroundColor).toBe('red');
                            treeObj.removeNodes(['11', '11-01', '12', '12-01']);
                            expect(treeObj.expandedNodes.length).toBe(1);
                            expect(treeObj.getTreeData().length).toBe(29);
                            expect(j).toEqual(6);
                            treeObj.addNodes(localData4, '01', 0);
                            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                            setTimeout(function() {
                                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                                expect(treeObj.liList.length).toBe(14);
                                expect(treeObj.liList.length).toBe(li.length);
                                expect(treeObj.expandedNodes.length).toBe(1);
                                expect(treeObj.getTreeData().length).toBe(33);
                                expect(j).toEqual(7);
                                expect(treeObj.element.querySelectorAll('.e-list-text')[1].innerHTML).toBe('Music');
                                expect(treeObj.element.querySelectorAll('.e-list-item')[1].getAttribute('data-uid')).toBe('11');
                                expect(treeObj.element.querySelector('.e-list-icon').classList.contains('folder')).toBe(true);
                                expect(treeObj.element.querySelector('.e-list-img').src.indexOf('images/Shooting.png')).not.toBe(-1);
                                expect(treeObj.element.querySelectorAll('.e-list-item')[1].title).toBe('This is Music node');
                                expect(treeObj.element.querySelectorAll('.e-list-item')[1].classList.contains('e-active')).toBe(true);
                                expect(treeObj.element.querySelectorAll('li')[3].classList.contains('firstnode')).toBe(true);
                                expect(treeObj.element.querySelectorAll('li')[3].style.backgroundColor).toBe('red');
                                done();
                            }, 500);
                        }, 500);
                    }, 500);
                }, 500);
            });
            it('destroy', () => {
                treeObj.destroy();
                expect(treeObj.element.className).toBe('');
                expect(treeObj.element.childElementCount).toBe(0);
            });
        });
        describe('animation testing', () => {
            let mouseEventArgs: any;
            let tapEvent: any;
            let treeObj: any;
            let i: number = 0;
            let originalTimeout: any;
            function clickFn(): void {
                i++;
            }
            beforeEach((): void => {
                mouseEventArgs = {
                    preventDefault: (): void => {},
                    stopImmediatePropagation: (): void => {},
                    target: null,
                    type: null,
                    shiftKey: false,
                    ctrlKey: false
                };
                tapEvent = {
                    originalEvent: mouseEventArgs,
                    tapCount: 1
                };
                treeObj = undefined;
                i = 0;
                let ele: HTMLElement = createElement('div', { id: 'tree1' });
                document.body.appendChild(ele);
                originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            });
            afterEach((): void => {
                if (treeObj)
                    treeObj.destroy();
                document.body.innerHTML = '';
                jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            });
            it('default value with nodeExpanded event', (done: Function) => {
                treeObj = new TreeView({
                    fields: { dataSource: localData1, id: 'nodeId', text: 'nodeText', parentID: 'nodePid', hasChildren: 'hasChild' },
                    nodeExpanded: clickFn,
                },'#tree1');
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                mouseEventArgs.target = li[0].querySelector('.e-icons');
                treeObj.touchClickObj.tap(tapEvent);
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    expect(i).toEqual(1);
                    done();
                }, 450);
            });
            it('default value with nodeCollapsed event', (done: Function) => {
                treeObj = new TreeView({
                    fields: { dataSource: localData1, id: 'nodeId', text: 'nodeText', parentID: 'nodePid', hasChildren: 'hasChild' },
                    nodeCollapsed: clickFn,
                },'#tree1');
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                mouseEventArgs.target = li[0].querySelector('.e-icons');
                treeObj.touchClickObj.tap(tapEvent);
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    treeObj.touchClickObj.tap(tapEvent);
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function() {
                        expect(i).toEqual(1);
                        done();
                    }, 450);
                }, 450);
            });
            it('disable expand animation', (done: Function) => {
                treeObj = new TreeView({
                    fields: { dataSource: localData1, id: 'nodeId', text: 'nodeText', parentID: 'nodePid', hasChildren: 'hasChild' },
                    nodeExpanded: clickFn,
                    animation: { expand: { duration: 0 } }
                },'#tree1');
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                mouseEventArgs.target = li[0].querySelector('.e-icons');
                treeObj.touchClickObj.tap(tapEvent);
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    expect(i).toEqual(1);
                    done();
                }, 100);
            });
            it('disable collpase animation', (done: Function) => {
                treeObj = new TreeView({
                    fields: { dataSource: localData1, id: 'nodeId', text: 'nodeText', parentID: 'nodePid', hasChildren: 'hasChild' },
                    nodeCollapsed: clickFn,
                    animation: { collapse: { duration: 0 } }
                },'#tree1');
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                mouseEventArgs.target = li[0].querySelector('.e-icons');
                treeObj.touchClickObj.tap(tapEvent);
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    treeObj.touchClickObj.tap(tapEvent);
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function() {
                        expect(i).toEqual(1);
                        done();
                    }, 100);
                }, 450);
            });
            it('property change expand animation', (done: Function) => {
                treeObj = new TreeView({
                    fields: { dataSource: localData1, id: 'nodeId', text: 'nodeText', parentID: 'nodePid', hasChildren: 'hasChild' },
                    nodeExpanded: clickFn,                    
                },'#tree1');
                treeObj.animation = { expand: { duration: 100 } };
                treeObj.dataBind();
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                mouseEventArgs.target = li[0].querySelector('.e-icons');
                treeObj.touchClickObj.tap(tapEvent);
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    expect(i).toEqual(1);
                    done();
                }, 150);
            });
            it('property change collpase animation', (done: Function) => {
                treeObj = new TreeView({
                    fields: { dataSource: localData1, id: 'nodeId', text: 'nodeText', parentID: 'nodePid', hasChildren: 'hasChild' },
                    nodeCollapsed: clickFn,
                },'#tree1');
                treeObj.animation = { collapse: { duration: 100 } };
                treeObj.dataBind();
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                mouseEventArgs.target = li[0].querySelector('.e-icons');
                treeObj.touchClickObj.tap(tapEvent);
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    treeObj.touchClickObj.tap(tapEvent);
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function() {
                        expect(i).toEqual(1);
                        done();
                    }, 150);
                }, 450);
            });
        });
        describe('Drag and drop functionality testing', () => {
            let treeObj: any;
            let mouseEventArgs: any;
            let tapEvent: any;
            beforeEach((done: Function): void => {
                mouseEventArgs = {
                    preventDefault: (): void => {},
                    stopImmediatePropagation: (): void => {},
                    target: null,
                    type: null,
                    shiftKey: false,
                    ctrlKey: false
                };
                tapEvent = {
                    originalEvent: mouseEventArgs,
                    tapCount: 1
                };
                treeObj = undefined;
                let ele: HTMLElement = createElement('div', { id: 'tree1' });
                document.body.appendChild(ele);
                treeObj = new TreeView({ 
                    fields: { dataSource: localData1, id: "nodeId", text: "nodeText", parentID: 'nodePid', hasChildren: 'hasChild', navigateUrl: 'nodeUrl', iconCss: 'icons', imageUrl: 'nodeImage1', expanded: 'nodeExpanded1' },
                    allowDragAndDrop: true,
                    fullRowSelect: false,
                    dataBound: ()=> {
                        done();
                    }
                },'#tree1');
            });
            afterEach((): void => {
                if (treeObj)
                    treeObj.destroy();
                document.body.innerHTML = '';
            });
            it('testing with target as text', () => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                let mousedown: any = getEventObject('MouseEvents', 'mousedown', treeObj.element, li[2].querySelector('.e-list-text'), 15, 10);
                EventHandler.trigger(treeObj.element, 'mousedown', mousedown);
                let mousemove: any = getEventObject('MouseEvents', 'mousemove', treeObj.element, li[2].querySelector('.e-list-text'), 15, 70);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                mousemove.srcElement = mousemove.target = mousemove.toElement = li[1].querySelector('.e-list-text');
                mousemove = setMouseCordinates(mousemove, 15, 75);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                let mouseup: any = getEventObject('MouseEvents', 'mouseup', treeObj.element, li[1].querySelector('.e-list-text'));
                mouseup.type = 'mouseup';
                EventHandler.trigger(<any>(document), 'mouseup', mouseup);
                expect(li[1].childElementCount).toBe(2);
                expect(li[1].children[1].childElementCount).toBe(1);
                expect(li[1].getAttribute('aria-expanded')).toBe('true');
                expect(li[2].getAttribute('aria-level')).toBe('3');
                expect(treeObj.getTreeData('02')[0]['nodePid']).toBe('01-01');
            });
            it('testing with drag element as parent', () => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                expect(li[0].getAttribute('aria-level')).toBe('1');
                expect(li[1].getAttribute('aria-level')).toBe('2');
                let mousedown: any = getEventObject('MouseEvents', 'mousedown', treeObj.element, li[0].querySelector('.e-list-text'), 15, 10);
                EventHandler.trigger(treeObj.element, 'mousedown', mousedown);
                let mousemove: any = getEventObject('MouseEvents', 'mousemove', treeObj.element, li[0].querySelector('.e-list-text'), 15, 70);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                mousemove.srcElement = mousemove.target = mousemove.toElement = li[9].querySelector('.e-list-text');
                mousemove = setMouseCordinates(mousemove, 15, 75);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                let mouseup: any = getEventObject('MouseEvents', 'mouseup', treeObj.element, li[9].querySelector('.e-list-text'));
                mouseup.type = 'mouseup';
                EventHandler.trigger(<any>(document), 'mouseup', mouseup);
                expect(li[9].childElementCount).toBe(2);
                expect(li[9].children[1].childElementCount).toBe(1);
                expect(li[9].getAttribute('aria-expanded')).toBe('true');
                expect(li[0].getAttribute('aria-level')).toBe('3');
                expect(li[1].getAttribute('aria-level')).toBe('4');
                expect(treeObj.getTreeData('01')[0]['nodePid']).toBe('05-04');
            });
            it('testing with target as expand icon', () => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                let mousedown: any = getEventObject('MouseEvents', 'mousedown', treeObj.element, li[3].querySelector('.e-icons'), 15, 10, 19, 9);
                EventHandler.trigger(treeObj.element, 'mousedown', mousedown);
                let mousemove: any = getEventObject('MouseEvents', 'mousemove', treeObj.element, li[3].querySelector('.e-icons'), 15, 70, 19, 9);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                mousemove.srcElement = mousemove.target = mousemove.toElement = li[0].querySelector('.e-icons');
                mousemove = setMouseCordinates(mousemove, 15, 75);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                let mouseup: any = getEventObject('MouseEvents', 'mouseup', treeObj.element, li[0].querySelector('.e-icons'), undefined, undefined, 19, 9);
                mouseup.type = 'mouseup';
                EventHandler.trigger(<any>(document), 'mouseup', mouseup);
                expect(li[0].childElementCount).toBe(2);
                expect(li[0].children[1].childElementCount).toBe(2);
                expect(treeObj.getTreeData('03')[0]['nodePid']).toBe('01');
            });
            it('testing with target as custom icon', () => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                let mousedown: any = getEventObject('MouseEvents', 'mousedown', treeObj.element, li[1].querySelector('.e-list-icon'), 15, 10);
                EventHandler.trigger(treeObj.element, 'mousedown', mousedown);
                let mousemove: any = getEventObject('MouseEvents', 'mousemove', treeObj.element, li[1].querySelector('.e-list-icon'), 15, 70);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                mousemove.srcElement = mousemove.target = mousemove.toElement = li[5].querySelector('.e-list-icon');
                mousemove = setMouseCordinates(mousemove, 15, 75);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                let mouseup: any = getEventObject('MouseEvents', 'mouseup', treeObj.element, li[5].querySelector('.e-list-icon'));
                mouseup.type = 'mouseup';
                EventHandler.trigger(<any>(document), 'mouseup', mouseup);
                expect(li[0].childElementCount).toBe(1);
                expect(li[0].getAttribute('aria-expanded')).toBe(null);
                expect(li[5].childElementCount).toBe(2);
                expect(li[5].children[1].childElementCount).toBe(5);
                expect(treeObj.getTreeData('01-01')[0]['nodePid']).toBe('05');
            });
            it('testing with target as custom image', () => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                let mousedown: any = getEventObject('MouseEvents', 'mousedown', treeObj.element, li[2].querySelector('.e-list-img'), 15, 10);
                EventHandler.trigger(treeObj.element, 'mousedown', mousedown);
                let mousemove: any = getEventObject('MouseEvents', 'mousemove', treeObj.element, li[2].querySelector('.e-list-img'), 15, 70);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                mousemove.srcElement = mousemove.target = mousemove.toElement = li[0].querySelector('.e-list-img');
                mousemove = setMouseCordinates(mousemove, 15, 75);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                let mouseup: any = getEventObject('MouseEvents', 'mouseup', treeObj.element, li[0].querySelector('.e-list-img'));
                mouseup.type = 'mouseup';
                EventHandler.trigger(<any>(document), 'mouseup', mouseup);
                expect(li[0].childElementCount).toBe(2);
                expect(li[0].children[1].childElementCount).toBe(2);
                expect(li[2].childElementCount).toBe(1);
                expect(treeObj.getTreeData('02')[0]['nodePid']).toBe('01');
            });
            it('testing with target as text wrapper with child', () => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                let mousedown: any = getEventObject('MouseEvents', 'mousedown', treeObj.element, li[2].querySelector('.e-text-content'), 15, 10);
                EventHandler.trigger(treeObj.element, 'mousedown', mousedown);
                let mousemove: any = getEventObject('MouseEvents', 'mousemove', treeObj.element, li[2].querySelector('.e-text-content'), 15, 70);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                mousemove.srcElement = mousemove.target = mousemove.toElement = li[1].querySelector('.e-text-content');
                mousemove = setMouseCordinates(mousemove, 15, 75);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                expect(document.querySelector('.e-drop-in')).not.toBe(null);
                let mouseup: any = getEventObject('MouseEvents', 'mouseup', treeObj.element, li[1].querySelector('.e-text-content'));
                mouseup.type = 'mouseup';
                EventHandler.trigger(<any>(document), 'mouseup', mouseup);
                expect(li[1].childElementCount).toBe(2);
                expect(li[1].children[1].childElementCount).toBe(1);
                expect(li[1].getAttribute('aria-expanded')).toBe('true');
                expect(treeObj.getTreeData('02')[0]['nodePid']).toBe('01-01');
            });
            it('testing with target as text wrapper with out child', (done: Function) => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                let mousedown: any = getEventObject('MouseEvents', 'mousedown', treeObj.element, li[2].querySelector('.e-text-content'), 15, 10);
                EventHandler.trigger(treeObj.element, 'mousedown', mousedown);
                let mousemove: any = getEventObject('MouseEvents', 'mousemove', treeObj.element, li[2].querySelector('.e-text-content'), 15, 70);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                mousemove.srcElement = mousemove.target = mousemove.toElement = li[3].querySelector('.e-text-content');
                mousemove = setMouseCordinates(mousemove, 15, 75);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                expect(document.querySelector('.e-drop-in')).not.toBe(null);
                let mouseup: any = getEventObject('MouseEvents', 'mouseup', treeObj.element, li[3].querySelector('.e-text-content'));
                mouseup.type = 'mouseup';
                EventHandler.trigger(<any>(document), 'mouseup', mouseup);
                expect(li[3].childElementCount).toBe(2);
                expect(li[3].children[1].childElementCount).toBe(6);
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    expect(li[3].getAttribute('aria-expanded')).toBe('true');
                    expect(treeObj.getTreeData('02')[0]['nodePid']).toBe('03');
                    done();
                }, 450);
            });
            it('testing with target as before li element', () => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                let mousedown: any = getEventObject('MouseEvents', 'mousedown', treeObj.element, li[2], 15, 10);
                EventHandler.trigger(treeObj.element, 'mousedown', mousedown);
                let mousemove: any = getEventObject('MouseEvents', 'mousemove', treeObj.element, li[2], 15, 70);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                mousemove.srcElement = mousemove.target = mousemove.toElement = li[2].querySelector('.e-text-content');
                mousemove = setMouseCordinates(mousemove, 15, 45);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                mousemove.srcElement = mousemove.target = mousemove.toElement = li[1];
                mousemove = setMouseCordinates(mousemove, 15, 50);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                expect(li[1].childElementCount).toBe(2);
                expect(li[1].querySelector('.e-sibling')).not.toBe(null);
                expect(document.querySelector('.e-drop-next')).not.toBe(null);
                let mouseup: any = getEventObject('MouseEvents', 'mouseup', treeObj.element, li[1], 15, 50, 1);
                mouseup.type = 'mouseup';
                EventHandler.trigger(<any>(document), 'mouseup', mouseup);
                expect(li[0].childElementCount).toBe(2);
                expect(li[0].children[1].childElementCount).toBe(2);
                expect(li[0].children[1].querySelector('.e-list-text').innerHTML).toBe('Videos');
                expect(li[1].childElementCount).toBe(1);
                expect(li[1].querySelector('.e-sibling')).toBe(null);
                expect(li[1].getAttribute('aria-expanded')).toBe(null);
                expect(treeObj.getTreeData('02')[0]['nodePid']).toBe('01');
            });
            it('testing with target as after li element', () => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                let mousedown: any = getEventObject('MouseEvents', 'mousedown', treeObj.element, li[2], 15, 10);
                EventHandler.trigger(treeObj.element, 'mousedown', mousedown);
                let mousemove: any = getEventObject('MouseEvents', 'mousemove', treeObj.element, li[2], 15, 70);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                mousemove.srcElement = mousemove.target = mousemove.toElement = li[2].querySelector('.e-text-content');
                mousemove = setMouseCordinates(mousemove, 15, 45);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                mousemove.srcElement = mousemove.target = mousemove.toElement = li[1];
                mousemove = setMouseCordinates(mousemove, 15, 80);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                expect(li[1].childElementCount).toBe(2);
                expect(li[1].querySelector('.e-sibling')).not.toBe(null);
                expect(document.querySelector('.e-drop-next')).not.toBe(null);
                let mouseup: any = getEventObject('MouseEvents', 'mouseup', treeObj.element, li[1], 15, 80);
                mouseup.type = 'mouseup';
                EventHandler.trigger(<any>(document), 'mouseup', mouseup);
                expect(li[0].childElementCount).toBe(2);
                expect(li[0].children[1].childElementCount).toBe(2);
                expect(li[0].children[1].querySelector('.e-list-text').innerHTML).toBe('Gouttes.mp3');
                expect(li[1].childElementCount).toBe(1);
                expect(li[1].querySelector('.e-sibling')).toBe(null);
                expect(li[1].getAttribute('aria-expanded')).toBe(null);
                expect(treeObj.getTreeData('02')[0]['nodePid']).toBe('01');
            });
            it('testing with target as treeview element', () => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                let mousedown: any = getEventObject('MouseEvents', 'mousedown', treeObj.element, li[2].querySelector('.e-text-content'), 15, 10);
                EventHandler.trigger(treeObj.element, 'mousedown', mousedown);
                let mousemove: any = getEventObject('MouseEvents', 'mousemove', treeObj.element, li[2].querySelector('.e-text-content'), 15, 70);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                mousemove.srcElement = mousemove.target = mousemove.toElement = treeObj.element;
                mousemove = setMouseCordinates(mousemove, 15, 75);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                expect(document.querySelector('.e-drop-out')).not.toBe(null);
                let mouseup: any = getEventObject('MouseEvents', 'mouseup', treeObj.element, treeObj.element);
                mouseup.type = 'mouseup';
                EventHandler.trigger(<any>(document), 'mouseup', mouseup);
                expect(li[0].childElementCount).toBe(2);
                expect(li[0].children[1].childElementCount).toBe(1);
                expect(document.querySelector('.e-drop-out')).toBe(null);
                expect(treeObj.getTreeData()[2]['nodeText']).toBe('Naturals.mp4');
            });
            it('testing with target as document', () => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                let mousedown: any = getEventObject('MouseEvents', 'mousedown', treeObj.element, li[2].querySelector('.e-text-content'), 15, 10);
                EventHandler.trigger(treeObj.element, 'mousedown', mousedown);
                let mousemove: any = getEventObject('MouseEvents', 'mousemove', treeObj.element, li[2].querySelector('.e-text-content'), 15, 70);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                mousemove.srcElement = mousemove.target = mousemove.toElement = document.getElementsByTagName('body')[0];
                mousemove = setMouseCordinates(mousemove, 15, 75);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                expect(document.querySelector('.e-no-drop')).not.toBe(null);
                let mouseup: any = getEventObject('MouseEvents', 'mouseup', treeObj.element, document.getElementsByTagName('body')[0]);
                mouseup.type = 'mouseup';
                EventHandler.trigger(<any>(document), 'mouseup', mouseup);
                expect(li[0].childElementCount).toBe(2);
                expect(li[0].children[1].childElementCount).toBe(1);
                expect(document.querySelector('.e-no-drop')).toBe(null);
                expect(treeObj.getTreeData()[2]['nodeText']).toBe('Videos');
            });
            it('testing with target as non droppable element', () => {
                let ele: HTMLElement = createElement('div', { id: 'nontree' });
                document.body.appendChild(ele);
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                let mousedown: any = getEventObject('MouseEvents', 'mousedown', treeObj.element, li[2].querySelector('.e-text-content'), 15, 10);
                EventHandler.trigger(treeObj.element, 'mousedown', mousedown);
                let mousemove: any = getEventObject('MouseEvents', 'mousemove', treeObj.element, li[2].querySelector('.e-text-content'), 15, 70);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                mousemove.srcElement = mousemove.target = mousemove.toElement = document.getElementById('nontree');
                mousemove = setMouseCordinates(mousemove, 15, 75);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                expect(document.querySelector('.e-no-drop')).not.toBe(null);
                let mouseup: any = getEventObject('MouseEvents', 'mouseup', treeObj.element, document.getElementById('nontree'));
                mouseup.type = 'mouseup';
                EventHandler.trigger(<any>(document), 'mouseup', mouseup);
                expect(li[0].childElementCount).toBe(2);
                expect(li[0].children[1].childElementCount).toBe(1);
                expect(document.querySelector('.e-drop-out')).toBe(null);
                expect(treeObj.getTreeData()[2]['nodeText']).toBe('Videos');
            });
            it('testing with target as non droppable element with offset value 32px', () => {
                let ele: HTMLElement = createElement('div', { id: 'nontree', styles: 'height: 32px; background: red' });
                document.body.appendChild(ele);
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                let mousedown: any = getEventObject('MouseEvents', 'mousedown', treeObj.element, li[2].querySelector('.e-text-content'), 15, 10);
                EventHandler.trigger(treeObj.element, 'mousedown', mousedown);
                let mousemove: any = getEventObject('MouseEvents', 'mousemove', treeObj.element, li[2].querySelector('.e-text-content'), 15, 70);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                mousemove.srcElement = mousemove.target = mousemove.toElement = document.getElementById('nontree');
                mousemove = setMouseCordinates(mousemove, 15, 75);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                expect(document.querySelector('.e-no-drop')).not.toBe(null);
                let mouseup: any = getEventObject('MouseEvents', 'mouseup', treeObj.element, document.getElementById('nontree'));
                mouseup.type = 'mouseup';
                EventHandler.trigger(<any>(document), 'mouseup', mouseup);
                expect(li[0].childElementCount).toBe(2);
                expect(li[0].children[1].childElementCount).toBe(1);
                expect(document.querySelector('.e-drop-out')).toBe(null);
                expect(treeObj.getTreeData()[2]['nodeText']).toBe('Videos');
            });
            it('testing with target as non droppable li element', () => {
                let ele: HTMLElement = createElement('li', { id: 'nonliele', className: 'e-list-item' });
                document.body.appendChild(ele);
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                let mousedown: any = getEventObject('MouseEvents', 'mousedown', treeObj.element, li[2].querySelector('.e-text-content'), 15, 10);
                EventHandler.trigger(treeObj.element, 'mousedown', mousedown);
                let mousemove: any = getEventObject('MouseEvents', 'mousemove', treeObj.element, li[2].querySelector('.e-text-content'), 15, 70);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                mousemove.srcElement = mousemove.target = mousemove.toElement = document.getElementById('nonliele');
                mousemove = setMouseCordinates(mousemove, 15, 75);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                expect(document.querySelector('.e-no-drop')).not.toBe(null);
                let mouseup: any = getEventObject('MouseEvents', 'mouseup', treeObj.element, document.getElementById('nonliele'));
                mouseup.type = 'mouseup';
                EventHandler.trigger(<any>(document), 'mouseup', mouseup);
                expect(li[0].childElementCount).toBe(2);
                expect(li[0].children[1].childElementCount).toBe(1);
                expect(document.querySelector('.e-drop-out')).toBe(null);
                expect(treeObj.getTreeData()[2]['nodeText']).toBe('Videos');
            });
            it('testing with target as full row with child', () => {
                treeObj.fullRowSelect = true;
                treeObj.dataBind();
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                let mousedown: any = getEventObject('MouseEvents', 'mousedown', treeObj.element, li[2].querySelector('.e-fullrow'), 15, 10);
                EventHandler.trigger(treeObj.element, 'mousedown', mousedown);
                let mousemove: any = getEventObject('MouseEvents', 'mousemove', treeObj.element, li[2].querySelector('.e-fullrow'), 15, 70);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                mousemove.srcElement = mousemove.target = mousemove.toElement = li[1].querySelector('.e-fullrow');
                mousemove = setMouseCordinates(mousemove, 15, 75);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                expect(document.querySelector('.e-drop-in')).not.toBe(null);
                let mouseup: any = getEventObject('MouseEvents', 'mouseup', treeObj.element, li[1].querySelector('.e-fullrow'));
                mouseup.type = 'mouseup';
                EventHandler.trigger(<any>(document), 'mouseup', mouseup);
                expect(li[1].childElementCount).toBe(3);
                expect(li[1].children[2].childElementCount).toBe(1);
                expect(li[1].getAttribute('aria-expanded')).toBe('true');
                expect(treeObj.getTreeData('02')[0]['nodePid']).toBe('01-01');
            });
            it('testing with target as full row with out child', (done: Function) => {
                treeObj.fullRowSelect = true;
                treeObj.dataBind();
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                let mousedown: any = getEventObject('MouseEvents', 'mousedown', treeObj.element, li[2].querySelector('.e-fullrow'), 15, 10);
                EventHandler.trigger(treeObj.element, 'mousedown', mousedown);
                let mousemove: any = getEventObject('MouseEvents', 'mousemove', treeObj.element, li[2].querySelector('.e-fullrow'), 15, 70);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                mousemove.srcElement = mousemove.target = mousemove.toElement = li[3].querySelector('.e-fullrow');
                mousemove = setMouseCordinates(mousemove, 15, 75);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                expect(document.querySelector('.e-drop-in')).not.toBe(null);
                let mouseup: any = getEventObject('MouseEvents', 'mouseup', treeObj.element, li[3].querySelector('.e-fullrow'));
                mouseup.type = 'mouseup';
                EventHandler.trigger(<any>(document), 'mouseup', mouseup);
                expect(li[3].childElementCount).toBe(3);
                expect(li[3].children[2].childElementCount).toBe(6);
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    expect(li[3].getAttribute('aria-expanded')).toBe('true');
                    expect(treeObj.getTreeData('02')[0]['nodePid']).toBe('03');
                    done();
                }, 450);
            });
            it('with multi selection', (done: Function) => {
                treeObj.allowMultiSelection = true;
                treeObj.dataBind();
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                mouseEventArgs.ctrlKey = true;
                mouseEventArgs.target = li[0].querySelector('.e-list-text');
                treeObj.touchClickObj.tap(tapEvent);
                mouseEventArgs.target = li[1].querySelector('.e-list-text');
                treeObj.touchClickObj.tap(tapEvent);
                // dragging non active element
                let mousedown: any = getEventObject('MouseEvents', 'mousedown', treeObj.element, li[2].querySelector('.e-list-text'), 15, 10);
                EventHandler.trigger(treeObj.element, 'mousedown', mousedown);
                let mousemove: any = getEventObject('MouseEvents', 'mousemove', treeObj.element, li[2].querySelector('.e-list-text'), 15, 70);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                mousemove.srcElement = mousemove.target = mousemove.toElement = li[1].querySelector('.e-list-text');
                mousemove = setMouseCordinates(mousemove, 15, 75);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                let mouseup: any = getEventObject('MouseEvents', 'mouseup', treeObj.element, li[1].querySelector('.e-list-text'));
                mouseup.type = 'mouseup';
                EventHandler.trigger(<any>(document), 'mouseup', mouseup);
                expect(li[1].childElementCount).toBe(2);
                expect(li[1].children[1].childElementCount).toBe(1);
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    expect(li[1].getAttribute('aria-expanded')).toBe('true');
                    expect(treeObj.getTreeData('02')[0]['nodePid']).toBe('01-01');
                    mouseEventArgs.target = li[2].querySelector('.e-list-text');
                    treeObj.touchClickObj.tap(tapEvent);
                    treeObj.enableRtl = true;
                    treeObj.dataBind();
                    // dragging active element
                    let mousedown1: any = getEventObject('MouseEvents', 'mousedown', treeObj.element, li[0].querySelector('.e-list-text'), 15, 10);
                    EventHandler.trigger(treeObj.element, 'mousedown', mousedown1);
                    let mousemove1: any = getEventObject('MouseEvents', 'mousemove', treeObj.element, li[0].querySelector('.e-list-text'), 15, 70);
                    EventHandler.trigger(<any>(document), 'mousemove', mousemove1);
                    mousemove.srcElement = mousemove.target = mousemove.toElement = li[3].querySelector('.e-list-text');
                    mousemove = setMouseCordinates(mousemove, 15, 75);
                    EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                    let mouseup1: any = getEventObject('MouseEvents', 'mouseup', treeObj.element, li[3].querySelector('.e-list-text'));
                    mouseup.type = 'mouseup';
                    EventHandler.trigger(<any>(document), 'mouseup', mouseup1);
                    expect(li[3].childElementCount).toBe(2);
                    expect(li[3].children[1].childElementCount).toBe(8);
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function() {
                        expect(li[3].getAttribute('aria-expanded')).toBe('true');
                        expect(treeObj.getTreeData('01')[0]['nodePid']).toBe('03');
                        done();
                    }, 450);
                }, 450);
            });
            it('testing with target as text and template concepts', () => {
                let template: Element = createElement('div', { id: 'template' });
                template.innerHTML = '${if(hasChild == undefined)}<b>${nodeText}</b>${else}<i>${nodeText}</i>${/if}';
                treeObj.nodeTemplate = 'template';
                treeObj.dataBind();
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                let mousedown: any = getEventObject('MouseEvents', 'mousedown', treeObj.element, li[2].querySelector('.e-list-text'), 15, 10);
                EventHandler.trigger(treeObj.element, 'mousedown', mousedown);
                let mousemove: any = getEventObject('MouseEvents', 'mousemove', treeObj.element, li[2].querySelector('.e-list-text'), 15, 70);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                mousemove.srcElement = mousemove.target = mousemove.toElement = li[1].querySelector('.e-list-text');
                mousemove = setMouseCordinates(mousemove, 15, 75);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                let mouseup: any = getEventObject('MouseEvents', 'mouseup', treeObj.element, li[1].querySelector('.e-list-text'));
                mouseup.type = 'mouseup';
                EventHandler.trigger(<any>(document), 'mouseup', mouseup);
                expect(li[1].childElementCount).toBe(2);
                expect(li[1].children[1].childElementCount).toBe(1);
                expect(li[1].getAttribute('aria-expanded')).toBe('true');
                expect(li[2].getAttribute('aria-level')).toBe('3');
                treeObj.cssClass = "mytree";
                treeObj.dataBind();
                expect(document.getElementById('tree1').classList.contains('mytree')).toEqual(true);
                treeObj.enableRtl = true;
                treeObj.dataBind();
                expect(document.getElementById('tree1').classList.contains('e-rtl')).toEqual(true);
                treeObj.enableRtl = false;
                treeObj.dataBind();
                expect(document.getElementById('tree1').classList.contains('e-rtl')).toEqual(false);
            });
            it('code coverage', () => {
                expect(document.body.style.cursor).toBe('');
                treeObj.dropObj.out({target:document.body});
                expect(document.body.style.cursor).toBe('not-allowed');
            });
        });
        describe('Drag and drop with different TreeView functionality testing', () => {
            let treeObj: any;
            let treeObj1: any;
            let mouseEventArgs: any;
            let tapEvent: any;
            beforeEach((done: Function): void => {
                mouseEventArgs = {
                    preventDefault: (): void => {},
                    stopImmediatePropagation: (): void => {},
                    target: null,
                    type: null,
                    shiftKey: false,
                    ctrlKey: false
                };
                tapEvent = {
                    originalEvent: mouseEventArgs,
                    tapCount: 1
                };
                treeObj = undefined;
                let ele: HTMLElement = createElement('div', { id: 'tree1' });
                document.body.appendChild(ele);
                treeObj = new TreeView({ 
                    fields: { dataSource: localData1, id: "nodeId", text: "nodeText", parentID: 'nodePid', hasChildren: 'hasChild', navigateUrl: 'nodeUrl', iconCss: 'icons', imageUrl: 'nodeImage1', expanded: 'nodeExpanded1' },
                    allowDragAndDrop: true,
                    fullRowSelect: false,
                    dataBound: ()=> {
                        done();
                    }
                },'#tree1');
                let ele1: HTMLElement = createElement('div', { id: 'tree2' });
                document.body.appendChild(ele1);
                treeObj1 = undefined;
                treeObj1 = new TreeView({ 
                    fields: { dataSource: localData4, id: "nodeId", text: "nodeText", parentID: 'nodePid', hasChildren: 'hasChild', expanded: 'nodeExpanded' },
                    allowDragAndDrop: true,
                    fullRowSelect: false,
                },'#tree2');
            });
            afterEach((): void => {
                if (treeObj)
                    treeObj.destroy();
                if (treeObj1)
                    treeObj1.destroy();
                document.body.innerHTML = '';
            });
            it('testing with target as text', () => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                let newli: Element[] = <Element[] & NodeListOf<Element>>treeObj1.element.querySelectorAll('li');
                let mousedown: any = getEventObject('MouseEvents', 'mousedown', treeObj.element, li[2].querySelector('.e-list-text'), 15, 10);
                EventHandler.trigger(treeObj.element, 'mousedown', mousedown);
                let mousemove: any = getEventObject('MouseEvents', 'mousemove', treeObj.element, li[2].querySelector('.e-list-text'), 15, 70);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                mousemove.srcElement = mousemove.target = mousemove.toElement = newli[0].querySelector('.e-list-text');
                mousemove = setMouseCordinates(mousemove, 15, 75);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                let mouseup: any = getEventObject('MouseEvents', 'mouseup', treeObj1.element, newli[0].querySelector('.e-list-text'));
                mouseup.type = 'mouseup';
                EventHandler.trigger(<any>(document), 'mouseup', mouseup);
                expect(newli[0].childElementCount).toBe(2);
                expect(newli[0].children[1].childElementCount).toBe(1);
                expect(newli[0].getAttribute('aria-expanded')).toBe('true');
                expect(li[2].getAttribute('aria-level')).toBe('2');
                expect(treeObj.getTreeData('02').length).toBe(0);
                expect(treeObj1.getTreeData('02').length).toBe(1);
                expect(treeObj1.getTreeData().length).toBe(7);
            });
        });
    });
    describe('Remote data binding testing', () => {
        describe('Default functionality testing', () => {
            describe('with empty arguments', () => {
                let treeObj: any;
                let ele: HTMLElement = createElement('div', { id: 'tree1' });
                let dataManager1: DataManager = new DataManager({ url: '/TreeView/remoteData' });
                beforeEach((done: Function) => {
                    jasmine.Ajax.install();
                    document.body.appendChild(ele);
                    treeObj = new TreeView({ 
                        fields: { dataSource: dataManager1, id: 'OrderID', text: 'CustomerID', iconCss: 'ShipCity', imageUrl: 'ShipCountry', tooltip: 'ShipName', hasChildren: 'Freight' },
                        dataBound:() => {
                            done();
                        },
                        cssClass: 'customTree productTree',
                    });
                    treeObj.appendTo(ele);
                    this.request = jasmine.Ajax.requests.mostRecent();
                    this.request.respondWith({
                        status: 200,
                        responseText: JSON.stringify({d: [], __count: 0})
                    });
                });
                afterEach(() => {
                    if (ele)
                        ele.remove();
                    document.body.innerHTML = '';
                    jasmine.Ajax.uninstall();
                });
                it('functionality testing', () => {            
                    expect(treeObj.element.querySelectorAll('li').length).toBe(0);
                    expect(document.getElementById('tree1').classList.contains('customTree')).toEqual(true);
                    expect(document.getElementById('tree1').classList.contains('productTree')).toEqual(true);
                });
            });
            describe('Add nodes method', () => {
                let mouseEventArgs: any = {
                    preventDefault: (): void => {},
                    stopImmediatePropagation: (): void => {},
                    target: null,
                    type: null,
                    shiftKey: false,
                    ctrlKey: false
                };
                let tapEvent: any = {
                    originalEvent: mouseEventArgs,
                    tapCount: 1
                };
                let treeObj: any;
                let ele: HTMLElement = createElement('div', { id: 'tree1' });
                let dataManager1: DataManager 
                let originalTimeout: any;
                beforeAll((done: Function) => {
                    jasmine.Ajax.install();
                    dataManager1 = new DataManager({ url: '/TreeView/remoteData', offline: true });
                    this.request = jasmine.Ajax.requests.mostRecent();
                    this.request.respondWith({
                        status: 200,
                        responseText: JSON.stringify({d: remoteData1, __count: 6})
                    });
                    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
                    document.body.appendChild(ele);
                    treeObj = new TreeView({ 
                        fields: { dataSource: dataManager1, id: "nodeId", parentID: 'nodePid', text: "nodeText", iconCss: 'icons', imageUrl: 'nodeImage1' },
                        fullRowSelect: false,
                        dataBound:() => {
                            done();
                        }
                    });
                    treeObj.appendTo(ele);
                    
                });
                afterAll(() => {
                    if (ele)
                    ele.remove();
                    document.body.innerHTML = '';
                    jasmine.Ajax.uninstall();
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
                });
                it('Add nodes testing for remote datasource', (done: Function) => {
                    let data: object = { nodeId: 'a12', nodeText: 'Santa maria' };
                    let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                    li[0].querySelector('.e-text-content').classList.add('e-icons', 'e-icon-expandable');
                    treeObj.addNodes([data], li[0].getAttribute('data-uid'));
                    let element: Element[] = li;
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function () {
                        expect(element[0].querySelector('.e-list-parent').lastElementChild.getAttribute('data-uid')).toBe('a12');
                        done();
                    }, 450);
                });
            });
            describe('with id as number', () => {
                let mouseEventArgs: any = {
                    preventDefault: (): void => {},
                    stopImmediatePropagation: (): void => {},
                    target: null,
                    type: null,
                    shiftKey: false,
                    ctrlKey: false
                };
                let tapEvent: any = {
                    originalEvent: mouseEventArgs,
                    tapCount: 1
                };
                let treeObj: any;
                let ele: HTMLElement = createElement('div', { id: 'tree1' });
                let dataManager1: DataManager = new DataManager({ url: '/TreeView/remoteData' });
                let originalTimeout: any;
                beforeAll((done: Function) => {
                    jasmine.Ajax.install();
                    document.body.appendChild(ele);
                    treeObj = new TreeView({ 
                        fields: { dataSource: dataManager1, id: 'OrderID', text: 'CustomerID', iconCss: 'ShipCity', tooltip: 'ShipName', selected: 'nodeSelected', hasChildren: 'Freight', query: new Query().from("Categories").select("CategoryID,CategoryName,Description").take(7), navigateUrl: 'nodeUrl',
                            child: { dataSource: dataManager1, id: 'CustomerID', text: 'ShipCountry', parentID: 'OrderID', navigateUrl: 'nodeUrl', },
                        },
                        fullRowSelect: false,                        
                        dataBound:() => {
                            done();
                        }
                    });
                    treeObj.appendTo(ele);
                    this.request = jasmine.Ajax.requests.mostRecent();
                    this.request.respondWith({
                        status: 200,
                        responseText: JSON.stringify({d: remoteData, __count: 15})
                    });
                    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                });
                afterAll(() => {
                    if (ele)
                        ele.remove();
                    document.body.innerHTML = '';
                    jasmine.Ajax.uninstall();
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;                
                });
                it('functionality testing', (done: Function) => {            
                    expect(treeObj.element.querySelectorAll('li').length).toBe(15);
                    expect(treeObj.element.querySelector('.e-list-text').innerHTML).toBe('VINET');
                    expect(treeObj.element.querySelector('.e-list-item').getAttribute('data-uid')).toBe('10248');
                    expect(treeObj.element.querySelector('.e-list-icon').classList.contains('Reims')).toBe(true);
                    expect(treeObj.element.querySelector('.e-list-item').title).toBe('Vins et alcools Chevalier');
                    expect(treeObj.element.querySelector('.e-list-item').classList.contains('e-active')).toBe(true);
                    expect(treeObj.element.querySelector('.e-list-item').childElementCount).toBe(1);
                    expect(treeObj.element.querySelector('.e-list-item').querySelector('.e-icons')).not.toBe(null);
                    expect(treeObj.element.querySelector('.e-list-url').href.indexOf('http://npmci.syncfusion.com/')).not.toBe(-1);
                    let newli: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                    mouseEventArgs.target = newli[1].querySelector('.e-icons');
                    expect(newli[1].childElementCount).toBe(1);
                    treeObj.preventContextMenu(mouseEventArgs);
                    treeObj.touchClickObj.tap(tapEvent);
                    this.request = jasmine.Ajax.requests.mostRecent();
                    this.request.respondWith({
                        status: 200,
                        responseText: JSON.stringify({d: [], __count: 0})
                    });
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function() {
                        expect(newli[1].childElementCount).toBe(1);
                        expect(newli[1].querySelector('.e-icons')).toBe(null);                
                        mouseEventArgs.target = newli[0].querySelector('.e-icons');
                        expect(newli[0].childElementCount).toBe(1);
                        treeObj.touchClickObj.tap(tapEvent);
                        expect(newli[0].querySelector('.e-icons').classList.contains('e-icons-spinner')).toBe(true);
                        this.request = jasmine.Ajax.requests.mostRecent();
                        this.request.respondWith({
                            status: 200,
                            responseText: JSON.stringify({d: remoteData, __count: 15})
                        });
                        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                        setTimeout(function() {
                            expect(newli[0].childElementCount).toBe(2);
                            expect(newli[0].querySelector('.e-icons')).not.toBe(null);
                            expect(newli[0].querySelector('.e-icons').classList.contains('e-icons-spinner')).toBe(false);
                            expect((newli[0].querySelector('.e-list-url') as any).href.indexOf('http://npmci.syncfusion.com/')).not.toBe(-1);
                            done();
                        }, 100);
                    }, 100);
                });
            });
            describe('with id as string', () => {
                let mouseEventArgs: any = {
                    preventDefault: (): void => {},
                    stopImmediatePropagation: (): void => {},
                    target: null,
                    type: null,
                    shiftKey: false,
                    ctrlKey: false
                };
                let tapEvent: any = {
                    originalEvent: mouseEventArgs,
                    tapCount: 1
                };
                let treeObj: any;
                let ele: HTMLElement = createElement('div', { id: 'tree1' });
                let dataManager1: DataManager = new DataManager({ url: '/TreeView/remoteData' });
                let originalTimeout: any;
                beforeEach((done: Function) => {
                    jasmine.Ajax.install();
                    document.body.appendChild(ele);
                    treeObj = new TreeView({ 
                        fields: { dataSource: dataManager1, id: 'CustomerID', text: 'OrderID', iconCss: 'ShipCity', tooltip: 'ShipName', hasChildren: 'Freight', tableName: 'Employees', htmlAttributes: 'HtmlAttr', imageUrl: 'Image', selected: 'nodeSelected', navigateUrl: 'nodeUrl',
                            child: { dataSource: dataManager1, id: 'CustomerID', text: 'ShipCountry', parentID: 'OrderID', hasChildren: 'ShipCountry' }
                        },
                        dataBound:() => {
                            done();
                        },
                        fullRowSelect: false,                        
                    });
                    treeObj.appendTo(ele);
                    this.request = jasmine.Ajax.requests.mostRecent();
                    this.request.respondWith({
                        status: 200,
                        responseText: JSON.stringify({d: remoteData, __count: 15})
                    });
                    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                });
                afterEach(() => {
                    if (ele)
                        ele.remove();
                    document.body.innerHTML = '';
                    jasmine.Ajax.uninstall();
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
                });
                it('functionality testing', (done: Function) => {            
                    expect(treeObj.element.querySelectorAll('li').length).toBe(15);
                    expect(treeObj.element.querySelector('.e-list-text').innerHTML).toBe('10248');
                    expect(treeObj.element.querySelector('.e-list-item').getAttribute('data-uid')).toBe('VINET');
                    expect(treeObj.element.querySelector('.e-list-icon').classList.contains('Reims')).toBe(true);                
                    expect(treeObj.element.querySelector('.e-list-img').src.indexOf('images/Shooting.png')).not.toBe(-1);
                    expect(treeObj.element.querySelector('.e-list-item').title).toBe('Vins et alcools Chevalier');
                    expect(treeObj.element.querySelector('.e-list-item').classList.contains('e-active')).toBe(true);
                    expect(treeObj.element.querySelectorAll('li')[2].classList.contains('firstnode')).toBe(true);
                    expect(treeObj.element.querySelectorAll('li')[2].style.backgroundColor).toBe('red');
                    expect(treeObj.element.querySelector('.e-list-item').childElementCount).toBe(1);
                    expect(treeObj.element.querySelector('.e-list-item').querySelector('.e-icons')).not.toBe(null);
                    expect(treeObj.element.querySelector('.e-list-url').href.indexOf('http://npmci.syncfusion.com/')).not.toBe(-1);
                    let newli: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                    mouseEventArgs.target = newli[1].querySelector('.e-icons');
                    expect(newli[1].childElementCount).toBe(1);
                    treeObj.touchClickObj.tap(tapEvent);
                    this.request = jasmine.Ajax.requests.mostRecent();
                    this.request.respondWith({
                        status: 200,
                        responseText: JSON.stringify({d: [], __count: 0})
                    });
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function() {
                        expect(newli[1].childElementCount).toBe(1);
                        expect(newli[1].querySelector('.e-icons')).toBe(null);                
                        mouseEventArgs.target = newli[0].querySelector('.e-icons');
                        expect(newli[0].childElementCount).toBe(1);
                        treeObj.touchClickObj.tap(tapEvent);
                        this.request = jasmine.Ajax.requests.mostRecent();
                        this.request.respondWith({
                            status: 200,
                            responseText: JSON.stringify({d: remoteData, __count: 15})
                        });
                        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                        setTimeout(function() {
                            expect(newli[0].childElementCount).toBe(2);
                            expect(newli[0].querySelector('.e-icons')).not.toBe(null);
                            done();
                        }, 100);
                    }, 100);
                });
            });
            describe('sortOrder property testing', () => {
                let treeObj: any;
                let ele: HTMLElement = createElement('div', { id: 'tree1' });
                let dataManager1: DataManager = new DataManager({ url: '/TreeView/remoteData' });
                beforeEach((done: Function) => {
                    jasmine.Ajax.install();
                    document.body.appendChild(ele);
                    treeObj = new TreeView({ 
                        fields: { dataSource: dataManager1, id: "nodeId", parentID: 'nodePid', text: "nodeText", hasChildren: "hasChild", 
                            iconCss: 'nodeIcon', imageUrl: 'nodeImage', tooltip: 'nodeTooltip', htmlAttributes: 'nodeHtmlAttr', selected: 'nodeSelected' 
                        },
                        dataBound:() => {
                            done();
                        },
                    });
                    treeObj.appendTo(ele);
                    this.request = jasmine.Ajax.requests.mostRecent();
                    this.request.respondWith({
                        status: 200,
                        responseText: JSON.stringify({d: remoteData2, __count: 2})
                    });
                });
                afterEach(() => {
                    if (ele)
                        ele.remove();
                    document.body.innerHTML = '';
                    jasmine.Ajax.uninstall();
                });
                it('functionality testing', (done: Function) => {
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function() {
                        expect(treeObj.element.querySelectorAll('li').length).toBe(2);
                        expect(treeObj.element.querySelector('.e-list-text').innerHTML).toBe('Music');
                        expect(treeObj.element.querySelector('.e-list-item').getAttribute('data-uid')).toBe('01');
                        done();
                    }, 100);
                });
            });
            describe('expandedNodes property testing', () => {
                let treeObj: any;
                let ele: HTMLElement = createElement('div', { id: 'tree1' });
                let dataManager1: DataManager = new DataManager({ url: '/TreeView/remoteData' });
                beforeEach((done: Function) => {
                    jasmine.Ajax.install();
                    document.body.appendChild(ele);
                    treeObj = new TreeView({
                        expandedNodes: ['02', '99'],
                        fields: { dataSource: dataManager1, id: "nodeId", parentID: 'nodePid', text: "nodeText", hasChildren: "hasChild", 
                            iconCss: 'nodeIcon', imageUrl: 'nodeImage', tooltip: 'nodeTooltip', htmlAttributes: 'nodeHtmlAttr', selected: 'nodeSelected' 
                        },
                        dataBound:() => {
                            done();
                        },
                    });
                    treeObj.appendTo(ele);
                    this.request = jasmine.Ajax.requests.mostRecent();
                    this.request.respondWith({
                        status: 200,
                        responseText: JSON.stringify({d: remoteData2, __count: 2})
                    });
                });
                afterEach(() => {
                    if (ele)
                        ele.remove();
                    document.body.innerHTML = '';
                    jasmine.Ajax.uninstall();
                });
                it('functionality testing', (done: Function) => {
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function() {
                        expect(treeObj.element.querySelectorAll('li').length).toBe(2);
                        expect(treeObj.expandedNodes.length).toBe(0);
                        done();
                    }, 100);
                });
            });
            describe('allowEditing property testing', () => {
                let mouseEventArgs: any = {
                    preventDefault: (): void => {},
                    stopImmediatePropagation: (): void => {},
                    target: null,
                    type: null,
                    shiftKey: false,
                    ctrlKey: false
                };
                let tapEvent: any = {
                    originalEvent: mouseEventArgs,
                    tapCount: 1
                };
                let treeObj: any;
                let ele: HTMLElement = createElement('div', { id: 'tree1' });
                let dataManager1: DataManager = new DataManager({ url: '/TreeView/remoteData' , updateUrl: 'TreeView/Update'});
                beforeEach((done: Function) => {
                    jasmine.Ajax.install();
                    document.body.appendChild(ele);
                    treeObj = new TreeView({ 
                        fields: { dataSource: dataManager1, id: "nodeId", parentID: 'nodePid', text: "nodeText", hasChildren: "hasChild", 
                            tooltip: 'nodeTooltip', selected: 'nodeSelected' 
                        },
                        allowEditing: true,
                        fullRowSelect: false,
                        dataBound:() => {
                            done();
                        },
                    });
                    treeObj.appendTo(ele);
                    this.request = jasmine.Ajax.requests.mostRecent();
                    this.request.respondWith({
                        status: 200,
                        responseText: JSON.stringify({d: remoteData2, __count: 2})
                    });
                });
                afterEach(() => {
                    if (ele)
                        ele.remove();
                    document.body.innerHTML = '';
                    jasmine.Ajax.uninstall();
                });
                it('functionality testing', (done: Function) => {
                    let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                    expect(li[0].querySelector('.e-icons').classList.contains('e-icon-expandable')).toBe(true);
                    expect(li[0].querySelector('.e-icons').classList.contains('e-icon-collapsible')).toBe(false);
                    expect(li[0].childElementCount).toBe(1);
                    expect(li[0].querySelector('.e-list-text').childElementCount).toBe(0);
                    tapEvent.tapCount = 2;
                    mouseEventArgs.target = li[0].querySelector('.e-list-text');
                    treeObj.touchExpandObj.tap(tapEvent);
                    treeObj.touchEditObj.tap(tapEvent);
                    this.request = jasmine.Ajax.requests.mostRecent();
                    this.request.respondWith({
                        status: 200,
                        responseText: JSON.stringify({ d: remoteData2_1, __count: 2 })
                    });
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function () {
                        expect(li[0].querySelector('.e-icons').classList.contains('e-icon-expandable')).toBe(false);
                        expect(li[0].querySelector('.e-icons').classList.contains('e-icon-collapsible')).toBe(true);
                        expect(li[0].childElementCount).toBe(2);
                        expect(li[0].querySelector('.e-list-text').childElementCount).toBe(1);
                        expect(li[0].querySelector('.e-input').nodeName).toBe('INPUT');
                        expect((li[0].querySelector('.e-input') as HTMLInputElement).value).toBe('Music');
                        (li[0].querySelector('.e-input') as HTMLInputElement).value = 'Music node';
                        (li[0].querySelector('.e-input') as HTMLInputElement).blur();
                        this.request = jasmine.Ajax.requests.mostRecent();
                        this.request.respondWith({
                            status: 200,
                            responseText: JSON.stringify({ d: updatedremoteNode_3, __count: 2 })
                        });
                        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                        setTimeout(function () {
                            expect(li[0].querySelector('.e-list-text').childElementCount).toBe(0);
                            expect((li[0].querySelector('.e-list-text') as HTMLElement).childNodes[0].nodeValue).toBe('Music node');
                            mouseEventArgs.target = li[0].querySelector('.e-list-text');
                            treeObj.touchExpandObj.tap(tapEvent);
                            treeObj.touchEditObj.tap(tapEvent);
                            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                            setTimeout(function () {
                                expect((li[0].querySelector('.e-input') as HTMLInputElement).value).toBe('Music node');
                                (li[0].querySelector('.e-input') as HTMLInputElement).value = 'Music';
                                (li[0].querySelector('.e-input') as HTMLInputElement).blur();
                                this.request = jasmine.Ajax.requests.mostRecent();
                                this.request.respondWith({
                                    status: 200,
                                    responseText: JSON.stringify({ d: updatedremoteNode_2, __count: 2 })
                                });
                                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                                setTimeout(function () {
                                    expect(li[0].querySelector('.e-list-text').childElementCount).toBe(0);
                                    expect((li[0].querySelector('.e-list-text') as HTMLElement).childNodes[0].nodeValue).toBe('Music');
                                    done();
                                }, 450);
                            }, 450);
                        }, 450);
                    }, 450);
                });
            });
            describe('enableRtl property testing', () => {
                let treeObj: any;
                let ele: HTMLElement = createElement('div', { id: 'tree1' });
                let dataManager1: DataManager = new DataManager({ url: '/TreeView/remoteData' });
                beforeEach((done: Function) => {
                    jasmine.Ajax.install();
                    document.body.appendChild(ele);
                    treeObj = new TreeView({ 
                        fields: { dataSource: dataManager1, id: "nodeId", parentID: 'nodePid', text: "nodeText", hasChildren: "hasChild", 
                            tooltip: 'nodeTooltip', selected: 'nodeSelected' 
                        },
                        enableRtl: true,
                        dataBound:() => {
                            done();
                        },
                    });
                    treeObj.appendTo(ele);
                    this.request = jasmine.Ajax.requests.mostRecent();
                    this.request.respondWith({
                        status: 200,
                        responseText: JSON.stringify({d: remoteData2, __count: 2})
                    });
                });
                afterEach(() => {
                    if (ele)
                        ele.remove();
                    document.body.innerHTML = '';
                    jasmine.Ajax.uninstall();
                });
                it('functionality testing', (done: Function) => {
                    expect(treeObj.element.classList.contains('e-rtl')).toBe(true);
                    done();
                }, 100);
            });
            describe('allowDragAndDrop property testing', () => {
                let treeObj: any;
                let ele: HTMLElement = createElement('div', { id: 'tree1' });
                let dataManager1: DataManager = new DataManager({ url: '/TreeView/remoteData' });
                beforeEach((done: Function) => {
                    jasmine.Ajax.install();
                    document.body.appendChild(ele);
                    treeObj = new TreeView({ 
                        fields: { dataSource: dataManager1, id: "nodeId", parentID: 'nodePid', text: "nodeText", hasChildren: "hasChild", 
                            tooltip: 'nodeTooltip', selected: 'nodeSelected' 
                        },
                        allowDragAndDrop: true,
                        dataBound:() => {
                            done();
                        },
                    });
                    treeObj.appendTo(ele);
                    this.request = jasmine.Ajax.requests.mostRecent();
                    this.request.respondWith({
                        status: 200,
                        responseText: JSON.stringify({d: remoteData2, __count: 2})
                    });
                });
                afterEach(() => {
                    if (ele)
                        ele.remove();
                    document.body.innerHTML = '';
                    jasmine.Ajax.uninstall();
                });
                it('functionality testing', (done: Function) => {
                    expect(treeObj.dragObj).not.toBe(undefined);
                    expect(treeObj.dropObj).not.toBe(undefined);
                    let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                    let mousedown: any = getEventObject('MouseEvents', 'mousedown', treeObj.element, li[0].querySelector('.e-list-text'), 15, 10);
                    EventHandler.trigger(treeObj.element, 'mousedown', mousedown);
                    let mousemove: any = getEventObject('MouseEvents', 'mousemove', treeObj.element, li[0].querySelector('.e-list-text'), 15, 70);
                    EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                    mousemove.srcElement = mousemove.target = mousemove.toElement = li[0].querySelector('.e-list-text');
                    mousemove = setMouseCordinates(mousemove, 15, 75);
                    EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                    let mouseup: any = getEventObject('MouseEvents', 'mouseup', treeObj.element, li[0].querySelector('.e-list-text'));
                    mouseup.type = 'mouseup';
                    EventHandler.trigger(<any>(document), 'mouseup', mouseup);
                    done();
                }, 100);
            });
            describe('fullRowSelect property testing', () => {
                let treeObj: any;
                let ele: HTMLElement = createElement('div', { id: 'tree1' });
                let dataManager1: DataManager = new DataManager({ url: '/TreeView/remoteData' });
                beforeEach((done: Function) => {
                    jasmine.Ajax.install();
                    document.body.appendChild(ele);
                    treeObj = new TreeView({ 
                        fields: { dataSource: dataManager1, id: "nodeId", parentID: 'nodePid', text: "nodeText", hasChildren: "hasChild", 
                            tooltip: 'nodeTooltip', selected: 'nodeSelected' 
                        },
                        dataBound:() => {
                            done();
                        },
                    });
                    treeObj.appendTo(ele);
                    this.request = jasmine.Ajax.requests.mostRecent();
                    this.request.respondWith({
                        status: 200,
                        responseText: JSON.stringify({d: remoteData2, __count: 2})
                    });
                });
                afterEach(() => {
                    if (ele)
                        ele.remove();
                    document.body.innerHTML = '';
                    jasmine.Ajax.uninstall();
                });
                it('functionality testing', (done: Function) => {
                    expect(treeObj.element.classList.contains('e-fullrow-wrap')).toBe(true);
                    let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                    expect(li[0].childElementCount).toBe(2);
                    done();
                }, 100);
            });
            describe('allowMultiSelection property testing', () => {
                let mouseEventArgs: any = {
                    preventDefault: (): void => {},
                    stopImmediatePropagation: (): void => {},
                    target: null,
                    type: null,
                    shiftKey: false,
                    ctrlKey: false
                };
                let tapEvent: any = {
                    originalEvent: mouseEventArgs,
                    tapCount: 1
                };
                let treeObj: any;
                let ele: HTMLElement = createElement('div', { id: 'tree1' });
                let dataManager1: DataManager = new DataManager({ url: '/TreeView/remoteData' });
                beforeEach((done: Function) => {
                    jasmine.Ajax.install();
                    document.body.appendChild(ele);
                    treeObj = new TreeView({ 
                        fields: { dataSource: dataManager1, id: "nodeId", parentID: 'nodePid', text: "nodeText", hasChildren: "hasChild", 
                            tooltip: 'nodeTooltip', selected: 'nodeSelected'
                        },
                        allowMultiSelection: true,
                        dataBound:() => {
                            done();
                        },
                    });
                    treeObj.appendTo(ele);
                    this.request = jasmine.Ajax.requests.mostRecent();
                    this.request.respondWith({
                        status: 200,
                        responseText: JSON.stringify({d: remoteData1_1, __count: 5})
                    });
                });
                afterEach(() => {
                    if (ele)
                        ele.remove();
                    document.body.innerHTML = '';
                    jasmine.Ajax.uninstall();
                });
                it('functionality testing', (done: Function) => {
                    let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                    expect(li[0].classList.contains('e-active')).toBe(true);
                    expect(li[3].classList.contains('e-active')).toBe(true);
                    mouseEventArgs.ctrlKey = true;
                    mouseEventArgs.target = li[1].querySelector('.e-list-text');
                    treeObj.touchClickObj.tap(tapEvent);
                    expect(li[0].classList.contains('e-active')).toBe(true);
                    expect(li[3].classList.contains('e-active')).toBe(true);
                    expect(li[1].classList.contains('e-active')).toBe(true);
                    mouseEventArgs.target = li[3].querySelector('.e-list-text');
                    treeObj.touchClickObj.tap(tapEvent);
                    mouseEventArgs.target = li[1].querySelector('.e-list-text');
                    treeObj.touchClickObj.tap(tapEvent);
                    expect(li[0].classList.contains('e-active')).toBe(true);
                    expect(li[1].classList.contains('e-active')).toBe(false);
                    expect(li[3].classList.contains('e-active')).toBe(false);
                    mouseEventArgs.ctrlKey = false;
                    mouseEventArgs.shiftKey = true;
                    mouseEventArgs.target = li[3].querySelector('.e-list-text');
                    treeObj.touchClickObj.tap(tapEvent);
                    expect(li[0].classList.contains('e-active')).toBe(false);
                    expect(li[1].classList.contains('e-active')).toBe(true);
                    expect(li[2].classList.contains('e-active')).toBe(true);
                    expect(li[3].classList.contains('e-active')).toBe(true);
                    done();
                }, 100);
            });
            describe('template support testing with draw event', () => {
                let treeObj: any;
                let ele: HTMLElement = createElement('div', { id: 'tree1' });
                let dataManager1: DataManager = new DataManager({ url: '/TreeView/remoteData' });
                beforeEach((done: Function) => {
                    jasmine.Ajax.install();
                    document.body.appendChild(ele);
                    treeObj = new TreeView({ 
                        fields: { dataSource: dataManager1, id: "nodeId", parentID: 'nodePid', text: "nodeText", hasChildren: "hasChild", 
                            tooltip: 'nodeTooltip', selected: 'nodeSelected' 
                        },
                        drawNode: (args) => {
                            var rowDiv = document.createElement('span');
                            if (!args.node.querySelector('.e-icons')) {
                                rowDiv.className += 'child';
                            } else {
                                rowDiv.className += 'parent';
                            }
                            args.node.children[1].appendChild(rowDiv);
                        },
                        dataBound:() => {
                            done();
                        },
                    });
                    treeObj.appendTo(ele);
                    this.request = jasmine.Ajax.requests.mostRecent();
                    this.request.respondWith({
                        status: 200,
                        responseText: JSON.stringify({d: remoteData2, __count: 2})
                    });
                });
                afterEach(() => {
                    if (ele)
                        ele.remove();
                    document.body.innerHTML = '';
                    jasmine.Ajax.uninstall();
                });
                it('functionality testing', (done: Function) => {
                    let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-text-content');
                    expect(li[0].querySelector('.parent')).not.toBe(null);
                    expect(li[0].querySelector('.child')).toBe(null);
                    done();
                }, 4450);
            });
            describe('template support testing with string', () => {
                let treeObj: any;
                let ele: HTMLElement = createElement('div', { id: 'tree1' });
                let dataManager1: DataManager = new DataManager({ url: '/TreeView/remoteData' });
                beforeEach((done: Function) => {
                    jasmine.Ajax.install();
                    document.body.appendChild(ele);
                    treeObj = new TreeView({ 
                        fields: { dataSource: dataManager1, id: "nodeId", parentID: 'nodePid', text: "nodeText", hasChildren: "hasChild", 
                            tooltip: 'nodeTooltip', selected: 'nodeSelected' 
                        },
                        nodeTemplate: '${if(hasChild == undefined)}<b>${nodeText}</b>${else}<i>${nodeText}</i>${/if}',
                        dataBound:() => {
                            done();
                        },
                    });
                    treeObj.appendTo(ele);
                    this.request = jasmine.Ajax.requests.mostRecent();
                    this.request.respondWith({
                        status: 200,
                        responseText: JSON.stringify({d: remoteData2, __count: 2})
                    });
                });
                afterEach(() => {
                    if (ele)
                        ele.remove();
                    document.body.innerHTML = '';
                    jasmine.Ajax.uninstall();
                });
                it('functionality testing', (done: Function) => {
                    let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-text-content');
                    expect(li[0].querySelector('i')).not.toBe(null);
                    expect(li[0].querySelector('b')).toBe(null);
                    expect(li[1].querySelector('b')).not.toBe(null);
                    expect(li[1].querySelector('i')).toBe(null);
                    done();
                }, 4450);
            });
            describe('template support testing with script', () => {
                let mouseEventArgs: any = {
                    preventDefault: (): void => {},
                    stopImmediatePropagation: (): void => {},
                    target: null,
                    type: null,
                    shiftKey: false,
                    ctrlKey: false
                };
                let tapEvent: any = {
                    originalEvent: mouseEventArgs,
                    tapCount: 1
                };
                let treeObj: any;
                let dataManager1: DataManager = new DataManager({ url: '/TreeView/remoteData' });
                let ele: HTMLElement = createElement('div', { id: 'tree1' });
                beforeEach((done: Function) => {
                    jasmine.Ajax.install();
                    document.body.appendChild(ele);
                    let template: Element = createElement('div', { id: 'template' });
                    template.innerHTML = '${if(hasChild == undefined)}<b>${nodeText}</b>${else}<i>${nodeText}</i>${/if}';
                    document.body.appendChild(template);  
                    treeObj = new TreeView({ 
                        fields: { dataSource: dataManager1, id: "nodeId", parentID: 'nodePid', text: "nodeText", hasChildren: "hasChild", 
                            tooltip: 'nodeTooltip', selected: 'nodeSelected',
                            child: { dataSource: dataManager1, id: "nodeId", parentID: 'nodePid', text: "nodeText", }
                        },
                        nodeTemplate: '#template',
                        allowEditing: true,
                        dataBound:() => {
                            done();
                        },
                    });
                    treeObj.appendTo(ele);
                    this.request = jasmine.Ajax.requests.mostRecent();
                    this.request.respondWith({
                        status: 200,
                        responseText: JSON.stringify({d: remoteData2, __count: 2})
                    });
                });
                afterEach(() => {
                    if (ele)
                        ele.remove();
                    document.body.innerHTML = '';
                    jasmine.Ajax.uninstall();
                });
                it('functionality testing', (done: Function) => {
                    let txt: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-text-content');
                    expect(txt[0].querySelector('i')).not.toBe(null);
                    expect(txt[0].querySelector('b')).toBe(null);
                    expect(txt[1].querySelector('b')).not.toBe(null);
                    expect(txt[1].querySelector('i')).toBe(null);
                    let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                    tapEvent.tapCount = 2;
                    mouseEventArgs.target = li[0].querySelector('.e-list-text');
                    treeObj.touchExpandObj.tap(tapEvent);
                    treeObj.touchEditObj.tap(tapEvent);
                    this.request = jasmine.Ajax.requests.mostRecent();
                    this.request.respondWith({
                        status: 200,
                        responseText: JSON.stringify({ d: remoteData2, __count: 2 })
                    });
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function () {
                        expect(li[0].querySelector('.e-list-text').childElementCount).toBe(1);
                        expect(li[0].querySelector('.e-input').nodeName).toBe('INPUT');
                        expect((li[0].querySelector('.e-input') as HTMLInputElement).value).toBe('Music');
                        (li[0].querySelector('.e-input') as HTMLInputElement).value = 'Music node';
                        (li[0].querySelector('.e-input') as HTMLInputElement).blur();
                        this.request = jasmine.Ajax.requests.mostRecent();
                        this.request.respondWith({
                            status: 200,
                            responseText: JSON.stringify({ d: updatedremoteNode_3, __count: 1 })
                        });
                        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                        setTimeout(function () {
                            expect(li[0].querySelector('.e-list-text').childElementCount).toBe(1);
                            expect((li[0].querySelector('.e-list-text') as HTMLElement).textContent).toBe('Music node');
                            let nli: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                            mouseEventArgs.target = nli[2].querySelector('.e-list-text');
                            treeObj.touchExpandObj.tap(tapEvent);
                            treeObj.touchEditObj.tap(tapEvent);
                            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                            setTimeout(function () {
                                expect((nli[2].querySelector('.e-input') as HTMLInputElement).value).toBe('Downloads');
                                (nli[2].querySelector('.e-input') as HTMLInputElement).value = 'Downloads1';
                                (nli[2].querySelector('.e-input') as HTMLInputElement).blur();
                                this.request = jasmine.Ajax.requests.mostRecent();
                                this.request.respondWith({
                                    status: 200,
                                    responseText: JSON.stringify({ d: updatedremoteNode_4, __count: 1 })
                                });
                                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                                setTimeout(function () {
                                    expect(nli[2].querySelector('.e-list-text').childElementCount).toBe(1);
                                    expect((nli[2].querySelector('.e-list-text') as HTMLElement).textContent).toBe('Downloads1');
                                    mouseEventArgs.target = nli[2].querySelector('.e-list-text');
                                    treeObj.touchExpandObj.tap(tapEvent);
                                    treeObj.touchEditObj.tap(tapEvent);
                                    expect((nli[2].querySelector('.e-input') as HTMLInputElement).value).toBe('Downloads1');
                                    (nli[2].querySelector('.e-input') as HTMLInputElement).value = 'Downloads';
                                    (nli[2].querySelector('.e-input') as HTMLInputElement).blur();
                                    this.request = jasmine.Ajax.requests.mostRecent();
                                    this.request.respondWith({
                                        status: 200,
                                        responseText: JSON.stringify({ d: updatedremoteNode_5, __count: 1 })
                                    });
                                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                                    setTimeout(function () {
                                        expect(nli[2].querySelector('.e-list-text').childElementCount).toBe(1);
                                        expect((nli[2].querySelector('.e-list-text') as HTMLElement).textContent).toBe('Downloads');
                                        mouseEventArgs.target = li[0].querySelector('.e-list-text');
                                        treeObj.touchExpandObj.tap(tapEvent);
                                        treeObj.touchEditObj.tap(tapEvent);
                                        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                                        setTimeout(function () {
                                            expect((li[0].querySelector('.e-input') as HTMLInputElement).value).toBe('Music node');
                                            (li[0].querySelector('.e-input') as HTMLInputElement).value = 'Music';
                                            (li[0].querySelector('.e-input') as HTMLInputElement).blur();
                                            this.request = jasmine.Ajax.requests.mostRecent();
                                            this.request.respondWith({
                                                status: 200,
                                                responseText: JSON.stringify({ d: updatedremoteNode_2, __count: 1 })
                                            });
                                            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                                            setTimeout(function () {
                                                expect(li[0].querySelector('.e-list-text').childElementCount).toBe(1);
                                                expect((li[0].querySelector('.e-list-text') as HTMLElement).textContent).toBe('Music');
                                                done();
                                            }, 450);
                                        }, 450);
                                    }, 450);
                                }, 450);
                            }, 450);
                        }, 450);
                    },450 );
                },4450);
            });
        });

         describe('Remote data Offline', () => {
                let mouseEventArgs: any = {
                    preventDefault: (): void => {},
                    stopImmediatePropagation: (): void => {},
                    target: null,
                    type: null,
                    shiftKey: false,
                    ctrlKey: false
                };
                let tapEvent: any = {
                    originalEvent: mouseEventArgs,
                    tapCount: 1
                };
                let treeObj: any;
                let ele: HTMLElement = createElement('div', { id: 'tree1' });
                let dataManager1: DataManager;
                beforeAll((done: Function) => {
                    jasmine.Ajax.install();
                    dataManager1 = new DataManager({ url: '/TreeView/remoteData', offline: true })
                     this.request = jasmine.Ajax.requests.mostRecent();
                    this.request.respondWith({
                        status: 200,
                        responseText: JSON.stringify({d: remoteData3_1, __count: 2})
                    });
                    let dataBound: EmitType<Object> = () => { done(); };
                    document.body.appendChild(ele);
                    treeObj = new TreeView({ 
                        fields: { dataSource: dataManager1, id: 'nodeId', text: 'nodeText', iconCss: 'nodeIcon', imageUrl: 'nodeImage', tooltip: 'nodeTooltip',child: 'nodeChild'
                        },
                        fullRowSelect: false,
                        dataBound: dataBound
                    });
                    treeObj.appendTo('#tree1');
                   
                });
                afterAll(() => {
                    if (ele)
                        ele.remove();
                    document.body.innerHTML = '';
                    jasmine.Ajax.uninstall();
                });
                it('Offline mode testing', (done: Function) => {
                    let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                    expect(li[0].querySelector('.e-icons').classList.contains('e-icon-expandable')).toBe(true);
                    expect(li[0].querySelector('.e-icons').classList.contains('e-icon-collapsible')).toBe(false);
                    expect(li[0].childElementCount).toBe(1);
                    expect(li[0].querySelector('.e-list-text').childElementCount).toBe(0);
                    tapEvent.tapCount = 2;
                    mouseEventArgs.target = li[0].querySelector('.e-list-text');
                    treeObj.touchExpandObj.tap(tapEvent);
                    setTimeout(function() {
                        expect(li[0].querySelector('.e-icons').classList.contains('e-icon-expandable')).toBe(false);
                        expect(li[0].querySelector('.e-icons').classList.contains('e-icon-collapsible')).toBe(true);
                        expect(li[0].childElementCount).toBe(2);
                        expect(treeObj.getTreeData('01')[0].nodeChild[0].nodeText).toBe('Gouttes.mp3');
                        done();
                    }, 450);
                    tapEvent.tapCount = 2;
                    mouseEventArgs.target = li[1].querySelector('.e-list-text');
                    treeObj.touchExpandObj.tap(tapEvent);
                    setTimeout(function() {
                        expect(li[1].querySelector('.e-icons').classList.contains('e-icon-expandable')).toBe(false);
                        expect(li[1].querySelector('.e-icons').classList.contains('e-icon-collapsible')).toBe(true);
                        expect(li[1].childElementCount).toBe(2);
                        expect(treeObj.getTreeData('02')[0].nodeChild.length).toBe(2);
                        done();
                    }, 450);
                });
            });
            
        describe('property change testing', () => {
            let mouseEventArgs: any;
            let tapEvent: any;
            let treeObj: any;
            let dataManager1: DataManager = new DataManager({ url: '/TreeView/remoteData', updateUrl: '/TreeView/Update' });
            let dataManager2: DataManager = new DataManager({ url: '/TreeView/remoteData2', updateUrl: '/TreeView/Update' });
            let originalTimeout: any;
            beforeEach((done: Function) => {
                mouseEventArgs = {
                    preventDefault: (): void => {},
                    stopImmediatePropagation: (): void => {},
                    target: null,
                    type: null,
                    shiftKey: false,
                    ctrlKey: false
                };
                tapEvent = {
                    originalEvent: mouseEventArgs,
                    tapCount: 1
                };
                jasmine.Ajax.install();
                let ele: HTMLElement = createElement('div', { id: 'tree1' });
                document.body.appendChild(ele);
                treeObj = new TreeView({ 
                    fields: { dataSource: dataManager1, id: "nodeId", parentID: 'nodePid', text: "nodeText", hasChildren: "hasChild", navigateUrl: 'nodeUrl',
                        iconCss: 'nodeIcon', imageUrl: 'nodeImage', tooltip: 'nodeTooltip', htmlAttributes: 'nodeHtmlAttr', selected: 'nodeSelected' 
                    },
                    dataBound:() => {
                        done();
                    },
                    cssClass: 'customTree productTree',
                    fullRowSelect: false,
                });
                treeObj.appendTo(ele);
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify({d: remoteData2, __count: 2})
                });
                originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            });
            afterEach(() => {
                if (treeObj)
                    treeObj.destroy();
                document.body.innerHTML = '';
                jasmine.Ajax.uninstall();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            });
            it('dataSource property', (done: Function) => {
                expect(treeObj.element.querySelectorAll('li').length).toBe(2);
                expect(treeObj.element.querySelector('.e-list-text').innerHTML).toBe('Music');
                expect(treeObj.element.querySelector('.e-list-item').getAttribute('data-uid')).toBe('01');
                expect(treeObj.element.querySelector('.e-list-icon').classList.contains('folder')).toBe(true);
                expect(treeObj.element.querySelector('.e-list-img').src.indexOf('images/Shooting.png')).not.toBe(-1);
                expect(treeObj.element.querySelector('.e-list-item').title).toBe('This is Music node');
                expect(treeObj.element.querySelectorAll('li')[1].classList.contains('firstnode')).toBe(true);
                expect(treeObj.element.querySelectorAll('li')[1].style.backgroundColor).toBe('red');
                treeObj.fields.dataSource = dataManager2;
                treeObj.dataBind();
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify({d: remoteData1_1, __count: 2})
                });
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    expect(treeObj.element.querySelectorAll('li').length).toBe(5);
                    expect(treeObj.element.querySelector('.e-list-text').innerHTML).toBe('Music');
                    expect(treeObj.element.querySelector('.e-list-item').getAttribute('data-uid')).toBe('01');
                    expect(treeObj.element.querySelector('.e-list-icon').classList.contains('folder')).toBe(true);
                    expect(treeObj.element.querySelector('.e-list-img').src.indexOf('images/Shooting.png')).not.toBe(-1);
                    expect(treeObj.element.querySelector('.e-list-item').title).toBe('This is Music node');
                    expect(treeObj.element.querySelectorAll('li')[1].classList.contains('firstnode')).toBe(true);
                    expect(treeObj.element.querySelectorAll('li')[1].style.backgroundColor).toBe('red');
                    done();
                },100)
            });
            it('fields text property', (done: Function) => {
                expect(treeObj.element.querySelector('.e-list-text').innerHTML).toBe('Music');
                expect(treeObj.element.querySelector('.e-list-item').getAttribute('data-uid')).toBe('01');
                expect(treeObj.element.querySelector('.e-list-icon').classList.contains('folder')).toBe(true);
                expect(treeObj.element.querySelector('.e-list-img').src.indexOf('images/Shooting.png')).not.toBe(-1);
                expect(treeObj.element.querySelector('.e-list-item').title).toBe('This is Music node');
                expect(treeObj.element.querySelectorAll('li')[1].classList.contains('firstnode')).toBe(true);
                expect(treeObj.element.querySelectorAll('li')[1].style.backgroundColor).toBe('red');
                treeObj.fields = { text: 'subText' };
                treeObj.dataBind();
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify({d: remoteData2, __count: 2})
                });
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    expect(treeObj.element.querySelector('.e-list-text').innerHTML).toBe('Pictures');
                    expect(treeObj.element.querySelector('.e-list-item').getAttribute('data-uid')).toBe('01');
                    expect(treeObj.element.querySelector('.e-list-icon').classList.contains('folder')).toBe(true);
                    expect(treeObj.element.querySelector('.e-list-img').src.indexOf('images/Shooting.png')).not.toBe(-1);
                    expect(treeObj.element.querySelector('.e-list-item').title).toBe('This is Music node');
                    expect(treeObj.element.querySelectorAll('li')[1].classList.contains('firstnode')).toBe(true);
                    expect(treeObj.element.querySelectorAll('li')[1].style.backgroundColor).toBe('red');
                    done();
                }, 100);
            });
            it('fields id property', (done: Function) => {
                expect(treeObj.element.querySelector('.e-list-text').innerHTML).toBe('Music');
                expect(treeObj.element.querySelector('.e-list-item').getAttribute('data-uid')).toBe('01');
                expect(treeObj.element.querySelector('.e-list-icon').classList.contains('folder')).toBe(true);
                expect(treeObj.element.querySelector('.e-list-img').src.indexOf('images/Shooting.png')).not.toBe(-1);
                expect(treeObj.element.querySelector('.e-list-item').title).toBe('This is Music node');
                expect(treeObj.element.querySelectorAll('li')[1].classList.contains('firstnode')).toBe(true);
                expect(treeObj.element.querySelectorAll('li')[1].style.backgroundColor).toBe('red');
                treeObj.fields = { id: 'subId' };
                treeObj.dataBind();
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify({d: remoteData2, __count: 2})
                });
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    expect(treeObj.element.querySelector('.e-list-text').innerHTML).toBe('Music');
                    expect(treeObj.element.querySelector('.e-list-item').getAttribute('data-uid')).toBe('21');
                    expect(treeObj.element.querySelector('.e-list-icon').classList.contains('folder')).toBe(true);
                    expect(treeObj.element.querySelector('.e-list-img').src.indexOf('images/Shooting.png')).not.toBe(-1);
                    expect(treeObj.element.querySelector('.e-list-item').title).toBe('This is Music node');
                    expect(treeObj.element.querySelectorAll('li')[1].classList.contains('firstnode')).toBe(true);
                    expect(treeObj.element.querySelectorAll('li')[1].style.backgroundColor).toBe('red');
                    done();
                }, 100);
            });
            it('fields iconCss property', (done: Function) => {
                expect(treeObj.element.querySelector('.e-list-text').innerHTML).toBe('Music');
                expect(treeObj.element.querySelector('.e-list-item').getAttribute('data-uid')).toBe('01');
                expect(treeObj.element.querySelector('.e-list-icon').classList.contains('folder')).toBe(true);
                expect(treeObj.element.querySelector('.e-list-img').src.indexOf('images/Shooting.png')).not.toBe(-1);
                expect(treeObj.element.querySelector('.e-list-item').title).toBe('This is Music node');
                expect(treeObj.element.querySelectorAll('li')[1].classList.contains('firstnode')).toBe(true);
                expect(treeObj.element.querySelectorAll('li')[1].style.backgroundColor).toBe('red');
                treeObj.fields = { iconCss: 'subIcon' };
                treeObj.dataBind();
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify({d: remoteData2, __count: 2})
                });
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    expect(treeObj.element.querySelector('.e-list-text').innerHTML).toBe('Music');
                    expect(treeObj.element.querySelector('.e-list-item').getAttribute('data-uid')).toBe('01');
                    expect(treeObj.element.querySelector('.e-list-icon').classList.contains('file')).toBe(true);
                    expect(treeObj.element.querySelector('.e-list-img').src.indexOf('images/Shooting.png')).not.toBe(-1);
                    expect(treeObj.element.querySelector('.e-list-item').title).toBe('This is Music node');
                    expect(treeObj.element.querySelectorAll('li')[1].classList.contains('firstnode')).toBe(true);
                    expect(treeObj.element.querySelectorAll('li')[1].style.backgroundColor).toBe('red');
                    done();
                }, 100);
            });
            it('fields imageUrl property', (done: Function) => {
                expect(treeObj.element.querySelector('.e-list-text').innerHTML).toBe('Music');
                expect(treeObj.element.querySelector('.e-list-item').getAttribute('data-uid')).toBe('01');
                expect(treeObj.element.querySelector('.e-list-icon').classList.contains('folder')).toBe(true);
                expect(treeObj.element.querySelector('.e-list-img').src.indexOf('images/Shooting.png')).not.toBe(-1);
                expect(treeObj.element.querySelector('.e-list-item').title).toBe('This is Music node');
                expect(treeObj.element.querySelectorAll('li')[1].classList.contains('firstnode')).toBe(true);
                expect(treeObj.element.querySelectorAll('li')[1].style.backgroundColor).toBe('red');
                treeObj.fields = { imageUrl: 'subImage' };
                treeObj.dataBind();
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify({d: remoteData2, __count: 2})
                });
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    expect(treeObj.element.querySelector('.e-list-text').innerHTML).toBe('Music');
                    expect(treeObj.element.querySelector('.e-list-item').getAttribute('data-uid')).toBe('01');
                    expect(treeObj.element.querySelector('.e-list-icon').classList.contains('folder')).toBe(true);
                    expect(treeObj.element.querySelector('.e-list-img').src.indexOf('images/Cricket.png')).not.toBe(-1);
                    expect(treeObj.element.querySelector('.e-list-item').title).toBe('This is Music node');
                    expect(treeObj.element.querySelectorAll('li')[1].classList.contains('firstnode')).toBe(true);
                    expect(treeObj.element.querySelectorAll('li')[1].style.backgroundColor).toBe('red');
                    done();
                }, 100);
            });
            it('fields tooltip property', (done: Function) => {
                expect(treeObj.element.querySelector('.e-list-text').innerHTML).toBe('Music');
                expect(treeObj.element.querySelector('.e-list-item').getAttribute('data-uid')).toBe('01');
                expect(treeObj.element.querySelector('.e-list-icon').classList.contains('folder')).toBe(true);
                expect(treeObj.element.querySelector('.e-list-img').src.indexOf('images/Shooting.png')).not.toBe(-1);
                expect(treeObj.element.querySelector('.e-list-item').title).toBe('This is Music node');
                expect(treeObj.element.querySelectorAll('li')[1].classList.contains('firstnode')).toBe(true);
                expect(treeObj.element.querySelectorAll('li')[1].style.backgroundColor).toBe('red');
                treeObj.fields = { tooltip: 'subTooltip' };
                treeObj.dataBind();
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify({d: remoteData2, __count: 2})
                });
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    expect(treeObj.element.querySelector('.e-list-text').innerHTML).toBe('Music');
                    expect(treeObj.element.querySelector('.e-list-item').getAttribute('data-uid')).toBe('01');
                    expect(treeObj.element.querySelector('.e-list-icon').classList.contains('folder')).toBe(true);
                    expect(treeObj.element.querySelector('.e-list-img').src.indexOf('images/Shooting.png')).not.toBe(-1);
                    expect(treeObj.element.querySelector('.e-list-item').title).toBe('This is Pictures node');
                    expect(treeObj.element.querySelectorAll('li')[1].classList.contains('firstnode')).toBe(true);
                    expect(treeObj.element.querySelectorAll('li')[1].style.backgroundColor).toBe('red');
                    done();
                }, 100);
            });
            it('fields htmlAttributes property', (done: Function) => {
                expect(treeObj.element.querySelector('.e-list-text').innerHTML).toBe('Music');
                expect(treeObj.element.querySelector('.e-list-item').getAttribute('data-uid')).toBe('01');
                expect(treeObj.element.querySelector('.e-list-icon').classList.contains('folder')).toBe(true);
                expect(treeObj.element.querySelector('.e-list-img').src.indexOf('images/Shooting.png')).not.toBe(-1);
                expect(treeObj.element.querySelector('.e-list-item').title).toBe('This is Music node');
                expect(treeObj.element.querySelectorAll('li')[1].classList.contains('firstnode')).toBe(true);
                expect(treeObj.element.querySelectorAll('li')[1].style.backgroundColor).toBe('red');
                treeObj.fields = { htmlAttributes: 'subHtmlAttr' };
                treeObj.dataBind();
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify({d: remoteData2, __count: 2})
                });
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    expect(treeObj.element.querySelector('.e-list-text').innerHTML).toBe('Music');
                    expect(treeObj.element.querySelector('.e-list-item').getAttribute('data-uid')).toBe('01');
                    expect(treeObj.element.querySelector('.e-list-icon').classList.contains('folder')).toBe(true);
                    expect(treeObj.element.querySelector('.e-list-img').src.indexOf('images/Shooting.png')).not.toBe(-1);
                    expect(treeObj.element.querySelector('.e-list-item').title).toBe('This is Music node');
                    expect(treeObj.element.querySelectorAll('li')[1].classList.contains('customnode')).toBe(true);
                    expect(treeObj.element.querySelectorAll('li')[1].style.backgroundColor).toBe('blue');
                    done();
                }, 100);
            });
            it('fields selected property', (done: Function) => {
                expect(treeObj.element.querySelectorAll('li').length).toBe(2);
                expect(treeObj.element.querySelector('.e-list-text').innerHTML).toBe('Music');
                expect(treeObj.element.querySelector('.e-list-item').getAttribute('data-uid')).toBe('01');
                expect(treeObj.element.querySelector('.e-list-icon').classList.contains('folder')).toBe(true);
                expect(treeObj.element.querySelector('.e-list-img').src.indexOf('images/Shooting.png')).not.toBe(-1);
                expect(treeObj.element.querySelector('.e-list-item').title).toBe('This is Music node');
                expect(treeObj.element.querySelector('.e-list-item').classList.contains('e-active')).toBe(true);
                expect(treeObj.element.querySelectorAll('li')[1].classList.contains('e-active')).toBe(false);
                expect(treeObj.element.querySelectorAll('li')[1].classList.contains('firstnode')).toBe(true);
                expect(treeObj.element.querySelectorAll('li')[1].style.backgroundColor).toBe('red');
                treeObj.fields = { selected: 'subSelected' };
                treeObj.dataBind();
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify({d: remoteData2, __count: 2})
                });
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    expect(treeObj.element.querySelectorAll('li').length).toBe(2);
                    expect(treeObj.element.querySelector('.e-list-text').innerHTML).toBe('Music');
                    expect(treeObj.element.querySelector('.e-list-item').getAttribute('data-uid')).toBe('01');
                    expect(treeObj.element.querySelector('.e-list-icon').classList.contains('folder')).toBe(true);
                    expect(treeObj.element.querySelector('.e-list-img').src.indexOf('images/Shooting.png')).not.toBe(-1);
                    expect(treeObj.element.querySelector('.e-list-item').title).toBe('This is Music node');
                    expect(treeObj.element.querySelector('.e-list-item').classList.contains('e-active')).toBe(false);
                    expect(treeObj.element.querySelectorAll('li')[1].classList.contains('e-active')).toBe(true);
                    expect(treeObj.element.querySelectorAll('li')[1].classList.contains('firstnode')).toBe(true);
                    expect(treeObj.element.querySelectorAll('li')[1].style.backgroundColor).toBe('red');
                    done();
                }, 100);
            });
            it('fields url property', (done: Function) => {
                expect(treeObj.element.querySelector('.e-list-text').innerHTML).toBe('Music');
                expect(treeObj.element.querySelector('.e-list-item').getAttribute('data-uid')).toBe('01');
                expect(treeObj.element.querySelector('.e-list-icon').classList.contains('folder')).toBe(true);
                expect(treeObj.element.querySelector('.e-list-img').src.indexOf('images/Shooting.png')).not.toBe(-1);
                expect(treeObj.element.querySelector('.e-list-item').title).toBe('This is Music node');
                expect(treeObj.element.querySelectorAll('li')[1].classList.contains('firstnode')).toBe(true);
                expect(treeObj.element.querySelectorAll('li')[1].style.backgroundColor).toBe('red');
                expect(treeObj.element.querySelector('.e-list-url').href.indexOf('http://npmci.syncfusion.com/')).not.toBe(-1);
                treeObj.fields = { navigateUrl: 'subUrl' };
                treeObj.dataBind();
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify({d: remoteData2, __count: 2})
                });
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    expect(treeObj.element.querySelector('.e-list-text').innerHTML).toBe('Music');
                    expect(treeObj.element.querySelector('.e-list-item').getAttribute('data-uid')).toBe('01');
                    expect(treeObj.element.querySelector('.e-list-icon').classList.contains('folder')).toBe(true);
                    expect(treeObj.element.querySelector('.e-list-img').src.indexOf('images/Shooting.png')).not.toBe(-1);
                    expect(treeObj.element.querySelector('.e-list-item').title).toBe('This is Music node');
                    expect(treeObj.element.querySelectorAll('li')[1].classList.contains('firstnode')).toBe(true);
                    expect(treeObj.element.querySelectorAll('li')[1].style.backgroundColor).toBe('red');
                    expect(treeObj.element.querySelector('.e-list-url').href.indexOf('http://npmci.syncfusion.com/')).toBe(-1);
                    expect(treeObj.element.querySelector('.e-list-url').href.indexOf('http://ej2.syncfusion.com/demos/')).not.toBe(-1);
                    done();
                }, 100);
            });
            it('cssClass property testing', () => {
                treeObj.cssClass = 'customTree productTree';
                treeObj.dataBind();
                expect(document.getElementById('tree1').classList.contains('customTree')).toEqual(true);
                expect(document.getElementById('tree1').classList.contains('productTree')).toEqual(true);
                expect(document.getElementById('tree1').classList.contains('dynamicTree')).toEqual(false);
                expect(document.getElementById('tree1').classList.contains('demoTree')).toEqual(false);
                treeObj.cssClass = 'dynamicTree demoTree';
                treeObj.dataBind();
                expect(document.getElementById('tree1').classList.contains('customTree')).toEqual(false);
                expect(document.getElementById('tree1').classList.contains('productTree')).toEqual(false);
                expect(document.getElementById('tree1').classList.contains('dynamicTree')).toEqual(true);
                expect(document.getElementById('tree1').classList.contains('demoTree')).toEqual(true);
                treeObj.cssClass = '';
                treeObj.dataBind();
                expect(document.getElementById('tree1').classList.contains('dynamicTree')).toEqual(false);
                expect(document.getElementById('tree1').classList.contains('demoTree')).toEqual(false);
            });
            it('selectedNodes property testing', () => {
                expect(treeObj.element.querySelector('.e-list-item').classList.contains('e-active')).toBe(true);
                expect(treeObj.element.querySelectorAll('li')[1].classList.contains('e-active')).toBe(false);
                treeObj.selectedNodes = ['02'];
                treeObj.dataBind();
                expect(treeObj.element.querySelector('.e-list-item').classList.contains('e-active')).toBe(false);
                expect(treeObj.element.querySelectorAll('li')[1].classList.contains('e-active')).toBe(true);
            });
            it('sortOrder property testing', (done: Function) => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                expect(li.length).toBe(2);
                expect(li[0].querySelector('.e-list-text').innerHTML).toBe('Music');
                expect(li[0].getAttribute('data-uid')).toBe('01');
                treeObj.sortOrder = 'Ascending';
                treeObj.dataBind();
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify({d: remoteData2_1, __count: 2})
                });
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    let li1: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                    expect(li1.length).toBe(2);
                    expect(li1[0].querySelector('.e-list-text').innerHTML).toBe('Downloads');
                    expect(li1[0].getAttribute('data-uid')).toBe('02');
                    treeObj.sortOrder = 'Descending';
                    treeObj.dataBind();
                    this.request = jasmine.Ajax.requests.mostRecent();
                    this.request.respondWith({
                        status: 200,
                        responseText: JSON.stringify({d: remoteData2, __count: 2})
                    });
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function() {
                        let li2: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                        expect(li2.length).toBe(2);
                        expect(li2[0].querySelector('.e-list-text').innerHTML).toBe('Music');
                        expect(li2[0].getAttribute('data-uid')).toBe('01');
                        treeObj.sortOrder = 'Ascending';
                        treeObj.dataBind();
                        this.request = jasmine.Ajax.requests.mostRecent();
                        this.request.respondWith({
                            status: 200,
                            responseText: JSON.stringify({d: remoteData2_1, __count: 2})
                        });
                        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                        setTimeout(function() {
                            let li3: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                            expect(li3.length).toBe(2);
                            expect(li3[0].querySelector('.e-list-text').innerHTML).toBe('Downloads');
                            expect(li3[0].getAttribute('data-uid')).toBe('02');
                            treeObj.sortOrder = 'None';
                            treeObj.dataBind();
                            this.request = jasmine.Ajax.requests.mostRecent();
                            this.request.respondWith({
                                status: 200,
                                responseText: JSON.stringify({d: remoteData2, __count: 2})
                            });
                            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                            setTimeout(function() {
                                let li4: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                                expect(li4.length).toBe(2);
                                expect(li4[0].querySelector('.e-list-text').innerHTML).toBe('Music');
                                expect(li4[0].getAttribute('data-uid')).toBe('01');
                                done();
                            }, 100);
                        }, 100);
                    }, 100);
                }, 100);
            });
            it('allowEditing property testing', (done: Function) => {
                treeObj.allowEditing = true;
                treeObj.dataBind();
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                expect(li[0].querySelector('.e-icons').classList.contains('e-icon-expandable')).toBe(true);
                expect(li[0].querySelector('.e-icons').classList.contains('e-icon-collapsible')).toBe(false);
                expect(li[0].childElementCount).toBe(1);
                expect(li[0].querySelector('.e-list-text').childElementCount).toBe(0);
                tapEvent.tapCount = 2;
                mouseEventArgs.target = li[0].querySelector('.e-list-text');
                treeObj.touchExpandObj.tap(tapEvent);
                treeObj.touchEditObj.tap(tapEvent);
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify({ d: remoteData2_1, __count: 2 })
                });
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function () {
                    expect(li[0].querySelector('.e-icons').classList.contains('e-icon-expandable')).toBe(false);
                    expect(li[0].querySelector('.e-icons').classList.contains('e-icon-collapsible')).toBe(true);
                    expect(li[0].childElementCount).toBe(2);
                    expect(li[0].querySelector('.e-list-text').childElementCount).toBe(1);
                    expect(li[0].querySelector('.e-input').nodeName).toBe('INPUT');
                    expect((li[0].querySelector('.e-input') as HTMLInputElement).value).toBe('Music');
                    (li[0].querySelector('.e-input') as HTMLInputElement).value = 'Music node';
                    (li[0].querySelector('.e-input') as HTMLInputElement).blur();
                    this.request = jasmine.Ajax.requests.mostRecent();
                    this.request.respondWith({
                        status: 200,
                        responseText: JSON.stringify({ d: updatedremoteNode_6, __count: 1 })
                    });
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function () {
                        expect(li[0].querySelector('.e-list-text').childElementCount).toBe(0);
                        expect((li[0].querySelector('.e-list-text') as HTMLElement).childNodes[0].nodeValue).toBe('Music node');
                        mouseEventArgs.target = li[0].querySelector('.e-list-text');
                        treeObj.touchExpandObj.tap(tapEvent);
                        treeObj.touchEditObj.tap(tapEvent);
                        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                        setTimeout(function () {
                            expect((li[0].querySelector('.e-input') as HTMLInputElement).value).toBe('Music node');
                            (li[0].querySelector('.e-input') as HTMLInputElement).value = 'Music';
                            (li[0].querySelector('.e-input') as HTMLInputElement).blur();
                            this.request = jasmine.Ajax.requests.mostRecent();
                            this.request.respondWith({
                                status: 200,
                                responseText: JSON.stringify({ d: updatedremoteNode_7, __count: 1 })
                            });
                            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                            setTimeout(function () {
                                expect(li[0].querySelector('.e-list-text').childElementCount).toBe(0);
                                expect((li[0].querySelector('.e-list-text') as HTMLElement).childNodes[0].nodeValue).toBe('Music');
                                treeObj.allowEditing = false;
                                treeObj.dataBind();
                                mouseEventArgs.target = li[0].querySelector('.e-list-text');
                                treeObj.touchExpandObj.tap(tapEvent);
                                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                                setTimeout(function () {
                                    expect(li[0].querySelector('.e-icons').classList.contains('e-icon-expandable')).toBe(false);
                                    expect(li[0].querySelector('.e-icons').classList.contains('e-icon-collapsible')).toBe(true);
                                    expect(li[0].childElementCount).toBe(2);
                                    expect(li[0].querySelector('.e-list-text').childElementCount).toBe(0);
                                    done();
                                }, 450);
                            }, 450);
                        }, 450);
                    }, 450);
                }, 500);
            });
            it('enableRtl property testing', () => {
                expect(document.getElementById('tree1').classList.contains('e-rtl')).toEqual(false);
                treeObj.enableRtl = true;
                treeObj.dataBind();
                expect(document.getElementById('tree1').classList.contains('e-rtl')).toEqual(true);
                treeObj.enableRtl = false;
                treeObj.dataBind();
                expect(document.getElementById('tree1').classList.contains('e-rtl')).toEqual(false);
            });
            it('allowDragAndDrop property testing', () => {
                expect(treeObj.dragObj).toBe(undefined);
                expect(treeObj.dropObj).toBe(undefined);
                treeObj.allowDragAndDrop = true;
                treeObj.dataBind();
                expect(treeObj.dragObj.isDestroyed).toBe(false);
                expect(treeObj.dropObj.isDestroyed).toBe(false);
                treeObj.allowDragAndDrop = false;
                treeObj.dataBind();
                expect(treeObj.dragObj.isDestroyed).toBe(true);
                expect(treeObj.dropObj.isDestroyed).toBe(true);
            });
            it('fullRowSelect property testing', () => {
                expect(document.getElementById('tree1').classList.contains('e-fullrow-wrap')).toEqual(false);
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                expect(li[0].childElementCount).toBe(1);
                treeObj.fullRowSelect = true;
                treeObj.dataBind();
                expect(document.getElementById('tree1').classList.contains('e-fullrow-wrap')).toEqual(true);
                let newli: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                expect(newli[0].childElementCount).toBe(2);
                treeObj.fullRowSelect = false;
                treeObj.dataBind();
                expect(document.getElementById('tree1').classList.contains('e-fullrow-wrap')).toEqual(false);
                let cusli: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                expect(cusli[0].childElementCount).toBe(1);
                treeObj.fullRowSelect = true;
                treeObj.dataBind();
                expect(document.getElementById('tree1').classList.contains('e-fullrow-wrap')).toEqual(true);
            });
            it('allowMultiSelection property testing', () => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                expect(li[0].classList.contains('e-active')).toBe(true);
                expect(li[1].classList.contains('e-active')).toBe(false);
                expect(treeObj.selectedNodes.length).toBe(1);
                expect(treeObj.selectedNodes).toContain('01');
                treeObj.allowMultiSelection = true;
                treeObj.dataBind();
                mouseEventArgs.ctrlKey = true;
                mouseEventArgs.target = li[1].querySelector('.e-list-text');
                treeObj.touchClickObj.tap(tapEvent);
                expect(li[0].classList.contains('e-active')).toBe(true);
                expect(li[1].classList.contains('e-active')).toBe(true);
                expect(treeObj.selectedNodes.length).toBe(2);
                expect(treeObj.selectedNodes).toContain('01');
                expect(treeObj.selectedNodes).toContain('02');
                treeObj.allowMultiSelection = false;
                treeObj.dataBind();
                expect(li[0].classList.contains('e-active')).toBe(true);
                expect(li[1].classList.contains('e-active')).toBe(false);
                expect(treeObj.selectedNodes.length).toBe(1);
                expect(treeObj.selectedNodes).toContain('01');
                expect(treeObj.selectedNodes).not.toContain('02');
            });
            it('nodeTemplate property testing', (done: Function) => {
                let template: Element = createElement('div', { id: 'template' });
                template.innerHTML = '${if(hasChild == undefined)}<b>${nodeText}</b>${else}<i>${nodeText}</i>${/if}';
                document.body.appendChild(template);
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-text-content');
                expect(li[0].querySelector('i')).toBe(null);
                expect(li[0].querySelector('b')).toBe(null);
                treeObj.nodeTemplate = 'template';
                treeObj.dataBind();
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify({d: remoteData2, __count: 2})
                });
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    let nli: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-text-content');
                    expect(nli[0].querySelector('i')).toBe(null);
                    expect(nli[0].querySelector('b')).toBe(null);
                    treeObj.nodeTemplate = null;
                    treeObj.dataBind();
                    this.request = jasmine.Ajax.requests.mostRecent();
                    this.request.respondWith({
                        status: 200,
                        responseText: JSON.stringify({d: remoteData2, __count: 2})
                    });
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function() {
                        let mli: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-text-content');
                        expect(mli[0].querySelector('i')).toBe(null);
                        expect(mli[0].querySelector('b')).toBe(null);
                        treeObj.nodeTemplate = '#template';
                        treeObj.dataBind();
                        this.request = jasmine.Ajax.requests.mostRecent();
                        this.request.respondWith({
                            status: 200,
                            responseText: JSON.stringify({d: remoteData2, __count: 2})
                        });
                        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                        setTimeout(function() {
                            let ali: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-text-content');
                            expect(ali[0].querySelector('i')).not.toBe(null);
                            expect(ali[0].querySelector('b')).toBe(null);
                            treeObj.nodeTemplate = '${if(hasChild == undefined)}<b>${nodeText}</b>${else}<i>${nodeText}</i>${/if}';
                            treeObj.dataBind();
                            this.request = jasmine.Ajax.requests.mostRecent();
                            this.request.respondWith({
                                status: 200,
                                responseText: JSON.stringify({d: remoteData2, __count: 2})
                            });
                            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                            setTimeout(function() {
                                let bli: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-text-content');
                                expect(bli[0].querySelector('i')).not.toBe(null);
                                expect(bli[0].querySelector('b')).toBe(null);
                                done();
                            }, 450);
                        }, 450);
                    }, 450);
                }, 450);
            });
           
        });
        describe('events testing', () => {
            let mouseEventArgs: any;
            let tapEvent: any;
            let keyboardEventArgs: any = {
                preventDefault: (): void => {},
                action: null
            };
            let createdFunction: () => void = jasmine.createSpy('created');
            let destroyFunction: () => void = jasmine.createSpy('destroyed');
            let dataBoundFunction: () => void = jasmine.createSpy('dataBound');
            let dataSourceChangedFunction: () => void = jasmine.createSpy('dataSourceChanged');
            let expandingFunction: () => void = jasmine.createSpy('nodeExpanding');
            let expandedFunction: () => void = jasmine.createSpy('nodeExpanded');
            let collapsingFunction: () => void = jasmine.createSpy('nodeCollapsing');
            let collapsedFunction: () => void = jasmine.createSpy('nodeCollapsed');
            let selectingFunction: () => void = jasmine.createSpy('nodeSelecting');
            let selectedFunction: () => void = jasmine.createSpy('nodeSelected');
            let editingFunction: () => void = jasmine.createSpy('nodeEditing');
            let editedFunction: () => void = jasmine.createSpy('nodeEdited');
            let drawNodeFunction: () => void = jasmine.createSpy('drawNode');
            let keyPressFunction: () => void = jasmine.createSpy('keyPress');
            let nodeClickedFunction: () => void = jasmine.createSpy('nodeClicked');
            let nodeDragStartFunction: () => void = jasmine.createSpy('nodeDragStart');
            let nodeDraggingFunction: () => void = jasmine.createSpy('nodeDragging');
            let nodeDragStopFunction: () => void = jasmine.createSpy('nodeDragStop');
            let nodeDroppedFunction: () => void = jasmine.createSpy('nodeDropped');
            let treeObj: any;
            let dataManager1: DataManager = new DataManager({ url: '/TreeView/remoteData' });
            let originalTimeout: any;
            beforeEach((): void => {
                mouseEventArgs = {
                    preventDefault: (): void => {},
                    stopImmediatePropagation: (): void => {},
                    target: null,
                    type: null,
                    shiftKey: false,
                    ctrlKey: false
                };
                tapEvent = {
                    originalEvent: mouseEventArgs,
                    tapCount: 1
                };
            });
            beforeAll((done: Function) => {
                jasmine.Ajax.install();
                let ele: HTMLElement = createElement('div', { id: 'tree1' });
                document.body.appendChild(ele);
                treeObj = new TreeView({ 
                    fields: { dataSource: dataManager1, id: "nodeId", parentID: 'nodePid', text: "nodeText", hasChildren: "hasChild", 
                        iconCss: 'nodeIcon', imageUrl: 'nodeImage', tooltip: 'nodeTooltip', htmlAttributes: 'nodeHtmlAttr' 
                    },
                    animation: { expand: { duration: 0 }, collapse: { duration: 0 } },
                    fullRowSelect: false,
                    allowEditing: true,
                    allowMultiSelection: true,
                    allowDragAndDrop: true,
                    dataBound: dataBoundFunction,
                    created: createdFunction,
                    destroyed: destroyFunction,
                    nodeExpanding: expandingFunction,
                    nodeExpanded: expandedFunction,
                    nodeCollapsing: collapsingFunction,
                    nodeCollapsed: collapsedFunction,
                    nodeSelecting: selectingFunction,
                    nodeSelected: selectedFunction,
                    nodeEditing: editingFunction,
                    nodeEdited: editedFunction,
                    drawNode: drawNodeFunction,
                    keyPress: keyPressFunction,
                    nodeClicked: nodeClickedFunction,
                    nodeDragStart: nodeDragStartFunction,
                    nodeDragging: nodeDraggingFunction,
                    nodeDragStop: nodeDragStopFunction,
                    nodeDropped: nodeDroppedFunction,
                    dataSourceChanged: dataSourceChangedFunction,
                });
                treeObj.appendTo(ele);
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify({d: remoteData2, __count: 2})
                });
                setTimeout(() => { done(); }, 100);
                originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            });
            afterAll(() => {
                if (treeObj)
                    treeObj.destroy();
                document.body.innerHTML = '';
                jasmine.Ajax.uninstall();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            });
            it('created event is triggered', () => {                
                expect(createdFunction).toHaveBeenCalled();
            });
            it('drawNode event is triggered', () => {                
                expect(drawNodeFunction).toHaveBeenCalled();
            });
            it('dataBound event is triggered', () => {
                expect(dataBoundFunction).toHaveBeenCalled();
            });
            it('nodeExpanding and nodeExpanded events are triggered', (done: Function) => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                mouseEventArgs.target = li[0].querySelector('.e-icons');
                treeObj.touchClickObj.tap(tapEvent);
                expect(expandingFunction).toHaveBeenCalled();
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify({d: remoteData2, __count: 15})
                });
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
                setTimeout(function() {
                    expect(expandedFunction).toHaveBeenCalled();
                    done();
                }, 500);
            });
            it('nodeCollapsing and nodeCollapsed events are triggered', (done: Function) => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                mouseEventArgs.target = li[0].querySelector('.e-icons');
                treeObj.touchClickObj.tap(tapEvent);
                expect(collapsingFunction).toHaveBeenCalled();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
                setTimeout(function() {
                    expect(collapsedFunction).toHaveBeenCalled();
                    done();
                }, 500);
            });
            it('nodeSelecting event is triggered', () => {
                expect(selectingFunction).not.toHaveBeenCalled();
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                mouseEventArgs.target = li[0].querySelector('.e-list-text');
                treeObj.touchClickObj.tap(tapEvent);
                expect(selectingFunction).toHaveBeenCalled();
                expect(li[0].classList.contains('e-active')).toBe(true);
                treeObj.allowMultiSelection = true;
                treeObj.dataBind();
                mouseEventArgs.ctrlKey = true;
                mouseEventArgs.target = li[0].querySelector('.e-list-text');
                treeObj.touchClickObj.tap(tapEvent);
                expect(selectingFunction).toHaveBeenCalled();
                expect(li[0].classList.contains('e-active')).toBe(false);
            });
            it('nodeSelected event is triggered', () => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                mouseEventArgs.target = li[1].querySelector('.e-list-text');
                treeObj.touchClickObj.tap(tapEvent);
                expect(selectedFunction).toHaveBeenCalled();
                expect(li[1].classList.contains('e-active')).toBe(true);
                mouseEventArgs.ctrlKey = true;
                mouseEventArgs.target = li[1].querySelector('.e-list-text');
                treeObj.touchClickObj.tap(tapEvent);
                expect(selectedFunction).toHaveBeenCalled();
                expect(li[1].classList.contains('e-active')).toBe(false);
                treeObj.allowMultiSelection = false;
                treeObj.dataBind();
                mouseEventArgs.target = li[1].querySelector('.e-list-text');
                treeObj.touchClickObj.tap(tapEvent);
            });
            it('nodeEditing and nodeEdited events are triggered', (done: Function) => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                mouseEventArgs.target = li[0].querySelector('.e-list-text');
                tapEvent.tapCount = 2;
                expect(li[0].querySelector('.e-list-text').childElementCount).toBe(0);
                treeObj.touchEditObj.tap(tapEvent);
                expect(editingFunction).toHaveBeenCalled();
                expect(li[0].querySelector('.e-list-text').childElementCount).toBe(1);
                expect(li[0].querySelector('.e-input').nodeName).toBe('INPUT');
                expect((li[0].querySelector('.e-input') as HTMLInputElement).value).toBe('Music');
                (li[0].querySelector('.e-input') as HTMLInputElement).value = 'Music node';
                (li[0].querySelector('.e-input') as HTMLInputElement).blur();
                this.request = jasmine.Ajax.requests.mostRecent();
                    this.request.respondWith({
                        status: 200,
                        responseText: JSON.stringify({ d: updatedremoteNode_3, __count: 2 })
                    });
                    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function () {
                expect(li[0].querySelector('.e-list-text').childElementCount).toBe(0);
                expect((li[0].querySelector('.e-list-text') as HTMLElement).childNodes[0].nodeValue).toBe('Music node');
                expect(editedFunction).toHaveBeenCalled();
                expect(dataSourceChangedFunction).toHaveBeenCalled();
                done();
                    },450);
            });
            it('nodeClicked event is triggered', () => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                mouseEventArgs.target = li[0].querySelector('.e-list-text');
                treeObj.touchClickObj.tap(tapEvent);
                expect(nodeClickedFunction).toHaveBeenCalled();
                expect(li[0].classList.contains('e-active')).toBe(true);
            });
            it('keyPress event is triggered', () => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                keyboardEventArgs.action = 'tab';
                treeObj.focusIn();
                expect(li[0].classList.contains('e-hover')).toBe(true);
                keyboardEventArgs.action = 'moveDown';
                treeObj.keyActionHandler(keyboardEventArgs);
                expect(keyPressFunction).toHaveBeenCalled();
                expect(li[0].classList.contains('e-hover')).toBe(false);
                expect(li[3].classList.contains('e-hover')).toBe(true);
            });
            it('darg and drop events are triggered', () => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                let mousedown: any = getEventObject('MouseEvents', 'mousedown', treeObj.element, li[3].querySelector('.e-list-text'), 15, 10);
                EventHandler.trigger(treeObj.element, 'mousedown', mousedown);                
                let mousemove: any = getEventObject('MouseEvents', 'mousemove', treeObj.element, li[3].querySelector('.e-list-text'), 15, 70);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                expect(nodeDragStartFunction).toHaveBeenCalled();
                mousemove.srcElement = mousemove.target = mousemove.toElement = li[0].querySelector('.e-list-text');
                mousemove = setMouseCordinates(mousemove, 15, 75);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                expect(nodeDraggingFunction).toHaveBeenCalled();
                let mouseup: any = getEventObject('MouseEvents', 'mouseup', treeObj.element, li[0].querySelector('.e-list-text'));
                mouseup.type = 'mouseup';
                EventHandler.trigger(<any>(document), 'mouseup', mouseup);
                expect(nodeDragStopFunction).toHaveBeenCalled();
                expect(nodeDroppedFunction).toHaveBeenCalled();
                expect(dataSourceChangedFunction).toHaveBeenCalled();
                expect(li[0].childElementCount).toBe(2);
                expect(li[0].children[1].childElementCount).toBe(3);
            });
            it('destroyed event is triggered', () => {
                treeObj.destroy();
                expect(destroyFunction).toHaveBeenCalled();
            });
        });
        describe('methods testing', () => {
            let mouseEventArgs: any;
            let tapEvent: any;
            let treeObj: any;
            let dataManager1: DataManager = new DataManager({ url: '/TreeView/remoteData', updateUrl: '/TreeView/remoteData', insertUrl: '/TreeView/Insert' });
            let originalTimeout: any;
            let j: number = 0;
            function dsChangeFn(): void {
                j++;
            }
            beforeEach((done: Function) => {
                mouseEventArgs = {
                    preventDefault: (): void => {},
                    stopImmediatePropagation: (): void => {},
                    target: null,
                    type: null,
                    shiftKey: false,
                    ctrlKey: false
                };
                tapEvent = {
                    originalEvent: mouseEventArgs,
                    tapCount: 1
                };
                j = 0;
                jasmine.Ajax.install();
                let ele: HTMLElement = createElement('div', { id: 'tree1' });
                document.body.appendChild(ele);
                treeObj = new TreeView({ 
                    fields: { dataSource: dataManager1, id: "nodeId", parentID: 'nodePid', text: "nodeText", hasChildren: "hasChild", 
                        iconCss: 'nodeIcon', imageUrl: 'nodeImage', tooltip: 'nodeTooltip', htmlAttributes: 'nodeHtmlAttr' 
                    },
                    dataBound: () => { done(); },
                    dataSourceChanged: dsChangeFn,
                });
                treeObj.appendTo(ele);
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify({d: remoteData2, __count: 2})
                });
                originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            });
            afterEach(() => {
                if (treeObj)
                    treeObj.destroy();
                document.body.innerHTML = '';
                jasmine.Ajax.uninstall();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            });
            it('get module name', () => {
                expect(treeObj.getModuleName()).toBe('treeview');
            });
            it('persistence testing', () => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                let sItems: any = JSON.parse(treeObj.getPersistData());
                expect(sItems.selectedNodes.length).toBe(0);
                mouseEventArgs.target = li[0].querySelector('.e-list-text');
                treeObj.touchClickObj.tap(tapEvent);
                let seItems: any = JSON.parse(treeObj.getPersistData());
                expect(seItems.selectedNodes.length).toBe(1);
                expect(seItems.selectedNodes).toContain('01');
            });
            
            it('expandAll', (done: Function) => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                expect(li[0].childElementCount).toBe(2);
                treeObj.expandAll();
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify({d: remoteData2, __count: 2})
                });
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    expect(li[0].childElementCount).toBe(3);
                    expect(li[0].children[2].childElementCount).toBe(2);
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function() {
                        expect(li[0].getAttribute('aria-expanded')).toBe('true');
                        done();
                    }, 450);
                }, 450);
            });
            it('disableNodes', () => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                expect(li[0].classList.contains('e-disable')).toBe(false);
                expect(li[0].getAttribute('aria-disabled')).toBe(null);
                treeObj.disableNodes(['01']);
                expect(li[0].classList.contains('e-disable')).toBe(true);
                expect(li[0].getAttribute('aria-disabled')).toBe('true');
            });
            it('enableNodes', () => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                treeObj.disableNodes(['01', li[1]]);
                expect(li[0].classList.contains('e-disable')).toBe(true);
                expect(li[1].classList.contains('e-disable')).toBe(true);
                treeObj.enableNodes(['01']);
                expect(li[0].classList.contains('e-disable')).toBe(false);
                expect(li[0].getAttribute('aria-disabled')).toBe(null);
                expect(li[1].classList.contains('e-disable')).toBe(true);
                expect(li[1].getAttribute('aria-disabled')).toBe('true');
            });
            it('refreshNode', () => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                var data = [{ nodeText: 'RefreshedNode', nodeIcon: 'folder'}];
                treeObj.expandedNodes = ['01'];
                treeObj.dataBind();
                treeObj.refreshNode('01', data);
                var refreshedLi = treeObj.element.querySelectorAll('li')[0];
                expect(refreshedLi.querySelector('.e-list-icon').classList.contains('folder')).toBe(true);
                expect(treeObj.getTreeData('01')[0].nodeText).toBe("RefreshedNode");
            });
            it('getTreeData', (done: Function) => {
                treeObj.fields = { dataSource: dataManager1, id: "nodeId", parentID: 'nodePid', text: "nodeText", hasChildren: "hasChild", 
                        iconCss: 'nodeIcon', imageUrl: 'nodeImage', tooltip: 'nodeTooltip', htmlAttributes: 'nodeHtmlAttr',
                        child: { dataSource: dataManager1, id: "nodeId", parentID: 'nodePid', text: "nodeText",}
                    };
                treeObj.showCheckBox = true;
                treeObj.dataBind();
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify({d: remoteData2, __count: 2})
                });
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    expect(treeObj.getTreeData(null).length).toBe(2);
                    expect(treeObj.getTreeData('0').length).toBe(0);
                    expect(treeObj.getTreeData('01')[0].nodeText).toBe('Music');
                    let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                    expect(treeObj.getTreeData(li[1])[0].nodeText).toBe('Downloads');
                    mouseEventArgs.target = li[0].querySelector('.e-icons');
                    treeObj.touchClickObj.tap(tapEvent);
                    this.request = jasmine.Ajax.requests.mostRecent();
                    this.request.respondWith({
                        status: 200,
                        responseText: JSON.stringify({d: remoteData2_2, __count: 2})
                    });
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function() {
                        let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                        treeObj.allowEditing = true;
                        treeObj.dataBind();
                        treeObj.updateNode(li[0], 'Rain');
                        expect(treeObj.getTreeData('01')[0].nodeText).toBe('Rain');
                        expect(treeObj.getTreeData('01')[0].expanded).toBe(true);
                        mouseEventArgs.target = li[1].querySelector('.e-list-text');
                        treeObj.touchClickObj.tap(tapEvent);
                        expect(treeObj.getTreeData('02-01')[0].selected).toBe(true);
                        expect(treeObj.getTreeData('02-02')[0].isChecked).toBe(undefined);
                        done();
                    }, 450);
                }, 450);
            });
            it('updateNode', (done: Function) => {
                expect(j).toEqual(0);
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                expect((li[0].querySelector('.e-list-text') as HTMLElement).childNodes[0].nodeValue).toBe('Music');
                treeObj.updateNode(li[0], 'Rain');
                expect((li[0].querySelector('.e-list-text') as HTMLElement).childNodes[0].nodeValue).toBe('Music');
                expect(j).toEqual(0);
                treeObj.allowEditing = true;
                treeObj.dataBind();
                treeObj.updateNode(li[0], 'Rain');
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify({ d: updatedremoteNode_1, __count: 2 })
                });
                originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function () {
                    expect((li[0].querySelector('.e-list-text') as HTMLElement).childNodes[0].nodeValue).toBe('Rain');
                    expect(j).toEqual(1);
                    treeObj.updateNode('01', 'Music');
                    this.request = jasmine.Ajax.requests.mostRecent();
                    this.request.respondWith({
                        status: 200,
                        responseText: JSON.stringify({ d: updatedremoteNode_2, __count: 2 })
                    });
                    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function () {
                        expect((li[0].querySelector('.e-list-text') as HTMLElement).childNodes[0].nodeValue).toBe('Music');
                        expect(j).toEqual(2);
                        treeObj.updateNode('011', 'Music');
                        expect((li[0].querySelector('.e-list-text') as HTMLElement).childNodes[0].nodeValue).toBe('Music');
                        expect(j).toEqual(2);
                        treeObj.updateNode('01', null);
                        expect((li[0].querySelector('.e-list-text') as HTMLElement).childNodes[0].nodeValue).toBe('Music');
                        expect(j).toEqual(2);
                        treeObj.updateNode(null, null);
                        expect((li[0].querySelector('.e-list-text') as HTMLElement).childNodes[0].nodeValue).toBe('Music');
                        expect(j).toEqual(2);
                        treeObj.allowEditing = false;
                        treeObj.dataBind();
                        done();
                    }, 400);
                }, 400);
            });
            it('addNodes', (done: Function) => {
                treeObj.fields = { dataSource: dataManager1, id: "nodeId", parentID: 'nodePid', text: "nodeText", hasChildren: "hasChild", 
                        iconCss: 'nodeIcon', imageUrl: 'nodeImage', tooltip: 'nodeTooltip', htmlAttributes: 'nodeHtmlAttr',
                        child: { dataSource: dataManager1, id: "nodeId", parentID: 'nodePid', text: "nodeText",}
                    };
                treeObj.dataBind();
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify({d: remoteData2, __count: 2})
                });
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    expect(j).toEqual(0);
                    treeObj.addNodes(null);
                    expect(treeObj.getTreeData().length).toBe(2);
                    expect(j).toEqual(0);
                    treeObj.addNodes(hierarchicalData4);
                    this.request = jasmine.Ajax.requests.mostRecent();
                    this.request.respondWith({
                        status: 200,
                        responseText: JSON.stringify({ d: hierarchicalData4, __count: 2 })
                    });
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function() {
                        let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                        expect(treeObj.liList.length).toBe(4);
                        expect(treeObj.liList.length).toBe(li.length);
                        expect(treeObj.getTreeData().length).toBe(4);
                        expect(j).toEqual(1);
                        expect(treeObj.element.querySelectorAll('.e-list-text')[2].innerHTML).toBe('Music');
                        expect(treeObj.element.querySelectorAll('.e-list-item')[2].getAttribute('data-uid')).toBe('11');
                        treeObj.addNodes(remoteData2_2, '11');
                        this.request = jasmine.Ajax.requests.mostRecent();
                        this.request.respondWith({
                            status: 200,
                            responseText: JSON.stringify({ d: remoteData2_2, __count: 2 })
                        });
                        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                        setTimeout(function() {
                            expect(treeObj.liList.length).toBe(6);
                            expect(treeObj.getTreeData().length).toBe(4);
                            expect(j).toEqual(2);
                            expect(treeObj.element.querySelectorAll('.e-list-text')[3].innerHTML).toBe('Naturals.mp4');
                            treeObj.addNodes(remoteData2_3, '02-01');
                            this.request = jasmine.Ajax.requests.mostRecent();
                            this.request.respondWith({
                                status: 200,
                                responseText: JSON.stringify({ d: remoteData2_3, __count: 2 })
                            });
                            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                            setTimeout(function() {
                                expect(treeObj.liList.length).toBe(8);
                                expect(treeObj.getTreeData().length).toBe(4);
                                expect(j).toEqual(3);
                                expect(treeObj.element.querySelectorAll('.e-list-text')[4].innerHTML).toBe('Videos');
                                done();
                            }, 450);
                        }, 450);
                    }, 450);
                }, 450);
            });
            it('destroy', () => {
                treeObj.destroy();
                expect(treeObj.element.className).toBe('');
                expect(treeObj.element.childElementCount).toBe(0);
            });
        });
        describe('Worst case testing', () => {
            describe('Code coverage', () => {
                let mouseEventArgs: any = {
                    preventDefault: (): void => {},
                    stopImmediatePropagation: (): void => {},
                    target: null,
                    type: null,
                    shiftKey: false,
                    ctrlKey: false
                };
                let tapEvent: any = {
                    originalEvent: mouseEventArgs,
                    tapCount: 1
                };
                let treeObj: any;
                let dataManager1: DataManager = new DataManager({ url: '/TreeView/remoteData' });
                let originalTimeout: any;
                let ele: HTMLElement = createElement('div', { id: 'tree1' });
                beforeAll((done: Function) => {
                    jasmine.Ajax.install();
                    document.body.appendChild(ele);
                    treeObj = new TreeView({ 
                        fields: { dataSource: dataManager1, id: "nodeId", parentID: 'nodePid', text: "nodeText", hasChildren: "hasChild", 
                            iconCss: 'nodeIcon', imageUrl: 'nodeImage', tooltip: 'nodeTooltip', htmlAttributes: 'nodeHtmlAttr', child: { id: "nodeId" }
                        },
                        dataBound: () => { done(); },
                        fullRowSelect: false,
                    });
                    treeObj.appendTo(ele);
                    this.request = jasmine.Ajax.requests.mostRecent();
                    this.request.respondWith({
                        status: 200,
                        responseText: JSON.stringify({d: remoteData2, __count: 2})
                    });
                    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                });
                afterAll(() => {
                    if (treeObj)
                        treeObj.destroy();
                    document.body.innerHTML = '';
                    jasmine.Ajax.uninstall();
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
                });
                it('without child data source', (done: Function) => {
                    let newli: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                    mouseEventArgs.target = newli[0].querySelector('.e-icons');
                    expect(newli[0].childElementCount).toBe(1);
                    treeObj.touchClickObj.tap(tapEvent);
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function() {
                        expect(newli[0].childElementCount).toBe(1);
                        expect(newli[0].querySelector('.e-icons')).toBe(null);
                        done();
                    }, 100)
                });
            });
            describe('Code coverage', () => {
                let mouseEventArgs: any = {
                    preventDefault: (): void => {},
                    stopImmediatePropagation: (): void => {},
                    target: null,
                    type: null,
                    shiftKey: false,
                    ctrlKey: false
                };
                let tapEvent: any = {
                    originalEvent: mouseEventArgs,
                    tapCount: 1
                };
                let treeObj: any;
                let dataManager1: DataManager = new DataManager({ url: '/TreeView/remoteData' });
                let originalTimeout: any;
                let ele: HTMLElement = createElement('div', { id: 'tree1' });
                beforeAll((done: Function) => {
                    jasmine.Ajax.install();
                    document.body.appendChild(ele);
                    treeObj = new TreeView({ 
                        fields: { dataSource: dataManager1, id: "nodeId", parentID: 'nodePid', text: "nodeText", hasChildren: "hasChild", 
                            iconCss: 'nodeIcon', imageUrl: 'nodeImage', tooltip: 'nodeTooltip', htmlAttributes: 'nodeHtmlAttr',
                        },
                        dataBound: () => { done(); },
                        fullRowSelect: false,
                    });
                    treeObj.appendTo(ele);
                    this.request = jasmine.Ajax.requests.mostRecent();
                    this.request.respondWith({
                        status: 200,
                        responseText: JSON.stringify({d: remoteData2, __count: 2})
                    });
                    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                });
                afterAll(() => {
                    if (treeObj)
                        treeObj.destroy();
                    document.body.innerHTML = '';
                    jasmine.Ajax.uninstall();
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
                });
                it('without child', (done: Function) => {
                    let newli: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                    mouseEventArgs.target = newli[0].querySelector('.e-icons');
                    expect(newli[0].childElementCount).toBe(1);
                    treeObj.touchClickObj.tap(tapEvent);
                    this.request = jasmine.Ajax.requests.mostRecent();
                    this.request.respondWith({
                        status: 200,
                        responseText: JSON.stringify({d: [], __count: 0})
                    });
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function() {
                        expect(newli[0].childElementCount).toBe(1);
                        expect(newli[0].querySelector('.e-icons')).toBe(null);
                        done();
                    }, 100)
                });
            });
        });
        describe('Drag and drop functionality testing', () => {
            let treeObj: any;
            let dataManager1: DataManager = new DataManager({ url: '/TreeView/remoteData' });
            let originalTimeout: any;
            beforeAll((done: Function) => {
                jasmine.Ajax.install();
                let ele: HTMLElement = createElement('div', { id: 'tree1' });
                document.body.appendChild(ele);
                treeObj = new TreeView({ 
                    fields: { dataSource: dataManager1, id: "nodeId", parentID: 'nodePid', text: "nodeText", iconCss: 'icons', imageUrl: 'nodeImage1' },
                    allowDragAndDrop: true,
                    fullRowSelect: false,
                    dataBound: () => { done(); },
                });
                treeObj.appendTo(ele);
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify({d: remoteData1, __count: 6})
                });
                originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            });
            afterAll(() => {
                if (treeObj)
                    treeObj.destroy();
                document.body.innerHTML = '';
                jasmine.Ajax.uninstall();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            });
            it('testing with target as text', () => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                let mousedown: any = getEventObject('MouseEvents', 'mousedown', treeObj.element, li[1].querySelector('.e-list-text'), 15, 10);
                EventHandler.trigger(treeObj.element, 'mousedown', mousedown);
                let mousemove: any = getEventObject('MouseEvents', 'mousemove', treeObj.element, li[1].querySelector('.e-list-text'), 15, 70);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                mousemove.srcElement = mousemove.target = mousemove.toElement = li[0].querySelector('.e-list-text');
                mousemove = setMouseCordinates(mousemove, 15, 75);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                let mouseup: any = getEventObject('MouseEvents', 'mouseup', treeObj.element, li[0].querySelector('.e-list-text'));
                mouseup.type = 'mouseup';
                EventHandler.trigger(<any>(document), 'mouseup', mouseup);
                expect(li[0].childElementCount).toBe(2);
                expect(li[0].children[1].childElementCount).toBe(1);
                expect(li[0].getAttribute('aria-expanded')).toBe('true');
            });
            it('testing with target as expand icon', () => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                let mousedown: any = getEventObject('MouseEvents', 'mousedown', treeObj.element, li[2].querySelector('.e-list-text'), 15, 10, 19, 9);
                EventHandler.trigger(treeObj.element, 'mousedown', mousedown);
                let mousemove: any = getEventObject('MouseEvents', 'mousemove', treeObj.element, li[2].querySelector('.e-list-text'), 15, 70, 19, 9);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                mousemove.srcElement = mousemove.target = mousemove.toElement = li[0].querySelector('.e-icons');
                mousemove = setMouseCordinates(mousemove, 15, 75);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                let mouseup: any = getEventObject('MouseEvents', 'mouseup', treeObj.element, li[0].querySelector('.e-icons'), undefined, undefined, 19, 9);
                mouseup.type = 'mouseup';
                EventHandler.trigger(<any>(document), 'mouseup', mouseup);
                expect(li[0].childElementCount).toBe(2);
                expect(li[0].children[1].childElementCount).toBe(2);
            });
            it('testing with target as custom icon', () => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                let mousedown: any = getEventObject('MouseEvents', 'mousedown', treeObj.element, li[1].querySelector('.e-list-icon'), 15, 10, undefined, 9);
                EventHandler.trigger(treeObj.element, 'mousedown', mousedown);
                let mousemove: any = getEventObject('MouseEvents', 'mousemove', treeObj.element, li[1].querySelector('.e-list-icon'), 15, 70, undefined, 9);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                mousemove.srcElement = mousemove.target = mousemove.toElement = li[3].querySelector('.e-list-icon');
                mousemove = setMouseCordinates(mousemove, 15, 75);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                let mouseup: any = getEventObject('MouseEvents', 'mouseup', treeObj.element, li[3].querySelector('.e-list-icon'), undefined, undefined, undefined, 9);
                mouseup.type = 'mouseup';
                EventHandler.trigger(<any>(document), 'mouseup', mouseup);
                expect(li[0].childElementCount).toBe(2);
                expect(li[3].childElementCount).toBe(2);
                expect(li[3].children[1].childElementCount).toBe(1);
            });
            it('testing with target as text wrapper with child', () => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                let mousedown: any = getEventObject('MouseEvents', 'mousedown', treeObj.element, li[3].querySelector('.e-text-content'), 15, 10, 19, 9);
                EventHandler.trigger(treeObj.element, 'mousedown', mousedown);
                let mousemove: any = getEventObject('MouseEvents', 'mousemove', treeObj.element, li[3].querySelector('.e-text-content'), 15, 70, 19, 9);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                mousemove.srcElement = mousemove.target = mousemove.toElement = li[0].querySelector('.e-text-content');
                mousemove = setMouseCordinates(mousemove, 15, 75);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                expect(document.querySelector('.e-drop-in')).not.toBe(null);
                let mouseup: any = getEventObject('MouseEvents', 'mouseup', treeObj.element, li[0].querySelector('.e-text-content'), undefined, undefined, 19 ,9);
                mouseup.type = 'mouseup';
                EventHandler.trigger(<any>(document), 'mouseup', mouseup);
                expect(li[0].childElementCount).toBe(2);
                expect(li[0].children[1].childElementCount).toBe(2);
                expect(li[0].getAttribute('aria-expanded')).toBe('true');
            });
            it('testing with target as text wrapper with out child', () => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                let mousedown: any = getEventObject('MouseEvents', 'mousedown', treeObj.element, li[3].querySelector('.e-text-content'), 15, 10);
                EventHandler.trigger(treeObj.element, 'mousedown', mousedown);
                let mousemove: any = getEventObject('MouseEvents', 'mousemove', treeObj.element, li[3].querySelector('.e-text-content'), 15, 70);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                mousemove.srcElement = mousemove.target = mousemove.toElement = li[4].querySelector('.e-text-content');
                mousemove = setMouseCordinates(mousemove, 15, 75);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                expect(document.querySelector('.e-drop-in')).not.toBe(null);
                let mouseup: any = getEventObject('MouseEvents', 'mouseup', treeObj.element, li[4].querySelector('.e-text-content'));
                mouseup.type = 'mouseup';
                EventHandler.trigger(<any>(document), 'mouseup', mouseup);
                expect(li[4].childElementCount).toBe(2);
                expect(li[4].children[1].childElementCount).toBe(1);
                expect(li[4].getAttribute('aria-expanded')).toBe('true');
            });
            it('testing with target as before li element', () => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                let mousedown: any = getEventObject('MouseEvents', 'mousedown', treeObj.element, li[2], 15, 10);
                EventHandler.trigger(treeObj.element, 'mousedown', mousedown);
                let mousemove: any = getEventObject('MouseEvents', 'mousemove', treeObj.element, li[2], 15, 70);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                mousemove.srcElement = mousemove.target = mousemove.toElement = li[2].querySelector('.e-text-content');
                mousemove = setMouseCordinates(mousemove, 15, 45);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                mousemove.srcElement = mousemove.target = mousemove.toElement = li[1];
                mousemove = setMouseCordinates(mousemove, 15, 50);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                expect(li[1].childElementCount).toBe(2);
                expect(li[1].querySelector('.e-sibling')).not.toBe(null);
                expect(document.querySelector('.e-drop-next')).not.toBe(null);
                let mouseup: any = getEventObject('MouseEvents', 'mouseup', treeObj.element, li[1], 15, 50);
                mouseup.type = 'mouseup';
                EventHandler.trigger(<any>(document), 'mouseup', mouseup);
                expect(li[0].childElementCount).toBe(2);
                expect(li[0].children[1].childElementCount).toBe(2);
                // need to check
                //expect(li[0].children[1].querySelector('.e-list-text').innerHTML).toBe('Documents');
                expect(li[1].childElementCount).toBe(1);
                expect(li[1].querySelector('.e-sibling')).toBe(null);
                expect(li[1].getAttribute('aria-expanded')).toBe(null);
            });
            it('testing with target as treeview element', () => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                let mousedown: any = getEventObject('MouseEvents', 'mousedown', treeObj.element, li[2].querySelector('.e-text-content'), 15, 10);
                EventHandler.trigger(treeObj.element, 'mousedown', mousedown);
                let mousemove: any = getEventObject('MouseEvents', 'mousemove', treeObj.element, li[2].querySelector('.e-text-content'), 15, 70);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                mousemove.srcElement = mousemove.target = mousemove.toElement = treeObj.element;
                mousemove = setMouseCordinates(mousemove, 15, 75);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                expect(document.querySelector('.e-drop-out')).not.toBe(null);
                let mouseup: any = getEventObject('MouseEvents', 'mouseup', treeObj.element, treeObj.element);
                mouseup.type = 'mouseup';
                EventHandler.trigger(<any>(document), 'mouseup', mouseup);
                expect(li[0].childElementCount).toBe(2);
                expect(li[0].children[1].childElementCount).toBe(1);
                expect(document.querySelector('.e-drop-out')).toBe(null);
            });
            it('testing with target as document', () => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                let mousedown: any = getEventObject('MouseEvents', 'mousedown', treeObj.element, li[2].querySelector('.e-text-content'), 15, 10);
                EventHandler.trigger(treeObj.element, 'mousedown', mousedown);
                let mousemove: any = getEventObject('MouseEvents', 'mousemove', treeObj.element, li[2].querySelector('.e-text-content'), 15, 70);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                mousemove.srcElement = mousemove.target = mousemove.toElement = document.getElementsByTagName('body')[0];
                mousemove = setMouseCordinates(mousemove, 15, 75);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                expect(document.querySelector('.e-no-drop')).not.toBe(null);
                let mouseup: any = getEventObject('MouseEvents', 'mouseup', treeObj.element, document.getElementsByTagName('body')[0]);
                mouseup.type = 'mouseup';
                EventHandler.trigger(<any>(document), 'mouseup', mouseup);
                expect(li[0].childElementCount).toBe(2);
                expect(li[0].children[1].childElementCount).toBe(1);
                expect(document.querySelector('.e-no-drop')).toBe(null);
            });
            it('testing with target as non droppable element', () => {
                let ele: HTMLElement = createElement('div', { id: 'nontree' });
                document.body.appendChild(ele);
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                let mousedown: any = getEventObject('MouseEvents', 'mousedown', treeObj.element, li[2].querySelector('.e-text-content'), 15, 10);
                EventHandler.trigger(treeObj.element, 'mousedown', mousedown);
                let mousemove: any = getEventObject('MouseEvents', 'mousemove', treeObj.element, li[2].querySelector('.e-text-content'), 15, 70);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                mousemove.srcElement = mousemove.target = mousemove.toElement = document.getElementById('nontree');
                mousemove = setMouseCordinates(mousemove, 15, 75);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                expect(document.querySelector('.e-no-drop')).not.toBe(null);
                let mouseup: any = getEventObject('MouseEvents', 'mouseup', treeObj.element, document.getElementById('nontree'));
                mouseup.type = 'mouseup';
                EventHandler.trigger(<any>(document), 'mouseup', mouseup);
                expect(li[0].childElementCount).toBe(2);
                expect(li[0].children[1].childElementCount).toBe(1);
                expect(document.querySelector('.e-no-drop')).toBe(null);
            });
             it('testing with target as a container', () => {
                let ele: HTMLElement = createElement('div', { id: 'container' });
                ele.className += " e-droppable";
                document.body.appendChild(ele);
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                let mousedown: any = getEventObject('MouseEvents', 'mousedown', treeObj.element, li[2].querySelector('.e-text-content'), 15, 10);
                EventHandler.trigger(treeObj.element, 'mousedown', mousedown);
                let mousemove: any = getEventObject('MouseEvents', 'mousemove', treeObj.element, li[2].querySelector('.e-text-content'), 15, 70);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                mousemove.srcElement = mousemove.target = mousemove.toElement = document.getElementById('container');
                mousemove = setMouseCordinates(mousemove, 15, 75);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                expect(document.querySelector('.e-drop-in')).not.toBe(null);
                let mouseup: any = getEventObject('MouseEvents', 'mouseup', treeObj.element, document.getElementById('container'));
                mouseup.type = 'mouseup';
                EventHandler.trigger(<any>(document), 'mouseup', mouseup);
                expect(li[0].childElementCount).toBe(2);
                expect(li[0].children[1].childElementCount).toBe(1);
                expect(document.querySelector('.e-no-drop')).toBe(null);
            });
           
            it('testing with target as full row with child', () => {
                treeObj.fullRowSelect = true;
                treeObj.dataBind();
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                let mousedown: any = getEventObject('MouseEvents', 'mousedown', treeObj.element, li[3].querySelector('.e-fullrow'), 15, 10);
                EventHandler.trigger(treeObj.element, 'mousedown', mousedown);
                let mousemove: any = getEventObject('MouseEvents', 'mousemove', treeObj.element, li[3].querySelector('.e-fullrow'), 15, 70);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                mousemove.srcElement = mousemove.target = mousemove.toElement = li[0].querySelector('.e-fullrow');
                mousemove = setMouseCordinates(mousemove, 15, 75);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                expect(document.querySelector('.e-drop-in')).not.toBe(null);
                let mouseup: any = getEventObject('MouseEvents', 'mouseup', treeObj.element, li[0].querySelector('.e-fullrow'));
                mouseup.type = 'mouseup';
                EventHandler.trigger(<any>(document), 'mouseup', mouseup);
                expect(li[0].childElementCount).toBe(3);
                expect(li[0].children[2].childElementCount).toBe(2);
                expect(li[0].getAttribute('aria-expanded')).toBe('true');
                treeObj.fullRowSelect = false;
                treeObj.dataBind();
            });
            it('testing with target as full row with out child', () => {
                treeObj.fullRowSelect = true;
                treeObj.dataBind();
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                let mousedown: any = getEventObject('MouseEvents', 'mousedown', treeObj.element, li[3].querySelector('.e-fullrow'), 15, 10);
                EventHandler.trigger(treeObj.element, 'mousedown', mousedown);
                let mousemove: any = getEventObject('MouseEvents', 'mousemove', treeObj.element, li[3].querySelector('.e-fullrow'), 15, 70);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                mousemove.srcElement = mousemove.target = mousemove.toElement = li[1].querySelector('.e-fullrow');
                mousemove = setMouseCordinates(mousemove, 15, 75);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                expect(document.querySelector('.e-drop-in')).not.toBe(null);
                let mouseup: any = getEventObject('MouseEvents', 'mouseup', treeObj.element, li[1].querySelector('.e-fullrow'));
                mouseup.type = 'mouseup';
                EventHandler.trigger(<any>(document), 'mouseup', mouseup);
                expect(li[1].childElementCount).toBe(3);
                expect(li[1].children[2].childElementCount).toBe(1);
                expect(li[1].getAttribute('aria-expanded')).toBe('true');
                treeObj.fullRowSelect = false;
                treeObj.dataBind();
            });
            it('code coverage', () => {
                expect(document.body.style.cursor).toBe('');
                treeObj.dropObj.out({target:document.body});
                expect(document.body.style.cursor).toBe('not-allowed');
            });
        });
    });
    describe('Worst case testing', () => {
        let treeObj: any;
        let mouseEventArgs: any;
        let tapEvent: any;
        beforeEach((): void => {
            mouseEventArgs = {
                preventDefault: (): void => {},
                stopImmediatePropagation: (): void => {},
                target: null,
                type: null,
                shiftKey: false,
                ctrlKey: false
            };
            tapEvent = {
                originalEvent: mouseEventArgs,
                tapCount: 1
            };
            treeObj = undefined;
            let ele: HTMLElement = createElement('div', { id: 'tree1' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (treeObj)
                treeObj.destroy();
            document.body.innerHTML = '';
        });
        it('with hierarchical data binding', (done: Function) => {
            treeObj = new TreeView({
                fields: { dataSource: hierarchicalData3, id: "nodeId", text: "nodeText", tooltip: "nodeText", child: "nodeChild", imageUrl: "image", iconCss: "icons", htmlAttributes: 'attr', selected: 'nodeSelected' },
                fullRowSelect: false,
            },'#tree1');
            let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
            treeObj.allowMultiSelection = true;
            treeObj.dataBind();
            var e = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true, shiftKey: true, ctrlKey: true });
            li[0].querySelector('.e-list-text').dispatchEvent(e);
            mouseEventArgs.shiftKey = true;
            mouseEventArgs.target = li[0].querySelector('.e-list-text');
            treeObj.touchClickObj.tap(tapEvent);
            mouseEventArgs.target = li[2].querySelector('.e-list-text');
            treeObj.touchClickObj.tap(tapEvent);
            expect(treeObj.selectedNodes.length).toBe(3);
            treeObj.allowMultiSelection = false;
            treeObj.dataBind();
            expect(li[5].querySelector('.e-icons')).toBe(null);
            expect(li[5].childElementCount).toBe(1);
            expect(li[6].querySelector('.e-icons')).toBe(null);
            expect(li[6].childElementCount).toBe(1);
            mouseEventArgs.target = li[7].querySelector('.e-icons');
            expect((li[7].querySelector('.e-icons') as Element).classList.contains('e-icon-expandable')).toBe(true);
            expect(li[7].childElementCount).toBe(1);
            treeObj.touchClickObj.tap(tapEvent);
            expect(li[7].querySelector('.e-icons')).toBe(null);
            expect(li[7].childElementCount).toBe(1);
            mouseEventArgs.target = li[4].querySelector('.e-icons');
            expect(li[4].childElementCount).toBe(1);
            treeObj.touchClickObj.tap(tapEvent);
            treeObj.touchClickObj.tap(tapEvent);
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(function() {
                let newli: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                expect(newli[4].childElementCount).toBe(2);
                expect(newli[5].classList.contains('e-active')).toBe(true);
                expect(treeObj.element.querySelectorAll('[aria-selected]').length).toBe(1);
                expect(newli[5].getAttribute('aria-selected')).toBe('true');
                treeObj.touchClickObj.tap(tapEvent);
                treeObj.touchClickObj.tap(tapEvent);
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    expect((newli[4].querySelector('.e-icons') as Element).classList.contains('e-icon-expandable')).toBe(true);
                    done();
                }, 450);
            }, 450);
        });
        it('with local data binding', (done: Function) => {
            treeObj = new TreeView({
                fields: { dataSource: localData3, id: "nodeId", parentID: 'nodePid', text: "nodeText", hasChildren: 'hasChild', tooltip: "nodeText", child: "nodeChild", imageUrl: "image", iconCss: "icons", htmlAttributes: 'attr', selected: 'nodeSelected' },
                fullRowSelect: false,
            },'#tree1');
            let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
            mouseEventArgs.target = li[5].querySelector('.e-icons');
            expect((li[5].querySelector('.e-icons') as Element).classList.contains('e-icon-expandable')).toBe(true);
            expect(li[5].childElementCount).toBe(1);
            treeObj.touchClickObj.tap(tapEvent);
            expect(li[5].querySelector('.e-icons')).toBe(null);
            expect(li[5].childElementCount).toBe(1);
            mouseEventArgs.target = li[6].querySelector('.e-icons');
            expect((li[6].querySelector('.e-icons') as Element).classList.contains('e-icon-expandable')).toBe(true);
            expect(li[6].childElementCount).toBe(1);
            treeObj.touchClickObj.tap(tapEvent);
            expect(li[6].querySelector('.e-icons')).toBe(null);
            expect(li[6].childElementCount).toBe(1);
            mouseEventArgs.target = li[7].querySelector('.e-icons');
            expect((li[7].querySelector('.e-icons') as Element).classList.contains('e-icon-expandable')).toBe(true);
            expect(li[7].childElementCount).toBe(1);
            treeObj.touchClickObj.tap(tapEvent);
            expect(li[7].querySelector('.e-icons')).toBe(null);
            expect(li[7].childElementCount).toBe(1);
            mouseEventArgs.target = li[4].querySelector('.e-icons');
            expect(li[4].childElementCount).toBe(1);
            treeObj.touchClickObj.tap(tapEvent);
            treeObj.touchClickObj.tap(tapEvent);
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(function() {
                let newli: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                expect(newli[4].childElementCount).toBe(2);
                expect(newli[5].classList.contains('e-active')).toBe(true);
                expect(treeObj.element.querySelectorAll('[aria-selected]').length).toBe(1);
                expect(newli[5].getAttribute('aria-selected')).toBe('true');
                treeObj.touchClickObj.tap(tapEvent);
                treeObj.touchClickObj.tap(tapEvent);
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    expect((newli[4].querySelector('.e-icons') as Element).classList.contains('e-icon-expandable')).toBe(true);
                    done();
                }, 450);
            }, 450);
        });
        it('with bigger class', (done: Function) => {
            document.body.classList.add('e-bigger');
            treeObj = new TreeView({
                fields: { dataSource: hierarchicalData3, id: "nodeId", text: "nodeText", tooltip: "nodeText", child: "nodeChild", imageUrl: "image", iconCss: "icons", htmlAttributes: 'attr', selected: 'nodeSelected' },
                fullRowSelect: false,
                showCheckBox: true,
            },'#tree1');
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(function() {
                expect(treeObj.element.querySelector('.e-checkbox-wrapper').classList.contains('e-small')).toBe(true);
                treeObj.showCheckBox = false;
                treeObj.dataBind();
                treeObj.showCheckBox = true;
                treeObj.dataBind();
                expect(treeObj.element.querySelector('.e-checkbox-wrapper').classList.contains('e-small')).toBe(true);
                document.body.classList.remove('e-bigger');
                treeObj.showCheckBox = false;
                treeObj.dataBind();
                treeObj.showCheckBox = true;
                treeObj.dataBind();
                expect(treeObj.element.querySelector('.e-checkbox-wrapper').classList.contains('e-small')).toBe(false);
                done();
            }, 100);
        });
    });
    describe('IOS node editing testing', () => {
        let treeObj: any;
        let mouseEventArgs: any = {
            preventDefault: (): void => {},
            stopImmediatePropagation: (): void => {},
            target: null,
            type: null,
        };
        let tapEvent: any = {
            originalEvent: mouseEventArgs,
            tapCount: 1
        };
        let iosPhoneUa: string = 'Mozilla/5.0 (iPhone; CPU iPhone OS 5_0 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) Version/5.1 Mobile/9A334 Safari/7534.48.3';
        beforeEach(() => {
            Browser.userAgent = iosPhoneUa;
            let ele: HTMLElement = createElement('div', { id: 'tree1' });
            document.body.appendChild(ele);
            treeObj = new TreeView({ 
                fields: { dataSource: hierarchicalData1, id: "nodeId", text: "nodeText", child: "nodeChild", },
                allowEditing: true,
            });
            treeObj.appendTo(ele);
        });
        afterEach(() => {
            let Chromebrowser: string = "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36";
            Browser.userAgent = Chromebrowser;
            if (treeObj)
                treeObj.destroy();
            document.body.innerHTML = '';
        });
        it('IOS testing', () => {
            expect(treeObj.touchEditObj.isDestroyed).toBe(false);
            expect(treeObj.touchClickObj.isDestroyed).toBe(false);
            expect(treeObj.touchExpandObj.isDestroyed).toBe(false);
            let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
            mouseEventArgs.target = li[0].querySelector('.e-list-text');
            treeObj.touchEditObj.tap(tapEvent);
            tapEvent.tapCount = 2;
            treeObj.touchEditObj.tap(tapEvent);
            treeObj.allowEditing = false;
            treeObj.dataBind();
            tapEvent.tapCount = 1;
            treeObj.touchClickObj.tap(tapEvent);
            treeObj.touchExpandObj.tap(tapEvent);
            treeObj.expandOn = 'DblClick';
            treeObj.dataBind();
            treeObj.touchExpandObj.tap(tapEvent);
            tapEvent.tapCount = 2;
            treeObj.touchExpandObj.tap(tapEvent);
            expect(treeObj.touchEditObj.isDestroyed).toBe(true);
            treeObj.destroy();
            expect(treeObj.touchClickObj.isDestroyed).toBe(true);
            expect(treeObj.touchExpandObj.isDestroyed).toBe(true);
        });
    });
    describe('touch action testing', () => {
        let mouseEventArgs: any;
        let tapEvent: any;
        let treeObj: any;
        let androidPhoneUa: string = 'Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) ' +
        'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36';
        beforeEach(() => {
            mouseEventArgs = {
                preventDefault: (): void => {},
                stopImmediatePropagation: (): void => {},
                target: null,
                type: null,
                shiftKey: false,
                ctrlKey: false
            };
            tapEvent = {
                originalEvent: mouseEventArgs,
                tapCount: 1
            };
            Browser.userAgent = androidPhoneUa;
            let ele: HTMLElement = createElement('div', { id: 'tree1' });
            document.body.appendChild(ele);
            treeObj = new TreeView({ 
                fields: { dataSource: hierarchicalData1, id: "nodeId", text: "nodeText", child: "nodeChild", },
                allowMultiSelection: true,
            });
            treeObj.appendTo(ele);
        });
        afterEach(() => {
            let Chromebrowser: string = "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36";
            Browser.userAgent = Chromebrowser;
            if (treeObj)
                treeObj.destroy();
            document.body.innerHTML = '';
        });
        it('focus in testing', () => {
            let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
            treeObj.mouseDownStatus=true;
            treeObj.focusIn();
            expect(li[0].classList.contains('e-hover')).toBe(false);
            expect(li[0].classList.contains('e-node-focus')).toBe(true);
            Browser.userAgent = navigator.userAgent;
        });
    });
    describe('shift down and up key selection', () => {
        let treeObj: any;
        let activeEle: Element[];
        let i: number = 0;
        let keyboardEventArgs: any = {
            preventDefault: (): void => {},
            action: null,
            target: null,
            shiftKey:true,
            stopImmediatePropagation: (): void => {},
        };
        function nodeSelect(args: NodeSelectEventArgs): void {
            if (args.nodeData.selected === true) { 
                i++;
            }
        };
        beforeEach(() => {
            let ele: HTMLElement = createElement('div', { id: 'tree1' });
            document.body.appendChild(ele);
            treeObj = new TreeView({ 
                fields: { dataSource: hierarchicalData1, id: "nodeId", text: "nodeText", child: "nodeChild", },
                allowMultiSelection: true,
                selectedNodes: ['01'],
                nodeSelected: nodeSelect
            });
            treeObj.appendTo(ele);
        });
        afterEach(() => {
            if (treeObj)
                treeObj.destroy();
            document.body.innerHTML = '';
        });
        it('Selection argument value', () => {
            let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
            expect(i).toBe(0);
            keyboardEventArgs.action = 'shiftDown';
            treeObj.keyActionHandler(keyboardEventArgs);
            keyboardEventArgs.action = 'shiftDown';
            treeObj.keyActionHandler(keyboardEventArgs);
            keyboardEventArgs.action = 'shiftDown';
            treeObj.keyActionHandler(keyboardEventArgs);
            expect(i).toBe(3);
        });
        it('shift + down key selection with allowMultiSelection', () => {
            let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
            keyboardEventArgs.action = 'shiftDown';
            treeObj.keyActionHandler(keyboardEventArgs);
            keyboardEventArgs.action = 'shiftDown';
            treeObj.keyActionHandler(keyboardEventArgs);
            keyboardEventArgs.action = 'shiftDown';
            treeObj.keyActionHandler(keyboardEventArgs);
            activeEle = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li.e-active');
            expect(activeEle.length === 4).toBe(true);
        });
        it('shift + down key selection without allowMultiSelection', () => {
            treeObj.allowMultiSelection = false;
            treeObj.dataBind();
            keyboardEventArgs.action = 'shiftDown';
            treeObj.keyActionHandler(keyboardEventArgs);
            activeEle = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li.e-node-focus');
            expect(activeEle.length === 1).toBe(true);
            treeObj.allowMultiSelection = true;
            treeObj.dataBind();
        });
        it('shift + down key selection with allowMultiSelection', () => {
            let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
            keyboardEventArgs.action = 'shiftDown';
            treeObj.keyActionHandler(keyboardEventArgs);
            keyboardEventArgs.action = 'shiftDown';
            treeObj.keyActionHandler(keyboardEventArgs);
            keyboardEventArgs.action = 'shiftDown';
            treeObj.keyActionHandler(keyboardEventArgs);
            keyboardEventArgs.action = 'shiftUp';
            treeObj.keyActionHandler(keyboardEventArgs);
            activeEle = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li.e-active');
            expect(activeEle.length === 3).toBe(true);
        });
        it('shift + down key selection without allowMultiSelection', () => {
            treeObj.allowMultiSelection = false;
            treeObj.dataBind();
            keyboardEventArgs.action = 'shiftUp';
            treeObj.keyActionHandler(keyboardEventArgs);
            activeEle = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li.e-node-focus');
            expect(activeEle.length === 1).toBe(true);
        });
    });
	describe('Disabled node key functions', function () {
            let treeObj: any;
        let activeEle: Element[];
        let keyboardEventArgs: any = {
            preventDefault: (): void => {},
            action: null,
            target: null,
            shiftKey:true,
            stopImmediatePropagation: (): void => {},
        };
        beforeEach(() => {
            let ele: HTMLElement = createElement('div', { id: 'tree1' });
            document.body.appendChild(ele);
            treeObj = new TreeView({ 
                fields: { dataSource: hierarchicalData1, id: "nodeId", text: "nodeText", child: "nodeChild", },
                allowMultiSelection: true,
                selectedNodes: ['01']
            });
            treeObj.appendTo(ele);
        });
        afterEach(() => {
            if (treeObj)
                treeObj.destroy();
            document.body.innerHTML = '';
        });
        it('Disabled Nodes', () => {
            let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
            treeObj.disableNodes([li[0], li[1], '03', '099', '07']);
				expect(li[0].classList.contains('e-disable')).toBe(true);
				expect(li[0].getAttribute('aria-disabled')).toBe('true');
                keyboardEventArgs.action = 'moveUp';
                treeObj.keyActionHandler(keyboardEventArgs);
				expect(li[0].classList.contains('e-disable')).toBe(true);
				expect(li[0].getAttribute('aria-disabled')).toBe('true');
                keyboardEventArgs.action = 'moveDown';
				expect(li[0].classList.contains('e-disable')).toBe(true);
				expect(li[0].getAttribute('aria-disabled')).toBe('true');
				treeObj.focusNextNode(li[0], true);
        });
        });
		describe('Disabled node keyboard functions', function () {
            let treeObj: any;
        let activeEle: Element[];
        let keyboardEventArgs: any = {
            preventDefault: (): void => {},
            action: null,
            target: null,
            shiftKey:true,
            stopImmediatePropagation: (): void => {},
        };
        beforeEach(() => {
            let ele: HTMLElement = createElement('div', { id: 'tree1' });
            document.body.appendChild(ele);
            treeObj = new TreeView({ 
                fields: { dataSource: localData5, id: "nodeId", text: "nodeText", child: "nodeChild", },
                allowMultiSelection: true,
                selectedNodes: ['05']
            });
            treeObj.appendTo(ele);
        });
        afterEach(() => {
            if (treeObj)
                treeObj.destroy();
            document.body.innerHTML = '';
        });
		it('down arrow key with disablenodes', () => {
            let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
				treeObj.disableNodes(['05-04']);
                keyboardEventArgs.action = 'moveDown';
                treeObj.keyActionHandler(keyboardEventArgs);
                treeObj.keyActionHandler(keyboardEventArgs);
                treeObj.keyActionHandler(keyboardEventArgs);
                treeObj.keyActionHandler(keyboardEventArgs);
                expect(li[23].classList.contains('e-node-focus')).toBe(true);
            });
        });
        describe('Multiple disabled node keyboard functions', function () {
            let treeObj: any;
        let activeEle: Element[];
        let keyboardEventArgs: any = {
            preventDefault: (): void => {},
            action: null,
            target: null,
            shiftKey:true,
            stopImmediatePropagation: (): void => {},
        };
        let eleParent: HTMLElement = createElement('div', { id: 'treeParent', styles: 'height:150px;overflow:auto;' });
        let ele: HTMLElement = createElement('div', { id: 'tree1' });
        beforeAll(() => {
            document.body.appendChild(eleParent);
            eleParent.appendChild(ele);
            treeObj = new TreeView({ 
                fields: { dataSource: hierarchicalData5, id: "nodeId", text: "nodeText", child: "nodeChild", },
                selectedNodes: ['03']
            });
            treeObj.appendTo(ele);
        });
        afterEach(() => {
            if (treeObj)
                treeObj.destroy();
            document.body.innerHTML = '';
        });
            it('Successive node disabled', () => {
                    treeObj.disableNodes(['04', '05']);
                    keyboardEventArgs.action = 'moveDown';
                    treeObj.keyActionHandler(keyboardEventArgs);
                });
        });
        describe('Prevent node expand', function() {
            let treeObj: any;
            let activeEle: Element[];
            let eleParent: HTMLElement = createElement('div', { id: 'treeParent', styles: 'height:150px;overflow:auto;' });
            let ele: HTMLElement = createElement('div', {id: 'tree' });
            beforeEach(() => {
                document.body.appendChild(eleParent);
                eleParent.appendChild(ele);
                treeObj = new TreeView({ 
                    fields: { dataSource: localData },
                });
                treeObj.appendTo(ele);
            });
            afterEach(() => {
                if (treeObj)
                    treeObj.destroy();
                document.body.innerHTML = '';
            });
            it('Using addNodes method', () => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                treeObj.addNodes([{ id: 31, text: "newNode" }], "16", null, true);
                expect(li[1].classList.contains('e-node-collapsed')).toBe(true);
            });
        });
        describe('Prevent node expand action', function() {
            let treeObj: any;
            let activeEle: Element[];
            let eleParent: HTMLElement = createElement('div', { id: 'treeParent', styles: 'height:150px;overflow:auto;' });
            let ele: HTMLElement = createElement('div', {id: 'tree' });
            beforeEach(() => {
                document.body.appendChild(eleParent);
                eleParent.appendChild(ele);
                treeObj = new TreeView({ 
                    fields: { dataSource: localData5, id: "nodeId", text: "nodeText", child: "nodeChild" },
                });
                treeObj.appendTo(ele);
            });
            afterEach(() => {
                if (treeObj)
                    treeObj.destroy();
                document.body.innerHTML = '';
            });
            it('Using moveNodes method', () => {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                treeObj.moveNodes(["05-02"], "05-03", null, true);
                expect(li[23].attributes[4].value == "false").toBe(true);
            });
        });
        describe('Drop position testing', function() {
            let treeObj: any;
            let mouseEventArgs: any;
            treeObj = undefined;
            let tapEvent: any;
            let keyboardEventArgs: any = {
                preventDefault: (): void => {},
                action: null,
                target: null,
                shiftKey:true,
                stopImmediatePropagation: (): void => {},
            };
            let ele: HTMLElement = createElement('div',{ id: 'tree' });
            beforeAll(() => {
                document.body.appendChild(ele);
                mouseEventArgs = {
                    preventDefault: (): void => {},
                    stopImmediatePropagation: (): void => {},
                    target: null,
                    type: null,
                    shiftKey: false,
                    ctrlKey: false,
                    originalEvent:{ target: null}
                };
                tapEvent = {
                    originalEvent: mouseEventArgs,
                    tapCount: 1
                };
                treeObj = new TreeView({
                    fields: { dataSource: hierarchicalData1, id: "nodeId", text: "nodeText", child: "nodeChild" },
                    allowDragAndDrop: true
                });
                treeObj.appendTo(ele);
            })
            afterAll(() => {
                if (treeObj)
                    treeObj.destroy();
                document.body.innerHTML = '';
            });
            it('Drag position on child', (done: Function) => {
                treeObj = new TreeView({ 
                    fields: { dataSource: localData5, id: "nodeId", text: "nodeText", child: "nodeChild" },
                    selectedNodes: ['01'],
                    enableRtl: true
                },'#tree');
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    keyboardEventArgs.action = 'moveLeft';
                    treeObj.keyActionHandler(keyboardEventArgs);         
                    done();
                }, 100);
        });
        it('Drag position on child with rtl', (done: Function) => {
            treeObj = new TreeView({ 
                fields: { dataSource: localData5, id: "nodeId", text: "nodeText", child: "nodeChild" },
                selectedNodes: ['01'],
                enableRtl: true
            },'#tree');
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(function() {
                keyboardEventArgs.action = 'moveRight';
                treeObj.keyActionHandler(keyboardEventArgs);         
                done();
            }, 100);
    });
    });
    describe('Drop position testing', function() {
        let treeObj: any;
        let mouseEventArgs: any;
        treeObj = undefined;
        let tapEvent: any;
        let keyboardEventArgs: any = {
            preventDefault: (): void => {},
            action: null,
            target: null,
            shiftKey:true,
            stopImmediatePropagation: (): void => {},
        };
        let i: number = 0;
        function nodeDrag(args: DragAndDropEventArgs): void {
            if (args.dropIndicator === "e-drop-in") {
                ++i;
            }
        }
        let ele: HTMLElement = createElement('div',{ id: 'tree' });
        beforeEach(() => {
            document.body.appendChild(ele);
            mouseEventArgs = {
                preventDefault: (): void => {},
                stopImmediatePropagation: (): void => {},
                target: null,
                type: null,
                shiftKey: false,
                ctrlKey: false,
                originalEvent:{ target: null}
            };
            i = 0;
            tapEvent = {
                originalEvent: mouseEventArgs,
                tapCount: 1
            };
            treeObj = new TreeView({
                fields: { dataSource: hierarchicalData1, id: "nodeId", text: "nodeText", child: "nodeChild" },
                allowDragAndDrop: true
            });
            //treeObj.appendTo(ele);
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        })
        afterEach(() => {
            if (treeObj)
                treeObj.destroy();
            document.body.innerHTML = '';
        });
        it('Drag position before', () => {
            treeObj = new TreeView({
                fields: { dataSource: hierarchicalData1, id: "nodeId", text: "nodeText", child: "nodeChild" },
                allowDragAndDrop: true
            },'#tree');
            let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
            let mousedown: any = getEventObject('MouseEvents', 'mousedown', treeObj.element, li[0].querySelector('.e-list-text'), 15, 10);
            EventHandler.trigger(treeObj.element, 'mousedown', mousedown);
            li[0].querySelector('.e-list-text').classList.add("e-fullrow");
            let mousemove: any = getEventObject('MouseEvents', 'mousemove', treeObj.element, li[0].querySelector('.e-list-text'), 15, 70);
            mousemove.offsetY = 2;
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            let mouseup: any = getEventObject('MouseEvents', 'mouseup', treeObj.element, li[0].querySelector('.e-list-text'));
            EventHandler.trigger(<any>(document), 'mouseup', mouseup);     
        });
        it('Drag position on child', (done: Function) => {
            treeObj = new TreeView({ 
                fields: { dataSource: localData1, id: "nodeId", parentID: 'nodePid', text: "nodeText", hasChildren: "hasChild" },
                allowDragAndDrop: true,
            },'#tree');
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(function() {
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                let mousedown: any = getEventObject('MouseEvents', 'mousedown', treeObj.element, li[0].querySelector('.e-list-text'), 15, 10);
                EventHandler.trigger(treeObj.element, 'mousedown', mousedown);
                li[0].querySelector('.e-list-text').classList.add("e-fullrow");
                let mousemove: any = getEventObject('MouseEvents', 'mousemove', treeObj.element, li[0].querySelector('.e-list-text'), 15, 70);
                mousemove.offsetY = 12;
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                expect(li[0].classList.contains('e-node-focus')).toBe(true);  
                let mouseup: any = getEventObject('MouseEvents', 'mouseup', treeObj.element, li[0].querySelector('.e-list-text'));
                EventHandler.trigger(<any>(document), 'mouseup', mouseup);        
                done();
            }, 100);
        });
       it('Icon css testing', () => {
            treeObj = new TreeView({ 
            fields: { dataSource: localData1, id: "nodeId", parentID: 'nodePid', text: "nodeText", hasChildren: "hasChild" },
            allowDragAndDrop: true,
            nodeDragging: nodeDrag
            },'#tree');
            let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
            let mousedown: any = getEventObject('MouseEvents', 'mousedown', treeObj.element, li[0].querySelector('.e-list-text'), 15, 10);
            EventHandler.trigger(treeObj.element, 'mousedown', mousedown);
            let mousemove: any = getEventObject('MouseEvents', 'mousemove', treeObj.element, li[0].querySelector('.e-list-text'), 15, 70);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove.srcElement = mousemove.target = mousemove.toElement = li[1].querySelector('.e-list-text');
            mousemove = setMouseCordinates(mousemove, 15, 75);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            expect(i).toBe(1);         
    });
});
describe('Drag and drop with different TreeView functionality testing with empty dataSource', () => {
    let treeObj: any;
    let treeObj1: any;
    let mouseEventArgs: any;
    let tapEvent: any;
    let i: number;
    function nodeDrop(args: DragAndDropEventArgs): void {
        i=0;
    }
    beforeEach((): void => {
        mouseEventArgs = {
            preventDefault: (): void => {},
            stopImmediatePropagation: (): void => {},
            target: null,
            type: null,
            shiftKey: false,
            ctrlKey: false
        };
        tapEvent = {
            originalEvent: mouseEventArgs,
            tapCount: 1
        };
        treeObj = undefined;
        let ele: HTMLElement = createElement('div', { id: 'tree1' });
        document.body.appendChild(ele);
        treeObj = new TreeView({ 
            fields: { dataSource: localData1, id: "nodeId", text: "nodeText", parentID: 'nodePid', hasChildren: 'hasChild', navigateUrl: 'nodeUrl', iconCss: 'icons', imageUrl: 'nodeImage1', expanded: 'nodeExpanded1' },
            allowDragAndDrop: true,
            fullRowSelect: false,
            nodeDropped: nodeDrop
        },'#tree1');
        let ele1: HTMLElement = createElement('div', { id: 'tree2' });
        document.body.appendChild(ele1);
        treeObj1 = undefined;
        treeObj1 = new TreeView({ 
            fields: { dataSource: [], id: "nodeId", text: "nodeText", parentID: 'nodePid', hasChildren: 'hasChild', expanded: 'nodeExpanded' },
            allowDragAndDrop: true,
            fullRowSelect: false,
            nodeDropped: nodeDrop,
            nodeDragStop: nodeDrop
        },'#tree2');
    });
    afterEach((): void => {
        if (treeObj)
            treeObj.destroy();
        if (treeObj1)
            treeObj1.destroy();
        document.body.innerHTML = '';
    });
    it('testing with target as text', () => {
        let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
        let ul: Element[] = <Element[] & NodeListOf<Element>>treeObj1.element.querySelectorAll('ul');
         expect(treeObj1.element.querySelectorAll('li').length).toBe(0);
        let mousedown: any = getEventObject('MouseEvents', 'mousedown', treeObj.element, li[2].querySelector('.e-list-text'), 15, 10);
        EventHandler.trigger(treeObj.element, 'mousedown', mousedown);
        let mousemove: any = getEventObject('MouseEvents', 'mousemove', treeObj.element, li[2].querySelector('.e-list-text'), 15, 70);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove.srcElement = mousemove.target = mousemove.toElement = treeObj1.element;
        mousemove = setMouseCordinates(mousemove, 5, 275);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        let mouseup: any = getEventObject('MouseEvents', 'mouseup', treeObj1.element, treeObj1.element);
        mouseup.type = 'mouseup';
        EventHandler.trigger(<any>(document), 'mouseup', mouseup);
        let event = {offsetY: 43, offsetHeight: 300};
        let dragData = {draggable: treeObj.element, draggedElement: treeObj.element, helper: document.querySelector('.e-drag-item') };
        let e = {dragData: dragData, droppedElement: document.querySelector('.e-drag-item'), event: event, target: treeObj1.element};
        //treeObj1.dropAction(e);
        let newli: Element[] = <Element[] & NodeListOf<Element>>treeObj1.element.querySelectorAll('li');
        expect(li[2].getAttribute('aria-level')).toBe('1');
    });
    });
    describe('Get all checkednodes', function () {
            let treeObj: any;
            let mouseEventArgs: any;
            let tapEvent: any;
            beforeEach((): void => {
                treeObj = undefined;
                let ele: HTMLElement = createElement('div', { id: 'tree1' });
                document.body.appendChild(ele);
                tapEvent = {
                    originalEvent: mouseEventArgs,
                    tapCount: 1
                };
                mouseEventArgs = {
                    preventDefault: function () { },
                    stopImmediatePropagation: function () { },
                    target: null,
                    type: null,
                    shiftKey: false,
                    ctrlKey: false
                };
            });
            afterEach((): void => {
                if (treeObj)
                    treeObj.destroy();
                document.body.innerHTML = '';
            });
                
            it('Get all checkednodes when collapsed testing', () => {
                treeObj = new TreeView({ 
                    fields: { dataSource: hierarchicalData1 , id: "nodeId", text: "nodeText", child: "nodeChild", isChecked:"nodeChecked" },
                    showCheckBox: true
                },'#tree1');
                treeObj.checkedNodes= ['03'];
                treeObj.dataBind();     
                expect(treeObj.getAllCheckedNodes().length).toBe(6);
            });
            it('Get all checkednodes when expanded testing', () => {
                treeObj = new TreeView({ 
                    fields: { dataSource: hierarchicalData1 , id: "nodeId", text: "nodeText", child: "nodeChild", isChecked:"nodeChecked" },
                    showCheckBox: true
                },'#tree1');
                treeObj.checkedNodes= ['01', '04'];
                treeObj.dataBind();     
                expect(treeObj.getAllCheckedNodes().length).toBe(11);
            });
            it('Get all checkednodes with listdata', () => {
                treeObj = new TreeView({ 
                    fields: { dataSource: localData },
                    showCheckBox: true
                },'#tree1');
                treeObj.checkedNodes= ['1'];
                treeObj.dataBind();
                treeObj.getAllCheckedNodes();
                expect(treeObj.getAllCheckedNodes().length).toBe(15);
            });
            it('Get all checkednodes with isChecked enabled', () => {
                treeObj = new TreeView({ 
                    fields: { dataSource: localData6, isChecked: "isChecked", id: "nodeId", parentID: "nodePid", hasChildren: "hasChild", text: "nodeText" },
                    showCheckBox: true
                },'#tree1');
                treeObj.getAllCheckedNodes();
            });
            it('Get all checkednodes with isChecked enabled for child', () => {
                treeObj = new TreeView({ 
                    fields: { dataSource: localData6, isChecked: "isChecked", id: "nodeId", parentID: "nodePid", hasChildren: "hasChild", text: "nodeText" },
                    showCheckBox: true
                },'#tree1');
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                mouseEventArgs.target = li[0].querySelector('.e-icons');
                treeObj.touchClickObj.tap(tapEvent);
            });
        });
        describe('Checking for isChecked set as false', () => {
            let mouseEventArgs: any;
            let tapEvent: any;
            let keyboardEventArgs: any = {
                preventDefault: (): void => {},
                action: null
            };
            let treeObj: any;
            let i: number = 0;
            beforeEach((): void => {
                mouseEventArgs = {
                    preventDefault: (): void => {},
                    stopImmediatePropagation: (): void => {},
                    target: null,
                    type: null,
                    shiftKey: false,
                    ctrlKey: false
                };
                tapEvent = {
                    originalEvent: mouseEventArgs,
                    tapCount: 1
                };
                treeObj = undefined;
                i = 0;
                let ele: HTMLElement = createElement('div', { id: 'tree1' });
                document.body.appendChild(ele);
            });
            afterEach((): void => {
                if (treeObj)
                    treeObj.destroy();
                document.body.innerHTML = '';
            });
            it('Parent checked and child isChecked set as false testing', () => {
                treeObj = new TreeView({ 
                    fields: { dataSource: localData6, isChecked: "isChecked", id: "nodeId", parentID: "nodePid", hasChildren: "hasChild", text: "nodeText" },
                    showCheckBox: true,
                    checkedNodes: ["02"]
                },'#tree1');
                let li1: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                mouseEventArgs.target = li1[1].querySelector('.e-icons');
                treeObj.touchClickObj.tap(tapEvent);
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            });
        });
        describe('Selected Node on loadondemand enabled', () => {
            let treeObj: any;
            let mouseEventArgs: any;
            let tapEvent: any;
            beforeEach((): void => {
                mouseEventArgs = {
                    preventDefault: (): void => {},
                    stopImmediatePropagation: (): void => {},
                    target: null,
                    type: null,
                    shiftKey: false,
                    ctrlKey: false,
                    originalEvent:{target:null}
                };
                tapEvent = {
                    originalEvent: mouseEventArgs,
                    tapCount: 1
                };
                treeObj = undefined;
                let ele: HTMLElement = createElement('div', { id: 'tree1' });
                document.body.appendChild(ele);
            });
            afterEach((): void => {
                if (treeObj)
                treeObj.destroy();
                document.body.innerHTML = '';
            });
            it('Local data testing', (done: Function) => {
                treeObj = new TreeView({ 
                    fields: { dataSource: localData },
                    allowMultiSelection: true,
                    selectedNodes: ['1','2']
                },'#tree1');
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                expect(li[0].classList.contains('e-active')).toBe(true);
                mouseEventArgs.target = li[0].querySelector('.e-list-text');
                tapEvent.tapCount = 2;
                treeObj.touchExpandObj.tap(tapEvent);
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function() {
                        expect(li[0].querySelector('[data-uid="2"]').classList.contains('e-active')).toBe(true);
                        done();
                    }, 450);
            });
            it('Hierarchial data testing', (done: Function) => {
                treeObj = new TreeView({ 
                    fields: { dataSource: hierarchicalData },
                    allowMultiSelection: true,
                    selectedNodes: ['1', '2']
                },'#tree1');
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                expect(li[0].classList.contains('e-active')).toBe(true);
                mouseEventArgs.target = li[0].querySelector('.e-list-text');
                tapEvent.tapCount = 2;
                treeObj.touchExpandObj.tap(tapEvent);
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function() {
                        expect(li[0].querySelector('[data-uid="2"]').classList.contains('e-active')).toBe(true);
                        done();
                    }, 450);
            });
    });
    describe('Selected Node on loadondemand enabled', () => {
        let mouseEventArgs: any = {
            preventDefault: (): void => {},
            stopImmediatePropagation: (): void => {},
            target: null,
            type: null,
            shiftKey: false,
            ctrlKey: false
        };
        let tapEvent: any = {
            originalEvent: mouseEventArgs,
            tapCount: 1
        };
        let treeObj: any;
        let ele: HTMLElement = createElement('div', { id: 'tree1' });
        let dataManager1: DataManager;
        beforeAll((done: Function) => {
            jasmine.Ajax.install();
            dataManager1 = new DataManager({ url: '/TreeView/remoteData', offline: true })
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify({d: remoteData3_1, __count: 4})
            });
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(ele);
            treeObj = new TreeView({ 
                fields: { dataSource: dataManager1, id: 'nodeId', text: 'nodeText', iconCss: 'nodeIcon', imageUrl: 'nodeImage', tooltip: 'nodeTooltip',child: 'nodeChild'
                },
                fullRowSelect: false,
                allowMultiSelection: true,
                selectedNodes: ['01', '02-01'],
                dataBound: dataBound,
            });
            treeObj.appendTo('#tree1');
        });
        afterAll(() => {
            if (ele)
                ele.remove();
            document.body.innerHTML = '';
            jasmine.Ajax.uninstall();
        });
        it('Remote data testing', (done: Function) => {        
            let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
            expect(li[0].classList.contains('e-active')).toBe(true);
            tapEvent.tapCount = 2;
            mouseEventArgs.target = li[1].querySelector('.e-list-text');
            treeObj.touchExpandObj.tap(tapEvent);
            expect(li[1].querySelector('[data-uid="02-01"]').classList.contains('e-active')).toBe(true);
            done();
            });
        });
     describe('Checked Node on loadondemand enabled', () => {
        let treeObj: any;
        let mouseEventArgs: any;
        let tapEvent: any;
        beforeEach((): void => {
            mouseEventArgs = {
                preventDefault: (): void => {},
                stopImmediatePropagation: (): void => {},
                target: null,
                type: null,
                shiftKey: false,
                ctrlKey: false,
                originalEvent:{target:null}
            };
            tapEvent = {
                originalEvent: mouseEventArgs,
                tapCount: 1
            };
            treeObj = undefined;
            let ele: HTMLElement = createElement('div', { id: 'tree1' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (treeObj)
            treeObj.destroy();
            document.body.innerHTML = '';
        });
        it('Local data testing', ()=> {
            treeObj = new TreeView({ 
                fields: { dataSource: localData },showCheckBox: true, checkedNodes: ['1', '30'] 
            },'#tree1');
            let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
            expect(treeObj.checkedNodes.length === 16 ).toBe(true);
            treeObj.checkedNodes = ['10'];
            treeObj.dataBind();
            expect(treeObj.checkedNodes.length === 1 ).toBe(true);
            treeObj.checkedNodes = ['25'];
            treeObj.dataBind();
            expect(treeObj.checkedNodes.length === 1 ).toBe(true);
            expect(li[2].querySelector('.e-stop')).not.toBe(null);
            treeObj.checkAll();
            treeObj.checkedNodes = ['24'];
            treeObj.dataBind();
            expect(treeObj.checkedNodes.length === 4 ).toBe(true);
            expect(li[2].querySelector('.e-stop')).not.toBe(null);
            treeObj.checkedNodes = ['8'];
            treeObj.dataBind();
            expect(treeObj.checkedNodes.length === 4 ).toBe(true);
            expect(li[0].querySelector('.e-stop')).not.toBe(null);
            treeObj.expandAll(['1']);
            treeObj.dataBind();
            expect(li[0].querySelectorAll('li')[1].querySelector('.e-check')).not.toBe(null);
            treeObj.uncheckAll(['8']);
            treeObj.dataBind();
            expect(treeObj.checkedNodes.length === 0).toBe(true);
            treeObj.checkedNodes = ['17', '18', '19', '20', '21', '22']
            expect(treeObj.checkedNodes.length === 6).toBe(true);
            treeObj.autoCheck = false;
            treeObj.dataBind();
            treeObj.checkedNodes = ['21'];
            treeObj.dataBind();
             expect(treeObj.checkedNodes.length === 1).toBe(true);
        });
         it('Local data testing with autocheck false', ()=> {
            treeObj = new TreeView({ 
                fields: { dataSource: localData },showCheckBox: true, autoCheck : false, checkedNodes: ['1', '10'] 
            },'#tree1');
            let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
            expect(treeObj.checkedNodes.length === 2 ).toBe(true);
            treeObj.checkedNodes = ['25'];
            treeObj.dataBind();
            expect(treeObj.checkedNodes.length === 1 ).toBe(true);
            expect(li[0].querySelector('.e-stop')).toBe(null);
            treeObj.checkedNodes = ['24'];
            expect(treeObj.checkedNodes.length === 1 ).toBe(true);
            treeObj.checkAll();
            treeObj.dataBind();
            expect(treeObj.checkedNodes.length === 30 ).toBe(true);
            treeObj.uncheckAll();
            treeObj.dataBind();
            expect(treeObj.checkedNodes.length === 0 ).toBe(true);
        });
          it('local data binding with indeterminate state', () => {
                treeObj = new TreeView({ 
                    fields: { dataSource: localData7,  id: 'id', parentID: 'pid', text: 'name', hasChildren: 'hasChild',selected: 'isSelected', isChecked: 'isChecked' },
                    showCheckBox: true,
                    checkedNodes: ['16', '8','9', '10', '4', '27'],
                },'#tree1');
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                let checkEle: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-check');
                expect(checkEle.length).toBeGreaterThan(1);
                expect(treeObj.checkedNodes.length === 18 ).toBe(true);
                treeObj.checkedNodes = ['26'];
                treeObj.dataBind();
                expect(treeObj.checkedNodes.length === 1 ).toBe(true);
                treeObj.checkedNodes = (['8', '9', '10']);
                treeObj.dataBind();
                expect(treeObj.checkedNodes.length === 4 ).toBe(true);
                treeObj.checkedNodes = ['19'];
                treeObj.dataBind();
                treeObj.expandAll(['16']);
                expect(treeObj.checkedNodes.length === 1 ).toBe(true);
                treeObj.checkAll(['24']);
                treeObj.dataBind();
                expect(treeObj.checkedNodes.length === 4 ).toBe(true);
                treeObj.uncheckAll();
                treeObj.checkAll(['1']);
                expect(treeObj.checkedNodes.length === 5 ).toBe(true);
        });
         it('local data binding with expanded state', () => {
                treeObj = new TreeView({ 
                    fields: { dataSource: localData7,  id: 'id', parentID: 'pid', text: 'name', hasChildren: 'hasChild',selected: 'isSelected', isChecked: 'isChecked' },
                  expandedNodes: ['24', '21']
                },'#tree1');
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                expect(treeObj.expandedNodes.length === 2 ).toBe(true);
                treeObj.expandAll(['7']);
                treeObj.dataBind();
        });
         it('local data binding with expanded state', () => {
                treeObj = new TreeView({ 
                    fields: { dataSource: localData7,  id: 'id', parentID: 'pid', text: 'name', hasChildren: 'hasChild',selected: 'isSelected', isChecked: 'isChecked' },
                  expandedNodes: ['24']
                },'#tree1');
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                treeObj.expandAll(['21']);
        });
       it('hierarchical data binding', () => {
                treeObj = new TreeView({ 
                    fields: { dataSource: hierarchicalData1 , id: "nodeId", text: "nodeText", child: "nodeChild", isChecked:"nodeChecked" },
                    showCheckBox: true,
                    checkedNodes: ['01', '03', '03-03']                    
                },'#tree1');
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                let checkEle: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-check');
                expect(checkEle.length).toBeGreaterThan(1);
                expect(treeObj.checkedNodes.length === 11 ).toBe(true);
                treeObj.checkedNodes = ['05-03'];
                treeObj.dataBind();
                expect(treeObj.checkedNodes.length === 1 ).toBe(true);
                treeObj.checkAll(['04-04']);
                treeObj.dataBind();
                expect(treeObj.checkedNodes.length === 2 ).toBe(true);
                treeObj.checkedNodes = ['04-01'];
                treeObj.dataBind();
                expect(treeObj.checkedNodes.length === 4 ).toBe(true);
                expect(li[3].querySelector('.e-stop')).not.toBe(null);
                treeObj.expandAll(['04']);
                expect(li[3].querySelectorAll('li')[0].querySelector('.e-check')).not.toBe(null);
                treeObj.checkedNodes = ['03-01', '03-02', '03-03', '03-04', '03-05'];
                treeObj.dataBind();
                expect(treeObj.checkedNodes.length === 6).toBe(true);
                expect(li[2].querySelector('.e-check')).not.toBe(null);
        });
        it('hierarchical data binding with autocheck disabled', () => {
                treeObj = new TreeView({ 
                    fields: { dataSource: hierarchicalData6 , id: "nodeId", text: "nodeText", child: "nodeChild", isChecked:"nodeChecked" },
                    showCheckBox: true,
                    autoCheck: false,
                    checkedNodes: ['01', '03', '04-01-02']                    
                },'#tree1');
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                let checkEle: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-check');
                expect(treeObj.checkedNodes.length === 4 ).toBe(true);
                treeObj.checkedNodes = ['05-03'];
                treeObj.dataBind();
                expect(treeObj.checkedNodes.length === 1 ).toBe(true);
                treeObj.checkAll(['04-04']);
                treeObj.dataBind();
                expect(treeObj.checkedNodes.length === 2 ).toBe(true);
                treeObj.checkedNodes = ['04-01'];
                treeObj.dataBind();
                expect(treeObj.checkedNodes.length === 1 ).toBe(true);
                expect(li[3].querySelector('.e-stop')).toBe(null);
                treeObj.expandAll(['04']);
                expect(li[3].querySelectorAll('li')[0].querySelector('.e-check')).not.toBe(null);
                treeObj.autoCheck = true;
                treeObj.checkedNodes = ['03'];
                treeObj.dataBind();
                expect(treeObj.checkedNodes.length === 6 ).toBe(true);
                treeObj.uncheckAll();
                treeObj.dataBind();
                treeObj.checkAll(['01']);
                treeObj.dataBind();
                expect(treeObj.checkedNodes.length === 2).toBe(true);
        });
        it('hierarchical data binding with indeterminate state', () => {
                treeObj = new TreeView({ 
                    fields: { dataSource: hierarchicalData6 , id: "nodeId", text: "nodeText", child: "nodeChild", isChecked:"nodeChecked" },
                    showCheckBox: true,
                    checkedNodes: ['01', '03', '04-01-02', '02-01']                    
                },'#tree1');
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                let checkEle: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-check');
                expect(checkEle.length).toBeGreaterThan(1);
                expect(treeObj.checkedNodes.length === 12 ).toBe(true);
                treeObj.expandAll(['02']);
                treeObj.dataBind();
                treeObj.checkedNodes = ['05-03'];
                treeObj.dataBind();
                expect(treeObj.checkedNodes.length === 1 ).toBe(true);
                treeObj.checkedNodes = ['04-01-01'];
                treeObj.dataBind();
                treeObj.expandAll(['04']);
                treeObj.dataBind();
                expect(treeObj.checkedNodes.length === 1 ).toBe(true);
                treeObj.checkAll(['04-04']);
                treeObj.dataBind();
                expect(treeObj.checkedNodes.length === 2 ).toBe(true);
                treeObj.checkedNodes = ['04-01'];
                treeObj.dataBind();
                expect(treeObj.checkedNodes.length === 4 ).toBe(true);
                expect(li[3].querySelector('.e-stop')).not.toBe(null);
                treeObj.expandAll(['04']);
                expect(li[3].querySelectorAll('li')[0].querySelector('.e-check')).not.toBe(null);
               
        });
         it('hierarchical data binding with indeterminate state', () => {
                treeObj = new TreeView({ 
                    fields: { dataSource: hierarchicalData6 , id: "nodeId", text: "nodeText", child: "nodeChild", isChecked:"nodeChecked" },
                    expandedNodes: ['04-01', '04', '02']                   
                },'#tree1');
                treeObj.expandAll(['04']);
                treeObj.dataBind();
        });
       
 });
    describe('Checked Node on loadondemand enabled', () => {
        let mouseEventArgs: any = {
            preventDefault: (): void => {},
            stopImmediatePropagation: (): void => {},
            target: null,
            type: null,
            shiftKey: false,
            ctrlKey: false
        };
        let tapEvent: any = {
            originalEvent: mouseEventArgs,
            tapCount: 1
        };
        let treeObj: any;
        let ele: HTMLElement = createElement('div', { id: 'tree1' });
        let dataManager1: DataManager;
        beforeAll((done: Function) => {
            jasmine.Ajax.install();
            dataManager1 = new DataManager({ url: '/TreeView/remoteData', offline: true })
             this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify({d: remoteData3_1, __count: 4})
            });
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(ele);
            treeObj = new TreeView({ 
                fields: { dataSource: dataManager1, id: 'nodeId', text: 'nodeText', iconCss: 'nodeIcon', imageUrl: 'nodeImage', tooltip: 'nodeTooltip',child: 'nodeChild'
            },
                showCheckBox: true,
                checkedNodes: ['01', '02-01'],
                fullRowSelect: false,
                dataBound: dataBound,
            });
            treeObj.appendTo('#tree1');
           
        });
        afterAll(() => {
            if (ele)
                ele.remove();
            document.body.innerHTML = '';
            jasmine.Ajax.uninstall();
        });
        it('Remote data testing', () => {
            let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
            expect(treeObj.checkedNodes.length === 3).toBe(true);
            treeObj.checkAll(['02-02']);
            treeObj.dataBind();
            expect(treeObj.checkedNodes.length === 5).toBe(true);
        });
    });

        describe('Load on demand for TreeView', () => {
            let treeObj: any;
            beforeEach(():void => {
                treeObj = undefined;
                let ele: HTMLElement = createElement('div', { id: 'tree' });
                document.body.appendChild(ele);
            });
            afterEach((): void => {
                if (treeObj)
                    treeObj.destroy();
                document.body.innerHTML = '';
            });
            it('Local data', () => {
                treeObj = new TreeView({
                    fields: { dataSource: localData},
                    loadOnDemand: false
                }, '#tree');
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                expect(li[3].textContent === "Creative Acrylic").toBe(true);
            });
            it('Hierarchial data', () => {
                treeObj = new TreeView({
                    fields: { dataSource: hierarchicalData },
                    loadOnDemand: false
                }, '#tree');
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                expect(li[3].textContent === "Creative Acrylic").toBe(true);
            });
        });
        describe('LoadOnDemand for hierarchial data testing', () => {
            let treeObj: any;
            let mouseEventArgs: any;
            let tapEvent: any;
            beforeEach((): void => {
                mouseEventArgs = {
                    preventDefault: (): void => {},
                    stopImmediatePropagation: (): void => {},
                    target: null,
                    type: null,
                    shiftKey: false,
                    ctrlKey: false,
                    originalEvent:{ target: null}
                };
                tapEvent = {
                    originalEvent: mouseEventArgs,
                    tapCount: 1
                };
                treeObj = undefined;
                let ele: HTMLElement = createElement('div', { id: 'tree1' });
                document.body.appendChild(ele);
            });
            afterEach((): void => {
                if (treeObj)
                treeObj.destroy();
                document.body.innerHTML = '';
            });
            it('selectedNodes property testing', (done: Function) => {
                treeObj = new TreeView({ 
                    fields: { dataSource: hierarchicalData },
                    selectedNodes: ['3'],
                    loadOnDemand: false
                },'#tree1');
                    let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                    expect(li[2].classList.contains('e-active')).toBe(true);
                    done();
            });
            it('sortOrder property testing', (done: Function) => {
                treeObj = new TreeView({ 
                    fields: { dataSource: hierarchicalData1, id: "nodeId", text: "nodeText", child: "nodeChild",
                    iconCss: 'nodeIcon', imageUrl: 'nodeImage', tooltip: 'nodeTooltip', htmlAttributes: 'nodeHtmlAttr', selected: 'nodeSelected' },
                    sortOrder: 'Ascending',
                    loadOnDemand: false
                },'#tree1');
                    let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                    expect(li[1].textContent === "Environment Pollution.docx").toBe(true);
                    expect(li[21].textContent === "Wind.jpg").toBe(true);
                    done();
            });
            it('expandOn property testing with None', (done: Function) => {
                treeObj = new TreeView({ 
                    fields: { dataSource: hierarchicalData1, id: "nodeId", text: "nodeText", child: "nodeChild",
                    iconCss: 'nodeIcon', imageUrl: 'nodeImage', tooltip: 'nodeTooltip', },
                    fullRowSelect: false,
                    expandOn: "None",
                    loadOnDemand: false
                },'#tree1');
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                    tapEvent.tapCount = 2;
                    mouseEventArgs.target = li[0].querySelector('.e-list-text');
                    expect(li[0].querySelector('.e-icons').classList.contains('e-icon-expandable')).toBe(true);
                    expect(li[0].childElementCount).toBe(2);
                    expect(li[0].querySelector('.e-list-item').textContent === "Gouttes.mp3").toBe(true);
                    treeObj.touchClickObj.tap(tapEvent);
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function() {
                        expect(li[1].classList.contains('e-icons')).toBe(false);
                        done();
                    }, 450);
            });
            it('expandOn property testing with Click', (done: Function) => {
                treeObj = new TreeView({ 
                    fields: { dataSource: hierarchicalData1, id: "nodeId", text: "nodeText", child: "nodeChild",
                    iconCss: 'nodeIcon', imageUrl: 'nodeImage', tooltip: 'nodeTooltip', },
                    fullRowSelect: false,
                    expandOn: "Click",
                    loadOnDemand: false
                },'#tree1');
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                    mouseEventArgs.target = li[0].querySelector('.e-list-text');
                    expect(li[0].querySelector('.e-icons').classList.contains('e-icon-expandable')).toBe(true);
                    expect(li[0].childElementCount).toBe(2);
                    expect(li[0].querySelector('.e-list-item').textContent === "Gouttes.mp3").toBe(true);
                    treeObj.touchExpandObj.tap(tapEvent);
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function() {
                        expect(li[1].classList.contains('e-icons')).toBe(false);
                        done();
                    }, 450);
            });
            it('allowMultiSelection property testing', (done: Function) => {
                treeObj = new TreeView({ 
                    fields: { dataSource: hierarchicalData3, id: "nodeId", text: "nodeText", child: "nodeChild", selected: 'nodeSelected1', },
                    allowMultiSelection: true,
                    loadOnDemand: false,
                    selectedNodes: ['05-02']
                },'#tree1');
                    let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                    expect(li[22].classList.contains('e-active')).toBe(true);
                    expect(treeObj.selectedNodes.length).toBe(1);
                    mouseEventArgs.ctrlKey = true;
                    mouseEventArgs.target = li[1].querySelector('.e-list-text');
                    treeObj.touchClickObj.tap(tapEvent);
                    expect(li[1].classList.contains('e-active')).toBe(true);
                    expect(treeObj.selectedNodes.length).toBe(2);
                    done();
            });
            it('allowMultiSelection property testing with selectedNodes', (done: Function) => {
                treeObj = new TreeView({ 
                    fields: { dataSource: hierarchicalData3, id: "nodeId", text: "nodeText", child: "nodeChild", selected: 'nodeSelected1', expanded: 'nodeExpanded1' },
                    allowMultiSelection: true,
                    selectedNodes: ['02', '03', '05-02'],
                    loadOnDemand: false
                },'#tree1');
                    let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                    expect(treeObj.selectedNodes.length).toBe(3);
                    expect(li[22].classList.contains('e-active')).toBe(true);
                    done();
            });
            it('template support testing with string', (done: Function) => {
                treeObj = new TreeView({ 
                    fields: { dataSource: hierarchicalData1, id: "nodeId", text: "nodeText", child: "nodeChild", expanded: 'nodeExpanded1' },
                    nodeTemplate: '${if(nodeChild == undefined)}<b>${nodeText}</b>${else}<i>${nodeText}</i>${/if}',
                    loadOnDemand: false
                },'#tree1');
                    let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-text-content');
                    expect(li[0].querySelector('i')).not.toBe(null);
                    expect(li[0].querySelector('b')).toBe(null);
                    expect(li[3].textContent === "Naturals.mp4").toBe(true);
                    expect(li[3].querySelector('b')).not.toBe(null);
                    expect(li[3].querySelector('i')).toBe(null);
                    done();
            });
            it('expandedNodes property testing', (done: Function) => {
                treeObj = new TreeView({ 
                    fields: { dataSource: hierarchicalData },
                    expandedNodes: ['12', '16', '30'],
                    loadOnDemand: false
                },'#tree1');
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                expect(li.length).toBe(30);
                expect(treeObj.expandedNodes.length).toBe(2);
                expect(treeObj.expandedNodes).not.toContain('30');
                expect(treeObj.expandedNodes).toContain('12');
                mouseEventArgs.target = li[0].querySelector('.e-icons');
                treeObj.touchClickObj.tap(tapEvent);
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    expect(li[11].querySelector('.e-icons').classList.contains('e-icon-collapsible')).toBe(true);
                    done();
                }, 450)        
            });
            it('checkedNodes property testing', (done: Function) => {
                treeObj = new TreeView({ 
                    fields: { dataSource: hierarchicalData },
                    checkedNodes: ['3', '8', '16'],
                    loadOnDemand: false,
                    showCheckBox: true
                },'#tree1');
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                expect(li.length).toBe(30);
                treeObj.dataBind();
                expect(treeObj.checkedNodes.length).toBe(12);
                expect(treeObj.checkedNodes).toContain('9');
                expect(treeObj.checkedNodes).toContain('20');
                expect(li[8].querySelector('.e-checkbox-wrapper').getAttribute('aria-checked')).toBe("true");
                expect(li[19].querySelector('.e-checkbox-wrapper').getAttribute('aria-checked')).toBe("true");
                done();
            });
        });
        describe('loadOnDemand for local data testing', () => {
            let treeObj: any;
            let mouseEventArgs: any;
            let tapEvent: any;
            beforeEach((): void => {
                mouseEventArgs = {
                    preventDefault: (): void => {},
                    stopImmediatePropagation: (): void => {},
                    target: null,
                    type: null,
                    shiftKey: false,
                    ctrlKey: false,
                    originalEvent:{target:null}
                };
                tapEvent = {
                    originalEvent: mouseEventArgs,
                    tapCount: 1
                };
                treeObj = undefined;
                let ele: HTMLElement = createElement('div', { id: 'tree1' });
                document.body.appendChild(ele);
            });
            afterEach((): void => {
                if (treeObj)
                treeObj.destroy();
                document.body.innerHTML = '';
            });
            it('selectedNodes property testing', (done: Function) => {
                treeObj = new TreeView({ 
                    fields: { dataSource: localData },
                    selectedNodes: ['21'],
                    loadOnDemand: false
                },'#tree1');
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                    expect(li.length).toBe(30);
                    expect(li[20].classList.contains('e-active')).toBe(true);
                    done();
            });
            it('sortOrder property testing', (done: Function) => {
                treeObj = new TreeView({ 
                    fields: { dataSource: localData1, id: "nodeId", parentID: 'nodePid', text: "nodeText", hasChildren: "hasChild",
                    iconCss: 'nodeIcon', imageUrl: 'nodeImage', tooltip: 'nodeTooltip', htmlAttributes: 'nodeHtmlAttr', selected: 'nodeSelected' },
                    sortOrder: 'Ascending',
                    loadOnDemand: false
                },'#tree1');
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                    expect(li.length).toBe(25);
                    expect(li[4].textContent).toBe('Social Network.pdf');
                    done();
            });
            it('expandOn property testing with None', (done: Function) => {
                treeObj = new TreeView({ 
                    fields: { dataSource: localData },
                    expandOn: "None",
                    loadOnDemand: false
                },'#tree1');
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                    tapEvent.tapCount = 2;
                    mouseEventArgs.target = li[0].querySelector('.e-list-text');
                    expect(li[0].querySelector('.e-icons').classList.contains('e-icon-expandable')).toBe(true);
                    expect(li[0].childElementCount).toBe(3);
                    expect(li[1].querySelector('.e-list-item').textContent === "2 Acrylic Mediums").toBe(true);
                    treeObj.touchClickObj.tap(tapEvent);
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function() {
                        expect(li[1].classList.contains('e-icons')).toBe(false);
                        done();
                    }, 450);
            });
            it('expandOn property testing with Click', (done: Function) => {
                treeObj = new TreeView({ 
                    fields: { dataSource: localData },
                    expandOn: "Click",
                    loadOnDemand: false
                },'#tree1');
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                    mouseEventArgs.target = li[0].querySelector('.e-list-text');
                    expect(li[0].querySelector('.e-icons').classList.contains('e-icon-expandable')).toBe(true);
                    expect(li[0].childElementCount).toBe(3);
                    expect(li[1].querySelector('.e-list-item').textContent === "2 Acrylic Mediums").toBe(true);
                    treeObj.touchExpandObj.tap(tapEvent);
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function() {
                        expect(li[1].classList.contains('e-icons')).toBe(false);
                        done();
                    }, 450);
            });
            it('showCheckBox property testing', (done: Function) => {
                treeObj = new TreeView({ 
                    fields: { dataSource: localData },
                    showCheckBox: true,
                    loadOnDemand: false
                },'#tree1');
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                let checkEle: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-checkbox-wrapper');
                    expect(checkEle.length).toBe(30);
                    treeObj.checkedNodes = ["1"];
                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function() {
                        expect(li[1].querySelector('.e-checkbox-wrapper').getAttribute('aria-checked')).toBe('true');
                        done();
                    }, 450);
            });
            it('allowMultiSelection property testing', (done: Function) => {
                treeObj = new TreeView({ 
                    fields: { dataSource: localData },
                    allowMultiSelection: true,
                    loadOnDemand: false,
                    selectedNodes: ['13']
                },'#tree1');
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                    expect(li[12].classList.contains('e-active')).toBe(true);
                    expect(treeObj.selectedNodes.length).toBe(1);
                    mouseEventArgs.ctrlKey = true;
                    mouseEventArgs.target = li[1].querySelector('.e-list-text');
                    treeObj.touchClickObj.tap(tapEvent);
                    expect(li[1].classList.contains('e-active')).toBe(true);
                    expect(treeObj.selectedNodes.length).toBe(2);
                    done();
            });
            it('allowMultiSelection property testing with selectedNodes', (done: Function) => {
                treeObj = new TreeView({ 
                    fields: { dataSource: localData },
                    allowMultiSelection: true,
                    selectedNodes: ['5', '7', '16'],
                    loadOnDemand: false
                },'#tree1');
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                    expect(treeObj.selectedNodes.length).toBe(3);
                    expect(li[4].classList.contains('e-active')).toBe(true);
                    expect(li[6].classList.contains('e-active')).toBe(true);
                    expect(li[15].classList.contains('e-active')).toBe(true);
                    done();
            });
            it('expandedNodes property testing', (done: Function) => {
                treeObj = new TreeView({ 
                    fields: { dataSource: localData },
                    expandedNodes: ['8', '16', '22'],
                    loadOnDemand: false
                },'#tree1');
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                expect(li.length).toBe(30);
                expect(treeObj.expandedNodes.length).toBe(2);
                expect(treeObj.expandedNodes).not.toContain('22');
                expect(treeObj.expandedNodes).toContain('16');
                mouseEventArgs.target = li[0].querySelector('.e-icons');
                treeObj.touchClickObj.tap(tapEvent);
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    expect(li[7].querySelector('.e-icons').classList.contains('e-icon-collapsible')).toBe(true);
                    done();
            });
            it('checkedNodes property testing', (done: Function) => {
                treeObj = new TreeView({ 
                    fields: { dataSource: localData },
                    checkedNodes: ['8', '16'],
                    loadOnDemand: false,
                    showCheckBox: true
                },'#tree1');
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                expect(li.length).toBe(30);
                treeObj.dataBind();
                expect(treeObj.checkedNodes.length).toBe(11);
                expect(treeObj.checkedNodes).toContain('10');
                expect(treeObj.checkedNodes).toContain('20');
                expect(li[9].querySelector('.e-checkbox-wrapper').getAttribute('aria-checked')).toBe("true");
                expect(li[19].querySelector('.e-checkbox-wrapper').getAttribute('aria-checked')).toBe("true");
                done();
            });
        });
        describe('LoadOnDemand for remote data testing', () => {
        let mouseEventArgs: any = {
            preventDefault: (): void => {},
            stopImmediatePropagation: (): void => {},
            target: null,
            type: null,
            shiftKey: false,
            ctrlKey: false
        };
        let tapEvent: any = {
            originalEvent: mouseEventArgs,
            tapCount: 1
        };
        let treeObj: any;
        let ele: HTMLElement = createElement('div', { id: 'tree1' });
        let dataManager1: DataManager;
        beforeAll((done: Function) => {
            jasmine.Ajax.install();
            dataManager1 = new DataManager({ url: '/TreeView/remoteData', offline: true })
             this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify({d: remoteData3_1, __count: 2})
            });
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(ele);
            treeObj = new TreeView({ 
                fields: { dataSource: dataManager1, id: 'nodeId', text: 'nodeText', iconCss: 'nodeIcon', imageUrl: 'nodeImage', tooltip: 'nodeTooltip',child: 'nodeChild'
                },
                showCheckBox: true,
                allowMultiSelection: true,
                sortOrder: 'Ascending',
                fullRowSelect: false,
                dataBound:() => {
                    done();
                },
                loadOnDemand: false,
                expandOn: 'Click'
            });
            treeObj.appendTo('#tree1');
        });
        afterAll(() => {
            if (ele)
                ele.remove();
            document.body.innerHTML = '';
            jasmine.Ajax.uninstall();
        });
        it('Offline mode testing', (done: Function) => {        
            let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
            expect(li[1].textContent === "Gouttes.mp3").toBe(true);
            done();
        });
        it('selectedNodes property testing', (done: Function) => {
            treeObj.selectedNodes = ['01-01'];
            let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                setTimeout(function() {
                    let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>document.getElementById('tree1').querySelectorAll('li')
                    expect(li[1].classList.contains('e-active')).toBe(true);
                    done();
                }, 450);
        });
        it('sortOrder property testing', (done: Function) => {
            let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                setTimeout(function() {
                    let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>document.getElementById('tree1').querySelectorAll('li')
                    expect(li[3].textContent).toBe('Naturals.mp4');
                    done();
                }, 450);
        });
        it('expandOn property testing with Click', (done: Function) => {
            let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                mouseEventArgs.target = li[0].querySelector('.e-list-text');
                expect(li[0].querySelector('.e-icons').classList.contains('e-icon-expandable')).toBe(true);
                expect(li[0].childElementCount).toBe(2);
                treeObj.touchExpandObj.tap(tapEvent);
                setTimeout(function() {
                expect(li[1].querySelector('.e-icons') !== undefined).toBe(true);
                done();
                });
        });
        it('showCheckBox property testing', (done: Function) => {
            let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
            let checkEle: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-checkbox-wrapper');
                expect(checkEle.length).toBe(5);
                treeObj.checkedNodes = ["02-01"];
                setTimeout(function() {
                    let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>document.getElementById('tree1').querySelectorAll('li')
                    expect(li[3].querySelector('.e-checkbox-wrapper').getAttribute('aria-checked')).toBe('true');
                    done();
                }, 450);
        });
        it('expandedNodes property testing', (done: Function) => {
            treeObj.expandedNodes= ['01', '02'];
            let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
            expect(li.length).toBe(5);
            mouseEventArgs.target = li[0].querySelector('.e-icons');
            treeObj.touchClickObj.tap(tapEvent);
            setTimeout(function() {
                expect(li[3].querySelector('.e-icons') !== undefined).toBe(true);
                done();
            }, 450);
        });
        it('checkedNodes property testing', (done: Function) => {
            treeObj.checkedNodes= ['01-01', '02-01'];
            let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
            setTimeout(function() {
                let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>document.getElementById('tree1').querySelectorAll('li')
                expect(li[1].querySelector('.e-checkbox-wrapper').getAttribute('aria-checked')).toBe('true');
                done();
            }, 450);
        });
        it('updateNode method testing', (done: Function) => {
            let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
            expect(li[1].textContent === "Gouttes.mp3").toBe(true);
            treeObj.updateNode(li[1], 'Rain');
            expect(li[1].textContent === "Gouttes.mp3").toBe(true);
            treeObj.allowEditing = true;
            treeObj.dataBind();
            treeObj.updateNode(li[1], 'Rain');
            expect(li[1].textContent === "Rain").toBe(true);
            done();
        });
        it('allowMultiSelection property testing', (done: Function) => {
            treeObj.selectedNodes= ['01-01'];
            setTimeout(function() {
                let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>document.getElementById('tree1').querySelectorAll('li')
                expect(li[1].classList.contains('e-active')).toBe(true);
                expect(treeObj.selectedNodes.length).toBe(1);
                mouseEventArgs.ctrlKey = true;
                mouseEventArgs.target = li[3].querySelector('.e-list-text');
                treeObj.touchClickObj.tap(tapEvent);
                expect(li[3].classList.contains('e-active')).toBe(true);
                expect(treeObj.selectedNodes.length).toBe(2);
                done();
            }, 450);
        });
    });
    describe('loadOnDemand disabled for remote data source', () => {
        let mouseEventArgs: any = {
            preventDefault: (): void => {},
            stopImmediatePropagation: (): void => {},
            target: null,
            type: null,
            shiftKey: false,
            ctrlKey: false
        };
        let tapEvent: any = {
            originalEvent: mouseEventArgs,
            tapCount: 1
        };
        let treeObj: any;
        let ele: HTMLElement = createElement('div', { id: 'tree1' });
        let dataManager1: DataManager = new DataManager({ url: '/TreeView/remoteData' });
        beforeEach((done: Function) => {
            jasmine.Ajax.install();
            document.body.appendChild(ele);
            treeObj = new TreeView({ 
                fields: { dataSource: dataManager1, id: "nodeId", parentID: 'nodePid', text: "nodeText", hasChildren: "hasChild", 
                    tooltip: 'nodeTooltip', selected: 'nodeSelected'
                },
                allowMultiSelection: true,
                dataBound:() => {
                    done();
                },
            });
            treeObj.appendTo(ele);
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify({d: remoteData1, __count: 5})
            });
        });
        afterEach(() => {
            if (ele)
                ele.remove();
            document.body.innerHTML = '';
            jasmine.Ajax.uninstall();
        });
        it('functionality testing', (done: Function) => {
            expect(treeObj.getTreeData().length).toBe(25);
            tapEvent.tapCount = 2;
            let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
            mouseEventArgs.target = li[0].querySelector('.e-list-text');
            treeObj.touchExpandObj.tap(tapEvent);
            expect(treeObj.getTreeData().length).toBe(25);
            done();
        }, 100);
    });
    describe('Load on demand by setmodel testing', () => {
        let treeObj: any;
        beforeEach(():void => {
            treeObj = undefined;
            let ele: HTMLElement = createElement('div', { id: 'tree' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (treeObj)
                treeObj.destroy();
            document.body.innerHTML = '';
        });
        it('Local data', (done: Function) => {
            treeObj = new TreeView({
                fields: { dataSource: localData},
            }, '#tree');
            let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
            expect(li.length).toBe(10);
            treeObj.loadOnDemand = false;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 2000;
            setTimeout(function() {
                let li1: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                expect(li1.length).toBe(30);
                expect(li1[3].textContent === "Creative Acrylic").toBe(true);
                expect(li1[12].textContent === "Batman").toBe(true);
                done();
            }, 450);
        });
        it('Hierarchial data', (done: Function) => {
            treeObj = new TreeView({
                fields: { dataSource: hierarchicalData },
            }, '#tree');
            let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
            expect(li.length).toBe(10);
            treeObj.loadOnDemand = false;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 2000;
            setTimeout(function() {
                let li1: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                expect(li1.length).toBe(30);
                expect(li1[3].textContent === "Creative Acrylic").toBe(true);
                expect(li1[12].textContent === "Batman").toBe(true);
                done();
            }, 450);
            
        });
    });
    describe('Disable Node on loadondemand enabled', () => {
        let treeObj: any;
        let mouseEventArgs: any;
        let tapEvent: any;
        beforeEach((): void => {
            mouseEventArgs = {
                preventDefault: (): void => {},
                stopImmediatePropagation: (): void => {},
                target: null,
                type: null,
                shiftKey: false,
                ctrlKey: false,
                originalEvent:{target:null}
            };
            tapEvent = {
                originalEvent: mouseEventArgs,
                tapCount: 1
            };
            treeObj = undefined;
            let ele: HTMLElement = createElement('div', { id: 'tree1' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (treeObj)
            treeObj.destroy();
            document.body.innerHTML = '';
        });
        it('Local data testing', (done: Function) => {
            treeObj = new TreeView({ 
                fields: { dataSource: localData },
            },'#tree1');
            let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
            treeObj.disableNodes(['1', '2']);
            expect(li[0].classList.contains('e-disable')).toBe(true);
            mouseEventArgs.target = li[0].querySelector('.e-list-text');
            tapEvent.tapCount = 2;
            treeObj.touchExpandObj.tap(tapEvent);
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    expect(li[0].querySelector('[data-uid="2"]').classList.contains('e-disable')).toBe(true);
                    done();
                }, 450);
        });
        it('Hierarchial data testing', (done: Function) => {
            treeObj = new TreeView({ 
                fields: { dataSource: hierarchicalData },
            },'#tree1');
            let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
            treeObj.disableNodes(['1', '2']);
            expect(li[0].classList.contains('e-disable')).toBe(true);
            mouseEventArgs.target = li[0].querySelector('.e-list-text');
            tapEvent.tapCount = 2;
            treeObj.touchExpandObj.tap(tapEvent);
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function() {
                    expect(li[0].querySelector('[data-uid="2"]').classList.contains('e-disable')).toBe(true);
                    done();
                }, 450);
        });
    });
    describe('Disable Node on loadondemand enabled', () => {
        let mouseEventArgs: any = {
            preventDefault: (): void => {},
            stopImmediatePropagation: (): void => {},
            target: null,
            type: null,
            shiftKey: false,
            ctrlKey: false
        };
        let tapEvent: any = {
            originalEvent: mouseEventArgs,
            tapCount: 1
        };
        let treeObj: any;
        let ele: HTMLElement = createElement('div', { id: 'tree1' });
        let dataManager1: DataManager;
        beforeAll((done: Function) => {
            jasmine.Ajax.install();
            dataManager1 = new DataManager({ url: '/TreeView/remoteData', offline: true })
             this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify({d: remoteData3_1, __count: 4})
            });
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(ele);
            treeObj = new TreeView({ 
                fields: { dataSource: dataManager1, id: 'nodeId', text: 'nodeText', iconCss: 'nodeIcon', imageUrl: 'nodeImage', tooltip: 'nodeTooltip',child: 'nodeChild'
                },
                fullRowSelect: false,
                dataBound: dataBound,
            });
            treeObj.appendTo('#tree1');
           
        });
        afterAll(() => {
            if (ele)
                ele.remove();
            document.body.innerHTML = '';
            jasmine.Ajax.uninstall();
        });
        it('Remote data testing', (done: Function) => {        
            let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
            treeObj.disableNodes(['01', '02-01']);
            expect(li[0].classList.contains('e-disable')).toBe(true);
            tapEvent.tapCount = 2;
            mouseEventArgs.target = li[1].querySelector('.e-list-text');
            treeObj.touchExpandObj.tap(tapEvent);
            expect(li[1].querySelector('[data-uid="02-01"]').classList.contains('e-disable')).toBe(true);
            done();
        });
    });
    
    describe('actionFailure Event Testing for remote data offline', () => {
        let i = 0;
        function actionFailedFunction() { i++; }
        let ele: HTMLElement = createElement('div', { id: 'tree1' });
        let treeObj: any;
        beforeAll(() => {
            document.body.appendChild(ele);
            jasmine.Ajax.install();
            let dataManager1: DataManager = new DataManager({ url: '/TreeView/remoteData12111', offline: true });
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                'status': 404,
                'contentType': 'application/json',
                'responseText': 'Page not found'
            });
            treeObj = new TreeView({
                fields: {
                    dataSource: dataManager1, id: "nodeId", parentID: 'nodePid', text: "nodeText", hasChildren: "hasChild",
                    tooltip: 'nodeTooltip', selected: 'nodeSelected'
                },
                actionFailure: actionFailedFunction
            });
            treeObj.appendTo(ele);
        });
        afterAll(() => {
            ele.remove();
            jasmine.Ajax.uninstall();
        });
        it('actionFailure testing', (done: Function) => {
            setTimeout(function () {
                expect(i).toBe(1);
                done();
            }, 100);
        });
    });
    describe('actionFailure event triggered for invalid URL while fetching child data', () => {
        let mouseEventArgs: any = {
            preventDefault: (): void => { },
            stopImmediatePropagation: (): void => { },
            target: null,
            type: null,
            shiftKey: false,
            ctrlKey: false
        };
        let tapEvent: any = {
            originalEvent: mouseEventArgs,
            tapCount: 1
        };
        let treeObj: any;
        let i =0;
        function actionFailed(){
            i++;
        }
        let ele: HTMLElement = createElement('div', { id: 'tree1' });
        let dataManager1: DataManager = new DataManager({ url: '/TreeView/remoteData' });
        let originalTimeout: any;
        beforeEach((done: Function) => {
            jasmine.Ajax.install();
            document.body.appendChild(ele);
            treeObj = new TreeView({
                fields: {
                    dataSource: dataManager1, id: 'CustomerID', text: 'OrderID', iconCss: 'ShipCity', tooltip: 'ShipName', hasChildren: 'Freight', tableName: 'Employees', htmlAttributes: 'HtmlAttr', imageUrl: 'Image', selected: 'nodeSelected', navigateUrl: 'nodeUrl',
                    child: { dataSource: dataManager1, id: 'CustomerID', text: 'ShipCountry', parentID: 'OrderID', hasChildren: 'ShipCountry' }
                },
                dataBound: () => {
                    done();
                },
                actionFailure: actionFailed
            });
            treeObj.appendTo(ele);
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                status: 200,
                responseText: JSON.stringify({ d: remoteData, __count: 15 })
            });
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        });
        afterEach(() => {
            if (ele)
                ele.remove();
            document.body.innerHTML = '';
            jasmine.Ajax.uninstall();
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
        });
        it('functionality testing', (done: Function) => {
            expect(treeObj.element.querySelectorAll('li').length).toBe(15);
            expect(i).toBe(0);
            let newli: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
            mouseEventArgs.target = newli[1].querySelector('.e-icons');
            treeObj.touchClickObj.tap(tapEvent);
            this.request = jasmine.Ajax.requests.mostRecent();
            this.request.respondWith({
                'status': 404,
                'contentType': 'application/json',
                'responseText': 'Page not found'
            });
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(function () {
                expect(i).toBe(1);
                done();
            }, 100);
        });
    });
    describe('actionFailure event testing', () => {
        let actionFailedFunction: () => void = jasmine.createSpy('actionFailure');
        let elem: HTMLElement = createElement('div', { id: 'tree' });
        let treeObj: any;
        beforeAll(() => {
            jasmine.Ajax.install();
            document.body.appendChild(elem);
            let dataSource = new DataManager({
                url: '/test/db',
            }),
            treeObj = new TreeView({
                fields: {dataSource: dataSource},
                actionFailure: actionFailedFunction
            });
            treeObj.appendTo('#tree');
        });
        beforeEach((done: Function) => {
            let request: JasmineAjaxRequest = jasmine.Ajax.requests.mostRecent();
            request.respondWith({
                'status': 404,
                'contentType': 'application/json',
                'responseText': 'Page not found'
            });
            setTimeout(() => { done(); }, 100);
        });
        it('actionFailure testing', () => {
            expect(actionFailedFunction).toHaveBeenCalled();
        });
        afterAll(() => {
            elem.remove();
            jasmine.Ajax.uninstall();
        });
    });
    describe('CRUD operation testing', () => {
        describe('Delete operation', () => {
            let treeObj: any;
            let ele: HTMLElement = createElement('div', { id: 'tree1' });
            let j: number = 0;
            function dsChangeFn(): void {
                j++;
            }
            let dataManager1: DataManager = new DataManager({ url: '/TreeView/remoteData', removeUrl: '/TreeView/Delete' });
            beforeEach((done: Function) => {
                jasmine.Ajax.install();
                document.body.appendChild(ele);
                treeObj = new TreeView({
                    fields: {
                        dataSource: dataManager1, id: "nodeId", parentID: 'nodePid', text: "nodeText", hasChildren: "hasChild",
                        tooltip: 'nodeTooltip', selected: 'nodeSelected'
                    },
                    dataBound: () => {
                        done();
                    },
                    dataSourceChanged: dsChangeFn
                });
                treeObj.appendTo(ele);
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify({ d: remoteData2, __count: 2 })
                });
                j = 0;
            });
            afterEach(() => {
                if (ele)
                    ele.remove();
                document.body.innerHTML = '';
                jasmine.Ajax.uninstall();
            });
            it('remove nodes testing with a single node and the node type as string', (done: Function) => {
                expect(j).toEqual(0);
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                treeObj.removeNodes();
                expect(treeObj.getTreeData().length).toBe(2);
                treeObj.removeNodes(null);
                expect(j).toEqual(0);
                treeObj.removeNodes(['01']);
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify({ d: deletedRemoteData, __count: 2 })
                });
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function () {
                    expect(j).toEqual(1);
                    expect(treeObj.getTreeData().length).toBe(1);
                    done();
                }, 450);
            });
        });
        describe('Delete operation', () => {
            let treeObj: any;
            let ele: HTMLElement = createElement('div', { id: 'tree1' });
            let j: number = 0;
            function dsChangeFn(): void {
                j++;
            }
            let dataManager1: DataManager = new DataManager({ url: '/TreeView/remoteData', removeUrl: '/TreeView/Delete' });
            beforeEach((done: Function) => {
                jasmine.Ajax.install();
                document.body.appendChild(ele);
                treeObj = new TreeView({
                    fields: {
                        dataSource: dataManager1, id: "nodeId", parentID: 'nodePid', text: "nodeText", hasChildren: "hasChild",
                        tooltip: 'nodeTooltip', selected: 'nodeSelected'
                    },
                    dataBound: () => {
                        done();
                    },
                    dataSourceChanged: dsChangeFn
                });
                treeObj.appendTo(ele);
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify({ d: remoteData2, __count: 2 })
                });
                j = 0;
            });
            afterEach(() => {
                if (ele)
                    ele.remove();
                document.body.innerHTML = '';
                jasmine.Ajax.uninstall();
            });
            it('remove nodes testing with a single node and the node type as Element', (done: Function) => {
                expect(j).toEqual(0);
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                treeObj.removeNodes();
                expect(treeObj.getTreeData().length).toBe(2);
                treeObj.removeNodes(null);
                expect(j).toEqual(0);
                treeObj.removeNodes([li[0]]);
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify({ d: deletedRemoteData, __count: 2 })
                });
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function () {
                    expect(j).toEqual(1);
                    expect(treeObj.getTreeData().length).toBe(1);
                    done();
                }, 450);
            });
        });
        describe('Delete operation', () => {
            let treeObj: any;
            let ele: HTMLElement = createElement('div', { id: 'tree1' });
            let j: number = 0;
            function dsChangeFn(): void {
                j++;
            }
            let dataManager1: DataManager = new DataManager({ url: '/TreeView/remoteData', removeUrl: '/TreeView/Delete' });
            beforeEach((done: Function) => {
                jasmine.Ajax.install();
                document.body.appendChild(ele);
                treeObj = new TreeView({
                    fields: {
                        dataSource: dataManager1, id: "nodeId", parentID: 'nodePid', text: "nodeText", hasChildren: "hasChild",
                        tooltip: 'nodeTooltip', selected: 'nodeSelected'
                    },
                    dataBound: () => {
                        done();
                    },
                    dataSourceChanged: dsChangeFn
                });
                treeObj.appendTo(ele);
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify({ d: remoteData2, __count: 2 })
                });
                j = 0;
            });
            afterEach(() => {
                if (ele)
                    ele.remove();
                document.body.innerHTML = '';
                jasmine.Ajax.uninstall();
            });
            it('remove nodes testing with a multiple node and the node type as string', (done: Function) => {
                expect(j).toEqual(0);
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                treeObj.removeNodes();
                expect(treeObj.getTreeData().length).toBe(2);
                treeObj.removeNodes(null);
                expect(j).toEqual(0);
                treeObj.removeNodes(['01', '02']);
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify({ d: [], __count: 2 })
                });
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function () {
                    expect(j).toEqual(1);
                    expect(treeObj.getTreeData().length).toBe(0);
                    done();
                }, 450);
            });
        });
        describe('Delete operation', () => {
            let treeObj: any;
            let ele: HTMLElement = createElement('div', { id: 'tree1' });
            let j: number = 0;
            function dsChangeFn(): void {
                j++;
            }
            let dataManager1: DataManager = new DataManager({ url: '/TreeView/remoteData', removeUrl: '/TreeView/Delete' });
            beforeEach((done: Function) => {
                jasmine.Ajax.install();
                document.body.appendChild(ele);
                treeObj = new TreeView({
                    fields: {
                        dataSource: dataManager1, id: "nodeId", parentID: 'nodePid', text: "nodeText", hasChildren: "hasChild",
                        tooltip: 'nodeTooltip', selected: 'nodeSelected'
                    },
                    dataBound: () => {
                        done();
                    },
                    dataSourceChanged: dsChangeFn
                });
                treeObj.appendTo(ele);
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify({ d: remoteData2, __count: 2 })
                });
                j = 0;
            });
            afterEach(() => {
                if (ele)
                    ele.remove();
                document.body.innerHTML = '';
                jasmine.Ajax.uninstall();
            });
            it('remove nodes testing with a multiple node and the node type as Element', (done: Function) => {
                expect(j).toEqual(0);
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                treeObj.removeNodes();
                expect(treeObj.getTreeData().length).toBe(2);
                treeObj.removeNodes(null);
                expect(j).toEqual(0);
                treeObj.removeNodes([li[0], li[1]]);
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify({ d: [], __count: 2 })
                });
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function () {
                    expect(j).toEqual(1);
                    expect(treeObj.getTreeData().length).toBe(0);
                    done();
                }, 450);
            });
        });
        describe('Update operation', () => {
            let treeObj: any;
            let ele: HTMLElement = createElement('div', { id: 'tree1' });
            let j: number = 0;
            let beforeEdit: number = 0;
            let afterEdit: number = 0;
            function dsChangeFn(): void {
                j++;
            }
            function nodeBeforeEdit(): void {
                beforeEdit++;
            }
            function nodeAfterEdit(): void {
                afterEdit++;
            }
            let dataManager1: DataManager = new DataManager({ url: '/TreeView/remoteData', updateUrl: '/TreeView/Update' });
            beforeEach((done: Function) => {
                jasmine.Ajax.install();
                document.body.appendChild(ele);
                treeObj = new TreeView({
                    fields: {
                        dataSource: dataManager1, id: "nodeId", parentID: 'nodePid', text: "nodeText", hasChildren: "hasChild",
                        tooltip: 'nodeTooltip', selected: 'nodeSelected'
                    },
                    dataBound: () => {
                        done();
                    },
                    dataSourceChanged: dsChangeFn,
                    nodeEditing: nodeBeforeEdit,
                    nodeEdited: nodeAfterEdit
                });
                treeObj.appendTo(ele);
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify({ d: remoteData2, __count: 2 })
                });
                j = 0;
                beforeEdit = 0;
                afterEdit = 0;
            });
            afterEach(() => {
                if (ele)
                    ele.remove();
                document.body.innerHTML = '';
                jasmine.Ajax.uninstall();
            });
            it('rename node and the node type as string', (done: Function) => {
                expect(j).toEqual(0);
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                treeObj.updateNode(null);
                expect(j).toEqual(0);
                treeObj.updateNode('01', 'Rain');
                expect(beforeEdit).toEqual(0);
                treeObj.allowEditing = true;
                treeObj.dataBind();
                treeObj.updateNode('01', 'Rain');
                expect(beforeEdit).toEqual(1);
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify({ d: updatedremoteNode_1, __count: 1 })
                });
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function () {
                    expect(j).toEqual(1);
                    expect((li[0].querySelector('.e-list-text') as HTMLElement).textContent).toBe('Rain');
                    expect(afterEdit).toEqual(1);
                    done();
                }, 450);
            });
        });
        describe('Update operation', () => {
            let treeObj: any;
            let ele: HTMLElement = createElement('div', { id: 'tree1' });
            let j: number = 0;
            let beforeEdit: number = 0;
            let afterEdit: number = 0;
            function dsChangeFn(): void {
                j++;
            }
            function nodeBeforeEdit(): void {
                beforeEdit++;
            }
            function nodeAfterEdit(): void {
                afterEdit++;
            }
            let dataManager1: DataManager = new DataManager({ url: '/TreeView/remoteData', updateUrl: '/TreeView/Update' });
            beforeEach((done: Function) => {
                jasmine.Ajax.install();
                document.body.appendChild(ele);
                treeObj = new TreeView({
                    fields: {
                        dataSource: dataManager1, id: "nodeId", parentID: 'nodePid', text: "nodeText", hasChildren: "hasChild",
                        tooltip: 'nodeTooltip', selected: 'nodeSelected'
                    },
                    dataBound: () => {
                        done();
                    },
                    dataSourceChanged: dsChangeFn,
                    nodeEditing: nodeBeforeEdit,
                    nodeEdited: nodeAfterEdit
                });
                treeObj.appendTo(ele);
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify({ d: remoteData2, __count: 2 })
                });
                j = 0;
                beforeEdit = 0;
                afterEdit = 0;
            });
            afterEach(() => {
                if (ele)
                    ele.remove();
                document.body.innerHTML = '';
                jasmine.Ajax.uninstall();
            });
            it('rename node and the node type as Element', (done: Function) => {
                expect(j).toEqual(0);
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                treeObj.updateNode(null);
                expect(j).toEqual(0);
                treeObj.updateNode(li[0], 'Rain');
                expect(beforeEdit).toEqual(0);
                treeObj.allowEditing = true;
                treeObj.dataBind();
                treeObj.updateNode(li[0], 'Rain');
                expect(beforeEdit).toEqual(1);
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify({ d: updatedremoteNode_1, __count: 1 })
                });
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function () {
                    expect(j).toEqual(1);
                    expect((li[0].querySelector('.e-list-text') as HTMLElement).textContent).toBe('Rain');
                    expect(afterEdit).toEqual(1);
                    done();
                }, 450);
            });
        });
        describe('Insert operation', () => {
            let treeObj: any;
            let ele: HTMLElement = createElement('div', { id: 'tree1' });
            let j: number = 0;
            function dsChangeFn(): void {
                j++;
            }
            let dataManager1: DataManager = new DataManager({ url: '/TreeView/remoteData', insertUrl: '/TreeView/Insert' });
            beforeEach((done: Function) => {
                jasmine.Ajax.install();
                document.body.appendChild(ele);
                treeObj = new TreeView({
                    fields: {
                        dataSource: dataManager1, id: "nodeId", parentID: 'nodePid', text: "nodeText", hasChildren: "hasChild",
                        tooltip: 'nodeTooltip', selected: 'nodeSelected'
                    },
                    dataBound: () => {
                        done();
                    },
                    dataSourceChanged: dsChangeFn,
                });
                treeObj.appendTo(ele);
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify({ d: remoteData2, __count: 2 })
                });
                j = 0;
            });
            afterEach(() => {
                if (ele)
                    ele.remove();
                document.body.innerHTML = '';
                jasmine.Ajax.uninstall();
            });
            it('Add a single node with out target', (done: Function) => {
                expect(j).toEqual(0);
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                expect(treeObj.getTreeData().length).toBe(2);
                treeObj.addNodes(updatedremoteNode_1)
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify({ d: updatedremoteNode_1, __count: 1 })
                });
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function () {
                    expect(j).toEqual(1);
                    expect(treeObj.getTreeData().length).toBe(3);
                    let nli: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                    expect(nli.length).toBe(3);
                    expect((nli[2].querySelector('.e-list-text') as HTMLElement).textContent).toBe('Rain');
                    done();
                }, 450);
            });
        });
        describe('Insert operation', () => {
            let treeObj: any;
            let ele: HTMLElement = createElement('div', { id: 'tree1' });
            let j: number = 0;
            function dsChangeFn(): void {
                j++;
            }
            let dataManager1: DataManager = new DataManager({ url: '/TreeView/remoteData', insertUrl: '/TreeView/Insert' });
            beforeEach((done: Function) => {
                jasmine.Ajax.install();
                document.body.appendChild(ele);
                treeObj = new TreeView({
                    fields: {
                        dataSource: dataManager1, id: "nodeId", parentID: 'nodePid', text: "nodeText", hasChildren: "hasChild",
                        tooltip: 'nodeTooltip', selected: 'nodeSelected'
                    },
                    dataBound: () => {
                        done();
                    },
                    dataSourceChanged: dsChangeFn,
                });
                treeObj.appendTo(ele);
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify({ d: remoteData2, __count: 2 })
                });
                j = 0;
            });
            afterEach(() => {
                if (ele)
                    ele.remove();
                document.body.innerHTML = '';
                jasmine.Ajax.uninstall();
            });
            it('Add multiple node with out target', (done: Function) => {
                expect(j).toEqual(0);
                expect(treeObj.getTreeData().length).toBe(2);
                treeObj.addNodes(remoteData2_3);
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify({ d: remoteData2_3, __count: 1 })
                });
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function () {
                    expect(j).toEqual(1);
                    expect(treeObj.getTreeData().length).toBe(4);
                    let nli: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                    expect(nli.length).toBe(4);
                    expect((nli[2].querySelector('.e-list-text') as HTMLElement).textContent).toBe('Videos');
                    done();
                }, 450);
            });
        });
        describe('Insert operation', () => {
            let treeObj: any;
            let ele: HTMLElement = createElement('div', { id: 'tree1' });
            let j: number = 0;
            function dsChangeFn(): void {
                j++;
            }
            let dataManager1: DataManager = new DataManager({ url: '/TreeView/remoteData', insertUrl: '/TreeView/Insert' });
            beforeEach((done: Function) => {
                jasmine.Ajax.install();
                document.body.appendChild(ele);
                treeObj = new TreeView({
                    fields: { dataSource: dataManager1, id: "nodeId", parentID: 'nodePid', text: "nodeText", iconCss: 'icons', imageUrl: 'nodeImage1' },
                    dataBound: () => {
                        done();
                    },
                    dataSourceChanged: dsChangeFn,
                });
                treeObj.appendTo(ele);
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify({ d: remoteData1, __count: 2 })
                });
                j = 0;
            });
            afterEach(() => {
                if (ele)
                    ele.remove();
                document.body.innerHTML = '';
                jasmine.Ajax.uninstall();
            });
            it('Add a single node to target li', (done: Function) => {
                debugger
                let data: object = { nodeId: 'a12', nodeText: 'Santa maria' };
                expect(j).toEqual(0);
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                expect(treeObj.getTreeData().length).toBe(25);
                treeObj.addNodes([data], li[0]);
                let element: Element[] = li;
                this.request = jasmine.Ajax.requests.mostRecent()
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify({ d: updatedAddNodes, __count: 6 })
                });
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
               
                setTimeout(function () {
                    this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify({ d: remoteData1, __count: 2 })
                });
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                    setTimeout(function () {
                        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                        setTimeout(function () {
                            expect(j).toEqual(1);
                            expect(treeObj.getTreeData().length).toBe(26);
                            expect(element[0].querySelector('.e-list-parent').lastElementChild.getAttribute('data-uid')).toBe('a12');
                            done();
                        }, 450);
                    }, 450);
                }, 450);
            });
        });
    });

    describe('Action Failure event testing for the CRUD operation', () => {
        describe('For Delete operation', () => {
            let treeObj: any;
            let ele: HTMLElement = createElement('div', { id: 'tree1' });
            let j: number = 0;
            let k: number = 0;
            function dsChangeFn(): void {
                j++;
            }
            function actionFailed(): void {
                k++;
            }

            let dataManager1: DataManager = new DataManager({ url: '/TreeView/remoteData', removeUrl: '/TreeView/invalid' });
            beforeEach((done: Function) => {
                jasmine.Ajax.install();
                document.body.appendChild(ele);
                treeObj = new TreeView({
                    fields: {
                        dataSource: dataManager1, id: "nodeId", parentID: 'nodePid', text: "nodeText", hasChildren: "hasChild",
                        tooltip: 'nodeTooltip', selected: 'nodeSelected'
                    },
                    dataBound: () => {
                        done();
                    },
                    dataSourceChanged: dsChangeFn,
                    actionFailure: actionFailed
                });
                treeObj.appendTo(ele);
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify({ d: remoteData2, __count: 2 })
                });
                j = 0;
            });
            afterEach(() => {
                if (ele)
                    ele.remove();
                document.body.innerHTML = '';
                jasmine.Ajax.uninstall();
            });
            it('actionFailure event testing', (done: Function) => {
                expect(j).toEqual(0);
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                treeObj.removeNodes();
                expect(treeObj.getTreeData().length).toBe(2);
                treeObj.removeNodes(null);
                expect(j).toEqual(0);
                treeObj.removeNodes(['01']);
                let request: JasmineAjaxRequest = jasmine.Ajax.requests.mostRecent();
                request.respondWith({
                    'status': 404,
                    'contentType': 'application/json',
                    'responseText': 'Page not found'
                });
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function () {
                    expect(j).toEqual(0);
                    expect(k).toEqual(1);
                    expect(treeObj.getTreeData().length).toBe(2);
                    done();
                }, 450);
            });
        });
        describe('For Update operation', () => {
            let treeObj: any;
            let ele: HTMLElement = createElement('div', { id: 'tree1' });
            let j: number = 0;
            let k: number = 0;
            let beforeEdit: number = 0;
            let afterEdit: number = 0;
            function dsChangeFn(): void {
                j++;
            }
            function nodeBeforeEdit(): void {
                beforeEdit++;
            }
            function nodeAfterEdit(): void {
                afterEdit++;
            }
            function actionFailed(): void {
                k++;
            }

            let dataManager1: DataManager = new DataManager({ url: '/TreeView/remoteData', updateUrl: '/TreeView/Update' });
            beforeEach((done: Function) => {
                jasmine.Ajax.install();
                document.body.appendChild(ele);
                treeObj = new TreeView({
                    fields: {
                        dataSource: dataManager1, id: "nodeId", parentID: 'nodePid', text: "nodeText", hasChildren: "hasChild",
                        tooltip: 'nodeTooltip', selected: 'nodeSelected'
                    },
                    dataBound: () => {
                        done();
                    },
                    dataSourceChanged: dsChangeFn,
                    nodeEditing: nodeBeforeEdit,
                    nodeEdited: nodeAfterEdit,
                    actionFailure: actionFailed
                });
                treeObj.appendTo(ele);
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify({ d: remoteData2, __count: 2 })
                });
                j = 0;
                beforeEdit = 0;
                afterEdit = 0;
            });
            afterEach(() => {
                if (ele)
                    ele.remove();
                document.body.innerHTML = '';
                jasmine.Ajax.uninstall();
            });
            it('actionFailure event testing', (done: Function) => {
                expect(j).toEqual(0);
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                treeObj.updateNode(null);
                expect(j).toEqual(0);
                treeObj.updateNode(li[0], 'Rain');
                expect(beforeEdit).toEqual(0);
                treeObj.allowEditing = true;
                treeObj.dataBind();
                treeObj.updateNode(li[0], 'Rain');
                expect(beforeEdit).toEqual(1);
                let request: JasmineAjaxRequest = jasmine.Ajax.requests.mostRecent();
                request.respondWith({
                    'status': 404,
                    'contentType': 'application/json',
                    'responseText': 'Page not found'
                });
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function () {
                    expect(j).toEqual(0);
                    expect(afterEdit).toEqual(0);
                    expect(k).toEqual(1);
                    done();
                }, 450);
            });
        });
        describe('For Insert operation', () => {
            let treeObj: any;
            let ele: HTMLElement = createElement('div', { id: 'tree1' });
            let j: number = 0;
            let k: number = 0;
            function dsChangeFn(): void {
                j++;
            }
            function actionFailed(): void {
                k++;
            }

            let dataManager1: DataManager = new DataManager({ url: '/TreeView/remoteData', insertUrl: '/TreeView/Insert' });
            beforeEach((done: Function) => {
                jasmine.Ajax.install();
                document.body.appendChild(ele);
                treeObj = new TreeView({
                    fields: {
                        dataSource: dataManager1, id: "nodeId", parentID: 'nodePid', text: "nodeText", hasChildren: "hasChild",
                        tooltip: 'nodeTooltip', selected: 'nodeSelected'
                    },
                    dataBound: () => {
                        done();
                    },
                    dataSourceChanged: dsChangeFn,
                    actionFailure: actionFailed
                });
                treeObj.appendTo(ele);
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify({ d: remoteData2, __count: 2 })
                });
                j = 0;
            });
            afterEach(() => {
                if (ele)
                    ele.remove();
                document.body.innerHTML = '';
                jasmine.Ajax.uninstall();
            });
            it('actionFailure event testing', (done: Function) => {
                expect(j).toEqual(0);
                expect(treeObj.getTreeData().length).toBe(2);
                treeObj.addNodes(remoteData2_3);
                let request: JasmineAjaxRequest = jasmine.Ajax.requests.mostRecent();
                request.respondWith({
                    'status': 404,
                    'contentType': 'application/json',
                    'responseText': 'Page not found'
                });
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function () {
                    expect(j).toEqual(0);
                    expect(k).toEqual(1);
                    expect(treeObj.getTreeData().length).toBe(2);
                    let nli: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                    expect(nli.length).toBe(2);
                    done();
                }, 450);
            });
        });
    });

    describe('Crud operations in offline mode testing', () => {
        describe('Delete operation', () => {
            let treeObj: any;
            let ele: HTMLElement = createElement('div', { id: 'tree1' });
            let j: number = 0;
            function dsChangeFn(): void {
                j++;
            }
            let dataManager1: DataManager
            beforeAll((done: Function) => {
                jasmine.Ajax.install();
                dataManager1 = new DataManager({ url: '/TreeView/remoteData', offline: true });
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify({ d: remoteData2, __count: 2 })
                });
                document.body.appendChild(ele);
                treeObj = new TreeView({
                    fields: {
                        dataSource: dataManager1, id: "nodeId", parentID: 'nodePid', text: "nodeText", hasChildren: "hasChild",
                        tooltip: 'nodeTooltip', selected: 'nodeSelected'
                    },
                    dataBound: () => {
                        done();
                    },
                    dataSourceChanged: dsChangeFn
                });
                treeObj.appendTo(ele);

                j = 0;
            });
            afterAll(() => {
                if (ele)
                    ele.remove();
                document.body.innerHTML = '';
                jasmine.Ajax.uninstall();
            });
            it('remove nodes testing with a single node and the node type as string', (done: Function) => {
                expect(j).toEqual(0);
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                treeObj.removeNodes();
                expect(treeObj.getTreeData().length).toBe(2);
                treeObj.removeNodes(null);
                expect(j).toEqual(0);
                treeObj.removeNodes(['01']);
                setTimeout(function () {
                    expect(j).toEqual(1);
                    expect(treeObj.getTreeData().length).toBe(1);
                    done();
                }, 450);
            });
        });
        describe('Update operation', () => {
            let treeObj: any;
            let ele: HTMLElement = createElement('div', { id: 'tree1' });
            let j: number = 0;
            let beforeEdit: number = 0;
            let afterEdit: number = 0;
            function dsChangeFn(): void {
                j++;
            }
            function nodeBeforeEdit(): void {
                beforeEdit++;
            }
            function nodeAfterEdit(): void {
                afterEdit++;
            }
            let dataManager1: DataManager

            beforeAll((done: Function) => {
                jasmine.Ajax.install();
                dataManager1 = new DataManager({ url: '/TreeView/remoteData', offline: true });
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify({ d: remoteData2, __count: 2 })
                });
                document.body.appendChild(ele);
                treeObj = new TreeView({
                    fields: {
                        dataSource: dataManager1, id: "nodeId", parentID: 'nodePid', text: "nodeText", hasChildren: "hasChild",
                        tooltip: 'nodeTooltip', selected: 'nodeSelected'
                    },
                    dataBound: () => {
                        done();
                    },
                    dataSourceChanged: dsChangeFn,
                    nodeEditing: nodeBeforeEdit,
                    nodeEdited: nodeAfterEdit
                });
                treeObj.appendTo(ele);

                j = 0;
                beforeEdit = 0;
                afterEdit = 0;
            });
            afterAll(() => {
                if (ele)
                    ele.remove();
                document.body.innerHTML = '';
                jasmine.Ajax.uninstall();
            });
            it('rename node and the node type as string', (done: Function) => {
                expect(j).toEqual(0);
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                treeObj.updateNode(null);
                expect(j).toEqual(0);
                treeObj.updateNode('01', 'Rain');
                expect(beforeEdit).toEqual(0);
                treeObj.allowEditing = true;
                treeObj.dataBind();
                treeObj.updateNode('01', 'Rain');
                expect(beforeEdit).toEqual(1);
                setTimeout(function () {
                    expect(j).toEqual(1);
                    expect((li[0].querySelector('.e-list-text') as HTMLElement).textContent).toBe('Rain');
                    expect(afterEdit).toEqual(1);
                    done();
                }, 450);
            });
        });
        describe('Insert operation', () => {
            let treeObj: any;
            let ele: HTMLElement = createElement('div', { id: 'tree1' });
            let j: number = 0;
            function dsChangeFn(): void {
                j++;
            }
            let dataManager1: DataManager
            beforeAll((done: Function) => {
                jasmine.Ajax.install();
                dataManager1 = new DataManager({ url: '/TreeView/remoteData', offline: true });
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify({ d: remoteData2, __count: 2 })
                });
                document.body.appendChild(ele);
                treeObj = new TreeView({
                    fields: {
                        dataSource: dataManager1, id: "nodeId", parentID: 'nodePid', text: "nodeText", hasChildren: "hasChild",
                        tooltip: 'nodeTooltip', selected: 'nodeSelected'
                    },
                    dataBound: () => {
                        done();
                    },
                    dataSourceChanged: dsChangeFn,
                });
                treeObj.appendTo(ele);

                j = 0;
            });
            afterAll(() => {
                if (ele)
                    ele.remove();
                document.body.innerHTML = '';
                jasmine.Ajax.uninstall();
            });
            it('Add a single node with out target', (done: Function) => {
                expect(j).toEqual(0);
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                expect(treeObj.getTreeData().length).toBe(2);
                treeObj.addNodes(updatedremoteNode_1)
                setTimeout(function () {
                    expect(j).toEqual(1);
                    expect(treeObj.getTreeData().length).toBe(3);
                    let nli: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                    expect(nli.length).toBe(3);
                    expect((nli[2].querySelector('.e-list-text') as HTMLElement).textContent).toBe('Rain');
                    done();
                }, 450);
            });
        });
        describe('Insert operation', () => {
            let treeObj: any;
            let ele: HTMLElement = createElement('div', { id: 'tree1' });
            let j: number = 0;
            function dsChangeFn(): void {
                j++;
            }
            let dataManager1: DataManager;
            beforeAll((done: Function) => {
                jasmine.Ajax.install();
                dataManager1 = new DataManager({ url: '/TreeView/remoteData', offline: true });
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify({ d: remoteData2, __count: 2 })
                });
                document.body.appendChild(ele);
                treeObj = new TreeView({
                    fields: {
                        dataSource: dataManager1, id: "nodeId", parentID: 'nodePid', text: "nodeText", hasChildren: "hasChild",
                        tooltip: 'nodeTooltip', selected: 'nodeSelected'
                    },
                    dataBound: () => {
                        done();
                    },
                    dataSourceChanged: dsChangeFn,
                });
                treeObj.appendTo(ele);
                j = 0;
            });
            afterAll(() => {
                if (ele)
                    ele.remove();
                document.body.innerHTML = '';
                jasmine.Ajax.uninstall();
            });
            it('Add multiple node with out target', (done: Function) => {
                expect(j).toEqual(0);
                expect(treeObj.getTreeData().length).toBe(2);
                treeObj.addNodes(remoteData2_3);
                setTimeout(function () {
                    expect(j).toEqual(1);
                    expect(treeObj.getTreeData().length).toBe(4);
                    let nli: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                    expect(nli.length).toBe(4);
                    expect((nli[2].querySelector('.e-list-text') as HTMLElement).textContent).toBe('Videos');
                    done();
                }, 450);
            });
        });
        describe('Insert operation', () => {
            let treeObj: any;
            let ele: HTMLElement = createElement('div', { id: 'tree1' });
            let j: number = 0;
            function dsChangeFn(): void {
                j++;
            }
            let dataManager1: DataManager;
            beforeAll((done: Function) => {
                jasmine.Ajax.install();
                dataManager1 = new DataManager({ url: '/TreeView/remoteData', offline: true });
                this.request = jasmine.Ajax.requests.mostRecent();
                this.request.respondWith({
                    status: 200,
                    responseText: JSON.stringify({ d: remoteData2, __count: 2 })
                });
                document.body.appendChild(ele);
                treeObj = new TreeView({
                    fields: {
                        dataSource: dataManager1, id: "nodeId", parentID: 'nodePid', text: "nodeText", hasChildren: "hasChild",
                        tooltip: 'nodeTooltip', selected: 'nodeSelected'
                    },
                    dataBound: () => {
                        done();
                    },
                    dataSourceChanged: dsChangeFn,
                });
                treeObj.appendTo(ele);

                j = 0;
            });
            afterAll(() => {
                if (ele)
                    ele.remove();
                document.body.innerHTML = '';
                jasmine.Ajax.uninstall();
            });
            it('Add a single node to target li', (done: Function) => {
                expect(j).toEqual(0);
                let li: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                expect(treeObj.getTreeData().length).toBe(2);
                treeObj.addNodes(updatedremoteNode_1);
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(function () {
                    expect(j).toEqual(1);
                    expect(treeObj.getTreeData().length).toBe(3);
                    let nli: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                    expect(nli.length).toBe(3);
                    expect((nli[2].querySelector('.e-list-text') as HTMLElement).textContent).toBe('Rain');
                    done();
                }, 450);
            });
        });
    });
    it('memory leak testing', () => {
        profile.sample();
        let average: any = inMB(profile.averageChange)
        //Check average change in memory samples to not be over 10MB
        expect(average).toBeLessThan(10);
        let memory: any = inMB(getMemoryProfile())
        //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
        expect(memory).toBeLessThan(inMB(profile.samples[profile.samples.length - 1]) + 0.25);
    });
});

describe('Remote data binding with loadOnDemand', () => {
    let mouseEventArgs: any = {
        preventDefault: (): void => {},
        stopImmediatePropagation: (): void => {},
        target: null,
        type: null,
        shiftKey: false,
        ctrlKey: false
    };
    let tapEvent: any = {
        originalEvent: mouseEventArgs,
        tapCount: 1
    };
    let treeObj: any;
    let ele: HTMLElement = createElement('div', { id: 'tree1' });
    let data: DataManager = new DataManager({
        url: 'https://services.odata.org/V4/Northwind/Northwind.svc',
        adaptor: new ODataV4Adaptor,
        crossDomain: true,
    });
    let query: Query = new Query().from('Employees').select('EmployeeID,FirstName,Title').take(5);
    let query1: Query = new Query().from('Orders').select('OrderID,EmployeeID,ShipName').take(5);
    beforeAll((done: Function) => {
        document.body.appendChild(ele);
        treeObj = new TreeView({ 
            fields: { dataSource: data, query: query, id: 'EmployeeID', text: 'FirstName', hasChildren: 'EmployeeID',
            child: { dataSource: data, query: query1, id: 'OrderID', parentID: 'EmployeeID', text: 'ShipName' }
        },
            loadOnDemand: false,                     
            dataBound:() => {
                done();
            }
        });
        treeObj.appendTo(ele);
        
    });
    afterAll(() => {
        if (ele)
            ele.remove();
        document.body.innerHTML = '';
                
    });
    it('functionality testing', () => {
        expect(treeObj.element.querySelectorAll('li').length).toBe(30);
        expect(treeObj.element.querySelector('.e-list-text').innerHTML).toBe('Nancy');
        expect(treeObj.element.querySelectorAll('li')[0].querySelector('ul li')).not.toBe(null);
        treeObj.expandedNodes = ['1'];
        treeObj.dataBind();
        expect(treeObj.element.querySelectorAll('li')[0].querySelector('ul li').childElementCount).toBe(2);
        expect(treeObj.element.querySelectorAll('li')[0].querySelector('ul li').children[1].querySelector('.e-list-text').textContent).toBe("Ernst Handel");
    });
});
describe('Blazor TreeView testing', () => {
    let gridLayOut: any;
    let ele: HTMLElement;
    beforeEach(() => {
        enableBlazorMode();
        (window as any)["sfBlazor"] = function () { };
        (window as any).sfBlazor["updateModel"] = function () { };
        (window as any).sfBlazor["renderComplete"] = function () { };
        ele = createElement('div', { id: 'gridlayout', className: 'e-control e-lib e-treeview' });
        let parentEle: HTMLElement = createElement('div', { id: 'container' });
        parentEle.appendChild(ele);
        document.body.appendChild(parentEle);
    });
    afterEach(() => {
        disableBlazorMode();
        if (gridLayOut) {
            gridLayOut.destroy();
        }
        document.body.innerHTML = '';
    });
    it('Default Blazor Rendering', () => {
        ele.innerHTML = "<div id='gridLayout' class='e-control e-lib e-treeview e-fullrow-wrap e-touch e-keyboard' role='tree' tabindex='0' aria-activedescendant='navigations533lo0wtof0_active'><ul class='e-list-parent e-ul ' role='tree' style=''><li class='e-list-item e-level-1 e-node-focus' role='treeitem' data-uid='01' aria-level='1' style='' aria-expanded='false' id='navigations533lo0wtof0_active'><div class='e-fullrow'></div><div class='e-text-content' role=''><span class='e-list-text' role=''>Inbox</span></div></li><li class='e-list-item e-level-1' role='treeitem' data-uid='02' aria-level='1' style='' aria-expanded='false'><div class='e-fullrow'></div><div class='e-text-content' role=''><span class='e-list-text' role=''>Others</span></div></li></ul></div>";
        let BlazorData: { [key: string]: Object }[] = [
            {
                Id: "01", FolderName: "Inbox"
            },
            {
                Id: "02", FolderName: "Others"
            }
        ];
        gridLayOut = new TreeView({
            fields: { dataSource: BlazorData, id: "Id", text: "FolderName" },
        });
        gridLayOut.isServerRendered = true;
        gridLayOut.appendTo('#gridlayout');
        gridLayOut.isServerRendered = false;
        expect(gridLayOut.element.childElementCount === 1).toBe(true);
    });
    it('Default Blazor Rendering', () => {
        ele.innerHTML = "<div id='gridLayout' class='e-control e-lib e-treeview e-fullrow-wrap e-touch e-keyboard' role='tree' tabindex='0' aria-activedescendant='navigations533lo0wtof0_active'><ul class='e-list-parent e-ul ' role='tree' style=''><li class='e-list-item e-level-1 e-node-focus' role='treeitem' data-uid='01' aria-level='1' style='' aria-expanded='false' id='navigations533lo0wtof0_active'><div class='e-fullrow'></div><div class='e-text-content' role=''><span class='e-list-text' role=''>Inbox</span></div></li><li class='e-list-item e-level-1' role='treeitem' data-uid='02' aria-level='1' style='' aria-expanded='false'><div class='e-fullrow'></div><div class='e-text-content' role=''><span class='e-list-text' role=''>Others</span></div></li></ul></div>";
        let BlazorData: { [key: string]: Object }[] = [
            {
                Id: "01", FolderName: "Inbox"
            },
            {
                Id: "02", FolderName: "Others"
            }
        ];
        gridLayOut = new TreeView({
            fields: { dataSource: BlazorData, id: "Id", text: "FolderName" },
        });
        gridLayOut.clientUpdateInitial();
        gridLayOut.isServerRendered = true;
        gridLayOut.appendTo('#gridlayout');
        gridLayOut.isServerRendered = false;
        expect(gridLayOut.element.childElementCount === 1).toBe(true);
    });
    it('Default Blazor Rendering', () => {
        ele.innerHTML = "<div id='gridLayout' class='e-control e-lib e-treeview e-fullrow-wrap e-touch e-keyboard' role='tree' tabindex='0' aria-activedescendant='navigations533lo0wtof0_active'><ul class='e-list-parent e-ul ' role='tree' style=''><li class='e-list-item e-level-1 e-node-focus' role='treeitem' data-uid='01' aria-level='1' style='' aria-expanded='false' id='navigations533lo0wtof0_active'><div class='e-fullrow'></div><div class='e-text-content' role=''><span class='e-list-text' role=''>Inbox</span></div></li><li class='e-list-item e-level-1' role='treeitem' data-uid='02' aria-level='1' style='' aria-expanded='false'><div class='e-fullrow'></div><div class='e-text-content' role=''><span class='e-list-text' role=''>Others</span></div></li></ul></div>";
        let BlazorData: { [key: string]: Object }[] = [
            {
                Id: "01", FolderName: "Inbox"
            },
            {
                Id: "02", FolderName: "Others"
            }
        ];
        gridLayOut = new TreeView({
            fields: { dataSource: BlazorData, id: "Id", text: "FolderName" },
        });
        gridLayOut.isServerRendered = true;
        gridLayOut.appendTo('#gridlayout');
        gridLayOut.expandedNodes = ["01"];
        gridLayOut.dataBind();
        gridLayOut.isServerRendered = false;
        expect(gridLayOut.element.childElementCount === 1).toBe(true);
    });
    it('Default Blazor Rendering', () => {
        ele.innerHTML = "<div id='gridLayout' class='e-control e-lib e-treeview e-fullrow-wrap e-touch e-keyboard' role='tree' tabindex='0' aria-activedescendant='navigations533lo0wtof0_active'><ul class='e-list-parent e-ul ' role='tree' style=''><li class='e-list-item e-level-1 e-node-focus' role='treeitem' data-uid='01' aria-level='1' style='' aria-expanded='false' id='navigations533lo0wtof0_active'><div class='e-fullrow'></div><div class='e-text-content' role=''><span class='e-list-text' role=''>Inbox</span></div></li><li class='e-list-item e-level-1' role='treeitem' data-uid='02' aria-level='1' style='' aria-expanded='false'><div class='e-fullrow'></div><div class='e-text-content' role=''><span class='e-list-text' role=''>Others</span></div></li></ul></div>";
        let BlazorData: { [key: string]: Object }[] = [
            {
                Id: "01", FolderName: "Inbox"
            },
            {
                Id: "02", FolderName: "Others"
            }
        ];
        gridLayOut = new TreeView({
            fields: { dataSource: BlazorData, id: "Id", text: "FolderName" },
        });
        gridLayOut.isServerRendered = true;
        gridLayOut.appendTo('#gridlayout');
        let BlazorDatas: { [key: string]: Object }[] = [
            {
                Id: "01", FolderName: "Inbox"
            },
            {
                Id: "02", FolderName: "Others"
            },
            {
                Id: "03", FolderName: "Social"
            }
        ];
        gridLayOut.clientUpdateInitial();
        gridLayOut.fields = { dataSource: BlazorDatas, id: "Id", text: "FolderName" };
        gridLayOut.dataBind();
        gridLayOut.isServerRendered = false;
        expect(gridLayOut.element.childElementCount === 1).toBe(true);
    });
});
