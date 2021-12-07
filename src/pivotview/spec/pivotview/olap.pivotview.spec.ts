import { IDataOptions, } from '../../src/base/engine';
import { PivotView } from '../../src/pivotview/base/pivotview';
import { createElement, isNullOrUndefined, remove, EmitType, EventHandler, extend } from '@syncfusion/ej2-base';
import { GroupingBar } from '../../src/common/grouping-bar/grouping-bar';
import { FieldList } from '../../src/common/actions/field-list';
import { TreeView } from '@syncfusion/ej2-navigations';
import { Dialog } from '@syncfusion/ej2-popups';
import { FieldDroppedEventArgs, ColumnRenderEventArgs } from '../../src/common/base/interface';
import { profile, inMB, getMemoryProfile } from '../common.spec';

describe('PivotView spec', () => {
    /**
     * PivotGrid base spec for OLAP data source
     */

    // let url: string = 'https://bi.syncfusion.com/olap/msmdpump.dll';
    // let catalog: string = 'Adventure Works DW 2008 SE';
    let url: string = 'https://olap.flexmonster.com/olap/msmdpump.dll';
    let catalog: string = 'Adventure Works DW Standard Edition';

    function disableDialogAnimation(dialogObject: Dialog): void {
        dialogObject.animationSettings = { effect: 'None' };
        dialogObject.dataBind();
        dialogObject.hide();
    }

    function copyObject(source: any, destiation: any): Object {
        for (let prop of source) {
            destiation[prop] = source[prop];
        }
        return destiation;
    }

    function getEventObject(eventType: string, eventName: string, currentTarget?: Element, target?: Element, x?: number, y?: number): Object {
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
            returnObject.offsetY = 7;
        }
        returnObject.type = 'mouse';
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

    function triggerMouseEvent(node: HTMLElement, eventType: string, x?: number, y?: number) {
        let mouseEve: MouseEvent = document.createEvent('MouseEvents');
        if (x && y) {
            mouseEve.initMouseEvent(eventType, true, true, window, 0, 0, 0, x, y, false, false, false, false, 0, null);
        } else {
            mouseEve.initEvent(eventType, true, true);
        }
        node.dispatchEvent(mouseEve);
    }

    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });

    describe('Grid base module - ', () => {
        describe('- Grid properties - ', () => {
            let originalTimeout: number;
            let pivotGridObj: PivotView;
            let elem: HTMLElement = createElement('div', { id: 'PivotGrid', styles: 'height:200px; width:500px' });
            document.body.appendChild(elem);
            afterAll(() => {
                if (pivotGridObj) {
                    pivotGridObj.destroy();
                }
                remove(elem);
            });
            beforeAll(() => {
                originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 25000;
                if (document.getElementById(elem.id)) {
                    remove(document.getElementById(elem.id));
                }
                document.body.appendChild(elem);
                pivotGridObj = new PivotView({
                    dataSourceSettings: {
                        catalog: catalog,
                        cube: 'Adventure Works',
                        providerType: 'SSAS',
                        url: url,
                        localeIdentifier: 1033,
                        filterSettings: [
                            {
                                type: 'Include',
                                name: '[Customer].[Customer Geography]',
                                items: ['[Customer].[Customer Geography].[State-Province].&[NSW]&[AU]',
                                    '[Customer].[Customer Geography].[Country].&[Germany]',
                                    '[Customer].[Customer Geography].[Country].&[France]',
                                    '[Customer].[Customer Geography].[Country].&[United Kingdom]',
                                    '[Customer].[Customer Geography].[Country].&[United States]']
                            }
                        ],
                        rows: [
                            { name: '[Date].[Fiscal]', caption: 'Date Fiscal' }
                        ],
                        columns: [
                            { name: '[Customer].[Customer Geography]', caption: 'Customer Geography' },
                            { name: '[Measures]', caption: 'Measures' }
                        ],
                        values: [
                            { name: '[Measures].[Customer Count]', caption: 'Customer Count' }
                        ],
                        filters: [],
                        valueAxis: 'column'
                    },
                    width: 1000,
                    height: 500
                });
                pivotGridObj.appendTo('#PivotGrid');
            });
            let persistdata: string;
            it('pivotgrid render testing', (done: Function) => {
                expect(pivotGridObj.olapEngineModule.mdxQuery).toBe('Select NON EMPTY (({DrilldownLevel({[Customer].[Customer Geography]})}) * {{[Measures].[Customer Count]}}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON COLUMNS, NON EMPTY (({DrilldownLevel({[Date].[Fiscal]})})) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON ROWS FROM( SELECT ({[Customer].[Customer Geography].[State-Province].&amp;[NSW]&amp;[AU],[Customer].[Customer Geography].[Country].&amp;[Germany],[Customer].[Customer Geography].[Country].&amp;[France],[Customer].[Customer Geography].[Country].&amp;[United Kingdom],[Customer].[Customer Geography].[Country].&amp;[United States]} ) ON COLUMNS FROM [Adventure Works]) CELL PROPERTIES VALUE, FORMAT_STRING, FORMATTED_VALUE');
                setTimeout(() => {
                    expect(pivotGridObj.element.querySelectorAll('.e-gridheader,.e-gridcontent').length > 1).toBeTruthy();
                    pivotGridObj.onWindowResize();
                    pivotGridObj.renderModule.updateGridSettings();
                    done();
                }, 2000);
            });
            it('pivotgrid setPersist', () => {
                persistdata = pivotGridObj.getPersistData();
                expect(!isNullOrUndefined(JSON.parse(persistdata).dataSourceSettings)).toBeTruthy();
            });
            it('Mouse hover event testing - Value cell', (done: Function) => {
                let target: HTMLElement = pivotGridObj.element.querySelector('td[aria-colindex="3"]');
                triggerMouseEvent(target, 'mouseover');
                setTimeout(() => {
                    expect(document.querySelectorAll('.e-tooltip-wrap p.e-tooltipcontent')[2].innerHTML).toBe('76');
                    done();
                }, 2000);
            });
            it('Mouse hover event testing - Value cell', (done: Function) => {
                let target: HTMLElement = pivotGridObj.element.querySelectorAll('td[aria-colindex="3"]')[1] as HTMLElement;
                triggerMouseEvent(target, 'mouseover');
                setTimeout(() => {
                    expect(document.querySelectorAll('.e-tooltip-wrap p.e-tooltipcontent')[2].innerHTML).toBe('234');
                    done();
                }, 2000);
            });
            it('Mouse hover event testing - top left cell', (done: Function) => {
                let target: HTMLElement = pivotGridObj.element.querySelector('.e-rowcell');
                triggerMouseEvent(target, 'mouseover');
                setTimeout(() => {
                    expect(pivotGridObj.element.querySelectorAll('.e-expand').length).toBe(9);
                    done();
                }, 2000);
            });
            it('Mouse hover event testing - bottom left value cell', (done: Function) => {
                let target: HTMLElement = pivotGridObj.element.querySelectorAll('td[index="6"]')[1] as HTMLElement;
                triggerMouseEvent(target, 'mouseover');
                setTimeout(() => {
                    expect(document.querySelectorAll('.e-tooltip-wrap p.e-tooltipcontent')[2].innerHTML).toBe('1,559');
                    done();
                }, 2000);
            });
            it('Mouse hover event testing - bottom right value cell', (done: Function) => {
                let target: HTMLElement = pivotGridObj.element.querySelectorAll('td[index="6"]')[6] as HTMLElement;
                triggerMouseEvent(target, 'mouseover');
                setTimeout(() => {
                    expect(document.querySelectorAll('.e-tooltip-wrap p.e-tooltipcontent')[2].innerHTML).toBe('14,881');
                    done();
                }, 2000);
            });
            it('Mouse hover event testing - bottom middle value cell', (done: Function) => {
                let target: HTMLElement = pivotGridObj.element.querySelectorAll('td[index="6"]')[3] as HTMLElement;
                triggerMouseEvent(target, 'mouseover');
                setTimeout(() => {
                    expect(document.querySelectorAll('.e-tooltip-wrap p.e-tooltipcontent')[2].innerHTML).toBe('1,780');
                    done();
                }, 2000);
            });
            it('hide tooltip', (done: Function) => {
                pivotGridObj.showTooltip = false;
                setTimeout(() => {
                    let target: HTMLElement = pivotGridObj.element.querySelectorAll('td[index="6"]')[3] as HTMLElement;
                    triggerMouseEvent(target, 'mouseover');
                    expect(document.querySelectorAll('.e-tooltip-wrap p.e-tooltipcontent').length).toBe(0);
                    pivotGridObj.locale = 'es-ES';
                    done();
                }, 2000);
            })
            it('check - pivotgrid change locale', (done: Function) => {
                expect(pivotGridObj.olapEngineModule.mdxQuery).toBe('Select NON EMPTY (({DrilldownLevel({[Customer].[Customer Geography]})}) * {{[Measures].[Customer Count]}}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON COLUMNS, NON EMPTY (({DrilldownLevel({[Date].[Fiscal]})})) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON ROWS FROM( SELECT ({[Customer].[Customer Geography].[State-Province].&amp;[NSW]&amp;[AU],[Customer].[Customer Geography].[Country].&amp;[Germany],[Customer].[Customer Geography].[Country].&amp;[France],[Customer].[Customer Geography].[Country].&amp;[United Kingdom],[Customer].[Customer Geography].[Country].&amp;[United States]} ) ON COLUMNS FROM [Adventure Works]) CELL PROPERTIES VALUE, FORMAT_STRING, FORMATTED_VALUE');
                setTimeout(() => {
                    expect(pivotGridObj.element.querySelectorAll('td[index="6"]')[0].textContent).toBe('Grand Total');
                    done();
                }, 2000);
            });
            it('pivotgrid click expand icon', () => {
                expect(pivotGridObj.element.querySelectorAll('.e-expand').length).toBe(9);
                let icon: HTMLElement = pivotGridObj.element.querySelectorAll('.e-expand')[1] as HTMLElement;
                icon.click();
            });
            it('check - pivotgrid click expand icon', () => {
                expect(pivotGridObj.olapEngineModule.mdxQuery).toBe('Select NON EMPTY (Hierarchize({({DrilldownLevel({[Customer].[Customer Geography]})}) * {{[Measures].[Customer Count]}},(([Customer].[Customer Geography].[Country].&amp;[France].CHILDREN),({{[Measures].[Customer Count]}}))})) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON COLUMNS, NON EMPTY (Hierarchize({({DrilldownLevel({[Date].[Fiscal]})})})) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON ROWS FROM( SELECT ({[Customer].[Customer Geography].[State-Province].&amp;[NSW]&amp;[AU],[Customer].[Customer Geography].[Country].&amp;[Germany],[Customer].[Customer Geography].[Country].&amp;[France],[Customer].[Customer Geography].[Country].&amp;[United Kingdom],[Customer].[Customer Geography].[Country].&amp;[United States]} ) ON COLUMNS FROM [Adventure Works]) CELL PROPERTIES VALUE, FORMAT_STRING, FORMATTED_VALUE');
                expect(pivotGridObj.element.querySelectorAll('.e-expand').length).toBe(24);
                expect(pivotGridObj.element.querySelectorAll('.e-collapse').length).toBe(17);
                expect((pivotGridObj.element.querySelectorAll('td[aria-colindex="0"]')[3] as HTMLElement).innerText).toBe('FY 2013');
            });
            it('pivotgrid click collapse icon', () => {
                expect(pivotGridObj.element.querySelectorAll('.e-expand').length).toBe(24);
                let icon: HTMLElement = pivotGridObj.element.querySelectorAll('.e-collapse')[0] as HTMLElement;
                icon.click();
            });
            it('check - pivotgrid click collapse icon', (done: Function) => {
                setTimeout(() => {
                    expect(pivotGridObj.olapEngineModule.mdxQuery).toBe('Select NON EMPTY (({DrilldownLevel({[Customer].[Customer Geography]})}) * {{[Measures].[Customer Count]}}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON COLUMNS, NON EMPTY (({DrilldownLevel({[Date].[Fiscal]})})) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON ROWS FROM( SELECT ({[Customer].[Customer Geography].[State-Province].&amp;[NSW]&amp;[AU],[Customer].[Customer Geography].[Country].&amp;[Germany],[Customer].[Customer Geography].[Country].&amp;[France],[Customer].[Customer Geography].[Country].&amp;[United Kingdom],[Customer].[Customer Geography].[Country].&amp;[United States]} ) ON COLUMNS FROM [Adventure Works]) CELL PROPERTIES VALUE, FORMAT_STRING, FORMATTED_VALUE');
                    expect(pivotGridObj.element.querySelectorAll('.e-expand').length).toBe(9);
                    expect(pivotGridObj.element.querySelectorAll('.e-collapse').length).toBe(0);
                    expect((pivotGridObj.element.querySelectorAll('td[aria-colindex="6"]')[1] as HTMLElement).innerText.trim()).toBe('1,984');
                    done();
                }, 2000);
            });
            it('pivotgrid click non icon space', (done: Function) => {
                let element: HTMLElement = pivotGridObj.element.querySelector('.e-rowcell');
                element.click();
                setTimeout(() => {
                    expect(pivotGridObj.element.querySelectorAll('.e-expand').length).toBe(9);
                    done();
                }, 2000);
            });
            it('pivotgrid set dataSourceSettings', (done: Function) => {
                expect(pivotGridObj.element.querySelectorAll('.e-expand').length).toBe(9);
                pivotGridObj.dataSourceSettings.values = [{ name: '[Measures].[Internet Sales Amount]', caption: 'Internet Sales Amount' }];
                setTimeout(() => {
                    expect(pivotGridObj.olapEngineModule.mdxQuery).toBe('Select NON EMPTY (({DrilldownLevel({[Customer].[Customer Geography]})}) * {{[Measures].[Internet Sales Amount]}}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON COLUMNS, NON EMPTY (({DrilldownLevel({[Date].[Fiscal]})})) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON ROWS FROM( SELECT ({[Customer].[Customer Geography].[State-Province].&amp;[NSW]&amp;[AU],[Customer].[Customer Geography].[Country].&amp;[Germany],[Customer].[Customer Geography].[Country].&amp;[France],[Customer].[Customer Geography].[Country].&amp;[United Kingdom],[Customer].[Customer Geography].[Country].&amp;[United States]} ) ON COLUMNS FROM [Adventure Works]) CELL PROPERTIES VALUE, FORMAT_STRING, FORMATTED_VALUE');
                    expect(pivotGridObj.dataSourceSettings.values.length).toBe(1);
                    done();
                }, 3000);
            });
            it('pivotgrid get dataSourceSettings', () => {
                let dataSourceSettings: IDataOptions = pivotGridObj.dataSourceSettings;
                expect(dataSourceSettings.columns.length).toBe(2);
            });
            it('pivotgrid with measure sorting', (done: Function) => {
                pivotGridObj.dataSourceSettings.valueSortSettings = {
                    sortOrder: 'Descending',
                    measure: '[Measures].[Internet Sales Amount]'
                }
                setTimeout(() => {
                    expect(pivotGridObj.olapEngineModule.mdxQuery).toBe('Select NON EMPTY (({DrilldownLevel({[Customer].[Customer Geography]})}) * {{[Measures].[Internet Sales Amount]}}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON COLUMNS, NON EMPTY (ORDER({({DrilldownLevel({[Date].[Fiscal]})})},([Measures].[Internet Sales Amount]), DESC)) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON ROWS FROM( SELECT ({[Customer].[Customer Geography].[State-Province].&amp;[NSW]&amp;[AU],[Customer].[Customer Geography].[Country].&amp;[Germany],[Customer].[Customer Geography].[Country].&amp;[France],[Customer].[Customer Geography].[Country].&amp;[United Kingdom],[Customer].[Customer Geography].[Country].&amp;[United States]} ) ON COLUMNS FROM [Adventure Works]) CELL PROPERTIES VALUE, FORMAT_STRING, FORMATTED_VALUE');
                    expect((document.querySelectorAll('td[aria-colindex="0"]')[0] as HTMLElement).innerText).toBe('FY 2013');
                    done();
                }, 3000);
            });
        });

        describe('- Grouping Bar with injected Module - ', () => {
            let originalTimeout: number;
            let pivotGridObj: PivotView;
            let elem: HTMLElement = createElement('div', { id: 'PivotGrid', styles: 'height:200px; width:500px' });
            afterAll(() => {
                if (pivotGridObj) {
                    pivotGridObj.destroy();
                }
                remove(elem);
            });
            beforeAll((done: Function) => {
                originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 25000;
                if (!document.getElementById(elem.id)) {
                    document.body.appendChild(elem);
                }
                let dataBound: EmitType<Object> = () => { done(); };
                PivotView.Inject(GroupingBar);
                pivotGridObj = new PivotView({
                    dataSourceSettings: {
                        catalog: catalog,
                        cube: 'Adventure Works',
                        providerType: 'SSAS',
                        url: url,
                        localeIdentifier: 1033,
                        filterSettings: [
                            {
                                type: 'Include',
                                name: '[Customer].[Customer Geography]',
                                items: ['[Customer].[Customer Geography].[State-Province].&[NSW]&[AU]',
                                    '[Customer].[Customer Geography].[Country].&[Germany]',
                                    '[Customer].[Customer Geography].[Country].&[France]',
                                    '[Customer].[Customer Geography].[Country].&[United Kingdom]',
                                    '[Customer].[Customer Geography].[Country].&[United States]']
                            }
                        ],
                        rows: [
                            { name: '[Date].[Fiscal]', caption: 'Date Fiscal' }
                        ],
                        columns: [
                            { name: '[Customer].[Customer Geography]', caption: 'Customer Geography' },
                            { name: '[Measures]', caption: 'Measures' }
                        ],
                        values: [
                            { name: '[Measures].[Customer Count]', caption: 'Customer Count' },
                            { name: '[Measures].[Internet Sales Amount]', caption: 'Internet Sales Amount' }
                        ],
                        filters: [],
                        valueAxis: 'column'
                    },
                    showGroupingBar: true,
                    groupingBarSettings: { showFilterIcon: false, showRemoveIcon: false },
                    dataBound: dataBound,
                    gridSettings: {
                        columnRender: (args: ColumnRenderEventArgs) => {
                            args.columns[0].width = 200;
                            args.columns[1].allowReordering = true;
                            args.columns[1].allowResizing = true;
                        }
                    }
                });
                pivotGridObj.appendTo('#PivotGrid');
            });
            let persistdata: string;
            beforeEach((done: Function) => {
                setTimeout(() => { done(); }, 1000);
            });
            it('check window resize with grouping bar', () => {
                expect(pivotGridObj.olapEngineModule.mdxQuery).toBe('Select NON EMPTY (({DrilldownLevel({[Customer].[Customer Geography]})}) * {{[Measures].[Customer Count], [Measures].[Internet Sales Amount]}}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON COLUMNS, NON EMPTY (({DrilldownLevel({[Date].[Fiscal]})})) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON ROWS FROM( SELECT ({[Customer].[Customer Geography].[State-Province].&amp;[NSW]&amp;[AU],[Customer].[Customer Geography].[Country].&amp;[Germany],[Customer].[Customer Geography].[Country].&amp;[France],[Customer].[Customer Geography].[Country].&amp;[United Kingdom],[Customer].[Customer Geography].[Country].&amp;[United States]} ) ON COLUMNS FROM [Adventure Works]) CELL PROPERTIES VALUE, FORMAT_STRING, FORMATTED_VALUE');
                pivotGridObj.onWindowResize();
                pivotGridObj.renderModule.updateGridSettings();
                expect(true).toBeTruthy();
            });
            it('grouping bar render testing', () => {
                expect(pivotGridObj.element.querySelector('.e-grouping-bar')).toBeDefined();
                pivotGridObj.dataBind();
                pivotGridObj.groupingBarSettings = { showFilterIcon: true, showRemoveIcon: true };
                expect(pivotGridObj.element.querySelector('.e-grouping-bar')).toBeDefined();
            });
            it('check filtering field', (done: Function) => {
                let pivotButtons: HTMLElement[] =
                    [].slice.call(pivotGridObj.element.querySelector('.e-columns').querySelectorAll('.e-pivot-button'));
                expect(pivotButtons.length).toBeGreaterThan(0);
                ((pivotButtons[0]).querySelector('.e-btn-filter') as HTMLElement).click();
                setTimeout(() => {
                    let filterDialog: Dialog = pivotGridObj.pivotCommon.filterDialog.dialogPopUp;
                    expect(filterDialog.element.classList.contains('e-popup-open')).toBe(true);
                    done();
                }, 1000);
            });
            it('check all nodes on filter popup', () => {
                let treeObj: TreeView = pivotGridObj.pivotCommon.filterDialog.allMemberSelect;
                let memberTreeObj: TreeView = pivotGridObj.pivotCommon.filterDialog.memberTreeView;
                let filterDialog: Dialog = pivotGridObj.pivotCommon.filterDialog.dialogPopUp;
                let allNode: HTMLElement = treeObj.element.querySelector('.e-checkbox-wrapper');
                let checkEle: Element[] = <Element[] & NodeListOf<Element>>memberTreeObj.element.querySelectorAll('.e-checkbox-wrapper');
                expect(checkEle.length).toBeGreaterThan(0);
                expect(allNode.classList.contains('e-small')).toBe(false);
                let args: MouseEvent = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                allNode.querySelector('.e-frame').dispatchEvent(args);
                args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                allNode.querySelector('.e-frame').dispatchEvent(args);
                args = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
                allNode.querySelector('.e-frame').dispatchEvent(args);
                let checkedEle: Element[] = <Element[] & NodeListOf<Element>>memberTreeObj.element.querySelectorAll('.e-check');
                expect(checkEle.length).toEqual(checkedEle.length);
                expect(filterDialog.element.querySelector('.e-ok-btn').getAttribute('disabled')).toBe(null);
                (filterDialog.element.querySelector('.e-ok-btn') as HTMLElement).click();
            });
            it('check filter state after update', () => {
                expect(pivotGridObj.olapEngineModule.mdxQuery).toBe('Select NON EMPTY (({DrilldownLevel({[Customer].[Customer Geography]})}) * {{[Measures].[Customer Count], [Measures].[Internet Sales Amount]}}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON COLUMNS, NON EMPTY (({DrilldownLevel({[Date].[Fiscal]})})) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON ROWS FROM [Adventure Works] CELL PROPERTIES VALUE, FORMAT_STRING, FORMATTED_VALUE');
                let filterDialog: Dialog = pivotGridObj.pivotCommon.filterDialog.dialogPopUp;
                expect(filterDialog).toBeUndefined;
            });
            it('check remove pivot button', (done: Function) => {
                let pivotButton: HTMLElement =
                    (pivotGridObj.element.querySelector('.e-values').querySelector('.e-pivot-button') as HTMLElement);
                expect(pivotButton.id).toBe('[Measures].[Customer Count]');
                (pivotButton.querySelector('.e-remove') as HTMLElement).click();
                setTimeout(() => {
                    expect(pivotGridObj.olapEngineModule.mdxQuery).toBe('Select NON EMPTY (({DrilldownLevel({[Customer].[Customer Geography]})}) * {{[Measures].[Internet Sales Amount]}}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON COLUMNS, NON EMPTY (({DrilldownLevel({[Date].[Fiscal]})})) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON ROWS FROM [Adventure Works] CELL PROPERTIES VALUE, FORMAT_STRING, FORMATTED_VALUE');
                    pivotButton = (pivotGridObj.element.querySelector('.e-values').querySelector('.e-pivot-button') as HTMLElement);
                    expect(pivotButton).not.toBeNull();
                    expect(pivotButton.id).toBe('[Measures].[Internet Sales Amount]');
                    done();
                }, 1000);
            });
            it('check drag and drop pivot button', (done: Function) => {
                pivotGridObj.onFieldDropped = function (args: FieldDroppedEventArgs) {
                    args.droppedField.caption = "droppedButton"
                };
                let rowAxiscontent: HTMLElement = pivotGridObj.element.querySelector('.e-rows');
                let columnAxiscontent: HTMLElement = pivotGridObj.element.querySelector('.e-columns');
                let pivotButton: HTMLElement[] = [].slice.call((columnAxiscontent).querySelectorAll('.e-pivot-button'));
                expect(pivotButton.length).toEqual(2);
                let dragElement: HTMLElement = pivotButton[1].querySelector('.e-content');
                let mousedown: any =
                    getEventObject('MouseEvents', 'mousedown', dragElement, dragElement, 15, 10);
                EventHandler.trigger(dragElement, 'mousedown', mousedown);
                let mousemove: any =
                    getEventObject('MouseEvents', 'mousemove', dragElement, rowAxiscontent, 15, 70);
                mousemove.srcElement = mousemove.target = mousemove.toElement = rowAxiscontent;
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                mousemove = setMouseCordinates(mousemove, 15, 75);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                let mouseOverEventArgs: any = extend({}, mousemove, null, true);
                mouseOverEventArgs.type = 'mouseover';
                (pivotGridObj.groupingBarModule as any).dropIndicatorUpdate(mouseOverEventArgs);
                let mouseLeaveEventArgs: any = extend({}, mousemove, null, true);
                mouseLeaveEventArgs.type = 'mouseleave';
                (pivotGridObj.groupingBarModule as any).dropIndicatorUpdate(mouseLeaveEventArgs);
                let mouseUp: any = getEventObject('MouseEvents', 'mouseup', dragElement, rowAxiscontent);
                mouseUp.type = 'mouseup';
                mouseUp.srcElement = mouseUp.target = mouseUp.toElement = rowAxiscontent;
                EventHandler.trigger(<any>(document), 'mouseup', mouseUp);
                setTimeout(() => {
                    expect(pivotGridObj.olapEngineModule.mdxQuery).toBe('Select NON EMPTY (({DrilldownLevel({[Customer].[Customer Geography]})})) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON COLUMNS, NON EMPTY (({DrilldownLevel({[Date].[Fiscal]})}) * {{[Measures].[Internet Sales Amount]}}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON ROWS FROM [Adventure Works] CELL PROPERTIES VALUE, FORMAT_STRING, FORMATTED_VALUE');
                    pivotButton = [].slice.call((rowAxiscontent).querySelectorAll('.e-pivot-button'));
                    expect(pivotButton.length).toEqual(2);
                    expect((pivotButton[1].querySelector('.e-content') as HTMLElement).innerText).toEqual("droppedButton");
                    done();
                }, 1000);
            });
            it('destroy common event handlers', () => {
                pivotGridObj.commonModule.destroy();
                expect(true).toBeTruthy();
            });
            it('pivotgrid destroy', () => {
                pivotGridObj.destroy();
                expect(true).toBeTruthy();
            });
            it('pivotgrid destroy expect', () => {
                expect(pivotGridObj.element.innerHTML).toBe('');
            });
        });

        describe('- Field List with injected Module - ', () => {
            let originalTimeout: number;
            let pivotGridObj: PivotView;
            let elem: HTMLElement = createElement('div', { id: 'PivotGrid', styles: 'height:200px; width:500px' });
            afterAll(() => {
                if (pivotGridObj) {
                    pivotGridObj.destroy();
                }
                remove(elem);
            });
            beforeAll((done: Function) => {
                originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 25000;
                if (!document.getElementById(elem.id)) {
                    document.body.appendChild(elem);
                }
                let dataBound: EmitType<Object> = () => { done(); };
                PivotView.Inject(GroupingBar, FieldList);
                pivotGridObj = new PivotView({
                    dataSourceSettings: {
                        catalog: catalog,
                        cube: 'Adventure Works',
                        providerType: 'SSAS',
                        url: url,
                        localeIdentifier: 1033,
                        filterSettings: [
                            {
                                type: 'Include',
                                name: '[Customer].[Customer Geography]',
                                items: ['[Customer].[Customer Geography].[State-Province].&[NSW]&[AU]',
                                    '[Customer].[Customer Geography].[Country].&[Germany]',
                                    '[Customer].[Customer Geography].[Country].&[France]',
                                    '[Customer].[Customer Geography].[Country].&[United Kingdom]',
                                    '[Customer].[Customer Geography].[Country].&[United States]']
                            }
                        ],
                        rows: [
                            { name: '[Date].[Fiscal]', caption: 'Date Fiscal' }
                        ],
                        columns: [
                            { name: '[Customer].[Customer Geography]', caption: 'Customer Geography' },
                            { name: '[Measures]', caption: 'Measures' }
                        ],
                        values: [
                            { name: '[Measures].[Customer Count]', caption: 'Customer Count' },
                            { name: '[Measures].[Internet Sales Amount]', caption: 'Internet Sales Amount' }
                        ],
                        filters: [],
                        valueAxis: 'column'
                    },
                    showGroupingBar: true,
                    showFieldList: true,
                    dataBound: dataBound
                });
                pivotGridObj.appendTo('#PivotGrid');
                disableDialogAnimation(pivotGridObj.pivotFieldListModule.dialogRenderer.fieldListDialog);
            });
            let persistdata: string;
            beforeEach((done: Function) => {
                setTimeout(() => { done(); }, 1000);
            });
            it('check window resize with grouping bar', () => {
                expect(pivotGridObj.olapEngineModule.mdxQuery).toBe('Select NON EMPTY (({DrilldownLevel({[Customer].[Customer Geography]})}) * {{[Measures].[Customer Count], [Measures].[Internet Sales Amount]}}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON COLUMNS, NON EMPTY (({DrilldownLevel({[Date].[Fiscal]})})) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON ROWS FROM( SELECT ({[Customer].[Customer Geography].[State-Province].&amp;[NSW]&amp;[AU],[Customer].[Customer Geography].[Country].&amp;[Germany],[Customer].[Customer Geography].[Country].&amp;[France],[Customer].[Customer Geography].[Country].&amp;[United Kingdom],[Customer].[Customer Geography].[Country].&amp;[United States]} ) ON COLUMNS FROM [Adventure Works]) CELL PROPERTIES VALUE, FORMAT_STRING, FORMATTED_VALUE');
                pivotGridObj.onWindowResize();
                pivotGridObj.renderModule.updateGridSettings();
                expect(true).toBeTruthy();
            });
            it('grouping bar render testing', () => {
                pivotGridObj.dataBind();
                expect(pivotGridObj.element.querySelector('.e-grouping-bar')).toBeDefined();
            });
            it('field list render testing', () => {
                pivotGridObj.dataBind();
                expect(pivotGridObj.pivotFieldListModule).not.toBeUndefined;
            });
            it('check open field list popup', () => {
                (pivotGridObj.pivotFieldListModule.element.querySelector('.e-toggle-field-list') as HTMLElement).click();
                expect(true).toBe(true);
            });
            it('check filtering field', (done: Function) => {
                let pivotButtons: HTMLElement[] =
                    [].slice.call(pivotGridObj.element.querySelector('.e-columns').querySelectorAll('.e-pivot-button'));
                expect(pivotButtons.length).toBeGreaterThan(0);
                ((pivotButtons[0]).querySelector('.e-btn-filter') as HTMLElement).click();
                setTimeout(() => {
                    let filterDialog: Dialog = pivotGridObj.pivotCommon.filterDialog.dialogPopUp;
                    expect(filterDialog.element.classList.contains('e-popup-open')).toBe(true);
                    done();
                }, 1000);
            });
            it('check all nodes on filter popup', () => {
                let treeObj: TreeView = pivotGridObj.pivotCommon.filterDialog.allMemberSelect;
                let memberTreeObj: TreeView = pivotGridObj.pivotCommon.filterDialog.memberTreeView;
                let filterDialog: Dialog = pivotGridObj.pivotCommon.filterDialog.dialogPopUp;
                let allNode: HTMLElement = treeObj.element.querySelector('.e-checkbox-wrapper');
                let checkEle: Element[] = <Element[] & NodeListOf<Element>>memberTreeObj.element.querySelectorAll('.e-checkbox-wrapper');
                expect(checkEle.length).toBeGreaterThan(0);
                expect(allNode.classList.contains('e-small')).toBe(false);
                let args: MouseEvent = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                allNode.querySelector('.e-frame').dispatchEvent(args);
                args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                allNode.querySelector('.e-frame').dispatchEvent(args);
                args = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
                allNode.querySelector('.e-frame').dispatchEvent(args);
                let checkedEle: Element[] = <Element[] & NodeListOf<Element>>memberTreeObj.element.querySelectorAll('.e-check');
                expect(checkEle.length).toEqual(checkedEle.length);
                expect(filterDialog.element.querySelector('.e-ok-btn').getAttribute('disabled')).toBe(null);
                (filterDialog.element.querySelector('.e-ok-btn') as HTMLElement).click();
            });
            it('check filter state after update', () => {
                expect(pivotGridObj.olapEngineModule.mdxQuery).toBe('Select NON EMPTY (({DrilldownLevel({[Customer].[Customer Geography]})}) * {{[Measures].[Customer Count], [Measures].[Internet Sales Amount]}}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON COLUMNS, NON EMPTY (({DrilldownLevel({[Date].[Fiscal]})})) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON ROWS FROM [Adventure Works] CELL PROPERTIES VALUE, FORMAT_STRING, FORMATTED_VALUE');
                let filterDialog: Dialog = pivotGridObj.pivotCommon.filterDialog.dialogPopUp;
                expect(filterDialog).toBeUndefined;
            });
            it('check remove pivot button', (done: Function) => {
                let pivotButton: HTMLElement =
                    (pivotGridObj.element.querySelector('.e-values').querySelector('.e-pivot-button') as HTMLElement);
                expect(pivotButton.id).toBe('[Measures].[Customer Count]');
                (pivotButton.querySelector('.e-remove') as HTMLElement).click();
                setTimeout(() => {
                    expect(pivotGridObj.olapEngineModule.mdxQuery).toBe('Select NON EMPTY (({DrilldownLevel({[Customer].[Customer Geography]})}) * {{[Measures].[Internet Sales Amount]}}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON COLUMNS, NON EMPTY (({DrilldownLevel({[Date].[Fiscal]})})) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON ROWS FROM [Adventure Works] CELL PROPERTIES VALUE, FORMAT_STRING, FORMATTED_VALUE');
                    pivotButton = (pivotGridObj.element.querySelector('.e-values').querySelector('.e-pivot-button') as HTMLElement);
                    expect(pivotButton).not.toBeNull();
                    expect(pivotButton.id).toBe('[Measures].[Internet Sales Amount]');
                    done();
                }, 1000);
            });
            it('check drag and drop pivot button', (done: Function) => {
                pivotGridObj.onFieldDropped = function (args: FieldDroppedEventArgs) {
                    args.droppedField.caption = "droppedButton"
                };
                let rowAxiscontent: HTMLElement = pivotGridObj.element.querySelector('.e-rows');
                let columnAxiscontent: HTMLElement = pivotGridObj.element.querySelector('.e-columns');
                let pivotButton: HTMLElement[] = [].slice.call((columnAxiscontent).querySelectorAll('.e-pivot-button'));
                expect(pivotButton.length).toEqual(2);
                let dragElement: HTMLElement = pivotButton[1].querySelector('.e-draggable');
                let mousedown: any =
                    getEventObject('MouseEvents', 'mousedown', dragElement, dragElement, 15, 10);
                EventHandler.trigger(dragElement, 'mousedown', mousedown);
                let mousemove: any =
                    getEventObject('MouseEvents', 'mousemove', dragElement, rowAxiscontent, 15, 70);
                mousemove.srcElement = mousemove.target = mousemove.toElement = rowAxiscontent;
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                mousemove = setMouseCordinates(mousemove, 15, 75);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                let mouseUp: any = getEventObject('MouseEvents', 'mouseup', dragElement, rowAxiscontent);
                mouseUp.type = 'mouseup';
                mouseUp.srcElement = mouseUp.target = mouseUp.toElement = rowAxiscontent;
                EventHandler.trigger(<any>(document), 'mouseup', mouseUp);
                setTimeout(() => {
                    expect(pivotGridObj.olapEngineModule.mdxQuery).toBe('Select NON EMPTY (({DrilldownLevel({[Customer].[Customer Geography]})})) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON COLUMNS, NON EMPTY (({DrilldownLevel({[Date].[Fiscal]})}) * {{[Measures].[Internet Sales Amount]}}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON ROWS FROM [Adventure Works] CELL PROPERTIES VALUE, FORMAT_STRING, FORMATTED_VALUE');
                    pivotButton = [].slice.call((rowAxiscontent).querySelectorAll('.e-pivot-button'));
                    expect(pivotButton.length).toEqual(2);
                    expect((pivotButton[1].querySelector('.e-content') as HTMLElement).innerText).toEqual("droppedButton");
                    done();
                }, 1000);
            });
            it('set rtl property', (done: Function) => {
                pivotGridObj.enableRtl = true;
                setTimeout(() => {
                    expect(pivotGridObj.element.classList.contains('e-rtl')).toBeTruthy;
                    done();
                }, 1000);
            });
            it('remove rtl property', (done: Function) => {
                pivotGridObj.enableRtl = false;
                setTimeout(() => {
                    expect(pivotGridObj.element.classList.contains('e-rtl')).not.toBeTruthy;
                    done();
                }, 1000);
            });
            it('destroy common event handlers', () => {
                pivotGridObj.commonModule.destroy();
                expect(true).toBeTruthy();
            });
            it('pivotgrid destroy', () => {
                pivotGridObj.destroy();
                expect(true).toBeTruthy();
            });
            it('pivotgrid destroy expect', () => {
                expect(pivotGridObj.element.innerHTML).toBe('');
            });
        });
    });

    it('memory leak', () => {
        profile.sample();
        let average: any = inMB(profile.averageChange);
        //Check average change in memory samples to not be over 10MB
        //expect(average).toBeLessThan(10);
        let memory: any = inMB(getMemoryProfile());
        //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
    });
});

