
/**
 * Category spec document
 */
import { createElement } from '@syncfusion/ej2-base';
import { Chart } from '../../../src/chart/chart';
import { LineSeries } from '../../../src/chart/series/line-series';
import { ColumnSeries } from '../../../src/chart/series/column-series';
import { DataLabel } from '../../../src/chart/series/data-label';
import { Category } from '../../../src/chart/axis/category-axis';
import { Crosshair } from '../../../src/chart/user-interaction/crosshair';
import { categoryData, categoryData1, rotatedLabels } from '../base/data.spec';
import { MouseEvents } from '../base/events.spec';
import { unbindResizeEvents } from '../base/data.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { EmitType } from '@syncfusion/ej2-base';
import { ILoadedEventArgs, IAxisLabelRenderEventArgs } from '../../../src/chart/model/chart-interface';
import  {profile , inMB, getMemoryProfile} from '../../common.spec';
Chart.Inject(LineSeries, Category, DataLabel, Crosshair, ColumnSeries);

describe('Chart Control', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
    describe('Category Axis', () => {
        let chart: Chart;
        let ele: HTMLElement;
        let loaded: EmitType<ILoadedEventArgs>;
        let element: Element;
        beforeAll((): void => {
            ele = createElement('div', { id: 'container' });
            document.body.appendChild(ele);
            chart = new Chart(
                {
                    primaryXAxis: { valueType: 'Category', rangePadding: 'Normal' },
                    primaryYAxis: { title: 'PrimaryYAxis' },
                    series: [{ dataSource: categoryData, xName: 'x', yName: 'y', name: 'Gold', fill: 'red', animation: { enable: false } }],
                    height: '400', width: '900',
                    legendSettings: { visible: false }
                });
            
        });

        afterAll((): void => {
            
            chart.destroy();
            ele.remove();
        });
        it('Checking the Labels', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: HTMLElement = document.getElementById('containerAxisLabels0');
                expect(svg.childNodes.length == 8).toBe(true);
                svg = document.getElementById('container0_AxisLabel_0');
                expect(svg.textContent == 'USA').toBe(true);
                svg = document.getElementById('container0_AxisLabel_7');
                expect(svg.textContent == 'Sweden').toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.appendTo('#container');

        });
        it('Checking with multiple series', (done: Function) => {
            chart.series = [
                { dataSource: categoryData, xName: 'x', yName: 'y', name: 'Gold', fill: 'rgba(135,206,235,1)', animation: { enable: false } },
                { dataSource: categoryData1, xName: 'x', yName: 'y', name: 'Gold', fill: 'brown', animation: { enable: false } }];

            loaded = (args: Object): void => {
                let svg: HTMLElement = document.getElementById('containerAxisLabels0');
                expect(svg.childNodes.length == 10).toBe(true);
                svg = document.getElementById('container0_AxisLabel_0');
                expect(svg.textContent == 'USA').toBe(true);
                svg = document.getElementById('container0_AxisLabel_9');
                expect(svg.textContent == 'Germany1').toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.refresh();
        });
        it('Checking labelPlacement', (done: Function) => {
            chart.primaryXAxis.labelPlacement = 'OnTicks';
            loaded = (args: Object): void => {
                let svg: HTMLElement = document.getElementById('container0_AxisLabel_0');
                let svg1: HTMLElement = document.getElementById('containerAxisLine_1');
                expect(parseFloat(svg.getAttribute('x')) < parseFloat(svg1.getAttribute('d').split(' ')[1])).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.refresh();
        });
        it('Checking edgelabelPlacement', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: HTMLElement = document.getElementById('container0_AxisLabel_0');
                expect(svg == null).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.primaryXAxis.edgeLabelPlacement = 'Hide';
            chart.refresh();

        });
        it('Checking edgelabelPlacement shift', (done: Function) => {
            loaded = (args: Object): void => {
                let svg = document.getElementById('container0_AxisLabel_0');
                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                expect(parseFloat(svg.getAttribute('x')) < parseFloat(chartArea.getAttribute('x'))).toBe(true);
                svg = document.getElementById('container0_AxisLabel_9');
                expect(parseFloat(svg.getAttribute('x')) < parseFloat(chartArea.getAttribute('width')) + parseFloat(chartArea.getAttribute('x')))
                done();
            };
            chart.loaded = loaded;
            chart.primaryXAxis.edgeLabelPlacement = 'Shift';
            chart.refresh();

        });
        it('Checking edgelabelPlacement shift with isInversed', (done: Function) => {
            loaded = (args: Object): void => {
                let svg = document.getElementById('container0_AxisLabel_9');
                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                expect(parseFloat(svg.getAttribute('x')) === parseFloat(chartArea.getAttribute('x'))).toBe(false);
                svg = document.getElementById('container0_AxisLabel_0');
                expect(parseFloat(svg.getAttribute('x')) < parseFloat(chartArea.getAttribute('width')) + parseFloat(chartArea.getAttribute('x')))
                done();
            };
            chart.loaded = loaded;
            chart.primaryXAxis.edgeLabelPlacement = 'Shift';
            chart.primaryXAxis.isInversed = true;
            chart.refresh();

        });
        it('Checking the labels with category range', (done: Function) => {
            chart.primaryXAxis.interval = 2;
            chart.primaryXAxis.isInversed = false;
            chart.primaryXAxis.edgeLabelPlacement = 'None';
            chart.axisLabelRender = (args: IAxisLabelRenderEventArgs) => {
                args.text = args.text + 'cus';
                if (args.text === 'USAcus') {
                   args.labelStyle.color = 'red';
                }
            };
            loaded = (args: Object): void => {
                let svg: HTMLElement = document.getElementById('containerAxisLabels0');
                expect(svg.childNodes.length == 5).toBe(true);
                expect(svg.childNodes[1].textContent.indexOf('cus') > -1).toBe(true);
                let axisLabel: HTMLElement = document.getElementById('container0_AxisLabel_0');
                expect(axisLabel.getAttribute('fill') === 'red').toBe(true);
                axisLabel = document.getElementById('container0_AxisLabel_1');
                expect(axisLabel.getAttribute('fill') !== 'red').toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.refresh();

        });
        it('Checking the Label intersect action with rotate45', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: HTMLElement = document.getElementById('containerAxisLabels0');
                expect(svg.childNodes.length == 10).toBe(true);
                let element: Element = <Element>svg.childNodes[1];
                expect(element.getAttribute('transform').indexOf('rotate(45') > -1).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.primaryXAxis.labelIntersectAction = 'Rotate45';
            chart.primaryXAxis.interval = 1;
            chart.axisLabelRender = (args: IAxisLabelRenderEventArgs) => {
                args.text = args.text + 'cus';
            };
            chart.width = '400';
            chart.dataBind();
        });
        it('Checking the Label intersect action with hide', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: HTMLElement = document.getElementById('containerAxisLabels0');
                expect(svg.childNodes.length != 10).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.primaryXAxis.labelIntersectAction = 'Hide';
            chart.axisLabelRender = (args: IAxisLabelRenderEventArgs) => {
                args.text = args.text + 'cus';
            };
            chart.dataBind();
        });
        it('Checking the Label intersect action with rotate90', (done: Function) => {
            loaded = (args: Object): void => {
                let svg: HTMLElement = document.getElementById('containerAxisLabels0');
                expect(svg.childNodes.length == 10).toBe(true);
                let element: Element = <Element>svg.childNodes[1];
                expect(element.getAttribute('transform').indexOf('rotate(90') > -1).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.primaryXAxis.labelIntersectAction = 'Rotate90';
            chart.axisLabelRender = (args: IAxisLabelRenderEventArgs) => {
                args.text = args.text + 'cus';
            };
            chart.dataBind();
        });
        it('Checking the axis labels without data for series', (done: Function) => {
            let trigger: MouseEvents = new MouseEvents();
            chart.primaryXAxis.interval = null;
            chart.primaryXAxis.crosshairTooltip.enable = true;
            chart.primaryYAxis.crosshairTooltip.enable = true;
            chart.series = [{ dataSource: null, name: 'Gold', fill: 'rgba(135,206,235,1)' }];
            loaded = (args: Object): void => {
                let svg: HTMLElement = document.getElementById('containerAxisLabels0');
                expect(svg.childNodes.length == 0).toBe(true);
                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                let y = parseFloat(chartArea.getAttribute('y')) + parseFloat(chartArea.getAttribute('height')) / 3 + ele.offsetTop;
                let x = parseFloat(chartArea.getAttribute('x')) + parseFloat(chartArea.getAttribute('width')) / 3 + ele.offsetLeft;
                trigger.mousemovetEvent(chartArea, Math.ceil(x), Math.ceil(y));
                let crosshair: Element = <Element>document.getElementById('container_svg').lastChild;
                let element1: HTMLElement;
                expect(crosshair.childNodes.length == 3).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.crosshair.enable = true;
            chart.refresh();

        });
        it('Checking category axis with on ticks single point', (done: Function) => {
            loaded = (args: Object): void => {
                let element: Element = document.getElementById('container_Series_0_Point_0_Text_0');
                expect(element.getAttribute('x') == '12' || element.getAttribute('x') == '12.5').toBe(true);
                expect(document.getElementById('containerAxisLabels0').childNodes.length == 1).toBe(true);
                done();
            };
            chart.primaryXAxis.interval = null;
            chart.primaryXAxis.labelPlacement = 'OnTicks';
            chart.series = [{
                dataSource: [{ 'x': 'USA', 'y': 2.5 }], xName: 'x', animation: { enable: false },
                yName: 'y', name: 'Gold', fill: 'rgba(135,206,235,1)', marker: { visible: true, dataLabel: { visible: true } }
            }];
            chart.loaded = loaded;
            chart.refresh();
        });
        it('Checking category axis with zoom position', (done:  Function)  =>  {
            let  trigger:  MouseEvents  =  new  MouseEvents();
            loaded  =  (args:  Object):  void  =>  {
                expect(document.getElementById('containerAxisLabels0').childNodes.length  ==  0).toBe(true);
                done();
            };
            chart.primaryXAxis.interval  =  null;
            chart.primaryXAxis.labelPlacement  =  'BetweenTicks';
            chart.primaryXAxis.zoomPosition  =  0.0018;
            chart.primaryXAxis.zoomFactor  =  0.1317;
            chart.series  =  [{
                dataSource: [{ 'x':  'USA',  'y':  2.5 }], xName: 'x',
                yName: 'y', name:  'Gold', fill:  'rgba(135,206,235,1)'
             }];
            chart.loaded  =  loaded;
            chart.refresh();
        });
        it('checking x axis as inversed axis', (done: Function) => {
            loaded = (args: Object): void => {
                let firstLabel: HTMLElement = document.getElementById('container0_AxisLabel_0');
                expect(firstLabel.textContent).toEqual('USA');
                let lastLabel: HTMLElement = document.getElementById('container0_AxisLabel_7');
                expect(lastLabel.textContent).toEqual('Sweden');
                expect(+firstLabel.getAttribute('x') > (+lastLabel.getAttribute('x'))).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.primaryXAxis.isInversed = true;
            chart.series = [{
                dataSource: categoryData, xName: 'x', type: 'Line',
                yName: 'y', name: 'Gold', fill: 'rgba(135,206,235,1)'
            }];
            chart.axisLabelRender = null;
            chart.primaryXAxis.zoomPosition = 0;
            chart.primaryXAxis.zoomFactor = 1;
            chart.refresh();
        });
        it('checking edge label for y Axis hide', (done: Function) => {
            loaded = (args: Object): void => {
                let label: HTMLElement = document.getElementById('container1_AxisLabel_0');
                expect(label.textContent).toEqual('');
                label = document.getElementById('container1_AxisLabel_8');
                expect(label.textContent).toEqual('');
                done();
            };
            chart.loaded = loaded;
            chart.primaryYAxis.isInversed = true;
            chart.primaryYAxis.edgeLabelPlacement = 'Hide';
            chart.refresh();
        });
        it('checking edge label for y Axis shift', (done: Function) => {
            loaded = (args: Object): void => {
                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                let label: HTMLElement = document.getElementById('container1_AxisLabel_0');
                expect(parseFloat(label.getAttribute('y')) < parseFloat(chartArea.getAttribute('y'))).toBe(true);
                label = document.getElementById('container1_AxisLabel_8');
                expect(parseFloat(label.getAttribute('y')) < parseFloat(chartArea.getAttribute('y')) + parseFloat(chartArea.getAttribute('height'))).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.primaryYAxis.edgeLabelPlacement = 'Shift';
            chart.refresh();
        });
        it('checking edge label hidden with inversed', function (done) {
            loaded = function (args) {
                let chartArea: HTMLElement = document.getElementById('container0_AxisLabel_1');
                expect(chartArea).toBe(null);
                done();
            };
            chart.loaded = loaded;
            chart.primaryXAxis.labelIntersectAction = 'Hide';
            chart.primaryXAxis.isInversed = true;
            chart.series = [{
                dataSource: [
                    { 'x': 'South Africa', 'y': 5 }, 
                    { 'x': 'United States of America', 'y': 2.5 }, { 'x': 'United Kingdom', 'y': 5 },
                    { 'x': 'United Arab Emirates', 'y': 5.5 }, { 'x': 'Australia', 'y': 7.5 }                    
                ], xName: 'x', animation: { enable: false },
                yName: 'y', name: 'Gold', fill: 'rgba(135,206,235,1)', marker: { visible: true, dataLabel: { visible: true } }
            }];
            chart.refresh();
        });
        it('checking with category axis minimum', (done: Function) => {
            loaded = (args: Object): void => {
                let label: HTMLElement = document.getElementById('container0_AxisLabel_0');
                expect(label.textContent).toEqual('United Kingdom');
                done();
            };
            chart.loaded = loaded;
            chart.width =  '800';
            chart.primaryXAxis.minimum = 2;
            chart.refresh();
        });
        it('checking with category axis maximum', (done: Function) => {
            loaded = (args: Object): void => {
                let label: HTMLElement = document.getElementById('container0_AxisLabel_0');
                expect(label.textContent).toEqual('South Africa');
                done();
            };
            chart.loaded = loaded;
            chart.primaryXAxis.minimum = null;
            chart.primaryXAxis.maximum = 3;
            chart.refresh();
        });
        it('checking with category axis interval', (done: Function) => {
            loaded = (args: Object): void => {
                let label: HTMLElement = document.getElementById('container0_AxisLabel_0');
                expect(label.textContent).toEqual('South Africa');
                done();
            };
            chart.loaded = loaded;
            chart.primaryXAxis.minimum = null;
            chart.primaryXAxis.maximum = null;
            chart.primaryXAxis.interval = 2;
            chart.refresh();
        });
        it('checking with category axis range', (done: Function) => {
            loaded = (args: Object): void => {
                let label: HTMLElement = document.getElementById('container0_AxisLabel_0');
                expect(label.textContent).toEqual('United States of America');
                done();
            };
            chart.loaded = loaded;
            chart.primaryXAxis.minimum = 1;
            chart.primaryXAxis.maximum = 5;
            chart.primaryXAxis.interval = 3;
            chart.refresh();
        });
    });
    describe('Category Axis labels with line break', () => {
        let chart: Chart;
        let ele: HTMLElement;
        let loaded: EmitType<ILoadedEventArgs>;
        let element: Element;
        beforeAll((): void => {
            ele = createElement('div', { id: 'container' });
            document.body.appendChild(ele);
            chart = new Chart(
                {
                    primaryXAxis: { valueType: 'Category' },
                    primaryYAxis: { },
                    series: [{
                        dataSource: [
                            { x: "India", y: 61.3 },
                            { x: "United<br>States<br>of<br>America", y: 31 },
                            { x: "South<br>Korea", y: 39.4 },
                            { x: "United<br>Arab<br>Emirates", y: 65.1 },
                            { x: "United<br>Kingdom", y: 75.9 }
                        ],
                        xName: 'x', yName: 'y', type: 'Column', animation: { enable: false }
                    }],
                    legendSettings: { visible: false }
                }, '#container');

        });

        afterAll((): void => {
            
            chart.destroy();
            ele.remove();
        });
        it('line break labels count checking', (done: Function) => {
            loaded = (args: Object): void => {
                let label: HTMLElement = document.getElementById('containerAxisLabels0');
                expect(label.childElementCount == 5).toBe(true);
                label = document.getElementById('container0_AxisLabel_1');
                expect(label.childElementCount == 3).toBe(true);
                let x: number = parseInt(label.getAttribute("x"));
                //expect(x == 239 || x == 240).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.refresh();
        });
        it('Checking line break labels with inversed axis', (done: Function) => {
            loaded = (args: Object): void => {
                let label: HTMLElement = document.getElementById('container0_AxisLabel_1');
                let x: number = parseInt(label.getAttribute("x"));
                //expect(x == 529 || x == 530).toBe(true);
                expect(label.childElementCount == 3).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.primaryXAxis.isInversed = true;
            chart.refresh();
        });
        it('Checking line break labels with opposed position true', (done: Function) => {
            loaded = (args: Object): void => {
                let label: HTMLElement = document.getElementById('containerAxisLabels0');
                expect(label.childElementCount == 5).toBe(true);
                label = document.getElementById('container0_AxisLabel_1');
                expect(label.childElementCount == 3).toBe(true);
                let x: number = parseInt(label.getAttribute("x"));
                //expect(x == 239 || x == 240).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.primaryXAxis.isInversed = false;
            chart.primaryXAxis.opposedPosition = true;
            chart.refresh();
        });
        it('Checking line break labels with trim', (done: Function) => {
            loaded = (args: Object): void => {
                let label: HTMLElement = document.getElementById('containerAxisLabels0');
                expect(label.childElementCount == 5).toBe(true);
                label = document.getElementById('container0_AxisLabel_2');
                expect(label.childElementCount == 1).toBe(true);               
                expect(label.childNodes[0].textContent === 'Southhhhhhhhhhhhhhhh...' || label.childNodes[0].textContent === 'Southhhhhhhhhhhhhhhhhhh...').toBe(true);
                expect(label.childNodes[1].textContent === 'Koreaaaaaaaaaaaaaaaaaa...' || label.childNodes[1].textContent === 'Koreaaaaaaaaaaaaaaaaaaaaa...').toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.series[0].dataSource[2] = {x: 'Southhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh<br>Koreaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', y: 39.4};
            chart.primaryXAxis.isInversed = false;
            chart.primaryXAxis.opposedPosition = false;
            chart.refresh();
        });
        it('Checking line break labels with wrap', (done: Function) => {
            loaded = (args: Object): void => {
                let label: HTMLElement = document.getElementById('containerAxisLabels0');
                expect(label.childElementCount == 5).toBe(true);
                label = document.getElementById('container0_AxisLabel_2');
                expect(label.childElementCount == 2).toBe(true);
                expect(label.childNodes[0].textContent == 'Southhhhhhhhhhhhhhhh...' || label.childNodes[0].textContent == 'Southhhhhhhhhhhhhhhhhhh...').toBe(true);
                expect(label.childNodes[1].textContent == 'testhhhhhhhhhhhhhhhh...'|| label.childNodes[1].textContent == 'testhhhhhhhhhhhhhhhhhhh...').toBe(true);
                expect(label.childNodes[2].textContent == 'Koreaaaaaaaaaaaaaaaaaa...'|| label.childNodes[2].textContent == 'Koreaaaaaaaaaaaaaaaaaaaaa...').toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.series[0].dataSource[2] = {x: 'Southhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh testhhhhhhhhhhhhhhhhhhhhhhh<br>Koreaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', y: 39.4};
            chart.primaryXAxis.isInversed = false;
            chart.primaryXAxis.labelIntersectAction = 'Wrap';
            chart.primaryXAxis.opposedPosition = false;
            chart.refresh();
        });
        it('Checking line break labels with Rotate45', (done: Function) => {
            loaded = (args: Object): void => {
                let label: HTMLElement = document.getElementById('containerAxisLabels0');
                expect(label.childElementCount == 5).toBe(true);
                label = document.getElementById('container0_AxisLabel_1');
                expect(label.childElementCount == 3).toBe(true);
                expect(label.getAttribute("transform").indexOf("45") != -1).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.series[0].dataSource[2] = {x: 'South<br>Korea', y: 39.4};
            chart.primaryXAxis.labelIntersectAction = 'Rotate45';
            chart.primaryXAxis.labelRotation = 45;
            chart.refresh();
        });
        it('Checking line break labels with Rotate90', (done: Function) => {
            loaded = (args: Object): void => {
                let label: HTMLElement = document.getElementById('containerAxisLabels0');
                expect(label.childElementCount == 5).toBe(true);
                label = document.getElementById('container0_AxisLabel_1');
                expect(label.childElementCount == 3).toBe(true);
                expect(label.getAttribute("transform").indexOf("90") != -1).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.series[0].dataSource[2] = {x: 'South<br>Korea', y: 39.4};
            chart.primaryXAxis.labelIntersectAction = 'Rotate90';
            chart.primaryXAxis.labelRotation = 90;
            chart.refresh();
        });
    });
    describe('Checking rotated label intersection with category-axis-labels', () => {
        let chart: Chart;
        let ele: HTMLElement;
        let loaded: EmitType<ILoadedEventArgs>;
        let element: Element;
        beforeAll((): void => {
            ele = createElement('div', { id: 'container' });
            document.body.appendChild(ele);
            chart = new Chart(
                {
                    primaryXAxis: {
                        valueType: 'Category',
                        interval: 1,
                        majorGridLines: { width: 0 },
                        labelIntersectAction: 'Hide',
                        labelRotation: 0,
                    },
                    primaryYAxis: {
                        labelStyle: { size: '0px' },
                        majorTickLines: { width: 0 },
                        majorGridLines: { width: 0 },
                        lineStyle: { width: 0 },
                    },
                    chartArea: {
                        border: {
                            width: 0
                        }
                    },
                    width: '800px',
                    height: '450px',
                    legendSettings: {
                        visible: false
                    },
                    series: [
                        {
                            type: 'Column',
                            xName: 'x',
                            yName: 'y',
                            dataSource: rotatedLabels,
                            animation: {enable: false}
                        }
                    ],
                }, '#container');

        });

        afterAll((): void => {

            chart.destroy();
            ele.remove();
        });
        it('Label count with 0 degree', (done: Function) => {
            loaded = (args: Object): void => {
                let labelGroup: HTMLElement = document.getElementById('containerAxisLabels0');
                expect(labelGroup.childElementCount == 5).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.refresh();
        });
        it('Label count with +45 degree', (done: Function) => {
            loaded = (args: Object): void => {
                let labelGroup: HTMLElement = document.getElementById('containerAxisLabels0');
                expect(labelGroup.childElementCount == 50).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.primaryXAxis.labelRotation = 45;
            chart.refresh();
        });
        it('Label count with +90 degree', (done: Function) => {
            loaded = (args: Object): void => {
                let labelGroup: HTMLElement = document.getElementById('containerAxisLabels0');
                expect(labelGroup.childElementCount == 50).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.primaryXAxis.labelRotation = 90;
            chart.refresh();
        });
        it('Label count with +185 degree', (done: Function) => {
            loaded = (args: Object): void => {
                let labelGroup: HTMLElement = document.getElementById('containerAxisLabels0');
                expect(labelGroup.childElementCount == 9).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.primaryXAxis.labelRotation = 185;
            chart.refresh();
        });
        it('Label count with +350 degree', (done: Function) => {
            loaded = (args: Object): void => {
                let labelGroup: HTMLElement = document.getElementById('containerAxisLabels0');
                expect(labelGroup.childElementCount == 17).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.primaryXAxis.labelRotation = 350;
            chart.refresh();
        });
        it('Label count with -10 degree', (done: Function) => {
            loaded = (args: Object): void => {
                let labelGroup: HTMLElement = document.getElementById('containerAxisLabels0');
                expect(labelGroup.childElementCount == 17).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.primaryXAxis.labelRotation = -10;
            chart.refresh();
        });
        it('Label count with -45 degree', (done: Function) => {
            loaded = (args: Object): void => {
                let labelGroup: HTMLElement = document.getElementById('containerAxisLabels0');
                expect(labelGroup.childElementCount == 50).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.primaryXAxis.labelRotation = -45;
            chart.refresh();
        });
        it('Label count with -90 degree', (done: Function) => {
            loaded = (args: Object): void => {
                let labelGroup: HTMLElement = document.getElementById('containerAxisLabels0');
                expect(labelGroup.childElementCount == 50).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.primaryXAxis.labelRotation = -90;
            chart.refresh();
        });
        it('Label count with -280 degree', (done: Function) => {
            loaded = (args: Object): void => {
                let labelGroup: HTMLElement = document.getElementById('containerAxisLabels0');
                expect(labelGroup.childElementCount == 50 || labelGroup.childElementCount == 60).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.primaryXAxis.labelRotation = -280;
            chart.refresh();
        });

    });
    describe('Checking line break label alignment', () => {
        let chart: Chart;
        let ele: HTMLElement;
        let loaded: EmitType<ILoadedEventArgs>;
        let label: HTMLElement;
        let anchor: string
        beforeAll((): void => {
            ele = createElement('div', { id: 'container' });
            document.body.appendChild(ele);
            chart = new Chart(
                {
                    primaryXAxis: {
                        valueType: 'Category', interval: 1,
                        lineBreakAlignment: 'Left'
                    },
                    primaryYAxis: {
                        minimum: 0, maximum: 300, interval: 50,
                        labelFormat: '${value}<br>t',
                        lineBreakAlignment: 'Left',
                    },
                    series: [{
                        dataSource: [
                            { x: 'America<br>20<br>America', y: 106 },
                            { x: 'Europe<br>20<br>America', y: 103 },
                            { x: 'Asia<br>20<br>America', y: 198 },
                            { x: 'China<br>20<br>America', y: 189 },
                            { x: 'Australia<br>20<br>America', y: 250 }
                        ],
                        xName: 'x', yName: 'y',
                        opacity: 0.5, fill: '#69D2E7',
                        name: 'Product A',
                        type: 'Column'
                    }],
                }, '#container');

        });

        afterAll((): void => {

            chart.destroy();
            ele.remove();
        });
        it('left alignment checking for X axis', (done: Function) => {
            loaded = (args: Object): void => {
                label = document.getElementById('container0_AxisLabel_0');
                anchor = label.getAttribute('text-anchor');
                expect(anchor === 'start').toBe(true);
                label = document.getElementById('container0_AxisLabel_4');
                anchor = label.getAttribute('text-anchor');
                expect(anchor === 'start').toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.refresh();
        });
        it('center alignment checking for X axis', (done: Function) => {
            loaded = (args: Object): void => {
                label = document.getElementById('container0_AxisLabel_0');
                anchor = label.getAttribute('text-anchor');
                expect(anchor === 'middle').toBe(true);
                label = document.getElementById('container0_AxisLabel_4');
                anchor = label.getAttribute('text-anchor');
                expect(anchor === 'middle').toBe(true);
                done();
            };
            chart.primaryXAxis.lineBreakAlignment = 'Center';
            chart.loaded = loaded;
            chart.refresh();
        });
        it('right alignment checking for X axis', (done: Function) => {
            loaded = (args: Object): void => {
                label = document.getElementById('container0_AxisLabel_0');
                anchor = label.getAttribute('text-anchor');
                expect(anchor === 'end').toBe(true);
                label = document.getElementById('container0_AxisLabel_4');
                anchor = label.getAttribute('text-anchor');
                expect(anchor === 'end').toBe(true);
                done();
            };
            chart.primaryXAxis.lineBreakAlignment = 'Right';
            chart.loaded = loaded;
            chart.refresh();
        });
        it('left alignment checking for Y axis', (done: Function) => {
            loaded = (args: Object): void => {
                label = document.getElementById('container1_AxisLabel_0');
                anchor = label.getAttribute('text-anchor');
                expect(anchor === 'middle').toBe(true);
                label = document.getElementById('container1_AxisLabel_4');
                anchor = label.getAttribute('text-anchor');
                expect(anchor === 'middle').toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.primaryYAxis.lineBreakAlignment = 'Left';
            chart.refresh();
        });
        it('center alignment checking for Y axis', (done: Function) => {
            loaded = (args: Object): void => {
                label = document.getElementById('container1_AxisLabel_0');
                anchor = label.getAttribute('text-anchor');
                expect(anchor === 'middle').toBe(true);
                label = document.getElementById('container1_AxisLabel_4');
                anchor = label.getAttribute('text-anchor');
                expect(anchor === 'middle').toBe(true);
                done();
            };
            chart.primaryYAxis.lineBreakAlignment = 'Center';
            chart.loaded = loaded;
            chart.refresh();
        });
        it('right alignment checking for Y axis', (done: Function) => {
            loaded = (args: Object): void => {
                label = document.getElementById('container1_AxisLabel_0');
                anchor = label.getAttribute('text-anchor');
                expect(anchor === 'middle').toBe(true);
                label = document.getElementById('container1_AxisLabel_4');
                anchor = label.getAttribute('text-anchor');
                expect(anchor === 'middle').toBe(true);
                done();
            };
            chart.primaryYAxis.lineBreakAlignment = 'Right';
            chart.loaded = loaded;
            chart.refresh();
        });
    });
    let normalData: object[] = [
        { x: "January<br>19", y: 100 },
        { x: "February<br>19", y: 150 },
        { x: "March.<br>19", y: 200 },
        { x: "April.<br>19", y: 250 },
        { x: "May<br>19", y: 300 },
        { x: "June<br>19", y: 50 },
        { x: "July<br>19", y: 105 },
        { x: "August<br>19", y: 123 },
        { x: "September<br>19", y: 144 },
        { x: "October<br>19", y: 175 },
        { x: "November<br>19", y: 500 }
    ];

    let wrapData: object[] = [
        { x: "Janua ry<br>19", y: 100 },
        { x: "Febru ary<br>19", y: 150 },
        { x: "March.<br>19", y: 200 },
        { x: "April.<br>19", y: 250 },
        { x: "May<br>19", y: 300 },
        { x: "June<br>19", y: 50 },
        { x: "July<br>19", y: 105 },
        { x: "August<br>19", y: 123 },
        { x: "Septe mber<br>19", y: 144 },
        { x: "October<br>19", y: 175 },
        { x: "Novemb er<br>19", y: 500 }
    ];
    describe('Label intersect actions checking with line break label Left alignment', () => {
        let chart: Chart;
        let ele: HTMLElement;
        let loaded: EmitType<ILoadedEventArgs>;
        let label: HTMLElement;
        let anchor: string;
        let yValue: number;
        let angle: number;
        beforeAll((): void => {
            ele = createElement('div', { id: 'container', styles: 'width: 450px;height: 400px' });
            document.body.appendChild(ele);
            chart = new Chart(
                {
                    primaryXAxis: {
                        majorGridLines: { width: 0 },
                        lineStyle: { width: 0 },
                        majorTickLines: { width: 0 },
                        valueType: 'Category',
                        lineBreakAlignment: 'Left',
                        labelIntersectAction: 'Trim'
                    },
                    primaryYAxis: {},

                    chartArea: {
                        border: {
                            width: 1
                        }
                    },
                    //Initializing Chart Series
                    series: [
                        {
                            type: 'Column',
                            dataSource: normalData,
                            xName: 'x',
                            yName: 'y', name: 'Germany',
                            animation: { enable: false }
                        }
                    ],
                    //Initializing Chart title
                    title: 'Inflation - Consumer Price',
                }, '#container');

        });

        afterAll((): void => {

            chart.destroy();
            ele.remove();
        });
        it('Trim checking', (done: Function) => {
            loaded = (args: Object): void => {
                label = document.getElementById("containerAxisLabels0");
                expect(label.childElementCount === 11);
                label = document.getElementById('container0_AxisLabel_0');
                anchor = label.getAttribute('text-anchor');
                expect(anchor === 'start').toBe(true);
                expect(label.innerHTML.split('...')[0] === 'Janu');
                label = document.getElementById('container0_AxisLabel_10');
                anchor = label.getAttribute('text-anchor');
                expect(anchor === 'start').toBe(true);
                expect(label.innerHTML.split('...')[0] === 'Nove');
                done();
            };
            chart.loaded = loaded;
            chart.refresh();
        });
        it('Hide checking', (done: Function) => {
            loaded = (args: Object): void => {
                label = document.getElementById("containerAxisLabels0");
                expect(label.childElementCount === 8);
                label = document.getElementById('container0_AxisLabel_0');
                anchor = label.getAttribute('text-anchor');
                expect(anchor === 'start').toBe(true);
                expect(label.innerHTML.slice(0, 7) === 'January');
                label = document.getElementById('container0_AxisLabel_9');
                anchor = label.getAttribute('text-anchor');
                expect(anchor === 'start').toBe(true);
                expect(label.innerHTML.slice(0, 7) === 'October');
                done();
            };
            chart.primaryXAxis.labelIntersectAction = 'Hide';
            chart.loaded = loaded;
            chart.refresh();
        });
        it('Wrap checking', (done: Function) => {
            loaded = (args: Object): void => {
                label = document.getElementById("containerAxisLabels0");
                expect(label.childElementCount === 11);
                label = document.getElementById('container0_AxisLabel_0');
                anchor = label.getAttribute('text-anchor');
                expect(anchor === 'start').toBe(true);
                expect(label.innerHTML.slice(0, 5) === 'Janua');
                expect(label.children[0].innerHTML === 'ry');
                expect(label.children[1].innerHTML === '19');
                label = document.getElementById('container0_AxisLabel_10');
                anchor = label.getAttribute('text-anchor');
                expect(anchor === 'start').toBe(true);
                expect(label.innerHTML.slice(0, 7) === 'Nove...');
                expect(label.children[0].innerHTML === 'er');
                expect(label.children[1].innerHTML === '19');
                done();
            };
            chart.primaryXAxis.labelIntersectAction = 'Wrap';
            chart.series[0].dataSource = wrapData;
            chart.loaded = loaded;
            chart.refresh();
        });
        it('Multiple Rows checking', (done: Function) => {
            loaded = (args: Object): void => {
                label = document.getElementById("containerAxisLabels0");
                expect(label.childElementCount === 11);
                label = document.getElementById('container0_AxisLabel_0');
                anchor = label.getAttribute('text-anchor');
                expect(anchor === 'start').toBe(true);
                yValue = +label.getAttribute("y");
                expect(yValue === 337);
                label = document.getElementById('container0_AxisLabel_1');
                anchor = label.getAttribute('text-anchor');
                expect(anchor === 'start').toBe(true);
                yValue = +label.getAttribute("y");
                expect(yValue === 363);
                done();
            };
            chart.primaryXAxis.labelIntersectAction = 'MultipleRows';
            chart.series[0].dataSource = normalData;
            chart.loaded = loaded;
            chart.refresh();
        });
        it('Rotate 45 checking', (done: Function) => {
            loaded = (args: Object): void => {
                label = document.getElementById("containerAxisLabels0");
                expect(label.childElementCount === 7);
                label = document.getElementById('container0_AxisLabel_0');
                anchor = label.getAttribute('text-anchor');
                expect(anchor === 'start').toBe(true);
                angle = +(label.getAttribute("transform").slice(7, 9));
                expect(angle === 45);
                label = document.getElementById('container0_AxisLabel_9');
                anchor = label.getAttribute('text-anchor');
                expect(anchor === 'start').toBe(true);
                angle = +(label.getAttribute("transform").slice(7, 9));
                expect(angle === 45);
                done();
            };
            chart.primaryXAxis.labelIntersectAction = 'Rotate45';
            chart.loaded = loaded;
            chart.refresh();
        });
        it('Rotate 90 checking', (done: Function) => {
            loaded = (args: Object): void => {
                label = document.getElementById("containerAxisLabels0");
                expect(label.childElementCount === 11);
                label = document.getElementById('container0_AxisLabel_0');
                anchor = label.getAttribute('text-anchor');
                expect(anchor === 'start').toBe(true);
                angle = +(label.getAttribute("transform").slice(7, 9));
                expect(angle === 90);
                label = document.getElementById('container0_AxisLabel_10');
                anchor = label.getAttribute('text-anchor');
                expect(anchor === 'start').toBe(true);
                angle = +(label.getAttribute("transform").slice(7, 9));
                expect(angle === 90);
                done();
            };
            chart.primaryXAxis.labelIntersectAction = 'Rotate90';
            chart.loaded = loaded;
            chart.refresh();
        });
    });
    describe('Label intersect actions checking with line break label Center alignment', () => {
        let chart: Chart;
        let ele: HTMLElement;
        let loaded: EmitType<ILoadedEventArgs>;
        let label: HTMLElement;
        let anchor: string;
        let yValue: number;
        let angle: number;
        beforeAll((): void => {
            ele = createElement('div', { id: 'container', styles: 'width: 450px;height: 400px' });
            document.body.appendChild(ele);
            chart = new Chart(
                {
                    primaryXAxis: {
                        majorGridLines: { width: 0 },
                        lineStyle: { width: 0 },
                        majorTickLines: { width: 0 },
                        valueType: 'Category',
                        lineBreakAlignment: 'Center',
                        labelIntersectAction: 'Trim'
                    },
                    primaryYAxis: {},

                    chartArea: {
                        border: {
                            width: 1
                        }
                    },
                    //Initializing Chart Series
                    series: [
                        {
                            type: 'Column',
                            dataSource: normalData,
                            xName: 'x',
                            yName: 'y', name: 'Germany',
                            animation: { enable: false }
                        }
                    ],
                    //Initializing Chart title
                    title: 'Inflation - Consumer Price',
                }, '#container');

        });

        afterAll((): void => {

            chart.destroy();
            ele.remove();
        });
        it('Trim checking', (done: Function) => {
            loaded = (args: Object): void => {
                label = document.getElementById("containerAxisLabels0");
                expect(label.childElementCount === 11);
                label = document.getElementById('container0_AxisLabel_0');
                anchor = label.getAttribute('text-anchor');
                expect(anchor === 'middle').toBe(true);
                expect(label.innerHTML.split('...')[0] === 'Janu');
                label = document.getElementById('container0_AxisLabel_10');
                anchor = label.getAttribute('text-anchor');
                expect(anchor === 'middle').toBe(true);
                expect(label.innerHTML.split('...')[0] === 'Nove');
                done();
            };
            chart.loaded = loaded;
            chart.refresh();
        });
        it('Hide checking', (done: Function) => {
            loaded = (args: Object): void => {
                label = document.getElementById("containerAxisLabels0");
                expect(label.childElementCount === 8);
                label = document.getElementById('container0_AxisLabel_0');
                anchor = label.getAttribute('text-anchor');
                expect(anchor === 'middle').toBe(true);
                expect(label.innerHTML.slice(0, 7) === 'January');
                label = document.getElementById('container0_AxisLabel_9');
                anchor = label.getAttribute('text-anchor');
                expect(anchor === 'middle').toBe(true);
                expect(label.innerHTML.slice(0, 7) === 'October');
                done();
            };
            chart.primaryXAxis.labelIntersectAction = 'Hide';
            chart.loaded = loaded;
            chart.refresh();
        });
        it('Wrap checking', (done: Function) => {
            loaded = (args: Object): void => {
                label = document.getElementById("containerAxisLabels0");
                expect(label.childElementCount === 11);
                label = document.getElementById('container0_AxisLabel_0');
                anchor = label.getAttribute('text-anchor');
                expect(anchor === 'middle').toBe(true);
                expect(label.innerHTML.slice(0, 5) === 'Janua');
                expect(label.children[0].innerHTML === 'ry');
                expect(label.children[1].innerHTML === '19');
                label = document.getElementById('container0_AxisLabel_10');
                anchor = label.getAttribute('text-anchor');
                expect(anchor === 'middle').toBe(true);
                expect(label.innerHTML.slice(0, 7) === 'Nove...');
                expect(label.children[0].innerHTML === 'er');
                expect(label.children[1].innerHTML === '19');
                done();
            };
            chart.primaryXAxis.labelIntersectAction = 'Wrap';
            chart.series[0].dataSource = wrapData;
            chart.loaded = loaded;
            chart.refresh();
        });
        it('Multiple Rows checking', (done: Function) => {
            loaded = (args: Object): void => {
                label = document.getElementById("containerAxisLabels0");
                expect(label.childElementCount === 11);
                label = document.getElementById('container0_AxisLabel_0');
                anchor = label.getAttribute('text-anchor');
                expect(anchor === 'middle').toBe(true);
                yValue = +label.getAttribute("y");
                expect(yValue === 337);
                label = document.getElementById('container0_AxisLabel_1');
                anchor = label.getAttribute('text-anchor');
                expect(anchor === 'middle').toBe(true);
                yValue = +label.getAttribute("y");
                expect(yValue === 363);
                done();
            };
            chart.primaryXAxis.labelIntersectAction = 'MultipleRows';
            chart.series[0].dataSource = normalData;
            chart.loaded = loaded;
            chart.refresh();
        });
        it('Rotate 45 checking', (done: Function) => {
            loaded = (args: Object): void => {
                label = document.getElementById("containerAxisLabels0");
                expect(label.childElementCount === 7);
                label = document.getElementById('container0_AxisLabel_0');
                anchor = label.getAttribute('text-anchor');
                expect(anchor === 'middle').toBe(true);
                angle = +(label.getAttribute("transform").slice(7, 9));
                expect(angle === 45);
                label = document.getElementById('container0_AxisLabel_9');
                anchor = label.getAttribute('text-anchor');
                expect(anchor === 'middle').toBe(true);
                angle = +(label.getAttribute("transform").slice(7, 9));
                expect(angle === 45);
                done();
            };
            chart.primaryXAxis.labelIntersectAction = 'Rotate45';
            chart.loaded = loaded;
            chart.refresh();
        });
        it('Rotate 90 checking', (done: Function) => {
            loaded = (args: Object): void => {
                label = document.getElementById("containerAxisLabels0");
                expect(label.childElementCount === 11);
                label = document.getElementById('container0_AxisLabel_0');
                anchor = label.getAttribute('text-anchor');
                expect(anchor === 'middle').toBe(true);
                angle = +(label.getAttribute("transform").slice(7, 9));
                expect(angle === 90);
                label = document.getElementById('container0_AxisLabel_10');
                anchor = label.getAttribute('text-anchor');
                expect(anchor === 'middle').toBe(true);
                angle = +(label.getAttribute("transform").slice(7, 9));
                expect(angle === 90);
                done();
            };
            chart.primaryXAxis.labelIntersectAction = 'Rotate90';
            chart.loaded = loaded;
            chart.refresh();
        });
    });

    describe('Label intersect actions checking with line break label Right alignment', () => {
        let chart: Chart;
        let ele: HTMLElement;
        let loaded: EmitType<ILoadedEventArgs>;
        let label: HTMLElement;
        let anchor: string;
        let yValue: number;
        let angle: number;
        beforeAll((): void => {
            ele = createElement('div', { id: 'container', styles: 'width: 450px;height: 400px' });
            document.body.appendChild(ele);
            chart = new Chart(
                {
                    primaryXAxis: {
                        majorGridLines: { width: 0 },
                        lineStyle: { width: 0 },
                        majorTickLines: { width: 0 },
                        valueType: 'Category',
                        lineBreakAlignment: 'Right',
                        labelIntersectAction: 'Trim'
                    },
                    primaryYAxis: {},

                    chartArea: {
                        border: {
                            width: 1
                        }
                    },
                    //Initializing Chart Series
                    series: [
                        {
                            type: 'Column',
                            dataSource: normalData,
                            xName: 'x',
                            yName: 'y', name: 'Germany',
                            animation: { enable: false }
                        }
                    ],
                    //Initializing Chart title
                    title: 'Inflation - Consumer Price',
                }, '#container');

        });

        afterAll((): void => {

            chart.destroy();
            ele.remove();
        });
        it('Trim checking', (done: Function) => {
            loaded = (args: Object): void => {
                label = document.getElementById("containerAxisLabels0");
                expect(label.childElementCount === 11);
                label = document.getElementById('container0_AxisLabel_0');
                anchor = label.getAttribute('text-anchor');
                expect(anchor === 'end').toBe(true);
                expect(label.innerHTML.split('...')[0] === 'Janu');
                label = document.getElementById('container0_AxisLabel_10');
                anchor = label.getAttribute('text-anchor');
                expect(anchor === 'end').toBe(true);
                expect(label.innerHTML.split('...')[0] === 'Nove');
                done();
            };
            chart.loaded = loaded;
            chart.refresh();
        });
        it('Hide checking', (done: Function) => {
            loaded = (args: Object): void => {
                label = document.getElementById("containerAxisLabels0");
                expect(label.childElementCount === 8);
                label = document.getElementById('container0_AxisLabel_0');
                anchor = label.getAttribute('text-anchor');
                expect(anchor === 'end').toBe(true);
                expect(label.innerHTML.slice(0, 7) === 'January');
                label = document.getElementById('container0_AxisLabel_9');
                anchor = label.getAttribute('text-anchor');
                expect(anchor === 'end').toBe(true);
                expect(label.innerHTML.slice(0, 7) === 'October');
                done();
            };
            chart.primaryXAxis.labelIntersectAction = 'Hide';
            chart.loaded = loaded;
            chart.refresh();
        });
        it('Wrap checking', (done: Function) => {
            loaded = (args: Object): void => {
                label = document.getElementById("containerAxisLabels0");
                expect(label.childElementCount === 11);
                label = document.getElementById('container0_AxisLabel_0');
                anchor = label.getAttribute('text-anchor');
                expect(anchor === 'end').toBe(true);
                expect(label.innerHTML.slice(0, 5) === 'Janua');
                expect(label.children[0].innerHTML === 'ry');
                expect(label.children[1].innerHTML === '19');
                label = document.getElementById('container0_AxisLabel_10');
                anchor = label.getAttribute('text-anchor');
                expect(anchor === 'end').toBe(true);
                expect(label.innerHTML.slice(0, 7) === 'Nove...');
                expect(label.children[0].innerHTML === 'er');
                expect(label.children[1].innerHTML === '19');
                done();
            };
            chart.primaryXAxis.labelIntersectAction = 'Wrap';
            chart.series[0].dataSource = wrapData;
            chart.loaded = loaded;
            chart.refresh();
        });
        it('Multiple Rows checking', (done: Function) => {
            loaded = (args: Object): void => {
                label = document.getElementById("containerAxisLabels0");
                expect(label.childElementCount === 11);
                label = document.getElementById('container0_AxisLabel_0');
                anchor = label.getAttribute('text-anchor');
                expect(anchor === 'end').toBe(true);
                yValue = +label.getAttribute("y");
                expect(yValue === 337);
                label = document.getElementById('container0_AxisLabel_1');
                anchor = label.getAttribute('text-anchor');
                expect(anchor === 'end').toBe(true);
                yValue = +label.getAttribute("y");
                expect(yValue === 363);
                done();
            };
            chart.primaryXAxis.labelIntersectAction = 'MultipleRows';
            chart.series[0].dataSource = normalData;
            chart.loaded = loaded;
            chart.refresh();
        });
        it('Rotate 45 checking', (done: Function) => {
            loaded = (args: Object): void => {
                label = document.getElementById("containerAxisLabels0");
                expect(label.childElementCount === 7);
                label = document.getElementById('container0_AxisLabel_0');
                anchor = label.getAttribute('text-anchor');
                expect(anchor === 'end').toBe(true);
                angle = +(label.getAttribute("transform").slice(7, 9));
                expect(angle === 45);
                label = document.getElementById('container0_AxisLabel_9');
                anchor = label.getAttribute('text-anchor');
                expect(anchor === 'end').toBe(true);
                angle = +(label.getAttribute("transform").slice(7, 9));
                expect(angle === 45);
                done();
            };
            chart.primaryXAxis.labelIntersectAction = 'Rotate45';
            chart.loaded = loaded;
            chart.refresh();
        });
        it('Rotate 90 checking', (done: Function) => {
            loaded = (args: Object): void => {
                label = document.getElementById("containerAxisLabels0");
                expect(label.childElementCount === 11);
                label = document.getElementById('container0_AxisLabel_0');
                anchor = label.getAttribute('text-anchor');
                expect(anchor === 'end').toBe(true);
                angle = +(label.getAttribute("transform").slice(7, 9));
                expect(angle === 90);
                label = document.getElementById('container0_AxisLabel_10');
                anchor = label.getAttribute('text-anchor');
                expect(anchor === 'end').toBe(true);
                angle = +(label.getAttribute("transform").slice(7, 9));
                expect(angle === 90);
                done();
            };
            chart.primaryXAxis.labelIntersectAction = 'Rotate90';
            chart.loaded = loaded;
            chart.refresh();
        });
    });
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
