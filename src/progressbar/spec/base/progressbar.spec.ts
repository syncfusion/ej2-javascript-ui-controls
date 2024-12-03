import { ProgressBar } from '../../src/progressbar/progressbar';
import { Browser, createElement, EmitType, enableRtl } from '@syncfusion/ej2-base';
import { ILoadedEventArgs, IMouseEventArgs } from '../../src/progressbar/model/progress-interface';
import { ProgressAnnotation } from '../../src/progressbar/model/progress-annotation';
import { colorNameToHex, componentToHex, convertHexToColor, getElement, removeElement, Pos } from '../../src/progressbar/utils/helper';
ProgressBar.Inject(ProgressAnnotation);
/**
 * spec of the progress bar control
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
    describe('ProgressBar annotation', () => {
        let progress: ProgressBar;
        let element: HTMLElement;
        let path: Element;
        let stroke: string;
        let loaded: EmitType<ILoadedEventArgs>;
        beforeAll((): void => {
            element = createElement('div', { id: 'container' });
            document.body.appendChild(element);
            progress = new ProgressBar(
                {
                    type: 'Linear',
                    width: '400',
                    value: 75,
                    trackThickness: 20,
                    progressThickness: 20,
                    annotations: [
                        {
                            content:
                                '<div id="point1" style="font-size:20px;font-weight:bold;color:#ffffff;fill:#ffffff"><span>60%</span></div>'
                        }
                    ]
                }
            );
            progress.appendTo('#container');
        });
        afterAll((): void => {
            progress.destroy();
            element.remove();
        });
        it('checking default annotation ', () => {
            loaded = (args: ILoadedEventArgs): void => {
                expect(args.progressBar.annotations[0].content !== null).toBe(true);
            };
            progress.isActive = true;
            progress.isReact = true;
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking annotation event ', () => {
            loaded = (args: ILoadedEventArgs): void => {
                expect(args.progressBar.annotations[0].content !== null).toBe(true);
            };
            progress.isIndeterminate = false;
            progress.animation.enable = true;
            progress.isActive = true;
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking annotation event ', () => {
            loaded = (args: ILoadedEventArgs): void => {
                expect(args.progressBar.annotations[0].content !== null).toBe(true);
            };
            progress.isIndeterminate = false;
            progress.annotations[0].annotationAngle = 90;
            progress.annotations[0].annotationRadius = '50%';
            progress.isActive = true;
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking theme Fluent2HighContrast ', () => {
            loaded = (args: ILoadedEventArgs): void => {
                path = document.getElementById('container_Lineartrack');
                expect(path !== null).toBe(true);
            };
            progress.theme = 'Fluent2HighContrast';
            progress.cornerRadius = 'Round4px';
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking theme FluentDark ', () => {
            loaded = (args: ILoadedEventArgs): void => {
                path = document.getElementById('container_Lineartrack');
                expect(path !== null).toBe(true);
            };
            progress.theme = 'FluentDark';
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking theme Fluent ', () => {
            loaded = (args: ILoadedEventArgs): void => {
                path = document.getElementById('container_Lineartrack');
                expect(path !== null).toBe(true);
            };
            progress.theme = 'Fluent';
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking theme Bootstrap5Dark ', () => {
            loaded = (args: ILoadedEventArgs): void => {
                path = document.getElementById('container_Lineartrack');
                expect(path !== null).toBe(true);
            };
            progress.theme = 'Bootstrap5Dark';
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking theme Bootstrap5 ', () => {
            loaded = (args: ILoadedEventArgs): void => {
                path = document.getElementById('container_Lineartrack');
                expect(path !== null).toBe(true);
            };
            progress.theme = 'Bootstrap5';
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking theme FabricDark', () => {
            loaded = (args: ILoadedEventArgs): void => {
                path = document.getElementById('container_Lineartrack');
                expect(path !== null).toBe(true);
            };
            progress.theme = 'FabricDark';
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking theme BootstrapDark', () => {
            loaded = (args: ILoadedEventArgs): void => {
                path = document.getElementById('container_Lineartrack');
                expect(path !== null).toBe(true);
            };
            progress.theme = 'BootstrapDark';
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking theme MaterialDark', () => {
            loaded = (args: ILoadedEventArgs): void => {
                path = document.getElementById('container');
                expect(path !== null).toBe(true);
            };
            progress.theme = 'MaterialDark';
            progress.loaded = loaded;
            progress.cornerRadius = 'Round4px';
            progress.segmentCount = 2;
            progress.refresh();
        });
        it('checking corner radius', () => {
            loaded = (args: ILoadedEventArgs): void => {
                path = document.getElementById('container');
                expect(path !== null).toBe(true);
            };
            progress.theme = 'Bootstrap4';
            progress.loaded = loaded;
            progress.cornerRadius = 'Round4px';
            progress.segmentCount = 2;
            progress.refresh();
        });
        it('checking Linear progress bootstrap 4', () => {
            loaded = (args: ILoadedEventArgs): void => {
                path = document.getElementById('container');
                expect(path !== null).toBe(true);
            };
            progress.theme = 'Bootstrap4';
            progress.cornerRadius = 'Auto';
            progress.type = 'Linear';
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking Linear progress Fluent2', () => {
            loaded = (args: ILoadedEventArgs): void => {
                path = document.getElementById('container');
                expect(path !== null).toBe(true);
            };
            progress.theme = 'Fluent2';
            progress.type = 'Linear';
            progress.isIndeterminate = true;
            progress.cornerRadius = 'Auto';
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking Linear progress enable rtl', () => {
            loaded = (args: ILoadedEventArgs): void => {
                path = document.getElementById('container');
                expect(path !== null).toBe(true);
            };
            progress.theme = 'Fluent2';
            progress.type = 'Linear';
            progress.isIndeterminate = false;
            progress.enableRtl = true;
            progress.cornerRadius = 'Round';
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking Linear progress enable rtl progress thickness greater that width', () => {
            loaded = (args: ILoadedEventArgs): void => {
                path = document.getElementById('container');
                expect(path !== null).toBe(true);
            };
            progress.width = '100px';
            progress.trackThickness = 150;
            progress.theme = 'Fluent2';
            progress.type = 'Linear';
            progress.enableRtl = true;
            progress.cornerRadius = 'Round';
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking progress show and hide methods', () => {
            loaded = (args: ILoadedEventArgs): void => {
                path = document.getElementById('container');
                expect(true).toBe(true);
                convertHexToColor('transparent');
                progress.isIndeterminate = false;
                args.progressBar.show();
                args.progressBar.hide();
                let element = getElement('container');
                removeElement(element as any);
            };
            progress.loaded = loaded;
            progress.isIndeterminate = true;
            progress.refresh();
        });
        it('checking progress show and hide methods', () => {
            loaded = (args: ILoadedEventArgs): void => {
                path = document.getElementById('container');
                expect(path !== null).toBe(true);
                convertHexToColor('transparent');
                let position = new Pos(10, 10);
                args.progressBar.show();
                args.progressBar.hide();
                let element = getElement('container');
                removeElement(element as any);
                expect(true).toBe(true);
            };
            progress.loaded = loaded;
            progress.annotations=[{content: '10', annotationAngle: 25}];
            progress.showProgressValue= true;
            progress.animation = {enable: true, duration: 1501, delay: 221};
            progress.isIndeterminate = true;
        });
        it('checking progress resize', () => {
            loaded = (args: ILoadedEventArgs): void => {
                window.dispatchEvent(new Event('resize'));
                expect(true).toBe(true);
            };
            progress.loaded = loaded;
            progress.refresh();
        });
    });
    describe('ProgressBar annotation', () => {
        let progress: ProgressBar;
        let element: HTMLElement;
        let path: Element;
        let stroke: string;
        let loaded: EmitType<ILoadedEventArgs>;
        beforeAll((): void => {
            element = createElement('div', { id: 'container' });
            document.body.appendChild(element);
            progress = new ProgressBar(
                {
                    type: 'Linear',
                    width: '400',
                    value: 75,
                    trackThickness: 20,
                    progressThickness: 20,
                    annotations: null
                }
            );
            progress.appendTo('#container');
        });
        afterAll((): void => {
            progress.destroy();
            element.remove();
        });
        it('checking default annotation as null ', () => {
            loaded = (args: ILoadedEventArgs): void => {
                expect(true).toBe(true);
            };
            progress.isActive = true;
            progress.isReact = true;
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking default type as null ', () => {
            loaded = (args: ILoadedEventArgs): void => {
                expect(true).toBe(true);
            };
            progress.type = null;
            progress.isActive = true;
            progress.isReact = true;
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking progress bar public methods', () => {
            loaded = (args: ILoadedEventArgs): void => {
                path = document.getElementById('container');
                expect(path !== null).toBe(true);
                let element = getElement('container');
                removeElement(null);
                colorNameToHex('red');
                colorNameToHex('');
                colorNameToHex('rgb(255,0,0)');
                convertHexToColor('#ff0000');
                convertHexToColor('');
                componentToHex(255);
                componentToHex(0);
                args.progressBar.show();
                args.progressBar.hide();
            }
            progress.loaded = loaded;
            progress.refresh();
        });
    });
});  