/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, EventHandler, Collection, Property, Event, EmitType, formatUnit, INotifyPropertyChanged, NotifyPropertyChanges, Browser } from '@syncfusion/ej2-base';
import { ChildProperty, addClass, removeClass, setStyleAttribute, attributes, getUniqueID, compile, getInstance, L10n } from '@syncfusion/ej2-base';
import { append, closest, isNullOrUndefined, remove, classList, Touch, SwipeEventArgs, KeyboardEvents, KeyboardEventArgs, BaseEventArgs } from '@syncfusion/ej2-base';
import { Button } from '@syncfusion/ej2-buttons';
import { CarouselModel, CarouselItemModel } from './carousel-model';

// Constant variables
const CLS_CAROUSEL: string = 'e-carousel';
const CLS_ACTIVE: string = 'e-active';
const CLS_RTL: string = 'e-rtl';
const CLS_PARTIAL: string = 'e-partial';
const CLS_SWIPE: string = 'e-swipe';
const CLS_SLIDE_CONTAINER: string = 'e-carousel-slide-container';
const CLS_ITEMS: string = 'e-carousel-items';
const CLS_CLONED: string = 'e-cloned';
const CLS_ITEM: string = 'e-carousel-item';
const CLS_PREVIOUS: string = 'e-previous';
const CLS_NEXT: string = 'e-next';
const CLS_PREV_ICON: string = 'e-previous-icon';
const CLS_NEXT_ICON: string = 'e-next-icon';
const CLS_NAVIGATORS: string = 'e-carousel-navigators';
const CLS_INDICATORS: string = 'e-carousel-indicators';
const CLS_INDICATOR_BARS: string = 'e-indicator-bars';
const CLS_INDICATOR_BAR: string = 'e-indicator-bar';
const CLS_INDICATOR: string = 'e-indicator';
const CLS_ICON: string = 'e-icons';
const CLS_PLAY_PAUSE: string = 'e-play-pause';
const CLS_PLAY_ICON: string = 'e-play-icon';
const CLS_PAUSE_ICON: string = 'e-pause-icon';
const CLS_PREV_BUTTON: string = 'e-previous-button';
const CLS_NEXT_BUTTON: string = 'e-next-button';
const CLS_PLAY_BUTTON: string = 'e-play-button';
const CLS_FLAT: string = 'e-flat';
const CLS_ROUND: string = 'e-round';
const CLS_HOVER_ARROWS: string = 'e-hover-arrows';
const CLS_HOVER: string = 'e-carousel-hover';
const CLS_TEMPLATE: string = 'e-template';
const CLS_SLIDE_ANIMATION: string = 'e-carousel-slide-animation';
const CLS_FADE_ANIMATION: string = 'e-carousel-fade-animation';
const CLS_CUSTOM_ANIMATION: string = 'e-carousel-custom-animation';
const CLS_ANIMATION_NONE: string = 'e-carousel-animation-none';
const CLS_PREV_SLIDE: string = 'e-prev';
const CLS_NEXT_SLIDE: string = 'e-next';
const CLS_TRANSITION_START: string = 'e-transition-start';
const CLS_TRANSITION_END: string = 'e-transition-end';

/**
 * Specifies the direction of previous/next button navigations in carousel.
 * ```props
 * Previous :- To determine the previous direction of carousel item transition.
 * Next :- To determine the next direction of carousel item transition.
 * ```
 */
export type CarouselSlideDirection = 'Previous' | 'Next';

/**
 * Specifies the state of navigation buttons displayed in carousel.
 * ```props
 * Hidden :- Navigation buttons are hidden.
 * Visible :- Navigation buttons are visible.
 * VisibleOnHover :- Navigation buttons are visible only when we hover the carousel.
 * ```
 */
export type CarouselButtonVisibility = 'Hidden' | 'Visible' | 'VisibleOnHover';

/**
 * Specifies the animation effects of carousel slide.
 * ```props
 * None :- The carousel item transition happens without animation.
 * Slide :- The carousel item transition happens with slide animation.
 * Fade :- The Carousel item transition happens with fade animation.
 * Custom :- The Carousel item transition happens with custom animation.
 * ```
 */
export type CarouselAnimationEffect = 'None' | 'Slide' | 'Fade' | 'Custom';

/**
 * Specifies the type of indicators.
 * ```props
 * Default: - Displays the indicators with a bullet design.
 * Dynamic: - Applies a dynamic animation design to the indicators.
 * Fraction: - Displays the slides numerically as indicators.
 * Progress: - Represents the slides using a progress bar design.
 * ```
 */
export type CarouselIndicatorsType = 'Default' | 'Dynamic' | 'Fraction' | 'Progress';

/**
 * Specifies the action (touch & mouse) which enables the slide swiping action in carousel.
 * * Touch - Enables or disables the swiping action in touch interaction.
 * * Mouse - Enables or disables the swiping action in mouse interaction.
 *
 * @aspNumberEnum
 */
export enum CarouselSwipeMode {
    /** Enables or disables the swiping action in touch interaction. */
    Touch = 1 << 0,
    /** Enables or disables the swiping action in mouse interaction. */
    Mouse = 1 << 1
}

/** An interface that holds details when changing the slide. */
export interface SlideChangingEventArgs extends BaseEventArgs {
    /** Specifies the index of current slide. */
    currentIndex: number;
    /** Specifies the element of current slide. */
    currentSlide: HTMLElement;
    /** Specifies the index of slide to be changed. */
    nextIndex: number;
    /** Specifies the element of slide to be changed. */
    nextSlide: HTMLElement;
    /** Specifies whether the slide transition occur through swiping or not. */
    isSwiped: boolean;
    /** Specifies the slide direction in which transition occurs. */
    slideDirection: CarouselSlideDirection;
    /** Specifies whether the slide transition should occur or not. */
    cancel: boolean;
}

/** An interface that holds details once slide change done. */
export interface SlideChangedEventArgs extends BaseEventArgs {
    /** Specifies the index of current slide. */
    currentIndex: number;
    /** Specifies the element of current slide. */
    currentSlide: HTMLElement;
    /** Specifies the index of slide from which it changed. */
    previousIndex: number;
    /** Specifies the element of slide from which it changed. */
    previousSlide: HTMLElement;
    /** Specifies whether the slide transition done through swiping or not. */
    isSwiped: boolean;
    /** Specifies the slide direction in which transition occurred. */
    slideDirection: CarouselSlideDirection;
}

/** Specifies the carousel individual item. */
export class CarouselItem extends ChildProperty<CarouselItem>  {

    /**
     * Accepts single/multiple classes (separated by a space) to be used for individual carousel item customization.
     *
     * @default null
     */
    @Property()
    public cssClass: string;

    /**
     * Accepts the interval duration in milliseconds for individual carousel item transition.
     *
     * @default null
     */
    @Property()
    public interval: number;

    /**
     * Accepts the template for individual carousel item.
     *
     * @default null
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     */
    @Property()
    public template: string | Function;

    /**
     * Accepts HTML attributes/custom attributes to add in individual carousel item.
     *
     * @default null
     */
    @Property()
    public htmlAttributes: Record<string, string>;

}

@NotifyPropertyChanges
export class Carousel extends Component<HTMLElement> implements INotifyPropertyChanged {
    private autoSlideInterval: any;
    private slideItems: any[];
    private touchModule: Touch;
    private keyModule: KeyboardEvents;
    private keyConfigs: Record<string, string>;
    private slideChangedEventArgs: SlideChangedEventArgs;
    private localeObj: L10n;
    private prevPageX: number;
    private initialTranslate: number;
    private itemsContainer: HTMLElement;
    private isSwipe: boolean = false;
    private timeStampStart: number;

    /**
     * Allows defining the collection of carousel item to be displayed on the Carousel.
     *
     * @default []
     */
    @Collection<CarouselItemModel>([], CarouselItem)
    public items: CarouselItemModel[];

    /**
     * Specifies the type of animation effects. The possible values for this property as follows
     * * `None`: The carousel item transition happens without animation.
     * * `Slide`: The carousel item transition happens with slide animation.
     * * `Fade`: The Carousel item transition happens with fade animation.
     * * `Custom`: The Carousel item transition happens with custom animation.
     *
     *  @default 'Slide'
     */
    @Property('Slide')
    public animationEffect: CarouselAnimationEffect;

