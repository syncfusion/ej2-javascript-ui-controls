import { createElement, EmitType } from '@syncfusion/ej2-base';
import { Chart3DLoadedEventArgs } from '../../../src/chart3d/model/chart3d-Interface';
import { ColumnSeries3D } from '../../../src/chart3d/series/column-series';
import { BarSeries3D } from '../../../src/chart3d/series/bar-series';
import { Highlight3D } from '../../../src/chart3d/user-interaction/high-light';
import { Chart3D } from '../../../src/chart3d/chart3D';
import { Legend3D } from '../../../src/chart3d/legend/legend';
import { getMemoryProfile, inMB, profile } from '../../common.spec';
import { MouseEvents } from '../base/events.spec';
import { firstSeries, secondSeries, thirdSeries } from '../../chart/base/data.spec';
import { Chart3DSeriesModel } from '../../../src/chart3d/series/chart-series-model';

Chart3D.Inject(
    ColumnSeries3D, BarSeries3D, Highlight3D, Legend3D
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

describe('3DChart Control Highlight ', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log('Unsupported environment, window.performance.memory is unavailable');
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
    const id: string = 'ej2Container';
    const selection: string = id + '_ej2_chart_highlight_series_';
    let chartObj: Chart3D;
    let element: HTMLElement;
    let selected: HTMLCollection;
    let i: number = 0;
    const j: number = 0;
    let loaded: EmitType<Chart3DLoadedEventArgs>;
    const trigger: MouseEvents = new MouseEvents();
    let chartContainer: HTMLElement;
    beforeAll(() => {
        chartContainer = createElement('div', { id: id });
        document.body.appendChild(chartContainer);
        chartObj = new Chart3D({
            series: seriesCollection,
            primaryXAxis: { minimum: 2004, maximum: 2012 },
            primaryYAxis: { rangePadding: 'None' },
            height: '500',
            width: '800',
            loaded: loaded,
            highlightMode: 'Point',
            isMultiSelect: false,
            legendSettings: { visible: true },
            enableSideBySidePlacement: true
        });
        chartObj.appendTo('#' + id);

    });
    afterAll(() => {
        chartObj.destroy();
        chartContainer.remove();
    });
    it('Highlight Mode Point', (done: Function) => {
        loaded = () => {
            element = document.getElementById(id + '-svg-0-region-series-0' + '-point-3');
            trigger.mousemovetEvent(element, 0, 0);
            expect(document.getElementsByClassName(selection + '0').length).toBe(7);
            element = document.getElementById(id + '-svg-0-region-series-0' + '-point-5');
            trigger.mousemovetEvent(element, 0, 0);
            expect(document.getElementsByClassName(selection + '0').length).toBe(7);
            done();
        };
        chartObj.loaded = loaded;
        chartObj.highlightColor = 'Red';
        chartObj.refresh();
    });
    it('Highlight Mode Cluster', (done: Function) => {
        loaded = () => {
            element = document.getElementById(id + '-svg-0-region-series-0' + '-point-5');
            trigger.mousemovetEvent(element, 0, 0);
            element = document.getElementById(id + '-svg-0-region-series-1' + '-point-2');
            trigger.mousemovetEvent(element, 0, 0);
            for (let i: number = 0; i < seriesCollection.length; i++) {
                expect(document.getElementsByClassName(selection + i).length).toBe(7);
            }
            done();
        };
        chartObj.highlightColor = '';
        chartObj.highlightMode = 'Cluster';
        chartObj.loaded = loaded;
        chartObj.highlight3DModule.selectedDataIndexes = [];
        chartObj.refresh();
    });
    it('Selection Mode Series', (done: Function) => {
        loaded = () => {
            element = document.getElementById(id + '-svg-0-region-series-0' + '-point-3');
            trigger.mousemovetEvent(element, 0, 0);
            element = document.getElementById(id + '-svg-0-region-series-1' + '-point-3');
            trigger.mousemovetEvent(element, 0, 0);
            selected = document.getElementsByClassName(selection + '1');
            expect(selected.length).toBe(43);
            done();
        };
        chartObj.highlightMode = 'Series';
        chartObj.loaded = loaded;
        chartObj.highlight3DModule.selectedDataIndexes = [];
        chartObj.refresh();
    });

    it('Selected DataBind cluster to series', (done: Function) => {
        chartObj.highlightMode = 'Series';
        chartObj.dataBind();
        selected = document.getElementsByClassName(selection + 1);
        expect(selected.length).toBe(43);
        done();
    });

    it('Selected DataBind point multi select false', (done: Function) => {
        chartObj.isMultiSelect = false;
        chartObj.dataBind();
        expect(document.getElementsByClassName(selection + 0).length).toBe(0);
        expect(document.getElementsByClassName(selection + 1).length).toBe(43);
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
        chartObj.highlight3DModule.selectedDataIndexes = [];
        chartObj.refresh();
    });


    it('Patterns with Dots', (done: Function) => {
        loaded = () => {
            expect(document.getElementById(id + '_svg').querySelectorAll('pattern').length).toBe(3);
            expect(document.getElementById(id + '_svg').querySelectorAll('pattern')[0].id === 'ej2Container_Dots_Selection_0').toBe(true);
            element = document.getElementById(id + '-svg-0-region-series-1-point-' + 4);
            trigger.mousemovetEvent(element, 0, 0);
            expect(document.getElementsByClassName(selection + 1).length).toBe(7);
            done();
        };
        chartObj.loaded = loaded;
        chartObj.highlightPattern = 'Dots';
        chartObj.highlightMode = 'Point';
        chartObj.refresh();
    });

    it('Patterns with DiagonalForward', (done: Function) => {
        loaded = () => {
            expect(document.getElementById(id + '_svg').querySelectorAll('pattern').length).toBe(3);
            expect(document.getElementById(id + '_svg').querySelectorAll('pattern')[0].id === 'ej2Container_DiagonalForward_Selection_0').toBe(true);
            element = document.getElementById(id + '-svg-0-region-series-0-point-' + 4);
            trigger.mousemovetEvent(element, 0, 0);
            expect(document.getElementsByClassName(selection + 0).length).toBe(7);
            done();
        };
        chartObj.loaded = loaded;
        chartObj.highlightPattern = 'DiagonalForward';
        chartObj.refresh();
    });
    it('Patterns with Crosshatch', (done: Function) => {
        loaded = () => {
            expect(document.getElementById(id + '_svg').querySelectorAll('pattern').length).toBe(3);
            expect(document.getElementById(id + '_svg').querySelectorAll('pattern')[0].id === 'ej2Container_Crosshatch_Selection_0').toBe(true);
            element = document.getElementById(id + '-svg-0-region-series-2-point-' + 4);
            trigger.mousemovetEvent(element, 0, 0);
            expect(document.getElementsByClassName(selection + 2).length).toBe(7);
            done();
        };
        chartObj.loaded = loaded;
        chartObj.highlightPattern = 'Crosshatch';
        chartObj.refresh();
    });
    it('Patterns with Pacman', (done: Function) => {
        loaded = () => {
            expect(document.getElementById(id + '_svg').querySelectorAll('pattern').length).toBe(3);
            expect(document.getElementById(id + '_svg').querySelectorAll('pattern')[0].id === 'ej2Container_Pacman_Selection_0').toBe(true);
            element = document.getElementById(id + '-svg-0-region-series-0-point-' + 0);
            trigger.mousemovetEvent(element, 0, 0);
            expect(document.getElementsByClassName(selection + 0).length).toBe(7);
            done();
        };
        chartObj.loaded = loaded;
        chartObj.highlightPattern = 'Pacman';
        chartObj.refresh();
    });
    it('Patterns with DiagonalBackward', (done: Function) => {
        loaded = () => {
            expect(document.getElementById(id + '_svg').querySelectorAll('pattern').length).toBe(3);
            expect(document.getElementById(id + '_svg').querySelectorAll('pattern')[0].id === 'ej2Container_DiagonalBackward_Selection_0').toBe(true);
            element = document.getElementById(id + '-svg-0-region-series-0-point-' + 6);
            trigger.mousemovetEvent(element, 0, 0);
            expect(document.getElementsByClassName(selection + 0).length).toBe(7);
            done();
        };
        chartObj.loaded = loaded;
        chartObj.highlightPattern = 'DiagonalBackward';
        chartObj.refresh();
    });
    it('Patterns with Grid', (done: Function) => {
        loaded = () => {
            expect(document.getElementById(id + '_svg').querySelectorAll('pattern').length).toBe(3);
            expect(document.getElementById(id + '_svg').querySelectorAll('pattern')[0].id === 'ej2Container_Grid_Selection_0').toBe(true);
            element = document.getElementById(id + '-svg-0-region-series-0-point-' + 5);
            trigger.mousemovetEvent(element, 0, 0);
            expect(document.getElementsByClassName(selection + 0).length).toBe(7);
            done();
        };
        chartObj.loaded = loaded;
        chartObj.highlightPattern = 'Grid';
        chartObj.refresh();
    });
    it('Patterns with Turquoise', (done: Function) => {
        loaded = () => {
            expect(document.getElementById(id + '_svg').querySelectorAll('pattern').length).toBe(3);
            expect(document.getElementById(id + '_svg').querySelectorAll('pattern')[1].id === 'ej2Container_Turquoise_Selection_1').toBe(true);
            element = document.getElementById(id + '-svg-0-region-series-0-point-' + 1);
            trigger.mousemovetEvent(element, 0, 0);
            expect(document.getElementsByClassName(selection + 0).length).toBe(43);
            done();
        };
        chartObj.loaded = loaded;
        chartObj.highlightPattern = 'Turquoise';
        chartObj.highlightMode = 'Series';
        chartObj.refresh();
    });
    it('Patterns with Star', (done: Function) => {
        loaded = () => {
            expect(document.getElementById(id + '_svg').querySelectorAll('pattern').length).toBe(3);
            expect(document.getElementById(id + '_svg').querySelectorAll('pattern')[0].id === 'ej2Container_Star_Selection_0').toBe(true);
            element = document.getElementById(id + '-svg-0-region-series-0-point-' + 1);
            trigger.mousemovetEvent(element, 0, 0);
            for (i = 0; i < chartObj.series.length; i++) {
                expect(document.getElementsByClassName(selection + i).length).toBe(7);
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
            expect(document.getElementById(id + '_svg').querySelectorAll('pattern').length).toBe(3);
            expect(document.getElementById(id + '_svg').querySelectorAll('pattern')[2].id === 'ej2Container_Triangle_Selection_2').toBe(true);
            element = document.getElementById(id + '-svg-0-region-series-0-point-' + 1);
            trigger.mousemovetEvent(element, 0, 0);
            expect(document.getElementsByClassName(selection + 0).length).toBe(7);
            done();
        };
        chartObj.loaded = loaded;
        chartObj.highlightPattern = 'Triangle';
        chartObj.highlightMode = 'Point';
        chartObj.refresh();
    });
    it('Patterns with Chessboard', (done: Function) => {
        loaded = () => {
            element = document.getElementById(id + '-svg-0-region-series-2-point-' + 5);
            trigger.mousemovetEvent(element, 0, 0);
            expect(document.getElementsByClassName(selection + 2).length).toBe(7);
            expect(document.getElementById(id + '_svg').querySelectorAll('pattern').length).toBe(3);
            expect(document.getElementById(id + '_svg').querySelectorAll('pattern')[2].id === 'ej2Container_Chessboard_Selection_2').toBe(true);
            done();
        };
        chartObj.loaded = loaded;
        chartObj.highlightPattern = 'Chessboard';
        chartObj.refresh();
    });
    it('Patterns with Circle', (done: Function) => {
        loaded = () => {
            element = document.getElementById(id + '-svg-0-region-series-0-point-' + 2);
            trigger.mousemovetEvent(element, 0, 0);
            expect(document.getElementsByClassName(selection + '0').length).toBe(43);
            expect(document.getElementsByClassName(selection + '1').length).toBe(0);
            expect(document.getElementsByClassName(selection + '2').length).toBe(0);
            expect(document.getElementById(id + '_svg').querySelectorAll('pattern').length).toBe(3);
            expect(document.getElementById(id + '_svg').querySelectorAll('pattern')[0].id === 'ej2Container_Circle_Selection_0').toBe(true);
            done();
        };
        chartObj.loaded = loaded;
        chartObj.highlightMode = 'Series';
        chartObj.highlightPattern = 'Circle';
        chartObj.refresh();
    });

    it('Patterns with Tile', (done: Function) => {
        loaded = () => {
            element = document.getElementById(id + '-svg-0-region-series-2-point-' + 3);
            trigger.mousemovetEvent(element, 0, 0);
            expect(document.getElementsByClassName(selection + 2).length).toBe(43);
            expect(document.getElementById(id + '_svg').querySelectorAll('pattern').length).toBe(3);
            expect(document.getElementById(id + '_svg').querySelectorAll('pattern')[0].id === 'ej2Container_Tile_Selection_0').toBe(true);
            done();
        };
        chartObj.loaded = loaded;
        chartObj.highlightPattern = 'Tile';
        chartObj.refresh();
    });
    it('Patterns with HorizontalDash', (done: Function) => {
        loaded = () => {
            element = document.getElementById(id + '-svg-0-region-series-2-point-' + 5);
            trigger.mousemovetEvent(element, 0, 0);
            expect(document.getElementsByClassName(selection + 2).length).toBe(43);
            expect(document.getElementById(id + '_svg').querySelectorAll('pattern').length).toBe(3);
            expect(document.getElementById(id + '_svg').querySelectorAll('pattern')[0].id === 'ej2Container_HorizontalDash_Selection_0').toBe(true);
            done();
        };
        chartObj.loaded = loaded;
        chartObj.highlightPattern = 'HorizontalDash';
        chartObj.refresh();
    });
    it('Patterns with VerticalDash', (done: Function) => {
        loaded = () => {
            element = document.getElementById(id + '-svg-0-region-series-2-point-' + 2);
            trigger.mousemovetEvent(element, 0, 0);
            expect(document.getElementById(id + '_svg').querySelectorAll('pattern').length).toBe(3);
            expect(document.getElementById(id + '_svg').querySelectorAll('pattern').length).toBe(3);
            expect(document.getElementById(id + '_svg').querySelectorAll('pattern')[0].id === 'ej2Container_VerticalDash_Selection_0').toBe(true);
            done();
        };
        chartObj.loaded = loaded;
        chartObj.highlightPattern = 'VerticalDash';
        chartObj.highlightMode = 'Point';
        chartObj.refresh();
    });
    it('Patterns with Rectangle', (done: Function) => {
        loaded = () => {
            element = document.getElementById(id + '-svg-0-region-series-2-point-' + 3);
            trigger.mousemovetEvent(element, 0, 0);
            expect(document.getElementsByClassName(selection + 2).length).toBe(7);
            expect(document.getElementById(id + '_svg').querySelectorAll('pattern').length).toBe(3);
            expect(document.getElementById(id + '_svg').querySelectorAll('pattern')[0].id === 'ej2Container_Rectangle_Selection_0').toBe(true);
            done();
        };
        chartObj.loaded = loaded;
        chartObj.highlightPattern = 'Rectangle';
        chartObj.isMultiSelect = false;
        chartObj.refresh();
    });
    it('Patterns with Box', (done: Function) => {
        loaded = () => {
            element = document.getElementById(id + '-svg-0-region-series-2-point-' + 0);
            trigger.mousemovetEvent(element, 0, 0);
            expect(document.getElementsByClassName(selection + 2).length).toBe(7);
            expect(document.getElementById(id + '_svg').querySelectorAll('pattern').length).toBe(3);
            expect(document.getElementById(id + '_svg').querySelectorAll('pattern')[0].id === 'ej2Container_Box_Selection_0').toBe(true);
            done();
        };
        chartObj.loaded = loaded;
        chartObj.highlightPattern = 'Box';
        chartObj.refresh();
    });
    it('legend highlight', (done: Function) => {
        loaded = () => {
            chartObj.loaded = null;
            element = document.getElementById(id + '_chart_legend_g_0');
            trigger.mousemovetEvent(element, 10, 10);
            expect(document.getElementsByClassName(selection + 2).length).toBe(0);
            trigger.onPointerMove(element, 13, 13, 1);
            done();
        };
        chartObj.loaded = loaded;
        chartObj.series[0].legendShape = 'Image';
        chartObj.series[0].legendImageUrl = 'base/spec/img/img1.jpg';
        chartObj.series[1].name = '';
        chartObj.legendSettings = { visible: true, enableHighlight: true, titlePosition: 'Right', enablePages: false, title: 'Legend', maximumLabelWidth: 100 }
        chartObj.highlightColor = 'Red';
        chartObj.highlightPattern = 'None';
        chartObj.highlightMode = 'None';
        chartObj.refresh();
    });

    it('legend click', (done: Function) => {
        loaded = () => {
            chartObj.loaded = null;
            element = document.getElementById(id + '-svg-0-region-series-2-point-' + 0);
            trigger.clickEvent(element);
            expect(document.getElementsByClassName(selection + 2).length).toBe(0);
            element = document.getElementById(id + '_chart_legend_g_0');
            trigger.mousemovetEvent(element, 10, 10);
            trigger.mousemovetEvent(element, 5, 5);
            done();
        };
        chartObj.loaded = loaded;
        chartObj.selectionMode = 'Series';
        chartObj.legendSettings.enablePages = true;
        chartObj.highlightMode = 'Series';
        chartObj.refresh();
    });
    it('legend click with titlePosition top', (done: Function) => {
        loaded = () => {
            chartObj.loaded = null;
            element = document.getElementById(id + '-svg-0-region-series-0-point-' + 2);
            trigger.clickEvent(element);
            expect(document.getElementsByClassName(selection + 2).length).toBe(0);
            element = document.getElementById(id + '_chart_legend_g_0');
            trigger.clickEvent(element);
            done();
        };
        chartObj.loaded = loaded;
        chartObj.legendSettings = { visible: true, enableHighlight: true, titlePosition: 'Top', title: 'Legend', enablePages: false }
        chartObj.series[1].name = 'UK';
        chartObj.highlightMode = 'Series';
        chartObj.refresh();
    });

    it('legend click with text wrap', (done: Function) => {
        loaded = () => {
            chartObj.loaded = null;
            element = document.getElementById(id + '_chart_legend_g_0');
            trigger.clickEvent(element);
            expect(document.getElementsByClassName(selection + 2).length).toBe(0);
            done();
        };
        chartObj.loaded = loaded;
        chartObj.legendSettings.height = "30",
        chartObj.legendSettings.textWrap = 'Wrap'
        chartObj.series[0].name = 'with~123~UK'
        chartObj.series[1].name = 'with^123^Italy'
        chartObj.refresh();
    });
    it('mouse move without series and legend', (done: Function) => {
        loaded = () => {
            element = document.getElementById(id + '_chart_legend_text_0');
            trigger.mousemovetEvent(element, 0, 0);
            element = document.getElementById(id);
            trigger.mousemovetEvent(element, 0, 0);
            expect(document.getElementsByClassName(selection + 2).length).toBe(0);
            done();
        };
        chartObj.loaded = loaded;
        chartObj.legendSettings.visible = true;
        chartObj.legendSettings.enableHighlight = true;
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
