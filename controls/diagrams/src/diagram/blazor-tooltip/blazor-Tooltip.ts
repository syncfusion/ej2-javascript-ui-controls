/* eslint-disable valid-jsdoc */
/* eslint-disable jsdoc/require-param */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-types */
import { Property, ChildProperty, Event, BaseEventArgs, append, compile, createElement } from '@syncfusion/ej2-base';
import { Touch, Browser, Animation as tooltipAnimation, AnimationModel as tooltipAnimationModel } from '@syncfusion/ej2-base';
import { isNullOrUndefined, formatUnit } from '@syncfusion/ej2-base';
import { attributes, removeClass, addClass, remove, updateBlazorTemplate } from '@syncfusion/ej2-base';
import { OffsetPosition, calculatePosition } from './position';
import { isCollide, fit } from './collision';
import { Diagram } from '../diagram';
import { Position } from '@syncfusion/ej2-popups';
import { Effect } from '@syncfusion/ej2-base';

/**
 * Applicable tip positions attached to the Tooltip.
 *
 * @private
 */
export type TipPointerPosition = 'Auto' | 'Start' | 'Middle' | 'End';

/**
 * Animation options that are common for both open and close actions of the Tooltip
 *
 *  @private
 */
export class BlazorAnimation extends ChildProperty<BlazorAnimation> {
    /**
     * Animation settings to be applied on the Tooltip, while it is being shown over the target.
     *
     * @ignoreapilink
     */
    @Property<TooltipAnimationSettings>({ effect: 'FadeIn', duration: 150, delay: 0 })
    public open: TooltipAnimationSettings;
    /**
     * Animation settings to be applied on the Tooltip, when it is closed.
     *
     * @ignoreapilink
     */
    @Property<TooltipAnimationSettings>({ effect: 'FadeOut', duration: 150, delay: 0 })
    public close: TooltipAnimationSettings;
}

/**
 * Describes the element positions.
 *
 * @private
 */
interface ElementPosition extends OffsetPosition {
    position: Position;
    horizontal: string;
    vertical: string;
}
/**
 * Interface for Tooltip event arguments.
 *
 * @private
 */
export interface TooltipEventArgs extends BaseEventArgs {
    /**
     * It is used to denote the type of the triggered event.
     */
    type: String;
    /**
     * It illustrates whether the current action needs to be prevented or not.
     */
    cancel: boolean;
    /**
     * It is used to specify the current event object.
     */
    event: Event;
    /**
     * It is used to denote the current target element where the Tooltip is to be displayed.
     */
    target: HTMLElement;
    /**
     * It is used to denote the Tooltip element
     */
    element: HTMLElement;
    /**
     * It is used to denote the Collided Tooltip position
     *
     */
    collidedPosition?: string;
    /**
     * If the event is triggered by interaction, it returns true. Otherwise, it returns false.
     *
     */
    isInteracted?: boolean;

}
/**
 * Animation options that are common for both open and close actions of the Tooltip.
 *
 * @private
 */
export interface TooltipAnimationSettings {
    /**
     * It is used to apply the Animation effect on the Tooltip, during open and close actions.
     */
    effect?: Effect;
    /**
     * It is used to denote the duration of the animation that is completed per animation cycle.
     */
    duration?: number;
    /**
     * It is used to denote the delay value in milliseconds and indicating the waiting time before animation begins.
     */
    delay?: number;
}


const SHOW_POINTER_TIP_GAP: number = 0;
const HIDE_POINTER_TIP_GAP: number = 8;
const POINTER_ADJUST: number = 2;
const ROOT: string = 'e-tooltip';
const RTL: string = 'e-rtl';
const DEVICE: string = 'e-bigger';
const CLOSE: string = 'e-tooltip-close';
const TOOLTIP_WRAP: string = 'e-tooltip-wrap';
const CONTENT: string = 'e-tip-content';
const ARROW_TIP: string = 'e-arrow-tip';
const ARROW_TIP_OUTER: string = 'e-arrow-tip-outer';
const ARROW_TIP_INNER: string = 'e-arrow-tip-inner';
const TIP_BOTTOM: string = 'e-tip-bottom';
const TIP_TOP: string = 'e-tip-top';
const TIP_LEFT: string = 'e-tip-left';
const TIP_RIGHT: string = 'e-tip-right';
const POPUP_ROOT: string = 'e-popup';
const POPUP_OPEN: string = 'e-popup-open';
const POPUP_CLOSE: string = 'e-popup-close';
const POPUP_LIB: string = 'e-lib';
const HIDE_POPUP: string = 'e-hidden';
const CLASSNAMES: ClassList = {
    ROOT: 'e-popup',
    RTL: 'e-rtl',
    OPEN: 'e-popup-open',
    CLOSE: 'e-popup-close'
};
/**
 *  @private
 */
