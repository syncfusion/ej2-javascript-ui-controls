import { isNullOrUndefined as NOU, BlazorDotnetObject, formatUnit, EventHandler, attributes, closest } from '@syncfusion/ej2-base';
import { Touch, TapEventArgs, Browser, Animation as PopupAnimation, getAttributeOrDefault } from '@syncfusion/ej2-base';
import { addClass, BaseEventArgs, setStyleAttribute, removeClass, ChildProperty } from '@syncfusion/ej2-base';
import { Popup } from '../src/popup/popup';
import { OffsetPosition, calculatePosition } from '../src/common/position';
import { isCollide, fit } from '../src/common/collision';

export type OpenMode = 'Auto' | 'Hover' | 'Click' | 'Focus' | 'Custom';
export type Position = 'TopLeft' | 'TopCenter' | 'TopRight' | 'BottomLeft' | 'BottomCenter' | 'BottomRight' |
    'LeftTop' | 'LeftCenter' | 'LeftBottom' | 'RightTop' | 'RightCenter' | 'RightBottom';
export type TipPointerPosition = 'Auto' | 'Start' | 'Middle' | 'End';
export type Effect = 'FadeIn' | 'FadeOut' | 'FadeZoomIn' | 'FadeZoomOut' | 'FlipXDownIn' | 'FlipXDownOut' |
    'FlipXUpIn' | 'FlipXUpOut' | 'FlipYLeftIn' | 'FlipYLeftOut' | 'FlipYRightIn' | 'FlipYRightOut' | 'ZoomIn' | 'ZoomOut' | 'None';

