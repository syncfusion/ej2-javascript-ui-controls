import { setStyleAttribute, addClass, removeClass, ChildProperty, Complex } from '@syncfusion/ej2-base';
import { isNullOrUndefined, formatUnit } from '@syncfusion/ej2-base';
import { Browser } from '@syncfusion/ej2-base';
import { calculatePosition, OffsetPosition, calculateRelativeBasedPosition } from '../common/position';
import { Animation, AnimationModel, Property, Event, EmitType, Component } from '@syncfusion/ej2-base';
import { NotifyPropertyChanges, INotifyPropertyChanged } from '@syncfusion/ej2-base';
import { PopupModel, PositionDataModel } from './popup-model';
import { EventHandler } from '@syncfusion/ej2-base';
import { flip, fit, isCollide , CollisionCoordinates } from '../common/collision';

/**
 * Specifies the offset position values.
 */
export class PositionData extends ChildProperty<PositionData> {
    /**
     * specify the offset left value
     * @blazorType string
     */
    @Property('left')
    public X: string | number;
    /**
     * specify the offset top value.
     * @blazorType string
     */
    @Property('top')
    public Y: string | number;

}

/**
 * Provides information about a CollisionAxis.
 */
export interface CollisionAxis {
    /**
     * specify the collision handler for a X-Axis.
     * @default "none"
     */
    X? : CollisionType;
    /**
     * specify the collision handler for a Y-Axis.
     * @default "none"
     */
    Y? : CollisionType;
}
/**
 * Collision type.
 */
export type CollisionType = 'none' | 'flip' | 'fit';
/**
 * action on scroll type.
 */
export type ActionOnScrollType = 'reposition' | 'hide'| 'none';
/**
 * Target element type.
 */
export type TargetType =  'relative' | 'container';
// don't use space in classNames
const CLASSNAMES: ClassList  = {
    ROOT: 'e-popup',
    RTL: 'e-rtl',
    OPEN: 'e-popup-open',
    CLOSE: 'e-popup-close'
};
interface ClassList {
    ROOT: string;
    RTL: string;
    OPEN: string;
    CLOSE: string;
}

interface ElementBounds extends OffsetPosition {
    right: number;
    bottom: number;
}

interface EleOffsetPosition {
    left: string | number;
    top: string | number;
}
/**
 * Represents the Popup Component
 * ```html
 * <div id="popup" style="position:absolute;height:100px;width:100px;">
 * <div style="margin:35px 25px;">Popup Content</div></div>
 * ```
 * ```typescript
 * <script>
 *   var popupObj = new Popup();
 *   popupObj.appendTo("#popup");
 * </script>
 * ```
 */
