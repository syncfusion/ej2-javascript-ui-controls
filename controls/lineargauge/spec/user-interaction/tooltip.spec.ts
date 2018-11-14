/**
 * Linear gauge spec document
 */
import { Browser, EventHandler, createElement, EmitType } from '@syncfusion/ej2-base';
import { GaugeTooltip } from '../../src/linear-gauge/user-interaction/tooltip';
import { ILoadedEventArgs, ILoadEventArgs, IAnimationCompleteEventArgs } from '../../src/linear-gauge/model/interface';
import { LinearGauge } from '../../src/linear-gauge/linear-gauge';
import { MouseEvents } from '../base/events.spec';
LinearGauge.Inject(GaugeTooltip);

describe('Linear gauge control', () => {
    describe('Checking user interaction - tooltip', () => {
        let gauge: LinearGauge;
        let element: HTMLElement;
        let tooltipModule: GaugeTooltip;
        let targetElement: HTMLElement;
        let trigger: MouseEvents = new MouseEvents();
        beforeAll((): void => {
            element = createElement('div', { id: 'container' });
            document.body.appendChild(element);
            gauge = new LinearGauge();
            gauge.appendTo('#container');
        });
        afterAll((): void => {
            //           gauge.tooltipModule = null;
            gauge.destroy();
            element.remove();
        });

        it('Checking Default Tooltip', () => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                targetElement = document.getElementById('container_AxisIndex_0_MarkerPointer_0');
                trigger.mousemoveEvent(targetElement, 668.5, 223, (668.5 + 10), (223 + 10));
                trigger.mousemoveEvent(gauge.element, 0, 0, 0, 0);
                tooltipModule = gauge.tooltipModule;
            };
            gauge.tooltip.enable = true;
            gauge.axes[0].pointers[0].value = 50;
            gauge.refresh();
        });

        it('Checking Tooltip with two axis', () => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                targetElement = document.getElementById('container_AxisIndex_0_MarkerPointer_0');
                trigger.mousemoveEvent(targetElement, 659.5, 223, (659.5 + 10), (223 + 10));
                trigger.mousemoveEvent(gauge.element, 0, 0, 0, 0);
            };
            gauge.axes[0].opposedPosition = true;
            gauge.axes[0].labelStyle.format = '{value}° C';
            gauge.tooltip.template = '<div id="templateWrap"><div class="des">' +
                '<span id="content">Template:${value}</span></div></div>';
            gauge.refresh();
        });

        it('Checking Tooltip format', () => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                targetElement = document.getElementById('container_AxisIndex_0_MarkerPointer_0');
                trigger.mousemoveEvent(targetElement, 667.5, 223, (667.5 + 10), (223 + 10));
                trigger.mousemoveEvent(gauge.element, 0, 0, 0, 0);
            };
            gauge.axes[0].opposedPosition = false;
            gauge.tooltip.format = '####. KM';
            gauge.refresh();
        });

        it('Checking Tooltip in horizontal orientation', () => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                targetElement = document.getElementById('container_AxisIndex_0_MarkerPointer_0');
                trigger.mousemoveEvent(targetElement, 621.5, 255, (621.5 + 10), (255 + 10));
                trigger.mousemoveEvent(gauge.element, 0, 0, 0, 0);
            };
            gauge.orientation = 'Horizontal';
            gauge.refresh();
        });

        it('Checking Tooltip with bar pointer ', () => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                targetElement = document.getElementById('container_AxisIndex_0_BarPointer_0');
                trigger.mousemoveEvent(targetElement, 676.5, 233, (676.5 + 10), (233 + 10));
                trigger.mousemoveEvent(gauge.element, 0, 0, 0, 0);
            };
            gauge.axes[0].pointers[0].type = 'Bar';
            gauge.orientation = 'Vertical';
            gauge.refresh();
        });

        it('Checking Tooltip with bar pointer in inversed axis', () => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                targetElement = document.getElementById('container_AxisIndex_0_BarPointer_0');
                trigger.mousemoveEvent(targetElement, 676.5, 71.5, (676.5 + 10), (71.5 - 10));
                trigger.mousemoveEvent(gauge.element, 0, 0, 0, 0);
            };
            gauge.axes[0].pointers[0].type = 'Bar';
            gauge.axes[0].isInversed = true;
            gauge.orientation = 'Vertical';
            gauge.refresh();
        });

        it('Checking Tooltip with bar pointer in inversed axis', () => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                targetElement = document.getElementById('container_AxisIndex_0_BarPointer_0');
                trigger.mousemoveEvent(targetElement, 171.375, 264, (171 + 10), 264);
                trigger.mousemoveEvent(gauge.element, 0, 0, 0, 0);
            };
            gauge.axes[0].pointers[0].type = 'Bar';
            gauge.axes[0].isInversed = false;
            gauge.tooltip.border.color = 'red';
            gauge.orientation = 'Horizontal';
            gauge.refresh();
        });

        it('Checking Tooltip with bar pointer in opposed position', () => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                targetElement = document.getElementById('container_AxisIndex_0_BarPointer_0');
                trigger.mousemoveEvent(targetElement, 631, 182, (631 + 10), 182);
                trigger.mousemoveEvent(gauge.element, 0, 0, 0, 0);
            };
            gauge.axes[0].pointers[0].type = 'Bar';
            gauge.axes[0].isInversed = true;
            gauge.axes[0].pointers[0].color = null;
            gauge.tooltip.border.color = null;
            gauge.axes[0].opposedPosition = true;
            gauge.refresh();
        });

        it('Checking Tooltip with axis line in opposed position ', () => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                targetElement = document.getElementById('container_AxisIndex_0_BarPointer_0');
                trigger.mousemoveEvent(targetElement, 631.5, 182.5, (631.5 + 10), 182.5);
                trigger.mousemoveEvent(gauge.element, 0, 0, 0, 0);
            };
            gauge.axes[0].line.width = 0;
            gauge.refresh();
        });

        it('Checking Tooltip with axis line ', () => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                targetElement = document.getElementById('container_AxisIndex_0_BarPointer_0');
                trigger.mousemoveEvent(targetElement, 631.5, 263.5, (631.5 + 10), 263.5);
                trigger.mousemoveEvent(gauge.element, 0, 0, 0, 0);
            };
            gauge.axes[0].opposedPosition = false;
            gauge.refresh();
        });

        it('Checking Tooltip with touch', (done: Function) => {
            targetElement = document.getElementById('container_AxisIndex_0_BarPointer_0');
            trigger.mousedownEvent(targetElement, 631.5, 263.5, 631.5, 263.5);
            trigger.doTouchEnd(targetElement, 631.5, 263.5, 631.5, 263.5, 631.5, 263.5, gauge);
            setTimeout(function () {
                done();
            }, 2500)

            gauge.refresh();
        });

        it('Checking Tooltip with multiple pointer ', () => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                targetElement = document.getElementById('container_AxisIndex_0_MarkerPointer_0');
                trigger.mousemoveEvent(targetElement, 345, 254.5, (345), 254);
                targetElement = document.getElementById('container_AxisIndex_0_MarkerPointer_1');
                trigger.mousemoveEvent(targetElement, 713.5, 254, (713.5), 254);

            };
            gauge.axes[0].pointers = [{
                value: 80,
                type: 'Marker'
            },
            {
                value: 40,
                type: 'Marker'
            }
            ];
            gauge.refresh();
        });

        it('Checking Tooltip destroy method ', () => {
            gauge.tooltipModule.destroy(gauge);
        });

    });
});
