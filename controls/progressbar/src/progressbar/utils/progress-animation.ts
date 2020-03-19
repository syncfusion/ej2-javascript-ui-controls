import { Animation, AnimationOptions } from '@syncfusion/ej2-base';
import { effect, getPathArc } from '../utils/helper';
import { ProgressBar } from '../progressbar';
import { lineCapRadius } from '../model/constant';
/**
 * To do the animation for linear progress bar
 */
export function doLinearAnimation(element: Element, progress: ProgressBar, delay: number, start?: number): void {
    let animation: Animation = new Animation({});
    let linearPath: HTMLElement = <HTMLElement>element;
    let width: string = linearPath.getAttribute('width');
    let x: string = (progress.isIndeterminate ? -(+linearPath.getAttribute('width')) : +linearPath.getAttribute('x')).toString();
    let currentTime: number;
    let end: number = progress.progressRect.x + progress.progressRect.width +
        (progress.isIndeterminate ? (+linearPath.getAttribute('width')) : 0);
    let animationDelay: number = (progress.isIndeterminate) ? 0 : delay;
    linearPath.style.visibility = 'hidden';
    animation.animate(linearPath, {
        duration: progress.animation.duration,
        delay: animationDelay,
        progress: (args: AnimationOptions): void => {
            if (progress.enableRtl) {
                if (progress.isIndeterminate) {
                    if (args.timeStamp >= args.delay) {
                        linearPath.style.visibility = 'visible';
                        currentTime = effect(
                            args.timeStamp, end - parseInt(width, 10), end - parseInt(x, 10),
                            args.duration, progress.enableRtl
                        );
                        linearPath.setAttribute('x', currentTime.toString());
                    }

                } else {
                    if (args.timeStamp >= args.delay) {
                        linearPath.style.visibility = 'visible';
                        currentTime = effect(
                            args.timeStamp, parseInt(width, 10), parseInt(width, 10) - parseInt(x, 10),
                            args.duration, progress.enableRtl
                        );
                        linearPath.setAttribute('x', currentTime.toString());
                    }
                }
            } else {
                if (progress.isIndeterminate) {
                    if (args.timeStamp >= args.delay) {
                        linearPath.style.visibility = 'visible';
                        currentTime = effect(args.timeStamp, parseInt(x, 10), end, args.duration, progress.enableRtl);
                        linearPath.setAttribute('x', currentTime.toString());
                    }


                } else {
                    if (args.timeStamp >= args.delay) {
                        linearPath.style.visibility = 'visible';
                        currentTime = effect(args.timeStamp, start, parseInt(width, 10), args.duration, progress.enableRtl);
                        linearPath.setAttribute('width', currentTime.toString());
                    }
                }
            }
        },
        end: (model: AnimationOptions) => {
            if (progress.enableRtl) {
                if (progress.isIndeterminate) {
                    linearPath.setAttribute('x', x);
                    doLinearAnimation(element, progress, 0);
                } else {
                    linearPath.setAttribute('x', x);
                }
            } else {
                if (progress.isIndeterminate) {
                    linearPath.setAttribute('x', x);
                    doLinearAnimation(element, progress, 0);
                } else {
                    linearPath.setAttribute('width', width);
                }
            }
            if (progress.animation.enable) {
                progress.labelElement.setAttribute('visibility', 'visible');
            }
            progress.trigger('animationComplete', {
                value: progress.value, trackColor: progress.trackColor,
                progressColor: progress.progressColor
            });
        }
    });

}

/** To do the animation for circular progress bar */
export function doCircularIndeterminate(
    circularProgress: HTMLElement, progress: ProgressBar,
    start: number, end: number, x: number, y: number, radius: number
): void {
    let animation: Animation = new Animation({});
    animation.animate(circularProgress, {
        duration: 2000,
        delay: 0,
        progress: (args: AnimationOptions): void => {
            start += 5;
            end += 5;
            circularProgress.setAttribute(
                'd', getPathArc(x, y, radius, start % 360, end % 360, progress.enableRtl, true)
            );
        },
        end: (model: AnimationOptions) => {
            doCircularIndeterminate(circularProgress, progress, start, end, x, y, radius);
        }
    });
}

