/**
 * Chart spec document
 */

import { createElement } from '@syncfusion/ej2-base';
import { Chart } from '../../../src/chart/chart';
import { LineSeries } from '../../../src/chart/series/line-series';
import { ColumnSeries } from '../../../src/chart/series/column-series';
import { Category } from '../../../src/chart/axis/category-axis';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { MouseEvents } from '../base/events.spec';
import { unbindResizeEvents } from '../base/data.spec';
import { EmitType } from '@syncfusion/ej2-base';
import { DateTime } from '../../../src/index' ;
import { Logarithmic } from '../../../src/index';
import { ILoadedEventArgs, IAxisLabelRenderEventArgs } from '../../../src/common/model/interface';
Chart.Inject(LineSeries, Category, ColumnSeries, DateTime, Logarithmic);


describe('Chart Control', () =>{
    let ele: HTMLElement;
    let svg: HTMLElement;
    let text: HTMLElement;
    let Position: string[];
    let loaded: EmitType<ILoadedEventArgs>;
    describe('Axis Behavior', () => {
        let chartObj: Chart;
        beforeAll((): void => {
            ele = createElement('div', { id: 'chartContainer' });
            document.body.appendChild(ele);
            chartObj = new Chart(
                {
                    rows: [
                        {
                            height: '300'
                        },
                        {
                            height: '100'
                        }
                    ], loaded: loaded, legendSettings: { visible: false }
                }
            );
        });

        afterAll((): void => {
            chartObj.destroy();
            ele.remove();
        });
        it('Checking the row definition', (done: Function) =>{
            loaded = (args: Object): void => {
                let axis: HTMLElement = document.getElementById('chartContainerAxisInsideCollection');
                expect(axis.childNodes.length == 3).toBe(true);
                axis = document.getElementById('chartContainerAxisLine_1');
                expect(parseFloat(axis.getAttribute('y2')) - parseFloat(axis.getAttribute('y1')) == 300).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.appendTo('#chartContainer');

        });
        it('Adding column definition to Axis', (done: Function) => {
            chartObj.columns = [{ width: '350' }, { width: '100' }];
            chartObj.width = '400'; chartObj.height = '300';
            loaded = (args: Object): void => {
                let axis: HTMLElement = document.getElementById('chartContainerAxisInsideCollection');
                expect(axis.childNodes.length == 3).toBe(true);
                axis = document.getElementById('chartContainerAxisLine_0');
                expect(parseFloat(axis.getAttribute('x2')) - parseFloat(axis.getAttribute('x1')) == 350).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();

        });
        it('Checking the empty definition', (done: Function) => {
            chartObj.columns = []; chartObj.rows = [];
            loaded = (args: Object): void => {
                let area: HTMLElement = document.getElementById('chartContainer_ChartAreaBorder');
                expect(area.getAttribute('y') == '10.25').toBe(true);
                expect(area.getAttribute('x') == '10').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Checking the row definition with high value', (done: Function) => {
            chartObj.columns = [{ width: '100%' }]; chartObj.rows = [{ height: '100%' }];
            chartObj.primaryXAxis.rowIndex = 2; chartObj.primaryXAxis.minimum = 2;
            chartObj.primaryYAxis.columnIndex = 2; chartObj.primaryYAxis.minimum = 2;
            loaded = (args: Object): void => {
                let area: HTMLElement = document.getElementById('chartContainer_ChartAreaBorder');
                let axisLine: HTMLElement = document.getElementById('chartContainerAxisLine_1');
                expect(area.getAttribute('x') == document.getElementById('chartContainerAxisLine_0').getAttribute('x1')).toBe(true);
                expect(parseFloat(area.getAttribute('height')) == parseFloat(axisLine.getAttribute('y2')) - parseFloat(axisLine.getAttribute('y1'))).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Checking the definition with negative value', () => {
            chartObj.primaryXAxis.rowIndex = -1;
            chartObj.primaryYAxis.columnIndex = -1;
            chartObj.dataBind();

            let area: HTMLElement = document.getElementById('chartContainer_ChartAreaBorder');
            let axisLine: HTMLElement = document.getElementById('chartContainerAxisLine_1');
            expect(area.getAttribute('x') == document.getElementById('chartContainerAxisLine_0').getAttribute('x1')).toBe(true);
            expect(parseFloat(area.getAttribute('height')) == parseFloat(axisLine.getAttribute('y2')) - parseFloat(axisLine.getAttribute('y1'))).toBe(true);

        });
        it('Checking Axis Line', () => {
            chartObj.primaryXAxis.lineStyle.color = '#FBAF4F'; chartObj.primaryXAxis.lineStyle.width = 3;
            chartObj.primaryYAxis.lineStyle.color = '#0D97D4'; chartObj.primaryYAxis.lineStyle.width = 3;
            chartObj.dataBind();

            svg = document.getElementById('chartContainerAxisLine_0');
            expect(svg.getAttribute('stroke') == '#FBAF4F').toBe(true);
            expect(svg.getAttribute('stroke-width') == '3').toBe(true);
            svg = document.getElementById('chartContainerAxisLine_1');
            expect(svg.getAttribute('stroke') == '#0D97D4').toBe(true);
            expect(svg.getAttribute('stroke-width') == '3').toBe(true);
        });

        it('Checking Grid Line', () => {
            chartObj.primaryXAxis.majorGridLines = { color: '#C2C924', width: 2 };
            chartObj.primaryXAxis.majorTickLines = { color: '#0AA368', width: 1.5, height: 20 };
            chartObj.primaryYAxis.majorGridLines = { color: '#B4D072', width: 2 };
            chartObj.primaryYAxis.majorTickLines = { color: '#C2C924', width: 1.5, height: 20 };
            chartObj.dataBind();

            svg = document.getElementById('chartContainer_MajorGridLine_0');
            expect(svg.getAttribute('stroke') == '#C2C924').toBe(true);
            expect(svg.getAttribute('stroke-width') == '2').toBe(true);

            svg = document.getElementById('chartContainer_MajorTickLine_0');
            expect(svg.getAttribute('stroke') == '#0AA368').toBe(true);
            expect(svg.getAttribute('stroke-width') == '1.5').toBe(true);

            svg = document.getElementById('chartContainer_MajorGridLine_1');
            expect(svg.getAttribute('stroke') == '#B4D072').toBe(true);
            expect(svg.getAttribute('stroke-width') == '2').toBe(true);

            svg = document.getElementById('chartContainer_MajorTickLine_1');
            expect(svg.getAttribute('stroke') == '#C2C924').toBe(true);
            expect(svg.getAttribute('stroke-width') == '1.5').toBe(true);
        });
        
         it('Checking Both Axis Major Ticklines Inside Position', () => {
            chartObj.primaryXAxis.majorGridLines = { color: '#C2C924', width: 2 };
            chartObj.primaryXAxis.majorTickLines = { color: '#0AA368', width: 1.5, height: 20 };
            chartObj.primaryXAxis.tickPosition = 'Inside';
            chartObj.primaryYAxis.majorGridLines = { color: '#B4D072', width: 2 };
            chartObj.primaryYAxis.majorTickLines = { color: '#C2C924', width: 1.5, height: 20 };
            chartObj.primaryXAxis.tickPosition = 'Inside';
            chartObj.dataBind();

            svg = document.getElementById('chartContainer_MajorTickLine_0');
            Position = svg.getAttribute('d').split(' ');
            let value1 = parseInt(Position[5]);
            let value2 = parseInt(Position[11]);
            expect(svg.getAttribute('value1') === svg.getAttribute('value2')).toBe(true);

            svg = document.getElementById('chartContainer_MajorTickLine_1');
            Position = svg.getAttribute('d').split(' ');
            let value11 = parseInt(Position[8]);
            let value12 = parseInt(Position[11]);
           expect(svg.getAttribute('value11') === svg.getAttribute('value21')).toBe(true);
        });
        
          it('Checking label x axis label position inside', () => {
            chartObj.primaryXAxis = { title: 'PrimaryXAxis', rangePadding: 'Additional' };
            chartObj.primaryXAxis.labelPosition = 'Inside',
            chartObj.primaryXAxis.tickPosition = 'Inside',
            chartObj.primaryYAxis = { title: 'PrimaryYAxis', rangePadding: 'Normal' };
            chartObj.dataBind();

            text = document.getElementById('chartContainer1_AxisLabel_0');
            expect(text.textContent == '2').toBe(true);
            text = document.getElementById('chartContainer1_AxisLabel_4');          
            expect(text.textContent == '6').toBe(true);
        });
        
         it('Checking Y axis label position inside ', () => {
            chartObj.primaryXAxis = { title: 'PrimaryXAxis', rangePadding: 'Additional' };
            chartObj.primaryYAxis = { title: 'PrimaryYAxis', rangePadding: 'Normal' };
             chartObj.primaryYAxis.labelPosition = 'Inside',
            chartObj.primaryYAxis.tickPosition = 'Inside',
            chartObj.dataBind();

            text = document.getElementById('chartContainer0_AxisLabel_0');
            expect(text.textContent != '1').toBe(true);
            text = document.getElementById('chartContainer1_AxisLabel_0');
            expect(text.textContent == '2').toBe(true);
            text = document.getElementById('chartContainer1_AxisLabel_4');          
            expect(text.textContent == '6').toBe(true);
        });

        it('Checking Axis title', () => {
            chartObj.primaryXAxis.title = 'Change the text';
            chartObj.primaryYAxis.title = 'Population';
            chartObj.dataBind();

            text = document.getElementById('chartContainer_AxisTitle_0');
            expect(text.textContent == 'Change the text').toBe(true);
            text = document.getElementById('chartContainer_AxisTitle_1');
            expect(text.textContent == 'Population').toBe(true);

        });

        it('Checking Axis Range', () => {
            chartObj.primaryXAxis.minimum = 12;
            chartObj.primaryXAxis.maximum = 2;
            chartObj.primaryXAxis.interval = 2;
            chartObj.dataBind();
            text = document.getElementById('chartContainer0_AxisLabel_0');
            expect(text.textContent == '2').toBe(true);
        });

        it('Checking the range padding', () => {
            chartObj.primaryXAxis = { title: 'PrimaryXAxis', rangePadding: 'Additional' };
            chartObj.primaryYAxis = { title: 'PrimaryYAxis', rangePadding: 'Normal' };
            chartObj.dataBind();

            text = document.getElementById('chartContainer0_AxisLabel_0');
            expect(text.textContent != '1').toBe(true);
            text = document.getElementById('chartContainer1_AxisLabel_0');
            expect(text.textContent == '2').toBe(true);
            text = document.getElementById('chartContainer1_AxisLabel_4');          
            expect(text.textContent == '6').toBe(true);
        });
        it('Checking the zoomFactor and zoomPosition', () => {
            chartObj.primaryXAxis = { minimum: 1000, maximum: 10000, interval: 1000, zoomFactor: 0.5, zoomPosition: 0.3 };
            chartObj.primaryYAxis = { minimum: 0, maximum: 50, enableAutoIntervalOnZooming: false, zoomFactor: 0.3, zoomPosition: 0.6 };
            chartObj.dataBind();

            text = document.getElementById('chartContainer0_AxisLabel_0');
            expect(text.textContent == '4000').toBe(true);
            text = document.getElementById('chartContainer1_AxisLabel_0');
            expect(text.textContent == '30').toBe(true);

        });
        it('Axis label rotation', () => {
            chartObj.primaryXAxis = { labelRotation: 45, zoomFactor: 1, zoomPosition: 0 };
            chartObj.primaryYAxis = { zoomFactor: 1, zoomPosition: 0 };
            chartObj.dataBind();

            svg = document.getElementById('chartContainer_ChartAreaBorder');
            text = document.getElementById('chartContainer0_AxisLabel_0');
            expect(text.getAttribute('transform').indexOf('rotate(45') > -1).toBe(true);
        });
        it('Checking Minor Grid Line', () => {
            chartObj.primaryXAxis = {
                minorGridLines: { color: '#C2C924', width: 1 },
                minorTickLines: { color: '#0AA368', width: 1, height: 3 },
                minorTicksPerInterval: 4,
                labelRotation: 0
            };
            chartObj.primaryYAxis = {
                minorGridLines: { color: '#B4D072', width: 1 },
                minorTickLines: { color: '#C2C924', width: 1, height: 3 },
                minorTicksPerInterval: 4
            };
            chartObj.dataBind();

            svg = document.getElementById('chartContainer_MinorGridLine_0');
            expect(svg.getAttribute('stroke') == '#C2C924').toBe(true);
            expect(svg.getAttribute('stroke-width') == '1').toBe(true);

            svg = document.getElementById('chartContainer_MinorTickLine_0');
            expect(svg.getAttribute('stroke') == '#0AA368').toBe(true);
            expect(svg.getAttribute('stroke-width') == '1').toBe(true);

            svg = document.getElementById('chartContainer_MinorGridLine_1');
            expect(svg.getAttribute('stroke') == '#B4D072').toBe(true);
            expect(svg.getAttribute('stroke-width') == '1').toBe(true);

            svg = document.getElementById('chartContainer_MinorTickLine_1');
            expect(svg.getAttribute('stroke') == '#C2C924').toBe(true);
            expect(svg.getAttribute('stroke-width') == '1').toBe(true);
        });

        it('Checking Minor Gird Line with opposed position', () => {
            chartObj.primaryXAxis.opposedPosition = true;
            chartObj.primaryYAxis.opposedPosition = true;
            chartObj.dataBind();

            svg = document.getElementById('chartContainer_MinorTickLine_0');
            expect(svg.getAttribute('stroke') == '#0AA368').toBe(true);
            expect(svg.getAttribute('stroke-width') == '1').toBe(true);

            svg = document.getElementById('chartContainer_MinorTickLine_1');
            expect(svg.getAttribute('stroke') == '#C2C924').toBe(true);
            expect(svg.getAttribute('stroke-width') == '1').toBe(true);
        });
        it('Checking the label format', () => {
            chartObj.primaryYAxis.opposedPosition = false; chartObj.primaryYAxis.minimum = 1000;
            chartObj.primaryYAxis.maximum = 10000;
            chartObj.primaryXAxis.labelRotation = 45;
            chartObj.primaryYAxis.labelFormat = 'C';
            chartObj.dataBind();
            text = document.getElementById('chartContainer1_AxisLabel_1');
            expect(text.textContent == '$3000.00').toBe(true);
            let element: Element = <Element>document.getElementById('chartContainer0_AxisLabel_1');
            expect(element.getAttribute('transform').indexOf('rotate(45') > -1).toBe(true);
        });
        it('Checking the rotation greater than 360', () => {
            chartObj.primaryXAxis.opposedPosition = false;
            chartObj.primaryXAxis.labelRotation = 387;
            chartObj.dataBind();
            let element: Element = <Element>document.getElementById('chartContainer0_AxisLabel_1');
            expect(element.getAttribute('transform').indexOf('rotate(27') > -1).toBe(true);
        });
        it('Checking the zoomFactor and zoomPosition with inversed', () => {
            loaded = (args: object) => {
                text = document.getElementById('chartContainer0_AxisLabel_0');
                expect(text.textContent == '3000').toBe(true);
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis = { isInversed: true, minimum: 1000, maximum: 10000, interval: 1000, zoomFactor: 0.5, zoomPosition: 0.3 };
            chartObj.primaryYAxis = { minimum: 0, maximum: 50, enableAutoIntervalOnZooming: false, zoomFactor: 0.3, zoomPosition: 0.6 };
            chartObj.refresh();
        });
    });

    describe('Axis Behavior', () => {
        let chart: Chart;
        beforeAll((): void => {
            ele = createElement('div', { id: 'chartContainer' });
            document.body.appendChild(ele);
            chart = new Chart({
                series: [{ dataSource: [{ x: 10, y: -10 }], xName: 'x', yName: 'y', fill: 'pink', animation: { enable: true } }],
                primaryXAxis: { desiredIntervals: 2, labelIntersectAction :'Hide' },
                primaryYAxis: { rangePadding: 'Normal' }, loaded: loaded, legendSettings: { visible: false },
                axisLabelRender: (args: IAxisLabelRenderEventArgs) => {
                    args.text = args.text + 'custom';
                }
            });
        });
        afterAll((): void => {
            chart.destroy();
            ele.remove();
        });

        it('Checking with negative value in axis', (done: Function) => {
            loaded = (args: Object): void => {
                text = document.getElementById('chartContainerAxisLabels0');
                expect(text.childNodes.length == 3).toBe(true);
                expect(text.childNodes[0].textContent.indexOf('custom') > -1).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.appendTo('#chartContainer');
        });
        it('Changing the value type', (done: Function) => {
            loaded = (args: Object): void => {
                text = document.getElementById('chartContainerAxisLabels0');
                expect(text.childNodes.length == 1).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.primaryXAxis.valueType = 'Category';
            chart.refresh();
        });
        it('checking minor ticklines', (done: Function) => {
            chart.loaded = (args: Object): void => {
                let tick: Element = document.getElementById('chartContainer_MinorGridLine_0');
                let border: Element = document.getElementById('chartContainer_ChartAreaBorder');
                expect(tick.getBoundingClientRect().top == border.getBoundingClientRect().top).toBe(true);
                done();
            };
            chart.primaryXAxis.minorTicksPerInterval = 1;
            chart.primaryXAxis.minorTickLines.width = 8;
            chart.primaryXAxis.minorGridLines.width = 8;
            chart.refresh();
        });
        it('checking y axis as inversed axis', (done: Function) => {
            loaded = (args: Object): void => {
                let firstLabel: HTMLElement = document.getElementById('chartContainer1_AxisLabel_0');
                expect(firstLabel.textContent).toEqual('0');
                let lastLabel: HTMLElement = document.getElementById('chartContainer1_AxisLabel_10');
                expect(lastLabel.textContent).toEqual('5');
                expect(+firstLabel.getAttribute('y') < (+lastLabel.getAttribute('y'))).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.primaryYAxis.valueType = 'Double';
            chart.primaryYAxis.isInversed = true;
            chart.primaryYAxis.desiredIntervals = null;
            chart.axisLabelRender = null;
            chart.series[0].dataSource = null;
            chart.refresh();
        });
        it('checking x axis as inversed axis', (done: Function) => {
            loaded = (args: Object): void => {
                let firstLabel: HTMLElement = document.getElementById('chartContainer0_AxisLabel_0');
                expect(firstLabel.textContent).toEqual('0');
                let secondLabel = document.getElementById('chartContainer0_AxisLabel_5');
                expect(secondLabel.textContent).toEqual('2.5');
                expect(+firstLabel.getAttribute('x') > (+secondLabel.getAttribute('x'))).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.primaryXAxis.valueType = 'Double';
            chart.primaryXAxis.isInversed = true;
            chart.primaryXAxis.desiredIntervals = null;
            chart.refresh();
        });
        it('checking inversed axis with label intersect action', (done: Function) => {
            loaded = (args: Object): void => {
                let firstLabel: HTMLElement = document.getElementById('chartContainer0_AxisLabel_0');
                expect(firstLabel.textContent).toEqual('1customLabels');
                let secondLabel: HTMLElement = document.getElementById('chartContainer0_AxisLabel_1');
                expect(secondLabel).toEqual(null);
                let thirdLabel: HTMLElement = document.getElementById('chartContainer0_AxisLabel_2');
                expect(thirdLabel.textContent).toEqual('3customLabels');
                expect(+firstLabel.getAttribute('x') > ((+thirdLabel.getAttribute('x') + +thirdLabel.getAttribute('width')))).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.primaryXAxis = { maximum: 5, minimum: 1, interval: 1};
            chart.axisLabelRender = (args: IAxisLabelRenderEventArgs) => {
                    args.text = args.text + 'customLabels';
            };
            chart.width = '400';
            chart.refresh();
        });
        it('checcking inversed axis with labelintersect action as none', (done: Function) => {
            loaded = (args: Object): void => {
                let firstLabel: HTMLElement = document.getElementById('chartContainer0_AxisLabel_0');
                expect(firstLabel.textContent).toEqual('1customLabels');
                let secondLabel: any = document.getElementById('chartContainer0_AxisLabel_1');
                expect(secondLabel.textContent).toEqual('2customLabels');
                let thirdLabel: HTMLElement = document.getElementById('chartContainer0_AxisLabel_2');
                expect(thirdLabel.textContent).toEqual('3customLabels');
                expect(+firstLabel.getAttribute('x')< ((+secondLabel.getAttribute('x') + secondLabel.textLength.baseVal.value))).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.primaryXAxis.labelIntersectAction = 'None';
            chart.dataBind();
        });
       
        it('checcking labelintersect action as rotate45 inside position', (done: Function) => {
            loaded = (args: Object): void => {
                let firstLabel: HTMLElement = document.getElementById('chartContainer0_AxisLabel_0');
                expect(firstLabel.textContent).toEqual('1customLabels');
                expect(firstLabel.getAttribute('transform').indexOf('rotate(45') > -1).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.primaryXAxis.labelIntersectAction = 'Rotate45';
            chart.primaryXAxis.labelRotation = 90;
            chart.primaryXAxis.labelPosition = 'Inside';
            chart.dataBind();
        });
        it('checcking inversed axis with labelintersect action as rotate90', (done: Function) => {
            loaded = (args: Object): void => {
                let firstLabel: HTMLElement = document.getElementById('chartContainer0_AxisLabel_0');
                expect(firstLabel.textContent).toEqual('1customLabels');
                expect(firstLabel.getAttribute('transform').indexOf('rotate(90') > -1).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.primaryXAxis.labelIntersectAction = 'Rotate90';
            chart.primaryXAxis.labelRotation = 0;
            chart.primaryXAxis.labelPosition = 'Outside';
            chart.dataBind();
        });
         it('checcking labelintersect action as rotate90 inside position', (done: Function) => {
            loaded = (args: Object): void => {
                let firstLabel: HTMLElement = document.getElementById('chartContainer0_AxisLabel_0');
                expect(firstLabel.textContent).toEqual('1customLabels');
                expect(firstLabel.getAttribute('transform').indexOf('rotate(90') > -1).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.primaryXAxis.labelIntersectAction = 'Rotate90';
            chart.primaryXAxis.labelPosition = 'Inside';
            chart.dataBind();
        });
          it('checcking opposed position with labelintersect action as rotate90 inside position', (done: Function) => {
            loaded = (args: Object): void => {
                let firstLabel: HTMLElement = document.getElementById('chartContainer0_AxisLabel_0');
                expect(firstLabel.textContent).toEqual('1customLabels');
                expect(firstLabel.getAttribute('transform').indexOf('rotate(90') > -1).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.primaryXAxis.labelIntersectAction = 'Rotate90';
            chart.primaryXAxis.labelPosition = 'Inside';
            chart.primaryXAxis.opposedPosition = true;
            chart.dataBind();
        });
        it('checking with multiple axes', (done: Function) => {
            loaded = (args: Object): void => {
                let firstLabel: HTMLElement = document.getElementById('chartContainer2_AxisLabel_0');
                expect(firstLabel.textContent).toEqual('24');
                let secondLabel: any = document.getElementById('chartContainer2_AxisLabel_1');
                expect(secondLabel.textContent).toEqual('26');
                expect(+firstLabel.getAttribute('y') < +secondLabel.getAttribute('y')).toBe(true);
                done();
            };
            chart.primaryXAxis = {valueType : 'Category', title: 'pyXAxis'};
            chart.loaded = loaded;
            chart.axisLabelRender = null;
            chart.axes = [{
                rowIndex: 0, opposedPosition: true,
                minimum: 24, maximum: 36, interval: 2, isInversed: true,
                name: 'yAxis',
                title: 'Temperature (Celsius)',
            }];
            chart.series = [
            {
                type: 'Line', animation : {enable : false}, dataSource: [{ x: 'Jan', y: 15 }],
                xName: 'x', yName: 'y', name: 'Germany', marker: { visible: true}
            },
            {
                type: 'Line', animation : {enable : false}, dataSource: [{ x: 'Jan', y: 33 }],
                xName: 'x', yName: 'y', yAxisName: 'yAxis', name: 'Japan', marker: { visible: true}
            }];
            chart.refresh();
        });
        it('checking with multiple panes', (done: Function) => {
            loaded = (args: Object) => {
                let firstLabel: HTMLElement = document.getElementById('chartContainer2_AxisLabel_0');
                expect(firstLabel.textContent).toEqual('24');
                let secondLabel: any = document.getElementById('chartContainer2_AxisLabel_1');
                expect(secondLabel.textContent).toEqual('26');
                expect(+firstLabel.getAttribute('y') < +secondLabel.getAttribute('y')).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.rows = [ { height: '50%'}, { height: '50%'}];
            chart.axes[0].rowIndex = 1;
            chart.refresh();
        });
    });
    describe('Axis Smartlabels', () => {
        let chart: Chart;
        let trigger: MouseEvents = new MouseEvents();
        beforeAll((): void => {
            ele = createElement('div', { id: 'chartContainer' });
            document.body.appendChild(ele);
            chart = new Chart({
                primaryXAxis: { valueType: 'Category', labelIntersectAction: 'Trim', labelPlacement: 'BetweenTicks' },
                series: [
                    {
                        dataSource: [{ x: "USAfas dqwasd saasdf", y: 50 }, { x: "Chin afsdfssa", y: 40 },
                            { x: "Japan safds afds", y: 70 }, { x: "Aust rali af dsasfas fasdfasd", y: 60 },
                            { x: "Fra nce fasf sdfds", y: 50 }, { x: "Germ any asdas s", y: 40 },
                            { x: "Ita ly fs adfsad", y: 40 }, { x: "Swed en", y: 30 }],
                        border: { width: 1, color: 'white' },
                        name: 'Series1', type: 'Scatter', xName: 'x', yName: 'y', animation: { enable: true },
                    }
                ],
                width: '300', height: '350',
                legendSettings: { visible: true}
            });
        });
        afterAll((): void => {
            chart.destroy();
            ele.remove();
        });

        it('Checking with Trim and tooltip', (done: Function) => {
            loaded = (args: Object): void => {
                text = document.getElementById('chartContainer0_AxisLabel_0');
                expect(text.textContent.indexOf('...') > -1).toBe(true);
                text = document.getElementById('chartContainer0_AxisLabel_0');
                trigger.mousemoveEvent(text, 0, 0, 35, 330);
                let tooltip: Element = document.getElementById('chartContainer_EJ2_AxisLabel_Tooltip');
                expect(tooltip.textContent).toBe('USAfas dqwasd saasdf');
                expect(text.textContent.split('...').length).toEqual(2);
                tooltip.remove();
                chart.mouseEnd(<PointerEvent>trigger.onTouchEnd(text, 0, 0, null, null, 35, 330));
                tooltip = document.getElementById('chartContainer_EJ2_AxisLabel_Tooltip');
                expect(tooltip.textContent).toBe('USAfas dqwasd saasdf');
                expect(text.textContent.split('...').length).toEqual(2);
                tooltip.remove();
                done();
            };
            chart.loaded = loaded;
            chart.appendTo('#chartContainer');
        });
        it('Checking with MultipleRows', (done: Function) => {
            loaded = (args: Object): void => {
                text = document.getElementById('chartContainer0_AxisLabel_0');
                let text1: Element = document.getElementById('chartContainer0_AxisLabel_1');
                expect((<Element>text1).getAttribute('y') > (<Element>text).getAttribute('y')).toBe(true);
                let text4: Element = document.getElementById('chartContainer0_AxisLabel_4');
                expect((<Element>text).getAttribute('y') === (<Element>text4).getAttribute('y')).toBe(true);
                let height: Element = document.getElementById('chartContainer_ChartAreaBorder');
                expect(parseFloat((<Element>height).getAttribute('height')) < 250).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.primaryXAxis.enableTrim = false;
            chart.primaryXAxis.maximumLabelWidth = 34;
            chart.primaryXAxis.labelIntersectAction = 'MultipleRows';
            chart.refresh();
        });
         it('Checking with MultipleRows label inside position', (done: Function) => {
            loaded = (args: Object): void => {
                text = document.getElementById('chartContainer0_AxisLabel_0');
                let text1: Element = document.getElementById('chartContainer0_AxisLabel_1');
                expect((<Element>text1).getAttribute('y') < (<Element>text).getAttribute('y')).toBe(true);
                let text4: Element = document.getElementById('chartContainer0_AxisLabel_4');
                expect((<Element>text).getAttribute('y') === (<Element>text4).getAttribute('y')).toBe(true);
                let height: Element = document.getElementById('chartContainer_ChartAreaBorder');
                expect(parseFloat((<Element>height).getAttribute('height')) > 250).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.primaryXAxis.labelIntersectAction = 'MultipleRows';
            chart.primaryXAxis.labelPosition = 'Inside';
            chart.refresh();
        });
        it('Checking with MultipleRows with Oppossed', (done: Function) => {
            loaded = (args: Object): void => {
                text = document.getElementById('chartContainer0_AxisLabel_0');
                let text1: Element = document.getElementById('chartContainer0_AxisLabel_1');
                expect((<Element>text1).getAttribute('y') < (<Element>text).getAttribute('y')).toBe(true);
                let element: Element = document.getElementById('chartContainer_ChartAreaBorder');
                expect(parseFloat((<Element>element).getAttribute('y')) > 50).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.primaryXAxis.opposedPosition = true;
            chart.primaryXAxis.labelPosition = 'Outside';
            chart.refresh();
        });
        it('Checking with Wraps', (done: Function) => {
            loaded = (args: Object): void => {
                text = document.getElementById('chartContainer0_AxisLabel_0');
                expect(text.childNodes.length == 3).toBe(true); 
                expect(text.childNodes[1].textContent.indexOf('...') > -1).toBe(true); 
                text = document.getElementById('chartContainer0_AxisLabel_4');
                expect(text.childNodes.length == 4).toBe(true);              
                done();
            };
            chart.loaded = loaded;
            chart.primaryXAxis.labelIntersectAction = 'Wrap';
            chart.primaryXAxis.opposedPosition = false;
            chart.refresh();
        });
        it('Checking with Wraps with labels inside', (done: Function) => {
            loaded = (args: Object): void => {
                text = document.getElementById('chartContainer0_AxisLabel_4');
                expect(text.childNodes.length == 4).toBe(true);
                text = document.getElementById('chartContainer0_AxisLabel_0');
                expect(text.childNodes.length == 3).toBe(true);
                expect(text.childNodes[1].textContent.indexOf('...') > -1).toBe(true);
                let axis: any = document.getElementById('chartContainerAxisLine_0');
                expect(+text.children[1].getAttribute('y') < +axis.getAttribute('y1')).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.primaryXAxis.labelPosition = 'Inside';
            chart.refresh();
        });
        it('Checking with Wraps with Oppossed', (done: Function) => {
            loaded = (args: Object): void => {
                text = document.getElementById('chartContainer0_AxisLabel_0');
                expect(text.childNodes.length == 3).toBe(true);
                expect(text.childNodes[2].textContent === 'USA...' || text.childNodes[2].textContent === 'US...' ).toBe(true);
                expect(text.childNodes[1].textContent.indexOf('...') > -1).toBe(true);
                text = document.getElementById('chartContainer0_AxisLabel_4');
                expect(text.childNodes.length == 4).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.primaryXAxis.labelIntersectAction = 'Wrap';
            chart.primaryXAxis.labelPosition = 'Outside';
            chart.primaryXAxis.opposedPosition = true;
            chart.refresh();
        });
        it('Checking with MultipleRows with inversed', (done: Function) => {
            loaded = (args: Object): void => {
                text = document.getElementById('chartContainer0_AxisLabel_0');
                let text1: Element = document.getElementById('chartContainer0_AxisLabel_1');
                expect((<Element>text1).getAttribute('y') < (<Element>text).getAttribute('y')).toBe(true);
                let text4: Element = document.getElementById('chartContainer0_AxisLabel_4');
                expect((<Element>text).getAttribute('y') === (<Element>text4).getAttribute('y')).toBe(true);
                let height: Element = document.getElementById('chartContainer_ChartAreaBorder');
                expect(parseFloat((<Element>height).getAttribute('height')) < 250).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.primaryXAxis.labelIntersectAction = 'MultipleRows';
            chart.primaryXAxis.isInversed = true;
            chart.refresh();
        });
        it('Checking with Trim and tooltip', (done: Function) => {
            loaded = (args: Object): void => {
                text = document.getElementById('chartContainer0_AxisLabel_11');
                trigger.mousemoveEvent(text, 0, 0, 35, 330);
                let tooltip: Element = document.getElementById('chartContainer_EJ2_AxisLabel_Tooltip');
                expect(tooltip.textContent).toBe('Sweden1');
                expect(text.textContent.split('...').length).toEqual(2);
                tooltip.remove();
                done();
            };
            chart.loaded = loaded;
            chart.primaryXAxis.opposedPosition = false;
            chart.primaryXAxis.isInversed = true;
            chart.primaryXAxis.labelIntersectAction = 'Trim';
            chart.isTouch = false;
            chart.series[0].dataSource = 
                        [{ x: 'USAfas dqwasd saasdf', y: 50 }, { x: 'Chin afsdfssa', y: 40 },
                        { x: 'Japan safds afds', y: 70 }, { x: 'Aust rali af dsasfas fasdfasd', y: 60 },
                        { x: 'Fra nce fasf sdfds', y: 50 }, { x: 'Germ any asdas s', y: 40 },
                        { x: 'Ita ly fs adfsad', y: 40 }, { x: 'Swed en', y: 30 },
                        { x: 'Italyians', y: 40 }, { x: 'Sweden', y: 30 },
                        { x: 'South Africa', y: 40 }, { x: 'Sweden1', y: 30 }];
            chart.width = '400';
            chart.refresh();
        });
        it('Checking with Trim to be true', (done: Function) => {
            loaded = (args: Object): void => {
                text = document.getElementById('chartContainer0_AxisLabel_0');
                expect(text.textContent.indexOf('...') > -1).toBe(true);
                expect(text.textContent.split('...').length).toEqual(2);
                done();
            };
            chart.loaded = loaded;
            chart.primaryXAxis.enableTrim = true;
            chart.refresh();
        });
        it('Checking the label rotation', () => {
            chart.primaryXAxis.labelRotation = 45;
            chart.dataBind();
            let element: Element = <Element>document.getElementById('chartContainer0_AxisLabel_0');
            expect(element.getAttribute('transform').indexOf('rotate(45') > -1).toBe(true);
        });
        it('Checking enable trim while label rotation', () => {
            chart.primaryXAxis.labelRotation = 45;
            chart.primaryXAxis.enableTrim = true;
            chart.dataBind();
            text = document.getElementById('chartContainer0_AxisLabel_0');
            expect(text.textContent.indexOf('...') > -1).toBe(true);
            let element: Element = <Element>document.getElementById('chartContainer0_AxisLabel_0');
            expect(element.getAttribute('transform').indexOf('rotate(45') > -1).toBe(true);
        });
        it('Checking enable trim when label position inside', () => {
            chart.primaryXAxis = { title: 'PrimaryXAxis', rangePadding: 'Additional' };
            chart.primaryXAxis.labelPosition = 'Inside';
            chart.primaryXAxis.labelRotation = 0;
            chart.primaryXAxis.enableTrim = true;
            chart.dataBind();
            text = document.getElementById('chartContainer0_AxisLabel_0');
            expect(text.textContent.indexOf('...') > -1).toBe(true);
            expect(text.textContent.split('...').length).toEqual(2);
        });
        it('Checking enable trim when label position outside', () => {
            chart.primaryXAxis = { title: 'PrimaryXAxis', rangePadding: 'Additional' };
            chart.primaryXAxis.labelPosition = 'Outside',
            chart.primaryXAxis.enableTrim = true,
            chart.primaryYAxis = { title: 'PrimaryYAxis', rangePadding: 'Normal' };
            chart.dataBind();
            text = document.getElementById('chartContainer0_AxisLabel_0');
            expect(text.textContent.indexOf('...') > -1).toBe(true);
            expect(text.textContent.split('...').length).toEqual(2);
        });
        it('Checking with enable Trim for label intersection Action Wrap', (done: Function) => {
            loaded = (args: Object): void => {
                text = document.getElementById('chartContainer0_AxisLabel_0');
                expect(text.textContent.indexOf('...') > -1).toBe(true);
                expect(text.textContent.split('...').length).toEqual(2);
                done();
            };
            chart.loaded = loaded;
            chart.primaryXAxis.labelIntersectAction = 'Wrap';
            chart.primaryXAxis.enableTrim = true;
            chart.refresh();
        });
        it('Checking with enable Trim for label intersection Action Multiple rows', (done: Function) => {
            loaded = (args: Object): void => {
                text = document.getElementById('chartContainer0_AxisLabel_0');
                expect(text.textContent.indexOf('...') > -1).toBe(true);
                expect(text.textContent.split('...').length).toEqual(2);
                done();
            };
            chart.loaded = loaded;
            chart.primaryXAxis.labelIntersectAction = 'MultipleRows';
            chart.primaryXAxis.enableTrim = true;
            chart.refresh();
        });
        it('Checking with maximum label width property', (done: Function) => {
            loaded = (args: Object): void => {
                let label1:HTMLElement = document.getElementById('chartContainer0_AxisLabel_0');
                expect(Math.round(label1.getBoundingClientRect().width)).toBeLessThanOrEqual(17);
                done();
            };
            chart.loaded = loaded;
            chart.primaryXAxis.enableTrim = true;
            chart.primaryXAxis.maximumLabelWidth = 15;
            chart.refresh();
        });
        it('Checking with label width', (done: Function) => {
            loaded = (args: Object): void => {
                let maximumLabelWidth:HTMLElement = document.getElementById('chartContainer0_AxisLabel_0');
                expect(Math.round(maximumLabelWidth.getBoundingClientRect().width)).toBeLessThanOrEqual(56);
                done();
            };
            chart.loaded = loaded;
            chart.primaryXAxis.labelIntersectAction = 'Trim';
            chart.primaryXAxis.maximumLabelWidth = 34;
            chart.primaryXAxis.enableTrim = false;
            chart.refresh();
        });
    });

    describe('Axis Visible false and true size calculation checking', () => {
        let chart: Chart;
        let label: Element;
        let temp: number;
        beforeAll((): void => {
            ele = createElement('div', { id: 'chartContainer' });
            document.body.appendChild(ele);
            chart = new Chart({
                primaryXAxis: {
                    title: 'Defects',
                    interval: 1,
                    valueType: 'Category',
                    visible: true
                },
                primaryYAxis:
                {
                    title: 'Frequency',
                    visible: true
                },
                axes: [
                    {
                        title: 'Cumulative Frequency',
                        opposedPosition: true,
                        name: 'secondary',
                        labelFormat: '{value}%',
                    }
                ],
                series: [
                    {
                        type: 'Column',
                        dataSource: [
                            { x: 'Traffic', y: 56 }, { x: 'Child Care', y: 44.8 },
                            { x: 'Transport', y: 27.2 }, { x: 'Weather', y: 19.6 },
                            { x: 'Emergency', y: 6.6 }
                        ],
                        xName: 'x', yName: 'y', name: 'Defect',
                    }, {
                        type: 'Column',
                        dataSource: [
                            { x: 'Traffic', y: 33.8 }, { x: 'Child Care', y: 60.9 },
                            { x: 'Transport', y: 77.3 }, { x: 'Weather', y: 89.1 },
                            { x: 'Emergency', y: 100 }
                        ],
                        xName: 'x', yName: 'y', name: 'Cumulative', yAxisName: 'secondary',
                        width: 2,
                    }
                ],
                width: '800px'
            }, '#chartContainer');
        });
        afterAll((): void => {
            chart.destroy();
            ele.remove();
        });

        it('Checking visible true', (done: Function) => {
            loaded = (args: Object): void => {
                label = document.getElementById('chartContainerAxisLabels1');
                expect(label.childNodes.length).toBe(8);
                label = document.getElementById('chartContainerAxisLabels0');
                expect(label.childNodes.length).toBe(5);
                let border: Element = document.getElementById('chartContainer_ChartAreaBorder');
                temp = parseInt(border.getAttribute('x'), 10);
                expect(temp === 57 || temp === 53).toBe(true);
                temp = parseInt(border.getAttribute('y'), 10);
                expect(temp).toBe(10);
                temp = parseInt(border.getAttribute('width'), 10);
                expect(temp === 669 || temp === 677).toBe(true);
                temp = parseInt(border.getAttribute('height'), 10);
                expect(temp === 345 || temp === 350).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.refresh();
        });
        it('Checking visible false y axis and x axis', (done: Function) => {
            chart.primaryYAxis.visible = false;
            chart.loaded = null;
            chart.dataBind();
            label = document.getElementById('chartContainerAxisLabels1');
            expect(label).toBe(null);
            label = document.getElementById('chartContainerAxisLabels0');
            expect(label.childNodes.length).toBe(5);
            let border: Element = document.getElementById('chartContainer_ChartAreaBorder');
            temp = parseInt(border.getAttribute('x'), 10);
            expect(temp).toBe(10);
            temp = parseInt(border.getAttribute('y'), 10);
            expect(temp).toBe(10);
            temp = parseInt(border.getAttribute('width'), 10);
            expect(temp === 716 || temp === 720).toBe(true);
            temp = parseInt(border.getAttribute('height'), 10);
            expect(temp === 345 || temp === 350).toBe(true);
            chart.primaryYAxis.visible = true;
            chart.primaryXAxis.visible = false;
            chart.dataBind();
            // Checking y axis label group
            label = document.getElementById('chartContainerAxisLabels1');
            expect(label.childNodes.length).toBe(8);
            // Checking x axis label group
            label = document.getElementById('chartContainerAxisLabels0');
            expect(label).toBe(null);
            border = document.getElementById('chartContainer_ChartAreaBorder');
            temp = parseInt(border.getAttribute('x'), 10);
            expect(temp === 57 || temp === 53).toBe(true);
            temp = parseInt(border.getAttribute('y'), 10);
            expect(temp).toBe(10);
            temp = parseInt(border.getAttribute('width'), 10);
            expect(temp === 669 || temp === 677).toBe(true);
            temp = parseInt(border.getAttribute('height'), 10);
            expect(temp === 395 || temp === 396).toBe(true);
            done();
        });        
    });
    describe('Checking the Axis Crossing for Numeric Axis', () => {
        let chartEle: Chart;
        ele = createElement('div', { id: 'chartContainer' });
        beforeAll(() => {
            document.body.appendChild(ele);
            chartEle = new Chart(
                {
                    primaryXAxis: { valueType: 'Double' },
                    series: [{
                        type: 'Line', xName: 'x', width: 2, yName: 'y', marker: { visible: true },
                        dataSource: [{ x: 1, y: 46 }, { x: 2, y: 27 }, { x: 3, y: 26 }, { x: 4, y: 16 }, { x: 5, y: 31 }],
                    }],
                    width: '800',
                    height: '450'
                },
                '#chartContainer');
            unbindResizeEvents(chartEle);

        });

        afterAll((): void => {
            chartEle.destroy();
            ele.remove();
        });

        it('With X-Axis Opposed Position and Crossing Value Less than Visible Range', (done: Function) => {
            loaded = (args: Object): void => {
                let insideGroup: HTMLElement = document.getElementById('chartContainerAxisInsideCollection');
                let outsideGroup: HTMLElement = document.getElementById('chartContainerAxisOutsideCollection');
                let chartArea: HTMLElement = document.getElementById('chartContainer_ChartAreaBorder');
                let xAxisInside: Element = outsideGroup.children[0];
                let xLine: Element = xAxisInside.children[0];
                
                expect(insideGroup.childElementCount).toBe(3);
                expect(outsideGroup.childElementCount).toBe(1);
                expect(xAxisInside.childElementCount).toBe(5);
              
                expect((parseInt(xLine.getAttribute('y1')) - 1 === parseInt(chartArea.getAttribute('y')) + parseInt(chartArea.getAttribute('height')))).toBe(true);
                done();
            };
            chartEle.axisLabelRender = (args: IAxisLabelRenderEventArgs) => {
               // args.labelOffset = 5;
            }
            chartEle.loaded = loaded;
            chartEle.primaryXAxis.crossesAt = -1;
            chartEle.primaryXAxis.opposedPosition = true;
            chartEle.primaryXAxis.placeNextToAxisLine = false;
            chartEle.refresh();
        });
        it('With Y-Axis Opposed Position and Crossing Value Less than Visible Range', (done: Function) => {
            loaded = (args: Object): void => {
                let insideGroup: HTMLElement = document.getElementById('chartContainerAxisInsideCollection');
                let outsideGroup: HTMLElement = document.getElementById('chartContainerAxisOutsideCollection');
                let chartArea: HTMLElement = document.getElementById('chartContainer_ChartAreaBorder');
                let yAxisInside: Element = outsideGroup.children[1];
                let yLine: Element = yAxisInside.children[0];
                
                expect(insideGroup.childElementCount).toBe(3);
                expect(outsideGroup.childElementCount).toBe(2);
                expect(yAxisInside.childElementCount).toBe(5);
                expect((yLine.getAttribute('x1') === chartArea.getAttribute('x'))).toBe(true);
                done();
            };
            chartEle.loaded = loaded;
            chartEle.primaryYAxis.minimum = 5;
            chartEle.primaryYAxis.crossesAt = 0;
            chartEle.primaryYAxis.opposedPosition = true;
            chartEle.primaryYAxis.placeNextToAxisLine = false;
            chartEle.refresh();
        });
        it('With X and Y Axis Inversed', (done: Function) => {
            loaded = (args: Object): void => {
                let outsideGroup: HTMLElement = document.getElementById('chartContainerAxisOutsideCollection');
                let xAxisInside: Element = outsideGroup.children[0];
                let yAxisInside: Element = outsideGroup.children[1];
                let xLine: Element = xAxisInside.children[0];
                let yLine: Element = yAxisInside.children[0];
                
                expect(outsideGroup.childElementCount).toBe(2);
                expect(xAxisInside.childElementCount).toBe(5);
                expect(yAxisInside.childElementCount).toBe(5);
                expect((xLine.getAttribute('y1') === '249') && (xLine.getAttribute('y2') === '249' )).toBe(true);

                 expect((yLine.getAttribute('x1') === '400' ) && (yLine.getAttribute('x2') === '400')).toBe(true);
                done();
            };
           
            chartEle.loaded = loaded;
            chartEle.primaryXAxis.crossesAt = 30;
            chartEle.primaryYAxis.crossesAt = 3;
            chartEle.primaryXAxis.isInversed = true;
            chartEle.primaryYAxis.isInversed = true;
            chartEle.primaryYAxis.placeNextToAxisLine = true;
            chartEle.primaryXAxis.placeNextToAxisLine = true;
            chartEle.refresh();
        });
        it('With X-Axis Visibility to false', (done: Function) => {
            loaded = (args: Object): void => {
               let xLine: HTMLElement = document.getElementById('chartContainerAxisLine_0');
                expect(xLine === null).toBe(true);
                done();
            };
            chartEle.loaded = loaded;
            chartEle.primaryXAxis.visible = false;
            chartEle.refresh();
        });
        it('With Y-Axis Visibility to false', (done: Function) => {
            loaded = (args: Object): void => {
                let yLine: HTMLElement = document.getElementById('chartContainerAxisLine_1');
                expect(yLine === null).toBe(true);
                done();
            };
            chartEle.loaded = loaded;
            chartEle.primaryYAxis.visible = false;
            chartEle.refresh();
        });
    });

    describe('Checking Axis Crossing with Category Axis', () => {
        let chartEle: Chart;
        ele = createElement('div', { id: 'chartContainer' });
        beforeAll(() => {
            document.body.appendChild(ele);
            chartEle = new Chart(
                {
                    primaryXAxis: { valueType: 'Category' },
                    primaryYAxis: { crossesAt: 'March' },
                    series: [{
                        type: 'Line', xName: 'x', width: 2, yName: 'y', marker: { visible: true },
                        dataSource: [{ x: 'Jan', y: 46 }, { x: 'Feb', y: 27 }, { x: 'March', y: 26 }, { x: 'April', y: 16 },
                        { x: 'May', y: 31 }],
                    }],
                    width: '800',
                    height: '450'
                },
                '#chartContainer');
            unbindResizeEvents(chartEle);

        });

        afterAll((): void => {
            chartEle.destroy();
            ele.remove();
        });

        it('By Specifying Cross value in Numeric', (done: Function) => {
            loaded = (args: Object): void => {
                let yLine: HTMLElement = document.getElementById('chartContainerAxisLine_1');
                expect((yLine.getAttribute('x1') === '402.5' || yLine.getAttribute('x1') === '400') && (yLine.getAttribute('x2') ===
                 '402.5') || yLine.getAttribute('x2') === '400').toBe(true);
                done();
            };
            chartEle.loaded = loaded;
            chartEle.primaryYAxis.crossesAt = 2;
            chartEle.refresh();
        });
        it('By Specifying Cross value in String Value not in the Data Source', (done: Function) => {
            loaded = (args: Object): void => {
                let yLine: HTMLElement = document.getElementById('chartContainerAxisLine_1');
                expect((yLine.getAttribute('x1') === '33.5' || yLine.getAttribute('x1') === '32.5') &&
                 (yLine.getAttribute('x2') === '33.5' || yLine.getAttribute('x2') === '32.5')).toBe(true);
                done();
            };
            chartEle.loaded = loaded;
            chartEle.primaryYAxis.crossesAt = 'January';
            chartEle.refresh();
        });
    });

    describe('Checking Axis Crossing with DateTime Axis', () => {
        let chartEle: Chart;
        ele = createElement('div', { id: 'chartContainer' });
        beforeAll(() => {
            document.body.appendChild(ele);
            chartEle = new Chart(
                {
                    primaryXAxis: { valueType: 'DateTime' },
                    primaryYAxis: { crossesAt: new Date(2016, 0, 1, 18, 23, 0) },
                    series: [{
                        type: 'Line', xName: 'x', width: 2, yName: 'y', marker: { visible: true },
                        dataSource: [{ x: new Date(2016, 0, 1, 18, 22, 0), y: 46 }, { x: new Date(2016, 0, 1, 18, 23, 0), y: 27 },
                        { x: new Date(2016, 0, 1, 18, 24, 0), y: 26 }, { x: new Date(2016, 0, 1, 18, 25, 0), y: 16 },
                        { x: new Date(2016, 0, 1, 18, 26, 0), y: 31 },
                        ],
                    }],
                    width: '800',
                    height: '450'
                },
                '#chartContainer');
            unbindResizeEvents(chartEle);

        });

        afterAll((): void => {
            chartEle.destroy();
            ele.remove();
        });

        it('With DateTime', (done: Function) => {
            loaded = (args: Object): void => {
                let yLine: HTMLElement = document.getElementById('chartContainerAxisLine_1');
                expect(yLine.getAttribute('x1') === '400' && yLine.getAttribute('x2') === '400').toBe(true);
                done();
            };
            chartEle.loaded = loaded;
            chartEle.primaryYAxis.crossesAt = new Date(2016, 0, 1, 18, 24, 0);
            chartEle.refresh();
        });
    });

    describe('Checking Axis Crossing with Logarthmic Axis', () => {
        let chartEle: Chart;
        ele = createElement('div', { id: 'chartContainer' });
        beforeAll(() => {
            document.body.appendChild(ele);
            chartEle = new Chart(
                {
                    primaryXAxis: { valueType: 'Logarithmic', minimum: 0, maximum: 1000, interval: 1 },
                    primaryYAxis: { crossesAt: 40 },
                    series: [{
                        type: 'Line', xName: 'x', width: 2, yName: 'y', marker: { visible: true },
                        dataSource: [
                            { x: 10, y: 46 }, { x: 20, y: 27 }, { x: 30, y: 26 }, { x: 40, y: 16 }, { x: 50, y: 31 },
                        ],
                    }],
                    width: '800',
                    height: '450'
                },
                '#chartContainer');
            unbindResizeEvents(chartEle);

        });

        afterAll((): void => {
            chartEle.destroy();
            ele.remove();
        });

        it('With Log values', (done: Function) => {
            loaded = (args: Object): void => {
                let yLine: HTMLElement = document.getElementById('chartContainerAxisLine_1');
                expect(yLine.getAttribute('x1') === '394.0515262271122' && yLine.getAttribute('x2') === '394.0515262271122').toBe(true);
                done();
            };
            chartEle.loaded = loaded;
            chartEle.primaryYAxis.crossesAt = 30;
            chartEle.refresh();
        });
        it('With Minor Tick Lines for X-Axis', (done: Function) => {
            loaded = (args: Object): void => {
                let xLine: HTMLElement = document.getElementById('chartContainerAxisLine_0');
                expect(xLine.getAttribute('y1') === '311.07500000000005' && xLine.getAttribute('y2') === '311.07500000000005').toBe(true);
                done();
            };
            chartEle.loaded = loaded;
            chartEle.primaryXAxis.crossesAt = 15;
            chartEle.primaryXAxis.minorTicksPerInterval = 8;
            chartEle.refresh();
        });
        it('With Minor Tick Lines for Y-Axis', (done: Function) => {
            loaded = (args: Object): void => {
                let yLine: HTMLElement = document.getElementById('chartContainerAxisLine_1');
                expect(yLine.getAttribute('x1') === '394.0515262271122' && yLine.getAttribute('x2') === '394.0515262271122').toBe(true);
                done();
            };
            chartEle.loaded = loaded;
            chartEle.primaryYAxis.crossesAt = 30;
            chartEle.primaryYAxis.minorTicksPerInterval = 4;
            chartEle.refresh();
        });
        it('Minor Tick with Opposed Position for X-Axis', (done: Function) => {
            loaded = (args: Object): void => {
                let xLine: HTMLElement = document.getElementById('chartContainerAxisLine_0');
                let majorTickX: HTMLElement = document.getElementById('chartContainer_MajorTickLine_0');
                let minorTickX: HTMLElement = document.getElementById('chartContainer_MinorTickLine_0');
                expect(xLine.getAttribute('y1') === '182.15000000000003' && xLine.getAttribute('y2') === '182.15000000000003').toBe(true);
                expect(majorTickX.getAttribute('d').split(' ')[1] === '10' && majorTickX.getAttribute('d').split(' ')[2] === '181.65000000000003').
                    toBe(true);
                expect(minorTickX.getAttribute('d').split(' ')[1] === '89' && minorTickX.getAttribute('d').split(' ')[2] === '182.15000000000003L').
                    toBe(true);
                done();
            };
            chartEle.loaded = loaded;
            chartEle.primaryXAxis.crossesAt = 30;
            chartEle.primaryXAxis.minorTicksPerInterval = 8;
            chartEle.primaryXAxis.opposedPosition = true;
            chartEle.refresh();
        });
        it('Minor Tick with Opposed Position for Y-Axis', (done: Function) => {
            loaded = (args: Object): void => {
                let yLine: HTMLElement = document.getElementById('chartContainerAxisLine_1');
                let majorTickY: HTMLElement = document.getElementById('chartContainer_MajorTickLine_1');
                let minorTickY: HTMLElement = document.getElementById('chartContainer_MinorTickLine_1');
                expect(yLine.getAttribute('x1') === '394.0515262271122' && yLine.getAttribute('x2') === '394.0515262271122').toBe(true);
                expect(majorTickY.getAttribute('d').split(' ')[1] === '394.5515262271122' && majorTickY.getAttribute('d').split(' ')[2] ===
                    '440').toBe(true);
                expect(minorTickY.getAttribute('d').split(' ')[1] === '394.0515262271122' && minorTickY.getAttribute('d').split(' ')[2] ===
                    '431L').toBe(true);
                done();
            };
            chartEle.loaded = loaded;
            chartEle.primaryYAxis.crossesAt = 30;
            chartEle.primaryYAxis.minorTicksPerInterval = 4;
            chartEle.primaryYAxis.opposedPosition = true;
            chartEle.refresh();
        });
    });
    describe('Checking Axis Crossing with Multiple Y Axis', () => {
        let chartEle: Chart;
        ele = createElement('div', { id: 'chartContainer' });
        beforeAll(() => {
            document.body.appendChild(ele);
            chartEle = new Chart(
                {
                    primaryXAxis: { valueType: 'Double', crossesInAxis: 'yAxis' },
                    primaryYAxis: { crossesAt: 30 },
                    axes: [{ rowIndex: 0, opposedPosition: true, name: 'yAxis', crossesAt: 2}],
                    series: [{
                        type: 'Line', xName: 'x', yName: 'y', marker: { visible: true },
                        dataSource: [{ x: 1, y: 46 }, { x: 2, y: 27 }, { x: 3, y: 26 }, { x: 4, y: 16 }, { x: 5, y: 31 }],
                    }, {
                        type: 'Line', xName: 'x', yName: 'y', yAxisName: 'yAxis', name: 'Japan', marker: { visible: true },
                        dataSource: [{ x: 1, y: 33 }, { x: 2, y: 31 }, { x: 3, y: 30 }, { x: 4, y: 28 }, { x: 5, y: 29 }],
                    }],
                    width: '800',
                    height: '450'
                },
                '#chartContainer');
            unbindResizeEvents(chartEle);

        });

        afterAll((): void => {
            chartEle.destroy();
            ele.remove();
        });

        it('All Axis Moved', (done: Function) => {
            loaded = (args: Object): void => {
                let xLine1: HTMLElement = document.getElementById('chartContainerAxisLine_0');
                let yLine1: HTMLElement = document.getElementById('chartContainerAxisLine_1');
                let yLine2: HTMLElement = document.getElementById('chartContainerAxisLine_2');
                let chartArea: HTMLElement = document.getElementById('chartContainer_ChartAreaBorder');

                expect((parseInt(yLine1.getAttribute('x1')) === parseInt(chartArea.getAttribute('x')) + parseInt(chartArea.getAttribute('width')))).toBe(true);
                expect((parseInt(yLine2.getAttribute('x1')) === parseInt(chartArea.getAttribute('x')))).toBe(true);
                expect((xLine1.getAttribute('y1') === '183.390625' || xLine1.getAttribute('y1') === '183.828125') &&
                 (xLine1.getAttribute('y2') === '183.390625' || xLine1.getAttribute('y2') === '183.828125')).toBe(true);
                done();
            };
            chartEle.loaded = loaded;
            chartEle.axes[0].crossesAt = 0;
            chartEle.primaryXAxis.crossesAt = 30;
            chartEle.refresh();
        });
    });
    describe('Checking Axis Crossing with Multiple X Axis', () => {
        let chartEle: Chart;
        ele = createElement('div', { id: 'chartContainer' });
        beforeAll(() => {
            document.body.appendChild(ele);
            chartEle = new Chart(
                {
                    primaryYAxis: { crossesAt: 3 },
                    axes: [{ columnIndex: 0, name: 'xAxis', crossesAt: 10, title: 'Secondary Axis', placeNextToAxisLine: false }],
                    series: [{
                        type: 'Line', xName: 'x', yName: 'y', marker: { visible: true },
                        dataSource: [{ x: 1, y: 46 }, { x: 2, y: 27 }, { x: 3, y: 26 }, { x: 4, y: 16 }, { x: 5, y: 31 }],
                    }, {
                        type: 'Line', xName: 'x', yName: 'y', xAxisName: 'xAxis', name: 'Japan', marker: { visible: true },
                        dataSource: [{ x: 1, y: 33 }, { x: 2, y: 31 }, { x: 3, y: 30 }, { x: 4, y: 28 }, { x: 5, y: 29 }],
                    }],
                    width: '800',
                    height: '450'
                },
                '#chartContainer');
            unbindResizeEvents(chartEle);

        });

        afterAll((): void => {
            chartEle.destroy();
            ele.remove();
        });

        it('All Axis Moved', (done: Function) => {
            loaded = (args: Object): void => {
                let line0: HTMLElement = document.getElementById('chartContainerAxisLine_0');
                let line1: HTMLElement = document.getElementById('chartContainerAxisLine_1');
                let line2: HTMLElement = document.getElementById('chartContainerAxisLine_2');
                let chartArea: HTMLElement = document.getElementById('chartContainer_ChartAreaBorder');
                
                expect((parseInt(line0.getAttribute('y1')) - 1 === parseInt(chartArea.getAttribute('y')) + parseInt(chartArea.getAttribute('height')))).toBe(true);
                expect(line1.getAttribute('x1') === '400' && line1.getAttribute('x2') === '400').toBe(true);
                expect((line2.getAttribute('y1') === '254.975' || line2.getAttribute('y1') === '259.655')).toBe(true);
                done();
            };
            chartEle.loaded = loaded;
            chartEle.axes[0].crossesAt = 11;
            chartEle.refresh();
        });
    });
});