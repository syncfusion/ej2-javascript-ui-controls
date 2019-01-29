import { Component, Property, NotifyPropertyChanges, INotifyPropertyChanged, isUndefined } from '@syncfusion/ej2-base';
import { Collection, Draggable, isNullOrUndefined, DragEventArgs, append } from '@syncfusion/ej2-base';
import { EmitType, Event, formatUnit, ChildProperty, compile } from '@syncfusion/ej2-base';
import { setStyleAttribute as setStyle, addClass, detach, removeClass, EventHandler } from '@syncfusion/ej2-base';
import { DashboardLayoutModel, PanelModel } from './dashboardlayout-model';


// constant class definitions
const ROOT: string = 'e-dashboard-layout';
const preventSelect: string = 'e-prevent';
const dragging: string = 'e-dragging';
const draggable: string = 'e-draggable';
const resize: string = 'e-resize';
const responsive: string = 'e-responsive';
const east: string = 'e-east';
const west: string = 'e-west';
const north: string = 'e-north';
const south: string = 'e-south';
const single: string = 'e-single';
const double: string = 'e-double';
const northEast: string = 'e-north-east';
const southEast: string = 'e-south-east';
const northWest: string = 'e-north-west';
const southWest: string = 'e-south-west';
const panel: string = 'e-panel';
const panelContent: string = 'e-panel-content';
const panelContainer: string = 'e-panel-container';
const disable: string = 'e-disabled';
const header: string = 'e-panel-header';
const panelTransition: string = 'e-panel-transition';

/**
 * Defines the panel of the DashboardLayout component. 
 */
export class Panel extends ChildProperty<Panel> {

    /**
     * Defines the id of the panel.
     * @default ''
     */
    @Property('')
    public id: string;

    /**
     * Defines the CSS class name that can be appended with each panel element.
     * @default ''
     */
    @Property('')
    public cssClass: string;

    /** 
     * Defines the template value that should be displayed as the panel's header. 
     */
    @Property('')
    public header: string | HTMLElement;

    /**
     * Defines the template value that should be displayed as the panel's content. 
     */
    @Property('')
    public content: string | HTMLElement;

    /**
     * Defines whether to the panel should be enabled or not.
     * @default true
     */
    @Property(true)
    public enabled: boolean;

    /**
     * Defines a row value where the panel should be placed.
     * @default 0
     * @aspType int
     */
    @Property(0)
    public row: number;

    /**
     * Defines the column value where the panel to be placed.
     * @default 0
     * @aspType int
     */
    @Property(0)
    public col: number;

    /**
     * Specifies the width of the panel in the layout in cells count.
     *
     * @default 1
     */
    @Property(1)
    public sizeX: number;

    /**
     * Specifies the height of the panel in the layout in cells count.
     *
     * @default 1
     */
    @Property(1)
    public sizeY: number;

    /**
     * Specifies the minimum height of the panel in cells count.
     * 
     * @default 1
     */
    @Property(1)
    public minSizeY: number;

    /**
     * Specifies the minimum width of the panel in cells count.
     * *
     * @default 1
     */
    @Property(1)
    public minSizeX: number;

    /**
     * Specifies the maximum height of the panel in cells count.
     * *
     * @default null
     * @aspType int
     *
     */
    @Property(null)
    public maxSizeY: number;

    /**
     * Specifies the maximum width of the panel in cells count.
     * *
     * @default null
     * @aspType int
     */
    @Property(null)
    public maxSizeX: number;


}

/**
 * The DashboardLayout is a grid structured layout control, that helps to create a dashboard with panels.
 * Panels hold the UI components or data to be visualized with flexible options like resize, reorder, drag-n-drop, remove and add,
 * that allows users to easily place the panels at a desired position within the grid layout.
 * ```html
 * <div id="default-layout">
 * ```
 * ```typescript
 * <script>
 *   let dashBoardObject : DashboardLayout = new DashboardLayout();
 *   dashBoardObject.appendTo('#default-layout');
 * </script>
 * ```
 */


@NotifyPropertyChanges
export class DashboardLayout extends Component<HTMLElement> implements INotifyPropertyChanged {

    protected panelCollection: HTMLElement[];
    protected checkCollision: HTMLElement[];
    protected mainElement: HTMLElement;
    protected rows: number = 1;
    protected dragobj: Draggable;
    protected dragStartArgs: DragStartArgs;
    protected dragStopEventArgs: DragStopArgs;
    protected draggedEventArgs: DraggedEventArgs;
    protected updatedRows: number;
    protected tempObject: DashboardLayout;
    protected sortedArray: HTMLElement[][];
    protected cloneArray: HTMLElement[][];
    protected panelID: number = 0;
    protected movePanelCalled: boolean = false;
    protected resizeCalled: boolean = false;
    protected gridPanelCollection: PanelModel[];
    protected overlapElement: HTMLElement[];
    protected shouldRestrict: boolean;
    protected shouldSubRestrict: boolean;
    protected overlapElementClone: HTMLElement[];
    protected overlapSubElementClone: HTMLElement[];
    protected dragCollection: Draggable[];
    protected iterationValue: number;
    protected shadowEle: HTMLElement;
    protected elementRef: ElementRefArgs;
    protected allItems: HTMLElement[];
    protected dimensions: (string | number)[];
    protected oldRowCol: {
        [key: string]: {
            row: number,
            col: number
        };
    };
    protected collisionChecker: {
        [key: string]: {
            ele: HTMLElement,
            row: number,
            srcEle: HTMLElement
        };
    };
    protected availableClasses: string[];
    protected addPanelCalled: boolean;
    protected isSubValue: boolean;
    protected direction: number;
    protected directionRow: number;
    protected lastMouseX: number;
    protected lastMouseY: number;
    protected elementX: number;
    protected elementY: number;
    protected elementWidth: number;
    protected elementHeight: number;
    protected originalWidth: number;
    protected originalHeight: number;
    protected handleClass: string;
    protected mOffX: number = 0;
    protected mOffY: number = 0;
    protected maxTop: number = 9999;
    protected maxRows: number = 100;
    protected maxLeft: number;
    protected mouseX: number = 0;
    protected mouseY: number = 0;
    protected minTop: number = 0;
    protected minLeft: number = 0;
    protected moveTarget: HTMLElement;
    protected upTarget: HTMLElement;
    protected downTarget: HTMLElement;
    protected leftAdjustable: boolean;
    protected rightAdjustable: boolean;
    protected topAdjustable: boolean;
    protected spacedColumnValue: number;
    protected checkingElement: HTMLElement;
    protected panelContent: HTMLElement;
    protected panelHeaderElement: HTMLElement;
    protected panelBody: HTMLElement;
    protected startRow: number;
    protected startCol: number;
    protected maxColumnValue: number;
    protected checkColumnValue: number;
    protected spacedRowValue: number;
    protected cellSize: number[] | string[];
    protected cloneObject: {
        [key: string]: {
            row: number,
            col: number
        };
    };
    private panelsInitialModel: PanelModel[];

    /**
     * If allowDragging is set to true, then the DashboardLayout allows you to drag and reorder the panels.
     * *
     * @default true
     */
    @Property(true)
    public allowDragging: boolean;

    /**
     * If allowResizing is set to true, then the DashboardLayout allows you to resize the panels.
     * @default false
     */
    @Property(false)
    public allowResizing: boolean;

    /**
     * If pushing is set to true, then the DashboardLayout allow to push the panels when panels collide
     * while dragging or resizing the panels.
     * *
     * @default true
     * @private
     */
    @Property(true)
    private allowPushing: boolean;

    /**
     * If allowFloating is set to true, then the DashboardLayout automatically move the panels upwards to fill the empty available 
     * cells while dragging or resizing the panels.
     * *
     * @default true
     */
    @Property(true)
    public allowFloating: boolean;

    /** 
     * Defines the cell aspect ratio of the panel. 
     * @default 1
     * @private
     */
    @Property(1)
    public cellAspectRatio: number;

    /**
     * Defines the spacing between the panels.
     * *
     * @default [0,0]
     */
    @Property([0, 0])
    public cellSpacing: number[];

    /** 
     * Defines the number of columns to be created in the DashboardLayout. 
     * @default 1
     */
    @Property(1)
    public columns: number;

    /**
     * Defines the draggable handle selector which will act as dragging handler for the panels.
     * *
     * @default null
     */
    @Property(null)
    public draggableHandle: string;

    /**
     * Enable or disable rendering component in right to left direction.
     * *
     * @default false
     */
    @Property(false)
    public enableRtl: boolean;

    /**
     * Locale property.
     * This is not a dashboard layout property.
     * @default 'en-US'
     * @private
     */
    @Property('en-US')
    public locale: string;

    /**
     * Defines the media query value where the dashboardlayout becomes stacked layout when the resolution meets.
     * @default 'max-width:600px'
     */
    @Property('max-width: 600px')
    public mediaQuery: string;

    /**
     *
     * Defines the panels property of the DashboardLayout component.
     *
     * @default null
     */
    @Collection<PanelModel>([{}], Panel)
    public panels: PanelModel[];

    /**
     * Defines the resizing handles directions used for resizing the panels.
     * @default null
     * @private
     */
    @Property(null)
    private resizableHandles: string[];

    /**
     * Triggers whenever the panels positions are changed.
     * @event
     */
    @Event()
    public change: EmitType<object>;

    /**
     * Triggers when a panel is about to drag.
     * @event
     */
    @Event()
    public dragStart: EmitType<DragEventArgs>;

    /**
     * Triggers while a panel is dragged continuously.
     * @event
     */
    @Event()
    public drag: EmitType<DragEventArgs>;

    /**
     * Triggers when a dragged panel is dropped.
     * @event
     */
    @Event()
    public dragStop: EmitType<DragEventArgs>;

    /**
     * Triggers when a panel is about to resize.
     * @event
     */
    @Event()
    public resizeStart: EmitType<Object>;

    /**
     * Triggers when a panel is being resized continuously.
     * @event
     */
    @Event()
    public resize: EmitType<Object>;

    /**
     * Triggers when a panel resize ends.
     * @event
     */
    @Event()
    public resizeStop: EmitType<Object>;

    /**
     * Initialize the event handler
     * @private
     */
    protected preRender(): void {
        this.panelCollection = [];
        this.sortedArray = [];
        this.gridPanelCollection = [];
        this.overlapElement = [];
        this.overlapElementClone = [];
        this.overlapSubElementClone = [];
        this.collisionChecker = {};
        this.dragCollection = [];
        this.elementRef = { top: '', left: '', height: '', width: '' };
        this.dimensions = [];
        this.allItems = [];
        this.oldRowCol = {};
        this.availableClasses = [];
        addClass([this.element], [ROOT]);
        for (let i: number = 0; i < this.panels.length; i++) {
            if (!this.panels[i].id) {
                this.panels[i].id = 'layout_' + this.panelID.toString();
                this.panelID = this.panelID + 1;
            }
            this.oldRowCol[this.panels[i].id] = { row: this.panels[i].row, col: this.panels[i].col };
        }
        this.calculateCellSize();
    }

    protected createPanelElement(cssClass: string, idValue: string, className: string): HTMLElement {
        let ele: HTMLElement = <HTMLElement>this.createElement('div');
        if (cssClass) { addClass([ele], [cssClass]); }
        if (idValue) { ele.setAttribute('id', idValue); }
        return ele;
    }

    /**
     * To Initialize the control rendering.
     * @returns void
     * @private
     */

    protected render(): void {
        this.getRowColumn();
        this.setHeightWidth();
        if (this.element.childElementCount > 0) {
            let panelElements: HTMLElement[] = [];
            this.panels = [];
            for (let i: number = 0; i < this.element.querySelectorAll('.e-panel').length; i++) {
                panelElements.push(<HTMLElement>(this.element.querySelectorAll('.e-panel')[i]));
            }
            for (let i: number = 0; i < panelElements.length; i++) {
                let panelElement: HTMLElement = <HTMLElement>panelElements[i];
                if (this.enableRtl) {
                    addClass([panelElement], 'e-rtl');
                }
                let rowValue: number = parseInt(panelElement.getAttribute('data-row'), 10);
                let colValue: number = parseInt(panelElement.getAttribute('data-col'), 10);
                this.setPanelPosition(panelElement, rowValue, colValue);
                this.getInlinePanels(panelElement);
                this.maxCol();
                this.maxRow();
            }
            for (let i: number = 0; i < this.panels.length; i++) {
                let panelElement: HTMLElement = this.element.querySelector('#' + this.panels[i].id);
                let panel: HTMLElement = this.renderPanels(panelElement, this.panels[i]);
                this.panelCollection.push(panel);
                this.setMinMaxValues(this.panels[i]);
                this.setHeightAndWidth(panelElement, this.panels[i]);
                this.tempObject = this;
                if (this.mediaQuery && !window.matchMedia('(' + this.mediaQuery + ')').matches) {
                    this.setPanelPosition(panelElement, this.panels[i].row, this.panels[i].col);
                    this.updatePanelLayout(panelElement, this.panels[i]);
                }
                this.setClasses([panelElement]);
            }
            if (this.mediaQuery && window.matchMedia('(' + this.mediaQuery + ')').matches) {
                this.checkMediaQuerySizing();
            }
        } else {
            this.renderDashBoardCells(this.panels);
        }
        if (this.allowDragging && (this.mediaQuery ? !window.matchMedia('(' + this.mediaQuery + ')').matches : true)) {
            this.enableDraggingContent(this.panelCollection);
        }
        this.sortedPanel();
        this.bindEvents();

        if (this.allowFloating) {
            this.moveItemsUpwards();
        }
        this.updateOldRowColumn();
        this.sortedPanel();
        this.cloneArray = this.sortedArray;
        this.checkColumnValue = this.maxColumnValue;
        this.cloneObject = JSON.parse(JSON.stringify(this.oldRowCol));
        if (!(this.mediaQuery && window.matchMedia('(' + this.mediaQuery + ')').matches)) {
            this.panelResponsiveUpdate();
        }
        this.setEnableRtl();
    }

