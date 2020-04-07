import { ProgressBar } from '../../progressbar';
import { ProgressAnimation } from '../utils/progress-animation';
import { PathOption, getElement, Size, measureText } from '@syncfusion/ej2-svg-base';
import { ITextRenderEventArgs } from '../model/progress-interface';
import { stringToNumber, getPathArc } from '../utils/helper';
import { Segment } from './segment-progress';
import { TextOption } from '../utils/helper';


/**
 * Progressbar of type circular
 */
export class Circular {
    private progress: ProgressBar;
    private delay: number;
    private segment: Segment = new Segment();
    private animation: ProgressAnimation = new ProgressAnimation();
    constructor(progress: ProgressBar) {
        this.progress = progress;
    }

    /** To render the circular track */
    public renderCircularTrack(): void {
        let progress: ProgressBar = this.progress;
        let centerX: number;
        let centerY: number;
        let size: number;
        let radius: number;
        let startAngle: number;
        let endAngle: number;
        let circularTrack: Element;
        let circularPath: string;
        let trackThickness: number;
        let option: PathOption;
        let fill: string;
        let strokeWidth: number;
        let circularTrackGroup: Element = progress.renderer.createGroup({ 'id': progress.element.id + '_CircularTrackGroup' });
        startAngle = progress.startAngle;
        progress.totalAngle = (progress.endAngle - progress.startAngle) % 360;
        progress.totalAngle = (progress.totalAngle <= 0 ? (360 + progress.totalAngle) : progress.totalAngle);
        progress.totalAngle -= (progress.totalAngle === 360) ? 0.01 : 0;
        endAngle = (progress.startAngle + ((progress.enableRtl) ? -progress.totalAngle : +progress.totalAngle)) % 360;
        centerX = progress.progressRect.x + (progress.progressRect.width / 2);
        centerY = progress.progressRect.y + (progress.progressRect.height / 2);
        trackThickness = Math.max(progress.trackThickness, progress.progressThickness) ||
            Math.max(progress.themeStyle.circularProgressThickness, progress.themeStyle.circularTrackThickness);
        size = (Math.min(progress.progressRect.height, progress.progressRect.width) / 2) - trackThickness / 2;
        radius = stringToNumber(progress.radius, size);
        radius = (radius === null) ? 0 : radius;
        fill = (progress.enablePieProgress) ? (progress.argsData.trackColor || progress.themeStyle.circularTrackColor) : 'none';
        strokeWidth = (progress.enablePieProgress) ? 0 : (progress.trackThickness || progress.themeStyle.circularTrackThickness);
        circularPath = getPathArc(centerX, centerY, radius, startAngle, endAngle, progress.enableRtl, progress.enablePieProgress);
        option = new PathOption(
            progress.element.id + '_Circulartrack', fill, strokeWidth,
            (progress.argsData.trackColor || progress.themeStyle.circularTrackColor), progress.themeStyle.trackOpacity, '0', circularPath
        );
        circularTrack = progress.renderer.drawPath(option);
        progress.trackwidth = (<SVGPathElement>circularTrack).getTotalLength();
        if (progress.segmentCount > 1 && !progress.enablePieProgress) {
            progress.segmentSize = progress.calculateSegmentSize(
                progress.trackwidth, (progress.trackThickness || progress.themeStyle.linearTrackThickness)
            );
            circularTrack.setAttribute('stroke-dasharray', progress.segmentSize);
        }
        if (progress.cornerRadius === 'Round' && !progress.enablePieProgress) {
            circularTrack.setAttribute('stroke-linecap', 'round');
        }
        circularTrackGroup.appendChild(circularTrack);
        progress.svgObject.appendChild(circularTrackGroup);
    }

