/**
 * AccumulationChart Series Spec file
 */
import { createElement } from '@syncfusion/ej2-base';
import { EmitType } from '@syncfusion/ej2-base';
import { PieSeries } from '../../../src/accumulation-chart/renderer/pie-series';
import { AccumulationChart } from '../../../src/accumulation-chart/accumulation';
import { AccumulationLegend } from '../../../src/accumulation-chart/renderer/legend';
import { AccPoints } from '../../../src/accumulation-chart/model/acc-base';
import { getAngle, getElement, removeElement } from '../../../src/common/utils/helper';
import { AccumulationDataLabel } from '../../../src/accumulation-chart/renderer/dataLabel';
import { piedata, pieColorMapping} from '../../chart/base/data.spec';
import { getLocations, SliceOption} from '../base/util.spec';
import { MouseEvents } from '../../chart/base/events.spec';
import { IAccLoadedEventArgs } from '../../../src/accumulation-chart/model/pie-interface';
import '../../../node_modules/es6-promise/dist/es6-promise';
AccumulationChart.Inject(PieSeries, AccumulationLegend, AccumulationDataLabel);

describe('Pie Series checking', () => {
    let ele: HTMLElement;
    let slice: Element;
    let loaded: EmitType<IAccLoadedEventArgs>;
    let id: string = 'ej2container'; let pieGroupId: string = id + 'SeriesGroup0';
    let sliceid: string = id + '_Series_0' + '_Point_';
    let slicepath: SliceOption;
    let y: number;
    let i: number = 0;
    let length: number;
    let pie: AccumulationChart; let points: AccPoints[];
    let trigger: MouseEvents = new MouseEvents();
    beforeAll((): void => {
        ele = createElement('div', { id: id });
        document.body.appendChild(ele);
        pie = new AccumulationChart({
            series: [
                {
                    type: 'Pie',
                    dataLabel: { visible: false, name: 'text' },
                    dataSource: piedata, animation: { enable: false }, xName: 'x', yName: 'y'
                }
            ], width: '600', height: '400', legendSettings: { visible: false}
        });
        pie.appendTo('#' + id);
    });

    afterAll((): void => {
        pie.loaded = null;
        pie.destroy();
        removeElement(id);
    });
    it('center of the pie segments', (done: Function) => {
        pie.loaded = () => {
            slice = getElement(sliceid + 0);
            slicepath = getLocations(slice.getAttribute('d'));
            expect(slicepath.center.x).toBe(300);
            expect(slicepath.center.y).toBe(200);
            done();
        };
        pie.refresh();
    });
    it('start angle alone', (done: Function) => {
        pie.loaded = () => {
            slice = getElement(sliceid + 0);
            slicepath = getLocations(slice.getAttribute('d'));
            expect(slicepath.center.x).toBe(300);
            expect(slicepath.center.y).toBe(200);
            done();
        };
        pie.series[0].startAngle = 90;
        pie.refresh();
    });
    it('total angle is 180 then start angle is 180 then center point Y is 75%', (done: Function) => {
        pie.series[0].startAngle = 180;
        pie.series[0].endAngle = 360;
        pie.loaded = () => {
            slice = getElement(sliceid + 0);
            slicepath = getLocations(slice.getAttribute('d'));
            expect(slicepath.center.x).toBe(376);
            expect(slicepath.center.y).toBe(200);
            done();
        };
        pie.refresh();
    });
    it('total angle is 180 then start angle is 0 then center point Y is 25%', (done: Function) => {
        pie.series[0].startAngle = 0;
        pie.series[0].endAngle = 180;
        pie.loaded = () => {
            slice = getElement(sliceid + 0);
            slicepath = getLocations(slice.getAttribute('d'));
            expect(slicepath.center.x).toBe(224);
            expect(slicepath.center.y).toBe(200);
            done();
        };
        pie.refresh();
    });
    it('total angle is 180 then start angle is 90 then center point X is 75%', (done: Function) => {
        pie.series[0].startAngle = 90;
        pie.series[0].endAngle = 270;
        pie.loaded = () => {
            slice = getElement(sliceid + 0);
            slicepath = getLocations(slice.getAttribute('d'));
            expect(slicepath.center.x).toBe(300);
            expect(slicepath.center.y).toBe(124);
            done();
        };
        pie.refresh();
    });
    it('total angle is 180 then start angle is 270 then center point X is 25%', (done: Function) => {
        pie.series[0].startAngle = 270;
        pie.series[0].endAngle = 90;
        pie.loaded = () => {
            slice = getElement(sliceid + 0);
            slicepath = getLocations(slice.getAttribute('d'));
            expect(slicepath.center.x).toBe(300);
            expect(slicepath.center.y).toBe(276);
            done();
        };
        pie.refresh();
    });
    it('start and end of the pie segments', (done: Function) => {
        pie.series[0].startAngle = 0;
        pie.series[0].endAngle = 360;
        pie.loaded = () => {
            slice = getElement(sliceid + 0);
            slicepath = getLocations(slice.getAttribute('d'));
            let angle: number = getAngle(slicepath.center, slicepath.start);
            expect(angle).toBe(269.9893826806963);
            slice = getElement(sliceid + 5);
            slicepath = getLocations(slice.getAttribute('d'));
            angle = getAngle(slicepath.center, slicepath.start);
            expect(Math.round(angle)).toBe(13);
            slice = getElement(sliceid + 9);
            slicepath = getLocations(slice.getAttribute('d'));
            angle = getAngle(slicepath.center, slicepath.end);
            expect(Math.round(angle)).toBe(270);
            done();
        };
        pie.refresh();
    });
    it('start and end angle changing checking for pie segments', (done: Function) => {
        pie.series[0].startAngle = 180;
        pie.series[0].endAngle = 90;
        pie.loaded = () => {
            slice = getElement(sliceid + 0);
            slicepath = getLocations(slice.getAttribute('d'));
            let angle: number = getAngle(slicepath.center, slicepath.start);
            expect(angle).toBe(90);
            slice = getElement(sliceid + 9);
            slicepath = getLocations(slice.getAttribute('d'));
            angle = getAngle(slicepath.center, slicepath.end);
            expect(Math.round(angle)).toBe(360);
            done();
        };
        pie.refresh();
    });
    it('checking percentage value for slice', (done: Function) => {
        pie.loaded = (args: IAccLoadedEventArgs) => {
            let point1: AccPoints= args.accumulation.visibleSeries[0].points[0];
            expect(point1.percentage != null).toBe(true);
            expect(point1.percentage).toBe(3.07);
            done();
        };
        pie.refresh();
    });
    it('checking club point wiht value mode', (done: Function) => {
        pie.series[0].startAngle = 0;
        pie.series[0].endAngle = 360;
        pie.series[0].groupTo = '30';
        pie.loaded = (args: IAccLoadedEventArgs) => {
            let points: AccPoints[] = args.accumulation.visibleSeries[0].points;
            expect(points.length).toBe(8);
            done();
        };
        pie.refresh();
    });
    it('checking club point with point mode', (done: Function) => {
        pie.series[0].startAngle = 0;
        pie.series[0].endAngle = 360;
        pie.series[0].groupTo = '3';
        pie.series[0].groupMode = 'Point';
        pie.loaded = (args: IAccLoadedEventArgs) => {
            let points: AccPoints[] = args.accumulation.visibleSeries[0].points;
            expect(points.length).toBe(4);
            done();
        };
        pie.refresh();
    });
    it('checking quarter angle', (done: Function) => {
        pie.series[0].startAngle = 0;
        pie.series[0].endAngle = 90;
        pie.series[0].groupTo = '0';
        pie.series[0].groupMode = 'Value';
        pie.loaded = (args: IAccLoadedEventArgs) => {
            let points: AccPoints[] = args.accumulation.visibleSeries[0].points;
            expect(points.length).toBe(10);
            done();
        };
        pie.refresh();
    });
    it('checking quarter angle', (done: Function) => {
        pie.series[0].startAngle = 90;
        pie.series[0].endAngle = 180;
        pie.series[0].groupTo = '0';
        pie.loaded = (args: IAccLoadedEventArgs) => {
            let points: AccPoints[] = args.accumulation.visibleSeries[0].points;
            expect(points.length).toBe(10);
            done();
        };
        pie.refresh();
    });
    it('checking quarter angle', (done: Function) => {
        pie.series[0].startAngle = 180;
        pie.series[0].endAngle = 270;
        pie.series[0].groupTo = '0';
        pie.loaded = (args: IAccLoadedEventArgs) => {
            let points: AccPoints[] = args.accumulation.visibleSeries[0].points;
            expect(points.length).toBe(10);
            done();
        };
        pie.refresh();
    });
    it('checking quarter angle', (done: Function) => {
        pie.series[0].startAngle = 270;
        pie.series[0].endAngle = 360;
        pie.series[0].groupTo = '0';
        pie.loaded = (args: IAccLoadedEventArgs) => {
            let points: AccPoints[] = args.accumulation.visibleSeries[0].points;
            expect(points.length).toBe(10);
            done();
        };
        pie.refresh();
    });
    it('checking lees than quarter angle', (done: Function) => {
        pie.series[0].startAngle = 150;
        pie.series[0].endAngle = 230;
        pie.loaded = (args: IAccLoadedEventArgs) => {
            let points: AccPoints[] = args.accumulation.visibleSeries[0].points;
            expect(points.length).toBe(10);
            done();
        };
        pie.refresh();
    });
    it('checking pie bound', (done: Function) => {
        pie.series[0].startAngle = 0;
        pie.series[0].endAngle = 360;
        pie.series[0].dataLabel.visible = true;
        pie.series[0].dataLabel.position = 'Outside';
        pie.loaded = (args: IAccLoadedEventArgs) => {
            let points: AccPoints[] = args.accumulation.visibleSeries[0].points;
            expect(points.length).toBe(10);
            done();
        };
        pie.refresh();
    });
    it('checking pie explode and deexplode', (done: Function) => {
        pie.visibleSeries[0].explode = true;
        pie.visibleSeries[0].explodeIndex = 2;
        pie.loaded = (args: IAccLoadedEventArgs) => {
            slice = getElement(sliceid + 2);
            expect(slice.getAttribute('transform')).not.toBe(null);
            slice = getElement(sliceid + 0);
            trigger.clickEvent(slice);
            expect(slice.getAttribute('transform')).not.toBe(null);
            slice = getElement(sliceid + 2);
            expect(slice.getAttribute('transform')).toBe('translate(0, 0)');
            // outside placing data label click explode check
            let label: Element = getElement(id + '_datalabel_Series_0_text_2');
            trigger.clickEvent(label);
            slice = getElement(sliceid + 2);
            expect(slice.getAttribute('transform')).toBe('translate(0, 0)');
            done();
        };
        pie.enableAnimation = false;
        pie.refresh();
    });
    it('checking pie explode all', (done: Function) => {
        pie.visibleSeries[0].explodeAll = true;
        pie.loaded = (args: IAccLoadedEventArgs) => {
            slice = getElement(sliceid + 0);
            expect(slice.getAttribute('transform')).not.toBe(null);
            slice = getElement(sliceid + 2);
            expect(slice.getAttribute('transform').indexOf('translate(') > -1).toBe(true);
            slice = getElement(sliceid + 5);
            expect(slice.getAttribute('transform')).not.toBe('');
            done();
        };
        pie.refresh();
    });
    it('checking pie zero values', (done: Function) => {
        pie.visibleSeries[0].explode = false;
        pie.loaded = (args: IAccLoadedEventArgs) => {
            slice = getElement(sliceid + 1);
            expect(slice).toBe(null);
            slice = getElement(sliceid + 4);
            expect(slice).toBe(null);
            done();
        };
        pie.series[0].dataSource =  [
            { x: 'Jan', y: 0 },
            { x: 'Feb', y: 0 },
            { x: 'March', y: 0 },
            { x: 'April', y: 0 },
            { x: 'May', y: 0 },
            { x: 'June', y: 0 },
            { x: 'July', y: 0 },
        ];
        pie.refresh();
    });
    it('checking pie empty points mode zero', (done: Function) => {
        pie.visibleSeries[0].explode = false;
        pie.loaded = (args: IAccLoadedEventArgs) => {
            slice = getElement(sliceid + 1);
            expect(slice).not.toBe(null);
            slice = getElement(sliceid + 4);
            expect(slice).not.toBe(null);
            slice = getElement(sliceid + 6);
            expect(slice.getAttribute('fill')).toBe('lightgray');
            expect(getElement('ej2container_datalabel_Series_0_text_1').textContent).toBe('0');
            expect(getElement('ej2container_datalabel_Series_0_text_4').textContent).toBe('0');
            expect(getElement('ej2container_datalabel_Series_0_text_6').textContent).toBe('0');
            done();
        };
        pie.series[0].dataSource =  [
            { x: 'Jan', y: 10 },
            { x: 'Feb', y: null },
            { x: 'March', y: 30 },
            { x: 'April', y: 40 },
            { x: 'May', y: null },
            { x: 'June', y: 60 },
            { x: 'July', y: null },
        ];
        pie.series[0].groupTo = null;
        pie.series[0].emptyPointSettings = { fill : 'lightgray', mode: 'Zero' };
        pie.refresh();
    });
    it('checking pie empty points mode average', (done: Function) => {
        pie.visibleSeries[0].explode = false;
        pie.loaded = (args: IAccLoadedEventArgs) => {
            slice = getElement(sliceid + 4);
            let sliceOption: SliceOption = getLocations(slice.getAttribute('d'));
            expect(sliceOption.start.x.toFixed(0)).toBe('376');
            expect(sliceOption.start.y.toFixed(0)).toBe('332');
            slice = getElement(sliceid + 4);
            expect(slice).not.toBe(null);
            expect(getElement('ej2container_datalabel_Series_0_text_4').textContent).toBe('50');
            done();
        };
        pie.series[0].emptyPointSettings = { fill : 'lightgray', mode: 'Average' };
        pie.refresh();
    });
    it('checking pie empty points mode Drop', (done: Function) => {
        pie.visibleSeries[0].explode = false;
        pie.loaded = (args: IAccLoadedEventArgs) => {
            slice = getElement(sliceid + 3);
            let sliceOption: SliceOption = getLocations(slice.getAttribute('d'));
            expect(sliceOption.start.x.toFixed(0)).toBe('448');
            expect(sliceOption.start.y.toFixed(0)).toBe('234');
            slice = getElement(sliceid + 4);
            expect(slice.getAttribute('d')).toBe('');
            expect(getElement('ej2container_datalabel_Series_0_text_3').textContent).toBe('40');
            done();
        };
        pie.series[0].emptyPointSettings = { fill : 'lightgray', mode: 'Drop' };
        pie.refresh();
    });
    it('checking pie slice with point color mapping', (done: Function) => {
        pie.visibleSeries[0].explode = false;
        pie.loaded = (args: IAccLoadedEventArgs) => {
            slice = getElement(sliceid + 0);
            expect(slice.getAttribute('fill')).toBe('red');
            slice = getElement(sliceid + 1);
            expect(slice.getAttribute('fill')).toBe('green');
            slice = getElement(sliceid + 2);
            expect(slice.getAttribute('fill')).toBe('blue');
            done();
        };
        pie.series[0].dataSource = pieColorMapping;
        pie.series[0].pointColorMapping = 'color';
        pie.refresh();
    });
    it('checking datasource in pie', (done: Function) => {
        pie.series[0].dataSource = null;
        pie.loaded = (args: IAccLoadedEventArgs) => {
            slice = getElement(sliceid + 0);
            expect(slice.getAttribute('d') != '').toBe(true);
            done();
        };
        pie.dataSource = piedata;
        pie.dataBind();
    });

    it('checking explode for club point with value mode', (done: Function) => {
        pie.series[0].startAngle = 0;
        pie.series[0].endAngle = 360;
        pie.series[0].groupTo = '30';
        pie.series[0].explode = true;
        pie.series[0].explodeAll = false;
        pie.series[0].explodeIndex = 7;
        pie.enableAnimation = true;
        pie.loaded = (args: IAccLoadedEventArgs) => {
            setTimeout(() => {
                let points: AccPoints[] = args.accumulation.visibleSeries[0].points;
                expect(points.length).toBe(10);
                expect(points[7].text).toBe('Bald Eagle : 18');
                slice = getElement(sliceid + 7);
                expect(slice.getAttribute('transform')).not.toBe(null);
                done();
            }, 300);
        };
        pie.series[0].dataSource = piedata;
        pie.refresh();
    });
    it('checking pie point changes for club point while explode', (done: Function) => {
        pie.series[0].startAngle = 0;
        pie.series[0].endAngle = 360;
        pie.series[0].groupTo = '3';
        pie.series[0].groupMode = 'Point';
        pie.visibleSeries[0].explode = true;
        pie.visibleSeries[0].explodeAll = false;
        pie.enableAnimation = true;
        let execute: boolean = false;
        pie.loaded = (args: IAccLoadedEventArgs) => {
            if (execute === false) {
                let points: AccPoints[] = args.accumulation.visibleSeries[0].points;
                slice = getElement(sliceid + 3);
                execute = true;
                trigger.clickEvent(slice);
                let legendEle: Element = getElement('ej2container_chart_legend_text_0');
                trigger.clickEvent(legendEle);
                pie.loaded = null;
                expect(points).not.toBe(null);
                done();
            }
            let points: AccPoints[] = args.accumulation.visibleSeries[0].points;
            expect(points[3]).not.toBe(null);
        };
        pie.legendSettings.visible = true;
        pie.series[0].dataSource = piedata;
        pie.refresh();
    });
    it('checking pie point changes for club point while deExplode', (done: Function) => {
        pie.series[0].startAngle = 0;
        pie.series[0].endAngle = 360;
        pie.series[0].groupTo = '3';
        pie.series[0].groupMode = 'Point';
        pie.visibleSeries[0].explode = true;
        pie.visibleSeries[0].explodeAll = false;
        pie.enableAnimation = false;
        let execute: number = 0;
        pie.loaded = (args: IAccLoadedEventArgs) => {
            if (execute <= 1) {
                slice = getElement(sliceid + 3);
                execute = execute + 1;
                trigger.clickEvent(slice);
            }
            let points: AccPoints[] = args.accumulation.visibleSeries[0].points;
            expect(points[3]).not.toBe(null);
            done();
        };
        pie.series[0].dataSource = piedata;
        pie.refresh();
    });
});