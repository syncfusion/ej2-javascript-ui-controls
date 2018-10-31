import { RangeNavigator } from '../../../src/range-navigator/index';
import { Logarithmic, DateTime, LineSeries, AreaSeries, getElement, IResizeEventArgs, IResizeRangeNavigatorEventArgs } from '../../../src/chart/index';
import { createElement, remove } from '@syncfusion/ej2-base';
import { IChangedEventArgs, IRangeEventArgs } from '../../../src/range-navigator/model/range-navigator-interface';
import { MouseEvents } from '../../../spec/chart/base/events.spec';
RangeNavigator.Inject(Logarithmic, DateTime, LineSeries, AreaSeries);

let value: number = 0;
let point: Object;
let data: Object[] = [];
let args: IChangedEventArgs;
let trigger: MouseEvents = new MouseEvents();

for (let j: number = 0; j < 100; j++) {
    value += (Math.random() * 10);
    point = { x: j, y: value };
    data.push(point);
}

/**
 * Spec for range navigator
 */
describe('Range navigator', () => {
    describe('with Sliders double axis', () => {
        let element: Element;
        let targetElement: Element;
        let range: RangeNavigator;
        let rangeElement: HTMLElement = createElement('div', { id: 'container' });
        let axisLabel: Element;
        let isCheck: boolean = false;
        beforeAll(() => {
            document.body.appendChild(rangeElement);
            range = new RangeNavigator({
                series: [{
                    dataSource: [{ x: 10, y: 20 }, { x: 20, y: 12 }, { x: 30, y: 22 }, { x: 40, y: 16 }],
                    xName: 'x', yName: 'y', type: 'Line', animation: { duration: 0 }
                }],
                value: [10, 20],
                allowSnapping: false
            });
            range.appendTo('#container');
        });
        afterAll((): void => {
            range.destroy();
            rangeElement.remove();
        });
        it('checking with left slider moving', (done: Function) => {
            range.loaded = (args: object) => {
                isCheck = true;
                element = document.getElementById('container_LeftSlider');
                targetElement = <Element>element.childNodes[2];
                let transform: string = element.getAttribute('transform');
                let str1: string = transform.substring(transform.indexOf('(') + 1);
                let xValue: number = +str1.substring(0, str1.indexOf(','));
                let cx: number = +targetElement.getAttribute('cx');
                let cy: number = +targetElement.getAttribute('cy');
                let leftElement: Element = document.getElementById('container_leftUnSelectedArea');
                expect(leftElement.getAttribute('width')).toEqual('0');
                range.rangeOnMouseDown(<PointerEvent>trigger.onTouchStart(targetElement, null, null, null, null, xValue + cx, cy));
                range.mouseMove(<PointerEvent>trigger.onTouchMove(targetElement, null, null, null, null, xValue + cx + 100, cy));
                range.mouseEnd(<PointerEvent>trigger.onTouchEnd(targetElement, null, null, null, null, xValue + cx + 100, cy));
                expect(+leftElement.getAttribute('width')).not.toEqual(0);
            };
            range.changed = (args: IChangedEventArgs) => {
                if (isCheck) {
                    expect(Math.round(+args.start) >= 12 && Math.round(+args.start) < 15).toBe(true);
                    expect(Math.round(+args.end)).toEqual(20);
                    isCheck = false;
                    done();
                }
            };
            range.navigatorStyleSettings.selectedRegionColor = 'pink';
            range.enableDeferredUpdate = true;
            range.refresh();
        });
        it('checking with left slider moving enable RTL', (done: Function) => {
            range.loaded = (args: object) => {
                isCheck = true;
                element = document.getElementById('container_LeftSlider');
                targetElement = <Element>element.childNodes[2];
                let transform: string = element.getAttribute('transform');
                let str1: string = transform.substring(transform.indexOf('(') + 1);
                let xValue: number = +str1.substring(0, str1.indexOf(','));
                let cx: number = +targetElement.getAttribute('cx');
                let cy: number = +targetElement.getAttribute('cy');
                range.rangeOnMouseDown(<PointerEvent>trigger.onTouchStart(targetElement, null, null, null, null, xValue + cx, cy));
                range.mouseMove(<PointerEvent>trigger.onTouchMove(targetElement, null, null, null, null, xValue + cx + 100, cy));
                range.mouseEnd(<PointerEvent>trigger.onTouchEnd(targetElement, null, null, null, null, xValue + cx + 100, cy));
            };
            range.changed = (args: IChangedEventArgs) => {
                if (isCheck) {
                    expect(Math.floor(+args.start)).toEqual(10);
                    expect(Math.ceil(+args.end)).toEqual(20);
                    isCheck = false;
                    done();
                }
            };
            range.enableRtl = true;
            range.refresh();
        });
        it('checking with left slider ', (done: Function) => {
            range.loaded = (args: object) => {
                isCheck = true;
                element = document.getElementById('container_LeftSlider');
                targetElement = <Element>element.childNodes[2];
                let transform: string = element.getAttribute('transform');
                let str1: string = transform.substring(transform.indexOf('(') + 1);
                let xValue: number = +str1.substring(0, str1.indexOf(','));
                let cx: number = +targetElement.getAttribute('cx');
                let cy: number = +targetElement.getAttribute('cy');
                range.rangeOnMouseDown(<PointerEvent>trigger.onTouchStart(targetElement, null, null, null, null, xValue + cx, cy));
                range.mouseMove(<PointerEvent>trigger.onTouchMove(targetElement, null, null, null, null, xValue + 100, cy));
                range.mouseEnd(<PointerEvent>trigger.onTouchEnd(targetElement, null, null, null, null, xValue + 120, cy));
            };
            range.changed = (args: IChangedEventArgs) => {
                if (isCheck) {
                    expect(Math.floor(+args.start)).toEqual(10);
                    expect(Math.ceil(+args.end)).toEqual(20);
                    let leftElement: Element = document.getElementById('container_leftUnSelectedArea');
                    expect((+leftElement.getAttribute('width')) > 100).toBe(true);
                    isCheck = false;
                    done();
                }
            };
            range.navigatorStyleSettings.selectedRegionColor = null;
            range.theme = 'Fabric';
            range.refresh();
        });
        it('checking with left slider position less than startX', (done: Function) => {
            range.loaded = (args: object) => {
                isCheck = true;
                element = document.getElementById('container_LeftSlider');
                targetElement = <Element>element.childNodes[2];
                let transform: string = element.getAttribute('transform');
                let str1: string = transform.substring(transform.indexOf('(') + 1);
                let xValue: number = +str1.substring(0, str1.indexOf(','));
                let cx: number = +targetElement.getAttribute('cx');
                let cy: number = +targetElement.getAttribute('cy');
                let leftElement: Element = document.getElementById('container_leftUnSelectedArea');
                expect(leftElement.getAttribute('width')).not.toEqual('0');
                range.rangeOnMouseDown(<PointerEvent>trigger.onTouchStart(targetElement, null, null, null, null, xValue - 500, cy));
                range.mouseMove(<PointerEvent>trigger.onTouchMove(targetElement, null, null, null, null, xValue - 500, cy));
                range.mouseEnd(<PointerEvent>trigger.onTouchEnd(targetElement, null, null, null, null, xValue - 500, cy));
            };
            range.changed = (args: IChangedEventArgs) => {
                if (isCheck) {
                    expect(Math.floor(+args.start)).toEqual(20);
                    expect(Math.ceil(+args.end) > 20 && Math.ceil(+args.end) < 35).toBe(true);
                    expect(getElement('container_Series_0').getAttribute('stroke')).toBe('#a16ee5');
                    isCheck = false;
                    done();
                }
            };
            range.theme = 'Bootstrap';
            range.refresh();
        });
        it('checking with right slider moving out side of selected area', (done: Function) => {
            range.loaded = (args: object) => {
                isCheck = true;
                element = document.getElementById('container_RightSlider');
                targetElement = <Element>element.childNodes[2];
                let transform: string = element.getAttribute('transform');
                let str1: string = transform.substring(transform.indexOf('(') + 1);
                let xValue: number = +str1.substring(0, str1.indexOf(','));
                let cx: number = +targetElement.getAttribute('cx');
                let cy: number = +targetElement.getAttribute('cy');
                range.rangeOnMouseDown(<PointerEvent>trigger.onTouchStart(targetElement, null, null, null, null, xValue + cx, cy));
                range.mouseMove(<PointerEvent>trigger.onTouchMove(targetElement, null, null, null, null, xValue + cx + 100, cy));
                range.mouseEnd(<PointerEvent>trigger.onTouchEnd(targetElement, null, null, null, null, xValue + cx + 100, cy));
            };
            range.changed = (args: IChangedEventArgs) => {
                if (isCheck) {
                    expect(getElement('container_RightSlider_ThumpSymbol').getAttribute('fill')).toBe('#BFBFBF');
                    expect(Math.floor(+args.start)).toEqual(20);
                    expect(Math.ceil(+args.end) > 22 && Math.ceil(+args.end) < 38).toBe(true);
                    isCheck = false;
                    done();
                }
            };
            range.enableRtl = false;
            range.theme = 'Highcontrast';
            range.refresh();
        });
        it('checking with right slider moving in side of selected area', (done: Function) => {
            range.loaded = (args: object) => {
                isCheck = true;
                element = document.getElementById('container_RightSlider');
                targetElement = <Element>element.childNodes[2];
                range.rangeOnMouseDown(<PointerEvent>trigger.onTouchStart(targetElement, null, null, null, null, 200, 20));
                range.mouseMove(<PointerEvent>trigger.onTouchMove(targetElement, null, null, null, null, 100, 20));
                range.mouseEnd(<PointerEvent>trigger.onTouchEnd(targetElement, null, null, null, null, 400, 20));
            };
            range.changed = (args: IChangedEventArgs) => {
                if (isCheck) {
                    expect(Math.floor(+args.start) > 10 && Math.floor(+args.start) < 15).toBe(true);
                    expect(Math.ceil(+args.end)).toEqual(20);
                    isCheck = false;
                }
                done();
            };
            range.navigatorStyleSettings.selectedRegionColor = 'pink';
            range.refresh();
        });
        it('checking with label click', (done: Function) => {
            range.loaded = (args: Object): void => {
                isCheck = true;
                let element: Element = <Element>document.getElementById('container_AxisLabels').firstChild.firstChild;
                let pageX: number = +element.getAttribute('x');
                let pageY: number = +element.getAttribute('y');
                range.rangeOnMouseDown(<PointerEvent>trigger.onTouchStart(element, null, null, null, null, pageX, pageY));
                range.mouseMove(<PointerEvent>trigger.onTouchEnd(element, null, null, null, null, 0, pageY));
                range.mouseEnd(<PointerEvent>trigger.onTouchEnd(element, null, null, null, null, 0, pageY));
            };
            range.changed = (args: IChangedEventArgs) => {
                if (isCheck) {
                    expect(Math.ceil(+args.start) > 11 && Math.ceil(+args.start) < 30).toBe(true);
                    isCheck = false;
                }
                done();
            };
            range.animationDuration = 0;
            range.navigatorStyleSettings.selectedRegionColor = 'green';
            range.refresh();
        });
    });
    describe('with Sliders double axis', () => {
        let element: Element;
        let targetElement: Element;
        let range: RangeNavigator;
        let rangeElement: HTMLElement = createElement('div', { id: 'container' });
        let axisLabel: Element;
        let isCheck: boolean = false;
        beforeAll(() => {
            document.body.appendChild(rangeElement);
            range = new RangeNavigator({
                series: [{
                    dataSource: [{ x: new Date(2000, 0), y: 20 }, { x: new Date(2000, 5), y: 12 },
                    { x: new Date(2001, 0), y: 22 }, { x: new Date(2001, 7), y: 16 }],
                    xName: 'x', yName: 'y', type: 'Line', animation: { duration: 0 }
                }],
                value: [new Date(2000, 1), new Date(2001, 5)],
                allowSnapping: false,
                enableDeferredUpdate: true,
                valueType: 'DateTime'
            });
            range.appendTo('#container');
        });
        afterAll((): void => {
            range.destroy();
            rangeElement.remove();
        });
        it('checking with  first level label click', (done: Function) => {
            range.loaded = (args: Object): void => {
                isCheck = true;
                let element: Element = <Element>document.getElementById('container_AxisLabels').firstChild.childNodes[1];
                let pageX: number = +element.getAttribute('x');
                let pageY: number = +element.getAttribute('y');
                range.rangeOnMouseDown(<PointerEvent>trigger.onTouchStart(element, null, null, null, null, pageX, pageY));
                range.mouseEnd(<PointerEvent>trigger.onTouchEnd(element, null, null, null, null, pageX, pageY));
            };
            range.changed = (args: IChangedEventArgs) => {
                if (isCheck) {
                    expect(new Date(+args.start).getDate()).toEqual(1);
                    expect(new Date(+args.end).getDate()).toEqual(1);
                    isCheck = false;
                    done()
                };
            };
            range.animationDuration = 0;
            range.navigatorStyleSettings.selectedRegionColor = 'green';
            range.refresh();
        });
        it('checking with second level label click', (done: Function) => {
            range.loaded = (args: Object): void => {
                isCheck = true;
                let element: Element = <Element>document.getElementById('container_AxisLabels').firstChild.firstChild;
                let pageX: number = +element.getAttribute('x');
                let pageY: number = +element.getAttribute('y');
                range.rangeOnMouseDown(<PointerEvent>trigger.onTouchStart(element, null, null, null, null, pageX, pageY));
                range.mouseEnd(<PointerEvent>trigger.onTouchEnd(element, null, null, null, null, pageX, pageY));
            };
            range.changed = (args: IChangedEventArgs) => {
                if (isCheck) {
                    expect(new Date(+args.start).getMonth()).toEqual(0);
                    expect(new Date(+args.end).getMonth() > new Date(+args.start).getMonth()).toBe(true);
                    isCheck = false;
                    done();
                }
            };
            range.refresh();
        });
        it('checking resize event', (done: Function) => {
            range.loaded = (args: Object): void => {
                if (isCheck) {
                    expect(range.svgObject).not.toEqual(null);
                    done();
                } else {
                    range.rangeResize(new Event(''));
                }
            };
            range.resized = (args: IResizeRangeNavigatorEventArgs) => {
                isCheck = true;
                expect(args.name).toBe('resized');
            };
            range.changed = null;
            range.refresh();
        });
    });

});