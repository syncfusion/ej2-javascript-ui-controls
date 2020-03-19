import { Component, Property, NotifyPropertyChanges, Browser, Complex, Event, Collection } from '@syncfusion/ej2-base';
import { EmitType, INotifyPropertyChanged, createElement, remove, ModuleDeclaration } from '@syncfusion/ej2-base';
import { ProgressBarModel } from './progressbar-model';
import { Rect, Size, getPathArc, RectOption, stringToNumber } from './utils/helper';
import { doLinearAnimation, doCircularAnimation, doCircularIndeterminate, doAnnotationAnimation } from './utils/progress-animation';
import { MarginModel, AnimationModel, FontModel } from './model/progress-base-model';
import { Margin, Animation, Font } from './model/progress-base';
import { ILoadedEventArgs, IProgressStyle, IProgressValueEventArgs } from './model/progress-interface';
import { ITextRenderEventArgs, IProgressResizeEventArgs } from './model/progress-interface';
import { SvgRenderer, PathOption, getElement, measureText } from '@syncfusion/ej2-svg-base';
import { ProgressType, CornerType, ProgressTheme } from './utils/enum';
import { getProgressThemeColor } from './utils/theme';
import { lineCapRadius, completeAngle, valueChanged, progressCompleted } from './model/constant';
import { ProgressAnnotation } from './model/index';
import { ProgressAnnotationSettingsModel } from './model/index';
import { ProgressAnnotationSettings } from './model/index';

/**
 *  progress bar control
 */
@NotifyPropertyChanges
export class ProgressBar extends Component<HTMLElement> implements INotifyPropertyChanged {
    constructor(options?: ProgressBarModel, element?: string | HTMLElement) {
        super(options, element);
    }
    /**
     * type of the progress bar
     * @default Linear
     */
    @Property('Linear')
    public type: ProgressType;
    /**
     * progress value
     * @default null
     */
    @Property(null)
    public value: number;
    /**
     * secondary progress value
     * @default null
     */
    @Property(null)
    public secondaryProgress: number;
    /**
     * minimum progress value
     * @default 0
     */
    @Property(0)
    public minimum: number;
    /**
     * maximum progress value
     * @default 0
     */
    @Property(100)
    public maximum: number;
    /**
     * startAngle for circular progress bar
     * @default 0
     */
    @Property(0)
    public startAngle: number;
    /**
     * endAngle for circular progress bar
     * @default 0
     */
    @Property(0)
    public endAngle: number;
    /**
     * track radius for circular
     * @default '100%'
     */
    @Property('100%')
    public radius: string;
    /**
     * progress radius for circular
     * @default '100%'
     */
    @Property('100%')
    public innerRadius: string;
    /**
     * segmentCount of the progress bar
     * @default 1
     */
    @Property(1)
    public segmentCount: number;
    /**
     * gapwidth of the segment
     * @default null
     */
    @Property(null)
    public gapWidth: number;
    /**
     * Segment color
     * @default null
     */
    @Property('')
    public segmentColor: string[];
    /**
     * corner type
     * @default Auto
     */
    @Property('Auto')
    public cornerRadius: CornerType;
    /**
     * height of the progress bar
     * @default null
     */
    @Property(null)
    public height: string;
    /**
     * width of the progress bar
     * @default null
     */
    @Property(null)
    public width: string;
    /**
     * Indeterminate progress
     * @default false
     */
    @Property(false)
    public isIndeterminate: boolean;
    /**
     * right to left
     * @default false
     */
    @Property(false)
    public enableRtl: boolean;
    /**
     * trackColor
     * @default null
     */
    @Property(null)
    public trackColor: string;
    /**
     * progressColor
     * @default null
     */
    @Property(null)
    public progressColor: string;
    /**
     * track thickness
     * @default 0
     */
    @Property(0)
    public trackThickness: number;
    /**
     * progress thickness
     * @default 0
     */
    @Property(0)
    public progressThickness: number;
    /**
     * theme style
     * @default Fabric
     */
    @Property('Fabric')
    public theme: ProgressTheme;
    /**
     * label of the progress bar
     * @default false
     */
    @Property(false)
    public showProgressValue: boolean;
    /**
     * Option for customizing the  label text.
     */

    @Complex<FontModel>({ size: null, color: null, fontStyle: null, fontWeight: 'Normal', fontFamily: null }, Font)
    public labelStyle: FontModel;

    /**
     * Option for the  label text.
     * @default null
     */
    @Property('')
    public label: string;

    /**
     * margin size
     */
    @Complex<MarginModel>({}, Margin)
    public margin: MarginModel;
    /**
     * Animation for the progress bar
     */
    @Complex<AnimationModel>({}, Animation)
    public animation: AnimationModel;
    /**
     * Triggers before the progress bar get rendered.
     * @event
     */
    @Event()
    public load: EmitType<ILoadedEventArgs>;
    /**
     * Triggers before the progress bar label renders.
     * @event
     */
    @Event()
    public textRender: EmitType<ITextRenderEventArgs>;
    /**
     * Triggers after the progress bar has loaded.
     * @event
     */
    @Event()
    public loaded: EmitType<ILoadedEventArgs>;
    /**
     * Triggers after the value has changed.
     * @event
     */
    @Event()
    public valueChanged: EmitType<IProgressValueEventArgs>;
    /**
     * Triggers after the progress value completed.
     * @event
     */
    @Event()
    public progressCompleted: EmitType<IProgressValueEventArgs>;
    /**
     * Triggers after the animation completed.
     * @event
     */
    @Event()
    public animationComplete: EmitType<IProgressValueEventArgs>;
    /**
     * The configuration for annotation in Progressbar.
     */
    @Collection<ProgressAnnotationSettingsModel>([{}], ProgressAnnotationSettings)
    public annotations: ProgressAnnotationSettingsModel[];

