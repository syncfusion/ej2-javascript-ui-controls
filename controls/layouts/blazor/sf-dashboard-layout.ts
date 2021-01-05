import { BlazorDotnetObject, EventHandler, Browser, detach, removeClass } from '@syncfusion/ej2-base';
import { BlazorDragEventArgs, Draggable, isNullOrUndefined, DragEventArgs, closest } from '@syncfusion/ej2-base';
import { setStyleAttribute as setStyle, addClass } from '@syncfusion/ej2-base';

const DRAGRESTRICT: string = 'e-drag-restrict';
const PREVENTSELECT: string = 'e-prevent';
const DRAGGING: string = 'e-dragging';
const DRAGGABLE: string = 'e-draggable';
const RESPONSIVE: string = 'e-responsive';
const EAST: string = 'e-east';
const WEST: string = 'e-west';
const NORTH: string = 'e-north';
const SOUTH: string = 'e-south';
const NORTHEAST: string = 'e-north-east';
const SOUTHEAST: string = 'e-south-east';
const NORTHWEST: string = 'e-north-west';
const SOUTHWEST: string = 'e-south-west';

class SfDashboardLayout {
    private element: BlazorDashboardElement;
    private windowWidth: string | number;
    private dotnetRef: BlazorDotnetObject;
    private cellSize: number[];
    private cellSizeValue: number[];
    private cellAspectRatio: number = 1;
    private mediaQuery: string;
    private isMediaQuery: boolean;
    private dragCollection: Draggable[];
    private dragobj: Draggable;
    private draggableHandle: string;
    private isMouseUpBound: boolean;
    private isMouseMoveBound: boolean;
    private direction: number;
    private directionRow: number;
    private lastMouseX: number;
    private lastMouseY: number;
    private elementX: number;
    private elementY: number;
    private elementWidth: number;
    private elementHeight: number;
    private previousRow: number;
    private originalWidth: number;
    private originalHeight: number;
    private handleClass: string;
    private mOffX: number = 0;
    private mOffY: number = 0;
    private maxTop: number = 9999;
    private maxRows: number = 100;
    private mouseX: number = 0;
    private mouseY: number = 0;
    private minTop: number = 0;
    private minLeft: number = 0;
    private maxLeft: number;
    private allowPushing: boolean  = true;
    private allowResizing: boolean = false;
    private shadowEle: HTMLElement;
    private panelElements: HTMLElement[] = [];
    private renderedElement: HTMLElement[] = [];
    private allowDragging: boolean = false;
    private draggedEventArgs: DraggedEventArgs;
    private panels: PanelModel[];
    private isRenderComplete: boolean = false;
    private mainElement: HTMLElement;
    private allowFloating: boolean = false;
    private sortedArray: HTMLElement[][];
    private overlapElement: HTMLElement[] = [];
    private spacedColumnValue: number;
    private spacedRowValue: number;
    private checkingElement: HTMLElement;
    private leftAdjustable: boolean;
    private rightAdjustable: boolean;
    private topAdjustable: boolean;
    private panelsSizeY: number = 0;
    private columns: number;
    private startRow: number;
    private shouldRestrict: boolean = false;
    private overlapElementClone: HTMLElement[] = [];
    private overlapSubElementClone: HTMLElement[];
    private isSubValue: boolean;
    private addPanelCalled: boolean = false;
    private allItems: HTMLElement[];
    private rows: number = 0;
    private cellSpacing: number[]= [];
    private panelsInitialModel: PanelModel[];
    private checkCollision: HTMLElement[];
    private startCol: number;
    private maxColumnValue: number;
    private checkColumnValue: number;
    private dragStopEventArgs: DragStopArgs;
    private cloneArray: HTMLElement[][];
    private resizeCalled: boolean = false;
    private movePanelCalled: boolean = false;
    private isResizing: boolean = false;
    private resizeTimeCount: number = 0;
    private downTarget: HTMLElement;
    private moveTarget: HTMLElement;
    private upTarget: HTMLElement;
    private removeAllCalled: boolean;
    private isChanged : boolean = false;
    private changedId : string []= [];
    private options: IDashboard;
    private collisionChecker: {
        [key: string]: {
            ele: HTMLElement,
            row: number,
            srcEle: HTMLElement
        };
    };
    protected cloneObject: {
        [key: string]: {
            row: number,
            col: number
        };
    };
    protected oldRowCol: {
        [key: string]: {
            row: number,
            col: number
        };
    };

    constructor(element: BlazorDashboardElement, dotnetRef: BlazorDotnetObject) {
        this.element = element;
        this.element.blazor__instance = this;
        this.dotnetRef = dotnetRef;
    }

    private preRender(property : IDashboard): void {
        this.dragCollection = [];
        this.renderedElement = [];
        this.overlapSubElementClone = [];
        this.panels = [];
        this.sortedArray = [];
        this.allItems = [];
        this.oldRowCol = {};
        this.cellSpacing = [];
        this.checkCollision = [];
        this.cloneObject = {};
        this.maxColumnValue = this.columns;
        if (property) {
            this.getProperty(property);
        }
        this.isMediaQuery = this.checkMediaQuery();
        this.dotnetRef.invokeMethodAsync('CalculateSize', this.calculateCellSize(), this.isMediaQuery, false);
        this.calculateCellSizeValue();
    }

    public initialize(property : IDashboard): void {
        this.preRender(property);
        if (isNullOrUndefined(this.panels)) { this.panels = []; }
        for (let i: number = 0; i < this.element.querySelectorAll('.e-panel').length; i++) {
            this.panelElements.push(<HTMLElement>(this.element.querySelectorAll('.e-panel')[i]));
        }
        this.panelsInitialModel = this.cloneModels(this.panels);
        this.renderDashBoardCells(this.panels);
        if (this.allowDragging && (this.mediaQuery ? !window.matchMedia('(' + this.mediaQuery + ')').matches : true)) {
            this.enableDraggingContent(this.panelElements);
        }
        this.checkColumnValue = this.maxColumnValue;
        this.isRenderComplete = true;
        this.bindEvents();
    }

    public calculateCellSize():  number[] {
        this.cellSizeValue = [];
        this.cellSizeValue[0] = this.element.parentElement && ((this.element.parentElement.offsetWidth));
        return this.cellSizeValue;
    }

    protected checkMediaQuery(): boolean {
        return (this.mediaQuery && window.matchMedia('(' + this.mediaQuery + ')').matches);
    }

    private getProperty(property : IDashboard): void {
        this.mediaQuery = property.MediaQuery;
        this.allowDragging = property.AllowDragging;
        this.columns = property.Columns;
        this.allowFloating = property.AllowFloating;
        this.rows = property.MaxRowValue;
        this.cellSpacing = property.CellSpacing;
        this.cellAspectRatio = property.CellAspectRatio;
        this.allowResizing = property.AllowResizing;
        this.panels = property.Panels;
        this.draggableHandle = property.DraggableHandle;
    }

    public movePanel(id: string, row: number, col: number): void {
        this.movePanelCalled = true;
        this.panelsInitialModel = this.cloneModels(this.panels);
        let panelInstance: PanelModel = this.getCellInstance(id);
        let movedElement: HTMLElement = document.getElementById(id);
        let datamodel: PanelModel = this.getCellInstance(movedElement.id);
        this.mainElement = movedElement;
        this.startRow = datamodel.row;
        this.startCol = datamodel.col;
        this.updatePanelPosition(datamodel.id, col, row);
        this.updateOldRowColumn();
        this.updatePanelLayout(movedElement, panelInstance);
        this.updatePanels();
        this.updateCloneArrayObject();
        this.mainElement = null;
        if (this.allowFloating) {
            this.moveItemsUpwards();
        }
        this.movePanelCalled = false;
        this.dotnetRef.invokeMethodAsync('UpdatedPanelsValues', this.panels);
    }

    public removePanel(id: string): void {
        this.panelsSizeY = 0;
        for (let i: number = this.renderedElement.length - 1; i >= 0; i--) {
            if (this.renderedElement[i].id === id) { this.renderedElement.splice(i, 1); break; }
        }
        for (let i: number = 0; i < this.panelElements.length; i++) {
            if (this.panelElements[i].id === id) { this.panelElements.splice(i, 1); }
            if (this.panels[i].id === id) {
                this.panels.splice(i, 1);
                this.updateOldRowColumn();
                this.sortedPanel();
            }
        }
        this.updatePanels();
        this.updateCloneArrayObject();
        this.panelsInitialModel = this.cloneModels(this.panels);
    }

