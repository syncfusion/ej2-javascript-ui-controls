/**
 * AccumulationChart On Property change Spec file
 */
import { createElement, EmitType } from '@syncfusion/ej2-base';
import { DataManager, Query } from '@syncfusion/ej2-data';
import {
    AccumulationChart, removeElement, IAccLoadedEventArgs, AccumulationLegend, AccumulationDataLabel,
    AccumulationSelection, AccumulationTooltip, AccumulationAnnotation, Rect, getElement
} from '../../../src/index';
import { piedata} from '../../chart/base/data.spec';
import { MouseEvents} from '../../chart/base/events.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';
AccumulationChart.Inject(AccumulationLegend, AccumulationSelection, AccumulationTooltip, AccumulationAnnotation,
                         AccumulationDataLabel);
describe('accumulation on-property-change checking on', () => {
    let element: Element;
    let loaded: EmitType<IAccLoadedEventArgs>;
    let svgObject: Element;
    let text: Element;
    let id: string = 'acc-chart';
    let accumulation: AccumulationChart;
    let dataManager: DataManager = new DataManager({
        url: 'http://mvc.syncfusion.com/Services/Northwnd.svc/Tasks/'
    });
    let query: Query = new Query().take(5).where('Estimate', 'greaterThan', 0, false);
    let trigger: MouseEvents = new MouseEvents();
    let colors: string[] = ['blue', 'green', 'orange', 'purple', 'yellow', 'red'];
    beforeAll((): void => {
        element = createElement('div', { id: id });
        document.body.appendChild(element);
        accumulation = new AccumulationChart({
            title: 'Accumulation',
            enableSmartLabels: false,
            series: [
                {
                    type: 'Pie', palettes: colors,
                    dataLabel: { visible: false, name: 'text' },
                    dataSource: piedata.slice(0, 5), animation: { enable: false }, xName: 'x', yName: 'y'
                }
            ], width: '600', height: '400', legendSettings: { visible: false}
        });
    });

    afterAll((): void => {
        accumulation.destroy();
        removeElement(id);
    });
    it('Point checking on loaded event', (done: Function) => {
        accumulation.loaded = (args: Object): void => {
            expect(accumulation.visibleSeries[0].points.length).toBe(5);
            expect(accumulation.visibleSeries[0].points[0].color).toBe('blue');
            done();
        };
        accumulation.appendTo('#' + id);
    });
    it('Title change checking', (done: Function) => {
        accumulation.title = '';
        accumulation.loaded = null;
        let clipRect: Rect = accumulation.initialClipRect;
        accumulation.dataBind();
        expect(accumulation.initialClipRect).not.toBe(clipRect);
        done();
    });
    it('height, width, margin change checking', (done: Function) => {
        accumulation.height = '500';
        accumulation.width = '500';
        accumulation.margin.left = accumulation.margin.right = accumulation.margin.top = accumulation.margin.bottom = 5;
        expect(accumulation.initialClipRect.x).not.toBe(5);
        expect(accumulation.initialClipRect.y).not.toBe(5);
        expect(accumulation.initialClipRect.height).not.toBe(490);
        expect(accumulation.initialClipRect.width).not.toBe(490);
        accumulation.dataBind();
        expect(accumulation.initialClipRect.x).toBe(5);
        expect(accumulation.initialClipRect.y).toBe(5);
        expect(accumulation.initialClipRect.height).toBe(490);
        expect(accumulation.initialClipRect.width).toBe(490);
        done();
    });
    it('background, border change checking', (done: Function) => {
        accumulation.background = 'lightgray';
        accumulation.border = { color: '#33CCFF', width: 2};
        accumulation.dataBind();
        let border: Element = getElement('acc-chart_border');
        expect(border.getAttribute('fill')).toBe('lightgray');
        expect(border.getAttribute('stroke')).toBe('#33CCFF');
        expect(border.getAttribute('stroke-width')).toBe('2');
        done();
    });
    it('dataLabel visible change checking', (done: Function) => {
        accumulation.series[0].dataLabel.visible = true;
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            accumulation.loaded = null;
            let dataLabel: Element = getElement('acc-chart_datalabel_Series_0_text_1');
            expect(dataLabel.textContent).toBe('Bison : 23');
            done();
        };
        accumulation.refresh();
    });
    it('datasource change and datalabel changed checking', (done: Function) => {
        accumulation.series[0].dataSource = piedata;
        expect(accumulation.visibleSeries[0].points.length).toBe(5);
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            accumulation.loaded = null;
            expect(accumulation.visibleSeries[0].points.length).toBe(10);
            let dataLabel: Element = getElement('acc-chart_datalabel_Series_0_text_9');
            expect(dataLabel.textContent).toBe('Beaver : 102');
            done();
        };
        accumulation.refresh();
    });
    it('enableSmartLabels change checking', (done: Function) => {
        accumulation.enableSmartLabels = true;
        let dataLabel: Element = getElement('acc-chart_datalabel_Series_0_text_0');
        let temp: number = parseInt(dataLabel.getAttribute('x'), 10);
        expect(temp === 225 || temp === 226).toBe(true);
        temp = parseInt(dataLabel.getAttribute('y'), 10);
        expect(temp === 157 || temp === 156).toBe(true);
        dataLabel = getElement('acc-chart_datalabel_Series_0_text_1');
        temp = parseInt(dataLabel.getAttribute('x'), 10);
        expect(temp === 257 || temp === 258).toBe(true);
        temp = parseInt(dataLabel.getAttribute('y'), 10);
        expect(temp === 161 || temp === 160).toBe(true);
        accumulation.dataBind();
        dataLabel = getElement('acc-chart_datalabel_Series_0_text_0');
        temp = parseInt(dataLabel.getAttribute('x'), 10);
        expect(temp === 225 || temp === 226).toBe(true);
        temp = parseInt(dataLabel.getAttribute('y'), 10);
        expect(temp === 157 || temp === 156).toBe(true);
        dataLabel = getElement('acc-chart_datalabel_Series_0_text_1');
        temp = parseInt(dataLabel.getAttribute('x'), 10);
        expect(temp === 326 || temp === 327).toBe(true);
        temp = parseInt(dataLabel.getAttribute('y'), 10);
        expect(temp === 60 || temp === 59).toBe(true);
        done();
    });
    it('Selection change checking', (done: Function) => {
        accumulation.selectedDataIndexes = [
            {
                series: 0, point: 3
            }, {
                series: 0, point: 7
            }
        ];
        accumulation.selectionMode = 'Point';
        accumulation.isMultiSelect = true;
        accumulation.dataBind();
        let slice: Element = getElement('acc-chart_Series_0_Point_3');
        expect(slice.getAttribute('class')).toBe('acc-chart_ej2_chart_selection_series_0');
        slice = getElement('acc-chart_Series_0_Point_5');
        expect(slice.getAttribute('class')).toBe('acc-chart_ej2_deselected');
        slice = getElement('acc-chart_Series_0_Point_7');
        expect(slice.getAttribute('class')).toBe('acc-chart_ej2_chart_selection_series_0');
        done();
    });
    it('Multiple Selection false change checking', (done: Function) => {
        accumulation.isMultiSelect = false;
        accumulation.dataBind();
        let slice: Element = getElement('acc-chart_Series_0_Point_3');
        expect(slice.getAttribute('class')).toBe('acc-chart_ej2_deselected');
        slice = getElement('acc-chart_Series_0_Point_7');
        expect(slice.getAttribute('class')).toBe('acc-chart_ej2_chart_selection_series_0');
        done();
    });
    it('Annotation change checking', (done: Function) => {
        accumulation.annotations = [
            {
                content: '<div>Accumulation-Annotation</div>'
            }
        ];
        accumulation.locale = 'de';
        let annotation: Element = getElement('acc-chart_Secondary_Element');
        expect(annotation.childElementCount).toBe(0);
        accumulation.dataBind();
        annotation = getElement('acc-chart_Secondary_Element');
        expect(annotation.childElementCount).toBe(1);
        annotation = getElement('acc-chart_Secondary_Element');
        expect(annotation.children[0].id).toBe('acc-chart_Annotation_Collections');
        expect(annotation.children[0].children[0].id).toBe('acc-chart_Annotation_0');
        done();
    });
    it('Legend change checking', (done: Function) => {
        accumulation.annotations = [];
        accumulation.legendSettings.visible = true;
        accumulation.legendSettings.opacity = 0.7;
        accumulation.legendSettings.background = 'white';
        expect(accumulation.initialClipRect.x).toBe(5);
        expect(accumulation.initialClipRect.y).toBe(5);
        expect(accumulation.initialClipRect.height).toBe(490);
        expect(accumulation.initialClipRect.width).toBe(490);
        accumulation.dataBind();
        expect(accumulation.initialClipRect.x).toBe(5);
        expect(accumulation.initialClipRect.y).toBe(5);
        expect(accumulation.initialClipRect.height).not.toBe(490);
        expect(accumulation.initialClipRect.width).toBe(490);
        let legend: Element = getElement('acc-chart_chart_legend_translate_g');
        expect(legend.childNodes.length).toBe(10);
        done();
    });
    it('Legend shape change checking', (done: Function) => {
        accumulation.series[0].legendShape = 'Diamond';
        let path: string = getElement('acc-chart_chart_legend_shape_0').getAttribute('d');
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            accumulation.loaded = null;
            let path1: string = getElement('acc-chart_chart_legend_shape_0').getAttribute('d');
            expect(path1).not.toBe(path);
            expect(path1.split('L').length).toBe(5);
            let legend: Element = getElement('acc-chart_chart_legend_translate_g');
            expect(legend.childNodes.length).toBe(10);
            done();
        };
        accumulation.refresh();
    });
    it('Series palettes change checking', (done: Function) => {
        accumulation.selectionMode = 'None';
        accumulation.series[0].palettes = ['skyblue', 'lightgreen', 'turquoise', 'teal', 'indigo', 'coral'];
        let slice: Element = getElement('acc-chart_Series_0_Point_3');
        expect(slice.getAttribute('fill')).toBe('purple');
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            accumulation.loaded = null;
            slice = getElement('acc-chart_Series_0_Point_3');
            expect(slice.getAttribute('fill')).toBe('teal');
            done();
        };
        accumulation.refresh();
    });
    it('Empty point data changing', (done: Function) => {
        accumulation.series[0].dataSource = [
            { x: 1, y: 15}, { x: 2, y: 25}, { x: 3, y: null}, { x: 4, y: 12}, { x: 5, y: 18},
        ];
        let slice: Element = getElement('acc-chart_Series_0_Point_2');
        expect(slice).not.toBe(null);
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            accumulation.loaded = null;
            slice = getElement('acc-chart_Series_0_Point_2');
            expect(slice.getAttribute('d')).toBe('');
            done();
        };
        accumulation.refresh();
    });
    it('Empty point mode changing', (done: Function) => {
        accumulation.series[0].emptyPointSettings.mode = 'Average';
        let slice: Element = getElement('acc-chart_Series_0_Point_2');
        expect(slice.getAttribute('d')).toBe('');
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            accumulation.loaded = null;
            slice = getElement('acc-chart_Series_0_Point_2');
            expect(slice.getAttribute('d')).not.toBe(null);
            let label: Element = getElement('acc-chart_datalabel_Series_0_text_2');
            expect(label.textContent).toBe('18.5');
            done();
        };
        accumulation.refresh();
    });
    it('Group To value changing', (done: Function) => {
        accumulation.series[0].groupTo = '15';
        let slice: Element = getElement('acc-chart_Series_0');
        expect(slice.childNodes.length).toBe(5);
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            accumulation.loaded = null;
            slice = getElement('acc-chart_Series_0');
            expect(slice.childNodes.length).toBe(4);
            let label: Element = getElement('acc-chart_datalabel_Series_0_text_3');
            expect(label.textContent).toBe('Others: 27');
            done();
        };
        accumulation.refresh();
    });


});