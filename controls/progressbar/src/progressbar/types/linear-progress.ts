import { ProgressBar } from '../../progressbar';
import { ProgressAnimation } from '../utils/progress-animation';
import { TextOption, ColorValue, colorNameToHex, convertHexToColor, setAttributes } from '../utils/helper';
import { PathOption, getElement, Size, measureText } from '@syncfusion/ej2-svg-base';
import { ITextRenderEventArgs, LinearGradient, StopElement } from '../model/progress-interface';
import { Segment } from './segment-progress';
import { TextAlignmentType, ModeType } from '../utils/enum';
import { svgLink, gradientType, stopElement } from '../model/constant';

/**
 * Progress Bar of type Linear
 */
export class Linear {
    private progress: ProgressBar;
    private delay: number;
    private segment: Segment = new Segment();
    private animation: ProgressAnimation = new ProgressAnimation();
    private isRange: boolean;
    private bufferWidth: number;
    constructor(progress: ProgressBar) {
        this.progress = progress;
    }
    /** To render the linear track  */
    public renderLinearTrack(): void {
        let progress: ProgressBar = this.progress;
        let linearTrackGroup: Element = progress.renderer.createGroup({ 'id': progress.element.id + '_LinearTrackGroup' });
        let linearTrack: Element;
        let option: PathOption;
        let thickness: number;
        let stroke: string;
        this.isRange = (this.progress.rangeColors[0].color !== '' || this.progress.rangeColors[0].start !== null ||
            this.progress.rangeColors[0].end !== null);
        thickness = (progress.trackThickness || progress.themeStyle.linearTrackThickness);
        stroke = (progress.argsData.trackColor || progress.themeStyle.linearTrackColor);
        option = new PathOption(
            progress.element.id + '_Lineartrack', 'none', thickness, stroke, progress.themeStyle.trackOpacity,
            '0', progress.getPathLine(progress.progressRect.x, progress.progressRect.width, thickness)
        );
        linearTrack = progress.renderer.drawPath(option);
        progress.trackWidth = (<SVGPathElement>linearTrack).getTotalLength();
        if (progress.segmentCount > 1 && !this.isRange && !progress.trackSegmentDisable) {
            progress.segmentSize = progress.calculateSegmentSize(progress.trackWidth, thickness);
            linearTrack.setAttribute('stroke-dasharray', progress.segmentSize);
        }
        if (progress.cornerRadius === 'Round' && !this.isRange) {
            linearTrack.setAttribute('stroke-linecap', 'round');
        }
        linearTrackGroup.appendChild(linearTrack);
        progress.svgObject.appendChild(linearTrackGroup);
    }