    public renderDashBoardCells(cells: PanelModel[]): void {
        if (this.element.querySelectorAll('.e-panel').length > 0 || this.panels.length > 0) {
            this.updateOldRowColumn();
            for (let i: number = 0; i < this.panels.length; i++) {
                if (this.columns < this.panels[i].col || this.columns < this.panels[i].col + this.panels[i].sizeX) {
                    let colValue: number = this.columns - this.panels[i].sizeX;
                    this.updatePanelPosition(this.panels[i].id, colValue < 0 ? 0 : colValue, this.panels[i].row);
                }
                this.renderedElement.push(this.panelElements[i]);
                let cell: HTMLElement = this.renderCell(cells[i]);
                this.updatePanelLayout(cell, this.panels[i]);
            }
            this.updatePanels();
            this.updateCloneArrayObject();
            let clonedPanels : PanelModel[] = this.checkForChanges();
            if (clonedPanels.length > 0) {
            this.dotnetRef.invokeMethodAsync('UpdatedPanelsValues', clonedPanels);
            }
        }
    }

    public resizePanel(id: string, sizeX: number, sizeY: number): void {
        let panelInstance: PanelModel = this.getCellInstance(id);
        this.resizeCalled = true;
        let resizeElement: HTMLElement = document.getElementById(id);
        let args: ResizeArgs = { event: null, element: resizeElement, isInteracted: false, name: 'ResizeStart' };
        this.updatePanelSize(panelInstance.id, sizeX, sizeY);
        this.mainElement = resizeElement;
        this.updatePanelLayout(resizeElement, panelInstance);
        this.updatePanels();
        this.resizeCalled = false;
        this.dotnetRef.invokeMethodAsync('UpdatedPanelsValues', this.panels);
    }

    public removeAll(): void {
        this.removeAllCalled = true;
        for (let i: number = 0; i < this.panelElements.length; i++) {
            this.panelElements.splice(i, 1);
        }
        for (let i: number = this.renderedElement.length - 1; i >= 0; i--) {
            this.renderedElement.splice(i, 1);
        }
        this.rows = 0;
        this.sortedPanel();
        this.sortedArray = [];
        this.overlapElementClone = [];
        this.overlapElement = [];
        this.overlapSubElementClone = [];
        this.panelElements = [];
        this.oldRowCol = {};
        this.cloneObject = {};
        this.panels = [];
        this.updateCloneArrayObject();
        this.removeAllCalled = false;
    }

    public onPropertyChange(property : IDashboard): void {
        if (property.AllowFloating !== this.allowFloating) {
            this.allowFloating = property.AllowFloating;
            this.moveItemsUpwards();
        } else if (property.Columns !== this.columns) {
            this.columns = property.Columns;
            this.calculateCellSizeValue();
            for (let i : number = 0; i < this.panels.length; i++) {
                if (this.columns < this.panels[i].col || this.columns < this.panels[i].col + this.panels[i].sizeX) {
                  let colValue: number = this.columns - this.panels[i].sizeX;
                  this.updatePanelPosition(this.panels[i].id, (colValue < 0 ? 0 : colValue), this.panels[i].row);
                }
                this.updatePanelLayout(document.getElementById(this.panels[i].id), this.panels[i]);
            }
            this.renderDashBoardCells(this.panels);
            this.updatePanels();
            this.dotnetRef.invokeMethodAsync('UpdatedPanelsValues', this.panels);
        }
        this.getProperty(property);
    }

    private removeAllPanel(): void {
        while (this.element.firstElementChild) {
            detach(this.element.firstElementChild);
        }
    }

