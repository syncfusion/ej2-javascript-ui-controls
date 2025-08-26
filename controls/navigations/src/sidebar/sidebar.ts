import { Component, formatUnit, EventHandler, Event, isNullOrUndefined, closest, Browser } from '@syncfusion/ej2-base';
import { Property, EmitType, NotifyPropertyChanges, INotifyPropertyChanged, isNullOrUndefined as isNOU } from '@syncfusion/ej2-base';
import { setStyleAttribute as setStyle, addClass, removeClass, Touch, SwipeEventArgs } from '@syncfusion/ej2-base';
import { SidebarModel } from './sidebar-model';

const CONTROL: string = 'e-control';
const ROOT: string = 'e-sidebar';
const DOCKER: string = 'e-dock';
const CLOSE: string = 'e-close';
const OPEN: string = 'e-open';
const TRASITION: string = 'e-transition';
const DEFAULTBACKDROP: string = 'e-sidebar-overlay';
const RTL: string = 'e-rtl';
const RIGHT: string = 'e-right';
const LEFT: string = 'e-left';
const OVER: string = 'e-over';
const PUSH: string = 'e-push';
const SLIDE: string = 'e-slide';
const VISIBILITY: string = 'e-visibility';
const DISPLAY: string = 'e-sidebar-display';
const MAINCONTENTANIMATION: string = 'e-content-animation';
const DISABLEANIMATION: string = 'e-disable-animation';
const CONTEXT: string = 'e-sidebar-context';
const SIDEBARABSOLUTE: string = 'e-sidebar-absolute';


/**
 * Specifies the Sidebar types.
 * ```props
 * Slide :- Specifies the animation sliding while opening the sidebar.
 * Over :- Specifies the sidebar appearing over the main content.
 * Push :- Specifies the sidebar pushing the main content.
 * Auto :- Specifies that the sidebar opens automatically.
 * ```
 */
export type SidebarType = 'Slide' | 'Over' | 'Push' | 'Auto';

/**
 * Specifies the Sidebar positions.
 * ```props
 * Left :- Sidebar positions to the Left in relation to the main content.
 * Right :- Sidebar positions to the Right in relation to the main content.
 * ```
 */
export type SidebarPosition = 'Left' | 'Right';

/**
 * Sidebar is an expandable or collapsible
 * component that typically act as a side container to place the primary or secondary content alongside of the main content.
 * ```html
 * <aside id="sidebar">
 * </aside>
 * ```
 * ```typescript
 * <script>
 *   let sidebarObject: Sidebar = new Sidebar();
 *   sidebarObject.appendTo("#sidebar");
 * </script>
 * ```
 */
@NotifyPropertyChanges
export class Sidebar extends Component<HTMLElement> implements INotifyPropertyChanged {
    private modal: HTMLElement;
    private mainContentEle: Touch;
    private sidebarEle: Touch;
    private sidebarEleCopy: HTMLElement;
    protected tabIndex: string;
    private windowWidth: number;
    private targetEle: HTMLElement;
    // Specifies the first render of Sidebar component.
    private firstRender: boolean;
    private documentClickContext: EventListenerObject = this.documentclickHandler.bind(this);

