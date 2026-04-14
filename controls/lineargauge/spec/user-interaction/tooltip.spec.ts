/**
 * Linear gauge spec document
 */
import { Browser, EventHandler, createElement, EmitType } from '@syncfusion/ej2-base';
import { GaugeTooltip } from '../../src/linear-gauge/user-interaction/tooltip';
import { ILoadedEventArgs, ILoadEventArgs, IAnimationCompleteEventArgs } from '../../src/linear-gauge/model/interface';
import { LinearGauge } from '../../src/linear-gauge/linear-gauge';
import { MouseEvents } from '../base/events.spec';
import { GaugeLocation } from '../../src/linear-gauge/utils/helper';
import  {profile , inMB, getMemoryProfile} from '../common.spec';
LinearGauge.Inject(GaugeTooltip);

describe('Linear gauge control', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            pending(); //Skips test (in Chai)
            return;
        }
    });
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

        it('Checking Tooltip format as Currency', () => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                targetElement = document.getElementById('container_AxisIndex_0_MarkerPointer_0');
                trigger.mousemoveEvent(targetElement, 667.5, 223, (667.5 + 10), (223 + 10));
                trigger.mousemoveEvent(gauge.element, 0, 0, 0, 0);
            };
            gauge.format = 'c';
            gauge.axes[0].opposedPosition = false;
            gauge.tooltip.format = 'c';
            gauge.refresh();
        });

        it('Checking Value Tooltip format', () => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                targetElement = document.getElementById('container_AxisIndex_0_MarkerPointer_0');
                trigger.mousemoveEvent(targetElement, 667.5, 223, (667.5 + 10), (223 + 10));
                trigger.mousemoveEvent(gauge.element, 0, 0, 0, 0);
            };
            gauge.axes[0].opposedPosition = false;
            gauge.tooltip.format = '${value}';
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
            gauge.tooltipModule.destroy();
        });
    });
    describe('Tooltip range value', () => {
        let gauge: LinearGauge;
        let ele: HTMLElement;
        let direction: string;
        let boundingRect: ClientRect;
        let boundingRect1: ClientRect;
        let value: string[] | string | number;
        let location: GaugeLocation;
        let trigger: MouseEvents = new MouseEvents();
        let targetElement: HTMLElement;
        let eventObj: object;
        let svg: HTMLElement;
        let value1: string[] | string | number;
        afterEach((): void => {
            trigger.mouseLeaveEvent(ele);
        });
        beforeAll((): void => {
            ele = createElement('div', { id: 'gauge' });
            document.body.appendChild(ele);
            gauge = new LinearGauge({
                orientation : "Horizontal",
                tooltip: {
                    type:['Pointer', 'Range'],
                    enable: true,                    
                    rangeSettings: {
                        position: "Center",
                    }
                },
                axes: [{    
                 pointers: [
                     {
                         value: 50,
                         markerType: 'Triangle',
                         position: 'Inside',
                         type: 'Marker'
                     },
                 ],
                 ranges: [{
                    start: 0,
                    end: 30,
                    color: '#30B32D',
                    startWidth: 50,
                    endWidth: 50
                },
                {
                    start: 30,
                    end: 60,
                    startWidth: 50,
                    endWidth: 50,
                    color: '#FFDF00'
                },
                {
                    start: 60,
                    end: 90,
                    startWidth: 50,
                    endWidth: 50,
                    color: '#F03E3E'
                }]
                }]
            },
                '#gauge'
            );
        });
        afterAll((): void => {
            gauge.destroy();
            ele.remove();
        });
        it('Checking normal Range tooltip', () => {
            gauge.loaded = (args: ILoadedEventArgs) => {
                for (let i: number = 0; i < (gauge.axes[0].ranges.length); i++) {
                    ele = document.getElementById('gauge_AxisIndex_0_Range_' + i);
                    eventObj = {
                        target: ele,
                        type: 'mousemove',
                        pageX: ele.getBoundingClientRect().left,
                        pageY: ele.getBoundingClientRect().top
                    }
                    gauge.tooltipModule.renderTooltip(<PointerEvent>eventObj);
                }
                gauge.mouseLeave(<PointerEvent>eventObj);
            };
            gauge.tooltip.enable = true;
            gauge.tooltip.type = ['Range'];
            gauge.theme = 'HighContrast';
            gauge.tooltip.rangeSettings.showAtMousePosition = true;
            gauge.refresh();
        });
        it('Checking Range Tooltip with roundedplace', () => {
            gauge.loaded = (args: ILoadedEventArgs) => {
                for (let i: number = 0; i < (gauge.axes[0].ranges.length); i++) {
                    ele = document.getElementById('gauge_AxisIndex_0_Range_' + i);
                    eventObj = {
                        target: ele,
                        type: 'touchend',
                        changedTouches: [{ pageX: ele.getBoundingClientRect().left, pageY: ele.getBoundingClientRect().top }]
                    }
                    gauge.tooltipModule.mouseUpHandler(<PointerEvent>eventObj);
                }
                gauge.mouseLeave(<PointerEvent>eventObj);
            };
            gauge.tooltip.rangeSettings.showAtMousePosition = false;
            gauge.refresh();
        });

        it('Checking Range Tooltip with Format', () => {
            gauge.loaded = (args: ILoadedEventArgs) => {
                for (let i: number = 0; i < (gauge.axes[0].ranges.length); i++) {
                    ele = document.getElementById('gauge_AxisIndex_0_Range_' + i);
                    eventObj = {
                        target: ele,
                        type: 'touchend',
                        changedTouches: [{ pageX: ele.getBoundingClientRect().left, pageY: ele.getBoundingClientRect().top }]
                    }
                    gauge.tooltipModule.mouseUpHandler(<PointerEvent>eventObj);
                }
                gauge.mouseLeave(<PointerEvent>eventObj);
            };
            gauge.tooltip.rangeSettings.showAtMousePosition = false;
            gauge.tooltip.rangeSettings.format = '{start}'
            gauge.refresh();
        });

        it('Checking Range Tooltip template', () => {
            gauge.loaded = (args: ILoadedEventArgs) => {
                for (let i: number = 0; i < (gauge.axes[0].ranges.length); i++) {
                    ele = document.getElementById('gauge_AxisIndex_0_Range_' + i);
                    eventObj = {
                        target: ele,
                        type: 'touchend',
                        changedTouches: [{ pageX: ele.getBoundingClientRect().left, pageY: ele.getBoundingClientRect().top }]
                    }
                    gauge.tooltipModule.mouseUpHandler(<PointerEvent>eventObj);
                }
                gauge.mouseLeave(<PointerEvent>eventObj);
            };
            gauge.tooltip.rangeSettings.showAtMousePosition = false;
            gauge.tooltip.rangeSettings.template = '<div id="tooltip1" style="border:2px solid red;"><div class="des"><span>${start} MPH</span></div></div>';
            gauge.refresh();
        });

        it('Checking Range Tooltip template with empty Content', () => {
            gauge.loaded = (args: ILoadedEventArgs) => {
                for (let i: number = 0; i < (gauge.axes[0].ranges.length); i++) {
                    ele = document.getElementById('gauge_AxisIndex_0_Range_' + i);
                    eventObj = {
                        target: ele,
                        type: 'touchend',
                        changedTouches: [{ pageX: ele.getBoundingClientRect().left, pageY: ele.getBoundingClientRect().top }]
                    }
                    gauge.tooltipModule.mouseUpHandler(<PointerEvent>eventObj);
                }
                gauge.mouseLeave(<PointerEvent>eventObj);
            };
            gauge.tooltip.rangeSettings.showAtMousePosition = false;
            gauge.tooltip.rangeSettings.template = ' ';
            gauge.refresh();
        });
        it('Checking Range Tooltip template with empty Content', () => {
            gauge.loaded = (args: ILoadedEventArgs) => {
                for (let i: number = 0; i < (gauge.axes[0].ranges.length); i++) {
                    ele = document.getElementById('gauge_AxisIndex_0_Range_' + i);
                    eventObj = {
                        target: ele,
                        type: 'touchend',
                        changedTouches: [{ pageX: ele.getBoundingClientRect().left, pageY: ele.getBoundingClientRect().top }]
                    }
                    gauge.tooltipModule.mouseUpHandler(<PointerEvent>eventObj);
                }
                gauge.mouseLeave(<PointerEvent>eventObj);
            };
            gauge.tooltip.rangeSettings.showAtMousePosition = false;
            gauge.tooltip.rangeSettings.template = ' ';
            gauge.refresh();
        });        
        it('Checking normal tooltip', () => {
            gauge.loaded = (args: ILoadedEventArgs) => {                
                for (let i: number = gauge.axes[0].minimum; i < gauge.axes[0].maximum; i++) {
                    gauge.setPointerValue(0, 0, i);
                    ele = document.getElementById('gauge_AxisIndex_0_MarkerPointer_0');
                    eventObj = {
                        target: ele,
                        type: 'mousemove',
                        pageX: ele.getBoundingClientRect().left,
                        pageY: ele.getBoundingClientRect().top
                    }
                    gauge.tooltipModule.renderTooltip(<PointerEvent>eventObj);
                }
                gauge.mouseLeave(<PointerEvent>eventObj);
            };
            gauge.tooltip.enable = true;
            gauge.axes[0].pointers[0].value = 10;
            gauge.theme = 'HighContrast';
            gauge.tooltip.showAtMousePosition = true;
            gauge.refresh();
        });

        it('Checking Tooltip with showAtMousePosition false', () => {
            gauge.loaded = (args: ILoadedEventArgs) => {
                for (let i: number = gauge.axes[0].minimum; i < gauge.axes[0].maximum; i++) {
                    gauge.setPointerValue(0, 0, i);
                    ele = document.getElementById('gauge_AxisIndex_0_MarkerPointer_0');
                    eventObj = {
                        target: ele,
                        type: 'touchend',
                        changedTouches: [{ pageX: ele.getBoundingClientRect().left, pageY: ele.getBoundingClientRect().top }]
                    }
                    gauge.tooltipModule.mouseUpHandler(<PointerEvent>eventObj);
                }
                gauge.mouseLeave(<PointerEvent>eventObj);
            };
            gauge.axes[0].pointers[0].value = 50;
            gauge.tooltip.showAtMousePosition = false;
            gauge.refresh();
        });

        it('Checking Tooltip format', () => {
            gauge.loaded = (args: ILoadedEventArgs) => {
                for (let i: number = gauge.axes[0].minimum; i < gauge.axes[0].maximum; i++) {
                    gauge.setPointerValue(0, 0, i);
                    ele = document.getElementById('gauge_AxisIndex_0_MarkerPointer_0');
                    eventObj = {
                        target: ele,
                        type: 'touchend',
                        changedTouches: [{ pageX: ele.getBoundingClientRect().left, pageY: ele.getBoundingClientRect().top }]
                    }
                    gauge.tooltipModule.mouseUpHandler(<PointerEvent>eventObj);
                }
                gauge.mouseLeave(<PointerEvent>eventObj);
            };
            gauge.axes[0].pointers[0].value = 50;
            gauge.tooltip.format = '{value}%';
            gauge.tooltip.showAtMousePosition = false;
            gauge.refresh();
        });

        it('Checking Tooltip template', () => {
            gauge.loaded = (args: ILoadedEventArgs) => {
                for (let i: number = gauge.axes[0].minimum; i < gauge.axes[0].maximum; i++) {
                    gauge.setPointerValue(0, 0, i);
                    ele = document.getElementById('gauge_AxisIndex_0_MarkerPointer_0');
                    eventObj = {
                        target: ele,
                        type: 'touchend',
                        changedTouches: [{ pageX: ele.getBoundingClientRect().left, pageY: ele.getBoundingClientRect().top }]
                    }
                    gauge.tooltipModule.mouseUpHandler(<PointerEvent>eventObj);
                }
                gauge.mouseLeave(<PointerEvent>eventObj);
            };
            gauge.axes[0].pointers[0].value = 50;
            gauge.tooltip.showAtMousePosition = false;
            gauge.tooltip.template = '<div id="tooltip1" style="border:2px solid red;"><div class="des"><span>${value} MPH</span></div></div>';
            gauge.refresh();
        });

        it('Checking Tooltip template with none content', () => {
            gauge.loaded = (args: ILoadedEventArgs) => {
                for (let i: number = gauge.axes[0].minimum; i < gauge.axes[0].maximum; i++) {
                    gauge.setPointerValue(0, 0, i);
                    ele = document.getElementById('gauge_AxisIndex_0_MarkerPointer_0');
                    eventObj = {
                        target: ele,
                        type: 'touchend',
                        changedTouches: [{ pageX: ele.getBoundingClientRect().left, pageY: ele.getBoundingClientRect().top }]
                    }
                    gauge.tooltipModule.mouseUpHandler(<PointerEvent>eventObj);
                }
                gauge.mouseLeave(<PointerEvent>eventObj);
            };
            gauge.tooltip.template = ' ';
            gauge.refresh();
        });
        it('Checking Tooltip position Center', () => {
            gauge.loaded = (args: ILoadedEventArgs) => {
                for (let i: number = gauge.axes[0].minimum; i < gauge.axes[0].maximum; i++) {
                    gauge.setPointerValue(0, 0, i);
                    ele = document.getElementById('gauge_AxisIndex_0_MarkerPointer_0');
                    eventObj = {
                        target: ele,
                        type: 'touchend',
                        changedTouches: [{ pageX: ele.getBoundingClientRect().left, pageY: ele.getBoundingClientRect().top }]
                    }
                    gauge.tooltipModule.mouseUpHandler(<PointerEvent>eventObj);
                }
                gauge.mouseLeave(<PointerEvent>eventObj);
            };
            gauge.tooltip.position = 'Center';
            gauge.refresh();
        });
        it('Checking Tooltip position start', () => {
            gauge.loaded = (args: ILoadedEventArgs) => {
                for (let i: number = gauge.axes[0].minimum; i < gauge.axes[0].maximum; i++) {
                    gauge.setPointerValue(0, 0, i);
                    ele = document.getElementById('gauge_AxisIndex_0_MarkerPointer_0');
                    eventObj = {
                        target: ele,
                        type: 'touchend',
                        changedTouches: [{ pageX: ele.getBoundingClientRect().left, pageY: ele.getBoundingClientRect().top }]
                    }
                    gauge.tooltipModule.mouseUpHandler(<PointerEvent>eventObj);
                }
                gauge.mouseLeave(<PointerEvent>eventObj);
            };
            gauge.tooltip.position = 'Start';
            gauge.refresh();
        });
        
        it('Checking Range Tooltip rangeTooltipPosition Start', () => {
            gauge.loaded = (args: ILoadedEventArgs) => {
                for (let i: number = 0; i < (gauge.axes[0].ranges.length); i++) {
                    ele = document.getElementById('gauge_AxisIndex_0_Range_' + i);
                    eventObj = {
                        target: ele,
                        type: 'touchend',
                        changedTouches: [{ pageX: ele.getBoundingClientRect().left, pageY: ele.getBoundingClientRect().top }]
                    }
                    gauge.tooltipModule.mouseUpHandler(<PointerEvent>eventObj);
                }
                gauge.mouseLeave(<PointerEvent>eventObj);
            };
            gauge.tooltip.rangeSettings.showAtMousePosition = false;
            gauge.tooltip.rangeSettings.template = ' ';
            gauge.tooltip.rangeSettings.position= "Start",
            gauge.refresh();
        });
        
        it('Checking Range Tooltip rangeTooltipPosition End', () => {
            gauge.loaded = (args: ILoadedEventArgs) => {
                for (let i: number = 0; i < (gauge.axes[0].ranges.length); i++) {
                    ele = document.getElementById('gauge_AxisIndex_0_Range_' + i);
                    eventObj = {
                        target: ele,
                        type: 'touchend',
                        changedTouches: [{ pageX: ele.getBoundingClientRect().left, pageY: ele.getBoundingClientRect().top }]
                    }
                    gauge.tooltipModule.mouseUpHandler(<PointerEvent>eventObj);
                }
                gauge.mouseLeave(<PointerEvent>eventObj);
            };
            gauge.tooltip.rangeSettings.showAtMousePosition = false;
            gauge.tooltip.rangeSettings.template = ' ';
            gauge.tooltip.rangeSettings.position= "End",
            gauge.refresh();
        });
        it('Checking Range Tooltip rangeTooltipPosition Center', () => {
            gauge.loaded = (args: ILoadedEventArgs) => {
                for (let i: number = 0; i < (gauge.axes[0].ranges.length); i++) {
                    ele = document.getElementById('gauge_AxisIndex_0_Range_' + i);
                    eventObj = {
                        target: ele,
                        type: 'touchend',
                        changedTouches: [{ pageX: ele.getBoundingClientRect().left, pageY: ele.getBoundingClientRect().top }]
                    }
                    gauge.tooltipModule.mouseUpHandler(<PointerEvent>eventObj);
                }
                gauge.mouseLeave(<PointerEvent>eventObj);
            };
            gauge.tooltip.rangeSettings.showAtMousePosition = false;
            gauge.tooltip.rangeSettings.template = ' ';
            gauge.tooltip.rangeSettings.position= "Center",
            gauge.refresh();
        });
        it('Checking Vertical Orientation Range Tooltip rangeTooltipPosition Start', () => {
            gauge.loaded = (args: ILoadedEventArgs) => {
                for (let i: number = 0; i < (gauge.axes[0].ranges.length); i++) {
                    ele = document.getElementById('gauge_AxisIndex_0_Range_' + i);
                    eventObj = {
                        target: ele,
                        type: 'touchend',
                        changedTouches: [{ pageX: ele.getBoundingClientRect().left, pageY: ele.getBoundingClientRect().top }]
                    }
                    gauge.tooltipModule.mouseUpHandler(<PointerEvent>eventObj);
                }
                gauge.mouseLeave(<PointerEvent>eventObj);
            };
            gauge.tooltip.rangeSettings.showAtMousePosition = false;
            gauge.tooltip.rangeSettings.template = ' ';
            gauge.tooltip.rangeSettings.position= "Start",
            gauge.orientation= 'Vertical';
            gauge.refresh();
        });
        it('Checking Vertical Orientation Range Tooltip rangeTooltipPosition End', () => {
            gauge.loaded = (args: ILoadedEventArgs) => {
                for (let i: number = 0; i < (gauge.axes[0].ranges.length); i++) {
                    ele = document.getElementById('gauge_AxisIndex_0_Range_' + i);
                    eventObj = {
                        target: ele,
                        type: 'touchend',
                        changedTouches: [{ pageX: ele.getBoundingClientRect().left, pageY: ele.getBoundingClientRect().top }]
                    }
                    gauge.tooltipModule.mouseUpHandler(<PointerEvent>eventObj);
                }
                gauge.mouseLeave(<PointerEvent>eventObj);
            };
            gauge.tooltip.rangeSettings.showAtMousePosition = false;
            gauge.tooltip.rangeSettings.template = ' ';
            gauge.tooltip.rangeSettings.position= "End",
            gauge.orientation= 'Vertical';
            gauge.refresh();
        });
        it('Checking Vertical Orientation Range Tooltip rangeTooltipPosition Center', () => {
            gauge.loaded = (args: ILoadedEventArgs) => {
                for (let i: number = 0; i < (gauge.axes[0].ranges.length); i++) {
                    ele = document.getElementById('gauge_AxisIndex_0_Range_' + i);
                    eventObj = {
                        target: ele,
                        type: 'touchend',
                        changedTouches: [{ pageX: ele.getBoundingClientRect().left, pageY: ele.getBoundingClientRect().top }]
                    }
                    gauge.tooltipModule.mouseUpHandler(<PointerEvent>eventObj);
                }
                gauge.mouseLeave(<PointerEvent>eventObj);
            };
            gauge.tooltip.rangeSettings.showAtMousePosition = false;
            gauge.tooltip.rangeSettings.template = ' ';
            gauge.tooltip.rangeSettings.position= "Center",
            gauge.orientation= 'Vertical';
            gauge.refresh();
        });
        it('Checking isInversed Tooltip position start', () => {
            gauge.loaded = (args: ILoadedEventArgs) => {
                for (let i: number = gauge.axes[0].minimum; i < gauge.axes[0].maximum; i++) {
                    gauge.setPointerValue(0, 0, i);
                    ele = document.getElementById('gauge_AxisIndex_0_MarkerPointer_0');
                    eventObj = {
                        target: ele,
                        type: 'touchend',
                        changedTouches: [{ pageX: ele.getBoundingClientRect().left, pageY: ele.getBoundingClientRect().top }]
                    }
                    gauge.tooltipModule.mouseUpHandler(<PointerEvent>eventObj);
                }
                gauge.mouseLeave(<PointerEvent>eventObj);
            };
            gauge.tooltip.position = 'Start';
            gauge.axes[0].isInversed = false;
            gauge.refresh();
        });
        
        it('Checking isInversed Range Tooltip rangeTooltipPosition Start', () => {
            gauge.loaded = (args: ILoadedEventArgs) => {
                for (let i: number = 0; i < (gauge.axes[0].ranges.length); i++) {
                    ele = document.getElementById('gauge_AxisIndex_0_Range_' + i);
                    eventObj = {
                        target: ele,
                        type: 'touchend',
                        changedTouches: [{ pageX: ele.getBoundingClientRect().left, pageY: ele.getBoundingClientRect().top }]
                    }
                    gauge.tooltipModule.mouseUpHandler(<PointerEvent>eventObj);
                }
                gauge.mouseLeave(<PointerEvent>eventObj);
            };
            gauge.tooltip.rangeSettings.showAtMousePosition = false;
            gauge.tooltip.rangeSettings.template = ' ';
            gauge.tooltip.rangeSettings.position= "Start",
            gauge.axes[0].isInversed = false;
            gauge.refresh();
        });
    });
    it('memory leak', () => {     
        profile.sample();
        let average: any = inMB(profile.averageChange)
        //Check average change in memory samples to not be over 10MB
        expect(average).toBeLessThan(10);
        let memory: any = inMB(getMemoryProfile())
        //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
    });
});