    /** @private */
    public progressRect: Rect;
    /** @private */
    public progressSize: Size;
    /** @private */
    public renderer: SvgRenderer;
    /** @private */
    public svgObject: Element;
    /** @Private */
    public totalAngle: number;
    /** @private */
    public trackwidth: number;
    /** @private */
    public segmentSize: string;
    /** @private */
    public circularPath: string;
    /** @private */
    public argsData: IProgressValueEventArgs;
    /** @private */
    public themeStyle: IProgressStyle;
    /** @private */
    public animatedElement: Element;
    /** @private */
    // tslint:disable-next-line
    public resizeBounds: any;
    /** @private */
    private resizeTo: number;
    /** @private */
    private progressStartAngle: number;
    /** @private */
    private progressPreviousWidth: number;
    /** @private */
    private progressEndAngle: number;
    /** @private */
    public redraw: boolean;
    /** @private */
    public clipPath: Element;
    /** @private */
    public bufferClipPath: Element;
    /** @private */
    public secElement: HTMLElement;
    /** @private */
    public labelElement: Element;
    /** ProgressAnnotation module to use annotations */
    public progressAnnotationModule: ProgressAnnotation;
    /** @private */
    // private resizeTo: number;
    /** @private */
    public annotationEnd: number;
    /**
     * controlRenderedTimeStamp used to avoid inital resize issue while theme change
     */
    private controlRenderedTimeStamp: number;

    public getModuleName(): string {
        return 'progressbar';
    }

    protected preRender(): void {
        this.unWireEvents();
        this.progressRect = new Rect(0, 0, 0, 0);
        this.progressSize = new Size(0, 0);
        this.wireEvents();
    }

    protected render(): void {
        this.trigger('load', { progressBar: this });
        this.calculateProgressBarSize();
        this.calculateProgressBarBounds();
        this.SetThemeValues();
        this.renderAnnotations();
        this.renderElements();
        this.trigger('loaded', { progressBar: this });
        this.renderComplete();
        this.controlRenderedTimeStamp = new Date().getTime();
    }
    /**
     * Set theme values
     */
    private SetThemeValues(): void {
        switch (this.theme) {
            case 'Bootstrap':
            case 'Bootstrap4':
                this.gapWidth = (!this.gapWidth) ? 4 : this.gapWidth;
                this.cornerRadius = this.cornerRadius === 'Auto' ? 'Round' : this.cornerRadius;
                break;
            default:
                this.cornerRadius = this.cornerRadius === 'Auto' ? 'Square' : this.cornerRadius;
        }
    }
    /**
     * calculate Initial Bounds
     */
    private calculateProgressBarBounds(): void {
        this.progressRect.x = this.margin.left;
        this.progressRect.y = this.margin.top;
        this.progressRect.width -= this.margin.left + this.margin.right;
        this.progressRect.height -= this.margin.top + this.margin.bottom;

    }

    /**
     * calculate size of the progress bar
     */
    private calculateProgressBarSize(): void {
        let containerWidth: number = this.element.clientWidth || this.element.offsetWidth;
        let containerHeight: number = this.element.clientHeight;
        let width: number = (this.type === 'Linear') ? 200 : 120;
        let height: number = (this.type === 'Linear') ? 30 : 120;
        let padding: number = 10;
        let thickness: number = Math.max(this.progressThickness, this.trackThickness);
        height = (this.type === 'Linear' && thickness > (height - padding)) ? thickness + padding : height;
        this.progressSize.width = stringToNumber(this.width, containerWidth) || containerWidth || width;
        this.progressSize.height = stringToNumber(this.height, containerHeight) || containerHeight || height;
        this.progressRect.width = this.progressSize.width;
        this.progressRect.height = this.progressSize.height;
    }
    /**
     * Render Annotation
     */
    private renderAnnotations(): void {
        this.createSecElement();
        this.renderAnnotation();
    }

    /**
     * Render SVG Element
     */
    private renderElements(): void {
        this.element.style.display = 'block';
        this.element.style.position = 'relative';
        this.removeSvg();
        this.setTheme();
        this.createSVG();
        this.clipPathElement();
        this.createTrack();
        this.createLinearProgress();
        this.createCircularProgress();
        this.createLabel();
        this.element.appendChild(this.svgObject);
        this.setSecondaryElementPosition();
    }

    private createSecElement(): void {
        let secElement: Element = document.getElementById(this.element.id + 'Secondary_Element');
        if (secElement) {
            secElement.innerHTML = '';
            this.secElement = secElement as HTMLElement;
            return;
        }
        this.secElement = createElement('div', {
            id: this.element.id + 'Secondary_Element',
            styles: 'position: absolute',
        });
        this.element.appendChild(this.secElement);
    }
    /**
     * To set the left and top position for annotation for center aligned
     */
    private setSecondaryElementPosition(): void {
        let element: HTMLElement = this.secElement;
        let rect: ClientRect = this.element.getBoundingClientRect();
        let svgRect: ClientRect = getElement(this.svgObject.id).getBoundingClientRect();
        element.style.left = Math.max(svgRect.left - rect.left, 0) + 'px';
        element.style.top = Math.max(svgRect.top - rect.top, 0) + 'px';
    }

    private createSVG(): void {
        this.renderer = new SvgRenderer(this.element.id);
        this.svgObject = this.renderer.createSvg({
            id: this.element.id + 'SVG',
            width: this.progressSize.width,
            height: this.progressSize.height,
            style: 'background-color:' + this.themeStyle.backgroundColor
        });
    }

