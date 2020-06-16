import { Animation, AnimationOptions, isNullOrUndefined } from '@syncfusion/ej2-base';
import { effect, getPathArc } from '../utils/helper';
import { ProgressBar } from '../progressbar';
import { lineCapRadius, completeAngle } from '../model/constant';
/**
 * Animation for progress bar
 */
export class ProgressAnimation {

    /** Linear Animation */
    public doLinearAnimation(element: Element, progress: ProgressBar, delay: number, previousWidth?: number, active?: Element): void {
        let animation: Animation = new Animation({});
        let linearPath: HTMLElement = <HTMLElement>element;
        let width: string = linearPath.getAttribute('width');
        let x: string = linearPath.getAttribute('x');
        let opacityValue: number = 0;
        let value: number = 0;
        let start: number = (!progress.enableRtl) ? previousWidth : parseInt(x, 10);
        let end: number = (!progress.enableRtl) ? parseInt(width, 10) - start : parseInt(width, 10) - previousWidth;
        let rtlX: number = parseInt(x, 10) - end;
        linearPath.style.visibility = 'hidden';
        animation.animate(linearPath, {
            duration: progress.animation.duration,
            delay: delay,
            progress: (args: AnimationOptions): void => {
                if (progress.enableRtl) {
                    if (args.timeStamp >= args.delay) {
                        linearPath.style.visibility = 'visible';
                        value = effect(args.timeStamp, start, end, args.duration, progress.enableRtl);
                        linearPath.setAttribute('x', value.toString());
                        if (progress.isActive) {
                            opacityValue = effect(args.timeStamp, 0.5, 0.5, args.duration, true);
                            active.setAttribute('opacity', opacityValue.toString());
                        }
                    }
                } else {
                    if (args.timeStamp >= args.delay) {
                        linearPath.style.visibility = 'visible';
                        value = effect(args.timeStamp, start, end, args.duration, progress.enableRtl);
                        linearPath.setAttribute('width', value.toString());
                        if (progress.isActive) {
                            opacityValue = effect(args.timeStamp, 0.5, 0.5, args.duration, true);
                            active.setAttribute('opacity', opacityValue.toString());
                        }
                    }
                }
            },
            end: (model: AnimationOptions) => {
                if (progress.enableRtl) {
                    if (progress.isActive) {
                        linearPath.setAttribute('x', x.toString());
                        this.doLinearAnimation(element, progress, delay, previousWidth, active);
                    } else {
                        linearPath.setAttribute('x', rtlX.toString());
                    }
                } else {
                    linearPath.setAttribute('width', width);
                    if (progress.isActive) {
                        this.doLinearAnimation(element, progress, delay, previousWidth, active);
                    }
                }
                progress.trigger('animationComplete', {
                    value: progress.value, trackColor: progress.trackColor,
                    progressColor: progress.progressColor
                });
            }
        });
    }


    /** Linear Indeterminate */
    public doLinearIndeterminate(element: Element, progressWidth: number, thickness: number, progress: ProgressBar): void {
        let animation: Animation = new Animation({});
        let linearPath: HTMLElement = <HTMLElement>element;
        let x: string = linearPath.getAttribute('x');
        let width: string = linearPath.getAttribute('width');
        let value: number = 0;
        let start: number = (width) ? -(parseInt(width, 10)) : -progressWidth;
        let end: number = (progress.progressRect.x + progress.progressRect.width) + ((width) ? (parseInt(width, 10)) : progressWidth);
        let duration: number = (!progress.trackSegmentDisable) ? 2500 : 3500;
        animation.animate(linearPath, {
            duration: duration,
            delay: 0,
            progress: (args: AnimationOptions): void => {
                if (progress.enableRtl) {
                    value = effect(
                        args.timeStamp, parseInt(x, 10) || progress.progressRect.x + progressWidth,
                        end, args.duration, progress.enableRtl
                    );
                    if (!progress.trackSegmentDisable) {
                        linearPath.setAttribute('x', value.toString());
                    } else {
                        linearPath.setAttribute('d', progress.getPathLine(value, progressWidth, thickness));
                    }
                } else {
                    value = effect(args.timeStamp, start, end, args.duration, progress.enableRtl);
                    if (!progress.trackSegmentDisable) {
                        linearPath.setAttribute('x', value.toString());
                    } else {
                        linearPath.setAttribute('d', progress.getPathLine(value, progressWidth, thickness));
                    }
                }
            },
            end: () => {
                if (progress.enableRtl && !progress.trackSegmentDisable) {
                    linearPath.setAttribute('x', x.toString());
                } else if (!progress.trackSegmentDisable) {
                    linearPath.setAttribute('x', start.toString());
                }
                this.doLinearIndeterminate(element, progressWidth, thickness, progress);
            }
        });
    }