    protected calculateCellSize(): void {
        this.cellSize = [];
        if ((this.mediaQuery && window.matchMedia('(' + this.mediaQuery + ')').matches)) {
            this.cellSize[1] = Math.floor((this.element.parentElement.offsetWidth)) / this.cellAspectRatio;
        } else {

            this.cellSize[0] = Math.floor((this.element.parentElement.offsetWidth));
            this.cellSize[0] = Math.floor((this.element.parentElement.offsetWidth - ((this.maxCol() - 1) * this.cellSpacing[0]))
                / (this.maxCol()));
            this.cellSize[1] = <number>this.cellSize[0] / this.cellAspectRatio;
        }
    }
    protected maxRow(): number {
        let maxRow: number = 1;
        if (this.rows > 1) {
            maxRow = this.rows;
            return maxRow;
        }
        for (let i: number = 0; i < this.panels.length; i++) {
            if (this.panels[i].sizeY + this.panels[i].row > maxRow) {
                maxRow = this.panels[i].sizeY + this.panels[i].row;
            }
        }
        if (this.panels.length === 0) {
            maxRow = 1;
        }
        return maxRow;
    }

    protected maxCol(): number {
        let maxCol: number = 1;
        if (this.columns > 1) {
            maxCol = this.columns;
            return maxCol;
        }
        for (let i: number = 0; i < this.panels.length; i++) {
            if (this.panels[i].sizeX + this.panels[i].col > maxCol) {
                maxCol = this.panels[i].sizeX + this.panels[i].col;
            }
        }
        if (this.panels.length === 0) {
            maxCol = this.columns;
        }
        return maxCol;
    }

    protected updateOldRowColumn(): void {
        for (let i: number = 0; i < this.panels.length; i++) {
            let id: string = this.panels[i].id;
            if (document.getElementById(id)) {
                let row: number = parseInt(document.getElementById(id).getAttribute('data-row'), 10);
                let col: number = parseInt(document.getElementById(id).getAttribute('data-col'), 10);
                this.oldRowCol[this.panels[i].id] = { row: row, col: col };
            } else {
                continue;
            }
        }
    }

    protected createSubElement(cssClass: string, idValue: string, className: string): HTMLElement {
        let element: HTMLElement = <HTMLElement>this.createElement('div');
        if (className) { addClass([element], [className]); }
        if (cssClass) { addClass([element], [cssClass]); }
        if (idValue) { element.setAttribute('id', idValue); }
        return element;
    }
    private templateParser(template: string): Function {
        if (template) {
            try {
                if (document.querySelectorAll(template).length) {
                    return compile(document.querySelector(template).innerHTML.trim());
                }
            } catch (error) {
                return compile(template);
            }
        }
        return undefined;
    }

    protected renderTemplate(content: string, appendElement: HTMLElement): void {
        let templateFn: Function = this.templateParser(content);
        let templateElements: HTMLElement[] = [];
        for (let item of templateFn({})) {
            templateElements.push(item);
        }
        append([].slice.call(templateElements), appendElement);
    }
    protected renderPanels(cellElement: HTMLElement, panelModel: PanelModel): HTMLElement {
        addClass([cellElement], [panel, panelTransition]);
        this.panelContent = cellElement.querySelector('.e-panel-container') ?
            cellElement.querySelector('.e-panel-container') :
            this.createSubElement(panelModel.cssClass, cellElement.id + '_content', panelContainer);
        cellElement.appendChild(this.panelContent);
        if (!panelModel.enabled) { this.disablePanel(cellElement); }
        if (panelModel.header) {
            let headerTemplateElement: HTMLElement = this.createSubElement('', cellElement.id + 'template', '');
            addClass([headerTemplateElement], [header]);
            this.renderTemplate(<string>panelModel.header, headerTemplateElement);
            this.panelContent.appendChild(headerTemplateElement);
        }
        if (panelModel.content && panelModel.content) {
            this.panelBody = this.createSubElement(panelModel.cssClass, cellElement.id + '_body', panelContent);
            this.renderTemplate(<string>panelModel.content, this.panelBody);
            this.panelContent.appendChild(this.panelBody);
        }
        return cellElement;
    }

    protected disablePanel(panelElement: HTMLElement): void {
        addClass([panelElement], [disable]);
    }

    protected getInlinePanels(panelElement: HTMLElement): void {
        let model: PanelModel = {
            sizeX: parseInt(panelElement.getAttribute('data-sizex'), 10),
            sizeY: parseInt(panelElement.getAttribute('data-sizey'), 10),
            minSizeX: parseInt(panelElement.getAttribute('data-minsizex'), 10),
            minSizeY: parseInt(panelElement.getAttribute('data-minsizey'), 10),
            maxSizeX: parseInt(panelElement.getAttribute('data-maxsizex'), 10),
            maxSizeY: parseInt(panelElement.getAttribute('data-maxsizey'), 10),
            row: parseInt(panelElement.getAttribute('data-row'), 10),
            col: parseInt(panelElement.getAttribute('data-col'), 10),
            id: panelElement.getAttribute('id'),
            header: panelElement.querySelector('.e-panel-header') && '.e-panel-header',
            content: panelElement.querySelector('.e-panel-content') && '.e-panel-content',
        };
        if (!model.id) {
            model.id = 'layout_' + this.panelID.toString();
            panelElement.setAttribute('id', model.id);
            this.panelID = this.panelID + 1;
        }
        if (isUndefined(model.enabled)) {
            model.enabled = true;
        }
        this.panels.push(model);
    }
    private resizeEvents(): void {
        if (this.allowResizing) {
            for (let i: number = 0; i < document.querySelectorAll('.e-resize').length; i++) {
                EventHandler.add(document.querySelectorAll('.e-resize')[i], 'mousedown', this.downResizeHandler, this);
                EventHandler.add(document, 'mouseup', this.upResizeHandler, this);
            }
        }
    }

    protected bindEvents(): void {
        window.addEventListener('resize', this.onResize.bind(this));
        this.resizeEvents();
    }
    protected downResizeHandler(e: MouseEvent): void {
        this.resizeCalled = false;
        let el: HTMLElement = (<HTMLElement>(<HTMLElement>(e.currentTarget)).closest('.e-panel'));
        let args: ResizeArgs = { event: e, element: el };
        this.trigger('resizeStart', args);
        this.downTarget = (<HTMLElement>e.currentTarget);
        this.shadowEle = document.createElement('div');
        this.shadowEle.classList.add('e-holder');
        addClass([this.element], [preventSelect]);
        this.element.appendChild(this.shadowEle);
        this.lastMouseX = e.pageX;
        this.lastMouseY = e.pageY;

        this.elementX = parseInt(el.style.left, 10);
        this.elementY = parseInt(el.style.top, 10);
        this.elementWidth = el.offsetWidth;
        this.elementHeight = el.offsetHeight;
        this.originalWidth = this.getCellInstance(el.id).sizeX;
        this.originalHeight = this.getCellInstance(el.id).sizeY;
        EventHandler.add(document, 'mousemove', this.moveResizeHandler, this);

    };

    private getCellSize(): number[] {
        return [parseInt(<string>(this.cellSize[0]), 10), parseInt(<string>this.cellSize[1], 10)];

    }
    /* istanbul ignore next */
    protected moveResizeHandler(e: MouseEvent): void {
        this.moveTarget = this.downTarget;
        let el: HTMLElement = <HTMLElement>this.moveTarget.closest('.e-panel');
        let args: ResizeArgs = { event: e, element: el };
        this.trigger('resize', args);
        if (this.lastMouseX === e.pageX || this.lastMouseY === e.pageY) {
            return;
        }
        this.maxLeft = this.element.offsetWidth - 1;
        this.maxTop = <number>this.cellSize[1] * this.maxRows - 1;


        removeClass([el], 'e-panel-transition');
        addClass([el], [dragging]);
        let oldSizeX: number = this.getCellInstance(el.id).sizeX;
        let oldSizeY: number = this.getCellInstance(el.id).sizeY;
        let handleArray: string[] = [east, west, north, south, southEast, northEast, northWest, southWest];
        let oldProp: number[] = [this.elementWidth, this.elementHeight];
        for (let i: number = 0; i < (<HTMLElement>this.moveTarget).classList.length; i++) {
            if (handleArray.indexOf((<HTMLElement>this.moveTarget).classList[i]) !== -1) {
                this.handleClass = ((<HTMLElement>this.moveTarget).classList[i]);
            }
        }
        let panelModel: PanelModel = this.getCellInstance(el.getAttribute('id'));
        this.mouseX = e.pageX;
        this.mouseY = e.pageY;
        let diffX: number = this.mouseX - this.lastMouseX + this.mOffX;
        let diffY: number = this.mouseY - this.lastMouseY + this.mOffY;
        this.mOffX = this.mOffY = 0;
        this.lastMouseX = this.mouseX;
        this.lastMouseY = this.mouseY;
        let dY: number = diffY;
        let dX: number = diffX;
        if (this.handleClass && this.handleClass.indexOf('south') >= 0) {
            if (this.elementHeight + dY < this.getMinHeight(panelModel)) {
                diffY = this.getMinHeight(panelModel) - this.elementHeight;
                this.mOffY = dY - diffY;
            } else if (this.elementY + this.elementHeight + dY > this.maxTop) {
                diffY = this.maxTop - this.elementY - this.elementHeight;
                this.mOffY = dY - diffY;
            }
            this.elementHeight += diffY;
        }
        if (this.handleClass && this.handleClass.indexOf('east') >= 0) {
            if (this.elementWidth + dX < this.getMinWidth(panelModel)) {
                diffX = this.getMinWidth(panelModel) - this.elementWidth;
                this.mOffX = dX - diffX;
            } else if (this.elementX + this.elementWidth + dX > this.maxLeft) {
                diffX = this.maxLeft - this.elementX - this.elementWidth;
                this.mOffX = dX - diffX;
            }
            this.elementWidth += diffX;
        }
        el.style.top = this.elementY + 'px';
        el.style.left = this.elementX + 'px';
        el.style.width = this.elementWidth + 'px';
        el.style.height = this.elementHeight + 'px';
        let item: PanelModel = this.getResizeRowColumn(panelModel, <HTMLElement>this.moveTarget);
        if (item.col + item.sizeX > this.columns) {
            item.sizeX = item.sizeX - 1;
        }
        this.shadowEle.style.top = ((item.row * this.getCellSize()[1] + (item.row * this.cellSpacing[1]))) + 'px';
        this.shadowEle.style.left = ((item.col * this.getCellSize()[0]) + ((item.col) * this.cellSpacing[0])) + 'px';
        this.shadowEle.style.height = ((item.sizeY * (this.getCellSize()[1] + (this.cellSpacing[1])))) + 'px';
        this.shadowEle.style.width = ((item.sizeX * (this.getCellSize()[0] + (this.cellSpacing[0])))) + 'px';
        if (oldSizeX !== item.sizeX || oldSizeY !== item.sizeY) {
            oldSizeX = item.sizeX;
            oldSizeY = item.sizeY;
            el.setAttribute('data-sizeX', this.getCellInstance(el.id).sizeX.toString());
            el.setAttribute('data-sizeY', this.getCellInstance(el.id).sizeY.toString());
            el.setAttribute('data-row', this.getCellInstance(el.id).row.toString());
            el.setAttribute('data-col', this.getCellInstance(el.id).col.toString());
            this.mainElement = el;
            this.updatePanelLayout(el, this.getCellInstance(el.id));
            this.updateOldRowColumn();
            this.sortedPanel();
        }
    }

