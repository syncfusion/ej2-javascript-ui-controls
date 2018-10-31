/**
 * Scrollbar spec document
 */

import { createElement } from '@syncfusion/ej2-base';
import { EmitType } from '@syncfusion/ej2-base';
import { Chart, MultiLevelLabel, Crosshair } from '../../../src/chart/index';
import { LineSeries } from '../../../src/chart/series/line-series';
import { ILoadedEventArgs } from '../../../src/common/model/interface';
import { ScrollBar } from '../../../src/common/scrollbar/scrollbar';
import { load } from '../../../src';
import { MouseEvents } from '../base/events.spec';

Chart.Inject(LineSeries, ScrollBar, MultiLevelLabel);

let trigger: MouseEvents = new MouseEvents();
describe('Scrollbar Chart', () => {
    let ele: HTMLElement;
    describe('Multiple Scrollbar', () => {
        let chartObj: Chart;
        let loaded: EmitType<ILoadedEventArgs>;
        let load: EmitType<ILoadedEventArgs>;
        beforeAll((): void => {
            ele = createElement('div', { id: 'container' });
            document.body.appendChild(ele);
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
                    zoomSettings: { enableSelectionZooming: true, enableScrollbar: true, mode: 'XY' }
                }
            );
            chartObj.appendTo('#container');

        })
        afterAll((): void => {
            chartObj.destroy();
            ele.remove();
        });

        it('Checking Svg Element Y Axis', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                trigger.draganddropEvent(ele, 200, 200, 350, 350);
                let scrollEle = document.getElementById('scrollBar_svgprimaryYAxis');
                expect(scrollEle.parentElement.id == 'container_scrollElement').toBe(true);
                expect(scrollEle != null).toBe(true);
                expect(scrollEle.getAttribute("width") == '16').toBe(true);
                expect(scrollEle.getAttribute("height") == '328.25' || scrollEle.getAttribute("height") == '335.25').toBe(true);
                expect(scrollEle.style.top == '45.25px' || scrollEle.style.top == '42.25px').toBe(true);
                expect(scrollEle.style.left == '57.5px' || scrollEle.style.left == '53.5px').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
       it('Checking svg element - X Axis', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                trigger.draganddropEvent(ele, 200, 200, 350, 350);
                let scrollEle = document.getElementById('scrollBar_svgprimaryXAxis');
                expect(scrollEle.parentElement.id == 'container_scrollElement').toBe(true);
                expect(scrollEle != null).toBe(true);
                expect(scrollEle.getAttribute("width") == '816.5' || scrollEle.getAttribute("width") == '820.5').toBe(true);
                expect(scrollEle.getAttribute("height") == '16').toBe(true);
                expect(scrollEle.style.top == '373.5px' || scrollEle.style.top == '377.5px').toBe(true);
                expect(scrollEle.style.left == '73.5px' || scrollEle.style.left == '69.5px').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Mulitple Zoom In Check', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                trigger.draganddropEvent(ele, 200, 200, 350, 350);
                trigger.draganddropEvent(ele, 200, 200, 350, 350);
                trigger.draganddropEvent(ele, 200, 200, 350, 350);
                trigger.draganddropEvent(ele, 200, 200, 350, 350);
                trigger.draganddropEvent(ele, 200, 200, 350, 350);
                let svgChildEleX: Element = document.getElementById('scrollBar_svgprimaryXAxis').children[0];
                let thumbRectEleX: Element = svgChildEleX.children[1].children[0];
                expect(thumbRectEleX.getAttribute('x') === '156.41452639545386' || thumbRectEleX.getAttribute('x') === '161.14452850120242').toBe(true);
                expect(thumbRectEleX.getAttribute('y') === '0').toBe(true);
                expect(thumbRectEleX.getAttribute('height') === '16').toBe(true);
                expect(thumbRectEleX.getAttribute('width') === '40').toBe(true);
                let svgChildEleY: Element = document.getElementById('scrollBar_svgprimaryYAxis').children[0];
                let thumbRectEleY: Element = svgChildEleY.children[1].children[0];
                expect(thumbRectEleY.getAttribute('x') === '78.21632587911755' || thumbRectEleY.getAttribute('x') === '83.91218708436139').toBe(true);
                expect(thumbRectEleY.getAttribute('y') === '0').toBe(true);
                expect(thumbRectEleY.getAttribute('height') === '16').toBe(true);
                expect(thumbRectEleY.getAttribute('width') === '40').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('With Opposed axis', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                trigger.draganddropEvent(ele, 200, 200, 350, 350);
                let svgChildEleX: Element = document.getElementById('scrollBar_svgprimaryXAxis').children[0];
                let thumbRectEleX: Element = svgChildEleX.children[1].children[0];
                let xAxisThumbX: string = thumbRectEleX.getAttribute('x');
                expect(xAxisThumbX === '157.59707074139632' || xAxisThumbX === '157.79394403401517'
                    || xAxisThumbX === '162.35513365043468').toBe(true);
                expect(thumbRectEleX.getAttribute('y') === '0').toBe(true);
                expect(thumbRectEleX.getAttribute('height') === '16').toBe(true);
                expect(thumbRectEleX.getAttribute('width') === '40').toBe(true);
                let svgChildEleY: Element = document.getElementById('scrollBar_svgprimaryYAxis').children[0];
                let thumbRectEleY: Element = svgChildEleY.children[1].children[0];
                expect(thumbRectEleY.getAttribute('x') === '78.55342288032391' || thumbRectEleY.getAttribute('x') === '84.20412681155729').toBe(true);
                expect(thumbRectEleY.getAttribute('y') === '0').toBe(true);
                expect(thumbRectEleY.getAttribute('height') === '16').toBe(true);
                expect(thumbRectEleY.getAttribute('width') === '40').toBe(true);
                done();
            };
            chartObj.primaryXAxis.opposedPosition = true;
            chartObj.primaryYAxis.opposedPosition = true;
            chartObj.loaded = loaded;
            chartObj.refresh();
        });


    });
    describe('Multiple Y Axis', () => {
        let chartObj: Chart;
        let loaded: EmitType<ILoadedEventArgs>;
        let load: EmitType<ILoadedEventArgs>;
        beforeAll((): void => {
            ele = createElement('div', { id: 'container' });
            document.body.appendChild(ele);
            chartObj = new Chart(
                {
                    primaryXAxis: {
                        title: 'Days',
                    },
                    primaryYAxis:
                        {
                            title: 'Temperature',
                        },
                    rows: [{ height: '30%' }, { height: '30%' }, { height: '30%' }],
                    axes:
                        [
                            {
                                rowIndex: 1, name: 'yAxis',
                            },
                            {
                                rowIndex: 2, name: 'yAxis2',
                            }
                        ],
                    zoomSettings:
                        {
                            enableMouseWheelZooming: true,
                            enablePinchZooming: true,
                            enableSelectionZooming: true,
                            enableScrollbar: true,
                            enableDeferredZooming: false
                        },
                    series: [{
                        type: 'Line',
                        dataSource: [{ x: 10, y: 46 }, { x: 20, y: 27 }, { x: 30, y: 26 }, { x: 40, y: 16 }, { x: 50, y: 31 }],
                        xName: 'x', yName: 'y',
                    }, {
                        type: 'Line',
                        dataSource: [{ x: 10, y: 46 }, { x: 20, y: 27 }, { x: 30, y: 26 }, { x: 40, y: 16 }, { x: 50, y: 31 }],
                        xName: 'x', yName: 'y',
                        width: 2, yAxisName: 'yAxis',
                    }, {
                        type: 'Line',
                        dataSource: [{ x: 10, y: 46 }, { x: 20, y: 27 }, { x: 30, y: 26 }, { x: 40, y: 16 }, { x: 50, y: 31 }],
                        xName: 'x', yName: 'y',
                        width: 2, yAxisName: 'yAxis2',
                    }],
                    height: '600', width: '900'
                }
            );
            chartObj.appendTo('#container');

        })
        afterAll((): void => {
            chartObj.destroy();
            ele.remove();
        });

        it('Checking Svg Element Y Axis', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                trigger.draganddropEvent(ele, 200, 200, 350, 350);
                trigger.draganddropEvent(ele, 200, 200, 350, 350);
                let svgChildEleX: Element = document.getElementById('scrollBar_svgprimaryXAxis').children[0];
                let thumbRectEleX: Element = svgChildEleX.children[1].children[0];
                expect(thumbRectEleX.getAttribute('x') === '153.26636636636636' ||
                    thumbRectEleX.getAttribute('x') === '157.81739390316795').toBe(true);
                expect(thumbRectEleX.getAttribute('y') === '0').toBe(true);
                expect(thumbRectEleX.getAttribute('height') === '16').toBe(true);
                expect(thumbRectEleX.getAttribute('width') === '40').toBe(true);
                let svgChildEleY: Element = document.getElementById('scrollBar_svgprimaryYAxis').children[0];
                let thumbRectEleY: Element = svgChildEleY.children[1].children[0];
                expect(thumbRectEleY.getAttribute('x') === '72.89100141709966' || thumbRectEleY.getAttribute('x') === '74.29022503516174').toBe(true);
                expect(thumbRectEleY.getAttribute('y') === '0').toBe(true);
                expect(thumbRectEleY.getAttribute('height') === '16').toBe(true);
                expect(thumbRectEleY.getAttribute('width') === '40').toBe(true);
                let svg3: Element = document.getElementById('scrollBar_svgyAxis').children[0];
                let thumbRectEle3: Element = svg3.children[1].children[0];
                expect(thumbRectEle3.getAttribute('x') === '72.89100141709966' || thumbRectEle3.getAttribute('x') === '74.29022503516174').toBe(true);
                expect(thumbRectEle3.getAttribute('y') === '0').toBe(true);
                expect(thumbRectEle3.getAttribute('height') === '16').toBe(true);
                expect(thumbRectEle3.getAttribute('width') === '40').toBe(true);
                let svg4: Element = document.getElementById('scrollBar_svgyAxis2').children[0];

                let thumbRectEle4: Element = svg4.children[1].children[0];
                expect(thumbRectEle4.getAttribute('x') === '97.18800188946621' || thumbRectEle4.getAttribute('x') === '99.05363338021564').toBe(true);
                expect(thumbRectEle4.getAttribute('y') === '0').toBe(true);
                expect(thumbRectEle4.getAttribute('height') === '16').toBe(true);
                expect(thumbRectEle4.getAttribute('width') === '40').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
    });

    describe('Multiple X Axis', () => {
        let chartObj: Chart;
        let loaded: EmitType<ILoadedEventArgs>;
        let load: EmitType<ILoadedEventArgs>;
        beforeAll((): void => {
            ele = createElement('div', { id: 'container' });
            document.body.appendChild(ele);
            chartObj = new Chart(
                {
                    primaryXAxis: {
                        title: 'Days',
                    },
                    primaryYAxis:
                        {
                            title: 'Temperature',
                        },
                    columns: [{ width: '30%' }, { width: '30%' }, { width: '30%' }],
                    axes:
                        [
                            {
                                columnIndex: 1, name: 'xAxis',
                            },
                            {
                                columnIndex: 2, name: 'xAxis2',
                            }
                        ],
                    zoomSettings:
                        {
                            enableMouseWheelZooming: true,
                            enablePinchZooming: true,
                            enableSelectionZooming: true,
                            enableScrollbar: true,
                            enableDeferredZooming: false
                        },
                    series: [{
                        type: 'Line',
                        dataSource: [{ x: 10, y: 46 }, { x: 20, y: 27 }, { x: 30, y: 26 }, { x: 40, y: 16 }, { x: 50, y: 31 }],
                        xName: 'x', yName: 'y',
                    }, {
                        type: 'Line',
                        dataSource: [{ x: 10, y: 46 }, { x: 20, y: 27 }, { x: 30, y: 26 }, { x: 40, y: 16 }, { x: 50, y: 31 }],
                        xName: 'x', yName: 'y',
                        width: 2, xAxisName: 'xAxis',
                    }, {
                        type: 'Line',
                        dataSource: [{ x: 10, y: 46 }, { x: 20, y: 27 }, { x: 30, y: 26 }, { x: 40, y: 16 }, { x: 50, y: 31 }],
                        xName: 'x', yName: 'y',
                        width: 2, xAxisName: 'xAxis2',
                    }],
                    height: '600', width: '900'
                }
            );
            chartObj.appendTo('#container');

        })
        afterAll((): void => {
            chartObj.destroy();
            ele.remove();
        });

        it('Checking Svg Element X Axis', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                trigger.draganddropEvent(ele, 200, 200, 350, 350);
                trigger.draganddropEvent(ele, 200, 200, 350, 350);
                let svgChildEleX: Element = document.getElementById('scrollBar_svgprimaryXAxis').children[0];
                let thumbRectEleX: Element = svgChildEleX.children[1].children[0];
                expect(thumbRectEleX.getAttribute('x') === '45.47308910257471' ||
                thumbRectEleX.getAttribute('x') === '46.82589219466939').toBe(true);
                expect(thumbRectEleX.getAttribute('y') === '0').toBe(true);
                expect(thumbRectEleX.getAttribute('height') === '16').toBe(true);
                expect(thumbRectEleX.getAttribute('width') === '40').toBe(true);
                let svgChildEleY: Element = document.getElementById('scrollBar_svgprimaryYAxis').children[0];
                let thumbRectEleY: Element = svgChildEleY.children[1].children[0];
                expect(thumbRectEleY.getAttribute('x') === '242.97000472366554' || thumbRectEleY.getAttribute('x') === '247.63408345053912').toBe(true);
                expect(thumbRectEleY.getAttribute('y') === '0').toBe(true);
                expect(thumbRectEleY.getAttribute('height') === '16').toBe(true);
                expect(thumbRectEleY.getAttribute('width') === '42.51299008030231' ||
                thumbRectEleY.getAttribute('width') === '42.19409282700422').toBe(true);
                let svg3: Element = document.getElementById('scrollBar_svgxAxis').children[0];
                let thumbRectEle3: Element = svg3.children[1].children[0];
                expect(thumbRectEle3.getAttribute('x') === '45.47308910257471' || thumbRectEle3.getAttribute('x') === '46.82589219466939').toBe(true);
                expect(thumbRectEle3.getAttribute('y') === '0').toBe(true);
                expect(thumbRectEle3.getAttribute('height') === '16').toBe(true);
                expect(thumbRectEle3.getAttribute('width') === '40').toBe(true);
                let svg4: Element = document.getElementById('scrollBar_svgxAxis2').children[0];
                let thumbRectEle4: Element = svg4.children[1].children[0];
                expect(thumbRectEle4.getAttribute('x') === '60.63078547009961' || thumbRectEle4.getAttribute('x') === '62.43452292622585').toBe(true);
                expect(thumbRectEle4.getAttribute('y') === '0').toBe(true);
                expect(thumbRectEle4.getAttribute('height') === '16').toBe(true);
                expect(thumbRectEle4.getAttribute('width') === '40').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
    });


});