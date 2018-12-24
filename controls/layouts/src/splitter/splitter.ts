import { Component, Property, setStyleAttribute, ChildProperty, compile } from '@syncfusion/ej2-base';
import { NotifyPropertyChanges, addClass, Collection, isNullOrUndefined, append } from '@syncfusion/ej2-base';
import { Event, EmitType, EventHandler, selectAll, removeClass, select, Browser, detach, formatUnit } from '@syncfusion/ej2-base';
import { SplitterModel, PanePropertiesModel } from './splitter-model';

const ROOT: string = 'e-splitter';
const HORIZONTAL_PANE: string = 'e-splitter-horizontal';
const VERTICAL_PANE: string = 'e-splitter-vertical';
const PANE: string = 'e-pane';
const SPLIT_H_PANE: string = 'e-pane-horizontal';
const SPLIT_V_PANE: string = 'e-pane-vertical';
const SPLIT_BAR: string = 'e-split-bar';
const SPLIT_H_BAR: string = 'e-split-bar-horizontal';
const SPLIT_V_BAR: string = 'e-split-bar-vertical';
const STATIC_PANE: string = 'e-static-pane';
const SCROLL_PANE: string = 'e-scrollable';
const RESIZE_BAR: string = 'e-resize-handler';
const RESIZABLE_BAR: string = 'e-resizable-split-bar';
const SPLIT_BAR_LINE: string = 'e-split-line';
const SPLIT_BAR_HOVER: string = 'e-split-bar-hover';
const SPLIT_BAR_ACTIVE: string = 'e-split-bar-active';
const HIDE_HANDLER: string = 'e-hide-handler';
const SPLIT_TOUCH: string = 'e-splitter-touch';
const DISABLED: string = 'e-disabled';
const RTL: string = 'e-rtl';
const E_ICONS: string = 'e-icons';

/**
 * Interface to configure pane properties such as its content, size, min, max, and resizable.
 */
export class PaneProperties extends ChildProperty<PaneProperties> {
    /**
     * Configures the properties for each pane.
     * @default ''
     */
    @Property()
    public size: string;

    /**
     * Specifies the value whether a pane is resizable. By default, the Splitter is resizable in all panes.
     * You can disable this for any specific panes using this property.
     * @default true
     */
    @Property(true)
    public resizable: boolean;

    /**
     * Specifies the minimum size of a pane. The pane cannot be resized if it is less than the specified minimum size.
     * @default null
     */
    @Property(null)
    public min: string;

    /**
     * Specifies the maximum size of a pane. The pane cannot be resized if it is more than the specified maximum limit.
     * @default null
     */
    @Property(null)
    public max: string;

    /**
     * Specifies the content of split pane as plain text, HTML markup, or any other JavaScript controls.
     * @default ''
     */
    @Property()
    public content: string;
}

/**
 * Specifies a value that indicates whether to align the split panes horizontally or vertically.
 */
export type Orientation = 'Horizontal' | 'Vertical';

/**
 * Splitter is a layout user interface (UI) control that has resizable and collapsible split panes.
 * The container can be split into multiple panes, which are oriented horizontally or vertically.
 * The separator (divider) splits the panes and resizes and expands/collapses the panes.
 * The splitter is placed inside the split pane to make a nested layout user interface.
 * 
 * ```html
 * <div id="splitter">
 *  <div> Left Pane </div>
 *  <div> Center Pane </div>
 *  <div> Right Pane </div>
 * </div>
 * ```
 * ```typescript
 * <script>
 *   var splitterObj = new Splitter({ width: '300px', height: '200px'});
 *   splitterObj.appendTo('#splitter');
 * </script>
 * ```
 */

@NotifyPropertyChanges
export class Splitter extends Component<HTMLDivElement> {
    private allPanes: HTMLElement[] = [];
    private paneOrder: number[] = [];
    private separatorOrder: number[] = [];
    private currentSeparator: HTMLElement;
    private allBars: HTMLElement[] = [];
    private previousCoordinates: Coordinates = {};
    private currentCoordinates: Coordinates = {};
    private totalWidth: number;
    private totalPercent: number;
    private order: number;
    private previousPane: HTMLElement;
    private nextPane: HTMLElement;
    private prevPaneIndex: number;
    private previousPaneHeightWidth: string;
    private updatePrePaneInPercentage: boolean = false;
    private updateNextPaneInPercentage: boolean = false;
    private prePaneDimenson: number;
    private nextPaneDimension: number;
    private panesDimensions: number[] = [];
    private border: number = 0;
    private wrapper: HTMLElement;
    private wrapperParent: HTMLElement;
    private sizeFlag: boolean;
    // tslint:disable-next-line
    private prevPaneCurrentWidth: any;
    // tslint:disable-next-line
    private nextPaneCurrentWidth: any;
    private nextPaneIndex: number;
    // tslint:disable-next-line
    private nextPaneHeightWidth: any;
    private validDataAttributes: string [] = ['data-size', 'data-min', 'data-max', 'data-collapsible', 'data-resizable'];
    private validElementAttributes: string [] = ['data-orientation', 'data-width', 'data-height'];

    /**
     * Specifies the height of the Splitter component that accepts both string and number values.
     * @default '100%'
     */
    @Property('100%')
    public height: string;

    /**
     * Specifies the width of the Splitter control, which accepts both string and number values as width.
     * The string value can be either in pixel or percentage format.
     * @default '100%'
     */
    @Property('100%')
    public width: string;

    /**
     * Configures the individual pane behaviors such as content, size, resizable, minimum, and maximum validation.
     * @default []
     */
    @Collection<PanePropertiesModel>([], PaneProperties)
    public paneSettings: PanePropertiesModel[];

    /**
     * Specifies a value that indicates whether to align the split panes horizontally or vertically.
     *  * Set the orientation property as "Horizontal" to create a horizontal splitter that aligns the panes left-to-right.
     *  * Set the orientation property as "Vertical" to create a vertical splitter that aligns the panes top-to-bottom.
     * @default Horizontal 
     */
    @Property('Horizontal')
    public orientation: Orientation;

    /**
     * Specifies the CSS class names that defines specific user-defined
     * styles and themes to be appended on the root element of the Splitter.
     * It is used to customize the Splitter control.
     * One or more custom CSS classes can be specified to the Splitter.
     * @default ''
     */
    @Property('')
    public cssClass: string;

    /**
     * Specifies boolean value that indicates whether the component is enabled or disabled.
     * The Splitter component does not allow to interact when this property is disabled.
     * @default true
     */
    @Property(true)
    public enabled: boolean;