    protected upResizeHandler(e: MouseEvent): void {
        if (isNullOrUndefined(this.downTarget)) {
            return;
        }
        this.upTarget = (<HTMLElement>this.downTarget);
        let el: HTMLElement = <HTMLElement>this.upTarget.closest('.e-panel');
        let args: ResizeArgs = { event: e, element: el };
        this.trigger('resizeStop', args);
        if (el) {
            addClass([el], 'e-panel-transition');
            EventHandler.remove(document, 'mousemove', this.moveResizeHandler);
            if (this.shadowEle) {
                detach(this.shadowEle);
            }
            this.shadowEle = null;
            let panelModel: PanelModel = this.getCellInstance(el.getAttribute('id'));
            this.setPanelPosition(el, panelModel.row, panelModel.col);
            this.setHeightAndWidth(el, panelModel);
        }
        this.resizeCalled = false;
        if (this.allowFloating) {
            this.moveItemsUpwards();

        }
        this.updateOldRowColumn();
        this.sortedPanel();
        this.cloneArray = this.sortedArray;
        this.cloneObject = JSON.parse(JSON.stringify(this.oldRowCol));
    }
    protected getResizeRowColumn(item: PanelModel, e: HTMLElement): PanelModel {
        let col: number = item.col;
        let row: number = item.row;
        let sizeX: number = item.sizeX;
        if (['e-north', 'e-south'].indexOf(this.handleClass) === -1) {
            sizeX = this.pixelsToColumns(this.elementWidth, true);
        }

        let sizeY: number = item.sizeY;
        if (['e-east', 'e-west'].indexOf(this.handleClass) === -1) {
            sizeY = this.pixelsToRows(this.elementHeight, true);
        }
        if (item.col + item.sizeX > this.columns) {
            item.sizeX = item.sizeX - 1;
        }
        let canOccupy: boolean = row > -1 && col > -1 && sizeX + col <= this.maxCol() && sizeY + row <= this.maxRow();
        if (canOccupy && (this.getItems(row, col, sizeX, sizeY, this.getPanelBase(item.id)).length === 0)
            || this.allowPushing !== false) {
            item.row = row;
            item.col = col;
            item.sizeX = sizeX;
            item.sizeY = sizeY;
        }
        return item;
    }
    protected pixelsToColumns(pixels: number, isCeil: boolean): number {
        let curColWidth: number = <number>this.cellSize[0];
        return Math.ceil(pixels / curColWidth);
    }
    protected pixelsToRows(pixels: number, isCeil: boolean): number {
        return Math.ceil(pixels / <number>this.cellSize[1]);
    }
    protected getMinWidth(item: PanelModel): number {
        return (item.minSizeX) * this.getCellSize()[0];
    };

    protected getMinHeight(item: PanelModel): number {
        return (item.minSizeY) * this.getCellSize()[1];
    };

    protected sortedPanel(): void {
        this.sortedArray = [];
        for (let i: number = 0, l: number = this.panelCollection.length; i < l; ++i) {
            this.sortItem(this.panelCollection[i]);
        }
    }


    protected moveItemsUpwards(): void {
        if (this.allowFloating === false) {
            return;
        }
        for (let rowIndex: number = 0, l: number = this.sortedArray.length; rowIndex < l; ++rowIndex) {
            let columns: HTMLElement[] = this.sortedArray[rowIndex];
            if (!columns) {
                continue;
            }
            for (let colIndex: number = 0, len: number = columns.length; colIndex < len; ++colIndex) {
                let item: HTMLElement = columns[colIndex];
                if (item) {
                    this.moveItemUpwards(item);
                }
            }
        }
    };

    protected moveItemUpwards(item: HTMLElement): void {
        if (this.allowFloating === false || item === this.mainElement) {
            return;
        }
        let colIndex: number = this.getCellInstance(item.id).col;
        let sizeY: number = parseInt(item.getAttribute('data-sizeY'), 10);
        let sizeX: number = parseInt(item.getAttribute('data-sizeX'), 10);
        let availableRow: number = null;
        let availableColumn: number = null;
        let rowIndex: number = parseInt(item.getAttribute('data-row'), 10) - 1;

        while (rowIndex > -1) {
            let items: HTMLElement[] = this.collisionItems(rowIndex, colIndex, sizeX, sizeY, item);
            if (items.length !== 0) {
                break;
            }
            availableRow = rowIndex;
            availableColumn = colIndex;
            --rowIndex;
        }
        if (availableRow !== null) {
            this.sortItem(item, availableRow, availableColumn);
        }
    }

    private sortItem(item: HTMLElement, rowValue?: number, columnValue?: number, ignoreItems?: HTMLElement[] | HTMLElement): void {
        this.overlapElement = [];
        let column: number = parseInt((<HTMLElement>item).getAttribute('data-col'), 10);
        let row: number = parseInt((<HTMLElement>item).getAttribute('data-row'), 10);
        if (!this.sortedArray[row]) {
            this.sortedArray[row] = [];
        }
        this.sortedArray[row][column] = item;
        if (item !== undefined && rowValue !== undefined && columnValue !== undefined) {
            if (this.oldRowCol[item.id].row !== null &&
                typeof this.oldRowCol[item.id].col !== 'undefined') {
                let isSamePosition: boolean = this.oldRowCol[item.id].col === columnValue &&
                    this.oldRowCol[item.id].row === rowValue;
                {
                    let oldRow: HTMLElement[] = this.sortedArray[this.oldRowCol[item.id].row];
                    if (oldRow && oldRow[this.oldRowCol[item.id].col] === item) {
                        delete oldRow[this.oldRowCol[item.id].col];
                        this.updateOldRowColumn();
                        this.sortedPanel();
                    }
                }
            }
            this.oldRowCol[item.id].row = rowValue;
            this.oldRowCol[item.id].row = columnValue;
            if (!this.sortedArray[row]) {
                this.sortedArray[row] = [];
            }
            this.sortedArray[row][column] = item;
            if (this.allItems.indexOf(item) === -1) {
                this.allItems.push(item);
            }
            this.getCellInstance(item.id).row = rowValue;
            this.getCellInstance(item.id).col = columnValue;
            item.setAttribute('data-col', this.getCellInstance(item.id).col.toString());
            item.setAttribute('data-row', this.getCellInstance(item.id).row.toString());
            this.updateLayout(item, this.getCellInstance(item.id));
        }
    }

    protected updateLayout(element: HTMLElement, panelModel: PanelModel): void {
        this.setPanelPosition(element, panelModel.row, panelModel.col);
        this.setHeightAndWidth(element, panelModel);
        this.getRowColumn();
        this.setHeightWidth();
        this.sortedPanel();
    };

    protected onResize(): void {
        if (this.mediaQuery && window.matchMedia('(' + this.mediaQuery + ')').matches) {
            this.checkMediaQuerySizing();
        } else {
            if (this.element.classList.contains(responsive)) {
                removeClass([this.element], [responsive]);
                for (let i: number = 0; i < this.element.childElementCount; i++) {
                    let ele: HTMLElement = <HTMLElement>this.element.children[i];
                    let cellInstance: PanelModel = this.getCellInstance(ele.id);
                    let row: number = parseInt(ele.getAttribute('data-row'), 10);
                    let col: number = parseInt(ele.getAttribute('data-col'), 10);
                    cellInstance.row = row;
                    cellInstance.col = col;
                    this.setHeightAndWidth(ele, this.getCellInstance(ele.id));
                    this.setPanelPosition(ele, row, col);
                    this.getRowColumn();
                    this.setHeightWidth();
                }
            }
            this.panelResponsiveUpdate();
        }
        this.removeResizeClasses(this.panelCollection);
        this.setClasses(this.panelCollection);
        this.checkDragging(this.dragCollection);
    }

    protected checkDragging(dragCollection: Draggable[]): void {
        if (this.mediaQuery && window.matchMedia('(' + this.mediaQuery + ')').matches || !this.allowDragging) {
            for (let i: number = 0; i < dragCollection.length; i++) {
                dragCollection[i].destroy();
            }
        } else {
            for (let i: number = 0; i < dragCollection.length; i++) {
                dragCollection[i].destroy();
            }
            this.enableDraggingContent(this.panelCollection);
        }

    }

    protected checkMediaQuerySizing(): void {
        addClass([this.element], [responsive]);
        let panelElements: NodeList = this.element.querySelectorAll('.e-panel');
        this.updatedRows = panelElements.length;
        for (let i: number = 0; i < panelElements.length; i++) {
            if (this.mediaQuery && window.matchMedia('(' + this.mediaQuery + ')').matches) {
                setStyle(<HTMLElement>panelElements[i], { 'width': '100%' });
                (<HTMLElement>panelElements[i]).style.height = ' ' + (this.element.parentElement.offsetWidth / this.cellAspectRatio) + 'px';
                this.cellSize[1] = (this.element.parentElement.offsetWidth / this.cellAspectRatio);
                let panelModel: PanelModel = this.getCellInstance((<HTMLElement>panelElements[i]).id);
                panelModel.col = 0;
                panelModel.row = i;
                this.setPanelPosition(<HTMLElement>panelElements[i], panelModel.row, panelModel.col);
                this.setClasses(this.panelCollection);
                this.checkDragging(this.dragCollection);
                this.removeResizeClasses(this.panelCollection);
            }
        }
        this.getRowColumn();
        this.setHeightWidth();
    }

    protected panelResponsiveUpdate(): void {
        this.element.classList.add('e-responsive');
        this.calculateCellSize();
        for (let i: number = 0; i < this.element.querySelectorAll('.e-panel').length; i++) {
            let ele: Element = this.element.querySelectorAll('.e-panel')[i];
            let panelModel: PanelModel = this.getCellInstance(ele.id);
            this.setHeightAndWidth(<HTMLElement>ele, panelModel);
        }
        for (let i: number = 0; i < this.panels.length; i++) {
            this.setPanelPosition(document.getElementById(this.panels[i].id), this.panels[i].row, this.panels[i].col);
        }
        this.getRowColumn();
        this.setHeightWidth();
    }

    protected setHeightWidth(): void {
        let heightValue: string; let widthValue: string;
        if (this.mediaQuery && window.matchMedia('(' + this.mediaQuery + ')').matches) {
            heightValue = ((this.maxRow()) *
                (this.element.parentElement && Math.floor((this.element.parentElement.offsetWidth)) / this.cellAspectRatio) +
                (this.maxRow() - 1) * this.cellSpacing[1]) + 'px';
        } else {
            heightValue = ((this.maxRow()) *
                (<number>this.cellSize[0] / this.cellAspectRatio) + (this.maxRow() - 1) * this.cellSpacing[1]) + 'px';
        }
        setStyle(this.element, { 'height': heightValue });
        widthValue = window.getComputedStyle(this.element).width;
        setStyle(this.element, { 'width': widthValue });
    }

    protected setHeightAndWidth(panelElement: HTMLElement, panelModel: PanelModel): void {
        setStyle(panelElement, { 'height': formatUnit(this.setXYDimensions(panelModel)[0]) });
        setStyle(panelElement, { 'width': formatUnit(this.setXYDimensions(panelModel)[1]) });
    }

    protected renderCell(panel: PanelModel): HTMLElement {
        this.dimensions = this.setXYDimensions(panel);
        if (isUndefined(panel.enabled)) {
            panel.enabled = true;
        }
        let cellElement: HTMLElement = this.createPanelElement(panel.cssClass, panel.id, '');
        let dashBoardCell: HTMLElement = this.renderPanels(cellElement, panel);
        this.element.appendChild(cellElement);
        this.panelCollection.push(dashBoardCell);
        this.setXYAttributes(cellElement, panel);
        this.setHeightAndWidth(cellElement, panel);
        return cellElement;
    }

    protected setPanelPosition(cellElement: HTMLElement, row: number, col: number): void {
        if (!cellElement) {
            return;
        }
        let heightValue: number | string = this.getCellSize()[1];
        let widthValue: number | string = this.getCellSize()[0];
        let left: number = col === 0 ? 0 : (((col) * (parseInt(widthValue.toString(), 10) + this.cellSpacing[0])));
        let top: number = row === 0 ? 0 : (((row) * (parseInt(heightValue.toString(), 10) + this.cellSpacing[1])));
        setStyle(cellElement, { 'left': left + 'px', 'top': top + 'px' });
    }

    protected getRowColumn(): void {
        this.calculateMaxColumnValue(this.panels);
        if (this.columns < this.maxColumnValue) {
            this.columns = this.maxColumnValue;
        }
        this.rows = null;
        if (this.element.querySelectorAll('.e-panel').length > 0 && !this.updatedRows) {
            let panelElements: NodeList = this.element.querySelectorAll('.e-panel');
            for (let i: number = 0; i < panelElements.length; i++) {
                let panelElement: HTMLElement = <HTMLElement>panelElements[i];
                let rowValue: number = parseInt(panelElement.getAttribute('data-row'), 10);
                let xValue: number = parseInt(panelElement.getAttribute('data-sizeY'), 10);
                this.rows = Math.max(this.rows, (rowValue + xValue));
            }
        } else {
            if (this.updatedRows) {
                this.rows = this.updatedRows;
                this.updatedRows = null;
            }
            for (let i: number = 0; i < this.panels.length; i++) {
                this.rows = Math.max(this.rows, this.panels[i].row);
            }
        }
    }