    private clipPathElement(): void {
        this.clipPath = this.renderer.createClipPath({ 'id': this.element.id + '_clippath' });
        this.bufferClipPath = this.renderer.createClipPath({ 'id': this.element.id + '_clippathBuffer' });
    }
    private createTrack(): void {
        let linearTrack: Element;
        let linearTrackWidth: number;
        let centerX: number;
        let centerY: number;
        let size: number;
        let radius: number;
        let startAngle: number;
        let endAngle: number;
        let circularTrack: Element;
        let circularPath: string;
        let option: PathOption;
        let trackThickness: number;
        this.argsData = {
            value: this.value,
            progressColor: this.progressColor,
            trackColor: this.trackColor
        };
        if (this.argsData.value === this.maximum) {
            this.trigger(progressCompleted, this.argsData);
        } else {
            this.trigger(valueChanged, this.argsData);
        }
        if (this.type === 'Linear') {
            linearTrackWidth = this.progressRect.width;
            option = new PathOption(
                this.element.id + '_Lineartrack', 'none', (this.trackThickness || this.themeStyle.linearTrackThickness),
                (this.argsData.trackColor || this.themeStyle.linearTrackColor), this.themeStyle.trackOpacity,
                '0', this.getPathLine(this.progressRect.x, linearTrackWidth, (this.trackThickness || this.themeStyle.linearTrackThickness))
            );
            linearTrack = this.renderer.drawPath(option);
            if (this.segmentCount > 1) {
                this.segmentSize = this.calculateSegmentSize(
                    linearTrackWidth, (this.trackThickness || this.themeStyle.linearTrackThickness)
                );
                linearTrack.setAttribute('stroke-dasharray', this.segmentSize);
            }
            if (this.cornerRadius === 'Round') {
                linearTrack.setAttribute('stroke-linecap', 'round');
            }
            this.svgObject.appendChild(linearTrack);
        } else if (this.type === 'Circular') {
            startAngle = this.startAngle;
            this.totalAngle = (this.endAngle - this.startAngle) % 360;
            this.totalAngle = (this.totalAngle <= 0 ? (360 + this.totalAngle) : this.totalAngle);
            this.totalAngle -= (this.totalAngle === 360) ? 0.01 : 0;
            endAngle = (this.startAngle + ((this.enableRtl) ? -this.totalAngle : +this.totalAngle)) % 360;
            centerX = this.progressRect.x + (this.progressRect.width / 2);
            centerY = this.progressRect.y + (this.progressRect.height / 2);
            trackThickness = Math.max(this.trackThickness, this.progressThickness) ||
                Math.max(this.themeStyle.circularProgressThickness, this.themeStyle.circularTrackThickness);
            size = (Math.min(this.progressRect.height, this.progressRect.width) / 2) - trackThickness / 2;
            radius = stringToNumber(this.radius, size);
            radius = (radius === null) ? 0 : radius;
            circularPath = getPathArc(centerX, centerY, radius, startAngle, endAngle, this.enableRtl);
            option = new PathOption(
                this.element.id + '_Circulartrack', 'none', (this.trackThickness || this.themeStyle.circularTrackThickness),
                (this.argsData.trackColor || this.themeStyle.circularTrackColor), this.themeStyle.trackOpacity, '0', circularPath
            );
            circularTrack = this.renderer.drawPath(option);
            this.svgObject.appendChild(circularTrack);
            this.trackwidth = (<SVGPathElement>circularTrack).getTotalLength();
            if (this.segmentCount > 1) {
                this.segmentSize = this.calculateSegmentSize(
                    this.trackwidth, (this.trackThickness || this.themeStyle.linearTrackThickness)
                );
                circularTrack.setAttribute('stroke-dasharray', this.segmentSize);
            }
            if (this.cornerRadius === 'Round') {
                circularTrack.setAttribute('stroke-linecap', 'round');
            }
        }
    }
    private createLinearProgress(refresh?: boolean, prevWidth: number = 0): void {
        let linearBuffer: Element;
        let secondaryProgressWidth: number;
        let linearBufferWidth: number;
        let option: PathOption;
        let linearProgress: Element;
        let progressWidth: number;
        let linearProgressWidth: number;
        let clipPathBuffer: Element;
        let clipPathLinear: Element;
        if (this.type === 'Linear') {
            if (this.secondaryProgress !== null && !this.isIndeterminate) {
                secondaryProgressWidth = this.calculateProgressRange(this.minimum, this.maximum, this.secondaryProgress);
                linearBufferWidth = this.progressRect.width * secondaryProgressWidth;
                if (this.segmentColor.length !== 0 && !this.isIndeterminate) {
                    linearBuffer = this.createLinearSegment(
                        '_LinearBuffer', linearBufferWidth, this.themeStyle.bufferOpacity,
                        (this.progressThickness || this.themeStyle.linearProgressThickness)
                    );
                } else {
                    option = new PathOption(
                        this.element.id + '_Linearbuffer', 'none', (this.progressThickness || this.themeStyle.linearProgressThickness),
                        (this.argsData.progressColor || this.themeStyle.linearProgressColor), this.themeStyle.bufferOpacity, '0',
                        this.getPathLine(
                            this.progressRect.x, linearBufferWidth, (this.progressThickness || this.themeStyle.linearProgressThickness)
                        )
                    );
                    linearBuffer = this.renderer.drawPath(option);
                    if (this.segmentCount > 1) {
                        linearBuffer.setAttribute('stroke-dasharray', this.segmentSize);
                    }
                    if (this.cornerRadius === 'Round') {
                        linearBuffer.setAttribute('stroke-linecap', 'round');
                    }
                }
                this.svgObject.appendChild(linearBuffer);
                if (this.animation.enable) {
                    clipPathBuffer = this.createClipPath(
                        this.bufferClipPath, secondaryProgressWidth, null, this.progressRect.x, false,
                        (this.progressThickness || this.themeStyle.linearProgressThickness)
                    );
                    linearBuffer.setAttribute('style', 'clip-path:url(#' + this.element.id + '_clippathBuffer)');
                    doLinearAnimation(clipPathBuffer, this, this.animation.delay, 0);
                }
                this.svgObject.appendChild(this.bufferClipPath);
            }
            if (this.argsData.value !== null) {
                progressWidth = this.calculateProgressRange(this.minimum, this.maximum, this.argsData.value);
                this.progressPreviousWidth = linearProgressWidth = this.progressRect.width * ((this.isIndeterminate) ? 1 : progressWidth);
                if (this.segmentColor.length !== 0 && !this.isIndeterminate) {
                    linearProgress = this.createLinearSegment(
                        '_LinearProgress', linearProgressWidth, this.themeStyle.progressOpacity,
                        (this.progressThickness || this.themeStyle.linearProgressThickness)
                    );
                } else {
                    if (!refresh) {
                        option = new PathOption(
                            this.element.id + '_Linearprogress', 'none',
                            (this.progressThickness || this.themeStyle.linearProgressThickness),
                            (this.argsData.progressColor || this.themeStyle.linearProgressColor), this.themeStyle.progressOpacity, '0',
                            this.getPathLine(
                                this.progressRect.x, linearProgressWidth,
                                (this.progressThickness || this.themeStyle.linearProgressThickness)
                            )
                        );
                        linearProgress = this.renderer.drawPath(option);
                    } else {
                        linearProgress = getElement(this.element.id + '_Linearprogress');
                        linearProgress.setAttribute(
                            'd', this.getPathLine(
                                this.progressRect.x, linearProgressWidth,
                                (this.progressThickness || this.themeStyle.linearProgressThickness)
                            ));
                        linearProgress.setAttribute('stroke', this.argsData.progressColor || this.themeStyle.circularProgressColor);
                    }

                    if (this.segmentCount > 1) {
                        linearProgress.setAttribute('stroke-dasharray', this.segmentSize);
                    }
                    if (this.cornerRadius === 'Round') {
                        linearProgress.setAttribute('stroke-linecap', 'round');
                    }
                }
                this.svgObject.appendChild(linearProgress);
                if (this.animation.enable || this.isIndeterminate) {
                    let animationdelay: number = this.animation.delay + (
                        (this.secondaryProgress !== null) ? (linearBufferWidth - linearProgressWidth) : 0
                    );
                    clipPathLinear = this.createClipPath(
                        this.clipPath, progressWidth, null, refresh ? prevWidth : this.progressRect.x, refresh,
                        (this.progressThickness || this.themeStyle.linearProgressThickness)
                    );
                    linearProgress.setAttribute('style', 'clip-path:url(#' + this.element.id + '_clippath)');
                    doLinearAnimation(clipPathLinear, this, animationdelay, refresh ? prevWidth : 0);
                }
                this.svgObject.appendChild(this.clipPath);
            }

        }
    }
    // tslint:disable-next-line:max-func-body-length
    private createCircularProgress(previousStart?: number, previousEnd?: number, refresh?: boolean): void {
        let centerX: number; let centerY: number; let size: number; let endAngle: number;
        let radius: number; let startAngle: number = this.startAngle; let previousPath: string;
        this.progressStartAngle = startAngle; let circularPath: string; let bufferClipPath: Element;
        let progressEnd: number; let circularProgress: Element; let circularBuffer: Element;
        let option: PathOption; let radiusDiff: number; let progressThickness: number; let linearClipPath: Element;
        let rDiff: number; let progressSegment: number;
        if (this.type === 'Circular') {
            centerX = this.progressRect.x + (this.progressRect.width / 2);
            centerY = this.progressRect.y + (this.progressRect.height / 2);
            progressThickness = Math.max(this.trackThickness, this.progressThickness) ||
                Math.max(this.themeStyle.circularProgressThickness, this.themeStyle.circularTrackThickness);
            size = (Math.min(this.progressRect.height, this.progressRect.width) / 2) - progressThickness / 2;
            radius = stringToNumber(this.innerRadius, size);
            radius = (radius === null) ? 0 : radius;
            if (this.secondaryProgress !== null && !this.isIndeterminate) {
                if (this.segmentColor.length !== 0 && !this.isIndeterminate) {
                    circularBuffer = this.createCircularSegment(
                        '_CircularBuffer', centerX, centerY, radius,
                        this.secondaryProgress, this.themeStyle.bufferOpacity,
                        (this.progressThickness || this.themeStyle.circularProgressThickness)
                    );
                } else {
                    endAngle = this.calculateProgressRange(this.minimum, this.maximum, this.secondaryProgress);
                    circularPath = getPathArc(centerX, centerY, radius, startAngle, endAngle, this.enableRtl);
                    option = new PathOption(
                        this.element.id + '_Circularbuffer', 'none', (this.progressThickness || this.themeStyle.circularProgressThickness),
                        (this.argsData.progressColor || this.themeStyle.circularProgressColor),
                        this.themeStyle.bufferOpacity, '0', circularPath
                    );
                    circularBuffer = this.renderer.drawPath(option);
                    if (this.segmentCount > 1) {
                        radiusDiff = parseInt(this.radius, 10) - parseInt(this.innerRadius, 10);
                        if (radiusDiff !== 0) {
                            progressSegment = this.trackwidth + (
                                (radiusDiff < 0) ? (this.trackwidth * Math.abs(radiusDiff)) / parseInt(this.radius, 10) :
                                    -(this.trackwidth * Math.abs(radiusDiff)) / parseInt(this.radius, 10)
                            );
                            this.segmentSize = this.calculateSegmentSize(
                                progressSegment, (this.progressThickness || this.themeStyle.circularProgressThickness)
                            );
                        }
                        circularBuffer.setAttribute('stroke-dasharray', this.segmentSize);
                    }
                    if (this.cornerRadius === 'Round') {
                        circularBuffer.setAttribute('stroke-linecap', 'round');
                    }
                }
                this.svgObject.appendChild(circularBuffer);
                if (this.animation.enable) {
                    bufferClipPath = this.createClipPath(this.bufferClipPath, null, '', null, false);
                    circularBuffer.setAttribute('style', 'clip-path:url(#' + this.element.id + '_clippathBuffer)');
                    doCircularAnimation(
                        centerX, centerY, radius, startAngle, 0, bufferClipPath, this,
                        (this.progressThickness || this.themeStyle.circularProgressThickness), this.animation.delay, null
                    );
                }
                this.svgObject.appendChild(this.bufferClipPath);
            }
            if (this.argsData.value !== null) {
                if (this.segmentColor.length !== 0 && !this.isIndeterminate) {
                    circularProgress = this.createCircularSegment(
                        '_CircularProgress', centerX, centerY, radius, this.argsData.value, this.themeStyle.progressOpacity,
                        (this.progressThickness || this.themeStyle.circularProgressThickness)
                    );
                } else {
                    progressEnd = this.calculateProgressRange(this.minimum, this.maximum, this.argsData.value);
                    this.annotationEnd = progressEnd;
                    endAngle = ((this.isIndeterminate) ? (this.startAngle + (
                        (this.enableRtl) ? -this.totalAngle : +this.totalAngle)) % 360 : progressEnd
                    );
                    circularPath = getPathArc(centerX, centerY, radius, startAngle, endAngle, this.enableRtl);
                    option = new PathOption(
                        this.element.id + '_Circularprogress', 'none',
                        (this.progressThickness || this.themeStyle.circularProgressThickness),
                        (this.argsData.progressColor || this.themeStyle.circularProgressColor),
                        this.themeStyle.progressOpacity, '0', circularPath
                    );
                    if (!refresh) {
                        circularProgress = this.renderer.drawPath(option);
                    } else {
                        circularProgress = getElement(this.element.id + '_Circularprogress');
                        previousPath = circularProgress.getAttribute('d');
                        circularProgress.setAttribute('d', circularPath);
                        circularProgress.setAttribute('stroke', this.argsData.progressColor || this.themeStyle.circularProgressColor);
                    }
                    if (this.segmentCount > 1) {
                        rDiff = parseInt(this.radius, 10) - parseInt(this.innerRadius, 10);
                        if (rDiff !== 0) {
                            progressSegment = this.trackwidth + (
                                (rDiff < 0) ? (this.trackwidth * Math.abs(rDiff)) / parseInt(this.radius, 10) :
                                    -(this.trackwidth * Math.abs(rDiff)) / parseInt(this.radius, 10)
                            );
                            this.segmentSize = this.calculateSegmentSize(
                                progressSegment, (this.progressThickness || this.themeStyle.circularProgressThickness)
                            );
                        }
                        circularProgress.setAttribute('stroke-dasharray', this.segmentSize);
                    }
                    if (this.cornerRadius === 'Round') {
                        circularProgress.setAttribute('stroke-linecap', 'round');
                    }
                }
                this.progressEndAngle = endAngle;
                if (!refresh) {
                    this.svgObject.appendChild(circularProgress);
                }
                if (this.animation.enable && !this.isIndeterminate) {
                    let circulardelay: number = (this.secondaryProgress !== null) ? 300 : this.animation.delay;
                    linearClipPath = this.createClipPath(this.clipPath, null, refresh ? previousPath : '', null, refresh);
                    circularProgress.setAttribute('style', 'clip-path:url(#' + this.element.id + '_clippath)');
                    doCircularAnimation(
                        centerX, centerY, radius, startAngle, progressEnd, linearClipPath, this,
                        (this.progressThickness || this.themeStyle.circularProgressThickness), circulardelay, refresh ? previousEnd : null
                    );
                }
                if (this.isIndeterminate) {
                    let circularPathRadius: number = 2 * radius * 0.75;
                    let circularPath: string = getPathArc(
                        centerX, centerY, circularPathRadius, startAngle, progressEnd, this.enableRtl, true
                    );
                    let option: PathOption = new PathOption(
                        this.element.id + '_clippathcircle', 'transparent', 10,
                        'transparent', 1, '0', circularPath
                    );
                    let path: Element = this.renderer.drawPath(option);
                    this.clipPath.appendChild(path);
                    circularProgress.setAttribute('style', 'clip-path:url(#' + this.element.id + '_clippath)');
                    doCircularIndeterminate(<HTMLElement>(path), this, startAngle, progressEnd, centerX, centerY, circularPathRadius);
                }
                this.svgObject.appendChild(this.clipPath);
            }

        }
    }

