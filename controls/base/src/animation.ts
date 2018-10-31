import { createElement, selectAll, closest } from './dom';
import { Base, EmitType } from './base';
import { Browser } from './browser';
import { EventHandler } from './event-handler';
import { AnimationModel } from './animation-model';
import { Property, NotifyPropertyChanges, INotifyPropertyChanged, Event } from './notify-property-change';

/**
 * Animation effect names
 */
export type Effect = 'FadeIn' | 'FadeOut' | 'FadeZoomIn' | 'FadeZoomOut' | 'FlipLeftDownIn' | 'FlipLeftDownOut' | 'FlipLeftUpIn' |
    'FlipLeftUpOut' | 'FlipRightDownIn' | 'FlipRightDownOut' | 'FlipRightUpIn' | 'FlipRightUpOut' | 'FlipXDownIn' | 'FlipXDownOut' |
    'FlipXUpIn' | 'FlipXUpOut' | 'FlipYLeftIn' | 'FlipYLeftOut' | 'FlipYRightIn' | 'FlipYRightOut' | 'SlideBottomIn' | 'SlideBottomOut' |
    'SlideDown' | 'SlideLeft' | 'SlideLeftIn' | 'SlideLeftOut' | 'SlideRight' | 'SlideRightIn' | 'SlideRightOut' | 'SlideTopIn' |
    'SlideTopOut' | 'SlideUp' | 'ZoomIn' | 'ZoomOut';

/**
 * The Animation framework provide options to animate the html DOM elements
 * ```typescript
 *   let animeObject = new Animation({
 *      name: 'SlideLeftIn', 
 *      duration: 1000
 *   }); 
 *   animeObject.animate('#anime1');
 *   animeObject.animate('#anime2', { duration: 500 });
 * ```
 */
@NotifyPropertyChanges
export class Animation extends Base<HTMLElement> implements INotifyPropertyChanged {
    /**
     * Specify the type of animation
     * @default : 'FadeIn';
     */
    @Property('FadeIn')
    public name: Effect;
    /**
     * Specify the duration to animate
     * @default : 400;
     */
    @Property(400)
    public duration: number;
    /**
     * Specify the animation timing function
     * @default : 'ease';
     */
    @Property('ease')
    public timingFunction: string;
    /**
     * Specify the delay to start animation
     * @default : 0;
     */
    @Property(0)
    public delay: number;
    /**
     * Triggers when animation is in-progress
     * @event
     */
    @Event()
    public progress: EmitType<AnimationOptions>;
    /**
     * Triggers when the animation is started
     * @event
     */
    @Event()
    public begin: EmitType<AnimationOptions>;

    /**
     * Triggers when animation is completed
     * @event
     */
    @Event()
    public end: EmitType<AnimationOptions>;

    /**
     * Triggers when animation is failed due to any scripts
     * @event
     */
    @Event()
    public fail: EmitType<AnimationOptions>;

    /**
     * @private
     */
    public easing: { [key: string]: string } = {
        ease: 'cubic-bezier(0.250, 0.100, 0.250, 1.000)',
        linear: 'cubic-bezier(0.250, 0.250, 0.750, 0.750)',
        easeIn: 'cubic-bezier(0.420, 0.000, 1.000, 1.000)',
        easeOut: 'cubic-bezier(0.000, 0.000, 0.580, 1.000)',
        easeInOut: 'cubic-bezier(0.420, 0.000, 0.580, 1.000)',
        elasticInOut: 'cubic-bezier(0.5,-0.58,0.38,1.81)',
        elasticIn: 'cubic-bezier(0.17,0.67,0.59,1.81)',
        elasticOut: 'cubic-bezier(0.7,-0.75,0.99,1.01)'
    };

    constructor(options: AnimationModel) {
        super(options, undefined);
    }