interface ClassList {
    ROOT: string;
    RTL: string;
    OPEN: string;
    CLOSE: string;
}



/**
 *  @private
 */
export class BlazorTooltip {
    private tooltipEle: HTMLElement;
    private ctrlId: string;
    private tipClass: string;
    private tooltipPositionX: string;
    private tooltipPositionY: string;
    private tooltipEventArgs: TooltipEventArgs;
    private isHidden: boolean;
    private showTimer: number;
    private hideTimer: number;

    private tipWidth: number;
    private touchModule: Touch;
    private tipHeight: number;
    private isBlazorTemplate: boolean;
    private isBlazorTooltip: boolean = false;
    private contentEvent: Event = null;
    /** @private */
    public width: string | number = 'auto';
    /** @private */
    public height: string | number = 'auto';
    /** @private */
    public content: string | HTMLElement = '';
    /** @private */
    public target: string = '';
    /** @private */
    public position: Position = 'TopCenter';
    /** @private */
    public offsetX: number = 0;
    /** @private */
    public offsetY: number = 0;
    /** @private */
    public tipPointerPosition: TipPointerPosition = 'Auto';
    /** @private */
    public openDelay: number = 0;
    /** @private */
    public closeDelay: number = 0;
    /** @private */
    public cssClass: string = '';
    /** @private */
    public element: Diagram;
    /** @private */
    public animation: BlazorAnimation;
    /** @private */
    public showTipPointer: boolean;

    constructor(diagram: Diagram) {
        this.element = diagram;
        this.tipClass = TIP_BOTTOM;
        this.tooltipPositionX = 'Center';
        this.tooltipPositionY = 'Top';
        this.isHidden = true;
        this.showTipPointer = true;

    }
    /**
     *  @private
     */
    public open(target: HTMLElement, showAnimation: TooltipAnimationSettings, e?: Event): void {
        if (isNullOrUndefined(this.animation.open)) {
            this.animation.open = this.element.tooltip && this.element.tooltip.animation &&
                this.element.tooltip.animation.open as TooltipAnimationSettings;
        }
        this.showTooltip(target, showAnimation);
    }
    /**
     *  @private
     */
    public updateTooltip(target: HTMLElement): void {
        if (this.tooltipEle) {
            this.addDescribedBy(target, this.ctrlId + '_content');
            this.renderContent(target);
            this.reposition(target);
            this.adjustArrow(target, this.position, this.tooltipPositionX, this.tooltipPositionY);
        }
    }
    private formatPosition(): void {
        if (this.position.indexOf('Top') === 0 || this.position.indexOf('Bottom') === 0) {
            [this.tooltipPositionY, this.tooltipPositionX] = this.position.split(/(?=[A-Z])/);
        } else {
            [this.tooltipPositionX, this.tooltipPositionY] = this.position.split(/(?=[A-Z])/);
        }
    }