    /**
     * Accepts the template for previous navigation button.
     *
     * @default null
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     */
    @Property()
    public previousButtonTemplate: string | Function;

    /**
     * Accepts the template for next navigation button.
     *
     * @default null
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     */
    @Property()
    public nextButtonTemplate: string | Function;

    /**
     * Accepts the template for indicator buttons.
     *
     * @default null
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     */
    @Property()
    public indicatorsTemplate: string | Function;

    /**
     * Accepts the template for play/pause button.
     *
     * @default null
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     */
    @Property()
    public playButtonTemplate: string | Function;

    /**
     * Accepts single/multiple classes (separated by a space) to be used for carousel customization.
     *
     * @default null
     */
    @Property()
    public cssClass: string;

    /**
     * Specifies the datasource for the carousel items.
     *
     * @isdatamanager false
     * @default []
     */
    @Property([])
    public dataSource: Record<string, any>[];

    /**
     * Specifies the template option for carousel items.
     *
     * @default null
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     */
    @Property()
    public itemTemplate: string | Function;

    /**
     * Specifies index of the current carousel item.
     *
     * @default 0
     */
    @Property(0)
    public selectedIndex: number;

    /**
     * Specifies the width of the Carousel in pixels/number/percentage. The number value is considered as pixels.
     *
     * @default '100%'
     */
    @Property('100%')
    public width: string | number;

    /**
     * Specifies the height of the Carousel in pixels/number/percentage. The number value is considered as pixels.
     *
     * @default '100%'
     */
    @Property('100%')
    public height: string | number;

    /**
     * Specifies the interval duration in milliseconds for carousel item transition.
     *
     * @default 5000
     */
    @Property(5000)
    public interval: number;

    /**
     * Defines whether the slide transition is automatic or manual.
     *
     * @default true
     */
    @Property(true)
    public autoPlay: boolean;

    /**
     * Defines whether the slide transition gets pause on hover or not.
     *
     * @default true
     */
    @Property(true)
    public pauseOnHover: boolean;

    /**
     * Defines whether the slide transitions loop end or not. When set to false, the transition stops at last slide.
     *
     * @default true
     */
    @Property(true)
    public loop: boolean;

    /**
     * Defines whether to show play button or not.
     *
     * @default false
     */
    @Property(false)
    public showPlayButton: boolean;

    /**
     * Defines whether to enable swipe action in touch devices or not.
     *
     * @default true
     */
    @Property(true)
    public enableTouchSwipe: boolean;

    /**
     * Defines whether to enable keyboard actions or not.
     *
     * * @remarks
     * If any form input component is placed on the carousel slide, interacting with it may cause
     * the left/right arrow keys to navigate to other slides. Disabling keyboard interaction helps
     * prevent this unintended navigation, leading to a smoother user experience.
     *
     * @default true
     */
    @Property(true)
    public allowKeyboardInteraction: boolean;

    /**
     * Defines whether to show the indicator positions or not. The indicator positions allow to know the current slide position of the carousel component.
     *
     * @default true
     */
    @Property(true)
    public showIndicators: boolean;

    /**
     * Specifies the type of indicators. The available values for this property are:
     *
     * * `Default`: Displays the indicators with a bullet design.
     * * `Dynamic`: Applies a dynamic animation design to the indicators.
     * * `Fraction`: Displays the slides numerically as indicators.
     * * `Progress`: Represents the slides using a progress bar design.
     *
     * @default 'Default'
     */
    @Property('Default')
    public indicatorsType: CarouselIndicatorsType;

    /**
     * Defines how to show the previous, next and play pause buttons visibility. The possible values for this property as follows
     * * `Hidden`: Navigation buttons are hidden.
     * * `Visible`: Navigation buttons are visible.
     * * `VisibleOnHover`: Navigation buttons are visible only when we hover the carousel.
     *
     * @default 'Visible'
     */
    @Property('Visible')
    public buttonsVisibility: CarouselButtonVisibility;

    /**
     * Enables active slide with partial previous/next slides.
     *
     * Slide animation only applicable if the partialVisible is enabled.
     *
     * @default false
     */
    @Property(false)
    public partialVisible: boolean;

    /**
     * Specifies whether the slide transition should occur while performing swiping via touch/mouse.
     * The slide swiping is enabled or disabled using bitwise operators. The swiping is disabled using ‘~’ bitwise operator.
     * * Touch - Enables or disables the swiping action in touch interaction.
     * * Mouse - Enables or disables the swiping action in mouse interaction.
     *
     * @default 'Touch'
     * @aspNumberEnum
     */
    @Property(CarouselSwipeMode.Touch)
    public swipeMode: CarouselSwipeMode;

    /**
     * Accepts HTML attributes/custom attributes to add in individual carousel item.
     *
     * @default null
     */
    @Property()
    public htmlAttributes: Record<string, string>;

    /**
     * The event will be fired before the slide change.
     *
     * @event slideChanging
     */
    @Event()
    public slideChanging: EmitType<SlideChangingEventArgs>;

    /**
     * The event will be fired after the slide changed.
     *
     * @event slideChanged
     */
    @Event()
    public slideChanged: EmitType<SlideChangedEventArgs>;

    /**
     * Constructor for creating the Carousel widget
     *
     * @param {CarouselModel} options Accepts the carousel model properties to initiate the rendering
     * @param {string | HTMLElement} element Accepts the DOM element reference
     */
    constructor(options?: CarouselModel, element?: string | HTMLElement) {
        super(options, <HTMLElement | string>element);
    }

    protected getModuleName(): string {
        return CLS_CAROUSEL.replace('e-', '');
    }

    protected getPersistData(): string {
        return this.addOnPersist(['selectedIndex']);
    }

    protected preRender(): void {
        this.keyConfigs = {
            home: 'home',
            end: 'end',
            space: 'space',
            moveLeft: 'leftarrow',
            moveRight: 'rightarrow',
            moveUp: 'uparrow',
            moveDown: 'downarrow'
        };
        const defaultLocale: Record<string, any> = {
            nextSlide: 'Next slide',
            of: 'of',
            pauseSlideTransition: 'Pause slide transition',
            playSlideTransition: 'Play slide transition',
            previousSlide: 'Previous slide',
            slide: 'Slide',
            slideShow: 'Slide show'
        };
        this.localeObj = new L10n(this.getModuleName(), defaultLocale, this.locale);
    }

    protected render(): void {
        this.initialize();
        this.renderSlides();
        this.renderNavigators();
        this.renderPlayButton();
        this.renderIndicators();
        this.applyAnimation();
        this.wireEvents();
    }

