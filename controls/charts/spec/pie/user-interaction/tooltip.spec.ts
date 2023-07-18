/**
 * AccumulationChart tooltip Series Spec file
 */
import { createElement, remove } from '@syncfusion/ej2-base';
import { EmitType } from '@syncfusion/ej2-base';
import { PieSeries,  } from '../../../src/accumulation-chart/renderer/pie-series';
import { PyramidSeries,  } from '../../../src/accumulation-chart/renderer/pyramid-series';
import { FunnelSeries,  } from '../../../src/accumulation-chart/renderer/funnel-series';
import { AccumulationChart,  } from '../../../src/accumulation-chart/accumulation';
import { AccumulationLegend } from '../../../src/accumulation-chart/renderer/legend';
import { AccPoints } from '../../../src/accumulation-chart/model/acc-base';
import { getElement, ChartLocation } from '../../../src/common/utils/helper';
import { AccumulationDataLabel } from '../../../src/accumulation-chart/renderer/dataLabel';
import { AccumulationTooltip } from '../../../src/accumulation-chart/user-interaction/tooltip';
import { AccumulationSelection } from '../../../src/accumulation-chart/user-interaction/selection';
import { piedata} from '../../chart/base/data.spec';
import { MouseEvents } from '../../chart/base/events.spec';
import { getPosition, addTooltipStyles } from '../base/util.spec';
import { IAccLoadedEventArgs, } from '../../../src/accumulation-chart/model/pie-interface';
import { ITooltipRenderEventArgs, IPointEventArgs } from '../../../src/chart/model/chart-interface';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { profile, inMB, getMemoryProfile } from '../../common.spec';
AccumulationChart.Inject(PieSeries, PyramidSeries, AccumulationSelection, FunnelSeries,  AccumulationLegend, AccumulationDataLabel, AccumulationTooltip);

