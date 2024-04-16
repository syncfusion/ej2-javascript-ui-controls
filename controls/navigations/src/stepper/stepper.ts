// eslint-disable-next-line @typescript-eslint/triple-slash-reference
///<reference path='../stepper-base/stepper-base-model.d.ts'/>
import { INotifyPropertyChanged, attributes, NotifyPropertyChanges, L10n, append, isNullOrUndefined, getUniqueID, Complex, KeyboardEvents, KeyboardEventArgs, ChildProperty, Property, EventHandler, Event, EmitType, BaseEventArgs, addClass, remove, removeClass, initializeCSPTemplate, select, compile } from '@syncfusion/ej2-base';
import { StepperBase, StepStatus } from '../stepper-base/stepper-base';
import { StepperModel, StepperAnimationSettingsModel } from '../stepper';
import { StepModel } from '../stepper-base/stepper-base-model';
import { Tooltip } from '@syncfusion/ej2-popups';

const ITEMCONTAINER: string = 'e-step-container';
const ITEMLIST: string = 'e-stepper-steps';
const ICONCSS: string = 'e-indicator';
const TEXTCSS: string = 'e-step-text-container';
const STEPLABEL: string = 'e-step-label-container';
const OPTIONAL: string = 'e-step-label-optional';
const SELECTED: string = 'e-step-selected';
const INPROGRESS: string = 'e-step-inprogress';
const NOTSTARTED: string = 'e-step-notstarted';
const FOCUS: string = 'e-step-focus';
const COMPLETED: string = 'e-step-completed';
const DISABLED: string = 'e-step-disabled';
const READONLY: string = 'e-stepper-readonly';
const PROGRESSVALUE: string = '--progress-value';
const RTL: string = 'e-rtl';
const TEMPLATE: string = 'e-step-template';
const LABELAFTER: string = 'e-label-after';
const LABELBEFORE: string = 'e-label-before';
const VERTICALSTEP: string = 'e-vertical';
const HORIZSTEP: string = 'e-horizontal';
const STEPICON: string = 'e-step-icon';
const STEPTEXT: string = 'e-step-text';
const TEXT: string = 'e-text';
const STEPSLABEL: string = 'e-step-label';
const LABEL: string = 'e-label';
const STEPINDICATOR: string = 'e-step-type-indicator';
const LABELINDICATOR: string = 'e-step-type-label';
const INDICATORICON: string = 'e-step-indicator';
const STEPPERTOOLTIP: string = 'e-stepper-tooltip';
const STEPPERIPROGRESSTIP: string = 'e-step-inprogress-tip';

/**
 * Defines the step progress animation of the Stepper.
 */
export class StepperAnimationSettings extends ChildProperty<StepperAnimationSettings>  {

    /**
     * Defines whether a animation is enabled or disabled.
     *
     * @default true
     */
    @Property(true)
    public enable: boolean;

    /**
     * duration in milliseconds
     *
     * @default 2000
     * @aspType int
     */
    @Property(2000)
    public duration: number;

    /**
     * delay in milliseconds
     *
     * @default 0
     * @aspType int
     */
    @Property(0)
    public delay: number;
}

/**
 * Defines the label position in the Stepper.
 */
export enum StepLabelPosition {
    /**
     * Displays the label on top position regardless of the Stepper's orientation.
     */
    Top = 'Top',
    /**
     * Displays the label on bottom position regardless of the Stepper's orientation.
     */
    Bottom = 'Bottom',
    /**
     * Displays the label on left side regardless of the Stepper's orientation.
     */
    Start = 'Start',
    /**
     * Displays the label on right side regardless of the Stepper's orientation.
     */
    End = 'End'
}

/**
 * Defines whether steps are display with only indicator, only labels or combination of both.
 */
export enum StepType {
    /**
     * Steps are shown indicator with label defined.
     */
    Default = 'Default',
    /**
     * Steps are shown with only label.
     */
    Label = 'Label',
    /**
     * Steps are shown with only indicator.
     */
    Indicator = 'Indicator'
}

/**
 * Provides information about stepChanged event callback.
 */
export interface StepperChangedEventArgs extends BaseEventArgs {
    /**
     * Provides the original event.
     */
    event: Event;

    /**
     * Provides whether the change is triggered by user interaction.
     */
    isInteracted: boolean;

    /**
     * Provides the index of the previous step.
     */
    previousStep: number;

    /**
     * Provides the index of the current step.
     */
    activeStep: number;

    /**
     * Provides the stepper element.
     */
    element: HTMLElement;
}

/**
 * Provides information about stepChanging event callback.
 */
export interface StepperChangingEventArgs extends StepperChangedEventArgs {
    /**
     * Provides whether the change has been prevented or not. Default value is false.
     */
    cancel: boolean;
}

/**
 * Provides information about stepClick event callback.
 */
export interface StepperClickEventArgs extends BaseEventArgs {
    /**
     * Provides the original event.
     */
    event: Event;

    /**
     * Provides the index of the previous step.
     */
    previousStep: number;

    /**
     * Provides the index of the current step.
     */
    activeStep: number;

    /**
     * Provides the stepper element.
     */
    element: HTMLElement;
}

/**
 * Provides information about beforeStepRender event callback.
 */
export interface StepperRenderingEventArgs extends BaseEventArgs {
    /**
     * Provides the stepper element.
     */
    element: HTMLElement;

    /**
     * Provides the index of the current step.
     */
    index: number;
}

/**
 * The Stepper component visualizes several steps and indicates the current progress by highlighting already completed steps.
 *
 * ```html
 * <nav id="stepper"></nav>
 * ```
 * ```typescript
 * <script>
 *   let stepperObj: Stepper = new Stepper({steps : [{}, {}, {}, {}, {}]});
 *   stepperObj.appendTo('#stepper');
 * </script>
 * ```
 */
@NotifyPropertyChanges
export class Stepper extends StepperBase implements INotifyPropertyChanged {

    /**
     * Defines the current step index of the Stepper.
     *
     * {% codeBlock src='stepper/activeStep/index.md' %}{% endcodeBlock %}
     *
     * @default 0
     * @aspType int
     */
    @Property(0)
    public activeStep: number;

    /**
     * Defines the step progress animation of the Stepper.
     *
     * {% codeBlock src='stepper/animation/index.md' %}{% endcodeBlock %}
     *
     */
    @Complex<StepperAnimationSettingsModel>({}, StepperAnimationSettings)
    public animation: StepperAnimationSettingsModel;

    /**
     * Defines whether allows to complete one step in order to move to the next or not.
     *
     * {% codeBlock src='stepper/linear/index.md' %}{% endcodeBlock %}
     *
     * @default false
     */
    @Property(false)
    public linear: boolean;

