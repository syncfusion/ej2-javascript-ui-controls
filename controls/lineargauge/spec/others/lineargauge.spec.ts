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
