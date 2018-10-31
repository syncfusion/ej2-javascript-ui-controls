/**
 * Sparkline datalabel checking spec
 */
import { Sparkline, ISparklineLoadedEventArgs } from '../../src/sparkline/index';
import { removeElement, getIdElement, Rect } from '../../src/sparkline/utils/helper';
import { createElement, isNullOrUndefined } from '@syncfusion/ej2-base';
export interface Label {
    x?: number;
    y?: number;
    fill?: string;
    text?: string;
    ['font-size']?: number;
    ['font-style']?: string;
    ['font-family']?: string;
    ['font-weight']?: string;
    ['text-anchor']?: string;
    ['dominant-baseline']?: string;
}
export let getRect: Function = (ele: Element): Rect => {
    let d: string[] = ele.getAttribute('d').split(' ');
    let x: number = parseInt(d[1], 10);
    let y: number = parseInt(d[2], 10);
    let width: number = parseInt(d[9], 10) - x;
    let height: number = parseInt(d[18], 10) - y;
    return new Rect(x, y, width, height);
};
export function getLabelOptions(datalabel: Element): Label {
    return {
        x: parseInt(datalabel.getAttribute('x'), 10),
        y: parseInt(datalabel.getAttribute('y'), 10),
        fill: datalabel.getAttribute('fill'),
        ['font-size']: parseInt(datalabel.getAttribute('font-size'), 10),
        ['font-style']: datalabel.getAttribute('font-style'),
        ['font-family']: datalabel.getAttribute('font-family'),
        ['font-weight']: datalabel.getAttribute('font-weight'),
        ['text-anchor']: datalabel.getAttribute('text-anchor'),
        ['dominant-baseline']: datalabel.getAttribute('dominant-baseline'),
        text: datalabel.textContent
    };
}
describe('Sparkline ', () => {
    let element: Element;
    let sparkline: Sparkline;
    let id: string = 'spark-container';
    let ele: Element;
    let d: string[];
    let options: Label;
    describe('datalabel spec', () => {
        beforeAll(() => {
            element = createElement('div', { id: id });
            (element as HTMLDivElement).style.width = '400px';
            (element as HTMLDivElement).style.height = '100px';
            document.body.appendChild(element);
            sparkline = new Sparkline({
                height: '200',
                width: '600',
                dataLabelSettings: {
                    visible: ['All']
                },
                dataSource: [
                    { xDate: new Date(1994, 1, 1), x: 0, xval: 'January', yval: 527 },
                    { xDate: new Date(1994, 1, 2), x: 1, xval: 'February', yval: 312 },
                    { xDate: new Date(1994, 1, 3), x: 2, xval: 'March', yval: 313 },
                    { xDate: new Date(1994, 1, 4), x: 3, xval: 'April', yval: 423 },
                    { xDate: new Date(1994, 1, 5), x: 4, xval: 'May', yval: 648 },
                    { xDate: new Date(1994, 1, 6), x: 5, xval: 'June', yval: 785 },
                    { xDate: new Date(1994, 1, 7), x: 6, xval: 'July', yval: 423 },
                    { xDate: new Date(1994, 1, 8), x: 7, xval: 'August', yval: 234 },
                ], yName: 'yval', xName: 'x'
            });
        });
        afterAll(() => {
            sparkline.destroy();
            removeElement(id);
        });
        it('Sparkline datalabel checking', () => {
            sparkline.loaded = (args: ISparklineLoadedEventArgs) => {
                sparkline.loaded = () => { /* null function */ };
                ele = getIdElement(id + '_sparkline_label_text_1');
                options = getLabelOptions(ele);
                expect(options.text).toBe('312');
                expect(options.fill).toBe('#424242');
                expect(options.x).toBe(89);
                // first test case local and second for server value
                expect(options.y === 157 || options.y === 159).toBe(true);
                expect(options['font-size']).toBe(14);
                expect(options['font-family']).toBe('Roboto, Segoe UI, Noto, Sans-serif');
                expect(options['font-style']).toBe('Medium');
                expect(options['font-weight']).toBe('Medium');
                expect(options['text-anchor']).toBe('middle');
                expect(options['dominant-baseline']).toBe('middle');
            };
            sparkline.appendTo('#' + id);
        });
        it('Sparkline datalabel index 0 checking', () => {
            ele = getIdElement(id + '_sparkline_label_text_0');
            options = getLabelOptions(ele);
            expect(options.text).toBe('527');
            expect(options.x).toBe(5);
            // first test case local and second for server value
            expect(options.y === 83 || options.y === 85).toBe(true);
        });
        it('Sparkline datalabel index 2 checking', () => {
            ele = getIdElement(id + '_sparkline_label_text_2');
            options = getLabelOptions(ele);
            expect(options.text).toBe('313');
            expect(options.x).toBe(174);
            expect(options.y === 157 || options.y === 159).toBe(true);
        });
        it('Sparkline datalabel index 3 checking', () => {
            ele = getIdElement(id + '_sparkline_label_text_3');
            options = getLabelOptions(ele);
            expect(options.text).toBe('423');
            expect(options.x).toBe(258);
            // first test case local and second for server value
            expect(options.y === 121 || options.y === 119).toBe(true);
        });
        it('Sparkline datalabel index 4 checking', () => {
            ele = getIdElement(id + '_sparkline_label_text_4');
            options = getLabelOptions(ele);
            expect(options.text).toBe('648');
            expect(options.x).toBe(342);
            // first test case local and second for server value
            expect(options.y === 43 || options.y === 41).toBe(true);
        });
        it('Sparkline datalabel index 5 checking', () => {
            ele = getIdElement(id + '_sparkline_label_text_5');
            options = getLabelOptions(ele);
            expect(options.text).toBe('785');
            expect(options.x).toBe(426);
            // first test case local and second for server value
            expect(options.y === -5 || options.y === -4).toBe(true);
        });
        it('Sparkline datalabel index 6 checking', () => {
            ele = getIdElement(id + '_sparkline_label_text_6');
            options = getLabelOptions(ele);
            expect(options.text).toBe('423');
            expect(options.x).toBe(511);
            expect(options.y === 121 || options.y === 119).toBe(true);
        });
        it('Sparkline datalabel index 7 checking', () => {
            ele = getIdElement(id + '_sparkline_label_text_7');
            options = getLabelOptions(ele);
            expect(options.text).toBe('234');
            expect(options.x).toBe(595);
            // first test case local and second for server value
            expect(options.y === 184 || options.y === 186).toBe(true);
        });
        it('Sparkline datalabel visible mode start first point with offset checking', () => {
            sparkline.dataLabelSettings.visible = ['Start'];
            sparkline.dataLabelSettings.offset.x = 20;
            sparkline.dataLabelSettings.offset.y = 10;
            sparkline.dataBind();
            ele = getIdElement(id + '_sparkline_label_text_0');
            options = getLabelOptions(ele);
            expect(options.text).toBe('527');
            expect(options.x).toBe(25);
            // first test case local and second for server value
            expect(options.y === 93 || options.y === 95).toBe(true);
        });
        it('Sparkline datalabel visible mode start other points not visible checking', () => {
            ele = getIdElement(id + '_sparkline_label_text_1');
            expect(isNullOrUndefined(ele)).toBe(true);
            ele = getIdElement(id + '_sparkline_label_text_2');
            expect(isNullOrUndefined(ele)).toBe(true);
            ele = getIdElement(id + '_sparkline_label_text_3');
            expect(isNullOrUndefined(ele)).toBe(true);
            ele = getIdElement(id + '_sparkline_label_text_4');
            expect(isNullOrUndefined(ele)).toBe(true);
            ele = getIdElement(id + '_sparkline_label_text_5');
            expect(isNullOrUndefined(ele)).toBe(true);
            ele = getIdElement(id + '_sparkline_label_text_6');
            expect(isNullOrUndefined(ele)).toBe(true);
            ele = getIdElement(id + '_sparkline_label_text_7');
            expect(isNullOrUndefined(ele)).toBe(true);
        });
        it('Sparkline datalabel visible mode end last point with offset checking', () => {
            sparkline.dataLabelSettings.visible = ['End'];
            sparkline.dataLabelSettings.offset.x = -20;
            sparkline.dataLabelSettings.offset.y = 10;
            sparkline.dataBind();
            ele = getIdElement(id + '_sparkline_label_text_7');
            options = getLabelOptions(ele);
            expect(options.text).toBe('234');
            expect(options.x).toBe(575);
            // first test case local and second for server value
            expect(options.y === 194 || options.y === 196).toBe(true);
        });
        it('Sparkline datalabel visible mode end other points not visible checking', () => {
            ele = getIdElement(id + '_sparkline_label_text_0');
            expect(isNullOrUndefined(ele)).toBe(true);
            ele = getIdElement(id + '_sparkline_label_text_1');
            expect(isNullOrUndefined(ele)).toBe(true);
            ele = getIdElement(id + '_sparkline_label_text_2');
            expect(isNullOrUndefined(ele)).toBe(true);
            ele = getIdElement(id + '_sparkline_label_text_3');
            expect(isNullOrUndefined(ele)).toBe(true);
            ele = getIdElement(id + '_sparkline_label_text_4');
            expect(isNullOrUndefined(ele)).toBe(true);
            ele = getIdElement(id + '_sparkline_label_text_5');
            expect(isNullOrUndefined(ele)).toBe(true);
            ele = getIdElement(id + '_sparkline_label_text_6');
            expect(isNullOrUndefined(ele)).toBe(true);
        });
        it('Sparkline datalabel visible mode High max point with offset checking', () => {
            sparkline.dataLabelSettings.visible = ['High'];
            sparkline.dataLabelSettings.offset.x = 0;
            sparkline.dataLabelSettings.offset.y = 60;
            sparkline.dataBind();
            ele = getIdElement(id + '_sparkline_label_text_5');
            options = getLabelOptions(ele);
            expect(options.text).toBe('785');
            expect(options.x).toBe(426);
            // first test case local and second for server value
            expect(options.y === 54 || options.y === 56).toBe(true);
        });
        it('Sparkline datalabel visible mode high other points not visible checking', () => {
            ele = getIdElement(id + '_sparkline_label_text_0');
            expect(isNullOrUndefined(ele)).toBe(true);
            ele = getIdElement(id + '_sparkline_label_text_1');
            expect(isNullOrUndefined(ele)).toBe(true);
            ele = getIdElement(id + '_sparkline_label_text_2');
            expect(isNullOrUndefined(ele)).toBe(true);
            ele = getIdElement(id + '_sparkline_label_text_3');
            expect(isNullOrUndefined(ele)).toBe(true);
            ele = getIdElement(id + '_sparkline_label_text_4');
            expect(isNullOrUndefined(ele)).toBe(true);
            ele = getIdElement(id + '_sparkline_label_text_6');
            expect(isNullOrUndefined(ele)).toBe(true);
            ele = getIdElement(id + '_sparkline_label_text_7');
            expect(isNullOrUndefined(ele)).toBe(true);
        });
        it('Sparkline datalabel visible mode Low min point with offset checking', () => {
            sparkline.dataLabelSettings.visible = ['Low'];
            sparkline.dataLabelSettings.offset.x = 0;
            sparkline.dataLabelSettings.offset.y = 0;
            sparkline.dataBind();
            ele = getIdElement(id + '_sparkline_label_text_7');
            options = getLabelOptions(ele);
            expect(options.text).toBe('234');
            expect(options.x).toBe(595);
            expect(options.y === 184 || options.y === 186).toBe(true);
        });
        it('Sparkline datalabel visible mode low other points not visible checking', () => {
            ele = getIdElement(id + '_sparkline_label_text_0');
            expect(isNullOrUndefined(ele)).toBe(true);
            ele = getIdElement(id + '_sparkline_label_text_1');
            expect(isNullOrUndefined(ele)).toBe(true);
            ele = getIdElement(id + '_sparkline_label_text_2');
            expect(isNullOrUndefined(ele)).toBe(true);
            ele = getIdElement(id + '_sparkline_label_text_3');
            expect(isNullOrUndefined(ele)).toBe(true);
            ele = getIdElement(id + '_sparkline_label_text_4');
            expect(isNullOrUndefined(ele)).toBe(true);
            ele = getIdElement(id + '_sparkline_label_text_5');
            expect(isNullOrUndefined(ele)).toBe(true);
            ele = getIdElement(id + '_sparkline_label_text_6');
            expect(isNullOrUndefined(ele)).toBe(true);
        });
        it('Sparkline datalabel visible mode Negative minus points checking', () => {
            sparkline.dataLabelSettings.visible = ['Negative'];
            sparkline.dataLabelSettings.offset.y = -20;
            sparkline.dataSource = [
                { xDate: new Date(1994, 1, 1), x: 0, xval: 'January', yval: 527 },
                { xDate: new Date(1994, 1, 2), x: 1, xval: 'February', yval: 312 },
                { xDate: new Date(1994, 1, 3), x: 2, xval: 'March', yval: -313 },
                { xDate: new Date(1994, 1, 4), x: 3, xval: 'April', yval: 423 },
                { xDate: new Date(1994, 1, 5), x: 4, xval: 'May', yval: -648 },
                { xDate: new Date(1994, 1, 6), x: 5, xval: 'June', yval: 785 },
                { xDate: new Date(1994, 1, 7), x: 6, xval: 'July', yval: -423 },
                { xDate: new Date(1994, 1, 8), x: 7, xval: 'August', yval: 234 },
            ];
            sparkline.dataBind();
            ele = getIdElement(id + '_sparkline_label_text_2');
            options = getLabelOptions(ele);
            expect(options.text).toBe('-313');
            expect(options.x).toBe(174);
            // first test case local and second for server value
            expect(options.y === 141 || options.y === 140).toBe(true);
            ele = getIdElement(id + '_sparkline_label_text_4');
            options = getLabelOptions(ele);
            expect(options.text).toBe('-648');
            expect(options.x).toBe(342);
            // first test case local and second for server value
            expect(options.y === 185 || options.y === 184).toBe(true);
            ele = getIdElement(id + '_sparkline_label_text_6');
            options = getLabelOptions(ele);
            expect(options.text).toBe('-423');
            expect(options.x).toBe(511);
            // first test case local and second for server value
            expect(options.y === 155 || options.y === 154).toBe(true);
        });
        it('Sparkline datalabel visible mode Negative other points not visible checking', () => {
            ele = getIdElement(id + '_sparkline_label_text_0');
            expect(isNullOrUndefined(ele)).toBe(true);
            ele = getIdElement(id + '_sparkline_label_text_1');
            expect(isNullOrUndefined(ele)).toBe(true);
            ele = getIdElement(id + '_sparkline_label_text_3');
            expect(isNullOrUndefined(ele)).toBe(true);
            ele = getIdElement(id + '_sparkline_label_text_5');
            expect(isNullOrUndefined(ele)).toBe(true);
            ele = getIdElement(id + '_sparkline_label_text_7');
            expect(isNullOrUndefined(ele)).toBe(true);
        });
        it('Sparkline datalabel customization and format checking', () => {
            sparkline.dataLabelSettings.visible = ['All'];
            sparkline.dataLabelSettings.offset.y = 60;
            sparkline.dataLabelSettings.format = '${xval} : ${yval}';
            sparkline.dataLabelSettings.border = {
                color: 'green', width: 2
            };
            sparkline.dataLabelSettings.fill = 'green';
            sparkline.dataLabelSettings.opacity = 0.4;
            sparkline.dataLabelSettings.textStyle = {
                size: '10px', opacity: 1, color: '#999797de', fontFamily: 'fantasy', fontStyle: 'Bold', fontWeight: '100'
            };
            sparkline.dataBind();
            ele = getIdElement(id + '_sparkline_label_text_5');
            options = getLabelOptions(ele);
            expect(options.text).toBe('June : 785');
            expect(options.x).toBe(426);
            expect(options.y === 56 || options.y === 57).toBe(true);
            expect(options.fill).toBe('#999797de');
            expect(options['font-size']).toBe(10);
            expect(options['font-family']).toBe('fantasy');
            expect(options['font-style']).toBe('Bold');
            expect(options['font-weight']).toBe('100');
            expect(options['text-anchor']).toBe('middle');
            expect(options['dominant-baseline']).toBe('middle');
            ele = getIdElement(id + '_sparkline_label_rect_5');
            expect(ele.getAttribute('fill')).toBe('green');
            expect(ele.getAttribute('stroke')).toBe('green');
            expect(ele.getAttribute('stroke-width')).toBe('2');
            expect(ele.getAttribute('opacity')).toBe('0.4');
            let rect: Rect = getRect(ele);
            expect(rect.x === 404 || rect.x === 403).toBe(true);
            expect(rect.y === 47 || rect.y === 48).toBe(true);
            expect(rect.width === 43 || rect.width === 45).toBe(true);
            expect(rect.height === 16 || rect.height === 15).toBe(true);
        });
        it('Sparkline datalabel color for theme highcontrast checking', () => {
            sparkline.theme = 'Highcontrast';
            sparkline.dataLabelSettings.textStyle.color = null;
            sparkline.dataBind();
            ele = getIdElement(id + '_sparkline_label_text_5');
            options = getLabelOptions(ele);
            expect(options.text).toBe('June : 785');
            expect(options.x).toBe(426);
            expect(options.y === 56 || options.y === 57).toBe(true);
            expect(options.fill).toBe('#FFFFFF');
            expect(options['font-size']).toBe(10);
            expect(options['font-family']).toBe('fantasy');
            expect(options['font-style']).toBe('Bold');
            expect(options['font-weight']).toBe('100');
            expect(options['text-anchor']).toBe('middle');
            expect(options['dominant-baseline']).toBe('middle');
        });
    });
    describe('Sparkline ', () => {
        beforeAll(() => {
            element = createElement('div', { id: id });
            (element as HTMLDivElement).style.width = '400px';
            (element as HTMLDivElement).style.height = '100px';
            document.body.appendChild(element);
            sparkline = new Sparkline({
                height: '200',
                width: '600',
                type: 'Line',
                dataLabelSettings: {
                    visible: ['All'],
                    edgeLabelMode: 'None',
                    format: '${yval} pts',
                    fill: '#fff',
                    border: { color: 'red', width: 1 },
                },
                valueType: 'DateTime',
                dataSource: [
                    { xDate: new Date(1994, 1, 1), x: 0, xval: 'January', yval: 527 },
                    { xDate: new Date(1994, 1, 2), x: 1, xval: 'February', yval: 312 },
                    { xDate: new Date(1994, 1, 3), x: 2, xval: 'March', yval: 313 },
                    { xDate: new Date(1994, 1, 4), x: 3, xval: 'April', yval: 423 },
                    { xDate: new Date(1994, 1, 5), x: 4, xval: 'May', yval: 648 },
                    { xDate: new Date(1994, 1, 6), x: 5, xval: 'June', yval: 785 },
                    { xDate: new Date(1994, 1, 7), x: 6, xval: 'July', yval: 423 },
                    { xDate: new Date(1994, 1, 8), x: 7, xval: 'August', yval: 234 },
                ], yName: 'yval', xName: 'xDate'
            });
        });
        afterAll(() => {
            sparkline.destroy();
            removeElement(id);
        });
        it('Sparkline edge datalabel checking for None', () => {
            sparkline.loaded = (args: ISparklineLoadedEventArgs) => {
                ele = getIdElement(id + '_sparkline_label_text_0');
                options = getLabelOptions(ele);
                expect(options.text).toBe('527 pts');
                expect(options.x).toBe(5);
                expect(options.y === 81 || options.y === 83).toBe(true);
                ele = getIdElement(id + '_sparkline_label_text_7');
                options = getLabelOptions(ele);
                expect(options.text).toBe('234 pts');
                expect(options.x).toBe(595);
                expect(options.y === 182 || options.y === 184).toBe(true);
            };
            sparkline.appendTo('#' + id);
        });
        it('Sparkline edge datalabel checking for Shift', () => {
            sparkline.dataLabelSettings.edgeLabelMode = 'Shift';
            sparkline.dataBind();
            ele = getIdElement(id + '_sparkline_label_text_0');
            options = getLabelOptions(ele);
            expect(options.text).toBe('527 pts');
            expect(options.x === 28 || options.x === 30).toBe(true);
            expect(options.y === 81 || options.y === 83).toBe(true);
            ele = getIdElement(id + '_sparkline_label_text_7');
            options = getLabelOptions(ele);
            expect(options.text).toBe('234 pts');
            expect(options.x === 571 || options.x === 570).toBe(true);
            expect(options.y === 182 || options.y === 184).toBe(true);
        });
        it('Sparkline edge datalabel checking for Hide', () => {
            sparkline.dataLabelSettings.edgeLabelMode = 'Hide';
            sparkline.dataBind();
            ele = getIdElement(id + '_sparkline_label_text_0');
            expect(ele).toBeNull();
            ele = getIdElement(id + '_sparkline_label_text_7');
            expect(ele).toBeNull();
        });
    });
});