    private createLabel(): void {
        //let fontsize: string; let fontstyle: string; let fillcolor: string;
        let textSize: Size;
        let isAnimation: boolean = this.animation.enable;
        if (this.type === 'Linear' && this.showProgressValue) {
            let linearlabel: Element;
            let linearbufferValue: number;
            let linearprogresswidth: number;
            let progresslabelwidth: number = this.calculateProgressRange(this.minimum, this.maximum, this.value);
            if (this.value === this.maximum) {
                linearbufferValue = 100;
                linearprogresswidth = (this.progressRect.width * progresslabelwidth) - 10;
            }
            if (this.value > this.maximum || this.value < this.minimum || this.value === this.minimum) {
                linearbufferValue = 0;
                linearprogresswidth = (this.progressRect.width * progresslabelwidth) + 10;
            }
            if (this.value > this.minimum && this.value < this.maximum) {
                linearbufferValue = Math.round((this.value * 100) / (this.maximum - this.minimum));
                linearprogresswidth = (this.progressRect.width * progresslabelwidth) - 10;
            }
            let argsData: ITextRenderEventArgs = {
                cancel: false, text: this.label ? this.label : String(linearbufferValue) + '%', color: this.labelStyle.color
            };
            this.trigger('textRender', argsData);
            if (!argsData.cancel) {
                textSize = measureText(argsData.text, this.labelStyle);
                let options: object = {
                    'id': this.element.id + '_linearLabel',
                    'font-size': this.labelStyle.size || this.themeStyle.linearFontSize,
                    'font-style': this.labelStyle.fontStyle || this.themeStyle.linearFontStyle,
                    'font-family': this.labelStyle.fontFamily || this.themeStyle.linearFontFamily,
                    'font-weight': this.labelStyle.fontWeight,
                    'fill': argsData.color || this.themeStyle.fontColor,
                    'x': linearprogresswidth,
                    'y': this.progressRect.y + (this.progressRect.height / 2) + (textSize.height / 4),
                    'text-anchor': 'middle',
                    'visibility': isAnimation ? 'hidden' : 'visible'
                };

                linearlabel = this.renderer.createText(options, argsData.text);
                this.labelElement = linearlabel;
                this.svgObject.appendChild(linearlabel);
            }
        } else if (this.type === 'Circular' && this.showProgressValue) {
            let circularLabel: Element;
            let circularbufferValue: number;
            let xAxis: number = (this.progressRect.x + (this.progressRect.width / 2));
            let yAxis: number = this.progressRect.y + (this.progressRect.height / 2);
            if (this.value === this.minimum || this.value > this.maximum) {
                circularbufferValue = 0;
            }
            if (this.value === this.maximum) {
                circularbufferValue = 100;
            }
            if (this.value > this.minimum && this.value < this.maximum) {
                circularbufferValue = Math.round((this.value * 100) / (this.maximum - this.minimum));
            }
            let argsData: ITextRenderEventArgs = {
                cancel: false, text: this.label ? this.label : String(circularbufferValue) + '%', color: this.labelStyle.color
            };
            this.trigger('textRender', argsData);
            if (!argsData.cancel) {
                textSize = measureText(argsData.text, this.labelStyle);
                let options: object = {
                    'id': this.element.id + '_circularLabel',
                    'fill': argsData.color || this.themeStyle.fontColor,
                    'font-size': this.labelStyle.size || this.themeStyle.circularFontSize,
                    'font-style': this.labelStyle.fontStyle || this.themeStyle.circularFontStyle,
                    'font-family': this.labelStyle.fontFamily || this.themeStyle.circularFontFamily,
                    'font-weight': this.labelStyle.fontWeight,
                    'height': this.progressRect.height,
                    'width': this.progressRect.width,
                    'visibility': isAnimation ? 'hidden' : 'visible',
                    'x': xAxis,
                    'y': yAxis + textSize.height / 2,
                    'text-anchor': 'middle'
                };
                circularLabel = this.renderer.createText(options, argsData.text);
                this.labelElement = circularLabel;
                this.svgObject.appendChild(circularLabel);
            }
        }
    }


