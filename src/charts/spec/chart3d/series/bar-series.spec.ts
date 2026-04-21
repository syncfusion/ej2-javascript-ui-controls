/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Bar Series Spec
 */
import { EmitType, createElement } from '@syncfusion/ej2-base';
import { Chart3D } from '../../../src/chart3d/chart3D';
import { Chart3DLoadedEventArgs, Chart3DPointRenderEventArgs, Chart3DTextRenderEventArgs } from '../../../src/chart3d/model/chart3d-Interface';
import { ColumnSeries3D } from '../../../src/chart3d/series/column-series';
import { BarSeries3D } from '../../../src/chart3d/series/bar-series';
import { Category3D } from '../../../src/chart3d/axis/category-axis';
import { DateTime3D } from '../../../src/chart3d/axis/date-time-axis';
import { DateTimeCategory3D } from '../../../src/chart3d/axis/date-time-category-axis';
import { DataLabel3D } from '../../../src/chart3d/series/data-label';
import { profile, inMB, getMemoryProfile } from '../../common.spec';
import { Logarithmic3D } from '../../../src/chart3d/axis/logarithmic-axis';
import { Rect } from '@syncfusion/ej2-svg-base';
Chart3D.Inject(ColumnSeries3D, BarSeries3D, Category3D, DateTime3D, DataLabel3D, DateTimeCategory3D, Logarithmic3D);

