/* eslint-disable valid-jsdoc */
/* eslint-disable jsdoc/require-param */
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
        const animation: Animation = new Animation({});
        const linearPath: HTMLElement = <HTMLElement>element;
        const duration: number = (progress.isActive) ? 3000 : progress.animation.duration;
        const width: string = linearPath.getAttribute('width');
        const x: string = linearPath.getAttribute('x');
        let opacityValue: number = 0;
        let value: number = 0;
        const start: number = (!progress.enableRtl || (progress.cornerRadius === 'Round4px')) ? previousWidth : parseInt(x, 10);
        const end: number = (!progress.enableRtl || (progress.cornerRadius === 'Round4px')) ? parseInt(width, 10) - start :
            parseInt(width, 10) - previousWidth;
        const rtlX: number = parseInt(x, 10) - end;
        linearPath.style.visibility = 'hidden';
        animation.animate(linearPath, {
            duration: duration,
            delay: delay,
            progress: (args: AnimationOptions): void => {
                progress.cancelResize = true;
                if (progress.enableRtl && !(progress.cornerRadius === 'Round4px')) {
                    if (args.timeStamp >= args.delay) {
                        linearPath.style.visibility = 'visible';
                        if (progress.isActive) {
                            value = this.activeAnimate((args.timeStamp / args.duration), parseInt(x, 10), parseInt(width, 10), true);
                            opacityValue = effect(args.timeStamp, 0.5, 0.5, args.duration, true);
                            active.setAttribute('opacity', opacityValue.toString());
                            linearPath.setAttribute('x', value.toString());
                        } else {
                            value = effect(args.timeStamp, start, end, args.duration, true);
                            linearPath.setAttribute('x', value.toString());
                        }
                    }
                } else {
                    if (args.timeStamp >= args.delay) {
                        linearPath.style.visibility = 'visible';
                        if (progress.isActive) {
                            value = this.activeAnimate((args.timeStamp / args.duration), 0, parseInt(width, 10), false);
                            opacityValue = effect(args.timeStamp, 0.5, 0.5, args.duration, true);
                            active.setAttribute('opacity', opacityValue.toString());
                            linearPath.setAttribute('width', value.toString());
                        } else {
                            value = effect(args.timeStamp, start, end, args.duration, false);
                            linearPath.setAttribute('width', value.toString());
                        }

                    }
                }
            },
            end: () => {
                progress.cancelResize = false;
                linearPath.style.visibility = '';
                if (progress.enableRtl && !(progress.cornerRadius === 'Round4px')) {
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
    public doLinearIndeterminate(
        element: Element, progressWidth: number, thickness: number, progress: ProgressBar, clipPath: Element
    ): void {
        const animation: Animation = new Animation({});
        const linearPath: HTMLElement = <HTMLElement>element;
        const x: string = linearPath.getAttribute('x');
        const width: string = linearPath.getAttribute('width');
        let value: number = 0;
        const start: number = (width) ? -(parseInt(width, 10)) : -progressWidth;
        const end: number = (progress.progressRect.x + progress.progressRect.width) + ((width) ? (parseInt(width, 10)) : progressWidth);
        const duration: number = (!progress.enableProgressSegments) ? 2500 : 3500;
        animation.animate(<HTMLElement>clipPath, {
            duration: duration,
            delay: 0,
            progress: (args: AnimationOptions): void => {
                if (progress.enableRtl && !(progress.cornerRadius === 'Round4px')) {
                    value = effect(
                        args.timeStamp, parseInt(x, 10) || progress.progressRect.x + progressWidth,
                        end, args.duration, true
                    );
                    if (!progress.enableProgressSegments) {
                        linearPath.setAttribute('x', value.toString());
                    } else {
                        linearPath.setAttribute('d', progress.getPathLine(value, progressWidth, thickness));
                    }
                } else {
                    value = effect(args.timeStamp, start, end, args.duration, false);
                    if (!progress.enableProgressSegments) {
                        linearPath.setAttribute('x', value.toString());
                    } else {
                        linearPath.setAttribute('d', progress.getPathLine(value, progressWidth, thickness));
                    }
                }
            },
            end: () => {
                if (progress.enableRtl && !progress.enableProgressSegments && !(progress.cornerRadius === 'Round4px')) {
                    linearPath.setAttribute('x', x.toString());
                } else if (!progress.enableProgressSegments) {
                    linearPath.setAttribute('x', start.toString());
                }
                if (!progress.destroyIndeterminate) {
                    this.doLinearIndeterminate(element, progressWidth, thickness, progress, clipPath);
                }
            }
        });
    }

    /** Linear striped */
    public doStripedAnimation(element: Element, progress: ProgressBar, value: number): void {
        const animation: Animation = new Animation({});
        const point: number = 1000 / progress.animation.duration;
        animation.animate(<HTMLElement>element, {
            duration: progress.animation.duration,
            delay: progress.animation.delay,
            progress: (): void => {
                value += (progress.enableRtl) ? -point : point;
                element.setAttribute('gradientTransform', 'translate(' + value + ') rotate(-45)');
            },
            end: () => {
                if (!progress.destroyIndeterminate) {
                    this.doStripedAnimation(element, progress, value);
                }
            }
        });
    }

    /** Circular animation */
    public doCircularAnimation(
        x: number, y: number, radius: number, progressEnd: number, totalEnd: number,
        element: Element, progress: ProgressBar, thickness: number, delay: number, startValue?: number,
        previousTotal?: number, active?: Element
    ): void {
        const animation: Animation = new Animation({});
        const circularPath: HTMLElement = <HTMLElement>element;
        let start: number = progress.startAngle;
        const pathRadius: number = radius + (thickness / 2);
        let end: number = 0;
        let opacityValue: number = 0;
        const duration: number = (progress.isActive) ? 3000 : progress.animation.duration;
        start += (progress.cornerRadius === 'Round' && totalEnd !== completeAngle && totalEnd !== 0) ?
            ((progress.enableRtl) ? (lineCapRadius / 2) * thickness : -(lineCapRadius / 2) * thickness) : 0;
        totalEnd += (progress.cornerRadius === 'Round' && totalEnd !== completeAngle && totalEnd !== 0) ?
            (lineCapRadius / 2) * thickness : 0;
        progressEnd += (progress.cornerRadius === 'Round' && totalEnd !== completeAngle && totalEnd !== 0) ?
            ((progress.enableRtl) ? -(lineCapRadius / 2) * thickness : (lineCapRadius / 2) * thickness) : 0;
        const startPos: number = (!isNullOrUndefined(startValue)) ? startValue : start;
        const endPos: number = (!isNullOrUndefined(startValue)) ? totalEnd - previousTotal : totalEnd;
        circularPath.setAttribute('visibility', 'Hidden');
        animation.animate(circularPath, {
            duration: duration,
            delay: delay,
            progress: (args: AnimationOptions): void => {
                progress.cancelResize = true;
                if (args.timeStamp >= args.delay) {
                    circularPath.setAttribute('visibility', 'visible');
                    if (progress.isActive) {
                        end = this.activeAnimate((args.timeStamp / args.duration), startPos, endPos, progress.enableRtl);
                        opacityValue = effect(args.timeStamp, 0.5, 0.5, args.duration, true);
                        active.setAttribute('opacity', opacityValue.toString());
                        circularPath.setAttribute('d', getPathArc(x, y, pathRadius, start, end % 360, progress.enableRtl, true));
                    } else {
                        end = effect(args.timeStamp, startPos, endPos, args.duration, progress.enableRtl);
                        circularPath.setAttribute('d', getPathArc(x, y, pathRadius, start, end % 360, progress.enableRtl, true));
                    }
                }
            },
            end: () => {
                progress.cancelResize = false;
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
        start: number, end: number, x: number, y: number, radius: number, thickness: number, clipPath: Element
    ): void {
        const animation: Animation = new Animation({});
        const pathRadius: number = radius + ((!progress.enableProgressSegments) ? (thickness / 2) : 0);
        const value: number = (!progress.enableProgressSegments) ? 3 : 2;
        animation.animate((<HTMLElement>clipPath), {
            progress: (): void => {
                (<HTMLElement>circularProgress).style.visibility = 'visible';
                start += (progress.enableRtl) ? -value : value;
                end += (progress.enableRtl) ? -value : value;
                circularProgress.setAttribute(
                    'd', getPathArc(x, y, pathRadius, start % 360, end % 360, progress.enableRtl, !progress.enableProgressSegments)
                );
            },
            end: () => {
                if (!progress.destroyIndeterminate) {
                    this.doCircularIndeterminate(circularProgress, progress, start, end, x, y, radius, thickness, clipPath);
                }

            }
        });
    }

    /** To do the label animation for progress bar */
    public doLabelAnimation(labelPath: Element, start: number, end: number, progress: ProgressBar, delay: number, textSize?: number): void {
        const animation: Animation = new Animation({});
        const label: Animation = new Animation({});
        let startPos: number;
        let endPos: number;
        const text: string = labelPath.innerHTML;
        let value: number = 0;
        let xPos: number = 0;
        let valueChanged: number = 0;
        const percentage: number = 100;
        const labelText: string = progress.labelStyle.text;
        const labelPos: string = progress.labelStyle.textAlignment;
        const posX: number = parseInt(labelPath.getAttribute('x'), 10);
        labelPath.setAttribute('visibility', 'Hidden');
        if (progress.type === 'Linear') {
            startPos = (progress.enableRtl) ? (progress.progressRect.x + progress.progressRect.width) + (textSize / 2) :
                       start - (textSize / 2);
            startPos = (startPos <= 0) ? 0 : startPos;
            endPos = (progress.enableRtl) ? startPos - posX : posX - startPos;
        }
        animation.animate(<HTMLElement>labelPath, {
            duration: progress.animation.duration,
            delay: delay,
            progress: (args: AnimationOptions): void => {
                progress.cancelResize = true;
				args.name = "SlideRight";
                if (progress.type === 'Linear') {
                    if (args.timeStamp >= args.delay) {
                        if (labelText === '') {
                            labelPath.setAttribute('visibility', 'visible');
                            value = effect(args.timeStamp, start, end, args.duration, false);
                            valueChanged = parseInt((((Math.round(value)) / progress.progressRect.width) * percentage).toString(), 10);
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
                        value = effect(args.timeStamp, start, end - start, args.duration, false);
                        valueChanged = parseInt((((Math.round(value)) / progress.totalAngle) * percentage).toString(), 10);
                        labelPath.innerHTML = valueChanged.toString() + '%';
                    }
                }
            },
            end: () => {
                progress.cancelResize = false;
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
        const animation: Animation = new Animation({});
        let value: number = 0;
        const percentage: number = 100;
        const isAnnotation: boolean = progress.annotations.length > 0;
        let annotatElementChanged: Element;
        let firstAnnotatElement: Element;
        const start: number = progress.startAngle;
        const totalAngle: number = progress.totalAngle;
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
        totalEnd = ((progress.argsData.value - progress.minimum) / (progress.maximum - progress.minimum)) * progress.totalAngle;
        progress.annotateTotal = totalEnd =
            (progress.argsData.value < progress.minimum || progress.argsData.value > progress.maximum) ? 0 : totalEnd;
        progress.annotateEnd = start + totalEnd;
        annotateValue = ((progress.argsData.value - progress.minimum) / (progress.maximum - progress.minimum)) * percentage;
        annotateValue = (progress.argsData.value < progress.minimum || progress.argsData.value > progress.maximum) ? 0 :
            Math.round(annotateValue);
        const startValue: number = (!isNullOrUndefined(previousEnd)) ? previousEnd : start;
        const endValue: number = (!isNullOrUndefined(previousEnd)) ? totalEnd - previousTotal : totalEnd;
        if (progress.argsData.value <= progress.minimum || progress.argsData.value > progress.maximum) {
            annotatElementChanged.innerHTML = annotateValue + '%';
        } else {
            animation.animate((<HTMLElement>circularPath), {
                duration: progress.animation.duration,
                delay: progress.animation.delay,
                progress: (args: AnimationOptions): void => {
                    progress.cancelResize = true;
                    if (isAnnotation && annotatElementChanged) {
                        value = effect(args.timeStamp, startValue, endValue, args.duration, false);
                        annotateValueChanged = parseInt((((Math.round(value) - start) / totalAngle) * percentage).toString(), 10);
                        annotatElementChanged.innerHTML = annotateValueChanged ? annotateValueChanged.toString() + '%' : '0%';
                    }
                },
                end: () => {
                    progress.cancelResize = false;
                    annotatElementChanged.innerHTML = annotateValue + '%';
                }
            });
        }
    }

    private activeAnimate(t: number, start: number, end: number, enableRtl: boolean): number {
        const time: number = 1 - Math.pow(1 - t, 3);
        const attrValue: number = start + ((!enableRtl) ? (time * end) : -(time * end));
        return attrValue;
    }

}

