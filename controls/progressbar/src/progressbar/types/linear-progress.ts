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
        if (progress.cornerRadius === 'Round4px') {
            if (progress.segmentCount > 1) {
                linearTrack = this.createRoundCornerSegment('_LinearTrack_', stroke, thickness, true, 0, progress);
            } else {
                option = new PathOption(
                    progress.element.id + '_Lineartrack', stroke, 0, 'none', progress.themeStyle.trackOpacity,
                    '0', this.cornerRadius(progress.progressRect.x, progress.progressRect.y, progress.progressRect.width, thickness, 4, '')
                );
                linearTrack = progress.renderer.drawPath(option);
            }
        } else {
            option = new PathOption(
                progress.element.id + '_Lineartrack', 'none', thickness, stroke, progress.themeStyle.trackOpacity,
                '0', progress.getPathLine(progress.progressRect.x, progress.progressRect.width, thickness)
            );
            linearTrack = progress.renderer.drawPath(option);
            progress.trackWidth = (<SVGPathElement>linearTrack).getTotalLength();
            if (progress.cornerRadius === 'Round' && !this.isRange) {
                linearTrack.setAttribute('stroke-linecap', 'round');
            }
            if (progress.segmentCount > 1 && !this.isRange && !progress.enableProgressSegments) {
                progress.segmentSize = progress.calculateSegmentSize(progress.trackWidth, thickness);
                linearTrack.setAttribute('stroke-dasharray', progress.segmentSize);
            }
        }
        linearTrackGroup.appendChild(linearTrack);
        progress.svgObject.appendChild(linearTrackGroup);
    }

    /** To render the linear progress  */
    // tslint:disable-next-line:max-func-body-length
    public renderLinearProgress(refresh?: boolean, previousWidth: number = 0): void {
        let progress: ProgressBar = this.progress; let option: PathOption;
        let linearProgress: Element; let progressWidth: number;
        let linearProgressWidth: number; let clipPathLinear: Element;
        let clipPathIndeterminate: Element; let linearProgressGroup: Element;
        let animationdelay: number; let thickness: number;
        let stroke: string; let segmentWidth: number;
        let strippedStroke: string; let ismaximum: boolean = (progress.value === progress.maximum);
        progressWidth = progress.calculateProgressRange(progress.argsData.value);
        progress.previousWidth = linearProgressWidth = progress.progressRect.width *
            ((progress.isIndeterminate && !progress.enableProgressSegments) ? 1 : progressWidth);
        if (!refresh) {
            linearProgressGroup = progress.renderer.createGroup({ 'id': progress.element.id + '_LinearProgressGroup' });
        } else {
            linearProgressGroup = getElement(progress.element.id + '_LinearProgressGroup');
        }
        thickness = (progress.progressThickness || progress.themeStyle.linearProgressThickness);
        stroke = (!progress.isStriped) ? this.checkingLinearProgressColor() : 'url(#' + progress.element.id + '_LinearStriped)';
        if (progress.cornerRadius === 'Round4px') {
            option = new PathOption(
                progress.element.id + '_Linearprogress', stroke, 0, 'none', progress.themeStyle.progressOpacity, '0',
                this.cornerRadius(
                    progress.progressRect.x, progress.progressRect.y, linearProgressWidth, thickness, 4,
                    (ismaximum || progress.isIndeterminate) ? '' : 'start'
                )
            );
        } else {
            option = new PathOption(
                progress.element.id + '_Linearprogress', 'none', thickness, stroke, progress.themeStyle.progressOpacity, '0',
                progress.getPathLine(progress.progressRect.x, linearProgressWidth, thickness)
            );
        }
        progress.progressWidth = (<SVGPathElement>progress.renderer.drawPath(option)).getTotalLength();
        progress.segmentSize = (!progress.enableProgressSegments) ? progress.segmentSize :
            progress.calculateSegmentSize(progress.progressWidth, thickness);
        if (progress.secondaryProgress !== null && !progress.isIndeterminate) {
            this.renderLinearBuffer(progress);
        }
        if (progress.argsData.value !== null) {
            if (progress.cornerRadius === 'Round4px') {
                if (progress.segmentCount > 1) {
                    linearProgress = this.createRoundCornerSegment(
                        '_Linearprogress_', stroke, thickness, false,
                        linearProgressWidth, progress, progress.themeStyle.progressOpacity
                    );
                } else {
                    linearProgress = progress.renderer.drawPath(option);
                }
            } else {
                if (progress.segmentColor.length !== 0 && !progress.isIndeterminate && !this.isRange) {
                    segmentWidth = (!progress.enableProgressSegments) ? progress.trackWidth : progress.progressWidth;
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
                this.delay = animationdelay;
                clipPathLinear = progress.createClipPath(
                    progress.clipPath, progressWidth, null, refresh, thickness, false,
                    (progress.cornerRadius === 'Round4px' && ismaximum)
                );
                linearProgressGroup.appendChild(progress.clipPath);
                linearProgress.setAttribute('style', 'clip-path:url(#' + progress.element.id + '_clippath)');
                this.animation.doLinearAnimation(clipPathLinear, progress, animationdelay, refresh ? previousWidth : 0);
            }
            if (progress.isIndeterminate) {
                clipPathIndeterminate = progress.createClipPath(
                    progress.clipPath, (progress.enableProgressSegments) ? 1 : progressWidth, null, refresh,
                    thickness, progress.enableProgressSegments
                );
                linearProgressGroup.appendChild(progress.clipPath);
                linearProgress.setAttribute('style', 'clip-path:url(#' + progress.element.id + '_clippath)');
                this.animation.doLinearIndeterminate(
                    ((!progress.enableProgressSegments) ? clipPathIndeterminate : linearProgress),
                    linearProgressWidth, thickness, progress, clipPathIndeterminate
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
        let ismaximum: boolean = (progress.secondaryProgress === progress.maximum);
        secondaryProgressWidth = progress.calculateProgressRange(progress.secondaryProgress);
        this.bufferWidth = linearBufferWidth = progress.progressRect.width * secondaryProgressWidth;
        linearBufferGroup = progress.renderer.createGroup({ 'id': progress.element.id + '_LinearBufferGroup' });
        thickness = (progress.progressThickness || progress.themeStyle.linearProgressThickness);
        stroke = this.checkingLinearProgressColor();
        if (progress.cornerRadius === 'Round4px') {
            if (progress.segmentCount > 1) {
                linearBuffer = this.createRoundCornerSegment(
                    '_Linearbuffer_', stroke, thickness, false, linearBufferWidth,
                    progress, progress.themeStyle.bufferOpacity
                );
            } else {
                option = new PathOption(
                    progress.element.id + '_Linearbuffer', stroke, 0, 'none', progress.themeStyle.bufferOpacity, '0',
                    this.cornerRadius(
                        progress.progressRect.x, progress.progressRect.y, linearBufferWidth,
                        thickness, 4, (ismaximum) ? '' : 'start'
                    )
                );
                linearBuffer = progress.renderer.drawPath(option);
            }
        } else {
            option = new PathOption(
                progress.element.id + '_Linearbuffer', 'none', thickness, stroke, progress.themeStyle.bufferOpacity, '0',
                progress.getPathLine(
                    progress.progressRect.x, linearBufferWidth, thickness
                )
            );
            if (progress.segmentColor.length !== 0 && !progress.isIndeterminate && !this.isRange) {
                segmentWidth = (!progress.enableProgressSegments) ? progress.trackWidth : progress.progressWidth;
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
        }
        linearBufferGroup.appendChild(linearBuffer);
        if (progress.animation.enable) {
            clipPathBuffer = progress.createClipPath(
                progress.bufferClipPath, secondaryProgressWidth, null, false, thickness, false,
                (progress.cornerRadius === 'Round4px' && ismaximum)
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
        let thickness: number = (this.progress.progressThickness || this.progress.themeStyle.linearProgressThickness);
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
            if (this.progress.cornerRadius === 'Round4px') {
                posY = progress.progressRect.y + (thickness / 2) + (textSize.height / 4);
            } else {
                posY = progress.progressRect.y + (progress.progressRect.height / 2) + (textSize.height / 4);
            }
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
        let ismaximum: boolean = (progress.value === progress.maximum);
        if (progress.cornerRadius === 'Round4px') {
            if (progress.segmentCount > 1) {
                linearActive = this.createRoundCornerSegment(
                    '_LinearActiveProgress_', '#ffffff', thickness, false,
                    linearProgressWidth, progress, 0.5
                );
            } else {
                option = new PathOption(
                    progress.element.id + '_LinearActiveProgress', '#ffffff', 0, 'none', 0.5, '0',
                    this.cornerRadius(
                        progress.progressRect.x, progress.progressRect.y, linearProgressWidth,
                        thickness, 4, ismaximum ? '' : 'start'
                    )
                );
                linearActive = progress.renderer.drawPath(option);
            }
        } else {
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
        let stripWidth: number = 14;
        let stop: Element;
        let gradOption: LinearGradient;
        let stopOption: StopElement[] = [];
        gradOption = {
            id: progress.element.id + '_LinearStriped', x1: (progress.progressRect.x).toString(),
            x2: (progress.progressRect.x + stripWidth).toString(),
            spreadMethod: 'repeat', gradientUnits: 'userSpaceOnUse', gradientTransform: 'rotate(-45)'
        };
        stopOption = [{ offset: '50%', 'stop-color': color, 'stop-opacity': '1' },
        { offset: '50%', 'stop-color': color, 'stop-opacity': '0.4' }];
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

    /** Bootstrap 3 & Bootstrap 4 corner path */
    private cornerRadius(x: number, y: number, width: number, height: number, radius: number, pathtype: string): string {
        let path: string = '';
        let endWidth: number = width;
        let endRadius: number = radius;
        switch (pathtype) {
            case 'start':
                path = 'M' + x + ',' + y + ' '
                    + 'h' + (width) + ' '
                    + 'v' + (height) + ' '
                    + 'h' + (- width) + ' '
                    + 'a' + radius + ',' + radius + ' 0 0 1 ' + -radius + ',' + -radius + ' '
                    + 'v' + (2 * radius - height) + ' '
                    + 'a' + radius + ',' + radius + ' 0 0 1 ' + radius + ',' + -radius + ' '
                    + 'z';
                break;
            case 'end':
                path = 'M' + x + ',' + y + ' '
                    + 'h' + (endWidth - endRadius) + ' '
                    + 'a' + endRadius + ',' + endRadius + ' 0 0 1 ' + endRadius + ',' + endRadius + ' '
                    + 'v' + (height - 2 * endRadius) + ' '
                    + 'a' + endRadius + ',' + endRadius + ' 0 0 1 ' + -endRadius + ',' + endRadius + ' '
                    + 'h' + (radius - endWidth) + ' '
                    + 'v' + (- height) + ' '
                    + 'z';
                break;
            case 'none':
                path = 'M' + x + ',' + y + ' '
                    + 'h' + (width) + ' '
                    + 'v' + (height) + ' '
                    + 'h' + (- width) + ' '
                    + 'v' + (- height) + ' '
                    + 'z';
                break;
            default:
                path = 'M' + x + ',' + y + ' '
                    + 'h' + (width - radius) + ' '
                    + 'a' + radius + ',' + radius + ' 0 0 1 ' + radius + ',' + radius + ' '
                    + 'v' + (height - 2 * radius) + ' '
                    + 'a' + radius + ',' + radius + ' 0 0 1 ' + -radius + ',' + radius + ' '
                    + 'h' + (radius - width) + ' '
                    + 'a' + radius + ',' + radius + ' 0 0 1 ' + -radius + ',' + -radius + ' '
                    + 'v' + (2 * radius - height) + ' '
                    + 'a' + radius + ',' + radius + ' 0 0 1 ' + radius + ',' + -radius + ' '
                    + 'z';
        }
        return path;
    }

    /** Bootstrap 3 & Bootstrap 4 corner segment */
    public createRoundCornerSegment(
        id: string, stroke: string, thickness: number, isTrack: boolean,
        progressWidth: number, progress: ProgressBar, opacity?: number
    ): Element {
        let locX: number = progress.progressRect.x;
        let locY: number = progress.progressRect.y;
        let width: number = progress.progressRect.width;
        let option: PathOption;
        let pathType: string;
        let avlWidth: number;
        let gapWidth: number = (progress.gapWidth || progress.themeStyle.linearGapWidth);
        let segWidth: number = (width - ((progress.segmentCount - 1) * gapWidth)) / progress.segmentCount;
        let segmentGroup: Element = progress.renderer.createGroup({ 'id': progress.element.id + id + 'SegmentGroup' });
        let segmentPath: Element;
        for (let i: number = 1; i <= progress.segmentCount; i++) {
            if (i === 1 || i === progress.segmentCount) {
                pathType = (i === 1) ? 'start' : 'end';
            } else {
                pathType = 'none';
            }
            if (isTrack) {
                option = new PathOption(
                    progress.element.id + id + i, stroke, 0, 'none', progress.themeStyle.trackOpacity,
                    '0', this.cornerRadius(locX, locY, segWidth, thickness, 4, pathType)
                );
                segmentPath = progress.renderer.drawPath(option);
                segmentGroup.appendChild(segmentPath);
                locX += (segWidth + gapWidth);
            } else {
                avlWidth = (progressWidth < segWidth) ? progressWidth : segWidth;
                option = new PathOption(
                    progress.element.id + id + i, stroke, 0, 'none', opacity,
                    '0', this.cornerRadius(locX, locY, avlWidth, thickness, 4, pathType)
                );
                segmentPath = progress.renderer.drawPath(option);
                segmentGroup.appendChild(segmentPath);
                locX += (segWidth + gapWidth);
                progressWidth -= (segWidth + gapWidth);
                if (progressWidth <= 0) {
                    break;
                }
            }

        }
        return segmentGroup;
    }
}
