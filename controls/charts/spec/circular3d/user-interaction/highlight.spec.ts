/* eslint-disable @typescript-eslint/no-unused-vars */
import { createElement } from '@syncfusion/ej2-base';
import { CircularChart3D } from '../../../src/circularchart3d/circularchart3d';
import { CircularChart3DLoadedEventArgs } from '../../../src/circularchart3d/model/pie-interface';
import { MouseEvents } from '../../chart3d/base/events.spec';
import { removeElement } from '@syncfusion/ej2-svg-base';
import { PieSeries3D } from '../../../src/circularchart3d/renderer/series';
import { getMemoryProfile, inMB, profile } from '../../common.spec';
import { CircularChartLegend3D } from '../../../src/circularchart3d/legend/legend';
import { CircularChartDataLabel3D } from '../../../src/circularchart3d/renderer/dataLabel';
import { CircularChartSelection3D } from '../../../src/circularchart3d/user-interaction/selection';
import { CircularChartHighlight3D} from '../../../src/circularchart3d/user-interaction/high-light';
import { CircularChartTooltip3D } from '../../../src/circularchart3d/user-interaction/tooltip';

CircularChart3D.Inject(PieSeries3D, CircularChartLegend3D, CircularChartDataLabel3D, CircularChartSelection3D,
                       CircularChartHighlight3D, CircularChartTooltip3D);

const categoryData1: Object[] = [
    { x: 'USA', y: 70 }, { x: 'China', y: 60 },
    { x: 'Japan', y: 60 }, { x: 'Australia', y: 56 },
    { x: 'France', y: 45 }, { x: 'Germany', y: 30 },
    { x: 'Italy', y: 35 }, { x: 'Sweden', y: 25 },
    { x: 'India', y: 45 }, { x: 'Pakistan', y: 30 },
    { x: 'America', y: 35 }, { x: 'Afghanistan', y: 25 }];