    public onPropertyChanged(newProp: CarouselModel, oldProp: CarouselModel): void {
        let target: Element;
        let rtlElement: Element[];
        for (const prop of Object.keys(newProp)) {
            switch (prop) {
            case 'animationEffect':
                this.applyAnimation();
                break;
            case 'cssClass':
                classList(this.element, [newProp.cssClass], [oldProp.cssClass]);
                break;
            case 'selectedIndex':
                this.setActiveSlide(this.selectedIndex, oldProp.selectedIndex > this.selectedIndex ? 'Previous' : 'Next');
                this.autoSlide();
                break;
            case 'htmlAttributes':
                if (!isNullOrUndefined(this.htmlAttributes)) {
                    this.setHtmlAttributes(this.htmlAttributes, this.element);
                }
                break;
            case 'enableTouchSwipe':
                if (this.element.querySelector(`.${CLS_ITEMS}`)) {
                    this.renderTouchActions();
                }
                break;
            case 'loop':
                if (this.loop && isNullOrUndefined(this.autoSlideInterval)) {
                    this.applySlideInterval();
                }
                this.handleNavigatorsActions(this.selectedIndex);
                if (this.partialVisible || !(this.swipeMode === (~CarouselSwipeMode.Touch & ~CarouselSwipeMode.Mouse))) {
                    this.reRenderSlides();
                }
                break;
            case 'allowKeyboardInteraction':
                if (this.keyModule) {
                    this.keyModule.destroy();
                    this.keyModule = null;
                }
                if (newProp.allowKeyboardInteraction) {
                    this.renderKeyboardActions();
                }
                break;
            case 'enableRtl':
                rtlElement = [].slice.call(this.element.querySelectorAll(`.${CLS_PREV_BUTTON},
                .${CLS_NEXT_BUTTON}, .${CLS_PLAY_BUTTON}`));
                rtlElement.push(this.element);
                if (this.enableRtl) {
                    addClass(rtlElement, CLS_RTL);
                } else {
                    removeClass(rtlElement, CLS_RTL);
                }
                if (this.partialVisible || !(this.swipeMode === (~CarouselSwipeMode.Touch & ~CarouselSwipeMode.Mouse))) {
                    const cloneCount: number = this.loop ? this.getNumOfItems() : 0;
                    const slideWidth: number = this.itemsContainer.firstElementChild.clientWidth;
                    this.itemsContainer.style.transform = this.getTranslateX(slideWidth, this.selectedIndex + cloneCount);
                }
                break;
            case 'buttonsVisibility':
                target = this.element.querySelector(`.${CLS_NAVIGATORS}`);
                if (target) {
                    switch (this.buttonsVisibility) {
                    case 'Hidden':
                        this.resetTemplates(['previousButtonTemplate', 'nextButtonTemplate']);
                        remove(target);
                        break;
                    case 'VisibleOnHover':
                        addClass([].slice.call(target.childNodes), CLS_HOVER_ARROWS);
                        break;
                    case 'Visible':
                        removeClass([].slice.call(target.childNodes), CLS_HOVER_ARROWS);
                        break;
                    }
                } else {
                    this.renderNavigators();
                    this.renderPlayButton();
                }
                break;
            case 'width':
                setStyleAttribute(this.element, { 'width': formatUnit(this.width) });
                break;
            case 'height':
                setStyleAttribute(this.element, { 'height': formatUnit(this.height) });
                break;
            case 'autoPlay':
                if (this.showPlayButton && isNullOrUndefined(this.playButtonTemplate)) {
                    this.playButtonClickHandler(null, true);
                }
                this.autoSlide();
                break;
            case 'interval':
                this.autoSlide();
                break;
            case 'showIndicators':
            case 'indicatorsType':
                target = this.element.querySelector(`.${CLS_INDICATORS}`);
                if (target) {
                    this.resetTemplates(['indicatorsTemplate']);
                    remove(target);
                }
                this.renderIndicators();
                break;
            case 'showPlayButton':
                target = this.element.querySelector(`.${CLS_PLAY_PAUSE}`);
                if (!this.showPlayButton && target) {
                    remove(target);
                    this.resetTemplates(['playButtonTemplate']);
                }
                this.renderPlayButton();
                break;
            case 'items':
            case 'dataSource': {
                const selectedData: Record<string, any>[] | CarouselItem[] = prop === 'dataSource' ? this.dataSource : this.items;
                if (!isNullOrUndefined(selectedData) && selectedData.length > 0 && this.selectedIndex >= selectedData.length) {
                    this.setActiveSlide(selectedData.length - 1, 'Previous');
                    this.autoSlide();
                }
                this.reRenderSlides();
                this.reRenderIndicators();
                break;
            }
            case 'partialVisible':
                if (this.partialVisible) {
                    addClass([this.element], CLS_PARTIAL);
                } else {
                    removeClass([this.element], CLS_PARTIAL);
                }
                this.reRenderSlides();
                break;
            case 'swipeMode':
                EventHandler.remove(this.element, 'mousedown touchstart', this.swipeStart);
                EventHandler.remove(this.element, 'mousemove touchmove', this.swiping);
                EventHandler.remove(this.element, 'mouseup touchend', this.swipStop);
                this.swipeModehandlers();
                this.reRenderSlides();
                break;
            }
        }
    }

    private reRenderSlides(): void {
        const target: Element = this.element.querySelector(`.${CLS_ITEMS}`);
        if (target) {
            this.resetTemplates(['itemTemplate']);
            remove(target);
        }
        this.renderSlides();
    }

    private reRenderIndicators(): void {
        const target: Element = this.element.querySelector(`.${CLS_INDICATORS}`);
        if (target) {
            this.resetTemplates(['indicatorsTemplate']);
            remove(target);
        }
        this.renderIndicators();
    }

    private initialize(): void {
        const carouselClasses: string[] = [];
        carouselClasses.push(CLS_CAROUSEL);
        if (this.cssClass) {
            carouselClasses.push(this.cssClass);
        }
        if (this.enableRtl) {
            carouselClasses.push(CLS_RTL);
        }
        if (this.partialVisible) {
            carouselClasses.push(CLS_PARTIAL);
        }
        if (!(this.swipeMode === (~CarouselSwipeMode.Touch & ~CarouselSwipeMode.Mouse))) {
            carouselClasses.push(CLS_SWIPE);
        }
        addClass([this.element], carouselClasses);
        setStyleAttribute(this.element, { 'width': formatUnit(this.width), 'height': formatUnit(this.height) });
        attributes(this.element, { 'role': 'group', 'aria-roledescription': 'carousel', 'aria-label': this.localeObj.getConstant('slideShow') });
        if (!isNullOrUndefined(this.htmlAttributes)) {
            this.setHtmlAttributes(this.htmlAttributes, this.element);
        }
    }

    private renderSlides(): void {
        let slideContainer: HTMLElement = this.element.querySelector('.' + CLS_SLIDE_CONTAINER);
        if (!slideContainer) {
            slideContainer = this.createElement('div', { className: CLS_SLIDE_CONTAINER, attrs: { 'tabindex': '0', 'role': 'tabpanel' } });
            this.element.appendChild(slideContainer);
        }
        this.itemsContainer = this.createElement('div', { className: CLS_ITEMS, attrs: { 'aria-live': this.autoPlay ? 'off' : 'polite' } });
        slideContainer.appendChild(this.itemsContainer);
        const numOfItems: number = this.getNumOfItems();
        if (numOfItems > 0 && this.loop) {
            if (this.items.length > 0) {
                this.items.slice(-numOfItems).forEach((item: CarouselItemModel, index: number) => {
                    this.renderSlide(item, item.template, index, this.itemsContainer, true);
                });
            }
            else if (!isNullOrUndefined(this.dataSource) && this.dataSource.length > 0) {
                this.dataSource.slice(-numOfItems).forEach((item: Record<string, any>, index: number) => {
                    this.renderSlide(item, this.itemTemplate, index, this.itemsContainer, true);
                });
            }
        }
        if (this.items.length > 0) {
            this.slideItems = this.items as Record<string, any>[];
            this.items.forEach((item: CarouselItemModel, index: number) => {
                this.renderSlide(item, item.template, index, this.itemsContainer);
            });
        } else if (!isNullOrUndefined(this.dataSource) && this.dataSource.length > 0) {
            this.slideItems = this.dataSource;
            this.dataSource.forEach((item: Record<string, any>, index: number) => {
                this.renderSlide(item, this.itemTemplate, index, this.itemsContainer);
            });
        }
        if (numOfItems > 0 && this.loop) {
            if (this.items.length > 0) {
                this.items.slice(0, numOfItems).forEach((item: CarouselItemModel, index: number) => {
                    this.renderSlide(item, item.template, index, this.itemsContainer, true);
                });
            }
            else if (!isNullOrUndefined(this.dataSource) && this.dataSource.length > 0) {
                this.dataSource.slice(0, numOfItems).forEach((item: Record<string, any>, index: number) => {
                    this.renderSlide(item, this.itemTemplate, index, this.itemsContainer, true);
                });
            }
        }
        this.renderTemplates();
        this.itemsContainer.style.setProperty('--carousel-items-count', `${this.itemsContainer.children.length}`);
        const slideWidth: number = isNullOrUndefined(this.itemsContainer.firstElementChild) ? 0 :
            this.itemsContainer.firstElementChild.clientWidth;
        this.itemsContainer.style.transitionProperty = 'none';
        const cloneCount: number = this.loop ? numOfItems : 0;
        this.itemsContainer.style.transform = this.getTranslateX(slideWidth, this.selectedIndex + cloneCount);
        this.autoSlide();
        this.renderTouchActions();
        this.renderKeyboardActions();
    }

    private getTranslateX(slideWidth: number, count: number = 1): string {
        return this.enableRtl ? `translateX(${(slideWidth) * (count)}px)` :
            `translateX(${-(slideWidth) * (count)}px)`;
    }

