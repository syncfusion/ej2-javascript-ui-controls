/* eslint-disable radix */
/**
 * Chart spec document
 */

import { createElement } from '@syncfusion/ej2-base';
import { ColumnSeries3D } from '../../../src/chart3d/series/column-series';
import { Category3D } from '../../../src/chart3d/axis/category-axis';
import { DateTime3D } from '../../../src/chart3d/axis/date-time-axis';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { EmitType } from '@syncfusion/ej2-base';
import { Logarithmic3D } from '../../../src/chart3d/axis/logarithmic-axis';
import { Chart3D } from '../../../src/chart3d/chart3D';
import { getMemoryProfile, inMB, profile } from '../../common.spec';
import { Chart3DLoadedEventArgs } from '../../../src/chart3d/model/chart3d-Interface';
import { Legend3D } from '../../../src/chart3d/legend/legend';
import { BarSeries3D } from '../../../src/chart3d/series/bar-series';
Chart3D.Inject(Category3D, ColumnSeries3D, DateTime3D, Logarithmic3D, Legend3D, BarSeries3D);



describe('Chart Control', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
    let ele: HTMLElement;
    let svg: HTMLElement;
    let chartData = [{ x: '2005', y: 28 }, { x: '2006', y: 25 }, { x: '2007', y: 26 }, { x: '2008', y: 27 },
    { x: '2009', y: 32 }, { x: '2010', y: 35 }, { x: '2011', y: 30 }];
    let chartData1 = [{ x: 'Jan', y: 15, y1: 33 }, { x: 'Feb', y: 20, y1: 31 }, { x: 'Mar', y: 35, y1: 30 },
    { x: 'Apr', y: 40, y1: 28 }, { x: 'May', y: 80, y1: 29 }, { x: 'Jun', y: 70, y1: 30 },
    { x: 'Jul', y: 65, y1: 33 }, { x: 'Aug', y: 55, y1: 32 }, { x: 'Sep', y: 50, y1: 34 },
    { x: 'Oct', y: 30, y1: 32 }, { x: 'Nov', y: 35, y1: 32 }, { x: 'Dec', y: 35, y1: 31 }];
    let text: HTMLElement;
    let Position: string[];
    let loaded: EmitType<Chart3DLoadedEventArgs>;
    describe('Category Axis Behavior', () => {
        let chartObj: Chart3D;
        beforeAll((): void => {
            ele = createElement('div', { id: 'chartContainer' });
            document.body.appendChild(ele);
            chartObj = new Chart3D(
                {
                    primaryXAxis: { valueType: 'Category' },
                    loaded: loaded, legendSettings: { visible: true }
                }
            ); chartObj.appendTo('#chartContainer');
        });

        afterAll((): void => {
            chartObj.destroy();
            ele.remove();
        });
        it('Checking bottom wall brushes', (done: Function) => {
            loaded = (args: Object): void => {
                let axis = document.getElementById('chartContainer-svg-2-bottom-wall-brush');
                expect(parseFloat(axis.getAttribute('d').split(' ')[5]) === parseFloat(axis.getAttribute('d').split(' ')[2])).toBe(true);
                axis = document.getElementById('chartContainer-svg-1-bottom-wall-brush-back');
                expect(parseFloat(axis.getAttribute('d').split(' ')[5]) === parseFloat(axis.getAttribute('d').split(' ')[2])).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();

        });
        it('Checking left wall brushes', (done: Function) => {
            loaded = (args: Object): void => {
                let axis = document.getElementById('chartContainer-svg-1-left-wall-brush-back');
                expect(parseFloat(axis.getAttribute('d').split(' ')[5]) === parseFloat(axis.getAttribute('d').split(' ')[2])).toBe(true);
                axis = document.getElementById('chartContainer-svg-0-left-wall-brush-back');
                expect(parseFloat(axis.getAttribute('d').split(' ')[5]) === parseFloat(axis.getAttribute('d').split(' ')[2])).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Checking Xaxis title default position', (done: Function) => {
            loaded = (args: Object): void => {
                let area: HTMLElement = document.getElementById('chartContainer-svg-axis-title-0');
                expect((parseInt(area.getAttribute('y')) == 438) || parseInt(area.getAttribute('y')) == 437 || area.getAttribute('y') == '437.1906847133758').toBe(true);
                expect((parseInt(area.getAttribute('x')) == 378 || area.getAttribute('x') == '378.24124203821657' || area.getAttribute('x') == '386.7547095761381' ||  area.getAttribute('x') == '396.7585007727975')).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.title = 'Xaxis';
            chartObj.refresh();
        });
        it('Checking Yaxis title default position', (done: Function) => {
            loaded = (args: Object): void => {
                let area: HTMLElement = document.getElementById('chartContainer-svg-axis-title-1');
                expect((parseInt(area.getAttribute('y')) == 208) || (area.getAttribute('y') == '207') || (area.getAttribute('y') == '207.35828025477707') || (area.getAttribute('y') == '208.82378335949764' )).toBe(true);
                expect((parseInt(area.getAttribute('x')) == 23) || (area.getAttribute('x') == '25') || (area.getAttribute('x') == '25.896894904458602') || (area.getAttribute('x') == '23.034929356357928')).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryYAxis.title = 'Yaxis';
            chartObj.refresh();
        });
        it('Checking Xaxis title default styles', (done: Function) => {
            loaded = (args: Object): void => {
                let area: HTMLElement = document.getElementById('chartContainer-svg-axis-title-0');
                expect(area.getAttribute('font-size') == '16px').toBe(true);
                expect(area.getAttribute('font-weight') == '700').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Checking Yaxis title default styles', (done: Function) => {
            loaded = (args: Object): void => {
                let area: HTMLElement = document.getElementById('chartContainer-svg-axis-title-1');
                expect(area.getAttribute('font-size') == '16px').toBe(true);
                expect(area.getAttribute('font-weight') == '700').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Checking Yaxis label default positions', (done: Function) => {
            loaded = (args: Object): void => {
                let label = document.getElementById('chartContainer-1-axis-label-0');
                let content = label.textContent;
                expect((parseInt(label.getAttribute('x')) == 52) || parseInt(label.getAttribute('x')) == 56 || label.getAttribute('x') == '56.27985668789809' || label.getAttribute('x') == '52.44623233908949').toBe(true);
                expect((parseInt(label.getAttribute('y')) == 407) || (parseInt(label.getAttribute('y')) == 404) || (label.getAttribute('y') == '404.3574840764331') || (label.getAttribute('y') == '407.3500784929356')).toBe(true);
                expect(content == '0').toBe(true);
                label = document.getElementById('chartContainer-1-axis-label-11');
                content = label.textContent;
                expect((parseInt(label.getAttribute('x')) == 52 || parseInt(label.getAttribute('x')) == 56) || label.getAttribute('x') == '56.27985668789809' || label.getAttribute('x') == '52.44623233908949').toBe(true);
                expect(parseInt(label.getAttribute('y'))).toBe(18);
                expect(content == '5.5').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Checking Xaxis title Rotation', (done: Function) => {
            loaded = (args: Object): void => {
                let area: HTMLElement = document.getElementById('chartContainer-svg-axis-title-0');
                expect(area.getAttribute('transform') == 'rotate(90,408.0363214837712,428.86652941460585)' || 
                area.getAttribute('transform') == 'rotate(90,390.9824840764331,428.25496989450636)' ||
                area.getAttribute('transform') == 'rotate(90,398.0290423861852,428.80347944466246)').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.title = 'Xaxis';
            chartObj.primaryXAxis.titleRotation = 90;
            chartObj.refresh();
        });
        it('Checking Yaxis title Rotation', (done: Function) => {
            loaded = (args: Object): void => {
                let area: HTMLElement = document.getElementById('chartContainer-svg-axis-title-1');
                expect(area.getAttribute('transform') == 'rotate(90,13.802936630602783,198.89705491692425)'|| 
                area.getAttribute('transform') == 'rotate(90,13.645700636942678,198.42256543590764)' ||
                area.getAttribute('transform') == 'rotate(90,13.721350078492938,198.90512779631084)').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryYAxis.title = 'Yaxis';
            chartObj.primaryYAxis.titleRotation = 90;
            chartObj.refresh();
        });
        it('Checking Xaxis title custom styles', (done: Function) => {
            loaded = (args: Object): void => {
                let area: HTMLElement = document.getElementById('chartContainer-svg-axis-title-0');
                expect(area.getAttribute('font-size') == '20').toBe(true);
                expect(area.getAttribute('font-weight') == '900').toBe(true);
                expect(area.getAttribute('font-family') == 'Cusive').toBe(true);
                expect(area.getAttribute('font-style') == 'Italic').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.titleStyle.fontFamily = 'Cusive';
            chartObj.primaryXAxis.titleStyle.fontWeight = '900';
            chartObj.primaryXAxis.titleStyle.fontStyle = 'Italic';
            chartObj.primaryXAxis.titleStyle.size = '20';
            chartObj.primaryXAxis.title = 'Xaxis';
            chartObj.refresh();
        });
        it('Checking Yaxis title custom styles', (done: Function) => {
            loaded = (args: Object): void => {
                let area: HTMLElement = document.getElementById('chartContainer-svg-axis-title-1');
                expect(area.getAttribute('font-size') == '20').toBe(true);
                expect(area.getAttribute('font-weight') == '900').toBe(true);
                expect(area.getAttribute('font-family') == 'Cusive').toBe(true);
                expect(area.getAttribute('font-style') == 'Italic').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryYAxis.titleStyle.fontFamily = 'Cusive';
            chartObj.primaryYAxis.titleStyle.fontWeight = '900';
            chartObj.primaryYAxis.titleStyle.fontStyle = 'Italic';
            chartObj.primaryYAxis.titleStyle.size = '20';
            chartObj.primaryYAxis.title = 'Yaxis';
            chartObj.refresh();
        });
        it('Checking Yaxis label Rotation', (done: Function) => {
            loaded = (args: Object): void => {
                let label = document.getElementById('chartContainer-1-axis-label-0');
                expect(label.getAttribute('transform') == 'rotate(45,66.76563808317346,377.98608964451313)' ||
                label.getAttribute('transform') == 'rotate(45,60.33954534105435,376.9148089171975)' ||
                label.getAttribute('transform') == 'rotate(45,66.66767171263882,377.9387755102041)').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryYAxis.labelRotation = 45;
            chartObj.refresh();
        });
        it('checking minor gridlines', (done: Function) => {
            chartObj.loaded = (args: Object): void => {
                let tick: Element = document.getElementById('chartContainer-1-grid-lines-3');
                expect(tick.getBoundingClientRect().top == 304.3954162597656 || tick.getBoundingClientRect().top == 282.6441955566406 ||
                    tick.getBoundingClientRect().top == 203.263427734375 || tick.getBoundingClientRect().top == 282.6009826660156).toBe(true);
                done();
            };
            chartObj.primaryXAxis.minorTicksPerInterval = 1;
            chartObj.primaryXAxis.minorTickLines.width = 8;
            chartObj.primaryXAxis.minorGridLines.width = 8;
            chartObj.refresh();
        });
        it('Checking axis label with plotOffsetTop', (done: Function) => {
            chartObj.loaded = (args: Object): void => {
                let tick: Element = document.getElementById('chartContainer-0-axis-label-0');
                expect(parseInt(tick.getAttribute('x')) === 111 || parseInt(tick.getAttribute('x')) === 120 || parseInt(tick.getAttribute('x')) === 117
                || parseInt(tick.getAttribute('x')) == 118).toBe(true);
                done();
            };
            chartObj.primaryXAxis.plotOffsetTop = 2;
            chartObj.primaryXAxis.plotOffsetBottom = 2;
            chartObj.series[0].dataSource = chartData;
            chartObj.series[0].type = 'Column';
            chartObj.series[0].yName = 'y';
            chartObj.series[0].xName = 'x';
            chartObj.refresh();
        });
        it('Checking axis label with plotOffsetLeft', (done: Function) => {
            chartObj.loaded = (args: Object): void => {
                let tick: Element = document.getElementById('chartContainer-0-axis-label-0');
                expect(parseInt(tick.getAttribute('x')) === 124 || parseInt(tick.getAttribute('x')) === 119 || parseInt(tick.getAttribute('x')) === 117
                || parseInt(tick.getAttribute('x')) == 118).toBe(true);
                done();
            };
            chartObj.primaryXAxis.plotOffsetLeft = 2;
            chartObj.primaryXAxis.plotOffsetRight = 2;
            chartObj.series[0].dataSource = chartData;
            chartObj.series[0].type = 'Column';
            chartObj.series[0].yName = 'y';
            chartObj.series[0].xName = 'x';
            chartObj.refresh();
        });
        it('Checking axis label with axis opposite', (done: Function) => {
            chartObj.loaded = (args: Object): void => {
                let tick: Element = document.getElementById('chartContainer-0-axis-label-0');
                expect(parseInt(tick.getAttribute('x')) === 70 || parseInt(tick.getAttribute('x')) === 65 || parseInt(tick.getAttribute('x')) === 63
                || parseInt(tick.getAttribute('x')) === 64).toBe(true);
                done();
            };
            chartObj.primaryYAxis.opposedPosition = true;
            chartObj.series[0].dataSource = chartData;
            chartObj.series[0].type = 'Column';
            chartObj.series[0].yName = 'y';
            chartObj.series[0].xName = 'x';
            chartObj.refresh();
        });
    });
    describe('category Axis Behavior', () => {
        let chartObj: Chart3D;
        beforeAll((): void => {
            ele = createElement('div', { id: 'chartContainer' });
            document.body.appendChild(ele);
            chartObj = new Chart3D(
                {
                    primaryXAxis: {
                        title: 'Months',
                        valueType: 'Category',
                        interval: 1
                    },
                    primaryYAxis: {
                        minimum: 0, maximum: 90, interval: 20,
                        title: 'Temperature (Fahrenheit)', rowIndex: 2,
                        labelFormat: '{value}°F'
                    },
                    // Rows for chart axis
                    rows: [
                        {
                            height: '50%'
                        }, {
                            height: '50%'
                        }
                    ],
                    columns:[
                        {
                            width: '50%'
                        },{
                            width: '50%'
                        }
                    ],
                    axes: [
                        {
                            majorGridLines: { width: 0 },
                            opposedPosition: true,
                            minimum: 24, maximum: 36, interval: 4,
                            name: 'yAxis', title: 'Temperature (Celsius)',
                            labelFormat: '{value}°C'
                        },
                        {
                            title: 'Axes - 2',
                            valueType: 'Category',
                            majorGridLines: { width: 0 }, columnIndex: -1, name: 'xAxis'
                        }
                    ],
                    series: [{
                        dataSource: chartData,
                        xName: 'x', yName: 'y',
                        name: 'Germany', type: 'Column'
                    }, {
                        dataSource: chartData,
                        xName: 'x', yName: 'y1', yAxisName: 'yAxis',
                        name: 'Japan', type: 'Column'
                    }],
                    enableSideBySidePlacement: false,
                    title: 'Weather Condition',
                    legendSettings: { visible: true, position: 'Right' }
                }
            ); chartObj.appendTo('#chartContainer');
        });

        afterAll((): void => {
            chartObj.destroy();
            ele.remove();
        });
        it('Checking axis with row multiple planes', (done: Function) => {
            chartObj.loaded = (args: Object): void => {
                let tick: Element = document.getElementById('chartContainer-1-axis-label-5');
                expect(tick !== null).toBe( true);
                let tick1: Element = document.getElementById('chartContainer-2-axis-label-0');
                expect(tick1 !== null).toBe( true);
                done();
            };
            chartObj.refresh();
        });
        it('Checking axis with multiple row', (done: Function) => {
            chartObj.loaded = (args: Object): void => {
                let tick: Element = document.getElementById('chartContainer-1-axis-label-5');
                expect(tick !== null).toBe( true);
                done();
            };
            chartObj.axes[0].rowIndex = -1
            chartObj.refresh();
        });
        it('Checking axis with multiple columns', (done: Function) => {
            chartObj.loaded = (args: Object): void => {
                let tick: Element = document.getElementById('chartContainer-1-axis-label-5');
                expect(tick !== null).toBe( true);
                done();
            };
            chartObj.series[1].xAxisName = 'xAxis',
            chartObj.refresh();
        });
        it('Checking axis with multiple columns', (done: Function) => {
            chartObj.loaded = (args: Object): void => {
                let tick: Element = document.getElementById('chartContainer-1-axis-label-5');
                expect(tick !== null).toBe( true);
                done();
            };
            chartObj.axes[1].columnIndex = 3;
            chartObj.refresh();
        });
        it('Checking axis label with plotOffsetTop', (done: Function) => {
            chartObj.loaded = (args: Object): void => {
                let tick1: Element = document.getElementById('chartContainer-2-axis-label-0');
                expect(tick1 !== null).toBe( true);
                chartObj.chartAxisLayoutPanel.measureAxis(chartObj.initialClipRect);
                done();
            };
            chartObj.primaryYAxis.plotOffsetTop = 2;
            chartObj.refresh();
        });
        it('Checking axis label with plotOffsetTop', (done: Function) => {
            chartObj.loaded = (args: Object): void => {
                let tick1: Element = document.getElementById('chartContainer-2-axis-label-0');
                expect(tick1 !== null).toBe( true);
                chartObj.chartAxisLayoutPanel.measureAxis(chartObj.initialClipRect);
                done();
            };
            chartObj.primaryYAxis.opposedPosition = true;
            chartObj.primaryXAxis.opposedPosition = true;
            chartObj.axes[0].opposedPosition = true;
            chartObj.axes[1].opposedPosition = true;
            chartObj.refresh();
        });
    });
    
    // it('memory leak', () => {
    //     profile.sample();
    //     let average: any = inMB(profile.averageChange)
    //     //Check average change in memory samples to not be over 10MB
    //     expect(average).toBeLessThan(10);
    //     let memory: any = inMB(getMemoryProfile())
    //     //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
    //     expect(memory).toBeLessThan(profile.samples[0] + 0.25);
    // });
});