/**
 * Chart spec document
 */

import { createElement, L10n, remove } from '@syncfusion/ej2-base';
import { Chart } from '../../../src/chart/chart';
import { Zoom } from '../../../src/chart/user-interaction/zooming';
import { LineSeries } from '../../../src/chart/series/line-series';
import { unbindResizeEvents } from '../base/data.spec';
import { ColumnSeries } from '../../../src/chart/series/column-series';
import { DataLabel } from '../../../src/chart/series/data-label';
import { seriesData1 } from '../base/data.spec';
import { EmitType } from '@syncfusion/ej2-base';
import { MouseEvents } from '../../chart/base/events.spec';
import { wheel } from '../../chart/user-interaction/zooming.spec';
import { ILoadedEventArgs } from '../../../src/common/model/interface';
Chart.Inject(LineSeries, Zoom, ColumnSeries, DataLabel);



describe('Chart Control', () => {
    describe('Chart direct properties and its behavior', () => {
        let chart: Chart;
        let ele: HTMLElement;
        let svg: HTMLElement;
        let text: HTMLElement;
        let trigger: MouseEvents = new MouseEvents();
        let loaded: EmitType<ILoadedEventArgs>;
        beforeAll((): void => {
            ele = createElement('div', { id: 'container' });
            document.body.appendChild(ele);
            chart = new Chart();
        });

        afterAll((): void => {
            chart.destroy();
            ele.remove();
        });
        it('Checking chart instance creation', (done: Function) => {
            loaded = (args: Object): void => {
                expect(chart != null).toBe(true);
                done();
            }
            chart.loaded = loaded;
            chart.appendTo('#container');
        });
        it('Checking with empty options', () => {
            let className: string = document.getElementById('container').className;
            expect(className).toEqual('e-control e-chart e-touch');
        });
        it('Checking module name', () => {
            expect(chart.getModuleName()).toBe('chart');
        });
        it('Checking with empty size property', () => {
            svg = document.getElementById('container_svg');
            expect(svg.getAttribute('width') != null).toBe(true);
        });
        it('Checking the null height of the chart', () => {
            svg = document.getElementById('container_svg');
            expect(svg.getAttribute('height')).toEqual('450');
        });
        it('Checking the null width of the chart', (done: Function) => {
            chart.width = null;
            ele.setAttribute('style', 'width:0px');
            chart.loaded = (args: Object) => {
                svg = document.getElementById('container_svg');
                expect(svg.getAttribute('width')).toEqual('600');
                done();
            };
            chart.getPersistData();
            chart.refresh();

        });
        it('Checking the percentage size of the chart', (done: Function) => {
            chart.width = '50%';
            ele.setAttribute('style', 'width:900px');
            chart.loaded = (args: Object) => {
                svg = document.getElementById('container_svg');
                expect(svg.getAttribute('width')).toEqual('450');
                done();
            };
            chart.refresh();

        });
        it('Checking the width of the chart', () => {
            chart.width = '500';
            chart.loaded = null;
            chart.dataBind();

            svg = document.getElementById('container_svg');
            expect(svg.getAttribute('width')).toEqual('500');
        });
        it('Checking the height of the chart', () => {
            chart.height = '500';
            chart.dataBind();

            svg = document.getElementById('container_svg');
            expect(svg.getAttribute('height')).toEqual('500');
        });
        it('Checking both height and width of the chart', () => {
            chart.width = '500';
            chart.height = '300';
            chart.dataBind();

            svg = document.getElementById('container_svg');
            expect(svg.getAttribute('width')).toEqual('500');
            expect(svg.getAttribute('height')).toEqual('300');
        });
        it('Checking with empty title', () => {
            text = document.getElementById('container_ChartTitle');
            expect(text == null).toBe(true);
        });
        it('Checking with  title', () => {
            chart.title = 'Syncfusion Chart Title';
            chart.dataBind();
            text = document.getElementById('container_ChartTitle');
            expect(text.textContent == 'Syncfusion Chart Title').toBe(true);            
            expect(text.getAttribute('y') == '25' || text.getAttribute('y') == '22.75').toBe(true);
        });
        it('Checking textoverflow title none', () => {
            chart.width = '100px';
            chart.title = 'Efficiency of oil-fired power production';
            chart.titleStyle.textOverflow = 'None';
            chart.dataBind();
            text = document.getElementById('container_ChartTitle');
            expect(text.getAttribute('text-anchor')).toBe('middle');
            expect(text.getAttribute('y') == '25' || text.getAttribute('y') == '22.75').toBe(true);
        });
        it('Checking textoverflow title wrap', () => {
            chart.titleStyle.textOverflow = 'Wrap';
            chart.dataBind();
            text = document.getElementById('container_ChartTitle');
            expect(text.getAttribute('y') == '25' || text.getAttribute('y') == '22.75').toBe(true);
        });
        it('Checking textoverflow title wrapwithtrim', () => {
            chart.title = 'Efficiency of oil-fired power productionchart';
            chart.dataBind();
            text = document.getElementById('container_ChartTitle');
            expect(text.textContent.indexOf('...') != -1).toBe(true);
            expect(text.getAttribute('y') == '25' || text.getAttribute('y') == '22.75').toBe(true);
        });

        it('Checking textoverflow title trim', () => {
            chart.titleStyle.textOverflow = 'Trim';
            chart.dataBind();
            text = document.getElementById('container_ChartTitle');
            expect(text.textContent.indexOf('...') != -1).toBe(true);
            expect(text.getAttribute('text-anchor')).toBe('middle');
            expect(text.getAttribute('y') == '25' || text.getAttribute('y') == '22.75').toBe(true);
        });
        it('Checking title trim', () => {
            chart.title = 'candidate joined in a year syncfusion Chart Title';
            chart.width = '100';
            chart.dataBind();

            text = document.getElementById('container_ChartTitle');
            expect(text.textContent.indexOf('...') != -1).toBe(true);
        });

        it('Trimmed text and mouse over and out', (done: Function) => {
            loaded = (args: Object): void => {
                chart.loaded = null;
                text = document.getElementById('container_ChartTitle');
                trigger.mousemoveEvent(text, 0, 0, 77, 25);
                let tooltip: Element = document.getElementById('container_EJ2_Title_Tooltip');
                expect(tooltip.textContent).toBe('candidate joined in a year syncfusion Chart Title');
                expect(text.textContent.split('...').length).toEqual(2);
                tooltip.remove();
                chart.mouseEnd(<PointerEvent>trigger.onTouchEnd(text, 0, 0, null, null, 77, 25));
                tooltip = document.getElementById('container_EJ2_Title_Tooltip');
                expect(tooltip.textContent).toBe('candidate joined in a year syncfusion Chart Title');
                expect(text.textContent.split('...').length).toEqual(2);
                tooltip.remove();
                //document.body.removeChild(tooltip);
                done();
            };
            chart.width = '80';
            chart.title = 'candidate joined in a year syncfusion Chart Title';
            chart.loaded = loaded;
            chart.refresh();
        });

        it('Trimmed text and mouse over and out for subtitle', (done: Function) => {
            loaded = (args: Object): void => {
                chart.loaded = null;
                text = document.getElementById('container_ChartSubTitle');
                trigger.mousemoveEvent(text, 0, 0, 77, 25);
                let tooltip: Element = document.getElementById('container_EJ2_Title_Tooltip');
                expect(tooltip.textContent).toBe('syncfusion Chart SubTitle');
                tooltip.remove();
                done();
            };
            chart.width = '80';
            chart.subTitle = 'syncfusion Chart SubTitle';
            chart.isTouch=false;
            chart.loaded= loaded;
            chart.refresh();
        });

        it('Checking the title font size', () => {
            chart.title = 'Chart Title';
            chart.titleStyle.size = '24px';
            chart.dataBind();
            text = document.getElementById('container_ChartTitle');
            expect(text.getAttribute('font-size')).toEqual('24px');
        });
       it('Checking with  subtitle', function () {
            chart.width = '500px';
            chart.subTitle = 'Chart SubTitle';
            chart.dataBind();
            text = document.getElementById('container_ChartSubTitle');
            expect(text.textContent == 'Chart SubTitle').toBe(true);
            expect(text.getAttribute('y') == '54.5' || text.getAttribute('y') == '49.25').toBe(true);
       });

        it('Checking textoverflow subtitle none', function () {
            chart.subTitle = 'SubTitle';
            chart.titleStyle.textOverflow = 'None';
            chart.dataBind();
            text = document.getElementById('container_ChartSubTitle');
            expect(text.textContent == 'SubTitle').toBe(true);
            expect(text.getAttribute('y') == '54.5' || text.getAttribute('y') == '49.25').toBe(true);
        });

        it('Checking textoverflow subtitle trim', function () {
            chart.width = '100px';
            chart.subTitle = 'Syncfusion Chart SubTitle';
            chart.subTitleStyle.textOverflow = 'Trim';
            chart.dataBind();
            text = document.getElementById('container_ChartSubTitle');
            expect(text.textContent.indexOf('...') != -1).toBe(true);
            expect(text.getAttribute('y') == '54.5' || text.getAttribute('y') == '49.25').toBe(true);
        });

        it('Checking textoverflow subtitle wrap', function () {
            chart.subTitleStyle.textOverflow = 'Wrap';
            chart.dataBind();
            text = document.getElementById('container_ChartSubTitle');
            expect(text.childNodes.length == 2).toBe(true);
            expect(text.getAttribute('y') == '54.5' || text.getAttribute('y') == '49.25').toBe(true);
        });

        it('Checking textAlignment subtitle center and subtitle is in Title width', function () {
                chart.width = '500px';
                chart.title = 'Syncfusion Chart SubTitle';
                chart.subTitle = 'Checking Syncfusion Chart SubTitle width should be in Chart Title width';
                chart.subTitleStyle.textOverflow = 'Trim';
                chart.titleStyle.textOverflow = 'Wrap';
                chart.dataBind();
                text = document.getElementById('container_ChartSubTitle');
                expect(text.textContent.indexOf('...') != -1).toBe(true);
                expect(text.getAttribute('text-anchor')).toBe('middle');
            });

        it('Checking textAlignment subtitle Far', function () {
            chart.subTitleStyle.textAlignment = 'Far';
            chart.dataBind();
            text = document.getElementById('container_ChartSubTitle');
            expect(text.getAttribute('text-anchor')).toBe('end');
        });

        it('Checking textAlignment subtitle Near', function () {
            chart.subTitleStyle.textAlignment = 'Near';
            chart.dataBind();
            text = document.getElementById('container_ChartSubTitle');
            expect(text.getAttribute('text-anchor')).toBe('start');
        });

        it('Checking the subtitle font size', () => {
            chart.subTitleStyle.size = '20px';
            chart.dataBind();
            text = document.getElementById('container_ChartSubTitle');
            expect(text.getAttribute('font-size')).toEqual('20px');
        });

         it('Checking with empty subtitle', function () {
            chart.subTitle= '';
            chart.dataBind();
            text = document.getElementById('container_ChartSubTitle');
            expect(text == null).toBe(true);
        });

        it('Checking the border color', () => {
            chart.border.width = 2;
            chart.border.color = 'green';
            chart.dataBind();
            svg = document.getElementById('container_ChartBorder');
            expect(svg.getAttribute('stroke') == 'green').toBe(true);
            expect(svg.getAttribute('stroke-width') == '2').toBe(true);
        });

        it('Checking the Chart Area border color', () => {
            chart.chartArea.border.color = 'red';
            chart.chartArea.background = 'green';
            chart.chartArea.opacity = 0.5;
            chart.dataBind();
            svg = document.getElementById('container_ChartAreaBorder');
            expect(svg.getAttribute('stroke') == 'red').toBe(true);
            expect(svg.getAttribute('fill') == 'green').toBe(true);
            expect(svg.getAttribute('opacity') == '0.5').toBe(true);
        });
        it('Checking the Chart background', () => {
            chart.background = 'yellow';
            chart.dataBind();
            svg = document.getElementById('container_ChartBorder');
            expect(svg.getAttribute('fill') == 'yellow').toBe(true);
        });

        it('Checking context menu event', () => {
            let menu: Event = document.createEvent('MouseEvent');
            menu.initEvent('contextmenu', true, false);
            ele.dispatchEvent(menu);
            expect(ele).not.toBe(null);
        });

        it('Checking the chart Orientation', () => {
            expect(chart.isOrientation()).toBe(false);
        });

       it('checking with title alignment default', (done: Function) => {
            loaded = (args: ILoadedEventArgs) => {
                text = document.getElementById('container_ChartTitle');
                expect(text.getAttribute('text-anchor')).toBe('middle');
                expect(text.getAttribute('x') == text.children[0].getAttribute('x')).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.title = 'EfficiencyChart of oil power productionchart';
            chart.titleStyle.textOverflow = 'Wrap';
            chart.width = '300';
            chart.refresh();
        });
        it('checking with title alignment Far', () => {
            chart.titleStyle.textAlignment = 'Far';
            chart.loaded = null;
            chart.dataBind();
            text = document.getElementById('container_ChartTitle');
            expect(text.getAttribute('text-anchor')).toBe('end');
            expect(text.getAttribute('x') == text.children[0].getAttribute('x')).toBe(true);
        });
        it('checking with title alignment Near', () => {
            chart.titleStyle.textAlignment = 'Near';
            chart.dataBind();
            text = document.getElementById('container_ChartTitle');
            expect(text.getAttribute('text-anchor')).toBe('start');
            expect(text.getAttribute('x') == text.children[0].getAttribute('x')).toBe(true);
        });
    });
    describe('Chart checking localization', () => {
        L10n.load({
            'de-DE': {
                'chart': {
                    ZoomIn: 'تكبير',
                    ZoomOut: 'تصغير',
                    Zoom: 'زوم',
                    Pan: 'مقلاة',
                    Reset: 'إعادة تعيين'
                },
            }
        });
        let chart: Chart;
        let ele: HTMLElement;
        let svg: HTMLElement;
        let text: HTMLElement;
        let trigger: MouseEvents = new MouseEvents();
        let loaded: EmitType<ILoadedEventArgs>;
        beforeAll((): void => {
            ele = createElement('div', { id: 'container' });
            document.body.appendChild(ele);
            chart = new Chart();
            chart.appendTo('#container');
        });

        afterAll((): void => {
            chart.destroy();
            ele.remove();
        });
        it('checking zooming tooltit with localization', (done: Function) => {
            loaded = (args: ILoadedEventArgs) => {
                chart.loaded = null;
                trigger.draganddropEvent(ele, 100, 100, 400, 400);
                let targetElement = document.getElementById('container_Zooming_KitCollection');
                trigger.mousemoveEvent(targetElement, 800, 10, 805, 15);
                targetElement = document.getElementById('container_Zooming_Zoom');
                trigger.mouseoverEvent(targetElement);
                expect(document.getElementById('EJ2_Chart_ZoomTip').innerHTML).toEqual("&nbsp;زوم&nbsp;");
                done();
            };
            chart.loaded = loaded;
            chart.zoomSettings = {
                enablePinchZooming: true, enableDeferredZooming: true,
                enableMouseWheelZooming: true, enableSelectionZooming: true
            };
            chart.locale = 'de-DE';
            chart.refresh();
        });
        it('checking zooming tooltit without localization', () => {
            remove(document.getElementById('EJ2_Chart_ZoomTip'));
            chart.locale = '';
            chart.dataBind();

            trigger.draganddropEvent(ele, 100, 100, 400, 400);
            let targetElement = document.getElementById('container_Zooming_KitCollection');
            trigger.mousemoveEvent(targetElement, 800, 10, 805, 15);
            targetElement = document.getElementById('container_Zooming_Zoom');
            trigger.mouseoverEvent(targetElement);
            expect(document.getElementById('EJ2_Chart_ZoomTip').innerHTML).toEqual("&nbsp;Zoom&nbsp;");
        });
    });
    describe('Chart checking center aligned div', () => {
        let chart: Chart;
        let ele: HTMLElement;
        let svg: HTMLElement;
        let text: HTMLElement;
        let trigger: MouseEvents = new MouseEvents();
        let loaded: EmitType<ILoadedEventArgs>;
        beforeAll((): void => {
            ele = createElement('div', { id: 'container' });
            ele.setAttribute('align', 'center');
            document.body.appendChild(ele);
            chart = new Chart({
                series: [
                    {
                        dataSource: seriesData1, xName: 'x', yName: 'y', fill: 'orange', opacity: 0.7,
                        type: 'Column',
                        animation: { enable: false},
                        marker: {
                            dataLabel: {
                                visible: true,
                                position: 'Top',
                                template: '<div style="background-color:#ed7d31;border-radius: 3px;">${point.y}Million</div>'
                            }
                        }
                    }
                ],
                zoomSettings: {
                    enableSelectionZooming: true,
                    enableMouseWheelZooming: true,
                },
                width: '400px'
            });
            chart.appendTo('#container');
        });

        afterAll((): void => {
            chart.destroy();
            ele.remove();
        });
        it('checking data label template and zooming', (done: Function) => {
            let wheelArgs: wheel = {
                preventDefault: () => {
                    // not applicable
                },
                wheelDelta: 120,
                detail: 3,
                clientX: 210,
                clientY: 100
            };
            loaded = (args: ILoadedEventArgs) => {
                chart.loaded = null;
                let secondaryElement: HTMLDivElement = document.getElementById('container_Secondary_Element') as HTMLDivElement;
                expect(parseInt(secondaryElement.style.top, 10)).toBe(0);
                expect(parseInt(secondaryElement.style.left, 10) === 179 || parseInt(secondaryElement.style.left, 10) === 184).toBe(true);
                let datalabel: HTMLDivElement = document.getElementById('container_Series_0_DataLabel_4') as HTMLDivElement;
                expect(parseInt(datalabel.style.top, 10) === 227 || parseInt(datalabel.style.top, 10) === 228).toBe(true);
                expect(parseInt(datalabel.style.left, 10)).toBe(174);
                trigger.draganddropEvent(ele, 20, 100, 120, 300);
                expect(chart.primaryXAxis.zoomFactor).toBe(1);
                expect(chart.primaryYAxis.zoomFactor).toBe(1);
                expect(chart.primaryXAxis.zoomPosition).toBe(0);
                expect(chart.primaryYAxis.zoomPosition).toBe(0);
                trigger.draganddropEvent(ele, 480, 100, 580, 300);
                expect(chart.primaryXAxis.zoomFactor.toFixed(2)).toBe('0.28');
                expect(chart.primaryYAxis.zoomFactor.toFixed(2) === '0.50' || chart.primaryYAxis.zoomFactor.toFixed(2) === '0.49').toBe(true);
                expect(chart.primaryXAxis.zoomPosition.toFixed(2) === '0.72' || chart.primaryXAxis.zoomPosition.toFixed(2) === '0.71').toBe(true);
                expect(chart.primaryYAxis.zoomPosition.toFixed(2)).toBe('0.30');
                // checking for center aligned div mouse wheel zooming
                chart.zoomModule.chartMouseWheel(<WheelEvent>wheelArgs);
                expect(chart.primaryXAxis.zoomFactor.toFixed(2)).toBe('0.28');
                let temp: string = chart.primaryYAxis.zoomFactor.toFixed(2);
                expect(temp === '0.50' || temp === '0.49').toBe(true);
                temp = chart.primaryXAxis.zoomPosition.toFixed(2);
                expect(temp === '0.72' || temp === '0.71').toBe(true);
                expect(chart.primaryYAxis.zoomPosition.toFixed(2)).toBe('0.30');
                done();
            };
            chart.loaded = loaded;
            chart.refresh();
        });
    });
});