    /**
     * Defines a value that defines whether to show tooltip or not on each step.
     *
     * @default false
     */
    @Property(false)
    public showTooltip: boolean;

    /**
     * Defines the template content for each step.
     *
     * {% codeBlock src='stepper/template/index.md' %}{% endcodeBlock %}
     *
     * @default ''
     * @aspType string
     */
    @Property('')
    public template: string | Function;

    /**
     * Defines the template content for the tooltip.
     *
     * @default ''
     * @aspType string
     */
    @Property('')
    public tooltipTemplate: string | Function;

    /**
     * Defines the label position in the Stepper.
     *
     * The possible values are:
     * * Top
     * * Bottom
     * * Start
     * * End
     *
     * {% codeBlock src='stepper/labelPosition/index.md' %}{% endcodeBlock %}
     *
     * @isenumeration true
     * @default StepLabelPosition.Bottom
     * @asptype StepLabelPosition
     */
    @Property(StepLabelPosition.Bottom)
    public labelPosition: string | StepLabelPosition;

    /**
     * Defines whether steps are display with only indicator, only labels or combination of both.
     *
     * The possible values are:
     * * Default
     * * Label
     * * Indicator
     *
     * {% codeBlock src='stepper/stepType/index.md' %}{% endcodeBlock %}
     *
     * @isenumeration true
     * @default StepType.Default
     * @asptype StepType
     */
    @Property(StepType.Default)
    public stepType: string | StepType;

    /**
     * Event triggers after active step changed. 
     *
     * @event stepChanged
     */
    @Event()
    public stepChanged: EmitType<StepperChangedEventArgs>;

    /**
     * Event triggers before active step change.
     *
     * @event stepChanging
     */
    @Event()
    public stepChanging: EmitType<StepperChangingEventArgs>;

    /**
     * Event triggers when clicked on step.
     *
     * @event stepClick
     */
    @Event()
    public stepClick: EmitType<StepperClickEventArgs>;

    /**
     * Event triggers before rendering each step.
     *
     * @event beforeStepRender
     */
    @Event()
    public beforeStepRender: EmitType<StepperRenderingEventArgs>;

    /* Private variables */
    private stepperItemList: HTMLElement;
    private stepperItemContainer: HTMLElement;
    private labelContainer: HTMLElement;
    private textContainer: HTMLElement;
    private stepperItemElements: HTMLElement[] = [];
    private beforeLabelWidth: number;
    private textEleWidth: number;
    private tooltipObj: Tooltip;
    private tooltipOpen: boolean;
    private isReact?: boolean;
    private templateFunction: Function;
    private keyboardModuleStepper: KeyboardEvents;
    private keyConfigs: { [key: string]: string };
    private l10n: L10n;
    private isKeyNavFocus: boolean;
    private isAngular: boolean;

    /**
     * * Constructor for creating the Stepper component.
     *
     * @param {StepperModel} options - Specifies the Stepper model.
     * @param {string | HTMLElement} element - Specifies the element to render as component.
     * @private
     */
    constructor(options?: StepperModel, element?: string | HTMLElement) {
        super(options, element);
    }

    protected preRender(): void {
        if (!this.element.id) {
            this.element.id = getUniqueID('e-' + this.getModuleName());
        }
        const localeText: object = { optional: 'Optional' };
        this.l10n = new L10n('stepper', localeText, this.locale);
        this.keyConfigs = {
            downarrow: 'downarrow',
            leftarrow: 'leftarrow',
            rightarrow: 'rightarrow',
            uparrow: 'uparrow',
            space: 'space',
            enter: 'enter',
            home: 'home',
            end: 'end',
            tab: 'tab',
            shiftTab: 'shift+tab',
            escape: 'escape'
        };
        this.tooltipOpen = false;
    }

    /**
     * To get component name.
     *
     * @returns {string} - Module Name
     * @private
     */
    public getModuleName(): string {
        return 'stepper';
    }

    protected render(): void {
        this.initialize();
        this.navigationHandler(this.activeStep, null, false);
        this.updateStepperStatus(true);
    }

    private initialize(): void {
        this.element.setAttribute('aria-label', this.element.id);
        this.updatePosition();
        this.stepperItemList = this.createElement('ol', { className: ITEMLIST });
        this.updateOrientaion(this.element);
        this.updateStepType();
        this.element.appendChild(this.stepperItemList);
        if (this.cssClass) {
            addClass([this.element], this.cssClass.trim().split(' '));
        }
        if (this.readOnly) {
            this.element.classList.add(READONLY);
        }
        if (this.enableRtl) {
            this.element.classList.add(RTL);
        }
        this.wireEvents();
        this.updateTemplateFunction();
        this.renderItems();
        if (this.steps.length > 0) {
            if (this.steps.length > 1) {
                if (this.isAngular && this.template) {
                    setTimeout(() => {
                        this.renderProgressBar(this.element); 
                    });
                }
                else {
                    this.renderProgressBar(this.element); 
                }
            }
            this.checkValidStep();
            this.updateAnimation();
            this.updateTooltip();
            this.wireKeyboardEvent();
        }
    }

    private updatePosition(): void {
        this.progressBarPosition = this.beforeLabelWidth = this.textEleWidth = 0;
    }

    private renderDefault(index: number): boolean {
        return (!this.steps[parseInt((index).toString(), 10)].iconCss && !this.steps[parseInt((index).toString(), 10)].text &&
            !this.steps[parseInt((index).toString(), 10)].label) ? true : false;
    }

    private updateAnimation(): void {
        const progressEle: HTMLElement = this.element.querySelector('.e-progressbar-value');
        if (this.animation.enable) {
            if (this.animation.duration >= 0) {
                if (progressEle) { progressEle.style.setProperty('--duration', ((this.animation.duration) + 'ms')); }
            }
            if (this.animation.delay >= 0) {
                if (progressEle) { progressEle.style.setProperty('--delay', ((this.animation.delay) + 'ms')); }
            }
        }
        else {
            if (progressEle) {
                progressEle.style.setProperty('--delay', (0 + 'ms'));
                progressEle.style.setProperty('--duration', (0 + 'ms'));
            }
        }
    }

    private updateStepType(): void {
        if (this.stepType.toLowerCase() === 'indicator' || 'label' || 'default') {
            this.stepType.toLowerCase() !== 'default' ? this.element.classList.add('e-step-type-' + this.stepType.toLowerCase()) : '';
            if (((this.stepType.toLowerCase() === 'indicator' || 'label') && (this.labelContainer))) { this.clearLabelPosition(); }
        }
    }

    private wireEvents(): void {
        EventHandler.add(<HTMLElement & Window><unknown>window, 'resize', () => {
            if (this.stepperItemList && this.progressbar && this.element.classList.contains(HORIZSTEP)) {
                this.setProgressPosition(this.element, true);
            }
        }, this);
        EventHandler.add(<HTMLElement & Window><unknown>window, 'click', () => { this.updateStepFocus(); }, this);
    }

