/**
 * Sparkline Area Series Spec
 */
import {Sparkline, ISparklineLoadedEventArgs, IPointRegionEventArgs, SparklineTooltip} from '../../src/sparkline/index';
import {removeElement, getIdElement} from '../../src/sparkline/utils/helper';
import {createElement} from '@syncfusion/ej2-base';
import { MouseEvents } from './events.spec';
Sparkline.Inject(SparklineTooltip);
describe('Sparkline Area Series Spec', () => {
    let element: Element;
    let sparkline: Sparkline;
    let id: string = 'sparks';
    let ele: Element;
    let d: string[];
    beforeAll(() => {
        element = createElement('div', { id: id });
        (element as HTMLDivElement).style.width = '400px';
        (element as HTMLDivElement).style.height = '100px';
        document.body.appendChild(element);
        sparkline = new Sparkline({
            width: '400', height: '100',
            type: 'Area',
            fill: '#f0c023ef',
            border: { color: '#9b7700', width: 2},
            containerArea: {
                border: {
                    color: '#09ac09', width: 2
                },
            },
            valueType: 'DateTime',
            dataSource: [
                {date: new Date(1990, 1, 1), value: 180000},
                {date: new Date(1990, 2, 1), value: 220000},
                {date: new Date(1990, 3, 1), value: 130000},
                {date: new Date(1990, 4, 1), value: 250000},
                {date: new Date(1990, 5, 1), value: 190000},
                {date: new Date(1990, 6, 1), value: 210000},
            ], yName: 'value', xName: 'date'
        });
    });
    afterAll(() => {
        sparkline.destroy();
        removeElement(id);
    });
    it('Sparkline area path and border path checking', () => {
        sparkline.loaded = (args: ISparklineLoadedEventArgs) => {
            args.sparkline.loaded = () => { /* null function */};
            ele = getIdElement(id + '_sparkline_area');
            expect(ele.getAttribute('fill')).toBe('#f0c023ef');
            expect(ele.getAttribute('stroke')).toBe('transparent');
            expect(ele.getAttribute('stroke-width')).toBe('0');
            d = ele.getAttribute('d').split(' ');
            expect(d.length).toBe(25);
            ele = getIdElement(id + '_sparkline_area_str');
            expect(ele.getAttribute('fill')).toBe('transparent');
            expect(ele.getAttribute('stroke')).toBe('#9b7700');
            expect(ele.getAttribute('stroke-width')).toBe('2');
            d = ele.getAttribute('d').split(' ');
            expect(d.length).toBe(19);
        };
        sparkline.appendTo('#' + id);
    });
    it('Sparkline container border checking with area type series', () => {
        ele = getIdElement(id + '_SparklineBorder');
        d = ele.getAttribute('d').split(' ');
        let x: number = Number(d[1]);
        let y: number = Number(d[2]);
        let width: number = Number(d[9]) - x;
        let height: number = Number(d[18]) - y;
        expect(x).toBe(1);
        expect(y).toBe(1);
        expect(height).toBe(98);
        expect(width).toBe(398);
    });
    it('Sparkline area series path checking', () => {
        ele = getIdElement(id + '_sparkline_area');
        d = ele.getAttribute('d').split(' ');

        expect(d[0]).toBe('M');
        expect(d[1]).toBe('5');
        expect(d[2]).toBe('95');

        expect(d[3]).toBe('L');
        expect(d[4]).toBe('5');
        expect(d[5]).toBe('57');

        expect(d[6]).toBe('L');
        expect(d[7]).toBe('78');
        expect(d[8]).toBe('27');

        expect(d[9]).toBe('L');
        expect(d[10]).toBe('158');
        expect(d[11]).toBe('95');

        expect(d[12]).toBe('L');
        expect(d[13]).toBe('236');
        expect(d[14]).toBe('5');

        expect(d[15]).toBe('L');
        expect(d[16]).toBe('317');
        expect(d[17]).toBe('50');

        expect(d[18]).toBe('L');
        expect(d[19]).toBe('395');
        expect(d[20]).toBe('35');

        expect(d[21]).toBe('L');
        expect(d[22]).toBe('395');
        expect(d[23]).toBe('95');

        expect(d[24]).toBe('Z');
    });
    it('Sparkline area series stroke path checking', () => {
        ele = getIdElement(id + '_sparkline_area_str');
        d = ele.getAttribute('d').split(' ');

        expect(d[0]).toBe('M');
        expect(d[1]).toBe('5');
        expect(d[2]).toBe('57');

        expect(d[3]).toBe('L');
        expect(d[4]).toBe('78');
        expect(d[5]).toBe('27');

        expect(d[6]).toBe('L');
        expect(d[7]).toBe('158');
        expect(d[8]).toBe('95');

        expect(d[9]).toBe('L');
        expect(d[10]).toBe('236');
        expect(d[11]).toBe('5');

        expect(d[12]).toBe('L');
        expect(d[13]).toBe('317');
        expect(d[14]).toBe('50');

        expect(d[15]).toBe('L');
        expect(d[16]).toBe('395');
        expect(d[17]).toBe('35');
    });
    it('Sparkline area series axis y min value change checking', () => {
        sparkline.axisSettings.minY = 100000;
        sparkline.dataBind();
        ele = getIdElement(id + '_sparkline_area');
        d = ele.getAttribute('d').split(' ');
        expect(d[9]).toBe('L');
        expect(d[10]).toBe('158');
        expect(d[11]).toBe('77');
    });
    it('Sparkline area series axis y max value change checking', () => {
        sparkline.axisSettings.maxY = 300000;
        sparkline.dataBind();
        ele = getIdElement(id + '_sparkline_area');
        d = ele.getAttribute('d').split(' ');
        expect(d[9]).toBe('L');
        expect(d[10]).toBe('158');
        expect(d[11]).toBe('81');
    });
    it('Sparkline area series axis x max value change checking', () => {
        sparkline.axisSettings.maxX = new Date(1990, 4, 1).getTime();
        sparkline.dataBind();
        ele = getIdElement(id + '_sparkline_area');
        d = ele.getAttribute('d').split(' ');
        expect(d[9]).toBe('L');
        expect(d[13]).toBe('395');
        expect(d[14]).toBe('27');
    });
    it('Sparkline area series axis x min value change checking', () => {
        sparkline.axisSettings.minX = new Date(1990, 0, 1).getTime();
        sparkline.dataBind();
        ele = getIdElement(id + '_sparkline_area');
        d = ele.getAttribute('d').split(' ');
        expect(d[0]).toBe('M');
        expect(d[1]).toBe('106');
        expect(d[2]).toBe('95');
        expect(d[3]).toBe('L');
        expect(d[4]).toBe('106');
        expect(d[5]).toBe('59');
    });
    it('Sparkline area series axis value and line checking', () => {
        sparkline.axisSettings = {maxX: null, minY: null, maxY: null, minX: null, value: 200000};
        sparkline.axisSettings.lineSettings = {color: '#6f00af', width: 2, visible: true};
        sparkline.dataBind();
        ele = getIdElement(id + '_sparkline_area');
        d = ele.getAttribute('d').split(' ');
        expect(d[0]).toBe('M');
        expect(d[1]).toBe('5');
        expect(d[2]).toBe('42');
        expect(d[3]).toBe('L');
        expect(d[4]).toBe('5');
        expect(d[5]).toBe('57');
        ele = getIdElement(id + '_Sparkline_XAxis');
        expect(ele.getAttribute('x1')).toBe('5');
        expect(ele.getAttribute('y1')).toBe('42');
        expect(ele.getAttribute('x2')).toBe('395');
        expect(ele.getAttribute('y2')).toBe('42');
        expect(ele.getAttribute('stroke-width')).toBe('2');
        expect(ele.getAttribute('stroke')).toBe('#6f00af');
    });
    it('Sparkline area series axis value and line checking', (done: Function) => {
        sparkline.pointRegionMouseClick = (args: IPointRegionEventArgs) => {
            expect(args.pointIndex).toBe(0);
            done();
        };
        sparkline.loaded = (args: ISparklineLoadedEventArgs) => {
            ele = getIdElement(id + '_sparkline_area');
            let trigger: MouseEvents = new MouseEvents();
            trigger.mouseclickEvent(ele, 13, 60, 13, 60);
        };
        sparkline.refresh();
    });
});