    /**
     * Enables or disables rendering of control from right-to-left (RTL) direction.
     * When it is set to true, the Splitter and its content will be displayed from right-to-left.
     * @default false
     */
    @Property(false)
    public enableRtl: boolean;

    /**
     * Specifies the size of the separator line for both horizontal or vertical orientation.
     * The separator is used to separate the panes by lines.
     * @default null
     */
    @Property(null)
    public separatorSize: number;

    /**
     * Triggers after creating the splitter component with its panes.
     * @event 
     */
    @Event()
    public created: EmitType<CreatedEventArgs>;

    /**
     * Triggers when the split pane is started to resize.
     * @event 
     */
    @Event()
    public resizeStart: EmitType<ResizeEventArgs>;

    /**
     * Triggers when a split pane is being resized.
     * @event 
     */
    @Event()
    public resizing: EmitType<ResizingEventArgs>;

    /**
     * Triggers when the resizing of split pane is stopped.
     * @event 
     */
    @Event()
    public resizeStop: EmitType<ResizingEventArgs>;

    /**
     * Initializes a new instance of the Splitter class.
     * @param options  - Specifies Splitter model properties as options.
     * @param element  - Specifies the element that is rendered as an Splitter.
     */

    constructor(options?: SplitterModel, element?: string | HTMLDivElement) {
        super(options, element);
    }

    /**
     * Gets called when the model property changes.The data that describes the old and new values of the property that changed.
     * @param  {SplitterModel} newProp
     * @param  {SplitterModel} oldProp
     * @returns void
     * @private
     */