    private updateStepFocus(): void {
        if (this.isKeyNavFocus) {
            this.isKeyNavFocus = false;
            const isFocus: HTMLElement = this.element.querySelector('.' + FOCUS);
            if (isFocus) { isFocus.classList.remove(FOCUS); this.element.classList.remove('e-steps-focus'); }
        }
    }

    private updateStepperStatus(isInitial?: boolean): void {
        for (let index: number = 0; index < this.steps.length; index++) {
            const item: StepModel = this.steps[parseInt(index.toString(), 10)];
            const status: string = item.status.toLowerCase();
            if (isInitial && this.activeStep === 0 && index === 0) { item.status = StepStatus.InProgress; }
            if (item && status !== 'notstarted' && index === this.activeStep) {
                for (let i: number = 0; i < this.steps.length; i++) {
                    const itemElement: HTMLElement = this.stepperItemElements[parseInt(i.toString(), 10)];
                    itemElement.classList.remove(SELECTED, INPROGRESS, COMPLETED, NOTSTARTED);
                    const prevOnChange: boolean = this.isProtectedOnChange;
                    this.isProtectedOnChange = true;
                    if (status === 'completed') { this.updateStatusClass(i, index, itemElement) }
                    else { this.updateStatusClass(i, index, itemElement, true) }
                    this.isProtectedOnChange = prevOnChange;
                }
            } else if (item && status !== 'notstarted' && index !== this.activeStep) { this.navigationHandler(this.activeStep, null, true); }
        }
    }

    private updateStatusClass(currentStep: number, index: number, ele: HTMLElement, isInprogress?: boolean): void {
        const stepItem: StepModel = this.steps[parseInt(currentStep.toString(), 10)];
        if (currentStep < index) { ele.classList.add(COMPLETED); stepItem.status = StepStatus.Completed }
        else if (currentStep === index) { ele.classList.add(isInprogress ? INPROGRESS : COMPLETED, SELECTED); }
        else { ele.classList.add(NOTSTARTED); }
    }

    private renderItems(): void {
        for (let index: number = 0; index < this.steps.length; index++) {
            this.stepperItemContainer = this.createElement('li', { className: ITEMCONTAINER });
            this.stepperItemContainer.classList[(index === 0) ? 'add' : 'remove'](SELECTED, INPROGRESS);
            this.stepperItemContainer.classList[(index !== 0) ? 'add' : 'remove'](NOTSTARTED);
            if (this.element.classList.contains(HORIZSTEP)) { this.stepperItemContainer.style.setProperty('--max-width', 100 / this.steps.length + '%'); }
            const stepSpan: HTMLElement = this.createElement('span', { className: 'e-step' });
            if (this.renderDefault(index) && (isNullOrUndefined(this.template) || this.template === '')) {
                const isIndicator: boolean = (!this.element.classList.contains('e-step-type-default') && this.stepType.toLowerCase() === 'indicator') ? true : false;
                if (isIndicator) { stepSpan.classList.add('e-icons', INDICATORICON); }
                if (!isIndicator) {
                    stepSpan.classList.add('e-step-content');
                    stepSpan.innerHTML = (index + 1).toString();
                }
                this.stepperItemContainer.appendChild(stepSpan);
            }
            else if (isNullOrUndefined(this.template) || this.template === '') {
                let isRender: boolean = true;
                const item: StepModel = this.steps[parseInt(index.toString(), 10)];
                if (item.iconCss && (((!item.text && !item.label) || !this.element.classList.contains(LABELINDICATOR)))) {
                    const itemIcon: string[] = item.iconCss.trim().split(' ');
                    stepSpan.classList.add(ICONCSS);
                    for (let i: number = 0; i < itemIcon.length; i++) {
                        stepSpan.classList.add(itemIcon[parseInt(i.toString(), 10)]);
                    }
                    this.stepperItemContainer.appendChild(stepSpan);
                    this.stepperItemContainer.classList.add(STEPICON);
                    if ((this.element.classList.contains(HORIZSTEP) && (this.labelPosition.toLowerCase() === 'start' || this.labelPosition.toLowerCase() === 'end') && item.label) ||
                        (this.element.classList.contains(VERTICALSTEP) && (this.labelPosition.toLowerCase() === 'top' || this.labelPosition.toLowerCase() === 'bottom') && item.label)) {
                        this.element.classList.add('e-label-' + this.labelPosition.toLowerCase());
                        const textSpan: HTMLElement = this.createElement('span', { className: TEXTCSS + ' ' + TEXT });
                        textSpan.innerText = item.label;
                        this.stepperItemContainer.appendChild(textSpan);
                        this.stepperItemContainer.classList.add(STEPTEXT);
                        isRender = false;
                    }
                }
                if (item.text && (!item.iconCss || !this.element.classList.contains(STEPINDICATOR)) && isRender && !(item.iconCss && item.label)) {
                    if (!item.iconCss && this.element.classList.contains(STEPINDICATOR)) {
                        this.checkValidState(item, stepSpan);
                        const prevOnChange: boolean = this.isProtectedOnChange;
                        this.isProtectedOnChange = true;
                        item.label = null;
                        this.isProtectedOnChange = prevOnChange;
                    }
                    else {
                        this.textContainer = this.createElement('span', { className: TEXTCSS });
                        const textSpan: HTMLElement = this.createElement('span', { className: TEXT });
                        if (!item.label) {
                            textSpan.innerText = item.text;
                            (item.isValid !== null && (!item.iconCss || this.element.classList.contains(LABELINDICATOR))) ? this.textContainer.appendChild(textSpan) : textSpan.classList.add(TEXTCSS);
                            this.stepperItemContainer.appendChild((item.isValid !== null && (!item.iconCss || this.element.classList.contains(LABELINDICATOR))) ? this.textContainer : textSpan);
                            this.stepperItemContainer.classList.add(STEPTEXT);
                        }
                        if (!item.iconCss || this.element.classList.contains(LABELINDICATOR)) {
                            this.stepperItemContainer.classList.add('e-step-text-only');
                            if (!item.label && item.isValid !== null) {
                                const iconSpan: HTMLElement = this.createElement('span', { className: 'e-step-validation-icon e-icons' });
                                this.textContainer.appendChild(iconSpan);
                            }
                        }
                        if (item.label && this.element.classList.contains(LABELINDICATOR)) {
                            textSpan.innerText = item.label;
                        }
                        const prevOnChange: boolean = this.isProtectedOnChange;
                        this.isProtectedOnChange = true;
                        item.text = item.label ? null : item.text;
                        this.isProtectedOnChange = prevOnChange;
                    }
                }
                if (item.cssClass) {
                    addClass([this.stepperItemContainer], item.cssClass.trim().split(' '));
                }
                if (item.disabled) {
                    this.stepperItemContainer.classList[item.disabled ? 'add' : 'remove'](DISABLED);
                    attributes(this.stepperItemContainer, { 'tabindex': '-1', 'aria-disabled': 'true' });
                }
                if (item.label && (!item.iconCss || !this.element.classList.contains(STEPINDICATOR)) && isRender) {
                    if (!item.iconCss && !item.text && this.element.classList.contains(STEPINDICATOR)) {
                        this.checkValidState(item, stepSpan, true);
                    }
                    else if ((!((this.element.classList.contains(LABELINDICATOR)) && item.text)) || (this.element.classList.contains(LABELINDICATOR) && item.label)) {
                        this.labelContainer = this.createElement('span', { className: STEPLABEL });
                        const labelSpan: HTMLElement = this.createElement('span', { className: LABEL });
                        labelSpan.innerText = item.label;
                        this.labelContainer.appendChild(labelSpan);
                        this.stepperItemContainer.classList.add(STEPSLABEL);
                        this.updateLabelPosition();
                        if ((!item.iconCss && !item.text) || this.element.classList.contains(LABELINDICATOR)) {
                            this.stepperItemContainer.classList.add('e-step-label-only');
                            if (item.isValid !== null) {
                                const iconSpan: HTMLElement = this.createElement('span', { className: 'e-step-validation-icon e-icons' });
                                this.labelContainer.appendChild(iconSpan);
                            }
                        }
                    }
                }
                if (item.optional) {
                    const optionalSpan: HTMLElement = this.createElement('span', { className: OPTIONAL });
                    this.l10n.setLocale(this.locale);
                    const optionalContent: string = this.l10n.getConstant('optional');
                    optionalSpan.innerText = optionalContent;
                    if (item.label && (this.labelContainer && ((this.element.classList.contains(LABELAFTER) && !this.stepperItemContainer.classList.contains('e-step-label-only'))
                    || (this.element.classList.contains(HORIZSTEP) && this.element.classList.contains(LABELBEFORE) && !this.stepperItemContainer.classList.contains('e-step-label-only'))))
                    || (this.element.classList.contains(VERTICALSTEP) && this.element.classList.contains(LABELBEFORE))) {
                        this.labelContainer.appendChild(optionalSpan);
                    } else {
                        this.stepperItemContainer.appendChild(optionalSpan);
                    }
                }
                if (item.isValid !== null) { item.isValid ? this.stepperItemContainer.classList.add('e-step-valid') : this.stepperItemContainer.classList.add('e-step-error'); }
            }
            this.renderItemContent(index, false);
            if (this.stepperItemContainer.classList.contains(INPROGRESS)) { attributes(this.stepperItemContainer, { 'tabindex': '0', 'aria-current': 'true' }); }
            else { attributes(this.stepperItemContainer, { 'tabindex': '-1' }); }
            this.wireItemsEvents(this.stepperItemContainer, index);
            this.stepperItemElements.push(this.stepperItemContainer);
            const eventArgs: StepperRenderingEventArgs = { element: this.stepperItemContainer, index: index };
            this.trigger('beforeStepRender', eventArgs, (args: StepperRenderingEventArgs) => {
                this.stepperItemList.appendChild(args.element);
            });
            if (this.isAngular && this.template) {
                setTimeout(() => {
                    this.calculateProgressBarPosition(); 
                });
            }
            else {
                this.calculateProgressBarPosition();
            }
        }
        if (this.element.classList.contains(VERTICALSTEP)) {
            if (this.element.classList.contains(LABELBEFORE)) {
                const listItems: NodeListOf<Element> = this.stepperItemList.querySelectorAll('.' + LABEL);
                for (let i: number = 0; i < listItems.length; i++) {
                    const labelEle: HTMLElement = listItems[parseInt((i).toString(), 10)] as HTMLElement;
                    labelEle.style.setProperty('--label-width', (this.beforeLabelWidth) + 5 + 'px');
                }
            }
        }
    }

