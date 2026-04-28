import { Button, IconPosition } from '@syncfusion/ej2-buttons';
import { EventHandler, Property, INotifyPropertyChanged, NotifyPropertyChanges, Animation, Effect, attributes, animationMode } from '@syncfusion/ej2-base';
import { EmitType, Event, BaseEventArgs, remove, removeClass } from '@syncfusion/ej2-base';
import { Complex, ChildProperty, SanitizeHtmlHelper } from '@syncfusion/ej2-base';
import { createSpinner, showSpinner, hideSpinner } from '@syncfusion/ej2-popups';
import { ProgressButtonModel, SpinSettingsModel, AnimationSettingsModel } from './progress-button-model';

const HIDESPINNER: string = 'e-hide-spinner';
const PROGRESS: string = 'e-progress';
const PROGRESSACTIVE: string = 'e-progress-active';
const CONTENTCLS: string = 'e-btn-content';
/**
 * Defines the spin settings.
 */
export class SpinSettings extends ChildProperty<SpinSettings> {
    /**
     * Specifies the template content to be displayed in a spinner.
     *
     * @default null
     * @aspType string
     */
    @Property(null)
    public template: string | Function;
    /**
     * Sets the width of a spinner.
     *
     * @default '16'
     */
    @Property(16)
    public width: string | number;
    /**
     * Specifies the position of a spinner in the progress button. The possible values are:
     * * Left: The spinner will be positioned to the left of the text content.
     * * Right: The spinner will be positioned to the right of the text content.
     * * Top: The spinner will be positioned at the top of the text content.
     * * Bottom: The spinner will be positioned at the bottom of the text content.
     * * Center: The spinner will be positioned at the center of the progress button.
     *
     * @default 'Left'
     * @aspType Syncfusion.EJ2.SplitButtons.SpinPosition
     * @blazorType Syncfusion.Blazor.SplitButtons.SpinPosition
     * @isEnumeration true
     */
    @Property('Left')
    public position: SpinPosition;
}
/**
 * Defines the animation settings.
 */