    private renderSlide(item: Record<string, any>, itemTemplate: string | Function, index: number, container: HTMLElement,
                        isClone: boolean = false): void {
        const itemEle: HTMLElement = this.createElement('div', {
            id: getUniqueID('carousel_item'),
            className: `${CLS_ITEM} ${item.cssClass ? item.cssClass : ''} ${this.selectedIndex === index && !isClone ? CLS_ACTIVE : ''}`,
            attrs: {
                'aria-hidden': this.selectedIndex === index && !isClone ? 'false' : 'true', 'data-index': index.toString(),
                'role': 'group', 'aria-roledescription': 'slide'
            }
        });
        if (isClone) {
            itemEle.classList.add(CLS_CLONED);
        }
        if (!(this.selectedIndex === index && !isClone)) {
            itemEle.setAttribute('inert', 'true');
        }
        if (!isNullOrUndefined(item.htmlAttributes)) {
            this.setHtmlAttributes(item.htmlAttributes, itemEle);
        }
        const templateId: string = this.element.id + '_template';
        const template: HTMLElement[] = this.templateParser(itemTemplate)(item, this, 'itemTemplate', templateId, false);
        append(template, itemEle);
        container.appendChild(itemEle);
    }

    private renderNavigators(): void {
        if (this.buttonsVisibility === 'Hidden') {
            return;
        }
        const navigators: HTMLElement = this.createElement('div', { className: CLS_NAVIGATORS });
        const itemsContainer: HTMLElement = this.element.querySelector(`.${CLS_SLIDE_CONTAINER}`) as HTMLElement;
        itemsContainer.insertAdjacentElement('afterend', navigators);
        if (!isNullOrUndefined(this.slideItems) && this.slideItems.length > 1) {
            this.renderNavigatorButton('Previous');
            this.renderNavigatorButton('Next');
        }
        this.renderTemplates();
    }

    private renderNavigatorButton(direction: CarouselSlideDirection): void {
        const buttonContainer: HTMLElement = this.createElement('div', {
            className: (direction === 'Previous' ? CLS_PREVIOUS : CLS_NEXT) + ' ' + (this.buttonsVisibility === 'VisibleOnHover' ? CLS_HOVER_ARROWS : '')
        });
        if (direction === 'Previous' && this.previousButtonTemplate) {
            addClass([buttonContainer], CLS_TEMPLATE);
            const templateId: string = this.element.id + '_previousButtonTemplate';
            const template: HTMLElement[] = this.templateParser(this.previousButtonTemplate)({ type: 'Previous' }, this, 'previousButtonTemplate', templateId, false);
            append(template, buttonContainer);
        } else if (direction === 'Next' && this.nextButtonTemplate) {
            addClass([buttonContainer], CLS_TEMPLATE);
            const templateId: string = this.element.id + '_nextButtonTemplate';
            const template: HTMLElement[] = this.templateParser(this.nextButtonTemplate)({ type: 'Next' }, this, 'nextButtonTemplate', templateId, false);
            append(template, buttonContainer);
        } else {
            const button: HTMLElement = this.createElement('button', {
                attrs: { 'aria-label': this.localeObj.getConstant(direction === 'Previous' ? 'previousSlide' : 'nextSlide'), 'type': 'button' }
            });
            const buttonObj: Button = new Button({
                cssClass: CLS_FLAT + ' ' + CLS_ROUND + ' ' + (direction === 'Previous' ? CLS_PREV_BUTTON : CLS_NEXT_BUTTON),
                iconCss: CLS_ICON + ' ' + (direction === 'Previous' ? CLS_PREV_ICON : CLS_NEXT_ICON),
                enableRtl: this.enableRtl,
                disabled: !this.loop && this.selectedIndex === (direction === 'Previous' ? 0 : this.slideItems.length - 1)
            });
            buttonObj.appendTo(button);
            buttonContainer.appendChild(button);
        }
        this.element.querySelector('.' + CLS_NAVIGATORS).appendChild(buttonContainer);
        EventHandler.add(buttonContainer, 'click', this.navigatorClickHandler, this);
    }

    private renderPlayButton(): void {
        if (isNullOrUndefined(this.slideItems) || this.buttonsVisibility === 'Hidden' || !this.showPlayButton || this.slideItems.length <= 1) {
            return;
        }
        const playPauseWrap: HTMLElement = this.createElement('div', {
            className: CLS_PLAY_PAUSE + ' ' + (this.buttonsVisibility === 'VisibleOnHover' ? CLS_HOVER_ARROWS : '')
        });
        if (this.playButtonTemplate) {
            addClass([playPauseWrap], CLS_TEMPLATE);
            const templateId: string = this.element.id + '_playButtonTemplate';
            const template: HTMLElement[] = this.templateParser(this.playButtonTemplate)({}, this, 'playButtonTemplate', templateId, false);
            append(template, playPauseWrap);
        } else {
            const playButton: HTMLElement = this.createElement('button', {
                attrs: { 'aria-label': this.localeObj.getConstant(this.autoPlay ? 'pauseSlideTransition' : 'playSlideTransition'), 'type': 'button' }
            });
            const isLastSlide: boolean = this.selectedIndex === this.slideItems.length - 1 && !this.loop;
            const buttonObj: Button = new Button({
                cssClass: CLS_FLAT + ' ' + CLS_ROUND + ' ' + CLS_PLAY_BUTTON,
                iconCss: CLS_ICON + ' ' + (this.autoPlay && !isLastSlide ? CLS_PAUSE_ICON : CLS_PLAY_ICON),
                isToggle: true,
                enableRtl: this.enableRtl
            });
            if (isLastSlide) {
                this.setProperties({ autoPlay: false }, true);
                playButton.setAttribute('aria-label', this.localeObj.getConstant('playSlideTransition'));
                this.itemsContainer.setAttribute('aria-live', 'polite');
            }
            buttonObj.appendTo(playButton);
            playPauseWrap.appendChild(playButton);
        }
        const navigators: Element = this.element.querySelector(`.${CLS_NAVIGATORS}`);
        navigators.insertBefore(playPauseWrap, navigators.lastElementChild);
        this.renderTemplates();
        EventHandler.add(playPauseWrap, 'click', this.playButtonClickHandler, this);
    }

    private renderIndicators(): void {
        if (!this.showIndicators || isNullOrUndefined(this.indicatorsType)) {
            return;
        }
        let indicatorClass: string = 'e-default';
        if (!this.indicatorsTemplate) {
            indicatorClass = `e-${this.indicatorsType.toLowerCase()}`;
        }
        const indicatorWrap: HTMLElement = this.createElement('div', { className: `${CLS_INDICATORS} ${indicatorClass}` });
        const indicatorBars: HTMLElement = this.createElement('div', { className: CLS_INDICATOR_BARS });
        indicatorWrap.appendChild(indicatorBars);
        let progress: HTMLElement;
        if (this.slideItems) {
            switch (this.indicatorsType) {
            case 'Fraction':
                if (this.indicatorsTemplate) {
                    this.renderIndicatorTemplate(indicatorBars, this.selectedIndex + 1);
                } else {
                    indicatorBars.innerText = `${this.selectedIndex + 1} / ${this.slideItems.length}`;
                }
                break;
            case 'Progress':
                if (this.indicatorsTemplate) {
                    this.renderIndicatorTemplate(indicatorBars, this.selectedIndex + 1);
                }
                else {
                    progress = this.createElement('div', { className: CLS_INDICATOR_BAR });
                    progress.style.setProperty('--carousel-items-current', `${this.selectedIndex + 1}`);
                    progress.style.setProperty('--carousel-items-count', `${this.slideItems.length}`);
                    indicatorBars.appendChild(progress);
                }
                break;
            case 'Default':
            case 'Dynamic':
                this.slideItems.forEach((item: Record<string, any>, index: number) => {
                    const indicatorBar: HTMLElement = this.createElement('div', {
                        className: CLS_INDICATOR_BAR + ' ' + (this.selectedIndex === index ? CLS_ACTIVE : this.selectedIndex - 1 === index ? CLS_PREV_SLIDE : this.selectedIndex + 1 === index ? CLS_NEXT_SLIDE : ''),
                        attrs: { 'data-index': index.toString(), 'aria-current': this.selectedIndex === index ? 'true' : 'false' }
                    });
                    indicatorBar.style.setProperty('--carousel-items-current', `${this.selectedIndex}`);
                    if (this.indicatorsTemplate) {
                        this.renderIndicatorTemplate(indicatorBar, index);
                    } else if (this.indicatorsType === 'Default') {
                        const indicator: HTMLElement = this.createElement('button', { className: CLS_INDICATOR, attrs: { 'type': 'button', 'aria-label': this.localeObj.getConstant('slide') + ' ' + (index + 1) + ' ' + this.localeObj.getConstant('of') + ' ' + this.slideItems.length } });
                        indicatorBar.appendChild(indicator);
                        indicator.appendChild(this.createElement('div', {}));
                        const buttonObj: Button = new Button({ cssClass: 'e-flat e-small' });
                        buttonObj.appendTo(indicator);
                    }
                    indicatorBars.appendChild(indicatorBar);
                    if (this.indicatorsType === 'Default') {
                        EventHandler.add(indicatorBar, 'click', this.indicatorClickHandler, this);
                    }
                });
                break;
            }
        }
        this.element.appendChild(indicatorWrap);
    }