    private calculateProgressBarPosition(): void {
        const isBeforeLabel: boolean = (this.element.classList.contains(LABELBEFORE)) ? true : false;
        const isStepVertical: boolean = (this.element.classList.contains(VERTICALSTEP)) ? true : false;
        if (isStepVertical) {
            const iconOnly: boolean = (this.stepperItemContainer.classList.contains(STEPICON) && !this.stepperItemContainer.classList.contains(STEPTEXT) && !this.stepperItemContainer.classList.contains(STEPSLABEL)) ? true : false;
            const textEle: HTMLElement = (this.stepperItemContainer.querySelector('.' + TEXTCSS));
            if (textEle) { this.textEleWidth = this.textEleWidth < textEle.offsetWidth ? textEle.offsetWidth : this.textEleWidth; }
            if (isBeforeLabel) {
                let itemWidth: number;
                const labelWidth: number = (this.stepperItemContainer.querySelector('.' + LABEL) as HTMLElement).offsetWidth + 15;
                if (this.beforeLabelWidth < labelWidth) { this.beforeLabelWidth = labelWidth; }
                if ((this.element.querySelector('ol').lastChild as HTMLElement).querySelector('.' + ICONCSS)) {
                    itemWidth = (this.beforeLabelWidth + ((this.stepperItemContainer.querySelector('.' + ICONCSS) as HTMLElement).offsetWidth / 2));
                }
                else if ((this.stepperItemContainer.querySelector('.' + TEXTCSS) as HTMLElement)) {
                    itemWidth = (this.beforeLabelWidth + ((this.stepperItemContainer.querySelector('.' + TEXTCSS) as HTMLElement).offsetWidth / 2));
                }
                if (this.progressBarPosition < itemWidth) { this.progressBarPosition = itemWidth; }
            }
            else if (this.progressBarPosition < (iconOnly ? this.stepperItemContainer.offsetWidth : (this.element.querySelector('ol').lastChild.firstChild as HTMLElement).offsetWidth)) {
                this.progressBarPosition = iconOnly ? this.stepperItemContainer.offsetWidth : (this.element.querySelector('ol').lastChild.firstChild as HTMLElement).offsetWidth;
            }
        }
    }

    private checkValidState(item: StepModel, stepSpan: HTMLElement, isLabel?: boolean): void {
        if (item.isValid == null) {
            stepSpan.classList.add('e-step-content');
            if (isLabel) { stepSpan.innerHTML = item.label; }
            else { stepSpan.innerHTML = item.label ? item.label : item.text; }
            this.stepperItemContainer.appendChild(stepSpan);
        } else {
            stepSpan.classList.add(ICONCSS);
            this.stepperItemContainer.appendChild(stepSpan);
            this.stepperItemContainer.classList.add(STEPICON);
        }
    }

