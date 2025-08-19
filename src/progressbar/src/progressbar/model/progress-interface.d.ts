import { ProgressBar } from '../progressbar';
import { Size, ProgressLocation } from '../utils/helper';
import { FontModel } from './progress-base-model';
export interface ITooltipRenderEventArgs extends IProgressEventArgs {
    /** Defines tooltip text collections */
    text?: string;
}
/** @private */
export interface IFontMapping {
    size?: string;
    color?: string;
    fontWeight?: string;
    fontStyle?: string;
    fontFamily?: string;
    opacity?: number;
}
/**
 * loadedEvent for progress bar
 */
export interface ILoadedEventArgs {
    /** Defines the name of the event */
    name: string;
    /** Defines the event cancel status */
    cancel: boolean;
    /** Defines the current chart instance */
    progressBar: ProgressBar;
}
/**
 * loadedEvent for progress bar
 */
export interface ITextRenderEventArgs {
    /** Defines the text */
    cancel: boolean;
    /** Defines the text */
    text: string;
    /** Defines the color */
    color: string;
    /** Defines the current progress bar instance */
    progressBar?: ProgressBar;
}
/**
 * Event for progress bar
 */
export interface IProgressValueEventArgs {
    value: number;
    trackColor: string;
    progressColor: string;
}
/** Resize */
export interface IProgressResizeEventArgs {
    /** Defines the name of the Event */
    name: string;
    /** Defines the previous size of the progress bar */
    previousSize: Size;
    /** Defines the current size of the progress bar */
    currentSize: Size;
    /** Defines progress bar instance */
    bar: ProgressBar;
    /** cancel the event */
    cancel: boolean;
}
/** chart theme style */
export interface IProgressStyle {
    linearTrackColor: string;
    linearProgressColor: string;
    circularTrackColor: string;
    circularProgressColor: string;
    backgroundColor: string;
    progressOpacity: number;
    trackOpacity: number;
    bufferOpacity: number;
    bufferColor?: string;
    linearGapWidth: number;
    circularGapWidth: number;
    linearTrackThickness: number;
    linearProgressThickness: number;
    circularTrackThickness: number;
    circularProgressThickness: number;
    tooltipFill: string;
    tooltipLightLabel: string;
    success: string;
    info: string;
    warning: string;
    danger: string;
    tooltipLabelFont: FontModel;
    linearLabelFont: FontModel;
    circularLabelFont: FontModel;
}
export interface IProgressEventArgs {
    /** Defines the name of the event */
    name: string;
    /** Defines the event cancel status */
    cancel: boolean;
}
export interface IAnnotationRenderEventArgs extends IProgressEventArgs {
    /** Defines the current annotation content */
    content: HTMLElement;
    /** Defines the current annotation location */
    location: ProgressLocation;
}
/** Interface for LinearGradient attributes */
export interface LinearGradient {
    /** id for gradient */
    id?: string;
    /** x1 value */
    x1?: string;
    /** x2 value */
    x2?: string;
    /** y1 value */
    y1?: string;
    /** y2 value */
    y2?: string;
    /** gradientUnit for gradient */
    gradientUnits?: string;
    /** spreadMethod for gradient */
    spreadMethod?: string;
    /** gradientTransform for gradient */
    gradientTransform?: string;
}
export interface StopElement {
    /** offset value */
    offset?: string;
    /** stop-color */
    ['stop-color']?: string;
    /** stop-opacity */
    ['stop-opacity']?: string;
}
export interface IMouseEventArgs {
    target: string;
}