    private renderIndicatorTemplate(indicatorBar: HTMLElement, index: number = 0): void {
        addClass([indicatorBar], CLS_TEMPLATE);
        const templateId: string = this.element.id + '_indicatorsTemplate';
        const template: HTMLElement[] = this.templateParser(this.indicatorsTemplate)({ index: index, selectedIndex: this.selectedIndex }, this, 'indicatorsTemplate', templateId, false);
        append(template, indicatorBar);
    }

    private renderKeyboardActions(): void {
        if (!this.allowKeyboardInteraction) {
            return;
        }
        this.keyModule = new KeyboardEvents(this.element, { keyAction: this.keyHandler.bind(this), keyConfigs: this.keyConfigs });
    }

    private renderTouchActions(): void {
        this.touchModule = new Touch(this.element, { swipe: this.swipeHandler.bind(this) });
    }

    private applyAnimation(): void {
        removeClass([this.element], [CLS_CUSTOM_ANIMATION, CLS_FADE_ANIMATION, CLS_SLIDE_ANIMATION, CLS_ANIMATION_NONE]);
        switch (this.animationEffect) {
        case 'Slide':
            addClass([this.element], CLS_SLIDE_ANIMATION);
            break;
        case 'Fade':
            addClass([this.element], CLS_FADE_ANIMATION);
            break;
        case 'None':
            addClass([this.element], CLS_ANIMATION_NONE);
            break;
        case 'Custom':
            addClass([this.element], CLS_CUSTOM_ANIMATION);
            break;
        }
    }

    private autoSlide(): void {
        if (isNullOrUndefined(this.slideItems) || this.slideItems.length <= 1) {
            return;
        }
        this.resetSlideInterval();
        this.applySlideInterval();
    }

    private autoSlideChange(): void {
        const activeSlide: HTMLElement | null = this.element.querySelector(`.${CLS_ITEM}.${CLS_ACTIVE}`)
            || this.element.querySelector(`.${CLS_INDICATORS} .${CLS_ACTIVE}`) as HTMLElement;
        if (isNullOrUndefined(activeSlide)) { return; }
        const activeIndex: number = parseInt(activeSlide.dataset.index, 10);
        if (!this.loop && activeIndex === this.slideItems.length - 1) {
            this.resetSlideInterval();
        } else {
            const index: number = (activeIndex + 1) % this.slideItems.length;
            if (!this.element.classList.contains(CLS_HOVER)) {
                this.setActiveSlide(index, 'Next');
            }
            this.autoSlide();
        }
    }

    private applySlideInterval(): void {
        if (!this.autoPlay || this.element.classList.contains(CLS_HOVER)) {
            return;
        }
        let itemInterval: number = this.interval;
        if (this.items.length > 0 && !isNullOrUndefined(this.items[this.selectedIndex || 0].interval)) {
            itemInterval = this.items[this.selectedIndex || 0].interval;
        }
        this.autoSlideInterval = setInterval(() => this.autoSlideChange(), itemInterval);
    }

    private resetSlideInterval(): void {
        clearInterval(this.autoSlideInterval);
        this.autoSlideInterval = null;
    }

    private getSlideIndex(direction: CarouselSlideDirection): number {
        let currentIndex: number = this.selectedIndex || 0;
        if (direction === 'Previous') {
            currentIndex--;
            if (currentIndex < 0) {
                currentIndex = this.slideItems.length - 1;
            }
        } else {
            currentIndex++;
            if (currentIndex === this.slideItems.length) {
                currentIndex = 0;
            }
        }
        return currentIndex;
    }

    private setActiveSlide(currentIndex: number, direction: CarouselSlideDirection, isSwiped: boolean = false): void {
        if (this.element.querySelectorAll(`.${CLS_ITEM}.${CLS_PREV_SLIDE},.${CLS_ITEM}.${CLS_NEXT_SLIDE}`).length > 0) {
            return;
        }
        currentIndex = isNullOrUndefined(currentIndex) ? 0 : currentIndex;
        const allSlides: HTMLElement[] = [].slice.call(this.element.querySelectorAll(`.${CLS_ITEM}:not(.e-cloned)`));
        const activeSlide: HTMLElement = this.element.querySelector(`.${CLS_ITEM}.${CLS_ACTIVE}`);
        if (isNullOrUndefined(activeSlide) && this.showIndicators) {
            const activeIndicator: HTMLElement = this.element.querySelector(`.${CLS_INDICATOR_BAR}.${CLS_ACTIVE}`) as HTMLElement;
            const activeIndex: number = parseInt(activeIndicator.dataset.index, 10);
            addClass([allSlides[parseInt(activeIndex.toString(), 10)]], CLS_ACTIVE);
            return;
        } else if (isNullOrUndefined(activeSlide)) {
            addClass([allSlides[parseInt(currentIndex.toString(), 10)]], CLS_ACTIVE);
            return;
        }
        const activeIndex: number = parseInt(activeSlide.dataset.index, 10);
        const currentSlide: HTMLElement = allSlides[parseInt(currentIndex.toString(), 10)];
        const eventArgs: SlideChangingEventArgs = {
            currentIndex: activeIndex,
            nextIndex: currentIndex,
            currentSlide: activeSlide,
            nextSlide: currentSlide,
            slideDirection: direction,
            isSwiped: isSwiped,
            cancel: false
        };
        this.trigger('slideChanging', eventArgs, (args: SlideChangingEventArgs) => {
            if (args.cancel) {
                return;
            }
            this.setProperties({ selectedIndex: currentIndex }, true);
            attributes(args.currentSlide, { 'aria-hidden': 'true' });
            args.currentSlide.setAttribute('inert', 'true');
            attributes(args.nextSlide, { 'aria-hidden': 'false' });
            args.nextSlide.removeAttribute('inert');
            this.refreshIndicators(activeIndex, currentIndex);
            this.slideChangedEventArgs = {
                currentIndex: args.nextIndex,
                previousIndex: args.currentIndex,
                currentSlide: args.nextSlide,
                previousSlide: args.currentSlide,
                slideDirection: direction,
                isSwiped: isSwiped
            };
            const slideWidth: number = allSlides[parseInt(currentIndex.toString(), 10)].clientWidth;
            const numOfItems: number = this.getNumOfItems();
            if (!this.isSwipe) {
                this.itemsContainer.style.transitionDuration = '0.6s';
            }
            this.isSwipe = false;
            if ((this.animationEffect === 'Fade')) {
                this.itemsContainer.classList.add('e-fade-in-out');
            } else {
                this.itemsContainer.style.transitionProperty = 'transform';
            }
            if (this.loop) {
                if (this.slideChangedEventArgs.currentIndex === 0 && this.slideChangedEventArgs.slideDirection === 'Next') {
                    this.itemsContainer.style.transform = this.getTranslateX(slideWidth, allSlides.length + numOfItems);
                } else if (this.slideChangedEventArgs.currentIndex === this.slideItems.length - 1 && this.slideChangedEventArgs.slideDirection === 'Previous') {
                    this.itemsContainer.style.transform = this.partialVisible ? this.getTranslateX(slideWidth) : 'translateX(0px)';
                } else {
                    this.itemsContainer.style.transform = this.getTranslateX(slideWidth, currentIndex + numOfItems);
                }
            } else {
                this.itemsContainer.style.transform = this.getTranslateX(slideWidth, currentIndex);
            }
            if (this.animationEffect === 'Slide') {
                if (direction === 'Previous') {
                    addClass([args.nextSlide], CLS_PREV_SLIDE);
                    args.nextSlide.setAttribute('data-slide-height', args.nextSlide.offsetHeight.toString());
                    addClass([args.currentSlide, args.nextSlide], CLS_TRANSITION_END);
                } else {
                    addClass([args.nextSlide], CLS_NEXT_SLIDE);
                    args.nextSlide.setAttribute('data-slide-height', args.nextSlide.offsetHeight.toString());
                    addClass([args.currentSlide, args.nextSlide], CLS_TRANSITION_START);
                }
            } else if (this.animationEffect === 'Fade') {
                removeClass([args.currentSlide], CLS_ACTIVE);
                addClass([args.nextSlide], CLS_ACTIVE);
            } else if (this.animationEffect === 'Custom') {
                if (direction === 'Previous') {
                    addClass([args.nextSlide], CLS_NEXT_SLIDE);
                    addClass([args.currentSlide], CLS_PREV_SLIDE);
                } else {
                    addClass([args.currentSlide], CLS_PREV_SLIDE);
                    addClass([args.nextSlide], CLS_NEXT_SLIDE);
                }
            } else {
                this.onTransitionEnd();
            }
            this.handleNavigatorsActions(currentIndex);
        });
    }

