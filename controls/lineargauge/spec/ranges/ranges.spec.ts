/**
 * Linear gauge spec document
 */
import { Browser, EventHandler, createElement, EmitType } from '@syncfusion/ej2-base';
import { ILoadedEventArgs, ILoadEventArgs } from '../../src/linear-gauge/model/interface';
import { LinearGauge } from '../../src/linear-gauge/linear-gauge';
import  {profile , inMB, getMemoryProfile} from '../common.spec';
import { MouseEvents } from '../base/events.spec';
import { Gradient } from '../../src/linear-gauge/axes/gradient';
LinearGauge.Inject( Gradient );

describe('Linear gauge control', () => {
    describe('linear gauge direct properties', () => {
        let gauge: LinearGauge;
        let element: HTMLElement;
        let svg: HTMLElement;
        beforeAll(() => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
        });
        beforeAll((): void => {
            element = createElement('div', { id: 'container' });
            document.body.appendChild(element);
            gauge = new LinearGauge();
            gauge.appendTo('#container');
        });
        afterAll((): void => {
            element.remove();
        });


        it('checking with ranges in vertical orientation', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_AxisIndex_0_Range_0');
                expect(svg != null).toBe(true);
                svg = document.getElementById('container_AxisIndex_0_Range_1');
                expect(svg != null).toBe(true);

            };
            gauge.orientation = 'Vertical';
            gauge.axes[0].opposedPosition = false;
            gauge.axes[0].ranges = [
                {
                    start: 0,
                    end: 50,
                    startWidth: 10,
                    endWidth: 20,
                    color: 'red',
                    position: 'Inside'
                },
                {
                    start: 50,
                    end: 100,
                    startWidth: 10,
                    endWidth: 20,
                    color: 'red',
                    position: 'Outside'
                }
            ];
            gauge.refresh();
        });

        it('checking with ranges in opposed position', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_AxisIndex_0_Range_0');
                expect(svg != null).toBe(true);
                svg = document.getElementById('container_AxisIndex_0_Range_1');
                expect(svg != null).toBe(true);
            };
            gauge.orientation = 'Vertical';
            gauge.axes[0].opposedPosition = true;
            gauge.axes[0].ranges = [
                {
                    start: 0,
                    end: 50,
                    startWidth: 10,
                    endWidth: 20,
                    color: 'red',
                    position: 'Inside'
                },
                {
                    start: 50,
                    end: 100,
                    startWidth: 10,
                    endWidth: 20,
                    color: 'red',
                    position: 'Outside'
                }
            ];
            gauge.refresh();
        });
        it('checking with ranges start and end with databind', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_AxisIndex_0_Range_0');
                expect(svg != null).toBe(true);
                svg = document.getElementById('container_AxisIndex_0_Range_1');
                expect(svg != null).toBe(true);
            };
            gauge.axes[0].ranges = [
                {
                    start: 10,
                    end: 40,
                    startWidth: 10,
                    endWidth: 20,
                    color: 'red',
                    position: 'Inside'
                },
                {
                    start: 50,
                    end: 100,
                    startWidth: 10,
                    endWidth: 20,
                    color: 'red',
                    position: 'Outside'
                }
            ];
            gauge.dataBind();
        });

        it('checking with ranges in horizontal orientation', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                // svg = document.getElementById('container_AxisIndex_0_Range_0');
                // expect(svg != null).toBe(true);
                // svg = document.getElementById('container_AxisIndex_0_Range_1');
                // expect(svg != null).toBe(true);
            };
            gauge.orientation = 'Horizontal';
            gauge.axes[0].opposedPosition = false;
            gauge.axes[0].ranges = [
                {
                    start: 0,
                    end: 50,
                    startWidth: 10,
                    endWidth: 20,
                    color: 'red',
                    position: 'Inside'
                },
                {
                    start: 50,
                    end: 100,
                    startWidth: 10,
                    endWidth: 20,
                    color: 'red',
                    position: 'Outside'
                }
            ];
            gauge.refresh();

        });

        it('checking with ranges in axis opposed position', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_AxisIndex_0_Range_0');
                expect(svg != null).toBe(true);
                svg = document.getElementById('container_AxisIndex_0_Range_1');
                expect(svg != null).toBe(true);
            };
            gauge.orientation = 'Horizontal';
            gauge.axes[0].opposedPosition = true;
            gauge.axes[0].ranges = [
                {
                    start: 0,
                    end: 50,
                    startWidth: 10,
                    endWidth: 20,
                    color: 'red',
                    position: 'Inside'
                },
                {
                    start: 50,
                    end: 100,
                    startWidth: 10,
                    endWidth: 20,
                    color: 'red',
                    position: 'Outside'
                }
            ];
            gauge.refresh();
        });
        it('checking with ranges in position as cross', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_AxisIndex_0_Range_0');
                expect(svg != null).toBe(true);
                svg = document.getElementById('container_AxisIndex_0_Range_1');
                expect(svg != null).toBe(true);
            };
            gauge.orientation = 'Horizontal';
            gauge.axes[0].opposedPosition = false;
     		gauge.axes[0].ranges[0].position = 'Cross';
            gauge.axes[0].ranges[1].position = 'Cross';
            gauge.refresh();
        });
        it('checking with ranges in position as cross with vertical orinetation', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_AxisIndex_0_Range_0');
                expect(svg != null).toBe(true);
                svg = document.getElementById('container_AxisIndex_0_Range_1');
                expect(svg != null).toBe(true);
            };
            gauge.orientation = 'Vertical';
            gauge.refresh();
        });
    });

    describe('Checking the properties with pointers and gradients', () => {
        let gauge: LinearGauge;
        let element: HTMLElement;
        let svg: HTMLElement;
        let trigger: MouseEvents = new MouseEvents();
        beforeAll((): void => {
            element = createElement('div', { id: 'container' });
            document.body.appendChild(element);
            gauge = new LinearGauge({
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
                        offset: -50,
                        markerType: 'Triangle',
                        linearGradient:{
                            startValue:"0%",
                            endValue:"100%",
                            colorStop:[{color:"red", offset:"0",style:"border: 10px solid powderblue;padding: 30px;"},
                            {color:"blue", offset:"15",style:"  border: 15px solid powderblue;margin: 50px;"},
                          ],                           
                        },
                       
                    },
                    {
                        value: 10,
                        height: 45,
                        width: 45,             
                        placement: 'Near',
                        markerType: 'Circle',
                        offset: -50,
                        radialGradient:{
                            radius: "50",
                            outerPosition: {x:"50%", y:"50%"},
                            innerPosition: {x: "50%", y: "50%"},                
                           colorStop:[{color:"pink", offset:"0", opacity:1},
                           {color:"yellow", offset:"100", opacity:1}],
                        }
                    },
                    {
                        value: 60,
                        height: 45,
                        width: 45,             
                        placement: 'Near',
                        type:"Bar",
                        offset: -50,
                        radialGradient:{
                            radius: "50",
                            outerPosition: {x:"50", y:"50"},
                            innerPosition: {x: "50", y: "50"},                
                           colorStop:[{color:"grey", offset:"0", opacity:1},
                           {color:"blue", offset:"100", opacity:1}],
                        }
                    },
                
                ],
                    ranges: [{
                        start: 0,
                        end: 30,
                        startWidth: 50,
                        endWidth: 50,
                        linearGradient:{
                            startValue:"0",
                            endValue:"100",               
                           colorStop:[{color:"orange", offset:"0%", opacity:1,style:"vergo"},
                           {color:"pink", offset:"50%", opacity:1,style:"vergo"},
                           {color:"green", offset:"100%", opacity:0.8},                           
                        ],
                        }
                    },
                    {
                        start: 35,
                        end: 70,
                        startWidth: 50,
                        endWidth: 50,
                        radialGradient:{
                            radius: "50",
                            outerPosition: {x:"50", y:"50"},
                            innerPosition: {x: "50", y: "50"},                
                           colorStop:[{color:"white", offset:"0%", opacity:1,style:"vergo"},
                           {color:"blue", offset:"50%", opacity:1,style:"vergo"},
                           {color:"yellow", offset:"100%", opacity:1}
                        ],
                        }
                    },
                
                
                ],

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

        it('checking the stroke property of the range', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_AxisIndex_0_Range_0');
                expect(svg.getAttribute('stroke')).toBe("#000000");
            };
            gauge.refresh();
        });

        it('checking the opacity of the range element', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_AxisIndex_0_Range_0');
                expect(svg.getAttribute('opacity')).toBe("1");
            };
            gauge.refresh();
        });

        it('checking the stroke width of the range element', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_AxisIndex_0_Range_0');
                expect(svg.getAttribute('stroke-width')).toBe("0");
            };
            gauge.refresh();
        });

        it('checking the radial gradient properties of def element', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById("_container_svg_1_radialGradient");                                      
                expect(svg.getAttribute('cx')).toBe("50%");
                expect(svg.getAttribute('cy')).toBe("50%");
                expect(svg.getAttribute('fx')).toBe("50%");
                expect(svg.getAttribute('fx')).toBe("50%");
                expect(svg.getAttribute('r')).toBe("50%");
            };
            gauge.refresh();
        });

        it('checking the linear gradient properties of def element', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById("_container_svg_0_linearGradient");                                      
                expect(svg.getAttribute('x1')).toBe("0%");
                expect(svg.getAttribute('y1')).toBe("0%");
                expect(svg.getAttribute('x2')).toBe("100%");
                expect(svg.getAttribute('y2')).toBe("0%");
            };
            gauge.refresh();
        });


        it('checking the stroke dasharray of the range element', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_AxisIndex_0_Range_0');
                                              
                expect(svg.getAttribute('stroke-dasharray')).toBe("null");
            };
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