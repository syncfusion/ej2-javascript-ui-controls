window.sfBlazor = window.sfBlazor || {};
window.sfBlazor.TreeGrid = (function () {
'use strict';

/**
 * The `Clipboard` module is used to handle clipboard copy action.
 */
var Clipboard = /** @class */ (function () {
    function Clipboard(parent) {
        this.treeCopyContent = '';
        this.copiedUniqueIdCollection = [];
        this.parent = parent;
        this.gridClipboard = this.parent.grid.clipboardModule;
    }
    Clipboard.prototype.copy = function (withHeader) {
        if (document.queryCommandSupported('copy')) {
            this.setCopyData(withHeader);
            document.execCommand('copy');
            this.gridClipboard.clipBoardTextArea.blur();
        }
        if (this.gridClipboard.isSelect) {
            window.getSelection().removeAllRanges();
            this.gridClipboard.isSelect = false;
        }
    };
    Clipboard.prototype.setCopyData = function (withHeader) {
        var copyContent = 'copyContent';
        var getCopyData = 'getCopyData';
        var isSelect = 'isSelect';
        var uniqueID = 'uniqueID';
        var currentRecords = this.parent.options.currentViewData;
        if (window.getSelection().toString() === '') {
            this.gridClipboard.clipBoardTextArea.value = this.gridClipboard[copyContent] = '';
            var rows = this.parent.grid.getRows();
            if (this.parent.grid.selectionMode !== 'Cell') {
                var selectedIndexes = this.parent.grid.getSelectedRowIndexes().sort(function (a, b) {
                    return a - b;
                });
                for (var i = 0; i < selectedIndexes.length; i++) {
                    if (i > 0) {
                        this.treeCopyContent += '\n';
                    }
                    if (!rows[selectedIndexes[i]].classList.contains('e-summaryrow')) {
                        var cells = [].slice.call(rows[selectedIndexes[i]].querySelectorAll('.e-rowcell'));
                        var uniqueid = this.parent.options.currentViewData[selectedIndexes[i]][uniqueID];
                        if (this.copiedUniqueIdCollection.indexOf(uniqueid) === -1) {
                            if (this.parent.options.copyHierarchyMode === 'Parent' || this.parent.options.copyHierarchyMode === 'Both') {
                                this.parentContentData(currentRecords, selectedIndexes[i], rows, withHeader, i);
                            }
                            this.gridClipboard[getCopyData](cells, false, '\t', withHeader);
                            this.treeCopyContent += this.gridClipboard[copyContent];
                            this.copiedUniqueIdCollection.push(uniqueid);
                            this.gridClipboard[copyContent] = '';
                            if (this.parent.options.copyHierarchyMode === 'Child' || this.parent.options.copyHierarchyMode === 'Both') {
                                this.childContentData(currentRecords, selectedIndexes[i], rows, withHeader);
                            }
                        }
                    }
                }
                if (withHeader) {
                    var headerTextArray = [];
                    for (var i = 0; i < this.parent.grid.getVisibleColumns().length; i++) {
                        headerTextArray[i] = this.parent.grid.getVisibleColumns()[i].headerText;
                    }
                    this.gridClipboard[getCopyData](headerTextArray, false, '\t', withHeader);
                    this.treeCopyContent = this.gridClipboard[copyContent] + '\n' + this.treeCopyContent;
                }
                this.gridClipboard.clipBoardTextArea.value = this.gridClipboard[copyContent] = this.treeCopyContent;
                if (!sf.base.Browser.userAgent.match(/ipad|ipod|iphone/i)) {
                    window.getSelection().removeAllRanges();
                    this.gridClipboard.clipBoardTextArea.select();
                }
                else {
                    this.gridClipboard.clipBoardTextArea.setSelectionRange(0, this.gridClipboard.clipBoardTextArea.value.length);
                }
                this.gridClipboard[isSelect] = true;
                this.copiedUniqueIdCollection = [];
                this.treeCopyContent = '';
            }
        }
    };
    Clipboard.prototype.parentContentData = function (currentRecords, selectedIndex, rows, withHeader, index) {
        var getCopyData = 'getCopyData';
        var copyContent = 'copyContent';
        var uniqueID = 'uniqueID';
        var parentUniqueID = 'parentUniqueID';
        var level = 'level';
        var parentItem = currentRecords.filter(function (a) {
            return (a[uniqueID] === currentRecords[selectedIndex][parentUniqueID]);
        })[0];
        if (!sf.base.isNullOrUndefined(parentItem)) {
            var treeLevel = parentItem[level];
            for (var i = 0; i < treeLevel + 1; i++) {
                for (var j = 0; j < currentRecords.length; j++) {
                    if (currentRecords[j][uniqueID] === parentItem[uniqueID]) {
                        selectedIndex = j;
                        var cells = [].slice.call(rows[selectedIndex].querySelectorAll('.e-rowcell'));
                        var uniqueid = currentRecords[j][uniqueID];
                        if (this.copiedUniqueIdCollection.indexOf(uniqueid) === -1) {
                            this.gridClipboard[getCopyData](cells, false, '\t', withHeader);
                            if (index > 0) {
                                this.treeCopyContent = this.treeCopyContent + this.gridClipboard[copyContent] + '\n';
                            }
                            else {
                                this.treeCopyContent = this.gridClipboard[copyContent] + '\n' + this.treeCopyContent;
                            }
                            this.copiedUniqueIdCollection.push(uniqueid);
                            this.gridClipboard[copyContent] = '';
                            break;
                        }
                    }
                }
            }
        }
    };
    Clipboard.prototype.childContentData = function (currentRecords, selectedIndex, rows, withHeader) {
        var getCopyData = 'getCopyData';
        var copyContent = 'copyContent';
        var hasChildRecords = 'hasChildRecords';
        var uniqueID = 'uniqueID';
        var parentUniqueID = 'parentUniqueID';
        if (currentRecords[selectedIndex][hasChildRecords]) {
            var currentUniqueID_1 = currentRecords[selectedIndex][uniqueID];
            var childData = currentRecords.filter(function (a) { return (a[parentUniqueID] === currentUniqueID_1); });
            for (var i = 0; i < childData.length; i++) {
                for (var j = 0; j < currentRecords.length; j++) {
                    if (!sf.base.isNullOrUndefined(childData[i][uniqueID]) && currentRecords[j][uniqueID] === childData[i][uniqueID]) {
                        if ((!sf.base.isNullOrUndefined(rows[j])) && !rows[j].classList.contains('e-summaryrow')) {
                            var cells = [].slice.call(rows[j].querySelectorAll('.e-rowcell'));
                            var uniqueid = currentRecords[j][uniqueID];
                            if (this.copiedUniqueIdCollection.indexOf(uniqueid) === -1) {
                                this.gridClipboard[getCopyData](cells, false, '\t', withHeader);
                                this.treeCopyContent += ('\n' + this.gridClipboard[copyContent]);
                                this.gridClipboard[copyContent] = '';
                                this.copiedUniqueIdCollection.push(uniqueid);
                                this.childContentData(currentRecords, j, rows, withHeader);
                            }
                        }
                        break;
                    }
                }
            }
        }
    };
    return Clipboard;
}());

/**
 * Blazor Treegrid Util functions
 */
/** @hidden */
function parentsUntil(elem, selector, isID) {
    var parent = elem;
    while (parent) {
        if (isID ? parent.id === selector : parent.classList.contains(selector)) {
            break;
        }
        parent = parent.parentElement;
    }
    return parent;
}

/**
 * TreeGrid RowDragAndDrop module
 * @hidden
 */
var RowDD = /** @class */ (function () {
    /**
     *
     * Constructor for render module
     */
    function RowDD(parent) {
        var _this = this;
        this.draggedRecords = [];
        this.selectedRows = [];
        this.canDrop = true;
        this.rowDragStart = function (args) {
            _this.gridDragStart.apply(_this.parent.grid, [args]);
            _this.startedRow = _this.parent.grid.rowDragAndDropModule.startedRow;
            var rowIndexes = _this.parent.grid.getSelectedRowIndexes();
            var fromIndex = parseInt(_this.startedRow.getAttribute('aria-rowindex'), 10);
            _this.selectedRows = _this.parent.grid.getSelectedRows();
            if (_this.selectedRows.length === 0 || rowIndexes.length === 0) {
                _this.selectedRows.push(_this.startedRow);
                rowIndexes.push(fromIndex);
            }
            for (var i = 0; i < rowIndexes.length; i++) {
                _this.draggedRecords.push(_this.parent.options.currentViewData[rowIndexes[i]]);
            }
        };
        this.rowDraging = function (args) {
            _this.gridDrag.apply(_this.parent.grid, [args]);
            _this.dragTarget = _this.parent.grid.rowDragAndDropModule.dragTarget;
            var tObj = _this.parent;
            var cloneElement = _this.parent.element.querySelector('.e-cloneproperties');
            cloneElement.style.cursor = '';
            var rowEle = args.target ? sf.base.closest(args.target, 'tr') : null;
            var rowIdx = rowEle ? rowEle.rowIndex : -1;
            var droppedRecord = tObj.options.currentViewData[rowIdx];
            _this.removeErrorElem();
            _this.canDrop = true;
            if (rowIdx !== -1) {
                _this.ensuredropPosition(_this.draggedRecords, droppedRecord);
            }
            else {
                _this.canDrop = false;
                _this.addErrorElem();
            }
            if (!tObj.options.rowDropTargetID && _this.canDrop) {
                tObj.rowDragAndDropModule.updateIcon(_this.selectedRows, rowIdx, args);
            }
            if (tObj.options.rowDropTargetID) {
                var dropElement = parentsUntil(args.target, 'e-treegrid');
                if (dropElement && dropElement.id === _this.parent.options.rowDropTargetID) {
                    // tslint:disable-next-line
                    var srcControl = dropElement.blazor_instance;
                    srcControl.rowDragAndDropModule.updateIcon(_this.selectedRows, rowIdx, args);
                }
            }
            if (args.target && sf.base.closest(args.target, '#' + tObj.options.rowDropTargetID)) {
                var dropElement = parentsUntil(args.target, 'e-treegrid');
                if (!dropElement) {
                    cloneElement.style.cursor = 'default';
                }
            }
        };
        this.rowDropped = function (e) {
            var targetEle = _this.getElementFromPosition(e.helper, e.event);
            var target = targetEle && !targetEle.classList.contains('e-dlg-overlay') ?
                targetEle : e.target;
            _this.parent.grid.element.classList.remove('e-rowdrag');
            // tslint:disable-next-line
            var dropElement = document.getElementById(_this.parent.options.rowDropTargetID);
            if (_this.parent.options.allowRowDragAndDrop && _this.parent.options.rowDropTargetID && !parentsUntil(target, 'e-treegrid')) {
                var toIdx = 0;
                // tslint:disable-next-line
                var targetClass = target.classList.value;
                var targetID = target.id;
                var fromIdx = parseInt(_this.startedRow.getAttribute('aria-rowindex'), 10);
                var rowPosition = _this.dropPosition === 'topSegment' ? 'Above' : _this.dropPosition === 'bottomSegment' ? 'Below' :
                    _this.dropPosition === 'middleSegment' ? 'Child' : 'Invalid';
                _this.parent.dotNetRef.invokeMethodAsync('ReorderRows', fromIdx, toIdx, 'add', false, targetClass, targetID, null, true, rowPosition);
            }
            if (_this.parent.options.rowDropTargetID && dropElement && dropElement.blazor_instance) {
                dropElement.blazor_instance.getContent().classList.remove('e-allowRowDrop');
            }
            if (!parentsUntil(target, 'e-gridcontent')) {
                _this.dragTarget = null;
                sf.base.remove(e.helper);
                _this.removetopOrBottomBorder();
                _this.removeChildBorder();
                if (!sf.base.isNullOrUndefined(_this.parent.element.getElementsByClassName('e-firstrow-border')[0])) {
                    _this.parent.element.getElementsByClassName('e-firstrow-border')[0].remove();
                }
                else if (!sf.base.isNullOrUndefined(_this.parent.element.getElementsByClassName('e-lastrow-border')[0])) {
                    _this.parent.element.getElementsByClassName('e-lastrow-border')[0].remove();
                }
                return;
            }
            var tObj = _this.parent;
            if (!tObj.options.rowDropTargetID) {
                if (parentsUntil(e.target, 'e-content')) {
                    if (_this.parent.element.querySelector('.e-errorelem')) {
                        _this.dropPosition = 'Invalid';
                    }
                    sf.base.setValue('dropPosition', _this.dropPosition, e);
                    if (!sf.base.isNullOrUndefined(tObj.getHeaderContent().querySelector('.e-firstrow-border'))) {
                        tObj.getHeaderContent().querySelector('.e-firstrow-border').remove();
                    }
                }
            }
            else {
                if (e.target && sf.base.closest(e.target, '#' + tObj.options.rowDropTargetID) || parentsUntil(e.target, 'e-treegrid') &&
                    parentsUntil(e.target, 'e-treegrid').id === tObj.options.rowDropTargetID) {
                    sf.base.setValue('dropPosition', _this.dropPosition, e);
                }
            }
            _this.removetopOrBottomBorder();
            _this.removeChildBorder();
            if (!sf.base.isNullOrUndefined(_this.parent.element.getElementsByClassName('e-firstrow-border')[0])) {
                _this.parent.element.getElementsByClassName('e-firstrow-border')[0].remove();
            }
            else if (!sf.base.isNullOrUndefined(_this.parent.element.getElementsByClassName('e-lastrow-border')[0])) {
                _this.parent.element.getElementsByClassName('e-lastrow-border')[0].remove();
            }
            if (_this.parent.options.allowRowDragAndDrop && !_this.parent.options.rowDropTargetID) {
                _this.parent.grid.rowDragAndDropModule.stopTimer();
                _this.parent.grid.getContent().classList.remove('e-grid-relative');
                _this.parent.grid.rowDragAndDropModule.removeBorder(targetEle);
                var stRow = _this.parent.grid.element.querySelector('.e-dragstartrow');
                if (stRow) {
                    stRow.classList.remove('e-dragstartrow');
                }
                var toIdx_1 = _this.dragTarget;
                // tslint:disable-next-line
                var targetClass_1 = target.classList.value;
                var targetID_1 = target.id;
                var fromIdx_1 = parseInt(_this.startedRow.getAttribute('aria-rowindex'), 10);
                var rowPosition_1 = _this.dropPosition === 'topSegment' ? 'Above' : _this.dropPosition === 'bottomSegment' ? 'Below' :
                    _this.dropPosition === 'middleSegment' ? 'Child' : 'Invalid';
                if (rowPosition_1 !== 'Invalid') {
                    setTimeout(function () {
                        _this.parent.dotNetRef.invokeMethodAsync('ReorderRows', fromIdx_1, toIdx_1, 'delete', true, targetClass_1, targetID_1, null, false, rowPosition_1);
                    }, 10);
                }
                _this.dragTarget = null;
                _this.draggedRecords = [];
            }
        };
        this.drop = function (e) {
            _this.treeGridDrop({ target: e.target, droppedElement: e.droppedElement });
            sf.base.remove(e.droppedElement);
        };
        this.parent = parent;
        if (this.parent.options.allowRowDragAndDrop) {
            this.gridDrag = this.parent.grid.rowDragAndDropModule.drag;
            this.gridDragStart = this.parent.grid.rowDragAndDropModule.dragStart;
            this.parent.grid.rowDragAndDropModule.draggable.drag = this.rowDraging;
            this.parent.grid.rowDragAndDropModule.draggable.dragStop = this.rowDropped;
            this.parent.grid.rowDragAndDropModule.draggable.dragStart = this.rowDragStart;
            this.parent.grid.rowDragAndDropModule.droppable.drop = this.drop;
        }
    }
    RowDD.prototype.removeFirstrowBorder = function (element, isRemove) {
        var canremove = this.dropPosition === 'bottomSegment';
        if (this.parent.element.getElementsByClassName('e-firstrow-border').length > 0 && element &&
            (element.rowIndex !== 0 || canremove)) {
            this.parent.element.getElementsByClassName('e-firstrow-border')[0].remove();
        }
    };
    RowDD.prototype.removeLastrowBorder = function (element, isRemove) {
        var isEmptyRow = element && (element.classList.contains('e-emptyrow') || element.classList.contains('e-columnheader'));
        var islastRowIndex = element && !isEmptyRow &&
            this.parent.getRows()[this.parent.getRows().length - 1].getAttribute('data-uid') !==
                element.getAttribute('data-uid');
        var canremove = islastRowIndex || this.dropPosition === 'topSegment';
        if (this.parent.element.getElementsByClassName('e-lastrow-border').length > 0 && element && (islastRowIndex || canremove)) {
            this.parent.element.getElementsByClassName('e-lastrow-border')[0].remove();
        }
    };
    RowDD.prototype.updateIcon = function (row, index, args) {
        var rowEle = args.target ? sf.base.closest(args.target, 'tr') : null;
        this.dropPosition = undefined;
        var rowPositionHeight = 0;
        this.removeFirstrowBorder(rowEle);
        this.removeLastrowBorder(rowEle);
        for (var i = 0; i < this.selectedRows.length; i++) {
            if (!sf.base.isNullOrUndefined(rowEle) && rowEle.getAttribute('data-uid') === this.selectedRows[i].getAttribute('data-uid')
                || !parentsUntil(args.target, 'e-gridcontent')) {
                this.dropPosition = 'Invalid';
                this.addErrorElem();
            }
        }
        // To get the corresponding drop position related to mouse position
        var tObj = this.parent;
        var rowTop = 0;
        var roundOff = 0;
        var toolbar = document.getElementById(tObj.element.id + '_gridcontrol_toolbarItems');
        var toolHeight = toolbar ? toolbar.offsetHeight : 0;
        // tObj.lastRow = tObj.getRowByIndex(tObj.getCurrentViewRecords().length - 1);
        var positionOffSet = this.getOffset(tObj.element);
        // let contentHeight1: number = (tObj.element.offsetHeight  - (tObj.getContent() as HTMLElement).offsetHeight) + positionOffSet.top;
        var contentHeight = tObj.getHeaderContent().offsetHeight + positionOffSet.top + toolHeight;
        var scrollTop = tObj.getContent().firstElementChild.scrollTop;
        if (!sf.base.isNullOrUndefined(rowEle)) {
            rowPositionHeight = rowEle.offsetTop - scrollTop;
        }
        // let scrollTop = (tObj.grid.scrollModule as any).content.scrollTop;
        if (tObj.options.allowTextWrap) {
            rowTop = row[0].offsetHeight;
        }
        else {
            rowTop = rowPositionHeight + contentHeight + roundOff;
        }
        var rowBottom = rowTop + row[0].offsetHeight;
        var difference = rowBottom - rowTop;
        var divide = difference / 3;
        var topRowSegment = rowTop + divide;
        var middleRowSegment = topRowSegment + divide;
        var bottomRowSegment = middleRowSegment + divide;
        var posx = positionOffSet.left;
        var mouseEvent = args.event;
        var posy = mouseEvent.pageY;
        var isTopSegment = posy <= topRowSegment;
        var isMiddleRowSegment = (posy > topRowSegment && posy <= middleRowSegment);
        var isBottomRowSegment = (posy > middleRowSegment && posy <= bottomRowSegment);
        if (isTopSegment || isMiddleRowSegment || isBottomRowSegment) {
            if (isTopSegment && this.dropPosition !== 'Invalid') {
                this.removeChildBorder();
                this.dropPosition = 'topSegment';
                this.removetopOrBottomBorder();
                this.addFirstrowBorder(rowEle);
                this.removeErrorElem();
                this.removeLastrowBorder(rowEle);
                this.topOrBottomBorder(args.target);
            }
            if (isMiddleRowSegment && this.dropPosition !== 'Invalid') {
                this.removetopOrBottomBorder();
                var element = void 0;
                var rowElement = [];
                element = sf.base.closest(args.target, 'tr');
                rowElement = !sf.base.isNullOrUndefined(element) ?
                    [].slice.call(element.querySelectorAll('.e-rowcell,.e-rowdragdrop,.e-detailrowcollapse')) : [];
                if (rowElement.length > 0) {
                    this.addRemoveClasses(rowElement, true, 'e-childborder');
                }
                this.addLastRowborder(rowEle);
                this.addFirstrowBorder(rowEle);
                this.dropPosition = 'middleSegment';
            }
            if (isBottomRowSegment && this.dropPosition !== 'Invalid') {
                this.removeErrorElem();
                this.removetopOrBottomBorder();
                this.removeChildBorder();
                this.dropPosition = 'bottomSegment';
                this.addLastRowborder(rowEle);
                this.removeFirstrowBorder(rowEle);
                this.topOrBottomBorder(args.target);
            }
        }
        return this.dropPosition;
    };
    RowDD.prototype.removeChildBorder = function () {
        var borderElem = [];
        borderElem = [].slice.call(this.parent.element.querySelectorAll('.e-childborder'));
        if (borderElem.length > 0) {
            this.addRemoveClasses(borderElem, false, 'e-childborder');
        }
    };
    RowDD.prototype.addFirstrowBorder = function (targetRow) {
        var node = this.parent.element;
        var tObj = this.parent;
        if (targetRow && targetRow.rowIndex === 0 && !targetRow.classList.contains('e-emptyrow')) {
            var div = sf.base.createElement('div', { className: 'e-firstrow-border' });
            var gridheaderEle = this.parent.getHeaderContent();
            var toolbarHeight = 0;
            if (tObj.options.toolbar) {
                toolbarHeight = document.getElementById(tObj.element.id + '_gridcontrol_toolbarItems').offsetHeight;
            }
            var multiplegrid = !sf.base.isNullOrUndefined(this.parent.options.rowDropTargetID);
            if (multiplegrid) {
                div.style.top = this.parent.grid.element.getElementsByClassName('e-gridheader')[0].offsetHeight
                    + toolbarHeight + 'px';
            }
            div.style.width = multiplegrid ? node.offsetWidth + 'px' :
                node.offsetWidth - this.getScrollWidth() + 'px';
            if (!gridheaderEle.querySelectorAll('.e-firstrow-border').length) {
                gridheaderEle.appendChild(div);
            }
        }
    };
    RowDD.prototype.addLastRowborder = function (trElement) {
        var isEmptyRow = trElement && (trElement.classList.contains('e-emptyrow') ||
            trElement.classList.contains('e-columnheader'));
        if (trElement && !isEmptyRow && this.parent.getRows()[this.parent.getRows().length - 1].getAttribute('data-uid') ===
            trElement.getAttribute('data-uid')) {
            var bottomborder = sf.base.createElement('div', { className: 'e-lastrow-border' });
            var gridcontentEle = this.parent.getContent();
            bottomborder.style.width = this.parent.element.offsetWidth - this.getScrollWidth() + 'px';
            if (!gridcontentEle.querySelectorAll('.e-lastrow-border').length) {
                gridcontentEle.classList.add('e-treegrid-relative');
                gridcontentEle.appendChild(bottomborder);
                bottomborder.style.bottom = this.getScrollWidth() + 'px';
            }
        }
    };
    RowDD.prototype.getScrollWidth = function () {
        var scrollElem = this.parent.getContent().firstElementChild;
        return scrollElem.scrollWidth > scrollElem.offsetWidth ? this.parent.grid.Scroll.getScrollBarWidth() : 0;
    };
    RowDD.prototype.addErrorElem = function () {
        var dragelem = document.getElementsByClassName('e-cloneproperties')[0];
        var errorelem = dragelem.querySelectorAll('.e-errorelem').length;
        if (!errorelem && !this.parent.options.rowDropTargetID) {
            var ele = document.createElement('div');
            sf.base.classList(ele, ['e-errorcontainer'], []);
            sf.base.classList(ele, ['e-icons', 'e-errorelem'], []);
            var errorVal = dragelem.querySelector('.errorValue');
            var content = dragelem.querySelector('.e-rowcell').innerHTML;
            if (errorVal) {
                content = errorVal.innerHTML;
                errorVal.parentNode.removeChild(errorVal);
            }
            dragelem.querySelector('.e-rowcell').innerHTML = '';
            var spanContent = document.createElement('span');
            spanContent.className = 'errorValue';
            spanContent.style.paddingLeft = '16px';
            spanContent.innerHTML = content;
            dragelem.querySelector('.e-rowcell').appendChild(ele);
            dragelem.querySelector('.e-rowcell').appendChild(spanContent);
        }
    };
    RowDD.prototype.removeErrorElem = function () {
        var errorelem = document.querySelector('.e-errorelem');
        if (errorelem) {
            errorelem.remove();
        }
    };
    RowDD.prototype.topOrBottomBorder = function (target) {
        var element;
        var multiplegrid = !sf.base.isNullOrUndefined(this.parent.options.rowDropTargetID);
        var rowElement = [];
        element = sf.base.closest(target, 'tr');
        rowElement = element ? [].slice.call(element.querySelectorAll('.e-rowcell,.e-rowdragdrop,.e-detailrowcollapse')) : [];
        if (rowElement.length) {
            if (this.dropPosition === 'topSegment') {
                this.addRemoveClasses(rowElement, true, 'e-droptop');
                if (this.parent.element.getElementsByClassName('e-lastrow-dragborder').length > 0) {
                    this.parent.element.getElementsByClassName('e-lastrow-dragborder')[0].remove();
                }
            }
            if (this.dropPosition === 'bottomSegment') {
                this.addRemoveClasses(rowElement, true, 'e-dropbottom');
            }
        }
    };
    RowDD.prototype.removetopOrBottomBorder = function () {
        var border = [];
        border = [].slice.call(this.parent.element.querySelectorAll('.e-dropbottom, .e-droptop'));
        if (border.length) {
            this.addRemoveClasses(border, false, 'e-dropbottom');
            this.addRemoveClasses(border, false, 'e-droptop');
        }
    };
    RowDD.prototype.addRemoveClasses = function (cells, add, className) {
        for (var i = 0, len = cells.length; i < len; i++) {
            if (add) {
                cells[i].classList.add(className);
            }
            else {
                cells[i].classList.remove(className);
            }
        }
    };
    RowDD.prototype.getOffset = function (element) {
        var box = element.getBoundingClientRect();
        var body = document.body;
        var docElem = document.documentElement;
        var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
        var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;
        var clientTop = docElem.clientTop || body.clientTop || 0;
        var clientLeft = docElem.clientLeft || body.clientLeft || 0;
        var top = box.top + scrollTop - clientTop;
        var left = box.left + scrollLeft - clientLeft;
        return { top: Math.round(top), left: Math.round(left) };
    };
    RowDD.prototype.treeGridDrop = function (e) {
        var tObj = this.parent;
        var targetRow = sf.base.closest(e.target, 'tr');
        var srcControl;
        var currentIndex;
        if ((e.droppedElement.querySelector('tr').getAttribute('single-dragrow') !== 'true' &&
            e.droppedElement.parentElement.parentElement.id === tObj.element.id)
            || (e.droppedElement.querySelector('tr').getAttribute('single-dragrow') === 'true' &&
                e.droppedElement.parentElement.parentElement.id !== tObj.element.id)) {
            return;
        }
        if (e.droppedElement.parentElement.parentElement.id !== tObj.element.id) {
            // tslint:disable-next-line
            srcControl = e.droppedElement.parentElement.parentElement.blazor_instance;
        }
        if (srcControl.element.id !== tObj.element.id && srcControl.options.rowDropTargetID !== tObj.element.id) {
            return;
        }
        var targetIndex = currentIndex = this.getTargetIdx(targetRow);
        if (isNaN(targetIndex)) {
            targetIndex = currentIndex = 0;
        }
        if (tObj.options.allowPaging) {
            targetIndex = targetIndex + (tObj.options.currentPage * tObj.options.pageSize) - tObj.options.pageSize;
        }
        this.removetopOrBottomBorder();
        this.removeChildBorder();
        // tslint:disable-next-line
        var targetClass = e.target.classList.value;
        var targetID = e.target.id;
        var rowPosition = this.dropPosition === 'topSegment' ? 'Above' : this.dropPosition === 'bottomSegment' ? 'Below' :
            this.dropPosition === 'middleSegment' ? 'Child' : 'Invalid';
        tObj.dotNetRef.invokeMethodAsync('ReorderRows', 0, targetIndex, 'add', false, targetClass, targetID, srcControl.dotNetRef, false, rowPosition);
        srcControl.dotNetRef.invokeMethodAsync('ReorderRows', 0, targetIndex, 'delete', false, targetClass, targetID, null, false, rowPosition);
    };
    RowDD.prototype.getTargetIdx = function (targetRow) {
        return targetRow ? parseInt(targetRow.getAttribute('aria-rowindex'), 10) : 0;
    };
    RowDD.prototype.getElementFromPosition = function (element, event) {
        var target;
        var position = this.getPosition(event);
        element.style.display = 'none';
        target = document.elementFromPoint(position.x, position.y);
        element.style.display = '';
        return target;
    };
    RowDD.prototype.ensuredropPosition = function (draggedRecords, currentRecord) {
        var tObj = this.parent;
        var rowDragMoudule = this;
        draggedRecords.filter(function (e) {
            var childRecords = tObj.options.currentViewData.filter(function (r) {
                return r.parentUniqueID === e.uniqueID;
            });
            if (e.hasChildRecords && childRecords.length) {
                var valid = childRecords.indexOf(currentRecord);
                if (valid === -1) {
                    rowDragMoudule.ensuredropPosition(childRecords, currentRecord);
                }
                else {
                    rowDragMoudule.dropPosition = 'Invalid';
                    rowDragMoudule.addErrorElem();
                    rowDragMoudule.canDrop = false;
                    return;
                }
            }
        });
    };
    RowDD.prototype.getPosition = function (e) {
        var position = {};
        position.x = (sf.base.isNullOrUndefined(e.clientX) ? e.changedTouches[0].clientX :
            e.clientX);
        position.y = (sf.base.isNullOrUndefined(e.clientY) ? e.changedTouches[0].clientY :
            e.clientY);
        return position;
    };
    return RowDD;
}());

/**
 * The `CheckboxColumn` module is used to handle checkbox column selection.
 */
var CheckboxColumn = /** @class */ (function () {
    function CheckboxColumn(dotnetRef, parent) {
        this.parent = parent;
        this.dotNetRef = dotnetRef;
    }
    CheckboxColumn.prototype.renderHeaderCheckbox = function (element, columnIndex) {
        var container = sf.base.createElement('div', { className: 'e-checkbox-wrapper e-css e-hierarchycheckbox' });
        var inputelement = sf.base.createElement('input', { className: 'e-treeselectall', attrs: { 'type': 'checkbox' } });
        container.appendChild(inputelement);
        var span = sf.base.createElement('span', { className: 'e-frame e-icons', styles: 'width: 18px;' });
        container.appendChild(span);
        span.addEventListener('click', this.headerSelect.bind(this));
        var spanlabel = sf.base.createElement('span', { className: 'e-label' });
        container.appendChild(spanlabel);
        var headerElement = element.querySelectorAll('.e-headercontent th')[columnIndex];
        if (sf.base.isNullOrUndefined(headerElement.querySelector('.e-checkbox-wrapper'))) {
            var headercelldiv = headerElement.querySelector('.e-headercelldiv');
            headercelldiv.insertBefore(container, headercelldiv.firstChild);
        }
    };
    CheckboxColumn.prototype.updateHeaderCheckbox = function (spanElement, checkState) {
        if (checkState === 'intermediate') {
            spanElement.classList.add('e-stop');
            spanElement.classList.remove('e-check');
        }
        else if (checkState === 'check') {
            spanElement.classList.add('e-check');
            spanElement.classList.remove('e-stop');
        }
        else {
            spanElement.classList.remove('e-stop');
            spanElement.classList.remove('e-check');
        }
    };
    CheckboxColumn.prototype.headerSelect = function (args) {
        var spanElement = args.currentTarget;
        var checkState = 'uncheck';
        if (spanElement.classList.contains('e-check')) {
            spanElement.classList.remove('e-check');
        }
        else if (spanElement.classList.contains('e-stop')) {
            spanElement.classList.remove('e-stop');
        }
        else {
            spanElement.classList.add('e-check');
            checkState = 'check';
        }
        this.dotNetRef.invokeMethodAsync('HeaderSelectAll', checkState);
    };
    return CheckboxColumn;
}());

/**
 * Specifies SfTreeGrid class for native blazor rendering.
 * @hidden
 */
var SfTreeGrid = /** @class */ (function () {
    function SfTreeGrid(element, options, dotnetRef) {
        this.columnModel = [];
        this.element = element;
        this.element.blazor_instance = this;
        /* tslint:disable-next-line */
        this.grid = element.querySelector('#' + element.id + '_gridcontrol').blazor__instance;
        this.dotNetRef = dotnetRef;
        this.options = options;
        this.header = this.element.querySelector('.e-headercontent');
        this.content = this.element.querySelector('.e-content');
        this.footer = this.element.querySelector('.e-summarycontent');
        this.clipboardModule = new Clipboard(this);
        this.rowDragAndDropModule = new RowDD(this);
        this.checkboxcolumnModule = new CheckboxColumn(dotnetRef, this);
        this.wireEvents();
    }
    SfTreeGrid.prototype.wireEvents = function () {
        sf.base.EventHandler.add(this.element, 'keydown', this.KeyDownHandler, this);
    };
    SfTreeGrid.prototype.getContent = function () { return this.content; };
    SfTreeGrid.prototype.getContentTable = function () { return this.content.querySelector('.e-table'); };
    SfTreeGrid.prototype.getHeaderContent = function () { return this.header; };
    SfTreeGrid.prototype.getHeaderTable = function () { return this.header.querySelector('.e-table'); };
    SfTreeGrid.prototype.getRows = function () { return [].slice.call(this.getContent().querySelectorAll('.e-row')); };
    SfTreeGrid.prototype.KeyDownHandler = function (e) {
        if (e.keyCode === 67 && e.ctrlKey) {
            this.clipboardModule.copy();
        }
        else if (e.keyCode === 72 && e.ctrlKey && e.shiftKey) {
            this.clipboardModule.copy(true);
        }
    };
    SfTreeGrid.prototype.unWireEvents = function () {
        sf.base.EventHandler.remove(this.element, 'keydown', this.KeyDownHandler);
    };
    SfTreeGrid.prototype.destroy = function () {
        this.unWireEvents();
    };
    return SfTreeGrid;
}());

/**
 * Blazor treegrid interop handler
 */
// tslint:disable
var TreeGrid = {
    initialize: function (element, options, dotnetRef) {
        sf.base.enableBlazorMode();
        new SfTreeGrid(element, options, dotnetRef);
    },
    modelChanged: function (element, options) {
        if (!sf.base.isNullOrUndefined(element.blazor_instance)) {
            element.blazor_instance.options = options;
        }
    },
    headerCheckbox: function (element, colIndex, options, dotnetRef) {
        if (!sf.base.isNullOrUndefined(element)) {
            element.blazor_instance.checkboxcolumnModule.renderHeaderCheckbox(element, colIndex);
        }
    },
    updateCheckbox: function (element, colIndex, checkState) {
        var thElement = element.querySelectorAll('.e-gridheader th')[colIndex];
        var spanElement = thElement.querySelector('span.e-frame');
        element.blazor_instance.checkboxcolumnModule.updateHeaderCheckbox(spanElement, checkState);
    },
    copyToClipBoard: function (element, withHeader) {
        if (element.blazor_instance.grid.options.selectionMode === 'Cell') {
            element.blazor_instance.grid.clipboardModule.copy(withHeader);
        }
        else {
            element.blazor_instance.clipboardModule.copy(withHeader);
        }
    },
    destroy: function (element) {
        element.blazor_instance.destroy();
    },
};

return TreeGrid;

}());
