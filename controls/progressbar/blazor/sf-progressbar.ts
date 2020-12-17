import { BlazorDotnetObject, isNullOrUndefined, Animation, AnimationOptions, Browser } from '@syncfusion/ej2-base';

const LINECAPRADIUS: number = 0.9;
const SPACE: string = ' ';

class SfProgressbar {
    public element: BlazorProgressbarElement;
    public dotNetRef: BlazorDotnetObject;
    public circularData: ICircularAnimateData;
    public circularBufferData: ICircularAnimateData;
    public annotationData: IAnnotationData;
    public labelData: ILabelData;
    public stripeData: ILinearAnimateData;
    public lineardata: ILinearAnimateData;
    public linearBufferdata: ILinearAnimateData;
    public cancelResize: boolean;
    constructor(element: BlazorProgressbarElement, dotNetRef: BlazorDotnetObject) {
        this.element = element;
        this.dotNetRef = dotNetRef;
        this.element.blazor__instance = this;
    }
    public wireEvents(): void {
        // tslint:disable-next-line:max-line-length
        window.addEventListener((Browser.isTouch && ('orientation' in window && 'onorientationchange' in window)) ? 'orientationchange' : 'resize', this.reSize.bind(this));
    }
    private reSize(): void {
        if (this.dotNetRef && !this.cancelResize) {
            this.dotNetRef.invokeMethodAsync('TriggerReSize');
        }
    }
    // tslint:disable-next-line:max-line-length
    private getPathArc(x: number, y: number, radius: number, startAngle: number, endAngle: number, enableRtl: boolean, pieView?: boolean): string {
        let start: Pos = this.degreeToLocation(x, y, radius, startAngle);
        let end: Pos = this.degreeToLocation(x, y, radius, endAngle);
        let largeArcFlag: string = '0';
        let sweepFlag: string = (enableRtl) ? '0' : '1';
        if (!enableRtl) {
            largeArcFlag = ((endAngle >= startAngle) ? endAngle : endAngle + 360) - startAngle <= 180 ? '0' : '1';
        } else {
            largeArcFlag = ((startAngle >= endAngle) ? startAngle : startAngle + 360) - endAngle <= 180 ? '0' : '1';
        }
        let d: string;
        if (pieView) {
            d = 'M ' + x + SPACE + y + ' L ' + start.x + SPACE + start.y + ' A ' + radius + SPACE +
                radius + SPACE + ' 0 ' + SPACE + largeArcFlag + SPACE + sweepFlag + SPACE + end.x + SPACE + end.y + SPACE + 'Z';
        } else {
            d = 'M' + start.x + SPACE + start.y +
                'A' + radius + SPACE + radius + SPACE + '0' + SPACE + largeArcFlag + SPACE + sweepFlag + SPACE + end.x + SPACE + end.y;
        }
        return d;
    }
    private degreeToLocation(centerX: number, centerY: number, radius: number, angleInDegrees: number): Pos {
        let angleInRadians: number = (angleInDegrees - 90) * (Math.PI / 180);
        return {
            x: centerX + (radius * Math.cos(angleInRadians)),
            y: centerY + (radius * Math.sin(angleInRadians))
        };
    }
    private effect(currentTime: number, startValue: number, endValue: number, duration: number, enableRtl: boolean): number {
        // tslint:disable-next-line:max-line-length
        return (enableRtl ? endValue : -endValue) * Math.cos(currentTime / duration * (Math.PI / 2)) + (startValue + (enableRtl ? -endValue : endValue));
    }
    private activeAnimate(time: number, start: number, end: number, enableRtl: boolean): number {
        let activeTime: number = 1 - Math.pow(1 - time, 3);
        return start + (!enableRtl ? activeTime * end : -activeTime * end);
    }
    private getPathLine(x: number, animateData: ILinearAnimateData): string {
        // tslint:disable-next-line:max-line-length
        let moveTo: number = animateData.enableRtl ? animateData.cornerRadius === 'Round' ? (x + animateData.rectWidth) - ((LINECAPRADIUS / 2) * animateData.thickness) : (x + animateData.rectWidth) :
            animateData.cornerRadius === 'Round' ? (x + (LINECAPRADIUS / 2) * animateData.thickness) : x;
        // tslint:disable-next-line:max-line-length
        let lineTo: number = animateData.enableRtl ? animateData.cornerRadius === 'Round' && animateData.progressWidth ? (moveTo - animateData.progressWidth + (LINECAPRADIUS * animateData.thickness)) : moveTo - animateData.progressWidth :
            animateData.cornerRadius === 'Round' && animateData.progressWidth ? moveTo + animateData.progressWidth - (LINECAPRADIUS * animateData.thickness) : moveTo + animateData.progressWidth;
        // tslint:disable-next-line:max-line-length
        return 'M' + moveTo + SPACE + (animateData.rectX + (animateData.rectHeight / 2)) + 'L' + lineTo + ' ' + (animateData.rectY + (animateData.rectHeight / 2));
    }
    public circularAnimation(): void {
        let animation: Animation = new Animation({});
        let progressElement: HTMLElement = document.getElementById(this.element.id + '_clippathcircle');
        let end: number = 0;
        if (progressElement && this.circularData) {
            progressElement.style.visibility = 'hidden';
            animation.animate((progressElement), {
                duration: this.circularData.duration,
                delay: this.circularData.delay,
                progress: (args: AnimationOptions): void => {
                    this.cancelResize = true;
                    if (args.timeStamp >= args.delay) {
                        progressElement.style.visibility = 'visible';
                        if (this.circularData.isActive) {
                            // tslint:disable-next-line:max-line-length
                            end = this.activeAnimate((args.timeStamp / args.duration), this.circularData.startPos, this.circularData.endPos, this.circularData.enableRtl);
                            let activeElement: HTMLElement = document.getElementById(this.element.id + '_CircularActiveProgress');
                            if (activeElement) {
                                // tslint:disable-next-line:max-line-length
                                activeElement.setAttribute('opacity', this.effect(args.timeStamp, 0.5, 0.5, args.duration, true).toString());
                            }
                        } else {
                            // tslint:disable-next-line:max-line-length
                            end = this.effect(args.timeStamp, this.circularData.startPos, this.circularData.endPos, args.duration, this.circularData.enableRtl);
                        }
                        // tslint:disable-next-line:max-line-length
                        progressElement.setAttribute('d', this.getPathArc(this.circularData.x, this.circularData.y, this.circularData.pathRadius, this.circularData.start, end % 360, this.circularData.enableRtl, true));
                    }
                },
                end: () => {
                    this.cancelResize = false;
                    // tslint:disable-next-line:max-line-length
                    progressElement.setAttribute('d', this.getPathArc(this.circularData.x, this.circularData.y, this.circularData.pathRadius, this.circularData.start, this.circularData.progressEnd, this.circularData.enableRtl, true));
                    if (this.circularData.isActive) {
                        this.circularAnimation();
                    }
                    this.dotNetRef.invokeMethodAsync('TriggerAnimationComplete');
                }
            });
        }
    }
    public circularBufferAnimation(): void {
        let animation: Animation = new Animation({});
        let progressElement: HTMLElement = document.getElementById(this.element.id + '_clippathBuffercircle');
        let end: number = 0;
        if (progressElement && this.circularBufferData) {
            progressElement.style.visibility = 'hidden';
            animation.animate((progressElement), {
                duration: this.circularBufferData.duration,
                delay: this.circularBufferData.delay,
                progress: (args: AnimationOptions): void => {
                    this.cancelResize = true;
                    if (args.timeStamp >= args.delay) {
                        progressElement.style.visibility = 'visible';
                        // tslint:disable-next-line:max-line-length
                        end = this.effect(args.timeStamp, this.circularBufferData.startPos, this.circularBufferData.endPos, args.duration, this.circularBufferData.enableRtl);
                        // tslint:disable-next-line:max-line-length
                        progressElement.setAttribute('d', this.getPathArc(this.circularBufferData.x, this.circularBufferData.y, this.circularBufferData.pathRadius, this.circularBufferData.start, end % 360, this.circularBufferData.enableRtl, true));
                    }
                },
                end: () => {
                    this.cancelResize = false;
                    // tslint:disable-next-line:max-line-length
                    progressElement.setAttribute('d', this.getPathArc(this.circularBufferData.x, this.circularBufferData.y, this.circularBufferData.pathRadius, this.circularBufferData.start, this.circularBufferData.progressEnd, this.circularBufferData.enableRtl, true));
                    this.dotNetRef.invokeMethodAsync('TriggerAnimationComplete');
                }
            });
        }
    }
    public circularIndeterminateAnimation(start: number = 0, end: number = 0): void {
        let progressElement: HTMLElement = document.getElementById(this.element.id + '_clippathcircle');
        let animation: Animation = new Animation({});
        if (progressElement && this.circularData) {
            animation.destroy();
            animation.animate((progressElement), {
                duration: this.circularData.duration,
                delay: 0,
                progress: (): void => {
                    if (this.circularData && this.circularData.enable && this.circularData.isIndeterminate) {
                        progressElement.style.visibility = 'visible';
                        start += this.circularData.enableRtl ? -this.circularData.segmentValue : this.circularData.segmentValue;
                        end += this.circularData.enableRtl ? -this.circularData.segmentValue : this.circularData.segmentValue;
                        // tslint:disable-next-line:max-line-length
                        progressElement.setAttribute('d', this.getPathArc(this.circularData.x, this.circularData.y, this.circularData.pathRadius, start % 360, end % 360, this.circularData.enableRtl, !this.circularData.enableProgressSegments));
                    }
                },
                end: () => {
                    if (this.circularData && this.circularData.enable && this.circularData.isIndeterminate) {
                        this.circularIndeterminateAnimation(start, end);
                    }
                }
            });
        }
    }
    public annotationAnimation(): void {
        let animation: Animation = new Animation({});
        let progressElement: HTMLElement;
        let annotatElementChanged: Element;
        let annotatElement: Element = document.getElementById(this.element.id + 'Annotation0').children[0];
        if (annotatElement && annotatElement.children[0]) {
            if (annotatElement.children[0].tagName === 'SPAN') {
                annotatElementChanged = annotatElement.children[0];
            }
        }
        if (annotatElementChanged && this.annotationData) {
            if (this.annotationData.type === 'Linear') {
                progressElement = document.getElementById(this.element.id + '_clippathrect');
            } else {
                progressElement = document.getElementById(this.element.id + '_clippathcircle');
            }
            if (this.annotationData.isContent) {
                annotatElementChanged.innerHTML = this.annotationData.annotateValue + '%';
            } else if (progressElement) {
                animation.animate((progressElement), {
                    duration: this.annotationData.duration,
                    delay: this.annotationData.delay,
                    progress: (args: AnimationOptions): void => {
                        this.cancelResize = true;
                        // tslint:disable-next-line:max-line-length
                        let effectValue: number = this.effect(args.timeStamp, this.annotationData.startPos, this.annotationData.endPos, args.duration, false);
                        // tslint:disable-next-line:max-line-length
                        let annotateValueChanged: number = parseInt((((Math.round(effectValue) - this.annotationData.start) / this.annotationData.totalAngle) * 100).toString(), 10);
                        annotatElementChanged.innerHTML = annotateValueChanged ? annotateValueChanged.toString() + '%' : '0%';
                    },
                    end: () => {
                        this.cancelResize = false;
                        annotatElementChanged.innerHTML = this.annotationData.annotateValue + '%';
                    }
                });
            }
        }
    }
    public labelAnimation(): void {
        let labelElement: HTMLElement;
        if (this.labelData) {
            labelElement = this.labelData.type === 'Linear' ? document.getElementById(this.element.id + '_linearLabel') : document.getElementById(this.element.id + '_circularLabel');
        }
        let animation: Animation = new Animation({});
        let labelAnimation: Animation = new Animation({});
        if (labelElement && this.labelData && !this.labelData.isStriped) {
            labelElement.style.visibility = 'hidden';
            animation.animate((labelElement), {
                duration: this.labelData.duration,
                delay: this.labelData.delay,
                progress: (args: AnimationOptions): void => {
                    this.cancelResize = true;
                    if (this.labelData.type === 'Linear' && args.timeStamp >= args.delay && this.labelData.labelText === '') {
                        labelElement.style.visibility = 'visible';
                        let effectValue: number = this.effect(args.timeStamp, 0, this.labelData.end, args.duration, false);
                        let valueChanged: number = parseInt(((effectValue / this.labelData.width) * 100).toString(), 10);
                        labelElement.innerHTML = valueChanged.toString() + '%';
                        if (this.labelData.labelPos === 'Far' || this.labelData.labelPos === 'Center') {
                            // tslint:disable-next-line:max-line-length
                            let xPos: number = this.effect(args.timeStamp, this.labelData.startPos, this.labelData.endPos, args.duration, this.labelData.enableRtl);
                            labelElement.setAttribute('x', xPos.toString());
                        }
                    } else if (this.labelData.type === 'Circular' && this.labelData.labelText === '') {
                        labelElement.style.visibility = 'visible';
                        // tslint:disable-next-line:max-line-length
                        let effectValue: number = this.effect(args.timeStamp, this.labelData.start, this.labelData.end, args.duration, false);
                        // tslint:disable-next-line:max-line-length
                        let valueChanged: number = parseInt((((effectValue - this.labelData.start) / this.labelData.totalAngle) * 100).toString(), 10);
                        labelElement.innerHTML = valueChanged.toString() + '%';
                    }
                },
                end: () => {
                    this.cancelResize = false;
                    if (labelElement && this.labelData.labelText === '') {
                        labelElement.style.visibility = 'visible';
                        labelElement.innerHTML = this.labelData.text;
                        labelElement.setAttribute('x', this.labelData.x.toString());
                    } else {
                        labelAnimation.animate(labelElement, {
                            progress: (args: AnimationOptions): void => {
                                labelElement.style.visibility = 'visible';
                                let effectValue: number = this.effect(args.timeStamp, 0, 1, args.duration, false);
                                labelElement.setAttribute('opacity', effectValue.toString());
                            },
                            end: () => {
                                labelElement.setAttribute('opacity', '1');
                            }
                        });
                    }
                }
            });
        }
    }
    public stripeAnimation(pointValue: number = 0): void {
        let animation: Animation = new Animation({});
        let stripElement: HTMLElement = document.getElementById(this.element.id + '_LinearStriped');
        if (stripElement && this.stripeData) {
            animation.animate((stripElement), {
                duration: this.stripeData.duration,
                delay: this.stripeData.delay,
                progress: (): void => {
                    if (this.stripeData.enable) {
                        pointValue += this.stripeData.enableRtl ? -this.stripeData.durationValue : this.stripeData.durationValue;
                        stripElement.setAttribute('gradientTransform', 'translate(' + pointValue + ') rotate(-45)');
                    }
                },
                end: () => {
                    if (this.stripeData.enable) {
                        this.stripeAnimation(pointValue);
                    }
                }
            });
        }
    }
    public linearIndeterminateAnimation(): void {
        let animation: Animation = new Animation({});
        let progressElement: HTMLElement = document.getElementById(this.element.id + '_clippathrect');
        if (progressElement && this.lineardata) {
            progressElement.style.visibility = 'hidden';
            animation.animate((progressElement), {
                duration: this.lineardata.duration,
                delay: 0,
                progress: (args: AnimationOptions): void => {
                    progressElement.style.visibility = 'visible';
                    // tslint:disable-next-line:max-line-length
                    if (this.lineardata.enableRtl && this.lineardata.enableRtl && this.lineardata.enable && this.lineardata.isIndeterminate) {
                        // tslint:disable-next-line:max-line-length
                        let xValue: number = this.effect(args.timeStamp, this.lineardata.x || this.lineardata.rectX + this.lineardata.progressWidth, this.lineardata.end, args.duration, this.lineardata.enableRtl);
                        if (!this.lineardata.enableProgressSegments) {
                            progressElement.setAttribute('x', xValue.toString());
                        } else {
                            progressElement.setAttribute('d', this.getPathLine(xValue, this.lineardata));
                        }
                    } else if (this.lineardata.enable && this.lineardata.isIndeterminate) {
                        // tslint:disable-next-line:max-line-length
                        let xValue: number = this.effect(args.timeStamp, this.lineardata.start, this.lineardata.end, args.duration, this.lineardata.enableRtl);
                        if (!this.lineardata.enableProgressSegments) {
                            progressElement.setAttribute('x', xValue.toString());
                        } else {
                            progressElement.setAttribute('d', this.getPathLine(xValue, this.lineardata));
                        }
                    }
                },
                end: () => {
                    if (this.lineardata && this.lineardata.enable && this.lineardata.isIndeterminate) {
                        // tslint:disable-next-line:max-line-length
                        if (this.lineardata.enableRtl && !this.lineardata.enableProgressSegments && !(this.lineardata.cornerRadius === 'Round4px')) {
                            progressElement.setAttribute('x', this.lineardata.x.toString());
                        } else if (!this.lineardata.enableProgressSegments) {
                            progressElement.setAttribute('x', this.lineardata.start.toString());
                        }
                        this.linearIndeterminateAnimation();
                        this.dotNetRef.invokeMethodAsync('TriggerAnimationComplete');
                    }
                }
            });
        }
    }
    public linearAnimation(): void {
        let animation: Animation = new Animation({});
        let progressElement: HTMLElement = document.getElementById(this.element.id + '_clippathrect');
        let widthValue: number = 0;
        if (progressElement && this.lineardata) {
            progressElement.style.visibility = 'hidden';
            animation.animate((progressElement), {
                duration: this.lineardata.duration,
                delay: this.lineardata.delay,
                progress: (args: AnimationOptions): void => {
                    this.cancelResize = true;
                    if (this.lineardata.enableRtl && this.lineardata.cornerRadius !== 'Round4px' && args.timeStamp >= args.delay) {
                        progressElement.style.visibility = 'visible';
                        if (this.lineardata.isActive) {
                            let activeElement: HTMLElement = document.getElementById(this.element.id + '_LinearActiveProgress');
                            // tslint:disable-next-line:max-line-length
                            widthValue = this.activeAnimate((args.timeStamp / args.duration), this.lineardata.x, this.lineardata.width, true);
                            if (activeElement) {
                                // tslint:disable-next-line:max-line-length
                                activeElement.setAttribute('opacity', this.effect(args.timeStamp, 0.5, 0.5, args.duration, true).toString());
                                progressElement.setAttribute('x', widthValue.toString());
                            }
                        } else {
                            // tslint:disable-next-line:max-line-length
                            progressElement.setAttribute('x', this.effect(args.timeStamp, this.lineardata.start, this.lineardata.end, args.duration, true).toString());
                        }
                    } else if (args.timeStamp >= args.delay) {
                        progressElement.style.visibility = 'visible';
                        if (this.lineardata.isActive) {
                            let activeElement: HTMLElement = document.getElementById(this.element.id + '_LinearActiveProgress');
                            // tslint:disable-next-line:max-line-length
                            widthValue = this.activeAnimate((args.timeStamp / args.duration), 0, this.lineardata.width, this.lineardata.enableRtl);
                            if (activeElement) {
                                // tslint:disable-next-line:max-line-length
                                activeElement.setAttribute('opacity', this.effect(args.timeStamp, 0.5, 0.5, args.duration, true).toString());
                                progressElement.setAttribute('width', widthValue.toString());
                            }
                        } else {
                            // tslint:disable-next-line:max-line-length
                            progressElement.setAttribute('width', this.effect(args.timeStamp, this.lineardata.start, this.lineardata.end, args.duration, false).toString());
                        }
                    }
                },
                end: () => {
                    this.cancelResize = false;
                    // tslint:disable-next-line:max-line-length
                    if (this.lineardata && this.lineardata.enable && this.lineardata.enableRtl && this.lineardata.cornerRadius !== 'Round4px') {
                        if (this.lineardata.isActive) {
                            progressElement.setAttribute('x', this.lineardata.x.toString());
                            this.linearAnimation();
                        } else {
                            progressElement.setAttribute('x', this.lineardata.rtlX.toString());
                        }
                    } else if (this.lineardata && this.lineardata.enable) {
                        progressElement.setAttribute('width', this.lineardata.width.toString());
                        if (this.lineardata.isActive) {
                            this.linearAnimation();
                        }
                    }
                    this.dotNetRef.invokeMethodAsync('TriggerAnimationComplete');
                }
            });
        }
    }
    public linearBufferAnimation(): void {
        let animation: Animation = new Animation({});
        let progressElement: HTMLElement = document.getElementById(this.element.id + '_clippathBufferrect');
        if (progressElement && this.linearBufferdata) {
            progressElement.style.visibility = 'hidden';
            animation.animate((progressElement), {
                duration: this.linearBufferdata.duration,
                delay: this.linearBufferdata.delay,
                progress: (args: AnimationOptions): void => {
                    this.cancelResize = true;
                    // tslint:disable-next-line:max-line-length
                    if (this.linearBufferdata.enableRtl && this.linearBufferdata.cornerRadius !== 'Round4px' && args.timeStamp >= args.delay) {
                        if (args.timeStamp >= args.delay) {
                            progressElement.style.visibility = 'visible';
                            // tslint:disable-next-line:max-line-length
                            progressElement.setAttribute('x', this.effect(args.timeStamp, this.linearBufferdata.start, this.linearBufferdata.end, args.duration, true).toString());
                        }
                    } else if (args.timeStamp >= args.delay) {
                        progressElement.style.visibility = 'visible';
                        // tslint:disable-next-line:max-line-length
                        progressElement.setAttribute('width', this.effect(args.timeStamp, this.linearBufferdata.start, this.linearBufferdata.end, args.duration, false).toString());
                    }
                },
                end: () => {
                    this.cancelResize = false;
                    progressElement.style.visibility = '';
                    // tslint:disable-next-line:max-line-length
                    if (this.lineardata && this.linearBufferdata.enable && this.linearBufferdata.enableRtl && this.linearBufferdata.cornerRadius !== 'Round4px') {
                        progressElement.setAttribute('x', this.linearBufferdata.rtlX.toString());
                    } else if (this.linearBufferdata && this.linearBufferdata.enable) {
                        progressElement.setAttribute('width', this.linearBufferdata.width.toString());
                    }
                    this.dotNetRef.invokeMethodAsync('TriggerAnimationComplete');
                }
            });
        }
    };
}

