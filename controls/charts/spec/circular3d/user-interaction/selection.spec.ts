/* eslint-disable @typescript-eslint/no-unused-vars */
import {  createElement } from '@syncfusion/ej2-base';
import { CircularChart3D } from '../../../src/circularchart3d/circularchart3d';
import { CircularChart3DLoadedEventArgs, CircularChart3DSelectionCompleteEventArgs } from '../../../src/circularchart3d/model/pie-interface';
import { MouseEvents } from '../../chart3d/base/events.spec';
import { removeElement } from '@syncfusion/ej2-svg-base';
import { PieSeries3D } from '../../../src/circularchart3d/renderer/series';
import { getMemoryProfile, inMB, profile } from '../../common.spec';
import { CircularChartLegend3D } from '../../../src/circularchart3d/legend/legend';
import { CircularChartDataLabel3D } from '../../../src/circularchart3d/renderer/dataLabel';
import { CircularChartSelection3D } from '../../../src/circularchart3d/user-interaction/selection';
import { categoryData1 } from '../../chart/base/data.spec';
import { CircularChartTooltip3D } from '../../../src/circularchart3d/user-interaction/tooltip';
import { CircularChartExport3D } from '../../../src/circularchart3d/print-export/export';

CircularChart3D.Inject(PieSeries3D, CircularChartLegend3D,
                       CircularChartDataLabel3D, CircularChartSelection3D , CircularChartTooltip3D, CircularChartExport3D);

document.body.appendChild(createElement('style', {
    innerHTML: ' .selection { stroke-width: 2; fill: lime; stroke: red; opacity: 1; } '
}));

