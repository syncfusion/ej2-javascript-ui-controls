import { createElement } from '@syncfusion/ej2-base';
import { CircularGauge } from '../../../src/circular-gauge/circular-gauge';
import { Range, Pointer } from '../../../src/circular-gauge/axes/axis';
import { ILoadedEventArgs, IAnimationCompleteEventArgs } from '../../../src/circular-gauge/model/interface';
import { GaugeLocation } from '../../../src/circular-gauge/utils/helper-common';
import { GaugeTooltip } from '../../../src/circular-gauge/user-interaction/tooltip';
import { MouseEvents } from '../user-interaction/mouse-events.spec';
CircularGauge.Inject(GaugeTooltip);
describe('Circular-Gauge Control', () => {
    let gauge: CircularGauge;
    let ele: HTMLElement;
    let svg: HTMLElement;
    let svg1: HTMLElement;
    let location: GaugeLocation;
    let boundingRect: ClientRect;
    let boundingRect1: ClientRect;
    let trigger: MouseEvents = new MouseEvents();
    let value: string[] | string | number;
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });

    describe('Checking the theme in', () => {
        beforeAll((): void => {
            ele = createElement('div', { id: 'container' });
            document.body.appendChild(ele);
            gauge = new CircularGauge({
                title: 'Progress Tracker',
                tooltip: {
                    enable: true,
                    enableAnimation: false
                },
                axes: [{
                    minimum: 0,
                    maximum: 170,
                    labelStyle: {
                        position: 'Inside', useRangeColor: false,
                        font: { size: '0px', fontFamily: 'Roboto', fontStyle: 'Regular' }
                    },
                    lineStyle: { width: 2},
                    majorTicks: {
                        position: 'Inside', width: 2, height: 10, interval: 20
                    }, minorTicks: {
                        position: 'Inside', height: 5, width: 2, interval: 10
                    },
                    pointers: [{
                        value: 60,
                        radius: '60%',
                        pointerWidth: 7,
                        cap: {
                            radius: 8,
                            border: { width: 0 }
                        },
                        needleTail: {
                            length: '25%'
                        }
                    }]
                }]
            });
            gauge.appendTo('#container');
        });
        afterAll((): void => {
            gauge.destroy();
            ele.remove();
        });
        it('Major tick default color', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_Major_TickLine_0_0');
                expect(svg.getAttribute('stroke')).toBe('#9E9E9E');
            };
            gauge.refresh();
        });
        it('Minor default color', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_Minor_TickLine_0_10');
                expect(svg.getAttribute('stroke')).toBe('#9E9E9E');
            };
            gauge.refresh();
        });
        it('AxisLine default color', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_AxisLine_0');
                expect(svg.getAttribute('stroke')).toBe('#E0E0E0');
            };
            gauge.refresh();
        });
        it('Axis label default color', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Label_0');
                expect(svg.getAttribute('fill')).toBe('#212121');
            };
            gauge.refresh();
        });
        it('Background default color', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_CircularGaugeBorder');
                expect(svg.getAttribute('fill')).toBe('#FFFFFF');
            };
            gauge.refresh();
        });
        it('Title default color', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_CircularGaugeTitle');
                expect(svg.getAttribute('fill')).toBe('#424242');
            };
            gauge.refresh();
        });
        
        it('Needle cap default color', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Pointer_NeedleCap_0');
                expect(svg.getAttribute('fill')).toBe('#757575');
            };
            gauge.refresh();
        });
        it('Needle default color', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Pointer_Needle_0');
                expect(svg.getAttribute('fill')).toBe('#757575');
            };
            gauge.refresh();
        });
        it('Needle Trail default color', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Pointer_NeedleTail_0');
                expect(svg.getAttribute('fill')).toBe('#757575');
            };
            gauge.refresh();
        });
        it('tooltip fill  default color', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Pointer_NeedleRect_0');
                debugger;
                trigger.mousemoveEvent(svg, 202.125, 233, 151.875, 7);
                let tooltip: Element = document.getElementById('container_CircularGauge_Tooltip_path')
                expect(tooltip.getAttribute('fill')).toBe('#363F4C');
            };
            gauge.refresh();
        });
        it('tooltip text color default color', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Pointer_NeedleRect_0');
                debugger;
                trigger.mousemoveEvent(svg, 202.125, 233, 151.875, 7);
                let tooltip: Element = document.getElementById('container_CircularGauge_Tooltip_text')
                expect(tooltip.querySelector('tspan').getAttribute('fill')).toBe('#ffffff');
            };
            gauge.refresh();
        });
        it('pointer default color', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Pointer_RangeBar_0');
                expect(svg.getAttribute('fill')).toBe('#757575');
            };
            gauge.axes[0].pointers[0].type ='RangeBar';
            gauge.refresh();
        });

    });

    describe('Checking the theme in', () => {
        beforeAll((): void => {
            ele = createElement('div', { id: 'container' });
            document.body.appendChild(ele);
            gauge = new CircularGauge({
                title: 'Progress Tracker',
                tooltip: {
                    enable: true,
                    enableAnimation: false
                },
                theme:'MaterialDark',
                axes: [{
                    minimum: 0,
                    maximum: 170,
                    labelStyle: {
                        position: 'Inside', useRangeColor: false,
                        font: { size: '0px', fontFamily: 'Roboto', fontStyle: 'Regular' }
                    },
                    lineStyle: { width: 2},
                    majorTicks: {
                        position: 'Inside', width: 2, height: 10, interval: 20
                    }, minorTicks: {
                        position: 'Inside', height: 5, width: 2, interval: 10
                    },
                    pointers: [{
                        value: 60,
                        radius: '60%',
                        pointerWidth: 7,
                        cap: {
                            radius: 8,
                            border: { width: 0 }
                        },
                        needleTail: {
                            length: '25%'
                        }
                    }]
                }]
            });
            gauge.appendTo('#container');
        });
        afterAll((): void => {
            gauge.destroy();
            ele.remove();
        });
        it('Major tick Material color', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_Major_TickLine_0_0');
                expect(svg.getAttribute('stroke')).toBe('#C8C8C8');
            };
            gauge.refresh();
        });
        it('Minor Material color', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_Minor_TickLine_0_10');
                expect(svg.getAttribute('stroke')).toBe('#9A9A9A');
            };
            gauge.refresh();
        });
        it('AxisLine Material color', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_AxisLine_0');
                expect(svg.getAttribute('stroke')).toBe('#C8C8C8');
            };
            gauge.refresh();
        });
        it('Axis label Material color', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Label_0');
                expect(svg.getAttribute('fill')).toBe('#DADADA');
            };
            gauge.refresh();
        });
        it('Background Material color', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_CircularGaugeBorder');
                expect(svg.getAttribute('fill')).toBe('#333232');
            };
            gauge.refresh();
        });
        it('Title Material color', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_CircularGaugeTitle');
                expect(svg.getAttribute('fill')).toBe('#ffffff');
            };
            gauge.refresh();
        });
        
        it('Needle cap Material color', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Pointer_NeedleCap_0');
                expect(svg.getAttribute('fill')).toBe('#9A9A9A');
            };
            gauge.refresh();
        });
        it('Needle Material color', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Pointer_Needle_0');
                expect(svg.getAttribute('fill')).toBe('#9A9A9A');
            };
            gauge.refresh();
        });
        it('Needle Material default color', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Pointer_NeedleTail_0');
                expect(svg.getAttribute('fill')).toBe('#9A9A9A');
            };
            gauge.refresh();
        });
        it('tooltip fill  Material color', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Pointer_NeedleRect_0');
                debugger;
                trigger.mousemoveEvent(svg, 202.125, 233, 151.875, 7);
                let tooltip: Element = document.getElementById('container_CircularGauge_Tooltip_path')
                expect(tooltip.getAttribute('fill')).toBe('#FFFFFF');
            };
            gauge.refresh();
        });
        it('tooltip text color Material color', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Pointer_NeedleRect_0');
                debugger;
                trigger.mousemoveEvent(svg, 202.125, 233, 151.875, 7);
                let tooltip: Element = document.getElementById('container_CircularGauge_Tooltip_text')
                expect(tooltip.querySelector('tspan').getAttribute('fill')).toBe('#000000');
            };
            gauge.refresh();
        });
        it('pointer Material color', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Pointer_RangeBar_0');
                expect(svg.getAttribute('fill')).toBe('#9A9A9A');
            };
            gauge.axes[0].pointers[0].type ='RangeBar';
            gauge.refresh();
        });

    });
    describe('Checking the theme in', () => {
        beforeAll((): void => {
            ele = createElement('div', { id: 'container' });
            document.body.appendChild(ele);
            gauge = new CircularGauge({
                theme: 'HighContrast',
                title: 'Progress Tracker',
                tooltip: {
                    enable: true,
                    enableAnimation: false
                },
                axes: [{
                    minimum: 0,
                    maximum: 170,
                    labelStyle: {
                        position: 'Inside', useRangeColor: false,
                        font: { size: '0px', fontFamily: 'Roboto', fontStyle: 'Regular' }
                    },
                    lineStyle: { width: 2},
                    majorTicks: {
                        position: 'Inside', width: 2, height: 10, interval: 20
                    }, minorTicks: {
                        position: 'Inside', height: 5, width: 2, interval: 10
                    },
                    pointers: [{
                        value: 60,
                        radius: '60%',
                        pointerWidth: 7,
                        cap: {
                            radius: 8,
                            border: { width: 0 }
                        },
                        needleTail: {
                            length: '25%'
                        }
                    }]
                }]
            });
            gauge.appendTo('#container');
        });
        afterAll((): void => {
            gauge.destroy();
            ele.remove();
        });
        it('Major tick Highcontrast color', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_Major_TickLine_0_0');
                expect(svg.getAttribute('stroke')).toBe('#FFFFFF');
            };
            gauge.refresh();
        });
        it('Minor Highcontrast color', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_Minor_TickLine_0_10');
                expect(svg.getAttribute('stroke')).toBe('#FFFFFF');
            };
            gauge.refresh();
        });
        it('AxisLine Highcontrast color', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_AxisLine_0');
                expect(svg.getAttribute('stroke')).toBe('#FFFFFF');
            };
            gauge.refresh();
        });
        it('Axis label Highcontrast color', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Label_0');
                expect(svg.getAttribute('fill')).toBe('#FFFFFF');
            };
            gauge.refresh();
        });
        it('Background Highcontrast color', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_CircularGaugeBorder');
                expect(svg.getAttribute('fill')).toBe('#000000');
            };
            gauge.refresh();
        });
        it('Title Highcontrast color', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_CircularGaugeTitle');
                expect(svg.getAttribute('fill')).toBe('#FFFFFF');
            };
            gauge.refresh();
        });
        
        it('Needle cap Highcontrast color', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Pointer_NeedleCap_0');
                expect(svg.getAttribute('fill')).toBe('#FFFFFF');
            };
            gauge.refresh();
        });
        it('Needle Highcontrast color', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Pointer_Needle_0');
                expect(svg.getAttribute('fill')).toBe('#FFFFFF');
            };
            gauge.refresh();
        });
        it('Needle Highcontrast default color', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Pointer_NeedleTail_0');
                expect(svg.getAttribute('fill')).toBe('#FFFFFF');
            };
            gauge.refresh();
        });
        it('tooltip fill  Highcontrast color', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Pointer_NeedleRect_0');
                debugger;
                trigger.mousemoveEvent(svg, 202.125, 233, 151.875, 7);
                let tooltip: Element = document.getElementById('container_CircularGauge_Tooltip_path')
                expect(tooltip.getAttribute('fill')).toBe('#ffffff');
            };
            gauge.refresh();
        });
        it('tooltip text color Highcontrast color', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Pointer_NeedleRect_0');
                debugger;
                trigger.mousemoveEvent(svg, 202.125, 233, 151.875, 7);
                let tooltip: Element = document.getElementById('container_CircularGauge_Tooltip_text')
                expect(tooltip.querySelector('tspan').getAttribute('fill')).toBe('#000000');
            };
            gauge.refresh();
        });
        it('pointer Highcontrast color', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Pointer_RangeBar_0');
                expect(svg.getAttribute('fill')).toBe('#FFFFFF');
            };
            gauge.axes[0].pointers[0].type ='RangeBar';
            gauge.refresh();
        });

    });

    describe('Checking the theme in', () => {
        beforeAll((): void => {
            ele = createElement('div', { id: 'container' });
            document.body.appendChild(ele);
            gauge = new CircularGauge({
                title: 'Progress Tracker',
                tooltip: {
                    enable: true,
                    enableAnimation: false
                },
                theme:'Bootstrap4',
                axes: [{
                    minimum: 0,
                    maximum: 170,
                    labelStyle: {
                        position: 'Inside', useRangeColor: false,
                        font: { fontFamily: 'Roboto', fontStyle: 'Regular' }
                    },
                    lineStyle: { width: 2},
                    majorTicks: {
                        position: 'Inside', width: 2, height: 10, interval: 20
                    }, minorTicks: {
                        position: 'Inside', height: 5, width: 2, interval: 10
                    },
                    pointers: [{
                        value: 60,
                        radius: '60%',
                        pointerWidth: 7,
                        cap: {
                            radius: 8,
                            border: { width: 0 }
                        },
                        needleTail: {
                            length: '25%'
                        }
                    }]
                }]
            });
            gauge.appendTo('#container');
        });
        afterAll((): void => {
            gauge.destroy();
            ele.remove();
        });
        it('Major tick Bootstrap4 color', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_Major_TickLine_0_0');
                expect(svg.getAttribute('stroke')).toBe('#ADB5BD');
            };
            gauge.refresh();
        });
        it('Minor Bootstrap4 color', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_Minor_TickLine_0_10');
                expect(svg.getAttribute('stroke')).toBe('#CED4DA');
            };
            gauge.refresh();
        });
        it('AxisLine Bootstrap4 color', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_AxisLine_0');
                expect(svg.getAttribute('stroke')).toBe('#DEE2E6');
            };
            gauge.refresh();
        });
        it('Axis label Bootstrap4 color', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Label_0');
                expect(svg.getAttribute('fill')).toBe('#212529');
            };
            gauge.refresh();
        });
        it('Axis label font family Bootstrap4 color', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Label_0');
                expect(svg.style.fontFamily).toBe('Roboto');
            };
            gauge.refresh();
        });
        it('Background Bootstrap4 color', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_CircularGaugeBorder');
                expect(svg.getAttribute('fill')).toBe('#FFFFFF');
            };
            gauge.refresh();
        });
        it('Title Bootstrap4 color', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_CircularGaugeTitle');
                expect(svg.getAttribute('fill')).toBe('#212529');
            };
            gauge.refresh();
        });
        it('Title font family Bootstrap4 color', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_CircularGaugeTitle');
                expect(svg.style.fontFamily).toBe('HelveticaNeue-Medium');
            };
            gauge.refresh();
        });
        it('Title font size Bootstrap4 color', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_CircularGaugeTitle');
                expect(svg.style.fontSize).toBe('16px');
            };
            gauge.refresh();
        });
        
        it('Needle cap Bootstrap4 color', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Pointer_NeedleCap_0');
                expect(svg.getAttribute('fill')).toBe('#6C757D');
            };
            gauge.refresh();
        });
        it('Needle Bootstrap4 color', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Pointer_Needle_0');
                expect(svg.getAttribute('fill')).toBe('#6C757D');
            };
            gauge.refresh();
        });
        it('Needle Bootstrap4 default color', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Pointer_NeedleTail_0');
                expect(svg.getAttribute('fill')).toBe('#6C757D');
            };
            gauge.refresh();
        });
        it('tooltip Bootstrap4 color', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Pointer_NeedleRect_0');
                debugger;
                trigger.mousemoveEvent(svg, 202.125, 233, 151.875, 7);
                let tooltip: Element = document.getElementById('container_CircularGauge_Tooltip_text')
                expect(tooltip.getAttribute('font-family')).toBe('HelveticaNeue-Medium');
            };
            gauge.refresh();
        });
        it('tooltip text color Bootstrap4 color', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Pointer_NeedleRect_0');
                debugger;
                trigger.mousemoveEvent(svg, 202.125, 233, 151.875, 7);
                let tooltip: Element = document.getElementById('container_CircularGauge_Tooltip_text')
                expect(tooltip.querySelector('tspan').getAttribute('fill')).toBe('#FFFFFF');
            };
            gauge.refresh();
        });
        it('tooltip fill  Bootstrap4 color', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Pointer_NeedleRect_0');
                debugger;
                trigger.mousemoveEvent(svg, 202.125, 233, 151.875, 7);
                let tooltip: Element = document.getElementById('container_CircularGauge_Tooltip_path')
                expect(tooltip.getAttribute('fill')).toBe('#000000');
            };
            gauge.refresh();
        });
        it('tooltip opacity  Bootstrap4 color', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Pointer_NeedleRect_0');
                debugger;
                trigger.mousemoveEvent(svg, 202.125, 233, 151.875, 7);
                let tooltip: Element = document.getElementById('container_CircularGauge_Tooltip_path')
                expect(tooltip.getAttribute('opacity')).toBe('1');
            };
            gauge.refresh();
        });
        it('tooltip opacity  Bootstrap4 color', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Pointer_NeedleRect_0');
                debugger;
                trigger.mousemoveEvent(svg, 202.125, 233, 151.875, 7);
                let tooltip: Element = document.getElementById('container_CircularGauge_Tooltip_text')
                expect(tooltip.getAttribute('opacity')).toBe('0.9');
            };
            gauge.refresh();
        });
        it('pointer Bootstrap4 color', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Pointer_RangeBar_0');
                expect(svg.getAttribute('fill')).toBe('#6C757D');
            };
            gauge.axes[0].pointers[0].type ='RangeBar';
            gauge.refresh();
        });
        
    });
});
