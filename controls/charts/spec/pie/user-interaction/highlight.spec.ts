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
 import { AccumulationHighlight } from '../../../src/accumulation-chart/user-interaction/high-light';
 import { categoryData1 } from '../../chart/base/data.spec';
 import { MouseEvents } from '../../chart/base/events.spec';
 import { SliceOption } from '../base/util.spec';
 import { IAccLoadedEventArgs } from '../../../src/accumulation-chart/model/pie-interface';
 import '../../../node_modules/es6-promise/dist/es6-promise';
 import { profile, inMB, getMemoryProfile } from '../../common.spec';
 import { AccumulationTooltip } from '../../../src/accumulation-chart/user-interaction/tooltip';
 import { Indexes } from '../../../src/common/model/base';
 AccumulationChart.Inject(PieSeries, AccumulationLegend, AccumulationDataLabel, AccumulationHighlight, AccumulationSelection, AccumulationTooltip);
 
 describe('Accumulation Chart Control', () => {
     beforeAll(() => {
         const isDef = (o: any) => o !== undefined && o !== null;
         if (!isDef(window.performance)) {
             console.log("Unsupported environment, window.performance.memory is unavailable");
             this.skip(); //Skips test (in Chai)
             return;
         }
     });
     describe('Highlight', () => {
         let ele: HTMLElement;
         let slice: HTMLElement;
         let loaded: EmitType<IAccLoadedEventArgs>;
         let id: string = 'pie'; let pieGroupId: string = id + 'SeriesGroup0';
         let sliceid: string = id + '_Series_0' + '_Point_';
         let slicepath: SliceOption;
         let legendG: Element;
         let element: Element;
         let highlight: string = id + '_ej2_chart_highlight_series_';
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
             accumulation.accumulationHighlightModule.destroy();
             accumulation.destroy();
             removeElement(id);
         });
         it('Doughnut - Hightlight Mode Point', (done: Function) => {
             accumulation.loaded = (args: IAccLoadedEventArgs) => {
                 element = document.getElementById('pie_Series_0_Point_3');
                 trigger.mousemoveEvent(element, 0, 0, 200, 200);
                 element = document.getElementById('pie_Series_0_Point_1');
                trigger.mousemoveEvent(element, 0, 0, 200, 200);
                element = document.getElementById('pie_Series_0_Point_6');
                trigger.mousemoveEvent(element, 0, 0, 200, 200);
                 expect(document.getElementsByClassName(highlight + '0' +'_point_6').length === 4).toBe(true);
                 done();
             };
             accumulation.highlightMode = 'Point';
             accumulation.highlightPattern = 'Dots';
             accumulation.refresh();
         });
         it('Patterns with Dots', (done: Function) => {
            accumulation.loaded = (args: IAccLoadedEventArgs) => {
                accumulation.loaded = null;
                element = document.getElementById('pie_Series_0_Point_0');
                trigger.mousemoveEvent(element, 0, 0, 200, 200);
               expect(document.getElementById(id +'_svg').querySelectorAll('pattern').length).toBe(8);
                expect(document.getElementById(id +'_svg').querySelectorAll('pattern')[0].id === 'pie_Dots_Selection_0').toBe(true);
                done();
            };
            accumulation.highlightPattern = 'Dots';
            accumulation.refresh();
         });
         it('Patterns with DiagonalForward', (done: Function) => {
            accumulation.loaded = (args: IAccLoadedEventArgs) => {
                accumulation.loaded = null;
                element = document.getElementById('pie_Series_0_Point_0');
                trigger.mousemoveEvent(element, 0, 0, 200, 200);
               expect(document.getElementById(id +'_svg').querySelectorAll('pattern').length).toBe(8);
                expect(document.getElementById(id +'_svg').querySelectorAll('pattern')[0].id === 'pie_DiagonalForward_Selection_0').toBe(true);
                done();
            };
            accumulation.highlightPattern = 'DiagonalForward';
            accumulation.refresh();
         });
         it('Patterns with Crosshatch', (done: Function) => {
            accumulation.loaded = (args: IAccLoadedEventArgs) => {
                accumulation.loaded = null;
               expect(document.getElementById(id +'_svg').querySelectorAll('pattern').length).toBe(8);
                expect(document.getElementById(id +'_svg').querySelectorAll('pattern')[0].id === 'pie_Crosshatch_Selection_0').toBe(true);
                done();
            };
            accumulation.highlightPattern = 'Crosshatch';
            accumulation.refresh();
        });
        it('Patterns with Pacman', (done: Function) => {
            accumulation.loaded = (args: IAccLoadedEventArgs) => {
                accumulation.loaded = null;
               expect(document.getElementById(id +'_svg').querySelectorAll('pattern').length).toBe(8);
                expect(document.getElementById(id +'_svg').querySelectorAll('pattern')[0].id === 'pie_Pacman_Selection_0').toBe(true);
                done();
            };
            accumulation.highlightPattern = 'Pacman';
            accumulation.refresh();
        });
        it('Patterns with DiagonalBackward', (done: Function) => {
            accumulation.loaded = (args: IAccLoadedEventArgs) => {
                accumulation.loaded = null;
               expect(document.getElementById(id +'_svg').querySelectorAll('pattern').length).toBe(8);
                expect(document.getElementById(id +'_svg').querySelectorAll('pattern')[0].id === 'pie_DiagonalBackward_Selection_0').toBe(true);
                done();
            };
            accumulation.highlightPattern = 'DiagonalBackward';
            accumulation.refresh();
        });
        it('Patterns with Grid', (done: Function) => {
            accumulation.loaded = (args: IAccLoadedEventArgs) => {
                accumulation.loaded = null;
               expect(document.getElementById(id +'_svg').querySelectorAll('pattern').length).toBe(8);
                expect(document.getElementById(id +'_svg').querySelectorAll('pattern')[0].id === 'pie_Grid_Selection_0').toBe(true);
                done();
            };
            accumulation.highlightPattern = 'Grid';
            accumulation.refresh();
        });
        it('Patterns with Turquoise', (done: Function) => {
            accumulation.loaded = (args: IAccLoadedEventArgs) => {
                accumulation.loaded = null;
               expect(document.getElementById(id +'_svg').querySelectorAll('pattern').length).toBe(8);
                expect(document.getElementById(id +'_svg').querySelectorAll('pattern')[1].id === 'pie_Turquoise_Selection_1').toBe(true);
                done();
            };
            accumulation.highlightPattern = 'Turquoise';
            accumulation.refresh();
        });
        it('Patterns with Star', (done: Function) => {
            accumulation.loaded = (args: IAccLoadedEventArgs) => {
                accumulation.loaded = null;
               expect(document.getElementById(id +'_svg').querySelectorAll('pattern').length).toBe(8);
                expect(document.getElementById(id +'_svg').querySelectorAll('pattern')[0].id === 'pie_Star_Selection_0').toBe(true);
                done();
            };
            accumulation.highlightPattern = 'Star';
            accumulation.refresh();
        });
        it('Patterns with Triangle', (done: Function) => {
            accumulation.loaded = (args: IAccLoadedEventArgs) => {
                accumulation.loaded = null;
               expect(document.getElementById(id +'_svg').querySelectorAll('pattern').length).toBe(8);
                expect(document.getElementById(id +'_svg').querySelectorAll('pattern')[2].id === 'pie_Triangle_Selection_2').toBe(true);
                done();
            };
            accumulation.highlightPattern = 'Triangle';
            accumulation.refresh();
        });
        it('Patterns with Chessboard', (done: Function) => {
            accumulation.loaded = (args: IAccLoadedEventArgs) => {
                accumulation.loaded = null;
               expect(document.getElementById(id +'_svg').querySelectorAll('pattern').length).toBe(8);
                expect(document.getElementById(id +'_svg').querySelectorAll('pattern')[2].id === 'pie_Chessboard_Selection_2').toBe(true);
                done();
            };
            accumulation.highlightPattern = 'Chessboard';
            accumulation.refresh();
        });
        it('Patterns with Circle', (done: Function) => {
            accumulation.loaded = (args: IAccLoadedEventArgs) => {
                accumulation.loaded = null;
               expect(document.getElementById(id +'_svg').querySelectorAll('pattern').length).toBe(8);
                expect(document.getElementById(id +'_svg').querySelectorAll('pattern')[0].id === 'pie_Circle_Selection_0').toBe(true);
                done();
            };
            accumulation.highlightPattern = 'Circle';
            accumulation.refresh();
        });
        it('Patterns with Tile', (done: Function) => {
            accumulation.loaded = (args: IAccLoadedEventArgs) => {
               expect(document.getElementById(id +'_svg').querySelectorAll('pattern').length).toBe(8);
                expect(document.getElementById(id +'_svg').querySelectorAll('pattern')[0].id === 'pie_Tile_Selection_0').toBe(true);
                done();
            };
            accumulation.highlightPattern = 'Tile';
            accumulation.refresh();
        });
        it('Patterns with HorizontalDash', (done: Function) => {
            accumulation.loaded = (args: IAccLoadedEventArgs) => {
                accumulation.loaded = null;
               expect(document.getElementById(id +'_svg').querySelectorAll('pattern').length).toBe(8);
                expect(document.getElementById(id +'_svg').querySelectorAll('pattern')[0].id === 'pie_HorizontalDash_Selection_0').toBe(true);
                done();
            };
            accumulation.highlightPattern = 'HorizontalDash';
            accumulation.refresh();
        });
        it('Patterns with VerticalDash', (done: Function) => {
            accumulation.loaded = (args: IAccLoadedEventArgs) => {
                accumulation.loaded = null;
               expect(document.getElementById(id +'_svg').querySelectorAll('pattern').length).toBe(8);
                expect(document.getElementById(id +'_svg').querySelectorAll('pattern')[0].id === 'pie_VerticalDash_Selection_0').toBe(true);
                done();
            };
            accumulation.highlightPattern = 'VerticalDash';
            accumulation.highlightMode = 'Point';
            accumulation.isMultiSelect = true;
            accumulation.refresh();
        });
        it('Patterns with Rectangle', (done: Function) => {
            accumulation.loaded = (args: IAccLoadedEventArgs) => {
                accumulation.loaded = null;
               expect(document.getElementById(id +'_svg').querySelectorAll('pattern').length).toBe(8);
                expect(document.getElementById(id +'_svg').querySelectorAll('pattern')[0].id === 'pie_Rectangle_Selection_0').toBe(true);
                done();
            };
            accumulation.highlightPattern = 'Rectangle';
            accumulation.isMultiSelect = false;
            accumulation.refresh();
        });
        it('Patterns with Box', (done: Function) => {
            accumulation.loaded = (args: IAccLoadedEventArgs) => {
                accumulation.loaded = null;
               expect(document.getElementById(id +'_svg').querySelectorAll('pattern').length).toBe(8);
                expect(document.getElementById(id +'_svg').querySelectorAll('pattern')[0].id === 'pie_Box_Selection_0').toBe(true);
                done();
            };
            accumulation.highlightPattern = 'Box';
            accumulation.refresh();
        });
        it('Patterns with VerticalStripe', (done: Function) => {
            accumulation.loaded = (args: IAccLoadedEventArgs) => {
                accumulation.loaded = null;
               expect(document.getElementById(id +'_svg').querySelectorAll('pattern').length).toBe(8);
                expect(document.getElementById(id +'_svg').querySelectorAll('pattern')[0].id === 'pie_VerticalStripe_Selection_0').toBe(true);
                done();
            };
            accumulation.highlightPattern = 'VerticalStripe';
            accumulation.refresh();
        });
        it('Patterns with Bubble', (done: Function) => {
            accumulation.loaded = (args: IAccLoadedEventArgs) => {
                accumulation.loaded = null;
               expect(document.getElementById(id +'_svg').querySelectorAll('pattern').length).toBe(8);
                expect(document.getElementById(id +'_svg').querySelectorAll('pattern')[0].id === 'pie_Bubble_Selection_0').toBe(true);
                done();
            };
            accumulation.highlightPattern = 'Bubble';
            accumulation.refresh();
        });
        it('Patterns with HorizontalStripe', (done: Function) => {
            accumulation.loaded = (args: IAccLoadedEventArgs) => {
                accumulation.loaded = null;
               expect(document.getElementById(id +'_svg').querySelectorAll('pattern').length).toBe(8);
                expect(document.getElementById(id +'_svg').querySelectorAll('pattern')[0].id === 'pie_HorizontalStripe_Selection_0').toBe(true);
                done();
            };

            accumulation.highlightPattern = 'HorizontalStripe';
            accumulation.refresh();
        });
         it('Doughnut - highlighted in mousemove over Legend', (done: Function) => {
            accumulation.loaded = (args: IAccLoadedEventArgs) => {
                accumulation.loaded = null;
                element = document.getElementById('pie_chart_legend_shape_1');
                trigger.mousemoveEvent(element, 0, 0, 200, 200);
                expect(document.getElementsByClassName(highlight + '0'+'_point_1').length === 3).toBe(true);
                done();
            };
            accumulation.legendSettings.toggleVisibility = false;
            accumulation.selectedDataIndexes = [];
            accumulation.accumulationHighlightModule.selectedDataIndexes = [];
            accumulation.refresh();
         });
         it('Doughnut - Set selectionstyle property', (done: Function) => {
            accumulation.loaded = (args: IAccLoadedEventArgs) => {
                element = document.getElementById('pie_Series_0_Point_3');
                trigger.mousemoveEvent(element, 0, 0, 200, 200);
                expect(element.getAttribute('class') === 'highlight').toBe(true);
                element = document.getElementById('pie_chart_legend_shape_3');
                expect(element.getAttribute('class') === 'highlight').toBe(true);
                done();
            };
            accumulation.series[0].selectionStyle = 'highlight';
            accumulation.refresh();
         });
         it('Doughnut - point highlight while hover the correspoding Datalabel ', (done: Function) => {
            accumulation.loaded = (args: IAccLoadedEventArgs) => {
                element = document.getElementById('pie_datalabel_Series_0_text_0');
                trigger.mousemoveEvent(element, 0, 0, 200, 200);
                expect(document.getElementsByClassName(highlight + '0'+'_point_0').length === 3).toBe(true);
                done();
            };
            accumulation.highlightMode = 'Point';
            accumulation.series[0].selectionStyle = null;
            //accumulation.accumulationHighlightModule.selectedDataIndexes = [];
            accumulation.refresh();
         });
         it('Pie - Checking whether single point is highlighted', (done: Function) => {
            accumulation.loaded = (args: IAccLoadedEventArgs) => {
                element = document.getElementById('pie_Series_0_Point_3');
                trigger.mousemoveEvent(element, 0, 0, 200, 200);
                element = document.getElementById('pie_Series_0_Point_1');
                trigger.mousemoveEvent(element, 0, 0, 200, 200);
                element = document.getElementById('pie_Series_0_Point_6');
                trigger.mousemoveEvent(element, 0, 0, 200, 200);
                expect(document.getElementsByClassName(highlight + '0'+'_point_6').length === 4).toBe(true);
                done();
            };
            accumulation.series[0].innerRadius = '0%';
            accumulation.accumulationHighlightModule.selectedDataIndexes = [];
            accumulation.refresh();
         });         
         it('Pie - Set selectionstyle property', (done: Function) => {
            accumulation.loaded = (args: IAccLoadedEventArgs) => {
                element = document.getElementById('pie_Series_0_Point_3');
                trigger.mousemoveEvent(element, 0, 0, 200, 200);
                expect(element.getAttribute('class') === 'highlight').toBe(true);
                element = document.getElementById('pie_chart_legend_shape_3');
                expect(element.getAttribute('class') === 'highlight').toBe(true);
                done();
            };
            accumulation.series[0].selectionStyle = 'highlight';
            accumulation.tooltip.enable = true;
            accumulation.refresh();
         });
         it('Pie - highlighted in mousemove over Legend', (done: Function) => {
            accumulation.loaded = (args: IAccLoadedEventArgs) => {
                accumulation.loaded = null;
                element = document.getElementById('pie_chart_legend_shape_1');
                trigger.mousemoveEvent(element, 0, 0, 200, 200);
                expect(element.getAttribute('class') === 'highlight').toBe(true);
                done();
            };
            accumulation.legendSettings.toggleVisibility = false;
            accumulation.selectedDataIndexes = [];
            accumulation.accumulationHighlightModule.selectedDataIndexes = [];
            accumulation.tooltip.enable = false;
            accumulation.refresh();
         });
         it('Pie - point highlight while hover the correspoding Datalabel ', (done: Function) => {
            accumulation.loaded = (args: IAccLoadedEventArgs) => {
                element = document.getElementById('pie_datalabel_Series_0_text_0');
                trigger.mousemoveEvent(element, 0, 0, 200, 200);
                expect(document.getElementsByClassName(highlight + '0'+'_point_0').length === 3).toBe(true);
                done();
            };
            accumulation.highlightMode = 'Point';
            accumulation.series[0].selectionStyle = null;
            accumulation.accumulationHighlightModule.selectedDataIndexes = [];
            accumulation.refresh();
         }); 
         it('Pie - point checking highlighted data index ', (done: Function) => {
             accumulation.loaded = (args: IAccLoadedEventArgs) => {
                 args.accumulation.accumulationHighlightModule.highlightDataIndexes = [{ series: 0, point: 1 }] as Indexes[];
                 args.accumulation.accumulationHighlightModule.redrawSelection(args.accumulation);
                 expect(document.getElementsByClassName('pie') !== null).toBe(true);
                 done();
             };
             accumulation.highlightMode = 'Point';
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
        });
    });