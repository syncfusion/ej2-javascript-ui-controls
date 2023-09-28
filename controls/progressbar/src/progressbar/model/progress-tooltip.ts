
import { Tooltip as SVGTooltip } from '@syncfusion/ej2-svg-base';
import { ProgressBar } from '../progressbar';
import { Animation, AnimationOptions } from '@syncfusion/ej2-base';
import { effect, ProgressLocation} from '../utils/helper';
import { tooltipRender } from './constant';
import { ITooltipRenderEventArgs } from './progress-interface';

/**
 * class for tooltip.
 */
export class ProgressTooltip {
    private control: ProgressBar;

    /**
     * Constructor for progress tooltip.
     *
     * @param {ProgressBar} control
     */

    constructor(control: ProgressBar) {
        this.control = control;
    }
    // Defines text collection passed to svg tooltip.
    private text: string[] = [];
    // Represents tooltip control.
    private svgTooltip: SVGTooltip;
    // Defines formatted text.
    private textFormat: string;
    // Defines whether the tooltip is rendered or not.
    public isRendered: boolean;
    // Defines interval to tooltip fadein.
    private fadeInInterval: number;

    /**
     * Method to render the tooltip for progress bar.
     */

    public tooltip(e?: PointerEvent | TouchEvent): void {
        const svgElement: HTMLElement = document.getElementById(this.control.element.id + '_tooltip');
        const isTooltip: boolean = (svgElement && parseInt(svgElement.getAttribute('opacity'), 10) > 0);
        this.renderTooltip(e, this.control, !isTooltip);
        if (this.control.tooltip.enable && this.control.type === 'Circular' && this.control.animation.enable && !(this.control.tooltip.showTooltipOnHover)) {
            svgElement.style.visibility = 'hidden';
            const delay : number = this.control.secondaryProgress ? this.control.circular.delay + this.control.animation.duration :
                this.control.animation.duration;
            this.tooltipDelay(this.control, svgElement, delay);
        }
        if (this.control.animation.enable && !(this.control.tooltip.showTooltipOnHover) && !(this.control.type === 'Circular')) {
            const delay : number = this.control.secondaryProgress ? this.control.linear.delay : this.control.animation.delay;
            if (this.control.secondaryProgress) {
                svgElement.style.visibility = 'hidden';
            }
            this.toolTipAnimation(svgElement, this.control, delay);
        }
    }

    /**
     * Function to delay tooltip at initial stage of circular progress.
     */

    private tooltipDelay(progress: ProgressBar, element: Element, delay: number): void {
        const animation: Animation = new Animation({});
        animation.animate(<HTMLElement>element, {
            duration: progress.animation.duration,
            delay: delay,
            progress: (args: AnimationOptions): void => {
                args.element.style.visibility = 'visible';
            }
        });
    }

    /**
     * Function to animate tooltip.
     */

    private toolTipAnimation(element: HTMLElement, progress: ProgressBar, delay: number): void {
        const animation: Animation = new Animation({});
        const endValue: number = parseInt(element.style.left, 10);
        const tooltipSVG: HTMLElement = document.getElementById(this.control.element.id + '_tooltip_svg');
        const width: number = parseInt(tooltipSVG.getAttribute('width'), 10);
        animation.animate(<HTMLElement>element, {
            duration: progress.animation.duration,
            delay: delay,
            progress: (args: AnimationOptions): void => {
                progress.cancelResize = true;
                args.name = 'SlideRight';
                if (progress.type === 'Linear') {
                    if (args.timeStamp >= args.delay) {
                        args.element.style.visibility = 'visible';
                        const value: number = effect(args.timeStamp, (0 - (width / 2 - this.control.progressRect.x - 5)),
                                                     endValue + ( width / 2 - this.control.progressRect.x - 5),
                                                     args.duration, progress.enableRtl);
                        args.element.style.left = '';
                        args.element.style.left = value + 'px'.toString();
                    }
                }
            },
            end: (args: AnimationOptions) => {
                progress.cancelResize = false;
                args.element.style.left = '';
                args.element.style.left = endValue + 'px'.toString();
            }
        });
    }

    private renderTooltip(e: PointerEvent | TouchEvent, chart: ProgressBar, isFirst: boolean): void {
        this.textFormat = this.format((this.control.tooltip.showTooltipOnHover) ? (e.target as Element).id.indexOf('Linearbuffer') >= 0 || (e.target as Element).id.indexOf('Circularbuffer') >= 0 ? this.control.secondaryProgress : this.control.value : this.control.value);
        this.triggerTooltipRender(e, isFirst, this.textFormat);
    }

    /**
     * Function to get format of tooltip text.
     */

    private format(formatValue: number): string {
        let currentFormat: string = formatValue.toString();
        let value: RegExp;
        if (this.control.tooltip.format) {
            currentFormat = this.control.tooltip.format;
            value = new RegExp('${value' + '}', 'gm');
            currentFormat = currentFormat.replace(value.source, formatValue.toString());
        }
        return currentFormat;
    }

