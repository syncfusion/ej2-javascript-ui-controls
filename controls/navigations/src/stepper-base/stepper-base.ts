import { Component, INotifyPropertyChanged, NotifyPropertyChanges, Property, ChildProperty, Collection, Event, EmitType, isNullOrUndefined } from '@syncfusion/ej2-base';
import { StepperBaseModel, StepModel } from './stepper-base-model';

const PROGRESSVALUE: string = '--progress-value';
const PROGRESSPOS: string = '--progress-position';
const VERTICALSTEP: string = 'e-vertical';
const HORIZSTEP: string = 'e-horizontal';
const ITEMLIST: string = 'e-stepper-steps';

/**
 * Defines the status of the step.
 */
export enum StepStatus {
    /**
     * Shows the status of the step is not started.
     */
    NotStarted = 'NotStarted',

    /**
     * Shows the step is in progress.
     */
    InProgress = 'InProgress',

    /**
     * Shows the status of the step is completed.
     */
    Completed = 'Completed'
}

/**
 * Specifies the steps of the Stepper.
 */
export class Step extends ChildProperty<Step>  {

    /**
     * Defines the CSS class to customize the step appearance.
     *
     * @default ''
     */
    @Property('')
    public cssClass: string;

    /**
     * Defines whether a step is enabled or disabled.
     *
     * @default false
     */
    @Property(false)
    public disabled: boolean;

    /**
     * Defines the icon content of the step.
     *
     * @default ''
     */
    @Property('')
    public iconCss: string;

    /**
     * Defines the state whether it is valid completion or not.
     * If set to true, the completion is valid.
     * If false, the completion is invalid.
     * If null, the completion state is not determined.
     *
     * @aspType bool?
     * @default null
     */
    @Property(null)
    public isValid: boolean | null;

    /**
     * Defines the label content of the step.
     *
     * @default ''
     */
    @Property('')
    public label: string;

    /**
     * Defines whether the step is optionally to skip completion or not.
     *
     * @default false
     */
    @Property(false)
    public optional: boolean;

    /**
     * Defines the status of the step.
     * The possible values are
     * * NotStarted
     * * InProgress
     * * Completed
     *
     * @isenumeration true
     * @default StepStatus.NotStarted
     * @asptype StepStatus
     */
    @Property(StepStatus.NotStarted)
    public status: string | StepStatus;

    /**
     * Defines the text content of the step.
     *
     * @default ''
     */
    @Property('')
    public text: string;
}

/**
 * Defines the orientation type of the Stepper.
 */
export enum StepperOrientation {
    /**
     * Steps are displayed horizontally.
     */
    Horizontal = 'Horizontal',
    /**
     * Steps are displayed vertically.
     */
    Vertical = 'Vertical'
}

/**
 * StepperBase component act as base class to the stepper component.
 */
@NotifyPropertyChanges
export class StepperBase extends Component<HTMLElement> implements INotifyPropertyChanged {

    /**
     * Defines the list of steps.
     *
     * @default []
     */
    @Collection<StepModel[]>([], Step)
    public steps: StepModel[];

    /**
     * Defines the CSS class to customize the Stepper appearance.
     *
     * @default ''
     */
    @Property('')
    public cssClass: string;

    /**
     * Defines whether the read-only mode is enabled for a Stepper control, which means that the user will not be able to interact with it.
     *
     * @default false
     */
    @Property(false)
    public readOnly: boolean;

    /**
     * Defines the orientation type of the Stepper.
     *
     * The possible values are:
     * * Horizontal
     * * vertical
     *
     * @isenumeration true
     * @default StepperOrientation.Horizontal
     * @asptype StepperOrientation
     */
    @Property(StepperOrientation.Horizontal)
    public orientation: string | StepperOrientation;

    /**
     * Event callback that is raised after rendering the stepper.
     *
     * @event created
     */
    @Event()
    public created: EmitType<Event>;

    /* protected variables */
    protected progressStep: HTMLElement;
    protected progressbar : HTMLElement;
    protected progressBarPosition: number;

    /**
     * * Constructor for Base class
     *
     * @param {StepperBaseModel} options - Specifies the Base model.
     * @param {string | HTMLElement} element - Specifies the element to render as component.
     * @private
     */
    public constructor(options?: StepperBaseModel, element?: string | HTMLElement) {
        super(options, element);
    }

