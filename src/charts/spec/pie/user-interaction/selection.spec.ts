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
AccumulationChart.Inject(PieSeries, AccumulationLegend, AccumulationDataLabel, AccumulationSelection);

document.body.appendChild(createElement('style', {
    innerHTML: ' .selection { stroke-width: 2; fill: lime; stroke: red; opacity: 1; } '
}));
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
                    animation: { enable: false},
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
        accumulation.accumulationSelectionModule.destroy(accumulation);
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
            expect(document.getElementsByClassName(selection + '0').length === 2).toBe(true);
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
            expect(document.getElementsByClassName(selection + '0').length === 4).toBe(true);
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
                expect(selected.length === (2 * j)).toBe(true);
            }
            selectedLength = selected.length;
            for (i = accumulation.visibleSeries[0].points.length - 1, j = 1; i > 0; i-- , j++) {
                element = document.getElementById('pie_Series_0_Point_' + i);
                trigger.clickEvent(element);
                selected = document.getElementsByClassName(selection + 0);
                expect(selected.length === selectedLength - (2 * j)).toBe(true);
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
            expect(document.getElementsByClassName(selection + '0').length === 2).toBe(true);
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
            expect(document.getElementsByClassName(selection + '0').length === 4).toBe(true);
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
                expect(selected.length === (2 * j)).toBe(true);
            }
            selectedLength = selected.length;
            for (i = accumulation.visibleSeries[0].points.length - 1, j = 1; i > 0; i-- , j++) {
                element = document.getElementById('pie_Series_0_Point_' + i);
                trigger.clickEvent(element);
                selected = document.getElementsByClassName(selection + 0);
                expect(selected.length === selectedLength - (2 * j)).toBe(true);
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
        accumulation.legendSettings.toggleVisibility = true ;
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
        accumulation.legendSettings.toggleVisibility = true ;
        accumulation.legendSettings.visible = true ;
        accumulation.refresh();
    });
});