    /** To render the linear progress  */
    public renderLinearProgress(refresh?: boolean, previousWidth: number = 0): void {
        let progress: ProgressBar = this.progress;
        let option: PathOption;
        let linearProgress: Element;
        let progressWidth: number;
        let linearProgressWidth: number;
        let clipPathLinear: Element;
        let clipPathIndeterminate: Element;
        let linearProgressGroup: Element;
        let animationdelay: number;
        let thickness: number;
        let stroke: string;
        let segmentWidth: number;
        let strippedStroke: string;
        progressWidth = progress.calculateProgressRange(progress.argsData.value);
        progress.previousWidth = linearProgressWidth = progress.progressRect.width *
            ((progress.isIndeterminate && !progress.trackSegmentDisable) ? 1 : progressWidth);
        if (!refresh) {
            linearProgressGroup = progress.renderer.createGroup({ 'id': progress.element.id + '_LinearProgressGroup' });
        } else {
            linearProgressGroup = getElement(progress.element.id + '_LinearProgressGroup');
        }
        thickness = (progress.progressThickness || progress.themeStyle.linearProgressThickness);
        stroke = (!progress.isStriped) ? this.checkingLinearProgressColor() : 'url(#' + progress.element.id + '_LinearStriped)';
        option = new PathOption(
            progress.element.id + '_Linearprogress', 'none', thickness, stroke, progress.themeStyle.progressOpacity, '0',
            progress.getPathLine(progress.progressRect.x, linearProgressWidth, thickness)
        );
        progress.progressWidth = (<SVGPathElement>progress.renderer.drawPath(option)).getTotalLength();
        progress.segmentSize = (!progress.trackSegmentDisable) ? progress.segmentSize :
            progress.calculateSegmentSize(progress.progressWidth, thickness);
        if (progress.secondaryProgress !== null && !progress.isIndeterminate) {
            this.renderLinearBuffer(progress);
        }
        if (progress.argsData.value !== null) {
            if (progress.segmentColor.length !== 0 && !progress.isIndeterminate && !this.isRange) {
                segmentWidth = (!progress.trackSegmentDisable) ? progress.trackWidth : progress.progressWidth;
                linearProgress = this.segment.createLinearSegment(
                    progress, '_LinearProgressSegment', linearProgressWidth,
                    progress.themeStyle.progressOpacity, thickness, segmentWidth
                );
            } else if (this.isRange && !progress.isIndeterminate) {
                linearProgress = this.segment.createLinearRange(linearProgressWidth, progress);
            } else {
                if (!refresh) {
                    linearProgress = progress.renderer.drawPath(option);
                } else {
                    linearProgress = getElement(progress.element.id + '_Linearprogress');
                    linearProgress.setAttribute('d', progress.getPathLine(progress.progressRect.x, linearProgressWidth, thickness));
                    linearProgress.setAttribute('stroke', stroke);
                }
                if (progress.segmentCount > 1) {
                    linearProgress.setAttribute('stroke-dasharray', progress.segmentSize);
                }
                if (progress.cornerRadius === 'Round' && progressWidth) {
                    linearProgress.setAttribute('stroke-linecap', 'round');
                }
            }
            linearProgressGroup.appendChild(linearProgress);
            if (progress.isStriped && !progress.isIndeterminate) {
                strippedStroke = this.checkingLinearProgressColor();
                this.renderLinearStriped(strippedStroke, linearProgressGroup, progress);
            }
            if (progress.isActive && !progress.isIndeterminate && !progress.isStriped) {
                this.renderActiveState(linearProgressGroup, progressWidth, linearProgressWidth, thickness, refresh);
            }
            if (progress.animation.enable && !progress.isIndeterminate && !progress.isActive && !progress.isStriped) {
                if ((progress.secondaryProgress !== null)) {
                    animationdelay = progress.animation.delay + (this.bufferWidth - linearProgressWidth);
                } else {
                    animationdelay = progress.animation.delay;
                }
                /** used for label animation delay */
                this.delay = animationdelay;
                clipPathLinear = progress.createClipPath(progress.clipPath, progressWidth, null, refresh, thickness, false);
                linearProgressGroup.appendChild(progress.clipPath);
                linearProgress.setAttribute('style', 'clip-path:url(#' + progress.element.id + '_clippath)');
                this.animation.doLinearAnimation(clipPathLinear, progress, animationdelay, refresh ? previousWidth : 0);
            }
            if (progress.isIndeterminate) {
                clipPathIndeterminate = progress.createClipPath(
                    progress.clipPath, (progress.trackSegmentDisable) ? 1 : progressWidth, null, refresh,
                    thickness, progress.trackSegmentDisable
                );
                linearProgressGroup.appendChild(progress.clipPath);
                linearProgress.setAttribute('style', 'clip-path:url(#' + progress.element.id + '_clippath)');
                this.animation.doLinearIndeterminate(
                    ((!progress.trackSegmentDisable) ? clipPathIndeterminate : linearProgress),
                    linearProgressWidth, thickness, progress
                );
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
        let thickness: number;
        let stroke: string;
        let segmentWidth: number;
        secondaryProgressWidth = progress.calculateProgressRange(progress.secondaryProgress);
        this.bufferWidth = linearBufferWidth = progress.progressRect.width * secondaryProgressWidth;
        linearBufferGroup = progress.renderer.createGroup({ 'id': progress.element.id + '_LinearBufferGroup' });
        thickness = (progress.progressThickness || progress.themeStyle.linearProgressThickness);
        stroke = this.checkingLinearProgressColor();
        option = new PathOption(
            progress.element.id + '_Linearbuffer', 'none', thickness, stroke, progress.themeStyle.bufferOpacity, '0',
            progress.getPathLine(
                progress.progressRect.x, linearBufferWidth, thickness
            )
        );
        if (progress.segmentColor.length !== 0 && !progress.isIndeterminate && !this.isRange) {
            segmentWidth = (!progress.trackSegmentDisable) ? progress.trackWidth : progress.progressWidth;
            linearBuffer = this.segment.createLinearSegment(
                progress, '_LinearBufferSegment', linearBufferWidth, progress.themeStyle.bufferOpacity,
                (progress.progressThickness || progress.themeStyle.linearProgressThickness), segmentWidth
            );
        } else {
            linearBuffer = progress.renderer.drawPath(option);
            if (progress.segmentCount > 1 && !this.isRange) {
                linearBuffer.setAttribute('stroke-dasharray', progress.segmentSize);
            }
            if (progress.cornerRadius === 'Round' && !this.isRange) {
                linearBuffer.setAttribute('stroke-linecap', 'round');
            }
        }
        linearBufferGroup.appendChild(linearBuffer);
        if (progress.animation.enable) {
            clipPathBuffer = progress.createClipPath(
                progress.bufferClipPath, secondaryProgressWidth, null, false, thickness, false
            );
            linearBufferGroup.appendChild(progress.bufferClipPath);
            linearBuffer.setAttribute('style', 'clip-path:url(#' + progress.element.id + '_clippathBuffer)');
            this.animation.doLinearAnimation(clipPathBuffer, progress, progress.animation.delay, 0);
        }
        progress.svgObject.appendChild(linearBufferGroup);
    }

    /** Render the Linear Label */
    public renderLinearLabel(): void {
        let linearlabel: Element;
        let linearValue: number;
        let posX: number;
        let posY: number;
        let argsData: ITextRenderEventArgs;
        let textSize: Size;
        let labelValue: number;
        let percentage: number = 100;
        let option: TextOption;
        let defaultPos: number;
        let far: number;
        let center: number;
        let pos: boolean;
        let rgbValue: ColorValue;
        let contrast: number;
        let clipPath: Element;
        let linearLabelGroup: Element;
        let padding: number = 5;
        let progress: ProgressBar = this.progress;
        let textAlignment: TextAlignmentType = progress.labelStyle.textAlignment;
        let labelText: string = progress.labelStyle.text;
        let fontBackground: string = this.checkingLinearProgressColor();
        let progressWidth: number = progress.progressRect.width * progress.calculateProgressRange(progress.value);
        linearLabelGroup = progress.renderer.createGroup({ 'id': progress.element.id + '_LinearLabelGroup' });
        labelValue = ((progress.value - progress.minimum) / (progress.maximum - progress.minimum)) * percentage;
        linearValue = (progress.value < progress.minimum || progress.value > progress.maximum) ? 0 : Math.round(labelValue);
        // Checking the font color
        rgbValue = convertHexToColor(colorNameToHex(fontBackground));
        contrast = Math.round((rgbValue.r * 299 + rgbValue.g * 587 + rgbValue.b * 114) / 1000);
        argsData = {
            cancel: false, text: labelText ? labelText : String(linearValue) + '%', color: progress.labelStyle.color
        };
        progress.trigger('textRender', argsData);
        if (!argsData.cancel) {
            textSize = measureText(argsData.text, progress.labelStyle);
            defaultPos = (progress.enableRtl) ? (progress.progressRect.x + progress.progressRect.width - textSize.width / 2) :
                (progress.progressRect.x + textSize.width / 2);
            if (textAlignment === 'Near') {
                posX = defaultPos + ((progress.enableRtl) ? -padding : padding);
            } else if (textAlignment === 'Center') {
                center = (progress.enableRtl) ? (progress.progressRect.x + progress.progressRect.width - progressWidth / 2) :
                    (progress.progressRect.x + progressWidth / 2);
                pos = (progress.enableRtl) ? (center <= defaultPos) : (center >= defaultPos);
                if (pos) {
                    posX = center;
                } else {
                    posX = defaultPos;
                }
            } else {
                far = (progress.enableRtl) ?
                    ((progress.progressRect.x + progress.progressRect.width - progressWidth) + textSize.width / 2) :
                    (progress.progressRect.x + progressWidth - textSize.width / 2);
                far += (progress.enableRtl) ? padding : -padding;
                pos = (progress.enableRtl) ? (far <= defaultPos) : (far >= defaultPos);
                if (pos) {
                    posX = far;
                } else {
                    posX = defaultPos;
                }
            }
            posY = progress.progressRect.y + (progress.progressRect.height / 2) + (textSize.height / 4);
            option = new TextOption(
                progress.element.id + '_linearLabel', progress.labelStyle.size || progress.themeStyle.linearFontSize,
                progress.labelStyle.fontStyle || progress.themeStyle.linearFontStyle,
                progress.labelStyle.fontFamily || progress.themeStyle.linearFontFamily,
                progress.labelStyle.fontWeight, 'middle', argsData.color || ((contrast >= 128) ? 'black' : 'white'),
                posX, posY
            );
            linearlabel = progress.renderer.createText(option, argsData.text);
            linearLabelGroup.appendChild(linearlabel);
            if (progress.animation.enable && !progress.isIndeterminate) {
                clipPath = progress.renderer.createClipPath({ 'id': progress.element.id + '_clippathLabel' });
                progress.createClipPath(
                    clipPath, 1, null, false, (progress.progressThickness || progress.themeStyle.linearProgressThickness), true
                );
                linearLabelGroup.appendChild(clipPath);
                linearlabel.setAttribute('style', 'clip-path:url(#' + progress.element.id + '_clippathLabel)');
                this.animation.doLabelAnimation(linearlabel, 0, progressWidth, progress, this.delay, textSize.width);
            }
            progress.svgObject.appendChild(linearLabelGroup);
        }
    }

    /** To render a progressbar active state */
    private renderActiveState(
        progressGroup: Element, progressWidth: number, linearProgressWidth: number,
        thickness: number, refresh: boolean
    ): void {
        let linearActive: Element;
        let activeClip: Element;
        let progress: ProgressBar = this.progress;
        let option: PathOption;
        if (!refresh) {
            option = new PathOption(
                progress.element.id + '_LinearActiveProgress', 'none', thickness,
                '#ffffff', 0.5, '', progress.getPathLine(progress.progressRect.x, linearProgressWidth, thickness)
            );
            linearActive = progress.renderer.drawPath(option);
        } else {
            linearActive = getElement(progress.element.id + '_LinearActiveProgress');
            linearActive.setAttribute('d', progress.getPathLine(progress.progressRect.x, linearProgressWidth, thickness));
        }
        if (progress.segmentCount > 1 && !this.isRange) {
            linearActive.setAttribute('stroke-dasharray', progress.segmentSize);
        }
        if (progress.cornerRadius === 'Round' && progressWidth && !this.isRange) {
            linearActive.setAttribute('stroke-linecap', 'round');
        }
        activeClip = progress.createClipPath(progress.clipPath, progressWidth, null, refresh, thickness, false);
        linearActive.setAttribute('style', 'clip-path:url(#' + progress.element.id + '_clippath)');
        progressGroup.appendChild(linearActive);
        progressGroup.appendChild(progress.clipPath);
        this.animation.doLinearAnimation(activeClip, progress, 0, 0, linearActive);
    }

    /** To render a striped stroke */
    private renderLinearStriped(color: string, group: Element, progress: ProgressBar): void {
        let defs: Element = progress.renderer.createDefs();
        let linearGradient: Element = document.createElementNS(svgLink, gradientType);
        let stripWidth: number = 30;
        let stop: Element;
        let gradOption: LinearGradient;
        let stopOption: StopElement[] = [];
        gradOption = {
            id: progress.element.id + '_LinearStriped', x1: (progress.progressRect.x).toString(),
            x2: (progress.progressRect.x + stripWidth).toString(),
            spreadMethod: 'repeat', gradientUnits: 'userSpaceOnUse', gradientTransform: 'rotate(-45)'
        };
        stopOption = [{ offset: '50%', 'stop-color': color, 'stop-opacity': '1' },
        { offset: '50%', 'stop-color': color, 'stop-opacity': '0.6' }];
        linearGradient = setAttributes(gradOption, linearGradient);
        for (let i: number = 0; i < stopOption.length; i++) {
            stop = document.createElementNS(svgLink, stopElement);
            stop = setAttributes(stopOption[i], stop);
            linearGradient.appendChild(stop);
        }
        defs.appendChild(linearGradient);
        group.appendChild(defs);
        if (progress.animation.enable) {
            this.animation.doStripedAnimation(linearGradient, progress, 0);
        }
    }

    /** checking progress color */
    private checkingLinearProgressColor(): string {
        let linearColor: string;
        let progress: ProgressBar = this.progress;
        let role: ModeType = progress.role;
        switch (role) {
            case 'Success':
            linearColor = progress.themeStyle.success;
                break;
            case 'Info':
            linearColor = progress.themeStyle.info;
                break;
            case 'Warning':
            linearColor = progress.themeStyle.warning;
                break;
            case 'Danger':
            linearColor = progress.themeStyle.danger;
                break;
            default:
            linearColor = (progress.argsData.progressColor || progress.themeStyle.linearProgressColor);
        }
        return linearColor;
    }
}
