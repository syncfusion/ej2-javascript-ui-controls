/* eslint-disable @typescript-eslint/no-explicit-any */
import { createElement, EventHandler, removeClass, addClass } from '@syncfusion/ej2-base';
import { Carousel, CarouselItemModel, SlideChangingEventArgs, CarouselSwipeMode } from '../src/carousel/index';
import { profile, inMB, getMemoryProfile } from './common.spec';

/**
 *  Carousel spec document
 */

interface CommonArgs {
    changedTouches?: any[];
    clientX?: number;
    clientY?: number;
    target?: Element | HTMLElement;
    type?: string;
    preventDefault(): void;
    stopPropagation(): void;
}

let touchTestObj: any;
let node: Element;

const startMouseEventArs: CommonArgs = {
    clientX: 200, clientY: 200, target: node, type: 'touchstart',
    preventDefault: (): void => { /** Do Nothing */ },
    stopPropagation: (): void => { /** Do Nothing */ }
};
const moveMouseEventArs: CommonArgs = {
    clientX: 500, clientY: 200, target: node, type: 'touchmove',
    preventDefault: (): void => { /** Do Nothing */ },
    stopPropagation: (): void => { /** Do Nothing */ }
};
const endMouseEventArs: CommonArgs = {
    clientX: 200, clientY: 200, target: node, type: 'touchend',
    preventDefault: (): void => { /** Do Nothing */ },
    stopPropagation: (): void => { /** Do Nothing */ }
};

const triggerSwipeEvent: Function = (target: Element, x?: number, y?: number): void => {
    node = target;
    startMouseEventArs.target = node;
    moveMouseEventArs.target = node;
    endMouseEventArs.target = node;
    (node as any).ej2_instances.forEach((instance: any) => {
        if (instance.getModuleName() === 'touch') {
            touchTestObj = (instance as any);
        }
    });
    const movedEnd: CommonArgs = moveMouseEventArs;
    movedEnd.type = 'touchend';
    if (x) { movedEnd.clientX = x; }
    if (y) { movedEnd.clientY = y; }
    touchTestObj.startEvent(startMouseEventArs);
    touchTestObj.moveEvent(moveMouseEventArs);
    touchTestObj.endEvent(movedEnd);
    EventHandler.trigger(<HTMLElement>node, 'transitionend');
};

// eslint-disable-next-line max-len
const triggerMouseEvent: Function = (node: HTMLElement, eventType: string, x: number = 0, y: number = 0, isShiftKey?: boolean, isCtrlKey?: boolean): void => {
    const mouseEve: MouseEvent = new MouseEvent(eventType);
    mouseEve.initMouseEvent(eventType, true, true, window, 0, 0, 0, x, y, isCtrlKey, false, isShiftKey, false, 0, null);
    node.dispatchEvent(mouseEve);
};

