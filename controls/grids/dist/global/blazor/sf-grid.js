window.sfBlazor = window.sfBlazor || {};
window.sfBlazor.Grid = (function () {
'use strict';

/**
 * The function used to update Dom using requestAnimationFrame.
 * @param  {Function} fn - Function that contains the actual action
 * @return {Promise<T>}
 * @hidden
 */
function getUpdateUsingRaf(updateFunction, callBack) {
    requestAnimationFrame(function () {
        try {
            callBack(null, updateFunction());
        }
        catch (e) {
            callBack(e);
        }
    });
}
/** @hidden */
var scrollWidth = null;
/** @hidden */
function getScrollBarWidth() {
    if (scrollWidth !== null) {
        return scrollWidth;
    }
    var divNode = document.createElement('div');
    var value = 0;
    divNode.style.cssText = 'width:100px;height: 100px;overflow: scroll;position: absolute;top: -9999px;';
    document.body.appendChild(divNode);
    value = (divNode.offsetWidth - divNode.clientWidth) | 0;
    document.body.removeChild(divNode);
    return scrollWidth = value;
}
function getSiblingsHeight(element) {
    var previous = getHeightFromDirection(element, 'previous');
    var next = getHeightFromDirection(element, 'next');
    return previous + next;
}
function getHeightFromDirection(element, direction) {
    var sibling = element[direction + 'ElementSibling'];
    var result = 0;
    var classList$$1 = ['e-gridheader', 'e-gridfooter', 'e-groupdroparea', 'e-gridpager', 'e-toolbar'];
    while (sibling) {
        if (classList$$1.some(function (value) { return sibling.classList.contains(value); })) {
            result += sibling.offsetHeight;
        }
        sibling = sibling[direction + 'ElementSibling'];
    }
    return result;
}
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
/** @hidden */
function getElementIndex(element, elements) {
    var index = -1;
    for (var i = 0, len = elements.length; i < len; i++) {
        if (elements[i].isEqualNode(element)) {
            index = i;
            break;
        }
    }
    return index;
}
/** @hidden */
function inArray(value, collection) {
    for (var i = 0, len = collection.length; i < len; i++) {
        if (collection[i] === value) {
            return i;
        }
    }
    return -1;
}
function getPosition(e) {
    var position = {};
    position.x = (sf.base.isNullOrUndefined(e.clientX) ? e.changedTouches[0].clientX :
        e.clientX);
    position.y = (sf.base.isNullOrUndefined(e.clientY) ? e.changedTouches[0].clientY :
        e.clientY);
    return position;
}
/**
 * @hidden
 */
function iterateArrayOrObject(collection, predicate) {
    var result = [];
    for (var i = 0, len = collection.length; i < len; i++) {
        var pred = predicate(collection[i], i);
        if (!sf.base.isNullOrUndefined(pred)) {
            result.push(pred);
        }
    }
    return result;
}
/** @hidden */
function isActionPrevent(element) {
    var dlg = element.querySelector('#' + element.id + 'EditConfirm');
    return (element.querySelectorAll('.e-updatedtd').length) && (dlg ? dlg.classList.contains('e-popup-close') : true);
}
/**
 * @hidden
 */
function isGroupAdaptive(grid) {
    return (grid.options.enableVirtualization && grid.options.groupCount > 0 && (grid.options.offline || grid.options.url === ''));
}
/** @hidden */
var rowHeight;
/** @hidden */
function getRowHeight(element) {
    if (rowHeight !== undefined) {
        return rowHeight;
    }
    var table = sf.base.createElement('table', { className: 'e-table', styles: 'visibility: hidden' });
    table.innerHTML = '<tr><td class="e-rowcell">A<td></tr>';
    element.appendChild(table);
    var rect = table.querySelector('td').getBoundingClientRect();
    element.removeChild(table);
    rowHeight = Math.ceil(rect.height);
    return rowHeight;
}
function removeElement(target, selector) {
    var elements = [].slice.call(target.querySelectorAll(selector));
    for (var i = 0; i < elements.length; i++) {
        sf.base.remove(elements[i]);
    }
}
/** @hidden */
function addRemoveActiveClasses(cells, add) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    for (var i = 0, len = cells.length; i < len; i++) {
        if (add) {
            sf.base.classList(cells[i], args.slice(), []);
            cells[i].setAttribute('aria-selected', 'true');
        }
        else {
            sf.base.classList(cells[i], [], args.slice());
            cells[i].removeAttribute('aria-selected');
        }
    }
}

/**
 * The `Scroll` module is used to handle scrolling behaviour.
 */
var Scroll = /** @class */ (function () {
    /**
     * Constructor for the Grid scrolling.
     * @hidden
     */
    function Scroll(parent) {
        //To maintain scroll state on grid actions.
        this.previousValues = { top: 0, left: 0 };
        this.oneTimeReady = true;
        this.parent = parent;
        this.addEventListener();
        this.setHeight();
        this.setPadding();
    }
    /**
     * @hidden
     */
    Scroll.prototype.setHeight = function () {
        var mHdrHeight = 0;
        var content = this.parent.element.querySelector('.e-content');
        if (this.parent.options.frozenRows && this.parent.options.height !== 'auto') {
            var tbody = this.parent.element.querySelector('.e-headercontent').querySelector('tbody');
            mHdrHeight = tbody ? tbody.offsetHeight : 0;
            content.style.height = sf.base.formatUnit((parseInt(this.parent.options.height) - mHdrHeight));
        }
    };
    /**
     * @hidden
     */
    Scroll.prototype.setPadding = function () {
        if (this.parent.options.height == "auto") {
            return;
        }
        var content = this.parent.element.querySelector('.e-gridheader');
        var scrollWidth = Scroll.getScrollBarWidth() - this.getThreshold();
        var cssProps = this.getCssProperties();
        content.style[cssProps.padding] = scrollWidth > 0 ? scrollWidth + 'px' : '0px';
        content.querySelector('.e-headercontent').style[cssProps.border] = scrollWidth > 0 ? '1px' : '0px';
        var footer = this.parent.element.querySelector('.e-gridfooter');
        if (footer) {
            var footerContent = footer.querySelector('.e-summarycontent');
            footerContent.style[cssProps.border] = scrollWidth > 0 ? '1px' : '0px';
            footer.style[cssProps.padding] = scrollWidth > 0 ? scrollWidth + 'px' : '0px';
        }
    };
    /**
     * @hidden
     */
    Scroll.prototype.removePadding = function (rtl) {
        var cssProps = this.getCssProperties(rtl);
        var hDiv = this.parent.getHeaderContent().querySelector('.e-headercontent');
        hDiv.style[cssProps.border] = '';
        hDiv.parentElement.style[cssProps.padding] = '';
        var footerDiv = this.parent.getFooterContent();
    };
    /**
     * Refresh makes the Grid adoptable with the height of parent container.
     *
     * > The [`height`](grid/#height/) must be set to 100%.
     * @return
     */
    Scroll.prototype.refresh = function () {
        if (this.parent.options.height !== '100%') {
            return;
        }
        var content = this.parent.element.querySelector(".e-gridcontent");
        var height = getSiblingsHeight(content);
        content.style.height = 'calc(100% - ' + height + 'px)'; //Set the height to the '.e-gridcontent';
    };
    Scroll.prototype.getThreshold = function () {
        /* Some browsers places the scroller outside the content,
         * hence the padding should be adjusted.*/
        var appName = sf.base.Browser.info.name;
        if (appName === 'mozilla') {
            return 0.5;
        }
        return 1;
    };
    /**
     * @hidden
     */
    Scroll.prototype.addEventListener = function () {
        this.wireEvents();
        // this.parent.on(onEmpty, this.wireEvents, this);
        // this.parent.on(contentReady, this.wireEvents, this);
        // this.parent.on(uiUpdate, this.onPropertyChanged, this);
        // this.parent.on(textWrapRefresh, this.wireEvents, this);
        // this.parent.on(headerRefreshed, this.setScrollLeft, this);
    };
    // private setScrollLeft(): void {
    //     if (this.parent.options.frozenColumns) {
    //         (<HTMLElement>(<SfGrid>this.parent).headerModule.getMovableHeader()).scrollLeft = this.previousValues.left;
    //     }
    // }
    Scroll.prototype.onContentScroll = function (scrollTarget) {
        var _this = this;
        var element = scrollTarget;
        var isHeader = element.classList.contains('e-headercontent');
        return function (e) {
            if (_this.content.querySelector('tbody') === null) {
                return;
            }
            var target = e.target;
            var left = target.scrollLeft;
            var sLimit = target.scrollWidth;
            var isFooter = target.classList.contains('e-summarycontent');
            if (_this.previousValues.left === left) {
                _this.previousValues.top = !isHeader ? _this.previousValues.top : target.scrollTop;
                return;
            }
            element.scrollLeft = left;
            var footer = _this.parent.options.frozenColumns != 0 ? _this.parent.element.querySelector('.e-movablefootercontent') :
                _this.parent.element.querySelector('.e-summarycontent');
            if (footer) {
                footer.scrollLeft = left;
            }
            if (isFooter) {
                _this.header.scrollLeft = left;
            }
            _this.previousValues.left = left;
        };
    };
    Scroll.prototype.onFreezeContentScroll = function (scrollTarget) {
        var _this = this;
        var element = scrollTarget;
        return function (e) {
            if (_this.content.querySelector('tbody') === null) {
                return;
            }
            var target = e.target;
            var top = target.scrollTop;
            if (_this.previousValues.top === top) {
                return;
            }
            element.scrollTop = top;
            _this.previousValues.top = top;
        };
    };
    Scroll.prototype.onWheelScroll = function (scrollTarget) {
        var _this = this;
        var element = scrollTarget;
        return function (e) {
            if (_this.content.querySelector('tbody') === null) {
                return;
            }
            var top = element.scrollTop + (e.deltaMode === 1 ? e.deltaY * 30 : e.deltaY);
            if (_this.previousValues.top === top) {
                return;
            }
            e.preventDefault();
            _this.parent.getContent().querySelector('.e-frozencontent').scrollTop = top;
            element.scrollTop = top;
            _this.previousValues.top = top;
        };
    };
    Scroll.prototype.onTouchScroll = function (scrollTarget) {
        var _this = this;
        var element = scrollTarget;
        return function (e) {
            if (e.pointerType === 'mouse') {
                return;
            }
            var cont;
            var mHdr;
            var pageXY = _this.getPointXY(e);
            var top = element.scrollTop + (_this.pageXY.y - pageXY.y);
            var left = element.scrollLeft + (_this.pageXY.x - pageXY.x);
            if (_this.parent.getHeaderContent().contains(e.target)) {
                mHdr = _this.parent.options.frozenColumns ?
                    _this.parent.getHeaderContent().querySelector('.e-movableheader') :
                    _this.parent.getHeaderContent().querySelector('.e-headercontent');
                if (_this.previousValues.left === left || (left < 0 || (mHdr.scrollWidth - mHdr.clientWidth) < left)) {
                    return;
                }
                e.preventDefault();
                mHdr.scrollLeft = left;
                element.scrollLeft = left;
                _this.pageXY.x = pageXY.x;
                _this.previousValues.left = left;
            }
            else {
                cont = _this.parent.getContent().querySelector('.e-frozencontent');
                if (_this.previousValues.top === top && (top < 0 || (cont.scrollHeight - cont.clientHeight) < top)
                    || (top < 0 || (cont.scrollHeight - cont.clientHeight) < top)) {
                    return;
                }
                e.preventDefault();
                cont.scrollTop = top;
                element.scrollTop = top;
                _this.pageXY.y = pageXY.y;
                _this.previousValues.top = top;
            }
        };
    };
    Scroll.prototype.setPageXY = function () {
        var _this = this;
        return function (e) {
            if (e.pointerType === 'mouse') {
                return;
            }
            _this.pageXY = _this.getPointXY(e);
        };
    };
    Scroll.prototype.getPointXY = function (e) {
        var pageXY = { x: 0, y: 0 };
        if (e.touches && e.touches.length) {
            pageXY.x = e.touches[0].pageX;
            pageXY.y = e.touches[0].pageY;
        }
        else {
            pageXY.x = e.pageX;
            pageXY.y = e.pageY;
        }
        return pageXY;
    };
    Scroll.prototype.wireEvents = function () {
        var _this = this;
        if (this.oneTimeReady) {
            var frzCols = this.parent.options.frozenColumns;
            this.content = this.parent.getContent();
            this.header = this.parent.getHeaderContent();
            var mCont = this.content.querySelector('.e-movablecontent');
            var fCont = this.content.querySelector('.e-frozencontent');
            var mHdr = this.header.querySelector('.e-movableheader');
            if (this.parent.options.frozenColumns) {
                sf.base.EventHandler.add(frzCols ? mHdr : this.header, 'touchstart pointerdown', this.setPageXY(), this);
                sf.base.EventHandler.add(frzCols ? mHdr : this.header, 'touchmove pointermove', this.onTouchScroll(frzCols ? mCont : this.content), this);
            }
            if (frzCols) {
                sf.base.EventHandler.add(mCont, 'scroll', this.onContentScroll(mHdr), this);
                sf.base.EventHandler.add(mCont, 'scroll', this.onFreezeContentScroll(fCont), this);
                sf.base.EventHandler.add(fCont, 'scroll', this.onFreezeContentScroll(mCont), this);
                sf.base.EventHandler.add(mHdr, 'scroll', this.onContentScroll(mCont), this);
                sf.base.EventHandler.add(fCont, 'wheel', this.onWheelScroll(mCont), this);
                sf.base.EventHandler.add(fCont, 'touchstart pointerdown', this.setPageXY(), this);
                sf.base.EventHandler.add(fCont, 'touchmove pointermove', this.onTouchScroll(mCont), this);
            }
            else {
                sf.base.EventHandler.add(this.content, 'scroll', this.onContentScroll(this.header), this);
                sf.base.EventHandler.add(this.header, 'scroll', this.onContentScroll(this.content), this);
            }
            if (this.parent.options.aggregatesCount) {
                var footer = this.parent.options.frozenColumns ? this.parent.element.querySelector('.e-movablefootercontent') :
                    this.parent.element.querySelector('.e-summarycontent');
                if (!sf.base.isNullOrUndefined(footer)) {
                    sf.base.EventHandler.add(footer, 'scroll', this.onContentScroll(this.content), this);
                }
            }
            this.refresh();
            this.oneTimeReady = false;
        }
        var table = this.parent.getContent().querySelector(".e-table");
        var sLeft;
        var sHeight;
        var clientHeight;
        getUpdateUsingRaf(function () {
            sLeft = _this.header.scrollLeft;
            sHeight = table.scrollHeight;
            clientHeight = _this.parent.getContent().clientHeight;
        }, function () {
            if (!_this.parent.options.enableVirtualization) {
                if (sHeight < clientHeight) {
                    sf.base.addClass(table.querySelectorAll('tr:last-child td'), 'e-lastrowcell');
                    if (_this.parent.options.frozenColumns) {
                        sf.base.addClass(_this.parent.getContent().querySelector('.e-movablecontent').querySelectorAll('tr:last-child td'), 'e-lastrowcell');
                    }
                }
                if ((_this.parent.options.frozenColumns > 0 || _this.parent.options.frozenColumns > 0) && _this.header.querySelector('.e-movableheader')) {
                    _this.header.querySelector('.e-movableheader').scrollLeft = _this.previousValues.left;
                }
                else {
                    _this.header.scrollLeft = _this.previousValues.left;
                }
                _this.content.scrollLeft = _this.previousValues.left;
                _this.content.scrollTop = _this.previousValues.top;
            }
            if (!_this.parent.options.enableColumnVirtualization) {
                _this.content.scrollLeft = sLeft;
            }
            if (_this.parent.options.frozenColumns && _this.header.querySelector('.e-movableheader')) {
                _this.header.querySelector('.e-movableheader').scrollLeft =
                    _this.content.querySelector('.e-movablecontent').scrollLeft;
            }
        });
    };
    /**
     * @hidden
     */
    Scroll.prototype.getCssProperties = function (rtl) {
        var css = {};
        var enableRtl = sf.base.isNullOrUndefined(rtl) ? this.parent.options.enableRtl : rtl;
        css.border = enableRtl ? 'borderLeftWidth' : 'borderRightWidth';
        css.padding = enableRtl ? 'paddingLeft' : 'paddingRight';
        return css;
    };
    /**
     * @hidden
     */
    Scroll.prototype.destroy = function () {
        var gridElement = this.parent.element;
        if (!gridElement || (!gridElement.querySelector('.e-gridheader') && !gridElement.querySelector('.e-gridcontent'))) {
            return;
        }
        //Remove padding
        this.removePadding();
        //Remove Dom event
        sf.base.EventHandler.remove(this.parent.getContent(), 'scroll', this.onContentScroll);
    };
    /**
     * Function to get the scrollbar width of the browser.
     * @return {number}
     * @hidden
     */
    Scroll.getScrollBarWidth = function () {
        return getScrollBarWidth();
    };
    return Scroll;
}());

/**
 * Frozen rows and column handling
 */
var Freeze = /** @class */ (function () {
    function Freeze(parent) {
        this.parent = parent;
        this.frozenHeader = parent.element.querySelector('.e-frozenheader');
        this.movableHeader = parent.element.querySelector('.e-movableheader');
        this.addEventListener();
    }
    Freeze.prototype.addEventListener = function () {
        if (this.parent.options.frozenColumns) {
            this.setFrozenHeight();
            this.refreshFreeze({ case: 'textwrap' });
            this.refreshFreeze({ case: 'refreshHeight' });
        }
    };
    Freeze.prototype.refreshFreeze = function (obj) {
        if (obj.case === 'textwrap' || obj.case === 'refreshHeight') {
            var fRows = void 0;
            var mRows = void 0;
            var fHdr = this.getFrozenHeader();
            var mHdr = this.getMovableHeader();
            var cont = this.parent.getContent();
            var wrapMode = this.parent.options.wrapMode;
            if (obj.case === 'textwrap') {
                if (wrapMode !== 'Header' || obj.isModeChg) {
                    fRows = cont.querySelector('.e-frozencontent').querySelectorAll('tr');
                    mRows = cont.querySelector('.e-movablecontent').querySelectorAll('tr');
                    this.setWrapHeight(fRows, mRows, obj.isModeChg, true);
                }
                if (wrapMode === 'Both' || obj.isModeChg) {
                    fRows = fHdr.querySelectorAll('tr');
                    mRows = mHdr.querySelectorAll('tr');
                }
                else {
                    fRows = fHdr.querySelector(wrapMode === 'Content' ?
                        'tbody' : 'thead').querySelectorAll('tr');
                    mRows = mHdr.querySelector(wrapMode === 'Content' ?
                        'tbody' : 'thead').querySelectorAll('tr');
                }
                if (!this.parent.getHeaderContent().querySelectorAll('.e-stackedheadercell').length) {
                    this.setWrapHeight(fRows, mRows, obj.isModeChg, false, false);
                }
                this.refreshStackedHdrHgt();
            }
            else if (obj.case === 'refreshHeight') {
                this.setWrapHeight(cont.querySelector('.e-frozencontent').querySelectorAll('tr'), cont.querySelector('.e-movablecontent').querySelectorAll('tr'), obj.isModeChg);
                if (!this.parent.getHeaderContent().querySelectorAll('.e-stackedheadercell').length) {
                    this.setWrapHeight(fHdr.querySelectorAll('tr'), mHdr.querySelectorAll('tr'), obj.isModeChg);
                }
            }
        }
    };
    Freeze.prototype.updateResizeHandler = function () {
        var elements = [].slice.call(this.parent.getHeaderContent().querySelectorAll('.e-rhandler'));
        for (var i = 0; i < elements.length; i++) {
            elements[i].style.height = elements[i].parentElement.offsetHeight + 'px';
        }
    };
    Freeze.prototype.setWrapHeight = function (fRows, mRows, isModeChg, isContReset, isStackedHdr) {
        var fRowHgt;
        var mRowHgt;
        var isWrap = this.parent.options.allowTextWrap;
        var wrapMode = this.parent.options.wrapMode;
        var tHead = this.parent.getHeaderContent().querySelector('thead');
        var tBody = this.parent.getHeaderContent().querySelector('tbody');
        var height = [];
        var width = [];
        for (var i = 0, len = fRows.length; i < len; i++) { //separate loop for performance issue 
            if (!sf.base.isNullOrUndefined(fRows[i]) && !sf.base.isNullOrUndefined(mRows[i])) {
                height[i] = fRows[i].getBoundingClientRect().height; //https://pagebuildersandwich.com/increased-plugins-performance-200/
                width[i] = mRows[i].getBoundingClientRect().height;
            }
        }
        for (var i = 0, len = fRows.length; i < len; i++) {
            if (isModeChg && ((wrapMode === 'Header' && isContReset) || ((wrapMode === 'Content' && tHead.contains(fRows[i]))
                || (wrapMode === 'Header' && tBody.contains(fRows[i])))) || isStackedHdr) {
                fRows[i].style.height = null;
                mRows[i].style.height = null;
            }
            fRowHgt = height[i];
            mRowHgt = width[i];
            if (fRowHgt > mRowHgt) {
                mRows[i].style.height = fRowHgt + 'px';
            }
            else if (mRowHgt > fRowHgt) {
                fRows[i].style.height = mRowHgt + 'px';
            }
            //TODO: check below commented code is not working hence used above
            // if (!isNullOrUndefined(fRows[i]) && fRows[i].childElementCount && ((isWrap && fRowHgt < mRowHgt) ||
            //     (!isWrap && fRowHgt < mRowHgt))) {
            //     fRows[i].style.height = mRowHgt + 'px';
            // }
            // if (mRows && !isNullOrUndefined(mRows[i]) && mRows[i].childElementCount && ((isWrap && fRowHgt > mRowHgt) ||
            //     (!isWrap && fRowHgt > mRowHgt))) {
            //     mRows[i].style.height = fRowHgt + 'px';
            // }
        }
        if (isWrap) {
            this.setFrozenHeight();
        }
    };
    Freeze.prototype.setFrozenHeight = function (height) {
        if (height === void 0) { height = getScrollBarWidth(); }
        var movableContentHeight = this.parent.element.querySelector('.e-movablecontent').getBoundingClientRect().height;
        var movableContent = this.parent.element.querySelector('.e-movablecontent');
        var frozenContent = this.parent.element.querySelector('.e-frozencontent');
        //if (movableContent.scrollWidth - movableContent.clientWidth) {
        //TODO: why we need commented code?
        frozenContent.style.height = movableContentHeight - height + 'px';
        frozenContent.style.borderBottom = '';
        // } else {
        //     frozenContent.style.height = movableContentHeight + 'px';
        //     if ((frozenContent.scrollHeight <= frozenContent.clientHeight) ||
        //         (movableContent.scrollHeight <= movableContent.clientHeight)) {
        //         this.parent.scrollModule.removePadding();
        //     }
        //     frozenContent.style.borderBottom = '0px';
        // }
    };
    Freeze.prototype.refreshStackedHdrHgt = function () {
        var fRowSpan;
        var mRowSpan;
        var fTr = this.getFrozenHeader().querySelectorAll('.e-columnheader');
        var mTr = this.getMovableHeader().querySelectorAll('.e-columnheader');
        for (var i = 0, len = fTr.length; i < len; i++) {
            fRowSpan = this.getRowSpan(fTr[i]);
            mRowSpan = this.getRowSpan(mTr[i]);
            if (fRowSpan.min > 1) {
                this.updateStackedHdrRowHgt(i, fRowSpan.max, fTr[i], mTr);
            }
            else if (mRowSpan.min > 1) {
                this.updateStackedHdrRowHgt(i, mRowSpan.max, mTr[i], fTr);
            }
        }
        if (this.parent.options.allowResizing) {
            this.updateResizeHandler();
        }
    };
    Freeze.prototype.getRowSpan = function (row) {
        var rSpan;
        var minRowSpan;
        var maxRowSpan;
        for (var i = 0, len = row.childElementCount; i < len; i++) {
            if (i === 0) {
                minRowSpan = row.children[0].rowSpan;
            }
            rSpan = row.children[i].rowSpan;
            minRowSpan = Math.min(rSpan, minRowSpan);
            maxRowSpan = Math.max(rSpan, minRowSpan);
        }
        return { min: minRowSpan, max: maxRowSpan };
    };
    Freeze.prototype.updateStackedHdrRowHgt = function (idx, maxRowSpan, row, rows) {
        var height = 0;
        for (var i = 0; i < maxRowSpan; i++) {
            height += rows[idx + i].style.height ?
                parseInt(rows[idx + i].style.height, 10) : rows[idx + i].offsetHeight;
        }
        row.style.height = height + 'px';
    };
    Freeze.prototype.getFrozenHeader = function () {
        return this.frozenHeader;
    };
    Freeze.prototype.getMovableHeader = function () {
        return this.movableHeader;
    };
    Freeze.prototype.refreshRowHeight = function () {
        if (this.parent.options.rowHeight != 0) {
            return;
        }
        if (this.parent.options.frozenColumns || this.parent.options.frozenRows) {
            this.clearWrapHeight();
            this.refreshFreeze({ case: 'refreshHeight' });
            if (this.parent.options.allowResizing) {
                this.updateResizeHandler();
            }
        }
    };
    Freeze.prototype.clearWrapHeight = function () {
        var fn = function (fRows, mRows) {
            for (var i = 0, len = fRows.length; i < len; i++) {
                if (!sf.base.isNullOrUndefined(fRows[i]) && !sf.base.isNullOrUndefined(mRows[i])) {
                    fRows[i].style.height = null;
                    mRows[i].style.height = null;
                }
            }
        };
        var fRows;
        var mRows;
        if (this.parent.options.frozenColumns) {
            if (this.parent.options.frozenRows) {
                fRows = this.parent.element.querySelector('.e-frozenheader').querySelectorAll('tr');
                mRows = this.parent.element.querySelector('.e-movableheader').querySelectorAll('tr');
                fn(fRows, mRows);
            }
            fRows = this.parent.element.querySelector('.e-frozencontent').querySelectorAll('tr');
            mRows = this.parent.element.querySelector('.e-movablecontent').querySelectorAll('tr');
            fn(fRows, mRows);
        }
        if (this.parent.options.frozenRows && this.parent.options.frozenColumns == 0) {
            fRows = this.parent.element.querySelector('.e-headercontent').querySelectorAll('tr');
            mRows = this.parent.element.querySelector('.e-content').querySelectorAll('tr');
            fn(fRows, mRows);
        }
    };
    return Freeze;
}());

/**
 * Header drag and drop handling
 */
var HeaderDragDrop = /** @class */ (function () {
    function HeaderDragDrop(parent) {
        var _this = this;
        this.dragStart = function (e) {
            var gObj = _this.parent;
            var popup = gObj.element.querySelector('.e-gridpopup');
            if (popup) {
                popup.style.display = 'none';
            }
            _this.parent.reorderModule.dragStart({ target: e.target, column: _this.column, event: e.event });
            _this.parent.groupModule.columnDragStart({ target: e.target, column: _this.column });
            e.bindEvents(e.dragElement);
        };
        this.drag = function (e) {
            var gObj = _this.parent;
            var target = e.target;
            if (target) {
                var closest$$1 = sf.base.closest(target, '.e-grid');
                var cloneElement = _this.parent.element.querySelector('.e-cloneproperties');
                if (!closest$$1 || closest$$1.getAttribute('id') !== gObj.element.getAttribute('id')) {
                    sf.base.classList(cloneElement, ['e-notallowedcur'], ['e-defaultcur']);
                    if (gObj.options.allowReordering) {
                        gObj.element.querySelector('.e-reorderuparrow').style.display = 'none';
                        gObj.element.querySelector('.e-reorderdownarrow').style.display = 'none';
                    }
                    if (!gObj.options.groupReordering) {
                        return;
                    }
                }
                if (gObj.options.allowReordering) {
                    _this.parent.reorderModule.drag({ target: e.target, column: _this.column, event: e.event });
                }
                if (gObj.options.allowGrouping) {
                    _this.parent.groupModule.columnDrag({ target: e.target });
                }
            }
        };
        this.dragStop = function (e) {
            var gObj = _this.parent;
            var cancel;
            var popup = gObj.element.querySelector('.e-gridpopup');
            if (popup) {
                popup.style.display = 'none';
            }
            if ((!parentsUntil(e.target, 'e-headercell') && !parentsUntil(e.target, 'e-groupdroparea')) ||
                (!gObj.options.allowReordering && parentsUntil(e.target, 'e-headercell')) ||
                (!e.helper.getAttribute('e-mappinguid') && parentsUntil(e.target, 'e-groupdroparea'))) {
                sf.base.remove(e.helper);
                cancel = true;
            }
            if (gObj.options.allowReordering) {
                _this.parent.reorderModule.dragStop({ target: e.target, event: e.event, column: _this.column, cancel: cancel });
            }
        };
        this.drop = function (e) {
            var gObj = _this.parent;
            var uid = e.droppedElement.getAttribute('e-mappinguid');
            var closest$$1 = sf.base.closest(e.target, '.e-grid');
            sf.base.remove(e.droppedElement);
            if (closest$$1 && closest$$1.getAttribute('id') !== gObj.element.getAttribute('id') ||
                !(gObj.options.allowReordering || gObj.options.allowGrouping)) {
                return;
            }
            if (gObj.options.allowReordering) {
                _this.parent.reorderModule.headerDrop({ target: e.target });
            }
            if (gObj.options.allowGrouping) {
                _this.parent.groupModule.columnDrop({
                    target: e.target, droppedElement: e.droppedElement
                });
            }
            //gObj.notify(events.headerDrop, { target: e.target, uid: uid, droppedElement: e.droppedElement });
        };
        this.helper = function (e) {
            var gObj = _this.parent;
            var target = e.sender.target;
            var parentEle = parentsUntil(target, 'e-headercell');
            if (!(gObj.options.allowReordering || gObj.options.allowGrouping) || (!sf.base.isNullOrUndefined(parentEle)
                && parentEle.querySelectorAll('.e-checkselectall').length > 0)) {
                return false;
            }
            var visualElement = sf.base.createElement('div', { className: 'e-cloneproperties e-dragclone e-headerclone' });
            var element = target.classList.contains('e-headercell') ? target : parentEle;
            if (!element || (!gObj.options.allowReordering && element.classList.contains('e-stackedheadercell'))) {
                return false;
            }
            var height = element.offsetHeight;
            var headercelldiv = element.querySelector('.e-headercelldiv') || element.querySelector('.e-stackedheadercelldiv');
            var col;
            if (headercelldiv) {
                if (element.querySelector('.e-stackedheadercelldiv')) {
                    col = gObj.getStackedHeaderColumnByHeaderText(headercelldiv.innerText.trim(), gObj.options.columns);
                }
                else {
                    col = gObj.getColumnByUid(headercelldiv.getAttribute('e-mappinguid'));
                }
                _this.column = col;
                if (_this.column.lockColumn) {
                    return false;
                }
                visualElement.setAttribute('e-mappinguid', headercelldiv.getAttribute("e-mappinguid"));
            }
            // if (col && !isNullOrUndefined(col.headerTemplate)) {
            //     if (!isNullOrUndefined(col.headerTemplate)) {
            //         let result: Element[];
            //         let colIndex: number = gObj.getColumnIndexByField(col.field);
            //         result = col.getHeaderTemplate()(extend({ 'index': colIndex }, col), gObj, 'headerTemplate');
            //         appendChildren(visualElement, result);
            //     } else {
            //         visualElement.innerHTML = col.headerTemplate;
            //     }
            // } else {
            visualElement.innerHTML = headercelldiv ? col.headerText : element.firstElementChild.innerHTML;
            //}
            visualElement.style.width = element.offsetWidth + 'px';
            visualElement.style.height = element.offsetHeight + 'px';
            visualElement.style.lineHeight = (height - 6).toString() + 'px';
            gObj.element.appendChild(visualElement);
            return visualElement;
        };
        this.parent = parent;
        if (this.parent.options.allowGrouping || this.parent.options.allowReordering) {
            this.initializeHeaderDrag();
            this.initializeHeaderDrop();
        }
    }
    HeaderDragDrop.prototype.initializeHeaderDrag = function () {
        var gObj = this.parent;
        if (!(this.parent.options.allowReordering || (this.parent.options.allowGrouping && this.parent.options.showDropArea))) {
            return;
        }
        var headerRows = [].slice.call(gObj.getHeaderContent().querySelectorAll('.e-columnheader'));
        for (var i = 0, len = headerRows.length; i < len; i++) {
            var drag = new sf.base.Draggable(headerRows[i], {
                dragTarget: '.e-headercell',
                distance: 5,
                helper: this.helper,
                dragStart: this.dragStart,
                drag: this.drag,
                dragStop: this.dragStop,
                abort: '.e-rhandler'
            });
        }
    };
    HeaderDragDrop.prototype.initializeHeaderDrop = function () {
        var gObj = this.parent;
        var drop = new sf.base.Droppable(gObj.getHeaderContent(), {
            accept: '.e-dragclone',
            drop: this.drop
        });
    };
    return HeaderDragDrop;
}());

/**
 * ColumnDrop Handling
 */
var ContentDragDrop = /** @class */ (function () {
    function ContentDragDrop(parent) {
        var _this = this;
        this.drop = function (e) {
            _this.parent.groupModule.columnDrop({
                target: e.target, droppedElement: e.droppedElement
            });
            sf.base.remove(e.droppedElement);
        };
        this.parent = parent;
        if (this.parent.options.allowGrouping) {
            this.initializeContentDrop();
        }
    }
    ContentDragDrop.prototype.initializeContentDrop = function () {
        var gObj = this.parent;
        var drop = new sf.base.Droppable(gObj.getContent(), {
            accept: '.e-dragclone',
            drop: this.drop
        });
    };
    return ContentDragDrop;
}());

/**
 * Column reorder handling
 */
var Reorder = /** @class */ (function () {
    function Reorder(parent) {
        this.parent = parent;
        if (parent.options.allowReordering) {
            this.createReorderElement();
        }
    }
    Reorder.prototype.chkDropPosition = function (srcElem, destElem) {
        var col = this.parent.getColumnByUid(destElem.firstElementChild.getAttribute('e-mappinguid'));
        var bool = col ? !col.lockColumn : true;
        return (srcElem.parentElement.isEqualNode(destElem.parentElement) || (this.parent.options.frozenColumns
            && Array.prototype.indexOf.call(sf.base.closest(srcElem, 'thead').children, srcElem.parentElement)
                === Array.prototype.indexOf.call(sf.base.closest(destElem, 'thead').children, destElem.parentElement)))
            && this.targetParentContainerIndex(srcElem, destElem) > -1 && bool;
    };
    Reorder.prototype.chkDropAllCols = function (srcElem, destElem) {
        var isFound;
        var headers = this.getHeaderCells();
        var header;
        while (!isFound && headers.length > 0) {
            header = headers.pop();
            isFound = srcElem !== header && this.targetParentContainerIndex(srcElem, destElem) > -1;
        }
        return isFound;
    };
    Reorder.prototype.findColParent = function (col, cols, parent) {
        parent = parent;
        for (var i = 0, len = cols.length; i < len; i++) {
            if (col === cols[i]) {
                return true;
            }
            else if (cols[i].columns) {
                var cnt = parent.length;
                parent.push(cols[i]);
                if (!this.findColParent(col, cols[i].columns, parent)) {
                    parent.splice(cnt, parent.length - cnt);
                }
                else {
                    return true;
                }
            }
        }
        return false;
    };
    Reorder.prototype.getColumnsModel = function (cols) {
        var columnModel = [];
        var subCols = [];
        for (var i = 0, len = cols.length; i < len; i++) {
            columnModel.push(cols[i]);
            if (cols[i].columns) {
                subCols = subCols.concat(cols[i].columns);
            }
        }
        if (subCols.length) {
            columnModel = columnModel.concat(this.getColumnsModel(subCols));
        }
        return columnModel;
    };
    Reorder.prototype.headerDrop = function (e) {
        var gObj = this.parent;
        var dropElement = this.element.querySelector('.e-headercelldiv') || this.element.querySelector('.e-stackedheadercelldiv');
        var uId = dropElement.getAttribute('e-mappinguid');
        var column = gObj.getColumnByUid(uId);
        if (!sf.base.closest(e.target, 'th') || (!sf.base.isNullOrUndefined(column) && (!column.allowReordering || column.lockColumn))) {
            return;
        }
        var destElem = sf.base.closest(e.target, '.e-headercell');
        var destElemDiv = destElem.querySelector('.e-headercelldiv') || destElem.querySelector('.e-stackedheadercelldiv');
        var destElemUid = destElemDiv.getAttribute('e-mappinguid');
        if (!sf.base.isNullOrUndefined(destElemUid)) {
            var destColumn = gObj.getColumnByUid(destElemUid);
            if (sf.base.isNullOrUndefined(destColumn) || !destColumn.allowReordering || destColumn.lockColumn) {
                return;
            }
        }
        if (destElem && !(!this.chkDropPosition(this.element, destElem) || !this.chkDropAllCols(this.element, destElem))) {
            if (this.parent.options.enableColumnVirtualization) {
                var columns = this.parent.options.columns;
                var sourceUid_1 = this.element.querySelector('.e-headercelldiv').getAttribute('e-mappinguid');
                var col = this.parent.getColumns(true).filter(function (col) { return col.uid === sourceUid_1; });
                var colMatchIndex_1 = null;
                var column_1 = col[0];
                var destUid_1 = destElem.querySelector('.e-headercelldiv').getAttribute('e-mappinguid');
                var bool = columns.some(function (col, index) {
                    if (col.uid === destUid_1) {
                        colMatchIndex_1 = index;
                        return col.uid === destUid_1;
                    }
                    return false;
                });
                if (!sf.base.isNullOrUndefined(colMatchIndex_1)) {
                    this.moveColumns(colMatchIndex_1, column_1);
                }
            }
            else {
                var newIndex = this.targetParentContainerIndex(this.element, destElem);
                var uid = this.element.firstElementChild.getAttribute('e-mappinguid');
                this.destElement = destElem;
                if (uid) {
                    this.moveColumns(newIndex, this.parent.getColumnByUid(uid));
                }
                else {
                    var headers = this.getHeaderCells();
                    var oldIdx = getElementIndex(this.element, headers);
                    var columns = this.getColumnsModel(this.parent.options.columns);
                    var column_2 = columns[oldIdx];
                    this.moveColumns(newIndex, column_2);
                }
            }
        }
    };
    Reorder.prototype.isActionPrevent = function (gObj) {
        return isActionPrevent(gObj.element);
    };
    Reorder.prototype.moveColumns = function (destIndex, column, reorderByColumn, preventRefresh) {
        var gObj = this.parent;
        if (this.isActionPrevent(gObj)) {
            //gObj.notify(events.preventBatch, { instance: this, handler: this.moveColumns, arg1: destIndex, arg2: column });
            return;
        }
        var parent = this.getColParent(column, this.parent.options.columns);
        var cols = parent ? parent.columns : this.parent.options.columns;
        var srcIdx = inArray(column, cols);
        if (((this.parent.options.frozenColumns && parent)) && !reorderByColumn) {
            for (var i = 0; i < cols.length; i++) {
                if (cols[i].field === column.field) {
                    srcIdx = i;
                    break;
                }
            }
            var col = this.parent.getColumnByUid(this.destElement.firstElementChild.getAttribute('e-mappinguid'));
            if (col) {
                for (var i = 0; i < cols.length; i++) {
                    if (cols[i].field === col.field) {
                        destIndex = i;
                        break;
                    }
                }
            }
            else {
                for (var i = 0; i < cols.length; i++) {
                    if (cols[i].headerText === this.destElement.innerText.trim()) {
                        destIndex = i;
                    }
                }
            }
        }
        if (!gObj.options.allowReordering || srcIdx === destIndex || srcIdx === -1 || destIndex === -1) {
            return;
        }
        cols.splice(destIndex, 0, cols.splice(srcIdx, 1)[0]);
        gObj.getColumns(true);
        //gObj.notify(events.columnPositionChanged, { fromIndex: destIndex, toIndex: srcIdx });
        if (preventRefresh !== false) {
            //TODO: reorder from here
            setTimeout(function () {
                gObj.dotNetRef.invokeMethodAsync("ColumnReordered", {
                    requestType: 'reorder', fromIndex: destIndex, toIndex: srcIdx, toColumnUid: column.uid
                });
            }, 10);
        }
    };
    Reorder.prototype.targetParentContainerIndex = function (srcElem, destElem) {
        var headers = this.getHeaderCells();
        var cols = this.parent.options.columns;
        var flatColumns = this.getColumnsModel(cols);
        var parent = this.getColParent(flatColumns[getElementIndex(srcElem, headers)], cols);
        cols = parent ? parent.columns : cols;
        return inArray(flatColumns[getElementIndex(destElem, headers)], cols);
    };
    Reorder.prototype.getHeaderCells = function () {
        var frozenColumns = this.parent.options.frozenColumns;
        if (frozenColumns) {
            var fTh = void 0;
            var mTh = void 0;
            var fHeaders = [];
            var fRows = [].slice.call(this.parent.element.querySelector(".e-frozenheader").querySelectorAll('.e-columnheader'));
            if (frozenColumns) {
                var mRows = [].slice.call(this.parent.getHeaderContent()
                    .querySelector('.e-movableheader').querySelectorAll('.e-columnheader'));
                for (var i = 0; i < fRows.length; i++) {
                    fTh = [].slice.call(fRows[i].getElementsByClassName('e-headercell'));
                    mTh = [].slice.call(mRows[i].getElementsByClassName('e-headercell'));
                    var isAvail = void 0;
                    for (var k = 0; k < fTh.length; k++) {
                        for (var j = 0; j < mTh.length; j++) {
                            if (mTh[j].innerText === fTh[k].innerText) {
                                isAvail = true;
                                break;
                            }
                        }
                        if (!isAvail) {
                            fHeaders = fHeaders.concat([fTh[k]]);
                        }
                    }
                    for (var j = 0; j < mTh.length; j++) {
                        fHeaders.push(mTh[j]);
                    }
                }
            }
            else {
                for (var i = 0; i < fRows.length; i++) {
                    mTh = [].slice.call(fRows[i].getElementsByClassName('e-headercell'));
                    for (var k = 0; k < mTh.length; k++) {
                        var isAvail = void 0;
                        for (var j = k + 1; j < mTh.length; j++) {
                            if (mTh[j].innerText === mTh[k].innerText) {
                                isAvail = true;
                                break;
                            }
                        }
                        if (!isAvail) {
                            fHeaders = fHeaders.concat([mTh[k]]);
                        }
                    }
                }
            }
            return fHeaders;
        }
        else {
            return [].slice.call(this.parent.element.getElementsByClassName('e-headercell'));
        }
    };
    Reorder.prototype.getColParent = function (column, columns) {
        var parents = [];
        this.findColParent(column, columns, parents);
        return parents[parents.length - 1];
    };
    Reorder.prototype.reorderSingleColumn = function (fromFName, toFName) {
        var fColumn = this.parent.getColumnByField(fromFName);
        var toColumn = this.parent.getColumnByField(toFName);
        if ((!sf.base.isNullOrUndefined(fColumn) && (!fColumn.allowReordering || fColumn.lockColumn)) ||
            (!sf.base.isNullOrUndefined(toColumn) && (!toColumn.allowReordering || fColumn.lockColumn))) {
            return;
        }
        var column = this.parent.getColumnByField(toFName);
        var parent = this.getColParent(column, this.parent.options.columns);
        var columns = parent ? parent.columns : this.parent.options.columns;
        var destIndex = inArray(column, columns);
        if (destIndex > -1) {
            this.moveColumns(destIndex, this.parent.getColumnByField(fromFName), true);
        }
    };
    Reorder.prototype.reorderMultipleColumns = function (fromFNames, toFName) {
        var toIndex = this.parent.getColumnIndexByField(toFName);
        var toColumn = this.parent.getColumnByField(toFName);
        if (toIndex < 0 || (!sf.base.isNullOrUndefined(toColumn) && (!toColumn.allowReordering || toColumn.lockColumn))) {
            return;
        }
        for (var i = 0; i < fromFNames.length; i++) {
            var column = this.parent.getColumnByField(fromFNames[i]);
            if (!sf.base.isNullOrUndefined(column) && (!column.allowReordering || column.lockColumn)) {
                return;
            }
        }
        for (var i = 0; i < fromFNames.length; i++) {
            var column = this.parent.getColumnByIndex(toIndex);
            var parent_1 = this.getColParent(column, this.parent.options.columns);
            var columns = parent_1 ? parent_1.columns : this.parent.options.columns;
            var destIndex = inArray(column, columns);
            if (destIndex > -1) {
                this.moveColumns(destIndex, this.parent.getColumnByField(fromFNames[i]), true, false);
            }
            if (this.parent.getColumnIndexByField(fromFNames[i + 1]) >= destIndex) {
                toIndex++; //R to L
            }
        }
        var cols = this.parent.getColumns();
        this.parent.dotNetRef.invokeMethodAsync("ColumnReordered", {
            fromColumnUid: fromFNames.map(function (name) { return cols.filter(function (col) { return col.field === name; })[0].uid; }),
            toColumnUid: toColumn.uid,
            isMultipleReorder: true,
            requestType: 'reorder',
            type: 'actionBegin'
        });
    };
    Reorder.prototype.moveTargetColumn = function (column, toIndex) {
        if (toIndex > -1) {
            this.moveColumns(toIndex, column, true);
        }
    };
    Reorder.prototype.reorderSingleColumnByTarget = function (fieldName, toIndex) {
        var column = this.parent.getColumnByField(fieldName);
        this.moveTargetColumn(column, toIndex);
    };
    Reorder.prototype.reorderMultipleColumnByTarget = function (fieldName, toIndex) {
        for (var i = 0; i < fieldName.length; i++) {
            this.reorderSingleColumnByTarget(fieldName[i], toIndex);
        }
    };
    /**
     * Changes the position of the Grid columns by field names.
     * @param  {string | string[]} fromFName - Defines the origin field names.
     * @param  {string} toFName - Defines the destination field name.
     * @return {void}
     */
    Reorder.prototype.reorderColumns = function (fromFName, toFName) {
        if (typeof fromFName === 'string') {
            this.reorderSingleColumn(fromFName, toFName);
            this.fromCol = fromFName;
        }
        else {
            this.reorderMultipleColumns(fromFName, toFName);
            this.fromCol = fromFName[0];
        }
    };
    /**
     * Changes the position of the Grid columns by field index.
     * @param  {number} fromIndex - Defines the origin field index.
     * @param  {number} toIndex - Defines the destination field index.
     * @return {void}
     */
    Reorder.prototype.reorderColumnByIndex = function (fromIndex, toIndex) {
        var column = this.parent.getColumnByIndex(fromIndex);
        this.moveTargetColumn(column, toIndex);
    };
    /**
     * Changes the position of the Grid columns by field index.
     * @param  {string | string[]} fieldName - Defines the field name.
     * @param  {number} toIndex - Defines the destination field index.
     * @return {void}
     */
    Reorder.prototype.reorderColumnByTargetIndex = function (fieldName, toIndex) {
        typeof fieldName === 'string' ? this.reorderSingleColumnByTarget(fieldName, toIndex) :
            this.reorderMultipleColumnByTarget(fieldName, toIndex);
    };
    Reorder.prototype.createReorderElement = function () {
        var header = this.parent.element.querySelector('.e-headercontent');
        this.upArrow = header.appendChild(sf.base.createElement('div', { className: 'e-icons e-icon-reorderuparrow e-reorderuparrow', attrs: { style: 'display:none' } }));
        this.downArrow = header.appendChild(sf.base.createElement('div', { className: 'e-icons e-icon-reorderdownarrow e-reorderdownarrow', attrs: { style: 'display:none' } }));
    };
    /**
     * The function used to trigger onActionComplete
     * @return {void}
     * @hidden
     */
    // public onActionComplete(e: NotifyArgs): void {
    //     if (isBlazor() && !this.parent.isJsComponent) {
    //         e.rows = null;
    //     }
    //     this.parent.trigger(events.actionComplete, extend(e, { type: events.actionComplete }));
    //     let target: Element = this.fromCol && this.parent.getColumnHeaderByField(this.fromCol);
    //     if (target) {
    //         this.parent.focusModule.onClick({ target }, true);
    //     }
    // }
    /**
     * To destroy the reorder
     * @return {void}
     * @hidden
     */
    Reorder.prototype.destroy = function () {
        var gridElement = this.parent.element;
        if (this.upArrow) {
            sf.base.remove(this.upArrow);
        }
        if (this.downArrow) {
            sf.base.remove(this.downArrow);
        }
        //call ejdrag and drop destroy
    };
    Reorder.prototype.keyPressHandler = function (e) {
        var gObj = this.parent;
        switch (e.action) {
            case 'ctrlLeftArrow':
            case 'ctrlRightArrow':
                // let element: HTMLElement = gObj.focusModule.currentInfo.element;
                // if (element && element.classList.contains('e-headercell')) {
                //     let column: Column = gObj.getColumnByUid(element.firstElementChild.getAttribute('e-mappinguid'));
                //     let visibleCols: Column[] = gObj.getVisibleColumns();
                //     let index: number = visibleCols.indexOf(column);
                //     let toCol: Column = e.action === 'ctrlLeftArrow' ? visibleCols[index - 1] : visibleCols[index + 1];
                //     if (toCol && toCol.field && column.field) {
                //         this.reorderColumns(column.field, toCol.field);
                //     }
                // }
                break;
        }
    };
    Reorder.prototype.drag = function (e) {
        var gObj = this.parent;
        var target = e.target;
        if (!e.column.allowReordering || e.column.lockColumn) {
            return;
        }
        var closest$$1 = sf.base.closest(target, '.e-headercell:not(.e-stackedHeaderCell)');
        var cloneElement = gObj.element.querySelector('.e-cloneproperties');
        var isLeft = this.x > getPosition(e.event).x + gObj.getContent().firstElementChild.scrollLeft;
        sf.base.removeClass(gObj.element.querySelector(".e-headercontent").querySelectorAll('.e-reorderindicate'), ['e-reorderindicate']);
        this.setDisplay('none');
        this.stopTimer();
        sf.base.classList(cloneElement, ['e-defaultcur'], ['e-notallowedcur']);
        this.updateScrollPostion(e.event);
        if (closest$$1 && !closest$$1.isEqualNode(this.element)) {
            target = closest$$1;
            //consider stacked, detail header cell 
            if (!(!this.chkDropPosition(this.element, target) || !this.chkDropAllCols(this.element, target))) {
                this.updateArrowPosition(target, isLeft);
                sf.base.classList(target, ['e-allowDrop', 'e-reorderindicate'], []);
            }
            else if (!(gObj.options.allowGrouping && parentsUntil(e.target, 'e-groupdroparea'))) {
                sf.base.classList(cloneElement, ['e-notallowedcur'], ['e-defaultcur']);
            }
        }
        //gObj.trigger(events.columnDrag, { target: target, draggableType: 'headercell', column: e.column });
    };
    Reorder.prototype.updateScrollPostion = function (e) {
        var _this = this;
        var frzCols = this.parent.options.frozenColumns;
        var x = getPosition(e).x;
        var cliRect = this.parent.element.getBoundingClientRect();
        var cliRectBaseLeft = frzCols ? this.parent.element.querySelector('.e-movableheader')
            .getBoundingClientRect().left : cliRect.left;
        var cliRectBaseRight = cliRect.right;
        var scrollElem = frzCols ? this.parent.getContent().querySelector('.e-movablecontent')
            : this.parent.getContent().firstElementChild;
        if (x > cliRectBaseLeft && x < cliRectBaseLeft + 35) {
            this.timer = window.setInterval(function () { _this.setScrollLeft(scrollElem, true); }, 50);
        }
        else if (x < cliRectBaseRight && x > cliRectBaseRight - 35) {
            this.timer = window.setInterval(function () { _this.setScrollLeft(scrollElem, false); }, 50);
        }
    };
    Reorder.prototype.setScrollLeft = function (scrollElem, isLeft) {
        var scrollLeft = scrollElem.scrollLeft;
        scrollElem.scrollLeft = scrollElem.scrollLeft + (isLeft ? -5 : 5);
        if (scrollLeft !== scrollElem.scrollLeft) {
            this.setDisplay('none');
        }
    };
    Reorder.prototype.stopTimer = function () {
        window.clearInterval(this.timer);
    };
    Reorder.prototype.updateArrowPosition = function (target, isLeft) {
        var cliRect = target.getBoundingClientRect();
        var cliRectBase = this.parent.element.getBoundingClientRect();
        if ((isLeft && cliRect.left < cliRectBase.left) || (!isLeft && cliRect.right > cliRectBase.right)) {
            return;
        }
        this.upArrow.style.top = cliRect.top + cliRect.height - cliRectBase.top + 'px';
        this.downArrow.style.top = cliRect.top - cliRectBase.top - 4 + 'px';
        this.upArrow.style.left = this.downArrow.style.left = (isLeft ? cliRect.left : cliRect.right) - cliRectBase.left - 4 + 'px';
        this.setDisplay('');
    };
    Reorder.prototype.dragStart = function (e) {
        var gObj = this.parent;
        var target = e.target;
        this.element = target.classList.contains('e-headercell') ? target :
            parentsUntil(target, 'e-headercell');
        if (!e.column.allowReordering || e.column.lockColumn) {
            return;
        }
        this.x = getPosition(e.event).x + gObj.getContent().firstElementChild.scrollLeft;
        // gObj.trigger(events.columnDragStart, {
        //     target: target as Element, draggableType: 'headercell', column: e.column
        // });
    };
    Reorder.prototype.dragStop = function (e) {
        var gObj = this.parent;
        this.setDisplay('none');
        this.stopTimer();
        if (!e.cancel) {
            //gObj.trigger(events.columnDrop, { target: e.target, draggableType: 'headercell', column: e.column });
        }
        sf.base.removeClass(gObj.element.querySelector(".e-headercontent").querySelectorAll('.e-reorderindicate'), ['e-reorderindicate']);
    };
    Reorder.prototype.setDisplay = function (display) {
        this.upArrow.style.display = display;
        this.downArrow.style.display = display;
    };
    /**
     * For internal use only - Get the module name.
     * @private
     */
    Reorder.prototype.getModuleName = function () {
        return 'reorder';
    };
    return Reorder;
}());

/**
 * ColumnWidthService
 * @hidden
 */
var ColumnWidthService = /** @class */ (function () {
    function ColumnWidthService(parent) {
        this.parent = parent;
    }
    ColumnWidthService.prototype.setMinwidthBycalculation = function (tWidth) {
        var difference = 0;
        var collection = this.parent.getColumns().filter(function (a) {
            return sf.base.isNullOrUndefined(a.width) || a.width === 'auto';
        });
        if (collection.length) {
            if (!sf.base.isNullOrUndefined(this.parent.options.width) && this.parent.options.width !== 'auto') {
                difference = (typeof this.parent.options.width === 'string' ? parseInt(this.parent.options.width, 10) : this.parent.options.width) - tWidth;
            }
            var tmWidth = 0;
            for (var _i = 0, collection_1 = collection; _i < collection_1.length; _i++) {
                var cols = collection_1[_i];
                tmWidth += !sf.base.isNullOrUndefined(cols.minWidth) ?
                    ((typeof cols.minWidth === 'string' ? parseInt(cols.minWidth, 10) : cols.minWidth)) : 0;
            }
            for (var i = 0; i < collection.length; i++) {
                if (tWidth === 0 && this.parent.options.allowResizing && this.isWidthUndefined() && (i !== collection.length - 1)) {
                    this.setUndefinedColumnWidth(collection);
                }
                if (tWidth !== 0 && difference < tmWidth) {
                    this.setWidth(collection[i].minWidth, this.parent.getColumnIndexByField(collection[i].field));
                }
                else if (tWidth !== 0 && difference > tmWidth) {
                    this.setWidth('', this.parent.getColumnIndexByField(collection[i].field), true);
                }
            }
        }
    };
    ColumnWidthService.prototype.setUndefinedColumnWidth = function (collection) {
        for (var k = 0; k < collection.length; k++) {
            if (k !== collection.length - 1) {
                collection[k].width = 200;
                this.setWidth(200, this.parent.getColumnIndexByField(collection[k].field));
            }
        }
    };
    ColumnWidthService.prototype.setColumnWidth = function (column, index, module) {
        if (this.parent.getColumns().length < 1) {
            return;
        }
        var columnIndex = sf.base.isNullOrUndefined(index) ? this.parent.getNormalizedColumnIndex(column.uid) : index;
        var cWidth = this.getWidth(column);
        var tgridWidth = this.getTableWidth(this.parent.getColumns());
        if (cWidth !== null) {
            this.setWidth(cWidth, columnIndex);
            if (this.parent.options.width !== 'auto' && this.parent.options.width.toString().indexOf('%') === -1) {
                this.setMinwidthBycalculation(tgridWidth);
            }
            if ((this.parent.options.allowResizing && module === 'resize') || (this.parent.options.frozenColumns && this.parent.options.allowResizing)) {
                this.setWidthToTable();
            }
            this.parent.dotNetRef.invokeMethodAsync("ColumnWidthChanged", { index: columnIndex, width: cWidth, columnUid: column.uid });
        }
    };
    ColumnWidthService.prototype.setWidth = function (width, index, clear) {
        var chrome = 'chrome';
        var webstore = 'webstore';
        if (typeof (width) === 'string' && width.indexOf('%') !== -1 &&
            !(Boolean(window[chrome]) && Boolean(window[chrome][webstore])) && this.parent.options.allowGrouping) {
            var elementWidth = this.parent.element.offsetWidth;
            width = parseInt(width, 10) / 100 * (elementWidth);
        }
        var header = this.parent.getHeaderTable();
        var content = this.parent.getContentTable();
        var fWidth = sf.base.formatUnit(width);
        var headerCol;
        var frzCols = this.parent.options.frozenColumns;
        var mHdr = this.parent.getHeaderContent().querySelector('.e-movableheader');
        var mCont = this.parent.getContent().querySelector('.e-movablecontent');
        if (frzCols && index >= frzCols && mHdr && mHdr.querySelector('colgroup')) {
            headerCol = mHdr.querySelector('colgroup').children[index - frzCols];
        }
        else if (this.parent.options.enableColumnVirtualization && frzCols && mHdr.scrollLeft > 0) {
            var colGroup = mHdr.querySelector('colgroup');
            headerCol = colGroup.children[(colGroup.children.length - 1) - index];
        }
        else {
            headerCol = header.querySelector('colgroup').children[index];
        }
        if (headerCol && !clear) {
            headerCol.style.width = fWidth;
        }
        else if (headerCol && clear) {
            headerCol.style.width = ' ';
        }
        var contentCol;
        if (frzCols && index >= frzCols) {
            contentCol = this.parent.getContent().querySelector('.e-movablecontent')
                .querySelector('colgroup').children[index - frzCols];
        }
        else if (this.parent.options.enableColumnVirtualization && frzCols && mCont.scrollLeft > 0) {
            var colGroup = this.parent.getContent().querySelector('.e-movablecontent')
                .querySelector('colgroup');
            contentCol = colGroup.children[(colGroup.children.length - 1) - index];
        }
        else {
            contentCol = content.querySelector('colgroup').children[index];
        }
        if (contentCol && !clear) {
            contentCol.style.width = fWidth;
        }
        else if (contentCol && clear) {
            contentCol.style.width = ' ';
        }
        if (this.parent.options.aggregatesCount != 0) {
            var footerCol = void 0;
            if (frzCols && index >= frzCols) {
                var fmContent = this.parent.getFooterContent().querySelector('.e-movablefootercontent');
                var fmColgroup = !sf.base.isNullOrUndefined(fmContent) ? fmContent.querySelector('colgroup') : null;
                footerCol = !sf.base.isNullOrUndefined(fmColgroup) ? fmColgroup.children[index - frzCols] : null;
            }
            else {
                var tcolGroup = this.parent.getFooterContent().querySelector('colgroup');
                footerCol = !sf.base.isNullOrUndefined(tcolGroup) ? tcolGroup.children[index] : null;
            }
            if (contentCol && footerCol && !clear) {
                footerCol.style.width = fWidth;
            }
            else if (contentCol && footerCol && clear) {
                footerCol.style.width = ' ';
            }
        }
        var edit = this.parent.element.querySelectorAll('.e-table.e-inline-edit');
        var editTableCol = [];
        for (var i = 0; i < edit.length; i++) {
            if (parentsUntil(edit[i], 'e-grid').id === this.parent.element.id) {
                for (var j = 0; j < edit[i].querySelector('colgroup').children.length; j++) {
                    editTableCol.push(edit[i].querySelector('colgroup').children[j]);
                }
            }
        }
        if (edit.length && editTableCol.length) {
            editTableCol[index].style.width = fWidth;
        }
    };
    ColumnWidthService.prototype.isWidthUndefined = function () {
        var isWidUndefCount = this.parent.getColumns().filter(function (col) {
            return sf.base.isNullOrUndefined(col.width) && sf.base.isNullOrUndefined(col.minWidth);
        }).length;
        return (this.parent.getColumns().length === isWidUndefCount);
    };
    ColumnWidthService.prototype.getWidth = function (column) {
        //TODO: move it to c# side
        // if (isNullOrUndefined(column.width) && this.parent.options.allowResizing
        //     && isNullOrUndefined(column.minWidth) && !this.isWidthUndefined()) {
        //     column.width = 200;
        // }
        // if (this.parent.options.frozenColumns && isNullOrUndefined(column.width) &&
        //     column.index < this.parent.options.frozenColumns) {
        //     column.width = 200;
        // }
        if (!column.width) {
            return null;
        }
        var width = parseInt(column.width.toString(), 10);
        if (column.minWidth && width < parseInt(column.minWidth.toString(), 10)) {
            return column.minWidth;
        }
        else if ((column.maxWidth && width > parseInt(column.maxWidth.toString(), 10))) {
            return column.maxWidth;
        }
        else {
            return column.width;
        }
    };
    ColumnWidthService.prototype.getTableWidth = function (columns) {
        var tWidth = 0;
        for (var _i = 0, columns_1 = columns; _i < columns_1.length; _i++) {
            var column = columns_1[_i];
            var cWidth = this.getWidth(column);
            if (column.width === 'auto') {
                cWidth = 0;
            }
            if (column.visible !== false && cWidth !== null) {
                tWidth += parseInt(cWidth.toString(), 10);
            }
        }
        return tWidth;
    };
    ColumnWidthService.prototype.calcMovableOrFreezeColWidth = function (tableType) {
        var columns = this.parent.getColumns().slice();
        if (tableType === 'movable') {
            columns.splice(0, this.parent.options.frozenColumns);
        }
        else if (tableType === 'freeze') {
            columns.splice(this.parent.options.frozenColumns, columns.length);
        }
        return sf.base.formatUnit(this.getTableWidth(columns));
    };
    ColumnWidthService.prototype.setWidthToFrozenTable = function () {
        var freezeWidth = this.calcMovableOrFreezeColWidth('freeze');
        this.parent.getHeaderTable().style.width = freezeWidth;
        this.parent.getContentTable().style.width = freezeWidth;
        if (this.parent.getFooterContent() && this.parent.getFooterContent().querySelector('.e-frozenfootercontent').firstElementChild) {
            this.parent.getFooterContent().querySelector('.e-frozenfootercontent').firstElementChild.style.width = freezeWidth;
        }
    };
    ColumnWidthService.prototype.setWidthToMovableTable = function () {
        var movableWidth = '';
        var isColUndefined = this.parent.getColumns().filter(function (a) { return sf.base.isNullOrUndefined(a.width); }).length >= 1;
        var isWidthAuto = this.parent.getColumns().filter(function (a) { return (a.width === 'auto'); }).length >= 1;
        if (typeof this.parent.options.width === 'number' && !isColUndefined && !isWidthAuto) {
            movableWidth = sf.base.formatUnit(this.parent.options.width - parseInt(this.calcMovableOrFreezeColWidth('freeze').split('px')[0], 10) - 5);
        }
        else if (!isColUndefined && !isWidthAuto) {
            movableWidth = this.calcMovableOrFreezeColWidth('movable');
        }
        if (this.parent.getHeaderContent().querySelector('.e-movableheader').firstElementChild) {
            this.parent.getHeaderContent().querySelector('.e-movableheader').firstElementChild.style.width
                = movableWidth;
        }
        if (this.parent.getFooterContent() && this.parent.getFooterContent().querySelector('.e-movablefootercontent').firstElementChild) {
            this.parent.getFooterContent().querySelector('.e-movablefootercontent').firstElementChild.style.width = movableWidth;
        }
        this.parent.getContent().querySelector('.e-movablecontent').firstElementChild.style.width =
            movableWidth;
    };
    ColumnWidthService.prototype.setWidthToFrozenEditTable = function () {
        var freezeWidth = this.calcMovableOrFreezeColWidth('freeze');
        this.parent.element.querySelectorAll('.e-table.e-inline-edit')[0].style.width = freezeWidth;
    };
    ColumnWidthService.prototype.setWidthToMovableEditTable = function () {
        var movableWidth = this.calcMovableOrFreezeColWidth('movable');
        this.parent.element.querySelectorAll('.e-table.e-inline-edit')[1].style.width = movableWidth;
    };
    ColumnWidthService.prototype.setWidthToTable = function () {
        var tWidth = sf.base.formatUnit(this.getTableWidth(this.parent.getColumns()));
        if (this.parent.options.frozenColumns) {
            this.setWidthToFrozenTable();
            this.setWidthToMovableTable();
        }
        else {
            // if (this.parent.options.hasDetailTemplate) {
            //     this.setColumnWidth(new Column({ width: '30px' }));
            // }
            this.parent.getHeaderTable().style.width = tWidth;
            this.parent.getContentTable().style.width = tWidth;
            if (this.parent.options.aggregatesCount != 0) {
                this.parent.getFooterContent().querySelector(".e-table").style.width = tWidth;
            }
        }
        var edit = this.parent.element.querySelector('.e-table.e-inline-edit');
        if (edit && this.parent.options.frozenColumns) {
            this.setWidthToFrozenEditTable();
            this.setWidthToMovableEditTable();
        }
        else if (edit) {
            edit.style.width = tWidth;
        }
    };
    return ColumnWidthService;
}());

var resizeClassList = {
    root: 'e-rhandler',
    suppress: 'e-rsuppress',
    icon: 'e-ricon',
    helper: 'e-rhelper',
    header: 'th.e-headercell',
    cursor: 'e-rcursor'
};
/**
 * Resize handler
 */
var Resize = /** @class */ (function () {
    function Resize(parent) {
        this.tapped = false;
        this.isDblClk = true;
        this.parent = parent;
        this.widthService = new ColumnWidthService(this.parent);
    }
    /**
     * Resize by field names.
     * @param  {string|string[]} fName - Defines the field name.
     * @return {void}
     */
    Resize.prototype.autoFitColumns = function (fName) {
        var columnName = (fName === undefined || fName === null || fName.length <= 0) ?
            this.parent.getColumns().map(function (x) { return x.field; }) : (typeof fName === 'string') ? [fName] : fName;
        this.findColumn(columnName);
    };
    Resize.prototype.autoFit = function () {
        var newarray = this.parent.getColumns().filter(function (c) { return c.autoFit === true; })
            .map(function (c) { return c.field || c.headerText; });
        if (newarray.length > 0) {
            this.autoFitColumns(newarray);
        }
    };
    /* tslint:disable-next-line:max-func-body-length */
    Resize.prototype.resizeColumn = function (fName, index, id) {
        var gObj = this.parent;
        var tWidth = 0;
        var headerTable;
        var contentTable;
        var footerTable;
        var headerDivTag = 'e-gridheader';
        var contentDivTag = 'e-gridcontent';
        var footerDivTag = 'e-gridfooter';
        var indentWidth = 0;
        var uid = id ? id : this.parent.getUidByColumnField(fName);
        var columnIndex = this.parent.getNormalizedColumnIndex(uid);
        var headerTextClone;
        var contentTextClone;
        var footerTextClone;
        var columnIndexByField = this.parent.getColumnIndexByField(fName);
        var frzCols = gObj.options.frozenColumns;
        if (!sf.base.isNullOrUndefined(gObj.getFooterContent())) {
            footerTable = gObj.getFooterContent().querySelector('.e-table');
        }
        if (frzCols) {
            if (index < frzCols) {
                headerTable = gObj.getHeaderTable();
                contentTable = gObj.getContentTable();
                headerTextClone = headerTable.querySelector('[e-mappinguid="' + uid + '"]').parentElement.cloneNode(true);
                contentTextClone = contentTable.querySelectorAll("td:nth-child(" + (columnIndex + 1) + ")");
                if (footerTable) {
                    footerTextClone = footerTable.querySelectorAll("td:nth-child(" + (columnIndex + 1) + ")");
                }
            }
            else {
                headerTable = gObj.getHeaderContent().querySelector('.e-movableheader').children[0];
                contentTable = gObj.getContent().querySelector('.e-movablecontent').children[0];
                headerTextClone = headerTable.querySelector('[e-mappinguid="' + uid + '"]').parentElement.cloneNode(true);
                contentTextClone = contentTable.querySelectorAll("td:nth-child(" + ((columnIndex - frzCols) + 1) + ")");
                if (footerTable) {
                    footerTable = gObj.getFooterContent().querySelector('.e-movablefootercontent').children[0];
                    footerTextClone = footerTable.querySelectorAll("td:nth-child(" + ((columnIndex - frzCols) + 1) + ")");
                }
            }
        }
        else {
            headerTable = gObj.getHeaderTable();
            contentTable = gObj.getContentTable();
            headerTextClone = headerTable.querySelector('[e-mappinguid="' + uid + '"]').parentElement.cloneNode(true);
            contentTextClone = contentTable.querySelectorAll("td:nth-child(" + (columnIndex + 1) + "):not(.e-groupcaption)");
            if (footerTable) {
                footerTextClone = footerTable.querySelectorAll("td:nth-child(" + (columnIndex + 1) + "):not(.e-groupcaption)");
            }
        }
        var indentWidthClone = headerTable.querySelector('tr').querySelectorAll('.e-grouptopleftcell');
        if (indentWidthClone.length > 0) {
            for (var i = 0; i < indentWidthClone.length; i++) {
                indentWidth += indentWidthClone[i].offsetWidth;
            }
        }
        var detailsElement = contentTable.querySelector('.e-detailrowcollapse') ||
            contentTable.querySelector('.e-detailrowexpand');
        if ((this.parent.options.hasDetailTemplate) && detailsElement) {
            indentWidth += detailsElement.offsetWidth;
        }
        var headerText = [headerTextClone];
        var contentText = [];
        var footerText = [];
        if (footerTable) {
            for (var i = 0; i < footerTextClone.length; i++) {
                footerText[i] = footerTextClone[i].cloneNode(true);
            }
        }
        for (var i = 0; i < contentTextClone.length; i++) {
            contentText[i] = contentTextClone[i].cloneNode(true);
        }
        var wHeader = this.createTable(headerTable, headerText, headerDivTag);
        var wContent = this.createTable(contentTable, contentText, contentDivTag);
        var wFooter = null;
        if (footerText.length) {
            wFooter = this.createTable(footerTable, footerText, footerDivTag);
        }
        var columnbyindex = gObj.getColumns()[columnIndexByField];
        var result;
        var width = columnbyindex.width = sf.base.formatUnit(Math.max(wHeader, wContent, wFooter));
        this.widthService.setColumnWidth(gObj.getColumns()[columnIndexByField]);
        result = gObj.getColumns().some(function (x) { return x.width === null || x.width === undefined || x.width.length <= 0; });
        if (result === false) {
            var element = gObj.getColumns();
            for (var i = 0; i < element.length; i++) {
                if (element[i].visible) {
                    tWidth = tWidth + parseFloat(element[i].width);
                }
            }
        }
        var calcTableWidth = tWidth + indentWidth;
        if (tWidth > 0 && !gObj.options.frozenColumns) {
            //TODO: why this?
            // if (this.parent.options.hasDetailTemplate) {
            //     this.widthService.setColumnWidth(new Column({ width: '30px' }));
            // }
            headerTable.style.width = sf.base.formatUnit(calcTableWidth);
            contentTable.style.width = sf.base.formatUnit(calcTableWidth);
            if (!sf.base.isNullOrUndefined(footerTable)) {
                footerTable.style.width = sf.base.formatUnit(calcTableWidth);
            }
        }
        var tableWidth = headerTable.offsetWidth;
        var contentwidth = (gObj.getContent().scrollWidth);
        if (contentwidth > tableWidth) {
            headerTable.classList.add('e-tableborder');
            contentTable.classList.add('e-tableborder');
        }
        else {
            headerTable.classList.remove('e-tableborder');
            contentTable.classList.remove('e-tableborder');
        }
        if (!sf.base.isNullOrUndefined(footerTable)) {
            footerTable.classList.add('e-tableborder');
        }
        this.parent.freezeModule.refreshRowHeight();
        this.parent.dotNetRef.invokeMethodAsync("ColumnWidthChanged", { width: width, columnUid: uid });
    };
    /**
     * To destroy the resize
     * @return {void}
     * @hidden
     */
    Resize.prototype.destroy = function () {
        var gridElement = this.parent.element;
        if (!gridElement || (!gridElement.querySelector('.e-gridheader') && !gridElement.querySelector('.e-gridcontent'))) {
            return;
        }
        this.widthService = null;
        this.unwireEvents();
        //this.removeEventListener();
    };
    /**
     * For internal use only - Get the module name.
     * @private
     */
    Resize.prototype.getModuleName = function () {
        return 'resize';
    };
    Resize.prototype.findColumn = function (fName) {
        for (var i = 0; i < fName.length; i++) {
            var fieldName = fName[i];
            var columnIndex = this.parent.getColumnIndexByField(fieldName);
            var column = this.parent.getColumns()[columnIndex];
            if (columnIndex > -1 && !sf.base.isNullOrUndefined(column) && column.visible === true) {
                this.resizeColumn(fieldName, columnIndex);
            }
        }
    };
    /**
     * To create table for autofit
     * @hidden
     */
    Resize.prototype.createTable = function (table, text, tag) {
        var myTableDiv = sf.base.createElement('div');
        myTableDiv.className = this.parent.element.className;
        myTableDiv.style.cssText = 'display: inline-block;visibility:hidden;position:absolute';
        var mySubDiv = sf.base.createElement('div');
        mySubDiv.className = tag;
        var myTable = sf.base.createElement('table');
        myTable.className = table.className;
        myTable.classList.add('e-resizetable');
        myTable.style.cssText = 'table-layout: auto;width: auto';
        var myTr = sf.base.createElement('tr');
        for (var i = 0; i < text.length; i++) {
            var tr = myTr.cloneNode();
            tr.className = table.querySelector('tr').className;
            tr.appendChild(text[i]);
            myTable.appendChild(tr);
        }
        mySubDiv.appendChild(myTable);
        myTableDiv.appendChild(mySubDiv);
        document.body.appendChild(myTableDiv);
        var offsetWidthValue = myTable.getBoundingClientRect().width;
        document.body.removeChild(myTableDiv);
        return Math.ceil(offsetWidthValue);
    };
    /**
     * @hidden
     */
    // public addEventListener(): void {
    //     if (this.parent.isDestroyed) {
    //         return;
    //     }
    //     this.parent.on(events.headerRefreshed, this.refreshHeight, this);
    //     this.parent.on(events.initialEnd, this.wireEvents, this);
    //     this.parent.on(events.contentReady, this.autoFit, this);
    // }
    /**
     * @hidden
     */
    // public removeEventListener(): void {
    //     if (this.parent.isDestroyed) {
    //         return;
    //     }
    //     this.parent.off(events.headerRefreshed, this.refreshHeight);
    //     this.parent.off(events.initialEnd, this.wireEvents);
    // }
    /**
     * @hidden
     */
    Resize.prototype.render = function () {
        this.unwireEvents();
        this.wireEvents();
        this.setHandlerHeight();
    };
    Resize.prototype.refreshHeight = function () {
        var element = this.getResizeHandlers();
        for (var i = 0; i < element.length; i++) {
            if (element[i].parentElement.offsetHeight > 0) {
                element[i].style.height = element[i].parentElement.offsetHeight + 'px';
            }
        }
        this.setHandlerHeight();
    };
    Resize.prototype.wireEvents = function () {
        sf.base.EventHandler.add(this.parent.getHeaderContent(), sf.base.Browser.touchStartEvent, this.resizeStart, this);
        sf.base.EventHandler.add(this.parent.getHeaderContent(), 'dblclick', this.callAutoFit, this);
    };
    Resize.prototype.unwireEvents = function () {
        sf.base.EventHandler.remove(this.parent.getHeaderContent(), sf.base.Browser.touchStartEvent, this.resizeStart);
        sf.base.EventHandler.remove(this.parent.getHeaderContent(), 'dblclick', this.callAutoFit);
    };
    Resize.prototype.getResizeHandlers = function () {
        return this.parent.options.frozenColumns ?
            [].slice.call(this.parent.getHeaderContent().querySelectorAll('.' + resizeClassList.root))
            : [].slice.call(this.parent.getHeaderContent().querySelector(".e-table").querySelectorAll('.' + resizeClassList.root));
    };
    Resize.prototype.setHandlerHeight = function () {
        var element = [].slice.call(this.parent.getHeaderContent().querySelector(".e-table").querySelectorAll('.' + resizeClassList.suppress));
        for (var i = 0; i < element.length; i++) {
            element[i].style.height = element[i].parentElement.offsetHeight + 'px';
        }
    };
    Resize.prototype.callAutoFit = function (e) {
        if (e.target.classList.contains('e-rhandler')) {
            var col = this.getTargetColumn(e);
            if (col.columns) {
                return;
            }
            this.resizeColumn(col.field, this.parent.getNormalizedColumnIndex(col.uid), col.uid);
            var header = sf.base.closest(e.target, resizeClassList.header);
            header.classList.add('e-resized');
        }
    };
    Resize.prototype.resizeStart = function (e) {
        if (e.target.classList.contains('e-rhandler')) {
            if (!this.helper) {
                if (this.getScrollBarWidth() === 0) {
                    for (var _i = 0, _a = this.refreshColumnWidth(); _i < _a.length; _i++) {
                        var col = _a[_i];
                        this.widthService.setColumnWidth(col);
                    }
                    this.widthService.setWidthToTable();
                }
                this.refreshStackedColumnWidth();
                this.element = e.target;
                //TODO: rowheight
                // if (this.parent.getVisibleFrozenColumns()) {
                //     let mtbody: Element = this.parent.getContent().querySelector('.e-movablecontent').querySelector('tbody');
                //     let ftbody: Element = this.parent.getContent().querySelector('.e-frozencontent').querySelector('tbody');
                //     let mtr: NodeListOf<HTMLElement> = mtbody.querySelectorAll('tr');
                //     let ftr: NodeListOf<HTMLElement> = ftbody.querySelectorAll('tr');
                //     for (let i: number = 0; i < mtr.length; i++) {
                //         if (this.parent.rowHeight) {
                //             mtr[i].style.height = this.parent.rowHeight + 'px';
                //             ftr[i].style.height = this.parent.rowHeight + 'px';
                //         } else {
                //             mtr[i].style.removeProperty('height');
                //             ftr[i].style.removeProperty('height');
                //         }
                //     }
                // }
                this.parentElementWidth = this.parent.element.getBoundingClientRect().width;
                this.appendHelper();
                this.column = this.getTargetColumn(e);
                this.pageX = this.getPointX(e);
                if (this.parent.options.enableRtl) {
                    this.minMove = parseFloat(this.column.width.toString())
                        - (this.column.minWidth ? parseFloat(this.column.minWidth.toString()) : 0);
                }
                else {
                    this.minMove = (this.column.minWidth ? parseFloat(this.column.minWidth.toString()) : 0)
                        - parseFloat(sf.base.isNullOrUndefined(this.column.width) ? '' : this.column.width.toString());
                }
                this.minMove += this.pageX;
            }
            if (sf.base.Browser.isDevice && !this.helper.classList.contains(resizeClassList.icon)) {
                this.helper.classList.add(resizeClassList.icon);
                sf.base.EventHandler.add(document, sf.base.Browser.touchStartEvent, this.removeHelper, this);
                sf.base.EventHandler.add(this.helper, sf.base.Browser.touchStartEvent, this.resizeStart, this);
            }
            else {
                // let args: ResizeArgs = {
                //     e: isBlazor() && !this.parent.isJsComponent ? null : e,
                //     column: this.column
                // };
                // this.parent.trigger(events.resizeStart, args, (args: ResizeArgs) => {
                //     if (args.cancel || this.parent.isEdit) {
                //         this.cancelResizeAction();
                //         return;
                //     }
                sf.base.EventHandler.add(document, sf.base.Browser.touchEndEvent, this.resizeEnd, this);
                sf.base.EventHandler.add(this.parent.element, sf.base.Browser.touchMoveEvent, this.resizing, this);
                this.updateCursor('add');
                this.parent.dotNetRef.invokeMethodAsync("ResizeStarted", {
                    columnUid: this.column.uid
                });
                // });
            }
        }
    };
    Resize.prototype.cancelResizeAction = function (removeEvents) {
        if (removeEvents) {
            sf.base.EventHandler.remove(this.parent.element, sf.base.Browser.touchMoveEvent, this.resizing);
            sf.base.EventHandler.remove(document, sf.base.Browser.touchEndEvent, this.resizeEnd);
            this.updateCursor('remove');
        }
        if (sf.base.Browser.isDevice) {
            sf.base.EventHandler.remove(document, sf.base.Browser.touchStartEvent, this.removeHelper);
            sf.base.EventHandler.remove(this.helper, sf.base.Browser.touchStartEvent, this.resizeStart);
        }
        sf.base.detach(this.helper);
        this.refresh();
    };
    Resize.prototype.getWidth = function (width, minWidth, maxWidth) {
        if (minWidth && width < minWidth) {
            return minWidth;
        }
        else if ((maxWidth && width > maxWidth)) {
            return maxWidth;
        }
        else {
            return width;
        }
    };
    Resize.prototype.updateResizeEleHeight = function () {
        var elements = [].slice.call(this.parent.getHeaderContent().querySelectorAll('.e-rhandler'));
        for (var i = 0; i < elements.length; i++) {
            elements[i].style.height = elements[i].parentElement.offsetHeight + 'px';
        }
    };
    Resize.prototype.getColData = function (column, mousemove) {
        return {
            width: parseFloat(sf.base.isNullOrUndefined(this.widthService.getWidth(column)) || this.widthService.getWidth(column) === 'auto' ? '0'
                : this.widthService.getWidth(column).toString()) + mousemove,
            minWidth: column.minWidth ? parseFloat(column.minWidth.toString()) : null,
            maxWidth: column.maxWidth ? parseFloat(column.maxWidth.toString()) : null
        };
    };
    Resize.prototype.resizing = function (e) {
        if (sf.base.isNullOrUndefined(this.column)) {
            return;
        }
        var offsetWidth = 0;
        if (sf.base.isNullOrUndefined(this.column)) {
            offsetWidth = parentsUntil(this.element, 'th').offsetWidth;
        }
        if (this.parent.options.allowTextWrap) {
            this.updateResizeEleHeight();
            this.setHelperHeight();
        }
        var pageX = this.getPointX(e);
        var mousemove = this.parent.options.enableRtl ? -(pageX - this.pageX) : (pageX - this.pageX);
        var colData = this.getColData(this.column, mousemove);
        if (!colData.width) {
            colData.width = sf.base.closest(this.element, 'th').offsetWidth;
        }
        var width = this.getWidth(colData.width, colData.minWidth, colData.maxWidth);
        if ((!this.parent.options.enableRtl && this.minMove >= pageX) || (this.parent.options.enableRtl && this.minMove <= pageX)) {
            width = this.column.minWidth ? parseFloat(this.column.minWidth.toString()) : 0;
            this.pageX = pageX = this.minMove;
        }
        if (width !== parseFloat(sf.base.isNullOrUndefined(this.column.width) || this.column.width === 'auto' ?
            offsetWidth.toString() : this.column.width.toString())) {
            this.pageX = pageX;
            this.column.width = sf.base.formatUnit(width);
            // let args: ResizeArgs = {
            //     e: e,
            //     column: this.column
            // };
            //this.parent.trigger(events.onResize, args);
            // if (args.cancel) {
            //     this.cancelResizeAction(true);
            //     return;
            // }
            var columns = [this.column];
            var finalColumns = [this.column];
            if (this.column.columns) {
                columns = this.getSubColumns(this.column, []);
                columns = this.calulateColumnsWidth(columns, false, mousemove);
                finalColumns = this.calulateColumnsWidth(columns, true, mousemove);
            }
            for (var _i = 0, finalColumns_1 = finalColumns; _i < finalColumns_1.length; _i++) {
                var col = finalColumns_1[_i];
                this.widthService.setColumnWidth(col, null, 'resize');
            }
            this.updateHelper();
        }
        this.isDblClk = false;
    };
    Resize.prototype.calulateColumnsWidth = function (columns, isUpdate, mousemove) {
        var finalColumns = [];
        for (var _i = 0, columns_1 = columns; _i < columns_1.length; _i++) {
            var col = columns_1[_i];
            var totalWidth = 0;
            for (var i = 0; i < columns.length; i++) {
                totalWidth += parseFloat(columns[i].width.toString());
            }
            var colData = this.getColData(col, (parseFloat(col.width)) * mousemove / totalWidth);
            var colWidth = this.getWidth(colData.width, colData.minWidth, colData.maxWidth);
            if ((colWidth !== parseFloat(col.width.toString()))) {
                if (isUpdate) {
                    col.width = sf.base.formatUnit(colWidth < 1 ? 1 : colWidth);
                }
                finalColumns.push(col);
            }
        }
        return finalColumns;
    };
    Resize.prototype.getSubColumns = function (column, subColumns) {
        for (var _i = 0, _a = column.columns; _i < _a.length; _i++) {
            var col = _a[_i];
            if (col.visible !== false && col.allowResizing) {
                if (col.columns) {
                    this.getSubColumns(col, subColumns);
                }
                else {
                    subColumns.push(col);
                }
            }
        }
        return subColumns;
    };
    Resize.prototype.resizeEnd = function (e) {
        if (!this.helper) {
            return;
        }
        sf.base.EventHandler.remove(this.parent.element, sf.base.Browser.touchMoveEvent, this.resizing);
        sf.base.EventHandler.remove(document, sf.base.Browser.touchEndEvent, this.resizeEnd);
        this.updateCursor('remove');
        sf.base.detach(this.helper);
        // let args: ResizeArgs = {
        //     e: isBlazor() && !this.parent.isJsComponent ? null : e,
        //     column: this.column
        // };
        var content = this.parent.getContent();
        // let cTable: HTMLElement = content.querySelector('.e-movablecontent') ? content.querySelector('.e-movablecontent') : content;
        // if (cTable.scrollHeight >= cTable.clientHeight) {
        //     this.parent.scrollModule.setPadding();
        //     cTable.style.overflowY = 'scroll';
        // }
        //this.parent.trigger(events.resizeStop, args);
        sf.base.closest(this.element, '.e-headercell').classList.add('e-resized');
        if (parentsUntil(this.element, 'e-frozenheader')) {
            this.isFrozenColResized = true;
        }
        else {
            this.isFrozenColResized = false;
        }
        if (this.parent.options.frozenColumns) {
            this.parent.freezeModule.refreshRowHeight();
        }
        if (this.parent.options.allowTextWrap) {
            this.updateResizeEleHeight();
        }
        var width = this.column.width.toString();
        width = width.replace("px", "");
        this.parent.dotNetRef.invokeMethodAsync("ColumnWidthChanged", { width: width, columnUid: this.column.uid });
        this.refresh();
        this.doubleTapEvent(e);
        this.isDblClk = true;
    };
    Resize.prototype.getPointX = function (e) {
        if (e.touches && e.touches.length) {
            return e.touches[0].pageX;
        }
        else {
            return e.pageX;
        }
    };
    Resize.prototype.refreshColumnWidth = function () {
        var columns = this.parent.getColumns();
        for (var _i = 0, _a = [].slice.apply(this.parent.getHeaderContent().querySelectorAll('th.e-headercell')); _i < _a.length; _i++) {
            var ele = _a[_i];
            for (var _b = 0, columns_2 = columns; _b < columns_2.length; _b++) {
                var column = columns_2[_b];
                if (ele.querySelector('[e-mappinguid]') &&
                    ele.querySelector('[e-mappinguid]').getAttribute('e-mappinguid') === column.uid && column.visible) {
                    column.width = ele.getBoundingClientRect().width;
                    break;
                }
            }
        }
        return columns;
    };
    Resize.prototype.refreshStackedColumnWidth = function () {
        for (var _i = 0, _a = this.parent.getStackedColumns(this.parent.options.columns); _i < _a.length; _i++) {
            var stackedColumn = _a[_i];
            stackedColumn.width = this.getStackedWidth(stackedColumn, 0);
        }
    };
    Resize.prototype.getStackedWidth = function (column, width) {
        for (var _i = 0, _a = column.columns; _i < _a.length; _i++) {
            var col = _a[_i];
            if (col.visible !== false) {
                if (col.columns) {
                    this.getStackedWidth(col, width);
                }
                else {
                    width += col.width;
                }
            }
        }
        return width;
    };
    Resize.prototype.getTargetColumn = function (e) {
        var cell = sf.base.closest(e.target, resizeClassList.header);
        cell = cell.querySelector('.e-headercelldiv') || cell.querySelector('.e-stackedheadercelldiv');
        var uid = cell.getAttribute('e-mappinguid');
        return this.parent.getColumnByUid(uid);
    };
    Resize.prototype.updateCursor = function (action) {
        var headerRows = [].slice.call(this.parent.getHeaderContent().querySelectorAll('th'));
        headerRows.push(this.parent.element);
        for (var _i = 0, headerRows_1 = headerRows; _i < headerRows_1.length; _i++) {
            var row = headerRows_1[_i];
            row.classList[action](resizeClassList.cursor);
        }
    };
    Resize.prototype.refresh = function () {
        this.column = null;
        this.pageX = null;
        this.element = null;
        this.helper = null;
    };
    Resize.prototype.appendHelper = function () {
        this.helper = sf.base.createElement('div', {
            className: resizeClassList.helper
        });
        this.parent.element.appendChild(this.helper);
        this.setHelperHeight();
    };
    Resize.prototype.setHelperHeight = function () {
        var height = this.parent.getContent().offsetHeight - this.getScrollBarWidth();
        var rect = sf.base.closest(this.element, resizeClassList.header);
        var tr = [].slice.call(this.parent.getHeaderContent().querySelectorAll('tr'));
        var frzCols = this.parent.options.frozenColumns;
        if (frzCols) {
            if (rect.parentElement.children.length !== frzCols) {
                tr.splice(0, tr.length / 2);
            }
            else {
                tr.splice(tr.length / 2, tr.length / 2);
            }
        }
        for (var i = tr.indexOf(rect.parentElement); i < tr.length; i++) {
            height += tr[i].offsetHeight;
        }
        var pos = this.calcPos(rect);
        pos.left += (this.parent.options.enableRtl ? 0 - 1 : rect.offsetWidth - 2);
        this.helper.style.cssText = 'height: ' + height + 'px; top: ' + pos.top + 'px; left:' + Math.floor(pos.left) + 'px;';
    };
    Resize.prototype.getScrollBarWidth = function (height) {
        var ele = this.parent.options.frozenColumns ? this.parent.getContent().querySelector('.e-movablecontent')
            : this.parent.getContent();
        return (ele.scrollHeight > ele.clientHeight && height) ||
            ele.scrollWidth > ele.clientWidth ? getScrollBarWidth() : 0;
    };
    Resize.prototype.removeHelper = function (e) {
        var cls = e.target.classList;
        if (!(cls.contains(resizeClassList.root) || cls.contains(resizeClassList.icon)) && this.helper) {
            sf.base.EventHandler.remove(document, sf.base.Browser.touchStartEvent, this.removeHelper);
            sf.base.EventHandler.remove(this.helper, sf.base.Browser.touchStartEvent, this.resizeStart);
            sf.base.detach(this.helper);
            this.refresh();
        }
    };
    Resize.prototype.updateHelper = function () {
        var rect = sf.base.closest(this.element, resizeClassList.header);
        var left = Math.floor(this.calcPos(rect).left + (this.parent.options.enableRtl ? 0 - 1 : rect.offsetWidth - 2));
        var borderWidth = 2; // to maintain the helper inside of grid element.
        if (left > this.parentElementWidth) {
            left = this.parentElementWidth - borderWidth;
        }
        if (this.parent.options.frozenColumns) {
            var table = sf.base.closest(rect, '.e-table');
            var fLeft = table.offsetLeft;
            if (left < fLeft) {
                left = fLeft;
            }
        }
        this.helper.style.left = left + 'px';
    };
    Resize.prototype.calcPos = function (elem) {
        var parentOffset = {
            top: 0,
            left: 0
        };
        var offset = elem.getBoundingClientRect();
        var doc = elem.ownerDocument;
        var offsetParent = elem.offsetParent || doc.documentElement;
        while (offsetParent &&
            (offsetParent === doc.body || offsetParent === doc.documentElement) &&
            offsetParent.style.position === 'static') {
            offsetParent = offsetParent.parentNode;
        }
        if (offsetParent && offsetParent !== elem && offsetParent.nodeType === 1) {
            parentOffset = offsetParent.getBoundingClientRect();
        }
        return {
            top: offset.top - parentOffset.top,
            left: offset.left - parentOffset.left
        };
    };
    Resize.prototype.doubleTapEvent = function (e) {
        if (this.getUserAgent() && this.isDblClk) {
            if (!this.tapped) {
                this.tapped = setTimeout(this.timeoutHandler(), 300);
            }
            else {
                clearTimeout(this.tapped);
                this.callAutoFit(e);
                this.tapped = null;
            }
        }
    };
    Resize.prototype.getUserAgent = function () {
        var userAgent = sf.base.Browser.userAgent.toLowerCase();
        return /iphone|ipod|ipad/.test(userAgent);
    };
    Resize.prototype.timeoutHandler = function () {
        this.tapped = null;
    };
    return Resize;
}());

/**
 *
 * The `Group` module is used to handle group action.
 */
var Group = /** @class */ (function () {
    /**
     * Constructor for Grid group module
     * @hidden
     */
    function Group(parent) {
        var _this = this;
        this.visualElement = sf.base.createElement('div', {
            className: 'e-cloneproperties e-dragclone e-gdclone',
            styles: 'line-height:23px', attrs: { action: 'grouping' }
        });
        this.helper = function (e) {
            var gObj = _this.parent;
            var target = e.sender.target;
            var element = target.classList.contains('e-groupheadercell') ? target :
                parentsUntil(target, 'e-groupheadercell');
            if (!element || (!target.classList.contains('e-drag') && _this.parent.options.groupReordering)) {
                return false;
            }
            _this.column = gObj.getColumnByField(element.firstElementChild.getAttribute('ej-mappingname'));
            _this.visualElement.textContent = element.textContent;
            _this.visualElement.style.width = element.offsetWidth + 2 + 'px';
            _this.visualElement.style.height = element.offsetHeight + 2 + 'px';
            _this.visualElement.setAttribute('e-mappinguid', _this.column.uid);
            gObj.element.appendChild(_this.visualElement);
            return _this.visualElement;
        };
        this.dragStart = function (e) {
            _this.parent.element.classList.add('e-ungroupdrag');
            e.bindEvents(e.dragElement);
        };
        this.drag = function (e) {
            // if (this.groupSettings.allowReordering) {
            //     this.animateDropper(e);
            // }
            var target = e.target;
            var cloneElement = _this.parent.element.querySelector('.e-cloneproperties');
            // this.parent.trigger(events.columnDrag, { target: target, draggableType: 'headercell', column: this.column });
            if (!_this.parent.options.groupReordering) {
                sf.base.classList(cloneElement, ['e-defaultcur'], ['e-notallowedcur']);
                if (!(parentsUntil(target, 'e-gridcontent') || parentsUntil(target, 'e-headercell'))) {
                    sf.base.classList(cloneElement, ['e-notallowedcur'], ['e-defaultcur']);
                }
            }
        };
        this.dragStop = function (e) {
            _this.parent.element.classList.remove('e-ungroupdrag');
            var preventDrop = !(parentsUntil(e.target, 'e-gridcontent') || parentsUntil(e.target, 'e-gridheader'));
            // if (this.groupSettings.allowReordering && preventDrop) {     //TODO: reordering
            //     remove(e.helper);
            //     if (parentsUntil(e.target, 'e-groupdroparea')) {
            //         this.rearrangeGroup(e);
            //     } else if (!(parentsUntil(e.target, 'e-grid'))) {
            //         let field: string = this.parent.getColumnByUid(e.helper.getAttribute('e-mappinguid')).field;
            //         if (this.groupSettings.columns.indexOf(field) !== -1) {
            //             this.ungroupColumn(field);
            //         }
            //     }
            //     return;
            // } else
            if (preventDrop) {
                sf.base.remove(e.helper);
                return;
            }
        };
        //TODO: reordering
        // private animateDropper: Function = (e: { target: HTMLElement, event: MouseEventArgs, helper: Element }) => {
        //     let uid: string = this.parent.element.querySelector('.e-cloneproperties').getAttribute('e-mappinguid');
        //     let dragField: string = this.parent.getColumnByUid(uid).field;
        //     let parent: Element = parentsUntil(e.target, 'e-groupdroparea');
        //     let dropTarget: Element = parentsUntil(e.target, 'e-group-animator');
        //     // tslint:disable-next-line
        //     let grouped: string[] = [].slice.call(this.element.querySelectorAll('.e-groupheadercell'))
        //         .map((e: Element) => e.querySelector('div').getAttribute('ej-mappingname'));
        //     let cols: string[] = JSON.parse(JSON.stringify(grouped));
        //     if (dropTarget || parent) {
        //         if (dropTarget) {
        //             let dropField: string = dropTarget.querySelector('div[ej-mappingname]').getAttribute('ej-mappingname');
        //             let dropIndex: number = +(dropTarget.getAttribute('index'));
        //             if (dropField !== dragField) {
        //                 let dragIndex: number = cols.indexOf(dragField);
        //                 if (dragIndex !== -1) {
        //                     cols.splice(dragIndex, 1);
        //                 }
        //                 let flag: boolean = dropIndex !== -1 && dragIndex === dropIndex;
        //                 cols.splice(dropIndex + (flag ? 1 : 0), 0, dragField);
        //             }
        //         } else if (parent && cols.indexOf(dragField) === -1) {
        //             cols.push(dragField);
        //         }
        //         this.element.innerHTML = '';
        //         if (cols.length && !this.element.classList.contains('e-grouped')) {
        //             this.element.classList.add('e-grouped');
        //         }
        //         this.reorderingColumns = cols;
        //         for (let c: number = 0; c < cols.length; c++) {
        //             this.addColToGroupDrop(cols[c]);
        //         }
        //     } else {
        //         this.addLabel();
        //         this.removeColFromGroupDrop(dragField);
        //     }
        // }
        // private rearrangeGroup(e: { target: HTMLElement, event: MouseEventArgs, helper: Element }): void {
        //     this.sortRequired = false;
        //     this.updateModel();
        // }
        this.drop = function (e) {
            var gObj = _this.parent;
            var column = gObj.getColumnByUid(e.droppedElement.getAttribute('e-mappinguid'));
            gObj.element.querySelector('.e-groupdroparea').classList.remove('e-hover');
            sf.base.remove(e.droppedElement);
            _this.parent.element.querySelector('.e-groupdroparea').removeAttribute("aria-dropeffect");
            _this.parent.element.querySelector('[aria-grabbed=true]').setAttribute("aria-grabbed", 'false');
            if (sf.base.isNullOrUndefined(column) || column.allowGrouping === false
                || parentsUntil(gObj.getColumnHeaderByUid(column.uid), 'e-grid').getAttribute('id') !==
                    gObj.element.getAttribute('id')) {
                return;
            }
            gObj.dotNetRef.invokeMethodAsync("GroupColumn", column.field, 'Group');
        };
        this.parent = parent;
        if (this.parent.options.allowGrouping && this.parent.options.showDropArea) {
            this.initDragAndDrop();
        }
    }
    Group.prototype.columnDrag = function (e) {
        if (this.parent.options.groupReordering) {
            // this.animateDropper(e);
        }
        var gObj = this.parent;
        var cloneElement = this.parent.element.querySelector('.e-cloneproperties');
        sf.base.classList(cloneElement, ['e-defaultcur'], ['e-notallowedcur']);
        if (!parentsUntil(e.target, 'e-groupdroparea') &&
            !(this.parent.options.groupReordering && parentsUntil(e.target, 'e-headercell'))) {
            sf.base.classList(cloneElement, ['e-notallowedcur'], ['e-defaultcur']);
        }
        e.target.classList.contains('e-groupdroparea') ?
            gObj.element.querySelector('.e-groupdroparea').classList.add('e-hover') :
            gObj.element.querySelector('.e-groupdroparea').classList.remove('e-hover');
    };
    Group.prototype.columnDragStart = function (e) {
        if (e.target.classList.contains('e-stackedheadercell')) {
            return;
        }
        var dropArea = this.parent.element.querySelector('.e-groupdroparea');
        if (dropArea) {
            dropArea.setAttribute("aria-dropeffect", "copy");
        }
        var element = e.target.classList.contains('e-headercell') ? e.target : parentsUntil(e.target, 'e-headercell');
        element.setAttribute("aria-grabbed", 'true');
    };
    Group.prototype.columnDrop = function (e) {
        var gObj = this.parent;
        if (e.droppedElement.getAttribute('action') === 'grouping') {
            var column = gObj.getColumnByUid(e.droppedElement.getAttribute('e-mappinguid'));
            if (sf.base.isNullOrUndefined(column) || column.allowGrouping === false
                || parentsUntil(gObj.getColumnHeaderByUid(column.uid), 'e-grid').getAttribute('id') !==
                    gObj.element.getAttribute('id')) {
                return;
            }
            gObj.dotNetRef.invokeMethodAsync("GroupColumn", column.field, 'Ungroup');
        }
    };
    // private keyPressHandler(e: KeyboardEventArgs): void {
    //     let gObj: SfGrid = this.parent;
    //     if (e.action !== 'ctrlSpace' && (!this.groupSettings.columns.length ||
    //         ['altDownArrow', 'altUpArrow', 'ctrlDownArrow', 'ctrlUpArrow', 'enter'].indexOf(e.action) === -1)) {
    //         return;
    //     }
    //     e.preventDefault();
    //     switch (e.action) {
    //         case 'altDownArrow':
    //         case 'altUpArrow':
    //             let selected: number[] = gObj.allowSelection ? gObj.getSelectedRowIndexes() : [];
    //             if (selected.length) {
    //                 let rows: HTMLCollection = gObj.getContentTable().querySelector('tbody').children;
    //                 let dataRow: HTMLTableRowElement = gObj.getDataRows()[selected[selected.length - 1]] as HTMLTableRowElement;
    //                 let grpRow: Element;
    //                 for (let i: number = dataRow.rowIndex; i >= 0; i--) {
    //                     if (!rows[i].classList.contains('e-row') && !rows[i].classList.contains('e-detailrow')) {
    //                         grpRow = rows[i];
    //                         break;
    //                     }
    //                 }
    //                 this.expandCollapseRows(grpRow.querySelector(e.action === 'altUpArrow' ?
    //                     '.e-recordplusexpand' : '.e-recordpluscollapse'));
    //             }
    //             break;
    //         case 'ctrlDownArrow':
    //             this.expandAll();
    //             break;
    //         case 'ctrlUpArrow':
    //             this.collapseAll();
    //             break;
    //         case 'enter':
    //             if (this.parent.isEdit || (closest(e.target as Element, '#' + this.parent.element.id + '_searchbar') !== null)) { return; }
    //             let element: HTMLElement = this.focus.getFocusedElement();
    //             let row: Element = element ? element.parentElement.querySelector('[class^="e-record"]') : null;
    //             if (!row) { break; }
    //             this.expandCollapseRows(row);
    //             break;
    //         case 'ctrlSpace':
    //             let elem: HTMLElement = gObj.focusModule.currentInfo.element;
    //             if (elem && elem.classList.contains('e-headercell')) {
    //                 let column: Column = gObj.getColumnByUid(elem.firstElementChild.getAttribute('e-mappinguid'));
    //                 column.field && gObj.groupSettings.columns.indexOf(column.field) < 0 ?
    //                     this.groupColumn(column.field) : this.ungroupColumn(column.field);
    //             }
    //             break;
    //     }
    // }
    Group.prototype.initDragAndDrop = function () {
        this.initializeGHeaderDrop();
        this.initializeGHeaderDrag();
    };
    Group.prototype.initializeGHeaderDrag = function () {
        var ele = this.parent.element.querySelector('.e-groupdroparea');
        if (!ele) {
            return;
        }
        var drag = new sf.base.Draggable(ele, {
            dragTarget: this.parent.options.groupReordering ? '.e-drag' : '.e-groupheadercell',
            distance: this.parent.options.groupReordering ? -10 : 5,
            helper: this.helper,
            dragStart: this.dragStart,
            drag: this.drag,
            dragStop: this.dragStop
        });
    };
    Group.prototype.initializeGHeaderDrop = function () {
        var gObj = this.parent;
        var ele = this.parent.element.querySelector('.e-groupdroparea');
        if (!ele) {
            return;
        }
        var drop = new sf.base.Droppable(ele, {
            accept: '.e-dragclone',
            drop: this.drop
        });
    };
    /**
     * For internal use only - Get the module name.
     * @private
     */
    Group.prototype.getModuleName = function () {
        return 'group';
    };
    Group.prototype.getGHeaderCell = function (field) {
        if (this.element && this.element.querySelector('[ej-mappingname="' + field + '"]')) {
            return this.element.querySelector('[ej-mappingname="' + field + '"]').parentElement;
        }
        return null;
    };
    return Group;
}());

/**
 * The `ColumnChooser` module is used to show or hide columns dynamically.
 */
var ColumnChooser = /** @class */ (function () {
    function ColumnChooser(parent) {
        this.mediaCol = [];
        this.media = {};
        this.mediaBindInstance = {};
        this.mediaColVisibility = {};
        this.noOfTimesInvokedByMedia = 0;
        this.parent = parent;
    }
    /**
     * Get columnChooser Position.
     * @return {void}
     * @hidden
     */
    ColumnChooser.prototype.renderColumnChooser = function () {
        var dlgelement = this.parent.element.querySelector("#" + this.parent.element.id + "_ccdlg");
        dlgelement.style.maxHeight = '430px';
        var elementVisible = dlgelement.style.display;
        dlgelement.style.display = 'block';
        var newpos = sf.popups.calculateRelativeBasedPosition(this.parent.element.querySelector(".e-cc-toolbar"), dlgelement);
        dlgelement.style.display = elementVisible;
        var top = newpos.top + this.parent.element.querySelector(".e-cc-toolbar").getBoundingClientRect().height;
        var dlgWidth = 250;
        var left;
        if (this.parent.options.enableRtl) {
            left = this.parent.element.querySelector(".e-columnchooser-btn").offsetLeft;
        }
        else {
            left = ((newpos.left - dlgWidth) + this.parent.element.querySelector(".e-cc-toolbar").clientWidth) + 2;
        }
        this.parent.dotNetRef.invokeMethodAsync("GetChooserPosition", left.toString(), top.toString());
    };
    ColumnChooser.prototype.setMediaColumns = function () {
        var gcol = this.parent.getColumns();
        if (!sf.base.isNullOrUndefined(gcol)) {
            for (var index = 0; index < gcol.length; index++) {
                if (gcol[index].hideAtMedia !== '' && (sf.base.isNullOrUndefined(gcol[index].visible) || gcol[index].visible)) {
                    this.pushMediaColumn(gcol[index], index);
                }
            }
            this.parent.dotNetRef.invokeMethodAsync('SetMediaColumnVisibility', {
                mediaColVisibility: this.mediaColVisibility
            });
            this.mediaColVisibility = {};
        }
    };
    ColumnChooser.prototype.pushMediaColumn = function (col, index) {
        this.mediaCol.push(col);
        this.media[col.uid] = window.matchMedia(col.hideAtMedia);
        this.mediaQueryUpdate(index, this.media[col.uid], true);
        this.mediaBindInstance[index] = this.mediaQueryUpdate.bind(this, index);
        this.media[col.uid].addListener(this.mediaBindInstance[index]);
    };
    ColumnChooser.prototype.mediaQueryUpdate = function (columnIndex, e, invokedManually) {
        var col = this.parent.getColumns()[columnIndex];
        if (this.mediaCol.some(function (mediaColumn) { return mediaColumn.uid === col.uid; })) {
            this.mediaColVisibility[col.uid] = e.matches;
            if (!invokedManually) {
                this.noOfTimesInvokedByMedia++;
                if (this.noOfTimesInvokedByMedia == this.mediaCol.length) {
                    this.parent.dotNetRef.invokeMethodAsync('SetMediaColumnVisibility', {
                        mediaColVisibility: this.mediaColVisibility,
                        invokedByMedia: true
                    });
                    this.noOfTimesInvokedByMedia = 0;
                    this.mediaColVisibility = {};
                }
            }
        }
    };
    ColumnChooser.prototype.updateMediaColumns = function (mediaColumnsUid) {
        var keys = Object.keys(mediaColumnsUid);
        var _loop_1 = function (i) {
            var idxToSplice = -1;
            if (this_1.mediaCol.some(function (mCol) {
                idxToSplice++;
                return mCol.uid === keys[i];
            })) {
                this_1.mediaCol.splice(idxToSplice, 1);
            }
            else {
                this_1.pushMediaColumn(this_1.parent.getColumnByUid(keys[i]), this_1.parent.getColumnIndexByUid(keys[i]));
            }
        };
        var this_1 = this;
        for (var i = 0; i < keys.length; i++) {
            _loop_1(i);
        }
    };
    ColumnChooser.prototype.removeMediaListener = function () {
        for (var i = 0; i < this.mediaCol.length; i++) {
            this.media[this.mediaCol[i].uid].removeListener(this.mediaBindInstance[this.mediaCol[i].index]);
        }
    };
    return ColumnChooser;
}());

/**
 * The `ColumnMenu` module is used to show or hide columns dynamically.
 */
var ColumnMenu = /** @class */ (function () {
    function ColumnMenu(parent) {
        this.key = null;
        this.uid = null;
        this.parent = parent;
    }
    /**
     * Get columnMenu Position.
     * @return {void}
     * @hidden
     */
    ColumnMenu.prototype.renderColumnMenu = function (uid, isFilter, key) {
        this.key = key;
        this.uid = uid;
        var e = this.parent.getColumnHeaderByUid(uid).querySelector('.e-columnmenu');
        var columnMenuElement = document.getElementsByClassName("e-" + this.parent.element.id + "-column-menu")[0];
        var element = columnMenuElement.getElementsByTagName('ul')[0];
        if (!sf.base.isNullOrUndefined(element)) {
            var pos = { top: 0, left: 0 };
            element.style.visibility = 'hidden';
            columnMenuElement.style.display = 'block';
            var elePos = element.getBoundingClientRect();
            element.classList.add('e-transparent');
            element.style.visibility = '';
            columnMenuElement.style.display = '';
            var headerCell = this.getHeaderCell(e);
            if (sf.base.Browser.isDevice) {
                pos.top = ((window.innerHeight / 2) - (elePos.height / 2));
                pos.left = ((window.innerWidth / 2) - (elePos.width / 2));
            }
            else {
                if (this.parent.options.enableRtl) {
                    pos = sf.popups.calculatePosition(headerCell, 'left', 'bottom');
                }
                else {
                    pos = sf.popups.calculatePosition(headerCell, 'right', 'bottom');
                    pos.left -= elePos.width;
                }
            }
            if (isFilter) {
                sf.base.EventHandler.add(element, 'mouseover', this.appendFilter, this);
            }
            return { Left: Math.ceil(pos.left), Top: Math.ceil(pos.top) };
        }
        else {
            return { Left: 1, Top: 1 };
        }
    };
    
    ColumnMenu.prototype.appendFilter = function (e) {
        var _this = this;
        var showdialog = false;
        setTimeout(function () {
            if ((sf.base.closest(e.target, '#' + _this.key)) && (_this.parent.element.querySelector('.e-filter-popup') || !_this.parent.element.querySelector('.e-filter-popup'))
                || e.target.parentElement.id == _this.key && (_this.parent.element.querySelector('.e-filter-popup') || !_this.parent.element.querySelector('.e-filter-popup'))) {
                showdialog = true;
            }
            else if (!sf.base.closest(e.target, '#' + _this.key) && _this.parent.element.querySelector('.e-filter-popup')) {
                showdialog = false;
            }
            _this.parent.dotNetRef.invokeMethodAsync("FilterMouseOverHandler", _this.uid, showdialog);
        }, 10);
    };
    ColumnMenu.prototype.getHeaderCell = function (e) {
        return sf.base.closest(e, 'th.e-headercell');
    };
    return ColumnMenu;
}());

/**
 * The `Filter` module is used to set the Filter Dialog position dynamically.
 */
var Filter = /** @class */ (function () {
    function Filter(parent) {
        this.parent = parent;
    }
    /**
     * Get Filter Popup Position.
     * @return {void}
     * @hidden
     */
    Filter.prototype.filterPopupRender = function (dlgID, ColUid, type, isColumnMenu) {
        var dlgelement = this.parent.element.querySelector("#" + dlgID);
        if (!sf.base.isNullOrUndefined(dlgelement)) {
            if (isColumnMenu) {
                sf.base.EventHandler.add(dlgelement, 'mousedown', this.mouseDownHandler, this);
                dlgelement.style.maxHeight = type == 'excel' ? '800px' : '350px';
                var element = document.getElementsByClassName("e-" + this.parent.element.id + "-column-menu")[0].getElementsByTagName('ul')[0];
                var li = element.querySelector('.' + 'e-icon-filter').parentElement;
                var ul = this.parent.element.querySelector('.' + 'e-filter-popup');
                var gridPos = this.parent.element.getBoundingClientRect();
                var liPos = li.getBoundingClientRect();
                var left = liPos.left - gridPos.left;
                var top_1 = liPos.top - gridPos.top;
                var elementVisible = dlgelement.style.display;
                dlgelement.style.display = 'block';
                if (gridPos.height < top_1) {
                    top_1 = top_1 - ul.offsetHeight + liPos.height;
                }
                else if (gridPos.height < top_1 + ul.offsetHeight) {
                    top_1 = gridPos.height - ul.offsetHeight;
                }
                if (window.innerHeight < ul.offsetHeight + top_1 + gridPos.top) {
                    top_1 = window.innerHeight - ul.offsetHeight - gridPos.top;
                }
                left += (this.parent.options.enableRtl ? -ul.offsetWidth : liPos.width);
                if (gridPos.width <= left + ul.offsetWidth) {
                    left -= liPos.width + ul.offsetWidth;
                }
                else if (left < 0) {
                    left += ul.offsetWidth + liPos.width;
                }
                dlgelement.style.display = elementVisible;
                this.parent.dotNetRef.invokeMethodAsync("GetFilterIconPosition", left.toString(), top_1.toString());
            }
            else {
                var FilterElement = [].slice.call(this.parent.element.querySelector('.e-headercontent').querySelectorAll('div[e-mappinguid=' + ColUid + ']'));
                var targetElement = FilterElement[1];
                dlgelement.style.maxHeight = type == 'excel' ? '800px' : '350px';
                var elementVisible = dlgelement.style.display;
                dlgelement.style.display = 'block';
                var newpos = sf.popups.calculateRelativeBasedPosition(targetElement, dlgelement);
                dlgelement.style.display = elementVisible;
                var dlgWidth = 250;
                var left = newpos.left - dlgWidth + targetElement.clientWidth;
                var top_2 = newpos.top + targetElement.getBoundingClientRect().height - 5;
                if (left < 1)
                    left = dlgWidth + left - 16;
                else
                    left = left - 4;
                this.parent.dotNetRef.invokeMethodAsync("GetFilterIconPosition", left.toString(), top_2.toString());
            }
        }
    };
    Filter.prototype.mouseDownHandler = function (args) {
        if ((args && sf.base.closest(args.target, '.e-filter-popup')
            || (args.currentTarget && args.currentTarget.activeElement &&
                parentsUntil(args.currentTarget.activeElement, 'e-filter-popup'))
            || parentsUntil(args.target, 'e-popup') ||
            (parentsUntil(args.target, 'e-popup-wrapper'))) && !sf.base.Browser.isDevice) {
            this.parent.dotNetRef.invokeMethodAsync("PreventColumnMenuClose", true);
        }
    };
    return Filter;
}());

/**
 * Editing
 */
var Edit = /** @class */ (function () {
    function Edit(parent) {
        this.parent = parent;
    }
    Edit.prototype.createTooltip = function (results, isAdd) {
        var toolTipPos = {};
        for (var i = 0; i < results.length; i++) {
            var gcontent = this.parent.getContent().firstElementChild;
            if (this.parent.options.frozenColumns) {
                gcontent = this.parent.getContent().querySelector('.e-movablecontent');
            }
            var name_1 = results[i]['fieldName'];
            var message = results[i]['message'];
            name_1 = name_1.replace(/[.]/g, "___");
            var element = this.parent.element.querySelector("#" + name_1) ||
                document.querySelector("#" + name_1);
            var isScroll = gcontent.scrollHeight > gcontent.clientHeight || gcontent.scrollWidth > gcontent.clientWidth;
            var isInline = this.parent.options.editMode !== 'Dialog';
            if (!element) {
                return;
            }
            var td = sf.base.closest(element, '.e-rowcell');
            var row = sf.base.closest(element, '.e-row');
            var fCont = this.parent.getContent().querySelector('.e-frozencontent');
            var isFHdr = void 0;
            var isFHdrLastRow = false;
            var validationForBottomRowPos = void 0;
            var isBatchModeLastRow = false;
            var viewPortRowCount = Math.round(this.parent.getContent().clientHeight / this.parent.getRowHeight()) - 1;
            var rows = [].slice.call(this.parent.getContent().querySelectorAll('.e-row'));
            if (this.parent.options.editMode === 'Batch') {
                if (viewPortRowCount > 1 && rows.length >= viewPortRowCount
                    && rows[rows.length - 1].getAttribute('aria-rowindex') === row.getAttribute('aria-rowindex')) {
                    isBatchModeLastRow = true;
                }
            }
            if (isInline) {
                if (this.parent.options.frozenRows) {
                    // TODO: FrozenRows
                    // let fHeraderRows: HTMLCollection = this.parent.getFrozenColumns() ?
                    //     this.parent.getFrozenVirtualHeader().querySelector('tbody').children
                    //     : this.parent.getHeaderTable().querySelector('tbody').children;
                    // isFHdr = fHeraderRows.length > (parseInt(row.getAttribute('aria-rowindex'), 10) || 0);
                    // isFHdrLastRow = isFHdr && parseInt(row.getAttribute('aria-rowindex'), 10) === fHeraderRows.length - 1;
                }
                if (isFHdrLastRow ||
                    //viewPortRowCount > 1 && rows.length >= viewPortRowCount
                    ((this.parent.options.newRowPosition === 'Bottom' && isAdd || (!sf.base.isNullOrUndefined(td) &&
                        td.classList.contains('e-lastrowcell') && !row.classList.contains('e-addedrow'))) || isBatchModeLastRow)) {
                    validationForBottomRowPos = true;
                }
            }
            var table = isInline ?
                (isFHdr ? this.parent.getHeaderTable() : this.parent.getContentTable()) :
                document.querySelector('#' + this.parent.element.id + '_dialogEdit_wrapper').querySelector('.e-dlg-content');
            var client = table.getBoundingClientRect();
            var left = isInline ?
                this.parent.element.getBoundingClientRect().left : client.left;
            var input = sf.base.closest(element, 'td');
            var inputClient = input ? input.getBoundingClientRect() : element.parentElement.getBoundingClientRect();
            var div = this.parent.element.querySelector("#" + name_1 + "_Error") ||
                document.querySelector("#" + name_1 + "_Error");
            div.style.top =
                ((isFHdr ? inputClient.top + inputClient.height : inputClient.bottom - client.top
                    - (this.parent.options.frozenColumns ? fCont.scrollTop : 0)) + table.scrollTop + 9) + 'px';
            div.style.left =
                (inputClient.left - left + table.scrollLeft + inputClient.width / 2) + 'px';
            div.style.maxWidth = inputClient.width + 'px';
            if (isInline && client.left < left) {
                div.style.left = parseInt(div.style.left, 10) - client.left + left + 'px';
            }
            var arrow = void 0;
            if (validationForBottomRowPos) {
                arrow = div.querySelector('.e-tip-bottom');
            }
            else {
                arrow = div.querySelector('.e-tip-top');
            }
            if ((this.parent.options.frozenColumns || this.parent.options.frozenRows) && this.parent.options.editMode !== 'Dialog') {
                var getEditCell = this.parent.options.editMode === 'Normal' ?
                    sf.base.closest(element, '.e-editcell') : sf.base.closest(element, '.e-table');
                getEditCell.style.position = 'relative';
                div.style.position = 'absolute';
            }
            div.style.display = "block";
            div.querySelector(".e-error").innerText = message;
            if (!validationForBottomRowPos && isInline && gcontent.getBoundingClientRect().bottom < inputClient.bottom + inputClient.height) {
                gcontent.scrollTop = gcontent.scrollTop + div.offsetHeight + arrow.scrollHeight;
            }
            var lineHeight = parseInt(document.defaultView.getComputedStyle(div, null).getPropertyValue('font-size'), 10);
            if (div.getBoundingClientRect().width < inputClient.width &&
                div.querySelector('label').getBoundingClientRect().height / (lineHeight * 1.2) >= 2) {
                div.style.width = div.style.maxWidth;
            }
            if ((this.parent.options.frozenColumns || this.parent.options.frozenRows)
                && (this.parent.options.editMode === 'Normal' || this.parent.options.editMode === 'Batch')) {
                div.style.left = input.offsetLeft + (input.offsetWidth / 2 - div.offsetWidth / 2) + 'px';
            }
            else {
                div.style.left = (parseInt(div.style.left, 10) - div.offsetWidth / 2) + 'px';
            }
            if (isInline && !isScroll && !this.parent.options.allowPaging || this.parent.options.frozenColumns
                || this.parent.options.frozenRows) {
                gcontent.style.position = 'static';
                var pos = sf.popups.calculateRelativeBasedPosition(input, div);
                div.style.top = pos.top + inputClient.height + 9 + 'px';
            }
            if (validationForBottomRowPos) {
                if (isScroll && !this.parent.options.frozenColumns && this.parent.options.height !== 'auto' && !this.parent.options.frozenRows
                //&& !this.parent.enableVirtualization
                ) {
                    var scrollWidth = gcontent.scrollWidth > gcontent.offsetWidth ? getScrollBarWidth() : 0;
                    div.style.bottom = (parseInt(this.parent.options.height) - gcontent.querySelector('table').offsetHeight
                        - scrollWidth) + inputClient.height + 9 + 'px';
                }
                else {
                    div.style.bottom = inputClient.height + 9 + 'px';
                }
                //TODO: NEW LINES ADDED SHOULD CHECK
                // if (rows.length < viewPortRowCount && this.parent.editSettings.newRowPosition === 'Bottom' && (this.editModule.args
                //     && this.editModule.args.requestType === 'add')) {
                //     let rowsCount: number = this.parent.frozenRows ? this.parent.frozenRows + (rows.length - 1) : rows.length - 1;
                //     let rowsHeight: number = rowsCount * this.parent.getRowHeight();
                //     let position: number = this.parent.getContent().clientHeight - rowsHeight;
                //     div.style.bottom = position + 9 + 'px';
                // }
                div.style.top = null;
            }
            div.style.display = 'none';
            toolTipPos[name_1] = "top: " + div.style.top + "; bottom: " + div.style.bottom + "; left: " + div.style.left + "; \n            max-width: " + div.style.maxWidth + "; width: " + div.style.width + "; text-align: center; position: " + div.style.position + ";";
        }
        this.parent.dotNetRef.invokeMethodAsync("ShowValidationPopup", toolTipPos);
    };
    return Edit;
}());

/**
 * The `Clipboard` module is used to handle clipboard copy action.
 */
var Clipboard = /** @class */ (function () {
    function Clipboard(parent) {
        this.copyContent = '';
        this.isSelect = false;
        this.parent = parent;
        this.clipBoardTextArea = sf.base.createElement('textarea', {
            className: 'e-clipboard',
            styles: 'opacity: 0',
            attrs: { tabindex: '-1', 'aria-label': 'clipboard', 'aria-hidden': 'true' }
        });
        this.parent.element.appendChild(this.clipBoardTextArea);
    }
    Clipboard.prototype.pasteHandler = function () {
        var _this = this;
        var grid = this.parent;
        var target = sf.base.closest(document.activeElement, '.e-rowcell');
        if (!target || !grid.options.allowEditing || grid.options.editMode !== 'Batch' ||
            grid.options.selectionMode !== 'Cell' || grid.options.cellSelectionMode === 'Flow') {
            return;
        }
        this.activeElement = document.activeElement;
        this.clipBoardTextArea.value = '';
        var x = window.scrollX;
        var y = window.scrollY;
        this.clipBoardTextArea.focus();
        setTimeout(function () {
            _this.activeElement.focus();
            window.scrollTo(x, y);
            _this.paste(_this.clipBoardTextArea.value, _this.getSelectedRowCellIndexes()[0].rowIndex, _this.getSelectedRowCellIndexes()[0].cellIndexes[0]);
        }, 10);
    };
    Clipboard.prototype.paste = function (data, rowIndex, colIndex) {
        var grid = this.parent;
        var cIdx = colIndex;
        var rIdx = rowIndex;
        var col;
        var isAvail;
        if (!grid.options.allowEditing || grid.options.editMode !== 'Batch' ||
            grid.options.selectionMode !== 'Cell' || grid.options.cellSelectionMode === 'Flow') {
            return;
        }
        var rows = data.split('\n');
        var cols;
        var dataRows = grid.getDataRows();
        var mRows;
        var isFrozen = this.parent.options.frozenColumns;
        if (isFrozen) {
            mRows = grid.getMovableDataRows();
        }
        for (var r = 0; r < rows.length; r++) {
            cols = rows[r].split('\t');
            cIdx = colIndex;
            if ((r === rows.length - 1 && rows[r] === '') || sf.base.isUndefined(grid.getRowByIndex(rIdx))) {
                cIdx++;
                break;
            }
            for (var c = 0; c < cols.length; c++) {
                isAvail = grid.getCellFromIndex(rIdx, cIdx);
                if (isFrozen) {
                    var fTr = dataRows[rIdx];
                    var mTr = mRows[rIdx];
                    isAvail = !fTr.querySelector('[aria-colindex="' + cIdx + '"]') ?
                        mTr.querySelector('[aria-colindex="' + cIdx + '"]') : true;
                }
                if (!isAvail) {
                    cIdx++;
                    break;
                }
                col = grid.getColumnByIndex(cIdx);
                // value = col.getParser() ? col.getParser()(cols[c]) : cols[c];
                if (col.allowEditing && !col.isPrimaryKey && !col.template) {
                    // let args: BeforePasteEventArgs = {
                    //     column: col,
                    //     data: value,
                    //     rowIndex: rIdx
                    // };
                    // this.parent.trigger(events.beforePaste, args);
                    //rIdx = args.rowIndex;
                    //if (!args.cancel) {
                    if (grid.editModule) {
                        if (col.type === 'number') {
                            // grid.editModule.updateCell(rIdx, col.field, parseInt(args.data as string, 10));
                        }
                        else {
                            //grid.editModule.updateCell(rIdx, col.field, args.data);
                        }
                    }
                    //}
                }
                cIdx++;
            }
            rIdx++;
        }
        //grid.selectionModule.selectCellsByRange(
        //  { rowIndex: rowIndex, cellIndex: colIndex }, { rowIndex: rIdx - 1, cellIndex: cIdx - 1 });
        var cell = this.parent.getCellFromIndex(rIdx - 1, cIdx - 1);
        if (cell) {
            sf.base.classList(cell, ['e-focus', 'e-focused'], []);
        }
    };
    Clipboard.prototype.setCopyData = function (withHeader) {
        if (window.getSelection().toString() === '') {
            var isFrozen = this.parent.options.frozenColumns;
            this.clipBoardTextArea.value = this.copyContent = '';
            var mRows = void 0;
            var rows = this.parent.getRows();
            if (isFrozen) {
                mRows = this.parent.getMovableDataRows();
            }
            if (this.parent.options.selectionMode !== 'Cell') {
                //let selectedIndexes: Object[] = this.parent.getSelectedRowIndexes().sort((a: number, b: number) => { return a - b; });
                var selectedIndexes = this.parent.getSelectedRowIndexes();
                if (withHeader) {
                    var headerTextArray = [];
                    for (var i = 0; i < this.parent.getVisibleColumns().length; i++) {
                        headerTextArray[i] = this.parent.getVisibleColumns()[i].headerText;
                    }
                    this.getCopyData(headerTextArray, false, '\t', withHeader);
                    this.copyContent += '\n';
                }
                for (var i = 0; i < selectedIndexes.length; i++) {
                    if (i > 0) {
                        this.copyContent += '\n';
                    }
                    var cells = [].slice.call(rows[selectedIndexes[i]].querySelectorAll('.e-rowcell'));
                    if (isFrozen) {
                        cells.push.apply(cells, [].slice.call(mRows[selectedIndexes[i]].querySelectorAll('.e-rowcell')));
                    }
                    this.getCopyData(cells, false, '\t', withHeader);
                }
            }
            else {
                var obj = this.checkBoxSelection();
                if (obj.status) {
                    if (withHeader) {
                        var headers = [];
                        for (var i = 0; i < obj.colIndexes.length; i++) {
                            headers.push(this.parent.getColumnHeaderByIndex(obj.colIndexes[i]));
                        }
                        this.getCopyData(headers, false, '\t', withHeader);
                        this.copyContent += '\n';
                    }
                    for (var i = 0; i < obj.rowIndexes.length; i++) {
                        if (i > 0) {
                            this.copyContent += '\n';
                        }
                        var cells = [].slice.call(rows[obj.rowIndexes[i]].
                            querySelectorAll('.e-cellselectionbackground'));
                        if (isFrozen) {
                            cells.push.apply(cells, [].slice.call(mRows[obj.rowIndexes[i]].querySelectorAll('.e-cellselectionbackground')));
                        }
                        this.getCopyData(cells, false, '\t', withHeader);
                    }
                }
                else {
                    this.getCopyData([].slice.call(this.parent.element.querySelectorAll('.e-cellselectionbackground')), true, '\n', withHeader);
                }
            }
            // let args: BeforeCopyEventArgs = {
            //     data: this.copyContent,
            //     cancel: false,
            // };
            // this.parent.trigger(events.beforeCopy, args);
            // if (args.cancel) {
            //     return;
            // }
            this.clipBoardTextArea.value = this.copyContent;
            if (!sf.base.Browser.userAgent.match(/ipad|ipod|iphone/i)) {
                this.clipBoardTextArea.select();
            }
            else {
                this.clipBoardTextArea.setSelectionRange(0, this.clipBoardTextArea.value.length);
            }
            this.isSelect = true;
        }
    };
    Clipboard.prototype.getCopyData = function (cells, isCell, splitKey, withHeader) {
        var isElement = typeof cells[0] !== 'string';
        for (var j = 0; j < cells.length; j++) {
            if (withHeader && isCell) {
                this.copyContent += this.parent.getColumns()[parseInt(cells[j].getAttribute('aria-colindex'), 10)].headerText + '\n';
            }
            if (isElement) {
                if (!cells[j].classList.contains('e-hide')) {
                    if ((!cells[j].classList.contains('e-gridchkbox')) &&
                        Object.keys(cells[j].querySelectorAll('.e-check')).length) {
                        this.copyContent += true;
                    }
                    else if ((!cells[j].classList.contains('e-gridchkbox')) &&
                        Object.keys(cells[j].querySelectorAll('.e-uncheck')).length) {
                        this.copyContent += false;
                    }
                    else {
                        this.copyContent += cells[j].innerText;
                    }
                }
            }
            else {
                this.copyContent += cells[j];
            }
            if (j < cells.length - 1) {
                this.copyContent += splitKey;
            }
        }
    };
    Clipboard.prototype.copy = function (withHeader) {
        if (document.queryCommandSupported('copy')) {
            this.setCopyData(withHeader);
            document.execCommand('copy');
            this.clipBoardTextArea.blur();
        }
        if (this.isSelect) {
            window.getSelection().removeAllRanges();
            this.isSelect = false;
        }
    };
    Clipboard.prototype.getSelectedRowCellIndexes = function () {
        var gridObj = this.parent;
        var rowCellIndxes = [];
        var rows = gridObj.getRows();
        var mrows;
        if (gridObj.options.frozenColumns) {
            mrows = gridObj.getMovableDataRows();
        }
        var _loop_1 = function (i) {
            var tempCells = rows[i].querySelectorAll('.e-cellselectionbackground');
            if (gridObj.options.frozenColumns && !tempCells.length) {
                tempCells = mrows[i].querySelectorAll('.e-cellselectionbackground');
            }
            if (tempCells.length) {
                var cellIndexes_1 = [];
                tempCells.forEach(function (element) {
                    cellIndexes_1.push(parseInt(element.getAttribute('aria-colindex')));
                });
                rowCellIndxes.push({ rowIndex: i, cellIndexes: cellIndexes_1 });
            }
        };
        for (var i = 0; i < rows.length; i++) {
            _loop_1(i);
        }
        return rowCellIndxes;
    };
    Clipboard.prototype.checkBoxSelection = function () {
        var gridObj = this.parent;
        var rowCellIndxes;
        var obj = { status: false };
        if (gridObj.options.selectionMode === 'Cell') {
            rowCellIndxes = this.getSelectedRowCellIndexes();
            var str = void 0;
            var rowIndexes = [];
            var i = void 0;
            for (i = 0; i < rowCellIndxes.length; i++) {
                if (rowCellIndxes[i].cellIndexes.length) {
                    rowIndexes.push(rowCellIndxes[i].rowIndex);
                }
                if (rowCellIndxes[i].cellIndexes.length) {
                    if (!str) {
                        str = JSON.stringify(rowCellIndxes[i].cellIndexes.sort());
                    }
                    if (str !== JSON.stringify(rowCellIndxes[i].cellIndexes.sort())) {
                        break;
                    }
                }
            }
            rowIndexes.sort(function (a, b) { return a - b; });
            if (i === rowCellIndxes.length && rowIndexes[rowIndexes.length - 1] - rowIndexes[0] === rowIndexes.length - 1) {
                obj = { status: true, rowIndexes: rowIndexes, colIndexes: rowCellIndxes[0].cellIndexes };
            }
        }
        return obj;
    };
    return Clipboard;
}());

var CustomToolTip = /** @class */ (function () {
    function CustomToolTip(parent) {
        this.parent = parent;
        this.wireEvents();
    }
    CustomToolTip.prototype.wireEvents = function () {
        sf.base.EventHandler.add(this.parent.getContent(), 'scroll', this.scrollHandler, this);
        sf.base.EventHandler.add(this.parent.element, 'mousemove', this.mouseMoveHandler, this);
        sf.base.EventHandler.add(this.parent.element, 'mouseout', this.mouseMoveHandler, this);
        sf.base.EventHandler.add(this.parent.element, 'keydown', this.onKeyPressed, this);
    };
    CustomToolTip.prototype.unWireevents = function () {
        sf.base.EventHandler.remove(this.parent.getContent(), 'scroll', this.scrollHandler);
        sf.base.EventHandler.remove(this.parent.element, 'mousemove', this.mouseMoveHandler);
        sf.base.EventHandler.remove(this.parent.element, 'mouseout', this.mouseMoveHandler);
        sf.base.EventHandler.remove(this.parent.element, 'keydown', this.onKeyPressed);
    };
    CustomToolTip.prototype.open = function (target) {
        this.close();
        this.ctrlId = sf.base.getUniqueID(this.parent.element.getAttribute('id'));
        if (sf.base.isNullOrUndefined(this.toolTipElement)) {
            this.toolTipElement = sf.base.createElement('div', {
                className: "e-tooltip-wrap e-popup e-lib e-control e-popup-open",
                styles: 'width: "auto", height: "auto", position: "absolute"',
                attrs: { role: "tooltip", 'aria-hidden': 'false', 'id': this.ctrlId + '_content' }
            });
        }
        sf.base.attributes(target, { 'aria-describedby': this.ctrlId + "_content", 'data-tooltip-id': this.ctrlId + "_content" });
        this.renderToolTip();
        this.setPosition(target);
    };
    CustomToolTip.prototype.renderToolTip = function () {
        var content = sf.base.createElement('div', { className: "e-tip-content" });
        content.innerHTML = this.content;
        this.toolTipElement.appendChild(content);
        var arrow = sf.base.createElement('div', { className: "e-arrow-tip e-tip-bottom", styles: 'top: 99.9%' });
        arrow.appendChild(sf.base.createElement('div', { className: "e-arrow-tip-outer e-tip-bottom" }));
        arrow.appendChild(sf.base.createElement('div', { className: "e-arrow-tip-inner e-tip-bottom", styles: 'top: -6px' }));
        this.toolTipElement.appendChild(arrow);
        document.body.appendChild(this.toolTipElement);
    };
    CustomToolTip.prototype.setPosition = function (target) {
        var tooltipPostion = { top: 0, left: 0 };
        var arrow = this.toolTipElement.querySelector('.e-arrow-tip');
        var popUpPosition = sf.popups.calculatePosition(target, 'Center', 'Top');
        tooltipPostion.top -= this.toolTipElement.offsetHeight + arrow.offsetHeight;
        tooltipPostion.left -= this.toolTipElement.offsetWidth / 2;
        this.toolTipElement.style.top = popUpPosition.top + tooltipPostion.top + 'px';
        this.toolTipElement.style.left = popUpPosition.left + tooltipPostion.left + 'px';
    };
    CustomToolTip.prototype.close = function () {
        if (this.toolTipElement) {
            var prevTarget = this.parent.element.querySelector("[aria-describedby=\"" + this.ctrlId + '_content' + "\"]");
            prevTarget.removeAttribute('aria-describedby');
            prevTarget.removeAttribute('data-tooltip-id');
            document.getElementById(this.ctrlId + '_content').remove();
            this.toolTipElement = null;
        }
    };
    CustomToolTip.prototype.getTooltipStatus = function (element) {
        var width;
        var headerTable = this.parent.getHeaderTable();
        var contentTable = this.parent.getContentTable();
        var headerDivTag = 'e-gridheader';
        var contentDivTag = 'e-gridcontent';
        var htable = this.createTable(headerTable, headerDivTag, 'header');
        var ctable = this.createTable(contentTable, contentDivTag, 'content');
        var table = element.classList.contains('e-headercell') ? htable : ctable;
        var ele = element.classList.contains('e-headercell') ? 'th' : 'tr';
        table.querySelector(ele).className = element.className;
        table.querySelector(ele).innerHTML = element.innerHTML;
        width = table.querySelector(ele).getBoundingClientRect().width;
        document.body.removeChild(htable);
        document.body.removeChild(ctable);
        if (width > element.getBoundingClientRect().width) {
            return true;
        }
        return false;
    };
    CustomToolTip.prototype.mouseMoveHandler = function (e) {
        if (this.isEllipsisTooltip()) {
            var element = parentsUntil(e.target, 'e-ellipsistooltip');
            if (this.prevElement !== element || e.type === 'mouseout') {
                this.close();
            }
            var tagName = e.target.tagName;
            var elemNames = ['A', 'BUTTON', 'INPUT'];
            if (element && e.type !== 'mouseout' && !(sf.base.Browser.isDevice && elemNames.indexOf(tagName) !== -1)) {
                if (element.getAttribute('aria-describedby')) {
                    return;
                }
                if (this.getTooltipStatus(element)) {
                    if (element.getElementsByClassName('e-headertext').length) {
                        this.content = element.getElementsByClassName('e-headertext')[0].innerText;
                    }
                    else {
                        this.content = element.innerText;
                    }
                    this.prevElement = element;
                    this.open(element);
                }
            }
        }
        this.hoverFrozenRows(e);
    };
    CustomToolTip.prototype.hoverFrozenRows = function (e) {
        if (this.parent.options.frozenColumns) {
            var row = parentsUntil(e.target, 'e-row');
            var frozenHover = [].slice.call(this.parent.element.querySelectorAll('.e-frozenhover'));
            if (frozenHover.length && e.type === 'mouseout') {
                for (var i = 0; i < frozenHover.length; i++) {
                    frozenHover[i].classList.remove('e-frozenhover');
                }
            }
            else if (row) {
                var rows = [].slice.call(this.parent.element.querySelectorAll('tr[aria-rowindex="' + row.getAttribute('aria-rowindex') + '"]'));
                rows.splice(rows.indexOf(row), 1);
                if (row.getAttribute('aria-selected') != 'true') {
                    rows[0].classList.add('e-frozenhover');
                }
                else {
                    rows[0].classList.remove('e-frozenhover');
                }
            }
        }
    };
    CustomToolTip.prototype.isEllipsisTooltip = function () {
        var cols = this.parent.getColumns();
        if (this.parent.options.clipMode === 'EllipsisWithTooltip') {
            return true;
        }
        for (var i = 0; i < cols.length; i++) {
            if (cols[i].clipMode === 'EllipsisWithTooltip') {
                return true;
            }
        }
        return false;
    };
    CustomToolTip.prototype.scrollHandler = function () {
        if (this.isEllipsisTooltip()) {
            this.close();
        }
    };
    /**
     * To create table for ellipsiswithtooltip
     * @hidden
     */
    CustomToolTip.prototype.createTable = function (table, tag, type) {
        var myTableDiv = sf.base.createElement('div');
        myTableDiv.className = this.parent.element.className;
        myTableDiv.style.cssText = 'display: inline-block;visibility:hidden;position:absolute';
        var mySubDiv = sf.base.createElement('div');
        mySubDiv.className = tag;
        var myTable = sf.base.createElement('table');
        myTable.className = table.className;
        myTable.style.cssText = 'table-layout: auto;width: auto';
        var ele = (type === 'header') ? 'th' : 'td';
        var myTr = sf.base.createElement('tr');
        var mytd = sf.base.createElement(ele);
        myTr.appendChild(mytd);
        myTable.appendChild(myTr);
        mySubDiv.appendChild(myTable);
        myTableDiv.appendChild(mySubDiv);
        document.body.appendChild(myTableDiv);
        return myTableDiv;
    };
    CustomToolTip.prototype.onKeyPressed = function (e) {
        if (e.key === 'Tab' || e.key === 'ShiftTab') {
            this.close();
        }
    };
    CustomToolTip.prototype.destroy = function () {
        this.close();
        this.unWireevents();
    };
    return CustomToolTip;
}());

/**
 *
 * Reorder module is used to handle row reordering.
 * @hidden
 */
var RowDD = /** @class */ (function () {
    /**
     * Constructor for the Grid print module
     * @hidden
     */
    function RowDD(parent) {
        var _this = this;
        this.isOverflowBorder = true;
        /* tslint:disable-next-line:max-line-length */
        // tslint:disable-next-line:max-func-body-length
        this.helper = function (e) {
            var gObj = _this.parent;
            var target = _this.draggable.currentStateTarget;
            e.sender.target.blur(); //https://github.com/dotnet/aspnetcore/issues/17926
            var visualElement = sf.base.createElement('div', {
                className: 'e-cloneproperties e-draganddrop e-grid e-dragclone',
                styles: 'height:"auto", z-index:2, width:' + gObj.element.offsetWidth
            });
            var table = sf.base.createElement('table', { styles: 'width:' + gObj.element.offsetWidth });
            var tbody = sf.base.createElement('tbody');
            if (document.getElementsByClassName('e-griddragarea').length ||
                (gObj.options.rowDropTarget && (!e.sender.target.classList.contains('e-selectionbackground')
                    && gObj.options.selectionType !== 'Single')) ||
                (!gObj.options.rowDropTarget && !parentsUntil(e.sender.target, 'e-rowdragdrop'))) {
                return false;
            }
            if (gObj.options.rowDropTarget &&
                gObj.options.selectionMode === 'Row' && gObj.options.selectionType === 'Single') {
                gObj.dotNetRef.invokeMethodAsync("SelectRow", parseInt(_this.draggable.currentStateTarget.parentElement.getAttribute('aria-rowindex'), 10));
            }
            _this.startedRow = sf.base.closest(target, 'tr').cloneNode(true);
            var selectedRows = gObj.getSelectedRows();
            removeElement(_this.startedRow, '.e-indentcell');
            removeElement(_this.startedRow, '.e-detailrowcollapse');
            removeElement(_this.startedRow, '.e-detailrowexpand');
            _this.removeCell(_this.startedRow, 'e-gridchkbox');
            var exp = new RegExp('e-active', 'g'); //high contrast issue
            _this.startedRow.innerHTML = _this.startedRow.innerHTML.replace(exp, '');
            tbody.appendChild(_this.startedRow);
            if (gObj.getSelectedRows().length > 1 && _this.startedRow.hasAttribute('aria-selected')) {
                var dropCountEle = sf.base.createElement('span', {
                    className: 'e-dropitemscount', innerHTML: '' + selectedRows.length,
                });
                visualElement.appendChild(dropCountEle);
            }
            var ele = sf.base.closest(target, 'tr').querySelector('.e-icon-rowdragicon');
            if (ele) {
                ele.classList.add('e-dragstartrow');
            }
            table.appendChild(tbody);
            visualElement.appendChild(table);
            gObj.element.appendChild(visualElement);
            return visualElement;
        };
        this.dragStart = function (e) {
            var gObj = _this.parent;
            if (document.getElementsByClassName('e-griddragarea').length) {
                return;
            }
            var spanCssEle = _this.parent.element.querySelector('.e-dropitemscount');
            if (_this.parent.getSelectedRows().length > 1 && spanCssEle) {
                spanCssEle.style.left = _this.parent.element.querySelector('.e-cloneproperties table')
                    .offsetWidth - 5 + 'px';
            }
            var fromIdx = parseInt(_this.startedRow.getAttribute('aria-rowindex'), 10);
            _this.parent.dotNetRef.invokeMethodAsync("RowDragStartEvent", fromIdx);
            e.bindEvents(e.dragElement);
            _this.dragStartData = _this.rowData;
            var dropElem = document.getElementById(gObj.options.rowDropTarget);
            if (gObj.options.rowDropTarget && dropElem && dropElem.blazor__instance &&
                dropElem.blazor__instance.getModuleName() === 'grid') {
                dropElem.blazor__instance.getContent().classList.add('e-allowRowDrop');
            }
        };
        this.drag = function (e) {
            var gObj = _this.parent;
            var cloneElement = _this.parent.element.querySelector('.e-cloneproperties');
            var target = _this.getElementFromPosition(cloneElement, e.event);
            sf.base.classList(cloneElement, ['e-defaultcur'], ['e-notallowedcur', 'e-movecur']);
            _this.isOverflowBorder = true;
            var trElement = parentsUntil(target, 'e-grid') ? sf.base.closest(e.target, 'tr') : null;
            if (!e.target) {
                return;
            }
            _this.stopTimer();
            gObj.element.classList.add('e-rowdrag');
            _this.dragTarget = trElement && parentsUntil(target, 'e-grid').id === cloneElement.parentElement.id ?
                trElement.rowIndex : parseInt(_this.startedRow.getAttribute('aria-rowindex'), 10);
            if (gObj.options.rowDropTarget) {
                if (parentsUntil(target, 'e-gridcontent')) {
                    if (parentsUntil(cloneElement.parentElement, 'e-grid').id === parentsUntil(target, 'e-grid').id) {
                        sf.base.classList(cloneElement, ['e-notallowedcur'], ['e-defaultcur']);
                    }
                    else {
                        sf.base.classList(cloneElement, ['e-defaultcur'], ['e-notallowedcur']);
                    }
                }
                else if (parentsUntil(target, 'e-droppable')) {
                    sf.base.classList(cloneElement, ['e-defaultcur'], ['e-notallowedcur']);
                }
                else {
                    sf.base.classList(cloneElement, ['e-notallowedcur'], ['e-defaultcur']);
                }
            }
            else {
                var elem = parentsUntil(target, 'e-grid');
                if (elem && elem.id === cloneElement.parentElement.id) {
                    sf.base.classList(cloneElement, ['e-movecur'], ['e-defaultcur']);
                }
                else {
                    sf.base.classList(cloneElement, ['e-notallowedcur'], ['e-movecur']);
                }
            }
            if (!gObj.options.rowDropTarget &&
                (!gObj.options.groupCount || e.target.classList.contains('e-selectionbackground'))) {
                if (parentsUntil(target, 'e-grid')) {
                    _this.updateScrollPostion(e.event, target);
                }
                if (_this.isOverflowBorder && parseInt(_this.startedRow.getAttribute('aria-rowindex'), 10) !== _this.dragTarget) {
                    _this.moveDragRows(e, _this.startedRow, trElement);
                }
                else {
                    if (trElement && _this.parent.getRowByIndex(_this.parent.getRows().length - 1).getAttribute('data-uid') ===
                        trElement.getAttribute('data-uid')) {
                        var bottomborder = sf.base.createElement('div', { className: 'e-lastrow-dragborder' });
                        var gridcontentEle = _this.parent.getContent();
                        bottomborder.style.width = _this.parent.element.offsetWidth - _this.getScrollWidth() + 'px';
                        if (!gridcontentEle.querySelectorAll('.e-lastrow-dragborder').length) {
                            gridcontentEle.classList.add('e-grid-relative');
                            gridcontentEle.appendChild(bottomborder);
                            bottomborder.style.bottom = _this.getScrollWidth() + 'px';
                        }
                    }
                    _this.removeBorder(trElement);
                }
            }
        };
        this.dragStop = function (e) {
            if (isActionPrevent(_this.parent.element)) {
                return;
            }
            else {
                _this.processDragStop(e);
            }
        };
        this.processDragStop = function (e) {
            var gObj = _this.parent;
            var targetEle = _this.getElementFromPosition(e.helper, e.event);
            var target = targetEle && !targetEle.classList.contains('e-dlg-overlay') ?
                targetEle : e.target;
            gObj.element.classList.remove('e-rowdrag');
            var dropElement = document.getElementById(gObj.options.rowDropTarget);
            if (_this.parent.options.allowRowDragAndDrop && _this.parent.options.rowDropTarget && !parentsUntil(target, 'e-grid')) {
                var toIdx = 0;
                var targetClass = target.classList.value;
                var targetID = target.id;
                var fromIdx = parseInt(_this.startedRow.getAttribute('aria-rowindex'), 10);
                gObj.dotNetRef.invokeMethodAsync("ReorderRows", fromIdx, toIdx, 'add', false, targetClass, targetID, null, true);
            }
            if (gObj.options.rowDropTarget && dropElement && dropElement.blazor__instance &&
                dropElement.blazor__instance.getModuleName() === 'grid') {
                dropElement.blazor__instance.getContent().classList.remove('e-allowRowDrop');
            }
            if (!parentsUntil(target, 'e-gridcontent')) {
                _this.dragTarget = null;
                sf.base.remove(e.helper);
                return;
            }
            if (_this.parent.options.allowRowDragAndDrop && !_this.parent.options.rowDropTarget) {
                _this.stopTimer();
                _this.parent.getContent().classList.remove('e-grid-relative');
                _this.removeBorder(targetEle);
                var stRow = gObj.element.querySelector('.e-dragstartrow');
                if (stRow) {
                    stRow.classList.remove('e-dragstartrow');
                }
                var toIdx_1 = _this.dragTarget;
                var targetClass_1 = target.classList.value;
                var targetID_1 = target.id;
                var fromIdx_1 = parseInt(_this.startedRow.getAttribute('aria-rowindex'), 10);
                setTimeout(function () {
                    gObj.dotNetRef.invokeMethodAsync("ReorderRows", fromIdx_1, toIdx_1, 'delete', true, targetClass_1, targetID_1, null, false);
                }, 10);
                _this.dragTarget = null;
            }
        };
        this.removeCell = function (targetRow, className) {
            return [].slice.call(targetRow.querySelectorAll('td')).filter(function (cell) {
                if (cell.classList.contains(className)) {
                    targetRow.deleteCell(cell.cellIndex);
                }
            });
        };
        this.drop = function (e) {
            _this.columnDrop({ target: e.target, droppedElement: e.droppedElement });
            sf.base.remove(e.droppedElement);
        };
        this.parent = parent;
        if (this.parent.options.allowRowDragAndDrop) {
            this.initializeDrag();
        }
    }
    RowDD.prototype.stopTimer = function () {
        window.clearInterval(this.timer);
    };
    RowDD.prototype.initializeDrag = function () {
        var gObj = this.parent;
        this.draggable = new sf.base.Draggable(gObj.getContent(), {
            dragTarget: '.e-rowcelldrag, .e-rowdragdrop, .e-rowcell',
            distance: 5,
            helper: this.helper,
            dragStart: this.dragStart,
            drag: this.drag,
            dragStop: this.dragStop
        });
        this.droppable = new sf.base.Droppable(gObj.getContent(), {
            accept: '.e-dragclone',
            drop: this.drop
        });
    };
    RowDD.prototype.updateScrollPostion = function (e, target) {
        var _this = this;
        var frzCols = this.parent.options.frozenColumns;
        var y = getPosition(e).y;
        var cliRect = this.parent.getContent().getBoundingClientRect();
        var rowHeight = this.parent.getRowHeight() - 15;
        var scrollElem = frzCols ? this.parent.getContent().querySelector('.e-movablecontent')
            : this.parent.getContent().firstElementChild;
        if (cliRect.top + rowHeight >= y) {
            var scrollPixel_1 = -(this.parent.getRowHeight());
            this.isOverflowBorder = false;
            this.timer = window.setInterval(function () { _this.setScrollDown(scrollElem, scrollPixel_1, true); }, 200);
        }
        else if (cliRect.top + this.parent.getContent().clientHeight - rowHeight - 33 <= y) {
            var scrollPixel_2 = (this.parent.getRowHeight());
            this.isOverflowBorder = false;
            this.timer = window.setInterval(function () { _this.setScrollDown(scrollElem, scrollPixel_2, true); }, 200);
        }
    };
    RowDD.prototype.setScrollDown = function (scrollElem, scrollPixel, isLeft) {
        scrollElem.scrollTop = scrollElem.scrollTop + scrollPixel;
    };
    RowDD.prototype.moveDragRows = function (e, startedRow, targetRow) {
        var cloneElement = this.parent.element.querySelector('.e-cloneproperties');
        var element = sf.base.closest(e.target, 'tr');
        if (parentsUntil(element, 'e-gridcontent') && parentsUntil(cloneElement.parentElement, 'e-grid').id ===
            parentsUntil(element, 'e-grid').id) {
            var targetElement = element ?
                element : this.startedRow;
            this.setBorder(targetElement, e.event, startedRow, targetRow);
        }
    };
    RowDD.prototype.setBorder = function (element, event, startedRow, targetRow) {
        var node = this.parent.element;
        var cloneElement = this.parent.element.querySelector('.e-cloneproperties');
        this.removeFirstRowBorder(element);
        this.removeLastRowBorder(element);
        if (parentsUntil(element, 'e-gridcontent') && parentsUntil(cloneElement.parentElement, 'e-grid').id ===
            parentsUntil(element, 'e-grid').id) {
            sf.base.removeClass(node.querySelectorAll('.e-rowcell,.e-rowdragdrop'), ['e-dragborder']);
            var rowElement = [];
            if (targetRow && targetRow.rowIndex === 0) {
                var div = sf.base.createElement('div', { className: 'e-firstrow-dragborder' });
                var gridheaderEle = this.parent.getHeaderContent();
                gridheaderEle.classList.add('e-grid-relative');
                div.style.width = node.offsetWidth - this.getScrollWidth() + 'px';
                if (!gridheaderEle.querySelectorAll('.e-firstrow-dragborder').length) {
                    gridheaderEle.appendChild(div);
                }
            }
            else if (targetRow && parseInt(startedRow.getAttribute('aria-rowindex'), 10) > targetRow.rowIndex) {
                element = this.parent.getRowByIndex(targetRow.rowIndex - 1);
                rowElement = [].slice.call(element.querySelectorAll('.e-rowcell,.e-rowdragdrop,.e-detailrowcollapse'));
            }
            else {
                rowElement = [].slice.call(element.querySelectorAll('.e-rowcell,.e-rowdragdrop,.e-detailrowcollapse'));
            }
            if (rowElement.length > 0) {
                addRemoveActiveClasses(rowElement, true, 'e-dragborder');
            }
        }
    };
    RowDD.prototype.getScrollWidth = function () {
        var scrollElem = this.parent.getContent().firstElementChild;
        return scrollElem.scrollWidth > scrollElem.offsetWidth ? getScrollBarWidth() : 0;
    };
    RowDD.prototype.removeFirstRowBorder = function (element) {
        if (this.parent.element.getElementsByClassName('e-firstrow-dragborder').length > 0 && element &&
            element.rowIndex !== 0) {
            this.parent.element.getElementsByClassName('e-firstrow-dragborder')[0].remove();
        }
    };
    RowDD.prototype.removeLastRowBorder = function (element) {
        var islastRowIndex = element &&
            this.parent.getRowByIndex(this.parent.getRows().length - 1).getAttribute('data-uid') !==
                element.getAttribute('data-uid');
        if (this.parent.element.getElementsByClassName('e-lastrow-dragborder').length > 0 && element && islastRowIndex) {
            this.parent.element.getElementsByClassName('e-lastrow-dragborder')[0].remove();
        }
    };
    RowDD.prototype.removeBorder = function (element) {
        this.removeFirstRowBorder(element);
        this.removeLastRowBorder(element);
        element = this.parent.getRows().filter(function (row) {
            return row.querySelector('td.e-dragborder');
        })[0];
        if (element) {
            var rowElement = [].slice.call(element.querySelectorAll('.e-dragborder'));
            addRemoveActiveClasses(rowElement, false, 'e-dragborder');
        }
    };
    RowDD.prototype.getElementFromPosition = function (element, event) {
        var target;
        var position = getPosition(event);
        element.style.display = 'none';
        target = document.elementFromPoint(position.x, position.y);
        element.style.display = '';
        return target;
    };
    RowDD.prototype.getTargetIdx = function (targetRow) {
        return targetRow ? parseInt(targetRow.getAttribute('aria-rowindex'), 10) : 0;
    };
    RowDD.prototype.columnDrop = function (e) {
        var gObj = this.parent;
        if (e.droppedElement.getAttribute('action') !== 'grouping') {
            var targetRow = sf.base.closest(e.target, 'tr');
            var srcControl = void 0;
            var currentIndex = void 0;
            if ((e.droppedElement.querySelector('tr').getAttribute('single-dragrow') !== 'true' &&
                e.droppedElement.parentElement.id === gObj.element.id)
                || (e.droppedElement.querySelector('tr').getAttribute('single-dragrow') === 'true' &&
                    e.droppedElement.parentElement.id !== gObj.element.id)) {
                return;
            }
            if (e.droppedElement.parentElement.id !== gObj.element.id) {
                srcControl = e.droppedElement.parentElement.blazor__instance;
            }
            if (srcControl.element.id !== gObj.element.id && srcControl.options.rowDropTarget !== gObj.element.id) {
                return;
            }
            var targetIndex = currentIndex = this.getTargetIdx(targetRow);
            if (isNaN(targetIndex)) {
                targetIndex = currentIndex = 0;
            }
            if (gObj.options.allowPaging) {
                targetIndex = targetIndex + (gObj.options.currentPage * gObj.options.pageSize) - gObj.options.pageSize;
            }
            var targetClass = e.target.classList.value;
            var targetID = e.target.id;
            gObj.dotNetRef.invokeMethodAsync("ReorderRows", 0, targetIndex, 'add', false, targetClass, targetID, srcControl.dotNetRef, false);
            srcControl.dotNetRef.invokeMethodAsync("ReorderRows", 0, targetIndex, 'delete', false, targetClass, targetID, null, false);
        }
    };
    /**
     * To destroy the print
     * @return {void}
     * @hidden
     */
    RowDD.prototype.destroy = function () {
        var gridElement = this.parent.element;
        if (!gridElement || (!gridElement.querySelector('.e-gridheader') &&
            !gridElement.querySelector('.e-gridcontent'))) {
            return;
        }
        this.draggable.destroy();
    };
    return RowDD;
}());

var Selection = /** @class */ (function () {
    function Selection(parent) {
        this.prevStartDIndex = undefined;
        this.prevEndIndex = undefined;
        this.parent = parent;
        this.addEventListener();
    }
    Selection.prototype.addEventListener = function () {
        sf.base.EventHandler.add(this.parent.getContent().parentElement, 'mousedown', this.mouseDownHandler, this);
    };
    Selection.prototype.removeEventListener = function () {
        sf.base.EventHandler.remove(this.parent.getContent().parentElement, 'mousedown', this.mouseDownHandler);
    };
    Selection.prototype.mouseDownHandler = function (e) {
        var target = e.target;
        var gObj = this.parent;
        var isDrag;
        var gridElement = parentsUntil(target, 'e-grid');
        if (gridElement && gridElement.id !== gObj.element.id || parentsUntil(target, 'e-headercontent') && !this.parent.options.frozenRows) {
            return;
        }
        if (e.shiftKey || e.ctrlKey) {
            e.preventDefault();
        }
        if (parentsUntil(target, 'e-rowcell') && !e.shiftKey && !e.ctrlKey) {
            // if (gObj.options.cellSelectionMode.indexOf('Box') > -1 && !this.isRowType() && !this.isSingleSel()) {
            //     this.isCellDrag = true;
            //     isDrag = true;
            // } else 
            if (gObj.options.allowRowDragAndDrop && !gObj.options.isEdit) {
                if (!this.isRowType() || this.isSingleSel() || sf.base.closest(target, 'td').classList.contains('e-selectionbackground')) {
                    this.isDragged = false;
                    return;
                }
                isDrag = true;
                this.element = sf.base.createElement('div', { className: 'e-griddragarea' });
                gObj.getContent().appendChild(this.element);
            }
            if (isDrag) {
                this.enableDrag(e, true);
            }
        }
    };
    Selection.prototype.mouseUpHandler = function (e) {
        document.body.classList.remove('e-disableuserselect');
        if (this.element) {
            sf.base.remove(this.element);
        }
        if (!sf.base.isNullOrUndefined(this.prevStartDIndex) || !sf.base.isNullOrUndefined(this.prevEndIndex)) {
            this.parent.dotNetRef.invokeMethodAsync("DragSelection", this.prevStartDIndex, this.prevEndIndex, false);
        }
        // if (this.isDragged && this.selectedRowCellIndexes.length === 1 && this.selectedRowCellIndexes[0].cellIndexes.length === 1) {
        //     this.mUPTarget = parentsUntil(e.target as Element, 'e-rowcell');
        // } else {
        //     this.mUPTarget = null;
        // }
        // if (this.isDragged && !this.isAutoFillSel) {
        //     let target: Element = e.target as Element;
        //     let rowIndex: number = parseInt(target.parentElement.getAttribute('aria-rowindex'), 10);
        //     let cellIndex: number =  parseInt(target.getAttribute('aria-colindex'), 10);
        //     this.isDragged = false;
        //     this.clearCellSelection();
        //     this.selectCellsByRange(
        //         { rowIndex: this.startDIndex, cellIndex: this.startDCellIndex },
        //         { rowIndex: rowIndex, cellIndex: cellIndex });
        // }
        this.isDragged = false;
        this.prevStartDIndex = undefined;
        this.prevEndIndex = undefined;
        sf.base.EventHandler.remove(this.parent.getContent(), 'mousemove', this.mouseMoveHandler);
        if (this.parent.options.frozenRows) {
            sf.base.EventHandler.remove(this.parent.getHeaderContent(), 'mousemove', this.mouseMoveHandler);
        }
        sf.base.EventHandler.remove(document.body, 'mouseup', this.mouseUpHandler);
    };
    Selection.prototype.enableDrag = function (e, isUpdate) {
        var gObj = this.parent;
        if (isUpdate) {
            var tr = sf.base.closest(e.target, 'tr');
            this.startDIndex = parseInt(tr.getAttribute('aria-rowindex'), 10);
            this.startDCellIndex = parseInt(parentsUntil(e.target, 'e-rowcell').getAttribute('aria-colindex'), 10);
        }
        document.body.classList.add('e-disableuserselect');
        var gBRect = gObj.element.getBoundingClientRect();
        var postion = getPosition(e);
        this.x = postion.x - gBRect.left;
        this.y = postion.y - gBRect.top;
        sf.base.EventHandler.add(gObj.getContent(), 'mousemove', this.mouseMoveHandler, this);
        if (this.parent.options.frozenRows) {
            sf.base.EventHandler.add(gObj.getHeaderContent(), 'mousemove', this.mouseMoveHandler, this);
        }
        sf.base.EventHandler.add(document.body, 'mouseup', this.mouseUpHandler, this);
    };
    Selection.prototype.mouseMoveHandler = function (e) {
        e.preventDefault();
        var gBRect = this.parent.element.getBoundingClientRect();
        var x1 = this.x;
        var y1 = this.y;
        var position = getPosition(e);
        var x2 = position.x - gBRect.left;
        var y2 = position.y - gBRect.top;
        var tmp;
        var target = sf.base.closest(e.target, 'tr');
        this.isDragged = true;
        if (!this.isCellDrag) {
            if (!target) {
                target = sf.base.closest(document.elementFromPoint(this.parent.element.offsetLeft + 2, e.clientY), 'tr');
            }
            if (x1 > x2) {
                tmp = x2;
                x2 = x1;
                x1 = tmp;
            }
            if (y1 > y2) {
                tmp = y2;
                y2 = y1;
                y1 = tmp;
            }
            this.element.style.left = x1 + 'px';
            this.element.style.top = y1 - this.parent.getRowHeight() + 'px';
            this.element.style.width = x2 - x1 + 'px';
            this.element.style.height = y2 - y1 + 'px';
        }
        if (target && !e.ctrlKey && !e.shiftKey) {
            var rowIndex = parseInt(target.getAttribute('aria-rowindex'), 10);
            if (!this.isCellDrag && (sf.base.isNullOrUndefined(this.prevStartDIndex) ||
                this.prevStartDIndex != this.startDIndex || this.prevEndIndex != rowIndex)) {
                //Below calculation is to perform ClearSelection in server side
                var clearIndex = -1;
                var isInvokedFirst = false;
                var selectedIndexes = this.parent.getSelectedRowIndexes();
                if (sf.base.isNullOrUndefined(this.prevStartDIndex)) {
                    clearIndex = -1;
                    isInvokedFirst = true;
                }
                else if (rowIndex >= this.prevStartDIndex && selectedIndexes.indexOf(rowIndex) >= 0) {
                    clearIndex = this.prevEndIndex;
                }
                else if (this.prevStartDIndex > rowIndex && selectedIndexes.indexOf(this.startDIndex) >= 0) {
                    clearIndex = this.prevEndIndex;
                }
                this.prevStartDIndex = this.startDIndex;
                this.prevEndIndex = rowIndex;
                if (isInvokedFirst) {
                    this.parent.dotNetRef.invokeMethodAsync("DragSelection", this.startDIndex, rowIndex, true);
                }
                else {
                    this.performDragSelection(this.startDIndex, rowIndex, clearIndex);
                }
            }
        }
    };
    Selection.prototype.performDragSelection = function (startIndex, endIndex, clearIndex) {
        var sIndex = startIndex;
        var eIndex = endIndex;
        if (startIndex > endIndex) {
            sIndex = endIndex;
            eIndex = startIndex;
        }
        if (clearIndex != -1) {
            this.clearSelectionExceptDragIndexes(sIndex, eIndex);
        }
        this.selectRangeOfRows(sIndex, eIndex);
    };
    Selection.prototype.selectRangeOfRows = function (startIndex, endIndex) {
        var rows = this.parent.getRows();
        for (var i = startIndex; i <= endIndex; i++) {
            rows[i].setAttribute('aria-selected', 'true');
            var cells = [].slice.call(rows[i].querySelectorAll('.e-rowcell'));
            addRemoveActiveClasses.apply(void 0, [cells, true].concat(['e-aria-selected', 'e-active']));
        }
    };
    Selection.prototype.clearSelectionByRow = function (row) {
        var cells = [].slice.call(row.querySelectorAll('.e-rowcell'));
        row.removeAttribute('aria-selected');
        addRemoveActiveClasses.apply(void 0, [cells, false].concat(['e-aria-selected', 'e-active']));
    };
    Selection.prototype.clearSelectionExceptDragIndexes = function (startIndex, endIndex) {
        var rows = this.parent.getRows();
        for (var i = 0; i < rows.length; i++) {
            if (i < startIndex || i > endIndex) {
                this.clearSelectionByRow(rows[i]);
            }
        }
    };
    Selection.prototype.isRowType = function () {
        return this.parent.options.selectionMode === 'Row' || this.parent.options.selectionMode === 'Both';
    };
    Selection.prototype.isSingleSel = function () {
        return this.parent.options.selectionType === 'Single';
    };
    return Selection;
}());

/**
 * InterSectionObserver - class watch whether it enters the viewport.
 * @hidden
 */
var InterSectionObserver = /** @class */ (function () {
    function InterSectionObserver(element, options) {
        var _this = this;
        this.fromWheel = false;
        this.touchMove = false;
        /** @hidden */
        this.options = {};
        this.sentinelInfo = {
            'up': {
                check: function (rect, info) {
                    var top = rect.top - _this.containerRect.top;
                    info.entered = top >= 0;
                    return top + (_this.options.pageHeight / 2) >= 0;
                },
                axis: 'Y'
            },
            'down': {
                check: function (rect, info) {
                    var cHeight = _this.options.container.clientHeight;
                    var top = rect.bottom;
                    info.entered = rect.bottom <= _this.containerRect.bottom;
                    return top - (_this.options.pageHeight / 2) <= _this.options.pageHeight / 2;
                }, axis: 'Y'
            },
            'right': {
                check: function (rect, info) {
                    var right = rect.right;
                    info.entered = right < _this.containerRect.right;
                    return right - _this.containerRect.width <= _this.containerRect.right;
                }, axis: 'X'
            },
            'left': {
                check: function (rect, info) {
                    var left = rect.left;
                    info.entered = left > 0;
                    return left + _this.containerRect.width >= _this.containerRect.left;
                }, axis: 'X'
            }
        };
        this.element = element;
        this.options = options;
    }
    InterSectionObserver.prototype.observe = function (callback, onEnterCallback) {
        var _this = this;
        this.containerRect = this.options.container.getBoundingClientRect();
        sf.base.EventHandler.add(this.options.container, 'wheel', function () { return _this.fromWheel = true; }, this);
        sf.base.EventHandler.add(this.options.container, 'scroll', this.virtualScrollHandler(callback, onEnterCallback), this);
    };
    InterSectionObserver.prototype.check = function (direction) {
        var info = this.sentinelInfo[direction];
        return info.check(this.element.getBoundingClientRect(), info);
    };
    InterSectionObserver.prototype.virtualScrollHandler = function (callback, onEnterCallback) {
        var _this = this;
        var delay = sf.base.Browser.info.name === 'chrome' ? 200 : 100;
        var prevTop = 0;
        var prevLeft = 0;
        var debounced100 = sf.base.debounce(callback, delay);
        var debounced50 = sf.base.debounce(callback, 50);
        return function (e) {
            var top = e.target.scrollTop;
            var left = e.target.scrollLeft;
            var direction = prevTop < top ? 'down' : 'up';
            direction = prevLeft === left ? direction : prevLeft < left ? 'right' : 'left';
            prevTop = top;
            prevLeft = left;
            var current = _this.sentinelInfo[direction];
            if (_this.options.axes.indexOf(current.axis) === -1) {
                return;
            }
            var check = _this.check(direction);
            if (current.entered) {
                onEnterCallback(_this.element, current, direction, { top: top, left: left }, _this.fromWheel, check);
            }
            if (check) {
                var fn = debounced100;
                //this.fromWheel ? this.options.debounceEvent ? debounced100 : callback : debounced100;
                if (current.axis === 'X') {
                    fn = debounced50;
                }
                fn({ direction: direction, sentinel: current, offset: { top: top, left: left },
                    focusElement: document.activeElement });
            }
            _this.fromWheel = false;
        };
    };
    InterSectionObserver.prototype.setPageHeight = function (value) {
        this.options.pageHeight = value;
    };
    return InterSectionObserver;
}());

/**
 * VirtualContentRenderer
 * @hidden
 */
var VirtualContentRenderer = /** @class */ (function () {
    function VirtualContentRenderer(parent) {
        var _this = this;
        this.prevHeight = 0;
        this.preStartIndex = 0;
        this.preventEvent = false;
        this.actions = ['filtering', 'searching', 'grouping', 'ungrouping', 'Filtering', 'Searching', 'Grouping', 'Ungrouping'];
        this.offsets = {};
        this.tmpOffsets = {};
        this.offsetKeys = [];
        this.currentInfo = {};
        this.blazorActiveKey = '';
        this.nextRowToNavigate = 0;
        /** @hidden */
        this.virtualEle = new VirtualElementHandler();
        /** @hidden */
        this.startIndex = 0;
        this.bindScrollEvent = function () {
            _this.observer.observe(function (scrollArgs) { return _this.scrollListener(scrollArgs); }, _this.onEntered());
            var gObj = _this.parent;
            if (gObj.options.enablePersistence && gObj.scrollPosition) {
                _this.content.scrollTop = gObj.scrollPosition.top;
                var scrollValues = { direction: 'down', sentinel: _this.observer.sentinelInfo.down,
                    offset: gObj.scrollPosition, focusElement: gObj.element };
                _this.scrollListener(scrollValues);
                if (gObj.options.enableColumnVirtualization) {
                    _this.content.scrollLeft = gObj.scrollPosition.left;
                }
            }
        };
        this.parent = parent;
        this.contentPanel = this.parent.element.querySelector(".e-gridcontent");
        this.vHelper = new VirtualHelper(parent);
        this.addEventListener();
    }
    /**
     * Get the header content div element of grid
     * @return {Element}
     */
    VirtualContentRenderer.prototype.getPanel = function () {
        return this.contentPanel;
    };
    /**
     * Get the header table element of grid
     * @return {Element}
     */
    VirtualContentRenderer.prototype.getTable = function () {
        return this.contentPanel.querySelector('.e-table');
    };
    VirtualContentRenderer.prototype.renderTable = function () {
        this.header = this.parent.virtualHeaderModule;
        this.virtualEle.table = this.getTable();
        this.virtualEle.content = this.content = this.getPanel().querySelector('.e-content');
        this.virtualEle.renderWrapper(Number(this.parent.options.height));
        this.virtualEle.renderPlaceHolder();
        var content = this.content;
        var opt = {
            container: content, pageHeight: this.getBlockHeight() * 2, debounceEvent: true,
            axes: this.parent.options.enableColumnVirtualization ? ['X', 'Y'] : ['Y']
        };
        this.observer = new InterSectionObserver(this.virtualEle.wrapper, opt);
        this.parent.dotNetRef.invokeMethodAsync("SetRowHeight", this.parent.getRowHeight());
    };
    VirtualContentRenderer.prototype.addEventListener = function () {
        sf.base.EventHandler.add(this.parent.element, 'keydown', this.keyDownHandler, this);
    };
    VirtualContentRenderer.prototype.removeEventListener = function () {
        sf.base.EventHandler.remove(this.parent.element, 'keydown', this.keyDownHandler);
    };
    VirtualContentRenderer.prototype.ensurePageSize = function () {
        var rowHeight = this.parent.getRowHeight();
        var vHeight = this.parent.options.height.toString().indexOf('%') < 0 ? this.parent.options.height :
            this.parent.element.getBoundingClientRect().height;
        var blockSize = ~~(vHeight / rowHeight);
        var height = blockSize * 2;
        var size = this.parent.options.pageSize;
        var actualPageSize = size < height ? height : size;
        this.parent.dotNetRef.invokeMethodAsync("SetPageSizeAndCIndex", {
            pageSize: actualPageSize,
            startColumnIndex: this.startColIndex,
            endColumnIndex: this.endColIndex,
            VTableWidth: this.getColumnOffset(this.endColIndex) - this.getColumnOffset(this.startColIndex - 1) + ''
        });
        this.parent.options.pageSize = actualPageSize;
        this.observer.options.pageHeight = this.getBlockHeight() * 2;
    };
    VirtualContentRenderer.prototype.scrollListener = function (scrollArgs) {
        if (this.parent.options.enablePersistence) {
            this.parent.scrollPosition = scrollArgs.offset;
        }
        if (this.preventEvent) {
            this.preventEvent = false;
            return;
        }
        // if (this.preventEvent || this.parent.isDestroyed) { this.preventEvent = false; return; }
        var info = scrollArgs.sentinel;
        var pStartIndex = this.preStartIndex;
        var previousColIndexes = this.parent.getColumnIndexesInView();
        var viewInfo = this.currentInfo = this.getInfoFromView(scrollArgs.direction, info, scrollArgs.offset);
        if (this.parent.options.enableColumnVirtualization &&
            (JSON.stringify(previousColIndexes) !== JSON.stringify(viewInfo.columnIndexes))) {
            var translateX = this.getColumnOffset(this.startColIndex - 1);
            var width = this.getColumnOffset(this.endColIndex) - translateX + '';
            this.parent.dotNetRef.invokeMethodAsync("VirtualRefresh", {
                requestType: 'virtualscroll',
                startColumnIndex: viewInfo.columnIndexes[0],
                endColumnIndex: viewInfo.columnIndexes[viewInfo.columnIndexes.length - 1],
                axis: 'X',
                VTablewidth: width,
                translateX: this.getColumnOffset(viewInfo.columnIndexes[0] - 1)
            });
            this.setColVTableWidthAndTranslate();
        }
        this.parent.setColumnIndexesInView(this.parent.options.enableColumnVirtualization ? viewInfo.columnIndexes : []);
        this.nextRowToNavigate = this.blazorActiveKey != '' ? this.nextRowToNavigate : 0;
        if (this.preStartIndex !== pStartIndex) {
            this.parent.options.currentPage = viewInfo.currentPage;
            this.parent.dotNetRef.invokeMethodAsync("VirtualRefresh", {
                requestType: 'virtualscroll',
                nextRowToNavigate: this.nextRowToNavigate,
                virtualStartIndex: viewInfo.startIndex,
                virtualEndIndex: viewInfo.endIndex,
                axis: 'Y',
                RHeight: this.parent.getRowHeight()
            });
        }
        this.prevInfo = viewInfo;
        this.blazorActiveKey = '';
    };
    VirtualContentRenderer.prototype.setColVTableWidthAndTranslate = function (args) {
        if (this.parent.options.enableColumnVirtualization && this.prevInfo &&
            (JSON.stringify(this.currentInfo.columnIndexes) !==
                JSON.stringify(this.prevInfo.columnIndexes)) || ((args && args.refresh))) {
            var translateX = this.getColumnOffset(this.startColIndex - 1);
            var width = this.getColumnOffset(this.endColIndex) - translateX + '';
            this.header.virtualEle.setWrapperWidth(width);
            this.virtualEle.setWrapperWidth(width);
            this.header.virtualEle.adjustTable(translateX, 0);
            this.parent.getContentTable().parentElement.style.width = width + 'px';
        }
    };
    VirtualContentRenderer.prototype.refreshOnDataChange = function () {
        this.getPanel().firstElementChild.scrollTop = 0;
        this.getPanel().firstElementChild.scrollLeft = 0;
        if (this.parent.options.enableColumnVirtualization) {
            this.header.virtualEle.adjustTable(0, 0);
        }
        this.virtualEle.adjustTable(0, 0);
        this.refreshOffsets();
        this.refreshVirtualElement();
    };
    // private block(blk: number): boolean {
    //     return this.vHelper.isBlockAvailable(blk);
    // }
    VirtualContentRenderer.prototype.keyDownHandler = function (e) {
        this.blazorActiveKey = (e.key === 'ArrowDown' || e.key === 'ArrowUp') ? e.key : '';
    };
    VirtualContentRenderer.prototype.focusCell = function (cell, action) {
        cell.focus({ preventScroll: true });
        var rowHeight = this.parent.getRowHeight();
        var content = this.parent.getContent();
        if (action == "MoveDownCell" && cell.getBoundingClientRect().bottom > content.getBoundingClientRect().top +
            content.getBoundingClientRect().height - getScrollBarWidth()) {
            content.scrollTop = content.scrollTop + rowHeight;
        }
        else if (action == "MoveUpCell" &&
            cell.getBoundingClientRect().bottom < content.getBoundingClientRect().top + rowHeight) {
            this.isScrollFromFocus = true;
            content.scrollTop = content.scrollTop - rowHeight;
        }
    };
    VirtualContentRenderer.prototype.getInfoFromView = function (direction, info, e) {
        var infoType = { direction: direction, sentinelInfo: info, offsets: e,
            startIndex: this.preStartIndex, endIndex: this.preEndIndex };
        var vHeight = this.parent.options.height.toString().indexOf('%') < 0 ? this.content.getBoundingClientRect().height :
            this.parent.element.getBoundingClientRect().height;
        infoType.page = this.getPageFromTop(e.top + vHeight, infoType);
        infoType.blockIndexes = this.vHelper.getBlockIndexes(infoType.page);
        // infoType.blockIndexes = tempBlocks = this.vHelper.getBlockIndexes(infoType.page);
        // infoType.loadSelf = !this.vHelper.isBlockAvailable(tempBlocks[infoType.block]);
        // let blocks: number[] = this.ensureBlocks(infoType);
        // if (this.activeKey === 'upArrow' && infoType.blockIndexes.toString() !== blocks.toString()) {
        //     // To avoid dupilcate row index problem in key focus support
        //     let newBlock: number = blocks[blocks.length - 1];
        //     if (infoType.blockIndexes.indexOf(newBlock) === -1) {
        //         isBlockAdded = true;
        //     }
        // }
        // infoType.blockIndexes = blocks;
        // infoType.loadNext = !blocks.filter((val: number) => tempBlocks.indexOf(val) === -1)
        //     .every(this.block.bind(this));
        // infoType.event = (infoType.loadNext || infoType.loadSelf) ? 'modelChanged' : 'refreshVirtualBlock';
        // if (isBlockAdded) {
        //     infoType.blockIndexes = [infoType.blockIndexes[0] - 1, infoType.blockIndexes[0], infoType.blockIndexes[0] + 1];
        // }
        infoType.columnIndexes = info.axis === 'X' ? this.vHelper.getColumnIndexes() : this.parent.getColumnIndexesInView();
        //Row Start and End Index calculation
        var rowHeight = this.parent.getRowHeight();
        var exactTopIndex = e.top / rowHeight;
        var noOfInViewIndexes = vHeight / rowHeight;
        var exactEndIndex = exactTopIndex + noOfInViewIndexes;
        var pageSizeBy4 = this.parent.options.pageSize / 4;
        var totalCount = this.parent.options.groupCount ? this.getVisibleGroupedRowCount() : this.count;
        if (infoType.direction === 'down' && !this.isScrollFromFocus) {
            var sIndex = Math.round(exactEndIndex) - Math.round((pageSizeBy4));
            if (sf.base.isNullOrUndefined(infoType.startIndex) || (exactEndIndex >
                (infoType.startIndex + Math.round((this.parent.options.pageSize / 2 + pageSizeBy4)))
                && infoType.endIndex !== totalCount)) {
                infoType.startIndex = sIndex >= 0 ? Math.round(sIndex) : 0;
                infoType.startIndex = infoType.startIndex > exactTopIndex ? Math.floor(exactTopIndex) : infoType.startIndex;
                var eIndex = infoType.startIndex + this.parent.options.pageSize;
                infoType.startIndex = eIndex < exactEndIndex ? (Math.ceil(exactEndIndex) - this.parent.options.pageSize)
                    : infoType.startIndex;
                infoType.endIndex = eIndex < totalCount ? eIndex : totalCount;
                infoType.startIndex = eIndex >= totalCount ?
                    infoType.endIndex - this.parent.options.pageSize : infoType.startIndex;
                infoType.currentPage = Math.ceil(infoType.endIndex / this.parent.options.pageSize);
                this.nextRowToNavigate = Math.floor(exactEndIndex - 1);
            }
        }
        else if (infoType.direction === 'up') {
            if (infoType.startIndex && infoType.endIndex) {
                var loadAtIndex = Math.round(((infoType.startIndex * rowHeight) + (pageSizeBy4 * rowHeight)) / rowHeight);
                if (exactTopIndex < loadAtIndex) {
                    var idxAddedToExactTop = (pageSizeBy4) > noOfInViewIndexes ? pageSizeBy4 :
                        (noOfInViewIndexes + noOfInViewIndexes / 4);
                    var eIndex = Math.round(exactTopIndex + idxAddedToExactTop);
                    infoType.endIndex = eIndex < totalCount ? eIndex : totalCount;
                    var sIndex = infoType.endIndex - this.parent.options.pageSize;
                    infoType.startIndex = sIndex > 0 ? sIndex : 0;
                    infoType.endIndex = sIndex < 0 ? this.parent.options.pageSize : infoType.endIndex;
                    infoType.currentPage = Math.ceil(infoType.startIndex / this.parent.options.pageSize);
                    this.nextRowToNavigate = Math.ceil(exactTopIndex + 1);
                }
            }
        }
        this.isScrollFromFocus = false;
        this.preStartIndex = this.startIndex = infoType.startIndex;
        this.preEndIndex = infoType.endIndex;
        return infoType;
    };
    VirtualContentRenderer.prototype.onDataReady = function () {
        var _this = this;
        this.bindScrollEvent();
        this.count = this.parent.options.totalItemCount;
        this.maxPage = Math.ceil(this.count / this.parent.options.pageSize);
        // this.vHelper.checkAndResetCache(this.parent.options.requestType);
        if (['Refresh', 'Filtering', 'Searching', 'Grouping', 'Ungrouping', 'Reorder',
            'refresh', 'filtering', 'searching', 'grouping', 'ungrouping', 'reorder', null]
            .some(function (value) { return _this.parent.options.requestType === value; })) {
            this.refreshOffsets();
        }
        this.setVirtualHeight();
        this.resetScrollPosition(this.parent.options.requestType);
        this.setColVTableWidthAndTranslate();
        this.prevInfo = this.prevInfo ? this.prevInfo : this.vHelper.getData();
    };
    /** @hidden */
    VirtualContentRenderer.prototype.setVirtualHeight = function () {
        var width = this.parent.options.enableColumnVirtualization ?
            this.getColumnOffset(this.parent.options.columns.length + this.parent.options.groupCount - 1) + 'px' : '100%';
        var virtualHeight = this.parent.options.groupCount
            ? (this.parent.options.visibleGroupedRowsCount * this.parent.getRowHeight()) : this.offsets[this.getTotalBlocks()];
        this.virtualEle.setVirtualHeight(virtualHeight, width);
        if (this.parent.options.enableColumnVirtualization) {
            this.header.virtualEle.setVirtualHeight(1, width);
        }
    };
    VirtualContentRenderer.prototype.getPageFromTop = function (sTop, info) {
        var _this = this;
        var total = (isGroupAdaptive(this.parent)) ? this.getGroupedTotalBlocks() : this.getTotalBlocks();
        var page = 0;
        var extra = this.offsets[total] - this.prevHeight;
        this.offsetKeys.some(function (offset) {
            var iOffset = Number(offset);
            var border = sTop <= _this.offsets[offset] || (iOffset === total && sTop > _this.offsets[offset]);
            if (border) {
                info.block = iOffset % 2 === 0 ? 1 : 0;
                page = Math.max(1, Math.min(_this.vHelper.getPage(iOffset), _this.maxPage));
            }
            return border;
        });
        return page;
    };
    VirtualContentRenderer.prototype.getTranslateY = function (sTop, cHeight, info, isOnenter) {
        if (info === undefined) {
            info = { page: this.getPageFromTop(sTop + cHeight, {}) };
            info.blockIndexes = this.vHelper.getBlockIndexes(info.page);
        }
        var block = (info.blockIndexes[0] || 1) - 1;
        var translate = this.getOffset(block);
        var endTranslate = this.getOffset(info.blockIndexes[info.blockIndexes.length - 1]);
        if (isOnenter) {
            info = this.prevInfo;
        }
        var result = translate > sTop ?
            this.getOffset(block - 1) : endTranslate < (sTop + cHeight) ? this.getOffset(block + 1) : translate;
        var blockHeight = this.offsets[info.blockIndexes[info.blockIndexes.length - 1]] -
            this.tmpOffsets[info.blockIndexes[0]];
        if (result + blockHeight > this.offsets[isGroupAdaptive(this.parent) ? this.getGroupedTotalBlocks() : this.getTotalBlocks()] && this.parent.options.groupCount == 0) {
            result -= (result + blockHeight) - this.offsets[this.getTotalBlocks()];
        }
        return result;
    };
    VirtualContentRenderer.prototype.getOffset = function (block) {
        return Math.min(this.offsets[block] | 0, this.offsets[this.maxBlock] | 0);
    };
    VirtualContentRenderer.prototype.onEntered = function () {
        var _this = this;
        return function (element, current, direction, e, isWheel, check) {
            if (sf.base.Browser.isIE && !isWheel && check && !_this.preventEvent) {
                //ToDo
                //this.parent.showSpinner();
            }
            var xAxis = current.axis === 'X';
            var top = _this.prevInfo.offsets ? _this.prevInfo.offsets.top : null;
            var height = _this.content.getBoundingClientRect().height;
            var x = _this.getColumnOffset(xAxis ? _this.vHelper.getColumnIndexes()[0] - 1 : _this.prevInfo.columnIndexes[0] - 1);
            var y = _this.getTranslateY(e.top, height, xAxis && top === e.top ? _this.prevInfo : undefined, true);
            if (_this.currentInfo && _this.currentInfo.startIndex && xAxis) {
                y = _this.currentInfo.startIndex * _this.parent.getRowHeight();
            }
            _this.virtualEle.adjustTable(x, Math.min(y, _this.offsets[_this.maxBlock]));
            if (xAxis) {
                _this.setColVTableWidthAndTranslate({ refresh: true });
            }
        };
    };
    VirtualContentRenderer.prototype.getBlockSize = function () {
        return this.parent.options.pageSize >> 1;
    };
    VirtualContentRenderer.prototype.getBlockHeight = function () {
        return this.getBlockSize() * this.parent.getRowHeight();
    };
    VirtualContentRenderer.prototype.getGroupedTotalBlocks = function () {
        var visibleRowCount = this.getVisibleGroupedRowCount();
        return Math.floor((visibleRowCount / this.getBlockSize()) < 1 ? 1 : visibleRowCount / this.getBlockSize());
    };
    VirtualContentRenderer.prototype.getVisibleGroupedRowCount = function () {
        var visibleRowCount = Number(this.virtualEle.placeholder.style.height.substring(0, this.virtualEle.placeholder.style.height.indexOf('p'))) / this.parent.getRowHeight();
        return visibleRowCount;
    };
    VirtualContentRenderer.prototype.getTotalBlocks = function () {
        return Math.ceil(this.count / this.getBlockSize());
    };
    VirtualContentRenderer.prototype.getColumnOffset = function (block) {
        return this.vHelper.cOffsets[block] | 0;
    };
    VirtualContentRenderer.prototype.resetScrollPosition = function (action) {
        if (this.actions.some(function (value) { return value === action; })) {
            var content = this.content;
            this.preventEvent = content.scrollTop !== 0;
            content.scrollTop = 0;
        }
    };
    /** @hidden */
    VirtualContentRenderer.prototype.refreshOffsets = function () {
        var gObj = this.parent;
        var row = 0;
        var bSize = this.getBlockSize();
        var total = isGroupAdaptive(this.parent) ? this.getGroupedTotalBlocks() : this.getTotalBlocks();
        this.prevHeight = this.offsets[total];
        this.maxBlock = total % 2 === 0 ? total - 2 : total - 1;
        this.offsets = {};
        var vcRows = [];
        var cache = {};
        //Row offset update
        var blocks = Array.apply(null, Array(total)).map(function () { return ++row; });
        for (var i = 0; i < blocks.length; i++) {
            var tmp = (cache[blocks[i]] || []).length;
            var rem = !isGroupAdaptive(this.parent) ? this.count % bSize : (vcRows.length % bSize);
            var size = !isGroupAdaptive(this.parent) && blocks[i] in cache ?
                tmp * this.parent.getRowHeight() : rem && blocks[i] === total ? rem * this.parent.getRowHeight() :
                this.getBlockHeight();
            // let size: number = this.parent.groupSettings.columns.length && block in this.vHelper.cache ?
            // tmp * getRowHeight() : this.getBlockHeight();
            this.offsets[blocks[i]] = (this.offsets[blocks[i] - 1] | 0) + size;
            this.tmpOffsets[blocks[i]] = this.offsets[blocks[i] - 1] | 0;
        }
        this.offsetKeys = Object.keys(this.offsets);
        //Column offset update
        if (this.parent.options.enableColumnVirtualization) {
            this.vHelper.refreshColOffsets();
        }
    };
    VirtualContentRenderer.prototype.refreshColumnIndexes = function () {
        this.vHelper.refreshColOffsets();
        var colIndexes = this.vHelper.getColumnIndexes();
        this.parent.setColumnIndexesInView(colIndexes);
        this.parent.dotNetRef.invokeMethodAsync("SetColumnIndexes", colIndexes[0], colIndexes[colIndexes.length - 1]);
    };
    VirtualContentRenderer.prototype.refreshVirtualElement = function () {
        this.vHelper.refreshColOffsets();
        this.setVirtualHeight();
    };
    return VirtualContentRenderer;
}());
/**
 * @hidden
 */
var VirtualHeaderRenderer = /** @class */ (function () {
    function VirtualHeaderRenderer(parent) {
        this.virtualEle = new VirtualElementHandler();
        this.parent = parent;
        this.vHelper = new VirtualHelper(this.parent);
        this.headerPanel = this.parent.element.querySelector(".e-gridheader");
    }
    /**
     * Get the header content div element of grid
     * @return {Element}
     */
    VirtualHeaderRenderer.prototype.getPanel = function () {
        return this.headerPanel;
    };
    /**
     * Get the header table element of grid
     * @return {Element}
     */
    VirtualHeaderRenderer.prototype.getTable = function () {
        return this.headerPanel.querySelector('.e-table');
    };
    VirtualHeaderRenderer.prototype.renderTable = function () {
        this.vHelper.refreshColOffsets();
        this.parent.setColumnIndexesInView(this.vHelper.getColumnIndexes(this.getPanel().querySelector('.e-headercontent')));
        this.virtualEle.table = this.getTable();
        this.virtualEle.content = this.getPanel().querySelector('.e-headercontent');
        this.virtualEle.content.style.position = 'relative';
        this.virtualEle.renderWrapper();
        this.virtualEle.renderPlaceHolder();
    };
    return VirtualHeaderRenderer;
}());
/**
 * @hidden
 */
var VirtualElementHandler = /** @class */ (function () {
    function VirtualElementHandler() {
    }
    VirtualElementHandler.prototype.renderWrapper = function (height) {
        this.wrapper = this.content.querySelector('.e-virtualtable');
        this.wrapper.setAttribute('styles', "min-height:" + sf.base.formatUnit(height));
    };
    VirtualElementHandler.prototype.renderPlaceHolder = function () {
        this.placeholder = this.content.querySelector('.e-virtualtrack');
    };
    VirtualElementHandler.prototype.adjustTable = function (xValue, yValue) {
        this.wrapper.style.transform = "translate(" + xValue + "px, " + yValue + "px)";
    };
    VirtualElementHandler.prototype.setWrapperWidth = function (width, full) {
        this.wrapper.style.width = width ? width + "px" : full ? '100%' : '';
    };
    VirtualElementHandler.prototype.setVirtualHeight = function (height, width) {
        this.placeholder.style.height = height + "px";
        this.placeholder.style.width = width;
    };
    return VirtualElementHandler;
}());
/**
 * Content module is used to render grid content
 */
var VirtualHelper = /** @class */ (function () {
    function VirtualHelper(parent) {
        this.cOffsets = {};
        this.data = {};
        this.groups = {};
        this.parent = parent;
    }
    VirtualHelper.prototype.getBlockIndexes = function (page) {
        return [page + (page - 1), page * 2];
    };
    VirtualHelper.prototype.getPage = function (block) {
        return block % 2 === 0 ? block / 2 : (block + 1) / 2;
    };
    // public isBlockAvailable(value: number): boolean {
    //     // return value in this.cache;
    // }
    VirtualHelper.prototype.getData = function () {
        return {
            page: this.parent.options.currentPage,
            blockIndexes: this.getBlockIndexes(this.parent.options.currentPage),
            direction: 'down',
            columnIndexes: this.parent.getColumnIndexesInView()
        };
    };
    // private getStartIndex(blk: number, data: Object[], full: boolean = true): number {
    //     let page: number = this.getPage(blk); let even: boolean = blk % 2 === 0;
    //     let index: number = (page - 1) * this.model.pageSize;
    //     return full || !even ? index : index + ~~(this.model.pageSize / 2);
    // }
    VirtualHelper.prototype.getColumnIndexes = function (content) {
        var _this = this;
        if (content === void 0) { content = this.parent.getHeaderContent(); }
        var indexes = [];
        var sLeft = content.scrollLeft | 0;
        var keys = Object.keys(this.cOffsets);
        var cWidth = this.parent.options.needClientAction ? content.getBoundingClientRect().width :
            Number(this.parent.options.width);
        sLeft = Math.min(this.cOffsets[keys.length - 1] - cWidth, sLeft);
        var calWidth = sf.base.Browser.isDevice ? 2 * cWidth : cWidth / 2;
        var left = sLeft + cWidth + (sLeft === 0 ? calWidth : 0);
        keys.some(function (offset, indx, input) {
            var iOffset = Number(offset);
            var offsetVal = _this.cOffsets[offset];
            var border = sLeft - calWidth <= offsetVal && left + calWidth >= offsetVal;
            if (border) {
                indexes.push(iOffset);
            }
            return left + calWidth < offsetVal;
        });
        this.parent.virtualContentModule.startColIndex = indexes[0];
        this.parent.virtualContentModule.endColIndex = indexes[indexes.length - 1];
        return indexes;
    };
    // public checkAndResetCache(action: string): boolean {
    //     let clear: boolean = ['paging', 'refresh', 'sorting', 'filtering', 'searching', 'grouping', 'ungrouping', 'reorder',
    //                         'save', 'delete'].some((value: string) => action === value);
    //     if (clear) {
    //         this.cache = {}; this.data = {}; this.groups = {};
    //     }
    //     return clear;
    // }
    VirtualHelper.prototype.refreshColOffsets = function () {
        var col = 0;
        this.cOffsets = {};
        var gLen = this.parent.options.groupCount;
        var cols = this.parent.options.columns;
        var cLen = cols.length;
        // let isVisible: Function = (column: Column) => column.visible &&
        //     (!this.parent.options.showGroupedColumn ? this.parent.options.groupedColumns.indexOf(column.field) < 0 : column.visible);
        // let c: string[] = this.parent.options.groupedColumns || [];
        // for (let i: number = 0; i < c.length; i++) {
        //     this.cOffsets[i] = (this.cOffsets[i - 1] | 0) + 30;
        // }
        var blocks = Array.apply(null, Array(cLen)).map(function () { return col++; });
        for (var j = 0; j < blocks.length; j++) {
            blocks[j] = blocks[j] + gLen;
            this.cOffsets[blocks[j]] = (this.cOffsets[blocks[j] - 1] | 0) + (cols[j].visible ? parseInt(cols[j].width, 10) : 0);
        }
    };
    return VirtualHelper;
}());

/**
 * SfGrid client constructor
 */
var SfGrid = /** @class */ (function () {
    function SfGrid(element, options, dotnetRef) {
        this.columnModel = [];
        this.inViewIndexes = [];
        this.isRendered = false;
        this.element = element;
        if (sf.base.isNullOrUndefined(element)) {
            return;
        }
        if (!sf.base.isNullOrUndefined(element)) {
            this.element.blazor__instance = this;
        }
        this.dotNetRef = dotnetRef;
        this.options = options;
        this.header = this.element.querySelector('.e-headercontent');
        this.content = this.element.querySelector('.e-gridcontent .e-content');
        this.footer = this.element.querySelector('.e-summarycontent');
        this.initModules();
    }
    SfGrid.prototype.initModules = function () {
        this.scrollModule = new Scroll(this);
        this.freezeModule = new Freeze(this);
        this.headerDragDrop = new HeaderDragDrop(this);
        this.contentDragDrop = new ContentDragDrop(this);
        this.reorderModule = new Reorder(this);
        this.groupModule = new Group(this);
        this.resizeModule = new Resize(this);
        this.editModule = new Edit(this);
        this.columnChooserModule = new ColumnChooser(this);
        this.clipboardModule = new Clipboard(this);
        this.columnMenuModule = new ColumnMenu(this);
        this.filterModule = new Filter(this);
        this.virtualContentModule = new VirtualContentRenderer(this);
        this.virtualHeaderModule = new VirtualHeaderRenderer(this);
        this.toolTipModule = new CustomToolTip(this);
        this.rowDragAndDropModule = new RowDD(this);
        this.selectionModule = new Selection(this);
        this.isRendered = this.options.isPrerendered;
        this.keyModule = new sf.base.KeyboardEvents(this.element, {
            keyAction: this.keyActionHandler.bind(this),
            keyConfigs: gridKeyConfigs,
            eventName: 'keydown'
        });
        if (this.options.enableColumnVirtualization) {
            this.virtualHeaderModule.renderTable();
        }
        if (this.options.enableVirtualization) {
            this.virtualContentModule.renderTable();
        }
        if (this.options.allowResizing) {
            this.resizeModule.render();
        }
        // needClientAction should only be used for virtual scroll and hideAtMedia features
        if (!this.options.needClientAction) {
            this.contentReady();
        }
        else {
            this.clientActions();
        }
        this.wireEvents();
    };
    SfGrid.prototype.getHeaderContent = function () { return this.header; };
    SfGrid.prototype.getHeaderTable = function () { return this.header.querySelector('.e-table'); };
    SfGrid.prototype.getContent = function () { return this.content; };
    SfGrid.prototype.getContentTable = function () { return this.content.querySelector('.e-table'); };
    SfGrid.prototype.getFooterContent = function () { return this.footer; };
    SfGrid.prototype.getColumns = function (isRefresh) {
        // let inview: number[] = this.inViewIndexes.map((v: number) => v - this.groupSettings.columns.length).filter((v: number) => v > -1);
        // let vLen: number = inview.length;
        // if (!this.enableColumnVirtualization || isNullOrUndefined(this.columnModel) || this.columnModel.length === 0 || isRefresh) {
        //     this.columnModel = [];
        //     this.updateColumnModel(this.columns as Column[]);
        // }
        // let columns: Column[] = vLen === 0 ? this.columnModel :
        //     this.columnModel.slice(inview[0], inview[vLen - 1] + 1);
        this.columnModel = [];
        this.updateColumnModel(this.options.columns);
        return this.columnModel;
    };
    SfGrid.prototype.updateColumnModel = function (columns) {
        for (var i = 0, len = columns.length; i < len; i++) {
            if (columns[i].columns) {
                this.updateColumnModel(columns[i].columns);
            }
            else {
                this.columnModel.push(columns[i]);
            }
        }
        // this.updateFrozenColumns();
        // this.updateLockableColumns();
    };
    SfGrid.prototype.getColumnByIndex = function (index) {
        var column;
        this.getColumns().some(function (col, i) {
            column = col;
            return i === index;
        });
        return column;
    };
    SfGrid.prototype.getDataRows = function () {
        if (sf.base.isNullOrUndefined(this.getContentTable().querySelector('tbody'))) {
            return [];
        }
        var rows = [].slice.call(this.getContentTable().querySelector('tbody').children);
        if (this.options.frozenRows) {
            var freezeRows = [].slice.call(this.getHeaderTable().querySelector('tbody').children);
            rows = this.addMovableRows(freezeRows, rows);
        }
        var dataRows = this.generateDataRows(rows);
        return dataRows;
    };
    SfGrid.prototype.addMovableRows = function (fRows, mrows) {
        for (var i = 0, len = mrows.length; i < len; i++) {
            fRows.push(mrows[i]);
        }
        return fRows;
    };
    SfGrid.prototype.generateDataRows = function (rows) {
        var dRows = [];
        for (var i = 0, len = rows.length; i < len; i++) {
            if (rows[i].classList.contains('e-row') && !rows[i].classList.contains('e-hiddenrow')) {
                dRows.push(rows[i]);
            }
        }
        return dRows;
    };
    SfGrid.prototype.getMovableDataRows = function () {
        var rows = [].slice.call(this.getContent().querySelector('.e-movablecontent').querySelector('tbody').children);
        if (this.options.frozenRows) {
            var freezeRows = [].slice.call(this.getHeaderContent().querySelector('.e-movableheader').querySelector('tbody').children);
            rows = this.addMovableRows(freezeRows, rows);
        }
        var dataRows = this.generateDataRows(rows);
        return dataRows;
    };
    SfGrid.prototype.getFrozenDataRows = function () {
        var rows = [].slice.call(this.getContent().querySelector('.e-frozencontent').querySelector('tbody').children);
        if (this.options.frozenRows) {
            var freezeRows = [].slice.call(this.getHeaderContent().querySelector('.e-frozenheader').querySelector('tbody').children);
            rows = this.addMovableRows(freezeRows, rows);
        }
        var dataRows = this.generateDataRows(rows);
        return dataRows;
    };
    SfGrid.prototype.getRowByIndex = function (index) {
        return this.getDataRows()[index];
    };
    SfGrid.prototype.getCellFromIndex = function (rowIndex, columnIndex) {
        var frzCols = this.options.frozenColumns;
        return frzCols && columnIndex >= frzCols ?
            this.getMovableDataRows()[rowIndex] && this.getMovableDataRows()[rowIndex].querySelectorAll('.e-rowcell')[columnIndex - frzCols] :
            this.getDataRows()[rowIndex] && this.getDataRows()[rowIndex].querySelectorAll('.e-rowcell')[columnIndex];
    };
    SfGrid.prototype.getColumnHeaderByIndex = function (index) {
        return this.getHeaderTable().querySelectorAll('.e-headercell')[index];
    };
    SfGrid.prototype.getRows = function () {
        return this.options.frozenColumns ? this.getFrozenDataRows() : [].slice.call(this.getContentTable().querySelectorAll('tr.e-row[data-uid]'));
    };
    SfGrid.prototype.getSelectedRows = function () {
        return this.getRows().filter(function (row) { return row.getAttribute('aria-selected') === 'true'; });
    };
    SfGrid.prototype.getSelectedRowIndexes = function () {
        var selectedIndexes = [];
        var rows = this.getRows();
        for (var i = 0; i < rows.length; i++) {
            if (rows[i].hasAttribute('aria-selected') && rows[i].getAttribute('aria-selected') === "true") {
                selectedIndexes.push(i);
            }
        }
        return selectedIndexes;
    };
    SfGrid.prototype.getVisibleColumns = function () {
        var cols = [];
        for (var _i = 0, _a = this.columnModel; _i < _a.length; _i++) {
            var col = _a[_i];
            if (col.visible) {
                cols.push(col);
            }
        }
        return cols;
    };
    /**
     * Gets a Column by column name.
     * @param  {string} field - Specifies the column name.
     * @return {Column}
     * @blazorType GridColumn
     */
    SfGrid.prototype.getColumnByField = function (field) {
        return iterateArrayOrObject(this.getColumns(), function (item, index) {
            if (item.field === field) {
                return item;
            }
            return undefined;
        })[0];
    };
    /**
     * Gets a column index by column name.
     * @param  {string} field - Specifies the column name.
     * @return {number}
     */
    SfGrid.prototype.getColumnIndexByField = function (field) {
        var cols = this.getColumns();
        for (var i = 0; i < cols.length; i++) {
            if (cols[i].field === field) {
                return i;
            }
        }
        return -1;
    };
    /**
     * Gets a column by UID.
     * @param  {string} uid - Specifies the column UID.
     * @return {Column}
     * @blazorType GridColumn
     */
    SfGrid.prototype.getColumnByUid = function (uid) {
        return iterateArrayOrObject(this.getColumns().concat(this.getStackedColumns(this.options.columns)), function (item, index) {
            if (item.uid === uid) {
                return item;
            }
            return undefined;
        })[0];
    };
    /**
     * @hidden
     */
    SfGrid.prototype.getStackedColumns = function (columns, stackedColumn) {
        if (stackedColumn === void 0) { stackedColumn = []; }
        for (var _i = 0, columns_1 = columns; _i < columns_1.length; _i++) {
            var column = columns_1[_i];
            if (column.columns) {
                stackedColumn.push(column);
                this.getStackedColumns(column.columns, stackedColumn);
            }
        }
        return stackedColumn;
    };
    /**
     * Gets a column index by UID.
     * @param  {string} uid - Specifies the column UID.
     * @return {number}
     */
    SfGrid.prototype.getColumnIndexByUid = function (uid) {
        var index = iterateArrayOrObject(this.getColumns(), function (item, index) {
            if (item.uid === uid) {
                return index;
            }
            return undefined;
        })[0];
        return !sf.base.isNullOrUndefined(index) ? index : -1;
    };
    /**
     * Gets a column header by UID.
     * @param  {string} field - Specifies the column uid.
     * @return {Element}
     */
    SfGrid.prototype.getColumnHeaderByUid = function (uid) {
        return this.getHeaderContent().querySelector('[e-mappinguid=' + uid + ']').parentElement;
    };
    /**
     * Gets UID by column name.
     * @param  {string} field - Specifies the column name.
     * @return {string}
     */
    SfGrid.prototype.getUidByColumnField = function (field) {
        return iterateArrayOrObject(this.getColumns(), function (item, index) {
            if (item.field === field) {
                return item.uid;
            }
            return undefined;
        })[0];
    };
    SfGrid.prototype.getStackedHeaderColumnByHeaderText = function (stackedHeader, col) {
        for (var i = 0; i < col.length; i++) {
            var individualColumn = col[i];
            if (individualColumn.field === stackedHeader || individualColumn.headerText === stackedHeader) {
                this.stackedColumn = individualColumn;
                break;
            }
            else if (individualColumn.columns) {
                this.getStackedHeaderColumnByHeaderText(stackedHeader, individualColumn.columns);
            }
        }
        return this.stackedColumn;
    };
    /**
 * Gets TH index by column uid value.
 * @private
 * @param  {string} uid - Specifies the column uid.
 * @return {number}
 */
    SfGrid.prototype.getNormalizedColumnIndex = function (uid) {
        var index = this.getColumnIndexByUid(uid);
        return index + this.getIndentCount();
    };
    /**
    * Gets indent cell count.
    * @private
    * @return {number}
    */
    SfGrid.prototype.getIndentCount = function () {
        var index = 0;
        if (this.options.allowGrouping) {
            index += this.options.groupCount;
        }
        if (this.options.hasDetailTemplate) {
            index++;
        }
        if (this.options.allowRowDragAndDrop && this.options.hasDropTarget) {
            index++;
        }
        /**
         * TODO: index normalization based on the stacked header, grouping and detailTemplate
         * and frozen should be handled here
         */
        return index;
    };
    /**
     * Gets indent Cell Width
     * @hidden
     */
    SfGrid.prototype.recalcIndentWidth = function () {
        if (!this.isRendered || !this.getHeaderTable().querySelector('.e-emptycell')) {
            return;
        }
        // Handle Detail and DragDrop
        if ((!this.options.groupCount && !this.options.hasDetailTemplate &&
            (this.options.allowRowDragAndDrop && this.options.hasDropTarget)) || !this.getContentTable()
            || this.getHeaderTable().querySelector('.e-emptycell').getAttribute("indentRefreshed")) {
            return;
        }
        var indentWidth = this.getHeaderTable().querySelector('.e-emptycell').parentElement.offsetWidth;
        var perPixel = indentWidth / 30;
        if (perPixel >= 1) {
            indentWidth = (30 / perPixel);
        }
        // if (this.enableColumnVirtualization || this.isAutoGen) { indentWidth = 30; }
        // if (this.isDetail()) {
        //     applyWidth(i, indentWidth);
        //     i++;
        // }
        // if (this.isRowDragable()) {
        //     applyWidth(i, indentWidth);
        // }
        this.getHeaderTable().querySelector('.e-emptycell').setAttribute('indentRefreshed', 'true');
        this.dotNetRef.invokeMethodAsync('SetIndentWidth', indentWidth + 'px');
    };
    SfGrid.prototype.contentReady = function (action) {
        if (action === void 0) { action = null; }
        if (this.getColumns().some(function (x) { return x.autoFit; })) {
            this.resizeModule.autoFit();
        }
        if (this.options.frozenColumns) {
            this.freezeModule.refreshRowHeight();
        }
        if (this.options.enableVirtualization) {
            this.virtualContentModule.onDataReady();
        }
        this.recalcIndentWidth();
        if (action === 'Paging') { //restore focus on paging.
            if (!parentsUntil(document.activeElement, 'e-grid')) {
                this.element.focus();
            }
        }
    };
    SfGrid.prototype.wireEvents = function () {
        sf.base.EventHandler.add(this.element, 'mousedown', this.mouseDownHandler, this);
        sf.base.EventHandler.add(this.element, 'focus', this.gridFocus, this);
        sf.base.EventHandler.add(document, 'click', this.documentClickHandler, this);
        sf.base.EventHandler.add(this.element, 'keydown', this.gridKeyDownHandler, this);
        sf.base.EventHandler.add(this.element, 'keydown', this.keyDownHandler, this);
    };
    SfGrid.prototype.unWireEvents = function () {
        sf.base.EventHandler.remove(this.element, 'mousedown', this.mouseDownHandler);
        sf.base.EventHandler.remove(this.element, 'focus', this.gridFocus);
        sf.base.EventHandler.remove(document, 'click', this.documentClickHandler);
        sf.base.EventHandler.remove(this.element, 'keydown', this.gridKeyDownHandler);
        sf.base.EventHandler.remove(this.element, 'keydown', this.keyDownHandler);
    };
    SfGrid.prototype.setOptions = function (newOptions, options) {
        var oldOptions = sf.base.extend(options, {});
        this.options = newOptions;
        if (!oldOptions.allowResizing && newOptions.allowResizing) {
            this.resizeModule.render();
        }
        if ((!oldOptions.allowGrouping && newOptions.allowGrouping)
            || (!oldOptions.allowReordering && newOptions.allowReordering)) {
            this.headerDragDrop.initializeHeaderDrag();
            this.headerDragDrop.initializeHeaderDrop();
            this.groupModule.initializeGHeaderDrag();
            this.groupModule.initializeGHeaderDrop();
        }
        if (!oldOptions.allowGrouping && newOptions.allowGrouping) {
            this.contentDragDrop.initializeContentDrop();
        }
        if (!oldOptions.allowRowDragAndDrop && newOptions.allowRowDragAndDrop) {
            this.rowDragAndDropModule.initializeDrag();
        }
        else if (oldOptions.allowRowDragAndDrop && !newOptions.allowRowDragAndDrop) {
            this.rowDragAndDropModule.destroy();
        }
        if (!this.isRendered) {
            this.isRendered = this.options.isPrerendered;
        }
        if (oldOptions.groupCount != newOptions.groupCount) {
            var cell = this.getHeaderTable().querySelector('.e-emptycell');
            if (!cell) {
                return;
            }
            cell.removeAttribute('indentRefreshed');
        }
    };
    SfGrid.prototype.documentClickHandler = function (e) {
        var popupElement = parentsUntil(e.target, 'e-popup-open');
        var CCButton = parentsUntil(e.target, 'e-cc-toolbar');
        if (!popupElement && !(e.target.classList.contains('e-cc-cancel')) && !(e.target.classList.contains('e-choosercheck')) && !(e.target.classList.contains('e-fltrcheck')) && !(e.target.classList.contains('e-icon-filter')) && !CCButton && (this.element.querySelectorAll('.e-filter-popup.e-popup-open').length || this.element.querySelectorAll('.e-ccdlg.e-popup-open').length)) {
            this.dotNetRef.invokeMethodAsync('FilterPopupClose');
        }
    };
    SfGrid.prototype.keyDownHandler = function (e) {
        var gridElement = parentsUntil(e.target, 'e-grid');
        if ((gridElement && gridElement.id !== this.element.id) ||
            (e.key == "Shift" || e.key == "Control" || e.key == "Alt")) {
            return;
        }
        if (e.target.tagName == "INPUT" && e.code == "Delete") {
            return;
        }
        this.dotNetRef.invokeMethodAsync("GridKeyDown", {
            key: e.key,
            code: e.code,
            ctrlKey: e.ctrlKey,
            shiftKey: e.shiftKey,
            altKey: e.altKey
        });
    };
    SfGrid.prototype.gridKeyDownHandler = function (e) {
        var popupElement = parentsUntil(e.target, 'e-filter-popup');
        if (!sf.base.isNullOrUndefined(popupElement) && popupElement.classList.contains('e-popup-open') && e.key != 'Escape') {
            e.stopPropagation();
            if ((e.key == "Tab" || e.key == "shiftTab" || e.key == "Enter" || e.key == "shiftEnter") &&
                e.target.tagName == "INPUT") {
                var evt = document.createEvent('HTMLEvents');
                evt.initEvent('change', false, true);
                e.target.dispatchEvent(evt);
            }
        }
        if (e.key == "Shift" || e.key == "Control" || e.key == "Alt") {
            e.stopPropagation(); //dont let execute c# keydown handler for meta keys.
        }
        if (e.keyCode === 67 && e.ctrlKey) {
            this.clipboardModule.copy();
        }
        else if (e.keyCode === 72 && e.ctrlKey && e.shiftKey) {
            this.clipboardModule.copy(true);
        }
        if (e.keyCode === 86 && e.ctrlKey && !this.options.isEdit) {
            this.clipboardModule.pasteHandler();
        }
        if (this.element.querySelector('.e-batchrow')) {
            if (e.key != "Tab" && e.key != "shiftTab" && e.key != "Enter" && e.key != "shiftEnter"
                && e.key != "Escape") {
                e.stopPropagation();
            }
            //new
            if (e.key == "Tab" || e.key == "shiftTab" || e.key == "Enter" || e.key == "shiftEnter") {
                e.preventDefault();
                if (e.target.tagName == "INPUT") {
                    var evt = document.createEvent('HTMLEvents');
                    evt.initEvent('change', false, true);
                    e.target.dispatchEvent(evt);
                }
            }
        }
    };
    SfGrid.prototype.mouseDownHandler = function (e) {
        var gridElement = parentsUntil(e.target, 'e-grid');
        if (gridElement && gridElement.id !== this.element.id) {
            return;
        }
        if (e.shiftKey || e.ctrlKey) {
            e.preventDefault(); //prevent user select on shift pressing during selection
        }
        // e.button = 2 for right mouse button click
        if ((e.button !== 2 && parentsUntil(e.target, 'e-headercell')) || sf.base.closest(e.target, ".e-groupdroparea") || sf.base.closest(e.target, ".e-gridpopup")
            || sf.base.closest(e.target, ".e-summarycell") || sf.base.closest(e.target, ".e-rhandler")
            || sf.base.closest(e.target, ".e-filtermenudiv") || sf.base.closest(e.target, ".e-filterbarcell")
            || sf.base.closest(e.target, ".e-groupcaption")) {
            this.dotNetRef.invokeMethodAsync("MouseDownHandler", null, null);
        }
        else {
            var target = null;
            var cellUid = null;
            var editForm = parentsUntil(parentsUntil(e.target, 'e-gridform'), 'e-grid');
            if (parentsUntil(e.target, 'e-editcell') || editForm && editForm.id == gridElement.id) {
                target = "Edit";
            }
            else if (parentsUntil(e.target, 'e-pager')) {
                target = "Pager";
            }
            else if (parentsUntil(e.target, 'e-headercontent')) {
                target = "Header";
                cellUid = parentsUntil(e.target, 'e-headercell') ? parentsUntil(e.target, 'e-headercell').getAttribute('data-uid') : null;
            }
            else if (parentsUntil(e.target, 'e-content')) {
                target = "Content";
                cellUid = parentsUntil(e.target, 'e-rowcell') ? parentsUntil(e.target, 'e-rowcell').getAttribute('data-uid') : null;
            }
            if (target == "Header" || target == "Content" || target == "Pager" || target == "Edit") {
                this.dotNetRef.invokeMethodAsync("MouseDownHandler", target, cellUid);
            }
        }
    };
    SfGrid.prototype.gridFocus = function (e) {
        if (!sf.base.isNullOrUndefined(this.element.querySelector(".e-gridform")) &&
            this.element.querySelector(".e-gridform").classList.contains("e-editing")) {
            return;
        }
        this.dotNetRef.invokeMethodAsync("GridFocus", e);
    };
    SfGrid.prototype.keyActionHandler = function (e) {
        var _this = this;
        if (e.action === 'pageUp' || e.action === 'pageDown' || e.action === 'ctrlAltPageUp'
            || e.action === 'ctrlAltPageDown' || e.action === 'altPageUp' || e.action === 'altPageDown'
            || e.action === 'altDownArrow' || e.action === 'ctrlPlusP') {
            e.preventDefault();
        }
        if (e.action === 'enter' && !sf.base.isNullOrUndefined(this.element.querySelector(".e-gridform"))
            && this.element.querySelector(".e-gridform").classList.contains("e-editing")
            && this.options.editMode !== "Batch") {
            setTimeout(function () {
                e.target.blur();
                _this.dotNetRef.invokeMethodAsync("EndEdit");
            }, 40);
        }
    };
    SfGrid.prototype.destroy = function () {
        this.unWireEvents();
        this.toolTipModule.destroy();
        this.keyModule.destroy();
        this.virtualContentModule.removeEventListener();
        this.columnChooserModule.removeMediaListener();
        this.selectionModule.removeEventListener();
        this.rowDragAndDropModule.destroy();
    };
    /**
         * @private
         */
    SfGrid.prototype.getColumnIndexesInView = function () {
        return this.inViewIndexes;
    };
    /**
     * @private
     */
    SfGrid.prototype.setColumnIndexesInView = function (indexes) {
        this.inViewIndexes = indexes;
    };
    SfGrid.prototype.getRowHeight = function () {
        return this.options.rowHeight ? this.options.rowHeight : getRowHeight(this.element);
    };
    SfGrid.prototype.clientActions = function () {
        if (this.options.enableVirtualization && (this.options.pageSize === 12 || this.options.width === 'auto')) {
            this.virtualContentModule.ensurePageSize();
        }
        if (this.getColumns().some(function (col) { return col.hideAtMedia !== ''; })) {
            this.columnChooserModule.setMediaColumns();
        }
    };
    SfGrid.prototype.print = function () {
        this.removeColGroup();
        var printWind = window.open('', 'print', 'height=' + window.outerHeight + ',width=' + window.outerWidth + ',tabbar=no');
        printWind.moveTo(0, 0);
        printWind.resizeTo(screen.availWidth, screen.availHeight);
        sf.base.print(this.element, printWind);
    };
    SfGrid.prototype.removeColGroup = function () {
        var depth = this.options.groupCount;
        var element = this.element;
        var id = '#' + this.element.id;
        if (!depth) {
            return;
        }
        var groupCaption = element.querySelectorAll(".e-groupcaption");
        var colSpan = groupCaption[depth - 1].getAttribute('colspan');
        for (var i = 0; i < groupCaption.length; i++) {
            groupCaption[i].setAttribute('colspan', colSpan);
        }
        var colGroups = element.querySelectorAll("colgroup" + id + "colGroup");
        var contentColGroups = element.querySelector('.e-content').querySelectorAll('colgroup');
        this.hideColGroup(colGroups, depth);
        this.hideColGroup(contentColGroups, depth);
    };
    SfGrid.prototype.hideColGroup = function (colGroups, depth) {
        for (var i = 0; i < colGroups.length; i++) {
            for (var j = 0; j < depth; j++) {
                colGroups[i].children[j].style.display = 'none';
            }
        }
    };
    /**
     * For internal use only - Get the module name.
     * @private
     */
    SfGrid.prototype.getModuleName = function () {
        return 'grid';
    };
    return SfGrid;
}());
var gridKeyConfigs = {
    pageUp: 'pageup',
    pageDown: 'pagedown',
    ctrlAltPageUp: 'ctrl+alt+pageup',
    ctrlAltPageDown: 'ctrl+alt+pagedown',
    altPageUp: 'alt+pageup',
    altPageDown: 'alt+pagedown',
    altDownArrow: 'alt+downarrow',
    altUpArrow: 'alt+uparrow',
    ctrlDownArrow: 'ctrl+downarrow',
    ctrlUpArrow: 'ctrl+uparrow',
    ctrlPlusA: 'ctrl+A',
    ctrlPlusP: 'ctrl+P',
    ctrlPlusC: 'ctrl+C',
    ctrlShiftPlusH: 'ctrl+shift+H',
    enter: 'enter',
};

/**
 * Blazor grid interop handler
 */
// tslint:disable
var Grid = {
    initialize: function (element, options, dotnetRef) {
        sf.base.enableBlazorMode();
        new SfGrid(element, options, dotnetRef);
    },
    contentReady: function (element, options, action) {
        if (!sf.base.isNullOrUndefined(element) && !sf.base.isNullOrUndefined(element.blazor__instance)) {
            var instance = element.blazor__instance;
            instance.setOptions(options, instance.options);
            instance.options = options;
            instance.contentReady(action);
        }
    },
    reorderColumns: function (element, fromFName, toFName) {
        if (!sf.base.isNullOrUndefined(element) && !sf.base.isNullOrUndefined(element.blazor__instance)) {
            element.blazor__instance.reorderModule.reorderColumns(fromFName, toFName);
        }
    },
    reorderColumnByIndex: function (element, fromIndex, toIndex) {
        if (!sf.base.isNullOrUndefined(element) && !sf.base.isNullOrUndefined(element.blazor__instance)) {
            element.blazor__instance.reorderModule.reorderColumnByIndex(fromIndex, toIndex);
        }
    },
    reorderColumnByTargetIndex: function (element, fieldName, toIndex) {
        if (!sf.base.isNullOrUndefined(element) && !sf.base.isNullOrUndefined(element.blazor__instance)) {
            element.blazor__instance.reorderModule.reorderColumnByTargetIndex(fieldName, toIndex);
        }
    },
    renderColumnChooser: function (element) {
        if (!sf.base.isNullOrUndefined(element) && !sf.base.isNullOrUndefined(element.blazor__instance)) {
            element.blazor__instance.columnChooserModule.renderColumnChooser();
        }
    },
    renderColumnMenu: function (element, uid, isFilter, key) {
        if (!sf.base.isNullOrUndefined(element) && !sf.base.isNullOrUndefined(element.blazor__instance)) {
            return element.blazor__instance.columnMenuModule.renderColumnMenu(uid, isFilter, key);
        }
        else {
            return { Left: 1, Top: 1 };
        }
    },
    filterPopupRender: function filterPopupRender(element, dlgID, uid, type, isColumnMenu) {
        if (!sf.base.isNullOrUndefined(element) && !sf.base.isNullOrUndefined(element.blazor__instance)) {
            element.blazor__instance.filterModule.filterPopupRender(dlgID, uid, type, isColumnMenu);
        }
    },
    autoFitColumns: function (element, fieldNames) {
        if (!sf.base.isNullOrUndefined(element) && !sf.base.isNullOrUndefined(element.blazor__instance)) {
            element.blazor__instance.resizeModule.autoFitColumns(fieldNames);
        }
    },
    refreshColumnIndex: function (element, columns) {
        if (!sf.base.isNullOrUndefined(element) && !sf.base.isNullOrUndefined(element.blazor__instance)) {
            var instance = element.blazor__instance;
            instance.options.columns = columns;
            instance.virtualContentModule.refreshColumnIndexes();
        }
    },
    focus: function (element, rowuid, celluid, action) {
        var cell = element.querySelector("[data-uid=\"" + celluid + "\"]");
        if (!sf.base.isNullOrUndefined(element) && !sf.base.isNullOrUndefined(element.blazor__instance)) {
            var instance = element.blazor__instance;
            if (!instance.options.enableVirtualization) {
                cell.focus();
            }
            else {
                instance.virtualContentModule.focusCell(cell, action);
            }
        }
    },
    refreshOnDataChange: function (element) {
        if (!sf.base.isNullOrUndefined(element) && !sf.base.isNullOrUndefined(element.blazor__instance)) {
            element.blazor__instance.virtualContentModule.refreshOnDataChange();
        }
    },
    focusChild: function (element, rowuid, celluid) {
        var query = 'button, [href], input:not([type="hidden"]), select, textarea, [tabindex]:not([tabindex="-1"])';
        var child = [].slice.call(element.querySelector("[data-uid=\"" + celluid + "\"]").querySelectorAll(query));
        /* Select the first focusable child element
         * if no child found then select the cell itself.
         * if Grid is in editable state, check for editable control inside child.
         */
        child.length > 0 ? child[0].focus() : element.querySelector("[data-uid=\"" + celluid + "\"]").focus();
        return child.length ? true : false;
    },
    exportSave: function (filename, bytesBase64) {
        if (navigator.msSaveBlob) {
            //Download document in Edge browser
            var data = window.atob(bytesBase64);
            var bytes = new Uint8Array(data.length);
            for (var i = 0; i < data.length; i++) {
                bytes[i] = data.charCodeAt(i);
            }
            var blob = new Blob([bytes.buffer], { type: "application/octet-stream" });
            navigator.msSaveBlob(blob, filename);
        }
        else {
            var link = document.createElement('a');
            link.download = filename;
            link.href = "data:application/octet-stream;base64," + bytesBase64;
            document.body.appendChild(link); // Needed for Firefox
            link.click();
            document.body.removeChild(link);
        }
    },
    destroy: function (element) {
        if (!sf.base.isNullOrUndefined(element) && !sf.base.isNullOrUndefined(element.blazor__instance)) {
            element.blazor__instance.destroy();
        }
    },
    validation: function (element, results, isAdd) {
        if (!sf.base.isNullOrUndefined(element) && !sf.base.isNullOrUndefined(element.blazor__instance)) {
            element.blazor__instance.editModule.createTooltip(results, isAdd);
        }
    },
    focusCell: function (element, field, isAdd) {
        if (isAdd && !sf.base.isNullOrUndefined(element) && !sf.base.isNullOrUndefined(element.blazor__instance) && element.blazor__instance.options.frozenColumns) {
            element.querySelector('.e-frozencontent').style.height =
                element.querySelector('.e-movablecontent').getBoundingClientRect().height + 'px';
        }
        var complexField = "#" + field.replace(/[.]/g, "___");
        if (field === "" && element.querySelector("input.e-boolcell")) {
            element.querySelector("input.e-boolcell").focus();
        }
        else if (field !== "" && element.querySelector(complexField)) {
            element.querySelector(complexField).focus();
        }
    },
    setFrozenHeight: function (element) {
        element.querySelector('.e-frozencontent').style.height =
            element.querySelector('.e-movablecontent').offsetHeight - getScrollBarWidth() + 'px';
    },
    printGrid: function (element) {
        if (!sf.base.isNullOrUndefined(element) && !sf.base.isNullOrUndefined(element.blazor__instance)) {
            element.blazor__instance.print();
        }
    },
    updateMediaColumns: function (element, mediaColumnsUid) {
        if (!sf.base.isNullOrUndefined(element) && !sf.base.isNullOrUndefined(element.blazor__instance)) {
            element.blazor__instance.columnChooserModule.updateMediaColumns(mediaColumnsUid);
        }
    },
    copyToClipBoard: function (element, withHeader) {
        if (!sf.base.isNullOrUndefined(element) && !sf.base.isNullOrUndefined(element.blazor__instance)) {
            element.blazor__instance.clipboardModule.copy(withHeader);
        }
    }
};

return Grid;

}());
