import { ProgressBar } from '../progressbar';
import { Size, ProgressLocation } from '../utils/helper';
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
}
/** chart theme style */
export interface IProgressStyle {
    linearTrackColor: string;
    linearProgressColor: string;
    circularTrackColor: string;
    circularProgressColor: string;
    backgroundColor: string;
    fontColor: string;
    linearFontFamily: string;
    linearFontStyle: string;
    linearFontSize: number;
    circularFontFamily: string;
    circularFontStyle: string;
    circularFontSize: number;
    progressOpacity: number;
    trackOpacity: number;
    bufferOpacity: number;
    linearGapWidth: number;
    circularGapWidth: number;
    linearTrackThickness: number;
    linearProgressThickness: number;
    circularTrackThickness: number;
    circularProgressThickness: number;
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
export interface IMouseEventArgs {
    target: string;
}
