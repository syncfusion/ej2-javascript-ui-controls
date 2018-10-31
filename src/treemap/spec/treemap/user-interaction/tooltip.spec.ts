
import { TreeMap } from '../../../src/treemap/treemap';
import { TreeMapTooltip } from '../../../src/treemap/user-interaction/tooltip';
import { MouseEvents } from '../base/events.spec';
import { ILoadedEventArgs, ITreeMapEventArgs } from '../../../src/treemap/model/interface';
import { createElement, remove } from '@syncfusion/ej2-base';
import { jobData, sportsData } from '../base/data.spec';
TreeMap.Inject(TreeMapTooltip);

let jobDataSource: Object[] = jobData;
let gameDataSource: Object[] = sportsData;
/**
 * Tree map spec document
 */

describe('TreeMap component Spec', () => {
    describe('TreeMap drill down spec', () => {
        let element: Element;
        let treemap: TreeMap;
        let prevent: Function = (): void => { };
        let trigger: MouseEvents = new MouseEvents();
        let id: string = 'drill-container';
        beforeAll(() => {
            element = createElement('div', { id: id });
            (element as HTMLDivElement).style.width = '600px';
            (element as HTMLDivElement).style.height = '400px';
            document.body.appendChild(element);
            treemap = new TreeMap({
                border: {
                    color: 'red',
                    width: 2
                },
                titleSettings: {
                    text: 'Tree Map control',
                },
                dataSource: jobData,
                weightValuePath: 'EmployeesCount',
                leafItemSettings: {
                    interSectAction: 'Wrap',
                    labelFormat: '${JobGroup}<br>$${EmployeesCount}',
                    labelPath: 'JobGroup',
                    fill: '#6699cc',
                    labelPosition: 'BottomRight',
                    border: { color: 'black', width: 2 }
                },
                levels: [
                    { groupPath: 'Country', fill: '#336699', border: { color: 'black', width: 2 } },
                    { groupPath: 'JobDescription', fill: '#336699', border: { color: 'black', width: 2 } }
                ]
            }, '#' + id);
        });
        afterAll(() => {
            treemap.destroy();
            remove(treemap.element);
        });

        it('Checking with default tooltip ', () => {
            treemap.loaded = (args: ILoadedEventArgs) => {
                let layoutID: string = args.treemap.element.id + '_TreeMap_' + args.treemap.layoutType + '_Layout';
                let element: Element = document.getElementById(layoutID);
                let rectEle: Element;
                let eventObj: Object;
                for (let i: number = 0; i < element.childElementCount; i++) {
                    rectEle = element.childNodes[i] as Element;
                    eventObj = {
                        target: rectEle,
                        type: 'mousemove',
                        pageX: rectEle.getBoundingClientRect().left,
                        pageY: (rectEle.getBoundingClientRect().top + 10)
                    };
                    treemap.treeMapTooltipModule.renderTooltip(<PointerEvent>eventObj);
                }
            };
            treemap.tooltipSettings.visible = true;
            treemap.refresh();
        });

        it('Checking with currency format', () => {
            treemap.loaded = (args: ILoadedEventArgs) => {
                let layoutID: string = args.treemap.element.id + '_TreeMap_' + args.treemap.layoutType + '_Layout';
                let rectEle: Element = document.getElementById(args.treemap.element.id + '_Level_Index_1_Item_Index_14_RectPath');
                let rectBounds: ClientRect = rectEle.getBoundingClientRect();
                let eventObj: Object = {
                    target: rectEle,
                    type: 'mousemove',
                    pageX: rectEle.getBoundingClientRect().left,
                    pageY: (rectEle.getBoundingClientRect().top + 10)
                };
                treemap.treeMapTooltipModule.renderTooltip(<PointerEvent>eventObj);
                treemap.mouseLeaveOnTreeMap(<PointerEvent>eventObj);
            };
            treemap.format = 'c';
            treemap.refresh();
        });

        it('Checking with tooltip format', () => {
            treemap.loaded = (args: ILoadedEventArgs) => {
                let rectEle: Element = document.getElementById(args.treemap.element.id + '_Level_Index_1_Item_Index_14_RectPath');
                let rectBounds: ClientRect = rectEle.getBoundingClientRect();
                let titleEle: Element = document.getElementById(args.treemap.element.id + '_TreeMap_title');
                let eventObj: Object = {
                    target: rectEle,
                    type: 'touchend',
                    changedTouches: [{ pageX: rectEle.getBoundingClientRect().left, pageY: rectEle.getBoundingClientRect().top }]
                };
                treemap.treeMapTooltipModule.renderTooltip(<PointerEvent>eventObj);
                eventObj = {
                    target: titleEle,
                    type: 'mousemove',
                    pageX: titleEle.getBoundingClientRect().left,
                    pageY: (titleEle.getBoundingClientRect().top + 10)
                };
                treemap.treeMapTooltipModule.renderTooltip(<PointerEvent>eventObj);
            };
            treemap.tooltipSettings.format = 'Employees Count: ${EmployeesCount}';
            treemap.refresh();
        });

        it('Checking with tooltip template', () => {
            treemap.loaded = (args: ILoadedEventArgs) => {
                let rectEle: Element = document.getElementById(args.treemap.element.id + '_Level_Index_1_Item_Index_14_RectPath');
                let eventObj: Object = {
                    target: rectEle,
                    type: 'touchend',
                    changedTouches: [{ pageX: rectEle.getBoundingClientRect().left, pageY: rectEle.getBoundingClientRect().top }]
                };
                treemap.mouseEndOnTreeMap(<PointerEvent>eventObj);
            };
            treemap.tooltipRendering = (args: ITreeMapEventArgs) => {
                args.cancel = true;
            };
            treemap.tooltipSettings.template = '<div style="border 1px solid;">${EmployeesCount}</div>';
            treemap.refresh();
        });

        it('Checking with add event listener method', () => {
            treemap.isDestroyed = true;
            treemap.treeMapTooltipModule.addEventListener();
        });

        it('Checking with initial drilldown', () => {
            treemap.loaded = (args: ILoadedEventArgs) => {
                // put the spec here//
            };
            treemap.initialDrillDown.groupIndex = 0;
            treemap.initialDrillDown.groupName = 'Germany';
            treemap.refresh();
        });
    });
});