/**
 * Circular Gauge pointer drag spec
 */

import { createElement } from '@syncfusion/ej2-base';
import { CircularGauge } from '../../../src/circular-gauge/circular-gauge';
import { ILoadedEventArgs } from '../../../src/circular-gauge/model/interface';
import { GaugeTooltip } from '../../../src/circular-gauge/user-interaction/tooltip';
import { GaugeLocation } from '../../../src/circular-gauge/utils/helper';
import { MouseEvents } from './mouse-events.spec';
CircularGauge.Inject(GaugeTooltip);
describe('Circular-Gauge Control', () => {
    describe('Gauge Tooltip', () => {
        let gauge: CircularGauge;
        let ele: HTMLElement;
        let svg: HTMLElement;
        let value: string[] | string | number;
        let location: GaugeLocation;
        let trigger: MouseEvents = new MouseEvents();
        let targetElement: HTMLElement;
        let eventObj: object;
        afterEach((): void => {
            trigger.mouseLeaveEvent(ele);
        });
        beforeAll((): void => {
            ele = createElement('div', { id: 'container' });
            document.body.appendChild(ele);
            gauge = new CircularGauge({
                border: { width: 1 },
                title: 'Tooltip Customization',
                axes: [{
                    background: 'transparent',
                    startAngle: 0,
                    endAngle: 360,
                    maximum: 360,
                    minimum: 0
                }]
            });
            gauge.appendTo('#container');
        });
        afterAll((): void => {
            gauge.destroy();
            ele.remove();
        });
        it('Checking normal tooltip', () => {
            gauge.loaded = (args: ILoadedEventArgs) => {
                for (let i: number = gauge.axes[0].minimum; i < gauge.axes[0].maximum; i++) {
                    gauge.setPointerValue(0, 0, i);
                    ele = document.getElementById('container_Axis_0_Pointer_NeedleRect_0');
                    eventObj = {
                        target: ele,
                        type: 'mousemove',
                        pageX: ele.getBoundingClientRect().left,
                        pageY: ele.getBoundingClientRect().top
                    }
                    gauge.tooltipModule.renderTooltip(<PointerEvent>eventObj);
                }
                ele = document.getElementById('container_CircularGaugeTitle');
                eventObj = {
                    target: ele,
                    type: 'mousemove',
                    pageX: ele.getBoundingClientRect().left,
                    pageY: ele.getBoundingClientRect().top
                }
                gauge.tooltipModule.renderTooltip(<PointerEvent>eventObj);
            };
            gauge.tooltip.enable = true;
            gauge.axes[0].pointers[0].value = 10;
            gauge.theme = 'Highcontrast';
            gauge.tooltip.showAtMousePosition = true;
            gauge.refresh();
        });

        it('Checking Tooltip template', () => {
            gauge.loaded = (args: ILoadedEventArgs) => {
                for (let i: number = gauge.axes[0].minimum; i < gauge.axes[0].maximum; i++) {
                    gauge.setPointerValue(0, 0, i);
                    ele = document.getElementById('container_Axis_0_Pointer_NeedleRect_0');
                    eventObj = {
                        target: ele,
                        type: 'touchend',
                        changedTouches: [{ pageX: ele.getBoundingClientRect().left, pageY: ele.getBoundingClientRect().top }]
                    }
                    gauge.tooltipModule.mouseUpHandler(<PointerEvent>eventObj);
                }
                gauge.mouseLeave(<PointerEvent>eventObj);
            };
            gauge.axes[0].minimum = 0;
            gauge.axes[0].maximum = 120;
            gauge.axes[0].pointers[0].value = 50;
            gauge.tooltip.showAtMousePosition = false;
            gauge.tooltip.template = '<div id="tooltip1" style="border:2px solid red;"><div class="des"><span>${value} MPH</span></div></div>';
            gauge.refresh();
        });
    });
});