    private getPathLine(x: number, width: number, thickness: number): string {
        let moveTo: number = (this.enableRtl) ? ((this.cornerRadius === 'Round') ?
            (x + this.progressRect.width) - ((lineCapRadius / 2) * thickness) : (x + this.progressRect.width)) :
            ((this.cornerRadius === 'Round') ? (x + (lineCapRadius / 2) * thickness) : x);
        let lineTo: number = (this.enableRtl) ? ((this.cornerRadius === 'Round') ?
            (moveTo - width + (lineCapRadius * thickness)) : (moveTo - width)) :
            ((this.cornerRadius === 'Round') ? (moveTo + width - (lineCapRadius * thickness)) : (moveTo + width));
        return 'M' + moveTo + ' ' + (this.progressRect.y + (this.progressRect.height / 2)) +
            'L' + lineTo + ' ' + (this.progressRect.y + (this.progressRect.height / 2));
    }

    private calculateProgressRange(min: number, max: number, value: number): number {
        let result: number;
        let endValue: number;
        if (this.type === 'Linear') {
            endValue = (value - min) / (max - min);
            result = (value < min || value > max) ? 0 : endValue;
            return result;
        } else {
            endValue = ((value - min) / (max - min)) * this.totalAngle;
            endValue = (this.startAngle + ((this.enableRtl) ? -endValue : +endValue)) % 360;
            result = (value < min || value > max) ? this.startAngle : endValue;
            return result;
        }
    }

