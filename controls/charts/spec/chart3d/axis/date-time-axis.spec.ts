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
import { ILoadedEventArgs } from '../../../src/chart/model/chart-interface';
import { Chart3D } from '../../../src/chart3d/chart3D';
import { getMemoryProfile, inMB, profile } from '../../common.spec';
import { datetimeData } from '../../chart/base/data.spec';
Chart3D.Inject(Category3D, ColumnSeries3D, DateTime3D, Logarithmic3D, DateTime3D);



describe('Chart Control', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
    let data = [{ x: new Date(2004, 3, 6, 1, 10), y: 10 }, { x: new Date(2004, 3, 6, 1, 20), y: 30 },
    { x: new Date(2004, 3, 6, 1, 14), y: 15 }, { x: new Date(2004, 3, 6, 1, 10), y: 65 },
    { x: new Date(2004, 3, 6, 1, 12), y: 90 }, { x: new Date(2004, 3, 6, 1, 15), y: 85 }
    ];
    let hourData = [{ x: new Date(2004, 3, 6, 2, 10), y: 10 }, { x: new Date(2004, 3, 6, 1, 20), y: 30 },
    { x: new Date(2004, 3, 6, 1, 14), y: 15 }, { x: new Date(2004, 3, 6, 5, 10), y: 65 },
    { x: new Date(2004, 3, 6, 3, 12), y: 90 }, { x: new Date(2004, 3, 6, 4, 15), y: 85 }
    ];
    let ele: HTMLElement;
    let svg: HTMLElement;
    let text: HTMLElement;
    let Position: string[];
    let loaded: EmitType<ILoadedEventArgs>;
    describe(' Date time Axis Behavior', () => {
        let chartObj: Chart3D;
        beforeAll((): void => {
            ele = createElement('div', { id: 'chartContainer' });
            document.body.appendChild(ele);
            chartObj = new Chart3D(
                {
                    primaryXAxis: { valueType: 'DateTime' },
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
                expect(parseInt(area.getAttribute('y'))).toBe(438);
                expect(parseInt(area.getAttribute('x'))).toBe(396);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.title = 'Xaxis';
            chartObj.refresh();
        });
        it('Checking Yaxis title default position', (done: Function) => {
            loaded = (args: Object): void => {
                let area: HTMLElement = document.getElementById('chartContainer-svg-axis-title-1');
                expect(parseInt(area.getAttribute('y'))).toBe(201);
                expect(parseInt(area.getAttribute('x'))).toBe(23);
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
        it('Checking Xaxis label default positions', (done: Function) => {
            loaded = (args: Object): void => {
                let label = document.getElementById('chartContainer-0-axis-label-0');
                let content = label.textContent;
                expect(parseInt(label.getAttribute('x'))).toBe(173);
                expect(parseInt(label.getAttribute('y'))).toBe(410);
                expect(content == 'Feb 20').toBe(true);
                label = document.getElementById('chartContainer-0-axis-label-1');
                content = label.textContent;
                expect(parseInt(label.getAttribute('x'))).toBe(287);
                expect(parseInt(label.getAttribute('y'))).toBe(410);
                expect(content == 'Mar 12').toBe(true);
                label = document.getElementById('chartContainer-0-axis-label-2');
                content = label.textContent;
                expect(parseInt(label.getAttribute('x'))).toBe(402);
                expect(parseInt(label.getAttribute('y'))).toBe(410);
                expect(content == 'Apr 1').toBe(true);
                label = document.getElementById('chartContainer-0-axis-label-3');
                content = label.textContent;
                expect(parseInt(label.getAttribute('x'))).toBe(516);
                expect(parseInt(label.getAttribute('y'))).toBe(410);
                expect(content == 'Apr 21').toBe(true);
                label = document.getElementById('chartContainer-0-axis-label-4');
                content = label.textContent;
                expect(parseInt(label.getAttribute('x'))).toBe(631);
                expect(parseInt(label.getAttribute('y'))).toBe(410);
                expect(content == 'May 11').toBe(true);
                label = document.getElementById('chartContainer-0-axis-label-5');
                content = label.textContent;
                expect(parseInt(label.getAttribute('x'))).toBe(745);
                expect(parseInt(label.getAttribute('y'))).toBe(410);
                expect(content == 'May 31').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Checking Yaxis label default positions', (done: Function) => {
            loaded = (args: Object): void => {
                let label = document.getElementById('chartContainer-1-axis-label-0');
                let content = label.textContent;
                expect(parseInt(label.getAttribute('x'))).toBe(52);
                expect(parseInt(label.getAttribute('y'))).toBe(392);
                expect(content == '0').toBe(true);
                label = document.getElementById('chartContainer-1-axis-label-1');
                expect(parseInt(label.getAttribute('x'))).toBe(52);
                label = document.getElementById('chartContainer-1-axis-label-2');
                expect(parseInt(label.getAttribute('x'))).toBe(52);
                expect(parseInt(label.getAttribute('y'))).toBe(324);
                label = document.getElementById('chartContainer-1-axis-label-3');
                expect(parseInt(label.getAttribute('x'))).toBe(52);
                expect(parseInt(label.getAttribute('y'))).toBe(290);
                label = document.getElementById('chartContainer-1-axis-label-4');
                expect(parseInt(label.getAttribute('x'))).toBe(52);
                expect(parseInt(label.getAttribute('y'))).toBe(256);
                label = document.getElementById('chartContainer-1-axis-label-5');
                expect(parseInt(label.getAttribute('x'))).toBe(52);
                expect(parseInt(label.getAttribute('y'))).toBe(222);
                label = document.getElementById('chartContainer-1-axis-label-7');
                expect(parseInt(label.getAttribute('x'))).toBe(52);
                expect(parseInt(label.getAttribute('y'))).toBe(154);
                label = document.getElementById('chartContainer-1-axis-label-8');
                expect(parseInt(label.getAttribute('x'))).toBe(52);
                expect(parseInt(label.getAttribute('y'))).toBe(120);
                label = document.getElementById('chartContainer-1-axis-label-9');
                expect(parseInt(label.getAttribute('x'))).toBe(52);
                expect(parseInt(label.getAttribute('y'))).toBe(85);
                label = document.getElementById('chartContainer-1-axis-label-10');
                expect(parseInt(label.getAttribute('x'))).toBe(52);
                expect(parseInt(label.getAttribute('y'))).toBe(51);
                label = document.getElementById('chartContainer-1-axis-label-11');
                content = label.textContent;
                expect(parseInt(label.getAttribute('x'))).toBe(52);
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
                expect(area.getAttribute('transform')).toBe( 'rotate(90,403.6232612055641,428.86652941460585)');
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
                expect(area.getAttribute('transform')).toBe( 'rotate(90,13.802936630602783,191.54195445324575)');
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
        it('Checking Xaxis label rotation', (done: Function) => {
            loaded = (args: Object): void => {
                let label = document.getElementById('chartContainer-0-axis-label-0');
                expect(label.getAttribute('transform')).toBe('rotate(45,169.24072642967542,372.07010604646143)' );
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.labelRotation = 45;
            chartObj.refresh();
        });
        it('Checking Yaxis label rotation', (done: Function) => {
            loaded = (args: Object): void => {
                let label = document.getElementById('chartContainer-1-axis-label-0');
                expect(label.getAttribute('transform')).toBe('rotate(45,60.52462913595727,342.68160741885623)' );
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryYAxis.labelRotation = 45;
            chartObj.refresh();
        });
        it('Checking secondary Xaxis position oposite', (done: Function) => {
            loaded = (args: Object): void => {
                let label = document.getElementById('chartContainer-2-axis-label-0');
                expect(parseInt(label.getAttribute('x'))).toBe(755);
                expect(parseInt(label.getAttribute('y'))).toBe(342);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.labelRotation = 45;
            chartObj.axes = [{
                opposedPosition: true,
                name: 'Yaxis'
            }];
            chartObj.series[0].yAxisName = 'Yaxis'
            chartObj.refresh();
        });
        it('checking minor gridlines', (done: Function) => {
            chartObj.loaded = (args: Object): void => {
                let tick: Element = document.getElementById('chartContainer-1-grid-lines-3');
                expect(tick.getBoundingClientRect().top == 304.3954162597656 || tick.getBoundingClientRect().top == 187.1382293701172).toBe(true);
                done();
            };
            chartObj.primaryXAxis.minorTicksPerInterval = 1;
            chartObj.primaryXAxis.minorTickLines.width = 8;
            chartObj.primaryXAxis.minorGridLines.width = 8;
        });
        it('checking first grid lines', (done: Function) => {
            chartObj.loaded = () => {
                let gridLineElement: Element = document.getElementById('chartContainer-1-grid-lines-0');
                let path: string = gridLineElement.getAttribute("x1");
                let path1: string = gridLineElement.getAttribute("y1");
                let path2: string = gridLineElement.getAttribute("x2");
                let path3: string = gridLineElement.getAttribute("y2");
                expect(path === "85.24346257889991" || path === "78.73164687177996").toBe(true);
                expect(path1 === "24.34625788999098" || path1 === "335.1628166915052").toBe(true);
                expect(path2 === "85.24346257889991" || path2 === "723.4988822652757").toBe(true);
                expect(path3 === "403.2551848512173" || path3 === "335.1628166915052").toBe(true);
                done();
            }
            chartObj.refresh();
        });
        it('checking intervaltype as years', (done: Function) => {
            chartObj.loaded = () => {
                let label: Element = document.getElementById('chartContainer-0-axis-label-0');
                expect(parseInt(label.getAttribute('x'))).toBe(76);
                expect(parseInt(label.getAttribute('y'))).toBe(243);
                label = document.getElementById('chartContainer-0-axis-label-10');
                expect(parseInt(label.getAttribute('x'))).toBe(675);
                expect(parseInt(label.getAttribute('y'))).toBe(243);
                done();
            }
            chartObj.primaryXAxis = {
                title: 'Sales Across Years', intervalType: 'Years', valueType: 'DateTime', rangePadding: 'Round'
            },
                chartObj.primaryYAxis = { title: 'Sales Amount in millions(USD)', rangePadding: 'Round' },
                chartObj.series = [
                    {
                        name: 'series1', type: 'Column', fill: '#ACE5FF', animation: { enable: false },
                        dataSource: datetimeData, xName: 'x', yName: 'y'
                    },
                ],
                chartObj.refresh();
        });
        it('checking intervaltype as months', (done: Function) => {
            chartObj.loaded = () => {
                let label: Element = document.getElementById('chartContainer-0-axis-label-0');
                expect(parseInt(label.getAttribute('x'))).toBe(161);
                expect(parseInt(label.getAttribute('y'))).toBe(233);
                done();
            }
            chartObj.primaryXAxis = {
                title: 'Sales Across Years', intervalType: 'Months', valueType: 'DateTime', rangePadding: 'Round'
            },
                chartObj.primaryYAxis = { title: 'Sales Amount in millions(USD)', rangePadding: 'Round' },
                chartObj.series = [
                    {
                        name: 'series1', type: 'Column', fill: '#ACE5FF', animation: { enable: false },
                        dataSource: datetimeData, xName: 'x', yName: 'y'
                    },
                ],
                chartObj.refresh();
        });
        it('checking invervaltype as days', (done: Function) => {
            chartObj.loaded = () => {
                let label: Element = document.getElementById('chartContainer-0-axis-label-0');
                expect(parseInt(label.getAttribute('x'))).toBe(166);
                expect(parseInt(label.getAttribute('y'))).toBe(239);
                done();
            };
            chartObj.primaryXAxis = {
                title: 'Sales Across Years', intervalType: 'Days', valueType: 'DateTime', rangePadding: 'Round'
            },
                chartObj.primaryYAxis = { title: 'Sales Amount in millions(USD)', rangePadding: 'Round' },
                chartObj.series = [
                    {
                        name: 'series1', type: 'Column', fill: '#ACE5FF', animation: { enable: false },
                        dataSource: datetimeData, xName: 'x', yName: 'y'
                    },
                ],
                chartObj.refresh();
        });
        it('checking invervaltype as hours', (done: Function) => {
            chartObj.loaded = () => {
                let label: Element = document.getElementById('chartContainer-0-axis-label-0');
                expect(parseInt(label.getAttribute('x'))).toBe(76);
                expect(parseInt(label.getAttribute('y'))).toBe(242);
                done();
            }
            chartObj.primaryXAxis = {
                title: 'Sales Across Years', intervalType: 'Hours', valueType: 'DateTime', rangePadding: 'Round'
            },
                chartObj.primaryYAxis = { title: 'Sales Amount in millions(USD)', rangePadding: 'Round' },
                chartObj.series = [
                    {
                        name: 'series1', type: 'Column', fill: '#ACE5FF',  animation: { enable: false },
                        dataSource: datetimeData, xName: 'x', yName: 'y'
                    },
                ],
                chartObj.refresh();
        });
        it('checking invervaltype as minutes', (done: Function) => {
            chartObj.loaded = () => {
                let label: Element = document.getElementById('chartContainer-0-axis-label-0');
                expect(parseInt(label.getAttribute('x'))).toBe(76);
                expect(parseInt(label.getAttribute('y'))).toBe(237);
                expect(label.textContent === "12:00:00" || label.textContent === '00:00:00').toBe(true);
                done();
            }
            chartObj.primaryXAxis = {
                title: 'Sales Across Years', intervalType: 'Minutes', valueType: 'DateTime', rangePadding: 'Round'
            },
                chartObj.primaryYAxis = { title: 'Sales Amount in millions(USD)', rangePadding: 'Round' },
                chartObj.series = [
                    {
                        name: 'series1', type: 'Column', fill: '#ACE5FF',  animation: { enable: false },
                        dataSource: datetimeData, xName: 'x', yName: 'y'
                    },
                ],
                chartObj.refresh();
        });
        it('checking invervaltype as minutes without range', (done: Function) => {
            chartObj.loaded = () => {
                let label: Element = document.getElementById('chartContainer-0-axis-label-0');
                expect(parseInt(label.getAttribute('x'))).toBe(76);
                expect(parseInt(label.getAttribute('y'))).toBe(237);
                expect(label.textContent === "12:00:00" || label.textContent === '00:00:00').toBe(true);
                done();
            }
            chartObj.primaryXAxis = {
                title: 'Sales Across Years', intervalType: 'Minutes', valueType: 'DateTime', rangePadding: 'Round'
            },
                chartObj.primaryYAxis = { title: 'Sales Amount in millions(USD)', rangePadding: 'Round' },
                chartObj.series = [
                    {
                        name: 'series1', type: 'Column', fill: '#ACE5FF',  animation: { enable: false },
                        dataSource: datetimeData, xName: 'x', yName: 'y'
                    },
                ],
                chartObj.refresh();
        });
        it('checking invervaltype as seconds', (done: Function) => {
            chartObj.loaded = () => {
                let label: Element = document.getElementById('chartContainer-0-axis-label-0');
                expect(parseInt(label.getAttribute('x'))).toBe(76);
                expect(parseInt(label.getAttribute('y'))).toBe(237);
                expect(label.textContent === "12:00:00" || label.textContent === "00:00:00").toBe(true);
                done();
            }
            chartObj.primaryXAxis = {
                title: 'Sales Across Years', intervalType: 'Seconds', valueType: 'DateTime', rangePadding: 'Round'
            },
                chartObj.primaryYAxis = { title: 'Sales Amount in millions(USD)', rangePadding: 'Round' },
                chartObj.series = [
                    {
                        name: 'series1', type: 'Column', fill: '#ACE5FF',  animation: { enable: false },
                        dataSource: datetimeData, xName: 'x', yName: 'y'
                    },
                ],
                chartObj.refresh();
        });
        it('checking invervaltype as auto', (done: Function) => {
            chartObj.loaded = () => {
                let label: Element = document.getElementById('chartContainer-0-axis-label-0');
                expect(parseInt(label.getAttribute('x'))).toBe(76);
                expect(parseInt(label.getAttribute('y'))).toBe(243);
                expect(label.textContent === "Nov 1999" || label.textContent === "1999").toBe(true);
                done();
            }
            chartObj.primaryXAxis = {
                title: 'Sales Across Years', intervalType: 'Auto', valueType: 'DateTime', rangePadding: 'Round'
            },
                chartObj.primaryYAxis = { title: 'Sales Amount in millions(USD)', rangePadding: 'Round' },
                chartObj.series = [
                    {
                        name: 'series1', type: 'Column', fill: '#ACE5FF',  animation: { enable: false },
                        dataSource: datetimeData, xName: 'x', yName: 'y'
                    },
                ],
                chartObj.refresh();
        });
        it('checking invervaltype as auto with minimum and maximum', (done: Function) => {
            chartObj.loaded = () => {
                let label: Element = document.getElementById('chartContainer-0-axis-label-0');
                expect(parseInt(label.getAttribute('x'))).toBe(76);
                expect(parseInt(label.getAttribute('y'))).toBe(238);
                done();
            }
            chartObj.primaryXAxis = {
                title: 'Sales Across Years', intervalType: 'Auto', valueType: 'DateTime', minimum: 1, maximum: 6
            },
                chartObj.primaryYAxis = { title: 'Sales Amount in millions(USD)', rangePadding: 'Round' },
                chartObj.series = [
                    {
                        name: 'series1', type: 'Column', fill: '#ACE5FF',  animation: { enable: false },
                        dataSource: datetimeData, xName: 'x', yName: 'y'
                    },
                ],
                chartObj.refresh();
        });
        it('checking intervaltype as years with interval', (done: Function) => {
            chartObj.loaded = () => {
                let label: Element = document.getElementById('chartContainer-0-axis-label-0');
                expect(parseInt(label.getAttribute('x'))).toBe(76);
                expect(parseInt(label.getAttribute('y'))).toBe(243);
                done();
            }
            chartObj.primaryXAxis = {
                title: 'Sales Across Years', intervalType: 'Years', valueType: 'DateTime', interval: 1
            },
                chartObj.primaryYAxis = { title: 'Sales Amount in millions(USD)', rangePadding: 'Round' },
                chartObj.series = [
                    {
                        name: 'series1', type: 'Column', fill: '#ACE5FF',  animation: { enable: false },
                        dataSource: datetimeData, xName: 'x', yName: 'y'
                    },
                ],
                chartObj.refresh();
        });
    });
    it('memory leak', () => {
        profile.sample();
        let average: any = inMB(profile.averageChange);
        //Check average change in memory samples to not be over 10MB
        expect(average).toBeLessThan(10);
        let memory: any = inMB(getMemoryProfile());
        //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
    });
});
