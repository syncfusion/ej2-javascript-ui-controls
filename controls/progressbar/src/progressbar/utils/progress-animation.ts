import { Animation, AnimationOptions } from '@syncfusion/ej2-base';
import { effect, getPathArc } from '../utils/helper';
import { ProgressBar } from '../progressbar';
import { lineCapRadius, completeAngle } from '../model/constant';
/**
 * Animation for progress bar
 */
export class ProgressAnimation {

    /** Linear Animation */
    public doLinearAnimation(element: Element, progress: ProgressBar, delay: number, start?: number): void {
        let animation: Animation = new Animation({});
        let linearPath: HTMLElement = <HTMLElement>element;
        let width: string = linearPath.getAttribute('width');
        let x: string = linearPath.getAttribute('x');
        let value: number = 0;
        let rtlX: number = parseInt(x, 10) - parseInt(width, 10);
        linearPath.style.visibility = 'hidden';
        animation.animate(linearPath, {
            duration: progress.animation.duration,
            delay: delay,
            progress: (args: AnimationOptions): void => {
                if (progress.enableRtl) {
                    if (args.timeStamp >= args.delay) {
                        linearPath.style.visibility = 'visible';
                        value = effect(args.timeStamp, parseInt(x, 10), parseInt(width, 10), args.duration, progress.enableRtl);
                        linearPath.setAttribute('x', value.toString());
                    }
                } else {
                    if (args.timeStamp >= args.delay) {
                        linearPath.style.visibility = 'visible';
                        value = effect(args.timeStamp, start, parseInt(width, 10), args.duration, progress.enableRtl);
                        linearPath.setAttribute('width', value.toString());
                    }
                }
            },
            end: (model: AnimationOptions) => {
                if (progress.enableRtl) {
                    linearPath.setAttribute('x', rtlX.toString());
                } else {
                    linearPath.setAttribute('width', width);
                }
                progress.trigger('animationComplete', {
                    value: progress.value, trackColor: progress.trackColor,
                    progressColor: progress.progressColor
                });
            }
        });
    }


    /** Linear Indeterminate */
    public doLinearIndeterminate(element: Element, progress: ProgressBar): void {
        let animation: Animation = new Animation({});
        let linearPath: HTMLElement = <HTMLElement>element;
        let x: string = linearPath.getAttribute('x');
        let width: string = linearPath.getAttribute('width');
        let value: number = 0;
        let start: number = -(parseInt(width, 10));
        let end: number = (progress.progressRect.x + progress.progressRect.width) + parseInt(width, 10);
        animation.animate(linearPath, {
            duration: 2000,
            delay: 0,
            progress: (args: AnimationOptions): void => {
                if (progress.enableRtl) {
                    value = effect(args.timeStamp, parseInt(x, 10), end, args.duration, progress.enableRtl);
                    linearPath.setAttribute('x', value.toString());
                } else {
                    value = effect(args.timeStamp, start, end, args.duration, progress.enableRtl);
                    linearPath.setAttribute('x', value.toString());
                }
            },
            end: (model: AnimationOptions) => {
                if (progress.enableRtl) {
                    linearPath.setAttribute('x', x.toString());
                } else {
                    linearPath.setAttribute('x', start.toString());
                }
                this.doLinearIndeterminate(element, progress);
            }
        });
    }

    /** Circular animation */
    public doCircularAnimation(
        x: number, y: number, radius: number, start: number, progressEnd: number, value: number,
        element: Element, progress: ProgressBar, thickness: number, delay: number, startValue?: number
    ): void {
        let animation: Animation = new Animation({});
        let circularPath: HTMLElement = <HTMLElement>element;
        let pathRadius: number = radius + (thickness / 2);
        let end: number = 0;
        let totalEnd: number;
        totalEnd = ((value - progress.minimum) / (progress.maximum - progress.minimum)) * progress.totalAngle;
        totalEnd = (value < progress.minimum || value > progress.maximum) ? 0 : totalEnd;
        start += (progress.cornerRadius === 'Round' && totalEnd !== completeAngle && totalEnd !== 0) ?
            ((progress.enableRtl) ? (lineCapRadius / 2) * thickness : -(lineCapRadius / 2) * thickness) : 0;
        totalEnd += (progress.cornerRadius === 'Round' && totalEnd !== completeAngle && totalEnd !== 0) ?
            (lineCapRadius / 2) * thickness : 0;
        progressEnd += (progress.cornerRadius === 'Round' && totalEnd !== completeAngle && totalEnd !== 0) ?
            ((progress.enableRtl) ? -(lineCapRadius / 2) * thickness : (lineCapRadius / 2) * thickness) : 0;
        circularPath.setAttribute('visibility', 'Hidden');
        animation.animate(circularPath, {
            duration: progress.animation.duration,
            delay: delay,
            progress: (args: AnimationOptions): void => {
                if (args.timeStamp >= args.delay) {
                    circularPath.setAttribute('visibility', 'visible');
                    end = effect(args.timeStamp, startValue | start, totalEnd, args.duration, progress.enableRtl);
                    circularPath.setAttribute('d', getPathArc(x, y, pathRadius, start, end % 360, progress.enableRtl, true));
                }
            },
            end: (model: AnimationOptions) => {
                circularPath.setAttribute('d', getPathArc(x, y, pathRadius, start, progressEnd, progress.enableRtl, true));
                progress.trigger('animationComplete', {
                    value: progress.value, trackColor: progress.trackColor,
                    progressColor: progress.progressColor
                });
            }
        });
    }