    /** Linear striped */
    public doStripedAnimation(element: Element, progress: ProgressBar, value: number, delay?: boolean): void {
        let animation: Animation = new Animation({});
        let point: number = 1500 / progress.animation.duration;
        animation.animate(<HTMLElement>element, {
            duration: progress.animation.duration,
            delay: progress.animation.delay,
            progress: (): void => {
                value += (progress.enableRtl) ? -point : point;
                element.setAttribute('gradientTransform', 'translate(' + value + ') rotate(-45)');
            },
            end: () => {
                this.doStripedAnimation(element, progress, value, false);
            }
        });
    }

    /** Circular animation */
    public doCircularAnimation(
        x: number, y: number, radius: number, progressEnd: number, totalEnd: number,
        element: Element, progress: ProgressBar, thickness: number, delay: number, startValue?: number,
        previousTotal?: number, active?: Element
    ): void {
        let animation: Animation = new Animation({});
        let circularPath: HTMLElement = <HTMLElement>element;
        let start: number = progress.startAngle;
        let pathRadius: number = radius + (thickness / 2);
        let end: number = 0;
        let opacityValue: number = 0;
        let startPos: number;
        let endPos: number;
        start += (progress.cornerRadius === 'Round' && totalEnd !== completeAngle && totalEnd !== 0) ?
            ((progress.enableRtl) ? (lineCapRadius / 2) * thickness : -(lineCapRadius / 2) * thickness) : 0;
        totalEnd += (progress.cornerRadius === 'Round' && totalEnd !== completeAngle && totalEnd !== 0) ?
            (lineCapRadius / 2) * thickness : 0;
        progressEnd += (progress.cornerRadius === 'Round' && totalEnd !== completeAngle && totalEnd !== 0) ?
            ((progress.enableRtl) ? -(lineCapRadius / 2) * thickness : (lineCapRadius / 2) * thickness) : 0;
        startPos = (!isNullOrUndefined(startValue)) ? startValue : start;
        endPos = (!isNullOrUndefined(startValue)) ? totalEnd - previousTotal : totalEnd;
        circularPath.setAttribute('visibility', 'Hidden');
        animation.animate(circularPath, {
            duration: progress.animation.duration,
            delay: delay,
            progress: (args: AnimationOptions): void => {
                if (args.timeStamp >= args.delay) {
                    circularPath.setAttribute('visibility', 'visible');
                    end = effect(args.timeStamp, startPos, endPos, args.duration, progress.enableRtl);
                    circularPath.setAttribute('d', getPathArc(x, y, pathRadius, start, end % 360, progress.enableRtl, true));
                    if (progress.isActive) {
                        opacityValue = effect(args.timeStamp, 0.5, 0.5, args.duration, true);
                        active.setAttribute('opacity', opacityValue.toString());
                    }
                }
            },
            end: (model: AnimationOptions) => {
                circularPath.setAttribute('visibility', '');
                circularPath.setAttribute('d', getPathArc(x, y, pathRadius, start, progressEnd, progress.enableRtl, true));
                if (progress.isActive) {
                    this.doCircularAnimation(
                        x, y, radius, progressEnd, totalEnd, element, progress, thickness,
                        delay, startValue, previousTotal, active
                    );
                }
                progress.trigger('animationComplete', {
                    value: progress.value, trackColor: progress.trackColor,
                    progressColor: progress.progressColor
                });
            }
        });
    }

    /** Circular indeterminate */
    public doCircularIndeterminate(
        circularProgress: Element, progress: ProgressBar,
        start: number, end: number, x: number, y: number, radius: number, thickness: number
    ): void {
        let animation: Animation = new Animation({});
        let pathRadius: number = radius + ((!progress.trackSegmentDisable) ? (thickness / 2) : 0);
        let value: number = (!progress.trackSegmentDisable) ? 3 : 2;
        animation.animate(<HTMLElement>circularProgress, {
            progress: (): void => {
                start += (progress.enableRtl) ? -value : value;
                end += (progress.enableRtl) ? -value : value;
                circularProgress.setAttribute(
                    'd', getPathArc(x, y, pathRadius, start % 360, end % 360, progress.enableRtl, !progress.trackSegmentDisable)
                );
            },
            end: (model: AnimationOptions) => {
                this.doCircularIndeterminate(circularProgress, progress, start, end, x, y, radius, thickness);
            }
        });
    }

