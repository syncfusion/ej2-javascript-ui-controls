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
                expect(svg1.getAttribute('d') === 'M 171.58878504672896 90.86915887850468 L 171.58878504672896 90.86915887850468 L 672.1495327102804 90.86915887850468 L 672.1495327102804 387.31775700934577 L 171.58878504672896 387.31775700934577 '
                || svg1.getAttribute('d') === 'M 175.47663551401868 92.81308411214953 L 175.47663551401868 92.81308411214953 L 672.1495327102804 92.81308411214953 L 672.1495327102804 383.429906542056 L 175.47663551401868 383.429906542056 ').toBe(true);
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
                expect(seriesElements.getAttribute('d') === 'M 193.94392523364485 238.607476635514 L 193.94392523364485 238.607476635514 L 268.78504672897196 238.607476635514 L 268.78504672897196 302.75700934579436 L 193.94392523364485 302.75700934579436 '
                || seriesElements.getAttribute('d') === 'M 196.85981308411218 237.63551401869157 L 196.85981308411218 237.63551401869157 L 271.70093457943926 237.63551401869157 L 271.70093457943926 300.8130841121495 L 196.85981308411218 300.8130841121495 ').toBe(true);
                const seriesElement1: HTMLElement  = document.getElementById('container-svg-0-region-series-0-point-3');
                expect(seriesElement1.getAttribute('d') === 'M 444.7102803738317 164.73831775700933 L 444.7102803738317 164.73831775700933 L 519.5514018691589 164.73831775700933 L 519.5514018691589 302.75700934579436 L 444.7102803738317 302.75700934579436 '
                || seriesElement1.getAttribute('d') === 'M 446.65420560747657 165.71028037383178 L 446.65420560747657 165.71028037383178 L 521.4953271028037 165.71028037383178 L 521.4953271028037 300.8130841121495 L 446.65420560747657 300.8130841121495 ').toBe(true);
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
                expect(seriesElements.getAttribute('d') === 'M 423.5317853273407 165.39587470427938 L 423.5317853273407 165.39587470427938 L 480.9894270907686 162.80831880510846 L 480.9894270907686 398.10017932578154 L 423.5317853273407 390.8981487397558 '
                || seriesElements.getAttribute('d') === 'M 424.9636457212623 166.3258688909328 L 424.9636457212623 166.3258688909328 L 482.5483801186988 163.7758108068284 L 482.5483801186988 394.1447938726607 L 424.9636457212623 387.0997181487789 ').toBe(true);
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
                expect(seriesElements.getAttribute('d') === 'M 444.8316086547507 166.52398871119473 L 444.8316086547507 166.52398871119473 L 519.8758231420508 166.52398871119473 L 519.8758231420508 387.75823142050797 L 444.8316086547507 387.75823142050797 '
                || seriesElements.getAttribute('d') === 'M 446.7808090310442 167.49858889934148 L 446.7808090310442 167.49858889934148 L 521.8250235183443 167.49858889934148 L 521.8250235183443 383.85983066792096 L 446.7808090310442 383.85983066792096 ').toBe(true);
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
                expect(seriesElements.getAttribute('d') === 'M 426.2857142857143 190.71428571428572 L 426.2857142857143 190.71428571428572 L 470.2857142857143 190.71428571428572 L 470.2857142857143 320.42857142857144 L 426.2857142857143 320.42857142857144 '
                || seriesElements.getAttribute('d') === 'M 427.42857142857144 191.28571428571428 L 427.42857142857144 191.28571428571428 L 471.42857142857144 191.28571428571428 L 471.42857142857144 318.14285714285717 L 427.42857142857144 318.14285714285717 ').toBe(true);
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
                expect(seriesElements.getAttribute('d') === 'M 444.679604383033 200.96165666523652 L 444.679604383033 200.96165666523652 L 519.4693769372404 200.96165666523652 L 507.1007602189066 343.2152957206217 L 440.0539428460951 343.2152957206217 '
                || seriesElements.getAttribute('d') === 'M 446.5984889895408 201.660340480068 L 446.5984889895408 201.660340480068 L 521.3502317435959 201.660340480068 L 509.0411608880352 340.96403141574405 L 441.8718057810055 340.96403141574405 ').toBe(true);
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
                expect(seriesElements.getAttribute('d') === 'M 443.9090909090909 204 L 443.9090909090909 204 L 517.4090909090909 204 L 517.4090909090909 384.4090909090909 L 443.9090909090909 384.4090909090909 '
                || seriesElements.getAttribute('d') === 'M 445.81818181818176 204 L 445.81818181818176 204 L 519.3181818181818 204 L 519.3181818181818 380.59090909090907 L 445.81818181818176 380.59090909090907 ').toBe(true);
                const seriesElements1: HTMLElement = document.getElementById('container-svg-0-region-series-1-point-3');
                expect(seriesElements1.getAttribute('d') === 'M 442.61764705882354 190.72058823529414 L 442.61764705882354 190.72058823529414 L 513.9558823529412 190.72058823529414 L 513.9558823529412 379.7205882352941 L 442.61764705882354 379.7205882352941 '
                || seriesElements1.getAttribute('d') === 'M 444.4705882352941 191.64705882352942 L 444.4705882352941 191.64705882352942 L 515.8088235294117 191.64705882352942 L 515.8088235294117 376.0147058823529 L 444.4705882352941 376.0147058823529 ').toBe(true);
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
                expect(seriesElements.getAttribute('d') == 'M 445.47368421052636 204.1578947368421 L 445.47368421052636 204.1578947368421 L 478.63157894736844 204.1578947368421 L 478.63157894736844 383.2105263157895 L 445.47368421052636 383.2105263157895 '
                || seriesElements.getAttribute('d') == 'M 447.3684210526316 204.1578947368421 L 447.3684210526316 204.1578947368421 L 479.5789473684211 204.1578947368421 L 479.5789473684211 379.42105263157896 L 447.3684210526316 379.42105263157896 ').toBe(true);
                const seriesElements1: HTMLElement = document.getElementById('container-svg-0-region-series-1-point-3');
                expect(seriesElements1.getAttribute('d') == 'M 482.42105263157896 189.9473684210527 L 482.42105263157896 189.9473684210527 L 514.6315789473684 189.9473684210527 L 514.6315789473684 383.2105263157895 L 482.42105263157896 383.2105263157895 '
                || seriesElements1.getAttribute('d') == 'M 483.3684210526316 190.89473684210532 L 483.3684210526316 190.89473684210532 L 516.5263157894738 190.89473684210532 L 516.5263157894738 379.42105263157896 L 483.3684210526316 379.42105263157896 ').toBe(true);
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
                expect(region5 === 'M 174.5431562833286 206.8227155656214 L 174.5431562833286 206.8227155656214 L 174.5431562833286 376.1584705595699 L 172.39914924699124 375.9378149799596 L 172.39914924699124 206.8492500973466 ' 
                    || region5 === 'M 177.41325382559893 207.77941474637817 L 177.41325382559893 207.77941474637817 L 177.41325382559893 374.24507219805633 L 175.2650571263576 374.0272097270488 L 175.2650571263576 207.80455272380206 ' ).toBe(true);
                const region10: string = document.getElementById('container-svg-10-region-series-0-point-1').getAttribute('d');
                expect(region10 === 'M 160.45786641629823 206.8492500973466 L 160.45786641629823 206.8492500973466 L 160.45786641629823 375.9378149799596 L 157.63094432661043 376.1584705595699 L 157.63094432661043 206.8227155656214 '
                    || region10 === 'M 163.32377429566458 207.80455272380206 L 163.32377429566458 207.80455272380206 L 163.32377429566458 374.0272097270488 L 160.50104186888075 374.24507219805633 L 160.50104186888075 207.77941474637817 ').toBe(true);
                const region15: string = document.getElementById('container-svg-15-region-series-0-point-1').getAttribute('d');
                expect(region15 === 'M 152.33514856917992 206.65975180068622 L 152.33514856917992 206.65975180068622 L 152.33514856917992 377.51364292060947 L 152.9875997681882 377.8558139534884 L 152.9875997681882 206.6186046511628 '
                    || region15 === 'M 155.23097723222946 207.62502802170275 L 155.23097723222946 207.62502802170275 L 155.23097723222946 375.5830904785765 L 155.88992534958356 375.9209302325582 L 155.88992534958356 207.5860465116279 ').toBe(true);
                const region20: string = document.getElementById('container-svg-20-region-series-0-point-1').getAttribute('d');
                expect(region20 === 'M 162.3551401869159 206.5327102803738 L 162.3551401869159 206.5327102803738 L 162.3551401869159 378.5700934579439 L 165.57432355004616 378.5212045963204 L 165.57432355004616 206.53858932069568 '
                    || region20 === 'M 165.27102803738316 207.50467289719623 L 165.27102803738316 207.50467289719623 L 165.27102803738316 376.6261682242991 L 168.48928313098895 376.5778982090252 L 168.48928313098895 207.51024251434328 ').toBe(true);
                const region25: string = document.getElementById('container-svg-25-region-series-0-point-1').getAttribute('d');
                expect(region25 === 'M 175.64477935374404 206.65975180068622 L 175.64477935374404 206.65975180068622 L 175.64477935374404 377.51364292060947 L 176.59259259259258 377.14814814814815 L 176.59259259259258 206.70370370370367 '
                    || region25 === 'M 178.5406080167936 207.62502802170275 L 178.5406080167936 207.62502802170275 L 178.5406080167936 375.5830904785765 L 179.48148148148147 375.22222222222223 L 179.48148148148147 207.66666666666666 ').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });

        it('Checking Cylindrical chart with negative points', (done: Function) => {
            loaded = (args: Object): void => {
                const region5: string = document.getElementById('container-svg-5-region-series-0-point-0').getAttribute('d');
                expect(region5 === 'M 431.8952359069001 231.69689426529743 L 431.8952359069001 231.69689426529743 L 431.8952359069001 329.2802107024881 L 429.3755557635048 329.12798628364305 L 429.3755557635048 231.68711838518809 '
                    || region5 === 'M 434.28698385879204 231.69689426529743 L 434.28698385879204 231.69689426529743 L 434.28698385879204 328.32351152173135 L 431.76381232964343 328.1726836571876 L 431.76381232964343 231.68711838518809 ').toBe(true);
                const region10: string = document.getElementById('container-svg-10-region-series-0-point-0').getAttribute('d');
                expect(region10 === 'M 417.4342729328118 231.68711838518809 L 417.4342729328118 231.68711838518809 L 417.4342729328118 329.12798628364305 L 414.98302395018186 329.2802107024881 L 414.98302395018186 231.69689426529743 '
                    || region10 === 'M 419.8225294989504 231.68711838518809 L 419.8225294989504 231.68711838518809 L 419.8225294989504 328.1726836571876 L 417.37477190207375 328.32351152173135 L 417.37477190207375 231.69689426529743 ').toBe(true);
                const region15: string = document.getElementById('container-svg-15-region-series-0-point-0').getAttribute('d');
                expect(region15 === 'M 411.9944520226225 231.75693354711564 L 411.9944520226225 231.75693354711564 L 411.9944520226225 330.21510809080024 L 413.2294602333045 330.4511627906977 L 413.2294602333045 231.77209302325582 '
                    || region15 === 'M 414.40764257516383 231.75693354711564 L 414.40764257516383 231.75693354711564 L 414.40764257516383 329.2498318697837 L 415.64806488446726 329.4837209302326 L 415.64806488446726 231.77209302325582 ').toBe(true);
                const region20: string = document.getElementById('container-svg-20-region-series-0-point-0').getAttribute('d');
                expect(region20 === 'M 423.8130841121495 231.803738317757 L 423.8130841121495 231.803738317757 L 423.8130841121495 330.94392523364485 L 426.9490326412497 330.9101981075881 L 426.9490326412497 231.8015723555332 ' 
                    || region20 === 'M 426.2429906542056 231.803738317757 L 426.2429906542056 231.803738317757 L 426.2429906542056 329.9719626168224 L 429.3781656253687 329.9385449139405 L 429.3781656253687 231.8015723555332 ').toBe(true);
                const region25: string = document.getElementById('container-svg-25-region-series-0-point-0').getAttribute('d');
                expect(region25 === 'M 435.3040828071867 231.75693354711564 L 435.3040828071867 231.75693354711564 L 435.3040828071867 330.21510809080024 L 435.62962962962956 329.96296296296293 L 435.62962962962956 231.74074074074073 '
                    || region25 === 'M 437.717273359728 231.75693354711564 L 437.717273359728 231.75693354711564 L 437.717273359728 329.2498318697837 L 438.037037037037 329 L 438.037037037037 231.74074074074073 ').toBe(true);
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
                expect(point0 === 285.2616822429906 || point0 === 286.23364485981307).toBe(true);
                expect(point1 === 450.5420560747663 || point1 === 451.5140186915887).toBe(true);
                expect(point2 === 341.6355140186916).toBe(true);
                expect(point3 === 490.39252336448595).toBe(true);
                expect(point4 === 240.55140186915887 || point4 === 241.5233644859813).toBe(true);
                expect(point5 === 704.2242990654205).toBe(true);
                expect(point6 === 387.31775700934577 || point6 === 386.3457943925233).toBe(true);
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
                expect(textElement.getAttribute('y') === '160.85046728971963' || textElement.getAttribute('y') === '162.79439252336448').toBe(true);
                expect(textElement.getAttribute('x') === '450.5420560747663' || textElement.getAttribute('x') === '451.5140186915887').toBe(true);
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
                expect(textElement.getAttribute('y') === '286.23364485981307' || textElement.getAttribute('y') === '285.2616822429906').toBe(true);
                expect(textElement.getAttribute('x') === '451.5140186915887' || textElement.getAttribute('x') === '450.5420560747663').toBe(true);
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
                expect(textElement.getAttribute('y') === '162.79439252336448' || textElement.getAttribute('y') === '160.85046728971963').toBe(true);
                expect(textElement.getAttribute('x') === '451.5140186915887' || textElement.getAttribute('x') === '450.5420560747663').toBe(true);
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
                expect(textElement.getAttribute('y') === '408.3874709976798' || textElement.getAttribute('y') === '409.3526682134571').toBe(true);
                expect(textElement.getAttribute('x') === '451.1554524361949' || textElement.getAttribute('x') === '450.19025522041767').toBe(true);
                const textElement1: Element = document.getElementById('container-svg-series-1-point-3-data-label');
                expect(textElement.getAttribute('y') === '408.3874709976798' || textElement.getAttribute('y') === '409.3526682134571').toBe(true);
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
                expect(shape.getAttribute('d') === 'M 427.3457943925233 128.71046728971965 L 477.3457943925233 128.71046728971965 L 477.3457943925233 169.71046728971965 L 427.3457943925233 169.71046728971965 L 427.3457943925233 128.71046728971965 z'
                || shape.getAttribute('d') === 'M 427.31775700934577 129.0343925233645 L 479.31775700934577 129.0343925233645 L 479.31775700934577 173.0343925233645 L 427.31775700934577 173.0343925233645 L 427.31775700934577 129.0343925233645 z').toBe(true);
                expect(textY === 160.85046728971963 || textY === 162.79439252336448).toBe(true);
                expect(textX === 457.3457943925233 || textX === 458.31775700934577).toBe(true);
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
                expect(document.getElementById('container-series-1-data-label-5').style.left === '736.103px' ||
                    document.getElementById('container-series-1-data-label-5').style.left === '753.598px').toBe(true);
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
                expect(x === 77 || x === 78).toBe(true);
                point = document.getElementById('container-svg-0-region-series-1-point-0');
                path = point.getAttribute('d').split(' ');
                x = parseInt(path[1], 10);
                expect(x === 81 || x === 82).toBe(true);
                point = document.getElementById('container-svg-0-region-series-2-point-0');
                path = point.getAttribute('d').split(' ');
                x = parseInt(path[1], 10);
                expect(x === 85 || x === 86).toBe(true);
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
                expect(x === 81 || x === 82).toBe(true);
                point = document.getElementById('container-svg-0-region-series-1-point-0');
                path = point.getAttribute('d').split(' ');
                x = parseInt(path[1], 10);
                expect(x === 124 || x === 125).toBe(true);
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
                expect(x === 67 || x === 68).toBe(true);
                point = document.getElementById('container-svg-0-region-series-1-point-0');
                path = point.getAttribute('d').split(' ');
                x = parseInt(path[1], 10);
                expect(x === 129 || x === 128).toBe(true);
                point = document.getElementById('container-svg-0-region-series-2-point-0');
                path = point.getAttribute('d').split(' ');
                x = parseInt(path[1], 10);
                expect(x === 188 || x === 189).toBe(true);
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
