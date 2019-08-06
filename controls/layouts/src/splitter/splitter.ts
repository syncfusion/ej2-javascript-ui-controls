import { Component, Property, setStyleAttribute, ChildProperty, compile } from '@syncfusion/ej2-base';
import { NotifyPropertyChanges, addClass, Collection, isNullOrUndefined, updateBlazorTemplate } from '@syncfusion/ej2-base';
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
const SPLIT_BAR_HOVER: string = 'e-split-bar-hover';
const SPLIT_BAR_ACTIVE: string = 'e-split-bar-active';
const HIDE_HANDLER: string = 'e-hide-handler';
const SPLIT_TOUCH: string = 'e-splitter-touch';
const DISABLED: string = 'e-disabled';
const RTL: string = 'e-rtl';
const E_ICONS: string = 'e-icons';
const COLLAPSIBLE: string = 'e-collapsible';
const NAVIGATE_ARROW: string = 'e-navigate-arrow';
const ARROW_RIGHT: string = 'e-arrow-right';
const ARROW_LEFT: string = 'e-arrow-left';
const ARROW_UP: string = 'e-arrow-up';
const ARROW_DOWN: string = 'e-arrow-down';
const HIDE_ICON: string = 'e-icon-hidden';
const EXPAND_PANE: string = 'e-expanded';
const COLLAPSE_PANE: string = 'e-collapsed';
const PANE_HIDDEN: string = 'e-pane-hidden';
const RESIZABLE_PANE: string = 'e-resizable';
const LAST_BAR: string = 'e-last-bar';

/**
 * Interface to configure pane properties such as its content, size, min, max, resizable, collapsed and collapsible.
 */
export class PaneProperties extends ChildProperty<PaneProperties> {
    /**
     * Configures the properties for each pane.
     * @default ''
     */
    @Property()
    public size: string;

    /**
     * Specifies whether a pane is collapsible or not collapsible.
     * @default false
     */
    @Property(false)
    public collapsible: boolean;

    /**
     * Specifies whether a pane is collapsed or not collapsed at the initial rendering of splitter.
     * @default false
     */
    @Property(false)
    public collapsed: boolean;

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
     * @blazorType string
     */
    @Property()
    public content: string | HTMLElement;
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
export class Splitter extends Component<HTMLElement> {
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
    private validDataAttributes: string [] = ['data-size', 'data-min', 'data-max', 'data-collapsible', 'data-resizable', 'data-content', 'data-collapsed'];
    private validElementAttributes: string [] = ['data-orientation', 'data-width', 'data-height'];
    private arrow: string;
    private currentBarIndex: number;
    private prevBar: HTMLElement;
    private nextBar: HTMLElement;
    private splitInstance: PaneDetails;
    private leftArrow: string;
    private rightArrow: string;
    private iconsDelay: number = 300;

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
     * Configures the individual pane behaviors such as content, size, resizable, minimum, maximum validation, collapsible and collapsed.
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
     * Specifies the size of the separator line for both horizontal or vertical orientation.
     * The separator is used to separate the panes by lines.
     * @default null
     */
    @Property(null)
    public separatorSize: number;

    /**
     * Triggers after creating the splitter component with its panes.
     * @event
     * @blazorProperty 'Created'
     */
    @Event()
    public created: EmitType<Object>;

    /**
     * Triggers when the split pane is started to resize.
     * @event
     * @blazorProperty 'OnResizeStart'
     */
    @Event()
    public resizeStart: EmitType<ResizeEventArgs>;

    /**
     * Triggers when a split pane is being resized.
     * @event
     * @blazorProperty 'Resizing'
     */
    @Event()
    public resizing: EmitType<ResizingEventArgs>;

    /**
     * Triggers when the resizing of split pane is stopped.
     * @event
     * @blazorProperty 'OnResizeStop'
     */
    @Event()
    public resizeStop: EmitType<ResizingEventArgs>;

    /**
     * Triggers when before panes get collapsed.
     * @event 
     * @blazorProperty 'OnCollapse'
     */
    @Event()
    public beforeCollapse: EmitType<BeforeExpandEventArgs>;

    /**
     * Triggers when before panes get expanded.
     * @event 
     * @blazorProperty 'OnExpand'
     */
    @Event()
    public beforeExpand: EmitType<BeforeExpandEventArgs>;

    /**
     * Triggers when after panes get collapsed.
     * @event 
     * @blazorProperty 'Collapsed'
     */
    @Event()
    public collapsed: EmitType<ExpandedEventArgs>;

    /**
     * Triggers when after panes get expanded.
     * @event 
     * @blazorProperty 'Expanded'
     */
    @Event()
    public expanded: EmitType<ExpandedEventArgs>;

    /**
     * Initializes a new instance of the Splitter class.
     * @param options  - Specifies Splitter model properties as options.
     * @param element  - Specifies the element that is rendered as an Splitter.
     */

