
import { TreeMap } from '../../../src/treemap/treemap';
import { TreeMapHighlight, TreeMapSelection } from '../../../src/treemap/user-interaction/highlight-selection';
import { MouseEvents } from '../base/events.spec';
import { ILoadedEventArgs } from '../../../src/treemap/model/interface';
import { createElement, remove } from '@syncfusion/ej2-base';
import { jobData, sportsData } from '../base/data.spec';
import { electionData } from '../base/election.spec';
import  {profile , inMB, getMemoryProfile} from '../common.spec';
TreeMap.Inject(TreeMapHighlight, TreeMapSelection);

let jobDataSource: Object[] = jobData;
let gameDataSource: Object[] = sportsData;
/**
 * Tree map spec document
 */

describe('TreeMap component Spec', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
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
            document.getElementById(id).remove();
        });

        it('Checking with drilldown for each levels ', () => {
            treemap.loaded = (args: ILoadedEventArgs) => {
                let rectEle: Element = document.getElementById(args.treemap.element.id + '_Level_Index_0_Item_Index_0_RectPath');
                let eventObj: Object = {
                    target: rectEle,
                    type: 'mouseup',
                    preventDefault: prevent,
                    pageX: rectEle.getBoundingClientRect().left,
                    pageY: (rectEle.getBoundingClientRect().top + 10)
                };
                treemap.mouseEndOnTreeMap(<PointerEvent>eventObj);
                treemap.mouseEndOnTreeMap(<PointerEvent>eventObj);
                treemap.mouseEndOnTreeMap(<PointerEvent>eventObj);
                treemap.mouseEndOnTreeMap(<PointerEvent>eventObj);
                rectEle = document.getElementById(args.treemap.element.id + '_Level_Index_0_Item_Index_1_RectPath');
                eventObj = {
                    target: rectEle,
                    type: 'mouseup',
                    preventDefault: prevent,
                    pageX: rectEle.getBoundingClientRect().left,
                    pageY: (rectEle.getBoundingClientRect().top + 10)
                };
                treemap.mouseEndOnTreeMap(<PointerEvent>eventObj);
                rectEle = document.getElementById(args.treemap.element.id + '_Level_Index_1_Item_Index_1_RectPath');
                eventObj = {
                    target: rectEle,
                    type: 'mouseup',
                    preventDefault: prevent,
                    pageX: rectEle.getBoundingClientRect().left,
                    pageY: (rectEle.getBoundingClientRect().top + 10)
                };
                treemap.mouseEndOnTreeMap(<PointerEvent>eventObj);
                rectEle = document.getElementById(args.treemap.element.id + '_Level_Index_1_Item_Index_0_RectPath');
                eventObj = {
                    target: rectEle,
                    type: 'mouseup',
                    preventDefault: prevent,
                    pageX: rectEle.getBoundingClientRect().left,
                    pageY: (rectEle.getBoundingClientRect().top + 10)
                };
                treemap.mouseEndOnTreeMap(<PointerEvent>eventObj);
            };
            treemap.leafItemSettings.labelPosition = 'BottomCenter';
            treemap.enableDrillDown = true;
            treemap.refresh();
        });
    });

    describe('Checking with drilldown spec to generate Legend in each level', () => {
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
                dataSource: jobData,
                enableDrillDown: true,
                palette: ['green'],
                weightValuePath: 'EmployeesCount',
                legendSettings: {
                    visible: true,
                    position: 'Top',
                    mode: 'Default'
                },
                leafItemSettings: {
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
            document.getElementById(id).remove();
        });

        it('Checking with drilldown to generate legend for each levels ', () => {
            treemap.loaded = (args: ILoadedEventArgs) => {
                let rectEle: Element = document.getElementById('drill-container_Level_Index_0_Item_Index_0_RectPath');
                let eventObj: Object = {
                    target: rectEle,
                    type: 'mouseup',
                    preventDefault: prevent,
                };

                treemap.mouseEndOnTreeMap(<PointerEvent>eventObj);
                rectEle = document.getElementById('drill-container_Level_Index_1_Item_Index_1_RectPath');
                eventObj = {
                    target: rectEle,
                    type: 'mouseup',
                    preventDefault: prevent,
                };
                treemap.mouseEndOnTreeMap(<PointerEvent>eventObj);
            };
            treemap.refresh();
        });
    });


    describe('TreeMap highlight spec', () => {
        let element: Element;
        let treemap: TreeMap;
        let prevent: Function = (): void => { };
        let trigger: MouseEvents = new MouseEvents();
        let id: string = 'highLight-container';
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
            document.getElementById(id).remove();
        });
        it('Checking with highlight - item mode', () => {
            treemap.loaded = (args: ILoadedEventArgs) => {
                let layoutID: string = args.treemap.element.id + '_TreeMap_' + args.treemap.layoutType + '_Layout';
                let layoutEle: Element = document.getElementById(layoutID);
                let rectEle: Element; let eventObj: Object = {};
                rectEle = layoutEle.childNodes[0] as Element;
                eventObj = {
                    target: rectEle,
                    type: 'mousemove',
                    preventDefault: prevent,
                    pageX: rectEle.getBoundingClientRect().left,
                    pageY: (rectEle.getBoundingClientRect().top + 10)
                };
                treemap.mouseMoveOnTreeMap(<PointerEvent>eventObj);
                treemap.mouseMoveOnTreeMap(<PointerEvent>eventObj);
            };
            treemap.leafItemSettings.labelPosition = 'TopCenter';
            treemap.enableDrillDown = false;
            treemap.highlightSettings.enable = true;
            treemap.refresh();
        });

        it('Checking with highlight - child mode', () => {
            treemap.loaded = (args: ILoadedEventArgs) => {
                let layoutID: string = args.treemap.element.id + '_TreeMap_' + args.treemap.layoutType + '_Layout';
                let layoutEle: Element = document.getElementById(layoutID);
                let rectEle: Element; let eventObj: Object = {};
                rectEle = layoutEle.childNodes[1] as Element;
                eventObj = {
                    target: rectEle,
                    type: 'mousemove',
                    preventDefault: prevent,
                    pageX: rectEle.getBoundingClientRect().left,
                    pageY: (rectEle.getBoundingClientRect().top + 10)
                }
                treemap.mouseMoveOnTreeMap(<PointerEvent>eventObj);
            };
            treemap.leafItemSettings.labelPosition = 'TopRight';
            treemap.highlightSettings.mode = 'Child';
            treemap.refresh();
        });

        it('Checking with highlight - Parent mode', () => {
            treemap.loaded = (args: ILoadedEventArgs) => {
                let layoutID: string = args.treemap.element.id + '_TreeMap_' + args.treemap.layoutType + '_Layout';
                let layoutEle: Element = document.getElementById(layoutID);
                let rectEle: Element; let eventObj: Object = {};
                rectEle = layoutEle.childNodes[2] as Element;
                eventObj = {
                    target: rectEle,
                    type: 'mousemove',
                    preventDefault: prevent,
                    pageX: rectEle.getBoundingClientRect().left,
                    pageY: (rectEle.getBoundingClientRect().top + 10)
                };
                treemap.mouseMoveOnTreeMap(<PointerEvent>eventObj);
            };
            treemap.leafItemSettings.labelPosition = 'CenterLeft';
            treemap.highlightSettings.mode = 'Parent';
            treemap.refresh();
        });

        it('Checking with highlight - All mode', () => {
            treemap.loaded = (args: ILoadedEventArgs) => {
                let layoutID: string = args.treemap.element.id + '_TreeMap_' + args.treemap.layoutType + '_Layout';
                let layoutEle: Element = document.getElementById(layoutID);
                let rectEle: Element; let eventObj: Object = {};
                rectEle = layoutEle.childNodes[3] as Element;
                eventObj = {
                    target: rectEle,
                    type: 'mousemove',
                    preventDefault: prevent,
                    pageX: rectEle.getBoundingClientRect().left,
                    pageY: (rectEle.getBoundingClientRect().top + 10)
                };
                treemap.mouseMoveOnTreeMap(<PointerEvent>eventObj);
            };
            treemap.leafItemSettings.labelPosition = 'Center';
            treemap.highlightSettings.mode = 'All';
            treemap.refresh();
        });

        it('Checking with mouse move on title', () => {
            treemap.loaded = (args: ILoadedEventArgs) => {
                let titleEle: Element = document.getElementById(args.treemap.element.id + '_TreeMap_title');
                let eventObj: Object = {};
                eventObj = {
                    target: titleEle,
                    type: 'mousemove',
                    preventDefault: prevent,
                    pageX: titleEle.getBoundingClientRect().left,
                    pageY: (titleEle.getBoundingClientRect().top + 10)
                };
                treemap.mouseMoveOnTreeMap(<PointerEvent>eventObj);
            };
            treemap.refresh();
        });
    });
    describe('TreeMap selection spec', () => {
        let element: Element;
        let treemap: TreeMap;
        let prevent: Function = (): void => { };
        let trigger: MouseEvents = new MouseEvents();
        let id: string = 'selection-container';
        beforeAll(() => {
            if (document.getElementById('highLight-container')) {
                document.getElementById('highLight-container').remove();
            }
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
                    labelPath: 'JobGroup',
                    fill: '#6699cc',
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
            document.getElementById(id).remove();
        });
        it('Checking with selection - item mode', () => {
            treemap.loaded = (args: ILoadedEventArgs) => {
                let layoutID: string = args.treemap.element.id + '_TreeMap_' + args.treemap.layoutType + '_Layout';
                let layoutEle: Element = document.getElementById(layoutID);
                let rectEle: Element; let eventObj: Object = {};
                rectEle = layoutEle.childNodes[0] as Element;
                eventObj = {
                    target: rectEle,
                    type: 'mousedown',
                    preventDefault: prevent,
                    pageX: rectEle.getBoundingClientRect().left,
                    pageY: (rectEle.getBoundingClientRect().top + 10)
                };
                treemap.mouseDownOnTreeMap(<PointerEvent>eventObj);
                treemap.mouseDownOnTreeMap(<PointerEvent>eventObj);
            };
            treemap.selectionSettings.enable = true;
            treemap.refresh();
        });

        it('Checking with highlight and selection together ', () => {
            treemap.loaded = (args: ILoadedEventArgs) => {
                let layoutID: string = args.treemap.element.id + '_TreeMap_' + args.treemap.layoutType + '_Layout';
                let layoutEle: Element = document.getElementById(layoutID);
                let rectEle: Element; let eventObj: Object = {};
                rectEle = layoutEle.childNodes[0] as Element;
                eventObj = {
                    target: rectEle,
                    type: 'mousemove',
                    preventDefault: prevent,
                    pageX: rectEle.getBoundingClientRect().left,
                    pageY: (rectEle.getBoundingClientRect().top + 10)
                };
                treemap.mouseMoveOnTreeMap(<PointerEvent>eventObj);
                eventObj['type'] = 'mousedown';
                treemap.mouseDownOnTreeMap(<PointerEvent>eventObj);
                rectEle = layoutEle.childNodes[2] as Element;
                eventObj = {
                    target: rectEle,
                    type: 'mousemove',
                    preventDefault: prevent,
                    pageX: rectEle.getBoundingClientRect().left,
                    pageY: (rectEle.getBoundingClientRect().top + 10)
                };
                treemap.mouseMoveOnTreeMap(<PointerEvent>eventObj);
            };
            treemap.highlightSettings.enable = true;
            treemap.refresh();
        });

        it('Checking with mouse down on title', () => {
            treemap.loaded = (args: ILoadedEventArgs) => {
                let titleEle: Element = document.getElementById(args.treemap.element.id + '_TreeMap_title');
                let eventObj: Object = {};
                eventObj = {
                    target: titleEle,
                    type: 'mousedown',
                    preventDefault: prevent,
                    pageX: titleEle.getBoundingClientRect().left,
                    pageY: (titleEle.getBoundingClientRect().top + 10)
                };
                treemap.mouseDownOnTreeMap(<PointerEvent>eventObj);
            };
            treemap.refresh();
        });

        it('Checking with mouse click event', () => {
            treemap.loaded = (args: ILoadedEventArgs) => {
                let layoutID: string = args.treemap.element.id + '_TreeMap_' + args.treemap.layoutType + '_Layout';
                let layoutEle: Element = document.getElementById(layoutID);
                let rectEle: Element; let eventObj: Object = {};
                rectEle = layoutEle.childNodes[0] as Element;
                eventObj = {
                    target: rectEle,
                    type: 'click',
                    preventDefault: prevent,
                    pageX: rectEle.getBoundingClientRect().left,
                    pageY: (rectEle.getBoundingClientRect().top + 10)
                };
                treemap.clickOnTreeMap(<PointerEvent>eventObj);
            };
            treemap.refresh();
        });
    });

    describe('TreeMap highlight and selection spec with legendsettings', () => {
        let element: Element;
        let treemap: TreeMap;
        let prevent: Function = (): void => { };
        let trigger: MouseEvents = new MouseEvents();
        let id: string = 'container';
        beforeAll(() => {
            element = createElement('div', { id: id });
            (element as HTMLDivElement).style.width = '600px';
            (element as HTMLDivElement).style.height = '400px';
            document.body.appendChild(element);
            treemap = new TreeMap({
                legendSettings: {
                    visible: true,
                    mode: "Default",
                    position: 'Top',
                    shape: 'Rectangle',
                    height: '10'
                },
                titleSettings: {
                    text: 'Tree Map control',
                },
                dataSource: electionData,
                weightValuePath: 'Population',
                rangeColorValuePath: 'WinPercentage',
                equalColorValuePath: 'Winner',
                leafItemSettings: {
                    labelPath: 'State',
                    fill: '#6699cc',
                    border: { color: 'white', width: 0.5 },
                    colorMapping: [
                        {
                            value: 'Trump', color: '#D84444'
                        },
                        {
                            value: 'Clinton', color: '#316DB5'
                        }
                    ]
                },
                highlightSettings: { fill: 'orange' },
                selectionSettings: { fill: 'green' }
            }, '#' + id);
        });
        afterAll(() => {
            treemap.destroy();
            document.getElementById(id).remove();
        });

        it('Checking with highlight enable on outside of the node', () => {
            treemap.loaded = (args: ILoadedEventArgs) => {
                let rectEle: Element; let eventObj: Object = {};
                rectEle = document.getElementById(args.treemap.element.id + '_TreeMap_Border');
                eventObj = {
                    target: rectEle,
                    type: 'mousemove',
                    preventDefault: prevent,
                    pageX: rectEle.getBoundingClientRect().left,
                    pageY: (rectEle.getBoundingClientRect().top + 10)
                };
                treemap.mouseMoveOnTreeMap(<PointerEvent>eventObj);
            };
            treemap.highlightSettings.enable = true;
            treemap.refresh();
        });

        it('Checking with node highlight enable with default mode', () => {
            treemap.loaded = (args: ILoadedEventArgs) => {
                let layoutID: string = args.treemap.element.id + '_TreeMap_' + args.treemap.layoutType + '_Layout';
                let layoutEle: Element = document.getElementById(layoutID);
                let rectEle: Element; let eventObj: Object = {};
                rectEle = layoutEle.childNodes[0] as Element;
                eventObj = {
                    target: rectEle,
                    type: 'mousemove',
                    preventDefault: prevent,
                    pageX: rectEle.getBoundingClientRect().left,
                    pageY: (rectEle.getBoundingClientRect().top + 10)
                };
                treemap.mouseMoveOnTreeMap(<PointerEvent>eventObj);
            };
            treemap.highlightSettings.enable = true;
            treemap.refresh();
        });

        it('Checking with multi node highlight enable with default mode', () => {
            treemap.loaded = (args: ILoadedEventArgs) => {
                let layoutID: string = args.treemap.element.id + '_TreeMap_' + args.treemap.layoutType + '_Layout';
                let layoutEle: Element = document.getElementById(layoutID);
                let rectEle: Element; let eventObj: Object = {};
                rectEle = layoutEle.childNodes[0] as Element;
                eventObj = {
                    target: rectEle,
                    type: 'mousemove',
                    preventDefault: prevent,
                    pageX: rectEle.getBoundingClientRect().left,
                    pageY: (rectEle.getBoundingClientRect().top + 10)
                };
                treemap.mouseMoveOnTreeMap(<PointerEvent>eventObj);
                rectEle = document.getElementById('container_Level_Index_0_Item_Index_2_RectPath');
                eventObj = {
                    target: rectEle,
                    type: 'mousemove',
                    preventDefault: prevent,
                    pageX: rectEle.getBoundingClientRect().left,
                    pageY: (rectEle.getBoundingClientRect().top + 10)
                };
                treemap.mouseMoveOnTreeMap(<PointerEvent>eventObj);
            };
            treemap.highlightSettings.enable = true;
            treemap.refresh();
        });

        it('Checking with node selection enable with default mode', () => {
            treemap.loaded = (args: ILoadedEventArgs) => {
                let layoutID: string = args.treemap.element.id + '_TreeMap_' + args.treemap.layoutType + '_Layout';
                let layoutEle: Element = document.getElementById(layoutID);
                let rectEle: Element; let eventObj: Object = {};
                rectEle = layoutEle.childNodes[0] as Element;
                eventObj = {
                    target: rectEle,
                    type: 'mousedown',
                    preventDefault: prevent,
                    pageX: rectEle.getBoundingClientRect().left,
                    pageY: (rectEle.getBoundingClientRect().top + 10)
                };
                treemap.mouseDownOnTreeMap(<PointerEvent>eventObj);
                treemap.mouseDownOnTreeMap(<PointerEvent>eventObj);
            };
            treemap.selectionSettings.enable = true;
            treemap.refresh();
        });

        it('Checking with highlight and selection together in nodes of the treemap', () => {
            treemap.loaded = (args: ILoadedEventArgs) => {
                let layoutID: string = args.treemap.element.id + '_TreeMap_' + args.treemap.layoutType + '_Layout';
                let layoutEle: Element = document.getElementById(layoutID);
                let rectEle: Element; let eventObj: Object = {};
                rectEle = layoutEle.childNodes[0] as Element;
                eventObj = {
                    target: rectEle,
                    type: 'mousemove',
                    preventDefault: prevent,
                    pageX: rectEle.getBoundingClientRect().left,
                    pageY: (rectEle.getBoundingClientRect().top + 10)
                };
                treemap.mouseMoveOnTreeMap(<PointerEvent>eventObj);
                rectEle = document.getElementById(args.treemap.element.id + '_TreeMap_Border');
                eventObj = {
                    target: rectEle,
                    type: 'mousemove',
                    preventDefault: prevent,
                    pageX: rectEle.getBoundingClientRect().left,
                    pageY: (rectEle.getBoundingClientRect().top + 10)
                };
                treemap.mouseMoveOnTreeMap(<PointerEvent>eventObj);
                eventObj['type'] = 'mousedown';
                treemap.mouseDownOnTreeMap(<PointerEvent>eventObj);
                rectEle = layoutEle.childNodes[2] as Element;
                eventObj = {
                    target: rectEle,
                    type: 'mousemove',
                    preventDefault: prevent,
                    pageX: rectEle.getBoundingClientRect().left,
                    pageY: (rectEle.getBoundingClientRect().top + 10)
                };
                treemap.mouseMoveOnTreeMap(<PointerEvent>eventObj);
            };
            treemap.highlightSettings.enable = true;
            treemap.selectionSettings.enable = true;
            treemap.refresh();
        });

        it('', () => {
            treemap.loaded = (args: ILoadedEventArgs) => {
                let rectEle: Element; let eventObj: Object = {};
                rectEle = document.getElementById(args.treemap.element.id + '_TreeMap_Border');
                eventObj = {
                    target: rectEle,
                    type: 'mousemove',
                    preventDefault: prevent,
                    pageX: rectEle.getBoundingClientRect().left,
                    pageY: (rectEle.getBoundingClientRect().top + 10)
                };
                treemap.mouseMoveOnTreeMap(<PointerEvent>eventObj);
                rectEle = document.getElementById(args.treemap.element.id + '_Level_Index_0_Item_Index_18_RectPath');
                eventObj = {
                    target: rectEle,
                    type: 'mousemove',
                    preventDefault: prevent,
                    pageX: rectEle.getBoundingClientRect().left,
                    pageY: (rectEle.getBoundingClientRect().top + 10)
                };
                treemap.mouseMoveOnTreeMap(<PointerEvent>eventObj);
                rectEle = document.getElementById(args.treemap.element.id + '_TreeMap_Border');
                eventObj = {
                    target: rectEle,
                    type: 'mousemove',
                    preventDefault: prevent,
                    pageX: rectEle.getBoundingClientRect().left,
                    pageY: (rectEle.getBoundingClientRect().top + 10)
                };
                treemap.mouseMoveOnTreeMap(<PointerEvent>eventObj);
            };
            treemap.highlightSettings.enable = true;
            treemap.selectionSettings.enable = true;
            treemap.refresh();
        });

        it('Checking with legend highlight enable with default mode', () => {
            treemap.loaded = (args: ILoadedEventArgs) => {
                let rectEle: Element; let eventObj: Object = {};
                rectEle = document.getElementById(args.treemap.element.id + '_Legend_Shape_Index_1');
                eventObj = {
                    target: rectEle,
                    type: 'mousemove',
                    preventDefault: prevent,
                    pageX: rectEle.getBoundingClientRect().left,
                    pageY: (rectEle.getBoundingClientRect().top + 10)
                };
                treemap.mouseMoveOnTreeMap(<PointerEvent>eventObj);
            };
            treemap.highlightSettings.enable = true;
            treemap.refresh();
        });


        it('Checking with multi legend highlight enable with default mode', () => {
            treemap.loaded = (args: ILoadedEventArgs) => {
                let rectEle: Element; let eventObj: Object = {};
                rectEle = document.getElementById(args.treemap.element.id + '_Legend_Shape_Index_1');
                eventObj = {
                    target: rectEle,
                    type: 'mousemove',
                    preventDefault: prevent,
                    pageX: rectEle.getBoundingClientRect().left,
                    pageY: (rectEle.getBoundingClientRect().top + 10)
                };
                treemap.mouseMoveOnTreeMap(<PointerEvent>eventObj);
                rectEle = document.getElementById(args.treemap.element.id + '_Legend_Shape_Index_0');
                eventObj = {
                    target: rectEle,
                    type: 'mousemove',
                    preventDefault: prevent,
                    pageX: rectEle.getBoundingClientRect().left,
                    pageY: (rectEle.getBoundingClientRect().top + 10)
                };
                treemap.mouseMoveOnTreeMap(<PointerEvent>eventObj);
            };
            treemap.highlightSettings.enable = true;
            treemap.refresh();
        });

        it('Checking with legend highlight enable with intreactive mode', () => {
            treemap.loaded = (args: ILoadedEventArgs) => {
                let rectEle: Element; let eventObj: Object = {};
                rectEle = document.getElementById(args.treemap.element.id + '_Legend_Index_0');
                eventObj = {
                    target: rectEle,
                    type: 'mousemove',
                    preventDefault: prevent,
                    pageX: rectEle.getBoundingClientRect().left,
                    pageY: (rectEle.getBoundingClientRect().top + 10)
                };
                treemap.mouseMoveOnTreeMap(<PointerEvent>eventObj);
            };
            treemap.legendSettings.mode = 'Interactive';
            treemap.highlightSettings.enable = true;
            treemap.refresh();
        });

        it('Checking with legend selection enable with interactive mode', () => {
            treemap.loaded = (args: ILoadedEventArgs) => {
                let rectEle: Element; let eventObj: Object = {};
                rectEle = document.getElementById(args.treemap.element.id + '_Legend_Index_0');
                eventObj = {
                    target: rectEle,
                    type: 'mousedown',
                    preventDefault: prevent,
                    pageX: rectEle.getBoundingClientRect().left,
                    pageY: (rectEle.getBoundingClientRect().top + 10)
                };
                treemap.mouseDownOnTreeMap(<PointerEvent>eventObj);
                treemap.mouseDownOnTreeMap(<PointerEvent>eventObj);
            };
            treemap.legendSettings.mode = 'Interactive';
            treemap.selectionSettings.enable = true;
            treemap.refresh();
        });

        it('Checking with legend selection enable with interactive mode', () => {
            treemap.loaded = (args: ILoadedEventArgs) => {
                let rectEle: Element; let eventObj: Object = {};
                rectEle = document.getElementById(args.treemap.element.id + '_Legend_Index_1');
                eventObj = {
                    target: rectEle,
                    type: 'mousedown',
                    preventDefault: prevent,
                    pageX: rectEle.getBoundingClientRect().left,
                    pageY: (rectEle.getBoundingClientRect().top + 10)
                };
                treemap.mouseDownOnTreeMap(<PointerEvent>eventObj);
                rectEle = document.getElementById(args.treemap.element.id + '_Legend_Index_0');
                eventObj = {
                    target: rectEle,
                    type: 'mousedown',
                    preventDefault: prevent,
                    pageX: rectEle.getBoundingClientRect().left,
                    pageY: (rectEle.getBoundingClientRect().top + 10)
                };
                treemap.mouseDownOnTreeMap(<PointerEvent>eventObj);
            };
            treemap.legendSettings.mode = "Interactive";
            treemap.selectionSettings.enable = true;
            treemap.refresh();
        });
    });

    describe('TreeMap selection spec with legendsettings', () => {
        let element: Element;
        let treemap: TreeMap;
        let prevent: Function = (): void => { };
        let trigger: MouseEvents = new MouseEvents();
        let id: string = 'container';
        beforeAll(() => {
            element = createElement('div', { id: id });
            (element as HTMLDivElement).style.width = '600px';
            (element as HTMLDivElement).style.height = '400px';
            document.body.appendChild(element);
            treemap = new TreeMap({
                legendSettings: {
                    visible: true,
                },
                dataSource: electionData,
                weightValuePath: 'Population',
                rangeColorValuePath: 'WinPercentage',
                equalColorValuePath: 'Winner',
                leafItemSettings: {
                    labelPath: 'State',
                    fill: '#6699cc',
                    border: { color: 'white', width: 0.5 },
                    colorMapping: [
                        {
                            value: 'Trump', color: '#D84444'
                        },
                        {
                            value: 'Clinton', color: '#316DB5'
                        }
                    ]
                },
                selectionSettings: { fill: 'green' }
            }, '#' + id);
        });
        afterAll(() => {
            treemap.destroy();
            document.getElementById(id).remove();
        });

        it('Checking with node selection without highlight', () => {
            treemap.loaded = (args: ILoadedEventArgs) => {
                let rectEle: Element; let eventObj: Object = {};
                rectEle = document.getElementById('container_Level_Index_0_Item_Index_13_RectPath');
                eventObj = {
                    target: rectEle,
                    type: 'mousemove',
                    preventDefault: prevent,
                    pageX: rectEle.getBoundingClientRect().left,
                    pageY: (rectEle.getBoundingClientRect().top + 10)
                };
                treemap.mouseDownOnTreeMap(<PointerEvent>eventObj);
            };
            treemap.selectionSettings.enable = true;
            treemap.refresh();
        });

        it('Checking with legend selection without highlight', () => {
            treemap.loaded = (args: ILoadedEventArgs) => {
                let rectEle: Element; let eventObj: Object = {};
                rectEle = document.getElementById(args.treemap.element.id + '_Legend_Shape_Index_0');
                eventObj = {
                    target: rectEle,
                    type: 'mousemove',
                    preventDefault: prevent,
                    pageX: rectEle.getBoundingClientRect().left,
                    pageY: (rectEle.getBoundingClientRect().top + 10)
                };
                treemap.mouseDownOnTreeMap(<PointerEvent>eventObj);
            };
            treemap.selectionSettings.enable = true;
            treemap.refresh();
        });

        it('Checking with legend selection without highlight with interactive legend mode', () => {
            treemap.loaded = (args: ILoadedEventArgs) => {
                let rectEle: Element; let eventObj: Object = {};
                rectEle = document.getElementById(args.treemap.element.id + '_Legend_Index_0');
                eventObj = {
                    target: rectEle,
                    type: 'mousemove',
                    preventDefault: prevent,
                    pageX: rectEle.getBoundingClientRect().left,
                    pageY: (rectEle.getBoundingClientRect().top + 10)
                };
                treemap.mouseDownOnTreeMap(<PointerEvent>eventObj);
                treemap.mouseDownOnTreeMap(<PointerEvent>eventObj);
            };
            treemap.legendSettings.mode = 'Interactive';
            treemap.selectionSettings.enable = true;
            treemap.refresh();
        });
    });

    describe('TreeMap highlight spec with legendsettings', () => {
        let element: Element;
        let treemap: TreeMap;
        let prevent: Function = (): void => { };
        let trigger: MouseEvents = new MouseEvents();
        let id: string = 'container';
        beforeAll(() => {
            element = createElement('div', { id: id });
            (element as HTMLDivElement).style.width = '600px';
            (element as HTMLDivElement).style.height = '400px';
            document.body.appendChild(element);
            treemap = new TreeMap({
                legendSettings: {
                    visible: true,
                },
                dataSource: electionData,
                weightValuePath: 'Population',
                rangeColorValuePath: 'WinPercentage',
                equalColorValuePath: 'Winner',
                leafItemSettings: {
                    labelPath: 'State',
                    fill: '#6699cc',
                    border: { color: 'white', width: 0.5 },
                    colorMapping: [
                        {
                            value: 'Trump', color: '#D84444'
                        },
                        {
                            value: 'Clinton', color: '#316DB5'
                        }
                    ]
                },
                highlightSettings: { fill: 'orange' }
            }, '#' + id);
        });
        afterAll(() => {
            treemap.destroy();
            document.getElementById(id).remove();
        });

        it('Checking with legend highlight without selection with interactive legend', () => {
            treemap.loaded = (args: ILoadedEventArgs) => {
                let rectEle: Element; let eventObj: Object = {};
                rectEle = document.getElementById(args.treemap.element.id + '_Legend_Index_0');
                eventObj = {
                    target: rectEle,
                    type: 'mousemove',
                    preventDefault: prevent,
                    pageX: rectEle.getBoundingClientRect().left,
                    pageY: (rectEle.getBoundingClientRect().top + 10)
                };
                treemap.mouseMoveOnTreeMap(<PointerEvent>eventObj);
            };
            treemap.legendSettings.mode = 'Interactive';
            treemap.highlightSettings.enable = true;
            treemap.refresh();
        });

        it('Checking with node highlight without selection with interactive legend', () => {
            treemap.loaded = (args: ILoadedEventArgs) => {
                let rectEle: Element; let eventObj: Object = {};
                rectEle = document.getElementById(args.treemap.element.id + '_Level_Index_0_Item_Index_7_RectPath');
                eventObj = {
                    target: rectEle,
                    type: 'mousemove',
                    preventDefault: prevent,
                    pageX: rectEle.getBoundingClientRect().left,
                    pageY: (rectEle.getBoundingClientRect().top + 10)
                };
                treemap.mouseMoveOnTreeMap(<PointerEvent>eventObj);
            };
            treemap.legendSettings.mode = 'Interactive';
            treemap.highlightSettings.enable = true;
            treemap.refresh();
        });

        it('Checking with node selection with highlight', () => {
            treemap.loaded = (args: ILoadedEventArgs) => {
                let rectEle: Element; let eventObj: Object = {};
                rectEle = document.getElementById(args.treemap.element.id + '_Level_Index_0_Item_Index_7_RectPath');
                eventObj = {
                    target: rectEle,
                    type: 'mousemove',
                    preventDefault: prevent,
                    pageX: rectEle.getBoundingClientRect().left,
                    pageY: (rectEle.getBoundingClientRect().top + 10)
                };
                treemap.mouseDownOnTreeMap(<PointerEvent>eventObj);
                rectEle = document.getElementById(args.treemap.element.id + '_Level_Index_0_Item_Index_10_RectPath');
                eventObj = {
                    target: rectEle,
                    type: 'mousemove',
                    preventDefault: prevent,
                    pageX: rectEle.getBoundingClientRect().left,
                    pageY: (rectEle.getBoundingClientRect().top + 10)
                };
                treemap.mouseMoveOnTreeMap(<PointerEvent>eventObj);
                rectEle = document.getElementById(args.treemap.element.id + '_Level_Index_0_Item_Index_8_RectPath');
                eventObj = {
                    target: rectEle,
                    type: 'mousemove',
                    preventDefault: prevent,
                    pageX: rectEle.getBoundingClientRect().left,
                    pageY: (rectEle.getBoundingClientRect().top + 10)
                };
                treemap.mouseMoveOnTreeMap(<PointerEvent>eventObj);
            };
            treemap.selectionSettings.enable = true;
            treemap.highlightSettings.enable = true;
            treemap.refresh();
        });

        it('Checking with legend selection with node highlight', () => {
            treemap.loaded = (args: ILoadedEventArgs) => {
                let rectEle: Element; let eventObj: Object = {};
                rectEle = document.getElementById(args.treemap.element.id + '_Legend_Index_1');
                eventObj = {
                    target: rectEle,
                    type: 'mousemove',
                    preventDefault: prevent,
                    pageX: rectEle.getBoundingClientRect().left,
                    pageY: (rectEle.getBoundingClientRect().top + 10)
                };
                treemap.mouseDownOnTreeMap(<PointerEvent>eventObj);
                rectEle = document.getElementById(args.treemap.element.id + '_Level_Index_0_Item_Index_4_RectPath');
                eventObj = {
                    target: rectEle,
                    type: 'mousemove',
                    preventDefault: prevent,
                    pageX: rectEle.getBoundingClientRect().left,
                    pageY: (rectEle.getBoundingClientRect().top + 10)
                };
                treemap.mouseMoveOnTreeMap(<PointerEvent>eventObj);
                rectEle = document.getElementById(args.treemap.element.id + '_Level_Index_0_Item_Index_2_RectPath');
                eventObj = {
                    target: rectEle,
                    type: 'mousemove',
                    preventDefault: prevent,
                    pageX: rectEle.getBoundingClientRect().left,
                    pageY: (rectEle.getBoundingClientRect().top + 10)
                };
                treemap.mouseMoveOnTreeMap(<PointerEvent>eventObj);
            };
            treemap.legendSettings.mode = 'Interactive';
            treemap.selectionSettings.enable = true;
            treemap.highlightSettings.enable = true;
            treemap.refresh();
        });
    });
    it('memory leak', () => {
        profile.sample();
        let average: any = inMB(profile.averageChange)
        //Check average change in memory samples to not be over 10MB
        expect(average).toBeLessThan(10);
        let memory: any = inMB(getMemoryProfile())
        //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
    });
});