    /**
     *  @private
     */
    public destroy(): void {
        //No code
    }
    /**
     *  @private
     */
    public close(): void {
        if (this.tooltipEle) {
            removeClass([this.tooltipEle], POPUP_CLOSE);
            addClass([this.tooltipEle], POPUP_OPEN);
            tooltipAnimation.stop(this.tooltipEle);
            let animationOptions: tooltipAnimationModel;
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            const currentTooltip: BlazorTooltip = this;
            currentTooltip.isHidden = true;
            if (this.animation.close) {
                animationOptions = {
                    name: this.animation.close.effect,
                    duration: this.animation.close.duration || 0,
                    delay: this.animation.close.delay || 0,
                    timingFunction: 'easeOut'
                };
            }
            if (!isNullOrUndefined(animationOptions)) {
                animationOptions.end = () => {
                    if (currentTooltip.isHidden) {
                        remove(currentTooltip.tooltipEle);
                        currentTooltip.tooltipEle = null;
                    }
                };
                new tooltipAnimation(animationOptions).animate(this.tooltipEle);
            } else {
                removeClass([this.tooltipEle], CLASSNAMES.OPEN);
                addClass([this.tooltipEle], CLASSNAMES.CLOSE);
                remove(this.tooltipEle);
                this.tooltipEle = null;

            }

        }
    }
    /**
     *  @private
     */
    public showTooltip(target: HTMLElement, showAnimation: TooltipAnimationSettings, e?: Event): void {
        clearTimeout(this.showTimer);
        clearTimeout(this.hideTimer);
        this.tooltipEventArgs = {
            type: e ? e.type : null, cancel: false, target: target, event: e ? e : null,
            element: this.tooltipEle, isInteracted: !isNullOrUndefined(e)
        };
        const observeCallback: Function = (beforeRenderArgs: TooltipEventArgs) => {
            this.beforeRenderCallback(beforeRenderArgs, target, e, showAnimation);
        };
        this.element.trigger('beforeRender', this.tooltipEventArgs, observeCallback.bind(this));


    }

    private beforeRenderCallback(
        beforeRenderArgs: TooltipEventArgs,
        target: HTMLElement,
        e: Event,
        showAnimation: TooltipAnimationSettings): void {
        this.formatPosition();
        const isBlazorTooltipRendered: boolean = false;
        if (beforeRenderArgs.cancel) {
            this.isHidden = true;
            //  this.clear();
        } else {
            this.isHidden = false;
            if (isNullOrUndefined(this.tooltipEle)) {

                this.ctrlId = this.element.element.id;
                this.tooltipEle = createElement('div', {
                    className: TOOLTIP_WRAP + ' ' + POPUP_ROOT + ' ' + POPUP_LIB, attrs: {
                        role: 'tooltip', 'aria-hidden': 'false', 'id': this.ctrlId + '_content'
                    }, styles: 'width:' +
                        formatUnit(this.width) + ';height:' + formatUnit(this.height) + ';position:absolute; pointer-events:none;'
                });
                this.beforeRenderBlazor(target, this);
                tooltipAnimation.stop(this.tooltipEle);
                this.afterRenderBlazor(target, e, showAnimation, this);
            } else {
                if (target) {
                    this.addDescribedBy(target, this.ctrlId + '_content');
                    this.renderContent(target);
                    tooltipAnimation.stop(this.tooltipEle);
                    this.reposition(target);
                    this.afterRenderBlazor(target, e, showAnimation, this);
                    this.adjustArrow(target, this.position, this.tooltipPositionX, this.tooltipPositionY);

                }
            }
        }
    }
    private afterRenderBlazor(target: HTMLElement, e: Event, showAnimation: TooltipAnimationSettings, ctrlObj: BlazorTooltip): void {
        if (target) {
            removeClass([ctrlObj.tooltipEle], POPUP_OPEN);
            addClass([ctrlObj.tooltipEle], POPUP_CLOSE);
            ctrlObj.tooltipEventArgs = {
                type: e ? e.type : null, cancel: false, target: target, event: e ? e : null,
                element: ctrlObj.tooltipEle, isInteracted: !isNullOrUndefined(e)
            };
            let animation: tooltipAnimationModel;
            if (this.animation.open) {
                animation = {
                    name: this.animation.open.effect,
                    duration: this.animation.open.duration || 0,
                    delay: this.animation.open.delay || 0,
                    timingFunction: 'easeIn'
                };
            }
            if (!isNullOrUndefined(animation)) {
                animation.begin = () => {
                    removeClass([ctrlObj.tooltipEle], CLASSNAMES.CLOSE);
                    addClass([ctrlObj.tooltipEle], CLASSNAMES.OPEN);
                };
                animation.end = () => {
                    this.element.trigger('open');
                };
                new tooltipAnimation(animation).animate(this.tooltipEle);
            } else {
                removeClass([ctrlObj.tooltipEle], POPUP_CLOSE);
                addClass([ctrlObj.tooltipEle], POPUP_OPEN);
            }
        }
    }