    protected setMinMaxValues(panel: PanelModel): void {
        if (!panel.sizeX || panel.sizeX < panel.minSizeX) {
            panel.sizeX = panel.minSizeX;
        } else if ((panel.maxSizeX && panel.sizeX > panel.maxSizeX)) {
            panel.sizeX = panel.maxSizeX;
        } else if (panel.sizeX > this.columns) {
            panel.sizeX = this.columns;
        } else {
            panel.sizeX = panel.sizeX;
        }
        if (!panel.sizeY || panel.sizeY < panel.minSizeY) {
            panel.sizeY = panel.minSizeY;
        } else if (panel.maxSizeY && panel.sizeY > panel.maxSizeY) {
            panel.sizeY = panel.maxSizeY;
        } else {
            panel.sizeY = panel.sizeY;
        }

    }

    protected calculateMaxColumnValue(panels: PanelModel[]): void {
        for (let count: number = 0; count < panels.length; count++) {
            let panel: PanelModel = panels[count];
            if (isUndefined(this.maxColumnValue)) {
                this.maxColumnValue = panel.col + panel.sizeX;
            } else if (this.maxColumnValue < panel.col) {
                this.maxColumnValue = panel.col + panel.sizeX;
            }
            if (this.maxColumnValue < panel.col + panel.sizeX) {
                this.maxColumnValue = panel.sizeX + panel.col;
            }
        }
    }

    protected renderDashBoardCells(cells: PanelModel[]): void {
        let isValid: boolean = true;
        if (this.panels.length === 1) {
            if (isNullOrUndefined(this.panels[0].content)) {
                isValid = false;
            } else {
                isValid = true;
            }
        }
        if (this.element.querySelectorAll('.e-panel').length > 0 || (isValid && (this.panels.length > 0))) {
            for (let j: number = 0; j < cells.length; j++) {
                this.gridPanelCollection.push(<HTMLElement>cells[j]);
                this.setMinMaxValues(cells[j]);
                let cell: HTMLElement = this.renderCell(cells[j]);
                if (this.enableRtl) {
                    addClass([cell], 'e-rtl');
                }
                this.element.appendChild(cell);
                if (this.mediaQuery && window.matchMedia('(' + this.mediaQuery + ')').matches) {
                    this.checkMediaQuerySizing();
                } else {
                    this.setPanelPosition(cell, cells[j].row, cells[j].col);
                    this.updatePanelLayout(cell, cells[j]);
                }
            }
        }
        this.setClasses(this.panelCollection);
    }

    protected collisionItems(row: number, col: number, sizeX: number, sizeY: number, ignore: HTMLElement[] | HTMLElement): HTMLElement[] {
        let items: HTMLElement[] = [];
        if (!sizeX || !sizeY) {
            sizeX = sizeY = 1;
        }
        if (ignore && !(ignore instanceof Array)) {
            ignore = [ignore];
        }
        let item: PanelModel;
        for (let h: number = 0; h < sizeY; ++h) {
            for (let w: number = 0; w < sizeX; ++w) {
                item = this.getPanel(row + h, col + w, ignore);
                if (item && (!ignore || (<HTMLElement[]>ignore).indexOf(document.getElementById(item.id)) === -1) &&
                    (<HTMLElement[]>items).indexOf(document.getElementById(item.id)) === -1) {
                    items.push(document.getElementById(item.id));
                }
            }
        }
        return items;
    };

    protected rightWardsSpaceChecking(rowElements: HTMLElement[], col: number, ele: HTMLElement): number[] {
        let columns: number[] = [];
        let spacedColumns: number[] = [];
        rowElements.forEach((element: HTMLElement) => {
            let columnValue: number = parseInt(element.getAttribute('data-col'), 10);
            let sizeXValue: number = parseInt(element.getAttribute('data-sizeX'), 10);
            if (col < this.columns && columnValue >= col) {
                if (sizeXValue > 1) {
                    for (let i: number = columnValue; i < columnValue + sizeXValue; i++) {
                        columns.push(i);
                    }
                } else {
                    columns.push(columnValue);
                }
            }
        });
        if (columns.length > 0) {
            for (let i: number = col + 1; i <= this.columns - 1; i++) {
                if (columns.indexOf(i) === -1 && i !== col) {
                    if (spacedColumns.indexOf(i) === -1) {
                        spacedColumns.push(i);
                    }
                }
            }
        }
        let occupiedValues: number[] = this.getOccupiedColumns(ele, 'right');
        occupiedValues.forEach((colValue: number) => {
            if (colValue > col && spacedColumns.indexOf(colValue) !== -1) {
                spacedColumns.splice(spacedColumns.indexOf(colValue), 1);
            }
        });
        let eleOccupiedValues: number[] = this.getOccupiedColumns(this.checkingElement, 'left');
        eleOccupiedValues.forEach((col: number) => {
            if (col > parseInt(ele.getAttribute('data-col'), 10) && occupiedValues.indexOf(col) === -1 &&
                spacedColumns.indexOf(col) === -1) {
                spacedColumns.push(col);
            }
        });
        spacedColumns = spacedColumns.sort((next: number, previous: number) => { return next - previous; });
        return spacedColumns;
    }

    protected getOccupiedColumns(element: HTMLElement, type: string): number[] {
        let occupiedItems: number[] = [];
        let sizeX: number = parseInt(element.getAttribute('data-sizeX'), 10);
        let col: number = parseInt(element.getAttribute('data-col'), 10);
        for (let i: number = col; (i < col + sizeX && i <= this.columns); i++) {
            occupiedItems.push(i);
        }
        return occupiedItems;
    }

    protected leftWardsSpaceChecking(rowElements: HTMLElement[], col: number, ele: HTMLElement): number[] {
        let spacedColumns: number[] = [];
        let columns: number[] = [];
        rowElements.forEach((element: HTMLElement) => {
            let colValue: number = parseInt(element.getAttribute('data-col'), 10);
            let xValue: number = parseInt(element.getAttribute('data-sizeX'), 10);
            if (col <= this.columns && colValue <= col) {
                if (xValue > 1) {
                    for (let i: number = colValue; i < colValue + xValue; i++) {
                        columns.push(i);
                    }
                } else {
                    columns.push(colValue);
                }
            }
        });
        if (columns.length > 0) {
            for (let i: number = 0; i <= col; i++) {
                if (columns.indexOf(i) === -1 && i !== col) {
                    if (spacedColumns.indexOf(i) === -1) {
                        spacedColumns.push(i);
                    }
                }
            }
        }
        let occupiedValues: number[] = this.getOccupiedColumns(ele, 'left');
        occupiedValues.forEach((colValue: number) => {
            if (colValue < col && spacedColumns.indexOf(colValue) !== -1) {
                spacedColumns.splice(spacedColumns.indexOf(colValue), 1);
            }
        });
        let eleOccupiedValues: number[] = this.getOccupiedColumns(this.checkingElement, 'left');
        eleOccupiedValues.forEach((col: number) => {
            if (col < parseInt(ele.getAttribute('data-col'), 10) && occupiedValues.indexOf(col) === -1 &&
                spacedColumns.indexOf(col) === -1) {
                spacedColumns.push(col);
            }
        });
        spacedColumns = spacedColumns.sort((next: number, prev: number) => { return next - prev; });
        spacedColumns = spacedColumns.reverse();
        return spacedColumns;
    }


    protected adjustmentAvailable(row: number, col: number, sizeY: number, sizeX: number, ele: HTMLElement): boolean {
        this.leftAdjustable = undefined;
        this.rightAdjustable = undefined;
        let isAdjustable: boolean = false;
        let leftSpacing: number[];
        let rightSpacing: number[];
        let rowElement: HTMLElement[] = [];
        this.topAdjustable = undefined;
        let eleSizeX: number = parseInt(ele.getAttribute('data-sizeX'), 10);
        let eleCol: number = parseInt(ele.getAttribute('data-col'), 10);
        rowElement = this.getRowElements(this.collisionItems(row, 0, this.columns, sizeY, []));
        if (rowElement.indexOf(ele) === -1) {
            rowElement.push(ele);
        }
        leftSpacing = this.leftWardsSpaceChecking(rowElement, col, ele);
        if (leftSpacing.length > 0) {
            this.leftAdjustable = this.isLeftAdjustable(leftSpacing, ele, row, col, sizeX, sizeY);
            if (this.spacedColumnValue !== eleCol - this.getCellInstance(this.checkingElement.id).sizeX) {
                this.leftAdjustable = false;
            }
            if (this.leftAdjustable) {
                this.rightAdjustable = false;
            } else {
                this.leftAdjustable = false;
                rightSpacing = this.rightWardsSpaceChecking(rowElement, col, ele);
                this.rightAdjustable = rightSpacing.length > 0 ? this.isRightAdjustable(rightSpacing, ele, row, col, sizeX, sizeY) : false;
                if (this.spacedColumnValue !== eleSizeX + eleCol) {
                    this.rightAdjustable = false;
                }
                if (!this.rightAdjustable) {
                    this.rightAdjustable = false;
                }
            }
        } else {
            rightSpacing = this.rightWardsSpaceChecking(rowElement, col, ele);
            this.rightAdjustable = rightSpacing.length > 0 ? this.isRightAdjustable(rightSpacing, ele, row, col, sizeX, sizeY) : false;
            if (this.spacedColumnValue !== eleSizeX + eleCol) {
                this.rightAdjustable = false;
            }
            if (this.rightAdjustable) {
                this.leftAdjustable = false;
            }
        }
        if (!this.rightAdjustable && !this.leftAdjustable && row > 0) {
            let endRow: number = this.getCellInstance(ele.id).row;
            let topCheck: boolean = false;
            if (this.startRow !== endRow) {
                topCheck = true;
            }
            for (let rowValue: number = row; rowValue >= 0; rowValue--) {
                let element: HTMLElement = (this.getCellInstance(ele.id).sizeY > 1 && topCheck) ? this.checkingElement : ele;
                if ((rowValue !== endRow) && (sizeY > 1 ? rowValue === endRow - sizeY - 1 : rowValue === endRow - sizeY) &&
                    this.collisionItems(rowValue, col, sizeX, sizeY, element).length === 0) {
                    topCheck = false;
                    this.topAdjustable = true;
                    this.spacedRowValue = isNullOrUndefined(this.spacedRowValue) ? rowValue : this.spacedRowValue;
                    this.spacedColumnValue = col;
                }
            }
        }
        if (this.rightAdjustable || this.leftAdjustable || this.topAdjustable) {
            isAdjustable = true;
            if (isNullOrUndefined(this.spacedRowValue)) {
                this.spacedRowValue = row;
            }
        }
        return isAdjustable;
    }

    protected isXSpacingAvailable(spacing: number[], sizeX?: number): boolean {
        let isSpaceAvailable: boolean = false;
        let subSpacingColumns: number[] = [];
        for (let i: number = 0; i < spacing.length; i++) {
            if (spacing[i + 1] - spacing[i] === 1 || spacing[i + 1] - spacing[i] === -1) {
                subSpacingColumns.push(spacing[i]);
                if (sizeX === 2) {
                    subSpacingColumns.push(spacing[i + 1]);
                }
                if (i === spacing.length - 2) {
                    subSpacingColumns.push(spacing[i + 1]);
                    if (subSpacingColumns.length > sizeX) {
                        subSpacingColumns.splice(-1);
                    }
                }
                if (subSpacingColumns.length === sizeX) {
                    isSpaceAvailable = true;
                    this.spacedColumnValue = subSpacingColumns.sort((next: number, previous: number) => { return next - previous; })[0];
                    if (this.spacedColumnValue < 0) {
                        this.spacedColumnValue = 1;
                    }
                    return isSpaceAvailable;
                }
            } else {
                subSpacingColumns = [];
                continue;
            }
        }
        return isSpaceAvailable;
    }