    /**
     * Applies animation to the current element.  
     * @param {string | HTMLElement} element - Element which needs to be animated.
     * @param {AnimationModel} options - Overriding default animation settings.
     * @return {void}
     */
    public animate(element: string | HTMLElement, options?: AnimationModel): void {
        options = !options ? {} : options;
        let model: AnimationOptions = this.getModel(options);
        if (typeof element === 'string') {
            let elements: HTMLElement[] = Array.prototype.slice.call(selectAll(element, document));
            for (let element of elements) {
                model.element = element;
                Animation.delayAnimation(model);
            }
        } else {
            model.element = element;
            Animation.delayAnimation(model);
        }
    }

    /**
     * Stop the animation effect on animated element.  
     * @param {HTMLElement} element - Element which needs to be stop the animation.
     * @param {AnimationOptions} model - Handling the animation model at stop function.
     * @return {void}
     */
    public static stop(element: HTMLElement, model?: AnimationOptions): void {
        element.style.animation = '';
        element.removeAttribute('e-animate');
        let animationId: string = element.getAttribute('e-animation-id');
        if (animationId) {
            let frameId: number = parseInt(animationId, 10);
            cancelAnimationFrame(frameId);
            element.removeAttribute('e-animation-id');
        }
        if (model && model.end) {
            model.end.call(this, model);
        }
    }

    /**
     * Set delay to animation element
     * @param {AnimationModel} model 
     * @returns {void}
     */
    private static delayAnimation(model: AnimationModel): void {
        if (model.delay) {
            setTimeout(() => { Animation.applyAnimation(model); }, model.delay);
        } else {
            Animation.applyAnimation(model);
        }
    }

    /**
     * Triggers animation 
     * @param {AnimationModel} model 
     * @returns {void}
     */
    private static applyAnimation(model: AnimationOptions): void {
        model.timeStamp = 0;
        let step: number = 0;
        let timerId: number = 0;
        let startTime: number = 0;
        let prevTimeStamp: number = 0;
        let duration: number = model.duration;
        model.element.setAttribute('e-animate', 'true');
        let startAnimation: (timeStamp?: number) => void = (timeStamp?: number): void => {
            try {
                if (timeStamp) {
                    // let step: number = model.timeStamp = timeStamp - startTime;
                    /** phantomjs workaround for timestamp fix */
                    prevTimeStamp = prevTimeStamp === 0 ? timeStamp : prevTimeStamp;
                    model.timeStamp = (timeStamp + model.timeStamp) - prevTimeStamp;
                    prevTimeStamp = timeStamp;
                    /** phantomjs workaround end */
                    // trigger animation begin event
                    if (!step && model.begin) {
                        model.begin.call(this, model);
                    }
                    step = step + 1;
                    let avg: number = model.timeStamp / step;
                    if (model.timeStamp < duration && model.timeStamp + avg < duration && model.element.getAttribute('e-animate')) {
                        // apply animation effect to the current element                
                        model.element.style.animation = model.name + ' ' + model.duration + 'ms ' + model.timingFunction;
                        if (model.progress) {
                            model.progress.call(this, model);
                        }
                        // repeat requestAnimationFrame 
                        requestAnimationFrame(startAnimation);
                    } else {
                        // clear requestAnimationFrame
                        cancelAnimationFrame(timerId);
                        model.element.removeAttribute('e-animation-id');
                        model.element.removeAttribute('e-animate');
                        model.element.style.animation = '';
                        if (model.end) {
                            model.end.call(this, model);
                        }
                    }
                } else {
                    startTime = performance.now();
                    // set initial requestAnimationFrame
                    timerId = requestAnimationFrame(startAnimation);
                    model.element.setAttribute('e-animation-id', timerId.toString());
                }
            } catch (e) {
                cancelAnimationFrame(timerId);
                model.element.removeAttribute('e-animation-id');
                if (model.fail) {
                    model.fail.call(this, e);
                }
            }
        };
        startAnimation();
    }

    /**
     * Returns Animation Model
     * @param {AnimationModel} options 
     * @returns {AnimationModel}
     */
    private getModel(options: AnimationModel): AnimationModel {
        return {
            name: options.name || this.name,
            delay: options.delay || this.delay,
            duration: (options.duration !== undefined ? options.duration : this.duration),
            begin: options.begin || this.begin,
            end: options.end || this.end,
            fail: options.fail || this.fail,
            progress: options.progress || this.progress,
            timingFunction: this.easing[options.timingFunction] ? this.easing[options.timingFunction] :
                (options.timingFunction || this.easing[this.timingFunction])
        };
    }