describe('Circular3D Chart Control', () => {
    beforeAll(() => {
        // eslint-disable-next-line @typescript-eslint/tslint/config, @typescript-eslint/no-explicit-any
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            // eslint-disable-next-line no-console
            console.log('Unsupported environment, window.performance.memory is unavailable');
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
    describe('Highlight', () => {
        let ele: HTMLElement;
        const id: string = 'pie';
        let element: Element;
        const highlight: string = id + '_ej2_chart_highlight_series_';
        let circular3D: CircularChart3D;
        const trigger: MouseEvents = new MouseEvents();
        beforeAll((): void => {
            ele = createElement('div', { id: id });
            document.body.appendChild(ele);
            circular3D = new CircularChart3D({
                series: [
                    {
                        dataSource: categoryData1,
                        xName: 'x',
                        yName: 'y',
                        innerRadius: '30%',
                        animation: { enable: false },
                        dataLabel: {
                            visible: true, name: 'data', position: 'Inside',
                            border: { width: 1, color: 'violet' },
                            connectorStyle: { length: '10%' }
                        },
                        explode: false
                    }
                ], width: '600', height: '400', legendSettings: { visible: true }
            });
            circular3D.appendTo('#' + id);
        });

        afterAll((): void => {
            circular3D.circularChartHighlight3DModule.destroy();
            circular3D.destroy();
            removeElement(id);
        });
        it('Doughnut - Hightlight Mode Point', (done: Function) => {
            circular3D.loaded = (args: CircularChart3DLoadedEventArgs) => {
                element = document.getElementById('pie-svg-0-region-series-0-point-3');
                trigger.mousemoveEvent(element, 0, 0, 200, 200);
                element = document.getElementById('pie-svg-0-region-series-0-point-1');
                trigger.mousemoveEvent(element, 0, 0, 200, 200);
                element = document.getElementById('pie-svg-0-region-series-0-point-6');
                trigger.mousemoveEvent(element, 0, 0, 200, 200);
                expect(document.getElementsByClassName(highlight + '0' + '_point_6').length).toBe(15);
                done();
            };
            circular3D.highlightMode = 'Point';
            circular3D.highlightPattern = 'Dots';
            circular3D.refresh();
        });
        it('Patterns with Dots', (done: Function) => {
            circular3D.loaded = (args: CircularChart3DLoadedEventArgs) => {
                circular3D.loaded = null;
                element = document.getElementById('pie-svg-0-region-series-0-point-0');
                trigger.mousemoveEvent(element, 0, 0, 200, 200);
                expect(document.getElementById(id + '_svg').querySelectorAll('pattern').length).toBe(12);
                expect(document.getElementById(id + '_svg').querySelectorAll('pattern')[0].id).toBe('pie_Dots_Selection_0');
                done();
            };
            circular3D.highlightPattern = 'Dots';
            circular3D.refresh();
        });
        it('Patterns with DiagonalForward', (done: Function) => {
            circular3D.loaded = (args: CircularChart3DLoadedEventArgs) => {
                circular3D.loaded = null;
                element = document.getElementById('pie-svg-0-region-series-0-point-0');
                trigger.mousemoveEvent(element, 0, 0, 200, 200);
                expect(document.getElementById(id + '_svg').querySelectorAll('pattern').length).toBe(12);
                expect(document.getElementById(id + '_svg').querySelectorAll('pattern')[0].id).toBe('pie_DiagonalForward_Selection_0');
                done();
            };
            circular3D.highlightPattern = 'DiagonalForward';
            circular3D.refresh();
        });
        it('Patterns with Crosshatch', (done: Function) => {
            circular3D.loaded = (args: CircularChart3DLoadedEventArgs) => {
                circular3D.loaded = null;
                expect(document.getElementById(id + '_svg').querySelectorAll('pattern').length).toBe(12);
                expect(document.getElementById(id + '_svg').querySelectorAll('pattern')[0].id).toBe('pie_Crosshatch_Selection_0');
                done();
            };
            circular3D.highlightPattern = 'Crosshatch';
            circular3D.refresh();
        });
        it('Patterns with Pacman', (done: Function) => {
            circular3D.loaded = (args: CircularChart3DLoadedEventArgs) => {
                circular3D.loaded = null;
                expect(document.getElementById(id + '_svg').querySelectorAll('pattern').length).toBe(12);
                expect(document.getElementById(id + '_svg').querySelectorAll('pattern')[0].id).toBe('pie_Pacman_Selection_0');
                done();
            };
            circular3D.highlightPattern = 'Pacman';
            circular3D.refresh();
        });
        it('Patterns with DiagonalBackward', (done: Function) => {
            circular3D.loaded = (args: CircularChart3DLoadedEventArgs) => {
                circular3D.loaded = null;
                expect(document.getElementById(id + '_svg').querySelectorAll('pattern').length).toBe(12);
                expect(document.getElementById(id + '_svg').querySelectorAll('pattern')[0].id).toBe('pie_DiagonalBackward_Selection_0');
                done();
            };
            circular3D.highlightPattern = 'DiagonalBackward';
            circular3D.refresh();
        });
        it('Patterns with Grid', (done: Function) => {
            circular3D.loaded = (args: CircularChart3DLoadedEventArgs) => {
                circular3D.loaded = null;
                expect(document.getElementById(id + '_svg').querySelectorAll('pattern').length).toBe(12);
                expect(document.getElementById(id + '_svg').querySelectorAll('pattern')[0].id).toBe('pie_Grid_Selection_0');
                done();
            };
            circular3D.highlightPattern = 'Grid';
            circular3D.refresh();
        });
        it('Patterns with Turquoise', (done: Function) => {
            circular3D.loaded = (args: CircularChart3DLoadedEventArgs) => {
                circular3D.loaded = null;
                expect(document.getElementById(id + '_svg').querySelectorAll('pattern').length).toBe(12);
                expect(document.getElementById(id + '_svg').querySelectorAll('pattern')[1].id).toBe('pie_Turquoise_Selection_1');
                done();
            };
            circular3D.highlightPattern = 'Turquoise';
            circular3D.refresh();
        });
        it('Patterns with Star', (done: Function) => {
            circular3D.loaded = (args: CircularChart3DLoadedEventArgs) => {
                circular3D.loaded = null;
                expect(document.getElementById(id + '_svg').querySelectorAll('pattern').length).toBe(12);
                expect(document.getElementById(id + '_svg').querySelectorAll('pattern')[0].id).toBe('pie_Star_Selection_0');
                done();
            };
            circular3D.highlightPattern = 'Star';
            circular3D.refresh();
        });
        it('Patterns with Triangle', (done: Function) => {
            circular3D.loaded = (args: CircularChart3DLoadedEventArgs) => {
                circular3D.loaded = null;
                expect(document.getElementById(id + '_svg').querySelectorAll('pattern').length).toBe(12);
                expect(document.getElementById(id + '_svg').querySelectorAll('pattern')[2].id).toBe('pie_Triangle_Selection_2');
                done();
            };
            circular3D.highlightPattern = 'Triangle';
            circular3D.refresh();
        });
        it('Patterns with Chessboard', (done: Function) => {
            circular3D.loaded = (args: CircularChart3DLoadedEventArgs) => {
                circular3D.loaded = null;
                expect(document.getElementById(id + '_svg').querySelectorAll('pattern').length).toBe(12);
                expect(document.getElementById(id + '_svg').querySelectorAll('pattern')[2].id).toBe('pie_Chessboard_Selection_2');
                done();
            };
            circular3D.highlightPattern = 'Chessboard';
            circular3D.refresh();
        });
        it('Patterns with Circle', (done: Function) => {
            circular3D.loaded = (args: CircularChart3DLoadedEventArgs) => {
                circular3D.loaded = null;
                expect(document.getElementById(id + '_svg').querySelectorAll('pattern').length).toBe(12);
                expect(document.getElementById(id + '_svg').querySelectorAll('pattern')[0].id).toBe('pie_Circle_Selection_0');
                done();
            };
            circular3D.highlightPattern = 'Circle';
            circular3D.refresh();
        });
        it('Patterns with Tile', (done: Function) => {
            circular3D.loaded = (args: CircularChart3DLoadedEventArgs) => {
                expect(document.getElementById(id + '_svg').querySelectorAll('pattern').length).toBe(12);
                expect(document.getElementById(id + '_svg').querySelectorAll('pattern')[0].id).toBe('pie_Tile_Selection_0');
                done();
            };
            circular3D.highlightPattern = 'Tile';
            circular3D.refresh();
        });
        it('Patterns with HorizontalDash', (done: Function) => {
            circular3D.loaded = (args: CircularChart3DLoadedEventArgs) => {
                circular3D.loaded = null;
                expect(document.getElementById(id + '_svg').querySelectorAll('pattern').length).toBe(12);
                expect(document.getElementById(id + '_svg').querySelectorAll('pattern')[0].id).toBe('pie_HorizontalDash_Selection_0');
                done();
            };
            circular3D.highlightPattern = 'HorizontalDash';
            circular3D.refresh();
        });
        it('Patterns with VerticalDash', (done: Function) => {
            circular3D.loaded = (args: CircularChart3DLoadedEventArgs) => {
                circular3D.loaded = null;
                expect(document.getElementById(id + '_svg').querySelectorAll('pattern').length).toBe(12);
                expect(document.getElementById(id + '_svg').querySelectorAll('pattern')[0].id).toBe('pie_VerticalDash_Selection_0');
                done();
            };
            circular3D.highlightPattern = 'VerticalDash';
            circular3D.highlightMode = 'Point';
            circular3D.isMultiSelect = true;
            circular3D.refresh();
        });
        it('Patterns with Rectangle', (done: Function) => {
            circular3D.loaded = (args: CircularChart3DLoadedEventArgs) => {
                circular3D.loaded = null;
                expect(document.getElementById(id + '_svg').querySelectorAll('pattern').length).toBe(12);
                expect(document.getElementById(id + '_svg').querySelectorAll('pattern')[0].id).toBe('pie_Rectangle_Selection_0');
                done();
            };
            circular3D.highlightPattern = 'Rectangle';
            circular3D.isMultiSelect = false;
            circular3D.refresh();
        });
        it('Patterns with Box', (done: Function) => {
            circular3D.loaded = (args: CircularChart3DLoadedEventArgs) => {
                circular3D.loaded = null;
                expect(document.getElementById(id + '_svg').querySelectorAll('pattern').length).toBe(12);
                expect(document.getElementById(id + '_svg').querySelectorAll('pattern')[0].id).toBe('pie_Box_Selection_0');
                done();
            };
            circular3D.highlightPattern = 'Box';
            circular3D.refresh();
        });
        it('Patterns with VerticalStripe', (done: Function) => {
            circular3D.loaded = (args: CircularChart3DLoadedEventArgs) => {
                circular3D.loaded = null;
                expect(document.getElementById(id + '_svg').querySelectorAll('pattern').length).toBe(12);
                expect(document.getElementById(id + '_svg').querySelectorAll('pattern')[0].id).toBe('pie_VerticalStripe_Selection_0');
                done();
            };
            circular3D.highlightPattern = 'VerticalStripe';
            circular3D.refresh();
        });
        it('Patterns with Bubble', (done: Function) => {
            circular3D.loaded = (args: CircularChart3DLoadedEventArgs) => {
                circular3D.loaded = null;
                expect(document.getElementById(id + '_svg').querySelectorAll('pattern').length).toBe(12);
                expect(document.getElementById(id + '_svg').querySelectorAll('pattern')[0].id).toBe('pie_Bubble_Selection_0');
                done();
            };
            circular3D.highlightPattern = 'Bubble';
            circular3D.refresh();
        });
        it('Patterns with HorizontalStripe', (done: Function) => {
            circular3D.loaded = (args: CircularChart3DLoadedEventArgs) => {
                circular3D.loaded = null;
                expect(document.getElementById(id + '_svg').querySelectorAll('pattern').length).toBe(12);
                expect(document.getElementById(id + '_svg').querySelectorAll('pattern')[0].id).toBe('pie_HorizontalStripe_Selection_0');
                done();
            };

            circular3D.highlightPattern = 'HorizontalStripe';
            circular3D.refresh();
        });
        it('Doughnut - highlighted in mousemove over Legend', (done: Function) => {
            circular3D.loaded = (args: CircularChart3DLoadedEventArgs) => {
                circular3D.loaded = null;
                element = document.getElementById('pie_chart_legend_shape_1');
                trigger.mousemoveEvent(element, 0, 0, 200, 200);
                expect(document.getElementsByClassName(highlight + '0' + '_point_1').length).toBe(19);
                element = document.getElementById(id + '-border');
                trigger.mousemoveEvent(element, 0, 0, 200, 200);
                expect(document.getElementsByClassName(highlight + '0' + '_point_1').length).toBe(0);
                done();
            };
            circular3D.legendSettings.toggleVisibility = false;
            circular3D.legendSettings.enableHighlight = true;
            circular3D.selectedDataIndexes = [];
            circular3D.highlightMode = 'None';
            circular3D.circularChartHighlight3DModule.selectedDataIndexes = [];
            circular3D.refresh();
        });
        it('Doughnut - point highlight while hover the correspoding Datalabel ', (done: Function) => {
            circular3D.loaded = (args: CircularChart3DLoadedEventArgs) => {
                element = document.getElementById('pie-svg-data-label-text-0');
                trigger.mousemoveEvent(element, 0, 0, 200, 200);
                expect(document.getElementsByClassName(highlight + '0' + '_point_0').length).toBe(23);
                done();
            };
            circular3D.highlightMode = 'Point';
            //circular3D.circularHighlight3DModule.selectedDataIndexes = [];
            circular3D.refresh();
        });
        it('Pie - Checking whether single point is highlighted', (done: Function) => {
            circular3D.loaded = (args: CircularChart3DLoadedEventArgs) => {
                element = document.getElementById('pie-svg-0-region-series-0-point-3');
                trigger.mousemoveEvent(element, 0, 0, 200, 200);
                element = document.getElementById('pie-svg-0-region-series-0-point-1');
                trigger.mousemoveEvent(element, 0, 0, 200, 200);
                element = document.getElementById('pie-svg-0-region-series-0-point-6');
                trigger.mousemoveEvent(element, 0, 0, 200, 200);
                expect(document.getElementsByClassName(highlight + '0' + '_point_6').length).toBe(10);
                done();
            };
            circular3D.series[0].innerRadius = '0%';
            circular3D.circularChartHighlight3DModule.selectedDataIndexes = [];
            circular3D.refresh();
        });
        it('Pie - highlighted in mousemove over Legend', (done: Function) => {
            circular3D.loaded = (args: CircularChart3DLoadedEventArgs) => {
                circular3D.loaded = null;
                element = document.getElementById('pie_chart_legend_text_1');
                trigger.mousemoveEvent(element, 0, 0, 200, 200);
                element = document.getElementById('pie_chart_legend_shape_1');
                expect(element.getAttribute('class')).toBe('pie_ej2_chart_highlight_series_0_point_1');
                done();
            };
            circular3D.legendSettings.toggleVisibility = false;
            circular3D.selectedDataIndexes = [];
            circular3D.circularChartHighlight3DModule.selectedDataIndexes = [];
            circular3D.refresh();
        });
        it('Pie - point highlight while hover the correspoding Datalabel ', (done: Function) => {
            circular3D.loaded = (args: CircularChart3DLoadedEventArgs) => {
                element = document.getElementById('pie-svg-data-label-text-0');
                trigger.mousemoveEvent(element, 0, 0, 200, 200);
                expect(document.getElementsByClassName(highlight + '0' + '_point_0').length).toBe(14);
                done();
            };
            circular3D.highlightMode = 'Point';
            circular3D.circularChartHighlight3DModule.selectedDataIndexes = [];
            circular3D.refresh();
        });
        it('Pie - point highlight with selection', (done: Function) => {
            circular3D.loaded = (args: CircularChart3DLoadedEventArgs) => {
                element = document.getElementById('pie_chart_legend_shape_3');
                trigger.clickEvent(element);
                element = document.getElementById('pie_chart_legend_shape_1');
                trigger.mousemoveEvent(element, 0, 0, 200, 200);
                expect(document.getElementsByClassName(highlight + '0' + '_point_1').length).toBe(12);
                element = document.getElementById(id + '-border');
                trigger.mousemoveEvent(element, 0, 0, 200, 200);
                expect(document.getElementsByClassName(highlight + '0' + '_point_1').length).toBe(0);
                done();
            };
            circular3D.selectionMode = 'Point';
            circular3D.refresh();
        });
        it('Pie - point highlight with tooltip', (done: Function) => {
            circular3D.loaded = (args: CircularChart3DLoadedEventArgs) => {
                element = document.getElementById('pie-svg-0-region-series-0-point-1');
                trigger.mousemoveEvent(element, 0, 0, 200, 200);
                expect(document.getElementsByClassName(highlight + '0' + '_point_1').length).toBe(12);
                done();
            };
            circular3D.tooltip = { enable: true };
            circular3D.highlightMode = 'Point';
            circular3D.selectionMode = 'None';
            circular3D.legendSettings.enableHighlight = true;
            circular3D.refresh();
        });
    });
    it('memory leak', () => {
        profile.sample();
        const average: number = inMB(profile.averageChange);
        //Check average change in memory samples to not be over 10MB
        expect(average).toBeLessThan(10);
        const memory: number = inMB(getMemoryProfile());
        //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
    });
});
