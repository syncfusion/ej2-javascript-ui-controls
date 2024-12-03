/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Column Series Spec
 */
import { EmitType, createElement } from '@syncfusion/ej2-base';
import { Chart3D } from '../../../src/chart3d/chart3D';
import { Chart3DLoadedEventArgs, Chart3DPointRenderEventArgs} from '../../../src/chart3d/model/chart3d-Interface';
import { ColumnSeries3D } from '../../../src/chart3d/series/column-series';
import { Category3D } from '../../../src/chart3d/axis/category-axis';
import { DateTime3D } from '../../../src/chart3d/axis/date-time-axis';
import { DateTimeCategory3D } from '../../../src/chart3d/axis/date-time-category-axis';
import { DataLabel3D } from '../../../src/chart3d/series/data-label';
import { profile, inMB, getMemoryProfile } from '../../common.spec';
import { Logarithmic3D } from '../../../src/chart3d/axis/logarithmic-axis';
import { MouseEvents } from '../base/events.spec';
Chart3D.Inject(ColumnSeries3D, Category3D, DateTime3D, DateTimeCategory3D, Logarithmic3D);

describe('Column Series', () => {

    let element: HTMLElement;
    /**
     * Default Column Seriess
     */
    describe('Column Series', () => {
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
                        type: 'Column', fill: 'rgba(135,206,235,1)'
                    }],
                    width: '800',
                    enableSideBySidePlacement: false,
                    title: 'Chart TS Title', loaded: loaded, legendSettings: { visible: false }

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
                expect(yAxisLabel.textContent === '1').toBe(true);
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
                expect(svg1.getAttribute('d')).toBe('M 171.58878504672896 90.86915887850468 L 171.58878504672896 90.86915887850468 L 672.1495327102804 90.86915887850468 L 672.1495327102804 387.31775700934577 L 171.58878504672896 387.31775700934577 ');
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
                expect(stroke === 'null').toBe(true);
                const labelElement: HTMLElement = document.getElementById('container-0-axis-label-3');
                expect(labelElement.textContent === '2003').toBe(true);
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
                seriesElements = document.getElementById('container-svg-1-region-series-0-point-0');
                expect(seriesElements.getAttribute('fill') === '#ff0000').toBe(true);
                seriesElements = document.getElementById('container-svg-2-region-series-0-point-0');
                expect(seriesElements.getAttribute('fill') === '#E50000').toBe(true);
                seriesElements = document.getElementById('container-svg-3-region-series-0-point-0');
                expect(seriesElements.getAttribute('fill') === '#E50000').toBe(true);
                seriesElements = document.getElementById('container-svg-4-region-series-0-point-0');
                expect(seriesElements.getAttribute('fill') === '#B20000').toBe(true);
                seriesElements = document.getElementById('container-svg-5-region-series-0-point-0');
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

        it('Column Series with negative', (done: Function) => {
            loaded = (args: Object): void => {
                const seriesElements: HTMLElement = document.getElementById('container-svg-0-region-series-0-point-1');
                expect(seriesElements.getAttribute('d')).toBe('M 193.94392523364485 238.607476635514 L 193.94392523364485 238.607476635514 L 268.78504672897196 238.607476635514 L 268.78504672897196 302.75700934579436 L 193.94392523364485 302.75700934579436 ');
                const seriesElement1: HTMLElement  = document.getElementById('container-svg-0-region-series-0-point-3');
                expect(seriesElement1.getAttribute('d')).toBe('M 444.7102803738317 164.73831775700933 L 444.7102803738317 164.73831775700933 L 519.5514018691589 164.73831775700933 L 519.5514018691589 302.75700934579436 L 444.7102803738317 302.75700934579436 ');
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

        it('Column Series with Rotation', (done: Function) => {
            loaded = (args: Object): void => {
                const seriesElements: HTMLElement = document.getElementById('container-svg-0-region-series-0-point-3');
                expect(seriesElements.getAttribute('d')).toBe('M 423.5317853273407 165.39587470427938 L 423.5317853273407 165.39587470427938 L 480.9894270907686 162.80831880510846 L 480.9894270907686 398.10017932578154 L 423.5317853273407 390.8981487397558 ');
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

        it('Column Series with Depth', (done: Function) => {
            loaded = (args: Object): void => {
                const seriesElements: HTMLElement = document.getElementById('container-svg-0-region-series-0-point-3');
                expect(seriesElements.getAttribute('d') === 'M 444.8316086547507 166.52398871119473 L 444.8316086547507 166.52398871119473 L 519.8758231420508 166.52398871119473 L 519.8758231420508 387.75823142050797 L 444.8316086547507 387.75823142050797 ').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.rotation = 0;
            chartObj.depth = 45;
            chartObj.refresh();
        });

        it('Column Series with perspectiveAngle', (done: Function) => {
            loaded = (args: Object): void => {
                const seriesElements: HTMLElement = document.getElementById('container-svg-0-region-series-0-point-3');
                expect(seriesElements.getAttribute('d') === 'M 426.2857142857143 190.71428571428572 L 426.2857142857143 190.71428571428572 L 470.2857142857143 190.71428571428572 L 470.2857142857143 320.42857142857144 L 426.2857142857143 320.42857142857144 ').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.depth = 100;
            chartObj.perspectiveAngle = 180;
            chartObj.refresh();
        });

        it('Column Series with Tilt', (done: Function) => {
            loaded = (args: Object): void => {
                const seriesElements: HTMLElement = document.getElementById('container-svg-0-region-series-0-point-3');
                expect(seriesElements.getAttribute('d') === 'M 444.679604383033 200.96165666523652 L 444.679604383033 200.96165666523652 L 519.4693769372404 200.96165666523652 L 507.1007602189066 343.2152957206217 L 440.0539428460951 343.2152957206217 ').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.perspectiveAngle = 90;
            chartObj.tilt = 45;
            chartObj.refresh();
        });

        it('Checking with multiple column series', (done: Function) => {
            loaded = (args: Object): void => {
                const seriesElements: HTMLElement = document.getElementById('container-svg-0-region-series-0-point-3');
                expect(seriesElements.getAttribute('d') === 'M 443.9090909090909 204 L 443.9090909090909 204 L 517.4090909090909 204 L 517.4090909090909 384.4090909090909 L 443.9090909090909 384.4090909090909 ').toBe(true);
                const seriesElements1: HTMLElement = document.getElementById('container-svg-0-region-series-1-point-3');
                expect(seriesElements1.getAttribute('d') === 'M 442.61764705882354 190.72058823529414 L 442.61764705882354 190.72058823529414 L 513.9558823529412 190.72058823529414 L 513.9558823529412 379.7205882352941 L 442.61764705882354 379.7205882352941 ').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.tilt = 0;
            chartObj.series = [chartObj.series[0], {
                name: 'series1', type: 'Column', fill: 'blue',
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
                expect(seriesElements.getAttribute('d')).toBe('M 445.47368421052636 204.1578947368421 L 445.47368421052636 204.1578947368421 L 478.63157894736844 204.1578947368421 L 478.63157894736844 383.2105263157895 L 445.47368421052636 383.2105263157895 ');
                const seriesElements1: HTMLElement = document.getElementById('container-svg-0-region-series-1-point-3');
                expect(seriesElements1.getAttribute('d')).toBe('M 482.42105263157896 189.9473684210527 L 482.42105263157896 189.9473684210527 L 514.6315789473684 189.9473684210527 L 514.6315789473684 383.2105263157895 L 482.42105263157896 383.2105263157895 ');
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

        it('Checking with logarithmic axis', (done: Function) => {
            loaded = (args: Object): void => {
                let element: HTMLElement = document.getElementById('container-svg-0-region-series-0-point-2');
                expect(element.getAttribute('fill') === '#a52a2a').toBe(true);
                element = document.getElementById('container-svg-0-region-series-0-point-0');
                expect(element == null).toBe(true);
                done();
            };
            chartObj.series = [{
                name: 'series', type: 'Column', fill: 'blue',
                dataSource: [
                    { x: new Date(2000, 6, 11), y: 1200 }, { x: new Date(2002, 3, 7), y: 3500 },
                    { x: new Date(2004, 3, 6), y: 2000 }, { x: new Date(2006, 3, 30), y: 7000 },
                    { x: new Date(2008, 3, 8), y: 8500 }, { x: new Date(2010, 3, 8), y: 9200 }
                ],
                xName: 'x', yName: 'y'
            }];
            chartObj.primaryYAxis = { minimum: 0, maximum: 100000, interval: 1, valueType: 'Logarithmic' };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
    });

    describe('Column Series in Cyliderical shape', () => {
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
                        type: 'Column', fill: 'skyblue'
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

        it('Column Series Type with ColumnFacet property as Cylinder', (done: Function) => {
            loaded = (args: Object): void => {
                const region5: string = document.getElementById('container-svg-5-region-series-0-point-1').getAttribute('d');
                expect(region5 ).toBe('M 174.5431562833286 206.8227155656214 L 174.5431562833286 206.8227155656214 L 174.5431562833286 376.1584705595699 L 172.39914924699124 375.9378149799596 L 172.39914924699124 206.8492500973466 ');
                const region10: string = document.getElementById('container-svg-10-region-series-0-point-1').getAttribute('d');
                expect(region10 ).toBe('M 160.45786641629823 206.8492500973466 L 160.45786641629823 206.8492500973466 L 160.45786641629823 375.9378149799596 L 157.63094432661043 376.1584705595699 L 157.63094432661043 206.8227155656214 ');
                const region15: string = document.getElementById('container-svg-15-region-series-0-point-1').getAttribute('d');
                expect(region15).toBe( 'M 152.33514856917992 206.65975180068622 L 152.33514856917992 206.65975180068622 L 152.33514856917992 377.51364292060947 L 152.9875997681882 377.8558139534884 L 152.9875997681882 206.6186046511628 ');
                const region20: string = document.getElementById('container-svg-20-region-series-0-point-1').getAttribute('d');
                expect(region20).toBe( 'M 162.3551401869159 206.5327102803738 L 162.3551401869159 206.5327102803738 L 162.3551401869159 378.5700934579439 L 165.57432355004616 378.5212045963204 L 165.57432355004616 206.53858932069568 ');
                const region25: string = document.getElementById('container-svg-25-region-series-0-point-1').getAttribute('d');
                expect(region25 ).toBe('M 175.64477935374404 206.65975180068622 L 175.64477935374404 206.65975180068622 L 175.64477935374404 377.51364292060947 L 176.59259259259258 377.14814814814815 L 176.59259259259258 206.70370370370367 ');
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });

        it('Checking Cylindrical chart with negative points', (done: Function) => {
            loaded = (args: Object): void => {
                const region5: string = document.getElementById('container-svg-5-region-series-0-point-0').getAttribute('d');
                expect(region5 ).toBe('M 431.8952359069001 231.69689426529743 L 431.8952359069001 231.69689426529743 L 431.8952359069001 329.2802107024881 L 429.3755557635048 329.12798628364305 L 429.3755557635048 231.68711838518809 ');
                const region10: string = document.getElementById('container-svg-10-region-series-0-point-0').getAttribute('d');
                expect(region10).toBe( 'M 417.4342729328118 231.68711838518809 L 417.4342729328118 231.68711838518809 L 417.4342729328118 329.12798628364305 L 414.98302395018186 329.2802107024881 L 414.98302395018186 231.69689426529743 ');
                const region15: string = document.getElementById('container-svg-15-region-series-0-point-0').getAttribute('d');
                expect(region15).toBe( 'M 411.9944520226225 231.75693354711564 L 411.9944520226225 231.75693354711564 L 411.9944520226225 330.21510809080024 L 413.2294602333045 330.4511627906977 L 413.2294602333045 231.77209302325582 ');
                const region20: string = document.getElementById('container-svg-20-region-series-0-point-0').getAttribute('d');
                expect(region20 ).toBe('M 423.8130841121495 231.803738317757 L 423.8130841121495 231.803738317757 L 423.8130841121495 330.94392523364485 L 426.9490326412497 330.9101981075881 L 426.9490326412497 231.8015723555332 ');
                const region25: string = document.getElementById('container-svg-25-region-series-0-point-0').getAttribute('d');
                expect(region25).toBe( 'M 435.3040828071867 231.75693354711564 L 435.3040828071867 231.75693354711564 L 435.3040828071867 330.21510809080024 L 435.62962962962956 329.96296296296293 L 435.62962962962956 231.74074074074073 ');
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
                        type: 'Column', dataLabel: { visible: false }
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
                expect(point0 === 285.2616822429906).toBe(true);
                expect(point1 === 450.5420560747663).toBe(true);
                expect(point2 === 341.6355140186916).toBe(true);
                expect(point3 === 490.39252336448595).toBe(true);
                expect(point4 === 240.55140186915887).toBe(true);
                expect(point5 === 704.2242990654205).toBe(true);
                expect(point6 === 387.31775700934577).toBe(true);
                expect(point7 === 743.1028037383178).toBe(true);
                done();
            };
            chartObj.series = [chartObj.series[0], {
                name: 'series1', type: 'Column', fill: '#ACE5FF',
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
                expect(textElement.getAttribute('fill')).toBe( '#212529');
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
                expect(textElement.getAttribute('y')).toBe('160.85046728971963');
                expect(textElement.getAttribute('x')).toBe('450.5420560747663');
                const textElement1: Element = document.getElementById('container-svg-series-1-point-3-data-label');
                expect(textElement1.getAttribute('y')).toBe('274.5700934579439');
                expect(textElement1.getAttribute('x')).toBe('490.39252336448595');
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
                expect(textElement.getAttribute('y')).toBe('285.2616822429906');
                expect(textElement.getAttribute('x')).toBe('450.5420560747663');
                const textElement1: Element = document.getElementById('container-svg-series-1-point-3-data-label');
                expect(textElement1.getAttribute('y')).toBe('341.6355140186916');
                expect(textElement1.getAttribute('x')).toBe('490.39252336448595');
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[1].dataLabel.position = 'Middle';
            chartObj.series[0].dataLabel.position = 'Middle';
            chartObj.refresh();
        });

        it('Checking dataLabel positions as top', (done: Function) => {
            loaded = (args: Object): void => {
                const textElement: Element = document.getElementById('container-svg-series-0-point-3-data-label');
                expect(textElement.getAttribute('y')).toBe('160.85046728971963');
                expect(textElement.getAttribute('x')).toBe('450.5420560747663');
                const textElement1: Element = document.getElementById('container-svg-series-1-point-3-data-label');
                expect(textElement1.getAttribute('y')).toBe('274.5700934579439');
                expect(textElement1.getAttribute('x')).toBe('490.39252336448595');
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
                expect(textElement.getAttribute('y')).toBe('409.3526682134571');
                expect(textElement.getAttribute('x')).toBe('450.19025522041767');
                const textElement1: Element = document.getElementById('container-svg-series-1-point-3-data-label');
                expect(textElement1.getAttribute('y')).toBe('409.3526682134571');
                expect(textElement1.getAttribute('x')).toBe('489.7633410672854');
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
                expect(shape.getAttribute('d')).toBe('M 427.3457943925233 128.71046728971965 L 477.3457943925233 128.71046728971965 L 477.3457943925233 169.71046728971965 L 427.3457943925233 169.71046728971965 L 427.3457943925233 128.71046728971965 z');
                expect(textY).toBe(160.85046728971963);
                expect(textX).toBe(457.3457943925233);
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
                const textElement: Element = document.getElementById('container-svg-series-1-point-3-data-label');
                expect(textElement.textContent === '40%').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[1].dataLabel.format = '{value}%';
            chartObj.refresh();
        });

        it('Checking Data label template', (done: Function) => {
            loaded = (args: Object): void => {
                expect(document.getElementById('container-series-1-data-label-5').style.left).toBe('736.103px');
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[1].dataLabel.template = '<div>${point.y}</div>';
            chartObj.primaryYAxis.minimum = 15
            chartObj.primaryYAxis.maximum = 88
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
                        type: 'Column', name: 'India', xName: 'x', yName: 'y', fill: 'skyblue', visible: true,
                        dataSource: [
                            { x: 2005, y: 28 }, { x: 2006, y: 25 }, { x: 2007, y: 26 }, { x: 2008, y: 27 }
                        ],
                        dataLabel: { visible: true }
                    },
                    {
                        type: 'Column', name: 'Germany', xName: 'x', yName: 'y', fill: 'purple', visible: true,
                        opacity: 0.8,
                        dataSource: [
                            { x: 2005, y: 31 }, { x: 2006, y: 28 }, { x: 2007, y: 30 }, { x: 2008, y: 36 }
                        ],
                        dataLabel: { visible: true }
                    },
                    {
                        type: 'Column', name: 'Italy', xName: 'x', yName: 'y', fill: 'lightgreen', visible: true,
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
                expect(x).toBe(77);
                point = document.getElementById('container-svg-0-region-series-1-point-0');
                path = point.getAttribute('d').split(' ');
                x = parseInt(path[1], 10);
                expect(x).toBe(81);
                point = document.getElementById('container-svg-0-region-series-2-point-0');
                path = point.getAttribute('d').split(' ');
                x = parseInt(path[1], 10);
                expect(x).toBe(85);
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
                expect(x).toBe(81);
                point = document.getElementById('container-svg-0-region-series-1-point-0');
                path = point.getAttribute('d').split(' ');
                x = parseInt(path[1], 10);
                expect(x).toBe(124);
                point = document.getElementById('container-svg-0-region-series-2-point-0');
                path = point.getAttribute('d').split(' ');
                x = parseInt(path[1], 10);
                expect(x).toBe(166);
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
                expect(x).toBe(67);
                point = document.getElementById('container-svg-0-region-series-1-point-0');
                path = point.getAttribute('d').split(' ');
                x = parseInt(path[1], 10);
                expect(x).toBe(128);
                point = document.getElementById('container-svg-0-region-series-2-point-0');
                path = point.getAttribute('d').split(' ');
                x = parseInt(path[1], 10);
                expect(x).toBe(188);
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
    describe('Column series with grouping support', () => {

        let chartObj: Chart3D;
        let loaded: EmitType<Chart3DLoadedEventArgs>;
        const trigger: MouseEvents = new MouseEvents();
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
                            type: 'Column', xName: 'x',  yName: 'y', name: 'Total',
                            dataSource: [{ x: 'Jamesh', y: 10, text: 'Total 10' },
                                { x: 'Michael', y: 9, text: 'Total 9' }, { x: 'John', y: 11, text: 'Total 11' }],
                            columnWidth: 0.6,
                            groupName: 'A',
                            dataLabel: { visible: true, position: 'Top', font: { fontWeight: '600', color: '#ffffff' } }
                        },
                        {
                            type: 'Column', xName: 'x',  yName: 'y', name: 'Orange',
                            dataSource: [{ x: 'Jamesh', y: 4 }, { x: 'Michael', y: 3 }, { x: 'John', y: 4 }],
                            columnWidth: 0.4,
                            groupName: 'A',
                            dataLabel: { visible: true, position: 'Top', font: { fontWeight: '600', color: '#ffffff' } }
                        },
                        {
                            type: 'Column', xName: 'x',  yName: 'y', name: 'Orange',
                            dataSource: [{ x: 'Jamesh', y: 3 }, { x: 'Michael', y: 3 }, { x: 'John', y: 4 }],
                            columnWidth: 0.6,
                            groupName: 'B',
                            dataLabel: { visible: true, position: 'Top', font: { fontWeight: '600', color: '#ffffff' } }
                        },
                        {
                            type: 'Column', xName: 'x', yName: 'y', name: 'Grapes',
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

        it('Column series group support', (done: Function) => {
            loaded = (): void => {
                const direction: string[] = document.getElementById('container-svg-0-region-series-0-point-1').getAttribute('d').split(' ');
                const point: number = parseFloat(direction[direction.indexOf('L') + 1]);
                const direction1: string[] = document.getElementById('container-svg-0-region-series-1-point-1-front').getAttribute('d').split(' ');
                const point1: number = parseFloat(direction1[direction1.indexOf('L') + 1]);
                expect(point < point1).toBe(true);
                const direction2: string[] = document.getElementById('container-svg-0-region-series-0-point-2').getAttribute('d').split(' ');
                const point2: number = parseFloat(direction2[direction2.indexOf('L') + 1]);
                const direction3: string[] = document.getElementById('container-svg-0-region-series-2-point-2-front').getAttribute('d').split(' ');
                const point3: number = parseFloat(direction3[direction3.indexOf('L') + 1]);
                expect(point2 < point3).toBe(true);
                chartObj.loaded = null;
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Column series group with tooltip', (done: Function) => {
            loaded = (): void => {
                const direction: string = document.getElementById('container-svg-0-region-series-0-point-1').getAttribute('d');
                expect(direction !== null).toBe(true);
                let target: HTMLElement;
                target = document.getElementById('container-svg-0-region-series-0-point-1');
                let rect = target.getBoundingClientRect();
                let x = window.scrollX + rect.left + rect.width / 2;
                let y = window.scrollY + rect.top;
                trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));
                target = document.getElementById('container-svg-0-region-series-0-point-2');
                rect = target.getBoundingClientRect();
                x = window.scrollX + rect.left + rect.width / 2;
                y = window.scrollY + rect.top;
                trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));
                chartObj.loaded = null;
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
    });

    it('memory leak', () => {
        profile.sample();
        const average: any = inMB(profile.averageChange);
        //Check average change in memory samples to not be over 10MB
        expect(average).toBeLessThan(10);
        const memory: any = inMB(getMemoryProfile());
        //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
    });
});
