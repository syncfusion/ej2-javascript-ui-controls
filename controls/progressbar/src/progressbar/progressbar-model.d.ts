import { Component, Property, NotifyPropertyChanges, Browser, Complex, Event, Collection, EventHandler } from '@syncfusion/ej2-base';import { EmitType, INotifyPropertyChanged, createElement, remove, ModuleDeclaration, isNullOrUndefined } from '@syncfusion/ej2-base';import { Rect, Size, RectOption, stringToNumber } from './utils/helper';import { MarginModel, AnimationModel, FontModel, RangeColorModel } from './model/progress-base-model';import { Margin, Animation, Font, RangeColor } from './model/progress-base';import { ILoadedEventArgs, IProgressStyle, IProgressValueEventArgs } from './model/progress-interface';import { ITextRenderEventArgs, IProgressResizeEventArgs, IMouseEventArgs } from './model/progress-interface';import { SvgRenderer, PathOption, getElement } from '@syncfusion/ej2-svg-base';import { ProgressType, CornerType, ProgressTheme, ModeType } from './utils/enum';import { getProgressThemeColor } from './utils/theme';import { lineCapRadius, completeAngle, valueChanged, progressCompleted } from './model/constant';import { mouseClick, mouseDown, mouseLeave, mouseMove, mouseUp } from './model/constant';import { ProgressAnnotation } from './model/index';import { ProgressAnnotationSettingsModel } from './model/index';import { ProgressAnnotationSettings } from './model/index';import { Linear } from './types/linear-progress';import { Circular } from './types/circular-progress';import { ProgressAnimation } from './utils/progress-animation';
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class ProgressBar
 */
export interface ProgressBarModel extends ComponentModel{

    /**
     * type of the progress bar
     *
     * @default Linear
     */
    type?: ProgressType;

    /**
     * progress value
     *
     * @default null
     */
    value?: number;

    /**
     * secondary progress value
     *
     * @default null
     */
    secondaryProgress?: number;

    /**
     * minimum progress value
     *
     * @default 0
     */
    minimum?: number;

    /**
     * maximum progress value
     *
     * @default 0
     */
    maximum?: number;

    /**
     * startAngle for circular progress bar
     *
     * @default 0
     */
    startAngle?: number;

    /**
     * endAngle for circular progress bar
     *
     * @default 0
     */
    endAngle?: number;

    /**
     * track radius for circular
     *
     * @default '100%'
     */
    radius?: string;

    /**
     * progress radius for circular
     *
     * @default '100%'
     */
    innerRadius?: string;

    /**
     * segmentCount of the progress bar
     *
     * @default 1
     */
    segmentCount?: number;

    /**
     * gapwidth of the segment
     *
     * @default null
     */
    gapWidth?: number;

    /**
     * Segment color
     *
     * @default null
     */
    segmentColor?: string[];

    /**
     * corner type
     *
     * @default Auto
     */
    cornerRadius?: CornerType;

    /**
     * height of the progress bar
     *
     * @default null
     */
    height?: string;

    /**
     * width of the progress bar
     *
     * @default null
     */
    width?: string;

    /**
     * Indeterminate progress
     *
     * @default false
     */
    isIndeterminate?: boolean;

    /**
     * Active state
     *
     * @default false
     */
    isActive?: boolean;

    /**
     * gradient
     *
     * @default false
     */
    isGradient?: boolean;

    /**
     * striped
     *
     * @default false
     */
    isStriped?: boolean;

    /**
     * modes of linear progress
     *
     * @default null
     */
    role?: ModeType;

    /**
     * right to left
     *
     * @default false
     */
    enableRtl?: boolean;

    /**
     * labelOnTrack
     *
     * @default true
     */
    labelOnTrack?: boolean;

    /**
     * trackColor
     *
     * @default null
     */
    trackColor?: string;

    /**
     * progressColor
     *
     * @default null
     */
    progressColor?: string;

    /**
     * track thickness
     *
     * @default 0
     */
    trackThickness?: number;

    /**
     * progress thickness
     *
     * @default 0
     */
    progressThickness?: number;

    /**
     * pie view
     *
     * @default false
     */
    enablePieProgress?: boolean;

    /**
     * theme style
     *
     * @default Fabric
     */
    theme?: ProgressTheme;

    /**
     * label of the progress bar
     *
     * @default false
     */
    showProgressValue?: boolean;

    /**
     * disable the trackSegment
     *
     * @default false
     */
    enableProgressSegments?: boolean;

    /**
     * Option for customizing the  label text.
     */
    labelStyle?: FontModel;

    /**
     * margin size
     */
    margin?: MarginModel;

    /**
     * Animation for the progress bar
     */
    animation?: AnimationModel;

    /**
     * Triggers before the progress bar get rendered.
     *
     * @event load
     */
    load?: EmitType<ILoadedEventArgs>;

    /**
     * Triggers before the progress bar label renders.
     *
     * @event textRender
     */
    textRender?: EmitType<ITextRenderEventArgs>;

    /**
     * Triggers after the progress bar has loaded.
     *
     * @event loaded
     */
    loaded?: EmitType<ILoadedEventArgs>;

    /**
     * Triggers after the value has changed.
     *
     * @event valueChanged
     */
    valueChanged?: EmitType<IProgressValueEventArgs>;

    /**
     * Triggers after the progress value completed.
     *
     * @event progressCompleted
     */
    progressCompleted?: EmitType<IProgressValueEventArgs>;

    /**
     * Triggers after the animation completed.
     *
     * @event animationComplete
     */
    animationComplete?: EmitType<IProgressValueEventArgs>;

    /**
     * Trigger after mouse click
     *
     * @event mouseClick
     */
    mouseClick?: EmitType<IMouseEventArgs>;

    /**
     * Trigger after mouse move
     *
     * @event mouseMove
     */
    mouseMove?: EmitType<IMouseEventArgs>;

    /**
     * Trigger after mouse up
     *
     * @event mouseUp
     */
    mouseUp?: EmitType<IMouseEventArgs>;

    /**
     * Trigger after mouse down
     *
     * @event mouseDown
     */
    mouseDown?: EmitType<IMouseEventArgs>;

    /**
     * Trigger after mouse down
     *
     * @event mouseLeave
     */
    mouseLeave?: EmitType<IMouseEventArgs>;

    /**
     * The configuration for annotation in Progressbar.
     */
    annotations?: ProgressAnnotationSettingsModel[];

    /**
     * RangeColor in Progressbar.
     */
    rangeColors?: RangeColorModel[];

}