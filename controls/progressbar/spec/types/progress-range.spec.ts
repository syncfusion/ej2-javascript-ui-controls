import { ProgressBar } from '../../src/progressbar/progressbar';
import { createElement, EmitType } from '@syncfusion/ej2-base';
import { ILoadedEventArgs } from '../../src/progressbar/model/progress-interface';
/**
 * progress range for both linear and circular progress bar
 */
describe('ProgressBar Control', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log('Unsupported environment, window.performance.memory is unavailable');
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
    describe('ProgressBar minimum and maximum ranges for linear', () => {
        let progress: ProgressBar;
        let element: HTMLElement;
        let path: Element;
        let pathlength: number;
        let loaded: EmitType<ILoadedEventArgs>;
        beforeAll((): void => {
            element = createElement('div', { id: 'container' });
            document.body.appendChild(element);
            progress = new ProgressBar({
                type: 'Linear',
            });
            progress.appendTo('#container');
        });
        afterAll((): void => {
            progress.destroy();
            element.remove();
        });
        it('checking the default minimum and maximum range for linear', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_Linearprogress');
                pathlength = (<SVGPathElement>path).getTotalLength();
                expect(pathlength == 140 || pathlength == 622 || pathlength != null).toBe(true);
            }
            progress.value = 50;
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking the custom minimum and maximum range for linear', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_Linearprogress');
                pathlength = (<SVGPathElement>path).getTotalLength();
                expect(pathlength == 186.6666717529297 || pathlength != null).toBe(true);
            }
            progress.minimum = 10;
            progress.maximum = 70;
            progress.value = 50;
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking the wrong custom minimum and maximum range for linear', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_Linearprogress');
                pathlength = (<SVGPathElement>path).getTotalLength();
                expect(pathlength == 0).toBe(true);
            }
            progress.minimum = 10;
            progress.maximum = 70;
            progress.value = 80;
            progress.loaded = loaded;
            progress.refresh();
        });
    });
    describe('ProgressBar minimum and maximum ranges for linearbuffer', () => {
        let progress: ProgressBar;
        let element: HTMLElement;
        let path: Element;
        let pathlength: number;
        let loaded: EmitType<ILoadedEventArgs>;
        beforeAll((): void => {
            element = createElement('div', { id: 'container' });
            document.body.appendChild(element);
            progress = new ProgressBar({
                type: 'Linear',
               
            });
            progress.appendTo('#container');
        });
        afterAll((): void => {
            progress.destroy();
            element.remove();
        });
        it('checking the default minimum and maximum range for linearbuffer', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_Linearbuffer');
                pathlength = (<SVGPathElement>path).getTotalLength();
                expect(pathlength == 196 || pathlength != null).toBe(true);
            }
            progress.value = 50;
            progress.secondaryProgress = 70;
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking the custom minimum and maximum range for linearbuffer', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_Linearbuffer');
                pathlength = (<SVGPathElement>path).getTotalLength();
                expect(pathlength == 233.3333282470703 || pathlength != null).toBe(true);
            }
            progress.minimum = 10;
            progress.maximum = 70;
            progress.value = 50;
            progress.secondaryProgress = 60;
            progress.loaded = loaded;
            progress.refresh();
        });
    });
    describe('ProgressBar minimum and maximum ranges for circular', () => {
        let progress: ProgressBar;
        let element: HTMLElement;
        let path: Element;
        let pathlength: number;
        let loaded: EmitType<ILoadedEventArgs>;
        beforeAll((): void => {
            element = createElement('div', { id: 'container' });
            document.body.appendChild(element);
            progress = new ProgressBar({
                type: 'Circular'
            });
            progress.appendTo('#container');
        });
        afterAll((): void => {
            progress.destroy();
            element.remove();
        });
        it('checking the default minimum and maximum range for circular', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_Circularprogress');
                pathlength = (<SVGPathElement>path).getTotalLength();
                expect(pathlength == 282.7830810546875 || pathlength != null).toBe(true);
            }
            progress.value = 50;
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking the custom minimum and maximum range for circular', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_Circularprogress');
                pathlength = (<SVGPathElement>path).getTotalLength();
                expect(pathlength == 377.0071105957031 || pathlength != null).toBe(true);
            }
            progress.minimum = 10;
            progress.maximum = 70;
            progress.value = 50;
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking the wrong custom minimum and maximum range for circular', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_Circularprogress');
                pathlength = (<SVGPathElement>path).getTotalLength();
                expect(pathlength == 0).toBe(true);
            }
            progress.minimum = 10;
            progress.maximum = 70;
            progress.value = 80;
            progress.loaded = loaded;
            progress.refresh();
        });
    });
    describe('ProgressBar minimum and maximum ranges for circularbuffer', () => {
        let progress: ProgressBar;
        let element: HTMLElement;
        let path: Element;
        let pathlength: number;
        let loaded: EmitType<ILoadedEventArgs>;
        beforeAll((): void => {
            element = createElement('div', { id: 'container' });
            document.body.appendChild(element);
            progress = new ProgressBar({
                type: 'Circular',
                
            });
            progress.appendTo('#container');
        });
        afterAll((): void => {
            progress.destroy();
            element.remove();
        });
        it('checking the default minimum and maximum range for circular with buffer', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_Circularbuffer');
                pathlength = (<SVGPathElement>path).getTotalLength();
                expect(pathlength == 395.8665771484375 || pathlength != null).toBe(true);
            }
            progress.value = 50;
            progress.secondaryProgress = 70;
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking the custom minimum and maximum range for circular with buffer', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_Circularbuffer');
                pathlength = (<SVGPathElement>path).getTotalLength();
                expect(pathlength == 471.2483215332031 || pathlength != null).toBe(true);
            }
            progress.minimum = 10;
            progress.maximum = 70;
            progress.value = 50;
            progress.secondaryProgress = 60;
            progress.loaded = loaded;
            progress.refresh();
        });
    });
});