export class AnimationSettings extends ChildProperty<AnimationSettings> {
    /**
     * Specifies the duration taken to animate.
     *
     * @default 400
     */
    @Property(400)
    public duration: number;
    /**
     * Specifies the effect of animation.
     *
     * @default 'None'
     * @aspType Syncfusion.EJ2.SplitButtons.AnimationEffect
     * @blazorType Syncfusion.Blazor.SplitButtons.AnimationEffect
     * @isEnumeration true
     */
    @Property('None')
    public effect: AnimationEffect;
    /**
     * Specifies the animation timing function.
     *
     * @default 'ease'
     */
    @Property('ease')
    public easing: string;
}

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
    private interval: number;
    private eIsVertical: boolean;

    /**
     * Enables or disables the background filler UI in the progress button.
     *
     * @default false
     */
    @Property(false)
    public enableProgress: boolean;

    /**
     * Specifies the duration of progression in the progress button.
     *
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
     *
     * @isenumeration true
     * @default Syncfusion.EJ2.Buttons.IconPosition.Left
     * @asptype Syncfusion.EJ2.Buttons.IconPosition
     */
    @Property('Left')
    public iconPosition: string | IconPosition;

    /**
     * Defines class/multiple classes separated by a space for the progress button that is used to include an icon.
     * Progress button can also include font icon and sprite image.
     *
     * @default ""
     */
    @Property('')
    public iconCss: string;

    /**
     * Enables or disables the progress button.
     *
     * @default false.
     */
    @Property(false)
    public disabled: boolean;

    /**
     * Allows the appearance of the progress button to be enhanced and visually appealing when set to `true`.
     *
     * @default false
     */
    @Property(false)
    public isPrimary: boolean;

    /**
     * Specifies the root CSS class of the progress button that allows customization of component’s appearance.
     * The progress button types, styles, and size can be achieved by using this property.
     *
     * @default ""
     */
    @Property('')
    public cssClass: string;

    /**
     * Defines the text `content` of the progress button element.
     *
     * @default ""
     */
    @Property('')
    public content: string;

    /**
     * Makes the progress button toggle, when set to `true`. When you click it, the state changes from normal to active.
     *
     * @default false
     */
    @Property(false)
    public isToggle: boolean;

    /**
     * Specifies whether to enable the rendering of untrusted HTML values in the Progress button component.
     * If 'enableHtmlSanitizer' set to true, the component will sanitize any suspected untrusted strings and scripts before rendering them.
     *
     * @default true
     */
    @Property(true)
    public enableHtmlSanitizer: boolean;

    /**
     * Specifies a spinner and its related properties.
     */
    @Complex<SpinSettingsModel>({}, SpinSettings)
    public spinSettings: SpinSettingsModel;

    /**
     * Specifies the animation settings.
     */
    @Complex<AnimationSettingsModel>({}, AnimationSettings)
    public animationSettings: AnimationSettingsModel;

    /**
     * Triggers once the component rendering is completed.
     *
     * @event created
     * @blazorProperty 'Created'
     */
    @Event()
    public created: EmitType<Event>;

    /**
     * Triggers when the progress starts.
     *
     * @event begin
     * @blazorProperty 'OnBegin'
     */
    @Event()
    public begin: EmitType<ProgressEventArgs>;

    /**
     * Triggers in specified intervals.
     *
     * @event progress
     * @blazorProperty 'Progressing'
     */
    @Event()
    public progress: EmitType<ProgressEventArgs>;

    /**
     * Triggers when the progress is completed.
     *
     * @event end
     * @blazorProperty 'OnEnd'
     */
    @Event()
    public end: EmitType<ProgressEventArgs>;

    /**
     * Triggers when the progress is incomplete.
     *
     * @event fail
     * @blazorProperty 'OnFailure'
     */
    @Event()
    public fail: EmitType<Event>;

    /**
     * Constructor for creating the widget.
     *
     * @param  {ProgressButtonModel} options - Specifies progress button model
     * @param  {string|HTMLButtonElement} element - Specifies element
     */
    constructor(options?: ProgressButtonModel, element?: string | HTMLButtonElement) {
        super(options, element);
    }

    protected preRender(): void {
        super.preRender();
    }

    /**
     * Initialize the Component rendering
     *
     * @returns {void}
     * @private
     */
    public render(): void {
        super.render();
        this.init();
        this.wireEvents();
        this.setAria();
        this.renderComplete();
    }

    /**
     * Starts the button progress at the specified percent.
     *
     * @param {number} percent - Starts the button progress at this percent.
     * @returns {void}
     */
    public start(percent?: number): void {
        this.isPaused = false;
        this.startProgress(percent ? percent : this.percent, this.progressTime);
    }

    /**
     * Stops the button progress.
     *
     * @returns {void}
     */
    public stop(): void {
        this.isPaused = true;
        cancelAnimationFrame(this.timerId);
    }

    /**
     * Complete the button progress.
     *
     * @returns {void}
     */
    public progressComplete(): void {
        this.isPaused = false;
        this.finishProgress();
    }

    /**
     * Get component name.
     *
     * @returns {string} - Module Name
     * @private
     */
    public getModuleName(): string {
        return 'progress-btn';
    }

    /**
     * Destroys the widget.
     *
     * @returns {void}
     */
    public destroy(): void {
        let classList: string[] = [HIDESPINNER, PROGRESSACTIVE, 'e-round-corner', 'e-' + super.getModuleName()];
        if (this.spinSettings.position) {
            classList.push('e-spin-' + this.spinSettings.position.toLowerCase());
        }
        super.destroy();
        this.unWireEvents();
        this.element.innerHTML = '';
        if (this.cssClass) {
            classList = classList.concat(this.cssClass.split(' '));
        }
        removeClass([this.element], classList);
        const css: string[] = this.element.getAttribute('class') ? ['aria-label', 'aria-valuemin', 'aria-valuemax', 'aria-valuenow']
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
        const spinner: HTMLElement = this.createElement('span', { className: 'e-spinner' });
        this.setSpinPosition(spinner);
        createSpinner(
            {
                target: spinner, width: this.spinSettings.width || 16, template: this.spinSettings.template as string
            },
            this.createElement);
    }

    private getSpinner(): HTMLElement {
        return this.element.getElementsByClassName('e-spinner')[0] as HTMLElement;
    }

    private getProgress(): HTMLElement {
        return this.element.getElementsByClassName(PROGRESS)[0] as HTMLElement;
    }

    private setSpinPosition(ele: HTMLElement): void {
        const position: SpinPosition = this.spinSettings.position || 'Left';
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
        let cont: string;
        cont = this.element.innerHTML;
        if (this.enableHtmlSanitizer) {
            cont = SanitizeHtmlHelper.sanitize(this.element.innerHTML);
        }
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
        const clsList: DOMTokenList = this.element.classList;
        const isVertical: boolean = clsList.contains('e-vertical');
        clsList.add(PROGRESSACTIVE);
        if (!(clsList.contains(HIDESPINNER))) {
            showSpinner(this.element.querySelector('.e-spinner'));
        }
        this.startAnimate(
            Date.now(), progressTime ? progressTime : 0, progressTime ? Date.now() - (this.duration * 1 / 100) : Date.now(),
            percent ? percent : 0, 0, this.step, 0, isVertical);
        this.startContAnimate();
    }

    private startAnimate(
        timestamp: number, progressTime: number, prevTime: number, percent: number, prevPercent: number,
        step: number, prevProgressTime: number, isVertical: boolean): void {
        try {
            const timeDiff: number = timestamp - prevTime;
            const stepTime: number = this.duration * step / 100;
            const timeDiffBuffer: number = timeDiff ? (timeDiff < stepTime ? timeDiff - stepTime : timeDiff % stepTime) : 0;
            this.progressTime = progressTime = progressTime + timeDiff - timeDiffBuffer;
            prevTime = timestamp - timeDiffBuffer;
            percent = percent + (timeDiff - timeDiffBuffer) / this.duration * 100;
            prevPercent = ((progressTime - prevProgressTime) % stepTime === 0 || percent === 100) ? percent : prevPercent;
            const args: ProgressEventArgs = { percent: prevPercent, currentDuration: progressTime, step: step };
            this.eIsVertical = isVertical;
            if (percent === 0) {
                this.trigger('begin', args, (observedArgs: ProgressEventArgs) => {
                    this.successCallback(observedArgs, percent, prevPercent, progressTime, prevProgressTime, timeDiffBuffer, prevTime);
                });
            } else if (percent === 100 || progressTime === this.duration) {
                this.trigger('end', args, (observedArgs: ProgressEventArgs) => {
                    this.successCallback(observedArgs, percent, prevPercent, progressTime, prevProgressTime, timeDiffBuffer, prevTime);
                });
            } else {
                this.trigger('progress', args, (observedArgs: ProgressEventArgs) => {
                    this.successCallback(observedArgs, percent, prevPercent, progressTime, prevProgressTime, timeDiffBuffer, prevTime);
                });
            }
        } catch (e) {
            cancelAnimationFrame(this.timerId);
            this.trigger('fail', e);
        }
    }

    private successCallback(
        args: ProgressEventArgs, perc: number, pPerc: number, prgTim: number, pPrgTim: number, timDif: number, pTim: number): void {
        let percent: number = perc; let prevPercent: number = pPerc; const timeDiffBuffer: number = timDif;
        const progressTime: number = prgTim; let prevProgressTime: number = pPrgTim;
        const prevTime: number = pTim; const isVertical: boolean = this.eIsVertical;
        if (percent !== args.percent && args.percent !== prevPercent) {
            percent = args.percent;
        }
        this.percent = percent;
        this.step = args.step;
        if ((progressTime - prevProgressTime) % (this.duration * args.step / 100) === 0 || percent === 100) {
            this.timerId = requestAnimationFrame(() => {
                if (this.enableProgress && this.getProgress()) {
                    this.getProgress().style[isVertical ? 'height' : 'width'] = percent + '%';
                }
                this.element.setAttribute('aria-valuenow', percent.toString());
            });
            prevPercent = percent;
            prevProgressTime = progressTime;
        }
        if (!this.isPaused) {
            if (progressTime < this.duration && percent < 100) {
                this.interval = window.setTimeout(() => {
                    this.startAnimate(
                        Date.now(), progressTime, prevTime, percent,
                        prevPercent, args.step, prevProgressTime, isVertical);
                }, (this.duration / 100) - timeDiffBuffer);
            } else {
                this.interval = window.setTimeout(() => {
                    this.progressTime = this.percent = 0;
                    if (this.enableProgress && this.getProgress()) {
                        this.getProgress().style[isVertical ? 'height' : 'width'] = '0%';
                    }
                    this.element.setAttribute('aria-valuenow', '0');
                    this.hideSpin();
                }, 100);
            }
        }
    }
    private startContAnimate(): void {
        const ele: HTMLElement = this.element.getElementsByClassName(CONTENTCLS)[0] as HTMLElement;
        if (this.animationSettings.effect !== 'None') {
            (new Animation({})).animate(
                ele,
                {
                    duration: (this.animationSettings.duration === 0 && animationMode === 'Enable') ? 400 : this.animationSettings.duration,
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

    private finishProgress(): void {
        const clsList: DOMTokenList = this.element.classList;
        const isVertical: boolean = clsList.contains('e-vertical');
        clsList.add(PROGRESSACTIVE);
        const count: number = 100;
        for (let i: number = this.percent; i < count; i++) {
            i += 10;
            if (i > 100) {
                i = 100;
            }
            if (this.enableProgress && this.getProgress()) {
                this.getProgress().style[isVertical ? 'height' : 'width'] = (this.percent < 100) ? (i + '%') : '100%';
            }
        }
        this.element.setAttribute('aria-valuenow', '0');
        this.hideSpin();
        const args: ProgressEventArgs = {step: this.step, currentDuration: this.progressTime, percent: 100};
        clearTimeout(this.interval);
        this.trigger('end', args);
        this.progressTime = this.percent = 0;
    }

    private setSpinnerSize(): void {
        const ele: HTMLElement = this.element.getElementsByClassName(CONTENTCLS)[0] as HTMLElement;
        const spinner: HTMLElement = this.getSpinner();
        spinner.style.width = Math.max(spinner.offsetWidth, ele.offsetWidth) + 'px';
        spinner.style.height = Math.max(spinner.offsetHeight, ele.offsetHeight) + 'px';
        ele.classList.add('e-cont-animate');
    }

    private hideSpin(): void {
        const cont: Element = this.element.getElementsByClassName(CONTENTCLS)[0];
        if (!(this.element.classList.contains(HIDESPINNER))) {
            hideSpinner(this.element.querySelector('.e-spinner'));
        }
        this.element.classList.remove(PROGRESSACTIVE);
        if (this.animationSettings.effect !== 'None') {
            cont.classList.remove('e-animate-end');
        }
        if (this.spinSettings.position === 'Center') {
            const ele: HTMLElement = this.getSpinner();
            cont.classList.remove('e-cont-animate');
            ele.style.width = 'auto';
            ele.style.height = 'auto';
        }
    }

    private setIconSpan(): void {
        const cont: Element = this.element.getElementsByClassName(CONTENTCLS)[0];
        const iconSpan: Element = this.element.getElementsByClassName('e-btn-icon')[0];
        if (cont.childNodes[0] && (this.iconPosition === 'Left' || this.iconPosition === 'Top')) {
            cont.insertBefore(iconSpan, cont.childNodes[0]);
        } else {
            cont.appendChild(iconSpan);
        }
    }

    private setAria(): void {
        attributes(this.element, {
            'aria-label': this.element.textContent + ' progress'
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
     *
     * @param  {ProgressButtonModel} newProp - Specifies new properties
     * @param  {ProgressButtonModel} oldProp - Specifies old properties
     * @returns {void}
     * @private
     */
    public onPropertyChanged(newProp: ProgressButtonModel, oldProp: ProgressButtonModel): void {
        const ele: HTMLButtonElement = this.element; let isSpinning: boolean = false;
        const clsList: DOMTokenList = this.element.querySelector('.e-spinner-pane').classList;
        if (clsList.contains('e-spin-show')) {
            isSpinning = true;
        }
        super.onPropertyChanged(newProp, oldProp);
        for (const prop of Object.keys(newProp)) {
            switch (prop) {
            case 'content':
                this.setContent();
                this.createSpinner();
                if (isSpinning) {
                    showSpinner(this.element.querySelector('.e-spinner'));
                    isSpinning = false;
                }
                if (this.enableProgress) {
                    this.createProgress();
                }
                ele.setAttribute('aria-label', ele.textContent + ' progress');
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
                    remove(this.getProgress());
                }
                break;
            case 'spinSettings':
                if (newProp.spinSettings.position) {
                    ele.classList.remove('e-spin-' + oldProp.spinSettings.position.toLowerCase());
                    this.setSpinPosition(this.getSpinner());
                }
                if (newProp.spinSettings.template || newProp.spinSettings.width) {
                    ele.removeChild(this.getSpinner());
                    this.createSpinner();
                }
                break;
            }
        }
    }

    /**
     * Sets the focus to ProgressButton
     * its native method
     *
     * @public
     * @returns {void}
     */
    public focusIn(): void {
        this.element.focus();
    }
}
/**
 * Defines the spin position of progress button.
 * ```props
 * Left :- The spinner will be positioned to the left of the text content.
 * Right :- The spinner will be positioned to the right of the text content.
 * Top :- The spinner will be positioned at the top of the text content.
 * Bottom :- The spinner will be positioned at the bottom of the text content.
 * Center :- The spinner will be positioned at the center of the progress button.
 * ```
 */
export type SpinPosition = 'Left' | 'Right' | 'Top' | 'Bottom' | 'Center';
/**
 * Defines the animation effect of progress button.
 * ```props
 * None :- The button will not have any animation effect on the text content.
 * SlideLeft :- The text content will slide to the left as an animation effect.
 * SlideRight :- The text content will slide to the right as an animation effect.
 * SlideUp :- The text content will slide up as an animation effect.
 * SlideDown :- The text content will slide down as an animation effect.
 * ZoomIn :- The text content will zoom in as an animation effect.
 * ZoomOut :- The text content will zoom out as an animation effect.
 * ```
 */
export type AnimationEffect = 'None' | 'SlideLeft' | 'SlideRight' | 'SlideUp' | 'SlideDown' | 'ZoomIn' | 'ZoomOut';
/**
 * Interface for progress event arguments.
 */
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
     *
     * @default 1
     */
    step: number;
}