    private updateCurrentLabel(): string {
        let currentLabelPos: string;
        if (this.element.classList.contains(HORIZSTEP)) {
            currentLabelPos = this.labelPosition.toLowerCase() === 'top' ? 'before' : this.labelPosition.toLowerCase() === 'bottom' ? 'after' : this.labelPosition.toLowerCase();
        }
        else {
            currentLabelPos = this.labelPosition.toLowerCase() === 'start' ? 'before' : this.labelPosition.toLowerCase() === 'end' ? 'after' : this.labelPosition.toLowerCase();
        }
        return currentLabelPos;
    }

    private updateLabelPosition(): void {
        this.clearLabelPosition();
        this.labelContainer.classList.add('e-label-' + this.updateCurrentLabel());
        if (this.labelPosition.toLowerCase() === 'start' && this.orientation.toLowerCase() === 'vertical') {
            this.stepperItemContainer.firstChild ? this.stepperItemContainer.firstChild.before(this.labelContainer) : this.stepperItemContainer.appendChild(this.labelContainer);
        }
        else { this.stepperItemContainer.appendChild(this.labelContainer); }
        this.element.classList.add('e-label-' + this.updateCurrentLabel());
    }

    private clearLabelPosition(): void {
        const removeCss: string[] = this.labelContainer.classList.value.match(/(e-label-[after|before]+)/g);
        if (removeCss) {
            removeClass([this.labelContainer], removeCss);
            removeClass([this.element], removeCss);
        }
    }

    private checkValidStep(): void {
        for (let index: number = 0; index < this.steps.length; index++) {
            const item: StepModel = this.steps[parseInt(index.toString(), 10)];
            const itemElement: HTMLElement = this.stepperItemElements[parseInt(index.toString(), 10)];
            if (item.isValid !== null) {
                let indicatorEle: HTMLElement;
                let iconEle: HTMLElement;
                if (this.element.classList.contains(STEPINDICATOR) && !item.iconCss) {
                    indicatorEle = itemElement.querySelector('.' + ICONCSS);
                }
                else {
                    iconEle = itemElement.querySelector('.' + ICONCSS);
                }
                const textLabelIcon: HTMLElement = itemElement.querySelector('.e-step-validation-icon');
                const itemIcon: string[] = item.iconCss.trim().split(' ');
                const validStep: boolean = itemElement.classList.contains('e-step-valid');
                if (indicatorEle) {
                    indicatorEle.classList.add('e-icons', validStep ? 'e-check' : 'e-circle-info');
                }
                if (iconEle) {
                    for (let i: number = 0; i < itemIcon.length; i++) {
                        iconEle.classList.remove(itemIcon[parseInt(i.toString(), 10)]);
                    }
                    iconEle.classList.add('e-icons', validStep ? 'e-check' : 'e-circle-info');
                }
                if (textLabelIcon) {
                    textLabelIcon.classList.add(validStep ? 'e-circle-check' : 'e-circle-info');
                    if (this.element.classList.contains(VERTICALSTEP)) {
                        const labelEle: HTMLElement = (itemElement.querySelector('.' + LABEL) as HTMLElement);
                        const textEle: HTMLElement = (itemElement.querySelector('.' + TEXT) as HTMLElement);
                        const itemWidth: number = textEle ? textEle.offsetWidth + textEle.getBoundingClientRect().left :
                            labelEle.offsetWidth + labelEle.getBoundingClientRect().left;
                        const validationIcon: HTMLElement = (itemElement.querySelector('.e-step-validation-icon') as HTMLElement);
                        validationIcon.style.setProperty('--icon-position', (itemWidth + 20) + 'px');
                    }
                }
            }
        }
    }

    private updateTooltip(): void {
        if (this.showTooltip) {
            this.tooltipObj = new Tooltip({
                target: '.e-step-container', windowCollision: true,
                opensOn: 'Custom', cssClass: this.cssClass ? (STEPPERTOOLTIP + ' ' + this.cssClass) : STEPPERTOOLTIP,
                position: 'TopCenter'
            });
            this.tooltipObj.appendTo(this.stepperItemList);
        }
        else {
            if (!isNullOrUndefined(this.tooltipObj)) {
                this.tooltipObj.destroy();
                this.tooltipObj = null;
            }
        }
    }

    private wireItemsEvents(itemElement: HTMLElement, index: number): void {
        EventHandler.add(itemElement, 'click', (e: Event) => {
            if (this.linear) {
                const linearModeValue: number = index - this.activeStep;
                if (Math.abs(linearModeValue) === 1) { this.stepClickHandler(index, e, itemElement); }
            }
            else { this.stepClickHandler(index, e, itemElement); }
        }, this);
        EventHandler.add(itemElement, 'mouseover', () => this.openStepperTooltip(index), this);
        EventHandler.add(itemElement, 'mouseleave', () => this.closeStepperTooltip(), this);
    }

    private openStepperTooltip(index: number): void {
        const currentStep: StepModel = this.steps[parseInt(index.toString(), 10)];
        if (this.showTooltip && (currentStep.label || currentStep.text)) {
            if (!this.tooltipOpen) {
                this.updateTooltipContent(index);
                this.tooltipObj.open(this.stepperItemElements[parseInt((index).toString(), 10)]);
                if (this.stepType.toLocaleLowerCase() !== 'label' && ((this.stepType.toLocaleLowerCase() === 'indicator') ||
                    (currentStep.label !== '' && currentStep.iconCss !== ''))) {
                    const tooltipPopupClass: string = currentStep.status.toLowerCase() === 'inprogress' ?
                        `${STEPPERTOOLTIP} ${STEPPERIPROGRESSTIP} ${this.cssClass ? this.cssClass : ''}` : `${STEPPERTOOLTIP} ${this.cssClass ? this.cssClass : ''}`;
                    this.tooltipObj.setProperties({ cssClass: tooltipPopupClass.trim() });
                }
                this.tooltipOpen = true;
            }
        }
    }

    private closeStepperTooltip(): void {
        if (this.tooltipOpen) {
            this.tooltipObj.close();
            this.tooltipOpen = false;
        }
    }

    private updateTooltipContent(index: number): void {
        if (this.showTooltip) {
            if (this.isReact) { this.clearTemplate(['stepperTooltipTemplate']); }
            let content: string | HTMLElement;
            const currentStep: StepModel = this.steps[parseInt(index.toString(), 10)];
            if (this.tooltipTemplate) {
                content = this.createElement('span', { className: 'e-stepper-tooltip-content' });
                const templateFunction: Function = this.getTemplateFunction(this.tooltipTemplate);
                append(templateFunction({ value: currentStep }, this, 'stepperTooltipTemplate', (this.element.id + 'tooltipTemplate'), this.isStringTemplate), (content as HTMLElement));
                this.tooltipObj.setProperties({ content: content }, true);
            }
            else {
                const content: string = currentStep.label ? currentStep.label : currentStep.text;
                this.tooltipObj.setProperties({ content: initializeCSPTemplate(function () { return content; }) }, true);
            }
            this.renderReactTemplates();
        }
    }