    /** 
     * @private
     */
    public onPropertyChanged(newProp: AnimationModel, oldProp: AnimationModel): void {
        // no code needed
    }
    /**
     * Returns module name as animation
     * @private
     */
    public getModuleName(): string {
        return 'animation';
    }

    /**
     * @private
     */
    public destroy(): void {
        //Override base destroy;
    }
}

/**
 * Animation event argument for progress event handler
 */
export interface AnimationOptions extends AnimationModel {
    /**
     * Get current time-stamp in progress EventHandler
     */
    timeStamp?: number;
    /**
     * Get current animation element in progress EventHandler
     */
    element?: HTMLElement;
}

/**
 * Ripple provides material theme's wave effect when an element is clicked
 * ```html
 * <div id='ripple'></div>
 * <script>
 *   rippleEffect(document.getElementById('ripple'));
 * </script>
 * ```
 * @private
 * @param HTMLElement element - Target element
 * @param RippleOptions rippleOptions - Ripple options .
 */
export function rippleEffect(element: HTMLElement, rippleOptions?: RippleOptions, done?: Function): () => void {
    let rippleModel: RippleOptions = getRippleModel(rippleOptions);
    if (rippleModel.rippleFlag === false || (rippleModel.rippleFlag === undefined && !isRippleEnabled)) {
        return Function;
    }
    element.setAttribute('data-ripple', 'true');
    EventHandler.add(element, 'mousedown', rippleHandler, { parent: element, rippleOptions: rippleModel });
    EventHandler.add(element, 'mouseup', rippleUpHandler, { parent: element, rippleOptions: rippleModel, done: done });
    EventHandler.add(element, 'mouseleave', rippleLeaveHandler, { parent: element, rippleOptions: rippleModel });
    if (Browser.isPointer) {
        EventHandler.add(element, 'transitionend', rippleLeaveHandler, { parent: element, rippleOptions: rippleModel });
    }

    return (() => {
        element.removeAttribute('data-ripple');
        EventHandler.remove(element, 'mousedown', rippleHandler);
        EventHandler.remove(element, 'mouseup', rippleUpHandler);
        EventHandler.remove(element, 'mouseleave', rippleLeaveHandler);
        EventHandler.remove(element, 'transitionend', rippleLeaveHandler);
    });
}

/**
 * Ripple method arguments to handle ripple effect
 * @private
 */
export interface RippleOptions {
    /**
     * Get selector child elements for ripple effect
     */
    selector?: string;
    /**
     * Get ignore elements to prevent ripple effect
     */
    ignore?: string;
    /**
     * Override the enableRipple method
     */
    rippleFlag?: boolean;
    /**
     * Set ripple effect from center position
     */
    isCenterRipple?: boolean;
    /**
     * Set ripple duration
     */
    duration?: number;
}

function getRippleModel(rippleOptions?: RippleOptions): RippleOptions {
    let rippleModel: RippleOptions = {
        selector: rippleOptions && rippleOptions.selector ? rippleOptions.selector : null,
        ignore: rippleOptions && rippleOptions.ignore ? rippleOptions.ignore : null,
        rippleFlag: rippleOptions && rippleOptions.rippleFlag,
        isCenterRipple: rippleOptions && rippleOptions.isCenterRipple,
        duration: rippleOptions && rippleOptions.duration ? rippleOptions.duration : 350
    };
    return rippleModel;
}

/**
 * Handler for ripple event
 * @param {MouseEvent} e 
 * @returns {void}
 * @private
 */
