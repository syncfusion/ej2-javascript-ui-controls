/**
 * Selection feature unit testing spec file
 */
import { createElement } from '@syncfusion/ej2-base';
import { Chart } from '../../../src/chart/chart';
import { Highlight } from '../../../src/chart/user-interaction/high-light';
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
import '../../../node_modules/es6-promise/dist/es6-promise';
import { EmitType } from '@syncfusion/ej2-base';
import { profile, inMB, getMemoryProfile } from '../../common.spec';
import { ILoadedEventArgs } from '../../../src/chart/model/chart-interface';
Chart.Inject(
    LineSeries, DataEditing, StepLineSeries, ColumnSeries, AreaSeries, StackingAreaSeries, Highlight,
    StackingColumnSeries, Legend
);
let seriesCollection: SeriesModel[] = [];
let colors: string[] = ['#663AB6', '#EB3F79', '#F8AB1D', '#B82E3D', '#049CB1', '#F2424F', '#C2C924', '#3DA046', '#074D67', '#02A8F4'];
seriesCollection = [
    {
        name: 'First',
        width: 5,
        animation: { enable: false },
        selectionStyle: null,
        fill: colors[0],
        dataSource: firstSeries, xName: 'x', yName: 'y',
        type: 'Column'
    },
    {
        name: 'Second',
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
        width: 5,
        animation: { enable: false },
        selectionStyle: null,
        fill: colors[8],
        dataSource: thirdSeries, xName: 'x', yName: 'y',
        type: 'Column'
    }
];
describe('Chart Control Highlight ', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
    let id: string = 'ej2Container';
    let selection: string = id + '_ej2_chart_highlight_series_';
    let chartObj: Chart;
    let element: HTMLElement;
    let selected: HTMLCollection;
    let i: number = 0;
    let j: number = 0;
    let loaded: EmitType<ILoadedEventArgs>;
    let trigger: MouseEvents = new MouseEvents();
    let chartContainer: HTMLElement;
    beforeAll(() => {
        chartContainer = createElement('div', { id: id });
        document.body.appendChild(chartContainer);
        chartObj = new Chart({
            series: seriesCollection,
            primaryXAxis: { minimum: 2004, maximum: 2012 },
            primaryYAxis: { rangePadding: 'None' },
            height: '500',
            width: '800',
            loaded: loaded,
            highlightMode: 'Point',
            isMultiSelect: false,
            legendSettings: { visible: true, toggleVisibility: false },
        });
        chartObj.appendTo('#' + id);

    });
    afterAll(() => {
        chartObj.destroy();
        chartContainer.remove();
    });
    it('Highlight Mode Point', (done: Function) => {
        loaded = () => {
            element = document.getElementById(id + '_Series_0' + '_Point_3');
            trigger.mousemovetEvent(element, 0, 0);
            expect(document.getElementsByClassName(selection + '0').length).toBe(2);
            element = document.getElementById(id + '_Series_0' + '_Point_5');
            trigger.mousemovetEvent(element, 0, 0);
            expect(document.getElementsByClassName(selection + '0').length).toBe(2);
            done();
        };
        chartObj.loaded = loaded;
        chartObj.refresh();
    });
    it('Highlight Mode Cluster', (done: Function) => {
        loaded = () => {
            element = document.getElementById(id + '_Series_0' + '_Point_5');
            trigger.mousemovetEvent(element, 0, 0);
            element = document.getElementById(id + '_Series_1' + '_Point_2');
            trigger.mousemovetEvent(element, 0, 0);
            for (let i: number = 0; i < seriesCollection.length; i++) {
                expect(document.getElementsByClassName(selection + i).length).toBe(2);
            }
            done();
        };
        chartObj.highlightMode = 'Cluster';
        chartObj.loaded = loaded;
        chartObj.highlightModule.selectedDataIndexes = [];
        chartObj.refresh();
    });
    it('Selection Mode Series', (done: Function) => {
        loaded = () => {
            element = document.getElementById(id + '_Series_0' + '_Point_3');
            trigger.mousemovetEvent(element, 0, 0);
            element = document.getElementById(id + '_Series_1' + '_Point_3');
            trigger.mousemovetEvent(element, 0, 0);
            selected = document.getElementsByClassName(selection + '1');
            expect(selected.length).toBe(2);
            expect(selected[0].childNodes.length).toBe(8);
            done();
        };
        chartObj.highlightMode = 'Series';
        chartObj.loaded = loaded;
        chartObj.highlightModule.selectedDataIndexes = [];
        chartObj.refresh();
    });

    // it('Selected DataBind cluster', (done: Function) => {
    //     chartObj.highlightMode = 'Cluster';
    //     chartObj.dataBind();
    //     for (i = 0; i < chartObj.series.length; i++) {
    //         expect(document.getElementsByClassName(selection + i).length).toBe(2);
    //     }
    //     done();
    // });
    it('Selected DataBind cluster to series', (done: Function) => {
        chartObj.highlightMode = 'Series';
        chartObj.dataBind();
        selected = document.getElementsByClassName(selection + 1);
        expect(selected.length).toBe(2);
        expect(selected[1].id.indexOf('legend') > 1).toBe(true);
        done();
    });
    // it('Selected DataBind series to point', (done: Function) => {
    //     element = document.getElementById(id + '_Series_1_Point_' + 3);
    //     trigger.mousemovetEvent(element, 0, 0);
    //     chartObj.highlightMode = 'Point';
    //     chartObj.dataBind();
    //     expect(document.getElementsByClassName(selection + '0').length).toBe(0);
    //     expect(document.getElementsByClassName(selection + '1').length).toBe(2);
    //     expect(document.getElementsByClassName(selection + '2').length).toBe(0);
    //     done();
    // });
    // it('Selected DataBind point to series', (done: Function) => {
    //     element = document.getElementById(id + '_Series_0_Point_' + 2);
    //     trigger.mousemovetEvent(element, 0, 0);
    //     chartObj.highlightMode = 'Series';
    //     chartObj.dataBind();
    //     expect(document.getElementsByClassName(selection + '0').length).toBe(2);
    //     expect(document.getElementsByClassName(selection + '1').length).toBe(0);
    //     expect(document.getElementsByClassName(selection + '2').length).toBe(0);
    //     done();
    // });
    // it('Selected DataBind series to cluster', (done: Function) => {
    //     element = document.getElementById(id + '_Series_0_Point_' + 4);
    //     trigger.mousemovetEvent(element, 0, 0);
    //     chartObj.highlightMode = 'Cluster';
    //     chartObj.dataBind();
    //     for (i = 0; i < chartObj.series.length; i++) {
    //         expect(document.getElementsByClassName(selection + i).length).toBe(2);
    //     }
    //     done();
    // });
    // it('Selected DataBind cluster to point', (done: Function) => {
    //     chartObj.highlightMode = 'Point';
    //     chartObj.dataBind();
    //     expect(document.getElementsByClassName(selection + 0).length).toBe(2);
    //     expect(document.getElementsByClassName(selection + 1).length).toBe(0);
    //     expect(document.getElementsByClassName(selection + 2).length).toBe(0);
    //     element = document.getElementById(id + '_Series_1_Point_' + 4);
    //     trigger.mousemovetEvent(element, 0, 0);
    //     expect(document.getElementsByClassName(selection + 0).length).toBe(0);
    //     expect(document.getElementsByClassName(selection + 1).length).toBe(2);
    //     expect(document.getElementsByClassName(selection + 2).length).toBe(0);
    //     done();
    // });
    it('Selected DataBind point multi select false', (done: Function) => {
        chartObj.isMultiSelect = false;
        chartObj.dataBind();
        expect(document.getElementsByClassName(selection + 0).length).toBe(0);
        expect(document.getElementsByClassName(selection + 1).length).toBe(2);
        expect(document.getElementsByClassName(selection + 2).length).toBe(0);
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
        chartObj.highlightModule.selectedDataIndexes = [];
        chartObj.refresh();
    });


    it('Patterns with Dots', (done: Function) => {
        loaded = () => {
            expect(document.getElementsByTagName('svg')[0].querySelectorAll('pattern').length).toBe(3);
            expect(document.getElementsByTagName('svg')[0].querySelectorAll('pattern')[0].id === 'Dots_Selection_0').toBe(true);
            element = document.getElementById(id + '_Series_1_Point_' + 4);
            trigger.mousemovetEvent(element, 0, 0);
            expect(document.getElementsByClassName(selection + 1).length).toBe(2);
            done();
        };
        chartObj.loaded = loaded;
        chartObj.highlightPattern = 'Dots';
        chartObj.highlightMode = 'Point';
        chartObj.refresh();
    });

    it('Patterns with DiagonalForward', (done: Function) => {
        loaded = () => {
            expect(document.getElementsByTagName('svg')[0].querySelectorAll('pattern').length).toBe(3);
            expect(document.getElementsByTagName('svg')[0].querySelectorAll('pattern')[0].id === 'DiagonalForward_Selection_0').toBe(true);
            element = document.getElementById(id + '_Series_0_Point_' + 4);
            trigger.mousemovetEvent(element, 0, 0);
            expect(document.getElementsByClassName(selection + 0).length).toBe(2);
            done();
        };
        chartObj.loaded = loaded;
        chartObj.highlightPattern = 'DiagonalForward';
        chartObj.refresh();
    });
    it('Patterns with Crosshatch', (done: Function) => {
        loaded = () => {
            expect(document.getElementsByTagName('svg')[0].querySelectorAll('pattern').length).toBe(3);
            expect(document.getElementsByTagName('svg')[0].querySelectorAll('pattern')[0].id === 'Crosshatch_Selection_0').toBe(true);
            element = document.getElementById(id + '_Series_2_Point_' + 4);
            trigger.mousemovetEvent(element, 0, 0);
            expect(document.getElementsByClassName(selection + 2).length).toBe(2);
            done();
        };
        chartObj.loaded = loaded;
        chartObj.highlightPattern = 'Crosshatch';
        chartObj.refresh();
    });
    it('Patterns with Pacman', (done: Function) => {
        loaded = () => {
            expect(document.getElementsByTagName('svg')[0].querySelectorAll('pattern').length).toBe(3);
            expect(document.getElementsByTagName('svg')[0].querySelectorAll('pattern')[0].id === 'Pacman_Selection_0').toBe(true);
            element = document.getElementById(id + '_Series_0_Point_' + 0);
            trigger.mousemovetEvent(element, 0, 0);
            expect(document.getElementsByClassName(selection + 0).length).toBe(2);
            done();
        };
        chartObj.loaded = loaded;
        chartObj.highlightPattern = 'Pacman';
        chartObj.refresh();
    });
    it('Patterns with DiagonalBackward', (done: Function) => {
        loaded = () => {
            expect(document.getElementsByTagName('svg')[0].querySelectorAll('pattern').length).toBe(3);
            expect(document.getElementsByTagName('svg')[0].querySelectorAll('pattern')[0].id === 'DiagonalBackward_Selection_0').toBe(true);
            element = document.getElementById(id + '_Series_0_Point_' + 6);
            trigger.mousemovetEvent(element, 0, 0);
            expect(document.getElementsByClassName(selection + 0).length).toBe(2);
            done();
        };
        chartObj.loaded = loaded;
        chartObj.highlightPattern = 'DiagonalBackward';
        chartObj.refresh();
    });
    it('Patterns with Grid', (done: Function) => {
        loaded = () => {
            expect(document.getElementsByTagName('svg')[0].querySelectorAll('pattern').length).toBe(3);
            expect(document.getElementsByTagName('svg')[0].querySelectorAll('pattern')[0].id === 'Grid_Selection_0').toBe(true);
            element = document.getElementById(id + '_Series_0_Point_' + 5);
            trigger.mousemovetEvent(element, 0, 0);
            expect(document.getElementsByClassName(selection + 0).length).toBe(2);
            done();
        };
        chartObj.loaded = loaded;
        chartObj.highlightPattern = 'Grid';
        chartObj.refresh();
    });
    it('Patterns with Turquoise', (done: Function) => {
        loaded = () => {
            expect(document.getElementsByTagName('svg')[0].querySelectorAll('pattern').length).toBe(3);
            expect(document.getElementsByTagName('svg')[0].querySelectorAll('pattern')[1].id === 'Turquoise_Selection_1').toBe(true);
            element = document.getElementById(id + '_Series_0_Point_' + 1);
            trigger.mousemovetEvent(element, 0, 0);
            expect(document.getElementsByClassName(selection + 0).length).toBe(2);
            done();
        };
        chartObj.loaded = loaded;
        chartObj.highlightPattern = 'Turquoise';
        chartObj.highlightMode = 'Series';
        chartObj.refresh();
    });
    it('Patterns with Star', (done: Function) => {
        loaded = () => {
            expect(document.getElementsByTagName('svg')[0].querySelectorAll('pattern').length).toBe(3);
            expect(document.getElementsByTagName('svg')[0].querySelectorAll('pattern')[0].id === 'Star_Selection_0').toBe(true);
            element = document.getElementById(id + '_Series_0_Point_' + 1);
            trigger.mousemovetEvent(element, 0, 0);
            for (i = 0; i < chartObj.series.length; i++) {
                expect(document.getElementsByClassName(selection + i).length).toBe(2);
            }
            done();
        };
        chartObj.loaded = loaded;
        chartObj.highlightPattern = 'Star';
        chartObj.highlightMode = 'Cluster';
        chartObj.refresh();
    });
    it('Patterns with Triangle', (done: Function) => {
        loaded = () => {
            expect(document.getElementsByTagName('svg')[0].querySelectorAll('pattern').length).toBe(3);
            expect(document.getElementsByTagName('svg')[0].querySelectorAll('pattern')[2].id === 'Triangle_Selection_2').toBe(true);
            element = document.getElementById(id + '_Series_0_Point_' + 1);
            trigger.mousemovetEvent(element, 0, 0);
            expect(document.getElementsByClassName(selection + 0).length).toBe(2);
            done();
        };
        chartObj.loaded = loaded;
        chartObj.highlightPattern = 'Triangle';
        chartObj.highlightMode = 'Point';
        chartObj.refresh();
    });
    it('Patterns with Chessboard', (done: Function) => {
        loaded = () => {
            element = document.getElementById(id + '_Series_2_Point_' + 5);
            trigger.mousemovetEvent(element, 0, 0);
            expect(document.getElementsByClassName(selection + 2).length).toBe(2);
            expect(document.getElementsByTagName('svg')[0].querySelectorAll('pattern').length).toBe(3);
            expect(document.getElementsByTagName('svg')[0].querySelectorAll('pattern')[2].id === 'Chessboard_Selection_2').toBe(true);
            done();
        };
        chartObj.loaded = loaded;
        chartObj.highlightPattern = 'Chessboard';
        chartObj.refresh();
    });
    it('Patterns with Circle', (done: Function) => {
        loaded = () => {
        element = document.getElementById(id + '_Series_0_Point_' + 2);
        trigger.mousemovetEvent(element, 0, 0);
        expect(document.getElementsByClassName(selection + '0').length).toBe(2);
        expect(document.getElementsByClassName(selection + '1').length).toBe(0);
        expect(document.getElementsByClassName(selection + '2').length).toBe(0);
        expect(document.getElementsByTagName('svg')[0].querySelectorAll('pattern').length).toBe(3);
        expect(document.getElementsByTagName('svg')[0].querySelectorAll('pattern')[0].id === 'Circle_Selection_0').toBe(true);
        done();
        };
        chartObj.loaded = loaded;
        chartObj.highlightMode = 'Series';
        chartObj.highlightPattern = 'Circle';
        chartObj.refresh();
    });

    it('Patterns with Tile', (done: Function) => {
        loaded = () => {
            element = document.getElementById(id + '_Series_2_Point_' + 3);
            trigger.mousemovetEvent(element, 0, 0);
            expect(document.getElementsByClassName(selection + 2).length).toBe(2);
            expect(document.getElementsByTagName('svg')[0].querySelectorAll('pattern').length).toBe(3);
            expect(document.getElementsByTagName('svg')[0].querySelectorAll('pattern')[0].id === 'Tile_Selection_0').toBe(true);
            done();
        };
        chartObj.loaded = loaded;
        chartObj.highlightPattern = 'Tile';
        chartObj.refresh();
    });
    it('Patterns with HorizontalDash', (done: Function) => {
        loaded = () => {
            element = document.getElementById(id + '_Series_2_Point_' + 5);
            trigger.mousemovetEvent(element, 0, 0);
            expect(document.getElementsByClassName(selection + 2).length).toBe(2);
            expect(document.getElementsByTagName('svg')[0].querySelectorAll('pattern').length).toBe(3);
            expect(document.getElementsByTagName('svg')[0].querySelectorAll('pattern')[0].id === 'HorizontalDash_Selection_0').toBe(true);
            done();
        };
        chartObj.loaded = loaded;
        chartObj.highlightPattern = 'HorizontalDash';
        chartObj.refresh();
    });
    it('Patterns with VerticalDash', (done: Function) => {
        loaded = () => {
            element = document.getElementById(id + '_Series_2_Point_' + 2);
            trigger.mousemovetEvent(element, 0, 0);
            expect(document.getElementsByClassName(selection + 2).length).toBe(2);
            expect(document.getElementsByTagName('svg')[0].querySelectorAll('pattern').length).toBe(3);
            expect(document.getElementsByTagName('svg')[0].querySelectorAll('pattern')[0].id === 'VerticalDash_Selection_0').toBe(true);
            done();
        };
        chartObj.loaded = loaded;
        chartObj.highlightPattern = 'VerticalDash';
        chartObj.highlightMode = 'Point';
        chartObj.refresh();
    });
    it('Patterns with Rectangle', (done: Function) => {
        loaded = () => {
            element = document.getElementById(id + '_Series_2_Point_' + 3);
            trigger.mousemovetEvent(element, 0, 0);
            expect(document.getElementsByClassName(selection + 2).length).toBe(2);
            expect(document.getElementsByTagName('svg')[0].querySelectorAll('pattern').length).toBe(3);
            expect(document.getElementsByTagName('svg')[0].querySelectorAll('pattern')[0].id === 'Rectangle_Selection_0').toBe(true);
            done();
        };
        chartObj.loaded = loaded;
        chartObj.highlightPattern = 'Rectangle';
        chartObj.isMultiSelect = false;
        chartObj.refresh();
    });
    it('Patterns with Box', (done: Function) => {
        loaded = () => {
            element = document.getElementById(id + '_Series_2_Point_' + 0);
            trigger.mousemovetEvent(element, 0, 0);
            expect(document.getElementsByClassName(selection + 2).length).toBe(2);
            expect(document.getElementsByTagName('svg')[0].querySelectorAll('pattern').length).toBe(3);
            expect(document.getElementsByTagName('svg')[0].querySelectorAll('pattern')[0].id === 'Box_Selection_0').toBe(true);
            done();
        };
        chartObj.loaded = loaded;
        chartObj.highlightPattern = 'Box';
        chartObj.refresh();
    });
    it('Patterns with VerticalStripe', (done: Function) => {
        loaded = () => {
            element = document.getElementById(id + '_Series_0_Point_' + 5 + '_Symbol');
            let chartArea: Element = document.getElementById(id + '_ChartAreaBorder');
            let y: number = parseFloat(element.getAttribute('cy')) + parseFloat(chartArea.getAttribute('y')) + chartContainer.offsetTop;
            let x: number = parseFloat(element.getAttribute('cx')) + parseFloat(chartArea.getAttribute('x')) + chartContainer.offsetLeft;
            trigger.mousemovetEvent(element, Math.ceil(x), Math.ceil(y));
            expect(document.getElementsByClassName(selection + 0).length).toBe(3);
            expect(document.getElementsByTagName('svg')[0].querySelectorAll('pattern').length).toBe(3);
            expect(document.getElementsByTagName('svg')[0].querySelectorAll('pattern')[0].id === 'VerticalStripe_Selection_0').toBe(true);
            done();
        };
        chartObj.loaded = loaded;
        chartObj.highlightPattern = 'VerticalStripe';
        chartObj.highlightMode = 'Series';
        for (let series of chartObj.series) {
            series.type = 'Line';
            series.marker.visible = true;
            series.marker.height = 20;
            series.marker.width = 20;
        }
        chartObj.refresh();
    });
    it('Patterns with HorizontalStripe', (done: Function) => {
        loaded = () => {
            element = document.getElementById(id + '_Series_1_Point_' + 4 + '_Symbol');
            trigger.mousemovetEvent(element, 0, 0);
            expect(document.getElementsByClassName(selection + 1).length).toBe(3);
            expect(document.getElementsByTagName('svg')[0].querySelectorAll('pattern').length).toBe(3);
            expect(document.getElementsByTagName('svg')[0].querySelectorAll('pattern')[0].id === 'HorizontalStripe_Selection_0').toBe(true);
            done();
        };
        chartObj.loaded = loaded;
        for (let series of chartObj.series) {
            series.type = 'Area';
        }
        chartObj.selectionPattern = 'None';
        chartObj.selectionMode = 'None';
        chartObj.highlightMode = 'Series';
        chartObj.highlightPattern = 'HorizontalStripe';
        chartObj.refresh();
    });
    it('Patterns with Bubble',  (done: Function) => {
        loaded = () => {
            element = document.getElementById(id + '_Series_1_Point_' + 5 + '_Symbol');
            let chartArea: Element = document.getElementById(id + '_ChartAreaBorder');
            let y: number = parseFloat(element.getAttribute('cy')) + parseFloat(chartArea.getAttribute('y')) + chartContainer.offsetTop;
            let x: number = parseFloat(element.getAttribute('cx')) + parseFloat(chartArea.getAttribute('x')) + chartContainer.offsetLeft;
            trigger.clickEvent(element);
            trigger.mousemovetEvent(element, Math.ceil(x), Math.ceil(y));
            expect(document.getElementsByClassName(selection + 1).length).toBe(4);
            expect(document.getElementsByTagName('svg')[0].querySelectorAll('pattern').length).toBe(3);
            expect(document.getElementsByTagName('svg')[0].querySelectorAll('pattern')[0].id === 'Bubble_Selection_0').toBe(true);
            done();
        };
        chartObj.loaded = loaded;
        chartObj.highlightMode = 'Point';
        chartObj.highlightPattern = 'Bubble';
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