    /**
     * This method is abstract member of the Component<HTMLElement>.
     *
     * @private
     * @returns {void}
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    protected preRender(): void {
    }

    /**
     * This method is abstract member of the Component<HTMLElement>.
     *
     * @private
     * @returns {string} - It returns the current module name.
     */
    public getModuleName(): string {
        return 'stepperBase';
    }

    /**
     * This method is abstract member of the Component<HTMLElement>.
     *
     * @private
     * @returns {string} - It returns the persisted data.
     */
    protected getPersistData(): string {
        return this.addOnPersist([]);
    }

    /**
     * This method is abstract member of the Component<HTMLElement>.
     *
     * @private
     * @returns {void}
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    protected render(): void {
    }

    protected updateOrientaion(wrapper: HTMLElement): void {
        if (wrapper.classList.contains(HORIZSTEP) || wrapper.classList.contains(VERTICALSTEP)) {
            wrapper.classList.remove(HORIZSTEP, VERTICALSTEP);
        }
        if (!(isNullOrUndefined(this.orientation))) {
            wrapper.classList.add('e-' + this.orientation.toLocaleLowerCase());
        }
    }

    protected renderProgressBar(wrapper: HTMLElement): void {
        this.progressStep = this.createElement('div', { className: 'e-stepper-progressbar' });
        this.progressbar = this.createElement('div', { className: 'e-progressbar-value' });
        const beforeLabel: HTMLElement = (wrapper.querySelector('li').querySelector('.e-step-label-container'));
        this.progressStep.appendChild(this.progressbar);
        wrapper.prepend(this.progressStep);
        this.progressbar.style.setProperty(PROGRESSVALUE, (0) + '%');
        if (wrapper.classList.contains(VERTICALSTEP)) {
            if (wrapper.classList.contains('e-label-bottom') || wrapper.classList.contains('e-label-top')) {
                const stepsContainer: HTMLElement = (wrapper.querySelector('.' + ITEMLIST));
                this.progressStep.style.setProperty(PROGRESSPOS, (stepsContainer.offsetWidth / 2) + 'px');
            }
            else { this.progressStep.style.setProperty(PROGRESSPOS, ((this.progressBarPosition / 2) - 1) + 'px'); }
        }
        if (beforeLabel && (beforeLabel.classList.contains('e-label-before'))) { this.progressStep.style.setProperty(PROGRESSPOS, (((this.progressBarPosition) - 1)) + 5 + 'px'); }
        if (wrapper.classList.contains(HORIZSTEP)) { this.setProgressPosition(wrapper); }
    }

    protected setProgressPosition(wrapper: HTMLElement, isResize?: boolean): void {
        const stepItemContainer: HTMLElement = (wrapper.querySelector('.e-step-container'));
        const stepItemEle: HTMLElement = (stepItemContainer.firstElementChild as HTMLElement);
        if (isResize !== true) {
            let topPos: number = 0;
            if (wrapper.classList.contains('e-label-before')) { topPos = ((stepItemContainer.offsetParent as HTMLElement).offsetHeight - (stepItemEle.offsetHeight / 2) - 1); }
            else { topPos = (stepItemEle.offsetHeight / 2); }
            this.progressStep.style.setProperty('--progress-top-position', topPos + 'px');
        }
        const lastEle: HTMLElement = wrapper.querySelector('.' + ITEMLIST).lastChild.firstChild as HTMLElement;
        if (wrapper.classList.contains('e-rtl')) {
            const leftPost: number = ((stepItemEle.offsetLeft + stepItemEle.offsetWidth) - (wrapper.querySelector('.' + ITEMLIST) as HTMLElement).offsetWidth);
            this.progressStep.style.setProperty('--progress-left-position', Math.abs(leftPost) + 'px');
            this.progressStep.style.setProperty('--progress-bar-width', Math.abs(lastEle.offsetLeft - stepItemEle.offsetLeft) + 'px');
        } else {
            this.progressStep.style.setProperty('--progress-left-position', (stepItemEle.offsetLeft + 1) + 'px');
            this.progressStep.style.setProperty('--progress-bar-width', ((lastEle.offsetWidth + lastEle.offsetLeft - 2) - (stepItemEle.offsetLeft + 2)) + 'px');
        }
    }

    /**
     * This method is abstract member of the Component<HTMLElement>.
     *
     * @param  {StepperBaseModel} newProp - Specifies new properties
     * @param  {StepperBaseModel} oldProp - Specifies old properties
     * @private
     * @returns {void}
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
    public onPropertyChanged(newProp: StepperBaseModel, oldProp: StepperBaseModel): void {
    }
}
