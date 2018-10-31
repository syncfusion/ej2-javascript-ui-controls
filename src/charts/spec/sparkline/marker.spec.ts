/**
 * Sparkline marker checking spec
 */
import { Sparkline, ISparklineLoadedEventArgs } from '../../src/sparkline/index';
import { removeElement, getIdElement } from '../../src/sparkline/utils/helper';
import { createElement, isNullOrUndefined } from '@syncfusion/ej2-base';
interface Marker {
    cx?: number;
    cy?: number;
    r?: number;
    strokeWidth?: number;
    opacity?: number;
    fill?: string;
    stroke?: string;
}
function getMarkerOptions(marker: Element): Marker {
    return {
        cx: parseInt(marker.getAttribute('cx'), 10),
        cy: parseInt(marker.getAttribute('cy'), 10),
        r: parseFloat(marker.getAttribute('r')),
        strokeWidth: parseInt(marker.getAttribute('stroke-width'), 10),
        opacity: parseFloat(marker.getAttribute('opacity')),
        fill: marker.getAttribute('fill'),
        stroke: marker.getAttribute('stroke'),
    };
}
describe('Sparkline marker and special point spec', () => {
    let element: Element;
    let sparkline: Sparkline;
    let id: string = 'spark-container';
    let ele: Element;
    let d: string[];
    let options: Marker;
    beforeAll(() => {
        element = createElement('div', { id: id });
        (element as HTMLDivElement).style.width = '400px';
        (element as HTMLDivElement).style.height = '100px';
        document.body.appendChild(element);
        sparkline = new Sparkline({
            height: '200',
            width: '600',
            markerSettings: {
                visible: ['All']
            },
            dataLabelSettings: {
                visible: []
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
    it('Sparkline marker customization checking', () => {
        sparkline.loaded = (args: ISparklineLoadedEventArgs) => {
            sparkline.loaded = () => { /* null function */ };
            ele = getIdElement(id + '_sparkline_marker_1');
            options = getMarkerOptions(ele);
            expect(options.cx).toBe(89);
            expect(options.cy).toBe(168);
            expect(options.r).toBe(2.5);
            expect(options.fill).toBe('#00bdae');
            expect(options.strokeWidth).toBe(1);
            expect(options.stroke).toBe('#00bdae');
        };
        sparkline.appendTo('#' + id);
    });
    it('Sparkline marker parent element checking', () => {
        ele = getIdElement(id + '_sparkline_marker_0').parentElement;
        expect(ele.id).toBe(id + '_sparkline_marker_g');
    });
    it('Sparkline marker visible all checking', () => {
        expect(ele.childNodes.length).toBe(8);
    });
    it('Sparkline marker 1 checking', () => {
        ele = getIdElement(id + '_sparkline_marker_0');
        options = getMarkerOptions(ele);
        expect(options.cx).toBe(5);
        expect(options.cy).toBe(94);
        expect(options.r).toBe(2.5);
        expect(options.fill).toBe('#00bdae');
        expect(options.strokeWidth).toBe(1);
        expect(options.stroke).toBe('#00bdae');
    });
    it('Sparkline marker 3 checking', () => {
        ele = getIdElement(id + '_sparkline_marker_2');
        options = getMarkerOptions(ele);
        expect(options.cx).toBe(174);
        expect(options.cy).toBe(168);
        expect(options.r).toBe(2.5);
        expect(options.fill).toBe('#00bdae');
        expect(options.strokeWidth).toBe(1);
        expect(options.stroke).toBe('#00bdae');
    });
    it('Sparkline marker 4 checking', () => {
        ele = getIdElement(id + '_sparkline_marker_3');
        options = getMarkerOptions(ele);
        expect(options.cx).toBe(258);
        expect(options.cy).toBe(130);
        expect(options.r).toBe(2.5);
        expect(options.fill).toBe('#00bdae');
        expect(options.strokeWidth).toBe(1);
        expect(options.stroke).toBe('#00bdae');
    });
    it('Sparkline marker 5 checking', () => {
        ele = getIdElement(id + '_sparkline_marker_4');
        options = getMarkerOptions(ele);
        expect(options.cx).toBe(342);
        expect(options.cy).toBe(52);
        expect(options.r).toBe(2.5);
        expect(options.fill).toBe('#00bdae');
        expect(options.strokeWidth).toBe(1);
        expect(options.stroke).toBe('#00bdae');
    });
    it('Sparkline marker 6 checking', () => {
        ele = getIdElement(id + '_sparkline_marker_5');
        options = getMarkerOptions(ele);
        expect(options.cx).toBe(426);
        expect(options.cy).toBe(5);
        expect(options.r).toBe(2.5);
        expect(options.fill).toBe('#00bdae');
        expect(options.strokeWidth).toBe(1);
        expect(options.stroke).toBe('#00bdae');
    });
    it('Sparkline marker 7 checking', () => {
        ele = getIdElement(id + '_sparkline_marker_6');
        options = getMarkerOptions(ele);
        expect(options.cx).toBe(511);
        expect(options.cy).toBe(130);
        expect(options.r).toBe(2.5);
        expect(options.fill).toBe('#00bdae');
        expect(options.strokeWidth).toBe(1);
        expect(options.stroke).toBe('#00bdae');
    });
    it('Sparkline marker 8 checking', () => {
        ele = getIdElement(id + '_sparkline_marker_7');
        options = getMarkerOptions(ele);
        expect(options.cx).toBe(595);
        expect(options.cy).toBe(195);
        expect(options.r).toBe(2.5);
        expect(options.fill).toBe('#00bdae');
        expect(options.strokeWidth).toBe(1);
        expect(options.stroke).toBe('#00bdae');
    });
    it('Sparkline marker visible mode Start first point visible checking', () => {
        sparkline.markerSettings.visible = ['Start'];
        sparkline.startPointColor = '#1436cede';
        sparkline.dataBind();
        ele = getIdElement(id + '_sparkline_marker_0');
        options = getMarkerOptions(ele);
        expect(options.cx).toBe(5);
        expect(options.cy).toBe(94);
        expect(options.r).toBe(2.5);
        expect(options.fill).toBe('#1436cede');
        expect(options.strokeWidth).toBe(1);
        expect(options.stroke).toBe('#1436cede');
    });
    it('Sparkline marker visible mode Start other points not visible checking', () => {
        ele = getIdElement(id + '_sparkline_marker_1');
        expect(isNullOrUndefined(ele)).toBe(true);
        ele = getIdElement(id + '_sparkline_marker_2');
        expect(isNullOrUndefined(ele)).toBe(true);
        ele = getIdElement(id + '_sparkline_marker_3');
        expect(isNullOrUndefined(ele)).toBe(true);
        ele = getIdElement(id + '_sparkline_marker_4');
        expect(isNullOrUndefined(ele)).toBe(true);
        ele = getIdElement(id + '_sparkline_marker_5');
        expect(isNullOrUndefined(ele)).toBe(true);
        ele = getIdElement(id + '_sparkline_marker_6');
        expect(isNullOrUndefined(ele)).toBe(true);
        ele = getIdElement(id + '_sparkline_marker_7');
        expect(isNullOrUndefined(ele)).toBe(true);
    });
    it('Sparkline marker visible mode End Last point visible checking', () => {
        sparkline.markerSettings.visible = ['End'];
        sparkline.endPointColor = '#b705bdde';
        sparkline.dataBind();
        ele = getIdElement(id + '_sparkline_marker_7');
        options = getMarkerOptions(ele);
        expect(options.cx).toBe(595);
        expect(options.cy).toBe(195);
        expect(options.r).toBe(2.5);
        expect(options.fill).toBe('#b705bdde');
        expect(options.strokeWidth).toBe(1);
        expect(options.stroke).toBe('#b705bdde');
    });
    it('Sparkline marker visible mode End other points not visible checking', () => {
        ele = getIdElement(id + '_sparkline_marker_1');
        expect(isNullOrUndefined(ele)).toBe(true);
        ele = getIdElement(id + '_sparkline_marker_2');
        expect(isNullOrUndefined(ele)).toBe(true);
        ele = getIdElement(id + '_sparkline_marker_3');
        expect(isNullOrUndefined(ele)).toBe(true);
        ele = getIdElement(id + '_sparkline_marker_4');
        expect(isNullOrUndefined(ele)).toBe(true);
        ele = getIdElement(id + '_sparkline_marker_5');
        expect(isNullOrUndefined(ele)).toBe(true);
        ele = getIdElement(id + '_sparkline_marker_6');
        expect(isNullOrUndefined(ele)).toBe(true);
        ele = getIdElement(id + '_sparkline_marker_0');
        expect(isNullOrUndefined(ele)).toBe(true);
    });
    it('Sparkline marker visible mode High, high point visible checking', () => {
        sparkline.markerSettings.visible = ['High'];
        sparkline.highPointColor = '#df9d0fde';
        sparkline.dataBind();
        ele = getIdElement(id + '_sparkline_marker_5');
        options = getMarkerOptions(ele);
        expect(options.cx).toBe(426);
        expect(options.cy).toBe(5);
        expect(options.r).toBe(2.5);
        expect(options.fill).toBe('#df9d0fde');
        expect(options.strokeWidth).toBe(1);
        expect(options.stroke).toBe('#df9d0fde');
    });
    it('Sparkline marker visible mode High, other points not visible checking', () => {
        ele = getIdElement(id + '_sparkline_marker_0');
        expect(isNullOrUndefined(ele)).toBe(true);
        ele = getIdElement(id + '_sparkline_marker_1');
        expect(isNullOrUndefined(ele)).toBe(true);
        ele = getIdElement(id + '_sparkline_marker_2');
        expect(isNullOrUndefined(ele)).toBe(true);
        ele = getIdElement(id + '_sparkline_marker_3');
        expect(isNullOrUndefined(ele)).toBe(true);
        ele = getIdElement(id + '_sparkline_marker_4');
        expect(isNullOrUndefined(ele)).toBe(true);
        ele = getIdElement(id + '_sparkline_marker_6');
        expect(isNullOrUndefined(ele)).toBe(true);
        ele = getIdElement(id + '_sparkline_marker_7');
        expect(isNullOrUndefined(ele)).toBe(true);
    });
    it('Sparkline marker visible mode Low, low point visible checking', () => {
        sparkline.markerSettings.visible = ['Low'];
        sparkline.lowPointColor = '#db097cde';
        sparkline.dataBind();
        ele = getIdElement(id + '_sparkline_marker_7');
        options = getMarkerOptions(ele);
        expect(options.cx).toBe(595);
        expect(options.cy).toBe(195);
        expect(options.r).toBe(2.5);
        expect(options.fill).toBe('#db097cde');
        expect(options.strokeWidth).toBe(1);
        expect(options.stroke).toBe('#db097cde');
    });
    it('Sparkline marker visible mode Low, other points not visible checking', () => {
        ele = getIdElement(id + '_sparkline_marker_0');
        expect(isNullOrUndefined(ele)).toBe(true);
        ele = getIdElement(id + '_sparkline_marker_1');
        expect(isNullOrUndefined(ele)).toBe(true);
        ele = getIdElement(id + '_sparkline_marker_2');
        expect(isNullOrUndefined(ele)).toBe(true);
        ele = getIdElement(id + '_sparkline_marker_3');
        expect(isNullOrUndefined(ele)).toBe(true);
        ele = getIdElement(id + '_sparkline_marker_4');
        expect(isNullOrUndefined(ele)).toBe(true);
        ele = getIdElement(id + '_sparkline_marker_5');
        expect(isNullOrUndefined(ele)).toBe(true);
        ele = getIdElement(id + '_sparkline_marker_6');
        expect(isNullOrUndefined(ele)).toBe(true);
    });
    it('Sparkline marker values changed to negative and mode is Negative and checking', () => {
        sparkline.dataSource = [
            { xDate: new Date(1994, 1, 1), x: 0, xval: 'January', yval: 527 },
            { xDate: new Date(1994, 1, 2), x: 1, xval: 'February', yval: 312 },
            { xDate: new Date(1994, 1, 3), x: 2, xval: 'March', yval: 313 },
            { xDate: new Date(1994, 1, 4), x: 3, xval: 'April', yval: 423 },
            { xDate: new Date(1994, 1, 5), x: 4, xval: 'May', yval: -648 },
            { xDate: new Date(1994, 1, 6), x: 5, xval: 'June', yval: 785 },
            { xDate: new Date(1994, 1, 7), x: 6, xval: 'July', yval: -423 },
            { xDate: new Date(1994, 1, 8), x: 7, xval: 'August', yval: 234 },
        ];
        sparkline.negativePointColor = '#a52505de';
        sparkline.markerSettings.visible = ['Low', 'Negative'];
        sparkline.dataBind();
        ele = getIdElement(id + '_sparkline_marker_4');
        options = getMarkerOptions(ele);
        expect(options.cx).toBe(342);
        expect(options.cy).toBe(195);
        expect(options.r).toBe(2.5);
        expect(options.fill).toBe('#db097cde');
        expect(options.strokeWidth).toBe(1);
        expect(options.stroke).toBe('#db097cde');
        ele = getIdElement(id + '_sparkline_marker_6');
        options = getMarkerOptions(ele);
        expect(options.cx).toBe(511);
        expect(options.cy).toBe(165);
        expect(options.r).toBe(2.5);
        expect(options.fill).toBe('#a52505de');
        expect(options.strokeWidth).toBe(1);
        expect(options.stroke).toBe('#a52505de');
    });
    it('Sparkline marker with Datetime value type checking', () => {
        sparkline.dataSource = [
            { xDate: new Date(1994, 1, 1), x: 0, xval: 'January', yval: 527 },
            { xDate: new Date(1994, 1, 2), x: 1, xval: 'February', yval: 312 },
            { xDate: new Date(1994, 1, 3), x: 2, xval: 'March', yval: 313 },
            { xDate: new Date(1994, 1, 4), x: 3, xval: 'April', yval: 423 },
            { xDate: new Date(1994, 1, 5), x: 4, xval: 'May', yval: -648 },
            { xDate: new Date(1994, 1, 6), x: 5, xval: 'June', yval: 785 },
            { xDate: new Date(1994, 1, 7), x: 6, xval: 'July', yval: -423 },
            { xDate: new Date(1994, 1, 8), x: 7, xval: 'August', yval: 234 },
        ];
        sparkline.negativePointColor = null;
        sparkline.highPointColor = null;
        sparkline.lowPointColor = null;
        sparkline.startPointColor = null;
        sparkline.endPointColor = null;
        sparkline.markerSettings.visible = ['All'];
        sparkline.valueType = 'DateTime';
        sparkline.xName = 'xDate';
        sparkline.dataBind();
        ele = getIdElement(id + '_sparkline_marker_0');
        options = getMarkerOptions(ele);
        expect(options.cx).toBe(5);
        expect(options.cy).toBe(39);
        expect(options.r).toBe(2.5);
        expect(options.fill).toBe('#00bdae');
        expect(options.strokeWidth).toBe(1);
        expect(options.stroke).toBe('#00bdae');
        ele = getIdElement(id + '_sparkline_marker_1');
        expect(isNullOrUndefined(ele)).toBe(false);
        ele = getIdElement(id + '_sparkline_marker_2');
        expect(isNullOrUndefined(ele)).toBe(false);
        ele = getIdElement(id + '_sparkline_marker_3');
        expect(isNullOrUndefined(ele)).toBe(false);
        ele = getIdElement(id + '_sparkline_marker_4');
        expect(isNullOrUndefined(ele)).toBe(false);
        ele = getIdElement(id + '_sparkline_marker_5');
        expect(isNullOrUndefined(ele)).toBe(false);
        ele = getIdElement(id + '_sparkline_marker_6');
        expect(isNullOrUndefined(ele)).toBe(false);
        ele = getIdElement(id + '_sparkline_marker_7');
        expect(isNullOrUndefined(ele)).toBe(false);
    });
    it('Sparkline marker with Category value type checking', () => {
        sparkline.valueType = 'Category';
        sparkline.xName = 'xval';
        sparkline.markerSettings = {
            fill: 'green', border: {color: 'lime', width: 3}, visible: ['All'], size: 12, opacity: 0.7
        };
        sparkline.dataBind();
        ele = getIdElement(id + '_sparkline_marker_0');
        options = getMarkerOptions(ele);
        expect(options.cx).toBe(5);
        expect(options.cy).toBe(39);
        expect(options.r).toBe(6);
        expect(options.fill).toBe('green');
        expect(options.opacity).toBe(0.7);
        expect(options.strokeWidth).toBe(3);
        expect(options.stroke).toBe('lime');
        ele = getIdElement(id + '_sparkline_marker_1');
        expect(isNullOrUndefined(ele)).toBe(false);
        ele = getIdElement(id + '_sparkline_marker_2');
        expect(isNullOrUndefined(ele)).toBe(false);
        ele = getIdElement(id + '_sparkline_marker_3');
        expect(isNullOrUndefined(ele)).toBe(false);
        ele = getIdElement(id + '_sparkline_marker_4');
        expect(isNullOrUndefined(ele)).toBe(false);
        ele = getIdElement(id + '_sparkline_marker_5');
        expect(isNullOrUndefined(ele)).toBe(false);
        ele = getIdElement(id + '_sparkline_marker_6');
        expect(isNullOrUndefined(ele)).toBe(false);
        ele = getIdElement(id + '_sparkline_marker_7');
        expect(isNullOrUndefined(ele)).toBe(false);
    });
    it('Sparkline marker web accessibility checking', () => {
        ele = getIdElement(id + '_sparkline_marker_1');
        expect(ele.getAttribute('aria-label')).toBe('February : 312');
    });
});