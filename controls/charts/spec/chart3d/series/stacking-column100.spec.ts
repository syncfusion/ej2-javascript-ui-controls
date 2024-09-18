/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Stacking Column Series Spec
 */
import { EmitType, createElement } from '@syncfusion/ej2-base';
import { Chart3D } from '../../../src/chart3d/chart3D';
import { Chart3DLoadedEventArgs, Chart3DPointRenderEventArgs } from '../../../src/chart3d/model/chart3d-Interface';
import { Category3D } from '../../../src/chart3d/axis/category-axis';
import { DateTime3D } from '../../../src/chart3d/axis/date-time-axis';
import { DateTimeCategory3D } from '../../../src/chart3d/axis/date-time-category-axis';
import { DataLabel3D } from '../../../src/chart3d/series/data-label';
import { profile, inMB, getMemoryProfile } from '../../common.spec';
import { Logarithmic3D } from '../../../src/chart3d/axis/logarithmic-axis';
import { StackingColumnSeries3D } from '../../../src/chart3d/series/stacking-column-series';
import { Chart3DPoint, Chart3DSeries } from '../../../src/chart3d';
import { Double3D } from '../../../src/chart3d/axis/double-axis';

Chart3D.Inject(StackingColumnSeries3D, Double3D, Category3D, DateTime3D, DateTimeCategory3D, Logarithmic3D);

