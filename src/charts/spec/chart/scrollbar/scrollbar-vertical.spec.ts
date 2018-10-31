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
import { wheel } from './scrollbar-horizontal.spec'

Chart.Inject(LineSeries, ScrollBar, MultiLevelLabel, Crosshair);
let prevent: Function = (): void => {
    //Prevent Function
};

let trigger: MouseEvents = new MouseEvents();
describe('Scrollbar Chart', () => {
    let ele: HTMLElement;
    describe('Vertical Scrollbar Default', () => {
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
                    zoomSettings: { enableSelectionZooming: true, enableScrollbar: true, mode: 'Y' }
                }
            );
            chartObj.appendTo('#container');

        })
        afterAll((): void => {
            chartObj.destroy();
            ele.remove();
        });

        it('Checking module name', () => {
            expect(chartObj.axisCollections[1].zoomingScrollBar.getModuleName()).toBe('ScrollBar');
        });

        it('Checking svg element', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                trigger.draganddropEvent(ele, 200, 200, 350, 350);
                let scrollEle = document.getElementById('scrollBar_svgprimaryYAxis');
                expect(scrollEle.parentElement.id == 'container_scrollElement').toBe(true);
                expect(scrollEle != null).toBe(true);
                expect(scrollEle.getAttribute("width") == '16').toBe(true);
                expect(scrollEle.getAttribute("height") == '344.25' || scrollEle.getAttribute("height") == '351.25').toBe(true);
                expect(scrollEle.style.top == '45.25px' || scrollEle.style.top == '42.25px').toBe(true);
                expect(scrollEle.style.left == '57.5px' || scrollEle.style.left == '53.5px').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Child Element Count of SVG', () => {
            let svgChildEle: Element = document.getElementById('scrollBar_svgprimaryYAxis').children[0];
            expect(svgChildEle).not.toBeNull();
            expect(svgChildEle.childElementCount).toBe(2);
            expect(svgChildEle.children[0].childElementCount).toBe(1);
            expect(svgChildEle.children[1].childElementCount).toBe(8);
        });
        it('Back Rect Element check', () => {
            let svgChildEle: Element = document.getElementById('scrollBar_svgprimaryYAxis').children[0];
            let backRectEle: Element = svgChildEle.children[0].children[0];
            expect(svgChildEle.id === 'scrollBar_primaryYAxis').toBe(true)
            expect(svgChildEle.getAttribute('transform') === 'translate(16,0) rotate(90)').toBe(true);
            expect(backRectEle.getAttribute('x') === '0').toBe(true);
            expect(backRectEle.getAttribute('y') === '0').toBe(true);
            expect(backRectEle.getAttribute('height') === '16').toBe(true);
            expect(backRectEle.getAttribute('width') === '344.25' || backRectEle.getAttribute('width') === '351.25').toBe(true);
            expect(backRectEle.getAttribute('rx') === '0').toBe(true);
            expect(backRectEle.id === 'scrollBarBackRect_primaryYAxis').toBe(true);
        });
        it('Thumb Rect Element check', () => {
            let svgChildEle: Element = document.getElementById('scrollBar_svgprimaryYAxis').children[0];
            let thumbRectEle: Element = svgChildEle.children[1].children[0];
            expect(thumbRectEle.getAttribute('x') === '47.499999999999986' || thumbRectEle.getAttribute('x') === '51.50000000000001').toBe(true);
            expect(thumbRectEle.getAttribute('y') === '0').toBe(true);
            expect(thumbRectEle.getAttribute('height') === '16').toBe(true);
            expect(thumbRectEle.getAttribute('width') === '150').toBe(true);
            expect(thumbRectEle.id === 'scrollBarThumb_primaryYAxis').toBe(true);
        });
        it('Left Circle Element check', () => {
            let svgChildEle: Element = document.getElementById('scrollBar_svgprimaryYAxis').children[0];
            let leftCircle: Element = svgChildEle.children[1].children[2];
            expect(leftCircle.getAttribute('cx') === '47.499999999999986' || leftCircle.getAttribute('cx') === '51.50000000000001').toBe(true);
            expect(leftCircle.getAttribute('cy') === '8').toBe(true);
            expect(leftCircle.getAttribute('r') === '8').toBe(true);
            expect(leftCircle.id === 'scrollBar_leftCircle_primaryYAxis').toBe(true);
        });
        it('Right Circle Element check', () => {
            let svgChildEle: Element = document.getElementById('scrollBar_svgprimaryYAxis').children[0];
            let rightCircle: Element = svgChildEle.children[1].children[3];
            expect(rightCircle.getAttribute('cx') === '197.5' || rightCircle.getAttribute('cx') === '201.5').toBe(true);
            expect(rightCircle.getAttribute('cy') === '8').toBe(true);
            expect(rightCircle.getAttribute('r') === '8').toBe(true);
            expect(rightCircle.id === 'scrollBar_rightCircle_primaryYAxis').toBe(true);
        });
        it('Left Arrow Element check', () => {
            let svgChildEle: Element = document.getElementById('scrollBar_svgprimaryYAxis').children[0];
            let leftArrow: Element = svgChildEle.children[1].children[5];
            expect(leftArrow.getAttribute('d') === 'M 44.499999999999986 8 L 49.499999999999986 11 L 49.499999999999986 5 Z' ||
                leftArrow.getAttribute('d') === 'M 47.50000000000001 8 L 53.50000000000001 12 L 53.50000000000001 4 Z' ||
                leftArrow.getAttribute('d') === 'M 48.50000000000001 8 L 53.50000000000001 11 L 53.50000000000001 5 Z').toBe(true);
            expect(leftArrow.id === 'scrollBar_leftArrow_primaryYAxis').toBe(true);
        });
        it('Right Arrow Element check', () => {
            let svgChildEle: Element = document.getElementById('scrollBar_svgprimaryYAxis').children[0];
            let rightArrow: Element = svgChildEle.children[1].children[6];
            expect(rightArrow.getAttribute('d') === 'M 201.5 8 L 195.5 12 L 195.5 4 Z' ||
                rightArrow.getAttribute('d') === 'M 205.5 8 L 199.5 12 L 199.5 4 Z' ||
                rightArrow.getAttribute('d') === 'M 201 8 L 195.5 11.5 L 195.5 4.5 Z' ||
                rightArrow.getAttribute('d') === 'M 205 8 L 199.5 11.5 L 199.5 4.5 Z').toBe(true);
            expect(rightArrow.id === 'scrollBar_rightArrow_primaryYAxis').toBe(true);
        });
        it('1st Grip Circle Element check', () => {
            let gripCircle: Element = document.getElementById('scrollBar_gripCircle1_primaryYAxis');
            let cx: string = gripCircle.getAttribute('cx');
            expect(cx === '0').toBe(true);
            expect(gripCircle.getAttribute('cy') === '0').toBe(true);
            expect(gripCircle.getAttribute('r') === '1').toBe(true);
        });
        it('2nd Grip Circle Element check', () => {
            let gripCircle: Element = document.getElementById('scrollBar_gripCircle2_primaryYAxis');
            let cx: string = gripCircle.getAttribute('cx');
            expect(cx === '5').toBe(true);
            expect(gripCircle.getAttribute('cy') === '0').toBe(true);
            expect(gripCircle.getAttribute('r') === '1').toBe(true);
        });
        it('3rd Grip Circle Element check', () => {
            let gripCircle: Element = document.getElementById('scrollBar_gripCircle3_primaryYAxis');
            let cx: string = gripCircle.getAttribute('cx');
            expect(cx === '10').toBe(true);
            expect(gripCircle.getAttribute('cy') === '0').toBe(true);
            expect(gripCircle.getAttribute('r') === '1').toBe(true);
        });
        it('4th Grip Circle Element check', () => {
            let gripCircle: Element = document.getElementById('scrollBar_gripCircle4_primaryYAxis');
            let cx: string = gripCircle.getAttribute('cx');
            expect(cx === '0').toBe(true);
            expect(gripCircle.getAttribute('cy') === '5').toBe(true);
            expect(gripCircle.getAttribute('r') === '1').toBe(true);
        });
        it('5th Grip Circle Element check', () => {
            let gripCircle: Element = document.getElementById('scrollBar_gripCircle5_primaryYAxis');
            let cx: string = gripCircle.getAttribute('cx');
            expect(cx === '5').toBe(true);
            expect(gripCircle.getAttribute('cy') === '5').toBe(true);
            expect(gripCircle.getAttribute('r') === '1').toBe(true);
        });
        it('6th Grip Circle Element check', () => {
            let gripCircle: Element = document.getElementById('scrollBar_gripCircle6_primaryYAxis');
            let cx: string = gripCircle.getAttribute('cx');
            expect(cx === '10').toBe(true);
            expect(gripCircle.getAttribute('cy') === '5').toBe(true);
            expect(gripCircle.getAttribute('r') === '1').toBe(true);
        });
        it('Grip Circle Group Element', ()=>{
            let gripGroup: Element = document.getElementById('scrollBar_gripCircle_primaryYAxis');
            let transform: string = gripGroup.getAttribute('transform');
            expect(transform === 'translate(122.49999999999999,9) rotate(180)' || transform === 'translate(126.5,9) rotate(180)'
            || transform === 'translate(127.49999999999999,10) rotate(180)' || transform === 'translate(131.5,10) rotate(180)').toBe(true);
        });
        it('Chart Element with Scrollbar', () => {
            let chartAreaHt: string = document.getElementById('container_ChartAreaBorder').getAttribute('height');
            let majorTick: string = document.getElementById('container_MajorTickLine_1').getAttribute('d').split('M ')[1];
            let yAxisLabel: Element = document.getElementById('container1_AxisLabel_0');
            let yAxisTitle: Element = document.getElementById('container_AxisTitle_1');
            expect(chartAreaHt === '344.25' || chartAreaHt === '351.25').toBe(true);
            expect(majorTick === '73 340.50174999999996 L 52 340.50174999999996 ' || majorTick === '69 349.59375 L 48 349.59375 ').toBe(true);
            expect(yAxisLabel.getAttribute('x') === '47' || yAxisLabel.getAttribute('x') === '43').toBe(true);
            expect(yAxisLabel.getAttribute('y') === '344' || yAxisLabel.getAttribute('y') === '352.75').toBe(true);
            expect(yAxisLabel.innerHTML === '10').toBe(true);
            expect(yAxisTitle.getAttribute('x') === '29.5' || yAxisTitle.getAttribute('x') === '26.5').toBe(true);
            expect(yAxisTitle.getAttribute('y') === '212.375' || yAxisTitle.getAttribute('y') === '212.875').toBe(true);
        });
    });

    describe('Vertical Scrollbar with Labels, Ticks and Border ', () => {
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
                    zoomSettings: { enableSelectionZooming: true, enableScrollbar: true, mode: 'Y' }
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
                let scrollEle = document.getElementById('scrollBar_svgprimaryYAxis');
                expect(scrollEle.parentElement.id == 'container_scrollElement').toBe(true);
                expect(scrollEle != null).toBe(true);
                expect(scrollEle.getAttribute('width') == '16').toBe(true);
                expect(scrollEle.getAttribute('height') == '375.25' || scrollEle.getAttribute('height') == '381.25').toBe(true);
                expect(scrollEle.style.top == '45.25px' || scrollEle.style.top == '42.25px').toBe(true);
                expect(scrollEle.style.left == '57.5px' || scrollEle.style.left == '53.5px').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Ticks and Labels Position Check', (done: Function) => {
            let chartAreaHt: string = document.getElementById('container_ChartAreaBorder').getAttribute('height');
            let majorTick: string = document.getElementById('container_MajorTickLine_0').getAttribute('d').split('M ')[1];
            let yAxisLabel: Element = document.getElementById('container1_AxisLabel_0');
            let yAxisTitle: Element = document.getElementById('container_AxisTitle_1');
            expect(chartAreaHt === '375.25' || chartAreaHt === '381.25').toBe(true);
            expect(majorTick === '73.5 421 L 73.5 415 ' || majorTick === '69.5 424 L 69.5 418 ').toBe(true);
            expect(yAxisLabel.getAttribute('x') === '47' || yAxisLabel.getAttribute('x') === '43').toBe(true);
            expect(yAxisLabel.getAttribute('y') === '420' || yAxisLabel.getAttribute('y') === '390.75').toBe(true);
            expect(yAxisLabel.innerHTML === '4' || yAxisLabel.innerHTML === '6').toBe(true);
            expect(yAxisTitle.getAttribute('x') === '29.5' || yAxisTitle.getAttribute('x') === '26.5').toBe(true);
            expect(yAxisTitle.getAttribute('y') === '227.875').toBe(true);
            done();
        });

        it('Y Axis Labels Border Outside', function (done) {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                trigger.draganddropEvent(ele, 200, 250, 350, 400);
                let border: string = document.getElementById('container_BorderLine_1').getAttribute('d').split('M ')[1];
                expect(border === '57.5 411 L 29.5 411 L 29.5 364 ' || border === '26.5 423.5 L 26.5 386 ').toBe(true);
                done();
            };
            chartObj.primaryYAxis.labelPosition = 'Outside';
            chartObj.primaryYAxis.tickPosition = 'Outside';
            chartObj.primaryYAxis.border.width = 1;
            chartObj.primaryYAxis.border.color = 'Red';
            chartObj.loaded = loaded;
            chartObj.refresh();

        });
        it('Y Axis Labels Border Inside', function (done) {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                trigger.draganddropEvent(ele, 200, 250, 350, 400);
                let border: string = document.getElementById('container_BorderLine_1').getAttribute('d').split('M ')[1];
                expect(border === '75.5 420.5 L 75.5 381 ' || border === '76.5 420.5 L 76.5 381 ' ||
                    border === '72.5 423.5 L 72.5 379 ').toBe(true);
                done();

            };
            chartObj.primaryYAxis.labelPosition = 'Inside';
            chartObj.primaryYAxis.tickPosition = 'Inside';
            chartObj.primaryYAxis.border.width = 1;
            chartObj.primaryYAxis.border.color = 'Red';
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
                    primaryXAxis: { title: 'PrimaryXAxis', valueType: 'Double' },
                    primaryYAxis: { title: 'PrimaryYAxis', crossesAt: 15 },
                    series: [{
                        dataSource: [{ x: 10, y: 46 }, { x: 20, y: 27 }, { x: 30, y: 26 }, { x: 40, y: 16 }, { x: 50, y: 31 }],
                        xName: 'x', yName: 'y', marker: { visible: true }, type: 'Line'
                    }],
                    title: 'Chart Title',
                    legendSettings: { visible: true },
                    width: '900',
                    zoomSettings: { enableSelectionZooming: true, enableScrollbar: true, mode: 'Y' }
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
                let scrollEle = document.getElementById('scrollBar_svgprimaryYAxis');
                expect(scrollEle.parentElement.id == 'container_scrollElement').toBe(true);
                expect(scrollEle != null).toBe(true);
                expect(scrollEle.getAttribute('width') == '16').toBe(true);
                expect(scrollEle.getAttribute('height') == '344.25' || scrollEle.getAttribute('height') == '351.25').toBe(true);
                expect(scrollEle.style.top == '45.25px' || scrollEle.style.top == '42.25px').toBe(true);
                expect(scrollEle.style.left == '0.5px').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Ticks and Labels Position Check', (done: Function) => {
            let chartAreaHt: string = document.getElementById('container_ChartAreaBorder').getAttribute('height');
            let majorTick: string = document.getElementById('container_MajorTickLine_1').getAttribute('d').split('M ')[1];
            let yAxisLabel: Element = document.getElementById('container1_AxisLabel_0');
            let yAxisTitle: Element = document.getElementById('container_AxisTitle_1');
            expect(chartAreaHt === '344.25' || chartAreaHt === '351.25').toBe(true);
            expect(majorTick === '125.1875 389.5 L 120.1875 389.5 ' || majorTick === '125.1875 314.76145833333334 L 120.1875 314.76145833333334 ').toBe(true);
            expect(yAxisLabel.getAttribute('x') === '115.1875').toBe(true);
            expect(yAxisLabel.getAttribute('y') === '393' || yAxisLabel.getAttribute('y') === '317.75').toBe(true);
            expect(yAxisLabel.innerHTML === '0' || yAxisLabel.innerHTML === '5').toBe(true);
            expect(yAxisTitle.getAttribute('x') === '81.6875' || yAxisTitle.getAttribute('x') === '82.6875').toBe(true);
            expect(yAxisTitle.getAttribute('y') === '212.375' || yAxisTitle.getAttribute('y') === '212.875').toBe(true);
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
                    },
                    primaryYAxis: {
                        title: 'PrimaryYAxis',
                        multiLevelLabels: [{
                            border: { type: 'Rectangle' },
                            categories: [{ start: 5, end: 10, text: 'Label 1', }, { start: 10, end: 15, text: 'Label 2', }]
                        }]
                    },
                    series: [{
                        dataSource: [{ x: 10, y: 46 }, { x: 20, y: 27 }, { x: 30, y: 26 }, { x: 40, y: 16 }, { x: 50, y: 31 }],
                        xName: 'x', yName: 'y', marker: { visible: true }, type: 'Line'
                    }],
                    title: 'Chart Title', legendSettings: { visible: true }, width: '900',
                    zoomSettings: { enableSelectionZooming: true, enableScrollbar: true, mode: 'Y' }
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
                let mulitiLevelLabel: Element = document.getElementById('container1_Axis_MultiLevelLabel_Level_0_Text_0');
                let border: string = document.getElementById('container1_Axis_MultiLevelLabel_Rect_0').getAttribute('d').split('M')[1];
                expect(mulitiLevelLabel.getAttribute('x') === '59.5' || mulitiLevelLabel.getAttribute('x') === '55.5').toBe(true);
                expect(mulitiLevelLabel.getAttribute('y') === '321.6769318181818' || mulitiLevelLabel.getAttribute('y') === '325.3315625').toBe(true);
                expect(border === '84.5 293.7359090909091L34.5 293.7359090909091' || border === '79.5 296.90625L31.5 296.90625').toBe(true)
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Label and Border Position - Outside', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                let mulitiLevelLabel: Element = document.getElementById('container1_Axis_MultiLevelLabel_Level_0_Text_0');
                let border: string = document.getElementById('container1_Axis_MultiLevelLabel_Rect_0').getAttribute('d').split('M')[1];
                expect(mulitiLevelLabel.getAttribute('x') === '82.5' || mulitiLevelLabel.getAttribute('x') === '77.5').toBe(true);
                expect(mulitiLevelLabel.getAttribute('y') === '321.6769318181818' || mulitiLevelLabel.getAttribute('y') === '325.3315625').toBe(true);
                expect(border === '57.5 293.7359090909091L107.5 293.7359090909091' ||
                    border === '53.5 296.90625L101.5 296.90625').toBe(true)
                done();
            };
            chartObj.primaryYAxis.labelPosition = 'Inside';
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
                    },
                    crosshair: { enable: true },
                    primaryYAxis: { title: 'PrimaryYAxis', crosshairTooltip: { enable: true } },
                    series: [{
                        dataSource: [{ x: 10, y: 46 }, { x: 20, y: 27 }, { x: 30, y: 26 }, { x: 40, y: 16 }, { x: 50, y: 31 }],
                        xName: 'x', yName: 'y', marker: { visible: true }, type: 'Line'
                    }],
                    title: 'Chart Title', legendSettings: { visible: true }, width: '900',
                    zoomSettings: { enableSelectionZooming: true, enableScrollbar: true, mode: 'Y' }
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
                let crossHairEle: string = document.getElementById('container_axis_tooltip_1').getAttribute('d').split(' L')[0];
                expect(crossHairEle === 'M 0 206.5 Q 0 204.5 2 204.5' || crossHairEle === 'M 0 207 Q 0 205 2 205').toBe(true);
                let text: string = document.getElementById('container_axis_tooltip_text_1').innerHTML;
                expect(text === '17.909' || text === '17.994').toBe(true);
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
                    zoomSettings: { enableSelectionZooming: true, enableScrollbar: true, mode: 'Y' }
                }
            );
            chartObj.appendTo('#container');

        })
        afterAll((): void => {
            chartObj.destroy();
            ele.remove();
        });

        it('Mouse Move with Thumb', (done: Function) => {
            trigger.draganddropEvent(ele, 150, 150, 250, 270);
            let currentTarget: Element = document.getElementById('scrollBarThumb_primaryYAxis');
            chartObj.axisCollections[1].zoomingScrollBar.scrollMouseDown(<PointerEvent>(trigger.onTouchStart(currentTarget, 0, 0, 0, 0, 75, 220)));
            chartObj.axisCollections[1].zoomingScrollBar.scrollMouseMove(<PointerEvent>(trigger.onTouchMove(currentTarget, 0, 0, 0, 0, 75, 275)));
            let thumbEle: Element = document.getElementById('scrollBarThumb_primaryYAxis');
            expect(thumbEle.getAttribute('x') === '182.5' || thumbEle.getAttribute('x') === '186.49999999999997').toBe(true);
            expect(thumbEle.getAttribute('width') === '120').toBe(true);
            chartObj.axisCollections[1].zoomingScrollBar.scrollMouseUp(<PointerEvent>(trigger.onTouchEnd(currentTarget, 0, 0, 0, 0, 75, 275)));
            done();
        });

        it('Right Resize using Circle', (done: Function) => {
            let currentTarget: Element = document.getElementById('scrollBar_rightCircle_primaryYAxis');
            chartObj.axisCollections[1].zoomingScrollBar.scrollMouseDown(<PointerEvent>(trigger.onTouchStart(currentTarget, 0, 0, 0, 0, 75, 355)));
            chartObj.axisCollections[1].zoomingScrollBar.scrollMouseMove(<PointerEvent>(trigger.onTouchMove(currentTarget, 0, 0, 0, 0, 650, 380)));
            let thumbEle: Element = document.getElementById('scrollBarThumb_primaryYAxis');
            expect(thumbEle.getAttribute('x') === '182.5' || thumbEle.getAttribute('x') === '186.49999999999997').toBe(true);
            expect(thumbEle.getAttribute('width') === '144.25' || thumbEle.getAttribute('width') === '143.25000000000003').toBe(true);
            chartObj.axisCollections[1].zoomingScrollBar.scrollMouseMove(<PointerEvent>(trigger.onTouchMove(currentTarget, 0, 0, 0, 0, 75, 355)));
            expect(thumbEle.getAttribute('x') === '182.5' || thumbEle.getAttribute('x') === '186.49999999999997').toBe(true);
            expect(thumbEle.getAttribute('width') === '119.25' || thumbEle.getAttribute('width') === '118.25000000000003').toBe(true);
            chartObj.axisCollections[1].zoomingScrollBar.scrollMouseUp(<PointerEvent>(trigger.onTouchEnd(currentTarget, 0, 0, 0, 0, 75, 355)));
            done();
        });
        it('Left Resize using Circle', (done: Function) => {
            let currentTarget: Element = document.getElementById('scrollBar_leftCircle_primaryYAxis');
            chartObj.axisCollections[1].zoomingScrollBar.scrollMouseDown(<PointerEvent>(trigger.onTouchStart(currentTarget, 0, 0, 0, 0, 75, 235)));
            chartObj.axisCollections[1].zoomingScrollBar.scrollMouseMove(<PointerEvent>(trigger.onTouchMove(currentTarget, 0, 0, 0, 0, 75, 190)));
            let thumbEle: Element = document.getElementById('scrollBarThumb_primaryYAxis');
            expect(thumbEle.getAttribute('x') === '137.5' || thumbEle.getAttribute('x') === '141.49999999999997').toBe(true);
            expect(thumbEle.getAttribute('width') === '164.25' || thumbEle.getAttribute('width') === '163.25000000000003').toBe(true);
            chartObj.axisCollections[1].zoomingScrollBar.scrollMouseMove(<PointerEvent>(trigger.onTouchMove(currentTarget, 0, 0, 0, 0, 75, 235)));
            expect(thumbEle.getAttribute('x') === '182.5' || thumbEle.getAttribute('x') === '186.49999999999997').toBe(true);
            expect(thumbEle.getAttribute('width') === '119.25' || thumbEle.getAttribute('width') === '118.25000000000003').toBe(true);
            done();
        });

        it('Checking mouse wheel as forward', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                trigger.draganddropEvent(ele, 150, 150, 250, 270);
                let wheelArgs: wheel = {
                    preventDefault: prevent,
                    wheelDelta: 120,
                    detail: 0,
                    clientX: 210,
                    clientY: 100
                };
                chartObj.axisCollections[1].zoomingScrollBar.scrollMouseWheel(<WheelEvent>wheelArgs);
                let thumbEle: Element = document.getElementById('scrollBarThumb_primaryYAxis');
                expect(thumbEle.getAttribute('x') === '227.71934101437492' || thumbEle.getAttribute('x') === '231.7393114045904').toBe(true);
                expect(thumbEle.getAttribute('width') === '41.568627450980394' || thumbEle.getAttribute('width') === '40.39857651245553').toBe(true);
                done();
            };
            chartObj.zoomSettings.enableMouseWheelZooming = true;
            chartObj.loaded = loaded;
            chartObj.refresh();
        });

        it('Checking mouse wheel as backward ', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                trigger.draganddropEvent(ele, 150, 150, 250, 270);
                let wheelArgs: wheel = {
                    preventDefault: prevent,
                    wheelDelta: -120,
                    detail: 3,
                    clientX: 310,
                    clientY: 100
                };
                chartObj.axisCollections[1].zoomingScrollBar.scrollMouseWheel(<WheelEvent>wheelArgs);
                let thumbEle: Element = document.getElementById('scrollBarThumb_primaryYAxis');
                expect(thumbEle.getAttribute('x') === '242.5385384348554' || thumbEle.getAttribute('x') === '246.32987733252972').toBe(true);
                expect(thumbEle.getAttribute('width') === '40').toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
    });
});