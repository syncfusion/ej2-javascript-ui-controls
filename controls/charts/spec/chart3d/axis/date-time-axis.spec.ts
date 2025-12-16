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
                expect(parseInt(area.getAttribute('y')) == 438 || parseInt(area.getAttribute('y')) == 437 || parseInt(area.getAttribute('y')) == 438).toBe(true);
                expect(parseInt(area.getAttribute('x')) == 478 || parseInt(area.getAttribute('x')) == 396 || parseInt(area.getAttribute('x')) == 378 || parseInt(area.getAttribute('x')) == 386).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.title = 'Xaxis';
            chartObj.refresh();
        });
        it('Checking Yaxis title default position', (done: Function) => {
            loaded = (args: Object): void => {
                let area: HTMLElement = document.getElementById('chartContainer-svg-axis-title-1');
                expect(parseInt(area.getAttribute('y')) == 201 || parseInt(area.getAttribute('y')) == 199).toBe(true);
                expect(parseInt(area.getAttribute('x')) == 25 || parseInt(area.getAttribute('x')) == 23).toBe(true);
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
                expect(parseInt(label.getAttribute('x')) == 169 || parseInt(label.getAttribute('x')) == 173 || parseInt(label.getAttribute('x')) == 170).toBe(true);
                expect(parseInt(label.getAttribute('y')) == 406 || parseInt(label.getAttribute('y')) == 410).toBe(true);
                expect(content == 'Feb 20').toBe(true);
                label = document.getElementById('chartContainer-0-axis-label-1');
                content = label.textContent;
                expect(parseInt(label.getAttribute('x')) == 277 || parseInt(label.getAttribute('x')) == 287 || parseInt(label.getAttribute('x')) == 280).toBe(true);
                expect(parseInt(label.getAttribute('y')) == 406 || parseInt(label.getAttribute('y')) == 410).toBe(true);
                expect(content == 'Mar 12').toBe(true);
                label = document.getElementById('chartContainer-0-axis-label-2');
                content = label.textContent;
                expect(parseInt(label.getAttribute('x')) == 385 || parseInt(label.getAttribute('x')) == 402 || parseInt(label.getAttribute('x')) == 392).toBe(true);
                expect(parseInt(label.getAttribute('y')) == 406 || parseInt(label.getAttribute('y')) == 410).toBe(true);
                expect(content == 'Apr 1').toBe(true);
                label = document.getElementById('chartContainer-0-axis-label-3');
                content = label.textContent;
                expect(parseInt(label.getAttribute('x')) == 493 || parseInt(label.getAttribute('x')) == 516 || parseInt(label.getAttribute('x')) == 503).toBe(true);
                expect(parseInt(label.getAttribute('y')) == 406 || parseInt(label.getAttribute('y')) == 410).toBe(true);
                expect(content == 'Apr 21').toBe(true);
                label = document.getElementById('chartContainer-0-axis-label-4');
                content = label.textContent;
                expect(parseInt(label.getAttribute('x')) == 601 || parseInt(label.getAttribute('x')) == 631 || parseInt(label.getAttribute('x')) == 615).toBe(true);
                expect(parseInt(label.getAttribute('y')) == 406 || parseInt(label.getAttribute('y')) == 410).toBe(true);
                expect(content == 'May 11').toBe(true);
                label = document.getElementById('chartContainer-0-axis-label-5');
                content = label.textContent;
                expect(parseInt(label.getAttribute('x')) == 709 || parseInt(label.getAttribute('x')) == 745 || parseInt(label.getAttribute('x')) == 725).toBe(true);
                expect(parseInt(label.getAttribute('y')) == 406 || parseInt(label.getAttribute('y')) == 410).toBe(true);
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
                expect(parseInt(label.getAttribute('x')) == 56 || parseInt(label.getAttribute('x')) == 52).toBe(true);
                expect(parseInt(label.getAttribute('y')) == 388 || parseInt(label.getAttribute('y')) == 392).toBe(true);
                expect(content == '0').toBe(true);
                label = document.getElementById('chartContainer-1-axis-label-1');
                expect(parseInt(label.getAttribute('x')) == 56 || parseInt(label.getAttribute('x')) == 52).toBe(true);
                label = document.getElementById('chartContainer-1-axis-label-2');
                expect(parseInt(label.getAttribute('x')) == 56 || parseInt(label.getAttribute('x')) == 52).toBe(true);
                expect(parseInt(label.getAttribute('y')) == 321 || parseInt(label.getAttribute('y')) == 324).toBe(true);
                label = document.getElementById('chartContainer-1-axis-label-3');
                expect(parseInt(label.getAttribute('x')) == 56 || parseInt(label.getAttribute('x')) == 52).toBe(true);
                expect(parseInt(label.getAttribute('y')) == 287 || parseInt(label.getAttribute('y')) == 290).toBe(true);
                label = document.getElementById('chartContainer-1-axis-label-4');
                expect(parseInt(label.getAttribute('x')) == 56 || parseInt(label.getAttribute('x')) == 52).toBe(true);
                expect(parseInt(label.getAttribute('y')) == 254 || parseInt(label.getAttribute('y')) == 256).toBe(true);
                label = document.getElementById('chartContainer-1-axis-label-5');
                expect(parseInt(label.getAttribute('x')) == 56 || parseInt(label.getAttribute('x')) == 52).toBe(true);
                expect(parseInt(label.getAttribute('y')) == 220 || parseInt(label.getAttribute('y')) == 222).toBe(true);
                label = document.getElementById('chartContainer-1-axis-label-7');
                expect(parseInt(label.getAttribute('x')) == 56 || parseInt(label.getAttribute('x')) == 52).toBe(true);
                expect(parseInt(label.getAttribute('y')) == 152 || parseInt(label.getAttribute('y')) == 154).toBe(true);
                label = document.getElementById('chartContainer-1-axis-label-8');
                expect(parseInt(label.getAttribute('x')) == 56 || parseInt(label.getAttribute('x')) == 52).toBe(true);
                expect(parseInt(label.getAttribute('y')) == 119 || parseInt(label.getAttribute('y')) == 120).toBe(true);
                label = document.getElementById('chartContainer-1-axis-label-9');
                expect(parseInt(label.getAttribute('x')) == 56 || parseInt(label.getAttribute('x')) == 52).toBe(true);
                expect(parseInt(label.getAttribute('y'))).toBe(85);
                label = document.getElementById('chartContainer-1-axis-label-10');
                expect(parseInt(label.getAttribute('x')) == 56 || parseInt(label.getAttribute('x')) == 52).toBe(true);
                expect(parseInt(label.getAttribute('y'))).toBe(51);
                label = document.getElementById('chartContainer-1-axis-label-11');
                content = label.textContent;
                expect(parseInt(label.getAttribute('x')) == 56 || parseInt(label.getAttribute('x')) == 52).toBe(true);
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
                expect(area.getAttribute('transform') == 'rotate(90,403.6232612055641,428.86652941460585)' || area.getAttribute('transform') == 'rotate(90,386.0820063694267,428.25496989450636)'
                || area.getAttribute('transform') == 'rotate(90,393.6173469387755,428.80347944466246)').toBe(true);
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
                expect(area.getAttribute('transform') == 'rotate(90,13.802936630602783,191.54195445324575)' || area.getAttribute('transform') == 'rotate(90,13.645700636942678,190.58180110469746)'
                || area.getAttribute('transform') == 'rotate(90,13.721350078492938,191.55230205062796)').toBe(true);
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
                expect(label.getAttribute('transform') == 'rotate(45,169.24072642967542,372.07010604646143)' || label.getAttribute('transform') == 'rotate(45,163.11027070063696,370.6557826388414)'
                || label.getAttribute('transform') == 'rotate(45,166.1699372056515,372.0246215532863)').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.labelRotation = 45;
            chartObj.refresh();
        });
        it('Checking Yaxis label rotation', (done: Function) => {
            loaded = (args: Object): void => {
                let label = document.getElementById('chartContainer-1-axis-label-0');
                expect(label.getAttribute('transform') == 'rotate(45,60.33954534105435,341.63136942675163)' || label.getAttribute('transform') == 'rotate(45,60.52462913595727,342.68160741885623)'
                || label.getAttribute('transform') == 'rotate(45,60.42859292741473,342.6452119309262)').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryYAxis.labelRotation = 45;
            chartObj.refresh();
        });
        it('Checking secondary Xaxis position oposite', (done: Function) => {
            loaded = (args: Object): void => {
                let label = document.getElementById('chartContainer-2-axis-label-0');
                expect(parseInt(label.getAttribute('x')) == 755 || parseInt(label.getAttribute('x')) == 717 || parseInt(label.getAttribute('x')) == 735).toBe(true);
                expect(parseInt(label.getAttribute('y')) == 342 || parseInt(label.getAttribute('y')) == 341).toBe(true);
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
                expect(tick.getBoundingClientRect().top == 304.3954162597656 || tick.getBoundingClientRect().top == 187.1382293701172
                || tick.getBoundingClientRect().top == 186.27108764648438 || tick.getBoundingClientRect().top == 187.1781463623047).toBe(true);
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
                expect(path === "85.24346257889991" || path === "78.73164687177996" || path === "78.1805743469051" || path === "78.44555778330285").toBe(true);
                expect(path1 === "24.34625788999098" || path1 === "335.1628166915052" || path1 === "334.03412576687117" || path1 === "335.0669440242058").toBe(true);
                expect(path2 === "85.24346257889991" || path2 === "723.4988822652757" || path2 === "685.9942484662577" || path2 === "703.7560514372163").toBe(true);
                expect(path3 === "403.2551848512173" || path3 === "335.1628166915052" || path3 === "334.03412576687117" || path3 === "335.0669440242058").toBe(true);
                done();
            }
            chartObj.refresh();
        });
        it('checking intervaltype as years', (done: Function) => {
            chartObj.loaded = () => {
                let label: Element = document.getElementById('chartContainer-0-axis-label-0');
                expect(parseInt(label.getAttribute('x')) == 75 || parseInt(label.getAttribute('x')) == 76).toBe(true);
                expect(parseInt(label.getAttribute('y')) == 241 || parseInt(label.getAttribute('y')) == 243).toBe(true);
                label = document.getElementById('chartContainer-0-axis-label-10');
                expect(parseInt(label.getAttribute('x')) == 675 || parseInt(label.getAttribute('x')) == 642 || parseInt(label.getAttribute('x')) == 657).toBe(true);
                expect(parseInt(label.getAttribute('y')) == 243 || parseInt(label.getAttribute('y')) == 242).toBe(true);
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
                expect(parseInt(label.getAttribute('x')) == 154 || parseInt(label.getAttribute('x')) == 161 || parseInt(label.getAttribute('x')) == 157).toBe(true);
                expect(parseInt(label.getAttribute('y')) == 231 || parseInt(label.getAttribute('y')) == 233).toBe(true);
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
                expect(parseInt(label.getAttribute('x')) == 160 || parseInt(label.getAttribute('x')) == 166 || parseInt(label.getAttribute('x')) == 164).toBe(true);
                expect(parseInt(label.getAttribute('y')) == 237 || parseInt(label.getAttribute('y')) == 239).toBe(true);
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
                expect(parseInt(label.getAttribute('x')) == 75 || parseInt(label.getAttribute('x')) == 76).toBe(true);
                expect(parseInt(label.getAttribute('y')) == 240 || parseInt(label.getAttribute('y')) == 242).toBe(true);
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
                expect(parseInt(label.getAttribute('x')) == 75 || parseInt(label.getAttribute('x')) == 76).toBe(true);
                expect(parseInt(label.getAttribute('y')) == 235 || parseInt(label.getAttribute('y')) == 237).toBe(true);
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
                expect(parseInt(label.getAttribute('x')) == 75 || parseInt(label.getAttribute('x')) == 76).toBe(true);
                expect(parseInt(label.getAttribute('y')) == 235 || parseInt(label.getAttribute('y')) == 237).toBe(true);
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
                expect(parseInt(label.getAttribute('x')) == 75 || parseInt(label.getAttribute('x')) == 76).toBe(true);
                expect(parseInt(label.getAttribute('y')) == 235 || parseInt(label.getAttribute('y')) == 237).toBe(true);
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
                expect(parseInt(label.getAttribute('x')) == 75 || parseInt(label.getAttribute('x')) == 76).toBe(true);
                expect(parseInt(label.getAttribute('y')) == 241 || parseInt(label.getAttribute('y')) == 243).toBe(true);
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
                expect(parseInt(label.getAttribute('x')) == 75 || parseInt(label.getAttribute('x')) == 76).toBe(true);
                expect(parseInt(label.getAttribute('y')) == 235 || parseInt(label.getAttribute('y')) == 238).toBe(true);
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
                expect(parseInt(label.getAttribute('x')) == 75 || parseInt(label.getAttribute('x')) == 76).toBe(true);
                expect(parseInt(label.getAttribute('y')) == 241 || parseInt(label.getAttribute('y')) == 243).toBe(true);
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
    // it('memory leak', () => {
    //     profile.sample();
    //     let average: any = inMB(profile.averageChange);
    //     //Check average change in memory samples to not be over 10MB
    //     expect(average).toBeLessThan(10);
    //     let memory: any = inMB(getMemoryProfile());
    //     //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
    //     expect(memory).toBeLessThan(profile.samples[0] + 0.25);
    // });
});
