import { ProgressBar } from '../../src/progressbar/progressbar';
import { createElement, EmitType } from '@syncfusion/ej2-base';
import { ILoadedEventArgs } from '../../src/progressbar/model/progress-interface';
/**
 * spec for circular progress bar
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
    describe('ProgressBar of type Circular', () => {
        let progress: ProgressBar;
        let element: HTMLElement;
        let stroke:string;
        let path: Element;
        let style: string;
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
        it('checking the type of the progressbar after set the type', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_Circulartrack');
                expect(path != null).toBe(true);
            }
            progress.type = 'Circular';
            progress.loaded = loaded;
            progress.refresh();
        });
        it('Checking the circular progress without progress value ', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_Circularprogress');
                expect(path == null).toBe(true);
            }
            progress.loaded = loaded;
            progress.refresh();
        });
        it('Checking the circular progress with progress value ', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_Circularprogress');
                element.appendChild(path);
                expect((<SVGPathElement>path).getTotalLength() != 0).toBe(true);
            }
            progress.value = 50;
            progress.loaded = loaded;
            progress.refresh();
        });

        it('Checking the circular progress with buffer mode without secondary progressvalue ', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_Circularbuffer');
                expect(path == null).toBe(true);
            }
            progress.loaded = loaded;
            progress.refresh();
        });
        it('Checking the circular progress with buffer mode with secondary progressvalue ', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_Circularbuffer');
                expect((<SVGPathElement>path).getTotalLength() != 0).toBe(true);
            }
            progress.secondaryProgress = 60;
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking with custom track color', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_Circulartrack');
                stroke = path.getAttribute('stroke');
                expect(stroke === 'red' ).toBe(true);
            };
            progress.trackColor = 'red'
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking with custom progress color', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_Circularprogress');
                stroke = path.getAttribute('stroke');
                expect(stroke === 'gray' ).toBe(true);
            };
            progress.progressColor = 'gray'
            progress.loaded = loaded;
            progress.refresh();
        });

        it('checking with animation of the circular progress bar', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_Circularprogress');
                style = path.getAttribute('style');
                expect(style ==='clip-path:url(#container_clippath)').toBe(true);
            };
            progress.animation.enable = true;
            progress.loaded = loaded;
            progress.refresh();
        });
        
        it('checking with RTL animation of the circular progress bar', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_Circularprogress');
                style = path.getAttribute('style');
                expect(style ==='clip-path:url(#container_clippath)').toBe(true);
            };
            progress.animation.enable = true;
            progress.enableRtl = true;
            progress.loaded = loaded;
            progress.refresh();
        });
    });
    describe('startangle and endangle for circular', () => {
        let progress: ProgressBar;
        let element: HTMLElement;
        let path: Element;
        let value: number;
        let loaded: EmitType<ILoadedEventArgs>;
        beforeAll((): void => {
            element = createElement('div', { id: 'container' });
            document.body.appendChild(element);
            progress = new ProgressBar(
                {
                    type: 'Circular',
                }
            );
            progress.appendTo('#container');
        });
        afterAll((): void => {
            progress.destroy();
            element.remove();
        });
        it('checking the default start and endangle', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_Circulartrack');
                value = Math.round((<SVGPathElement>path).getTotalLength());
                expect(value === 302 || value === 302).toBe(true);
            }
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking the default start and endangle with progress', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_Circularprogress');
                value = Math.round((<SVGPathElement>path).getTotalLength());
                expect(value === 151 || value === 151).toBe(true);
            }
            progress.value = 50;
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking the default start and endangle with buffer', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_Circularbuffer');
                value = Math.round((<SVGPathElement>path).getTotalLength());
                expect(value === 211 || value === 211).toBe(true);
            }
            progress.secondaryProgress = 70;
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking the custom start and endangle', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_Circulartrack');
                value = Math.round((<SVGPathElement>path).getTotalLength());
                expect(value === 151 || value === 151).toBe(true);
            }
            progress.startAngle = 270;
            progress.endAngle = 90;
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking the custom start and endangle in progress', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_Circularprogress');
                value = Math.round((<SVGPathElement>path).getTotalLength());
                expect(value === 75 || value === 75).toBe(true);
            }
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking the custom start and endangle in buffer', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_Circularbuffer');
                value = Math.round((<SVGPathElement>path).getTotalLength());
                expect(value === 106 || value === 106).toBe(true);
            }
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking the same custom start and endangle', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_Circulartrack');
                value = Math.round((<SVGPathElement>path).getTotalLength());
                expect(value === 302|| value === 302).toBe(true);
            }
            progress.startAngle = 90;
            progress.endAngle = 90;
            progress.loaded = loaded;
            progress.refresh();
        });
    });
    describe('Circular progress bar segment', () => {
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
                    type: 'Circular',
                    width: '300',
                    height: '300'
                }
            );
            progress.appendTo('#container');
        });
        afterAll((): void => {
            progress.destroy();
            element.remove();
        });
        it('checking without segment of the circular progress bar', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_Circulartrack');
                strokedasharray = path.getAttribute('stroke-dasharray');
                expect(strokedasharray == '0').toBe(true);
            };
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking custom segment of the circular progress bar', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_Circulartrack');
                strokedasharray = path.getAttribute('stroke-dasharray');
                expect(strokedasharray == " 211.7943878173828 5").toBe(true);
            };
            progress.segmentCount = 4;
            progress.gapWidth = 5;
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking custom segment of the semicircular progress bar', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_Circulartrack');
                strokedasharray = path.getAttribute('stroke-dasharray');
                expect(strokedasharray == " 104.65017700195312 5").toBe(true);
            };
            progress.startAngle = 270;
            progress.endAngle = 90;
            progress.loaded = loaded;
            progress.refresh();
        });
       it('checking custom segment of circular track with corner round',()=>{
        loaded = (args: Object): void => {
            path = document.getElementById('container_Circulartrack');
            strokedasharray = path.getAttribute('stroke-dasharray');
            expect(strokedasharray == " 208.19438781738282 8.6").toBe(true);
        };
        progress.startAngle = 0;
        progress.endAngle = 360;
        progress.cornerRadius ='Round';
        progress.loaded = loaded;
        progress.refresh();
    });
    it('checking custom segment of circular progress  with corner round',()=>{
        loaded = (args: Object): void => {
            path = document.getElementById('container_Circularprogress');
            strokedasharray = path.getAttribute('stroke-dasharray');
            expect(strokedasharray == " 208.19438781738282 8.6").toBe(true);
        };
        progress.value = 50;
        progress.loaded = loaded;
        progress.refresh();
    });
    it('checking custom segment of circular buffer  with corner round',()=>{
        loaded = (args: Object): void => {
            path = document.getElementById('container_Circularbuffer');
            strokedasharray = path.getAttribute('stroke-dasharray');
            expect(strokedasharray == " 208.19438781738282 8.6").toBe(true);
        };
        progress.secondaryProgress = 70;
        progress.loaded = loaded;
        progress.refresh();
    });
        it('checking custom segment of the semicircular progress bar', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_Circulartrack');
                strokedasharray = path.getAttribute('stroke-dasharray');
                expect(strokedasharray == " 101.95017700195312 8.6").toBe(true);
            };
            progress.startAngle = 270;
            progress.endAngle = 90;
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking the trackSegment disable', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_Circularprogress');
                strokedasharray = path.getAttribute('stroke-dasharray');
                expect(strokedasharray == " 41.36007385253906 2").toBe(true);
            };
            progress.startAngle = 0;
            progress.endAngle = 360;
            progress.cornerRadius = 'Square';
            progress.segmentCount = 10;
            progress.gapWidth = 2;
            progress.trackSegmentDisable = true;
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking the trackSegment disable with buffer', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_Circularbuffer');
                strokedasharray = path.getAttribute('stroke-dasharray');
                expect(strokedasharray == " 41.36007385253906 2").toBe(true);
            };
            progress.loaded = loaded;
            progress.refresh();
        });
    });
    describe('Circular progress bar radius', () => {
        let progress: ProgressBar;
        let element: HTMLElement;
        let path: Element;
        let pathlength: number;
        let progresspath: Element;
        let trackStroke: string;
        let progressStroke: string;
        let loaded: EmitType<ILoadedEventArgs>;
        beforeAll((): void => {
            element = createElement('div', { id: 'container' });
            document.body.appendChild(element);
            progress = new ProgressBar(
                {
                    type: 'Circular',
                }
            );
            progress.appendTo('#container');
        });
        afterAll((): void => {
            progress.destroy();
            element.remove();
        });
        it('checking default radius of the circular progress bar', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_Circulartrack');
                pathlength = Math.round((<SVGPathElement>path).getTotalLength());
                expect(pathlength == 302 || pathlength == 302).toBe(true);
            };
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking default innerRadius of the circular progress bar', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_Circularprogress');
                pathlength = Math.round((<SVGPathElement>path).getTotalLength());
                expect(pathlength == 151 || pathlength === 151).toBe(true);
            };
            progress.value = 50;
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking custom radius of the circular progress bar', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_Circulartrack');
                pathlength = Math.round((<SVGPathElement>path).getTotalLength());
                expect(pathlength == 271 || pathlength === 271).toBe(true);
            };
            progress.radius = '90%';
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking custom innerRadius of the circular progress bar', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_Circularprogress');
                pathlength = Math.round((<SVGPathElement>path).getTotalLength());
                expect(pathlength == 128 || pathlength === 128 ).toBe(true);
            };
            progress.innerRadius = '85%';
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking custom radius as without %  of the circular progress bar', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_Circulartrack');
                pathlength = Math.round((<SVGPathElement>path).getTotalLength());
                expect(pathlength == 534.1309814453125 || pathlength === 534).toBe(true);
            };
            progress.radius = '85';
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking custom radius as null of the circular progress bar', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_Circulartrack');
                pathlength = Math.round((<SVGPathElement>path).getTotalLength());
                expect(pathlength == 0).toBe(true);
            };
            progress.radius = null ;
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking default radius&innerRadius for segment of the circular progress bar', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_Circulartrack');
                progresspath = document.getElementById('container_Circularprogress')
                trackStroke = path.getAttribute('stroke-dasharray');
                progressStroke = progresspath.getAttribute('stroke-dasharray');
                expect(trackStroke === progressStroke).toBe(true);
            };
            progress.radius = '100%'
            progress.innerRadius = '100%';
            progress.segmentCount = 4;
            progress.gapWidth = 5;
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking custom radius&innerRadius for segment of the circular progress bar', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_Circulartrack');
                progresspath = document.getElementById('container_Circularprogress')
                trackStroke = path.getAttribute('stroke-dasharray');
                progressStroke = progresspath.getAttribute('stroke-dasharray');
                expect(trackStroke !== progressStroke).toBe(true);
            };
            progress.radius = '90%'
            progress.innerRadius = '85%';
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking custom innerRadius greaterthan radius for segment of the circular progress bar', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_Circulartrack');
                progresspath = document.getElementById('container_Circularprogress')
                trackStroke = path.getAttribute('stroke-dasharray');
                progressStroke = progresspath.getAttribute('stroke-dasharray');
                expect(trackStroke !== progressStroke).toBe(true);
            };
            progress.radius = '85%'
            progress.innerRadius = '90%';
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking default radius&innerRadius for segment of the circularbuffer', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_Circulartrack');
                progresspath = document.getElementById('container_Circularbuffer')
                trackStroke = path.getAttribute('stroke-dasharray');
                progressStroke = progresspath.getAttribute('stroke-dasharray');
                expect(trackStroke === progressStroke).toBe(true);
            };
            progress.radius = '100%'
            progress.innerRadius = '100%';
            progress.secondaryProgress = 70;
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking custom radius&innerRadius for segment of the circularbuffer ', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_Circulartrack');
                progresspath = document.getElementById('container_Circularbuffer')
                trackStroke = path.getAttribute('stroke-dasharray');
                progressStroke = progresspath.getAttribute('stroke-dasharray');
                expect(trackStroke !== progressStroke).toBe(true);
            };
            progress.radius = '90%'
            progress.innerRadius = '85%';
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking custom innerRadius greaterthan radius for segment of the circularbuffer', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_Circulartrack');
                progresspath = document.getElementById('container_Circularbuffer')
                trackStroke = path.getAttribute('stroke-dasharray');
                progressStroke = progresspath.getAttribute('stroke-dasharray');
                expect(trackStroke !== progressStroke).toBe(true);
            };
            progress.radius = '85%'
            progress.innerRadius = '90%';
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking default thickness of the circular progress bar', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_Circularprogress');
                progressStroke = path.getAttribute('stroke-width');
                expect(progressStroke === '4').toBe(true);
            };
            progress.loaded = loaded;
            progress.refresh();
        });
     });
    describe('Circular progress bar Indeterminate state', () => {
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
                    type: 'Circular',
                }
            );
            progress.appendTo('#container');
        });
        afterAll((): void => {
            progress.destroy();
            element.remove();
        });
        it('checking without Indeterminate of the Circular progress bar', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_Circularprogress');
                style = path.getAttribute('style');
                expect(style !=='clip-path:url(#container_clippath)').toBe(true);
            };
            progress.value = 30;
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking with Indeterminate of the Circular progress bar', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_Circularprogress');
                style = path.getAttribute('style');
                expect(style ==='clip-path:url(#container_clippath)').toBe(true);
            };
            progress.isIndeterminate = true;
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking without Indeterminate of the circular buffer', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_Circularbuffer');
                expect(path !== null).toBe(true);
            };
            progress.secondaryProgress = 40;
            progress.isIndeterminate = false;
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking with Indeterminate of the Circular buffer', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_Circularbuffer');
                expect(path === null).toBe(true);
            };
            progress.isIndeterminate = true;
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking with Indeterminate of the Circular progress with segmented', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_Circularprogress');
                style = path.getAttribute('style');
                expect(style ==='clip-path:url(#container_clippath)').toBe(true);
            };
            progress.segmentCount = 5;
            progress.gapWidth = 2;
            progress.trackSegmentDisable = true;
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking with Indeterminate of the Circular progress bar with RTL', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_Circularprogress');
                style = path.getAttribute('style');
                expect(style ==='clip-path:url(#container_clippath)').toBe(true);
            };
            progress.enableRtl = true;
            progress.isIndeterminate = true;
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
                    type: 'Circular',
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
                path = document.getElementById('container_Circulartrack');
                stroke = path.getAttribute('stroke');
                expect(stroke === '#E6E6E6' ).toBe(true);
            };
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking with default theme style for buffer', ()=> {
            loaded = (args: Object): void => {
                path = document.getElementById('container_Circularbuffer');
                stroke = path.getAttribute('stroke');
                expect(stroke === '#0078D6' ).toBe(true);
            };
            progress.secondaryProgress = 70;
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking with default theme style for progress', ()=> {
            loaded = (args: Object): void => {
                path = document.getElementById('container_Circularprogress');
                stroke = path.getAttribute('stroke');
                expect(stroke === '#0078D6' ).toBe(true);
            };
            progress.value = 50;
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking with default theme style opacity', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_Circulartrack');
                opacity = path.getAttribute('opacity');
                expect(opacity === '1' ).toBe(true);
            };
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking with default theme style bufferopacity', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_Circularbuffer');
                opacity = path.getAttribute('opacity');
                expect(opacity === '0.3' ).toBe(true);
            };
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking with default theme style progressopacity', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_Circularprogress');
                opacity = path.getAttribute('opacity');
                expect(opacity === '1' ).toBe(true);
            };
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking with default theme style gapwidth', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_Circularprogress');
                strokedasharray = path.getAttribute('stroke-dasharray');
                expect(strokedasharray != null).toBe(true);
            };
            progress.segmentCount = 4;
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking with material theme style for track', ()=>{
            loaded = (args: Object): void => {
                path = document.getElementById('container_Circulartrack');
                stroke = path.getAttribute('stroke');
                expect(stroke === "#E3165B" ).toBe(true);
            };
            progress.theme = 'Material';
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking with material theme style opacity for track', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_Circulartrack');
                opacity = path.getAttribute('opacity');
                expect(opacity === '0.26' ).toBe(true);
            };
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking with material theme style opacity for buffer', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_Circularbuffer');
                opacity = path.getAttribute('opacity');
                expect(opacity === '0.4' ).toBe(true);
            };
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking with HighContrast theme style gapwidth', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_Circularprogress');
                strokedasharray = path.getAttribute('stroke-dasharray');
                expect(strokedasharray != null ).toBe(true);
            };
            progress.theme = 'HighContrast';
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking with bootstrap3 theme style for progress', ()=> {
            loaded = (args: Object): void => {
                path = document.getElementById('container_Circularprogress');
                stroke = path.getAttribute('stroke');
                expect(stroke === '#317ab9' ).toBe(true);
            };
            progress.theme = 'Bootstrap';
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking with bootstrap4 theme style for progress', ()=> {
            loaded = (args: Object): void => {
                path = document.getElementById('container_Circularprogress');
                stroke = path.getAttribute('stroke');
                expect(stroke === '#007bff' ).toBe(true);
            };
            progress.theme = 'Bootstrap4';
            progress.loaded = loaded;
            progress.refresh();
        });
    });
    describe('linear progress bar themestyle', () => {
        let progress: ProgressBar;
        let element: HTMLElement;
        let path: Element;
        let loaded: EmitType<ILoadedEventArgs>;
        beforeAll((): void => {
            element = createElement('div', { id: 'container' });
            document.body.appendChild(element);
            progress = new ProgressBar(
                {
                    type: 'Circular',
                }
            );
            progress.appendTo('#container');
        });
        afterAll((): void => {
            progress.destroy();
            element.remove();
        });
        it('checking the set annotation in circular progress', () => {
            loaded = (args: Object): void => {
                let element: HTMLElement = document.getElementById('container2Annotation0');
                expect((element as HTMLElement).style.left).toBe('178px');
                expect((element as HTMLElement).style.top).toBe('159px');
            };
        });
        it('checking the set annotation in circular progress', () => {
            loaded = (args: Object): void => {
                let element: HTMLElement = document.getElementById('container3Annotation0');
                expect((element as HTMLElement).style.left).toBe('178px');
                expect((element as HTMLElement).style.top).toBe('89px');
            };
        });
    });
    describe('circular progress bar databind', () => {
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
                    type: 'Circular',
                    width: '400',
                    height: '300',
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
                path = document.getElementById('container_Circularprogress');
                pathWidth = (<SVGPathElement>path).getTotalLength();
                expect(pathWidth === 173.41769409179688 ).toBe(true);
            };
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking the changing the value using databind', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_Circularprogress');
                pathWidth = (<SVGPathElement>path).getTotalLength();
                expect(pathWidth === 346.8353271484375 ).toBe(true);
            };
            progress.value += 20;
            progress.dataBind();
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking the changing the value using databind with animation', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_Circularprogress');
                pathWidth = (<SVGPathElement>path).getTotalLength();
                expect(pathWidth === 867.1773681640625 ).toBe(true);
            };
            progress.value += 60;
            progress.dataBind();
            progress.loaded = loaded;
            progress.refresh();
        });
    });
});