    private setTipClass(position: Position): void {
        if (position.indexOf('Right') === 0) {
            this.tipClass = TIP_LEFT;
        } else if (position.indexOf('Bottom') === 0) {
            this.tipClass = TIP_TOP;
        } else if (position.indexOf('Left') === 0) {
            this.tipClass = TIP_RIGHT;
        } else {
            this.tipClass = TIP_BOTTOM;
        }
    }

    private renderArrow(): void {
        this.setTipClass(this.position);
        const tip: HTMLElement = createElement('div', { className: ARROW_TIP + ' ' + this.tipClass });
        tip.appendChild(createElement('div', { className: ARROW_TIP_OUTER + ' ' + this.tipClass }));
        tip.appendChild(createElement('div', { className: ARROW_TIP_INNER + ' ' + this.tipClass }));
        this.tooltipEle.appendChild(tip);
    }
    private getTooltipPosition(target: HTMLElement): OffsetPosition {
        this.tooltipEle.style.display = 'block';
        const pos: OffsetPosition = calculatePosition(target, this.tooltipPositionX, this.tooltipPositionY);
        const offsetPos: OffsetPosition = this.calculateTooltipOffset(this.position);
        const elePos: OffsetPosition = this.collisionFlipFit(target, pos.left + offsetPos.left, pos.top + offsetPos.top);
        this.tooltipEle.style.display = '';
        return elePos;
    }
    private checkCollision(target: HTMLElement, x: number, y: number): ElementPosition {
        const elePos: ElementPosition = {
            left: x, top: y, position: this.position,
            horizontal: this.tooltipPositionX, vertical: this.tooltipPositionY
        };
        const affectedPos: string[] = isCollide(this.tooltipEle, (this.target ? this.element.element : null) as HTMLElement, x, y);
        if (affectedPos.length > 0) {
            elePos.horizontal = affectedPos.indexOf('left') >= 0 ? 'Right' : affectedPos.indexOf('right') >= 0 ? 'Left' :
                this.tooltipPositionX;
            elePos.vertical = affectedPos.indexOf('top') >= 0 ? 'Bottom' : affectedPos.indexOf('bottom') >= 0 ? 'Top' :
                this.tooltipPositionY;
        }
        return elePos;
    }

    private collisionFlipFit(target: HTMLElement, x: number, y: number): OffsetPosition {
        const elePos: ElementPosition = this.checkCollision(target, x, y);
        let newpos: Position = elePos.position;
        if (this.tooltipPositionY !== elePos.vertical) {
            newpos = ((this.position.indexOf('Bottom') === 0 || this.position.indexOf('Top') === 0) ?
                elePos.vertical + this.tooltipPositionX : this.tooltipPositionX + elePos.vertical) as Position;
        }
        if (this.tooltipPositionX !== elePos.horizontal) {
            if (newpos.indexOf('Left') === 0) {
                elePos.vertical = (newpos === 'LeftTop' || newpos === 'LeftCenter') ? 'Top' : 'Bottom';
                newpos = (elePos.vertical + 'Left') as Position;
            }
            if (newpos.indexOf('Right') === 0) {
                elePos.vertical = (newpos === 'RightTop' || newpos === 'RightCenter') ? 'Top' : 'Bottom';
                newpos = (elePos.vertical + 'Right') as Position;
            }
            elePos.horizontal = this.tooltipPositionX;
        }
        this.tooltipEventArgs = {
            type: null, cancel: false, target: target, event: null,
            element: this.tooltipEle, collidedPosition: newpos
        };
        this.element.trigger('beforeCollision', this.tooltipEventArgs);
        if (elePos.position !== newpos) {
            const pos: OffsetPosition = calculatePosition(target, elePos.horizontal, elePos.vertical);
            this.adjustArrow(target, newpos, elePos.horizontal, elePos.vertical);
            const offsetPos: OffsetPosition = this.calculateTooltipOffset(newpos);
            offsetPos.top -= (('TopBottom'.indexOf(this.position.split(/(?=[A-Z])/)[0]) !== -1) &&
                ('TopBottom'.indexOf(newpos.split(/(?=[A-Z])/)[0]) !== -1)) ? (2 * this.offsetY) : 0;
            offsetPos.left -= (('RightLeft'.indexOf(this.position.split(/(?=[A-Z])/)[0]) !== -1) &&
                ('RightLeft'.indexOf(newpos.split(/(?=[A-Z])/)[0]) !== -1)) ? (2 * this.offsetX) : 0;
            elePos.position = newpos;
            elePos.left = pos.left + offsetPos.left;
            elePos.top = pos.top + offsetPos.top;
        } else {
            this.adjustArrow(target, newpos, elePos.horizontal, elePos.vertical);
        }
        const eleOffset: OffsetPosition = { left: elePos.left, top: elePos.top };
        const left: number = fit(
            this.tooltipEle, (this.target ? this.element.element : null) as HTMLElement, { X: true, Y: false }, eleOffset).left;
        this.tooltipEle.style.display = 'block';
        if (this.showTipPointer && (newpos.indexOf('Bottom') === 0 || newpos.indexOf('Top') === 0)) {
            const arrowEle: HTMLElement = this.tooltipEle.querySelector('.' + ARROW_TIP) as HTMLElement;
            let arrowleft: number = parseInt(arrowEle.style.left, 10) - (left - elePos.left);
            if (arrowleft < 0) {
                arrowleft = 0;
            } else if ((arrowleft + arrowEle.offsetWidth) > this.tooltipEle.clientWidth) {
                arrowleft = this.tooltipEle.clientWidth - arrowEle.offsetWidth;
            }
            arrowEle.style.left = arrowleft.toString() + 'px';
        }
        this.tooltipEle.style.display = '';
        eleOffset.left = left;
        return eleOffset;
    }