    protected getRowElements(base: HTMLElement[]): HTMLElement[] {
        let rowElements: HTMLElement[] = [];
        for (let i: number = 0; i < base.length; i++) {
            rowElements.push(base[i]);
        }
        return rowElements;
    }
    protected isLeftAdjustable(spaces: number[], ele: HTMLElement, row: number, col: number, sizeX: number, sizeY: number): boolean {
        let isLeftAdjudtable: boolean;
        if (sizeX === 1 && sizeY === 1 && spaces.length > 0) {
            this.spacedColumnValue = spaces[0];
            isLeftAdjudtable = true;
        } else if (sizeX > 1 && sizeY === 1) {
            isLeftAdjudtable = this.isXSpacingAvailable(spaces, sizeX);
        } else if (sizeY > 1) {
            if (sizeX === 1) {
                let xAdjust: boolean;
                if (spaces.length >= 1) {
                    xAdjust = true;
                }
                if (xAdjust) {
                    for (let i: number = 0; i < spaces.length; i++) {
                        let collisionValue: HTMLElement[] = this.collisionItems(row, spaces[i], sizeX, sizeY, this.checkingElement);
                        if (collisionValue.length === 0) {
                            this.spacedColumnValue = spaces[i];
                            isLeftAdjudtable = true;
                            return isLeftAdjudtable;
                        } else {
                            isLeftAdjudtable = false;
                        }
                    }
                }
            } else {
                let checkValues: number[] = this.getColumnValues(this.checkingElement);
                let eleValues: number[] = this.getColumnValues(ele);
                isLeftAdjudtable = this.replacable(spaces, sizeX, row, sizeY, ele);
            }
        }
        return isLeftAdjudtable;
    }

    protected isRightAdjustable(spacing: number[], ele: HTMLElement, row: number, col: number, sizeX: number, sizeY: number): boolean {
        let isRightAdjudtable: boolean;
        if (sizeX === 1 && sizeY === 1 && spacing.length > 0) {
            this.spacedColumnValue = spacing[0];
            isRightAdjudtable = true;
        } else if (sizeX > 1 && sizeY === 1) {
            isRightAdjudtable = this.isXSpacingAvailable(spacing, sizeX);
        } else if (sizeY > 1) {
            if (sizeX === 1) {
                let xAdjust: boolean;
                if (spacing.length >= 1) {
                    xAdjust = true;
                }
                if (xAdjust) {
                    for (let i: number = 0; i < spacing.length; i++) {
                        let collisionValue: HTMLElement[] = this.collisionItems(row, spacing[i], sizeX, sizeY, this.checkingElement);
                        for (let collision: number = 0; collision < collisionValue.length; collision++) {
                            if (parseInt(ele.getAttribute('data-col'), 10) !== spacing[i]) {
                                collisionValue.splice(collisionValue.indexOf(collisionValue[collision]), 1);
                            }
                        }
                        if (collisionValue.length === 0) {
                            isRightAdjudtable = true;
                            this.spacedColumnValue = spacing[i];
                            return isRightAdjudtable;
                        } else {
                            isRightAdjudtable = false;
                        }
                    }
                }
            } else {
                let subValues: number[] = this.getColumnValues(this.checkingElement);
                let eleValues: number[] = this.getColumnValues(ele);
                isRightAdjudtable = this.replacable(spacing, sizeX, row, sizeY, ele);
            }
        }
        return isRightAdjudtable;
    }
    protected replacable(spacing: number[], sizeX: number, row: number, sizeY: number, ele: HTMLElement): boolean {
        let isRightAdjudtable: boolean;
        let updatedCollision: HTMLElement[] = [];
        for (let j: number = 0; j < spacing.length; j++) {
            let xAdjust: boolean = this.isXSpacingAvailable(spacing, sizeX);
            if (xAdjust) {
                let exclusions: HTMLElement[] = [];
                exclusions.push(this.checkingElement);
                exclusions.push(ele);
                if (updatedCollision.length === 0) {
                    isRightAdjudtable = true;
                    this.spacedColumnValue = this.spacedColumnValue;
                    return isRightAdjudtable;
                } else {
                    isRightAdjudtable = false;
                }
            }
        }
        return isRightAdjudtable;
    }

    protected getColumnValues(element: HTMLElement): number[] {
        let colValues: number[] = [];
        let colValue: number = parseInt(element.getAttribute('data-col'), 10);
        let sizeXValue: number = parseInt(element.getAttribute('data-sizeX'), 10);
        for (let i: number = colValue; i < colValue + sizeXValue; i++) {
            colValues.push(i);
        }
        return colValues;
    }

    protected sortCollisionItems(collisionItems: HTMLElement[]): HTMLElement[] {
        let updatedCollision: HTMLElement[] = [];
        let rowElements: HTMLElement[];
        for (let row: number = this.rows - 1; row >= 0; row--) {
            rowElements = [];
            collisionItems.forEach((element: HTMLElement) => {
                if (element && element.getAttribute('data-row') === row.toString()) {
                    rowElements.push(element);
                }
            });
            for (let column: number = this.columns - 1; column >= 0; column--) {
                rowElements.forEach((item: HTMLElement) => {
                    if (item && item.getAttribute('data-col') === column.toString()) {
                        updatedCollision.push(item);
                    }
                });
            }
        }
        return updatedCollision;
    }

    protected updatedModels(collisionItems: HTMLElement[], panelModel: PanelModel, ele: HTMLElement): HTMLElement[] {
        if (!this.mainElement) {
            this.sortedPanel();
        }
        collisionItems.forEach((element: HTMLElement) => {
            this.checkingElement = element;
            let model: PanelModel = this.getCellInstance(element.id);
            let adjust: boolean = !this.adjustmentAvailable(model.row, model.col, model.sizeY, model.sizeX, ele);
            if (model.sizeX > 1 && adjust) {
                for (let rowValue: number = model.row; rowValue < panelModel.row + panelModel.sizeY; rowValue++) {
                    let collisions: HTMLElement[] = this.collisionItems(rowValue, model.col, model.sizeX, model.sizeY, element);
                    collisions.forEach((item: HTMLElement) => {
                        if (collisionItems.indexOf(item) >= 0) {
                            collisionItems.splice(collisionItems.indexOf(item), 1);
                        }
                    });
                }
            }
        });
        return collisionItems;
    }

    protected resetLayout(model: PanelModel, element: HTMLElement): HTMLElement[] {
        let collisions: HTMLElement[] = this.collisionItems(model.row, model.col, model.sizeX, model.sizeY, this.mainElement);
        if (!this.mainElement || this.addPanelCalled || this.resizeCalled || this.movePanelCalled) {
            return collisions;
        }
        if (this.mainElement && this.oldRowCol !== this.cloneObject) {
            for (let i: number = 0; i < this.panels.length; i++) {
                let element: HTMLElement = document.getElementById(this.panels[i].id);
                if (element === this.mainElement) {
                    continue;
                }
                let rowValue: number = this.cloneObject[element.id].row;
                let colValue: number = this.cloneObject[element.id].col;
                this.setPanelPosition(element, rowValue, colValue);
                this.getCellInstance(element.id).row = rowValue;
                this.getCellInstance(element.id).col = colValue;
                element.setAttribute('data-row', rowValue.toString());
                element.setAttribute('data-col', colValue.toString());
                this.updateOldRowColumn();
            }
        }
        this.sortedArray = this.cloneArray;
        collisions = this.collisionItems(model.row, model.col, model.sizeX, model.sizeY, this.mainElement);
        this.sortedPanel();
        this.updateOldRowColumn();
        if (this.checkCollision && this.checkCollision.length > 0 && collisions.indexOf(this.checkCollision[0]) === -1 &&
            this.cloneObject[this.checkCollision[0].id].row === model.row) {
            collisions.push(this.checkCollision[0]);
        }
        return collisions;
    }

    protected swapAvailability(collisions: HTMLElement[], element: HTMLElement): boolean {
        let available: boolean = true;
        let eleModel: PanelModel = this.getCellInstance(element.id);
        for (let count: number = 0; count < collisions.length; count++) {
            let collideModel: PanelModel = this.getCellInstance(collisions[count].id);
            for (let i: number = 1; i < eleModel.sizeY; i++) {
                let excludeEle: HTMLElement[] = [];
                excludeEle.push(element);
                excludeEle.push(collisions[count]);
                let collision: HTMLElement[];
                collision = this.collisionItems(eleModel.row + i, collideModel.col, collideModel.sizeX, collideModel.sizeY, excludeEle);
                if (collision.length > 0) {
                    available = false;
                    return false;
                } else {
                    continue;
                }
            }
        }
        return available;
    }

    protected checkForSwapping(collisions: HTMLElement[], element: HTMLElement, panelModel: PanelModel): boolean {
        if (!this.mainElement || collisions.length === 0) {
            return false;
        }
        let direction: number;
        let eleSwapRow: number = parseInt(collisions[0].getAttribute('data-row'), 10);
        if (this.startRow < eleSwapRow) {
            direction = 1;
        } else if (this.startRow > eleSwapRow) {
            direction = 0;
        }
        if (!this.swapAvailability(collisions, element)) {
            return false;
        }
        let isSwappable: boolean = false;
        for (let count1: number = 0; count1 < collisions.length; count1++) {
            if (collisions.length >= 1 && this.cloneObject[this.mainElement.id].row === this.oldRowCol[this.mainElement.id].row) {
                return false;
            }
        }
        let updatedRow: number = direction === 0 ?
            this.getCellInstance(this.mainElement.id).row + this.getCellInstance(this.mainElement.id).sizeY
            : this.startRow;
        for (let count: number = 0; count < collisions.length; count++) {
            let collideInstance: PanelModel = this.getCellInstance(collisions[count].id);
            let elementinstance: PanelModel = this.getCellInstance(element.id);
            let ignore: HTMLElement[] = [];
            if (collideInstance.sizeY === 1) {
                ignore.push(collisions[count]);
            } else if (collideInstance.sizeY > 1) {
                if (direction === 1 && elementinstance.row === (this.cloneObject[collideInstance.id].row + collideInstance.sizeY - 1)) {
                    ignore.push(collisions[count]);
                } else if (direction === 0 && elementinstance.row === (this.cloneObject[collideInstance.id].row)) {
                    ignore.push(collisions[count]);
                } else {
                    return false;
                }
            }
            if (collideInstance.sizeY <= elementinstance.sizeY) {
                ignore.push(collisions[count]);
            }
            let swapCollision: HTMLElement[];
            swapCollision = this.collisionItems(updatedRow, collideInstance.col, collideInstance.sizeX, collideInstance.sizeY, ignore);
            if (swapCollision.length > 0) {
                isSwappable = false;
                return isSwappable;
            } else {
                if (count === collisions.length - 1) {
                    isSwappable = true;
                }
                continue;
            }
        }
        return isSwappable;
    }

    protected swapItems(collisions: HTMLElement[], element: HTMLElement, panelModel: PanelModel): void {
        let direction: number;
        let swappedElements: HTMLElement[] = [];
        swappedElements.push(element);
        let eleSwapRow: number = parseInt(collisions[0].getAttribute('data-row'), 10);
        if (this.startRow < eleSwapRow) {
            direction = 1;
        } else if (this.startRow > eleSwapRow) {
            direction = 0;
        }
        let collisionItemsRow: number = direction === 0 ? eleSwapRow + panelModel.sizeY : this.startRow;
        panelModel.row = direction === 0 ? eleSwapRow : collisionItemsRow + 1;
        for (let count: number = 0; count < collisions.length; count++) {
            swappedElements.push(collisions[count]);
            this.setPanelPosition(collisions[count], collisionItemsRow, (this.getCellInstance(collisions[count].id)).col);
            this.getCellInstance(collisions[count].id).row = collisionItemsRow;
            collisions[count].setAttribute('data-row', collisionItemsRow.toString());
        }
        element.setAttribute('data-row', panelModel.row.toString());
        this.setPanelPosition(this.shadowEle, panelModel.row, panelModel.col);
        for (let i: number = 0; i < this.panels.length; i++) {
            this.oldRowCol[this.panels[i].id] = { row: this.panels[i].row, col: this.panels[i].col };
        }
        this.startRow = panelModel.row;
        this.updateOldRowColumn();
        swappedElements.forEach((item: HTMLElement) => {
            this.cloneObject[item.id] = this.oldRowCol[item.id];
            let itemModel: PanelModel = this.getCellInstance(item.id);
            for (let i: number = 0; i < this.sortedArray.length; i++) {
                if (!this.sortedArray[i]) {
                    continue;
                }
                for (let j: number = 0; j < this.sortedArray[i].length; j++) {
                    if (this.sortedArray[i][j] === item) {
                        this.sortedArray[i][j] = undefined;
                    }
                }
            }
            if (!this.sortedArray[itemModel.row]) {
                this.sortedArray[itemModel.row] = [];
            }
            this.sortedArray[itemModel.row][itemModel.col] = item;
            this.cloneArray = this.sortedArray;
        });
    }