    public onPropertyChanged(newProp: SplitterModel, oldProp: SplitterModel): void {
        if (!this.element.classList.contains(ROOT)) { return; }
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'height':
                    this.setSplitterSize(this.element, newProp.height, 'height');
                    break;
                case 'width':
                    this.setSplitterSize(this.element, newProp.width, 'width');
                    break;
                case 'cssClass':
                    this.setCssClass(newProp.cssClass);
                    break;
                case 'enabled':
                    this.isEnabled(this.enabled);
                    break;
                case 'separatorSize':
                    this.setSeparatorSize(newProp.separatorSize);
                    break;
                case 'orientation':
                    this.changeOrientation(newProp.orientation);
                    break;
                case 'paneSettings':
                    if (!(newProp.paneSettings instanceof Array && oldProp.paneSettings instanceof Array)) {
                        let changedProp: Object[] = Object.keys(newProp.paneSettings);
                        for (let j: number = 0; j < changedProp.length; j++) {
                            let index: number = parseInt(Object.keys(newProp.paneSettings)[j], 10);
                            let property: string = Object.keys(newProp.paneSettings[index])[0];
                            let newVal: string = Object(newProp.paneSettings[index])[property];
                            index = (this.enableRtl) ? (this.allBars.length - 1) - index : index;
                            if (property === 'content') {
                                this.allPanes[index].innerHTML = '';
                                this.setTemplate(newVal, this.allPanes[index]);
                            }
                            if (property === 'resizable') {
                                EventHandler.remove(this.allBars[index], 'mousedown', this.onMouseDown);
                                if (newVal) {
                                    EventHandler.add(this.allBars[index], 'mousedown', this.onMouseDown, this);
                                    this.currentSeparator = this.allBars[index];
                                    if (this.isResizable()) {
                                        this.showResizer(this.allBars[index]);
                                        this.allBars[index].classList.add(RESIZABLE_BAR);
                                    }
                                } else {
                                    this.hideResizer(this.allBars[index]);
                                    this.allBars[index].classList.remove(RESIZABLE_BAR);
                                }
                            }
                            if (property === 'size') {
                                this.allPanes[index].style.flexBasis = newVal;
                            }
                        }
                    }
                    break;
                case 'enableRtl':
                    this.setRTL(newProp.enableRtl);
                    break;
            }
        }
    }

    protected preRender(): void {
        this.wrapper = this.element.cloneNode(true) as HTMLElement;
        this.wrapperParent = this.element.parentElement;
        removeClass([this.wrapper], ['e-control', 'e-lib' , ROOT]);
        let orientation: string = this.orientation === 'Horizontal' ? HORIZONTAL_PANE : VERTICAL_PANE;
        addClass([this.element], orientation);
        if ( Browser.isDevice ) {
            addClass([this.element], SPLIT_TOUCH);
        }
    }

    protected getPersistData(): string {
        return this.addOnPersist([]);
    }
    /**
     * Returns the current module name.
     * @returns string
     * @private
     */
    protected getModuleName(): string {
        return 'splitter';
    }

    /**
     * To Initialize the control rendering
     * @private
     */
    public render(): void {
        this.checkDataAttributes();
        this.setCssClass(this.cssClass);
        this.isEnabled(this.enabled);
        this.setDimension(this.getHeight(this.element), this.getWidth(this.element));
        this.createSplitPane(this.element);
        this.addSeparator(this.element);
        this.getPanesDimensions();
        this.setRTL(this.enableRtl);
    }


    private checkDataAttributes() : void {
        let api: string;
        let value: string | boolean;
        // Element values
        for (let dataIndex: number = 0; dataIndex < this.validElementAttributes.length; dataIndex++) {
            value = this.element.getAttribute(this.validElementAttributes[dataIndex]);
            if (!isNullOrUndefined(value)) {
                api = this.removeDataPrefix(this.validElementAttributes[dataIndex]);
                // tslint:disable-next-line
                (this as any)[api] = value;
            }
        }
        // Pane values
        for (let paneIndex : number = 0; paneIndex < this.element.children.length; paneIndex++) {
            for (let dataAttr : number = 0; dataAttr < this.validDataAttributes.length; dataAttr++) {
                value = this.element.children[paneIndex].getAttribute(this.validDataAttributes[dataAttr]);
                if (!isNullOrUndefined(value)) {
                    api = this.removeDataPrefix(this.validDataAttributes[dataAttr]);
                    value = (api === 'collapsible' || api === 'resizable') ? (value === 'true') : value;
                    if (isNullOrUndefined(this.paneSettings[paneIndex])) {
                        this.paneSettings[paneIndex] = {
                            size: '',
                            min: null,
                            max: null,
                            content: '',
                            resizable: true,
                         };
                    }
                    // tslint:disable-next-line
                    let paneAPI: PanePropertiesModel = (this.paneSettings[paneIndex] as any)[api];
                    if (api === 'resizable' && this.paneSettings[paneIndex].resizable) {
                        // tslint:disable-next-line
                        (this.paneSettings[paneIndex] as any)[api] = value;
                    }
                    if (isNullOrUndefined(paneAPI) || paneAPI === '') {
                        // tslint:disable-next-line
                        (this.paneSettings[paneIndex] as any)[api] = value;
                    }
                }
            }
        }
    }

    private removeDataPrefix(attribute: string): string {
        return attribute.slice(attribute.lastIndexOf('-') + 1);
    }

    private setRTL(rtl: boolean): void {
        rtl ? addClass([this.element], RTL) : removeClass([this.element], RTL);
    }

    private setSplitterSize(element: HTMLElement, size: string, property: string): void {
        let style: { [key: string]: Object; } = property === 'width' ? { 'width': formatUnit(size) } : { 'height': formatUnit(size) };
        setStyleAttribute(element, style);
    }

    private getPanesDimensions(): void {
        for (let index: number = 0; index < this.allPanes.length; index++) {
            if (this.orientation === 'Horizontal') {
                this.panesDimensions.push(this.allPanes[index].getBoundingClientRect().width);
            } else {
                this.panesDimensions.push(this.allPanes[index].getBoundingClientRect().height);
            }
        }
    }

    private setCssClass(className: string): void {
        if ( className !== '') {
            addClass([this.element], className.split(' '));
        }
    }

    private hideResizer(target: HTMLElement): void {
        addClass([select('.' + RESIZE_BAR, target)], HIDE_HANDLER);
    }

    private showResizer(target: HTMLElement): void {
        removeClass([select('.' + RESIZE_BAR, target)], HIDE_HANDLER);
    }

    private isEnabled(enabled: boolean): void {
        enabled ? removeClass([this.element], DISABLED) : addClass([this.element], DISABLED);
    }

    private setSeparatorSize(size: number): void {
        let sizeValue: string = isNullOrUndefined(size) ? 'auto' : size + 'px';
        let seaprator: string = this.orientation === 'Horizontal' ? SPLIT_H_BAR : SPLIT_V_BAR;
        for (let index: number = 0; index < this.allBars.length; index++) {
            let splitBar: HTMLElement = selectAll('.' + seaprator, this.element)[index];
            let resizeBar: HTMLElement = selectAll('.' + RESIZE_BAR, splitBar)[0];
            if (this.orientation === 'Horizontal') {
                splitBar.style.width = sizeValue;
                if (!isNullOrUndefined(resizeBar)) {
                    resizeBar.style.width = sizeValue;
                }
            } else {
                splitBar.style.height = sizeValue;
                if (!isNullOrUndefined(resizeBar)) {
                    resizeBar.style.height = sizeValue;
                }
            }
        }
    }

    private changeOrientation(orientation: Orientation): void {
        let isVertical: boolean = orientation === 'Vertical';
        this.element.classList.remove(isVertical ? HORIZONTAL_PANE : VERTICAL_PANE);
        this.element.classList.add(isVertical ? VERTICAL_PANE : HORIZONTAL_PANE);
        this.element.removeAttribute('aria-orientation');
        this.element.setAttribute('aria-orientation', orientation);
        for (let index: number = 0; index < this.allPanes.length; index++) {
            this.allPanes[index].classList.remove(isVertical ? SPLIT_H_PANE : SPLIT_V_PANE);
            this.allPanes[index].classList.add(isVertical ? SPLIT_V_PANE : SPLIT_H_PANE);
        }
        for (let index: number = 0; index < this.allBars.length; index++) {
            this.allBars[index].classList.remove(isVertical ? SPLIT_H_BAR : SPLIT_V_BAR);
            this.allBars[index].classList.add(isVertical ? SPLIT_V_BAR : SPLIT_H_BAR);
        }
    }

    private getPrevPane(currentBar: Element, order: number): HTMLElement {
        let elementIndex: number = (this.enableRtl && this.orientation === 'Horizontal') ? ((order - 1) / 2) + 1 : (order - 1) / (2);
        return currentBar.parentElement.children[elementIndex] as HTMLElement;
    }

    private getNextPane(currentBar: Element, order: number): HTMLElement {
        let elementIndex: number = (this.enableRtl && this.orientation === 'Horizontal') ? (order - 1) / (2) : ((order - 1) / 2) + 1;
        return currentBar.parentElement.children[elementIndex] as HTMLElement;
    }

    private addResizeHandler(currentBar: HTMLElement): void {
        let resizeHanlder: HTMLElement = this.createElement('div');
        addClass([resizeHanlder], [RESIZE_BAR, E_ICONS]);
        let sizeValue: string = isNullOrUndefined(this.separatorSize) ? '1px' : this.separatorSize + 'px';
        if ( this.orientation === 'Horizontal') {
            resizeHanlder.style.width = sizeValue;
        } else {
            resizeHanlder.style.height = sizeValue;
        }
        currentBar.appendChild(resizeHanlder);
    }

    private getHeight(target: HTMLElement): string {
        let height: string = this.height;
        height = target.style.height !== '' && this.height === '100%' ? target.style.height : this.height;
        return height;
    }

    private getWidth(target: HTMLElement): string {
        let width: string = this.width;
        width = target.style.width !== '' && this.width === '100%' ? target.style.width : this.width;
        return width;
    }

    private setDimension(height: string, width: string): void {
        setStyleAttribute(this.element, { 'height': height, 'width': width });
    }

    private createSeparator(i: number): HTMLElement {
        let separator: HTMLElement = this.createElement('div');
        this.allBars.push(separator);
        if (this.orientation === 'Horizontal') {
            addClass([separator], [SPLIT_BAR, SPLIT_H_BAR]);
            separator.style.width = isNullOrUndefined(this.separatorSize) ? 'auto' : this.separatorSize + 'px';
        } else {
            addClass([separator], [SPLIT_BAR, SPLIT_V_BAR]);
            separator.style.height = isNullOrUndefined(this.separatorSize) ? 'auto' : this.separatorSize + 'px';
        }
        this.addMouseActions(separator);
        this.addResizeHandler(separator);
        return separator;
    }

    private addSeparator(target: HTMLElement): void {
        let childCount: number = this.allPanes.length;
        let clonedEle: HTMLCollection = <HTMLCollection>target.children;
        for (let i: number = 0; i < childCount; i++) {
            if (i < childCount - 1) {
                let separator: HTMLElement = this.createSeparator(i);
                setStyleAttribute(<HTMLDivElement>separator, { 'order': (i * 2) + 1 });
                this.separatorOrder.push((i * 2) + 1);
                clonedEle[i].parentNode.appendChild(separator);
                this.currentSeparator = separator;
                separator.setAttribute('role', 'separator');
                if (this.isResizable()) {
                    EventHandler.add(separator, 'mousedown', this.onMouseDown, this);
                    let eventName: string = (Browser.info.name === 'msie') ? 'pointerdown' : 'touchstart';
                    EventHandler.add(separator, eventName, this.onMouseDown, this);
                    separator.classList.add(RESIZABLE_BAR);
                } else {
                    this.hideResizer(separator);
                }
            }
        }
    }

    private isResizable(): boolean {
        let resizable: boolean = false;
        if ((!isNullOrUndefined(this.paneSettings[this.getPreviousPaneIndex()]) &&
            this.paneSettings[this.getPreviousPaneIndex()].resizable &&
            !isNullOrUndefined(this.paneSettings[this.getNextPaneIndex()]) &&
            this.paneSettings[this.getNextPaneIndex()].resizable) ||
            isNullOrUndefined(this.paneSettings[this.getNextPaneIndex()])) {
            resizable = true;
        }
        return resizable;
    }

    private addMouseActions(separator: HTMLElement): void {
        separator.addEventListener('mouseover', () => {
            addClass([separator], [SPLIT_BAR_HOVER]);
        });
        separator.addEventListener('mouseout', () => {
            removeClass([separator], [SPLIT_BAR_HOVER]);
        });
    }

    private getEventType(e: string): string {
        return (e.indexOf('mouse') > -1) ? 'mouse' : 'touch';
    }

    private updateCurrentSeparator(target: HTMLElement): void {
        this.currentSeparator = !this.isSeparator(target) ? target.parentElement : target;
    }

    private isSeparator(target: HTMLElement): boolean {
        let isSeparatorLine: boolean = true;
        if (target.classList.contains(RESIZE_BAR) || target.classList.contains(SPLIT_BAR_LINE)) {
            isSeparatorLine = false;
        }
        return isSeparatorLine;
    }

    private isMouseEvent(e: MouseEvent | TouchEvent | PointerEvent): boolean {
        let isMouse: boolean = false;
        if (this.getEventType(e.type) === 'mouse' || (!isNullOrUndefined((<PointerEvent>e).pointerType) &&
        this.getEventType((<PointerEvent>e).pointerType) === 'mouse')) {
            isMouse = true;
        }
        return isMouse;
    }

    private updateCursorPosition(e: MouseEvent | TouchEvent | PointerEvent, type: string): void {
        if (this.isMouseEvent(e)) {
            this.changeCoordinates({ x: (<MouseEvent>e).pageX, y: (<MouseEvent>e).pageY }, type);
        } else {
            let eventType: MouseEvent | Touch = Browser.info.name !== 'msie' ? (<TouchEvent>e).touches[0] : (<MouseEvent>e);
            this.changeCoordinates({ x: eventType.pageX, y: eventType.pageY }, type);
        }
    }

    private changeCoordinates(coordinates: Coordinates, type: string): void {
        if (type === 'previous') {
            this.previousCoordinates = coordinates;
        } else {
            this.currentCoordinates = coordinates;
        }
    }

    private wireResizeEvents(): void {
        EventHandler.add(document, 'mousemove', this.onMouseMove, this);
        EventHandler.add(document, 'mouseup', this.onMouseUp, this);
        let touchMoveEvent: string = (Browser.info.name === 'msie') ? 'pointermove' : 'touchmove';
        let touchEndEvent: string = (Browser.info.name === 'msie') ? 'pointerup' : 'touchend';
        EventHandler.add(document, touchMoveEvent, this.onMouseMove, this);
        EventHandler.add(document, touchEndEvent, this.onMouseUp, this);
    }

    private unwireResizeEvents(): void {
        let touchMoveEvent: string = (Browser.info.name === 'msie') ? 'pointermove' : 'touchmove';
        let touchEndEvent: string = (Browser.info.name === 'msie') ? 'pointerup' : 'touchend';
        EventHandler.remove(document, 'mousemove', this.onMouseMove);
        EventHandler.remove(document, 'mouseup', this.onMouseUp);
        EventHandler.remove(document, touchMoveEvent, this.onMouseMove);
        EventHandler.remove(document, touchEndEvent, this.onMouseUp);
    }

    private onMouseDown(e: MouseEvent | TouchEvent | PointerEvent): void {
        e.preventDefault();
        let target: HTMLElement = e.target as HTMLElement;
        this.updateCurrentSeparator(target);
        addClass([this.currentSeparator], SPLIT_BAR_ACTIVE);
        this.updateCursorPosition(e, 'previous');
        this.getPaneDetails();
        let eventArgs: ResizeEventArgs = {
            element: this.element,
            event: e,
            pane: [this.previousPane, this.nextPane],
            index: [this.getPreviousPaneIndex(), this.getNextPaneIndex()],
            separator: this.currentSeparator,
            cancel: false
        };
        this.trigger('resizeStart', eventArgs);
        if (eventArgs.cancel) { return; }
        this.wireResizeEvents();
        if (this.previousPane.style.flexBasis.indexOf('%') > 0 || this.nextPane.style.flexBasis.indexOf('%') > 0) {
            let previousFlexBasis: number = this.updatePaneFlexBasis(this.previousPane);
            let nextFlexBasis: number = this.updatePaneFlexBasis(this.nextPane);
            this.totalPercent = previousFlexBasis + nextFlexBasis;
            this.totalWidth = this.convertPercentageToPixel(this.totalPercent + '%');
        } else {
            this.totalWidth = (this.orientation === 'Horizontal') ? this.previousPane.offsetWidth + this.nextPane.offsetWidth :
                this.previousPane.offsetHeight + this.nextPane.offsetHeight;
        }
    }

    private updatePaneFlexBasis( pane: HTMLElement ): number {
        let previous: number;
        if (pane.style.flexBasis.indexOf('%') > 0) {
            previous = this.removePercentageUnit(pane.style.flexBasis);
        } else {
            if (pane.style.flexBasis !== '') {
                previous = this.convertPixelToPercentage(this.convertPixelToNumber(pane.style.flexBasis));
            } else {
                let offset: number = (this.orientation === 'Horizontal') ? (pane.offsetWidth + this.currentSeparator.offsetWidth) :
                (pane.offsetHeight + this.currentSeparator.offsetHeight);
                previous = this.convertPixelToPercentage(offset);
            }
        }
        return previous;
    }

    private removePercentageUnit(value: string): number {
        return parseFloat(value.slice(0, value.indexOf('%')));
    }

    private convertPercentageToPixel(value: string, targetElement?: HTMLElement): number {
        let percentage: string = value.toString();
        let convertedValue: number;
        if (percentage.indexOf('%') > -1) {
            convertedValue = parseFloat(percentage.slice(0, percentage.indexOf('%')));
            let offsetValue: number;
            if (!isNullOrUndefined(targetElement)) {
                offsetValue = this.panesDimensions[this.allPanes.indexOf(targetElement)];
            } else {
                offsetValue = (this.orientation === 'Horizontal') ? this.element.offsetWidth : this.element.offsetHeight;
            }
            convertedValue = Math.ceil(offsetValue * (convertedValue / 100));
        } else {
            convertedValue = parseInt(percentage, 10);
        }
        return convertedValue;
    }

    private convertPixelToPercentage(value: number): number {
        let offsetValue: number = (this.orientation === 'Horizontal') ? this.element.offsetWidth : this.element.offsetHeight;
        return (value / offsetValue) * 100;
    }

    private convertPixelToNumber(value: string): number {
        if (value.indexOf('p') > -1) {
            return parseFloat(value.slice(0, value.indexOf('p')));
        } else {
            return parseFloat(value);
        }
    }

    private calcDragPosition (rectValue: number, offsetValue: number): number {
        let separatorPosition: number; let separator: number;
        separatorPosition = this.orientation === 'Horizontal' ? ( this.currentCoordinates.x - rectValue) :
        ( this.currentCoordinates.y - rectValue);
        separator = separatorPosition / offsetValue;
        separator = (separator > 1) ? 1 : (separator < 0) ? 0 : separator;
        return separator * offsetValue;
    }

    private getSeparatorPosition(e: MouseEvent | TouchEvent | PointerEvent): number {
        this.updateCursorPosition(e, 'current');
        let rectBound: number = (this.orientation === 'Horizontal') ? this.element.getBoundingClientRect().left :
          this.element.getBoundingClientRect().top;
        let offSet: number = (this.orientation === 'Horizontal') ? this.element.offsetWidth : this.element.offsetHeight;
        return this.calcDragPosition(rectBound, offSet);
    }

    private getMinMax(paneIndex: number, target: HTMLElement, selection: string): number {
        let defaultVal: number = selection === 'min' ? 0 : null;
        // tslint:disable-next-line
        let paneValue: any = null;
        if (selection === 'min') {
            if (!isNullOrUndefined(this.paneSettings[paneIndex]) &&
            !isNullOrUndefined(this.paneSettings[paneIndex].min)) {
                paneValue = this.paneSettings[paneIndex].min;
            }
        } else {
            if (!isNullOrUndefined(this.paneSettings[paneIndex]) &&
            !isNullOrUndefined(this.paneSettings[paneIndex].max)) {
                paneValue = this.paneSettings[paneIndex].max;
            }
        }
        if (this.paneSettings.length > 0 && !isNullOrUndefined(this.paneSettings[paneIndex]) &&
            !isNullOrUndefined(paneValue)) {
            if (paneValue.indexOf('%') > 0) {
                paneValue = this.convertPercentageToPixel(paneValue).toString();
            }
            return this.convertPixelToNumber(paneValue);
        } else {
            return defaultVal;
        }
    }

    private getPreviousPaneIndex(): number {
        let prePaneIndex: number = ((parseInt(this.currentSeparator.style.order, 10) - 1) / 2);
        return (this.enableRtl) ? prePaneIndex + 1 : prePaneIndex;
    }

    private getNextPaneIndex(): number {
        let nextPaneIndex: number = (parseInt(this.currentSeparator.style.order, 10) - 1) / (2);
        return (this.enableRtl) ? nextPaneIndex : nextPaneIndex + 1;
    }

    private getPaneDetails(): void {
        this.order = parseInt(this.currentSeparator.style.order, 10);
        this.previousPane = this.getPrevPane(this.currentSeparator, this.order);
        this.nextPane = this.getNextPane(this.currentSeparator, this.order);
        this.prevPaneIndex = this.getPreviousPaneIndex();
        this.nextPaneIndex = this.getNextPaneIndex();
    }

    private getPaneHeight(pane: HTMLElement): string {
        return (this.orientation === 'Horizontal') ? pane.offsetWidth.toString() :
          pane.offsetHeight.toString();
    }

    private boundingRectValues(pane: HTMLElement): number {
        return (this.orientation === 'Horizontal') ? pane.getBoundingClientRect().width :
            pane.getBoundingClientRect().height;
    }

    private isValidSize(paneIndex: number): boolean {
        let isValid: boolean = false;
        if (!isNullOrUndefined(this.paneSettings[paneIndex]) &&
            !isNullOrUndefined(this.paneSettings[paneIndex].size) &&
            this.paneSettings[paneIndex].size.indexOf('%') > -1) {
            isValid = true;
        }
        return isValid;
    }

    private getPaneDimensions(): void {
        this.previousPaneHeightWidth = (this.previousPane.style.flexBasis === '') ? this.getPaneHeight(this.previousPane) :
            this.previousPane.style.flexBasis;
        this.nextPaneHeightWidth = (this.nextPane.style.flexBasis === '') ? this.getPaneHeight(this.nextPane) :
            this.nextPane.style.flexBasis;
        if (this.paneSettings.length < 1) {
            this.prePaneDimenson = this.boundingRectValues(this.previousPane);
            this.nextPaneDimension = this.boundingRectValues(this.nextPane);
            return;
        }
        if (this.isValidSize(this.prevPaneIndex)) {
            this.previousPaneHeightWidth = this.convertPercentageToPixel(this.previousPaneHeightWidth).toString();
            this.updatePrePaneInPercentage = true;
        }
        if (this.isValidSize(this.nextPaneIndex)) {
            this.nextPaneHeightWidth = this.convertPercentageToPixel(this.nextPaneHeightWidth).toString();
            this.updateNextPaneInPercentage = true;
        }
        this.prePaneDimenson = this.convertPixelToNumber(this.previousPaneHeightWidth.toString());
        this.nextPaneDimension = this.convertPixelToNumber(this.nextPaneHeightWidth.toString());
    }

    private checkCoordinates(pageX: number, pageY: number) : boolean {
        let coordinatesChanged: boolean = true;
        if ((pageX === this.previousCoordinates.x || pageY === this.previousCoordinates.y)) {
            coordinatesChanged = false;
        }
        return coordinatesChanged;
    }

    private isCursorMoved(e: MouseEvent | TouchEvent | PointerEvent): boolean {
        let cursorMoved: boolean = true;
        if (this.getEventType(e.type) === 'mouse' || (!isNullOrUndefined((<PointerEvent>e).pointerType)) &&
        this.getEventType((<PointerEvent>e).pointerType) === 'mouse') {
            cursorMoved = this.checkCoordinates((<MouseEvent>e).pageX, (<MouseEvent>e).pageY);
        } else {
            cursorMoved = (Browser.info.name !== 'msie') ?
            this.checkCoordinates((<TouchEvent>e).touches[0].pageX, (<TouchEvent>e).touches[0].pageY) :
            this.checkCoordinates((<MouseEvent>e).pageX, (<MouseEvent>e).pageY);
        }
        return cursorMoved;
    }

    private getBorder(): void {
        this.border = 0;
        let border: number  = this.orientation === 'Horizontal' ? ((this.element.offsetWidth - this.element.clientWidth) / 2) :
        (this.element.offsetHeight - this.element.clientHeight) / 2;
        this.border = Browser.info.name !== 'chrome' ? this.border : border;
    }

    private onMouseMove(e: MouseEvent | TouchEvent | PointerEvent): void {
        if (!this.isCursorMoved(e)) { return; }
        this.getPaneDetails();
        this.getPaneDimensions();
        let eventArgs: ResizingEventArgs = {
            element: this.element,
            event: e,
            pane: [this.previousPane, this.nextPane],
            index: [this.prevPaneIndex, this.nextPaneIndex],
            paneSize: [this.prePaneDimenson, this.nextPaneDimension],
            separator: this.currentSeparator
        };
        this.trigger('resizing', eventArgs);
        let left: number = this.validateDraggedPosition(this.getSeparatorPosition(e), this.prePaneDimenson, this.nextPaneDimension);
        let separatorNewPosition: number;
        this.getBorder();
        if (this.orientation === 'Horizontal') {
            separatorNewPosition = (this.element.getBoundingClientRect().left + left) -
                this.currentSeparator.getBoundingClientRect().left + this.border;
        } else {
            separatorNewPosition = (this.element.getBoundingClientRect().top + left) -
                this.currentSeparator.getBoundingClientRect().top + this.border;
        }
        this.nextPaneHeightWidth =
            (typeof (this.nextPaneHeightWidth) === 'string' && this.nextPaneHeightWidth.indexOf('p') > -1) ?
                this.convertPixelToNumber(this.nextPaneHeightWidth) : parseInt(this.nextPaneHeightWidth, 10);
        this.prevPaneCurrentWidth = separatorNewPosition + this.convertPixelToNumber(this.previousPaneHeightWidth);
        this.nextPaneCurrentWidth = this.nextPaneHeightWidth - separatorNewPosition;
        this.validateMinMaxValues();
        if (this.nextPaneCurrentWidth < 0) { this.nextPaneCurrentWidth = 0; }
        /* istanbul ignore next */
        if (this.prevPaneCurrentWidth < 0) { this.prevPaneCurrentWidth = 0; }
        if ((this.nextPaneCurrentWidth + this.prevPaneCurrentWidth) > this.totalWidth) {
            if (this.nextPaneCurrentWidth < this.prevPaneCurrentWidth) {
                this.prevPaneCurrentWidth = this.prevPaneCurrentWidth - ((this.nextPaneCurrentWidth + this.prevPaneCurrentWidth)
                    - this.totalWidth);
            } else {
                this.nextPaneCurrentWidth = this.nextPaneCurrentWidth - ((this.nextPaneCurrentWidth + this.prevPaneCurrentWidth)
                    - this.totalWidth);
            }
        }
        /* istanbul ignore next */
        if ((this.nextPaneCurrentWidth + this.prevPaneCurrentWidth) < this.totalWidth) {
            let difference: number = this.totalWidth - ((this.nextPaneCurrentWidth + this.prevPaneCurrentWidth));
            this.nextPaneCurrentWidth = this.nextPaneCurrentWidth + difference;
        }
        this.calculateCurrentDimensions();
        this.addStaticPaneClass();
        this.previousPane.style.flexBasis = this.prevPaneCurrentWidth;
        this.nextPane.style.flexBasis = this.nextPaneCurrentWidth;
    }

    private validateMinRange(paneIndex: number, paneCurrentWidth: number, pane: HTMLElement): number {
        let paneMinRange: string | number = null;
        let paneMinDimensions: number;
        let difference: number = 0;
        let validatedVal: number;
        if (!isNullOrUndefined(this.paneSettings[paneIndex]) && !isNullOrUndefined(this.paneSettings[paneIndex].min)) {
            paneMinRange = this.paneSettings[paneIndex].min.toString();
        }
        if (!isNullOrUndefined(paneMinRange)) {
            if ((<string>paneMinRange).indexOf('%') > 0) {
                paneMinRange = this.convertPercentageToPixel((<string>paneMinRange)).toString();
            }
            paneMinDimensions = this.convertPixelToNumber((<string>paneMinRange));
            if (paneCurrentWidth < paneMinDimensions) {
                difference = (paneCurrentWidth - paneMinDimensions) <= 0 ? 0 :
                    (paneCurrentWidth - paneMinDimensions);
                this.totalWidth = this.totalWidth - difference;
                this.totalPercent = this.convertPixelToPercentage(this.totalWidth);
                validatedVal = paneMinDimensions;
            }
        }
        return isNullOrUndefined(validatedVal) ? paneCurrentWidth : validatedVal;
    }

    private validateMaxRange(paneIndex: number, paneCurrentWidth: number, pane: HTMLElement): number {
        let paneMaxRange: string | number = null;
        let paneMaxDimensions: number;
        let validatedVal: number;
        if (!isNullOrUndefined(this.paneSettings[paneIndex]) && !isNullOrUndefined(this.paneSettings[paneIndex].max)) {
            paneMaxRange = this.paneSettings[paneIndex].max.toString();
        }
        if (!isNullOrUndefined(paneMaxRange)) {
            if ((<string>paneMaxRange).indexOf('%') > 0) {
                paneMaxRange = this.convertPercentageToPixel(<string>paneMaxRange).toString();
            }
            paneMaxDimensions = this.convertPixelToNumber(<string>paneMaxRange);
            if (paneCurrentWidth > paneMaxDimensions) {
                this.totalWidth = this.totalWidth - (paneCurrentWidth - paneMaxDimensions);
                this.totalPercent = this.convertPixelToPercentage(this.totalWidth);
                validatedVal = paneMaxDimensions;
            }
        }
        return isNullOrUndefined(validatedVal) ? paneCurrentWidth : validatedVal;
    }

    private validateMinMaxValues(): void {
        //validate previous pane minimum range
        this.prevPaneCurrentWidth = this.validateMinRange(this.prevPaneIndex, this.prevPaneCurrentWidth, this.previousPane);
        // Validate next pane minimum range
        this.nextPaneCurrentWidth = this.validateMinRange(this.nextPaneIndex, this.nextPaneCurrentWidth, this.nextPane);
        // validate previous pane maximum range
        this.prevPaneCurrentWidth = this.validateMaxRange(this.prevPaneIndex, this.prevPaneCurrentWidth, this.previousPane);
        // validate next pane maximum range
        this.nextPaneCurrentWidth = this.validateMaxRange(this.nextPaneIndex, this.nextPaneCurrentWidth, this.nextPane);
    }

    private equatePaneWidths(): void {
        let difference: number;
        if ((this.prevPaneCurrentWidth + this.nextPaneCurrentWidth) > this.totalPercent) {
            difference = (this.prevPaneCurrentWidth + this.nextPaneCurrentWidth) - this.totalPercent;
            this.prevPaneCurrentWidth = this.prevPaneCurrentWidth - (difference / 2) + '%';
            this.nextPaneCurrentWidth = this.nextPaneCurrentWidth - (difference / 2) + '%';
        }
        if ((this.prevPaneCurrentWidth + this.nextPaneCurrentWidth) < this.totalPercent) {
            difference = this.totalPercent - (this.prevPaneCurrentWidth + this.nextPaneCurrentWidth);
            this.prevPaneCurrentWidth = this.prevPaneCurrentWidth + (difference / 2) + '%';
            this.nextPaneCurrentWidth = this.nextPaneCurrentWidth + (difference / 2) + '%';
        }
    }

    private calculateCurrentDimensions(): void {
        if (this.updatePrePaneInPercentage || this.updateNextPaneInPercentage) {
            this.prevPaneCurrentWidth = Math.round(Number(Math.round(this.convertPixelToPercentage(this.prevPaneCurrentWidth)
                * 10) / 10));
            this.nextPaneCurrentWidth = Math.round(Number(Math.round(this.convertPixelToPercentage(this.nextPaneCurrentWidth)
                * 10) / 10));
            if (this.prevPaneCurrentWidth === 0) { this.nextPaneCurrentWidth = this.totalPercent; }
            if (this.nextPaneCurrentWidth === 0) { this.prevPaneCurrentWidth = this.totalPercent; }
            if (this.prevPaneCurrentWidth + this.nextPaneCurrentWidth !== this.totalPercent) {
                this.equatePaneWidths();
            } else {
                this.prevPaneCurrentWidth = this.prevPaneCurrentWidth + '%';
                this.nextPaneCurrentWidth = this.nextPaneCurrentWidth + '%';
            }
            this.prevPaneCurrentWidth = (this.updatePrePaneInPercentage) ? this.prevPaneCurrentWidth :
                this.convertPercentageToPixel(this.prevPaneCurrentWidth) + 'px';
            this.nextPaneCurrentWidth = (this.updateNextPaneInPercentage) ? this.nextPaneCurrentWidth :
                this.convertPercentageToPixel(this.nextPaneCurrentWidth) + 'px';
            this.updatePrePaneInPercentage = false;
            this.updateNextPaneInPercentage = false;
        } else {
            this.prevPaneCurrentWidth = this.prevPaneCurrentWidth + 'px';
            this.nextPaneCurrentWidth = this.nextPaneCurrentWidth + 'px';
        }
    }

    private addStaticPaneClass(): void {
        if (!this.previousPane.classList.contains(STATIC_PANE)) {
            this.previousPane.classList.add(STATIC_PANE);
        }
        if (!this.nextPane.classList.contains(STATIC_PANE)) {
            this.nextPane.classList.add(STATIC_PANE);
        }
    }

    private validateDraggedPosition(draggedPos: number, prevPaneHeightWidth: number, nextPaneHeightWidth: number): number {
        let separatorTopLeft: number = (this.orientation === 'Horizontal') ? this.currentSeparator.offsetLeft :
            this.currentSeparator.offsetTop;
        let prePaneRange: number = separatorTopLeft - prevPaneHeightWidth;
        let nextPaneRange: number = nextPaneHeightWidth + separatorTopLeft;
        let pane1MinSize: number = this.getMinMax(this.prevPaneIndex, this.previousPane, 'min');
        let pane2MinSize: number = this.getMinMax(this.nextPaneIndex, this.nextPane, 'min');
        let pane1MaxSize: number = this.getMinMax(this.prevPaneIndex, this.previousPane, 'max');
        let pane2MaxSize: number = this.getMinMax(this.nextPaneIndex, this.nextPane, 'max');
        let validatedSize: number = draggedPos;
        if (draggedPos > nextPaneRange - pane2MinSize) {
            validatedSize = nextPaneRange - pane2MinSize;
        } else if (draggedPos < prePaneRange + pane1MinSize) {
            validatedSize = prePaneRange + pane1MinSize;
        }
        if (!isNullOrUndefined(pane1MaxSize)) {
            if (draggedPos > prePaneRange + pane1MaxSize) {
                validatedSize = prePaneRange + pane1MaxSize;
            }
        } else if (!isNullOrUndefined(pane2MaxSize)) {
            if (draggedPos < nextPaneRange - pane2MaxSize) {
                validatedSize = nextPaneRange - pane2MaxSize;
            }
        }
        return validatedSize;
    }

    private onMouseUp(e: MouseEvent | TouchEvent | PointerEvent): void {
        removeClass([this.currentSeparator], SPLIT_BAR_ACTIVE);
        this.unwireResizeEvents();
        let eventArgs: ResizingEventArgs = {
            event: e,
            element: this.element,
            pane: [this.previousPane, this.nextPane],
            index: [this.prevPaneIndex, this.nextPaneIndex],
            separator: this.currentSeparator,
            paneSize: [this.prePaneDimenson, this.nextPaneDimension]
        };
        this.trigger('resizeStop', eventArgs);
    }

    private panesDimension(index: number, child: HTMLElement[]): void {
        let childCount: number = child.length;
        let size: string | number;
        parseInt(<string>this.getHeight(this.element), 10);
        if (!isNullOrUndefined(this.paneSettings[index])) {
            if (!isNullOrUndefined(this.paneSettings[index].size)) {
                size = this.paneSettings[index].size;
                if (index < childCount) {
                    setStyleAttribute(<HTMLElement>child[index], { 'flex-basis': size, 'order': index * 2 });
                    if (index < childCount - 1) {
                        addClass([child[index]], STATIC_PANE);
                    } else if (!this.sizeFlag) {
                        (<HTMLElement>child[index]).style.flexBasis = null;
                    }
                    if ((index === childCount - 1) && this.sizeFlag) {
                        addClass([child[index]], STATIC_PANE);
                    }
                }
            } else {
                this.sizeFlag = true;
                setStyleAttribute(<HTMLElement>child[index], { 'order': index * 2 });
            }
        } else {
            setStyleAttribute(<HTMLElement>child[index], { 'order': index * 2 });
        }
        this.paneOrder.push(index * 2);
    }

    private setTemplate(template: string, toElement: HTMLElement): void {
        let templateFn: Function = compile(template);
        let fromElements: HTMLElement[] = [];
        for (let item of templateFn({})) {
            fromElements.push(item);
        }
        append([].slice.call(fromElements), toElement);
    }

    private createSplitPane(target: HTMLDivElement): void {
        let childCount: number = target.children.length;
        if (childCount < this.paneSettings.length) {
            for (let i: number = 0; i < this.paneSettings.length; i++) {
                let childElement: HTMLElement = this.createElement('div');
                this.element.appendChild(childElement);
            }
        }
        childCount = target.children.length;
        let child: HTMLElement[] = [].slice.call(target.children);
        this.element.setAttribute('aria-orientation', this.orientation);
        this.element.setAttribute('role', 'splitter');
        this.sizeFlag = false;
        if (childCount > 1) {
            for (let i: number = 0; i < childCount; i++) {
                // to get only div element
                if (child[i].nodeType === 1) {
                    this.allPanes.push(<HTMLElement>child[i]);
                    if (this.orientation === 'Horizontal') {
                        addClass([child[i]], [PANE, SPLIT_H_PANE, SCROLL_PANE]);
                        this.panesDimension(i, child);
                    } else {
                        addClass([child[i]], [PANE, SPLIT_V_PANE, SCROLL_PANE]);
                        this.panesDimension(i, child);
                    }
                    if (!isNullOrUndefined(this.paneSettings[i]) && !isNullOrUndefined(this.paneSettings[i].content)) {
                        this.setTemplate(this.paneSettings[i].content, child[i] as HTMLElement);
                    }
                }
            }
        }
    };

    /**
     * Removes the control from the DOM and also removes all its related events.
     * @returns void
     */
    public destroy(): void {
        detach(this.element);
        this.element = this.wrapper as HTMLDivElement;
        this.wrapperParent.appendChild(<HTMLElement>this.wrapper);
    }

    private addPaneClass(pane: HTMLElement): HTMLElement {
        if (this.orientation === 'Horizontal') {
            addClass([pane], [PANE, SPLIT_H_PANE, SCROLL_PANE]);
        } else {
            addClass([pane], [PANE, SPLIT_V_PANE, SCROLL_PANE]);
        }
        return pane;
    }

    private removePaneOrders(paneClass: string) : void {
        let panes: NodeListOf<HTMLElement> = document.querySelectorAll('.' + paneClass) as NodeListOf<HTMLElement>;
        for (let i: number = 0; i < panes.length; i++) {
            panes[i].style.removeProperty('order');
        }
    }

    private setPaneOrder() : void {
        for (let i : number = 0; i < this.allPanes.length; i++) {
            this.panesDimension(i, this.allPanes);
        }
    }

    public removeSeparator() : void {
        for (let i: number = 0; i < this.allBars.length; i ++) {
            detach(this.allBars[i]);
        }
        this.allBars = [];
    }

    private updatePanes() : void {
        this.setPaneOrder();
        this.removeSeparator();
        this.addSeparator(this.element);
    }

    public addPane(paneProperties: PanePropertiesModel, index: number) : void {
        let newPane : HTMLElement = this.createElement('div');
        newPane = this.addPaneClass(newPane);
        index = (index > this.allPanes.length + 1) ? this.allPanes.length : index;
        let paneDetails: PanePropertiesModel = {
            size: isNullOrUndefined(paneProperties.size) ? '' : paneProperties.size,
            min: isNullOrUndefined(paneProperties.min) ? null : paneProperties.min,
            max: isNullOrUndefined(paneProperties.max) ? null : paneProperties.max,
            content: isNullOrUndefined(paneProperties.content) ? '' : paneProperties.content,
            resizable: isNullOrUndefined(paneProperties.resizable) ? true : paneProperties.resizable
        };
        this.paneSettings.splice(index , 0, paneDetails);
        if (this.orientation === 'Horizontal') {
            this.element.insertBefore(newPane, this.element.querySelectorAll('.' + SPLIT_H_PANE)[index]);
            this.removePaneOrders(SPLIT_H_PANE);
        } else {
            this.element.insertBefore(newPane, this.element.querySelectorAll('.' + SPLIT_V_PANE)[index]);
            this.removePaneOrders(SPLIT_V_PANE);
        }
        this.allPanes.splice(index, 0, newPane);
        this.updatePanes();
        this.setTemplate(this.paneSettings[index].content, newPane);
        this.allPanes[this.allPanes.length - 1].classList.remove(STATIC_PANE);
    }

    public removePane(index: number) : void {
        index = (index > this.allPanes.length + 1) ? this.allPanes.length : index;
        let elementClass: string = (this.orientation === 'Horizontal') ? SPLIT_H_PANE : SPLIT_V_PANE;
        detach(this.element.querySelectorAll('.' + elementClass)[index]);
        this.allPanes.splice(index, 1);
        this.removePaneOrders(elementClass);
        this.updatePanes();
        this.allPanes[this.allPanes.length - 1].classList.remove(STATIC_PANE);
    }
}

