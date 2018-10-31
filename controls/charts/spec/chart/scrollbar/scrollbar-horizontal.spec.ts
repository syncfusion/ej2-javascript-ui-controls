/**
 * Scrollbar spec document
 */

import { createElement, EventHandler, Browser } from '@syncfusion/ej2-base';
import { EmitType } from '@syncfusion/ej2-base';
import { Chart, MultiLevelLabel, Crosshair, DateTime } from '../../../src/chart/index';
import { LineSeries } from '../../../src/chart/series/line-series';
import { ILoadedEventArgs } from '../../../src/common/model/interface';
import { ScrollBar } from '../../../src/common/scrollbar/scrollbar';
import { load } from '../../../src';
import { MouseEvents } from '../base/events.spec';
import { chartData } from '../series/spline-area-series.spec';


Chart.Inject(LineSeries, ScrollBar, MultiLevelLabel, Crosshair, DateTime);
let prevent: Function = (): void => {
    //Prevent Function
};

export interface wheel {
    preventDefault: Function,
    wheelDelta: number,
    detail: number,
    clientX: number,
    clientY: number

}

let trigger: MouseEvents = new MouseEvents();
describe('Scrollbar Chart ', () => {
    let ele: HTMLElement;
    describe('Horizontal Scrollbar Default', () => {
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
                    zoomSettings: { enableSelectionZooming: true, enableScrollbar: true, mode: 'X' }
                }
            );
            chartObj.appendTo('#container');

        })
        afterAll((): void => {
            chartObj.destroy();
            ele.remove();
        });
        it('Checking module name', () => {
            expect(chartObj.axisCollections[0].zoomingScrollBar.getModuleName()).toBe('ScrollBar');
        });
        it('Checking svg element', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                trigger.draganddropEvent(ele, 200, 200, 350, 350);
                let scrollEle = document.getElementById('scrollBar_svgprimaryXAxis');
                expect(scrollEle.parentElement.id == 'container_scrollElement').toBe(true);
                expect(scrollEle != null).toBe(true);
                let width: string = scrollEle.getAttribute("width");
                expect(width == '832.5' || width == '836.5').toBe(true);
                expect(scrollEle.getAttribute("height") == '16').toBe(true);
                expect(scrollEle.style.top == '373.5px' || scrollEle.style.top == '377.5px').toBe(true);
                expect(scrollEle.style.left == '57.5px' || scrollEle.style.left == '53.5px').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Child Element Count of SVG', () => {
            let svgChildEle: Element = document.getElementById('scrollBar_svgprimaryXAxis').children[0];
            expect(svgChildEle).not.toBeNull();
            expect(svgChildEle.childElementCount).toBe(2);
            expect(svgChildEle.children[0].childElementCount).toBe(1)
            expect(svgChildEle.children[1].childElementCount).toBe(8)
        });
        it('Back Rect Element check', () => {
            let svgChildEle: Element = document.getElementById('scrollBar_svgprimaryXAxis').children[0];
            let backRectEle: Element = svgChildEle.children[0].children[0];
            let width: string = backRectEle.getAttribute('width');
            expect(svgChildEle.id === 'scrollBar_primaryXAxis').toBe(true)
            expect(svgChildEle.getAttribute('transform') === 'translate(0,0) rotate(0)').toBe(true);
            expect(backRectEle.getAttribute('x') === '0').toBe(true);
            expect(backRectEle.getAttribute('y') === '0').toBe(true);
            expect(backRectEle.getAttribute('height') === '16').toBe(true);
            expect(width === '832.5' || width === '836.5').toBe(true);
            expect(backRectEle.getAttribute('rx') === '0').toBe(true);
            expect(backRectEle.id === 'scrollBarBackRect_primaryXAxis').toBe(true);
        });
        it('Thumb Rect Element check', () => {
            let svgChildEle: Element = document.getElementById('scrollBar_svgprimaryXAxis').children[0];
            let thumbRectEle: Element = svgChildEle.children[1].children[0];
            let x: string = thumbRectEle.getAttribute('x');
            expect(x === '134.5' || x === '138.5').toBe(true);
            expect(thumbRectEle.getAttribute('y') === '0').toBe(true);
            expect(thumbRectEle.getAttribute('height') === '16').toBe(true);
            expect(thumbRectEle.getAttribute('width') === '150').toBe(true);
            expect(thumbRectEle.id === 'scrollBarThumb_primaryXAxis').toBe(true);
        });
        it('Left Circle Element check', () => {
            let svgChildEle: Element = document.getElementById('scrollBar_svgprimaryXAxis').children[0];
            let leftCircle: Element = svgChildEle.children[1].children[2];
            expect(leftCircle.getAttribute('cy') === '8').toBe(true);
            expect(leftCircle.getAttribute('r') === '8').toBe(true);
            expect(leftCircle.id === 'scrollBar_leftCircle_primaryXAxis').toBe(true);
        });
        it('Right Circle Element check', () => {
            let svgChildEle: Element = document.getElementById('scrollBar_svgprimaryXAxis').children[0];
            let rightCircle: Element = svgChildEle.children[1].children[3];
            let cx: string = rightCircle.getAttribute('cx');
            expect(cx === '284.5' || cx === '288.5').toBe(true);
            expect(rightCircle.getAttribute('cy') === '8').toBe(true);
            expect(rightCircle.getAttribute('r') === '8').toBe(true);
            expect(rightCircle.id === 'scrollBar_rightCircle_primaryXAxis').toBe(true);
        });
        it('Left Arrow Element check', () => {
            let svgChildEle: Element = document.getElementById('scrollBar_svgprimaryXAxis').children[0];
            let leftArrow: Element = svgChildEle.children[1].children[5];
            let d: string = leftArrow.getAttribute('d');
            expect(d === 'M 130.5 8 L 136.5 12 L 136.5 4 Z' || d === 'M 134.5 8 L 140.5 12 L 140.5 4 Z' 
            || d === 'M 131.5 8 L 136.5 11 L 136.5 5 Z' || d === 'M 135.5 8 L 140.5 11 L 140.5 5 Z' ).toBe(true);
            expect(leftArrow.id === 'scrollBar_leftArrow_primaryXAxis').toBe(true);
        });
        it('Right Arrow Element check', () => {
            let svgChildEle: Element = document.getElementById('scrollBar_svgprimaryXAxis').children[0];
            let rightArrow: Element = svgChildEle.children[1].children[6];
            let d: string = rightArrow.getAttribute('d');
            expect(d === 'M 288.5 8 L 282.5 12 L 282.5 4 Z' || d === 'M 292.5 8 L 286.5 12 L 286.5 4 Z' ||
            d === 'M 288 8 L 282.5 11.5 L 282.5 4.5 Z' || d === 'M 292 8 L 286.5 11.5 L 286.5 4.5 Z').toBe(true);
            expect(rightArrow.id === 'scrollBar_rightArrow_primaryXAxis').toBe(true);
        });
        it('1st Grip Circle Element check', () => {
            let gripCircle: Element = document.getElementById('scrollBar_gripCircle1_primaryXAxis');
            let cx: string = gripCircle.getAttribute('cx');
            expect(cx === '0').toBe(true);
            expect(gripCircle.getAttribute('cy') === '0').toBe(true);
            expect(gripCircle.getAttribute('r') === '1').toBe(true);
        });
        it('2nd Grip Circle Element check', () => {
            let gripCircle: Element = document.getElementById('scrollBar_gripCircle2_primaryXAxis');
            let cx: string = gripCircle.getAttribute('cx');
            expect(cx === '5').toBe(true);
            expect(gripCircle.getAttribute('cy') === '0').toBe(true);
            expect(gripCircle.getAttribute('r') === '1').toBe(true);
        });
        it('3rd Grip Circle Element check', () => {
            let gripCircle: Element = document.getElementById('scrollBar_gripCircle3_primaryXAxis');
            let cx: string = gripCircle.getAttribute('cx');
            expect(cx === '10').toBe(true);
            expect(gripCircle.getAttribute('cy') === '0').toBe(true);
            expect(gripCircle.getAttribute('r') === '1').toBe(true);
        });
        it('4th Grip Circle Element check', () => {
            let gripCircle: Element = document.getElementById('scrollBar_gripCircle4_primaryXAxis');
            let cx: string = gripCircle.getAttribute('cx');
            expect(cx === '0').toBe(true);
            expect(gripCircle.getAttribute('cy') === '5').toBe(true);
            expect(gripCircle.getAttribute('r') === '1').toBe(true);
        });
        it('5th Grip Circle Element check', () => {
            let gripCircle: Element = document.getElementById('scrollBar_gripCircle5_primaryXAxis');
            let cx: string = gripCircle.getAttribute('cx');
            expect(cx === '5').toBe(true);
            expect(gripCircle.getAttribute('cy') === '5').toBe(true);
            expect(gripCircle.getAttribute('r') === '1').toBe(true);
        });
        it('6th Grip Circle Element check', () => {
            let gripCircle: Element = document.getElementById('scrollBar_gripCircle6_primaryXAxis');
            let cx: string = gripCircle.getAttribute('cx');
            expect(cx === '10').toBe(true);
            expect(gripCircle.getAttribute('cy') === '5').toBe(true);
            expect(gripCircle.getAttribute('r') === '1').toBe(true);
        });
        it('Grip Circle Group Element', ()=>{
            let gripGroup: Element = document.getElementById('scrollBar_gripCircle_primaryXAxis');
            let transform: string = gripGroup.getAttribute('transform');
            expect(transform === 'translate(204.5,5) rotate(0)' || transform === 'translate(213.5,6) rotate(0)'
            || transform === 'translate(208.5,5) rotate(0)').toBe(true);
        });
        it('Chart Element with Scrollbar', () => {
            let chartAreaHt: string = document.getElementById('container_ChartAreaBorder').getAttribute('height');
            let majorTick: string = document.getElementById('container_MajorTickLine_0').getAttribute('d').split('M ')[1];
            let xAxisLabel: Element = document.getElementById('container0_AxisLabel_0');
            let xAxisTitle: Element = document.getElementById('container_AxisTitle_0');
            let x: string = xAxisLabel.getAttribute('x');
            let y: string = xAxisLabel.getAttribute('y');
            let titleX: string = xAxisTitle.getAttribute('x');
            let titleY: string = xAxisTitle.getAttribute('y');
            expect(chartAreaHt === '328.25' || chartAreaHt === '335.25').toBe(true);
            expect(majorTick === '119.59062500000013 374 L 119.59062500000013 395 ' || majorTick === '97.4859583333334 378 L 97.4859583333334 399 ').toBe(true);
            expect(x === '113.09062500000013' || x === '91.4859583333334').toBe(true)
            expect(y === '412' || y === '415.25').toBe(true);
            expect(xAxisLabel.innerHTML === '17').toBe(true);
            expect(titleX === '473.75' || titleX === '471.75').toBe(true);
            expect(titleY === '434.75' || titleY === '435.5').toBe(true);
        });
    });

    describe('Horizontal Scrollbar with Labels, Ticks and Border ', () => {
        let chartObj: Chart;
        let loaded: EmitType<ILoadedEventArgs>;
        let load: EmitType<ILoadedEventArgs>;
        beforeAll((): void => {
            ele = createElement('div', { id: 'container' });
            document.body.appendChild(ele);
            chartObj = new Chart(
                {
                    primaryXAxis: {
                        title: 'PrimaryXAxis', valueType: 'Double', labelPosition: 'Inside',
                        tickPosition: 'Inside'
                    },
                    primaryYAxis: { title: 'PrimaryYAxis' },
                    series: [{
                        dataSource: [{ x: 10, y: 46 }, { x: 20, y: 27 }, { x: 30, y: 26 }, { x: 40, y: 16 }, { x: 50, y: 31 }],
                        xName: 'x', yName: 'y', marker: { visible: true }, type: 'Line'
                    }],
                    title: 'Chart Title',
                    legendSettings: { visible: true },
                    width: '900',
                    zoomSettings: { enableSelectionZooming: true, enableScrollbar: true, mode: 'X' }
                }
            );
            chartObj.appendTo('#container');

        })
        afterAll((): void => {
            chartObj.destroy();
            ele.remove();
        });

        it('Scrollbar position', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                trigger.draganddropEvent(ele, 200, 250, 350, 400);
                let scrollEle = document.getElementById('scrollBar_svgprimaryXAxis');
                expect(scrollEle.parentElement.id == 'container_scrollElement').toBe(true);
                expect(scrollEle != null).toBe(true);
                let width: string = scrollEle.getAttribute('width');
                expect(width == '832.5' || width === '836.5').toBe(true);
                expect(scrollEle.getAttribute('height') == '16').toBe(true);
                expect(scrollEle.style.top == '404.5px' || scrollEle.style.top == '407.5px').toBe(true);
                expect(scrollEle.style.left == '57.5px' || scrollEle.style.left == '53.5px').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Ticks and Labels Position Check', (done: Function) => {
            let chartAreaHt: string = document.getElementById('container_ChartAreaBorder').getAttribute('height');
            let majorTick: string = document.getElementById('container_MajorTickLine_0').getAttribute('d').split('M ')[1];
            let xAxisLabel: Element = document.getElementById('container0_AxisLabel_0');
            let xAxisTitle: Element = document.getElementById('container_AxisTitle_0');
            let labelX: string = xAxisLabel.getAttribute('x');
            let labelY: string = xAxisLabel.getAttribute('y');
            let titleX: string = xAxisTitle.getAttribute('x');
            let titleY: string = xAxisTitle.getAttribute('y');
            expect(chartAreaHt === '359.25' || chartAreaHt === '365.25').toBe(true);
            expect(majorTick === '119.59062500000013 421 L 119.59062500000013 399 ' || majorTick === '97.4859583333334 424 L 97.4859583333334 402 ').toBe(true);
            expect(labelX === '113.09062500000013' || labelX === '91.4859583333334').toBe(true);
            expect(labelY === '394' || labelY === '397').toBe(true);
            expect(xAxisLabel.innerHTML === '17').toBe(true);
            expect(titleX === '473.75' || titleX === '471.75').toBe(true);
            expect(titleY === '434.75' || titleY === '435.5').toBe(true);
            done();
        });

        it('X Axis Labels Border Outside', function (done) {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                trigger.draganddropEvent(ele, 200, 250, 350, 400);
                let border: string = document.getElementById('container_BorderLine_0').getAttribute('d').split("M  ")[1];
                expect(border === '57.5 389.5L 890 389.5' || border === '53.5 393.5L 890 393.5').toBe(true);
                done();
            };
            chartObj.primaryXAxis.labelPosition = 'Outside';
            chartObj.primaryXAxis.tickPosition = 'Outside';
            chartObj.primaryXAxis.border.width = 1;
            chartObj.primaryXAxis.border.color = 'Red';
            chartObj.loaded = loaded;
            chartObj.refresh();

        });
        it('X Axis Labels Border Inside', function (done) {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                trigger.draganddropEvent(ele, 200, 250, 350, 400);
                let border: string = document.getElementById('container_BorderLine_0').getAttribute('d').split("M  ")[1];
                expect(border === '57.5 404.5L 890 404.5' || border === '53.5 407.5L 890 407.5').toBe(true);
                done();

            };
            chartObj.primaryXAxis.labelPosition = 'Inside';
            chartObj.primaryXAxis.tickPosition = 'Inside';
            chartObj.primaryXAxis.border.width = 1;
            chartObj.primaryXAxis.border.color = 'Red';
            chartObj.loaded = loaded;
            chartObj.refresh();

        });
    });

    describe('Axis Crossing', () => {
        let chartObj: Chart;
        let loaded: EmitType<ILoadedEventArgs>;
        let load: EmitType<ILoadedEventArgs>;
        beforeAll((): void => {
            ele = createElement('div', { id: 'container' });
            document.body.appendChild(ele);
            chartObj = new Chart(
                {
                    primaryXAxis: { title: 'PrimaryXAxis', valueType: 'Double', crossesAt: 25 },
                    primaryYAxis: { title: 'PrimaryYAxis' },
                    series: [{
                        dataSource: [{ x: 10, y: 46 }, { x: 20, y: 27 }, { x: 30, y: 26 }, { x: 40, y: 16 }, { x: 50, y: 31 }],
                        xName: 'x', yName: 'y', marker: { visible: true }, type: 'Line'
                    }],
                    title: 'Chart Title',
                    legendSettings: { visible: true },
                    width: '900',
                    zoomSettings: { enableSelectionZooming: true, enableScrollbar: true, mode: 'X' }
                }
            );
            chartObj.appendTo('#container');

        })
        afterAll((): void => {
            chartObj.destroy();
            ele.remove();
        });

        it('Scrollbar position', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                trigger.draganddropEvent(ele, 200, 250, 350, 400);
                let scrollEle = document.getElementById('scrollBar_svgprimaryXAxis');
                expect(scrollEle.parentElement.id == 'container_scrollElement').toBe(true);
                expect(scrollEle != null).toBe(true);
                let width: string = scrollEle.getAttribute('width');
                expect(width == '832.5' || width === '836.5').toBe(true);
                expect(scrollEle.getAttribute('height') == '16').toBe(true);
                expect(scrollEle.style.top == '433.5px').toBe(true);
                expect(scrollEle.style.left == '57.5px' || scrollEle.style.left == '53.5px').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Ticks and Labels Position Check', (done: Function) => {
            let chartAreaHt: string = document.getElementById('container_ChartAreaBorder').getAttribute('height');
            let majorTick: string = document.getElementById('container_MajorTickLine_0').getAttribute('d').split('M ')[1];
            let xAxisLabel: Element = document.getElementById('container0_AxisLabel_0');
            let xAxisTitle: Element = document.getElementById('container_AxisTitle_0');
            expect(chartAreaHt === '388.25' || chartAreaHt === '391.25').toBe(true);
            expect(majorTick === '119.59062500000013 239.875 L 119.59062500000013 244.875 ' ||
                majorTick === '97.4859583333334 238.375 L 97.4859583333334 243.375 ').toBe(true);
            expect(xAxisLabel.getAttribute('x') === '113.09062500000013' || xAxisLabel.getAttribute('x') === '91.4859583333334').toBe(true);
            expect(xAxisLabel.getAttribute('y') === '261.875' || xAxisLabel.getAttribute('y') === '259.625').toBe(true);
            expect(xAxisLabel.innerHTML === '17').toBe(true);
            expect(xAxisTitle.getAttribute('x') === '473.75' || xAxisTitle.getAttribute('x') === '471.75').toBe(true);
            expect(xAxisTitle.getAttribute('y') === '284.625' || xAxisTitle.getAttribute('y') === '279.875').toBe(true);
            done();
        });
    });

    describe('Multilevel Labels', () => {
        let chartObj: Chart;
        let loaded: EmitType<ILoadedEventArgs>;
        let load: EmitType<ILoadedEventArgs>;
        beforeAll((): void => {
            ele = createElement('div', { id: 'container' });
            document.body.appendChild(ele);
            chartObj = new Chart(
                {
                    primaryXAxis: {
                        title: 'PrimaryXAxis', valueType: 'Double',
                        multiLevelLabels: [{
                            border: { type: 'Rectangle' },
                            categories: [{ start: 15, end: 25, text: 'Label 1', }, { start: 25, end: 40, text: 'Label 2', }]
                        }]
                    },
                    primaryYAxis: { title: 'PrimaryYAxis' },
                    series: [{
                        dataSource: [{ x: 10, y: 46 }, { x: 20, y: 27 }, { x: 30, y: 26 }, { x: 40, y: 16 }, { x: 50, y: 31 }],
                        xName: 'x', yName: 'y', marker: { visible: true }, type: 'Line'
                    }],
                    title: 'Chart Title', legendSettings: { visible: true }, width: '900',
                    zoomSettings: { enableSelectionZooming: true, enableScrollbar: true, mode: 'X' }
                }
            );
            chartObj.appendTo('#container');

        })
        afterAll((): void => {
            chartObj.destroy();
            ele.remove();
        });

        it('Label and Border Position - Inside', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                trigger.draganddropEvent(ele, 150, 150, 400, 400);
                let mulitiLevelLabel: Element = document.getElementById('container0_Axis_MultiLevelLabel_Level_0_Text_0');
                let border: string = document.getElementById('container0_Axis_MultiLevelLabel_Rect_0').getAttribute('d').split('M')[1];
                let x: string = mulitiLevelLabel.getAttribute('x');
                let y: string = mulitiLevelLabel.getAttribute('y');
                expect(x === '469.17125000000004' || x === '457.1112499999999').toBe(true);
                expect(y === '405.5' || y === '409').toBe(true);
                expect(border === '122.643125 387.5L122.643125 415.5' || border === '107.24512499999994 391.5L107.24512499999994 418.5').toBe(true)
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Label and Border Position - Outside', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                let mulitiLevelLabel: Element = document.getElementById('container0_Axis_MultiLevelLabel_Level_0_Text_0');
                let border: string = document.getElementById('container0_Axis_MultiLevelLabel_Rect_0').getAttribute('d').split('M')[1];
                let x: string = mulitiLevelLabel.getAttribute('x');
                let y: string = mulitiLevelLabel.getAttribute('y');
                expect(x === '469.17125000000004' || x === '457.1112499999999').toBe(true);
                expect(y === '379.5' || y === '384').toBe(true);
                expect(border === '122.643125 389.5L122.643125 361.5' || border === '107.24512499999994 393.5L107.24512499999994 366.5').toBe(true)
                done();
            };
            chartObj.primaryXAxis.labelPosition = 'Inside';
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
    });

    describe('Date Time Axis', () => {
        let chartObj: Chart;
        let loaded: EmitType<ILoadedEventArgs>;
        let load: EmitType<ILoadedEventArgs>;
        beforeAll((): void => {
            ele = createElement('div', { id: 'container' });
            document.body.appendChild(ele);
            chartObj = new Chart(
                {
                    primaryXAxis: {
                        valueType: 'DateTime',
                    },
                    //Initializing Chart Series
                    series: [
                        {
                            type: 'Line',
                            dataSource: [
                                { x: new Date(2016, 3, 1), y: 6.3 },
                                { x: new Date(2016, 4, 1), y: 13.3 }, { x: new Date(2016, 5, 1), y: 18.0 },
                                { x: new Date(2016, 6, 1), y: 19.8 }, { x: new Date(2016, 7, 1), y: 18.1 },
                                { x: new Date(2016, 8, 1), y: 13.1 }, { x: new Date(2016, 9, 1), y: 4.1 }
                            ],
                            xName: 'x',
                            yName: 'y',
                        }
                    ],
                    width: '900',
                    zoomSettings: { enableSelectionZooming: true, enableScrollbar: true, mode: 'X' }
                }
            );
            chartObj.appendTo('#container');

        })
        afterAll((): void => {
            chartObj.destroy();
            ele.remove();
        });

        it('Element Position Check', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                trigger.draganddropEvent(ele, 200, 200, 350, 350);
                let scrollEle = document.getElementById('scrollBar_svgprimaryXAxis');
                let thumbEle: Element = document.getElementById('scrollBarThumb_primaryXAxis');
                let thumbX: string = thumbEle.getAttribute('x');
                expect(thumbX === '158.5' || thumbX === '159.5').toBe(true);
                expect(thumbEle.getAttribute('width') === '150').toBe(true);
                expect(scrollEle.parentElement.id == 'container_scrollElement').toBe(true);
                expect(scrollEle != null).toBe(true);
                expect(scrollEle.getAttribute("width") == '856.5' || scrollEle.getAttribute("width") == '857.5').toBe(true);
                expect(scrollEle.getAttribute("height") == '16').toBe(true);
                expect(scrollEle.style.top == '397.5px' || scrollEle.style.top == '398.5px').toBe(true);
                expect(scrollEle.style.left == '33.5px' || scrollEle.style.left == '32.5px').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });

    });

    describe('Crosshair', () => {
        let chartObj: Chart;
        let loaded: EmitType<ILoadedEventArgs>;
        let load: EmitType<ILoadedEventArgs>;
        beforeAll((): void => {
            ele = createElement('div', { id: 'container' });
            document.body.appendChild(ele);
            chartObj = new Chart(
                {
                    primaryXAxis: {
                        title: 'PrimaryXAxis', valueType: 'Double',
                        crosshairTooltip: { enable: true }
                    },
                    crosshair: { enable: true },
                    primaryYAxis: { title: 'PrimaryYAxis' },
                    series: [{
                        dataSource: [{ x: 10, y: 46 }, { x: 20, y: 27 }, { x: 30, y: 26 }, { x: 40, y: 16 }, { x: 50, y: 31 }],
                        xName: 'x', yName: 'y', marker: { visible: true }, type: 'Line'
                    }],
                    title: 'Chart Title', legendSettings: { visible: true }, width: '900',
                    zoomSettings: { enableSelectionZooming: true, enableScrollbar: true, mode: 'X' }
                }
            );
            chartObj.appendTo('#container');

        })
        afterAll((): void => {
            chartObj.destroy();
            ele.remove();
        });

        it('Crosshair Label', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                trigger.draganddropEvent(ele, 150, 150, 400, 400);
                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                let y: number = parseFloat(chartArea.getAttribute('y')) + parseFloat(chartArea.getAttribute('height')) / 2 + ele.offsetTop;
                let x: number = parseFloat(chartArea.getAttribute('x')) + parseFloat(chartArea.getAttribute('width')) / 2 + ele.offsetLeft;
                trigger.mousemovetEvent(chartArea, Math.ceil(x), Math.ceil(y));
                let crossHairEle: string = document.getElementById('container_axis_tooltip_0').getAttribute('d').split(' L')[0];
                expect(crossHairEle === 'M 450 401.5 Q 450 399.5 452 399.5' || crossHairEle === 'M 449 405.5 Q 449 403.5 451 403.5').toBe(true);
                let text: string = document.getElementById('container_axis_tooltip_text_0').innerHTML;
                expect(text === '20.070' || text === '20.213').toBe(true);
                done();

            }
            chartObj.loaded = loaded;
            chartObj.refresh();
        });

    });

    describe('Scrollbar User Interaction', () => {
        let chartObj: Chart;
        let loaded: EmitType<ILoadedEventArgs>;
        let load: EmitType<ILoadedEventArgs>;
        let wheelArgs: wheel;
        beforeAll((): void => {
            ele = createElement('div', { id: 'container' });
            document.body.appendChild(ele);
            chartObj = new Chart(
                {
                    primaryXAxis: {
                        title: 'PrimaryXAxis', valueType: 'Double',
                    },
                    primaryYAxis: { title: 'PrimaryYAxis' },
                    series: [{
                        dataSource: [{ x: 10, y: 46 }, { x: 20, y: 27 }, { x: 30, y: 26 }, { x: 40, y: 16 }, { x: 50, y: 31 }],
                        xName: 'x', yName: 'y', marker: { visible: true }, type: 'Line'
                    }],
                    theme : 'Bootstrap',
                    title: 'Chart Title', legendSettings: { visible: true }, width: '900',
                    zoomSettings: { enableSelectionZooming: true, enableScrollbar: true, mode: 'X' }
                }
            );
            chartObj.appendTo('#container');

        })
        afterAll((): void => {
            chartObj.destroy();
            ele.remove();
        });

        it('Mouse Move with Thumb', (done: Function) => {
            trigger.draganddropEvent(ele, 150, 150, 400, 400);
            let currentTarget: Element = document.getElementById('scrollBarThumb_primaryXAxis');
            chartObj.axisCollections[0].zoomingScrollBar.scrollMouseDown(<PointerEvent>(trigger.onTouchStart(currentTarget, 0, 0, 0, 0, 300, 390)));
            chartObj.axisCollections[0].zoomingScrollBar.scrollMouseMove(<PointerEvent>(trigger.onTouchMove(currentTarget, 0, 0, 0, 0, 450, 390)));
            let thumbEle: Element = document.getElementById('scrollBarThumb_primaryXAxis');
            expect(thumbEle.getAttribute('x') === '234.5' || thumbEle.getAttribute('x') === '238.5').toBe(true);
            expect(thumbEle.getAttribute('width') === '250' || thumbEle.getAttribute('width') === '250.00000000000003').toBe(true);
            chartObj.axisCollections[0].zoomingScrollBar.scrollMouseUp(<PointerEvent>(trigger.onTouchEnd(currentTarget, 0, 0, 0, 0, 450, 390)));
            done();
        });

        it('Right Resize using Circle', (done: Function) => {
            let currentTarget: Element = document.getElementById('scrollBar_rightCircle_primaryXAxis');
            chartObj.axisCollections[0].zoomingScrollBar.scrollMouseDown(<PointerEvent>(trigger.onTouchStart(currentTarget, 0, 0, 0, 0, 550, 390, true)));
            chartObj.axisCollections[0].zoomingScrollBar.scrollMouseMove(<PointerEvent>(trigger.onTouchMove(currentTarget, 0, 0, 0, 0, 650, 390)));
            let thumbEle: Element = document.getElementById('scrollBarThumb_primaryXAxis');
            expect(thumbEle.getAttribute('x') === '234.5' || thumbEle.getAttribute('x') === '238.5').toBe(true);
            expect(thumbEle.getAttribute('width') === '350').toBe(true);
            chartObj.axisCollections[0].zoomingScrollBar.scrollMouseMove(<PointerEvent>(trigger.onTouchMove(currentTarget, 0, 0, 0, 0, 450, 390)));
            expect(thumbEle.getAttribute('x') === '234.5' || thumbEle.getAttribute('x') === '238.5').toBe(true);
            expect(thumbEle.getAttribute('width') === '150').toBe(true);
            chartObj.axisCollections[0].zoomingScrollBar.scrollMouseUp(<PointerEvent>(trigger.onTouchEnd(currentTarget, 0, 0, 0, 0, 450, 390)));
            done();
        });
        it('Left Resize using Circle', (done: Function) => {
            let currentTarget: Element = document.getElementById('scrollBar_leftCircle_primaryXAxis');
            chartObj.axisCollections[0].zoomingScrollBar.scrollMouseDown(<PointerEvent>(trigger.onTouchStart(currentTarget, 0, 0, 0, 0, 300, 390)));
            chartObj.axisCollections[0].zoomingScrollBar.scrollMouseMove(<PointerEvent>(trigger.onTouchMove(currentTarget, 0, 0, 0, 0, 120, 390)));
            let thumbEle: Element = document.getElementById('scrollBarThumb_primaryXAxis');
            expect(thumbEle.getAttribute('x') === '54.5' || thumbEle.getAttribute('x') === '58.5').toBe(true);
            expect(thumbEle.getAttribute('width') === '330').toBe(true);
            chartObj.axisCollections[0].zoomingScrollBar.scrollMouseMove(<PointerEvent>(trigger.onTouchMove(currentTarget, 0, 0, 0, 0, 250, 390)));
            expect(thumbEle.getAttribute('x') === '184.5' || thumbEle.getAttribute('x') === '188.5').toBe(true);
            expect(thumbEle.getAttribute('width') === '200').toBe(true);
            done();
        });

        it('Checking mouse wheel as forward ', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                trigger.draganddropEvent(ele, 150, 150, 400, 400);
                wheelArgs = {
                    preventDefault: prevent,
                    wheelDelta: 120,
                    detail: 0,
                    clientX: 210,
                    clientY: 100
                };
                chartObj.axisCollections[0].zoomingScrollBar.scrollMouseWheel(<WheelEvent>wheelArgs);
                let thumbEle: Element = document.getElementById('scrollBarThumb_primaryXAxis');
                expect(thumbEle.getAttribute('x') === '204.98499215253867' || thumbEle.getAttribute('x') === '209.8458249606484').toBe(true);
                expect(thumbEle.getAttribute('width') === '60.06006006006006' ||
                    thumbEle.getAttribute('width') === '59.77286312014346').toBe(true);
                done();
            };
            chartObj.zoomSettings.enableMouseWheelZooming = true;
            chartObj.loaded = loaded;
            chartObj.theme = 'Fabric';
            chartObj.refresh();
        });

        it('Checking mouse wheel as backward ', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                trigger.draganddropEvent(ele, 150, 150, 400, 400);
                chartObj.axisCollections[0].zoomingScrollBar.isPointer = false;
                chartObj.axisCollections[0].zoomingScrollBar.browserName = 'mozilla';
                wheelArgs = {
                    preventDefault: prevent,
                    wheelDelta: -120,
                    detail: 3,
                    clientX: 310,
                    clientY: 100
                };
                chartObj.axisCollections[0].zoomingScrollBar.scrollMouseWheel(<WheelEvent>wheelArgs);
                let thumbEle: Element = document.getElementById('scrollBarThumb_primaryXAxis');
                expect(thumbEle.getAttribute('x') === '210.9453445522114' || thumbEle.getAttribute('x') === '216.03119470743226').toBe(true);
                expect(thumbEle.getAttribute('width') === '40').toBe(true);
                done();
            };
            chartObj.theme = 'Highcontrast';
            chartObj.loaded = loaded;
            chartObj.refresh();
        });

        it('Mouse wheel with detial argument negative  ', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                trigger.draganddropEvent(ele, 150, 150, 400, 400);
                chartObj.axisCollections[0].zoomingScrollBar.isPointer = false;
                chartObj.axisCollections[0].zoomingScrollBar.browserName = 'mozilla';
                wheelArgs = {
                    preventDefault: prevent,
                    wheelDelta: -120,
                    detail: -3,
                    clientX: 310,
                    clientY: 100
                };
                chartObj.axisCollections[0].zoomingScrollBar.scrollMouseWheel(<WheelEvent>wheelArgs);
                let thumbEle: Element = document.getElementById('scrollBarThumb_primaryXAxis');
                expect(thumbEle.getAttribute('x') === '212.75573526148483' || thumbEle.getAttribute('x') === '217.90025241723998').toBe(true);
                expect(thumbEle.getAttribute('width') === '40').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });

        it('Mouse Down on Back Rect - Right Side Click', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                trigger.draganddropEvent(ele, 150, 150, 400, 400);
                let currentTarget: Element = document.getElementById('scrollBarBackRect_primaryXAxis');
                chartObj.axisCollections[0].zoomingScrollBar.animateDuration = 0;
                chartObj.axisCollections[0].zoomingScrollBar.scrollMouseDown(<PointerEvent>(trigger.onTouchStart(currentTarget, 0, 0, 0, 0, 500, 390)));
                let thumbEle: Element = document.getElementById('scrollBarThumb_primaryXAxis');
                expect(thumbEle.getAttribute('x') === '166.15' || thumbEle.getAttribute('x') === '170.55').toBe(true);
                expect(thumbEle.getAttribute('width') === '250' || thumbEle.getAttribute('width') === '250.00000000000003').toBe(true);
                done();
            }
            chartObj.primaryXAxis.zoomFactor = 1;
            chartObj.primaryXAxis.zoomPosition = 0;
            chartObj.loaded = loaded;
            chartObj.refresh();
        });

        it('Mouse Down on Back Rect - Left side Click', (done: Function) => {
            let currentTarget: Element = document.getElementById('scrollBarBackRect_primaryXAxis');
            chartObj.axisCollections[0].zoomingScrollBar.animateDuration = 0;
            chartObj.axisCollections[0].zoomingScrollBar.scrollMouseDown(<PointerEvent>(trigger.onTouchStart(currentTarget, 0, 0, 0, 0, 140, 390)));
            let thumbEle: Element = document.getElementById('scrollBarThumb_primaryXAxis');
            expect(thumbEle.getAttribute('x') === '84.5' || thumbEle.getAttribute('x') === '88.5').toBe(true);
            expect(thumbEle.getAttribute('width') === '250' || thumbEle.getAttribute('width') === '250.00000000000003').toBe(true);
            done();
        });
        it('Mouse Down on Back Rect - X position less than svg x value', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                trigger.draganddropEvent(ele, 75, 150, 400, 400);
                let currentTarget: Element = document.getElementById('scrollBarBackRect_primaryXAxis');
                let thumbEle: Element = document.getElementById('scrollBarThumb_primaryXAxis');
                let circleRadius: number = 8;
                chartObj.axisCollections[0].zoomingScrollBar.animateDuration = 0;
                chartObj.axisCollections[0].zoomingScrollBar.scrollMouseDown(<PointerEvent>(trigger.onTouchStart(currentTarget, 0, 0, 0, 0, chartObj.axisCollections[0].rect.x - circleRadius, 390)));
                expect(thumbEle.getAttribute('x') === '9.5' || thumbEle.getAttribute('x') === '13.5').toBe(true);
                expect(thumbEle.getAttribute('width') === '325').toBe(true);
                done();
            }
            chartObj.primaryXAxis.zoomFactor = 1;
            chartObj.primaryXAxis.zoomPosition = 0;
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Checking mouse x value on scroll width', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                trigger.draganddropEvent(ele, 150, 150, 880, 400);
                let currentTarget: Element = document.getElementById('scrollBarBackRect_primaryXAxis');
                chartObj.axisCollections[0].zoomingScrollBar.animateDuration = 0;
                chartObj.axisCollections[0].zoomingScrollBar.scrollMouseDown(<PointerEvent>(trigger.onTouchStart(currentTarget, 0, 0, 0, 0, 890, 390)));
                let thumbEle: Element = document.getElementById('scrollBarThumb_primaryXAxis');
                expect(thumbEle.getAttribute('x') === '92.5' || thumbEle.getAttribute('x') === '96.5').toBe(true);
                expect(thumbEle.getAttribute('width') === '730').toBe(true);
                done();
            }
            chartObj.primaryXAxis.zoomFactor = 1;
            chartObj.primaryXAxis.zoomPosition = 0;
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Checking mouse x value greater than scroll width', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                trigger.draganddropEvent(ele, 150, 150, 8000, 400);
                let thumbEle: Element = document.getElementById('scrollBarThumb_primaryXAxis');
                expect(thumbEle.getAttribute('x') === '84.5' || thumbEle.getAttribute('x') === '88.5').toBe(true);
                expect(thumbEle.getAttribute('width') === '740').toBe(true);
                done();
            }
            chartObj.primaryXAxis.zoomFactor = 1;
            chartObj.primaryXAxis.zoomPosition = 0;
            chartObj.loaded = loaded;
            chartObj.refresh();
        });

        it('Left Circle Resize - X within Circle Radius', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                trigger.draganddropEvent(ele, 80, 150, 800, 400);
                let currentTarget: Element = document.getElementById('scrollBar_leftCircle_primaryXAxis');
                chartObj.axisCollections[0].zoomingScrollBar.scrollMouseDown(<PointerEvent>(trigger.onTouchStart(currentTarget, 0, 0, 0, 0, 80, 390)));
                chartObj.axisCollections[0].zoomingScrollBar.scrollMouseMove(<PointerEvent>(trigger.onTouchMove(currentTarget, 0, 0, 0, 0, 70, 390)));
                let thumbEle: Element = document.getElementById('scrollBarThumb_primaryXAxis');
                expect(thumbEle.getAttribute('x') === '14.5' || thumbEle.getAttribute('x') === '8.5').toBe(true);
                expect(thumbEle.getAttribute('width') === '720' || thumbEle.getAttribute('width') === '730').toBe(true);
                done();
            }
            chartObj.primaryXAxis.zoomFactor = 1;
            chartObj.primaryXAxis.zoomPosition = 0;
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Mouse wheel - Width Greater than SVG Width', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                trigger.draganddropEvent(ele, 150, 150, 8000, 400);
                wheelArgs = {
                    preventDefault: prevent,
                    wheelDelta: 120,
                    detail: 0,
                    clientX: 800,
                    clientY: 390
                };
                chartObj.axisCollections[0].zoomingScrollBar.scrollMouseWheel(<WheelEvent>wheelArgs);
                let thumbEle: Element = document.getElementById('scrollBarThumb_primaryXAxis');
                expect(thumbEle.getAttribute('x') === '84.5' || thumbEle.getAttribute('x') === '88.5').toBe(true);
                expect(thumbEle.getAttribute('width') === '740').toBe(true);
                done();
            }
            chartObj.primaryXAxis.zoomFactor = 1;
            chartObj.primaryXAxis.zoomPosition = 0;
            chartObj.loaded = loaded;
            chartObj.refresh();
        });

        it('Removing scrollbar svg element', (done: Function) => {
            trigger.draganddropEvent(ele, 150, 150, 400, 400);
            chartObj.axisCollections[0].zoomingScrollBar.render();
            expect(document.getElementById('scrollBar_svgprimaryXAxis')).toBeNull(true);
            chartObj.refresh();
            done();
        });

    });
    describe('Thumb Limits', () => {
        let chartObj: Chart;
        let loaded: EmitType<ILoadedEventArgs>;
        let load: EmitType<ILoadedEventArgs>;
        beforeAll((): void => {
            ele = createElement('div', { id: 'container' });
            document.body.appendChild(ele);
            chartObj = new Chart(
                {
                    primaryXAxis: {
                        title: 'PrimaryXAxis', valueType: 'Double',
                        crosshairTooltip: { enable: true }
                    },
                    crosshair: { enable: true },
                    primaryYAxis: { title: 'PrimaryYAxis' },
                    series: [{
                        dataSource: [{ x: 10, y: 46 }, { x: 20, y: 27 }, { x: 30, y: 26 }, { x: 40, y: 16 }, { x: 50, y: 31 }],
                        xName: 'x', yName: 'y', marker: { visible: true }, type: 'Line'
                    }],
                    title: 'Chart Title', legendSettings: { visible: true }, width: '900',
                    zoomSettings: { enableSelectionZooming: true, enableScrollbar: true, mode: 'X' }
                }
            );
            chartObj.appendTo('#container');

        })
        afterAll((): void => {
            chartObj.destroy();
            ele.remove();
        });

        it('Checking less than SVG X value - Left resize', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                trigger.draganddropEvent(ele, 150, 150, 400, 400);
                let currentTarget: Element = document.getElementById('scrollBar_leftCircle_primaryXAxis');
                chartObj.axisCollections[0].zoomingScrollBar.scrollMouseDown(<PointerEvent>(trigger.onTouchStart(currentTarget, 0, 0, 0, 0, 160, 390)));
                chartObj.axisCollections[0].zoomingScrollBar.scrollMouseMove(<PointerEvent>(trigger.onTouchMove(currentTarget, 0, 0, 0, 0, 50, 390)));
                let thumbEle: Element = document.getElementById('scrollBarThumb_primaryXAxis');
                expect(thumbEle.getAttribute('x') === '84.5' || thumbEle.getAttribute('x') === '88.5').toBe(true);
                expect(thumbEle.getAttribute('width') === '250' || thumbEle.getAttribute('width') === '250.00000000000003').toBe(true);
                done();

            }
            chartObj.loaded = loaded;
            chartObj.theme = 'Highcontrast';
            chartObj.refresh();
        });

        it('Checking less than SVG X value - Thumb Mouse move', (done: Function) => {
            let currentTarget: Element = document.getElementById('scrollBarThumb_primaryXAxis');
            chartObj.axisCollections[0].zoomingScrollBar.scrollMouseDown(<PointerEvent>(trigger.onTouchStart(currentTarget, 0, 0, 0, 0, 160, 390)));
            chartObj.axisCollections[0].zoomingScrollBar.scrollMouseMove(<PointerEvent>(trigger.onTouchMove(currentTarget, 0, 0, 0, 0, 50, 390)));
            let thumbEle: Element = document.getElementById('scrollBarThumb_primaryXAxis');
            expect(thumbEle.getAttribute('x') === '84.5' || thumbEle.getAttribute('x') === '88.5').toBe(true);
            expect(thumbEle.getAttribute('width') === '250' || thumbEle.getAttribute('width') === '250.00000000000003').toBe(true);
            done();
        });

        it('Checking Hover Fill - Right Arrow with Circle', (done: Function) => {
            let currentTarget: Element = document.getElementById('scrollBar_rightArrow_primaryXAxis');
            chartObj.axisCollections[0].zoomingScrollBar.scrollMouseMove(<PointerEvent>(trigger.onTouchMove(currentTarget, 0, 0, 0, 0, 400, 390)));
            let circleEle: Element = document.getElementById('scrollBar_rightCircle_primaryXAxis');
            expect(circleEle).not.toBe(null);
            done();
        });
        it('Checking Hover Fill - Left Arrow with Circle', (done: Function) => {
            let currentTarget: Element = document.getElementById('scrollBar_leftArrow_primaryXAxis');
            chartObj.axisCollections[0].zoomingScrollBar.scrollMouseMove(<PointerEvent>(trigger.onTouchMove(currentTarget, 0, 0, 0, 0, 500, 390)));
            let circleEle: Element = document.getElementById('scrollBar_leftCircle_primaryXAxis');
            expect(circleEle).not.toBe(null);
            done();
        });
        it('Checking Hover Fill - Right Arrow Element', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                trigger.draganddropEvent(ele, 150, 150, 400, 400);
                let currentTarget: Element = document.getElementById('scrollBar_rightCircle_primaryXAxis');
                chartObj.axisCollections[0].zoomingScrollBar.scrollMouseMove(<PointerEvent>(trigger.onTouchMove(currentTarget, 0, 0, 0, 0, 698, 390)));
                let circleEle: Element = document.getElementById('scrollBar_rightArrow_primaryXAxis');
                expect(circleEle).not.toBe(null);
                done();
            }
            chartObj.theme = 'Highcontrast';
            chartObj.loaded = loaded;
            chartObj.refresh()
        });
        it('Shadow Element Check', (done: Function) => {
            let shadowEle: Element = document.getElementById(chartObj.axisCollections[0].name + '_thumb_shadow')
            expect(shadowEle.childElementCount).toBe(2);
            done();
        });
     });


    describe('Scrollbar Animation', () => {
        let chartObj: Chart;
        let loaded: EmitType<ILoadedEventArgs>;
        let load: EmitType<ILoadedEventArgs>;
        let wheelArgs: wheel;
        beforeAll((): void => {
            ele = createElement('div', { id: 'container' });
            document.body.appendChild(ele);
            chartObj = new Chart(
                {
                    primaryXAxis: {
                        title: 'PrimaryXAxis', valueType: 'Double',
                    },
                    primaryYAxis: { title: 'PrimaryYAxis' },
                    series: [{
                        dataSource: [{ x: 10, y: 46 }, { x: 20, y: 27 }, { x: 30, y: 26 }, { x: 40, y: 16 }, { x: 50, y: 31 }],
                        xName: 'x', yName: 'y', marker: { visible: true }, type: 'Line'
                    }],
                    title: 'Chart Title', legendSettings: { visible: true }, width: '900',
                    zoomSettings: { enableSelectionZooming: true, enableScrollbar: true, mode: 'X' }
                }
            );
            chartObj.appendTo('#container');

        })
        afterAll((): void => {
            chartObj.destroy();
            ele.remove();
        });
        it('Mouse Down on Back Rect with animation', (done: Function) => {
            trigger.draganddropEvent(ele, 75, 150, 400, 400);
                let svgChildEle: Element = document.getElementById('scrollBar_svgprimaryXAxis').children[0];
                let currentTarget: Element = document.getElementById('scrollBarBackRect_primaryXAxis');
                let thumbEle: Element = document.getElementById('scrollBarThumb_primaryXAxis');
                let circleRadius: number = 8;
                chartObj.axisCollections[0].zoomingScrollBar.animateDuration = 10;
                chartObj.axisCollections[0].zoomingScrollBar.scrollMouseDown(<PointerEvent>(trigger.onTouchStart(currentTarget, 0, 0, 0, 0, 550, 390)));
                expect(svgChildEle).not.toBeNull();
                expect(svgChildEle.childElementCount).toBe(2);
                expect(svgChildEle.children[0].childElementCount).toBe(1);
                expect(svgChildEle.children[1].childElementCount).toBe(8);
                done();
           

        });});
});