    private onTransitionEnd(): void {
        removeClass(this.element.querySelectorAll(`.${CLS_ITEMS}`), 'e-fade-in-out');
        const numOfItems: number = this.getNumOfItems();
        if (this.slideChangedEventArgs) {
            this.itemsContainer.style.transitionProperty = 'none';
            if (this.loop && (this.slideChangedEventArgs.currentIndex === 0 && this.slideChangedEventArgs.slideDirection === 'Next' ||
                this.slideChangedEventArgs.currentIndex === this.slideItems.length - 1 && this.slideChangedEventArgs.slideDirection === 'Previous')) {
                const slideWidth: number = this.slideChangedEventArgs.currentSlide.clientWidth;
                this.itemsContainer.style.transform = this.getTranslateX(slideWidth, this.slideChangedEventArgs.currentIndex + numOfItems);
            }
            addClass([this.slideChangedEventArgs.currentSlide], CLS_ACTIVE);
            removeClass([this.slideChangedEventArgs.previousSlide], CLS_ACTIVE);
            this.trigger('slideChanged', this.slideChangedEventArgs, () => {
                removeClass(this.element.querySelectorAll(`.${CLS_ITEM}`), [CLS_PREV_SLIDE, CLS_NEXT_SLIDE, CLS_TRANSITION_START, CLS_TRANSITION_END]);
                this.slideChangedEventArgs = null;
            });
        }
    }

    private refreshIndicators(activeIndex: number, currentIndex: number): void {
        const slideIndicator: HTMLElement = this.element.querySelector(`.${CLS_INDICATOR_BARS}`);
        if (isNullOrUndefined(slideIndicator)) { return; }
        const indicators: HTMLElement[] = [].slice.call(slideIndicator.childNodes);
        switch (this.indicatorsType) {
        case 'Default':
        case 'Dynamic':
            attributes(indicators[parseInt(activeIndex.toString(), 10)], { 'aria-current': 'false' });
            attributes(indicators[parseInt(currentIndex.toString(), 10)], { 'aria-current': 'true' });
            removeClass(indicators, [CLS_ACTIVE, CLS_PREV_SLIDE, CLS_NEXT_SLIDE]);
            addClass([indicators[parseInt(currentIndex.toString(), 10)]], CLS_ACTIVE);
            if (indicators[currentIndex - 1]) {
                addClass([indicators[currentIndex - 1]], CLS_PREV_SLIDE);
            }
            if (indicators[currentIndex + 1]) {
                addClass([indicators[currentIndex + 1]], CLS_NEXT_SLIDE);
            }
            indicators.forEach((item: HTMLElement) => item.style.setProperty('--carousel-items-current', `${this.selectedIndex}`));
            break;
        case 'Fraction':
            if (this.indicatorsTemplate) {
                if (slideIndicator.children.length > 0) {
                    slideIndicator.removeChild(slideIndicator.firstElementChild);
                }
                this.renderIndicatorTemplate(slideIndicator, currentIndex + 1);
            }
            else {
                slideIndicator.innerText = `${this.selectedIndex + 1} / ${this.slideItems.length}`;
            }
            break;
        case 'Progress':
            if (this.indicatorsTemplate) {
                if (slideIndicator.children.length > 0) {
                    slideIndicator.removeChild(slideIndicator.firstElementChild);
                }
                this.renderIndicatorTemplate(slideIndicator, currentIndex + 1);
            }
            else {
                (slideIndicator.firstElementChild as HTMLElement).style.setProperty('--carousel-items-current', `${this.selectedIndex + 1}`);
            }
            break;
        }
    }

    private setHtmlAttributes(attribute: Record<string, string>, element: HTMLElement): void {
        const keys: string[] = Object.keys(attribute);
        for (const key of keys) {
            if (key === 'class') {
                addClass([element], attribute[`${key}`]);
            } else {
                element.setAttribute(key, attribute[`${key}`]);
            }
        }
    }

    private templateParser(template: string | Function): Function {
        if (template) {
            try {
                if (typeof template !== 'function' && document.querySelectorAll(template).length) {
                    return compile(document.querySelector(template).innerHTML.trim());
                } else {
                    return compile(template);
                }
            } catch (error) {
                return compile(template);
            }
        }
        return undefined;
    }

    private getNavigatorState(target: HTMLElement, isPrevious: boolean): boolean {
        const button: HTMLElement = target.querySelector(`.${isPrevious ? CLS_PREV_BUTTON : CLS_NEXT_BUTTON}`) as HTMLElement;
        if (button) {
            const buttonObj: Button = getInstance(button, Button) as Button;
            return buttonObj.disabled;
        }
        return false;
    }

    private navigatorClickHandler(e: Event): void {
        const target: HTMLElement = e.currentTarget as HTMLElement;
        const isDisabled: boolean = this.getNavigatorState(target, target.classList.contains(CLS_PREVIOUS));
        if (isDisabled) { return; }
        const direction: CarouselSlideDirection = target.classList.contains(CLS_PREVIOUS) ? 'Previous' : 'Next';
        this.setActiveSlide(this.getSlideIndex(direction), direction);
        this.autoSlide();
    }

    private indicatorClickHandler(e: Event): void {
        const target: HTMLElement = closest(e.target as Element, `.${CLS_INDICATOR_BAR}`) as HTMLElement;
        const index: number = parseInt(target.dataset.index, 10);
        if (this.selectedIndex !== index) {
            this.setActiveSlide(index, this.selectedIndex > index ? 'Previous' : 'Next');
            this.autoSlide();
        }
    }

    private playButtonClickHandler(e: Event, isPropertyChange: boolean = false): void {
        const playButton: HTMLElement = this.element.querySelector(`.${CLS_PLAY_BUTTON}`) as HTMLElement;
        if (playButton) {
            const buttonObj: Button = getInstance(playButton, Button) as Button;
            if (!isPropertyChange) {
                this.setProperties({ autoPlay: !this.autoPlay }, true);
            }
            playButton.setAttribute('aria-label', this.localeObj.getConstant(this.autoPlay ? 'pauseSlideTransition' : 'playSlideTransition'));
            buttonObj.iconCss = CLS_ICON + ' ' + (this.autoPlay ? CLS_PAUSE_ICON : CLS_PLAY_ICON);
            buttonObj.dataBind();
            this.itemsContainer.setAttribute('aria-live', this.autoPlay ? 'off' : 'polite');
            if (this.autoPlay && !this.loop && this.selectedIndex === this.slideItems.length - 1) {
                this.setActiveSlide(0, 'Next');
            }
            this.autoSlide();
        }
    }