describe('Stacking Column-100 Series', () => {

    let element: HTMLElement;
    /**
     * Default Stacking Column Seriess
     */
    describe('Stacking Column-100 Series', () => {
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
                        name: 'SeriesOne', dataSource: [],
                        type: 'StackingColumn100'
                    },
                    {
                        name: 'SeriesTwo', dataSource: [],
                        type: 'StackingColumn100'
                    }],
                    width: '800',enableSideBySidePlacement: false,
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
                expect(yAxisLabel.textContent === '1%').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });

        it('Added data Source', (done: Function) => {
            loaded = (args: Object): void => {
                const svg: HTMLElement = document.getElementById('container-svg-0-region-series-0-point-0');
                expect(svg.getAttribute('d') !== '').toBe(true);
                const svg1: HTMLElement = document.getElementById('container-svg-0-region-series-1-point-0');
                expect(svg1.getAttribute('d') !== '').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource = [{
                x: 1,
                y: 10
            }];
            chartObj.series[1].dataSource = [{
                x: 1,
                y: 20
            }];
            chartObj.series[0].xName = 'x';
            chartObj.series[0].yName = 'y';
            chartObj.series[1].xName = 'x';
            chartObj.series[1].yName = 'y';
            chartObj.refresh();
        });

        it('checking datasource in Chart', (done: Function) => {
            chartObj.series[0].dataSource = null;
            chartObj.loaded = (args: Object) => {
                const svg: HTMLElement = document.getElementById('container-svg-0-region-series-0-point-0');
                expect(svg.getAttribute('d')).toBe('M 185.19626168224298 290.12149532710276 L 185.19626168224298 290.12149532710276 L 674.0934579439252 290.12149532710276 L 674.0934579439252 387.31775700934577 L 185.19626168224298 387.31775700934577 ');
                const svg1: HTMLElement = document.getElementById('container-svg-0-region-series-1-point-0');
                expect(svg1.getAttribute('d')).toBe('M 185.19626168224298 104.47663551401868 L 185.19626168224298 104.47663551401868 L 674.0934579439252 104.47663551401868 L 674.0934579439252 290.12149532710276 L 185.19626168224298 290.12149532710276 ');
                done();
            };
            chartObj.series[0].dataSource = [{
                x: 10,
                y: 10.5
            }];
            chartObj.series[1].dataSource = [{
                x: 10,
                y: 20
            }];
            chartObj.refresh();
        });

        it('Single data point with range', (done: Function) => {
            loaded = (args: Object): void => {
                const svg: HTMLElement = document.getElementById('container-svg-0-region-series-1-point-0');
                expect(svg.getAttribute('d') !== '').toBe(true);
                const xAxisLabel: HTMLElement = document.getElementById('container-0-axis-label-0');
                expect(xAxisLabel.textContent === '$9.50').toBe(true);
                const yAxisLabel: HTMLElement = document.getElementById('container-1-axis-label-0');
                expect(yAxisLabel.textContent === '8%').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.interval = 1;
            chartObj.primaryYAxis.minimum = 8;
            chartObj.primaryYAxis.maximum = 25;
            chartObj.primaryYAxis.interval = 1;
            chartObj.refresh();
        });

        it('Checking series visibility', (done: Function) => {
            loaded = (args: Object): void => {
                const seriesElements: Element = document.getElementById('container-svg-0-region-series-0-point-0');
                expect(seriesElements === null).toBe(true);
                const seriesElements1: Element = document.getElementById('container-svg-0-region-series-1-point-0');
                expect(seriesElements1 === null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].visible = false;
            chartObj.series[1].visible = false;
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
            chartObj.series[1].visible = true;
            chartObj.series[0].dataSource = [
                { x: 1000, y: 70 }, { x: 2000, y: 40 },
                { x: 3000, y: 70 }, { x: 4000, y: 60 },
                { x: 5000, y: 50 }, { x: 6000, y: 40 },
                { x: 7000, y: 40 }, { x: 8000, y: 70 }];
            chartObj.series[0].xName = 'x';
            chartObj.series[0].yName = 'y';
            chartObj.series[1].dataSource = [
                { x: 1000, y: 90 }, { x: 2000, y: 60 },
                { x: 3000, y: 90 }, { x: 4000, y: 80 },
                { x: 5000, y: 70 }, { x: 6000, y: 60 },
                { x: 7000, y: 60 }, { x: 8000, y: 90 }];
            chartObj.series[1].xName = 'x';
            chartObj.series[1].yName = 'y';
            chartObj.refresh();
        });

        it('Checking stacking end values for last series', (done: Function) => {
            loaded = (args: Object): void => {
                const series2: Chart3DSeries = chartObj.series[1] as Chart3DSeries;
                expect(Math.round(series2.stackedValues.endValues[0]) === 100).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });

        it('Checking with axis maximum as based on stacking series endvalues', (done: Function) => {
            loaded = (args: Object): void => {
                const series2: Chart3DSeries = chartObj.series[1] as Chart3DSeries;
                expect(series2.yMax === 100).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });

        it('Checking with each point percentage value', (done: Function) => {
            loaded = (args: Object): void => {
                const point: Chart3DPoint = chartObj.visibleSeries[0].points[0];
                expect(point.percentage != null).toBe(true);
                expect(point.percentage).toBe(43.75);
                done();
            };
            chartObj.loaded = loaded;
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
            chartObj.series[1].dataSource = [
                { x: new Date(2000, 6, 11), y: 15 }, { x: new Date(2002, 3, 7), y: 35 },
                { x: new Date(2004, 3, 6), y: 20 }, { x: new Date(2006, 3, 30), y: 70 },
                { x: new Date(2008, 3, 8), y: 60 }, { x: new Date(2010, 3, 8), y: 60 }
            ];
            chartObj.primaryXAxis.valueType = 'DateTime';
            chartObj.primaryXAxis.labelFormat = null;
            chartObj.refresh();
        });

        it('with empty point(y Value)', (done: Function) => {
            loaded = (args: Object): void => {
                const seriesElements: HTMLElement = document.getElementById('container-svg-0-region-series-0-point-3');
                expect(seriesElements === null).toBe(true);
                const seriesElements1: HTMLElement = document.getElementById('container-svg-0-region-series-1-point-3');
                expect(seriesElements1 === null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            const dataSource: Object = [
                { x: '2000/6/1', y: 10 }, { x: '2002/3/7', y: 30 },
                { x: '2004/3/6', y: 15 }, { x: '2006/3/30', y: 65 },
                { x: '2008/3/8', y: 90 }, { x: '2010/3/8', y: 85 }
            ];
            dataSource[3].y = null;
            const dataSource1: Object = [
                { x: '2000/6/1', y: 10 }, { x: '2002/3/7', y: 30 },
                { x: '2004/3/6', y: 15 }, { x: '2006/3/30', y: 65 },
                { x: '2008/3/8', y: 90 }, { x: '2010/3/8', y: 85 }
            ];
            dataSource1[3].y = null;
            chartObj.series[0].dataSource = dataSource;
            chartObj.series[1].dataSource = dataSource1;
            chartObj.primaryXAxis.valueType = 'Category';
            chartObj.refresh();
        });

        it('with empty point(x Value)', (done: Function) => {
            loaded = (args: Object): void => {
                const seriesElements: HTMLElement = document.getElementById('container-svg-0-region-series-0-point-3');
                expect(seriesElements != null).toBe(true);
                const seriesElements1: HTMLElement = document.getElementById('container-svg-0-region-series-1-point-3');
                expect(seriesElements1 != null).toBe(true);
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
            const dataSource1: object = [
                { x: '2000/6/1', y: 10 }, { x: '2002/3/7', y: 30 },
                { x: '2004/3/6', y: 15 }, { x: '2006/3/30', y: 65 },
                { x: '2008/3/8', y: 90 }, { x: '2010/3/8', y: 85 }
            ];
            dataSource1[3].y = 10;
            dataSource1[3].x = null;
            chartObj.series[1].dataSource = dataSource1;
            chartObj.refresh();
        });

        it('with empty point(x and y Value)', (done: Function) => {
            loaded = (args: Object): void => {
                const seriesElements: HTMLElement = document.getElementById('container-svg-0-region-series-0-point-3');
                expect(seriesElements != null).toBe(true);
                const seriesElements1: HTMLElement = document.getElementById('container-svg-0-region-series-1-point-3');
                expect(seriesElements1 != null).toBe(true);
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
            chartObj.series[1].dataSource = dataSource;
            chartObj.refresh();
        });

        it('with fill and opacity', (done: Function) => {
            loaded = (args: Object): void => {
                let seriesElements: HTMLElement = document.getElementById('container-svg-0-region-series-0-point-3');
                expect(seriesElements.getAttribute('fill') === '#ff0000').toBe(true);
                seriesElements = document.getElementById('container-svg-2-region-series-0-point-3');
                expect(seriesElements.getAttribute('fill') === '#E50000').toBe(true);
                seriesElements = document.getElementById('container-svg-4-region-series-0-point-3');
                expect(seriesElements.getAttribute('fill') === '#B20000').toBe(true);
                seriesElements = document.getElementById('container-svg-0-region-series-1-point-3');
                expect(seriesElements.getAttribute('fill') === '#008000').toBe(true);
                seriesElements = document.getElementById('container-svg-2-region-series-1-point-3');
                expect(seriesElements.getAttribute('fill') === '#007300').toBe(true);
                seriesElements = document.getElementById('container-svg-4-region-series-1-point-3');
                expect(seriesElements.getAttribute('fill') === '#005900').toBe(true);
                expect(seriesElements.getAttribute('opacity') === '0.5').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource = [
                { x: 1000, y: 70 }, { x: 2000, y: 40 },
                { x: 3000, y: 70 }, { x: 4000, y: 60 },
                { x: 5000, y: 50 }, { x: 6000, y: 40 },
                { x: 7000, y: 40 }, { x: 8000, y: 70 }];
            chartObj.series[0].fill = 'red';
            chartObj.series[1].dataSource = [{ x: 1000, y: 90 }, { x: 2000, y: 60 },
            { x: 3000, y: 90 }, { x: 4000, y: 80 },
            { x: 5000, y: 70 }, { x: 6000, y: 60 },
            { x: 7000, y: 60 }, { x: 8000, y: 90 }];
            chartObj.series[1].fill = 'green';
            chartObj.series[0].opacity = 0.6;
            chartObj.series[1].opacity = 0.5;
            chartObj.refresh();
        });

        it('within xAxis range', (done: Function) => {
            loaded = (args: Object): void => {
                let seriesElements: Element = document.getElementById('container-svg-0-region-series-0-point-4');
                expect(seriesElements.getAttribute('d') !== null).toBe(true);
                seriesElements = document.getElementById('container-svg-0-region-series-0-point-5');
                expect(seriesElements.getAttribute('d') !== null).toBe(true);
                seriesElements = document.getElementById('container-svg-0-region-series-1-point-4');
                expect(seriesElements.getAttribute('d') !== null).toBe(true);
                seriesElements = document.getElementById('container-svg-0-region-series-1-point-5');
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

        it('Stacking Column-100 Series with negative', (done: Function) => {
            loaded = (args: Object): void => {
                const seriesElements: HTMLElement = document.getElementById('container-svg-0-region-series-0-point-1');
                expect(seriesElements.getAttribute('d')).toBe('M 205.607476635514 132.66355140186914 L 205.607476635514 132.66355140186914 L 278.50467289719626 132.66355140186914 L 278.50467289719626 218.19626168224298 L 205.607476635514 218.19626168224298 ');
                const seriesElement1: HTMLElement = document.getElementById('container-svg-0-region-series-0-point-3');
                expect(seriesElement1.getAttribute('d')).toBe('M 451.5140186915887 141.411214953271 L 451.5140186915887 141.411214953271 L 524.411214953271 141.411214953271 L 524.411214953271 218.19626168224298 L 451.5140186915887 218.19626168224298 ');
                const seriesElements2: HTMLElement = document.getElementById('container-svg-0-region-series-1-point-1');
                expect(seriesElements2.getAttribute('d')).toBe('M 205.607476635514 76.28971962616822 L 205.607476635514 76.28971962616822 L 278.50467289719626 76.28971962616822 L 278.50467289719626 132.66355140186914 L 205.607476635514 132.66355140186914 ');
                const seriesElement3: HTMLElement = document.getElementById('container-svg-0-region-series-1-point-3');
                expect(seriesElement3.getAttribute('d')).toBe('M 451.5140186915887 76.28971962616822 L 451.5140186915887 76.28971962616822 L 524.411214953271 76.28971962616822 L 524.411214953271 141.411214953271 L 451.5140186915887 141.411214953271 ');
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource = [
                { x: new Date(2000, 6, 11), y: -10 }, { x: new Date(2002, 3, 7), y: 30 },
                { x: new Date(2004, 3, 6), y: -15 }, { x: new Date(2006, 3, 30), y: 65 },
                { x: new Date(2008, 3, 8), y: 90 }, { x: new Date(2010, 3, 8), y: 85 }
            ];
            chartObj.series[1].dataSource = [
                { x: new Date(2000, 6, 11), y: -20 }, { x: new Date(2002, 3, 7), y: 20 },
                { x: new Date(2004, 3, 6), y: -25 }, { x: new Date(2006, 3, 30), y: 55 },
                { x: new Date(2008, 3, 8), y: 80 }, { x: new Date(2010, 3, 8), y: 95 }
            ];
            chartObj.primaryXAxis.valueType = 'DateTime';
            chartObj.primaryXAxis.minimum = null;
            chartObj.primaryXAxis.maximum = null;
            chartObj.primaryXAxis.interval = null;
            chartObj.series[0].fill = 'red';
            chartObj.refresh();
        });

        it('Stacking Column-100 Series with Rotation', (done: Function) => {
            loaded = (args: Object): void => {
                const seriesElements: HTMLElement = document.getElementById('container-svg-0-region-series-0-point-3');
                expect(seriesElements.getAttribute('d')).toBe('M 427.1172547121968 309.6679246235514 L 427.1172547121968 309.6679246235514 L 484.1108568248266 313.30402383826873 L 484.1108568248266 398.49143507048086 L 427.1172547121968 391.3475695545069 ');
                const seriesElements1: HTMLElement = document.getElementById('container-svg-0-region-series-1-point-3');
                expect(seriesElements1.getAttribute('d')).toBe('M 427.1172547121968 101.48443937270156 L 427.1172547121968 101.48443937270156 L 484.1108568248266 96.18001228299629 L 484.1108568248266 313.30402383826873 L 427.1172547121968 309.6679246235514 ');
                done();
            };
            chartObj.loaded = loaded;
            chartObj.rotation = 45;
            chartObj.series[0].dataSource = [
                { x: new Date(2000, 6, 11), y: 10 }, { x: new Date(2002, 3, 7), y: 30 },
                { x: new Date(2004, 3, 6), y: 15 }, { x: new Date(2006, 3, 30), y: 65 },
                { x: new Date(2008, 3, 8), y: 90 }, { x: new Date(2010, 3, 8), y: 85 }
            ];
            chartObj.series[1].dataSource = [
                { x: new Date(2000, 6, 11), y: 20 }, { x: new Date(2002, 3, 7), y: 130 },
                { x: new Date(2004, 3, 6), y: 25 }, { x: new Date(2006, 3, 30), y: 165 },
                { x: new Date(2008, 3, 8), y: 100 }, { x: new Date(2010, 3, 8), y: 185 }
            ];
            chartObj.refresh();
        });

        it('Stacking Column-100 Series with Depth', (done: Function) => {
            loaded = (args: Object): void => {
                const seriesElements: HTMLElement = document.getElementById('container-svg-0-region-series-0-point-3');
                expect(seriesElements.getAttribute('d') === 'M 449.70460959548444 307.8410159924741 L 449.70460959548444 307.8410159924741 L 523.7742238946378 307.8410159924741 L 523.7742238946378 387.75823142050797 L 449.70460959548444 387.75823142050797 ').toBe(true);
                const seriesElements1: HTMLElement = document.getElementById('container-svg-0-region-series-1-point-3');
                expect(seriesElements1.getAttribute('d') === 'M 449.70460959548444 104.14957666980244 L 449.70460959548444 104.14957666980244 L 523.7742238946378 104.14957666980244 L 523.7742238946378 307.8410159924741 L 449.70460959548444 307.8410159924741 ').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.rotation = 0;
            chartObj.depth = 45;
            chartObj.refresh();
        });

        it('Stacking Column-100 Series with perspectiveAngle', (done: Function) => {
            loaded = (args: Object): void => {
                const seriesElements: HTMLElement = document.getElementById('container-svg-0-region-series-0-point-3');
                expect(seriesElements.getAttribute('d') === 'M 429.14285714285717 273.57142857142856 L 429.14285714285717 273.57142857142856 L 472.57142857142856 273.57142857142856 L 472.57142857142856 320.42857142857144 L 429.14285714285717 320.42857142857144 ').toBe(true);
                const seriesElements1: HTMLElement = document.getElementById('container-svg-0-region-series-1-point-3');
                expect(seriesElements1.getAttribute('d') === 'M 429.14285714285717 154.14285714285714 L 429.14285714285717 154.14285714285714 L 472.57142857142856 154.14285714285714 L 472.57142857142856 273.57142857142856 L 429.14285714285717 273.57142857142856 ').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.depth = 100;
            chartObj.perspectiveAngle = 180;
            chartObj.refresh();
        });

        it('Stacking Column-100 Series with Tilt', (done: Function) => {
            loaded = (args: Object): void => {
                const seriesElements: HTMLElement = document.getElementById('container-svg-0-region-series-0-point-3');
                expect(seriesElements.getAttribute('d') === 'M 446.1329280177647 295.3588173746814 L 446.1329280177647 295.3588173746814 L 514.8800364363944 295.3588173746814 L 510.58371177074093 343.2152957206217 L 444.40763228588804 343.2152957206217 ').toBe(true);
                const seriesElements1: HTMLElement = document.getElementById('container-svg-0-region-series-1-point-3');
                expect(seriesElements1.getAttribute('d') === 'M 451.203254557926 154.7174375851701 L 451.203254557926 154.7174375851701 L 527.5061437030708 154.7174375851701 L 514.8800364363944 295.3588173746814 L 446.1329280177647 295.3588173746814 ').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.perspectiveAngle = 90;
            chartObj.tilt = 45;
            chartObj.refresh();
        });


        it('Checking Events', (done: Function) => {
            loaded = (args: Object): void => {
                let element: HTMLElement = document.getElementById('container-svg-0-region-series-0-point-2');
                expect(element.getAttribute('fill') === '#a52a2a').toBe(true);
                element = document.getElementById('container-svg-0-region-series-0-point-0');
                expect(element == null).toBe(true);
                let element1: HTMLElement = document.getElementById('container-svg-0-region-series-1-point-3');
                expect(element1.getAttribute('fill') === '#008000').toBe(true);
                element1 = document.getElementById('container-svg-0-region-series-1-point-0');
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
                name: 'series', type: 'StackingColumn100',
                dataSource: [
                    { x: new Date(2000, 6, 11), y: 1200 }, { x: new Date(2002, 3, 7), y: 3500 },
                    { x: new Date(2004, 3, 6), y: 2000 }, { x: new Date(2006, 3, 30), y: 7000 },
                    { x: new Date(2008, 3, 8), y: 8500 }, { x: new Date(2010, 3, 8), y: 9200 }
                ],
                xName: 'x', yName: 'y'
            },
            {
                name: 'series', type: 'StackingColumn100',
                dataSource: [
                    { x: new Date(2000, 6, 11), y: 1500 }, { x: new Date(2002, 3, 7), y: 4500 },
                    { x: new Date(2004, 3, 6), y: 2500 }, { x: new Date(2006, 3, 30), y: 8000 },
                    { x: new Date(2008, 3, 8), y: 9500 }, { x: new Date(2010, 3, 8), y: 5200 }
                ],
                xName: 'x', yName: 'y'
            }];
            chartObj.primaryYAxis = { minimum: 0, maximum: 100000, interval: 1, valueType: 'Logarithmic' };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
    });

    describe('Stacking Column-100 Series in Cyliderical shape', () => {
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
                        type: 'StackingColumn100', fill: 'skyblue'
                    },
                    {
                        name: 'Silver',
                        dataSource: [{ x: 'GBR', y: 37, tooltipMappingName: 'Great Britain' },
                            { x: 'CHN', y: 36, tooltipMappingName: 'China' },
                            { x: 'AUS', y: 18, tooltipMappingName: 'Australia' },
                            { x: 'RUS', y: 29, tooltipMappingName: 'Russia' },
                            { x: 'GER', y: 27, tooltipMappingName: 'Germany' },
                            { x: 'UA', y: 12, tooltipMappingName: 'Ukraine' },
                            { x: 'ES', y: 17, tooltipMappingName: 'Spain' },
                            { x: 'UZB', y: 14, tooltipMappingName: 'Uzbekistan' },
                            { x: 'JPN', y: 22, tooltipMappingName: 'Japan' },
                            { x: 'NL', y: 18, tooltipMappingName: 'NetherLand' },
                            { x: 'USA', y: 56, tooltipMappingName: 'United States' }],
                        xName: 'x', yName: 'y', columnFacet: 'Cylinder',
                        type: 'StackingColumn100'
                    }],
                    width: '800',
                    enableSideBySidePlacement: false, tooltip: { enable: true }, legendSettings: { visible: true },
                    title: 'Olympic Medal Counts - RIO', loaded: loaded
                });
            chartObj.appendTo('#container');
        });

        afterAll((): void => {
            chartObj.destroy();
            document.getElementById('container').remove();
        });

        it('Stacking Column-100 Series Type with ColumnFacet property as Cylinder', (done: Function) => {
            loaded = (args: Object): void => {
                const region10: string = document.getElementById('container-svg-10-region-series-0-point-1').getAttribute('d');
                expect(region10).toBe('M 168.5779387411695 103.67656644015904 L 168.5779387411695 103.67656644015904 L 168.5779387411695 375.9378149799596 L 165.76288736304298 376.1584705595699 L 165.76288736304298 103.49920404389009 ');
                const region20: string = document.getElementById('container-svg-20-region-series-0-point-1').getAttribute('d');
                expect(region20).toBe('M 170.61682242990653 101.5607476635514 L 170.61682242990653 101.5607476635514 L 170.61682242990653 378.5700934579439 L 173.83337569605072 378.5212045963204 L 173.83337569605072 101.60004440675519 ');
                const region25: string = document.getElementById('container-svg-25-region-series-0-point-1').getAttribute('d');
                expect(region25).toBe('M 183.84962723238445 102.40991993090253 L 183.84962723238445 102.40991993090253 L 183.84962723238445 377.51364292060947 L 184.77777777777777 377.14814814814815 L 184.77777777777777 102.7037037037037 ');
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });

        it('Checking Cylindrical chart with negative points', (done: Function) => {
            loaded = (args: Object): void => {
                const region10: string = document.getElementById('container-svg-10-region-series-0-point-0').getAttribute('d');
                expect(region10 ).toBe( 'M 425.0766939444553 159.0841187745746 L 425.0766939444553 159.0841187745746 L 425.0766939444553 250.7931709142969 L 422.63661739623603 250.83087788043287 L 422.63661739623603 158.9877565277828 ');
                const region20: string = document.getElementById('container-svg-20-region-series-0-point-0').getAttribute('d');
                expect(region20).toBe( 'M 431.5887850467289 157.93457943925233 L 431.5887850467289 157.93457943925233 L 431.5887850467289 251.24299065420558 L 434.72225819043047 251.23463622848513 L 434.72225819043047 157.95592963831584 ');
                const region25: string = document.getElementById('container-svg-25-region-series-0-point-0').getAttribute('d');
                expect(region25).toBe( 'M 443.0262925753188 158.39594074986044 L 443.0262925753188 158.39594074986044 L 443.0262925753188 251.06245796744594 L 443.3333333333333 250.99999999999997 L 443.3333333333333 158.55555555555554 ');
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource = [{ x: 'GBR', y: -27, tooltipMappingName: 'Great Britain' }];
            chartObj.series[1].dataSource = [{ x: 'GBR', y: -37, tooltipMappingName: 'Great Britain' }];
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
                        type: 'StackingColumn100', dataLabel: { visible: false }
                    }, {
                        dataSource: [
                            { x: new Date(2000, 6, 11), y: 20 }, { x: new Date(2002, 3, 7), y: 40 },
                            { x: new Date(2004, 3, 6), y: 25 }, { x: new Date(2006, 3, 30), y: 75 },
                            { x: new Date(2008, 3, 8), y: 100 }, { x: new Date(2010, 3, 8), y: 95 }],
                        xName: 'x', yName: 'y', name: 'SriLanka',
                        type: 'StackingColumn100', dataLabel: { visible: false }
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
                const element1: HTMLElement = document.getElementById('container-svg-series-1-point-3-data-label');
                expect(element1.textContent === '75').toBe(true);
                done();
            };
            chartObj.series[0].dataLabel.visible = true;
            chartObj.series[1].dataLabel.visible = true;
            chartObj.loaded = loaded;
            chartObj.refresh();
        });

        it('Showing default datalabel text', (done: Function) => {
            loaded = (args: Object): void => {
                const element: HTMLElement = document.getElementById('container-svg-series-0-point-3-data-label');
                expect(element.textContent === '65').toBe(true);
                expect(element.getAttribute('fill')).toBe( '#212529');
                const element1: HTMLElement = document.getElementById('container-svg-series-1-point-3-data-label');
                expect(element1.textContent === '75').toBe(true);
                expect(element1.getAttribute('fill')).toBe('#212529');
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataLabel.fill = '#E94649';
            chartObj.series[1].dataLabel.fill = '#E94649';
            chartObj.refresh();
        });

        it('checking visibility', (done: Function) => {
            loaded = (args: Object): void => {
                const element: HTMLElement = document.getElementById('container-svg-series-0-point-3-data-label');
                expect(element == null).toBe(true);
                const element1: HTMLElement = document.getElementById('container-svg-series-1-point-3-data-label');
                expect(element1 == null).toBe(true);
                done();
            };
            chartObj.series[0].dataLabel.visible = false;
            chartObj.series[1].dataLabel.visible = false;
            chartObj.loaded = loaded;
            chartObj.refresh();
        });

        it('Checking default data label position', (done: Function) => {
            loaded = (args: Object): void => {
                const point0: number = +document.getElementById('container-svg-series-0-point-3-data-label').getAttribute('y');
                const point1: number = +document.getElementById('container-svg-series-0-point-3-data-label').getAttribute('x');
                const point2: number = +document.getElementById('container-svg-series-1-point-3-data-label').getAttribute('y');
                const point3: number = +document.getElementById('container-svg-series-1-point-3-data-label').getAttribute('x');
                const point4: number = +document.getElementById('container-svg-series-0-point-5-data-label').getAttribute('y');
                const point5: number = +document.getElementById('container-svg-series-0-point-5-data-label').getAttribute('x');
                const point6: number = +document.getElementById('container-svg-series-1-point-5-data-label').getAttribute('y');
                const point7: number = +document.getElementById('container-svg-series-1-point-5-data-label').getAttribute('x');
                expect(point0).toBe(326.0841121495327);
                expect(point1).toBe(476.7850467289719);
                expect(point2).toBe(145.29906542056074);
                expect(point3).toBe(476.7850467289719);
                expect(point4).toBe(324.14018691588785);
                expect(point5).toBe(724.6355140186915);
                expect(point6).toBe(143.3551401869159);
                expect(point7).toBe(724.6355140186915);
                done();
            };
            chartObj.series[0].dataLabel.visible = true;
            chartObj.series[1].dataLabel.visible = true;
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
                expect(textElement.getAttribute('fill') ).toBe('#212529');
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataLabel.fill = 'white';
            chartObj.refresh();
        });

        it('Checking dataLabel positions Top', (done: Function) => {
            loaded = (args: Object): void => {
                const textElement: Element = document.getElementById('container-svg-series-0-point-3-data-label');
                expect(textElement.getAttribute('y')).toBe('408.3874709976798');
                expect(textElement.getAttribute('x')).toBe('476.25058004640374');
                const textElement1: Element = document.getElementById('container-svg-series-1-point-3-data-label');
                expect(textElement1.getAttribute('y')).toBe('241.40835266821347');
                expect(textElement1.getAttribute('x')).toBe('476.25058004640374');
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
                expect(textElement.getAttribute('y')).toBe('326.0841121495327');
                expect(textElement.getAttribute('x')).toBe('476.7850467289719');
                const textElement1: Element = document.getElementById('container-svg-series-1-point-3-data-label');
                expect(textElement1.getAttribute('y')).toBe('145.29906542056074');
                expect(textElement1.getAttribute('x')).toBe('476.7850467289719');
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
                expect(textElement.getAttribute('y')).toBe('408.3874709976798');
                expect(textElement.getAttribute('x')).toBe('476.25058004640374');
                const textElement1: Element = document.getElementById('container-svg-series-1-point-3-data-label');
                expect(textElement1.getAttribute('y')).toBe('241.40835266821347');
                expect(textElement1.getAttribute('x')).toBe('476.25058004640374');
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
                expect(textElement.getAttribute('y')).toBe('242.37354988399073');
                expect(textElement.getAttribute('x')).toBe('476.25058004640374');
                const textElement1: Element = document.getElementById('container-svg-series-1-point-3-data-label');
                expect(textElement1.getAttribute('y')).toBe('50.299303944315554');
                expect(textElement1.getAttribute('x')).toBe('476.25058004640374');
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
                expect(shape.getAttribute('d')).toBe('M 448.1809744779583 376.24747099767984 L 498.1809744779583 376.24747099767984 L 498.1809744779583 417.24747099767984 L 448.1809744779583 417.24747099767984 L 448.1809744779583 376.24747099767984 z');
                expect(textX).toBe(478.1809744779583 );
                expect(textY).toBe(408.3874709976798);
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
                expect(textElement.textContent === '75%').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[1].dataLabel.format = '{value}%';
            chartObj.refresh();
        });

        it('Checking Data label template', (done: Function) => {
            loaded = (args: Object): void => {
                expect(document.getElementById('container-series-1-data-label-5').style.left).toBe('715.376px');
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[1].dataLabel.template = '<div>${point.y}</div>';
            chartObj.refresh();
        });
    });

    describe('checking StackingColumn-100 Width and Spacing', () => {
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
                        type: 'StackingColumn100', name: 'India', xName: 'x', yName: 'y', fill: 'skyblue', visible: true,
                        dataSource: [
                            { x: 2005, y: 28 }, { x: 2006, y: 25 }, { x: 2007, y: 26 }, { x: 2008, y: 27 }
                        ],
                        dataLabel: { visible: true }
                    },
                    {
                        type: 'StackingColumn100', name: 'Germany', xName: 'x', yName: 'y', fill: 'purple', visible: true,
                        opacity: 0.8,
                        dataSource: [
                            { x: 2005, y: 31 }, { x: 2006, y: 28 }, { x: 2007, y: 30 }, { x: 2008, y: 36 }
                        ],
                        dataLabel: { visible: true }
                    },
                    {
                        type: 'StackingColumn100', name: 'Italy', xName: 'x', yName: 'y', fill: 'lightgreen', visible: true,
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

        it('Stacking Column-100 width and spacing checking', (done: Function) => {
            loaded = (args: Object): void => {
                let point: Element = document.getElementById('container-svg-0-region-series-0-point-0-front-front-front');
                let path: string[] = point.getAttribute('d').split(' ');
                let x: number = parseInt(path[1], 10);
                expect(x).toBe(198);
                point = document.getElementById('container-svg-0-region-series-1-point-0');
                path = point.getAttribute('d').split(' ');
                x = parseInt(path[1], 10);
                expect(x).toBe(88);
                point = document.getElementById('container-svg-0-region-series-2-point-0');
                path = point.getAttribute('d').split(' ');
                x = parseInt(path[1], 10);
                expect(x).toBe(88);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryYAxis.labelFormat = 'p'
            chartObj.series[0].columnWidth = 0.6;
            chartObj.series[0].columnSpacing = 0.5;
            chartObj.series[1].columnWidth = 0.6;
            chartObj.series[1].columnSpacing = 0.5;
            chartObj.series[2].columnWidth = 0.6;
            chartObj.series[2].columnSpacing = 0.5;
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
