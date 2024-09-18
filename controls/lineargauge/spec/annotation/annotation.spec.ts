/**
 * Linear gauge spec document.
 */
import { Browser, EventHandler, createElement, EmitType } from '@syncfusion/ej2-base';
import { ILoadedEventArgs, ILoadEventArgs, IAnimationCompleteEventArgs } from '../../src/linear-gauge/model/interface';
import { LinearGauge } from '../../src/linear-gauge/linear-gauge';
import { Annotations } from '../../src/linear-gauge/annotations/annotations';
import { MouseEvents } from '../base/events.spec';
import  {profile , inMB, getMemoryProfile} from '../common.spec';
LinearGauge.Inject(Annotations);

describe('Linear gauge control', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            pending(); //Skips test (in Chai)
            return;
        }
    });
    describe('Cheking annotation', () => {
        let gauge: LinearGauge;
        let element: HTMLElement;
        let divElement: HTMLElement;
        let svg: HTMLElement;
        let trigger: MouseEvents = new MouseEvents();
        let template: string = '<script id=template type="text/x-template"><div id="tool">80</div></script>' +
            '<script id=template1 type="text/x-template"><div>100</div></script>';
        let annotationDiv: HTMLElement = createElement('div', { id: 'annotation', innerHTML: 'Gauge' });
        annotationDiv.style.display = 'none';
        beforeAll((): void => {
            element = createElement('div', { id: 'container' });
            document.body.appendChild(element);
            gauge = new LinearGauge();
            gauge.appendTo('#container');
        });
        afterAll((): void => {
            element.remove();
        });

        it('Checking annotation without div element checking', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                divElement = document.getElementById('container_Annotation_0');
                expect(divElement != null).toEqual(true);
            };
            gauge.annotations[0].content = '#annotation';
            gauge.annotations[0].x = 100;
            gauge.annotations[0].y = 100;
            gauge.refresh();
        });

        it('Checking annotation x and y', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                divElement = document.getElementById('container_Annotation_0');
                expect(divElement != null).toEqual(true);
            };
            document.body.appendChild(annotationDiv);
            gauge.annotations[0].content = '#annotation';
            gauge.annotations[0].x = 100;
            gauge.annotations[0].y = 100;
            gauge.refresh();
        });

        it('Checking annotation vertical alignment - near', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                divElement = document.getElementById('container_Annotation_0');
                expect(divElement != null).toEqual(true);
            };
            gauge.annotations[0].content = '#annotation';
            gauge.annotations[0].verticalAlignment = 'Near';
            gauge.refresh();
        });

        it('Checking annotation vertical alignment - center', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                divElement = document.getElementById('container_Annotation_0');
                expect(divElement != null).toEqual(true);
            };
            gauge.annotations[0].content = '#annotation';
            gauge.annotations[0].verticalAlignment = 'Center';
            gauge.refresh();
        });

        it('Checking annotation vertical alignment - far', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                divElement = document.getElementById('container_Annotation_0');
                expect(divElement != null).toBe(true);
            };
            gauge.annotations[0].content = '#annotation';
            gauge.annotations[0].verticalAlignment = 'Far';
            gauge.refresh();
        });

        it('Checking annotation horizontal alignment - near', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                divElement = document.getElementById('container_Annotation_0');
                expect(divElement != null).toBe(true);
            };
            gauge.annotations[0].content = '#annotation';
            gauge.annotations[0].horizontalAlignment = 'Near';
            gauge.refresh();
        });

        it('Checking annotation horizontal alignment - center', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                divElement = document.getElementById('container_Annotation_0');
                expect(divElement != null).toBe(true);
            };
            gauge.annotations[0].content = '#annotation';
            gauge.annotations[0].horizontalAlignment = 'Center';
            gauge.refresh();
        });

        it('Checking annotation horizontal alignment - far', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Annotation_0');
                expect(divElement != null).toBe(true);
            };
            gauge.annotations[0].content = '#annotation';
            gauge.annotations[0].horizontalAlignment = 'Far';
            gauge.refresh();
        });

        it('Checking annotation with template ', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Annotation_0');
                expect(divElement != null).toBe(true);
            };
            gauge.annotations[0].content = '<div id=annotation1>Annotation</div>';
            gauge.annotations[0].horizontalAlignment = 'Far';
            gauge.refresh();
        });

        it('Checking annotation with empty content ', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                divElement = document.getElementById('container_Annotation_0');
                expect(divElement == null).toBe(true);
            };
            gauge.annotations[0].content = null;
            gauge.refresh();
        });

        it('set annotation value ', (): void => {
            let content: string = '<div id="annotation1">Linear gauge</div>';
            gauge.annotations[0].axisIndex = 0;
            gauge.setAnnotationValue(0, content, 1);
        });

        it('set annotation value in horizontal ', (): void => {
            let content: string = '<div id="annotation2">Gauge</div>';
            gauge.loaded = (args: ILoadedEventArgs): void => {}
            gauge.orientation = 'Horizontal';
            gauge.setAnnotationValue(0, content);     
        });

        it('set annotation value with null ', (): void => {
            let content: string = '<div id="annotation2">Gauge</div>';
            gauge.orientation = 'Horizontal';
            gauge.annotations[0].axisIndex = null;
            gauge.setAnnotationValue(0, content);
        });


        it('set annotation value with maximum ', (): void => {
            let content: string = '<div id="annotation2">Gauge</div>';
            gauge.orientation = 'Horizontal';
            gauge.axes[0].maximum = 40;
            gauge.annotations[0].axisValue = 50;
            gauge.setAnnotationValue(0, content);
        });

        it('checking annotation at axisvalue zero with setAnnotationValue method ', (): void => {
            let content: string = '<div id="annotation2">Gauge</div>';
            gauge.orientation = 'Horizontal';
            gauge.axes[0].minimum = 0;
            gauge.axes[0].maximum = 50;
            gauge.annotations[0].axisValue = 50;
            gauge.setAnnotationValue(0, content, 0);
            expect(gauge.annotations[0].axisValue == 0).toBe(true);
        });

        it('checking annotation at axisvalue greater than maximum value with setAnnotationValue method ', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                expect(document.getElementById('container_Annotation_0') == null).toBe(true);
            };
            gauge.orientation = 'Horizontal';
            gauge.annotations[0].axisValue = 50;
            gauge.setAnnotationValue(0,'Gauge', 60);
            gauge.refresh();
        });

        it('Checking annotation position for multiple axis ', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Annotation_0');
                let width = svg.getBoundingClientRect().width;
                element = document.getElementById('container_AxisLine_0');
                expect(svg.getBoundingClientRect().left + (width/2) == element.getBoundingClientRect().left).toBe(true);
            };
            gauge.orientation = 'Vertical'
            gauge.axes = [
                {
                    minimum: 0,
                    maximum: 50
                },
                {
                    minimum: 0,
                    maximum: 50
                }
            ]
            gauge.annotations = [
                {
                    content: '1',
                    axisIndex: 0,
                    axisValue: 40,
                    zIndex: '1',
                }
            ]
            gauge.refresh();
        });
        it('Checking animation annotation position for multiple axis ', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Annotation_0');
                let width = svg.getBoundingClientRect().width;
                element = document.getElementById('container_AxisLine_0');
                expect(svg.getBoundingClientRect().left + (width/2) == element.getBoundingClientRect().left).toBe(true);
            };
            gauge.orientation = 'Vertical'
            gauge.animationDuration = 100;
            gauge.refresh();
        });
    });
    describe('Checking animation properties', () => {
        let gauge: LinearGauge;
        let element: HTMLElement;
        let svg: HTMLElement;
        let trigger: MouseEvents = new MouseEvents();
        beforeAll((): void => {
            element = createElement('div', { id: 'container' });
            document.body.appendChild(element);
            gauge = new LinearGauge({
                animationDuration: 1000,
                orientation: 'Horizontal',
                axes: [{
                    line: {
                        color: '#9E9E9E'
                    },
                    pointers: [{
                        value: 10,
                        height: 15,
                        width: 15,
                        placement: 'Near',
                        color: '#757575',
                        offset: -50,
                        markerType: 'Triangle'
                    }],
                    majorTicks: {
                        color: '#9E9E9E',
                        interval: 10
                    },
                    minorTicks: {
                        color: '#9E9E9E',
                        interval: 2
                    },
                    labelStyle: {
                        font: {
                            color: '#424242'
                        },
                        offset: 48
                    }
                }],
                annotations: [{
                    content: '<div id="pointer" style="width:70px"><h1 style="font-size:14px;color:#424242">10 MPH</h1></div>',
                    axisIndex: 0,
                    axisValue: 10,
                    x: 10, zIndex: '1',
                    y: -70
                }]
            });
            gauge.appendTo('#container');
        });
        afterAll((): void => {
            element.remove();
        });

        it('checking with annotation group', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_AnnotationsGroup');
                expect(svg !== null).toBe(true);
            };
            gauge.refresh();
        });
        it('checking with animation group', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_AnnotationsGroup');
                expect(svg.childElementCount === 1).toBe(true);
            };
            gauge.animationDuration = 100;
            gauge.refresh();
        });
    });
    describe('Checking animation duration as 1000', () => {
        let gauge: LinearGauge;
        let element: HTMLElement;
        let svg: HTMLElement;
        let trigger: MouseEvents = new MouseEvents();
        beforeAll((): void => {
            element = createElement('div', { id: 'container' });
            document.body.appendChild(element);
            gauge = new LinearGauge({
                animationDuration: 1000,
                orientation: 'Horizontal',
                axes: [{
                    line: {
                        width: 0
                    },
                    pointers: [{
                        value: 10,
                        height: 15,
                        width: 15,
                        placement: 'Near',
                        color: '#757575',
                        offset: -50,
                        markerType: 'Triangle'
                    }],
                    majorTicks: null,
                    minorTicks: null,
                    labelStyle: {
                        font: {
                            size: '0px',
                            color: '#424242'
                        },
                        offset: 48
                    }
                }],
                annotations: [{
                    content: '<div id="pointer" style="width:70px"><h1 style="font-size:14px;color:#424242">10 MPH</h1></div>',
                    axisIndex: 0,
                    axisValue: 10,
                    x: 10, zIndex: '1',
                    y: -70
                }]
            });
            gauge.appendTo('#container');
        });
        afterAll((): void => {
            element.remove();
        });

        it('checking with pointer group', (): void => {
            gauge.setPointerValue(0, 0, 20);
            svg = document.getElementById('container_AnnotationsGroup');
            expect(svg.childElementCount).toBe(1);
        });
        it('checking with setAnnotationValue method', (): void => {
            gauge.setAnnotationValue(0, '10 MPH', -10);
            svg = document.getElementById('container_AnnotationsGroup');
            expect(svg !== null).toBe(true);
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