class Pos {
    public x: number;
    public y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

interface Base {
    x: number;
    delay: number;
    duration: number;
    enableProgressSegments: boolean;
    isStriped: boolean;
    start: number;
    startPos: number;
    end: number;
    endPos: number;
    enableRtl: boolean;
    isActive: boolean;
    isBuffer: boolean;
    isIndeterminate: boolean;
    enable: boolean;
    width: number;
    type: string;
    annotateValue: number;
    totalAngle: number;
}

interface ICircularAnimateData extends Base {
    y: number;
    segmentValue: number;
    progressEnd: number;
    pathRadius: number;
    radius: number;
}

interface IAnnotationData extends Base {
    isContent: boolean;
}

interface ILabelData extends Base {
    labelText: string;
    text: string;
    labelPos: string;
}

interface ILinearAnimateData extends Base {
    rectX: number;
    rectY: number;
    rectHeight: number;
    rectWidth: number;
    cornerRadius: string;
    rtlX: number;
    durationValue: number;
    progressWidth: number;
    thickness: number;
}

interface BlazorProgressbarElement extends HTMLElement {
    blazor__instance: SfProgressbar;
}

// tslint:disable
let Progressbar: object = {
    initialize(element: BlazorProgressbarElement, height: string, width: string, dotNetRef: BlazorDotnetObject): any {
        let layout = new SfProgressbar(element, dotNetRef);
        layout.wireEvents();
        return this.getElementSize(element, height, width);
    },
    setSecondaryElementStyle(element: BlazorProgressbarElement): void {
        if (element) {
            let svgRect: ClientRect = document.getElementById(element.id + 'SVG').getBoundingClientRect();
            let secElement: HTMLElement = document.getElementById(element.id + 'Secondary_Element');
            let elementRect: ClientRect = element.getBoundingClientRect();
            if (secElement && svgRect) {
                secElement.style.visibility = 'visible';
                secElement.style.left = Math.max(svgRect.left - elementRect.left, 0) + 'px';
                secElement.style.top = Math.max(svgRect.top - elementRect.top, 0) + 'px';
            }
        }
    },
    getElementSize(element: BlazorProgressbarElement, height: string, width: string): any {
        let elementWidth: number;
        let elementHeight: number;
        if (element) {
            element.style.height = height;
            element.style.width = width;
            let elementRect: ClientRect = element.getBoundingClientRect();
            elementWidth = elementRect.width;
            elementHeight = elementRect.height;
            element.style.width = '';
            element.style.height = '';
        }
        return { width: elementWidth, height: elementHeight };
    },
    doLinearBufferAnimation(element: BlazorProgressbarElement, animateData: ILinearAnimateData): void {
        if (!isNullOrUndefined(element.blazor__instance)) {
            element.blazor__instance.linearBufferdata = animateData;
            element.blazor__instance.linearBufferAnimation();
        }
    },
    doLinearAnimation(element: BlazorProgressbarElement, animateData: ILinearAnimateData): void {
        if (!isNullOrUndefined(element.blazor__instance)) {
            element.blazor__instance.lineardata = animateData;
            element.blazor__instance.linearAnimation();
        }
    },
    doLinearIndeterminate(element: BlazorProgressbarElement, animateData: ILinearAnimateData): void {
        if (!isNullOrUndefined(element.blazor__instance)) {
            element.blazor__instance.lineardata = animateData;
            element.blazor__instance.linearIndeterminateAnimation();
        }
    },
    doStripedAnimation(element: BlazorProgressbarElement, animateData: ILinearAnimateData): void {
        if (!isNullOrUndefined(element.blazor__instance)) {
            element.blazor__instance.stripeData = animateData;
            element.blazor__instance.stripeAnimation();
        }
    },
    doCircularAnimation(element: BlazorProgressbarElement, circularData: ICircularAnimateData): void {
        if (!isNullOrUndefined(element.blazor__instance)) {
            element.blazor__instance.circularData = circularData;
            element.blazor__instance.circularAnimation();
        }
    },
    doCircularBufferAnimation(element: BlazorProgressbarElement, circularData: ICircularAnimateData): void {
        if (!isNullOrUndefined(element.blazor__instance)) {
            element.blazor__instance.circularBufferData = circularData;
            element.blazor__instance.circularBufferAnimation();
        }
    },
    doCircularIndeterminate(element: BlazorProgressbarElement, circularData: ICircularAnimateData): void {
        if (!isNullOrUndefined(element.blazor__instance)) {
            element.blazor__instance.circularData = circularData;
            element.blazor__instance.circularIndeterminateAnimation(circularData.start, circularData.end);
        }
    },
    doAnnotationAnimation(element: BlazorProgressbarElement, annotationData: IAnnotationData): void {
        if (!isNullOrUndefined(element.blazor__instance)) {
            element.blazor__instance.annotationData = annotationData;
            element.blazor__instance.annotationAnimation();
        }
    },
    doLabelAnimation(element: BlazorProgressbarElement, labelData: ILabelData): void {
        if (!isNullOrUndefined(element.blazor__instance)) {
            element.blazor__instance.labelData = labelData;
            element.blazor__instance.labelAnimation();
        }
    },
    // tslint:disable-next-line:max-line-length
    update(element: BlazorProgressbarElement, animateData: object, type: string, labelAnimateData: ILabelData, annotationData: IAnnotationData): void {
        if (!isNullOrUndefined(element.blazor__instance)) {
            if (type === 'Linear') {
                let data: ILinearAnimateData = animateData as ILinearAnimateData;
                if (data.isStriped) {
                    element.blazor__instance.stripeData = data;
                } else {
                    element.blazor__instance.lineardata = data;
                }
            } else {
                element.blazor__instance.circularData = animateData as ICircularAnimateData;
            }
            if (labelAnimateData) {
                element.blazor__instance.labelData = animateData as ILabelData;
            }
            if (annotationData) {
                element.blazor__instance.annotationData = animateData as IAnnotationData;
            }
        }
    }
};
export default Progressbar;