const TAPHOLD_THRESHOLD: number = 500;
const SHOW_POINTER_TIP_GAP: number = 0;
const HIDE_POINTER_TIP_GAP: number = 8;
const MOUSE_TRAIL_GAP: number = 2;
const POINTER_ADJUST: number = 2;
const ROOT: string = 'e-tooltip';
const TOOLTIP_WRAP: string = 'e-tooltip-wrap';
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
const HIDDDEN: string = 'e-hidden';
const BIGGER: string = 'e-bigger';
const RIGHT: string = 'Right';
const BOTTOM: string = 'Bottom';
const TOP: string = 'Top';
const LEFT: string = 'Left';
const CENTER: string = 'Center';
const END: string = 'End';
const START: string = 'Start';
const TOPLEFT: string = 'TopLeft';
const TOPRIGHT: string = 'TopRight';
const BOTTOMLEFT: string = 'BottomLeft';
const BOTTOMCENTER: string = 'BottomCenter';
const BOTTOMRIGHT: string = 'BottomRight';
const LEFTTOP: string = 'LeftTop';
const LEFTCENTER: string = 'LeftCenter';
const LEFTBOTTOM: string = 'LeftBottom';
const RIGHTTOP: string = 'RightTop';
const RIGHTCENTER: string = 'RightCenter';
const RIGHTBOTTOM: string = 'RightBottom';
const PLACEHOLDER: string = '_content_placeholder';
const CONTENT: string = '_content';
const TIPCONTENT: string = 'e-tip-content';
class SfTooltip {
    public popupObj: Popup = null;
    public element: BlazorTooltipElement;
    public dotnetRef: BlazorDotnetObject;
    public properties: InitProps;
    public isPositionUpdate: boolean = false;
    public isOffsetXUpdate: boolean = false;
    public isOffsetYUpdate: boolean = false;
    public tipClass: string = TIP_BOTTOM;
    public tooltipPositionX: string = 'Center';
    public tooltipPositionY: string = 'Top';
    public isContiniousOpen: boolean = false;
    public isRestrictUpdate: boolean = false;
    public tooltipEle: HTMLElement;
    public beforeCloseTarget: HTMLElement;
    public touchModule: Touch;
    public contentTargetValue: HTMLElement = null;
    public contentEvent: Event = null;
    public contentAnimation: TooltipAnimationSettings = null;
    public beforeCloseAnimation: TooltipAnimationSettings = null;
    public ctrlId: string;
    public tooltipEventArgs: TooltipEventArgs;
    constructor(element: BlazorTooltipElement, ref: BlazorDotnetObject, properties: InitProps, eventList: EventList) {
        this.element = element;
        this.ctrlId = this.element.id;
        this.properties = properties;
        this.dotnetRef = ref;
        this.element.blazor__instance = this;
        this.element.eventList = eventList;
    }
    private getTriggerList(trigger: string): string[] {
        if (trigger === 'Auto') {
            trigger = (Browser.isDevice) ? 'Hover' : 'Hover Focus';
        }
        return trigger.split(' ');
    }
    public formatPosition(): void {
        if (this.properties.position.indexOf('Top') === 0 || this.properties.position.indexOf('Bottom') === 0) {
            [this.tooltipPositionY, this.tooltipPositionX] = this.properties.position.split(/(?=[A-Z])/);
        } else {
            [this.tooltipPositionX, this.tooltipPositionY] = this.properties.position.split(/(?=[A-Z])/);
        }
    }
    public wireEvents(trigger: string): void {
        let triggerList: string[] = this.getTriggerList(trigger);
        for (let opensOn of triggerList) {
            if (opensOn === 'Custom') { return; }
            if (opensOn === 'Focus') { this.wireFocusEvents(); }
            if (opensOn === 'Click') { EventHandler.add(this.element, Browser.touchStartEvent, this.targetClick, this); }
            if (opensOn === 'Hover') {
                if (Browser.isDevice) {
                    this.touchModule = new Touch(this.element, {
                        tapHoldThreshold: TAPHOLD_THRESHOLD,
                        tapHold: this.tapHoldHandler.bind(this)
                    });
                    EventHandler.add(this.element, Browser.touchEndEvent, this.touchEndHandler, this);
                } else {
                    EventHandler.add(this.element, 'mouseover', this.targetHover, this);
                    if (!this.properties.isSticky) { EventHandler.add(this.element, 'mouseleave', this.onMouseOut, this); }
                }
            }
        }
        EventHandler.add(document, 'touchend', this.touchEnd, this);
        EventHandler.add(document, 'scroll wheel', this.scrollHandler, this);
        EventHandler.add(document, 'keydown', this.keyDown, this);
        window.addEventListener('resize', this.onWindowResize.bind(this));
    }
    private onWindowResize(): void {
        if (!this.isHidden()) { this.reposition(this.findTarget()); }
    }
    private wireFocusEvents(): void {
        if (!NOU(this.properties.target)) {
            let targetList: Element[] = [].slice.call(this.element.querySelectorAll(this.properties.target));
            for (let target of targetList) {
                EventHandler.add(target, 'focus', this.targetHover, this);
            }
        } else {
            EventHandler.add(this.element, 'focus', this.targetHover, this);
        }
    }
    private wireMouseEvents(e: Event, target: Element): void {
        if (this.tooltipEle) {
            if (!this.properties.isSticky) {
                if (e.type === 'focus') {
                    EventHandler.add(target, 'blur', this.onMouseOut, this);
                }
            }
            if (this.properties.mouseTrail) {
                EventHandler.add(target, 'mousemove touchstart mouseenter', this.onMouseMove, this);
            }
        }
    }
    public unwireEvents(trigger: string): void {
        let triggerList: string[] = this.getTriggerList(trigger);
        for (let opensOn of triggerList) {
            if (opensOn === 'Custom') { return; }
            if (opensOn === 'Focus') {
                this.unwireFocusEvents();
            }
            if (opensOn === 'Click') {
                EventHandler.remove(this.element, Browser.touchStartEvent, this.targetClick);
            }
            if (opensOn === 'Hover') {
                if (Browser.isDevice) {
                    if (this.touchModule) { this.touchModule.destroy(); }
                    EventHandler.remove(this.element, Browser.touchEndEvent, this.touchEndHandler);
                } else {
                    EventHandler.remove(this.element, 'mouseover', this.targetHover);
                    if (!this.properties.isSticky) { EventHandler.remove(this.element, 'mouseleave', this.onMouseOut); }
                }
            }
        }
        EventHandler.remove(document, 'touchend', this.touchEnd);
        EventHandler.remove(document, 'scroll wheel', this.scrollHandler);
        EventHandler.remove(document, 'keydown', this.keyDown);
        window.removeEventListener('resize', this.onWindowResize.bind(this));
    }
    private unwireFocusEvents(): void {
        if (!NOU(this.properties.target)) {
            let targetList: Element[] = [].slice.call(this.element.querySelectorAll(this.properties.target));
            for (let target of targetList) {
                EventHandler.remove(target, 'focus', this.targetHover);
            }
        } else {
            EventHandler.remove(this.element, 'focus', this.targetHover);
        }
    }
    private unwireMouseEvents(target: Element): void {
        if (!this.properties.isSticky) {
            let triggerList: string[] = this.getTriggerList(this.properties.opensOn);
            for (let opensOn of triggerList) {
                if (opensOn === 'Focus') {
                    EventHandler.remove(target, 'blur', this.onMouseOut);
                }
            }
        }
        if (this.properties.mouseTrail) {
            EventHandler.remove(target, 'mousemove touchstart mouseenter', this.onMouseMove);
        }
    }
    public findTarget(): HTMLElement {
        return document.querySelector('[data-tooltip-id= ' + this.ctrlId + '_content]') as HTMLElement;
    }
    private addDescribedBy(target: HTMLElement, id: string): void {
        let describedby: string[] = (getAttributeOrDefault(target, 'aria-describedby', null) || '').split(/\s+/);
        if (describedby.indexOf(id) < 0) { describedby.push(id); }
        attributes(target, { 'aria-describedby': describedby.join(' ').trim(), 'data-tooltip-id': id });
    }
    private removeDescribedBy(target: HTMLElement): void {
        let id: string = getAttributeOrDefault(target, 'data-tooltip-id', null);
        let describedby: string[] = (getAttributeOrDefault(target, 'aria-describedby', null) || '').split(/\s+/);
        let index: number = describedby.indexOf(id);
        if (index !== -1) { describedby.splice(index, 1); }
        target.removeAttribute('data-tooltip-id');
        let orgdescribedby: string = describedby.join(' ').trim();
        orgdescribedby ? attributes(target, { 'aria-describedby': orgdescribedby }) : target.removeAttribute('aria-describedby');
    }
    private clear(): void {
        if (this.tooltipEle) {
            removeClass([this.tooltipEle], POPUP_CLOSE);
            addClass([this.tooltipEle], POPUP_OPEN);
        }
        if (this.isHidden()) {
            if (this.popupObj) { this.popupObj.destroy(); }
            if (this.tooltipEle) {
                setStyleAttribute(this.tooltipEle, { 'display': 'none' });
                let contentElement: HTMLElement = document.getElementById(this.ctrlId + PLACEHOLDER);
                if (contentElement) {
                    contentElement.appendChild(this.tooltipEle);
                }
                this.dotnetRef.invokeMethodAsync('CreateTooltip', JSON.stringify(false));
            }
            this.tooltipEle = null;
            this.popupObj = null;
        }
    }
    private tapHoldHandler(evt: TapEventArgs): void {
        this.targetHover(evt.originalEvent as Event);
    }
    private touchEndHandler(e: TouchEvent): void {
        if (!this.properties.isSticky) { this.hideTooltip(this.properties.animation.close); }
    }
    private targetClick(e: Event): void {
        let target: HTMLElement = this.properties.target ? closest(e.target as HTMLElement, this.properties.target) as HTMLElement :
            this.element;
        if (!NOU(target)) {
            if (getAttributeOrDefault(target, 'data-tooltip-id', null) === null) {
                this.targetHover(e);
            } else if (!this.properties.isSticky) {
                this.hideTooltip(this.properties.animation.close, e, target);
            }
        }
    }
    private restoreElement(target: HTMLElement): void {
        this.unwireMouseEvents(target);
        if (!NOU(getAttributeOrDefault(target, 'data-content', null))) {
            attributes(target, { 'title': getAttributeOrDefault(target, 'data-content', null) });
            target.removeAttribute('data-content');
        }
        this.removeDescribedBy(target);
    }
    private targetHover(e: Event): void {
        let target: HTMLElement = this.properties.target ? closest(e.target as HTMLElement, this.properties.target) as HTMLElement :
            this.element;
        if (NOU(target) || getAttributeOrDefault(target, 'data-tooltip-id', null) !== null) { return; }
        let targetList: Element[] = [].slice.call(document.querySelectorAll('[data-tooltip-id= ' + this.ctrlId + '_content]'));
        for (let target of targetList) {
            this.restoreElement(target as HTMLElement);
        }
        this.showTooltip(target, this.properties.animation.open, e);
    }
    public isHidden(): boolean {
        return this.tooltipEle ? this.tooltipEle.classList.contains(POPUP_OPEN) : true;
    }
    public showTooltip(target: HTMLElement, showAnimation: TooltipAnimationSettings, e?: Event): void {
        this.isContiniousOpen = !NOU(this.tooltipEle);
        this.tooltipEventArgs = {
            type: e ? e.type.toString() : null, cancel: false, target: this.getDomObject('target', target), event: e ? e : null,
            element: this.getDomObject('tooltipElement', this.tooltipEle), isInteracted: !NOU(e), name: 'beforeRender'
        };
        this.contentTargetValue = target; this.contentEvent = e; this.contentAnimation = showAnimation;
        this.isRestrictUpdate = this.element.eventList.beforeRender && !this.isHidden();
        this.element.eventList.beforeRender ? this.triggerEvent('TriggerBeforeRenderEvent', this.tooltipEventArgs) :
            this.beforeRenderCallBack(false);
    }
    private triggerEvent(eventName: string, args: TooltipEventArgs): void {
        this.dotnetRef.invokeMethodAsync(eventName, JSON.stringify(args));
    }
    public beforeRenderCallBack(cancel: boolean): void {
        if (cancel) {
            this.clear();
        } else {
            if (NOU(this.tooltipEle)) {
                this.dotnetRef.invokeMethodAsync('CreateTooltip', JSON.stringify(true));
            } else if (this.isContiniousOpen && !this.isRestrictUpdate) {
                this.contentUpdated();
            } else {
                this.isRestrictUpdate = false;
            }
        }
    }
    private checkCollision(target: HTMLElement, x: number, y: number): ElementPosition {
        let elePos: ElementPosition = {
            left: x, top: y, position: this.properties.position as Position,
            horizontal: this.tooltipPositionX, vertical: this.tooltipPositionY
        };
        let affectedPos: string[] = isCollide(this.tooltipEle, (this.properties.target ? this.element : null), x, y);
        if (affectedPos.length > 0) {
            elePos.horizontal = affectedPos.indexOf('left') >= 0 ? RIGHT : affectedPos.indexOf('right') >= 0 ? LEFT :
                this.tooltipPositionX;
            elePos.vertical = affectedPos.indexOf('top') >= 0 ? BOTTOM : affectedPos.indexOf('bottom') >= 0 ? TOP :
                this.tooltipPositionY;
        }
        return elePos;
    }
    private collisionFlipFit(target: HTMLElement, x: number, y: number): OffsetPosition {
        let elePos: ElementPosition = this.checkCollision(target, x, y);
        let newpos: Position = elePos.position;
        if (this.tooltipPositionY !== elePos.vertical) {
            newpos = ((this.properties.position.indexOf(BOTTOM) === 0 || this.properties.position.indexOf('Top') === 0) ?
                elePos.vertical + this.tooltipPositionX : this.tooltipPositionX + elePos.vertical) as Position;
        }
        if (this.tooltipPositionX !== elePos.horizontal) {
            if (newpos.indexOf(LEFT) === 0) {
                elePos.vertical = (newpos === LEFTTOP || newpos === LEFTCENTER) ? TOP : BOTTOM;
                newpos = (elePos.vertical + LEFT) as Position;
            }
            if (newpos.indexOf(RIGHT) === 0) {
                elePos.vertical = (newpos === RIGHTTOP || newpos === RIGHTCENTER) ? TOP : BOTTOM;
                newpos = (elePos.vertical + RIGHT) as Position;
            }
            elePos.horizontal = this.tooltipPositionX;
        }
        this.tooltipEventArgs = {
            type: null, cancel: false, target: this.getDomObject('target', target), event: null, isInteracted: false,
            element: this.getDomObject('tooltipElement', this.tooltipEle), collidedPosition: newpos, name: 'beforeCollision'
        };
        this.isRestrictUpdate = this.element.eventList.beforeCollision && !this.isHidden();
        if (this.element.eventList.beforeCollision) { this.triggerEvent('TriggerBeforeCollisionEvent', this.tooltipEventArgs); }
        if (elePos.position !== newpos) {
            let pos: OffsetPosition = calculatePosition(target, elePos.horizontal, elePos.vertical);
            this.adjustArrow(target, newpos, elePos.horizontal, elePos.vertical);
            let offsetPos: OffsetPosition = this.calculateTooltipOffset(newpos);
            offsetPos.top -= (('TopBottom'.indexOf(this.properties.position.split(/(?=[A-Z])/)[0]) !== -1) &&
                ('TopBottom'.indexOf(newpos.split(/(?=[A-Z])/)[0]) !== -1)) ? (2 * this.properties.offsetY) : 0;
            offsetPos.left -= (('RightLeft'.indexOf(this.properties.position.split(/(?=[A-Z])/)[0]) !== -1) &&
                ('RightLeft'.indexOf(newpos.split(/(?=[A-Z])/)[0]) !== -1)) ? (2 * this.properties.offsetX) : 0;
            elePos.position = newpos;
            elePos.left = pos.left + offsetPos.left;
            elePos.top = pos.top + offsetPos.top;
        } else {
            this.adjustArrow(target, newpos, elePos.horizontal, elePos.vertical);
        }
        let eleOffset: OffsetPosition = { left: elePos.left, top: elePos.top };
        let left: number = fit(this.tooltipEle, (this.properties.target ? this.element : null), { X: true, Y: false }, eleOffset).left;
        setStyleAttribute(this.tooltipEle, { 'display': 'block' });
        if (this.properties.showTipPointer && (newpos.indexOf('Bottom') === 0 || newpos.indexOf('Top') === 0)) {
            let arrowEle: HTMLElement = this.tooltipEle.querySelector('.' + ARROW_TIP) as HTMLElement;
            let arrowleft: number = parseInt(arrowEle.style.left, 10) - (left - elePos.left);
            if (arrowleft < 0) {
                arrowleft = 0;
            } else if ((arrowleft + arrowEle.offsetWidth) > this.tooltipEle.clientWidth) {
                arrowleft = this.tooltipEle.clientWidth - arrowEle.offsetWidth;
            }
            setStyleAttribute(arrowEle, { 'left': (arrowleft.toString() + 'px') });
        }
        setStyleAttribute(this.tooltipEle, { 'display': '' });
        eleOffset.left = left;
        return eleOffset;
    }