    constructor(options?: SplitterModel, element?: string | HTMLElement) {
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
                        let paneCounts: Object[] = Object.keys(newProp.paneSettings);
                        for (let i: number = 0; i < paneCounts.length; i++) {
                            let index: number = parseInt(Object.keys(newProp.paneSettings)[i], 10);
                            let changedPropsCount: number = Object.keys(newProp.paneSettings[index]).length;
                            for (let j: number = 0; j < changedPropsCount; j++) {
                                let property: string = Object.keys(newProp.paneSettings[index])[j];
                                switch (property) {
                                    case 'content':
                                    let newValue: string = Object(newProp.paneSettings[index])[property];
                                    if (!isNullOrUndefined(newValue)) {
                                        this.allPanes[index].innerHTML = '';
                                        this.setTemplate(newValue, this.allPanes[index]);
                                    }
                                    break;

                                    case 'resizable':
                                    let newVal: boolean = Object(newProp.paneSettings[index])[property];
                                    this.resizableModel(index, newVal);
                                    break;

                                    case 'collapsible':
                                    this.collapsibleModelUpdate(index);
                                    break;

                                    case 'collapsed':
                                    newProp.paneSettings[index].collapsed ? this.isCollapsed() : this.collapsedOnchange(index);
                                    break;

                                    case 'size':
                                    let newValSize: string = Object(newProp.paneSettings[index])[property];
                                    if (newValSize !== '' && !isNullOrUndefined(newValSize)) {
                                        this.allPanes[index].style.flexBasis = newValSize;
                                        this.allPanes[index].classList.add(STATIC_PANE);
                                    }
                                    break;
                                }
                            }
                        }
                    } else {
                    this.destroyPaneSettings();
                    this.allBars = [];
                    this.allPanes = [];
                    this.createSplitPane(this.element);
                    this.addSeparator(this.element);
                    this.getPanesDimensions();
                    this.setRTL(this.enableRtl);
                    this.isCollapsed();
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
        this.setPaneSettings();
        this.setRTL(this.enableRtl);
        this.isCollapsed();
        EventHandler.add(document, 'touchstart click', this.onDocumentClick, this);
    }

    private onDocumentClick(e: Event | MouseEvent): void {
        if (!(<HTMLElement>e.target).classList.contains(SPLIT_BAR) && !isNullOrUndefined(this.currentSeparator)) {
            this.currentSeparator.classList.remove(SPLIT_BAR_HOVER);
            this.currentSeparator.classList.remove(SPLIT_BAR_ACTIVE);
        }
    }

    private checkDataAttributes(): void {
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
                            collapsible: false,
                            collapsed: false
                         };
                    }
                    // tslint:disable-next-line
                    let paneAPI: PanePropertiesModel = (this.paneSettings[paneIndex] as any)[api];
                    if (api === 'resizable' || api === 'collapsible' || api === 'collapsed') {
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

    private destroyPaneSettings(): void {
        [].slice.call(this.element.children).forEach ((el: HTMLElement) => { detach(el); });
    }

    private setPaneSettings(): void {
        let childCount: number = this.allPanes.length;
        let paneCollection: PanePropertiesModel[] = [];
        let paneValue: PanePropertiesModel = {
            size: '',
            min: null,
            max: null,
            content: '',
            resizable: true,
            collapsed: false,
            collapsible: false
        };
        for (let i: number = 0; i < childCount; i++) {
            if (isNullOrUndefined(this.paneSettings[i])) {
                    paneCollection[i] = paneValue;
                } else {
                paneCollection[i] = this.paneSettings[i];
                }
            }
        this.setProperties({'paneSettings': paneCollection}, true);
    }

    private checkArrow(paneIndex: number, targetArrow: string): HTMLElement {
        return(this.allBars[paneIndex].querySelector('.' + NAVIGATE_ARROW + '.' + targetArrow));
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
            this.orientation === 'Horizontal' ? this.panesDimensions.push(this.allPanes[index].getBoundingClientRect().width) :
            this.panesDimensions.push(this.allPanes[index].getBoundingClientRect().height);
        }
    }

    private setCssClass(className: string): void {
        if ( className) {
            addClass([this.element], className.split(className.indexOf(',') > -1 ? ',' : ' '));
        }
    }

    private hideResizer(target: HTMLElement): void {
        addClass([select('.' + RESIZE_BAR, target)], HIDE_HANDLER);
    }

    private showResizer(target: HTMLElement): void {
        if (!isNullOrUndefined(this.previousPane) && this.previousPane.classList.contains(RESIZABLE_PANE) &&
        !isNullOrUndefined(this.nextPane) && this.nextPane.classList.contains(RESIZABLE_PANE)) {
           removeClass([select('.' + RESIZE_BAR, target)], HIDE_HANDLER);
        }
    }

    private resizableModel(index: number, newVal: boolean): void {
        let paneIndex: number;
        let i: number = index;
        paneIndex = (index === (this.allBars.length)) ? (index - 1) : index;
        EventHandler.remove(this.allBars[paneIndex], 'mousedown', this.onMouseDown);
        if (newVal) {
            EventHandler.add(this.allBars[paneIndex], 'mousedown', this.onMouseDown, this);
            if (this.isResizable()) {
                this.showResizer(this.allBars[paneIndex]);
                removeClass([select('.' + RESIZE_BAR, this.allBars[paneIndex])], HIDE_HANDLER);
                this.allBars[paneIndex].classList.add(RESIZABLE_BAR);
                (index === (this.allBars.length)) ? this.allPanes[index].classList.add(RESIZABLE_PANE) :
                this.allPanes[paneIndex].classList.add(RESIZABLE_PANE);
                this.updateResizablePanes(i);
            }
        } else {
            this.updateResizablePanes(i);
            this.hideResizer(this.allBars[paneIndex]);
            this.allBars[paneIndex].classList.remove(RESIZABLE_BAR);
            (index === (this.allBars.length)) ? this.allPanes[index].classList.remove(RESIZABLE_PANE) :
                this.allPanes[paneIndex].classList.remove(RESIZABLE_PANE);
        }
    }

