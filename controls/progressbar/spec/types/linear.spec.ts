import { ProgressBar } from '../../src/progressbar/progressbar';
import { createElement, EmitType } from '@syncfusion/ej2-base';
import { ILoadedEventArgs } from '../../src/progressbar/model/progress-interface';
/**
 * spec for linear progress bar
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
    describe('ProgressBar of type linear', () => {
        let progress: ProgressBar;
        let element: HTMLElement;
        let stroke: string;
        let path: Element;
        let loaded: EmitType<ILoadedEventArgs>;
        beforeAll((): void => {
            element = createElement('div', { id: 'container' });
            document.body.appendChild(element);
            progress = new ProgressBar(
                {
                    animation:
                    {
                        enable: false,
                    }
                }
            );
            progress.appendTo('#container');
        });
        afterAll((): void => {
            progress.destroy();
            element.remove();
        });
        it('Checking the default type', () => {
            path = document.getElementById('container_Lineartrack')
            expect(path != null).toBe(true);
        });
        it('checking the type of the progressbar after set the type', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_Lineartrack');
                expect(path != null).toBe(true);
            };
            progress.type = 'Linear';
            progress.loaded = loaded;
            progress.refresh();
        });
        it('Checking the linear progress without progress value ', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_Linearprogress');
                expect(path == null).toBe(true);
            };
            progress.loaded = loaded;
            progress.refresh();
        });
        it('Checking the linear progress with progress value ', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_Linearprogress');
                expect((<SVGPathElement>path).getTotalLength() != 0).toBe(true);
            };
            progress.value = 50;
            progress.loaded = loaded;
            progress.refresh();
        });
        it('Checking the linear progress with buffer mode without secondary progressvalue ', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_Linearbuffer');
                expect(path == null ).toBe(true);
            };
            progress.loaded = loaded;
            progress.refresh();
        });
        it('Checking the linear progress with buffer mode with secondary progressvalue ', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_Linearbuffer');
                expect((<SVGPathElement>path).getTotalLength() != 0).toBe(true);
            };
            progress.secondaryProgress = 60;
            progress.loaded = loaded;
            progress.refresh();
        });
        it('Checking the animation of buffer mode with secondary progressvalue ', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_Linearbuffer');
                expect((<SVGPathElement>path).getTotalLength() != 0).toBe(true);
            };
            progress.animation.enable = true;
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking with default track color', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_Lineartrack');
                stroke = path.getAttribute('stroke');
                expect(stroke === '#EAEAEA' ).toBe(true);
            };
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking with default progress color', ()=> {
            loaded = (args: Object): void => {
                path = document.getElementById('container_Linearprogress');
                stroke = path.getAttribute('stroke');
                expect(stroke === '#0078D6' ).toBe(true);
            };
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking with custom track color', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_Lineartrack');
                stroke = path.getAttribute('stroke');
                expect(stroke === 'red' ).toBe(true);
            };
            progress.trackColor = 'red'
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking with custom progress color', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_Linearprogress');
                stroke = path.getAttribute('stroke');
                expect(stroke === 'gray' ).toBe(true);
            };
            progress.progressColor = 'gray'
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking the thickness excide the svg height', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_Lineartrack');
                stroke = path.getAttribute('stroke-width');
                expect(stroke === '40' ).toBe(true);
            };
            progress.trackThickness = 40;
            progress.progressThickness = 30;
            progress.loaded = loaded;
            progress.refresh();
        });
 });
    describe('linear progress bar segment', () => {
        let progress: ProgressBar;
        let element: HTMLElement;
        let path: Element;
        let strokedasharray: string;
        let loaded: EmitType<ILoadedEventArgs>;
        beforeAll((): void => {
            element = createElement('div', { id: 'container' });
            document.body.appendChild(element);
            progress = new ProgressBar(
                {
                    type: 'Linear',
                    width: '400'
                }
            );
            progress.appendTo('#container');
        });
        afterAll((): void => {
            progress.destroy();
            element.remove();
        });
        it('checking without segment of the linear progress bar', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_Lineartrack');
                strokedasharray = path.getAttribute('stroke-dasharray');
                expect(strokedasharray === '0').toBe(true);
            };
            progress.loaded = loaded;
            progress.refresh();
        });
       it('checking with custom segmentcount and gapwidth of the linear progress bar', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_Lineartrack');
                strokedasharray = path.getAttribute('stroke-dasharray');
                expect(strokedasharray === " 87.5 10").toBe(true);
            };
            progress.segmentCount = 4;
            progress.gapWidth = 10;
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking with custom segmentcount and gapwidth of the  progress ', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_Linearprogress');
                strokedasharray = path.getAttribute('stroke-dasharray');
                expect(strokedasharray === " 87.5 10").toBe(true);
            };
            progress.value = 50;
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking with custom segmentcount and gapwidth of the  buffer ', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_Linearbuffer');
                strokedasharray = path.getAttribute('stroke-dasharray');
                expect(strokedasharray === " 87.5 10").toBe(true);
            };
           
            progress.secondaryProgress = 70;
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking with custom segmentcount and gapwidth with round corner', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_Lineartrack');
                strokedasharray = path.getAttribute('stroke-dasharray');
                expect(strokedasharray === " 85.25000305175782 11.8").toBe(true);
            };
            progress.cornerRadius = 'Round';
            progress.loaded = loaded;
            progress.refresh();
        });
        it('Checking with custom segment count with round corner',()=>{
            loaded = (args: Object): void => {
                path = document.getElementById('container_Linearprogress');
                strokedasharray = path.getAttribute('stroke-dasharray');
                expect(strokedasharray === " 85.25000305175782 11.8").toBe(true);
            };
            progress.loaded = loaded;
            progress.refresh();
        });
        it('Checking with custom segment count with round corner and buffer',()=>{
            loaded = (args: Object): void => {
                path = document.getElementById('container_Linearbuffer');
                strokedasharray = path.getAttribute('stroke-dasharray');
                expect(strokedasharray === " 85.25000305175782 11.8").toBe(true);
            };
            progress.loaded = loaded;
            progress.refresh();
        });
        it('Checking the track segment disable',()=>{
            loaded = (args: Object): void => {
                path = document.getElementById('container_Linearprogress');
                strokedasharray = path.getAttribute('stroke-dasharray');
                expect(strokedasharray === " 17.2 2").toBe(true);
            };
            progress.cornerRadius = 'Square';
            progress.segmentCount = 10;
            progress.gapWidth = 2;
            progress.trackSegmentDisable = true,
            progress.loaded = loaded;
            progress.refresh();
        });
        it('Checking the track segment disable with buffer',()=>{
            loaded = (args: Object): void => {
                path = document.getElementById('container_Linearbuffer');
                strokedasharray = path.getAttribute('stroke-dasharray');
                expect(strokedasharray === " 17.2 2").toBe(true);
            };
            progress.loaded = loaded;
            progress.refresh();
        });
    });
    describe('linear progress bar Indeterminate state', () => {
        let progress: ProgressBar;
        let element: HTMLElement;
        let path: Element;
        let style: string;
        let loaded: EmitType<ILoadedEventArgs>;
        beforeAll((): void => {
            element = createElement('div', { id: 'container' });
            document.body.appendChild(element);
            progress = new ProgressBar(
                {
                    type: 'Linear',
                }
            );
            progress.appendTo('#container');
        });
        afterAll((): void => {
            progress.destroy();
            element.remove();
        });
        it('checking without Indeterminate of the linear progress bar', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_Linearprogress');
                style = path.getAttribute('style');
                expect(style !=='clip-path:url(#container_clippath)').toBe(true);
            };
            progress.value = 30;
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking with Indeterminate of the linear progress bar', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_Linearprogress');
                style = path.getAttribute('style');
                expect(style ==='clip-path:url(#container_clippath)').toBe(true);
            };
            progress.isIndeterminate = true;
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking with Indeterminate of the Linear progress with segmented', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_Linearprogress');
                style = path.getAttribute('style');
                expect(style ==='clip-path:url(#container_clippath)').toBe(true);
            };
            progress.segmentCount = 5;
            progress.gapWidth = 2;
            progress.trackSegmentDisable = true;
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking without Indeterminate of the linear buffer', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_Linearbuffer');
                expect(path !== null).toBe(true);
            };
            progress.secondaryProgress = 40;
            progress.isIndeterminate = false;
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking with Indeterminate of the linear buffer', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_Linearbuffer');
                expect(path === null).toBe(true);
            };
            progress.isIndeterminate = true;
            progress.loaded = loaded;
            progress.refresh();
        });
    });
    describe('ProgressBar of type linear', () => {
        let progress: ProgressBar;
        let element: HTMLElement;
        let path: Element;
        let style:string;
        let loaded: EmitType<ILoadedEventArgs>;
        beforeAll((): void => {
            element = createElement('div', { id: 'container' });
            document.body.appendChild(element);
            progress = new ProgressBar(
                {
                   type :'Linear',
                   value:50,
                }
            );
            progress.appendTo('#container');
        });
        afterAll((): void => {
            progress.destroy();
            element.remove();
        });
        it('checking with indeterminate of the linear progress bar withRtl', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_Linearprogress');
                style = path.getAttribute('style');
                expect(style ==='clip-path:url(#container_clippath)').toBe(true);
            };
            progress.enableRtl = true;
            progress.isIndeterminate = true;
            progress.loaded = loaded;
            progress.refresh();
        });
         it('checking without indeterminate the linear progress barRtl', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_Linearprogress');
                style = path.getAttribute('style');
                expect(style ==='clip-path:url(#container_clippath)').toBe(true);
            };
            progress.animation.enable = true;
            progress.isIndeterminate = false;
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking with indeterminate of the linear progress bar ', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_Linearprogress');
                style = path.getAttribute('style');
                expect(style ==='clip-path:url(#container_clippath)').toBe(true);
            };
            progress.enableRtl = false;
            progress.isIndeterminate = true;
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking without indeterminate of the linear progress bar ', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_Linearprogress');
                style = path.getAttribute('style');
                expect(style ==='clip-path:url(#container_clippath)').toBe(true);
            };
            progress.isIndeterminate = false;
            progress.loaded = loaded;
            progress.refresh();
        });
});
describe('linear progress bar themestyle', () => {
    let progress: ProgressBar;
    let element: HTMLElement;
    let path: Element;
    let stroke:string;
    let opacity:string;
    let strokedasharray: string;
    let loaded: EmitType<ILoadedEventArgs>;
    beforeAll((): void => {
        element = createElement('div', { id: 'container' });
        document.body.appendChild(element);
        progress = new ProgressBar(
            {
                type: 'Linear',
                width: '400'
            }
        );
        progress.appendTo('#container');
    });
    afterAll((): void => {
        progress.destroy();
        element.remove();
    });
    it('checking with default theme style', () => {
        loaded = (args: Object): void => {
            path = document.getElementById('container_Lineartrack');
            stroke = path.getAttribute('stroke');
            expect(stroke === '#EAEAEA' ).toBe(true);
        };
        progress.loaded = loaded;
        progress.refresh();
    });
    it('checking with default theme style for buffer', ()=> {
        loaded = (args: Object): void => {
            path = document.getElementById('container_Linearbuffer');
            stroke = path.getAttribute('stroke');
            expect(stroke === '#0078D6' ).toBe(true);
        };
        progress.secondaryProgress = 70;
        progress.loaded = loaded;
        progress.refresh();
    });
    it('checking with default theme style for progress', ()=> {
        loaded = (args: Object): void => {
            path = document.getElementById('container_Linearprogress');
            stroke = path.getAttribute('stroke');
            expect(stroke === '#0078D6' ).toBe(true);
        };
        progress.value = 50;
        progress.loaded = loaded;
        progress.refresh();
    });
    it('checking with default theme style opacity', () => {
        loaded = (args: Object): void => {
            path = document.getElementById('container_Lineartrack');
            opacity = path.getAttribute('opacity');
            expect(opacity === '1' ).toBe(true);
        };
        progress.loaded = loaded;
        progress.refresh();
    });
    it('checking with default theme style bufferopacity', () => {
        loaded = (args: Object): void => {
            path = document.getElementById('container_Linearbuffer');
            opacity = path.getAttribute('opacity');
            expect(opacity === '0.3' ).toBe(true);
        };
        progress.loaded = loaded;
        progress.refresh();
    });
    it('checking with default theme style progressopacity', () => {
        loaded = (args: Object): void => {
            path = document.getElementById('container_Linearprogress');
            opacity = path.getAttribute('opacity');
            expect(opacity === '1' ).toBe(true);
        };
        progress.loaded = loaded;
        progress.refresh();
    });
    it('checking with default theme style gapwidth', () => {
        loaded = (args: Object): void => {
            path = document.getElementById('container_Linearprogress');
            strokedasharray = path.getAttribute('stroke-dasharray');
            expect(strokedasharray ===  " 93.5 2").toBe(true);
        };
        progress.segmentCount = 4;
        progress.loaded = loaded;
        progress.refresh();
    });
    it('checking with material theme style for track', ()=>{
        loaded = (args: Object): void => {
            path = document.getElementById('container_Lineartrack');
            stroke = path.getAttribute('stroke');
            expect(stroke === "#E3165B" ).toBe(true);
        };
        progress.theme = 'Material';
        progress.loaded = loaded;
        progress.refresh();
    });
    it('checking with material theme style opacity for track', () => {
        loaded = (args: Object): void => {
            path = document.getElementById('container_Lineartrack');
            opacity = path.getAttribute('opacity');
            expect(opacity === '0.26' ).toBe(true);
        };
        progress.loaded = loaded;
        progress.refresh();
    });
    it('checking with material theme style opacity for buffer', () => {
        loaded = (args: Object): void => {
            path = document.getElementById('container_Linearbuffer');
            opacity = path.getAttribute('opacity');
            expect(opacity === '0.4' ).toBe(true);
        };
        progress.loaded = loaded;
        progress.refresh();
    });
    it('checking with HighContrast theme style gapwidth', () => {
        loaded = (args: Object): void => {
            path = document.getElementById('container_Linearprogress');
            strokedasharray = path.getAttribute('stroke-dasharray');
            expect(strokedasharray ===  " 93.5 2").toBe(true);
        };
        progress.theme = 'HighContrast';
        progress.loaded = loaded;
        progress.refresh();
    });
    it('checking with bootstrap3 theme style for progress', ()=> {
        loaded = (args: Object): void => {
            path = document.getElementById('container_Linearprogress');
            stroke = path.getAttribute('stroke');
            expect(stroke === '#317ab9' ).toBe(true);
        };
        progress.theme = 'Bootstrap';
        progress.loaded = loaded;
        progress.refresh();
    });
    it('checking with bootstrap4 theme style for progress', ()=> {
        loaded = (args: Object): void => {
            path = document.getElementById('container_Linearprogress');
            stroke = path.getAttribute('stroke');
            expect(stroke === '#007bff' ).toBe(true);
        };
        progress.theme = 'Bootstrap4';
        progress.loaded = loaded;
        progress.refresh();
    });
});
describe('linear progress bar databind', () => {
    let progress: ProgressBar;
    let element: HTMLElement;
    let path: Element;
    let pathWidth: number;
    let loaded: EmitType<ILoadedEventArgs>;
    beforeAll((): void => {
        element = createElement('div', { id: 'container' });
        document.body.appendChild(element);
        progress = new ProgressBar(
            {
                type: 'Linear',
                width: '400',
                value: 20,
                animation: { enable: true }
            }
        );
        progress.appendTo('#container');
    });
    afterAll((): void => {
        progress.destroy();
        element.remove();
    });
    it('checking the without changing the value', () => {
        loaded = (args: Object): void => {
            path = document.getElementById('container_Linearprogress');
            pathWidth = (<SVGPathElement>path).getTotalLength();
            expect(pathWidth === 76 ).toBe(true);
        };
        progress.loaded = loaded;
        progress.refresh();
    });
    it('checking the changing the value using databind', () => {
        loaded = (args: Object): void => {
            path = document.getElementById('container_Linearprogress');
            pathWidth = (<SVGPathElement>path).getTotalLength();
            expect(pathWidth === 152 ).toBe(true);
        };
        progress.value += 20;
        progress.dataBind();
        progress.loaded = loaded;
        progress.refresh();
    });
    it('checking the changing the value using databind with animation', () => {
        loaded = (args: Object): void => {
            path = document.getElementById('container_Linearprogress');
            pathWidth = (<SVGPathElement>path).getTotalLength();
            expect(pathWidth === 380 ).toBe(true);
        };
        progress.value += 60;
        progress.dataBind();
        progress.loaded = loaded;
        progress.refresh();
    });
});
});