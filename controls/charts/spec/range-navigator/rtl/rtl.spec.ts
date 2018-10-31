import { RangeNavigator } from '../../../src/range-navigator/index';
import { Logarithmic, DateTime, LineSeries, AreaSeries } from '../../../src/chart/index';
import { createElement, remove } from '@syncfusion/ej2-base';
import { MouseEvents } from '../../../spec/chart/base/events.spec';
import { IChangedEventArgs } from '../../../src/range-navigator/model/range-navigator-interface';
RangeNavigator.Inject(Logarithmic, DateTime, LineSeries, AreaSeries);

let value: number = 0;
let point: Object;
let data: Object[] = [];
let args: IChangedEventArgs;
let trigger: MouseEvents = new MouseEvents();
let dateTime: Object[] = [];
let isDrag: boolean;

dateTime = [{ x: new Date(2000, 3), y: 34 }, { x: new Date(2000, 6), y: 32 },
{ x: new Date(2000, 11), y: 23 }, { x: new Date(2001, 3), y: 12 },
{ x: new Date(2001, 6), y: 83 }, { x: new Date(2001, 11), y: 76 },
{ x: new Date(2002, 3), y: 34 }, { x: new Date(2002, 6), y: 32 },
{ x: new Date(2002, 11), y: 65 }, { x: new Date(2003, 3), y: 98 },
{ x: new Date(2003, 6), y: 10 }, { x: new Date(2003, 11), y: 34 }];
for (let j: number = 0; j < 100; j++) {
    value += (Math.random() * 10);
    point = { x: j, y: value };
    data.push(point);
}

/**
 * Spec for range navigator
 */