    private keyHandler(e: KeyboardEventArgs): void {
        if (!this.allowKeyboardInteraction) { return; }
        let direction: CarouselSlideDirection;
        let slideIndex: number;
        let isSlideTransition: boolean = false;
        const target: HTMLElement = e.target as HTMLElement;
        e.preventDefault();
        switch (e.action) {
        case 'space':
            if (this.showIndicators && target.classList.contains(CLS_INDICATOR)) {
                target.click();
            } else if (target.classList.contains(CLS_CAROUSEL) || target.classList.contains(CLS_PLAY_BUTTON)) {
                this.playButtonClickHandler(e);
            } else if (target.classList.contains(CLS_NEXT_BUTTON)) {
                this.next();
            } else if (target.classList.contains(CLS_PREV_BUTTON)) {
                this.prev();
            }
            break;
        case 'end':
            slideIndex = this.slideItems.length - 1;
            direction = 'Next';
            isSlideTransition = true;
            break;
        case 'home':
            slideIndex = 0;
            direction = 'Previous';
            isSlideTransition = true;
            break;
        case 'moveUp':
        case 'moveLeft':
        case 'moveDown':
        case 'moveRight':
            if (this.showIndicators && isNullOrUndefined(this.indicatorsTemplate)) {
                this.element.focus();
            }
            direction = (e.action === 'moveUp' || e.action === 'moveLeft') ? 'Previous' : 'Next';
            slideIndex = this.getSlideIndex(direction);
            isSlideTransition = !this.isSuspendSlideTransition(slideIndex, direction);
            break;
        }
        if (isSlideTransition) {
            this.setActiveSlide(slideIndex, direction);
            this.autoSlide();
            isSlideTransition = false;
        }
    }

    private swipeHandler(e: SwipeEventArgs): void {
        if (this.element.classList.contains(CLS_HOVER) || isNullOrUndefined(this.slideItems) || this.slideItems.length <= 1) {
            return;
        }
        if (this.swipeMode === (~CarouselSwipeMode.Touch & ~CarouselSwipeMode.Mouse)) {
            return;
        }
        const eventType: string = e.startEvents ? e.startEvents.toString() : null;
        if (eventType && ((this.swipeMode === CarouselSwipeMode.Mouse && eventType.includes('Touch')) ||
            (this.swipeMode === CarouselSwipeMode.Touch && eventType.includes('Mouse')))) {
            return;
        }
        const direction: CarouselSlideDirection = (e.swipeDirection === 'Right') ? 'Previous' : 'Next';
        const slideIndex: number = this.getSlideIndex(direction);
        if (!this.isSuspendSlideTransition(slideIndex, direction)) {
            this.setActiveSlide(slideIndex, direction, true);
            this.autoSlide();
        }
    }

    private isSuspendSlideTransition(index: number, direction: CarouselSlideDirection): boolean {
        return !this.loop && (direction === 'Next' && index === 0 || direction === 'Previous' && index === this.slideItems.length - 1);
    }

    private handleNavigatorsActions(index: number): void {
        if (this.buttonsVisibility === 'Hidden') {
            return;
        }
        if (this.showPlayButton) {
            const playButton: HTMLElement = this.element.querySelector(`.${CLS_PLAY_BUTTON}`) as HTMLElement;
            const isLastSlide: boolean = this.selectedIndex === this.slideItems.length - 1 && !this.loop;
            let isButtonUpdate: boolean = isNullOrUndefined(this.playButtonTemplate) && playButton && isLastSlide;
            if (isNullOrUndefined(this.playButtonTemplate) && playButton && !isLastSlide) {
                isButtonUpdate = !playButton.classList.contains(CLS_ACTIVE);
            }
            if (isButtonUpdate) {
                this.setProperties({ autoPlay: !isLastSlide }, true);
                playButton.setAttribute('aria-label', this.localeObj.getConstant(this.autoPlay ? 'pauseSlideTransition' : 'playSlideTransition'));
                this.itemsContainer.setAttribute('aria-live', this.autoPlay ? 'off' : 'polite');
                const buttonObj: Button = getInstance(playButton, Button) as Button;
                buttonObj.iconCss = CLS_ICON + ' ' + (this.autoPlay ? CLS_PAUSE_ICON : CLS_PLAY_ICON);
                buttonObj.dataBind();
            }
        }
        const prevButton: HTMLElement = this.element.querySelector(`.${CLS_PREV_BUTTON}`) as HTMLElement;
        if (prevButton && isNullOrUndefined(this.previousButtonTemplate)) {
            const buttonObj: Button = getInstance(prevButton, Button) as Button;
            buttonObj.disabled = !this.loop && index === 0;
            buttonObj.dataBind();
        }
        const nextButton: HTMLElement = this.element.querySelector(`.${CLS_NEXT_BUTTON}`) as HTMLElement;
        if (nextButton && isNullOrUndefined(this.nextButtonTemplate)) {
            const buttonObj: Button = getInstance(nextButton, Button) as Button;
            buttonObj.disabled = !this.loop && index === this.slideItems.length - 1;
            buttonObj.dataBind();
        }
    }

    private onHoverActions(e: Event): void {
        const navigator: HTMLElement = this.element.querySelector(`.${CLS_NAVIGATORS}`);
        switch (e.type) {
        case 'mouseenter':
            if (this.buttonsVisibility === 'VisibleOnHover' && navigator) {
                removeClass([].slice.call(navigator.childNodes), CLS_HOVER_ARROWS);
            }
            if (this.pauseOnHover) {
                addClass([this.element], CLS_HOVER);
            }
            break;
        case 'mouseleave':
            if (this.buttonsVisibility === 'VisibleOnHover' && navigator) {
                addClass([].slice.call(navigator.childNodes), CLS_HOVER_ARROWS);
            }
            removeClass([this.element], CLS_HOVER);
            if (this.isSwipe) {
                this.swipStop();
            }
            break;
        }
        this.autoSlide();
    }

    private onFocusActions(e: Event): void {
        switch (e.type) {
        case 'focusin':
            addClass([this.element], CLS_HOVER);
            break;
        case 'focusout':
            removeClass([this.element], CLS_HOVER);
            break;
        }
        this.autoSlide();
    }

    private destroyButtons(): void {
        const buttonCollections: HTMLElement[] = [].slice.call(this.element.querySelectorAll('.e-control.e-btn'));
        for (const button of buttonCollections) {
            const instance: Button = getInstance(button, Button) as Button;
            if (instance) {
                instance.destroy();
            }
        }
    }

    private getNumOfItems(): number {
        return this.partialVisible ? 2 : 1;
    }

    private getTranslateValue(element: HTMLElement | Element): number {
        const style: CSSStyleDeclaration = getComputedStyle(element);
        return (<Record<string, any> & Window><unknown>window).WebKitCSSMatrix ?
            new WebKitCSSMatrix(style.webkitTransform).m41 : 0;
    }

    private swipeStart(e: MouseEvent & TouchEvent): void {
        if (!this.timeStampStart) {
            this.timeStampStart = Date.now();
        }
        e.preventDefault();
        this.isSwipe = false;
        this.itemsContainer.classList.add('e-swipe-start');
        this.prevPageX = e.touches ? e.touches[0].pageX : e.pageX;
        this.initialTranslate = this.getTranslateValue(this.itemsContainer);
    }

    private swiping(e: MouseEvent & TouchEvent): void {
        if (!this.itemsContainer.classList.contains('e-swipe-start')) {
            return;
        }
        this.isSwipe = true;
        e.preventDefault();
        const pageX: number = e.touches ? e.touches[0].pageX : e.pageX;
        const positionDiff: number = this.prevPageX - (pageX);
        if (!this.loop && (
            (this.enableRtl && ((this.selectedIndex === 0 && positionDiff > 0) ||
                (this.selectedIndex === this.itemsContainer.childElementCount - 1 && positionDiff < 0))) ||
            (!this.enableRtl && ((this.selectedIndex === 0 && positionDiff < 0) ||
                (this.selectedIndex === this.itemsContainer.childElementCount - 1 && positionDiff > 0)))
        )) {
            return;
        }
        this.itemsContainer.style.transform = `translateX(${this.initialTranslate + (this.enableRtl ? positionDiff : -positionDiff)}px)`;
    }