    private calculateSegmentSize(width: number, thickness: number): string {
        let count: number = (this.type === 'Circular' && this.totalAngle === completeAngle) ? this.segmentCount : this.segmentCount - 1;
        let cornerCount: number = (this.totalAngle === completeAngle || this.type === 'Linear') ? this.segmentCount : this.segmentCount - 1;
        let gap: number = this.gapWidth || ((this.type === 'Linear') ? this.themeStyle.linearGapWidth : this.themeStyle.circularGapWidth);
        let size: number = (width - count * gap);
        size = (size - ((this.cornerRadius === 'Round') ? (cornerCount * (lineCapRadius * thickness)) : 0)) / this.segmentCount;
        gap += (this.cornerRadius === 'Round') ? lineCapRadius * thickness : 0;
        return ' ' + size + ' ' + gap;
    }

    private createClipPath(clipPath?: Element, width?: number, d?: string, x?: number, refresh?: boolean, thickness?: number): Element {
        let path: Element;
        let rect: RectOption;
        let option: PathOption;
        if (this.type === 'Linear') {
            if (!refresh) {
                rect = new RectOption(
                    this.element.id + '_clippathrect', 'transparent', 1, 'transparent', 1,
                    new Rect(
                        (this.cornerRadius === 'Round') ? (this.progressRect.x - (lineCapRadius / 2 * thickness)) : x,
                        0, this.progressSize.height, (this.isIndeterminate) ? this.progressRect.width * width :
                            (this.cornerRadius === 'Round') ? (this.progressRect.width * width + lineCapRadius * thickness) :
                                this.progressRect.width * width)
                );
                path = this.renderer.drawRectangle(rect);
                clipPath.appendChild(path);
            } else {
                path = getElement(this.element.id + '_clippathrect');
            }
        } else {
            if (!refresh) {
                option = new PathOption(
                    this.element.id + '_clippathcircle', 'transparent', 10,
                    'transparent', 1, '0', d
                );
                path = this.renderer.drawPath(option);
                clipPath.appendChild(path);
            } else {
                path = getElement(this.element.id + '_clippathcircle');
                path.setAttribute('d', d);
            }
        }
        return path;
    }