describe('Bar Series', () => {

    let element: HTMLElement;
    /**
     * Default Bar Seriess
     */
    describe('Bar Series', () => {
        beforeAll(() => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log('Unsupported environment, window.performance.memory is unavailable');
                this.skip(); //Skips test (in Chai)
                return;
            }
        });
        let chartObj: Chart3D;
        let loaded: EmitType<Chart3DLoadedEventArgs>;
        let pointrender: EmitType<Chart3DPointRenderEventArgs>;
        element = createElement('div', { id: 'container' });
        beforeAll(() => {
            document.body.appendChild(element);
            chartObj = new Chart3D(
                {
                    primaryXAxis: { title: 'PrimaryXAxis', labelFormat: 'C' },
                    primaryYAxis: { title: 'PrimaryYAxis', rangePadding: 'Normal' },
                    series: [{
                        name: 'Series', dataSource: [],
                        type: 'Bar', fill: 'rgba(135,206,235,1)'
                    }],
                    width: '800',
                    title: 'Chart TS Title', loaded: loaded, legendSettings: { visible: false },
                    enableSideBySidePlacement: false,
                });
            chartObj.appendTo('#container');
        });

        afterAll((): void => {
            chartObj.destroy();
            document.getElementById('container').remove();
        });

        it('Default Series Type without data Points', (done: Function) => {
            loaded = (args: Object): void => {
                const xAxisLabel: HTMLElement = document.getElementById('container-0-axis-label-0');
                expect(xAxisLabel.textContent === '$0.00').toBe(true);
                const yAxisLabel: HTMLElement = document.getElementById('container-1-axis-label-1');
                expect(yAxisLabel.textContent === '0.5').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });

        it('Added data Source', (done: Function) => {
            loaded = (args: Object): void => {
                const svg: HTMLElement = document.getElementById('container-svg-0-region-series-0-point-0');
                expect(svg.getAttribute('d') !== '').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource = [{
                x: 1,
                y: 10
            }];
            chartObj.series[0].name = 'Changed';
            chartObj.series[0].xName = 'x';
            chartObj.series[0].yName = 'y';
            chartObj.refresh();
        });

        it('checking datasource in Chart', (done: Function) => {
            chartObj.series[0].dataSource = null;
            chartObj.loaded = (args: Object) => {
                const svg1: HTMLElement = document.getElementById('container-svg-0-region-series-0-point-0');
                expect(svg1.getAttribute('d') === 'M 85.08411214953271 98.98504672897207 L 85.08411214953271 98.98504672897207 L 692.3177570093458 98.98504672897207 L 692.3177570093458 336.43551401869144 L 85.08411214953271 336.43551401869144 '
            || svg1.getAttribute('d') === 'M 89.94392523364486 100.88037383177581 L 89.94392523364486 100.88037383177581 L 692.9252336448598 100.88037383177581 L 692.9252336448598 333.56822429906526 L 89.94392523364486 333.56822429906526 ').toBe(true);
                done();
            };
            chartObj.dataSource = [{
                x: 10,
                y: 10.5
            }];
            chartObj.refresh();
        });

        it('Single data point with range', (done: Function) => {
            loaded = (args: Object): void => {
                const svg: HTMLElement = document.getElementById('container-svg-0-region-series-0-point-0');
                expect(svg.getAttribute('d') !== '').toBe(true);
                const xAxisLabel: HTMLElement = document.getElementById('container-0-axis-label-0');
                expect(xAxisLabel.textContent === '$9.50').toBe(true);
                const yAxisLabel: HTMLElement = document.getElementById('container-1-axis-label-0');
                expect(yAxisLabel.textContent === '8').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.interval = 1;
            chartObj.primaryYAxis.minimum = 8;
            chartObj.primaryYAxis.maximum = 12;
            chartObj.primaryYAxis.interval = 1;
            chartObj.refresh();
        });

        it('Checking series visibility', (done: Function) => {
            loaded = (args: Object): void => {
                const seriesElements: Element = document.getElementById('container-svg-0-region-series-0-point-0');
                expect(seriesElements === null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].visible = false;
            chartObj.primaryYAxis.minimum = null;
            chartObj.primaryYAxis.maximum = null;
            chartObj.primaryYAxis.interval = null;
            chartObj.primaryXAxis.minimum = null;
            chartObj.primaryXAxis.maximum = null;
            chartObj.primaryXAxis.interval = null;
            chartObj.refresh();
        });

        it('with data source', (done: Function) => {
            loaded = (args: Object): void => {
                const seriesElements: Element = document.getElementById('container-svg-0-region-series-0-point-0');
                expect(seriesElements != null).toBe(true);
                expect(seriesElements.getAttribute('d') !== '').toBe(true);
                const seriesElements2: Element = document.getElementById('container-svg-0-region-series-0-point-1');
                expect(seriesElements2 != null).toBe(true);
                expect(seriesElements2.getAttribute('d') !== '').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].visible = true;
            chartObj.series[0].dataSource = [
                { x: 1000, y: 70 }, { x: 2000, y: 40 },
                { x: 3000, y: 70 }, { x: 4000, y: 60 },
                { x: 5000, y: 50 }, { x: 6000, y: 40 },
                { x: 7000, y: 40 }, { x: 8000, y: 70 }];
            chartObj.series[0].xName = 'x';
            chartObj.series[0].yName = 'y';
            chartObj.refresh();
        });

        it('with range', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.primaryXAxis.minimum = null;
                chartObj.primaryXAxis.maximum = null;
                chartObj.primaryXAxis.interval = null;
                const seriesElements: HTMLElement = document.getElementById('container-svg-0-region-series-0-point-0');
                const path: string = seriesElements.getAttribute('d');
                expect((path.match(/M/g) || []).length === 1).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.minimum = 0;
            chartObj.primaryXAxis.maximum = 10000;
            chartObj.primaryXAxis.interval = 1000;
            chartObj.refresh();
        });

        it('with dateTimeRange', (done: Function) => {
            loaded = (args: Object): void => {
                const seriesElements: HTMLElement = document.getElementById('container-svg-0-region-series-0-point-0');
                const stroke: string = seriesElements.getAttribute('stroke-width');
                expect(stroke).toBe('null');
                const labelElement: HTMLElement = document.getElementById('container-0-axis-label-3');
                expect(labelElement.textContent === '2006').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource = [
                { x: new Date(2000, 6, 11), y: 10 }, { x: new Date(2002, 3, 7), y: 30 },
                { x: new Date(2004, 3, 6), y: 15 }, { x: new Date(2006, 3, 30), y: 65 },
                { x: new Date(2008, 3, 8), y: 90 }, { x: new Date(2010, 3, 8), y: 85 }
            ];
            chartObj.primaryXAxis.valueType = 'DateTime';
            chartObj.primaryXAxis.labelFormat = null;
            chartObj.refresh();
        });

        it('with empty point(y Value)', (done: Function) => {
            loaded = (args: Object): void => {
                const seriesElements: HTMLElement = document.getElementById('container-svg-0-region-series-0-point-3');
                expect(seriesElements === null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            const dataSource: Object = [
                { x: '2000/6/1', y: 10 }, { x: '2002/3/7', y: 30 },
                { x: '2004/3/6', y: 15 }, { x: '2006/3/30', y: 65 },
                { x: '2008/3/8', y: 90 }, { x: '2010/3/8', y: 85 }
            ];
            dataSource[3].y = null;
            chartObj.series[0].dataSource = dataSource;
            chartObj.primaryXAxis.valueType = 'Category';
            chartObj.refresh();
        });

        it('with empty point(x Value)', (done: Function) => {
            loaded = (args: Object): void => {
                const seriesElements: HTMLElement = document.getElementById('container-svg-0-region-series-0-point-3');
                expect(seriesElements != null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            const dataSource: object = [
                { x: '2000/6/1', y: 10 }, { x: '2002/3/7', y: 30 },
                { x: '2004/3/6', y: 15 }, { x: '2006/3/30', y: 65 },
                { x: '2008/3/8', y: 90 }, { x: '2010/3/8', y: 85 }
            ];
            dataSource[3].y = 10;
            dataSource[3].x = null;

            chartObj.series[0].dataSource = dataSource;
            chartObj.refresh();
        });

        it('with empty point(x and y Value)', (done: Function) => {
            loaded = (args: Object): void => {
                const seriesElements: HTMLElement = document.getElementById('container-svg-0-region-series-0-point-3');
                expect(seriesElements != null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            const dataSource: object = [
                { x: '2000/6/1', y: 10 }, { x: '2002/3/7', y: 30 },
                { x: '2004/3/6', y: 15 }, { x: '2006/3/30', y: 65 },
                { x: '2008/3/8', y: 90 }, { x: '2010/3/8', y: 85 }];
            dataSource[3].y = null;
            dataSource[3].x = null;
            dataSource[5].y = null;
            dataSource[5].x = null;
            chartObj.series[0].dataSource = dataSource;
            chartObj.refresh();
        });

        it('with fill and opacity', (done: Function) => {
            loaded = (args: Object): void => {
                let seriesElements: HTMLElement = document.getElementById('container-svg-0-region-series-0-point-3');
                expect(seriesElements.getAttribute('fill') === '#ff0000').toBe(true);
                seriesElements = document.getElementById('container-svg-1-region-series-0-point-3');
                expect(seriesElements.getAttribute('fill') === '#ff0000').toBe(true);
                seriesElements = document.getElementById('container-svg-2-region-series-0-point-3');
                expect(seriesElements.getAttribute('fill') === '#E50000').toBe(true);
                seriesElements = document.getElementById('container-svg-3-region-series-0-point-3');
                expect(seriesElements.getAttribute('fill') === '#E50000').toBe(true);
                seriesElements = document.getElementById('container-svg-4-region-series-0-point-3');
                expect(seriesElements.getAttribute('fill') === '#B20000').toBe(true);
                seriesElements = document.getElementById('container-svg-5-region-series-0-point-3');
                expect(seriesElements.getAttribute('fill') === '#B20000').toBe(true);
                expect(seriesElements.getAttribute('opacity') === '0.6').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource = [
                { x: 1000, y: 70 }, { x: 2000, y: 40 },
                { x: 3000, y: 70 }, { x: 4000, y: 60 },
                { x: 5000, y: 50 }, { x: 6000, y: 40 },
                { x: 7000, y: 40 }, { x: 8000, y: 70 }];
            chartObj.series[0].fill = 'red';
            chartObj.series[0].opacity = 0.6;
            chartObj.refresh();
        });

        it('within xAxis range', (done: Function) => {
            loaded = (args: Object): void => {
                let seriesElements: Element = document.getElementById('container-svg-0-region-series-0-point-4');
                expect(seriesElements.getAttribute('d') !== null).toBe(true);
                seriesElements = document.getElementById('container-svg-0-region-series-0-point-5');
                expect(seriesElements.getAttribute('d') !== null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.valueType = 'Double';
            chartObj.primaryXAxis.minimum = 4500;
            chartObj.primaryXAxis.maximum = 6500;
            chartObj.primaryXAxis.interval = 500;
            chartObj.refresh();
        });

        it('Bar Series with negative', (done: Function) => {
            loaded = (args: Object): void => {
                const seriesElements: HTMLElement = document.getElementById('container-svg-0-region-series-0-point-1');
                expect(seriesElements.getAttribute('d') === 'M 193.45794392523365 292.28013088124175 L 193.45794392523365 292.28013088124175 L 369.14018691588785 292.28013088124175 L 369.14018691588785 328.2403137405243 L 193.45794392523365 328.2403137405243 '
                || seriesElements.getAttribute('d') === 'M 197.50778816199377 290.2984792188137 L 197.50778816199377 290.2984792188137 L 371.97507788161994 290.2984792188137 L 371.97507788161994 325.5373976654459 L 197.50778816199377 325.5373976654459 ').toBe(true);
                const seriesElement1: HTMLElement = document.getElementById('container-svg-0-region-series-0-point-3');
                expect(seriesElement1.getAttribute('d') === 'M 193.45794392523365 172.22408731954238 L 193.45794392523365 172.22408731954238 L 574.1028037383177 172.22408731954238 L 574.1028037383177 208.184270178825 L 193.45794392523365 208.184270178825 '
                || seriesElement1.getAttribute('d') === 'M 197.50778816199377 172.65043653084467 L 197.50778816199377 172.65043653084467 L 575.5202492211838 172.65043653084467 L 575.5202492211838 207.88935497747693 L 197.50778816199377 207.88935497747693 ').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource = [
                { x: new Date(2000, 6, 11), y: -10 }, { x: new Date(2002, 3, 7), y: 30 },
                { x: new Date(2004, 3, 6), y: -15 }, { x: new Date(2006, 3, 30), y: 65 },
                { x: new Date(2008, 3, 8), y: 90 }, { x: new Date(2010, 3, 8), y: 85 }
            ];
            chartObj.primaryXAxis.valueType = 'DateTime';
            chartObj.primaryXAxis.minimum = null;
            chartObj.primaryXAxis.maximum = null;
            chartObj.primaryXAxis.interval = null;
            chartObj.series[0].fill = 'red';
            chartObj.refresh();
        });

        it('Bar Series with Rotation', (done: Function) => {
            loaded = (args: Object): void => {
                const seriesElements: HTMLElement = document.getElementById('container-svg-0-region-series-0-point-3');
                expect(seriesElements.getAttribute('d') === 'M 198.55928824400945 180.22862996521485 L 198.55928824400945 180.22862996521485 L 491.93696537368186 168.27213323055636 L 491.93696537368186 206.9250784595185 L 198.55928824400945 210.73471828356315 '
                || seriesElements.getAttribute('d') === 'M 201.02830667616286 180.49050360243888 L 201.02830667616286 180.49050360243888 L 493.32257736930853 168.67439432572186 L 493.32257736930853 206.58977113650545 L 201.02830667616286 210.4519093852871 ').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.rotation = 45;
            chartObj.series[0].dataSource = [
                { x: new Date(2000, 6, 11), y: 10 }, { x: new Date(2002, 3, 7), y: 30 },
                { x: new Date(2004, 3, 6), y: 15 }, { x: new Date(2006, 3, 30), y: 65 },
                { x: new Date(2008, 3, 8), y: 90 }, { x: new Date(2010, 3, 8), y: 85 }
            ];
            chartObj.refresh();
        });

        it('Bar Series with Depth', (done: Function) => {
            loaded = (args: Object): void => {
                const seriesElements: HTMLElement = document.getElementById('container-svg-0-region-series-0-point-3');
                expect(seriesElements.getAttribute('d') === 'M 75.45813734713076 172.08087169427878 L 75.45813734713076 172.08087169427878 L 533.471495766698 172.08087169427878 L 533.471495766698 208.13863808762488 L 75.45813734713076 208.13863808762488 '
                || seriesElements.getAttribute('d') === 'M 80.33113828786453 172.5083778702981 L 80.33113828786453 172.5083778702981 L 535.1770460959548 172.5083778702981 L 535.1770460959548 207.84292258813292 L 80.33113828786453 207.84292258813292 ').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.rotation = 0;
            chartObj.depth = 45;
            chartObj.refresh();
        });

        it('Bar Series with perspectiveAngle', (done: Function) => {
            loaded = (args: Object): void => {
                const seriesElements: HTMLElement = document.getElementById('container-svg-0-region-series-0-point-3');
                expect(seriesElements.getAttribute('d') === 'M 209.71428571428572 193.97240298456612 L 209.71428571428572 193.97240298456612 L 478.25714285714287 193.97240298456612 L 478.25714285714287 215.1138291710674 L 209.71428571428572 215.1138291710674 '
                || seriesElements.getAttribute('d') === 'M 212.57142857142858 194.22305883956253 L 212.57142857142858 194.22305883956253 L 479.25714285714287 194.22305883956253 L 479.25714285714287 214.9404449592859 L 212.57142857142858 214.9404449592859 ').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.depth = 100;
            chartObj.perspectiveAngle = 180;
            chartObj.refresh();
        });

        it('Bar Series with Tilt', (done: Function) => {
            loaded = (args: Object): void => {
                const seriesElements: HTMLElement = document.getElementById('container-svg-0-region-series-0-point-3');
                expect(seriesElements.getAttribute('d') === 'M 77.4940192473562 204.93584446497638 L 77.4940192473562 204.93584446497638 L 532.6342164086323 204.93584446497638 L 530.190800482979 230.17545960687355 L 83.43529345869275 230.17545960687355 '
                || seriesElements.getAttribute('d') === 'M 82.40712079530823 205.2406374399598 L 82.40712079530823 205.2406374399598 L 534.2991839807645 205.2406374399598 L 531.8743528619435 229.97224808107518 L 88.14140058603091 229.97224808107518 ').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.perspectiveAngle = 90;
            chartObj.tilt = 45;
            chartObj.refresh();
        });

        it('Checking with multiple Bar series', (done: Function) => {
            loaded = (args: Object): void => {
                const seriesElements: HTMLElement = document.getElementById('container-svg-0-region-series-0-point-3');
                expect(seriesElements.getAttribute('d') === 'M 82.13636363636364 173.1698095310366 L 82.13636363636364 173.1698095310366 L 489.9442148760331 173.1698095310366 L 489.9442148760331 208.48560100166947 L 82.13636363636364 208.48560100166947 '
                || seriesElements.getAttribute('d') === 'M 86.9090909090909 173.58851874336014 L 86.9090909090909 173.58851874336014 L 491.89669421487605 173.58851874336014 L 491.89669421487605 208.19597055698895 L 86.9090909090909 208.19597055698895 ').toBe(true);
                const seriesElements1: HTMLElement = document.getElementById('container-svg-0-region-series-1-point-3');
                expect(seriesElements1.getAttribute('d') === 'M 91.48529411764706 174.69422689777082 L 91.48529411764706 174.69422689777082 L 517.7459893048127 174.69422689777082 L 517.7459893048127 208.9713186192674 L 91.48529411764706 208.9713186192674 '
            || seriesElements1.getAttribute('d') === 'M 96.11764705882354 175.10062113326134 L 96.11764705882354 175.10062113326134 L 519.4304812834224 175.10062113326134 L 519.4304812834224 208.69020671707747 L 96.11764705882354 208.69020671707747 ').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.tilt = 0;
            chartObj.series = [chartObj.series[0], {
                name: 'series1', type: 'Bar', fill: 'blue',
                animation: { enable: false },
                dataSource: [
                    { x: new Date(2000, 6, 11), y: 12 }, { x: new Date(2002, 3, 7), y: 35 },
                    { x: new Date(2004, 3, 6), y: 20 }, { x: new Date(2006, 3, 30), y: 70 },
                    { x: new Date(2008, 3, 8), y: 85 }, { x: new Date(2010, 3, 8), y: 92 }
                ],
                xName: 'x', yName: 'y'
            }];
            chartObj.refresh();
        });

        it('Checking with enableSideBySidePlacement', (done: Function) => {
            loaded = (args: Object): void => {
                const seriesElements: HTMLElement = document.getElementById('container-svg-0-region-series-0-point-3');
                expect(seriesElements.getAttribute('d') === 'M 84.5263157894737 191.96089629332099 L 84.5263157894737 191.96089629332099 L 489.2679425837321 191.96089629332099 L 489.2679425837321 207.7335129350923 L 84.5263157894737 207.7335129350923 '
                || seriesElements.getAttribute('d') === 'M 89.26315789473685 192.00737507374447 L 89.26315789473685 192.00737507374447 L 491.20574162679435 192.00737507374447 L 491.20574162679435 207.4636355078012 L 89.26315789473685 207.4636355078012 ').toBe(true);
                const seriesElements1: HTMLElement = document.getElementById('container-svg-0-region-series-1-point-3');
                expect(seriesElements1.getAttribute('d') === 'M 84.5263157894737 174.43576669135277 L 84.5263157894737 174.43576669135277 L 520.4019138755981 174.43576669135277 L 520.4019138755981 190.2083833331241 L 84.5263157894737 190.2083833331241 '
                || seriesElements1.getAttribute('d') === 'M 89.26315789473685 174.83375236923695 L 89.26315789473685 174.83375236923695 L 522.1244019138757 174.83375236923695 L 522.1244019138757 190.2900128032937 L 89.26315789473685 190.2900128032937 ').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.enableSideBySidePlacement = true;
            chartObj.refresh();
        });

        it('Checking Events', (done: Function) => {
            loaded = (args: Object): void => {
                let element: HTMLElement = document.getElementById('container-svg-0-region-series-0-point-2');
                expect(element.getAttribute('fill') === '#a52a2a').toBe(true);
                element = document.getElementById('container-svg-0-region-series-0-point-0');
                expect(element == null).toBe(true);
                done();
            };
            pointrender = (args: Chart3DPointRenderEventArgs): void => {
                if (args.point.index === 0) {
                    args.cancel = true;
                }
                if (args.point.index === 2) {
                    args.fill = 'brown';
                }
            };
            chartObj.pointRender = pointrender;
            chartObj.loaded = loaded;
            chartObj.title = 'Events Changed';
            chartObj.refresh();
        });
    });

    describe('Bar Series in Cylinderical shape', () => {
        let chartObj: Chart3D;
        let loaded: EmitType<Chart3DLoadedEventArgs>;
        const element: Element = createElement('div', { id: 'container' });
        beforeAll(() => {
            document.body.appendChild(element);
            chartObj = new Chart3D(
                {
                    primaryXAxis: { valueType: 'Category', interval: 1, majorGridLines: { width: 0 }, majorTickLines: { width: 0 }, minorTickLines: { width: 0 } },
                    primaryYAxis: { title: 'Medal Count', majorTickLines: { width: 0 }, maximum: 50, interval: 10 },
                    series: [{
                        name: 'Gold',
                        dataSource: [{ x: 'GBR', y: 27, tooltipMappingName: 'Great Britain' },
                            { x: 'CHN', y: 26, tooltipMappingName: 'China' },
                            { x: 'AUS', y: 8, tooltipMappingName: 'Australia' },
                            { x: 'RUS', y: 19, tooltipMappingName: 'Russia' },
                            { x: 'GER', y: 17, tooltipMappingName: 'Germany' },
                            { x: 'UA', y: 2, tooltipMappingName: 'Ukraine' },
                            { x: 'ES', y: 7, tooltipMappingName: 'Spain' },
                            { x: 'UZB', y: 4, tooltipMappingName: 'Uzbekistan' },
                            { x: 'JPN', y: 12, tooltipMappingName: 'Japan' },
                            { x: 'NL', y: 8, tooltipMappingName: 'NetherLand' },
                            { x: 'USA', y: 46, tooltipMappingName: 'United States' }],
                        xName: 'x', yName: 'y', columnFacet: 'Cylinder',
                        type: 'Bar', fill: 'skyblue'
                    }],
                    enableSideBySidePlacement: false,
                    width: '800', tooltip: { enable: true }, legendSettings: { visible: true },
                    title: 'Olympic Medal Counts - RIO', loaded: loaded
                });
            chartObj.appendTo('#container');
        });

        afterAll((): void => {
            chartObj.destroy();
            document.getElementById('container').remove();
        });

        it('Bar Series Type with ColumnFacet property as Cylinder', (done: Function) => {
            loaded = (args: Object): void => {
                const region1: string = document.getElementById('container-svg-21-region-series-0-point-1').getAttribute('d');
                expect(region1 === 'M 55.66313810520663 316.5482791627418 L 55.66313810520663 316.5482791627418 L 431.4268009165953 316.5482791627418 L 431.4031913755856 318.8373000426884 L 55.92182289096158 318.8373000426884 '
                    || region1 === 'M 55.72629558455716 312.6766189195281 L 55.72629558455716 312.6766189195281 L 431.4210366846771 312.6766189195281 L 431.3980309702604 314.91034078976827 L 55.978364369061566 314.91034078976827 ').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });

        it('Checking Cylindrical chart with negative points', (done: Function) => {
            loaded = (args: Object): void => {
                const region5: string = document.getElementById('container-svg-5-region-series-0-point-0').getAttribute('d');
                expect(region5 === 'M 163.32325267167215 210.97367523057503 L 163.32325267167215 210.97367523057503 L 377.1455195708105 210.97367523057503 L 377.1788817013422 208.52102969364364 L 163.66874468855121 208.52102969364364 '
                    || region5 === 'M 160.86772477439644 210.01697604981828 L 160.86772477439644 210.01697604981828 L 375.5510209362159 210.01697604981828 L 375.5867106572498 207.5657270671882 L 161.21680128064892 207.5657270671882 ').toBe(true);
                const region10: string = document.getElementById('container-svg-10-region-series-0-point-0').getAttribute('d');
                expect(region10 === 'M 163.66874468855121 196.57974686295063 L 163.66874468855121 196.57974686295063 L 377.1788817013422 196.57974686295063 L 377.1455195708105 194.06146327385682 L 163.32325267167215 194.06146327385682 '
                    || region10 === 'M 161.21680128064892 195.62444423649518 L 161.21680128064892 195.62444423649518 L 375.5867106572498 195.62444423649518 L 375.5510209362159 193.10476409310004 L 160.86772477439644 193.10476409310004 ').toBe(true);
                const region15: string = document.getElementById('container-svg-15-region-series-0-point-0').getAttribute('d');
                expect(region15 === 'M 161.2013882118587 190.6611934138298 L 161.2013882118587 190.6611934138298 L 376.9406236090499 190.6611934138298 L 376.88888888888886 191.7922509309789 L 160.66563307493539 191.7922509309789 '
                    || region15 === 'M 158.72384591124964 189.6959171928133 L 158.72384591124964 189.6959171928133 L 375.33182990735565 189.6959171928133 L 375.2764857881137 190.82480907051377 L 158.1825322997416 190.82480907051377 ').toBe(true);
                const region20: string = document.getElementById('container-svg-20-region-series-0-point-0').getAttribute('d');
                expect(region20 === 'M 159.54724818276216 202.15887850467288 L 159.54724818276216 202.15887850467288 L 376.78089304257526 202.15887850467288 L 376.7882848184185 205.30967934616507 L 159.62379603818061 205.30967934616507 '
                    || region20 === 'M 157.05254413291794 201.18691588785043 L 157.05254413291794 201.18691588785043 L 375.16095534787115 201.18691588785043 L 375.16886282900583 204.33802615251747 L 157.1298861744851 204.33802615251747 ').toBe(true);
                const region25: string = document.getElementById('container-svg-25-region-series-0-point-0').getAttribute('d');
                expect(region25 === 'M 161.2013882118587 213.97082419839398 L 161.2013882118587 213.97082419839398 L 376.9406236090499 213.97082419839398 L 376.9958847736625 214.4074074074074 L 161.7736625514403 214.4074074074074 '
                    || region25 === 'M 158.72384591124964 213.00554797737746 L 158.72384591124964 213.00554797737746 L 375.33182990735565 213.00554797737746 L 375.39094650205755 213.44444444444443 L 159.3020576131687 213.44444444444443 ').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource = [{ x: 'GBR', y: -27, tooltipMappingName: 'Great Britain' }];
            chartObj.refresh();
        });
    });

    describe('DataLabel', () => {
        let chartObj: Chart3D;
        let loaded: EmitType<Chart3DLoadedEventArgs>;
        element = createElement('div', { id: 'container' });
        beforeAll(() => {
            document.body.appendChild(element);
            chartObj = new Chart3D(
                {
                    primaryXAxis: { valueType: 'DateTime' },
                    primaryYAxis: { rangePadding: 'None' },
                    series: [{
                        dataSource: [
                            { x: new Date(2000, 6, 11), y: 10 }, { x: new Date(2002, 3, 7), y: 30 },
                            { x: new Date(2004, 3, 6), y: 15 }, { x: new Date(2006, 3, 30), y: 65 },
                            { x: new Date(2008, 3, 8), y: 90 }, { x: new Date(2010, 3, 8), y: 85 }],
                        xName: 'x', yName: 'y', name: 'India',
                        type: 'Bar', dataLabel: { visible: false }
                    }],
                    width: '800',
                    enableSideBySidePlacement: false,
                    title: 'Chart TS Title', loaded: loaded,
                    legendSettings: { visible: false }
                });
            chartObj.appendTo('#container');

        });

        afterAll((): void => {
            chartObj.destroy();
            element.remove();
        });

        it('Showing default datalabel', (done: Function) => {
            loaded = (args: Object): void => {
                const element: HTMLElement = document.getElementById('container-svg-series-0-point-3-data-label');
                expect(element.textContent === '65').toBe(true);
                done();
            };
            chartObj.series[0].dataLabel.visible = true;
            chartObj.loaded = loaded;
            chartObj.refresh();
        });

        it('Showing default datalabel text', (done: Function) => {
            loaded = (args: Object): void => {
                const element: HTMLElement = document.getElementById('container-svg-series-0-point-3-data-label');
                expect(element.textContent === '65').toBe(true);
                expect(element.getAttribute('fill')).toBe('#212529');
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataLabel.fill = '#E94649';
            chartObj.refresh();
        });

        it('checking visibility', (done: Function) => {
            loaded = (args: Object): void => {
                const element: HTMLElement = document.getElementById('container-svg-series-0-point-3-data-label');
                expect(element == null).toBe(true);
                done();
            };
            chartObj.series[0].dataLabel.visible = false;
            chartObj.loaded = loaded;
            chartObj.refresh();
        });

        it('Checking default data label position with multiple series', (done: Function) => {
            loaded = (args: Object): void => {
                const point0: number = +document.getElementById('container-svg-series-0-point-3-data-label').getAttribute('y');
                const point1: number = +document.getElementById('container-svg-series-0-point-3-data-label').getAttribute('x');
                const point2: number = +document.getElementById('container-svg-series-1-point-3-data-label').getAttribute('y');
                const point3: number = +document.getElementById('container-svg-series-1-point-3-data-label').getAttribute('x');
                const point4: number = +document.getElementById('container-svg-series-0-point-5-data-label').getAttribute('y');
                const point5: number = +document.getElementById('container-svg-series-0-point-5-data-label').getAttribute('x');
                const point6: number = +document.getElementById('container-svg-series-1-point-5-data-label').getAttribute('y');
                const point7: number = +document.getElementById('container-svg-series-1-point-5-data-label').getAttribute('x');
                expect(point0 === 209.15153872386327 || point0 === 210.33571974652904).toBe(true);
                expect(point1 === 303.2289719626168 || point1 === 304.50467289719626).toBe(true);
                expect(point2 === 189.98651290201067 || point2 === 191.3767694711479).toBe(true);
                expect(point3 === 189.93457943925233 || point3 === 191.51401869158877).toBe(true);
                expect(point4 === 85.06392496617637 || point4 === 87.5823814055914).toBe(true);
                expect(point5 === 393.86448598130835 || point5 === 394.8971962616822).toBe(true);
                expect(point6 === 65.89889914432374 || point6 === 68.62343113021032).toBe(true);
                expect(point7 === 99.29906542056075 || point7 === 101.12149532710282).toBe(true);
                done();
            };
            chartObj.series = [chartObj.series[0], {
                name: 'series1', type: 'Bar', fill: '#ACE5FF',
                animation: { enable: false },
                dataSource: [
                    { x: new Date(2000, 6, 11), y: 45 },
                    { x: new Date(2002, 3, 7), y: 40 },
                    { x: new Date(2004, 3, 6), y: 45 },
                    { x: new Date(2006, 3, 30), y: 40 },
                    { x: new Date(2008, 3, 8), y: 45 },
                    { x: new Date(2010, 3, 8), y: 20 }
                ],
                xName: 'x', yName: 'y',
                dataLabel: { visible: true }
            }];
            chartObj.series[0].dataLabel.visible = true;
            chartObj.enableSideBySidePlacement = true;
            chartObj.loaded = loaded;
            chartObj.legendSettings = { visible: false };
            chartObj.tooltip.enable = false;
            chartObj.refresh();
        });

        it('Checking data label shape without fill', (done: Function) => {
            loaded = (args: Object): void => {
                const shapeElememt: HTMLElement = document.getElementById('container-svg-data-label-series-1-point-3');
                expect(shapeElememt.getAttribute('stroke') === 'grey').toBe(true);
                expect(shapeElememt.getAttribute('stroke-width') === '2').toBe(true); done();
            };
            chartObj.loaded = loaded;
            chartObj.series[1].dataLabel.border.width = 2;
            chartObj.series[1].dataLabel.border.color = 'grey';
            chartObj.refresh();
        });

        it('Checking font color saturation - dataLabel fill black', (done: Function) => {
            loaded = (args: Object): void => {
                const textElement: HTMLElement = document.getElementById('container-svg-series-0-point-3-data-label');
                expect(textElement.getAttribute('fill')).toBe('#212529');
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataLabel.fill = 'black';
            chartObj.refresh();
        });

        it('Checking font color saturation - dataLabel fill white', (done: Function) => {
            loaded = (args: Object): void => {
                const textElement: HTMLElement = document.getElementById('container-svg-series-0-point-3-data-label');
                expect(textElement.getAttribute('fill')).toBe('#212529');
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataLabel.fill = 'white';
            chartObj.refresh();
        });

        it('Checking dataLabel positions Top', (done: Function) => {
            loaded = (args: Object): void => {
                const textElement: Element = document.getElementById('container-svg-series-0-point-3-data-label');
                expect(textElement.getAttribute('y') === '209.15153872386327' || textElement.getAttribute('y') === '210.33571974652904').toBe(true);
                expect(textElement.getAttribute('x') === '552.4766355140187' || textElement.getAttribute('x') === '553.0841121495326').toBe(true);
                const textElement1: Element = document.getElementById('container-svg-series-1-point-3-data-label');
                expect(textElement1.getAttribute('y') === '189.98651290201067' || textElement1.getAttribute('y') === '191.3767694711479').toBe(true);
                expect(textElement1.getAttribute('x') === '327.10280373831773' || textElement1.getAttribute('x') === '325.8878504672897').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[1].dataLabel.position = 'Top';
            chartObj.series[0].dataLabel.position = 'Top';
            chartObj.refresh();
        });

        it('Checking dataLabel positions Middle', (done: Function) => {
            loaded = (args: Object): void => {
                const textElement: Element = document.getElementById('container-svg-series-0-point-3-data-label');
                expect(textElement.getAttribute('y') === '209.15153872386327' || textElement.getAttribute('y') === '210.33571974652904').toBe(true);
                expect(textElement.getAttribute('x') === '304.50467289719626' || textElement.getAttribute('x') === '303.2289719626168').toBe(true);
                const textElement1: Element = document.getElementById('container-svg-series-1-point-3-data-label');
                expect(textElement1.getAttribute('y') === '191.3767694711479' || textElement1.getAttribute('y') === '189.98651290201067').toBe(true);
                expect(textElement1.getAttribute('x') === '191.51401869158877' || textElement1.getAttribute('x') === '189.93457943925233').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[1].dataLabel.position = 'Middle';
            chartObj.series[0].dataLabel.position = 'Middle';
            chartObj.refresh();
        });

        it('Checking data label position as top', (done: Function) => {
            loaded = (args: Object): void => {
                const textElement: Element = document.getElementById('container-svg-series-0-point-3-data-label');
                expect(textElement.getAttribute('y') === '209.15153872386327' || textElement.getAttribute('y') === '210.33571974652904').toBe(true);
                expect(textElement.getAttribute('x') === '553.0841121495326' || textElement.getAttribute('x') === '552.4766355140187').toBe(true);
                const textElement1: Element = document.getElementById('container-svg-series-1-point-3-data-label');
                expect(textElement1.getAttribute('y') === '191.3767694711479' || textElement1.getAttribute('y') === '189.98651290201067').toBe(true);
                expect(textElement1.getAttribute('x') === '327.10280373831773' || textElement1.getAttribute('x') === '325.8878504672897').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[1].dataLabel.position = 'Top';
            chartObj.series[0].dataLabel.position = 'Top';
            chartObj.refresh();
        });

        it('Checking dataLabel positions Bottom', (done: Function) => {
            loaded = (args: Object): void => {
                const textElement: Element = document.getElementById('container-svg-series-0-point-3-data-label');
                expect(textElement.getAttribute('y') === '209.26185283947447' || textElement.getAttribute('y') === '210.43779130281771').toBe(true);
                expect(textElement.getAttribute('x') === '54.58969837587008' || textElement.getAttribute('x') === '56.524918793503495').toBe(true);
                const textElement1: Element = document.getElementById('container-svg-series-1-point-3-data-label');
                expect(textElement1.getAttribute('y') === '190.2302262692821' || textElement1.getAttribute('y') === '191.61080587854133').toBe(true);
                expect(textElement1.getAttribute('x') === '54.58969837587008' || textElement1.getAttribute('x') === '56.524918793503495').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[1].dataLabel.position = 'Bottom';
            chartObj.series[0].dataLabel.position = 'Bottom';
            chartObj.refresh();
        });

        it('Checking font color saturation with font color', (done: Function) => {
            loaded = (args: Object): void => {
                const textElement: Element = document.getElementById('container-svg-series-1-point-3-data-label');
                expect(textElement.getAttribute('fill') === 'red').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[1].dataLabel.position = 'Top';
            chartObj.series[0].dataLabel.position = 'Top';
            chartObj.series[1].dataLabel.font.color = 'red';
            chartObj.refresh();
        });

        it('Checking Data label format with globalize format', (done: Function) => {
            loaded = (args: Object): void => {
                const textElement: Element = document.getElementById('container-svg-series-0-point-3-data-label');
                expect(textElement.textContent === '65.00').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryYAxis.labelFormat = 'n2';
            chartObj.refresh();
        });

        it('Checking margin', (done: Function) => {
            loaded = (args: Object): void => {
                const shape: HTMLElement = document.getElementById('container-svg-data-label-series-0-point-3');
                const text: HTMLElement = document.getElementById('container-svg-series-0-point-3-data-label');
                const textX: number = + text.getAttribute('x');
                const textY: number = + text.getAttribute('y');
                expect(shape.getAttribute('d') === 'M 522.4766355140187 177.01153872386328 L 572.4766355140187 177.01153872386328 L 572.4766355140187 218.01153872386328 L 522.4766355140187 218.01153872386328 L 522.4766355140187 177.01153872386328 z'
                || shape.getAttribute('d') === 'M 522.0841121495326 176.57571974652905 L 574.0841121495326 176.57571974652905 L 574.0841121495326 220.57571974652905 L 522.0841121495326 220.57571974652905 L 522.0841121495326 176.57571974652905 z').toBe(true);
                expect(textY === 209.15153872386327 || textY === 210.33571974652904).toBe(true);
                expect(textX === 552.4766355140187 || textX === 553.0841121495326).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataLabel.fill = 'blue';
            chartObj.series[0].dataLabel.margin = {
                left: 20,
                right: 10,
                top: 25,
                bottom: 5
            };
            chartObj.refresh();
        });
        it('Checking Data label format', (done: Function) => {
            loaded = (args: Object): void => {
                const textElement: Element = document.getElementById('container-svg-series-0-point-3-data-label');
                expect(textElement.textContent === '65%').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataLabel.format = '{value}%';
            chartObj.refresh();
        });
        it('Checking Data label template', (done: Function) => {
            loaded = (args: Object): void => {
                const textElement: Element = document.getElementById('container-svg-series-0-point-3-data-label');
                expect(document.getElementById('container-series-0-data-label-5').style.left === '728.748px'
                || document.getElementById('container-series-0-data-label-5').style.left === '728.869px').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataLabel.template = '<div>${point.y}</div>';
            chartObj.refresh();
        });
        it('Checking Data label event with cancel as true', (done: Function) => {
            loaded = (args: Object): void => {
                const textElement: Element = document.getElementById('container-svg-series-0-point-3-data-label');
                expect(textElement === null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.textRender = (args: Chart3DTextRenderEventArgs): void => {
                args.cancel = true;
            }
            chartObj.series[0].dataLabel.template = '<div>${point.y}</div>';
            chartObj.refresh();
        });
        it('Checking Data label event with cancel as false', (done: Function) => {
            loaded = (args: Chart3DLoadedEventArgs): void => {
                chartObj.loaded = null;
                args.chart.dataLabel3DModule.calculateTemplateLabelSize(document.getElementById('container-series-0-data-label-collections'),
                    (document.getElementById('container-series-0-data-label-0') as any), args.chart.visibleSeries[0].points[0], args.chart.visibleSeries[0], args.chart.series[0].dataLabel, new Rect(0,0,0,0), false, { x: 0, y: 0 }, true);
                const textElement: Element = document.getElementById('container');
                expect(textElement !==null ).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.textRender = (args: Chart3DTextRenderEventArgs): void => {
                args.cancel = false;
            }
            chartObj.series[0].dataLabel.template = '<div>${point.y}</div>';
            chartObj.refresh();
        });
    });

    describe('checking Column Width and Spacing', () => {
        let chartObj: Chart3D;
        let loaded: EmitType<Chart3DLoadedEventArgs>;
        element = createElement('div', { id: 'container' });
        beforeAll(() => {
            document.body.appendChild(element);
            chartObj = new Chart3D(
                {
                    primaryYAxis: {
                        labelFormat: '{value}%',
                        rangePadding: 'Normal',
                        minimum: 20, maximum: 45, interval: 5
                    },
                    enableSideBySidePlacement: false,
                    series: [{
                        type: 'Bar', name: 'India', xName: 'x', yName: 'y', fill: 'skyblue', visible: true,
                        dataSource: [
                            { x: 2005, y: 28 }, { x: 2006, y: 25 }, { x: 2007, y: 26 }, { x: 2008, y: 27 }
                        ],
                        dataLabel: { visible: true }
                    },
                    {
                        type: 'Bar', name: 'Germany', xName: 'x', yName: 'y', fill: 'purple', visible: true,
                        opacity: 0.8,
                        dataSource: [
                            { x: 2005, y: 31 }, { x: 2006, y: 28 }, { x: 2007, y: 30 }, { x: 2008, y: 36 }
                        ],
                        dataLabel: { visible: true }
                    },
                    {
                        type: 'Bar', name: 'Italy', xName: 'x', yName: 'y', fill: 'lightgreen', visible: true,
                        dataSource: [
                            { x: 2005, y: 26 }, { x: 2006, y: 30 }, { x: 2007, y: 28 }, { x: 2008, y: 32 }
                        ],
                        dataLabel: { visible: true }
                    }],
                    width: '800px',
                    height: '400px',
                    title: 'Chart TS Title',
                    loaded: loaded,
                    legendSettings: { visible: false }
                });
            chartObj.appendTo('#container');

        });

        afterAll((): void => {
            chartObj.destroy();
            element.remove();
        });

        it('side by side placement false checking', (done: Function) => {
            loaded = (args: Object): void => {
                let point: Element = document.getElementById('container-svg-0-region-series-0-point-0');
                let path: string[] = point.getAttribute('d').split(' ');
                let x: number = parseInt(path[1], 10);
                expect(x === 61 || x === 63).toBe(true);
                point = document.getElementById('container-svg-0-region-series-1-point-0');
                path = point.getAttribute('d').split(' ');
                x = parseInt(path[1], 10);
                expect(x === 65 || x === 66).toBe(true);
                point = document.getElementById('container-svg-0-region-series-2-point-0');
                path = point.getAttribute('d').split(' ');
                x = parseInt(path[1], 10);
                expect(x === 70 || x === 68).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });

        it('side by side placing enable true', (done: Function) => {
            loaded = (args: Object): void => {
                let point: Element = document.getElementById('container-svg-0-region-series-0-point-0');
                let path: string[] = point.getAttribute('d').split(' ');
                let x: number = parseInt(path[1], 10);
                expect(x === 65 || x === 63).toBe(true);
                point = document.getElementById('container-svg-0-region-series-1-point-0');
                path = point.getAttribute('d').split(' ');
                x = parseInt(path[1], 10);
                expect(x === 65 || x === 63).toBe(true);
                point = document.getElementById('container-svg-0-region-series-2-point-0');
                path = point.getAttribute('d').split(' ');
                x = parseInt(path[1], 10);
                expect(x === 65 || x === 63).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.enableSideBySidePlacement = true;
            chartObj.refresh();
        });

        it('Column width and spacing checking', (done: Function) => {
            loaded = (args: Object): void => {
                let point: Element = document.getElementById('container-svg-0-region-series-0-point-0');
                let path: string[] = point.getAttribute('d').split(' ');
                let x: number = parseInt(path[1], 10);
                expect(x === 65 || x === 63).toBe(true);
                point = document.getElementById('container-svg-0-region-series-1-point-0');
                path = point.getAttribute('d').split(' ');
                x = parseInt(path[1], 10);
                expect(x === 65 || x === 63).toBe(true);
                point = document.getElementById('container-svg-0-region-series-2-point-0');
                path = point.getAttribute('d').split(' ');
                x = parseInt(path[1], 10);
                expect(x === 65 || x === 63).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].columnWidth = 1;
            chartObj.series[0].columnSpacing = 0.5;
            chartObj.series[1].columnWidth = 1;
            chartObj.series[1].columnSpacing = 0.5;
            chartObj.series[2].columnWidth = 1;
            chartObj.series[2].columnSpacing = 0.5;
            chartObj.refresh();
        });
    });

    /**
     * Checking groupName support with column series
     */
    describe('Bar series with grouping support', () => {

        let chartObj: Chart3D;
        let loaded: EmitType<Chart3DLoadedEventArgs>;
        element = createElement('div', { id: 'container' });
        beforeAll(() => {
            document.body.appendChild(element);
            chartObj = new Chart3D(
                {
                    primaryXAxis: {
                        valueType: 'Category', interval: 1, majorGridLines: { width: 0 }
                    },
                    primaryYAxis:
                    {
                        majorGridLines: { width: 0 },
                        majorTickLines: { width: 0 }, labelStyle: { color: 'transparent' }
                    },
                    enableSideBySidePlacement: true,
                    series: [
                        {
                            type: 'Bar', xName: 'x', yName: 'y', name: 'Total',
                            dataSource: [{ x: 'Jamesh', y: 10, text: 'Total 10' },
                                { x: 'Michael', y: 9, text: 'Total 9' }, { x: 'John', y: 11, text: 'Total 11' }],
                            columnWidth: 0.6,
                            groupName: 'A',
                            dataLabel: { visible: true, position: 'Top', font: { fontWeight: '600', color: '#ffffff' } }
                        },
                        {
                            type: 'Bar', xName: 'x', yName: 'y', name: 'Orange',
                            dataSource: [{ x: 'Jamesh', y: 4 }, { x: 'Michael', y: 3 }, { x: 'John', y: 4 }],
                            columnWidth: 0.4,
                            groupName: 'A',
                            dataLabel: { visible: true, position: 'Top', font: { fontWeight: '600', color: '#ffffff' } }
                        },
                        {
                            type: 'Bar', xName: 'x', yName: 'y', name: 'Orange',
                            dataSource: [{ x: 'Jamesh', y: 3 }, { x: 'Michael', y: 3 }, { x: 'John', y: 4 }],
                            columnWidth: 0.6,
                            groupName: 'B',
                            dataLabel: { visible: true, position: 'Top', font: { fontWeight: '600', color: '#ffffff' } }
                        },
                        {
                            type: 'Bar', xName: 'x', yName: 'y', name: 'Grapes',
                            dataSource: [{ x: 'Jamesh', y: 2 }, { x: 'Michael', y: 2 }, { x: 'John', y: 2 }],
                            columnWidth: 0.4,
                            groupName: 'B',
                            dataLabel: { visible: true, position: 'Top', font: { fontWeight: '600', color: '#ffffff' } }
                        }
                    ],
                    // Initialize the chart title
                    title: 'Fruit Consumption',
                    tooltip: { enable: true, }
                });
            chartObj.appendTo('#container');
        });

        afterAll((): void => {
            chartObj.destroy();
            element.remove();
        });

        it('Bar series group support', (done: Function) => {
            loaded = (): void => {
                const direction: string = document.getElementById('container-svg-0-region-series-0-point-1').getAttribute('d');
                expect(direction === 'M 68.34270952927669 248.01974741676233 L 68.34270952927669 248.01974741676233 L 578.2738231917336 248.01974741676233 L 578.2738231917336 277.74144661308844 L 68.34270952927669 277.74144661308844 ' 
                    || direction === 'M 70.00177374852188 247.975108395743 L 70.00177374852188 247.975108395743 L 481.7445520581114 247.975108395743 L 481.7445520581114 277.23379976350026 L 70.00177374852188 277.23379976350026 '
                    || direction === 'M 68.19646327244462 248.0091721725612 L 68.19646327244462 248.0091721725612 L 492.59710732330245 248.0091721725612 L 492.59710732330245 277.7172172561213 L 68.19646327244462 277.7172172561213 ').toBe(true);
                const direction1: string = document.getElementById('container-svg-1-region-series-1-point-1-front').getAttribute('d');
                expect(direction1 === 'M 240.3879456706282 247.69405772495756 L 240.3879456706282 247.69405772495756 L 72.81578947368422 247.69405772495756 L 72.81578947368422 236.29915110356538 L 240.3879456706282 236.29915110356538 '
                    || direction1 === 'M 209.55443498044002 247.64045445717613 L 209.55443498044002 247.64045445717613 L 74.30598174402797 247.64045445717613 L 74.30598174402797 236.4278112254807 L 209.55443498044002 236.4278112254807 '
                    || direction1 === 'M 212.03123375379644 247.6786439379429 L 212.03123375379644 247.6786439379429 L 72.59653323118177 247.6786439379429 L 72.59653323118177 236.29147672859605 L 212.03123375379644 236.29147672859605 ').toBe(true);
                const direction2: string = document.getElementById('container-svg-0-region-series-0-point-2').getAttribute('d');
                expect(direction2 === 'M 68.34270952927669 137.93938002296207 L 68.34270952927669 137.93938002296207 L 691.5918484500573 137.93938002296207 L 691.5918484500573 167.66107921928815 L 68.34270952927669 167.66107921928815 ' ||
                    direction2 === 'M 70.00177374852188 139.6095848114571 L 70.00177374852188 139.6095848114571 L 573.2429472380202 139.6095848114571 L 573.2429472380202 168.86827617921432 L 70.00177374852188 168.86827617921432 ' ||
                    direction2 === 'M 68.19646327244462 137.97937556678323 L 68.19646327244462 137.97937556678323 L 586.9083615568263 137.97937556678323 L 586.9083615568263 167.6874206503433 L 68.19646327244462 167.6874206503433 ').toBe(true);
                chartObj.loaded = null;
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
    });
    describe('EmptyPoint Settings', () => {
        let chartObj: Chart3D;
        let loaded: EmitType<Chart3DLoadedEventArgs>;
        const element: Element = createElement('div', { id: 'container' });
        beforeAll(() => {
            document.body.appendChild(element);
            chartObj = new Chart3D(
                {
                    primaryXAxis: { valueType: 'Category', interval: 1, majorGridLines: { width: 0 }, majorTickLines: { width: 0 }, minorTickLines: { width: 0 } },
                    primaryYAxis: { title: 'Medal Count', majorTickLines: { width: 0 }, maximum: 50, interval: 10 },
                    series: [{
                        name: 'Gold',
                        dataSource: [{ x: 'GBR', y: 27, tooltipMappingName: 'Great Britain' },
                            { x: 'CHN', y: 26, tooltipMappingName: 'China' },
                            { x: 'AUS', y: 8, tooltipMappingName: 'Australia' },
                            { x: 'RUS', y: 19, tooltipMappingName: 'Russia' },
                            { x: 'GER', y: 17, tooltipMappingName: 'Germany' },
                            { x: 'UA', y: 2, tooltipMappingName: 'Ukraine' },
                            { x: 'ES', y: null, tooltipMappingName: 'Spain' },
                            { x: 'UZB', y: 4, tooltipMappingName: 'Uzbekistan' },
                            { x: 'JPN', y: 12, tooltipMappingName: 'Japan' },
                            { x: 'NL', y: null, tooltipMappingName: 'NetherLand' },
                            { x: 'USA', y: 46, tooltipMappingName: 'United States' }],
                        xName: 'x', yName: 'y',
                        type: 'Bar', fill: 'skyblue'
                    }],
                    enableSideBySidePlacement: false,
                    width: '800', tooltip: { enable: true }, legendSettings: { visible: true },
                    title: 'Olympic Medal Counts - RIO', loaded: loaded
                });
            chartObj.appendTo('#container');
        });

        afterAll((): void => {
            chartObj.destroy();
            document.getElementById('container').remove();
        });

        it('Empty points Zero mode', (done: Function) => {
            loaded = (args: Object): void => {
                const region1: string = document.getElementById('container-svg-1-region-series-0-point-1').getAttribute('d');
                expect(region1 === 'M 59.72350230414747 303.2984499371596 L 59.72350230414747 303.2984499371596 L 431.0562211981567 303.2984499371596 L 431.0562211981567 322.6345203183913 L 59.72350230414747 322.6345203183913 '
                    || region1 === 'M 59.72350230414747 299.79547549224964 L 59.72350230414747 299.79547549224964 L 431.0562211981567 299.79547549224964 L 431.0562211981567 318.6435693338919 L 59.72350230414747 318.6435693338919 ').toBe(true);
                done();
            };
            chartObj.series[0].emptyPointSettings.mode = 'Zero';
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Empty points Average mode', (done: Function) => {
            loaded = (args: Object): void => {
                const region1: string = document.getElementById('container-svg-1-region-series-0-point-1').getAttribute('d');
                expect(region1 === 'M 59.72350230414747 303.2984499371596 L 59.72350230414747 303.2984499371596 L 431.0562211981567 303.2984499371596 L 431.0562211981567 322.6345203183913 L 59.72350230414747 322.6345203183913 '
                    || region1 === 'M 59.72350230414747 299.79547549224964 L 59.72350230414747 299.79547549224964 L 431.0562211981567 299.79547549224964 L 431.0562211981567 318.6435693338919 L 59.72350230414747 318.6435693338919 ').toBe(true);
                done();
            };
            chartObj.series[0].emptyPointSettings.mode = 'Average';
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Empty points Gap mode', (done: Function) => {
            loaded = (args: Object): void => {
                const region1: Element = document.getElementById('container-svg-0-region-series-0-point-6');
                expect(region1 === null).toBe(true);
                done();
            };
            chartObj.series[0].emptyPointSettings.mode = 'Drop';
            chartObj.series[0].emptyPointSettings.fill = 'red';
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Checking with logarithmic axis', (done: Function) => {
            loaded = (args: Object): void => {
                const region1: Element = document.getElementById('container-svg-0-region-series-0-point-1');
                expect(region1 === null).toBe(true);
                done();
            };
            chartObj.series[0].dataSource = [  { y: 18, x: 1 }, { y: 29, x: 2 } ];
            chartObj.series[0].columnFacet = 'Cylinder';
            chartObj.primaryXAxis = {  title: 'Year',valueType: 'Logarithmic'};
            chartObj.enableSideBySidePlacement = true;
            chartObj.series[0].xName = 'x';
            chartObj.series[0].yName = 'y';
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        
    });
    // it('memory leak', () => {
    //     profile.sample();
    //     const average: any = inMB(profile.averageChange);
    //     //Check average change in memory samples to not be over 10MB
    //     expect(average).toBeLessThan(10);
    //     const memory: any = inMB(getMemoryProfile());
    //     //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
    //     expect(memory).toBeLessThan(profile.samples[0] + 0.25);
    // });
});