/** To do the annotation animation for circular progress bar */
export function doAnnotationAnimation(circularPath: Element, progress: ProgressBar, start: number, progressEnd: number): void {
    let animation: Animation = new Animation({});
    let value: number = 0;
    let isAnnotation: boolean = progress.annotations.length > 0;
    let annotatElementChanged: Element;
    let firstAnnotatElement: Element;
    if (isAnnotation && progress.progressAnnotationModule) {
        firstAnnotatElement = document.getElementById(progress.element.id + 'Annotation0').children[0];
        if (firstAnnotatElement && firstAnnotatElement.children[0]) {
            if (firstAnnotatElement.children[0].tagName === 'SPAN') {
                annotatElementChanged = firstAnnotatElement.children[0];
            }
        }
    }
    let annotateValueChanged: number;
    let totalAngle: number = progress.totalAngle;
    let min: number = progress.minimum;
    let max: number = progress.maximum;
    let end: number = (start > progressEnd) ? progressEnd + 360 : progressEnd;
    animation.animate(<HTMLElement>circularPath, {
        duration: progress.animation.duration,
        delay: progress.animation.delay,
        progress: (args: AnimationOptions): void => {
            if (isAnnotation && annotatElementChanged) {
                value = effect(args.timeStamp, start, progress.totalAngle, args.duration, progress.enableRtl);
                if (value <= end) {
                    annotateValueChanged = parseInt((((value - start) / totalAngle) * (max - min) + min).toString(), 10);
                    annotatElementChanged.innerHTML = annotateValueChanged ? annotateValueChanged.toString() + '%' : '';
                } else {
                    annotatElementChanged.innerHTML = progress.value + '%';
                }
            }
        },
        end: (model: AnimationOptions) => {
            annotatElementChanged.innerHTML = progress.value + '%';
        }
    });
}

/** To do the animation for circular progress bar */
export function doCircularAnimation(
    x: number, y: number, radius: number, start: number, progressWidth: number,
    element: Element, progress: ProgressBar, thickness: number, delay: number, startValue?: number
): void {
    let animation: Animation = new Animation({});
    let circularPath: HTMLElement = <HTMLElement>element;
    let pathRadius: number = 2 * radius * 0.75;
    let value: number = 0;
    let isAnnotation: boolean = progress.annotations.length > 0;
    let annotatElement: Element;
    let firstElement: Element;
    if (isAnnotation && progress.progressAnnotationModule) {
        firstElement = document.getElementById(progress.element.id + 'Annotation0').children[0];
        if (firstElement && firstElement.children[0]) {
            if (firstElement.children[0].tagName === 'SPAN') {
                annotatElement = firstElement.children[0];
            }
        }
    }
    let annotateValue: number;
    let totalAngle: number = progress.totalAngle;
    let min: number = progress.minimum;
    let max: number = progress.maximum;
    let end: number = (start > progressWidth) ? progressWidth + 360 : progressWidth;
    let animationDelay: number = (progress.isIndeterminate) ? 0 : delay;
    start += (progress.cornerRadius === 'Round' && !progress.isIndeterminate) ?
        ((progress.enableRtl === true) ? (lineCapRadius * thickness / 2) : -(lineCapRadius * thickness / 2)) : 0;
    animation.animate(circularPath, {
        duration: progress.animation.duration,
        delay: animationDelay,
        progress: (args: AnimationOptions): void => {
            if (args.timeStamp >= args.delay) {
                value = effect(args.timeStamp, startValue | start, progress.totalAngle, args.duration, progress.enableRtl);
                if (isAnnotation && annotatElement) {
                    if (value <= end) {
                        annotateValue = parseInt((((value - start) / totalAngle) * (max - min) + min).toString(), 10);
                        annotatElement.innerHTML = annotateValue ? annotateValue.toString() + '%' : '';
                    } else {
                        annotatElement.innerHTML = progress.value + '%';
                    }
                }
                circularPath.setAttribute('d', getPathArc(x, y, pathRadius, start, value, progress.enableRtl, true));
            }
        },
        end: (model: AnimationOptions) => {
            circularPath.setAttribute('d', getPathArc(x, y, pathRadius, 0, 359.99, false, true));
            if (isAnnotation && annotatElement) {
                annotatElement.innerHTML = progress.value + '%';
            }
            if (progress.animation.enable) {
                progress.labelElement.setAttribute('visibility', 'visible');
            }
            progress.trigger('animationComplete', {
                value: progress.value, trackColor: progress.trackColor,
                progressColor: progress.progressColor
            });
        }
    });
}


