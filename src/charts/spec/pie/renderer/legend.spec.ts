/**
 * AccumulationChart legend Series Spec file
 */
import { createElement } from '@syncfusion/ej2-base';
import { EmitType } from '@syncfusion/ej2-base';
import { PieSeries } from '../../../src/accumulation-chart/renderer/pie-series';
import { AccumulationChart } from '../../../src/accumulation-chart/accumulation';
import { AccumulationLegend } from '../../../src/accumulation-chart/renderer/legend';
import { removeElement, getElement } from '../../../src/common/utils/helper';
import { AccumulationDataLabel } from '../../../src/accumulation-chart/renderer/dataLabel';
import { piedata } from '../../chart/base/data.spec';
import { MouseEvents } from '../../chart/base/events.spec';
import { IAccLoadedEventArgs, IAccLegendClickEventArgs } from '../../../src/accumulation-chart/model/pie-interface';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { profile, inMB, getMemoryProfile } from '../../common.spec';
AccumulationChart.Inject(PieSeries, AccumulationLegend, AccumulationDataLabel);
let pointData: Object[] = [];
export function generateData(count: number): Object[] {
    let currentPoint: Object;
    let value: number;
    for (let i: number = 0; i < count; i++) {
        value = Math.round(Math.random() * 100);
        currentPoint = { x: i, y: value + 1, text: 'Point_' + i };
        pointData.push(currentPoint);
    }
    return pointData;
}

