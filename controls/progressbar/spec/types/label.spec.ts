import { ProgressBar } from '../../src/progressbar/progressbar';
import { createElement, EmitType } from '@syncfusion/ej2-base';
import { ILoadedEventArgs,ITextRenderEventArgs } from '../../src/progressbar/model/progress-interface';
/**
 * spec for linear progress bar
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
    describe('ProgressBar Linear Label', () => {
        let progress: ProgressBar;
        let element: HTMLElement;
        let path: Element;
        let pos: string;
        let loaded: EmitType<ILoadedEventArgs>;
        beforeAll((): void => {
            element = createElement('div', { id: 'container' });
            document.body.appendChild(element);
            progress = new ProgressBar(
                {
                    type: 'Linear',
                    width: '400',
                    value: 100,
                    trackThickness: 20,
                    progressThickness: 20,
                }
            );
            progress.appendTo('#container');
        });
        afterAll((): void => {
            progress.destroy();
            element.remove();
        });
        it('checking the default label placement', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_linearLabel');
                pos = path.getAttribute('x');
                expect(pos === '366.5' ).toBe(true);
            };
            progress.showProgressValue = true;
            progress.loaded = loaded;
            progress.refresh();
        }); 
        it('checking the near label placement', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_linearLabel');
                pos = path.getAttribute('x');
                expect(pos === '33.5' ).toBe(true);
            };
            progress.labelStyle.textAlignment = 'Near';
            progress.loaded = loaded;
            progress.refresh();
        }); 
        it('checking the center label placement', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_linearLabel');
                pos = path.getAttribute('x');
                expect(pos === '200' ).toBe(true);
            };
            progress.labelStyle.textAlignment = 'Center';
            progress.loaded = loaded;
            progress.refresh();
        }); 
        it('checking the center label placement with lesser progress length ', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_linearLabel');
                pos = path.getAttribute('x');
                expect(pos === '20.5' || pos === '19.5').toBe(true);
            };
            progress.value = 5;
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking the far label placement with lesser progress length ', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_linearLabel');
                pos = path.getAttribute('x');
                expect(pos === '20.5' ).toBe(true);
            };
            progress.labelStyle.textAlignment = 'Far';
            progress.loaded = loaded;
            progress.refresh();
        }); 
        it('checking the label animation', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_linearLabel');
                pos = path.getAttribute('x');
                expect(pos === '366.5' ).toBe(true);
            };
            progress.animation.enable = true;
            progress.value = 100;
            progress.loaded = loaded;
            progress.refresh();
        }); 
        it('checking the custom label animation', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_linearLabel');
                pos = path.getAttribute('x');
                expect(pos === '354' ).toBe(true);
            };
            progress.labelStyle.text = 'Complete';
            progress.animation.enable = true;
            progress.loaded = loaded;
            progress.refresh();
        }); 
        it('checking the default label placement in RTL', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_linearLabel');
                pos = path.getAttribute('x');
                expect(pos === '46' ).toBe(true);
            };
            progress.enableRtl = true;
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking the near label placement in RTL', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_linearLabel');
                pos = path.getAttribute('x');
                expect(pos === '354' ).toBe(true);
            };
            progress.labelStyle.textAlignment = 'Near';
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking the near label placement in RTL', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_linearLabel');
                pos = path.getAttribute('x');
                expect(pos === '200' ).toBe(true);
            };
            progress.labelStyle.textAlignment = 'Center';
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking the undefined minimum or maximum value', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_linearLabel');
                pos = path.getAttribute('x');
                expect(pos === '41' || pos === '10' || pos === '200').toBe(true);
            };
            progress.enableRtl = false;
            progress.minimum = 10;
            progress.maximum = 70;
            progress.value = 80;
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking the label placed when theme style thickness', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_linearLabel');
                pos = path.getAttribute('x');
                expect(pos === '136.66666666666666' ).toBe(true);
            };
            progress.trackThickness = null;
            progress.progressThickness = null;
            progress.value = 50;
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking the Default labelOnTrack placement', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_linearLabel');
                pos = path.getAttribute('x');
                expect(pos === '195').toBe(true);
            };            
            progress.labelOnTrack = false;
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking the Near labelOnTrack placement', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_linearLabel');
                pos = path.getAttribute('x');
                expect(pos === '46').toBe(true);
            };
            progress.labelStyle.textAlignment = 'Near';
            progress.labelOnTrack = false;
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking the Center labelOnTrack placement', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_linearLabel');
                pos = path.getAttribute('x');
                expect(pos === '195').toBe(true);
            };
            progress.labelStyle.textAlignment = 'Center';
            progress.labelOnTrack = false;
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking the Far labelOnTrack placement', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_linearLabel');
                pos = path.getAttribute('x');
                expect(pos === '354').toBe(true);
            };
            progress.labelStyle.textAlignment = 'Far';
            progress.labelOnTrack = false;
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking the Default labelOnTrack placement in RTL', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_linearLabel');
                pos = path.getAttribute('x');
                expect(pos === '46').toBe(true);
            };
            progress.enableRtl = true;
            progress.labelOnTrack = false;            
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking the Near labelOnTrack placement in RTL', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_linearLabel');
                pos = path.getAttribute('x');
                expect(pos === '354').toBe(true);
            };
            progress.labelOnTrack = false;
            progress.enableRtl = true;
            progress.labelStyle.textAlignment = 'Near';
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking the Center labelOnTrack placement in RTL', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_linearLabel');
                pos = path.getAttribute('x');
                expect(pos === '195').toBe(true);
            };
            progress.labelOnTrack = false;
            progress.enableRtl = true;
            progress.labelStyle.textAlignment = 'Center';
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking the Far labelOnTrack placement in RTL', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_linearLabel');
                pos = path.getAttribute('x');
                expect(pos === '46').toBe(true);
            };
            progress.enableRtl = true;
            progress.labelOnTrack = false;
            progress.labelStyle.textAlignment = 'Far';
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking the textRender event cancel', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_linearLabel');
                expect(path === null ).toBe(true);
            };
            progress.textRender = (args: ITextRenderEventArgs): void =>{
                args.cancel = true;
            };
            progress.loaded = loaded;
            progress.refresh();
        });
    });
    describe('ProgressBar Circular Label', () => {
        let progress: ProgressBar;
        let element: HTMLElement;
        let path: Element;
        let pos: string;
        let loaded: EmitType<ILoadedEventArgs>;
        beforeAll((): void => {
            element = createElement('div', { id: 'container' });
            document.body.appendChild(element);
            progress = new ProgressBar(
                {
                    type: 'Circular',
                    width: '300',
                    height: '300',
                    value: 100,
                    trackThickness: 10,
                    progressThickness: 10,
                }
            );
            progress.appendTo('#container');
        });
        afterAll((): void => {
            progress.destroy();
            element.remove();
        });
        it('checking the circular label', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_circularLabel');
                pos = path.getAttribute('x');
                expect(pos === '150' ).toBe(true);
            };
            progress.showProgressValue = true;
            progress.loaded = loaded;
            progress.refresh();
        }); 
        it('checking the circular label with animation', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_circularLabel');
                pos = path.getAttribute('x');
                expect(pos === '150' ).toBe(true);
            };
            progress.animation.enable = true;
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking the undefined minimum or maximum value', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_circularLabel');
                pos = path.innerHTML;
                expect(pos === '150%' ).toBe(true);
            };
            progress.minimum = 10;
            progress.maximum = 70;
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking the custom label with animation', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_circularLabel');
                pos = path.innerHTML;
                expect(pos === 'complete' ).toBe(true);
            };
            progress.value = 70;
            progress.labelStyle.text = 'complete';
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking the textRender event', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_circularLabel');
                expect(path === null ).toBe(true);
            };
            progress.textRender = (args:ITextRenderEventArgs): void => {
                args.cancel = true;
            }
            progress.loaded = loaded;
            progress.refresh();
        });
    });
});