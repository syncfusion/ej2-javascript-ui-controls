/**
 * Selection feature unit testing spec file
 */
import { createElement } from '@syncfusion/ej2-base';
import { Chart } from '../../../src/chart/chart';
import { Selection } from '../../../src/chart/user-interaction/selection';
import { Zoom } from '../../../src/chart/user-interaction/zooming';
import { SeriesModel } from '../../../src/chart/series/chart-series-model';
import { LineSeries } from '../../../src/chart/series/line-series';
import { StepLineSeries } from '../../../src/chart/series/step-line-series';
import { ColumnSeries } from '../../../src/chart/series/column-series';
import { StackingColumnSeries } from '../../../src/chart/series/stacking-column-series';
import { StackingAreaSeries } from '../../../src/chart/series/stacking-area-series';
import { AreaSeries } from '../../../src/chart/series/area-series';
import { Legend } from '../../../src/chart/legend/legend';
import { MouseEvents } from '../base/events.spec';
import { firstSeries, secondSeries, thirdSeries } from '../base/data.spec';
import { unbindResizeEvents } from '../base/data.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { EmitType } from '@syncfusion/ej2-base';
import { ILoadedEventArgs, IDragCompleteEventArgs } from '../../../src/common/model/interface';
Chart.Inject(LineSeries, StepLineSeries, ColumnSeries, AreaSeries, StackingAreaSeries, Selection, StackingColumnSeries, Legend,
    Zoom);