describe('Accumulation Chart Control', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
describe('Tooltip checking for the pie series', () => {
    let ele: HTMLElement;
    let loaded: EmitType<IAccLoadedEventArgs>;
    let id: string = 'ej2container';
    let tooltipid: string = id + '_3_content';
    let sliceid: string = id + '_Series_0' + '_Point_';
    let x: number;
    let y: number;
    let i: number = 0;
    let length: number;
    let accumulation: AccumulationChart; let points: AccPoints[];
    let trigger: MouseEvents = new MouseEvents();
    let segement: Element;
    let tooltip: Element;
    let position: ChartLocation;
    let legendId: string = id + '_chart_legend_text_';
    let pointEvent: EmitType<IPointEventArgs>;

    beforeAll((): void => {
        ele = createElement('div', { id: id });
        document.body.appendChild(ele);
        let template: Element = createElement('div', { id: 'template', styles: 'display: none;' });
        document.body.appendChild(template);
        template.innerHTML = '<div>${x}</div><div>${y}</div>';
        addTooltipStyles();
        accumulation = new AccumulationChart({
            series: [
                {   name: 'Animals',
                    type: 'Pie',
                    dataLabel: { visible: false, name: 'data' },
                    dataSource: piedata, animation: { enable: false }, xName: 'name', yName: 'y'
                }
            ], width: '600', height: '400', legendSettings: { visible: false},
            tooltip: {
                 enable: false,
                 enableAnimation: false
            },
            title :'Pie',
            titleStyle : {textAlignment :'Near'},
            
        });
        accumulation.appendTo('#' + id);
    });
    afterAll((): void => {   
       
        accumulation.destroy();        
        ele.remove();
       
    });
    it('Control visibility false checking', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            segement = getElement(sliceid + 0);
            trigger.mousemoveEvent(segement, 0, 0, 200, 200);
            let tooltip: HTMLElement = document.getElementById('ej2container_tooltip');
            expect(tooltip == null).toBe(true);
            trigger.mouseleavetEvent(ele, 1000, 1000);
            done();
        };  
        accumulation.tooltip.enable = false;
        accumulation.titleStyle.textAlignment = 'Far';
        accumulation.refresh();
    });
    it('Pie Series tooltip visibility false checking', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            segement = getElement(sliceid + 0);
            trigger.mousemoveEvent(segement, 0, 0, 200, 200);
            let tooltip: HTMLElement = document.getElementById('ej2container_tooltip');
            expect(tooltip == null).toBe(true);            
            done();
        };  
        accumulation.tooltip.enable = true;
        accumulation.title = '';
        accumulation.series[0].enableTooltip = false;
        accumulation.refresh();
    });
    it('Point mouse move and click', (done: Function) => {
        loaded = (args: Object): void => {
            segement = getElement(sliceid + 3);            
            trigger.mousemoveEvent(segement, 0, 0, 200, 200);
            trigger.clickEvent(segement);              
            done();
        };
        pointEvent = (args: IPointEventArgs) : void => {
            expect(args.pointIndex == 3).toBe(true);
            expect(args.seriesIndex == 0).toBe(true);
            done();
        }
        accumulation.loaded = loaded;
        accumulation.pointClick = pointEvent;
        accumulation.pointMove = pointEvent;
        accumulation.refresh();
    });
    it('Pie tooltip visibility true checking', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            segement = getElement(sliceid + 0);
            trigger.mousemoveEvent(segement, 0, 0, 200, 200);
            let tooltip: HTMLElement = document.getElementById('ej2container_tooltip');
            expect(tooltip != null).toBe(true);

            let group: HTMLElement = tooltip.childNodes[0].childNodes[0] as HTMLElement;
            let path: HTMLElement = group.childNodes[0] as HTMLElement;
            let text1: HTMLElement = group.childNodes[1] as HTMLElement;
            let text2: HTMLElement = group.childNodes[2] as HTMLElement;
            expect(path.localName == 'path').toBe(true);
            expect(path.getAttribute('d') != '' || ' ').toBe(true);
            expect(group.childNodes.length == 4).toBe(true);
            expect(text1.childNodes.length == 5).toBe(true);
            expect(text1.textContent.replace('\u200E', '') == 'AnimalsBald Eagle : 18').toBe(true);
            // expect(text1.childNodes[1].textContent == 'Bald Eagle ').toBe(true);
            // expect(text1.childNodes[2].textContent == '').toBe(true);
            // expect((<HTMLElement>group.childNodes[2]).getAttribute('d') != '' || ' ').toBe(true);
            segement = getElement(sliceid + 2);
            trigger.mousemoveEvent(segement, 0, 0, 200, 200);
             tooltip = document.getElementById('ej2container_tooltip');
             expect(tooltip === null).toBe(true);
             trigger.mousemoveEvent(ele, 0, 0, 100, 100);
            done();
        };
        accumulation.tooltip.enable = true;
        accumulation.pointClick = null;
        accumulation.pointMove = null;
        accumulation.series[0].enableTooltip = true;
        accumulation.tooltipRender = (args : ITooltipRenderEventArgs) => {
            if (args.point.index == 2) {
                args.cancel = true;
            }

        },
        accumulation.refresh();
    });
    it('Pie tooltip visibility true checking', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            segement = getElement(sliceid + 0);
            trigger.mousemoveEvent(segement, 0, 0, 200, 200);
            let tooltip: HTMLElement = document.getElementById('ej2container_tooltip');
            expect(tooltip != null).toBe(true);
            segement = getElement('ej2container_chart_legend_text_1');
            trigger.mousemoveEvent(segement, 0, 0, 200, 200);            
            done();
        };
        accumulation.tooltip.format = 'Large Tooltip <br/> To Test the <br/> Format <br/> ${point.x} <br/>';
        accumulation.legendSettings.visible = true;
        accumulation.refresh();
    });
    it('Pyramid tooltip', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            segement = getElement(sliceid + 3);
            trigger.mousemoveEvent(segement, 0, 0, 400, 100);
            let tooltip: HTMLElement = document.getElementById('ej2container_tooltip');
            expect(tooltip != null).toBe(true);

            let group: HTMLElement = tooltip.childNodes[0].childNodes[0] as HTMLElement;
            let path: HTMLElement = group.childNodes[0] as HTMLElement;
            let text1: HTMLElement = group.childNodes[1] as HTMLElement;
            let text2: HTMLElement = group.childNodes[2] as HTMLElement;

            expect(path.localName == 'path').toBe(true);
            expect(path.getAttribute('d') != '' || ' ').toBe(true);
            expect(group.childNodes.length == 4).toBe(true);
            expect(text1.childNodes.length == 6).toBe(true);
            expect(text1.textContent.replace(/\u200E/g, '') == 'AnimalsAnimals : Elk : 44').toBe(true);
            //expect(text1.childNodes[1].textContent == 'Animals : Elk : 44').toBe(true);          
            expect((<HTMLElement>group.childNodes[2]).getAttribute('d') != '' || ' ').toBe(true);
            done();
        };
        accumulation.series[0].type = 'Pyramid';
        accumulation.tooltip.format = '${series.name} : ${point.x} : ${point.y}';
        accumulation.tooltipRender = null;
    });
    it('Funnel tooltip', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            segement = getElement(sliceid + 2);
            trigger.mousemoveEvent(segement, 0, 0, 400, 100);
            let tooltip: HTMLElement = document.getElementById('ej2container_tooltip');
            expect(tooltip != null).toBe(true);

            let group: HTMLElement = tooltip.childNodes[0].childNodes[0] as HTMLElement;
            let path: HTMLElement = group.childNodes[0] as HTMLElement;
            let text1: HTMLElement = group.childNodes[1] as HTMLElement;
            let text2: HTMLElement = group.childNodes[2] as HTMLElement;
            expect(path.localName == 'path').toBe(true);
            expect(path.getAttribute('d') != '' || ' ').toBe(true);
            expect(group.childNodes.length == 3).toBe(true);
            expect(text1.childNodes.length == 5).toBe(true);
            expect(text1.textContent.replace(/\u200E/g, '') == 'Animals : Brown Bear : 30').toBe(true);
            expect((<HTMLElement>group.childNodes[2]).getAttribute('d') != '' || ' ').toBe(true);

            trigger.mousemoveEvent(ele, 0, 0, 30, 30);
            done();
        };
        accumulation.series[0].type = 'Funnel';
        accumulation.tooltip.header = '';
        accumulation.tooltipRender = null;
        accumulation.refresh();
    });
    it('Funnel tooltip with tooltip mapping Name', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            segement = getElement(sliceid + 2);
            trigger.mousemoveEvent(segement, 0, 0, 400, 100);
            let tooltip: HTMLElement = document.getElementById('ej2container_tooltip');
            expect(tooltip != null).toBe(true);
            let group: HTMLElement = tooltip.childNodes[0].childNodes[0] as HTMLElement;
            let text1: HTMLElement = group.childNodes[1] as HTMLElement;
            expect(text1.textContent == '30').toBe(true);
            done();
        };
        accumulation.series[0].type = 'Funnel';
        accumulation.tooltip.header = '';
        accumulation.tooltip.format = '${point.tooltip}';
        accumulation.series[0].tooltipMappingName = 'y';
        accumulation.refresh();
    });
    it('Funnel tooltip without tooltip text', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            segement = getElement(sliceid + 2);
            trigger.mousemoveEvent(segement, 0, 0, 400, 100);
            let tooltip: HTMLElement = document.getElementById('ej2container_tooltip');
            expect(tooltip != null).toBe(true);
            let group: HTMLElement = tooltip.childNodes[0].childNodes[0] as HTMLElement;
            let text1: HTMLElement = group.childNodes[1] as HTMLElement;
            expect(text1.textContent == 'undefined').toBe(true);
            done();
        };
        accumulation.series[0].type = 'Funnel';
        accumulation.tooltip.header = '';
        accumulation.tooltip.format = '${point.tooltip}';
        accumulation.series[0].tooltipMappingName = 'tooltip';
        accumulation.refresh();
    });
    it('With template', (done: Function) => {
        let tooltip: HTMLElement;
        remove(document.getElementById('ej2container_tooltip'));
        accumulation.loaded = (args: Object): void => {
            segement = getElement(sliceid + 2);
            trigger.mousemoveEvent(segement, 0, 0, 400, 100);
           
            trigger.mousemovetEvent(segement,200, 200);
            tooltip = document.getElementById('ej2container_tooltip');
            expect(tooltip != null).toBe(true);
            //done();
            
            trigger.mouseleavetEvent(ele, 1000, 1000);
          
            done();
        };
        accumulation.tooltip.template = '<div>${x}</div><div>${y}</div>';
        accumulation.refresh();
    });
    it('Touch event', (done: Function) => {
        let tooltip: HTMLElement;
        remove(document.getElementById('ej2container_tooltip'));
        accumulation.loaded = (args: Object): void => {
            segement = getElement(sliceid + 2);
            trigger.mousemoveEvent(segement, 0, 0, 400, 100);
            accumulation.isTouch = true;
            accumulation.accumulationMouseEnd(<PointerEvent>trigger.onTouchEnd(ele, 0, 0, 200, 200,  200, 200));
            trigger.mouseupEvent(segement, 100, 100, 150, 150);
            tooltip = document.getElementById('ej2container_tooltip');
            expect(tooltip != null).toBe(true);
        
            done();
        };
        accumulation.series[0].type = 'Pie';
    
        accumulation.series[0].innerRadius = '20%';
        accumulation.refresh();
    });
    it('Checking tooltip when grouping separator is true', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            segement = getElement(sliceid + 0);
            trigger.mousemoveEvent(segement, 0, 0, 200, 200);
            let tooltip: HTMLElement = document.getElementById('ej2container_tooltip');
            expect(tooltip !== null).toBe(true);
            let group: HTMLElement = tooltip.childNodes[0].childNodes[0] as HTMLElement;
            let text1: HTMLElement = group.childNodes[1] as HTMLElement;
            expect(text1.textContent == '18,000').toBe(true);
            done();
        };
        accumulation.series[0].dataSource = [{ x: 'Labour', y: 18000 }, { x: 'Legal', y: 8000, text: 'feb: 10000' },
        { x: 'Production', y: 15000 }, { x: 'License', y: 11000, text: '70000' },
        { x: 'Facilities', y: 18000 }, { x: 'Taxes', y: 14000 },
        { x: 'Insurance', y: 16000 }];
        accumulation.tooltip.template = null;
        accumulation.tooltip.format = '${point.label}';
        accumulation.useGroupingSeparator = true;
        accumulation.series[0].dataLabel.visible = true;
        accumulation.refresh();
    });
});
describe('Checking tooltip text with useGroupSeparator is true', () => {
    let ele: HTMLElement;
    let id: string = 'container';
    let sliceid: string = id + '_Series_0' + '_Point_';
    let accumulation: AccumulationChart; let points: AccPoints[];
    let trigger: MouseEvents = new MouseEvents();
    let segement: Element;

    beforeAll((): void => {
        ele = createElement('div', { id: id });
        document.body.appendChild(ele);
        accumulation = new AccumulationChart({
            useGroupingSeparator: true,
            series: [
                {
                    dataSource: [
                        { x: 'Cases', y: 177507, text: '37%' }, { x: 'Layers', y: 137507, text: '17%' },
                        { x: 'Palletes', y: 1377507, text: '19%' }
                    ],
                    dataLabel: {
                        visible: true, position: 'Inside', name: 'x', font: { fontWeight: '600' }
                    },
                    radius: '70%', xName: 'x', yName: 'y', startAngle: 0, endAngle: 360, innerRadius: '0%',
                    explode: true, explodeOffset: '10%', explodeIndex: 0, name: 'Browser', animation: { enable: false }
                }
            ],
            center: { x: '50%', y: '50%' },
            enableSmartLabels: true,
            enableAnimation: false,
            legendSettings: { visible: false },
            // Initialize tht tooltip
            tooltip: { enable: true, header: '' },
            title: 'Mobile Browser Statistics',
            width: '400px', height: '400px'

        });
        accumulation.appendTo('#' + id);
    });
    afterAll((): void => {
        accumulation.destroy();
        ele.remove();
    });
    it('Checking point value with group separator', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            segement = getElement(sliceid + 2);
            trigger.mousemoveEvent(segement, 0, 0, 200, 250);
            let tooltip: HTMLElement = document.getElementById('container_tooltip_text');
            expect(tooltip.children[0].innerHTML).toEqual("Palletes ");
            expect(tooltip.children[3].innerHTML).toEqual("1,377,507");
            done();
        };
        accumulation.refresh();
    });
    it('Checking point value with selection', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            segement = getElement(sliceid + 2);
            trigger.mousemoveEvent(segement, 0, 0, 200, 250);
            let element = document.getElementById('container_Series_0_Point_2');
            trigger.clickEvent(element);
            expect(+element.getAttribute('opacity') === 1).toBe(true);
            done();
        };
        accumulation.selectionMode = 'Point';
        accumulation.refresh();
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
})
});