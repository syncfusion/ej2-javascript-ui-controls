import { ProgressBar } from '../../progressbar';
import { ProgressAnimation } from '../utils/progress-animation';
import { TextOption } from '../utils/helper';
import { PathOption, getElement, Size, measureText } from '@syncfusion/ej2-svg-base';
import { ITextRenderEventArgs } from '../model/progress-interface';
import { Segment } from './segment-progress';

/**
 * Progress Bar of type Linear
 */
export class Linear {
    private progress: ProgressBar;
    private delay: number;
    private segment: Segment = new Segment();
    private animation: ProgressAnimation = new ProgressAnimation();
    constructor(progress: ProgressBar) {
        this.progress = progress;
    }

    /** To render the linear track  */
    public renderLinearTrack(): void {
        let progress: ProgressBar = this.progress;
        let linearTrack: Element;
        let linearTrackWidth: number;
        let option: PathOption;
        let linearTrackGroup: Element = progress.renderer.createGroup({ 'id': progress.element.id + '_LinearTrackGroup' });
        linearTrackWidth = progress.progressRect.width;
        option = new PathOption(
            progress.element.id + '_Lineartrack', 'none', (progress.trackThickness || progress.themeStyle.linearTrackThickness),
            (progress.argsData.trackColor || progress.themeStyle.linearTrackColor), progress.themeStyle.trackOpacity,
            '0', progress.getPathLine(
                progress.progressRect.x, linearTrackWidth, (progress.trackThickness || progress.themeStyle.linearTrackThickness)
            )
        );
        linearTrack = progress.renderer.drawPath(option);
        if (progress.segmentCount > 1) {
            progress.segmentSize = progress.calculateSegmentSize(
                linearTrackWidth, (progress.trackThickness || progress.themeStyle.linearTrackThickness)
            );
            linearTrack.setAttribute('stroke-dasharray', progress.segmentSize);
        }
        if (progress.cornerRadius === 'Round') {
            linearTrack.setAttribute('stroke-linecap', 'round');
        }
        linearTrackGroup.appendChild(linearTrack);
        progress.svgObject.appendChild(linearTrackGroup);
    }

    /** To render the linear progress  */
    public renderLinearProgress(refresh?: boolean, previousWidth: number = 0): void {
        let progress: ProgressBar = this.progress;
        let linearBufferWidth: number;
        let secondaryProgressWidth: number;
        let option: PathOption;
        let linearProgress: Element;
        let progressWidth: number;
        let linearProgressWidth: number;
        let clipPathLinear: Element;
        let clipPathIndeterminate: Element;
        let linearProgressGroup: Element;
        let animationdelay: number;
        if (progress.secondaryProgress !== null && !progress.isIndeterminate) {
            this.renderLinearBuffer(progress);
        }
        if (progress.argsData.value !== null) {
            progressWidth = progress.calculateProgressRange(progress.minimum, progress.maximum, progress.argsData.value);
            progress.progressPreviousWidth = linearProgressWidth = progress.progressRect.width *
                ((progress.isIndeterminate) ? 1 : progressWidth);
            linearProgressGroup = progress.renderer.createGroup({ 'id': progress.element.id + '_LinearProgressGroup' });
            if (progress.segmentColor.length !== 0 && !progress.isIndeterminate) {
                linearProgress = this.segment.createLinearSegment(
                    progress, '_LinearProgressSegment', linearProgressWidth, progress.themeStyle.progressOpacity,
                    (progress.progressThickness || progress.themeStyle.linearProgressThickness)
                );
            } else {
                if (!refresh) {
                    option = new PathOption(
                        progress.element.id + '_Linearprogress', 'none',
                        (progress.progressThickness || progress.themeStyle.linearProgressThickness),
                        (progress.argsData.progressColor || progress.themeStyle.linearProgressColor),
                        progress.themeStyle.progressOpacity, '0',
                        progress.getPathLine(
                            progress.progressRect.x, linearProgressWidth,
                            (progress.progressThickness || progress.themeStyle.linearProgressThickness)
                        )
                    );
                    linearProgress = progress.renderer.drawPath(option);
                } else {
                    linearProgress = getElement(progress.element.id + '_Linearprogress');
                    linearProgress.setAttribute(
                        'd', progress.getPathLine(
                            progress.progressRect.x, linearProgressWidth,
                            (progress.progressThickness || progress.themeStyle.linearProgressThickness)
                        ));
                    linearProgress.setAttribute('stroke', progress.argsData.progressColor || progress.themeStyle.circularProgressColor);
                }

                if (progress.segmentCount > 1) {
                    linearProgress.setAttribute('stroke-dasharray', progress.segmentSize);
                }
                if (progress.cornerRadius === 'Round' && progressWidth) {
                    linearProgress.setAttribute('stroke-linecap', 'round');
                }
            }
            linearProgressGroup.appendChild(linearProgress);
            if (progress.animation.enable && !progress.isIndeterminate) {
                if ((progress.secondaryProgress !== null)) {
                    secondaryProgressWidth = progress.calculateProgressRange(
                        progress.minimum, progress.maximum, progress.secondaryProgress
                    );
                    linearBufferWidth = progress.progressRect.width * secondaryProgressWidth;
                    animationdelay = progress.animation.delay + (linearBufferWidth - linearProgressWidth);
                } else {
                    animationdelay = progress.animation.delay;
                }
                /** used for label animation delay */
                this.delay = animationdelay;
                clipPathLinear = progress.createClipPath(
                    progress.clipPath, progressWidth, null, refresh ? previousWidth : progress.progressRect.x, refresh,
                    (progress.progressThickness || progress.themeStyle.linearProgressThickness)
                );
                linearProgressGroup.appendChild(progress.clipPath);
                linearProgress.setAttribute('style', 'clip-path:url(#' + progress.element.id + '_clippath)');
                this.animation.doLinearAnimation(clipPathLinear, progress, animationdelay, refresh ? previousWidth : 0);
            }
            if (progress.isIndeterminate) {
                clipPathIndeterminate = progress.createClipPath(
                    progress.clipPath, progressWidth, null, refresh ? previousWidth : progress.progressRect.x, refresh,
                    (progress.progressThickness || progress.themeStyle.linearProgressThickness)
                );
                linearProgressGroup.appendChild(progress.clipPath);
                linearProgress.setAttribute('style', 'clip-path:url(#' + progress.element.id + '_clippath)');
                this.animation.doLinearIndeterminate(clipPathIndeterminate, progress);
            }
            progress.svgObject.appendChild(linearProgressGroup);
        }
    }