    /**
     * Function to remove tooltip.
     */

    public removeTooltip(duration: number): void {
        const tooltipElement: HTMLElement = document.getElementById(this.control.element.id + '_tooltip');
        if (tooltipElement) {
            this.fadeInInterval = +setTimeout(
                (): void => {
                    if (this.svgTooltip) {
                        this.svgTooltip.fadeOut();
                    }
                },
                duration);
        }
    }

    /**
     * Function to get arguments of tooltip.
     */

    private triggerTooltipRender(e: PointerEvent | TouchEvent, isFirst: boolean, textCollection: string): void {
        const padding: number = 5;
        const argsData: ITooltipRenderEventArgs = {
            cancel: false, name: tooltipRender, text: textCollection + '%'
        };
        this.control.trigger(tooltipRender, argsData);
        textCollection = argsData.text;
        if (!argsData.cancel) {
            this.text  = [].concat(argsData.text);
            if (this.control.type === 'Linear') {
                const linearEndPointX: number = (this.control.linear.linearProgressWidth - padding / 2 + (this.control.progressRect.x));
                const linearEndPointY: number = (this.control.cornerRadius === 'Round4px')  ?  (this.control.progressRect.y + padding) : (this.control.progressRect.y + (this.control.progressRect.height / 2)) -
                (this.control.progressThickness ? this.control.progressThickness : this.control.themeStyle.linearProgressThickness) / 2 +
                padding;
                this.createTooltip(this.control, isFirst, (this.control.tooltip.enable && !this.control.tooltip.showTooltipOnHover || !((e.target as Element).id.indexOf('Linearbuffer') >= 0)) ? (new ProgressLocation((this.control.cornerRadius === 'Round4px') ? linearEndPointX - padding : linearEndPointX, linearEndPointY)) : (new ProgressLocation(this.control.linear.bufferWidth - (padding / 2) + (this.control.progressRect.x), linearEndPointY)), this.control.initialClipRect);
            }
            else {
                const circularEndPointX: number = this.control.circular.endPosition.x - padding / 2;
                const circularEndPointY: number =  this.control.circular.endPosition.y + this.control.progressRect.y - padding / 2;
                this.createTooltip(this.control, isFirst, (this.control.tooltip.enable && !this.control.tooltip.showTooltipOnHover || !((e.target as Element).id.indexOf('Circularbuffer') >= 0)) ? (new ProgressLocation(circularEndPointX, circularEndPointY)) : (new ProgressLocation(this.control.circular.bufferEndPosition.x - padding / 2, this.control.circular.bufferEndPosition.y  + this.control.progressRect.y - padding / 2)), this.control.initialClipRect);
            }
        }
        this.isRendered = true;
    }

    /**
     * Function to pass arguments into svg tooltip.
     */

    private createTooltip(
        chart: ProgressBar, isFirst: boolean, location: ProgressLocation, bounds: ProgressLocation): void {
        if (isFirst) {
            this.svgTooltip = new SVGTooltip(
                {
                    opacity: this.control.tooltip.textStyle.opacity ? this.control.tooltip.textStyle.opacity : ((this.control.theme === 'Material3' || this.control.theme === 'Material3Dark') ? 1 : 0.75),
                    header: '',
                    content: this.text,
                    fill: this.control.tooltip.fill,
                    border: this.control.tooltip.border,
                    enableAnimation: true,
                    location: location,
                    theme: this.control.theme,
                    areaBounds: bounds,
                    template: null,
                    // To set tooltip location.
                    offset: 7.5,
                    // To set left and right margin of tooltip.
                    marginX: 8,
                    // To set top margin of tooltip.
                    marginY: 4.5,
                    textStyle: this.control.tooltip.textStyle,
                    arrowPadding: 7,
                    availableSize: this.control.progressSize,
                    duration: 300,
                    blazorTemplate: { name: 'Template', parent: this.control.tooltip },
                    controlInstance: this.control,
                    enableRTL: chart.enableRtl,
                    controlName: 'Progressbar'
                },
                '#' + this.control.element.id + '_tooltip');
        } else {
            if (this.svgTooltip) {
                this.svgTooltip.location = location;
                this.svgTooltip.content = this.text;
                this.svgTooltip.header = '';
                this.svgTooltip.offset = 7.5;
                this.svgTooltip.textStyle = this.control.tooltip.textStyle;
                this.svgTooltip.areaBounds = bounds;
                this.svgTooltip.arrowPadding = 7;
                this.svgTooltip.dataBind();
            }
        }
    }

    /**
     * Get module name.
     */

    protected getModuleName(): string {
        return 'ProgressTooltip';
    }

    /**
     * To destroy the annotation.
     *
     * @returns {void}
     * @private
     */
    public destroy(): void {
    // Destroy method performed here
    }
}
