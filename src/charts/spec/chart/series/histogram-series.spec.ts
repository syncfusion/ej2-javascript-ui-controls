
/**
 * Specifies the Histogram series spec.
 */
import { createElement, remove } from '@syncfusion/ej2-base';
import { Chart } from '../../../src/chart/chart';
import { Axis } from '../../../src/chart/axis/axis'; 
import { Series, Points } from '../../../src/chart/series/chart-series';
import { HistogramSeries } from '../../../src/chart/series/histogram-series';
import { ColumnSeries } from '../../../src/chart/series/column-series';
import { Tooltip } from '../../../src/chart/user-interaction/tooltip';
import { Crosshair } from '../../../src/chart/user-interaction/crosshair';
import { DataLabel } from '../../../src/chart/series/data-label';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { unbindResizeEvents } from '../base/data.spec';
import { MouseEvents } from '../base/events.spec';
import { bar } from '../base/data.spec';
import { EmitType } from '@syncfusion/ej2-base';
import { ILoadedEventArgs, IAnimationCompleteEventArgs, IPointRenderEventArgs } from '../../../src/common/model/interface';

Chart.Inject(ColumnSeries, Tooltip, Crosshair, DataLabel,HistogramSeries);



describe('Chart Control', () => {
    describe('Chart Histogram series', () => {
        let chartObj: Chart;
        let elem: HTMLElement;
        let point: HTMLElement;
        let histo: HTMLElement;
        let svg: HTMLElement;
        let targetElement: HTMLElement;
        let loaded: EmitType<ILoadedEventArgs>;
        let done: Function;
        let dataLabel: HTMLElement;
        let trigger: MouseEvents = new MouseEvents();
        let x: number;
        let y: number;
        let animationComplete: EmitType<IAnimationCompleteEventArgs>;
        let values: number[] = [23,34,23,45,56,67,12,12,43,34,23,34,23,45,56,67,12,12,43,34,23,34,23,45,56,67,12,12,43,34
                                ,23,34,23,45,56,67,12,12,43,34,23,34,23,45,56,67,12,12,43,34];
        let chartData: Object[] = [];
        for(let i: number=0; i< values.length; i++) {
        chartData.push(
        { y: values[i] }
        );
        }
        beforeAll(() => {
            elem = createElement('div', { id: 'container' });
            document.body.appendChild(elem);
            chartObj = new Chart(
                {
                    series: [{
                     dataSource: chartData, yName: 'y', animation: { enable: false },
                      type:'Histogram',
                      name: 'AgeCollections', fill: 'rgba(135,206,235,1)',
                    },
                    ], width: '800',
                    tooltip: { enable: true, textStyle: { size: '12px' }},
                    legendSettings: { visible: false },
                    title: 'Histogram agecollections'
                });
            chartObj.appendTo('#container');

        });

        afterAll((): void => {
            chartObj.destroy();
            elem.remove();
        });
        it('Checking with default histogram series', (done: Function) => {
            loaded = (args: Object): void => {
                histo = document.getElementById('container_Series_0_Point_0');
                expect(histo != null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].type = 'Histogram';
            chartObj.refresh();
        });
          it('Checking with series visibility', (done: Function) => {
            loaded = (args: Object): void => {
                histo = document.getElementById('container_Series_0_Point_0');
                expect(histo != null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].type = 'Histogram';
            chartObj.refresh();
        });
        it('Checking with numeric axis', (done: Function) => {
            loaded = (args: Object): void => {
              svg = document.getElementById('container_Series_0_Point_3');
               expect(svg.getAttribute('d') != '').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource = chartData;
            chartObj.primaryXAxis.valueType = 'Double';
            chartObj.refresh();
        });
        it('Checking with default interval', (done: Function) => {
            loaded = (args: Object): void => {
                let svg1: HTMLElement = document.getElementById('container_Series_0_Point_0');
                expect(svg1 != null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Checking with given interval', (done: Function) => {
            loaded = (args: Object): void => {
                let svg1: HTMLElement = document.getElementById('container_Series_0_Point_0');
                expect(svg1 != null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.interval = 4;
            chartObj.refresh();
        });
         it('Checking with X-axis inversed', (done: Function) => {
            loaded = (args: Object): void => {
                let point1 : HTMLElement = document.getElementById('container_Series_0_Point_0');
                expect(point1 != null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.isInversed = true;
            chartObj.primaryXAxis.valueType = 'Double';
            chartObj.refresh();
        });
        it('Checking with Y-axis inversed', (done: Function) => {
            loaded = (args: Object): void => {
                let svg1: HTMLElement = document.getElementById('container_Series_0_Point_0');
                expect(svg1 != null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryYAxis.isInversed = true;
            chartObj.refresh();
        });
        it('Checking with opposed position', (done: Function) => {
            loaded = (args: Object): void => {
                let svg1: HTMLElement = document.getElementById('container_Series_0_Point_0');
                expect(svg1 != null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.opposedPosition = true;
            chartObj.refresh();
           });
         it('checking with border', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container_Series_0_Point_1');
                expect(svg.getAttribute('stroke') === 'red').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].border.color = 'red';
            chartObj.series[0].border.width = 2;
            chartObj.primaryXAxis.opposedPosition = false;
            chartObj.primaryYAxis.isInversed = false;
            chartObj.refresh();
        });
         it('checking with point fill', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container_Series_0_Point_1');
                expect(svg.getAttribute('stroke') === 'red').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].fill = 'red';
            chartObj.refresh();
        });
        it('checking with default Tooltip', (done: Function) => {
            loaded = (args: Object): void => {
                let target: HTMLElement = document.getElementById('container_Series_0_Point_1');
                let series: Series = <Series>chartObj.series[0];

                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                y = series.points[1].regions[0].y + parseFloat(chartArea.getAttribute('y')) + elem.offsetTop;
                x = series.points[1].regions[0].x + parseFloat(chartArea.getAttribute('x')) + elem.offsetLeft;
                trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));

                let tooltip: HTMLElement = document.getElementById('container_tooltip');
                expect(tooltip != null).toBe(true);
                expect(target.getAttribute('opacity') == '0.5').toBe(true);
                expect(parseFloat(tooltip.style.left) > series.points[1].regions[0].y + parseFloat(chartArea.getAttribute('y')));

                target = document.getElementById('container_Series_0_Point_3');
                series = <Series>chartObj.series[0];

                y = series.points[3].regions[0].y + parseFloat(chartArea.getAttribute('y')) + 30 + elem.offsetTop;
                x = series.points[3].regions[0].x + parseFloat(chartArea.getAttribute('x')) + elem.offsetLeft;
                trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));

                tooltip = document.getElementById('container_tooltip');
                expect(tooltip != null).toBe(true);
                expect(target.getAttribute('opacity') == '0.5').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].type = 'Histogram';
            chartObj.primaryXAxis.valueType = 'Double';
            chartObj.series[0].dataSource = chartData;
            chartObj.refresh();
        });
        it('checking with track ball', (done: Function) => {
            loaded = (args: Object): void => {
                let target: HTMLElement = document.getElementById('container_Series_0_Point_2');
                let series: Series = <Series>chartObj.series[0];

                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                series = <Series>chartObj.series[0];

                y = series.points[3].regions[0].y + parseFloat(chartArea.getAttribute('y')) + 30 + elem.offsetTop;
                x = series.points[3].regions[0].x + parseFloat(chartArea.getAttribute('x')) + elem.offsetLeft;
                trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));

                let tooltip: HTMLElement = document.getElementById('container_tooltip');
                expect(tooltip != null).toBe(true);
                expect(target.getAttribute('opacity') == '1').toBe(true);
                done();
            };
            chartObj.series[0].type = 'Histogram';
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.crosshairTooltip.enable = true;
            chartObj.primaryYAxis.crosshairTooltip.enable = true;
            chartObj.primaryXAxis.valueType = 'Double';
            chartObj.crosshair.enable = true;
            chartObj.tooltip.shared = true;
            chartObj.refresh();
        });
        it('checking with cross hair', (done: Function) => {
            loaded = (args: Object): void => {
                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                let series: Series = <Series>chartObj.series[0];

                y = series.points[2].regions[0].y + parseFloat(chartArea.getAttribute('y')) + elem.offsetTop;
                x = series.points[2].regions[0].x + series.points[2].regions[0].width / 2 + parseFloat(chartArea.getAttribute('x')) + elem.offsetLeft;
                trigger.mousemovetEvent(chartArea, Math.ceil(x), Math.ceil(y));

                let crosshair: Element = <Element>document.getElementById('container_svg').childNodes[4];
                let element1: HTMLElement;
                expect(crosshair.childNodes.length == 3).toBe(true);
                element1 = <HTMLElement>crosshair.childNodes[0];
                expect(element1.getAttribute('d').indexOf(chartArea.getAttribute('x')) > 0).toBe(true);
                element1 = <HTMLElement>crosshair.childNodes[1];
                expect(element1.getAttribute('d').indexOf(chartArea.getAttribute('y')) > 0).toBe(true);
                expect(crosshair.childNodes[2].childNodes.length == 4).toBe(true);
                element1 = <HTMLElement>crosshair.childNodes[2].childNodes[0];
                expect(element1.getAttribute('d') !== '').toBe(true);
                element1 = <HTMLElement>crosshair.childNodes[2].childNodes[2];
                expect(element1.getAttribute('d') !== '').toBe(true);
                done();
            }
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource = chartData;
            chartObj.series[0].type = 'Histogram';
            chartObj.primaryXAxis.valueType = 'Double';
            chartObj.crosshair.enable = true;
            chartObj.refresh();
        });
         it('checking with legend visbility', (done: Function) => {
            loaded = (args: Object): void => {
                let svg1: HTMLElement = document.getElementById('container_Series_0_Point_0');
                expect(svg1 != null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.legendSettings.visible = true;
            chartObj.refresh();
        });
           it('Checking with normal distribution', (done: Function) => {
            loaded = (args: Object): void => {
                histo = document.getElementById('container_Series_0_Point_0');
                expect(histo != null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].type = 'Histogram';
            chartObj.series[0].showNormalDistribution = true;
            chartObj.refresh();
        });
         it('checking with bin interval', (done: Function) => {
           loaded = (args: Object): void => {
              svg = document.getElementById('container_Series_0_Point_2');
              expect(svg.getAttribute('d') != '').toBe(true);
              done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.valueType = 'Double';
            chartObj.series[0].dataSource = chartData;
            chartObj.series[0].binInterval = 4;
            chartObj.refresh();
        }); 
         it('Checking with normal distribution is transposed', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container_Series_0_Point_2');
                expect(svg.getAttribute('d') != '').toBe(true);
                histo = document.getElementById('container_Series_0_Point_0');
                expect(histo != null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].type = 'Histogram';
            chartObj.series[0].showNormalDistribution = true;
            chartObj.isTransposed = true;
            chartObj.refresh();
        });
        it('checking with multiple axes and panes', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container_Series_0_Point_2');
                expect(svg.getAttribute('d') != '').toBe(true);
                histo = document.getElementById('container_Series_0_Point_0');
                expect(histo != null).toBe(true);
                done();
            };
            chartObj.primaryXAxis = { title: 'pyXAxis'};
            chartObj.loaded = loaded;
            chartObj.isTransposed = false;
            chartObj.rows = [ { height: '50%'}, { height: '50%'}];
            chartObj.axes = [{
            rowIndex: 1, opposedPosition: true,
            name: 'yAxis'
            }];
            chartObj.series = [
            {
                type: 'Histogram', animation : {enable : false}, dataSource:chartData,
                yName: 'y', name: 'Germany'
            },
            {
                type: 'Histogram', animation : {enable : false}, dataSource: chartData,
                yName: 'y', yAxisName: 'yAxis', name: 'Japan'
            }];
            chartObj.refresh();
        });
         it('Checking with animation', (done: Function) => {

            animationComplete = (args: IAnimationCompleteEventArgs): void => {
                let point = document.getElementById('container_Series_' + args.series.index + '_Point_0');
                expect(point.getAttribute('transform') === 'translate(0,0)').toBe(true);
                let elem: HTMLElement = document.getElementById('container_Series_' + args.series.index + '_NDLine');
                expect(elem.style.visibility).toBe('hidden');
                done();
            };
            chartObj.series[0].showNormalDistribution = true;
            chartObj.series[0].animation.enable = true;
            chartObj.animationComplete = animationComplete;
            chartObj.refresh();

        });
    });
    describe('Histogram Series with data label', () => {
        let chartObj: Chart;
        let loaded: EmitType<ILoadedEventArgs>;
        let animationComplete: EmitType<IAnimationCompleteEventArgs>;
        let element: HTMLElement;
         let values: number[] = [23,34,23,45,56,67,12,12,43,34,23,34,23,45,56,67,12,12,43,34,23,34,23,45,56,67,12,12,43,34
                                ,23,34,23,45,56,67,12,12,43,34,23,34,23,45,56,67,12,12,43,34];
        let chartData: Object[]=[];
        for(let i: number=0; i< values.length; i++) {
        chartData.push(
        { y: values[i] }
        );
        }
        beforeAll(() => {
            element = createElement('div', { id: 'container' });
            document.body.appendChild(element);
            chartObj = new Chart(
                {
                    primaryXAxis: { title: 'PrimaryXAxis' },
                    primaryYAxis: { title: 'PrimaryYAxis', rangePadding: 'Normal' },
                    series: [{
                        animation: { enable: false },
                        name: 'AgeCollections', dataSource:chartData, yName: 'y',
                        type: 'Histogram', 
                        fill: 'rgba(135,206,235,1)',
                        marker: { visible: false, dataLabel: { visible: true, fill: 'violet' } }
                    }],
                    width: '800',
                    title: 'Hisogram Age collections', loaded: loaded,
                    legendSettings: { visible: false }
                });
            chartObj.appendTo('#container');

        });
        afterAll((): void => {
            chartObj.destroy();
            element.remove();
        });
        it('With Label position Auto', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: number = +document.getElementById('container_Series_0_Point_1_TextShape_0').getAttribute('x');
                let point0Location = (<Points>(<Series>chartObj.series[0]).points[1]).symbolLocations[0].x;
                expect(svg < point0Location).toBe(true);
                let svg1: number = +document.getElementById('container_Series_0_Point_1_TextShape_0').getAttribute('x');
                let pointLocation1 = (<Points>(<Series>chartObj.series[0]).points[0]).symbolLocations[0].x;
                expect(svg > pointLocation1).toBe(true); done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.dataLabel.position = 'Auto';
            chartObj.refresh();

        });
        it('With Label position Bottom', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: number = +document.getElementById('container_Series_0_Point_1_TextShape_0').getAttribute('x');
                let point0Location: number = ((<Points>(<Series>chartObj.series[0]).points[1]).regions[0].x +
                    (<Points>(<Series>chartObj.series[0]).points[1]).regions[0].width);
                expect(svg < point0Location).toBe(true);
                let svg1: number = +document.getElementById('container_Series_0_Point_0_TextShape_0').getAttribute('x');
                let point0Location1 = (<Points>(<Series>chartObj.series[0]).points[0]).regions[0].x;
                expect(svg1 > point0Location1).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.dataLabel.position = 'Bottom';
            chartObj.refresh();

        });
        it('Color saturation with data label fill color', (done: Function) => {
            loaded = (args: ILoadedEventArgs): void => {
                let element: HTMLElement = document.getElementById('container_Series_0_Point_1_TextShape_0');
                expect(element.getAttribute('fill') === 'red').toBe(true); 
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.dataLabel.fill = 'red';
            chartObj.series[0].marker.dataLabel.position = 'Outer';
            chartObj.series[0].type = 'Histogram';
            chartObj.refresh();

        });
        it('Checking Events', (done: Function) => {
            loaded = (args: Object): void => {
                let element: HTMLElement = document.getElementById('container_Series_0_Point_2');
                expect(element.getAttribute('fill') == 'brown').toBe(true);
                done();
            };
            chartObj.pointRender = (args: IPointRenderEventArgs) => {
                if (args.point.index === 2) {
                    args.fill = 'brown';
                }
            };
            chartObj.loaded = loaded;
            chartObj.title = 'Events Changed';
            chartObj.dataBind();
        });
    });
});

export interface series1 {
    series: Series;
}