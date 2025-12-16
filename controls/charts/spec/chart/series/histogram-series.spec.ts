
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
import  {profile , inMB, getMemoryProfile} from '../../common.spec';
import { ILoadedEventArgs, IAnimationCompleteEventArgs, IPointRenderEventArgs } from '../../../src/chart/model/chart-interface';
import { Export} from '../../../src/chart/print-export/export';

Chart.Inject(ColumnSeries, Tooltip, Crosshair, DataLabel,HistogramSeries, Export);



describe('Chart Control', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
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

                let crosshair: Element = <Element>document.getElementById('container_svg').childNodes[5];
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
         it('Checking with animation', async (): Promise<void> => {
            animationComplete = (args: IAnimationCompleteEventArgs): void => {
                let point = document.getElementById('container_Series_' + args.series.index + '_Point_0');
                expect(point.getAttribute('transform') === 'translate(0,0)').toBe(true);
                let elem: HTMLElement = document.getElementById('container_Series_' + args.series.index + '_NDLine');
                expect(elem.style.visibility).toBe('hidden');
                //done();
            };
            chartObj.series[0].showNormalDistribution = true;
            chartObj.series[0].animation.enable = true;
            chartObj.animationComplete = animationComplete;
            chartObj.refresh();
            await wait(500);

        });
        it('Checking animation with duration as zero', async (): Promise<void> => {
            animationComplete = (args: IAnimationCompleteEventArgs): void => {
                let point = document.getElementById('container_Series_' + args.series.index + '_Point_0');
                expect(point !== null).toBe(true);
                //done();
            };
            chartObj.series[0].showNormalDistribution = true;
            chartObj.series[0].animation.enable = true;
            chartObj.series[0].animation.duration = 0;
            chartObj.animationComplete = animationComplete;
            chartObj.refresh();
            await wait(500);
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
        it('Checking a XLSX export', (): void => {
            chartObj.loaded = (args: Object): void => {
                const element: Element = document.getElementById('container');
                expect(element.childElementCount).toBeGreaterThanOrEqual(1);
            };
            chartObj.enableExport = true
            chartObj.export('XLSX', 'Chart');
            chartObj.refresh();
        });
    });

    describe('Histogram Series Checking animation on data chages.', () => {
        let chartObj: Chart;
        let loaded: EmitType<ILoadedEventArgs>;
        let element: HTMLElement;
        let chartData: Object[] = [];
        let points: number[] = [5.250, 7.750, 0, 8.275, 9.750, 7.750, 8.275, 6.250, 5.750,
            5.250, 23.000, 26.500, 27.750, 25.025, 26.500, 26.500, 28.025, 29.250, 26.750, 27.250,
            26.250, 25.250, 34.500, 25.625, 25.500, 26.625, 36.275, 36.250, 26.875, 40.000, 43.000,
            46.500, 47.750, 45.025, 56.500, 56.500, 58.025, 59.250, 56.750, 57.250,
            46.250, 55.250, 44.500, 45.525, 55.500, 46.625, 46.275, 56.250, 46.875, 43.000,
            46.250, 55.250, 44.500, 45.425, 55.500, 56.625, 46.275, 56.250, 46.875, 43.000,
            46.250, 55.250, 44.500, 45.425, 55.500, 46.625, 56.275, 46.250, 56.875, 41.000, 63.000,
            66.500, 67.750, 65.025, 66.500, 76.500, 78.025, 79.250, 76.750, 77.250,
            66.250, 75.250, 74.500, 65.625, 75.500, 76.625, 76.275, 66.250, 66.875, 80.000, 85.250,
            87.750, 89.000, 88.275, 89.750, 97.750, 98.275, 96.250, 95.750, 95.250
        ];
        points.map((value: number) => {
            chartData.push({
                y: value
            });
        });
        beforeAll(() => {
            element = createElement('div', { id: 'HistogramContainer' });
            document.body.appendChild(element);
            chartObj = new Chart(
                {
                    primaryXAxis: {
                        majorGridLines: { width: 0 }, title: 'Score of Final Examination',
                        minimum: 0, maximum: 100, edgeLabelPlacement: 'Shift'
                    },
                    chartArea: { border: { width: 0 } },
                    legendSettings: { visible: false },
                    primaryYAxis: {
                        title: 'Number of Students',
                        minimum: 0, maximum: 50, interval: 10,
                        lineStyle: { width: 0 }
                    },
                    series: [
                        {
                            type: 'Histogram', width: 2, yName: 'y',
                            dataSource: chartData, binInterval: 20,
                            marker: { visible: true, height: 7, width: 7, dataLabel: { visible: true, position: 'Top', font: { fontWeight: '600', color: '#ffffff' } } },
                            showNormalDistribution: true, columnWidth: 0.99
                        }
                    ],
                    width: '75%',
                    title: 'Examination Result', tooltip: { enable: true },
                });
            chartObj.appendTo('#HistogramContainer');
        });
        afterAll((): void => {
            chartObj.destroy();
            element.remove();
        });
        it('Checking Histrogram series updated direction.', (done: Function) => {
            loaded = (args: Object): void => {
                let seriesElement: Element = document.getElementById('HistogramContainer_Series_0_Point_2');
                expect(seriesElement.getAttribute('d') == 'M 206.01375000000002 63.09000000000002 Q 206.01375000000002 63.09000000000002 206.01375000000002 63.09000000000002 L 307.73625 63.09000000000002 Q 307.73625 63.09000000000002 307.73625 63.09000000000002 L 307.73625 350.5 Q 307.73625 350.5 307.73625 350.5 L 206.01375000000002 350.5 Q 206.01375000000002 350.5 206.01375000000002 350.5 L 206.01375000000002 63.09000000000002 Z'
                || seriesElement.getAttribute('d') == 'M 199.99875 63.09000000000002 Q 199.99875 63.09000000000002 199.99875 63.09000000000002 L 298.75124999999997 63.09000000000002 Q 298.75124999999997 63.09000000000002 298.75124999999997 63.09000000000002 L 298.75124999999997 350.5 Q 298.75124999999997 350.5 298.75124999999997 350.5 L 199.99875 350.5 Q 199.99875 350.5 199.99875 350.5 L 199.99875 63.09000000000002 Z'
                || seriesElement.getAttribute('d') == 'M 194.58525 63.09000000000002 Q 194.58525 63.09000000000002 194.58525 63.09000000000002 L 290.66474999999997 63.09000000000002 Q 290.66474999999997 63.09000000000002 290.66474999999997 63.09000000000002 L 290.66474999999997 350.5 Q 290.66474999999997 350.5 290.66474999999997 350.5 L 194.58525 350.5 Q 194.58525 350.5 194.58525 350.5 L 194.58525 63.09000000000002 Z').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].setData(chartData);
            chartObj.refresh();
        });
        it('Checking Histrogram series x axis minimum', (done: Function) => {
            loaded = (args: Object): void => {
                let seriesElement: Element = document.getElementById('HistogramContainer_Series_0_Point_2');
                expect(seriesElement.getAttribute('d') == 'M 171.82083333333333 63.09000000000002 Q 171.82083333333333 63.09000000000002 171.82083333333333 63.09000000000002 L 284.8458333333333 63.09000000000002 Q 284.8458333333333 63.09000000000002 284.8458333333333 63.09000000000002 L 284.8458333333333 350.5 Q 284.8458333333333 350.5 284.8458333333333 350.5 L 171.82083333333333 350.5 Q 171.82083333333333 350.5 171.82083333333333 350.5 L 171.82083333333333 63.09000000000002 Z'
                || seriesElement.getAttribute('d') == 'M 166.80416666666667 63.09000000000002 Q 166.80416666666667 63.09000000000002 166.80416666666667 63.09000000000002 L 276.52916666666664 63.09000000000002 Q 276.52916666666664 63.09000000000002 276.52916666666664 63.09000000000002 L 276.52916666666664 350.5 Q 276.52916666666664 350.5 276.52916666666664 350.5 L 166.80416666666667 350.5 Q 166.80416666666667 350.5 166.80416666666667 350.5 L 166.80416666666667 63.09000000000002 Z'
                || seriesElement.getAttribute('d') == 'M 162.28916666666666 63.09000000000002 Q 162.28916666666666 63.09000000000002 162.28916666666666 63.09000000000002 L 269.0441666666666 63.09000000000002 Q 269.0441666666666 63.09000000000002 269.0441666666666 63.09000000000002 L 269.0441666666666 350.5 Q 269.0441666666666 350.5 269.0441666666666 350.5 L 162.28916666666666 350.5 Q 162.28916666666666 350.5 162.28916666666666 350.5 L 162.28916666666666 63.09000000000002 Z').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.minimum = 10;
            chartObj.primaryXAxis.maximum = null;
            chartObj.series[0].showNormalDistribution = true;
            chartObj.series[0].animation = { enable: true, duration: 1000 };
            chartObj.refresh();
        });
        it('Histogram - Checking addPoint', (done: Function) => {
            loaded = (args: Object): void => {
                let seriesElement: Element = document.getElementById('HistogramContainer_Series_0_Point_2');
                expect(seriesElement.getAttribute('d') == 'M 171.82083333333333 56.08000000000001 Q 171.82083333333333 56.08000000000001 171.82083333333333 56.08000000000001 L 284.8458333333333 56.08000000000001 Q 284.8458333333333 56.08000000000001 284.8458333333333 56.08000000000001 L 284.8458333333333 350.5 Q 284.8458333333333 350.5 284.8458333333333 350.5 L 171.82083333333333 350.5 Q 171.82083333333333 350.5 171.82083333333333 350.5 L 171.82083333333333 56.08000000000001 Z'
                || seriesElement.getAttribute('d') == 'M 166.80416666666667 56.08000000000001 Q 166.80416666666667 56.08000000000001 166.80416666666667 56.08000000000001 L 276.52916666666664 56.08000000000001 Q 276.52916666666664 56.08000000000001 276.52916666666664 56.08000000000001 L 276.52916666666664 350.5 Q 276.52916666666664 350.5 276.52916666666664 350.5 L 166.80416666666667 350.5 Q 166.80416666666667 350.5 166.80416666666667 350.5 L 166.80416666666667 56.08000000000001 Z'
                || seriesElement.getAttribute('d') == 'M 162.28916666666666 56.08000000000001 Q 162.28916666666666 56.08000000000001 162.28916666666666 56.08000000000001 L 269.0441666666666 56.08000000000001 Q 269.0441666666666 56.08000000000001 269.0441666666666 56.08000000000001 L 269.0441666666666 350.5 Q 269.0441666666666 350.5 269.0441666666666 350.5 L 162.28916666666666 350.5 Q 162.28916666666666 350.5 162.28916666666666 350.5 L 162.28916666666666 56.08000000000001 Z').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].addPoint({ y: 50 });
            chartObj.refresh();
        });
        it('Histogram - Checking canvas Mode', (done: Function) => {
            loaded = (args: Object): void => {
                expect(document.querySelectorAll('canvas')[0].height).toBe(450);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.enableCanvas = true;
            chartObj.primaryXAxis.maximum = 50;
            chartObj.refresh();
        });
    });
    describe('Histogram Series: Checking single point', () => {
        let chartObj: Chart;
        let loaded: EmitType<ILoadedEventArgs>;
        let element: HTMLElement;
        let chartData: Object[] = [];
        let points: number[] = [5.250, 6];
        points.map((value: number) => {
            chartData.push({
                y: value
            });
        });
        beforeAll(() => {
            element = createElement('div', { id: 'HistogramContainer' });
            document.body.appendChild(element);
            chartObj = new Chart(
                {
                    primaryXAxis: {
                        majorGridLines: { width: 0 }, title: 'Score of Final Examination',
                         edgeLabelPlacement: 'Shift', maximum: 3
                    },
                    chartArea: { border: { width: 0 } },
                    legendSettings: { visible: false },
                    primaryYAxis: {
                        title: 'Number of Students',
                        minimum: 0, maximum: 50, interval: 10,
                        lineStyle: { width: 0 }
                    },
                    series: [
                        {
                            type: 'Histogram', width: 2, yName: 'y',
                            dataSource: chartData,
                            marker: { visible: true, height: 7, width: 7, dataLabel: { visible: true, position: 'Top', font: { fontWeight: '600', color: '#ffffff' } } },
                            showNormalDistribution: true, columnWidth: 0.99
                        }
                    ],
                    width: '75%',
                    title: 'Examination Result', tooltip: { enable: true },
                });
            chartObj.appendTo('#HistogramContainer');
        });
        afterAll((): void => {
            chartObj.destroy();
            element.remove();
        });
        it('Histogram - Checking series and axis with minimum values', (done: Function) => {
            loaded = (args: Object): void => {
                let seriesElement: Element = document.getElementById('HistogramContainer_svg');
                expect(seriesElement !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.maximum = 3;
            chartObj.refresh();
        });
        it('Histogram - Checking series checking without data', (done: Function) => {
            loaded = (args: Object): void => {
                let seriesElement: Element = document.getElementById('HistogramContainer_svg');
                expect(seriesElement !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource = [];
            chartObj.refresh();
        });
    });
    async function wait(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
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

export interface series1 {
    series: Series;
}