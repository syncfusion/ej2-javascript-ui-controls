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
        this.clipBoardTextArea = sf.base.createElement('textarea', {
            className: 'e-clipboard',
            styles: 'opacity: 0',
            attrs: { tabindex: '-1', 'aria-label': 'clipboard', 'aria-hidden': 'true' }
        });
        this.parent.element.appendChild(this.clipBoardTextArea);
    }
    Clipboard.prototype.copy = function (withHeader) {
        if (document.queryCommandSupported('copy')) {
            this.setCopyData(withHeader);
            document.execCommand('copy');
            this.clipBoardTextArea.blur();
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
            this.clipBoardTextArea.value = this.gridClipboard[copyContent] = '';
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
                this.clipBoardTextArea.value = this.gridClipboard[copyContent] = this.treeCopyContent;
                if (!sf.base.Browser.userAgent.match(/ipad|ipod|iphone/i)) {
                    window.getSelection().removeAllRanges();
                    this.clipBoardTextArea.select();
                }
                else {
                    this.clipBoardTextArea.setSelectionRange(0, this.clipBoardTextArea.value.length);
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
        var parentItem = 'parentRecord';
        var uniqueID = 'uniqueID';
        var level = 'level';
        if (!sf.base.isNullOrUndefined(currentRecords[selectedIndex][parentItem])) {
            var treeLevel = currentRecords[selectedIndex][parentItem][level];
            for (var i = 0; i < treeLevel + 1; i++) {
                for (var j = 0; j < currentRecords.length; j++) {
                    if (!sf.base.isNullOrUndefined(currentRecords[selectedIndex][parentItem]) &&
                        currentRecords[j][uniqueID] === currentRecords[selectedIndex][parentItem][uniqueID]) {
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
    modelChanged: function (element, options, actionArgs) {
        element.blazor_instance.options = options;
        var args = JSON.parse(actionArgs);
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