    private calculateTooltipOffset(position: Position): OffsetPosition {
        const pos: OffsetPosition = { top: 0, left: 0 };
        const tooltipEleWidth: number = this.tooltipEle.offsetWidth;
        const tooltipEleHeight: number = this.tooltipEle.offsetHeight;
        const arrowEle: HTMLElement = this.tooltipEle.querySelector('.' + ARROW_TIP) as HTMLElement;
        const tipWidth: number = arrowEle ? arrowEle.offsetWidth : 0;
        const tipHeight: number = arrowEle ? arrowEle.offsetHeight : 0;
        const tipAdjust: number = (this.showTipPointer ? SHOW_POINTER_TIP_GAP : HIDE_POINTER_TIP_GAP);
        const tipHeightAdjust: number = (tipHeight / 2) + POINTER_ADJUST + (this.tooltipEle.offsetHeight - this.tooltipEle.clientHeight);
        const tipWidthAdjust: number = (tipWidth / 2) + POINTER_ADJUST + (this.tooltipEle.offsetWidth - this.tooltipEle.clientWidth);
        switch (position) {
        case 'RightTop':
            pos.left += tipWidth + tipAdjust;
            pos.top -= tooltipEleHeight - tipHeightAdjust;
            break;
        case 'RightCenter':
            pos.left += tipWidth + tipAdjust;
            pos.top -= (tooltipEleHeight / 2);
            break;
        case 'RightBottom':
            pos.left += tipWidth + tipAdjust;
            pos.top -= (tipHeightAdjust);
            break;
        case 'BottomRight':
            pos.top += (tipHeight + tipAdjust);
            pos.left -= (tipWidthAdjust);
            break;
        case 'BottomCenter':
            pos.top += (tipHeight + tipAdjust);
            pos.left -= (tooltipEleWidth / 2);
            break;
        case 'BottomLeft':
            pos.top += (tipHeight + tipAdjust);
            pos.left -= (tooltipEleWidth - tipWidthAdjust);
            break;
        case 'LeftBottom':
            pos.left -= (tipWidth + tooltipEleWidth + tipAdjust);
            pos.top -= (tipHeightAdjust);
            break;
        case 'LeftCenter':
            pos.left -= (tipWidth + tooltipEleWidth + tipAdjust);
            pos.top -= (tooltipEleHeight / 2);
            break;
        case 'LeftTop':
            pos.left -= (tipWidth + tooltipEleWidth + tipAdjust);
            pos.top -= (tooltipEleHeight - tipHeightAdjust);
            break;
        case 'TopLeft':
            pos.top -= (tooltipEleHeight + tipHeight + tipAdjust);
            pos.left -= (tooltipEleWidth - tipWidthAdjust);
            break;
        case 'TopRight':
            pos.top -= (tooltipEleHeight + tipHeight + tipAdjust);
            pos.left -= (tipWidthAdjust);
            break;
        default:
            pos.top -= (tooltipEleHeight + tipHeight + tipAdjust);
            pos.left -= (tooltipEleWidth / 2);
            break;
        }
        pos.left += this.offsetX;
        pos.top += this.offsetY;
        return pos;
    }