    protected updatePanelLayout(element: HTMLElement, panelModel: PanelModel): void {
        this.collisionChecker = {};
        let initialModel: HTMLElement[] = [];
        let checkForAdjustment: boolean;
        let collisionModels: HTMLElement[] = [];
        let swappingAvailable: boolean;
        if (this.mainElement) {
            initialModel = this.resetLayout(panelModel, element);
        } else {
            initialModel = this.collisionItems(panelModel.row, panelModel.col, panelModel.sizeX, panelModel.sizeY, element);
        }
        if (initialModel.length > 0) {
            initialModel = this.sortCollisionItems(initialModel);
            initialModel = this.updatedModels(initialModel, panelModel, element);
            swappingAvailable = !isNullOrUndefined(this.startRow) ? this.checkForSwapping(initialModel, element, panelModel) : false;
            if (swappingAvailable) {
                this.swapItems(initialModel, element, panelModel);
            } else {
                for (let i: number = 0; i < initialModel.length; i++) {
                    let model: PanelModel = this.getCellInstance(initialModel[i].id);
                    this.checkingElement = initialModel[i];
                    this.spacedRowValue = null;
                    this.spacedColumnValue = null;
                    checkForAdjustment = this.adjustmentAvailable(model.row, model.col, model.sizeY, model.sizeX, element);
                    if (checkForAdjustment && !isNullOrUndefined(this.spacedColumnValue)) {
                        this.setPanelPosition(initialModel[i], this.spacedRowValue, this.spacedColumnValue);
                        this.oldRowCol[(initialModel[i].id)] = { row: this.spacedRowValue, col: this.spacedColumnValue };
                        initialModel[i].setAttribute('data-col', this.spacedColumnValue.toString());
                        initialModel[i].setAttribute('data-row', this.spacedRowValue.toString());
                        model.col = this.spacedColumnValue;
                        model.row = this.spacedRowValue;
                        this.topAdjustable = false;
                        this.spacedRowValue = null;
                        if (i < initialModel.length) {
                            continue;
                        }
                    } else {
                        collisionModels.push(initialModel[i]);
                    }
                }
            }
        }
        if (collisionModels.length > 0) {
            let proxy: DashboardLayout = this;
            collisionModels.forEach((item1: HTMLElement) => {
                if (proxy.overlapElement.indexOf(item1) === -1) {
                    proxy.overlapElement.push(item1);
                }
            });
            if (this.overlapElement && this.overlapElement.indexOf(element) !== -1) {
                this.overlapElement.splice(this.overlapElement.indexOf(element), 1);
            }
            if (collisionModels.length > 0) {
                this.updateRowColumn(panelModel.row, this.overlapElement, element);
                this.checkForCompletePushing();
            }
        }
        if (!this.isSubValue) {
            this.sortedPanel();
        }
        this.getRowColumn();
        this.setHeightWidth();
    }

    protected checkForCompletePushing(): void {
        for (let i: number = 0; i < this.panels.length; i++) {
            if (this.collisionChecker[this.panels[i].id] && this.collisionChecker[this.panels[i].id] !== null) {
                this.overlapElement = [this.collisionChecker[this.panels[i].id].ele];
                let key: string = this.panels[i].id;
                this.updateRowColumn(this.collisionChecker[key].row, this.overlapElement, this.collisionChecker[key].srcEle);
            }
        }
    }

    protected updateCollisionChecked(item: HTMLElement): void {
        for (let count: number = 0; count < Object.keys(this.collisionChecker).length; count++) {
            this.collisionChecker[item.id] = null;
        }
    }
    protected updateRowColumn(row: number, ele: HTMLElement[], srcEle: HTMLElement): void {
        if (!srcEle) {
            return;
        }
        let eleSizeY: number = parseInt(srcEle.getAttribute('data-sizeY'), 10);
        let eleRow: number = parseInt(srcEle.getAttribute('data-row'), 10);
        this.overlapElementClone = this.overlapElement && !this.shouldRestrict ? this.overlapElement : this.overlapElement;
        for (let i: number = 0; i < this.overlapElementClone.length; i++) {
            if (this.overlapElementClone.length === 0) {
                return;
            }
            for (let i: number = 0; i < this.overlapElementClone.length; i++) {
                this.collisionChecker[this.overlapElementClone[i].id] = {
                    ele: this.overlapElementClone[i],
                    row: row,
                    srcEle: srcEle
                };
            }
            let updatedRow: number = eleRow + eleSizeY;
            let collisionY: number = parseInt(this.overlapElementClone[i].getAttribute('data-sizeY'), 10);
            let collisionCol: number = parseInt(this.overlapElementClone[i].getAttribute('data-col'), 10);
            let collisionX: number = parseInt(this.overlapElementClone[i].getAttribute('data-sizeX'), 10);
            let colValue: number;
            let collisionModels: HTMLElement[];
            if (this.overlapSubElementClone.indexOf(srcEle) === - 1) {
                this.overlapSubElementClone.push(srcEle);
            }
            if (this.overlapSubElementClone.indexOf(this.overlapElementClone[i]) === - 1) {
                this.overlapSubElementClone.push(this.overlapElementClone[i]);
            }
            if (collisionY > 1 || collisionX > 1) {
                let overlapElementModel: PanelModel = this.getCellInstance(this.overlapElementClone[i].id);
                colValue = overlapElementModel.col;
                let ele: HTMLElement = document.getElementById(overlapElementModel.id);
                for (let k: number = overlapElementModel.row; k < eleRow + eleSizeY; k++) {
                    this.isSubValue = true;
                    overlapElementModel.row = overlapElementModel.row + 1;
                    ele.setAttribute('data-row', overlapElementModel.row.toString());
                    this.setPanelPosition(ele, overlapElementModel.row, colValue);
                    this.updateCollisionChecked(ele);
                    this.oldRowCol[(ele.id)] = { row: overlapElementModel.row, col: colValue };
                    let panelModel: PanelModel = this.getCellInstance(ele.id);
                    panelModel.col = colValue;
                    panelModel.row = overlapElementModel.row;
                    let eleRow: number = parseInt(ele.getAttribute('data-row'), 10);
                    let eleCol: number = parseInt(ele.getAttribute('data-col'), 10);
                    let sizeX: number = parseInt(ele.getAttribute('data-sizeX'), 10);
                    let sizeY: number = parseInt(ele.getAttribute('data-sizeY'), 10);
                    let excludeElements: HTMLElement[] = [];
                    excludeElements.push(ele);
                    excludeElements.push(srcEle);
                    collisionModels = this.collisionItems(eleRow, eleCol, sizeX, sizeY, excludeElements);
                    if (this.mainElement && collisionModels.indexOf(this.mainElement) !== -1) {
                        collisionModels.splice(collisionModels.indexOf(this.mainElement), 1);
                    }
                    this.updatePanel(collisionModels, eleCol, eleRow, ele);
                }
                this.isSubValue = false;
            } else {
                if (this.addPanelCalled) {
                    this.addPanelCalled = false;
                }
                this.overlapElementClone[i].setAttribute('data-row', updatedRow.toString());
                let excludeEle: HTMLElement[] = [];
                excludeEle.push(this.overlapElementClone[i]);
                excludeEle.push(srcEle);
                collisionModels = this.collisionItems(updatedRow, collisionCol, collisionX, collisionY, excludeEle);
                if (this.mainElement && collisionModels.indexOf(this.mainElement) !== -1) {
                    collisionModels.splice(collisionModels.indexOf(this.mainElement), 1);
                }
                colValue = parseInt(this.overlapElementClone[i].getAttribute('data-col'), 10);
                this.setPanelPosition(this.overlapElementClone[i], updatedRow, colValue);
                this.updateCollisionChecked(this.overlapElementClone[i]);
                this.oldRowCol[(this.overlapElementClone[i].id)] = { row: updatedRow, col: colValue };
                let panelModel: PanelModel = this.getCellInstance(this.overlapElementClone[i].id);
                panelModel.col = colValue;
                panelModel.row = updatedRow;
                this.updatePanel(collisionModels, colValue, updatedRow, this.overlapElementClone[i]);
            }

        }
    }


    protected updatePanel(collisionModels: HTMLElement[], colValue: number, updatedRow: number, clone: HTMLElement): void {
        let panelModel: PanelModel = this.getCellInstance(clone.id);
        panelModel.col = colValue;
        panelModel.row = updatedRow;
        if (collisionModels.length > 0) {
            let proxy: DashboardLayout = this;
            this.overlapElement = [];
            this.shouldRestrict = true;
            collisionModels.forEach((item1: HTMLElement) => {
                proxy.overlapElement.push(item1);
            });
            let overlapElementRow1: number = parseInt(clone.getAttribute('data-row'), 10);
            for (let m: number = 0; m < this.overlapElement.length; m++) {
                this.updateRowColumn(overlapElementRow1, this.overlapElement, clone);
            }
            this.shouldRestrict = false;
        } else {
            if (!this.addPanelCalled) {
                this.sortedPanel();
            }
            if (this.overlapSubElementClone.length > 0) {
                for (let p: number = 0; p < this.overlapSubElementClone.length; p++) {
                    let rowVal: number = parseInt(this.overlapSubElementClone[p].getAttribute('data-row'), 10);
                    let colValue: number = parseInt(this.overlapSubElementClone[p].getAttribute('data-col'), 10);
                    let sizeX: number = parseInt(this.overlapSubElementClone[p].getAttribute('data-sizeX'), 10);
                    let sizeY: number = parseInt(this.overlapSubElementClone[p].getAttribute('data-sizeY'), 10);
                    let collisionModels1: HTMLElement[];
                    collisionModels1 = this.collisionItems(rowVal, colValue, sizeX, sizeY, this.overlapSubElementClone);
                    if (this.mainElement && collisionModels1.indexOf(this.mainElement) !== -1) {
                        collisionModels1.splice(collisionModels1.indexOf(this.mainElement), 1);
                    }
                    let proxy: DashboardLayout = this;
                    collisionModels1.forEach((item1: HTMLElement) => {
                        proxy.overlapElement.push(item1);
                    });
                    if (collisionModels1.length > 0) {
                        this.updateRowColumn(rowVal, this.overlapElement, this.overlapSubElementClone[p]);
                    }
                }
            }
            this.overlapSubElementClone = [];
        }
    }

    protected removeResizeClasses(panelElements: HTMLElement[]): void {
        for (let i: number = 0; i < panelElements.length; i++) {
            let element: HTMLElement = panelElements[i];
            let resizerElements: NodeList = element.querySelectorAll('.e-resize');
            for (let i: number = 0; i < resizerElements.length; i++) {
                detach(resizerElements[i]);
            }
        }
    }

    protected setClasses(panelCollection: HTMLElement[]): void {
        for (let i: number = 0; i < panelCollection.length; i++) {
            let element: HTMLElement = panelCollection[i];
            let containerEle: HTMLElement = panelCollection[i].querySelector('.e-panel-container');
            if (this.allowDragging) {
                if (this.draggableHandle && element.querySelectorAll(this.draggableHandle)[0]) {
                    addClass([element.querySelectorAll(this.draggableHandle)[0]], [draggable]);
                }
            }
            if (this.allowResizing &&
                this.mediaQuery ? !window.matchMedia('(' + this.mediaQuery + ')').matches : false) {
                this.setResizingClass(element, containerEle);
            }
        }

    }
    protected setResizingClass(ele: HTMLElement, container: HTMLElement): void {
        this.availableClasses = this.resizableHandles || [southEast];
        for (let j: number = 0; j < this.availableClasses.length; j++) {
            let spanEle: HTMLElement = this.createElement('span');
            let addClassValue: string;
            container.appendChild(spanEle);
            addClassValue = double;
            addClass([spanEle], [addClassValue, this.availableClasses[j], resize]);
        }
    }
    protected setXYAttributes(element: HTMLElement, panelModel: PanelModel): void {
        element.setAttribute('data-sizex', panelModel.sizeX.toString());
        element.setAttribute('data-sizey', panelModel.sizeY.toString());
        if (!isNullOrUndefined(panelModel.row)) {
            element.setAttribute('data-row', panelModel.row.toString());
        }
        if (!isNullOrUndefined(panelModel.col)) {
            element.setAttribute('data-col', panelModel.col.toString());
        }
        if (!isNullOrUndefined(panelModel.minSizeX)) {
            element.setAttribute('data-minSizeX', panelModel.minSizeX.toString());
        }
        if (!isNullOrUndefined(panelModel.minSizeY)) {
            element.setAttribute('data-minSizeY', panelModel.minSizeY.toString());
        }
        if (!isNullOrUndefined(panelModel.maxSizeX)) {
            element.setAttribute('data-maxSizeX', panelModel.maxSizeX.toString());
        }
        if (!isNullOrUndefined(panelModel.maxSizeY)) {
            element.setAttribute('data-maxSizeY', panelModel.maxSizeY.toString());
        }

    }

