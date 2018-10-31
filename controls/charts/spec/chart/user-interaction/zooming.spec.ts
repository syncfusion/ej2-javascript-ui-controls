/**
 * Zooming spec document
 */
import { createElement, remove } from '@syncfusion/ej2-base';
import { Chart } from '../../../src/chart/chart';
import { LineSeries } from '../../../src/chart/series/line-series';
import { AreaSeries } from '../../../src/chart/series/area-series';
import { Category } from '../../../src/chart/axis/category-axis';
import { DateTime } from '../../../src/chart/axis/date-time-axis';
import { ColumnSeries } from '../../../src/chart/series/column-series';
import { DataLabel } from '../../../src/chart/series/data-label';
import { BarSeries } from '../../../src/chart/series/bar-series';
import { Zoom } from '../../../src/chart/user-interaction/zooming';
import { Legend } from '../../../src/chart/legend/legend';
import { tooltipData1, tooltipData2, datetimeData } from '../base/data.spec';
import { unbindResizeEvents } from '../base/data.spec';
import { MouseEvents } from '../base/events.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { EmitType } from '@syncfusion/ej2-base';
import { ILoadedEventArgs } from '../../../src/common/model/interface';
Chart.Inject(LineSeries, DataLabel, AreaSeries, Category, DateTime, ColumnSeries, Legend, BarSeries, Zoom);

let data: any = tooltipData1;
let data2: any = tooltipData2;
export interface DataValue {
    x: number | Date | string;
    y: number;
}
let prevent: Function = (): void => {
    //Prevent Function
};
let trigger: MouseEvents = new MouseEvents();
export let categoryData: DataValue[] = [{ x: 'USA', y: 50 }, { x: 'China', y: 40 },
{ x: 'Japan', y: 70 }, { x: 'Australia', y: 60 },
{ x: 'France', y: 50 }, { x: 'Germany', y: 80 },
{ x: 'Italy', y: 40 }, { x: 'Sweden', y: 30 }];

export let categoryData1: DataValue[] = [{ x: 'USA', y: 70 }, { x: 'China', y: 60 },
{ x: 'Japan', y: 60 }, { x: 'Australia', y: 56 },
{ x: 'France', y: 45 }, { x: 'Germany', y: 30 },
{ x: 'Italy', y: 35 }, { x: 'Sweden', y: 25 }];

