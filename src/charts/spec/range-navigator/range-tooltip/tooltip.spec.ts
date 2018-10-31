import { RangeNavigator, RangeTooltip } from '../../../src/range-navigator/index';
import { Logarithmic, DateTime, LineSeries, AreaSeries, getElement, IResizeEventArgs, IResizeRangeNavigatorEventArgs } from '../../../src/chart/index';
import { createElement, remove } from '@syncfusion/ej2-base';
import { IChangedEventArgs, IRangeEventArgs, IRangeTooltipRenderEventArgs } from '../../../src/range-navigator/model/range-navigator-interface';
import { MouseEvents } from '../../../spec/chart/base/events.spec';
RangeNavigator.Inject(Logarithmic, DateTime, LineSeries, AreaSeries, RangeTooltip);

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
describe('Range navigator Tooltip', () => {
    describe('with Sliders double axis', () => {
        let element: Element;
        let targetElement: Element;
        let range: RangeNavigator;
        let rangeElement: HTMLElement = createElement('div', { id: 'tooltip_container' });
        let axisLabel: Element;
        let isCheck: boolean = false;
        beforeAll(() => {
            document.body.appendChild(rangeElement);
            range = new RangeNavigator({
                series: [{
                    dataSource: [{ x: 10, y: 20 }, { x: 20, y: 12 }, { x: 30, y: 22 }, { x: 40, y: 16 }],
                    xName: 'x', yName: 'y', type: 'Line', animation: { duration: 0 }
                }], tooltip: {
                    enable: true, textStyle: {
                        size: '11px',
                        fontWeight: 'Normal',
                        color: null,
                        fontStyle: 'Normal',
                        fontFamily: 'Roboto-Regula'
                    }
                },
                value: [10, 20],
                allowSnapping: false
            });
            range.appendTo('#tooltip_container');
        });
        afterAll((): void => {
            range.destroy();
            rangeElement.remove();
        });
        it('checking with left slider moving', (done: Function) => {
            range.loaded = (args: object) => {
                element = document.getElementById('tooltip_container_LeftSlider');
                targetElement = <Element>element.childNodes[2];
                let transform: string = element.getAttribute('transform');
                let str1: string = transform.substring(transform.indexOf('(') + 1);
                let xValue: number = +str1.substring(0, str1.indexOf(','));
                range.rangeOnMouseDown(<PointerEvent>trigger.onTouchStart(targetElement, null, null, null, null, xValue, 10));
                range.mouseMove(<PointerEvent>trigger.onTouchMove(targetElement, null, null, null, null, xValue + 100, 10));
                range.mouseEnd(<PointerEvent>trigger.onTouchEnd(targetElement, null, null, null, null, xValue + 100, 10));
                expect(getElement('tooltip_container_Secondary_Element') !== null).toBe(true);
                expect(getElement('tooltip_container_Secondary_Element').childElementCount).toBe(2);
                done();
            };
            range.refresh();
        });
        it('checking with right slider moving', (done: Function) => {
            range.loaded = (args: object) => {
                element = document.getElementById('tooltip_container_RightSlider');
                targetElement = <Element>element.childNodes[2];
                let transform: string = element.getAttribute('transform');
                let str1: string = transform.substring(transform.indexOf('(') + 1);
                let xValue: number = +str1.substring(0, str1.indexOf(','));
                range.rangeOnMouseDown(<PointerEvent>trigger.onTouchStart(targetElement, null, null, null, null, xValue, 10));
                range.mouseMove(<PointerEvent>trigger.onTouchMove(targetElement, null, null, null, null, xValue + 100, 10));
                range.mouseEnd(<PointerEvent>trigger.onTouchEnd(targetElement, null, null, null, null, xValue + 100, 10));
                expect(getElement('tooltip_container_leftTooltip_text').textContent).not.toEqual('');
                expect(getElement('tooltip_container_rightTooltip_text').textContent).not.toEqual('');
                done();
            };
            range.refresh();
        });

        it('checking with left slider moving over right slider', (done: Function) => {
            range.loaded = (args: object) => {
                element = document.getElementById('tooltip_container_RightSlider');
                targetElement = <Element>element.childNodes[2];
                let transform: string = element.getAttribute('transform');
                let str1: string = transform.substring(transform.indexOf('(') + 1);
                let xValue: number = +str1.substring(0, str1.indexOf(','));
                range.rangeOnMouseDown(<PointerEvent>trigger.onTouchStart(targetElement, null, null, null, null, xValue, 10));
                range.mouseMove(<PointerEvent>trigger.onTouchMove(targetElement, null, null, null, null, xValue + 200, 10));
                range.mouseEnd(<PointerEvent>trigger.onTouchEnd(targetElement, null, null, null, null, xValue + 200, 10));
                let leftValue: number = +getElement('tooltip_container_leftTooltip_text').textContent;
                let rightValue: number = +getElement('tooltip_container_rightTooltip_text').textContent;
                expect(leftValue < rightValue).toBe(true);
                done();
            };
            range.value = [0, 10];
            range.refresh();
        });

        it('checking with tooltip cancel', (done: Function) => {
            range.loaded = (args: object) => {
                element = document.getElementById('tooltip_container_RightSlider');
                targetElement = <Element>element.childNodes[2];
                let transform: string = element.getAttribute('transform');
                let str1: string = transform.substring(transform.indexOf('(') + 1);
                let xValue: number = +str1.substring(0, str1.indexOf(','));
                range.rangeOnMouseDown(<PointerEvent>trigger.onTouchStart(targetElement, null, null, null, null, xValue, 10));
                range.mouseMove(<PointerEvent>trigger.onTouchMove(targetElement, null, null, null, null, xValue + 200, 10));
                range.mouseEnd(<PointerEvent>trigger.onTouchEnd(targetElement, null, null, null, null, xValue + 200, 10));
                expect(getElement('tooltip_container_leftTooltip_text') === null).toBe(true);
                done();
            };
            range.tooltipRender = (args: IRangeTooltipRenderEventArgs) => {
                args.cancel = true;
            };
            range.value = [0, 10];
            range.refresh();
        });

        it('checking with tooltip format', (done: Function) => {
            range.loaded = (args: object) => {
                element = document.getElementById('tooltip_container_RightSlider');
                targetElement = <Element>element.childNodes[2];
                let transform: string = element.getAttribute('transform');
                let str1: string = transform.substring(transform.indexOf('(') + 1);
                let xValue: number = +str1.substring(0, str1.indexOf(','));
                range.rangeOnMouseDown(<PointerEvent>trigger.onTouchStart(targetElement, null, null, null, null, xValue, 10));
                range.mouseMove(<PointerEvent>trigger.onTouchMove(targetElement, null, null, null, null, xValue + 200, 10));
                range.mouseEnd(<PointerEvent>trigger.onTouchEnd(targetElement, null, null, null, null, xValue + 200, 10));
                let leftValue: string = getElement('tooltip_container_leftTooltip_text').textContent;
                let rightValue: string = getElement('tooltip_container_rightTooltip_text').textContent;
                expect(leftValue.indexOf('$') > -1).toBe(true);
                expect(rightValue.indexOf('$') > -1).toBe(true);
                done();
            };
            range.tooltipRender = null;
            range.tooltip.format = '${value}'
            range.refresh();
        });

        it('checking with tooltip template', (done: Function) => {
            range.loaded = (args: object) => {
                element = document.getElementById('tooltip_container_RightSlider');
                targetElement = <Element>element.childNodes[2];
                let transform: string = element.getAttribute('transform');
                let str1: string = transform.substring(transform.indexOf('(') + 1);
                let xValue: number = +str1.substring(0, str1.indexOf(','));
                range.rangeOnMouseDown(<PointerEvent>trigger.onTouchStart(targetElement, null, null, null, null, xValue, 10));
                range.mouseMove(<PointerEvent>trigger.onTouchMove(targetElement, null, null, null, null, xValue + 200, 10));
                range.mouseEnd(<PointerEvent>trigger.onTouchEnd(targetElement, null, null, null, null, xValue + 200, 10));
                let leftValue: string = getElement('tooltip_container_leftTooltipparent_template').innerHTML;
                expect(leftValue.indexOf('template') > -1).toBe(true);
                done();
            };
            range.tooltipRender = null;
            range.tooltip.template = '<div>$template{value}</div>';
            range.refresh();
        });

        it('checking with tooltip template with sample data', (done: Function) => {
            range.loaded = (args: object) => {
                element = document.getElementById('tooltip_container_RightSlider');
                targetElement = <Element>element.childNodes[2];
                let transform: string = element.getAttribute('transform');
                let str1: string = transform.substring(transform.indexOf('(') + 1);
                let xValue: number = +str1.substring(0, str1.indexOf(','));
                range.rangeOnMouseDown(<PointerEvent>trigger.onTouchStart(targetElement, null, null, null, null, xValue, 10));
                range.mouseMove(<PointerEvent>trigger.onTouchMove(targetElement, null, null, null, null, xValue + 200, 10));
                range.mouseEnd(<PointerEvent>trigger.onTouchEnd(targetElement, null, null, null, null, xValue + 200, 10));
                let leftValue: string = getElement('tooltip_container_leftTooltipparent_template').innerHTML;
                let rightValue: string = getElement('tooltip_container_leftTooltipparent_template').innerHTML;
                expect(leftValue === rightValue).toBe(true);
                done();
            };
            range.tooltipRender = null;
            range.tooltip.template = '<div>${start}</div>';
            range.refresh();
        });
    });

    describe('with Sliders date time axis  with leight weight', () => {
        let element: Element;
        let targetElement: Element;
        let range: RangeNavigator;
        let rangeElement: HTMLElement = createElement('div', { id: 'tooltip_container' });
        let axisLabel: Element;
        let isCheck: boolean = false;
        beforeAll(() => {
            document.body.appendChild(rangeElement);
            range = new RangeNavigator({
                valueType: 'DateTime',
                dataSource: [
                    { x: new Date(2000, 1, 1), y: 20 },
                    { x: new Date(2001, 1, 1), y: 12 },
                    { x: new Date(2002, 1, 1), y: 22 },
                    { x: new Date(2003, 1, 1), y: 16 }
                ],
                xName: 'x', yName: 'y',
                tooltip: {
                    enable: true, textStyle: {
                        size: '11px',
                        fontWeight: 'Normal',
                        color: null,
                        fontStyle: 'Normal',
                        fontFamily: 'Roboto-Regula'
                    }
                },
                value: [new Date(2001, 1, 1), new Date(2002, 1, 1)],
                allowSnapping: false
            }, rangeElement);
        });
        afterAll((): void => {
            range.destroy();
            rangeElement.remove();
        });
        it('checking with left slider moving', (done: Function) => {
            range.loaded = (args: object) => {
                element = document.getElementById('tooltip_container_LeftSlider');
                targetElement = <Element>element.childNodes[2];
                let transform: string = element.getAttribute('transform');
                let str1: string = transform.substring(transform.indexOf('(') + 1);
                let xValue: number = +str1.substring(0, str1.indexOf(','));
                range.rangeOnMouseDown(<PointerEvent>trigger.onTouchStart(targetElement, null, null, null, null, xValue, 10));
                range.mouseMove(<PointerEvent>trigger.onTouchMove(targetElement, null, null, null, null, xValue + 100, 10));
                range.mouseEnd(<PointerEvent>trigger.onTouchEnd(targetElement, null, null, null, null, xValue + 100, 10));
                expect(getElement('tooltip_container_Secondary_Element') !== null).toBe(true);
                expect(getElement('tooltip_container_Secondary_Element').childElementCount).toBe(2);
                done();
            };
            range.refresh();
        });
        it('checking with right slider moving', (done: Function) => {
            range.loaded = (args: object) => {
                element = document.getElementById('tooltip_container_RightSlider');
                targetElement = <Element>element.childNodes[2];
                let transform: string = element.getAttribute('transform');
                let str1: string = transform.substring(transform.indexOf('(') + 1);
                let xValue: number = +str1.substring(0, str1.indexOf(','));
                range.rangeOnMouseDown(<PointerEvent>trigger.onTouchStart(targetElement, null, null, null, null, xValue, 10));
                range.mouseMove(<PointerEvent>trigger.onTouchMove(targetElement, null, null, null, null, xValue + 100, 10));
                range.mouseEnd(<PointerEvent>trigger.onTouchEnd(targetElement, null, null, null, null, xValue + 100, 10));
                expect(getElement('tooltip_container_leftTooltip_text').textContent).not.toEqual('');
                expect(getElement('tooltip_container_rightTooltip_text').textContent).not.toEqual('');
                done();
            };
            range.refresh();
        });

        it('checking with left slider moving over right slider', (done: Function) => {
            range.loaded = (args: object) => {
                element = document.getElementById('tooltip_container_RightSlider');
                targetElement = <Element>element.childNodes[2];
                let transform: string = element.getAttribute('transform');
                let str1: string = transform.substring(transform.indexOf('(') + 1);
                let xValue: number = +str1.substring(0, str1.indexOf(','));
                range.rangeOnMouseDown(<PointerEvent>trigger.onTouchStart(targetElement, null, null, null, null, xValue, 10));
                range.mouseMove(<PointerEvent>trigger.onTouchMove(targetElement, null, null, null, null, xValue + 200, 10));
                range.mouseEnd(<PointerEvent>trigger.onTouchEnd(targetElement, null, null, null, null, xValue + 200, 10));
                let leftValue: string = getElement('tooltip_container_leftTooltip_text').textContent;
                let rightValue: string = getElement('tooltip_container_rightTooltip_text').textContent;
                expect(Date.parse(leftValue) < Date.parse(rightValue)).toBe(true);
                done();
            };
            range.value = [new Date(2000, 1, 1), new Date(2000, 1, 1)];
            range.refresh();
        });

        it('checking with tooltip cancel', (done: Function) => {
            range.loaded = (args: object) => {
                element = document.getElementById('tooltip_container_RightSlider');
                targetElement = <Element>element.childNodes[2];
                let transform: string = element.getAttribute('transform');
                let str1: string = transform.substring(transform.indexOf('(') + 1);
                let xValue: number = +str1.substring(0, str1.indexOf(','));
                range.rangeOnMouseDown(<PointerEvent>trigger.onTouchStart(targetElement, null, null, null, null, xValue, 10));
                range.mouseMove(<PointerEvent>trigger.onTouchMove(targetElement, null, null, null, null, xValue + 200, 10));
                range.mouseEnd(<PointerEvent>trigger.onTouchEnd(targetElement, null, null, null, null, xValue + 200, 10));
                expect(getElement('tooltip_container_leftTooltip_text') === null).toBe(true);
                done();
            };
            range.tooltipRender = (args: IRangeTooltipRenderEventArgs) => {
                args.cancel = true;
            };
            range.refresh();
        });

        it('checking with tooltip format', (done: Function) => {
            range.loaded = (args: object) => {
                element = document.getElementById('tooltip_container_RightSlider');
                targetElement = <Element>element.childNodes[2];
                let transform: string = element.getAttribute('transform');
                let str1: string = transform.substring(transform.indexOf('(') + 1);
                let xValue: number = +str1.substring(0, str1.indexOf(','));
                range.rangeOnMouseDown(<PointerEvent>trigger.onTouchStart(targetElement, null, null, null, null, xValue, 10));
                range.mouseMove(<PointerEvent>trigger.onTouchMove(targetElement, null, null, null, null, xValue + 200, 10));
                range.mouseEnd(<PointerEvent>trigger.onTouchEnd(targetElement, null, null, null, null, xValue + 200, 10));
                let leftValue: string = getElement('tooltip_container_leftTooltip_text').textContent;
                let rightValue: string = getElement('tooltip_container_rightTooltip_text').textContent;
                expect(rightValue === 'Feb').toBe(true);
                done();
            };
            range.tooltipRender = null;
            range.tooltip.format = 'MMM'
            range.refresh();
        });

        it('checking with tooltip template', (done: Function) => {
            range.loaded = (args: object) => {
                element = document.getElementById('tooltip_container_RightSlider');
                targetElement = <Element>element.childNodes[2];
                let transform: string = element.getAttribute('transform');
                let str1: string = transform.substring(transform.indexOf('(') + 1);
                let xValue: number = +str1.substring(0, str1.indexOf(','));
                range.rangeOnMouseDown(<PointerEvent>trigger.onTouchStart(targetElement, null, null, null, null, xValue, 10));
                range.mouseMove(<PointerEvent>trigger.onTouchMove(targetElement, null, null, null, null, xValue + 200, 10));
                range.mouseEnd(<PointerEvent>trigger.onTouchEnd(targetElement, null, null, null, null, xValue + 200, 10));
                let leftValue: string = getElement('tooltip_container_leftTooltipparent_template').innerHTML;
                expect(leftValue.indexOf('template') > -1).toBe(true);
                done();
            };
            range.tooltipRender = null;
            range.tooltip.template = '<div>$template{value}</div>';
            range.refresh();
        });

        it('checking with tooltip template with sample data', (done: Function) => {
            range.loaded = (args: object) => {
                element = document.getElementById('tooltip_container_RightSlider');
                targetElement = <Element>element.childNodes[2];
                let transform: string = element.getAttribute('transform');
                let str1: string = transform.substring(transform.indexOf('(') + 1);
                let xValue: number = +str1.substring(0, str1.indexOf(','));
                range.rangeOnMouseDown(<PointerEvent>trigger.onTouchStart(targetElement, null, null, null, null, xValue, 10));
                range.mouseMove(<PointerEvent>trigger.onTouchMove(targetElement, null, null, null, null, xValue + 200, 10));
                range.mouseEnd(<PointerEvent>trigger.onTouchEnd(targetElement, null, null, null, null, xValue + 200, 10));
                let leftValue: string = getElement('tooltip_container_leftTooltipparent_template').innerHTML;
                let rightValue: string = getElement('tooltip_container_leftTooltipparent_template').innerHTML;
                expect(leftValue === rightValue).toBe(true);
                done();
            };
            range.tooltipRender = null;
            range.tooltip.template = '<div>${start}</div>';
            range.refresh();
        });

        it('checking highcontrast theme', (done: Function) => {
            range.loaded = (args: object) => {
                element = document.getElementById('tooltip_container_RightSlider');
                targetElement = <Element>element.childNodes[2];
                expect(getElement('tooltip_container_leftTooltip_path').getAttribute('fill')).toBe('#ffffff');
                expect(getElement('tooltip_container_rightTooltip_path').getAttribute('fill')).toBe('#ffffff');
                expect(getElement('tooltip_container_leftTooltip_text').children[0].getAttribute('fill')).toBe('#000000');
                expect(getElement('tooltip_container_rightTooltip_text').children[0].getAttribute('fill')).toBe('#000000');
                done();
            };
            range.tooltip.displayMode = 'Always';
            range.theme = 'Highcontrast';
            range.tooltip.template = null;
            range.refresh();
        });

        it('checking tooltip with RTL', (done: Function) => {
            range.loaded = (args: object) => {
                element = document.getElementById('tooltip_container_RightSlider');
                targetElement = <Element>element.childNodes[2];
                let transform: string = element.getAttribute('transform');
                let str1: string = transform.substring(transform.indexOf('(') + 1);
                let xValue: number = +str1.substring(0, str1.indexOf(','));
                range.rangeOnMouseDown(<PointerEvent>trigger.onTouchStart(targetElement, null, null, null, null, xValue, 10));
                range.mouseMove(<PointerEvent>trigger.onTouchMove(targetElement, null, null, null, null, xValue + 200, 10));
                range.mouseEnd(<PointerEvent>trigger.onTouchEnd(targetElement, null, null, null, null, xValue + 200, 10));
                let leftValue: string = getElement('tooltip_container_leftTooltip_text').textContent;
                let rightValue: string = getElement('tooltip_container_rightTooltip_text').textContent;
                expect(leftValue).toBe('Jun');
                expect(rightValue).toBe('May');
                done();
            };
            range.enableRtl = true;
            range.refresh();
        });

    });

});