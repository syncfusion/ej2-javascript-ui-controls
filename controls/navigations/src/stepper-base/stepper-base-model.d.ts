import { Component, INotifyPropertyChanged, NotifyPropertyChanges, Property, ChildProperty, Collection, Event, EmitType, isNullOrUndefined } from '@syncfusion/ej2-base';
import {StepStatus,StepperOrientation} from "./stepper-base";
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class Step
 */
export interface StepModel {

    /**
     * Defines the CSS class to customize the step appearance.
     *
     * @default ''
     */
    cssClass?: string;

    /**
     * Defines whether a step is enabled or disabled.
     *
     * @default false
     */
    disabled?: boolean;

    /**
     * Defines the icon content of the step.
     *
     * @default ''
     */
    iconCss?: string;

    /**
     * Defines the state whether it is valid completion or not.
     * If set to true, the completion is valid.
     * If false, the completion is invalid.
     * If null, the completion state is not determined.
     *
     * @aspType bool?
     * @default null
     */
    isValid?: boolean | null;

    /**
     * Defines the label content of the step.
     *
     * @default ''
     */
    label?: string;

    /**
     * Defines whether the step is optionally to skip completion or not.
     *
     * @default false
     */
    optional?: boolean;

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
    status?: string | StepStatus;

    /**
     * Defines the text content of the step.
     *
     * @default ''
     */
    text?: string;

}

/**
 * Interface for a class StepperBase
 */
export interface StepperBaseModel extends ComponentModel{

    /**
     * Defines the list of steps.
     *
     * @default []
     */
    steps?: StepModel[];

    /**
     * Defines the CSS class to customize the Stepper appearance.
     *
     * @default ''
     */
    cssClass?: string;

    /**
     * Defines whether the read-only mode is enabled for a Stepper control, which means that the user will not be able to interact with it.
     *
     * @default false
     */
    readOnly?: boolean;

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
    orientation?: string | StepperOrientation;

    /**
     * Event callback that is raised after rendering the stepper.
     *
     * @event created
     */
    created?: EmitType<Event>;

}