    public hideTooltip(hideAnimation: TooltipAnimationSettings, e?: Event, targetElement?: HTMLElement): void {
        let target: HTMLElement;
        if (e) {
            target = this.properties.target ? (targetElement || e.target as HTMLElement) : this.element;
        } else {
            target = document.querySelector('[data-tooltip-id= ' + this.ctrlId + '_content]') as HTMLElement;
        }
        this.tooltipEventArgs = {
            type: e ? e.type.toString() : null, cancel: false, target: this.getDomObject('target', target), event: e ? e : null,
            element: this.getDomObject('tooltipElement', this.tooltipEle), isInteracted: !NOU(e), name: 'beforeClose',
            collidedPosition: null
        };
        this.beforeCloseTarget = target; this.beforeCloseAnimation = hideAnimation;
        this.isRestrictUpdate = this.element.eventList.beforeClose && !this.isHidden();
        this.element.eventList.beforeClose ? this.triggerEvent('TriggerBeforeCloseEvent', this.tooltipEventArgs) :
            this.beforeCloseCallBack(false);
    }
    public beforeCloseCallBack(cancel: boolean): void {
        if (!cancel) { this.popupHide(this.beforeCloseAnimation, this.beforeCloseTarget); }
    }
    private popupHide(hideAnimation: TooltipAnimationSettings, target: HTMLElement): void {
        if (target) { this.restoreElement(target); }
        let closeAnimation: Object = {
            name: hideAnimation.effect,
            duration: hideAnimation.duration,
            delay: hideAnimation.delay,
            timingFunction: 'easeIn'
        };
        if (hideAnimation.effect === 'None') {
            closeAnimation = undefined;
        }
        if (this.properties.closeDelay > 0) {
            let hide: Function = (): void => {
                if (this.popupObj) { this.popupObj.hide(closeAnimation); }
            };
            setTimeout(hide, this.properties.closeDelay);
        } else {
            if (this.popupObj) { this.popupObj.hide(closeAnimation); }
        }
    }
    private calculateTooltipOffset(position: Position): OffsetPosition {
        let pos: OffsetPosition = { top: 0, left: 0 };
        let tooltipEleWidth: number = this.tooltipEle.offsetWidth;
        let tooltipEleHeight: number = this.tooltipEle.offsetHeight;
        let arrowEle: HTMLElement = this.tooltipEle.querySelector('.' + ARROW_TIP) as HTMLElement;
        let tipWidth: number = arrowEle ? arrowEle.offsetWidth : 0;
        let tipHeight: number = arrowEle ? arrowEle.offsetHeight : 0;
        let tipAdjust: number = (this.properties.showTipPointer ? SHOW_POINTER_TIP_GAP : HIDE_POINTER_TIP_GAP);
        let tipHeightAdjust: number = (tipHeight / 2) + POINTER_ADJUST + (this.tooltipEle.offsetHeight - this.tooltipEle.clientHeight);
        let tipWidthAdjust: number = (tipWidth / 2) + POINTER_ADJUST + (this.tooltipEle.offsetWidth - this.tooltipEle.clientWidth);
        if (this.properties.mouseTrail) {
            tipAdjust += MOUSE_TRAIL_GAP;
        }
        switch (position) {
            case RIGHTTOP:
                pos.left += tipWidth + tipAdjust;
                pos.top -= tooltipEleHeight - tipHeightAdjust;
                break;
            case RIGHTCENTER:
                pos.left += tipWidth + tipAdjust;
                pos.top -= (tooltipEleHeight / 2);
                break;
            case RIGHTBOTTOM:
                pos.left += tipWidth + tipAdjust;
                pos.top -= (tipHeightAdjust);
                break;
            case BOTTOMRIGHT:
                pos.top += (tipHeight + tipAdjust);
                pos.left -= (tipWidthAdjust);
                break;
            case BOTTOMCENTER:
                pos.top += (tipHeight + tipAdjust);
                pos.left -= (tooltipEleWidth / 2);
                break;
            case BOTTOMLEFT:
                pos.top += (tipHeight + tipAdjust);
                pos.left -= (tooltipEleWidth - tipWidthAdjust);
                break;
            case LEFTBOTTOM:
                pos.left -= (tipWidth + tooltipEleWidth + tipAdjust);
                pos.top -= (tipHeightAdjust);
                break;
            case LEFTCENTER:
                pos.left -= (tipWidth + tooltipEleWidth + tipAdjust);
                pos.top -= (tooltipEleHeight / 2);
                break;
            case LEFTTOP:
                pos.left -= (tipWidth + tooltipEleWidth + tipAdjust);
                pos.top -= (tooltipEleHeight - tipHeightAdjust);
                break;
            case TOPLEFT:
                pos.top -= (tooltipEleHeight + tipHeight + tipAdjust);
                pos.left -= (tooltipEleWidth - tipWidthAdjust);
                break;
            case TOPRIGHT:
                pos.top -= (tooltipEleHeight + tipHeight + tipAdjust);
                pos.left -= (tipWidthAdjust);
                break;
            default:
                pos.top -= (tooltipEleHeight + tipHeight + tipAdjust);
                pos.left -= (tooltipEleWidth / 2);
                break;
        }
        pos.left += this.properties.offsetX; pos.top += this.properties.offsetY;
        return pos;
    }
    public setTipClass(position: Position): void {
        if (position.indexOf(RIGHT) === 0) {
            this.tipClass = TIP_LEFT;
        } else if (position.indexOf(BOTTOM) === 0) {
            this.tipClass = TIP_TOP;
        } else if (position.indexOf(LEFT) === 0) {
            this.tipClass = TIP_RIGHT;
        } else {
            this.tipClass = TIP_BOTTOM;
        }
    }
    private updateTipPosition(position: Position): void {
        let selEle: NodeList = this.tooltipEle.querySelectorAll('.' + ARROW_TIP + ',.' + ARROW_TIP_OUTER + ',.' + ARROW_TIP_INNER);
        let removeList: string[] = [TIP_BOTTOM, TIP_TOP, TIP_LEFT, TIP_RIGHT];
        removeClass(selEle, removeList);
        this.setTipClass(position);
        addClass(selEle, this.tipClass);
    }
    private adjustArrow(target: HTMLElement, position: Position, tooltipPositionX: string, tooltipPositionY: string): void {
        if (this.properties.showTipPointer === false) { return; }
        this.updateTipPosition(position);
        let leftValue: string; let topValue: string;
        setStyleAttribute(this.tooltipEle, { 'display': 'block' });
        let tooltipWidth: number = this.tooltipEle.clientWidth; let tooltipHeight: number = this.tooltipEle.clientHeight;
        let arrowEle: HTMLElement = this.tooltipEle.querySelector('.' + ARROW_TIP) as HTMLElement;
        let arrowInnerELe: HTMLElement = this.tooltipEle.querySelector('.' + ARROW_TIP_INNER) as HTMLElement;
        let tipWidth: number = arrowEle.offsetWidth; let tipHeight: number = arrowEle.offsetHeight;
        setStyleAttribute(this.tooltipEle, { 'display': '' });
        if (this.tipClass === TIP_BOTTOM || this.tipClass === TIP_TOP) {
            if (this.tipClass === TIP_BOTTOM) {
                topValue = '99.9%';
                setStyleAttribute(arrowInnerELe, { 'top': ('-' + (tipHeight - 2) + 'px') });
            } else {
                topValue = -(tipHeight - 1) + 'px';
                setStyleAttribute(arrowInnerELe, { 'top': ('-' + (tipHeight - 6) + 'px') });
            }
            if (target) {
                let tipPosExclude: boolean = tooltipPositionX !== 'Center' || (tooltipWidth > target.offsetWidth) ||
                    this.properties.mouseTrail;
                if ((tipPosExclude && tooltipPositionX === 'Left') || (!tipPosExclude && this.properties.tipPointerPosition === END)) {
                    leftValue = (tooltipWidth - tipWidth - POINTER_ADJUST) + 'px';
                } else if ((tipPosExclude && tooltipPositionX === 'Right') ||
                    (!tipPosExclude && this.properties.tipPointerPosition === START)) {
                    leftValue = POINTER_ADJUST + 'px';
                } else {
                    leftValue = ((tooltipWidth / 2) - (tipWidth / 2)) + 'px';
                }
            }
        } else {
            if (this.tipClass === TIP_RIGHT) {
                leftValue = '99.9%';
                setStyleAttribute(arrowInnerELe, { 'left': ('-' + (tipWidth - 2) + 'px') });
            } else {
                leftValue = -(tipWidth - 1) + 'px';
                setStyleAttribute(arrowInnerELe, { 'left': ((-(tipWidth) + (tipWidth - 2)) + 'px') });
            }
            let tipPosExclude: boolean = tooltipPositionY !== CENTER || (tooltipHeight > target.offsetHeight) || this.properties.mouseTrail;
            if ((tipPosExclude && tooltipPositionY === TOP) || (!tipPosExclude && this.properties.tipPointerPosition === END)) {
                topValue = (tooltipHeight - tipHeight - POINTER_ADJUST) + 'px';
            } else if ((tipPosExclude && tooltipPositionY === BOTTOM) || (!tipPosExclude && this.properties.tipPointerPosition === START)) {
                topValue = POINTER_ADJUST + 'px';
            } else {
                topValue = ((tooltipHeight / 2) - (tipHeight / 2)) + 'px';
            }
        }
        setStyleAttribute(arrowEle, { 'top': topValue, 'left': leftValue });
    }

