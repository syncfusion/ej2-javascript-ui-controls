window.sfBlazor = window.sfBlazor || {};
window.sfBlazor.DashboardLayout = (function () {
'use strict';

var DRAGRESTRICT = 'e-drag-restrict';
var PREVENTSELECT = 'e-prevent';
var DRAGGING = 'e-dragging';
var RESPONSIVE = 'e-responsive';
var EAST = 'e-east';
var WEST = 'e-west';
var NORTH = 'e-north';
var SOUTH = 'e-south';
var NORTHEAST = 'e-north-east';
var SOUTHEAST = 'e-south-east';
var NORTHWEST = 'e-north-west';
var SOUTHWEST = 'e-south-west';
var SfDashboardLayout = /** @class */ (function () {
    function SfDashboardLayout(element, dotnetRef) {
        this.cellAspectRatio = 1;
        this.mOffX = 0;
        this.mOffY = 0;
        this.maxTop = 9999;
        this.maxRows = 100;
        this.mouseX = 0;
        this.mouseY = 0;
        this.minTop = 0;
        this.minLeft = 0;
        this.allowPushing = true;
        this.allowResizing = false;
        this.panelElements = [];
        this.renderedElement = [];
        this.allowDragging = false;
        this.isRenderComplete = false;
        this.allowFloating = false;
        this.overlapElement = [];
        this.panelsSizeY = 0;
        this.shouldRestrict = false;
        this.overlapElementClone = [];
        this.addPanelCalled = false;
        this.rows = 0;
        this.cellSpacing = [];
        this.resizeCalled = false;
        this.movePanelCalled = false;
        this.isResizing = false;
        this.resizeTimeCount = 0;
        this.isChanged = false;
        this.changedId = [];
        this.element = element;
        this.element.blazor__instance = this;
        this.dotnetRef = dotnetRef;
    }
    SfDashboardLayout.prototype.preRender = function (property) {
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
    };
    SfDashboardLayout.prototype.initialize = function (property) {
        this.preRender(property);
        if (sf.base.isNullOrUndefined(this.panels)) {
            this.panels = [];
        }
        for (var i = 0; i < this.element.querySelectorAll('.e-panel').length; i++) {
            this.panelElements.push((this.element.querySelectorAll('.e-panel')[i]));
        }
        this.panelsInitialModel = this.cloneModels(this.panels);
        this.renderDashBoardCells(this.panels);
        if (this.allowDragging && (this.mediaQuery ? !window.matchMedia('(' + this.mediaQuery + ')').matches : true)) {
            this.enableDraggingContent(this.panelElements);
        }
        this.checkColumnValue = this.maxColumnValue;
        this.isRenderComplete = true;
        this.bindEvents();
    };
    SfDashboardLayout.prototype.calculateCellSize = function () {
        this.cellSizeValue = [];
        this.cellSizeValue[0] = this.element.parentElement && ((this.element.parentElement.offsetWidth));
        return this.cellSizeValue;
    };
    SfDashboardLayout.prototype.checkMediaQuery = function () {
        return (this.mediaQuery && window.matchMedia('(' + this.mediaQuery + ')').matches);
    };
    SfDashboardLayout.prototype.getProperty = function (property) {
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
    };
    SfDashboardLayout.prototype.movePanel = function (id, row, col) {
        this.movePanelCalled = true;
        this.panelsInitialModel = this.cloneModels(this.panels);
        var panelInstance = this.getCellInstance(id);
        var movedElement = document.getElementById(id);
        var datamodel = this.getCellInstance(movedElement.id);
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
    };
    SfDashboardLayout.prototype.removePanel = function (id) {
        this.panelsSizeY = 0;
        for (var i = this.renderedElement.length - 1; i >= 0; i--) {
            if (this.renderedElement[i].id === id) {
                this.renderedElement.splice(i, 1);
                break;
            }
        }
        for (var i = 0; i < this.panelElements.length; i++) {
            if (this.panelElements[i].id === id) {
                this.panelElements.splice(i, 1);
            }
            if (this.panels[i].id === id) {
                this.panels.splice(i, 1);
                this.updateOldRowColumn();
                this.sortedPanel();
            }
        }
        this.updatePanels();
        this.updateCloneArrayObject();
        this.panelsInitialModel = this.cloneModels(this.panels);
    };
    SfDashboardLayout.prototype.renderDashBoardCells = function (cells) {
        if (this.element.querySelectorAll('.e-panel').length > 0 || this.panels.length > 0) {
            this.updateOldRowColumn();
            for (var i = 0; i < this.panels.length; i++) {
                if (this.columns < this.panels[i].col || this.columns < this.panels[i].col + this.panels[i].sizeX) {
                    var colValue = this.columns - this.panels[i].sizeX;
                    this.updatePanelPosition(this.panels[i].id, colValue < 0 ? 0 : colValue, this.panels[i].row);
                }
                this.renderedElement.push(this.panelElements[i]);
                var cell = this.renderCell(cells[i]);
                this.updatePanelLayout(cell, this.panels[i]);
            }
            this.updatePanels();
            this.updateCloneArrayObject();
            var clonedPanels = this.checkForChanges();
            if (clonedPanels.length > 0) {
                this.dotnetRef.invokeMethodAsync('UpdatedPanelsValues', clonedPanels);
            }
        }
    };
    SfDashboardLayout.prototype.resizePanel = function (id, sizeX, sizeY) {
        var panelInstance = this.getCellInstance(id);
        this.resizeCalled = true;
        var resizeElement = document.getElementById(id);
        this.updatePanelSize(panelInstance.id, sizeX, sizeY);
        this.mainElement = resizeElement;
        this.updatePanelLayout(resizeElement, panelInstance);
        this.updatePanels();
        this.resizeCalled = false;
        this.dotnetRef.invokeMethodAsync('UpdatedPanelsValues', this.panels);
    };
    SfDashboardLayout.prototype.removeAll = function () {
        this.removeAllCalled = true;
        for (var i = 0; i < this.panelElements.length; i++) {
            this.panelElements.splice(i, 1);
        }
        for (var i = this.renderedElement.length - 1; i >= 0; i--) {
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
    };
    SfDashboardLayout.prototype.onPropertyChange = function (property) {
        if (property.AllowFloating !== this.allowFloating) {
            this.allowFloating = property.AllowFloating;
            this.moveItemsUpwards();
        }
        else if (property.Columns !== this.columns) {
            this.columns = property.Columns;
            this.calculateCellSizeValue();
            for (var i = 0; i < this.panels.length; i++) {
                if (this.columns < this.panels[i].col || this.columns < this.panels[i].col + this.panels[i].sizeX) {
                    var colValue = this.columns - this.panels[i].sizeX;
                    this.updatePanelPosition(this.panels[i].id, (colValue < 0 ? 0 : colValue), this.panels[i].row);
                }
                this.updatePanelLayout(document.getElementById(this.panels[i].id), this.panels[i]);
            }
            this.renderDashBoardCells(this.panels);
            this.updatePanels();
            this.dotnetRef.invokeMethodAsync('UpdatedPanelsValues', this.panels);
        }
        this.getProperty(property);
    };
    SfDashboardLayout.prototype.removeAllPanel = function () {
        while (this.element.firstElementChild) {
            sf.base.detach(this.element.firstElementChild);
        }
    };
    SfDashboardLayout.prototype.updatePanelLayout = function (element, panelModel) {
        var _this = this;
        this.collisionChecker = {};
        var initialModel = [];
        var checkForAdjustment;
        var collisionModels = [];
        var swappingAvailable;
        if (this.mainElement && this.isRenderComplete) {
            initialModel = this.resetLayout(panelModel, element);
        }
        else {
            initialModel = this.collisions(panelModel.row, panelModel.col, panelModel.sizeX, panelModel.sizeY, element);
        }
        if (initialModel.length > 0) {
            initialModel = this.updatedModels(initialModel, panelModel, element);
            swappingAvailable = !sf.base.isNullOrUndefined(this.startRow) ? this.checkForSwapping(initialModel, element) : false;
            if (swappingAvailable) {
                this.swapItems(initialModel, element, panelModel);
            }
            else {
                for (var i = 0; i < initialModel.length; i++) {
                    var model = this.getCellInstance(initialModel[i].id);
                    this.checkingElement = initialModel[i];
                    this.spacedRowValue = null;
                    this.spacedColumnValue = null;
                    checkForAdjustment = this.adjustmentAvailable(model.row, model.col, model.sizeY, model.sizeX, element);
                    if (checkForAdjustment && !sf.base.isNullOrUndefined(this.spacedColumnValue)) {
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
                    }
                    else {
                        collisionModels.push(initialModel[i]);
                    }
                }
            }
        }
        if (collisionModels.length > 0) {
            collisionModels.forEach(function (item1) {
                if (_this.overlapElement.indexOf(item1) === -1) {
                    _this.overlapElement.push(item1);
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
    };
    SfDashboardLayout.prototype.addPanel = function (panel) {
        this.panelsSizeY = 0;
        if (!panel.minSizeX) {
            panel.minSizeX = 1;
        }
        if (!panel.minSizeY) {
            panel.minSizeY = 1;
        }
        // tslint:disable-next-line
        this.panels.push(panel);
        var cell = this.renderCell(panel);
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
            for (var i = 0; i < cell.querySelectorAll('.e-resize').length; i++) {
                var eventName = (sf.base.Browser.info.name === 'msie') ? 'mousedown pointerdown' : 'mousedown';
                sf.base.EventHandler.add(cell.querySelectorAll('.e-resize')[i], eventName, this.downResizeHandler, this);
                if (sf.base.Browser.info.name !== 'msie') {
                    sf.base.EventHandler.add(cell.querySelectorAll('.e-resize')[i], 'touchstart', this.touchDownResizeHandler, this);
                }
            }
        }
        this.dotnetRef.invokeMethodAsync('UpdatedPanelsValues', this.panels);
    };
    SfDashboardLayout.prototype.checkForSwapping = function (collisions, element) {
        if (!this.mainElement || collisions.length === 0) {
            return false;
        }
        var direction;
        var eleSwapRow = parseInt(collisions[0].getAttribute('data-row'), 10);
        if (this.startRow < eleSwapRow) {
            direction = 1;
        }
        else if (this.startRow > eleSwapRow) {
            direction = 0;
        }
        if (!this.swapAvailability(collisions, element)) {
            return false;
        }
        var isSwappable = false;
        for (var count1 = 0; count1 < collisions.length; count1++) {
            if (collisions.length >= 1 && this.cloneObject[this.mainElement.id].row === this.oldRowCol[this.mainElement.id].row) {
                return false;
            }
        }
        var updatedRow = direction === 0 ?
            this.getCellInstance(this.mainElement.id).row + this.getCellInstance(this.mainElement.id).sizeY
            : this.startRow;
        for (var count = 0; count < collisions.length; count++) {
            var collideInstance = this.getCellInstance(collisions[count].id);
            var elementinstance = this.getCellInstance(element.id);
            var ignore = [];
            if (collideInstance.sizeY === 1 && ignore.indexOf(collisions[count]) === -1) {
                ignore.push(collisions[count]);
            }
            else if (collideInstance.sizeY > 1 && ignore.indexOf(collisions[count]) === -1) {
                if (direction === 1 && elementinstance.row === (this.cloneObject[collideInstance.id].row + collideInstance.sizeY - 1)) {
                    ignore.push(collisions[count]);
                }
                else if (direction === 0 && elementinstance.row === (this.cloneObject[collideInstance.id].row)) {
                    ignore.push(collisions[count]);
                }
                else {
                    return false;
                }
            }
            if (collideInstance.sizeY <= elementinstance.sizeY && ignore.indexOf(collisions[count]) === -1) {
                ignore.push(collisions[count]);
            }
            var swapCollision = void 0;
            ignore.push(this.mainElement);
            swapCollision = this.collisions(updatedRow, collideInstance.col, collideInstance.sizeX, collideInstance.sizeY, ignore);
            if (swapCollision.length > 0) {
                isSwappable = false;
                return isSwappable;
            }
            else {
                if (count === collisions.length - 1) {
                    isSwappable = true;
                }
                continue;
            }
        }
        return isSwappable;
    };
    SfDashboardLayout.prototype.swapAvailability = function (collisions, element) {
        var available = true;
        var eleModel = this.getCellInstance(element.id);
        for (var count = 0; count < collisions.length; count++) {
            var collideModel = this.getCellInstance(collisions[count].id);
            for (var i = 1; i < eleModel.sizeY; i++) {
                var excludeEle = [];
                excludeEle.push(element);
                excludeEle.push(collisions[count]);
                var collision = void 0;
                collision = this.collisions(eleModel.row + i, collideModel.col, collideModel.sizeX, collideModel.sizeY, excludeEle);
                if (collision.length > 0) {
                    available = false;
                    return false;
                }
                else {
                    continue;
                }
            }
        }
        return available;
    };
    SfDashboardLayout.prototype.swapItems = function (collisions, element, panelModel) {
        var _this = this;
        var direction;
        var swappedElements = [];
        swappedElements.push(element);
        var swapModel = this.getCellInstance(collisions[0].id);
        var eleSwapRow = swapModel.row;
        if (this.startRow < eleSwapRow) {
            direction = 1;
        }
        else if (this.startRow > eleSwapRow) {
            direction = 0;
        }
        var collisionItemsRow = direction === 0 ? eleSwapRow + panelModel.sizeY : this.startRow;
        if (!this.movePanelCalled) {
            var collisionInstance = this.getCellInstance(collisions[0].id);
            this.updatePanelPosition(panelModel.id, panelModel.col, (direction === 0 ?
                eleSwapRow : collisionItemsRow + collisionInstance.sizeY));
        }
        for (var count = 0; count < collisions.length; count++) {
            swappedElements.push(collisions[count]);
            this.updatePanelPosition(collisions[count].id, (this.getCellInstance(collisions[count].id)).col, collisionItemsRow);
        }
        this.updatePanelPosition(element.id, (this.getCellInstance(element.id)).col, panelModel.row);
        this.setPanelPosition(this.shadowEle, panelModel.row, panelModel.col);
        for (var i = 0; i < this.panels.length; i++) {
            this.oldRowCol[this.panels[i].id] = { row: this.panels[i].row, col: this.panels[i].col };
        }
        this.startRow = panelModel.row;
        this.updateOldRowColumn();
        swappedElements.forEach(function (item) {
            _this.cloneObject[item.id] = _this.oldRowCol[item.id];
            var itemModel = _this.getCellInstance(item.id);
            for (var i = 0; i < _this.sortedArray.length; i++) {
                if (!_this.sortedArray[i]) {
                    continue;
                }
                for (var j = 0; j < _this.sortedArray[i].length; j++) {
                    if (_this.sortedArray[i][j] === item) {
                        _this.sortedArray[i][j] = undefined;
                    }
                }
            }
            if (!_this.sortedArray[itemModel.row]) {
                _this.sortedArray[itemModel.row] = [];
            }
            _this.sortedArray[itemModel.row][itemModel.col] = item;
            _this.cloneArray = _this.sortedArray;
        });
    };
    SfDashboardLayout.prototype.resetLayout = function (model, element) {
        var collisions = this.collisions(model.row, model.col, model.sizeX, model.sizeY, this.mainElement);
        if (!this.mainElement || this.addPanelCalled || this.resizeCalled || this.movePanelCalled) {
            return collisions;
        }
        if (this.mainElement && this.oldRowCol !== this.cloneObject) {
            for (var i = 0; i < this.panels.length; i++) {
                var targetElement = document.getElementById(this.panels[i].id);
                if (targetElement === this.mainElement) {
                    continue;
                }
                var rowValue = this.cloneObject[targetElement.id].row;
                var colValue = this.cloneObject[targetElement.id].col;
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
    };
    SfDashboardLayout.prototype.updatedModels = function (collisionItems, panelModel, targetElement) {
        var _this = this;
        var removeableElement = [];
        if (!this.mainElement) {
            this.sortedPanel();
        }
        collisionItems.forEach(function (element) {
            _this.checkingElement = element;
            var model = _this.getCellInstance(element.id);
            var adjust = !_this.adjustmentAvailable(model.row, model.col, model.sizeY, model.sizeX, targetElement);
            if (model.sizeX > 1 && adjust) {
                for (var rowValue = model.row; rowValue < panelModel.row + panelModel.sizeY; rowValue++) {
                    var collisions = _this.collisions(rowValue, model.col, model.sizeX, model.sizeY, element);
                    collisions.forEach(function (item) {
                        if (collisionItems.indexOf(item) >= 0 && removeableElement.indexOf(item) === -1) {
                            removeableElement.push(item);
                        }
                    });
                }
            }
        });
        removeableElement.forEach(function (item) {
            if (removeableElement.indexOf(item) >= 0) {
                collisionItems.splice(collisionItems.indexOf(item), 1);
            }
        });
        return collisionItems;
    };
    SfDashboardLayout.prototype.checkForCompletePushing = function () {
        for (var i = 0; i < this.panels.length; i++) {
            if (this.collisionChecker[this.panels[i].id] && this.collisionChecker[this.panels[i].id] !== null) {
                this.overlapElement = [this.collisionChecker[this.panels[i].id].ele];
                var key = this.panels[i].id;
                this.updateRowColumn(this.collisionChecker[key].row, this.overlapElement, this.collisionChecker[key].srcEle);
            }
        }
    };
    SfDashboardLayout.prototype.updateRowColumn = function (row, ele, srcEle) {
        if (!srcEle) {
            return;
        }
        var srcElemodel = this.getCellInstance(srcEle.id);
        var eleSizeY = srcElemodel.sizeY;
        var eleRow = srcElemodel.row;
        this.overlapElementClone = this.overlapElement && !this.shouldRestrict ? this.overlapElement : this.overlapElement;
        for (var i = 0; i < this.overlapElementClone.length; i++) {
            if (this.overlapElementClone.length === 0) {
                return;
            }
            for (var i_1 = 0; i_1 < this.overlapElementClone.length; i_1++) {
                this.collisionChecker[this.overlapElementClone[i_1].id] = {
                    ele: this.overlapElementClone[i_1],
                    row: row,
                    srcEle: srcEle
                };
            }
            var updatedRow = eleRow + eleSizeY;
            var datamodel = this.getCellInstance(this.overlapElementClone[i].id);
            var collisionY = datamodel.sizeY;
            var collisionCol = datamodel.col;
            var collisionX = datamodel.sizeX;
            var colValue = void 0;
            var collisionModels = void 0;
            if (this.overlapSubElementClone.indexOf(srcEle) === -1) {
                this.overlapSubElementClone.push(srcEle);
            }
            if (this.overlapSubElementClone.indexOf(this.overlapElementClone[i]) === -1) {
                this.overlapSubElementClone.push(this.overlapElementClone[i]);
            }
            if (collisionY > 1 || collisionX > 1) {
                var overlapElementModel = this.getCellInstance(this.overlapElementClone[i].id);
                colValue = overlapElementModel.col;
                var ele_1 = document.getElementById(overlapElementModel.id);
                for (var k = overlapElementModel.row; k < eleRow + eleSizeY; k++) {
                    this.isSubValue = true;
                    var overlapModel = this.getCellInstance(overlapElementModel.id);
                    this.updatePanelPosition(overlapModel.id, overlapModel.col, overlapElementModel.row + 1);
                    this.updateCollisionChecked(ele_1);
                    this.oldRowCol[(ele_1.id)] = { row: overlapElementModel.row, col: colValue };
                    var panelModels = this.getCellInstance(ele_1.id);
                    var eleRow_1 = panelModels.row;
                    var eleCol = panelModels.col;
                    var sizeX = panelModels.sizeX;
                    var sizeY = panelModels.sizeY;
                    var excludeElements = [];
                    excludeElements.push(ele_1);
                    excludeElements.push(srcEle);
                    collisionModels = this.collisions(eleRow_1, eleCol, sizeX, sizeY, excludeElements);
                    if (this.mainElement && collisionModels.indexOf(this.mainElement) !== -1) {
                        collisionModels.splice(collisionModels.indexOf(this.mainElement), 1);
                    }
                    this.collisionPanel(collisionModels, eleCol, eleRow_1, ele_1);
                }
                this.isSubValue = false;
            }
            else {
                if (this.addPanelCalled) {
                    this.addPanelCalled = false;
                }
                var excludeEle = [];
                excludeEle.push(this.overlapElementClone[i]);
                excludeEle.push(srcEle);
                collisionModels = this.collisions(updatedRow, collisionCol, collisionX, collisionY, excludeEle);
                if (this.mainElement && collisionModels.indexOf(this.mainElement) !== -1) {
                    collisionModels.splice(collisionModels.indexOf(this.mainElement), 1);
                }
                var dataModel = this.getCellInstance(this.overlapElementClone[i].id);
                colValue = dataModel.col;
                this.updatePanelPosition(dataModel.id, colValue, updatedRow);
                this.updateCollisionChecked(this.overlapElementClone[i]);
                this.oldRowCol[(this.overlapElementClone[i].id)] = { row: updatedRow, col: colValue };
                this.collisionPanel(collisionModels, colValue, updatedRow, this.overlapElementClone[i]);
            }
        }
    };
    SfDashboardLayout.prototype.updateCollisionChecked = function (item) {
        for (var count = 0; count < Object.keys(this.collisionChecker).length; count++) {
            this.collisionChecker[item.id] = null;
        }
    };
    SfDashboardLayout.prototype.collisionPanel = function (collisionModels, colValue, updatedRow, clone) {
        var _this = this;
        if (collisionModels.length > 0) {
            this.overlapElement = [];
            this.shouldRestrict = true;
            collisionModels.forEach(function (item1) {
                _this.overlapElement.push(item1);
            });
            var dataModel = this.getCellInstance(clone.id);
            var overlapElementRow1 = dataModel.row;
            for (var m = 0; m < this.overlapElement.length; m++) {
                this.updateRowColumn(overlapElementRow1, this.overlapElement, clone);
            }
            this.shouldRestrict = false;
        }
        else {
            if (!this.addPanelCalled) {
                this.sortedPanel();
            }
            if (this.overlapSubElementClone.length > 0) {
                for (var p = 0; p < this.overlapSubElementClone.length; p++) {
                    var overlapModel = this.getCellInstance(this.overlapSubElementClone[p].id);
                    var rowVal = overlapModel.row;
                    var colValue_1 = overlapModel.col;
                    var sizeX = overlapModel.sizeX;
                    var sizeY = overlapModel.sizeY;
                    var collisionModels1 = void 0;
                    collisionModels1 = this.collisions(rowVal, colValue_1, sizeX, sizeY, this.overlapSubElementClone);
                    if (this.mainElement && collisionModels1.indexOf(this.mainElement) !== -1) {
                        collisionModels1.splice(collisionModels1.indexOf(this.mainElement), 1);
                    }
                    collisionModels1.forEach(function (item1) {
                        _this.overlapElement.push(item1);
                    });
                    if (collisionModels1.length > 0) {
                        this.updateRowColumn(rowVal, this.overlapElement, this.overlapSubElementClone[p]);
                    }
                }
            }
            this.overlapSubElementClone = [];
        }
    };
    SfDashboardLayout.prototype.collisions = function (row, col, sizeX, sizeY, ignore) {
        var items = [];
        if (!sizeX || !sizeY) {
            sizeX = sizeY = 1;
        }
        if (ignore && !(ignore instanceof Array)) {
            ignore = [ignore];
        }
        var item;
        for (var h = 0; h < sizeY; ++h) {
            for (var w = 0; w < sizeX; ++w) {
                item = this.getPanel(row + h, col + w, ignore);
                if (item && (!ignore || ignore.indexOf(document.getElementById(item.id)) === -1) &&
                    items.indexOf(document.getElementById(item.id)) === -1) {
                    items.push(document.getElementById(item.id));
                }
            }
        }
        return items;
    };
    
    SfDashboardLayout.prototype.getPanel = function (row, column, excludeItems) {
        if (excludeItems && !(excludeItems instanceof Array)) {
            excludeItems = [excludeItems];
        }
        var sizeY = 1;
        while (row > -1) {
            var sizeX = 1;
            var col = column;
            while (col > -1) {
                var items = this.sortedArray[row];
                if (items) {
                    var item = items[col];
                    if (!sf.base.isNullOrUndefined(item)) {
                        var model = this.getCellInstance(item.id);
                        if (item && (!excludeItems ||
                            excludeItems.indexOf(item) === -1) && model.sizeX >= sizeX
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
    
    SfDashboardLayout.prototype.renderCell = function (panel) {
        var cellElement;
        cellElement = document.getElementById(panel.id);
        return cellElement;
    };
    SfDashboardLayout.prototype.sortedPanel = function () {
        this.sortedArray = [];
        for (var i = 0, l = this.renderedElement.length; i < l; ++i) {
            this.sortItem(this.renderedElement[i]);
        }
    };
    SfDashboardLayout.prototype.updatePanels = function () {
        this.moveItemsUpwards();
        this.updateOldRowColumn();
        this.sortedPanel();
    };
    SfDashboardLayout.prototype.sortItem = function (item, rowValue, columnValue) {
        this.overlapElement = [];
        var datamodel = this.getCellInstance(item.id);
        var column = datamodel.col;
        var row = datamodel.row;
        if (!this.sortedArray[row]) {
            this.sortedArray[row] = [];
        }
        this.sortedArray[row][column] = item;
        if (item !== undefined && rowValue !== undefined && columnValue !== undefined) {
            if (this.oldRowCol[item.id] !== undefined && this.oldRowCol[item.id].row !== null &&
                typeof this.oldRowCol[item.id].col !== 'undefined') {
                {
                    var oldRow = this.sortedArray[this.oldRowCol[item.id].row];
                    if (!sf.base.isNullOrUndefined(oldRow)) {
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
            var panelModel = this.getCellInstance(item.id);
            this.updatePanelPosition(panelModel.id, columnValue, rowValue);
            this.sortedPanel();
        }
    };
    SfDashboardLayout.prototype.updateOldRowColumn = function () {
        this.oldRowCol = {};
        for (var i = 0; i < this.panels.length; i++) {
            var id = this.panels[i].id;
            if (document.getElementById(id)) {
                var row = this.panels[i].row;
                var col = this.panels[i].col;
                this.oldRowCol[this.panels[i].id] = { row: row, col: col };
            }
            else {
                continue;
            }
        }
    };
    SfDashboardLayout.prototype.getCellInstance = function (idValue) {
        var currentCellInstance;
        for (var i = 0; i < this.panels.length; i++) {
            if (this.panels[i].id === idValue) {
                currentCellInstance = this.panels[i];
                break;
            }
        }
        return currentCellInstance;
    };
    SfDashboardLayout.prototype.getRowElements = function (base) {
        var rowElements = [];
        for (var i = 0; i < base.length; i++) {
            rowElements.push(base[i]);
        }
        return rowElements;
    };
    SfDashboardLayout.prototype.adjustmentAvailable = function (row, col, sizeY, sizeX, targetElement) {
        this.leftAdjustable = undefined;
        this.rightAdjustable = undefined;
        var isAdjustable = false;
        var leftSpacing = [];
        var rightSpacing = [];
        var rowElement = [];
        this.topAdjustable = undefined;
        var datamodel = this.getCellInstance(targetElement.id);
        var eleSizeX = datamodel.sizeX;
        var eleCol = datamodel.col;
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
            }
            else {
                this.leftAdjustable = false;
                rightSpacing = this.rightWardsSpaceChecking(rowElement, col, targetElement);
                this.rightAdjustable = rightSpacing.length > 0 ?
                    this.isRightAdjustable(rightSpacing, targetElement, row, col, sizeX, sizeY) : false;
                if (this.spacedColumnValue !== eleSizeX + eleCol) {
                    this.rightAdjustable = false;
                }
            }
        }
        else {
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
            var endRow = this.getCellInstance(targetElement.id).row;
            var topCheck = false;
            if (this.startRow !== endRow) {
                topCheck = true;
            }
            for (var rowValue = row; rowValue >= 0; rowValue--) {
                var element = (this.getCellInstance(targetElement.id).sizeY > 1 && topCheck) ?
                    this.checkingElement : targetElement;
                if ((rowValue !== endRow) && (rowValue === endRow - sizeY) &&
                    this.collisions(rowValue, col, sizeX, sizeY, element).length === 0) {
                    topCheck = false;
                    this.topAdjustable = true;
                    this.spacedRowValue = sf.base.isNullOrUndefined(this.spacedRowValue) ? rowValue : this.spacedRowValue;
                    this.spacedColumnValue = col;
                }
            }
        }
        if (this.rightAdjustable || this.leftAdjustable || this.topAdjustable) {
            isAdjustable = true;
            if (sf.base.isNullOrUndefined(this.spacedRowValue)) {
                this.spacedRowValue = row;
            }
        }
        return isAdjustable;
    };
    SfDashboardLayout.prototype.updatePanelPosition = function (id, col, row) {
        if (this.panels.length > 0) {
            for (var i = 0; i < this.panels.length; i++) {
                if (this.panels[i].id === id) {
                    if (!sf.base.isNullOrUndefined(col)) {
                        this.panels[i].col = col;
                    }
                    if (!sf.base.isNullOrUndefined(row)) {
                        this.panels[i].row = row;
                    }
                }
            }
        }
        if (this.isRenderComplete) {
            var clonedPanels = this.checkForChanges();
            this.panelsInitialModel = this.cloneModels(this.panels);
            if (clonedPanels.length > 0) {
                if (this.isChanged && (this.changedId.indexOf(id) === -1)) {
                    this.changedId.push(id);
                }
                this.dotnetRef.invokeMethodAsync('UpdatedPanelsValues', clonedPanels);
            }
        }
    };
    SfDashboardLayout.prototype.rightWardsSpaceChecking = function (rowElements, col, targetElement) {
        var _this = this;
        var columns = [];
        var spacedColumns = [];
        rowElements.forEach(function (element) {
            var model = _this.getCellInstance(element.id);
            var columnValue = model.col;
            var sizeXValue = model.sizeX;
            if (col < _this.columns && columnValue >= col) {
                if (sizeXValue > 1) {
                    for (var i = columnValue; i < columnValue + sizeXValue; i++) {
                        columns.push(i);
                    }
                }
                else {
                    columns.push(columnValue);
                }
            }
        });
        if (columns.length > 0) {
            for (var i = col + 1; i <= this.columns - 1; i++) {
                if (columns.indexOf(i) === -1 && i !== col) {
                    if (spacedColumns.indexOf(i) === -1) {
                        spacedColumns.push(i);
                    }
                }
            }
        }
        var occupiedValues = this.getOccupiedColumns(targetElement);
        occupiedValues.forEach(function (colValue) {
            if (colValue > col && spacedColumns.indexOf(colValue) !== -1) {
                spacedColumns.splice(spacedColumns.indexOf(colValue), 1);
            }
        });
        var eleOccupiedValues = this.getOccupiedColumns(this.checkingElement);
        eleOccupiedValues.forEach(function (col) {
            var datamodel = _this.getCellInstance(targetElement.id);
            if (col > datamodel.col && occupiedValues.indexOf(col) === -1 &&
                spacedColumns.indexOf(col) === -1) {
                spacedColumns.push(col);
            }
        });
        spacedColumns = spacedColumns.sort(function (next, previous) { return next - previous; });
        return spacedColumns;
    };
    SfDashboardLayout.prototype.isRightAdjustable = function (spacing, target, row, col, sizeX, sizeY) {
        var isRightAdjudtable;
        if (sizeX === 1 && sizeY === 1 && spacing.length > 0) {
            this.spacedColumnValue = spacing[0];
            isRightAdjudtable = true;
        }
        else if (sizeX > 1 && sizeY === 1) {
            isRightAdjudtable = this.isXSpacingAvailable(spacing, sizeX);
        }
        else if (sizeY > 1) {
            if (sizeX === 1) {
                var xAdjust = void 0;
                if (spacing.length >= 1) {
                    xAdjust = true;
                }
                if (xAdjust) {
                    for (var i = 0; i < spacing.length; i++) {
                        var collisionValue = this.collisions(row, spacing[i], sizeX, sizeY, this.checkingElement);
                        for (var collision = 0; collision < collisionValue.length; collision++) {
                            var dataModel = this.getCellInstance(target.id);
                            if (dataModel.col !== spacing[i]) {
                                collisionValue.splice(collisionValue.indexOf(collisionValue[collision]), 1);
                            }
                        }
                        if (collisionValue.length === 0) {
                            isRightAdjudtable = true;
                            this.spacedColumnValue = spacing[i];
                            return isRightAdjudtable;
                        }
                        else {
                            isRightAdjudtable = false;
                        }
                    }
                }
            }
            else {
                isRightAdjudtable = this.replacable(spacing, sizeX, row, sizeY, target);
            }
        }
        return isRightAdjudtable;
    };
    SfDashboardLayout.prototype.isXSpacingAvailable = function (spacing, sizeX) {
        var isSpaceAvailable = false;
        var subSpacingColumns = [];
        for (var i = 0; i < spacing.length; i++) {
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
                    this.spacedColumnValue = subSpacingColumns.sort(function (next, previous) { return next - previous; })[0];
                    if (this.spacedColumnValue < 0) {
                        this.spacedColumnValue = 1;
                    }
                    return isSpaceAvailable;
                }
            }
            else {
                subSpacingColumns = [];
                continue;
            }
        }
        return isSpaceAvailable;
    };
    SfDashboardLayout.prototype.leftWardsSpaceChecking = function (rowElements, col, targetElement) {
        var _this = this;
        var spacedColumns = [];
        var columns = [];
        rowElements.forEach(function (element) {
            var model = _this.getCellInstance(element.id);
            var colValue = model.col;
            var xValue = model.sizeX;
            if (col <= _this.columns && colValue <= col) {
                if (xValue > 1) {
                    for (var i = colValue; i < colValue + xValue; i++) {
                        columns.push(i);
                    }
                }
                else {
                    columns.push(colValue);
                }
            }
        });
        if (columns.length > 0) {
            for (var i = 0; i <= col; i++) {
                if (columns.indexOf(i) === -1 && i !== col) {
                    if (spacedColumns.indexOf(i) === -1) {
                        spacedColumns.push(i);
                    }
                }
            }
        }
        var occupiedValues = this.getOccupiedColumns(targetElement);
        occupiedValues.forEach(function (colValue) {
            if (colValue < col && spacedColumns.indexOf(colValue) !== -1) {
                spacedColumns.splice(spacedColumns.indexOf(colValue), 1);
            }
        });
        var eleOccupiedValues = this.getOccupiedColumns(this.checkingElement);
        eleOccupiedValues.forEach(function (col) {
            var datamodel = _this.getCellInstance(targetElement.id);
            if (col < datamodel.col && occupiedValues.indexOf(col) === -1 &&
                spacedColumns.indexOf(col) === -1) {
                spacedColumns.push(col);
            }
        });
        spacedColumns = spacedColumns.sort(function (next, prev) { return next - prev; });
        spacedColumns = spacedColumns.reverse();
        return spacedColumns;
    };
    SfDashboardLayout.prototype.isLeftAdjustable = function (spaces, target, row, col, sizeX, sizeY) {
        var isLeftAdjudtable;
        if (sizeX === 1 && sizeY === 1 && spaces.length > 0) {
            this.spacedColumnValue = spaces[0];
            isLeftAdjudtable = true;
        }
        else if (sizeX > 1 && sizeY === 1) {
            isLeftAdjudtable = this.isXSpacingAvailable(spaces, sizeX);
        }
        else if (sizeY > 1) {
            if (sizeX === 1) {
                var xAdjust = void 0;
                if (spaces.length >= 1) {
                    xAdjust = true;
                }
                if (xAdjust) {
                    for (var i = 0; i < spaces.length; i++) {
                        var collisionValue = this.collisions(row, spaces[i], sizeX, sizeY, this.checkingElement);
                        if (collisionValue.length === 0) {
                            this.spacedColumnValue = spaces[i];
                            isLeftAdjudtable = true;
                            return isLeftAdjudtable;
                        }
                        else {
                            isLeftAdjudtable = false;
                        }
                    }
                }
            }
            else {
                isLeftAdjudtable = this.replacable(spaces, sizeX, row, sizeY, target);
            }
        }
        return isLeftAdjudtable;
    };
    SfDashboardLayout.prototype.replacable = function (spacing, sizeX, row, sizeY, targetElement) {
        var isRightAdjudtable;
        var updatedCollision = [];
        for (var j = 0; j < spacing.length; j++) {
            var xAdjust = this.isXSpacingAvailable(spacing, sizeX);
            if (xAdjust) {
                var exclusions = [];
                exclusions.push(this.checkingElement);
                exclusions.push(targetElement);
                if (updatedCollision.length === 0) {
                    isRightAdjudtable = true;
                    this.spacedColumnValue = this.spacedColumnValue;
                    return isRightAdjudtable;
                }
                else {
                    isRightAdjudtable = false;
                }
            }
        }
        return isRightAdjudtable;
    };
    SfDashboardLayout.prototype.getOccupiedColumns = function (element) {
        var occupiedItems = [];
        var datamodel = this.getCellInstance(element.id);
        var sizeX = datamodel.sizeX;
        var col = datamodel.col;
        for (var i = col; (i < col + sizeX && i <= this.columns); i++) {
            occupiedItems.push(i);
        }
        return occupiedItems;
    };
    SfDashboardLayout.prototype.moveItemsUpwards = function () {
        if (!this.allowFloating) {
            return;
        }
        for (var rowIndex = 0, l = this.sortedArray.length; rowIndex < l; ++rowIndex) {
            var columns = this.sortedArray[rowIndex];
            if (!columns) {
                continue;
            }
            for (var colIndex = 0, len = columns.length; colIndex < len; ++colIndex) {
                var item = columns[colIndex];
                if (item) {
                    this.moveItemUpwards(item);
                }
            }
        }
    };
    
    SfDashboardLayout.prototype.moveItemUpwards = function (item) {
        if (!this.allowFloating || item === this.mainElement) {
            return;
        }
        var colIndex = this.getCellInstance(item.id).col;
        var sizeY = parseInt(item.getAttribute('data-sizeY'), 10);
        var sizeX = parseInt(item.getAttribute('data-sizeX'), 10);
        var availableRow = null;
        var availableColumn = null;
        var rowIndex = parseInt(item.getAttribute('data-row'), 10) - 1;
        while (rowIndex > -1) {
            var items = this.collisions(rowIndex, colIndex, sizeX, sizeY, item);
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
    };
    SfDashboardLayout.prototype.enableDraggingContent = function (collections) {
        var _this = this;
        for (var i = 0; i < collections.length; i++) {
            var abortArray = ['.e-resize', '.' + DRAGRESTRICT];
            var cellElement = collections[i];
            {
                this.dragobj = new sf.base.Draggable(cellElement, {
                    preventDefault: false,
                    clone: false,
                    dragArea: this.element,
                    isDragScroll: true,
                    handle: this.draggableHandle ? this.draggableHandle : '.e-panel',
                    abort: abortArray,
                    dragStart: this.onDraggingStart.bind(this),
                    dragStop: function (args) {
                        var model = _this.getCellInstance(_this.mainElement.id);
                        if (_this.allowPushing &&
                            _this.collisions(model.row, model.col, model.sizeX, model.sizeY, _this.mainElement).length > 0) {
                            _this.setHolderPosition(args);
                            _this.updatePanelPosition(model.id, model.col, model.row);
                            _this.updatePanelLayout(_this.mainElement, model);
                        }
                        else {
                            _this.updatePanelPosition(model.id, model.col, model.row);
                        }
                        _this.mainElement = null;
                        var item = _this.getPanelBase(args);
                        if (_this.shadowEle) {
                            sf.base.detach(_this.shadowEle);
                        }
                        sf.base.removeClass([_this.element], [PREVENTSELECT]);
                        sf.base.removeClass([args.element], [DRAGGING]);
                        _this.shadowEle = null;
                        args.element.classList.remove('e-dragging');
                        var row = _this.getRowColumnDragValues(args)[0];
                        var col = _this.getRowColumnDragValues(args)[1];
                        var panelModel = _this.getCellInstance(args.element.id);
                        if (_this.allowPushing &&
                            _this.collisions(row, col, panelModel.sizeX, panelModel.sizeY, document.getElementById(item.id)).length === 0) {
                            _this.oldRowCol[args.element.id].row = row;
                            _this.oldRowCol[args.element.id].col = col;
                            _this.updatePanelPosition(args.element.id, col, row);
                            _this.sortedPanel();
                        }
                        else {
                            var newValues = _this.getCellInstance(args.element.id);
                            _this.updatePanelPosition(newValues.id, newValues.col, newValues.row);
                            _this.sortedPanel();
                        }
                        var panelInstance = _this.getCellInstance(args.element.id);
                        _this.setPanelPosition(args.element, panelInstance.row, panelInstance.col);
                        _this.updatePanels();
                        _this.updateCloneArrayObject();
                        _this.dragStopEventArgs = { event: args.event, element: args.element };
                        _this.dotnetRef.invokeMethodAsync('TriggerDragStop', args.element.id, _this.changedId);
                        _this.isChanged = false;
                        _this.changedId = [];
                        _this.resizeEvents();
                        _this.updateDragArea();
                    },
                    drag: function (args) {
                        _this.draggedEventArgs = {
                            event: args.event,
                            element: args.element,
                            target: sf.base.closest((args.target), '.e-panel')
                        };
                        //this.dotnetRef.invokeMethodAsync('TriggerDraging', args.element.id, 'Dragging');
                        _this.onDragStart(args);
                    }
                });
                if (this.dragCollection.indexOf(this.dragobj) === -1) {
                    this.dragCollection.push(this.dragobj);
                }
            }
        }
    };
    
    SfDashboardLayout.prototype.getPanelBase = function (args) {
        var item;
        for (var i = 0; i < this.panelElements.length; i++) {
            if (this.panelElements[i].id === ((args.element
                && args.element.id) || args)) {
                item = this.panelElements[i];
            }
        }
        return item;
    };
    SfDashboardLayout.prototype.updateCloneArrayObject = function () {
        this.cloneArray = this.sortedArray;
        this.cloneObject = JSON.parse(JSON.stringify(this.oldRowCol));
    };
    SfDashboardLayout.prototype.getRowColumnDragValues = function (args) {
        var value = [];
        var elementTop = parseFloat(args.element.style.top);
        var elementLeft = parseFloat(args.element.style.left);
        var row = Math.round(elementTop / (this.getCellSize()[1] + this.cellSpacing[1]));
        var col = Math.round(elementLeft / (this.getCellSize()[0] + +this.cellSpacing[0]));
        value = [row, col];
        return value;
    };
    SfDashboardLayout.prototype.onDragStart = function (args) {
        var endCol;
        var endRow;
        var dragCol;
        var col = dragCol = this.getRowColumnDragValues(args)[1];
        var row = this.getRowColumnDragValues(args)[0];
        if (col < 0 || row < 0) {
            return;
        }
        var panelModel = this.getCellInstance(args.element.id);
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
                    var model = panelModel;
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
    };
    SfDashboardLayout.prototype.bindEvents = function () {
        window.addEventListener('resize', this.refresh.bind(this));
        this.resizeEvents();
    };
    SfDashboardLayout.prototype.refresh = function () {
        this.panelsSizeY = 0;
        this.updateDragArea();
        this.isMediaQuery = this.checkMediaQuery();
        if (!this.checkMediaQuery()) {
            if (this.element.classList.contains(RESPONSIVE)) {
                sf.base.removeClass([this.element], [RESPONSIVE]);
            }
            this.element.classList.add('e-responsive');
            this.calculateCellSizeValue();
        }
        this.dotnetRef.invokeMethodAsync('CalculateSize', this.calculateCellSize(), this.isMediaQuery, true);
        this.resizeEvents();
        this.checkDragging(this.dragCollection);
    };
    SfDashboardLayout.prototype.checkDragging = function (dragCollection) {
        for (var i = 0; i < dragCollection.length; i++) {
            dragCollection[i].destroy();
        }
        if (!this.checkMediaQuery() && this.allowDragging) {
            this.enableDraggingContent(this.panelElements);
        }
    };
    SfDashboardLayout.prototype.resizeEvents = function () {
        if (this.allowResizing) {
            var panelElements = this.element.querySelectorAll('.e-panel .e-resize');
            for (var i = 0; i < panelElements.length; i++) {
                var eventName = (sf.base.Browser.info.name === 'msie') ? 'mousedown pointerdown' : 'mousedown';
                sf.base.EventHandler.add(panelElements[i], eventName, this.downResizeHandler, this);
                if (sf.base.Browser.info.name !== 'msie') {
                    sf.base.EventHandler.add(panelElements[i], 'touchstart', this.touchDownResizeHandler, this);
                }
            }
        }
    };
    SfDashboardLayout.prototype.touchDownResizeHandler = function (event) {
        this.downHandler(event);
        this.lastMouseX = event.changedTouches[0].pageX;
        this.lastMouseY = event.changedTouches[0].pageY;
        if (!this.isMouseMoveBound) {
            sf.base.EventHandler.add(document, 'touchmove', this.touchMoveResizeHandler, this);
            this.isMouseMoveBound = true;
        }
        if (!this.isMouseUpBound) {
            sf.base.EventHandler.add(document, 'touchend', this.upResizeHandler, this);
            this.isMouseUpBound = true;
        }
    };
    SfDashboardLayout.prototype.upResizeHandler = function (event) {
        if (sf.base.isNullOrUndefined(this.downTarget)) {
            return;
        }
        this.upTarget = this.downTarget;
        var resizeElement = sf.base.closest((this.upTarget), '.e-panel');
        var args = { event: event, element: resizeElement, isInteracted: true, name: 'ResizeStop' };
        if (resizeElement) {
            sf.base.addClass([resizeElement], 'e-panel-transition');
            var moveEventName = (sf.base.Browser.info.name === 'msie') ? 'mousemove pointermove' : 'mousemove';
            var upEventName = (sf.base.Browser.info.name === 'msie') ? 'mouseup pointerup' : 'mouseup';
            sf.base.EventHandler.remove(document, moveEventName, this.moveResizeHandler);
            sf.base.EventHandler.remove(document, upEventName, this.upResizeHandler);
            if (sf.base.Browser.info.name !== 'msie') {
                sf.base.EventHandler.remove(document, 'touchmove', this.touchMoveResizeHandler);
                sf.base.EventHandler.remove(document, 'touchend', this.upResizeHandler);
            }
            this.isMouseUpBound = false;
            this.isMouseMoveBound = false;
            if (this.shadowEle) {
                sf.base.detach(this.shadowEle);
            }
            this.shadowEle = null;
            var panelModel = this.getCellInstance(resizeElement.getAttribute('id'));
            this.updatePanelPosition(panelModel.id, panelModel.col, panelModel.row);
        }
        sf.base.removeClass([resizeElement], [DRAGGING]);
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
    };
    SfDashboardLayout.prototype.moveResizeHandler = function (event) {
        this.updateMaxTopLeft(event);
        var movedElement = sf.base.closest((this.moveTarget), '.e-panel');
        if (this.lastMouseX === event.pageX || this.lastMouseY === event.pageY) {
            return;
        }
        this.updateResizeElement(movedElement);
        var panelModel = this.getCellInstance(movedElement.getAttribute('id'));
        this.mouseX = event.pageX;
        this.mouseY = event.pageY;
        var diffY = this.mouseY - this.lastMouseY + this.mOffY;
        var diffX = this.mouseX - this.lastMouseX + this.mOffX;
        this.mOffX = this.mOffY = 0;
        this.lastMouseY = this.mouseY;
        this.lastMouseX = this.mouseX;
        this.resizingPanel(movedElement, panelModel, diffX, diffY);
    };
    SfDashboardLayout.prototype.getMinWidth = function (item) {
        return (item.minSizeX) * this.getCellSize()[0];
    };
    
    SfDashboardLayout.prototype.getMaxWidth = function (item) {
        return (item.maxSizeX) * this.getCellSize()[0];
    };
    
    SfDashboardLayout.prototype.getMinHeight = function (item) {
        return (item.minSizeY) * this.getCellSize()[1];
    };
    
    SfDashboardLayout.prototype.getMaxHeight = function (item) {
        return (item.maxSizeY) * this.getCellSize()[1];
    };
    
    /* istanbul ignore next */
    SfDashboardLayout.prototype.resizingPanel = function (targetElement, panelModel, currentX, currentY) {
        var oldSizeX = this.getCellInstance(targetElement.id).sizeX;
        var oldSizeY = this.getCellInstance(targetElement.id).sizeY;
        var lengthY = currentY;
        var lengthX = currentX;
        if (this.handleClass.indexOf('north') >= 0) {
            if (this.elementHeight - lengthY < this.getMinHeight(panelModel)) {
                currentY = this.elementHeight - this.getMinHeight(panelModel);
                this.mOffY = lengthY - currentY;
            }
            else if (panelModel.maxSizeY && this.elementHeight - lengthY > this.getMaxHeight(panelModel)) {
                currentY = this.elementHeight - this.getMaxHeight(panelModel);
                this.mOffY = lengthY - currentY;
            }
            else if (this.elementY + lengthY < this.minTop) {
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
            }
            else if (panelModel.maxSizeY && this.elementHeight + lengthY > this.getMaxHeight(panelModel)) {
                currentY = this.getMaxHeight(panelModel) - this.elementHeight;
                this.mOffY = lengthY - currentY;
            }
            else if (this.elementY + this.elementHeight + lengthY > this.maxTop) {
                currentY = this.maxTop - this.elementY - this.elementHeight;
                this.mOffY = lengthY - currentY;
            }
            this.elementHeight += currentY;
        }
        if (this.handleClass.indexOf('west') >= 0) {
            if (this.elementWidth - lengthX < this.getMinWidth(panelModel)) {
                currentX = this.elementWidth - this.getMinWidth(panelModel);
                this.mOffX = lengthX - currentX;
            }
            else if (panelModel.maxSizeX && this.elementWidth - lengthX > this.getMaxWidth(panelModel)) {
                currentX = this.elementWidth - this.getMaxWidth(panelModel);
                this.mOffX = lengthX - currentX;
            }
            else if (this.elementX + lengthX < this.minLeft) {
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
            }
            else if (panelModel.maxSizeX && this.elementWidth + lengthX > this.getMaxWidth(panelModel)) {
                currentX = this.getMaxWidth(panelModel) - this.elementWidth;
                this.mOffX = lengthX - currentX;
            }
            else if (this.elementX + this.elementWidth + lengthX > this.maxLeft) {
                currentX = this.maxLeft - this.elementX - this.elementWidth;
                this.mOffX = lengthX - currentX;
            }
            this.elementWidth += currentX;
        }
        var item = this.getResizeRowColumn(panelModel, this.moveTarget);
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
            var model = this.getCellInstance(targetElement.id);
            this.updatePanelSize(targetElement.id, model.sizeX, model.sizeY);
            this.updatePanelPosition(targetElement.id, model.col, model.row);
            this.mainElement = targetElement;
            this.updatePanelLayout(targetElement, this.getCellInstance(targetElement.id));
            this.updateOldRowColumn();
            this.sortedPanel();
        }
    };
    SfDashboardLayout.prototype.pixelsToColumns = function (pixels, isCeil) {
        var curColWidth = this.cellSize[0];
        if (isCeil) {
            return Math.ceil(pixels / curColWidth);
        }
        else {
            return Math.floor(pixels / curColWidth);
        }
    };
    SfDashboardLayout.prototype.pixelsToRows = function (pixels, isCeil) {
        if (isCeil) {
            return Math.round(pixels / this.cellSize[1]);
        }
        else {
            return Math.round(pixels / (this.cellSize[1] + this.cellSpacing[0]));
        }
    };
    SfDashboardLayout.prototype.getResizeRowColumn = function (item, e) {
        var isChanged = false;
        var col = item.col;
        if (['e-west', 'e-south-west'].indexOf(this.handleClass) !== -1) {
            col = this.pixelsToColumns(this.elementX, false);
        }
        var row = item.row;
        if (['e-north'].indexOf(this.handleClass) !== -1) {
            row = this.pixelsToRows(this.elementY, false);
            if (this.previousRow !== row) {
                this.previousRow = row;
                isChanged = true;
            }
        }
        var sizeX = item.sizeX;
        if (['e-north', 'e-south'].indexOf(this.handleClass) === -1) {
            sizeX = this.pixelsToColumns(this.elementWidth - (sizeX) * this.cellSpacing[1], true);
        }
        var sizeY = item.sizeY;
        if (['e-east', 'e-west'].indexOf(this.handleClass) === -1) {
            if (this.handleClass === 'e-north' ? isChanged : true) {
                sizeY = this.pixelsToRows(this.elementHeight - (sizeY) * this.cellSpacing[0], true);
            }
        }
        if (item.col + item.sizeX > this.columns) {
            item.sizeX = item.sizeX - 1;
        }
        var canOccupy = row > -1 && col > -1 && sizeX + col <= this.columns && sizeY + row <= this.rows;
        if (canOccupy && (this.collisions(row, col, sizeX, sizeY, this.getPanelBase(item.id)).length === 0)
            || this.allowPushing) {
            this.updatePanelSize(item.id, sizeX, sizeY);
            this.updatePanelPosition(item.id, col, row);
        }
        return item;
    };
    SfDashboardLayout.prototype.touchMoveResizeHandler = function (event) {
        this.updateMaxTopLeft(event);
        var targetElement = sf.base.closest((this.moveTarget), '.e-panel');
        if (this.lastMouseX === event.changedTouches[0].pageX || this.lastMouseY === event.changedTouches[0].pageY) {
            return;
        }
        this.updateResizeElement(targetElement);
        var panelModel = this.getCellInstance(targetElement.getAttribute('id'));
        this.mouseX = event.changedTouches[0].pageX;
        this.mouseY = event.changedTouches[0].pageY;
        var diffX = this.mouseX - this.lastMouseX + this.mOffX;
        var diffY = this.mouseY - this.lastMouseY + this.mOffY;
        this.mOffX = this.mOffY = 0;
        this.lastMouseX = this.mouseX;
        this.lastMouseY = this.mouseY;
        this.resizingPanel(targetElement, panelModel, diffX, diffY);
    };
    SfDashboardLayout.prototype.updateResizeElement = function (targetElement) {
        this.maxLeft = this.element.offsetWidth - 1;
        this.maxTop = this.cellSize[1] * this.maxRows - 1;
        sf.base.removeClass([targetElement], 'e-panel-transition');
        sf.base.addClass([targetElement], [DRAGGING]);
        var handleArray = [EAST, WEST, NORTH, SOUTH, SOUTHEAST, NORTHEAST, NORTHWEST, SOUTHWEST];
        for (var i = 0; i < this.moveTarget.classList.length; i++) {
            if (handleArray.indexOf(this.moveTarget.classList[i]) !== -1) {
                this.handleClass = (this.moveTarget.classList[i]);
            }
        }
    };
    SfDashboardLayout.prototype.updateMaxTopLeft = function (event) {
        var _this = this;
        this.moveTarget = this.downTarget;
        var targetElement = sf.base.closest((this.moveTarget), '.e-panel');
        var args = { event: event, element: targetElement, isInteracted: true, name: 'Resizing' };
        // tslint:disable-next-line
        this.resizeTimeCount = setTimeout(function () { return _this.resizeCall(args.isInteracted, targetElement.id, 'Resizing'); }, 100);
    };
    SfDashboardLayout.prototype.resizeCall = function (isInteracted, id, name) {
        if ((this.isResizing && this.resizeTimeCount > 100) || this.resizeTimeCount === undefined) {
            this.dotnetRef.invokeMethodAsync('TriggerResizeStart', isInteracted, id, name);
            this.resizeTimeCount = 1;
        }
    };
    SfDashboardLayout.prototype.downResizeHandler = function (event) {
        this.downHandler(event);
        this.lastMouseX = event.pageX;
        this.lastMouseY = event.pageY;
        var moveEventName = (sf.base.Browser.info.name === 'msie') ? 'mousemove pointermove' : 'mousemove';
        var upEventName = (sf.base.Browser.info.name === 'msie') ? 'mouseup pointerup' : 'mouseup';
        if (!this.isMouseMoveBound) {
            sf.base.EventHandler.add(document, moveEventName, this.moveResizeHandler, this);
            this.isMouseMoveBound = true;
        }
        if (!this.isMouseUpBound) {
            sf.base.EventHandler.add(document, upEventName, this.upResizeHandler, this);
            this.isMouseUpBound = true;
        }
    };
    
    SfDashboardLayout.prototype.downHandler = function (event) {
        this.resizeCalled = false;
        this.panelsInitialModel = this.cloneModels(this.panels);
        var targetElement = sf.base.closest((event.currentTarget), '.e-panel');
        this.isChanged = true;
        var args = { event: event, element: targetElement, isInteracted: true, name: 'ResizeStart' };
        this.dotnetRef.invokeMethodAsync('TriggerResizeStart', args.isInteracted, targetElement.id, 'ResizeStart');
        this.isResizing = true;
        this.downTarget = event.currentTarget;
        this.shadowEle = document.createElement('div');
        this.shadowEle.classList.add('e-holder');
        sf.base.addClass([this.element], [PREVENTSELECT]);
        this.element.appendChild(this.shadowEle);
        this.elementX = parseFloat(targetElement.style.left);
        this.elementY = parseFloat(targetElement.style.top);
        this.elementWidth = targetElement.offsetWidth;
        this.elementHeight = targetElement.offsetHeight;
        this.originalWidth = this.getCellInstance(targetElement.id).sizeX;
        this.originalHeight = this.getCellInstance(targetElement.id).sizeY;
        this.previousRow = this.getCellInstance(targetElement.id).row;
    };
    SfDashboardLayout.prototype.onDraggingStart = function (args) {
        var dragArgs = args;
        this.dotnetRef.invokeMethodAsync('TriggerDragStart', args.element.id);
        this.isChanged = true;
        dragArgs.bindEvents(args.element);
        this.panelsInitialModel = this.cloneModels(this.panels);
        this.mainElement = args.element;
        var datamodel = this.getCellInstance(args.element.id);
        var eleRowValue = this.startRow = datamodel.row;
        this.startCol = datamodel.col;
        var eleSizeY = datamodel.sizeY;
        this.updateDragArea();
        this.shadowEle = document.createElement('div');
        this.shadowEle.classList.add('e-holder');
        this.shadowEle.classList.add('e-holder-transition');
        sf.base.setStyleAttribute(this.shadowEle, { 'position': 'absolute' });
        sf.base.addClass([this.element], [PREVENTSELECT]);
        sf.base.addClass([args.element], [DRAGGING]);
        this.element.appendChild(this.shadowEle);
        this.shadowEle = document.querySelector('.e-holder');
        this.shadowEle.style.height = (this.getCellInstance(args.element.id).sizeY * this.cellSize[1]) + 'px';
        this.shadowEle.style.width = (this.getCellInstance(args.element.id).sizeX * this.cellSize[0]) + 'px';
        var panelInstance = this.getCellInstance(args.element.id);
        this.updatePanelPosition(panelInstance.id, panelInstance.col, panelInstance.row);
        this.setPanelPosition(this.shadowEle, panelInstance.row, panelInstance.col);
    };
    
    SfDashboardLayout.prototype.updatePanelSize = function (id, sizeX, sizeY) {
        if (this.panels.length > 0) {
            for (var i = 0; i < this.panels.length; i++) {
                if (this.panels[i].id === id) {
                    if (!sf.base.isNullOrUndefined(sizeX)) {
                        this.panels[i].sizeX = sizeX;
                    }
                    if (!sf.base.isNullOrUndefined(sizeY)) {
                        this.panels[i].sizeY = sizeY;
                    }
                }
            }
        }
    };
    SfDashboardLayout.prototype.updateDragArea = function () {
        this.dragCollection.forEach(function (dragobj) {
            // tslint:disable-next-line
            dragobj.setDragArea();
        });
    };
    SfDashboardLayout.prototype.setPanelPosition = function (cellElement, row, col) {
        if (!cellElement) {
            return;
        }
        var heightValue = this.getCellSize()[1];
        var widthValue = this.getCellSize()[0];
        var left = col === 0 ? 0 : (((col) * ((widthValue) + this.cellSpacing[0])));
        var top = row === 0 ? 0 : (((row) * ((heightValue) + this.cellSpacing[1])));
        sf.base.setStyleAttribute(cellElement, { 'left': left + 'px', 'top': top + 'px' });
    };
    SfDashboardLayout.prototype.calculateCellSizeValue = function () {
        this.cellSize = [];
        if ((this.checkMediaQuery())) {
            this.cellSize[1] = this.element.parentElement
                && ((this.element.parentElement.offsetWidth)) / this.cellAspectRatio;
        }
        else {
            this.cellSize[0] = this.element.parentElement &&
                ((this.element.parentElement.offsetWidth));
            this.cellSize[0] = this.element.parentElement
                && ((this.element.parentElement.offsetWidth - ((this.columns - 1) * this.cellSpacing[0]))
                    / (this.columns));
            this.cellSize[1] = this.cellSize[0] / this.cellAspectRatio;
        }
    };
    // tslint:disable-next-line
    SfDashboardLayout.prototype.cloneModels = function (source, target) {
        if (target === undefined) {
            target = [];
        }
        for (var i = 0; i < source.length; i++) {
            // tslint:disable-next-line
            if (!target[i]) {
                target[i] = {};
            }
            // tslint:disable-next-line
            for (var k in source[i]) {
                target[i][k] = source[i][k];
            }
        }
        return target;
    };
    
    SfDashboardLayout.prototype.checkForChanges = function () {
        var changedPanels = [];
        for (var i = 0; i < this.panels.length; i++) {
            if ((this.panels[i].row !== this.panelsInitialModel[i].row || this.panels[i].col !== this.panelsInitialModel[i].col ||
                this.panels[i].sizeX !== this.panelsInitialModel[i].sizeX || this.panels[i].sizeY !== this.panelsInitialModel[i].sizeY)) {
                changedPanels.push(this.panels[i]);
            }
        }
        return changedPanels;
    };
    SfDashboardLayout.prototype.getCellSize = function () {
        return [this.cellSize[0], this.cellSize[1]];
    };
    SfDashboardLayout.prototype.destroy = function () {
        this.element.removeAttribute('style');
        for (var i = 0; i < this.dragCollection.length; i++) {
            this.dragCollection[i].destroy();
        }
        this.removeAllPanel();
    };
    SfDashboardLayout.prototype.setHolderPosition = function (args) {
        var cellSizeOne;
        var cellSizeZero;
        var sizeY = parseInt(args.element.getAttribute('data-sizeY'), 10);
        var col = parseInt(args.element.getAttribute('data-col'), 10);
        var row = parseInt(args.element.getAttribute('data-row'), 10);
        var sizeX = parseInt(args.element.getAttribute('data-sizeX'), 10);
        var widthValue = this.getCellSize()[0];
        var heightValue = this.getCellSize()[1];
        var top = row === 0 ? 0 : (((row) * (heightValue + this.cellSpacing[1])));
        var left = col === 0 ? 0 : (((col) * (widthValue + this.cellSpacing[0])));
        cellSizeOne = this.getCellSize()[1];
        cellSizeZero = this.getCellSize()[0];
        this.shadowEle.style.top = top + 'px';
        this.shadowEle.style.left = left + 'px';
        this.shadowEle.style.height = ((sizeY * cellSizeOne) + ((sizeY - 1) * this.cellSpacing[1])) + 'px';
        this.shadowEle.style.width = ((sizeX * cellSizeZero) + ((sizeX - 1) * this.cellSpacing[0])) + 'px';
    };
    
    return SfDashboardLayout;
}());
// tslint:disable-next-line
var DashboardLayout = {
    initialize: function (element, dotnetRef, property) {
        new SfDashboardLayout(element, dotnetRef);
        if (this.isValid(element)) {
            element.blazor__instance.initialize(property);
        }
        return (property.MediaQuery && window.matchMedia('(' + property.MediaQuery + ')').matches);
    },
    calculateCellSize: function (element) {
        if (this.isValid(element)) {
            element.blazor__instance.calculateCellSize();
        }
        return element != null ? element.blazor__instance.calculateCellSize() : null;
    },
    movePanel: function (element, id, row, col) {
        if (this.isValid(element)) {
            element.blazor__instance.movePanel(id, row, col);
        }
    },
    removePanel: function (element, id) {
        if (this.isValid(element)) {
            element.blazor__instance.removePanel(id);
        }
    },
    resizePanel: function (element, id, sizeX, sizeY) {
        if (this.isValid(element)) {
            element.blazor__instance.resizePanel(id, sizeX, sizeY);
        }
    },
    removeAll: function (element) {
        if (this.isValid(element)) {
            element.blazor__instance.removeAll();
        }
    },
    addPanel: function (element, panel) {
        if (this.isValid(element)) {
            element.blazor__instance.addPanel(panel);
        }
    },
    onPropertyChange: function (element, property) {
        if (this.isValid(element)) {
            element.blazor__instance.onPropertyChange(property);
        }
    },
    destroy: function (element) {
        if (this.isValid(element)) {
            element.blazor__instance.destroy();
        }
    },
    isValid: function (element) {
        return (element && element.blazor__instance) ? true : false;
    }
};

return DashboardLayout;

}());