function rippleHandler(e: MouseEvent): void {
    let target: HTMLElement = <HTMLElement>(e.target);
    let selector: string = this.rippleOptions.selector;
    let element: HTMLElement = selector ? <HTMLElement>closest(target, selector) : target;
    if (!element || (this.rippleOptions && closest(target, this.rippleOptions.ignore))) {
        return;
    }
    let offset: ClientRect = element.getBoundingClientRect();
    let offsetX: number = e.pageX - document.body.scrollLeft;
    let offsetY: number = e.pageY - ((!document.body.scrollTop && document.documentElement) ?
        document.documentElement.scrollTop : document.body.scrollTop);
    let pageX: number = Math.max(Math.abs(offsetX - offset.left), Math.abs(offsetX - offset.right));
    let pageY: number = Math.max(Math.abs(offsetY - offset.top), Math.abs(offsetY - offset.bottom));
    let radius: number = Math.sqrt(pageX * pageX + pageY * pageY);
    let diameter: string = radius * 2 + 'px';
    let x: number = offsetX - offset.left - radius;
    let y: number = offsetY - offset.top - radius;
    if (this.rippleOptions && this.rippleOptions.isCenterRipple) {
        x = 0;
        y = 0;
        diameter = '100%';
    }
    element.classList.add('e-ripple');
    let duration: string = this.rippleOptions.duration.toString();
    let styles: string = 'width: ' + diameter + ';height: ' + diameter + ';left: ' + x + 'px;top: ' + y + 'px;' +
        'transition-duration: ' + duration + 'ms;';
    let rippleElement: HTMLElement = createElement('div', { className: 'e-ripple-element', styles: styles });
    element.appendChild(rippleElement);
    window.getComputedStyle(rippleElement).getPropertyValue('opacity');
    rippleElement.style.transform = 'scale(1)';

    if (element !== this.parent) {
        EventHandler.add(element, 'mouseleave', rippleLeaveHandler, { parent: this.parent, rippleOptions: this.rippleOptions });
    }
}

/**
 * Handler for ripple element mouse up event
 * @param {MouseEvent} e 
 * @returns {void}
 * @private
 */
function rippleUpHandler(e: MouseEvent): void {
    removeRipple(e, this);
}

/**
 * Handler for ripple element mouse move event
 * @param {MouseEvent} e 
 * @returns {void}
 * @private
 */
function rippleLeaveHandler(e: MouseEvent): void {
    removeRipple(e, this);
}

/**
 * Handler for removing ripple element
 * @param {MouseEvent} e 
 * @param {rippleArgs} eventArgs
 * @returns {void}
 * @private
 */
function removeRipple(e: MouseEvent, eventArgs: RippleArgs): void {
    let duration: number = eventArgs.rippleOptions.duration;
    let target: HTMLElement = <HTMLElement>(e.target);
    let selector: string = eventArgs.rippleOptions.selector;
    let element: HTMLElement = selector ? <HTMLElement>closest(target, selector) : target;
    if (!element || (element && element.className.indexOf('e-ripple') === -1)) {
        return;
    }
    let rippleElements: HTMLElement[] = selectAll('.e-ripple-element', element);
    let rippleElement: HTMLElement = rippleElements[rippleElements.length - 1];
    if (rippleElement) {
        rippleElement.style.opacity = '0.5';
    }
    if (eventArgs.parent !== element) {
        EventHandler.remove(element, 'mouseleave', rippleLeaveHandler);
    }
    /* tslint:disable:align */
    setTimeout(() => {
        if (rippleElement && rippleElement.parentNode) {
            rippleElement.parentNode.removeChild(rippleElement);
        }
        if (!element.getElementsByClassName('e-ripple-element').length) {
            element.classList.remove('e-ripple');
        }
        if (eventArgs.done) {
            eventArgs.done(e);
        }
    }, duration);
}

interface RippleArgs {
    parent: HTMLElement;
    selector: string;
    rippleOptions: RippleOptions;
    done: Function;
}
export let isRippleEnabled: boolean = false;

/**
 * Animation Module provides support to enable ripple effect functionality to Essential JS 2 components.
 * @param {boolean} isRipple Specifies the boolean value to enable or disable ripple effect.
 * @returns {boolean}
 */
export function enableRipple(isRipple: boolean): boolean {
    isRippleEnabled = isRipple;
    return isRippleEnabled;
}