describe('Circular3D Chart Control', () => {
    beforeAll(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/tslint/config
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            // eslint-disable-next-line no-console
            console.log('Unsupported environment, window.performance.memory is unavailable');
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
    describe('Selection', () => {
        let ele: HTMLElement;
        const id: string = 'pie';
        let element: Element;
        const selection: string = id + '_ej2_chart_selection_series_';
        let selected: HTMLCollection;
        const i: number = 0;
        const j: number = 0;
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
            circular3D.circularChartSelection3DModule.destroy();
            circular3D.destroy();
            removeElement(id);
        });
        it('Doughnut - MultiSelect false Selection Mode Point', (done: Function) => {
            circular3D.loaded = (args: CircularChart3DLoadedEventArgs) => {
                element = document.getElementById('pie-svg-0-region-series-0-point-0');
                trigger.clickEvent(element);
                element = document.getElementById('pie-svg-0-region-series-0-point-1');
                trigger.clickEvent(element);
                element = document.getElementById('pie-svg-0-region-series-0-point-6');
                trigger.clickEvent(element);
                expect(document.getElementsByClassName(selection + '0' + '_point_6').length).toBe(17);
                done();
            };
            circular3D.selectionMode = 'Point';
            circular3D.refresh();
        });
        it('Doughnut - MultiSelect true Selection Mode Point', (done: Function) => {
            circular3D.loaded = (args: CircularChart3DLoadedEventArgs) => {
                element = document.getElementById('pie-svg-0-region-series-0-point-3');
                trigger.clickEvent(element);
                element = document.getElementById('pie-svg-0-region-series-0-point-6');
                trigger.clickEvent(element);
                expect((document.getElementsByClassName(selection + '0' + '_point_6').length + document.getElementsByClassName(selection + '0' + '_point_3').length)).toBe(41);
                done();
            };
            circular3D.selectionMode = 'Point';
            circular3D.isMultiSelect = true;
            //circular3D.circularSelection3DModule.selectedDataIndexes = [];
            circular3D.refresh();
        });
        it('Doughnut - Single point selection and UnSelection', (done: Function) => {
            circular3D.loaded = (args: CircularChart3DLoadedEventArgs) => {
                element = document.getElementById('pie-svg-17-region-series-0-point-4');
                trigger.clickEvent(element);
                selected = document.getElementsByClassName(selection + '0' + '_point_4');
                expect(element === <HTMLElement>selected[0]).toBe(true);
                trigger.clickEvent(element);
                selected = document.getElementsByClassName(selection + '0' + '_point_4');
                expect(selected.length).toBe(0);
                done();
            };
            circular3D.selectionMode = 'Point';
            circular3D.isMultiSelect = false;
            circular3D.circularChartSelection3DModule.selectedDataIndexes = [];
            circular3D.refresh();
        });
        it('Doughnut - Selected DataIndexes checking', (done: Function) => {
            circular3D.loaded = (args: CircularChart3DLoadedEventArgs) => {
                expect(document.getElementsByClassName(selection + '0' + '_point_2').length).toBe(25);
                done();
            };
            circular3D.selectionMode = 'Point';
            circular3D.selectedDataIndexes = [{ series: 0, point: 2 }];
            circular3D.circularChartSelection3DModule.selectedDataIndexes = [];
            circular3D.refresh();
        });
        it('Doughnut - Selected Legend toggle visible false', (done: Function) => {
            circular3D.loaded = (args: CircularChart3DLoadedEventArgs) => {
                circular3D.loaded = null;
                element = document.getElementById('pie_chart_legend_text_1');
                trigger.clickEvent(element);
                expect(document.getElementsByClassName(selection + '0' + '_point_1').length).toBe(25);
                trigger.clickEvent(element);
                expect(document.getElementsByClassName(selection + '0' + '_point_1').length).toBe(0);
                done();
            };
            circular3D.legendSettings.toggleVisibility = false;
            circular3D.selectedDataIndexes = [];
            circular3D.circularChartSelection3DModule.selectedDataIndexes = [];
            circular3D.refresh();
        });

        it('Doughnut - point selection while click the correspoding Datalabel ', (done: Function) => {
            circular3D.loaded = (args: CircularChart3DLoadedEventArgs) => {
                element = document.getElementById('pie-svg-data-label-text-0');
                trigger.clickEvent(element);
                expect(document.getElementsByClassName(selection + '0' + '_point_0').length).toBe(29);
                done();
            };
            circular3D.selectionMode = 'Point';
            //circular3D.circularSelection3DModule.selectedDataIndexes = [];
            circular3D.refresh();
        });
        it('Doughnut - Selected Legend toggle visible true', (done: Function) => {
            circular3D.loaded = (args: CircularChart3DLoadedEventArgs) => {
                circular3D.loaded = null;
                element = document.getElementById('pie_chart_legend_shape_3');
                trigger.clickEvent(element);
                expect(document.getElementsByClassName(selection + '0').length).toBe(0);
                done();
            };
            circular3D.legendSettings.toggleVisibility = true;
            circular3D.circularChartSelection3DModule.selectedDataIndexes = [];
            circular3D.refresh();
        });
        it('Pie - MultiSelect false Selection Mode Point', (done: Function) => {
            circular3D.loaded = (args: CircularChart3DLoadedEventArgs) => {
                element = document.getElementById('pie-svg-0-region-series-0-point-3');
                trigger.clickEvent(element);
                element = document.getElementById('pie-svg-0-region-series-0-point-1');
                trigger.clickEvent(element);
                element = document.getElementById('pie-svg-0-region-series-0-point-6');
                trigger.clickEvent(element);
                expect(document.getElementsByClassName(selection + '0' + '_point_6').length).toBe(11);
                done();
            };
            circular3D.series[0].innerRadius = '0%';
            circular3D.legendSettings.toggleVisibility = false;
            circular3D.circularChartSelection3DModule.selectedDataIndexes = [];
            circular3D.isMultiSelect = false;
            circular3D.refresh();
        });
        it('Pie - MultiSelect true Selection Mode Point', (done: Function) => {
            circular3D.loaded = (args: CircularChart3DLoadedEventArgs) => {
                element = document.getElementById('pie-svg-0-region-series-0-point-' + 3);
                trigger.clickEvent(element);
                element = document.getElementById('pie-svg-0-region-series-0-point-' + 6);
                trigger.clickEvent(element);
                expect((document.getElementsByClassName(selection + '0' + '_point_6').length + document.getElementsByClassName(selection + '0' + '_point_3').length)).toBe(25);
                done();
            };
            circular3D.selectionMode = 'Point';
            circular3D.isMultiSelect = true;
            circular3D.circularChartSelection3DModule.selectedDataIndexes = [];
            circular3D.refresh();
        });
        it('Pie - Single point selection and UnSelection', (done: Function) => {
            circular3D.loaded = (args: CircularChart3DLoadedEventArgs) => {
                element = document.getElementById('pie-svg-0-region-series-0-point-4');
                trigger.clickEvent(element);
                selected = document.getElementsByClassName(selection + '0' + '_point_4');
                trigger.clickEvent(element);
                selected = document.getElementsByClassName(selection + '0' + '_point_4');
                expect(selected.length).toBe(0);
                done();
            };
            circular3D.selectionMode = 'Point';
            circular3D.isMultiSelect = false;
            circular3D.circularChartSelection3DModule.selectedDataIndexes = [];
            circular3D.refresh();
        });
        it('Pie - Selected DataIndexes checking', (done: Function) => {
            circular3D.loaded = (args: CircularChart3DLoadedEventArgs) => {
                expect(document.getElementsByClassName(selection + '0' + '_point_2').length).toBe(15);
                done();
            };
            circular3D.selectionMode = 'Point';
            circular3D.selectedDataIndexes = [{ series: 0, point: 2 }];
            circular3D.circularChartSelection3DModule.selectedDataIndexes = [];
            circular3D.refresh();
        });
        it('Pie - Selected Legend toggle visible false', (done: Function) => {
            circular3D.loaded = (args: CircularChart3DLoadedEventArgs) => {
                circular3D.loaded = null;
                element = document.getElementById('pie_chart_legend_text_1');
                trigger.clickEvent(element);
                expect(document.getElementsByClassName(selection + '0' + '_point_1').length).toBe(15);
                trigger.clickEvent(element);
                expect(document.getElementsByClassName(selection + '0' + '_point_1').length).toBe(0);
                done();
            };
            circular3D.legendSettings.toggleVisibility = false;
            circular3D.selectedDataIndexes = [];
            circular3D.circularChartSelection3DModule.selectedDataIndexes = [];
            circular3D.refresh();
        });
        it('Pie - Selected Legend toggle visible true', (done: Function) => {
            circular3D.loaded = (args: CircularChart3DLoadedEventArgs) => {
                circular3D.loaded = null;
                element = document.getElementById('pie-svg-0-region-series-0-point-3');
                trigger.clickEvent(element);
                trigger.clickEvent(element);
                expect(document.getElementsByClassName(selection + '0').length).toBe(0);
                element = document.getElementById('pie_chart_legend_shape_2');
                trigger.clickEvent(element);
                expect(element.getAttribute('class')).toBe('pie_ej2_deselected');
                done();
            };
            circular3D.legendSettings.toggleVisibility = true;
            circular3D.visibleSeries[0].explode = true;
            circular3D.refresh();
        });
        it('Pie - Selected Legend click on selected point', (done: Function) => {
            circular3D.loaded = (args: CircularChart3DLoadedEventArgs) => {
                circular3D.loaded = null;
                element = document.getElementById('pie-svg-0-region-series-0-point-4');
                trigger.clickEvent(element);
                expect(document.getElementsByClassName(selection + '0' + '_point_4').length).toBe(26);
                element = document.getElementById('pie_chart_legend_shape_4');
                trigger.clickEvent(element);
                expect(element.getAttribute('class')).toBe('');
                trigger.clickEvent(element);
                done();
            };
            circular3D.legendSettings.toggleVisibility = true;
            circular3D.legendSettings.visible = true;
            circular3D.refresh();
        });
        it('Patterns with Dots', (done: Function) => {
            circular3D.loaded = (args: CircularChart3DLoadedEventArgs) => {
                circular3D.loaded = null;
                expect(document.getElementById(id + '_svg').querySelectorAll('pattern').length).toBe(8);
                expect(document.getElementById(id + '_svg').querySelectorAll('pattern')[0].id).toBe('pie_Dots_Selection_0');
                done();
            };
            circular3D.selectionPattern = 'Dots';
            circular3D.refresh();
        });

        it('Patterns with DiagonalForward', (done: Function) => {
            circular3D.loaded = (args: CircularChart3DLoadedEventArgs) => {
                circular3D.loaded = null;
                expect(document.getElementById(id + '_svg').querySelectorAll('pattern').length).toBe(8);
                expect(document.getElementById(id + '_svg').querySelectorAll('pattern')[0].id).toBe('pie_DiagonalForward_Selection_0');
                done();
            };

            circular3D.selectionPattern = 'DiagonalForward';
            circular3D.refresh();
        });
        it('Patterns with Crosshatch', (done: Function) => {
            circular3D.loaded = (args: CircularChart3DLoadedEventArgs) => {
                circular3D.loaded = null;
                expect(document.getElementById(id + '_svg').querySelectorAll('pattern').length).toBe(8);
                expect(document.getElementById(id + '_svg').querySelectorAll('pattern')[0].id === 'pie_Crosshatch_Selection_0').toBe(true);
                done();
            };

            circular3D.selectionPattern = 'Crosshatch';
            circular3D.refresh();
        });
        it('Patterns with Pacman', (done: Function) => {
            circular3D.loaded = (args: CircularChart3DLoadedEventArgs) => {
                circular3D.loaded = null;
                expect(document.getElementById(id + '_svg').querySelectorAll('pattern').length).toBe(8);
                expect(document.getElementById(id + '_svg').querySelectorAll('pattern')[0].id).toBe('pie_Pacman_Selection_0');
                done();
            };

            circular3D.selectionPattern = 'Pacman';
            circular3D.refresh();
        });
        it('Patterns with DiagonalBackward', (done: Function) => {
            circular3D.loaded = (args: CircularChart3DLoadedEventArgs) => {
                circular3D.loaded = null;
                expect(document.getElementById(id + '_svg').querySelectorAll('pattern').length).toBe(8);
                expect(document.getElementById(id + '_svg').querySelectorAll('pattern')[0].id).toBe('pie_DiagonalBackward_Selection_0');
                done();
            };

            circular3D.selectionPattern = 'DiagonalBackward';
            circular3D.refresh();
        });
        it('Patterns with Grid', (done: Function) => {
            circular3D.loaded = (args: CircularChart3DLoadedEventArgs) => {
                circular3D.loaded = null;
                expect(document.getElementById(id + '_svg').querySelectorAll('pattern').length).toBe(8);
                expect(document.getElementById(id + '_svg').querySelectorAll('pattern')[0].id).toBe('pie_Grid_Selection_0');
                done();
            };

            circular3D.selectionPattern = 'Grid';
            circular3D.refresh();
        });
        it('Patterns with Turquoise', (done: Function) => {
            circular3D.loaded = (args: CircularChart3DLoadedEventArgs) => {
                circular3D.loaded = null;
                expect(document.getElementById(id + '_svg').querySelectorAll('pattern').length).toBe(8);
                expect(document.getElementById(id + '_svg').querySelectorAll('pattern')[1].id).toBe('pie_Turquoise_Selection_1');
                done();
            };

            circular3D.selectionPattern = 'Turquoise';
            circular3D.refresh();
        });
        it('Patterns with Star', (done: Function) => {
            circular3D.loaded = (args: CircularChart3DLoadedEventArgs) => {
                circular3D.loaded = null;
                expect(document.getElementById(id + '_svg').querySelectorAll('pattern').length).toBe(8);
                expect(document.getElementById(id + '_svg').querySelectorAll('pattern')[0].id).toBe('pie_Star_Selection_0');
                done();
            };

            circular3D.selectionPattern = 'Star';
            circular3D.refresh();
        });
        it('Patterns with Triangle', (done: Function) => {
            circular3D.loaded = (args: CircularChart3DLoadedEventArgs) => {
                circular3D.loaded = null;
                expect(document.getElementById(id + '_svg').querySelectorAll('pattern').length).toBe(8);
                expect(document.getElementById(id + '_svg').querySelectorAll('pattern')[2].id).toBe('pie_Triangle_Selection_2');
                done();
            };

            circular3D.selectionPattern = 'Triangle';
            circular3D.refresh();
        });
        it('Patterns with Chessboard', (done: Function) => {
            circular3D.loaded = (args: CircularChart3DLoadedEventArgs) => {
                circular3D.loaded = null;
                expect(document.getElementById(id + '_svg').querySelectorAll('pattern').length).toBe(8);
                expect(document.getElementById(id + '_svg').querySelectorAll('pattern')[2].id).toBe('pie_Chessboard_Selection_2');
                done();
            };

            circular3D.selectionPattern = 'Chessboard';
            circular3D.refresh();
        });
        it('Patterns with Circle', (done: Function) => {
            circular3D.loaded = (args: CircularChart3DLoadedEventArgs) => {
                circular3D.loaded = null;
                expect(document.getElementById(id + '_svg').querySelectorAll('pattern').length).toBe(8);
                expect(document.getElementById(id + '_svg').querySelectorAll('pattern')[0].id).toBe('pie_Circle_Selection_0');
                done();
            };

            circular3D.selectionPattern = 'Circle';
            circular3D.refresh();
        });
        it('Patterns with Tile', (done: Function) => {
            circular3D.loaded = (args: CircularChart3DLoadedEventArgs) => {
                expect(document.getElementById(id + '_svg').querySelectorAll('pattern').length).toBe(8);
                expect(document.getElementById(id + '_svg').querySelectorAll('pattern')[0].id).toBe('pie_Tile_Selection_0');
                done();
            };

            circular3D.selectionPattern = 'Tile';
            circular3D.refresh();
        });
        it('Patterns with HorizontalDash', (done: Function) => {
            circular3D.loaded = (args: CircularChart3DLoadedEventArgs) => {
                circular3D.loaded = null;
                expect(document.getElementById(id + '_svg').querySelectorAll('pattern').length).toBe(8);
                expect(document.getElementById(id + '_svg').querySelectorAll('pattern')[0].id).toBe('pie_HorizontalDash_Selection_0');
                done();
            };

            circular3D.selectionPattern = 'HorizontalDash';
            circular3D.refresh();
        });
        it('Patterns with VerticalDash', (done: Function) => {
            circular3D.loaded = (args: CircularChart3DLoadedEventArgs) => {
                circular3D.loaded = null;
                expect(document.getElementById(id + '_svg').querySelectorAll('pattern').length).toBe(8);
                expect(document.getElementById(id + '_svg').querySelectorAll('pattern')[0].id).toBe('pie_VerticalDash_Selection_0');
                done();
            };
            circular3D.selectionPattern = 'VerticalDash';
            circular3D.selectionMode = 'Point';
            circular3D.isMultiSelect = true;
            circular3D.refresh();
        });
        it('Patterns with Rectangle', (done: Function) => {
            circular3D.loaded = (args: CircularChart3DLoadedEventArgs) => {
                circular3D.loaded = null;
                expect(document.getElementById(id + '_svg').querySelectorAll('pattern').length).toBe(8);
                expect(document.getElementById(id + '_svg').querySelectorAll('pattern')[0].id).toBe('pie_Rectangle_Selection_0');
                done();
            };

            circular3D.selectionPattern = 'Rectangle';
            circular3D.isMultiSelect = false;
            circular3D.refresh();
        });
        it('Patterns with Box', (done: Function) => {
            circular3D.loaded = (args: CircularChart3DLoadedEventArgs) => {
                circular3D.loaded = null;
                expect(document.getElementById(id + '_svg').querySelectorAll('pattern').length).toBe(8);
                expect(document.getElementById(id + '_svg').querySelectorAll('pattern')[0].id).toBe('pie_Box_Selection_0');
                done();
            };

            circular3D.selectionPattern = 'Box';
            circular3D.refresh();
        });
        it('Patterns with VerticalStripe', (done: Function) => {
            circular3D.loaded = (args: CircularChart3DLoadedEventArgs) => {
                circular3D.loaded = null;
                expect(document.getElementById(id + '_svg').querySelectorAll('pattern').length).toBe(8);
                expect(document.getElementById(id + '_svg').querySelectorAll('pattern')[0].id === 'pie_VerticalStripe_Selection_0').toBe(true);
                done();
            };

            circular3D.selectionPattern = 'VerticalStripe';
            circular3D.refresh();
        });
        it('Patterns with Bubble', (done: Function) => {
            circular3D.loaded = (args: CircularChart3DLoadedEventArgs) => {
                circular3D.loaded = null;
                expect(document.getElementById(id + '_svg').querySelectorAll('pattern').length).toBe(8);
                expect(document.getElementById(id + '_svg').querySelectorAll('pattern')[0].id).toBe('pie_Bubble_Selection_0');
                done();
            };

            circular3D.selectionPattern = 'Bubble';
            circular3D.refresh();
        });
        it('Patterns with HorizontalStripe', (done: Function) => {
            circular3D.loaded = (args: CircularChart3DLoadedEventArgs) => {
                circular3D.loaded = null;
                expect(document.getElementById(id + '_svg').querySelectorAll('pattern').length).toBe(8);
                expect(document.getElementById(id + '_svg').querySelectorAll('pattern')[0].id).toBe('pie_HorizontalStripe_Selection_0');
                done();
            };

            circular3D.selectionPattern = 'HorizontalStripe';
            circular3D.refresh();
        });
        it('checking the selectionComplete event', (done: Function) => {
            circular3D.loaded = (args: CircularChart3DLoadedEventArgs) => {
                circular3D.loaded = null;
                element = document.getElementById('pie-svg-0-region-series-0-point-3');
                trigger.clickEvent(element);
                expect(document.getElementsByClassName(selection + '0').length >= 0).toBe(true);
                done();
            };
            circular3D.selectionComplete = (arg : CircularChart3DSelectionCompleteEventArgs) => {
                arg.selectedDataValues[0].pointIndex = 2;
            };
            circular3D.selectionPattern = 'HorizontalStripe';
            circular3D.refresh();
        });
        it('checking the selection with explode', (done: Function) => {
            circular3D.loaded = (args: CircularChart3DLoadedEventArgs) => {
                circular3D.loaded = null;
                element = document.getElementById('pie-svg-8-region-series-0-point-3');
                trigger.clickEvent(element);
                expect(document.getElementsByClassName(selection + '0_point_3').length >= 0).toBe(true);
                done();
            };
            circular3D.selectionMode = 'Point';
            circular3D.series[0].explode = true;
            circular3D.series[0].explodeIndex = 3;
            circular3D.refresh();
        });
        it('checking the selection with Rotation', (done: Function) => {
            circular3D.loaded = (args: CircularChart3DLoadedEventArgs) => {
                circular3D.loaded = null;
                element = document.getElementById('pie-svg-8-region-series-0-point-3');
                const rect : DOMRect | ClientRect = element.getBoundingClientRect();
                const x: number = window.scrollX + rect.left + rect.width / 2;
                const y: number = window.scrollY + rect.top;
                trigger.mousedownEvent(ele, 0, 0, Math.ceil(x), Math.ceil(y));
                trigger.mousemoveEvent(ele, 0, 0, Math.ceil(x) + 100, Math.ceil(y) + 100);
                trigger.mouseupEvent(ele, 0, 0, Math.ceil(x) + 100, Math.ceil(y) + 100);
                expect(element.getAttribute('d')).toBe('M 193.09063572445072 101.37814288466589 L 193.09063572445072 101.37814288466589 L 193.09063572445072 101.37814288466589 L 204.65066565182906 91.50540251210519 L 204.65066565182906 91.50540251210519 ');
                done();
            };
            circular3D.series[0].explode = false;
            circular3D.title = 'Selection';
            circular3D.enableRotation = true;
            circular3D.enableRtl = true;
            circular3D.enableExport = true;
            circular3D.tooltip.enable = true;
            circular3D.refresh();
        });
        it('checking the selection with title textAlignment far', (done: Function) => {
            circular3D.loaded = (args: CircularChart3DLoadedEventArgs) => {
                circular3D.loaded = null;
                element = document.getElementById('pie-svg-8-region-series-0-point-3');
                trigger.clickEvent(element);
                expect(document.getElementsByClassName(selection + '0_point_3').length >= 0).toBe(true);
                done();
            };
            circular3D.selectionMode = 'Point';
            circular3D.title = 'Selection';
            circular3D.titleStyle.textAlignment = 'Far';
            circular3D.getPersistData();
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