    private stepClickHandler(index: number, e: Event, itemElement: HTMLElement): void {
        const clickEventArgs: StepperClickEventArgs = {
            element: itemElement, event: e, previousStep: this.activeStep,
            activeStep: index
        };
        this.trigger('stepClick', clickEventArgs);
        this.navigateToStep(index, e, itemElement, true);
    }

    private updateTemplateFunction(): void {
        this.templateFunction = this.template ? this.getTemplateFunction(this.template) : null;
    }

    private renderItemContent(index: number, isrerender: boolean): void {
        const listItems: NodeListOf<Element> = this.stepperItemList.querySelectorAll('li');
        if (isrerender) {
            this.removeItemContent(listItems[parseInt((index).toString(), 10)] as HTMLElement);
        }
        if (this.template) {
            isrerender ? listItems[parseInt((index).toString(), 10)].classList.add(TEMPLATE) :
                this.stepperItemContainer.classList.add(TEMPLATE);
            const item: StepModel = this.steps[parseInt(index.toString(), 10)];
            append(this.templateFunction({ step: item, currentStep: index }, this, 'stepperTemplate', (this.element.id + '_stepperTemplate'), this.isStringTemplate), isrerender ? listItems[parseInt((index).toString(), 10)] : this.stepperItemContainer);
        }
        this.renderReactTemplates();
    }

    private removeItemContent(ele: HTMLElement): void {
        ele.classList.remove(TEMPLATE);
        const firstChild: HTMLElement = ele.firstElementChild as HTMLElement;
        for (let i: number = 0; i < ele.childElementCount; i++) {
            firstChild.remove();
        }
    }

    private updateContent(): void {
        if (this.isReact) { this.clearTemplate(['stepperTemplate']); }
        for (let i: number = 0; i < this.steps.length; i++) {
            this.renderItemContent(i, true);
        }
    }

    /**
     * Gets template content based on the template property value.
     *
     * @param {string | Function} template - Template property value.
     * @returns {Function} - Return template function.
     * @hidden
     */
    private getTemplateFunction(template: string | Function): Function {
        if (typeof template === 'string') {
            let content: string = '';
            try {
                const tempEle: HTMLElement = select(template);
                if (tempEle) {
                    //Return innerHTML incase of jsrenderer script else outerHTML
                    content = tempEle.tagName === 'SCRIPT' ? tempEle.innerHTML : tempEle.outerHTML;
                } else {
                    content = template;
                }
            } catch (e) {
                content = template;
            }
            return compile(content);
        } else {
            /* eslint-disable-next-line  @typescript-eslint/no-explicit-any */
            return compile(template as any);
        }
    }

    private navigateToStep(index: number, e: Event, itemElement: HTMLElement, isInteracted: boolean, isUpdated?: boolean): void {
        const eventArgs: StepperChangingEventArgs = {
            element: itemElement, event: e, isInteracted: isInteracted,
            previousStep: this.activeStep, activeStep: index, cancel: false
        };
        if (isUpdated != false) {
            const previousStep: number = this.activeStep;
            this.trigger('stepChanging', eventArgs, (args: StepperChangingEventArgs) => {
                if (args.cancel) { return; }
                this.navigationHandler(index);
                const eventArgs: StepperChangedEventArgs = {
                    element: itemElement, event: e, isInteracted: isInteracted,
                    previousStep: previousStep, activeStep: this.activeStep
                };
                this.trigger('stepChanged', eventArgs);
            });
        }
        else {
            this.navigationHandler(index);
        }
    }

