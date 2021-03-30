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
import { IAccLoadedEventArgs } from '../../../src/accumulation-chart/model/pie-interface';
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
        ele = createElement('div', { id: id });
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
        expect(legendEle.getAttribute('x') == '487' || legendEle.getAttribute('x') == '487.75').toBe(true);
        expect(legendEle.getAttribute('width') == '45' || legendEle.getAttribute('width') == '44').toBe(true);
        expect(legendEle.getAttribute('y') === '71' || legendEle.getAttribute('y') === '76').toBe(true);
        expect(legendEle.getAttribute('height') === '258' || legendEle.getAttribute('height') === '248').toBe(true);
    });
    it('Pie Legend auto position chekcing while width is less than height', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            legendEle = getElement(legendId + '_element');
            expect(legendEle.getAttribute('x') == '42.5' || legendEle.getAttribute('x') == '43').toBe(true);

            expect(legendEle.getAttribute('y') === '496' || legendEle.getAttribute('y') === '496.75').toBe(true);

            expect(legendEle.getAttribute('height') === '33' || legendEle.getAttribute('height') === '32').toBe(true);

            expect(legendEle.getAttribute('width') == '315' || legendEle.getAttribute('width') == '314').toBe(true);
            done();
        };
        accumulation.height = '600';
        accumulation.width = '400';
        accumulation.refresh();
    });
    it('Pie Legend left position chekcing', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            legendEle = getElement(legendId + '_element');
            expect(legendEle.getAttribute('x') == '68' || legendEle.getAttribute('x') == '68.25').toBe(true);

            expect(legendEle.getAttribute('y') === '71' || legendEle.getAttribute('y') === '76').toBe(true);

            expect(legendEle.getAttribute('height') === '258' || legendEle.getAttribute('height') === '248').toBe(true);
            expect(legendEle.getAttribute('width') == '45' || legendEle.getAttribute('width') == '44').toBe(true);
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
            expect(legendEle.getAttribute('x') == '142.5' || legendEle.getAttribute('x') == '143').toBe(true);

            expect(legendEle.getAttribute('y') === '27.80000000000001' || legendEle.getAttribute('y') === '27.849999999999994').toBe(true);

            expect(legendEle.getAttribute('height') === '33' || legendEle.getAttribute('height') === '32').toBe(true);

            expect(legendEle.getAttribute('width') == '315' || legendEle.getAttribute('width') == '314').toBe(true);
            done();
        };
        accumulation.legendSettings.position = 'Top';
        accumulation.refresh();
    });
    it('Pie Legend Bottom position chekcing', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            legendEle = getElement(legendId + '_element');
            expect(legendEle.getAttribute('x') == '142.5' || legendEle.getAttribute('x') == '143').toBe(true);

            expect(legendEle.getAttribute('y') === '339.20000000000005' || legendEle.getAttribute('y') === '340.15').toBe(true);

            expect(legendEle.getAttribute('height') === '33' || legendEle.getAttribute('height') === '32').toBe(true);

            expect(legendEle.getAttribute('width') == '315' || legendEle.getAttribute('width') == '314').toBe(true);
            done();
        };
        accumulation.legendSettings.position = 'Bottom';
        accumulation.refresh();
    });
    it('Pie Legend Right position chekcing', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            legendEle = getElement(legendId + '_element');
            expect(legendEle.getAttribute('x') == '487' || legendEle.getAttribute('x') == '487.75').toBe(true);

            expect(legendEle.getAttribute('y') === '71' || legendEle.getAttribute('y') === '76').toBe(true);

            expect(legendEle.getAttribute('height') === '258' || legendEle.getAttribute('height') === '248').toBe(true);

            expect(legendEle.getAttribute('width') == '45' || legendEle.getAttribute('width') == '44').toBe(true);
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
            expect(legendEle.getAttribute('x') == '517.4000000000001' || legendEle.getAttribute('x') == '518.1500000000001').toBe(true);

            expect(legendEle.getAttribute('y') === '71' || legendEle.getAttribute('y') === '76').toBe(true);

            expect(legendEle.getAttribute('height') === '258' || legendEle.getAttribute('height') === '248').toBe(true);

            expect(legendEle.getAttribute('width') == '45' || legendEle.getAttribute('width') == '44').toBe(true);
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
            expect(legendEle.getAttribute('x') == '667.4' || legendEle.getAttribute('x') == '668.15').toBe(true);

            expect(legendEle.getAttribute('y') === '71' || legendEle.getAttribute('y') === '76').toBe(true);

            expect(legendEle.getAttribute('height') === '258' || legendEle.getAttribute('height') === '248').toBe(true);

            expect(legendEle.getAttribute('width') == '45' || legendEle.getAttribute('width') == '44').toBe(true);
            done();
        };
        accumulation.width = '800';
        accumulation.refresh();
    });
    it('Smart Legend placing datalabel Inside, legend position left, exploding length less than chart width', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            legendEle = getElement(legendId + '_element');
            expect(legendEle.getAttribute('x') == '87.6' || legendEle.getAttribute('x') == '87.85').toBe(true);

            expect(legendEle.getAttribute('y') === '71' || legendEle.getAttribute('y') === '76').toBe(true);

            expect(legendEle.getAttribute('height') === '258' || legendEle.getAttribute('height') === '248').toBe(true);

            expect(legendEle.getAttribute('width') == '45' || legendEle.getAttribute('width') == '44').toBe(true);
            done();
        };
        accumulation.legendSettings.position = 'Left';
        accumulation.refresh();
    });
    it('Smart Legend placing datalabel Inside, legend position left, exploding length greater than chart width', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            legendEle = getElement(legendId + '_element');
            expect(legendEle.getAttribute('x') == '37.6' || legendEle.getAttribute('x') == '37.85').toBe(true);

            expect(legendEle.getAttribute('y') === '71' || legendEle.getAttribute('y') === '76').toBe(true);

            expect(legendEle.getAttribute('height') === '258' || legendEle.getAttribute('height') === '248').toBe(true);

            expect(legendEle.getAttribute('width') == '45' || legendEle.getAttribute('width') == '44').toBe(true);
            done();
        };
        accumulation.width = '600';
        accumulation.refresh();
    });
    it('Smart Legend placing datalabel Inside, legend position top, exploding length greater than chart height', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            legendEle = getElement(legendId + '_element');
            expect(legendEle.getAttribute('x') == '42.5' || legendEle.getAttribute('x') == '43').toBe(true);

            expect(legendEle.getAttribute('y') === '11' || legendEle.getAttribute('y') === '11').toBe(true);

            expect(legendEle.getAttribute('height') === '33' || legendEle.getAttribute('height') === '32').toBe(true);

            expect(legendEle.getAttribute('width') == '315' || legendEle.getAttribute('width') == '314').toBe(true);
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

            expect(legendEle.getAttribute('x') == '308' || legendEle.getAttribute('x') == '310').toBe(true);
            expect(legendEle.getAttribute('y')).toBe('18');
            expect(legendEle.getAttribute('width') == '74' || legendEle.getAttribute('width') == '72').toBe(true);
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
            expect(legendEle.textContent).toBe('3/4');
            legendEle = getElement(legendId + '_pageup');
            trigger.clickEvent(legendEle);
            legendEle = getElement(legendId + '_pagenumber');
            expect(legendEle.textContent).toBe('2/4');
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
                expect(titleElement.textContent === 'It’s important that he dress like an Indian, dance like an Indian, even if it is an act, even...' ||
                    titleElement.textContent === 'It’s important that he dress like an Indian, dance like an Indian, even if it is an act, even if ...').toBe(true);
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
                expect(xValue === '91.5' || xValue === '105').toBe(true);
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
                expect(xValue === '649.5' || xValue === '641').toBe(true);
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
                expect(xValue === '91.5' || xValue === '105').toBe(true);
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
                expect(xValue === '649.5' || xValue === '641').toBe(true);
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
                expect(xValue === '693.2297803156889' || xValue === '693.7297803156889').toBe(true);
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
                expect(xValue === '103.96712842495415' || xValue === '103.96712842495415').toBe(true);
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
    describe('Legend new paging support checking with pie chart', () => {
        let chartContainer: HTMLElement;
        let titleElement: Element;
        let legendGroup: Element;
        let backArrow: Element; let fontArrow: Element;
        let opacity: string; let path: string;
        let xValue: string; let yValue: string;
        let pieObj: AccumulationChart;
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
                done();
            };
            pieObj.refresh();
        });
        it('02.legend bottom: title top', (done: Function) => {
            pieObj.loaded = (args: IAccLoadedEventArgs) => {
                titleElement = getElement('container_chart_legend_title');
                expect(titleElement.textContent === 'Countries').toBe(true);
                xValue = titleElement.getAttribute('x');
                expect(xValue === '150').toBe(true);
                yValue = titleElement.getAttribute('y');
                expect(yValue === '254.989169209323' || yValue === '255.23433900949567').toBe(true);
                backArrow = getElement('container_chart_legend_pageup');
                path = backArrow.getAttribute('d');
                expect(path === 'M 44 267.489169209323 L 36 271.489169209323 L 44 275.489169209323 L 44 273.489169209323 L 40 271.489169209323 L44 269.489169209323 Z' ||
                    path === 'M 48.5 267.73433900949567 L 40.5 271.73433900949567 L 48.5 275.73433900949567 L 48.5 273.73433900949567 L 44.5 271.73433900949567 L48.5 269.73433900949567 Z').toBe;
                fontArrow = getElement('container_chart_legend_pagedown');
                path = fontArrow.getAttribute('d');
                expect(path === 'M 256 267.489169209323 L 264 271.489169209323 L 256 275.489169209323 L 256 273.489169209323 L 260 271.489169209323 L256 269.489169209323 Z'||
                    path === 'M 251.5 267.73433900949567 L 259.5 271.73433900949567 L 251.5 275.73433900949567 L 251.5 273.73433900949567 L 255.5 271.73433900949567 L251.5 269.73433900949567 Z').toBe;
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
                expect(xValue === '26.5' || xValue === '32').toBe(true);
                yValue = titleElement.getAttribute('y');
                expect(yValue === '276.21622576014306' || yValue === '275.21501821018626').toBe(true);
                backArrow = getElement('container_chart_legend_pageup');
                path = backArrow.getAttribute('d');
                expect(path === 'M 97.5 267.46622576014306 L 89.5 271.46622576014306 L 97.5 275.46622576014306 L 97.5 273.46622576014306 L 93.5 271.46622576014306 L97.5 269.46622576014306 Z' ||
                    path === 'M 98 267.71501821018626 L 90 271.71501821018626 L 98 275.71501821018626 L 98 273.71501821018626 L 94 271.71501821018626 L98 269.71501821018626 Z').toBe;
                fontArrow = getElement('container_chart_legend_pagedown');
                path = fontArrow.getAttribute('d');
                expect(path === 'M 261.5 267.46622576014306 L 269.5 271.46622576014306 L 261.5 275.46622576014306 L 261.5 273.46622576014306 L 265.5 271.46622576014306 L261.5 269.46622576014306 Z' ||
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
                expect(xValue === '214.5' || xValue === '214').toBe(true);
                yValue = titleElement.getAttribute('y');
                expect(yValue === '276.21622576014306' || yValue === '275.21501821018626').toBe(true);
                backArrow = getElement('container_chart_legend_pageup');
                path = backArrow.getAttribute('d');
                expect(path === 'M 38.5 267.46622576014306 L 30.5 271.46622576014306 L 38.5 275.46622576014306 L 38.5 273.46622576014306 L 34.5 271.46622576014306 L38.5 269.46622576014306 Z' ||
                    path === 'M 44 267.71501821018626 L 36 271.71501821018626 L 44 275.71501821018626 L 44 273.71501821018626 L 40 271.71501821018626 L44 269.71501821018626 Z').toBe;
                fontArrow = getElement('container_chart_legend_pagedown');
                path = fontArrow.getAttribute('d');
                expect(path === 'M 197.5 267.46622576014306 L 205.5 271.46622576014306 L 197.5 275.46622576014306 L 197.5 273.46622576014306 L 201.5 271.46622576014306 L197.5 269.46622576014306 Z' ||
                    path === 'M 197 267.71501821018626 L 205 271.71501821018626 L 197 275.71501821018626 L 197 273.71501821018626 L 201 271.71501821018626 L197 269.71501821018626 Z').toBe;
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
                expect(xValue === '26.5' || xValue === '32').toBe(true);
                yValue = titleElement.getAttribute('y');
                expect(yValue === '37.25' || yValue === '36').toBe(true);
                backArrow = getElement('container_chart_legend_pageup');
                path = backArrow.getAttribute('d');
                expect(path === 'M 97.5 28.5 L 89.5 32.5 L 97.5 36.5 L 97.5 34.5 L 93.5 32.5 L97.5 30.5 Z' ||
                    path === 'M 98 28.5 L 90 32.5 L 98 36.5 L 98 34.5 L 94 32.5 L98 30.5 Z').toBe;
                fontArrow = getElement('container_chart_legend_pagedown');
                path = fontArrow.getAttribute('d');
                expect(path === 'M 261.5 28.5 L 269.5 32.5 L 261.5 36.5 L 261.5 34.5 L 265.5 32.5 L261.5 30.5 Z' ||
                    path === 'M 256 28.5 L 264 32.5 L 256 36.5 L 256 34.5 L 260 32.5 L256 30.5 Z').toBe;
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
                expect(xValue === '214.5' || xValue === '214').toBe(true);
                yValue = titleElement.getAttribute('y');
                expect(yValue === '37.25' || yValue === '36').toBe(true);
                backArrow = getElement('container_chart_legend_pageup');
                path = backArrow.getAttribute('d');
                expect(path === 'M 38.5 28.5 L 30.5 32.5 L 38.5 36.5 L 38.5 34.5 L 34.5 32.5 L38.5 30.5 Z' ||
                    path === 'M 44 28.5 L 36 32.5 L 44 36.5 L 44 34.5 L 40 32.5 L44 30.5 Z').toBe;
                fontArrow = getElement('container_chart_legend_pagedown');
                path = fontArrow.getAttribute('d');
                expect(path === 'M 197.5 28.5 L 205.5 32.5 L 197.5 36.5 L 197.5 34.5 L 201.5 32.5 L197.5 30.5 Z' ||
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