    private createLinearSegment(id: string, width: number, opacity: number, thickness: number): Element {
        let locX: number = (this.enableRtl) ? ((this.cornerRadius === 'Round') ?
            (this.progressRect.x + this.progressRect.width) - ((lineCapRadius / 2) * thickness) :
            (this.progressRect.x + this.progressRect.width)) :
            ((this.cornerRadius === 'Round') ? (this.progressRect.x + (lineCapRadius / 2) * thickness) : this.progressRect.x);
        let locY: number = (this.progressRect.y + (this.progressRect.height / 2));
        let gapWidth: number = (this.gapWidth || this.themeStyle.linearGapWidth);
        let avlWidth: number = this.progressRect.width / this.segmentCount;
        let avlSegWidth: number = (this.progressRect.width - ((this.segmentCount - 1) * gapWidth));
        avlSegWidth = (avlSegWidth -
            ((this.cornerRadius === 'Round') ? this.segmentCount * (lineCapRadius * thickness) : 0)) / this.segmentCount;
        let gap: number = (this.cornerRadius === 'Round') ? (gapWidth + (lineCapRadius * thickness)) : gapWidth;
        let segmentGroup: Element = this.renderer.createGroup({ 'id': this.element.id + id + 'Group' });
        let count: number = Math.ceil(width / avlWidth);
        let segWidth: number;
        let color: string;
        let j: number = 0;
        let option: PathOption;
        let segmentPath: Element;
        let tolWidth: number = (this.cornerRadius === 'Round') ? (width - (lineCapRadius * thickness)) : width;
        let linearThickness: number = this.progressThickness || this.themeStyle.linearProgressThickness;
        for (let i: number = 0; i < count; i++) {
            segWidth = (tolWidth < avlSegWidth) ? tolWidth : avlSegWidth;
            if (j < this.segmentColor.length) {
                color = this.segmentColor[j];
                j++;
            } else {
                j = 0;
                color = this.segmentColor[j];
                j++;
            }
            option = new PathOption(
                this.element.id + id + i, 'none', linearThickness, color, opacity,
                '0', this.getLinearSegmentPath(locX, locY, segWidth)
            );
            segmentPath = this.renderer.drawPath(option);
            if (this.cornerRadius === 'Round') {
                segmentPath.setAttribute('stroke-linecap', 'round');
            }
            segmentGroup.appendChild(segmentPath);
            locX += (this.enableRtl) ? -avlSegWidth - gap : avlSegWidth + gap;
            tolWidth -= avlSegWidth + gap;
            tolWidth = (tolWidth < 0) ? 0 : tolWidth;
        }
        return segmentGroup;
    }

    private getLinearSegmentPath(x: number, y: number, width: number): string {
        return 'M' + ' ' + x + ' ' + y + ' ' + 'L' + (x + ((this.enableRtl) ? -width : width)) + ' ' + y;
    }

    private createCircularSegment(id: string, x: number, y: number, r: number, value: number, opacity: number, thickness: number): Element {
        let start: number = this.startAngle;
        let end: number = this.widthToAngle(this.minimum, this.maximum, value);
        end -= (this.cornerRadius === 'Round' && this.totalAngle === completeAngle) ?
            this.widthToAngle(0, this.trackwidth, ((lineCapRadius / 2) * thickness)) : 0;
        let size: number = (this.trackwidth - (
            (this.totalAngle === completeAngle) ? this.segmentCount :
                this.segmentCount - 1) * (this.gapWidth || this.themeStyle.circularGapWidth)
        );
        size = (size -
            ((this.cornerRadius === 'Round') ?
                (((this.totalAngle === completeAngle) ?
                    this.segmentCount : this.segmentCount - 1) * lineCapRadius * thickness) : 0)) / this.segmentCount;
        let avlTolEnd: number = this.widthToAngle(0, this.trackwidth, (this.trackwidth / this.segmentCount));
        avlTolEnd -= (this.cornerRadius === 'Round' && this.totalAngle === completeAngle) ?
            this.widthToAngle(0, this.trackwidth, ((lineCapRadius / 2) * thickness)) : 0;
        let avlEnd: number = this.widthToAngle(0, this.trackwidth, size);
        let gap: number = this.widthToAngle(0, this.trackwidth, (this.gapWidth || this.themeStyle.circularGapWidth));
        gap += (this.cornerRadius === 'Round') ? this.widthToAngle(0, this.trackwidth, (lineCapRadius * thickness)) : 0;
        let segmentGroup: Element = this.renderer.createGroup({ 'id': this.element.id + id + 'Group' });
        let gapCount: number = Math.floor(end / avlTolEnd);
        let count: number = Math.ceil((end - gap * gapCount) / avlEnd);
        let segmentPath: string;
        let circularSegment: Element;
        let segmentEnd: number;
        let avlSegEnd: number = (start + ((this.enableRtl) ? -avlEnd : avlEnd)) % 360;
        let color: string;
        let j: number = 0;
        let option: PathOption;
        let circularThickness: number = this.progressThickness || this.themeStyle.circularProgressThickness;
        for (let i: number = 0; i < count; i++) {
            segmentEnd = (this.enableRtl) ? ((this.startAngle - end > avlSegEnd) ? this.startAngle - end : avlSegEnd) :
                ((this.startAngle + end < avlSegEnd) ? this.startAngle + end : avlSegEnd
                );
            segmentPath = getPathArc(x, y, r, start, segmentEnd, this.enableRtl);
            if (j < this.segmentColor.length) {
                color = this.segmentColor[j];
                j++;
            } else {
                j = 0;
                color = this.segmentColor[j];
                j++;
            }
            option = new PathOption(
                this.element.id + id + i, 'none', circularThickness, color,
                opacity, '0', segmentPath
            );
            circularSegment = this.renderer.drawPath(option);
            if (this.cornerRadius === 'Round') {
                circularSegment.setAttribute('stroke-linecap', 'round');
            }
            segmentGroup.appendChild(circularSegment);
            start = segmentEnd + ((this.enableRtl) ? -gap : gap);
            avlSegEnd += (this.enableRtl) ? -avlEnd - gap : avlEnd + gap;
        }
        return segmentGroup;
    }