@NotifyPropertyChanges
export class Popup extends Component<HTMLElement> implements INotifyPropertyChanged {
    private fixedParent: Boolean;
    //Popup Options
    /**
     * Specifies the height of the popup element. 
     * @default 'auto'
     */
    @Property('auto')
    public height: string | number;
    /**
     * Specifies the height of the popup element.
     * @default 'auto'
     */
    @Property('auto')
    public width: string | number;
    /**
     * Specifies the content of the popup element, it can be string or HTMLElement.
     * @default null
     */
    @Property(null)
    public content: string | HTMLElement;
    /**
     * Specifies the relative element type of the component.
     * @default 'container'
     */
    @Property('container')
    public targetType: TargetType;
    /**
     * Specifies the collision detectable container element of the component.
     * @default null
     */
    @Property(null)
    public viewPortElement: HTMLElement;
    /**
     * Specifies the collision handler settings of the component.
     * @default { X: 'none',Y: 'none' } 
     */
    @Property({X: 'none', Y: 'none'})
    public collision: CollisionAxis;
    /**
     * Specifies the relative container element of the popup element.Based on the relative element, popup element will be positioned.
     * 
     * @default 'body'
     */
    @Property('')
    public relateTo: HTMLElement | string;
    /**
     * Specifies the popup element position, respective to the relative element.
     * @default {X:"left", Y:"top"}
     */
    @Complex<PositionDataModel>({}, PositionData)
    public position: PositionDataModel;
    /**
     * specifies the popup element offset-x value, respective to the relative element.
     * @default 0
     */
    @Property(0)
    public offsetX: number;
    /**
     * specifies the popup element offset-y value, respective to the relative element.
     * @default 0
     */
    @Property(0)
    public offsetY: number;
    /**
     * specifies the z-index value of the popup element.
     * @default 1000
     */
    @Property(1000)
    public zIndex: number;
    /**
     * specifies the rtl direction state of the popup element.
     * @default false
     */
    @Property(false)
    public enableRtl: boolean;
    /**
     * specifies the action that should happen when scroll the target-parent container.
     * This property should define either `reposition` or `hide`. 
     * when set `reposition` to this property, the popup position will refresh when scroll any parent container.
     * when set `hide` to this property, the popup will be closed when scroll any parent container. 
     * @default 'reposition'
     */
    @Property('reposition')
    public actionOnScroll: ActionOnScrollType;
    /**
     * specifies the animation that should happen when popup open.
     * @default 'null'
     */
    @Property(null)
    public showAnimation: AnimationModel;
    /**
     * specifies the animation that should happen when popup closes.
     * @default 'null'
     */
    @Property(null)
    public hideAnimation: AnimationModel;
    /**
     * Triggers the event once opened the popup.
     * @event
     */
    @Event()
    public open: EmitType<Object>;
    /**
     * Trigger the event once closed the popup.
     * @event
     */
    @Event()
    public close: EmitType<Object>;
    /**
     * * Constructor for creating the widget
     */
    /**
     * Triggers the event when target element hide from view port on scroll.
     * @event
     */
    @Event()
    public targetExitViewport: EmitType<Object>;

