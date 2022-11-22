
import { TreeMap } from '../../../src/treemap/treemap';
import { TreeMapLegend } from '../../../src/treemap/layout/legend';
import { ILoadedEventArgs } from '../../../src/treemap/model/interface';
import { TreeMapHighlight } from '../../../src/treemap/user-interaction/highlight-selection';
import { createElement, remove } from '@syncfusion/ej2-base';
import  {profile , inMB, getMemoryProfile} from '../common.spec';
import { jobData, sportsData, hierarchicalData, Country_Population, CarSales, Metals } from '../base/data.spec';
TreeMap.Inject(TreeMapLegend, TreeMapHighlight);

let jobDataSource: Object[] = jobData;
let gameDataSource: Object[] = sportsData;
let hierarchyData: Object[] = hierarchicalData;
let popuationData: Object[] = Country_Population;
/**
 * Tree map spec document
 */
describe('TreeMap Component Base Spec', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
    describe('TreeMap Default legend spec', () => {
        let element: Element;
        let treemap: TreeMap;
        let id: string = 'legend-container';
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
                highlightSettings: {
                    enable: false
                },
                selectionSettings: {
                    enable: false
                },
                legendSettings: {
                    visible: true,
                    title: {
                        text: 'Legend'
                    },
                    border: {
                        color: 'black',
                        width: 2
                    }
                },
                weightValuePath: 'EmployeesCount',
                rangeColorValuePath: 'EmployeesCount',
                leafItemSettings: {
                    labelPath: 'JobGroup',
                    colorMapping: [{
                        from: 10,
                        to: 20,
                        color: '#ff0000'
                    },
                    {
                        from: 20,
                        to: 30,
                        color: '#ff9900'
                    },
                    {
                        from: 30,
                        to: 40,
                        color: '#999966'
                    },
                    {
                        from: 40,
                        to: 50,
                        color: '#669900'
                    },
                    {
                        from: 50,
                        to: 60,
                        color: '#669900'
                    },
                    {
                        from: 60,
                        to: 70,
                        color: '#6600ff'
                    },
                    {
                        from: 70,
                        to: 80,
                        color: '#006680'
                    },
                    {
                        from: 80,
                        to: 90,
                        color: '#660066'
                    },
                    {
                        from: 90,
                        to: 100,
                        color: '#ff0066'
                    }
                    ]
                },
                levels: [
                    {
                        groupPath: 'Country', border: { color: 'black', width: 1 },
                        colorMapping: [{
                            from: 10,
                            to: 20,
                            color: '#ff0000'
                        },
                        {
                            from: 20,
                            to: 30,
                            color: '#ff9900'
                        },
                        {
                            from: 30,
                            to: 40,
                            color: '#999966'
                        },
                        {
                            from: 40,
                            to: 50,
                            color: '#669900'
                        },
                        {
                            from: 50,
                            to: 60,
                            color: '#669900'
                        },
                        {
                            from: 60,
                            to: 70,
                            color: '#6600ff'
                        },
                        {
                            from: 70,
                            to: 80,
                            color: '#006680'
                        },
                        {
                            from: 80,
                            to: 90,
                            color: '#660066'
                        },
                        {
                            from: 90,
                            to: 100,
                            color: '#ff0066'
                        }
                        ]
                    },
                    {
                        groupPath: 'JobDescription', border: { color: 'black', width: 1 },
                        colorMapping: [{
                            from: 10,
                            to: 20,
                            color: '#ff0000'
                        },
                        {
                            from: 20,
                            to: 30,
                            color: '#ff9900'
                        },
                        {
                            from: 30,
                            to: 40,
                            color: '#999966'
                        },
                        {
                            from: 40,
                            to: 50,
                            color: '#669900'
                        },
                        {
                            from: 50,
                            to: 60,
                            color: '#669900'
                        },
                        {
                            from: 60,
                            to: 70,
                            color: '#6600ff'
                        },
                        {
                            from: 70,
                            to: 80,
                            color: '#006680'
                        },
                        {
                            from: 80,
                            to: 90,
                            color: '#660066'
                        },
                        {
                            from: 90,
                            to: 100,
                            color: '#ff0066'
                        }
                        ]
                    }
                ]
            }, '#' + id);
        });
        afterAll(() => {
            treemap.destroy();
            document.getElementById(id).remove();
        });
        it('Checking with default legend without any customization', () => {
            treemap.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById('legend-container_Legend_Text_Index_0');
                expect(element.innerHTML).toBe('20 - 30');
            };
            treemap.refresh();
        });

        it('Checking with legend height and width ', () => {
            treemap.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById('legend-container_Legend_Text_Index_1');
                expect(element.innerHTML).toBe('30 - 40');
            };
            treemap.legendSettings.mode = 'Default';
            treemap.legendSettings.width = '200px';
            treemap.legendSettings.height = '50px';
            treemap.refresh();
        });

        it('Checking with legend orientation', () => {
            treemap.loaded = (args: ILoadedEventArgs) => {
                element = document.getElementById("legend-container_Legend_Group");
                let legendBounds: ClientRect = element.getBoundingClientRect();
                expect(legendBounds.left).toBeLessThan(args.treemap.areaRect.x + args.treemap.areaRect.width / 2);
            };
            treemap.legendSettings.alignment = 'Near';
            treemap.legendSettings.orientation = 'Vertical';
            treemap.refresh();
        });

        it('Checking with legend position - top ', () => {
            treemap.loaded = (args: ILoadedEventArgs) => {
                element = document.getElementById("legend-container_Legend_Group");
                let legendBounds: ClientRect = element.getBoundingClientRect();
                expect(legendBounds.top).toBeLessThan(args.treemap.areaRect.y + args.treemap.areaRect.height / 2);
            };
            treemap.legendSettings.position = 'Top';
            treemap.legendSettings.alignment = 'Near';
            treemap.refresh();
        });

        it('Checking with legend position - Left ', () => {
            treemap.loaded = (args: ILoadedEventArgs) => {
                element = document.getElementById('legend-container_Legend_Text_Index_0');
                expect(element.innerHTML).toBe('20 - 30');
                element = document.getElementById('legend-container_Legend_Text_Index_1');
                expect(element.innerHTML).toBe('30 - 40');
            };
            treemap.legendSettings.position = 'Left';
            treemap.legendSettings.alignment = 'Near';
            treemap.refresh();
        });

        it('Checking with legend position - Right ', () => {
            treemap.loaded = (args: ILoadedEventArgs) => {
                element = document.getElementById('legend-container_Legend_Shape_Index_0');
                expect(element.getAttribute('fill')).toBe('#ff9900');
                element = document.getElementById('legend-container_Legend_Shape_Index_1');
                expect(element.getAttribute('fill')).toBe('#999966');
            };
            treemap.legendSettings.position = 'Right';
            treemap.legendSettings.alignment = 'Far';
            treemap.refresh();
        });

        it('Checking with legend orientation as vertical', () => {
            treemap.loaded = (args: ILoadedEventArgs) => {
                element = document.getElementById('legend-container_Legend_Text_Index_2');
                expect(element.innerHTML).toBe('40 - 50');
                element = document.getElementById('legend-container_Legend_Shape_Index_2');
                expect(element.getAttribute('fill')).toBe('#669900');
            };
            treemap.legendSettings.orientation = 'Vertical';
            treemap.legendSettings.position = 'Left';
            treemap.legendSettings.height = '400px';
            treemap.legendSettings.width = '100px';
            treemap.refresh();
        });

        it('Checking with legend paging', () => {
            treemap.loaded = (args: ILoadedEventArgs) => {
                let element: Element = document.getElementById(treemap.element.id + '_Right_Page_Rect');
                let eventObj: Object = {
                    target: element,
                    pageX: element.getBoundingClientRect().left,
                    pageY: element.getBoundingClientRect().top
                };
                treemap.treeMapLegendModule.changeNextPage(<PointerEvent>eventObj);
                element = document.getElementById(treemap.element.id + '_Left_Page_Rect');
                eventObj = {
                    target: element,
                    pageX: element.getBoundingClientRect().left,
                    pageY: element.getBoundingClientRect().top
                };
                treemap.treeMapLegendModule.changeNextPage(<PointerEvent>eventObj);
                expect(document.getElementById('legend-container_Legend_Paging_Group').childElementCount).toBeGreaterThan(1);
            };
            treemap.legendSettings.position = 'Top';
            treemap.legendSettings.height = '50px';
            treemap.legendSettings.width = '200px';
            treemap.refresh();
        });
    });

    describe('TreeMap with multi colors spec', () => {
        let element: Element;
        let treemap: TreeMap;
        let id: string = 'default-container';
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
                highlightSettings: {
                    enable: false
                },
                selectionSettings: {
                    enable: false
                },
                legendSettings: {
                    visible: true,
                    title: {
                        text: 'Legend'
                    },
                    border: {
                        color: 'black',
                        width: 2
                    }
                },
                weightValuePath: 'EmployeesCount',
                rangeColorValuePath: 'EmployeesCount',
                leafItemSettings: {
                    labelPath: 'JobGroup',
                    colorMapping: [{
                        from: 10,
                        to: 35,                        
                        color: ['red','green','blue'],
                    },                                       
                    {
                        from: 70,
                        to: 80,
                        minOpacity:0.75,
                        maxOpacity:1,
                        color: ['#A52A2A','#FFFF00'],
                    },
                    {
                        from: 90,
                        to: 150,                        
                        color: ['#FFA500','#800080','Orange','#79443b','#dcb68a'],
                    },
                 ]
                },            
            }, '#' + id);
        });
        afterAll(() => {
            treemap.destroy();
            document.getElementById(id).remove();
        });
        

        it('Range color mappping testing spec with multi colors', () => {
            treemap.loaded = (args: ILoadedEventArgs) => {
                debugger
                element = document.getElementById(id + '_Level_Index_0_Item_Index_0_RectPath');                                                
                expect(element.getAttribute('fill')).toBe('#00525c');                 
                let element1  : Element = document.getElementById(id + '_Level_Index_0_Item_Index_2_RectPath');                
                expect(element1.getAttribute('fill')).toBe('#A52A2A');
                expect(element1.getAttribute('opacity')).toBe('0.75');                               
            };                    
        });

    });

    describe('TreeMap Interactive legend with multi colors spec', () => {
        let element: Element;
        let treemap: TreeMap;
        let id: string = 'interactive-container';
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
                highlightSettings: {
                    enable: false
                },
                selectionSettings: {
                    enable: false
                },
                legendSettings: {
                    visible: true,
                    title: {
                        text: 'Legend'
                    },
                    border: {
                        color: 'black',
                        width: 2
                    }
                },
                weightValuePath: 'EmployeesCount',
                rangeColorValuePath: 'EmployeesCount',
                leafItemSettings: {
                    labelPath: 'JobGroup',
                    colorMapping: [{
                        from: 10,
                        to: 35,
                        color: ['red','green'],
                    },                   
                    {
                        from: 70,
                        to: 80,
                        color: ['#A52A2A','#FFFF00','blue','#3d2b1f'],
                    },
                    {
                        from: 90,
                        to: 150,
                        color: ['#FFA500','#800080','Orange','#79443b','#dcb68a'],
                    },
                 ]
                },            
            }, '#' + id);
        });
        afterAll(() => {
            treemap.destroy();
            document.getElementById(id).remove();
        });
                		
        it('Checking with interactive legend with multi colors ', () => {
            treemap.loaded = (args: ILoadedEventArgs) => {
                element = document.getElementById('interactive-container_Legend_Index_0');
                expect(element.getAttribute('fill')).toBe('url(#linear_2)');                
            };
            treemap.legendSettings.mode = 'Interactive';
            treemap.refresh();
        });
    
    });

    describe('TreeMap legend with outofrange spec', () => {
        let element: Element;
        let treemap: TreeMap;
        let id: string = 'interactive-container';
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
                highlightSettings: {
                    enable: false
                },
                selectionSettings: {
                    enable: false
                },
                legendSettings: {
                    visible: true,
                    title: {
                        text: 'Legend'
                    },
                    border: {
                        color: 'black',
                        width: 2
                    }
                },
                weightValuePath: 'EmployeesCount',
                rangeColorValuePath: 'EmployeesCount',
                leafItemSettings: {
                    labelPath: 'JobGroup',
                    colorMapping: [{
                        from: 10,
                        to: 20,
                        color: ['red','green'],
                    },
                    {
                        from: 20,
                        to: 30,
                        color: '#ff9900',
                    },
                    {
                        from: 30,
                        to: 40,
                        color: ['pink','white','aqua'],
                    },
                    {
                        from: 40,
                        to: 50,
                        color: ['#A52A2A','#FFFF00','#9f8170','#3d2b1f'],
                    },
                    {
                        from: 50,
                        to: 60,
                        color: ['#FFA500','#800080','#DE5D83','#79443b','#dcb68a'],
                    },
                    {
                        color:'skyblue',
                    }
                 ]
                },            
            }, '#' + id);
        });
        afterAll(() => {
            treemap.destroy();
            document.getElementById(id).remove();
        });

        it('Checking the legend with outofrange ', () => {
            treemap.loaded = (args: ILoadedEventArgs) => {
                element = document.getElementById('interactive-container_Legend_Index_0');
                expect(element.getAttribute('fill')).toBe('url(#linear_2)');                
            };
            treemap.legendSettings.mode = 'Interactive';
            treemap.refresh();
        });        

    });

    describe('TreeMap Interactive legend spec', () => {
        let element: Element;
        let treemap: TreeMap;
        let id: string = 'interactive-container';
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
                highlightSettings: {
                    enable: false
                },
                selectionSettings: {
                    enable: false
                },
                legendSettings: {
                    visible: true,
                    title: {
                        text: 'Legend'
                    },
                    border: {
                        color: 'black',
                        width: 2
                    }
                },
                weightValuePath: 'EmployeesCount',
                rangeColorValuePath: 'EmployeesCount',
                leafItemSettings: {
                    labelPath: 'JobGroup',
                    colorMapping: [{
                        from: 10,
                        to: 20,
                        color: '#ff0000',
                        minOpacity: 0.1,
                        maxOpacity: 0.2
                    },
                    {
                        from: 20,
                        to: 30,
                        color: '#ff9900',
                        minOpacity: 0.2,
                        maxOpacity: 0.3
                    },
                    {
                        from: 30,
                        to: 40,
                        color: '#999966',
                        minOpacity: 0.3,
                        maxOpacity: 0.4
                    },
                    {
                        from: 40,
                        to: 50,
                        color: '#669900',
                        minOpacity: 0.4,
                        maxOpacity: 0.5
                    },
                    {
                        from: 50,
                        to: 60,
                        color: '#669900',
                        minOpacity: 0.5,
                        maxOpacity: 0.6
                    },
                    {
                        from: 60,
                        to: 70,
                        color: '#6600ff',
                        minOpacity: 0.6,
                        maxOpacity: 0.7
                    },
                    {
                        from: 70,
                        to: 80,
                        color: '#006680',
                        minOpacity: 0.7,
                        maxOpacity: 0.8
                    },
                    {
                        from: 80,
                        to: 90,
                        color: '#660066',
                        minOpacity: 0.8,
                        maxOpacity: 0.9
                    },
                    {
                        from: 90,
                        to: 100,
                        color: '#ff0066',
                        minOpacity: 0.9,
                        maxOpacity: 1
                    }]
                },
                levels: [
                    {
                        groupPath: 'Country', border: { color: 'black', width: 1 },
                        colorMapping: [{
                            from: 10,
                            to: 20,
                            color: '#ff0000'
                        },
                        {
                            from: 20,
                            to: 30,
                            color: '#ff9900'
                        },
                        {
                            from: 30,
                            to: 40,
                            color: '#999966'
                        },
                        {
                            from: 40,
                            to: 50,
                            color: '#669900'
                        },
                        {
                            from: 50,
                            to: 60,
                            color: '#669900'
                        },
                        {
                            from: 60,
                            to: 70,
                            color: '#6600ff'
                        },
                        {
                            from: 70,
                            to: 80,
                            color: '#006680'
                        },
                        {
                            from: 80,
                            to: 90,
                            color: '#660066'
                        },
                        {
                            from: 90,
                            to: 100,
                            color: '#ff0066'
                        }
                        ]
                    },
                    {
                        groupPath: 'JobDescription', border: { color: 'black', width: 1 },
                        colorMapping: [{
                            from: 10,
                            to: 20,
                            color: '#ff0000'
                        },
                        {
                            from: 20,
                            to: 30,
                            color: '#ff9900'
                        },
                        {
                            from: 30,
                            to: 40,
                            color: '#999966'
                        },
                        {
                            from: 40,
                            to: 50,
                            color: '#669900'
                        },
                        {
                            from: 50,
                            to: 60,
                            color: '#669900'
                        },
                        {
                            from: 60,
                            to: 70,
                            color: '#6600ff'
                        },
                        {
                            from: 70,
                            to: 80,
                            color: '#006680'
                        },
                        {
                            from: 80,
                            to: 90,
                            color: '#660066'
                        },
                        {
                            from: 90,
                            to: 100,
                            color: '#ff0066'
                        }
                        ]
                    }
                ]
            }, '#' + id);
        });
        afterAll(() => {
            treemap.destroy();
            document.getElementById(id).remove();
        });

        it('Checking with interactive legend without any customization', () => {
            treemap.loaded = (args: ILoadedEventArgs) => {
                element = document.getElementById('interactive-container_Legend_Index_0');
                expect(element.getAttribute('fill')).toBe('#ff9900');
                element = document.getElementById('interactive-container_Legend_Index_0_Text');
                expect(element.innerHTML).toBe('20 - 30');
            };
            treemap.legendSettings.mode = 'Interactive';
            treemap.refresh();
        });

        it('Checking with legend height and width ', () => {
            treemap.loaded = (args: ILoadedEventArgs) => {
                element = document.getElementById('interactive-container_Legend_Index_2');
                expect(element.getAttribute('fill')).toBe('#669900');
                element = document.getElementById('interactive-container_Legend_Index_2_Text');
                expect(element.innerHTML).toBe('40 - 50');
            };
            treemap.legendSettings.height = '30px';
            treemap.legendSettings.width = '200px';
            treemap.refresh();
        });

        it('Checking with legend orientation ', () => {
            treemap.loaded = (args: ILoadedEventArgs) => {
                element = document.getElementById('interactive-container_Legend_Index_5');
                expect(element.getAttribute('fill')).toBe('#006680');
                element = document.getElementById('interactive-container_Legend_Index_5_Text');
                expect(element.innerHTML).toBe('70 - 80');
            };
            treemap.legendSettings.orientation = 'Vertical';
            treemap.refresh();
        });

        it('Checking with label placement', () => {
            treemap.loaded = (args: ILoadedEventArgs) => {
                element = document.getElementById('interactive-container_Legend_Index_1_Text');
                let textBounds: ClientRect = element.getBoundingClientRect();
                element = document.getElementById('interactive-container_Legend_Index_0');
                let rect: ClientRect = element.getBoundingClientRect();
                expect(textBounds.left).toBeGreaterThan(rect.left + rect.width);
            };
            treemap.legendSettings.labelPosition = 'Before';
            treemap.refresh();
        });

        it('Checking with label InterSectAction ', () => {
            treemap.loaded = (args: ILoadedEventArgs) => {
                element = document.getElementById('interactive-container_Legend_Index_1_Text');
                expect(element.innerHTML).toBe(' ');
            };
            treemap.legendSettings.labelDisplayMode = 'Trim';
            treemap.refresh();
        });

        it('Checking with interactive cursor', () => {
            treemap.loaded = (args: ILoadedEventArgs) => {
                // put the spec here //
                let element: Element = document.getElementById(args.treemap.element.id + '_Level_Index_0_Item_Index_0_Group');
                let eventObj: Object = {
                    target: element,
                    type: 'mousemove',
                    changedTouches: [{ clientX: element.getBoundingClientRect().left, clientY: element.getBoundingClientRect().top }]
                };
                treemap.treeMapLegendModule.renderInteractivePointer(<PointerEvent>eventObj);
                let legendElement = document.getElementById('interactive-container_Interactive_Legend');
                expect(legendElement != null).toBe(true);
                element = document.getElementById(args.treemap.element.id + '_TreeMap_title');
                eventObj = {
                    target: element,
                    type: 'mousemove',
                    pageX: element.getBoundingClientRect().left,
                    pageY: element.getBoundingClientRect().top
                };
                treemap.treeMapLegendModule.renderInteractivePointer(<PointerEvent>eventObj);
                expect(document.getElementById('interactive-container_Interactive_Legend') == null).toBe(true);
            };
            treemap.refresh();
        });

        it('Checking with interactive cursor - Horizontal orientation ', () => {
            treemap.loaded = (args: ILoadedEventArgs) => {
                // put the spec here //
                let element: Element = document.getElementById(args.treemap.element.id + '_Level_Index_0_Item_Index_0_Group');
                let eventObj: Object = {
                    target: element,
                    type: 'mousemove',
                    pageX: element.getBoundingClientRect().left,
                    pageY: element.getBoundingClientRect().top
                };
                treemap.treeMapLegendModule.renderInteractivePointer(<PointerEvent>eventObj);
                expect(document.getElementById('interactive-container_Interactive_Legend') !== null).toBe(true);
                treemap.treeMapLegendModule.mouseUpHandler(<PointerEvent>eventObj);
            };
            treemap.legendSettings.orientation = 'Horizontal';
            treemap.legendSettings.invertedPointer = false;
            treemap.refresh();
        });

        it('Checking with interactive cursor - inverter pointer ', () => {
            treemap.loaded = (args: ILoadedEventArgs) => {
                // put the spec here //
                let element: Element = document.getElementById(args.treemap.element.id + '_Level_Index_0_Item_Index_0_Group');
                let eventObj: Object = {
                    target: element,
                    type: 'mousemove',
                    pageX: element.getBoundingClientRect().left,
                    pageY: element.getBoundingClientRect().top
                };
                treemap.treeMapLegendModule.renderInteractivePointer(<PointerEvent>eventObj);
                expect(document.getElementById('interactive-container_Interactive_Legend') !== null).toBe(true);
            };
            treemap.legendSettings.invertedPointer = true;
            treemap.refresh();
        });

        it('Checking with interactive cursor - orientation', () => {
            treemap.loaded = (args: ILoadedEventArgs) => {
                // put the spec here //
                let element: Element = document.getElementById(args.treemap.element.id + '_Level_Index_0_Item_Index_0_Group');
                let eventObj: Object = {
                    target: element,
                    type: 'mousemove',
                    pageX: element.getBoundingClientRect().left,
                    pageY: element.getBoundingClientRect().top
                };
                treemap.treeMapLegendModule.renderInteractivePointer(<PointerEvent>eventObj);
                expect(document.getElementById('interactive-container_Interactive_Legend') !== null).toBe(true);
            };
            treemap.legendSettings.orientation = 'None';
            treemap.legendSettings.position = 'Left';
            treemap.legendSettings.invertedPointer = true;
            treemap.refresh();
        });
    });

    describe('TreeMap legend customization spec', () => {
        let element: Element;
        let treemap: TreeMap;
        let id: string = 'interactive-container';
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
                highlightSettings: {
                    enable: false
                },
                selectionSettings: {
                    enable: false
                },
                legendSettings: {
                    visible: true,
                    title: {
                        text: 'Legend'
                    },
                    border: {
                        color: 'black',
                        width: 2
                    }
                },
                weightValuePath: 'EmployeesCount',
                rangeColorValuePath: 'EmployeesCount',
                leafItemSettings: {
                    labelPath: 'JobGroup',
                    colorMapping: [{
                        from: 10,
                        to: 20,
                        color: '#ff0000'
                    },
                    {
                        from: 20,
                        to: 30,
                        color: '#ff9900'
                    },
                    {
                        from: 30,
                        to: 40,
                        color: '#999966'
                    },
                    {
                        from: 40,
                        to: 50,
                        color: '#669900'
                    },
                    {
                        from: 50,
                        to: 60,
                        color: '#669900'
                    },
                    {
                        from: 60,
                        to: 70,
                        color: '#6600ff'
                    },
                    {
                        from: 70,
                        to: 80,
                        color: '#006680'
                    },
                    {
                        from: 80,
                        to: 90,
                        color: '#660066'
                    },
                    {
                        from: 90,
                        to: 100,
                        color: '#ff0066'
                    }
                    ]
                },
                levels: [
                    {
                        groupPath: 'Country', border: { color: 'black', width: 1 },
                        colorMapping: [{
                            from: 10,
                            to: 20,
                            color: '#ff0000'
                        },
                        {
                            from: 20,
                            to: 30,
                            color: '#ff9900'
                        },
                        {
                            from: 30,
                            to: 40,
                            color: '#999966'
                        },
                        {
                            from: 40,
                            to: 50,
                            color: '#669900'
                        },
                        {
                            from: 50,
                            to: 60,
                            color: '#669900'
                        },
                        {
                            from: 60,
                            to: 70,
                            color: '#6600ff'
                        },
                        {
                            from: 70,
                            to: 80,
                            color: '#006680'
                        },
                        {
                            from: 80,
                            to: 90,
                            color: '#660066'
                        },
                        {
                            from: 90,
                            to: 100,
                            color: '#ff0066'
                        }
                        ]
                    },
                    {
                        groupPath: 'JobDescription', border: { color: 'black', width: 1 },
                        colorMapping: [{
                            from: 10,
                            to: 20,
                            color: '#ff0000'
                        },
                        {
                            from: 20,
                            to: 30,
                            color: '#ff9900'
                        },
                        {
                            from: 30,
                            to: 40,
                            color: '#999966'
                        },
                        {
                            from: 40,
                            to: 50,
                            color: '#669900'
                        },
                        {
                            from: 50,
                            to: 60,
                            color: '#669900'
                        },
                        {
                            from: 60,
                            to: 70,
                            color: '#6600ff'
                        },
                        {
                            from: 70,
                            to: 80,
                            color: '#006680'
                        },
                        {
                            from: 80,
                            to: 90,
                            color: '#660066'
                        },
                        {
                            from: 90,
                            to: 100,
                            color: '#ff0066'
                        }
                        ]
                    }
                ]
            }, '#' + id);
        });
        afterAll(() => {
            treemap.destroy();
            document.getElementById(id).remove();
        });

        it('Checking with legend shape - circle ', () => {
            treemap.loaded = (args: ILoadedEventArgs) => {
                element = document.getElementById('interactive-container_Legend_Shape_Index_0');
                expect(element.tagName).toBe('ellipse');
            };
            treemap.legendSettings.shape = 'Circle';
            treemap.refresh();
        });

        it('Checking with legend shape - Star ', () => {
            treemap.loaded = (args: ILoadedEventArgs) => {
                element = document.getElementById('interactive-container_Legend_Shape_Index_0');
                expect(element.getAttribute('fill')).toBe('#ff9900');
            };
            treemap.legendSettings.shape = 'Star';
            treemap.refresh();
        });

        it('Checking with legend shape - Cross ', () => {
            treemap.loaded = (args: ILoadedEventArgs) => {
                element = document.getElementById('interactive-container_Legend_Shape_Index_2');
                expect(element.getAttribute('fill')).toBe('#669900');
            };
            treemap.legendSettings.shape = 'Cross';
            treemap.refresh();
        });

        it('Checking with legend shape - HorizontalLine ', () => {
            treemap.loaded = (args: ILoadedEventArgs) => {
                element = document.getElementById('interactive-container_Legend_Shape_Index_0');
                expect(element.innerHTML).toBe('');
            };
            treemap.legendSettings.shape = 'HorizontalLine';
            treemap.refresh();
        });

        it('Checking with legend shape - VerticalLine ', () => {
            treemap.loaded = (args: ILoadedEventArgs) => {
                element = document.getElementById('interactive-container_Legend_Shape_Index_4');
                expect(element.getAttribute('fill')).toBe('#6600ff');
            };
            treemap.legendSettings.shape = 'VerticalLine';
            treemap.refresh();
        });

        it('Checking with legend shape - Diamond ', () => {
            treemap.loaded = (args: ILoadedEventArgs) => {
                element = document.getElementById('interactive-container_Legend_Shape_Index_3');
                expect(element.getAttribute('fill')).toBe('#669900');
            };
            treemap.legendSettings.shape = 'Diamond';
            treemap.refresh();
        });

        it('Checking with legend shape - Rectangle ', () => {
            treemap.loaded = (args: ILoadedEventArgs) => {
                element = document.getElementById('interactive-container_Legend_Shape_Index_5');
                expect(element.getAttribute('fill')).toBe('#006680');
            };
            treemap.legendSettings.shape = 'Rectangle';
            treemap.refresh();
        });


        it('Checking with legend shape - Triangle ', () => {
            treemap.loaded = (args: ILoadedEventArgs) => {
                element = document.getElementById('interactive-container_Legend_Shape_Index_6');
                expect(element.getAttribute('fill')).toBe('#ff0066');
            };
            treemap.legendSettings.shape = 'Triangle';
            treemap.refresh();
        });

        it('Checking with legend shape - InvertedTriangle ', () => {
            treemap.loaded = (args: ILoadedEventArgs) => {
                element = document.getElementById('interactive-container_Legend_Shape_Index_1');
                expect(element.getAttribute('fill')).toBe('#999966');
            };
            treemap.legendSettings.shape = 'InvertedTriangle';
            treemap.refresh();
        });

        it('Checking with legend shape - Pentagon ', () => {
            treemap.loaded = (args: ILoadedEventArgs) => {
                element = document.getElementById('interactive-container_Legend_Shape_Index_2');
                expect(element.getAttribute('fill')).toBe('#669900');
            };
            treemap.legendSettings.shape = 'Pentagon';
            treemap.refresh();
        });

        it('Checking with legend shape - Image ', () => {
            treemap.loaded = (args: ILoadedEventArgs) => {
                element = document.getElementById('interactive-container_Legend_Shape_Index_0');
                expect(element.tagName).toBe('image');
            };
            treemap.legendSettings.shape = 'Image';
            treemap.legendSettings.imageUrl = 'http://js.syncfusion.com/demos/web/Images/map/pin.png';
            treemap.refresh();
        });
    });


    describe('TreeMap legend testing spec', () => {
        let element: Element;
        let treemap: TreeMap;
        let id: string = 'container';
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
                dataSource: [
                    {
                        Continent: 'North America', Value: 30, CarSales: 'BMW'
                    },
                    {
                        Continent: 'Asia', Value: 50, CarSales: 'Hyundai '
                    },
                    {
                        Continent: 'South America', Value: 50, CarSales: 'Ford'
                    },
                    {
                        Continent: 'Africa', Value: 50, CarSales: 'Ford'
                    },
                    {
                        Continent: 'Europe', Value: 50, CarSales: 'BMW'
                    },
                    {
                        Continent: 'Europe', Value: 50, CarSales: 'Hyundai'
                    }
                ],
                equalColorValuePath: 'CarSales',
                weightValuePath: 'Value',
                leafItemSettings: {
                    labelPath: 'Continent',
                    colorMapping: [
                        {
                            value: 'BMW',
                            color: 'red'
                        },
                        {
                            value: 'Hyundai',
                            color: 'green'
                        },
                        {
                            value: 'Ford',
                            color: 'orange'
                        }
                    ]
                },
                legendSettings: {
                    visible: true
                }
            }, '#' + id);
        });
        afterAll(() => {
            treemap.destroy();
            document.getElementById(id).remove();
        });

        it('Checking with legend compared to equal color mapping  ', () => {
            treemap.loaded = (args: ILoadedEventArgs) => {
                element = document.getElementById('container_Legend_Shape_Index_0');
                expect(element.getAttribute('fill')).toBe('red');
                element = document.getElementById('container_Legend_Text_Index_0');
                expect(element.innerHTML).toBe('BMW');
            };
            treemap.legendSettings.height = '20%';
            treemap.legendSettings.width = '30%';
            treemap.refresh();
        });

        it('Checking with shape size as greater than text', () => {
            treemap.loaded = (args: ILoadedEventArgs) => {
                element = document.getElementById('container_Legend_Text_Index_0');
                expect(element.getAttribute('font-size')).toBe('8px');
            };
            treemap.legendSettings.shapeHeight = 50;
            treemap.legendSettings.shapeWidth = 50;
            treemap.legendSettings.textStyle.size = '8px';
            treemap.refresh();
        });

        it('Checking with text size as greater than shape', () => {
            treemap.loaded = (args: ILoadedEventArgs) => {
                element = document.getElementById('container_Legend_Text_Index_0');
                expect(element.getAttribute('font-size')).toBe('30px');
            };
            treemap.legendSettings.shapeHeight = 10;
            treemap.legendSettings.shapeWidth = 10;
            treemap.legendSettings.textStyle.size = '30px';
            treemap.refresh();
        });
    });

    describe('TreeMap legend testing spec', () => {
        let element: Element;
        let treemap: TreeMap;
        let id: string = 'legend_Palette_container';
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
                layoutType: 'SliceAndDiceHorizontal',
                dataSource: [{
                    name: 'China is one of the most population country',
                    value: 5000
                },
                {
                    name: 'India is second most population country',
                    value: 2500
                },
                {
                    name: 'America is one of the least population country',
                    value: 5000
                },
                {
                    name: 'Japans is second most least country',
                    value: 2500
                }
                ],
                weightValuePath: 'value',
                legendSettings: {
                    visible: true,
                    title: {
                        text: 'Legend'
                    },
                    border: {
                        color: 'black',
                        width: 2
                    }
                },
                tooltipSettings: {
                    visible: true
                },
                leafItemSettings: {
                    showLabels: true,
                    labelPath: 'name',
                    interSectAction: 'WrapByWord',
                    fill: '#006699',
                    border: {
                        color: 'black',
                        width: 2
                    },
                }
            }, '#' + id);
        });
        afterAll(() => {
            treemap.destroy();
            document.getElementById(id).remove();
        });

        it('Checking with palette legend ', () => {
            treemap.loaded = (args: ILoadedEventArgs) => {
                expect(document.getElementById('legend_Palette_container_Legend_Group').childElementCount).toBeGreaterThan(1);
            };
            treemap.palette = ['#f44336', '#29b6f6', '#ab47bc', '#ffc107', '#5c6bc0', '#009688'];
            treemap.refresh();
        });
    });
    describe('TreeMap Default legend spec', () => {
        let element: Element;
        let treemap: TreeMap;
        let id: string = 'container';
        beforeAll(() => {
            element = createElement('div', { id: id });
            (element as HTMLDivElement).style.width = '600px';
            (element as HTMLDivElement).style.height = '400px';
            document.body.appendChild(element);
            treemap = new TreeMap({
                titleSettings: {
                    text: 'Car Sales by Country - 2017',
                    textStyle: { size: '15px' }
                },
                format: 'n',
                useGroupingSeparator: true,
                dataSource: CarSales,
                colorValuePath: 'color',
                legendSettings: {
                    visible: true,
                    position: 'Top',
                    shape: 'Rectangle',
                },
                tooltipSettings: {
                    visible: true
                },
                weightValuePath: 'Sales',
                leafItemSettings: {
                    labelPath: 'Company',
                    border: { color: 'white', width: 0.5 }
                },
                levels: [
                    {
                        groupPath: 'Continent', border: { color: 'white', width: 0.5 },
                    }
                ]
            }, '#' + id);
        });
        afterAll(() => {
            treemap.destroy();
            document.getElementById(id).remove();
        });
        it('Checking color mapping from datasource', () => {
            treemap.loaded = (args: ILoadedEventArgs) => {
                element = document.getElementById('container_Level_Index_0_Item_Index_0_RectPath');
                expect(element.getAttribute('fill')).toBe('#5F9EA0');
            };
            treemap.refresh();
        });
    });
    describe('TreeMap Legend customization spec', () => {
        let element: Element;
        let treemap: TreeMap;
        let id: string = 'container';
        beforeAll(() => {
            element = createElement('div', { id: id });
            (element as HTMLDivElement).style.width = '600px';
            (element as HTMLDivElement).style.height = '400px';
            document.body.appendChild(element);
            treemap = new TreeMap({
                // To config Title for treemap 
                titleSettings: {
                    text: 'US Gold medal categories in Summer Olympics - 2016',
                    textStyle: {size: '15px'}
                },
                legendSettings: {
                    visible: true,
                    position: 'Top',
                    shape: 'Rectangle',
                    valuePath: 'valuePath',
                    removeDuplicateLegend: true,
                    showLegendPath: 'legendVisibility'
                },
                //enableDrillDown: true,
                dataSource: Metals,
                weightValuePath: 'Gold',
                colorValuePath: 'fill',
                // To config tooltip for treemap 
                tooltipSettings: {
                    visible: true,
                    format: '${Sport} : ${Gold}'
                },
                // To config leaf items for treemap
                leafItemSettings: {
                    labelPath: 'Sport',
                    fill: '#993399',
                    templatePosition: 'Center',
                    border: { color: 'black', width: 0.5 },
                    labelFormat: ' ${Sport} - ${Gold}'
                }
            }, '#' + id);
        });
        afterAll(() => {
            treemap.destroy();
            document.getElementById(id).remove();
        });
        it('Checking color mapping from datasource', () => {
            treemap.loaded = (args: ILoadedEventArgs) => {
                element = document.getElementById("container_Legend_Group");
                expect(element.childNodes.length).toBe(7);
            };
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
    describe('TreeMap Default legend spec with RTL', () => {
        let element: Element; let elementShape : Element;
        let treemap: TreeMap;
        let id: string = 'container';
        beforeAll(() => {
            element = createElement('div', { id: id });
            elementShape = createElement('div', { id: id });
            (element as HTMLDivElement).style.width = '600px';
            (element as HTMLDivElement).style.height = '400px';
            document.body.appendChild(element);
            treemap = new TreeMap({
                titleSettings: {
                    text: 'Car Sales by Country - 2017',
                    textStyle: { size: '15px' }
                },
                format: 'n',
                useGroupingSeparator: true,
                dataSource: CarSales,
                enableRtl:true,
                colorValuePath: 'color',
                legendSettings: {
                    visible: true,
                    position: 'Left',
                    shape: 'Rectangle',
                },
                tooltipSettings: {
                    visible: true
                },
                weightValuePath: 'Sales',
                leafItemSettings: {
                    labelPath: 'Company',
                    border: { color: 'white', width: 0.5 }
                },
                levels: [
                    {
                        groupPath: 'Continent', border: { color: 'white', width: 0.5 },
                    }
                ]
            }, '#' + id);
        });
        afterAll(() => {
            treemap.destroy();
            document.getElementById(id).remove();
        });
        it('Checking default legend with RTL position as left', () => {            
            treemap.loaded = (args: ILoadedEventArgs) => {                
                elementShape = document.getElementById('container_Legend_Shape_Index_3');
                expect(elementShape.getAttribute('aria-label')).toBe('India');
                expect(elementShape.getAttribute('fill')).toBe('#483D8B');                
            };
            treemap.refresh();
        });
    });
    describe('TreeMap Interactive legend spec with RTL', () => {
        let element: Element; let elementShape : Element;
        let treemap: TreeMap;
        let id: string = 'container';
        beforeAll(() => {            
            element = createElement('div', { id: id });
            elementShape = createElement('div', { id: id });
            (element as HTMLDivElement).style.width = '600px';
            (element as HTMLDivElement).style.height = '400px';
            document.body.appendChild(element);
            treemap = new TreeMap({
                titleSettings: {
                    text: 'Car Sales by Country - 2017',
                    textStyle: { size: '15px' }
                },
                format: 'n',
                useGroupingSeparator: true,
                dataSource: CarSales,
                enableRtl:true,
                colorValuePath: 'color',
                legendSettings: {
                    visible: true,
                    position: 'Top',                    
                    mode:'Interactive'
                },
                tooltipSettings: {
                    visible: true
                },
                highlightSettings:{
                    enable:true
                },
                weightValuePath: 'Sales',
                leafItemSettings: {
                    labelPath: 'Company',
                    border: { color: 'white', width: 0.5 }
                },
                levels: [
                    {
                        groupPath: 'Continent', border: { color: 'white', width: 0.5 },
                    }
                ]
            }, '#' + id);
        });
        afterAll(() => {
            treemap.destroy();
            document.getElementById(id).remove();
        });
        it('Checking Interactive legend with RTL', () => {
            treemap.loaded = (args: ILoadedEventArgs) => {
                element = document.getElementById('container_Legend_Index_3');
                expect(element.getAttribute('x')).toBe('406');
                expect(element.getAttribute('y')).toBe('10');
                expect(element.getAttribute('width')).toBe('58');
                expect(element.getAttribute('height')).toBe('25');                
                
            };
            treemap.refresh();
        });
        it('Checking Mouse Leave on Interactive legend', () => {
            treemap.loaded = (args: ILoadedEventArgs) => {
                debugger
                let rectEle: Element = document.getElementById(args.treemap.element.id + '_Level_Index_1_Item_Index_14_RectPath');               
                let eventObj: Object = {
                    target: rectEle,
                    type: 'mousemove',
                    pageX: rectEle.getBoundingClientRect().left,
                    pageY: (rectEle.getBoundingClientRect().top + 10)
                };
               treemap.mouseLeaveOnTreeMap(<PointerEvent>eventObj);                               
            };
            //treemap.highlightSettings.enable = true;
            treemap.refresh();
        });        
    });
    describe('TreeMap Interactive legend RTL support in colormapping', () => {
        let element: Element;
        let treemap: TreeMap;
        let id: string = 'interactive-container';
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
                enableRtl:true,                
                highlightSettings: {
                    enable: false
                },
                selectionSettings: {
                    enable: false
                },
                legendSettings: {
                    visible: true,
                    mode:'Interactive',
                    title: {
                        text: 'Legend'
                    },
                    border: {
                        color: 'black',
                        width: 2
                    }
                },
                weightValuePath: 'EmployeesCount',
                rangeColorValuePath: 'EmployeesCount',
                leafItemSettings: {
                    labelPath: 'JobGroup',
                    colorMapping: [{
                        from: 10,
                        to: 35,
                        color: ['red','green'],
                    },                   
                    {
                        from: 70,
                        to: 80,
                        color: ['#A52A2A','#FFFF00','blue','#3d2b1f'],
                    },
                    {
                        from: 90,
                        to: 150,
                        color: ['#FFA500','#800080','Orange','#79443b','#dcb68a'],
                    },
                 ]
                },            
            }, '#' + id);
        });
        afterAll(() => {
            treemap.destroy();
            document.getElementById(id).remove();
        });
                		
        it('Checking interactive legend with RTL in colormapping ', () => {            
            treemap.loaded = (args: ILoadedEventArgs) => {
                element = document.getElementById('interactive-container_Legend_Index_0');
                expect(element.getAttribute('fill')).toBe('url(#linear_2)');                
            };            
            treemap.refresh();
        });
        it('Checking Interactive legend with RTL with left position', () => {
            treemap.loaded = (args: ILoadedEventArgs) => {
                element = document.getElementById('interactive-container_Legend_Index_0');
                expect(element.getAttribute('fill')).toBe('url(#linear_2)');                    
                
            };
            treemap.legendSettings.position='Left';
            treemap.refresh();
        });
        it('Checking Interactive legend with RTL with right position', () => {
            treemap.loaded = (args: ILoadedEventArgs) => {
                element = document.getElementById('interactive-container_Legend_Index_0');
                expect(element.getAttribute('fill')).toBe('url(#linear_2)');                    
                
            };
            treemap.legendSettings.position='Right';
            treemap.refresh();
        });
    
    });
    describe('TreeMap Legend Responsive spec', () => {
        let element: Element; let elementShape : Element;
        let treemap: TreeMap;
        let id: string = 'container';
        beforeAll(() => {
            element = createElement('div', { id: id });
            elementShape = createElement('div', { id: id });
            (element as HTMLDivElement).style.width = '600px';
            (element as HTMLDivElement).style.height = '400px';
            document.body.appendChild(element);
            treemap = new TreeMap({
                titleSettings: {
                    text: 'Car Sales by Country - 2017',
                    textStyle: { size: '15px' }
                },
                format: 'n',
                useGroupingSeparator: true,
                dataSource: CarSales,
                enableRtl:true,
                colorValuePath: 'color',
                legendSettings: {
                    visible: true,
                    position: 'Auto',
                    shape: 'Rectangle',
                },
                tooltipSettings: {
                    visible: true
                },
                weightValuePath: 'Sales',
                leafItemSettings: {
                    labelPath: 'Company',
                    border: { color: 'white', width: 0.5 }
                },
                levels: [
                    {
                        groupPath: 'Continent', border: { color: 'white', width: 0.5 },
                    }
                ]
            }, '#' + id);
        });
        afterAll(() => {
            treemap.destroy();
            document.getElementById(id).remove();
        });
        it('Checking Legend Responsive support with legend position as auto with greater width', () => {            
            treemap.loaded = (args: ILoadedEventArgs) => {                
                elementShape = document.getElementById('container_Legend_Shape_Index_3');               
                expect(elementShape.getAttribute('aria-label')).toBe('India');
                expect(elementShape.getAttribute('fill')).toBe('#483D8B');  
                
            };
            treemap.width = '700';
            treemap.height = '600';
            treemap.refresh();
        });
        it('Checking Legend Responsive support with legend position as auto with greater height', () => {            
            treemap.loaded = (args: ILoadedEventArgs) => {                
                elementShape = document.getElementById('container_Legend_Shape_Index_3');               
                expect(elementShape.getAttribute('aria-label')).toBe('India');
                expect(elementShape.getAttribute('fill')).toBe('#483D8B');  
                
            };
            treemap.width = '500';
            treemap.height = '600';
            treemap.refresh();
        });
    });
});