    /** To render the linear buffer */
    private renderLinearBuffer(progress: ProgressBar): void {
        let linearBuffer: Element;
        let secondaryProgressWidth: number;
        let clipPathBuffer: Element;
        let linearBufferGroup: Element;
        let linearBufferWidth: number;
        let option: PathOption;
        secondaryProgressWidth = progress.calculateProgressRange(progress.minimum, progress.maximum, progress.secondaryProgress);
        linearBufferWidth = progress.progressRect.width * secondaryProgressWidth;
        linearBufferGroup = progress.renderer.createGroup({ 'id': progress.element.id + '_LinearBufferGroup' });
        if (progress.segmentColor.length !== 0 && !progress.isIndeterminate) {
            linearBuffer = this.segment.createLinearSegment(
                progress, '_LinearBufferSegment', linearBufferWidth, progress.themeStyle.bufferOpacity,
                (progress.progressThickness || progress.themeStyle.linearProgressThickness)
            );
        } else {
            option = new PathOption(
                progress.element.id + '_Linearbuffer', 'none', (progress.progressThickness || progress.themeStyle.linearProgressThickness),
                (progress.argsData.progressColor || progress.themeStyle.linearProgressColor), progress.themeStyle.bufferOpacity, '0',
                progress.getPathLine(
                    progress.progressRect.x, linearBufferWidth, (progress.progressThickness || progress.themeStyle.linearProgressThickness)
                )
            );
            linearBuffer = progress.renderer.drawPath(option);
            if (progress.segmentCount > 1) {
                linearBuffer.setAttribute('stroke-dasharray', progress.segmentSize);
            }
            if (progress.cornerRadius === 'Round') {
                linearBuffer.setAttribute('stroke-linecap', 'round');
            }
        }
        linearBufferGroup.appendChild(linearBuffer);
        if (progress.animation.enable) {
            clipPathBuffer = progress.createClipPath(
                progress.bufferClipPath, secondaryProgressWidth, null, progress.progressRect.x, false,
                (progress.progressThickness || progress.themeStyle.linearProgressThickness)
            );
            linearBufferGroup.appendChild(progress.bufferClipPath);
            linearBuffer.setAttribute('style', 'clip-path:url(#' + progress.element.id + '_clippathBuffer)');
            this.animation.doLinearAnimation(clipPathBuffer, progress, progress.animation.delay, 0);
        }
        progress.svgObject.appendChild(linearBufferGroup);
    }

    /** Render the Linear Label */
    public renderLinearLabel(): void {
        let padding: number = 10;
        let linearlabel: Element;
        let linearValue: number;
        let posX: number;
        let posY: number;
        let end: number;
        let argsData: ITextRenderEventArgs;
        let textSize: Size;
        let progress: ProgressBar = this.progress;
        let labelValue: number;
        let percentage: number = 100;
        let option: TextOption;
        labelValue = ((progress.value - progress.minimum) / (progress.maximum - progress.minimum)) * percentage;
        linearValue = (progress.value < progress.minimum || progress.value > progress.maximum) ? 0 : Math.round(labelValue);
        argsData = {
            cancel: false, text: progress.label ? progress.label : String(linearValue) + '%', color: progress.labelStyle.color
        };
        progress.trigger('textRender', argsData);
        if (!argsData.cancel) {
            textSize = measureText(argsData.text, progress.labelStyle);
            posX = progress.progressRect.width * progress.calculateProgressRange(progress.minimum, progress.maximum, progress.value);
            if (posX) {
                posX = (progress.enableRtl) ?
                    ((progress.progressRect.width - posX) + textSize.width) : posX - padding;
            } else {
                posX = (progress.enableRtl) ? (progress.progressRect.width) : (progress.progressRect.x + padding);
            }
            posY = progress.progressRect.y + (progress.progressRect.height / 2) + (textSize.height / 4);
            option = new TextOption(
                progress.element.id + '_linearLabel', progress.labelStyle.size || progress.themeStyle.linearFontSize,
                progress.labelStyle.fontStyle || progress.themeStyle.linearFontStyle,
                progress.labelStyle.fontFamily || progress.themeStyle.linearFontFamily,
                progress.labelStyle.fontWeight, 'middle', argsData.color || progress.themeStyle.fontColor, posX, posY
            );
            linearlabel = progress.renderer.createText(option, argsData.text);
            progress.svgObject.appendChild(linearlabel);
            if (progress.animation.enable && !progress.isIndeterminate) {
                end = progress.progressRect.width * progress.calculateProgressRange(progress.minimum, progress.maximum, progress.value);
                this.animation.doLabelAnimation(linearlabel, 0, end, progress, this.delay);
            }
        }
    }
}