    private targetInvisibleStatus: Boolean;
    constructor(element?: HTMLElement, options?: PopupModel) {
        super(options, element);
    }
    /**
     * Called internally if any of the property value changed.
     * @private
     */
    public onPropertyChanged(newProp: PopupModel, oldProp: PopupModel): void {
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'width':
                    setStyleAttribute(this.element, { 'width': formatUnit(newProp.width) });
                    break;
                case 'height':
                    setStyleAttribute(this.element, { 'height': formatUnit(newProp.height) });
                    break;
                case 'zIndex':
                    setStyleAttribute(this.element, { 'zIndex': newProp.zIndex });
                    break;
                case 'enableRtl':
                    this.setEnableRtl();
                    break;
                case 'position':
                case 'relateTo':
                    this.refreshPosition();
                    break;
                case 'offsetX':
                    let x: number = newProp.offsetX - oldProp.offsetX;
                    this.element.style.left = (parseInt(this.element.style.left, 10) + (x)).toString() + 'px';
                    break;
                case 'offsetY':
                    let y: number = newProp.offsetY - oldProp.offsetY;
                    this.element.style.top = (parseInt(this.element.style.top, 10) + (y)).toString() + 'px';
                    break;
                case 'content':
                    this.setContent();
                    break;
                case 'actionOnScroll':
                    if (newProp.actionOnScroll !== 'none') {
                        this.wireScrollEvents();
                    } else { this.unwireScrollEvents(); }
                    break;

            }
        }
    }
    /**
     * gets the Component module name.
     * @private
     */
    public getModuleName(): string {
        return 'popup';
    }
    /**
     * To resolve if any collision occurs.
     */
    public resolveCollision(): void {
        this.checkCollision();
    }
    /**
     * gets the persisted state properties of the Component.
     */
    protected getPersistData(): string {
        return this.addOnPersist([]);
    }
    /**
     * To destroy the control.
     */
    public destroy(): void {
        this.element.classList.remove(CLASSNAMES.ROOT, CLASSNAMES.RTL, CLASSNAMES.OPEN, CLASSNAMES.CLOSE);
        this.unwireEvents();
        super.destroy();
    }
    /**
     * To Initialize the control rendering
     * @private
     */
    public render(): void {
        this.element.classList.add(CLASSNAMES.ROOT);
        let styles: { [key: string]: string | number } = {};
        if (this.zIndex !== 1000) { styles.zIndex = this.zIndex; }
        if (this.width !== 'auto') { styles.width = formatUnit(this.width); }
        if (this.height !== 'auto') { styles.height = formatUnit(this.height); }
        setStyleAttribute(this.element, styles);
        this.fixedParent = false;
        this.setEnableRtl();
        this.setContent();
    }
    private wireEvents(): void {
        if (Browser.isDevice) {
            EventHandler.add(<HTMLElement & Window>window, 'orientationchange', this.orientationOnChange, this);
        }
        if (this.actionOnScroll !== 'none') { this.wireScrollEvents(); }
    }

    public wireScrollEvents(): void {
        if (this.getRelateToElement()) {
            for ( let parent of this.getScrollableParent(this.getRelateToElement()) ) {
                EventHandler.add(parent, 'scroll', this.scrollRefresh, this);
            }
        }
    }
    private unwireEvents(): void {
        if (Browser.isDevice) {
            EventHandler.remove(<HTMLElement & Window>window, 'orientationchange', this.orientationOnChange);
        }
        if (this.actionOnScroll !== 'none') { this.unwireScrollEvents(); }
    }

    public unwireScrollEvents(): void {
        if (this.getRelateToElement()) {
            for ( let parent of this.getScrollableParent(this.getRelateToElement()) ) {
                EventHandler.remove(parent, 'scroll', this.scrollRefresh);
            }
        }
    }

    private getRelateToElement(): HTMLElement {
        let relateToElement: HTMLElement | string = this.relateTo === '' || isNullOrUndefined(this.relateTo) ?
        document.body : this.relateTo;
        this.setProperties({ relateTo: relateToElement }, true);
        return ((typeof this.relateTo) === 'string') ?
            <HTMLElement>document.querySelector(<string>this.relateTo) : <HTMLElement>this.relateTo;
    }

    private scrollRefresh(e: MouseEvent): void {
        if (this.actionOnScroll === 'reposition') {
            if (!(this.element.offsetParent === e.target ||
                    (this.element.offsetParent && this.element.offsetParent.tagName === 'BODY' &&
                    (e.target as HTMLElement).parentElement == null) )) {
                this.refreshPosition();
            }
        }else if (this.actionOnScroll === 'hide') {
            this.hide();
        }
        if (this.actionOnScroll !== 'none') {
            if (this.getRelateToElement()) {
                let targetVisible : Boolean = this.isElementOnViewport(this.getRelateToElement(), e.target as HTMLElement);
                if ( !targetVisible && !this.targetInvisibleStatus ) {
                    this.trigger ('targetExitViewport');
                    this.targetInvisibleStatus = true;
                }else if ( targetVisible ) {
                    this.targetInvisibleStatus = false;
                }
            }
        }
    }
    /**
     * This method is to get the element visibility on viewport when scroll 
     * the page. This method will returns true even though 1 px of element
     * part is in visible.
     */
    private isElementOnViewport(relateToElement: HTMLElement, scrollElement: HTMLElement): boolean {

        let scrollParents: HTMLElement[] = this.getScrollableParent(relateToElement);
        for ( let parent: number = 0; parent < scrollParents.length; parent ++ ) {
            if (this.isElementVisible(relateToElement, scrollParents[parent])) {
                continue;
            }else {
                return false;
            }
        }
        return true;
    }

    private isElementVisible (relateToElement: HTMLElement, scrollElement: HTMLElement): boolean {
        let rect: ClientRect = this.checkGetBoundingClientRect(relateToElement);

        if (!rect.height || !rect.width) {
            return false;
        }

        if (!isNullOrUndefined(this.checkGetBoundingClientRect(scrollElement))) {
            let parent: ClientRect = scrollElement.getBoundingClientRect();
            return !(rect.bottom < parent.top) &&
                (!(rect.bottom > parent.bottom) &&
                (!(rect.right > parent.right) &&
                !(rect.left < parent.left)));
        }else {
            let win: Window = window;
            let windowView: ElementBounds = {
                top : win.scrollY,
                left : win.scrollX,
                right : win.scrollX + win.outerWidth,
                bottom : win.scrollY + win.outerHeight
            };
            let off: OffsetPosition = calculatePosition(relateToElement);
            let ele: ElementBounds = {
                top : off.top,
                left : off.left,
                right : off.left + rect.width,
                bottom : off.top + rect.height
            };
            let elementView: ElementBounds = {
                top : windowView.bottom - ele.top,
                left: windowView.right - ele.left,
                bottom: ele.bottom - windowView.top,
                right: ele.right - windowView.left
            };
            return elementView.top > 0
                && elementView.left > 0
                && elementView.right > 0
                && elementView.bottom > 0;
        }
    }
    /**
     * Initialize the event handler
     * @private
     */
    protected preRender(): void {
        //There is no event handler
    }
    private setEnableRtl(): void {
        this.reposition();
        this.enableRtl ? this.element.classList.add(CLASSNAMES.RTL) : this.element.classList.remove(CLASSNAMES.RTL);
    }
    private setContent(): void {
        if (!isNullOrUndefined(this.content)) {
            this.element.innerHTML = '';
            if (typeof (this.content) === 'string') {
                this.element.textContent = this.content;
            } else {
                this.element.appendChild(this.content);
            }
        }
    }
    private orientationOnChange(): void {
        setTimeout(
            () => {
                this.refreshPosition();
            },
            200
        );
    }
    /**
     * Based on the `relative` element and `offset` values, `Popup` element position will refreshed.
     */
    public refreshPosition(target?: HTMLElement, collision?: boolean): void {
        if (!isNullOrUndefined(target)) { this.checkFixedParent(target); }
        this.reposition();
        if (!collision) { this.checkCollision(); }
    }

    private reposition(): void {
        let pos: EleOffsetPosition;
        let position: OffsetPosition;
        let relateToElement: HTMLElement = this.getRelateToElement();
        if (typeof this.position.X === 'number' && typeof this.position.Y === 'number') {
            pos = { left: this.position.X, top: this.position.Y };
        } else if ((typeof this.position.X === 'string' && typeof this.position.Y === 'number') ||
        (typeof this.position.X === 'number' && typeof this.position.Y === 'string')) {
            let display: string = this.element.style.display;
            let parentDisplay: string;
            this.element.style.display = 'block';
            if ( this.element.classList.contains('e-dlg-modal')) {
                parentDisplay = this.element.parentElement.style.display;
                this.element.parentElement.style.display = 'block';
            }
            position = this.getAnchorPosition(relateToElement, this.element, this.position, this.offsetX, this.offsetY);
            if (typeof this.position.X === 'string') {
                pos = { left: position.left, top: this.position.Y };
            } else {
                pos = { left: this.position.X, top: position.top };
            }
            this.element.style.display = display;
            if ( this.element.classList.contains('e-dlg-modal')) {
                this.element.parentElement.style.display = parentDisplay;
            }
        } else if (relateToElement) {
            let display: string = this.element.style.display;
            this.element.style.display = 'block';
            pos = this.getAnchorPosition(relateToElement, this.element, this.position, this.offsetX, this.offsetY);
            this.element.style.display = display;
        } else {
            pos = { left: 0, top: 0 };
        }
        if (!isNullOrUndefined(pos)) {
            this.element.style.left = pos.left + 'px';
            this.element.style.top = pos.top + 'px';
        }
    }

    private checkGetBoundingClientRect(ele: HTMLElement): ClientRect {
        let eleRect: ClientRect;
        try {
            eleRect = ele.getBoundingClientRect();
            return eleRect;
        } catch (error) {
            return null;
        }
    }

    private getAnchorPosition(
        anchorEle: HTMLElement,
        ele: HTMLElement,
        position: PositionDataModel,
        offsetX: number,
        offsetY: number): OffsetPosition {
        let eleRect: ClientRect = this.checkGetBoundingClientRect(ele);
        let anchorRect: ClientRect = this.checkGetBoundingClientRect(anchorEle);
        if ( isNullOrUndefined(eleRect)  || isNullOrUndefined(anchorRect) ) {
            return null;
        }
        let anchor: HTMLElement = anchorEle as HTMLElement;
        let anchorPos: OffsetPosition = { left: 0, top: 0 };
        if (ele.offsetParent && ele.offsetParent.tagName === 'BODY' && anchorEle.tagName === 'BODY') {
            anchorPos = calculatePosition(anchorEle);
        } else {
            if ((ele.classList.contains('e-dlg-modal') && anchor.tagName !== 'BODY')) {
                ele = ele.parentElement;
            }
            anchorPos = calculateRelativeBasedPosition(anchor, ele);
        }
        switch (position.X) {
            default:
            case 'left':
                break;
            case 'center':
                if ((ele.classList.contains('e-dlg-modal') && anchor.tagName === 'BODY' && this.targetType === 'container')) {
                    anchorPos.left += (window.innerWidth / 2 - eleRect.width / 2);
                } else if (this.targetType === 'container') {
                    anchorPos.left += (anchorRect.width / 2 - eleRect.width / 2);
                } else {
                    anchorPos.left += (anchorRect.width / 2);
                }
                break;
            case 'right':
                if ((ele.classList.contains('e-dlg-modal') && anchor.tagName === 'BODY' && this.targetType === 'container')) {
                    anchorPos.left += (window.innerWidth - eleRect.width );
                } else if (this.targetType === 'container') {
                    anchorPos.left += (anchorRect.width - eleRect.width);
                } else {
                    anchorPos.left += (anchorRect.width);
                }
                break;
        }
        switch (position.Y) {
            default:
            case 'top':
                break;
            case 'center':
                if ((ele.classList.contains('e-dlg-modal') && anchor.tagName === 'BODY' && this.targetType === 'container')) {
                    anchorPos.top += (window.innerHeight / 2 - eleRect.height / 2);
                } else if (this.targetType === 'container') {
                    anchorPos.top += (anchorRect.height / 2 - eleRect.height / 2);
                } else {
                    anchorPos.top += (anchorRect.height / 2);
                }
                break;
            case 'bottom':
                if ((ele.classList.contains('e-dlg-modal') && anchor.tagName === 'BODY' && this.targetType === 'container')) {
                    anchorPos.top += (window.innerHeight - eleRect.height);
                } else if (this.targetType === 'container') {
                    anchorPos.top += (anchorRect.height - eleRect.height);
                } else {
                    anchorPos.top += (anchorRect.height);
                }
                break;
        }
        anchorPos.left += offsetX;
        anchorPos.top += offsetY;
        return anchorPos;
    }
    private callFlip(param: CollisionCoordinates): void {
        let relateToElement: HTMLElement = this.getRelateToElement();
        flip(
            this.element,
            relateToElement,
            this.offsetX,
            this.offsetY,
            <string>this.position.X,
            <string>this.position.Y,
            this.viewPortElement,
            param,
            this.fixedParent);
    }
    private callFit(param: CollisionCoordinates): void {
        if (isCollide(this.element, this.viewPortElement).length !== 0) {
            if (isNullOrUndefined(this.viewPortElement)) {
                let data: OffsetPosition = fit(this.element, this.viewPortElement, param);
                if (param.X) { this.element.style.left = data.left + 'px'; }
                if (param.Y) { this.element.style.top = data.top + 'px'; }
            } else {
                let elementRect: ClientRect = this.checkGetBoundingClientRect(this.element);
                let viewPortRect: ClientRect = this.checkGetBoundingClientRect(this.viewPortElement);
                if (isNullOrUndefined(elementRect) || isNullOrUndefined(viewPortRect)) { return null; }
                if (param && param.Y === true) {
                    if (viewPortRect.top > elementRect.top) {
                        this.element.style.top = '0px';
                    } else if (viewPortRect.bottom < elementRect.bottom) {
                        this.element.style.top = parseInt(this.element.style.top, 10) - (elementRect.bottom - viewPortRect.bottom) + 'px';
                    }
                }
                if (param && param.X === true) {
                    if (viewPortRect.right < elementRect.right) {
                        this.element.style.left = parseInt(this.element.style.left, 10) - (elementRect.right - viewPortRect.right) + 'px';
                    } else if (viewPortRect.left > elementRect.left) {
                        this.element.style.left = parseInt(this.element.style.left, 10) + (viewPortRect.left - elementRect.left) + 'px';
                    }
                }
            }
        }
    }
    private checkCollision(): void {
        let horz: string = this.collision.X;
        let vert: string = this.collision.Y;
        if (horz === 'none' && vert === 'none') {
            return;
        }
        if (horz === 'flip' && vert === 'flip') {
            this.callFlip({X: true, Y: true});
        } else if (horz === 'fit' && vert === 'fit') {
            this.callFit({X: true, Y: true});
        } else {
            if (horz === 'flip') {
                this.callFlip({X: true, Y: false});
            } else if (vert === 'flip') {
                this.callFlip({Y: true, X: false});
            }
            if (horz === 'fit') {
                this.callFit({X: true, Y: false});
            } else if (vert === 'fit') {
                this.callFit({X: false, Y: true});
            }
        }
    }
    /**
     * Shows the popup element from screen.
     * @param { AnimationModel | Function } collisionOrAnimationOptions? - To pass animation options or collision function.
     * @param { Function } collision? - To pass the collision function.
     * @param { HTMLElement } relativeElement? - To calculate the zIndex value dynamically.
     */
    public show(animationOptions?: AnimationModel, relativeElement?: HTMLElement): void {
        this.wireEvents();
        if (this.zIndex === 1000 || !isNullOrUndefined(relativeElement)) {
            let zIndexElement: HTMLElement = ( isNullOrUndefined(relativeElement)) ? this.element : relativeElement;
            this.zIndex = getZindexPartial(zIndexElement as HTMLElement);
            setStyleAttribute(this.element, { 'zIndex': this.zIndex });
        }
        animationOptions = (!isNullOrUndefined(animationOptions) && typeof animationOptions === 'object') ?
            animationOptions : this.showAnimation;
        if (this.collision.X !== 'none' || this.collision.Y !== 'none') {
            removeClass([this.element], CLASSNAMES.CLOSE);
            addClass([this.element], CLASSNAMES.OPEN);
            this.checkCollision();
            removeClass([this.element], CLASSNAMES.OPEN);
            addClass([this.element], CLASSNAMES.CLOSE);
        }
        if (!isNullOrUndefined(animationOptions)) {
            animationOptions.begin = () => {
                if (!this.isDestroyed) {
                    removeClass([this.element], CLASSNAMES.CLOSE);
                    addClass([this.element], CLASSNAMES.OPEN);
                }
            };
            animationOptions.end = () => {
                if (!this.isDestroyed) { this.trigger('open'); }
            };
            new Animation(animationOptions).animate(this.element);
        } else {
            removeClass([this.element], CLASSNAMES.CLOSE);
            addClass([this.element], CLASSNAMES.OPEN);
            this.trigger('open');
        }
    }
    /**
     * Hides the popup element from screen.
     * @param { AnimationModel } animationOptions? - To give the animation options.
     */
    public hide(animationOptions?: AnimationModel): void {
        animationOptions = (!isNullOrUndefined(animationOptions) && typeof animationOptions === 'object') ?
            animationOptions : this.hideAnimation;
        if (!isNullOrUndefined(animationOptions)) {
            animationOptions.end = () => {
                if (!this.isDestroyed) {
                    removeClass([this.element], CLASSNAMES.OPEN);
                    addClass([this.element], CLASSNAMES.CLOSE);
                    this.trigger('close');
                }
            };
            new Animation(animationOptions).animate(this.element);
        } else {
            removeClass([this.element], CLASSNAMES.OPEN);
            addClass([this.element], CLASSNAMES.CLOSE);
            this.trigger('close');
        }
        this.unwireEvents();
    }
    /**
     * Gets scrollable parent elements for the given element.
     * @param { HTMLElement } element - Specify the element to get the scrollable parents of it.
     */
    public getScrollableParent(element: HTMLElement): HTMLElement[] {
        this.checkFixedParent(element);
        return getScrollableParent(element, this.fixedParent);
    }

    private checkFixedParent(element: HTMLElement): void {
        let parent: HTMLElement = element.parentElement;
        while (parent && parent.tagName !== 'HTML') {
            let parentStyle: CSSStyleDeclaration = getComputedStyle(parent);
            if (parentStyle.position === 'fixed' && this.element.offsetParent && this.element.offsetParent.tagName === 'BODY') {
                this.element.style.position = 'fixed';
                this.fixedParent = true;
            }
            parent = parent.parentElement;
            if (isNullOrUndefined(this.element.offsetParent) && parentStyle.position === 'fixed'
            && this.element.style.position === 'fixed') {
                this.fixedParent = true;
            }
        }
    }
}

