import { TreeMap } from '../../../src/treemap/treemap';
import { TreeMapHighlight, TreeMapSelection } from '../../../src/treemap/user-interaction/highlight-selection';
import { MouseEvents } from '../base/events.spec';
import { ILoadedEventArgs, ITreeMapTooltipRenderEventArgs, IItemClickEventArgs, IClickEventArgs, IDrillEndEventArgs, IItemHighlightEventArgs, IItemMoveEventArgs, IItemRenderingEventArgs } from '../../../src/treemap/model/interface';
import { createElement, remove } from '@syncfusion/ej2-base';
import { Airport_Count, importData, DrillDown, CarSales } from '../base/data.spec';
import  {profile , inMB, getMemoryProfile} from '../common.spec';
import { doesNotThrow } from 'assert';
TreeMap.Inject(TreeMapHighlight, TreeMapSelection);

/**
 * Tree map spec document
 */
let count = 0;
describe('TreeMap component Spec', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
    describe('TreeMap Event spec', () => {
        let svg: Element;
        let treemap: TreeMap;
        let prevent: Function = (): void => { };
        let trigger: MouseEvents = new MouseEvents();
        let id: string = 'container';
        beforeAll(() => {
            svg = createElement('div', { id: id });
            (svg as HTMLDivElement).style.width = '600px';
            (svg as HTMLDivElement).style.height = '400px';
            document.body.appendChild(svg);
            treemap = new TreeMap({
                tooltipSettings: {
                    visible: true
                },
                dataSource: Airport_Count,
                weightValuePath: 'Count',
                equalColorValuePath: 'Count',
                leafItemSettings: {
                    showLabels: true,
                    labelPath: 'State',
                    labelPosition: 'Center',
                    labelStyle: {
                        size: '13px'
                    },
                    fill: '#6699cc',
                    border: { width: 1, color: 'white' },
                }, 
            }, '#' + id);                   
        });
        afterAll(() => {
            treemap.destroy();
            document.getElementById(id).remove();
        });
    
        it('Checking with tooltip ', (done: Function) => {
            treemap.tooltipRendering = (args: ITreeMapTooltipRenderEventArgs): void => {
                args.options["textStyle"].color = "red";
                args.options["textStyle"].fontFamily = "Times New Roman";
                args.options["textStyle"].fontStyle = "italic";
                args.options["textStyle"].fontWeight = "Bold";
                args.options["textStyle"].opacity = 0.5;
                args.options["textStyle"].size = "25px";
                if (args.options["text"][0] === 'Count : 25') {
                    args.options["text"][0] = 'Brazil';
                }
            };
            treemap.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_TreeMap_Squarified_Layout');
                expect(svg.childElementCount).toBe(14);
                svg = document.getElementById('container_Level_Index_0_Item_Index_0_Group');
                expect(svg.children[1].textContent).toBe("Brazil");
                done();
            };
            treemap.refresh();
        });
        it('Checking with tooltip event cancel ', (done: Function) => {
            treemap.tooltipRendering = (args: ITreeMapTooltipRenderEventArgs): void => {
                if (args.item["name"] === "Brazil") {
                    args.cancel = true;
                }
                done();
            };
            treemap.loaded = (args: ILoadedEventArgs): void => {
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
    });
    describe('TreeMap Mousmove Event spec', () => {
        let svg: Element;
        let treemap: TreeMap;
        let prevent: Function = (): void => { };
        let trigger: MouseEvents = new MouseEvents();
        let id: string = 'container';
        beforeAll(() => {
            svg = createElement('div', { id: id });
            (svg as HTMLDivElement).style.width = '600px';
            (svg as HTMLDivElement).style.height = '400px';
            document.body.appendChild(svg);
            treemap = new TreeMap({
                titleSettings: {
                    text: 'Import and Export details of US'
                },
                dataSource: importData,
                weightValuePath: 'sales',
                levels: [
                    { groupPath: 'dataType', fill: '#c5e2f7', headerStyle: { size: '16px' }, headerAlignment: 'Center', groupGap: 5 },
                    { groupPath: 'product', fill: '#a4d1f2', headerAlignment: 'Center' , groupGap: 2 }
                ],
                leafItemSettings: {
                    labelPath: 'type',
                    fill: '#8ebfe2',
                    labelPosition: 'Center',
                    gap: 10
                },
                highlightSettings: {
                    enable: true,
                    fill: '#71b0dd',
                    border: { width: 0.3, color: 'black' },
                    opacity: '1'
                },
            }, '#' + id);            
        });
        afterAll(() => {
            treemap.destroy();
            document.getElementById(id).remove();
        });        
        it('Checking with item highlight cancel ', (done: Function) => {
            treemap.itemHighlight = (args: IItemHighlightEventArgs)=> {
                if (count === 0) {
                    let span = document.createElement("SPAN");
                    span.innerHTML = "itemHighlight Event";
                    span.setAttribute("style", "font-size: 30px");
                    let container = document.getElementById("container");
                    container.appendChild(span);
                    count++;
                }                
            };
            treemap.loaded = (args: ILoadedEventArgs): void => {
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
                done();
            };
            treemap.tooltipSettings.visible = true;
            treemap.refresh();
        });
    });
   
    describe('TreeMap Mousmove Event spec', () => {
        let svg: Element;
        let treemap: TreeMap;
        let prevent: Function = (): void => { };
        let trigger: MouseEvents = new MouseEvents();
        let id: string = 'container';
        beforeAll(() => {
            svg = createElement('div', { id: id });
            (svg as HTMLDivElement).style.width = '600px';
            (svg as HTMLDivElement).style.height = '400px';
            document.body.appendChild(svg);
            treemap = new TreeMap({
                palette: ['#9999ff', '#CCFF99', '#FFFF99', '#FF9999', '#FF99FF', '#FFCC66'],
                titleSettings: {
                    text: 'List of countries by population',
                    textStyle: { size: '15px' }
                },
                enableDrillDown: true,
                format: 'n',
                initialDrillDown: {
                    groupIndex: 1,
                    groupName: 'Eastern Africa'
                },
                useGroupingSeparator: true,
                dataSource: DrillDown,
                weightValuePath: 'Population',
                leafItemSettings: {
                    labelPath: 'Name',
                    showLabels: false,
                    labelStyle: { size: '0px' },
                    border: { color: 'black', width: 0.5 }
                },
                levels: [
                    { groupPath: 'Continent', fill: '#336699', border: { color: 'black', width: 0.5 } },
                    { groupPath: 'States', fill: '#336699', border: { color: 'black', width: 0.5 } },
                    { groupPath: 'Region', showHeader: false, fill: '#336699', border: { color: 'black', width: 0.5 } },
                ]
            }, '#' + id);            
        });
        afterAll(() => {
            treemap.destroy();
            document.getElementById(id).remove();
        });        
        it('Checking with itemMove cancel ', (done: Function) => {
            treemap.itemMove = (args: IItemMoveEventArgs)=> {
                if (count === 0) {
                    treemap.titleSettings.text = 'Item Move Event';
                    treemap.refresh();
                    count++;
                }               
            };
            treemap.loaded = (args: ILoadedEventArgs): void => {
                let layoutID: string = args.treemap.element.id + '_TreeMap_' + args.treemap.layoutType + '_Layout';
                let element: Element = document.getElementById(layoutID);
                let rectEle: Element;
                let eventObj: Object;
                for (let i: number = 0; i < element.childElementCount; i++) {
                    rectEle = element.childNodes[i] as Element;
                    eventObj = {
                        target: rectEle,
                         type: 'mousemove',
                        svg: document.getElementById('container_Title_Group')
                    };
                    treemap.treeMapTooltipModule.renderTooltip(<PointerEvent>eventObj);
                    svg = document.getElementById('container_Title_Group');
                    expect(svg.textContent).toBe("List of countries by population");                    
                }
                done();
            };
            treemap.tooltipSettings.visible = true;
            treemap.refresh();
        });
    });
    describe('TreeMap Mousmove Event spec', () => {
        let svg: Element;
        let treemap: TreeMap;
        let prevent: Function = (): void => { };
        let trigger: MouseEvents = new MouseEvents();
        let id: string = 'container';
        beforeAll(() => {
            svg = createElement('div', { id: id });
            (svg as HTMLDivElement).style.width = '600px';
            (svg as HTMLDivElement).style.height = '400px';
            document.body.appendChild(svg);
            treemap = new TreeMap({
                titleSettings: {
                    text: 'Car Sales by Country - 2017',
                    textStyle: { size: '15px' }
                },
                rangeColorValuePath: 'Sales',
                format: 'n',
                useGroupingSeparator: true,
                dataSource: CarSales,
                legendSettings: {
                    visible: true,
                    position: 'Top',
                    shape: 'Rectangle',
                },
                palette: ['#C33764', '#AB3566', '#993367', '#853169', '#742F6A', '#632D6C', '#532C6D', '#412A6F', '#312870', '#1D2671'],
                tooltipSettings: {
                    visible: true
                },
                weightValuePath: 'Sales',
                leafItemSettings: {
                    labelPath: 'Company',
                    border: { color: 'white', width: 0.5 }
                },
            }, '#' + id);            
        });
        afterAll(() => {
            treemap.destroy();
            document.getElementById(id).remove();
        });
        it('Checking with print', (done: Function): void => {
            treemap.loaded = (args: ILoadedEventArgs): void => {
                args.treemap.print();
            };
            treemap.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_TreeMap_Border');
                expect(svg.getAttribute('fill')).toBe("#FFFFFF");
                done();
            };
            treemap.refresh();
        });
        it('Checking with export', (done: Function): void => {
            treemap.loaded = (args: ILoadedEventArgs): void => {
                args.treemap.export('PDF','TreeMap',0,true);
            };
            treemap.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_TreeMap_Border');
                expect(svg.getAttribute('fill')).toBe("#FFFFFF");
                done();
            };
            treemap.refresh();
        });
        it('Checking with datalabel', (done: Function): void => {
            treemap.itemRendering = (args: IItemRenderingEventArgs): void => {
                args.treemap.leafItemSettings.showLabels = false;
            };
            treemap.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Level_Index_0_Item_Index_0_Group');
                expect(svg !== null).toBe(true);
                done();
            };
            treemap.refresh();
        });
        it('Checking with legend', (done: Function): void => {
            treemap.itemRendering = (args: IItemRenderingEventArgs): void => {
                args.treemap.legendSettings.mode ="Interactive";
            };
            treemap.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Legend_Group');
                expect(svg !== null).toBe(true);
                done();
            };
            treemap.refresh();
        });
        it('Checking with laoded event arg', (done: Function): void => {
              treemap.loaded = (args: ILoadedEventArgs): void => {
                args.isResized = false;
                svg = document.getElementById('container_Legend_Group');
                expect(svg !== null).toBe(true);
                done();
            };
            treemap.refresh();
        });
        it('Checking with laoded event', (done: Function): void => {
            treemap.loaded = (args: ILoadedEventArgs): void => {
              args.isResized = true;
              svg = document.getElementById('container_Legend_Group');
              expect(svg !== null).toBe(true);
              done();
          };
          treemap.refresh();
      });

        it('Customize the header labels using item rendering event', (done: Function): void => {
            debugger
            treemap.itemRendering = (args: IItemRenderingEventArgs): void => {
                if (args['currentItem']['groupIndex'] === 0) {
                    args.text = '${Continent}' + ' - ' + args['currentItem']['weight'];
                }
            };
            treemap.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Level_Index_0_Item_Index_0_Text');
                let text : string = svg.innerHTML;      
                expect(text === 'China - 4621170').toBe(true);
                done();
            };
            treemap.leafItemSettings.showLabels = true;
            treemap.refresh();
        });
        
        it('Customize the textColor using item rendering event', (done: Function): void => {
            treemap.itemRendering = (args: IItemRenderingEventArgs): void => {
                if (args['currentItem']['groupIndex'] === 0) {
                    args.textColor = 'green';
                }
            };
            treemap.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Level_Index_0_Item_Index_0_Text');
                let color: string = svg.getAttribute('fill');
                expect(color === 'green').toBe(true);
                done();
            };
            treemap.leafItemSettings.showLabels = true;
            treemap.refresh();
        });
    });
});