    private reposition(target: HTMLElement): void {
        const elePos: OffsetPosition = this.getTooltipPosition(target);
        this.tooltipEle.style.left = elePos.left + 'px';
        this.tooltipEle.style.top = elePos.top + 'px';
    }

    private beforeRenderBlazor(target: HTMLElement, ctrlObj: BlazorTooltip): void {
        if (target) {
            if (Browser.isDevice) {
                addClass([ctrlObj.tooltipEle], DEVICE);
            }
            if (ctrlObj.width !== 'auto') {
                ctrlObj.tooltipEle.style.maxWidth = formatUnit(ctrlObj.width);
            }
            ctrlObj.tooltipEle.appendChild(createElement('div', { className: CONTENT + ' ' + 'e-diagramTooltip-content' }));
            document.body.appendChild(ctrlObj.tooltipEle);
            addClass([ctrlObj.tooltipEle], POPUP_OPEN);
            removeClass([ctrlObj.tooltipEle], HIDE_POPUP);
            ctrlObj.addDescribedBy(target, ctrlObj.ctrlId + '_content');
            ctrlObj.renderContent(target);
            addClass([ctrlObj.tooltipEle], POPUP_OPEN);
            if (this.showTipPointer) {
                ctrlObj.renderArrow();
            }
            const elePos: OffsetPosition = this.getTooltipPosition(target);
            this.tooltipEle.classList.remove(POPUP_LIB);
            this.tooltipEle.style.left = elePos.left + 'px';
            this.tooltipEle.style.top = elePos.top + 'px';
            ctrlObj.reposition(target);
            ctrlObj.adjustArrow(target, ctrlObj.position, ctrlObj.tooltipPositionX, ctrlObj.tooltipPositionY);


        }
    }

    private addDescribedBy(target: HTMLElement, id: string): void {
        const describedby: string[] = (target.getAttribute('aria-describedby') || '').split(/\s+/);
        if (describedby.indexOf(id) < 0) { describedby.push(id); }
        attributes(target, { 'aria-describedby': describedby.join(' ').trim(), 'data-tooltip-id': id });
    }

    private renderContent(target?: HTMLElement): void {
        const tooltipContent: HTMLElement = this.tooltipEle.querySelector('.' + CONTENT) as HTMLElement;
        if (this.cssClass) {
            addClass([this.tooltipEle], this.cssClass.split(' '));
        }
        if (target && !isNullOrUndefined(target.getAttribute('title'))) {
            target.setAttribute('data-content', target.getAttribute('title'));
            target.removeAttribute('title');
        }
        if (!isNullOrUndefined(this.content)) {
            if (this.isBlazorTooltip || !(false)) {
                tooltipContent.innerHTML = '';
                if (this.content instanceof HTMLElement) {
                    tooltipContent.appendChild(this.content);
                } else if (typeof this.content === 'string' && this.content.indexOf('<div>Blazor') < 0) {
                    tooltipContent.innerHTML = this.content;
                } else {
                    const templateFunction: Function = compile(this.content);
                    append(templateFunction({}, null, null, this.element.element.id + 'content'), tooltipContent);
                    if (typeof this.content === 'string' && this.content.indexOf('<div>Blazor') >= 0) {
                        this.isBlazorTemplate = true;
                        updateBlazorTemplate(this.element.element.id + 'content', 'Content', this);
                    }
                }
            }
        } else {
            if (target && !isNullOrUndefined(target.getAttribute('data-content'))) {
                tooltipContent.innerHTML = target.getAttribute('data-content');
            }
        }
    }