    protected setXYDimensions(panelModel: PanelModel): (string | number)[] {
        let cellHeight: number | string = this.getCellSize()[1];
        let cellWidth: number | string = this.getCellSize()[0];
        let widthValue: number | string; let heigthValue: number | string;
        if (panelModel && typeof (cellWidth) === 'number' && typeof (panelModel.sizeX) === 'number' && panelModel.sizeX > 1) {
            widthValue = (panelModel.sizeX * cellWidth) + (panelModel.sizeX - 1) * this.cellSpacing[0];
        } else {
            widthValue = cellWidth;
        }
        if (panelModel && typeof (cellHeight) === 'number' && panelModel.sizeY > 1 && typeof (panelModel.sizeY) === 'number') {
            heigthValue = (panelModel.sizeY * cellHeight) + (panelModel.sizeY - 1) * this.cellSpacing[1];
        } else {
            heigthValue = formatUnit(cellHeight);
        }
        return [heigthValue, widthValue];
    }


    protected getRowColumnDragValues(args: DragEventArgs): number[] {
        let value: number[] = [];
        let elementTop: number = parseInt(args.element.style.top, 10);
        let elementLeft: number = parseInt(args.element.style.left, 10);
        let row: number = Math.round(elementTop / (this.getCellSize()[1] + this.cellSpacing[1]));
        let col: number = Math.round(elementLeft / (this.getCellSize()[0] + + this.cellSpacing[0]));
        value = [row, col];
        return value;
    }
    protected enableDraggingContent(collections: HTMLElement[]): void {
        for (let i: number = 0; i < collections.length; i++) {
            let cellElement: HTMLElement = collections[i];
            {
                this.dragobj = new Draggable(cellElement, {
                    clone: false,
                    dragArea: this.element,
                    handle: this.draggableHandle ? this.draggableHandle : '.e-panel',
                    abort: '.e-resize',
                    dragStart: this.onDraggingStart.bind(this),
                    dragStop: (args: DragEventArgs) => {
                        let model: PanelModel = this.getCellInstance(this.mainElement.id);
                        if (this.allowPushing &&
                            this.collisionItems(model.row, model.col, model.sizeX, model.sizeY, this.mainElement).length > 0) {
                            this.setHolderPosition(args);
                            this.setPanelPosition(this.mainElement, model.row, model.col);
                            this.updatePanelLayout(this.mainElement, model);
                        } else {
                            this.setPanelPosition(this.mainElement, model.row, model.col);
                        }
                        let changedPanels: PanelModel[] = [];
                        this.mainElement = null;
                        let item: PanelModel = this.getPanelBase(args);
                        if (this.shadowEle) {
                            detach(this.shadowEle);
                        }
                        removeClass([this.element], [preventSelect]);
                        removeClass([args.element], [dragging]);
                        this.shadowEle = null;
                        args.element.classList.remove('e-dragging');
                        let row: number = this.getRowColumnDragValues(args)[0];
                        let col: number = this.getRowColumnDragValues(args)[1];
                        let panelModel: PanelModel = this.getCellInstance(args.element.id);
                        if (this.allowPushing &&
                            this.getItems(row, col, panelModel.sizeX, panelModel.sizeY, document.getElementById(item.id)).length === 0) {
                            this.oldRowCol[args.element.id].row = this.getCellInstance(args.element.id).row = row;
                            this.oldRowCol[args.element.id].col = this.getCellInstance(args.element.id).col = col;
                            args.element.setAttribute('data-col', col.toString());
                            args.element.setAttribute('data-row', row.toString());
                            this.sortedPanel();
                        } else {
                            this.getCellInstance(args.element.id).row = this.oldRowCol[args.element.id].row;
                            this.getCellInstance(args.element.id).col = this.oldRowCol[args.element.id].col;
                            args.element.setAttribute('data-col', this.getCellInstance(args.element.id).col.toString());
                            args.element.setAttribute('data-row', this.getCellInstance(args.element.id).row.toString());
                            this.sortedPanel();
                        }
                        let panelInstance: PanelModel = this.getCellInstance(args.element.id);
                        this.setPanelPosition(args.element, panelInstance.row, panelInstance.col);
                        this.moveItemsUpwards();
                        this.updateOldRowColumn();
                        this.sortedPanel();
                        this.cloneArray = this.sortedArray;
                        this.cloneObject = JSON.parse(JSON.stringify(this.oldRowCol));
                        for (let i: number = 0; i < this.panels.length; i++) {
                            if (this.panels[i].row !== this.panelsInitialModel[i].row ||
                                this.panels[i].col !== this.panelsInitialModel[i].col) {
                                changedPanels.push(this.panels[i]);
                            }
                        }
                        if (changedPanels.length > 0) {
                            this.trigger('change', changedPanels);
                        }
                        this.trigger('dragStop', args);
                        this.resizeEvents();
                    },
                    drag: (args: DragEventArgs) => {
                        this.trigger('drag', args);
                        this.onDragStart(args);
                    }
                });
                if (this.dragCollection.indexOf(this.dragobj) === -1) {
                    this.dragCollection.push(this.dragobj);
                }
            }
        }
    };

    private onDraggingStart(args: DragEventArgs): void {
        this.panelsInitialModel = this.cloneModels(this.panels);
        this.mainElement = args.element;
        this.cloneObject = JSON.parse(JSON.stringify(this.cloneObject));
        let eleRowValue: number = this.startRow = parseInt(args.element.getAttribute('data-row'), 10);
        this.startCol = parseInt(args.element.getAttribute('data-col'), 10);
        let eleSizeY: number = parseInt(args.element.getAttribute('data-sizeY'), 10);
        if (eleRowValue + eleSizeY === this.rows) {
            this.rows = this.rows + eleSizeY;
            this.setHeightWidth();
            // tslint:disable-next-line
            (<any>this.dragobj).setDragArea();
        }
        this.shadowEle = document.createElement('div');
        this.shadowEle.classList.add('e-holder');
        this.shadowEle.classList.add('e-holder-transition');
        setStyle(this.shadowEle, { 'position': 'absolute' });
        addClass([this.element], [preventSelect]);
        addClass([args.element], [dragging]);
        this.element.appendChild(this.shadowEle);
        let sizeY: number = parseInt(args.element.getAttribute('data-sizeY'), 10);
        let sizeX: number = parseInt(args.element.getAttribute('data-sizeX'), 10);
        if (args.element.offsetWidth !== this.setXYDimensions(this.getCellInstance(args.element.id))[1]) {
            this.cellSize[0] = parseInt(args.element.style.width, 10) / sizeX;
            this.cellSize[1] = parseInt(args.element.style.height, 10) / sizeY;
        }
        this.shadowEle = document.querySelector('.e-holder');
        this.shadowEle.style.height = (this.getCellInstance(args.element.id).sizeY * <number>this.cellSize[1]) + 'px';
        this.shadowEle.style.width = (this.getCellInstance(args.element.id).sizeX * <number>this.cellSize[0]) + 'px';
        let panelInstance: PanelModel = this.getCellInstance(args.element.id);
        this.setPanelPosition(this.shadowEle, panelInstance.row, panelInstance.col);
    };
    // tslint:disable-next-line
    private cloneModels(source?: any, target?: any): PanelModel[] {
        if (target === undefined) {
            target = [];
        }
        for (let i: number = 0; i < source.length; i++) {
            // tslint:disable-next-line
            if (!target[i]) {
                target[i] = {};
            }
            // tslint:disable-next-line
            for (let k in source[i]) {
                target[i][k] = source[i][k];
            }
        }
        return target;
    };

    private onDragStart(args: DragEventArgs): void {
        let endCol: number;
        let endRow: number;
        let dragCol: number;
        let col: number = dragCol = this.getRowColumnDragValues(args)[1];
        let row: number = this.getRowColumnDragValues(args)[0];
        this.getCellInstance(args.element.id).row = row;
        this.getCellInstance(args.element.id).col = col;
        let panelModel: PanelModel = this.getCellInstance(args.element.id);
        let itemsInTheWay: HTMLElement[];
        itemsInTheWay = this.getItems(row, col, panelModel.sizeX, panelModel.sizeY, args.element);
        let hasItemsInTheWay: boolean = itemsInTheWay.length !== 0;
        if (this.allowPushing) {
            args.element.setAttribute('data-col', col.toString());
            args.element.setAttribute('data-row', row.toString());
            this.getCellInstance(args.element.id).row = row;
            this.getCellInstance(args.element.id).col = col;
            endCol = this.oldRowCol[(args.element.id)].col;
            endRow = this.oldRowCol[(args.element.id)].row;
            this.oldRowCol[(args.element.id)] = { row: row, col: col };
            this.updateOldRowColumn();
            if (this.startCol !== endCol || this.startRow !== endRow) {
                this.setHolderPosition(args);
                if (this.startCol !== endCol) {
                    this.startRow = endRow;
                }
                if (this.startRow !== endRow) {
                    this.startCol = endCol;
                }
                if (this.allowPushing) {
                    this.mainElement = args.element;
                    let model: PanelModel = panelModel;
                    this.checkCollision = this.collisionItems(model.row, model.col, model.sizeX, model.sizeY, args.element);
                    if (panelModel.col >= this.checkColumnValue) {
                        this.checkCollision = [];
                    }
                    this.updatePanelLayout(args.element, panelModel);
                    this.moveItemsUpwards();
                }
            }
        }

        if (this.allowPushing !== false) {
            this.getCellInstance(args.element.id).row = row;
            this.getCellInstance(args.element.id).col = col;
        }
        if (this.oldRowCol[args.element.id].row !== row || this.oldRowCol[args.element.id].col !== col) {
            this.getCellInstance(args.element.id).row = row;
            this.getCellInstance(args.element.id).col = col;
            args.element.setAttribute('data-col', col.toString());
            args.element.setAttribute('data-row', row.toString());
        }

        if (this.startCol !== dragCol) {
            this.startCol = endCol;
            this.moveItemsUpwards();
        }

        if (!this.allowPushing) {
            this.setHolderPosition(args);
        }
        this.removeResizeClasses(this.panelCollection);
        this.setClasses(this.panelCollection);
        if (this.allowPushing === false) {
            return;
        }
    }

    protected getPanelBase(args: HTMLElement | DragEventArgs | String): HTMLElement {
        let item: HTMLElement;
        for (let i: number = 0; i < this.panelCollection.length; i++) {
            if (this.panelCollection[i].id === (((<DragEventArgs>args).element
                && (<DragEventArgs>args).element.id) || <string>args)) {
                item = this.panelCollection[i];
            }
        }
        return item;
    }

    protected getItems(row: number, column: number, sizeX: number, sizeY: number, elements: HTMLElement[] | HTMLElement): HTMLElement[] {
        let items: HTMLElement[] = [];
        if (!sizeX || !sizeY) {
            sizeX = sizeY = 1;
        }
        if (elements && !(elements instanceof Array)) {
            elements = [elements];
        }
        let item: PanelModel;
        for (let h: number = 0; h < sizeY; ++h) {
            for (let w: number = 0; w < sizeX; ++w) {
                item = this.getPanel(row + h, column + w, elements);
                if (item && (!elements || (<HTMLElement[]>elements).indexOf(document.getElementById(item.id)) === -1) &&
                    items.indexOf(document.getElementById(item.id)) === -1) {
                    items.push(document.getElementById(item.id));
                }
            }
        }
        return items;
    };

    protected getPanel(row: number, column: number, excludeItems: HTMLElement[] | HTMLElement): PanelModel {
        if (excludeItems && !(excludeItems instanceof Array)) {
            excludeItems = [excludeItems];
        }
        let sizeY: number = 1;
        while (row > -1) {
            let sizeX: number = 1;
            let col: number = column;
            while (col > -1) {
                let items: HTMLElement[] = this.sortedArray[row];
                if (items) {
                    let item: HTMLElement = items[col];
                    if (item && (!excludeItems ||
                        (<HTMLElement[]>excludeItems).indexOf(item) === -1) && parseInt(item.getAttribute('data-sizeX'), 10) >= sizeX
                        && parseInt(item.getAttribute('data-sizeY'), 10) >= sizeY) {
                        return item;
                    }
                }
                ++sizeX;
                --col;
            }
            --row;
            ++sizeY;
        }
        return null;
    };


    protected setHolderPosition(args: DragEventArgs): void {
        let cellSizeOne: number;
        let cellSizeZero: number;
        let sizeY: number = parseInt(args.element.getAttribute('data-sizeY'), 10);
        let col: number = parseInt(args.element.getAttribute('data-col'), 10);
        let row: number = parseInt(args.element.getAttribute('data-row'), 10);
        let sizeX: number = parseInt(args.element.getAttribute('data-sizeX'), 10);
        if (args.element.offsetWidth !== this.setXYDimensions(this.getCellInstance(args.element.id))[1]) {
            this.cellSize[1] = parseInt(args.element.style.height, 10) / sizeY;
            this.cellSize[0] = parseInt(args.element.style.width, 10) / sizeX;
        }
        let widthValue: number = this.getCellSize()[0];
        let heightValue: number = this.getCellSize()[1];
        let top: number = row === 0 ? 0 : (((row) * (parseInt(heightValue.toString(), 10) + this.cellSpacing[1])));
        let left: number = col === 0 ? 0 : (((col) * (parseInt(widthValue.toString(), 10) + this.cellSpacing[0])));
        cellSizeOne = this.getCellSize()[1];
        cellSizeZero = this.getCellSize()[0];
        this.elementRef.top = this.shadowEle.style.top = top + 'px';
        this.elementRef.left = this.shadowEle.style.left = left + 'px';
        this.elementRef.height = this.shadowEle.style.height = ((sizeY * cellSizeOne) + ((sizeY - 1) * this.cellSpacing[1])) + 'px';
        this.elementRef.width = this.shadowEle.style.width = ((sizeX * cellSizeZero) + ((sizeX - 1) * this.cellSpacing[0])) + 'px';
    };