    /** To do the label animation for progress bar */
    public doLabelAnimation(labelPath: Element, start: number, end: number, progress: ProgressBar, delay: number, textSize?: number): void {
        let animation: Animation = new Animation({});
        let label: Animation = new Animation({});
        let startPos: number;
        let endPos: number;
        let text: string = labelPath.innerHTML;
        let value: number = 0;
        let xPos: number = 0;
        let valueChanged: number = 0;
        let percentage: number = 100;
        let labelText: string = progress.labelStyle.text;
        let labelPos: string = progress.labelStyle.textAlignment;
        let posX: number = parseInt(labelPath.getAttribute('x'), 10);
        labelPath.setAttribute('visibility', 'Hidden');
        if (progress.type === 'Linear') {
            startPos = (progress.enableRtl) ? (progress.progressRect.x + progress.progressRect.width) + (textSize / 2) :
                progress.progressRect.x - (textSize / 2);
            startPos = (startPos <= 0) ? 0 : startPos;
            endPos = (progress.enableRtl) ? startPos - posX : posX - startPos;
        }
        animation.animate(<HTMLElement>labelPath, {
            duration: progress.animation.duration,
            delay: delay,
            progress: (args: AnimationOptions): void => {
                if (progress.type === 'Linear') {
                    if (args.timeStamp >= args.delay) {
                        if (labelText === '') {
                            labelPath.setAttribute('visibility', 'visible');
                            value = effect(args.timeStamp, start, end, args.duration, false);
                            valueChanged = parseInt(((value / progress.progressRect.width) * percentage).toString(), 10);
                            labelPath.innerHTML = valueChanged.toString() + '%';
                            if (labelPos === 'Far' || labelPos === 'Center') {
                                xPos = effect(args.timeStamp, startPos, endPos, args.duration, progress.enableRtl);
                                labelPath.setAttribute('x', xPos.toString());
                            }
                        }
                    }
                } else if (progress.type === 'Circular') {
                    if (labelText === '') {
                        labelPath.setAttribute('visibility', 'visible');
                        value = effect(args.timeStamp, start, end, args.duration, false);
                        valueChanged = parseInt((((value - start) / progress.totalAngle) * percentage).toString(), 10);
                        labelPath.innerHTML = valueChanged.toString() + '%';
                    }
                }
            },
            end: () => {
                if (labelText === '') {
                    labelPath.innerHTML = text;
                    labelPath.setAttribute('x', posX.toString());
                } else {
                    label.animate(<HTMLElement>labelPath, {
                        progress: (args: AnimationOptions): void => {
                            labelPath.setAttribute('visibility', 'visible');
                            value = effect(args.timeStamp, 0, 1, args.duration, false);
                            labelPath.setAttribute('opacity', value.toString());
                        },
                        end: () => {
                            labelPath.setAttribute('opacity', '1');
                        }
                    });
                }
            }
        });
    }

    /** To do the annotation animation for circular progress bar */
    public doAnnotationAnimation(circularPath: Element, progress: ProgressBar, previousEnd?: number, previousTotal?: number): void {
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
        let startValue: number;
        let endValue: number;
        if (isAnnotation && progress.progressAnnotationModule) {
            firstAnnotatElement = document.getElementById(progress.element.id + 'Annotation0').children[0];
            if (firstAnnotatElement && firstAnnotatElement.children[0]) {
                if (firstAnnotatElement.children[0].tagName === 'SPAN') {
                    annotatElementChanged = firstAnnotatElement.children[0];
                }
            }
        }
        totalEnd = ((progress.argsData.value - progress.minimum) / (progress.maximum - progress.minimum)) * progress.totalAngle;
        progress.annotateTotal = totalEnd =
            (progress.argsData.value < progress.minimum || progress.argsData.value > progress.maximum) ? 0 : totalEnd;
        progress.annotateEnd = start + totalEnd;
        annotateValue = ((progress.argsData.value - progress.minimum) / (progress.maximum - progress.minimum)) * percentage;
        annotateValue = (progress.argsData.value < progress.minimum || progress.argsData.value > progress.maximum) ? 0 :
            Math.round(annotateValue);
        startValue = (!isNullOrUndefined(previousEnd)) ? previousEnd : start;
        endValue = (!isNullOrUndefined(previousEnd)) ? totalEnd - previousTotal : totalEnd;
        if (progress.argsData.value <= progress.minimum || progress.argsData.value > progress.maximum) {
            annotatElementChanged.innerHTML = annotateValue + '%';
        } else {
            animation.animate((<HTMLElement>circularPath), {
                duration: progress.animation.duration,
                delay: progress.animation.delay,
                progress: (args: AnimationOptions): void => {
                    if (isAnnotation && annotatElementChanged) {
                        value = effect(args.timeStamp, startValue, endValue, args.duration, false);
                        annotateValueChanged = parseInt((((Math.round(value) - start) / totalAngle) * percentage).toString(), 10);
                        annotatElementChanged.innerHTML = annotateValueChanged ? annotateValueChanged.toString() + '%' : '0%';
                    }
                },
                end: (model: AnimationOptions) => {
                    annotatElementChanged.innerHTML = annotateValue + '%';
                }
            });
        }
    }
}

