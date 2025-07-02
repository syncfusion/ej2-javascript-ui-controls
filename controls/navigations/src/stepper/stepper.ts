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
const STEPICON: string = 'e-step-item';
const STEPTEXT: string = 'e-step-text';
const TEXT: string = 'e-text';
const STEPSLABEL: string = 'e-step-label';
const LABEL: string = 'e-label';
const STEPINDICATOR: string = 'e-step-type-indicator';
const LABELINDICATOR: string = 'e-step-type-label';
const INDICATORICON: string = 'e-step-indicator';
const STEPPERTOOLTIP: string = 'e-stepper-tooltip';
const STEPPERIPROGRESSTIP: string = 'e-step-inprogress-tip';
const LINEARSTEP: string = 'e-linear';
const PREVSTEP: string = 'e-previous';
const NEXTSTEP: string = 'e-next';

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
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     */
    @Property('')
    public template: string | Function;

    /**
     * Defines the template content for the tooltip.
     *
     * @default ''
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
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
    private templateFunction: Function;
    private keyboardModuleStepper: KeyboardEvents;
    private keyConfigs: { [key: string]: string };
    private l10n: L10n;
    private isKeyNavFocus: boolean;

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
     * @returns {string} - It returns the current module name.
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
        if (this.readOnly) { this.element.classList.add(READONLY); }
        if (this.enableRtl) { this.element.classList.add(RTL); }
        this.wireEvents();
        this.updateTemplateFunction();
        this.renderItems();
        if (this.steps.length > 0) {
            this.initiateProgressBar();
            this.checkValidStep();
            this.updateAnimation();
            this.updateTooltip();
            this.wireKeyboardEvent();
        }
    }

    private initiateProgressBar(): void {
        if (this.steps.length > 1) {
            if (this.isAngular && this.template) {
                setTimeout(() => { this.renderProgressBar(this.element); });
            }
            else { this.renderProgressBar(this.element); }
        }
    }

    private updatePosition(): void {
        this.progressBarPosition = this.beforeLabelWidth = this.textEleWidth = 0;
    }

    private renderDefault(index: number): boolean {
        const step: StepModel = this.steps[parseInt(index.toString(), 10)];
        return !step.iconCss && !step.text && !step.label;
    }

    private updateAnimation(): void {
        const progressEle: HTMLElement = this.element.querySelector('.e-progressbar-value');
        if (this.animation.enable) {
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
        if (!isNullOrUndefined(this.stepType)) {
            const stepTypeLower: string = this.stepType.toLowerCase();
            const validStepTypes: string[] = ['indicator', 'label', 'default'];
            if (validStepTypes.indexOf(stepTypeLower) !== -1) {
                if (stepTypeLower !== 'default') { this.element.classList.add('e-step-type-' + stepTypeLower); }
                if ((stepTypeLower === 'indicator' || stepTypeLower === 'label') && this.labelContainer) { this.clearLabelPosition(); }
            }
        }
    }

    private wireEvents(): void {
        EventHandler.add(<HTMLElement & Window><unknown>window, 'resize', this.updateResize, this);
        EventHandler.add(<HTMLElement & Window><unknown>window, 'click', this.updateStepFocus, this);
    }

    private unWireEvents(): void {
        EventHandler.remove(<HTMLElement & Window><unknown>window, 'resize', this.updateResize);
        EventHandler.remove(<HTMLElement & Window><unknown>window, 'click', this.updateStepFocus);
    }

    private updateResize(): void {
        if (this.stepperItemList && this.progressbar && this.element.classList.contains(HORIZSTEP)) {
            this.setProgressPosition(this.element, true);
        }
        this.navigateToStep(this.activeStep, null, null, false, false);
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
            if (isInitial && this.activeStep === 0 && index === 0) {
                const prevOnChange: boolean = this.isProtectedOnChange;
                this.isProtectedOnChange = true;
                item.status = StepStatus.InProgress;
                this.isProtectedOnChange = prevOnChange;
            }
            if (item && status !== 'notstarted' && index === this.activeStep) {
                for (let i: number = 0; i < this.steps.length; i++) {
                    const itemElement: HTMLElement = this.stepperItemElements[parseInt(i.toString(), 10)];
                    itemElement.classList.remove(SELECTED, INPROGRESS, COMPLETED, NOTSTARTED);
                    const prevOnChange: boolean = this.isProtectedOnChange;
                    this.isProtectedOnChange = true;
                    if (status === 'completed') { this.updateStatusClass(i, index, itemElement); }
                    else { this.updateStatusClass(i, index, itemElement, true); }
                    this.isProtectedOnChange = prevOnChange;
                }
            } else if (item && status !== 'notstarted' && index !== this.activeStep) { this.navigationHandler(this.activeStep, null, true); }
        }
    }

    private updateStatusClass(currentStep: number, index: number, ele: HTMLElement, isInprogress?: boolean): void {
        const stepItem: StepModel = this.steps[parseInt(currentStep.toString(), 10)];
        if (currentStep < index) { ele.classList.add(COMPLETED); stepItem.status = StepStatus.Completed; }
        else if (currentStep === index) { ele.classList.add(isInprogress ? INPROGRESS : COMPLETED, SELECTED); }
        else { ele.classList.add(NOTSTARTED); }
    }

    private renderItems(): void {
        const isHorizontal: boolean = this.element.classList.contains(HORIZSTEP);
        const isVertical: boolean = this.element.classList.contains(VERTICALSTEP);
        const labelPositionLower: string  = !isNullOrUndefined(this.labelPosition) ? this.labelPosition.toLowerCase() : '';
        for (let index: number = 0; index < this.steps.length; index++) {
            this.stepperItemContainer = this.createElement('li', { className: ITEMCONTAINER });
            const stepSpan: HTMLElement = this.createElement('span', { className: 'e-step' });
            const item: StepModel = this.steps[parseInt(index.toString(), 10)];
            let isItemLabel: boolean = item.label ? true : false;
            let isItemText: boolean = item.text ? true : false;
            const isIndicator: boolean = this.element.classList.contains(STEPINDICATOR);
            this.stepperItemContainer.classList[(index === 0) ? 'add' : 'remove'](SELECTED, INPROGRESS);
            this.stepperItemContainer.classList[(index !== 0) ? 'add' : 'remove'](NOTSTARTED);
            if (isHorizontal) { this.stepperItemContainer.style.setProperty('--max-width', 100 / this.steps.length + '%'); }
            if (this.renderDefault(index) && (isNullOrUndefined(this.template) || this.template === '')) {
                const isIndicator: boolean = !this.element.classList.contains('e-step-type-default') && this.stepType.toLowerCase() === 'indicator';
                if (isIndicator) { stepSpan.classList.add('e-icons', INDICATORICON); }
                if (!isIndicator && item.isValid == null) {
                    stepSpan.classList.add('e-step-content');
                    stepSpan.innerHTML = (index + 1).toString();
                }
                this.stepperItemContainer.appendChild(stepSpan);
            }
            else if (isNullOrUndefined(this.template) || this.template === '') {
                let isRender: boolean = true;
                if ((item.iconCss || (!item.iconCss && isItemText && isItemLabel)) && (((!isItemText && !isItemLabel) ||
                !this.element.classList.contains(LABELINDICATOR)))) {
                    if (item.iconCss) {
                        const itemIcon: string[] = item.iconCss.trim().split(' ');
                        stepSpan.classList.add(ICONCSS, ...itemIcon);
                        this.stepperItemContainer.classList.add(STEPICON);
                    } else if (!item.iconCss && isItemText && isItemLabel) {
                        stepSpan.classList.add(ICONCSS);
                        stepSpan.innerHTML = item.text;
                        this.stepperItemContainer.classList.add(STEPICON);
                    }
                    this.stepperItemContainer.appendChild(stepSpan);
                    if (((isHorizontal && (labelPositionLower === 'start' || labelPositionLower === 'end') && isItemLabel) ||
                        (isVertical && (labelPositionLower === 'top' || labelPositionLower === 'bottom') && isItemLabel)) && !isIndicator) {
                        this.element.classList.add('e-label-' + labelPositionLower);
                        this.createTextLabelElement(item.label);
                        isRender = false;
                    }
                }
                if (isItemText && (!item.iconCss || !isIndicator) && isRender &&
                !(item.iconCss && isItemLabel)) {
                    if ((!item.iconCss && isIndicator) ||
                    ((!item.iconCss || this.element.classList.contains(LABELINDICATOR)) && !isItemLabel)) {
                        if (!item.iconCss && !isItemLabel) { this.element.classList.add('e-step-type-indicator'); }
                        this.checkValidState(item, stepSpan);
                        isItemLabel = false;
                    }
                    else {
                        if (!isItemLabel) { this.createTextLabelElement(item.text); }
                        if (isItemLabel && this.element.classList.contains(LABELINDICATOR)) {
                            const textSpan: HTMLElement = this.createElement('span', { className: TEXT });
                            textSpan.innerText = item.label;
                        }
                        isItemText = isItemLabel ? false : true;
                    }
                }
                if (isItemLabel && isItemLabel && (!item.iconCss || !isIndicator) && isRender) {
                    if (!item.iconCss && !isItemText && isIndicator) {
                        this.checkValidState(item, stepSpan, true);
                    }
                    else if ((!((this.element.classList.contains(LABELINDICATOR)) && isItemText)) ||
                    (this.element.classList.contains(LABELINDICATOR) && isItemLabel)) {
                        this.createTextLabelElement(item.label, true);
                        this.updateLabelPosition();
                        if ((!item.iconCss && !isItemText && !this.stepperItemContainer.classList.contains(STEPICON)) ||
                        this.element.classList.contains(LABELINDICATOR)) {
                            this.stepperItemContainer.classList.add('e-step-label-only');
                            if (item.isValid !== null) {
                                const iconSpan: HTMLElement = this.createElement('span', { className: 'e-step-validation-icon e-icons' });
                                this.labelContainer.appendChild(iconSpan);
                            }
                        }
                    }
                }
            }
            if (item.optional) {
                const optionalSpan: HTMLElement = this.createElement('span', { className: OPTIONAL });
                this.l10n.setLocale(this.locale);
                const optionalContent: string = this.l10n.getConstant('optional');
                optionalSpan.innerText = optionalContent;
                if (isItemLabel && (this.labelContainer && ((this.element.classList.contains(LABELAFTER) && !this.stepperItemContainer.classList.contains('e-step-label-only'))
                || (isHorizontal && this.element.classList.contains(LABELBEFORE) && !this.stepperItemContainer.classList.contains('e-step-label-only'))))
                || (isVertical && this.element.classList.contains(LABELBEFORE))) {
                    this.labelContainer.appendChild(optionalSpan);
                } else {
                    this.stepperItemContainer.appendChild(optionalSpan);
                }
                if (item.isValid !== null) { this.stepperItemContainer.classList.add(item.isValid ? 'e-step-valid' : 'e-step-error'); }
            }
            if (item.cssClass) {
                addClass([this.stepperItemContainer], item.cssClass.trim().split(' '));
            }
            if (item.disabled) {
                this.stepperItemContainer.classList[item.disabled ? 'add' : 'remove'](DISABLED);
                attributes(this.stepperItemContainer, { 'tabindex': '-1', 'aria-disabled': 'true' });
            }
            if (item.isValid !== null) {
                if (item.isValid) { this.stepperItemContainer.classList.add('e-step-valid'); }
                else { this.stepperItemContainer.classList.add('e-step-error'); }
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
            if (isVertical) {
                if (this.isAngular && this.template) {
                    setTimeout(() => { this.calculateProgressBarPosition(); });
                } else { this.calculateProgressBarPosition(); }
            }
        }
        if (isVertical) {
            if (this.element.classList.contains(LABELBEFORE)) {
                const listItems: NodeListOf<Element> = this.stepperItemList.querySelectorAll('.' + LABEL);
                for (let i: number = 0; i < listItems.length; i++) {
                    const labelEle: HTMLElement = listItems[parseInt((i).toString(), 10)] as HTMLElement;
                    labelEle.style.setProperty('--label-width', (this.beforeLabelWidth) + 5 + 'px');
                }
            }
        }
    }

    private createTextLabelElement(content: string, isLabelEle: boolean = false): void {
        const spanEle: HTMLElement = this.createElement('span', { className: isLabelEle ? LABEL : `${TEXTCSS} ${TEXT}` });
        spanEle.innerText = content;
        if (isLabelEle) {
            this.labelContainer = this.createElement('span', { className: STEPLABEL });
            this.labelContainer.appendChild(spanEle);
        } else { this.stepperItemContainer.appendChild(spanEle); }
        this.stepperItemContainer.classList.add(isLabelEle ? STEPSLABEL : STEPTEXT);
    }

    private calculateProgressBarPosition(): void {
        const isBeforeLabel: boolean = (this.element.classList.contains(LABELBEFORE)) ? true : false;
        const iconOnly: boolean = (this.stepperItemContainer.classList.contains(STEPICON) &&
        !this.stepperItemContainer.classList.contains(STEPTEXT) &&
        !this.stepperItemContainer.classList.contains(STEPSLABEL));
        const textEle: HTMLElement = (this.stepperItemContainer.querySelector('.' + TEXTCSS));
        if (textEle) { this.textEleWidth = this.textEleWidth < textEle.offsetWidth ? textEle.offsetWidth : this.textEleWidth; }
        if (isBeforeLabel) {
            const labelWidth: number = (this.stepperItemContainer.querySelector('.' + LABEL) as HTMLElement).offsetWidth + 15;
            this.beforeLabelWidth = Math.max(this.beforeLabelWidth, labelWidth);
            const iconEle: HTMLElement = (this.element.querySelector('ol').lastChild as HTMLElement).querySelector('.' + ICONCSS);
            const textEle: HTMLElement = this.stepperItemContainer.querySelector('.' + TEXTCSS);
            if (iconEle || textEle) {
                const itemWidth: number = this.beforeLabelWidth + (((this.stepperItemContainer.querySelector('.' + ICONCSS) as HTMLElement)
                || textEle).offsetWidth / 2);
                this.progressBarPosition = Math.max(this.progressBarPosition, itemWidth);
            } else {
                this.progressBarPosition = Math.max(this.progressBarPosition, (this.beforeLabelWidth / 2));
            }
        }
        else {
            const lastChild: HTMLElement = this.element.querySelector('ol').lastChild as HTMLElement;
            const lastChildWidth: number = iconOnly ? this.stepperItemContainer.offsetWidth :
                (lastChild.firstChild as HTMLElement).offsetWidth;
            this.progressBarPosition = Math.max(this.progressBarPosition, lastChildWidth);
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
        const labelPos: string = this.labelPosition.toLowerCase();
        const currentLabelPos: string = this.element.classList.contains(HORIZSTEP)
            ? (labelPos === 'top' ? 'before' : labelPos === 'bottom' ? 'after' : labelPos)
            : (labelPos === 'start' ? 'before' : labelPos === 'end' ? 'after' : labelPos);
        return currentLabelPos;
    }

    private updateLabelPosition(): void {
        this.clearLabelPosition();
        this.labelContainer.classList.add('e-label-' + this.updateCurrentLabel());
        if (this.labelPosition.toLowerCase() === 'start' && this.orientation.toLowerCase() === 'vertical') {
            if (this.stepperItemContainer.firstChild) { this.stepperItemContainer.firstChild.before(this.labelContainer); }
            else { this.stepperItemContainer.appendChild(this.labelContainer); }
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
        const isStepIndicator: boolean = this.element.classList.contains(STEPINDICATOR);
        for (let index: number = 0; index < this.steps.length; index++) {
            const item: StepModel = this.steps[parseInt(index.toString(), 10)];
            const itemElement: HTMLElement = this.stepperItemElements[parseInt(index.toString(), 10)];
            if (item.isValid !== null) {
                let indicatorEle: HTMLElement;
                let iconEle: HTMLElement;
                if (isStepIndicator && !item.iconCss) {
                    indicatorEle = itemElement.querySelector('.' + ICONCSS);
                }
                else {
                    iconEle = itemElement.querySelector('.' + ICONCSS);
                }
                if (!indicatorEle && isStepIndicator && this.renderDefault(index)) {
                    indicatorEle = itemElement.querySelector('.' + INDICATORICON);
                }
                const textLabelIcon: HTMLElement = itemElement.querySelector('.e-step-validation-icon');
                const itemIcon: string[] = item.iconCss.trim().split(' ');
                const validStep: boolean = itemElement.classList.contains('e-step-valid');
                const validIconClass: string = validStep ? 'e-check' : 'e-circle-info';
                if (indicatorEle) {
                    indicatorEle.classList.remove(INDICATORICON);
                    if (indicatorEle.innerHTML !== '') { indicatorEle.innerHTML = ''; }
                    indicatorEle.classList.add('e-icons', validIconClass, ICONCSS);
                }
                if (this.renderDefault(index) && !isStepIndicator) {
                    const stepSpan: HTMLElement = itemElement.querySelector('.e-step');
                    stepSpan.classList.add('e-icons', validIconClass, ICONCSS);
                }
                if (iconEle) {
                    if (iconEle.innerHTML !== '') { iconEle.innerHTML = ''; }
                    else if (itemIcon.length > 0) {
                        itemIcon.forEach((icon: string) => { iconEle.classList.remove(icon); });
                    }
                    iconEle.classList.add('e-icons', validIconClass);
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
        EventHandler.add(itemElement, 'click', this.linearModeHandler.bind(this, itemElement, index), this);
        EventHandler.add(itemElement, 'mouseover', this.openStepperTooltip.bind(this, index), this);
        EventHandler.add(itemElement, 'mouseleave', this.closeStepperTooltip, this);
    }

    private unWireItemsEvents(): void {
        for (let index: number = 0; index < this.steps.length; index++) {
            const itemElement: HTMLElement = this.stepperItemElements[parseInt(index.toString(), 10)];
            EventHandler.remove(itemElement, 'click', this.linearModeHandler.bind(this, itemElement, index));
            EventHandler.remove(itemElement, 'mouseover', this.openStepperTooltip.bind(this, index));
            EventHandler.remove(itemElement, 'mouseleave', this.closeStepperTooltip);
        }
    }

    private linearModeHandler(itemElement: HTMLElement, index: number, e: Event): void {
        if (this.linear) {
            const linearModeValue: number = index - this.activeStep;
            if (Math.abs(linearModeValue) === 1) { this.stepClickHandler(index, e, itemElement); }
        }
        else { this.stepClickHandler(index, e, itemElement); }
    }

    private openStepperTooltip(index: number): void {
        const currentStep: StepModel = this.steps[parseInt(index.toString(), 10)];
        if (this.showTooltip && (currentStep.label || currentStep.text)) {
            if (!this.tooltipOpen) {
                this.updateTooltipContent(index);
                this.tooltipObj.open(this.stepperItemElements[parseInt((index).toString(), 10)]);
                if (this.stepType.toLocaleLowerCase() !== 'label' && ((this.stepType.toLocaleLowerCase() === 'indicator') ||
                    (currentStep.label !== '' && currentStep.iconCss !== '') || (currentStep.label === null && currentStep.iconCss === '' && currentStep.text !== ''))) {
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
                this.tooltipObj.setProperties({ content: initializeCSPTemplate(() => { return content; }) }, true);
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
            if (isrerender) { listItems[parseInt((index).toString(), 10)].classList.add(TEMPLATE); }
            else { this.stepperItemContainer.classList.add(TEMPLATE); }
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
        if (isUpdated !== false) {
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
        if (index !== this.activeStep && this.progressbar) {
            this.progressbar.style.transitionDuration = this.animation.duration + 'ms';
        }
        index = Math.min(index, this.steps.length - 1);
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
                if (this.element.classList.contains(HORIZSTEP)) { this.calculateProgressbarPos(); }
                else { this.progressbar.style.setProperty(PROGRESSVALUE, ((100 / (this.steps.length - 1)) * index) + '%'); }
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
                if (i < this.activeStep || (this.steps.length - 1 === this.activeStep && item.status.toLowerCase() === 'completed')) { item.status = StepStatus.Completed; }
                else if (i === this.activeStep) { item.status = StepStatus.InProgress; }
                else if (i > this.activeStep) { item.status = StepStatus.NotStarted; }
                if (stepStatus && this.activeStep === i) { item.status = stepStatus; }
                if (item.status.toLowerCase() === 'completed') {
                    itemElement.classList.remove(SELECTED, INPROGRESS, NOTSTARTED);
                    itemElement.classList.add(COMPLETED);
                }
                if (item.status.toLowerCase() === 'notstarted') {
                    itemElement.classList.remove(SELECTED, INPROGRESS, COMPLETED);
                    itemElement.classList.add(NOTSTARTED);
                }
            }
            this.isProtectedOnChange = prevOnChange;
            this.updateIndicatorStatus(i, itemElement);
        }
        this.updateStepInteractions();
        if (this.progressbar) { this.progressbar.style.transitionDuration = '0ms'; }
    }

    private calculateProgressbarPos(): void {
        if ((this.element.classList.contains(LABELBEFORE) || this.element.classList.contains(LABELAFTER)) &&
            !this.element.classList.contains(STEPINDICATOR) &&
            this.stepperItemElements[parseInt(this.activeStep.toString(), 10)].classList.contains(STEPICON)) {
            const progressPos: HTMLElement = (this.element.querySelector('.e-stepper-progressbar') as HTMLElement);
            const selectedEle: HTMLElement = this.stepperItemElements[parseInt(this.activeStep.toString(), 10)]
                .firstChild as HTMLElement;
            let value: number = this.activeStep === 0 ? 0 : (selectedEle.offsetLeft - progressPos.offsetLeft +
                (selectedEle.offsetWidth / 2)) / progressPos.offsetWidth * 100;
            if (this.element.classList.contains(RTL)) {
                value = (progressPos.getBoundingClientRect().right - selectedEle.getBoundingClientRect().right +
                (selectedEle.offsetWidth / 2)) / progressPos.offsetWidth * 100;
                this.progressbar.style.setProperty(PROGRESSVALUE, (value) + '%');
            }
            else { this.progressbar.style.setProperty(PROGRESSVALUE, (value) + '%'); }
        }
        else {
            let totalLiWidth: number = 0;
            let activeLiWidth: number = 0;
            this.stepperItemElements.forEach((element: HTMLElement, index: number) => {
                const itemWidth: number = element.offsetWidth;
                totalLiWidth += itemWidth;
                if (index <= this.activeStep) {
                    activeLiWidth += (index === this.activeStep && index !== 0) ? (itemWidth / 2) : itemWidth;
                }
            });
            const spaceWidth: number = (this.stepperItemList.offsetWidth - totalLiWidth) /
                (this.stepperItemElements.length - 1);
            const progressValue: number = ((activeLiWidth + (spaceWidth * this.activeStep)) /
                this.stepperItemList.offsetWidth) * 100;
            this.progressbar.style.setProperty(PROGRESSVALUE, (progressValue) + '%');
        }
    }

    private updateIndicatorStatus(index: number, itemElement: HTMLElement): void {
        if (this.renderDefault(index) && this.element.classList.contains(STEPINDICATOR) && !itemElement.classList.contains('e-step-valid')
            && !itemElement.classList.contains('e-step-error')) {
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

    private updateStepInteractions(): void {
        this.element.classList.toggle(LINEARSTEP, this.linear);
        this.stepperItemElements.forEach((step: HTMLElement, index: number) => {
            step.classList.toggle(PREVSTEP, (index === this.activeStep - 1));
            step.classList.toggle(NEXTSTEP, (index === this.activeStep + 1));
        });
    }

    private removeItemElements(): void {
        for (let i: number = 0; i < this.stepperItemElements.length; i++) {
            remove(this.stepperItemElements[parseInt(i.toString(), 10)]);
        }
        this.stepperItemElements = [];
    }

    /**
     * Move to next step from current step in Stepper.
     *
     * @returns {void}
     */
    public nextStep(): void {
        if (this.activeStep !== this.steps.length - 1) { this.navigateToStep(this.activeStep + 1, null, null, false); }
    }

    /**
     * Move to previous step from current step in Stepper.
     *
     * @returns {void}
     */
    public previousStep(): void {
        if (this.activeStep > 0) { this.navigateToStep(this.activeStep - 1, null, null, false); }
    }

    /**
     * Reset the state of the Stepper and move to the first step.
     *
     * @returns {void}
     */
    public reset(): void {
        if (this.activeStep === 0) {
            this.updateStepInteractions();
        }
        else {
            const isDisabled: boolean = this.stepperItemElements[0].classList.contains(DISABLED) ? true : false;
            this.navigateToStep(isDisabled ? -1 : 0, null, null, false);
        }
    }

    /**
     * Refreshes the position of the progress bar programmatically when the dimensions of the parent container are changed.
     *
     * @returns {void}
     */
    public refreshProgressbar(): void {
        if (this.stepperItemList && this.progressbar) { this.setProgressPosition(this.element); }
        this.navigateToStep(this.activeStep, null, null, false, false);
    }

    private updateElementClassArray(): void {
        const classArray: string[] = [RTL, READONLY, 'e-steps-focus', LABELAFTER, LABELBEFORE, 'e-label-top',
            'e-label-bottom', 'e-label-start', 'e-label-end', STEPINDICATOR, LABELINDICATOR, VERTICALSTEP, HORIZSTEP, LINEARSTEP];
        removeClass([this.element], classArray);
    }

    /**
     * Destroy the stepper control.
     *
     * @returns {void}
     */
    public destroy(): void {
        super.destroy();
        this.unWireEvents();
        this.unWireItemsEvents();
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
                if (e.action === 'home') { index = isRTL ? stepItems.length - 1 : 0; }
                else { index = isRTL ? 0 : stepItems.length - 1; }
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
        if (isUpdate) { this.updatePosition(); }
        if (isStepType) { this.updateStepType(); }
        if (this.readOnly && !this.element.classList.contains(READONLY)) { this.element.classList.add(READONLY); }
        if (this.enableRtl && !this.element.classList.contains(RTL)) { this.element.classList.add(RTL); }
        this.updateOrientaion(this.element);
        this.renderItems();
        this.renderProgressBar(this.element);
        this.checkValidStep();
        this.updateAnimation();
        this.navigateToStep(this.activeStep, null, this.stepperItemElements[this.activeStep], true);
    }

    private updateDynamicSteps(steps: StepModel[], prevSteps?: StepModel[]): void {
        if (!(steps instanceof Array && prevSteps instanceof Array)) {
            const stepCounts: Object[] = Object.keys(steps);
            for (let i: number = 0; i < stepCounts.length; i++) {
                const index: number = parseInt(Object.keys(steps)[i as number], 10);
                const changedPropsCount: number = Object.keys(steps[index as number]).length;
                for (let j: number = 0; j < changedPropsCount; j++) {
                    const property: string = Object.keys(steps[index as number])[j as number];
                    if (property === 'status') {
                        if (this.activeStep === index) { this.navigationHandler(index, steps[index as number].status); }
                        else { this.steps[index as number].status = prevSteps[index as number].status; }
                    }
                    else { this.removeItemElements(); this.renderItems(); this.updateStepperStatus(); }
                    if (property === 'label' && (this.steps[index as number].iconCss || this.steps[index as number].text) &&
                        this.stepType.toLowerCase() === 'default') {
                        this.refreshProgressbar();
                    }
                    this.updateStepInteractions();
                    this.checkValidStep();
                }
            }
        } else { this.renderStepperItems(true, true); }
    }

    private updateDynamicActiveStep(activeStep: number, preActiveStep?: number): void {
        this.activeStep = (activeStep > this.steps.length - 1 || activeStep < -1) ? preActiveStep : this.activeStep;
        if (this.activeStep >= 0 && this.stepperItemElements[parseInt(this.activeStep.toString(), 10)].classList.contains(DISABLED)) {
            this.activeStep = preActiveStep;
        }
        if (this.linear) {
            const linearModeValue: number = preActiveStep - this.activeStep;
            if (Math.abs(linearModeValue) === 1) { this.navigateToStep(this.activeStep, null, null, true); }
        }
        else { this.navigateToStep(this.activeStep, null, this.stepperItemElements[this.activeStep], true); }
    }

    private updateDynamicCssClass(cssClass: string, prevCssClass: string): void {
        if (prevCssClass) { removeClass([this.element], prevCssClass.trim().split(' ')); }
        if (cssClass) { addClass([this.element], cssClass.trim().split(' ')); }
        if (this.tooltipObj) {
            this.tooltipObj.setProperties({ cssClass: this.cssClass ? (STEPPERTOOLTIP + ' ' + this.cssClass) : STEPPERTOOLTIP });
        }
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
                this.updateDynamicSteps(newProp.steps, oldProp.steps);
                break;
            }
            case 'orientation':
                this.updateOrientaion(this.element);
                this.renderStepperItems(true);
                break;
            case 'activeStep':
                this.updateDynamicActiveStep(newProp.activeStep, oldProp.activeStep);
                break;
            case 'enableRtl':
                this.element.classList[this.enableRtl ? 'add' : 'remove'](RTL);
                break;
            case 'readOnly':
                this.element.classList[this.readOnly ? 'add' : 'remove'](READONLY);
                break;
            case 'cssClass':
                this.updateDynamicCssClass(newProp.cssClass, oldProp.cssClass);
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
            case 'linear':
                this.updateStepInteractions();
                break;
            }
        }
    }
}