    private navigationHandler(index: number, stepStatus?: string, isUpdated?: boolean): void {
        index = (index >= this.steps.length - 1) ? this.steps.length - 1 : index;
        const Itemslength: number = this.stepperItemElements.length;
        if (index >= 0 && index < Itemslength - 1) {
            index = this.stepperItemElements[parseInt(index.toString(), 10)].classList.contains(DISABLED) ? this.activeStep : index;
        }
        const prevOnChange: boolean = this.isProtectedOnChange;
        this.isProtectedOnChange = true;
        this.activeStep = parseInt(index.toString(), 10);
        this.isProtectedOnChange = prevOnChange;
        for (let i: number = 0; i < this.steps.length; i++) {
            const itemElement: HTMLElement = this.stepperItemElements[parseInt(i.toString(), 10)];
            const item: StepModel = this.steps[parseInt(i.toString(), 10)];
            itemElement.classList.remove(SELECTED, INPROGRESS, COMPLETED, NOTSTARTED);
            if (i === this.activeStep) { itemElement.classList.add(SELECTED); }
            if (this.activeStep >= 0 && this.progressbar) {
                if (this.element.classList.contains(HORIZSTEP)) {
                    if ((this.element.classList.contains(LABELBEFORE) || this.element.classList.contains(LABELAFTER)) && !this.element.classList.contains(STEPINDICATOR) &&
                        this.stepperItemElements[parseInt(this.activeStep.toString(), 10)].classList.contains(STEPICON)) {
                        const progressPos: HTMLElement = (this.element.querySelector('.e-stepper-progressbar') as HTMLElement);
                        const selectedEle: HTMLElement = this.stepperItemElements[parseInt(this.activeStep.toString(), 10)].firstChild as HTMLElement;
                        let value: number = this.activeStep === 0 ? 0 :(selectedEle.offsetLeft - progressPos.offsetLeft + (selectedEle.offsetWidth / 2)) / progressPos.offsetWidth * 100;
                        if (this.element.classList.contains(RTL)) {
                            value = (progressPos.getBoundingClientRect().right - selectedEle.getBoundingClientRect().right + (selectedEle.offsetWidth / 2)) / progressPos.offsetWidth * 100;
                            this.progressbar.style.setProperty(PROGRESSVALUE, (value) + '%');
                        }
                        else { this.progressbar.style.setProperty(PROGRESSVALUE, (value) + '%'); }
                    }
                    else {
                        let totalLiWidth: number = 0;
                        let activeLiWidth: number = 0;
                        for (let j: number = 0; j < this.stepperItemElements.length; j++) {
                            totalLiWidth = totalLiWidth + this.stepperItemElements[parseInt(j.toString(), 10)].offsetWidth;
                            if (j <= this.activeStep) {
                                if (j < this.activeStep) { activeLiWidth = activeLiWidth + this.stepperItemElements[parseInt(j.toString(), 10)].offsetWidth; }
                                else if (j == this.activeStep && j !== 0) { activeLiWidth = activeLiWidth + (this.stepperItemElements[parseInt(j.toString(), 10)].offsetWidth / 2); }
                            }
                        }
                        const spaceWidth: number = (this.stepperItemList.offsetWidth - totalLiWidth) / (this.stepperItemElements.length - 1);
                        const progressValue: number = ((activeLiWidth + (spaceWidth * this.activeStep)) / this.stepperItemList.offsetWidth) * 100;
                        this.progressbar.style.setProperty(PROGRESSVALUE, (progressValue) + '%');
                    }
                } else { this.progressbar.style.setProperty(PROGRESSVALUE, ((100 / (this.steps.length - 1)) * index) + '%'); }
            }
            else if (this.activeStep < 0 && this.progressbar) { this.progressbar.style.setProperty(PROGRESSVALUE, 0 + '%'); }
            if (i === this.activeStep) { itemElement.classList.add(INPROGRESS); }
            else if (this.activeStep > 0 && i < this.activeStep) { itemElement.classList.add(COMPLETED); }
            else { itemElement.classList.add(NOTSTARTED); }
            if (itemElement.classList.contains(INPROGRESS)) { attributes(itemElement, { 'tabindex': '0', 'aria-current': 'true' }); }
            else { attributes(itemElement, { 'tabindex': '-1', 'aria-current': 'false' }); }
            const prevOnChange: boolean = this.isProtectedOnChange;
            this.isProtectedOnChange = true;
            if (isUpdated !== false) {
                if (i < this.activeStep || (this.steps.length - 1 === this.activeStep && item.status.toLowerCase() === "completed")) { item.status = StepStatus.Completed; }
                else if (i === this.activeStep) { item.status = StepStatus.InProgress; }
                else if (i > this.activeStep) { item.status = StepStatus.NotStarted; }
                if (stepStatus && this.activeStep === i) { item.status = stepStatus; }
                if (item.status.toLowerCase() === "completed") {
                    itemElement.classList.remove(SELECTED, INPROGRESS, NOTSTARTED);
                    itemElement.classList.add(COMPLETED);
                }
                if (item.status.toLowerCase() === "notstarted") {
                    itemElement.classList.remove(SELECTED, INPROGRESS, COMPLETED);
                    itemElement.classList.add(NOTSTARTED);
                }
            }
            this.isProtectedOnChange = prevOnChange;
            if (this.renderDefault(i) && this.element.classList.contains(STEPINDICATOR)) {
                if (itemElement.classList.contains(COMPLETED)) {
                    (itemElement.firstChild as HTMLElement).classList.remove('e-icons', 'e-step-indicator');
                    (itemElement.firstChild as HTMLElement).classList.add(ICONCSS, 'e-icons', 'e-check');
                }
                else if (itemElement.classList.contains(INPROGRESS) || itemElement.classList.contains(NOTSTARTED)) {
                    (itemElement.firstChild as HTMLElement).classList.remove(ICONCSS, 'e-icons', 'e-check');
                    (itemElement.firstChild as HTMLElement).classList.add('e-icons', 'e-step-indicator');
                }
            }
        }
    }

    private removeItemElements(): void {
        for (let i: number = 0; i < this.stepperItemElements.length; i++) {
            remove(this.stepperItemElements[parseInt(i.toString(), 10)]);
        }
        this.stepperItemElements = [];
    }

    public nextStep(): void {
        if (this.activeStep !== this.steps.length - 1) { this.navigateToStep(this.activeStep + 1, null, null, false); }
    }

    public previousStep(): void {
        if (this.activeStep > 0) { this.navigateToStep(this.activeStep - 1, null, null, false); }
    }

    public reset(): void {
        if (this.activeStep !== 0) {
            const isDisabled: boolean = this.stepperItemElements[0].classList.contains(DISABLED) ? true : false;
            this.navigateToStep(isDisabled ? -1 : 0, null, null, false);
        }
    }

    private updateElementClassArray(): void {
        const classArray: string[] = [RTL, READONLY, 'e-steps-focus', LABELAFTER, LABELBEFORE, 'e-label-top',
            'e-label-bottom', 'e-label-start', 'e-label-end', STEPINDICATOR, LABELINDICATOR, VERTICALSTEP, HORIZSTEP];
        removeClass([this.element], classArray);
    }

    public destroy(): void {
        super.destroy();
        EventHandler.remove(<HTMLElement & Window><unknown>window, 'resize', () => { if (this.stepperItemList && this.progressbar) { this.setProgressPosition(this.element, true); } });
        EventHandler.remove(<HTMLElement & Window><unknown>window, 'click', () => { this.updateStepFocus(); });
        // unwires the events and detach the li elements
        this.removeItemElements();
        this.clearTemplate();
        if (this.stepperItemList) { remove(this.stepperItemList); }
        this.stepperItemList = null;
        if (this.progressStep) { remove(this.progressStep); }
        this.progressStep = null;
        this.progressbar = null;
        this.progressBarPosition = null;
        this.stepperItemContainer = null;
        this.textContainer = null;
        this.labelContainer = null;
        this.updateElementClassArray();
        this.element.removeAttribute('aria-label');
        if (this.showTooltip) {
            this.tooltipObj.destroy();
            this.tooltipObj = null;
        }
        if (this.keyboardModuleStepper) { this.keyboardModuleStepper.destroy(); }
        this.keyboardModuleStepper = null;
    }

    private wireKeyboardEvent(): void {
        this.keyboardModuleStepper = new KeyboardEvents(this.element, {
            keyAction: this.keyActionHandler.bind(this),
            keyConfigs: this.keyConfigs,
            eventName: 'keydown'
        });
    }

    private keyActionHandler(e: KeyboardEventArgs): void {
        if (this.readOnly) { return; }
        switch (e.action) {
        case 'uparrow':
        case 'downarrow':
        case 'leftarrow':
        case 'rightarrow':
        case 'tab':
        case 'shiftTab':
            this.handleNavigation(this.enableRtl && this.element.classList.contains(HORIZSTEP) ? (e.action === 'leftarrow' || e.action === 'tab' || e.action === 'uparrow') : (e.action === 'rightarrow' || e.action === 'tab' || e.action === 'downarrow'), e);
            break;
        case 'space':
        case 'enter':
        case 'escape':
            this.handleNavigation(null, e);
            break;
        case 'home':
        case 'end':
            this.handleNavigation(null, e, this.enableRtl);
            break;
        }
    }