    private onMouseOut(e: Event): void {
        const enteredElement: EventTarget = (e as MouseEvent).relatedTarget;
        if (enteredElement && !this.properties.mouseTrail) {
            const checkForTooltipElement: Element = closest(
                enteredElement as HTMLElement,
                `.${TOOLTIP_WRAP}.${POPUP_LIB}.${POPUP_ROOT}`);
            if (checkForTooltipElement) {
                EventHandler.add(checkForTooltipElement, 'mouseleave', this.tooltipElementMouseOut, this);
                this.unwireMouseEvents(e.target as Element);
            } else {
                this.hideTooltip(this.properties.animation.close, e, this.findTarget());
                if (this.properties.closeDelay === 0) { this.clear(); }
            }
        } else {
            this.hideTooltip(this.properties.animation.close, e, this.findTarget());
            this.clear();
        }
    }

    private tooltipElementMouseOut(e: Event): void {
        this.hideTooltip(this.properties.animation.close, e, this.findTarget());
        EventHandler.remove(this.element, 'mouseleave', this.tooltipElementMouseOut);
        this.clear();
    }

    private onMouseMove(event: MouseEvent & TouchEvent): void {
        let eventPageX: number = 0; let eventPageY: number = 0;
        if (event.type.indexOf('touch') > -1) {
            event.preventDefault();
            eventPageX = event.touches[0].pageX;
            eventPageY = event.touches[0].pageY;
        } else {
            eventPageX = event.pageX;
            eventPageY = event.pageY;
        }
        PopupAnimation.stop(this.tooltipEle);
        removeClass([this.tooltipEle], POPUP_CLOSE);
        addClass([this.tooltipEle], POPUP_OPEN);
        this.adjustArrow(event.target as HTMLElement, this.properties.position as Position, this.tooltipPositionX, this.tooltipPositionY);
        let pos: OffsetPosition = this.calculateTooltipOffset(this.properties.position as Position);
        let x: number = eventPageX + pos.left + this.properties.offsetX;
        let y: number = eventPageY + pos.top + this.properties.offsetY;
        let elePos: ElementPosition = this.checkCollision(event.target as HTMLElement, x, y);
        if (this.tooltipPositionX !== elePos.horizontal || this.tooltipPositionY !== elePos.vertical) {
            let newpos: string = (this.properties.position.indexOf(BOTTOM) === 0 || this.properties.position.indexOf(TOP) === 0) ?
                elePos.vertical + elePos.horizontal : elePos.horizontal + elePos.vertical;
            elePos.position = <Position>newpos;
            this.adjustArrow(event.target as HTMLElement, elePos.position, elePos.horizontal, elePos.vertical);
            let colpos: OffsetPosition = this.calculateTooltipOffset(elePos.position);
            elePos.left = eventPageX + colpos.left - this.properties.offsetX;
            elePos.top = eventPageY + colpos.top - this.properties.offsetY;
        }
        setStyleAttribute(this.tooltipEle, { 'left': (elePos.left + 'px'), 'top': (elePos.top + 'px') });
    }
    private keyDown(event: KeyboardEvent): void {
        if (this.tooltipEle && event.keyCode === 27) { this.hideTooltip(this.properties.animation.close); }
    }
    private touchEnd(e: TouchEvent): void {
        if (this.tooltipEle && closest(e.target as HTMLElement, '.' + ROOT) === null) {
            this.hideTooltip(this.properties.animation.close);
        }
    }
    private scrollHandler(e: Event): void {
        if (this.tooltipEle) {
            if (!(closest(e.target as HTMLElement, `.${TOOLTIP_WRAP}.${POPUP_LIB}.${POPUP_ROOT}`))) {
                this.hideTooltip(this.properties.animation.close);
            }
        }
    }
    private renderContent(target?: HTMLElement): void {
        if (target && !NOU(getAttributeOrDefault(target, 'title', null))) {
            attributes(target, { 'data-content': getAttributeOrDefault(target, 'title', null) });
            target.removeAttribute('title');
        }
        if (!this.properties.content) {
            let tooltipContent: HTMLElement = this.tooltipEle.querySelector('.' + TIPCONTENT) as HTMLElement;
            tooltipContent.innerText = target.getAttribute('data-content');
        }
    }
    public setHeigthWidth(widthValue: string, heightValue: string, target: HTMLElement): void {
        if (this.tooltipEle) {
            setStyleAttribute(this.tooltipEle, { 'height': heightValue, 'width': widthValue });
        }
        if (target && this.tooltipEle.style.width !== 'auto') { this.tooltipEle.style.maxWidth = widthValue; }
    }
    public contentUpdated(): void {
        if (NOU(this.tooltipEle)) {
            this.ctrlId = this.element.id;
            this.tooltipEle = document.querySelector('#' + this.ctrlId + CONTENT);
            if (this.tooltipEle) {
                setStyleAttribute(this.tooltipEle, { 'position': 'absolute' });
                this.setHeigthWidth(formatUnit(this.properties.width), formatUnit(this.properties.height), this.contentTargetValue);
                if (this.contentTargetValue) {
                    if (Browser.isDevice) {
                        addClass([this.tooltipEle], BIGGER);
                    }
                    document.body.appendChild(this.tooltipEle);
                    removeClass([this.tooltipEle], HIDDDEN);
                    this.addDescribedBy(this.contentTargetValue, this.ctrlId + CONTENT);
                    this.renderContent(this.contentTargetValue);
                    addClass([this.tooltipEle], POPUP_OPEN);
                    this.renderPopup(this.contentTargetValue);
                    let pos: Position = this.properties.position as Position;
                    this.adjustArrow(this.contentTargetValue, pos, this.tooltipPositionX, this.tooltipPositionY);
                    PopupAnimation.stop(this.tooltipEle);
                    this.reposition(this.contentTargetValue);
                    this.afterContentRender();
                }
            }
        } else {
            if (!this.isContiniousOpen || this.isRestrictUpdate) {
                return;
            }
            addClass([this.tooltipEle], POPUP_OPEN);
            document.body.appendChild(this.tooltipEle);
            this.renderPopup(this.contentTargetValue);
            if (this.contentTargetValue) {
                let pos: Position = this.properties.position as Position;
                this.adjustArrow(this.contentTargetValue, pos, this.tooltipPositionX, this.tooltipPositionY);
                this.addDescribedBy(this.contentTargetValue, this.ctrlId + '_content');
                this.renderContent(this.contentTargetValue);
                PopupAnimation.stop(this.tooltipEle);
                this.reposition(this.contentTargetValue);
                this.afterContentRender();
            }
        }
    }
    protected afterContentRender(): void {
        removeClass([this.tooltipEle], POPUP_OPEN);
        addClass([this.tooltipEle], POPUP_CLOSE);
        this.tooltipEventArgs = {
            type: this.contentEvent ? this.contentEvent.type.toString() : null, isInteracted: !NOU(this.contentEvent),
            target: this.getDomObject('target', this.contentTargetValue), name: 'beforeOpen', cancel: false,
            event: this.contentEvent ? this.contentEvent : null, element: this.getDomObject('tooltipElement', this.tooltipEle),
        };
        this.isRestrictUpdate = this.element.eventList.beforeOpen && !this.isHidden();
        this.element.eventList.beforeOpen ? this.triggerEvent('TriggerBeforeOpenEvent', this.tooltipEventArgs) :
            this.beforeOpenCallBack(false);
    }
    public beforeOpenCallBack(cancel: boolean): void {
        if (cancel) {
            this.clear();
            this.restoreElement(this.contentTargetValue);
        } else {
            let openAnimation: Object = {
                name: this.contentAnimation.effect,
                duration: this.contentAnimation.duration,
                delay: this.contentAnimation.delay,
                timingFunction: 'easeOut'
            };
            if (this.contentAnimation.effect === 'None') {
                openAnimation = undefined;
            }
            if (this.properties.openDelay > 0) {
                let show: Function = (): void => {
                    if (this.popupObj) {
                        this.popupObj.show(openAnimation, this.contentTargetValue);
                    }
                };
                setTimeout(show, this.properties.openDelay);
            } else {
                if (this.popupObj) { this.popupObj.show(openAnimation, this.contentTargetValue); }
            }
        }
        if (this.contentEvent) { this.wireMouseEvents(this.contentEvent, this.contentTargetValue); }
        this.contentTargetValue = this.contentEvent = this.contentAnimation = null;
    }

