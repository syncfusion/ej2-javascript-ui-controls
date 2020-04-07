import { Component, Property, NotifyPropertyChanges, Browser, Complex, Event, Collection, EventHandler } from '@syncfusion/ej2-base';
import { EmitType, INotifyPropertyChanged, createElement, remove, ModuleDeclaration } from '@syncfusion/ej2-base';
import { ProgressBarModel } from './progressbar-model';
import { Rect, Size, RectOption, stringToNumber } from './utils/helper';
import { MarginModel, AnimationModel, FontModel } from './model/progress-base-model';
import { Margin, Animation, Font } from './model/progress-base';
import { ILoadedEventArgs, IProgressStyle, IProgressValueEventArgs } from './model/progress-interface';
import { ITextRenderEventArgs, IProgressResizeEventArgs, IMouseEventArgs } from './model/progress-interface';
import { SvgRenderer, PathOption, getElement } from '@syncfusion/ej2-svg-base';
import { ProgressType, CornerType, ProgressTheme } from './utils/enum';
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
     * pie view
     * @default false
     */
    @Property(false)
    public enablePieProgress: boolean;
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
     * Trigger after mouse click
     * @event
     */
    @Event()
    public mouseClick: EmitType<IMouseEventArgs>;
    /**
     * Trigger after mouse move
     * @event
     */
    @Event()
    public mouseMove: EmitType<IMouseEventArgs>;
    /**
     * Trigger after mouse up
     * @event
     */
    @Event()
    public mouseUp: EmitType<IMouseEventArgs>;
    /**
     * Trigger after mouse down
     * @event
     */
    @Event()
    public mouseDown: EmitType<IMouseEventArgs>;
    /**
     * Trigger after mouse down
     * @event
     */
    @Event()
    public mouseLeave: EmitType<IMouseEventArgs>;
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
    public progressStartAngle: number;
    /** @private */
    public progressPreviousWidth: number;
    /** @private */
    public progressEndAngle: number;
    /** @private */
    public redraw: boolean;
    /** @private */
    public clipPath: Element;
    /** @private */
    public bufferClipPath: Element;
    /** @private */
    public secElement: HTMLElement;
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
        this.renderElements();
        this.trigger('loaded', { progressBar: this });
        this.renderComplete();
        this.controlRenderedTimeStamp = new Date().getTime();
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
        this.progressRect.x = this.margin.left;
        this.progressRect.y = this.margin.top;
        this.progressRect.width = this.progressSize.width - (this.margin.left + this.margin.right);
        this.progressRect.height = this.progressSize.height - (this.margin.top + this.margin.bottom);
    }

    /**
     * Render Annotation
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
        this.renderAnnotations();
        this.renderLabel();
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
        this.element.appendChild(this.svgObject);
    }

    private renderLabel(): void {
        if (this.type === 'Linear' && this.showProgressValue && !this.isIndeterminate) {
            this.linear.renderLinearLabel();
        } else if (this.type === 'Circular' && this.showProgressValue && !this.isIndeterminate) {
            this.circular.renderCircularLabel();
        }
    }


    public getPathLine(x: number, width: number, thickness: number): string {
        let moveTo: number = (this.enableRtl) ? ((this.cornerRadius === 'Round') ?
            (x + this.progressRect.width) - ((lineCapRadius / 2) * thickness) : (x + this.progressRect.width)) :
            ((this.cornerRadius === 'Round') ? (x + (lineCapRadius / 2) * thickness) : x);
        let lineTo: number = (this.enableRtl) ? ((this.cornerRadius === 'Round' && width) ?
            (moveTo - width + (lineCapRadius * thickness)) : (moveTo - width)) :
            ((this.cornerRadius === 'Round' && width) ? (moveTo + width - (lineCapRadius * thickness)) : (moveTo + width));
        return 'M' + moveTo + ' ' + (this.progressRect.y + (this.progressRect.height / 2)) +
            'L' + lineTo + ' ' + (this.progressRect.y + (this.progressRect.height / 2));
    }

    public calculateProgressRange(min: number, max: number, value: number): number {
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

    public calculateSegmentSize(width: number, thickness: number): string {
        let count: number = (this.type === 'Circular' && this.totalAngle === completeAngle) ? this.segmentCount : this.segmentCount - 1;
        let cornerCount: number = (this.totalAngle === completeAngle || this.type === 'Linear') ? this.segmentCount : this.segmentCount - 1;
        let gap: number = this.gapWidth || ((this.type === 'Linear') ? this.themeStyle.linearGapWidth : this.themeStyle.circularGapWidth);
        let size: number = (width - count * gap);
        size = (size - ((this.cornerRadius === 'Round') ? (cornerCount * (lineCapRadius * thickness)) : 0)) / this.segmentCount;
        gap += (this.cornerRadius === 'Round') ? lineCapRadius * thickness : 0;
        return ' ' + size + ' ' + gap;
    }

    public createClipPath(clipPath?: Element, width?: number, d?: string, x?: number, refresh?: boolean, thickness?: number): Element {
        let path: Element;
        let rect: RectOption;
        let option: PathOption;
        let posx: number;
        let posy: number;
        let pathWidth: number;
        if (this.type === 'Linear') {
            if (!refresh) {
                posx = (this.enableRtl) ? (x + this.progressRect.width) : x;
                posx += (this.cornerRadius === 'Round') ?
                    ((this.enableRtl) ? (lineCapRadius / 2) * thickness : -(lineCapRadius / 2) * thickness) : 0;
                posy = (this.progressRect.y + (this.progressRect.height / 2)) - (thickness / 2);
                pathWidth = this.progressRect.width * width;
                pathWidth += (this.cornerRadius === 'Round') ? (lineCapRadius * thickness) : 0;
                rect = new RectOption(
                    this.element.id + '_clippathrect', 'transparent', 1, 'transparent', 1,
                    new Rect(posx, posy, thickness, pathWidth)
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

    /**
     * Theming for progress bar
     */
    private setTheme(): void {
        this.themeStyle = getProgressThemeColor(this.theme);
        switch (this.theme) {
            case 'Bootstrap':
            case 'Bootstrap4':
                this.cornerRadius = this.cornerRadius === 'Auto' ? 'Round' : this.cornerRadius;
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
                this.secElement.innerHTML = '';
                this.calculateProgressBarSize();
                this.createSVG();
                this.renderElements();
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
        let element: Element = <Element>e.target;
        this.trigger(eventName, { target: element.id });
    }
    /**
     * Method to un-bind events for progress bar
     */
    private unWireEvents(): void {
        let startEvent: string = Browser.touchStartEvent;
        let moveEvent: string = Browser.touchMoveEvent;
        let stopEvent: string = Browser.touchEndEvent;
        /*! Find the Events type */
        let cancelEvent: string = Browser.isPointer ? 'pointerleave' : 'mouseleave';
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
        let startEvent: string = Browser.touchStartEvent;
        let moveEvent: string = Browser.touchMoveEvent;
        let stopEvent: string = Browser.touchEndEvent;
        /*! Find the Events type */
        let cancelEvent: string = Browser.isPointer ? 'pointerleave' : 'mouseleave';
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
                    if (this.animation.enable && !this.isIndeterminate) {
                        let annotationElement: Element = document.getElementById(this.element.id + 'Annotation0').children[0];
                        this.annotateAnimation.doAnnotationAnimation(annotationElement, this);
                    }
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
                        this.circular.renderCircularProgress(this.progressStartAngle, this.progressEndAngle, true);
                    } else {
                        this.linear.renderLinearProgress(true, this.progressPreviousWidth);
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