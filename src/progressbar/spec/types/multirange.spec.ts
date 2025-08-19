import { ProgressBar } from '../../src/progressbar/progressbar';
import { createElement, EmitType } from '@syncfusion/ej2-base';
import { ILoadedEventArgs } from '../../src/progressbar/model/progress-interface';
/**
 * progress multirange for both linear and circular progress bar
 */
describe('ProgressBar Control', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log('Unsupported environment, window.performance.memory is unavailable');
            pending(); //Skips test (in Chai)
            return;
        }
    });
    describe('ProgressBar segmentColor for linear', () => {
        let progress: ProgressBar;
        let element: HTMLElement;
        let path: Element;
        let strokeColor: string;
        let pathlength: number;
        let loaded: EmitType<ILoadedEventArgs>;
        beforeAll((): void => {
            element = createElement('div', { id: 'container' });
            document.body.appendChild(element);
            progress = new ProgressBar({
                type: 'Linear',
                segmentCount:4,
                
            });
            progress.appendTo('#container');
        });
        afterAll((): void => {
            progress.destroy();
            element.remove();
        });
        it('checking without segmentColor  for linear', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_Linearprogress');
                expect(path !== null).toBe(true);
            }
            progress.value = 50;
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking with defaultsegmentgap  for linear', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_Linearprogress');
                expect(path === null).toBe(true);
            }
            progress.segmentColor = ['black','green'];
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking with segmentColor  for linear', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_Linearprogress');
                expect(path === null).toBe(true);
            }
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking with sufficient segmentColor  for linear', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_LinearProgressSegment2');
                strokeColor = path.getAttribute('stroke');
                expect(strokeColor === 'green').toBe(true);
            }
            progress.value = 70
            progress.segmentColor = ['black','red','green'];
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking with insufficient segmentColor  for linear', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_LinearProgressSegment2');
                strokeColor = path.getAttribute('stroke');
                expect(strokeColor === 'black').toBe(true);
            }
            progress.value = 70
            progress.segmentColor = ['black'];
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking with segment color for linear buffer', ()=>{
            loaded = (args: Object): void => {
                path = document.getElementById('container_LinearBufferSegment3');
                strokeColor = path.getAttribute('stroke');
                expect(strokeColor === 'green').toBe(true);
            }
            progress.secondaryProgress = 80
            progress.segmentColor = ['black','green'];
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking with segment color with RTL for linear ', ()=>{
            loaded = (args: Object): void => {
                path = document.getElementById('container_LinearProgressSegment1');
                strokeColor = path.getAttribute('stroke');
                expect(strokeColor === 'green').toBe(true);
            }
            progress.enableRtl = true;
            progress.value = 50;
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking with segment color and corner round',()=>{
            loaded = (args: Object): void => {
                path = document.getElementById('container_LinearProgressSegment1');
                strokeColor = path.getAttribute('stroke');
                expect(strokeColor === 'green').toBe(true);
            }
            progress.enableRtl = false;
            progress.cornerRadius = 'Round';
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking with segment color for linear buffer and corner round', ()=>{
            loaded = (args: Object): void => {
                path = document.getElementById('container_LinearBufferSegment3');
                strokeColor = path.getAttribute('stroke');
                expect(strokeColor === 'green').toBe(true);
            }
            progress.loaded = loaded;
            progress.refresh();
        });
     });
     describe('ProgressBar segmentColor for circular', () => {
        let progress: ProgressBar;
        let element: HTMLElement;
        let path: Element;
        let strokeColor: string;
        let loaded: EmitType<ILoadedEventArgs>;
        beforeAll((): void => {
            element = createElement('div', { id: 'container' });
            document.body.appendChild(element);
            progress = new ProgressBar({
                type: 'Circular',
                segmentCount:4,
                gapWidth:5,
            });
            progress.appendTo('#container');
        });
        afterAll((): void => {
            progress.destroy();
            element.remove();
        });
        it('checking without segmentColor  for circular', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_Circularprogress');
                expect(path !== null).toBe(true);
            }
            progress.value = 50;
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking with segmentColor  for linear', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_Circularprogress');
                expect(path === null).toBe(true);
            }
            progress.segmentColor = ['black','green'];
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking with sufficient segmentColor  for circular', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_CircularProgressSegment2');
                strokeColor = path.getAttribute('stroke');
                expect(strokeColor === 'green').toBe(true);
            }
            progress.value = 70
            progress.segmentColor = ['black','red','green'];
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking with insufficient segmentColor  for circular', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_CircularProgressSegment2');
                strokeColor = path.getAttribute('stroke');
                expect(strokeColor === 'black').toBe(true);
            }
            progress.segmentColor = ['black'];
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking with insufficient segmentColor  for circularRTl', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_CircularProgressSegment2');
                strokeColor = path.getAttribute('stroke');
                expect(strokeColor === 'black').toBe(true);
            }
            progress.enableRtl = true;
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking with  segmentColor  for circularbuffer', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_CircularBufferSegment3');
                strokeColor = path.getAttribute('stroke');
                expect(strokeColor === 'black').toBe(true);
            }
            progress.secondaryProgress = 80;
            progress.segmentColor = ['black','red','green'];
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking with  segmentColor with corner round for circulaprogres', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_CircularProgressSegment1');
                strokeColor = path.getAttribute('stroke');
                expect(strokeColor === 'red').toBe(true);
            }
            progress.value = 50;
            progress.cornerRadius = 'Round';
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking with  segmentColor with corner round for semicirculaprogres', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_CircularProgressSegment1');
                strokeColor = path.getAttribute('stroke');
                expect(strokeColor === 'red').toBe(true);
            }
            progress.startAngle = 270;
            progress.endAngle = 90;
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking with  segmentColor with corner round for semicirculaprogres and secondary progressvalue above progress maximum', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_CircularProgressSegment1');
                strokeColor = path.getAttribute('stroke');
                expect(strokeColor === 'red').toBe(true);
            }
            progress.startAngle = 270;
            progress.endAngle = 90;
            progress.secondaryProgress = 120;
            progress.loaded = loaded;
            progress.refresh();
        });
    });
    describe('ProgressBar rangeColor & gradient for linear', () => {
        let progress: ProgressBar;
        let element: HTMLElement;
        let path: Element;
        let strokeColor: string;
        let loaded: EmitType<ILoadedEventArgs>;
        beforeAll((): void => {
            element = createElement('div', { id: 'container' });
            document.body.appendChild(element);
            progress = new ProgressBar({
                type: 'Linear',
                value: 100,
                rangeColors: [{ color: "green", start: 0, end: 10 }, { color: "blue", start: 10, end: 40 }, 
                { color: "red", start: 40, end: 60 }, { color: "yellow", start: 60, end: 100 },],
            });
            progress.appendTo('#container');
        });
        afterAll((): void => {
            progress.destroy();
            element.remove();
        });
        it('checking rangecolor for linear', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_LinearRange_0');
                strokeColor = path.getAttribute('stroke');
                expect(strokeColor === 'green').toBe(true);
            }
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking rangecolor for linear', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_LinearRange_1');
                strokeColor = path.getAttribute('stroke');
                expect(strokeColor === 'blue').toBe(true);
            }
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking rangecolor for linear', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_LinearRange_2');
                strokeColor = path.getAttribute('stroke');
                expect(strokeColor === 'red').toBe(true);
            }
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking rangecolor for linear', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_LinearRange_3');
                strokeColor = path.getAttribute('stroke');
                expect(strokeColor === 'yellow').toBe(true);
            }
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking gradient for linear', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_LinearRange_3');
                strokeColor = path.getAttribute('stroke');
                expect(strokeColor === 'url(#lineRangeGrad_3)').toBe(true);
            }
            progress.isGradient = true;
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking rangecolor for linear in RTL', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_LinearRange_3');
                strokeColor = path.getAttribute('stroke');
                expect(strokeColor === 'yellow').toBe(true);
            }
            progress.isGradient = false;
            progress.enableRtl = true;
            progress.loaded = loaded;
            progress.refresh();
        });
    });
    describe('ProgressBar rangeColor for circular', () => {
        let progress: ProgressBar;
        let element: HTMLElement;
        let path: Element;
        let strokeColor: string;
        let loaded: EmitType<ILoadedEventArgs>;
        beforeAll((): void => {
            element = createElement('div', { id: 'container' });
            document.body.appendChild(element);
            progress = new ProgressBar({
                type: 'Circular',
                value: 100,
                rangeColors: [{ color: "green", start: 0, end: 10 }, { color: "blue", start: 10, end: 40 }, 
                { color: "red", start: 40, end: 60 }, { color: "yellow", start: 60, end: 100 },],
            });
            progress.appendTo('#container');
        });
        afterAll((): void => {
            progress.destroy();
            element.remove();
        });
        it('checking rangecolor for circular', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_CircularRange_0');
                strokeColor = path.getAttribute('stroke');
                expect(strokeColor === 'green').toBe(true);
            }
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking rangecolor for circular', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_CircularRange_1');
                strokeColor = path.getAttribute('stroke');
                expect(strokeColor === 'blue').toBe(true);
            }
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking rangecolor for linear', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_CircularRange_2');
                strokeColor = path.getAttribute('stroke');
                expect(strokeColor === 'red').toBe(true);
            }
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking rangecolor for circular', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_CircularRange_3');
                strokeColor = path.getAttribute('stroke');
                expect(strokeColor === 'yellow').toBe(true);
            }
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking gradient for circular', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_CircularRange_3');
                strokeColor = path.getAttribute('stroke');
                expect(strokeColor === 'url(#circleRangeGrad_3)').toBe(true);
            }
            progress.isGradient = true;
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking rangecolor for circular in RTL', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_CircularRange_3');
                strokeColor = path.getAttribute('stroke');
                expect(strokeColor === 'yellow').toBe(true);
            }
            progress.isGradient = false;
            progress.enableRtl = true;
            progress.loaded = loaded;
            progress.refresh();
        });
    });
});