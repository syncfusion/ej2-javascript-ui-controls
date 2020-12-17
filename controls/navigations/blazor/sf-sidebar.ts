import { BlazorDotnetObject, EventHandler, isNullOrUndefined as isNOU, Browser } from '@syncfusion/ej2-base';
import { addClass, closest, formatUnit, createElement, Touch, SwipeEventArgs } from '@syncfusion/ej2-base';

const LEFT: string = 'Left';
const RIGHT: string = 'Right';
const PUSH: string = 'Push';
const OVER: string = 'Over';
const SLIDE: string = 'Slide';
const AUTO: string = 'Auto';
const CLOSE: string = 'e-close';
const OPEN: string = 'e-open';
const ROOT: string = 'e-sidebar';
const CONTROL: string = 'e-control';
const CONTEXT: string = 'e-sidebar-context';
const DEFAULTBACKDROP: string = 'e-sidebar-overlay';
const SIDEBARABSOLUTE: string = 'e-sidebar-absolute';
const MAINCONTENTANIMATION: string = 'e-content-animation';
type SidebarPosition = 'Left' | 'Right';
type SidebarType = 'Slide' | 'Over' | 'Push' | 'Auto';

class SfSidebar {
    private element: BlazorSidebarElement;
    private targetElement: HTMLElement;
    private position: SidebarPosition;
    private target: HTMLElement | string;
    private showBackdrop: boolean;
    private type: SidebarType;
    private windowWidth: string | number;
    private dotnetRef: BlazorDotnetObject;
    private enableDock: boolean;
    private modal: HTMLElement;
    private mediaQuery: string;
    private enableGestures: boolean = true;
    private isOpen: boolean = false;
    private mainContentElement: Touch;
    private sidebarElement: Touch;
    private closeOnDocumentClick: boolean = false;
    private isPositionChange: boolean = false;
    private dockSize: string = 'auto';
    private width: string = 'auto';
    private isSwipChange: boolean = false;

    constructor(element: BlazorSidebarElement, dotnetRef: BlazorDotnetObject, property: ISidebar) {
        this.element = element;
        this.element.blazor__instance = this;
        this.dotnetRef = dotnetRef;
        this.type = property.Type;
        this.position = property.Position;
        this.enableDock = property.EnableDock;
        this.showBackdrop = property.ShowBackdrop;
        this.target = property.Target;
        this.enableGestures = property.EnableGestures;
        this.closeOnDocumentClick = property.CloseOnDocumentClick;
        this.mediaQuery = property.MediaQuery;
        this.dockSize = property.DockSize;
        this.width = property.Width;
    }

    public initialize(): void {
        this.setTarget();
        this.addClass();
        this.setType();
        this.setCloseOnDocumentClick();
        this.setMediaQuery();
        if (Browser.isDevice) {
            this.windowWidth = window.innerWidth;
        }
        this.wireEvents();
    }

    private addClass(): void {
        let mainElement: HTMLElement = <HTMLElement>document.querySelector('.e-main-content');
        if (!isNOU(mainElement || this.targetElement)) {
            addClass([mainElement || this.targetElement], [MAINCONTENTANIMATION]);
        }
    }

    private setTarget(): void {
        this.targetElement = <HTMLElement>this.element.nextElementSibling;
        if (typeof (this.target) === 'string') {
            this.target = <HTMLElement>document.querySelector(this.target);
        }
        if (this.target) {
            (<HTMLElement>this.target).insertBefore(this.element, (<HTMLElement>this.target).children[0]);
            addClass([this.element], SIDEBARABSOLUTE);
            addClass([(<HTMLElement>this.target)], CONTEXT);
            this.targetElement = this.getTargetElement();
        }
    }

    private getTargetElement(): HTMLElement {
        let siblingElement: HTMLElement = <HTMLElement>this.element.nextElementSibling;
        while (!isNOU(siblingElement)) {
            if (!siblingElement.classList.contains(ROOT)) {
                break;
            }
            siblingElement = <HTMLElement>siblingElement.nextElementSibling;
        }
        return siblingElement;
    }

