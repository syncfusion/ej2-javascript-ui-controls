import { Browser, createElement, EmitType } from '@syncfusion/ej2-base';
import { Chart3DLoadedEventArgs } from '../../../src/chart3d/model/chart3d-Interface';
import { ColumnSeries3D } from '../../../src/chart3d/series/column-series';
import { BarSeries3D } from '../../../src/chart3d/series/bar-series';
import { Highlight3D } from '../../../src/chart3d/user-interaction/high-light';
import { Chart3D } from '../../../src/chart3d/chart3D';
import { Legend3D } from '../../../src/chart3d/legend/legend';
import { getMemoryProfile, inMB, profile } from '../../common.spec';
import { MouseEvents } from '../base/events.spec';
import { Chart3DSeriesModel} from '../../../src/chart3d/series/chart-series-model';
import { firstSeries, secondSeries, secureRandom, thirdSeries } from '../../chart/base/data.spec';
import { Selection3D } from '../../../src/chart3d/user-interaction/selection';

Chart3D.Inject(
    ColumnSeries3D, BarSeries3D, Highlight3D, Legend3D, Selection3D
);
let seriesCollection: Chart3DSeriesModel[] = [];
const colors: string[] = ['#663AB6', '#EB3F79', '#F8AB1D', '#B82E3D', '#049CB1', '#F2424F', '#C2C924', '#3DA046', '#074D67', '#02A8F4'];
seriesCollection = [
    {
        name: 'First',
        animation: { enable: false },
        fill: colors[0],
        dataSource: firstSeries, xName: 'x', yName: 'y',
        type: 'Column'
    },
    {
        name: 'Second',
        visible: true,
        animation: { enable: false },
        fill: colors[5],
        dataSource: secondSeries, xName: 'x', yName: 'y',
        type: 'Column'
    },
    {
        name: 'Third',
        animation: { enable: false },
        fill: colors[8],
        dataSource: thirdSeries, xName: 'x', yName: 'y',
        type: 'Column'
    }
];
describe('3DChart Control Selection ', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log('Unsupported environment, window.performance.memory is unavailable');
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
    const id: string = 'ej2Container';
    const selection: string = id + '_ej2_chart_selection_series_';
    let chartObj: Chart3D;
    let element: HTMLElement;
    let selected: HTMLCollection;
    let i: number = 0;
    let j: number = 0;
    let loaded: EmitType<Chart3DLoadedEventArgs>;
    const trigger: MouseEvents = new MouseEvents();
    let chartContainer: HTMLElement;
    const draggedRectGroup: string = id + '_ej2_drag_rect';
    const closeId: string = id + '_ej2_drag_close';
    beforeAll(() => {
        chartContainer = createElement('div', { id: id });
        document.body.appendChild(chartContainer);
        document.body.appendChild(createElement('style', {
            innerHTML: ' .selection { stroke-width: 5; fill: lime; stroke: red; opacity: 1; } '
        }));
        chartObj = new Chart3D({
            series: seriesCollection,
            primaryXAxis: { minimum: 2004, maximum: 2012 },
            //    primaryYAxis: { rangePadding: 'None' },
            height: '500',
            width: '800',
            loaded: loaded,
            selectionMode: 'Point',
            enableSideBySidePlacement: true,
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
            element = document.getElementById(id + '-svg-0-region-series-0' + '-point-3');
            trigger.clickEvent(element);
            element = document.getElementById(id + '-svg-0-region-series-0' + '-point-1');
            trigger.clickEvent(element);
            element = document.getElementById(id + '-svg-0-region-series-0' + '-point-5');
            trigger.clickEvent(element);
            expect(document.getElementsByClassName(selection + '0').length).toBe(7);
            done();
        };
        chartObj.loaded = loaded;
        chartObj.refresh();
    });
    it('MultiSelect false Selection Mode Cluster', (done: Function) => {
        loaded = () => {
            element = document.getElementById(id + '-svg-0-region-series-0' + '-point-5');
            trigger.clickEvent(element);
            element = document.getElementById(id + '-svg-0-region-series-1' + '-point-2');
            trigger.clickEvent(element);
            for (let i: number = 0; i < seriesCollection.length; i++) {
                expect(document.getElementsByClassName(selection + i).length).toBe(7);
            }
            done();
        };
        chartObj.selectionMode = 'Cluster';
        chartObj.loaded = loaded;
        chartObj.selection3DModule.selectedDataIndexes = [];
        chartObj.refresh();
    });
    it('MultiSelect false Selection Mode Series', (done: Function) => {
        loaded = () => {
            element = document.getElementById(id + '-svg-0-region-series-0' + '-point-3');
            trigger.clickEvent(element);
            element = document.getElementById(id + '-svg-0-region-series-1' + '-point-3');
            trigger.clickEvent(element);
            selected = document.getElementsByClassName(selection + '1');
            expect(selected.length).toBe(43);
            done();
        };
        chartObj.selectionMode = 'Series';
        chartObj.loaded = loaded;
        chartObj.selection3DModule.selectedDataIndexes = [];
        chartObj.refresh();
    });
    it('MultiSelect true Selection Mode Series', (done: Function) => {
        loaded = () => {
            element = document.getElementById(id + '-svg-0-region-series-0' + '-point-' + 1);
            trigger.clickEvent(element);
            element = document.getElementById(id + '-svg-0-region-series-1' + '-point-' + 2);
            trigger.clickEvent(element);
            element = document.getElementById(id + '-svg-0-region-series-2' + '-point-' + 3);
            trigger.clickEvent(element);
            expect(document.getElementsByClassName(selection + '0').length).toBe(43);
            expect(document.getElementsByClassName(selection + '1').length).toBe(43);
            expect(document.getElementsByClassName(selection + '2').length).toBe(43);
            element = document.getElementById(id + '-svg-0-region-series-0' + '-point-' + 2);
            trigger.clickEvent(element);
            element = document.getElementById(id + '-svg-0-region-series-1' + '-point-' + 4);
            trigger.clickEvent(element);
            element = document.getElementById(id + '-svg-0-region-series-2' + '-point-' + 3);
            trigger.clickEvent(element);
            expect(document.getElementsByClassName(selection + '0').length).toBe(0);
            expect(document.getElementsByClassName(selection + '1').length).toBe(0);
            expect(document.getElementsByClassName(selection + '2').length).toBe(0);
            done();
        };
        chartObj.isMultiSelect = true;
        chartObj.loaded = loaded;
        chartObj.selection3DModule.selectedDataIndexes = [];
        chartObj.refresh();
    });
    it('MultiSelect true Selection Mode Point', (done: Function) => {
        loaded = () => {
            element = document.getElementById(id + '-svg-0-region-series-0' + '-point-' + 3);
            trigger.clickEvent(element);
            element = document.getElementById(id + '-svg-0-region-series-1' + '-point-' + 2);
            trigger.clickEvent(element);
            element = document.getElementById(id + '-svg-0-region-series-2' + '-point-' + 3);
            trigger.clickEvent(element);
            element = document.getElementById(id + '-svg-0-region-series-0' + '-point-' + 5);
            trigger.clickEvent(element);
            element = document.getElementById(id + '-svg-0-region-series-2' + '-point-' + 4);
            trigger.clickEvent(element);
            expect(document.getElementsByClassName(selection + '0').length).toBe(13);
            expect(document.getElementsByClassName(selection + '1').length).toBe(7);
            expect(document.getElementsByClassName(selection + '2').length).toBe(13);
            done();
        };
        chartObj.selectionMode = 'Point';
        chartObj.loaded = loaded;
        chartObj.selection3DModule.selectedDataIndexes = [];
        chartObj.refresh();
    });
    it('MultiSelect true Selection Mode  Cluster', (done: Function) => {
        loaded = () => {
            element = document.getElementById(id + '-svg-0-region-series-0' + '-point-' + 3);
            trigger.clickEvent(element);
            for (let i: number = 0; i < seriesCollection.length; i++) {
                expect(document.getElementsByClassName(selection + i).length).toBe(7);
            }
            done();
        };
        chartObj.selectionMode = 'Cluster';
        chartObj.isMultiSelect = true;
        chartObj.loaded = loaded;
        chartObj.selection3DModule.selectedDataIndexes = [];
        chartObj.refresh();
    });
    it('Single point selection and UnSelection', (done: Function) => {
        loaded = () => {
            element = document.getElementById(id + '-svg-0-region-series-0-point-4');
            trigger.clickEvent(element);
            trigger.clickEvent(element);
            selected = document.getElementsByClassName(selection + '0');
            expect(selected.length).toBe(0);
            done();
        };
        chartObj.selectionMode = 'Point';
        chartObj.isMultiSelect = false;
        chartObj.loaded = loaded;
        chartObj.selection3DModule.selectedDataIndexes = [];
        chartObj.refresh();
    });
    it('UnSelectionStyle selection', (done: Function) => {
        loaded = () => {
            element = document.getElementById(id + '-svg-0-region-series-0-point-3');
            trigger.clickEvent(element);
            selected = document.getElementsByClassName(selection + '0');
            element = document.getElementById(id + '-svg-0-region-series-0-point-2');
            expect(element.classList[0] === 'custom');
            done();
        };
        chartObj.selectionMode = 'Point';
        chartObj.isMultiSelect = false;
        chartObj.loaded = loaded;
        chartObj.selection3DModule.selectedDataIndexes = [];
        chartObj.refresh();
    });

    it('Single Series selection and UnSelection', (done: Function) => {
        loaded = () => {
            element = document.getElementById(id + '-svg-0-region-series-0-point-0');
            trigger.clickEvent(element);
            selected = document.getElementsByClassName(selection + '0');
            expect(selected.length).toBe(43);
            trigger.clickEvent(element);
            selected = document.getElementsByClassName(selection + '0');
            expect(selected.length).toBe(0);
            done();
        };
        chartObj.selectionMode = 'Series';
        chartObj.isMultiSelect = false;
        chartObj.loaded = loaded;
        chartObj.selection3DModule.selectedDataIndexes = [];
        chartObj.refresh();
    });
    it('Multiple Series selection and UnSelection', (done: Function) => {
        loaded = () => {
            let total: number = 0;
            for (i = 0, length = seriesCollection.length; i < length; i++) {
                element = document.getElementById(id + '-svg-0-region-series-' + i + '-point-0');
                trigger.clickEvent(element);
                selected = document.getElementsByClassName(selection + i);
                expect(selected.length).toBe(43);
                total = 9 * (i + 1);
            }
            for (; i > 0; i--) {
                element = document.getElementById(id + '-svg-0-region-series-' + (i - 1) + '-point-4');
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
        chartObj.selection3DModule.selectedDataIndexes = [];
        chartObj.refresh();
    });
    it('Single Cluster selection and UnSelection', (done: Function) => {
        loaded = () => {
            const index: number = Math.floor((secureRandom() * 10) % 6);
            element = document.getElementById(id + '-svg-0-region-series-1-point-' + index);
            trigger.clickEvent(element);
            for (i = 0; i < seriesCollection.length; i++) {
                selected = document.getElementsByClassName(selection + i);
                expect(selected.length).toBe(7);
            }
            element = document.getElementById(id + '-svg-0-region-series-0-point-' + index);
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
        chartObj.selection3DModule.selectedDataIndexes = [];
        chartObj.refresh();
    });
    it('Multiple Cluster selection and UnSelection', (done: Function) => {
        loaded = () => {
            element = document.getElementById(id + '-svg-0-region-series-1-point-' + 1);
            trigger.clickEvent(element);
            element = document.getElementById(id + '-svg-0-region-series-0-point-' + 3);
            trigger.clickEvent(element);
            element = document.getElementById(id + '-svg-0-region-series-2-point-' + 5);
            trigger.clickEvent(element);
            for (i = 0; i < seriesCollection.length; i++) {
                selected = document.getElementsByClassName(selection + i);
                expect(selected.length).toBe(19);
            }
            element = document.getElementById(id + '-svg-0-region-series-1-point-' + 1);
            trigger.clickEvent(element);
            element = document.getElementById(id + '-svg-0-region-series-0-point-' + 3);
            trigger.clickEvent(element);
            element = document.getElementById(id + '-svg-0-region-series-2-point-' + 5);
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
        chartObj.selection3DModule.selectedDataIndexes = [];
        chartObj.refresh();
    });
    it('Selected DataIndexes checking', (done: Function) => {
        loaded = () => {
            expect(document.getElementsByClassName(selection + '0').length).toBe(7);
            done();
        };
        chartObj.selectionMode = 'Point';
        chartObj.selectedDataIndexes = [{ series: 0, point: 2 }];
        chartObj.loaded = loaded;
        chartObj.selection3DModule.selectedDataIndexes = [];
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
        chartObj.selection3DModule.selectedDataIndexes = [];
        chartObj.refresh();
    });
    it('Selected Redraw checking', (done: Function) => {
        element = document.getElementById(id + '-svg-0-region-series-0-point-' + 3);
        trigger.clickEvent(element);
        chartObj.isMultiSelect = false;
        chartObj.dataBind();
        expect(document.getElementsByClassName(selection + '0').length).toBe(43);
        done();
    });
    it('Selected Legend toggle visible false', (done: Function) => {
        loaded = () => {
            element = document.getElementById(id + '_chart_legend' + '_text_' + 1);
            trigger.clickEvent(element);
            expect(element.getAttribute('class') !== '').toBe(true);
            expect(document.getElementsByClassName(selection + '1').length).toBe(43);
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
        chartObj.selection3DModule.selectedDataIndexes = [];
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
        chartObj.selection3DModule.selectedDataIndexes = [];
        chartObj.refresh();
    });
    it('Selected DataBind cluster', (done: Function) => {
        element = document.getElementById(id + '-svg-0-region-series-0-point-' + 3);
        trigger.clickEvent(element);
        chartObj.dataBind();
        for (i = 0; i < chartObj.series.length; i++) {
            expect(document.getElementsByClassName(selection + i).length).toBe(7);
        }
        done();
    });
    it('Point color mapping chart legend higlighted', function (done) {
        loaded = function () {
            element = document.getElementById(id + '_chart' + '_legend_shape_1');
            trigger.mousemovetEvent(element, 0, 0);
            expect(element !== null).toBe(true);
            done();
        };
        chartObj.loaded = loaded;
        chartObj.highlightMode = 'Point';
        chartObj.refresh();
    });
    it('Selected DataBind cluster to series', (done: Function) => {
        chartObj.selectionMode = 'Series';
        chartObj.dataBind();
        selected = document.getElementsByClassName(selection + 0);
        for (i = 1; i < chartObj.series.length; i++) {
            selected = document.getElementsByClassName(selection + i);
            expect(selected.length).toBe(0);
        }
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
        chartObj.selection3DModule.selectedDataIndexes = [];
        chartObj.refresh();
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
        chartObj.selection3DModule.selectedDataIndexes = [];
        chartObj.refresh();
    });
    it('Patterns with Dots', (done: Function) => {
        loaded = () => {
            expect(document.getElementById(id + '_svg').querySelectorAll('pattern').length).toBe(6);
            expect(document.getElementById(id + '_svg').querySelectorAll('pattern')[0].id === 'ej2Container_Dots_Selection_0').toBe(true);
            done();
        };
        chartObj.loaded = loaded;
        chartObj.selectionPattern = 'Dots';
        chartObj.refresh();
    });

    it('Patterns with DiagonalForward', (done: Function) => {
        loaded = () => {
            expect(document.getElementById(id + '_svg').querySelectorAll('pattern').length).toBe(6);
            expect(document.getElementById(id + '_svg').querySelectorAll('pattern')[0].id === 'ej2Container_DiagonalForward_Selection_0').toBe(true);
            done();
        };
        chartObj.loaded = loaded;
        chartObj.selectionPattern = 'DiagonalForward';
        chartObj.refresh();
    });
    it('Patterns with Crosshatch', (done: Function) => {
        loaded = () => {
            expect(document.getElementById(id + '_svg').querySelectorAll('pattern').length).toBe(6);
            expect(document.getElementById(id + '_svg').querySelectorAll('pattern')[0].id === 'ej2Container_Crosshatch_Selection_0').toBe(true);
            done();
        };
        chartObj.loaded = loaded;
        chartObj.selectionPattern = 'Crosshatch';
        chartObj.refresh();
    });
    it('Patterns with Pacman', (done: Function) => {
        loaded = () => {
            expect(document.getElementById(id + '_svg').querySelectorAll('pattern').length).toBe(6);
            expect(document.getElementById(id + '_svg').querySelectorAll('pattern')[0].id === 'ej2Container_Pacman_Selection_0').toBe(true);
            done();
        };
        chartObj.loaded = loaded;
        chartObj.selectionPattern = 'Pacman';
        chartObj.refresh();
    });
    it('Patterns with DiagonalBackward', (done: Function) => {
        loaded = () => {
            expect(document.getElementById(id + '_svg').querySelectorAll('pattern').length).toBe(6);
            expect(document.getElementById(id + '_svg').querySelectorAll('pattern')[0].id === 'ej2Container_DiagonalBackward_Selection_0').toBe(true);
            done();
        };
        chartObj.loaded = loaded;
        chartObj.selectionPattern = 'DiagonalBackward';
        chartObj.refresh();
    });
    it('Patterns with Grid', (done: Function) => {
        loaded = () => {
            expect(document.getElementById(id + '_svg').querySelectorAll('pattern').length).toBe(6);
            expect(document.getElementById(id + '_svg').querySelectorAll('pattern')[0].id === 'ej2Container_Grid_Selection_0').toBe(true);
            done();
        };
        chartObj.loaded = loaded;
        chartObj.selectionPattern = 'Grid';
        chartObj.refresh();
    });
    it('Patterns with Turquoise', (done: Function) => {
        loaded = () => {
            expect(document.getElementById(id + '_svg').querySelectorAll('pattern').length).toBe(6);
            expect(document.getElementById(id + '_svg').querySelectorAll('pattern')[1].id === 'ej2Container_Turquoise_Selection_1').toBe(true);
            done();
        };
        chartObj.loaded = loaded;
        chartObj.selectionPattern = 'Turquoise';
        chartObj.selectionMode = 'Series';
        chartObj.refresh();
    });
    it('Patterns with Star', (done: Function) => {
        loaded = () => {
            expect(document.getElementById(id + '_svg').querySelectorAll('pattern').length).toBe(6);
            expect(document.getElementById(id + '_svg').querySelectorAll('pattern')[0].id === 'ej2Container_Star_Selection_0').toBe(true);
            done();
        };
        chartObj.loaded = loaded;
        chartObj.selectionPattern = 'Star';
        chartObj.selectionMode = 'Cluster';
        chartObj.refresh();
    });
    it('Patterns with Triangle', (done: Function) => {
        loaded = () => {
            expect(document.getElementById(id + '_svg').querySelectorAll('pattern').length).toBe(6);
            expect(document.getElementById(id + '_svg').querySelectorAll('pattern')[2].id === 'ej2Container_Triangle_Selection_2').toBe(true);
            done();
        };
        chartObj.loaded = loaded;
        chartObj.selectionPattern = 'Triangle';
        chartObj.refresh();
    });
    it('Patterns with Chessboard', (done: Function) => {
        loaded = () => {
            expect(document.getElementById(id + '_svg').querySelectorAll('pattern').length).toBe(6);
            expect(document.getElementById(id + '_svg').querySelectorAll('pattern')[2].id === 'ej2Container_Chessboard_Selection_2').toBe(true);
            done();
        };
        chartObj.loaded = loaded;
        chartObj.selectionPattern = 'Chessboard';
        chartObj.refresh();
    });
    it('Patterns with Circle', (done: Function) => {
        loaded = () => {
            expect(document.getElementById(id + '_svg').querySelectorAll('pattern').length).toBe(6);
            expect(document.getElementById(id + '_svg').querySelectorAll('pattern')[0].id === 'ej2Container_Circle_Selection_0').toBe(true);
            done();
        };
        chartObj.loaded = loaded;
        chartObj.selectionPattern = 'Circle';
        chartObj.refresh();
    });
    it('Patterns with Tile', (done: Function) => {
        loaded = () => {
            expect(document.getElementById(id + '_svg').querySelectorAll('pattern').length).toBe(6);
            expect(document.getElementById(id + '_svg').querySelectorAll('pattern')[0].id === 'ej2Container_Tile_Selection_0').toBe(true);
            done();
        };
        chartObj.loaded = loaded;
        chartObj.selectionPattern = 'Tile';
        chartObj.refresh();
    });
    it('Patterns with HorizontalDash', (done: Function) => {
        loaded = () => {
            expect(document.getElementById(id + '_svg').querySelectorAll('pattern').length).toBe(6);
            expect(document.getElementById(id + '_svg').querySelectorAll('pattern')[0].id === 'ej2Container_HorizontalDash_Selection_0').toBe(true);
            done();
        };
        chartObj.loaded = loaded;
        chartObj.selectionPattern = 'HorizontalDash';
        chartObj.refresh();
    });
    it('Patterns with VerticalDash', (done: Function) => {
        loaded = () => {
            expect(document.getElementById(id + '_svg').querySelectorAll('pattern').length).toBe(6);
            expect(document.getElementById(id + '_svg').querySelectorAll('pattern')[0].id === 'ej2Container_VerticalDash_Selection_0').toBe(true);
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
            expect(document.getElementById(id + '_svg').querySelectorAll('pattern').length).toBe(6);
            expect(document.getElementById(id + '_svg').querySelectorAll('pattern')[0].id === 'ej2Container_Rectangle_Selection_0').toBe(true);
            done();
        };
        chartObj.loaded = loaded;
        chartObj.selectionPattern = 'Rectangle';
        chartObj.isMultiSelect = false;
        chartObj.refresh();
    });
    it('Patterns with Box', (done: Function) => {
        loaded = () => {
            expect(document.getElementById(id + '_svg').querySelectorAll('pattern').length).toBe(6);
            expect(document.getElementById(id + '_svg').querySelectorAll('pattern')[0].id === 'ej2Container_Box_Selection_0').toBe(true);
            done();
        };
        chartObj.loaded = loaded;
        chartObj.selectionPattern = 'Box';
        chartObj.refresh();
    });
    it('Patterns with VerticalStripe', (done: Function) => {
        loaded = () => {
            expect(document.getElementById(id + '_svg').querySelectorAll('pattern').length).toBe(6);
            expect(document.getElementById(id + '_svg').querySelectorAll('pattern')[0].id === 'ej2Container_VerticalStripe_Selection_0').toBe(true);
            done();
        };
        chartObj.loaded = loaded;
        chartObj.selectionPattern = 'VerticalStripe';
        chartObj.refresh();
    });
    it('Patterns with Bubble', (done: Function) => {
        loaded = () => {
            expect(document.getElementById(id + '_svg').querySelectorAll('pattern').length).toBe(6);
            expect(document.getElementById(id + '_svg').querySelectorAll('pattern')[0].id === 'ej2Container_Bubble_Selection_0').toBe(true);
            done();
        };
        chartObj.loaded = loaded;
        chartObj.selectionPattern = 'Bubble';
        chartObj.refresh();
    });
    it('Patterns with HorizontalStripe', (done: Function) => {
        loaded = () => {
            expect(document.getElementById(id + '_svg').querySelectorAll('pattern').length).toBe(6);
            expect(document.getElementById(id + '_svg').querySelectorAll('pattern')[0].id === 'ej2Container_HorizontalStripe_Selection_0').toBe(true);
            done();
        };
        chartObj.loaded = loaded;
        chartObj.selectionPattern = 'HorizontalStripe';
        chartObj.refresh();
    });
    it('selection with single series', (done: Function) => {
        loaded = () => {
            element = document.getElementById(id + '-svg-0-region-series-0-point-' + 2);
            trigger.clickEvent(element);
            done();
        };
        chartObj.loaded = loaded;
        chartObj.selectionPattern = 'None';
        chartObj.series = [seriesCollection[0]]
        chartObj.refresh();
    });
    it('memory leak', () => {
        profile.sample();
        const average: any = inMB(profile.averageChange);
        //Check average change in memory samples to not be over 10MB
        expect(average).toBeLessThan(10);
        const memory: any = inMB(getMemoryProfile());
        //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
    });
});
describe('Point color mapping chart highlight and selection', function () {
    let chartObj: Chart3D; let x: number; let y: number;
    let loaded: EmitType<Chart3DLoadedEventArgs>;
    let trigger: MouseEvents = new MouseEvents();
    let id: string = 'PointColorMapping';
    let element1: HTMLElement = createElement('div', { id: 'PointColorMapping' });
    beforeAll(function () {
        document.body.appendChild(element1);
        chartObj = new Chart3D({
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
                labelFormat: Browser.isDevice ? '{value}' : '{value}M',
                edgeLabelPlacement: 'Shift',
                majorGridLines: { width: 0 },
                majorTickLines: { width: 0 },
                labelStyle: {
                    color: 'transparent'
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
                    animation: { enable: false }, pointColorMapping: 'fill',
                    xName: 'x',
                    yName: 'y', name: 'Germany',
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
                    animation: { enable: false }, pointColorMapping: 'fill',
                    xName: 'x',
                    yName: 'y', name: 'Germany',
                },
            ],enableSideBySidePlacement: false,
            title: 'Inflation - Consumer Price',
            tooltip: { enable: true },
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
            element1 = document.getElementById(id + '-svg-0-region-series-0' + '-point-' + 0);
            trigger.clickEvent(element1);
            expect(document.getElementById(id + '-svg-0-region-series-0' + '-point-' + 0).getAttribute('class') === (id + '_ej2_chart_selection_series_0')).toBe(true);
            expect(document.getElementById(id + '-svg-0-region-series-0' + '-point-' + 3).getAttribute('class') === (id + '_ej2_deselected')).toBe(true);
            done();
        };
        chartObj.loaded = loaded;
        chartObj.selectionMode = 'Point';
        chartObj.selectionPattern = 'Circle';
        chartObj.refresh();
    });
    it('Point color mapping chart  point highlighted in Point Mode', function (done) {
        loaded = function () {
            element1 = document.getElementById(id + '-svg-0-region-series-0' + '-point-' + 0);
            trigger.mousemovetEvent(element1, 0, 0);
            expect(document.getElementById(id + '-svg-0-region-series-0' + '-point-' + 0).getAttribute('class') === (id + '_ej2_chart_highlight_series_0')).toBe(true);
            expect(document.getElementById(id + '-svg-0-region-series-0' + '-point-' + 3).getAttribute('class') === (id + '_ej2_deselected')).toBe(true);
            done();
        };
        chartObj.loaded = loaded;
        chartObj.highlightMode = 'Point';
        chartObj.highlightPattern = 'Circle';
        chartObj.refresh();
    });
    it('Point color mapping chart  point highlighted in Cluster Mode', function (done) {
        loaded = function () {
            element1 = document.getElementById(id + '-svg-0-region-series-0' + '-point-' + 0);
            trigger.clickEvent(element1);
            expect(document.getElementById(id + '-svg-0-region-series-0' + '-point-' + 0).getAttribute('class') === (id + '_ej2_chart_selection_series_0')).toBe(true);
            expect(document.getElementById(id + '-svg-0-region-series-1' + '-point-' + 0).getAttribute('class') === (id + '_ej2_chart_selection_series_1')).toBe(true);
            done();
        };
        chartObj.loaded = loaded;
        chartObj.selectionMode = 'Cluster';
        chartObj.selectionPattern = 'Star';
        chartObj.refresh();
    });
    it('Point color mapping chart  point selection in Cluster mode', function (done) {
        loaded = function () {
            element1 = document.getElementById(id + '-svg-0-region-series-0' + '-point-' + 0);
            trigger.mousemovetEvent(element1, 0, 0);
            expect(document.getElementById(id + '-svg-0-region-series-0' + '-point-' + 0).getAttribute('class') === (id + '_ej2_chart_highlight_series_0')).toBe(true);
            expect(document.getElementById(id + '-svg-0-region-series-1' + '-point-' + 0).getAttribute('class') === (id + '_ej2_chart_highlight_series_1')).toBe(true);
            done();
        };
        chartObj.loaded = loaded;
        chartObj.highlightMode = 'Cluster';
        chartObj.highlightPattern = 'Star';
        chartObj.refresh();
    });
    it('Point color mapping chart legend higlighted', function (done) {
        loaded = function () {
            chartObj.loaded = null;
            element1 = document.getElementById(id + '_chart' + '_legend_shape_1');
            trigger.mousemovetEvent(element1, 0, 0);
            expect(document.getElementById(id + '_chart' + '_legend_shape_1').getAttribute('class') == (id + '_ej2_chart_highlight_series_1')).toBe(true);
            expect(document.getElementById(id + '-svg-0-region-series-0' + '-point-' + 0).getAttribute('class') == (id + '_ej2_deselected')).toBe(true);
            expect(document.getElementById(id + '_chart' + '_legend_shape_0').getAttribute('class') == (id + '_ej2_deselected')).toBe(true);
            done();
        };
        chartObj.loaded = loaded;
        chartObj.highlightMode = 'Point';
        chartObj.highlightPattern = 'Circle';
        chartObj.refresh();
    });
    it('Point color mapping chart legend', function (done) {
        loaded = function () {
            chartObj.loaded = null;
            element1 = document.getElementById(id + '_chart_legend_g_0');
            trigger.clickEvent(element1);
            element1 = document.getElementById(id + '-svg-0-region-series-1' + '-point-' + 0);
            trigger.mousedownEvent(element1, 1, 1, 2, 2);
            done();
        };
        chartObj.loaded = loaded;
        chartObj.legendSettings = { visible: true, enablePages: false, titlePosition: 'Right', position: 'Right', shapePadding: 100, reverse: true }
        chartObj.refresh();
    });
    it('selection with legend', function (done) {
        loaded = function () {
            chartObj.loaded = null;
            element1 = document.getElementById(id + '-svg-0-region-series-1' + '-point-' + 0);
            trigger.clickEvent(element1);
            expect(document.getElementById(id + '-svg-0-region-series-1' + '-point-' + 0).getAttribute('class') === (id + '_ej2_chart_selection_series_1')).toBe(true);
            element1 = document.getElementById(id + '_chart_legend_g_1');
            trigger.mousemovetEvent(element1, 10, 10);
            done();
        };
        chartObj.loaded = loaded;
        chartObj.legendSettings = { visible: true, enableHighlight: true };
        chartObj.selectionMode = 'Series';
        chartObj.highlightMode = 'Series';
        chartObj.refresh();
    });
    it('selection with highlightColor', function (done) {
        loaded = function () {
            chartObj.loaded = null;
            element1 = document.getElementById(id + '_chart_legend_g_1');
            trigger.mousemovetEvent(element1, 11, 11);
            done();
        };
        chartObj.loaded = loaded;
        chartObj.legendSettings = { visible: true, enableHighlight: true }
        chartObj.highlightPattern = 'None'
        chartObj.highlightColor = 'Red'
        chartObj.refresh();
    });
    it('selection with mouse leave event', function (done) {
        loaded = function (args: Chart3DLoadedEventArgs) {
            chartObj.loaded = null;
            args.chart.selection3DModule.completeSelection();
            args.chart.selection3DModule.selectedDataIndexes = [];
            args.chart.selection3DModule.removeLegendHighlightStyles();
            let element: HTMLElement = document.getElementById(id);
            expect(element !== null).toBe(true);
            done();
        };
        chartObj.loaded = loaded;
        chartObj.selectionMode = 'None';
        chartObj.refresh();
    });
    it('selection checking index finder', function (done) {
        loaded = function (args: Chart3DLoadedEventArgs) {
            chartObj.loaded = null;
            args.chart.selection3DModule.indexFinder('-border-');
            args.chart.selection3DModule.indexFinder('-series-');
            args.chart.selection3DModule.indexFinder('_legend_shape_');
            args.chart.selection3DModule.highlightDataIndexes = [{ series: 0, point: 0 }] as any;
            args.chart.selection3DModule.styleId = 'PointColorMapping_ej2_chart_highlight';
            args.chart.selection3DModule.redrawSelection(args.chart, null, null);
            let element: HTMLElement = document.getElementById(id);
            args.chart.selectionMode = 'None';
            args.chart.selection3DModule.isAlreadySelected(element, 'click', [{ series: 0, point: 0 }] as any);
            expect(element !== null).toBe(true);
            done();
        };
        chartObj.loaded = loaded;
        chartObj.selectionMode = 'Point';
        chartObj.highlightMode = 'Point';
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
