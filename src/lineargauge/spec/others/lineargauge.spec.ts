/**
 * Linear gauge spec document
 */
import { Browser, EventHandler, createElement, EmitType } from '@syncfusion/ej2-base';
import { GaugeTooltip } from '../../src/linear-gauge/user-interaction/tooltip';
import { ILoadedEventArgs, ILoadEventArgs, IAnimationCompleteEventArgs } from '../../src/linear-gauge/model/interface';
import { LinearGauge } from '../../src/linear-gauge/linear-gauge';
import { MouseEvents } from '../base/events.spec';
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
    describe('Checking other properties', () => {
        let gauge: LinearGauge;
        let element: HTMLElement;
        let targetElement: HTMLElement;
        let svg: Element;
        let trigger: MouseEvents = new MouseEvents();
        beforeAll((): void => {
            element = createElement('div', { id: 'container' });
            document.body.appendChild(element);
            gauge = new LinearGauge();
            gauge.appendTo('#container');
        });
        afterAll((): void => {
            element.remove();
        });
        it('Checking triangle pointer', () => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_AxisIndex_0_MarkerPointer_0');
                expect(svg != null).toBe(true);
            };
            gauge.orientation = 'Horizontal';
            gauge.axes[0].pointers[0].value = 50;
            gauge.axes[0].pointers[0].markerType = 'Triangle';
            gauge.refresh();
        });

        it('Checking circle pointer', () => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_AxisIndex_0_MarkerPointer_0');
                expect(svg != null).toBe(true);
            };
            gauge.orientation = 'Vertical';
            gauge.axes[0].pointers[0].placement = 'Near';
            gauge.axes[0].pointers[0].markerType = 'Circle';
            gauge.refresh();
        });

        it('Checking circle pointer axis opposed position', () => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_AxisIndex_0_MarkerPointer_0');
                expect(svg != null).toBe(true);
            };
            gauge.axes[0].opposedPosition = true;
            gauge.refresh();
        });

        it('Checking right click', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                targetElement = document.getElementById('container_svg');
                trigger.rightClick(targetElement, 0, 0, 'touch', 1, gauge);
                done();
            };
            gauge.refresh();
        });
    });

    describe('Checking normal rectangle animation', () => {
        let gauge: LinearGauge;
        let element: HTMLElement;
        let svg: HTMLElement;
        let timeout: number;
        let trigger: MouseEvents = new MouseEvents();
        beforeAll((): void => {
            timeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            //  jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            element = createElement('div', { id: 'container' });
            document.body.appendChild(element);
            gauge = new LinearGauge();
            gauge.appendTo('#container');
        });
        afterAll((): void => {
            // jasmine.DEFAULT_TIMEOUT_INTERVAL = timeout;
            element.remove();
        });

        it('bar animation - Vertical - Normal rectangle', (done: Function): void => {
            gauge.animationComplete = (args: IAnimationCompleteEventArgs): void => {
                let svg: HTMLElement = document.getElementById('container_AxisIndex_0_BarPointer_0');
                //expect(svg != null).toBe(true);
                done();
            };
            gauge.container.type = 'Normal';
            gauge.axes[0].pointers[0].type = 'Bar';
            gauge.axes[0].pointers[0].value = 50;
            gauge.axes[0].pointers[0].animationDuration = 10;
            gauge.refresh();
        });

        it('bar animation - horizontal - Normal rectangle', (done: Function): void => {
            gauge.animationComplete = (args: IAnimationCompleteEventArgs): void => {
                let svg: HTMLElement = document.getElementById('container_AxisIndex_0_BarPointer_0');
                //expect(svg != null).toBe(true);
                done();
            };
            gauge.container.type = 'Normal';
            gauge.orientation = 'Horizontal';
            gauge.axes[0].pointers[0].type = 'Bar';
            gauge.axes[0].pointers[0].value = 30;
            gauge.axes[0].pointers[0].animationDuration = 10;
            gauge.refresh();
        });
    });


    describe('Checking HighContrast theme support', () => {
        let gauge: LinearGauge;
        let element: HTMLElement;
        let svg: HTMLElement;
        let timeout: number;       
        beforeAll((): void => {   
            timeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;        
            element = createElement('div', { id: 'container' });
            document.body.appendChild(element);
            gauge = new LinearGauge({
                theme : 'HighContrast'
            });
            gauge.appendTo('#container');
        });
        afterAll((): void => {
           // timeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;           
            element.remove();
        });

        it('gauge theme support - highcontrast', (done: Function): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                debugger
                svg = document.getElementById('container_LinearGaugeTitle');
                //expect(svg.textContent == 'linear gauge').toBe(true);
                svg = document.getElementById('container_MinorTicksLine_0');
                //expect(svg.getAttribute('fill')).toEqual('#FFFFFF');
                svg = document.getElementById('container_MinorTicksLine_0');
                //expect(svg.getAttribute('fill')).toEqual('#FFFFFF');                
                svg = document.getElementById('container_AxisLine_0');
                //expect(svg.getAttribute('fill')).toEqual('#FFFFFF');                
                done();
            };            
            gauge.title = 'linear gauge';           
            gauge.axes[0].line.width = 2;
            gauge.axes[0].majorTicks.width = 5;
            gauge.axes[0].minorTicks.width = 2;
            gauge.refresh();            
        });
        
    });

    describe('Checking Dark theme support', () => {
        let gauge: LinearGauge;
        let element: HTMLElement;
        let svg: HTMLElement;
        let timeout: number;       
        beforeAll((): void => {   
            timeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;        
            element = createElement('div', { id: 'container' });
            document.body.appendChild(element);
            gauge = new LinearGauge({
                theme : 'FabricDark'
            });
            gauge.appendTo('#container');
        });
        afterAll((): void => {
           // timeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;           
            element.remove();
        });

        it('gauge theme support - dark', (done: Function): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_LinearGaugeTitle');
                expect(svg.textContent == 'linear gauge').toBe(true);
                svg = document.getElementById('container_MinorTicksLine_0');
                expect(svg.getAttribute('fill')).toEqual('#9A9A9A');
                svg = document.getElementById('container_MajorTicksLine_0');
                expect(svg.getAttribute('fill')).toEqual('#C8C8C8');
                svg = document.getElementById('container_AxisLine_0');
                expect(svg.getAttribute('fill')).toEqual('#C8C8C8');                
                done();
            }; 
            gauge.theme = 'FabricDark';
            gauge.title = 'linear gauge';              
            gauge.axes[0].line.width = 2;
            gauge.axes[0].majorTicks.width = 5;
            gauge.axes[0].minorTicks.width = 2;           
            gauge.refresh();
        });
        it('gauge theme support - MaterialDark theme', (done: Function): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_LinearGaugeTitle');
                expect(svg.textContent == 'linear gauge').toBe(true);
                svg = document.getElementById('container_MinorTicksLine_0');
                expect(svg.getAttribute('fill')).toEqual('#9A9A9A');
                svg = document.getElementById('container_MajorTicksLine_0');
                expect(svg.getAttribute('fill')).toEqual('#C8C8C8');
                svg = document.getElementById('container_AxisLine_0');
                expect(svg.getAttribute('fill')).toEqual('#C8C8C8');                
                done();
            }; 
            gauge.theme = 'MaterialDark';         
            gauge.refresh();
        });
        it('gauge theme support - bootstrap4 theme', (done: Function): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_MinorTicksLine_0');
                expect(svg.getAttribute('fill')).toEqual('#CED4DA');
                svg = document.getElementById('container_MajorTicksLine_0');
                expect(svg.getAttribute('fill')).toEqual('#ADB5BD');
                svg = document.getElementById('container_AxisLine_0');
                expect(svg.getAttribute('fill')).toEqual('#ADB5BD');                
                done();
            }; 
            gauge.theme = 'Bootstrap4';             
            gauge.refresh();
        });
    });
    describe('Checking Dark theme support', () => {
        let gauge: LinearGauge;
        let element: HTMLElement;
        let svg: HTMLElement;
        let timeout: number;
        function annotation(){
            return '<div id="pointer" style="width:70px"><h1 style="font-size:14px;color:#424242">20 MPH</h1></div>';
        }
        beforeAll((): void => {   
            timeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;        
            element = createElement('div', { id: 'container' });
            document.body.appendChild(element);
            gauge = new LinearGauge({
                orientation: 'Vertical',
                theme: 'Fluent2',
                axes: [{
                    opposedPosition: true,
                        line: {
                            color: '#9E9E9E'
                        },
                        ranges: [
                            { start: 0, end: 20, startWidth: 15, endWidth: 15 },
                            { start: 20, end: 40, startWidth: 15, endWidth: 15 },
                            { start: 40, end: 60, startWidth: 15, endWidth: 15 },
                            { start: 60, end: 80, startWidth: 15, endWidth: 15 },
                            { start: 80, end: 100, startWidth: 15, endWidth: 15 }
                        ],
                        pointers: [{
                                value: 10,
                                height: 15,
                                width: 15,
                                placement: 'Far',
                                color: '#757575',
                                offset: '-100',
                                markerType: 'Circle'
                            },
                            {
                                value: 70,
                                height: 15,
                                width: 15,
                                placement: 'Far',
                                color: '#757575',
                                offset: '-50',
                                text: '70 MPH',
                                markerType: 'Text',
                            }
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
                            format: undefined,
                            font: {
                                color: '#424242'
                            },
                            offset: 48
                        }
                    }],
                annotations: [{
                        content: annotation(),
                        axisIndex: 0,
                        axisValue: 10,
                        x: 10, zIndex: '1',
                        y: -70
                    }]
            });
            gauge.appendTo('#container');
        });
        afterAll((): void => {
           // timeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;           
            element.remove();
        });

        it('gauge pointer offset, annotation, label format', (done: Function): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_AxisIndex_0_MarkerPointer_0');
                expect(svg.getAttribute('fill')).toEqual('#757575');
                svg = document.getElementById('container_Axis_0_Label_10');
                expect(svg.textContent).toEqual('100');
                svg = document.getElementById('container_Annotation_0');
                expect(svg.childElementCount == 1).toEqual(true);  
                svg = document.getElementById('container_AxisIndex_0_Range_4');
                expect(svg.getAttribute('fill')).toEqual('#E7910F');
                svg = document.getElementById('container_AxisIndex_0_Range_1');
                expect(svg.getAttribute('fill')).toEqual('#09AF74');              
                done();
            };         
            gauge.refresh();
        });
        it('gauge range color', (done: Function): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_AxisIndex_0_Range_4');
                expect(svg.getAttribute('fill')).toEqual('#584EC6');
                svg = document.getElementById('container_AxisIndex_0_Range_1');
                expect(svg.getAttribute('fill')).toEqual('#2A72D5');             
                done();
            };
            gauge.theme = 'Fluent2Dark';         
            gauge.refresh();
        });
        it('gauge pointer shape as text', (done: Function): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_AxisIndex_0_MarkerPointer_1');
                expect(svg.getAttribute('x') == '158.5' || svg.getAttribute('x') == '159').toBe(true);             
                done();
            };
            gauge.axes[0].pointers[1].placement = 'Near';
            gauge.axes[0].pointers[1].position = 'Inside';
            gauge.axes[0].opposedPosition = false;            
            gauge.refresh();
        });
        it('gauge pointer placement as Center, position as Cross, opposedPosition as true', (done: Function): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_AxisIndex_0_MarkerPointer_1');
                expect(svg.getAttribute('x') == '214.5' || svg.getAttribute('x') == '215').toBe(true);             
                done();
            };
            gauge.axes[0].pointers[1].placement = 'Center';
            gauge.axes[0].pointers[1].position = 'Cross';
            gauge.axes[0].opposedPosition = true;            
            gauge.refresh();
        });
        it('gauge pointer placement as Near, position as Cross, opposedPosition as true', (done: Function): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_AxisIndex_0_MarkerPointer_1');
                expect(svg.getAttribute('x') == '159.5' || svg.getAttribute('x') == '160').toBe(true);             
                done();
            };
            gauge.axes[0].pointers[1].placement = 'Near';
            gauge.axes[0].pointers[1].position = 'Cross';
            gauge.axes[0].opposedPosition = true;            
            gauge.refresh();
        });
        it('gauge pointer placement as Naer, position as Outside, opposedPosition as true', (done: Function): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_AxisIndex_0_MarkerPointer_1');
                expect(svg.getAttribute('x') == '108.5' || svg.getAttribute('x') == '109').toBe(true);             
                done();
            };
            gauge.axes[0].pointers[1].placement = 'Near';
            gauge.axes[0].pointers[1].position = 'Outside';
            gauge.axes[0].pointers[1].offset = '0';
            gauge.axes[0].opposedPosition = true;            
            gauge.refresh();
        });
        it('gauge pointer placement as Far, position as Cross, orientation as Horizontal', (done: Function): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_AxisIndex_0_MarkerPointer_1');
                expect(svg.getAttribute('x') == '219.1' || svg.getAttribute('x') == '219.75').toBe(true);             
                done();
            };
            gauge.axes[0].pointers[1].placement = 'Far';
            gauge.axes[0].pointers[1].position = 'Cross';
            gauge.axes[0].pointers[1].offset = '0';
            gauge.axes[0].opposedPosition = false;      
            gauge.orientation = 'Horizontal';      
            gauge.refresh();
        });
        it('gauge pointer placement as Center, position as Cross, orientation as Horizontal', (done: Function): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_AxisIndex_0_MarkerPointer_1');
                expect(svg.getAttribute('x') == '219.1' || svg.getAttribute('x') == '219.75').toBe(true);             
                done();
            };
            gauge.axes[0].pointers[1].placement = 'Center';
            gauge.axes[0].pointers[1].position = 'Cross';
            gauge.axes[0].pointers[1].offset = '0';
            gauge.axes[0].opposedPosition = false;      
            gauge.orientation = 'Horizontal';      
            gauge.refresh();
        });
        it('gauge pointer placement as None, position as Cross, orientation as Horizontal', (done: Function): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_AxisIndex_0_MarkerPointer_1');
                expect(svg.getAttribute('x') == '219.1' || svg.getAttribute('x') == '219.75').toBe(true);             
                done();
            };
            gauge.axes[0].pointers[1].placement = 'None';
            gauge.axes[0].pointers[1].position = 'Cross';
            gauge.axes[0].pointers[1].offset = '0';
            gauge.axes[0].opposedPosition = false;      
            gauge.orientation = 'Horizontal';      
            gauge.refresh();
        });
        it('gauge pointer placement as Far, position as Inside, orientation as Horizontal', (done: Function): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_AxisIndex_0_MarkerPointer_1');
                expect(svg.getAttribute('x') == '219.1' || svg.getAttribute('x') == '219.75').toBe(true);             
                done();
            };
            gauge.axes[0].pointers[1].placement = 'Far';
            gauge.axes[0].pointers[1].position = 'Inside';
            gauge.axes[0].pointers[1].offset = '0';
            gauge.axes[0].opposedPosition = false;      
            gauge.orientation = 'Horizontal';      
            gauge.refresh();
        });
        it('gauge pointer placement as Naer, position as Inside, orientation as Horizontal', (done: Function): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_AxisIndex_0_MarkerPointer_1');
                expect(svg.getAttribute('y')).toBe('226');             
                done();
            };
            gauge.axes[0].pointers[1].placement = 'Near';
            gauge.axes[0].pointers[1].position = 'Inside';
            gauge.axes[0].pointers[1].offset = '0';
            gauge.axes[0].opposedPosition = true;      
            gauge.orientation = 'Horizontal';      
            gauge.refresh();
        });
        it('gauge pointer placement as Far, position as Cross, orientation as Horizontal', (done: Function): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_AxisIndex_0_MarkerPointer_1');
                expect(svg.getAttribute('y')).toBe('229.5');             
                done();
            };
            gauge.axes[0].pointers[1].placement = 'Far';
            gauge.axes[0].pointers[1].position = 'Cross';
            gauge.axes[0].pointers[1].offset = '0';
            gauge.axes[0].opposedPosition = true;      
            gauge.orientation = 'Horizontal';      
            gauge.refresh();
        });
        it('gauge pointer placement as Far, position as Outside, orientation as Horizontal', (done: Function): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_AxisIndex_0_MarkerPointer_1');
                expect(svg.getAttribute('y')).toBe('224');             
                done();
            };
            gauge.axes[0].pointers[1].placement = 'Far';
            gauge.axes[0].pointers[1].position = 'Outside';
            gauge.axes[0].pointers[1].offset = '0';
            gauge.axes[0].opposedPosition = true;      
            gauge.orientation = 'Horizontal';      
            gauge.refresh();
        });
    });
    describe('Linear gauge Element ', () => {
        let gauge: LinearGauge;
        let element: HTMLElement;
        let svg: HTMLElement;
        let timeout: number;       
        beforeAll((): void => {   
            timeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;        
            element = createElement('div', { id: 'container' });
            document.body.appendChild(element);
            gauge = new LinearGauge({
                orientation: 'Horizontal',
                animationDuration: 0,
                edgeLabelPlacement: 'Shift',
                theme: 'Fluent2',
                axes: [{
                    opposedPosition: false,
                        line: {
                            color: '#9E9E9E'
                        },
                        ranges: [
                            { start: 0, end: 20, startWidth: 15, endWidth: 15 },
                            { start: 20, end: 40, startWidth: 15, endWidth: 15 },
                            { start: 40, end: 60, startWidth: 15, endWidth: 15 },
                            { start: 60, end: 80, startWidth: 15, endWidth: 15 },
                            { start: 80, end: 100, startWidth: 15, endWidth: 15 }
                        ],
                        pointers: [{
                                value: 10,
                                height: 15,
                                width: 15,
                                placement: 'Far',
                                color: '#757575',
                                offset: '-100',
                                markerType: 'Circle'
                            },
                            {
                                value: 70,
                                height: 15,
                                width: 15,
                                placement: 'Far',
                                position:'Outside',
                                color: '#757575',
                                offset: '0',
                                text: '70 MPH',
                                markerType: 'Text',
                            }
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
                            format: undefined,
                            font: {
                                color: '#424242'
                            },
                            offset: 48
                        }
                    }],
                annotations: [{
                        content: '<div id="pointer" style="width:70px"><h1 style="font-size:14px;color:#424242">20 MPH</h1></div>',
                        axisIndex: 0,
                        axisValue: 10,
                        x: 10, zIndex: '1',
                        y: -70
                }]
            });
            gauge.appendTo('#container');
        });
        afterAll((): void => {
           // timeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;           
            element.remove();
        });
        it('gauge edgeLabelPlacement shift', (done: Function): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Label_0');
                expect(svg.getAttribute('y')).toBe('247');             
                done();
            };      
            gauge.refresh();
        });
        it('gauge edgeLabelPlacement Trim', (done: Function): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Label_0');
                expect(svg.getAttribute('y')).toBe('247' || '224');             
                done();
            };
            gauge.edgeLabelPlacement = 'Trim';   
            gauge.refresh();
        });
        it('gauge edgeLabelPlacement Auto', (done: Function): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Label_0');
                expect(svg.getAttribute('y')).toBe('247' || '224');             
                done();
            };
            gauge.edgeLabelPlacement = 'Auto';   
            gauge.refresh();
        });
        it('gauge edgeLabelPlacement Trim, allowMargin as false', (done: Function): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Label_0');
                expect(svg.getAttribute('y')).toBe('247' || '224');             
                done();
            };
            gauge.edgeLabelPlacement = 'Trim'; 
            gauge.axes[0].isInversed = false;
            gauge.margin.right = 8;
            gauge.allowMargin = false;  
            gauge.refresh();
        });
        it('gauge edgeLabelPlacement Auto, allowMargin as false', (done: Function): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Label_0');
                expect(svg.getAttribute('y')).toBe('247' || '224');             
                done();
            };
            gauge.edgeLabelPlacement = 'Auto'; 
            gauge.axes[0].isInversed = false;
            gauge.allowMargin = false;  
            gauge.refresh();
        });
        it('gauge edgeLabelPlacement Auto, allowMargin as false', (done: Function): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Label_0');
                expect(svg.getAttribute('y')).toBe('247' || '224');             
                done();
            };
            gauge.edgeLabelPlacement = 'Auto'; 
            gauge.axes[0].isInversed = true;
            gauge.allowMargin = false;  
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
