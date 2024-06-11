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
            pending(); //Skips test (in Chai)
            return;
        }
    });
    describe('ProgressBar Linear Active state', () => {
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
                }
            );
            progress.appendTo('#container');
        });
        afterAll((): void => {
            progress.destroy();
            element.remove();
        });
        it('checking the active state ', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_LinearActiveProgress');
                stroke = path.getAttribute('stroke');
                expect(stroke === '#ffffff' ).toBe(true);
            };
            progress.isActive = true;
            progress.loaded = loaded;
            progress.refresh();
        }); 
        it('checking the active state with databind ', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_LinearActiveProgress');
                stroke = path.getAttribute('stroke');
                expect(stroke === '#ffffff' ).toBe(true);
            };
            progress.value += 10;
            progress.dataBind();
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking the active state in segment ', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_LinearActiveProgress');
                stroke = path.getAttribute('stroke-dasharray');
                expect(stroke === ' 91.25 5' ).toBe(true);
            };
            progress.segmentCount = 4;
            progress.gapWidth = 5;
            progress.loaded = loaded;
            progress.refresh();
        }); 
        it('checking the active state in round corner ', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_LinearActiveProgress');
                stroke = path.getAttribute('stroke-linecap');
                expect(stroke === 'round' ).toBe(true);
            };
            progress.cornerRadius = 'Round';
            progress.loaded = loaded;
            progress.refresh();
        }); 
    }); 
    describe('ProgressBar Stripped Linear Progressbar', () => {
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
        it('checking the linear stripped ', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_Linearprogress');
                stroke = path.getAttribute('stroke');
                expect(stroke === 'url(#container_LinearStriped)').toBe(true);
            };
            progress.isStriped = true;
            progress.loaded = loaded;
            progress.refresh();
        }); 
        it('checking the linear stripped animation', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_Linearprogress');
                stroke = path.getAttribute('stroke');
                expect(stroke === 'url(#container_LinearStriped)').toBe(true);
            };
            progress.animation.enable = true;
            progress.loaded = loaded;
            progress.refresh();
        });
    });
    describe('Role of Linear Progressbar', () => {
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
                    width: '30',
                    height: '700',
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
        it('checking the role success', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_Linearprogress');
                stroke = path.getAttribute('stroke');
                expect(stroke === "#166600" ).toBe(true);
            };
            progress.value = 100;
            progress.role = 'Success';
            progress.loaded = loaded;
            progress.refresh();
        }); 
        it('checking the role danger', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_Linearprogress');
                stroke = path.getAttribute('stroke');
                expect(stroke === "#b30900" ).toBe(true);
            };
            progress.value = 10;
            progress.role = 'Danger';
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking the role warning', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_Linearprogress');
                stroke = path.getAttribute('stroke');
                expect(stroke === "#944000" ).toBe(true);
            };
            progress.value = 50;
            progress.role = 'Warning';
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking the role info', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_Linearprogress');
                stroke = path.getAttribute('stroke');
                expect(stroke === "#0056b3" ).toBe(true);
            };
            progress.value = 70;
            progress.role = 'Info';
            progress.loaded = loaded;
            progress.refresh();
        });
    });
    describe('ProgressBar Circular Active state', () => {
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
                    type: 'Circular',
                    width: '300',
                    height: '300',
                    value: 75,
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
        it('checking the active state ', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_CircularActiveProgress');
                stroke = path.getAttribute('stroke');
                expect(stroke === '#ffffff' ).toBe(true);
            };
            progress.isActive = true;
            progress.loaded = loaded;
            progress.refresh();
        }); 
        it('checking the active state ', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_CircularActiveProgress');
                stroke = path.getAttribute('stroke');
                expect(stroke === '#ffffff' ).toBe(true);
            };
            progress.value += 10;
            progress.dataBind();
            progress.loaded = loaded;
            progress.refresh();
        }); 
        it('checking the active state in segment ', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_CircularActiveProgress');
                stroke = path.getAttribute('stroke-dasharray');
                expect(stroke === ' 207.08139038085938 5' ).toBe(true);
            };
            progress.segmentCount = 4;
            progress.gapWidth = 5;
            progress.loaded = loaded;
            progress.refresh();
        }); 
        it('checking the active state in round corner ', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_CircularActiveProgress');
                stroke = path.getAttribute('stroke-linecap');
                expect(stroke === 'round' ).toBe(true);
            };
            progress.cornerRadius = 'Round';
            progress.loaded = loaded;
            progress.refresh();
        }); 
    }); 
    describe('Role of Circular Progressbar', () => {
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
                    type: 'Circular',
                    width: '300',
                    height: '300',
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
        it('checking the role success', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_Circularprogress');
                stroke = path.getAttribute('stroke');
                expect(stroke === "#166600" ).toBe(true);
            };
            progress.value = 100;
            progress.role = 'Success';
            progress.loaded = loaded;
            progress.refresh();
        }); 
        it('checking the role danger', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_Circularprogress');
                stroke = path.getAttribute('stroke');
                expect(stroke === "#b30900" ).toBe(true);
            };
            progress.value = 10;
            progress.role = 'Danger';
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking the role warning', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_Circularprogress');
                stroke = path.getAttribute('stroke');
                expect(stroke === "#944000" ).toBe(true);
            };
            progress.value = 50;
            progress.role = 'Warning';
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking the role info', () => {
            loaded = (args: Object): void => {
                path = document.getElementById('container_Circularprogress');
                stroke = path.getAttribute('stroke');
                expect(stroke === "#0056b3" ).toBe(true);
            };
            progress.value = 70;
            progress.role = 'Info';
            progress.loaded = loaded;
            progress.refresh();
        });
    });
}); 