export interface wheel {
    preventDefault: Function,
    wheelDelta: number,
    detail: number,
    clientX: number,
    clientY: number
}
describe('Chart Control', () => {
    let chartObj: Chart;
    let targetElement: HTMLElement;
    let firstElement: HTMLElement;
    let resetElement: Element;
    let loaded: EmitType<ILoadedEventArgs>; let loaded1: EmitType<ILoadedEventArgs>;
    let x: number;
    let path: string;
    let content: string;
    let y: number;
    let dragEle: HTMLElement;
    let mouseMove: any;
    let instance: any;
    let mouseUp: any;
    describe('Default Zooming Selection', () => {
        let elem: HTMLElement = createElement('div', { id: 'container' });
        beforeAll(() => {
            document.body.appendChild(elem);
            chartObj = new Chart(
                {
                    primaryXAxis: { title: 'PrimaryXAxis', labelFormat: 'n1', zoomFactor: 0.1 },
                    primaryYAxis: { title: 'PrimaryYAxis', labelFormat: 'n1', rangePadding: 'None' },

                    series: [{
                        type: 'Line',
                        dataSource: data, xName: 'x', yName: 'y', animation: { enable: false },
                        name: 'ChartSeriesNameGold', fill: 'rgba(135,206,235,1)',
                        marker: {
                            visible: false
                        }
                    }],
                    title: 'Chart TS Title',
                    legendSettings: { visible: true },
                    width: '800',
                    zoomSettings: { enableSelectionZooming: false }
                });
            chartObj.appendTo('#container');


        });
        afterAll((): void => {
            chartObj.destroy();
            remove(elem);
        });

        it('Checking default selection zooming', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                trigger.draganddropEvent(elem, 200, 200, 350, 350);
                resetElement = document.getElementById('container_Zooming_Reset');
                expect(resetElement == null).toBe(true);
                chartObj.primaryXAxis.zoomFactor = 1;
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();

        });

        it('Checking default selection zooming', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                trigger.draganddropEvent(elem, 200, 200, 350, 350);
                resetElement = document.getElementById('container_Zooming_Reset');
                content = document.getElementById('container0_AxisLabel_0').textContent;
                expect(content == '2200.0' || content == '2400.0').toBe(true);
                expect(resetElement != null).toBe(true);
                trigger.mousedownEvent(resetElement, 0, 0, 5, 5);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.zoomSettings.enableSelectionZooming = true;
            chartObj.refresh();

        });        

        it('Selection zooming - false', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                trigger.draganddropEvent(elem, 200, 200, 350, 350);
                resetElement = document.getElementById('container_Zooming_Reset');
                expect(document.getElementById('container0_AxisLabel_0').textContent != '2200.0').toBe(true);
                expect(resetElement == null).toBe(true);
                done();
            };
            chartObj.zoomSettings.enableSelectionZooming = false;
            chartObj.loaded = loaded;
            chartObj.refresh();
        });

        it('Checking rect size', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                trigger.dragEvent(elem, 300, 300, 350, 350);
                targetElement = document.getElementById('container_ZoomArea');
                expect(targetElement.getAttribute('width') == '50');
                expect(targetElement.getAttribute('height') == '50');
                expect(targetElement.getAttribute('fill') == 'rgba(69,114,167,0.25)');
                expect(targetElement.getAttribute('stroke') == 'rgba(69,114,167,0.25)');
                trigger.mouseLeaveEvent(elem);
                resetElement = document.getElementById('container_Zooming_Reset');
                expect(resetElement != null).toBe(true);
                trigger.mousedownEvent(resetElement, 0, 0, 5, 5);
                done();
            };
            chartObj.zoomSettings.enableSelectionZooming = true;
            chartObj.loaded = loaded;
            chartObj.refresh();
        });

        it('Checking series path', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                trigger.draganddropEvent(elem, 200, 200, 350, 350);
                resetElement = document.getElementById('container_Zooming_Reset');
                expect(document.getElementById('container_Series_0').getAttribute('d') != '').toBe(true);
                trigger.draganddropEvent(elem, 200, 200, 300, 300);
                path = document.getElementById('container_Series_0').getAttribute('d');
                expect((path.match(/M/g) || []).length == 1).toBe(true);
                expect(resetElement != null).toBe(true);
                trigger.mousedownEvent(resetElement, 0, 0, 5, 5);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });

        it('checking zoom position and zoom factor', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                trigger.draganddropEvent(elem, 100, 100, 400, 400);
                resetElement = document.getElementById('container_Zooming_Reset');
                expect(resetElement != null).toBe(true);
                content = chartObj.primaryXAxis.zoomFactor.toFixed(2);
                expect(content == '0.42' || content == '0.41').toBe(true);
                content = chartObj.primaryYAxis.zoomFactor.toFixed(2);
                expect(content == '0.84' || content == '0.85').toBe(true);
                expect(chartObj.primaryYAxis.zoomPosition == 0).toBe(true);
                trigger.mousedownEvent(resetElement, 0, 0, 5, 5);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });

        it('checking mouse cursor', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                trigger.mousedownEvent(elem, 100, 100, 150, 150);
                trigger.mousemoveEvent(elem, 100, 100, 150, 150);
                resetElement = document.getElementById('container_Zooming_Reset');
                expect(resetElement == null).toBe(true);
                trigger.mouseupEvent(elem, 100, 100, 150, 150);
                targetElement = document.getElementById('container_svg');
                expect(targetElement.getAttribute('cursor') != 'crosshair').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();

        });

        it('checking selection zooming in toolkit', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                trigger.draganddropEvent(elem, 200, 200, 350, 350);
                targetElement = document.getElementById('container_Zooming_KitCollection');
                trigger.dragEvent(targetElement, 10, 10, -400, 300);
                resetElement = document.getElementById('container_ZoomArea');
                expect(resetElement == null).toBe(true);
                trigger.mousedownEvent(document.getElementById('container_Zooming_Reset'), 0, 0, 5, 5);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });

        it('checking selection zooming upTo bottom of the axis line', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                trigger.draganddropEvent(elem, 100, 100, 400, 380.5);
                resetElement = document.getElementById('container_Zooming_Reset');
                expect(resetElement != null).toBe(true);
                content = chartObj.primaryXAxis.zoomFactor.toFixed(2);
                expect(content == '0.41' || content == '0.42').toBe(true);
                expect(chartObj.primaryYAxis.zoomFactor.toFixed(2) == '0.84' ||
                       chartObj.primaryYAxis.zoomFactor.toFixed(2) == '0.85').toBe(true);
                expect(chartObj.primaryYAxis.zoomPosition.toFixed(2) == '0.00').toBe(true);
                trigger.mousedownEvent(resetElement, 0, 0, 5, 5);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });

        it('checking selection zooming upTo outside of the axis line', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                trigger.draganddropEvent(elem, 100, 100, 400, 880.5);
                resetElement = document.getElementById('container_Zooming_Reset');
                expect(resetElement != null).toBe(true);
                content = chartObj.primaryXAxis.zoomFactor.toFixed(2);
                expect(content == '0.41' || content == '0.42').toBe(true);
                expect(chartObj.primaryYAxis.zoomFactor.toFixed(2) == '0.84' ||
                       chartObj.primaryYAxis.zoomFactor.toFixed(2) == '0.85').toBe(true);
                expect(chartObj.primaryYAxis.zoomPosition.toFixed(2) == '0.00').toBe(true);
                trigger.mousedownEvent(resetElement, 0, 0, 5, 5);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Checking selection zooming with multiple axes', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                trigger.draganddropEvent(elem, 100, 100, 400, 880.5);
                resetElement = document.getElementById('container_Zooming_Reset');
                expect(resetElement != null).toBe(true);
                content = chartObj.primaryXAxis.zoomFactor.toFixed(2);
                expect(content == '0.41' || content == '0.42').toBe(true);
                expect(chartObj.primaryYAxis.zoomFactor.toFixed(2) == '0.84' ||
                       chartObj.primaryYAxis.zoomFactor.toFixed(2) == '0.85').toBe(true);
                expect(chartObj.primaryYAxis.zoomPosition.toFixed(2) == '0.00').toBe(true);
                trigger.mousedownEvent(resetElement, 0, 0, 5, 5);
                done();
            };
            chartObj.rows = [{ height: '50%' }, { height: '50%' }];
            chartObj.columns = [{ width: '50%' }, { width: '50%' }];
            chartObj.axes = [
                { name: 'xAxis1', rowIndex: 0, columnIndex: 1, },
                { name: 'xAxis2', rowIndex: 1, columnIndex: 0, opposedPosition: true },
                { name: 'xAxis3', rowIndex: 1, columnIndex: 1, opposedPosition: true },
                { name: 'yAxis1', rowIndex: 0, columnIndex: 1, opposedPosition: true },
                { name: 'yAxis2', rowIndex: 1, columnIndex: 0 },
                { name: 'yAxis3', rowIndex: 1, columnIndex: 1, opposedPosition: true }
            ];
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Checking rect size outside of the area', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                trigger.dragEvent(elem, 30, 30, 50, 50);
                targetElement = document.getElementById('container_ZoomArea');
                expect(targetElement == null).toBe(true);
                done();
            };
            chartObj.zoomSettings.enableSelectionZooming = true;
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Checking default selection zooming with device', () => {
            chartObj.loaded = null;
            chartObj.zoomModule.isDevice = true;
            trigger.draganddropEvent(elem, 200, 200, 350, 350);
            resetElement = document.getElementById('container_Zooming_Reset');
            content = document.getElementById('container0_AxisLabel_0').textContent;
            expect(resetElement != null).toBe(true);
            trigger.mousedownEvent(resetElement, 0, 0, 5, 5);

        });
    });

    describe('Checking Zooming Toolkit', () => {
        let elem: HTMLElement = createElement('div', { id: 'container' });
        beforeAll(() => {
            document.body.appendChild(elem);
            chartObj = new Chart(
                {
                    primaryXAxis: { title: 'PrimaryXAxis', labelFormat: 'n1' },
                    primaryYAxis: { title: 'PrimaryYAxis', labelFormat: 'n1', rangePadding: 'None' },

                    series: [{
                        type: 'Line',
                        dataSource: data, xName: 'x', yName: 'y', animation: { enable: false },
                        name: 'ChartSeriesNameGold', fill: 'rgba(135,206,235,1)',
                        marker: {
                            visible: false
                        }
                    }],
                    title: 'Chart TS Title',
                    legendSettings: { visible: true },
                    width: '800',
                    zoomSettings: { enablePinchZooming: true, enableSelectionZooming: true }
                });
            chartObj.appendTo('#container');


        });
        afterAll((): void => {
            chartObj.destroy();
            elem.remove();
        });

        it('Selection zooming - checking toolkit elements', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                trigger.draganddropEvent(elem, 100, 100, 400, 400);
                resetElement = document.getElementById('container_Zooming_Reset');
                expect(resetElement != null).toBe(true);
                targetElement = document.getElementById('container_Zooming_KitCollection');
                expect(targetElement.childNodes.length == 8).toBe(true);
                trigger.mousedownEvent(resetElement, 0, 0, 5, 5);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });

        it('Selection zooming - empty toolbar items', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                trigger.draganddropEvent(elem, 100, 100, 400, 400);
                resetElement = document.getElementById('container_Zooming_Reset');
                expect(resetElement == null).toBe(true);
                targetElement = document.getElementById('container_Zooming_KitCollection');
                expect(targetElement == null).toBe(true);
                done();
            };
            chartObj.zoomSettings.toolbarItems = [];
            chartObj.loaded = loaded;
            chartObj.refresh();
        });

        it('Selection zooming - shown single item Reset', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                trigger.draganddropEvent(elem, 100, 100, 400, 400);
                resetElement = document.getElementById('container_Zooming_Reset');
                expect(resetElement != null).toBe(true);
                targetElement = document.getElementById('container_Zooming_KitCollection');
                expect(targetElement != null).toBe(true);
                path = targetElement.getAttribute('transform');
                expect(path == 'translate(759,47.25)' || path == 'translate(759,50.25)').toBe(true);
                done();
            };
            chartObj.zoomSettings.toolbarItems = ['Reset'];
            chartObj.loaded = loaded;
            chartObj.refresh();
        });

        it('Selection zooming - shown Reset and zoom', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                trigger.draganddropEvent(elem, 100, 100, 400, 400);
                resetElement = document.getElementById('container_Zooming_Zoom');
                expect(resetElement != null).toBe(true);
                targetElement = document.getElementById('container_Zooming_KitCollection');
                expect(targetElement != null).toBe(true);
                path = resetElement.getAttribute('transform');                
                expect(path == 'translate(31,8)' || path == 'translate(31,5)').toBe(true);
                done();
            };
            chartObj.zoomSettings.toolbarItems = ['Reset', 'Zoom'];
            chartObj.loaded = loaded;
            chartObj.refresh();
        });

        it('Selection zooming - shown Reset and pan', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                trigger.draganddropEvent(elem, 100, 100, 400, 400);
                resetElement = document.getElementById('container_Zooming_Pan');
                ;
                expect(resetElement != null).toBe(true);
                targetElement = document.getElementById('container_Zooming_KitCollection');
                expect(targetElement != null).toBe(true);
                path = resetElement.getAttribute('transform');
                    
                expect(path == 'translate(31,8)' || path == 'translate(31,5)').toBe(true);
                done();
            };
            chartObj.zoomSettings.toolbarItems = ['Reset', 'Pan'];
            chartObj.loaded = loaded;
            chartObj.refresh();
        });

        it('Selecting Pan button', (done: Function) => {
            chartObj.loaded = null;
            targetElement = document.getElementById('container_Zooming_Pan');
            trigger.mousedownEvent(targetElement, 0, 0, 5, 5);
            targetElement = document.getElementById('container_Zooming_Pan_2');
            expect(targetElement.getAttribute('fill') == '#ff4081').toBe(true);
            done();
        });

        it('Selection zooming - shown zoom in', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null
                targetElement = document.getElementById('container_Zooming_ZoomIn');
                expect(targetElement != null).toBe(true);
                expect(targetElement.getAttribute('opacity') == '0.2').toBe(true);
                done();
            };
            chartObj.zoomSettings.toolbarItems = ['Reset', 'Pan', 'ZoomIn'];
            chartObj.loaded = loaded;
            chartObj.dataBind();
        });

        it('Selection zooming - shown zoom out', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                targetElement = document.getElementById('container_Zooming_ZoomOut');
                expect(targetElement != null).toBe(true);
                expect(targetElement.getAttribute('opacity') == '0.2').toBe(true);
                done();
            };
            chartObj.zoomSettings.toolbarItems = [
                'Reset',
                'Pan',
                'ZoomIn',
                'ZoomOut',
                'Zoom'
            ];
            chartObj.loaded = loaded;
            chartObj.dataBind();
        });
        it('Selection zooming - Clicking zoom Button', (done: Function) => {
            chartObj.loaded = null;
            targetElement = document.getElementById('container_Zooming_Zoom_3');
            path = targetElement.getAttribute('fill');
            trigger.mousedownEvent(document.getElementById('container_Zooming_Zoom'), 0, 0, 5, 5);
            targetElement = document.getElementById('container_Zooming_Zoom_3');
            expect(targetElement.getAttribute('fill') == '#ff4081').toBe(true);
            targetElement = document.getElementById('container_Zooming_Pan_2');
            expect(targetElement.getAttribute('fill') == path).toBe(true);
            done();
        });

        it('Checking Tooltip - Zoom Kit', (done: Function) => {
            chartObj.loaded = null;
            targetElement = document.getElementById('container_Zooming_KitCollection');
            trigger.mousemoveEvent(targetElement, 0, 0, 5, 5);
            expect(targetElement.getAttribute('opacity') != '0.1').toBe(true);
            done();
        });
        it('Checking tooltip div', () => {
            trigger.draganddropEvent(elem, 100, 100, 400, 400);
            targetElement = document.getElementById('container_Zooming_KitCollection');
            trigger.mousemoveEvent(targetElement, 0, 0, 5, 5);
            targetElement = document.getElementById('container_Zooming_Zoom');
            trigger.mouseoverEvent(targetElement);
            expect(document.getElementById('EJ2_Chart_ZoomTip') != null);
            trigger.mouseoutEvent(targetElement);
        });

        it('Checking zoom Tooltip text', (done: Function) => {
            chartObj.loaded = null;
            targetElement = document.getElementById('container_Zooming_KitCollection');
            trigger.mousemoveEvent(targetElement, 0, 0, 5, 5);
            targetElement = document.getElementById('container_Zooming_Zoom');
            trigger.mouseoverEvent(targetElement);
            firstElement = document.getElementById('EJ2_Chart_ZoomTip');
            expect(firstElement != null).toBe(true);
            expect(firstElement.textContent.indexOf('Zoom') == 1).toBe(true);
            trigger.mouseoutEvent(targetElement);
            firstElement = document.getElementById('EJ2_Chart_ZoomTip');
            expect(firstElement == null).toBe(true);
            done();
        });

        it('Checking pan Tooltip text', (done: Function) => {
            chartObj.loaded = null;
            targetElement = document.getElementById('container_Zooming_KitCollection');
            trigger.mousemoveEvent(targetElement, 0, 0, 5, 5);
            targetElement = document.getElementById('container_Zooming_Pan');
            trigger.mouseoverEvent(targetElement);
            firstElement = document.getElementById('EJ2_Chart_ZoomTip');
            expect(firstElement != null).toBe(true);
            expect(firstElement.textContent.indexOf('Pan') == 1).toBe(true);
            trigger.mouseoutEvent(targetElement);
            firstElement = document.getElementById('EJ2_Chart_ZoomTip');
            expect(firstElement == null).toBe(true);
            done();
        });

        it('Checking ZoomIn Tooltip text', (done: Function) => {
            chartObj.loaded = null;
            targetElement = document.getElementById('container_Zooming_KitCollection');
            trigger.mousemoveEvent(targetElement, 0, 0, 5, 5);
            targetElement = document.getElementById('container_Zooming_ZoomIn');
            trigger.mouseoverEvent(targetElement);
            firstElement = document.getElementById('EJ2_Chart_ZoomTip');
            expect(firstElement != null).toBe(true);
            expect(firstElement.textContent.indexOf('ZoomIn') == 1).toBe(true);
            trigger.mouseoutEvent(targetElement);
            firstElement = document.getElementById('EJ2_Chart_ZoomTip');
            expect(firstElement == null).toBe(true);
            done();
        });

        it('Checking ZoomOut Tooltip text', (done: Function) => {
            chartObj.loaded = null;
            targetElement = document.getElementById('container_Zooming_KitCollection');
            trigger.mousemoveEvent(targetElement, 0, 0, 5, 5);
            targetElement = document.getElementById('container_Zooming_ZoomOut');
            trigger.mouseoverEvent(targetElement);
            firstElement = document.getElementById('EJ2_Chart_ZoomTip');
            expect(firstElement != null).toBe(true);
            expect(firstElement.textContent.indexOf('ZoomOut') == 1).toBe(true);
            trigger.mouseoutEvent(targetElement);
            firstElement = document.getElementById('EJ2_Chart_ZoomTip');
            expect(firstElement == null).toBe(true);
            done();
        });

        it('Checking Reset Tooltip text', (done: Function) => {
            chartObj.loaded = null;
            targetElement = document.getElementById('container_Zooming_KitCollection');
            trigger.mousemoveEvent(targetElement, 0, 0, 5, 5);
            targetElement = document.getElementById('container_Zooming_Reset');
            trigger.mouseoverEvent(targetElement);
            firstElement = document.getElementById('EJ2_Chart_ZoomTip');
            expect(firstElement != null).toBe(true);
            expect(firstElement.textContent.indexOf('Reset') == 1).toBe(true);
            trigger.mouseoutEvent(targetElement);
            firstElement = document.getElementById('EJ2_Chart_ZoomTip');
            expect(firstElement == null).toBe(true);
            done();
        });
    });

    describe('Checking Panning', () => {
        let elem: HTMLElement = createElement('div', { id: 'container' });
        beforeAll(() => {
            document.body.appendChild(elem);
            chartObj = new Chart(
                {
                    primaryXAxis: { title: 'PrimaryXAxis', valueType: 'Category' },
                    primaryYAxis: { title: 'PrimaryYAxis', labelFormat: 'n1', rangePadding: 'None' },
                    series: [{
                        type: 'Area',
                        dataSource: categoryData, xName: 'x', yName: 'y', animation: { enable: false },
                        name: 'ChartSeriesNameGold', fill: '#A569BD',
                        marker: {
                            visible: true, width: 10, height: 10, dataLabel: { visible: false, fill: '' }
                        }
                    }, {
                        type: 'Line', width: 4,
                        dataSource: categoryData1, xName: 'x', yName: 'y', animation: { enable: false },
                        name: 'ChartSeriesNameGold', fill: '#F5B041',
                        marker: {
                            visible: true, width: 10, height: 10, dataLabel: { visible: false, fill: '' }
                        }
                    }],
                    title: 'Chart TS Title',
                    legendSettings: { visible: true },
                    width: '800',
                    zoomSettings: { enablePinchZooming: true, enableSelectionZooming: true }
                });
            chartObj.appendTo('#container');


        });
        afterAll((): void => {
            chartObj.destroy();
            elem.remove();
        });

        it('Checking Pan Button', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                trigger.draganddropEvent(elem, 100, 100, 400, 400);
                resetElement = document.getElementById('container_Zooming_Reset');
                expect(resetElement != null).toBe(true);
                targetElement = document.getElementById('container_Zooming_KitCollection');
                expect(targetElement.childNodes.length == 8).toBe(true);
                targetElement = document.getElementById('container_Zooming_Pan');
                trigger.mousedownEvent(targetElement, 0, 0, 5, 5);
                targetElement = document.getElementById('container_Zooming_Pan_2');
                expect(targetElement.getAttribute('fill') == '#ff4081').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });

        it('Checking chart cursor', (done: Function) => {
            chartObj.loaded = null;
            targetElement = document.getElementById('container_svg');
            firstElement = document.getElementById('container_Zooming_KitCollection');
            expect(targetElement.getAttribute('cursor') == 'pointer').toBe(true);
            expect(firstElement.getAttribute('cursor') == 'auto').toBe(true);
            done();
        });

        it('Checking chart cursor default', (done: Function) => {
            chartObj.loaded = null;
            resetElement = document.getElementById('container_Zooming_Reset');
            trigger.mousedownEvent(resetElement, 0, 0, 5, 5);
            targetElement = document.getElementById('container_svg');
            expect(targetElement.getAttribute('cursor') == 'auto').toBe(true);
            done();
        });

        it('Checking Pan', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                trigger.draganddropEvent(elem, 100, 100, 400, 400);
                targetElement = document.getElementById('container_Zooming_Pan');
                trigger.mousedownEvent(targetElement, 0, 0, 5, 5);
                trigger.draganddropEvent(elem, 400, 200, -200, 200);
                content = chartObj.primaryXAxis.zoomFactor.toFixed(2);
                expect(content == '0.41' || content == '0.42').toBe(true);
                content = chartObj.primaryYAxis.zoomFactor.toFixed(2);
                expect(content == '0.84' || content == '0.85').toBe(true);
                content = chartObj.primaryXAxis.zoomPosition.toFixed(2);
                expect(content == '0.38').toBe(true);
                expect(chartObj.primaryYAxis.zoomPosition == 0).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });

        it('Checking Pan with mode X', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                trigger.draganddropEvent(elem, 100, 100, 400, 400);
                targetElement = document.getElementById('container_Zooming_Pan');
                trigger.mousedownEvent(targetElement, 0, 0, 5, 5);
                trigger.draganddropEvent(elem, 400, 200, -200, 200);
                content = chartObj.primaryXAxis.zoomFactor.toFixed(2);
                expect(content == '0.41' || content == '0.42').toBe(true);
                expect(chartObj.primaryXAxis.zoomPosition.toFixed(2) == '0.55').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.zoomSettings.mode = 'X';
            chartObj.dataBind();
        });

        it('Checking Pan with mode Y', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                trigger.draganddropEvent(elem, 100, 100, 400, 400);
                targetElement = document.getElementById('container_Zooming_Pan');
                trigger.mousedownEvent(targetElement, 0, 0, 5, 5);
                trigger.draganddropEvent(elem, 400, 200, -200, 200);
                expect(chartObj.primaryYAxis.zoomFactor.toFixed(2) == '0.84' ||
                       chartObj.primaryYAxis.zoomFactor.toFixed(2) == '0.85').toBe(true);
                expect(chartObj.primaryYAxis.zoomPosition.toFixed(2) == '0.16' ||
                       chartObj.primaryYAxis.zoomPosition.toFixed(2) == '0.15').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.zoomSettings.mode = 'Y';
            chartObj.dataBind();
        });

        it('Checking Pan with bar', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                chartObj.zoomSettings.mode = 'XY';
                trigger.draganddropEvent(elem, 101, 100, 400, 400);
                targetElement = document.getElementById('container_Zooming_Pan');
                trigger.mousedownEvent(targetElement, 0, 0, 5, 5);
                trigger.draganddropEvent(elem, 400, 200, -200, 200);
                expect(chartObj.primaryYAxis.zoomFactor.toFixed(2) != '1').toBe(true);
                expect(chartObj.primaryYAxis.zoomPosition.toFixed(2) != '1').toBe(true);
                done();
            };
            chartObj.series[0].type = 'Bar';
            chartObj.series[1].type = 'Bar';
            chartObj.loaded = loaded;
            chartObj.refresh();
        });

        it('Checking Pan axis Labels start and end', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                trigger.draganddropEvent(elem, 100, 100, 400, 400);
                targetElement = document.getElementById('container_Zooming_Pan');
                trigger.mousedownEvent(targetElement, 0, 0, 5, 5);
                trigger.dragEvent(elem, 400, 200, -200, 200);
                expect(document.getElementById('container_Zoom_0_AxisLabel_0').textContent == 'Germany').toBe(true);
                //expect(document.getElementById('container_Zoom_1_AxisLabel_0').textContent == '34.701').toBe(true);
                resetElement = document.getElementById('container_Zooming_Reset');
                expect(resetElement != null).toBe(true);
                trigger.mousedownEvent(resetElement, 0, 0, 5, 5);
                done();
            };
            chartObj.series[0].type = 'Area';
            chartObj.series[1].type = 'Line';
            chartObj.loaded = loaded;
            chartObj.refresh();
        });

        it('Checking deferred panning', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                trigger.draganddropEvent(elem, 100, 100, 650, 500);
                targetElement = document.getElementById('container_Zooming_Pan');
                trigger.mousedownEvent(targetElement, 0, 0, 5, 5);
                trigger.dragEvent(elem, 400, 200, -200, 200);
                         
                  
                   
                     
                expect(chartObj.primaryXAxis.zoomFactor.toFixed(1) == '0.8').toBe(true);
                expect(chartObj.primaryYAxis.zoomFactor.toFixed(1) == '0.8').toBe(true);
                expect(chartObj.primaryXAxis.zoomPosition.toFixed(1) == '0.2').toBe(true);
                expect(chartObj.primaryYAxis.zoomPosition == 0).toBe(true);
                trigger.mouseupEvent(elem, 400, 200, -200, 200);
                         
                  
                   
                     
                expect(chartObj.primaryXAxis.zoomFactor.toFixed(1) == '0.8').toBe(true);
                expect(chartObj.primaryYAxis.zoomFactor.toFixed(1) == '0.8').toBe(true);
                expect(chartObj.primaryXAxis.zoomPosition.toFixed(1) == '0.2').toBe(true);
                expect(chartObj.primaryYAxis.zoomPosition == 0).toBe(true);
                resetElement = document.getElementById('container_Zooming_Reset');
                expect(resetElement != null).toBe(true);
                trigger.mousedownEvent(resetElement, 0, 0, 5, 5);
                done();
            };
            chartObj.zoomSettings.enableDeferredZooming = false;
            chartObj.loaded = loaded;
            chartObj.dataBind();
        });
        it('Checking touch panning', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                trigger.draganddropEvent(elem, 100, 100, 450, 400);
                targetElement = document.getElementById('container_Zooming_Pan');
                trigger.mousedownEvent(targetElement, 0, 0, 5, 5);
                targetElement = document.getElementById('container_ChartAreaBorder');
                chartObj.chartOnMouseDown(<PointerEvent>trigger.onTouchStart(targetElement, 608, 189, null, null, 504, 289));
                chartObj.mouseMove(<PointerEvent>trigger.onTouchMove(targetElement, 728, 389, null, null, 404, 189));
                chartObj.mouseEnd(<PointerEvent>trigger.onTouchEnd(targetElement, 728, 389, null, null, 404, 189));
                content = chartObj.primaryXAxis.zoomFactor.toFixed(2);
                expect(content == '0.48' || content == '0.49').toBe(true);
                expect(chartObj.primaryYAxis.zoomFactor.toFixed(2) == '0.84' ||
                       chartObj.primaryYAxis.zoomFactor.toFixed(2) == '0.85').toBe(true);
                content = chartObj.primaryXAxis.zoomPosition.toFixed(2);
                expect(content == '0.11' || content == '0.10').toBe(true);
                expect(chartObj.primaryYAxis.zoomPosition == 0).toBe(true);
                resetElement = document.getElementById('container_Zooming_Reset');
                expect(resetElement != null).toBe(true);
                trigger.mousedownEvent(resetElement, 0, 0, 5, 5);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Checking deferred panning with outside of the area', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                trigger.draganddropEvent(elem, 100, 100, 450, 400);
                targetElement = document.getElementById('container_Zooming_Pan');
                trigger.mousedownEvent(targetElement, 0, 0, 5, 5);
                trigger.dragEvent(elem, 400, 200, -200, 1200);
                expect(chartObj.primaryXAxis.zoomFactor.toFixed(1) == '0.5').toBe(true);
                expect(chartObj.primaryYAxis.zoomFactor.toFixed(1) == '0.8').toBe(true);
                expect(chartObj.primaryXAxis.zoomPosition.toFixed(1) == '0.4').toBe(true);
                expect(chartObj.primaryYAxis.zoomPosition.toFixed(1) == '0.2').toBe(true);
                resetElement = document.getElementById('container_Zooming_Reset');
                expect(resetElement != null).toBe(true);
                trigger.mousedownEvent(resetElement, 0, 0, 5, 5);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Checking Panning with datetime axis', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                trigger.draganddropEvent(elem, 100, 100, 400, 400);
                content = chartObj.primaryXAxis.zoomFactor.toFixed(2);
                expect(content == '0.41' || content == '0.42').toBe(true);
                content = chartObj.primaryYAxis.zoomFactor.toFixed(2);
                expect(content == '0.84' || content == '0.85').toBe(true);
                content = chartObj.primaryXAxis.zoomPosition.toFixed(2);
                expect(content == '0.04' || content == '0.03').toBe(true);
                expect(chartObj.primaryYAxis.zoomPosition == 0).toBe(true);
                targetElement = document.getElementById('container_Zooming_Pan');
                trigger.mousedownEvent(targetElement, 0, 0, 5, 5);
                trigger.dragEvent(elem, 400, 200, -200, 200);
                expect(document.getElementById('container_Zoom_0_AxisLabel_0') == null).toBe(true);
                content = chartObj.primaryXAxis.zoomFactor.toFixed(2);
                expect(content == '0.41'  || content == '0.42').toBe(true);
                content = chartObj.primaryYAxis.zoomFactor.toFixed(2);
                expect(content == '0.84' || content == '0.85').toBe(true);
                content = chartObj.primaryXAxis.zoomPosition.toFixed(2);
                expect(content == '0.38').toBe(true);
                expect(chartObj.primaryYAxis.zoomPosition == 0).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series = [{
                type: 'Column',
                dataSource: datetimeData, xName: 'x', yName: 'y', animation: { enable: false },
                name: 'ChartSeriesNameGold', fill: '#A569BD',
                marker: {
                    visible: true, width: 10, height: 10, dataLabel: { visible: false, fill: '' }
                }
            }];
            chartObj.primaryXAxis.valueType = 'DateTime';
            chartObj.zoomSettings.enableDeferredZooming = false;
            chartObj.refresh();
        });
    });

    describe('Checking zoomIn and zoomOut', () => {
        let elem: HTMLElement = createElement('div', { id: 'container' });
        beforeAll(() => {
            document.body.appendChild(elem);
            chartObj = new Chart(
                {
                    primaryXAxis: { title: 'PrimaryXAxis', valueType: 'DateTime' },
                    primaryYAxis: { title: 'PrimaryYAxis', labelFormat: 'n1', rangePadding: 'None' },
                    series: [{
                        type: 'Column',
                        dataSource: datetimeData, xName: 'x', yName: 'y', animation: { enable: false },
                        name: 'ChartSeriesNameGold', fill: '#A569BD',
                        marker: {
                            visible: true, width: 10, height: 10, dataLabel: { visible: false, fill: '' }
                        }
                    }, {
                        type: 'Column', width: 4,
                        dataSource: datetimeData, xName: 'x', yName: 'y', animation: { enable: false },
                        name: 'ChartSeriesNameGold', fill: '#F5B041',
                        marker: {
                            visible: true, width: 10, height: 10, dataLabel: { visible: false, fill: '' }
                        }
                    }],
                    title: 'Chart TS Title',
                    legendSettings: { visible: true },
                    width: '600',
                    zoomSettings: { enablePinchZooming: true, enableSelectionZooming: true }
                });
            chartObj.appendTo('#container');


        });
        afterAll((): void => {
            chartObj.destroy();
            elem.remove();
        });

        it('Checking default zooming ', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                trigger.draganddropEvent(elem, 100, 100, 600, 800);
                resetElement = document.getElementById('container_Zooming_Reset');
                expect(resetElement != null).toBe(true);
                targetElement = document.getElementById('container_Zooming_KitCollection');
                expect(targetElement != null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });

        it('Checking ZoomIn ', (done: Function) => {
            chartObj.loaded = null;
            targetElement = document.getElementById('container_Zooming_ZoomIn');
            content = chartObj.primaryXAxis.zoomFactor.toFixed(2);
            expect(content == '0.94' || content == '0.95').toBe(true);
            content = chartObj.primaryYAxis.zoomFactor.toFixed(2);
            expect(content == '0.84' || content == '0.85').toBe(true);
            content = chartObj.primaryXAxis.zoomPosition.toFixed(2);
            
            expect(content == '0.06' || content == '0.05').toBe(true);
            content = chartObj.primaryYAxis.zoomPosition.toFixed(2);
            expect(content == '0.00').toBe(true);
            trigger.mousedownEvent(targetElement, 0, 0, 5, 5);

            content = chartObj.primaryXAxis.zoomFactor.toFixed(2);
            
            expect(content == '0.76' || content == '0.77').toBe(true);
            content = chartObj.primaryYAxis.zoomFactor.toFixed(2);
            expect(content == '0.70').toBe(true);
            content = chartObj.primaryXAxis.zoomPosition.toFixed(2);
            
            expect(content == '0.15' || content == '0.14').toBe(true);
            content = chartObj.primaryYAxis.zoomPosition.toFixed(2);
            expect(content == '0.07').toBe(true);
            resetElement = document.getElementById('container_Zooming_Reset');
            expect(resetElement != null).toBe(true);
            trigger.mousedownEvent(resetElement, 0, 0, 5, 5);
            done();
        });

        it('Checking ZoomOut ', (done: Function) => {
            chartObj.loaded = null;
            trigger.draganddropEvent(elem, 100, 100, 600, 800);
            targetElement = document.getElementById('container_Zooming_ZoomOut');
            content = chartObj.primaryXAxis.zoomFactor.toFixed(2);
            
            expect(content == '0.94' || content == '0.95').toBe(true);
            content = chartObj.primaryYAxis.zoomFactor.toFixed(2);
            expect(content == '0.84' || content == '0.85').toBe(true);
            content = chartObj.primaryXAxis.zoomPosition.toFixed(2);
            
            expect(content == '0.06' || content == '0.05').toBe(true);
            content = chartObj.primaryYAxis.zoomPosition.toFixed(2);
            expect(content == '0.00').toBe(true);

            trigger.mousedownEvent(targetElement, 0, 0, 5, 5);
            expect(chartObj.primaryXAxis.zoomFactor == 1).toBe(true);
            expect(chartObj.primaryYAxis.zoomFactor == 1).toBe(true);
            expect(chartObj.primaryXAxis.zoomPosition == 0).toBe(true);
            expect(chartObj.primaryYAxis.zoomPosition == 0).toBe(true);
            done();
        });
    });

    describe('Checking mode', () => {
        let elem: HTMLElement = createElement('div', { id: 'container' });
        let factor: number;
        beforeAll(() => {
            document.body.appendChild(elem);
            chartObj = new Chart(
                {
                    primaryXAxis: { title: 'PrimaryXAxis', valueType: 'DateTime' },
                    primaryYAxis: { title: 'PrimaryYAxis', labelFormat: 'n1', rangePadding: 'None' },
                    series: [{
                        type: 'Column',
                        dataSource: datetimeData, xName: 'x', yName: 'y', animation: { enable: false },
                        name: 'Silver', fill: '#A569BD',
                        marker: {
                            visible: true, width: 10, height: 10, dataLabel: { visible: false, fill: '' }
                        }
                    }, {
                        type: 'Column', width: 4,
                        dataSource: datetimeData, xName: 'x', yName: 'y', animation: { enable: false },
                        name: 'Gold', fill: '#F5B041',
                        marker: {
                            visible: true, width: 10, height: 10, dataLabel: { visible: false, fill: '' }
                        }
                    }],
                    title: 'Chart TS Title',
                    legendSettings: { visible: true },
                    width: '900',
                    zoomSettings: { enableSelectionZooming: true, mode: 'X', enablePinchZooming: true }
                });
            chartObj.appendTo('#container');


        });
        afterAll((): void => {
            chartObj.destroy();
            elem.remove();
        });


        it('Checking zoom in while panning ', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                trigger.draganddropEvent(elem, 100, 100, 600, 800);
                factor = chartObj.primaryXAxis.zoomFactor;
                targetElement = document.getElementById('container_Zooming_Pan');
                trigger.mousedownEvent(targetElement, 0, 0, 5, 5);
                targetElement = document.getElementById('container_Zooming_ZoomIn');
                trigger.mousedownEvent(targetElement, 0, 0, 5, 5);
                trigger.mousedownEvent(targetElement, 0, 0, 5, 5);
                trigger.mousedownEvent(targetElement, 0, 0, 5, 5);
                trigger.mousedownEvent(targetElement, 0, 0, 5, 5);
                trigger.mousedownEvent(targetElement, 0, 0, 5, 5);
                expect(chartObj.primaryXAxis.zoomFactor == factor).toBe(true);
                resetElement = document.getElementById('container_Zooming_Reset');
                expect(resetElement != null).toBe(true);
                trigger.mousedownEvent(resetElement, 0, 0, 5, 5);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });

        it('Checking zoom in with mode X ', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                trigger.draganddropEvent(elem, 100, 100, 600, 800);
                targetElement = document.getElementById('container_Zooming_ZoomIn');
                expect(chartObj.primaryYAxis.zoomPosition == 0).toBe(true);
                trigger.mousedownEvent(targetElement, 0, 0, 5, 5);
                trigger.mousedownEvent(targetElement, 0, 0, 5, 5);
                trigger.mousedownEvent(targetElement, 0, 0, 5, 5);
                trigger.mousedownEvent(targetElement, 0, 0, 5, 5);
                trigger.mousedownEvent(targetElement, 0, 0, 5, 5);
                trigger.mousedownEvent(targetElement, 0, 0, 5, 5);
                
                expect(chartObj.primaryXAxis.zoomFactor.toFixed(2) == '0.32').toBe(true);
                
                expect(chartObj.primaryYAxis.zoomFactor.toFixed(2) == '1.00').toBe(true);
                
                content = chartObj.primaryXAxis.zoomPosition.toFixed(2);
                expect(content == '0.18' || content == '0.17').toBe(true);
                
                expect(chartObj.primaryYAxis.zoomPosition == 0).toBe(true);
                resetElement = document.getElementById('container_Zooming_Reset');
                expect(resetElement != null).toBe(true);
                trigger.mousedownEvent(resetElement, 0, 0, 5, 5);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Checking zoom in with mode Y ', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                trigger.draganddropEvent(elem, 100, 100, 600, 800);
                targetElement = document.getElementById('container_Zooming_ZoomIn');
                expect(chartObj.primaryYAxis.zoomPosition == 0).toBe(true);
                trigger.mousedownEvent(targetElement, 0, 0, 5, 5);
                trigger.mousedownEvent(targetElement, 0, 0, 5, 5);
                trigger.mousedownEvent(targetElement, 0, 0, 5, 5);
                trigger.mousedownEvent(targetElement, 0, 0, 5, 5);
                trigger.mousedownEvent(targetElement, 0, 0, 5, 5);
                trigger.mousedownEvent(targetElement, 0, 0, 5, 5);
                expect(chartObj.primaryXAxis.zoomFactor.toFixed(2) == '1.00').toBe(true);
                expect(chartObj.primaryYAxis.zoomFactor.toFixed(2) == '0.37').toBe(true);
                expect(chartObj.primaryXAxis.zoomPosition.toFixed(2) == '0.00').toBe(true);
                expect(chartObj.primaryYAxis.zoomPosition.toFixed(2) == '0.24').toBe(true);
                done();
            };
            chartObj.zoomSettings.mode = 'Y';
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
    });


    describe('Checking Mouse Wheel', () => {
        let elem: HTMLElement = createElement('div', { id: 'container' });
        let wheelArgs: wheel;
        beforeAll(() => {
            document.body.appendChild(elem);
            chartObj = new Chart(
                {
                    primaryXAxis: { title: 'PrimaryXAxis', valueType: 'DateTime' },
                    primaryYAxis: { title: 'PrimaryYAxis', labelFormat: 'n1', rangePadding: 'None' },
                    series: [{
                        type: 'Line',
                        dataSource: datetimeData, xName: 'x', yName: 'y', animation: { enable: false },
                        name: 'Silver', fill: '#A569BD'
                    }],
                    zoomSettings: { enableSelectionZooming: true, enablePinchZooming: true },
                    width: '900',
                    height: '400'
                });
            chartObj.appendTo('#container');


        });
        afterAll((): void => {
            chartObj.destroy();
            elem.remove();
        });

        it('Checking mouse wheel as false ', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                wheelArgs = {
                    preventDefault: prevent,
                    wheelDelta: 120,
                    detail: 3,
                    clientX: 210,
                    clientY: 100
                };
                chartObj.zoomModule.chartMouseWheel(<WheelEvent>wheelArgs);
                expect(chartObj.primaryXAxis.zoomFactor == 1).toBe(true);
                expect(chartObj.primaryYAxis.zoomFactor == 1).toBe(true);
                expect(chartObj.primaryXAxis.zoomPosition == 0).toBe(true);
                expect(chartObj.primaryYAxis.zoomPosition == 0).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Checking mouse wheel as forward ', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                wheelArgs = {
                    preventDefault: prevent,
                    wheelDelta: 120,
                    detail: 3,
                    clientX: 210,
                    clientY: 100
                };
                chartObj.zoomModule.chartMouseWheel(<WheelEvent>wheelArgs);
                expect(chartObj.primaryXAxis.zoomFactor.toFixed(2) == '0.80').toBe(true);
                expect(chartObj.primaryYAxis.zoomFactor.toFixed(2) == '0.80').toBe(true);
                expect(chartObj.primaryXAxis.zoomPosition.toFixed(2) == '0.05').toBe(true);
                expect(chartObj.primaryYAxis.zoomPosition.toFixed(2) == '0.14').toBe(true);
                done();
            };
            chartObj.zoomSettings.enableMouseWheelZooming = true;
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Checking mouse wheel as backward ', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                wheelArgs = {
                    preventDefault: prevent,
                    wheelDelta: -120,
                    detail: 3,
                    clientX: 310,
                    clientY: 100
                };
                chartObj.zoomModule.chartMouseWheel(<WheelEvent>wheelArgs);
                expect(chartObj.primaryXAxis.zoomFactor == 1).toBe(true);
                expect(chartObj.primaryYAxis.zoomFactor == 1).toBe(true);
                expect(chartObj.primaryXAxis.zoomPosition == 0).toBe(true);
                expect(chartObj.primaryYAxis.zoomPosition == 0).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Checking mouse wheel with pointer as false with backward ', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                let isPointer: Boolean = chartObj.zoomModule.isPointer;
                let browserName: string = chartObj.zoomModule.browserName;
                chartObj.zoomModule.browserName = 'mozilla';
                chartObj.zoomModule.isPointer = false
                wheelArgs = {
                    preventDefault: prevent,
                    wheelDelta: -120,
                    detail: 3,
                    clientX: 410,
                    clientY: 100
                };
                chartObj.zoomModule.chartMouseWheel(<WheelEvent>wheelArgs);
                expect(chartObj.primaryXAxis.zoomFactor == 1).toBe(true);
                expect(chartObj.primaryYAxis.zoomFactor == 1).toBe(true);
                expect(chartObj.primaryXAxis.zoomPosition == 0).toBe(true);
                expect(chartObj.primaryYAxis.zoomPosition == 0).toBe(true);
                chartObj.zoomModule.isPointer = isPointer;
                chartObj.zoomModule.browserName = browserName;
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });

        it('Checking mouse wheel with pointer as false with forward ', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                let isPointer: Boolean = chartObj.zoomModule.isPointer;
                chartObj.zoomModule.isPointer = false
                let browserName: string = chartObj.zoomModule.browserName;
                chartObj.zoomModule.browserName = 'mozilla';
                wheelArgs = {
                    preventDefault: prevent,
                    wheelDelta: -120,
                    detail: -3,
                    clientX: 210,
                    clientY: 100
                };
                chartObj.zoomModule.chartMouseWheel(<WheelEvent>wheelArgs);
                expect(chartObj.primaryXAxis.zoomFactor.toFixed(2) == '0.80').toBe(true);
                expect(chartObj.primaryYAxis.zoomFactor.toFixed(2) == '0.80').toBe(true);
                expect(chartObj.primaryXAxis.zoomPosition.toFixed(2) == '0.05').toBe(true);
                expect(chartObj.primaryYAxis.zoomPosition.toFixed(2) == '0.14').toBe(true);
                chartObj.zoomModule.isPointer = isPointer;
                chartObj.zoomModule.browserName = browserName;
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Checking mouse wheel as forward with mode x ', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                wheelArgs = {
                    preventDefault: prevent,
                    wheelDelta: 120,
                    detail: 3,
                    clientX: 210,
                    clientY: 100
                };
                chartObj.zoomModule.chartMouseWheel(<WheelEvent>wheelArgs);
                expect(chartObj.primaryXAxis.zoomFactor.toFixed(2) == '0.67').toBe(true);
                expect(chartObj.primaryYAxis.zoomFactor.toFixed(2) == '0.80').toBe(true);
                expect(chartObj.primaryXAxis.zoomPosition.toFixed(2) == '0.08').toBe(true);
                expect(chartObj.primaryYAxis.zoomPosition.toFixed(2) == '0.14').toBe(true);
                done();
            };
            chartObj.zoomSettings.mode = 'X';
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Checking mouse wheel as forward with mode y ', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                wheelArgs = {
                    preventDefault: prevent,
                    wheelDelta: 120,
                    detail: 3,
                    clientX: 210,
                    clientY: 100
                };
                chartObj.zoomModule.chartMouseWheel(<WheelEvent>wheelArgs);
                expect(chartObj.primaryXAxis.zoomFactor.toFixed(2) == '0.67').toBe(true);
                expect(chartObj.primaryYAxis.zoomFactor.toFixed(2) == '0.67').toBe(true);
                expect(chartObj.primaryXAxis.zoomPosition.toFixed(2) == '0.08').toBe(true);
                expect(chartObj.primaryYAxis.zoomPosition.toFixed(2) == '0.23').toBe(true);
                done();
            };
            chartObj.zoomSettings.mode = 'Y';
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Checking zooming toolkit', (done: Function) => {
            chartObj.loaded = null;
            targetElement = document.getElementById('container_Zooming_KitCollection');
            expect(targetElement.childNodes.length == 8).toBe(true);
            done();
        });
    });

    describe('Checking Pinch Zooming', () => {
        let elem: HTMLElement = createElement('div', { id: 'container' });
        let areaElement: Element;
        let wheelArgs: wheel;
        beforeAll(() => {
            document.body.appendChild(elem);
            chartObj = new Chart(
                {
                    primaryXAxis: { title: 'PrimaryXAxis', valueType: 'DateTime' },
                    primaryYAxis: { title: 'PrimaryYAxis', labelFormat: 'n1', rangePadding: 'None' },
                    series: [{
                        type: 'Line',
                        dataSource: datetimeData, xName: 'x', yName: 'y', animation: { enable: false },
                        name: 'Silver', fill: '#A569BD', marker: { visible: true, dataLabel: { visible: true } }
                    }],
                    zoomSettings: { enableSelectionZooming: true, enablePinchZooming: true },
                    width: '900',
                    height: '400'
                });
            chartObj.appendTo('#container');


        });
        afterAll((): void => {
            chartObj.destroy();
            elem.remove();
        });

        it('Checking pinch zooming with label', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                let touchStartArgs: Object;
                areaElement = document.getElementById('container_ChartAreaBorder');
                chartObj.chartOnMouseDown(<PointerEvent>trigger.onTouchStart(areaElement, 608, 189, 504, 289, 504, 289));
                chartObj.mouseMove(<PointerEvent>trigger.onTouchMove(areaElement, 728, 389, 404, 289, 404, 189));
                chartObj.mouseMove(<PointerEvent>trigger.onTouchMove(areaElement, 748, 129, 304, 289, 304, 289));
                content = chartObj.primaryXAxis.zoomFactor.toFixed(2);
                expect(content == '0.23').toBe(true);
                content = chartObj.primaryYAxis.zoomFactor.toFixed(2);
                expect(content == '0.63').toBe(true);
                content = chartObj.primaryXAxis.zoomPosition.toFixed(2);
                expect(content == '0.45' || content == '0.46').toBe(true);
                expect(document.getElementById('containerTextGroup0').getAttribute('visibility') == 'hidden').toBe(true);
                chartObj.mouseLeave(<PointerEvent>trigger.onTouchLeave(areaElement, 748, 129, 304, 289, 304, 289));
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Checking pinch pan enable and toolkit', (done: Function) => {
            chartObj.loaded = null;
            expect(chartObj.zoomModule.isPanning).toBe(true);
            targetElement = document.getElementById('container_Zooming_KitCollection');
            expect(targetElement.childNodes.length == 8).toBe(true);
            targetElement = document.getElementById('container_Zooming_Pan_2');
            expect(targetElement.getAttribute('fill') == '#ff4081').toBe(true);
            done();
        });
        it('Checking mouse hover and leave the toolkit', (done: Function) => {
            chartObj.loaded = null;
            targetElement = document.getElementById('container_Zooming_KitCollection');
            trigger.mousemoveEvent(targetElement, 0, 0, 5, 5);
            expect(targetElement.getAttribute('opacity') == '1').toBe(true);
            trigger.mouseLeaveEvent(targetElement);
            done();
        });
        it('Checking reset element double tap', (done: Function) => {
            chartObj.loaded = null;
            trigger.doDoubleTab(areaElement, 608, 189, 504, 289, 504, 289, chartObj);
            resetElement = document.getElementById('container_Zooming_Reset');
            expect(resetElement == null).toBe(true);
            expect(chartObj.primaryXAxis.zoomFactor == 1).toBe(true);
            expect(chartObj.primaryYAxis.zoomFactor == 1).toBe(true);
            done();
        });
        it('Checking reset element double tap outside of the area', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                trigger.draganddropEvent(elem, 100, 100, 600, 800);
                trigger.doDoubleTab(areaElement, 608, 189, 504, 325, 504, 325, chartObj);
                resetElement = document.getElementById('container_Zooming_Reset');
                expect(resetElement != null).toBe(true);
                expect(chartObj.primaryXAxis.zoomFactor != 1).toBe(true);
                expect(chartObj.primaryYAxis.zoomFactor != 1).toBe(true);
                trigger.doDoubleTab(areaElement, 608, 189, 504, 289, 504, 289, chartObj);
                resetElement = document.getElementById('container_Zooming_Reset');
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Checking pinch zooming with mode X', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                let touchStartArgs: Object;
                areaElement = document.getElementById('container_ChartAreaBorder');
                chartObj.chartOnMouseDown(<PointerEvent>trigger.onTouchStart(areaElement, 608, 189, 504, 289, 504, 289));
                chartObj.mouseMove(<PointerEvent>trigger.onTouchMove(areaElement, 728, 389, 404, 289, 404, 189));
                chartObj.mouseMove(<PointerEvent>trigger.onTouchMove(areaElement, 748, 129, 304, 289, 304, 289));
                content = chartObj.primaryXAxis.zoomFactor.toFixed(2);
                expect(content == '0.23').toBe(true);
                content = chartObj.primaryYAxis.zoomFactor.toFixed(2);
                expect(content == '1.00').toBe(true);
                content = chartObj.primaryXAxis.zoomPosition.toFixed(2);
                expect(content == '0.45' || content == '0.46').toBe(true);
                content = chartObj.primaryYAxis.zoomPosition.toFixed(2);
                expect(content == '0.00').toBe(true);
                chartObj.mouseLeave(<PointerEvent>trigger.onTouchLeave(areaElement, 748, 129, 304, 289, 304, 289));
                trigger.doDoubleTab(areaElement, 608, 189, 504, 289, 504, 289, chartObj);
                done();
            };
            chartObj.zoomSettings.mode = 'X';
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Checking pinch zooming with mode Y', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                let touchStartArgs: Object;
                areaElement = document.getElementById('container_ChartAreaBorder');
                chartObj.chartOnMouseDown(<PointerEvent>trigger.onTouchStart(areaElement, 608, 189, 504, 289, 504, 289));
                chartObj.mouseMove(<PointerEvent>trigger.onTouchMove(areaElement, 728, 389, 404, 289, 404, 189));
                chartObj.mouseMove(<PointerEvent>trigger.onTouchMove(areaElement, 748, 129, 304, 289, 304, 289));
                content = chartObj.primaryXAxis.zoomFactor.toFixed(2);

                expect(content == '1.00').toBe(true);
                content = chartObj.primaryYAxis.zoomFactor.toFixed(2);

                expect(content == '0.63').toBe(true);
                content = chartObj.primaryXAxis.zoomPosition.toFixed(2);

                expect(content == '0.00').toBe(true);
                content = chartObj.primaryYAxis.zoomPosition.toFixed(2);

                expect(content == '0.04' || content == '0.03').toBe(true);
                expect(document.getElementById('container_Zoom_0_AxisLabel_0') == null).toBe(true);
                expect(document.getElementById('container_Zoom_0_AxisLabel_1') == null).toBe(true);
                content = document.getElementById('container_Zoom_1_AxisLabel_0').textContent;

                expect(content == '13.0' || content == '12.9' || content == '12.5').toBe(true);
                content = document.getElementById('container_Zoom_1_AxisLabel_1').textContent;

                expect(content == '63.0' || content == '62.9'|| content == '62.5').toBe(true);
                chartObj.mouseLeave(<PointerEvent>trigger.onTouchLeave(areaElement, 748, 129, 304, 289, 304, 289));
                trigger.doDoubleTab(areaElement, 608, 189, 504, 289, 504, 289, chartObj);
                done();
            };
            chartObj.zoomSettings.mode = 'Y';
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Checking pinch zooming toolkit in mobile device', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                let touchStartArgs: Object;
                areaElement = document.getElementById('container_ChartAreaBorder');
                chartObj.zoomModule.isDevice = true;
                chartObj.chartOnMouseDown(<PointerEvent>trigger.onTouchStart(areaElement, 608, 189, 504, 289, 504, 289));
                chartObj.mouseMove(<PointerEvent>trigger.onTouchMove(areaElement, 728, 389, 404, 289, 404, 189));
                chartObj.mouseMove(<PointerEvent>trigger.onTouchMove(areaElement, 748, 129, 304, 289, 304, 289));
                chartObj.mouseLeave(<PointerEvent>trigger.onTouchLeave(areaElement, 748, 129, 304, 289, 304, 289));
                resetElement = document.getElementById('container_Zooming_Reset');
                expect(resetElement != null).toBe(true);
                targetElement = document.getElementById('container_Zooming_KitCollection');
                expect(targetElement.childNodes.length == 4).toBe(true);
                chartObj.isTouch = true;
                trigger.doDoubleTab(areaElement, 608, 189, 504, 289, 504, 289, chartObj);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].marker.dataLabel.template = '<div>template</div>';
            chartObj.refresh();
        });
        it('Checking pinch zooming with Pointer_1', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                let touchStartArgs: Object;
                areaElement = document.getElementById('container_ChartAreaBorder');
                chartObj.chartOnMouseDown(<PointerEvent>trigger.onPointerStart(areaElement, 608, 189, 25));
                chartObj.chartOnMouseDown(<PointerEvent>trigger.onPointerStart(areaElement, 504, 289, 26));
                chartObj.mouseMove(<PointerEvent>trigger.onPointerMove(areaElement, 728, 389, 25));
                chartObj.mouseMove(<PointerEvent>trigger.onPointerMove(areaElement, 404, 289, 26));
                chartObj.mouseMove(<PointerEvent>trigger.onPointerMove(areaElement, 768, 399, 25));
                chartObj.mouseMove(<PointerEvent>trigger.onPointerMove(areaElement, 304, 289, 26));
                expect(document.getElementById('container_Zoom_1_AxisLabel_0').textContent !== null).toBe(true);
                chartObj.mouseLeave(<PointerEvent>trigger.onPointerLeave(areaElement, 768, 399, 25));
                chartObj.mouseLeave(<PointerEvent>trigger.onPointerLeave(areaElement, 304, 289, 26));
                trigger.doDoubleTab(areaElement, 608, 189, 504, 289, 504, 289, chartObj);
                done();
            };
            chartObj.zoomSettings.mode = 'XY';
            chartObj.loaded = loaded;
            chartObj.dataBind();
        });
        it('Checking pinch zooming with Pointer ', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                let touchStartArgs: Object;
                areaElement = document.getElementById('container_ChartAreaBorder');
                chartObj.chartOnMouseDown(<PointerEvent>trigger.onPointerStart(areaElement, 608, 189, 25));
                chartObj.chartOnMouseDown(<PointerEvent>trigger.onPointerStart(areaElement, 504, 289, 26));
                chartObj.mouseMove(<PointerEvent>trigger.onPointerMove(areaElement, 728, 389, 25));
                chartObj.mouseMove(<PointerEvent>trigger.onPointerMove(areaElement, 404, 289, 26));
                chartObj.mouseMove(<PointerEvent>trigger.onPointerMove(areaElement, 768, 399, 25));
                chartObj.mouseMove(<PointerEvent>trigger.onPointerMove(areaElement, 304, 289, 26));
                expect(document.getElementById('container_Zoom_1_AxisLabel_0') !== null).toBe(true);
                chartObj.mouseLeave(<PointerEvent>trigger.onPointerLeave(areaElement, 768, 399, 25));
                chartObj.mouseLeave(<PointerEvent>trigger.onPointerLeave(areaElement, 304, 289, 26));
                trigger.doDoubleTab(areaElement, 608, 189, 504, 289, 504, 289, chartObj);
                done();
            };
            chartObj.primaryXAxis.labelRotation = 90;
            chartObj.loaded = loaded;
            chartObj.refresh();
        });

        it('Checking pinch zooming with Pointer ', () => {
            chartObj.loaded = null;
            chartObj.zoomModule.isIOS = true;
            let touchStartArgs: Object;
            areaElement = document.getElementById('container_ChartAreaBorder');
            chartObj.chartOnMouseDown(<PointerEvent>trigger.onPointerStart(areaElement, 608, 189, 25));
            chartObj.chartOnMouseDown(<PointerEvent>trigger.onPointerStart(areaElement, 504, 289, 26));
            trigger.draganddropEvent(elem, 100, 100, 450, 400);
            targetElement = document.getElementById('container_Zooming_Pan');
            trigger.mousedownEvent(targetElement, 0, 0, 5, 5);
            targetElement = document.getElementById('container_ChartAreaBorder');
            chartObj.mouseMove(<PointerEvent>trigger.onPointerMove(areaElement, 728, 389, 25));
            chartObj.mouseMove(<PointerEvent>trigger.onPointerMove(areaElement, 404, 289, 26));
            chartObj.mouseMove(<PointerEvent>trigger.onTouchMove(targetElement, 768, 399, null, null, 404, 189));
            chartObj.mouseMove(<PointerEvent>trigger.onTouchMove(targetElement, 304, 289, null, null, 404, 189));
            expect(document.getElementById('container_Zooming_Zoom_3') !== null).toBe(true);
            chartObj.mouseLeave(<PointerEvent>trigger.onPointerLeave(areaElement, 768, 399, 25));
            chartObj.mouseLeave(<PointerEvent>trigger.onPointerLeave(areaElement, 304, 289, 26));
            trigger.doDoubleTab(areaElement, 608, 189, 504, 289, 504, 289, chartObj);
        });
    });
    describe('Checking touch and device ', () => {
        let elem: HTMLElement = createElement('div', { id: 'container' });
        beforeAll(() => {
            document.body.appendChild(elem);
            chartObj = new Chart(
                {
                    primaryYAxis: { rangePadding: 'None' },
                    series: [{
                        type: 'Line',
                        dataSource: data, xName: 'x', yName: 'y', animation: { enable: false },
                        name: 'ChartSeriesNameGold', fill: 'rgba(135,206,235,1)',
                        marker: {
                            visible: false
                        }
                    }],
                    title: 'Chart TS Title',
                    legendSettings: { visible: true },
                    width: '800',
                    zoomSettings: { enablePinchZooming: true, enableSelectionZooming: true }
                });
            chartObj.appendTo('#container');


        });
        afterAll((): void => {
            chartObj.destroy();
            elem.remove();
        });

        it('Checking touch', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                trigger.draganddropEvent(elem, 100, 100, 400, 400);
                resetElement = document.getElementById('container_Zooming_Reset');
                expect(resetElement != null).toBe(true);
                targetElement = document.getElementById('container_Zooming_KitCollection');
                expect(targetElement.childNodes.length == 8).toBe(true);
                chartObj.isTouch = true;
                targetElement = document.getElementById('container_Zooming_Zoom');
                trigger.mouseoverEvent(targetElement);
                trigger.mousedownEvent(resetElement, 0, 0, 5, 5);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Checking zooming with legend visibility', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                trigger.draganddropEvent(elem, 100, 100, 400, 400);
                resetElement = document.getElementById('container_Zooming_Reset');
                expect(resetElement != null).toBe(true);
                targetElement = document.getElementById('container_chart_legend_text_' + 0);
                trigger.clickEvent(targetElement);
                expect(chartObj.series[0].visible).toBe(false);
                targetElement = document.getElementById('container_Zooming_KitCollection');
                expect(targetElement.childNodes.length == 8).toBe(true);
                chartObj.isTouch = true;
                targetElement = document.getElementById('container_Zooming_Zoom');
                trigger.mouseoverEvent(targetElement);
                trigger.mousedownEvent(resetElement, 0, 0, 5, 5);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Checking touch resize event', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                expect(document.getElementById('container_svg').getAttribute('width') == '800').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.chartResize(<Event>{});
        });
        it('Checking touch resize event', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                expect(document.getElementById('container_svg').getAttribute('width') == '800').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.chartResize(<Event>{});
        });
    });

    describe('Checking zooming with enablePan', () => {
        let elem: HTMLElement = createElement('div', { id: 'container' });
        let factor: number;
        beforeAll(() => {
            document.body.appendChild(elem);
            chartObj = new Chart(
                {
                    primaryXAxis: { title: 'PrimaryXAxis', valueType: 'Double' },
                    primaryYAxis: { title: 'PrimaryYAxis' },
                    series: [{
                        dataSource: [{ x: 10, y: 46 }, { x: 20, y: 27 }, { x: 30, y: 26 }, { x: 40, y: 16 }, { x: 50, y: 31 }],
                        xName: 'x', yName: 'y', marker: { visible: true }, type: 'Line'
                    }],
                    title: 'Chart Title',
                    legendSettings: { visible: true },
                    width: '900',
                    zoomSettings: { enableSelectionZooming: true, enablePan: true }
                });
            chartObj.appendTo('#container');


        });
        afterAll((): void => {
            chartObj.destroy();
            elem.remove();
        });

        it('Defualt selection zoom with enablePan', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                trigger.draganddropEvent(elem, 200, 200, 350, 350);
                let panElementFill : string = document.getElementById('container_Zooming_Pan_2').getAttribute('fill');
                let zoomIconFill : string = document.getElementById('container_Zooming_Zoom_3').getAttribute('fill');
                let zoomInFill : string = document.getElementById('container_Zooming_ZoomIn_2').getAttribute('fill');
                let zoomOutFill : string = document.getElementById('container_Zooming_ZoomOut_2').getAttribute('fill');
                let zoomResetFill : string = document.getElementById('container_Zooming_Reset_2').getAttribute('fill');
                let seriesTransform : string = document.getElementById('containerSeriesGroup0').getAttribute('transform');
                expect(chartObj.zoomModule.isPanning).toBe(true);
                expect(panElementFill == '#ff4081').toBe(true);
                expect(zoomIconFill == '#737373').toBe(true);
                expect(zoomInFill == '#737373').toBe(true);
                expect(zoomOutFill == '#737373').toBe(true);
                expect(zoomResetFill == '#737373').toBe(true);
                expect(seriesTransform == 'translate(57.5,45.25)' || seriesTransform == 'translate(53.5,42.25)').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });

        it('Checking mouse wheel with enablePan ', (done: Function) => {
            let wheelArgs: wheel;
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                wheelArgs = {
                    preventDefault: prevent,
                    wheelDelta: 120,
                    detail: 3,
                    clientX: 210,
                    clientY: 100
                };
                chartObj.zoomModule.chartMouseWheel(<WheelEvent>wheelArgs);
                let panElementFill : string = document.getElementById('container_Zooming_Pan_2').getAttribute('fill');
                let zoomIconFill : string = document.getElementById('container_Zooming_Zoom_3').getAttribute('fill');
                let zoomInFill : string = document.getElementById('container_Zooming_ZoomIn_2').getAttribute('fill');
                let zoomOutFill : string = document.getElementById('container_Zooming_ZoomOut_2').getAttribute('fill');
                let zoomResetFill : string = document.getElementById('container_Zooming_Reset_2').getAttribute('fill');
                let seriesTransform : string = document.getElementById('containerSeriesGroup0').getAttribute('transform');
                
                expect(chartObj.zoomModule.isPanning).toBe(true);
                expect(panElementFill == '#ff4081').toBe(true);
                expect(zoomIconFill == '#737373').toBe(true);
                expect(zoomInFill == '#737373').toBe(true);
                expect(zoomOutFill == '#737373').toBe(true);
                expect(zoomResetFill == '#737373').toBe(true);
                expect(seriesTransform == 'translate(57.5,45.25)' || seriesTransform == 'translate(53.5,42.25)').toBe(true);
                done();
            };
            chartObj.zoomSettings.enableSelectionZooming = false;
            chartObj.zoomSettings.enableMouseWheelZooming = true;
            chartObj.primaryXAxis.zoomFactor = 1;
            chartObj.primaryXAxis.zoomPosition = 0;
            chartObj.primaryYAxis.zoomFactor = 1;
            chartObj.primaryYAxis.zoomPosition = 0;
            chartObj.loaded = loaded;
            chartObj.refresh();
        });

        it('Enable panning programatically with enablePan', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                trigger.draganddropEvent(elem, 100, 100, 400, 400);
                let panElement : Element = document.getElementById('container_Zooming_Pan_2');
                let zoomIcon : Element = document.getElementById('container_Zooming_Zoom_3');
                let zoomIn : Element = document.getElementById('container_Zooming_ZoomIn_2');
                let zoomOut : Element = document.getElementById('container_Zooming_ZoomOut_2');
                let zoomReset : Element = document.getElementById('container_Zooming_Reset_2');
                let seriesTransform : string = document.getElementById('containerSeriesGroup0').getAttribute('transform');
                expect(chartObj.zoomModule.isPanning).toBe(true);
                expect(panElement ).not.toBe(null);
                expect(zoomIcon).not.toBe(null);
                expect(zoomIn).not.toBe(null);
                expect(zoomOut).not.toBe(null);
                expect(zoomReset).not.toBe(null);
                expect(seriesTransform == 'translate(57.5,45.25)' || seriesTransform == 'translate(53.5,42.25)').toBe(true);
                done();
            };
            chartObj.zoomSettings.enableSelectionZooming = true;
            chartObj.zoomSettings.enableMouseWheelZooming = false;
            chartObj.primaryXAxis.zoomFactor = 0.4;
            chartObj.primaryXAxis.zoomPosition = 0.4;
            chartObj.primaryYAxis.zoomFactor = 0.4;
            chartObj.primaryYAxis.zoomPosition = 0.4;
            chartObj.series[0].type = 'Column';
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
    });
});