    private collapsibleModelUpdate(index : number): void {
        let arrow2: HTMLElement;
        let arrow1: HTMLElement;
        let paneIndex: number;
        paneIndex = index === (this.allBars.length) ? (index - 1) : index;
        arrow2 = (this.orientation === 'Horizontal') ? this.checkArrow(paneIndex, ARROW_LEFT) : this.checkArrow(paneIndex, ARROW_UP);
        arrow1 = (this.orientation === 'Horizontal') ? this.checkArrow(paneIndex, ARROW_RIGHT) : this.checkArrow(paneIndex, ARROW_DOWN);
        this.paneCollapsible(this.allPanes[index], index);
        this.updateCollapseIcons(paneIndex, arrow1, arrow2);
    }

    private collapseArrow(barIndex: number, arrow: string): HTMLElement {
       return selectAll('.' + arrow , this.allBars[barIndex])[0];
    }

    private updateIsCollapsed(index: number, collapseArrow: string, lastBarArrow: string ): void {
        if (!isNullOrUndefined(index)) {
            let targetEle: HTMLElement;
            let lastBarIndex: boolean = (index === this.allBars.length);
            let barIndex: number = lastBarIndex ? index - 1 : index;
            targetEle = (lastBarIndex) ? this.collapseArrow(barIndex, lastBarArrow) : this.collapseArrow(barIndex, collapseArrow);
            targetEle.click();
        }
    }

    private isCollapsed(index ?: number): void {
        if (!isNullOrUndefined(index)) {
            this.updateIsCollapsed(index, this.targetArrows().collapseArrow, this.targetArrows().lastBarArrow);
        } else {
            for (let m: number = 0 ; m < this.allPanes.length; m ++) {
                if (!isNullOrUndefined(this.paneSettings[m]) && this.paneSettings[m].collapsed) {
                    this.updateIsCollapsed(m, this.targetArrows().collapseArrow, this.targetArrows().lastBarArrow);
                }
            }
        }
    }

    private targetArrows(): {[key: string]: string } {
        this.splitterProperty();
        return {    collapseArrow: (this.orientation === 'Horizontal') ? ARROW_LEFT : ARROW_UP,
            lastBarArrow: (this.orientation === 'Vertical') ? ARROW_DOWN : ARROW_RIGHT
        };
    }

    private collapsedOnchange(index: number): void {
        if (!isNullOrUndefined(this.paneSettings[index]) && !isNullOrUndefined(this.paneSettings[index].collapsed)
            && !this.paneSettings[index].collapsed) {
            this.updateIsCollapsed(index, this.targetArrows().lastBarArrow, this.targetArrows().collapseArrow);
        }
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
        for (let index: number = 0; index < this.allPanes.length; index++) {
            this.allPanes[index].classList.remove(isVertical ? SPLIT_H_PANE : SPLIT_V_PANE);
            this.allPanes[index].classList.add(isVertical ? SPLIT_V_PANE : SPLIT_H_PANE);
        }
        for (let index: number = 0; index < this.allBars.length; index++) {
            detach(this.allBars[index]);
        }
        this.allBars = [];
        this.addSeparator(this.element);
    }

    private checkSplitPane(currentBar: Element, elementIndex: number): HTMLElement {
        let paneEle: HTMLElement = currentBar.parentElement.getElementsByClassName('e-pane')[elementIndex] as HTMLElement;
        return paneEle ? paneEle : null;
    }

    private getPrevPane(currentBar: Element, order: number): HTMLElement {
        return this.checkSplitPane(currentBar, ((order - 1) / (2)));
    }

    private getNextPane(currentBar: Element, order: number): HTMLElement {
        return this.checkSplitPane(currentBar, (((order - 1) / 2) + 1));
    }

