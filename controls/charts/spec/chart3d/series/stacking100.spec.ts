/* eslint-disable @typescript-eslint/tslint/config */
/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Stacking Bar Series Spec
 */
import { EmitType, createElement } from '@syncfusion/ej2-base';
import { Chart3D } from '../../../src/chart3d/chart3D';
import { Chart3DLoadedEventArgs } from '../../../src/chart3d/model/chart3d-Interface';
import { StackingBarSeries3D } from '../../../src/chart3d/series/stacking-bar-series';
import { Category3D } from '../../../src/chart3d/axis/category-axis';
import { DateTime3D } from '../../../src/chart3d/axis/date-time-axis';
import { DateTimeCategory3D } from '../../../src/chart3d/axis/date-time-category-axis';
import { DataLabel3D } from '../../../src/chart3d/series/data-label';
import { getMemoryProfile, inMB, profile } from '../../common.spec';
Chart3D.Inject(StackingBarSeries3D, Category3D, DateTime3D, DateTimeCategory3D, DataLabel3D);

describe('Stacking Bar Series', () => {
    let element: HTMLElement;
    /**
     * Default Column Seriess
     */

    describe('Stacking Bar Series', () => {
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
        element = createElement('div', { id: 'barElement' });
        beforeAll(() => {
            document.body.appendChild(element);
            chartObj = new Chart3D(
                {
                    primaryXAxis: {
                        valueType: 'Category',
                        majorGridLines: { width: 0 },
                        majorTickLines: { width: 0 }
                    },
                    primaryYAxis: {
                        edgeLabelPlacement: 'Shift',
                        title: 'Sales (In Percentage)',
                        majorTickLines: { width: 0 }
                    },
                    series: [
                        {
                            type: 'StackingBar100',
                            name: 'Apple',
                            dataSource: [], xName: 'x', yName: 'y',  columnWidth: 0.6
                        }, {
                            type: 'StackingBar100', name: 'Orange',
                            dataSource: [], xName: 'x', yName: 'y1',  columnWidth: 0.6
                        }, {
                            type: 'StackingBar100', name: 'Wastage',
                            dataSource: [], xName: 'x', yName: 'y2',  columnWidth: 0.6
                        }
                    ],
                    width: '800',enableSideBySidePlacement: false,
                    title: 'Sales Comparison', loaded: loaded
                });
            chartObj.appendTo('#barElement');
        });

        afterAll((): void => {
            chartObj.destroy();
            document.getElementById('barElement').remove();
        });

        it('Default Series Type without data Source', (done: Function) => {
            loaded = (args: Object): void => {
                const xAxisLabelCollection: HTMLElement = document.getElementById('barElement-1-axis-label-0');
                expect(xAxisLabelCollection.textContent === '0%').toBe(true);
                const yAxisLabelCollection: HTMLElement = document.getElementById('barElement-1-axis-label-1');
                expect(yAxisLabelCollection.textContent === '0.5%').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });

        it('Added data Source', (done: Function) => {
            loaded = (args: Object): void => {
                const svg: HTMLElement = document.getElementById('barElement-svg-4-region-series-1-point-0');
                expect(svg.getAttribute('d') !== '').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource = [{ x: 'Jan', y: 6, y1: 6, y2: -1 }];
            chartObj.series[0].name = 'Changed';
            chartObj.series[0].xName = 'x';
            chartObj.series[0].yName = 'y';
            chartObj.series[1].dataSource = [{ x: 'Jan', y: 6, y1: 6, y2: -1 }];
            chartObj.series[1].name = 'Changed1';
            chartObj.series[1].xName = 'x';
            chartObj.series[1].yName = 'y1';
            chartObj.series[2].dataSource = [{ x: 'Jan', y: 6, y1: 6, y2: -1 }];
            chartObj.series[2].name = 'Changed2';
            chartObj.series[2].xName = 'x';
            chartObj.series[2].yName = 'y2';
            chartObj.refresh();
        });
        it('checking datasource in Chart', (done: Function) => {
            chartObj.loaded = (args: Object) => {
                const svg1: HTMLElement = document.getElementById('barElement-svg-0-region-series-2-point-0');
                expect(svg1.getAttribute('d') !== '').toBe(true);
                const svg2: HTMLElement = document.getElementById('barElement-svg-0-region-series-0-point-0');
                expect(svg2.getAttribute('d') !== '').toBe(true);
                const svg3: HTMLElement = document.getElementById('barElement-svg-0-region-series-1-point-0');
                expect(svg3.getAttribute('d') !== '').toBe(true);
                done();
            };
            chartObj.dataSource = [{ x: 'Jan', y: 6, y1: 6, y2: -1 }];
            chartObj.dataBind();
        });

        it('Single data point with range', (done: Function) => {
            loaded = (args: Object): void => {
                const svg: HTMLElement = document.getElementById('barElement-svg-0-region-series-0-point-0');
                expect(svg.getAttribute('d') !== '').toBe(true);
                const xAxisLabelCollection: HTMLElement = document.getElementById('barElement-0-axis-label-0');
                expect(xAxisLabelCollection.textContent === 'Jan').toBe(true);
                const yAxisLabelCollection: HTMLElement = document.getElementById('barElement-1-axis-label-0');
                expect(yAxisLabelCollection.textContent === '-20%').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.interval = 1;
            chartObj.primaryYAxis.minimum = -20;
            chartObj.primaryYAxis.maximum = 100;
            chartObj.primaryYAxis.interval = 10;
            chartObj.refresh();

        });

        it('Checking series visibility', (done: Function) => {
            loaded = (args: Object): void => {
                const seriesElements: Element = document.getElementById('barElement-svg-0-region-series-0-point-0');
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
                const seriesElements: Element = document.getElementById('barElement-svg-0-region-series-0-point-0');
                expect(seriesElements != null).toBe(true);
                expect(seriesElements.getAttribute('d') !== '').toBe(true);
                const seriesElements2: Element = document.getElementById('barElement-svg-0-region-series-1-point-0');
                expect(seriesElements2.getAttribute('d') !== '').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].visible = true;
            chartObj.series[0].dataSource = [
                { x: 'Jan', y: 6, y1: 6, y2: -1 }, { x: 'Feb', y: 8, y1: 8, y2: -1.5 },
                { x: 'Mar', y: 12, y1: 11, y2: -2 }, { x: 'Apr', y: 15, y1: 16, y2: -2.5 }];
            chartObj.series[0].xName = 'x';
            chartObj.series[0].yName = 'y';
            chartObj.series[1].visible = true;
            chartObj.series[1].dataSource = [
                { x: 'Jan', y: 6, y1: 6, y2: -1 }, { x: 'Feb', y: 8, y1: 8, y2: -1.5 },
                { x: 'Mar', y: 12, y1: 11, y2: -2 }, { x: 'Apr', y: 15, y1: 16, y2: -2.5 }];
            chartObj.series[1].xName = 'x';
            chartObj.series[1].yName = 'y1';
            chartObj.series[2].visible = true;
            chartObj.series[2].dataSource = [
                { x: 'Jan', y: 6, y1: 6, y2: -1 }, { x: 'Feb', y: 8, y1: 8, y2: -1.5 },
                { x: 'Mar', y: 12, y1: 11, y2: -2 }, { x: 'Apr', y: 15, y1: 16, y2: -2.5 }];
            chartObj.series[2].xName = 'x';
            chartObj.series[2].yName = 'y2';
            chartObj.refresh();
        });

        it('with range', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.primaryXAxis.minimum = null;
                chartObj.primaryXAxis.maximum = null;
                chartObj.primaryXAxis.interval = null;
                const seriesElements: HTMLElement = document.getElementById('barElement-svg-0-region-series-0-point-0');
                const path: string = seriesElements.getAttribute('d');
                expect(path !== '').toBe(true); done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.minimum = -20;
            chartObj.primaryXAxis.maximum = 100;
            chartObj.primaryXAxis.interval = 10;
            chartObj.refresh();
        });

        it('with dateTimeRange', (done: Function) => {
            loaded = (args: Object): void => {
                const seriesElements: HTMLElement = document.getElementById('barElement-svg-0-region-series-0-point-0');
                const stroke: string = seriesElements.getAttribute('stroke-width');
                expect(stroke === 'null').toBe(true);
                const labelElement: HTMLElement = document.getElementById('barElement-0-axis-label-3');
                expect(labelElement.textContent === '2006').toBe(true); done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource = [
                { x: new Date(2000, 6, 11), y: 6, y1: 6, y2: -1 }, { x: new Date(2002, 3, 7), y: 8, y1: 8, y2: -1.5 },
                { x: new Date(2004, 3, 6), y: 12, y1: 11, y2: -2 }, { x: new Date(2006, 3, 30), y: 15, y1: 16, y2: -2.5 },
                { x: new Date(2008, 3, 8), y: 20, y1: 21, y2: -3 }, { x: new Date(2010, 3, 8), y: 24, y1: 25, y2: -3.5 }
            ];
            chartObj.series[1].dataSource = [
                { x: new Date(2000, 6, 11), y: 6, y1: 6, y2: -1 }, { x: new Date(2002, 3, 7), y: 8, y1: 8, y2: -1.5 },
                { x: new Date(2004, 3, 6), y: 12, y1: 11, y2: -2 }, { x: new Date(2006, 3, 30), y: 15, y1: 16, y2: -2.5 },
                { x: new Date(2008, 3, 8), y: 20, y1: 21, y2: -3 }, { x: new Date(2010, 3, 8), y: 24, y1: 25, y2: -3.5 }
            ];
            chartObj.series[2].dataSource = [
                { x: new Date(2000, 6, 11), y: 6, y1: 6, y2: -1 }, { x: new Date(2002, 3, 7), y: 8, y1: 8, y2: -1.5 },
                { x: new Date(2004, 3, 6), y: 12, y1: 11, y2: -2 }, { x: new Date(2006, 3, 30), y: 15, y1: 16, y2: -2.5 },
                { x: new Date(2008, 3, 8), y: 20, y1: 21, y2: -3 }, { x: new Date(2010, 3, 8), y: 24, y1: 25, y2: -3.5 }
            ];
            chartObj.primaryXAxis.valueType = 'DateTime';
            chartObj.primaryXAxis.labelFormat = null;
            chartObj.refresh();
        });

        it('with empty point(y Value)', (done: Function) => {
            loaded = (args: Object): void => {
                const seriesElements: HTMLElement = document.getElementById('barElement-svg-0-region-series-0-point-3');
                expect(seriesElements == null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            const dataSource: Object = [
                { x: new Date(2000, 6, 11), y: 6, y1: 6, y2: -1 }, { x: new Date(2002, 3, 7), y: 8, y1: 8, y2: -1.5 },
                { x: new Date(2004, 3, 6), y: 12, y1: 11, y2: -2 }, { x: new Date(2006, 3, 30), y: 15, y1: 16, y2: -2.5 },
                { x: new Date(2008, 3, 8), y: 20, y1: 21, y2: -3 }, { x: new Date(2010, 3, 8), y: 24, y1: 25, y2: -3.5 }
            ];
            dataSource[3].y = null;
            chartObj.series[0].dataSource = dataSource;
            chartObj.primaryXAxis.valueType = 'DateTime';
            chartObj.refresh();
        });

        it('with empty point(x Value)', (done: Function) => {
            loaded = (args: Object): void => {
                const seriesElements: HTMLElement = document.getElementById('barElement-svg-0-region-series-0-point-6');
                expect(seriesElements === null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            const dataSource: object = [
                { x: new Date(2000, 6, 11), y: 6, y1: 6, y2: -1 }, { x: new Date(2002, 3, 7), y: 8, y1: 8, y2: -1.5 },
                { x: new Date(2004, 3, 6), y: 12, y1: 11, y2: -2 }, { x: new Date(2006, 3, 30), y: 15, y1: 16, y2: -2.5 },
                { x: new Date(2008, 3, 8), y: 20, y1: 21, y2: -3 }, { x: new Date(2010, 3, 8), y: 24, y1: 25, y2: -3.5 }
            ];
            dataSource[3].y = 15;
            dataSource[3].x = new Date();
            chartObj.series[0].dataSource = dataSource;
            chartObj.refresh();
        });

        it('with empty point(x and y Value)', (done: Function) => {
            loaded = (args: Object): void => {
                const seriesElements: HTMLElement = document.getElementById('barElement-svg-0-region-series-0-point-5');
                const seriesElements1: HTMLElement = document.getElementById('barElement-svg-0-region-series-0-point-3');
                expect(seriesElements === null).toBe(true);
                expect(seriesElements1 === null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            const dataSource: object = [
                { x: new Date(2000, 6, 11), y: 6, y1: 6, y2: -1 }, { x: new Date(2002, 3, 7), y: 8, y1: 8, y2: -1.5 },
                { x: new Date(2004, 3, 6), y: 12, y1: 11, y2: -2 }, { x: new Date(2006, 3, 30), y: 15, y1: 16, y2: -2.5 },
                { x: new Date(2008, 3, 8), y: 20, y1: 21, y2: -3 }, { x: new Date(2010, 3, 8), y: 24, y1: 25, y2: -3.5 }];
            dataSource[3].y = null;
            dataSource[3].x = new Date();
            dataSource[5].y = null;
            dataSource[5].x = new Date();
            chartObj.series[0].dataSource = dataSource;
            chartObj.refresh();
        });

        it('with fill and stroke', (done: Function) => {
            loaded = (args: Object): void => {
                let seriesElements: HTMLElement = document.getElementById('barElement-svg-0-region-series-0-point-3');
                expect(seriesElements.getAttribute('fill') === '#ff0000').toBe(true);
                seriesElements = document.getElementById('barElement-svg-0-region-series-1-point-3');
                expect(seriesElements.getAttribute('fill') === '#0000ff').toBe(true);
                seriesElements = document.getElementById('barElement-svg-2-region-series-2-point-3');
                expect(seriesElements.getAttribute('fill') === '#E5E500').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.valueType = 'Category';
            chartObj.series[0].dataSource = [
                { x: 'Jan', y: 6, y1: 6, y2: -1 }, { x: 'Feb', y: 8, y1: 8, y2: -1.5 },
                { x: 'Mar', y: 12, y1: 11, y2: -2 }, { x: 'Apr', y: 15, y1: 16, y2: -2.5 }];
            chartObj.series[0].fill = 'red';
            chartObj.series[0].opacity = 0.6;
            chartObj.series[1].dataSource = [
                { x: 'Jan', y: 6, y1: 6, y2: -1 }, { x: 'Feb', y: 8, y1: 8, y2: -1.5 },
                { x: 'Mar', y: 12, y1: 11, y2: -2 }, { x: 'Apr', y: 15, y1: 16, y2: -2.5 }];
            chartObj.series[1].fill = 'blue';
            chartObj.series[1].opacity = 0.6;
            chartObj.series[2].dataSource = [
                { x: 'Jan', y: 6, y1: 6, y2: -1 }, { x: 'Feb', y: 8, y1: 8, y2: -1.5 },
                { x: 'Mar', y: 12, y1: 11, y2: -2 }, { x: 'Apr', y: 15, y1: 16, y2: -2.5 }];
            chartObj.series[2].fill = 'yellow';
            chartObj.series[2].opacity = 0.6;
            chartObj.refresh();
        });

        it('within yAxis range', (done: Function) => {
            loaded = (args: Object): void => {
                const svgLength: Element = document.getElementById('barElement-svg-0-region-series-0-point-2');
                expect(svgLength.getAttribute('d') !== '').toBe(true); done();
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryYAxis.minimum = -20;
            chartObj.primaryYAxis.maximum = 100;
            chartObj.primaryYAxis.interval = 10;
            chartObj.primaryYAxis.labelFormat = '';
            chartObj.refresh();
        });
        it('Stacking Bar Series with negative', (done: Function) => {
            loaded = (args: Object): void => {
                const seriesElements: HTMLElement = document.getElementById('barElement-svg-0-region-series-0-point-3');
                expect(seriesElements.getAttribute('d') !== '').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource = [
                { x: 'Jan', y: 6, y1: 6, y2: -1 }, { x: 'Feb', y: 8, y1: 8, y2: -1.5 },
                { x: 'Mar', y: 12, y1: 11, y2: -2 }, { x: 'Apr', y: 15, y1: 16, y2: -2.5 }
            ];
            chartObj.series[0].fill = 'red';
            chartObj.refresh();
        });
        it('Stacking Bar Series with Rotation', (done: Function) => {
            loaded = (args: Object): void => {
                const seriesElements: HTMLElement = document.getElementById('barElement-svg-0-region-series-0-point-3');
                expect(seriesElements.getAttribute('d') !== '').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.rotation = 45;
            chartObj.series[0].dataSource = [
                { x: 'Jan', y: 6, y1: 6, y2: -1 }, { x: 'Feb', y: 8, y1: 8, y2: -1.5 },
                { x: 'Mar', y: 12, y1: 11, y2: -2 }, { x: 'Apr', y: 15, y1: 16, y2: -2.5 }
            ];
            chartObj.refresh();
        });
        it('Stacking Bar Series with Depth', (done: Function) => {
            loaded = (args: Object): void => {
                const seriesElements: HTMLElement = document.getElementById('barElement-svg-0-region-series-0-point-3');
                expect(seriesElements.getAttribute('d') !== '').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.rotation = 0;
            chartObj.depth = 45;
            chartObj.refresh();
        });
        it('Stacking Bar Series with perspectiveAngle', (done: Function) => {
            loaded = (args: Object): void => {
                const seriesElements: HTMLElement = document.getElementById('barElement-svg-0-region-series-0-point-3');
                expect(seriesElements.getAttribute('d') !== '').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.rotation = 0;
            chartObj.depth = 45;
            chartObj.perspectiveAngle = 180;
            chartObj.refresh();
        });
        it('Stacking Bar Series with Tilt', (done: Function) => {
            loaded = (args: Object): void => {
                const seriesElements: HTMLElement = document.getElementById('barElement-svg-0-region-series-0-point-3');
                expect(seriesElements.getAttribute('d') !== '').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.rotation = 0;
            chartObj.depth = 100;
            chartObj.perspectiveAngle = 90;
            chartObj.tilt = 45;
            chartObj.refresh();
        });
        it('Checking with multiple series', (done: Function) => {
            loaded = (args: Object): void => {
                const seriesElements: HTMLElement = document.getElementById('barElement-svg-0-region-series-0-point-3');
                expect(seriesElements.getAttribute('d') !== '').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.tilt = 0;
            chartObj.series[0].dataSource = [
                { x: 'Jan', y: 6, y1: 6, y2: -1 }, { x: 'Feb', y: 8, y1: 8, y2: -1.5 },
                { x: 'Mar', y: 12, y1: 11, y2: -2 }, { x: 'Apr', y: 15, y1: 16, y2: -2.5 }
            ];
            chartObj.series[1].dataSource = [
                { x: 'Jan', y: 6, y1: 6, y2: -1 }, { x: 'Feb', y: 8, y1: 8, y2: -1.5 },
                { x: 'Mar', y: 12, y1: 11, y2: -2 }, { x: 'Apr', y: 15, y1: 16, y2: -2.5 }
            ];
            chartObj.series[1].xName = 'x';
            chartObj.series[1].yName = 'y1';
            chartObj.refresh();
        });
        it('Checking with enableSideBySidePlacement', (done: Function) => {
            loaded = (args: Object): void => {
                const seriesElements: HTMLElement = document.getElementById('barElement-svg-0-region-series-0-point-3');
                expect(seriesElements.getAttribute('d') !== '').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.tilt = 0;
            chartObj.series[0].dataSource = [
                { x: 'Jan', y: 6, y1: 6, y2: -1 }, { x: 'Feb', y: 8, y1: 8, y2: -1.5 },
                { x: 'Mar', y: 12, y1: 11, y2: -2 }, { x: 'Apr', y: 15, y1: 16, y2: -2.5 }
            ];
            chartObj.series[1].dataSource = [
                { x: 'Jan', y: 6, y1: 6, y2: -1 }, { x: 'Feb', y: 8, y1: 8, y2: -1.5 },
                { x: 'Mar', y: 12, y1: 11, y2: -2 }, { x: 'Apr', y: 15, y1: 16, y2: -2.5 }
            ];
            chartObj.series[1].xName = 'x';
            chartObj.series[1].yName = 'y1';
            chartObj.enableSideBySidePlacement = true;
            chartObj.refresh();
        });
    });
    describe('Stackin Bar Series in Cyliderical shape', () => {
        let chartObj: Chart3D;
        let loaded: EmitType<Chart3DLoadedEventArgs>;
        const element: Element = createElement('div', { id: 'barElement' });
        beforeAll(() => {
            document.body.appendChild(element);
            chartObj = new Chart3D(
                {
                    primaryXAxis: { valueType: 'Category', interval: 1, majorGridLines: { width: 0 }, majorTickLines: { width: 0 }, minorTickLines: { width: 0 } },
                    primaryYAxis: { title: 'Medal Count', majorTickLines: { width: 0 }, maximum: 100, interval: 10 },
                    series: [{
                        name: 'Gold',
                        dataSource: [{ x: 'Jan', y: 6, y1: 6, y2: -1 }, { x: 'Feb', y: 8, y1: 8, y2: -1.5 },
                            { x: 'Mar', y: 12, y1: 11, y2: -2 }, { x: 'Apr', y: 15, y1: 16, y2: -2.5 },
                            { x: 'May', y: 20, y1: 21, y2: -3 }, { x: 'Jun', y: 24, y1: 25, y2: -3.5 },
                            { x: 'Jul', y: 28, y1: 27, y2: -4 }, { x: 'Aug', y: 32, y1: 31, y2: -4.5 },
                            { x: 'Sep', y: 33, y1: 34, y2: -5 }, { x: 'Oct', y: 35, y1: 34, y2: -5.5 },
                            { x: 'Nov', y: 40, y1: 41, y2: -6 }, { x: 'Dec', y: 42, y1: 42, y2: -6.5 }],
                        xName: 'x', yName: 'y', columnFacet: 'Cylinder',
                        type: 'StackingBar100', fill: 'skyblue'
                    },
                    {
                        name: 'Silver',
                        dataSource: [{ x: 'Jan', y: 6, y1: 6, y2: -1 }, { x: 'Feb', y: 8, y1: 8, y2: -1.5 },
                            { x: 'Mar', y: 12, y1: 11, y2: -2 }, { x: 'Apr', y: 15, y1: 16, y2: -2.5 },
                            { x: 'May', y: 20, y1: 21, y2: -3 }, { x: 'Jun', y: 24, y1: 25, y2: -3.5 },
                            { x: 'Jul', y: 28, y1: 27, y2: -4 }, { x: 'Aug', y: 32, y1: 31, y2: -4.5 },
                            { x: 'Sep', y: 33, y1: 34, y2: -5 }, { x: 'Oct', y: 35, y1: 34, y2: -5.5 },
                            { x: 'Nov', y: 40, y1: 41, y2: -6 }, { x: 'Dec', y: 42, y1: 42, y2: -6.5 }],
                        xName: 'x', yName: 'y1', columnFacet: 'Cylinder',
                        type: 'StackingBar100', fill: 'blue'
                    }],enableSideBySidePlacement: false,
                    width: '800', tooltip: { enable: true }, legendSettings: { visible: true },
                    title: 'Olympic Medal Counts - RIO', loaded: loaded
                });
            chartObj.appendTo('#barElement');
        });

        afterAll((): void => {
            chartObj.destroy();
            document.getElementById('barElement').remove();
        });

        it('Column Series Type with ColumnFacet property as Cylinder', (done: Function) => {
            loaded = (args: Object): void => {
                const region0: string = document.getElementById('barElement-svg-14-region-series-0-point-1').getAttribute('d');
                expect(region0 !== '').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });

        it('Checking Cylindrical chart with negative points', (done: Function) => {
            loaded = (args: Object): void => {
                const region0: string = document.getElementById('barElement-svg-17-region-series-1-point-2').getAttribute('d');
                expect(region0 !== '').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[1].dataSource = [
                { x: 'Jan', y: 6, y1: 6, y2: -1 }, { x: 'Feb', y: 8, y1: 8, y2: -1.5 },
                { x: 'Mar', y: 12, y1: -11, y2: -2 }, { x: 'Apr', y: 15, y1: 16, y2: -2.5 },
                { x: 'May', y: 20, y1: 21, y2: -3 }, { x: 'Jun', y: 24, y1: 25, y2: -3.5 },
                { x: 'Jul', y: 28, y1: 27, y2: -4 }, { x: 'Aug', y: 32, y1: 31, y2: -4.5 },
                { x: 'Sep', y: 33, y1: 34, y2: -5 }, { x: 'Oct', y: 35, y1: 34, y2: -5.5 },
                { x: 'Nov', y: 40, y1: 41, y2: -6 }, { x: 'Dec', y: 42, y1: 42, y2: -6.5 }];
            chartObj.refresh();
        });
    });
    describe('DataLabel', () => {
        let chartObj: Chart3D;
        let loaded: EmitType<Chart3DLoadedEventArgs>;
        element = createElement('div', { id: 'barElement' });
        beforeAll(() => {
            document.body.appendChild(element);
            chartObj = new Chart3D(
                {
                    primaryXAxis: { valueType: 'DateTime' },
                    series: [{
                        dataSource: [
                            { x: new Date(2000, 6, 11), y: 10 }, { x: new Date(2002, 3, 7), y: 30 },
                            { x: new Date(2004, 3, 6), y: 15 }, { x: new Date(2006, 3, 30), y: 65 },
                            { x: new Date(2008, 3, 8), y: 90 }, { x: new Date(2010, 3, 8), y: 85 }],
                        xName: 'x', yName: 'y', name: 'India',
                        type: 'StackingBar100', dataLabel: { visible: false }
                    }],
                    width: '800',enableSideBySidePlacement: false,
                    title: 'Chart TS Title', loaded: loaded,
                    legendSettings: { visible: false }
                });
            chartObj.appendTo('#barElement');

        });

        afterAll((): void => {
            chartObj.destroy();
            element.remove();
        });

        it('Showing default datalabel', (done: Function) => {
            loaded = (args: Object): void => {
                const element: HTMLElement = document.getElementById('barElement-svg-series-0-point-1-data-label');
                expect(element.textContent === '30').toBe(true);
                done();
            };
            chartObj.series[0].dataLabel.visible = true;
            chartObj.loaded = loaded;
            chartObj.refresh();
        });

        it('Showing default datalabel text', (done: Function) => {
            loaded = (args: Object): void => {
                const element: HTMLElement = document.getElementById('barElement-svg-series-0-point-2-data-label');
                expect(element.textContent === '15').toBe(true);
                expect(element.getAttribute('fill')).toBe('#212529');
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataLabel.fill = '#E94649';
            chartObj.refresh();
        });

        it('checking visibility', (done: Function) => {
            loaded = (args: Object): void => {
                const element: HTMLElement = document.getElementById('barElement-svg-series-0-point-2-data-label');
                expect(element == null).toBe(true);
                done();
            };
            chartObj.series[0].dataLabel.visible = false;
            chartObj.loaded = loaded;
            chartObj.refresh();
        });

        it('Added another series', (done: Function) => {
            loaded = (args: Object): void => {
                done();
            };
            chartObj.series = [chartObj.series[0], {
                name: 'series2', type: 'StackingBar', fill: '#ACE5FF',
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
            chartObj.enableSideBySidePlacement = true;
            chartObj.primaryXAxis.valueType = 'DateTime';
            chartObj.loaded = loaded;
            chartObj.refresh();
        });

        it('Checking default data label position with multiple series', (done: Function) => {
            loaded = (args: Object): void => {
                const point0: number = +document.getElementById('barElement-svg-series-1-point-5-data-label').getAttribute('y');
                const point1: number = +document.getElementById('barElement-svg-series-1-point-4-data-label').getAttribute('y');
                const point2: number = +document.getElementById('barElement-svg-series-1-point-5-data-label').getAttribute('x');
                const point3: number = +document.getElementById('barElement-svg-series-1-point-4-data-label').getAttribute('x');
                expect(point0 > 0).toBe(true);
                expect(point1 > 0).toBe(true);
                expect(point2 > 0).toBe(true);
                expect(point3 > 0).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.legendSettings = { visible: false };
            chartObj.tooltip.enable = false;
            chartObj.refresh();
        });

        it('Checking data label shape without fill', (done: Function) => {
            loaded = (args: Object): void => {
                const shapeElememt: HTMLElement = document.getElementById('barElement-svg-data-label-series-1-point-2');
                expect(shapeElememt.getAttribute('stroke') === 'grey').toBe(true);
                expect(shapeElememt.getAttribute('stroke-width') === '2').toBe(true); done();
            };
            chartObj.loaded = loaded;
            chartObj.series[1].dataLabel.border.width = 2;
            chartObj.series[1].dataLabel.border.color = 'grey';
            chartObj.refresh();
        });

        it('Checking font color saturation - background black', (done: Function) => {
            loaded = (args: Object): void => {
                const textElement: HTMLElement = document.getElementById('barElement-svg-series-1-point-3-data-label');
                expect(textElement.getAttribute('fill')).toBe('#212529');
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });

        it('Checking font color saturation - background white', (done: Function) => {
            loaded = (args: Object): void => {
                const textElement: HTMLElement = document.getElementById('barElement-svg-series-1-point-3-data-label');
                expect(textElement.getAttribute('fill')).toBe('#212529'); done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });

        it('Checking dataLabel positions Top', (done: Function) => {
            loaded = (args: Object): void => {
                const textElement: Element = document.getElementById('barElement-svg-series-1-point-3-data-label');
                expect(textElement.getAttribute('y') !== '').toBe(true);
                expect(textElement.getAttribute('x') !== '').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[1].dataLabel.position = 'Top';
            chartObj.refresh();
        });

        it('Checking dataLabel positions Middle', (done: Function) => {
            loaded = (args: Object): void => {
                const textElement: Element = document.getElementById('barElement-svg-series-1-point-3-data-label');
                expect(textElement.getAttribute('y') !== '').toBe(true);
                expect(textElement.getAttribute('x') !== '').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[1].dataLabel.position = 'Middle';
            chartObj.refresh();
        });

        it('Checking dataLabel positions as top', (done: Function) => {
            loaded = (args: Object): void => {
                const textElement: Element = document.getElementById('barElement-svg-series-1-point-3-data-label');
                expect(textElement.getAttribute('y') === '201.57092691431535');
                expect(textElement.getAttribute('x') === '460.6462158531124');
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[1].dataLabel.position = 'Top';
            chartObj.refresh();
        });

        it('Checking dataLabel positions Bottom', (done: Function) => {
            loaded = (args: Object): void => {
                const textElement: Element = document.getElementById('barElement-svg-series-1-point-3-data-label');
                expect(textElement.getAttribute('y') !== '').toBe(true);
                expect(textElement.getAttribute('x') !== '').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[1].dataLabel.position = 'Bottom';
            chartObj.refresh();
        });

        it('Checking font color saturation with font color', (done: Function) => {
            loaded = (args: Object): void => {
                const textElement: Element = document.getElementById('barElement-svg-series-1-point-2-data-label');
                expect(textElement.getAttribute('fill') === 'green').toBe(true); done();
            };
            chartObj.loaded = loaded;
            chartObj.series[1].dataLabel.font.color = 'green';
            chartObj.series[1].dataLabel.position = 'Middle';
            chartObj.refresh();
        });

        it('Checking Data label format with globalize format', (done: Function) => {
            loaded = (args: Object): void => {
                const textElement: Element = document.getElementById('barElement-svg-series-1-point-5-data-label');
                expect(textElement.textContent === '20.00').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryYAxis.labelFormat = 'n2';
            chartObj.refresh();
        });

        it('Checking margin', (done: Function) => {
            loaded = (args: Object): void => {
                const shape: HTMLElement = document.getElementById('barElement-svg-series-1-point-5-data-label');
                const shapeY: number = + shape.getAttribute('y');
                const shapeX: number = + shape.getAttribute('x');
                const shapeWidth: number = + shape.getAttribute('width');
                const shapeHeight: number = + shape.getAttribute('height');
                const text: HTMLElement = document.getElementById('barElement-svg-series-1-point-4-data-label');
                const textX: number = + text.getAttribute('x');
                const textY: number = + text.getAttribute('y');
                expect(textX < (shapeX + 20)).toBe(true);
                expect(textY > (shapeY + 25)).toBe(true);
                expect(textY > (shapeY + shapeHeight - 5)).toBe(true);
                expect(textX < (shapeX + shapeWidth - 10)).toBe(true); done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataLabel.margin = {
                left: 20,
                right: 10,
                top: 25,
                bottom: 5
            };
            chartObj.primaryYAxis.labelFormat = 'p'
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