    protected getCellInstance(idValue: string): PanelModel {
        let currentCellInstance: PanelModel;
        for (let i: number = 0; i < this.panels.length; i++) {
            if (this.panels[i].id === idValue) {
                currentCellInstance = this.panels[i];
            }
        }
        return currentCellInstance;
    }

    /**
     * Allows to add a panel to the Dashboardlayout.
     */
    public addPanel(panel: PanelModel): void {
        this.panels.push(panel);
        if (!panel.minSizeX) {
            panel.minSizeX = 1;
        }
        if (!panel.minSizeY) {
            panel.minSizeY = 1;
        }
        if (!panel.id) {
            panel.id = 'layout_' + this.panelID.toString();
            this.panelID = this.panelID + 1;
        }
        let cell: HTMLElement = this.renderCell(panel); this.oldRowCol[panel.id] = { row: panel.row, col: panel.col };
        this.cloneObject[panel.id] = { row: panel.row, col: panel.col };
        this.updateOldRowColumn();
        this.setMinMaxValues(panel);
        this.element.appendChild(cell);
        let container: HTMLElement = cell.querySelector('.e-panel-container');
        if (this.mediaQuery && window.matchMedia('(' + this.mediaQuery + ')').matches) {
            this.checkMediaQuerySizing();
        } else {
            this.addPanelCalled = true;
            this.mainElement = cell;
            if (!this.checkCollision) {
                this.checkCollision = [];
            }
            this.setPanelPosition(cell, panel.row, panel.col);
            this.updatePanelLayout(cell, panel);
            this.addPanelCalled = false;
        }
        if (this.allowResizing) {
            this.setResizingClass(cell, container);
        }
        if (this.allowDragging) {
            let subCollection: HTMLElement[] = [];
            this.panelCollection.forEach((item: HTMLElement) => {
                if (item.id === panel.id) {
                    subCollection.push(item);
                }
            });
            this.enableDraggingContent(subCollection);
        }
        if (this.allowFloating) {
            this.moveItemsUpwards();
        }
        this.updateOldRowColumn();
        this.sortedPanel();
        this.cloneArray = this.sortedArray;
        this.cloneObject = JSON.parse(JSON.stringify(this.oldRowCol));
        this.bindEvents();
    }

    /**
     * Returns the panels object of the DashboardLayout.
     */
    public serialize(): PanelModel[] {
        let cloneModel: PanelModel[] = this.cloneModels(this.panels);
        let customObject: {
            id: string, row: number, col: number, sizeX: number,
            sizeY: number, minSizeX: number, minSizeY: number, maxSizeX: number,
            maxSizeY: number
        }[] = [];
        for (let i: number = 0; i < cloneModel.length; i++) {
            customObject.push({
                id: cloneModel[i].id, row: cloneModel[i].row, col: cloneModel[i].col, sizeX: cloneModel[i].sizeX,
                sizeY: cloneModel[i].sizeY, minSizeX: cloneModel[i].minSizeX, minSizeY: cloneModel[i].minSizeY,
                maxSizeX: cloneModel[i].maxSizeX, maxSizeY: cloneModel[i].maxSizeY
            });
        }
        return (customObject);
    }

    /**
     * Removes all the panels from the DashboardLayout.
     */

    public removeAll(): void {
        for (let i: number = 0; i < this.panelCollection.length; i++) {
            detach(this.panelCollection[i]);
        }
        this.element.innerHTML = '';
        this.rows = 0;
        this.gridPanelCollection = [];
        this.setHeightWidth();
        this.sortedPanel();
        this.sortedArray = [];
        this.overlapElementClone = [];
        this.overlapElement = [];
        this.overlapSubElementClone = [];
        this.panelCollection = [];
        this.oldRowCol = {};
        this.cloneObject = {};
        this.panels = [];
    }

    /**
     * Removes the panel from the DashboardLayout.
     */


    public removePanel(id: string): void {
        for (let i: number = 0; i < this.panelCollection.length; i++) {
            if (this.panelCollection[i].id === id) {
                detach(this.panelCollection[i]);
                this.panelCollection.splice(i, 1);
            }
            if (this.panels[i].id === id) {
                this.panels.splice(i, 1);
                this.updateOldRowColumn();
                this.sortedPanel();
            }
        }
        this.moveItemsUpwards();
        this.updateOldRowColumn();
        this.sortedPanel();
        this.gridPanelCollection.forEach((item: HTMLElement) => {
            if (item.id === id) {
                this.gridPanelCollection.splice(this.gridPanelCollection.indexOf(item), 1);
            }
        });

    }

    constructor(options?: DashboardLayoutModel, element?: string | HTMLInputElement) {
        super(options, element);
    }

    /**
     * Moves the panel in the DashboardLayout.
     */

    public movePanel(id: string, row: number, col: number): void {
        this.movePanelCalled = true;
        let panelInstance: PanelModel = this.getCellInstance(id);
        panelInstance.row = row;
        panelInstance.col = col;
        if (col < 1) {
            col = 0;
        } else if (col > this.columns) {
            col = this.columns;
        }
        let ele: HTMLElement = document.getElementById(id);
        this.mainElement = ele;
        ele.setAttribute('data-col', col.toString());
        ele.setAttribute('data-row', row.toString());
        this.setPanelPosition(ele, row, col);
        this.updatePanelLayout(ele, panelInstance);
        this.getRowColumn();
        this.setHeightWidth();
        this.moveItemsUpwards();
        this.updateOldRowColumn();
        this.sortedPanel();
        this.cloneArray = this.sortedArray;
        this.cloneObject = JSON.parse(JSON.stringify(this.oldRowCol));
        this.movePanelCalled = false;
    }

   /**
    * Resize the panel in the DashboardLayout.
    */

    public resizePanel(id: string, sizeX: number, sizeY: number): void {
        let panelInstance: PanelModel = this.getCellInstance(id);
        this.resizeCalled = true;
        panelInstance.sizeX = sizeX;
        panelInstance.sizeY = sizeY;
        this.setMinMaxValues(panelInstance);
        let ele: HTMLElement = document.getElementById(id);
        ele.setAttribute('data-sizeX', panelInstance.sizeX.toString());
        ele.setAttribute('data-sizeY', panelInstance.sizeY.toString());
        this.setHeightAndWidth(ele, panelInstance);
        this.updatePanelLayout(ele, panelInstance);
        this.updateOldRowColumn();
        this.moveItemsUpwards();
        this.sortedPanel();
        this.getRowColumn();
        this.setHeightWidth();
        this.resizeCalled = false;
    }

    /**
     * Destroys the DashboardLayout component
     */
    public destroy(): void {
        removeClass([this.element], [ROOT]);
        this.element.removeAttribute('style');
        for (let i: number = 0; i < this.dragCollection.length; i++) {
            this.dragCollection[i].destroy();
        }
        for (let i: number = 0; i < this.panelCollection.length; i++) {
            let ele: HTMLElement = this.panelCollection[i];
        }
        this.element.innerHTML = '';
    }


    protected setEnableRtl(): void {
        this.enableRtl ? addClass([this.element], 'e-rtl') : removeClass([this.element], 'e-rtl');
    }
    protected getDragInstance(id: string): Draggable {
        let draggableInstance: Draggable;
        let ele: HTMLElement = document.getElementById(id);
        for (let i: number = 0; i < this.dragCollection.length; i++) {
            draggableInstance = this.dragCollection[i].element === ele ? this.dragCollection[i] : null;
            if (draggableInstance) {
                return draggableInstance;
            }
        }
        return draggableInstance;
    }

    /**
     * Called internally if any of the property value changed.
     * returns void
     * @private
     */
    private updateCellSizeAndSpacing(): void {
        this.panelResponsiveUpdate();
        this.setHeightWidth();
        this.getRowColumn();
        for (let i: number = 0; i < this.element.querySelectorAll('.e-panel').length; i++) {
            let ele: HTMLElement = <HTMLElement>this.element.querySelectorAll('.e-panel')[i];
            let panelModel: PanelModel = this.getCellInstance(ele.id);
            this.setHeightAndWidth(ele, panelModel);
            this.setPanelPosition(ele, panelModel.row, panelModel.col);
        }
    }

    /**
     * Called internally if any of the property value changed.
     * returns void
     * @private
     */

    public onPropertyChanged(newProp: DashboardLayoutModel, oldProp: DashboardLayoutModel): void {
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'enableRtl':
                    this.setProperties({ enableRtl: newProp.enableRtl }, true);
                    this.setEnableRtl();
                    break;
                case 'mediaQuery':
                    this.setProperties({ mediaQuery: newProp.mediaQuery }, true);
                    if (this.mediaQuery && window.matchMedia('(' + this.mediaQuery + ')').matches) {
                        this.checkMediaQuerySizing();
                    }
                    break;
                case 'allowDragging':
                    this.setProperties({ allowDragging: newProp.allowDragging }, true);
                    this.checkDragging(this.dragCollection);
                    break;
                case 'allowResizing':
                    this.setProperties({ allowResizing: newProp.allowResizing }, true);
                    if (this.allowResizing) {
                        this.setClasses(this.panelCollection);
                        this.resizeEvents();
                    } else {
                        for (let i: number = 0; i < document.querySelectorAll('.e-resize').length; i++) {
                            let element: HTMLElement = <HTMLElement>document.querySelectorAll('.e-resize')[i];
                            EventHandler.remove(element, 'mousedown', this.downResizeHandler);
                            EventHandler.remove(document, 'mouseup', this.upResizeHandler);
                        }
                        this.removeResizeClasses(this.panelCollection);
                    }
                    break;
                case 'cellSpacing':
                    this.setProperties({ cellSpacing: newProp.cellSpacing }, true);
                    this.updateCellSizeAndSpacing();
                    break;
                case 'draggableHandle':
                    this.setProperties({ draggableHandle: newProp.draggableHandle }, true);
                    for (let i: number = 0; i < this.element.querySelectorAll('.e-panel').length; i++) {
                        let ele: HTMLElement = <HTMLElement>this.element.querySelectorAll('.e-panel')[i];
                        let draggableInstance: Draggable = this.getDragInstance(ele.id);
                        draggableInstance.handle = this.draggableHandle;
                    }
                    break;
                case 'allowFloating':
                    this.setProperties({ allowFloating: newProp.allowFloating }, true);
                    this.moveItemsUpwards();
                    break;
                case 'allowPushing':
                    this.setProperties({ allowPushing: newProp.allowPushing }, true);
                    break;
            }
        }
    }
    /**
     * Gets the properties to be maintained upon browser refresh.
     * @returns string
     */

    public getPersistData(): string {
        let keyEntity: string[] = ['panels'];
        return this.addOnPersist(keyEntity);
    }

    /**
     * Returns the current module name.
     * @returns string
     * @private
     */
    protected getModuleName(): string {
        return 'DashboardLayout';
    }

}

/**
 * Defines the dragstart event arguments
 */
export interface DragStartArgs {

    /**
     * Specifies the original event.
     */
    event: MouseEvent | TouchEvent;

    /**
     * Illustrates whether the current action needs to be prevented or not.
     */

    cancel: boolean;

    /**
     * Specifies the cell element being dragged.
     */

    element: HTMLElement;

}

/**
 * Defines the Drag event arguments
 */

export interface DraggedEventArgs {

    /**
     * Specifies the original event.
     */
    event: MouseEvent | TouchEvent;

    /**
     * Specifies the cell element being dragged.
     */

    element: HTMLElement;

    /**
     * Specifies the element below the cell element being dragged.
     */

    target: HTMLElement;

}

/**
 * Defines the dragstop event arguments
 */
export interface DragStopArgs {

    /**
     * Specifies the original event.
     */
    event: MouseEvent | TouchEvent;

    /**
     * Specifies the cell element being dragged.
     */

    element: HTMLElement;

}


/**
 * Defines the resize event arguments
 */
export interface ResizeArgs {

    /**
     * Specifies the original event.
     */
    event: MouseEvent;

    /**
     * Specifies the cell element being resized.
     */

    element: HTMLElement;



}

/**
 * Defines the holder position.
 */
interface ElementRefArgs {
    top: string;
    left: string;
    height: string;
    width: string;
}