/**
 * Interface for accessing element coordinates
 * @private
 */

interface Coordinates {
    /**
     * x coordinate of an element
     */
    x ?: number;
    /**
     * y coordinate of an element.
     */
    y ?: number;
}

export interface CreatedEventArgs {
    /**
     * Contains the root element of splitter.
     */
    element?: HTMLElement;
}

export interface ResizeEventArgs {
    /** Contains the root element of resizing pane. */
    element?: HTMLElement;
    /** Contains default event arguments. */
    event?: Event;
    /** Contains the corresponding resizing pane. */
    pane?: HTMLElement[];
    /** Contains the index of resizing pane. */
    index?: number[];
    /** Contains the resizing pane’s separator element. */
    separator?: HTMLElement;
    /** 
     * Control the resize action whether the resize action happens continuously.
     * When you set this argument to true, resize process will be stopped.
     */
    cancel?: boolean;
}

export interface ResizingEventArgs {
    /** Contains the root element of resizing pane. */
    element?: HTMLElement;
    /** Contains default event arguments. */
    event?: Event;
    /** Contains a pane size when it resizes. */
    paneSize?: number[];
    /** Contains the corresponding resizing pane. */
    pane?: HTMLElement[];
    /** Contains the index of resizing pane. */
    index?: number[];
    /** Contains the resizing pane’s separator element. */
    separator?: HTMLElement;
}
