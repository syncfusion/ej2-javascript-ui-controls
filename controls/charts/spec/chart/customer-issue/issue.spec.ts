
/**
 * Issue fix specs
 */
import { Chart, Category, LineSeries, ILoadedEventArgs, Legend } from '../../../src/index';
import { createElement } from '@syncfusion/ej2-base';
import { DataManager } from '@syncfusion/ej2-data';
import { MouseEvents } from '../base/events.spec';
Chart.Inject(Category, LineSeries, Legend);

describe('Chart Issue fixes', () => {
    describe('Axis hide while legend click', () => {
        let legendChart: Chart;
        let rangeElement: Element;
        let testElement: Element;
        let data: Object[] = [{ x: 2000, y: 1 }, { x: 2001, y: 2.0 }, { x: 2002, y: 3.0 }, { x: 2003, y: 4.4 }];
        rangeElement = createElement('div', { id: 'rangeContainer' });
        document.body.appendChild(rangeElement);
        let trigger: MouseEvents = new MouseEvents();
        beforeAll(() => {
            legendChart = new Chart({

                primaryXAxis: { isInversed: true, interval: 1, valueType: 'Category' },

                primaryYAxis: { title: 'Revenue in Millions', labelFormat: '{value}M', isInversed: true },

                axes: [
                    { name: 'secondXAxis', title: 'secondXAxis', valueType: 'Category', opposedPosition: true },
                    { name: 'secondYAxis', title: 'secondYAxis', opposedPosition: true }
                ],

                series: [
                    {
                        xName: 'x', width: 2, yName: 'y', name: 'Product A',
                        dataSource: new DataManager(data), animation: { enable: false }
                    },
                    {
                        xName: 'x', width: 2, yName: 'y', name: 'Product B', xAxisName: 'secondXAxis', yAxisName: 'secondYAxis',
                        dataSource: new DataManager(data), animation: { enable: false }
                    }
                ],
                tooltip: { enable: true }, title: 'LegendClick-Axis hide',

            });
        });

        afterAll((): void => {
            legendChart.destroy();
            rangeElement.remove();
        });
        it('checking with lightweight', (done: Function) => {
            legendChart.loaded = (args: ILoadedEventArgs) => {
                testElement = document.getElementById('rangeContainer');
                expect(testElement.classList.contains('e-control')).toBe(true);
                expect(testElement.classList.contains('e-chart')).toBe(true);
                done();
            };
            legendChart.appendTo('#rangeContainer');
        });
        it('checking after legend click hide for series with primary axis', (done: Function) => {
            legendChart.loaded = (args: ILoadedEventArgs) => {
                testElement = document.getElementById('rangeContainer_chart_legend_text_0');
                legendChart.loaded = null;
                trigger.clickEvent(testElement);
                testElement = document.getElementById('rangeContainerAxisInsideCollection').childNodes[2] as HTMLElement;
                expect(testElement.childElementCount).not.toBe(0);
                done();
            };
            legendChart.enableAnimation = false;
            legendChart.refresh();
        });
        it('checking chart click unhide for series with primary axis', () => {
            testElement = document.getElementById('rangeContainer_chart_legend_text_0');
            trigger.clickEvent(testElement);
            testElement = document.getElementById('rangeContainerAxisInsideCollection');
            expect(testElement.childElementCount).toBe(5);
        });
        it('checking chart click hide for series with secondary axis', () => {
            testElement = document.getElementById('rangeContainer_chart_legend_text_1');
            trigger.clickEvent(testElement);
            testElement = document.getElementById('rangeContainerAxisInsideCollection').childNodes[2] as HTMLElement;
            expect(testElement.childElementCount).toBe(0);
        });
        it('checking chart click unhide for series with secondary axis', () => {
            testElement = document.getElementById('rangeContainer_chart_legend_text_1');
            trigger.clickEvent(testElement);
            testElement = document.getElementById('rangeContainerAxisInsideCollection');
            expect(testElement.childElementCount).toBe(5);
        });
        it('checking with multiple series sharing the same axis', (done: Function) => {
            legendChart.loaded = (args: ILoadedEventArgs) => {
                testElement = document.getElementById('rangeContainer_chart_legend_text_1');
                trigger.clickEvent(testElement);
                testElement = document.getElementById('rangeContainerAxisInsideCollection');
                expect(testElement.childElementCount).toBe(5);
                done();
            };
            legendChart.series = [
                {
                    xName: 'x', width: 2, yName: 'y', name: 'Product A',
                    dataSource: [{ x: 2000, y: 1 }, { x: 2001, y: 2.0 }, { x: 2002, y: 3.0 }, { x: 2003, y: 4.4 }],
                },
                {
                    xName: 'x', width: 2, yName: 'y', name: 'Product B', xAxisName: 'secondXAxis', yAxisName: 'secondYAxis',
                    dataSource: [{ x: 2000, y: 1 }, { x: 2001, y: 2.0 }, { x: 2002, y: 3.0 }, { x: 2003, y: 4.4 }],
                },
                {
                    xName: 'x', width: 2, yName: 'y', name: 'Product C', xAxisName: 'secondXAxis', yAxisName: 'secondYAxis',
                    dataSource: [{ x: 2000, y: 2 }, { x: 2001, y: -2.3 }, { x: 2002, y: 0 }, { x: 2003, y: 3.4 }],
                }
            ];
            legendChart.refresh();
        });
    });
});
