/**
 * Selection feature unit testing spec file
 */
import { createElement, remove, Browser } from '@syncfusion/ej2-base';
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
import { DataEditing } from '../../../src/chart/user-interaction/data-editing';
import { firstSeries, secondSeries, thirdSeries } from '../base/data.spec';
import { unbindResizeEvents } from '../base/data.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { EmitType } from '@syncfusion/ej2-base';
import  {profile , inMB, getMemoryProfile} from '../../common.spec';
import { ILoadedEventArgs, IDragCompleteEventArgs } from '../../../src/chart/model/chart-interface';
Chart.Inject(LineSeries, DataEditing, StepLineSeries, ColumnSeries, AreaSeries, StackingAreaSeries, Selection, StackingColumnSeries, Legend,
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
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
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
        //    primaryYAxis: { rangePadding: 'None' },
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
            expect(document.getElementsByClassName(selection + '0').length).toBe(3);
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
                expect(document.getElementsByClassName(selection + i).length).toBe(3);
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
            expect(selected.length).toBe(3);
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
            expect(document.getElementsByClassName(selection + '0').length).toBe(5);
            expect(document.getElementsByClassName(selection + '1').length).toBe(3);
            expect(document.getElementsByClassName(selection + '2').length).toBe(5);
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
                expect(document.getElementsByClassName(selection + i).length).toBe(3);
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
    it('UnSelectionStyle selection', (done: Function) => {
        loaded = () => {
            element = document.getElementById(id + '_Series_0_Point_3');
            trigger.clickEvent(element);
            selected = document.getElementsByClassName(selection + '0');
            expect(element).toBe(<HTMLElement>selected[0]);
            element = document.getElementById(id + '_Series_0_Point_2');
            expect(element.classList[0] === 'custom')
            done();
        };
        chartObj.selectionMode = 'Point';
        chartObj.isMultiSelect = false;
        chartObj.series[0].unSelectedStyle = 'custom';
        chartObj.loaded = loaded;
        chartObj.selectionModule.selectedDataIndexes = [];
        chartObj.refresh();
    });
    it('Multiple point selection and UnSelection', (done: Function) => {
        loaded = () => {
            for (j = 0; j < seriesCollection.length; j++) {
                let val: number = 0;
                for (i = 0, length = chartObj.visibleSeries[j].points.length; i < length; i++) {
                    element = document.getElementById(id + '_Series_' + j + '_Point_' + i);
                    trigger.clickEvent(element);
                    selected = document.getElementsByClassName(selection + j);
                    val = (i === 0 ? 3 : val + 2);
                    expect(selected.length).toBe(val);
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
        chartObj.series[0].unSelectedStyle = null;
        chartObj.selectionModule.selectedDataIndexes = [];
        chartObj.refresh();
    });
    it('Single Series selection and UnSelection', (done: Function) => {
        loaded = () => {
            element = document.getElementById(id + '_Series_0_Point_0');
            trigger.clickEvent(element);
            selected = document.getElementsByClassName(selection + '0');
            expect(selected.length).toBe(3);
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
                expect(selected.length).toBe(3);
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
                expect(selected.length).toBe(3);
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
                expect(selected.length).toBe(7);
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
            expect(document.getElementsByClassName(selection + '0').length).toBe(3);
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
            expect(element.getAttribute('y')).toEqual('10');
            expect(element.getAttribute('height') == '419.75' || element.getAttribute('height') == '421.75').toBe(true);
            expect(element.getAttribute('width')).toEqual('200');
            done();
        };
        chartObj.selectionMode = 'DragX';
        chartObj.loaded = loaded;
        chartObj.selectionModule.selectedDataIndexes = [];
        chartObj.refresh();
    });
    it('Selection mode multi select dragging', (done: Function) => {
        loaded = () => {
            trigger.draganddropEvent(chartContainer, 100, 100, 300, 300);
            trigger.draganddropEvent(chartContainer, 400, 100, 600, 300);
            element = document.getElementById(draggedRectGroup + '0');
            expect(element.getAttribute('x') == '92').toBe(true);
            expect(element.getAttribute('y')).toEqual('10');
            expect(element.getAttribute('height') === '419.75' || element.getAttribute('height') === '421.75').toBe(true);
            expect(element.getAttribute('width')).toEqual('200');
            element = document.getElementById(draggedRectGroup + '1');
            expect(element.getAttribute('x') == '392').toBe(true);
            expect(element.getAttribute('y')).toEqual('10');
            expect(element.getAttribute('height') === '419.75' || element.getAttribute('height') === '421.75').toBe(true);
            expect(element.getAttribute('width')).toEqual('200');
            done();
        };
        chartObj.selectionMode = 'DragX';
        chartObj.allowMultiSelection = true;
        chartObj.loaded = loaded;
        chartObj.selectionModule.selectedDataIndexes = [];
        chartObj.refresh();
    });
    it('Selection mode DragY', (done: Function) => {
        loaded = () => {

            trigger.draganddropEvent(chartContainer, 100, 100, 300, 300);
            element = document.getElementById(draggedRectGroup);

            expect(element.getAttribute('x') == '33.25' || element.getAttribute('x') == '32.25').toBe(true);
            expect(element.getAttribute('y')).toEqual('92');
            expect(element.getAttribute('height')).toEqual('200');
            expect(element.getAttribute('width') == '757' || element.getAttribute('width') == '758').toBe(true);
            done();
        };
        chartObj.selectionMode = 'DragY';
        chartObj.allowMultiSelection = false;
        chartObj.loaded = loaded;
        chartObj.selectionModule.selectedDataIndexes = [];
        chartObj.refresh();
    });
    it('Selection mode multi select dragging', (done: Function) => {
        loaded = () => {
            trigger.draganddropEvent(chartContainer, 100, 100, 200, 200);
            trigger.draganddropEvent(chartContainer, 100, 300, 300, 400);
            element = document.getElementById(draggedRectGroup + '0');
            expect(element.getAttribute('x') === '33.25' || element.getAttribute('x') === '32.25').toBe(true);
            expect(element.getAttribute('y')).toEqual('92');
            expect(element.getAttribute('height')).toEqual('100');
            expect(element.getAttribute('width') === '757' || element.getAttribute('width') === '758').toBe(true);
            element = document.getElementById(draggedRectGroup + '1');
            expect(element.getAttribute('x') === '33.25' || element.getAttribute('x') === '32.25').toBe(true);
            expect(element.getAttribute('y')).toEqual('292');
            expect(element.getAttribute('height')).toEqual('100');
            expect(element.getAttribute('width') === '757' || element.getAttribute('width') === '758').toBe(true);
            done();
        };
        chartObj.selectionMode = 'DragY';
        chartObj.allowMultiSelection = true;
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
        chartObj.allowMultiSelection = false;
        chartObj.loaded = loaded;
        chartObj.selectionModule.selectedDataIndexes = [];
        chartObj.refresh();
    });
    it('Selection mode Drag Resizing', (done: Function) => {
        loaded = () => {
            trigger.draganddropEvent(chartContainer, 100, 100, 300, 300);
            trigger.draganddropEvent(chartContainer, 298, 298, 330, 330);
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
            //expect(document.getElementsByClassName(selection + '2').length).toBe(3);
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
        expect(document.getElementsByClassName(selection + '0').length).toBe(3);
        done();
    });
    it('Selected Legend toggle visible false', (done: Function) => {
        loaded = () => {
            element = document.getElementById(id + '_chart_legend' + '_text_' + 1);
            trigger.clickEvent(element);
            expect(element.getAttribute('class') !== '').toBe(true);
            expect(document.getElementsByClassName(selection + '1').length).toBe(3);
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
            expect(document.getElementsByClassName(selection + i).length).toBe(3);
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
        expect(document.getElementsByClassName(selection + '0').length).toBe(3);
        expect(document.getElementsByClassName(selection + '1').length).toBe(3);
        expect(document.getElementsByClassName(selection + '2').length).toBe(0);
        done();
    });
    it('Selected DataBind point to series', (done: Function) => {
        element = document.getElementById(id + '_Series_0_Point_' + 2);
        trigger.clickEvent(element);
        chartObj.selectionMode = 'Series';
        chartObj.dataBind();
        expect(document.getElementsByClassName(selection + '0').length).toBe(0);
        expect(document.getElementsByClassName(selection + '1').length).toBe(3);
        expect(document.getElementsByClassName(selection + '2').length).toBe(0);
        done();
    });
    it('Selected DataBind series to cluster', (done: Function) => {
        element = document.getElementById(id + '_Series_0_Point_' + 4);
        trigger.clickEvent(element);
        chartObj.selectionMode = 'Cluster';
        chartObj.dataBind();
        for (i = 0; i < chartObj.series.length; i++) {
            expect(document.getElementsByClassName(selection + i).length).toBe(5);
        }
        done();
    });
    it('Selected DataBind cluster to point', (done: Function) => {
        chartObj.selectionMode = 'Point';
        chartObj.dataBind();
        expect(document.getElementsByClassName(selection + 0).length).toBe(3);
        expect(document.getElementsByClassName(selection + 1).length).toBe(3);
        expect(document.getElementsByClassName(selection + 2).length).toBe(0);
        element = document.getElementById(id + '_Series_1_Point_' + 4);
        trigger.clickEvent(element);
        expect(document.getElementsByClassName(selection + '1').length).toBe(5);
        expect(document.getElementsByClassName(selection + '0').length).toBe(3);
        expect(document.getElementsByClassName(selection + '2').length).toBe(0);
        done();
    });
    it('Selected DataBind point multi select false', (done: Function) => {
        chartObj.isMultiSelect = false;
        chartObj.dataBind();
        expect(document.getElementsByClassName(selection + 0).length).toBe(3);
        expect(document.getElementsByClassName(selection + 1).length).toBe(3);
        expect(document.getElementsByClassName(selection + 2).length).toBe(0);
        done();
    });
    it('Selected DataBind point to series multi select false', (done: Function) => {
        chartObj.selectionMode = 'Series';
        chartObj.dataBind();
        expect(document.getElementsByClassName(selection + '0').length).toBe(0);
        expect(document.getElementsByClassName(selection + '1').length).toBe(3);
        expect(document.getElementsByClassName(selection + '2').length).toBe(0);
        done();
    });
    it('Selected DataBind series to cluster multi select false', (done: Function) => {
        chartObj.selectionMode = 'Cluster';
        chartObj.dataBind();
        for (i = 0; i < chartObj.series.length; i++) {
            expect(document.getElementsByClassName(selection + i).length).toBe(3);
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
        expect(document.getElementsByClassName(selection + '2').length).toBe(3);
        expect(document.getElementsByClassName(selection + '2')[0].childNodes.length).toBeGreaterThan(5);
        done();
    });
    it('Selected DataBind series to point multi select false', (done: Function) => {
        chartObj.selectionMode = 'Point';
        chartObj.dataBind();
        expect(document.getElementsByClassName(selection + '0').length).toBe(0);
        expect(document.getElementsByClassName(selection + '1').length).toBe(0);
        expect(document.getElementsByClassName(selection + '2').length).toBe(3);
        expect(document.getElementsByClassName(selection + '2')[0].childNodes.length).toBe(0);
        done();
    });
    it('Selected DataBind point to cluster multi select false', (done: Function) => {
        chartObj.selectionMode = 'Cluster';
        chartObj.dataBind();
        for (i = 0; i < chartObj.series.length; i++) {
            expect(document.getElementsByClassName(selection + i).length).toBe(3);
        }
        done();
    });
    it('Selected DataBind cluster to point multi select false', (done: Function) => {
        chartObj.selectionMode = 'Point';
        chartObj.dataBind();
        expect(document.getElementsByClassName(selection + 0).length).toBe(0);
        expect(document.getElementsByClassName(selection + 1).length).toBe(0);
        expect(document.getElementsByClassName(selection + 2).length).toBe(3);
        element = document.getElementById(id + '_Series_2_Point_' + 3);
        trigger.clickEvent(element);
        expect(document.getElementsByClassName(selection + 2).length).toBe(0);
        element = document.getElementById(id + '_Series_2_Point_' + 4);
        trigger.clickEvent(element);
        expect(document.getElementsByClassName(selection + 2).length).toBe(3);
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
            trigger.draganddropEvent(chartContainer, 105, 110, 70, 120);
            element = document.getElementById(draggedRectGroup);
            expect(element.getAttribute('x')).toEqual('62');
            expect(element.getAttribute('y')).toEqual('92');
            expect(element.getAttribute('height')).toEqual('200');
            expect(element.getAttribute('width')).toEqual('230');
            trigger.draganddropEvent(chartContainer, 75, 110, 130, 120);
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
        trigger.draganddropEvent(chartContainer, 295, 120, 430, 180);
        element = document.getElementById(draggedRectGroup);
        expect(element.getAttribute('x')).toEqual('92');
        expect(element.getAttribute('y')).toEqual('92');
        expect(element.getAttribute('height')).toEqual('200');
        expect(element.getAttribute('width')).toEqual('330');
        trigger.draganddropEvent(chartContainer, 425, 115, 200, 120);
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
        trigger.draganddropEvent(chartContainer, 290, 305, 430, 200);
        element = document.getElementById(draggedRectGroup);
        expect(element.getAttribute('x')).toEqual('242');
        expect(element.getAttribute('y')).toEqual('192');
        expect(element.getAttribute('height')).toEqual('200');
        expect(element.getAttribute('width')).toEqual('200');
        trigger.draganddropEvent(chartContainer, 260, 205, 260, 320);
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
        trigger.draganddropEvent(chartContainer, 290, 195, 250, 400);
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
          //  expect(args.selectedDataValues[1][0].x).toBe(2007);
            expect(args.selectedDataValues[1][0].y).toBe(30);
          //  expect(args.selectedDataValues[2][0].x).toBe(2006);
            expect(args.selectedDataValues[2][0].y).toBe(32);
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
           // expect(document.getElementsByClassName(selection + 1).length === 7).toBe(true);
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
    it('Patterns with Dots', (done: Function) => {
        loaded = () => {
           expect(document.getElementById(id +'_svg').querySelectorAll('pattern').length).toBe(3);
            expect(document.getElementById(id +'_svg').querySelectorAll('pattern')[0].id === 'ej2Container_Dots_Selection_0').toBe(true);
            done();
        };
        chartObj.loaded = loaded;
        chartObj.selectionPattern = 'Dots';
        chartObj.refresh();
    });

    it('Patterns with DiagonalForward', (done: Function) => {
        loaded = () => {
           expect(document.getElementById(id +'_svg').querySelectorAll('pattern').length).toBe(3);
            expect(document.getElementById(id +'_svg').querySelectorAll('pattern')[0].id === 'ej2Container_DiagonalForward_Selection_0').toBe(true);
            done();
        };
        chartObj.loaded = loaded;
        chartObj.selectionPattern = 'DiagonalForward';
        chartObj.refresh();
    });
    it('Patterns with Crosshatch', (done: Function) => {
        loaded = () => {
           expect(document.getElementById(id +'_svg').querySelectorAll('pattern').length).toBe(3);
            expect(document.getElementById(id +'_svg').querySelectorAll('pattern')[0].id === 'ej2Container_Crosshatch_Selection_0').toBe(true);
            done();
        };
        chartObj.loaded = loaded;
        chartObj.selectionPattern = 'Crosshatch';
        chartObj.refresh();
    });
    it('Patterns with Pacman', (done: Function) => {
        loaded = () => {
           expect(document.getElementById(id +'_svg').querySelectorAll('pattern').length).toBe(3);
            expect(document.getElementById(id +'_svg').querySelectorAll('pattern')[0].id === 'ej2Container_Pacman_Selection_0').toBe(true);
            done();
        };
        chartObj.loaded = loaded;
        chartObj.selectionPattern = 'Pacman';
        chartObj.refresh();
    });
    it('Patterns with DiagonalBackward', (done: Function) => {
        loaded = () => {
           expect(document.getElementById(id +'_svg').querySelectorAll('pattern').length).toBe(3);
            expect(document.getElementById(id +'_svg').querySelectorAll('pattern')[0].id === 'ej2Container_DiagonalBackward_Selection_0').toBe(true);
            done();
        };
        chartObj.loaded = loaded;
        chartObj.selectionPattern = 'DiagonalBackward';
        chartObj.refresh();
    });
    it('Patterns with Grid', (done: Function) => {
        loaded = () => {
           expect(document.getElementById(id +'_svg').querySelectorAll('pattern').length).toBe(3);
            expect(document.getElementById(id +'_svg').querySelectorAll('pattern')[0].id === 'ej2Container_Grid_Selection_0').toBe(true);
            done();
        };
        chartObj.loaded = loaded;
        chartObj.selectionPattern = 'Grid';
        chartObj.refresh();
    });
    it('Patterns with Turquoise', (done: Function) => {
        loaded = () => {
           expect(document.getElementById(id +'_svg').querySelectorAll('pattern').length).toBe(3);
            expect(document.getElementById(id +'_svg').querySelectorAll('pattern')[1].id === 'ej2Container_Turquoise_Selection_1').toBe(true);
            done();
        };
        chartObj.loaded = loaded;
        chartObj.selectionPattern = 'Turquoise';
        chartObj.selectionMode = 'Series';
        chartObj.refresh();
    });
    it('Patterns with Star', (done: Function) => {
        loaded = () => {
           expect(document.getElementById(id +'_svg').querySelectorAll('pattern').length).toBe(3);
            expect(document.getElementById(id +'_svg').querySelectorAll('pattern')[0].id === 'ej2Container_Star_Selection_0').toBe(true);
            done();
        };
        chartObj.loaded = loaded;
        chartObj.selectionPattern = 'Star';
        chartObj.selectionMode = 'Cluster';
        chartObj.refresh();
    });
    it('Patterns with Triangle', (done: Function) => {
        loaded = () => {
           expect(document.getElementById(id +'_svg').querySelectorAll('pattern').length).toBe(3);
            expect(document.getElementById(id +'_svg').querySelectorAll('pattern')[2].id === 'ej2Container_Triangle_Selection_2').toBe(true);
            done();
        };
        chartObj.loaded = loaded;
        chartObj.selectionPattern = 'Triangle';
        chartObj.selectionMode = 'DragX';
        chartObj.refresh();
    });
    it('Patterns with Chessboard', (done: Function) => {
        loaded = () => {
           expect(document.getElementById(id +'_svg').querySelectorAll('pattern').length).toBe(3);
            expect(document.getElementById(id +'_svg').querySelectorAll('pattern')[2].id === 'ej2Container_Chessboard_Selection_2').toBe(true);
            done();
        };
        chartObj.loaded = loaded;
        chartObj.selectionPattern = 'Chessboard';
        chartObj.selectionMode = 'DragX';
        chartObj.refresh();
    });
    it('Patterns with Circle', (done: Function) => {
        loaded = () => {
           expect(document.getElementById(id +'_svg').querySelectorAll('pattern').length).toBe(3);
            expect(document.getElementById(id +'_svg').querySelectorAll('pattern')[0].id === 'ej2Container_Circle_Selection_0').toBe(true);
            done();
        };
        chartObj.loaded = loaded;
        chartObj.selectionPattern = 'Circle';
        chartObj.selectionMode = 'DragXY';
        chartObj.refresh();
    });
    it('Patterns with Tile', (done: Function) => {
        loaded = () => {
           expect(document.getElementById(id +'_svg').querySelectorAll('pattern').length).toBe(3);
            expect(document.getElementById(id +'_svg').querySelectorAll('pattern')[0].id === 'ej2Container_Tile_Selection_0').toBe(true);
            done();
        };
        chartObj.loaded = loaded;
        chartObj.selectionPattern = 'Tile';
        chartObj.selectionMode = 'DragY';
        chartObj.refresh();
    });
    it('Patterns with HorizontalDash', (done: Function) => {
        loaded = () => {
           expect(document.getElementById(id +'_svg').querySelectorAll('pattern').length).toBe(3);
            expect(document.getElementById(id +'_svg').querySelectorAll('pattern')[0].id === 'ej2Container_HorizontalDash_Selection_0').toBe(true);
            done();
        };
        chartObj.loaded = loaded;
        chartObj.selectionPattern = 'HorizontalDash';
        chartObj.selectionMode = 'Lasso';
        chartObj.refresh();
    });
    it('Patterns with VerticalDash', (done: Function) => {
        loaded = () => {
           expect(document.getElementById(id +'_svg').querySelectorAll('pattern').length).toBe(3);
            expect(document.getElementById(id +'_svg').querySelectorAll('pattern')[0].id === 'ej2Container_VerticalDash_Selection_0').toBe(true);
            done();
        };
        chartObj.loaded = loaded;
        chartObj.selectionPattern = 'VerticalDash';
        chartObj.selectionMode = 'Point';
        chartObj.isMultiSelect = true;
        chartObj.refresh();
    });
    it('Patterns with Rectangle', (done: Function) => {
        loaded = () => {
           expect(document.getElementById(id +'_svg').querySelectorAll('pattern').length).toBe(3);
            expect(document.getElementById(id +'_svg').querySelectorAll('pattern')[0].id === 'ej2Container_Rectangle_Selection_0').toBe(true);
            done();
        };
        chartObj.loaded = loaded;
        chartObj.selectionPattern = 'Rectangle';
        chartObj.isMultiSelect = false;
        chartObj.refresh();
    });
    it('Patterns with Box', (done: Function) => {
        loaded = () => {
           expect(document.getElementById(id +'_svg').querySelectorAll('pattern').length).toBe(3);
            expect(document.getElementById(id +'_svg').querySelectorAll('pattern')[0].id === 'ej2Container_Box_Selection_0').toBe(true);
            done();
        };
        chartObj.loaded = loaded;
        chartObj.selectionPattern = 'Box';
        chartObj.refresh();
    });
    it('Patterns with VerticalStripe', (done: Function) => {
        loaded = () => {
           expect(document.getElementById(id +'_svg').querySelectorAll('pattern').length).toBe(3);
            expect(document.getElementById(id +'_svg').querySelectorAll('pattern')[0].id === 'ej2Container_VerticalStripe_Selection_0').toBe(true);
            done();
        };
        chartObj.loaded = loaded;
        chartObj.selectionPattern = 'VerticalStripe';
        chartObj.refresh();
    });
    it('Patterns with Bubble', (done: Function) => {
        loaded = () => {
           expect(document.getElementById(id +'_svg').querySelectorAll('pattern').length).toBe(3);
            expect(document.getElementById(id +'_svg').querySelectorAll('pattern')[0].id === 'ej2Container_Bubble_Selection_0').toBe(true);
            done();
        };
        chartObj.loaded = loaded;
        chartObj.selectionPattern = 'Bubble';
        chartObj.refresh();
    });
    it('Patterns with HorizontalStripe', (done: Function) => {
        loaded = () => {
           expect(document.getElementById(id +'_svg').querySelectorAll('pattern').length).toBe(3);
            expect(document.getElementById(id +'_svg').querySelectorAll('pattern')[0].id === 'ej2Container_HorizontalStripe_Selection_0').toBe(true);
            done();
        };
        chartObj.loaded = loaded;
        chartObj.selectionPattern = 'HorizontalStripe';
        chartObj.refresh();
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
});
describe('Range color mapping charts selection in Point mode', function () {
    let chartObj: Chart; let x: number; let y: number;
    let loaded: EmitType<ILoadedEventArgs>;
    let trigger: MouseEvents = new MouseEvents();
    let id: string = 'rangeColorMapping'
    let element2: HTMLElement = createElement('div', { id: 'rangeColorMapping' });
    beforeAll(function () {
        document.body.appendChild(element2);
        chartObj = new Chart({
            primaryXAxis: { valueType: 'Category', majorGridLines: { width: 0 }, title: 'Months' },
            primaryYAxis: {
                lineStyle: { width: 0 },
                majorTickLines: { width: 0 },
                minorTickLines: { width: 0 },
                labelFormat: '{value}°C',
                title: 'Temperature'
            },
            chartArea: {
                border: {
                    width: 0
                }
            },
            series: [
                {
                    dataSource: [
                        { x: 'Jan', y: 6.96 },
                        { x: 'Feb', y: 8.9 },
                        { x: 'Mar', y: 12 },
                        { x: 'Apr', y: 17.5 },
                        { x: 'May', y: 22.1 },
                        { x: 'June', y: 25 },
                        { x: 'July', y: 29.4 },
                        { x: 'Aug', y: 29.6 },
                        { x: 'Sep', y: 25.8 },
                        { x: 'Oct', y: 21.1 },
                        { x: 'Nov', y: 15.5 },
                        { x: 'Dec', y: 9.9 }
                    ], xName: 'x', yName: 'y', type: 'Column',
                    animation: { enable: false }, name: 'USA',
                    cornerRadius: {
                        topLeft: 10, topRight: 10
                    },
                }
            ],
            rangeColorSettings: [
                {
                    label: '1°C to 10°C',
                    start: 1,
                    end: 10,
                    colors: ['#0E05F6']
                },
                {
                    label: '11°C to 20°C',
                    start: 11,
                    end: 20,
                    colors: ['#FFA500']
                },
                {
                    label: '21°C to 30°C',
                    start: 21,
                    end: 30,
                    colors: ['#FF4040']
                }
            ],
            legendSettings: {
                mode: 'Range'
            },
            title: 'Inflation - Consumer Price',
            selectionMode: 'DragXY',
        });
        chartObj.appendTo('#rangeColorMapping');
    });
    afterAll(function () {
        chartObj.destroy();
        element2.remove();
    });
    it('range color mapping Star selection in point mode', function (done) {
        loaded = function () {
            element2 = document.getElementById(id + '_Series_0' + '_Point_' + 2);
            trigger.clickEvent(element2);
            expect(document.querySelectorAll('pattern')[0].id === id + '_Star_Selection_0').toBe(true);
            done();
        };
        chartObj.loaded = loaded;
        chartObj.selectionMode = 'Point';
        chartObj.selectionPattern = 'Star';
        chartObj.refresh();
    });
    it('range color mapping Circle selection in point mode', function (done) {
        loaded = function () {
            element2 = document.getElementById(id + '_Series_0' + '_Point_' + 4);
            trigger.clickEvent(element2);
            expect(document.querySelectorAll('pattern')[0].id === id + '_Circle_Selection_0').toBe(true);
            done();
        };
        chartObj.loaded = loaded;
        chartObj.selectionMode = 'Point';
        chartObj.selectionPattern = 'Circle';
        chartObj.refresh();
    });
    it('range color mapping Circle selection in point mode', function (done) {
        loaded = function () {
            element2 = document.getElementById(id + '_Series_0' + '_Point_' + 4);
            trigger.clickEvent(element2);
            expect(document.querySelector('pattern').children[1].getAttribute('fill') === element2.getAttribute('fill')).toBe(true);
            done();
        };
        chartObj.loaded = loaded;
        chartObj.selectionMode = 'Point';
        chartObj.selectionPattern = 'Circle';
        chartObj.refresh();
    });
    it('range color mapping chart selection color', function (done) {
        loaded = function () {
            element2 = document.getElementById(id + '_Series_0' + '_Point_' + 4);
            trigger.clickEvent(element2);
            expect(document.querySelector('pattern').children[1].getAttribute('fill') === element2.getAttribute('fill')).toBe(true);
            done();
        };
        chartObj.loaded = loaded;
        chartObj.selectionMode = 'Point';
        chartObj.selectionPattern = 'Box';
        chartObj.refresh();
    });
    it('range color mapping chart legend deselected', function (done) {
        loaded = function () {
            element2 = document.getElementById(id + '_Series_0' + '_Point_' + 6);
            trigger.clickEvent(element2);
            expect(document.getElementById(id + '_chart' + '_legend_shape_1').getAttribute('class') === (id + '_ej2_deselected')).toBe(true);
            done();
        };
        chartObj.loaded = loaded;
        chartObj.selectionMode = 'Point';
        chartObj.selectionPattern = 'Circle';
        chartObj.refresh();
    });
    it('range color mapping chart point deselected', function (done) {
        loaded = function () {
            element2 = document.getElementById(id + '_Series_0' + '_Point_' + 6);
            trigger.clickEvent(element2);
            expect(document.getElementById(id + '_Series_0' + '_Point_' + 3).getAttribute('class') === (id + '_ej2_deselected')).toBe(true);
            done();
        };
        chartObj.loaded = loaded;
        chartObj.selectionMode = 'Point';
        chartObj.selectionPattern = 'Circle';
        chartObj.refresh();
    });
    it('range color mapping chart point highlighting', function (done) {
        loaded = function () {
            element2 = document.getElementById(id + '_Series_0' + '_Point_' + 2);
            trigger.mousemovetEvent(element2, 0, 0);
            expect(document.querySelectorAll('pattern')[1].id === id + '_Circle_Selection_0').toBe(true);
            done();
        };
        chartObj.loaded = loaded;
        chartObj.highlightMode = 'Point';
        chartObj.highlightPattern = 'Circle';
        chartObj.refresh();
    });
    it('range color mapping chart point color', function (done) {
        loaded = function () {
            element2 = document.getElementById(id + '_Series_0' + '_Point_' + 2);
            trigger.mousemovetEvent(element2, 0, 0);
            expect(document.querySelectorAll('pattern')[0].children[1].getAttribute('fill') === element2.getAttribute('fill')).toBe(true);
            done();
        };
        chartObj.loaded = loaded;
        chartObj.highlightMode = 'Point';
        chartObj.highlightPattern = 'Circle';
        chartObj.refresh();
    });
    it('range color mapping chart highlight point color', function (done) {
        loaded = function () {
            element2 = document.getElementById(id + '_Series_0' + '_Point_' + 2);
            trigger.mousemovetEvent(element2, 0, 0);
            expect(document.querySelectorAll('pattern')[0].children[1].getAttribute('fill') === document.getElementById(id + '_chart' + '_legend_shape_1').getAttribute('fill')).toBe(true);
            done();
        };
        chartObj.loaded = loaded;
        chartObj.highlightMode = 'Point';
        chartObj.highlightPattern = 'Circle';
        chartObj.refresh();
    });
    it('range color mapping chart legend deselected', function (done) {
        loaded = function () {
            element2 = document.getElementById(id + '_Series_0' + '_Point_' + 6);
            trigger.mousemovetEvent(element2, 0, 0);
            expect(document.getElementById(id + '_chart' + '_legend_shape_1').getAttribute('class') === (id + '_ej2_deselected')).toBe(true);
            done();
        };
        chartObj.loaded = loaded;
        chartObj.highlightMode = 'Point';
        chartObj.highlightPattern = 'Circle';
        chartObj.refresh();
    });
    it('range color mapping chart point deselected', function (done) {
        loaded = function () {
            element2 = document.getElementById(id + '_Series_0' + '_Point_' + 10);
            trigger.mousemovetEvent(element2, 0, 0);
            expect(document.getElementById(id + '_Series_0' + '_Point_' + 3).getAttribute('class') === (id + '_ej2_deselected')).toBe(true);
            done();
        };
        chartObj.loaded = loaded;
        chartObj.highlightMode = 'Point';
        chartObj.highlightPattern = 'Circle';
        chartObj.refresh();
    });
    it('range color mapping chart legend point highlighted', function (done) {
        loaded = function () {
            element2 = document.getElementById(id + "_chart" + "_legend_text_0");
            trigger.mousemovetEvent(element2, 0, 0);
            expect(document.getElementById(id + '_Series_0' + '_Point_' + 0).getAttribute('class') === (id + '_ej2_chart_highlight_series_0')).toBe(true);
            expect(document.getElementById(id + '_Series_0' + '_Point_' + 1).getAttribute('class') === (id + '_ej2_chart_highlight_series_0')).toBe(true);
            expect(document.getElementById(id + '_Series_0' + '_Point_' + 11).getAttribute('class') === (id + '_ej2_chart_highlight_series_0')).toBe(true);
            expect(document.getElementById(id + '_Series_0' + '_Point_' + 3).getAttribute('class') === (id + '_ej2_deselected')).toBe(true);
            done();
        };
        chartObj.loaded = loaded;
        chartObj.highlightMode = 'Point';
        chartObj.highlightPattern = 'Circle';
        chartObj.refresh();
    });
    it('range color mapping chart point highlighting and another point delecting', function (done) {
        loaded = function () {
            element2 = document.getElementById(id + '_Series_0' + '_Point_' + 2);
            trigger.mousemovetEvent(element2, 0, 0);
            expect(document.getElementById(id + '_chart' + '_legend_shape_1').getAttribute('class') == (id + '_ej2_chart_highlight_series_0')).toBe(true);
            expect(document.getElementById(id + '_Series_0' + '_Point_' + 0).getAttribute('class') == (id + '_ej2_deselected')).toBe(true);
            done();
        };
        chartObj.loaded = loaded;
        chartObj.highlightMode = 'Point';
        chartObj.highlightPattern = 'Circle';
        chartObj.refresh();
    });
    it('range color mapping chart legend higlighted another legend deselected', function (done) {
        loaded = function () {
            element2 = document.getElementById(id + '_chart' + '_legend_shape_1');
            trigger.mousemovetEvent(element2, 0, 0);
            expect(document.getElementById(id + '_chart' + '_legend_shape_1').getAttribute('class') == (id + '_ej2_chart_highlight_series_0')).toBe(true);
            expect(document.getElementById(id + '_chart' + '_legend_shape_0').getAttribute('class') == (id + '_ej2_deselected')).toBe(true);
            expect(document.getElementById(id + '_chart' + '_legend_shape_2').getAttribute('class') == (id + '_ej2_deselected')).toBe(true);
            done();
        };
        chartObj.loaded = loaded;
        chartObj.highlightMode = 'Point';
        chartObj.highlightPattern = 'Circle';
        chartObj.refresh();
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
});

describe('Point color mapping chart highlight and selection', function () {
    let chartObj: Chart; let x: number; let y: number;
    let loaded: EmitType<ILoadedEventArgs>;
    let trigger: MouseEvents = new MouseEvents();
    let id: string = 'PointColorMapping';
    let element1: HTMLElement = createElement('div', { id:'PointColorMapping'});
    beforeAll(function () {
        document.body.appendChild(element1);
        chartObj = new Chart({
            primaryXAxis: {
                title: 'Country',
                valueType: 'Category',
                majorGridLines: { width: 0 },
                enableTrim: false,
            },
            primaryYAxis:
            {
                minimum: 0,
                maximum: 800,
                labelFormat:Browser.isDevice ? '{value}' : '{value}M',
                edgeLabelPlacement: 'Shift',
                majorGridLines: { width: 0 },
                majorTickLines: { width: 0 },
                lineStyle: { width: 0 },
                labelStyle: {
                    color: 'transparent'
                }
            },
            chartArea: {
                border: {
                    width: 0
                }
            },
            series: [
                {
                    type: 'Bar',
                    dataSource: [
                        { x: 'Germany', y: 72, country: 'GER: 72', fill: '#43B786' },
                        { x: 'Russia', y: 103.1, country: 'RUS: 103.1', fill: '#404041' },
                        { x: 'Brazil', y: 139.1, country: 'BRZ: 139.1', fill: '#ed7d31' },
                        { x: 'India', y: 462.1, country: 'IND: 462.1', fill: '#584EC6' },
                        { x: 'China', y: 721.4, country: 'CHN: 721.4', fill: '#00bdae' },
                        { x: 'United States<br>Of America', y: 286.9, country: 'USA: 286.9', fill: '#E85F9C' },
                        { x: 'Great Britain', y: 115.1, country: 'GBR: 115.1', fill: '#ffc000' },
                        { x: 'Nigeria', y: 97.2, country: 'NGR: 97.2', fill: '#2A72D5' },

                    ],
                    animation: { enable: false },pointColorMapping : 'fill',
                    xName: 'x', width: 2,
                    yName: 'y', name: 'Germany', dragSettings: { enable: true }
                },
                {
                    type: 'Bar',
                    dataSource: [
                        { x: 'Germany', y: 80, country: 'GER: 72', fill: '000000' },
                        { x: 'Russia', y: 107.1, country: 'RUS: 103.1', fill: '#f40401' },
                        { x: 'Brazil', y: 119.1, country: 'BRZ: 139.1', fill: '#f8b883' },
                        { x: 'India', y: 492.1, country: 'IND: 462.1', fill: '#ffc000' },
                        { x: 'China', y: 621.4, country: 'CHN: 721.4', fill: '#a16ee5' },
                        { x: 'United States<br>Of America', y: 226.9, country: 'USA: 286.9', fill: '#70ad47' },
                        { x: 'Great Britain', y: 165.1, country: 'GBR: 115.1', fill: '#e269ae' },
                        { x: 'Nigeria', y: 103.2, country: 'NGR: 97.2', fill: '#D4515C' },

                    ],
                    animation: { enable: false },pointColorMapping : 'fill',
                    xName: 'x', width: 2,
                    yName: 'y', name: 'Germany', dragSettings: { enable: true }
                },
            ],
            title: 'Inflation - Consumer Price',
            tooltip: { enable: true },
            selectionMode: 'DragXY',
            highlightMode: 'Point',
        });
        chartObj.appendTo('#PointColorMapping');
    });
    afterAll(function () {
        chartObj.destroy();
        element1.remove();
    });
    it('Point color mapping chart  point Selection in Point mode', function (done) {
        loaded = function () {
            element1 = document.getElementById(id + '_Series_0' + '_Point_' + 0);
            trigger.clickEvent(element1);
            expect(document.getElementById(id + '_Series_0' + '_Point_' + 0).getAttribute('class') === (id + '_ej2_chart_selection_series_0')).toBe(true);
            expect(document.getElementById(id + '_Series_0' + '_Point_' + 3).getAttribute('class') === (id + '_ej2_deselected')).toBe(true);
            done();
        };
        chartObj.loaded = loaded;
        chartObj.selectionMode = 'Point';
        chartObj.selectionPattern = 'Circle';
        chartObj.refresh();
    });
    it('Point color mapping chart  point highlighted in Point Mode', function (done) {
        loaded = function () {
            element1 = document.getElementById(id + '_Series_0' + '_Point_' + 0);
            trigger.mousemovetEvent(element1,0,0);
            expect(document.getElementById(id + '_Series_0' + '_Point_' + 0).getAttribute('class') === (id + '_ej2_chart_highlight_series_0')).toBe(true);
            expect(document.getElementById(id + '_Series_0' + '_Point_' + 3).getAttribute('class') === (id + '_ej2_deselected')).toBe(true);
            done();
        };
        chartObj.loaded = loaded;
        chartObj.highlightMode = 'Point';
        chartObj.highlightPattern = 'Circle';
        chartObj.refresh();
    });
    it('Point color mapping chart  point highlighted in Cluster Mode', function (done) {
        loaded = function () {
            element1 = document.getElementById(id + '_Series_0' + '_Point_' + 0);
            trigger.clickEvent(element1);
            expect(document.getElementById(id + '_Series_0' + '_Point_' + 0).getAttribute('class') === (id + '_ej2_chart_selection_series_0')).toBe(true);
            expect(document.getElementById(id + '_Series_1' + '_Point_' + 0).getAttribute('class') === (id + '_ej2_chart_selection_series_1')).toBe(true);
            done();
        };
        chartObj.loaded = loaded;
        chartObj.selectionMode = 'Cluster';
        chartObj.selectionPattern = 'Star';
        chartObj.refresh();
    });
    it('Point color mapping chart  point selectionin Cluster mode', function (done) {
        loaded = function () {
            element1 = document.getElementById(id + '_Series_0' + '_Point_' + 0);
            trigger.mousemovetEvent(element1,0,0);
            expect(document.getElementById(id + '_Series_0' + '_Point_' + 0).getAttribute('class') === (id + '_ej2_chart_highlight_series_0')).toBe(true);
            expect(document.getElementById(id + '_Series_1' + '_Point_' + 0).getAttribute('class') === (id + '_ej2_chart_highlight_series_1')).toBe(true);
            done();
        };
        chartObj.loaded = loaded;
        chartObj.highlightMode = 'Cluster';
        chartObj.highlightPattern = 'Star';
        chartObj.refresh();
    });
    it('Point color mapping chart legend higlighted', function (done) {
        loaded = function () {
            element1 = document.getElementById(id + '_chart' + '_legend_shape_1');
            trigger.mousemovetEvent(element1, 0, 0);
            expect(document.getElementById(id + '_chart' + '_legend_shape_1').getAttribute('class') == (id + '_ej2_chart_highlight_series_1')).toBe(true);
            expect(document.getElementById(id + '_Series_0' + '_Point_' + 0).getAttribute('class') == (id + '_ej2_deselected')).toBe(true);
            expect(document.getElementById(id + '_chart' + '_legend_shape_0').getAttribute('class') == (id + '_ej2_deselected')).toBe(true);
            done();
        };
        chartObj.loaded = loaded;
        chartObj.highlightMode = 'Point';
        chartObj.highlightPattern = 'Circle';
        chartObj.refresh();
    });
    it('memory leak', () => {
        profile.sample();
        let average: any = inMB(profile.averageChange)
        //Check average change in memory samples to not be over 10MB
        expect(average).toBeLessThan(10);
        let memory: any = inMB(getMemoryProfile())
        //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
    });
});
    /**
     * Cheacking point drag and drop with range selection
     */
    describe('Line series point drag and drop with range selection', () => {
        let chartObj: Chart; let x: number; let y: number;
        let loaded: EmitType<ILoadedEventArgs>;
        let trigger: MouseEvents = new MouseEvents();
        let element1: HTMLElement = createElement('div', { id: 'container' });
        beforeAll(() => {
            document.body.appendChild(element1);
            chartObj = new Chart(
                {
                    primaryXAxis: {
                        valueType: 'DateTime',
                        labelFormat: 'y',
                        intervalType: 'Years',
                        edgeLabelPlacement: 'Shift',
                        majorGridLines: { width: 0 }
                    },
                
                    //Initializing Primary Y Axis
                    primaryYAxis:
                    {
                        labelFormat: '{value}%',
                     //   rangePadding: 'None',
                        minimum: 0,
                        maximum: 100,
                        interval: 20,
                        lineStyle: { width: 0 },
                        majorTickLines: { width: 0 },
                        minorTickLines: { width: 0 }
                    },
                    chartArea: {
                        border: {
                            width: 0
                        }
                    },
                    //Initializing Chart Series
                    series: [
                        {
                            type: 'Line',
                            dataSource: [
                                { x: new Date(2005, 0, 1), y: 21 }, { x: new Date(2006, 0, 1), y: 24 },
                                { x: new Date(2007, 0, 1), y: 36 }, { x: new Date(2008, 0, 1), y: 38 },
                                { x: new Date(2009, 0, 1), y: 54 }, { x: new Date(2010, 0, 1), y: 57 },
                                { x: new Date(2011, 0, 1), y: 70 }
                            ],
                            animation: { enable: false },
                            xName: 'x', width: 2, marker: {
                                visible: true,
                                width: 20,
                                height: 20
                            },
                            yName: 'y', name: 'Germany', dragSettings: { enable: true }
                        },
                        {
                            type: 'Line',
                            dataSource: [
                                { x: new Date(2005, 0, 1), y: 28 }, { x: new Date(2006, 0, 1), y: 44 },
                                { x: new Date(2007, 0, 1), y: 48 }, { x: new Date(2008, 0, 1), y: 50 },
                                { x: new Date(2009, 0, 1), y: 66 }, { x: new Date(2010, 0, 1), y: 78 }, { x: new Date(2011, 0, 1), y: 84 }
                            ],
                            animation: { enable: false },
                            xName: 'x', width: 2, marker: {
                                visible: true,
                                width: 20,
                                height: 20
                            },
                            yName: 'y', name: 'England', dragSettings: { enable: true }
                        }
                    ],
                
                    //Initializing Chart title
                    title: 'Inflation - Consumer Price',
                    //Initializing User Interaction Tooltip
                    tooltip: { enable: true},
                    selectionMode: 'DragXY',
                });
            chartObj.appendTo('#container');

        });
        afterAll((): void => {
            chartObj.destroy();
            element1.remove();
        });

        it('line series drag and drop with range selection', (done: Function) => {
            loaded = (): void => {
                let target: HTMLElement = document.getElementById('container_Series_1_Point_0_Symbol');
                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                y = parseFloat(target.getAttribute('cy')) + parseFloat(chartArea.getAttribute('y')) + element1.offsetTop;
                x = parseFloat(target.getAttribute('cx')) + parseFloat(chartArea.getAttribute('x')) + element1.offsetLeft;
                trigger.mousemovetEvent(target, Math.ceil(x), Math.ceil(y));
                trigger.draganddropEvent(element1, Math.ceil(x), Math.ceil(y), Math.ceil(x), Math.ceil(y) - 108);
                let yValue: number = chartObj.visibleSeries[1].points[0].yValue;
                expect(yValue == 60.24 || yValue == 59.82).toBe(true);
                chartObj.loaded = null;
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[1].marker.shape = 'Circle';
            chartObj.refresh();
        });
    });
    describe('Chart Selection: Checking drag ', () => {
        beforeAll(() => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
        });
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
        let closeId: string = id + '_ej2_drag_close0';
        beforeAll(() => {
            chartContainer = createElement('div', { id: id });
            document.body.appendChild(chartContainer);
            document.body.appendChild(createElement('style', {
                innerHTML: ' .selection { stroke-width: 5; fill: lime; stroke: red; opacity: 1; } '
            }));
            chartObj = new Chart({
                series: seriesCollection,
                primaryXAxis: { minimum: 2004, maximum: 2012 },
            //    primaryYAxis: { rangePadding: 'None' },
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
        it('Chart selesction:  checking multiselection', (done: Function) => {
            loaded = () => {
                trigger.draganddropEvent(chartContainer, 100, 100, 300, 300);
                element = document.getElementById(draggedRectGroup);
                expect (chartContainer !== null).toBe(true);
                trigger.mouseupEvent(document.getElementById(closeId), 0, 0, 0, 0);
                done();
            };
            chartObj.selectionMode = 'DragXY';
            chartObj.loaded = loaded;
            chartObj.selectionModule.selectedDataIndexes = [];
            chartObj.allowMultiSelection = true;
            chartObj.refresh();
        });
        it('Chart selesction: checking multiselection with lasso', (done: Function) => {
            loaded = () => {
                trigger.draganddropEvent(chartContainer, 100, 100, 300, 300);
                element = document.getElementById(draggedRectGroup);
                expect (chartContainer !== null).toBe(true);
                done();
            };
            chartObj.selectionMode = 'Lasso';
            chartObj.loaded = loaded;
            chartObj.selectionModule.selectedDataIndexes = [];
            chartObj.allowMultiSelection = false;
            chartObj.refresh();
        });
        it('Chart selection:  checking multiselection with lasso and multi selection', (done: Function) => {
            loaded = () => {
                trigger.draganddropEvent(chartContainer, 100, 100, 300, 300);
                element = document.getElementById(draggedRectGroup);
                expect (chartContainer !== null).toBe(true);
                done();
            };
            chartObj.selectionMode = 'Lasso';
            chartObj.loaded = loaded;
            chartObj.selectionModule.selectedDataIndexes = [];
            chartObj.allowMultiSelection = true;
            chartObj.refresh();
        });
        it('Chart selection checking index elements', (done: Function) => {
            loaded = (args: ILoadedEventArgs) => {
                args.chart.selectionModule.findElements( args.chart, args.chart.series[0], {series: 0, point:0}, 'element'  );
                expect (chartContainer !== null).toBe(true);
                done();
            };
            chartObj.selectionMode = 'Cluster';
            chartObj.loaded = loaded;
            chartObj.selectionModule.selectedDataIndexes = [];
            chartObj.allowMultiSelection = true;
            chartObj.refresh();
        });
        it('Chart selection checking slection target elements', (done: Function) => {
            loaded = (args: ILoadedEventArgs) => {
                args.chart.selectionModule.calculateSelectedElements(null, 'Click');
                expect(chartContainer !== null).toBe(true);
                done();
            };
            chartObj.selectionMode = 'Cluster';
            chartObj.loaded = loaded;
            chartObj.selectionModule.selectedDataIndexes = [];
            chartObj.allowMultiSelection = true;
            chartObj.refresh();
        });
        it('Chart selection checking slection target elements', (done: Function) => {
            loaded = (args: ILoadedEventArgs) => {
                args.chart.selectionModule.calculateSelectedElements(null, 'Click');
                expect(chartContainer !== null).toBe(true);
                done();
            };
            chartObj.selectionMode = 'Cluster';
            chartObj.loaded = loaded;
            chartObj.selectionModule.selectedDataIndexes = [];
            chartObj.allowMultiSelection = true;
            chartObj.refresh();
        });
        it('Chart selection checking perform selection', (done: Function) => {
            loaded = (args: ILoadedEventArgs) => {
                let element = document.getElementById('ej2Container_Series_0')
                args.chart.selectionModule.performSelection({ series: 0, point: 0 }, args.chart, element);
                expect(chartContainer !== null).toBe(true);
                done();
            };
            chartObj.selectionMode = 'Point';
            chartObj.loaded = loaded;
            chartObj.series[0].type = 'Area';
            chartObj.selectionModule.selectedDataIndexes = [];
            chartObj.allowMultiSelection = true;
            chartObj.refresh();
        });
    });