let seriesCollection: SeriesModel[] = [];
let colors: string[] = ['#663AB6', '#EB3F79', '#F8AB1D', '#B82E3D', '#049CB1', '#F2424F', '#C2C924', '#3DA046', '#074D67', '#02A8F4'];
seriesCollection = [
    {
        name: 'First',
        marker: { visible: true, height: 15, width: 15, shape: 'Triangle' },
        width: 5,
        animation: { enable: false },
        selectionStyle: null,
        fill: colors[0],
        dataSource: firstSeries, xName: 'x', yName: 'y',
        type: 'Column'
    },
    {
        name: 'Second',
        marker: { visible: true, height: 15, width: 15, shape: 'Triangle' },
        width: 10,
        visible: true,
        selectionStyle: null,
        animation: { enable: false },
        fill: colors[5],
        dataSource: secondSeries, xName: 'x', yName: 'y',
        type: 'Column'
    },
    {
        name: 'Third',
        marker: { visible: true, height: 15, width: 15, shape: 'Triangle' },
        width: 5,
        animation: { enable: false },
        selectionStyle: null,
        fill: colors[8],
        dataSource: thirdSeries, xName: 'x', yName: 'y',
        type: 'Column'
    }
];
describe('Chart Control Selection ', () => {
    let id: string = 'ej2Container';
    let selection: string = id + '_ej2_chart_selection_series_';
    let chartObj: Chart;
    let element: HTMLElement;
    let selected: HTMLCollection;
    let i: number = 0;
    let j: number = 0;
    let loaded: EmitType<ILoadedEventArgs>;
    let trigger: MouseEvents = new MouseEvents();
    let chartContainer: HTMLElement;
    let draggedRectGroup: string = id + '_ej2_drag_rect';
    let closeId: string = id + '_ej2_drag_close';
    beforeAll(() => {
        chartContainer = createElement('div', { id: id });
        document.body.appendChild(chartContainer);
        document.body.appendChild(createElement('style', {
            innerHTML: ' .selection { stroke-width: 5; fill: lime; stroke: red; opacity: 1; } '
        }));
        chartObj = new Chart({
            series: seriesCollection,
            primaryXAxis: { minimum: 2004, maximum: 2012 },
            primaryYAxis: { rangePadding: 'None' },
            height: '500',
            width: '800',
            loaded: loaded,
            selectionMode: 'Point',
            isMultiSelect: false
        });
        chartObj.appendTo('#' + id);

    });
    afterAll(() => {
        chartObj.destroy();
        chartContainer.remove();
    });
    it('MultiSelect false Selection Mode Point', (done: Function) => {
        loaded = () => {
            element = document.getElementById(id + '_Series_0' + '_Point_3');
            trigger.clickEvent(element);
            element = document.getElementById(id + '_Series_0' + '_Point_1');
            trigger.clickEvent(element);
            element = document.getElementById(id + '_Series_0' + '_Point_5');
            trigger.clickEvent(element);
            expect(document.getElementsByClassName(selection + '0').length).toBe(1);
            done();
        };
        chartObj.loaded = loaded;
        chartObj.refresh();
    });
    it('MultiSelect false Selection Mode Cluster', (done: Function) => {
        loaded = () => {
            element = document.getElementById(id + '_Series_0' + '_Point_5');
            trigger.clickEvent(element);
            element = document.getElementById(id + '_Series_1' + '_Point_2');
            trigger.clickEvent(element);
            for (let i: number = 0; i < seriesCollection.length; i++) {
                expect(document.getElementsByClassName(selection + i).length).toBe(1);
            }
            done();
        };
        chartObj.selectionMode = 'Cluster';
        chartObj.loaded = loaded;
        chartObj.selectionModule.selectedDataIndexes = [];
        chartObj.refresh();
    });
    it('MultiSelect false Selection Mode Series', (done: Function) => {
        loaded = () => {
            element = document.getElementById(id + '_Series_0' + '_Point_3');
            trigger.clickEvent(element);
            element = document.getElementById(id + '_Series_1' + '_Point_3');
            trigger.clickEvent(element);
            selected = document.getElementsByClassName(selection + '1');
            expect(selected.length).toBe(1);
            expect(selected[0].childNodes.length).toBe(8);
            done();
        };
        chartObj.selectionMode = 'Series';
        chartObj.loaded = loaded;
        chartObj.selectionModule.selectedDataIndexes = [];
        chartObj.refresh();
    });
    it('MultiSelect true Selection Mode Series', (done: Function) => {
        loaded = () => {
            element = document.getElementById(id + '_Series_0' + '_Point_' + 1);
            trigger.clickEvent(element);
            element = document.getElementById(id + '_Series_1' + '_Point_' + 2);
            trigger.clickEvent(element);
            element = document.getElementById(id + '_Series_2' + '_Point_' + 3);
            trigger.clickEvent(element);
            expect(document.getElementsByClassName(selection + '0')[0].childNodes.length).toBe(chartObj.visibleSeries[0].points.length + 1);
            expect(document.getElementsByClassName(selection + '1')[0].childNodes.length).toBe(chartObj.visibleSeries[1].points.length + 1);
            expect(document.getElementsByClassName(selection + '2')[0].childNodes.length).toBe(chartObj.visibleSeries[2].points.length + 1);
            element = document.getElementById(id + '_Series_0' + '_Point_' + 2);
            trigger.clickEvent(element);
            element = document.getElementById(id + '_Series_1' + '_Point_' + 4);
            trigger.clickEvent(element);
            element = document.getElementById(id + '_Series_2' + '_Point_' + 3);
            trigger.clickEvent(element);
            expect(document.getElementsByClassName(selection + '0').length).toBe(0);
            expect(document.getElementsByClassName(selection + '1').length).toBe(0);
            expect(document.getElementsByClassName(selection + '2').length).toBe(0);
            done();
        };
        chartObj.isMultiSelect = true;
        chartObj.loaded = loaded;
        chartObj.selectionModule.selectedDataIndexes = [];
        chartObj.refresh();
    });
    it('MultiSelect true Selection Mode Point', (done: Function) => {
        loaded = () => {
            element = document.getElementById(id + '_Series_0' + '_Point_' + 3);
            trigger.clickEvent(element);
            element = document.getElementById(id + '_Series_1' + '_Point_' + 2);
            trigger.clickEvent(element);
            element = document.getElementById(id + '_Series_2' + '_Point_' + 3);
            trigger.clickEvent(element);
            element = document.getElementById(id + '_Series_0' + '_Point_' + 5);
            trigger.clickEvent(element);
            element = document.getElementById(id + '_Series_2' + '_Point_' + 4);
            trigger.clickEvent(element);
            expect(document.getElementsByClassName(selection + '0').length).toBe(2);
            expect(document.getElementsByClassName(selection + '1').length).toBe(1);
            expect(document.getElementsByClassName(selection + '2').length).toBe(2);
            done();
        };
        chartObj.selectionMode = 'Point';
        chartObj.loaded = loaded;
        chartObj.selectionModule.selectedDataIndexes = [];
        chartObj.refresh();
    });
    it('MultiSelect true Selection Mode  Cluster', (done: Function) => {
        loaded = () => {
            element = document.getElementById(id + '_Series_0' + '_Point_' + 3);
            trigger.clickEvent(element);
            for (let i: number = 0; i < seriesCollection.length; i++) {
                expect(document.getElementsByClassName(selection + i).length).toBe(1);
            }
            done();
        };
        chartObj.selectionMode = 'Cluster';
        chartObj.isMultiSelect = true;
        chartObj.loaded = loaded;
        chartObj.selectionModule.selectedDataIndexes = [];
        chartObj.refresh();
    });
    it('Single point selection and UnSelection', (done: Function) => {
        loaded = () => {
            element = document.getElementById(id + '_Series_0_Point_4');
            trigger.clickEvent(element);
            selected = document.getElementsByClassName(selection + '0');
            expect(element).toBe(<HTMLElement>selected[0]);
            trigger.clickEvent(element);
            selected = document.getElementsByClassName(selection + '0');
            expect(selected.length).toBe(0);
            done();
        };
        chartObj.selectionMode = 'Point';
        chartObj.isMultiSelect = false;
        chartObj.loaded = loaded;
        chartObj.selectionModule.selectedDataIndexes = [];
        chartObj.refresh();
    });
    it('Multiple point selection and UnSelection', (done: Function) => {
        loaded = () => {
            for (j = 0; j < seriesCollection.length; j++) {
                for (i = 0, length = chartObj.visibleSeries[j].points.length; i < length; i++) {
                    element = document.getElementById(id + '_Series_' + j + '_Point_' + i);
                    trigger.clickEvent(element);
                    selected = document.getElementsByClassName(selection + j);
                    expect(selected.length).toBe(i + 1);
                }
                for (i = 0; i > 0; i--) {
                    element = document.getElementById(id + '_Series_' + j + '_Point_' + i);
                    trigger.clickEvent(element);
                    selected = document.getElementsByClassName(selection + j);
                    expect(selected.length).toBe(i);
                }
            }
            done();
        };
        chartObj.selectionMode = 'Point';
        chartObj.isMultiSelect = true;
        chartObj.loaded = loaded;
        chartObj.selectionModule.selectedDataIndexes = [];
        chartObj.refresh();
    });
    it('Single Series selection and UnSelection', (done: Function) => {
        loaded = () => {
            element = document.getElementById(id + '_Series_0_Point_0');
            trigger.clickEvent(element);
            selected = document.getElementsByClassName(selection + '0');
            expect(selected.length).toBe(1);
            expect(selected[0].childNodes.length).toBe(8);
            trigger.clickEvent(element);
            selected = document.getElementsByClassName(selection + '0');
            expect(selected.length).toBe(0);
            done();
        };
        chartObj.selectionMode = 'Series';
        chartObj.isMultiSelect = false;
        chartObj.loaded = loaded;
        chartObj.selectionModule.selectedDataIndexes = [];
        chartObj.refresh();
    });
    it('Multiple Series selection and UnSelection', (done: Function) => {
        loaded = () => {
            let total: number = 0;
            for (i = 0, length = seriesCollection.length; i < length; i++) {
                element = document.getElementById(id + '_Series_' + i + '_Point_0');
                trigger.clickEvent(element);
                selected = document.getElementsByClassName(selection + i);
                expect(selected.length).toBe(1);
                total = 9 * (i + 1);
                expect(selected[0].childNodes.length).toBe(8);
            }
            for (; i > 0; i--) {
                element = document.getElementById(id + '_Series_' + (i - 1) + '_Point_4');
                trigger.clickEvent(element);
                selected = document.getElementsByClassName(selection + (i - 1));
                total -= 9;
                expect(selected.length).toBe(0);
            }
            expect(total).toBe(0);
            done();
        };
        chartObj.selectionMode = 'Series';
        chartObj.isMultiSelect = true;
        chartObj.loaded = loaded;
        chartObj.selectionModule.selectedDataIndexes = [];
        chartObj.refresh();
    });
    it('Single Cluster selection and UnSelection', (done: Function) => {
        loaded = () => {
            let index: number = Math.floor((Math.random() * 10) % 6);
            element = document.getElementById(id + '_Series_1_Point_' + index);
            trigger.clickEvent(element);
            for (i = 0; i < seriesCollection.length; i++) {
                selected = document.getElementsByClassName(selection + i);
                expect(selected.length).toBe(1);
            }
            element = document.getElementById(id + '_Series_0_Point_' + index);
            trigger.clickEvent(element);
            for (i = 0; i < seriesCollection.length; i++) {
                selected = document.getElementsByClassName(selection + i);
                expect(selected.length).toBe(0);
            }
            done();
        };
        chartObj.selectionMode = 'Cluster';
        chartObj.isMultiSelect = false;
        chartObj.loaded = loaded;
        chartObj.selectionModule.selectedDataIndexes = [];
        chartObj.refresh();
    });
    it('Multiple Cluster selection and UnSelection', (done: Function) => {
        loaded = () => {
            element = document.getElementById(id + '_Series_1_Point_' + 1);
            trigger.clickEvent(element);
            element = document.getElementById(id + '_Series_0_Point_' + 3);
            trigger.clickEvent(element);
            element = document.getElementById(id + '_Series_2_Point_' + 5);
            trigger.clickEvent(element);
            for (i = 0; i < seriesCollection.length; i++) {
                selected = document.getElementsByClassName(selection + i);
                expect(selected.length).toBe(3);
            }
            element = document.getElementById(id + '_Series_1_Point_' + 1);
            trigger.clickEvent(element);
            element = document.getElementById(id + '_Series_0_Point_' + 3);
            trigger.clickEvent(element);
            element = document.getElementById(id + '_Series_2_Point_' + 5);
            trigger.clickEvent(element);
            for (i = 0; i < seriesCollection.length; i++) {
                selected = document.getElementsByClassName(selection + i);
                expect(selected.length).toBe(0);
            }
            done();
        };
        chartObj.selectionMode = 'Cluster';
        chartObj.isMultiSelect = true;
        chartObj.loaded = loaded;
        chartObj.selectionModule.selectedDataIndexes = [];
        chartObj.refresh();
    });
    it('Selected DataIndexes checking', (done: Function) => {
        loaded = () => {
            expect(document.getElementsByClassName(selection + '0').length).toBe(1);
            done();
        };
        chartObj.selectionMode = 'Point';
        chartObj.selectedDataIndexes = [{ series: 0, point: 2 }];
        chartObj.loaded = loaded;
        chartObj.selectionModule.selectedDataIndexes = [];
        chartObj.refresh();
    });
    it('Selection mode DragX', (done: Function) => {
        loaded = () => {
            trigger.draganddropEvent(chartContainer, 100, 100, 300, 300);
            element = document.getElementById(draggedRectGroup);
            expect(element.getAttribute('x') == '92').toBe(true);
            expect(element.getAttribute('y')).toEqual('10.25');
            expect(element.getAttribute('height') == '419.25' || element.getAttribute('height') == '421.25').toBe(true);
            expect(element.getAttribute('width')).toEqual('200');
            done();
        };
        chartObj.selectionMode = 'DragX';
        chartObj.loaded = loaded;
        chartObj.selectionModule.selectedDataIndexes = [];
        chartObj.refresh();
    });
    it('Selection mode DragY', (done: Function) => {
        loaded = () => {

            trigger.draganddropEvent(chartContainer, 100, 100, 300, 300);
            element = document.getElementById(draggedRectGroup);

            expect(element.getAttribute('x') == '33.5' || element.getAttribute('x') == '32.5').toBe(true);
            expect(element.getAttribute('y')).toEqual('92');
            expect(element.getAttribute('height')).toEqual('200');
            expect(element.getAttribute('width') == '756.5' || element.getAttribute('width') == '757.5').toBe(true);
            done();
        };
        chartObj.selectionMode = 'DragY';
        chartObj.loaded = loaded;
        chartObj.selectionModule.selectedDataIndexes = [];
        chartObj.refresh();
    });
    it('Selection mode Drag moving', (done: Function) => {
        loaded = () => {
            trigger.draganddropEvent(chartContainer, 100, 100, 300, 300);
            trigger.touchdraganddropEvent(chartObj, chartContainer, 150, 150, 200, 200);
            element = document.getElementById(draggedRectGroup);
            expect(element.getAttribute('x')).toEqual('142');
            expect(element.getAttribute('y')).toEqual('142');
            expect(element.getAttribute('height')).toEqual('200');
            expect(element.getAttribute('width')).toEqual('200');
            done();
        };
        chartObj.selectionMode = 'DragXY';
        chartObj.loaded = loaded;
        chartObj.selectionModule.selectedDataIndexes = [];
        chartObj.refresh();
    });
    it('Selection mode Drag Resizing', (done: Function) => {
        loaded = () => {
            trigger.draganddropEvent(chartContainer, 100, 100, 300, 300);
            trigger.draganddropEvent(chartContainer, 305, 305, 330, 330);
            element = document.getElementById(draggedRectGroup);
            expect(element.getAttribute('x')).toEqual('92');
            expect(element.getAttribute('y')).toEqual('92');
            expect(element.getAttribute('height')).toEqual('230');
            expect(element.getAttribute('width')).toEqual('230');
            done();
        };
        chartObj.selectionMode = 'DragXY';
        chartObj.loaded = loaded;
        chartObj.selectionModule.selectedDataIndexes = [];
        chartObj.refresh();
    });
    it('Selection mode DragXY', (done: Function) => {
        loaded = () => {
            trigger.draganddropEvent(chartContainer, 100, 100, 300, 300);
            element = document.getElementById(draggedRectGroup);
            expect(element.getAttribute('x')).toEqual('92');
            expect(element.getAttribute('y')).toEqual('92');
            expect(element.getAttribute('height')).toEqual('200');
            expect(element.getAttribute('width')).toEqual('200');
            expect(document.getElementsByClassName(selection + '2').length).toBe(2);
            trigger.mouseupEvent(document.getElementById(closeId), 0, 0, 0, 0);
            done();
        };
        chartObj.selectionMode = 'DragXY';
        chartObj.loaded = loaded;
        chartObj.selectionModule.selectedDataIndexes = [];
        chartObj.refresh();
    });
    it('Selected Data Index removing checking', (done: Function) => {
        loaded = () => {
            expect(document.getElementsByClassName(selection + '0').length).toBe(0);
            done();
        };
        chartObj.selectedDataIndexes = [];
        chartObj.selectionMode = 'Series';
        chartObj.loaded = loaded;
        chartObj.selectionModule.selectedDataIndexes = [];
        chartObj.refresh();
    });
    it('Selected Redraw checking', (done: Function) => {
        element = document.getElementById(id + '_Series_0_Point_' + 3);
        trigger.clickEvent(element);
        chartObj.isMultiSelect = false;
        chartObj.dataBind();
        expect(document.getElementsByClassName(selection + '0').length).toBe(1);
        done();
    });
    it('Selected Legend toggle visible false', (done: Function) => {
        loaded = () => {
            element = document.getElementById(id + '_chart_legend' + '_text_' + 1);
            trigger.clickEvent(element);
            expect(element.getAttribute('class') !== '').toBe(true);
            expect(document.getElementsByClassName(selection + '1').length).toBe(1);
            trigger.clickEvent(element);
            expect(document.getElementsByClassName(selection + '1').length).toBe(0);
            element = document.getElementById(id + '_chart_legend' + '_text_' + 0);
            expect(element.getAttribute('class') !== '').toBe(true);
            element = document.getElementById(id + '_chart_legend' + '_text_' + 1);
            expect(element.getAttribute('class') !== '').toBe(true);
            done();
        };
        chartObj.legendSettings = { toggleVisibility: false };
        chartObj.loaded = loaded;
        chartObj.selectionModule.selectedDataIndexes = [];
        chartObj.refresh();
    });
    it('Selected refresh clear selection', (done: Function) => {
        loaded = () => {
            for (i = 0; i < chartObj.series.length; i++) {
                expect(document.getElementsByClassName(selection + i).length).toBe(0);
            }
            done();
        };
        chartObj.selectionMode = 'Cluster';
        chartObj.isMultiSelect = true;
        chartObj.loaded = loaded;
        chartObj.selectionModule.selectedDataIndexes = [];
        chartObj.refresh();
    });
    it('Selected DataBind cluster', (done: Function) => {
        element = document.getElementById(id + '_Series_0_Point_' + 3);
        trigger.clickEvent(element);
        chartObj.dataBind();
        for (i = 0; i < chartObj.series.length; i++) {
            expect(document.getElementsByClassName(selection + i).length).toBe(1);
        }
        done();
    });
    it('Selected DataBind cluster to series', (done: Function) => {
        chartObj.selectionMode = 'Series';
        chartObj.dataBind();
        selected = document.getElementsByClassName(selection + 0);
        expect(selected[0].childNodes.length).toBeGreaterThanOrEqual(5);
        for (i = 1; i < chartObj.series.length; i++) {
            selected = document.getElementsByClassName(selection + i);
            expect(selected.length).toBe(0);
        }
        done();
    });
    it('Selected DataBind series to point', (done: Function) => {
        element = document.getElementById(id + '_Series_1_Point_' + 3);
        trigger.clickEvent(element);
        chartObj.selectionMode = 'Point';
        chartObj.dataBind();
        expect(document.getElementsByClassName(selection + '0').length).toBe(1);
        expect(document.getElementsByClassName(selection + '1').length).toBe(1);
        expect(document.getElementsByClassName(selection + '2').length).toBe(0);
        done();
    });
    it('Selected DataBind point to series', (done: Function) => {
        element = document.getElementById(id + '_Series_0_Point_' + 2);
        trigger.clickEvent(element);
        chartObj.selectionMode = 'Series';
        chartObj.dataBind();
        expect(document.getElementsByClassName(selection + '0').length).toBe(0);
        expect(document.getElementsByClassName(selection + '1').length).toBe(1);
        expect(document.getElementsByClassName(selection + '2').length).toBe(0);
        done();
    });
    it('Selected DataBind series to cluster', (done: Function) => {
        element = document.getElementById(id + '_Series_0_Point_' + 4);
        trigger.clickEvent(element);
        chartObj.selectionMode = 'Cluster';
        chartObj.dataBind();
        for (i = 0; i < chartObj.series.length; i++) {
            expect(document.getElementsByClassName(selection + i).length).toBe(2);
        }
        done();
    });
    it('Selected DataBind cluster to point', (done: Function) => {
        chartObj.selectionMode = 'Point';
        chartObj.dataBind();
        expect(document.getElementsByClassName(selection + 0).length).toBe(1);
        expect(document.getElementsByClassName(selection + 1).length).toBe(1);
        expect(document.getElementsByClassName(selection + 2).length).toBe(0);
        element = document.getElementById(id + '_Series_1_Point_' + 4);
        trigger.clickEvent(element);
        expect(document.getElementsByClassName(selection + '1').length).toBe(2);
        expect(document.getElementsByClassName(selection + '0').length).toBe(1);
        expect(document.getElementsByClassName(selection + '2').length).toBe(0);
        done();
    });
    it('Selected DataBind point multi select false', (done: Function) => {
        chartObj.isMultiSelect = false;
        chartObj.dataBind();
        expect(document.getElementsByClassName(selection + 0).length).toBe(1);
        expect(document.getElementsByClassName(selection + 1).length).toBe(1);
        expect(document.getElementsByClassName(selection + 2).length).toBe(0);
        done();
    });
    it('Selected DataBind point to series multi select false', (done: Function) => {
        chartObj.selectionMode = 'Series';
        chartObj.dataBind();
        expect(document.getElementsByClassName(selection + '0').length).toBe(0);
        expect(document.getElementsByClassName(selection + '1').length).toBe(1);
        expect(document.getElementsByClassName(selection + '2').length).toBe(0);
        done();
    });
    it('Selected DataBind series to cluster multi select false', (done: Function) => {
        chartObj.selectionMode = 'Cluster';
        chartObj.dataBind();
        for (i = 0; i < chartObj.series.length; i++) {
            expect(document.getElementsByClassName(selection + i).length).toBe(1);
        }
        done();
    });
    it('Selected DataBind cluster to series multi select false', (done: Function) => {
        element = document.getElementById(id + '_Series_2_Point_' + 3);
        trigger.clickEvent(element);
        chartObj.selectionMode = 'Series';
        chartObj.dataBind();
        expect(document.getElementsByClassName(selection + '0').length).toBe(0);
        expect(document.getElementsByClassName(selection + '1').length).toBe(0);
        expect(document.getElementsByClassName(selection + '2').length).toBe(1);
        expect(document.getElementsByClassName(selection + '2')[0].childNodes.length).toBeGreaterThan(5);
        done();
    });
    it('Selected DataBind series to point multi select false', (done: Function) => {
        chartObj.selectionMode = 'Point';
        chartObj.dataBind();
        expect(document.getElementsByClassName(selection + '0').length).toBe(0);
        expect(document.getElementsByClassName(selection + '1').length).toBe(0);
        expect(document.getElementsByClassName(selection + '2').length).toBe(1);
        expect(document.getElementsByClassName(selection + '2')[0].childNodes.length).toBe(0);
        done();
    });
    it('Selected DataBind point to cluster multi select false', (done: Function) => {
        chartObj.selectionMode = 'Cluster';
        chartObj.dataBind();
        for (i = 0; i < chartObj.series.length; i++) {
            expect(document.getElementsByClassName(selection + i).length).toBe(1);
        }
        done();
    });
    it('Selected DataBind cluster to point multi select false', (done: Function) => {
        chartObj.selectionMode = 'Point';
        chartObj.dataBind();
        expect(document.getElementsByClassName(selection + 0).length).toBe(0);
        expect(document.getElementsByClassName(selection + 1).length).toBe(0);
        expect(document.getElementsByClassName(selection + 2).length).toBe(1);
        element = document.getElementById(id + '_Series_2_Point_' + 3);
        trigger.clickEvent(element);
        expect(document.getElementsByClassName(selection + 2).length).toBe(0);
        element = document.getElementById(id + '_Series_2_Point_' + 4);
        trigger.clickEvent(element);
        expect(document.getElementsByClassName(selection + 2).length).toBe(1);
        done();
    });
    it('Selected refresh clear selection', (done: Function) => {
        loaded = () => {
            for (i = 0; i < chartObj.series.length; i++) {
                expect(document.getElementsByClassName(selection + i).length).toBe(0);
            }
            done();
        };
        chartObj.loaded = loaded;
        chartObj.selectionModule.selectedDataIndexes = [];
        chartObj.refresh();
    });
    it('Dragging selection resizing left position moving left and right', (done: Function) => {
        loaded = () => {
            trigger.draganddropEvent(chartContainer, 100, 100, 300, 300);
            element = document.getElementById(draggedRectGroup);
            expect(element.getAttribute('x')).toEqual('92');
            expect(element.getAttribute('y')).toEqual('92');
            expect(element.getAttribute('height')).toEqual('200');
            expect(element.getAttribute('width')).toEqual('200');
            trigger.draganddropEvent(chartContainer, 90, 110, 70, 120);
            element = document.getElementById(draggedRectGroup);
            expect(element.getAttribute('x')).toEqual('62');
            expect(element.getAttribute('y')).toEqual('92');
            expect(element.getAttribute('height')).toEqual('200');
            expect(element.getAttribute('width')).toEqual('230');
            trigger.draganddropEvent(chartContainer, 65, 110, 130, 120);
            element = document.getElementById(draggedRectGroup);
            expect(element.getAttribute('x')).toEqual('122');
            expect(element.getAttribute('y')).toEqual('92');
            expect(element.getAttribute('height')).toEqual('200');
            expect(element.getAttribute('width')).toEqual('170');
            trigger.mouseupEvent(document.getElementById(closeId), 0, 0, 0, 0);
            done();
        };
        chartObj.selectionMode = 'DragXY';
        chartObj.loaded = loaded;
        chartObj.selectionModule.selectedDataIndexes = [];
        chartObj.refresh();
    });
    it('Dragging selection resizing right position moving left and right', (done: Function) => {
        chartObj.selectionMode = 'DragXY';
        chartObj.dataBind();
        trigger.draganddropEvent(chartContainer, 100, 100, 300, 300);
        element = document.getElementById(draggedRectGroup);
        expect(element.getAttribute('x')).toEqual('92');
        expect(element.getAttribute('y')).toEqual('92');
        expect(element.getAttribute('height')).toEqual('200');
        expect(element.getAttribute('width')).toEqual('200');
        trigger.draganddropEvent(chartContainer, 290, 120, 430, 180);
        element = document.getElementById(draggedRectGroup);
        expect(element.getAttribute('x')).toEqual('92');
        expect(element.getAttribute('y')).toEqual('92');
        expect(element.getAttribute('height')).toEqual('200');
        expect(element.getAttribute('width')).toEqual('330');
        trigger.draganddropEvent(chartContainer, 435, 115, 200, 120);
        element = document.getElementById(draggedRectGroup);
        expect(element.getAttribute('x')).toEqual('92');
        expect(element.getAttribute('y')).toEqual('92');
        expect(element.getAttribute('height')).toEqual('200');
        expect(element.getAttribute('width')).toEqual('100');
        trigger.mouseupEvent(document.getElementById(closeId), 0, 0, 0, 0);
        done();
    });
    it('Dragging selection resizing top position moving up and down', (done: Function) => {
        chartObj.selectionMode = 'DragXY';
        chartObj.dataBind();
        trigger.draganddropEvent(chartContainer, 250, 300, 450, 400);
        element = document.getElementById(draggedRectGroup);
        expect(element.getAttribute('x')).toEqual('242');
        expect(element.getAttribute('y')).toEqual('292');
        expect(element.getAttribute('height')).toEqual('100');
        expect(element.getAttribute('width')).toEqual('200');
        trigger.draganddropEvent(chartContainer, 290, 295, 430, 200);
        element = document.getElementById(draggedRectGroup);
        expect(element.getAttribute('x')).toEqual('242');
        expect(element.getAttribute('y')).toEqual('192');
        expect(element.getAttribute('height')).toEqual('200');
        expect(element.getAttribute('width')).toEqual('200');
        trigger.draganddropEvent(chartContainer, 260, 200, 260, 320);
        element = document.getElementById(draggedRectGroup);
        expect(element.getAttribute('x')).toEqual('242');
        expect(element.getAttribute('y')).toEqual('312');
        expect(element.getAttribute('height')).toEqual('80');
        expect(element.getAttribute('width')).toEqual('200');
        trigger.mouseupEvent(document.getElementById(closeId), 0, 0, 0, 0);
        done();
    });
    it('Dragging selection resizing bottom position moving up and down', (done: Function) => {
        chartObj.selectionMode = 'DragXY';
        chartObj.dataBind();
        trigger.draganddropEvent(chartContainer, 250, 100, 450, 200);
        element = document.getElementById(draggedRectGroup);
        expect(element.getAttribute('x')).toEqual('242');
        expect(element.getAttribute('y')).toEqual('92');
        expect(element.getAttribute('height')).toEqual('100');
        expect(element.getAttribute('width')).toEqual('200');
        trigger.draganddropEvent(chartContainer, 290, 205, 250, 400);
        element = document.getElementById(draggedRectGroup);
        expect(element.getAttribute('x')).toEqual('242');
        expect(element.getAttribute('y')).toEqual('92');
        expect(element.getAttribute('height')).toEqual('300');
        expect(element.getAttribute('width')).toEqual('200');
        trigger.draganddropEvent(chartContainer, 270, 395, 230, 150);
        element = document.getElementById(draggedRectGroup);
        expect(element.getAttribute('x')).toEqual('242');
        expect(element.getAttribute('y')).toEqual('92');
        expect(element.getAttribute('height')).toEqual('50');
        expect(element.getAttribute('width')).toEqual('200');
        trigger.mouseupEvent(document.getElementById(closeId), 0, 0, 0, 0);
        done();
    });
    it('DragComplete selection event', (done: Function) => {
        let dragCompleted: EmitType<IDragCompleteEventArgs> = (args: IDragCompleteEventArgs) => {
            expect(args.selectedDataValues[1][0].x).toBe('2008');
            expect(args.selectedDataValues[1][0].y).toBe(36);
            expect(args.selectedDataValues[2][0].x).toBe('2007');
            expect(args.selectedDataValues[2][0].y).toBe(34);
        };
        chartObj.dragComplete = dragCompleted;
        chartObj.dataBind();
        trigger.draganddropEvent(chartContainer, 250, 100, 450, 250);
        element = document.getElementById(draggedRectGroup);
        done();
    });
    it('Selection refresh for isMultipleSelect false Checking', (done: Function) => {
        loaded = () => {
            expect(document.getElementsByClassName(selection + '0').length).toBe(0);
            expect(document.getElementsByClassName(selection + '1').length).toBe(0);
            expect(document.getElementsByClassName(selection + '2').length).toBe(0);
            done();
        };
        chartObj.selectionMode = 'Point';
        chartObj.isMultiSelect = true;
        chartObj.loaded = loaded;
        chartObj.selectionModule.selectedDataIndexes = [];
        chartObj.refresh();
    });
    it('Dragging on null point selection checking and outside dragging checking', (done: Function) => {
        loaded = () => {
            trigger.draganddropEvent(chartContainer, 250, 100, 450, 250);
            element = document.getElementById(draggedRectGroup);
            expect(element).not.toBeNull();
            expect(chartContainer).not.toBeNull();
            trigger.mouseupEvent(document.getElementById(closeId), 0, 0, 0, 0);
            trigger.draganddropEvent(chartContainer, 0, 0, 450, 250);
            element = document.getElementById(draggedRectGroup);
            expect(element).toBeNull();
            trigger.draganddropEvent(chartContainer, 250, 100, 900, 850);
            element = document.getElementById(draggedRectGroup);
            done();
        };
        chartObj.selectionMode = 'DragXY';
        chartObj.dragComplete = null;
        chartObj.series[0].dataSource[2].y = null;
        chartObj.loaded = loaded;
        chartObj.selectionModule.selectedDataIndexes = [];
        chartObj.refresh();
    });
    it('selection before Zooming selected elements style ', (done: Function) => {
        loaded = () => {
            chartObj.loaded = null;
            element = document.getElementById(id + '_Series_1_Point_' + 2);
            trigger.clickEvent(element);
            expect(element.classList.contains(selection + 1)).toBe(true);
            trigger.draganddropEvent(chartContainer, 250, 100, 450, 250);
            expect(element.classList.contains(selection + 1)).toBe(true);
            done();
        };
        chartObj.selectionMode = 'Point';
        chartObj.zoomSettings.enableSelectionZooming = true;
        chartObj.loaded = loaded;
        chartObj.selectionModule.selectedDataIndexes = [];
        chartObj.refresh();
    });
    it('Multiple axis drag selection ', (done: Function) => {
        loaded = () => {
            element = document.getElementById(id + '_Series_2_Point_' + 3);
            trigger.clickEvent(element);
            expect(document.getElementsByClassName(selection + 1).length > 0).toBe(false);
            trigger.draganddropEvent(chartContainer, 250, 100, 450, 250);
            element = document.getElementById(draggedRectGroup);
            expect(document.getElementsByClassName(selection + 1).length == 3).toBe(true);
            done();
        };
        chartObj.primaryXAxis.zoomFactor = 1;
        chartObj.primaryXAxis.zoomPosition = 1;
        chartObj.primaryYAxis.zoomPosition = 1;
        chartObj.primaryYAxis.zoomPosition = 1;
        chartObj.selectionMode = 'DragXY';
        chartObj.columns = [{ width: '50%', border: { width: 4, color: 'red' } },
        { width: '50%', border: { width: 4, color: 'blue' } }];
        chartObj.axes = [{ columnIndex: 1, name: 'xAxis1' }];
        chartObj.series[0].xAxisName = 'xAxis1';
        chartObj.zoomSettings.enableSelectionZooming = false;
        chartObj.loaded = loaded;
        chartObj.selectionModule.selectedDataIndexes = [];
        chartObj.series[0].dataSource[2].y = 0;
        chartObj.refresh();
    });
});