    private widthToAngle(min: number, max: number, value: number): number {
        let angle: number = ((value - min) / (max - min)) * this.totalAngle;
        return angle;
    }

    /**
     * Theming for progress bar
     */
    private setTheme(): void {
        this.themeStyle = getProgressThemeColor(this.theme);
    }
    /**
     * Annotation for progress bar
     */
    private renderAnnotation(): void {
        if (this.progressAnnotationModule && this.annotations.length > 0) {
            this.progressAnnotationModule.renderAnnotations(this.secElement);
        }
    }

    /**
     * Handles the progressbar resize.
     * @return {boolean}
     * @private
     */
    private progressResize(e: Event): boolean {
        // 800 used as buffer time for resize event preventing from control rendered time
        if (!(new Date().getTime() > this.controlRenderedTimeStamp + 800)) {
            return false;
        }
        let arg: IProgressResizeEventArgs = {
            bar: this,
            name: 'resized',
            currentSize: new Size(0, 0),
            previousSize: new Size(
                this.progressSize.width,
                this.progressSize.height
            ),
        };
        if (this.resizeTo) {
            clearTimeout(this.resizeTo);
        }
        this.resizeTo = setTimeout(
            (): void => {
                if (this.isDestroyed) {
                    clearTimeout(this.resizeTo);
                    return;
                }
                arg.currentSize = this.progressSize;
                this.trigger('resized', arg);
                this.calculateProgressBarSize();
                this.calculateProgressBarBounds();
                this.secElement.innerHTML = '';
                this.renderAnnotation();
                this.renderElements();
            },
            500);
        return false;
    }

    /**
     * Method to un-bind events for progress bar
     */
    private unWireEvents(): void {

        window.removeEventListener(
            (Browser.isTouch && ('orientation' in window && 'onorientationchange' in window)) ? 'orientationchange' : 'resize',
            this.resizeBounds
        );

    }

    /**
     * Method to bind events for bullet chart
     */
    private wireEvents(): void {
        this.resizeBounds = this.progressResize.bind(this);
        window.addEventListener(
            (Browser.isTouch && ('orientation' in window && 'onorientationchange' in window)) ? 'orientationchange' : 'resize',
            this.resizeBounds
        );
    }

    public removeSvg(): void {
        let svgElement: HTMLElement = document.getElementById(this.element.id + 'SVG');
        if (svgElement) {
            remove(svgElement);
        }
    }

    public onPropertyChanged(newProp: ProgressBarModel, oldProp: ProgressBarModel): void {

        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'annotations':
                    this.secElement.innerHTML = '';
                    this.renderAnnotation();
                    let annotationElement: Element = document.getElementById(this.element.id + 'Annotation0').children[0];
                    doAnnotationAnimation(annotationElement, this, this.startAngle, this.annotationEnd);
                    break;
                case 'value':
                    this.argsData = {
                        value: this.value,
                        progressColor: this.progressColor,
                        trackColor: this.trackColor
                    };
                    if (this.argsData.value === this.maximum) {
                        this.trigger(progressCompleted, this.argsData);
                    } else {
                        this.trigger(valueChanged, this.argsData);
                    }
                    if (this.type === 'Circular') {
                        this.createCircularProgress(this.progressStartAngle, this.progressEndAngle, true);
                    } else {
                        this.createLinearProgress(true, this.progressPreviousWidth);
                    }
                    break;
            }
        }
    }

    public requiredModules(): ModuleDeclaration[] {
        let modules: ModuleDeclaration[] = [];
        let enableAnnotation: boolean = false;
        enableAnnotation = this.annotations.some((value: ProgressAnnotationSettings) => {
            return (value.content !== null);
        });
        if (enableAnnotation) {
            modules.push({
                member: 'ProgressAnnotation',
                args: [this]
            });
        }
        return modules;
    }

    public getPersistData(): string {
        return ' ';
    }

    /**
     * To destroy the widget
     * @method destroy
     * @return {void}.
     * @member of ProgressBar
     */
    public destroy(): void {
        this.unWireEvents();
        super.destroy();
        this.removeSvg();
        this.svgObject = null;
        this.element.classList.remove('e-progressbar');
    }
}