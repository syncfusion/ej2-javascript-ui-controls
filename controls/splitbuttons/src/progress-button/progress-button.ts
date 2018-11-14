import { Button, IconPosition } from '@syncfusion/ej2-buttons';
import { EventHandler, Property, INotifyPropertyChanged, NotifyPropertyChanges, Animation, Effect, attributes } from '@syncfusion/ej2-base';
import { EmitType, Event, BaseEventArgs, remove, removeClass } from '@syncfusion/ej2-base';
import { createSpinner, showSpinner, hideSpinner } from '@syncfusion/ej2-popups';
import { ProgressButtonModel } from './progress-button-model';

const HIDESPINNER: string = 'e-hide-spinner';
const PROGRESS: string = 'e-progress';
const PROGRESSACTIVE: string = 'e-progress-active';
const CONTENTCLS: string = 'e-btn-content';

/**
 * The ProgressButton visualizes the progression of an operation to indicate the user
 * that a process is happening in the background with visual representation.
 * ```html
 * <button id="element"></button>
 * ```
 * ```typescript
 * <script>
 * var progressButtonObj = new ProgressButton({ content: 'Progress Button' });
 * progressButtonObj.appendTo("#element");
 * </script>
 * ```
 */
@NotifyPropertyChanges
export class ProgressButton extends Button implements INotifyPropertyChanged {
    private progressTime: number;
    private percent: number;
    private isPaused: boolean;
    private timerId: number;
    private step: number = 1;

    /**
     * Enables or disables the background filler UI in the progress button.
     * @default false
     */
    @Property(false)
    public enableProgress: boolean;

    /**
     * Specifies the duration of progression in the progress button.
     * @default 2000
     */
    @Property(2000)
    public duration: number;

    /**
     * Positions an icon in the progress button. The possible values are:
     * * Left: The icon will be positioned to the left of the text content.
     * * Right: The icon will be positioned to the right of the text content.
     * * Top: The icon will be positioned at the top of the text content.
     * * Bottom: The icon will be positioned at the bottom of the text content.
     * @default "Left"
     */
    @Property('Left')
    public iconPosition: IconPosition;

    /**
     * Defines class/multiple classes separated by a space for the progress button that is used to include an icon.
     * Progress button can also include font icon and sprite image.
     * @default ""
     */
    @Property('')
    public iconCss: string;

    /**
     * Enables or disables the progress button.
     * @default false.
     */
    @Property(false)
    public disabled: boolean;

    /**
     * Allows the appearance of the progress button to be enhanced and visually appealing when set to `true`.
     * @default false
     */
    @Property(false)
    public isPrimary: boolean;

    /**
     * Specifies the root CSS class of the progress button that allows customization of component’s appearance.
     * The progress button types, styles, and size can be achieved by using this property.
     * @default ""
     */
    @Property('')
    public cssClass: string;

    /**
     * Defines the text `content` of the progress button element.
     * @default ""
     */
    @Property('')
    public content: string;

    /**
     * Makes the progress button toggle, when set to `true`. When you click it, the state changes from normal to active.
     * @default false
     */
    @Property(false)
    public isToggle: boolean;

    /**
     * Specifies a spinner and its related properties.
     */
    @Property(<SpinSettings>{ template: null, width: 16, position: 'Left' })
    public spinSettings: SpinSettings;

    /**
     * Specifies the animation settings.
     */
    @Property(<AnimationSettings>{ duration: 400, effect: 'None', easing: 'ease' })
    public animationSettings: AnimationSettings;

    /**
     * Triggers once the component rendering is completed.
     * @event
     */
    @Event()
    public created: EmitType<Event>;

    /**
     * Triggers when the progress starts.
     * @event
     */
    @Event()
    public begin: EmitType<ProgressEventArgs>;

    /**
     * Triggers in specified intervals.
     * @event
     */
    @Event()
    public progress: EmitType<ProgressEventArgs>;

    /**
     * Triggers when the progress is completed.
     * @event
     */
    @Event()
    public end: EmitType<ProgressEventArgs>;

    /**
     * Triggers when the progress is incomplete.
     * @event
     */
    @Event()
    public fail: EmitType<Event>;

