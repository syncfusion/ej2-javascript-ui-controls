import { ProgressBar } from '../../src/progressbar/progressbar';
import { createElement, EmitType } from '@syncfusion/ej2-base';
import { ILoadedEventArgs } from '../../src/progressbar/model/progress-interface';
/**
 * spec of the progress bar control
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
    describe('ProgressBar direct properties and behaviour', () => {
        let progress: ProgressBar;
        let element: HTMLElement;
        let svg: HTMLElement;
        let loaded: EmitType<ILoadedEventArgs>;
        let value: number;
        beforeAll((): void => {
            element = createElement('div', { id: 'container' });
            document.body.appendChild(element);
            progress = new ProgressBar();
        });
        afterAll((): void => {
            progress.destroy();
            element.remove();
        });
        it('Checking progress instance creation', (done: Function) => {
            progress.appendTo('#container');
            expect(progress != null).toBe(true);
            done();
        });
        it('Checking with empty options', () => {
            let className: string = document.getElementById('container').className;
            expect(className).toEqual('e-control e-progressbar e-lib');
        });
        it('Checking with empty size property', () => {
            svg = document.getElementById('containerSVG');
            expect(svg.getAttribute('width') != null).toBe(true);
            expect(svg.getAttribute('height') != null).toBe(true);
        });
        it('Checking module name', () => {
            expect(progress.getModuleName()).toBe('progressbar');
        });
        it('checking the property change', () => {
            progress.width = '200';
            progress.dataBind();
            progress.getPersistData();
            svg = document.getElementById('containerSVG');
            value = parseInt(svg.getAttribute('width'), 10);
            console.log(value + "54");
            //expect(value === 300 || value ===1264).toBe(true);
        })
        it('Checking the width of the progressbar', () => {
            loaded = (args: Object): void => {
                svg = document.getElementById('containerSVG');
                expect(svg.getAttribute('width')).toEqual('500');
            }
            progress.width = '500';
            progress.loaded = loaded;
            progress.refresh();
        });
        it('Checking the height of the progressbar', () => {
            loaded = (args: Object): void => {
                svg = document.getElementById('containerSVG');
                expect(svg.getAttribute('height')).toEqual('50');
            }
            progress.height = '50';
            progress.loaded = loaded;
            progress.refresh();
        });
        it('Checking both height and width of the progressbar', () => {
            loaded = (args: Object): void => {
                svg = document.getElementById('containerSVG');
                expect(svg.getAttribute('width')).toEqual('500');
                expect(svg.getAttribute('height')).toEqual('40');
            }
            progress.width = '500';
            progress.height = '40';
            progress.loaded = loaded;
            progress.refresh();
        });
    });
});