    /**
     * Specifies the size of the Sidebar in dock state.
     * > For more details about dockSize refer to
     * [`Dock`](https://ej2.syncfusion.com/documentation/sidebar/docking-sidebar/) documentation.
     *
     * @default 'auto'
     */
    @Property('auto')
    public dockSize: string | number;
    /**
     * Specifies the media query string for resolution, which when met opens the Sidebar.
     * ```typescript
     *   let defaultSidebar: Sidebar = new Sidebar({
     *       mediaQuery:'(min-width: 600px)'
     *   });
     * ```
     * > For more details about mediaQuery refer to
     * [`Auto Close`](https://ej2.syncfusion.com/documentation/sidebar/auto-close/) documentation.
     *
     * @default null
     * @aspType string
     */
    @Property(null)
    public mediaQuery: string | MediaQueryList;
    /**
     * Specifies the docking state of the component.
     * > For more details about enableDock refer to
     * [`Dock`](https://ej2.syncfusion.com/documentation/sidebar/docking-sidebar/) documentation.
     *
     * @default false
     */
    @Property(false)
    public enableDock: boolean;
    /**
     * Enables the expand or collapse while swiping in touch devices.
     * This is not a sidebar property.
     *
     * @default 'en-US'
     * @private
     */
    @Property('en-US')
    public locale: string;
    /**
     * Enable or disable persisting component's state between page reloads. If enabled, following list of states will be persisted.
     * 1. Position
     * 2. Type
     *
     * @default false
     */
    @Property(false)
    public enablePersistence: boolean;
    /**
     * Enables the expand or collapse while swiping in touch devices.
     *
     * @default true
     */
    @Property(true)
    public enableGestures: boolean;
    /**
     * Gets or sets the Sidebar component is open or close.
     * > When the Sidebar type is set to `Auto`,
     * the component will be expanded in the desktop and collapsed in the mobile mode regardless of the isOpen property.
     *
     * @default false
     */
    @Property(false)
    public isOpen: boolean;
    /**
     * Specifies the Sidebar in RTL mode that displays the content in the right-to-left direction.
     *
     * @default false
     */
    @Property(false)
    public enableRtl: boolean;
    /**
     * Enable or disable the animation transitions on expanding or collapsing the Sidebar.
     *
     * @default true
     */
    @Property(true)
    public animate: boolean;
    /**
     * Specifies the height of the Sidebar.
     *
     * @default 'auto'
     * @private
     */
    @Property('auto')
    public height: string | number;
    /**
     * Specifies whether the Sidebar need to be closed or not when document area is clicked.
     *
     * @default false
     */
    @Property(false)
    public closeOnDocumentClick: boolean;
    /**
     * Specifies the position of the Sidebar (Left/Right) corresponding to the main content.
     * > For more details about SidebarPosition refer to
     * [`position`](https://ej2.syncfusion.com/documentation/sidebar/getting-started/#position) documentation.
     *
     * @default 'Left'
     */
    @Property('Left')
    public position: SidebarPosition;
    /**
     * Allows to place the sidebar inside the target element.
     * > For more details about target refer to
     * [`Custom Context`](https://ej2.syncfusion.com/documentation/sidebar/custom-context/) documentation.
     *
     * @default null
     */
    @Property(null)
    public target: HTMLElement | string;
    /**
     * Specifies the whether to apply overlay options to main content when the Sidebar is in an open state.
     * > For more details about showBackdrop refer to
     * [`Backdrop`](https://ej2.syncfusion.com/documentation/sidebar/getting-started/#enable-backdrop) documentation.
     *
     * @default false
     */
    @Property(false)
    public showBackdrop: boolean;
    /**
     * Specifies the expanding types of the Sidebar.
     * * `Over` - The sidebar floats over the main content area.
     * * `Push` - The sidebar pushes the main content area to appear side-by-side, and shrinks the main content within the screen width.
     * * `Slide` - The sidebar translates the x and y positions of main content area based on the sidebar width.
     * The main content area will not be adjusted within the screen width.
     * * `Auto` - Sidebar with `Over` type in mobile resolution and `Push` type in other higher resolutions.
     * > For more details about SidebarType refer to
     * [`SidebarType`](../../sidebar/variations/) documentation.
     *
     * @default 'Auto'
     */
    @Property('Auto')
    public type: SidebarType;
    /**
     * Specifies the width of the Sidebar. By default, the width of the Sidebar sets based on the size of its content.
     * Width can also be set in pixel values.
     *
     * @default 'auto'
     */
    @Property('auto')
    public width: string | number;
    /**
     * Specifies the z-index of the Sidebar. It is applicable only when sidebar act as overlay type.
     *
     * @default 1000
     * @aspType double
     */
    @Property(1000)
    public zIndex: string | number;
    /**
     * Triggers when component is created.
     *
     * @event created
     *
     *
     */
    @Event()
    public created: EmitType<Object>;

    /**
     * Triggers when component is closed.
     *
     * @event close
     */
    @Event()
    public close: EmitType<EventArgs>;
    /**
     * Triggers when component is opened.
     *
     * @event open
     */
    @Event()
    public open: EmitType<EventArgs>;
    /**
     * Triggers when the state(expand/collapse) of the component is changed.
     *
     * @event change
     */
    @Event()
    public change: EmitType<ChangeEventArgs>;
    /**
     * Triggers when component gets destroyed.
     *
     * @event destroyed
     */
    @Event()
    public destroyed: EmitType<Object>;
    defaultBackdropDiv: HTMLElement;

