/**
 * Specifies the  stacking step area series spec.
 */
import { remove, createElement } from '@syncfusion/ej2-base';
import { Chart } from '../../../src/chart/chart';
import { StackingStepAreaSeries } from '../../../src/chart/series/stacking-step-area-series';
import { Legend } from '../../../src/chart/legend/legend';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { Category } from '../../../src/chart/axis/category-axis';
import { DateTime } from '../../../src/chart/axis/date-time-axis';
import { Logarithmic } from '../../../src/chart/axis/logarithmic-axis';
import { DataLabel } from '../../../src/chart/series/data-label';
import { unbindResizeEvents } from '../base/data.spec';
import { tooltipData1, negativeDataPoint, categoryData, datetimeData, tooltipData2, rotateData1, rotateData2 } from '../base/data.spec';
import { MouseEvents } from '../base/events.spec';
import { DataEditing } from '../../../src/chart/user-interaction/data-editing';
import { Tooltip } from '../../../src/chart/user-interaction/tooltip';
import { Crosshair } from '../../../src/chart/user-interaction/crosshair';
import { Series, Points } from '../../../src/chart/series/chart-series';
import { Axis } from '../../../src/chart/axis/axis';
import { EmitType } from '@syncfusion/ej2-base';
import { ILoadedEventArgs } from '../../../src/chart/model/chart-interface';
import { profile , inMB, getMemoryProfile } from '../../common.spec';
Chart.Inject(StackingStepAreaSeries, Category, DataEditing, Legend, DateTime, Tooltip, Logarithmic, DataLabel, Legend, Crosshair);
let data: any = tooltipData1;
let data2: any= tooltipData2;
let negativPoint: any = negativeDataPoint;
let datetime: any = datetimeData;
let trigger: MouseEvents = new MouseEvents();
export interface Arg {
    chart: Chart;
}
describe('Chart Control', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
    let elem: HTMLElement;
    describe('Chart Stacking Steparea series', () => {
        let chartObj: Chart;
        let svg: HTMLElement;
        let marker: HTMLElement;
        let targetElement: HTMLElement;
        let datalabel: HTMLElement;
        let loaded: EmitType<ILoadedEventArgs>;
        beforeAll(() => {
            elem = createElement('div', { id: 'container' });
            document.body.appendChild(elem);
            chartObj = new Chart(
            {
                primaryXAxis: { title: 'PrimaryXAxis' },
                primaryYAxis: { title: 'PrimaryYAxis', rangePadding: 'Normal' },
                series: [{
                    dataSource: data, xName: 'x', yName: 'y', animation: { enable: false }, type: 'StackingStepArea',
                    name: 'ChartSeriesNameGold', fill: 'skyblue',
                      marker:{ visible: true, dataLabel:{visible:false}},
                   
                }], 
                width: '800',
                title: 'Chart TS Title', legendSettings: { visible: false, }
                
            });
            chartObj.appendTo('#container');

        });
        
        afterAll((): void => {
            elem.remove();
            chartObj.destroy();
        });
        it('Checking with fill', (done: Function) => {
           loaded = (args: Object): void => {
                let svg: HTMLElement = document.getElementById('container_Series_0');
                expect(svg.getAttribute('fill') === 'skyblue').toBe(true);
                done();
            };
            chartObj.loaded = loaded; 
            chartObj.refresh();
        });
        it('Showing default data label', (done: Function) => {
            loaded = (args: Object): void => {
                let element = document.getElementById('container_Series_0_Point_2_Text_0');
                expect(document.getElementById('containerShapeGroup0').childNodes.length == 0).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.dataLabel.visible = true;
            chartObj.refresh(); 

        });
        it('Showing default data label', (done: Function) => {
            loaded = (args: Object): void => {
                let element = document.getElementById('container_Series_0_Point_2_Text_0');
                expect(document.getElementById('containerShapeGroup0').childNodes.length == 0).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.dataLabel.visible = true;
            chartObj.refresh(); 

        });
        it('Checking dataLabel positions Bottom', (done: Function) => {
        loaded = (args: Object): void => {
            let element = document.getElementById('container_Series_0_Point_2_Text_0');
            expect(document.getElementById('containerShapeGroup0').childNodes.length == 0).toBe(true);
            done();
        };
        chartObj.loaded = loaded;
        chartObj.series[0].marker.dataLabel.position = 'Bottom';
        chartObj.refresh(); 

        });
        it('Checking dataLabel positions Middle', (done: Function) => {
        loaded = (args: Object): void => {
            let element = document.getElementById('container_Series_0_Point_2_Text_0');
            expect(document.getElementById('containerShapeGroup0').childNodes.length == 0).toBe(true);
            done();
        };
        chartObj.loaded = loaded;
        chartObj.series[0].marker.dataLabel.position = 'Middle';
        chartObj.refresh();
        });
        it('Checking dataLabel positions Top', (done: Function) => {
            loaded = (args: Object): void => {
               let element = document.getElementById('container_Series_0_Point_2_Text_0');
                expect(document.getElementById('containerShapeGroup0').childNodes.length == 0).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.dataLabel.position = 'Top';
            chartObj.refresh();
 
        });
        it('Checking dataLabel positions Auto', (done: Function) => {
            loaded = (args: Object): void => {
               let element = document.getElementById('container_Series_0_Point_2_Text_0');
                expect(document.getElementById('containerShapeGroup0').childNodes.length == 0).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.dataLabel.position = 'Auto';
            chartObj.refresh();
 
        });
        it('Checking dataLabel positions Outer', (done: Function) => {
        loaded = (args: Object): void => {
            let element = document.getElementById('container_Series_0_Point_2_Text_0');
            expect(document.getElementById('containerShapeGroup0').childNodes.length == 0).toBe(true);
            done();
        };
        chartObj.loaded = loaded;
        chartObj.series[0].marker.dataLabel.position = 'Outer';
        chartObj.refresh();
 
        });
        it('Checking dataLabel Alignment Far', (done: Function) => {
        loaded = (args: Object): void => {
            let element = document.getElementById('container_Series_0_Point_2_Text_0');
            expect(document.getElementById('containerShapeGroup0').childNodes.length == 0).toBe(true);
            done();
        };
        chartObj.loaded = loaded;
        chartObj.series[0].marker.dataLabel.alignment = 'Far';
        chartObj.refresh(); 

        });
        it('Checking dataLabel positions Near', (done: Function) => {
        loaded = (args: Object): void => {
            let element = document.getElementById('container_Series_0_Point_2_Text_0');
            expect(document.getElementById('containerShapeGroup0').childNodes.length == 0).toBe(true);
            done();
        };
        chartObj.loaded = loaded;
        chartObj.series[0].marker.dataLabel.alignment = 'Near';
        chartObj.refresh();
 
        });    
        it('with marker size without marker visibility', (done: Function) => {
        loaded = (args: Object): void => {
            let marker: HTMLElement = document.getElementById('container_Series_0_Point_3_Symbol');
            expect(marker == null).toBe(true); done();
        };
        chartObj.loaded = loaded;
        chartObj.series[0].marker.visible = false;
        chartObj.series[0].marker.width = 10;
        chartObj.series[0].marker.height = 10;
        chartObj.series[0].marker.dataLabel.visible = true;
        chartObj.refresh();

        });
        it('Checking with empty data Points', (done: Function) => { 
                loaded = (args: Object): void => {
                svg = document.getElementById('container_Series_0_Point_3_Symbol');
                expect(svg == null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource[3].y= null;
            chartObj.series[0].marker.visible = true;
            chartObj.refresh();
  
        });
        it('Checking with negative points', (done: Function) => {
            loaded = (args: Arg): void => {
            svg = document.getElementById('container1_AxisLabel_4');
            let series: Series = <Series>args.chart.series[0];
            expect(parseFloat(svg.getAttribute('y')) < series.points[1].symbolLocations[0].y).toBe(true);
            done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource = negativeDataPoint;
            chartObj.series[0].marker.visible = true;
            chartObj.tooltip.enable=true;
            chartObj.refresh();

        });
        it('Checking with negative points tooltip', (done: Function) => {
        loaded = (args: Arg): void => {
        let target: HTMLElement = document.getElementById('container_Series_0_Point_1_Symbol');
        let series: Series = <Series>chartObj.series[0];
        let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
        let y: number = series.points[1].regions[0].y + parseFloat(chartArea.getAttribute('y')) + elem.offsetTop;
        let x: number = series.points[1].regions[0].x + parseFloat(chartArea.getAttribute('x')) + elem.offsetLeft;
        trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));
        let tooltip: HTMLElement = document.getElementById('container_tooltip');
        expect(tooltip != null).toBe(true);
        done();
        };
        chartObj.loaded = loaded;
        chartObj.series[0].dataSource = negativeDataPoint;
        chartObj.tooltip.enable=true;
        chartObj.refresh();

        });
        it('Checking with single Points', (done: Function) => {
            loaded = (args: Object): void => {
                svg = document.getElementById('container_Series_0_Point_0_Symbol');
                expect(svg != null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource = null;
            chartObj.series[0].dataSource = [{ x: 1, y: 10 }];
            chartObj.refresh(); unbindResizeEvents(chartObj);
        });
        it('Legend Shape type', (done: Function) => {
            loaded = (args: Object): void => {
                let legendShape: Element = document.getElementById('container_chart_legend_shape_0');
                expect(legendShape.tagName).toEqual('path');
                expect(legendShape.getAttribute('d') !== null).toBe(true);
                done();
            };
            chartObj.animationComplete = null;
            chartObj.loaded = loaded;
            chartObj.series[0].type = 'StackingStepArea';
            chartObj.legendSettings = { visible: true };
            chartObj.refresh();

        });
        it('checking with marker shape diamond', (done: Function) => {
            loaded = (args: Object): void => {
                marker = document.getElementById('container_Series_0_Point_0_Symbol');
                expect(marker.getAttribute('fill') === 'black').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource = data;
            chartObj.series[0].marker.shape = 'Diamond';
            chartObj.series[0].marker.fill ='black';
            chartObj.refresh();
 
        });
        it('Checking with marker shape Circle', (done: Function) => {
            loaded = (args: Object): void => {
                marker = document.getElementById('container_Series_0_Point_0_Symbol');
                expect(marker.getAttribute('fill') === 'black').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.shape = 'Circle';
            chartObj.series[0].marker.fill = 'black';
            chartObj.refresh();

        });
        it('checking with marker shape HorizontalLine', (done: Function) => {
            loaded = (args: Object): void => {
                marker = document.getElementById('container_Series_0_Point_0_Symbol');
                expect(marker.getAttribute('fill') === 'black').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.shape = 'HorizontalLine';
            chartObj.refresh();

        });
        it('checking with marker shape InvertedTriangle', (done: Function) => {
            loaded = (args: Object): void => {
                marker = document.getElementById('container_Series_0_Point_0_Symbol');
                expect(marker.getAttribute('fill') === 'black').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.shape = 'InvertedTriangle';
            chartObj.refresh(); 

        });
        it('checking with marker shape Pentagon', (done: Function) => {
            loaded = (args: Object): void => {
                marker = document.getElementById('container_Series_0_Point_0_Symbol');
                expect(marker.getAttribute('fill') === 'black').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.shape = 'Pentagon';
            chartObj.refresh();
 
        });
        it('checking with marker shape Triangle', (done: Function) => {
            loaded = (args: Object): void => {
                marker = document.getElementById('container_Series_0_Point_0_Symbol');
                expect(marker.getAttribute('fill') === 'black').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.shape = 'Triangle';
            chartObj.refresh(); 

        });
        it('checking with marker shape rectangle', (done: Function) => {
            loaded = (args: Object): void => {
                marker = document.getElementById('container_Series_0_Point_0_Symbol');
                expect(marker.getAttribute('fill') === 'black').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.shape = 'Rectangle';
            chartObj.refresh();

        });
        it('Checking with marker visible false', (done: Function) => {
            loaded = (args: Object): void => {
                datalabel = document.getElementById('container_Series_0_Point_0_Symbol');
                expect(datalabel === null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.visible = false;
            chartObj.refresh(); 

        });

        it('Checking with step as Right', (done: Function) => {
            loaded = (args: Object): void => {
                let element = document.getElementById('container_Series_0');
                expect(element.getAttribute('d') !== '').toBe(true)
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].step = 'Right'
            chartObj.refresh();
        });

        it('Checking with step as Left', (done: Function) => {
            loaded = (args: Object): void => {
                let element = document.getElementById('container_Series_0');
                expect(element.getAttribute('d') !== '').toBe(true)
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].step = 'Left'
            chartObj.refresh();
        });

        it('Checking with step as Center', (done: Function) => {
            loaded = (args: Object): void => {
                let element = document.getElementById('container_Series_0');
                expect(element.getAttribute('d') !== '').toBe(true)
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].step = 'Center'
            chartObj.refresh();
        });
        
        it('Checking with multiple series', (done: Function) => {
             loaded = (args: Object): void => {
                 svg = document.getElementById('container_Series_0');
                 expect(svg.getAttribute('fill') === 'red').toBe(true);
                 svg = document.getElementById('container_Series_1');
                 expect(svg.getAttribute('fill') === 'rgba(135,206,235,1)').toBe(true);
                 done();
             };
             chartObj.loaded = loaded;
             chartObj.series = [{ dataSource: data, xName: 'x', yName: 'y', name: 'Gold', fill: 'red', type: 'StackingStepArea', animation: { enable: false } },
             { dataSource: data2, xName: 'x', name: 'silver', yName: 'y', fill: 'rgba(135,206,235,1)', type: 'StackingStepArea', animation: { enable: false } },
             { dataSource: data, xName: 'x', name: 'diamond', yName: 'y', fill: 'blue', type: 'StackingStepArea', animation: { enable: false } }];
             chartObj.series[0].marker.visible = true;
             chartObj.series[1].marker.visible = true;
             chartObj.series[2].marker.visible = true;
             chartObj.series[0].animation.enable=false;
             chartObj.series[1].animation.enable=false;
             chartObj.series[2].animation.enable=false;
             chartObj.refresh(); unbindResizeEvents(chartObj);

        });
        it('Checking with category axis', (done: Function) => {
            loaded = (args: Object): void => {
                marker = document.getElementById('container_Series_0_Point_0_Symbol');
                expect(marker != null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.valueType = 'Category';
            chartObj.series[0].dataSource = categoryData;
            chartObj.series[0].marker.visible = true;
            chartObj.refresh(); 

        });
        it('Checking with category axis BetweenTicks', (done: Function) => {
            loaded = (args: Object): void => {
                let axisLabel: Element = document.getElementById('container0_AxisLabel_0');
                expect(axisLabel.textContent == 'USA').toBe(true);
                let axisStart = document.getElementById('containerAxisLine_0');
                expect(parseInt(axisLabel.getAttribute('x')) > parseInt(axisStart.getAttribute('d').split(' ')[1])).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.valueType = 'Category';
            chartObj.primaryXAxis.labelPlacement = 'BetweenTicks'
            chartObj.series[0].dataSource = categoryData;
            chartObj.refresh(); 

        });
        it('Checking with category axis OnTicks', (done: Function) => {
            loaded = (args: Object): void => {
                let axisLabel: Element = document.getElementById('container0_AxisLabel_0');
                expect(axisLabel.textContent == 'USA').toBe(true);
                let axisStart: Element = document.getElementById('containerAxisLine_0');
                expect(parseInt(axisLabel.getAttribute('x')) < parseInt(axisStart.getAttribute('d').split(' ')[1])).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.valueType = 'Category';
            chartObj.primaryXAxis.labelPlacement = 'OnTicks'
            chartObj.series[0].dataSource = categoryData;
            chartObj.refresh(); 

        });
        it('Checking with dateTime', (done: Function) => {
            loaded = (args: Object): void => {
                let axislabel: HTMLElement = document.getElementById('container0_AxisLabel_3');
                expect(axislabel.textContent === '2003').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource = datetime;
            chartObj.series[1].dataSource = datetime;
            chartObj.series[2].dataSource = datetime;
            chartObj.primaryXAxis.valueType = 'DateTime';
            chartObj.refresh();

        });  
        it('Checking with tooltip', (done: Function) => {
            loaded = (args: Object): void => {
                let target: HTMLElement = document.getElementById('container_Series_0_Point_1_Symbol');
                let series: Series = <Series>chartObj.series[0];
                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                let y: number = series.points[1].regions[0].y + parseFloat(chartArea.getAttribute('y')) + elem.offsetTop;
                let x: number = series.points[1].regions[0].x + parseFloat(chartArea.getAttribute('x')) + elem.offsetLeft;
                trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));
                let tooltip: HTMLElement = document.getElementById('container_tooltip');
                expect(tooltip != null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.tooltip.enable = true;
            chartObj.refresh();
 
        });
        it('Checking with trackball', (done: Function) => {
            loaded = (args: Object): void => {
                let target: HTMLElement = document.getElementById('container_Series_0_Point_1_Symbol');
                let series: Series = <Series>chartObj.series[0];
                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                let y: number = series.points[1].regions[0].y + parseFloat(chartArea.getAttribute('y')) + elem.offsetTop;
                let x: number = series.points[1].regions[0].x + parseFloat(chartArea.getAttribute('x')) + elem.offsetLeft;
                trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));
                let tooltip: HTMLElement = document.getElementById('container_tooltip');
                expect(tooltip != null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.tooltip.shared = true;
            chartObj.refresh();
 
        });
        it('Checking with cross hair', (done: Function) => {
            loaded = (args: Object): void => {
                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                let series: Series = <Series>chartObj.series[0];
                let y: number = series.points[2].regions[0].y + parseFloat(chartArea.getAttribute('y')) + elem.offsetTop;
                let x: number = series.points[2].regions[0].x + series.points[2].regions[0].width / 2 +
                    parseFloat(chartArea.getAttribute('x')) + elem.offsetLeft;
                trigger.mousemovetEvent(chartArea, Math.ceil(x), Math.ceil(y));
                let crosshair: Element = <Element>document.getElementById('container_svg').childNodes[5];
                let element1: HTMLElement;
                expect(crosshair.childNodes.length == 3).toBe(true);
                element1 = <HTMLElement>crosshair.childNodes[0];
                expect(element1.getAttribute('d').indexOf(chartArea.getAttribute('x')) > 0).toBe(true);
                element1 = <HTMLElement>crosshair.childNodes[1];
                expect(element1.getAttribute('d').indexOf(chartArea.getAttribute('y')) > 0).toBe(true);
                expect(crosshair.childNodes[2].childNodes.length == 4).toBe(true);
                element1 = <HTMLElement>crosshair.childNodes[2].childNodes[0];
                expect(element1.getAttribute('d') != '').toBe(true);
                element1 = <HTMLElement>crosshair.childNodes[2].childNodes[2];
                expect(element1.getAttribute('d') != '').toBe(true);
                done();
            }
            chartObj.loaded = loaded;
            chartObj.crosshair.enable = true;
            chartObj.series[0].animation.enable = false;
            chartObj.primaryXAxis.crosshairTooltip.enable = true;
            chartObj.primaryYAxis.crosshairTooltip.enable = true;
            chartObj.refresh();

        });
        it('Checking with log axis with dataTime axis', (done: Function) => {
            loaded = (args: Object): void => {
                let axisLabelLast: Element = document.getElementById('container1_AxisLabel_3');
                expect(axisLabelLast.textContent == '10000').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.primaryXAxis.valueType = 'DateTime';
            chartObj.primaryYAxis.valueType = 'Logarithmic';
            chartObj.series = [
                {
                    type: 'StackingStepArea', name: 'ProductX', xName: 'x', yName:'y',
                    dataSource: [
                        { x: new Date(1995, 0, 1), y: 80 }, { x: new Date(1996, 0, 1), y: 200 },
                        { x: new Date(1997, 0, 1), y: 400 }, { x: new Date(1998, 0, 1), y: 600 },
                        { x: new Date(1999, 0, 1), y: 700 }, { x: new Date(2000, 0, 1), y: 1400 },
                        { x: new Date(2001, 0, 1), y: 2000 }, { x: new Date(2002, 0, 1), y: 4000 },
                        { x: new Date(2003, 0, 1), y: 6000 }, { x: new Date(2004, 0, 1), y: 8000 },
                        { x: new Date(2005, 0, 1), y: 10000 }]
                }];
            chartObj.series[0].animation.enable = false;
            chartObj.refresh();

        });
         it('Checking with stroke for applied border', (done: Function) => {
            loaded = (args: Object): void => {
                 let seriesBorder: HTMLElement = document.getElementById('container_Series_border_0');
                 expect(seriesBorder.getAttribute('stroke') === 'blue').toBe(true);
                 done();
             };
             chartObj.loaded = loaded;
            chartObj.series[0].border.color = 'blue';
            chartObj.series[0].border.width = 4;
            chartObj.refresh();
         });
         it(' checking with fill for applied border', (done: Function) => {
            loaded = (args: Object): void => {
                let seriesBorder = document.getElementById('container_Series_border_0');
                expect(seriesBorder.getAttribute('fill') === 'transparent').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].fill = 'red';
            chartObj.refresh();
        });
    });
    describe('Stacking Step Area Series Inversed axis', () => {
        let chart: Chart;
        let loaded: EmitType<ILoadedEventArgs>;
        let element: HTMLElement;
        let dataLabelY;
        let pointY;
        element = createElement('div', { id: 'container' });
        beforeAll(() => {
            document.body.appendChild(element);
            chart = new Chart(
                {
                    primaryXAxis: { title: 'PrimaryXAxis' },
                    primaryYAxis: { title: 'PrimaryYAxis', isInversed: true },
                    series: [{
                        animation: { enable: false },
                        name: 'Series1', dataSource: data, xName: 'x', yName: 'y', size: 'size',
                        type: 'StackingStepArea', marker: { visible: false, dataLabel: { visible: true, fill: 'violet' } }
                    }, 
                    {
                        animation: { enable: false },
                        name: 'Series2', dataSource: data2, xName: 'x', yName: 'y', size: 'size',
                        type: 'StackingStepArea', marker: { visible: false, dataLabel: { visible: true, fill: 'Red' } }
                    }],
                    width: '800',
                    title: 'Chart TS Title', loaded: loaded,
                    legendSettings: { visible: false }
                });
            chart.appendTo('#container');

        });

        afterAll((): void => {
            chart.destroy();
            element.remove();
        });

        it('With Label position Top', (done: Function) => {
            loaded = (args: Object): void => {
                dataLabelY = +document.getElementById('container_Series_0_Point_2_TextShape_0').getAttribute('y');
                pointY = (<Points>(<Series>chart.series[0]).points[2]).symbolLocations[0].y;
                expect(dataLabelY > pointY).toBe(true);
                dataLabelY = +document.getElementById('container_Series_0_Point_6_TextShape_0').getAttribute('y');
                pointY = (<Points>(<Series>chart.series[0]).points[6]).symbolLocations[0].y;
                expect(dataLabelY > pointY).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.series[0].marker.dataLabel.position = 'Top';
            chart.series[0].marker.dataLabel.alignment = 'Center';
            chart.refresh();

        });
        it('With Label position Bottom', (done: Function) => {
            loaded = (args: Object): void => {
                dataLabelY = +document.getElementById('container_Series_0_Point_2_TextShape_0').getAttribute('y');
                pointY = (<Points>(<Series>chart.series[0]).points[2]).symbolLocations[0].y;
                expect(dataLabelY < pointY).toBe(true);
                dataLabelY = +document.getElementById('container_Series_0_Point_6_TextShape_0').getAttribute('y');
                pointY = (<Points>(<Series>chart.series[0]).points[6]).symbolLocations[0].y;
                expect(dataLabelY < pointY).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.series[0].marker.dataLabel.position = 'Bottom';
            chart.refresh();

        });
        it('With Label position Middle', (done: Function) => {
            loaded = (args: Object): void => {
                let labelY: number = +document.getElementById('container_Series_0_Point_1_TextShape_0').getAttribute('y');
                let labelHeight: number = +document.getElementById('container_Series_0_Point_1_TextShape_0').getAttribute('height');
                let point: Points = (<Points>(<Series>chart.series[0]).points[1]);
                expect(labelY + labelHeight / 2).toEqual(point.regions[0].y + point.regions[0].height / 2);
                done();
            };
            chart.loaded = loaded;
            chart.series[0].marker.dataLabel.position = 'Middle';
            chart.refresh();

        });
    });
    describe('checking rotated step area chart', () => {
        let chart: Chart;
        let loaded: EmitType<ILoadedEventArgs>;
        let element: HTMLElement = createElement('div', { id: 'container' });
        let dataLabel: HTMLElement;
        let dataLabel1: HTMLElement;
        let point: Points;
        let trigger: MouseEvents = new MouseEvents();
        let x: number;
        let y: number;
        let tooltip: HTMLElement;
        let chartArea: HTMLElement;
        let series: Series;
        beforeAll(() => {
            document.body.appendChild(element);
            chart = new Chart({
                primaryXAxis: { title: 'primaryXAxis', valueType: 'DateTime' },
                primaryYAxis: { title: 'PrimaryYAxis'},
                series: [
                    { type: 'StackingStepArea', name: 'series1', dataSource: rotateData1, xName: 'x', yName: 'y', animation: { enable: false },
                      marker: { visible: true}},
                    { type: 'StackingStepArea', name: 'series2', dataSource: rotateData2, xName: 'x', yName: 'y', animation: { enable: false },
                      marker: { visible: true}}
                ],
                title: 'rotated stepline Chart'
            });
            chart.appendTo('#container');
        });
        afterAll((): void => {
            chart.destroy();
            element.remove();
        });
        it('checking without rotated', (done: Function) => {
            loaded = (args: Object): void => {
                let axis: Axis = <Axis>chart.primaryXAxis;
                expect(axis.orientation).toEqual('Horizontal');
                axis = <Axis>chart.primaryYAxis;
                expect(axis.orientation).toEqual('Vertical');
                done();
            };
            chart.loaded = loaded;
            chart.refresh();
        });

        it('checking with rotated', (done: Function) => {
            loaded = (args: Object): void => {
                let axis: Axis = <Axis>chart.primaryYAxis;
                expect(axis.orientation).toEqual('Horizontal');
                axis = <Axis>chart.primaryXAxis;
                expect(axis.orientation).toEqual('Vertical');
                done();
            };
            chart.loaded = loaded;
            chart.isTransposed = true;
            chart.refresh();
        });
        it('checking with datalabel Auto position', (done: Function) => {
            loaded = (args: Object): void => {
                dataLabel = document.getElementById('container_Series_0_Point_2_Text_0');
                point = (<Points>(<Series>chart.series[0]).points[2]);
                expect(+(dataLabel.getAttribute('y')) < point.symbolLocations[0].y).toBe(true);
                dataLabel1 = document.getElementById('container_Series_1_Point_2_Text_0');
                point = (<Points>(<Series>chart.series[1]).points[2]);
                expect(+(dataLabel.getAttribute('y')) < point.symbolLocations[0].y).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.series[0].marker.dataLabel.visible = true;
            chart.refresh();
        });
        it('checking with datalabel Top position', (done: Function) => {
            loaded = (args: Object): void => {
                dataLabel = document.getElementById('container_Series_0_Point_2_Text_0');
                point = (<Points>(<Series>chart.series[0]).points[2]);
                expect(+(dataLabel.getAttribute('y')) < point.symbolLocations[0].y).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.series[0].marker.dataLabel.position = 'Top';
            chart.refresh();
        });
        it('checking with datalabel Middle position', (done: Function) => {
            loaded = (args: Object): void => {
                dataLabel = document.getElementById('container_Series_0_Point_2_Text_0');
                point = (<Points>(<Series>chart.series[0]).points[2]);
                expect(+(dataLabel.getAttribute('y')) > (point.symbolLocations[0].y - point.regions[0].height / 2)).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.series[0].marker.dataLabel.position = 'Middle';
            chart.refresh();
        });
        it('checking with datalabel bottom position', (done: Function) => {
            loaded = (args: Object): void => {
                dataLabel = document.getElementById('container_Series_0_Point_2_Text_0');
                point = (<Points>(<Series>chart.series[0]).points[2]);
                expect(+(dataLabel.getAttribute('y')) > point.symbolLocations[0].y).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.series[0].marker.dataLabel.position = 'Bottom';
            chart.refresh();
        });
        it('checking with tooltip positive values', (done: Function) => {
            loaded = (args: Object): void => {
                //positive y yValues
                dataLabel = document.getElementById('container_Series_0_Point_2_Symbol');
                series = <Series>chart.series[0];
                chartArea = document.getElementById('container_ChartAreaBorder');
                y = series.points[2].regions[0].y + parseFloat(chartArea.getAttribute('y')) + element.offsetTop;
                x = series.points[2].regions[0].x + parseFloat(chartArea.getAttribute('x')) + element.offsetLeft;
                trigger.mousemovetEvent(dataLabel, Math.ceil(x), Math.ceil(y));
                tooltip = document.getElementById('container_tooltip');
                expect(tooltip != null).toBe(true);
                expect(parseFloat(tooltip.style.left) > series.points[2].regions[0].y + parseFloat(chartArea.getAttribute('y')));
                done();
            };
            chart.loaded = loaded;
            chart.tooltip.enable = true;
            chart.refresh();
        });
        it('checking with track ball', (done: Function) => {
            loaded = (args: Object): void => {
                dataLabel = document.getElementById('container_Series_0_Point_1_Symbol');
                y = series.points[1].regions[0].y + parseFloat(chartArea.getAttribute('y')) + element.offsetTop;
                x = series.points[1].regions[0].x + parseFloat(chartArea.getAttribute('x')) + element.offsetLeft;
                trigger.mousemovetEvent(dataLabel, Math.ceil(x), Math.ceil(y));
                tooltip = document.getElementById('container_tooltip');
                expect(tooltip != null).toBe(true);
                expect(parseFloat(tooltip.style.top) > series.points[1].regions[0].y + parseFloat(chartArea.getAttribute('y')));
                done();
            };
            chart.loaded = loaded;
            chart.tooltip.shared = true;
            chart.refresh();
        });
        it('checking with animation', (done: Function) => {
            loaded = (args: Object): void => {
                let seriesElement = document.getElementById('container_Series_0');
                expect(seriesElement !== null).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.series[0].animation.enable = true;
            chart.series[1].animation.enable = true;
            chart.refresh();
        });
    });

    describe('Stacking step area - animation on data changes', () => {
        let chart: Chart;
        let loaded: EmitType<ILoadedEventArgs>;
        let element: HTMLElement = createElement('div', { id: 'container' });
        let dataLabel: HTMLElement;
        let dataLabel1: HTMLElement;
        let point: Points;
        let trigger: MouseEvents = new MouseEvents();
        let x: number;
        let y: number;
        let tooltip: HTMLElement;
        let chartArea: HTMLElement;
        let series: Series;
        beforeAll(() => {
            document.body.appendChild(element);
            chart = new Chart({
                primaryXAxis: { title: 'primaryXAxis', valueType: 'DateTime' },
                primaryYAxis: { title: 'PrimaryYAxis'},
                series: [
                    {
                        type: 'StackingStepArea', name: 'series1',
                        dataSource: [
                            { x: new Date(2000, 6, 11), y: 10 }, { x: new Date(2002, 3, 7), y: -30 },
                            { x: new Date(2004, 3, 6), y: 15 }, { x: new Date(2006, 3, 30), y: -65 },
                            { x: new Date(2008, 3, 8), y: 0 }, { x: new Date(2010, 3, 8), y: 85 }],
                        xName: 'x', yName: 'y', animation: { enable: false },
                        marker: { visible: true }
                    }
                ],
                title: 'Step Area Chart'
            });
            chart.appendTo('#container');
        });
        afterAll((): void => {
            chart.destroy();
            element.remove();
        });
       
        it('Stacking Step area - Checking setData method', (done: Function) => {
            loaded = (args: Object): void => {
                let seriesElement = document.getElementById('container_Series_0');
                expect(seriesElement !== null).toBe(true);
                done();
            };
            chart.loaded = loaded;
            let seriesData = [{ x: new Date(2000, 6, 11), y: 10 }, { x: new Date(2002, 3, 7), y: -30 },
            { x: new Date(2004, 3, 6), y: 17 }, { x: new Date(2006, 3, 30), y: -65 },
            { x: new Date(2008, 3, 8), y: 0 }, { x: new Date(2010, 3, 8), y: 85 }]
            chart.series[0].setData(seriesData);
            chart.refresh();
        });
        it('Stacking Step area - Checking addPoint method', (done: Function) => {
            loaded = (args: Object): void => {
                let seriesElement = document.getElementById('container_Series_0');
                expect(seriesElement.getAttribute('d') !== '').toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.series[0].addPoint({ x: new Date(2010, 3, 11), y: 85 });
            chart.refresh();
        });
        it('Stacking Step area - Checking removePoint method', (done: Function) => {
            loaded = (args: Object): void => {
                let seriesElement = document.getElementById('container_Series_0');
                expect(seriesElement.getAttribute('d') !== '').toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.series[0].removePoint(0); chart.series[0].removePoint(1);
            chart.series[0].removePoint(2); chart.series[0].removePoint(3); chart.series[0].removePoint(4);
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

    describe('Chart StackingSteparea series without vertical risers', () => {
        let chartObj: Chart;
        let svg: HTMLElement;
        let marker: HTMLElement;
        let targetElement: HTMLElement;
        let datalabel: HTMLElement;
        let loaded: EmitType<ILoadedEventArgs>;
        beforeAll(() => {
            elem = createElement('div', { id: 'container' });
            document.body.appendChild(elem);
            chartObj = new Chart(
                {
                    primaryXAxis: { title: 'PrimaryXAxis' },
                    primaryYAxis: { title: 'PrimaryYAxis', rangePadding: 'Normal' },
                    series: [{
                        dataSource: data, xName: 'x', yName: 'y', animation: { enable: false }, type: 'StepArea',
                        name: 'ChartSeriesNameGold', fill: 'skyblue', marker:{visible: true,dataLabel:{visible:false}},
                        border: {
                            color: 'blue',
                            width: 4,
                        },
                        noRisers : true
                    },
                    ], width: '800',
                    title: 'Chart TS Title', legendSettings: { visible: false, },

                });
            chartObj.appendTo('#container');

        });

        afterAll((): void => {
            elem.remove();
            chartObj.destroy();
        });
        it('Checking with step as Right', (done: Function) => {
            loaded = (args: Object): void => {
                let element = document.getElementById('container_Series_border_0');
                //expect(element.getAttribute('d')).toBe('M 0 43.78125 L 0 43.78125 M 0 175.125 L 105.07142857142857 175.125 M 105.07142857142857 43.78125 L 210.14285714285714 43.78125 M 210.14285714285714 87.5625 L 315.2142857142857 87.5625 M 315.2142857142857 131.34375 L 420.2857142857143 131.34375 M 420.2857142857143 175.125 L 525.3571428571429 175.125 M 525.3571428571429 175.125 L 630.4285714285714 175.125 M 630.4285714285714 43.78125 L 735.5 43.78125 L 735.5 43.78125 ' || 'M 0 43.78125 L 0 43.78125 M 0 175.125 L 105.21428571428571 175.125 M 105.21428571428571 43.78125 L 210.42857142857142 43.78125 M 210.42857142857142 87.5625 L 315.6428571428571 87.5625 M 315.6428571428571 131.34375 L 420.85714285714283 131.34375 M 420.85714285714283 175.125 L 526.0714285714286 175.125 M 526.0714285714286 175.125 L 631.2857142857142 175.125 M 631.2857142857142 43.78125 L 736.5 43.78125 L 736.5 43.78125 ')
                expect(element.getAttribute('d')).toBe('M 0 43.78125 L 0 43.78125 M 0 175.125 L 105.21428571428571 175.125 M 105.21428571428571 43.78125 L 210.42857142857142 43.78125 M 210.42857142857142 87.5625 L 315.6428571428571 87.5625 M 315.6428571428571 131.34375 L 420.85714285714283 131.34375 M 420.85714285714283 175.125 L 526.0714285714286 175.125 M 526.0714285714286 175.125 L 631.2857142857142 175.125 M 631.2857142857142 43.78125 L 736.5 43.78125 L 736.5 43.78125 ' );
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource = [{ x: 1000, y: 70 }, { x: 2000, y: 40 },
                { x: 3000, y: 70 }, { x: 4000, y: 60 },
                { x: 5000, y: 50 }, { x: 6000, y: 40 },
                { x: 7000, y: 40 }, { x: 8000, y: 70 }]           
            chartObj.series[0].step = 'Right'
            chartObj.refresh();
        });

        it('Checking with step as Left', (done: Function) => {
            loaded = (args: Object): void => {
                let element = document.getElementById('container_Series_border_0');
                // expect(element.getAttribute('d')).toBe('M 0 43.78125 L 0 43.78125 L 105.07142857142857 43.78125 M 105.07142857142857 175.125 L 210.14285714285714 175.125 M 210.14285714285714 43.78125 L 315.2142857142857 43.78125 M 315.2142857142857 87.5625 L 420.2857142857143 87.5625 M 420.2857142857143 131.34375 L 525.3571428571429 131.34375 M 525.3571428571429 175.125 L 630.4285714285714 175.125 M 630.4285714285714 175.125 L 735.5 175.125 M 735.5 43.78125 L 735.5 43.78125 ' || 'M 0 43.78125 L 0 43.78125 L 105.21428571428571 43.78125 M 105.21428571428571 175.125 L 210.42857142857142 175.125 M 210.42857142857142 43.78125 L 315.6428571428571 43.78125 M 315.6428571428571 87.5625 L 420.85714285714283 87.5625 M 420.85714285714283 131.34375 L 526.0714285714286 131.34375 M 526.0714285714286 175.125 L 631.2857142857142 175.125 M 631.2857142857142 175.125 L 736.5 175.125 M 736.5 43.78125 L 736.5 43.78125 ')
                expect(element.getAttribute('d')).toBe('M 0 43.78125 L 0 43.78125 L 105.21428571428571 43.78125 M 105.21428571428571 175.125 L 210.42857142857142 175.125 M 210.42857142857142 43.78125 L 315.6428571428571 43.78125 M 315.6428571428571 87.5625 L 420.85714285714283 87.5625 M 420.85714285714283 131.34375 L 526.0714285714286 131.34375 M 526.0714285714286 175.125 L 631.2857142857142 175.125 M 631.2857142857142 175.125 L 736.5 175.125 M 736.5 43.78125 L 736.5 43.78125 ');
 
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].step = 'Left'
            chartObj.refresh();
        });

        it('Checking with step as Center', (done: Function) => {
            loaded = (args: Object): void => {
                let element = document.getElementById('container_Series_border_0');
                // expect(element.getAttribute('d')).toBe('M 0 43.78125 L 0 43.78125 L 52.535714285714285 43.78125 M 52.535714285714285 175.125 L 105.07142857142857 175.125 L 157.60714285714286 175.125 M 157.60714285714286 43.78125 L 210.14285714285714 43.78125 L 262.67857142857144 43.78125 M 262.67857142857144 87.5625 L 315.2142857142857 87.5625 L 367.75 87.5625 M 367.75 131.34375 L 420.2857142857143 131.34375 L 472.82142857142856 131.34375 M 472.82142857142856 175.125 L 525.3571428571429 175.125 L 577.8928571428571 175.125 M 577.8928571428571 175.125 L 630.4285714285714 175.125 L 682.9642857142858 175.125 M 682.9642857142858 43.78125 L 735.5 43.78125 L 735.5 43.78125 ' || 'M 0 43.78125 L 0 43.78125 L 52.607142857142854 43.78125 M 52.607142857142854 175.125 L 105.21428571428571 175.125 L 157.82142857142856 175.125 M 157.82142857142856 43.78125 L 210.42857142857142 43.78125 L 263.0357142857143 43.78125 M 263.0357142857143 87.5625 L 315.6428571428571 87.5625 L 368.25 87.5625 M 368.25 131.34375 L 420.85714285714283 131.34375 L 473.46428571428567 131.34375 M 473.46428571428567 175.125 L 526.0714285714286 175.125 L 578.6785714285713 175.125 M 578.6785714285713 175.125 L 631.2857142857142 175.125 L 683.8928571428571 175.125 M 683.8928571428571 43.78125 L 736.5 43.78125 L 736.5 43.78125 ')
                expect(element.getAttribute('d')).toBe('M 0 43.78125 L 0 43.78125 L 52.607142857142854 43.78125 M 52.607142857142854 175.125 L 105.21428571428571 175.125 L 157.82142857142856 175.125 M 157.82142857142856 43.78125 L 210.42857142857142 43.78125 L 263.0357142857143 43.78125 M 263.0357142857143 87.5625 L 315.6428571428571 87.5625 L 368.25 87.5625 M 368.25 131.34375 L 420.85714285714283 131.34375 L 473.46428571428567 131.34375 M 473.46428571428567 175.125 L 526.0714285714286 175.125 L 578.6785714285713 175.125 M 578.6785714285713 175.125 L 631.2857142857142 175.125 L 683.8928571428571 175.125 M 683.8928571428571 43.78125 L 736.5 43.78125 L 736.5 43.78125 ');

                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].step = 'Center'
            chartObj.refresh();
        });
    });
});
export interface series1 {
    series: Series;
}