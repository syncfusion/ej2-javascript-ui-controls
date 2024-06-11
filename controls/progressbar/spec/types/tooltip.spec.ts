
import { ProgressBar } from '../../src/progressbar/progressbar';
import { createElement, EmitType } from '@syncfusion/ej2-base';
import { ILoadedEventArgs} from '../../src/progressbar/model/progress-interface';
import { MouseEvents } from '../base/events.spec';

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
    });
});