    /**
     * Constructor for creating the widget
     * @param  {ProgressButtonModel} options?
     * @param  {string|HTMLButtonElement} element?
     */
    constructor(options?: ProgressButtonModel, element?: string | HTMLButtonElement) {
        super(options, element);
    }

    protected preRender(): void {
        super.preRender();
    }

    /**
     * Initialize the Component rendering
     * @returns void
     * @private
     */
    public render(): void {
        super.render();
        this.init();
        this.wireEvents();
        this.setAria();
    }

    /**
     * Starts the button progress at the specified percent.
     * @param percent Starts the button progress at this percent.
     * @returns void
     */
    public start(percent?: number): void {
        this.isPaused = false;
        this.startProgress(percent ? percent : this.percent, this.progressTime);
    }

    /**
     * Stops the button progress.
     * @returns void
     */
    public stop(): void {
        this.isPaused = true;
        cancelAnimationFrame(this.timerId);
    }

    /**
     * Get component name.
     * @returns string
     * @private
     */
    public getModuleName(): string {
        return 'progress-btn';
    }

    /**
     * Destroys the widget.
     * @returns void
     */
    public destroy(): void {
        let classList: string[] = [HIDESPINNER, PROGRESSACTIVE, 'e-round-corner', 'e-' + super.getModuleName(),
        'e-spin-' + this.spinSettings.position.toLowerCase()];
        let css: string[];
        super.destroy();
        this.unWireEvents();
        this.element.innerHTML = '';
        if (this.cssClass) {
           classList = classList.concat(this.cssClass.split(' '));
        }
        removeClass([this.element], classList);
        css = this.element.getAttribute('class') ? ['aria-label', 'aria-valuemin', 'aria-valuemax', 'aria-valuenow']
           : ['aria-label', 'aria-valuemin', 'aria-valuemax', 'aria-valuenow', 'class'];
        css.forEach((key: string) => {
            this.element.removeAttribute(key);
        });
        if (this.disabled) {
            this.element.removeAttribute('disabled');
        }
    }

    private init(): void {
        this.element.classList.add('e-' + super.getModuleName());
        this.setContent();
        this.createSpinner();
        if (this.enableProgress) {
            this.createProgress();
        }
    }

    private createSpinner(): void {
        let spinner: HTMLElement = this.createElement('span', { className: 'e-spinner' });
        this.setSpinPosition(spinner);
        createSpinner(
            {
                target: spinner, width: this.spinSettings.width || 16, template: this.spinSettings.template
            },
            this.createElement);
    }

    private setSpinPosition(ele: HTMLElement): void {
        let position: SpinPosition = this.spinSettings.position || 'Left';
        if (position === 'Left' || position === 'Top') {
            this.element.insertBefore(ele, this.element.getElementsByClassName(CONTENTCLS)[0]);
        } else {
            this.element.appendChild(ele);
        }
        this.element.classList.add('e-spin-' + position.toLowerCase());
    }

    private createProgress(): void {
        this.element.appendChild(this.createElement('span', { className: PROGRESS }));
    }

    private setContent(): void {
        let cont: string = this.element.innerHTML;
        this.element.innerHTML = '';
        this.element.appendChild(this.createElement('span', { className: CONTENTCLS, innerHTML: cont }));
    }

    private clickHandler(): void {
        if (this.element.classList.contains(PROGRESSACTIVE)) {
            return;
        }
        this.startProgress();
    }

    private startProgress(percent?: number, progressTime?: number): void {
        let clsList: DOMTokenList = this.element.classList;
        let isVertical: boolean = clsList.contains('e-vertical');
        clsList.add(PROGRESSACTIVE);
        if (!(clsList.contains(HIDESPINNER))) {
            showSpinner(this.element);
            if (!this.enableProgress) {
                setTimeout(() => {
                    this.hideSpin();
                    // tslint:disable-next-line
                }, this.duration);
            }
        }
        if (this.enableProgress) {
            this.startAnimate(
                Date.now(), progressTime ? progressTime : 0, progressTime ? Date.now() - (this.duration * 1 / 100) : Date.now(),
                percent ? percent : 0, 0, this.step, 0, isVertical);
        }
        this.startContAnimate();
    }