/**
 * Gets scrollable parent elements for the given element.
 * @param { HTMLElement } element - Specify the element to get the scrollable parents of it.
 * @private
 */
export function getScrollableParent(element: HTMLElement, fixedParent?: Boolean): HTMLElement[] {
    let eleStyle: CSSStyleDeclaration = getComputedStyle(element);
    let scrollParents: HTMLElement[] = [];
    let overflowRegex: RegExp = /(auto|scroll)/;
    let parent: HTMLElement = element.parentElement;
    while (parent && parent.tagName !== 'HTML') {
        let parentStyle: CSSStyleDeclaration = getComputedStyle(parent);
        if (!(eleStyle.position === 'absolute' && parentStyle.position === 'static')
            && overflowRegex.test(parentStyle.overflow + parentStyle.overflowY + parentStyle.overflowX)) {
            scrollParents.push(parent);
        }
        parent = parent.parentElement;
    }
    if (!fixedParent) { scrollParents.push(<HTMLElement & Document>document); }
    return scrollParents;
}

/**
 * Gets the maximum z-index of the given element.
 * @param { HTMLElement } element - Specify the element to get the maximum z-index of it.
 * @private
 */
export function getZindexPartial(element: HTMLElement): number {
    // upto body traversal
    let parent: HTMLElement = element.parentElement;
    let parentZindex: string[] = [];
    while (parent) {
        if (parent.tagName !== 'BODY') {
            let index: string = document.defaultView.getComputedStyle(parent, null).getPropertyValue('z-index');
            let position: string = document.defaultView.getComputedStyle(parent, null).getPropertyValue('position');
            if (index !== 'auto' && position !== 'static') {
                parentZindex.push(index);
            }
            parent = parent.parentElement;
        } else {
            break;
        }
    }
    //Body direct children element traversal
    let childrenZindex: string[] = [];
    for (let i: number = 0; i < document.body.children.length; i++) {
        if (!element.isEqualNode(document.body.children[i])) {
            let index: string = document.defaultView.getComputedStyle(document.body.children[i], null).getPropertyValue('z-index');
            let position: string = document.defaultView.getComputedStyle(document.body.children[i], null).getPropertyValue('position');
            if (index !== 'auto' && position !== 'static') {
                childrenZindex.push(index);
            }
        }
    }
    childrenZindex.push('999');
    let siblingsZindex: string[] = [];
    if (!isNullOrUndefined(element.parentElement) && element.parentElement.tagName !== 'BODY') {
        let childNodes: HTMLElement[] = [].slice.call(element.parentElement.children);
        for (let i: number = 0; i < childNodes.length; i++) {
            let index: string = document.defaultView.getComputedStyle(childNodes[i], null).getPropertyValue('z-index');
            let position: string = document.defaultView.getComputedStyle(childNodes[i], null).getPropertyValue('position');
            if (index !== 'auto' && position !== 'static') {
                siblingsZindex.push(index);
            }
        }
    }
    let finalValue: string[] = parentZindex.concat(childrenZindex, siblingsZindex);
    let currentZindexValue: number = Math.max.apply(Math, finalValue) + 1;
    // Checking the max-zindex value
    return currentZindexValue > 2147483647 ? 2147483647 : currentZindexValue;
}
/**
 * Gets the maximum z-index of the page.
 * @param { HTMLElement } tagName - Specify the tagName to get the maximum z-index of it.
 * @private
 */
export function getMaxZindex(tagName: string[] = ['*']): number {
    let maxZindex: string[] = [];
    for (let i: number = 0; i < tagName.length; i++ ) {
        let elements: NodeListOf<Element> = document.getElementsByTagName(tagName[i]);
        for (let i: number = 0; i < elements.length; i++) {
            let index: string = document.defaultView.getComputedStyle(elements[i], null).getPropertyValue('z-index');
            let position: string = document.defaultView.getComputedStyle(elements[i], null).getPropertyValue('position');
            if (index !== 'auto' && position !== 'static') {
                maxZindex.push(index);
            }
        }
    }
    let currentZindexValue: number = Math.max.apply(Math, maxZindex) + 1;
    return currentZindexValue > 2147483647 ? 2147483647 : currentZindexValue;
}