    public hide(): void {
        let sibling: HTMLElement = <HTMLElement>document.querySelector('.e-main-content') || this.targetElement;
        if (!this.enableDock && sibling) {
            sibling.style.transform = 'translateX(' + 0 + 'px)';
            this.position === LEFT ? sibling.style.marginLeft = '0px' : sibling.style.marginRight = '0px';
        }
        this.destroyBackDrop();
        this.isOpen = false;
        if (this.enableDock) {
            setTimeout((): void => this.sidebarTimeout(), 50);
        }
        EventHandler.add(this.element, 'transitionend', this.transitionEnd, this);
    }

    public show(isServercall?: boolean): void {
        if (isServercall) {
            setTimeout((): void => this.setType(), 50);
        }
        this.isOpen = true;
        EventHandler.add(this.element, 'transitionend', this.transitionEnd, this);
    }

    private transitionEnd(value: Event): void {
        if (this.enableDock && !this.isOpen) {
            let dimension : string = this.position === LEFT ? '-100' : '100';
            let transform : string = this.position === LEFT ? this.setDimension(this.dockSize) :  '-' + this.setDimension(this.dockSize);
            let widthValue: string =  'z-index: ' + this.element.style.zIndex + ';' + ' width: ' + this.element.style.width + ';';
            let dockStyle : string =  widthValue + ' transform: translateX(' + dimension + '%) translateX(' + transform + ')';
            this.element.setAttribute('style', dockStyle);
        }
        this.dotnetRef.invokeMethodAsync('SetDock');
        if (!isNOU(value) && value.target === this.element) {
            this.dotnetRef.invokeMethodAsync('TriggerChange', this.isOpen, value);
        }
        EventHandler.remove(this.element, 'transitionend', this.transitionEnd);
    }

    public createBackDrop(property: ISidebar): void {
        this.resetProperty(property);
        if (this.showBackdrop && this.isOpen) {
            this.modal = createElement('div');
            this.modal.className = DEFAULTBACKDROP;
            this.modal.style.display = 'block';
            if (this.target) {
                let sibling: HTMLElement = <HTMLElement>document.querySelector('.e-main-content') || this.targetElement;
                sibling.appendChild(this.modal);
            } else {
                document.body.appendChild(this.modal);
            }
        }
    }

    private destroyBackDrop(): void {
        if (this.showBackdrop) {
            if (this.modal) {
                this.modal.style.display = 'none';
                this.modal.outerHTML = '';
                this.modal = null;
            }
        }
    }

    private enableGestureHandler(args: SwipeEventArgs): void {
        if (!this.isOpen && ((this.position === LEFT && args.swipeDirection === RIGHT &&
            (args.startX <= 20 && args.distanceX >= 50 && args.velocity >= 0.5)) || (this.position === RIGHT && args.swipeDirection === LEFT
                && (window.innerWidth - args.startX <= 20 && args.distanceX >= 50 && args.velocity >= 0.5)))) {
            this.dotnetRef.invokeMethodAsync('Show', args);
            this.show();
            this.isSwipChange = true;
        } else if (this.isOpen && (this.position === LEFT && args.swipeDirection === LEFT) || (this.position === RIGHT &&
            args.swipeDirection === RIGHT)) {
            this.dotnetRef.invokeMethodAsync('Hide', args);
            this.hide();
            this.isSwipChange = false;
        }
    }

    private resize(): void {
        this.setMediaQuery();
        if (Browser.isDevice) {
            this.windowWidth = window.innerWidth;
        }
    }

    public setEnableGestures(property?: ISidebar): void {
        this.resetProperty(property);
        if (this.enableGestures) {
            this.mainContentElement = new Touch(document.body, { swipe: this.enableGestureHandler.bind(this) });
            this.sidebarElement = new Touch(<HTMLElement>this.element, { swipe: this.enableGestureHandler.bind(this) });
        } else if (this.mainContentElement && this.sidebarElement) {
            this.mainContentElement.destroy();
            this.sidebarElement.destroy();
        }
    }

