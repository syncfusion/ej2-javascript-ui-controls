/**
 * AccumulationChart Selection Spec file
 */
import { createElement } from '@syncfusion/ej2-base';
import { EmitType } from '@syncfusion/ej2-base';
import { PieSeries } from '../../../src/accumulation-chart/renderer/pie-series';
import { AccumulationChart } from '../../../src/accumulation-chart/accumulation';
import { AccumulationLegend } from '../../../src/accumulation-chart/renderer/legend';
import { AccPoints } from '../../../src/accumulation-chart/model/acc-base';
import { removeElement } from '../../../src/common/utils/helper';
import { AccumulationDataLabel } from '../../../src/accumulation-chart/renderer/dataLabel';
import { AccumulationSelection } from '../../../src/accumulation-chart/user-interaction/selection';
import { categoryData1 } from '../../chart/base/data.spec';
import { MouseEvents } from '../../chart/base/events.spec';
import { SliceOption } from '../base/util.spec';
import { IAccLoadedEventArgs } from '../../../src/accumulation-chart/model/pie-interface';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { profile, inMB, getMemoryProfile } from '../../common.spec';
AccumulationChart.Inject(PieSeries, AccumulationLegend, AccumulationDataLabel, AccumulationSelection);

document.body.appendChild(createElement('style', {
    innerHTML: ' .selection { stroke-width: 2; fill: lime; stroke: red; opacity: 1; } '
}));