    private startAnimate(
        timestamp: number, progressTime: number, prevTime: number, percent: number, prevPercent: number,
        step: number, prevProgressTime: number, isVertical: boolean): void {
        try {
            let args: ProgressEventArgs;
            let timeDiff: number = timestamp - prevTime;
            let stepTime: number = this.duration * step / 100;
            let timeDiffBuffer: number = timeDiff ? (timeDiff < stepTime ? timeDiff - stepTime : timeDiff % stepTime) : 0;
            this.progressTime = progressTime = progressTime + timeDiff - timeDiffBuffer;
            prevTime = timestamp - timeDiffBuffer;
            percent = percent + (timeDiff - timeDiffBuffer) / this.duration * 100;
            prevPercent = ((progressTime - prevProgressTime) % stepTime === 0 || percent === 100) ? percent : prevPercent;
            args = { percent: prevPercent, currentDuration: progressTime, step: step };
            if (percent === 0) {
                this.trigger('begin', args);
            } else if (percent === 100 || progressTime === this.duration) {
                this.trigger('end', args);
            } else {
                this.trigger('progress', args);
            }
            if (percent !== args.percent && args.percent !== prevPercent) {
                percent = args.percent;
            }
            this.percent = percent;
            this.step = args.step;
            if ((progressTime - prevProgressTime) % (this.duration * args.step / 100) === 0 || percent === 100) {
                this.timerId = requestAnimationFrame(() => {
                    (this.element.getElementsByClassName(PROGRESS)[0] as HTMLElement)
                        .style[isVertical ? 'height' : 'width'] = percent + '%';
                    this.element.setAttribute('aria-valuenow', percent.toString());
                });
                prevPercent = percent;
                prevProgressTime = progressTime;
            }
            if (!this.isPaused) {
                if (progressTime < this.duration && percent < 100) {
                    setTimeout(() => {
                        this.startAnimate(
                            Date.now(), progressTime, prevTime, percent,
                            prevPercent, args.step, prevProgressTime, isVertical);
                        // tslint:disable-next-line
                    }, (this.duration / 100) - timeDiffBuffer);
                } else {
                    setTimeout(() => {
                        this.progressTime = this.percent = 0;
                        (this.element.getElementsByClassName(PROGRESS)[0] as HTMLElement).style[isVertical ? 'height' : 'width'] = '0%';
                        this.element.setAttribute('aria-valuenow', '0');
                        this.hideSpin();
                        // tslint:disable-next-line
                    }, 100);
                }
            }
        } catch (e) {
            cancelAnimationFrame(this.timerId);
            this.trigger('fail', e);
        }
    }

    private startContAnimate(): void {
        let ele: HTMLElement = this.element.getElementsByClassName(CONTENTCLS)[0] as HTMLElement;
        if (this.animationSettings.effect !== 'None') {
            (new Animation({})).animate(
                ele,
                {
                    duration: this.animationSettings.duration,
                    name: 'Progress' + this.animationSettings.effect as Effect,
                    timingFunction: this.animationSettings.easing,
                    begin: () => {
                        if (this.spinSettings.position === 'Center') {
                            this.setSpinnerSize();
                        }
                    },
                    end: () => {
                        ele.classList.add('e-animate-end');
                    }
                });
        } else if (this.spinSettings.position === 'Center') {
            this.setSpinnerSize();
        }
    }

    private setSpinnerSize(): void {
        let ele: HTMLElement = this.element.getElementsByClassName(CONTENTCLS)[0] as HTMLElement;
        let spinner: HTMLElement = this.element.getElementsByClassName('e-spinner')[0] as HTMLElement;
        spinner.style.width = Math.max(spinner.offsetWidth, ele.offsetWidth) + 'px';
        spinner.style.height = Math.max(spinner.offsetHeight, ele.offsetHeight) + 'px';
        ele.classList.add('e-cont-animate');
    }