describe('Range navigator', () => {
    describe('RTL with numeric axis', () => {
        let element: Element;
        let range: RangeNavigator;
        let rangeElement: HTMLElement = createElement('div', { id: 'container' });
        let axisLabel: Element;
        beforeAll(() => {
            document.body.appendChild(rangeElement);
            range = new RangeNavigator({
                series: [{
                    dataSource: [{ x: 10, y: 20 }, { x: 20, y: 12 }, { x: 30, y: 22 }, { x: 40, y: 16 }],
                    xName: 'x', yName: 'y', type: 'Line'
                }],
                enableRtl: false
            });
            range.appendTo('#container');
        });
        afterAll((): void => {
            range.destroy();
            rangeElement.remove();
        })
        it('checking with axis labels numeric', (done: Function) => {
            range.loaded = (args: Object): void => {
                element = document.getElementById('container_AxisLabel_0');
                let element1: HTMLElement = document.getElementById('container_AxisLabel_2');
                expect((element.getAttribute('x')) > (element1.getAttribute('x'))).toBe(true);
                done();
            };
            range.series = [{ dataSource: data, xName: 'x', yName: 'y', type: 'Line' }];
            range.minimum = 10;
            range.maximum = 50;
            range.enableRtl = true;
            range.refresh();
        });
        it('checking with area series animation', (done: Function) => {
            range.loaded = (args: Object): void => {
                element = document.getElementById('container_Series_0');
                expect(element.getAttribute('fill')).toEqual('#00bdae');
                done();
            };
            range.series[0].type = 'Area';
            range.series[0].dataSource = data;
            range.series[0].animation.enable = true;
            range.refresh();
        });
        it('checking with left slider', (done: Function) => {
            range.loaded = (args: Object): void => {
                element = document.getElementById('container_LeftSlider');
                // tslint:disable-next-line:chai-vague-errors
                expect(element.childNodes.length === 4).toBe(true);
                // tslint:disable-next-line:chai-vague-errors
                expect(element.getAttribute('d') !== '').toBe(true);
                done();
            };
            range.navigatorStyleSettings.thumb.border.color = 'green';
            range.navigatorStyleSettings.thumb.border.width = 3;
            range.minimum = 10;
            range.maximum = 50;
            range.refresh();
        });
        it('checking with right slider', (done: Function) => {
            range.loaded = (args: Object): void => {
                element = document.getElementById('container_RightSlider');
                expect(element.childNodes.length).toEqual(4);
                // tslint:disable-next-line:chai-vague-errors
                expect(element.getAttribute('d') !== '').toBe(true);
                done();
            };
            range.navigatorStyleSettings.thumb.border.color = 'green';
            range.navigatorStyleSettings.thumb.border.width = 3;
            range.minimum = 10;
            range.maximum = 50;
            range.refresh();
        });
        it('checking with rtl slider mouse event', (done: Function) => {
            range.loaded = (args: Object): void => {
                let targetElement: Element = document.getElementById('container_RightSlider_ThumpSymbol');
                // tslint:disable-next-line:align
                range.rangeOnMouseDown(<PointerEvent>trigger.onTouchStart(targetElement, 608, 189, null, null, 504, 289));
                range.mouseMove(<PointerEvent>trigger.onTouchMove(targetElement, 728, 389, null, null, 404, 189));
                range.mouseEnd(<PointerEvent>trigger.onTouchEnd(targetElement, 728, 389, null, null, 404, 189));
                let thumbTransform: string = document.getElementById('container_RightSlider').getAttribute('transform');
                let leftthumbTransform: string = document.getElementById('container_LeftSlider').getAttribute('transform'); 
                expect(thumbTransform === 'translate(386.00000000000006, 0)' || thumbTransform === 'translate(381, 0)' ||
                       thumbTransform === 'translate(386, 0)' || thumbTransform === 'translate(385.99999999999994, 0)').toBe(true);
                expect(targetElement != null).toBe(true);
                done();
            };
            range.enableRtl = true;
            // tslint:disable-next-line:align
            range.refresh();
        });
    });
    describe('RTL with date time axis', () => {
        let element: Element;
        let element1: Element;
        let range: RangeNavigator;
        let rangeElement: Element = createElement('div', { id: 'container' });
        let axisLabel: Element;
        beforeAll(() => {
            document.body.appendChild(rangeElement);
            range = new RangeNavigator({
                series: [{
                    dataSource: dateTime,
                    xName: 'x', yName: 'y', type: 'Line'
                }],
                enableRtl: false
            });
            range.appendTo('#container');
        });
        afterAll((): void => {
            range.destroy();
            rangeElement.remove();
        });
        it('checking with date time axis', (done: Function) => {
            range.loaded = (args: Object): void => {
                element = document.getElementById('container_AxisLabel_3');
                expect(element.firstChild.textContent === 'Quarter1' || element.firstChild.textContent === 'Q1 2001').toBe(true);
                // tslint:disable-next-line:chai-vague-errors
                expect(element.getAttribute('opacity') === '1').toBe(true);
                done();
            };
            range.valueType = 'DateTime';
            range.series[0].dataSource = dateTime;
            range.enableRtl = true;
            range.refresh();
        });
        it('checking with date time axis grouping label', (done: Function) => {
            range.loaded = (args: Object): void => {
                element1 = document.getElementById('container_SecondaryLabel_0');
                element = document.getElementById('container_SecondaryLabel_2');
                expect(element.getAttribute('x') < element1.getAttribute('x')).toBe(true);
                done();
            };
            range.valueType = 'DateTime';
            range.series[0].dataSource = dateTime;
            range.enableGrouping = true;
            range.enableRtl = true;
            range.refresh();
        });
        it('checking with rtl label position inside', (done: Function) => {
            range.loaded = (args: Object): void => {
                element1 = document.getElementById('container_AxisLabel_1');
                element = document.getElementById('container_SecondaryLabel_2');
                let targetElement: Element = document.getElementById('container_LeftSlider_ThumpSymbol')
                range.rangeOnMouseDown(<PointerEvent>trigger.onTouchStart(targetElement, 720, 180, null, null, 504, 280));
                //range.rangeOnMouseMove(<PointerEvent>trigger.onTouchStart(targetElement, 590, 89, null, null, 404, 189));
                expect(element.getAttribute('y') < element1.getAttribute('y')).toBe(true);
                done();
            };
            range.valueType = 'DateTime';
            range.series[0].dataSource = dateTime;
            range.navigatorStyleSettings.selectedRegionColor = 'red';
            range.labelPosition = 'Inside';
            range.enableGrouping = true;
            range.refresh();
        });
        it('checking with First level labels ', (done: Function) => {
             range.loaded = (args: Object): void => {
                element1 = document.getElementById('container_AxisLabel_1');
                element = document.getElementById('container_AxisLabel_2');
                range.rangeOnMouseDown(<PointerEvent>trigger.onTouchStart(element, 434, 105, null, null, 470, 120));
                //range.rangeOnMouseUp(<PointerEvent>trigger.onTouchStart(element, 434, 105, null, null, 470, 120));
                expect(element.getAttribute('x') < element1.getAttribute('x')).toBe(true);
                done();
            };
             range.series[0].dataSource = dateTime;
            // tslint:disable-next-line:align
            range.navigatorStyleSettings.selectedRegionColor = 'blue';
            range.enableGrouping = true;
            range.refresh();
        });
        it('checking with secondary level labels ', (done: Function) => {
             range.loaded = (args: Object): void => {
                element1 = document.getElementById('container_SecondaryLabel_0');
                element = document.getElementById('container_SecondaryLabel_2');
                range.rangeOnMouseDown(<PointerEvent>trigger.onTouchStart(element, 434, 105, null, null, 470, 120));
                //range.rangeOnMouseUp(<PointerEvent>trigger.onTouchStart(element, 434, 105, null, null, 470, 120));
                expect(element.getAttribute('x') < element1.getAttribute('x')).toBe(true);
                done();
            };
            // tslint:disable-next-line:align
            range.series[0].dataSource = dateTime;
            range.navigatorStyleSettings.selectedRegionColor = 'blue';
            range.enableGrouping = true;
            range.refresh();
        });
    });
});