    public reposition(target: HTMLElement): void {
        if (!this.tooltipEle) { return; }
        let elePos: OffsetPosition = this.getTooltipPosition(target);
        this.popupObj.position = { X: elePos.left, Y: elePos.top };
        this.popupObj.dataBind();
    }
    private renderPopup(target: HTMLElement): void {
        let elePos: OffsetPosition = this.properties.mouseTrail ? { top: 0, left: 0 } : this.getTooltipPosition(target);
        this.tooltipEle.classList.remove(POPUP_LIB);
        this.popupObj = new Popup(this.tooltipEle as HTMLElement, {
            height: this.properties.height,
            width: this.properties.width,
            position: { X: elePos.left, Y: elePos.top },
            enableRtl: this.properties.enableRtl,
            open: this.openPopupHandler.bind(this),
            close: this.closePopupHandler.bind(this)
        });
    }
    private openPopupHandler(): void {
        if (!this.properties.mouseTrail) { this.reposition(this.findTarget()); }
        this.tooltipEventArgs.name = 'Opened';
        this.isRestrictUpdate = this.element.eventList.opened && !this.isHidden();
        if (this.element.eventList.opened) { this.triggerEvent('TriggerOpenedEvent', this.tooltipEventArgs); }
    }
    private closePopupHandler(): void {
        this.clear();
        this.tooltipEventArgs.name = 'Closed';
        this.isRestrictUpdate = this.element.eventList.closed && !this.isHidden();
        if (this.element.eventList.closed) { this.triggerEvent('TriggerClosedEvent', this.tooltipEventArgs); }
    }
    private getTooltipPosition(target: HTMLElement): OffsetPosition {
        setStyleAttribute(this.tooltipEle, { 'display': 'block' });
        let pos: OffsetPosition = calculatePosition(target, this.tooltipPositionX, this.tooltipPositionY);
        let offsetPos: OffsetPosition = this.calculateTooltipOffset(this.properties.position as Position);
        let elePos: OffsetPosition = this.collisionFlipFit(target, pos.left + offsetPos.left, pos.top + offsetPos.top);
        setStyleAttribute(this.tooltipEle, { 'display': '' });
        return elePos;
    }
    private getDomObject(value: string, element: HTMLElement): string {
        // tslint:disable-next-line
        return element ? (<any>window).sfBlazor.getDomObject(value, element) : null;
    }
    public destroy(): void {
        if (this.tooltipEle) {
            let placeholder: HTMLElement = document.querySelector('#' + this.ctrlId + PLACEHOLDER);
            if (placeholder) { placeholder.appendChild(this.tooltipEle); }
        }
        if (this.popupObj) { this.popupObj.destroy(); }
        removeClass([this.element], ROOT);
        this.unwireEvents(this.properties.opensOn);
        this.unwireMouseEvents(this.element);
        this.tooltipEle = null;
        this.popupObj = null;
    }
}
// tslint:disable-next-line
let Tooltip: object = {
    wireEvents(element: BlazorTooltipElement, dotnetRef: BlazorDotnetObject, properties: InitProps, eventList: EventList): void {
        this.updateAnimation(properties.animation);
        new SfTooltip(element, dotnetRef, properties, eventList);
        element.blazor__instance.formatPosition();
        element.blazor__instance.wireEvents(properties.opensOn);
        // tslint:disable-next-line
        (<any>window).sfBlazor.renderComplete(element);
    },
    contentUpdated(element: BlazorTooltipElement): void {
        element.blazor__instance.contentUpdated();
    },
    updateAnimation(animation: Animation): void {
        animation.open.duration = animation.open.duration ? animation.open.duration : undefined;
        animation.close.duration = animation.close.duration ? animation.close.duration : undefined;
    },
    beforeRenderCallBack(element: BlazorTooltipElement, cancel: boolean): void {
        element.blazor__instance.beforeRenderCallBack(cancel);
    },
    beforeOpenCallBack(element: BlazorTooltipElement, cancel: boolean): void {
        element.blazor__instance.beforeOpenCallBack(cancel);
    },
    beforeCloseCallBack(element: BlazorTooltipElement, cancel: boolean): void {
        element.blazor__instance.beforeCloseCallBack(cancel);
    },
    showTooltip(element: BlazorTooltipElement, target: HTMLElement, animation: TooltipAnimationSettings, targetProp: string): void {
        if (targetProp !== null && targetProp !== '' && element.blazor__instance.element.querySelector(targetProp)) {
            target = element.blazor__instance.element.querySelector(targetProp);
        }
        element.blazor__instance.showTooltip(target, animation, null);
    },
    hideTooltip(element: BlazorTooltipElement, animation: TooltipAnimationSettings): void {
        element.blazor__instance.hideTooltip(animation);
    },
    destroy(element: BlazorTooltipElement): void {
        element.blazor__instance.destroy();
    },
    updateProperties(element: BlazorTooltipElement, completeProps: InitProps, props: InitProps): void {
        let blazInstance: SfTooltip = element.blazor__instance;
        let prevBlazProp: InitProps = element.blazor__instance.properties;
        blazInstance.isRestrictUpdate = true;
        if (props.animation) { this.updateAnimation(props.animation); } this.updateAnimation(completeProps.animation);
        if (props.opensOn || !NOU(props.isSticky)) {
            blazInstance.unwireEvents(blazInstance.properties.opensOn);
            blazInstance.properties = completeProps;
            blazInstance.wireEvents(blazInstance.properties.opensOn);
        } else {
            let target: HTMLElement = blazInstance.findTarget();
            if (props.height || props.width) {
                blazInstance.setHeigthWidth(formatUnit(props.width), formatUnit(props.height), target);
            } else if (props.position) {
                blazInstance.isPositionUpdate = true;
            } else if (props.offsetX) {
                blazInstance.isOffsetXUpdate = true;
            } else if (props.offsetX) {
                blazInstance.isOffsetYUpdate = true;
            }
            if (blazInstance.tooltipEle) {
                if (blazInstance.isPositionUpdate) {
                    let arrowInnerELe: HTMLElement = blazInstance.tooltipEle.querySelector('.' + ARROW_TIP_INNER);
                    let arrowEle: HTMLElement = blazInstance.tooltipEle.querySelector('.' + ARROW_TIP);
                    removeClass([arrowEle], [blazInstance.tipClass]);
                    blazInstance.properties = completeProps;
                    blazInstance.formatPosition();
                    blazInstance.setTipClass(props.position as Position);
                    addClass([arrowEle], [blazInstance.tipClass]);
                    setStyleAttribute(arrowInnerELe, { 'top': null, 'left': null });
                }
                if (blazInstance.isOffsetXUpdate) {
                    let value: number = ((parseInt(blazInstance.tooltipEle.style.left, 10) + (props.offsetX - prevBlazProp.offsetX)));
                    setStyleAttribute(blazInstance.tooltipEle, { 'left': value.toString() + 'px' });
                }
                if (blazInstance.isOffsetYUpdate) {
                    let value: number = ((parseInt(blazInstance.tooltipEle.style.top, 10) + (props.offsetY - prevBlazProp.offsetY)));
                    setStyleAttribute(blazInstance.tooltipEle, { 'top': value.toString() + 'px' });
                }
                blazInstance.properties = completeProps;
                blazInstance.reposition(target);
            } else {
                blazInstance.properties = completeProps;
                if (blazInstance.isPositionUpdate) {
                    blazInstance.formatPosition();
                }
            }
            blazInstance.isOffsetYUpdate = false;
            blazInstance.isOffsetXUpdate = false;
            blazInstance.isPositionUpdate = false;
            blazInstance.isRestrictUpdate = false;
        }
    }
};