    private updateTipPosition(position: Position): void {
        const selEle: NodeList = this.tooltipEle.querySelectorAll('.' + ARROW_TIP + ',.' + ARROW_TIP_OUTER + ',.' + ARROW_TIP_INNER);
        const removeList: string[] = [TIP_BOTTOM, TIP_TOP, TIP_LEFT, TIP_RIGHT];
        removeClass(selEle, removeList);
        this.setTipClass(position);
        addClass(selEle, this.tipClass);
    }

    private adjustArrow(target: HTMLElement, position: Position, tooltipPositionX: string, tooltipPositionY: string): void {
        if (!this.showTipPointer) { return; }
        this.updateTipPosition(position);
        let leftValue: string; let topValue: string;
        this.tooltipEle.style.display = 'block';
        const tooltipWidth: number = this.tooltipEle.clientWidth; const tooltipHeight: number = this.tooltipEle.clientHeight;
        const arrowEle: HTMLElement = this.tooltipEle.querySelector('.' + ARROW_TIP) as HTMLElement;
        const arrowInnerELe: HTMLElement = this.tooltipEle.querySelector('.' + ARROW_TIP_INNER) as HTMLElement;
        const tipWidth: number = arrowEle.offsetWidth; const tipHeight: number = arrowEle.offsetHeight;
        this.tooltipEle.style.display = '';
        if (this.tipClass === TIP_BOTTOM || this.tipClass === TIP_TOP) {
            if (this.tipClass === TIP_BOTTOM) {
                topValue = '99.9%';
                // Arrow icon aligned -2px height from ArrowOuterTip div
                arrowInnerELe.style.top = '-' + (tipHeight - 2) + 'px';
            } else {
                topValue = -(tipHeight - 1) + 'px';
                // Arrow icon aligned -6px height from ArrowOuterTip div
                arrowInnerELe.style.top = '-' + (tipHeight - 6) + 'px';
            }
            if (target) {
                const tipPosExclude: boolean = tooltipPositionX !== 'Center' || (tooltipWidth > target.offsetWidth);
                if ((tipPosExclude && tooltipPositionX === 'Left') || (!tipPosExclude && this.tipPointerPosition === 'End')) {
                    leftValue = (tooltipWidth - tipWidth - POINTER_ADJUST) + 'px';
                } else if ((tipPosExclude && tooltipPositionX === 'Right') || (!tipPosExclude && this.tipPointerPosition === 'Start')) {
                    leftValue = POINTER_ADJUST + 'px';
                } else {
                    leftValue = ((tooltipWidth / 2) - (tipWidth / 2)) + 'px';
                }
            }
        } else {
            if (this.tipClass === TIP_RIGHT) {
                leftValue = '99.9%';
                // Arrow icon aligned -2px left from ArrowOuterTip div
                arrowInnerELe.style.left = '-' + (tipWidth - 2) + 'px';
            } else {
                leftValue = -(tipWidth - 1) + 'px';
                // Arrow icon aligned -2px from ArrowOuterTip width
                arrowInnerELe.style.left = (-(tipWidth) + (tipWidth - 2)) + 'px';
            }
            const tipPosExclude: boolean = tooltipPositionY !== 'Center' || (tooltipHeight > target.offsetHeight);
            if ((tipPosExclude && tooltipPositionY === 'Top') || (!tipPosExclude && this.tipPointerPosition === 'End')) {
                topValue = (tooltipHeight - tipHeight - POINTER_ADJUST) + 'px';
            } else if ((tipPosExclude && tooltipPositionY === 'Bottom') || (!tipPosExclude && this.tipPointerPosition === 'Start')) {
                topValue = POINTER_ADJUST + 'px';
            } else {
                topValue = ((tooltipHeight / 2) - (tipHeight / 2)) + 'px';
            }
        }
        arrowEle.style.top = topValue;
        arrowEle.style.left = leftValue;
    }

    /**
     * Returns the module name of the blazor tooltip
     *
     * @returns {string}  Returns the module name of the blazor tooltip
     */

    public getModuleName(): string {
        return 'BlazorTooltip';
    }


}