    /** Circular indeterminate */
    public doCircularIndeterminate(
        circularProgress: HTMLElement, progress: ProgressBar,
        start: number, end: number, x: number, y: number, radius: number, thickness: number
    ): void {
        let animation: Animation = new Animation({});
        let pathRadius: number = radius + (thickness / 2);
        animation.animate(circularProgress, {
            duration: 2000,
            delay: 0,
            progress: (args: AnimationOptions): void => {
                start += (progress.enableRtl) ? -5 : 5;
                end += (progress.enableRtl) ? -5 : 5;
                circularProgress.setAttribute(
                    'd', getPathArc(x, y, pathRadius, start % 360, end % 360, progress.enableRtl, true)
                );
            },
            end: (model: AnimationOptions) => {
                this.doCircularIndeterminate(circularProgress, progress, start, end, x, y, radius, thickness);
            }
        });
    }

    /** To do the label animation for progress bar */
    public doLabelAnimation(labelPath: Element, start: number, end: number, progress: ProgressBar, delay: number): void {
        let animation: Animation = new Animation({});
        let text: string = labelPath.innerHTML;
        let value: number = 0;
        let valueChanged: number = 0;
        let percentage: number = 100;
        labelPath.setAttribute('visibility', 'Hidden');
        animation.animate(<HTMLElement>labelPath, {
            duration: progress.animation.duration,
            delay: delay,
            progress: (args: AnimationOptions): void => {
                if (progress.type === 'Linear') {
                    if (args.timeStamp >= args.delay) {
                        labelPath.setAttribute('visibility', 'visible');
                        value = effect(args.timeStamp, start, end, args.duration, false);
                        valueChanged = parseInt(((value / progress.progressRect.width) * percentage).toString(), 10);
                        labelPath.innerHTML = valueChanged.toString() + '%';
                    }
                } else if (progress.type === 'Circular') {
                    labelPath.setAttribute('visibility', 'visible');
                    value = effect(args.timeStamp, start, end, args.duration, false);
                    valueChanged = parseInt((((value - start) / progress.totalAngle) * percentage).toString(), 10);
                    labelPath.innerHTML = valueChanged.toString() + '%';
                }
            },
            end: (model: AnimationOptions) => {
                labelPath.innerHTML = text;
            }
        });
    }

    /** To do the annotation animation for circular progress bar */
    public doAnnotationAnimation(circularPath: Element, progress: ProgressBar): void {
        let animation: Animation = new Animation({});
        let value: number = 0;
        let percentage: number = 100;
        let isAnnotation: boolean = progress.annotations.length > 0;
        let annotatElementChanged: Element;
        let firstAnnotatElement: Element;
        let start: number = progress.startAngle;
        let totalAngle: number = progress.totalAngle;
        let totalEnd: number;
        let annotateValueChanged: number;
        let annotateValue: number;
        if (isAnnotation && progress.progressAnnotationModule) {
            firstAnnotatElement = document.getElementById(progress.element.id + 'Annotation0').children[0];
            if (firstAnnotatElement && firstAnnotatElement.children[0]) {
                if (firstAnnotatElement.children[0].tagName === 'SPAN') {
                    annotatElementChanged = firstAnnotatElement.children[0];
                }
            }
        }
        totalEnd = ((progress.value - progress.minimum) / (progress.maximum - progress.minimum)) * progress.totalAngle;
        totalEnd = (progress.value < progress.minimum || progress.value > progress.maximum) ? 0 : totalEnd;
        annotateValue = ((progress.value - progress.minimum) / (progress.maximum - progress.minimum)) * percentage;
        annotateValue = (progress.value < progress.minimum || progress.value > progress.maximum) ? 0 : Math.round(annotateValue);
        animation.animate(<HTMLElement>circularPath, {
            duration: progress.animation.duration,
            delay: progress.animation.delay,
            progress: (args: AnimationOptions): void => {
                if (isAnnotation && annotatElementChanged) {
                    value = effect(args.timeStamp, start, totalEnd, args.duration, false);
                    annotateValueChanged = parseInt((((value - start) / totalAngle) * percentage).toString(), 10);
                    annotatElementChanged.innerHTML = annotateValueChanged ? annotateValueChanged.toString() + '%' : '';
                }
            },
            end: (model: AnimationOptions) => {
                annotatElementChanged.innerHTML = annotateValue + '%';
            }
        });
    }

}