interface ElementPosition extends OffsetPosition {
    position: Position;
    horizontal: string;
    vertical: string;
}
interface TooltipEventArgs extends BaseEventArgs {
    type: String;
    cancel: boolean;
    event: Event;
    target: HTMLElement | string;
    element: HTMLElement | string;
    collidedPosition?: string;
    isInteracted?: boolean;
}
interface TooltipAnimationSettings {
    effect?: Effect;
    duration?: number;
    delay?: number;
}
interface Animation extends ChildProperty<Animation> {
    open: TooltipAnimationSettings;
    close: TooltipAnimationSettings;
}
interface InitProps {
    target?: string;
    opensOn: string;
    animation: Animation;
    isSticky: boolean;
    mouseTrail: boolean;
    position: string;
    showTipPointer: boolean;
    offsetX: number;
    offsetY: number;
    tipPointerPosition: TipPointerPosition;
    closeDelay: number;
    openDelay: number;
    width: number | string;
    height: number | string;
    enableRtl: boolean;
    content: boolean;
}
interface BlazorTooltipElement extends HTMLElement {
    blazor__instance: SfTooltip;
    eventList: EventList;
}
interface EventList {
    created: boolean;
    beforeRender: boolean;
    beforeCollision: boolean;
    beforeOpen: boolean;
    opened: boolean;
    beforeClose: boolean;
    closed: boolean;
}
export default Tooltip;