    /** To render the circular progress */
    public renderCircularProgress(previousStart?: number, previousEnd?: number, refresh?: boolean): void {
        let progress: ProgressBar = this.progress;
        let centerX: number; let centerY: number;
        let size: number; let endAngle: number;
        let radius: number;
        let startAngle: number = progress.startAngle;
        let previousPath: string; progress.progressStartAngle = startAngle;
        let circularPath: string; let progressEnd: number;
        let circularProgress: Element; let option: PathOption;
        let progressThickness: number; let linearClipPath: Element;
        let rDiff: number; let progressSegment: number;
        let circularProgressGroup: Element;
        let fill: string; let strokeWidth: number;
        centerX = progress.progressRect.x + (progress.progressRect.width / 2);
        centerY = progress.progressRect.y + (progress.progressRect.height / 2);
        progressThickness = Math.max(progress.trackThickness, progress.progressThickness) ||
            Math.max(progress.themeStyle.circularProgressThickness, progress.themeStyle.circularTrackThickness);
        size = (Math.min(progress.progressRect.height, progress.progressRect.width) / 2) - progressThickness / 2;
        radius = stringToNumber(progress.innerRadius, size);
        radius = (radius === null) ? 0 : radius;
        if (progress.secondaryProgress !== null && !progress.isIndeterminate) {
            this.renderCircularBuffer(progress, centerX, centerY, radius, startAngle);
        }
        if (progress.argsData.value !== null) {
            circularProgressGroup = progress.renderer.createGroup({ 'id': progress.element.id + '_CircularProgressGroup' });
            progressEnd = progress.calculateProgressRange(progress.minimum, progress.maximum, progress.argsData.value);
            if (progress.segmentColor.length !== 0 && !progress.isIndeterminate && !progress.enablePieProgress) {
                circularProgress = this.segment.createCircularSegment(
                    progress, '_CircularProgressSegment', centerX, centerY, radius,
                    progress.argsData.value, progress.themeStyle.progressOpacity,
                    (progress.progressThickness || progress.themeStyle.circularProgressThickness)
                );
            } else {
                endAngle = ((progress.isIndeterminate) ? (progress.startAngle + (
                    (progress.enableRtl) ? -progress.totalAngle : +progress.totalAngle)) % 360 : progressEnd
                );
                circularPath = getPathArc(centerX, centerY, radius, startAngle, endAngle, progress.enableRtl, progress.enablePieProgress);
                fill = (progress.enablePieProgress) ?
                    (progress.argsData.progressColor || progress.themeStyle.circularProgressColor) : 'none';
                strokeWidth = (progress.enablePieProgress) ? 0 :
                    (progress.progressThickness || progress.themeStyle.circularProgressThickness);
                option = new PathOption(
                    progress.element.id + '_Circularprogress', fill, strokeWidth,
                    (progress.argsData.progressColor || progress.themeStyle.circularProgressColor),
                    progress.themeStyle.progressOpacity, '0', circularPath
                );
                if (!refresh) {
                    circularProgress = progress.renderer.drawPath(option);
                } else {
                    circularProgress = getElement(progress.element.id + '_Circularprogress');
                    previousPath = circularProgress.getAttribute('d');
                    circularProgress.setAttribute('d', circularPath);
                    circularProgress.setAttribute('stroke', progress.argsData.progressColor || progress.themeStyle.circularProgressColor);
                }
                if (progress.segmentCount > 1 && !progress.enablePieProgress) {
                    rDiff = parseInt(progress.radius, 10) - parseInt(progress.innerRadius, 10);
                    if (rDiff !== 0) {
                        progressSegment = progress.trackwidth + (
                            (rDiff < 0) ? (progress.trackwidth * Math.abs(rDiff)) / parseInt(progress.radius, 10) :
                                -(progress.trackwidth * Math.abs(rDiff)) / parseInt(progress.radius, 10)
                        );
                        progress.segmentSize = progress.calculateSegmentSize(
                            progressSegment, (progress.progressThickness || progress.themeStyle.circularProgressThickness)
                        );
                    }
                    circularProgress.setAttribute('stroke-dasharray', progress.segmentSize);
                }
                if (progress.cornerRadius === 'Round' && startAngle !== endAngle) {
                    circularProgress.setAttribute('stroke-linecap', 'round');
                }
            }
            progress.progressEndAngle = endAngle;
            if (!refresh) {
                circularProgressGroup.appendChild(circularProgress);
                progress.svgObject.appendChild(circularProgressGroup);
            }
            if (progress.animation.enable && !progress.isIndeterminate) {
                let circulardelay: number = (progress.secondaryProgress !== null) ? 300 : progress.animation.delay;
                this.delay = circulardelay;
                linearClipPath = progress.createClipPath(progress.clipPath, null, refresh ? previousPath : '', null, refresh);
                circularProgressGroup.appendChild(progress.clipPath);
                circularProgress.setAttribute('style', 'clip-path:url(#' + progress.element.id + '_clippath)');
                this.animation.doCircularAnimation(
                    centerX, centerY, radius, startAngle, progressEnd, progress.value, linearClipPath, progress,
                    (progress.progressThickness || progress.themeStyle.circularProgressThickness),
                    circulardelay, refresh ? previousEnd : null
                );
            }
            if (progress.isIndeterminate) {
                linearClipPath = progress.createClipPath(progress.clipPath, null, refresh ? previousPath : '', null, refresh);
                circularProgressGroup.appendChild(progress.clipPath);
                circularProgress.setAttribute('style', 'clip-path:url(#' + progress.element.id + '_clippath)');
                this.animation.doCircularIndeterminate(
                    <HTMLElement>linearClipPath, progress, startAngle, progressEnd,
                    centerX, centerY, radius, (progress.progressThickness || progress.themeStyle.circularProgressThickness)
                );
            }
            progress.svgObject.appendChild(circularProgressGroup);
        }
    }