    private hideSpin(): void {
        let cont: Element = this.element.getElementsByClassName(CONTENTCLS)[0];
        if (!(this.element.classList.contains(HIDESPINNER))) {
            hideSpinner(this.element);
        }
        this.element.classList.remove(PROGRESSACTIVE);
        if (this.animationSettings.effect !== 'None') {
            cont.classList.remove('e-animate-end');
        }
        if (this.spinSettings.position === 'Center') {
            let ele: HTMLElement = this.element.getElementsByClassName('e-spinner')[0] as HTMLElement;
            cont.classList.remove('e-cont-animate');
            ele.style.width = 'auto';
            ele.style.height = 'auto';
        }
    }

    private setIconSpan(): void {
        let cont: Element = this.element.getElementsByClassName(CONTENTCLS)[0];
        let iconSpan: Element = this.element.getElementsByClassName('e-btn-icon')[0];
        if (cont.childNodes[0] && (this.iconPosition === 'Left' || this.iconPosition === 'Top')) {
            cont.insertBefore(iconSpan, cont.childNodes[0]);
        } else {
            cont.appendChild(iconSpan);
        }
    }

    private setAria(): void {
        attributes(this.element, {
            'aria-label': this.element.textContent + ' progress', 'aria-valuemin': '0', 'aria-valuemax': '100', 'aria-valuenow': '0'
        });
    }

    protected wireEvents(): void {
        EventHandler.add(this.element, 'click', this.clickHandler, this);
    }

    protected unWireEvents(): void {
        EventHandler.remove(this.element, 'click', this.clickHandler);
    }

    /**
     * Called internally if any of the property value changed.
     * @param  {ProgressButton} newProp
     * @param  {ProgressButton} oldProp
     * @returns void
     * @private
     */
    public onPropertyChanged(newProp: ProgressButton, oldProp: ProgressButton): void {
        super.onPropertyChanged(newProp, oldProp);
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'content':
                    this.setContent();
                    this.createSpinner();
                    if (this.enableProgress) {
                        this.createProgress();
                    }
                    this.element.setAttribute('aria-label', this.element.textContent + ' progress');
                    break;
                case 'iconCss':
                    if (!oldProp.iconCss) {
                        this.setIconSpan();
                    }
                    break;
                case 'iconPosition':
                    this.setIconSpan();
                    break;
                case 'enableProgress':
                    if (newProp.enableProgress) {
                        this.createProgress();
                    } else {
                        remove(this.element.getElementsByClassName(PROGRESS)[0]);
                    }
                    break;
            }
        }
    }
}

export type SpinPosition = 'Left' | 'Right' | 'Top' | 'Bottom' | 'Center';

export type AnimationEffect = 'None' | 'SlideLeft' | 'SlideRight' | 'SlideUp' | 'SlideDown' | 'ZoomIn' | 'ZoomOut';

export interface ProgressEventArgs extends BaseEventArgs {
    /**
     * Indicates the current state of progress in percentage.
     */
    percent: number;
    /**
     * Indicates the current duration of the progress.
     */
    currentDuration: number;
    /**
     * Specifies the interval.
     * @default 1
     */
    step: number;
}

export interface SpinSettings {
    /**
     * Specifies the template content to be displayed in a spinner.
     * @default null
     */
    template?: string;
    /**
     * Sets the width of a spinner.
     * @default 16
     */
    width?: string | number;
    /**
     * Specifies the position of a spinner in the progress button. The possible values are:
     * * Left: The spinner will be positioned to the left of the text content.
     * * Right: The spinner will be positioned to the right of the text content.
     * * Top: The spinner will be positioned at the top of the text content.
     * * Bottom: The spinner will be positioned at the bottom of the text content.
     * * Center: The spinner will be positioned at the center of the progress button.
     * @default 'Left'
     */
    position?: SpinPosition;
}

export interface AnimationSettings {
    /**
     * Specifies the duration taken to animate.
     * @default 400
     */
    duration?: number;
    /**
     * Specifies the effect of animation.
     * @default 'None'
     */
    effect?: AnimationEffect;
    /**
     * Specifies the animation timing function.
     * @default 'ease'
     */
    easing?: string;
}