    private swipStop(): void {
        const time: number = Date.now() - this.timeStampStart;
        let distanceX: number = this.getTranslateValue(this.itemsContainer) - this.initialTranslate;
        distanceX = distanceX < 0 ? distanceX * -1 : distanceX;
        if (this.isSwipe) {
            const offsetDist: number = distanceX * (Browser.isDevice ? 6 : 1.66);
            this.itemsContainer.style.transitionDuration = (((Browser.isDevice ? distanceX : offsetDist) / time) / 10) + 's';
        }
        const slideWidth: number = this.itemsContainer.firstElementChild.clientWidth;
        const threshold: number = slideWidth / 2;
        this.itemsContainer.classList.remove('e-swipe-start');
        const value: number = this.getTranslateValue(this.itemsContainer);
        if (value - this.initialTranslate < -threshold) {
            this.swipeNavigation(!this.enableRtl);
        }
        else if (value - this.initialTranslate > threshold) {
            this.swipeNavigation(this.enableRtl);
        }
        else {
            this.itemsContainer.style.transform = `translateX(${this.initialTranslate}px)`;
            if (this.animationEffect === 'Fade') {
                this.itemsContainer.classList.add('e-fade-in-out');
            }
        }
    }

    private swipeNavigation(isRtl: boolean): void {
        if (isRtl) {
            this.next();
        } else {
            this.prev();
        }
    }

    private swipeModehandlers(): void {
        if ((this.swipeMode & CarouselSwipeMode.Touch) === CarouselSwipeMode.Touch) {
            EventHandler.add(this.itemsContainer, 'touchstart', this.swipeStart, this);
            EventHandler.add(this.itemsContainer, 'touchmove', this.swiping, this);
            EventHandler.add(this.itemsContainer, 'touchend', this.swipStop, this);
        }
        if ((this.swipeMode & CarouselSwipeMode.Mouse) === CarouselSwipeMode.Mouse) {
            EventHandler.add(this.itemsContainer, 'mousedown', this.swipeStart, this);
            EventHandler.add(this.itemsContainer, 'mousemove', this.swiping, this);
            EventHandler.add(this.itemsContainer, 'mouseup', this.swipStop, this);
        }
        if ((this.swipeMode === 0) && (this.swipeMode & CarouselSwipeMode.Mouse & CarouselSwipeMode.Touch) ===
            (CarouselSwipeMode.Mouse & CarouselSwipeMode.Touch)) {
            EventHandler.add(this.itemsContainer, 'mousedown touchstart', this.swipeStart, this);
            EventHandler.add(this.itemsContainer, 'mousemove touchmove', this.swiping, this);
            EventHandler.add(this.itemsContainer, 'mouseup touchend', this.swipStop, this);
        }
    }

    private resizeHandler(): void {
        if (this.itemsContainer && this.itemsContainer.firstElementChild) {
            const numOfItems: number = this.getNumOfItems();
            const slideWidth: number = this.itemsContainer.firstElementChild.clientWidth;
            if (this.loop) {
                this.itemsContainer.style.transform = this.getTranslateX(slideWidth, this.selectedIndex + numOfItems);
            }
            else {
                this.itemsContainer.style.transform = this.getTranslateX(slideWidth, this.selectedIndex);
            }
        }
    }

    private wireEvents(): void {
        if (this.animationEffect !== 'Custom') {
            this.swipeModehandlers();
        }
        EventHandler.add(this.element, 'focusin focusout', this.onFocusActions, this);
        EventHandler.add(this.element, 'mouseenter mouseleave', this.onHoverActions, this);
        EventHandler.add(this.element.firstElementChild, 'animationend', this.onTransitionEnd, this);
        EventHandler.add(this.element.firstElementChild, 'transitionend', this.onTransitionEnd, this);
        EventHandler.add(<HTMLElement & Window><unknown>window, 'resize', this.resizeHandler, this);
    }

    private unWireEvents(): void {
        const indicators: HTMLElement[] = [].slice.call(this.element.querySelectorAll(`.${CLS_INDICATOR_BAR}`));
        indicators.forEach((indicator: Element) => {
            EventHandler.remove(indicator, 'click', this.indicatorClickHandler);
        });
        const navigators: HTMLElement[] = [].slice.call(this.element.querySelectorAll(`.${CLS_PREVIOUS},.${CLS_NEXT}`));
        navigators.forEach((navigator: HTMLElement) => {
            EventHandler.remove(navigator, 'click', this.navigatorClickHandler);
        });
        const playIcon: Element = this.element.querySelector(`.${CLS_PLAY_PAUSE}`);
        if (playIcon) {
            EventHandler.remove(playIcon, 'click', this.playButtonClickHandler);
        }
        EventHandler.remove(this.element.firstElementChild, 'animationend', this.onTransitionEnd);
        EventHandler.remove(this.element.firstElementChild, 'transitionend', this.onTransitionEnd);
        EventHandler.clearEvents(this.element);
        EventHandler.clearEvents(this.itemsContainer);
        EventHandler.remove(<HTMLElement & Window><unknown>window, 'resize', this.resizeHandler);
    }

    /**
     * Method to transit from the current slide to the previous slide.
     *
     * @returns {void}
     */
    public prev(): void {
        if (!this.loop && this.selectedIndex === 0) {
            return;
        }
        const index: number = (this.selectedIndex === 0) ? this.slideItems.length - 1 : this.selectedIndex - 1;
        this.setActiveSlide(index, 'Previous');
        this.autoSlide();
    }

    /**
     * Method to transit from the current slide to the next slide.
     *
     * @returns {void}
     */
    public next(): void {
        if (!this.loop && this.selectedIndex === this.slideItems.length - 1) {
            return;
        }
        const index: number = (this.selectedIndex === this.slideItems.length - 1) ? 0 : this.selectedIndex + 1;
        this.setActiveSlide(index, 'Next');
        this.autoSlide();
    }

    /**
     * Method to play the slides programmatically.
     *
     * @returns {void}
     */
    public play(): void {
        const playIcon: Element = this.element.querySelector(`.${CLS_PLAY_ICON}`);
        if (this.showPlayButton && playIcon) {
            classList(playIcon, [CLS_PAUSE_ICON], [CLS_PLAY_ICON]);
            const playButton: HTMLElement = this.element.querySelector(`.${CLS_PLAY_BUTTON}`) as HTMLElement;
            playButton.setAttribute('aria-label', this.localeObj.getConstant('pauseSlideTransition'));
        }
        this.setProperties({ autoPlay: true }, true);
        this.itemsContainer.setAttribute('aria-live', 'off');
        this.applySlideInterval();
    }

    /**
     * Method to pause the slides programmatically.
     *
     * @returns {void}
     */
    public pause(): void {
        const pauseIcon: Element = this.element.querySelector(`.${CLS_PAUSE_ICON}`);
        if (this.showPlayButton && pauseIcon) {
            const playButton: HTMLElement = this.element.querySelector(`.${CLS_PLAY_BUTTON}`) as HTMLElement;
            playButton.setAttribute('aria-label', this.localeObj.getConstant('playSlideTransition'));
            classList(pauseIcon, [CLS_PLAY_ICON], [CLS_PAUSE_ICON]);
        }
        this.setProperties({ autoPlay: false }, true);
        this.itemsContainer.setAttribute('aria-live', 'off');
        this.resetSlideInterval();
    }

    /**
     * Method to render react and angular templates
     *
     * @returns {void}
     * @private
     */
    private renderTemplates(): void {
        if ((this as any).isAngular || (this as any).isReact) {
            this.renderReactTemplates();
        }
    }

    /**
     * Method to reset react and angular templates
     *
     * @param {string[]} templates Accepts the template ID
     * @returns {void}
     * @private
     */
    private resetTemplates(templates?: string[]): void {
        if ((this as any).isAngular || (this as any).isReact) {
            this.clearTemplate(templates);
        }
    }

    /**
     * Method for destroy the carousel component.
     *
     * @returns {void}
     */
    public destroy(): void {
        this.resetTemplates();
        if (this.touchModule) {
            this.touchModule.destroy();
            this.touchModule = null;
        }
        if (this.keyModule) {
            this.keyModule.destroy();
            this.keyModule = null;
        }
        this.resetSlideInterval();
        this.destroyButtons();
        this.unWireEvents();
        [].slice.call(this.element.children).forEach((ele: HTMLElement) => { this.element.removeChild(ele); });
        removeClass([this.element], [CLS_CAROUSEL, this.cssClass, CLS_RTL, CLS_SWIPE]);
        ['role', 'style'].forEach((attr: string): void => { this.element.removeAttribute(attr); });
        this.itemsContainer = null;
        super.destroy();
    }
}
