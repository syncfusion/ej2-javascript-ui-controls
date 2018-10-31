import { RangeNavigator } from '../../../src/range-navigator/index';
import { Logarithmic, DateTime, LineSeries, AreaSeries } from '../../../src/chart/index';
import { createElement, remove } from '@syncfusion/ej2-base';
import { IChangedEventArgs } from '../../../src/range-navigator/model/range-navigator-interface';
import { MouseEvents } from '../../../spec/chart/base/events.spec';
RangeNavigator.Inject(Logarithmic, DateTime, LineSeries, AreaSeries);

let value: number = 0;
let point: Object;
let data: Object[] = [];
let args: IChangedEventArgs;
let trigger: MouseEvents = new MouseEvents();
let dateTime: Object[] = [];

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
    describe('with Sliders', () => {
        let element: Element;
        let range: RangeNavigator;
        let rangeElement: HTMLElement = createElement('div', { id: 'container' });
        let axisLabel: Element;
        let prevent: Function = (): void => {
          };

        beforeAll(() => {
            document.body.appendChild(rangeElement);
            range = new RangeNavigator({
                series: [{
                    dataSource: [{ x: 10, y: 20 }, { x: 20, y: 12 }, { x: 30, y: 22 }, { x: 40, y: 16 }],
                    xName: 'x', yName: 'y', type: 'Line'
                }],
                allowSnapping: false
            });
            range.appendTo('#container');
        });
        afterAll((): void => {
            range.destroy();
            rangeElement.remove();
        })
        it('checking with default sliders', (done: Function) => {
            range.loaded = (args: Object): void => {
                element = document.getElementById('container_sliders');
                expect(element != null).toBe(true);
                done();
            };
            range.series = [{ dataSource: data, xName: 'x', yName: 'y', type: 'Line' }];
            range.minimum = 10;
            range.refresh();
        });
        it('checking with slider selected area', (done: Function) => {
            range.loaded = (args: Object): void => {
                element = document.getElementById('container_SelectedArea');
                expect(+element.getAttribute('width') >= 516 && +element.getAttribute('width') <= 561).toBe(true);
                done();
            };
            range.series = [{ dataSource: data, xName: 'x', yName: 'y', type: 'Line' }];
            range.minimum = 10;
            range.maximum = 50;
            range.refresh();
        });
        it('checking with slider poition changes', (done: Function) => {
        range.loaded = (args: Object): void => {
            let element = document.getElementById('container_rightUnSelectedArea');
            let eventObj: any = {
                target: element,
                type: 'click',
                stopImmediatePropagation: prevent,
                pageX: +element.getAttribute('x'),
                pageY: +element.getAttribute('y')
            };
            range.rangeOnMouseClick(<PointerEvent>eventObj);
            done();
        };
        range.animationDuration = 0;
        range.navigatorStyleSettings.selectedRegionColor = 'green';
        range.refresh();
      });
        it('checking with right un selected area', (done: Function) => {
            range.loaded = (args: Object): void => {
                element = document.getElementById('container_rightUnSelectedArea');
                // tslint:disable-next-line:chai-vague-errors
                expect(element.getAttribute('fill') === 'yellow').toBe(true);
                done();
            };
            range.series = [{ dataSource: data, xName: 'x', yName: 'y', type: 'Line' }];
            range.navigatorStyleSettings.unselectedRegionColor = 'yellow';
            range.minimum = 10;
            range.maximum = 50;
            range.refresh();
        });
        it('checking with thump size', (done: Function) => {
            range.loaded = (args: Object): void => {
                element = document.getElementById('container_RightSlider');
                // tslint:disable-next-line:chai-vague-errors
                expect(element.childNodes.length === 4).toBe(true);
                // tslint:disable-next-line:chai-vague-errors
                expect(element.getAttribute('d') !== '').toBe(true);
                done();
            };
            range.navigatorStyleSettings.thumb.height = 20;
            range.navigatorStyleSettings.thumb.width = 30;
            range.navigatorStyleSettings.selectedRegionColor = 'green';
            range.refresh();
        });
        it('checking with thump fill mouse event', (done: Function) => {
            range.loaded = (args: Object): void => {
                element = document.getElementById('container_AxisLabel_4');
                range.rangeOnMouseDown(<PointerEvent>trigger.onTouchStart(element, 608, 189, null, null, 504, 289));
                range.mouseEnd(<PointerEvent>trigger.onTouchEnd(element, 608, 189, null, null, 504, 289));
                done();
            };
            range.navigatorStyleSettings.thumb.height = 20;
            range.navigatorStyleSettings.thumb.width = 30;
            range.navigatorStyleSettings.selectedRegionColor = 'green';
            range.navigatorStyleSettings.thumb.fill = 'Orange';
            range.refresh();
        });
        it('checking with  un selected region color', (done: Function) => {
            range.loaded = (args: Object): void => {
                element = document.getElementById('container_rightUnSelectedArea');
                // tslint:disable-next-line:chai-vague-errors
                expect(element.getAttribute('fill') === 'blue').toBe(true);
                done();
            };
            range.navigatorStyleSettings.unselectedRegionColor = 'blue';
            range.minimum = 10;
            range.maximum = 50;
            range.refresh();
        });
        it('checking with thump border customization', (done: Function) => {
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
        it('checking with thump fill', (done: Function) => {
            range.loaded = (args: Object): void => {
                element = document.getElementById('container_RightSlider_ThumpSymbol');
                // tslint:disable-next-line:chai-vague-errors
                expect(element.getAttribute('d') !== '').toBe(true);
                // tslint:disable-next-line:chai-vague-errors
                expect(element.getAttribute('fill') === 'red').toBe(true);
                done();
            };
            range.navigatorStyleSettings.thumb.fill = 'red';
            range.navigatorStyleSettings.thumb.border.width = 4;
            range.minimum = 10;
            range.maximum = 50;
            range.refresh();
        });
        it('checking with thump type', (done: Function) => {
            range.loaded = (args: Object): void => {
                element = document.getElementById('container_RightSlider_ThumpSymbol');
                // tslint:disable-next-line:chai-vague-errors
                expect(element.getAttribute('fill') === '#00ff00').toBe(true);
                done();
            };
            range.navigatorStyleSettings.thumb.border.width = 4;
            range.navigatorStyleSettings.thumb.border.color = null;
            range.navigatorStyleSettings.thumb.fill = '#00ff00';
            range.navigatorStyleSettings.thumb.type = 'Rectangle';
            range.minimum = 10;
            range.maximum = 50;
            range.refresh();
        });
        it('checking with right slider mouse event', (done: Function) => {
            range.loaded = (args: Object): void => {
                let targetElement: Element = document.getElementById('container_RightSlider_ThumpSymbol');
                // tslint:disable-next-line:align
                range.rangeOnMouseDown(<PointerEvent>trigger.onTouchStart(targetElement, 608, 189, null, null, 504, 289));
                range.mouseMove(<PointerEvent>trigger.onTouchMove(targetElement, 728, 389, null, null, 404, 189));
                range.mouseEnd(<PointerEvent>trigger.onTouchEnd(targetElement, 728, 389, null, null, 404, 189));
                let thumbTransform: string = document.getElementById('container_RightSlider').getAttribute('transform');
                // tslint:disable-next-line:chai-vague-errors
                expect(thumbTransform === 'translate(380.99999999999994, 0)' || thumbTransform === 'translate(381, 0)' 
                       || thumbTransform === 'translate(381.00000000000006, 0)').toBe(true);
                expect(targetElement != null).toBe(true);
                done();
            };
            range.navigatorStyleSettings.thumb.type = 'Circle';
            // tslint:disable-next-line:align
            range.refresh();
        });
        it('checking with left slider mouse event', (done: Function) => {
            range.loaded = (args: Object): void => {
                let targetElement: Element = document.getElementById('container_LeftSlider_ThumpSymbol');
                // tslint:disable-next-line:align
                range.rangeOnMouseDown(<PointerEvent>trigger.onTouchStart(targetElement, 608, 189, null, null, 504, 289));
                range.mouseMove(<PointerEvent>trigger.onTouchMove(targetElement, 728, 389, null, null, 404, 189));
                range.mouseEnd(<PointerEvent>trigger.onTouchEnd(targetElement, 728, 389, null, null, 404, 189));
                expect(targetElement != null).toBe(true);
                let thumbTransform: string = document.getElementById('container_LeftSlider').getAttribute('transform');
                expect(thumbTransform === 'translate(380.99999999999994, 0)' || thumbTransform === 'translate(381, 0)' ||
                        thumbTransform === 'translate(381.00000000000006, 0)').toBe(true);
                element = document.getElementById('container_SelectedArea');
                expect(element.getAttribute('width') === '0').toBe(true);
                done();
            };
            // tslint:disable-next-line:align
            range.refresh();
        });
        it('checking with right unselected area mouse move event', (done: Function) => {
            range.loaded = (args: Object): void => {
                let targetElement: Element = document.getElementById('container_RightSlider_ThumpSymbol');
                range.rangeOnMouseDown(<PointerEvent>trigger.onTouchStart(targetElement, 590, 89, null, null, 404, 189));
                range.mouseMove(<PointerEvent>trigger.onTouchMove(targetElement, 628, 289, null, null, 304, 289));
                element = document.getElementById('container_SelectedArea');
                expect(+element.getAttribute('width') >= 99 && +element.getAttribute('width') <= 101).toBe(true);
                expect(targetElement != null).toBe(true);
                done();
            };
            // tslint:disable-next-line:align
            range.refresh();
        });
        it('checking with right unselected area mouse down event', (done: Function) => {
            range.loaded = (args: Object): void => {
                let targetElement: Element = document.getElementById('container_rightUnSelectedArea');
                // tslint:disable-next-line:align
                range.rangeOnMouseDown(<PointerEvent>trigger.onTouchStart(targetElement, 720, 180, null, null, 504, 280));
                range.mouseEnd(<PointerEvent>trigger.onTouchStart(targetElement, 720, 180, null, null, 504, 280));
                expect(targetElement != null).toBe(true);
                done();
            };
            // tslint:disable-next-line:align
            range.navigatorBorder.color = 'red';
            range.navigatorStyleSettings.selectedRegionColor = 'pink';
            range.navigatorStyleSettings.unselectedRegionColor = 'skyblue';
            // tslint:disable-next-line:align
            range.refresh();
        });
        it('checking with left unselected area mouse down event', (done: Function) => {
            range.loaded = (args: Object): void => {
                let targetElement: Element = document.getElementById('container_leftUnSelectedArea');
                // tslint:disable-next-line:align
                range.rangeOnMouseDown(<PointerEvent>trigger.onTouchStart(targetElement, 420, 80, null, null, 204, 180));
                range.mouseEnd(<PointerEvent>trigger.onTouchStart(targetElement, 420, 80, null, null, 204, 180));
                expect(targetElement != null).toBe(true);
                done();
            };
            // tslint:disable-next-line:align
            range.navigatorBorder.color = 'red';
            range.navigatorStyleSettings.selectedRegionColor = 'pink';
            range.navigatorStyleSettings.unselectedRegionColor = 'skyblue';
            // tslint:disable-next-line:align
            range.refresh();
        });
        it('checking with selected area mouse down event', (done: Function) => {
            range.loaded = (args: Object): void => {
                let targetElement: Element = document.getElementById('container_SelectedArea');
                // tslint:disable-next-line:align
                range.rangeOnMouseDown(<PointerEvent>trigger.onTouchStart(targetElement, 720, 180, null, null, 504, 280));
                range.mouseMove(<PointerEvent>trigger.onTouchStart(targetElement, 590, 89, null, null, 404, 189));
                expect(targetElement != null).toBe(true);
                done();
            };
            // tslint:disable-next-line:align
            range.navigatorBorder.color = 'red';
            // tslint:disable-next-line:align
            range.refresh();
        });
        it('checking with allow snapping', (done: Function) => {
            range.loaded = (args: Object): void => {
                element = document.getElementById('container_LeftSlider_ThumpSymbol');
                range.rangeOnMouseDown(<PointerEvent>trigger.onTouchStart(element, 590.25, 89, null, null, 404.5, 189));
                range.mouseMove(<PointerEvent>trigger.onTouchStart(element, 720.5, 180, null, null, 604.5, 280));
                range.mouseEnd(<PointerEvent>trigger.onTouchStart(element, 720.5, 180, null, null, 604.5, 280));
                let targetElement: Element = document.getElementById('container_SelectedArea');
                range.rangeOnMouseDown(<PointerEvent>trigger.onTouchStart(targetElement, 630, 89, null, null, 454, 189));
                range.mouseLeave(<PointerEvent>trigger.onTouchLeave(targetElement, 630, 89, null, null, 454, 189));
                expect(element != null).toBe(true);
                done();
            };
            // tslint:disable-next-line:align
            range.allowSnapping = true;
            // tslint:disable-next-line:align
            range.refresh();
        });
        it('checking with rtl left slider position', (done: Function) => {
            range.loaded = (args: Object): void => {
                element = document.getElementById('container_LeftSlider_ThumpSymbol');
                range.rangeOnMouseDown(<PointerEvent>trigger.onTouchStart(element, 720, 180, null, null, 504, 280));
                range.mouseMove(<PointerEvent>trigger.onTouchStart(element, 590, 89, null, null, 404, 189));
                let path: string = document.getElementById('container_LeftSlider').getAttribute('transform');
                expect(path === 'translate(953, 0)' || path === 'translate(398, 0)' || path === 'translate(381, 0)' ||
                     path === 'translate(381.00000000000006, 0)').toBe(true);
                let axislabel: Element = document.getElementById('container_AxisLabel_1');
                let axisLabel1: Element = document.getElementById('container_AxisLabel_2');
                expect(axislabel.getAttribute('x') > axisLabel1.getAttribute('x')).toBe(true);
                done();
            };
            // tslint:disable-next-line:align
            range.navigatorBorder.color = 'red';
            range.enableRtl = true;
            range.navigatorStyleSettings.selectedRegionColor = 'pink';
            range.navigatorStyleSettings.unselectedRegionColor = 'skyblue';
            // tslint:disable-next-line:align
            range.refresh();
        });
        it('checking with rtl right unselected area mouse down event', (done: Function) => {
            range.loaded = (args: Object): void => {
                let targetElement: Element = document.getElementById('container_rightUnSelectedArea');
                // tslint:disable-next-line:align
                range.rangeOnMouseDown(<PointerEvent>trigger.onTouchStart(targetElement, 720, 180, null, null, 504, 280));
                range.mouseEnd(<PointerEvent>trigger.onTouchStart(targetElement, 720, 180, null, null, 504, 280));
                expect(targetElement != null).toBe(true);
                done();
            };
            // tslint:disable-next-line:align
            range.navigatorBorder.color = 'red';
            range.navigatorStyleSettings.selectedRegionColor = 'pink';
            range.navigatorStyleSettings.unselectedRegionColor = 'skyblue';
            // tslint:disable-next-line:align
            range.refresh();
        });
        it('checking with rtl left unselected area mouse down event', (done: Function) => {
            range.loaded = (args: Object): void => {
                let targetElement: Element = document.getElementById('container_leftUnSelectedArea');
                // tslint:disable-next-line:align
                range.rangeOnMouseDown(<PointerEvent>trigger.onTouchStart(targetElement, 420, 80, null, null, 204, 180));
                range.mouseEnd(<PointerEvent>trigger.onTouchStart(targetElement, 420, 80, null, null, 204, 180));
                expect(targetElement != null).toBe(true);
                done();
            };
            // tslint:disable-next-line:align
            range.navigatorBorder.color = 'red';
            range.navigatorStyleSettings.selectedRegionColor = 'pink';
            range.navigatorStyleSettings.unselectedRegionColor = 'skyblue';
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
            range.refresh();
        });
        it('checking with date time axis grouping label mouse down', (done: Function) => {
            range.loaded = (args: Object): void => {
                element1 = document.getElementById('container_SecondaryLabel_0');
                element = document.getElementById('container_SecondaryLabel_2');
                range.rangeOnMouseDown(<PointerEvent>trigger.onTouchStart(element, 434, 105, null, null, 470, 120));
                range.mouseEnd(<PointerEvent>trigger.onTouchStart(element, 434, 105, null, null, 470, 120));
                expect(element.getAttribute('x') < element1.getAttribute('x')).toBe(true);
                done();
            };
            range.valueType = 'DateTime';
            range.series[0].dataSource = dateTime;
            range.navigatorStyleSettings.selectedRegionColor = 'blue';
            range.enableGrouping = true;
            range.allowSnapping = true;
            range.refresh();
        });
        it('checking with date time axis grouping firstlevel label mouse down', (done: Function) => {
            range.loaded = (args: Object): void => {
                element1 = document.getElementById('container_AxisLabel_3');
                element = document.getElementById('container_AxisLabel_1');
                range.rangeOnMouseDown(<PointerEvent>trigger.onTouchStart(element, 434, 105, null, null, 470, 120));
                range.mouseEnd(<PointerEvent>trigger.onTouchStart(element, 434, 105, null, null, 470, 120));
                expect(element.getAttribute('x') > element1.getAttribute('x')).toBe(true);
                done();
            };
            range.valueType = 'DateTime';
            range.series[0].dataSource = dateTime;
            range.navigatorStyleSettings.selectedRegionColor = 'blue';
            range.enableGrouping = true;
            range.allowSnapping = true;
            range.refresh();
        });
        it('checking with allowSnapping click with firstlevel label', (done: Function) => {
            range.loaded = (args: Object): void => {
                element1 = document.getElementById('container_AxisLabel_1');
                element = document.getElementById('container_AxisLabel_2');
                let targetElement: Element = document.getElementById('container_LeftSlider_ThumpSymbol')
                range.rangeOnMouseDown(<PointerEvent>trigger.onTouchStart(element, 286, 296, null, null, 290, 386));
                range.mouseEnd(<PointerEvent>trigger.onTouchStart(element, 286, 296, null, null, 290, 386));
                range.mouseMove(<PointerEvent>trigger.onTouchStart(targetElement, 286.25, 186, null, null, 404.25, 286));
                expect(element.getAttribute('x') < element1.getAttribute('x')).toBe(true);
                done();
            };
            range.valueType = 'DateTime';
            range.series[0].dataSource = dateTime;
            range.navigatorStyleSettings.selectedRegionColor = 'blue';
            range.allowSnapping = true;
            range.enableGrouping = true;
            range.refresh();
        });
        it('checking with label position inside', (done: Function) => {
            range.loaded = (args: Object): void => {
                element1 = document.getElementById('container_AxisLabel_1');
                element = document.getElementById('container_SecondaryLabel_2');
                let targetElement: Element = document.getElementById('container_LeftSlider_ThumpSymbol')
                range.rangeOnMouseDown(<PointerEvent>trigger.onTouchStart(targetElement, 286, 296, null, null, 290, 386));
                range.mouseEnd(<PointerEvent>trigger.onTouchStart(targetElement, 286, 296, null, null, 290, 386));
                range.mouseMove(<PointerEvent>trigger.onTouchStart(targetElement, 286, 186, null, null, 404, 286));
                expect(element.getAttribute('y') < element1.getAttribute('y')).toBe(true);
                done();
            };
            range.valueType = 'DateTime';
            range.series[0].dataSource = dateTime;
            range.navigatorStyleSettings.selectedRegionColor = 'blue';
            range.labelPosition = 'Inside';
            range.enableGrouping = true;
            range.refresh();
        });
        it('checking date time axis with area series', (done: Function) => {
            range.loaded = (args: Object): void => {
                element = document.getElementById('container_Series_0');
                expect(element.getAttribute('fill')).toEqual('#00bdae');
                done();
            };
            range.series[0].type = 'Area';
            range.series[0].dataSource = dateTime;
            range.enableGrouping = false;
            range.labelPosition = 'Outside';
            range.refresh();
        });
        it('checking with slider rtl position', (done: Function) => {
            range.loaded = (args: Object): void => {
                element = document.getElementById('container_AxisLabel_0');
                element1 = document.getElementById('container_AxisLabel_3');
                expect(element.getAttribute('x') < element1.getAttribute('x')).toBe(true);
                done();
            };
            range.series[0].type = 'Area';
            range.series[0].dataSource = dateTime;
            range.width = '350';
            range.height = '450';
            range.enableGrouping = false;
            range.enableRtl = true;
            range.refresh();
        });
    });
});
