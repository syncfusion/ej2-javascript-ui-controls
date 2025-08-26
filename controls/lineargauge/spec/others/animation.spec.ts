import { Browser, EventHandler, createElement, EmitType } from '@syncfusion/ej2-base';
import { GaugeTooltip } from '../../src/linear-gauge/user-interaction/tooltip';
import { ILoadedEventArgs,  ILoadEventArgs, IAnimationCompleteEventArgs } from '../../src/linear-gauge/model/interface';
import { LinearGauge } from '../../src/linear-gauge/linear-gauge';
import { Annotations } from '../../src/linear-gauge/annotations/annotations';
import { MouseEvents } from '../base/events.spec';
import  {profile , inMB, getMemoryProfile} from '../common.spec';
LinearGauge.Inject(GaugeTooltip, Annotations);
describe('Linear gauge control', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            pending(); //Skips test (in Chai)
            return;
        } 
    });
    describe('Checking animation duration as 2000 Horizontal', () => {
        let gauge: LinearGauge;
        let element: HTMLElement;
        let svg: HTMLElement;
        let trigger: MouseEvents = new MouseEvents();
        beforeAll((): void => {
            element = createElement('div', { id: 'animationContainer' });
            document.body.appendChild(element);
            gauge = new LinearGauge({
            container: {
                width: 13,
                roundedCornerRadius: 5,
                type: 'Thermometer'
            },
            animationDuration: 1000,
            orientation: 'Horizontal',
            axes: [{
                pointers: [
                    {
                        value: 10,
                        height: 15,
                        width: 15,
                        placement: 'Near',
                        color: '#757575',
                        offset: -50,
                        markerType: 'Triangle'
                    },
                    {
                        value: 30,
                        height: 15,
                        width: 15,
                        placement: 'Near',
                        color: '#757575',
                        offset: -50,
                        markerType: 'Circle'
                    },
                    {
                        value: 50,
                        height: 15,
                        width: 15,
                        placement: 'Near',
                        color: '#757575',
                        offset: -50,
                        type: 'Bar',
                    }
            ],            
            }],
            annotations: [{
                content: '<div id="pointer" style="width:70px"><h1 style="font-size:14px;color:#424242">10 MPH</h1></div>',
                axisIndex: 0,
                axisValue: 10,
                x: 10, zIndex: '1',
                y: -70
            }]
    });
    gauge.appendTo('#animationContainer');
    });
    afterAll((): void => {
        element.remove();
    });
    it('checking with horizontal orentation with annotation', async (): Promise<void> => {
        await wait(2000); // Wait for 5 seconds
        svg = document.getElementById('animationContainer_AnnotationsGroup');
        expect(svg.childElementCount === 1).toBe(true);
    });
    it('checking with marker pointer in horizontal and type Thermometer', async (): Promise<void> => {
        svg = document.getElementById('animationContainer_AxisIndex_0_BarPointer_2');
        expect(svg.getAttribute('fill')).toBe('#757575');
    });
});
    describe('Checking animation duration as 2000', () => {
        let gauge: LinearGauge;
        let element: HTMLElement;
        let svg: HTMLElement;
        let trigger: MouseEvents = new MouseEvents();
        beforeAll((): void => {
            element = createElement('div', { id: 'animationContainerVertical' });
            document.body.appendChild(element);
            gauge = new LinearGauge({
            container: {
                width: 13,
                roundedCornerRadius: 5,
                type: 'Thermometer'
            },
            animationDuration: 1000,
                    orientation: 'Vertical',
                    axes: [{
                        pointers: [
                            {
                                value: 10,
                                height: 15,
                                width: 15,
                                placement: 'Near',
                                color: '#757575',
                                offset: -50,
                                markerType: 'Triangle'
                            },
                            {
                                value: 30,
                                height: 15,
                                width: 15,
                                placement: 'Near',
                                color: '#757575',
                                offset: -50,
                                markerType: 'Circle'
                            },
                            {
                                value: 50,
                                height: 15,
                                width: 15,
                                placement: 'Near',
                                color: '#757575',
                                offset: -50,
                                type: 'Bar',
                            }
                    ],            
                    }],
                    annotations: [{
                        content: '<div id="pointer" style="width:70px"><h1 style="font-size:14px;color:#424242">10 MPH</h1></div>',
                        axisIndex: 0,
                        axisValue: 10,
                        x: 10, zIndex: '1',
                        y: -70
                    }]
            });
            gauge.appendTo('#animationContainerVertical');
        });
        afterAll((): void => {
            element.remove();
        });
        it('checking with therometer with one annotation', async (): Promise<void> => {
            await wait(2000); // Wait for 5 seconds
            svg = document.getElementById('animationContainerVertical_AnnotationsGroup');
            expect(svg.childElementCount === 1).toBe(true);
        });
        it('checking with marker pointer in vertical and type Thermometer', async (): Promise<void> => {
            svg = document.getElementById('animationContainerVertical_AxisIndex_0_MarkerPointer_1');
            expect(svg.getAttribute('fill')).toBe('#757575');
        });
    });
    describe('Checking animation duration as 2000. RoundedRectangle', () => {
        let gauge: LinearGauge;
        let element: HTMLElement;
        let svg: HTMLElement;
        let trigger: MouseEvents = new MouseEvents();
        beforeAll((): void => {
            element = createElement('div', { id: 'RoundedRectangle' });
            document.body.appendChild(element);
            gauge = new LinearGauge({
                container: {
                    width: 13,
                    type: 'RoundedRectangle'
                },
                animationDuration: 1000,
                orientation: 'Vertical',
                axes: [{
                    pointers: [
                        {
                            value: 10,
                            height: 15,
                            width: 15,
                            placement: 'Near',
                            color: '#757575',
                            offset: -50,
                            markerType: 'Triangle'
                        },
                        {
                            value: 30,
                            height: 15,
                            width: 15,
                            placement: 'Near',
                            color: '#757575',
                            offset: -50,
                            markerType: 'Circle'
                        },
                        {
                            value: 50,
                            height: 15,
                            width: 15,
                            placement: 'Near',
                            color: '#757575',
                            offset: -50,
                            type: 'Bar',
                        }
                    ],            
                }],
            });
            gauge.appendTo('#RoundedRectangle');
        });
        afterAll((): void => {
            element.remove();
        });
        it('checking with RoundedRectangle with circle marker', async (): Promise<void> => {
            await wait(2000); // Wait for 5 seconds
            svg = document.getElementById('RoundedRectangle_AxisIndex_0_MarkerPointer_0');
            expect(svg.style.visibility === 'visible').toBe(true);
        });
        it('checking with marker pointer in vertical and type RoundedRectangle', async (): Promise<void> => {
            svg = document.getElementById('RoundedRectangle_AxisIndex_0_MarkerPointer_0');
            expect(svg.getAttribute('fill')).toBe('#757575');
        });
    });
    describe('Checking animation duration as 2000. Annotation', () => {
        let gauge: LinearGauge;
        let element: HTMLElement;
        let svg: HTMLElement;
        let trigger: MouseEvents = new MouseEvents();
        beforeAll((): void => {
            element = createElement('div', { id: 'Annotation' });
            document.body.appendChild(element);
            gauge = new LinearGauge({
                container: {
                    width: 13,
                    type: 'RoundedRectangle'
                },
                animationDuration: 1000,
                orientation: 'Vertical',
                axes: [{
                    pointers: [
                        {
                            value: 10,
                            height: 15,
                            width: 15,
                            placement: 'Near',
                            color: '#757575',
                            offset: -50,
                            markerType: 'Triangle'
                        },
                        {
                            value: 0,
                            height: 15,
                            width: 15,
                            placement: 'Near',
                            color: '#757575',
                            offset: -50,
                            markerType: 'Circle'
                        },
                        {
                            value: 50,
                            height: 15,
                            width: 15,
                            placement: 'Near',
                            color: '#757575',
                            offset: -50,
                            type: 'Bar',
                        }
                    ],            
                }],
                annotations: [
                    {
                        content: '',
                        axisIndex: 0,
                        axisValue: 10,
                        x: 10, zIndex: '1',
                        y: -70
                    },
                    {
                        content: '<div id="pointer" style="width:70px"><h1 style="font-size:14px;color:#424242">80 MPH</h1></div>',
                        axisIndex: 0,
                        axisValue: 80,
                        x: 10, zIndex: '1',
                        y: -70
                    }
                ]
            });
            gauge.appendTo('#Annotation');
        });
        afterAll((): void => {
            element.remove();
        });
        it('checking with RoundedRectangle with vertical orientation', async (): Promise<void> => {
            await wait(2000); // Wait for 5 seconds
            svg = document.getElementById('Annotation_AnnotationsGroup');
            expect(svg.childElementCount === 2).toBe(true);
        });
        it('checking with annotation in vertical and type RoundedRectangle', async (): Promise<void> => {
            svg = document.getElementById('Annotation_Annotation_0');
            expect(svg.innerHTML == '<div style="font-size: 12px; font-style: normal; font-family: &quot;Segoe UI&quot;; opacity: 1; color: rgb(104, 104, 104);"></div>').toBe(true);
        });
    });
    describe('Checking animation duration as 2000. Annotation', () => {
        let gauge: LinearGauge;
        let element: HTMLElement;
        let svg: HTMLElement;
        let trigger: MouseEvents = new MouseEvents();
        beforeAll((): void => {
            element = createElement('div', { id: 'Annotation' });
            document.body.appendChild(element);
            gauge = new LinearGauge({
                container: {
                    width: 13,
                    type: 'Thermometer'
                },
                animationDuration: 1000,
                orientation: 'Vertical',
                axes: [{
                    pointers: [
                        {
                            value: 10,
                            height: 15,
                            width: 15,
                            placement: 'Near',
                            color: '#757575',
                            offset: -50,
                            markerType: 'Triangle'
                        },
                        {
                            value: 30,
                            height: 15,
                            width: 15,
                            placement: 'Near',
                            color: '#757575',
                            offset: -50,
                            markerType: 'Circle'
                        },
                        {
                            value: 0,
                            height: 15,
                            width: 15,
                            placement: 'Near',
                            color: '#757575',
                            offset: -50,
                            type: 'Bar',
                        }
                    ],            
                }],
                annotations: [
                    {
                        content: '',
                        axisIndex: 0,
                        axisValue: 10,
                        x: 10, zIndex: '1',
                        y: -70
                    },
                    {
                        content: '<div id="pointer" style="width:70px"><h1 style="font-size:14px;color:#424242">80 MPH</h1></div>',
                        axisIndex: 0,
                        axisValue: 80,
                        x: 10, zIndex: '1',
                        y: -70
                    }
                ]
            });
            gauge.appendTo('#Annotation');
        });
        afterAll((): void => {
            element.remove();
        });
        it('checking with more than one annotation', async (): Promise<void> => {
            await wait(2000); // Wait for 5 seconds
            svg = document.getElementById('Annotation_AnnotationsGroup');
            expect(svg.childElementCount === 2).toBe(true);
        });
    });
    describe('Checking animation duration without marker', () => {
        let gauge: LinearGauge;
        let element: HTMLElement;
        let svg: HTMLElement;
        let trigger: MouseEvents = new MouseEvents();
        beforeAll((): void => {
            element = createElement('div', { id: 'RoundedRectangle' });
            document.body.appendChild(element);
            gauge = new LinearGauge({
                width: '300px',
                title: 'Speedometer SpeedometerSpeedometerSpeedometerSpeedometerSpeedometerSpeedometervSpeedometerSpeedometervSpeedometer',
                animationDuration: 1000,
                orientation: 'Horizontal',
                axes: [{
                        line: {
                            width: 0
                        },
                        pointers: [],
                        majorTicks: null,
                        minorTicks: null,
                        labelStyle: {
                            font: {
                                size: '0px',
                                color: '#424242'
                            },
                            offset: 48
                        }
                }]
            });
            gauge.appendTo('#RoundedRectangle');
        });
        afterAll((): void => {
            element.remove();
        });
        it('checking without marker', async (): Promise<void> => {
            await wait(2000); // Wait for 5 seconds
            svg = document.getElementById('RoundedRectangle_AxisIndex_0_MarkerPointer_0');
            expect(svg == null).toBe(true);
        });
        it('checking the initPrivateVariable', async (): Promise<void> => {
            await wait(2000); // Wait for 5 seconds
            gauge.element.id ='';
            gauge.refresh();
            svg = document.getElementById('RoundedRectangle_AxisIndex_0_MarkerPointer_1');
            expect(svg == null).toBe(true);
        });
        it('checking the initPrivateVariable', async (): Promise<void> => {
            await wait(2000); // Wait for 5 seconds            
            svg = document.getElementById('RoundedRectangle_AxisIndex_0_MarkerPointer_1');
            expect(svg == null).toBe(true);
        });
    });
    describe('Checking title tooltip', () => {
        let gauge: LinearGauge;
        let element: HTMLElement;
        let svg: HTMLElement;
        let trigger: MouseEvents = new MouseEvents();
        beforeAll((): void => {
            element = createElement('div', { id: 'title' });
            document.body.appendChild(element);
            gauge = new LinearGauge({
                width: '300px',
                title: 'Speedometer SpeedometerSpeedometerSpeedometerSpeedometerSpeedometerSpeedometervSpeedometerSpeedometervSpeedometer',
                animationDuration: 0,
                orientation: 'Horizontal',
                tooltip: {
                    enable: true
                },
                axes: [{
                        line: {
                            width: 0
                        },
                        pointers: [],
                        majorTicks: null,
                        minorTicks: null,
                        labelStyle: {
                            font: {
                                size: '0px',
                                color: '#424242'
                            },
                            offset: 48
                        }
                }]
            });
            gauge.appendTo('#title');
        });
        afterAll((): void => {
            element.remove();
        });
        it('Checking title Tooltip', () => {
            gauge.loaded = (args: ILoadedEventArgs) => {
                var ele = document.getElementById('title_LinearGaugeTitle');
                let eventObj: object = {
                    target: ele,
                    type: 'touchstart',
                    changedTouches: [{ pageX: ele.getBoundingClientRect().left, pageY: ele.getBoundingClientRect().top }]
                }
                gauge.tooltipModule.renderTooltip(<PointerEvent>eventObj);
            };
            gauge.refresh();
        });
        it('Checking pointer title Tooltip ', () => {
            gauge.loaded = (args: ILoadedEventArgs) => {
                var ele = document.getElementById('title_LinearGaugeTitle');
                let eventObj: object = {
                    target: ele,
                    type: 'touchstart',
                    changedTouches: [{ pageX: ele.getBoundingClientRect().left, pageY: ele.getBoundingClientRect().top }]
                }
                gauge.mouseEnd(<PointerEvent>eventObj);
            };
            gauge.refresh();
        });
    });
    async function wait(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

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
