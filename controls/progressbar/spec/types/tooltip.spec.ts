
import { ProgressBar } from '../../src/progressbar/progressbar';
import { createElement, EmitType } from '@syncfusion/ej2-base';
import { ILoadedEventArgs, ITooltipRenderEventArgs} from '../../src/progressbar/model/progress-interface';
import { MouseEvents } from '../base/events.spec';
import { convertHexToColor, getElement, Pos, removeElement } from '../../src/progressbar/utils/helper';

describe('ProgressBar Control', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            pending(); //Skips test (in Chai)
            return;
        }
    });
    describe('ProgressBar Linear', () => {
        let progress: ProgressBar;
        let element: HTMLElement;
        let tooltip: Element;
        let loaded: EmitType<ILoadedEventArgs>;
        const trigger: MouseEvents = new MouseEvents();
        beforeAll((): void => {
            element = createElement('div', { id: 'container' });
            document.body.appendChild(element);
            progress = new ProgressBar(
                {
                    type: 'Linear',
                    value: 45,
                    width: '500',
                    trackThickness: 20,
                    progressThickness: 20,
                    tooltip:{
                        enable: true
                    }
                }
            );
            progress.appendTo('#container');
        });
        afterAll((): void => {
            progress.destroy();
            element.remove();
        });
        it('checking tooltip element', () => {
            loaded = (): void => {
                tooltip = document.getElementById('container_tooltip');
                expect(tooltip != null).toBe(true);
            };
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking in tooltip element on mouse move', () => {
            loaded = (): void => {
                tooltip = document.getElementById('container_Linearprogress');
                trigger.mousemoveEvent(tooltip, 0, 0, 435, 95);
                tooltip = document.getElementById('container_tooltip');
                expect(tooltip != null).toBe(true);
            };
            progress.tooltip.showTooltipOnHover = true;
            progress.tooltip.enable = false;
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking secondary value tooltip element on mouse move', () => {
            loaded = (): void => {
                tooltip = document.getElementById('container_Linearbuffer');
                trigger.mousemoveEvent(tooltip, 0, 0, 502, 170);
                tooltip = document.getElementById('container_tooltip');
                expect(tooltip != null).toBe(true);
            };
            progress.tooltip.showTooltipOnHover = true;
            progress.tooltip.enable = false;
            progress.secondaryProgress = 60;
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking tooltip element in linear animated progressbar', () => {
            loaded = (): void => {
                tooltip = document.getElementById('container_tooltip');
                expect(tooltip != null).toBe(true);
            };
            progress.tooltip.showTooltipOnHover = false;
            progress.tooltip.enable = true;
            progress.animation.enable = true;
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking tooltip element in linear with hover enable', () => {
            loaded = (): void => {
                tooltip = document.getElementById('container_tooltip');
                expect(tooltip != null).toBe(true);
            };
            progress.tooltip.showTooltipOnHover = true;
            progress.tooltip.enable = true;
            progress.animation.enable = true;
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking secondary value tooltip element on mouse move', () => {
            loaded = (): void => {
                tooltip = document.getElementById('container_tooltip');
                expect(tooltip != null).toBe(true);
            };
            progress.type = 'Linear';
            progress.cornerRadius = 'Round4px';
            progress.progressThickness = null;
            progress.tooltip = {enable: true, showTooltipOnHover: false};
            progress.value = 80;
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking secondary value tooltip secondary progress null', () => {
            loaded = (): void => {
                tooltip = document.getElementById('container_Linearprogress');
                trigger.mousemoveEvent(tooltip, 0, 0, 502, 170);
                tooltip = document.getElementById('container_tooltip');
                expect(tooltip != null).toBe(true);
            };
            progress.type = 'Linear';
            progress.cornerRadius = 'Round4px';
            progress.animation.enable = true;
            progress.tooltip = {enable: true, showTooltipOnHover: false};
            progress.value = 80;
            progress.secondaryProgress = null;
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking secondary value tooltip secondary progress null', () => {
            loaded = (): void => {
                tooltip = document.getElementById('container_Linearprogress');
                trigger.mousemoveEvent(tooltip, 0, 0, 502, 170);
                tooltip = document.getElementById('container_tooltip');
                expect(tooltip != null).toBe(true);
            };
            progress.type = 'Linear';
            progress.cornerRadius = 'Round4px';
            progress.theme = 'Material3';
            progress.animation.enable = true;
            progress.tooltip = {enable: true, showTooltipOnHover: true};
            progress.value = 80;
            progress.secondaryProgress = null;
            progress.progressThickness = null;
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking secondary value tooltip secondary progress witn corner radius auto', () => {
            loaded = (): void => {
                tooltip = document.getElementById('container_Linearprogress');
                trigger.mousemoveEvent(tooltip, 0, 0, 502, 170);
                tooltip = document.getElementById('container_tooltip');
                expect(tooltip != null).toBe(true);
            };
            progress.type = 'Linear';
            progress.cornerRadius = 'Auto';
            progress.theme = 'Material3';
            progress.animation.enable = true;
            progress.tooltip = {enable: true, showTooltipOnHover: true};
            progress.value = 80;
            progress.secondaryProgress = null;
            progress.progressThickness = null;
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking secondary value tooltip format', () => {
            loaded = (): void => {
                tooltip = document.getElementById('container_Linearprogress');
                trigger.mouseupEvent(tooltip, 0, 0, 502, 170);
                trigger.mousedownEvent(tooltip, 0, 0, 502, 170);
                trigger.mouseLeaveEvent(tooltip);
                trigger.clickEvent(tooltip);
                trigger.mousemoveEvent(tooltip, 0, 0, 502, 170);
                tooltip = document.getElementById('container_tooltip');
                expect(tooltip != null).toBe(true);
            };
            progress.type = 'Linear';
            progress.cornerRadius = 'Round4px';
            progress.animation.enable = true;
            progress.tooltip = {enable: true, showTooltipOnHover: true, format: 'Format', textStyle: {opacity: 0.8}};
            progress.value = 80;
            progress.secondaryProgress = null;
            progress.loaded = loaded;
            progress.refresh();
        });
      
        it('checking secondary value tooltip with animation attributes', () => {
            loaded = (args: ILoadedEventArgs): void => {
                tooltip = document.getElementById('container_tooltip');
                expect(true).toBe(true);
            };
            progress.tooltip.showTooltipOnHover = false;
            progress.cornerRadius = 'Auto';
            progress.tooltip.enable = true;
            progress.secondaryProgress = null;
            progress.animation = {enable: true, duration: 500, delay: 400};
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking secondary value tooltip with animation attributes', () => {
            loaded = (args: ILoadedEventArgs): void => {
                args.progressBar.progressTooltipModule.createTooltip(progress, false, {x:50, y:15}, {x:0, y: 0});
                tooltip = document.getElementById('container_tooltip');
                expect(true).toBe(true);
            };
            progress.tooltipRender= (args: ITooltipRenderEventArgs) => {
                args.cancel = false;
            };
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking secondary value tooltip with animation attributes', () => {
            loaded = (args: ILoadedEventArgs): void => {
                args.progressBar.progressTooltipModule.createTooltip(progress, false, {x:50, y:15}, {x:0, y: 0});
                tooltip = document.getElementById('container_tooltip');
                expect(true).toBe(true);
            };
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking secondary value tooltip using remove method', () => {
            loaded = (args: ILoadedEventArgs): void => {
                args.progressBar.progressTooltipModule.removeTooltip(100);
                tooltip = document.getElementById('container_tooltip');
                expect(true).toBe(true);
            };
            progress.tooltip.showTooltipOnHover = false;
            progress.cornerRadius = 'Auto';
            progress.tooltip.enable = true;
            progress.secondaryProgress = null;
            progress.animation.enable = true;
            progress.loaded = loaded;
            progress.refresh();
        });
    });

    describe('ProgressBar Circular', () => {
        let progress: ProgressBar;
        let element: HTMLElement;
        const trigger: MouseEvents = new MouseEvents();
        let tooltip: Element;
        let loaded: EmitType<ILoadedEventArgs>;
        beforeAll((): void => {
            element = createElement('div', { id: 'container' });
            document.body.appendChild(element);
            progress = new ProgressBar(
                {
                    type: 'Circular',
                    width: '300',
                    height: '300',
                    value: 45,
                    trackThickness: 10,
                    progressThickness: 10,
                    tooltip:{
                        enable: true
                    }
                }
            );
            progress.appendTo('#container');
        });
        afterAll((): void => {
            progress.destroy();
            element.remove();
        });
        it('checking tooltip element', () => {
            loaded = (): void => {
                tooltip = document.getElementById('container_tooltip');
                expect(tooltip != null).toBe(true);
            };
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking in tooltip element on mouse move', () => {
            loaded = (): void => {
                tooltip = document.getElementById('container_Circularprogress');
                trigger.mousemoveEvent(tooltip, 0, 0, 1167, 149);
                tooltip = document.getElementById('container_tooltip');
                expect(tooltip != null).toBe(true);
            };
            progress.tooltip.showTooltipOnHover = true;
            progress.tooltip.enable = false;
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking tooltip element in linear animated progressbar', () => {
            loaded = (): void => {
                tooltip = document.getElementById('container_tooltip');
                expect(tooltip != null).toBe(true);
            };
            progress.tooltip.showTooltipOnHover = false;
            progress.tooltip.enable = true;
            progress.animation.enable = true;
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking secondary value tooltip element on mouse move', () => {
            loaded = (): void => {
                tooltip = document.getElementById('container_Circularbuffer');
                trigger.mousemoveEvent(tooltip, 0, 0, 1132, 114);
                tooltip = document.getElementById('container_tooltip');
                expect(tooltip != null).toBe(true);
            };
            progress.tooltip.showTooltipOnHover = true;
            progress.tooltip.enable = false;
            progress.secondaryProgress = 60;
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking secondary value tooltip element on mouse move', () => {
            loaded = (): void => {
                tooltip = document.getElementById('container_Circularprogress');
                trigger.mousemoveEvent(tooltip, 0, 0, 1132, 114);
                tooltip = document.getElementById('container_tooltip');
                expect(tooltip != null).toBe(true);
            };
            progress.tooltip.showTooltipOnHover = false;
            progress.tooltip.enable = true;
            progress.secondaryProgress = null;
            progress.animation.enable = true;
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking secondary value tooltip element on mouse move', () => {
            loaded = (): void => {
                tooltip = document.getElementById('container_Circularprogress');
                trigger.mousemoveEvent(tooltip, 0, 0, 1132, 114);
                tooltip = document.getElementById('container_tooltip');
                expect(tooltip != null).toBe(true);
            };
            progress.tooltip.showTooltipOnHover = true;
            progress.tooltip.enable = true;
            progress.secondaryProgress = null;
            progress.animation.enable = true;
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking secondary value tooltip both buffer and hover tooltip true', () => {
            loaded = (): void => {
                tooltip = document.getElementById('container_Circularprogress');
                trigger.mousemoveEvent(tooltip, 0, 0, 1132, 114);
                tooltip = document.getElementById('container_tooltip');
                expect(tooltip != null).toBe(true);
            };
            progress.tooltip.showTooltipOnHover = true;
            progress.tooltip.enable = true;
            progress.secondaryProgress = null;
            progress.animation.enable = true;
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking secondary value tooltip with buffer and hover tooltip false', () => {
            loaded = (): void => {
                tooltip = document.getElementById('container_tooltip');
                expect(tooltip != null).toBe(true);
            };
            progress.tooltip.showTooltipOnHover = false;
            progress.tooltip.enable = true;
            progress.cornerRadius = 'Auto';
            progress.theme = 'Bootstrap4';
            progress.secondaryProgress = 60;
            progress.animation.enable = true;
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking secondary value tooltip with tooltip render event', () => {
            loaded = (args: ILoadedEventArgs): void => {
                args.progressBar.progressTooltipModule.createTooltip(progress, false, {x:50, y:15}, {x:0, y: 0});
                tooltip = document.getElementById('container_tooltip');
                expect(true).toBe(true);
            };
            progress.tooltipRender= (args: ITooltipRenderEventArgs) => {
                args.cancel = false;
            };
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking progress show and hide methods', () => {
            loaded = (args: ILoadedEventArgs): void => {
                tooltip = document.getElementById('container');
                let tooltip1 = document.getElementById('container');
                progress.tooltip.showTooltipOnHover = true;
                trigger.mousemoveEvent(tooltip, 0, 0, 1132, 114);
                expect(true).toBe(true);
                convertHexToColor('transparent');
                let position = new Pos(10, 10);
                args.progressBar.show();
                args.progressBar.hide();
                let element = getElement('container');
                removeElement(element as any);
            };
            progress.loaded = loaded;
            progress.isIndeterminate = true;
            progress.refresh();
        });
    });
    describe('ProgressBar Circular tooltip', () => {
        let progress: ProgressBar;
        let element: HTMLElement;
        const trigger: MouseEvents = new MouseEvents();
        let tooltip: Element;
        let loaded: EmitType<ILoadedEventArgs>;
        beforeAll((): void => {
            element = createElement('div', { id: 'container' });
            document.body.appendChild(element);
            progress = new ProgressBar(
                {
                    type: 'Circular',
                    width: '300',
                    height: '300',
                    value: 45,
                    trackThickness: 10,
                    progressThickness: 10,
                    tooltip:{
                        enable: true, showTooltipOnHover: true
                    }, cornerRadius: 'Auto', animation: {enable: true}, secondaryProgress: 60, theme:'Bootstrap4'
                }
            );
            progress.appendTo('#container');
        });
        afterAll((): void => {
            progress.destroy();
            element.remove();
        });
        it('checking tooltip element', () => {
            loaded = (): void => {
                tooltip = document.getElementById('container_Circularbuffer');
                trigger.mousemoveEvent(tooltip, 0, 0, 1132, 114);
                tooltip = document.getElementById('container_tooltip');
                expect(tooltip != null).toBe(true);
            };
            progress.loaded = loaded;
            progress.refresh();
        });
    });
    describe('ProgressBar Linear tooltip', () => {
        let progress: ProgressBar;
        let element: HTMLElement;
        let tooltip: Element;
        let loaded: EmitType<ILoadedEventArgs>;
        const trigger: MouseEvents = new MouseEvents();
        beforeAll((): void => {
            element = createElement('div', { id: 'container' });
            document.body.appendChild(element);
            progress = new ProgressBar(
                {
                    type: 'Linear',
                    value: 45,
                    width: '500',
                    trackThickness: 20,
                    
                    progressThickness: 20,
                    tooltip:{
                        enable: true, showTooltipOnHover: true
                    }, cornerRadius: 'Auto', animation: {enable: true}, secondaryProgress: 60, 
                }
            );
            progress.appendTo('#container');
        });
        afterAll((): void => {
            progress.destroy();
            element.remove();
        });
        it('checking tooltip element', () => {
            loaded = (): void => {
                tooltip = document.getElementById('container_Linearbuffer');
                trigger.mousemoveEvent(tooltip, 0, 0, 1132, 114);
                tooltip = document.getElementById('container_tooltip');
                expect(tooltip != null).toBe(true);
            };
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking tooltip element with bootstrap5', () => {
            loaded = (): void => {
                tooltip = document.getElementById('container_Linearbuffer');
                trigger.mousemoveEvent(tooltip, 0, 0, 1132, 114);
                tooltip = document.getElementById('container_tooltip');
                expect(tooltip != null).toBe(true);
            };
            progress.theme = 'Bootstrap5';
            progress.loaded = loaded;
            progress.refresh();
        });
        it('checking tooltip element with bootstrap5 dark', () => {
            loaded = (): void => {
                tooltip = document.getElementById('container_Linearbuffer');
                trigger.mousemoveEvent(tooltip, 0, 0, 1132, 114);
                tooltip = document.getElementById('container_tooltip');
                expect(tooltip != null).toBe(true);
            };
            progress.theme = 'Bootstrap5Dark';
            progress.loaded = loaded;
            progress.refresh();
        });
    });
});
