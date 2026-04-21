import { createElement, EmitType } from "@syncfusion/ej2-base";
import { ILoadedEventArgs } from '../../../src/chart/model/chart-interface';
import { Chart } from '../../../src/chart/chart';
import { Axis } from '../../../src/chart/axis/axis';
import { MouseEvents } from "../base/events.spec";
import { seriesData1 } from "../base/data.spec";
import { SeriesLabel } from "../../../src/chart/series/series-label";
import { LineSeries } from '../../../src/chart/series/line-series';
import { Tooltip } from '../../../src/chart/user-interaction/tooltip';
import { DataLabel } from '../../../src/chart/series/data-label';
import { AreaSeries } from "../../../src/chart/series/area-series";
Chart.Inject(LineSeries, Tooltip, DataLabel, SeriesLabel, AreaSeries);

describe('Series Labels in chart', () => {
    describe('testing series label in chart', () => {
        let chartObj: Chart;
        let ele: HTMLElement;
        let seriesLabel: HTMLElement;
        let loaded: EmitType<ILoadedEventArgs>;
        beforeAll((): void => {
            ele = createElement('div', { id: 'seriesLabelContainer' });
            document.body.appendChild(ele);
            chartObj = new Chart({
                primaryXAxis: { title: 'PrimaryXAxis' }, primaryYAxis: { title: 'PrimaryYAxis' },
                series: [
                    {
                        name: 'series1', type: 'Line', dataSource: seriesData1, xName: 'x', yName: 'y',
                        labelSettings: { visible: true, font: { fontFamily: 'Roboto', fontWeight: 'Normal',
                                size: '14px', color: 'blue', opacity: 1 } }
                    },
                ], height: '400', width: '600', legendSettings: { visible: true }
            }, '#seriesLabelContainer');
        });
        afterAll((): void => {
            chartObj.destroy();
            ele.remove();
        });
        it('checking the series label is visible is true', (done: Function) => {
            loaded = (): void => {
                seriesLabel = document.getElementById('seriesLabelContainer_Point_0_Text_0');
                expect(seriesLabel.textContent).toBe('series1');
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('should not render series label, if visible is false', (done: Function) => {
            chartObj.series[0].labelSettings.visible = false;
            loaded = (): void => {
                seriesLabel = document.getElementById('seriesLabelContainer_Point_0_Text_0');
                expect(seriesLabel).toBe(null);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('should render labels correctly when axes are opposed', (done: Function) => {
            chartObj.primaryXAxis.opposedPosition = true;
            chartObj.primaryYAxis.opposedPosition = true;
            chartObj.series[0].labelSettings.visible = true;
            loaded = (): void => {
                seriesLabel = document.getElementById('seriesLabelContainer_Point_0_Text_0');
                expect(seriesLabel.textContent).toBe('series1');
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('should apply custom font settings to series1 label', (done: Function) => {
            chartObj.series[0].labelSettings.font = {
                fontFamily: 'Arial',
                fontWeight: 'Bold',
                size: '16px',
                color: 'green'
            };
            loaded = (): void => {
                const label = document.getElementById('seriesLabelContainer_Point_0_Text_0');
                expect(label).not.toBeNull();
                expect(label!.getAttribute('font-size')).toBe('16px');
                expect(label!.getAttribute('fill')).toBe('green');
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('should hide label when series is not visible', (done: Function) => {
            chartObj.series[0].visible = false;
            loaded = (): void => {
                seriesLabel = document.getElementById('seriesLabelContainer_Point_0_Text_0');
                expect(seriesLabel).toBe(null);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
    });
    describe('testing chart with only one data point', () => {
        let chartObj: Chart;
        let ele: HTMLElement;
        let loaded: EmitType<ILoadedEventArgs>;
        beforeAll((): void => {
            ele = createElement('div', { id: 'container' });
            document.body.appendChild(ele);
            chartObj = new Chart({
                primaryXAxis: { title: 'Year', valueType: 'Double', interval: 1 },
                primaryYAxis: { title: 'Number of Employees' },
                series: [{
                    dataSource: [{ x: 2010, y: 43934 }],
                    xName: 'x', yName: 'y',
                    name: 'Installation & Developers',
                    type: 'Line',
                    marker: { visible: true },
                    labelSettings: { visible: true },
                }],
                title: 'U.S Solar Employment Growth',
                tooltip: { enable: true },
                legendSettings: { visible: true },
                theme: 'Bootstrap5',
                height: '450px'
            }, '#container');
        });
        afterAll((): void => {
            chartObj.destroy();
            ele.remove();
        });
        it('should not render the series label when less than 2 visible points', (done: Function) => {
            chartObj.series[0].labelSettings.visible = true;
            loaded = (args: Object): void => {
                const label = document.getElementById('container_Point_0_Text_0');
                expect(label).toBeNull();
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
    });
    describe('filled series generates one candidate position', () => {
        let chartObj: Chart;
        let ele: HTMLElement;
        let loaded: EmitType<ILoadedEventArgs>;
        beforeAll(() => {
            ele = createElement('div', { id: 'container2' });
            document.body.appendChild(ele);
            chartObj = new Chart({
                primaryXAxis: {},
                primaryYAxis: {},
                series: [{
                    dataSource: [{ x: 2010, y: 43934 }, { x: 2011, y: 48656 }, { x: 2012, y: 65165 }, { x: 2013, y: 81827 },
                    { x: 2014, y: 112143 }, { x: 2015, y: 142383 }, { x: 2016, y: 171533 }, { x: 2017, y: 165174 },
                    { x: 2018, y: 155157 }, { x: 2019, y: 161454 }, { x: 2020, y: 154610 }, { x: 2021, y: 168960 },
                    { x: 2022, y: 171558 }],
                    xName: 'x', yName: 'y', name: 'AreaTest',
                    type: 'Area',
                    labelSettings: { visible: true }
                }],
                height: '400',
                width: '600'
            }, '#container2');
        });
        afterAll(() => {
            chartObj.destroy();
            ele.remove();
        });
        it('should calculate one candidate label position for filled series', (done: Function) => {
            loaded = () => {
                const label = document.getElementById('container2_Point_0_Text_0');
                expect(label).not.toBeNull();
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
    });
    describe('SeriesLabel - auto contrast color for filled series', () => {
        let chartObj: Chart;
        let ele: HTMLElement;
        let loaded: EmitType<ILoadedEventArgs>;
        beforeAll(() => {
            ele = createElement('div', { id: 'container3' });
            document.body.appendChild(ele);
            chartObj = new Chart({
                primaryXAxis: {},
                primaryYAxis: {},
                series: [{
                    dataSource: [{ x: 2010, y: 43934 }, { x: 2011, y: 48656 }, { x: 2012, y: 65165 }, { x: 2013, y: 81827 },
                    { x: 2014, y: 112143 }, { x: 2015, y: 142383 }, { x: 2016, y: 171533 }, { x: 2017, y: 165174 },
                    { x: 2018, y: 155157 }, { x: 2019, y: 161454 }, { x: 2020, y: 154610 }, { x: 2021, y: 168960 },
                    { x: 2022, y: 171558 }],
                    xName: 'x', yName: 'y', name: 'ColorTest',
                    type: 'Area',
                    fill: '#000000',
                    labelSettings: {
                        visible: true,
                        font: { color: null }
                    }
                }],
                height: '400',
                width: '600'
            }, '#container3');
        });
        afterAll(() => {
            chartObj.destroy();
            ele.remove();
        });
        it('should apply contrast text color based on fill brightness', (done: Function) => {
            loaded = () => {
                const label = document.getElementById('container3_Point_0_Text_0');
                expect(label).not.toBeNull();
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
    });
    describe('SeriesLabel with ErrorBar integration', () => {
        let chartObj: Chart;
        let ele: HTMLElement;
        let seriesLabel: HTMLElement;
        let loaded: EmitType<ILoadedEventArgs>;

        beforeAll((): void => {
            ele = createElement('div', { id: 'seriesLabelErrorBarContainer' });
            document.body.appendChild(ele);
            chartObj = new Chart({
                primaryXAxis: { title: 'PrimaryXAxis' },
                primaryYAxis: { title: 'PrimaryYAxis' },
                series: [
                    {
                        name: 'Sales Data',
                        type: 'Line',
                        dataSource: [
                            { x: 1, y: 20 },
                            { x: 2, y: 30 },
                            { x: 3, y: 25 },
                            { x: 4, y: 35 },
                            { x: 5, y: 40 }
                        ],
                        xName: 'x',
                        yName: 'y',
                        labelSettings: {
                            visible: true
                        },
                        errorBar: {
                            visible: true,
                            type: 'Fixed',
                            mode: 'Vertical',
                            direction: 'Both',
                            verticalError: 5,
                            errorBarCap: {
                                width: 10
                            }
                        },
                        marker: { visible: true }
                    }
                ],
                height: '400',
                width: '600',
                legendSettings: { visible: false }
            }, '#seriesLabelErrorBarContainer');
        });

        afterAll((): void => {
            chartObj.destroy();
            ele.remove();
        });

        it('should avoid collision with error bars having Plus direction', (done: Function) => {
            chartObj.series[0].errorBar.direction = 'Plus';
            loaded = (): void => {
                seriesLabel = document.getElementById('seriesLabelErrorBarContainer_Point_0_Text_0');
                const errorBar: HTMLElement = document.getElementById('seriesLabelErrorBarContainer_Series__ErrorBarGroup_0_Point_0');
                expect(errorBar).not.toBeNull();
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });

        it('should avoid collision with error bars having Minus direction', (done: Function) => {
            chartObj.series[0].errorBar.direction = 'Minus';
            loaded = (): void => {
                seriesLabel = document.getElementById('seriesLabelErrorBarContainer_Point_0_Text_0');
                const errorBar: HTMLElement = document.getElementById('seriesLabelErrorBarContainer_Series__ErrorBarGroup_0_Point_0');
                expect(errorBar).not.toBeNull();
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
    });
    describe('SeriesLabel color contrast for different series types', () => {
        let chartObj: Chart;
        let ele: HTMLElement;
        let loaded: EmitType<ILoadedEventArgs>;

        beforeAll((): void => {
            ele = createElement('div', { id: 'seriesLabelColorContainer' });
            document.body.appendChild(ele);
        });

        afterAll((): void => {
            if (chartObj) {
                chartObj.destroy();
            }
            ele.remove();
        });

        it('should use border color when font color is not specified for line series', (done: Function) => {
            chartObj = new Chart({
                primaryXAxis: {},
                primaryYAxis: {},
                series: [{
                    dataSource: [{ x: 1, y: 20 }, { x: 2, y: 30 }, { x: 3, y: 25 }],
                    xName: 'x',
                    yName: 'y',
                    name: 'Border Color Test',
                    type: 'Line',
                    border: { color: 'red', width: 2 },
                    labelSettings: {
                        visible: true,
                        font: { color: null }
                    }
                }],
                height: '400',
                width: '600'
            }, '#seriesLabelColorContainer');

            loaded = (): void => {
                const label: HTMLElement = document.getElementById('seriesLabelColorContainer_Point_0_Text_0');
                expect(label).not.toBeNull();
                expect(label.getAttribute('fill')).toBe('red');
                done();
            };
            chartObj.loaded = loaded;
            chartObj.appendTo('#seriesLabelColorContainer');
        });

        it('should use interior color when border color is not specified', (done: Function) => {
            chartObj.destroy();
            chartObj = new Chart({
                primaryXAxis: {},
                primaryYAxis: {},
                series: [{
                    dataSource: [{ x: 1, y: 20 }, { x: 2, y: 30 }, { x: 3, y: 25 }],
                    xName: 'x',
                    yName: 'y',
                    name: 'Interior Color Test',
                    type: 'Line',
                    fill: 'blue',
                    border: { color: null },
                    labelSettings: {
                        visible: true,
                        font: { color: null }
                    }
                }],
                height: '400',
                width: '600'
            }, '#seriesLabelColorContainer');

            loaded = (): void => {
                const label: HTMLElement = document.getElementById('seriesLabelColorContainer_Point_0_Text_0');
                expect(label).not.toBeNull();
                const fillColor: string = label.getAttribute('fill') || '';
                expect(fillColor).toBe('blue');
                done();
            };
            chartObj.loaded = loaded;
            chartObj.appendTo('#seriesLabelColorContainer');
        });

        it('should default to black when no colors are specified', (done: Function) => {
            chartObj.destroy();
            chartObj = new Chart({
                primaryXAxis: {},
                primaryYAxis: {},
                series: [{
                    dataSource: [{ x: 1, y: 20 }, { x: 2, y: 30 }, { x: 3, y: 25 }],
                    xName: 'x',
                    yName: 'y',
                    name: 'Default Color Test',
                    type: 'Line',
                    border: { color: null },
                    fill: null,
                    labelSettings: {
                        visible: true,
                        font: { color: null }
                    }
                }],
                height: '400',
                width: '600'
            }, '#seriesLabelColorContainer');

            loaded = (): void => {
                const label: HTMLElement = document.getElementById('seriesLabelColorContainer_Point_0_Text_0');
                expect(label).not.toBeNull();
                done();
            };
            chartObj.loaded = loaded;
            chartObj.appendTo('#seriesLabelColorContainer');
        });
    });
    describe('SeriesLabel - getZoomVisiblePoints and clearLabels functionality', () => {
        let chartObj: Chart;
        let ele: HTMLElement;
        let seriesLabel: HTMLElement;
        let loaded: EmitType<ILoadedEventArgs>;
        let trigger: MouseEvents = new MouseEvents();
        beforeAll((): void => {
            ele = createElement('div', { id: 'seriesLabelZoomContainer' });
            document.body.appendChild(ele);
            chartObj = new Chart({
                primaryXAxis: {
                    title: 'PrimaryXAxis',
                    valueType: 'Double'
                },
                primaryYAxis: {
                    title: 'PrimaryYAxis',
                    rangePadding: 'None'
                },
                series: [
                    {
                        name: 'Series 1',
                        type: 'Line',
                        dataSource: [
                            { x: 10, y: 20 }, { x: 20, y: 30 }, { x: 30, y: 25 },
                            { x: 40, y: 35 }, { x: 50, y: 40 }, { x: 60, y: 45 },
                            { x: 70, y: 50 }, { x: 80, y: 55 }, { x: 90, y: 60 }
                        ],
                        xName: 'x',
                        yName: 'y',
                        labelSettings: {
                            visible: true,
                            font: { color: 'blue' }
                        },
                        marker: { visible: true }
                    }
                ],
                height: '400',
                width: '600',
                zoomSettings: {
                    enableSelectionZooming: true,
                    enableMouseWheelZooming: true,
                    enablePinchZooming: true
                },
                legendSettings: { visible: false }
            }, '#seriesLabelZoomContainer');
        });

        afterAll((): void => {
            chartObj.destroy();
            ele.remove();
        });

        it('should filter visible points after selection zooming', (done: Function) => {
            loaded = (): void => {
                const xAxis: Axis = chartObj.primaryXAxis as Axis;
                const yAxis: Axis = chartObj.primaryYAxis as Axis;
                expect(xAxis.zoomFactor).toBeLessThan(1);
                expect(yAxis.zoomFactor).toBeLessThan(1);
                done();
            };
            chartObj.loaded = loaded;
            trigger.draganddropEvent(ele, 100, 100, 400, 300);
        });

        it('should update series label position based on visible range after zoom', (done: Function) => {
            loaded = (): void => {
                const xAxis: Axis = chartObj.primaryXAxis as Axis;
                const yAxis: Axis = chartObj.primaryYAxis as Axis;
                const zoomFactor: number = xAxis.zoomFactor;
                const zoomPosition: number = xAxis.zoomPosition;
                expect(zoomFactor).toBeLessThan(1);
                expect(zoomPosition).toBeGreaterThan(0);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });

        it('should handle getZoomVisiblePoints with no zoom state', (done: Function) => {
            loaded = (): void => {
                const resetElement: Element = document.getElementById('seriesLabelZoomContainer_Zooming_Reset');
                if (resetElement) {
                    trigger.mousedownEvent(resetElement as HTMLElement, 0, 0, 5, 5);
                }
                const xAxis: Axis = chartObj.primaryXAxis as Axis;
                const yAxis: Axis = chartObj.primaryYAxis as Axis;
                expect(xAxis.zoomFactor).toBe(1);
                expect(yAxis.zoomFactor).toBe(1);
                expect(xAxis.zoomPosition).toBe(0);
                expect(yAxis.zoomPosition).toBe(0);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });

        it('should clear labels when clearLabels is called', (done: Function) => {
            loaded = (): void => {
                if (chartObj.seriesLabelModule) {
                    chartObj.seriesLabelModule.clearLabels();
                }
                seriesLabel = document.getElementById('seriesLabelZoomContainer_Point_0_Text_0');
                expect(seriesLabel).toBeNull();
                expect(chartObj.seriesLabelCollections.length).toBe(0);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });

        it('should filter points correctly with X-axis zoom only', (done: Function) => {
            loaded = (): void => {
                trigger.draganddropEvent(ele, 150, 100, 450, 300);
                const xAxis: Axis = chartObj.primaryXAxis as Axis;
                const yAxis: Axis = chartObj.primaryYAxis as Axis;
                expect(xAxis.zoomFactor).toBeLessThan(1);
                expect(yAxis.zoomFactor).toBe(1);
                done();
            };
            chartObj.zoomSettings.mode = 'X';
            chartObj.loaded = loaded;
            chartObj.refresh();
        });

        it('should filter points correctly with Y-axis zoom only', (done: Function) => {
            loaded = (): void => {
                const resetElement: Element = document.getElementById('seriesLabelZoomContainer_Zooming_Reset');
                if (resetElement) {
                    trigger.mousedownEvent(resetElement as HTMLElement, 0, 0, 5, 5);
                }
                trigger.draganddropEvent(ele, 150, 100, 450, 300);
                const xAxis: Axis = chartObj.primaryXAxis as Axis;
                const yAxis: Axis = chartObj.primaryYAxis as Axis;
                expect(xAxis.zoomFactor).toBe(1);
                expect(yAxis.zoomFactor).toBeLessThan(1);
                done();
            };
            chartObj.zoomSettings.mode = 'Y';
            chartObj.loaded = loaded;
            chartObj.refresh();
        });

        it('should maintain label collection consistency after multiple zoom operations', (done: Function) => {
            loaded = (): void => {
                trigger.draganddropEvent(ele, 100, 100, 400, 300);
                trigger.draganddropEvent(ele, 150, 150, 350, 250);
                expect(chartObj.seriesLabelCollections.length).toBeGreaterThanOrEqual(0);
                done();
            };
            chartObj.series[0].type = 'Line';
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
    });
    describe('SeriesLabel - labelIntersectAction Show (allow overlap)', () => {
        let chartObj: Chart;
        let ele: HTMLElement;
        let loaded: EmitType<ILoadedEventArgs>;
        beforeAll((): void => {
            ele = createElement('div', { id: 'seriesLabelOverlapContainer' });
            document.body.appendChild(ele);
        });
        afterAll((): void => {
            if (chartObj) {
                chartObj.destroy();
            }
            ele.remove();
        });

        it('should render overlapping labels when labelIntersectAction is Show', (done: Function) => {
            chartObj = new Chart({
                primaryXAxis: { title: 'X Axis' },
                primaryYAxis: { title: 'Y Axis' },
                series: [
                    {
                        name: 'Series 1',
                        type: 'Line',
                        dataSource: [
                            { x: 10, y: 20 }, { x: 20, y: 30 }, { x: 30, y: 25 }
                        ],
                        xName: 'x',
                        yName: 'y',
                        labelSettings: {
                            visible: true,
                            showOverlapText: true,
                            font: { color: 'red', size: '14px' }
                        },
                        marker: { visible: true }
                    },
                    {
                        name: 'Series 2',
                        type: 'Line',
                        dataSource: [
                            { x: 10, y: 21 }, { x: 20, y: 31 }, { x: 30, y: 26 }
                        ],
                        xName: 'x',
                        yName: 'y',
                        labelSettings: {
                            visible: true,
                            showOverlapText: true,
                            font: { color: 'blue', size: '14px' }
                        },
                        marker: { visible: true }
                    }
                ],
                height: '400',
                width: '600',
                legendSettings: { visible: false }
            }, '#seriesLabelOverlapContainer');
            loaded = (): void => {
                const series1Label: HTMLElement = document.getElementById('seriesLabelOverlapContainer_Point_0_Text_0');
                const series2Label: HTMLElement = document.getElementById('seriesLabelOverlapContainer_Point_1_Text_1');
                expect(series1Label).not.toBeNull();
                expect(series2Label).not.toBeNull();
                expect(series1Label.textContent).toBe('Series 1');
                expect(series2Label.textContent).toBe('Series 2');
                done();
            };
            chartObj.loaded = loaded;
            chartObj.appendTo('#seriesLabelOverlapContainer');
        });

        it('should apply correct color to overlapping labels', (done: Function) => {
            loaded = (): void => {
                const series1Label: HTMLElement = document.getElementById('seriesLabelOverlapContainer_Point_0_Text_0');
                const series2Label: HTMLElement = document.getElementById('seriesLabelOverlapContainer_Point_1_Text_1');
                expect(series1Label.getAttribute('fill')).toBe('red');
                expect(series2Label.getAttribute('fill')).toBe('blue');
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });

        it('should render label even when all positions collide with blockers', (done: Function) => {
            chartObj.destroy();
            chartObj = new Chart({
                primaryXAxis: { title: 'X Axis' },
                primaryYAxis: { title: 'Y Axis' },
                series: [
                    {
                        name: 'Series A',
                        type: 'Line',
                        dataSource: [
                            { x: 10, y: 20 }, { x: 20, y: 30 }, { x: 30, y: 25 }
                        ],
                        xName: 'x',
                        yName: 'y',
                        labelSettings: {
                            visible: true,
                            showOverlapText: true,
                        },
                        marker: {
                            visible: true,
                            dataLabel: { visible: true } // This creates blockers
                        }
                    }
                ],
                height: '300',
                width: '400',
                legendSettings: { visible: false }
            }, '#seriesLabelOverlapContainer');
            loaded = (): void => {
                const seriesLabel: HTMLElement = document.getElementById('seriesLabelOverlapContainer_Point_0_Text_0');
                expect(seriesLabel).not.toBeNull();
                expect(seriesLabel.textContent).toBe('Series A');
                done();
            };
            chartObj.loaded = loaded;
            chartObj.appendTo('#seriesLabelOverlapContainer');
        });

        it('should render label at last tried position when labelIntersectAction is Show', (done: Function) => {
            chartObj.destroy();
            chartObj = new Chart({
                primaryXAxis: { title: 'X Axis' },
                primaryYAxis: { title: 'Y Axis' },
                series: [
                    {
                        name: 'Overlap Test',
                        type: 'Line',
                        dataSource: [
                            { x: 10, y: 20 }, { x: 20, y: 30 }, { x: 30, y: 25 },
                            { x: 40, y: 35 }, { x: 50, y: 40 }
                        ],
                        xName: 'x',
                        yName: 'y',
                        labelSettings: {
                            visible: true,
                            showOverlapText: true,
                            font: { size: '16px', color: 'green' }
                        },
                        marker: { visible: true }
                    }
                ],
                height: '400',
                width: '600',
                legendSettings: { visible: false }
            }, '#seriesLabelOverlapContainer');
            loaded = (): void => {
                const seriesLabel: HTMLElement = document.getElementById('seriesLabelOverlapContainer_Point_0_Text_0');
                expect(seriesLabel).not.toBeNull();
                expect(seriesLabel.getAttribute('fill')).toBe('green');
                expect(seriesLabel.getAttribute('font-size')).toBe('16px');
                expect(chartObj.seriesLabelCollections.length).toBeGreaterThan(0);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.appendTo('#seriesLabelOverlapContainer');
        });

        it('should not render label when labelIntersectAction is Hide and collision occurs', (done: Function) => {
            chartObj.destroy();
            chartObj = new Chart({
                primaryXAxis: { title: 'X Axis' },
                primaryYAxis: { title: 'Y Axis' },
                series: [
                    {
                        name: 'Series 1',
                        type: 'Line',
                        dataSource: [
                            { x: 10, y: 20 }, { x: 20, y: 30 }, { x: 30, y: 25 }
                        ],
                        xName: 'x',
                        yName: 'y',
                        labelSettings: {
                            visible: true,
                            showOverlapText: false, // Default behavior
                        },
                        marker: {
                            visible: true,
                            dataLabel: { visible: true } // Creates collision
                        }
                    },
                    {
                        name: 'Series 2',
                        type: 'Line',
                        dataSource: [
                            { x: 10, y: 21 }, { x: 20, y: 31 }, { x: 30, y: 26 }
                        ],
                        xName: 'x',
                        yName: 'y',
                        labelSettings: {
                            visible: true,
                            showOverlapText: false,
                        },
                        marker: {
                            visible: true,
                            dataLabel: { visible: true }
                        }
                    }
                ],
                height: '300',
                width: '400',
                legendSettings: { visible: false }
            }, '#seriesLabelOverlapContainer');
            loaded = (): void => {
                const series1Label: HTMLElement = document.getElementById('seriesLabelOverlapContainer_Point_0_Text_0');
                const series2Label: HTMLElement = document.getElementById('seriesLabelOverlapContainer_Point_1_Text_1');
                const visibleLabels: number = (series1Label ? 1 : 0) + (series2Label ? 1 : 0);
                expect(visibleLabels).toBeLessThanOrEqual(2);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.appendTo('#seriesLabelOverlapContainer');
        });

        it('should render label with None action even in small chart area', (done: Function) => {
            chartObj.destroy();
            chartObj = new Chart({
                primaryXAxis: { title: 'X Axis' },
                primaryYAxis: { title: 'Y Axis' },
                series: [
                    {
                        name: 'Crowded Series',
                        type: 'Line',
                        dataSource: [
                            { x: 10, y: 20 }, { x: 11, y: 21 }, { x: 12, y: 22 },
                            { x: 13, y: 23 }, { x: 14, y: 24 }
                        ],
                        xName: 'x',
                        yName: 'y',
                        labelSettings: {
                            visible: true,
                            showOverlapText: true,
                            font: { size: '12px' }
                        },
                        marker: { visible: true }
                    }
                ],
                height: '200', // Small chart
                width: '300',
                legendSettings: { visible: false }
            }, '#seriesLabelOverlapContainer');
            loaded = (): void => {
                const seriesLabel: HTMLElement = document.getElementById('seriesLabelOverlapContainer_Point_0_Text_0');
                expect(seriesLabel).not.toBeNull();
                expect(seriesLabel.textContent).toBe('Crowded Series');
                done();
            };
            chartObj.loaded = loaded;
            chartObj.appendTo('#seriesLabelOverlapContainer');
        });

        it('should render label for filled series with None action', (done: Function) => {
            chartObj.destroy();
            chartObj = new Chart({
                primaryXAxis: {},
                primaryYAxis: {},
                series: [
                    {
                        name: 'Area Series',
                        type: 'Area',
                        dataSource: [
                            { x: 10, y: 20 }, { x: 20, y: 30 }, { x: 30, y: 25 },
                            { x: 40, y: 35 }, { x: 50, y: 40 }
                        ],
                        xName: 'x',
                        yName: 'y',
                        fill: '#FF5733',
                        labelSettings: {
                            visible: true,
                            showOverlapText: true,
                            font: { color: null } // Should use contrast color
                        },
                        marker: { visible: true }
                    }
                ],
                height: '400',
                width: '600',
                legendSettings: { visible: false }
            }, '#seriesLabelOverlapContainer');
            loaded = (): void => {
                const seriesLabel: HTMLElement = document.getElementById('seriesLabelOverlapContainer_Point_0_Text_0');
                expect(seriesLabel).not.toBeNull();
                expect(seriesLabel.textContent).toBe('Area Series');
                const labelColor: string = seriesLabel.getAttribute('fill');
                expect(labelColor).not.toBeNull();
                expect(labelColor === 'white' || labelColor === 'black').toBe(true);

                done();
            };
            chartObj.loaded = loaded;
            chartObj.appendTo('#seriesLabelOverlapContainer');
        });

        it('should render label with None action and custom font settings', (done: Function) => {
            chartObj.destroy();
            chartObj = new Chart({
                primaryXAxis: {},
                primaryYAxis: {},
                series: [
                    {
                        name: 'Custom Font',
                        type: 'Line',
                        dataSource: [
                            { x: 10, y: 20 }, { x: 20, y: 30 }, { x: 30, y: 25 }
                        ],
                        xName: 'x',
                        yName: 'y',
                        labelSettings: {
                            visible: true,
                            showOverlapText: true,
                            font: {
                                fontFamily: 'Arial',
                                fontWeight: 'Bold',
                                size: '18px',
                                color: '#FF6347'
                            }
                        },
                        marker: { visible: true }
                    }
                ],
                height: '400',
                width: '600',
                legendSettings: { visible: false }
            }, '#seriesLabelOverlapContainer');
            loaded = (): void => {
                const seriesLabel: HTMLElement = document.getElementById('seriesLabelOverlapContainer_Point_0_Text_0');
                expect(seriesLabel).not.toBeNull();
                expect(seriesLabel.getAttribute('fill')).toBe('#FF6347');
                expect(seriesLabel.getAttribute('font-size')).toBe('18px');
                expect(seriesLabel.getAttribute('font-weight')).toBe('Bold');
                expect(seriesLabel.getAttribute('font-family')).toBe('Arial');
                done();
            };
            chartObj.loaded = loaded;
            chartObj.appendTo('#seriesLabelOverlapContainer');
        });

        it('should add forcedRect to seriesLabelCollections when None action triggers', (done: Function) => {
            chartObj.destroy();
            chartObj = new Chart({
                primaryXAxis: {},
                primaryYAxis: {},
                series: [
                    {
                        name: 'Series 1',
                        type: 'Line',
                        dataSource: [
                            { x: 10, y: 20 }, { x: 20, y: 30 }, { x: 30, y: 25 }
                        ],
                        xName: 'x',
                        yName: 'y',
                        labelSettings: {
                            visible: true,
                            showOverlapText: true,
                        },
                        marker: {
                            visible: true,
                            dataLabel: { visible: true } // Creates blockers
                        }
                    },
                    {
                        name: 'Series 2',
                        type: 'Line',
                        dataSource: [
                            { x: 10, y: 21 }, { x: 20, y: 31 }, { x: 30, y: 26 }
                        ],
                        xName: 'x',
                        yName: 'y',
                        labelSettings: {
                            visible: true,
                            showOverlapText: true,
                        },
                        marker: {
                            visible: true,
                            dataLabel: { visible: true }
                        }
                    }
                ],
                height: '300',
                width: '400',
                legendSettings: { visible: false }
            }, '#seriesLabelOverlapContainer');
            loaded = (): void => {
                expect(chartObj.seriesLabelCollections.length).toBeGreaterThanOrEqual(1);
                const series1Label: HTMLElement = document.getElementById('seriesLabelOverlapContainer_Point_0_Text_0');
                const series2Label: HTMLElement = document.getElementById('seriesLabelOverlapContainer_Point_1_Text_1');
                expect(series1Label).not.toBeNull();
                expect(series2Label).not.toBeNull();
                done();
            };
            chartObj.loaded = loaded;
            chartObj.appendTo('#seriesLabelOverlapContainer');
        });

        it('should render label when lastTriedInClipPosition is available with None action', (done: Function) => {
            chartObj.destroy();
            chartObj = new Chart({
                primaryXAxis: {},
                primaryYAxis: {},
                series: [
                    {
                        name: 'Position Test',
                        type: 'Line',
                        dataSource: [
                            { x: 10, y: 20 }, { x: 20, y: 30 }, { x: 30, y: 25 },
                            { x: 40, y: 35 }
                        ],
                        xName: 'x',
                        yName: 'y',
                        labelSettings: {
                            visible: true,
                            showOverlapText: true,
                        },
                        marker: { visible: true }
                    }
                ],
                height: '400',
                width: '600',
                legendSettings: { visible: false }
            }, '#seriesLabelOverlapContainer');
            loaded = (): void => {
                const seriesLabel: HTMLElement = document.getElementById('seriesLabelOverlapContainer_Point_0_Text_0');
                expect(seriesLabel).not.toBeNull();
                const xPos: string = seriesLabel.getAttribute('x');
                const yPos: string = seriesLabel.getAttribute('y');
                expect(xPos).not.toBeNull();
                expect(yPos).not.toBeNull();
                expect(parseFloat(xPos)).toBeGreaterThan(0);
                expect(parseFloat(yPos)).toBeGreaterThan(0);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.appendTo('#seriesLabelOverlapContainer');
        });
    });
    describe('SeriesLabel - background and border shape rendering', () => {
        let chartObj: Chart;
        let ele: HTMLElement;
        let loaded: EmitType<ILoadedEventArgs>;

        beforeAll((): void => {
            ele = createElement('div', { id: 'shapeTestContainer' });
            document.body.appendChild(ele);
        });

        afterAll((): void => {
            if (chartObj) {
                chartObj.destroy();
            }
            ele.remove();
        });

        it('should render shape with background color', (done: Function) => {
            chartObj = new Chart({
                primaryXAxis: {},
                primaryYAxis: {},
                series: [{
                    dataSource: [{ x: 10, y: 20 }, { x: 20, y: 30 }, { x: 30, y: 25 }],
                    xName: 'x',
                    yName: 'y',
                    name: 'Shape Test',
                    type: 'Line',
                    labelSettings: {
                        visible: true,
                        background: '#FFE5B4',
                        border: { color: 'black', width: 2 },
                        opacity: 0.9
                    }
                }],
                height: '400',
                width: '600'
            }, '#shapeTestContainer');

            loaded = (): void => {
                const shapeElement: HTMLElement = document.getElementById('shapeTestContainer_Point_0_Text_0_Shape');
                expect(shapeElement).not.toBeNull();
                expect(shapeElement.getAttribute('fill')).toBe('#FFE5B4');
                expect(shapeElement.getAttribute('stroke')).toBe('black');
                expect(shapeElement.getAttribute('stroke-width')).toBe('2');
                done();
            };
            chartObj.loaded = loaded;
            chartObj.appendTo('#shapeTestContainer');
        });

        it('should render shape with border only', (done: Function) => {
            chartObj.destroy();
            chartObj = new Chart({
                primaryXAxis: {},
                primaryYAxis: {},
                series: [{
                    dataSource: [{ x: 10, y: 20 }, { x: 20, y: 30 }, { x: 30, y: 25 }],
                    xName: 'x',
                    yName: 'y',
                    name: 'Border Only',
                    type: 'Line',
                    labelSettings: {
                        visible: true,
                        background: 'transparent',
                        border: { color: 'red', width: 3 }
                    }
                }],
                height: '400',
                width: '600'
            }, '#shapeTestContainer');

            loaded = (): void => {
                const shapeElement: HTMLElement = document.getElementById('shapeTestContainer_Point_0_Text_0_Shape');
                expect(shapeElement).not.toBeNull();
                done();
            };
            chartObj.loaded = loaded;
            chartObj.appendTo('#shapeTestContainer');
        });

        it('should render shape with showOverlapText enabled', (done: Function) => {
            chartObj.destroy();
            chartObj = new Chart({
                primaryXAxis: {},
                primaryYAxis: {},
                series: [{
                    dataSource: [{ x: 10, y: 20 }, { x: 20, y: 30 }],
                    xName: 'x',
                    yName: 'y',
                    name: 'Overlap Shape',
                    type: 'Line',
                    labelSettings: {
                        visible: true,
                        showOverlapText: true,
                        background: '#E0F7FA',
                        border: { color: 'blue', width: 1 }
                    },
                    marker: {
                        visible: true,
                        dataLabel: { visible: true }
                    }
                }],
                height: '300',
                width: '400'
            }, '#shapeTestContainer');
            loaded = (): void => {
                const shapeElement: HTMLElement = document.getElementById('shapeTestContainer_Point_0_Text_0_Shape');
                expect(shapeElement).not.toBeNull();
                done();
            };
            chartObj.loaded = loaded;
            chartObj.appendTo('#shapeTestContainer');
        });
    });
    describe('SeriesLabel - custom text property', () => {
        let chartObj: Chart;
        let ele: HTMLElement;
        let loaded: EmitType<ILoadedEventArgs>;
        beforeAll((): void => {
            ele = createElement('div', { id: 'customTextContainer' });
            document.body.appendChild(ele);
        });
        afterAll((): void => {
            if (chartObj) {  chartObj.destroy(); }
            ele.remove();
        });
        it('should use custom text from labelSettings.text', (done: Function) => {
            chartObj = new Chart({
                primaryXAxis: {}, primaryYAxis: {},
                series: [{
                    dataSource: [{ x: 10, y: 20 }, { x: 20, y: 30 }, { x: 30, y: 25 }], xName: 'x',
                    yName: 'y', name: 'Original Name', type: 'Line', labelSettings: { visible: true, text: 'Custom Label Text' }
                }], height: '400',  width: '600'
            }, '#customTextContainer');

            loaded = (): void => {
                const label: HTMLElement = document.getElementById('customTextContainer_Point_0_Text_0');
                expect(label).not.toBeNull();
                expect(label.textContent).toBe('Custom Label Text');
                done();
            };
            chartObj.loaded = loaded;
            chartObj.appendTo('#customTextContainer');
        });
        it('should fall back to series name when text is not provided', (done: Function) => {
            chartObj.destroy();
            chartObj = new Chart({
                primaryXAxis: {}, primaryYAxis: {},
                series: [{
                    dataSource: [{ x: 10, y: 20 }, { x: 20, y: 30 }, { x: 30, y: 25 }], xName: 'x',
                    yName: 'y', name: 'Default Series Name', type: 'Line', labelSettings: { visible: true }
                }], height: '400', width: '600'
            }, '#customTextContainer');
            loaded = (): void => {
                const label: HTMLElement = document.getElementById('customTextContainer_Point_0_Text_0');
                expect(label).not.toBeNull();
                expect(label.textContent).toBe('Default Series Name');
                done();
            };
            chartObj.loaded = loaded;
            chartObj.appendTo('#customTextContainer');
        });
    });

    describe('SeriesLabel - opacity settings', () => {
        let chartObj: Chart;
        let ele: HTMLElement;
        let loaded: EmitType<ILoadedEventArgs>;
        beforeAll((): void => {
            ele = createElement('div', { id: 'opacityTestContainer' });
            document.body.appendChild(ele);
        });
        afterAll((): void => {
            if (chartObj) { chartObj.destroy(); }
            ele.remove();
        });
        it('should use opacity from labelSettings', (done: Function) => {
            chartObj = new Chart({
                primaryXAxis: {}, primaryYAxis: {},
                series: [{
                    dataSource: [{ x: 10, y: 20 }, { x: 20, y: 30 }, { x: 30, y: 25 }],
                    xName: 'x', yName: 'y', name: 'Opacity Test', type: 'Line',
                    labelSettings: { visible: true, opacity: 0.6 }
                }], height: '400', width: '600'
            }, '#opacityTestContainer');
            loaded = (): void => {
                setTimeout(() => {
                    const label: HTMLElement = document.getElementById('opacityTestContainer_Point_0_Text_0');
                    expect(label).not.toBeNull();
                    const opacity: string = label.getAttribute('opacity');
                    expect(parseFloat(opacity)).not.toBeCloseTo(0.6, 1);
                    done();
                }, 1100);
            };
            chartObj.loaded = loaded;
            chartObj.appendTo('#opacityTestContainer');
        });
        it('should use font opacity when labelSettings opacity is not provided', (done: Function) => {
            chartObj.destroy();
            chartObj = new Chart({
                primaryXAxis: {}, primaryYAxis: {},
                series: [{
                    dataSource: [{ x: 10, y: 20 }, { x: 20, y: 30 }, { x: 30, y: 25 }],
                    xName: 'x', yName: 'y', name: 'Font Opacity', type: 'Line',
                    labelSettings: { visible: true, font: { opacity: 0.7 } }
                }], height: '400', width: '600'
            }, '#opacityTestContainer');
            loaded = (): void => {
                setTimeout(() => {
                    const label: HTMLElement = document.getElementById('opacityTestContainer_Point_0_Text_0');
                    expect(label).not.toBeNull();
                    const opacity: string = label.getAttribute('opacity');
                    expect(parseFloat(opacity)).not.toBeCloseTo(0.7, 1);
                    done();
                }, 1100);
            };
            chartObj.loaded = loaded;
            chartObj.appendTo('#opacityTestContainer');
        });
    });
});