    /** To render the circular buffer */
    private renderCircularBuffer(progress: ProgressBar, centerX: number, centerY: number, radius: number, startAngle: number): void {
        let bufferClipPath: Element;
        let bufferEnd: number;
        let circularBuffer: Element;
        let radiusDiff: number;
        let circularBufferGroup: Element;
        let circularPath: string;
        let option: PathOption;
        let progressSegment: number;
        let fill: string;
        let strokeWidth: number;
        circularBufferGroup = progress.renderer.createGroup({ 'id': progress.element.id + '_ CircularBufferGroup' });
        bufferEnd = progress.calculateProgressRange(progress.minimum, progress.maximum, progress.secondaryProgress);
        if (progress.segmentColor.length !== 0 && !progress.isIndeterminate && !progress.enablePieProgress) {
            circularBuffer = this.segment.createCircularSegment(
                progress, '_CircularBufferSegment', centerX, centerY, radius,
                progress.secondaryProgress, progress.themeStyle.bufferOpacity,
                (progress.progressThickness || progress.themeStyle.circularProgressThickness)
            );
        } else {
            circularPath = getPathArc(centerX, centerY, radius, startAngle, bufferEnd, progress.enableRtl, progress.enablePieProgress);
            fill = (progress.enablePieProgress) ? (progress.argsData.progressColor || progress.themeStyle.circularProgressColor) : 'none';
            strokeWidth = (progress.enablePieProgress) ? 0 : (progress.progressThickness || progress.themeStyle.circularProgressThickness);
            option = new PathOption(
                progress.element.id + '_Circularbuffer', fill, strokeWidth,
                (progress.argsData.progressColor || progress.themeStyle.circularProgressColor),
                progress.themeStyle.bufferOpacity, '0', circularPath
            );
            circularBuffer = progress.renderer.drawPath(option);
            if (progress.segmentCount > 1 && !progress.enablePieProgress) {
                radiusDiff = parseInt(progress.radius, 10) - parseInt(progress.innerRadius, 10);
                if (radiusDiff !== 0) {
                    progressSegment = progress.trackwidth + (
                        (radiusDiff < 0) ? (progress.trackwidth * Math.abs(radiusDiff)) / parseInt(progress.radius, 10) :
                            -(progress.trackwidth * Math.abs(radiusDiff)) / parseInt(progress.radius, 10)
                    );
                    progress.segmentSize = progress.calculateSegmentSize(
                        progressSegment, (progress.progressThickness || progress.themeStyle.circularProgressThickness)
                    );
                }
                circularBuffer.setAttribute('stroke-dasharray', progress.segmentSize);
            }
            if (progress.cornerRadius === 'Round') {
                circularBuffer.setAttribute('stroke-linecap', 'round');
            }
        }
        circularBufferGroup.appendChild(circularBuffer);
        if (progress.animation.enable) {
            bufferClipPath = progress.createClipPath(progress.bufferClipPath, null, '', null, false);
            circularBufferGroup.appendChild(progress.bufferClipPath);
            circularBuffer.setAttribute('style', 'clip-path:url(#' + progress.element.id + '_clippathBuffer)');
            this.animation.doCircularAnimation(
                centerX, centerY, radius, startAngle, bufferEnd, progress.secondaryProgress, bufferClipPath, progress,
                (progress.progressThickness || progress.themeStyle.circularProgressThickness), progress.animation.delay, null
            );
        }
        progress.svgObject.appendChild(circularBufferGroup);
    }

    /** To render the circular Label */
    public renderCircularLabel(): void {
        let end: number;
        let circularLabel: Element;
        let circularValue: number;
        let centerX: number;
        let centerY: number;
        let argsData: ITextRenderEventArgs;
        let textSize: Size;
        let progress: ProgressBar = this.progress;
        let labelValue: number;
        let percentage: number = 100;
        let option: TextOption;
        labelValue = ((progress.value - progress.minimum) / (progress.maximum - progress.minimum)) * percentage;
        circularValue = (progress.value < progress.minimum || progress.value > progress.maximum) ? 0 : Math.round(labelValue);
        argsData = {
            cancel: false, text: progress.label ? progress.label : String(circularValue) + '%', color: progress.labelStyle.color
        };
        progress.trigger('textRender', argsData);
        if (!argsData.cancel) {
            textSize = measureText(argsData.text, progress.labelStyle);
            centerX = progress.progressRect.x + (progress.progressRect.width / 2);
            centerY = progress.progressRect.y + (progress.progressRect.height / 2) + (textSize.height / 2);
            option = new TextOption(
                progress.element.id + '_circularLabel', progress.labelStyle.size || progress.themeStyle.circularFontSize,
                progress.labelStyle.fontStyle || progress.themeStyle.circularFontStyle,
                progress.labelStyle.fontFamily || progress.themeStyle.circularFontFamily, progress.labelStyle.fontWeight,
                'middle', argsData.color || progress.themeStyle.fontColor, centerX, centerY, progress.progressRect.width,
                progress.progressRect.height
            );
            circularLabel = progress.renderer.createText(option, argsData.text);
            progress.svgObject.appendChild(circularLabel);
            if (progress.animation.enable && !progress.isIndeterminate) {
                end = ((progress.value - progress.minimum) / (progress.maximum - progress.minimum)) * progress.totalAngle;
                end = (progress.value < progress.minimum || progress.value > progress.maximum) ? 0 : end;
                this.animation.doLabelAnimation(circularLabel, progress.startAngle, end, progress, this.delay);
            }
        }
    }
}
