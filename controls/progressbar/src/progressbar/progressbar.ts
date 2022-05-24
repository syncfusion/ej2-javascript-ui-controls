/* eslint-disable valid-jsdoc */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Property, NotifyPropertyChanges, Browser, Complex, Event, Collection, EventHandler } from '@syncfusion/ej2-base';
import { EmitType, INotifyPropertyChanged, createElement, remove, ModuleDeclaration, isNullOrUndefined } from '@syncfusion/ej2-base';
import { ProgressBarModel } from './progressbar-model';
import { Rect, Size, RectOption, stringToNumber } from './utils/helper';
import { MarginModel, AnimationModel, FontModel, RangeColorModel } from './model/progress-base-model';
import { Margin, Animation, Font, RangeColor } from './model/progress-base';
import { ILoadedEventArgs, IProgressStyle, IProgressValueEventArgs } from './model/progress-interface';
import { ITextRenderEventArgs, IProgressResizeEventArgs, IMouseEventArgs } from './model/progress-interface';
import { SvgRenderer, PathOption, getElement } from '@syncfusion/ej2-svg-base';
import { ProgressType, CornerType, ProgressTheme, ModeType } from './utils/enum';
import { getProgressThemeColor } from './utils/theme';
import { lineCapRadius, completeAngle, valueChanged, progressCompleted } from './model/constant';
import { mouseClick, mouseDown, mouseLeave, mouseMove, mouseUp } from './model/constant';
import { ProgressAnnotation } from './model/index';
import { ProgressAnnotationSettingsModel } from './model/index';
import { ProgressAnnotationSettings } from './model/index';
import { Linear } from './types/linear-progress';
import { Circular } from './types/circular-progress';
import { ProgressAnimation } from './utils/progress-animation';

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
     *
     * @default Linear
     */
    @Property('Linear')
    public type: ProgressType;
    /**
     * progress value
     *
     * @default null
     */
    @Property(null)
    public value: number;
    /**
     * secondary progress value
     *
     * @default null
     */
    @Property(null)
    public secondaryProgress: number;
    /**
     * minimum progress value
     *
     * @default 0
     */
    @Property(0)
    public minimum: number;
    /**
     * maximum progress value
     *
     * @default 0
     */
    @Property(100)
    public maximum: number;
    /**
     * startAngle for circular progress bar
     *
     * @default 0
     */
    @Property(0)
    public startAngle: number;
    /**
     * endAngle for circular progress bar
     *
     * @default 0
     */
    @Property(0)
    public endAngle: number;
    /**
     * track radius for circular
     *
     * @default '100%'
     */
    @Property('100%')
    public radius: string;
    /**
     * progress radius for circular
     *
     * @default '100%'
     */
    @Property('100%')
    public innerRadius: string;
    /**
     * segmentCount of the progress bar
     *
     * @default 1
     */
    @Property(1)
    public segmentCount: number;
    /**
     * gapwidth of the segment
     *
     * @default null
     */
    @Property(null)
    public gapWidth: number;
    /**
     * Segment color
     *
     * @default null
     */
    @Property('')
    public segmentColor: string[];
    /**
     * corner type
     *
     * @default Auto
     */
    @Property('Auto')
    public cornerRadius: CornerType;
    /**
     * height of the progress bar
     *
     * @default null
     */
    @Property(null)
    public height: string;
    /**
     * width of the progress bar
     *
     * @default null
     */
    @Property(null)
    public width: string;
    /**
     * Indeterminate progress
     *
     * @default false
     */
    @Property(false)
    public isIndeterminate: boolean;
    /**
     * Active state
     *
     * @default false
     */
    @Property(false)
    public isActive: boolean;
    /**
     * gradient
     *
     * @default false
     */
    @Property(false)
    public isGradient: boolean;
    /**
     * striped
     *
     * @default false
     */
    @Property(false)
    public isStriped: boolean;
    /**
     * modes of linear progress
     *
     * @default null
     */
    @Property('Auto')
    public role: ModeType;
    /**
     * right to left
     *
     * @default false
     */
    @Property(false)
    public enableRtl: boolean;
    /**
     * labelOnTrack
     *
     * @default true
     */
    @Property(true)
    public labelOnTrack: boolean;
    /**
     * trackColor
     *
     * @default null
     */
    @Property(null)
    public trackColor: string;
    /**
     * progressColor
     *
     * @default null
     */
    @Property(null)
    public progressColor: string;
    /**
     * track thickness
     *
     * @default 0
     */
    @Property(0)
    public trackThickness: number;
    /**
     * progress thickness
     *
     * @default 0
     */
    @Property(0)
    public progressThickness: number;
    /**
     * pie view
     *
     * @default false
     */
    @Property(false)
    public enablePieProgress: boolean;
    /**
     * theme style
     *
     * @default Fabric
     */
    @Property('Fabric')
    public theme: ProgressTheme;
    /**
     * label of the progress bar
     *
     * @default false
     */
    @Property(false)
    public showProgressValue: boolean;
    /**
     * disable the trackSegment
     *
     * @default false
     */
    @Property(false)
    public enableProgressSegments: boolean;
    /**
     * Option for customizing the  label text.
     */
    @Complex<FontModel>({ size: null, color: null, fontStyle: null, fontWeight: 'Normal', fontFamily: null }, Font)
    public labelStyle: FontModel;
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
     *
     * @event load
     */
    @Event()
    public load: EmitType<ILoadedEventArgs>;
    /**
     * Triggers before the progress bar label renders.
     *
     * @event textRender
     */
    @Event()
    public textRender: EmitType<ITextRenderEventArgs>;
    /**
     * Triggers after the progress bar has loaded.
     *
     * @event loaded
     */
    @Event()
    public loaded: EmitType<ILoadedEventArgs>;
    /**
     * Triggers after the value has changed.
     *
     * @event valueChanged
     */
    @Event()
    public valueChanged: EmitType<IProgressValueEventArgs>;
    /**
     * Triggers after the progress value completed.
     *
     * @event progressCompleted
     */
    @Event()
    public progressCompleted: EmitType<IProgressValueEventArgs>;
    /**
     * Triggers after the animation completed.
     *
     * @event animationComplete
     */
    @Event()
    public animationComplete: EmitType<IProgressValueEventArgs>;
    /**
     * Trigger after mouse click
     *
     * @event mouseClick
     */
    @Event()
    public mouseClick: EmitType<IMouseEventArgs>;
    /**
     * Trigger after mouse move
     *
     * @event mouseMove
     */
    @Event()
    public mouseMove: EmitType<IMouseEventArgs>;
    /**
     * Trigger after mouse up
     *
     * @event mouseUp
     */
    @Event()
    public mouseUp: EmitType<IMouseEventArgs>;
    /**
     * Trigger after mouse down
     *
     * @event mouseDown
     */
    @Event()
    public mouseDown: EmitType<IMouseEventArgs>;
    /**
     * Trigger after mouse down
     *
     * @event mouseLeave
     */
    @Event()
    public mouseLeave: EmitType<IMouseEventArgs>;
    /**
     * The configuration for annotation in Progressbar.
     */
    @Collection<ProgressAnnotationSettingsModel>([{}], ProgressAnnotationSettings)
    public annotations: ProgressAnnotationSettingsModel[];
    /**
     * RangeColor in Progressbar.
     */
    @Collection<RangeColorModel>([{}], RangeColor)
    public rangeColors: RangeColorModel[];
    /** @private */
    public progressRect: Rect;
    /** @private */
    public progressSize: Size;
    /** @private */
    public renderer: SvgRenderer;
    /** @private */
    public svgObject: Element;
    /** @private */
    public totalAngle: number;
    /** @private */
    public trackWidth: number;
    /** @private */
    public progressWidth: number;
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
    public resizeBounds: any;
    /** @private */
    private resizeTo: number;
    /** @private */
    public previousWidth: number;
    /** @private */
    public previousLabelWidth: number;
    /** @private */
    public previousEndAngle: number;
    /** @private */
    public previousTotalEnd: number;
    /** @private */
    public annotateEnd: number;
    /** @private */
    public annotateTotal: number;
    /** @private */
    public redraw: boolean;
    /** @private */
    public clipPath: Element;
    /** @private */
    public bufferClipPath: Element;
    /** @private */
    public secElement: HTMLElement;
    /** @private */
    public cancelResize: boolean;
    /** @private */
    public linear: Linear = new Linear(this);
    /** @private */
    public circular: Circular = new Circular(this);
    /** @private */
    public annotateAnimation: ProgressAnimation = new ProgressAnimation();
    /** ProgressAnnotation module to use annotations */
    public progressAnnotationModule: ProgressAnnotation;
    /** @private */
    // private resizeTo: number;
    /** @private */
    public destroyIndeterminate: boolean = false;

    /**
     * controlRenderedTimeStamp used to avoid inital resize issue while theme change
     */
    private controlRenderedTimeStamp: number;

    public getModuleName(): string {
        return 'progressbar';
    }

    protected preRender(): void {
        this.unWireEvents();
        this.initPrivateVariable();
        this.wireEvents();
    }

    private initPrivateVariable(): void {
        this.progressRect = new Rect(0, 0, 0, 0);
        this.progressSize = new Size(0, 0);
    }

    protected render(): void {
        this.trigger('load', { progressBar: this });
        this.element.style.display = 'block';
        this.element.style.position = 'relative';
        this.calculateProgressBarSize();
        this.setTheme();
        this.createSVG();
        this.argsData = { value: this.value, progressColor: this.progressColor, trackColor: this.trackColor };
        if (this.argsData.value === this.maximum) {
            this.trigger(progressCompleted, this.argsData, () => { this.controlRendering(); });
        } else {
            this.trigger(valueChanged, this.argsData, () => { this.controlRendering(); });
        }
    }

    private controlRendering(): void {
        this.renderElements();
        this.trigger('loaded', { progressBar: this });
        this.renderComplete();
        this.controlRenderedTimeStamp = new Date().getTime();
    }
    /**
     * calculate size of the progress bar
     */
    private calculateProgressBarSize(): void {
        const containerWidth: number = this.element.clientWidth || this.element.offsetWidth;
        const containerHeight: number = this.element.clientHeight;
        const width: number = (this.type === 'Linear') ? 200 : 120;
        let height: number = (this.type === 'Linear') ? 30 : 120;
        const padding: number = 10;
        const thickness: number = Math.max(this.progressThickness, this.trackThickness);
        height = (this.type === 'Linear' && thickness > (height - padding)) ? thickness + padding : height;
        this.progressSize.width = stringToNumber(this.width, containerWidth) || containerWidth || width;
        this.progressSize.height = stringToNumber(this.height, containerHeight) || containerHeight || height;
        this.progressRect.x = this.margin.left;
        this.progressRect.y = this.margin.top;
        this.progressRect.width = this.progressSize.width - (this.margin.left + this.margin.right);
        this.progressRect.height = this.progressSize.height - (this.margin.top + this.margin.bottom);
    }

    /**
     * Render Annotation in progress bar
     */
    private renderAnnotations(): void {
        this.createSecElement();
        this.renderAnnotation();
        this.setSecondaryElementPosition();
    }

    /**
     * Render SVG Element
     */
    private renderElements(): void {
        this.renderTrack();
        this.renderProgress();
        this.renderLabel();
        if (this.annotations.length > 0) {
            this.renderAnnotations();
        }
    }

    private createSecElement(): void {
        const secElement: Element = document.getElementById(this.element.id + 'Secondary_Element');
        if (secElement) {
            secElement.innerHTML = '';
            this.secElement = secElement as HTMLElement;
            return;
        }
        this.secElement = createElement('div', {
            id: this.element.id + 'Secondary_Element',
            styles: 'position: absolute'
        });
        this.element.appendChild(this.secElement);
    }

    /**
     * To set the left and top position for annotation for center aligned
     */
    private setSecondaryElementPosition(): void {
        const element: HTMLElement = this.secElement;
        const rect: ClientRect = this.element.getBoundingClientRect();
        if (getElement(this.svgObject.id)) {
            const svgRect: ClientRect = getElement(this.svgObject.id).getBoundingClientRect();
            element.style.left = Math.max(svgRect.left - rect.left, 0) + 'px';
            element.style.top = Math.max(svgRect.top - rect.top, 0) + 'px';
        }
    }

    private createSVG(): void {
        this.removeSvg();
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

    private renderTrack(): void {
        if (this.type === 'Linear') {
            this.linear.renderLinearTrack();
        } else if (this.type === 'Circular') {
            this.circular.renderCircularTrack();
        }
    }


    private renderProgress(): void {
        this.clipPathElement();
        if (this.type === 'Linear') {
            this.linear.renderLinearProgress();
        } else if (this.type === 'Circular') {
            this.circular.renderCircularProgress();
        }
    }

    private renderLabel(): void {
        if (this.type === 'Linear' && this.showProgressValue && !this.isIndeterminate) {
            this.linear.renderLinearLabel();
        } else if (this.type === 'Circular' && this.showProgressValue && !this.isIndeterminate) {
            this.circular.renderCircularLabel();
        }
        this.element.appendChild(this.svgObject);
    }


    public getPathLine(x: number, width: number, thickness: number): string {
        const moveTo: number = (this.enableRtl) ? ((this.cornerRadius === 'Round') ?
            (x + this.progressRect.width) - ((lineCapRadius / 2) * thickness) : (x + this.progressRect.width)) :
            ((this.cornerRadius === 'Round') ? (x + (lineCapRadius / 2) * thickness) : x);
        //TODO : BLAZ-14309 - ProgressBar renders improperly when corner radius is set to "Round" and the value between one to four.
        thickness = width < thickness && this.cornerRadius === 'Round' ? width : thickness;
        const lineTo: number = (this.enableRtl) ? ((this.cornerRadius === 'Round' && width) ?
            (moveTo - width + (lineCapRadius * thickness)) : (moveTo - width)) :
            ((this.cornerRadius === 'Round' && width) ? (moveTo + width - (lineCapRadius * thickness)) : (moveTo + width));
        return 'M' + moveTo + ' ' + (this.progressRect.y + (this.progressRect.height / 2)) +
            'L' + lineTo + ' ' + (this.progressRect.y + (this.progressRect.height / 2));
    }

    public calculateProgressRange(value: number, minimum?: number, maximum?: number): number {
        const min: number = minimum || this.minimum;
        const max: number = maximum || this.maximum;
        const endValue: number = (value - min) / (max - min) * ((this.type === 'Linear') ? 1 : this.totalAngle);
        const result: number = (value < min || value > max) ? 0 : endValue;
        return result;
    }

    public calculateSegmentSize(width: number, thickness: number): string {
        const count: number = (this.type === 'Circular' && this.totalAngle === completeAngle) ? this.segmentCount : this.segmentCount - 1;
        const cornerCount: number = (this.totalAngle === completeAngle || this.type === 'Linear') ? this.segmentCount : this.segmentCount - 1;
        let gap: number = this.gapWidth || ((this.type === 'Linear') ? this.themeStyle.linearGapWidth : this.themeStyle.circularGapWidth);
        let size: number = (width - count * gap);
        size = (size - ((this.cornerRadius === 'Round') ? (cornerCount * (lineCapRadius * thickness)) : 0)) / this.segmentCount;
        gap += (this.cornerRadius === 'Round') ? lineCapRadius * thickness : 0;
        return ' ' + size + ' ' + gap;
    }

    public createClipPath(
        clipPath?: Element, range?: number, d?: string, refresh?: boolean, thickness?: number, isLabel?: boolean, isMaximum?: boolean
    ): Element {
        let path: Element;
        let rect: RectOption;
        let option: PathOption;
        let posx: number;
        let posy: number;
        let pathWidth: number;
        const x: number = this.progressRect.x;
        const totalWidth: number = this.progressRect.width;
        if (this.type === 'Linear') {
            if (this.cornerRadius === 'Round4px') {
                posx = x;
                pathWidth = totalWidth * range;
                posx += (!isLabel) ? (-4) : 0;
                posy = this.progressRect.y;
                pathWidth += ((!isLabel && isMaximum) || this.isIndeterminate) ? 4 : 0;
            } else {
                //TODO : BLAZ-14309 - ProgressBar renders improperly when corner radius is set to "Round" and the value between one to four.
                posx = (this.enableRtl && !isLabel) ? (x + totalWidth + (this.cornerRadius === 'Round' ? thickness / 10 : 0)) : x - (this.cornerRadius === 'Round' ? thickness / 10 : 0);
                pathWidth = totalWidth * range;
                //TODO : BLAZ-14309 - ProgressBar renders improperly when corner radius is set to "Round" and the value between one to four.
                //posx += (this.cornerRadius === 'Round' && !isLabel) ?
                //    ((this.enableRtl) ? (lineCapRadius / 2) * thickness : -(lineCapRadius / 2) * thickness) : 0;
                posy = (this.progressRect.y + (this.progressRect.height / 2)) - (thickness / 2);
                pathWidth += (this.cornerRadius === 'Round' && !isLabel) ? (lineCapRadius * thickness) : 0;
            }
            if (!refresh) {
                rect = new RectOption(
                    this.element.id + '_clippathrect' + (isLabel ? 'label' :''), 'transparent', 1, 'transparent', 1,
                    new Rect(posx, posy, thickness, pathWidth)
                );
                path = this.renderer.drawRectangle(rect);
                clipPath.appendChild(path);
            } else {
                path = getElement(this.element.id + '_clippathrect' + (isLabel ? 'label' :''));
                path.setAttribute('width', (pathWidth).toString());
                if (this.isActive) {
                    path.setAttribute('x', (posx).toString());
                }
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

    /**
     * Theming for progress bar
     */
    private setTheme(): void {
        this.themeStyle = getProgressThemeColor(this.theme);
        switch (this.theme) {
        case 'Bootstrap':
        case 'Bootstrap4':
            this.cornerRadius = this.cornerRadius === 'Auto' ?
                ((this.type === 'Linear') ? 'Round4px' : 'Round') : this.cornerRadius;
            break;
        default:
            this.cornerRadius = this.cornerRadius === 'Auto' ? 'Square' : this.cornerRadius;
        }
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
     *
     * @returns {boolean} false
     * @private
     */
    private progressResize(): boolean {
        // 800 used as buffer time for resize event preventing from control rendered time
        if (!(new Date().getTime() > this.controlRenderedTimeStamp + 800)) {
            return false;
        }
        const arg: IProgressResizeEventArgs = {
            bar: this,
            name: 'resized',
            currentSize: new Size(0, 0),
            previousSize: new Size(
                this.progressSize.width,
                this.progressSize.height
            ),
            cancel: (this.cancelResize) ? true : false
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
                if ((this.width === null || this.height === null || this.width.indexOf("%") > -1 || this.height.indexOf("%") > -1)
                    && !arg.cancel) {
                    this.secElement ? this.secElement.innerHTML = '' : this.secElement;
                    this.calculateProgressBarSize();
                    this.createSVG();
                    this.renderElements();
                }
            },
            500);
        return false;
    }

    private progressMouseClick(e: PointerEvent): void {
        this.mouseEvent(mouseClick, e);
    }

    private progressMouseDown(e: PointerEvent): void {
        this.mouseEvent(mouseDown, e);
    }

    private progressMouseMove(e: PointerEvent): void {
        this.mouseEvent(mouseMove, e);
    }

    private progressMouseUp(e: PointerEvent): void {
        this.mouseEvent(mouseUp, e);
    }

    private progressMouseLeave(e: PointerEvent): void {
        this.mouseEvent(mouseLeave, e);
    }

    private mouseEvent(eventName: string, e: PointerEvent): void {
        const element: Element = <Element>e.target;
        this.trigger(eventName, { target: element.id });
    }
    /**
     * Method to un-bind events for progress bar
     */
    private unWireEvents(): void {
        const startEvent: string = Browser.touchStartEvent;
        const moveEvent: string = Browser.touchMoveEvent;
        const stopEvent: string = Browser.touchEndEvent;
        /*! Find the Events type */
        const cancelEvent: string = Browser.isPointer ? 'pointerleave' : 'mouseleave';
        /*! UnBind the Event handler */
        EventHandler.remove(this.element, 'click', this.progressMouseClick);
        EventHandler.remove(this.element, startEvent, this.progressMouseDown);
        EventHandler.remove(this.element, moveEvent, this.progressMouseMove);
        EventHandler.remove(this.element, stopEvent, this.progressMouseUp);
        EventHandler.remove(this.element, cancelEvent, this.progressMouseLeave);
        window.removeEventListener(
            (Browser.isTouch && ('orientation' in window && 'onorientationchange' in window)) ? 'orientationchange' : 'resize',
            this.resizeBounds
        );

    }

    /**
     * Method to bind events for bullet chart
     */
    private wireEvents(): void {
        const startEvent: string = Browser.touchStartEvent;
        const moveEvent: string = Browser.touchMoveEvent;
        const stopEvent: string = Browser.touchEndEvent;
        /*! Find the Events type */
        const cancelEvent: string = Browser.isPointer ? 'pointerleave' : 'mouseleave';
        /*! Bind the Event handler */
        EventHandler.add(this.element, 'click', this.progressMouseClick, this);
        EventHandler.add(this.element, startEvent, this.progressMouseDown, this);
        EventHandler.add(this.element, moveEvent, this.progressMouseMove, this);
        EventHandler.add(this.element, stopEvent, this.progressMouseUp, this);
        EventHandler.add(this.element, cancelEvent, this.progressMouseLeave, this);
        this.resizeBounds = this.progressResize.bind(this);
        window.addEventListener(
            (Browser.isTouch && ('orientation' in window && 'onorientationchange' in window)) ? 'orientationchange' : 'resize',
            this.resizeBounds
        );
    }

    public removeSvg(): void {
        const svgElement: HTMLElement = document.getElementById(this.element.id + 'SVG');
        if (svgElement) {
            remove(svgElement);
        }
    }

    public onPropertyChanged(newProp: ProgressBarModel, oldProp: ProgressBarModel): void {
        for (const prop of Object.keys(newProp)) {
            switch (prop) {
            case 'annotations':
                this.secElement.innerHTML = '';
                this.renderAnnotation();
                break;
            case 'value':
                this.cancelResize = (this.animation.enable) ? true : false;
                this.argsData = {
                    value: this.value,
                    progressColor: this.argsData.progressColor,
                    trackColor: this.argsData.trackColor
                };
                if (this.argsData.value < oldProp.value && this.animation.enable) {
                    this.argsData.value = oldProp.value;
                }
                if (this.argsData.value === this.maximum) {
                    this.trigger(progressCompleted, this.argsData);
                } else {
                    this.trigger(valueChanged, this.argsData);
                }
                if (this.type === 'Circular') {
                    this.circular.renderCircularProgress(
                        this.previousEndAngle, this.previousTotalEnd, !isNullOrUndefined(oldProp.value));
                    if (this.showProgressValue) {
                        this.circular.renderCircularLabel(true);
                    }
                    if (this.progressAnnotationModule && this.animation.enable && !this.isIndeterminate) {
                        this.annotateAnimation.doAnnotationAnimation(this.clipPath, this, this.annotateEnd, this.annotateTotal);
                    }
                } else {
                    this.linear.renderLinearProgress(!isNullOrUndefined(oldProp.value), this.previousWidth);
                    if (this.showProgressValue) {
                        this.linear.renderLinearLabel(true);
                    }
                }
                break;
            case 'animation':
                this.createSVG();
                this.renderElements();
                break;
            }
        }
    }

    public requiredModules(): ModuleDeclaration[] {
        const modules: ModuleDeclaration[] = [];
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

    public show(): void {
        if (!isNullOrUndefined(this.svgObject)) {
            this.svgObject.setAttribute('visibility', 'Visible');
            if (this.isIndeterminate) {
                this.destroyIndeterminate = false;
                if (this.type === 'Linear') {
                    this.linear.renderLinearProgress(true);
                } else {
                    this.circular.renderCircularProgress(null, null, true);
                }
            }
        }
    }

    public hide(): void {
        if (!isNullOrUndefined(this.svgObject)) {
            this.svgObject.setAttribute('visibility', 'Hidden');
            if (this.isIndeterminate) {
                this.destroyIndeterminate = true;
            }
        }
    }

    /**
     * To destroy the widget
     *
     * @function destroy
     * @returns {void}
     * @member of ProgressBar
     */
    public destroy(): void {
        this.unWireEvents();
        super.destroy();
        this.removeSvg();
        // tslint:disable-next-line:no-any
        if ((this as any).isReact) { this.clearTemplate(); }
        this.svgObject = null;
        this.element.classList.remove('e-progressbar');
        if (!this.refreshing) {
            this.destroyIndeterminate = true;
        }
    }
}