    private wireEvents(): void {
        this.setEnableGestures();
        window.addEventListener('resize', this.resize.bind(this));
    }
    private unWireEvents(): void {
        window.removeEventListener('resize', this.resize.bind(this));
        EventHandler.remove(document, 'mousedown touchstart', this.documentclickHandler);
        if (this.mainContentElement) { this.mainContentElement.destroy(); }
        if (this.sidebarElement) { this.sidebarElement.destroy(); }
    }

    private documentclickHandler(e: MouseEvent): void {
        if (!(closest((<HTMLElement>e.target), '.' + CONTROL + '' + '.' + ROOT))) {
            this.dotnetRef.invokeMethodAsync('TriggerHide', e);
            this.hide();
        }
    }

    public setCloseOnDocumentClick(property?: ISidebar): void {
        this.resetProperty(property);
        if (this.closeOnDocumentClick) {
            EventHandler.add(document, 'mousedown touchstart', this.documentclickHandler, this);
        } else {
            EventHandler.remove(document, 'mousedown touchstart', this.documentclickHandler);
        }
    }

    public setMediaQuery(): void {
        if (this.mediaQuery && this.windowWidth !== window.innerWidth) {
            if (window.matchMedia(this.mediaQuery).matches) {
                this.dotnetRef.invokeMethodAsync('TriggerShow', null);
            } else if (this.isOpen) {
                this.dotnetRef.invokeMethodAsync('TriggerHide', null);
            }
        }
    }

    private setDimension(width: number | string): string {
        if (typeof width === 'number') {
            width = formatUnit(width);
        } else if (typeof width === 'string') {
            width = (width.match(/px|%|em/)) ? width : formatUnit(width);
        } else {
            width = '100%';
        }
        return width;
    }

    private sidebarTimeout(): void {
        let sibling: HTMLElement = <HTMLElement>document.querySelector('.e-main-content') || this.targetElement;
        let leftMargin: string = this.isOpen ? this.setDimension(this.width) : this.setDimension(this.dockSize);
        let rightMargin: string = this.setDimension(this.element.getBoundingClientRect().width);
        if (sibling) {
            if (this.isOpen) {
                this.positionStyles(this.width, sibling, rightMargin, leftMargin);
            } else if (this.element.classList.contains(CLOSE)) {
                this.positionStyles(this.dockSize, sibling, rightMargin, leftMargin);
            }
        }
    };

    private positionStyles(size: string, sibling: HTMLElement, rightMargin: string, leftMargin: string): void {
        if (this.position === LEFT) {
            sibling.style.marginLeft = size === 'auto' ? rightMargin : leftMargin;
        } else {
            sibling.style.marginRight = size === 'auto' ? rightMargin : leftMargin;
        }
    }

    private siblingStyle(sibling: HTMLElement, margin: string): void {
        this.position === LEFT ? sibling.style.marginLeft = margin : sibling.style.marginRight = margin;
    }

    private resetProperty(property: ISidebar): void {
        if (!isNOU(property)) {
            this.isOpen = property.IsOpen;
            this.enableGestures = property.EnableGestures;
            this.showBackdrop = property.ShowBackdrop;
            this.closeOnDocumentClick = property.CloseOnDocumentClick;
            this.isPositionChange = this.position !== property.Position;
            this.position = property.Position;
            this.type = property.Type;
        }
    }