describe('Carousel Testing', () => {
    beforeAll(() => {
        const isDef: (o: any) => boolean = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            // eslint-disable-next-line no-console
            console.log('Unsupported environment, window.performance.memory is unavailable');
            (this as any).skip(); // Skips test (in Chai)
            return;
        }
    });

    let carousel: Carousel;
    const items: CarouselItemModel[] = [
        { template: 'base/demos/carousel/images/bird.jpg' },
        { template: 'base/demos/carousel/images/nature.jpg' },
        { template: 'base/demos/carousel/images/night-view.jpg' },
        { template: 'base/demos/carousel/images/sae-view.jpg' },
        { template: 'base/demos/carousel/images/snowfall.jpg' }
    ];
    const carouselItems: CarouselItemModel[] = [
        { template: 'base/demos/carousel/images/bird.jpg', cssClass: 'item-test', interval: 3000 },
        { template: 'base/demos/carousel/images/nature.jpg', htmlAttributes: { 'data-custom': 'test' } },
        { template: 'base/demos/carousel/images/night-view.jpg' },
        { template: 'base/demos/carousel/images/sae-view.jpg' },
        { template: 'base/demos/carousel/images/snowfall.jpg' }
    ];
    const carouselData: Record<string, string | number>[] = [
        {
            ID: 1,
            Title: 'Birds',
            Content: 'Birds are a group of warm-blooded vertebrates constituting the class Aves, characterized by feathers, toothless beaked jaws, the laying of hard-shelled eggs, a high metabolic rate, a four-chambered heart, and a strong yet lightweight skeleton. Birds live worldwide and range in size from the 5.5 cm (2.2 in) bee hummingbird to the 2.8 m (9 ft 2 in) ostrich. There are about ten thousand living species, more than half of which are passerine, or "perching" birds.',
            ImgPath: 'images/bird.jpg'
        }, {
            ID: 2,
            Title: 'Nature',
            Content: 'Nature, in the broadest sense, is the natural, physical, material world or universe. "Nature" can refer to the phenomena of the physical world, and also to life in general. The study of nature is a large, if not the only, part of science. Although humans are part of nature, human activity is often understood as a separate category from other natural phenomena.',
            ImgPath: 'images/nature.jpg'
        }, {
            ID: 3,
            Title: 'Twin Towers',
            Content: 'The Twin Towers Correctional Facility, also referred to in the media as Twin Towers Jail, is a complex in Los Angeles, California.[1] The facility is located at 450 Bauchet Street, in Los Angeles, California and is operated by the Los Angeles County Sheriffs Department. The facility consists of two towers, a medical services building, and the Los Angeles County Medical Center Jail Ward.',
            ImgPath: 'images/night-view.jpg'
        }, {
            ID: 4,
            Title: 'Sea View',
            Content: 'The sea, connected as the world ocean or simply the ocean, is the body of salty water that covers approximately 71 percent of the Earth surface. The word sea is also used to denote second-order sections of the sea, such as the Mediterranean Sea, as well as certain large, entirely landlocked, saltwater lakes, such as the Caspian Sea.',
            ImgPath: 'images/sea-view.jpg'
        }
    ];
    const carouselDataSource: Record<string, string | number>[] = [
        {
            ID: 1,
            Title: 'Birds',
            Content: 'Birds are a group of warm-blooded vertebrates constituting the class Aves, characterized by feathers, toothless beaked jaws, the laying of hard-shelled eggs, a high metabolic rate, a four-chambered heart, and a strong yet lightweight skeleton. Birds live worldwide and range in size from the 5.5 cm (2.2 in) bee hummingbird to the 2.8 m (9 ft 2 in) ostrich. There are about ten thousand living species, more than half of which are passerine, or "perching" birds.',
            ImgPath: 'images/bird.jpg'
        }, {
            ID: 2,
            Title: 'Nature',
            Content: 'Nature, in the broadest sense, is the natural, physical, material world or universe. "Nature" can refer to the phenomena of the physical world, and also to life in general. The study of nature is a large, if not the only, part of science. Although humans are part of nature, human activity is often understood as a separate category from other natural phenomena.',
            ImgPath: 'images/nature.jpg'
        }, {
            ID: 3,
            Title: 'Twin Towers',
            Content: 'The Twin Towers Correctional Facility, also referred to in the media as Twin Towers Jail, is a complex in Los Angeles, California.[1] The facility is located at 450 Bauchet Street, in Los Angeles, California and is operated by the Los Angeles County Sheriffs Department. The facility consists of two towers, a medical services building, and the Los Angeles County Medical Center Jail Ward.',
            ImgPath: 'images/night-view.jpg'
        }, {
            ID: 4,
            Title: 'Sea View',
            Content: 'The sea, connected as the world ocean or simply the ocean, is the body of salty water that covers approximately 71 percent of the Earth surface. The word sea is also used to denote second-order sections of the sea, such as the Mediterranean Sea, as well as certain large, entirely landlocked, saltwater lakes, such as the Caspian Sea.',
            ImgPath: 'images/sea-view.jpg'
        }, {
            ID: 5,
            Title: 'Snowfall',
            Content: 'Snow comprises individual ice crystals that grow while suspended in the atmosphere—usually within clouds—and then fall, accumulating on the ground where they undergo further changes.[2] It consists of frozen crystalline water throughout its life cycle, starting when, under suitable conditions, the ice crystals form in the atmosphere, increase to millimeter size, precipitate and accumulate on surfaces, then metamorphose in place, and ultimately melt, slide or sublimate away.',
            ImgPath: 'images/snowfall.jpg'
        }
    ];
    const itemTemplate: HTMLElement = createElement('script', { id: 'itemTemplate', attrs: { type: 'text/x-template' } });
    itemTemplate.innerHTML = '<div class="title">${Title}</div>';
    const indicatorTemp: HTMLElement = createElement('script', { id: 'indicatorTemplate', attrs: { type: 'text/x-template' } });
    indicatorTemp.innerHTML = '<div class="indicator"></div>';
    const arrowTemp: HTMLElement = createElement('script', { id: 'arrowTemplate', attrs: { type: 'text/x-template' } });
    arrowTemp.innerHTML = '<button class="arrowTemp btn h-100 w-100">${if (type === "Previous")}<i class="bi bi-caret-left"></i>${else}<i class="bi bi-caret-right"></i>${/if}</button>';
    const playButtonTemp: HTMLElement = createElement('script', { id: 'playButtonTemplate', attrs: { type: 'text/x-template' } });
    playButtonTemp.innerHTML = '<button class="playTemp btn h-100 w-100"> <i class="bi bi-pause pause"></i></button>';

    describe('DOM', () => {
        beforeEach((): void => {
            const carouselElement: HTMLElement = document.createElement('div');
            carouselElement.id = 'carousel';
            document.body.appendChild(carouselElement);
        });
        afterEach(() => {
            carousel.destroy();
            carousel.element.remove();
            carousel = null;
        });
        it('checking component render', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ items: items }, carouselElement);
            expect(document.getElementById('carousel').classList.contains('e-carousel')).toBe(true);
        });
    });

    describe('Carousel Properties', () => {
        beforeEach((): void => {
            const carouselElement: HTMLElement = document.createElement('div');
            carouselElement.id = 'carousel';
            document.body.appendChild(carouselElement);
            jasmine.clock().install();
        });
        afterEach(() => {
            carousel.destroy();
            carousel.element.remove();
            carousel = null;
            jasmine.clock().uninstall();
        });
        it('test case for cssClass', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ items: items, cssClass: 'carousel-custom' }, carouselElement);
            expect(carouselElement.classList.contains('carousel-custom')).toEqual(true);
        });
        it('test case for htmlAttributes', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ items: items, htmlAttributes: { 'data-custom': 'test' } }, carouselElement);
            expect(carouselElement.getAttribute('data-custom')).toEqual('test');
        });
        it('test case for passing class in htmlAttributes', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ items: items, htmlAttributes: { 'class': 'test' } }, carouselElement);
            expect(carouselElement.classList).toContain('test');
            expect(carouselElement.classList).toContain('e-carousel');
        });
        it('test cases for showIndicators as true', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ items: items, showIndicators: true }, carouselElement);
            expect(carouselElement.querySelector('.e-carousel-indicators') !== null).toBe(true);
            expect(carouselElement.querySelectorAll('.e-indicator-bar').length).toEqual(items.length);
            expect(carouselElement.querySelectorAll('.e-indicator-bar')[carousel.selectedIndex].classList.contains('e-active')).toBe(true);
        });
        it('test cases for showIndicators as false', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ items: items, showIndicators: false }, carouselElement);
            expect(carouselElement.querySelector('.e-carousel-indicators') !== null).toBe(false);
        });
        it('test cases for showArrows as Never', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ items: items, buttonsVisibility: 'Hidden' }, carouselElement);
            expect(carouselElement.querySelector('.e-carousel-navigators') !== null).toBe(false);
            jasmine.clock().tick(carousel.interval + 1500);
            expect(carouselElement.querySelector('.e-carousel-navigators') !== null).toBe(false);
        });
        it('test cases for showArrows as Visible', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ items: items, buttonsVisibility: 'Visible' }, carouselElement);
            expect(carouselElement.querySelector('.e-carousel-navigators') !== null).toBe(true);
            expect(carouselElement.querySelector('.e-hover-arrows') === null).toBe(true);
        });
        it('test cases for showArrows as OnHover', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ items: items, buttonsVisibility: 'VisibleOnHover' }, carouselElement);
            expect(carouselElement.querySelector('.e-carousel-navigators') !== null).toBe(true);
            expect(carouselElement.querySelector('.e-hover-arrows') === null).toBe(false);
        });
        it('test cases for selectedIndex', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ items: items, selectedIndex: 2 }, carouselElement);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[carousel.selectedIndex + 1].classList.contains('e-active')).toBe(true);
            expect(carouselElement.querySelectorAll('.e-indicator-bar')[carousel.selectedIndex].classList.contains('e-active')).toBe(true);
        });
        it('test cases for showPlayButton as true', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ items: items, showPlayButton: true }, carouselElement);
            expect(carouselElement.querySelector('.e-play-pause') !== null).toBe(true);
            expect(carouselElement.querySelector('.e-pause-icon') !== null).toBe(true);
            (carouselElement.querySelector('.e-pause-icon') as HTMLElement).click();
            expect(carouselElement.querySelector('.e-play-icon') !== null).toBe(true);
        });
        it('test cases for showPlayButton as true when prev/next arrows hidden', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ items: items, buttonsVisibility: 'Hidden', showPlayButton: true }, carouselElement);
            expect(carouselElement.querySelector('.e-play-pause') === null).toBe(true);
            expect(carouselElement.querySelector('.e-carousel-navigators') === null).toBe(true);
        });
        it('test cases for showPlayButton as false', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ items: items, showPlayButton: false }, carouselElement);
            expect(carouselElement.querySelector('.e-play-pause') !== null).toBe(false);
            expect(carouselElement.querySelector('.e-pause-icon') !== null).toBe(false);
        });
        it('test cases for autoPlay as true', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ animationEffect: 'None', items: items, autoPlay: true }, carouselElement);
            const index: number = carousel.selectedIndex;
            expect(carousel.selectedIndex).toEqual(0);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[index + 1].classList.contains('e-active')).toBe(true);
            jasmine.clock().tick(carousel.interval + 1500);
            expect(carousel.selectedIndex).toEqual(1);
        });
        it('test cases for autoPlay as false', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ animationEffect: 'None', items: items, autoPlay: false }, carouselElement);
            const index: number = carousel.selectedIndex;
            expect(carouselElement.querySelectorAll('.e-carousel-item')[index + 1].classList.contains('e-active')).toBe(true);
            jasmine.clock().tick(carousel.interval + 1500);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[index + 1].classList.contains('e-active')).toBe(true);
            (carouselElement.querySelector('.e-previous-icon') as HTMLElement).click();
            jasmine.clock().tick(carousel.interval + 1500);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[1].classList.contains('e-active')).toBe(false);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[5].classList.contains('e-active')).toBe(true);
            expect(carousel.selectedIndex).toEqual(4);
        });
        it('test cases for autoPlay and infinite as false', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ animationEffect: 'None', items: items, autoPlay: false, loop: false, selectedIndex: 3 }, carouselElement);
            expect(carousel.selectedIndex).toEqual(3);
            carousel.next();
            expect(carousel.selectedIndex).toEqual(4);
        });
        it('test cases for interval', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ animationEffect: 'None', items: items, interval: 2000 }, carouselElement);
            const index: number = carousel.selectedIndex;
            expect(carouselElement.querySelectorAll('.e-carousel-item')[index + 1].classList.contains('e-active')).toBe(true);
            jasmine.clock().tick(carousel.interval + 1500);
            expect(carousel.selectedIndex).toBe(1);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[index + 1].classList.contains('e-active')).toBe(false);
        });
        it('test cases for infinite as true', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ animationEffect: 'None', items: items, selectedIndex: 4, loop: true }, carouselElement);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[5].classList.contains('e-active')).toBe(true);
            jasmine.clock().tick(carousel.interval + 1500);
            expect(carousel.selectedIndex).toBe(0);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[5].classList.contains('e-active')).toBe(false);
        });
        it('test cases for infinite as false', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ animationEffect: 'None', items: items, loop: false }, carouselElement);
            jasmine.clock().tick(carousel.interval + 1500);
            carousel.selectedIndex = 4;
            carousel.dataBind();
            expect(carousel.selectedIndex).toBe(4);
        });
        it('test case for height', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ items: items, height: '300px' }, carouselElement);
            expect(carouselElement.style.height).toEqual('300px');
        });
        it('test cases for width', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ items: items, width: '500px' }, carouselElement);
            expect(carouselElement.style.width).toEqual('500px');
        });
        it('test case for default height', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ items: items }, carouselElement);
            expect(carouselElement.style.height).toEqual('100%');
        });
        it('test cases for default width', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ items: items }, carouselElement);
            expect(carouselElement.style.width).toEqual('100%');
        });
        it('test cases for rtl mode enabled', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ items: items, enableRtl: true }, carouselElement);
            expect(carousel.element.classList.contains('e-rtl')).toBe(true);
        });
        it('test cases for rtl mode disabled', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ items: items, enableRtl: false }, carouselElement);
            expect(carousel.element.classList.contains('e-rtl')).toBe(false);
        });
        it('enableTouchSwipe - swiping left', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ animationEffect: 'None', items: items }, carouselElement);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[1].classList.contains('e-active')).toBe(true);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[2].classList.contains('e-active')).toBe(false);
            expect(carousel.selectedIndex).toEqual(0);
            triggerSwipeEvent(carouselElement, 300, 400);
            jasmine.clock().tick(1500);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[1].classList.contains('e-active')).toBe(false);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[2].classList.contains('e-active')).toBe(true);
            expect(carousel.selectedIndex).toEqual(1);
            carousel.selectedIndex = 4;
            carousel.dataBind();
            triggerSwipeEvent(carouselElement, 300, 400);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[1].classList.contains('e-active')).toBe(true);
            expect(carousel.selectedIndex).toEqual(0);
        });
        it('enableTouchSwipe - swiping right', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ animationEffect: 'None', items: items }, carouselElement);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[1].classList.contains('e-active')).toBe(true);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[2].classList.contains('e-active')).toBe(false);
            expect(carousel.selectedIndex).toEqual(0);
            triggerSwipeEvent(carouselElement, 400, 200);
            jasmine.clock().tick(1500);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[1].classList.contains('e-active')).toBe(false);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[5].classList.contains('e-active')).toBe(true);
            expect(carousel.selectedIndex).toEqual(4);
            triggerSwipeEvent(carouselElement, 400, 200);
            jasmine.clock().tick(1500);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[4].classList.contains('e-active')).toBe(true);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[5].classList.contains('e-active')).toBe(false);
            expect(carousel.selectedIndex).toEqual(3);
            addClass([carouselElement], 'e-carousel-hover');
            expect(carousel.selectedIndex).toEqual(3);
            triggerSwipeEvent(carouselElement, 400, 200);
            expect(carousel.selectedIndex).toEqual(3);
        });
    });
    describe('test cases for enablePersistence', () => {
        beforeEach((): void => {
            const carouselElement: HTMLElement = document.createElement('div');
            carouselElement.id = 'carousel';
            document.body.appendChild(carouselElement);
        });
        afterEach(() => {
            carousel.destroy();
            carousel.element.remove();
            carousel = null;
        });
        it('test case for enablePersistence with true', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ items: items });
            carousel.appendTo(carouselElement);
            carousel.enablePersistence = true;
            carousel.selectedIndex = 3;
            carousel.dataBind();
            carousel.destroy();
            carousel = new Carousel({ items: items, enablePersistence: true });
            carousel.appendTo(carouselElement);
            expect(carousel.selectedIndex).toBe(3);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[4].classList.contains('e-active')).toBe(true);
        });
        it('test case for enablePersistence with false', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ items: items, selectedIndex: 3 }, carouselElement);
            carousel.destroy();
            carousel = new Carousel({ items: items });
            carousel.appendTo(carouselElement);
            expect(carousel.selectedIndex).toBe(0);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[1].classList.contains('e-active')).toBe(true);
        });
    });

    describe('Carousel public properties null or undefined testing', () => {
        beforeEach((): void => {
            const carouselElement: HTMLElement = document.createElement('div');
            carouselElement.id = 'carousel';
            document.body.appendChild(carouselElement);
        });
        afterEach(() => {
            carousel.destroy();
            carousel.element.remove();
            carousel = null;
        });
        it('animationEffect', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({items: items}, carouselElement);
            carousel.animationEffect = null;
            carousel.dataBind();
            expect(carousel.animationEffect).toEqual(null);
            carousel.animationEffect = undefined;
            carousel.dataBind();
            expect(carousel.animationEffect).toEqual(undefined);
        });
        it('autoPlay', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({items: items}, carouselElement);
            carousel.autoPlay = null;
            carousel.dataBind();
            expect(carousel.autoPlay).toEqual(null);
            carousel.autoPlay = undefined;
            carousel.dataBind();
            expect(carousel.autoPlay).toEqual(undefined);
        });
        it('buttonsVisibility', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({items: items}, carouselElement);
            carousel.buttonsVisibility = null;
            carousel.dataBind();
            expect(carousel.buttonsVisibility).toEqual(null);
            carousel.buttonsVisibility = undefined;
            carousel.dataBind();
            expect(carousel.buttonsVisibility).toEqual(undefined);
        });
        it('cssClass', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({items: items}, carouselElement);
            carousel.cssClass = null;
            carousel.dataBind();
            expect(carousel.cssClass).toEqual(null);
            carousel.cssClass = undefined;
            carousel.dataBind();
            expect(carousel.cssClass).toEqual(undefined);
        });
        it('dataSource', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({items: items}, carouselElement);
            carousel.dataSource = null;
            carousel.dataBind();
            expect(carousel.dataSource).toEqual(null);
            carousel.dataSource = undefined;
            carousel.dataBind();
            expect(carousel.dataSource).toEqual(undefined);
        });
        it('enablePersistence', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({items: items}, carouselElement);
            carousel.enablePersistence = null;
            carousel.dataBind();
            expect(carousel.enablePersistence).toEqual(null);
            carousel.enablePersistence = undefined;
            carousel.dataBind();
            expect(carousel.enablePersistence).toEqual(undefined);
        });
        it('enableRtl', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({items: items}, carouselElement);
            carousel.enableRtl = null;
            carousel.dataBind();
            expect(carousel.enableRtl).toEqual(null);
            carousel.enableRtl = undefined;
            carousel.dataBind();
            expect(carousel.enableRtl).toEqual(undefined);
        });
        it('enableTouchSwipe', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({items: items}, carouselElement);
            carousel.enableTouchSwipe = null;
            carousel.dataBind();
            expect(carousel.enableTouchSwipe).toEqual(null);
            carousel.enableTouchSwipe = undefined;
            carousel.dataBind();
            expect(carousel.enableTouchSwipe).toEqual(undefined);
        });
        it('height', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({items: items}, carouselElement);
            carousel.height = null;
            carousel.dataBind();
            expect(carousel.height).toEqual(null);
            carousel.height = undefined;
            carousel.dataBind();
            expect(carousel.height).toEqual(undefined);
        });
        it('htmlAttributes', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({items: items}, carouselElement);
            carousel.htmlAttributes = null;
            carousel.dataBind();
            expect(carousel.htmlAttributes).toEqual(null);
            carousel.htmlAttributes = undefined;
            carousel.dataBind();
            expect(carousel.htmlAttributes).toEqual(undefined);
        });
        it('indicatorsTemplate', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({items: items}, carouselElement);
            carousel.indicatorsTemplate = null;
            carousel.dataBind();
            expect(carousel.indicatorsTemplate).toEqual(null);
            carousel.indicatorsTemplate = undefined;
            carousel.dataBind();
            expect(carousel.indicatorsTemplate).toEqual(undefined);
        });
        it('indicatorsType', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({items: items}, carouselElement);
            carousel.indicatorsType = null;
            carousel.dataBind();
            expect(carousel.indicatorsType).toEqual(null);
            carousel.indicatorsType = undefined;
            carousel.dataBind();
            expect(carousel.indicatorsType).toEqual(undefined);
        });
        it('interval', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({items: items}, carouselElement);
            carousel.interval = null;
            carousel.dataBind();
            expect(carousel.interval).toEqual(null);
            carousel.interval = undefined;
            carousel.dataBind();
            expect(carousel.interval).toEqual(undefined);
        });
        it('itemTemplate', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({items: items}, carouselElement);
            carousel.itemTemplate = null;
            carousel.dataBind();
            expect(carousel.itemTemplate).toEqual(null);
            carousel.itemTemplate = undefined;
            carousel.dataBind();
            expect(carousel.itemTemplate).toEqual(undefined);
        });
        it('items', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({items: items}, carouselElement);
            carousel.items = null;
            carousel.dataBind();
            expect(carousel.items.length).toEqual(0);
            carousel.items = undefined;
            carousel.dataBind();
            expect(carousel.items.length).toEqual(0);
        });
        it('locale', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({items: items}, carouselElement);
            carousel.locale = null;
            carousel.dataBind();
            expect(carousel.locale).toEqual(null);
            carousel.locale = undefined;
            carousel.dataBind();
            expect(carousel.locale).toEqual(undefined);
        });
        it('loop', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({items: items}, carouselElement);
            carousel.loop = null;
            carousel.dataBind();
            expect(carousel.loop).toEqual(null);
            carousel.loop = undefined;
            carousel.dataBind();
            expect(carousel.loop).toEqual(undefined);
        });
        it('nextButtonTemplate', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({items: items}, carouselElement);
            carousel.nextButtonTemplate = null;
            carousel.dataBind();
            expect(carousel.nextButtonTemplate).toEqual(null);
            carousel.nextButtonTemplate = undefined;
            carousel.dataBind();
            expect(carousel.nextButtonTemplate).toEqual(undefined);
        });
        it('partialVisible', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({items: items}, carouselElement);
            carousel.partialVisible = null;
            carousel.dataBind();
            expect(carousel.partialVisible).toEqual(null);
            carousel.partialVisible = undefined;
            carousel.dataBind();
            expect(carousel.partialVisible).toEqual(undefined);
        });
        it('pauseOnHover', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({items: items}, carouselElement);
            carousel.pauseOnHover = null;
            carousel.dataBind();
            expect(carousel.pauseOnHover).toEqual(null);
            carousel.pauseOnHover = undefined;
            carousel.dataBind();
            expect(carousel.pauseOnHover).toEqual(undefined);
        });
        it('playButtonTemplate', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({items: items}, carouselElement);
            carousel.playButtonTemplate = null;
            carousel.dataBind();
            expect(carousel.playButtonTemplate).toEqual(null);
            carousel.playButtonTemplate = undefined;
            carousel.dataBind();
            expect(carousel.playButtonTemplate).toEqual(undefined);
        });
        it('previousButtonTemplate', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({items: items}, carouselElement);
            carousel.previousButtonTemplate = null;
            carousel.dataBind();
            expect(carousel.previousButtonTemplate).toEqual(null);
            carousel.previousButtonTemplate = undefined;
            carousel.dataBind();
            expect(carousel.previousButtonTemplate).toEqual(undefined);
        });
        it('selectedIndex', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({items: items}, carouselElement);
            carousel.selectedIndex = null;
            carousel.dataBind();
            expect(carousel.selectedIndex).toEqual(0);
            carousel.selectedIndex = undefined;
            carousel.dataBind();
            expect(carousel.selectedIndex).toEqual(undefined);
        });
        it('showIndicators', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({items: items}, carouselElement);
            carousel.showIndicators = null;
            carousel.dataBind();
            expect(carousel.showIndicators).toEqual(null);
            carousel.showIndicators = undefined;
            carousel.dataBind();
            expect(carousel.showIndicators).toEqual(undefined);
        });
        it('showPlayButton', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({items: items}, carouselElement);
            carousel.showPlayButton = null;
            carousel.dataBind();
            expect(carousel.showPlayButton).toEqual(null);
            carousel.showPlayButton = undefined;
            carousel.dataBind();
            expect(carousel.showPlayButton).toEqual(undefined);
        });
        it('swipeMode', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({items: items}, carouselElement);
            carousel.swipeMode = null;
            carousel.dataBind();
            expect(carousel.swipeMode).toEqual(null);
            carousel.swipeMode = undefined;
            carousel.dataBind();
            expect(carousel.swipeMode).toEqual(undefined);
        });
        it('width', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({items: items}, carouselElement);
            carousel.width = null;
            carousel.dataBind();
            expect(carousel.width).toEqual(null);
            carousel.width = undefined;
            carousel.dataBind();
            expect(carousel.width).toEqual(undefined);
        });
    });
    describe('test case for partialslide with loop', () => {
        beforeEach((): void => {
            const carouselElement: HTMLElement = document.createElement('div');
            carouselElement.id = 'carousel';
            document.body.appendChild(carouselElement);
            jasmine.clock().install();
        });
        afterEach(() => {
            carousel.destroy();
            carousel.element.remove();
            carousel = null;
            jasmine.clock().uninstall();
        });
        it('test case for partialslide previous arrow', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ items: items, animationEffect: 'None', partialVisible: true }, carouselElement);
            expect(carouselElement.classList.contains('e-partial')).toBe(true);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[2].classList.contains('e-active')).toBe(true);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[3].classList.contains('e-active')).toBe(false);
            expect(carousel.selectedIndex).toEqual(0);
            (carouselElement.querySelector('.e-previous-icon') as HTMLElement).click();
            jasmine.clock().tick(1500);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[2].classList.contains('e-active')).toBe(false);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[6].classList.contains('e-active')).toBe(true);
            expect(carousel.selectedIndex).toEqual(4);
            carousel.selectedIndex = 1;
            carousel.dataBind();
            (carouselElement.querySelector('.e-previous-icon') as HTMLElement).click();
            jasmine.clock().tick(1500);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[3].classList.contains('e-active')).toBe(false);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[2].classList.contains('e-active')).toBe(true);
            expect(carousel.selectedIndex).toEqual(0);
        });
        it('test case for partialslide next arrow', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ animationEffect: 'None', items: items, partialVisible: true }, carouselElement);
            expect(carouselElement.classList.contains('e-partial')).toBe(true);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[2].classList.contains('e-active')).toBe(true);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[3].classList.contains('e-active')).toBe(false);
            expect(carousel.selectedIndex).toEqual(0);
            (carouselElement.querySelector('.e-next-icon') as HTMLElement).click();
            jasmine.clock().tick(1500);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[2].classList.contains('e-active')).toBe(false);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[3].classList.contains('e-active')).toBe(true);
            expect(carousel.selectedIndex).toEqual(1);
            carousel.selectedIndex = 4;
            carousel.dataBind();
            (carouselElement.querySelector('.e-next-icon') as HTMLElement).click();
            expect(carouselElement.querySelectorAll('.e-carousel-item')[2].classList.contains('e-active')).toBe(true);
            expect(carousel.selectedIndex).toEqual(0);
        });
        it('test case for partialslide play and pause button', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ animationEffect: 'None', items: items, showPlayButton: true, partialVisible: true }, carouselElement);
            expect(carouselElement.classList.contains('e-partial')).toBe(true);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[2].classList.contains('e-active')).toBe(true);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[3].classList.contains('e-active')).toBe(false);
            expect(carousel.selectedIndex).toEqual(0);
            (carouselElement.querySelector('.e-pause-icon') as HTMLElement).click();
            jasmine.clock().tick(6500);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[2].classList.contains('e-active')).toBe(true);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[3].classList.contains('e-active')).toBe(false);
            expect(carousel.selectedIndex).toEqual(0);
            (carouselElement.querySelector('.e-play-icon') as HTMLElement).click();
            jasmine.clock().tick(6500);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[2].classList.contains('e-active')).toBe(false);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[3].classList.contains('e-active')).toBe(true);
            expect(carousel.selectedIndex).toEqual(1);
        });
        it('test cases for partialslide autoPlay as true', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ animationEffect: 'None', items: items, autoPlay: true, partialVisible: true }, carouselElement);
            expect(carouselElement.classList.contains('e-partial')).toBe(true);
            expect(carousel.selectedIndex).toEqual(0);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[2].classList.contains('e-active')).toBe(true);
            jasmine.clock().tick(carousel.interval + 1500);
            expect(carousel.selectedIndex).toEqual(1);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[2].classList.contains('e-active')).toBe(false);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[3].classList.contains('e-active')).toBe(true);
        });
        it('test cases for partialslide pause on hover', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ animationEffect: 'None', items: items, partialVisible: true }, carouselElement);
            expect(carouselElement.classList.contains('e-partial')).toBe(true);
            expect(carouselElement.classList.contains('e-carousel-hover')).toBe(false);
            triggerMouseEvent(carouselElement, 'mouseenter');
            jasmine.clock().tick(5100);
            expect(carouselElement.classList.contains('e-carousel-hover')).toBe(true);
            expect(carousel.selectedIndex).toBe(0);
        });
        it('test cases for partialslide clicking on the indicators for Navigation', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ animationEffect: 'None', items: items, partialVisible: true }, carouselElement);
            expect(carouselElement.classList.contains('e-partial')).toBe(true);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[2].classList.contains('e-active')).toBe(true);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[6].classList.contains('e-active')).toBe(false);
            expect(carouselElement.querySelectorAll('.e-indicator-bar')[0].classList.contains('e-active')).toBe(true);
            expect(carouselElement.querySelectorAll('.e-indicator-bar')[4].classList.contains('e-active')).toBe(false);
            expect(carousel.selectedIndex).toEqual(0);
            (carouselElement.querySelectorAll('.e-indicator-bar')[4] as HTMLElement).click();
            jasmine.clock().tick(1500);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[2].classList.contains('e-active')).toBe(false);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[6].classList.contains('e-active')).toBe(true);
            expect(carouselElement.querySelectorAll('.e-indicator-bar')[0].classList.contains('e-active')).toBe(false);
            expect(carouselElement.querySelectorAll('.e-indicator-bar')[4].classList.contains('e-active')).toBe(true);
            expect(carousel.selectedIndex).toEqual(4);
            (carouselElement.querySelectorAll('.e-indicator-bar')[2] as HTMLElement).click();
            expect(carouselElement.querySelectorAll('.e-indicator-bar')[2].classList.contains('e-active')).toBe(true);
            expect(carouselElement.querySelectorAll('.e-indicator-bar')[4].classList.contains('e-active')).toBe(false);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[4].classList.contains('e-active')).toBe(true);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[6].classList.contains('e-active')).toBe(false);
            expect(carousel.selectedIndex).toEqual(2);
        });
        it('test case for partialslide cloned elements', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ animationEffect: 'None', items: items, partialVisible: true }, carouselElement);
            expect(carouselElement.classList.contains('e-partial')).toBe(true);
            expect(carouselElement.querySelectorAll('.e-cloned').length).toEqual(4);
        });
        it('test case for partialslide dynamically changing loop', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ animationEffect: 'None', items: items, partialVisible: true, loop: true }, carouselElement);
            expect(carouselElement.querySelectorAll('.e-cloned').length).toEqual(4);
            carousel.loop = false;
            carousel.dataBind();
            expect(carouselElement.querySelectorAll('.e-cloned').length).toEqual(0);
            carousel.loop = true;
            carousel.dataBind();
            expect(carouselElement.querySelectorAll('.e-cloned').length).toEqual(4);
            carousel.loop = false;
            carousel.dataBind();
            carousel.selectedIndex = 4;
            carousel.dataBind();
            (carouselElement.querySelector('.e-next-icon') as HTMLElement).click();
            jasmine.clock().tick(1500);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[4].classList.contains('e-active')).toBe(true);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[0].classList.contains('e-active')).toBe(false);
            carousel.selectedIndex = 0;
            carousel.dataBind();
            (carouselElement.querySelector('.e-previous-icon') as HTMLElement).click();
            jasmine.clock().tick(1500);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[0].classList.contains('e-active')).toBe(true);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[4].classList.contains('e-active')).toBe(false);
        });
        it('test case for partialslide dynamically changing partialVisible', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ animationEffect: 'None', items: items, partialVisible: true, loop: true }, carouselElement);
            expect(carouselElement.querySelectorAll('.e-cloned').length).toEqual(4);
            carousel.partialVisible = false;
            carousel.dataBind();
            expect(carouselElement.querySelectorAll('.e-cloned').length).toEqual(2);
            carousel.partialVisible = true;
            carousel.dataBind();
            expect(carouselElement.querySelectorAll('.e-cloned').length).toEqual(4);
            expect(carouselElement.classList.contains('e-partial')).toBe(true);
            expect(carouselElement.querySelectorAll('.e-carousel-item').length).toEqual(9);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[2].classList.contains('e-active')).toBe(true);
            carousel.partialVisible = false;
            carousel.dataBind();
            expect(carouselElement.classList.contains('e-partial')).toBe(false);
            expect(carouselElement.querySelectorAll('.e-carousel-item').length).toEqual(7);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[1].classList.contains('e-active')).toBe(true);
        });
        it('test case for partialslide with datasource', () => {
            document.body.appendChild(itemTemplate);
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ dataSource: carouselDataSource, itemTemplate: '#itemTemplate', animationEffect: 'None', partialVisible: true }, carouselElement);
            expect(carouselElement.querySelectorAll('.e-carousel-item').length).toEqual(9);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[2].classList.contains('e-active')).toBe(true);
            const carouselItem: Element = carouselElement.querySelectorAll('.e-carousel-item')[2];
            expect(carouselItem.querySelectorAll('.title').length).toEqual(1);
            const templateElement: HTMLElement = carouselItem.querySelector('.title') as HTMLElement;
            expect(templateElement.innerHTML).toEqual('Birds');
            expect(carousel.selectedIndex).toEqual(0);
            jasmine.clock().tick(6500);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[2].classList.contains('e-active')).toBe(false);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[3].classList.contains('e-active')).toBe(true);
            expect(carousel.selectedIndex).toEqual(1);
            carousel.selectedIndex = 0;
            carousel.dataBind();
            expect(carouselElement.querySelectorAll('.e-carousel-item')[2].classList.contains('e-active')).toBe(true);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[3].classList.contains('e-active')).toBe(false);
            expect(carousel.selectedIndex).toEqual(0);
            (carouselElement.querySelector('.e-next-icon') as HTMLElement).click();
            jasmine.clock().tick(1500);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[2].classList.contains('e-active')).toBe(false);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[3].classList.contains('e-active')).toBe(true);
            expect(carousel.selectedIndex).toEqual(1);
            carousel.selectedIndex = 0;
            carousel.dataBind();
            expect(carouselElement.querySelectorAll('.e-carousel-item')[2].classList.contains('e-active')).toBe(true);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[3].classList.contains('e-active')).toBe(false);
            expect(carousel.selectedIndex).toEqual(0);
            (carouselElement.querySelector('.e-previous-icon') as HTMLElement).click();
            jasmine.clock().tick(1500);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[2].classList.contains('e-active')).toBe(false);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[6].classList.contains('e-active')).toBe(true);
            expect(carousel.selectedIndex).toEqual(4);
            expect(carouselElement.classList.contains('e-partial')).toBe(true);
            expect(carouselElement.querySelectorAll('.e-cloned').length).toEqual(4);
        });
        it('test case for partialslide item count', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ animationEffect: 'None', items: items, partialVisible: true, loop: true }, carouselElement);
            const carouselItems: Element = carouselElement.querySelector('.e-carousel-items');
            expect(getComputedStyle(carouselItems).getPropertyValue('--carousel-items-count')).toEqual('9');
        });
        it('test case for partialslide transition property', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ animationEffect: 'None', items: items, partialVisible: true, loop: true }, carouselElement);
            const carouselItems: Element = carouselElement.querySelector('.e-carousel-items');
            expect(carouselElement.querySelectorAll('.e-carousel-item')[2].classList.contains('e-active')).toBe(true);
            expect(getComputedStyle(carouselItems).getPropertyValue('transition-property')).toBe('none');
            (carouselElement.querySelector('.e-next-icon') as HTMLElement).click();
            jasmine.clock().tick(1500);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[3].classList.contains('e-active')).toBe(true);
            expect(getComputedStyle(carouselItems).getPropertyValue('transition-property')).toBe('none');
        });
        it('test case for partialslide with EnableRtl ', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ animationEffect: 'None', items: items, partialVisible: true, loop: true, showPlayButton: true }, carouselElement);
            expect(carouselElement.classList.contains('e-rtl')).toBe(false);
            expect(carouselElement.querySelector('.e-carousel-navigators .e-previous-button').classList.contains('e-rtl')).toBe(false);
            expect(carouselElement.querySelector('.e-carousel-navigators .e-next-button').classList.contains('e-rtl')).toBe(false);
            expect(carouselElement.querySelector('.e-carousel-navigators .e-play-button').classList.contains('e-rtl')).toBe(false);
            carousel.enableRtl = true;
            carousel.dataBind();
            expect(carouselElement.classList.contains('e-rtl')).toBe(true);
            expect(carouselElement.querySelector('.e-carousel-navigators .e-previous-button').classList.contains('e-rtl')).toBe(true);
            expect(carouselElement.querySelector('.e-carousel-navigators .e-next-button').classList.contains('e-rtl')).toBe(true);
            expect(carouselElement.querySelector('.e-carousel-navigators .e-play-button').classList.contains('e-rtl')).toBe(true);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[2].classList.contains('e-active')).toBe(true);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[6].classList.contains('e-active')).toBe(false);
            (carouselElement.querySelector('.e-previous-icon') as HTMLElement).click();
            jasmine.clock().tick(1500);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[2].classList.contains('e-active')).toBe(false);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[6].classList.contains('e-active')).toBe(true);
            (carouselElement.querySelector('.e-next-icon') as HTMLElement).click();
            expect(carouselElement.querySelectorAll('.e-carousel-item')[6].classList.contains('e-active')).toBe(false);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[2].classList.contains('e-active')).toBe(true);
        });
    });

    describe('test case for partialslide without loop', () => {
        beforeEach((): void => {
            const carouselElement: HTMLElement = document.createElement('div');
            carouselElement.id = 'carousel';
            document.body.appendChild(carouselElement);
            jasmine.clock().install();
        });
        afterEach(() => {
            carousel.destroy();
            carousel.element.remove();
            carousel = null;
            jasmine.clock().uninstall();
        });
        it('test case for partialSlide previous arrow', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ items: items, animationEffect: 'None', partialVisible: true, loop: false }, carouselElement);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[0].classList.contains('e-active')).toBe(true);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[1].classList.contains('e-active')).toBe(false);
            expect(carousel.selectedIndex).toEqual(0);
            (carouselElement.querySelector('.e-previous-icon') as HTMLElement).click();
            jasmine.clock().tick(1500);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[0].classList.contains('e-active')).toBe(true);
            expect(carousel.selectedIndex).toEqual(0);
            carousel.selectedIndex = 1;
            carousel.dataBind();
            (carouselElement.querySelector('.e-previous-icon') as HTMLElement).click();
            jasmine.clock().tick(1500);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[0].classList.contains('e-active')).toBe(true);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[1].classList.contains('e-active')).toBe(false);
            expect(carousel.selectedIndex).toEqual(0);
        });
        it('test case for partialSlide next arrow', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ animationEffect: 'None', items: items, partialVisible: true, loop: false }, carouselElement);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[0].classList.contains('e-active')).toBe(true);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[1].classList.contains('e-active')).toBe(false);
            expect(carousel.selectedIndex).toEqual(0);
            (carouselElement.querySelector('.e-next-icon') as HTMLElement).click();
            jasmine.clock().tick(1500);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[0].classList.contains('e-active')).toBe(false);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[1].classList.contains('e-active')).toBe(true);
            expect(carousel.selectedIndex).toEqual(1);
            carousel.selectedIndex = 4;
            carousel.dataBind();
            (carouselElement.querySelector('.e-next-icon') as HTMLElement).click();
            expect(carouselElement.querySelectorAll('.e-carousel-item')[4].classList.contains('e-active')).toBe(true);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[0].classList.contains('e-active')).toBe(false);
            expect(carousel.selectedIndex).toEqual(4);
        });
        it('test case for partialSlide play and pause button', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ animationEffect: 'None', items: items, showPlayButton: true, partialVisible: true, loop: false }, carouselElement);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[0].classList.contains('e-active')).toBe(true);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[1].classList.contains('e-active')).toBe(false);
            expect(carousel.selectedIndex).toEqual(0);
            (carouselElement.querySelector('.e-pause-icon') as HTMLElement).click();
            jasmine.clock().tick(6500);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[0].classList.contains('e-active')).toBe(true);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[1].classList.contains('e-active')).toBe(false);
            expect(carousel.selectedIndex).toEqual(0);
            (carouselElement.querySelector('.e-play-icon') as HTMLElement).click();
            jasmine.clock().tick(6500);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[0].classList.contains('e-active')).toBe(false);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[1].classList.contains('e-active')).toBe(true);
            expect(carousel.selectedIndex).toEqual(1);
        });
        it('test cases for autoPlay as true', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ animationEffect: 'None', items: items, autoPlay: true, partialVisible: true, loop: false }, carouselElement);
            expect(carousel.selectedIndex).toEqual(0);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[0].classList.contains('e-active')).toBe(true);
            jasmine.clock().tick(carousel.interval + 1500);
            expect(carousel.selectedIndex).toEqual(1);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[0].classList.contains('e-active')).toBe(false);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[1].classList.contains('e-active')).toBe(true);
        });
        it('test cases for partialslide pause on hover partial mode', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ animationEffect: 'None', items: items, partialVisible: true, loop: false }, carouselElement);
            expect(carouselElement.classList.contains('e-carousel-hover')).toBe(false);
            triggerMouseEvent(carouselElement, 'mouseenter');
            jasmine.clock().tick(5100);
            expect(carouselElement.classList.contains('e-carousel-hover')).toBe(true);
            expect(carousel.selectedIndex).toBe(0);
        });
        it('test cases for partialslide clicking on the indicators for Navigation', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ animationEffect: 'None', items: items, partialVisible: true, loop: false }, carouselElement);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[0].classList.contains('e-active')).toBe(true);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[4].classList.contains('e-active')).toBe(false);
            expect(carouselElement.querySelectorAll('.e-indicator-bar')[0].classList.contains('e-active')).toBe(true);
            expect(carouselElement.querySelectorAll('.e-indicator-bar')[4].classList.contains('e-active')).toBe(false);
            expect(carousel.selectedIndex).toEqual(0);
            (carouselElement.querySelectorAll('.e-indicator-bar')[4] as HTMLElement).click();
            jasmine.clock().tick(1500);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[0].classList.contains('e-active')).toBe(false);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[4].classList.contains('e-active')).toBe(true);
            expect(carouselElement.querySelectorAll('.e-indicator-bar')[0].classList.contains('e-active')).toBe(false);
            expect(carouselElement.querySelectorAll('.e-indicator-bar')[4].classList.contains('e-active')).toBe(true);
            expect(carousel.selectedIndex).toEqual(4);
            (carouselElement.querySelectorAll('.e-indicator-bar')[2] as HTMLElement).click();
            expect(carouselElement.querySelectorAll('.e-indicator-bar')[2].classList.contains('e-active')).toBe(true);
            expect(carouselElement.querySelectorAll('.e-indicator-bar')[4].classList.contains('e-active')).toBe(false);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[2].classList.contains('e-active')).toBe(true);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[4].classList.contains('e-active')).toBe(false);
            expect(carousel.selectedIndex).toEqual(2);
        });
    });

    describe('test case for arrows and play icons', () => {
        beforeEach((): void => {
            const carouselElement: HTMLElement = document.createElement('div');
            carouselElement.id = 'carousel';
            document.body.appendChild(carouselElement);
            jasmine.clock().install();
        });
        afterEach(() => {
            carousel.destroy();
            carousel.element.remove();
            carousel = null;
            jasmine.clock().uninstall();
        });
        it('test case for previous arrow', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ animationEffect: 'None', items: items }, carouselElement);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[1].classList.contains('e-active')).toBe(true);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[2].classList.contains('e-active')).toBe(false);
            expect(carousel.selectedIndex).toEqual(0);
            (carouselElement.querySelector('.e-previous-icon') as HTMLElement).click();
            jasmine.clock().tick(1500);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[1].classList.contains('e-active')).toBe(false);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[5].classList.contains('e-active')).toBe(true);
            expect(carousel.selectedIndex).toEqual(4);
            carousel.selectedIndex = 1;
            carousel.dataBind();
            (carouselElement.querySelector('.e-previous-icon') as HTMLElement).click();
            jasmine.clock().tick(1500);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[1].classList.contains('e-active')).toBe(true);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[2].classList.contains('e-active')).toBe(false);
            expect(carousel.selectedIndex).toEqual(0);
        });
        it('test case for disabled previous arrow', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ animationEffect: 'None', items: items, loop: false }, carouselElement);
            expect(carouselElement.querySelector('.e-previous-button').getAttribute('disabled')).toEqual('');
            (carouselElement.querySelector('.e-previous-icon') as HTMLElement).click();
            expect(carousel.selectedIndex).toEqual(0);
        });
        it('test case for next arrow', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ animationEffect: 'None', items: items }, carouselElement);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[1].classList.contains('e-active')).toBe(true);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[2].classList.contains('e-active')).toBe(false);
            expect(carousel.selectedIndex).toEqual(0);
            (carouselElement.querySelector('.e-next-icon') as HTMLElement).click();
            jasmine.clock().tick(1500);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[1].classList.contains('e-active')).toBe(false);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[2].classList.contains('e-active')).toBe(true);
            expect(carousel.selectedIndex).toEqual(1);
            carousel.selectedIndex = 4;
            carousel.dataBind();
            (carouselElement.querySelector('.e-next-icon') as HTMLElement).click();
            expect(carouselElement.querySelectorAll('.e-carousel-item')[1].classList.contains('e-active')).toBe(true);
            expect(carousel.selectedIndex).toEqual(0);
        });
        it('test case for disabled next arrow', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ animationEffect: 'None', items: items, loop: false, selectedIndex: 4 }, carouselElement);
            expect(carouselElement.querySelector('.e-next-button').getAttribute('disabled')).toEqual('');
            (carouselElement.querySelector('.e-next-icon') as HTMLElement).click();
            expect(carousel.selectedIndex).toEqual(4);
        });
        it('test case for play and pause button', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ animationEffect: 'None', items: items, showPlayButton: true }, carouselElement);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[1].classList.contains('e-active')).toBe(true);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[2].classList.contains('e-active')).toBe(false);
            expect(carousel.selectedIndex).toEqual(0);
            (carouselElement.querySelector('.e-pause-icon') as HTMLElement).click();
            jasmine.clock().tick(6500);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[1].classList.contains('e-active')).toBe(true);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[2].classList.contains('e-active')).toBe(false);
            expect(carousel.selectedIndex).toEqual(0);
            (carouselElement.querySelector('.e-play-icon') as HTMLElement).click();
            jasmine.clock().tick(6500);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[1].classList.contains('e-active')).toBe(false);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[2].classList.contains('e-active')).toBe(true);
            expect(carousel.selectedIndex).toEqual(1);
        });
        it('test case for play and pause button when infinite false', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ items: items, showPlayButton: true, loop: false, selectedIndex: 3, animationEffect: 'None' }, carouselElement);
            expect(carousel.autoPlay).toEqual(true);
            (carouselElement.querySelector('.e-next-icon') as HTMLElement).click();
            jasmine.clock().tick(2000);
            expect(carousel.autoPlay).toEqual(false);
            expect(carouselElement.querySelector('.e-pause-icon')).toEqual(null);
            expect(carouselElement.querySelector('.e-play-icon')).toBeTruthy();
            (carouselElement.querySelector('.e-play-icon') as HTMLElement).click();
            expect(carousel.selectedIndex).toEqual(0);
            expect(carousel.autoPlay).toEqual(true);
            expect(carouselElement.querySelector('.e-play-icon')).toEqual(null);
            expect(carouselElement.querySelector('.e-pause-icon')).toBeTruthy();
        });
        it('test case for play button when autoPlay is false ', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ animationEffect: 'None', items: items, showPlayButton: true, autoPlay: false }, carouselElement);
            expect(carouselElement.querySelector('.e-play-icon') !== null).toBe(true);
            (carouselElement.querySelector('.e-play-icon') as HTMLElement).click();
            expect(carouselElement.querySelector('.e-pause-icon') !== null).toBe(true);
        });
        it('test case for play button when autoPlay and infinite is false ', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({
                animationEffect: 'None', items: items, showPlayButton: true, selectedIndex: 4, autoPlay: false, loop: false
            }, carouselElement);
            expect(carouselElement.querySelector('.e-play-icon') !== null).toBe(true);
            (carouselElement.querySelector('.e-play-icon') as HTMLElement).click();
            expect(carousel.selectedIndex).toBe(0);
            expect(carousel.autoPlay).toBe(true);
        });
    });
    describe('test case for indicators', () => {
        beforeEach((): void => {
            const carouselElement: HTMLElement = document.createElement('div');
            carouselElement.id = 'carousel';
            document.body.appendChild(carouselElement);
            jasmine.clock().install();
        });
        afterEach(() => {
            carousel.destroy();
            carousel.element.remove();
            jasmine.clock().uninstall();
            carousel = null;
        });
        it('test case for clicking active indicator', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ animationEffect: 'None', items: items }, carouselElement);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[1].classList.contains('e-active')).toBe(true);
            expect(carouselElement.querySelectorAll('.e-indicator-bar')[0].classList.contains('e-active')).toBe(true);
            expect(carousel.selectedIndex).toEqual(0);
            (carouselElement.querySelectorAll('.e-indicator-bar')[0] as HTMLElement).click();
            expect(carouselElement.querySelectorAll('.e-carousel-item')[1].classList.contains('e-active')).toBe(true);
            expect(carouselElement.querySelectorAll('.e-indicator-bar')[0].classList.contains('e-active')).toBe(true);
            expect(carousel.selectedIndex).toEqual(0);
        });
        it('test case clicking last slide through indicators', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ animationEffect: 'None', items: items }, carouselElement);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[1].classList.contains('e-active')).toBe(true);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[5].classList.contains('e-active')).toBe(false);
            expect(carouselElement.querySelectorAll('.e-indicator-bar')[0].classList.contains('e-active')).toBe(true);
            expect(carouselElement.querySelectorAll('.e-indicator-bar')[4].classList.contains('e-active')).toBe(false);
            expect(carousel.selectedIndex).toEqual(0);
            (carouselElement.querySelectorAll('.e-indicator-bar')[4] as HTMLElement).click();
            jasmine.clock().tick(1500);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[1].classList.contains('e-active')).toBe(false);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[5].classList.contains('e-active')).toBe(true);
            expect(carouselElement.querySelectorAll('.e-indicator-bar')[0].classList.contains('e-active')).toBe(false);
            expect(carouselElement.querySelectorAll('.e-indicator-bar')[4].classList.contains('e-active')).toBe(true);
            expect(carousel.selectedIndex).toEqual(4);
            (carouselElement.querySelectorAll('.e-indicator-bar')[2] as HTMLElement).click();
            expect(carouselElement.querySelectorAll('.e-indicator-bar')[2].classList.contains('e-active')).toBe(true);
            expect(carouselElement.querySelectorAll('.e-indicator-bar')[4].classList.contains('e-active')).toBe(false);
            expect(carousel.selectedIndex).toEqual(2);

        });
    });
    
    describe('test case for indicators type', () => {
        beforeEach((): void => {
            const carouselElement: HTMLElement = document.createElement('div');
            carouselElement.id = 'carousel';
            document.body.appendChild(carouselElement);
            jasmine.clock().install();
        });
        afterEach(() => {
            carousel.destroy();
            carousel.element.remove();
            jasmine.clock().uninstall();
            carousel = null;
        });
        it('test case for dynamic indicator type', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ animationEffect: 'None', items: items, indicatorsType: 'Dynamic' }, carouselElement);
            expect(carouselElement.querySelector('.e-carousel-indicators').classList.contains('e-dynamic')).toBe(true);
            expect(carouselElement.querySelector('.e-carousel-indicators').classList.contains('e-progress')).toBe(false);
            expect(carouselElement.querySelector('.e-carousel-indicators').classList.contains('e-fraction')).toBe(false);
            expect(carouselElement.querySelector('.e-carousel-indicators').classList.contains('e-default')).toBe(false);
            expect(carouselElement.querySelector(".e-indicator-bars .e-indicator-bar").classList.contains('e-active')).toBe(true);
            expect(carouselElement.querySelector(".e-indicator-bars .e-indicator-bar").nextElementSibling.classList.contains('e-next')).toBe(true);
            (carouselElement.querySelector(".e-next") as HTMLElement).click();
            jasmine.clock().tick(1500);
            expect(carouselElement.querySelectorAll(".e-indicator-bars .e-indicator-bar")[0].classList.contains('e-active')).toBe(false);
            expect(carouselElement.querySelectorAll(".e-indicator-bars .e-indicator-bar")[0].classList.contains('e-prev')).toBe(true);
            expect(carouselElement.querySelectorAll(".e-indicator-bars .e-indicator-bar")[1].classList.contains('e-active')).toBe(true);
            expect(carouselElement.querySelectorAll(".e-indicator-bars .e-indicator-bar")[2].classList.contains('e-next')).toBe(true);
            (carouselElement.querySelector(".e-previous") as HTMLElement).click();
            jasmine.clock().tick(1500);
            expect(carouselElement.querySelectorAll(".e-indicator-bars .e-indicator-bar")[0].classList.contains('e-active')).toBe(true);
            expect(carouselElement.querySelectorAll(".e-indicator-bars .e-indicator-bar")[1].classList.contains('e-next')).toBe(true);
            expect(carouselElement.querySelector(".e-indicator-bars").hasChildNodes()).toBe(true);
            expect(carouselElement.querySelector(".e-indicator-bars").children.length).toEqual(5);
        });
        it('test case for fraction indicator type', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ animationEffect: 'None', items: items, indicatorsType: 'Fraction' }, carouselElement);
            expect(carouselElement.querySelector('.e-carousel-indicators').classList.contains('e-fraction')).toBe(true);
            expect(carouselElement.querySelector('.e-carousel-indicators').classList.contains('e-progress')).toBe(false);
            expect(carouselElement.querySelector('.e-carousel-indicators').classList.contains('e-dynamic')).toBe(false);
            expect(carouselElement.querySelector('.e-carousel-indicators').classList.contains('e-default')).toBe(false);
            expect(carouselElement.querySelector(".e-indicator-bars").innerHTML).toEqual('1 / 5');
            (carouselElement.querySelector(".e-next") as HTMLElement).click();
            jasmine.clock().tick(1500);
            expect(carouselElement.querySelector(".e-indicator-bars").innerHTML).toEqual('2 / 5');
            (carouselElement.querySelector(".e-previous") as HTMLElement).click();
            jasmine.clock().tick(1500);
            expect(carouselElement.querySelector(".e-indicator-bars").innerHTML).toEqual('1 / 5');
            expect(carouselElement.querySelector(".e-indicator-bars").children.length).toEqual(0);
        });
        it('test case for progress indicator type', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ animationEffect: 'None', items: items, indicatorsType: 'Progress' }, carouselElement);
            expect(carouselElement.querySelector('.e-carousel-indicators').classList.contains('e-progress')).toBe(true);
            expect(carouselElement.querySelector('.e-carousel-indicators').classList.contains('e-fraction')).toBe(false);
            expect(carouselElement.querySelector('.e-carousel-indicators').classList.contains('e-dynamic')).toBe(false);
            expect(carouselElement.querySelector('.e-carousel-indicators').classList.contains('e-default')).toBe(false);
            var cssText = (carouselElement.querySelector(".e-indicator-bar") as HTMLElement).style.cssText;
            const updatedString = cssText.replace(/\s/g, "");
            expect(updatedString).toContain('--carousel-items-current:1;--carousel-items-count:5;');
            (carouselElement.querySelector(".e-next") as HTMLElement).click();
            jasmine.clock().tick(1500);
            var cssTextChanged = (carouselElement.querySelector(".e-indicator-bar") as HTMLElement).style.cssText;
            const updatedChangedString = cssTextChanged.replace(/\s/g, "");
            expect(updatedChangedString).toContain('--carousel-items-current:2;--carousel-items-count:5;');
            (carouselElement.querySelector(".e-previous") as HTMLElement).click();
            jasmine.clock().tick(1500);
            var cssTextPrev = (carouselElement.querySelector(".e-indicator-bar") as HTMLElement).style.cssText;
            const updatedPrevString = cssTextPrev.replace(/\s/g, "");
            expect(updatedPrevString).toContain('--carousel-items-current:1;--carousel-items-count:5;');
            expect(carouselElement.querySelector(".e-indicator-bars").hasChildNodes()).toBe(true);
        });
    });

    describe('test case for template indicators type', () => {
        beforeEach((): void => {
            const carouselElement: HTMLElement = document.createElement('div');
            carouselElement.id = 'carousel';
            document.body.appendChild(carouselElement);
            document.body.appendChild(indicatorTemp);
            jasmine.clock().install();
        });
        afterEach(() => {
            carousel.destroy();
            carousel.element.remove();
            jasmine.clock().uninstall();
            carousel = null;
        });

        it('checking indicators template in Dynamic indicator type', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ animationEffect: 'None', items: items, indicatorsTemplate: '#indicatorTemplate', indicatorsType: 'Dynamic' }, carouselElement);
            const indicatorsEle: HTMLElement = carouselElement.querySelector('.e-indicator-bars');
            expect(carouselElement.querySelector('.e-carousel-indicators').classList.contains('e-default')).toBe(true);
            expect(indicatorsEle.querySelectorAll('.e-template').length).toBe(5);
            expect(indicatorsEle.querySelectorAll('.indicator').length).toBe(5);
            const templateDetail: any = (carousel as any).templateParser();
            expect(templateDetail).toBeUndefined();
        });
        it('checking indicators template in fraction indicator type', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ animationEffect: 'None', items: items, indicatorsTemplate: '#indicatorTemplate', indicatorsType: 'Fraction' }, carouselElement);
            const indicatorsEle: HTMLElement = carouselElement.querySelector('.e-indicator-bars');
            expect(carouselElement.querySelector('.e-carousel-indicators').classList.contains('e-default')).toBe(true);
            expect(indicatorsEle.classList.contains('e-template')).toBe(true);
            expect(indicatorsEle.querySelectorAll('.indicator').length).toBe(1);
            const templateDetail: any = (carousel as any).templateParser();
            expect(templateDetail).toBeUndefined();
        });
        it('checking indicators template in progress indicator type', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ animationEffect: 'None', items: items, indicatorsTemplate: '#indicatorTemplate', indicatorsType: 'Progress' }, carouselElement);
            const indicatorsEle: HTMLElement = carouselElement.querySelector('.e-indicator-bars');
            expect(carouselElement.querySelector('.e-carousel-indicators').classList.contains('e-default')).toBe(true);
            expect(indicatorsEle.classList.contains('e-template')).toBe(true);
            expect(indicatorsEle.querySelectorAll('.indicator').length).toBe(1);
            const templateDetail: any = (carousel as any).templateParser();
            expect(templateDetail).toBeUndefined();
        });
    });
    
    describe('test case for showing arrows on hover action', () => {
        beforeEach((): void => {
            const carouselElement: HTMLElement = document.createElement('div');
            carouselElement.id = 'carousel';
            document.body.appendChild(carouselElement);
        });
        afterEach(() => {
            carousel.destroy();
            carousel.element.remove();
            carousel = null;
        });
        it('when entering mouse inside carousel', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ animationEffect: 'None', items: items, showPlayButton: true, buttonsVisibility: 'VisibleOnHover' }, carouselElement);
            triggerMouseEvent(carouselElement, 'mouseenter');
            expect(carouselElement.querySelector('.e-carousel-navigators') !== null).toBe(true);
            expect(carouselElement.querySelector('.e-previous').classList.contains('e-hover-arrows')).toBe(false);
            expect(carouselElement.querySelector('.e-next').classList.contains('e-hover-arrows')).toBe(false);
            expect(carouselElement.querySelector('.e-play-pause').classList.contains('e-hover-arrows')).toBe(false);
            triggerMouseEvent(carouselElement, 'mouseleave');
            expect(carouselElement.querySelector('.e-carousel-navigators .e-previous').classList.contains('e-hover-arrows')).toBe(true);
            expect(carouselElement.querySelector('.e-carousel-navigators .e-play-pause').classList.contains('e-hover-arrows')).toBe(true);
            expect(carouselElement.querySelector('.e-carousel-navigators .e-next').classList.contains('e-hover-arrows')).toBe(true);
        });
    });
    describe('test case for hover actions', () => {
        beforeEach((): void => {
            const carouselElement: HTMLElement = document.createElement('div');
            carouselElement.id = 'carousel';
            document.body.appendChild(carouselElement);
            jasmine.clock().install();
        });
        afterEach(() => {
            carousel.destroy();
            carousel.element.remove();
            carousel = null;
            jasmine.clock().uninstall();
        });
        it('when entering mouse inside carousel', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ animationEffect: 'None', items: items }, carouselElement);
            expect(carouselElement.classList.contains('e-carousel-hover')).toBe(false);
            triggerMouseEvent(carouselElement, 'mouseenter');
            jasmine.clock().tick(5100);
            expect(carouselElement.classList.contains('e-carousel-hover')).toBe(true);
            expect(carousel.selectedIndex).toBe(0);
        });
        it('when mouse leave the carousel', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ animationEffect: 'None', items: items }, carouselElement);
            triggerMouseEvent(carouselElement, 'mouseleave');
            expect(carouselElement.classList.contains('e-carousel-hover')).toBe(false);
            jasmine.clock().tick(5100);
            expect(carousel.selectedIndex).toBe(1);
        });
    });
    describe('test case for focus actions', () => {
        beforeEach((): void => {
            const carouselElement: HTMLElement = document.createElement('div');
            carouselElement.id = 'carousel';
            document.body.appendChild(carouselElement);
            jasmine.clock().install();
        });
        afterEach(() => {
            carousel.destroy();
            carousel.element.remove();
            carousel = null;
            jasmine.clock().uninstall();
        });
        it('when focusin carousel', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ animationEffect: 'None', items: items }, carouselElement);
            expect(carouselElement.classList.contains('e-carousel-hover')).toBe(false);
            triggerMouseEvent(carouselElement, 'focusin');
            jasmine.clock().tick(5100);
            expect(carouselElement.classList.contains('e-carousel-hover')).toBe(true);
            expect(carousel.selectedIndex).toBe(0);
        });
        it('when focusout carousel', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ animationEffect: 'None', items: items }, carouselElement);
            triggerMouseEvent(carouselElement, 'focusin');
            expect(carouselElement.classList.contains('e-carousel-hover')).toBe(true);
            triggerMouseEvent(carouselElement, 'focusout');
            expect(carouselElement.classList.contains('e-carousel-hover')).toBe(false);
            jasmine.clock().tick(5100);
            expect(carousel.selectedIndex).toBe(1);
        });
    });
    describe('test case for animation effect', () => {
        beforeEach((): void => {
            const carouselElement: HTMLElement = document.createElement('div');
            carouselElement.id = 'carousel';
            document.body.appendChild(carouselElement);
            jasmine.clock().install();
        });
        afterEach(() => {
            carousel.destroy();
            carousel.element.remove();
            carousel = null;
            jasmine.clock().uninstall();
        });
        it('checking slide animation', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ items: items, showPlayButton: true, animationEffect: 'Slide' }, carouselElement);
            expect(carouselElement.classList.contains('e-carousel-slide-animation')).toBe(true);
        });
        it('checking fade animation', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ items: items, showPlayButton: true, animationEffect: 'Fade' }, carouselElement);
            expect(carouselElement.classList.contains('e-carousel-fade-animation')).toBe(true);
        });
        it('checking no animation', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ items: items, showPlayButton: true, animationEffect: 'None' }, carouselElement);
            expect(carouselElement.classList.contains('e-carousel-animation-none')).toBe(true);
            expect(carousel.selectedIndex).toBe(0);
            jasmine.clock().tick(6500);
            expect(carousel.selectedIndex).toBe(1);
        });
    });
    describe('test case for custom animation', () => {
        beforeEach((): void => {
            const carouselElement: HTMLElement = document.createElement('div');
            carouselElement.id = 'carousel';
            document.body.appendChild(carouselElement);
        });
        afterEach(() => {
            carousel.destroy();
            carousel.element.remove();
            carousel = null;
        });
        it('checking custom animation', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ items: items, showPlayButton: true, animationEffect: 'Custom', cssClass: 'bounce' }, carouselElement);
            expect(carouselElement.classList.contains('e-carousel-custom-animation')).toBe(true);
            expect(carouselElement.classList.contains('bounce')).toBe(true);
        });
        it('property change of custom animation', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ items: items, showPlayButton: true, animationEffect: 'Custom', cssClass: 'bounce' }, carouselElement);
            expect(carouselElement.classList.contains('e-carousel-custom-animation')).toBe(true);
            expect(carouselElement.classList.contains('bounce')).toBe(true);
            carousel.cssClass = 'zoom';
            carousel.dataBind();
            expect(carouselElement.classList.contains('e-carousel-custom-animation')).toBe(true);
            expect(carouselElement.classList.contains('bounce')).toBe(false);
            expect(carouselElement.classList.contains('zoom')).toBe(true);
        });
    });
    describe('test case for preventing slide transition', () => {
        beforeEach((): void => {
            const carouselElement: HTMLElement = document.createElement('div');
            carouselElement.id = 'carousel';
            document.body.appendChild(carouselElement);
            jasmine.clock().install();
        });
        afterEach(() => {
            carousel.destroy();
            carousel.element.remove();
            carousel = null;
            jasmine.clock().uninstall();
        });
        it('check slide transition not occurs on clicking pause icon', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ animationEffect: 'None', items: items, showPlayButton: true }, carouselElement);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[1].classList.contains('e-active')).toBe(true);
            expect(carousel.selectedIndex).toEqual(0);
            expect(carouselElement.querySelector('.e-play-icon') !== null).toBe(false);
            (carouselElement.querySelector('.e-pause-icon') as HTMLElement).click();
            jasmine.clock().tick(6500);
            (carousel as any).applySlideInterval();
            expect(carouselElement.querySelector('.e-play-icon') !== null).toBe(true);
        });
        it('check slide transition not occurs when setting true to cancel in slideChanging event', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({
                animationEffect: 'None',
                items: items,
                slideChanging: (args: SlideChangingEventArgs) => {
                    args.cancel = true;
                }
            }, carouselElement);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[1].classList.contains('e-active')).toBe(true);
            expect(carousel.selectedIndex).toEqual(0);
            carousel.next();
            expect(carousel.selectedIndex).toEqual(0);
        });
    });
    describe('test case for empty carousel', () => {
        beforeEach((): void => {
            const carouselElement: HTMLElement = document.createElement('div');
            carouselElement.id = 'carousel';
            document.body.appendChild(carouselElement);
        });
        afterEach(() => {
            carousel.destroy();
            carousel.element.remove();
            carousel = null;
        });
        it('with no items or dataSource', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ animationEffect: 'None' }, carouselElement);
            expect(carouselElement.querySelectorAll('.e-carousel-item').length).toBe(0);
        });
    });
    describe('test case when no active element', () => {
        beforeEach((): void => {
            const carouselElement: HTMLElement = document.createElement('div');
            carouselElement.id = 'carousel';
            document.body.appendChild(carouselElement);
            jasmine.clock().install();
        });
        afterEach(() => {
            carousel.destroy();
            carousel.element.remove();
            carousel = null;
            jasmine.clock().uninstall();
        });
        it('check slide transition when no active element', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ animationEffect: 'None', items: items }, carouselElement);
            removeClass(carouselElement.querySelectorAll('.e-carousel-item'), 'e-active');
            removeClass(carouselElement.querySelectorAll('.e-indicator-bar'), 'e-active');
            (carousel as any).autoSlideChange();
            expect(carouselElement.querySelectorAll('.e-carousel-item')[1].classList.contains('e-active')).toBe(false);
            jasmine.clock().tick(6500);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[1].classList.contains('e-active')).toBe(false);
        });
        it('check slide transition when no active element for items(this case may happen when we move to next slide continuously)', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ animationEffect: 'None', items: items }, carouselElement);
            removeClass(carouselElement.querySelectorAll('.e-carousel-item'), 'e-active');
            (carousel as any).autoSlideChange();
            expect(carousel.selectedIndex).toBe(0);
            jasmine.clock().tick(6500);
            expect(carousel.selectedIndex).toBe(1);
        });
        it('check slide transition when no active element for items(this case may happen when we move to next slide continuously)', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ animationEffect: 'None', items: items, showIndicators: false }, carouselElement);
            removeClass(carouselElement.querySelectorAll('.e-carousel-item'), 'e-active');
            expect(carousel.selectedIndex).toBe(0);
            carousel.next();
            expect(carousel.selectedIndex).toBe(0);
        });
    });
    describe('test case for indicators template', () => {
        beforeEach((): void => {
            const carouselElement: HTMLElement = document.createElement('div');
            carouselElement.id = 'carousel';
            document.body.appendChild(carouselElement);
            document.body.appendChild(indicatorTemp);
        });
        afterEach(() => {
            carousel.destroy();
            carousel.element.remove();
            carousel = null;
        });
        it('checking indicators template availability', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ animationEffect: 'None', items: items, indicatorsTemplate: '#indicatorTemplate' }, carouselElement);
            const indicatorsEle: HTMLElement = carouselElement.querySelector('.e-indicator-bars');
            expect(indicatorsEle.querySelectorAll('.e-template').length).toBe(5);
            expect(indicatorsEle.querySelectorAll('.indicator').length).toBe(5);
            const templateDetail: any = (carousel as any).templateParser();
            expect(templateDetail).toBeUndefined();
        });
    });
    describe('EJ-853071 - Prevent Keyboard actions', () => {
        let carouselElement: HTMLElement;
        let keyEventArgs: any;
        beforeEach((): void => {
            carouselElement = document.createElement('div');
            carouselElement.id = 'carousel';
            carousel = new Carousel({ animationEffect: 'None', items: items, showIndicators: true,allowKeyboardInteraction: false }, carouselElement);
            document.body.appendChild(carouselElement);
            jasmine.clock().install();
        });
        afterEach(() => {
            carousel.destroy();
            carousel.element.remove();
            carousel = null;
            jasmine.clock().uninstall();
        });
        it('test case for prevent pressing down arrow', () => {
            const index: number = carousel.selectedIndex;
            expect(index).toEqual(0);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[index + 1].classList.contains('e-active')).toBe(true);
            keyEventArgs = {
                preventDefault: () => { /** */ },
                action: 'moveDown',
                target: carousel.element
            };
            (carousel as any).keyHandler(keyEventArgs);
            expect(carousel.selectedIndex).toEqual(0);
            jasmine.clock().tick(1500);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[index + 1].classList.contains('e-active')).toBe(true);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[2].classList.contains('e-active')).toBe(false);
            carousel.selectedIndex = 4;
            carousel.dataBind();
            keyEventArgs = {
                preventDefault: () => { /** */ },
                action: 'moveDown',
                target: carousel.element
            };
            (carousel as any).keyHandler(keyEventArgs);
            expect(carousel.selectedIndex).toEqual(4);
            carousel.selectedIndex = 4;
            carousel.loop = false;
            carousel.dataBind();
            expect(carousel.selectedIndex).toEqual(4);
            keyEventArgs = {
                preventDefault: () => { /** */ },
                action: 'moveDown',
                target: carousel.element
            };
            (carousel as any).keyHandler(keyEventArgs);
            expect(carousel.selectedIndex).toEqual(4);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[4].classList.contains('e-active')).toBe(true);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[0].classList.contains('e-active')).toBe(false);
        });
        it('test case for prevent pressing right arrow', () => {
            const index: number = carousel.selectedIndex;
            expect(index).toEqual(0);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[index + 1].classList.contains('e-active')).toBe(true);
            keyEventArgs = {
                preventDefault: () => { /** */ },
                action: 'moveRight',
                target: carousel.element
            };
            (carousel as any).keyHandler(keyEventArgs);
            expect(carousel.selectedIndex).toEqual(0);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[2].classList.contains('e-active')).toBe(false);
            carousel.selectedIndex = 4;
            carousel.dataBind();
            keyEventArgs = {
                preventDefault: () => { /** */ },
                action: 'moveRight',
                target: carousel.element
            };
            (carousel as any).keyHandler(keyEventArgs);
            expect(carousel.selectedIndex).toEqual(4);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[1].classList.contains('e-active')).toBe(false);
        });
        it('test case for prevent pressing up arrow', () => {
            const index: number = carousel.selectedIndex;
            expect(index).toEqual(0);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[index + 1].classList.contains('e-active')).toBe(true);
            keyEventArgs = {
                preventDefault: () => { /** */ },
                action: 'moveUp',
                target: carousel.element
            };
            (carousel as any).keyHandler(keyEventArgs);
            expect(carousel.selectedIndex).toEqual(0);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[5].classList.contains('e-active')).toBe(false);
            keyEventArgs = {
                preventDefault: () => { /** */ },
                action: 'moveUp',
                target: carousel.element
            };
            (carousel as any).keyHandler(keyEventArgs);
            expect(carousel.selectedIndex).toEqual(0);
            carousel.selectedIndex = 0;
            carousel.loop = false;
            carousel.dataBind();
            expect(carousel.selectedIndex).toEqual(0);
            keyEventArgs = {
                preventDefault: () => { /** */ },
                action: 'moveUp',
                target: carousel.element
            };
            (carousel as any).keyHandler(keyEventArgs);
            expect(carousel.selectedIndex).toEqual(0);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[0].classList.contains('e-active')).toBe(true);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[4].classList.contains('e-active')).toBe(false);
        });
        it('test case for prevent pressing left arrow', () => {
            const index: number = carousel.selectedIndex;
            expect(index).toEqual(0);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[index + 1].classList.contains('e-active')).toBe(true);
            keyEventArgs = {
                preventDefault: () => { /** */ },
                action: 'moveLeft',
                target: carousel.element
            };
            (carousel as any).keyHandler(keyEventArgs);
            expect(carousel.selectedIndex).toEqual(0);
            jasmine.clock().tick(1500);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[index + 1].classList.contains('e-active')).toBe(true);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[5].classList.contains('e-active')).toBe(false);
            keyEventArgs = {
                preventDefault: () => { /** */ },
                action: 'moveLeft',
                target: carousel.element
            };
            (carousel as any).keyHandler(keyEventArgs);
            expect(carousel.selectedIndex).toEqual(0);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[4].classList.contains('e-active')).toBe(false);
        });
        it('test case for prevent pressing Home & End key', () => {
            const index: number = carousel.selectedIndex;
            expect(index).toEqual(0);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[index + 1].classList.contains('e-active')).toBe(true);
            keyEventArgs = {
                preventDefault: () => { /** */ },
                action: 'end',
                target: carousel.element
            };
            (carousel as any).keyHandler(keyEventArgs);
            expect(carousel.selectedIndex).toEqual(0);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[5].classList.contains('e-active')).toBe(false);
            keyEventArgs = {
                preventDefault: () => { /** */ },
                action: 'home',
                target: carousel.element
            };
            (carousel as any).keyHandler(keyEventArgs);
            expect(carousel.selectedIndex).toEqual(0);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[1].classList.contains('e-active')).toBe(true);
        });
        it('test case for prevent pressing Space key', () => {
            carousel.showPlayButton = true;
            carousel.dataBind();
            const index: number = carousel.selectedIndex;
            expect(carousel.selectedIndex).toEqual(0);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[index + 1].classList.contains('e-active')).toBe(true);
            keyEventArgs = {
                preventDefault: () => { /** */ },
                action: 'space',
                target: carousel.element
            };
            (carousel as any).keyHandler(keyEventArgs);
            expect(carousel.selectedIndex).toEqual(0);
            expect(carouselElement.querySelector('.e-play-icon')).toBeNull();
                expect(carouselElement.querySelector('.e-pause-icon')).toBeTruthy();
            jasmine.clock().tick(5500);
            expect(carousel.selectedIndex).toEqual(0);
            (carousel as any).keyHandler(keyEventArgs);
            expect(carouselElement.querySelector('.e-pause-icon')).toBeTruthy();
            expect(carouselElement.querySelector('.e-play-icon')).toBeNull();
            jasmine.clock().tick(5500);
            expect(carousel.selectedIndex).toEqual(0);
        });
        it('test case for prevent pressing Space key when indicator is not focused', () => {
            carousel.showPlayButton = true;
            carousel.dataBind();
            expect(carousel.selectedIndex).toEqual(0);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[1].classList.contains('e-active')).toBe(true);
            const targetIndicator: HTMLElement = carouselElement.querySelectorAll('.e-indicator')[1] as HTMLElement;
            keyEventArgs = {
                preventDefault: () => { /** */ },
                action: 'space',
                target: targetIndicator
            };
            (carousel as any).keyHandler(keyEventArgs);
            expect(carousel.selectedIndex).toEqual(0);
        });
        it('test case for prevent pressing Space key when previous button is not focused', () => {
            carousel.slideChanged = () => {
                expect(carousel.selectedIndex).toEqual(0);
                expect(carouselElement.querySelectorAll('.e-carousel-item')[5].classList.contains('e-active')).toBe(false);
            };
            carousel.animationEffect = 'None';
            carousel.dataBind();
            expect(carousel.selectedIndex).toEqual(0);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[1].classList.contains('e-active')).toBe(true);
            const previousButton: HTMLElement = carouselElement.querySelector('.e-previous-button') as HTMLElement;
            keyEventArgs = {
                preventDefault: () => { /** */ },
                action: 'space',
                target: previousButton
            };
            (carousel as any).keyHandler(keyEventArgs);
            expect(carousel.selectedIndex).toEqual(0);
        });
        it('test case for prevent pressing Space key when next button is not focused', () => {
            carousel.slideChanged = () => {
                expect(carousel.selectedIndex).toEqual(0);
                expect(carouselElement.querySelectorAll('.e-carousel-item')[1].classList.contains('e-active')).toBe(true);
            };
            carousel.animationEffect = 'None';
            carousel.dataBind();
            expect(carousel.selectedIndex).toEqual(0);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[1].classList.contains('e-active')).toBe(true);
            const nextButton: HTMLElement = carouselElement.querySelector('.e-next-button') as HTMLElement;
            keyEventArgs = {
                preventDefault: () => { /** */ },
                action: 'space',
                target: nextButton
            };
            (carousel as any).keyHandler(keyEventArgs);
            expect(carousel.selectedIndex).toEqual(0);
        });
    });
    describe('test case for play button template', () => {
        beforeEach((): void => {
            const carouselElement: HTMLElement = document.createElement('div');
            carouselElement.id = 'carousel';
            document.body.appendChild(carouselElement);
            document.body.appendChild(playButtonTemp);
            jasmine.clock().install();
        });
        afterEach(() => {
            carousel.destroy();
            carousel.element.remove();
            carousel = null;
            jasmine.clock().uninstall();
        });
        it('checking play button template availability', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ animationEffect: 'None', items: items, showPlayButton: true, playButtonTemplate: '#playButtonTemplate' }, carouselElement);
            const navigatorsEle: HTMLElement = carouselElement.querySelector('.e-carousel-navigators');
            expect(navigatorsEle.querySelector('.playTemp').classList.contains('playTemp')).toBe(true);
        });
        it('checking play button click action', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ animationEffect: 'None', items: items, showPlayButton: true, playButtonTemplate: '#playButtonTemplate' }, carouselElement);
            const navigatorsEle: HTMLElement = carouselElement.querySelector('.e-carousel-navigators');
            (navigatorsEle.querySelector('.e-play-pause') as HTMLElement).click();
            jasmine.clock().tick(6500);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[0].classList.contains('e-active')).toBe(false);
            expect(carousel.selectedIndex).toEqual(1);
        });
    });
    describe('test case for arrow template', () => {
        beforeEach((): void => {
            const carouselElement: HTMLElement = document.createElement('div');
            carouselElement.id = 'carousel';
            document.body.appendChild(carouselElement);
            document.body.appendChild(arrowTemp);
            jasmine.clock().install();
        });
        afterEach(() => {
            carousel.destroy();
            carousel.element.remove();
            jasmine.clock().uninstall();
            carousel = null;
        });
        it('checking templates', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ animationEffect: 'None', items: items, previousButtonTemplate: '#arrowTemplate', nextButtonTemplate: '#arrowTemplate' }, carouselElement);
            const navigatorsEle: HTMLElement = carouselElement.querySelector('.e-carousel-navigators');
            expect(navigatorsEle.querySelector('.arrowTemp').classList.contains('arrowTemp')).toBe(true);
        });
        it('checking prev arrow', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ animationEffect: 'None', items: items, previousButtonTemplate: '#arrowTemplate', nextButtonTemplate: '#arrowTemplate' }, carouselElement);
            const navigatorsEle: HTMLElement = carouselElement.querySelector('.e-carousel-navigators');
            expect(carouselElement.querySelectorAll('.e-carousel-item')[1].classList.contains('e-active')).toBe(true);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[2].classList.contains('e-active')).toBe(false);
            expect(carousel.selectedIndex).toEqual(0);
            (navigatorsEle.querySelector('.bi-caret-left') as HTMLElement).click();
            jasmine.clock().tick(1500);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[1].classList.contains('e-active')).toBe(false);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[5].classList.contains('e-active')).toBe(true);
            expect(carousel.selectedIndex).toEqual(4);
        });
        it('checking next arrow', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ animationEffect: 'None', items: items, previousButtonTemplate: '#arrowTemplate', nextButtonTemplate: '#arrowTemplate' }, carouselElement);
            const navigatorsEle: HTMLElement = carouselElement.querySelector('.e-carousel-navigators');
            expect(carouselElement.querySelectorAll('.e-carousel-item')[1].classList.contains('e-active')).toBe(true);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[2].classList.contains('e-active')).toBe(false);
            expect(carousel.selectedIndex).toEqual(0);
            (navigatorsEle.querySelector('.bi-caret-right') as HTMLElement).click();
            jasmine.clock().tick(1500);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[1].classList.contains('e-active')).toBe(false);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[2].classList.contains('e-active')).toBe(true);
            expect(carousel.selectedIndex).toEqual(1);
        });
    });

    describe('test case for item properties', () => {
        beforeEach((): void => {
            const carouselElement: HTMLElement = document.createElement('div');
            carouselElement.id = 'carousel';
            document.body.appendChild(carouselElement);
            jasmine.clock().install();
        });
        afterEach(() => {
            (carousel as any).isAngular = true;
            carousel.destroy();
            carousel.element.remove();
            carousel = null;
            jasmine.clock().uninstall();
        });
        it('test case for cssClass of items property', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ animationEffect: 'None', items: carouselItems }, carouselElement);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[1].classList.contains('item-test')).toBe(true);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[2].classList.contains('item-test')).toBe(false);
        });
        it('test case for interval of items property', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ animationEffect: 'None', items: carouselItems }, carouselElement);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[1].classList.contains('e-active')).toBe(true);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[2].classList.contains('e-active')).toBe(false);
            expect(carousel.selectedIndex).toEqual(0);
            jasmine.clock().tick(5100);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[1].classList.contains('e-active')).toBe(false);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[2].classList.contains('e-active')).toBe(true);
            expect(carousel.selectedIndex).toEqual(1);
            jasmine.clock().tick(5100);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[2].classList.contains('e-active')).toBe(false);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[3].classList.contains('e-active')).toBe(true);
            expect(carousel.selectedIndex).toEqual(2);
        });
        it('test case for htmlAttributes of items property', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ animationEffect: 'None', items: carouselItems }, carouselElement);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[2].getAttribute('data-custom')).toEqual('test');
        });
    });
    describe('test case for dataSource', () => {
        beforeEach((): void => {
            const carouselElement: HTMLElement = document.createElement('div');
            carouselElement.id = 'carousel';
            document.body.appendChild(itemTemplate);
            document.body.appendChild(carouselElement);
            jasmine.clock().install();
        });
        afterEach(() => {
            carousel.destroy();
            carousel.element.remove();
            carousel = null;
            jasmine.clock().uninstall();
        });
        it('test case for carousel item count', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ dataSource: carouselDataSource, itemTemplate: '#itemTemplate', animationEffect: 'Fade' }, carouselElement);
            expect(carouselElement.querySelectorAll('.e-carousel-item').length).toEqual(7);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[1].classList.contains('e-active')).toBe(true);
        });
        it('test case for itemTemplate', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ animationEffect: 'None', dataSource: carouselDataSource, itemTemplate: '#itemTemplate' }, carouselElement);
            const carouselItem: Element = carouselElement.querySelectorAll('.e-carousel-item')[1];
            expect(carouselItem.querySelectorAll('.title').length).toEqual(1);
            const templateElement: HTMLElement = carouselItem.querySelector('.title') as HTMLElement;
            expect(templateElement.innerHTML).toEqual('Birds');
        });
        it('test case for slide change', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ animationEffect: 'None', dataSource: carouselDataSource, itemTemplate: '#itemTemplate' }, carouselElement);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[1].classList.contains('e-active')).toBe(true);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[2].classList.contains('e-active')).toBe(false);
            expect(carousel.selectedIndex).toEqual(0);
            jasmine.clock().tick(6500);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[1].classList.contains('e-active')).toBe(false);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[2].classList.contains('e-active')).toBe(true);
            expect(carousel.selectedIndex).toEqual(1);
        });
        it('test case for next arrow', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ animationEffect: 'None', dataSource: carouselDataSource, itemTemplate: '#itemTemplate' }, carouselElement);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[1].classList.contains('e-active')).toBe(true);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[2].classList.contains('e-active')).toBe(false);
            expect(carousel.selectedIndex).toEqual(0);
            (carouselElement.querySelector('.e-next-icon') as HTMLElement).click();
            jasmine.clock().tick(1500);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[1].classList.contains('e-active')).toBe(false);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[2].classList.contains('e-active')).toBe(true);
            expect(carousel.selectedIndex).toEqual(1);
        });
        it('test case for previous arrow', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ animationEffect: 'None', dataSource: carouselDataSource, itemTemplate: '#itemTemplate' }, carouselElement);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[1].classList.contains('e-active')).toBe(true);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[2].classList.contains('e-active')).toBe(false);
            expect(carousel.selectedIndex).toEqual(0);
            (carouselElement.querySelector('.e-previous-icon') as HTMLElement).click();
            jasmine.clock().tick(1500);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[1].classList.contains('e-active')).toBe(false);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[5].classList.contains('e-active')).toBe(true);
            expect(carousel.selectedIndex).toEqual(4);
        });
    });

    describe('Carousel Public Methods', () => {
        beforeEach((): void => {
            const carouselElement: HTMLElement = document.createElement('div');
            carouselElement.id = 'carousel';
            document.body.appendChild(carouselElement);
            jasmine.clock().install();
        });
        afterEach(() => {
            carousel.destroy();
            carousel.element.remove();
            carousel = null;
            jasmine.clock().uninstall();
        });
        it('test case for prev method', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ items: items, animationEffect: 'Fade' }, carouselElement);
            expect(carousel.selectedIndex).toEqual(0);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[1].classList.contains('e-active')).toBe(true);
            carousel.prev();
            expect(carouselElement.querySelectorAll('.e-carousel-item')[5].classList.contains('e-active')).toBe(true);
            expect(carousel.selectedIndex).toEqual(4);
            carousel.selectedIndex = 1;
            carousel.dataBind();
            carousel.prev();
            expect(carouselElement.querySelectorAll('.e-carousel-item')[1].classList.contains('e-active')).toBe(true);
            expect(carousel.selectedIndex).toEqual(0);
        });
        it('test case for next method', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ animationEffect: 'None', items: items }, carouselElement);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[1].classList.contains('e-active')).toBe(true);
            expect(carousel.selectedIndex).toEqual(0);
            carousel.next();
            expect(carouselElement.querySelectorAll('.e-carousel-item')[2].classList.contains('e-active')).toBe(true);
            expect(carousel.selectedIndex).toEqual(1);
            carousel.selectedIndex = 4;
            carousel.dataBind();
            carousel.next();
            expect(carouselElement.querySelectorAll('.e-carousel-item')[1].classList.contains('e-active')).toBe(true);
            expect(carousel.selectedIndex).toEqual(0);
        });
        it('test case for prev & next method when infinite false', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ animationEffect: 'None', items: items, loop: false }, carouselElement);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[0].classList.contains('e-active')).toBe(true);
            expect(carousel.selectedIndex).toEqual(0);
            carousel.prev();
            expect(carouselElement.querySelectorAll('.e-carousel-item')[0].classList.contains('e-active')).toBe(true);
            expect(carousel.selectedIndex).toEqual(0);
            carousel.selectedIndex = 4;
            carousel.dataBind();
            carousel.next();
            expect(carouselElement.querySelectorAll('.e-carousel-item')[4].classList.contains('e-active')).toBe(true);
            expect(carousel.selectedIndex).toEqual(4);
        });
        it('test case for pause and play method', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ animationEffect: 'None', items: items }, carouselElement);
            carousel.pause();
            jasmine.clock().tick(carousel.interval + 1500);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[1].classList.contains('e-active')).toBe(true);
            expect(carousel.selectedIndex).toEqual(0);
            carousel.play();
            jasmine.clock().tick(carousel.interval + 1500);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[2].classList.contains('e-active')).toBe(true);
            expect(carousel.selectedIndex).toEqual(1);
        });
        it('test case for pause and play method with showPlayButton', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ animationEffect: 'None', items: items, showPlayButton: true }, carouselElement);
            expect(carouselElement.querySelector('.e-pause-icon') !== null).toBe(true);
            carousel.pause();
            expect(carouselElement.querySelector('.e-pause-icon') !== null).toBe(false);
            expect(carouselElement.querySelector('.e-play-icon') !== null).toBe(true);
            jasmine.clock().tick(carousel.interval + 1500);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[1].classList.contains('e-active')).toBe(true);
            expect(carousel.selectedIndex).toEqual(0);
            carousel.play();
            expect(carouselElement.querySelector('.e-pause-icon') !== null).toBe(true);
            expect(carouselElement.querySelector('.e-play-icon') !== null).toBe(false);
            jasmine.clock().tick(carousel.interval + 1500);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[2].classList.contains('e-active')).toBe(true);
            expect(carousel.selectedIndex).toEqual(1);
        });
    });

    describe('notify property changes of', () => {
        beforeEach((): void => {
            const carouselElement: HTMLElement = document.createElement('div');
            carouselElement.id = 'carousel';
            document.body.appendChild(carouselElement);
            jasmine.clock().install();

        });
        afterEach(() => {
            carousel.destroy();
            carousel.element.remove();
            carousel = null;
            jasmine.clock().uninstall();
        });
        it('showIndicators', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ animationEffect: 'None', items: items, showIndicators: true }, carouselElement);
            carousel.showIndicators = false;
            carousel.dataBind();
            expect(carouselElement.querySelector('.e-carousel-indicators') === null).toBe(true);
            carousel.showIndicators = true;
            carousel.dataBind();
            expect(carouselElement.querySelector('.e-carousel-indicators') !== null).toBe(true);
        });
        it('showPlayButton', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ animationEffect: 'None', items: items, showPlayButton: false }, carouselElement);
            carousel.showPlayButton = true;
            carousel.dataBind();
            expect(carouselElement.querySelector('.e-play-pause') !== null).toBe(true);
            carousel.showPlayButton = false;
            carousel.dataBind();
            expect(carouselElement.querySelector('.e-play-pause') === null).toBe(true);
        });
        it('buttonsVisibility', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ animationEffect: 'None', items: items, buttonsVisibility: 'Visible', showPlayButton: true }, carouselElement);
            carousel.buttonsVisibility = 'Hidden';
            carousel.dataBind();
            expect(carouselElement.querySelector('.e-carousel-navigators') === null).toBe(true);
            carousel.buttonsVisibility = 'Visible';
            carousel.dataBind();
            expect(carouselElement.querySelector('.e-carousel-navigators') !== null).toBe(true);
            expect(carouselElement.querySelector('.e-previous').classList.contains('e-hover-arrows')).toBe(false);
            expect(carouselElement.querySelector('.e-next').classList.contains('e-hover-arrows')).toBe(false);
            expect(carouselElement.querySelector('.e-play-pause').classList.contains('e-hover-arrows')).toBe(false);
            carousel.buttonsVisibility = 'VisibleOnHover';
            carousel.dataBind();
            expect(carouselElement.querySelector('.e-hover-arrows') !== null).toBe(true);
            expect(carouselElement.querySelector('.e-carousel-navigators .e-previous').classList.contains('e-hover-arrows')).toBe(true);
            expect(carouselElement.querySelector('.e-carousel-navigators .e-play-pause').classList.contains('e-hover-arrows')).toBe(true);
            expect(carouselElement.querySelector('.e-carousel-navigators .e-next').classList.contains('e-hover-arrows')).toBe(true);
            carousel.buttonsVisibility = 'Visible';
            carousel.dataBind();
            expect(carouselElement.querySelector('.e-carousel-navigators') !== null).toBe(true);
            expect(carouselElement.querySelector('.e-previous').classList.contains('e-hover-arrows')).toBe(false);
            expect(carouselElement.querySelector('.e-next').classList.contains('e-hover-arrows')).toBe(false);
            expect(carouselElement.querySelector('.e-play-pause').classList.contains('e-hover-arrows')).toBe(false);
        });
        it('selectedIndex', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ animationEffect: 'None', items: items, selectedIndex: 0 }, carouselElement);
            carousel.selectedIndex = 2;
            carousel.dataBind();
            expect(carouselElement.querySelectorAll('.e-carousel-item')[3].classList.contains('e-active')).toBe(true);
            expect(carouselElement.querySelectorAll('.e-indicator-bar')[2].classList.contains('e-active')).toBe(true);
            carousel.selectedIndex = 4;
            carousel.dataBind();
            expect(carouselElement.querySelectorAll('.e-carousel-item')[5].classList.contains('e-active')).toBe(true);
            expect(carouselElement.querySelectorAll('.e-indicator-bar')[4].classList.contains('e-active')).toBe(true);
        });
        it('items', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ animationEffect: 'None', items: items, selectedIndex: 0 }, carouselElement);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[3].classList.contains('test-class')).toBe(false);
            carousel.items[2].cssClass = 'test-class';
            carousel.dataBind();
            expect(carouselElement.querySelectorAll('.e-carousel-item')[3].classList.contains('test-class')).toBe(true);
        });
        it('dataSource', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ dataSource: carouselDataSource, itemTemplate: '#itemTemplate', animationEffect: 'Fade' }, carouselElement);
            expect(carouselElement.querySelectorAll('.e-carousel-item').length).toEqual(7);
            carousel.dataSource = carouselData;
            carousel.dataBind();
            expect(carouselElement.querySelectorAll('.e-carousel-item').length).toEqual(6);
        });
        it('autoPlay', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ animationEffect: 'None', items: items, autoPlay: true }, carouselElement);
            const index: number = carousel.selectedIndex;
            carousel.autoPlay = false;
            carousel.dataBind();
            expect(carouselElement.querySelectorAll('.e-carousel-item')[index + 1].classList.contains('e-active')).toBe(true);
            jasmine.clock().tick(carousel.interval + 1500);
            expect(carousel.selectedIndex).toBe(index);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[index + 1].classList.contains('e-active')).toBe(true);
            carousel.autoPlay = true;
            carousel.dataBind();
            expect(carousel.selectedIndex).toBe(index);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[index + 1].classList.contains('e-active')).toBe(true);
            jasmine.clock().tick(carousel.interval + 1500);
            expect(carousel.selectedIndex).toBe(index + 1);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[index + 1].classList.contains('e-active')).toBe(false);
        });
        it('autoPlay with play/pause button', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ animationEffect: 'None', items: items, autoPlay: true, showPlayButton: true }, carouselElement);
            expect(carouselElement.querySelector('.e-pause-icon')).toBeTruthy();
            carousel.autoPlay = false;
            carousel.dataBind();
            expect(carouselElement.querySelector('.e-pause-icon')).toEqual(null);
            expect(carouselElement.querySelector('.e-play-icon')).toBeTruthy();
            carousel.autoPlay = true;
            carousel.dataBind();
            expect(carouselElement.querySelector('.e-play-icon')).toEqual(null);
            expect(carouselElement.querySelector('.e-pause-icon')).toBeTruthy();
        });
        it('interval', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ animationEffect: 'None', items: items, interval: 5000 }, carouselElement);
            const index: number = carousel.selectedIndex;
            carousel.interval = 2000;
            carousel.dataBind();
            expect(carousel.selectedIndex).toBe(index);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[index + 1].classList.contains('e-active')).toBe(true);
            jasmine.clock().tick(2000 + 1500);
            expect(carousel.selectedIndex).toBe(index + 1);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[index + 1].classList.contains('e-active')).toBe(false);
        });
        it('infinite', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ animationEffect: 'None', items: items, selectedIndex: 4, loop: true }, carouselElement);
            expect(carouselElement.querySelector('.e-next-button').getAttribute('disabled')).toEqual(null);
            carousel.loop = false;
            carousel.dataBind();
            expect(carouselElement.querySelector('.e-next-button').getAttribute('disabled')).toEqual('');
            expect(carouselElement.querySelectorAll('.e-carousel-item')[4].classList.contains('e-active')).toBe(true);
            jasmine.clock().tick(6500);
            expect(carousel.selectedIndex).toBe(4);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[4].classList.contains('e-active')).toBe(true);
            carousel.loop = true;
            carousel.dataBind();
            expect(carouselElement.querySelectorAll('.e-carousel-item')[5].classList.contains('e-active')).toBe(true);
            expect(carouselElement.querySelector('.e-next-button').getAttribute('disabled')).toEqual(null);
            jasmine.clock().tick(6500);
            expect(carousel.selectedIndex).toBe(0);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[5].classList.contains('e-active')).toBe(false);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[1].classList.contains('e-active')).toBe(true);
        });
        it('cssClass', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ animationEffect: 'None', items: items, cssClass: 'carousel' }, carouselElement);
            expect(carouselElement.classList.contains('carousel')).toEqual(true);
            carousel.cssClass = 'default-carousel';
            carousel.dataBind();
            expect(carouselElement.classList.contains('carousel')).toEqual(false);
            expect(carouselElement.classList.contains('default-carousel')).toEqual(true);
        });
        it('htmlAttributes', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ animationEffect: 'None', items: items }, carouselElement);
            carousel.htmlAttributes = { 'data-custom': 'test' };
            carousel.dataBind();
            expect(carouselElement.getAttribute('data-custom')).toEqual('test');
        });
        it('enableRTL', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ animationEffect: 'None', items: items }, carouselElement);
            expect(carousel.element.classList.contains('e-rtl')).toBe(false);
            carousel.enableRtl = true;
            carousel.dataBind();
            expect(carousel.element.classList.contains('e-rtl')).toBe(true);
            carousel.enableRtl = false;
            carousel.dataBind();
            expect(carousel.element.classList.contains('e-rtl')).toBe(false);
        });
        it('enableTouchSwipe', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ animationEffect: 'None', items: items, enableTouchSwipe: false }, carouselElement);
            carousel.enableTouchSwipe = true;
            carousel.dataBind();
            expect(carouselElement.querySelectorAll('.e-carousel-item')[1].classList.contains('e-active')).toBe(true);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[2].classList.contains('e-active')).toBe(false);
            expect(carousel.selectedIndex).toEqual(0);
            triggerSwipeEvent(carouselElement, 300, 400);
            jasmine.clock().tick(1500);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[1].classList.contains('e-active')).toBe(false);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[2].classList.contains('e-active')).toBe(true);
            expect(carousel.selectedIndex).toEqual(1);
            triggerSwipeEvent(carouselElement, 400, 200);
            jasmine.clock().tick(1500);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[1].classList.contains('e-active')).toBe(true);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[2].classList.contains('e-active')).toBe(false);
            expect(carousel.selectedIndex).toEqual(0);
            carousel.enableTouchSwipe = false;
            carousel.dataBind();
            triggerSwipeEvent(carouselElement, 300, 400);
            jasmine.clock().tick(1500);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[1].classList.contains('e-active')).toBe(true);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[2].classList.contains('e-active')).toBe(false);
            expect(carousel.selectedIndex).toEqual(0);
            triggerSwipeEvent(carouselElement, 400, 200);
            jasmine.clock().tick(1500);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[1].classList.contains('e-active')).toBe(true);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[2].classList.contains('e-active')).toBe(false);
            expect(carousel.selectedIndex).toEqual(0);
        });
        it('width', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ animationEffect: 'None', items: items, width: '500px' }, carouselElement);
            expect(carouselElement.style.width).toEqual('500px');
            carousel.width = '700px';
            carousel.dataBind();
            expect(carouselElement.style.width).toEqual('700px');
        });
        it('height', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ animationEffect: 'None', items: items, height: '500px' }, carouselElement);
            expect(carouselElement.style.height).toEqual('500px');
            carousel.height = '700px';
            carousel.dataBind();
            expect(carouselElement.style.height).toEqual('700px');
        });
        it('animation', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ items: items }, carouselElement);
            expect(carouselElement.classList.contains('e-carousel-slide-animation')).toBe(true);
            carousel.animationEffect = 'Fade';
            carousel.dataBind();
            expect(carouselElement.classList.contains('e-carousel-slide-animation')).toBe(false);
            expect(carouselElement.classList.contains('e-carousel-fade-animation')).toBe(true);
            carousel.animationEffect = 'None';
            carousel.dataBind();
            expect(carouselElement.classList.contains('e-carousel-slide-animation')).toBe(false);
            expect(carouselElement.classList.contains('e-carousel-fade-animation')).toBe(false);
            expect(carouselElement.classList.contains('e-carousel-animation-none')).toBe(true);
            carousel.animationEffect = 'Custom';
            carousel.dataBind();
            expect(carouselElement.classList.contains('e-carousel-slide-animation')).toBe(false);
            expect(carouselElement.classList.contains('e-carousel-fade-animation')).toBe(false);
            expect(carouselElement.classList.contains('e-carousel-animation-none')).toBe(false);
            expect(carouselElement.classList.contains('e-carousel-custom-animation')).toBe(true);
        });
    });

    describe('Keyboard actions', () => {
        let carouselElement: HTMLElement;
        let keyEventArgs: any;
        beforeEach((): void => {
            carouselElement = document.createElement('div');
            carouselElement.id = 'carousel';
            carousel = new Carousel({ animationEffect: 'None', items: items, showIndicators: true }, carouselElement);
            document.body.appendChild(carouselElement);
            jasmine.clock().install();
        });
        afterEach(() => {
            carousel.destroy();
            carousel.element.remove();
            carousel = null;
            jasmine.clock().uninstall();
        });
        it('test case for pressing down arrow', () => {
            const index: number = carousel.selectedIndex;
            expect(index).toEqual(0);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[index + 1].classList.contains('e-active')).toBe(true);
            keyEventArgs = {
                preventDefault: () => { /** */ },
                action: 'moveDown',
                target: carousel.element
            };
            (carousel as any).keyHandler(keyEventArgs);
            expect(carousel.selectedIndex).toEqual(1);
            jasmine.clock().tick(1500);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[index + 1].classList.contains('e-active')).toBe(false);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[2].classList.contains('e-active')).toBe(true);
            carousel.selectedIndex = 4;
            carousel.dataBind();
            keyEventArgs = {
                preventDefault: () => { /** */ },
                action: 'moveDown',
                target: carousel.element
            };
            (carousel as any).keyHandler(keyEventArgs);
            expect(carousel.selectedIndex).toEqual(0);
            carousel.selectedIndex = 4;
            carousel.loop = false;
            carousel.dataBind();
            expect(carousel.selectedIndex).toEqual(4);
            keyEventArgs = {
                preventDefault: () => { /** */ },
                action: 'moveDown',
                target: carousel.element
            };
            (carousel as any).keyHandler(keyEventArgs);
            expect(carousel.selectedIndex).toEqual(4);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[4].classList.contains('e-active')).toBe(true);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[0].classList.contains('e-active')).toBe(false);
        });
        it('test case for pressing right arrow', () => {
            const index: number = carousel.selectedIndex;
            expect(index).toEqual(0);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[index + 1].classList.contains('e-active')).toBe(true);
            keyEventArgs = {
                preventDefault: () => { /** */ },
                action: 'moveRight',
                target: carousel.element
            };
            (carousel as any).keyHandler(keyEventArgs);
            expect(carousel.selectedIndex).toEqual(1);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[2].classList.contains('e-active')).toBe(true);
            carousel.selectedIndex = 4;
            carousel.dataBind();
            keyEventArgs = {
                preventDefault: () => { /** */ },
                action: 'moveRight',
                target: carousel.element
            };
            (carousel as any).keyHandler(keyEventArgs);
            expect(carousel.selectedIndex).toEqual(0);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[1].classList.contains('e-active')).toBe(true);
        });
        it('test case for pressing up arrow', () => {
            const index: number = carousel.selectedIndex;
            expect(index).toEqual(0);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[index + 1].classList.contains('e-active')).toBe(true);
            keyEventArgs = {
                preventDefault: () => { /** */ },
                action: 'moveUp',
                target: carousel.element
            };
            (carousel as any).keyHandler(keyEventArgs);
            expect(carousel.selectedIndex).toEqual(4);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[5].classList.contains('e-active')).toBe(true);
            keyEventArgs = {
                preventDefault: () => { /** */ },
                action: 'moveUp',
                target: carousel.element
            };
            (carousel as any).keyHandler(keyEventArgs);
            expect(carousel.selectedIndex).toEqual(3);
            carousel.selectedIndex = 0;
            carousel.loop = false;
            carousel.dataBind();
            expect(carousel.selectedIndex).toEqual(0);
            keyEventArgs = {
                preventDefault: () => { /** */ },
                action: 'moveUp',
                target: carousel.element
            };
            (carousel as any).keyHandler(keyEventArgs);
            expect(carousel.selectedIndex).toEqual(0);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[0].classList.contains('e-active')).toBe(true);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[4].classList.contains('e-active')).toBe(false);
        });
        it('test case for pressing left arrow', () => {
            const index: number = carousel.selectedIndex;
            expect(index).toEqual(0);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[index + 1].classList.contains('e-active')).toBe(true);
            keyEventArgs = {
                preventDefault: () => { /** */ },
                action: 'moveLeft',
                target: carousel.element
            };
            (carousel as any).keyHandler(keyEventArgs);
            expect(carousel.selectedIndex).toEqual(4);
            jasmine.clock().tick(1500);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[index + 1].classList.contains('e-active')).toBe(false);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[5].classList.contains('e-active')).toBe(true);
            keyEventArgs = {
                preventDefault: () => { /** */ },
                action: 'moveLeft',
                target: carousel.element
            };
            (carousel as any).keyHandler(keyEventArgs);
            expect(carousel.selectedIndex).toEqual(3);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[4].classList.contains('e-active')).toBe(true);
        });
        it('test case for pressing Home & End key', () => {
            const index: number = carousel.selectedIndex;
            expect(index).toEqual(0);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[index + 1].classList.contains('e-active')).toBe(true);
            keyEventArgs = {
                preventDefault: () => { /** */ },
                action: 'end',
                target: carousel.element
            };
            (carousel as any).keyHandler(keyEventArgs);
            expect(carousel.selectedIndex).toEqual(4);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[5].classList.contains('e-active')).toBe(true);
            keyEventArgs = {
                preventDefault: () => { /** */ },
                action: 'home',
                target: carousel.element
            };
            (carousel as any).keyHandler(keyEventArgs);
            expect(carousel.selectedIndex).toEqual(0);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[1].classList.contains('e-active')).toBe(true);
        });
        it('test case for pressing Space key', () => {
            carousel.showPlayButton = true;
            carousel.dataBind();
            const index: number = carousel.selectedIndex;
            expect(carousel.selectedIndex).toEqual(0);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[index + 1].classList.contains('e-active')).toBe(true);
            keyEventArgs = {
                preventDefault: () => { /** */ },
                action: 'space',
                target: carousel.element
            };
            (carousel as any).keyHandler(keyEventArgs);
            expect(carousel.selectedIndex).toEqual(0);
            expect(carouselElement.querySelector('.e-play-icon')).toBeTruthy();
            expect(carouselElement.querySelector('.e-pause-icon')).toBeNull();
            jasmine.clock().tick(5500);
            expect(carousel.selectedIndex).toEqual(0);
            (carousel as any).keyHandler(keyEventArgs);
            expect(carouselElement.querySelector('.e-pause-icon')).toBeTruthy();
            expect(carouselElement.querySelector('.e-play-icon')).toBeNull();
            jasmine.clock().tick(5500);
            expect(carousel.selectedIndex).toEqual(1);
        });
        it('test case for pressing Space key when indicator is focused', () => {
            carousel.showPlayButton = true;
            carousel.dataBind();
            expect(carousel.selectedIndex).toEqual(0);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[1].classList.contains('e-active')).toBe(true);
            const targetIndicator: HTMLElement = carouselElement.querySelectorAll('.e-indicator')[3] as HTMLElement;
            targetIndicator.focus();
            keyEventArgs = {
                preventDefault: () => { /** */ },
                action: 'space',
                target: targetIndicator
            };
            (carousel as any).keyHandler(keyEventArgs);
            expect(carousel.selectedIndex).toEqual(3);
        });
        it('test case for pressing Space key when previous button is focused', () => {
            carousel.slideChanged = () => {
                expect(carousel.selectedIndex).toEqual(4);
                expect(carouselElement.querySelectorAll('.e-carousel-item')[5].classList.contains('e-active')).toBe(true);
            };
            carousel.animationEffect = 'None';
            carousel.dataBind();
            expect(carousel.selectedIndex).toEqual(0);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[1].classList.contains('e-active')).toBe(true);
            const previousButton: HTMLElement = carouselElement.querySelector('.e-previous-button') as HTMLElement;
            previousButton.focus();
            keyEventArgs = {
                preventDefault: () => { /** */ },
                action: 'space',
                target: previousButton
            };
            (carousel as any).keyHandler(keyEventArgs);
        });
        it('test case for pressing Space key when next button is focused', () => {
            carousel.slideChanged = () => {
                expect(carousel.selectedIndex).toEqual(1);
                expect(carouselElement.querySelectorAll('.e-carousel-item')[2].classList.contains('e-active')).toBe(true);
            };
            carousel.animationEffect = 'None';
            carousel.dataBind();
            expect(carousel.selectedIndex).toEqual(0);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[1].classList.contains('e-active')).toBe(true);
            const nextButton: HTMLElement = carouselElement.querySelector('.e-next-button') as HTMLElement;
            nextButton.focus();
            keyEventArgs = {
                preventDefault: () => { /** */ },
                action: 'space',
                target: nextButton
            };
            (carousel as any).keyHandler(keyEventArgs);
        });
    });

    describe('Carousel with single element', () => {
        beforeEach((): void => {
            const carouselElement: HTMLElement = document.createElement('div');
            carouselElement.id = 'carousel';
            document.body.appendChild(carouselElement);
            jasmine.clock().install();
        });
        const items: CarouselItemModel[] = [
            { template: 'base/demos/carousel/images/bird.jpg' }
        ];
        afterEach(() => {
            carousel.destroy();
            carousel.element.remove();
            carousel = null;
            jasmine.clock().uninstall();
        });
        it('test case for only one item is rendered', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ items: items, animationEffect: 'Fade' }, carouselElement);
            expect(carouselElement.querySelector('.e-carousel-items').children.length).toEqual(3);
            expect(carouselElement.querySelector('.e-carousel-navigators').childNodes.length).toEqual(0);
            expect(carouselElement.querySelector('.e-indicator-bars').children.length).toEqual(1);
            expect(carousel.selectedIndex).toEqual(0);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[1].classList.contains('e-active')).toBe(true);
            jasmine.clock().tick(carousel.interval + 1500);
            expect(carousel.selectedIndex).toEqual(0);
        });
        it('test case for no item is rendered', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            const items: CarouselItemModel[] = [];
            carousel = new Carousel({ items: items, animationEffect: 'Fade' }, carouselElement);
            expect(carouselElement.querySelector('.e-carousel-items').children.length).toEqual(0);
            expect(carouselElement.querySelector('.e-carousel-navigators').childNodes.length).toEqual(0);
            expect(carouselElement.querySelector('.e-indicator-bars').children.length).toEqual(0);
            expect(carousel.selectedIndex).toEqual(0);
            jasmine.clock().tick(carousel.interval + 1500);
            expect(carousel.selectedIndex).toEqual(0);
        });
    });

    describe('test case for swiping carousel', () => {
        beforeEach((): void => {
            const carouselElement: HTMLElement = document.createElement('div');
            carouselElement.id = 'carousel';
            document.body.appendChild(carouselElement);
        });
        afterEach(() => {
            carousel.destroy();
            carousel.element.remove();
            carousel = null;
        });
        it('test case for swipe', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ items: items, animationEffect: 'None', swipeMode: CarouselSwipeMode.Mouse }, carouselElement);
            const itemsContainer = carouselElement.querySelector('.e-carousel-items');
            expect(carouselElement.classList.contains('e-swipe')).toBe(true);
            expect(carouselElement.querySelector('.e-carousel-items').childElementCount).toEqual(7);
            carousel.enableTouchSwipe = false;
            carousel.dataBind();
            expect(carouselElement.querySelector('.e-carousel-items').childElementCount).toEqual(7);
            carousel.enableTouchSwipe = true;
            carousel.dataBind();
            expect(carouselElement.querySelectorAll('.e-carousel-item')[1].classList.contains('e-active')).toBe(true);
            triggerMouseEvent(itemsContainer, 'mouseenter');
            triggerMouseEvent(itemsContainer, 'mousedown');
            triggerMouseEvent(itemsContainer, 'mousemove', 900);
            triggerMouseEvent(itemsContainer, 'mouseup');
            expect(carouselElement.querySelectorAll('.e-carousel-item')[1].classList.contains('e-active')).toBe(false);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[5].classList.contains('e-active')).toBe(true);
            triggerMouseEvent(itemsContainer, 'mouseenter');
            triggerMouseEvent(itemsContainer, 'mousedown');
            triggerMouseEvent(itemsContainer, 'mousemove', -900);
            triggerMouseEvent(itemsContainer, 'mouseup');
            expect(carouselElement.querySelectorAll('.e-carousel-item')[5].classList.contains('e-active')).toBe(false);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[1].classList.contains('e-active')).toBe(true);
            triggerMouseEvent(itemsContainer, 'mouseenter');
            triggerMouseEvent(itemsContainer, 'mousedown');
            triggerMouseEvent(itemsContainer, 'mousemove', 200);
            triggerMouseEvent(itemsContainer, 'mouseup');
            expect(carouselElement.querySelectorAll('.e-carousel-item')[1].classList.contains('e-active')).toBe(true);
        });
        it('test case for swipe with datasource', () => {
            document.body.appendChild(itemTemplate);
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ dataSource: carouselDataSource, itemTemplate: '#itemTemplate', animationEffect: 'None', swipeMode: CarouselSwipeMode.Mouse }, carouselElement);
            const itemsContainer = carouselElement.querySelector('.e-carousel-items');
            expect(carouselElement.querySelectorAll('.e-carousel-item').length).toEqual(7);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[1].classList.contains('e-active')).toBe(true);
            triggerMouseEvent(itemsContainer, 'mouseenter');
            triggerMouseEvent(itemsContainer, 'mousedown');
            triggerMouseEvent(itemsContainer, 'mousemove', 900);
            triggerMouseEvent(itemsContainer, 'mouseup');
            expect(carouselElement.querySelectorAll('.e-carousel-item')[1].classList.contains('e-active')).toBe(false);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[5].classList.contains('e-active')).toBe(true);
            triggerMouseEvent(itemsContainer, 'mouseenter');
            triggerMouseEvent(itemsContainer, 'mousedown');
            triggerMouseEvent(itemsContainer, 'mousemove', -900);
            triggerMouseEvent(itemsContainer, 'mouseup');
            expect(carouselElement.querySelectorAll('.e-carousel-item')[5].classList.contains('e-active')).toBe(false);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[1].classList.contains('e-active')).toBe(true);
        });
        it('test case for swipe without loop', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ items: items, animationEffect: 'None', swipeMode: CarouselSwipeMode.Mouse, loop: false }, carouselElement);
            const itemsContainer = carouselElement.querySelector('.e-carousel-items');
            expect(carouselElement.classList.contains('e-swipe')).toBe(true);
            expect(carouselElement.querySelector('.e-carousel-items').childElementCount).toEqual(5);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[0].classList.contains('e-active')).toBe(true);
            triggerMouseEvent(itemsContainer, 'mouseenter');
            triggerMouseEvent(itemsContainer, 'mousedown');
            triggerMouseEvent(itemsContainer, 'mousemove', 900);
            triggerMouseEvent(itemsContainer, 'mouseup');
            expect(carouselElement.querySelectorAll('.e-carousel-item')[0].classList.contains('e-active')).toBe(true);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[4].classList.contains('e-active')).toBe(false);
            triggerMouseEvent(itemsContainer, 'mouseenter');
            triggerMouseEvent(itemsContainer, 'mousedown');
            triggerMouseEvent(itemsContainer, 'mousemove', -900);
            triggerMouseEvent(itemsContainer, 'mouseup');
            expect(carouselElement.querySelectorAll('.e-carousel-item')[0].classList.contains('e-active')).toBe(false);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[1].classList.contains('e-active')).toBe(true);
        });
        it('test case for swipe rtl mode', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ items: items, animationEffect: 'None', swipeMode: CarouselSwipeMode.Mouse, enableRtl: true }, carouselElement);
            const itemsContainer = carouselElement.querySelector('.e-carousel-items');
            expect(carouselElement.classList.contains('e-swipe')).toBe(true);
            expect(carouselElement.querySelector('.e-carousel-items').childElementCount).toEqual(7);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[1].classList.contains('e-active')).toBe(true);
            triggerMouseEvent(itemsContainer, 'mouseenter');
            triggerMouseEvent(itemsContainer, 'mousedown');
            triggerMouseEvent(itemsContainer, 'mousemove', -900);
            triggerMouseEvent(itemsContainer, 'mouseup');
            expect(carouselElement.querySelectorAll('.e-carousel-item')[1].classList.contains('e-active')).toBe(false);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[2].classList.contains('e-active')).toBe(true);
            triggerMouseEvent(itemsContainer, 'mouseenter');
            triggerMouseEvent(itemsContainer, 'mousedown');
            triggerMouseEvent(itemsContainer, 'mousemove', 900);
            triggerMouseEvent(itemsContainer, 'mouseup');
            expect(carouselElement.querySelectorAll('.e-carousel-item')[2].classList.contains('e-active')).toBe(false);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[1].classList.contains('e-active')).toBe(true);
            carousel.loop = false;
            carousel.dataBind();
            triggerMouseEvent(itemsContainer, 'mouseenter');
            triggerMouseEvent(itemsContainer, 'mousedown');
            triggerMouseEvent(itemsContainer, 'mousemove', 900);
            triggerMouseEvent(itemsContainer, 'mouseup');
            expect(carouselElement.querySelectorAll('.e-carousel-item')[0].classList.contains('e-active')).toBe(true);
        });
    });

    describe('EJ2-68892 - test case for data-height attribute', () => {
        beforeEach((): void => {
            const carouselElement: HTMLElement = document.createElement('div');
            carouselElement.id = 'carousel';
            document.body.appendChild(carouselElement);
            jasmine.clock().install();
        });
        afterEach(() => {
            carousel.destroy();
            carousel.element.remove();
            carousel = null;
            jasmine.clock().uninstall();
        });

        it('test case for checking data-height attribute', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ items: items, animationEffect: 'Slide' }, carouselElement);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[1].classList.contains('e-active')).toBe(true);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[2].classList.contains('e-active')).toBe(false);
            expect(carousel.selectedIndex).toEqual(0);
            (carouselElement.querySelector('.e-next-icon') as HTMLElement).click();
            expect(carouselElement.querySelector('.e-carousel-items .e-next').getAttribute('data-slide-height')).toBe('18');
        });
    });

    describe('test case for dynamically changing datasource', () => {
        beforeEach((): void => {
            const carouselElement: HTMLElement = document.createElement('div');
            carouselElement.id = 'carousel';
            document.body.appendChild(carouselElement);
            jasmine.clock().install();
        });
        afterEach(() => {
            carousel.destroy();
            carousel.element.remove();
            carousel = null;
            jasmine.clock().uninstall();
        });
        it('test case changing datasource', () => {
            document.body.appendChild(itemTemplate);
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ dataSource: carouselDataSource, itemTemplate: '#itemTemplate', animationEffect: 'None' }, carouselElement);
            expect(carouselElement.querySelectorAll('.e-carousel-item').length).toEqual(7);
            expect(carouselElement.querySelectorAll('.e-indicator-bar').length).toEqual(5);
            expect(carouselElement.querySelectorAll('.e-indicator-bar')[0].classList.contains('e-active')).toBe(true);
            carousel.dataSource = carouselData;
            carousel.dataBind();
            expect(carouselElement.querySelectorAll('.e-carousel-item').length).toEqual(6);
            expect(carouselElement.querySelectorAll('.e-indicator-bar').length).toEqual(4);
            expect(carouselElement.querySelectorAll('.e-indicator-bar')[0].classList.contains('e-active')).toBe(true);
        });
        it('test case changing index to last element', () => {
            document.body.appendChild(itemTemplate);
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ dataSource: carouselDataSource, itemTemplate: '#itemTemplate', animationEffect: 'None' }, carouselElement);
            expect(carouselElement.querySelectorAll('.e-carousel-item').length).toEqual(7);
            expect(carouselElement.querySelectorAll('.e-indicator-bar').length).toEqual(5);
            expect(carouselElement.querySelectorAll('.e-indicator-bar')[0].classList.contains('e-active')).toBe(true);
            (carouselElement.querySelectorAll('.e-indicator-bar')[4] as HTMLElement).click();
            expect(carouselElement.querySelectorAll('.e-indicator-bar')[4].classList.contains('e-active')).toBe(true);
            carousel.dataSource = carouselData;
            carousel.dataBind();
            expect(carouselElement.querySelectorAll('.e-carousel-item').length).toEqual(6);
            expect(carouselElement.querySelectorAll('.e-indicator-bar').length).toEqual(4);
            expect(carouselElement.querySelectorAll('.e-indicator-bar')[3].classList.contains('e-active')).toBe(true);
        });
    });

    describe('test case for dynamically changing window size', () => {
        beforeEach((): void => {
            const carouselElement: HTMLElement = document.createElement('div');
            carouselElement.id = 'carousel';
            document.body.appendChild(carouselElement);
            jasmine.clock().install();
        });
        afterEach(() => {
            carousel.destroy();
            carousel.element.remove();
            carousel = null;
            jasmine.clock().uninstall();
        });
        it('test case for changing width', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ items: items, animationEffect: 'Slide', autoPlay: false }, carouselElement);
            expect(carousel.width).toEqual('100%');
            carousel.width = '500px';
            (carousel as any).resizeHandler();
            expect(carousel.width).toEqual('500px');
        });
        it('test case for changing window size when loop set to false', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ items: items, animationEffect: 'Slide', loop: false}, carouselElement);
            let itemContainer: HTMLElement = (carousel.element.querySelector('.e-carousel-items') as HTMLElement);
            (carousel as any).resizeHandler();
            expect(itemContainer.style.transform).toEqual('translateX(0px)');
        });
    });

    describe('ES-916474 test case for item with e-active class', () => {
        beforeEach((): void => {
            const carouselElement: HTMLElement = document.createElement('div');
            carouselElement.id = 'carousel';
            document.body.appendChild(carouselElement);
            jasmine.clock().install();
        });
        afterEach(() => {
            carousel.destroy();
            carousel.element.remove();
            carousel = null;
            jasmine.clock().uninstall();
        });
        it('test case for changing slide with an item having e-active class', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            const carouselItems: CarouselItemModel[] = [
                { template: '<div id="Grids"><div class="e-active"></div><div>' },
                { template: 'base/demos/carousel/images/nature.jpg' },
                { template: 'base/demos/carousel/images/night-view.jpg' },
                { template: 'base/demos/carousel/images/sae-view.jpg' },
                { template: 'base/demos/carousel/images/snowfall.jpg' }];
            carousel = new Carousel({ items: carouselItems, animationEffect: 'None', autoPlay: true }, carouselElement);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[1].classList.contains('e-active')).toBe(true);
            jasmine.clock().tick(carousel.interval + 1500);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[1].classList.contains('e-active')).toBe(false);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[2].classList.contains('e-active')).toBe(true);
            jasmine.clock().tick(carousel.interval + 1500);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[2].classList.contains('e-active')).toBe(false);
            expect(carouselElement.querySelectorAll('.e-carousel-item')[3].classList.contains('e-active')).toBe(true);
        });

        it('testing item having e-active class using autoSlide method', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            const carouselItems: CarouselItemModel[] = [
                { template: '<div id="Grids"><div class="e-active"></div><div>' },
                { template: 'base/demos/carousel/images/nature.jpg' },
                { template: 'base/demos/carousel/images/night-view.jpg' },
                { template: 'base/demos/carousel/images/sae-view.jpg' },
                { template: 'base/demos/carousel/images/snowfall.jpg' }];
            carousel = new Carousel({ items: carouselItems, animationEffect: 'None', autoPlay: true }, carouselElement);
            removeClass(carouselElement.querySelectorAll('.e-carousel-item'), 'e-active');
            (carousel as any).autoSlideChange();
            expect(carousel.selectedIndex).toBe(0);
            jasmine.clock().tick(6500);
            expect(carousel.selectedIndex).toBe(1);
        });
    });

    describe('test case for checking inert attribute', () => {
        beforeEach((): void => {
            const carouselElement: HTMLElement = document.createElement('div');
            carouselElement.id = 'carousel';
            document.body.appendChild(carouselElement);
            jasmine.clock().install();
        });
        afterEach(() => {
            carousel.destroy();
            carousel.element.remove();
            carousel = null;
            jasmine.clock().uninstall();
        });
        it('test case for inert attribute', () => {
            const carouselElement: HTMLElement = document.getElementById('carousel');
            carousel = new Carousel({ items: items, animationEffect: 'None' }, carouselElement);
            const carouselItems: NodeListOf<Element> = carouselElement.querySelectorAll('.e-carousel-item');
            expect(carouselItems[1].classList.contains('e-active')).toBe(true);
            expect(carouselItems[1].getAttribute('inert')).toBe(null);
            expect(carouselItems[2].getAttribute('inert')).toBe('true');
            (carouselElement.querySelector('.e-next-icon') as HTMLElement).click();
            jasmine.clock().tick(1500);
            expect(carouselItems[1].getAttribute('inert')).toBe('true');
            expect(carouselItems[2].getAttribute('inert')).toBe(null);
            expect(carouselItems[3].getAttribute('inert')).toBe('true');
        });
    });


    it('memory leak', () => {
        profile.sample();
        const average: number = inMB(profile.averageChange);
        expect(average).toBeLessThan(10);
        const memory: number = inMB(getMemoryProfile());
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
    });
});