    private handleNavigation(isNextStep: boolean, e: KeyboardEventArgs, isRTL?: boolean): void {
        this.isKeyNavFocus = true;
        this.element.classList.add('e-steps-focus');
        let focusedEle: HTMLElement = this.element.querySelector('.' + FOCUS);
        if (!focusedEle) { focusedEle = this.element.querySelector('.' + SELECTED); }
        const stepItems: HTMLElement[] = Array.prototype.slice.call(this.stepperItemList.children);
        let index: number = stepItems.indexOf(focusedEle);
        if (e.action === 'tab' || e.action === 'shiftTab' || e.action === 'downarrow' || e.action === 'uparrow' || e.action === 'space' || e.action === 'home' || e.action === 'end') {
            if ((e.action === 'tab' && index === stepItems.length - 1) || (e.action === 'shiftTab' && index === 0)) {
                if (focusedEle.classList.contains(FOCUS)) { this.updateStepFocus(); return; }
            } else {
                e.preventDefault();
            }
        }
        if (e.action === 'escape') { stepItems[parseInt(index.toString(), 10)].classList.remove(FOCUS); this.element.classList.remove('e-steps-focus'); }
        if (!(e.action === 'space' || e.action === 'enter')) {
            const prevIndex: number = index;
            index = isNextStep ? index + 1 : index - 1;
            while ((index >= 0 && index < stepItems.length) && stepItems[parseInt(index.toString(), 10)].classList.contains(DISABLED)) {
                index = isNextStep ? index + 1 : index - 1;
            }
            index = (index < 0) ? 0 : (index > stepItems.length - 1) ? stepItems.length - 1 : index;
            if (stepItems[parseInt(prevIndex.toString(), 10)].classList.contains(FOCUS)) {
                stepItems[parseInt(prevIndex.toString(), 10)].classList.remove(FOCUS);
            }
            if ((e.action === 'home' || e.action === 'end')) {
                if (e.action === 'home') { isRTL ? index = stepItems.length - 1 : index = 0; }
                else { isRTL ? index = 0 : index = stepItems.length - 1; }
            }
            if (index >= 0 && index < stepItems.length) { stepItems[parseInt(index.toString(), 10)].classList.add(FOCUS); }
        } else if ((e.action === 'space' || e.action === 'enter')) {
            let isupdateFocus: boolean = false;
            if (this.linear) {
                const linearModeValue: number = this.activeStep - index;
                if (Math.abs(linearModeValue) === 1) { this.navigateToStep(index, null, null, true); isupdateFocus = true; }
            }
            else { this.navigateToStep(index, null, null, true); isupdateFocus = true; }
            if (isupdateFocus) {
                this.updateStepFocus();
                (this.stepperItemElements[index as number] as HTMLElement).focus();
            }
        }
    }

    private renderStepperItems(isUpdate: boolean, isStepType?: boolean): void {
        this.updateElementClassArray();
        this.removeItemElements();
        this.element.querySelector('.e-stepper-progressbar').remove();
        isUpdate ? this.updatePosition() : null;
        isStepType ? this.updateStepType() : null;
        this.readOnly ? (!this.element.classList.contains(READONLY)) ? this.element.classList.add(READONLY) : null : null;
        this.enableRtl ? (!this.element.classList.contains(RTL)) ? this.element.classList.add(RTL) : null : null;
        this.updateOrientaion(this.element);
        this.renderItems();
        this.renderProgressBar(this.element);
        this.checkValidStep();
        this.updateAnimation();
        this.navigateToStep(this.activeStep, null, this.stepperItemElements[this.activeStep], true);
    }

    /**
     * Called internally if any of the property value changed.
     *
     * @param  {StepperModel} newProp - Specifies new properties
     * @param  {StepperModel} oldProp - Specifies old properties
     * @returns {void}
     * @private
     */
    public onPropertyChanged(newProp: StepperModel, oldProp?: StepperModel): void {
        for (const prop of Object.keys(newProp)) {
            switch (prop) {
            case 'steps': {
                if (!(newProp.steps instanceof Array && oldProp.steps instanceof Array)) {
                    const stepCounts: Object[] = Object.keys(newProp.steps);
                    for (let i: number = 0; i < stepCounts.length; i++) {
                        const index: number = parseInt(Object.keys(newProp.steps)[i as number], 10);
                        const changedPropsCount: number = Object.keys(newProp.steps[index as number]).length;
                        for (let j: number = 0; j < changedPropsCount; j++) {
                            const property: string = Object.keys(newProp.steps[index as number])[j as number];
                            if (property === 'status') {
                                if (this.activeStep === index) {
                                    this.navigationHandler(index, newProp.steps[index as number].status);
                                } else {
                                    this.steps[index as number].status = oldProp.steps[index as number].status;
                                }
                            }
                            else { this.removeItemElements(); this.renderItems(); this.updateStepperStatus();}
                            this.checkValidStep();
                        }
                    }
                } else {
                    this.renderStepperItems(true, true);
                }
                break;
            }
            case 'orientation':
                this.updateOrientaion(this.element);
                this.renderStepperItems(true);
                break;
            case 'activeStep':
                this.activeStep = (newProp.activeStep > this.steps.length - 1 || newProp.activeStep < -1) ? oldProp.activeStep : this.activeStep;
                if (this.activeStep >= 0 && this.stepperItemElements[parseInt(this.activeStep.toString(), 10)].classList.contains(DISABLED)) {
                    this.activeStep = oldProp.activeStep;
                }
                if (this.linear) {
                    const linearModeValue: number = oldProp.activeStep - this.activeStep;
                    if (Math.abs(linearModeValue) === 1) { this.navigateToStep(this.activeStep, null, null, true); }
                }
                else { this.navigateToStep(this.activeStep, null, this.stepperItemElements[this.activeStep], true); }
                break;
            case 'enableRtl':
                this.element.classList[this.enableRtl ? 'add' : 'remove'](RTL);
                break;
            case 'readOnly':
                this.element.classList[this.readOnly ? 'add' : 'remove'](READONLY);
                break;
            case 'cssClass':
                if (oldProp.cssClass) {
                    removeClass([this.element], oldProp.cssClass.trim().split(' '));
                }
                if (newProp.cssClass) {
                    addClass([this.element], newProp.cssClass.trim().split(' '));
                }
                if (this.tooltipObj) {
                    this.tooltipObj.setProperties({ cssClass: this.cssClass ? (STEPPERTOOLTIP + ' ' + this.cssClass) : STEPPERTOOLTIP });
                }
                break;
            case 'labelPosition':
                this.renderStepperItems(true);
                break;
            case 'showTooltip':
                this.updateTooltip();
                break;
            case 'stepType':
                this.renderStepperItems(true, true);
                break;
            case 'template':
                this.updateTemplateFunction();
                this.updateContent();
                break;
            case 'animation':
                this.updateAnimation();
                break;
            }
        }
    }
}