    constructor(options?: SidebarModel, element?: string | HTMLElement) {
        super(options, element);
    }
    protected preRender(): void {
        this.setWidth();
    }
    protected render(): void {
        this.initialize();
        this.wireEvents();
        this.renderComplete();
    }

    protected initialize(): void {
        this.setTarget();
        this.addClass();
        this.setZindex();
        if (this.enableDock) {
            this.setDock();
        }
        if (this.isOpen) {
            this.show();
            this.firstRender = true;
        } else {
            this.setMediaQuery();
        }
        this.checkType(true);
        this.setType(this.type);
        this.setCloseOnDocumentClick();
        this.setEnableRTL();
        if (Browser.isDevice) {
            this.windowWidth = window.innerWidth;
        }
    }

    private setEnableRTL(): void {
        (this.enableRtl ? addClass : removeClass)([this.element], RTL);
    }

    private setTarget(): void {
        this.targetEle = <HTMLElement>this.element.nextElementSibling;
        this.sidebarEleCopy = <HTMLElement>this.element.cloneNode(true);
        if (typeof (this.target) === 'string') {
            this.setProperties({ target: <HTMLElement>document.querySelector(this.target) }, true);
        }
        if (this.target) {
            (<HTMLElement>this.target).insertBefore(this.element, (<HTMLElement>this.target).children[0]);
            addClass([this.element], SIDEBARABSOLUTE);
            addClass([(<HTMLElement>this.target)], CONTEXT);
            this.targetEle = this.getTargetElement();
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

    private setCloseOnDocumentClick(): void {
        if (this.closeOnDocumentClick) {
            document.addEventListener('mousedown', this.documentClickContext);
            document.addEventListener('touchstart', this.documentClickContext);
        } else {
            document.removeEventListener('mousedown', this.documentClickContext);
            document.removeEventListener('touchstart', this.documentClickContext);
        }
    }

    private setWidth(): void {
        if (this.enableDock && this.position === 'Left') {
            setStyle(this.element, { 'width': this.setDimension(this.dockSize) });
        } else if (this.enableDock && this.position === 'Right') {
            setStyle(this.element, { 'width': this.setDimension(this.dockSize) });
        } else if (!this.enableDock) {
            setStyle(this.element, { 'width': this.setDimension(this.width) });
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

    private setZindex(): void {
        setStyle(this.element, { 'z-index': '' + this.zIndex });
    }

    private addClass(): void {
        if (this.element.tagName === 'EJS-SIDEBAR') {
            addClass([this.element], DISPLAY);
        }
        const classELement: HTMLElement = <HTMLElement>document.querySelector('.e-main-content');
        if (!isNullOrUndefined(classELement || this.targetEle)) {
            addClass([classELement || this.targetEle], [MAINCONTENTANIMATION]);
        }
        this.tabIndex = this.element.hasAttribute('tabindex') ? this.element.getAttribute('tabindex') : null;
        if (!this.enableDock && this.type !== 'Auto') {
            addClass([this.element], [VISIBILITY]);
        }
        removeClass([this.element], [OPEN, CLOSE, RIGHT, LEFT, SLIDE, PUSH, OVER]);
        this.element.classList.add(ROOT);
        addClass([this.element], (this.position === 'Right') ? RIGHT : LEFT);
        if (this.enableDock) {
            addClass([this.element], DOCKER);
        }
        if (!isNullOrUndefined(this.tabIndex)) {
            this.element.setAttribute('tabindex', this.tabIndex);
        }
        if (this.type === 'Auto' && !Browser.isDevice && this.checkMediaQuery()) {
            this.show();
        } else if (!this.isOpen) {
            addClass([this.element], [CLOSE, DISABLEANIMATION]);
        }
    }
    private checkType(val: boolean): void {
        if (!(this.type === 'Push' || this.type === 'Over' || this.type === 'Slide')) {
            this.type = 'Auto';
        } else {
            if (!this.element.classList.contains(CLOSE) && !val) {
                this.hide();
            }
        }
    }
    private transitionEnd(e: Event): void {
        this.setDock();
        if (!isNullOrUndefined(e) && !this.firstRender) {
            this.triggerChange();
        }
        this.firstRender = false;
        EventHandler.remove(this.element, 'transitionend', this.transitionEnd);
    }
    private destroyBackDrop(): void {
        const sibling: HTMLElement = (<HTMLElement>document.querySelector('.e-main-content')) || this.targetEle;
        if (this.target && this.showBackdrop && sibling && !isNullOrUndefined(this.defaultBackdropDiv)) {
            removeClass([this.defaultBackdropDiv], DEFAULTBACKDROP);
            this.defaultBackdropDiv.remove();
            this.defaultBackdropDiv = null;
        } else if (this.showBackdrop && this.modal) {
            this.modal.style.display = 'none';
            this.modal.outerHTML = '';
            this.modal = null;
        }
    }

    /**
     * Hide the Sidebar component, if it is in an open state.
     *
     * @param {Event} e - The event triggering the hide action.
     * @returns {void}
     *
     */
    public hide(e?: Event): void {
        const closeArguments: EventArgs = {
            model: this,
            element: this.element,
            cancel: false,
            isInteracted: !isNullOrUndefined(e),
            event: (e || null)
        };
        this.trigger('close', closeArguments, (observedcloseArgs: EventArgs) => {
            if (!observedcloseArgs.cancel) {
                if (this.element.classList.contains(CLOSE)) {
                    return;
                }
                if (this.element.classList.contains(OPEN) && !this.animate) {
                    this.triggerChange();
                }
                addClass([this.element], CLOSE);
                removeClass([this.element], OPEN);
                setStyle(this.element, { 'width': formatUnit(this.enableDock ? this.dockSize : this.width) });
                this.setType(this.type);
                const sibling: HTMLElement = <HTMLElement>document.querySelector('.e-main-content') || this.targetEle;
                if (!this.enableDock && sibling) {
                    sibling.style.transform = 'translateX(' + 0 + 'px)';
                    sibling.style[this.position === 'Left' ? 'marginLeft' : 'marginRight'] = '0px';
                }
                this.destroyBackDrop();
                this.setAnimation();
                if (this.type === 'Slide') {
                    document.body.classList.remove('e-sidebar-overflow');
                }
                this.setProperties({ isOpen: false }, true);
                if (this.enableDock) {
                    setTimeout((): void => this.setTimeOut(), 50);
                }
                EventHandler.add(this.element, 'transitionend', this.transitionEnd, this);
            }
        });
    }

    private setTimeOut(): void {
        const sibling: HTMLElement = <HTMLElement>document.querySelector('.e-main-content') || this.targetEle;
        const elementWidth: number = this.element.getBoundingClientRect().width;
        if (this.element.classList.contains(OPEN) && sibling && !(this.type === 'Over' && this.enableDock)) {
            if (this.position === 'Left') {
                sibling.style.marginLeft = this.setDimension(this.width === 'auto' ? elementWidth : this.width);
            } else {
                sibling.style.marginRight = this.setDimension(this.width === 'auto' ? elementWidth : this.width);
            }
        } else if (this.element.classList.contains(CLOSE) && sibling) {
            if (this.position === 'Left') {
                sibling.style.marginLeft = this.setDimension(this.dockSize === 'auto' ? elementWidth : this.dockSize);
            } else {
                sibling.style.marginRight = this.setDimension(this.dockSize === 'auto' ? elementWidth : this.dockSize);
            }
        }
    }

    /**
     * Shows the Sidebar component, if it is in closed state.
     *
     * @param {Event} e - The optional event triggering the show action.
     * @returns {void}
     */
    public show(e?: Event): void {
        const openArguments: EventArgs = {
            model: this,
            element: this.element,
            cancel: false,
            isInteracted: !isNullOrUndefined(e),
            event: (e || null)
        };
        this.trigger('open', openArguments, (observedopenArgs: EventArgs) => {
            if (!observedopenArgs.cancel) {
                removeClass([this.element], [VISIBILITY, DISABLEANIMATION]);
                if (this.element.classList.contains(OPEN)) {
                    return;
                }
                if (this.element.classList.contains(CLOSE) && !this.animate) {
                    this.triggerChange();
                }
                addClass([this.element], [OPEN, TRASITION]);
                setStyle(this.element, { 'transform': '' });
                removeClass([this.element], CLOSE);
                setStyle(this.element, { 'width': formatUnit(this.width) });
                this.setType(this.type);
                if (this.targetEle && !this.targetEle.querySelector('.e-sidebar-overlay')) {
                    this.createBackDrop();
                }
                this.setAnimation();
                if (this.type === 'Slide') {
                    document.body.classList.add('e-sidebar-overflow');
                }
                this.setProperties({ isOpen: true }, true);
                EventHandler.add(this.element, 'transitionend', this.transitionEnd, this);
            }
        });
    }

    private setAnimation(): void {
        if (this.animate) {
            removeClass([this.element], DISABLEANIMATION);
        } else {
            addClass([this.element], DISABLEANIMATION);
        }
    }

    private triggerChange(): void {
        const changeArguments: ChangeEventArgs = { name: 'change', element: this.element };
        this.trigger('change', changeArguments);
    }

    private setDock(): void {
        if (this.enableDock && this.position === 'Left' && !this.getState()) {
            setStyle(this.element, { 'transform': 'translateX(' + -100 + '%) translateX(' + this.setDimension(this.dockSize) + ')' });
        } else if (this.enableDock && this.position === 'Right' && !this.getState()) {
            setStyle(this.element, { 'transform': 'translateX(' + 100 + '%) translateX(' + '-' + this.setDimension(this.dockSize) + ')' });
        }
        if (this.element.classList.contains(CLOSE) && this.enableDock) {
            setStyle(this.element, { 'width': this.setDimension(this.dockSize) });
        }
    }
    private createBackDrop(): void {
        if (this.target && this.showBackdrop && this.getState()) {
            const targetString: HTMLElement = <HTMLElement>this.target;
            const sibling: HTMLElement = <HTMLElement>document.querySelector('.e-main-content') || this.targetEle;
            this.defaultBackdropDiv = this.createElement('div');
            addClass([this.defaultBackdropDiv], DEFAULTBACKDROP);
            setStyle(this.defaultBackdropDiv, {height: targetString.style.height});
            sibling.appendChild(this.defaultBackdropDiv);
        } else if (this.showBackdrop && !this.modal && this.getState()) {
            this.modal = this.createElement('div');
            this.modal.className = DEFAULTBACKDROP;
            this.modal.style.display = 'block';
            document.body.appendChild(this.modal);
        }
    }

    protected getPersistData(): string {
        return this.addOnPersist(['type', 'position', 'isOpen']);
    }

    /**
     * Returns the current module name.
     *
     * @returns {string} - returns module name.
     * @private
     *
     */
    protected getModuleName(): string {
        return 'sidebar';
    }

    /**
     * Shows or hides the Sidebar based on the current state.
     *
     * @returns {void}
     */
    public toggle(): void {
        if (this.element.classList.contains(OPEN)) {
            this.hide();
        } else {
            this.show();
        }
    }

    protected getState(): boolean {
        return this.element.classList.contains(OPEN) ? true : false;
    }
    private setMediaQuery(): void {
        if (this.mediaQuery) {
            let media: boolean = false;
            if (typeof (this.mediaQuery) === 'string') {
                media = window.matchMedia(this.mediaQuery).matches;
            } else {
                media = (this.mediaQuery).matches;
            }
            if (media && this.windowWidth !== window.innerWidth) {
                this.show();
            } else if (this.getState() && this.windowWidth !== window.innerWidth) {
                this.hide();
            }
        }
    }
    private checkMediaQuery(): boolean {
        if (isNullOrUndefined(this.mediaQuery)) {
            return true;
        }
        return (typeof (this.mediaQuery) === 'string') ?
            window.matchMedia(this.mediaQuery).matches : (this.mediaQuery).matches;
    }
    protected resize(): void {
        if (!isNullOrUndefined(this.width) && this.width !== 'auto' && typeof this.width === 'string' && !this.width.includes('px')) {
            this.setType(this.type);
        }
        if (this.type === 'Auto') {
            if (Browser.isDevice) {
                addClass([this.element], OVER);
            } else {
                addClass([this.element], PUSH);
            }
        }
        this.setMediaQuery();
        if (Browser.isDevice) {
            this.windowWidth = window.innerWidth;
        }
    }

    private documentclickHandler(e: MouseEvent): void {
        if (closest((<HTMLElement>e.target), '.' + CONTROL + '' + '.' + ROOT)) {
            return;
        }
        this.hide(e);
    }

    private enableGestureHandler(args: SwipeEventArgs): void {
        if (!this.isOpen && this.position === 'Left' && args.swipeDirection === 'Right' &&
            (args.startX <= 20 && args.distanceX >= 50 && args.velocity >= 0.5)) {
            this.show();
        } else if (this.isOpen && this.position === 'Left' && args.swipeDirection === 'Left') {
            this.hide(args.originalEvent as Event);
        } else if (this.isOpen && this.position === 'Right' && args.swipeDirection === 'Right') {
            this.hide(args.originalEvent as Event);
        } else if (!this.isOpen && this.position === 'Right' && args.swipeDirection === 'Left'
            && (window.innerWidth - args.startX <= 20 && args.distanceX >= 50 && args.velocity >= 0.5)) {
            this.show();
        }
    }
    private setEnableGestures(): void {
        if (this.enableGestures) {
            this.mainContentEle = new Touch(document.body, { swipe: this.enableGestureHandler.bind(this) });
            this.sidebarEle = new Touch(<HTMLElement>this.element, { swipe: this.enableGestureHandler.bind(this) });
        } else {
            if (this.mainContentEle && this.sidebarEle) {
                this.mainContentEle.destroy();
                this.sidebarEle.destroy();
            }
        }
    }
    private wireEvents(): void {
        this.setEnableGestures();
        EventHandler.add(<HTMLElement & Window><unknown>window, 'resize', this.resize, this);
    }
    private unWireEvents(): void {
        EventHandler.remove(<HTMLElement & Window><unknown>window, 'resize', this.resize);
        EventHandler.remove(document, 'mousedown touchstart', this.documentclickHandler);
        if (this.mainContentEle) { this.mainContentEle.destroy(); }
        if (this.sidebarEle) { this.sidebarEle.destroy(); }
    }
    /**
     * Called internally if any of the property value changed.
     *
     * @param {SidebarModel} newProp - specifies newProp value.
     * @param {SidebarModel} oldProp - specifies oldProp value.
     * @returns {void}
     * @private
     *
     */
    public onPropertyChanged(newProp: SidebarModel, oldProp: SidebarModel): void {
        const sibling: HTMLElement = <HTMLElement>document.querySelector('.e-main-content') || this.targetEle;
        const isRendered: boolean = this.isServerRendered;
        for (const prop of Object.keys(newProp)) {
            switch (prop) {
            case 'isOpen':
                if (this.isOpen) {
                    this.show();
                } else {
                    this.hide();
                }
                break;
            case 'width':
                this.setWidth();
                if (!this.getState()) {
                    this.setDock();
                }
                break;
            case 'animate':
                this.setAnimation();
                break;
            case 'type':
                this.checkType(false);
                removeClass([this.element], [VISIBILITY]);
                this.addClass();
                addClass([this.element], this.type === 'Auto' ? (Browser.isDevice ? ['e-over'] :
                    ['e-push']) : ['e-' + this.type.toLowerCase()]);
                break;
            case 'position':
                this.element.style.transform = '';
                this.setDock();
                if (sibling) {
                    sibling.style[this.position === 'Left' ? 'marginRight' : 'marginLeft'] = '0px';
                }
                if (this.position === 'Right') {
                    removeClass([this.element], LEFT);
                    addClass([this.element], RIGHT);
                } else {
                    removeClass([this.element], RIGHT);
                    addClass([this.element], LEFT);
                }
                this.setType(this.type);
                break;
            case 'showBackdrop':
                if (this.showBackdrop) { this.createBackDrop(); } else {
                    if (this.modal) {
                        this.modal.style.display = 'none';
                        this.modal.outerHTML = '';
                        this.modal = null;
                    }
                }
                break;
            case 'target':
                if (typeof (this.target) === 'string') {
                    this.setProperties({ target: <HTMLElement>document.querySelector(this.target) }, true);
                }
                if (isNullOrUndefined(this.target)) {
                    removeClass([this.element], SIDEBARABSOLUTE);
                    removeClass([<HTMLElement>oldProp.target], CONTEXT);
                    setStyle(sibling, { 'margin-left': 0, 'margin-right': 0 });
                    document.body.insertAdjacentElement('afterbegin', this.element);
                }
                this.isServerRendered = false;
                super.refresh();
                this.isServerRendered = isRendered;
                break;
            case 'closeOnDocumentClick':
                this.setCloseOnDocumentClick();
                break;
            case 'enableDock':
                if (!this.getState()) {
                    this.setDock();
                }
                break;
            case 'zIndex':
                this.setZindex();
                break;
            case 'mediaQuery':
                this.setMediaQuery();
                break;
            case 'enableGestures':
                this.setEnableGestures();
                break;
            case 'enableRtl':
                this.setEnableRTL();
                break;
            }
        }
    }

    protected setType(type?: string): void {
        const elementWidth: number = this.element.getBoundingClientRect().width;
        this.setZindex();
        const sibling: HTMLElement = <HTMLElement>document.querySelector('.e-main-content') || this.targetEle;
        if (sibling) {
            sibling.style.transform = 'translateX(' + 0 + 'px)';
            if (!Browser.isDevice && this.type !== 'Auto' && !(this.type === 'Over' && this.enableDock)) {
                sibling.style[this.position === 'Left' ? 'marginLeft' : 'marginRight'] = '0px';
            }
        }
        const margin: string = this.position === 'Left' ? elementWidth + 'px' : elementWidth + 'px';
        const eleWidth: number = this.position === 'Left' ? elementWidth : - (elementWidth);
        removeClass([this.element], [PUSH, OVER, SLIDE]);
        switch (type) {
        case 'Push':
            addClass([this.element], [PUSH]);
            if (sibling && (this.enableDock || this.element.classList.contains(OPEN))) {
                sibling.style[this.position === 'Left' ? 'marginLeft' : 'marginRight'] = margin;
            } break;
        case 'Slide':
            addClass([this.element], [SLIDE]);
            if (sibling && (this.enableDock || this.element.classList.contains(OPEN))) {
                sibling.style.transform = 'translateX(' + eleWidth + 'px)';
            } break;
        case 'Over':
            addClass([this.element], [OVER]);
            if (this.enableDock && (this.element.classList.contains(CLOSE) || this.isOpen)) {
                if (sibling) {
                    sibling.style[this.position === 'Left' ? 'marginLeft' : 'marginRight'] = this.setDimension(this.dockSize);
                }
            }
            break;
        case 'Auto':
            addClass([this.element], [TRASITION]);
            if (Browser.isDevice) {
                if (sibling && (this.enableDock) && !this.getState()) {
                    sibling.style[this.position === 'Left' ? 'marginLeft' : 'marginRight'] = margin;
                    addClass([this.element], PUSH);
                } else {
                    addClass([this.element], OVER);
                }
            } else {
                addClass([this.element], PUSH);
                if (sibling && (this.enableDock || this.element.classList.contains(OPEN))) {
                    sibling.style[this.position === 'Left' ? 'marginLeft' : 'marginRight'] = margin;
                }
            }
            this.createBackDrop();
        }
    }

    /**
     * Removes the control from the DOM and detaches all its related event handlers. Also it removes the attributes and classes.
     *
     * @returns {void}
     *
     */
    public destroy(): void {
        super.destroy();
        if (this.target) {
            removeClass([<HTMLElement>this.target], CONTEXT);
        }
        this.destroyBackDrop();
        if (this.element) {
            removeClass([this.element], [OPEN, CLOSE, PUSH, SLIDE, OVER, LEFT, RIGHT, TRASITION, DISABLEANIMATION]);
            removeClass([this.element], SIDEBARABSOLUTE);
            this.element.style.width = '';
            this.element.style.zIndex = '';
            this.element.style.transform = '';
            if (!isNullOrUndefined(this.sidebarEleCopy.getAttribute('tabindex'))){
                this.element.setAttribute('tabindex', this.tabIndex);
            } else{
                this.element.removeAttribute('tabindex');
            }
        }
        this.windowWidth = null;
        const sibling: HTMLElement = <HTMLElement>document.querySelector('.e-main-content') || this.targetEle;
        if (!isNullOrUndefined(sibling)) {
            sibling.style.margin = '';
            sibling.style.transform = '';
        }
        this.unWireEvents();
    }
}
/**
 *
 * Defines the event arguments for the event.
 *
 * @returns void
 */

export interface ChangeEventArgs {
    /**
     * Returns event name
     */
    name: string;
    /**
     * Defines the element.
     */
    element: HTMLElement;
}

export interface TransitionEvent extends Event {
    /**
     * Returns event name
     */
    propertyName: string;
}

export interface EventArgs {
    /**
     * Illustrates whether the current action needs to be prevented or not.
     */
    cancel?: boolean;
    /**
     *  Defines the Sidebar model.
     */
    model?: SidebarModel;
    /**
     * Defines the element.
     */
    element: HTMLElement;
    /**
     * Defines the boolean that returns true when the Sidebar is closed by user interaction, otherwise returns false.
     */
    isInteracted?: boolean;

    /**
     * Defines the original event arguments.
     */
    event?: MouseEvent | Event;
}