describe('Accumulation Chart Control', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
describe('Legend checking for the pie series', () => {
    let ele: HTMLElement;
    let loaded: EmitType<IAccLoadedEventArgs>;
    let id: string = 'ej2-container';
    let legendEle: Element;
    let legendId: string = id + '_chart_legend';
    let accumulation: AccumulationChart;
    let trigger: MouseEvents = new MouseEvents();
    beforeAll((): void => {
        ele = createElement('div', { id: id, });
        document.body.appendChild(ele);
        accumulation = new AccumulationChart({
            border: { width: 1, color: 'blue' },
            series: [
                {
                    type: 'Pie',
                    dataLabel: { visible: false, name: 'text' },
                    dataSource: piedata, animation: { enable: false }, xName: 'x', yName: 'y'
                }
            ], width: '600', height: '400', legendSettings: { visible: false }
        });
        accumulation.appendTo('#' + id);
    });

    afterAll((): void => {
        accumulation.accumulationLegendModule.destroy();
        accumulation.destroy();
        accumulation.loaded = null;
        removeElement(id);
    });
    it('Pie Legend visibility false checking', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            legendEle = getElement(legendId + '_g');
            expect(legendEle).toBe(null);
            done();
        };
        accumulation.refresh();
    });
    it('Pie Legend visibility visible checking', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            legendEle = getElement(legendId + '_translate_g');
            expect(legendEle.childNodes.length).toBe(10);
            expect(legendEle.childNodes.length).toBe(accumulation.visibleSeries[0].points.length);
            done();
        };
        accumulation.legendSettings.visible = true;
        accumulation.refresh();
    });
    it('Pie Legend auto position chekcing width is greater than height', () => {
        legendEle = getElement(legendId + '_element');
        expect(legendEle.getAttribute('x') == '484.75' || legendEle.getAttribute('x') == '485.5').toBe(true);
        expect(legendEle.getAttribute('width') == '48' || legendEle.getAttribute('width') == '47').toBe(true);
        expect(legendEle.getAttribute('y') === '71' || legendEle.getAttribute('y') === '76').toBe(true);
        expect(legendEle.getAttribute('height') === '258' || legendEle.getAttribute('height') === '248').toBe(true);
    });
    it('Pie Legend auto position chekcing while width is less than height', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            legendEle = getElement(legendId + '_element');
            expect(legendEle.getAttribute('x') == '22').toBe(true);

            expect(legendEle.getAttribute('y') === '475.75' || legendEle.getAttribute('y') === '478.75').toBe(true);

            expect(legendEle.getAttribute('height') === '60' || legendEle.getAttribute('height') === '56').toBe(true);

            expect(legendEle.getAttribute('width') == '356').toBe(true);
            done();
        };
        accumulation.height = '600';
        accumulation.width = '400';
        accumulation.refresh();
    });
    it('Pie Legend left position chekcing', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            legendEle = getElement(legendId + '_element');
            expect(legendEle.getAttribute('x') == '67.25' || legendEle.getAttribute('x') == '67.5').toBe(true);

            expect(legendEle.getAttribute('y') === '71' || legendEle.getAttribute('y') === '76').toBe(true);
            expect(legendEle.getAttribute('height') === '258' || legendEle.getAttribute('height') === '248').toBe(true);
            expect(legendEle.getAttribute('width') == '48' || legendEle.getAttribute('width') == '47').toBe(true);
            done();
        };
        accumulation.legendSettings.position = 'Left';
        accumulation.height = '400';
        accumulation.width = '600';
        accumulation.refresh();
    });
    it('Pie Legend Top position chekcing', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            legendEle = getElement(legendId + '_element');
            expect(legendEle.getAttribute('x') == '73.5' || legendEle.getAttribute('x') == '74').toBe(true);

            expect(legendEle.getAttribute('y') === '27.80000000000001' || legendEle.getAttribute('y') === '27.849999999999994').toBe(true);

            expect(legendEle.getAttribute('height') === '33' || legendEle.getAttribute('height') === '32').toBe(true);

            expect(legendEle.getAttribute('width') == '453' || legendEle.getAttribute('width') == '452').toBe(true);
            done();
        };
        accumulation.legendSettings.position = 'Top';
        accumulation.refresh();
    });
    it('Pie Legend Bottom position chekcing', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            legendEle = getElement(legendId + '_element');
            expect(legendEle.getAttribute('x') == '73.5' || legendEle.getAttribute('x') == '74').toBe(true);

            expect(legendEle.getAttribute('y') === '339.20000000000005' || legendEle.getAttribute('y') === '340.15').toBe(true);

            expect(legendEle.getAttribute('height') === '33' || legendEle.getAttribute('height') === '32').toBe(true);

            expect(legendEle.getAttribute('width') == '453' || legendEle.getAttribute('width') == '452').toBe(true);
            done();
        };
        accumulation.legendSettings.position = 'Bottom';
        accumulation.refresh();
    });
    it('Pie Legend Right position chekcing', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            legendEle = getElement(legendId + '_element');
            expect(legendEle.getAttribute('x') == '484.75' || legendEle.getAttribute('x') == '485.5').toBe(true);

            expect(legendEle.getAttribute('y') === '71' || legendEle.getAttribute('y') === '76').toBe(true);

            expect(legendEle.getAttribute('height') === '258' || legendEle.getAttribute('height') === '248').toBe(true);

            expect(legendEle.getAttribute('width') == '48' || legendEle.getAttribute('width') == '47').toBe(true);
            done();
        };
        accumulation.legendSettings.position = 'Right';
        accumulation.refresh();
    });
    it('Pie Legend Right position chekcing with fixed legend size', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            legendEle = getElement(legendId + '_element');
            expect(legendEle).not.toBe(null);
            done();
        };
        accumulation.legendSettings.height = '100';
        accumulation.legendSettings.width = '90';
        accumulation.refresh();
    });
    it('Pie Legend Left position chekcing with fixed legend size', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            legendEle = getElement(legendId + '_element');
            expect(legendEle.getAttribute('x')).toBe('56.75');
            expect(legendEle.getAttribute('y')).toBe('150');
            expect(legendEle.getAttribute('height')).toBe('100');
            expect(legendEle.getAttribute('width')).toBe('90');
            done();
        };
        accumulation.legendSettings.position = 'Left';
        accumulation.refresh();
    });
    it('Pie Legend Top position chekcing with fixed legend size', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            legendEle = getElement(legendId + '_element');
            expect(legendEle.getAttribute('x')).toBe('255');
            let y: number = parseInt(legendEle.getAttribute('y'), 10);
            expect(y).toBe(24);
            expect(legendEle.getAttribute('height')).toBe('100');
            expect(legendEle.getAttribute('width')).toBe('90');
            done();
        };
        accumulation.legendSettings.position = 'Top';
        accumulation.refresh();
    });
    it('Pie Legend Bottom position chekcing with fixed legend size', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            legendEle = getElement(legendId + '_element');
            expect(legendEle).not.toBe(null);
            done();
        };
        accumulation.legendSettings.position = 'Bottom';
        accumulation.refresh();
    });
    it('Smart Legend placing datalabel Inside, legend position right, exploding length greater than chart width', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            legendEle = getElement(legendId + '_element');
            expect(legendEle.getAttribute('x') == '515.1500000000001' || legendEle.getAttribute('x') == '515.9000000000001').toBe(true);

            expect(legendEle.getAttribute('y') === '71' || legendEle.getAttribute('y') === '76').toBe(true);

            expect(legendEle.getAttribute('height') === '258' || legendEle.getAttribute('height') === '248').toBe(true);

            expect(legendEle.getAttribute('width') == '48' || legendEle.getAttribute('width') == '47').toBe(true);
            done();
        };
        accumulation.visibleSeries[0].explode = true;
        accumulation.visibleSeries[0].explodeOffset = '40%';
        accumulation.legendSettings.position = 'Right';
        accumulation.legendSettings.height = null;
        accumulation.legendSettings.width = null;
        accumulation.refresh();
    });
    it('Smart Legend placing datalabel Inside, legend position right, exploding length less than chart width', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            legendEle = getElement(legendId + '_element');
            expect(legendEle.getAttribute('x') == '665.15' || legendEle.getAttribute('x') == '665.9' || legendEle.getAttribute('x') == '642.65').toBe(true);
           
            expect(legendEle.getAttribute('y') === '71' || legendEle.getAttribute('y') === '76').toBe(true);
           
            expect(legendEle.getAttribute('height') === '258' || legendEle.getAttribute('height') === '248').toBe(true);
           
            expect(legendEle.getAttribute('width') == '48' || legendEle.getAttribute('width') == '47').toBe(true);
        
            done();
        };
        accumulation.width = '800';
        accumulation.refresh();
    });
    it('Smart Legend placing datalabel Inside, legend position left, exploding length less than chart width', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            legendEle = getElement(legendId + '_element');
            expect(legendEle.getAttribute('x') == '86.85' || legendEle.getAttribute('x') == '87.1' || legendEle.getAttribute('x') == '79.35').toBe(true);
       
            expect(legendEle.getAttribute('y') === '71' || legendEle.getAttribute('y') === '76').toBe(true);
        
            expect(legendEle.getAttribute('height') === '258' || legendEle.getAttribute('height') === '248').toBe(true);
          
            expect(legendEle.getAttribute('width') == '48' || legendEle.getAttribute('width') == '47').toBe(true);
          
            done();
        };
        accumulation.legendSettings.position = 'Left';
        accumulation.refresh();
    });
    it('Smart Legend placing datalabel Inside, legend position left, exploding length greater than chart width', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            legendEle = getElement(legendId + '_element');
            expect(legendEle.getAttribute('x') == '36.85' || legendEle.getAttribute('x') == '37.1').toBe(true);

            expect(legendEle.getAttribute('y') === '71' || legendEle.getAttribute('y') === '76').toBe(true);

            expect(legendEle.getAttribute('height') === '258' || legendEle.getAttribute('height') === '248').toBe(true);

            expect(legendEle.getAttribute('width') == '48' || legendEle.getAttribute('width') == '47').toBe(true);
            done();
        };
        accumulation.width = '600';
        accumulation.refresh();
    });
    it('Smart Legend placing datalabel Inside, legend position top, exploding length greater than chart height', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            legendEle = getElement(legendId + '_element');
            expect(legendEle.getAttribute('x') == '22').toBe(true);
            expect(legendEle.getAttribute('y') === '11' || legendEle.getAttribute('y') === '11').toBe(true);
            expect(legendEle.getAttribute('height') === '60' || legendEle.getAttribute('height') === '56').toBe(true);
            expect(legendEle.getAttribute('width') == '356').toBe(true);

            done();
        };
        accumulation.legendSettings.position = 'Top';
        accumulation.width = '400';
        accumulation.refresh();
    });
    it('Smart Legend placing datalabel Inside, legend position top, exploding length less than chart height', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            legendEle = getElement(legendId + '_element');
            expect(legendEle).not.toBe(null);
            done();
        };
        accumulation.height = '600';
        accumulation.refresh();
    });
    it('Smart Legend placing datalabel Inside, legend position bottom, exploding length less than chart height', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            legendEle = getElement(legendId + '_element');
            expect(legendEle).not.toBe(null);
            done();
        };
        accumulation.legendSettings.position = 'Bottom';
        accumulation.refresh();
    });
    it('Smart Legend placing datalabel Inside, legend position bottom, exploding length greater than chart height', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            legendEle = getElement(legendId + '_element');
            expect(legendEle).not.toBe(null);
            done();
        };
        accumulation.height = '400';
        accumulation.refresh();
    });
    it('Pie Legend paging feature checking for position right with default height, width', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            legendEle = getElement(legendId + '_translate_g');
            legendEle = getElement(legendId + '_pagedown');
            trigger.clickEvent(legendEle);
            legendEle = getElement(legendId + '_pagenumber');
            expect(legendEle.textContent).toBe('2/4');
            legendEle = getElement(legendId + '_element_clipPath_rect');
            expect(legendEle.getAttribute('x') == '318' || legendEle.getAttribute('x') == '302').toBe(true);

            expect(legendEle.getAttribute('y')).toBe('10');
            expect(legendEle.getAttribute('width') == '80' || legendEle.getAttribute('width') == '78').toBe(true);

            expect(legendEle.getAttribute('height') === '360' || legendEle.getAttribute('height') === '350').toBe(true);
            done();
        };
        accumulation.legendSettings.height = null;
        accumulation.legendSettings.width = null;
        accumulation.legendSettings.position = 'Right';
        accumulation.series[0].dataSource = generateData(100);
        accumulation.refresh();
    });
    it('Pie Legend paging feature checking for position bottom with default height, width', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            legendEle = getElement(legendId + '_translate_g');
            expect(legendEle.childNodes.length).toBe(100);
            expect(legendEle.childNodes.length).toBe(accumulation.visibleSeries[0].points.length);
            legendEle = getElement(legendId + '_pagedown');
            trigger.clickEvent(legendEle);
            legendEle = getElement(legendId + '_pagenumber');
            expect(legendEle.textContent).toBe('3/5');
            legendEle = getElement(legendId + '_pageup');
            trigger.clickEvent(legendEle);
            legendEle = getElement(legendId + '_pagenumber');
            expect(legendEle.textContent).toBe('2/5');
            done();
        };
        accumulation.legendSettings.position = 'Bottom';
        accumulation.dataBind();
    });
    it('Pie Legend point click visible and hidden checking', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            accumulation.loaded = null;
            expect(accumulation.visibleSeries[0].points[4].visible).toBe(true);
            legendEle = getElement(legendId + '_shape_4');
            expect(legendEle.getAttribute('fill')).toBe('#f8b883');
            legendEle = getElement(legendId + '_text_4');
            expect(legendEle.getAttribute('fill')).not.toBe('#D3D3D3');
            trigger.clickEvent(legendEle);
            legendEle = getElement(legendId + '_text_4');
            expect(legendEle.getAttribute('fill')).toBe('#D3D3D3');
            legendEle = getElement(legendId + '_shape_4');
            expect(legendEle.getAttribute('fill')).toBe('#D3D3D3');
            expect(accumulation.visibleSeries[0].points[4].visible).toBe(false);
            trigger.clickEvent(legendEle);
            expect(accumulation.visibleSeries[0].points[4].visible).toBe(true);
            legendEle = getElement(legendId + '_shape_4');
            expect(legendEle.getAttribute('fill')).toBe('#f8b883');
            legendEle = getElement(legendId + '_text_4');
            expect(legendEle.getAttribute('fill')).not.toBe('#D3D3D3');
            done();
        };
        accumulation.series[0].dataSource = piedata;
        accumulation.refresh();
    });
    it('Doughnut Single point Legend', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            accumulation.loaded = null;
            legendEle = getElement(legendId + '_shape_0');
            expect(legendEle.getAttribute('fill')).toBe('#00bdae');
            expect(accumulation.visibleSeries[0].points.length).toBe(1);
            expect(accumulation.visibleSeries[0].points[0].visible).toBe(true);
            legendEle = getElement(legendId + '_g_0');
            expect(legendEle.childNodes.length).toBe(3);
            expect((<HTMLElement>legendEle.childNodes[0]).getAttribute('fill')).toBe('#00bdae');
            expect((<HTMLElement>legendEle.childNodes[1]).getAttribute('fill')).toBe('#FFFFFF');
            expect((<HTMLElement>legendEle.childNodes[2]).textContent.indexOf('...') > -1 ||
                (<HTMLElement>legendEle.childNodes[2]).textContent === 'Single Point').toBe(true);
            done();
        };
        accumulation.series[0].dataSource = [{ x: 'Single Point', text: 'Single point text', y: 10 }];
        accumulation.series[0].innerRadius = '40%';
        accumulation.legendSettings.position = 'Right';
        accumulation.refresh();
    });
    it('Pie Single point Legend', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            accumulation.loaded = null;
            legendEle = getElement(legendId + '_shape_0');
            expect(legendEle.getAttribute('fill')).toBe('#00bdae');
            expect(accumulation.visibleSeries[0].points.length).toBe(1);
            expect(accumulation.visibleSeries[0].points[0].visible).toBe(true);
            legendEle = getElement(legendId + '_g_0');
            expect(legendEle.childNodes.length).toBe(2);
            expect((<HTMLElement>legendEle.childNodes[0]).getAttribute('fill')).toBe('#00bdae');
            expect((<HTMLElement>legendEle.childNodes[1]).textContent).toBe('Single Point');
            done();
        };
        accumulation.series[0].innerRadius = '0%';
        accumulation.height = '400';
        accumulation.width = '600';
        accumulation.refresh();
    });
    it('Legend long text trimming feature checking', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            accumulation.loaded = null;
            legendEle = getElement(legendId + '_shape_0');
            expect(legendEle.getAttribute('fill')).toBe('#00bdae');
            expect(accumulation.visibleSeries[0].points.length).toBe(1);
            expect(accumulation.visibleSeries[0].points[0].visible).toBe(true);
            legendEle = getElement(legendId + '_g_0');
            expect(legendEle.childNodes.length).toBe(2);
            expect((<HTMLElement>legendEle.childNodes[0]).getAttribute('fill')).toBe('#00bdae');
            expect((<HTMLElement>legendEle.childNodes[1]).textContent.indexOf('...') > -1).toBe(true);
            legendEle = getElement(legendId + '_text_0');
            trigger.mousemoveEvent(legendEle, 0, 0, 460, 210);
            legendEle = getElement('ej2-container_EJ2_Legend_Tooltip');
            expect(legendEle.textContent).toBe('Single Point legend long text trimming feature checking');
            legendEle = getElement(id);
            trigger.mousemoveEvent(legendEle, 0, 0, 100, 20);
            legendEle = getElement('ej2-container_EJ2_Legend_Tooltip');
            // expect(legendEle).toBe(null);
            removeElement('ej2-container_EJ2_Legend_Tooltip');
            done();
        };
        accumulation.series[0].dataSource = [
            { x: 'Single Point legend long text trimming feature checking', text: 'Single point text', y: 10 }];
        accumulation.refresh();
    });
});
    describe('Legend title checking with pie chart', () => {
        let chartContainer: HTMLElement;
        let titleElement: Element;
        let legendGroup: Element;
        let xValue: string; let yValue: string;
        let loaded: EmitType<IAccLoadedEventArgs>;
        let legendEle: Element;
        let pieObj: AccumulationChart;
        let trigger: MouseEvents = new MouseEvents();
        beforeAll((): void => {
            chartContainer = createElement('div', { id: 'container', styles: 'width: 800px; height: 450px' });
            document.body.appendChild(chartContainer);
            pieObj = new AccumulationChart({
                enableAnimation: false,
                border: {
                    width: 3,
                    color: 'blue'
                },
                series: [
                    {
                        dataSource: [
                            { x: 'Argentina', y: 505370, r: '100' },
                            { x: 'Belgium', y: 551500, r: '118.7' },
                            { x: 'Cuba', y: 312685, r: '124.6' },
                            { x: 'Dominican Republic', y: 350000, r: '137.5' },
                            { x: 'Egypt', y: 301000, r: '150.8' },
                            { x: 'Kazakhstan', y: 300000, r: '155.5' },
                            { x: 'Somalia', y: 357022, r: '160.6' }

                        ],
                        dataLabel: {
                            visible: true, position: 'Outside',
                            name: 'x'
                        },
                        radius: '100%', xName: 'x',
                        yName: 'y', innerRadius: '0%'
                    },

                ],
                enableSmartLabels: true,
                legendSettings: {
                    visible: true,
                    title: 'Countries',
                    titleStyle: {
                        size: '14px',
                        color: 'orange',
                        textAlignment: 'Center',
                        textOverflow: 'Trim'
                    },
                    border: {
                        width: 2,
                        color: 'red'
                    },
                    position: 'Bottom',
                },
                // Initialize tht tooltip
                tooltip: { enable: true, format: '${point.x} : <b>${point.y}</b>' },
            });
            pieObj.appendTo('#container');
        });

        afterAll((): void => {
            //pieObj.accumulationLegendModule.destroy(pieObj);
            pieObj.destroy();
            //pieObj.loaded = null;
            document.getElementById('container').remove();
        });
        it('01.legend bottom: title top', (done: Function) => {
            pieObj.loaded = (args: IAccLoadedEventArgs) => {
                titleElement = getElement('container_chart_legend_title');
                expect(titleElement.textContent === 'Countries').toBe(true);
                xValue = titleElement.getAttribute('x');
                expect(xValue === '400').toBe(true);
                yValue = titleElement.getAttribute('y');
                expect(yValue === '406' || yValue === '407').toBe(true);
                legendGroup = getElement('container_chart_legend_translate_g');
                expect(legendGroup.childElementCount === 7).toBe(true);
                done();
            };
            pieObj.refresh();
        });
        it('02.legend bottom: title top with text trim', (done: Function) => {
            pieObj.loaded = (args: IAccLoadedEventArgs) => {
                titleElement = getElement('container_chart_legend_title');
                expect(titleElement.textContent === 'It’s important that he dress like an Indian, dance like an Indian, even if it is an act, even if he feels').toBe(true);
                xValue = titleElement.getAttribute('x');
                expect(xValue === '400').toBe(true);
                yValue = titleElement.getAttribute('y');
                expect(yValue === '406' || yValue === '407').toBe(true);
                legendGroup = getElement('container_chart_legend_translate_g');
                expect(legendGroup.childElementCount === 7).toBe(true);
                done();
            };
            pieObj.legendSettings.title = 'It’s important that he dress like an Indian, dance like an Indian, even if it is an act, even if he feels';
            pieObj.refresh();
        });
        it('03.legend bottom: title left', (done: Function) => {
            pieObj.loaded = (args: IAccLoadedEventArgs) => {
                titleElement = getElement('container_chart_legend_title');
                expect(titleElement.textContent === 'Countries').toBe(true);
                xValue = titleElement.getAttribute('x');
                expect(xValue === '42.5' || xValue === '58.5').toBe(true);
                yValue = titleElement.getAttribute('y');
                expect(yValue === '427.25' || yValue === '427').toBe(true);
                legendGroup = getElement('container_chart_legend_translate_g');
                expect(legendGroup.childElementCount === 7).toBe(true);
                done();
            };
            pieObj.legendSettings.title = 'Countries';
            pieObj.legendSettings.titlePosition = 'Left';
            pieObj.refresh();
        });
        it('04.legend bottom: title right', (done: Function) => {
            pieObj.loaded = (args: IAccLoadedEventArgs) => {
                titleElement = getElement('container_chart_legend_title');
                expect(titleElement.textContent === 'Countries').toBe(true);
                xValue = titleElement.getAttribute('x');
                expect(xValue === '696' || xValue === '698.5').toBe(true);
                yValue = titleElement.getAttribute('y');
                expect(yValue === '427.25' || yValue === '427').toBe(true);
                legendGroup = getElement('container_chart_legend_translate_g');
                expect(legendGroup.childElementCount === 7).toBe(true);
                done();
            };
            pieObj.legendSettings.title = 'Countries';
            pieObj.legendSettings.titlePosition = 'Right';
            pieObj.refresh();
        });
        it('05.legend top: title top', (done: Function) => {
            pieObj.loaded = (args: IAccLoadedEventArgs) => {
                titleElement = getElement('container_chart_legend_title');
                expect(titleElement.textContent === 'Countries').toBe(true);
                xValue = titleElement.getAttribute('x');
                expect(xValue === '400').toBe(true);
                yValue = titleElement.getAttribute('y');
                expect(yValue === '30' || yValue === '27').toBe(true);
                legendGroup = getElement('container_chart_legend_translate_g');
                expect(legendGroup.childElementCount === 7).toBe(true);
                done();
            };
            pieObj.legendSettings.title = 'Countries';
            pieObj.legendSettings.titlePosition = 'Top';
            pieObj.legendSettings.position = 'Top';
            pieObj.refresh();
        });
        it('06.legend top: title left', (done: Function) => {
            pieObj.loaded = (args: IAccLoadedEventArgs) => {
                titleElement = getElement('container_chart_legend_title');
                expect(titleElement.textContent === 'Countries').toBe(true);
                xValue = titleElement.getAttribute('x');
                expect(xValue === '42.5' || xValue === '58.5').toBe(true);
                yValue = titleElement.getAttribute('y');
                expect(yValue === '32.25' || yValue === '31').toBe(true);
                legendGroup = getElement('container_chart_legend_translate_g');
                expect(legendGroup.childElementCount === 7).toBe(true);
                done();
            };
            pieObj.legendSettings.title = 'Countries';
            pieObj.legendSettings.titlePosition = 'Left';
            pieObj.legendSettings.position = 'Top';
            pieObj.refresh();
        });
        it('07.legend top: title right', (done: Function) => {
            pieObj.loaded = (args: IAccLoadedEventArgs) => {
                titleElement = getElement('container_chart_legend_title');
                expect(titleElement.textContent === 'Countries').toBe(true);
                xValue = titleElement.getAttribute('x');
                expect(xValue === '696' || xValue === '698.5').toBe(true);
                yValue = titleElement.getAttribute('y');
                expect(yValue === '32.25' || yValue === '31').toBe(true);
                legendGroup = getElement('container_chart_legend_translate_g');
                expect(legendGroup.childElementCount === 7).toBe(true);
                done();
            };
            pieObj.legendSettings.title = 'Countries';
            pieObj.legendSettings.titlePosition = 'Right';
            pieObj.legendSettings.position = 'Top';
            pieObj.refresh();
        });
        it('08.legend right: title top', (done: Function) => {
            pieObj.loaded = (args: IAccLoadedEventArgs) => {
                titleElement = getElement('container_chart_legend_title');
                expect(titleElement.textContent === 'Countries').toBe(true);
                xValue = titleElement.getAttribute('x');
                expect(xValue === '697.4797803156889' || xValue === '692.9797803156889' || xValue === '697.9797803156889').toBe(true);
                yValue = titleElement.getAttribute('y');
                expect(yValue === '143' || yValue === '145').toBe(true);
                legendGroup = getElement('container_chart_legend_translate_g');
                expect(legendGroup.childElementCount === 7).toBe(true);
                done();
            };
            pieObj.legendSettings.title = 'Countries';
            pieObj.legendSettings.titlePosition = 'Top';
            pieObj.legendSettings.position = 'Right';
            pieObj.refresh();
        });
        it('09.legend left: title top', (done: Function) => {
            pieObj.loaded = (args: IAccLoadedEventArgs) => {
                titleElement = getElement('container_chart_legend_title');
                expect(titleElement.textContent === 'Countries').toBe(true);
                xValue = titleElement.getAttribute('x');
                expect(xValue === '99.21712842495415').toBe(true);
                yValue = titleElement.getAttribute('y');
                expect(yValue === '143' || yValue === '145').toBe(true);
                legendGroup = getElement('container_chart_legend_translate_g');
                expect(legendGroup.childElementCount === 7).toBe(true);
                done();
            };
            pieObj.legendSettings.title = 'Countries';
            pieObj.legendSettings.titlePosition = 'Top';
            pieObj.legendSettings.position = 'Left';
            pieObj.refresh();
        });
    });
    describe('Chart Control Legend click check', () => {
        let chart: AccumulationChart;
        let loaded: EmitType<IAccLoadedEventArgs>;
        let legendClick: EmitType<IAccLegendClickEventArgs>;
        let legendId: string = 'container1' + '_chart_legend';
        let legendElement: Element; let legendArgCancel: boolean;
        let trigger: MouseEvents = new MouseEvents();
        let ele: HTMLElement = createElement('div', { id: 'container1', styles: 'width: 900px' });
        document.body.appendChild(ele);
        beforeAll((): void => {
            var data = [{ x: 'English', y: 48.20, text: '18.20%' },
            { x: 'Sanskrit', y: 27.3, text: '27.3%' },
            { x: 'French', y: 27.3, text: '27.3%' },
            { x: 'Tamil', y: 55.9, text: '55.9%' },
            { x: 'Maths', y: 76.8, text: '76.8%' },
            { x: 'Chemistry', y: 86.8, text: '76.8%' },
            { x: 'Biology', y: 96.8, text: '76.8%' },
            { x: 'Physics', y: 100, text: '100%' }];
            legendClick = function (args) {
                legendArgCancel = args.cancel = false;
            }
            chart = new AccumulationChart({
                height: '400', width: '800', series: [{
                    type: 'Pie', dataSource: data, xName: 'x', yName: 'y', animation: { enable: false },
                    dataLabel: {
                        name: 'text', visible: true, position: 'Outside',
                        connectorStyle: { type: 'Curve', color: 'black', width: 2, dashArray: '2,1', length: '5' }
                    },
                }],
                legendSettings: { border: { color: 'red' }, visible: true }, legendClick: legendClick
            });
            chart.appendTo(ele);
        });
        afterAll((): void => {
            chart.destroy();
            document.getElementById('container1').remove();
        });
        it('checking with args after cancel  enable', (done: Function) => {
            loaded = (args: Object): void => {
                chart.loaded = null;
                legendElement = getElement(legendId + '_text_0');
                trigger.clickEvent(legendElement);
                let pointElement = getElement('container1_Series_0_Point_0').getAttribute('fill');
                expect(pointElement == null).not.toBe(true);
                done();
            };
            legendClick = (args: IAccLegendClickEventArgs): void => {
                args.cancel = true;
            }
            chart.legendClick = legendClick;
            chart.loaded = loaded;
            chart.refresh();
        });
        it('checking with args before cancel  enable', (done: Function) => {
            loaded = (args: object): void => {
                chart.loaded = null;
                legendElement = getElement(legendId + '_text_0');
                trigger.clickEvent(legendElement);
                let pointElement = getElement('container1_Series_0_Point_0').getAttribute('visiblity');
                expect(pointElement == null).toBe(true);
                done();
            };
            legendClick = (args: IAccLegendClickEventArgs): void => {
                args.cancel = false;
            }
            chart.legendClick = legendClick;
            chart.loaded = loaded;
            chart.refresh();
        });
    });
    describe('Legend new paging support checking with pie chart', () => {
        let chartContainer: HTMLElement;
        let titleElement: Element;
        let legendGroup: Element;
        let id: string = 'container';
        let legendEle: Element;
        let legendId: string = id + '_chart_legend';
        let backArrow: Element; let fontArrow: Element;
        let opacity: string; let path: string;
        let xValue: string; let yValue: string;
        let pieObj: AccumulationChart;
        let trigger: MouseEvents = new MouseEvents();
        beforeAll((): void => {
            chartContainer = createElement('div', { id: 'container', styles: 'width: 300px; height: 300px' });
            document.body.appendChild(chartContainer);
            pieObj = new AccumulationChart({
                border: {
                    width: 3,
                    color: 'blue'
                },
                series: [
                    {
                        dataSource: [
                            { x: 'Argentina', y: 505370, r: '100' },
                            { x: 'Belgium', y: 551500, r: '118.7' },
                            { x: 'Cuba', y: 312685, r: '124.6' },
                            { x: 'Dominican Republic', y: 350000, r: '137.5' },
                            { x: 'Egypt', y: 301000, r: '150.8' },
                            { x: 'Kazakhstan', y: 300000, r: '155.5' },
                            { x: 'Somalia', y: 357022, r: '160.6' }

                        ],
                        dataLabel: {
                            visible: true, position: 'Outside',
                            name: 'x'
                        },
                        radius: '100%', xName: 'x',
                        yName: 'y', innerRadius: '0%'
                    },

                ],
                enableSmartLabels: true,
                legendSettings: {
                    visible: true,
                    title: '',
                    titleStyle: {
                        size: '14px',
                        color: 'orange',
                        textAlignment: 'Center',
                        textOverflow: 'Trim'
                    },
                    border: {
                        width: 2,
                        color: 'red'
                    },
                    position: 'Bottom',
                    margin: { top: 10 },
                    enablePages: false
                },
                // Initialize tht tooltip
                tooltip: { enable: true, format: '${point.x} : <b>${point.y}</b>' },
                enableAnimation: true,
            });
            pieObj.appendTo('#container');
        });

        afterAll((): void => {
            //pieObj.accumulationLegendModule.destroy(pieObj);
            pieObj.destroy();
            //pieObj.loaded = null;
            document.getElementById('container').remove();
        });
        it('01.legend bottom: without title', (done: Function) => {
            pieObj.loaded = (args: IAccLoadedEventArgs) => {
                titleElement = getElement('container_chart_legend_title');
                expect(titleElement === null).toBe(true);
                backArrow = getElement('container_chart_legend_pageup');
                path = backArrow.getAttribute('d');
                expect(path === 'M 48.5 267.71501821018626 L 40.5 271.71501821018626 L 48.5 275.71501821018626 L 48.5 273.71501821018626 L 44.5 271.71501821018626 L48.5 269.71501821018626 Z').toBe;
                fontArrow = getElement('container_chart_legend_pagedown');
                path = fontArrow.getAttribute('d');
                expect(path === 'M 251.5 267.71501821018626 L 259.5 271.71501821018626 L 251.5 275.71501821018626 L 251.5 273.71501821018626 L 255.5 271.71501821018626 L251.5 269.71501821018626 Z').toBe;
                legendGroup = getElement('container_chart_legend_translate_g');
                expect(legendGroup.childElementCount === 7).toBe(true);
                trigger.keyboardEvent('keyup', backArrow, 'Arrow', 'Arrow');
                trigger.keyboardEvent('keyup', legendGroup, 'Arrow', 'Arrow');
                done();
            };
            pieObj.highlightMode='Point'
            pieObj.refresh();
        });
        it('02.legend bottom: title top', (done: Function) => {
            pieObj.loaded = (args: IAccLoadedEventArgs) => {
                titleElement = getElement('container_chart_legend_title');
                expect(titleElement.textContent === 'Countries').toBe(true);
                xValue = titleElement.getAttribute('x');
                expect(xValue === '150').toBe(true);
                yValue = titleElement.getAttribute('y');
                expect(yValue === '254.989169209323' || yValue === '255.98433900949567').toBe(true);
                backArrow = getElement('container_chart_legend_pageup');
                path = backArrow.getAttribute('d');
                expect(path === 'M 44 267.489169209323 L 36 271.489169209323 L 44 275.489169209323 L 44 273.489169209323 L 40 271.489169209323 L44 269.489169209323 Z' ||
                    path === 'M 27 268.48433900949567 L 19 272.48433900949567 L 27 276.48433900949567 L 27 274.48433900949567 L 23 272.48433900949567 L27 270.48433900949567 Z').toBe;
                fontArrow = getElement('container_chart_legend_pagedown');
                path = fontArrow.getAttribute('d');
                expect(path === 'M 256 267.489169209323 L 264 271.489169209323 L 256 275.489169209323 L 256 273.489169209323 L 260 271.489169209323 L256 269.489169209323 Z'||
                    path === 'M 273 268.48433900949567 L 281 272.48433900949567 L 273 276.48433900949567 L 273 274.48433900949567 L 277 272.48433900949567 L273 270.48433900949567 Z').toBe;
                legendGroup = getElement('container_chart_legend_translate_g');
                expect(legendGroup.childElementCount === 7).toBe(true);
                done();
            };
            pieObj.legendSettings.title = 'Countries';
            pieObj.legendSettings.titlePosition = 'Top';
            pieObj.refresh();
        });
        it('03.legend bottom: title left', (done: Function) => {
            pieObj.loaded = (args: IAccLoadedEventArgs) => {
                titleElement = getElement('container_chart_legend_title');
                expect(titleElement.textContent === 'Countries').toBe(true);
                xValue = titleElement.getAttribute('x');
                expect(xValue === '17' || xValue === '19.5').toBe(true);
                yValue = titleElement.getAttribute('y');
                expect(yValue === '276.21622576014306' || yValue === '275.96501821018626').toBe(true);
                backArrow = getElement('container_chart_legend_pageup');
                path = backArrow.getAttribute('d');
                expect(path === 'M 88 268.46501821018626 L 80 272.46501821018626 L 88 276.46501821018626 L 88 274.46501821018626 L 84 272.46501821018626 L88 270.46501821018626 Z' ||
                    path === 'M 98 267.71501821018626 L 90 271.71501821018626 L 98 275.71501821018626 L 98 273.71501821018626 L 94 271.71501821018626 L98 269.71501821018626 Z').toBe;
                fontArrow = getElement('container_chart_legend_pagedown');
                path = fontArrow.getAttribute('d');
                expect(path === 'M 271 268.46501821018626 L 279 272.46501821018626 L 271 276.46501821018626 L 271 274.46501821018626 L 275 272.46501821018626 L271 270.46501821018626 Z' ||
                    path === 'M 256 267.71501821018626 L 264 271.71501821018626 L 256 275.71501821018626 L 256 273.71501821018626 L 260 271.71501821018626 L256 269.71501821018626 Z').toBe;
                legendGroup = getElement('container_chart_legend_translate_g');
                expect(legendGroup.childElementCount === 7).toBe(true);
                done();
            };
            pieObj.legendSettings.title = 'Countries';
            pieObj.legendSettings.titlePosition = 'Left';
            pieObj.refresh();
        });
        it('04.legend bottom: title right', (done: Function) => {
            pieObj.loaded = (args: IAccLoadedEventArgs) => {
                titleElement = getElement('container_chart_legend_title');
                expect(titleElement.textContent === 'Countries').toBe(true);
                xValue = titleElement.getAttribute('x');
                expect(xValue === '224' || xValue === '226.5').toBe(true);
                yValue = titleElement.getAttribute('y');
                expect(yValue === '276.21622576014306' || yValue === '275.96501821018626').toBe(true);
                backArrow = getElement('container_chart_legend_pageup');
                path = backArrow.getAttribute('d');
                expect(path === 'M 38.5 267.46622576014306 L 30.5 271.46622576014306 L 38.5 275.46622576014306 L 38.5 273.46622576014306 L 34.5 271.46622576014306 L38.5 269.46622576014306 Z' ||
                    path === 'M 29 268.46501821018626 L 21 272.46501821018626 L 29 276.46501821018626 L 29 274.46501821018626 L 25 272.46501821018626 L29 270.46501821018626 Z').toBe;
                fontArrow = getElement('container_chart_legend_pagedown');
                path = fontArrow.getAttribute('d');
                expect(path === 'M 197.5 267.46622576014306 L 205.5 271.46622576014306 L 197.5 275.46622576014306 L 197.5 273.46622576014306 L 201.5 271.46622576014306 L197.5 269.46622576014306 Z' ||
                    path === 'M 207 268.46501821018626 L 215 272.46501821018626 L 207 276.46501821018626 L 207 274.46501821018626 L 211 272.46501821018626 L207 270.46501821018626 Z').toBe;
                legendGroup = getElement('container_chart_legend_translate_g');
                expect(legendGroup.childElementCount === 7).toBe(true);
                done();
            };
            pieObj.legendSettings.title = 'Countries';
            pieObj.legendSettings.titlePosition = 'Right';
            pieObj.refresh();
        });
        it('05.legend top: without title', (done: Function) => {
            pieObj.loaded = (args: IAccLoadedEventArgs) => {
                titleElement = getElement('container_chart_legend_title');
                expect(titleElement === null).toBe(true);
                backArrow = getElement('container_chart_legend_pageup');
                path = backArrow.getAttribute('d');
                expect(path === 'M 44 28.5 L 36 32.5 L 44 36.5 L 44 34.5 L 40 32.5 L44 30.5 Z' ||
                    path === 'M 48.5 28.5 L 40.5 32.5 L 48.5 36.5 L 48.5 34.5 L 44.5 32.5 L48.5 30.5 Z').toBe;
                fontArrow = getElement('container_chart_legend_pagedown');
                path = fontArrow.getAttribute('d');
                expect(path === 'M 256 28.5 L 264 32.5 L 256 36.5 L 256 34.5 L 260 32.5 L256 30.5 Z' ||
                    path === 'M 251.5 28.5 L 259.5 32.5 L 251.5 36.5 L 251.5 34.5 L 255.5 32.5 L251.5 30.5 Z').toBe;
                legendGroup = getElement('container_chart_legend_translate_g');
                expect(legendGroup.childElementCount === 7).toBe(true);
                done();
            };
            pieObj.legendSettings.title = '';
            pieObj.legendSettings.titlePosition = 'Top';
            pieObj.legendSettings.position = 'Top';
            pieObj.refresh();
        });
        it('06.legend top: title top', (done: Function) => {
            pieObj.loaded = (args: IAccLoadedEventArgs) => {
                titleElement = getElement('container_chart_legend_title');
                expect(titleElement.textContent === 'Countries').toBe(true);
                xValue = titleElement.getAttribute('x');
                expect(xValue === '150').toBe(true);
                yValue = titleElement.getAttribute('y');
                expect(yValue === '35' || yValue === '31.999999999999993').toBe(true);
                backArrow = getElement('container_chart_legend_pageup');
                path = backArrow.getAttribute('d');
                expect(path === 'M 44 47.5 L 36 51.5 L 44 55.5 L 44 53.5 L 40 51.5 L44 49.5 Z' ||
                    path === 'M 48.5 44.49999999999999 L 40.5 48.49999999999999 L 48.5 52.49999999999999 L 48.5 50.49999999999999 L 44.5 48.49999999999999 L48.5 46.49999999999999 Z').toBe;
                fontArrow = getElement('container_chart_legend_pagedown');
                path = fontArrow.getAttribute('d');
                expect(path === 'M 256 47.5 L 264 51.5 L 256 55.5 L 256 53.5 L 260 51.5 L256 49.5 Z' ||
                    path === 'M 251.5 44.49999999999999 L 259.5 48.49999999999999 L 251.5 52.49999999999999 L 251.5 50.49999999999999 L 255.5 48.49999999999999 L251.5 46.49999999999999 Z').toBe;
                legendGroup = getElement('container_chart_legend_translate_g');
                expect(legendGroup.childElementCount === 7).toBe(true);
                done();
            };
            pieObj.legendSettings.title = 'Countries';
            pieObj.legendSettings.titlePosition = 'Top';
            pieObj.legendSettings.position = 'Top';
            pieObj.refresh();
        });
        it('07.legend top: title left', (done: Function) => {
            pieObj.loaded = (args: IAccLoadedEventArgs) => {
                titleElement = getElement('container_chart_legend_title');
                expect(titleElement.textContent === 'Countries').toBe(true);
                xValue = titleElement.getAttribute('x');
                expect(xValue === '17' || xValue === '19.5').toBe(true);
                yValue = titleElement.getAttribute('y');
                expect(yValue === '37.25' || yValue === '36').toBe(true);
                backArrow = getElement('container_chart_legend_pageup');
                path = backArrow.getAttribute('d');
                expect(path === 'M 97.5 28.5 L 89.5 32.5 L 97.5 36.5 L 97.5 34.5 L 93.5 32.5 L97.5 30.5 Z' ||
                    path === 'M 88 28.5 L 80 32.5 L 88 36.5 L 88 34.5 L 84 32.5 L88 30.5 Z').toBe;
                fontArrow = getElement('container_chart_legend_pagedown');
                path = fontArrow.getAttribute('d');
                expect(path === 'M 261.5 28.5 L 269.5 32.5 L 261.5 36.5 L 261.5 34.5 L 265.5 32.5 L261.5 30.5 Z' ||
                    path === 'M 271 28.5 L 279 32.5 L 271 36.5 L 271 34.5 L 275 32.5 L271 30.5 Z').toBe;
                legendGroup = getElement('container_chart_legend_translate_g');
                expect(legendGroup.childElementCount === 7).toBe(true);
                done();
            };
            pieObj.legendSettings.title = 'Countries';
            pieObj.legendSettings.titlePosition = 'Left';
            pieObj.legendSettings.position = 'Top';
            pieObj.refresh();
        });
        it('08.legend top: title right', (done: Function) => {
            pieObj.loaded = (args: IAccLoadedEventArgs) => {
                titleElement = getElement('container_chart_legend_title');
                expect(titleElement.textContent === 'Countries').toBe(true);
                xValue = titleElement.getAttribute('x');
                expect(xValue === '224' || xValue === '226.5').toBe(true);
                yValue = titleElement.getAttribute('y');
                expect(yValue === '37.25' || yValue === '36').toBe(true);
                backArrow = getElement('container_chart_legend_pageup');
                path = backArrow.getAttribute('d');
                expect(path === 'M 29 28.5 L 21 32.5 L 29 36.5 L 29 34.5 L 25 32.5 L29 30.5 Z' ||
                    path === 'M 44 28.5 L 36 32.5 L 44 36.5 L 44 34.5 L 40 32.5 L44 30.5 Z').toBe;
                fontArrow = getElement('container_chart_legend_pagedown');
                path = fontArrow.getAttribute('d');
                expect(path === 'M 207 28.5 L 215 32.5 L 207 36.5 L 207 34.5 L 211 32.5 L207 30.5 Z' ||
                    path === 'M 197 28.5 L 205 32.5 L 197 36.5 L 197 34.5 L 201 32.5 L197 30.5 Z').toBe;
                legendGroup = getElement('container_chart_legend_translate_g');
                expect(legendGroup.childElementCount === 7).toBe(true);
                done();
            };
            pieObj.legendSettings.title = 'Countries';
            pieObj.legendSettings.titlePosition = 'Right';
            pieObj.legendSettings.position = 'Top';
            pieObj.refresh();
        });
        it('09.legend right: title top', (done: Function) => {
            pieObj.loaded = (args: IAccLoadedEventArgs) => {
                titleElement = getElement('container_chart_legend_title');
                expect(titleElement.textContent === 'Countries').toBe(true);
                xValue = titleElement.getAttribute('x');
                expect(xValue === '339.5').toBe(true);
                yValue = titleElement.getAttribute('y');
                expect(yValue === '29' || yValue === '26').toBe(true);
                backArrow = getElement('container_chart_legend_pageup');
                path = backArrow.getAttribute('d');
                expect(path === 'M 335.5 45 L 339.5 37 L 343.5 45L 341.5 45 L 339.5 41L337.5 45 Z' ||
                    path === 'M 335.5 42 L 339.5 34 L 343.5 42L 341.5 42 L 339.5 38L337.5 42 Z').toBe;
                fontArrow = getElement('container_chart_legend_pagedown');
                path = fontArrow.getAttribute('d');
                expect(path === 'M 335.5 174 L 339.5 182 L 343.5 174L 341.5 174 L 339.5 178L337.5 174 Z' ||
                    path === 'M 335.5 174 L 339.5 182 L 343.5 174L 341.5 174 L 339.5 178L337.5 174 Z').toBe;
                legendGroup = getElement('container_chart_legend_translate_g');
                expect(legendGroup.childElementCount === 7).toBe(true);
                done();
            };
            chartContainer.style.width = '400px';
            chartContainer.style.height = '200px';
            pieObj.legendSettings.title = 'Countries';
            pieObj.legendSettings.titlePosition = 'Top';
            pieObj.legendSettings.position = 'Right';
            pieObj.refresh();
        });
        it('10.legend left: title top', (done: Function) => {
            pieObj.loaded = (args: IAccLoadedEventArgs) => {
                titleElement = getElement('container_chart_legend_title');
                expect(titleElement.textContent === 'Countries').toBe(true);
                xValue = titleElement.getAttribute('x');
                expect(xValue === '60.5').toBe(true);
                yValue = titleElement.getAttribute('y');
                expect(yValue === '29' || yValue === '26').toBe(true);
                backArrow = getElement('container_chart_legend_pageup');
                path = backArrow.getAttribute('d');
                expect(path === 'M 56.5 45 L 60.5 37 L 64.5 45L 62.5 45 L 60.5 41L58.5 45 Z' ||
                    path === 'M 56.5 42 L 60.5 34 L 64.5 42L 62.5 42 L 60.5 38L58.5 42 Z').toBe;
                fontArrow = getElement('container_chart_legend_pagedown');
                path = fontArrow.getAttribute('d');
                expect(path === 'M 56.5 174 L 60.5 182 L 64.5 174L 62.5 174 L 60.5 178L58.5 174 Z' ||
                    path === 'M 56.5 174 L 60.5 182 L 64.5 174L 62.5 174 L 60.5 178L58.5 174 Z').toBe;
                legendGroup = getElement('container_chart_legend_translate_g');
                expect(legendGroup.childElementCount === 7).toBe(true);
                done();
            };
            pieObj.legendSettings.title = 'Countries';
            pieObj.legendSettings.titlePosition = 'Top';
            pieObj.legendSettings.position = 'Left';
            pieObj.refresh();
        });
        it('11.legend with html entities', (done: Function) => {
            pieObj.loaded = (args: IAccLoadedEventArgs) => {
                legendEle = getElement(legendId + '_text_1');
                expect(legendEle.textContent === '<Serations').toBe(true);
                legendEle = getElement(legendId + '_text_4');
                expect(legendEle.textContent === 'Prepaid&Assets').toBe(true);
                done();
            };
            pieObj.legendSettings.position = 'Bottom';
            pieObj.series[0].dataSource = [{ x: 'Net-s', y: 21, text: '21%' },
            { x: '&#60;Serations', y: 21, text: '21%' },
            { x: 'Privts', y: 8, text: '8%' },
            { x: 'Aler&gt;', y: 8, text: '8%' },
            { x: 'Prepaid&amp;Assets', y: 4, text: '4%' },
            { x: 'St', y: 21, text: '21%' },
            { x: 'Fedeue', y: 16, text: '16%' }];
            pieObj.refresh();
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

describe('Checking RTL Behaviour for legend', () => {
    let ele: HTMLElement;
    let id: string = 'ej2-container';
    let textEle: Element;
    let legendTextId: string = id + '_chart_legend_text_0';
    let legendTitleId: string = id +'_chart_legend_title';
    let accumulation: AccumulationChart;
    let posX: string;
    let textAnchor: string;
    let loaded: EmitType<IAccLoadedEventArgs>;
    let trigger: MouseEvents = new MouseEvents();
    beforeAll((): void => {
        ele = createElement('div', { id: id,});
        document.body.appendChild(ele);
        accumulation = new AccumulationChart({
            border: { width: 1, color: 'blue' },
            series: [
                {
                    type: 'Pie',
                    dataSource: piedata, animation: { enable: false }, xName: 'x', yName: 'y',
                }
            ], 
            width: '600', 
            height: '400', 
            legendSettings: { visible: true },
        });
        accumulation.appendTo('#' + id);
    });

    afterAll((): void => {
        accumulation.loaded = null;
        accumulation.destroy();
        removeElement(id);
    });
    it('Default legend group position', (done: Function) => {
        loaded = (args: IAccLoadedEventArgs) => {
            textEle = getElement(legendTextId);
            posX = textEle.getAttribute('x');
            expect(posX == '510.75' || posX == '511.5').toBe(true);
            done();
        };
        accumulation.loaded = loaded;
        accumulation.refresh();
    });
    it('Default legend group position with Bottom', (done: Function) => {
        loaded = (args: IAccLoadedEventArgs) => {
            textEle = getElement(legendTextId);
            posX = textEle.getAttribute('x');
            expect(posX == '99.5' || posX == '100').toBe(true);
            done();
        };
        accumulation.loaded = loaded;
        accumulation.legendSettings.position = 'Bottom';
        accumulation.refresh();
    });
    it('RTL legend group position', (done: Function) => {
        loaded = (args: IAccLoadedEventArgs) => {
            textEle = getElement(legendTextId);
            posX = textEle.getAttribute('x');
            expect(posX == '499.75' || posX == '499.5').toBe(true);
            done();
        };
        accumulation.loaded = loaded;
        accumulation.legendSettings.position = 'Right';
        accumulation.enableRtl = true;
        accumulation.refresh();
    });
    it('RTL legend group position with Bottom', (done: Function) => {
        loaded = (args: IAccLoadedEventArgs) => {
            textEle = getElement(legendTextId);
            posX = textEle.getAttribute('x');
            expect(posX == '493.5' || posX == '493').toBe(true);
            done();
        };
        accumulation.loaded = loaded;
        accumulation.legendSettings.position = 'Bottom';
        accumulation.refresh();
    });
    it('Default Title anchor & legend text position', (done: Function) => {
        loaded = (args: IAccLoadedEventArgs) => {
            textEle = getElement(legendTitleId);
            textAnchor = textEle.getAttribute('text-anchor');
            expect(textAnchor).toBe('');
            textEle = getElement(legendTextId);
            posX = textEle.getAttribute('x');
            expect(posX == '146' || posX == '140.5').toBe(true);
            done();
        };
        accumulation.loaded = loaded;
        accumulation.legendSettings.title = 'Legend Groups';
        accumulation.legendSettings.titlePosition = 'Left';
        accumulation.enableRtl = false;
        accumulation.refresh();
    });
    it('RTL Title anchor & legend text position', (done: Function) => {
        loaded = (args: IAccLoadedEventArgs) => {
            textEle = getElement(legendTitleId);
            textAnchor = textEle.getAttribute('text-anchor');
            expect(textAnchor).toBe('end');
            textEle = getElement(legendTextId);
            posX = textEle.getAttribute('x');
            expect(posX == '545' || posX == '538.5').toBe(true);
            done();
        };
        accumulation.loaded = loaded;
        accumulation.enableRtl = true;
        accumulation.refresh();
    });
    it('Checking the legend reverse behaviour', (done: Function) => {
        loaded = (args: IAccLoadedEventArgs) => {
            textEle = getElement(legendTextId);
            posX = textEle.getAttribute('x');
            expect(posX == '545' || posX == '538.5').toBe(true);
            done();
        };
        accumulation.loaded = loaded;
        accumulation.enableRtl = true;
        accumulation.refresh();
    });
    it('checking with keyboard navigation', (done: Function) => {
        loaded = (args: IAccLoadedEventArgs) => {
            if (!enterKeyUpTriggered) {
                enterKeyUpTriggered = true;
                textEle = getElement(legendTextId);
                trigger.keyboardEvent('keyup', textEle, 'Space', 'Space');
                expect(textEle !== null).toBe(true);
            }
            done();
        };
        let enterKeyUpTriggered: boolean = false;
        accumulation.loaded = loaded;
        accumulation.refresh();
    });
  });
  describe('Check layout behaviour for legend', () => {
    let ele: HTMLElement;
    let id: string = 'ej2-container';
    let textEle: Element;
    let legendTextId: string = id + '_chart_legend_text_0';
    let legendTitleId: string = id +'_chart_legend_title';
    let accumulation: AccumulationChart;
    let posX: string;
    let textAnchor: string;
    let loaded: EmitType<IAccLoadedEventArgs>;
    let trigger: MouseEvents = new MouseEvents();
    beforeAll((): void => {
        ele = createElement('div', { id: id,});
        document.body.appendChild(ele);
        accumulation = new AccumulationChart({
            border: { width: 1, color: 'blue' },
            series: [
                {
                    type: 'Pie',
                    dataSource: piedata, animation: { enable: false }, xName: 'x', yName: 'y',
                }
            ], 
            width: '600', 
            height: '400', 
            legendSettings: { visible: true },
        });
        accumulation.appendTo('#' + id);
    });

    afterAll((): void => {
        accumulation.loaded = null;
        accumulation.destroy();
        removeElement(id);
    });
    it('Legend - Checking Horizontal layout.', (done: Function) => {
        loaded = (args: Object): void => {
            accumulation.loaded = null;
            textEle = document.getElementById(id + '_chart_legend_text_3');
            const posX = textEle.getAttribute('x');
            expect(posX === '234.5' || posX === '398').toBe(true);
            done();
        };
        accumulation.legendSettings = {
            position: 'Bottom', layout: 'Horizontal'
        };
        accumulation.loaded = loaded;
        accumulation.refresh();
    });
    it('Legend - Checking Vertical layout.', (done: Function) => {
        loaded = (args: Object): void => {
            accumulation.loaded = null;
            textEle = document.getElementById(id + '_chart_legend_text_3');
            const posX = textEle.getAttribute('x');
            expect(posX === '296' || posX === '398').toBe(true);
            done();
        };
        accumulation.legendSettings = {
            position: 'Bottom', layout: 'Vertical'
        };
        accumulation.loaded = loaded;
        accumulation.refresh();
    });
    it('Legend - Checking Auto layout with maximumColumns and fixed width.', (done: Function) => {
        loaded = (args: Object): void => {
            accumulation.loaded = null;
            textEle = document.getElementById(id + '_chart_legend_text_4');
            const posX = textEle.getAttribute('x');
            expect(posX === '296' || posX === '398').toBe(true);
            done();
        };
        accumulation.legendSettings = {
            position: 'Bottom', layout: 'Auto', maximumColumns: 3, fixedWidth: true
        };
        accumulation.loaded = loaded;
        accumulation.refresh();
    });
    it('Legend - Checking Auto layout with maximumColumns.', (done: Function) => {
        loaded = (args: Object): void => {
            accumulation.loaded = null;
            textEle = document.getElementById(id + '_chart_legend_text_4');
            const posX = textEle.getAttribute('x');
            expect(posX === '299.5' || posX === '398').toBe(true);
            done();
        };
        accumulation.legendSettings = {
            position: 'Bottom', layout: 'Auto', maximumColumns: 3, fixedWidth: false
        };
        accumulation.loaded = loaded;
        accumulation.refresh();
    });
});
});