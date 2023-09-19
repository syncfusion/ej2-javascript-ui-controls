import { Browser, EventHandler, createElement, EmitType, select } from '@syncfusion/ej2-base';
import { ILoadedEventArgs, ILoadEventArgs, IAnimationCompleteEventArgs } from '../../src/linear-gauge/model/interface';
import { LinearGauge } from '../../src/linear-gauge/linear-gauge';
import { MouseEvents } from '../base/events.spec';
import  {profile , inMB, getMemoryProfile} from '../common.spec';
import { PathOption } from '@syncfusion/ej2-svg-base';

describe('Linear gauge control', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
    describe('Checking axis properties', () => {
        let gauge: LinearGauge;
        let element: HTMLElement;
        let svg: HTMLElement;
        let targetElement: HTMLElement;
        let tooltipElement: HTMLElement;
        let trigger: MouseEvents = new MouseEvents();
        beforeAll((): void => {
            element = createElement('div', { id: 'container' });
            document.body.appendChild(element);
            gauge = new LinearGauge({
                orientation: 'Horizontal',
                title: 'Temperature Measure',
                axes: [{
                    pointers: [{
                        value: 10,
                        height: 15,
                        width: 15,
                        placement: 'Near',
                        offset: -50,
                        markerType: 'Triangle'
                    }],
                    majorTicks: {
                        interval: 10
                    },
                    minorTicks: {
                        interval: 2
                    },
                    labelStyle: {
                        offset: 48
                    }
                }]
            });
            gauge.appendTo('#container');
        });
        afterAll((): void => {
            element.remove();
        });
        it('Major tick default color', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_MajorTicksLine_0');
                expect(svg.getAttribute('fill')).toBe('#a6a6a6');
            };
            gauge.refresh();
        });
        it('Minor default color', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_MinorTicksLine_0');
                expect(svg.getAttribute('fill')).toBe('#a6a6a6');
            };
            gauge.refresh();
        });
        it('AxisLine default color', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_AxisLine_0');
                expect(svg.getAttribute('fill')).toBe('#a6a6a6');
            };
            gauge.refresh();
        });
        it('pointer default color', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
               // let fill: string = document.getElementsByTagName('path')[3].getAttribute('fill');
                document.querySelector('path#defaultContainer_AxisIndex_0_MarkerPointer_0')
                //select("path#defaultContainer_AxisIndex_0_MarkerPointer_0", gauge.element).getAttribute('fill')
                expect(select("path#container_AxisIndex_0_MarkerPointer_0", args.gauge.element).getAttribute('fill')).toBe('#a6a6a6');
            };
            gauge.refresh();
        });
        it('Axis label default color', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                let label: string = document.getElementById('container_Axis_0_Label_0').style.fill;
                expect(label).toBe('rgb(104, 104, 104)');
            };
            gauge.refresh();
        });
        it('Background default color', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_LinearGaugeBorder');
                expect(svg.getAttribute('fill')).toBe('#FFFFFF');
            };
            gauge.refresh();
        });
        it('Title default color', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                let title: string = document.getElementById('container_LinearGaugeTitle').style.fill;
                expect(title).toBe('rgb(66, 66, 66)');
            };
            gauge.refresh();
        });
        it('Checking Default Tooltip', () => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                targetElement = document.getElementById('container_AxisIndex_0_MarkerPointer_0');
                trigger.mousemoveEvent(targetElement, 668.5, 223, (668.5 + 10), (223 + 10));
                tooltipElement = document.getElementById('container_LinearGauge_Tooltip_path');
                expect(tooltipElement.getAttribute('fill')).toBe('#FFFFF');
                trigger.mousemoveEvent(gauge.element, 0, 0, 0, 0);
            };
            gauge.tooltip.enable = true;
            gauge.axes[0].pointers[0].value = 50;
            gauge.refresh();
        });
        it('Checking Default Tooltip text', () => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                targetElement = document.getElementById('container_AxisIndex_0_MarkerPointer_0');
                trigger.mousemoveEvent(targetElement, 668.5, 223, (668.5 + 10), (223 + 10));    
                tooltipElement = document.getElementById('container_LinearGauge_Tooltip_text');
                expect(tooltipElement.querySelector('tspan').getAttribute('fill')).toBe('#FFFFFF');
                trigger.mousemoveEvent(gauge.element, 0, 0, 0, 0);
            };
            gauge.tooltip.enable = true;
            gauge.axes[0].pointers[0].value = 50;
            gauge.refresh();
        });

        it('Major tick MaterialDark theme', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_MajorTicksLine_0');
                expect(svg.getAttribute('fill')).toBe('#C8C8C8');
            };
            gauge.theme ='MaterialDark';
            gauge.refresh();
        });
        it('Minor MaterialDark theme', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_MinorTicksLine_0');
                expect(svg.getAttribute('fill')).toBe('#9A9A9A');
            };
            gauge.theme ='MaterialDark';
            gauge.refresh();
        });
        it('AxisLine MaterialDark theme', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_AxisLine_0');
                expect(svg.getAttribute('fill')).toBe('#C8C8C8');
            };
            gauge.theme ='MaterialDark';
            gauge.refresh();
        });
        it('pointer MaterialDark theme', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                expect(select("path#container_AxisIndex_0_MarkerPointer_0", args.gauge.element).getAttribute('fill')).toBe('#9A9A9A');
            };
            gauge.theme ='MaterialDark';
            gauge.refresh();
        });
        it('Axis label MaterialDark theme', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                let label: string = document.getElementById('container_Axis_0_Label_0').style.fill;
                expect(label).toBe('rgb(218, 218, 218)');
            };
            gauge.theme ='MaterialDark';
            gauge.refresh();
        });
        it('Background MaterialDark theme', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_LinearGaugeBorder');
                expect(svg.getAttribute('fill')).toBe('#333232');
            };
            gauge.theme ='MaterialDark';
            gauge.refresh();
        });
        it('Title MaterialDark theme', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                let title: string = document.getElementById('container_LinearGaugeTitle').style.fill;
                expect(title).toBe('rgb(255, 255, 255)');
            };
            gauge.theme ='MaterialDark';
            gauge.refresh();
        });
        it('Checking MaterialDark theme Tooltip', () => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                targetElement = document.getElementById('container_AxisIndex_0_MarkerPointer_0');
                trigger.mousemoveEvent(targetElement, 668.5, 223, (668.5 + 10), (223 + 10));
                tooltipElement = document.getElementById('container_LinearGauge_Tooltip_path');
                expect(tooltipElement.getAttribute('fill')).toBe('#FFFFFF');
                trigger.mousemoveEvent(gauge.element, 0, 0, 0, 0);
            };
            gauge.tooltip.enable = true;
            gauge.axes[0].pointers[0].value = 50;
            gauge.theme ='MaterialDark';
            gauge.refresh();
        });
        it('Checking MaterialDark Tooltip', () => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                targetElement = document.getElementById('container_AxisIndex_0_MarkerPointer_0');
                trigger.mousemoveEvent(targetElement, 668.5, 223, (668.5 + 10), (223 + 10));
                tooltipElement = document.getElementById('container_LinearGauge_Tooltip_text');
                expect(tooltipElement.querySelector('tspan').getAttribute('fill')).toBe('#000000');
                trigger.mousemoveEvent(gauge.element, 0, 0, 0, 0);
            };
            gauge.tooltip.enable = true;
            gauge.axes[0].pointers[0].value = 50;
            gauge.theme ='MaterialDark';
            gauge.refresh();
        });
        it('Major tick Highcontrast theme', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_MajorTicksLine_0');
                expect(svg.getAttribute('fill')).toBe('#FFFFFF');
            };
            gauge.theme ='HighContrast';
            gauge.refresh();
        });
        it('Minor Highcontrast theme', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_MinorTicksLine_0');
                expect(svg.getAttribute('fill')).toBe('#FFFFFF');
            };
            gauge.theme ='HighContrast';
            gauge.refresh();
        });
        it('AxisLine Highcontrast theme', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_AxisLine_0');
                expect(svg.getAttribute('fill')).toBe('#FFFFFF');
            };
            gauge.theme ='HighContrast';
            gauge.refresh();
        });
        it('pointer Highcontrast theme', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                expect(select("path#container_AxisIndex_0_MarkerPointer_0", args.gauge.element).getAttribute('fill')).toBe('#FFFFFF');
            };
            gauge.theme ='HighContrast';
            gauge.refresh();
        });
        it('Axis label Highcontrast theme', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                let label: string = document.getElementById('container_Axis_0_Label_0').style.fill;
                expect(label).toBe('rgb(255, 255, 255)');
            };
            gauge.theme ='HighContrast';
            gauge.refresh();
        });
        it('Background Highcontrast theme', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_LinearGaugeBorder');
                expect(svg.getAttribute('fill')).toBe('#000000');
            };
            gauge.theme ='HighContrast';
            gauge.refresh();
        });
        it('Title Highcontrast theme', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                let title: string = document.getElementById('container_LinearGaugeTitle').style.fill;
                expect(title).toBe('rgb(255, 255, 255)');
            };
            gauge.theme ='HighContrast';
            gauge.refresh();
        });
        it('Checking Highcontrast theme Tooltip', () => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                targetElement = document.getElementById('container_AxisIndex_0_MarkerPointer_0');
                trigger.mousemoveEvent(targetElement, 668.5, 223, (668.5 + 10), (223 + 10));
                tooltipElement = document.getElementById('container_LinearGauge_Tooltip_path');
                expect(tooltipElement.getAttribute('fill')).toBe('#ffffff');
                trigger.mousemoveEvent(gauge.element, 0, 0, 0, 0);
            };
            gauge.tooltip.enable = true;
            gauge.axes[0].pointers[0].value = 50;
            gauge.theme ='HighContrast';
            gauge.refresh();
        });
        it('Checking Highcontrast Tooltip text', () => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                targetElement = document.getElementById('container_AxisIndex_0_MarkerPointer_0');
                trigger.mousemoveEvent(targetElement, 668.5, 223, (668.5 + 10), (223 + 10));
                tooltipElement = document.getElementById('container_LinearGauge_Tooltip_text');
                expect(tooltipElement.querySelector('tspan').getAttribute('fill')).toBe('#000000');
                trigger.mousemoveEvent(gauge.element, 0, 0, 0, 0);
            };
            gauge.tooltip.enable = true;
            gauge.axes[0].pointers[0].value = 50;
            gauge.theme ='HighContrast';
            gauge.refresh();
        });
        it('Major tick Bootstrap4 theme', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_MajorTicksLine_0');
                expect(svg.getAttribute('fill')).toBe('#ADB5BD');
            };
            gauge.theme ='Bootstrap4';
            gauge.refresh();
        });
        it('Minor Bootstrap4 theme', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_MinorTicksLine_0');
                expect(svg.getAttribute('fill')).toBe('#CED4DA');
            };
            gauge.theme ='Bootstrap4';
            gauge.refresh();
        });
        it('AxisLine Bootstrap4 theme', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_AxisLine_0');
                expect(svg.getAttribute('fill')).toBe('#ADB5BD');
            };
            gauge.theme ='Bootstrap4';
            gauge.refresh();
        });
        it('pointer Bootstrap4 theme', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                expect(select("path#container_AxisIndex_0_MarkerPointer_0", args.gauge.element).getAttribute('fill')).toBe('#6C757D');
            };
            gauge.theme ='Bootstrap4';
            gauge.refresh();
        });
        it('Axis label Bootstrap4 theme', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                let label: string = document.getElementById('container_Axis_0_Label_0').style.fill;
                expect(label).toBe('rgb(33, 37, 41)');
            };
            gauge.theme ='Bootstrap4';
            gauge.refresh();
        });
        it('Background Bootstrap4 theme', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_LinearGaugeBorder');
                expect(svg.getAttribute('fill')).toBe('#FFFFFF');
            };
            gauge.theme ='Bootstrap4';
            gauge.refresh();
        });
        it('Title Bootstrap4 theme', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                let title: string = document.getElementById('container_LinearGaugeTitle').style.fill;
                expect(title).toBe('rgb(33, 37, 41)');
            };
            gauge.theme ='Bootstrap4';
            gauge.refresh();
        });
        it('Checking Bootstrap4 theme Tooltip', () => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                targetElement = document.getElementById('container_AxisIndex_0_MarkerPointer_0');
                trigger.mousemoveEvent(targetElement, 668.5, 223, (668.5 + 10), (223 + 10));
                tooltipElement = document.getElementById('container_LinearGauge_Tooltip_path');
                expect(tooltipElement.getAttribute('fill')).toBe('#000000');
                trigger.mousemoveEvent(gauge.element, 0, 0, 0, 0);
            };
            gauge.tooltip.enable = true;
            gauge.axes[0].pointers[0].value = 50;
            gauge.theme ='Bootstrap4';
            gauge.refresh();
        });
        it('Checking Bootstrap4 theme Tooltip opacity', () => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                targetElement = document.getElementById('container_AxisIndex_0_MarkerPointer_0');
                trigger.mousemoveEvent(targetElement, 668.5, 223, (668.5 + 10), (223 + 10));
                tooltipElement = document.getElementById('container_LinearGauge_Tooltip_path');
                expect(tooltipElement.getAttribute('opacity') == '0.9' || tooltipElement.getAttribute('opacity') == '1').toBe(true);
                trigger.mousemoveEvent(gauge.element, 0, 0, 0, 0);
            };
            gauge.tooltip.enable = true;
            gauge.axes[0].pointers[0].value = 50;
            gauge.theme ='Bootstrap4';
            gauge.refresh();
        });
        it('Checking Bootstrap4 Tooltip', () => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                targetElement = document.getElementById('container_AxisIndex_0_MarkerPointer_0');
                trigger.mousemoveEvent(targetElement, 668.5, 223, (668.5 + 10), (223 + 10));
                tooltipElement = document.getElementById('container_LinearGauge_Tooltip_text');
                expect(tooltipElement.querySelector('tspan').getAttribute('fill')).toBe('#000000');
                trigger.mousemoveEvent(gauge.element, 0, 0, 0, 0);
            };
            gauge.tooltip.enable = true;
            gauge.axes[0].pointers[0].value = 50;
            gauge.theme ='MaterialDark';
            gauge.refresh();
        });
        it('Checking Bootstrap4 theme Tooltip text opacity', () => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                targetElement = document.getElementById('container_AxisIndex_0_MarkerPointer_0');
                trigger.mousemoveEvent(targetElement, 668.5, 223, (668.5 + 10), (223 + 10));
                tooltipElement = document.getElementById('container_LinearGauge_Tooltip_text');
                expect(tooltipElement.getAttribute('opacity')).toBe('0.9');
                trigger.mousemoveEvent(gauge.element, 0, 0, 0, 0);
            };
            gauge.tooltip.enable = true;
            gauge.axes[0].pointers[0].value = 50;
            gauge.theme ='Bootstrap4';
            gauge.refresh();
        }); 
        it('Checking Bootstrap4 theme Tooltip font family', () => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                targetElement = document.getElementById('container_AxisIndex_0_MarkerPointer_0');
                trigger.mousemoveEvent(targetElement, 668.5, 223, (668.5 + 10), (223 + 10));
                tooltipElement = document.getElementById('container_LinearGauge_Tooltip_text');
                expect(tooltipElement.getAttribute('font-family')).toBe('HelveticaNeue-Medium');
                trigger.mousemoveEvent(gauge.element, 0, 0, 0, 0);
            };
            gauge.tooltip.enable = true;
            gauge.axes[0].pointers[0].value = 50;
            gauge.theme ='Bootstrap4';
            gauge.refresh();
        });
        it('Checking Bootstrap4 theme Tooltip font size', () => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                targetElement = document.getElementById('container_AxisIndex_0_MarkerPointer_0');
                trigger.mousemoveEvent(targetElement, 668.5, 223, (668.5 + 10), (223 + 10));
                tooltipElement = document.getElementById('container_LinearGauge_Tooltip_text');
                expect(tooltipElement.getAttribute('font-size')).toBe('13px');
                trigger.mousemoveEvent(gauge.element, 0, 0, 0, 0);
            };
            gauge.tooltip.enable = true;
            gauge.axes[0].pointers[0].value = 50;
            gauge.theme ='Bootstrap4';
            gauge.refresh();
        });

        it('Major tick Material3 theme', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_MajorTicksLine_0');
                expect(svg.getAttribute('fill')).toBe('#C4C7C5');
            };
            gauge.theme ='Material3';
            gauge.refresh();
        });
        it('Minor Material3 theme', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_MinorTicksLine_0');
                expect(svg.getAttribute('fill')).toBe('#C4C7C5');
            };
            gauge.theme ='Material3';
            gauge.refresh();
        });
        it('AxisLine Material3 theme', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_AxisLine_0');
                expect(svg.getAttribute('fill')).toBe('#C4C7C5');
            };
            gauge.theme ='Material3';
            gauge.refresh();
        });
        it('pointer Material3 theme', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                expect(select("path#container_AxisIndex_0_MarkerPointer_0", args.gauge.element).getAttribute('fill')).toBe('#49454E');
            };
            gauge.theme ='Material3';
            gauge.refresh();
        });
        it('Axis label Material3 theme', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                let label: string = document.getElementById('container_Axis_0_Label_0').style.fill;
                expect(label).toBe('rgb(30, 25, 43)');
            };
            gauge.theme ='Material3';
            gauge.refresh();
        });
        it('Background Material3 theme', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_LinearGaugeBorder');
                expect(svg.getAttribute('fill')).toBe('transparent');
            };
            gauge.theme ='Material3';
            gauge.refresh();
        });
        it('Title Material3 theme', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                let title: string = document.getElementById('container_LinearGaugeTitle').style.fill;
                expect(title).toBe('rgb(28, 27, 31)');
            };
            gauge.theme ='Material3';
            gauge.refresh();
        });
        it('Checking Material3 theme Tooltip', () => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                targetElement = document.getElementById('container_AxisIndex_0_MarkerPointer_0');
                trigger.mousemoveEvent(targetElement, 668.5, 223, (668.5 + 10), (223 + 10));
                tooltipElement = document.getElementById('container_LinearGauge_Tooltip_path');
                expect(tooltipElement.getAttribute('fill')).toBe('#313033');
                trigger.mousemoveEvent(gauge.element, 0, 0, 0, 0);
            };
            gauge.tooltip.enable = true;
            gauge.axes[0].pointers[0].value = 50;
            gauge.theme ='Material3';
            gauge.refresh();
        });
        it('Checking Material3 theme Tooltip opacity', () => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                targetElement = document.getElementById('container_AxisIndex_0_MarkerPointer_0');
                trigger.mousemoveEvent(targetElement, 668.5, 223, (668.5 + 10), (223 + 10));
                tooltipElement = document.getElementById('container_LinearGauge_Tooltip_path');
                expect(tooltipElement.getAttribute('opacity') == '0.9' || tooltipElement.getAttribute('opacity') == '1').toBe(true);
                trigger.mousemoveEvent(gauge.element, 0, 0, 0, 0);
            };
            gauge.tooltip.enable = true;
            gauge.axes[0].pointers[0].value = 50;
            gauge.theme ='Material3';
            gauge.refresh();
        });
        it('Checking Material3 Tooltip', () => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                targetElement = document.getElementById('container_AxisIndex_0_MarkerPointer_0');
                trigger.mousemoveEvent(targetElement, 668.5, 223, (668.5 + 10), (223 + 10));
                tooltipElement = document.getElementById('container_LinearGauge_Tooltip_text');
                expect(tooltipElement.querySelector('tspan').getAttribute('fill')).toBe('#F4EFF4');
                trigger.mousemoveEvent(gauge.element, 0, 0, 0, 0);
            };
            gauge.tooltip.enable = true;
            gauge.axes[0].pointers[0].value = 50;
            gauge.theme ='Material3';
            gauge.refresh();
        });
        it('Checking Material3 theme Tooltip text opacity', () => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                targetElement = document.getElementById('container_AxisIndex_0_MarkerPointer_0');
                trigger.mousemoveEvent(targetElement, 668.5, 223, (668.5 + 10), (223 + 10));
                tooltipElement = document.getElementById('container_LinearGauge_Tooltip_text');
                expect(tooltipElement.getAttribute('opacity')).toBe('1');
                trigger.mousemoveEvent(gauge.element, 0, 0, 0, 0);
            };
            gauge.tooltip.enable = true;
            gauge.axes[0].pointers[0].value = 50;
            gauge.theme ='Material3';
            gauge.refresh();
        }); 
        it('Checking Material3 theme Tooltip font family', () => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                targetElement = document.getElementById('container_AxisIndex_0_MarkerPointer_0');
                trigger.mousemoveEvent(targetElement, 668.5, 223, (668.5 + 10), (223 + 10));
                tooltipElement = document.getElementById('container_LinearGauge_Tooltip_text');
                expect(tooltipElement.getAttribute('font-family')).toBe('Roboto');
                trigger.mousemoveEvent(gauge.element, 0, 0, 0, 0);
            };
            gauge.tooltip.enable = true;
            gauge.axes[0].pointers[0].value = 50;
            gauge.theme ='Material3';
            gauge.refresh();
        });
        it('Checking Material3 theme Tooltip font size', () => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                targetElement = document.getElementById('container_AxisIndex_0_MarkerPointer_0');
                trigger.mousemoveEvent(targetElement, 668.5, 223, (668.5 + 10), (223 + 10));
                tooltipElement = document.getElementById('container_LinearGauge_Tooltip_text');
                expect(tooltipElement.getAttribute('font-size')).toBe('14px');
                trigger.mousemoveEvent(gauge.element, 0, 0, 0, 0);
            };
            gauge.tooltip.enable = true;
            gauge.axes[0].pointers[0].value = 50;
            gauge.theme ='Material3';
            gauge.refresh();
        }); 
        
        it('Major tick Material3Dark theme', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_MajorTicksLine_0');
                expect(svg.getAttribute('fill')).toBe('#938F99');
            };
            gauge.theme ='Material3Dark';
            gauge.refresh();
        });
        it('Minor Material3Dark theme', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_MinorTicksLine_0');
                expect(svg.getAttribute('fill')).toBe('#938F99');
            };
            gauge.theme ='Material3Dark';
            gauge.refresh();
        });
        it('AxisLine Material3Dark theme', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_AxisLine_0');
                expect(svg.getAttribute('fill')).toBe('#938F99');
            };
            gauge.theme ='Material3Dark';
            gauge.refresh();
        });
        it('pointer Material3Dark theme', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                expect(select("path#container_AxisIndex_0_MarkerPointer_0", args.gauge.element).getAttribute('fill')).toBe('#CAC4D0');
            };
            gauge.theme ='Material3Dark';
            gauge.refresh();
        });
        it('Axis label Material3Dark theme', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                let label: string = document.getElementById('container_Axis_0_Label_0').style.fill;
                expect(label).toBe('rgb(230, 225, 229)');
            };
            gauge.theme ='Material3Dark';
            gauge.refresh();
        });
        it('Background Material3Dark theme', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_LinearGaugeBorder');
                expect(svg.getAttribute('fill')).toBe('transparent');
            };
            gauge.theme ='Material3Dark';
            gauge.refresh();
        });
        it('Title Material3Dark theme', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                let title: string = document.getElementById('container_LinearGaugeTitle').style.fill;
                expect(title).toBe('rgb(230, 225, 229)');
            };
            gauge.theme ='Material3Dark';
            gauge.refresh();
        });
        it('Checking Material3Dark theme Tooltip', () => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                targetElement = document.getElementById('container_AxisIndex_0_MarkerPointer_0');
                trigger.mousemoveEvent(targetElement, 668.5, 223, (668.5 + 10), (223 + 10));
                tooltipElement = document.getElementById('container_LinearGauge_Tooltip_path');
                expect(tooltipElement.getAttribute('fill')).toBe('#E6E1E5');
                trigger.mousemoveEvent(gauge.element, 0, 0, 0, 0);
            };
            gauge.tooltip.enable = true;
            gauge.axes[0].pointers[0].value = 50;
            gauge.theme ='Material3Dark';
            gauge.refresh();
        });
        it('Checking Material3Dark theme Tooltip opacity', () => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                targetElement = document.getElementById('container_AxisIndex_0_MarkerPointer_0');
                trigger.mousemoveEvent(targetElement, 668.5, 223, (668.5 + 10), (223 + 10));
                tooltipElement = document.getElementById('container_LinearGauge_Tooltip_path');
                expect(tooltipElement.getAttribute('opacity') == '0.9' || tooltipElement.getAttribute('opacity') == '1').toBe(true);
                trigger.mousemoveEvent(gauge.element, 0, 0, 0, 0);
            };
            gauge.tooltip.enable = true;
            gauge.axes[0].pointers[0].value = 50;
            gauge.theme ='Material3Dark';
            gauge.refresh();
        });
        it('Checking Material3Dark Tooltip', () => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                targetElement = document.getElementById('container_AxisIndex_0_MarkerPointer_0');
                trigger.mousemoveEvent(targetElement, 668.5, 223, (668.5 + 10), (223 + 10));
                tooltipElement = document.getElementById('container_LinearGauge_Tooltip_text');
                expect(tooltipElement.querySelector('tspan').getAttribute('fill')).toBe('#313033');
                trigger.mousemoveEvent(gauge.element, 0, 0, 0, 0);
            };
            gauge.tooltip.enable = true;
            gauge.axes[0].pointers[0].value = 50;
            gauge.theme ='Material3Dark';
            gauge.refresh();
        });
        it('Checking Material3Dark theme Tooltip text opacity', () => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                targetElement = document.getElementById('container_AxisIndex_0_MarkerPointer_0');
                trigger.mousemoveEvent(targetElement, 668.5, 223, (668.5 + 10), (223 + 10));
                tooltipElement = document.getElementById('container_LinearGauge_Tooltip_text');
                expect(tooltipElement.getAttribute('opacity')).toBe('1');
                trigger.mousemoveEvent(gauge.element, 0, 0, 0, 0);
            };
            gauge.tooltip.enable = true;
            gauge.axes[0].pointers[0].value = 50;
            gauge.theme ='Material3Dark';
            gauge.refresh();
        }); 
        it('Checking Material3Dark theme Tooltip font family', () => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                targetElement = document.getElementById('container_AxisIndex_0_MarkerPointer_0');
                trigger.mousemoveEvent(targetElement, 668.5, 223, (668.5 + 10), (223 + 10));
                tooltipElement = document.getElementById('container_LinearGauge_Tooltip_text');
                expect(tooltipElement.getAttribute('font-family')).toBe('Roboto');
                trigger.mousemoveEvent(gauge.element, 0, 0, 0, 0);
            };
            gauge.tooltip.enable = true;
            gauge.axes[0].pointers[0].value = 50;
            gauge.theme ='Material3Dark';
            gauge.refresh();
        });
        it('Checking Material3Dark theme Tooltip font size', () => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                targetElement = document.getElementById('container_AxisIndex_0_MarkerPointer_0');
                trigger.mousemoveEvent(targetElement, 668.5, 223, (668.5 + 10), (223 + 10));
                tooltipElement = document.getElementById('container_LinearGauge_Tooltip_text');
                expect(tooltipElement.getAttribute('font-size')).toBe('14px');
                trigger.mousemoveEvent(gauge.element, 0, 0, 0, 0);
            };
            gauge.tooltip.enable = true;
            gauge.axes[0].pointers[0].value = 50;
            gauge.theme ='Material3Dark';
            gauge.refresh();
        });
        it('Major tick FluentDark theme', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_MajorTicksLine_0');
                expect(svg.getAttribute('fill')).toBe('#484644');
            };
            gauge.theme ='FluentDark';
            gauge.refresh();
        });
        it('Minor FluentDark theme', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_MinorTicksLine_0');
                expect(svg.getAttribute('fill')).toBe('#484644');
            };
            gauge.theme ='FluentDark';
            gauge.refresh();
        });
        it('AxisLine FluentDark theme', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_AxisLine_0');
                expect(svg.getAttribute('fill')).toBe('#292827');
            };
            gauge.theme ='FluentDark';
            gauge.refresh();
        });
        it('Major tick Fluent theme', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_MajorTicksLine_0');
                expect(svg.getAttribute('fill')).toBe('#C8C6C4');
            };
            gauge.theme ='Fluent';
            gauge.refresh();
        });
        it('Minor Fluent theme', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_MinorTicksLine_0');
                expect(svg.getAttribute('fill')).toBe('#C8C6C4');
            };
            gauge.theme ='Fluent';
            gauge.refresh();
        });
        it('AxisLine Fluent theme', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_AxisLine_0');
                expect(svg.getAttribute('fill')).toBe('#EDEBE9');
            };
            gauge.theme ='Fluent';
            gauge.refresh();
        });
        it('Major tick Tailwind theme', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_MajorTicksLine_0');
                expect(svg.getAttribute('fill')).toBe('#9CA3AF');
            };
            gauge.theme = 'Tailwind'
            gauge.refresh();
        });
        it('Major tick TailwindDark theme', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_MajorTicksLine_0');
                expect(svg.getAttribute('fill')).toBe('#6B7280');
            };
            gauge.theme = 'TailwindDark'
            gauge.refresh();
        });
        it('Major tick Bootstrap5 theme', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_MajorTicksLine_0');
                expect(svg.getAttribute('fill')).toBe('#9CA3AF');
            };
            gauge.theme = 'Bootstrap5'
            gauge.refresh();
        });
        it('Major tick Bootstrap5Dark theme', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_MajorTicksLine_0');
                expect(svg.getAttribute('fill')).toBe('#6C757D');
            };
            gauge.theme = 'Bootstrap5Dark'
            gauge.refresh();
        }); 
    });
    });