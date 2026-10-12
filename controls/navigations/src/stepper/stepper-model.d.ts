import { INotifyPropertyChanged, attributes, NotifyPropertyChanges, L10n, append, isNullOrUndefined, getUniqueID, Complex, KeyboardEvents, KeyboardEventArgs, ChildProperty, Property, EventHandler, Event, EmitType, BaseEventArgs, addClass, remove, removeClass, initializeCSPTemplate, select, compile } from '@syncfusion/ej2-base';import { StepperBase, StepStatus } from '../stepper-base/stepper-base';import { StepModel } from '../stepper-base/stepper-base-model';import { Tooltip } from '@syncfusion/ej2-popups';
import {StepLabelPosition,StepType,StepperChangedEventArgs,StepperChangingEventArgs,StepperClickEventArgs,StepperRenderingEventArgs} from "./stepper";
import {StepperBaseModel} from "../stepper-base/stepper-base-model";

/**
 * Interface for a class StepperAnimationSettings
 */
export interface StepperAnimationSettingsModel {

    /**
     * Defines whether a animation is enabled or disabled.
     *
     * @default true
     */
    enable?: boolean;

    /**
     * duration in milliseconds
     *
     * @default 2000
     * @aspType int
     */
    duration?: number;

    /**
     * delay in milliseconds
     *
     * @default 0
     * @aspType int
     */
    delay?: number;

}

/**
 * Interface for a class Stepper
 */
export interface StepperModel extends StepperBaseModel{

    /**
     * Defines the current step index of the Stepper.
     *
     * {% codeBlock src='stepper/activeStep/index.md' %}{% endcodeBlock %}
     *
     * @default 0
     * @aspType int
     */
    activeStep?: number;

    /**
     * Defines the step progress animation of the Stepper.
     *
     * {% codeBlock src='stepper/animation/index.md' %}{% endcodeBlock %}
     *
     */
    animation?: StepperAnimationSettingsModel;

    /**
     * Defines whether allows to complete one step in order to move to the next or not.
     *
     * {% codeBlock src='stepper/linear/index.md' %}{% endcodeBlock %}
     *
     * @default false
     */
    linear?: boolean;

    /**
     * Defines a value that defines whether to show tooltip or not on each step.
     *
     * @default false
     */
    showTooltip?: boolean;

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
    template?: string | Function;

    /**
     * Defines the template content for the tooltip.
     *
     * @default ''
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     */
    tooltipTemplate?: string | Function;

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
    labelPosition?: string | StepLabelPosition;

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
    stepType?: string | StepType;

    /**
     * Event triggers after active step changed.
     *
     * @event stepChanged
     */
    stepChanged?: EmitType<StepperChangedEventArgs>;

    /**
     * Event triggers before active step change.
     *
     * @event stepChanging
     */
    stepChanging?: EmitType<StepperChangingEventArgs>;

    /**
     * Event triggers when clicked on step.
     *
     * @event stepClick
     */
    stepClick?: EmitType<StepperClickEventArgs>;

    /**
     * Event triggers before rendering each step.
     *
     * @event beforeStepRender
     */
    beforeStepRender?: EmitType<StepperRenderingEventArgs>;

}