    public setType(property?: ISidebar): void {
        let elementWidth: number | string = this.element.getBoundingClientRect().width;
        elementWidth = this.enableDock && !this.isOpen ? this.dockSize : elementWidth;
        let sibling: HTMLElement = <HTMLElement>document.querySelector('.e-main-content') || this.targetElement;
        this.isPositionChange = false;
        this.resetProperty(property);
        if (sibling) {
            if (this.isPositionChange) { this.position === LEFT ? sibling.style.marginRight = '0px' : sibling.style.marginLeft = '0px'; }
            sibling.style.transform = 'translateX(' + 0 + 'px)';
            if (!Browser.isDevice && this.type !== AUTO) {
                this.position === LEFT ? sibling.style.marginLeft = '0px' : sibling.style.marginRight = '0px';
            }
            let margin: string = typeof (elementWidth) === 'string' ? elementWidth : elementWidth + 'px';
            let translate: string | number = this.position === LEFT ? elementWidth : - (elementWidth);
            let value: boolean = sibling && (this.enableDock || this.isOpen || this.isSwipChange);
            switch (this.type) {
                case PUSH:
                    if (value) {
                        this.siblingStyle(sibling, margin);
                    } break;
                case SLIDE:
                    if (value) {
                        sibling.style.transform = 'translateX(' + translate + 'px)';
                    } break;
                case OVER:
                    if (this.enableDock && this.element.classList.contains(CLOSE)) {
                        this.siblingStyle(sibling, margin);
                    } break;
                case AUTO:
                    if (Browser.isDevice) {
                        if ((this.enableDock) && !this.isOpen) {
                            this.siblingStyle(sibling, margin);
                        }
                    } else if ((this.enableDock || this.isOpen || this.isSwipChange)) {
                        this.siblingStyle(sibling, margin);
                    }
                    this.isSwipChange = false;
            }
        }
    }

    public destroy(): void {
        this.destroyBackDrop();
        this.element.style.width = this.element.style.zIndex = this.element.style.transform = '';
        this.windowWidth = null;
        let sibling: HTMLElement = <HTMLElement>document.querySelector('.e-main-content') || this.targetElement;
        if (!isNOU(sibling)) {
            sibling.style.margin = sibling.style.transform = '';
        }
        this.unWireEvents();
    }
}
// tslint:disable
let Sidebar: object = {
    initialize(element: BlazorSidebarElement, dotnetRef: BlazorDotnetObject, property: ISidebar): boolean {
        new SfSidebar(element, dotnetRef, property);
        if (this.isValid(element)) { element.blazor__instance.initialize(); }
        return !Browser.isDevice && window.matchMedia(property.MediaQuery) ? true : false;
    },
    setType(element: BlazorSidebarElement, property: ISidebar): void {
        if (this.isValid(element)) {
            element.blazor__instance.setType(property);
        }
    },
    hide(element: BlazorSidebarElement, property: ISidebar): void {
        if (this.isValid(element)) {
            element.blazor__instance.setType(property);
            element.blazor__instance.hide();
        }
    },
    show(element: BlazorSidebarElement, property: ISidebar, isServerCall: boolean): void {
        if (this.isValid(element)) {
            element.blazor__instance.setType(property);
            element.blazor__instance.createBackDrop(property);
            element.blazor__instance.show(isServerCall);
        }
    },
    onPropertyChange(element: BlazorSidebarElement, property: ISidebar): void {
        if (this.isValid(element)) {
            if (property.CloseOnDocumentClick !== undefined) { element.blazor__instance.setCloseOnDocumentClick(property); }
            if (property.ShowBackdrop !== undefined) { element.blazor__instance.createBackDrop(property); }
        }
    },
    destroy(element: BlazorSidebarElement): void {
        if (this.isValid(element)) {
            if(element){ element.blazor__instance.destroy(); }
        }
    },
    isValid(element: BlazorSidebarElement): boolean {
        return (element && element.blazor__instance) ? true : false;
    }
};


interface BlazorSidebarElement extends HTMLElement {
    blazor__instance: SfSidebar;
}

interface ISidebar {
    Target: string;
    Width: string;
    MediaQuery: string;
    DockSize: string;
    IsOpen: boolean;
    EnableGestures: boolean;
    EnableDock: boolean;
    ShowBackdrop: boolean;
    CloseOnDocumentClick: boolean;
    Position: SidebarPosition;
    Type: SidebarType;
}
export default Sidebar;