    public updatePanelLayout(element: HTMLElement, panelModel: PanelModel): void {
        this.collisionChecker = {};
        let initialModel: HTMLElement[] = [];
        let checkForAdjustment: boolean;
        let collisionModels: HTMLElement[] = [];
        let swappingAvailable: boolean;
        if (this.mainElement && this.isRenderComplete) {
            initialModel = this.resetLayout(panelModel, element);
        } else {
            initialModel = this.collisions(panelModel.row, panelModel.col, panelModel.sizeX, panelModel.sizeY, element);
        }
        if (initialModel.length > 0) {
            initialModel = this.updatedModels(initialModel, panelModel, element);
            swappingAvailable = !isNullOrUndefined(this.startRow) ? this.checkForSwapping(initialModel, element) : false;
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
                        this.updatePanelPosition(model.id, this.spacedColumnValue, this.spacedRowValue);
                        this.oldRowCol[(initialModel[i].id)] = { row: this.spacedRowValue, col: this.spacedColumnValue };
                        if (this.topAdjustable && this.allowFloating) {
                            this.updatePanels();
                            this.updateCloneArrayObject();
                        }
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
            collisionModels.forEach((item1: HTMLElement) => {
                if (this.overlapElement.indexOf(item1) === -1) {
                    this.overlapElement.push(item1);
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
    }

    public addPanel(panel: PanelModel): void {
        this.panelsSizeY = 0;

        if (!panel.minSizeX) {
            panel.minSizeX = 1;
        }
        if (!panel.minSizeY) {
            panel.minSizeY = 1;
        }
        // tslint:disable-next-line
        this.panels.push(panel);
        let cell: HTMLElement = this.renderCell(panel);
        this.panelElements.push(cell);
        this.renderedElement.push(cell);
        this.panelsInitialModel = this.cloneModels(this.panels);
        this.oldRowCol[panel.id] = { row: panel.row, col: panel.col };
        this.cloneObject[panel.id] = { row: panel.row, col: panel.col };
        this.updateOldRowColumn();
        this.element.insertAdjacentElement('afterbegin', cell);
        this.addPanelCalled = true;
        if (!this.checkMediaQuery()) {

            this.mainElement = cell;
            if (!this.checkCollision) {
                this.checkCollision = [];
            }
            this.updatePanelLayout(cell, panel);
        }
        this.addPanelCalled = false;
        if (this.allowDragging &&
            this.mediaQuery ? !(this.checkMediaQuery()) : false) {
            this.enableDraggingContent([document.getElementById(panel.id)]);
        }
        if (this.allowFloating) {
            this.mainElement = null;
            this.moveItemsUpwards();
        }
        this.updateOldRowColumn();
        this.sortedPanel();
        this.updateCloneArrayObject();
        if (this.allowResizing) {
            for (let i: number = 0; i < cell.querySelectorAll('.e-resize').length; i++) {
                let eventName: string = (Browser.info.name === 'msie') ? 'mousedown pointerdown' : 'mousedown';
                EventHandler.add(cell.querySelectorAll('.e-resize')[i], eventName, this.downResizeHandler, this);
                if (Browser.info.name !== 'msie') {
                    EventHandler.add(cell.querySelectorAll('.e-resize')[i], 'touchstart', this.touchDownResizeHandler, this);
                }
            }
        }
        this.dotnetRef.invokeMethodAsync('UpdatedPanelsValues', this.panels);
    }

    protected checkForSwapping(collisions: HTMLElement[], element: HTMLElement): boolean {
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
            if (collideInstance.sizeY === 1 && ignore.indexOf(collisions[count]) === -1) {
                ignore.push(collisions[count]);
            } else if (collideInstance.sizeY > 1 && ignore.indexOf(collisions[count]) === -1) {
                if (direction === 1 && elementinstance.row === (this.cloneObject[collideInstance.id].row + collideInstance.sizeY - 1)) {
                    ignore.push(collisions[count]);
                } else if (direction === 0 && elementinstance.row === (this.cloneObject[collideInstance.id].row)) {
                    ignore.push(collisions[count]);
                } else {
                    return false;
                }
            }
            if (collideInstance.sizeY <= elementinstance.sizeY && ignore.indexOf(collisions[count]) === -1) {
                ignore.push(collisions[count]);
            }
            let swapCollision: HTMLElement[];
            ignore.push(this.mainElement);
            swapCollision = this.collisions(updatedRow, collideInstance.col, collideInstance.sizeX, collideInstance.sizeY, ignore);
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
                collision = this.collisions(eleModel.row + i, collideModel.col, collideModel.sizeX, collideModel.sizeY, excludeEle);
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

    protected swapItems(collisions: HTMLElement[], element: HTMLElement, panelModel: PanelModel): void {
        let direction: number;
        let swappedElements: HTMLElement[] = [];
        swappedElements.push(element);
        let swapModel: PanelModel = this.getCellInstance(collisions[0].id);
        let eleSwapRow: number = swapModel.row;
        if (this.startRow < eleSwapRow) {
            direction = 1;
        } else if (this.startRow > eleSwapRow) {
            direction = 0;
        }
        let collisionItemsRow: number = direction === 0 ? eleSwapRow + panelModel.sizeY : this.startRow;
        if (!this.movePanelCalled) {
            let collisionInstance: PanelModel = this.getCellInstance(collisions[0].id);
            this.updatePanelPosition(panelModel.id, panelModel.col, (direction === 0 ?
                eleSwapRow : collisionItemsRow + collisionInstance.sizeY));
        }
        for (let count: number = 0; count < collisions.length; count++) {
            swappedElements.push(collisions[count]);
            this.updatePanelPosition(collisions[count].id, (this.getCellInstance(collisions[count].id)).col, collisionItemsRow);
        }
        this.updatePanelPosition(element.id, (this.getCellInstance(element.id)).col, panelModel.row);
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

    protected resetLayout(model: PanelModel, element: HTMLElement): HTMLElement[] {
        let collisions: HTMLElement[] = this.collisions(model.row, model.col, model.sizeX, model.sizeY, this.mainElement);
        if (!this.mainElement || this.addPanelCalled || this.resizeCalled || this.movePanelCalled) {
            return collisions;
        }
        if (this.mainElement && this.oldRowCol !== this.cloneObject) {
            for (let i: number = 0; i < this.panels.length; i++) {
                let targetElement: HTMLElement = document.getElementById(this.panels[i].id);
                if (targetElement === this.mainElement) {
                    continue;
                }
                let rowValue: number = this.cloneObject[targetElement.id].row;
                let colValue: number = this.cloneObject[targetElement.id].col;
                this.updatePanelPosition(targetElement.id, colValue, rowValue);
                this.updateOldRowColumn();
            }
        }
        this.sortedArray = this.cloneArray;
        collisions = this.collisions(model.row, model.col, model.sizeX, model.sizeY, this.mainElement);
        this.sortedPanel();
        this.updateOldRowColumn();
        if (this.checkCollision && this.checkCollision.length > 0 && collisions.indexOf(this.checkCollision[0]) === -1 &&
            this.cloneObject[this.checkCollision[0].id].row === model.row) {
            collisions.push(this.checkCollision[0]);
        }
        return collisions;
    }

    protected updatedModels(collisionItems: HTMLElement[], panelModel: PanelModel, targetElement: HTMLElement): HTMLElement[] {
        let removeableElement: HTMLElement[] = [];
        if (!this.mainElement) {
            this.sortedPanel();
        }
        collisionItems.forEach((element: HTMLElement) => {
            this.checkingElement = element;
            let model: PanelModel = this.getCellInstance(element.id);
            let adjust: boolean = !this.adjustmentAvailable(model.row, model.col, model.sizeY, model.sizeX, targetElement);
            if (model.sizeX > 1 && adjust) {
                for (let rowValue: number = model.row; rowValue < panelModel.row + panelModel.sizeY; rowValue++) {
                    let collisions: HTMLElement[] = this.collisions(rowValue, model.col, model.sizeX, model.sizeY, element);
                    collisions.forEach((item: HTMLElement) => {
                        if (collisionItems.indexOf(item) >= 0 && removeableElement.indexOf(item) === -1) {
                            removeableElement.push(item);
                        }
                    });
                }
            }
        });
        removeableElement.forEach((item: HTMLElement) => {
            if (removeableElement.indexOf(item) >= 0) {
                collisionItems.splice(collisionItems.indexOf(item), 1);
            }
        });
        return collisionItems;
    }

    private checkForCompletePushing(): void {
        for (let i: number = 0; i < this.panels.length; i++) {
            if (this.collisionChecker[this.panels[i].id] && this.collisionChecker[this.panels[i].id] !== null) {
                this.overlapElement = [this.collisionChecker[this.panels[i].id].ele];
                let key: string = this.panels[i].id;
                this.updateRowColumn(this.collisionChecker[key].row, this.overlapElement, this.collisionChecker[key].srcEle);
            }
        }
    }

    private updateRowColumn(row: number, ele: HTMLElement[], srcEle: HTMLElement): void {
        if (!srcEle) {
            return;
        }
        let srcElemodel: PanelModel = this.getCellInstance(srcEle.id);
        let eleSizeY: number = srcElemodel.sizeY;
        let eleRow: number = srcElemodel.row;
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
            let datamodel: PanelModel = this.getCellInstance(this.overlapElementClone[i].id);
            let collisionY: number = datamodel.sizeY;
            let collisionCol: number = datamodel.col;
            let collisionX: number = datamodel.sizeX;
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
                    let overlapModel: PanelModel = this.getCellInstance(overlapElementModel.id);
                    this.updatePanelPosition(overlapModel.id, overlapModel.col, overlapElementModel.row + 1);
                    this.updateCollisionChecked(ele);
                    this.oldRowCol[(ele.id)] = { row: overlapElementModel.row, col: colValue };
                    let panelModels: PanelModel = this.getCellInstance(ele.id);
                    let eleRow: number = panelModels.row;
                    let eleCol: number = panelModels.col;
                    let sizeX: number = panelModels.sizeX;
                    let sizeY: number = panelModels.sizeY;
                    let excludeElements: HTMLElement[] = [];
                    excludeElements.push(ele);
                    excludeElements.push(srcEle);
                    collisionModels = this.collisions(eleRow, eleCol, sizeX, sizeY, excludeElements);
                    if (this.mainElement && collisionModels.indexOf(this.mainElement) !== -1) {
                        collisionModels.splice(collisionModels.indexOf(this.mainElement), 1);
                    }
                    this.collisionPanel(collisionModels, eleCol, eleRow, ele);
                }
                this.isSubValue = false;
            } else {
                if (this.addPanelCalled) {
                    this.addPanelCalled = false;
                }
                let excludeEle: HTMLElement[] = [];
                excludeEle.push(this.overlapElementClone[i]);
                excludeEle.push(srcEle);
                collisionModels = this.collisions(updatedRow, collisionCol, collisionX, collisionY, excludeEle);
                if (this.mainElement && collisionModels.indexOf(this.mainElement) !== -1) {
                    collisionModels.splice(collisionModels.indexOf(this.mainElement), 1);
                }
                let dataModel: PanelModel = this.getCellInstance(this.overlapElementClone[i].id);
                colValue = dataModel.col;
                this.updatePanelPosition(dataModel.id, colValue, updatedRow);
                this.updateCollisionChecked(this.overlapElementClone[i]);
                this.oldRowCol[(this.overlapElementClone[i].id)] = { row: updatedRow, col: colValue };
                this.collisionPanel(collisionModels, colValue, updatedRow, this.overlapElementClone[i]);
            }
        }
    }

    private updateCollisionChecked(item: HTMLElement): void {
        for (let count: number = 0; count < Object.keys(this.collisionChecker).length; count++) {
            this.collisionChecker[item.id] = null;
        }
    }

    protected collisionPanel(collisionModels: HTMLElement[], colValue: number, updatedRow: number, clone: HTMLElement): void {
        if (collisionModels.length > 0) {
            this.overlapElement = [];
            this.shouldRestrict = true;
            collisionModels.forEach((item1: HTMLElement) => {
                this.overlapElement.push(item1);
            });
            let dataModel: PanelModel = this.getCellInstance(clone.id);
            let overlapElementRow1: number = dataModel.row;
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
                    let overlapModel: PanelModel = this.getCellInstance(this.overlapSubElementClone[p].id);
                    let rowVal: number = overlapModel.row;
                    let colValue: number = overlapModel.col;
                    let sizeX: number = overlapModel.sizeX;
                    let sizeY: number = overlapModel.sizeY;
                    let collisionModels1: HTMLElement[];
                    collisionModels1 = this.collisions(rowVal, colValue, sizeX, sizeY, this.overlapSubElementClone);
                    if (this.mainElement && collisionModels1.indexOf(this.mainElement) !== -1) {
                        collisionModels1.splice(collisionModels1.indexOf(this.mainElement), 1);
                    }
                    collisionModels1.forEach((item1: HTMLElement) => {
                        this.overlapElement.push(item1);
                    });
                    if (collisionModels1.length > 0) {
                        this.updateRowColumn(rowVal, this.overlapElement, this.overlapSubElementClone[p]);
                    }
                }
            }
            this.overlapSubElementClone = [];
        }
    }

    protected collisions(row: number, col: number, sizeX: number, sizeY: number, ignore: HTMLElement[] | HTMLElement): HTMLElement[] {
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

    private getPanel(row: number, column: number, excludeItems: HTMLElement[] | HTMLElement): PanelModel {
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
                    if (!isNullOrUndefined(item)) {
                        let model: PanelModel = this.getCellInstance(item.id);
                        if (item && (!excludeItems ||
                            (<HTMLElement[]>excludeItems).indexOf(item) === -1) && model.sizeX >= sizeX
                            && model.sizeY >= sizeY) {
                            return item;
                        }
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

    protected renderCell(panel: PanelModel): HTMLElement {
        let cellElement: HTMLElement;
        cellElement = document.getElementById(panel.id);
        return cellElement;
    }

    private sortedPanel(): void {
        this.sortedArray = [];
        for (let i: number = 0, l: number = this.renderedElement.length; i < l; ++i) {
            this.sortItem(this.renderedElement[i]);
        }
    }

    private updatePanels(): void {
        this.moveItemsUpwards();
        this.updateOldRowColumn();
        this.sortedPanel();
    }

    private sortItem(item: HTMLElement, rowValue?: number, columnValue?: number): void {
        this.overlapElement = [];
        let datamodel: PanelModel = this.getCellInstance(item.id);
        let column: number = datamodel.col;
        let row: number = datamodel.row;
        if (!this.sortedArray[row]) {
            this.sortedArray[row] = [];
        }
        this.sortedArray[row][column] = item;
        if (item !== undefined && rowValue !== undefined && columnValue !== undefined) {
            if (this.oldRowCol[item.id] !== undefined && this.oldRowCol[item.id].row !== null &&
                typeof this.oldRowCol[item.id].col !== 'undefined') {
                {
                    let oldRow: HTMLElement[] = this.sortedArray[this.oldRowCol[item.id].row];
                    if (!isNullOrUndefined(oldRow)) {
                        if (this.oldRowCol[item.id] && oldRow[this.oldRowCol[item.id].col] === item) {
                            delete oldRow[this.oldRowCol[item.id].col];
                            this.updateOldRowColumn();
                            this.sortedPanel();
                        }
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
            let panelModel: PanelModel = this.getCellInstance(item.id);
            this.updatePanelPosition(panelModel.id, columnValue, rowValue);
            this.sortedPanel();
        }
    }

    protected updateOldRowColumn(): void {
        this.oldRowCol = {};
        for (let i: number = 0; i < this.panels.length; i++) {
            let id: string = this.panels[i].id;
            if (document.getElementById(id)) {
                let row: number = this.panels[i].row;
                let col: number = this.panels[i].col;
                this.oldRowCol[this.panels[i].id] = { row: row, col: col };
            } else {
                continue;
            }
        }
    }

    protected getCellInstance(idValue: string): PanelModel {
        let currentCellInstance: PanelModel;
        for (let i: number = 0; i < this.panels.length; i++) {
            if (this.panels[i].id === idValue) {
                currentCellInstance = this.panels[i];
                break;
            }
        }
        return currentCellInstance;
    }

    private getRowElements(base: HTMLElement[]): HTMLElement[] {
        let rowElements: HTMLElement[] = [];
        for (let i: number = 0; i < base.length; i++) {
            rowElements.push(base[i]);
        }
        return rowElements;
    }

    protected adjustmentAvailable(row: number, col: number, sizeY: number, sizeX: number, targetElement: HTMLElement): boolean {
        this.leftAdjustable = undefined;
        this.rightAdjustable = undefined;
        let isAdjustable: boolean = false;
        let leftSpacing: number[] = [];
        let rightSpacing: number[] = [];
        let rowElement: HTMLElement[] = [];
        this.topAdjustable = undefined;
        let datamodel: PanelModel = this.getCellInstance(targetElement.id);
        let eleSizeX: number = datamodel.sizeX;
        let eleCol: number = datamodel.col;
        rowElement = this.getRowElements(this.collisions(row, 0, this.columns, sizeY, []));
        if (rowElement.indexOf(targetElement) === -1) {
            rowElement.push(targetElement);
        }
        leftSpacing = this.leftWardsSpaceChecking(rowElement, col, targetElement);
        if (leftSpacing.length > 0) {
            this.leftAdjustable = this.isLeftAdjustable(leftSpacing, targetElement, row, col, sizeX, sizeY);
            if (this.spacedColumnValue !== eleCol - this.getCellInstance(this.checkingElement.id).sizeX) {
                this.leftAdjustable = false;
            }
            if (this.leftAdjustable) {
                this.rightAdjustable = false;
            } else {
                this.leftAdjustable = false;
                rightSpacing = this.rightWardsSpaceChecking(rowElement, col, targetElement);
                this.rightAdjustable = rightSpacing.length > 0 ?
                    this.isRightAdjustable(rightSpacing, targetElement, row, col, sizeX, sizeY) : false;
                if (this.spacedColumnValue !== eleSizeX + eleCol) {
                    this.rightAdjustable = false;
                }
            }
        } else {
            rightSpacing = this.rightWardsSpaceChecking(rowElement, col, targetElement);
            this.rightAdjustable = rightSpacing.length > 0 ?
                this.isRightAdjustable(rightSpacing, targetElement, row, col, sizeX, sizeY) : false;
            if (this.spacedColumnValue !== eleSizeX + eleCol) {
                this.rightAdjustable = false;
            }
            if (this.rightAdjustable) {
                this.leftAdjustable = false;
            }
        }
        if (!this.rightAdjustable && !this.leftAdjustable && row > 0) {
            let endRow: number = this.getCellInstance(targetElement.id).row;
            let topCheck: boolean = false;
            if (this.startRow !== endRow) {
                topCheck = true;
            }
            for (let rowValue: number = row; rowValue >= 0; rowValue--) {
                let element: HTMLElement = (this.getCellInstance(targetElement.id).sizeY > 1 && topCheck) ?
                    this.checkingElement : targetElement;
                if ((rowValue !== endRow) && (rowValue === endRow - sizeY) &&
                    this.collisions(rowValue, col, sizeX, sizeY, element).length === 0) {
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

    private updatePanelPosition(id : string, col?: number, row?: number): void {
        if (this.panels.length > 0) {
            for (let i: number = 0; i < this.panels.length; i++) {
                if (this.panels[i].id === id) {
                    if (!isNullOrUndefined(col)) { this.panels[i].col = col; }
                    if (!isNullOrUndefined(row)) { this.panels[i].row = row; }
                }
            }
        }
        if (this.isRenderComplete) {
            let clonedPanels : PanelModel[] = this.checkForChanges();
            this.panelsInitialModel = this.cloneModels(this.panels);
            if (clonedPanels.length > 0) {
                if (this.isChanged && (this.changedId.indexOf(id) === -1)) { this.changedId.push(id); }
                this.dotnetRef.invokeMethodAsync('UpdatedPanelsValues', clonedPanels);
            }
        }
    }

    private rightWardsSpaceChecking(rowElements: HTMLElement[], col: number, targetElement: HTMLElement): number[] {
        let columns: number[] = [];
        let spacedColumns: number[] = [];
        rowElements.forEach((element: HTMLElement) => {
            let model: PanelModel = this.getCellInstance(element.id);
            let columnValue: number = model.col;
            let sizeXValue: number = model.sizeX;
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
        let occupiedValues: number[] = this.getOccupiedColumns(targetElement);
        occupiedValues.forEach((colValue: number) => {
            if (colValue > col && spacedColumns.indexOf(colValue) !== -1) {
                spacedColumns.splice(spacedColumns.indexOf(colValue), 1);
            }
        });
        let eleOccupiedValues: number[] = this.getOccupiedColumns(this.checkingElement);
        eleOccupiedValues.forEach((col: number) => {
            let datamodel: PanelModel = this.getCellInstance(targetElement.id);
            if (col > datamodel.col && occupiedValues.indexOf(col) === -1 &&
                spacedColumns.indexOf(col) === -1) {
                spacedColumns.push(col);
            }
        });
        spacedColumns = spacedColumns.sort((next: number, previous: number) => { return next - previous; });
        return spacedColumns;
    }

    private isRightAdjustable(spacing: number[], target: HTMLElement, row: number, col: number, sizeX: number, sizeY: number): boolean {
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
                        let collisionValue: HTMLElement[] = this.collisions(row, spacing[i], sizeX, sizeY, this.checkingElement);
                        for (let collision: number = 0; collision < collisionValue.length; collision++) {
                            let dataModel: PanelModel = this.getCellInstance(target.id);
                            if (dataModel.col !== spacing[i]) {
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
                isRightAdjudtable = this.replacable(spacing, sizeX, row, sizeY, target);
            }
        }
        return isRightAdjudtable;
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

    private leftWardsSpaceChecking(rowElements: HTMLElement[], col: number, targetElement: HTMLElement): number[] {
        let spacedColumns: number[] = [];
        let columns: number[] = [];
        rowElements.forEach((element: HTMLElement) => {
            let model: PanelModel = this.getCellInstance(element.id);
            let colValue: number = model.col;
            let xValue: number = model.sizeX;
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
        let occupiedValues: number[] = this.getOccupiedColumns(targetElement);
        occupiedValues.forEach((colValue: number) => {
            if (colValue < col && spacedColumns.indexOf(colValue) !== -1) {
                spacedColumns.splice(spacedColumns.indexOf(colValue), 1);
            }
        });
        let eleOccupiedValues: number[] = this.getOccupiedColumns(this.checkingElement);
        eleOccupiedValues.forEach((col: number) => {
            let datamodel: PanelModel = this.getCellInstance(targetElement.id);
            if (col < datamodel.col && occupiedValues.indexOf(col) === -1 &&
                spacedColumns.indexOf(col) === -1) {
                spacedColumns.push(col);
            }
        });
        spacedColumns = spacedColumns.sort((next: number, prev: number) => { return next - prev; });
        spacedColumns = spacedColumns.reverse();
        return spacedColumns;
    }

    protected isLeftAdjustable(spaces: number[], target: HTMLElement, row: number, col: number, sizeX: number, sizeY: number): boolean {
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
                        let collisionValue: HTMLElement[] = this.collisions(row, spaces[i], sizeX, sizeY, this.checkingElement);
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
                isLeftAdjudtable = this.replacable(spaces, sizeX, row, sizeY, target);
            }
        }
        return isLeftAdjudtable;
    }

    protected replacable(spacing: number[], sizeX: number, row: number, sizeY: number, targetElement: HTMLElement): boolean {
        let isRightAdjudtable: boolean;
        let updatedCollision: HTMLElement[] = [];
        for (let j: number = 0; j < spacing.length; j++) {
            let xAdjust: boolean = this.isXSpacingAvailable(spacing, sizeX);
            if (xAdjust) {
                let exclusions: HTMLElement[] = [];
                exclusions.push(this.checkingElement);
                exclusions.push(targetElement);
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

    private getOccupiedColumns(element: HTMLElement): number[] {
        let occupiedItems: number[] = [];
        let datamodel: PanelModel = this.getCellInstance(element.id);
        let sizeX: number = datamodel.sizeX;
        let col: number = datamodel.col;
        for (let i: number = col; (i < col + sizeX && i <= this.columns); i++) {
            occupiedItems.push(i);
        }
        return occupiedItems;
    }

    private moveItemsUpwards(): void {
        if (!this.allowFloating) {
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

    private moveItemUpwards(item: HTMLElement): void {
        if (!this.allowFloating || item === this.mainElement) {
            return;
        }
        let colIndex: number = this.getCellInstance(item.id).col;
        let sizeY: number = parseInt(item.getAttribute('data-sizeY'), 10);
        let sizeX: number = parseInt(item.getAttribute('data-sizeX'), 10);
        let availableRow: number = null;
        let availableColumn: number = null;
        let rowIndex: number = parseInt(item.getAttribute('data-row'), 10) - 1;
        while (rowIndex > -1) {
            let items: HTMLElement[] = this.collisions(rowIndex, colIndex, sizeX, sizeY, item);
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

    protected enableDraggingContent(collections: HTMLElement[]): void {
        for (let i: number = 0; i < collections.length; i++) {
            let abortArray: string[] = ['.e-resize', '.' + DRAGRESTRICT];
            let cellElement: HTMLElement = collections[i];
            {
                this.dragobj = new Draggable(cellElement, {
                    preventDefault: false,
                    clone: false,
                    dragArea: this.element,
                    isDragScroll: true,
                    handle: this.draggableHandle ? this.draggableHandle : '.e-panel',
                    abort: abortArray,
                    dragStart: this.onDraggingStart.bind(this),
                    dragStop: (args: DragEventArgs) => {
                        let model: PanelModel = this.getCellInstance(this.mainElement.id);
                        if (this.allowPushing &&
                            this.collisions(model.row, model.col, model.sizeX, model.sizeY, this.mainElement).length > 0) {
                            this.setHolderPosition(args);
                            this.updatePanelPosition(model.id, model.col, model.row);
                            this.updatePanelLayout(this.mainElement, model);
                        } else {
                            this.updatePanelPosition(model.id, model.col, model.row);
                        }
                        this.mainElement = null;
                        let item: PanelModel = this.getPanelBase(args);
                        if (this.shadowEle) {
                            detach(this.shadowEle);
                        }
                        removeClass([this.element], [PREVENTSELECT]);
                        removeClass([args.element], [DRAGGING]);
                        this.shadowEle = null;
                        args.element.classList.remove('e-dragging');
                        let row: number = this.getRowColumnDragValues(args)[0];
                        let col: number = this.getRowColumnDragValues(args)[1];
                        let panelModel: PanelModel = this.getCellInstance(args.element.id);
                        if (this.allowPushing &&
                            this.collisions(row, col, panelModel.sizeX, panelModel.sizeY, document.getElementById(item.id)).length === 0) {
                            this.oldRowCol[args.element.id].row = row;
                            this.oldRowCol[args.element.id].col = col;
                            this.updatePanelPosition(args.element.id, col, row);
                            this.sortedPanel();
                        } else {
                            let newValues: PanelModel = this.getCellInstance(args.element.id);
                            this.updatePanelPosition(newValues.id, newValues.col, newValues.row);
                            this.sortedPanel();
                        }
                        let panelInstance: PanelModel = this.getCellInstance(args.element.id);
                        this.setPanelPosition(args.element, panelInstance.row, panelInstance.col);
                        this.updatePanels();
                        this.updateCloneArrayObject();
                        this.dragStopEventArgs = { event: args.event, element: args.element };
                        this.dotnetRef.invokeMethodAsync('TriggerDragStop', args.element.id, this.changedId);
                        this.isChanged = false;
                        this.changedId = [];
                        this.resizeEvents();
                        this.updateDragArea();
                    },
                    drag: (args: DragEventArgs) => {
                        this.draggedEventArgs = {
                            event: args.event,
                            element: args.element,
                            target: <HTMLElement>closest((args.target), '.e-panel')
                        };
                        //this.dotnetRef.invokeMethodAsync('TriggerDraging', args.element.id, 'Dragging');
                        this.onDragStart(args);
                    }
                });
                if (this.dragCollection.indexOf(this.dragobj) === -1) {
                    this.dragCollection.push(this.dragobj);
                }
            }
        }
    };

    protected getPanelBase(args: HTMLElement | DragEventArgs | String): HTMLElement {
        let item: HTMLElement;
        for (let i: number = 0; i < this.panelElements.length; i++) {
            if (this.panelElements[i].id === (((<DragEventArgs>args).element
                && (<DragEventArgs>args).element.id) || <string>args)) {
                item = this.panelElements[i];
            }
        }
        return item;
    }

    protected updateCloneArrayObject(): void {
        this.cloneArray = this.sortedArray;
        this.cloneObject = JSON.parse(JSON.stringify(this.oldRowCol));
    }

    protected getRowColumnDragValues(args: DragEventArgs): number[] {
        let value: number[] = [];
        let elementTop: number = parseFloat(args.element.style.top);
        let elementLeft: number = parseFloat(args.element.style.left);
        let row: number = Math.round(elementTop / (this.getCellSize()[1] + this.cellSpacing[1]));
        let col: number = Math.round(elementLeft / (this.getCellSize()[0] + + this.cellSpacing[0]));
        value = [row, col];
        return value;
    }

    private onDragStart(args: DragEventArgs): void {
        let endCol: number;
        let endRow: number;
        let dragCol: number;
        let col: number = dragCol = this.getRowColumnDragValues(args)[1];
        let row: number = this.getRowColumnDragValues(args)[0];
        if (col < 0 || row < 0) {
            return;
        }
        let panelModel: PanelModel = this.getCellInstance(args.element.id);
        this.updateDragArea();
        if (this.allowPushing) {
            this.updatePanelPosition(panelModel.id, col, row);
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
                    this.checkCollision = this.collisions(model.row, model.col, model.sizeX, model.sizeY, args.element);
                    if (panelModel.col >= this.checkColumnValue) {
                        this.checkCollision = [];
                    }
                    this.updatePanelLayout(args.element, panelModel);
                    this.moveItemsUpwards();
                }
            }
        }
        if (this.oldRowCol[args.element.id].row !== row || this.oldRowCol[args.element.id].col !== col) {
            this.updatePanelPosition(panelModel.id, col, row);
        }
        if (this.startCol !== dragCol) {
            this.startCol = endCol;
            this.moveItemsUpwards();
        }
        if (!this.allowPushing) {
            this.setHolderPosition(args);
            return;
        }
    }

    protected bindEvents(): void {
        window.addEventListener('resize', this.refresh.bind(this));
        this.resizeEvents();
    }

    private refresh(): void {
        this.panelsSizeY = 0;
        this.updateDragArea();
        this.isMediaQuery = this.checkMediaQuery();
        if (!this.checkMediaQuery()) {
            if (this.element.classList.contains(RESPONSIVE)) {
                removeClass([this.element], [RESPONSIVE]);
            }
            this.element.classList.add('e-responsive');
            this.calculateCellSizeValue();
        }
        this.dotnetRef.invokeMethodAsync('CalculateSize', this.calculateCellSize(), this.isMediaQuery, true);
        this.resizeEvents();
        this.checkDragging(this.dragCollection);
    }

    protected checkDragging(dragCollection: Draggable[]): void {
        for (let i: number = 0; i < dragCollection.length; i++) {
            dragCollection[i].destroy();
        }
        if (!this.checkMediaQuery() && this.allowDragging) {
            this.enableDraggingContent(this.panelElements);
        }
    }

    private resizeEvents(): void {
        if (this.allowResizing) {
            let panelElements: NodeList = this.element.querySelectorAll('.e-panel .e-resize');
            for (let i: number = 0; i < panelElements.length; i++) {
                let eventName: string = (Browser.info.name === 'msie') ? 'mousedown pointerdown' : 'mousedown';
                EventHandler.add((<HTMLElement>panelElements[i]), eventName, this.downResizeHandler, this);
                if (Browser.info.name !== 'msie') {
                    EventHandler.add((<HTMLElement>panelElements[i]), 'touchstart', this.touchDownResizeHandler, this);
                }
            }
        }
    }

    protected touchDownResizeHandler(event: TouchEvent): void {
        this.downHandler(event);
        this.lastMouseX = event.changedTouches[0].pageX;
        this.lastMouseY = event.changedTouches[0].pageY;
        if (!this.isMouseMoveBound) {
            EventHandler.add(document, 'touchmove', this.touchMoveResizeHandler, this);
            this.isMouseMoveBound = true;
        }
        if (!this.isMouseUpBound) {
            EventHandler.add(document, 'touchend', this.upResizeHandler, this);
            this.isMouseUpBound = true;
        }
    }

    protected upResizeHandler(event: MouseEvent | TouchEvent): void {
        if (isNullOrUndefined(this.downTarget)) {
            return;
        }
        this.upTarget = (<HTMLElement>this.downTarget);
        let resizeElement: HTMLElement = (<HTMLElement>closest(<HTMLElement>(this.upTarget), '.e-panel'));
        let args: ResizeArgs = { event: event, element: resizeElement, isInteracted: true, name: 'ResizeStop' };
        if (resizeElement) {
            addClass([resizeElement], 'e-panel-transition');
            let moveEventName: string = (Browser.info.name === 'msie') ? 'mousemove pointermove' : 'mousemove';
            let upEventName: string = (Browser.info.name === 'msie') ? 'mouseup pointerup' : 'mouseup';
            EventHandler.remove(document, moveEventName, this.moveResizeHandler);
            EventHandler.remove(document, upEventName, this.upResizeHandler);
            if (Browser.info.name !== 'msie') {
                EventHandler.remove(document, 'touchmove', this.touchMoveResizeHandler);
                EventHandler.remove(document, 'touchend', this.upResizeHandler);
            }
            this.isMouseUpBound = false;
            this.isMouseMoveBound = false;
            if (this.shadowEle) {
                detach(this.shadowEle);
            }
            this.shadowEle = null;
            let panelModel: PanelModel = this.getCellInstance(resizeElement.getAttribute('id'));
            this.updatePanelPosition(panelModel.id, panelModel.col, panelModel.row);
        }
        removeClass([resizeElement], [DRAGGING]);
        this.isResizing = false;
        this.dotnetRef.invokeMethodAsync('TriggerResizeStart', args.isInteracted, resizeElement.id, 'ResizeStop');
        this.isChanged = false;
        this.resizeCalled = false;
        this.lastMouseX = this.lastMouseY = undefined;
        this.mOffX = this.mOffY = 0;
        this.mainElement = null;
        if (this.allowFloating) {
            this.moveItemsUpwards();
        }
        this.updatePanels();
        this.updateCloneArrayObject();
        this.dotnetRef.invokeMethodAsync('PanelChangedEvent', args.isInteracted, this.changedId);
        this.changedId = [];

    }
    protected moveResizeHandler(event: MouseEvent): void {
        this.updateMaxTopLeft(event);
        let movedElement: HTMLElement = (<HTMLElement>closest(<HTMLElement>(this.moveTarget), '.e-panel'));
        if (this.lastMouseX === event.pageX || this.lastMouseY === event.pageY) {
            return;
        }
        this.updateResizeElement(movedElement);
        let panelModel: PanelModel = this.getCellInstance(movedElement.getAttribute('id'));
        this.mouseX = event.pageX;
        this.mouseY = event.pageY;
        let diffY: number = this.mouseY - this.lastMouseY + this.mOffY;
        let diffX: number = this.mouseX - this.lastMouseX + this.mOffX;
        this.mOffX = this.mOffY = 0;
        this.lastMouseY = this.mouseY;
        this.lastMouseX = this.mouseX;
        this.resizingPanel(movedElement, panelModel, diffX, diffY);
    }

    protected getMinWidth(item: PanelModel): number {
        return (item.minSizeX) * this.getCellSize()[0];
    };

    protected getMaxWidth(item: PanelModel): number {
        return (item.maxSizeX) * this.getCellSize()[0];
    };

    protected getMinHeight(item: PanelModel): number {
        return (item.minSizeY) * this.getCellSize()[1];
    };

    protected getMaxHeight(item: PanelModel): number {
        return (item.maxSizeY) * this.getCellSize()[1];
    };

    /* istanbul ignore next */
    protected resizingPanel(targetElement: HTMLElement, panelModel: PanelModel, currentX: number, currentY: number): void {
        let oldSizeX: number = this.getCellInstance(targetElement.id).sizeX;
        let oldSizeY: number = this.getCellInstance(targetElement.id).sizeY;
        let lengthY: number = currentY;
        let lengthX: number = currentX;
        if (this.handleClass.indexOf('north') >= 0) {
            if (this.elementHeight - lengthY < this.getMinHeight(panelModel)) {
                currentY = this.elementHeight - this.getMinHeight(panelModel);
                this.mOffY = lengthY - currentY;
            } else if (panelModel.maxSizeY && this.elementHeight - lengthY > this.getMaxHeight(panelModel)) {
                currentY = this.elementHeight - this.getMaxHeight(panelModel);
                this.mOffY = lengthY - currentY;
            } else if (this.elementY + lengthY < this.minTop) {
                currentY = this.minTop - this.elementY;
                this.mOffY = lengthY - currentY;
            }
            this.elementY += currentY;
            this.elementHeight -= currentY;
        }
        if (this.handleClass.indexOf('south') >= 0) {
            if (this.elementHeight + lengthY < this.getMinHeight(panelModel)) {
                currentY = this.getMinHeight(panelModel) - this.elementHeight;
                this.mOffY = lengthY - currentY;
            } else if (panelModel.maxSizeY && this.elementHeight + lengthY > this.getMaxHeight(panelModel)) {
                currentY = this.getMaxHeight(panelModel) - this.elementHeight;
                this.mOffY = lengthY - currentY;
            } else if (this.elementY + this.elementHeight + lengthY > this.maxTop) {
                currentY = this.maxTop - this.elementY - this.elementHeight;
                this.mOffY = lengthY - currentY;
            }
            this.elementHeight += currentY;
        }
        if (this.handleClass.indexOf('west') >= 0) {
            if (this.elementWidth - lengthX < this.getMinWidth(panelModel)) {
                currentX = this.elementWidth - this.getMinWidth(panelModel);
                this.mOffX = lengthX - currentX;
            } else if (panelModel.maxSizeX && this.elementWidth - lengthX > this.getMaxWidth(panelModel)) {
                currentX = this.elementWidth - this.getMaxWidth(panelModel);
                this.mOffX = lengthX - currentX;
            } else if (this.elementX + lengthX < this.minLeft) {
                currentX = this.minLeft - this.elementX;
                this.mOffX = lengthX - currentX;
            }
            this.elementX += currentX;
            this.elementWidth -= currentX;
        }
        if (this.handleClass.indexOf('east') >= 0) {
            if (this.elementWidth + lengthX < this.getMinWidth(panelModel)) {
                currentX = this.getMinWidth(panelModel) - this.elementWidth;
                this.mOffX = lengthX - currentX;
            } else if (panelModel.maxSizeX && this.elementWidth + lengthX > this.getMaxWidth(panelModel)) {
                currentX = this.getMaxWidth(panelModel) - this.elementWidth;
                this.mOffX = lengthX - currentX;
            } else if (this.elementX + this.elementWidth + lengthX > this.maxLeft) {
                currentX = this.maxLeft - this.elementX - this.elementWidth;
                this.mOffX = lengthX - currentX;
            }
            this.elementWidth += currentX;
        }
        let item: PanelModel = this.getResizeRowColumn(panelModel, <HTMLElement>this.moveTarget);
        if (item.col + item.sizeX > this.columns) {
            this.updatePanelSize(item.id, item.sizeX - 1, null);
        }
        this.shadowEle.style.top = ((item.row * this.getCellSize()[1] + (item.row * this.cellSpacing[1]))) + 'px';
        this.shadowEle.style.left = ((item.col * this.getCellSize()[0]) + ((item.col) * this.cellSpacing[0])) + 'px';
        this.shadowEle.style.height = ((item.sizeY * (this.getCellSize()[1] + (this.cellSpacing[1])))) + 'px';
        this.shadowEle.style.width = ((item.sizeX * (this.getCellSize()[0] + (this.cellSpacing[0])))) + 'px';
        if (oldSizeX !== item.sizeX || oldSizeY !== item.sizeY) {
            oldSizeX = item.sizeX;
            oldSizeY = item.sizeY;
            let model: PanelModel = this.getCellInstance(targetElement.id);
            this.updatePanelSize(targetElement.id, model.sizeX, model.sizeY);
            this.updatePanelPosition(targetElement.id, model.col, model.row);
            this.mainElement = targetElement;
            this.updatePanelLayout(targetElement, this.getCellInstance(targetElement.id));
            this.updateOldRowColumn();
            this.sortedPanel();
        }
    }

    protected pixelsToColumns(pixels: number, isCeil: boolean): number {
        let curColWidth: number = <number>this.cellSize[0];
        if (isCeil) {
            return Math.ceil(pixels / curColWidth);
        } else {
            return Math.floor(pixels / curColWidth);
        }
    }

    protected pixelsToRows(pixels: number, isCeil: boolean): number {
        if (isCeil) {
            return Math.round(pixels / <number>this.cellSize[1]);
        } else {
            return Math.round(pixels / (<number>this.cellSize[1] + this.cellSpacing[0]));
        }
    }

    protected getResizeRowColumn(item: PanelModel, e: HTMLElement): PanelModel {
        let isChanged: boolean = false;
        let col: number = item.col;
        if (['e-west', 'e-south-west'].indexOf(this.handleClass) !== -1) {
            col = this.pixelsToColumns(this.elementX, false);
        }
        let row: number = item.row;
        if (['e-north'].indexOf(this.handleClass) !== -1) {
            row = this.pixelsToRows(this.elementY, false);
            if (this.previousRow !== row) {
                this.previousRow = row;
                isChanged = true;
            }
        }
        let sizeX: number = item.sizeX;
        if (['e-north', 'e-south'].indexOf(this.handleClass) === -1) {
            sizeX = this.pixelsToColumns(this.elementWidth - (sizeX) * this.cellSpacing[1], true);
        }
        let sizeY: number = item.sizeY;
        if (['e-east', 'e-west'].indexOf(this.handleClass) === -1) {
            if (this.handleClass === 'e-north' ? isChanged : true) {
                sizeY = this.pixelsToRows(this.elementHeight - (sizeY) * this.cellSpacing[0], true);
            }
        }
        if (item.col + item.sizeX > this.columns) {
            item.sizeX = item.sizeX - 1;
        }
        let canOccupy: boolean = row > -1 && col > -1 && sizeX + col <= this.columns && sizeY + row <= this.rows;
        if (canOccupy && (this.collisions(row, col, sizeX, sizeY, this.getPanelBase(item.id)).length === 0)
            || this.allowPushing) {
                this.updatePanelSize(item.id, sizeX, sizeY);
                this.updatePanelPosition(item.id, col, row);
        }
        return item;
    }

    protected touchMoveResizeHandler(event: TouchEvent): void {
        this.updateMaxTopLeft(event);
        let targetElement: HTMLElement = (<HTMLElement>closest(<HTMLElement>(this.moveTarget), '.e-panel'));
        if (this.lastMouseX === event.changedTouches[0].pageX || this.lastMouseY === event.changedTouches[0].pageY) {
            return;
        }
        this.updateResizeElement(targetElement);
        let panelModel: PanelModel = this.getCellInstance(targetElement.getAttribute('id'));
        this.mouseX = event.changedTouches[0].pageX;
        this.mouseY = event.changedTouches[0].pageY;
        let diffX: number = this.mouseX - this.lastMouseX + this.mOffX;
        let diffY: number = this.mouseY - this.lastMouseY + this.mOffY;
        this.mOffX = this.mOffY = 0;
        this.lastMouseX = this.mouseX;
        this.lastMouseY = this.mouseY;
        this.resizingPanel(targetElement, panelModel, diffX, diffY);
    }

    protected updateResizeElement(targetElement: HTMLElement): void {
        this.maxLeft = this.element.offsetWidth - 1;
        this.maxTop = <number>this.cellSize[1] * this.maxRows - 1;
        removeClass([targetElement], 'e-panel-transition');
        addClass([targetElement], [DRAGGING]);
        let handleArray: string[] = [EAST, WEST, NORTH, SOUTH, SOUTHEAST, NORTHEAST, NORTHWEST, SOUTHWEST];
        for (let i: number = 0; i < (<HTMLElement>this.moveTarget).classList.length; i++) {
            if (handleArray.indexOf((<HTMLElement>this.moveTarget).classList[i]) !== -1) {
                this.handleClass = ((<HTMLElement>this.moveTarget).classList[i]);
            }
        }
    }

    protected updateMaxTopLeft(event: MouseEvent | TouchEvent): void {
        this.moveTarget = this.downTarget;
        let targetElement: HTMLElement = (<HTMLElement>closest(<HTMLElement>(this.moveTarget), '.e-panel'));
        let args: ResizeArgs = { event: event, element: targetElement, isInteracted: true, name: 'Resizing' };
        // tslint:disable-next-line
        this.resizeTimeCount = setTimeout((): void => this.resizeCall( args.isInteracted, targetElement.id, 'Resizing') , 100);
    }

    protected resizeCall(isInteracted: boolean, id: string, name: string): void {
        if ((this.isResizing && this.resizeTimeCount > 100) ||  this.resizeTimeCount === undefined) {
            this.dotnetRef.invokeMethodAsync('TriggerResizeStart', isInteracted, id, name);
            this.resizeTimeCount = 1;
        }
    }

    protected downResizeHandler(event: MouseEvent): void {
        this.downHandler(event);
        this.lastMouseX = event.pageX;
        this.lastMouseY = event.pageY;
        let moveEventName: string = (Browser.info.name === 'msie') ? 'mousemove pointermove' : 'mousemove';
        let upEventName: string = (Browser.info.name === 'msie') ? 'mouseup pointerup' : 'mouseup';
        if (!this.isMouseMoveBound) {
            EventHandler.add(document, moveEventName, this.moveResizeHandler, this);
            this.isMouseMoveBound = true;
        }
        if (!this.isMouseUpBound) {
            EventHandler.add(document, upEventName, this.upResizeHandler, this);
            this.isMouseUpBound = true;
        }
    };

    protected downHandler(event: MouseEvent | TouchEvent): void {
        this.resizeCalled = false;
        this.panelsInitialModel = this.cloneModels(this.panels);
        let targetElement: HTMLElement = (<HTMLElement>closest(<HTMLElement>(<HTMLElement>(event.currentTarget)), '.e-panel'));
        this.isChanged = true;
        let args: ResizeArgs = { event: event, element: targetElement, isInteracted: true, name: 'ResizeStart' };
        this.dotnetRef.invokeMethodAsync('TriggerResizeStart', args.isInteracted, targetElement.id, 'ResizeStart');
        this.isResizing = true;
        this.downTarget = (<HTMLElement>event.currentTarget);
        this.shadowEle = document.createElement('div');
        this.shadowEle.classList.add('e-holder');
        addClass([this.element], [PREVENTSELECT]);
        this.element.appendChild(this.shadowEle);
        this.elementX = parseFloat(targetElement.style.left);
        this.elementY = parseFloat(targetElement.style.top);
        this.elementWidth = targetElement.offsetWidth;
        this.elementHeight = targetElement.offsetHeight;
        this.originalWidth = this.getCellInstance(targetElement.id).sizeX;
        this.originalHeight = this.getCellInstance(targetElement.id).sizeY;
        this.previousRow = this.getCellInstance(targetElement.id).row;
    }

    private onDraggingStart(args: DragEventArgs & BlazorDragEventArgs): void {
        let dragArgs: DragEventArgs & BlazorDragEventArgs = args;
        this.dotnetRef.invokeMethodAsync('TriggerDragStart', args.element.id);
        this.isChanged = true;
        dragArgs.bindEvents(args.element);
        this.panelsInitialModel = this.cloneModels(this.panels);
        this.mainElement = args.element;
        let datamodel: PanelModel = this.getCellInstance(args.element.id);
        let eleRowValue: number = this.startRow = datamodel.row;
        this.startCol = datamodel.col;
        let eleSizeY: number = datamodel.sizeY;
        this.updateDragArea();
        this.shadowEle = document.createElement('div');
        this.shadowEle.classList.add('e-holder');
        this.shadowEle.classList.add('e-holder-transition');
        setStyle(this.shadowEle, { 'position': 'absolute' });
        addClass([this.element], [PREVENTSELECT]);
        addClass([args.element], [DRAGGING]);
        this.element.appendChild(this.shadowEle);
        this.shadowEle = document.querySelector('.e-holder');
        this.shadowEle.style.height = (this.getCellInstance(args.element.id).sizeY * <number>this.cellSize[1]) + 'px';
        this.shadowEle.style.width = (this.getCellInstance(args.element.id).sizeX * <number>this.cellSize[0]) + 'px';
        let panelInstance: PanelModel = this.getCellInstance(args.element.id);
        this.updatePanelPosition(panelInstance.id, panelInstance.col, panelInstance.row);
        this.setPanelPosition(this.shadowEle, panelInstance.row, panelInstance.col);
    };

    private updatePanelSize(id : string, sizeX?: number, sizeY?: number): void {
        if (this.panels.length > 0) {
            for (let i: number = 0; i < this.panels.length; i++) {
                if (this.panels[i].id === id) {
                    if (!isNullOrUndefined(sizeX)) { this.panels[i].sizeX = sizeX; }
                    if (!isNullOrUndefined(sizeY)) { this.panels[i].sizeY = sizeY; }
                }
            }
        }
    }

    protected updateDragArea(): void {
        this.dragCollection.forEach((dragobj: Draggable) => {
            // tslint:disable-next-line
            (<any>dragobj).setDragArea();
        });
    }

    protected setPanelPosition(cellElement: HTMLElement, row: number, col: number): void {
        if (!cellElement) {
            return;
        }
        let heightValue: number | string = this.getCellSize()[1];
        let widthValue: number | string = this.getCellSize()[0];
        let left: number = col === 0 ? 0 : (((col) * ((widthValue) + this.cellSpacing[0])));
        let top: number = row === 0 ? 0 : (((row) * ((heightValue) + this.cellSpacing[1])));
        setStyle(cellElement, { 'left': left + 'px', 'top': top + 'px' });
    }
    protected calculateCellSizeValue(): void {
        this.cellSize = [];
        if ((this.checkMediaQuery())) {
            this.cellSize[1] = this.element.parentElement
                && ((this.element.parentElement.offsetWidth)) / this.cellAspectRatio;
        } else {
            this.cellSize[0] = this.element.parentElement &&
                ((this.element.parentElement.offsetWidth));
            this.cellSize[0] = this.element.parentElement
                && ((this.element.parentElement.offsetWidth - ((this.columns - 1) * this.cellSpacing[0]))
                    / (this.columns));
            this.cellSize[1] = <number>this.cellSize[0] / this.cellAspectRatio;
        }
    }

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

    protected checkForChanges(): PanelModel[] {
        let changedPanels: PanelModel[] = [];
        for (let i: number = 0; i < this.panels.length; i++) {
            if ((this.panels[i].row !== this.panelsInitialModel[i].row || this.panels[i].col !== this.panelsInitialModel[i].col ||
                this.panels[i].sizeX !== this.panelsInitialModel[i].sizeX || this.panels[i].sizeY !== this.panelsInitialModel[i].sizeY)) {
                changedPanels.push(this.panels[i]);
            }
        }
        return changedPanels;
    }

    private getCellSize(): number[] {
        return [this.cellSize[0], this.cellSize[1]];
    }

    public destroy(): void {
        this.element.removeAttribute('style');
        for (let i: number = 0; i < this.dragCollection.length; i++) {
            this.dragCollection[i].destroy();
        }
        this.removeAllPanel();
    }
    protected setHolderPosition(args: DragEventArgs): void {
        let cellSizeOne: number;
        let cellSizeZero: number;
        let sizeY: number = parseInt(args.element.getAttribute('data-sizeY'), 10);
        let col: number = parseInt(args.element.getAttribute('data-col'), 10);
        let row: number = parseInt(args.element.getAttribute('data-row'), 10);
        let sizeX: number = parseInt(args.element.getAttribute('data-sizeX'), 10);
        let widthValue: number = this.getCellSize()[0];
        let heightValue: number = this.getCellSize()[1];
        let top: number = row === 0 ? 0 : (((row) * (heightValue + this.cellSpacing[1])));
        let left: number = col === 0 ? 0 : (((col) * (widthValue + this.cellSpacing[0])));
        cellSizeOne = this.getCellSize()[1];
        cellSizeZero = this.getCellSize()[0];
        this.shadowEle.style.top = top + 'px';
        this.shadowEle.style.left = left + 'px';
        this.shadowEle.style.height = ((sizeY * cellSizeOne) + ((sizeY - 1) * this.cellSpacing[1])) + 'px';
        this.shadowEle.style.width = ((sizeX * cellSizeZero) + ((sizeX - 1) * this.cellSpacing[0])) + 'px';
    };
}
// tslint:disable-next-line
let DashboardLayout: object = {
    initialize(element: BlazorDashboardElement, dotnetRef: BlazorDotnetObject, property: IDashboard): boolean {
        new SfDashboardLayout(element, dotnetRef);
        if (this.isValid(element)) { element.blazor__instance.initialize(property); }
        return (property.MediaQuery && window.matchMedia('(' + property.MediaQuery + ')').matches);
    },
    calculateCellSize(element: BlazorDashboardElement): number[] {
        if (this.isValid(element)) { element.blazor__instance.calculateCellSize(); }
        return element != null ? element.blazor__instance.calculateCellSize() : null;
    },
    movePanel(element: BlazorDashboardElement, id : string, row : number, col : number): void {
        if (this.isValid(element)) { element.blazor__instance.movePanel(id, row, col); }
    },
    removePanel(element: BlazorDashboardElement, id : string): void {
        if (this.isValid(element)) { element.blazor__instance.removePanel(id); }
    },
    resizePanel(element: BlazorDashboardElement, id: string, sizeX: number, sizeY: number): void {
        if (this.isValid(element)) { element.blazor__instance.resizePanel(id, sizeX, sizeY); }
    },
    removeAll(element: BlazorDashboardElement): void {
        if (this.isValid(element)) { element.blazor__instance.removeAll(); }
    },
    addPanel(element: BlazorDashboardElement, panel: PanelModel): void {
        if (this.isValid(element)) { element.blazor__instance.addPanel(panel); }
    },
    onPropertyChange(element: BlazorDashboardElement, property: IDashboard): void {
        if (this.isValid(element)) { element.blazor__instance.onPropertyChange(property); }
    },
    destroy(element: BlazorDashboardElement): void {
        if (this.isValid(element)) { element.blazor__instance.destroy(); }
    },
    isValid(element: BlazorDashboardElement): boolean {
        return (element && element.blazor__instance) ? true : false;
    }

};

interface IDashboard {
    AllowDragging: boolean;
    AllowFloating: boolean;
    MediaQuery: string;
    AllowResizing: boolean;
    CellAspectRatio: number;
    ResizableHandles: boolean;
    ShowGridLines: boolean;
    Columns: number;
    MaxRowValue: number;
    CellSpacing: number[];
    Panels: PanelModel[];
    DraggableHandle: string;
}
interface PanelModel {
    id?: string;
    cssClass?: string;
    header ?: string;
    content ?: string;
    enabled?: boolean;
    row?: number;
    col?: number;
    column?: number;
    sizeX?: number;
    sizeY?: number;
    maxSizeY?: number;
    maxSizeX?: number;
    zIndex? : number;
    minSizeX? : number;
    minSizeY? : number;
}

interface DraggedEventArgs {
    event: MouseEvent | TouchEvent;
    element: HTMLElement;
    target: HTMLElement;
}

interface DragStopArgs {

    event: MouseEvent | TouchEvent;
    element: HTMLElement;
}

interface BlazorDashboardElement extends HTMLElement {
    blazor__instance: SfDashboardLayout;
}

export interface ResizeArgs {
    event: MouseEvent | TouchEvent;
    element: HTMLElement;
    isInteracted: boolean;
    name : string;
}

export default DashboardLayout;