    private addResizeHandler(currentBar: HTMLElement): void {
        let resizeHanlder: HTMLElement = this.createElement('div');
        addClass([resizeHanlder], [RESIZE_BAR, E_ICONS]);
        let sizeValue: string = isNullOrUndefined(this.separatorSize) ? '1px' : this.separatorSize + 'px';
        this.orientation === 'Horizontal' ? (resizeHanlder.style.width = sizeValue) : resizeHanlder.style.height = sizeValue;
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

    private updateCollapseIcons(index: number, arrow1: HTMLElement, arrow2: HTMLElement): void {
        if (!isNullOrUndefined(this.paneSettings[index])) {
            if (!isNullOrUndefined(this.paneSettings[index].collapsible)) {
                this.paneSettings[index].collapsible ? removeClass([arrow2], [HIDE_ICON]) : addClass([arrow2], [HIDE_ICON]);
                if (!isNullOrUndefined(this.paneSettings[index + 1])) {
                    this.paneSettings[index + 1].collapsible ? removeClass([arrow1], [HIDE_ICON]) : addClass([arrow1], [HIDE_ICON]);
                }
                if (!isNullOrUndefined(this.paneSettings[index + 1])) {
                    if ((this.paneSettings[index + 1].collapsible)) {
                        this.paneSettings[index + 1].collapsible ? removeClass([arrow1], [HIDE_ICON]) : addClass([arrow1], [HIDE_ICON]);
                    }
                }
            }
        }
    }

    private createSeparator(i: number): HTMLElement {
        let separator: HTMLElement = this.createElement('div');
        this.allBars.push(separator);
        let arrow1: HTMLElement = this.createElement('button');
        let arrow2: HTMLElement = this.createElement('button');
        let size: string;
        size = isNullOrUndefined(this.separatorSize) ? '1px' : this.separatorSize + 'px';
        if (this.orientation === 'Horizontal') {
            this.leftArrow = ARROW_LEFT;
            this.rightArrow = ARROW_RIGHT;
            addClass([arrow2], [NAVIGATE_ARROW, ARROW_LEFT, HIDE_ICON]);
            addClass([arrow1], [NAVIGATE_ARROW, ARROW_RIGHT, HIDE_ICON]);
            addClass([separator], [SPLIT_BAR, SPLIT_H_BAR]);
            separator.style.width = size;
        } else {
            addClass([arrow1], [NAVIGATE_ARROW, ARROW_DOWN, HIDE_ICON]);
            addClass([arrow2], [NAVIGATE_ARROW, ARROW_UP, HIDE_ICON]);
            addClass([separator], [SPLIT_BAR, SPLIT_V_BAR]);
            this.leftArrow = ARROW_UP;
            this.rightArrow = ARROW_DOWN;
            separator.style.height = size;
        }
        this.addMouseActions(separator);
        separator.appendChild(arrow2);
        this.addResizeHandler(separator);
        separator.appendChild(arrow1);
        this.updateCollapseIcons(i, arrow1, arrow2);
        return separator;
    }

    private updateResizablePanes(index: number): void {
        this.getPaneDetails();
        this.isResizable() ? this.allPanes[index].classList.add(RESIZABLE_PANE) : this.allPanes[index].classList.remove(RESIZABLE_PANE);
    }

    private addSeparator(target: HTMLElement): void {
        let childCount: number = this.allPanes.length;
        let clonedEle: HTMLCollection = <HTMLCollection>target.children;
        let separator: HTMLElement;
        for (let i: number = 0; i < childCount; i++) {
            if (i < childCount - 1) {
                separator = this.createSeparator(i);
                setStyleAttribute(<HTMLElement>separator, { 'order': (i * 2) + 1 });
                this.separatorOrder.push((i * 2) + 1);
                clonedEle[i].parentNode.appendChild(separator);
                this.currentSeparator = separator;
                separator.setAttribute('role', 'separator');
                separator.setAttribute('aria-orientation', this.orientation.toLowerCase());
                this.wireClickEvents();
                if (this.isResizable()) {
                    EventHandler.add(separator, 'mousedown', this.onMouseDown, this);
                    let eventName: string = (Browser.info.name === 'msie') ? 'pointerdown' : 'touchstart';
                    EventHandler.add(separator, eventName, this.onMouseDown, this);
                    separator.classList.add(RESIZABLE_BAR);
                    this.updateResizablePanes(i);
                } else {
                    addClass([select('.' + RESIZE_BAR, separator)], HIDE_HANDLER);
                }
            } else {
                this.updateResizablePanes(i);
                addClass([separator], LAST_BAR );
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
        let sTout: ReturnType<typeof setTimeout>; let hoverTimeOut: ReturnType<typeof setTimeout>;
        separator.addEventListener('mouseenter', () => {
            /* istanbul ignore next */
            sTout = setTimeout(() => { addClass([separator], [SPLIT_BAR_HOVER]); }, this.iconsDelay);
        });
        separator.addEventListener('mouseleave', () => {
            clearTimeout(sTout);
            removeClass([separator], [SPLIT_BAR_HOVER]);
        });
        separator.addEventListener('mouseout', () => {
            clearTimeout(hoverTimeOut);
        });
        separator.addEventListener('mouseover', () => {
            /* istanbul ignore next */
            hoverTimeOut = setTimeout(() => { addClass([separator], [SPLIT_BAR_HOVER]); }, this.iconsDelay);
        });
    }

    private getEventType(e: string): string {
        return (e.indexOf('mouse') > -1) ? 'mouse' : 'touch';
    }

    private updateCurrentSeparator(target: HTMLElement): void {
        this.currentSeparator = this.isSeparator(target) ? target.parentElement : target;
    }

    private isSeparator(target: HTMLElement): boolean {
        return ((target.classList.contains(RESIZE_BAR) || target.classList.contains(SPLIT_BAR)) ? false : true);
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

    private wireClickEvents(): void {
        EventHandler.add(this.currentSeparator, 'touchstart click', this.clickHandler, this);
    }

    private clickHandler(e: Event): void {
        if (!(<HTMLElement>e.target).classList.contains(NAVIGATE_ARROW)) {
            let hoverBars: HTMLElement[] = selectAll('.' + ROOT + ' > .' + SPLIT_BAR + '.' + SPLIT_BAR_HOVER);
            if (hoverBars.length > 0) { removeClass(hoverBars, SPLIT_BAR_HOVER); }
            (<HTMLElement>e.target).classList.add(SPLIT_BAR_HOVER);
        }
        let icon: HTMLElement = (<HTMLElement>e.target);
        if (icon.classList.contains(ARROW_LEFT) || icon.classList.contains(ARROW_UP)) {
            this.collapseAction(e);
        }
        if (icon.classList.contains(ARROW_RIGHT) || icon.classList.contains(ARROW_DOWN)) {
            this.expandAction(e);
        }
    }

    private expandAction(e: Event): void {
        this.splitterDetails(e);
        let collapseClass: string[] = [COLLAPSE_PANE, PANE_HIDDEN];
        let eventArgs: BeforeExpandEventArgs = this.beforeAction(e);
        this.trigger('beforeExpand', eventArgs, (beforeExpandArgs: BeforeExpandEventArgs) => {
            if (!beforeExpandArgs.cancel) {
                this.previousPane.style.flexGrow = '1';
                this.nextPane.style.flexGrow = '0';
                if (!this.previousPane.classList.contains(COLLAPSE_PANE)) {
                    removeClass([this.nextPane], EXPAND_PANE);
                    removeClass([this.previousPane], collapseClass);
                    addClass([this.previousPane], EXPAND_PANE);
                    addClass([this.nextPane], collapseClass);
                } else {
                    (this.currentBarIndex !== 0) ?
                    (this.previousPane.previousElementSibling as HTMLElement).style.flexGrow = '' : this.nextPane.style.flexGrow = '';
                    removeClass([this.previousPane], collapseClass);
                    removeClass([this.nextPane], EXPAND_PANE);
                }
                this.updateIconsOnExpand(e);
                this.previousPane.setAttribute('aria-expanded', 'true');
                this.nextPane.setAttribute('aria-expanded', 'false');
                let expandEventArgs: ExpandedEventArgs = this.afterAction(e);
                this.trigger('expanded', expandEventArgs);
            }
        });
    }

    private hideTargetBarIcon(targetBar: HTMLElement, targetArrow: string): void {
        addClass([select('.' + targetArrow, targetBar)], HIDE_ICON);
    }

    private showTargetBarIcon(targetBar: HTMLElement, targetArrow: string): void {
        removeClass([select('.' + targetArrow, targetBar)], HIDE_ICON);
    }

    private updateIconsOnCollapse(e: Event): void {
        this.splitterProperty();
        if (this.splitInstance.prevPaneCollapsed && this.splitInstance.nextPaneExpanded) {
            addClass([<HTMLElement>e.target], HIDE_ICON);
            this.showCurrentBarIcon();
            this.resizableModel(this.currentBarIndex, false);
            if (!isNullOrUndefined(this.prevBar)) {
                this.resizableModel(this.currentBarIndex - 1, false);
                this.hideTargetBarIcon(this.prevBar, this.arrow);
                // first pane collapsible false
                this.showTargetBarIcon(this.prevBar, this.leftArrow);
            }
        } else if (!this.splitInstance.prevPaneCollapsed && !this.splitInstance.nextPaneExpanded) {
            this.resizableModel(this.currentBarIndex, true);
            if (!this.splitInstance.nextPaneNextEle.classList.contains('e-collapsed')) {
            this.resizableModel(this.currentBarIndex + 1, true);
            }
            this.showCurrentBarIcon();
            if (!this.paneSettings[this.currentBarIndex].collapsible) {
                addClass([<HTMLElement>e.target], HIDE_ICON);
            }
            if (!isNullOrUndefined(this.nextBar)) {
                this.showTargetBarIcon(this.nextBar, this.leftArrow);
                if (!this.paneSettings[this.currentBarIndex].collapsible && this.paneSettings[this.currentBarIndex + 1].collapsible ) {
                    this.hideTargetBarIcon(this.nextBar, this.arrow);
                } else if (!this.paneSettings[this.splitInstance.nextPaneIndex + 1].collapsible &&
                    this.paneSettings[this.currentBarIndex]) {
                    this.hideTargetBarIcon(this.nextBar, this.arrow);
                }
            }
        }
    }

    private collapseAction(e: Event): void {
        this.splitterDetails(e);
        let collapseClass: string[] = [COLLAPSE_PANE, PANE_HIDDEN];
        this.previousPane.style.flexGrow = '0';
        this.nextPane.style.flexGrow = '1';
        let eventArgs: BeforeExpandEventArgs = this.beforeAction(e);
        this.trigger('beforeCollapse', eventArgs, (beforeCollapseArgs: BeforeExpandEventArgs) => {
            if (!beforeCollapseArgs.cancel) {
                if (this.nextPane.classList.contains(COLLAPSE_PANE)) {
                    removeClass([this.previousPane], EXPAND_PANE);
                    removeClass([this.nextPane], collapseClass);
                } else {
                    removeClass([this.previousPane], EXPAND_PANE);
                    removeClass([this.nextPane], collapseClass);
                    addClass([this.nextPane], EXPAND_PANE);
                    addClass([this.previousPane], collapseClass);
                }
                this.updateIconsOnCollapse(e);
                this.previousPane.setAttribute('aria-expanded', 'false');
                this.nextPane.setAttribute('aria-expanded', 'true');
                let collapseEventArgs: ExpandedEventArgs = this.afterAction(e);
                this.trigger('collapsed', collapseEventArgs);
            }
        });
    }

    private beforeAction(e: Event): BeforeExpandEventArgs {
        let eventArgs: BeforeExpandEventArgs = {
            element: this.element,
            event: e,
            pane: [this.previousPane, this.nextPane],
            index: [this.prevPaneIndex, this.nextPaneIndex],
            separator: this.currentSeparator,
            cancel: false
        };
        return eventArgs;
    }

    private splitterProperty(): void {
        this.splitInstance = {
            currentBarIndex: this.currentBarIndex,
            nextPaneCollapsible: this.nextPane.classList.contains(COLLAPSIBLE),
            prevPaneCollapsible: this.previousPane.classList.contains(COLLAPSIBLE),
            prevPaneExpanded: this.previousPane.classList.contains(EXPAND_PANE),
            nextPaneExpanded: this.nextPane.classList.contains(EXPAND_PANE),
            nextPaneCollapsed: this.nextPane.classList.contains(COLLAPSE_PANE),
            prevPaneCollapsed: this.previousPane.classList.contains(COLLAPSE_PANE),
            nextPaneIndex: this.getNextPaneIndex(),
            prevPaneIndex: this.getPreviousPaneIndex(),
            nextPaneNextEle: this.nextPane.nextElementSibling as HTMLElement,
            prevPanePreEle: this.previousPane.previousElementSibling as HTMLElement,
        };
    }

    private showCurrentBarIcon(): void {
        removeClass([select('.' + this.arrow, this.currentSeparator)], HIDE_ICON);
    }

    private updateIconsOnExpand(e: Event): void {
        this.splitterProperty();
        addClass([<HTMLElement>e.target], HIDE_ICON);
        if (!this.splitInstance.prevPaneExpanded && !this.splitInstance.nextPaneCollapsed) {
            this.showCurrentBarIcon();
            removeClass([<HTMLElement>e.target], HIDE_ICON);
            this.resizableModel(this.currentBarIndex, true);
            if (!isNullOrUndefined(this.prevBar) && !this.splitInstance.prevPanePreEle.classList.contains(COLLAPSE_PANE)) {
                this.resizableModel(this.currentBarIndex - 1, true);
                this.showTargetBarIcon(this.prevBar, this.rightArrow);
                if (!this.paneSettings[this.currentBarIndex - 1].collapsible) {
                this.hideTargetBarIcon(this.prevBar, this.arrow);
                if (this.paneSettings[this.currentBarIndex].collapsible &&
                    !this.paneSettings[this.currentBarIndex + 1].collapsible ) {
                    this.hideTargetBarIcon(this.currentSeparator, this.rightArrow);
                }
                } else if (this.paneSettings[this.currentBarIndex].collapsible &&
                !this.paneSettings[this.currentBarIndex + 1].collapsible) {
                this.hideTargetBarIcon(this.currentSeparator, this.rightArrow);
                }
            } else {
                if (this.paneSettings[this.currentBarIndex].collapsible && !this.paneSettings[this.currentBarIndex + 1].collapsible) {
                    this.hideTargetBarIcon(this.currentSeparator, this.rightArrow);
                    this.showTargetBarIcon(this.prevBar, this.rightArrow);
                } else {
                    this.showTargetBarIcon(this.prevBar, this.rightArrow);
                }
            }
        } else if (this.splitInstance.prevPaneExpanded && this.splitInstance.nextPaneCollapsed) {
            this.resizableModel(this.currentBarIndex, false);
            this.resizableModel(this.currentBarIndex + 1, false);
            this.showCurrentBarIcon();
            if (!isNullOrUndefined(this.nextBar)) {
                this.hideTargetBarIcon(this.nextBar, this.arrow);
                // only when middle pane collapsible to true
                this.showTargetBarIcon(this.nextBar, this.rightArrow);
            }
        }
    }

    private afterAction(e: Event): ExpandedEventArgs {
        let eventArgs: ExpandedEventArgs = {
            element: this.element,
            event: e,
            pane: [this.previousPane, this.nextPane],
            index: [this.prevPaneIndex, this.nextPaneIndex],
            separator: this.currentSeparator
        };
        return eventArgs;
    }

    private currentIndex(e: Event): void {
        this.currentBarIndex = this.getSeparatorIndex((<HTMLElement>e.target).parentElement);
    }

    private getSeparatorIndex(target?: HTMLElement): number {
        let array: HTMLElement[] = [].slice.call(this.allBars);
        return array.indexOf(target);
    }

    private getPrevBar(currentBar: number): HTMLElement {
        let prevbar: HTMLElement = this.allBars[(currentBar - 1)];
        return prevbar;
    }

    private getNextBar(currentBar: number): HTMLElement {
        let prevbar: HTMLElement = this.allBars[(currentBar + 1)];
        return prevbar;
    }

    private updateBars(index: number): void {
        this.prevBar = this.getPrevBar(index);
        this.nextBar = this.getNextBar(index);
    }

    private splitterDetails(e: Event): void {
        if (this.orientation === 'Horizontal') {
            this.arrow = (<HTMLElement>e.target).classList.contains(ARROW_LEFT) ? ARROW_RIGHT : ARROW_LEFT;
        } else {
            this.arrow = (<HTMLElement>e.target).classList.contains(ARROW_UP) ? ARROW_DOWN : ARROW_UP;
        }
        this.updateCurrentSeparator(e.target as HTMLElement);
        this.currentIndex(e);
        this.updateBars(this.currentBarIndex);
        this.getPaneDetails();
    }

    private onMouseDown(e: MouseEvent | TouchEvent | PointerEvent): void {
        e.preventDefault();
        let target: HTMLElement = e.target as HTMLElement;
        if (target.classList.contains(NAVIGATE_ARROW)) { return; }
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
        this.trigger('resizeStart', eventArgs, (resizeStartArgs: ResizeEventArgs) => {
            if (!resizeStartArgs.cancel) {
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
        });
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
        return prePaneIndex;
    }

    private getNextPaneIndex(): number {
        let nextPaneIndex: number = (parseInt(this.currentSeparator.style.order, 10) - 1) / (2);
        return nextPaneIndex + 1;
    }

    private getPaneDetails(): void {
        this.order = parseInt(this.currentSeparator.style.order, 10);
        let prevPane: HTMLElement = this.getPrevPane(this.currentSeparator, this.order);
        let nextPane: HTMLElement = this.getNextPane(this.currentSeparator, this.order);
        if (prevPane && nextPane) {
            this.previousPane = prevPane;
            this.nextPane = nextPane;
            this.prevPaneIndex = this.getPreviousPaneIndex();
            this.nextPaneIndex = this.getNextPaneIndex();
        } else {
            return;
        }
    }

    private getPaneHeight(pane: HTMLElement): string {
        return ((this.orientation === 'Horizontal') ? pane.offsetWidth.toString() :
          pane.offsetHeight.toString());
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
                    if (index < childCount - 1 && this.paneSettings[index].size !== '') {
                        addClass([child[index]], STATIC_PANE);
                    } else if (!this.sizeFlag) {
                        (<HTMLElement>child[index]).style.flexBasis = null;
                    }
                    if ((index === childCount - 1) && this.sizeFlag && this.paneSettings[index].size !== '') {
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

    private setTemplate(template: string | HTMLElement, toElement: HTMLElement): void {
        toElement.innerHTML = '';
        this.templateCompile(toElement, template);
    }

    // tslint:disable-next-line
    private templateCompile(ele: HTMLElement, cnt: any): void {
        let blazorContain: string[] = Object.keys(window) as string[];
        let tempEle: HTMLElement = this.createElement('div');
        this.compileElement(tempEle, cnt, 'content');
        if (tempEle.childNodes.length !== 0) {
            [].slice.call(tempEle.childNodes).forEach((childEle: HTMLElement): void => {
                ele.appendChild(childEle);
            });
            if (blazorContain.indexOf('ejsInterop') !== -1 && !this.isStringTemplate && cnt.indexOf('<div>Blazor') === 0) {
                updateBlazorTemplate(
                    this.element.id + 'content' + this.allPanes.length.toString(),
                    'ContentTemplate',
                    this.paneSettings[this.allPanes.length - 1]
                );
            }
        }
    }

    private compileElement(ele: HTMLElement, val: string | HTMLElement, prop: string): void {
        let blazorContain: string[] = Object.keys(window) as string[];
        if (typeof(val) === 'string') {
            val = (val).trim();
        }
        let templateFn: Function;
        if (!isNullOrUndefined((<HTMLElement>val).outerHTML)) {
            templateFn = compile((<HTMLElement>val).outerHTML);
        } else {
            templateFn = compile(val as string);
        }
        let templateFUN: HTMLElement[];
        if (!isNullOrUndefined(templateFn)) {
            if (blazorContain.indexOf('ejsInterop') !== -1  && !this.isStringTemplate && (val as string).indexOf('<div>Blazor') === 0) {
                templateFUN = templateFn(
                    {}, this, prop,
                    this.element.id + 'content' + this.allPanes.length.toString(),
                    this.isStringTemplate
                );
            } else {
                templateFUN = templateFn({}, this, prop, this.element.id + 'content' + this.allPanes.length.toString(), true);
            }
        }
        if (!isNullOrUndefined(templateFn) && templateFUN.length > 0) {
            [].slice.call(templateFUN).forEach((el: HTMLElement): void => {
                ele.appendChild(el);
            });
        }
    }

    private paneCollapsible(pane: HTMLElement, index: number): void {
        this.paneSettings[index].collapsible ? addClass([pane], COLLAPSIBLE) : removeClass([pane], COLLAPSIBLE);
    }

    private createSplitPane(target: HTMLElement): void {
        let childCount: number = target.children.length;
        for (let i: number = 0; i < this.paneSettings.length; i++) {
            if (childCount < this.paneSettings.length) {
                let childElement: HTMLElement = this.createElement('div');
                this.element.appendChild(childElement);
                childCount = childCount + 1;
            }
        }
        childCount = target.children.length;
        let child: HTMLElement[] = [].slice.call(target.children);
        this.sizeFlag = false;
        if (childCount > 1) {
            for (let i: number = 0; i < childCount; i++) {
                // To accept only div and span element as pane
                if (child[i].nodeName === 'DIV' || child[i].nodeName === 'SPAN') {
                    this.allPanes.push(<HTMLElement>child[i]);
                    if (this.orientation === 'Horizontal') {
                        addClass([child[i]], [PANE, SPLIT_H_PANE, SCROLL_PANE]);
                        this.panesDimension(i, child);
                    } else {
                        addClass([child[i]], [PANE, SPLIT_V_PANE, SCROLL_PANE]);
                        this.panesDimension(i, child);
                    }
                    if (!isNullOrUndefined(this.paneSettings[i]) && !isNullOrUndefined(this.paneSettings[i].content)) {
                        this.setTemplate(this.paneSettings[i].content as string, child[i] as HTMLElement);
                    }
                    if (!isNullOrUndefined(this.paneSettings[i])) {
                        this.paneCollapsible(child[i], i);
                    }
                }
            }
        }
    };

    /**
     * expands corresponding pane based on the index is passed.
     * @param { number } index - Specifies the index value of the corresponding pane to be expanded at initial rendering of splitter.
     * @returns void
     */
    public expand(index: number): void {
        this.collapsedOnchange(index);
    }

    /**
     * collapses corresponding pane based on the index is passed.
     * @param { number } index - Specifies the index value of the corresponding pane to be collapsed at initial rendering of splitter.
     * @returns void
     */
    public collapse(index: number): void {
        this.isCollapsed(index);
    }

    /**
     * Removes the control from the DOM and also removes all its related events.
     * @returns void
     */
    public destroy(): void {
        if (!this.isDestroyed) {
            super.destroy();
            EventHandler.remove(document, 'touchstart click', this.onDocumentClick);
            detach(this.element);
            this.element = this.wrapper as HTMLElement;
            this.wrapperParent.appendChild(<HTMLElement>this.wrapper);
        }
    }

    private addPaneClass(pane: HTMLElement): HTMLElement {
        this.orientation === 'Horizontal' ? addClass([pane], [PANE, SPLIT_H_PANE, SCROLL_PANE]) :
        addClass([pane], [PANE, SPLIT_V_PANE, SCROLL_PANE]);
        return pane;
    }

    private removePaneOrders(paneClass: string): void {
        let panes: NodeListOf<HTMLElement> = document.querySelectorAll('.' + paneClass) as NodeListOf<HTMLElement>;
        for (let i: number = 0; i < panes.length; i++) {
            panes[i].style.removeProperty('order');
        }
    }

    private setPaneOrder(): void {
        for (let i : number = 0; i < this.allPanes.length; i++) {
            this.panesDimension(i, this.allPanes);
        }
    }

    private removeSeparator(): void {
        for (let i: number = 0; i < this.allBars.length; i ++) {
            detach(this.allBars[i]);
        }
        this.allBars = [];
    }

    private updatePanes(): void {
        this.setPaneOrder();
        this.removeSeparator();
        this.addSeparator(this.element);
    }

    /**
     * Allows you to add a pane dynamically to the specified index position by passing the pane properties.
     * @param { PanePropertiesModel } paneProperties - Specifies the pane’s properties that apply to new pane.
     * @param { number } index - Specifies the index where the pane will be inserted.
     * @returns void
     */
    public addPane(paneProperties: PanePropertiesModel, index: number): void {
        let newPane : HTMLElement = this.createElement('div');
        newPane = this.addPaneClass(newPane);
        index = (index > this.allPanes.length + 1) ? this.allPanes.length : index;
        let paneDetails: PanePropertiesModel = {
            size: isNullOrUndefined(paneProperties.size) ? '' : paneProperties.size,
            min: isNullOrUndefined(paneProperties.min) ? null : paneProperties.min,
            max: isNullOrUndefined(paneProperties.max) ? null : paneProperties.max,
            content: isNullOrUndefined(paneProperties.content) ? '' : paneProperties.content,
            resizable: isNullOrUndefined(paneProperties.resizable) ? true : paneProperties.resizable,
            collapsible: isNullOrUndefined(paneProperties.collapsible) ? false : paneProperties.collapsible,
            collapsed: isNullOrUndefined(paneProperties.collapsed) ? false : paneProperties.collapsed
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
        this.setTemplate(this.paneSettings[index].content as string, newPane);
        this.allPanes[this.allPanes.length - 1].classList.remove(STATIC_PANE);
    }

    /**
     * Allows you to remove the specified pane dynamically by passing its index value.
     * @param { number } index - Specifies the index value to remove the corresponding pane.
     * @returns void
     */
    public removePane(index: number): void {
        index = (index > this.allPanes.length + 1) ? this.allPanes.length : index;
        let elementClass: string = (this.orientation === 'Horizontal') ? SPLIT_H_PANE : SPLIT_V_PANE;
        if (isNullOrUndefined(this.element.querySelectorAll('.' + elementClass)[index])) {
            return;
        }
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

export interface BeforeExpandEventArgs {
    /**
     * To access root element after control created
     */
    element?: HTMLElement;
    /**
     * default event arguments
     */
    event?: Event;
    /**
     * To get pane elements
     */
    pane?: HTMLElement[];
    /**
     * Index of pane
     */
    index?: number[];
    /**
     * Respective split-bar element
     */
    separator?: HTMLElement;
    /**
     * cancel argument
     */
    cancel?: boolean;
}

export interface ExpandedEventArgs {
    /**
     * To access root element after control created
     */
    element?: HTMLElement;
    /**
     * default event arguments
     */
    event?: Event;
    /**
     * To get pane elements
     */
    pane?: HTMLElement[];
    /**
     * Index of pane
     */
    index?: number[];
    /**
     * Respective split-bar element
     */
    separator?: HTMLElement;
}

/**
 * To maintain pane details
 * @private
 */
interface PaneDetails {
    /** to check whether the prevPane is Collapsible */
    prevPaneCollapsible?: boolean;
    /** to check whether the prevPane is expanded */
    prevPaneExpanded?: boolean;
    /** to check whether the nextPane is Collapsible */
    nextPaneCollapsible?: boolean;
    /** to check whether the nextPane is expanded */
    nextPaneExpanded?: boolean;
    /** previous pane index */
    prevPaneIndex?: number;
    /** next pane index */
    nextPaneIndex?: number;
    /** currentbar index */
    currentBarIndex?: number;
    /** to get prevPane's previous element */
    prevPanePreEle?: HTMLElement;
    /** to get nextPane's next element */
    nextPaneNextEle?: HTMLElement;
    /** to check whether the nextPane is collapsed */
    nextPaneCollapsed?: boolean;
    /** to check whether the previousPane is collapsed */
    prevPaneCollapsed?: boolean;

}