describe('Accumulation Chart Control', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
    describe('Selection', () => {
        let ele: HTMLElement;
        let slice: HTMLElement;
        let loaded: EmitType<IAccLoadedEventArgs>;
        let id: string = 'pie'; let pieGroupId: string = id + 'SeriesGroup0';
        let sliceid: string = id + '_Series_0' + '_Point_';
        let slicepath: SliceOption;
        let legendG: Element;
        let element: Element;
        let selection: string = id + '_ej2_chart_selection_series_';
        let legendId: string = id + '_chart_legend';
        let y: number;
        let selected: HTMLCollection;
        let i: number = 0;
        let j: number = 0;
        let length: number;
        let accumulation: AccumulationChart; let points: AccPoints[];
        let trigger: MouseEvents = new MouseEvents();
        beforeAll((): void => {
            ele = createElement('div', { id: id });
            document.body.appendChild(ele);
            accumulation = new AccumulationChart({
                series: [
                    {
                        dataSource: categoryData1,
                        xName: 'x',
                        yName: 'y',
                        startAngle: 0,
                        endAngle: 360,
                        innerRadius: '30%',
                        animation: { enable: false },
                        dataLabel: {
                            visible: true, name: 'data', position: 'Inside',
                            border: { width: 1, color: 'violet' },
                            connectorStyle: { length: '10%' }
                        },
                    }
                ], width: '600', height: '400', legendSettings: { visible: true }
            });
            accumulation.appendTo('#' + id);
        });

        afterAll((): void => {
            accumulation.accumulationSelectionModule.destroy();
            accumulation.destroy();
            removeElement(id);
        });
        it('Doughnut - MultiSelect false Selection Mode Point', (done: Function) => {
            accumulation.loaded = (args: IAccLoadedEventArgs) => {
                element = document.getElementById('pie_Series_0_Point_3');
                trigger.clickEvent(element);
                element = document.getElementById('pie_Series_0_Point_1');
                trigger.clickEvent(element);
                element = document.getElementById('pie_Series_0_Point_6');
                trigger.clickEvent(element);
                expect(document.getElementsByClassName(selection + '0').length === 3).toBe(true);
                done();
            };
            accumulation.selectionMode = 'Point';
            accumulation.refresh();
        });
        it('Doughnut - MultiSelect true Selection Mode Point', (done: Function) => {
            accumulation.loaded = (args: IAccLoadedEventArgs) => {
                element = document.getElementById('pie_Series_0_Point_3');
                trigger.clickEvent(element);
                element = document.getElementById('pie_Series_0_Point_6');
                trigger.clickEvent(element);
                expect(document.getElementsByClassName(selection + '0').length === 5).toBe(true);
                done();
            };
            accumulation.selectionMode = 'Point';
            accumulation.isMultiSelect = true;
            accumulation.accumulationSelectionModule.selectedDataIndexes = [];
            accumulation.refresh();
        });
        it('Doughnut - Single point selection and UnSelection', (done: Function) => {
            accumulation.loaded = (args: IAccLoadedEventArgs) => {
                element = document.getElementById('pie_Series_0_Point_4');
                trigger.clickEvent(element);
                selected = document.getElementsByClassName(selection + '0');
                expect(element === <HTMLElement>selected[0]).toBe(true);
                trigger.clickEvent(element);
                selected = document.getElementsByClassName(selection + '0');
                expect(selected.length === 0).toBe(true);
                done();
            };
            accumulation.selectionMode = 'Point';
            accumulation.isMultiSelect = false;
            accumulation.accumulationSelectionModule.selectedDataIndexes = [];
            accumulation.refresh();
        });
        it('Doughnut - Multiple point selection and UnSelection', (done: Function) => {
            accumulation.loaded = (args: IAccLoadedEventArgs) => {
                let selectedLength: number;
                for (i = 0, length = accumulation.visibleSeries[0].points.length, j = 1; i < length; i++ , j++) {
                    element = document.getElementById('pie_Series_0_Point_' + i);
                    trigger.clickEvent(element);
                    selected = document.getElementsByClassName(selection + 0);
                    expect(selected.length === (2 * j) + 1).toBe(true);
                }
                selectedLength = selected.length;
                for (i = accumulation.visibleSeries[0].points.length - 1, j = 1; i > 0; i-- , j++) {
                    element = document.getElementById('pie_Series_0_Point_' + i);
                    trigger.clickEvent(element);
                    selected = document.getElementsByClassName(selection + 0);
                    expect(selected.length === selectedLength - (2 * j) - 1).toBe(true);
                }
                done();
            };
            accumulation.selectionMode = 'Point';
            accumulation.isMultiSelect = true;
            accumulation.accumulationSelectionModule.selectedDataIndexes = [];
            accumulation.refresh();
        });
        it('Doughnut - Selected DataIndexes checking', (done: Function) => {
            accumulation.loaded = (args: IAccLoadedEventArgs) => {
                expect(document.getElementsByClassName(selection + '0').length === 2).toBe(true);
                done();
            };
            accumulation.selectionMode = 'Point';
            accumulation.selectedDataIndexes = [{ series: 0, point: 2 }];
            accumulation.accumulationSelectionModule.selectedDataIndexes = [];
            accumulation.refresh();
        });
        it('Doughnut - Selected Legend toggle visible false', (done: Function) => {
            accumulation.loaded = (args: IAccLoadedEventArgs) => {
                accumulation.loaded = null;
                element = document.getElementById('pie_chart_legend_shape_1');
                trigger.clickEvent(element);
                expect(document.getElementsByClassName(selection + '0').length === 2).toBe(true);
                trigger.clickEvent(element);
                expect(document.getElementsByClassName(selection + '0').length === 0).toBe(true);
                done();
            };
            accumulation.legendSettings.toggleVisibility = false;
            accumulation.selectedDataIndexes = [];
            accumulation.accumulationSelectionModule.selectedDataIndexes = [];
            accumulation.refresh();
        });
        it('Doughnut - Set selectionstyle property', (done: Function) => {
            accumulation.loaded = (args: IAccLoadedEventArgs) => {
                element = document.getElementById('pie_Series_0_Point_3');
                trigger.clickEvent(element);
                expect(element.getAttribute('class') === 'selection').toBe(true);
                element = document.getElementById('pie_chart_legend_shape_3');
                expect(element.getAttribute('class') === 'selection').toBe(true);
                done();
            };
            accumulation.series[0].selectionStyle = 'selection';
            accumulation.refresh();
        });
        it('Doughnut - point selection while click the correspoding Datalabel ', (done: Function) => {
            accumulation.loaded = (args: IAccLoadedEventArgs) => {
                element = document.getElementById('pie_datalabel_Series_0_text_0');
                trigger.clickEvent(element);
                expect(document.getElementsByClassName(selection + '0').length === 2).toBe(true);
                done();
            };
            accumulation.selectionMode = 'Point';
            accumulation.series[0].selectionStyle = null;
            accumulation.accumulationSelectionModule.selectedDataIndexes = [];
            accumulation.refresh();
        });
        it('Doughnut - Selected Legend toggle visible true', (done: Function) => {
            accumulation.loaded = (args: IAccLoadedEventArgs) => {
                accumulation.loaded = null;
                element = document.getElementById('pie_chart_legend_shape_3');
                trigger.clickEvent(element);
                expect(document.getElementsByClassName(selection + '0').length).toBe(0);
                done();
            };
            accumulation.legendSettings.toggleVisibility = true;
            accumulation.accumulationSelectionModule.selectedDataIndexes = [];
            accumulation.refresh();
        });
        it('Pie - MultiSelect false Selection Mode Point', (done: Function) => {
            accumulation.loaded = (args: IAccLoadedEventArgs) => {
                element = document.getElementById('pie_Series_0_Point_3');
                trigger.clickEvent(element);
                element = document.getElementById('pie_Series_0_Point_1');
                trigger.clickEvent(element);
                element = document.getElementById('pie_Series_0_Point_6');
                trigger.clickEvent(element);
                expect(document.getElementsByClassName(selection + '0').length === 3).toBe(true);
                done();
            };
            accumulation.series[0].innerRadius = '0%';
            accumulation.legendSettings.toggleVisibility = false;
            accumulation.accumulationSelectionModule.selectedDataIndexes = [];
            accumulation.isMultiSelect = false;
            accumulation.refresh();
        });
        it('Pie - MultiSelect true Selection Mode Point', (done: Function) => {
            accumulation.loaded = (args: IAccLoadedEventArgs) => {
                element = document.getElementById('pie_Series_0_Point_' + 3);
                trigger.clickEvent(element);
                element = document.getElementById('pie_Series_0_Point_' + 6);
                trigger.clickEvent(element);
                expect(document.getElementsByClassName(selection + '0').length === 5).toBe(true);
                done();
            };
            accumulation.selectionMode = 'Point';
            accumulation.isMultiSelect = true;
            accumulation.accumulationSelectionModule.selectedDataIndexes = [];
            accumulation.refresh();
        });
        it('Pie - Single point selection and UnSelection', (done: Function) => {
            accumulation.loaded = (args: IAccLoadedEventArgs) => {
                element = document.getElementById('pie_Series_0_Point_4');
                trigger.clickEvent(element);
                selected = document.getElementsByClassName(selection + '0');
                expect(element === <HTMLElement>selected[0]).toBe(true);
                trigger.clickEvent(element);
                selected = document.getElementsByClassName(selection + '0');
                expect(selected.length === 0).toBe(true);
                done();
            };
            accumulation.selectionMode = 'Point';
            accumulation.isMultiSelect = false;
            accumulation.accumulationSelectionModule.selectedDataIndexes = [];
            accumulation.refresh();
        });
        it('Pie - Multiple point selection and UnSelection', (done: Function) => {
            accumulation.loaded = (args: IAccLoadedEventArgs) => {
                let selectedLength: number;
                for (i = 0, length = accumulation.visibleSeries[0].points.length, j = 1; i < length; i++ , j++) {
                    element = document.getElementById('pie_Series_0_Point_' + i);
                    trigger.clickEvent(element);
                    selected = document.getElementsByClassName(selection + 0);
                    expect(selected.length === (2 * j) + 1).toBe(true);
                }
                selectedLength = selected.length;
                for (i = accumulation.visibleSeries[0].points.length - 1, j = 1; i > 0; i-- , j++) {
                    element = document.getElementById('pie_Series_0_Point_' + i);
                    trigger.clickEvent(element);
                    selected = document.getElementsByClassName(selection + 0);
                    expect(selected.length === selectedLength - (2 * j) - 1).toBe(true);
                }
                done();
            };
            accumulation.selectionMode = 'Point';
            accumulation.isMultiSelect = true;
            accumulation.accumulationSelectionModule.selectedDataIndexes = [];
            accumulation.refresh();
        });
        it('Pie - Selected DataIndexes checking', (done: Function) => {
            accumulation.loaded = (args: IAccLoadedEventArgs) => {
                expect(document.getElementsByClassName(selection + '0').length === 2).toBe(true);
                done();
            };
            accumulation.selectionMode = 'Point';
            accumulation.selectedDataIndexes = [{ series: 0, point: 2 }];
            accumulation.accumulationSelectionModule.selectedDataIndexes = [];
            accumulation.refresh();
        });
        it('Pie - Selected Legend toggle visible false', (done: Function) => {
            accumulation.loaded = (args: IAccLoadedEventArgs) => {
                accumulation.loaded = null;
                element = document.getElementById('pie_chart_legend_text_1');
                trigger.clickEvent(element);
                expect(document.getElementsByClassName(selection + '0').length === 2).toBe(true);
                trigger.clickEvent(element);
                expect(document.getElementsByClassName(selection + '0').length === 0).toBe(true);
                done();
            };
            accumulation.legendSettings.toggleVisibility = false;
            accumulation.selectedDataIndexes = [];
            accumulation.accumulationSelectionModule.selectedDataIndexes = [];
            accumulation.refresh();
        });
        it('Pie - Set selectionstyle property', (done: Function) => {
            accumulation.loaded = (args: IAccLoadedEventArgs) => {
                element = document.getElementById('pie_Series_0_Point_3');
                trigger.clickEvent(element);
                expect(element.getAttribute('class') === 'selection').toBe(true);
                element = document.getElementById('pie_chart_legend_shape_3');
                expect(element.getAttribute('class') === 'selection').toBe(true);
                done();
            };
            accumulation.series[0].selectionStyle = 'selection';
            accumulation.refresh();
        });
        it('Pie - Selected Legend toggle visible true', (done: Function) => {
            accumulation.loaded = (args: IAccLoadedEventArgs) => {
                accumulation.loaded = null;
                element = document.getElementById('pie_Series_0_Point_3');
                trigger.clickEvent(element);
                trigger.clickEvent(element);
                expect(document.getElementsByClassName(selection + '0').length === 0).toBe(true); //2
                element = document.getElementById('pie_chart_legend_shape_2');
                trigger.clickEvent(element);
                expect(element.getAttribute('class') === '').toBe(true); //''
                done();
            };
            accumulation.legendSettings.toggleVisibility = true;
            accumulation.series[0].selectionStyle = null;
            accumulation.visibleSeries[0].explode = true;
            accumulation.refresh();
        });
        it('Pie - Selected without legend', (done: Function) => {
            accumulation.loaded = (args: IAccLoadedEventArgs) => {
                accumulation.loaded = null;
                element = document.getElementById('pie_Series_0_Point_3');
                trigger.clickEvent(element);
                expect(document.getElementsByClassName(selection + '0').length >= 0).toBe(true);
                trigger.clickEvent(element);
                expect(document.getElementsByClassName(selection + '0').length === 0).toBe(true);
                done();
            };
            accumulation.legendSettings.visible = false;
            accumulation.refresh();
        });
        it('Pie - Selected Legend click on selected point', (done: Function) => {
            accumulation.loaded = (args: IAccLoadedEventArgs) => {
                accumulation.loaded = null;
                element = document.getElementById('pie_Series_0_Point_4');
                trigger.clickEvent(element);
                expect(document.getElementsByClassName(selection + '0').length === 2).toBe(true);
                element = document.getElementById('pie_chart_legend_shape_4');
                trigger.clickEvent(element);
                expect(element.getAttribute('class') === selection + '0').toBe(true);
                trigger.clickEvent(element);
                element = document.getElementById('pie_Series_0_Point_4');
                expect(element.getAttribute('d')).not.toBe(null);
                done();
            };
            accumulation.legendSettings.toggleVisibility = true;
            accumulation.legendSettings.visible = true;
            accumulation.refresh();
        });
        it('Patterns with Dots', (done: Function) => {
            accumulation.loaded = (args: IAccLoadedEventArgs) => {
                accumulation.loaded = null;
                expect(document.getElementsByTagName('svg')[0].querySelectorAll('pattern').length).toBe(8);
                expect(document.getElementsByTagName('svg')[0].querySelectorAll('pattern')[0].id === 'Dots_Selection_0').toBe(true);
                done();
            };
            accumulation.selectionPattern = 'Dots';
            accumulation.refresh();
        });

        it('Patterns with DiagonalForward', (done: Function) => {
            accumulation.loaded = (args: IAccLoadedEventArgs) => {
                accumulation.loaded = null;
                expect(document.getElementsByTagName('svg')[0].querySelectorAll('pattern').length).toBe(8);
                expect(document.getElementsByTagName('svg')[0].querySelectorAll('pattern')[0].id === 'DiagonalForward_Selection_0').toBe(true);
                done();
            };

            accumulation.selectionPattern = 'DiagonalForward';
            accumulation.refresh();
        });
        it('Patterns with Crosshatch', (done: Function) => {
            accumulation.loaded = (args: IAccLoadedEventArgs) => {
                accumulation.loaded = null;
                expect(document.getElementsByTagName('svg')[0].querySelectorAll('pattern').length).toBe(8);
                expect(document.getElementsByTagName('svg')[0].querySelectorAll('pattern')[0].id === 'Crosshatch_Selection_0').toBe(true);
                done();
            };

            accumulation.selectionPattern = 'Crosshatch';
            accumulation.refresh();
        });
        it('Patterns with Pacman', (done: Function) => {
            accumulation.loaded = (args: IAccLoadedEventArgs) => {
                accumulation.loaded = null;
                expect(document.getElementsByTagName('svg')[0].querySelectorAll('pattern').length).toBe(8);
                expect(document.getElementsByTagName('svg')[0].querySelectorAll('pattern')[0].id === 'Pacman_Selection_0').toBe(true);
                done();
            };

            accumulation.selectionPattern = 'Pacman';
            accumulation.refresh();
        });
        it('Patterns with DiagonalBackward', (done: Function) => {
            accumulation.loaded = (args: IAccLoadedEventArgs) => {
                accumulation.loaded = null;
                expect(document.getElementsByTagName('svg')[0].querySelectorAll('pattern').length).toBe(8);
                expect(document.getElementsByTagName('svg')[0].querySelectorAll('pattern')[0].id === 'DiagonalBackward_Selection_0').toBe(true);
                done();
            };

            accumulation.selectionPattern = 'DiagonalBackward';
            accumulation.refresh();
        });
        it('Patterns with Grid', (done: Function) => {
            accumulation.loaded = (args: IAccLoadedEventArgs) => {
                accumulation.loaded = null;
                expect(document.getElementsByTagName('svg')[0].querySelectorAll('pattern').length).toBe(8);
                expect(document.getElementsByTagName('svg')[0].querySelectorAll('pattern')[0].id === 'Grid_Selection_0').toBe(true);
                done();
            };

            accumulation.selectionPattern = 'Grid';
            accumulation.refresh();
        });
        it('Patterns with Turquoise', (done: Function) => {
            accumulation.loaded = (args: IAccLoadedEventArgs) => {
                accumulation.loaded = null;
                expect(document.getElementsByTagName('svg')[0].querySelectorAll('pattern').length).toBe(8);
                expect(document.getElementsByTagName('svg')[0].querySelectorAll('pattern')[1].id === 'Turquoise_Selection_0').toBe(true);
                done();
            };

            accumulation.selectionPattern = 'Turquoise';
            accumulation.refresh();
        });
        it('Patterns with Star', (done: Function) => {
            accumulation.loaded = (args: IAccLoadedEventArgs) => {
                accumulation.loaded = null;
                expect(document.getElementsByTagName('svg')[0].querySelectorAll('pattern').length).toBe(8);
                expect(document.getElementsByTagName('svg')[0].querySelectorAll('pattern')[0].id === 'Star_Selection_0').toBe(true);
                done();
            };

            accumulation.selectionPattern = 'Star';
            accumulation.refresh();
        });
        it('Patterns with Triangle', (done: Function) => {
            accumulation.loaded = (args: IAccLoadedEventArgs) => {
                accumulation.loaded = null;
                expect(document.getElementsByTagName('svg')[0].querySelectorAll('pattern').length).toBe(8);
                expect(document.getElementsByTagName('svg')[0].querySelectorAll('pattern')[2].id === 'Triangle_Selection_0').toBe(true);
                done();
            };

            accumulation.selectionPattern = 'Triangle';
            accumulation.refresh();
        });
        it('Patterns with Chessboard', (done: Function) => {
            accumulation.loaded = (args: IAccLoadedEventArgs) => {
                accumulation.loaded = null;
                expect(document.getElementsByTagName('svg')[0].querySelectorAll('pattern').length).toBe(8);
                expect(document.getElementsByTagName('svg')[0].querySelectorAll('pattern')[2].id === 'Chessboard_Selection_0').toBe(true);
                done();
            };

            accumulation.selectionPattern = 'Chessboard';
            accumulation.refresh();
        });
        it('Patterns with Circle', (done: Function) => {
            accumulation.loaded = (args: IAccLoadedEventArgs) => {
                accumulation.loaded = null;
                expect(document.getElementsByTagName('svg')[0].querySelectorAll('pattern').length).toBe(8);
                expect(document.getElementsByTagName('svg')[0].querySelectorAll('pattern')[0].id === 'Circle_Selection_0').toBe(true);
                done();
            };

            accumulation.selectionPattern = 'Circle';
            accumulation.refresh();
        });
        it('Patterns with Tile', (done: Function) => {
            accumulation.loaded = (args: IAccLoadedEventArgs) => {
                expect(document.getElementsByTagName('svg')[0].querySelectorAll('pattern').length).toBe(8);
                expect(document.getElementsByTagName('svg')[0].querySelectorAll('pattern')[0].id === 'Tile_Selection_0').toBe(true);
                done();
            };

            accumulation.selectionPattern = 'Tile';
            accumulation.refresh();
        });
        it('Patterns with HorizontalDash', (done: Function) => {
            accumulation.loaded = (args: IAccLoadedEventArgs) => {
                accumulation.loaded = null;
                expect(document.getElementsByTagName('svg')[0].querySelectorAll('pattern').length).toBe(8);
                expect(document.getElementsByTagName('svg')[0].querySelectorAll('pattern')[0].id === 'HorizontalDash_Selection_0').toBe(true);
                done();
            };

            accumulation.selectionPattern = 'HorizontalDash';
            accumulation.refresh();
        });
        it('Patterns with VerticalDash', (done: Function) => {
            accumulation.loaded = (args: IAccLoadedEventArgs) => {
                accumulation.loaded = null;
                expect(document.getElementsByTagName('svg')[0].querySelectorAll('pattern').length).toBe(8);
                expect(document.getElementsByTagName('svg')[0].querySelectorAll('pattern')[0].id === 'VerticalDash_Selection_0').toBe(true);
                done();
            };
            accumulation.selectionPattern = 'VerticalDash';
            accumulation.selectionMode = 'Point';
            accumulation.isMultiSelect = true;
            accumulation.refresh();
        });
        it('Patterns with Rectangle', (done: Function) => {
            accumulation.loaded = (args: IAccLoadedEventArgs) => {
                accumulation.loaded = null;
                expect(document.getElementsByTagName('svg')[0].querySelectorAll('pattern').length).toBe(8);
                expect(document.getElementsByTagName('svg')[0].querySelectorAll('pattern')[0].id === 'Rectangle_Selection_0').toBe(true);
                done();
            };

            accumulation.selectionPattern = 'Rectangle';
            accumulation.isMultiSelect = false;
            accumulation.refresh();
        });
        it('Patterns with Box', (done: Function) => {
            accumulation.loaded = (args: IAccLoadedEventArgs) => {
                accumulation.loaded = null;
                expect(document.getElementsByTagName('svg')[0].querySelectorAll('pattern').length).toBe(8);
                expect(document.getElementsByTagName('svg')[0].querySelectorAll('pattern')[0].id === 'Box_Selection_0').toBe(true);
                done();
            };

            accumulation.selectionPattern = 'Box';
            accumulation.refresh();
        });
        it('Patterns with VerticalStripe', (done: Function) => {
            accumulation.loaded = (args: IAccLoadedEventArgs) => {
                accumulation.loaded = null;
                expect(document.getElementsByTagName('svg')[0].querySelectorAll('pattern').length).toBe(8);
                expect(document.getElementsByTagName('svg')[0].querySelectorAll('pattern')[0].id === 'VerticalStripe_Selection_0').toBe(true);
                done();
            };

            accumulation.selectionPattern = 'VerticalStripe';
            accumulation.refresh();
        });
        it('Patterns with Bubble', (done: Function) => {
            accumulation.loaded = (args: IAccLoadedEventArgs) => {
                accumulation.loaded = null;
                expect(document.getElementsByTagName('svg')[0].querySelectorAll('pattern').length).toBe(8);
                expect(document.getElementsByTagName('svg')[0].querySelectorAll('pattern')[0].id === 'Bubble_Selection_0').toBe(true);
                done();
            };

            accumulation.selectionPattern = 'Bubble';
            accumulation.refresh();
        });
        it('Patterns with HorizontalStripe', (done: Function) => {
            accumulation.loaded = (args: IAccLoadedEventArgs) => {
                accumulation.loaded = null;
                expect(document.getElementsByTagName('svg')[0].querySelectorAll('pattern').length).toBe(8);
                expect(document.getElementsByTagName('svg')[0].querySelectorAll('pattern')[0].id === 'HorizontalStripe_Selection_0').toBe(true);
                done();
            };

            accumulation.selectionPattern = 'HorizontalStripe';
            accumulation.refresh();
        });
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